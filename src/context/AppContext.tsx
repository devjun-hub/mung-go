'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DiaryEntry } from '../types';
import { getProfile, getDiaries } from '../lib/supabase/db';

// App Context 데이터 모델 인터페이스 정의
interface AppContextType {
  // --- 글로벌 뷰포트 상태 ---
  menu: boolean;
  setMenu: React.Dispatch<React.SetStateAction<boolean>>;
  loggedIn: boolean;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  signupStep: number;
  setSignupStep: React.Dispatch<React.SetStateAction<number>>;
  dogName: string;
  setDogName: React.Dispatch<React.SetStateAction<string>>;
  dogSize: string;
  setDogSize: React.Dispatch<React.SetStateAction<string>>;
  locationText: string;
  setLocationText: React.Dispatch<React.SetStateAction<string>>;

  // --- 일기 임시 작성 상태 ---
  draftEmoji: string;
  setDraftEmoji: React.Dispatch<React.SetStateAction<string>>;
  draftMood: string;
  setDraftMood: React.Dispatch<React.SetStateAction<string>>;
  draftText: string;
  setDraftText: React.Dispatch<React.SetStateAction<string>>;

  // --- 일기 리스트 피드 데이터 ---
  entries: DiaryEntry[];
  setEntries: React.Dispatch<React.SetStateAction<DiaryEntry[]>>;

  // --- 전역 동작 헬퍼 핸들러 ---
  openMenu: () => void;
  closeMenu: () => void;
  go: (path: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * 멍고 애플리케이션 전역 상태 제공자 컴포넌트
 * 라우팅과 컴포넌트가 격리되어도 데이터의 무결성과 영속성을 보장합니다.
 */
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();

  // --- 상태값 초기화 ---
  const [menu, setMenu] = useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [signupStep, setSignupStep] = useState<number>(0);
  const [dogName, setDogName] = useState<string>('');
  const [dogSize, setDogSize] = useState<string>('중형');
  const [locationText, setLocationText] = useState<string>('📍 서울 · 날씨 확인 중...');

  const [draftEmoji, setDraftEmoji] = useState<string>('');
  const [draftMood, setDraftMood] = useState<string>('');
  const [draftText, setDraftText] = useState<string>('');

  const [entries, setEntries] = useState<DiaryEntry[]>([
    { emoji: '🤩', mood: '신남', text: '서울숲에서 신나게 뛰어놀았다!', date: '6월 22일' },
    { emoji: '😌', mood: '편안', text: '한강 산책 후 곤히 잠들었어요', date: '6월 20일' },
  ]);

  // --- 사용자 기기 위치 정보 탐색 및 주소 변환 API 호출 ---
  useEffect(() => {
    const fetchWeatherAndAddress = async (lat: number, lon: number, isFallback = false) => {
      try {
        const res = await fetch('/api/location', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ latitude: lat, longitude: lon }),
        });

        if (res.ok) {
          const data = await res.json();
          const region = isFallback ? '서울' : data.regionName;
          setLocationText(`📍 ${region} · ${data.temperature}° ${data.weatherDescription} · ${data.walkRecommendation}`);
        } else {
          setLocationText('📍 서울 · 22° 맑음 · 산책하기 딱 좋은 날씨예요');
        }
      } catch (err) {
        console.error('Failed to resolve reverse-geocoded region and weather in context:', err);
        setLocationText('📍 서울 · 22° 맑음 · 산책하기 딱 좋은 날씨예요');
      }
    };

    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherAndAddress(latitude, longitude, false);
        },
        (error) => {
          console.warn('Geolocation permission denied or error in context:', error);
          fetchWeatherAndAddress(37.5665, 126.9780, true);
        }
      );
    } else {
      fetchWeatherAndAddress(37.5665, 126.9780, true);
    }
  }, []);

  // --- Supabase/LocalStorage 데이터 로드 ---
  useEffect(() => {
    const loadPersistedData = async () => {
      try {
        const profile = await getProfile();
        if (profile) {
          setDogName(profile.dogName);
          setDogSize(profile.dogSize);
        }
        const diaries = await getDiaries();
        setEntries(diaries);
      } catch (err) {
        console.error('Failed to load profile/diaries from DB wrapper:', err);
      }
    };
    loadPersistedData();
  }, []);

  // --- 비즈니스 로직 핸들러 ---
  const openMenu = () => setMenu(true);
  const closeMenu = () => setMenu(false);
  
  /**
   * 지정한 주소로 라우팅을 실행하고 사이드바 메뉴를 닫습니다.
   * @param path Next.js 라우트 경로 (예: '/travel')
   */
  const go = (path: string) => {
    setMenu(false);
    router.push(path);
  };

  return (
    <AppContext.Provider
      value={{
        menu,
        setMenu,
        loggedIn,
        setLoggedIn,
        signupStep,
        setSignupStep,
        dogName,
        setDogName,
        dogSize,
        setDogSize,
        locationText,
        setLocationText,
        draftEmoji,
        setDraftEmoji,
        draftMood,
        setDraftMood,
        draftText,
        setDraftText,
        entries,
        setEntries,
        openMenu,
        closeMenu,
        go,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

/**
 * 전역 앱 상태 및 액션 헬퍼를 가져오는 커스텀 훅
 */
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
