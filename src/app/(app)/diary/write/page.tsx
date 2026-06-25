'use client';

import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { DiaryWrite } from '../../../../components/DiaryWrite';
import { DiaryEntry } from '../../../../types';
import { saveDiary } from '../../../../lib/supabase/db';

/**
 * 반려견 산책 일기 작성 라우트 페이지
 * 경로: /diary/write
 */
export default function DiaryWritePage() {
  const {
    draftEmoji,
    setDraftEmoji,
    draftMood,
    setDraftMood,
    draftText,
    setDraftText,
    entries,
    setEntries,
    go,
  } = useApp();

  // --- 다이어리 일기 저장 로직 ---
  const handleSaveDiary = () => {
    if (!draftEmoji || !draftText.trim()) return;

    const newEntry: DiaryEntry = {
      emoji: draftEmoji,
      mood: draftMood,
      text: draftText.trim(),
      date: '오늘',
    };

    setEntries([newEntry, ...entries]);
    
    // 데이터베이스 저장 호출 (비동기 수행)
    saveDiary(newEntry);

    // 입력 필드 원상 복구 및 일기 피드로 귀환
    setDraftEmoji('');
    setDraftMood('');
    setDraftText('');
    go('/diary');
  };

  // --- 기분 이모지 선택 팔레트 구성 ---
  const moodPalette = [
    { char: '😄', mood: '기쁨' },
    { char: '🤩', mood: '신남' },
    { char: '😌', mood: '편안' },
    { char: '😴', mood: '나른' },
    { char: '😔', mood: '시무룩' },
    { char: '😟', mood: '불안' },
  ];

  const boxBase: React.CSSProperties = {
    width: '104px',
    flex: '1 1 30%',
    minWidth: '92px',
    height: '92px',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    cursor: 'pointer',
  };

  const emojiOptions = moodPalette.map(p => {
    const isSelected = draftEmoji === p.char;
    return {
      char: p.char,
      mood: p.mood,
      pick: () => {
        setDraftEmoji(p.char);
        setDraftMood(p.mood);
      },
      box: {
        ...boxBase,
        background: isSelected ? '#FBF1EA' : '#FBF7EE',
        border: isSelected ? '2px solid #C16A43' : '1.5px solid #E6DECE',
      },
      label: {
        fontSize: '12px',
        fontWeight: isSelected ? ('700' as const) : ('500' as const),
        color: isSelected ? '#C16A43' : '#8C8472',
      },
    };
  });

  return (
    <DiaryWrite
      draftText={draftText}
      draftLen={draftText.length}
      todayLabel="6월 24일 화요일"
      saveColor={draftEmoji && draftText ? '#C16A43' : '#C9BFA9'}
      emojiOptions={emojiOptions}
      onDraftText={(e) => setDraftText(e.target.value.slice(0, 50))}
      saveDiary={handleSaveDiary}
      goDiary={() => go('/diary')}
    />
  );
}
