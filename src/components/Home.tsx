'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { HomeProps } from '../types';
import { GlobalFooter } from './ClientLayout';
import { PlacePlaceholder } from './PlacePlaceholder';

interface Place {
  contentId: string;
  title: string;
  addr1: string;
  dist?: number;
  firstimage?: string;
  source?: string;
  contentType?: string;
}

const GRADE_COLOR: Record<string, string> = {
  excellent: '#4C6B4E',
  good: '#5C8A5F',
  caution: '#C1873A',
  bad: '#B94040',
};

/** 오늘 날짜 기반 시드 난수 (매일 다른 추천) */
function dailySeed(): number {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}
function seededRandom(seed: number, idx: number): number {
  const x = Math.sin(seed + idx) * 10000;
  return x - Math.floor(x);
}
function pickRandom<T>(arr: T[], seed: number, count: number): T[] {
  if (arr.length === 0) return [];
  const shuffled = [...arr].sort((_, __, ) => seededRandom(seed, Math.random() * 999) - 0.5);
  return shuffled.slice(0, count);
}

export const Home: React.FC<HomeProps> = ({
  loggedIn, dogName, locationText, walkIndex, walkIndexLoading,
  goWrite, goMap, goDetail, goTravel, goAccount, openMenu,
}) => {
  const router = useRouter();
  const [nearbyPlaces, setNearbyPlaces] = useState<Place[]>([]);
  const [randomPlaces, setRandomPlaces] = useState<Place[]>([]);
  const [placesLoading, setPlacesLoading] = useState(true);

  const fetchPlaces = useCallback(async (lat: number, lon: number) => {
    try {
      // 근처 30곳 (거리순)
      const res = await fetch(`/api/places?lat=${lat}&lon=${lon}&page=1&limit=30`);
      if (res.ok) {
        const data: { places: Place[] } = await res.json();
        setNearbyPlaces(data.places ?? []);
      }
      // 랜덤 추천: 전국 중 이미지 있는 것 위주 (페이지 랜덤 선택)
      const randPage = (dailySeed() % 10) + 1;
      const res2 = await fetch(`/api/places?lat=${lat}&lon=${lon}&page=${randPage}&limit=30`);
      if (res2.ok) {
        const data2: { places: Place[] } = await res2.json();
        const withImg = (data2.places ?? []).filter(p => p.firstimage);
        setRandomPlaces(withImg.length >= 3 ? withImg : (data2.places ?? []));
      }
    } catch (e) {
      console.error('home places fetch:', e);
    } finally {
      setPlacesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchPlaces(pos.coords.latitude, pos.coords.longitude),
        () => fetchPlaces(37.5665, 126.9780),
        { timeout: 5000 }
      );
    } else {
      fetchPlaces(37.5665, 126.9780);
    }
  }, [fetchPlaces]);

  const seed = dailySeed();

  // 이미지 있는 것 우선 정렬
  const withImg = nearbyPlaces.filter(p => p.firstimage);
  const all = nearbyPlaces;

  // 주변 산책 추천: 이미지 있는 곳 중 첫 번째
  const featuredWalk = withImg[0] ?? all[0] ?? null;

  // 반려견 동반 여행지: 이미지 있는 2~4번째
  const travelPicks = withImg.slice(1, 3).length >= 2
    ? withImg.slice(1, 3)
    : all.slice(1, 3);

  // 오늘의 랜덤 추천 (randomPlaces에서 3개)
  const todayPicks = pickRandom(randomPlaces, seed, 3);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', animation: 'screenIn .28s ease' }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px 10px' }}>
        <button onClick={openMenu} style={{ width: '42px', height: '42px', borderRadius: '13px', background: '#FBF7EE', border: '1px solid #E6DECE', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
          {[0,1,2].map(i => <span key={i} style={{ width: '17px', height: '2px', background: '#2E2A20', borderRadius: '2px' }} />)}
        </button>
        <div onClick={() => router.push('/')} style={{ fontFamily: "'Black Han Sans', sans-serif", fontSize: '23px', color: '#2E2A20', cursor: 'pointer' }}>MungGo</div>
        <button onClick={goAccount} style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'repeating-linear-gradient(45deg, #DCD7C5 0 6px, #E6E1D0 6px 12px)', border: '1px solid #E6DECE', cursor: 'pointer' }} />
      </div>

      {/* 스크롤 본문 */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '0 20px 32px' }}>

        {/* 위치 + 타이틀 */}
        <div style={{ fontSize: '12px', color: '#4C6B4E', fontWeight: 700, letterSpacing: '.3px', marginTop: '4px' }}>
          {locationText}
        </div>
        <div style={{ fontFamily: "'Black Han Sans', sans-serif", fontSize: '34px', color: '#2E2A20', marginTop: '7px', lineHeight: 1.05, letterSpacing: '-.5px' }}>
          오늘은<br /><span style={{ color: '#C16A43' }}>멍산책</span> 가볼까요?
        </div>

        {/* 검색창 */}
        <div onClick={goTravel} style={{ marginTop: '16px', background: '#FBF7EE', border: '1.5px solid #E6DECE', borderRadius: '15px', padding: '13px 16px', display: 'flex', alignItems: 'center', gap: '9px', color: '#A89F8C', fontSize: '14px', cursor: 'pointer' }}>
          🔍 여행지·산책코스 검색
        </div>

        {/* 산책지수 카드 */}
        <div style={{ marginTop: '14px', background: walkIndex ? GRADE_COLOR[walkIndex.grade] : '#EBE3D2', borderRadius: '18px', padding: '16px 18px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
          {walkIndexLoading || !walkIndex ? (
            <div style={{ fontSize: '13px', color: walkIndex ? '#fff' : '#948B79', opacity: 0.8 }}>
              {walkIndexLoading ? '산책지수 계산 중...' : '위치 허용 시 산책지수를 확인해요'}
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Black Han Sans', sans-serif", fontSize: '22px', color: '#fff', flexShrink: 0 }}>
                  {walkIndex.score}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '11px', opacity: 0.75, letterSpacing: '.5px', fontWeight: 600 }}>오늘 산책지수</div>
                  <div style={{ fontFamily: "'Black Han Sans', sans-serif", fontSize: '18px', marginTop: '2px' }}>{walkIndex.label}</div>
                  {walkIndex.temperature !== undefined && (
                    <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '3px' }}>기온 {walkIndex.temperature}° · PM2.5 {walkIndex.pm25 ?? '-'}㎍/㎥</div>
                  )}
                </div>
                <div style={{ fontSize: '28px' }}>
                  {walkIndex.grade === 'excellent' ? '🐾' : walkIndex.grade === 'good' ? '🐕' : walkIndex.grade === 'caution' ? '⚠️' : '🏠'}
                </div>
              </div>
              {walkIndex.warnings.length > 0 && (
                <div style={{ marginTop: '10px', padding: '8px 12px', background: 'rgba(0,0,0,0.18)', borderRadius: '10px', fontSize: '11px', lineHeight: '1.6' }}>
                  {walkIndex.warnings.map((w, i) => <div key={i}>• {w}</div>)}
                </div>
              )}
            </>
          )}
        </div>

        {/* 일기 배너 (로그인 시) */}
        {loggedIn && (
          <div onClick={goWrite} style={{ marginTop: '14px', background: '#2E2A20', borderRadius: '16px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <div style={{ fontSize: '24px' }}>🐶</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#fff', fontSize: '14px', fontWeight: 700 }}>{dogName}의 오늘 기분은?</div>
              <div style={{ color: '#C9BFA9', fontSize: '12px', marginTop: '1px' }}>감정 일기를 남겨보세요</div>
            </div>
            <div style={{ color: '#FFC8A8', fontSize: '18px' }}>›</div>
          </div>
        )}

        {/* 홍보 알림 배너 (로그인 시) */}
        {loggedIn && (
          <div style={{ 
            marginTop: '14px', 
            background: 'linear-gradient(135deg, #E4ECDF 0%, #D8E6D0 100%)', 
            border: '1px solid #C2D9BD', 
            borderRadius: '16px', 
            padding: '14px 16px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px' 
          }}>
            <div style={{ fontSize: '24px' }}>📢</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#2E2A20', fontSize: '13px', fontWeight: 700 }}>이웃과 산책을 나눠요!</div>
              <div style={{ color: '#4A4538', fontSize: '11px', marginTop: '3px', lineHeight: 1.45 }}>
                MungGo에서는 소중한 <strong>반려견 일기</strong>를 기록할 수 있을 뿐만 아니라, <strong>같이 산책할 동네 친구</strong>를 모집할 수 있어요. 🐾
              </div>
            </div>
          </div>
        )}

        {/* ── 주변 산책 추천 ── */}
        <SectionHeader title="주변 산책 추천" action="지도 보기 ›" onAction={goMap} />

        {placesLoading ? (
          <SkeletonBanner />
        ) : featuredWalk ? (
          <FeaturedBanner place={featuredWalk} onClick={() => goDetail(featuredWalk.contentId)} />
        ) : (
          <div onClick={goMap} style={{ marginTop: '12px', height: '160px', borderRadius: '20px', background: '#E8EEE2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
            <span style={{ fontSize: '28px' }}>🗺</span>
            <span style={{ fontSize: '13px', color: '#4C6B4E', fontWeight: 600 }}>지도에서 주변 장소 찾기</span>
          </div>
        )}

        {/* ── 반려견 동반 여행지 ── */}
        <SectionHeader title="반려견 동반 여행지" action="더 보기 ›" onAction={goTravel} />

        {placesLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '11px', marginTop: '13px' }}>
            <SkeletonRow /><SkeletonRow />
          </div>
        ) : travelPicks.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '11px', marginTop: '13px' }}>
            {travelPicks.map(p => (
              <TravelRow key={p.contentId} place={p} onClick={() => goDetail(p.contentId)} />
            ))}
          </div>
        ) : (
          <div onClick={goTravel} style={{ marginTop: '13px', padding: '20px', background: '#FBF7EE', border: '1px solid #E6DECE', borderRadius: '18px', textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ fontSize: '13px', color: '#948B79' }}>전국 반려견 동반 여행지 보기 →</div>
          </div>
        )}

        {/* ── 오늘은 이런 곳 어때요? ── */}
        <SectionHeader title="오늘은 이런 곳 어때요?" action="전체 보기 ›" onAction={goTravel} />

        {placesLoading ? (
          <div style={{ display: 'flex', gap: '12px', marginTop: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
            {[1,2,3].map(i => <SkeletonHCard key={i} />)}
          </div>
        ) : todayPicks.length > 0 ? (
          <div style={{ display: 'flex', gap: '12px', marginTop: '12px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
            {todayPicks.map(p => (
              <TodayCard key={p.contentId} place={p} onClick={() => goDetail(p.contentId)} />
            ))}
          </div>
        ) : (
          <div style={{ marginTop: '12px', padding: '16px', background: '#FBF7EE', border: '1px solid #E6DECE', borderRadius: '16px', fontSize: '13px', color: '#948B79', textAlign: 'center' }}>
            곧 추천 여행지가 업데이트돼요 🐾
          </div>
        )}


        </div>
        <GlobalFooter />
      </div>
    </div>
  );
};

// ── 서브 컴포넌트 ──

function SectionHeader({ title, action, onAction }: { title: string; action: string; onAction: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: '24px' }}>
      <div style={{ fontFamily: "'Black Han Sans', sans-serif", fontSize: '19px', color: '#2E2A20' }}>{title}</div>
      <span onClick={onAction} style={{ fontSize: '12px', color: '#948B79', cursor: 'pointer' }}>{action}</span>
    </div>
  );
}

function FeaturedBanner({ place, onClick }: { place: Place; onClick: () => void }) {
  const [imgErr, setImgErr] = useState(false);
  const addr = place.addr1?.split(' ').slice(0, 2).join(' ') ?? '';
  const distText = place.dist !== undefined
    ? place.dist < 1000 ? `${place.dist}m` : `${(place.dist / 1000).toFixed(1)}km`
    : '';
  const hasImg = !!place.firstimage && !imgErr;

  return (
    <div onClick={onClick} style={{ marginTop: '12px', position: 'relative', borderRadius: '20px', overflow: 'hidden', height: '170px', background: '#DCD7C5', cursor: 'pointer' }}>
      {hasImg ? (
        <img src={place.firstimage} alt={place.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setImgErr(true)} />
      ) : (
        <PlacePlaceholder title={place.title} contentType={place.contentType} />
      )}
      <div style={{ position: 'absolute', left: '14px', top: '14px', background: '#4C6B4E', color: '#FBF7EE', fontSize: '11px', fontWeight: 700, padding: '5px 11px', borderRadius: '8px' }}>
        오늘의 추천
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '16px', background: 'linear-gradient(transparent, rgba(46,42,32,.85))' }}>
        <div style={{ color: '#fff', fontFamily: "'Black Han Sans', sans-serif", fontSize: '18px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {place.title}
        </div>
        <div style={{ color: '#EBE3D2', fontSize: '12px', fontWeight: 500, marginTop: '2px' }}>
          {addr}{distText ? ` · ${distText}` : ''}
        </div>
      </div>
    </div>
  );
}

function TravelRow({ place, onClick }: { place: Place; onClick: () => void }) {
  const [imgErr, setImgErr] = useState(false);
  const addr = place.addr1?.split(' ').slice(0, 2).join(' ') ?? '';
  const distText = place.dist !== undefined
    ? place.dist < 1000 ? `${place.dist}m` : `${(place.dist / 1000).toFixed(1)}km`
    : '';
  const hasImg = !!place.firstimage && !imgErr;
  const tag = place.source === 'kakao_local' ? '반려동물 동반' : '동반 여행지';

  return (
    <div onClick={onClick} style={{ display: 'flex', gap: '13px', background: '#FBF7EE', border: '1px solid #E6DECE', borderRadius: '18px', padding: '12px', cursor: 'pointer' }}>
      <div style={{ width: '84px', height: '84px', borderRadius: '14px', flexShrink: 0, overflow: 'hidden', background: '#DCD7C5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {hasImg ? (
          <img src={place.firstimage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setImgErr(true)} />
        ) : (
          <PlacePlaceholder title={place.title} contentType={place.contentType} />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: '15px', fontWeight: 700, color: '#2E2A20', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{place.title}</div>
        <div style={{ fontSize: '12px', color: '#948B79', marginTop: '3px' }}>
          {addr}{distText ? ` · ${distText}` : ''}
        </div>
        <div style={{ display: 'flex', gap: '5px', marginTop: '9px' }}>
          <span style={{ fontSize: '10px', padding: '3px 9px', background: '#E4ECDF', color: '#4C6B4E', borderRadius: '7px', fontWeight: 600 }}>{tag}</span>
        </div>
      </div>
    </div>
  );
}

function TodayCard({ place, onClick }: { place: Place; onClick: () => void }) {
  const [imgErr, setImgErr] = useState(false);
  const addr = place.addr1?.split(' ').slice(0, 2).join(' ') ?? '';
  const hasImg = !!place.firstimage && !imgErr;

  return (
    <div onClick={onClick} style={{ flexShrink: 0, width: '150px', borderRadius: '16px', overflow: 'hidden', background: '#FBF7EE', border: '1px solid #E6DECE', cursor: 'pointer' }}>
      <div style={{ height: '110px', background: '#DCD7C5', overflow: 'hidden', position: 'relative' }}>
        {hasImg ? (
          <img src={place.firstimage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setImgErr(true)} />
        ) : (
          <PlacePlaceholder title={place.title} contentType={place.contentType} />
        )}
        <div style={{ position: 'absolute', bottom: '7px', left: '8px', background: 'rgba(76,107,78,.9)', color: '#FBF7EE', fontSize: '9px', fontWeight: 700, padding: '2px 7px', borderRadius: '5px' }}>
          추천
        </div>
      </div>
      <div style={{ padding: '9px 10px' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#2E2A20', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{place.title}</div>
        <div style={{ fontSize: '10px', color: '#948B79', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{addr}</div>
      </div>
    </div>
  );
}

function SkeletonBanner() {
  return <div style={{ marginTop: '12px', height: '170px', borderRadius: '20px', background: 'linear-gradient(90deg,#EBE3D2 25%,#F0EAE0 50%,#EBE3D2 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />;
}
function SkeletonRow() {
  return (
    <div style={{ display: 'flex', gap: '13px', background: '#FBF7EE', border: '1px solid #E6DECE', borderRadius: '18px', padding: '12px' }}>
      <div style={{ width: '84px', height: '84px', borderRadius: '14px', flexShrink: 0, background: 'linear-gradient(90deg,#EBE3D2 25%,#F0EAE0 50%,#EBE3D2 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px' }}>
        <div style={{ height: '15px', width: '70%', background: '#EBE3D2', borderRadius: '5px' }} />
        <div style={{ height: '12px', width: '50%', background: '#EBE3D2', borderRadius: '5px' }} />
      </div>
    </div>
  );
}
function SkeletonHCard() {
  return <div style={{ flexShrink: 0, width: '150px', height: '155px', borderRadius: '16px', background: 'linear-gradient(90deg,#EBE3D2 25%,#F0EAE0 50%,#EBE3D2 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />;
}
