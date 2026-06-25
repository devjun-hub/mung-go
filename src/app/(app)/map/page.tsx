'use client';

import React from 'react';
import { useApp } from '../../../context/AppContext';
import { MapScreen } from '../../../components/MapScreen';

/**
 * 산책로 코스 맵 경로 추천 라우트 페이지
 * 경로: /map
 */
export default function MapPage() {
  const { openMenu, go } = useApp();

  return (
    <MapScreen
      openMenu={openMenu}
      goHome={() => go('/')}
    />
  );
}
