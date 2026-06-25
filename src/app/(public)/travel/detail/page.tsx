'use client';

import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { Detail } from '../../../../components/Detail';

/**
 * 여행지 상세 정보 라우트 페이지
 * 경로: /travel/detail
 */
export default function TravelDetailPage() {
  const { go } = useApp();

  return (
    <Detail
      goTravel={() => go('/travel')}
    />
  );
}
