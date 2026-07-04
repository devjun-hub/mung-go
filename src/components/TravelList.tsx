'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { GlobalFooter } from './ClientLayout';
import { PlacePlaceholder } from './PlacePlaceholder';

interface Place {
  contentId: string;
  title: string;
  addr1: string;
  dist?: number;
  firstimage?: string;
  contentType?: string;
}

interface TravelListPageProps {
  goDetail: (contentId: string) => void;
}

const TABS = [
  { key: '전체',  label: '전체' },
  { key: '관광지', label: '🌿 관광지' },
  { key: '숙소',  label: '🏡 숙소' },
  { key: '카페',  label: '☕ 카페' },
  { key: '식당',  label: '🍽 식당' },
];

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

export const TravelList: React.FC<TravelListPageProps> = ({ goDetail }) => {
  const { openMenu } = useApp();
  const [activeTab, setActiveTab] = useState('전체');
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState<number | null>(null);
  const [imgOnly, setImgOnly] = useState(false);
  const geoRef = useRef<{ lat: number; lon: number } | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const buildUrl = useCallback((tab: string, p: number, pos?: { lat: number; lon: number }) => {
    const base = pos ?? geoRef.current ?? { lat: 37.5665, lon: 126.9780 };
    if (tab === '전체') {
      return `/api/places?lat=${base.lat}&lon=${base.lon}&page=${p}&limit=20`;
    }
    return `/api/places?lat=${base.lat}&lon=${base.lon}&category=${encodeURIComponent(tab)}&page=${p}&limit=20`;
  }, []);

  const fetchPlaces = useCallback(async (
    tab: string,
    p: number,
    append = false,
    pos?: { lat: number; lon: number }
  ) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    const { signal } = abortRef.current;

    if (append) setLoadingMore(true);
    else setLoading(true);
    setError(null);

    try {
      const url = buildUrl(tab, p, pos);
      const res = await fetch(url, { signal });
      if (!res.ok) throw new Error('장소 데이터를 불러오지 못했어요');
      const data: { places: Place[]; hasMore?: boolean; total?: number } = await res.json();
      const incoming = data.places ?? [];
      setPlaces(prev => append ? [...prev, ...incoming] : incoming);
      setHasMore(data.hasMore ?? false);
      if (data.total !== undefined) setTotal(data.total);
      setPage(p);
    } catch (e) {
      if ((e as Error).name === 'AbortError') return;
      setError(e instanceof Error ? e.message : '오류가 발생했어요');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [buildUrl]);

  // 최초 마운트: 서울 기본값으로 즉시 로딩 → GPS 확인 후 조용히 갱신
  useEffect(() => {
    fetchPlaces('전체', 1, false, { lat: 37.5665, lon: 126.9780 });

    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          geoRef.current = { lat: pos.coords.latitude, lon: pos.coords.longitude };
          if (activeTab === '전체') fetchPlaces('전체', 1, false, geoRef.current);
        },
        () => {},
        { timeout: 6000 }
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 탭 전환
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setPlaces([]);
    setHasMore(false);
    setTotal(null);
    fetchPlaces(tab, 1, false);
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) fetchPlaces(activeTab, page + 1, true);
  };

  const totalLabel = loading
    ? '확인 중...'
    : places.length === 0
    ? '결과 없음'
    : total !== null
    ? `전국 ${total}곳`
    : hasMore
    ? `${places.length}곳+`
    : `${places.length}곳`;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#F4EEE2' }}>

      {/* 헤더 */}
      <div style={{ background: '#FBF7EE', borderBottom: '1px solid #EFE8DA', padding: '0 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingTop: '18px', paddingBottom: '14px' }}>
          <button
            onClick={openMenu}
            style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'transparent', border: '1px solid #E6DECE', color: '#2E2A20', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >
            <MenuIcon />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#2E2A20', letterSpacing: '-0.3px' }}>
              반려견 동반 여행지
            </div>
            <div style={{ fontSize: '12px', color: '#948B79', marginTop: '1px' }}>
              {geoRef.current ? '내 위치 기준 거리순' : '서울 기준 거리순'} · {totalLabel}
            </div>
          </div>
        </div>

        {/* 탭 + 사진 필터 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingBottom: '14px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              style={{
                padding: '7px 14px', borderRadius: '999px', border: 'none',
                background: activeTab === tab.key ? '#4C6B4E' : '#EBE3D2',
                color: activeTab === tab.key ? '#FBF7EE' : '#6E6553',
                fontSize: '12px', fontWeight: activeTab === tab.key ? 700 : 400,
                whiteSpace: 'nowrap', cursor: 'pointer', flexShrink: 0,
                transition: 'background .15s, color .15s',
              }}
            >
              {tab.label}
            </button>
          ))}
          <div style={{ width: '1px', height: '20px', background: '#E6DECE', flexShrink: 0, marginLeft: '2px' }} />
          <button
            onClick={() => setImgOnly(v => !v)}
            style={{
              padding: '7px 12px', borderRadius: '999px', border: imgOnly ? 'none' : '1px solid #E6DECE',
              background: imgOnly ? '#C16A43' : '#FBF7EE',
              color: imgOnly ? '#fff' : '#6E6553',
              fontSize: '12px', fontWeight: imgOnly ? 700 : 400,
              whiteSpace: 'nowrap', cursor: 'pointer', flexShrink: 0,
              transition: 'background .15s, color .15s',
              display: 'flex', alignItems: 'center', gap: '4px',
            }}
          >
            📷 사진있는곳만
          </button>
        </div>
      </div>

      {/* 리스트 */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 18px 32px', flex: 1 }}>
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </div>
        )}

        {!loading && error && (
          <div style={{ textAlign: 'center', paddingTop: '60px' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>😢</div>
            <div style={{ color: '#B94040', fontSize: '14px', marginBottom: '16px' }}>{error}</div>
            <button
              onClick={() => fetchPlaces(activeTab, 1)}
              style={{ padding: '10px 20px', background: '#4C6B4E', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
            >
              다시 시도
            </button>
          </div>
        )}

        {!loading && !error && places.length === 0 && (
          <div style={{ textAlign: 'center', paddingTop: '60px' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>🐾</div>
            <div style={{ color: '#948B79', fontSize: '14px' }}>
              해당 카테고리의 장소가 없어요<br />
              <span style={{ fontSize: '12px', color: '#B8B0A0' }}>다른 카테고리를 확인해보세요</span>
            </div>
          </div>
        )}

        {!loading && !error && places.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {(imgOnly ? places.filter(p => !!p.firstimage) : places).map((place) => (
              <PlaceCard key={place.contentId} place={place} onClick={() => goDetail(place.contentId)} />
            ))}
            {imgOnly && places.filter(p => !!p.firstimage).length === 0 && (
              <div style={{ textAlign: 'center', paddingTop: '40px' }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>📷</div>
                <div style={{ color: '#948B79', fontSize: '13px' }}>사진 있는 장소가 없어요<br /><span style={{ fontSize: '11px', color: '#B8B0A0' }}>필터를 해제하거나 다른 카테고리를 확인해보세요</span></div>
              </div>
            )}

            {/* 더 보기 / 로딩 더 보기 */}
            {hasMore && (
              <button
                onClick={loadMore}
                disabled={loadingMore}
                style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1.5px dashed #D8CEBA', background: 'transparent', color: '#948B79', fontSize: '13px', fontWeight: 600, cursor: loadingMore ? 'not-allowed' : 'pointer', marginTop: '4px' }}
              >
                {loadingMore ? '불러오는 중...' : '더 보기 ↓'}
              </button>
            )}

            {!hasMore && places.length > 0 && (
              <div style={{ textAlign: 'center', fontSize: '12px', color: '#B8B0A0', padding: '16px 0' }}>
                전체 {places.length}곳 표시됨
              </div>
            )}
          </div>
        )}

        {loadingMore && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '14px' }}>
            {[1, 2].map(i => <SkeletonCard key={i} />)}
          </div>
        )}
      </div>
      <GlobalFooter />
    </div>
  </div>
  );
};

function PlaceCard({ place, onClick }: { place: Place; onClick: () => void }) {
  const [imgError, setImgError] = useState(false);
  const distText = place.dist !== undefined ? formatDist(place.dist) : '';
  const addr = place.addr1 ? place.addr1.split(' ').slice(0, 3).join(' ') : '';
  const hasImg = !!place.firstimage && !imgError;

  return (
    <div
      onClick={onClick}
      style={{ background: '#FBF7EE', border: '1px solid #E6DECE', borderRadius: '18px', overflow: 'hidden', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}
    >
      <div style={{ height: '160px', position: 'relative', background: '#DCD7C5', overflow: 'hidden' }}>
        {hasImg ? (
          <img
            src={place.firstimage}
            alt={place.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={() => setImgError(true)}
          />
        ) : (
          <PlacePlaceholder title={place.title} contentType={place.contentType} />
        )}
        <span style={{ position: 'absolute', left: '12px', top: '12px', background: '#4C6B4E', color: '#FBF7EE', fontSize: '10px', fontWeight: 700, padding: '4px 9px', borderRadius: '7px' }}>
          반려동물 동반
        </span>
        {distText && (
          <span style={{ position: 'absolute', right: '12px', top: '12px', background: 'rgba(46,42,32,.75)', color: '#fff', fontSize: '10px', padding: '4px 9px', borderRadius: '7px', backdropFilter: 'blur(4px)' }}>
            {distText}
          </span>
        )}
      </div>
      <div style={{ padding: '13px 15px' }}>
        <div style={{ fontSize: '15px', fontWeight: 700, color: '#2E2A20', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {place.title}
        </div>
        <div style={{ fontSize: '12px', color: '#948B79', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
          {addr}
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{ background: '#FBF7EE', border: '1px solid #E6DECE', borderRadius: '18px', overflow: 'hidden' }}>
      <div style={{ height: '160px', background: 'linear-gradient(90deg, #EBE3D2 25%, #F0EAE0 50%, #EBE3D2 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
      <div style={{ padding: '13px 15px' }}>
        <div style={{ height: '16px', width: '60%', background: '#EBE3D2', borderRadius: '6px', marginBottom: '8px' }} />
        <div style={{ height: '12px', width: '40%', background: '#EBE3D2', borderRadius: '4px' }} />
      </div>
    </div>
  );
}

function formatDist(m: number): string {
  if (m < 1000) return `${Math.round(m)}m`;
  return `${(m / 1000).toFixed(1)}km`;
}
