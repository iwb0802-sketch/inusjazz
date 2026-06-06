/**
 * piano-keys.ts
 * 88건반 피아노 키 데이터 및 피치 변환 유틸리티
 */

export interface PianoKey {
  midi: number;
  keyNumber: number; // 1-88
  noteName: string;
  octave: number;
  freq: number;
  isBlack: boolean;
}

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export const PIANO_KEYS: PianoKey[] = Array.from({ length: 88 }, (_, i) => {
  const midi = i + 21;
  const octave = Math.floor(midi / 12) - 1;
  const noteName = NOTE_NAMES[midi % 12];
  const freq = 440 * Math.pow(2, (midi - 69) / 12);
  const isBlack = [1, 3, 6, 8, 10].includes(midi % 12);
  return { midi, keyNumber: i + 1, noteName, octave, freq, isBlack };
});

export interface CentOffset {
  keyIndex: number;
  cents: number;
  note: PianoKey;
}

/**
 * 주파수를 가장 가까운 피아노 건반과 센트 오차로 변환
 */
export function freqToCentOffset(freq: number): CentOffset | null {
  if (freq <= 0) return null;
  const midiFloat = 69 + 12 * Math.log2(freq / 440);
  const midiRound = Math.round(midiFloat);
  const keyIndex = midiRound - 21;
  if (keyIndex < 0 || keyIndex > 87) return null;
  return { keyIndex, cents: (midiFloat - midiRound) * 100, note: PIANO_KEYS[keyIndex] };
}

/**
 * 배열의 중앙값 계산
 */
export function median(arr: number[]): number {
  if (!arr.length) return 0;
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

/**
 * 옥타브 오류 보정
 * 감지된 건반이 이전 건반과 정확히 12 또는 24 반음 차이나면 이전 건반으로 보정
 */
export function correctOctaveError(detected: number, ref: number | null): number {
  if (ref === null) return detected;
  const d = detected - ref;
  if (d === 12 || d === -12 || d === 24 || d === -24) return ref;
  return detected;
}
