import React from 'react';

interface PlacePlaceholderProps {
  title: string;
  contentType?: string;
  height?: string | number;
}

export const PlacePlaceholder: React.FC<PlacePlaceholderProps> = ({ title, contentType, height = '100%' }) => {
  // 카테고리 유추
  let category = 'general';
  if (contentType === '39') {
    const isCafe = /카페|커피|다방|디저트|로스터즈|에스프레소/i.test(title);
    category = isCafe ? 'cafe' : 'restaurant';
  } else if (contentType === '32') {
    category = 'accommodation';
  } else if (['12', '14', '25', '28'].includes(contentType ?? '')) {
    category = 'nature';
  }

  // 스타일에 따른 그라디언트 및 아이콘 매핑
  let gradient = 'linear-gradient(135deg, #ECE9E2 0%, #D2C9B9 100%)';
  let icon = '🐾';
  let label = '반려견 추천 장소';

  if (category === 'cafe') {
    gradient = 'linear-gradient(135deg, #EADCC9 0%, #C4B097 100%)';
    icon = '☕';
    label = '카페 / 디저트';
  } else if (category === 'restaurant') {
    gradient = 'linear-gradient(135deg, #FADCD0 0%, #E8B49A 100%)';
    icon = '🍽';
    label = '식당 / 맛집';
  } else if (category === 'accommodation') {
    gradient = 'linear-gradient(135deg, #DCEAD5 0%, #B8D6A3 100%)';
    icon = '🏡';
    label = '반려견 동반 숙소';
  } else if (category === 'nature') {
    gradient = 'linear-gradient(135deg, #D5E1F2 0%, #AEC2E6 100%)';
    icon = '🌿';
    label = '관광지 / 자연';
  }

  return (
    <div style={{
      width: '100%',
      height: height,
      background: gradient,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* 은은한 강아지 발자국 패턴 배경 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.05,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M10 20c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm10-5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm-5 10c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z' fill='%23000' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        pointerEvents: 'none',
      }} />

      {/* 중앙 원형 아이콘 */}
      <div style={{
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.45)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.06)',
        zIndex: 1,
      }}>
        {icon}
      </div>
      
      <span style={{ 
        fontSize: '11px', 
        color: 'rgba(46, 42, 32, 0.65)', 
        fontWeight: 700,
        letterSpacing: '0.2px',
        zIndex: 1 
      }}>
        {label}
      </span>
    </div>
  );
};
