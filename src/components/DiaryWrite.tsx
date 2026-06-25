import React from 'react';
import { DiaryWriteProps } from '../types';

/**
 * 일기 작성 화면 컴포넌트
 * @param props 기분 선택 및 텍스트 입력을 위한 핸들러
 * @returns 반려견 감정 및 일기 입력 작성 UI
 */
export const DiaryWrite: React.FC<DiaryWriteProps> = ({
  draftText,
  draftLen,
  todayLabel,
  saveColor,
  emojiOptions,
  onDraftText,
  saveDiary,
  goDiary,
}) => {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', animation: 'screenIn .28s ease' }}>
      
      {/* 상단 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px 12px' }}>
        <button
          onClick={goDiary}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#FBF7EE',
            border: '1px solid #E6DECE',
            fontSize: '18px',
            color: '#2E2A20',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ‹
        </button>
        <div style={{ fontSize: '16px', fontWeight: 700, color: '#2E2A20' }}>오늘의 일기</div>
        <button
          onClick={saveDiary}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '15px',
            fontWeight: 700,
            color: saveColor,
            cursor: 'pointer',
          }}
        >
          저장
        </button>
      </div>

      {/* 입력 폼 본문 영역 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 22px 24px' }}>
        <div style={{ fontSize: '13px', color: '#948B79' }}>{todayLabel}</div>
        <div style={{ fontFamily: "'Black Han Sans', sans-serif", fontSize: '24px', color: '#2E2A20', marginTop: '4px' }}>
          오늘 기분은
          <br />
          어땠나요?
        </div>
        
        {/* 기분 이모지 선택 팔레트 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '20px', justifyContent: 'space-between' }}>
          {emojiOptions.map((opt, idx) => (
            <div key={idx} onClick={opt.pick} style={opt.box}>
              <div style={{ fontSize: '30px' }}>{opt.char}</div>
              <div style={opt.label}>{opt.mood}</div>
            </div>
          ))}
        </div>

        {/* 한 줄 일기 입력 */}
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#2E2A20', marginTop: '26px' }}>한 줄 기록</div>
        <div style={{ marginTop: '10px', background: '#FBF7EE', border: '1.5px solid #E6DECE', borderRadius: '16px', padding: '14px 16px' }}>
          <textarea
            value={draftText}
            onChange={onDraftText}
            maxLength={50}
            placeholder="오늘 산책은 어땠는지 적어주세요"
            style={{
              width: '100%',
              height: '78px',
              border: 'none',
              outline: 'none',
              resize: 'none',
              background: 'transparent',
              fontSize: '15px',
              color: '#2E2A20',
              lineHeight: 1.5,
            }}
          />
          <div style={{ textAlign: 'right', fontSize: '12px', color: '#A89F8C' }}>{draftLen} / 50</div>
        </div>
        
        {/* 안내 팁 박스 */}
        <div style={{ background: '#F0EBE0', borderRadius: '14px', padding: '12px 14px', marginTop: '16px', fontSize: '12px', color: '#8C8472', lineHeight: 1.5 }}>
          💡 사진 첨부는 다음 업데이트에서 추가될 예정이에요.
        </div>
      </div>

      {/* 하단 고정 저장 버튼 */}
      <div style={{ padding: '12px 22px 20px', borderTop: '1px solid #E6DECE', background: '#FBF7EE' }}>
        <button
          onClick={saveDiary}
          style={{
            width: '100%',
            height: '52px',
            borderRadius: '15px',
            border: 'none',
            background: '#C16A43',
            color: '#FBF7EE',
            fontSize: '15px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          일기 저장하기
        </button>
      </div>
    </div>
  );
};
