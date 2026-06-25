import React from 'react';
import Link from 'next/link';
import { HomeProps } from '../types';

/**
 * 홈 대시보드 화면 컴포넌트
 * @param props 홈 화면의 클릭 콜백 및 상태 객체
 * @returns 멍고 메인 대시보드 UI
 */
export const Home: React.FC<HomeProps> = ({
  loggedIn,
  dogName,
  locationText,
  goWrite,
  goMap,
  goDetail,
  goTravel,
  goAccount,
  openMenu,
}) => {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', animation: 'screenIn .28s ease' }}>
      {/* 상단 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px 10px' }}>
        <button
          onClick={openMenu}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '13px',
            background: '#FBF7EE',
            border: '1px solid #E6DECE',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
          }}
        >
          <span style={{ width: '17px', height: '2px', background: '#2E2A20', borderRadius: '2px' }} />
          <span style={{ width: '17px', height: '2px', background: '#2E2A20', borderRadius: '2px' }} />
          <span style={{ width: '17px', height: '2px', background: '#2E2A20', borderRadius: '2px' }} />
        </button>
        <div style={{ fontFamily: "'Black Han Sans', sans-serif", fontSize: '23px', color: '#2E2A20' }}>멍고</div>
        <button
          onClick={goAccount}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'repeating-linear-gradient(45deg, #DCD7C5 0 6px, #E6E1D0 6px 12px)',
            border: '1px solid #E6DECE',
            cursor: 'pointer',
          }}
        />
      </div>

      {/* 스크롤 가능한 본문 영역 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 28px' }}>
        <div style={{ fontSize: '12px', color: '#4C6B4E', fontWeight: 700, letterSpacing: '.3px', marginTop: '4px' }}>
          {locationText}
        </div>
        <div
          style={{
            fontFamily: "'Black Han Sans', sans-serif",
            fontSize: '36px',
            color: '#2E2A20',
            marginTop: '7px',
            lineHeight: 1.05,
            letterSpacing: '-.5px',
          }}
        >
          오늘은
          <br />
          <span style={{ color: '#C16A43' }}>멍산책</span> 가볼까요?
        </div>
        
        {/* 검색창 모의 */}
        <div
          style={{
            marginTop: '16px',
            background: '#FBF7EE',
            border: '1.5px solid #E6DECE',
            borderRadius: '15px',
            padding: '13px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '9px',
            color: '#A89F8C',
            fontSize: '14px',
            cursor: 'pointer',
          }}
          onClick={goTravel}
        >
          🔍 여행지·산책코스 검색
        </div>

        {/* 로그인한 사용자에게만 강아지 감정 일기 작성 배너 제공 */}
        {loggedIn && (
          <div
            onClick={goWrite}
            style={{
              marginTop: '14px',
              background: '#2E2A20',
              borderRadius: '16px',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: '24px' }}>🐶</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#fff', fontSize: '14px', fontWeight: 700 }}>
                {dogName}의 오늘 기분은?
              </div>
              <div style={{ color: '#C9BFA9', fontSize: '12px', marginTop: '1px' }}>
                감정 일기를 남겨보세요
              </div>
            </div>
            <div style={{ color: '#FFC8A8', fontSize: '18px' }}>›</div>
          </div>
        )}

        {/* 필터 칩 목록 */}
        <div style={{ display: 'flex', gap: '9px', marginTop: '18px', overflowX: 'auto', paddingBottom: '2px' }}>
          <span
            style={{
              padding: '8px 15px',
              borderRadius: '999px',
              background: '#4C6B4E',
              color: '#FBF7EE',
              fontSize: '13px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              cursor: 'pointer',
            }}
          >
            전체
          </span>
          {['산책코스', '여행지', '카페', '숙소'].map((category, idx) => (
            <span
              key={idx}
              onClick={category === '여행지' ? goTravel : undefined}
              style={{
                padding: '8px 15px',
                borderRadius: '999px',
                background: '#EBE3D2',
                color: '#6E6553',
                fontSize: '13px',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
              }}
            >
              {category}
            </span>
          ))}
        </div>

        {/* 추천 산책로 섹션 */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: '22px' }}>
          <div style={{ fontFamily: "'Black Han Sans', sans-serif", fontSize: '19px', color: '#2E2A20' }}>
            주변 산책 추천
          </div>
          <span onClick={goMap} style={{ fontSize: '12px', color: '#948B79', cursor: 'pointer' }}>
            지도 보기 ›
          </span>
        </div>
        <div
          onClick={goMap}
          style={{
            marginTop: '12px',
            position: 'relative',
            borderRadius: '20px',
            overflow: 'hidden',
            height: '170px',
            background: 'repeating-linear-gradient(45deg, #DCD7C5 0 12px, #E6E1D0 12px 24px)',
            cursor: 'pointer',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ font: '11px ui-monospace, monospace', color: '#A89F8C' }}>대표 산책 코스 사진</span>
          </div>
          <div
            style={{
              position: 'absolute',
              left: '14px',
              top: '14px',
              background: '#4C6B4E',
              color: '#FBF7EE',
              fontSize: '11px',
              fontWeight: 700,
              padding: '5px 11px',
              borderRadius: '8px',
            }}
          >
            오늘의 추천
          </div>
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              padding: '16px',
              background: 'linear-gradient(transparent, rgba(46, 42, 32, .82))',
            }}
          >
            <div style={{ color: '#fff', fontFamily: "'Black Han Sans', sans-serif", fontSize: '20px' }}>
              서울숲 둘레길
            </div>
            <div style={{ color: '#EBE3D2', fontSize: '12px', fontWeight: 500, marginTop: '2px' }}>
              1.2km · 쉬움 · 그늘 많음 · ★4.8
            </div>
          </div>
        </div>

        {/* 반려견 동반 여행지 섹션 */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: '24px' }}>
          <div style={{ fontFamily: "'Black Han Sans', sans-serif", fontSize: '19px', color: '#2E2A20' }}>
            반려견 동반 여행지
          </div>
          <span onClick={goTravel} style={{ fontSize: '12px', color: '#948B79', cursor: 'pointer' }}>
            더 보기 ›
          </span>
        </div>
        
        {/* 여행지 1 */}
        <div
          onClick={goDetail}
          style={{
            marginTop: '13px',
            display: 'flex',
            gap: '13px',
            background: '#FBF7EE',
            border: '1px solid #E6DECE',
            borderRadius: '18px',
            padding: '12px',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '14px',
              flexShrink: 0,
              background: 'repeating-linear-gradient(45deg, #DCD7C5 0 9px, #E6E1D0 9px 18px)',
            }}
          />
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#2E2A20' }}>서울숲 반려견 놀이터</div>
            <div style={{ fontSize: '12px', color: '#948B79', marginTop: '3px' }}>성동구 · 2.1km · ★ 4.8</div>
            <div style={{ display: 'flex', gap: '5px', marginTop: '9px' }}>
              <span style={{ fontSize: '10px', padding: '3px 9px', background: '#E4ECDF', color: '#4C6B4E', borderRadius: '7px', fontWeight: 600 }}>
                대형견 가능
              </span>
              <span style={{ fontSize: '10px', padding: '3px 9px', background: '#EBE3D2', color: '#8C8472', borderRadius: '7px' }}>
                울타리
              </span>
            </div>
          </div>
        </div>

        {/* 여행지 2 */}
        <div
          onClick={goDetail}
          style={{
            marginTop: '11px',
            display: 'flex',
            gap: '13px',
            background: '#FBF7EE',
            border: '1px solid #E6DECE',
            borderRadius: '18px',
            padding: '12px',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '14px',
              flexShrink: 0,
              background: 'repeating-linear-gradient(45deg, #DCD7C5 0 9px, #E6E1D0 9px 18px)',
            }}
          />
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#2E2A20' }}>올댓독 애견 카페</div>
            <div style={{ fontSize: '12px', color: '#948B79', marginTop: '3px' }}>성동구 · 1.4km · ★ 4.6</div>
            <div style={{ display: 'flex', gap: '5px', marginTop: '9px' }}>
              <span style={{ fontSize: '10px', padding: '3px 9px', background: '#E4ECDF', color: '#4C6B4E', borderRadius: '7px', fontWeight: 600 }}>
                실내 동반
              </span>
              <span style={{ fontSize: '10px', padding: '3px 9px', background: '#EBE3D2', color: '#8C8472', borderRadius: '7px' }}>
                주차
              </span>
            </div>
          </div>
        </div>

        {/* 푸터 영역 (가운데 정렬 정책 링크 및 저작권) */}
        <div
          style={{
            marginTop: '32px',
            padding: '24px 0 12px',
            borderTop: '1px solid #E6DECE',
            fontSize: '11px',
            color: '#8C8472',
            lineHeight: '1.6',
            textAlign: 'center',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginBottom: '10px', flexWrap: 'wrap' }}>
            <Link href="/about" style={{ color: '#4C6B4E', fontWeight: 700, textDecoration: 'none' }}>서비스 소개</Link>
            <Link href="/privacy" style={{ color: '#4C6B4E', fontWeight: 700, textDecoration: 'none' }}>개인정보처리방침</Link>
            <Link href="/terms" style={{ color: '#4C6B4E', fontWeight: 700, textDecoration: 'none' }}>이용약관</Link>
          </div>
          <div style={{ color: '#A89F8C', fontSize: '10px', marginTop: '4px' }}>
            © 2026 MungGo. All rights reserved.
          </div>
        </div>

      </div>
    </div>
  );
};
