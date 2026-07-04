import React, { useState } from 'react';
import { SidebarProps } from '../types';

// --- 모던 라인 아트 SVG 아이콘 컴포넌트 정의 (이모지 대체) ---
const HomeIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const TravelIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const MapIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
    <line x1="8" y1="2" x2="8" y2="18" />
    <line x1="16" y1="6" x2="16" y2="22" />
  </svg>
);

const DiaryIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/**
 * 에어비앤비 스타일의 미니멀 모던 사이드바 메뉴 컴포넌트
 * @param props 사이드바 상태 및 네비게이션 액션
 * @returns 이모지가 배제된 라인 아이콘 기반의 미니멀 드로어 UI
 */
export const Sidebar: React.FC<SidebarProps> = ({
  menu,
  menuSubtitle,
  navItems,
  accountLabel,
  accountBg,
  accountColor,
  accountBorder,
  accountAction,
  closeMenu,
}) => {
  const [hoveredMainIdx, setHoveredMainIdx] = useState<number | null>(null);
  const [hoveredSubIdx, setHoveredSubIdx] = useState<number | null>(null);
  const [hoveredClose, setHoveredClose] = useState<boolean>(false);
  const [hoveredAccount, setHoveredAccount] = useState<boolean>(false);

  if (!menu) return null;

  // 메뉴 라벨별 SVG 컴포넌트 반환 헬퍼
  const getIcon = (label: string) => {
    switch (label) {
      case '홈': return <HomeIcon />;
      case '반려견 동반 여행지': return <TravelIcon />;
      case '산책 코스 추천': return <MapIcon />;
      case '반려견 일기': return <DiaryIcon />;
      case '마이페이지': return <UserIcon />;
      default:
        return (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="12" cy="12" r="10" />
          </svg>
        );
    }
  };

  // 메뉴 카테고리 분리 (주요 서비스 vs 기록 및 마이페이지)
  const mainItems = navItems.filter(item => ['반려견 동반 여행지', '산책 코스 추천'].includes(item.label));
  const subItems = navItems.filter(item => ['반려견 일기', '마이페이지'].includes(item.label));

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 50 }}>
      {/* 반투명 배경 마스크 (클릭 시 닫힘) - 기존 테마의 웜 톤 마스크 복원 */}
      <div
        onClick={closeMenu}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(30, 24, 18, 0.45)',
          animation: 'fadeIn .2s ease',
        }}
      />
      
      {/* 슬라이드 아웃 드로어 - 기존 테마 색상(#FBF7EE) 및 웜 톤 섀도우 복원 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: '280px',
          background: '#FBF7EE',
          boxShadow: '16px 0 32px rgba(30, 24, 18, 0.12)',
          animation: 'drawerIn .3s cubic-bezier(.16, 1, .3, 1)',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 20px',
        }}
      >
        {/* 드로어 상단 헤더 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', padding: '0 4px' }}>
          <div
            onClick={() => {
              const homeItem = navItems.find(item => item.label === '홈');
              if (homeItem) homeItem.go();
              closeMenu();
            }}
            style={{ cursor: 'pointer' }}
          >
            <div
              style={{
                fontFamily: "Pretendard, -apple-system, sans-serif",
                fontSize: '22px',
                fontWeight: 700,
                color: '#2E2A20',
                letterSpacing: '-0.3px',
              }}
            >
              MungGo
            </div>
            <div style={{ fontSize: '13px', color: '#8C8472', marginTop: '2px', fontWeight: 500 }}>
              {menuSubtitle}
            </div>
          </div>
          <button
            onClick={closeMenu}
            onMouseEnter={() => setHoveredClose(true)}
            onMouseLeave={() => setHoveredClose(false)}
            style={{
              width: '32px',
              height: '32px',
              border: 'none',
              borderRadius: '50%',
              background: hoveredClose ? '#EBE3D2' : 'transparent',
              color: '#2E2A20',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              transition: 'background-color 0.15s ease',
            }}
          >
            <CloseIcon />
          </button>
        </div>
        
        {/* 메인 서비스 리스트 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {mainItems.map((item, idx) => {
            const isActive = item.tile.background === '#4C6B4E';
            const isHovered = hoveredMainIdx === idx;
            
            return (
              <div
                key={idx}
                onClick={item.go}
                onMouseEnter={() => setHoveredMainIdx(idx)}
                onMouseLeave={() => setHoveredMainIdx(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  background: isActive ? '#4C6B4E' : (isHovered ? '#EBE3D2' : 'transparent'),
                  color: isActive ? '#ffffff' : (isHovered ? '#2E2A20' : '#4A4538'),
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {/* SVG 라인 아이콘 */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {getIcon(item.label)}
                </div>
                
                {/* 텍스트 라벨 */}
                <span
                  style={{
                    fontSize: '15px',
                    fontWeight: isActive ? 600 : 500,
                    letterSpacing: '-0.2px',
                  }}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* 하위 설정/기록 섹션 헤더 및 아이템 목록 */}
        {subItems.length > 0 && (
          <>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#8C8472',
                letterSpacing: '1px',
                marginTop: '28px',
                marginBottom: '8px',
                padding: '0 14px',
              }}
            >
              RECORD & ACCOUNT
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {subItems.map((item, idx) => {
                const isActive = item.tile.background === '#4C6B4E';
                const isHovered = hoveredSubIdx === idx;
                
                return (
                  <div
                    key={idx}
                    onClick={item.go}
                    onMouseEnter={() => setHoveredSubIdx(idx)}
                    onMouseLeave={() => setHoveredSubIdx(null)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      background: isActive ? '#4C6B4E' : (isHovered ? '#EBE3D2' : 'transparent'),
                      color: isActive ? '#ffffff' : (isHovered ? '#2E2A20' : '#4A4538'),
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {/* SVG 라인 아이콘 */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {getIcon(item.label)}
                    </div>
                    
                    {/* 텍스트 라벨 */}
                    <span
                      style={{
                        fontSize: '15px',
                        fontWeight: isActive ? 600 : 500,
                        letterSpacing: '-0.2px',
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}
        
        <div style={{ flex: 1 }} />
        
        {/* 하단 로그인/로그아웃 버튼 (에어비앤비 스타일 컴팩트 박스) */}
        <button
          onClick={accountAction}
          onMouseEnter={() => setHoveredAccount(true)}
          onMouseLeave={() => setHoveredAccount(false)}
          style={{
            height: '48px',
            borderRadius: '10px',
            background: accountLabel === '로그아웃'
              ? (hoveredAccount ? '#EBE3D2' : accountBg)
              : (hoveredAccount ? '#A95833' : accountBg),
            color: accountColor,
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            border: accountLabel === '로그아웃'
              ? (hoveredAccount ? '1.5px solid #DCD1B4' : accountBorder)
              : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease',
          }}
        >
          {accountLabel}
        </button>
      </div>
    </div>
  );
};
