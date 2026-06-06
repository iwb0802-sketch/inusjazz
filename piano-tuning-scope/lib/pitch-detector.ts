/**
 * pitch-detector.ts
 * YIN 알고리즘 기반 피치 감지 엔진
 * 
 * React Native에서는 expo-audio의 녹음 기능으로 PCM 데이터를 얻어
 * 이 함수들로 피치를 분석합니다.
 * 
 * 웹에서는 Web Audio API의 AnalyserNode를 통해 동일한 알고리즘을 사용합니다.
 */

/**
 * YIN 알고리즘으로 주파수 감지
 * @param buf Float32Array 오디오 샘플 버퍼
 * @param sampleRate 샘플레이트 (보통 44100)
 * @returns 감지된 주파수 (Hz), 실패 시 -1
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function detectPitchYIN(buf: any, sampleRate: number): number {
  const half = Math.floor(buf.length / 2);
  const yin = new Float32Array(half);
  
  // Step 1: Difference function
  for (let tau = 0; tau < half; tau++) {
    let s = 0;
    for (let i = 0; i < half; i++) {
      const d = buf[i] - buf[i + tau];
      s += d * d;
    }
    yin[tau] = s;
  }
  
  // Step 2: Cumulative mean normalized difference
  yin[0] = 1;
  let runningSum = 0;
  for (let tau = 1; tau < half; tau++) {
    runningSum += yin[tau];
    yin[tau] *= tau / runningSum;
  }
  
  // Step 3: Absolute threshold (0.15 for high sensitivity)
  const threshold = 0.15;
  let tau = 2;
  while (tau < half) {
    if (yin[tau] < threshold) {
      while (tau + 1 < half && yin[tau + 1] < yin[tau]) tau++;
      break;
    }
    tau++;
  }
  
  if (tau === half || yin[tau] >= threshold) return -1;
  
  // Step 4: Parabolic interpolation for sub-sample accuracy
  let betterTau = tau;
  if (tau > 0 && tau < half - 1) {
    const s0 = yin[tau - 1];
    const s1 = yin[tau];
    const s2 = yin[tau + 1];
    betterTau = tau + (s2 - s0) / (2 * (2 * s1 - s2 - s0));
  }
  
  return sampleRate / betterTau;
}

/**
 * RMS (Root Mean Square) 계산 - 볼륨 레벨 측정
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getRMS(buf: any): number {
  let sum = 0;
  for (let i = 0; i < buf.length; i++) {
    sum += buf[i] * buf[i];
  }
  return Math.sqrt(sum / buf.length);
}

/**
 * 피치 감지 결과 인터페이스
 */
export interface PitchResult {
  frequency: number;
  keyIndex: number;
  noteName: string;
  octave: number;
  cents: number;
  confidence: number;
  rms: number;
}

/**
 * 안정적인 피치 감지를 위한 윈도우 기반 분석기
 * 15프레임 중 8프레임 이상 동일 건반이면 안정으로 판정
 */
export class PitchAnalyzer {
  private recentKeys: number[] = [];
  private recentCents: number[] = [];
  private lastKey: number | null = null;
  
  private readonly WINDOW = 15;
  private readonly MIN_MATCH = 8;
  private readonly MIN_RMS = 0.003; // 최소 볼륨 임계값
  
  reset(): void {
    this.recentKeys = [];
    this.recentCents = [];
    this.lastKey = null;
  }
  
  /**
   * 오디오 버퍼를 분석하여 안정적인 피치 결과 반환
   */
  analyze(buf: Float32Array, sampleRate: number): PitchResult | null {
    const rms = getRMS(buf);
    
    // 무음 감지
    if (rms < this.MIN_RMS) {
      this.recentKeys = [];
      this.recentCents = [];
      return null;
    }
    
    const freq = detectPitchYIN(buf, sampleRate);
    if (freq <= 0) return null;
    
    // 주파수를 건반/센트로 변환
    const { freqToCentOffset, correctOctaveError, median, PIANO_KEYS } = require('./piano-keys');
    const result = freqToCentOffset(freq);
    if (!result) return null;
    
    // 옥타브 오류 보정
    const correctedKeyIndex = correctOctaveError(result.keyIndex, this.lastKey);
    const finalCents = correctedKeyIndex !== result.keyIndex
      ? (freqToCentOffset(PIANO_KEYS[correctedKeyIndex].freq)?.cents ?? result.cents)
      : result.cents;
    
    // 윈도우에 추가
    this.recentKeys.push(correctedKeyIndex);
    this.recentCents.push(finalCents);
    if (this.recentKeys.length > this.WINDOW) {
      this.recentKeys.shift();
      this.recentCents.shift();
    }
    
    // 가장 빈번한 건반 찾기
    const counts: Record<number, number> = {};
    this.recentKeys.forEach(k => { counts[k] = (counts[k] || 0) + 1; });
    
    let topKey = -1;
    let topCount = 0;
    Object.entries(counts).forEach(([k, c]) => {
      if (c > topCount) { topKey = parseInt(k); topCount = c; }
    });
    
    // 안정 판정
    if (topCount >= this.MIN_MATCH && topKey >= 0 && topKey <= 87) {
      const centsArr = this.recentKeys
        .map((k, i) => k === topKey ? this.recentCents[i] : null)
        .filter((v): v is number => v !== null);
      const stableCents = Math.round(median(centsArr) * 10) / 10;
      
      this.lastKey = topKey;
      
      return {
        frequency: freq,
        keyIndex: topKey,
        noteName: PIANO_KEYS[topKey].noteName,
        octave: PIANO_KEYS[topKey].octave,
        cents: stableCents,
        confidence: topCount / this.WINDOW,
        rms,
      };
    }
    
    return null;
  }
}
