import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getPetFriendlyPlaces, searchPetPlaces, TourPlace } from '../../../lib/tourism';

export interface PlaceResult {
  contentId: string;
  title: string;
  addr1: string;
  mapX: number;
  mapY: number;
  dist?: number;
  firstimage?: string;
  contentType?: string;
}

// DB content_type → 카테고리 매핑
const CATEGORY_TYPES: Record<string, string[]> = {
  관광지: ['12', '14', '25', '28'],
  숙소:   ['32'],
  카페:   ['39'],
  식당:   ['39'],
};

function tourToResult(p: TourPlace): PlaceResult {
  return {
    contentId: p.contentId,
    title: p.title,
    addr1: p.addr1,
    mapX: p.mapX,
    mapY: p.mapY,
    dist: p.dist,
    firstimage: p.firstimage,
  };
}

function getAnonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
  if (!url || !key) return null;
  return createClient(url, key);
}

interface PlaceRow {
  content_id: string;
  title: string;
  addr1: string;
  map_x: number;
  map_y: number;
  first_image: string | null;
  content_type: string | null;
}

/** 앱 레이어에서 거리 계산 */
function calcDist(lat: number, lon: number, rowLat: number, rowLon: number): number {
  return Math.round(
    Math.sqrt(
      Math.pow((rowLat - lat) * 111000, 2) +
      Math.pow((rowLon - lon) * 88000, 2)
    )
  );
}

function rowToResult(row: PlaceRow, lat: number, lon: number): PlaceResult {
  return {
    contentId: row.content_id,
    title: row.title,
    addr1: row.addr1,
    mapX: row.map_x,
    mapY: row.map_y,
    firstimage: row.first_image ?? undefined,
    contentType: row.content_type ?? undefined,
    dist: calcDist(lat, lon, row.map_y, row.map_x),
  };
}

/**
 * 전체 DB 로드 후 앱 레이어 거리순 정렬 + 페이지네이션
 * DB가 667건이므로 전체 메모리 로딩이 가장 정확함
 */
async function queryAllSorted(
  lat: number,
  lon: number,
  page: number,
  pageSize: number,
  contentTypes?: string[],
): Promise<{ places: PlaceResult[]; hasMore: boolean; total: number }> {
  const supabase = getAnonClient();
  if (!supabase) return { places: [], hasMore: false, total: 0 };

  let query = supabase
    .from('pet_places')
    .select('content_id, title, addr1, map_x, map_y, first_image, content_type')
    .not('map_x', 'is', null)
    .not('map_y', 'is', null)
    .limit(2000); // 전체 로드

  if (contentTypes && contentTypes.length > 0) {
    query = query.in('content_type', contentTypes);
  }

  const { data, error } = await query;
  if (error || !data) return { places: [], hasMore: false, total: 0 };

  // 앱 레이어 거리순 정렬
  const sorted = (data as PlaceRow[])
    .map(row => rowToResult(row, lat, lon))
    .sort((a, b) => (a.dist ?? 0) - (b.dist ?? 0));

  const offset = (page - 1) * pageSize;
  const sliced = sorted.slice(offset, offset + pageSize);

  return { places: sliced, hasMore: sorted.length > offset + pageSize, total: sorted.length };
}

/** MapScreen 전용: 반경 내 장소 (최소 N개 보장하기 위해 반경 자동 확장) */
async function queryNearby(
  lat: number,
  lon: number,
  initialRadius: number,
): Promise<PlaceResult[]> {
  const supabase = getAnonClient();
  if (!supabase) return [];

  // 전체 로드 후 거리순 정렬, 반경 내에서 최소 5개 보장
  const { data, error } = await supabase
    .from('pet_places')
    .select('content_id, title, addr1, map_x, map_y, first_image, content_type')
    .not('map_x', 'is', null)
    .not('map_y', 'is', null)
    .limit(2000);

  if (error || !data) return [];

  const allSorted = (data as PlaceRow[])
    .map(row => rowToResult(row, lat, lon))
    .sort((a, b) => (a.dist ?? 0) - (b.dist ?? 0));

  // 반경 내 장소 우선, 없으면 가장 가까운 10개라도 반환
  const withinRadius = allSorted.filter(p => (p.dist ?? 0) <= initialRadius);
  if (withinRadius.length >= 5) return withinRadius.slice(0, 30);

  // 반경 내 부족하면 가장 가까운 순 15개 반환 (거리 표시로 어느 정도 떨어진지 표시)
  return allSorted.slice(0, 15);
}

/** 키워드 텍스트 검색 */
async function queryKeyword(keyword: string, lat: number, lon: number): Promise<PlaceResult[]> {
  const supabase = getAnonClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('pet_places')
    .select('content_id, title, addr1, map_x, map_y, first_image, content_type')
    .ilike('title', `%${keyword}%`)
    .limit(50);

  if (error || !data) return [];
  return (data as PlaceRow[])
    .map(row => rowToResult(row, lat, lon))
    .sort((a, b) => (a.dist ?? 0) - (b.dist ?? 0));
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat      = Number(searchParams.get('lat') ?? '37.5665');
  const lon      = Number(searchParams.get('lon') ?? '126.9780');
  const keyword  = searchParams.get('keyword') ?? '';
  const category = searchParams.get('category') ?? '';
  const page     = Math.max(1, Number(searchParams.get('page') ?? '1'));
  const limit    = Math.min(20, Number(searchParams.get('limit') ?? '20'));
  const radius   = searchParams.get('radius'); // MapScreen 전용

  try {
    // 1. MapScreen 전용 반경 검색
    if (radius) {
      let places = await queryNearby(lat, lon, Number(radius));
      if (places.length === 0) {
        places = (await getPetFriendlyPlaces(lat, lon, Number(radius)).catch(() => [])).map(tourToResult);
      }
      return NextResponse.json({ places, source: 'db' });
    }

    // 2. 키워드 검색
    if (keyword) {
      let places = await queryKeyword(keyword, lat, lon);
      if (places.length === 0) {
        places = (await searchPetPlaces(keyword).catch(() => [])).map(tourToResult);
      }
      return NextResponse.json({ places, hasMore: false, total: places.length, source: 'db' });
    }

    // 3. 카테고리 탭 + 전체 — 전체 DB 로드 후 거리순 정렬 + 페이지네이션
    const contentTypes = category && category !== '전체'
      ? CATEGORY_TYPES[category]
      : undefined;

    const { places, hasMore, total } = await queryAllSorted(lat, lon, page, limit, contentTypes);

    if (places.length > 0 || page > 1) {
      return NextResponse.json({ places, hasMore, total, page, source: 'db' });
    }

    // DB 완전히 비었을 때 API 폴백
    const apiPlaces = (await getPetFriendlyPlaces(lat, lon, 10000).catch(() => [])).map(tourToResult);
    return NextResponse.json({ places: apiPlaces, hasMore: false, total: apiPlaces.length, page: 1, source: 'api' });

  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown';
    console.error('[places] error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
