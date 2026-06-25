import React from 'react';
import Link from 'next/link';

/**
 * 서비스 소개 페이지 컴포넌트
 * 가상 모바일 쉘 크기에 특화된 스크롤 구조와 플랫 테마 스타일링 적용
 */
export default function AboutPage() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', animation: 'screenIn .28s ease' }}>
      
      {/* 상단 모바일 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '18px 18px 12px', borderBottom: '1px solid #E6DECE' }}>
        <Link
          href="/"
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
            textDecoration: 'none',
          }}
        >
          ‹
        </Link>
        <div style={{ fontSize: '18px', fontWeight: 700, color: '#2E2A20' }}>서비스 소개</div>
      </div>

      {/* 회사 및 서비스 소개 본문 스크롤 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 18px 30px' }}>
        
        <section style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#4C6B4E', marginBottom: '6px' }}>반려견과 함께 걷는 세상</h3>
          <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#4A4538', margin: 0 }}>
            멍고(MungGo)는 기상 상황 데이터와 강아지의 체급·나이·견종 특성을 조합하여 <strong>우리 강아지만을 위한 개인화 산책 지수</strong>를 산출해 줍니다. 
          </p>
        </section>

        <section style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#4C6B4E', marginBottom: '6px' }}>핵심 가치</h3>
          <ul style={{ fontSize: '13px', lineHeight: '1.6', color: '#4A4538', paddingLeft: '18px', margin: 0 }}>
            <li><strong>지면열 보정 엔진</strong>: 소형견 지면 복사열 보정 및 단두종 호흡 온도 보정</li>
            <li><strong>안전 암호화</strong>: 작성하는 일기 피드 AES-256 보호</li>
            <li><strong>안전 GPS 정책</strong>: 일회성 활용 및 휘발성 위치 관리</li>
          </ul>
        </section>

        <section style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#4C6B4E', marginBottom: '6px' }}>펫 프렌들리 동선</h3>
          <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#4A4538', margin: 0 }}>
            단순한 지도를 넘어 동물병원, 카페, 공원을 잇는 도보 보행자 최적 산책 동선을 발굴하여 제공합니다.
          </p>
        </section>

        <div style={{ textAlign: 'center', fontSize: '10px', color: '#A89F8C', marginTop: '28px', borderTop: '1px solid #EFE8DA', paddingTop: '16px' }}>
          © 2026 MungGo. All rights reserved.
        </div>
      </div>
    </div>
  );
}
