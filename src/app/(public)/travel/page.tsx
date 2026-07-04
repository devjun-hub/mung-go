'use client';

import React from 'react';
import { useApp } from '../../../context/AppContext';
import { TravelList } from '../../../components/TravelList';

export default function TravelListPage() {
  const { go } = useApp();

  return (
    <TravelList
      goDetail={(contentId) => go(`/travel/detail?id=${contentId}`)}
    />
  );
}
