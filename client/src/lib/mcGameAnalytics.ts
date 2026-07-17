/**
 * INUS MC CUE MATCH - 이벤트 트래킹 헬퍼
 * 사이트에 이미 연결된 Umami 분석 도구를 사용한다 (window.umami.track).
 * 분석 도구가 없거나 차단된 환경에서도 에러 없이 무시된다.
 */
declare global {
  interface Window {
    umami?: { track: (name: string, data?: Record<string, unknown>) => void };
  }
}

export function trackGameEvent(name: string, data?: Record<string, unknown>) {
  try {
    window.umami?.track(`mc_game_${name}`, data);
  } catch {
    // no-op
  }
}
