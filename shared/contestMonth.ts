/**
 * 보이스 크라운 콘테스트 - 월(month) 계산 공용 유틸
 * client(contestData.ts)와 api(hearts.ts, grandprix.ts)에서 공통 사용
 * 형식: "YYYY-M" (예: "2026-7")
 */

/**
 * KST(Asia/Seoul) 기준 연/월을 반환한다.
 * 서버(Vercel)는 UTC로 동작하므로 서버 로컬시간(getFullYear/getMonth)을 그대로 쓰면
 * KST 자정~오전 9시 사이에는 아직 "전날/전달"로 잘못 계산되는 버그가 있었다.
 * 반드시 Intl.DateTimeFormat으로 KST 기준 연/월을 뽑아야 한다.
 */
function kstYearMonth(date: Date): { y: number; m: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "numeric",
  }).formatToParts(date);
  const y = parseInt(parts.find((p) => p.type === "year")?.value ?? "0", 10);
  const m = parseInt(parts.find((p) => p.type === "month")?.value ?? "0", 10);
  return { y, m };
}

export function monthStamp(date: Date = new Date()): string {
  const { y, m } = kstYearMonth(date);
  return `${y}-${m}`;
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

/** 이번 달 마감일(말일) 표시용 라벨 - 예: "7월 31일 24:00 마감" */
export function deadlineLabel(stamp: string = monthStamp()): string {
  const y = parseInt(yearOf(stamp), 10);
  const m = monthOf(stamp);
  const lastDay = new Date(y, m, 0).getDate(); // 다음달 0일 = 이번달 말일
  return `${m}월 ${lastDay}일 24:00 마감`;
}
