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
  /** 이벤트 참여가 (혜택 최대 적용 시) */
  event: number;
  /** 지정 배정 여부 (false = 랜덤 배정) */
  designated: boolean;
}

export const PRICE_TIERS: PriceTier[] = [
  { id: "signature", name: "시그니처 등급", list: 250000, event: 220000, designated: true },
  { id: "premium", name: "프리미엄 등급", list: 220000, event: 180000, designated: true },
  { id: "best", name: "베스트 등급", list: 180000, event: 140000, designated: true },
  { id: "standard", name: "일반 등급", list: 160000, event: 120000, designated: true },
  { id: "random", name: "랜덤 배정", list: 140000, event: 100000, designated: false },
];

export interface BenefitOption {
  id: "review" | "friend" | "vov";
  label: string;
  desc: string;
  amount: number;
  /** 적용되지 않는 등급 */
  excludeTiers?: TierId[];
}

export const BENEFIT_OPTIONS: BenefitOption[] = [
  { id: "review", label: "상담 후기 작성", desc: "네이버 · 숨고", amount: 20000 },
  { id: "friend", label: "지인 코드번호 사용", desc: "이용 고객 코드", amount: 10000 },
  {
    id: "vov",
    label: "지난달 VOV 선정 사회자 지정",
    desc: "시그니처 등급은 해당 없음",
    amount: 10000,
    excludeTiers: ["signature"],
  },
];

export const won = (n: number) => `${n.toLocaleString("ko-KR")}원`;
