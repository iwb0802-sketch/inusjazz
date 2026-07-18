/**
 * 보이스 크라운 콘테스트 - 데이터 & localStorage 헬퍼
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
  },
  {
    name: "고승범",
    tier: "BEST",
    desc: "5년+ 경력",
    image: "/images/mc-profile-4_a9e52880.jpg",
    highlight: "자연스럽고 세련된 진행 스타일이 특징입니다.",
    profileUrl: "https://www.inusmusic.com/profile-seungbeom.html",
    audioFile: "/audio/mc-seungbeom.mp3",
  },
  {
    name: "이도영",
    tier: "BEST",
    desc: "4년+ 경력",
    image: "/images/mc-profile-2_f194877b.jpg",
    highlight: "따뜻하고 안정적인 진행으로 신랑신부님의 이야기를 감동적으로 전달합니다.",
    profileUrl: "https://www.inusmusic.com/profile-idoyoung.html",
    audioFile: "/audio/mc-idoyoung.mp3",
  },
  {
    name: "석재선",
    tier: "BEST",
    desc: "5년+ 경력",
    image: "/images/mc-profile-3_33ff7a32.jpg",
    highlight: "차분하면서도 격식 있는 진행으로 품격 있는 예식을 만들어드립니다.",
    profileUrl: "https://www.inusmusic.com/profile-jaesun.html",
    audioFile: "/audio/mc-jaesun.mp3",
  },
  {
    name: "이우영",
    tier: "PREMIUM",
    desc: "10년+ 경력",
    image: "/images/mc-lee-wooyoung-new_fa27e84d.webp",
    highlight: "편안한 아나운서 톤과 안정적인 진행력으로 위트 있고 깔끔한 예식을 완성하는 사회자입니다.",
    profileUrl: "https://www.inusmusic.com/profile-wooyoung.html",
    audioFile: "/audio/mc-wooyoung.mp3",
  },
  {
    name: "김선혁",
    tier: "BEST",
    desc: "5년+ 경력",
    image: "/images/host_sunhyuk_1ed704ab.jpg",
    highlight: "깔끔하고 안정감 있는 진행력을 기반으로 탁월한 상황 대처 능력을 갖춘 사회자입니다.",
    profileUrl: "https://www.inusmusic.com/profile-sunhyuk.html",
    audioFile: "/audio/mc-sunhyuk.mp3",
  },
  {
    name: "장윤태",
    tier: "PREMIUM",
    desc: "10년+ 경력",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663604364385/YIRjIXsBhCqAiMgE.jpg",
    highlight: "안정적인 진행력과 젠틀한 진행으로 예식의 완성도를 높입니다.",
    profileUrl: "https://www.inusmusic.com/profile-yuntae.html",
    audioFile: "/audio/mc-yuntae.mp3",
  },
  {
    name: "길상우",
    tier: "BEST",
    desc: "5년+ 경력",
    image: "https://storage.googleapis.com/runable-templates/cli-uploads%2FeblzJGDjOG2vKrak7NizAO4MJKnCG921%2FPcvLRqLzT-JnfPrulzmCo%2Fmc-gilsangwoo.jpg",
    highlight: "센스와 위트를 겸비한 진행력이 강점인 사회자입니다.",
    profileUrl: "https://www.inusmusic.com/profile-gilsangwoo.html",
    audioFile: "/audio/mc-gilsangwoo.mp3",
  },
  {
    name: "최윤아",
    tier: "PREMIUM",
    desc: "10년+ 경력",
    image: "/images/mc-yuna.jpg",
    highlight: "세련된 진행과 따뜻한 톤으로 순간의 가치를 빛내는 사회자입니다.",
    profileUrl: "https://www.inusmusic.com/profile-yuna.html",
    audioFile: "/audio/mc-yoona.mp3",
  },
];

// ---------------------------------------------------------------------------
// localStorage 기반 하트 저장 (데모/임시 페이지 - 서버 저장 아님)
// ---------------------------------------------------------------------------

const ALL_TIME_KEY = "inus_contest_hearts_alltime_v1";
const MONTH_KEY = "inus_contest_hearts_month_v1";
const MONTH_STAMP_KEY = "inus_contest_month_stamp_v1";

type HeartMap = Record<string, number>;

function currentMonthStamp(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}`;
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

/** 이번 달이 바뀌었으면 이번달 하트만 초기화 (전체 누적은 유지) */
function ensureMonthFresh() {
  const stamp = localStorage.getItem(MONTH_STAMP_KEY);
  const now = currentMonthStamp();
  if (stamp !== now) {
    writeMap(MONTH_KEY, {});
    localStorage.setItem(MONTH_STAMP_KEY, now);
  }
}

export function getAllTimeHearts(): HeartMap {
  return readMap(ALL_TIME_KEY);
}

export function getMonthHearts(): HeartMap {
  ensureMonthFresh();
  return readMap(MONTH_KEY);
}

/** 하트 +n 적립 (전체 누적 + 이번달 누적 동시 반영) */
export function addHeart(name: string, amount = 1): { allTime: HeartMap; month: HeartMap } {
  ensureMonthFresh();
  const allTime = readMap(ALL_TIME_KEY);
  const month = readMap(MONTH_KEY);
  allTime[name] = (allTime[name] || 0) + amount;
  month[name] = (month[name] || 0) + amount;
  writeMap(ALL_TIME_KEY, allTime);
  writeMap(MONTH_KEY, month);
  return { allTime, month };
}

export function getContestant(name: string): Contestant | undefined {
  return CONTESTANTS.find((c) => c.name === name);
}

// 지난달 확정 보이스 크라운 (데모용 placeholder 데이터)
export const LAST_MONTH_CHAMPION = {
  name: "이우영",
  hearts: 358,
  monthLabel: "6월",
};

export function currentMonthLabel(): string {
  return "7월";
}
