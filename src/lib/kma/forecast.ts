import 'server-only';
import { latLonToGrid, getShortFcstBaseTime } from './grid';

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  rainProb: number;
  sky: number;
  rainType: number;
  uvIndex: number;
  source: 'kma' | 'open-meteo';
}

interface FcstItem {
  category: string;
  fcstValue: string;
  fcstDate: string;
  fcstTime: string;
}

function parseItems(body: unknown): FcstItem[] {
  try {
    const b = body as { response: { body: { items: { item: FcstItem[] } } } };
    return b.response.body.items.item ?? [];
  } catch {
    return [];
  }
}

/** 기상청 단기예보 (활용신청 완료 후 사용) */
async function kmaForecast(lat: number, lon: number): Promise<WeatherData> {
  const serviceKey = process.env.DATA_GO_KR_SERVICE_KEY;
  if (!serviceKey) throw new Error('DATA_GO_KR_SERVICE_KEY not set');

  const { nx, ny } = latLonToGrid(lat, lon);
  const { base_date, base_time } = getShortFcstBaseTime();

  const params = new URLSearchParams({
    serviceKey,
    pageNo: '1',
    numOfRows: '300',
    dataType: 'JSON',
    base_date,
    base_time,
    nx: String(nx),
    ny: String(ny),
  });

  const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?${params}`;
  const res = await fetch(url, { next: { revalidate: 1800 } });
  if (!res.ok) throw new Error(`KMA ${res.status}`);

  let json: unknown;
  try { json = await res.json(); } catch { throw new Error('KMA non-JSON'); }

  const items = parseItems(json);
  if (items.length === 0) throw new Error('KMA empty response');

  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const todayStr = `${kst.getUTCFullYear()}${String(kst.getUTCMonth() + 1).padStart(2, '0')}${String(kst.getUTCDate()).padStart(2, '0')}`;
  const currentHH = String(kst.getUTCHours()).padStart(2, '0') + '00';

  const nearest = items.filter(i => i.fcstDate === todayStr && i.fcstTime >= currentHH);
  const getVal = (cat: string) => nearest.find(i => i.category === cat)?.fcstValue ?? '0';

  const temperature = Number(getVal('TMP'));
  const humidity = Number(getVal('REH'));
  const windSpeed = Number(getVal('WSD'));
  const rainProb = Number(getVal('POP'));
  const sky = Number(getVal('SKY')) || 1;
  const rainType = Number(getVal('PTY'));
  const wc = 13.12 + 0.6215 * temperature - 11.37 * Math.pow(windSpeed, 0.16) + 0.3965 * temperature * Math.pow(windSpeed, 0.16);
  const feelsLike = windSpeed >= 1.3 ? Math.round(wc * 10) / 10 : temperature;
  const uvIndex = sky === 1 ? Math.min(11, Math.round(temperature / 4)) : 1;

  return { temperature, feelsLike, humidity, windSpeed, rainProb, sky, rainType, uvIndex, source: 'kma' };
}

/** Open-Meteo 폴백 (무료, 쿼터 없음) */
async function openMeteoForecast(lat: number, lon: number): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation_probability&hourly=uv_index&timezone=auto&forecast_days=1`;
  const res = await fetch(url, { next: { revalidate: 1800 } });
  if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);

  const data: {
    current: {
      temperature_2m: number;
      apparent_temperature: number;
      relative_humidity_2m: number;
      wind_speed_10m: number;
      precipitation_probability: number;
      weather_code: number;
    };
    hourly: { uv_index: number[] };
  } = await res.json();

  const c = data.current;
  const wc = c.weather_code;

  // WMO 코드 → 강수 형태 (0=없음, 1=비, 3=눈)
  const rainType = wc >= 71 && wc <= 77 ? 3 : (wc >= 51 && wc <= 67) || (wc >= 80 && wc <= 82) ? 1 : 0;
  // WMO 코드 → 하늘 상태 (1=맑음 3=구름많음 4=흐림)
  const sky = wc === 0 ? 1 : wc <= 3 ? 3 : 4;
  const uvIndex = Math.round(data.hourly.uv_index?.[new Date().getHours()] ?? 2);

  return {
    temperature: Math.round(c.temperature_2m),
    feelsLike: Math.round(c.apparent_temperature),
    humidity: Math.round(c.relative_humidity_2m),
    windSpeed: Math.round(c.wind_speed_10m * 10) / 10,
    rainProb: Math.round(c.precipitation_probability),
    sky,
    rainType,
    uvIndex,
    source: 'open-meteo',
  };
}

/** 기상청 우선 → Open-Meteo 자동 폴백 */
export async function getKmaForecast(lat: number, lon: number): Promise<WeatherData> {
  try {
    return await kmaForecast(lat, lon);
  } catch (e) {
    console.warn('[kma] fallback to open-meteo:', (e as Error).message);
    return await openMeteoForecast(lat, lon);
  }
}
