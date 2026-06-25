import React from 'react';
import { MapScreenProps } from '../types';

/**
 * 산책 지도 코스 추천 화면 컴포넌트
 * @param props 오버레이 메뉴 및 홈 이동을 위한 핸들러
 * @returns 맵 경로 오버레이 및 산책 코스 정보 UI
 */
export const MapScreen: React.FC<MapScreenProps> = ({ openMenu, goHome }) => {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', animation: 'screenIn .28s ease' }}>
      
      {/* 백그라운드 모의 맵 (SVG 경로 드로잉) */}
      <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg, #D8E0D2 0 12px, #E2E8DC 12px 24px)' }}>
        <svg viewBox="0 0 414 844" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <path
            d="M80 210 C170 300 130 440 240 520 S300 700 180 760"
            fill="none"
            stroke="#C16A43"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>
        {/* 시작 & 종료 마커 */}
        <div
          style={{
            position: 'absolute',
            left: '64px',
            top: '194px',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: '#4C6B4E',
            border: '5px solid #fff',
            boxShadow: '0 2px 8px rgba(0,0,0,.25)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '166px',
            top: '746px',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: '#C16A43',
            border: '5px solid #fff',
            boxShadow: '0 2px 8px rgba(0,0,0,.25)',
          }}
        />
      </div>

      {/* 헤더 바 */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 18px 0' }}>
        <button
          onClick={openMenu}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '13px',
            background: '#FBF7EE',
            border: '1px solid #E6DECE',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
          }}
        >
          <span style={{ width: '17px', height: '2px', background: '#2E2A20', borderRadius: '2px' }} />
          <span style={{ width: '17px', height: '2px', background: '#2E2A20', borderRadius: '2px' }} />
          <span style={{ width: '17px', height: '2px', background: '#2E2A20', borderRadius: '2px' }} />
        </button>
        <div
          style={{
            background: '#FBF7EE',
            border: '1px solid #E6DECE',
            borderRadius: '13px',
            padding: '11px 18px',
            fontSize: '14px',
            fontWeight: 700,
            color: '#2E2A20',
          }}
        >
          산책 코스
        </div>
        <button
          onClick={goHome}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: '#FBF7EE',
            border: '1px solid #E6DECE',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ⌂
        </button>
      </div>

      {/* 현재 선택된 코스 위젯 */}
      <div style={{ position: 'relative', zIndex: 2, padding: '12px 18px 0' }}>
        <div style={{ background: '#2E2A20', borderRadius: '18px', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '13px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '13px',
              background: '#FBF7EE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2E2A20',
              fontFamily: "'Black Han Sans', sans-serif",
              fontSize: '15px',
            }}
          >
            2.4
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>한강 물길 산책</div>
            <div style={{ fontSize: '12px', color: '#C9BFA9', marginTop: '2px' }}>2.4km · 약 40분 · 보통</div>
          </div>
          <button
            style={{
              background: '#C16A43',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 700,
              padding: '9px 16px',
              borderRadius: '11px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            시작
          </button>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* 하단 코스 추천 리스트 드로어 */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          background: '#FBF7EE',
          borderRadius: '26px 26px 0 0',
          boxShadow: '0 -6px 22px rgba(0,0,0,.12)',
          padding: '16px 20px 24px',
        }}
      >
        <div style={{ width: '42px', height: '5px', borderRadius: '3px', background: '#D8CEBA', margin: '0 auto 14px' }} />
        <div style={{ fontFamily: "'Black Han Sans', sans-serif", fontSize: '18px', color: '#2E2A20', marginBottom: '12px' }}>
          추천 코스 <span style={{ color: '#C16A43' }}>12</span>
        </div>
        
        {/* 코스 1 */}
        <div style={{ display: 'flex', gap: '13px', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid #EFE8DA' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '13px',
              flexShrink: 0,
              background: 'repeating-linear-gradient(45deg, #DCD7C5 0 8px, #E6E1D0 8px 16px)',
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#2E2A20' }}>서울숲 둘레길</div>
            <div style={{ fontSize: '12px', color: '#948B79', marginTop: '2px' }}>1.2km · 쉬움 · 그늘 많음</div>
          </div>
          <div style={{ background: '#E4ECDF', color: '#4C6B4E', fontSize: '12px', fontWeight: 700, padding: '5px 9px', borderRadius: '8px' }}>
            ★4.8
          </div>
        </div>

        {/* 코스 2 */}
        <div style={{ display: 'flex', gap: '13px', alignItems: 'center', padding: '11px 0' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '13px',
              flexShrink: 0,
              background: 'repeating-linear-gradient(45deg, #DCD7C5 0 8px, #E6E1D0 8px 16px)',
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#2E2A20' }}>응봉산 전망 코스</div>
            <div style={{ fontSize: '12px', color: '#948B79', marginTop: '2px' }}>3.1km · 어려움 · 경사</div>
          </div>
          <div style={{ background: '#E4ECDF', color: '#4C6B4E', fontSize: '12px', fontWeight: 700, padding: '5px 9px', borderRadius: '8px' }}>
            ★4.5
          </div>
        </div>
      </div>
    </div>
  );
};
