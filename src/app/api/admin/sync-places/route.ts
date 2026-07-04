import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '../../../../lib/supabase/server';

const TOUR_BASE = 'https://apis.data.go.kr/B551011/KorPetTourService2';

// 전국 주요 시도 코드 (areaCode)
const AREA_CODES = [1, 2, 3, 4, 5, 6, 7, 8, 31, 32, 33, 34, 35, 36, 37, 38, 39];

interface RawItem {
  contentid: string;
  title: string;
  addr1: string;
  addr2?: string;
  mapx: string;
  mapy: string;
  firstimage?: string;
  firstimage2?: string;
  cat1?: string;
  cat2?: string;
  cat3?: string;
  contenttypeid?: string;
  sigungucode?: string;
}

async function fetchByArea(areaCode: number, serviceKey: string, pageNo = 1): Promise<RawItem[]> {
  const params = new URLSearchParams({
    serviceKey,
    MobileOS: 'ETC',
    MobileApp: 'MungGo',
    _type: 'json',
    areaCode: String(areaCode),
    numOfRows: '100',
    pageNo: String(pageNo),
    arrange: 'A',
  });
  const url = `${TOUR_BASE}/areaBasedList2?${params}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  let json: unknown;
  try { json = await res.json(); } catch { return []; }
  const raw = (json as { response: { body: { items: { item: RawItem | RawItem[] } } } })
    ?.response?.body?.items?.item;
  if (!raw) return [];
  return Array.isArray(raw) ? raw : [raw];
}

function extractSido(addr: string): string {
  return addr?.split(' ')[0] ?? '';
}
function extractSigungu(addr: string): string {
  return addr?.split(' ')[1] ?? '';
}

/**
 * 관광공사 전국 반려동물 동반 여행지 일괄 수집 → Supabase upsert
 * POST /api/admin/sync-places
 * Header: x-admin-key 로 간단 보호
 */
export async function POST(request: NextRequest) {
  // 간단 어드민 보호
  const adminKey = request.headers.get('x-admin-key');
  if (adminKey !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const serviceKey = process.env.DATA_GO_KR_SERVICE_KEY;
  if (!serviceKey) return NextResponse.json({ error: 'DATA_GO_KR_SERVICE_KEY not set' }, { status: 500 });

  const supabase = getServiceClient();
  let total = 0;
  let errors = 0;

  for (const areaCode of AREA_CODES) {
    // 최대 3페이지 (300건/시도)
    for (let page = 1; page <= 3; page++) {
      const items = await fetchByArea(areaCode, serviceKey, page);
      if (items.length === 0) break;

      const rows = items.map((item) => ({
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
        first_image: item.firstimage ?? null,
        first_image2: item.firstimage2 ?? null,
        region_sido: extractSido(item.addr1 ?? ''),
        region_sigungu: extractSigungu(item.addr1 ?? ''),
        source: 'tour_api',
        synced_at: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from('pet_places')
        .upsert(rows, { onConflict: 'content_id' });

      if (error) {
        console.error(`sync-places upsert error (area ${areaCode}, page ${page}):`, error.message);
        errors++;
      } else {
        total += rows.length;
      }

      // API rate limit 방지
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  return NextResponse.json({ synced: total, errors, message: `동기화 완료: ${total}건` });
}

/**
 * 카카오 동물병원 데이터 수집 (특정 지역 기준)
 * POST /api/admin/sync-places?type=vet&sido=서울
 */
export async function GET(request: NextRequest) {
  const adminKey = request.headers.get('x-admin-key');
  if (adminKey !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const sido = searchParams.get('sido') ?? '서울';
  const kakaoKey = process.env.KAKAO_REST_API_KEY;
  if (!kakaoKey) return NextResponse.json({ error: 'KAKAO_REST_API_KEY not set' }, { status: 500 });

  const supabase = getServiceClient();
  const query = `${sido} 동물병원`;

  let total = 0;
  let page = 1;

  while (page <= 5) {
    const params = new URLSearchParams({
      query,
      size: '15',
      page: String(page),
    });
    const res = await fetch(`https://dapi.kakao.com/v2/local/search/keyword.json?${params}`, {
      headers: { Authorization: `KakaoAK ${kakaoKey}` },
    });
    if (!res.ok) break;
    const data: {
      documents: Array<{
        id: string;
        place_name: string;
        address_name: string;
        road_address_name: string;
        y: string;
        x: string;
        phone: string;
        place_url: string;
      }>;
      meta: { is_end: boolean };
    } = await res.json();

    const rows = data.documents.map((d) => ({
      kakao_id: d.id,
      place_name: d.place_name,
      address: d.address_name,
      road_address: d.road_address_name,
      lat: Number(d.y),
      lng: Number(d.x),
      phone: d.phone,
      place_url: d.place_url,
      region_sido: sido,
      region_sigungu: d.address_name?.split(' ')[1] ?? '',
      synced_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from('vet_places')
      .upsert(rows, { onConflict: 'kakao_id' });

    if (!error) total += rows.length;
    if (data.meta.is_end) break;
    page++;
    await new Promise((r) => setTimeout(r, 100));
  }

  return NextResponse.json({ synced: total, sido });
}
