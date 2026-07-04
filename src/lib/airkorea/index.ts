import 'server-only';

export interface AirData {
  pm10: number;   // PM10 μg/m³
  pm25: number;   // PM2.5 μg/m³
  khaiGrade: number; // 통합대기지수 등급 (1좋음 2보통 3나쁨 4매우나쁨)
  stationName: string;
}

interface NearbyStation {
  stationName: string;
  addr: string;
  tm: number;
}

interface AirMeasure {
  stationName: string;
  pm10Value: string;
  pm25Value: string;
  khaiGrade: string;
}

/** WGS84 → TM 좌표 간이 변환 (proj4 없이 근사치) */
function wgsToTm(lat: number, lon: number): { tmX: number; tmY: number } {
  // 중부원점 TM 근사 (서울 기준 오차 < 5km — 측정소 조회 용도로 충분)
  const tmX = (lon - 127.5) * 88979.2 + 200000;
  const tmY = (lat - 36.0) * 110941.0 + 546000;
  return { tmX, tmY };
}

/** 위경도 근방 가장 가까운 측정소 이름 조회 */
async function getNearestStation(lat: number, lon: number, serviceKey: string): Promise<string> {
  const { tmX, tmY } = wgsToTm(lat, lon);
  const params = new URLSearchParams({
    serviceKey,
    returnType: 'json',
    tmX: String(Math.round(tmX)),
    tmY: String(Math.round(tmY)),
    ver: '1.1',
  });
  const url = `https://apis.data.go.kr/B552584/MsrstnInfoInqireSvc/getNearbyMsrstnList?${params}`;
  const res = await fetch(url, { next: { revalidate: 86400 } }); // 측정소는 하루 캐시
  if (!res.ok) throw new Error(`AirKorea station API error: ${res.status}`);

  let json: unknown;
  try { json = await res.json(); } catch { throw new Error('AirKorea station: non-JSON response'); }

  const items = (json as { response: { body: { items: NearbyStation[] } } })?.response?.body?.items ?? [];
  return items[0]?.stationName ?? '종로구';
}

/** 측정소명으로 실시간 대기 데이터 조회 */
async function getMeasurement(stationName: string, serviceKey: string): Promise<AirMeasure | null> {
  const params = new URLSearchParams({
    serviceKey,
    returnType: 'json',
    numOfRows: '1',
    pageNo: '1',
    stationName,
    dataTerm: 'DAILY',
    ver: '1.4',
  });
  const url = `https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?${params}`;
  const res = await fetch(url, { next: { revalidate: 1800 } }); // 30분 캐시
  if (!res.ok) return null;

  let json: unknown;
  try { json = await res.json(); } catch { return null; }

  const items = (json as { response: { body: { items: AirMeasure[] } } })?.response?.body?.items ?? [];
  return items[0] ?? null;
}

/** Open-Meteo로 대기질 추정 (에어코리아 API 미승인 시 폴백) */
async function openMeteoAir(lat: number, lon: number): Promise<AirData> {
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5,european_aqi`;
  const res = await fetch(url, { next: { revalidate: 1800 } });
  if (!res.ok) throw new Error(`Open-Meteo air ${res.status}`);
  const data: { current: { pm10: number; pm2_5: number; european_aqi: number } } = await res.json();
  const c = data.current;
  // European AQI → 한국 KHAI 등급 근사 (1좋음 2보통 3나쁨 4매우나쁨)
  const khaiGrade = c.european_aqi <= 20 ? 1 : c.european_aqi <= 50 ? 2 : c.european_aqi <= 100 ? 3 : 4;
  return { pm10: Math.round(c.pm10), pm25: Math.round(c.pm2_5), khaiGrade, stationName: 'Open-Meteo' };
}

/** 위경도 기준 대기질 데이터 반환 — 에어코리아 우선, Open-Meteo 폴백 */
export async function getAirData(lat: number, lon: number): Promise<AirData> {
  const serviceKey = process.env.DATA_GO_KR_SERVICE_KEY;
  if (!serviceKey) return openMeteoAir(lat, lon);

  try {
    const stationName = await getNearestStation(lat, lon, serviceKey);
    const m = await getMeasurement(stationName, serviceKey);
    if (!m) throw new Error('no measurement');
    const pm10 = Number(m.pm10Value);
    const pm25 = Number(m.pm25Value);
    if (!pm10 && !pm25) throw new Error('empty values');
    return { pm10, pm25, khaiGrade: Number(m.khaiGrade) || 1, stationName };
  } catch (e) {
    console.warn('[airkorea] fallback to open-meteo:', (e as Error).message);
    return openMeteoAir(lat, lon);
  }
}
