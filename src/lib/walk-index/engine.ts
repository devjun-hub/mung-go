import 'server-only';

export type DogSize = '소형' | '중형' | '대형';
export type BreedType = 'normal' | 'brachycephalic' | 'double_coat' | 'nordic';

export interface DogProfile {
  size: DogSize;
  breedType?: BreedType;
  ageYears?: number; // 나이 (세)
}

export interface WalkInput {
  temperature: number;    // 기온 (°C)
  feelsLike: number;      // 체감온도
  humidity: number;       // 습도 (%)
  windSpeed: number;      // 풍속 (m/s)
  rainProb: number;       // 강수확률 (%)
  rainType: number;       // 강수형태 (0=없음)
  sky: number;            // 하늘상태 (1=맑음 4=흐림)
  pm25: number;           // PM2.5 (μg/m³)
  uvIndex: number;        // 자외선 지수
}

export interface WalkScore {
  score: number;          // 0~100
  grade: 'excellent' | 'good' | 'caution' | 'bad';
  label: string;          // 한글 등급
  warnings: string[];     // 경고 메시지 목록
  asphaltTemp: number;    // 추정 아스팔트 표면 온도
}

function clamp(min: number, max: number, val: number): number {
  return Math.max(min, Math.min(max, val));
}

/** 하늘상태 기반 일사 계수 (0~1) */
function solarFactor(sky: number): number {
  if (sky === 1) return 1.0;  // 맑음
  if (sky === 3) return 0.5;  // 구름많음
  return 0.1;                  // 흐림
}

/** 추정 아스팔트 표면 온도 */
function estimateAsphaltTemp(temp: number, sky: number): number {
  const k = 22; // 여름 직사광선 최대 +22°C
  return Math.round(temp + k * solarFactor(sky));
}

// --- 감점 함수들 ---

function penaltyHeat(feelsLike: number, heatSensitivity: number): number {
  if (feelsLike < 26) return 0;
  if (feelsLike < 30) return 10 * heatSensitivity;
  if (feelsLike < 35) return 25 * heatSensitivity;
  return 40 * heatSensitivity;
}

function penaltyAsphalt(asphaltTemp: number, sizeFactor: number): number {
  if (asphaltTemp < 40) return 0;
  if (asphaltTemp < 50) return 10 * sizeFactor;
  if (asphaltTemp < 60) return 20 * sizeFactor;
  return 35 * sizeFactor;
}

function penaltyPm(pm25: number, respSensitivity: number): number {
  if (pm25 <= 15) return 0;
  if (pm25 <= 35) return 10 * respSensitivity;
  if (pm25 <= 75) return 25 * respSensitivity;
  return 40 * respSensitivity;
}

function penaltyUv(uvIndex: number, coatFactor: number): number {
  if (uvIndex <= 2) return 0;
  if (uvIndex <= 5) return 5 * coatFactor;
  if (uvIndex <= 7) return 10 * coatFactor;
  return 18 * coatFactor;
}

function penaltyRain(rainProb: number, rainType: number): number {
  if (rainType > 0) return 30; // 현재 비/눈
  if (rainProb >= 70) return 20;
  if (rainProb >= 40) return 8;
  return 0;
}

function penaltyCold(feelsLike: number): number {
  if (feelsLike > 5) return 0;
  if (feelsLike > -5) return 10;
  return 25;
}

function penaltyWind(windSpeed: number): number {
  if (windSpeed < 5) return 0;
  if (windSpeed < 9) return 5;
  if (windSpeed < 14) return 12;
  return 22;
}

/** 견종·나이·체격 보정 계수 계산 */
function getDogFactors(dog: DogProfile) {
  const isBrachycephalic = dog.breedType === 'brachycephalic';
  const isDoubleCoat = dog.breedType === 'double_coat' || dog.breedType === 'nordic';
  const isSmall = dog.size === '소형';
  const isSenior = (dog.ageYears ?? 3) >= 7;
  const isPuppy = (dog.ageYears ?? 3) <= 1;
  const isSensitive = isSenior || isPuppy;

  return {
    heatSensitivity: (isBrachycephalic ? 1.5 : 1.0) * (isDoubleCoat ? 1.3 : 1.0) * (isSensitive ? 1.2 : 1.0),
    sizeFactor: isSmall ? 1.4 : 1.0,
    respiratorySensitivity: (isBrachycephalic ? 1.4 : 1.0) * (isSensitive ? 1.3 : 1.0),
    coatFactor: isDoubleCoat ? 1.2 : (isSmall ? 0.8 : 1.0),
    isSensitive,
  };
}

function gradeFromScore(score: number): WalkScore['grade'] {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'caution';
  return 'bad';
}

const GRADE_LABELS: Record<WalkScore['grade'], string> = {
  excellent: '산책하기 최고!',
  good: '산책 좋아요',
  caution: '주의 필요',
  bad: '산책 비추천',
};

/** 산책지수 메인 계산 함수 */
export function calcWalkScore(input: WalkInput, dog: DogProfile): WalkScore {
  const factors = getDogFactors(dog);
  const asphaltTemp = estimateAsphaltTemp(input.temperature, input.sky);

  const deductions =
    penaltyHeat(input.feelsLike, factors.heatSensitivity) +
    penaltyAsphalt(asphaltTemp, factors.sizeFactor) +
    penaltyPm(input.pm25, factors.respiratorySensitivity) +
    penaltyUv(input.uvIndex, factors.coatFactor) +
    penaltyRain(input.rainProb, input.rainType) +
    penaltyCold(input.feelsLike) +
    penaltyWind(input.windSpeed);

  const score = clamp(0, 100, Math.round(100 - deductions));
  const grade = gradeFromScore(score);

  const warnings: string[] = [];
  if (asphaltTemp >= 50) warnings.push(`아스팔트 ${asphaltTemp}°C 추정 — 발바닥 화상 주의`);
  if (input.pm25 > 35) warnings.push(`PM2.5 ${input.pm25}μg/m³ — 마스크 착용 권장`);
  if (input.feelsLike >= 32) warnings.push('폭염 주의 — 10분 이내 짧게 산책');
  if (factors.isSensitive && input.pm25 > 15) warnings.push('노령/어린 강아지 — 실내 대기 추천');
  if (input.rainType > 0) warnings.push('현재 비/눈 — 발 건조 후 귀가 필요');

  return { score, grade, label: GRADE_LABELS[grade], warnings, asphaltTemp };
}
