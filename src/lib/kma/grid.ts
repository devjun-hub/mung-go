import 'server-only';

// 기상청 LCC(DFS) 격자 변환 상수
const RE = 6371.00877;
const GRID = 5.0;
const SLAT1 = 30.0;
const SLAT2 = 60.0;
const OLON = 126.0;
const OLAT = 38.0;
const XO = 43;
const YO = 136;

const DEGRAD = Math.PI / 180.0;

export interface Grid {
  nx: number;
  ny: number;
}

/** WGS84 위경도 → 기상청 격자(nx, ny) 변환 */
export function latLonToGrid(lat: number, lon: number): Grid {
  const re = RE / GRID;
  const slat1 = SLAT1 * DEGRAD;
  const slat2 = SLAT2 * DEGRAD;
  const olon = OLON * DEGRAD;
  const olat = OLAT * DEGRAD;

  let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = (re * sf) / Math.pow(ro, sn);

  const ra = Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5);
  const raVal = (re * sf) / Math.pow(ra, sn);
  let theta = lon * DEGRAD - olon;
  if (theta > Math.PI) theta -= 2.0 * Math.PI;
  if (theta < -Math.PI) theta += 2.0 * Math.PI;
  theta *= sn;

  const nx = Math.floor(raVal * Math.sin(theta) + XO + 0.5);
  const ny = Math.floor(ro - raVal * Math.cos(theta) + YO + 0.5);
  return { nx, ny };
}

export interface BaseTime {
  base_date: string; // YYYYMMDD
  base_time: string; // HHMM
}

/** 현재 시각 기준으로 단기예보 base_date / base_time 계산 */
export function getShortFcstBaseTime(): BaseTime {
  const now = new Date();
  // KST = UTC+9
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const hours = kst.getUTCHours();
  const minutes = kst.getUTCMinutes();

  // 발표 시각: 02, 05, 08, 11, 14, 17, 20, 23시 (발표 후 10분 이후 안정)
  const publishHours = [2, 5, 8, 11, 14, 17, 20, 23];
  const totalMinutes = hours * 60 + minutes - 10; // 10분 버퍼

  let baseHour = publishHours[0];
  for (const h of publishHours) {
    if (h * 60 <= totalMinutes) baseHour = h;
  }

  let date = kst;
  if (baseHour > hours || (baseHour === hours && minutes < 10)) {
    // 전날 23시로 폴백
    date = new Date(kst.getTime() - 24 * 60 * 60 * 1000);
    baseHour = 23;
  }

  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return {
    base_date: `${y}${m}${d}`,
    base_time: String(baseHour).padStart(2, '0') + '00',
  };
}

/** 초단기예보 base_time 계산 (매시 30분 이후부터 당시 시각 발표) */
export function getUltraShortBaseTime(): BaseTime {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const hours = kst.getUTCHours();
  const minutes = kst.getUTCMinutes();

  let baseHour = hours;
  if (minutes < 30) {
    baseHour = hours === 0 ? 23 : hours - 1;
  }

  let date = kst;
  if (baseHour === 23 && minutes < 30 && hours === 0) {
    date = new Date(kst.getTime() - 24 * 60 * 60 * 1000);
  }

  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return {
    base_date: `${y}${m}${d}`,
    base_time: String(baseHour).padStart(2, '0') + '30',
  };
}
