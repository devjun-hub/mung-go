import { NextRequest, NextResponse } from 'next/server';
import { getKmaForecast } from '../../../lib/kma/forecast';
import { getAirData } from '../../../lib/airkorea';
import { calcWalkScore, DogProfile } from '../../../lib/walk-index/engine';

export async function POST(request: NextRequest) {
  try {
    let body: { latitude?: number; longitude?: number; dog?: DogProfile } = {};
    try { body = await request.json(); } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const { latitude, longitude, dog } = body;
    if (!latitude || !longitude) {
      return NextResponse.json({ error: 'latitude/longitude required' }, { status: 400 });
    }

    const dogProfile: DogProfile = dog ?? { size: '중형' };

    const [weather, air] = await Promise.all([
      getKmaForecast(latitude, longitude),
      getAirData(latitude, longitude),
    ]);

    const result = calcWalkScore(
      {
        temperature: weather.temperature,
        feelsLike: weather.feelsLike,
        humidity: weather.humidity,
        windSpeed: weather.windSpeed,
        rainProb: weather.rainProb,
        rainType: weather.rainType,
        sky: weather.sky,
        pm25: air.pm25,
        uvIndex: weather.uvIndex,
      },
      dogProfile
    );

    return NextResponse.json({
      ...result,
      weather: {
        temperature: weather.temperature,
        feelsLike: weather.feelsLike,
        humidity: weather.humidity,
        windSpeed: weather.windSpeed,
        rainProb: weather.rainProb,
        sky: weather.sky,
      },
      air: {
        pm10: air.pm10,
        pm25: air.pm25,
        khaiGrade: air.khaiGrade,
        stationName: air.stationName,
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('[walk-index] error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
