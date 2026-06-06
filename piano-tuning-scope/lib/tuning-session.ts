/**
 * tuning-session.ts
 * 조율 세션 데이터 모델 및 AsyncStorage 기반 영속화
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

export interface KeyMeasurement {
  keyIndex: number;
  cents: number;
  frequency: number;
  measuredAt: number;
}

export interface TuningSession {
  id: string;
  name: string;
  createdAt: number;
  measurements: Record<number, KeyMeasurement>;
}

const STORAGE_KEY = "piano_tuning_sessions";
const ACTIVE_SESSION_KEY = "piano_tuning_active_session";
const MAX_SESSIONS = 20;

/**
 * 모든 세션 로드
 */
export async function loadSessions(): Promise<TuningSession[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * 세션 저장
 */
export async function saveSessions(sessions: TuningSession[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

/**
 * 활성 세션 ID 로드
 */
export async function loadActiveSessionId(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(ACTIVE_SESSION_KEY);
  } catch {
    return null;
  }
}

/**
 * 활성 세션 ID 저장
 */
export async function saveActiveSessionId(id: string | null): Promise<void> {
  if (id) {
    await AsyncStorage.setItem(ACTIVE_SESSION_KEY, id);
  } else {
    await AsyncStorage.removeItem(ACTIVE_SESSION_KEY);
  }
}

/**
 * 새 세션 생성
 */
export function createNewSession(name?: string): TuningSession {
  const now = Date.now();
  const sessionName = name || `조율 ${new Date(now).toLocaleDateString("ko-KR")} ${new Date(now).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}`;
  return {
    id: now.toString(36) + Math.random().toString(36).slice(2, 6),
    name: sessionName,
    createdAt: now,
    measurements: {},
  };
}

/**
 * 세션에 측정값 기록
 */
export function addMeasurement(
  session: TuningSession,
  keyIndex: number,
  cents: number,
  frequency: number
): TuningSession {
  return {
    ...session,
    measurements: {
      ...session.measurements,
      [keyIndex]: { keyIndex, cents, frequency, measuredAt: Date.now() },
    },
  };
}

/**
 * 세션에서 측정값 삭제
 */
export function removeMeasurement(session: TuningSession, keyIndex: number): TuningSession {
  const newMeasurements = { ...session.measurements };
  delete newMeasurements[keyIndex];
  return { ...session, measurements: newMeasurements };
}

/**
 * 세션의 모든 측정값 초기화
 */
export function clearMeasurements(session: TuningSession): TuningSession {
  return { ...session, measurements: {} };
}

/**
 * 측정된 건반 수
 */
export function getMeasuredCount(session: TuningSession | null): number {
  if (!session) return 0;
  return Object.keys(session.measurements).length;
}
