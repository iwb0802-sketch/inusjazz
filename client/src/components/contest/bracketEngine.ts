/**
 * 홀수 인원(9명) 대응 동적 부전승 단일 토너먼트 엔진
 * 매 라운드 인원이 홀수면 1명 랜덤 부전승 처리 후 나머지 랜덤 매칭
 */

export interface Match {
  a: string;
  b: string;
}

export interface RoundSetup {
  roundIndex: number;
  playersIn: string[]; // 이 라운드에 들어온 전체 인원
  bye: string | null; // 부전승자 (있으면)
  matches: Match[]; // 부전승자를 뺀 나머지의 매치들
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildRound(playersIn: string[], roundIndex: number): RoundSetup {
  const shuffled = shuffle(playersIn);
  let bye: string | null = null;
  let rest = shuffled;
  if (shuffled.length % 2 === 1) {
    bye = shuffled[0];
    rest = shuffled.slice(1);
  }
  const matches: Match[] = [];
  for (let i = 0; i < rest.length; i += 2) {
    matches.push({ a: rest[i], b: rest[i + 1] });
  }
  return { roundIndex, playersIn, bye, matches };
}

export function roundLabel(playerCount: number): string {
  if (playerCount === 2) return "결승";
  if (playerCount <= 4) return `TOP ${playerCount} 준결승`;
  return `TOP ${playerCount} 라운드`;
}
