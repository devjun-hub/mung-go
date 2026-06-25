import React from 'react';
import { TravelListProps } from '../types';

/**
 * 반려견 동반 여행지 리스트 컴포넌트
 * @param props 네비게이션 콜백 함수들
 * @returns 반려견 동반 장소 목록 UI
 */
export const TravelList: React.FC<TravelListProps> = ({ goHome, goDetail }) => {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', animation: 'screenIn .28s ease' }}>
      {/* 상단 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '18px 18px 12px' }}>
        <button
          onClick={goHome}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#FBF7EE',
            border: '1px solid #E6DECE',
            fontSize: '18px',
            color: '#2E2A20',
            cursor: 'pointer',
          }}
        >
          ‹
        </button>
        <div style={{ fontSize: '18px', fontWeight: 700, color: '#2E2A20' }}>반려견 동반 여행지</div>
      </div>

      {/* 카테고리 탭 목록 */}
      <div style={{ display: 'flex', gap: '8px', padding: '2px 18px 12px', overflowX: 'auto' }}>
        <span
          style={{
            padding: '7px 14px',
            borderRadius: '999px',
            background: '#4C6B4E',
            color: '#FBF7EE',
            fontSize: '12px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            cursor: 'pointer',
          }}
        >
          전체
        </span>
        {['놀이터', '카페', '숙소', '식당'].map((tab, idx) => (
          <span
            key={idx}
            style={{
              padding: '7px 14px',
              borderRadius: '999px',
              background: '#EBE3D2',
              color: '#6E6553',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
            }}
          >
            {tab}
          </span>
        ))}
      </div>

      {/* 장소 리스트 본문 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 18px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        
        {/* 장소 1 */}
        <div
          onClick={goDetail}
          style={{
            background: '#FBF7EE',
            border: '1px solid #E6DECE',
            borderRadius: '18px',
            overflow: 'hidden',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              height: '140px',
              background: 'repeating-linear-gradient(45deg, #DCD7C5 0 11px, #E6E1D0 11px 22px)',
              position: 'relative',
            }}
          >
            <span
              style={{
                position: 'absolute',
                left: '12px',
                top: '12px',
                background: '#4C6B4E',
                color: '#FBF7EE',
                fontSize: '10px',
                fontWeight: 700,
                padding: '4px 9px',
                borderRadius: '7px',
              }}
            >
              대형견 가능
            </span>
          </div>
          <div style={{ padding: '13px 15px' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#2E2A20' }}>서울숲 반려견 놀이터</div>
            <div style={{ fontSize: '12px', color: '#948B79', marginTop: '3px' }}>
              성동구 성수동 · 2.1km · ★ 4.8 (124)
            </div>
          </div>
        </div>

        {/* 장소 2 */}
        <div
          onClick={goDetail}
          style={{
            background: '#FBF7EE',
            border: '1px solid #E6DECE',
            borderRadius: '18px',
            overflow: 'hidden',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              height: '140px',
              background: 'repeating-linear-gradient(45deg, #DCD7C5 0 11px, #E6E1D0 11px 22px)',
              position: 'relative',
            }}
          >
            <span
              style={{
                position: 'absolute',
                left: '12px',
                top: '12px',
                background: '#C16A43',
                color: '#FBF7EE',
                fontSize: '10px',
                fontWeight: 700,
                padding: '4px 9px',
                borderRadius: '7px',
              }}
            >
              실내 동반
            </span>
          </div>
          <div style={{ padding: '13px 15px' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#2E2A20' }}>올댓독 애견 카페</div>
            <div style={{ fontSize: '12px', color: '#948B79', marginTop: '3px' }}>
              성동구 · 1.4km · ★ 4.6 (88)
            </div>
          </div>
        </div>

        {/* 장소 3 */}
        <div
          onClick={goDetail}
          style={{
            background: '#FBF7EE',
            border: '1px solid #E6DECE',
            borderRadius: '18px',
            overflow: 'hidden',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              height: '140px',
              background: 'repeating-linear-gradient(45deg, #DCD7C5 0 11px, #E6E1D0 11px 22px)',
              position: 'relative',
            }}
          >
            <span
              style={{
                position: 'absolute',
                left: '12px',
                top: '12px',
                background: '#4C6B4E',
                color: '#FBF7EE',
                fontSize: '10px',
                fontWeight: 700,
                padding: '4px 9px',
                borderRadius: '7px',
              }}
            >
              반려견 동반 숙소
            </span>
          </div>
          <div style={{ padding: '13px 15px' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#2E2A20' }}>두물머리 펜션</div>
            <div style={{ fontSize: '12px', color: '#948B79', marginTop: '3px' }}>
              양평 · 38km · ★ 4.9 (52)
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
