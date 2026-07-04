/**
 * 반려동물 동반여행 데이터 시딩 스크립트
 * 실행: node scripts/seed-pet-places.mjs
 *
 * 환경변수 필요:
 *   DATA_GO_KR_SERVICE_KEY (디코딩 키)
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// .env 수동 파싱 (dotenv 없이)
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
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    envVars[key] = val;
  }
} catch {}

const DATA_KEY = envVars.DATA_GO_KR_SERVICE_KEY || process.env.DATA_GO_KR_SERVICE_KEY;
const SB_URL = envVars.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SB_KEY = envVars.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!DATA_KEY) { console.error('DATA_GO_KR_SERVICE_KEY missing'); process.exit(1); }
if (!SB_URL || !SB_KEY) { console.error('Supabase credentials missing'); process.exit(1); }

const BASE = 'https://apis.data.go.kr/B551011/KorPetTourService2';
const supabase = createClient(SB_URL, SB_KEY, { auth: { persistSession: false } });

// 전국 시도 코드
const AREAS = [
  { code: 1, name: '서울' },
  { code: 2, name: '인천' },
  { code: 3, name: '대전' },
  { code: 4, name: '대구' },
  { code: 5, name: '광주' },
  { code: 6, name: '부산' },
  { code: 7, name: '울산' },
  { code: 8, name: '세종' },
  { code: 31, name: '경기' },
  { code: 32, name: '강원' },
  { code: 33, name: '충북' },
  { code: 34, name: '충남' },
  { code: 35, name: '경북' },
  { code: 36, name: '경남' },
  { code: 37, name: '전북' },
  { code: 38, name: '전남' },
  { code: 39, name: '제주' },
];

async function fetchArea(areaCode, pageNo = 1) {
  const params = new URLSearchParams({
    serviceKey: DATA_KEY,
    MobileOS: 'ETC',
    MobileApp: 'MungGo',
    _type: 'json',
    areaCode: String(areaCode),
    numOfRows: '100',
    pageNo: String(pageNo),
  });
  const url = `${BASE}/areaBasedList2?${params}`;
  const res = await fetch(url);
  if (!res.ok) { console.warn(`  HTTP ${res.status} areaCode=${areaCode} page=${pageNo}`); return { items: [], total: 0 }; }
  const json = await res.json();
  const body = json?.response?.body;
  const raw = body?.items?.item;
  const items = !raw ? [] : Array.isArray(raw) ? raw : [raw];
  return { items, total: Number(body?.totalCount ?? 0) };
}

async function fetchPetDetail(contentId) {
  const params = new URLSearchParams({
    serviceKey: DATA_KEY,
    MobileOS: 'ETC',
    MobileApp: 'MungGo',
    _type: 'json',
    contentId,
  });
  const url = `${BASE}/detailPetTour2?${params}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const json = await res.json();
  const raw = json?.response?.body?.items?.item;
  return Array.isArray(raw) ? raw[0] : raw;
}

async function main() {
  console.log('🐾 반려동물 동반여행 데이터 시딩 시작...\n');
  let totalSynced = 0;
  let totalErrors = 0;

  for (const area of AREAS) {
    process.stdout.write(`📍 ${area.name} (${area.code}) 수집 중...`);
    let page = 1;
    let areaSynced = 0;

    while (true) {
      const { items, total } = await fetchArea(area.code, page);
      if (items.length === 0) break;

      // detailPetTour2 병렬 조회 (최대 5개씩)
      const withDetails = [];
      for (let i = 0; i < items.length; i += 5) {
        const batch = items.slice(i, i + 5);
        const details = await Promise.all(
          batch.map(item => fetchPetDetail(item.contentid).catch(() => null))
        );
        for (let j = 0; j < batch.length; j++) {
          withDetails.push({ item: batch[j], detail: details[j] });
        }
        await sleep(100);
      }

      const rows = withDetails.map(({ item, detail }) => ({
        content_id: item.contentid,
        title: item.title,
        addr1: item.addr1 ?? '',
        addr2: item.addr2 ?? null,
        map_x: Number(item.mapx) || null,
        map_y: Number(item.mapy) || null,
        cat1: item.cat1 ?? null,
        cat2: item.cat2 ?? null,
        cat3: item.cat3 ?? null,
        content_type: item.contenttypeid ?? null,
        first_image: item.firstimage || null,
        first_image2: item.firstimage2 || null,
        region_sido: area.name,
        region_sigungu: item.addr1?.split(' ')[1] ?? '',
        // 반려동물 상세
        acmpy_type: detail?.acmpyTypeCd ?? null,
        rela_fclty: detail?.relaPosesFclty ?? null,
        acmpy_info: detail?.etcAcmpyInfo ?? null,
        source: 'tour_api',
        synced_at: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from('pet_places')
        .upsert(rows, { onConflict: 'content_id' });

      if (error) {
        console.error(`\n  Supabase error: ${error.message}`);
        totalErrors++;
      } else {
        areaSynced += rows.length;
        totalSynced += rows.length;
      }

      if (items.length < 100 || areaSynced >= total) break;
      page++;
      await sleep(300);
    }

    console.log(` ${areaSynced}건`);
  }

  console.log(`\n✅ 완료: 총 ${totalSynced}건 저장, 오류 ${totalErrors}건`);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

main().catch(console.error);
