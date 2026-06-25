import React from 'react';
import { SidebarProps } from '../types';

/**
 * 사이드바 메뉴 컴포넌트
 * @param props 사이드바 상태 및 네비게이션 액션
 * @returns 사이드바 오버레이 및 슬라이드 드로어 UI
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
  if (!menu) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 50 }}>
      {/* 반투명 배경 마스크 (클릭 시 닫힘) */}
      <div
        onClick={closeMenu}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(30,24,18,.45)',
          animation: 'fadeIn .2s ease',
        }}
      />
      
      {/* 슬라이드 아웃 드로어 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: '280px',
          background: '#FBF7EE',
          boxShadow: '8px 0 30px rgba(30,24,18,.28)',
          animation: 'drawerIn .28s cubic-bezier(.2,.8,.2,1)',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 20px 22px',
        }}
      >
        {/* 드로어 상단 헤더 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div
            style={{
              fontFamily: "'Black Han Sans', sans-serif",
              fontSize: '26px',
              color: '#2E2A20',
            }}
          >
            멍고
          </div>
          <button
            onClick={closeMenu}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              border: 'none',
              background: '#EBE3D2',
              color: '#6E6553',
              fontSize: '18px',
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>
        
        {/* 메뉴 부제목 */}
        <div style={{ fontSize: '12px', color: '#948B79', marginTop: '6px' }}>
          {menuSubtitle}
        </div>
        
        {/* 네비게이션 아이템 리스트 */}
        <div style={{ marginTop: '22px', display: 'flex', flexDirection: 'column' }}>
          {navItems.map((item, idx) => (
            <div
              key={idx}
              onClick={item.go}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '15px 4px',
                borderBottom: '1px solid #EFE8DA',
                cursor: 'pointer',
              }}
            >
              <span style={item.tile} />
              <span style={item.text}>{item.label}</span>
            </div>
          ))}
        </div>
        
        <div style={{ flex: 1 }} />
        
        {/* 하단 로그인/로그아웃 버튼 */}
        <button
          onClick={accountAction}
          style={{
            height: '50px',
            borderRadius: '14px',
            background: accountBg,
            color: accountColor,
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            border: accountBorder,
          }}
        >
          {accountLabel}
        </button>
      </div>
    </div>
  );
};
