import React from 'react';
import Link from 'next/link';

/**
 * 이용약관 페이지 컴포넌트
 * 가상 모바일 쉘 크기에 특화된 스크롤 구조와 플랫 테마 스타일링 적용
 */
export default function TermsPage() {
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
        <div style={{ fontSize: '18px', fontWeight: 700, color: '#2E2A20' }}>서비스 이용약관</div>
      </div>

      {/* 이용약관 내용 스크롤 본문 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 18px 30px' }}>
        <div style={{ color: '#8C8472', fontSize: '12px', marginBottom: '14px' }}>시행일자: 2026년 06월 25일</div>

        <section style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#4C6B4E', marginBottom: '6px' }}>제1조 (목적)</h3>
          <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#4A4538', margin: 0 }}>
            본 약관은 멍고(MungGo) 서비스가 보호자 회원에게 제공하는 반려견 산책 정보 연동 정보의 가이드라인과 절차를 규정합니다.
          </p>
        </section>

        <section style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#4C6B4E', marginBottom: '6px' }}>제2조 (위치 정보)</h3>
          <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#4A4538', margin: 0 }}>
            회사는 기상 예보 격자 변환 및 지역 주소 확인을 위해 GPS 좌표를 실시간 일회성 조회 처리할 수 있으며, 이 데이터는 외부 서버에 보관되지 않습니다.
          </p>
        </section>

        <section style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#4C6B4E', marginBottom: '6px' }}>제3조 (개인정보와 일기 보안)</h3>
          <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#4A4538', margin: 0 }}>
            가입 시 수입된 강아지 이름, 크기 정보는 맞춤 지수 연산용으로 한정 적용됩니다. 일기장 피드 데이터는 AES-256 규격 암호화가 기본 적용되어 침해를 막습니다.
          </p>
        </section>

        <div style={{ textAlign: 'center', fontSize: '10px', color: '#A89F8C', marginTop: '28px', borderTop: '1px solid #EFE8DA', paddingTop: '16px' }}>
          © 2026 MungGo. All rights reserved.
        </div>
      </div>
    </div>
  );
}
