'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MapScreenProps } from '../types';

declare global {
  interface Window { kakao: KakaoMapsSDK; }
}
interface KakaoMapsSDK {
  maps: {
    load: (cb: () => void) => void;
    Map: new (el: HTMLElement, opts: object) => KMap;
    LatLng: new (lat: number, lng: number) => KLatLng;
    Marker: new (opts: { position: KLatLng; map?: KMap; title?: string; image?: unknown }) => KMarker;
    InfoWindow: new (opts: { content: string; removable?: boolean }) => KInfoWindow;
    Polyline: new (opts: object) => KPolyline;
    CustomOverlay: new (opts: object) => KOverlay;
    event: { addListener: (target: object, type: string, cb: () => void) => void };
  };
}
interface KMap {
  setCenter: (ll: KLatLng) => void;
  setLevel: (level: number) => void;
  getCenter: () => KLatLng;
}
interface KLatLng { getLat: () => number; getLng: () => number }
interface KMarker { setMap: (m: KMap | null) => void }
interface KInfoWindow { open: (m: KMap, mk: KMarker) => void; close: () => void }
interface KPolyline { setMap: (m: KMap | null) => void }
interface KOverlay { setMap: (m: KMap | null) => void }

interface NearPlace {
  contentId: string;
  title: string;
  addr1: string;
  mapX: number;
  mapY: number;
  dist?: number;
  firstimage?: string;
}

interface RouteData {
  distance: number;
  duration: number;
  coordinates: [number, number][];
  source: 'tmap' | 'osrm';
}

const SEARCH_RADIUS = 10000; // 10km

export const MapScreen: React.FC<MapScreenProps> = ({ openMenu, goHome }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<KMap | null>(null);
  const polylineRef = useRef<KPolyline | null>(null);
  const placeMarkersRef = useRef<KMarker[]>([]);
  const myOverlayRef = useRef<KOverlay | null>(null);
  const openInfoRef = useRef<KInfoWindow | null>(null);

  const [places, setPlaces] = useState<NearPlace[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<NearPlace | null>(null);
  const [route, setRoute] = useState<RouteData | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [userPos, setUserPos] = useState<{ lat: number; lon: number } | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [placesLoading, setPlacesLoading] = useState(true);
  const [locationLabel, setLocationLabel] = useState('위치 확인 중...');

  const fetchNearPlaces = useCallback(async (lat: number, lon: number) => {
    setPlacesLoading(true);
    try {
      const res = await fetch(`/api/places?lat=${lat}&lon=${lon}&radius=${SEARCH_RADIUS}`);
      if (res.ok) {
        const data: { places: NearPlace[] } = await res.json();
        setPlaces(data.places ?? []);
      }
    } catch (e) {
      console.error('places fetch:', e);
    } finally {
      setPlacesLoading(false);
    }
  }, []);

  /** 현재 위치 마커(파란 점) + 지도 중심 이동 */
  const moveToPosition = useCallback((lat: number, lon: number) => {
    if (!mapRef.current || !window.kakao?.maps) return;
    const map = mapRef.current;
    const ll = new window.kakao.maps.LatLng(lat, lon);
    map.setCenter(ll);
    map.setLevel(5);

    if (myOverlayRef.current) myOverlayRef.current.setMap(null);
    const overlay = new window.kakao.maps.CustomOverlay({
      position: ll,
      content: `<div style="width:20px;height:20px;border-radius:50%;background:#3B8FF3;border:3px solid #fff;box-shadow:0 2px 10px rgba(59,143,243,.7);transform:translate(-50%,-50%)"></div>`,
      zIndex: 10,
    });
    overlay.setMap(map);
    myOverlayRef.current = overlay;
  }, []);

  const initMap = useCallback(() => {
    window.kakao.maps.load(() => {
      if (!mapContainerRef.current) return;
      const defaultLL = new window.kakao.maps.LatLng(37.5665, 126.9780);
      const map = new window.kakao.maps.Map(mapContainerRef.current, { center: defaultLL, level: 5 });
      mapRef.current = map;
      setMapReady(true);

      if (!navigator.geolocation) {
        setLocationLabel('서울 기준');
        fetchNearPlaces(37.5665, 126.9780);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude: lat, longitude: lon } = pos.coords;
          setUserPos({ lat, lon });
          moveToPosition(lat, lon);
          // 주소 간략 표시
          setLocationLabel(`${lat.toFixed(4)}, ${lon.toFixed(4)}`);
          fetchNearPlaces(lat, lon);
        },
        () => {
          setLocationLabel('서울 기준');
          fetchNearPlaces(37.5665, 126.9780);
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    });
  }, [fetchNearPlaces, moveToPosition]);

  // 카카오 맵 SDK 로드
  useEffect(() => {
    const jsKey = process.env.NEXT_PUBLIC_KAKAO_MAP_JS_KEY;
    if (!jsKey) {
      setMapReady(true);
      setPlacesLoading(false);
      return;
    }
    const scriptId = 'kakao-map-sdk';
    if (document.getElementById(scriptId)) {
      if (window.kakao && window.kakao.maps) initMap();
      else document.getElementById(scriptId)!.addEventListener('load', initMap, { once: true });
    } else {
      const s = document.createElement('script');
      s.id = scriptId;
      s.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${jsKey}&autoload=false`;
      s.async = true;
      s.onload = initMap;
      document.head.appendChild(s);
    }
  }, [initMap]);

  // 장소 마커 렌더링
  useEffect(() => {
    if (!mapReady || !mapRef.current || !window.kakao?.maps) return;
    const map = mapRef.current;

    placeMarkersRef.current.forEach(m => m.setMap(null));
    placeMarkersRef.current = [];
    if (openInfoRef.current) { openInfoRef.current.close(); openInfoRef.current = null; }

    places.forEach((place) => {
      if (!place.mapX || !place.mapY) return;
      const ll = new window.kakao.maps.LatLng(place.mapY, place.mapX);
      const marker = new window.kakao.maps.Marker({ position: ll, map });
      placeMarkersRef.current.push(marker);

      const iw = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:7px 11px;font-size:12px;font-weight:700;max-width:190px;line-height:1.4;white-space:nowrap;border-radius:8px">${place.title}<br><span style="font-weight:400;color:#948B79;font-size:11px">${place.addr1?.split(' ').slice(0, 2).join(' ')}${place.dist ? ' · ' + fmt.dist(place.dist) : ''}</span></div>`,
        removable: true,
      });

      window.kakao.maps.event.addListener(marker, 'click', () => {
        if (openInfoRef.current) openInfoRef.current.close();
        iw.open(map, marker);
        openInfoRef.current = iw;
        setSelectedPlace(place);
      });
    });
  }, [mapReady, places]);

  // 경로 그리기
  const drawRoute = useCallback(async (dest: NearPlace) => {
    if (!userPos || !mapRef.current || !window.kakao?.maps) return;
    setRouteLoading(true);
    setRoute(null);

    try {
      const res = await fetch(
        `/api/route?startLat=${userPos.lat}&startLon=${userPos.lon}&endLat=${dest.mapY}&endLon=${dest.mapX}`
      );
      if (!res.ok) throw new Error('경로 오류');
      const data: RouteData = await res.json();
      setRoute(data);

      if (polylineRef.current) { polylineRef.current.setMap(null); polylineRef.current = null; }
      const path = data.coordinates.map(([lon, lat]) => new window.kakao.maps.LatLng(lat, lon));
      const poly = new window.kakao.maps.Polyline({
        path, strokeWeight: 5, strokeColor: '#C16A43', strokeOpacity: 0.9, strokeStyle: 'solid',
      });
      poly.setMap(mapRef.current!);
      polylineRef.current = poly;
    } catch (e) {
      console.error('route error:', e);
    } finally {
      setRouteLoading(false);
    }
  }, [userPos]);

  const recenter = useCallback(() => {
    if (userPos) moveToPosition(userPos.lat, userPos.lon);
  }, [userPos, moveToPosition]);

  const fmt = {
    dist: (m: number) => m < 1000 ? `${m}m` : `${(m / 1000).toFixed(1)}km`,
    time: (s: number) => s < 60 ? `${s}초` : `${Math.round(s / 60)}분`,
  };

  const nearCount = places.filter(p => (p.dist ?? 0) <= SEARCH_RADIUS).length;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', background: '#E8EEE2' }}>

      {/* 지도 컨테이너 */}
      <div ref={mapContainerRef} style={{ position: 'absolute', inset: 0 }} />

      {/* 지도 미로드 시 배경 */}
      {!mapReady && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 5, background: '#E8EEE2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '4px solid #4C6B4E', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
          <div style={{ fontSize: '13px', color: '#4C6B4E', fontWeight: 600 }}>지도 불러오는 중...</div>
        </div>
      )}

      {/* ── 상단 헤더 ── */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 16px 0' }}>
        {/* 메뉴 */}
        <button onClick={openMenu} style={btnStyle}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* 타이틀 칩 */}
        <div style={{ flex: 1, background: '#FBF7EE', border: '1px solid #E6DECE', borderRadius: '14px', padding: '10px 14px', boxShadow: '0 2px 8px rgba(0,0,0,.08)' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#2E2A20' }}>🐾 주변 반려견 동반 장소</div>
          <div style={{ fontSize: '11px', color: '#948B79', marginTop: '1px' }}>
            {placesLoading
              ? '장소 확인 중...'
              : nearCount > 0
              ? `10km 이내 ${nearCount}곳 · 전체 ${places.length}곳 표시`
              : places.length > 0
              ? `가까운 순 ${places.length}곳 표시 (10km 이내 없음)`
              : '주변 장소 없음'}
          </div>
        </div>

        {/* 홈 */}
        <button onClick={goHome} style={btnStyle}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </button>
      </div>

      {/* ── 선택된 장소 카드 ── */}
      {selectedPlace && (
        <div style={{ position: 'relative', zIndex: 10, padding: '10px 16px 0' }}>
          <div style={{ background: '#2E2A20', borderRadius: '18px', padding: '13px 15px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 4px 16px rgba(0,0,0,.2)' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {selectedPlace.title}
              </div>
              <div style={{ color: '#C9BFA9', fontSize: '11px', marginTop: '2px' }}>
                {selectedPlace.addr1?.split(' ').slice(0, 2).join(' ')}
                {selectedPlace.dist !== undefined ? ` · ${fmt.dist(selectedPlace.dist)}` : ''}
                {route ? ` · 도보 ${fmt.time(route.duration)}` : ''}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <button
                onClick={() => drawRoute(selectedPlace)}
                disabled={routeLoading || !userPos}
                style={{ background: !userPos ? '#666' : routeLoading ? '#555' : '#C16A43', color: '#fff', fontSize: '12px', fontWeight: 700, padding: '8px 13px', borderRadius: '10px', border: 'none', cursor: !userPos || routeLoading ? 'not-allowed' : 'pointer' }}
              >
                {routeLoading ? '계산 중' : '경로'}
              </button>
              <button onClick={() => { setSelectedPlace(null); setRoute(null); if (polylineRef.current) { polylineRef.current.setMap(null); polylineRef.current = null; } }} style={{ background: 'rgba(255,255,255,.12)', color: '#C9BFA9', fontSize: '11px', padding: '8px 10px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ flex: 1 }} />

      {/* ── 우측 플로팅 버튼 ── */}
      <div style={{ position: 'absolute', right: '16px', bottom: '290px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {userPos && (
          <button onClick={recenter} title="내 위치로" style={{ ...btnStyle, boxShadow: '0 2px 10px rgba(0,0,0,.15)' }}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#3B8FF3" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /><circle cx="12" cy="12" r="9" strokeDasharray="4 2" />
            </svg>
          </button>
        )}
      </div>

      {/* ── 하단 장소 드로어 ── */}
      <div style={{ position: 'relative', zIndex: 10, background: '#FBF7EE', borderRadius: '24px 24px 0 0', boxShadow: '0 -6px 24px rgba(0,0,0,.12)', maxHeight: '260px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '12px 20px 0', flexShrink: 0 }}>
          <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: '#D8CEBA', margin: '0 auto 12px' }} />

          {/* 안내 배너 (장소 없을 때) */}
          {!placesLoading && places.length === 0 && (
            <div style={{ background: '#F0EDE5', borderRadius: '12px', padding: '12px 14px', marginBottom: '10px', fontSize: '12px', color: '#6E6553', lineHeight: 1.6 }}>
              <strong>산책 지도 사용법</strong><br />
              마커를 탭하면 장소 정보가 표시돼요.<br />
              <span style={{ color: '#C16A43', fontWeight: 600 }}>경로 버튼</span>을 누르면 보행자 경로가 지도에 그려집니다.
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '2px' }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#2E2A20' }}>반려견 동반 가능 장소</span>
            <span style={{ fontSize: '13px', color: '#C16A43', fontWeight: 700 }}>
              {placesLoading ? '...' : places.length}
            </span>
            {!placesLoading && nearCount < places.length && (
              <span style={{ fontSize: '11px', color: '#948B79' }}>(10km 이내 {nearCount}곳)</span>
            )}
          </div>
        </div>

        <div style={{ overflowY: 'auto', padding: '8px 20px 24px', flex: 1 }}>
          {placesLoading && (
            <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
              {[1, 2].map(i => (
                <div key={i} style={{ width: '120px', height: '60px', background: 'linear-gradient(90deg,#EBE3D2 25%,#F0EAE0 50%,#EBE3D2 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite', borderRadius: '12px', flexShrink: 0 }} />
              ))}
            </div>
          )}

          {!placesLoading && places.length === 0 && (
            <div style={{ fontSize: '13px', color: '#948B79', paddingTop: '4px' }}>
              주변 등록 장소가 없어요. 여행지 탭에서 전국 장소를 확인해보세요.
            </div>
          )}

          {!placesLoading && places.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              {places.map((place) => (
                <PlaceRow
                  key={place.contentId}
                  place={place}
                  selected={selectedPlace?.contentId === place.contentId}
                  fmt={fmt}
                  onClick={() => {
                    setSelectedPlace(place);
                    if (mapRef.current && window.kakao?.maps) {
                      mapRef.current.setCenter(new window.kakao.maps.LatLng(place.mapY, place.mapX));
                    }
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const btnStyle: React.CSSProperties = {
  width: '42px', height: '42px', borderRadius: '13px',
  background: '#FBF7EE', border: '1px solid #E6DECE',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', flexShrink: 0,
  boxShadow: '0 2px 8px rgba(0,0,0,.08)',
  color: '#2E2A20',
};

function PlaceRow({
  place, selected, fmt, onClick,
}: {
  place: NearPlace;
  selected: boolean;
  fmt: { dist: (m: number) => string };
  onClick: () => void;
}) {
  const [imgErr, setImgErr] = useState(false);
  const isNear = (place.dist ?? 0) <= 10000;

  return (
    <div
      onClick={onClick}
      style={{ display: 'flex', gap: '11px', alignItems: 'center', padding: '10px 8px', borderBottom: '1px solid #EFE8DA', cursor: 'pointer', borderRadius: '10px', background: selected ? '#F0EDE5' : 'transparent', transition: 'background .1s' }}
    >
      {/* 썸네일 */}
      <div style={{ width: '46px', height: '46px', borderRadius: '11px', flexShrink: 0, overflow: 'hidden', background: '#DDD8CA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {place.firstimage && !imgErr
          ? <img src={place.firstimage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setImgErr(true)} />
          : <span style={{ fontSize: '18px', opacity: 0.5 }}>🐾</span>}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#2E2A20', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {place.title}
        </div>
        <div style={{ fontSize: '11px', color: '#948B79', marginTop: '2px', display: 'flex', gap: '4px', alignItems: 'center' }}>
          <span>{place.addr1?.split(' ').slice(0, 2).join(' ')}</span>
          {place.dist !== undefined && (
            <span style={{ color: isNear ? '#4C6B4E' : '#C16A43', fontWeight: 600 }}>· {fmt.dist(place.dist)}</span>
          )}
        </div>
      </div>

      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#C9BFA9" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
    </div>
  );
}
