'use client';

import React from 'react';
import { useApp } from '../../../context/AppContext';
import { DiaryList } from '../../../components/DiaryList';

/**
 * 반려견 기분 일기 타임라인 목록 라우트 페이지
 * 경로: /diary
 */
export default function DiaryListPage() {
  const { loggedIn, dogName, entries, go } = useApp();

  const activeDogName = dogName || '우리 강아지';

  return (
    <DiaryList
      dogTitle={loggedIn ? `${activeDogName}의 일기` : '우리 강아지 일기'}
      entryCountLabel={`감정 기록 ${entries.length}개`}
      entryCount={entries.length}
      entries={entries}
      goHome={() => go('/')}
      goWrite={() => go('/diary/write')}
    />
  );
}
