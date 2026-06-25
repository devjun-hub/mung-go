'use client';

import React from 'react';
import { useApp } from '../../../context/AppContext';
import { MyPage } from '../../../components/MyPage';

/**
 * 마이페이지 라우트 페이지 컴포넌트
 * 경로: /mypage
 */
export default function MyPagePage() {
  const {
    loggedIn,
    dogName,
    dogSize,
    entries,
    setLoggedIn,
    go,
  } = useApp();

  const activeDogName = dogName || '우리 강아지';

  // --- 로그아웃 처리 ---
  const handleLogout = () => {
    setLoggedIn(false);
    go('/'); // 로그아웃 후 홈으로 복귀
  };

  return (
    <MyPage
      dogTitle={loggedIn ? `${activeDogName}의 일기` : '우리 강아지 일기'}
      dogSize={dogSize}
      entryCount={entries.length}
      goHome={() => go('/')}
      goDiary={() => go('/diary')}
      logout={handleLogout}
    />
  );
}
