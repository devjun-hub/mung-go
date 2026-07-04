import React from 'react';
import Link from 'next/link';
import { GlobalFooter } from '../../components/ClientLayout';

/**
 * 개인정보처리방침 페이지 컴포넌트
 * 가상 모바일 쉘 크기에 특화된 스크롤 구조와 플랫 테마 스타일링 적용
 */
export default function PrivacyPage() {
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
        <div style={{ fontSize: '18px', fontWeight: 700, color: '#2E2A20' }}>개인정보처리방침</div>
      </div>

      {/* 정책 서류 상세 내용 스크롤 본문 */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 18px 30px', flex: 1 }}>
        <div style={{ color: '#8C8472', fontSize: '12px', marginBottom: '14px' }}>시행일자: 2026년 06월 25일</div>

        <section style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#4C6B4E', marginBottom: '6px' }}>1. 수집 목적</h3>
          <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#4A4538', margin: 0 }}>
            회원의 가입 의사 확인, 서비스 계정 식별 및 산책 지수(Mung Index)의 반려견 맞춤 연산을 위해 개인정보를 처리합니다.
          </p>
        </section>

        <section style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#4C6B4E', marginBottom: '6px' }}>2. 수집 정보</h3>
          <ul style={{ fontSize: '13px', lineHeight: '1.6', color: '#4A4538', paddingLeft: '18px', margin: 0 }}>
            <li><strong>계정</strong>: 이메일, 비밀번호</li>
            <li><strong>반려견</strong>: 이름, 크기 (소/중/대형), 견종</li>
            <li><strong>위치</strong>: 실시간 브라우저 GPS 좌표 (주소 변환 및 날씨 매칭 후 즉각 삭제)</li>
          </ul>
        </section>

        <section style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#4C6B4E', marginBottom: '6px' }}>3. 일기 데이터 암호화</h3>
          <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#4A4538', margin: 0 }}>
            사용자가 기록하는 산책 일기와 감정 텍스트 피드는 DB 보존 시 AES-256 규격 암호화 알고리즘이 상시 적용되어 강력하게 보안 관리됩니다.
          </p>
        </section>

        <section style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#4C6B4E', marginBottom: '6px' }}>4. 보유 기간</h3>
          <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#4A4538', margin: 0 }}>
            회원 탈퇴 처리 시 혹은 개인정보 수집 목적이 달성된 즉시 수집한 회원 정보를 영구 파기합니다.
          </p>
        </section>
        </div>
        <GlobalFooter />
      </div>
    </div>
  );
}
