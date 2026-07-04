import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getPetTourDetail } from '../../../../lib/tourism';

interface PlaceRow {
  content_id: string;
  title: string;
  addr1: string;
  map_x: number;
  map_y: number;
  first_image: string | null;
  cat3: string | null;
  acmpy_type: string | null;
  rela_fclty: string | null;
  acmpy_info: string | null;
  content_type: string | null;
}

function getAnonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  // 1. Supabase에서 기본 정보 조회
  let base: PlaceRow | null = null;
  const supabase = getAnonClient();
  if (supabase) {
    const { data } = await supabase
      .from('pet_places')
      .select('content_id, title, addr1, map_x, map_y, first_image, cat3, acmpy_type, rela_fclty, acmpy_info, content_type')
      .eq('content_id', id)
      .single();
    base = data as PlaceRow | null;
  }

  // 2. 반려동물 동반 상세 정보 (detailPetTour2)
  const petDetail = await getPetTourDetail(id).catch(() => null);

  // 3. Supabase에 없으면 관광공사 API로 폴백 (위치기반 아닌 contentId 직접 조회 불가 → 상세 정보만)
  // DB에 저장된 반려동물 정보 우선, 없으면 실시간 API 폴백
  const result = {
    contentId: id,
    title: base?.title ?? '알 수 없는 장소',
    addr1: base?.addr1 ?? '',
    mapX: base?.map_x ?? 0,
    mapY: base?.map_y ?? 0,
    firstimage: base?.first_image ?? null,
    contentType: base?.content_type ?? null,
    tel: null as string | null,
    overview: null as string | null,
    acmpyTypeCd: (base?.acmpy_type ?? petDetail?.acmpyTypeCd) ?? null,
    relaPosesFclty: (base?.rela_fclty ?? petDetail?.relaPosesFclty) ?? null,
    acmpyPsblCpam: petDetail?.acmpyPsblCpam ?? null,
    acmpyNeedMtr: petDetail?.acmpyNeedMtr ?? null,
    etcAcmpyInfo: (base?.acmpy_info ?? petDetail?.etcAcmpyInfo) ?? null,
  };

  return NextResponse.json(result, {
    headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
  });
}
