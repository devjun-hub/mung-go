import 'server-only';

// 반려동물 동반여행 전용 엔드포인트 (활용신청 승인 필요)
const BASE_URL = 'https://apis.data.go.kr/B551011/KorPetTourService2';

export interface TourPlace {
  contentId: string;
  title: string;
  addr1: string;
  addr2?: string;
  mapX: number;   // 경도
  mapY: number;   // 위도
  dist?: number;  // 거리 (m) — locationBasedList2만 제공
  firstimage?: string;
  firstimage2?: string;
  cat1?: string;
  cat2?: string;
  cat3?: string;
  contentTypeId?: string;
}

export interface PetTourDetail {
  contentId: string;
  acmpyTypeCd?: string;     // 동반 유형 (소형견 O/X 등)
  relaPosesFclty?: string;  // 관련 보유 시설
  acmpyPsblCpam?: string;   // 동반 가능 인원
  acmpyNeedMtr?: string;    // 동반 필요 사항
  etcAcmpyInfo?: string;    // 기타 동반 정보
}

interface RawItem {
  contentid: string;
  title: string;
  addr1: string;
  addr2?: string;
  mapx: string;
  mapy: string;
  dist?: string;
  firstimage?: string;
  firstimage2?: string;
  cat1?: string;
  cat2?: string;
  cat3?: string;
  contenttypeid?: string;
}

function toTourPlace(r: RawItem): TourPlace {
  return {
    contentId: r.contentid,
    title: r.title,
    addr1: r.addr1,
    addr2: r.addr2,
    mapX: Number(r.mapx),
    mapY: Number(r.mapy),
    dist: r.dist ? Number(r.dist) : undefined,
    firstimage: r.firstimage,
    firstimage2: r.firstimage2,
    cat1: r.cat1,
    cat2: r.cat2,
    cat3: r.cat3,
    contentTypeId: r.contenttypeid,
  };
}

function getServiceKey(): string {
  const key = process.env.DATA_GO_KR_SERVICE_KEY;
  if (!key) throw new Error('DATA_GO_KR_SERVICE_KEY not set');
  return key;
}

/** 위치 기반 반려동물 동반 가능 관광지 조회 */
export async function getPetFriendlyPlaces(
  lat: number,
  lon: number,
  radius = 5000,
  numOfRows = 20
): Promise<TourPlace[]> {
  const params = new URLSearchParams({
    serviceKey: getServiceKey(),
    MobileOS: 'ETC',
    MobileApp: 'MungGo',
    _type: 'json',
    mapX: String(lon),
    mapY: String(lat),
    radius: String(radius),
    numOfRows: String(numOfRows),
    pageNo: '1',
    // 반려동물 동반 가능 여행지 필터 (cat3=A01011802 등) — contentTypeId 생략 시 전체
  });

  const url = `${BASE_URL}/locationBasedList2?${params}`;
  const res = await fetch(url, { next: { revalidate: 3600 } }); // 1시간 캐시

  if (!res.ok) throw new Error(`Tourism API error: ${res.status}`);
  let json: unknown;
  try { json = await res.json(); } catch { throw new Error('Tourism API: non-JSON'); }

  const raw = (json as { response: { body: { items: { item: RawItem | RawItem[] } } } })
    ?.response?.body?.items?.item;
  const items: RawItem[] = raw ? (Array.isArray(raw) ? raw : [raw]) : [];

  return items.map(toTourPlace);
}

/** 콘텐츠 ID로 반려동물 동반 상세 정보 조회 (detailPetTour2) */
export async function getPetTourDetail(contentId: string): Promise<PetTourDetail | null> {
  const params = new URLSearchParams({
    serviceKey: getServiceKey(),
    MobileOS: 'ETC',
    MobileApp: 'MungGo',
    _type: 'json',
    contentId,
  });

  const url = `${BASE_URL}/detailPetTour2?${params}`;
  const res = await fetch(url, { next: { revalidate: 86400 } }); // 하루 캐시
  if (!res.ok) return null;

  let json: unknown;
  try { json = await res.json(); } catch { return null; }

  const raw = (json as { response: { body: { items: { item: Record<string, string> } } } })
    ?.response?.body?.items?.item;
  if (!raw) return null;

  return {
    contentId,
    acmpyTypeCd: raw.acmpyTypeCd,
    relaPosesFclty: raw.relaPosesFclty,
    acmpyPsblCpam: raw.acmpyPsblCpam,
    acmpyNeedMtr: raw.acmpyNeedMtr,
    etcAcmpyInfo: raw.etcAcmpyInfo,
  };
}

/** 키워드 검색 (반려동물 동반 시설) */
export async function searchPetPlaces(keyword: string, numOfRows = 10): Promise<TourPlace[]> {
  const params = new URLSearchParams({
    serviceKey: getServiceKey(),
    MobileOS: 'ETC',
    MobileApp: 'MungGo',
    _type: 'json',
    keyword,
    numOfRows: String(numOfRows),
    pageNo: '1',
  });

  const url = `${BASE_URL}/searchKeyword2?${params}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return [];

  let json: unknown;
  try { json = await res.json(); } catch { return []; }

  const raw2 = (json as { response: { body: { items: { item: RawItem | RawItem[] } } } })
    ?.response?.body?.items?.item;
  const items: RawItem[] = raw2 ? (Array.isArray(raw2) ? raw2 : [raw2]) : [];

  return items.map(toTourPlace);
}
