import React from 'react';
import { DetailProps } from '../types';

/**
 * 여행지 상세 정보 화면 컴포넌트
 * @param props 여행지 리스트로 돌아가는 콜백 함수 등
 * @returns 특정 장소의 세부 정보 및 리뷰 UI
 */
export const Detail: React.FC<DetailProps> = ({ goTravel }) => {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', animation: 'screenIn .28s ease' }}>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        
        {/* 상단 이미지 배너 영역 */}
        <div
          style={{
            height: '230px',
            background: 'repeating-linear-gradient(45deg, #DCD7C5 0 11px, #E6E1D0 11px 22px)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ font: '11px ui-monospace, monospace', color: '#A89F8C' }}>여행지 대표 사진</span>
          
          <button
            onClick={goTravel}
            style={{
              position: 'absolute',
              top: '18px',
              left: '18px',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'rgba(251, 247, 238, .95)',
              border: 'none',
              fontSize: '18px',
              color: '#2E2A20',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ‹
          </button>
          
          <button
            style={{
              position: 'absolute',
              top: '18px',
              right: '18px',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'rgba(251, 247, 238, .95)',
              border: 'none',
              fontSize: '15px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ♡
          </button>
          
          <div
            style={{
              position: 'absolute',
              left: '18px',
              bottom: '16px',
              background: '#4C6B4E',
              color: '#FBF7EE',
              fontSize: '11px',
              fontWeight: 700,
              padding: '5px 11px',
              borderRadius: '8px',
            }}
          >
            대형견 가능
          </div>
        </div>

        {/* 세부 본문 카드 영역 */}
        <div
          style={{
            background: '#F4EEE2',
            borderRadius: '26px 26px 0 0',
            marginTop: '-24px',
            position: 'relative',
            zIndex: 2,
            padding: '22px 22px 24px',
          }}
        >
          {/* 타이틀 및 별점 */}
          <div style={{ fontSize: '23px', fontWeight: 700, color: '#2E2A20', letterSpacing: '-.3px' }}>
            서울숲 반려견 놀이터
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '7px', fontSize: '13px', color: '#948B79' }}>
            <span style={{ color: '#C16A43', fontWeight: 700 }}>★ 4.8</span>
            <span>리뷰 124</span>
            <span>·</span>
            <span>성동구 성수동</span>
          </div>

          {/* 태그 칩 */}
          <div style={{ display: 'flex', gap: '7px', marginTop: '14px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', padding: '6px 12px', background: '#E4ECDF', color: '#4C6B4E', borderRadius: '9px', fontWeight: 600 }}>
              무료 주차
            </span>
            <span style={{ fontSize: '12px', padding: '6px 12px', background: '#EBE3D2', color: '#7A7260', borderRadius: '9px' }}>
              울타리
            </span>
            <span style={{ fontSize: '12px', padding: '6px 12px', background: '#EBE3D2', color: '#7A7260', borderRadius: '9px' }}>
              급수대
            </span>
          </div>

          {/* 기본 영업 정보 리스트 */}
          <div style={{ marginTop: '18px', background: '#FBF7EE', border: '1px solid #E6DECE', borderRadius: '16px', padding: '4px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 0', borderBottom: '1px solid #EFE8DA', fontSize: '13px' }}>
              <span style={{ color: '#948B79' }}>영업시간</span>
              <span style={{ color: '#2E2A20', fontWeight: 500 }}>06:00 – 22:00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 0', borderBottom: '1px solid #EFE8DA', fontSize: '13px' }}>
              <span style={{ color: '#948B79' }}>입장료</span>
              <span style={{ color: '#2E2A20', fontWeight: 500 }}>무료</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 0', fontSize: '13px' }}>
              <span style={{ color: '#948B79' }}>편의시설</span>
              <span style={{ color: '#2E2A20', fontWeight: 500 }}>배변봉투 · 그늘 쉼터</span>
            </div>
          </div>

          {/* 리뷰 헤더 및 샘플 리뷰 */}
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#2E2A20', margin: '20px 0 10px' }}>
            방문자 리뷰 124
          </div>
          <div style={{ background: '#FBF7EE', border: '1px solid #E6DECE', borderRadius: '16px', padding: '14px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#2E2A20' }}>초코맘</span>
              <span style={{ fontSize: '12px', color: '#C16A43' }}>★ 5.0</span>
            </div>
            <div style={{ fontSize: '13px', color: '#7A7260', marginTop: '6px', lineHeight: 1.5 }}>
              울타리가 있어서 안심하고 뛰놀았어요. 그늘 쉼터도 넉넉합니다 🐶
            </div>
          </div>

        </div>
      </div>

      {/* 하단 고정 액션 버튼 바 */}
      <div style={{ display: 'flex', gap: '11px', padding: '14px 20px 18px', borderTop: '1px solid #E6DECE', background: '#FBF7EE' }}>
        <button
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '15px',
            border: '1.5px solid #E6DECE',
            background: '#FBF7EE',
            fontSize: '18px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ♡
        </button>
        <button
          style={{
            flex: 1,
            height: '50px',
            borderRadius: '15px',
            border: 'none',
            background: '#C16A43',
            color: '#FBF7EE',
            fontSize: '15px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          길찾기 시작
        </button>
      </div>
    </div>
  );
};
