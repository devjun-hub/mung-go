import { NextRequest, NextResponse } from 'next/server';

/**
 * WMO Weather Code를 한글 기상 상태 설명으로 매핑하는 헬퍼 함수
 * @param code WMO 기상 코드
 */
function getWeatherDescription(code: number): string {
  if (code === 0) return '맑음';
  if (code >= 1 && code <= 3) return '구름조금';
  if (code === 45 || code === 48) return '안개';
  if (code >= 51 && code <= 55) return '이슬비';
  if (code >= 61 && code <= 65) return '비';
  if (code >= 71 && code <= 77) return '눈';
  if (code >= 80 && code <= 82) return '소나기';
  if (code >= 95 && code <= 99) return '뇌우';
  return '맑음';
}

/**
 * 실시간 날씨 설명과 기온을 바탕으로 산책 적합도 추천 문구를 계산하는 헬퍼 함수
 * @param weather 한글 날씨 설명
 * @param temp 기온 (섭씨)
 */
function getWalkRecommendation(weather: string, temp: number): string {
  if (weather.includes('비') || weather.includes('이슬비') || weather.includes('소나기')) {
    return '비가 와서 실내 산책을 추천해요';
  }
  if (weather.includes('눈')) {
    return '눈길 산책! 미끄럼과 동상에 주의해요';
  }
  if (weather.includes('뇌우')) {
    return '낙뢰 위험! 산책을 미루는 것이 안전해요';
  }
  if (temp >= 29) {
    return '폭염 주의! 한낮 산책은 피하고 밤에 걸어요';
  }
  if (temp <= -5) {
    return '혹한 주의! 보온 옷을 입히고 짧게 돌아요';
  }
  if (weather === '안개') {
    return '안개가 짙어 인식표를 꼭 착용하세요';
  }
  return '산책하기 딱 좋은 날씨예요';
}

/**
 * 위도/경도 좌표를 주소명(동) 및 실시간 기온/날씨 정보와 유동적인 산책 적합도 추천 문구로 변환하는 API 핸들러
 * OpenStreetMap Nominatim 및 Open-Meteo API를 서버측에서 연계 호출합니다.
 */
export async function POST(request: NextRequest) {
  try {
    let body: { latitude?: number; longitude?: number } = {};
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid or empty JSON body' },
        { status: 400 }
      );
    }

    const { latitude, longitude } = body;

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    let regionName = '서울';
    let temperature = 22;
    let weatherDescription = '맑음';

    const kakaoApiKey = process.env.KAKAO_REST_API_KEY;

    // 1. 역지오코딩 (Region Name) 처리
    // 1-1. 카카오 로컬 API 키가 설정되어 있는 경우
    if (kakaoApiKey) {
      try {
        const kakaoUrl = `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${longitude}&y=${latitude}`;
        const res = await fetch(kakaoUrl, {
          headers: {
            Authorization: `KakaoAK ${kakaoApiKey}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          const hRegion = data.documents?.find(
            (doc: { region_type: string; region_3depth_name?: string }) => doc.region_type === 'H'
          );
          const region = hRegion || data.documents?.[0];
          
          if (region && region.region_3depth_name) {
            regionName = region.region_3depth_name;
          }
        }
      } catch (err) {
        console.error('Kakao Local API geocoding failed, falling back...', err);
      }
    }

    // 1-2. 카카오 API 미설정 또는 실패 시 OpenStreetMap 사용
    if (regionName === '서울') {
      try {
        const osmUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=ko`;
        const res = await fetch(osmUrl, {
          headers: {
            'User-Agent': 'MungGo-Nextjs-Prototype/1.0',
          },
        });

        if (res.ok) {
          const data = await res.json();
          const addr = data.address;
          regionName =
            addr.neighbourhood ||
            addr.suburb ||
            addr.city_district ||
            addr.town ||
            addr.village ||
            addr.county ||
            '서울';
        }
      } catch (err) {
        console.error('OSM Nominatim geocoding failed...', err);
      }
    }

    // 2. 실시간 날씨 데이터 취득 (Open-Meteo)
    try {
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`;
      const res = await fetch(weatherUrl);
      
      if (res.ok) {
        const data = await res.json();
        const current = data.current;
        if (current) {
          temperature = Math.round(current.temperature_2m);
          weatherDescription = getWeatherDescription(current.weather_code);
        }
      }
    } catch (err) {
      console.error('Open-Meteo weather API call failed...', err);
    }

    // 3. 기온과 날씨에 따른 유동적인 산책 권장 문구 연산
    const walkRecommendation = getWalkRecommendation(weatherDescription, temperature);

    return NextResponse.json({
      regionName,
      temperature,
      weatherDescription,
      walkRecommendation,
    });
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Geocoding & Weather route handler error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: errMessage },
      { status: 500 }
    );
  }
}
