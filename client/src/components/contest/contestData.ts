/**
 * VOTE ON VOICE 콘테스트 - 데이터 & localStorage 헬퍼
 * 임시 데모 페이지 (/contest) 전용
 */

export interface Contestant {
  name: string;
  tier: "BEST" | "PREMIUM";
  desc: string;
  image: string;
  highlight: string;
  profileUrl: string;
  audioFile: string;
  videoId: string;
}

export const CONTESTANTS: Contestant[] = [
  {
    name: "김민수",
    tier: "BEST",
    desc: "5년+ 경력",
    image: "/images/mc-profile-1_33531819.jpg",
    highlight: "안정적인 진행력과 맞춤 대본으로 예식의 전체 흐름을 설계합니다.",
    profileUrl: "https://www.inusmusic.com/profile-minsu.html",
    audioFile: "/audio/mc-minsu.mp3",
    videoId: "YmqVrha13G0",
  },
  {
    name: "고승범",
    tier: "BEST",
    desc: "5년+ 경력",
    image: "/images/mc-profile-4_a9e52880.jpg",
    highlight: "자연스럽고 세련된 진행 스타일이 특징입니다.",
    profileUrl: "https://www.inusmusic.com/profile-seungbeom.html",
    audioFile: "/audio/mc-seungbeom.mp3",
    videoId: "iKi77thkR4s",
  },
  {
    name: "이도영",
    tier: "BEST",
    desc: "4년+ 경력",
    image: "/images/mc-profile-2_f194877b.jpg",
    highlight: "따뜻하고 안정적인 진행으로 신랑신부님의 이야기를 감동적으로 전달합니다.",
    profileUrl: "https://www.inusmusic.com/profile-idoyoung.html",
    audioFile: "/audio/mc-idoyoung.mp3",
    videoId: "ali34pV7ALk",
  },
  {
    name: "석재선",
    tier: "BEST",
    desc: "5년+ 경력",
    image: "/images/mc-profile-3_33ff7a32.jpg",
    highlight: "차분하면서도 격식 있는 진행으로 품격 있는 예식을 만들어드립니다.",
    profileUrl: "https://www.inusmusic.com/profile-jaesun.html",
    audioFile: "/audio/mc-jaesun.mp3",
    videoId: "zx_iAhMkMns",
  },
  {
    name: "이우영",
    tier: "PREMIUM",
    desc: "10년+ 경력",
    image: "/images/mc-lee-wooyoung-new_fa27e84d.webp",
    highlight: "편안한 아나운서 톤과 안정적인 진행력으로 위트 있고 깔끔한 예식을 완성하는 사회자입니다.",
    profileUrl: "https://www.inusmusic.com/profile-wooyoung.html",
    audioFile: "/audio/mc-wooyoung.mp3",
    videoId: "prhKZqfMjfM",
  },
  {
    name: "김선혁",
    tier: "BEST",
    desc: "5년+ 경력",
    image: "/images/host_sunhyuk_1ed704ab.jpg",
    highlight: "깔끔하고 안정감 있는 진행력을 기반으로 탁월한 상황 대처 능력을 갖춘 사회자입니다.",
    profileUrl: "https://www.inusmusic.com/profile-sunhyuk.html",
    audioFile: "/audio/mc-sunhyuk.mp3",
    videoId: "4Quvg9TIGAk",
  },
  {
    name: "장윤태",
    tier: "PREMIUM",
    desc: "10년+ 경력",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663604364385/YIRjIXsBhCqAiMgE.jpg",
    highlight: "안정적인 진행력과 젠틀한 진행으로 예식의 완성도를 높입니다.",
    profileUrl: "https://www.inusmusic.com/profile-yuntae.html",
    audioFile: "/audio/mc-yuntae.mp3",
    videoId: "U5cJiiF-WcY",
  },
  {
    name: "길상우",
    tier: "BEST",
    desc: "5년+ 경력",
    image: "https://storage.googleapis.com/runable-templates/cli-uploads%2FeblzJGDjOG2vKrak7NizAO4MJKnCG921%2FPcvLRqLzT-JnfPrulzmCo%2Fmc-gilsangwoo.jpg",
    highlight: "센스와 위트를 겸비한 진행력이 강점인 사회자입니다.",
    profileUrl: "https://www.inusmusic.com/profile-gilsangwoo.html",
    audioFile: "/audio/mc-gilsangwoo.mp3",
    videoId: "0Ske676aw84",
  },
  {
    name: "최윤아",
    tier: "PREMIUM",
    desc: "10년+ 경력",
    image: "/images/mc-yuna.jpg",
    highlight: "세련된 진행과 따뜻한 톤으로 순간의 가치를 빛내는 사회자입니다.",
    profileUrl: "https://www.inusmusic.com/profile-yuna.html",
    audioFile: "/audio/mc-yoona.mp3",
    videoId: "wuwAiKu9HbU",
  },
];

// ---------------------------------------------------------------------------
// 하트 저장: localStorage(기기별, 즉시 반영용) + 서버 API(/api/hearts, 전체 방문자 공유 집계)
// 서버(Railway Postgres) 연결 전/장애 시에는 localStorage로 자연스럽게 폴백됨.
// ---------------------------------------------------------------------------
import { monthStamp as sharedMonthStamp, monthLabel as sharedMonthLabel } from "../../../../shared/contestMonth";

const ALL_TIME_KEY = "inus_contest_hearts_alltime_v1";
const MONTH_KEY = "inus_contest_hearts_month_v1";
const MONTH_STAMP_KEY = "inus_contest_month_stamp_v1";

type HeartMap = Record<string, number>;

function currentMonthStamp(): string {
  return sharedMonthStamp();
}

function readMap(key: string): HeartMap {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeMap(key: string, map: HeartMap) {
  try {
    localStorage.setItem(key, JSON.stringify(map));
  } catch {
    // ignore
  }
}

/** 이번 달이 바뀌었으면 이번달 하트만 초기화 (전체 누적은 유지) - 로컬 폴백용 */
function ensureMonthFresh() {
  const stamp = localStorage.getItem(MONTH_STAMP_KEY);
  const now = currentMonthStamp();
  if (stamp !== now) {
    writeMap(MONTH_KEY, {});
    localStorage.setItem(MONTH_STAMP_KEY, now);
  }
}

/** 기기 로컬 값 (서버 응답 오기 전 즉시 UI 표시용 optimistic 데이터) */
export function getAllTimeHearts(): HeartMap {
  return readMap(ALL_TIME_KEY);
}

export function getMonthHearts(): HeartMap {
  ensureMonthFresh();
  return readMap(MONTH_KEY);
}

/** 하트 +n 적립: 로컬은 즉시 반영(optimistic), 서버에도 비동기로 동시 전송 (전체 방문자 공유 집계) */
export function addHeart(name: string, amount = 1): { allTime: HeartMap; month: HeartMap } {
  ensureMonthFresh();
  const allTime = readMap(ALL_TIME_KEY);
  const month = readMap(MONTH_KEY);
  allTime[name] = (allTime[name] || 0) + amount;
  month[name] = (month[name] || 0) + amount;
  writeMap(ALL_TIME_KEY, allTime);
  writeMap(MONTH_KEY, month);

  // 서버 반영은 실패해도 로컬 UX에 영향 없도록 fire-and-forget
  fetch("/api/hearts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, amount }),
  }).catch(() => {
    // 서버 미연결(DB 세팅 전) 또는 네트워크 오류 - 로컬 값으로 계속 동작
  });

  return { allTime, month };
}

/**
 * 서버(Railway DB 연동 후)에서 전체 방문자 공유 집계를 가져와 로컬 값을 덮어씀.
 * 서버 미연결 시 null 반환 → 호출부는 로컬 값을 그대로 사용하면 됨.
 */
export async function fetchHeartsFromServer(): Promise<{
  month: HeartMap;
  allTime: HeartMap;
  currentMonthLabel: string;
  lastMonthChampion: { name: string; hearts: number; monthLabel: string } | null;
} | null> {
  try {
    const res = await fetch("/api/hearts");
    if (!res.ok) return null;
    const data = await res.json();
    // 서버 값으로 로컬 캐시도 동기화 (다음 즉시 로딩 시 최신값 사용)
    writeMap(ALL_TIME_KEY, data.allTime ?? {});
    writeMap(MONTH_KEY, data.month ?? {});
    localStorage.setItem(MONTH_STAMP_KEY, currentMonthStamp());
    return data;
  } catch {
    return null;
  }
}

export function getContestant(name: string): Contestant | undefined {
  return CONTESTANTS.find((c) => c.name === name);
}

/** 이번 달 라벨 - 실제 날짜 기준 자동 계산 (더 이상 하드코딩 아님) */
export function currentMonthLabel(): string {
  return sharedMonthLabel(currentMonthStamp());
}
