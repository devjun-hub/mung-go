'use client';

import React from 'react';
import { useApp } from '../../../context/AppContext';
import { SignupWizard } from '../../../components/SignupWizard';
import { saveProfile } from '../../../lib/supabase/db';

/**
 * 회원가입 및 온보딩 마법사 라우트 페이지
 * 경로: /signup
 */
export default function SignupPage() {
  const {
    signupStep,
    setSignupStep,
    dogName,
    setDogName,
    dogSize,
    setDogSize,
    setLoggedIn,
    go,
  } = useApp();

  const activeDogName = dogName || '우리 강아지';

  // --- 가입 단계 제어 헬퍼 ---
  const handleSignupNext = () => {
    setSignupStep(prev => Math.min(2, prev + 1));
  };

  const handleSignupBack = () => {
    if (signupStep > 0) {
      setSignupStep(prev => prev - 1);
    } else {
      go('/');
    }
  };

  const handleFinishSignup = () => {
    // 프로필 정보 데이터베이스 영속성 저장 (비동기 수행)
    saveProfile(dogName, dogSize);
    
    setLoggedIn(true);
    setSignupStep(0);
    go('/'); // 가입 완료 시 홈으로 이동
  };

  // --- 온보딩 마법사 반려견 크기 칩 옵션 구성 ---
  const sizeOptions = ['소형', '중형', '대형'].map(sz => {
    const isActive = dogSize === sz;
    return {
      label: sz,
      pick: () => setDogSize(sz),
      box: {
        flex: '1',
        height: '48px',
        borderRadius: '13px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: isActive ? ('700' as const) : ('500' as const),
        background: isActive ? '#4C6B4E' : '#FBF7EE',
        color: isActive ? '#FBF7EE' : '#6E6553',
        border: isActive ? 'none' : '1.5px solid #E6DECE',
      },
    };
  });

  // --- 온보딩 마법사 도트 인디케이터 스타일 ---
  const dotStyle = (isActive: boolean): React.CSSProperties => ({
    width: isActive ? '22px' : '8px',
    height: '8px',
    borderRadius: '4px',
    background: isActive ? '#C16A43' : '#D8CEBA',
    display: 'inline-block',
    transition: 'all .2s',
  });

  return (
    <SignupWizard
      signupStep={signupStep}
      welcomeLine={`${activeDogName}와의 산책을 기록해요.`}
      dogName={dogName}
      dot0={dotStyle(signupStep === 0)}
      dot1={dotStyle(signupStep === 1)}
      dot2={dotStyle(signupStep === 2)}
      sizeOptions={sizeOptions}
      onDogName={(e) => setDogName(e.target.value)}
      signupNext={handleSignupNext}
      signupBack={handleSignupBack}
      finishSignup={handleFinishSignup}
      goHome={() => go('/')}
    />
  );
}
