import React from 'react';
import { DiaryListProps } from '../types';

/**
 * 반려견 일기 목록 화면 컴포넌트
 * @param props 일기 목록 데이터 및 네비게이션용 콜백
 * @returns 반려견 기분 일기 타임라인 목록 UI
 */
export const DiaryList: React.FC<DiaryListProps> = ({
  dogTitle,
  entryCountLabel,
  entryCount,
  entries,
  goHome,
  goWrite,
}) => {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', animation: 'screenIn .28s ease' }}>
      
      {/* 상단 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 18px 10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={goHome}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#FBF7EE',
              border: '1px solid #E6DECE',
              fontSize: '18px',
              color: '#2E2A20',
              cursor: 'pointer',
            }}
          >
            ‹
          </button>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#2E2A20' }}>반려견 일기</div>
        </div>
      </div>

      {/* 프로필 및 기분 통계 카드 */}
      <div style={{ padding: '4px 20px 14px' }}>
        <div style={{ background: '#FBF7EE', border: '1px solid #E6DECE', borderRadius: '18px', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'repeating-linear-gradient(45deg, #DCD7C5 0 6px, #E6E1D0 6px 12px)',
              border: '1px solid #E6DECE',
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#2E2A20' }}>{dogTitle}</div>
            <div style={{ fontSize: '12px', color: '#948B79', marginTop: '2px' }}>{entryCountLabel}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Black Han Sans', sans-serif", fontSize: '22px', color: '#C16A43' }}>{entryCount}</div>
            <div style={{ fontSize: '10px', color: '#948B79' }}>기록</div>
          </div>
        </div>
      </div>

      {/* 일기 엔트리 타임라인 목록 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 100px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {entries.map((entry, idx) => (
          <div
            key={idx}
            style={{
              background: '#FBF7EE',
              border: '1px solid #E6DECE',
              borderRadius: '18px',
              padding: '15px 16px',
              display: 'flex',
              gap: '14px',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '13px',
                background: '#F4EEE2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '26px',
                flexShrink: 0,
              }}
            >
              {entry.emoji}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#C16A43' }}>{entry.mood}</span>
                <span style={{ fontSize: '11px', color: '#A89F8C' }}>{entry.date}</span>
              </div>
              <div style={{ fontSize: '14px', color: '#3E3A30', marginTop: '5px', lineHeight: 1.45 }}>{entry.text}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 플로팅 일기 쓰기 버튼 */}
      <button
        onClick={goWrite}
        style={{
          position: 'absolute',
          right: '22px',
          bottom: '24px',
          height: '54px',
          padding: '0 22px',
          borderRadius: '18px',
          border: 'none',
          background: '#C16A43',
          color: '#FBF7EE',
          fontSize: '15px',
          fontWeight: 700,
          boxShadow: '0 8px 20px rgba(193, 106, 67, .4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 10,
        }}
      >
        ＋ 일기 쓰기
      </button>
    </div>
  );
};
