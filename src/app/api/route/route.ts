import 'server-only';
import { NextRequest, NextResponse } from 'next/server';

export interface RoutePoint {
  lat: number;
  lon: number;
}

export interface WalkRoute {
  distance: number;       // 총 거리 (m)
  duration: number;       // 예상 소요시간 (초)
  coordinates: [number, number][]; // [lon, lat] 배열 (GeoJSON 순서)
  source: 'tmap' | 'osrm';
}

/** OSRM 공개 API로 보행자 경로 계산 (무료, 쿼터 없음) */
async function osrmRoute(start: RoutePoint, end: RoutePoint): Promise<WalkRoute> {
  // OSRM 공개 서버 - foot profile 사용
  const url = `https://router.project-osrm.org/route/v1/foot/${start.lon},${start.lat};${end.lon},${end.lat}?overview=full&geometries=geojson`;

  const res = await fetch(url, {
    headers: { 'User-Agent': 'MungGo/1.0' },
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error(`OSRM error: ${res.status}`);
  const data: {
    routes: Array<{
      distance: number;
      duration: number;
      geometry: { coordinates: [number, number][] };
    }>;
  } = await res.json();

  const route = data.routes[0];
  if (!route) throw new Error('No route found');

  return {
    distance: Math.round(route.distance),
    duration: Math.round(route.duration),
    coordinates: route.geometry.coordinates,
    source: 'osrm',
  };
}

/** Tmap 보행자 경로 (키 있는 경우) */
async function tmapRoute(start: RoutePoint, end: RoutePoint, apiKey: string): Promise<WalkRoute> {
  const body = {
    startX: start.lon,
    startY: start.lat,
    endX: end.lon,
    endY: end.lat,
    reqCoordType: 'WGS84GEO',
    resCoordType: 'WGS84GEO',
    startName: '출발',
    endName: '도착',
  };

  const res = await fetch('https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      appKey: apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`Tmap error: ${res.status}`);
  const data: {
    features: Array<{
      geometry: {
        type: string;
        coordinates: [number, number][] | [number, number];
      };
      properties: { totalDistance?: number; totalTime?: number };
    }>;
  } = await res.json();

  // Tmap GeoJSON Feature collection에서 좌표 추출
  const coords: [number, number][] = [];
  let totalDist = 0;
  let totalTime = 0;

  for (const feature of data.features) {
    if (feature.geometry.type === 'LineString') {
      coords.push(...(feature.geometry.coordinates as [number, number][]));
    }
    if (feature.properties.totalDistance) totalDist = feature.properties.totalDistance;
    if (feature.properties.totalTime) totalTime = feature.properties.totalTime;
  }

  return {
    distance: totalDist,
    duration: totalTime,
    coordinates: coords,
    source: 'tmap',
  };
}

/**
 * 보행자 경로 API
 * GET /api/route?startLat=&startLon=&endLat=&endLon=
 * Tmap 키가 있으면 Tmap, 없으면 OSRM(무료) 사용
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const startLat = Number(searchParams.get('startLat'));
  const startLon = Number(searchParams.get('startLon'));
  const endLat = Number(searchParams.get('endLat'));
  const endLon = Number(searchParams.get('endLon'));

  if (!startLat || !startLon || !endLat || !endLon) {
    return NextResponse.json({ error: 'startLat/startLon/endLat/endLon required' }, { status: 400 });
  }

  const start: RoutePoint = { lat: startLat, lon: startLon };
  const end: RoutePoint = { lat: endLat, lon: endLon };

  try {
    const tmapKey = process.env.TMAP_API_KEY;
    const route = tmapKey
      ? await tmapRoute(start, end, tmapKey).catch(() => osrmRoute(start, end))
      : await osrmRoute(start, end);

    return NextResponse.json(route);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown';
    console.error('[route] error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
