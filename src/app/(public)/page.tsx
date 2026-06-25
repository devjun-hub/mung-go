'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home } from '../../components/Home';

/**
 * 홈 라우트 페이지 컴포넌트 (비로그인/로그인 진입점)
 * 경로: /
 */
export default function HomePage() {
  const { loggedIn, dogName, locationText, openMenu, go } = useApp();

  const activeDogName = dogName || '우리 강아지';

  // --- 로그인 여부에 따라 온보딩 혹은 다이어리 이동 ---
  const handleWriteDiaryClick = () => {
    go('/diary/write');
  };

  // --- 계정 버튼 클릭 액션 ---
  const handleAccountAction = () => {
    if (loggedIn) {
      go('/mypage');
    } else {
      go('/signup');
    }
  };

  return (
    <Home
      loggedIn={loggedIn}
      dogName={activeDogName}
      locationText={locationText}
      goWrite={handleWriteDiaryClick}
      goMap={() => go('/map')}
      goDetail={() => go('/travel/detail')}
      goTravel={() => go('/travel')}
      goAccount={handleAccountAction}
      openMenu={openMenu}
    />
  );
}
