import React from 'react';
import Link from 'next/link';
import { GlobalFooter } from '../../components/ClientLayout';

export default function AboutPage() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', animation: 'screenIn .28s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '18px 18px 12px', borderBottom: '1px solid #E6DECE' }}>
        <Link href="/" style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#FBF7EE', border: '1px solid #E6DECE', fontSize: '18px', color: '#2E2A20', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
          ‹
        </Link>
        <div style={{ fontSize: '18px', fontWeight: 700, color: '#2E2A20' }}>서비스 소개</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 18px 30px', flex: 1 }}>

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

        {/* 공공데이터 출처 및 저작권 표시 */}
        <section style={{ marginBottom: '20px', background: '#F5F1EA', borderRadius: '14px', padding: '16px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#4C6B4E', marginBottom: '10px' }}>
            📋 공공데이터 활용 출처
          </h3>
          <div style={{ fontSize: '12px', color: '#5A5244', lineHeight: '1.7' }}>
            <div style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid #E6DECE' }}>
              <strong>기상 정보</strong><br />
              기상청 단기예보 조회서비스 (VilageFcstInfoService_2.0)<br />
              <span style={{ color: '#8C8472' }}>출처: 기상청 공공데이터포털 (data.go.kr) · 기상청</span>
            </div>
            <div style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid #E6DECE' }}>
              <strong>반려동물 동반 여행지 정보</strong><br />
              한국관광공사 반려동물 동반여행 서비스 (KorPetTourService2)<br />
              <span style={{ color: '#8C8472' }}>출처: 한국관광공사 공공데이터포털 (data.go.kr) · 한국관광공사</span>
            </div>
            <div>
              <strong>대기질 정보</strong><br />
              에어코리아 대기오염정보 조회 서비스<br />
              <span style={{ color: '#8C8472' }}>출처: 한국환경공단 공공데이터포털 (data.go.kr) · 한국환경공단</span>
            </div>
          </div>
          <p style={{ fontSize: '11px', color: '#A89F8C', marginTop: '10px', marginBottom: 0, lineHeight: '1.5' }}>
            본 서비스는 공공데이터포털(data.go.kr)에서 제공하는 공공데이터를 활용합니다. 데이터 이용 조건은 공공데이터 이용허락 표준라이선스 1.0을 따릅니다.
          </p>
        </section>
        </div>
        <GlobalFooter />
      </div>
    </div>
  );
}
