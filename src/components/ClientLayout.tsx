'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { AppProvider, useApp } from '../context/AppContext';
import { Sidebar } from './Sidebar';
import { NavItem } from '../types';

export const GlobalFooter: React.FC = () => (
  <div style={{
    flexShrink: 0,
    background: '#F0EBE0',
    borderTop: '1px solid #E6DECE',
    padding: '20px 16px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    width: '100%',
  }}>
    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
      {[
        { href: '/privacy', label: '개인정보처리방침' },
        { href: '/terms',   label: '이용약관' },
        { href: '/about',   label: '서비스 소개' },
      ].map(({ href, label }) => (
        <Link key={href} href={href} style={{ fontSize: '11px', color: '#4C6B4E', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
          {label}
        </Link>
      ))}
    </div>
    <span style={{ fontSize: '11px', color: '#8A8273', flexShrink: 0 }}>© 2026 MungGo. All rights reserved.</span>
  </div>
);

/**
 * 클라이언트 상태 기반 레이아웃 컨텐츠 컴포넌트
 * 전역 사이드바 오버레이와 네비게이션 링크를 매핑합니다.
 */
const ClientLayoutContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const {
    menu,
    loggedIn,
    dogName,
    setLoggedIn,
    closeMenu,
    go,
  } = useApp();

  const activeDogName = dogName || '우리 강아지';

  // --- 경로 기반 활성 상태 판별 헬퍼 ---
  const isPathActive = (targetPath: string) => pathname === targetPath;

  // --- 네비게이션 아이템 스타일 데코레이터 ---
  const tileStyle = (isActive: boolean, isRound?: boolean): React.CSSProperties => ({
    width: '18px',
    height: '18px',
    borderRadius: isRound ? '50%' : '6px',
    background: isActive ? '#4C6B4E' : 'transparent',
    border: isActive ? 'none' : '1.6px solid #C9BFA9',
  });

  const textStyle = (isActive: boolean): React.CSSProperties => ({
    fontSize: '15px',
    color: isActive ? '#2E2A20' : '#4A4538',
    fontWeight: isActive ? '700' : '400',
  });

  const createNavItem = (label: string, targetPath: string, isRound?: boolean): NavItem => ({
    label,
    go: () => go(targetPath),
    tile: tileStyle(isPathActive(targetPath), isRound),
    text: textStyle(isPathActive(targetPath)),
  });

  const navItems: NavItem[] = [
    createNavItem('홈', '/'),
    createNavItem('반려견 동반 여행지', '/travel'),
    createNavItem('산책 코스 추천', '/map'),
    createNavItem('반려견 일기', '/diary'),
  ];

  if (loggedIn) {
    navItems.push(createNavItem('마이페이지', '/mypage', true));
  }

  // --- 계정(로그인/로그아웃) 처리 액션 ---
  const handleAccountAction = () => {
    if (loggedIn) {
      setLoggedIn(false);
      go('/');
    } else {
      go('/signup');
    }
  };

  return (
    <>
      {/* 전역 드로어 오버레이 메뉴 */}
      <Sidebar
        menu={menu}
        menuSubtitle={loggedIn ? `${activeDogName}와 함께` : '반려견과 함께'}
        navItems={navItems}
        accountLabel={loggedIn ? '로그아웃' : '로그인 / 회원가입'}
        accountBg={loggedIn ? '#F4EEE2' : '#C16A43'}
        accountColor={loggedIn ? '#948B79' : '#FBF7EE'}
        accountBorder={loggedIn ? '1.5px solid #E6DECE' : 'none'}
        accountAction={handleAccountAction}
        closeMenu={closeMenu}
      />

      {/* 내부 활성 페이지 콘텐츠 */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </>
  );
};

/**
 * Next.js 루트 레이아웃에서 클라이언트 사이드 Context Provider를 래핑하기 위한 컴포넌트
 */
export const ClientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AppProvider>
      <ClientLayoutContent>{children}</ClientLayoutContent>
    </AppProvider>
  );
};
