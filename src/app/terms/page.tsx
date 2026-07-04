import React from 'react';
import Link from 'next/link';
import { GlobalFooter } from '../../components/ClientLayout';

export default function TermsPage() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', animation: 'screenIn .28s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '18px 18px 12px', borderBottom: '1px solid #E6DECE' }}>
        <Link href="/" style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#FBF7EE', border: '1px solid #E6DECE', fontSize: '18px', color: '#2E2A20', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
          ‹
        </Link>
        <div style={{ fontSize: '18px', fontWeight: 700, color: '#2E2A20' }}>서비스 이용약관</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 18px 30px', flex: 1 }}>
          <div style={{ color: '#8C8472', fontSize: '12px', marginBottom: '14px' }}>시행일자: 2026년 06월 27일</div>

        <section style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#4C6B4E', marginBottom: '6px' }}>제1조 (목적)</h3>
          <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#4A4538', margin: 0 }}>
            본 약관은 멍고(MungGo) 서비스가 보호자 회원에게 제공하는 반려견 산책 정보 연동 서비스의 이용 조건과 절차를 규정합니다.
          </p>
        </section>

        <section style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#4C6B4E', marginBottom: '6px' }}>제2조 (위치 정보)</h3>
          <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#4A4538', margin: 0 }}>
            회사는 기상 예보 격자 변환 및 지역 주소 확인을 위해 GPS 좌표를 실시간 일회성으로 조회 처리할 수 있으며, 이 데이터는 외부 서버에 영구 보관되지 않습니다.
          </p>
        </section>

        <section style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#4C6B4E', marginBottom: '6px' }}>제3조 (개인정보와 일기 보안)</h3>
          <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#4A4538', margin: 0 }}>
            가입 시 수집된 강아지 이름·크기 정보는 맞춤 지수 연산 목적으로만 사용됩니다. 일기장 피드 데이터는 AES-256 규격 암호화가 기본 적용됩니다.
          </p>
        </section>

        <section style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#4C6B4E', marginBottom: '6px' }}>제4조 (공공데이터 활용 및 저작권)</h3>
          <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#4A4538', marginBottom: '10px' }}>
            멍고 서비스는 아래 공공기관의 공공데이터를 활용합니다. 각 데이터는 해당 기관의 이용허락 조건을 따릅니다.
          </p>
          <div style={{ background: '#F5F1EA', borderRadius: '12px', padding: '14px', fontSize: '12px', color: '#5A5244', lineHeight: '1.8' }}>
            <div>① <strong>기상청</strong> — 단기예보 조회서비스 (VilageFcstInfoService_2.0)</div>
            <div style={{ color: '#8C8472', paddingLeft: '14px', marginBottom: '6px' }}>
              출처: 기상청, 공공데이터포털(data.go.kr)<br />
              이용조건: 공공데이터 이용허락 표준라이선스 1.0 (공공누리 제1유형)
            </div>
            <div>② <strong>한국관광공사</strong> — 반려동물 동반여행 서비스 (KorPetTourService2)</div>
            <div style={{ color: '#8C8472', paddingLeft: '14px', marginBottom: '6px' }}>
              출처: 한국관광공사, 공공데이터포털(data.go.kr)<br />
              이용조건: 공공데이터 이용허락 표준라이선스 1.0 (공공누리 제1유형)
            </div>
            <div>③ <strong>한국환경공단</strong> — 에어코리아 대기오염정보 조회서비스</div>
            <div style={{ color: '#8C8472', paddingLeft: '14px' }}>
              출처: 한국환경공단, 공공데이터포털(data.go.kr)<br />
              이용조건: 공공데이터 이용허락 표준라이선스 1.0 (공공누리 제1유형)
            </div>
          </div>
          <p style={{ fontSize: '11px', color: '#A89F8C', marginTop: '10px', marginBottom: 0, lineHeight: '1.5' }}>
            공공누리 제1유형은 출처 표시 조건 하에 자유로운 이용·복제·배포·변경을 허용합니다. 자세한 내용은 <a href="https://www.kogl.or.kr" target="_blank" rel="noopener noreferrer" style={{ color: '#4C6B4E' }}>공공누리(kogl.or.kr)</a>를 참고하세요.
          </p>
        </section>

        <section style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#4C6B4E', marginBottom: '6px' }}>제5조 (면책사항)</h3>
          <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#4A4538', margin: 0 }}>
            본 서비스의 산책지수는 참고용 정보이며, 실제 기상 상황은 다를 수 있습니다. 산책 중 반려견 안전은 보호자의 책임 하에 있습니다. 서비스는 공공데이터 API 운영 상태에 따라 일시적으로 제한될 수 있습니다.
          </p>
        </section>
        </div>
        <GlobalFooter />
      </div>
    </div>
  );
}
