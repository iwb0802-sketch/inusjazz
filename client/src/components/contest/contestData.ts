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
  audioFileBlind: string;
  videoId: string;
  /** 결과 화면 진행 스타일 태그 - 실제 highlight 문구에서 도출, 사회자별 상이 */
  styleTags: string[];
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
    audioFileBlind: "/audio/mc-minsu-blind.mp3",
    videoId: "YmqVrha13G0",
    styleTags: ["안정적인 진행", "맞춤 대본 설계"],
  },
  {
    name: "고승범",
    tier: "BEST",
    desc: "5년+ 경력",
    image: "/images/mc-profile-4_a9e52880.jpg",
    highlight: "자연스럽고 세련된 진행 스타일이 특징입니다.",
    profileUrl: "https://www.inusmusic.com/profile-seungbeom.html",
    audioFile: "/audio/mc-seungbeom.mp3",
    audioFileBlind: "/audio/mc-seungbeom-blind.mp3",
    videoId: "iKi77thkR4s",
    styleTags: ["자연스러운 진행", "세련된 스타일"],
  },
  {
    name: "이도영",
    tier: "BEST",
    desc: "4년+ 경력",
    image: "/images/mc-profile-2_f194877b.jpg",
    highlight: "따뜻하고 안정적인 진행으로 신랑신부님의 이야기를 감동적으로 전달합니다.",
    profileUrl: "https://www.inusmusic.com/profile-idoyoung.html",
    audioFile: "/audio/mc-idoyoung.mp3",
    audioFileBlind: "/audio/mc-idoyoung-blind.mp3",
    videoId: "ali34pV7ALk",
    styleTags: ["안정적인 진행", "감동적인 멘트"],
  },
  {
    name: "석재선",
    tier: "PREMIUM",
    desc: "10년+ 경력",
    image: "/images/mc-profile-3_33ff7a32.jpg",
    highlight: "차분하면서도 격식 있는 진행으로 품격 있는 예식을 만들어드립니다.",
    profileUrl: "https://www.inusmusic.com/profile-jaesun.html",
    audioFile: "/audio/mc-jaesun.mp3",
    audioFileBlind: "/audio/mc-jaesun-blind.mp3",
    videoId: "PmtzbgT_PNw",
    styleTags: ["안정적인 진행", "격식 있는 품격"],
  },
  {
    name: "이우영",
    tier: "PREMIUM",
    desc: "10년+ 경력",
    image: "/images/mc-lee-wooyoung-new_fa27e84d.webp",
    highlight: "편안한 아나운서 톤과 안정적인 진행력으로 위트 있고 깔끔한 예식을 완성하는 사회자입니다.",
    profileUrl: "https://www.inusmusic.com/profile-wooyoung.html",
    audioFile: "/audio/mc-wooyoung.mp3",
    audioFileBlind: "/audio/mc-wooyoung-blind.mp3",
    videoId: "prhKZqfMjfM",
    styleTags: ["안정적인 진행", "유쾌한 분위기", "깔끔한 발음"],
  },
  {
    name: "김선혁",
    tier: "BEST",
    desc: "5년+ 경력",
    image: "/images/host_sunhyuk_1ed704ab.jpg",
    highlight: "깔끔하고 안정감 있는 진행력을 기반으로 탁월한 상황 대처 능력을 갖춘 사회자입니다.",
    profileUrl: "https://www.inusmusic.com/profile-sunhyuk.html",
    audioFile: "/audio/mc-sunhyuk.mp3",
    audioFileBlind: "/audio/mc-sunhyuk-blind.mp3",
    videoId: "4Quvg9TIGAk",
    styleTags: ["깔끔한 발음", "돌발상황 대처 능력"],
  },
  {
    name: "장윤태",
    tier: "PREMIUM",
    desc: "10년+ 경력",
    image: "/images/mc-yuntae.jpg",
    highlight: "안정적인 진행력과 젠틀한 진행으로 예식의 완성도를 높입니다.",
    profileUrl: "https://www.inusmusic.com/profile-yuntae.html",
    audioFile: "/audio/mc-yuntae.mp3",
    audioFileBlind: "/audio/mc-yuntae-blind.mp3",
    videoId: "U5cJiiF-WcY",
    styleTags: ["안정적인 진행", "젠틀한 진행"],
  },
  {
    name: "길상우",
    tier: "BEST",
    desc: "5년+ 경력",
    image: "/images/mc-gilsangwoo.jpg",
    highlight: "센스와 위트를 겸비한 진행력이 강점인 사회자입니다.",
    profileUrl: "https://www.inusmusic.com/profile-gilsangwoo.html",
    audioFile: "/audio/mc-gilsangwoo.mp3",
    audioFileBlind: "/audio/mc-gilsangwoo-blind.mp3",
    videoId: "0Ske676aw84",
    styleTags: ["유쾌한 분위기", "센스있는 진행"],
  },
  {
    name: "최윤아",
    tier: "PREMIUM",
    desc: "10년+ 경력",
    image: "/images/mc-yuna.jpg",
    highlight: "세련된 진행과 따뜻한 톤으로 순간의 가치를 빛내는 사회자입니다.",
    profileUrl: "https://www.inusmusic.com/profile-yuna.html",
    audioFile: "/audio/mc-yoona.mp3",
    audioFileBlind: "/audio/mc-yoona.mp3",
    videoId: "wuwAiKu9HbU",
    styleTags: ["세련된 진행", "감동적인 멘트"],
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
const DEVICE_ID_KEY = "inus_contest_device_id_v1";

/** 기기별 고유 ID (하루 중복 플레이 판별용). 브라우저 저장소 초기화 시 재발급됨. */
export function getDeviceId(): string {
  try {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `dev-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
  } catch {
    return `dev-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

/**
 * 토너먼트 시작 시 호출: 이 기기의 오늘 첫 플레이인지 서버에 확인/기록.
 * true(withinLimit)면 이번 판 하트는 전체 공유 집계에 반영, false면 "연습 모드"(집계 미반영).
 * 서버 미연결/오류 시에도 항상 true를 반환해 정상 플레이를 막지 않는다.
 */
export async function registerTournamentStart(): Promise<boolean> {
  try {
    const res = await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceId: getDeviceId() }),
    });
    if (!res.ok) return true;
    const data = await res.json();
    return data.withinLimit !== false;
  } catch {
    return true;
  }
}

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

/**
 * 하트 +n 적립: 로컬은 항상 즉시 반영(optimistic, 게임 재미 유지).
 * syncToServer가 true일 때만 전체 방문자 공유 집계(서버)에도 반영됨.
 * 하루 중복 플레이 방지를 위해, 그날 두 번째 이후 재플레이는 syncToServer=false로 호출되어
 * "연습 모드"로 처리 (로컬 화면엔 그대로 보이지만 서버 공유 순위엔 반영 안 됨,
 * 다음 서버 동기화 시 실제 공유 값으로 자동 보정됨).
 */
export function addHeart(
  name: string,
  amount = 1,
  syncToServer = true
): { allTime: HeartMap; month: HeartMap } {
  ensureMonthFresh();
  const allTime = readMap(ALL_TIME_KEY);
  const month = readMap(MONTH_KEY);
  allTime[name] = (allTime[name] || 0) + amount;
  month[name] = (month[name] || 0) + amount;
  writeMap(ALL_TIME_KEY, allTime);
  writeMap(MONTH_KEY, month);

  if (syncToServer) {
    // 서버 반영은 실패해도 로컬 UX에 영향 없도록 fire-and-forget
    fetch("/api/hearts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, amount }),
    }).catch(() => {
      // 서버 미연결(DB 세팅 전) 또는 네트워크 오류 - 로컬 값으로 계속 동작
    });
  }

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
  updatedAt?: string;
  rankChange?: Record<string, number | null>;
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

/**
 * VOV 주요 액션 계측 (항목 12): 게임시작/완주/전체순위보기/프로필보기/상담클릭 등.
 * 실패해도 절대 메인 흐름을 막지 않는 fire-and-forget 호출.
 */
export function trackEvent(eventType: string, contestantName?: string) {
  try {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventType, contestantName, deviceId: getDeviceId() }),
    }).catch(() => {});
  } catch {
    // ignore
  }
}

export function getContestant(name: string): Contestant | undefined {
  return CONTESTANTS.find((c) => c.name === name);
}

/** 이번 달 라벨 - 실제 날짜 기준 자동 계산 (더 이상 하드코딩 아님) */
export function currentMonthLabel(): string {
  return sharedMonthLabel(currentMonthStamp());
}
