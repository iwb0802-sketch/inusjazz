/**
 * 보이스 크라운 콘테스트 - 월(month) 계산 공용 유틸
 * client(contestData.ts)와 api(hearts.ts, grandprix.ts)에서 공통 사용
 * 형식: "YYYY-M" (예: "2026-7")
 */

export function monthStamp(date: Date = new Date()): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}`;
}

export function monthLabel(stamp: string): string {
  const parts = stamp.split("-");
  const m = parseInt(parts[1] ?? "0", 10);
  return `${m}월`;
}

export function yearOf(stamp: string): string {
  return stamp.split("-")[0] ?? "";
}

export function monthOf(stamp: string): number {
  return parseInt(stamp.split("-")[1] ?? "0", 10);
}

export function isDecember(stamp: string): boolean {
  return monthOf(stamp) === 12;
}

/** stamp 기준 다음 달 스탬프 */
export function nextMonthStamp(stamp: string): string {
  const y = parseInt(yearOf(stamp), 10);
  const m = monthOf(stamp);
  const d = new Date(y, m, 1); // JS Date month는 0-indexed라 m 그대로 넣으면 다음달 1일
  return monthStamp(d);
}

/** stamp 기준 이전 달 스탬프 */
export function prevMonthStamp(stamp: string): string {
  const y = parseInt(yearOf(stamp), 10);
  const m = monthOf(stamp);
  const d = new Date(y, m - 2, 1); // m은 1-indexed, 이전달 1일 = m-2 (0-indexed)
  return monthStamp(d);
}
