import React from 'react';
import { SignupWizardProps } from '../types';
import { GlobalFooter } from './ClientLayout';

/**
 * 회원가입 및 온보딩 마법사 컴포넌트
 * @param props 각 가입 단계별 입력 제어 및 다음/이전 단계 액션 콜백
 * @returns 3단계 가입 절차 마법사 UI
 */
export const SignupWizard: React.FC<SignupWizardProps> = ({
  signupStep,
  welcomeLine,
  dogName,
  dot0,
  dot1,
  dot2,
  sizeOptions,
  onDogName,
  signupNext,
  signupBack,
  finishSignup,
  goHome,
}) => {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', animation: 'screenIn .28s ease' }}>
      
      {/* 상단 스텝 프로그레스 인디케이터 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '18px 20px 8px' }}>
        <button
          onClick={signupBack}
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
        <div style={{ display: 'flex', gap: '6px' }}>
          <span style={dot0} />
          <span style={dot1} />
          <span style={dot2} />
        </div>
      </div>

      {/* Step 0: 계정 생성 및 로그인 단계 */}
      {signupStep === 0 && (
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 24px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ fontFamily: "'Black Han Sans', sans-serif", fontSize: '30px', color: '#2E2A20', lineHeight: 1.1 }}>
            MungGo
            <br />
            시작하기
          </div>
          <div style={{ fontSize: '14px', color: '#8C8678', marginTop: '10px', lineHeight: 1.55 }}>
            반려견과 가본 여행지를 저장하고,
            <br />
            산책의 감정을 기록해보세요.
          </div>
          
          <div style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              placeholder="이메일"
              style={{
                height: '52px',
                borderRadius: '14px',
                border: '1.5px solid #E6DECE',
                background: '#FBF7EE',
                padding: '0 16px',
                fontSize: '15px',
                color: '#2E2A20',
                outline: 'none',
              }}
            />
            <input
              type="password"
              placeholder="비밀번호"
              style={{
                height: '52px',
                borderRadius: '14px',
                border: '1.5px solid #E6DECE',
                background: '#FBF7EE',
                padding: '0 16px',
                fontSize: '15px',
                color: '#2E2A20',
                outline: 'none',
              }}
            />
          </div>
          
          <button
            onClick={signupNext}
            style={{
              marginTop: '16px',
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
            다음
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '22px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#E6DECE' }} />
            <span style={{ fontSize: '12px', color: '#A89F8C' }}>또는</span>
            <div style={{ flex: 1, height: '1px', background: '#E6DECE' }} />
          </div>
          
          <button
            onClick={signupNext}
            style={{
              height: '50px',
              borderRadius: '14px',
              border: '1.5px solid #2E2A20',
              background: '#F4EEE2',
              color: '#2E2A20',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            소셜 계정으로 계속하기
          </button>
          
          <div style={{ flex: 1 }} />
          
          <button
            onClick={goHome}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '13px',
              color: '#948B79',
              marginTop: '18px',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            로그인 없이 둘러보기
          </button>
        </div>
        <GlobalFooter />
      </div>
      )}

      {/* Step 1: 반려견 프로필 정보 입력 단계 */}
      {signupStep === 1 && (
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 24px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ fontFamily: "'Black Han Sans', sans-serif", fontSize: '27px', color: '#2E2A20', lineHeight: 1.15 }}>
            반려견을
            <br />
            소개해주세요
          </div>
          
          <div
            style={{
              margin: '24px auto 0',
              width: '96px',
              height: '96px',
              borderRadius: '50%',
              background: 'repeating-linear-gradient(45deg, #DCD7C5 0 8px, #E6E1D0 8px 16px)',
              border: '1px solid #E6DECE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '38px',
            }}
          >
            🐶
          </div>
          
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#2E2A20', marginTop: '24px' }}>이름</div>
          <input
            value={dogName}
            onChange={onDogName}
            placeholder="예) 초코"
            style={{
              height: '52px',
              borderRadius: '14px',
              border: '1.5px solid #E6DECE',
              background: '#FBF7EE',
              padding: '0 16px',
              fontSize: '15px',
              color: '#2E2A20',
              outline: 'none',
              marginTop: '8px',
            }}
          />
          
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#2E2A20', marginTop: '18px' }}>크기</div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            {sizeOptions.map((sz, idx) => (
              <button key={idx} onClick={sz.pick} style={sz.box}>
                {sz.label}
              </button>
            ))}
          </div>
          
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#2E2A20', marginTop: '18px' }}>
            견종 <span style={{ color: '#A89F8C', fontWeight: 400 }}>(선택)</span>
          </div>
          <input
            placeholder="예) 푸들"
            style={{
              height: '52px',
              borderRadius: '14px',
              border: '1.5px solid #E6DECE',
              background: '#FBF7EE',
              padding: '0 16px',
              fontSize: '15px',
              color: '#2E2A20',
              outline: 'none',
              marginTop: '8px',
            }}
          />
          
          <div style={{ flex: 1 }} />
          
          <button
            onClick={signupNext}
            style={{
              marginTop: '24px',
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
            다음
          </button>
        </div>
        <GlobalFooter />
      </div>
      )}

      {/* Step 2: 완료 환영 페이지 */}
      {signupStep === 2 && (
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', flex: 1 }}>
          <div
            style={{
              width: '96px',
              height: '96px',
              borderRadius: '50%',
              background: '#4C6B4E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '46px',
              color: '#fff',
              animation: 'pop .4s cubic-bezier(.2, 1.2, .3, 1)',
            }}
          >
            ✓
          </div>
          <div style={{ fontFamily: "'Black Han Sans', sans-serif", fontSize: '28px', color: '#2E2A20', marginTop: '24px' }}>
            환영해요!
          </div>
          <div style={{ fontSize: '15px', color: '#6E6553', marginTop: '10px', lineHeight: 1.6 }}>
            {welcomeLine}
            <br />
            이제 함께 MungGo를 시작해볼까요?
          </div>
          
          <div style={{ flex: 1 }} />
          
          <button
            onClick={finishSignup}
            style={{
              width: '100%',
              height: '54px',
              borderRadius: '15px',
              border: 'none',
              background: '#C16A43',
              color: '#FBF7EE',
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            MungGo 시작하기
          </button>
        </div>
        <GlobalFooter />
      </div>
      )}
    </div>
  );
};
