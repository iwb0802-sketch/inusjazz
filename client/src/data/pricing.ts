/**
 * 사회자 가격 데이터 (가격표 · 견적 계산기 공용)
 * 가격을 바꿀 때는 이 파일만 수정하면 두 곳에 같이 반영됩니다.
 */
export type TierId = "signature" | "premium" | "best" | "standard" | "random";

export interface PriceTier {
  id: TierId;
  name: string;
  /** 정가 */
  list: number;
  /** 이벤트 참여가 (모든 혜택 중복 적용 시, 자동 계산) */
  event: number;
  /** 지정 배정 여부 (false = 랜덤 배정) */
  designated: boolean;
}

export interface BenefitOption {
  id: "review" | "sns" | "friend" | "vov";
  label: string;
  desc: string;
  /** 고정 금액 (금액대별 혜택은 amountFor 로 계산) */
  amount: number;
  /** 적용되지 않는 등급 */
  excludeTiers?: TierId[];
}

/** SNS 선택 후기 할인: 정가 금액대 기준 (10만원대 1만 · 20만원대 2만 · 30만원 이상 3만) */
export const snsDiscount = (list: number) => (list >= 300000 ? 30000 : list >= 200000 ? 20000 : list >= 100000 ? 10000 : 0);

export const BENEFIT_OPTIONS: BenefitOption[] = [
  { id: "review", label: "상담 후기 작성", desc: "네이버 · 숨고", amount: 20000 },
  { id: "sns", label: "SNS에 선택 이유 남기기", desc: "블로그 · 카페 · 인스타 · 금액대별", amount: 0 },
  { id: "friend", label: "지인 코드번호 사용", desc: "이용 고객 코드", amount: 10000 },
  {
    id: "vov",
    label: "지난달 VOV 선정 사회자 지정",
    desc: "시그니처 등급은 해당 없음",
    amount: 10000,
    excludeTiers: ["signature"],
  },
];

/** 등급별 혜택 금액 */
export const amountFor = (b: BenefitOption, tier: { list: number }) => (b.id === "sns" ? snsDiscount(tier.list) : b.amount);

const eventPrice = (id: TierId, list: number) =>
  list -
  BENEFIT_OPTIONS.filter((b) => !b.excludeTiers?.includes(id)).reduce((n, b) => n + amountFor(b, { list }), 0);

const T = (id: TierId, name: string, list: number, designated: boolean): PriceTier => ({
  id,
  name,
  list,
  event: eventPrice(id, list),
  designated,
});

/** 이벤트 참여가는 정가 − 적용 가능한 모든 혜택으로 자동 계산됩니다 */
export const PRICE_TIERS: PriceTier[] = [
  T("signature", "시그니처 등급", 250000, true),
  T("premium", "프리미엄 등급", 220000, true),
  T("best", "베스트 등급", 180000, true),
  T("standard", "일반 등급", 160000, true),
  T("random", "랜덤 배정", 140000, false),
];

export const won = (n: number) => `${n.toLocaleString("ko-KR")}원`;

/**
 * 지역별 출장비 (사회자 1인 기준, 부가세 포함)
 * fee === null 은 "그 외 지역(상담 후 안내)". 가격표와 견적 계산기가 공용으로 사용합니다.
 */
export interface TravelArea {
  id: string;
  /** 계산기 선택지 표기 */
  label: string;
  /** 출장비(원). null = 상담 후 안내 */
  fee: number | null;
}

export const TRAVEL_AREAS: TravelArea[] = [
  { id: "seoul", label: "서울", fee: 0 },
  { id: "gwangmyeong", label: "광명", fee: 10000 },
  { id: "anyang", label: "안양·성남·야탑", fee: 20000 },
  { id: "bundang", label: "분당·부천", fee: 30000 },
  { id: "suwon", label: "의정부·수원·인천·용인", fee: 40000 },
  { id: "other", label: "그 외 지역", fee: null },
];
