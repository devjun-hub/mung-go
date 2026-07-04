'use client';

import React, { useEffect, useState } from 'react';
import { GlobalFooter } from './ClientLayout';
import { PlacePlaceholder } from './PlacePlaceholder';

interface PlaceDetail {
  contentId: string;
  title: string;
  addr1: string;
  mapX: number;
  mapY: number;
  firstimage: string | null;
  contentType: string | null;
  tel: string | null;
  overview: string | null;
  acmpyTypeCd: string | null;
  relaPosesFclty: string | null;
  acmpyPsblCpam: string | null;
  acmpyNeedMtr: string | null;
  etcAcmpyInfo: string | null;
}

interface DetailProps {
  contentId: string;
  goTravel: () => void;
}

const CAT_TYPE_LABEL: Record<string, string> = {
  '12': '관광지', '14': '문화시설', '25': '여행코스',
  '28': '레포츠', '32': '숙박', '38': '쇼핑', '39': '음식점',
};

export const Detail: React.FC<DetailProps> = ({ contentId, goTravel }) => {
  const [data, setData] = useState<PlaceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!contentId) return;
    setLoading(true);
    setImgError(false);
    fetch(`/api/places/${contentId}`)
      .then(r => r.json())
      .then((d: PlaceDetail) => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [contentId]);

  // 카카오 지도 길찾기 딥링크
  const openKakaoMap = () => {
    if (!data?.mapX || !data?.mapY) return;
    const name = encodeURIComponent(data.title);
    // 카카오 지도 목적지 링크 (모바일 앱 or 웹 자동 분기)
    window.open(
      `https://map.kakao.com/link/to/${name},${data.mapY},${data.mapX}`,
      '_blank', 'noopener,noreferrer'
    );
  };

  if (loading) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: '240px', background: 'linear-gradient(90deg, #EBE3D2 25%, #F0EAE0 50%, #EBE3D2 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite', flexShrink: 0 }} />
        <div style={{ background: '#F4EEE2', borderRadius: '26px 26px 0 0', marginTop: '-24px', position: 'relative', zIndex: 2, padding: '22px 22px 24px', flex: 1 }}>
          {[70, 45, 95, 55].map((w, i) => (
            <div key={i} style={{ height: i === 0 ? '22px' : '14px', width: `${w}%`, background: '#EBE3D2', borderRadius: '6px', marginBottom: '14px' }} />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', background: '#F4EEE2' }}>
        <div style={{ fontSize: '40px' }}>🐾</div>
        <div style={{ color: '#948B79', fontSize: '14px' }}>장소 정보를 불러오지 못했어요</div>
        <button onClick={goTravel} style={{ padding: '10px 20px', background: '#4C6B4E', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  const hasImg = !!data.firstimage && !imgError;

  // 반려동물 동반 태그 조합
  const rawTags = [
    ...(data.acmpyTypeCd ? data.acmpyTypeCd.split(/[,·;]/).map(s => s.trim()).filter(Boolean) : []),
    ...(data.relaPosesFclty ? data.relaPosesFclty.split(/[,·;]/).map(s => s.trim()).filter(Boolean).slice(0, 3) : []),
  ].filter(t => t.length > 1 && t.length < 30).slice(0, 5);

  // 정보 행 - null/빈 문자열 제외
  const infoRows: { label: string; value: string }[] = [
    data.acmpyNeedMtr?.trim() ? { label: '동반 필요 사항', value: data.acmpyNeedMtr! } : null,
    data.acmpyPsblCpam?.trim() ? { label: '동반 가능 인원', value: data.acmpyPsblCpam! } : null,
    data.etcAcmpyInfo?.trim() ? { label: '기타 안내', value: data.etcAcmpyInfo! } : null,
    data.relaPosesFclty?.trim() && rawTags.length === 0 ? { label: '보유 시설', value: data.relaPosesFclty! } : null,
    data.tel?.trim() ? { label: '전화번호', value: data.tel! } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  const addrShort = data.addr1 ? data.addr1.split(' ').slice(0, 3).join(' ') : '';

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', animation: 'screenIn .28s ease' }}>
      <div style={{ flex: 1, overflowY: 'auto' }}>

        {/* 이미지 배너 */}
        <div style={{ height: '240px', position: 'relative', background: '#DCD7C5', overflow: 'hidden', flexShrink: 0 }}>
          {hasImg ? (
            <img
              src={data.firstimage!}
              alt={data.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={() => setImgError(true)}
            />
          ) : (
            <PlacePlaceholder title={data.title} contentType={data.contentType ?? undefined} />
          )}
          <button
            onClick={goTravel}
            style={{ position: 'absolute', top: '18px', left: '18px', width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(251,247,238,.92)', border: 'none', fontSize: '18px', color: '#2E2A20', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
          >
            ‹
          </button>
          <div style={{ position: 'absolute', left: '18px', bottom: '18px', background: '#4C6B4E', color: '#FBF7EE', fontSize: '11px', fontWeight: 700, padding: '5px 12px', borderRadius: '8px' }}>
            반려동물 동반 가능
          </div>
        </div>

        {/* 본문 카드 */}
        <div style={{ background: '#F4EEE2', borderRadius: '26px 26px 0 0', marginTop: '-24px', position: 'relative', zIndex: 2, padding: '22px 22px 32px' }}>

          {/* 제목 */}
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#2E2A20', letterSpacing: '-0.3px', marginBottom: '6px' }}>
            {data.title}
          </div>

          {/* 주소 */}
          {data.addr1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#948B79', marginBottom: rawTags.length > 0 ? '14px' : '18px' }}>
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              {data.addr1}
            </div>
          )}

          {/* 태그 */}
          {rawTags.length > 0 && (
            <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', marginBottom: '18px' }}>
              {rawTags.map((tag, i) => (
                <span key={i} style={{ fontSize: '12px', padding: '6px 12px', background: i === 0 ? '#E4ECDF' : '#EBE3D2', color: i === 0 ? '#4C6B4E' : '#7A7260', borderRadius: '9px', fontWeight: i === 0 ? 600 : 400 }}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* 기본 위치 정보 카드 */}
          <div style={{ background: '#FBF7EE', border: '1px solid #E6DECE', borderRadius: '16px', padding: '4px 16px', marginBottom: '18px' }}>
            <InfoRow label="주소" value={data.addr1 || '-'} />
            {data.tel && <InfoRow label="전화" value={data.tel} last />}
          </div>

          {/* 반려동물 동반 상세 정보 */}
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#2E2A20', marginBottom: '10px' }}>
            반려동물 동반 안내
          </div>

          {infoRows.length > 0 ? (
            <div style={{ background: '#FBF7EE', border: '1px solid #E6DECE', borderRadius: '16px', padding: '4px 16px', marginBottom: '18px' }}>
              {infoRows.map((row, i) => (
                <div key={i} style={{ padding: '12px 0', borderBottom: i < infoRows.length - 1 ? '1px solid #EFE8DA' : 'none' }}>
                  <div style={{ fontSize: '11px', color: '#948B79', fontWeight: 600, letterSpacing: '0.3px', marginBottom: '3px' }}>
                    {row.label.toUpperCase()}
                  </div>
                  <div style={{ fontSize: '13px', color: '#2E2A20', lineHeight: 1.5 }}>
                    {row.value}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: '#FBF7EE', border: '1px dashed #D8CEBA', borderRadius: '14px', padding: '18px 16px', marginBottom: '18px' }}>
              <div style={{ fontSize: '13px', color: '#948B79', textAlign: 'center', lineHeight: 1.7 }}>
                반려동물 동반 조건(입장료·목줄·크기 제한 등)은<br />
                방문 전 <strong style={{ color: '#C16A43' }}>전화 또는 공식 채널</strong>로 확인하세요
              </div>
              {data.tel && (
                <a
                  href={`tel:${data.tel.replace(/[^0-9]/g, '')}`}
                  style={{ display: 'block', marginTop: '12px', padding: '10px', background: '#F4EEE2', borderRadius: '10px', textAlign: 'center', color: '#4C6B4E', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}
                >
                  📞 {addrShort} 문의하기
                </a>
              )}
              {!data.tel && (
                <div style={{ marginTop: '10px', fontSize: '12px', color: '#B8B0A0', textAlign: 'center' }}>
                  등록된 전화번호가 없습니다
                </div>
              )}
            </div>
          )}

          {/* 출처 */}
          <div style={{ fontSize: '10px', color: '#B8B0A0', lineHeight: 1.5 }}>
            출처: 한국관광공사 KorPetTourService2 · 공공데이터포털(data.go.kr) · 공공누리 제1유형
          </div>
        </div>
        <GlobalFooter />
      </div>

      {/* 하단 액션 */}
      <div style={{ display: 'flex', gap: '10px', padding: '14px 20px 18px', borderTop: '1px solid #E6DECE', background: '#FBF7EE', flexShrink: 0 }}>
        {data.tel && (
          <a
            href={`tel:${data.tel.replace(/[^0-9]/g, '')}`}
            style={{ width: '50px', height: '50px', borderRadius: '15px', border: '1.5px solid #E6DECE', background: '#FBF7EE', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontSize: '18px', flexShrink: 0 }}
          >
            📞
          </a>
        )}
        <button
          onClick={openKakaoMap}
          disabled={!data.mapX || !data.mapY}
          style={{
            flex: 1, height: '50px', borderRadius: '15px', border: 'none',
            background: data.mapX && data.mapY ? '#C16A43' : '#C9BFA9',
            color: '#FBF7EE', fontSize: '15px', fontWeight: 700,
            cursor: data.mapX && data.mapY ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
          카카오 지도로 길찾기
        </button>
      </div>
    </div>
  );
};

function InfoRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '12px 0', borderBottom: last ? 'none' : '1px solid #EFE8DA', fontSize: '13px', gap: '12px' }}>
      <span style={{ color: '#948B79', flexShrink: 0 }}>{label}</span>
      <span style={{ color: '#2E2A20', fontWeight: 500, textAlign: 'right', flex: 1 }}>{value}</span>
    </div>
  );
}
