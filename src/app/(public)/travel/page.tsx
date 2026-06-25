'use client';

import React from 'react';
import { useApp } from '../../../context/AppContext';
import { TravelList } from '../../../components/TravelList';

/**
 * 반려견 동반 여행지 리스트 라우트 페이지
 * 경로: /travel
 */
export default function TravelListPage() {
  const { go } = useApp();

  return (
    <TravelList
      goHome={() => go('/')}
      goDetail={() => go('/travel/detail')}
    />
  );
}
