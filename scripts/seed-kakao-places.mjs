/**
 * 카카오 로컬 API로 반려동물 관련 장소 추가 시딩
 * 실행: node scripts/seed-kakao-places.mjs
 *
 * pet_places 테이블에 kakao_ 접두사 content_id로 upsert
 * 기존 관광공사 데이터와 충돌 없음
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dir, '../.env');
const envVars = {};
try {
  const content = readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx < 0) continue;
    envVars[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
  }
} catch {}

const KAKAO_KEY = envVars.KAKAO_REST_API_KEY || process.env.KAKAO_REST_API_KEY;
const SB_URL    = envVars.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SB_KEY    = envVars.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!KAKAO_KEY) { console.error('KAKAO_REST_API_KEY missing'); process.exit(1); }
if (!SB_URL || !SB_KEY) { console.error('Supabase credentials missing'); process.exit(1); }

const supabase = createClient(SB_URL, SB_KEY, { auth: { persistSession: false } });

// 검색할 키워드 + 대표 시도 지역 조합
const KEYWORDS = ['반려견카페', '펫카페', '애견카페', '펫호텔', '반려견호텔', '애견호텔', '반려견수영장', '반려견운동장', '반려동물동반', '반려견동반'];

// 전국 주요 좌표 (카카오 로컬은 좌표 기반 반경 검색)
const CENTERS = [
  { name: '서울',   x: 126.9780, y: 37.5665 },
  { name: '인천',   x: 126.7052, y: 37.4563 },
  { name: '경기북', x: 127.0500, y: 37.8000 },
  { name: '경기남', x: 127.0500, y: 37.2000 },
  { name: '경기서', x: 126.8000, y: 37.3500 },
  { name: '대전',   x: 127.3845, y: 36.3504 },
  { name: '대구',   x: 128.6014, y: 35.8714 },
  { name: '부산',   x: 129.0756, y: 35.1796 },
  { name: '광주',   x: 126.8526, y: 35.1595 },
  { name: '울산',   x: 129.3114, y: 35.5384 },
  { name: '강원',   x: 128.2000, y: 37.7000 },
  { name: '충북',   x: 127.4800, y: 36.6300 },
  { name: '충남',   x: 126.8000, y: 36.5000 },
  { name: '전북',   x: 127.1000, y: 35.8200 },
  { name: '전남',   x: 126.9000, y: 34.8000 },
  { name: '경북',   x: 128.7000, y: 36.4000 },
  { name: '경남',   x: 128.3000, y: 35.4000 },
  { name: '제주',   x: 126.5312, y: 33.4996 },
];

async function searchKakao(keyword, x, y) {
  const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(keyword)}&x=${x}&y=${y}&radius=20000&size=15&sort=distance`;
  const res = await fetch(url, { headers: { Authorization: `KakaoAK ${KAKAO_KEY}` } });
  if (!res.ok) { console.warn(`  Kakao ${res.status} keyword=${keyword}`); return []; }
  const json = await res.json();
  return json.documents ?? [];
}

async function main() {
  console.log('🐾 카카오 로컬 반려동물 장소 추가 시딩 시작...\n');
  let totalSynced = 0;
  const seenIds = new Set();

  for (const center of CENTERS) {
    let centerSynced = 0;
    process.stdout.write(`📍 ${center.name} 수집 중...`);

    for (const keyword of KEYWORDS) {
      await sleep(200);
      const docs = await searchKakao(keyword, center.x, center.y);

      const rows = docs
        .filter(d => {
          const id = `kakao_${d.id}`;
          if (seenIds.has(id)) return false;
          seenIds.add(id);
          return true;
        })
        .map(d => ({
          content_id:    `kakao_${d.id}`,
          title:         d.place_name,
          addr1:         d.road_address_name || d.address_name,
          addr2:         null,
          map_x:         Number(d.x),
          map_y:         Number(d.y),
          cat1:          null,
          cat2:          null,
          cat3:          d.category_name?.split(' > ').pop() ?? null,
          content_type:  d.category_group_code ?? null,
          first_image:   null,
          first_image2:  null,
          region_sido:   center.name,
          region_sigungu: d.address_name?.split(' ')[1] ?? '',
          acmpy_type:    '반려동물 동반 가능',
          rela_fclty:    null,
          acmpy_info:    d.phone ? `전화: ${d.phone}` : null,
          source:        'kakao_local',
          synced_at:     new Date().toISOString(),
        }));

      if (rows.length === 0) continue;

      const { error } = await supabase
        .from('pet_places')
        .upsert(rows, { onConflict: 'content_id' });

      if (error) {
        console.error(`\n  Supabase error: ${error.message}`);
      } else {
        centerSynced += rows.length;
        totalSynced += rows.length;
      }
    }

    console.log(` ${centerSynced}건`);
  }

  console.log(`\n✅ 완료: 총 ${totalSynced}건 추가, 누적 중복제거 seenIds=${seenIds.size}`);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

main().catch(console.error);
