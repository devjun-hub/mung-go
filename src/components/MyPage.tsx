import React from 'react';
import { MyPageProps } from '../types';
import { GlobalFooter } from './ClientLayout';

/**
 * 마이페이지 화면 컴포넌트
 * @param props 반려견 정보 및 로그아웃/다이어리 전환용 콜백 핸들러
 * @returns 반려견 프로필 조회 및 설정 관리 UI
 */
export const MyPage: React.FC<MyPageProps> = ({
  dogTitle,
  dogSize,
  entryCount,
  goHome,
  goDiary,
  logout,
}) => {
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ‹
        </button>
        <div style={{ fontSize: '18px', fontWeight: 700, color: '#2E2A20' }}>마이페이지</div>
      </div>

      {/* 마이페이지 정보 본문 */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '6px 20px 24px', flex: 1 }}>
        
        {/* 반려견 프로필 카드 */}
        <div style={{ background: '#FBF7EE', border: '1px solid #E6DECE', borderRadius: '20px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'repeating-linear-gradient(45deg, #DCD7C5 0 7px, #E6E1D0 7px 14px)',
              border: '1px solid #E6DECE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '30px',
            }}
          >
            🐶
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '19px', fontWeight: 700, color: '#2E2A20' }}>{dogTitle}</div>
            <div style={{ fontSize: '13px', color: '#948B79', marginTop: '3px' }}>{dogSize} · MungGo와 함께한 지 1일</div>
          </div>
        </div>

        {/* 통계 요약 박스 (일기 기록 / 저장 장소) */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '14px' }}>
          <div
            onClick={goDiary}
            style={{
              flex: 1,
              background: '#FBF7EE',
              border: '1px solid #E6DECE',
              borderRadius: '16px',
              padding: '16px',
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontFamily: "'Black Han Sans', sans-serif", fontSize: '24px', color: '#C16A43' }}>
              {entryCount}
            </div>
            <div style={{ fontSize: '12px', color: '#6E6553', marginTop: '2px' }}>반려견 일기</div>
          </div>
          
          <div
            style={{
              flex: 1,
              background: '#FBF7EE',
              border: '1px solid #E6DECE',
              borderRadius: '16px',
              padding: '16px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontFamily: "'Black Han Sans', sans-serif", fontSize: '24px', color: '#4C6B4E' }}>
              3
            </div>
            <div style={{ fontSize: '12px', color: '#6E6553', marginTop: '2px' }}>저장한 장소</div>
          </div>
        </div>

        {/* 메뉴 설정 리스트 */}
        <div style={{ marginTop: '18px', background: '#FBF7EE', border: '1px solid #E6DECE', borderRadius: '18px', overflow: 'hidden' }}>
          <div
            onClick={goDiary}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 18px',
              borderBottom: '1px solid #EFE8DA',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: '14px', color: '#2E2A20' }}>내 일기 모아보기</span>
            <span style={{ color: '#C9BFA9' }}>›</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', borderBottom: '1px solid #EFE8DA' }}>
            <span style={{ fontSize: '14px', color: '#2E2A20' }}>저장한 장소</span>
            <span style={{ color: '#C9BFA9' }}>›</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px' }}>
            <span style={{ fontSize: '14px', color: '#2E2A20' }}>알림 설정</span>
            <span style={{ color: '#C9BFA9' }}>›</span>
          </div>
        </div>

        {/* 로그아웃 버튼 */}
        <button
          onClick={logout}
          style={{
            width: '100%',
            marginTop: '18px',
            height: '48px',
            borderRadius: '14px',
            border: '1.5px solid #E6DECE',
            background: '#F4EEE2',
            color: '#948B79',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          로그아웃
        </button>
      </div>
      <GlobalFooter />
    </div>
  </div>
  );
};
