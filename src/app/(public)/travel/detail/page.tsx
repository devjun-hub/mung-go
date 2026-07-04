'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '../../../../context/AppContext';
import { Detail } from '../../../../components/Detail';

function DetailContent() {
  const { go } = useApp();
  const searchParams = useSearchParams();
  const contentId = searchParams.get('id') ?? '';

  return (
    <Detail
      contentId={contentId}
      goTravel={() => go('/travel')}
    />
  );
}

export default function TravelDetailPage() {
  return (
    <Suspense fallback={<div style={{ height: '100%', background: '#F4EEE2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#948B79', fontSize: '14px' }}>로딩 중...</div>}>
      <DetailContent />
    </Suspense>
  );
}
