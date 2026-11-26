/**
 * PricingSection - 사회자 가격표
 * Design: Light background, two-column pricing cards + service icons grid
 * 지정 배정 vs 랜덤 배정 (포함 서비스 항목은 EventSection으로 통합)
 */
import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import {
  ChevronDown,
  Diamond,
  Check,
  Shuffle,
  UserCheck,
  MapPin,
  Crown,
  PlayCircle,
  Star,
  ShieldCheck,
  Users,
} from "lucide-react";
import { PRICE_TIERS, TRAVEL_AREAS, won } from "@/data/pricing";
import { PROOF_TOTAL, PROOF_AS_OF } from "@/data/reviewStats";

const DESIGNATED_EVENT = PRICE_TIERS.filter((t) => t.designated).map((t) => t.event);
const EVENT_MAX = Math.max(...DESIGNATED_EVENT).toLocaleString("ko-KR");
const EVENT_MIN = Math.min(...DESIGNATED_EVENT).toLocaleString("ko-KR");
const RANDOM_TIER = PRICE_TIERS.find((t) => !t.designated)!;

// 가격 옆에 보여주는 근거 (가격 차이를 설명하는 영역)
const PRICE_REASONS = [
  {
    Icon: PlayCircle,
    t: "영상과 목소리로 직접 선택",
    d: "사회자 18인의 진행 영상과 목소리를 먼저 확인하고, 지정 배정으로 직접 고르실 수 있습니다.",
  },
  {
    Icon: Star,
    t: `실제 후기 ${PROOF_TOTAL.toLocaleString("ko-KR")}건`,
    d: `6개 채널에 쌓인 후기의 합산입니다. (${PROOF_AS_OF} 기준)`,
  },
  {
    Icon: ShieldCheck,
    t: "결제 금액 2배 환불 보장",
    d: "사회자가 도착하지 못하거나 본식 시작 이후 도착하면 결제 금액의 2배를 환불해 드립니다.",
  },
  {
    Icon: Users,
    t: "예비 사회자 · 대표 상시 대기",
    d: "예비 사회자가 대기하고, 대표도 서브 인원으로 함께 대기해 돌발 상황에 바로 대응합니다.",
  },
];


export default function PricingSection() {
  const [showDiscount, setShowDiscount] = useState(false);
  const anim1 = useScrollAnimation();
  const anim2 = useScrollAnimation();
  const anim3 = useScrollAnimation();

  return (
    <section id="pricing" className="relative bg-[#f8f6f3] pt-20 sm:pt-24 pb-10 sm:pb-12">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-16" style={{ background: "linear-gradient(180deg, #1a1a1a 0%, #f8f6f3 100%)" }} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={anim1.ref} className={`text-center mb-10 sm:mb-12 fade-up ${anim1.isVisible ? "visible" : ""}`}>
          <span
            className="text-[#a8814f] text-[11px] sm:text-[13px] font-semibold tracking-[0.22em] uppercase"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            WEDDING MC PRICING
          </span>
          <h2
            className="mt-4 text-[#1a1a1a] text-2xl sm:text-3xl md:text-4xl"
            style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
          >
            사회자 <span className="text-[#a8814f]">가격 안내</span>
          </h2>
        </div>

        {/* Pricing Cards */}
        <div ref={anim2.ref} className={`fade-up ${anim2.isVisible ? "visible" : ""}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">

            {/* 지정 배정 */}
            <div className="relative bg-white border-2 border-[#d4b896]/40 rounded-sm overflow-hidden">
              {/* Badge */}
              <div className="bg-[#1a1a1a] py-4 px-6 flex items-center justify-center gap-3">
                <UserCheck size={20} className="text-[#d4b896]" />
                <span
                  className="text-white text-lg sm:text-xl tracking-wider"
                  style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
                >
                  사회자 지정 배정
                </span>
              </div>

              <div className="p-6 sm:p-8">
                {/* Price Range */}
                <div className="text-center mb-6">
                  <p className="text-[#8a8a8a] text-[12px] sm:text-[13px] font-semibold tracking-[0.1em] mb-1.5">정가</p>
                  <p className="text-[#1a1a1a] text-2xl sm:text-3xl font-bold tracking-tight break-keep">
                    <span className="whitespace-nowrap">250,000<span className="text-base font-normal text-[#666]">원</span></span>
                    <span className="text-[#ccc] font-normal mx-1.5">~</span>
                    <span className="whitespace-nowrap">160,000<span className="text-base font-normal text-[#666]">원</span></span>
                  </p>

                  <button
                    type="button"
                    onClick={() => setShowDiscount((v) => !v)}
                    className={`inline-flex w-full items-center justify-center gap-1.5 mt-4 rounded-full tracking-wide transition-all duration-300 active:scale-[0.98] ${
                      showDiscount
                        ? "px-4 py-2 text-[12px] font-semibold text-[#9a9a9a] hover:text-[#555]"
                        : "px-5 py-3.5 text-[13.5px] sm:text-[15px] font-bold text-white hover:brightness-110"
                    }`}
                    style={
                      showDiscount
                        ? { background: "transparent" }
                        : { background: "#1a1a1a", boxShadow: "0 4px 16px rgba(26,26,26,0.22)" }
                    }
                  >
                    {showDiscount ? "혜택가 닫기" : (
                      <>
                        <span className="text-[#f0d9a8]">혜택 적용가</span> 보기
                      </>
                    )}
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-300 ${showDiscount ? "rotate-180" : ""}`}
                    />
                  </button>

                  <div
                    className="overflow-hidden transition-all duration-500 ease-out"
                    style={{ maxHeight: showDiscount ? 200 : 0, opacity: showDiscount ? 1 : 0 }}
                  >
                    <div
                      className="mt-4 rounded-lg py-4 px-3"
                      style={{ background: "#fbf7f2", border: "1px solid rgba(192,154,126,0.45)" }}
                    >
                      <p className="text-[13px] sm:text-sm font-bold tracking-wide mb-1.5 break-keep" style={{ color: "#a87b57" }}>이벤트 참여 시</p>
                      <p className="text-[#1a1a1a] text-2xl sm:text-3xl font-bold tracking-tight break-keep">
                        <span className="whitespace-nowrap">{EVENT_MAX}<span className="text-base font-normal text-[#666]">원</span></span>
                        <span className="text-[#c9b49c] font-normal mx-1.5">~</span>
                        <span className="whitespace-nowrap">{EVENT_MIN}<span className="text-base font-normal text-[#666]">원</span></span>
                      </p>
                      <p className="text-[#777] text-[11.5px] sm:text-xs font-medium mt-2.5 break-keep leading-relaxed">
                        상담 후기 · SNS · 지인 · VOV 혜택을 <span className="font-bold text-[#a87b57]">모두 적용</span>한 가격
                        <span className="block mt-0.5 text-[10.5px] text-[#999]">시그니처 등급은 VOV 제외 · SNS 혜택은 금액대별</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tier List */}
                <div className="flex items-center justify-between px-1 mb-1.5">
                  <span className="text-[#999] text-[11.5px] font-semibold tracking-wide">등급</span>
                  <span className="text-[#999] text-[11.5px] font-semibold tracking-wide">{showDiscount ? "정가 / 이벤트 참여가" : "정가"}</span>
                </div>
                <div className="space-y-3 mb-8">
                  {PRICE_TIERS.filter((t) => t.designated).map((t) => (
                    <div key={t.id} className="flex items-center justify-between py-3 border-b border-[#f0ece7]">
                      <div className="flex items-center gap-2">
                        {t.id === "signature" ? (
                          <Crown size={14} className="text-[#c9a961]" />
                        ) : (
                          <Diamond size={14} className="text-[#d4b896]" />
                        )}
                        <span className="text-[#333] text-base font-semibold">{t.name}</span>
                      </div>
                      <span className="flex items-baseline gap-1.5">
                        <span className="text-[#1a1a1a] text-base font-bold">{won(t.list)}</span>
                        {showDiscount && (
                          <span className="text-[#a87b57] text-[13px] font-bold">/ {won(t.event)}</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Check size={16} className="text-[#a8814f] flex-shrink-0 mt-0.5" />
                    <span className="text-[#555] text-sm">원하는 사회자 직접 선택</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check size={16} className="text-[#a8814f] flex-shrink-0 mt-0.5" />
                    <span className="text-[#555] text-sm">진행 스타일 & 영상 사전 확인</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check size={16} className="text-[#a8814f] flex-shrink-0 mt-0.5" />
                    <span className="text-[#555] text-sm">예식에 최적화된 맞춤형 설계</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 랜덤 배정 */}
            <div className="relative bg-white border border-[#e8e4df] rounded-sm overflow-hidden">
              {/* Badge */}
              <div className="bg-[#efe8dd] py-4 px-6 flex items-center justify-center gap-3">
                <Shuffle size={20} className="text-[#a8814f]" />
                <span
                  className="text-[#1a1a1a] text-lg sm:text-xl tracking-wider"
                  style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
                >
                  사회자 랜덤 배정
                </span>
              </div>

              <div className="p-6 sm:p-8">
                {/* Price */}
                <div className="text-center mb-6">
                  <p className="text-[#999] text-[11px] sm:text-xs tracking-[0.14em] mb-1.5">정가</p>
                  <p className="text-[#1a1a1a] text-3xl sm:text-4xl font-bold tracking-tight whitespace-nowrap">
                    {RANDOM_TIER.list.toLocaleString("ko-KR")}<span className="text-base font-normal text-[#666]">원</span>
                  </p>

                  <button
                    type="button"
                    onClick={() => setShowDiscount((v) => !v)}
                    className={`inline-flex w-full items-center justify-center gap-1.5 mt-4 rounded-full tracking-wide transition-all duration-300 active:scale-[0.98] ${
                      showDiscount
                        ? "px-4 py-2 text-[12px] font-semibold text-[#9a9a9a] hover:text-[#555]"
                        : "px-5 py-3.5 text-[13.5px] sm:text-[15px] font-bold text-white hover:brightness-110"
                    }`}
                    style={
                      showDiscount
                        ? { background: "transparent" }
                        : { background: "#1a1a1a", boxShadow: "0 4px 16px rgba(26,26,26,0.22)" }
                    }
                  >
                    {showDiscount ? "혜택가 닫기" : (
                      <>
                        <span className="text-[#f0d9a8]">혜택 적용가</span> 보기
                      </>
                    )}
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-300 ${showDiscount ? "rotate-180" : ""}`}
                    />
                  </button>

                  <div
                    className="overflow-hidden transition-all duration-500 ease-out"
                    style={{ maxHeight: showDiscount ? 200 : 0, opacity: showDiscount ? 1 : 0 }}
                  >
                    <div
                      className="mt-4 rounded-lg py-4 px-3"
                      style={{ background: "rgba(212,184,150,0.07)", border: "1px dashed rgba(212,184,150,0.45)" }}
                    >
                      <p className="text-[#a08a6f] text-[11px] sm:text-xs tracking-[0.12em] mb-1 break-keep">이벤트 참여 시</p>
                      <p className="text-[#1a1a1a] text-3xl sm:text-4xl font-bold tracking-tight whitespace-nowrap">
                        {RANDOM_TIER.event.toLocaleString("ko-KR")}<span className="text-base font-normal text-[#666]">원</span>
                      </p>
                      <p className="text-[#999] text-[10.5px] sm:text-[11px] mt-2 break-keep leading-relaxed">
                        상담 후기 · SNS · 지인 · VOV 혜택을 모두 적용한 가격
                      </p>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3 py-3 border-b border-[#f0ece7]">
                    <Check size={16} className="text-[#a8814f] flex-shrink-0 mt-0.5" />
                    <span className="text-[#555] text-sm">3가지 등급의 사회자 중 1인 자동 배정</span>
                  </div>
                  <div className="flex items-start gap-3 py-3 border-b border-[#f0ece7]">
                    <Check size={16} className="text-[#a8814f] flex-shrink-0 mt-0.5" />
                    <span className="text-[#555] text-sm">예식 전주 금요일 배정</span>
                  </div>
                  <div className="flex items-start gap-3 py-3 border-b border-[#f0ece7]">
                    <Check size={16} className="text-[#a8814f] flex-shrink-0 mt-0.5" />
                    <span className="text-[#555] text-sm">안정적인 진행</span>
                  </div>
                  <div className="flex items-start gap-3 py-3 border-b border-[#f0ece7]">
                    <Check size={16} className="text-[#d4b896] flex-shrink-0 mt-0.5" />
                    <span className="text-[#888] text-xs italic">사전 질문지·정보체크지 및 맞춤형 대본제작은 지정 사회자 선택시 제공</span>
                  </div>
                </div>


              </div>
            </div>
          </div>

          {/* 가격 근거 */}
          <div className="mt-8 sm:mt-10 rounded-sm border border-[#d4b896]/40 bg-white px-5 sm:px-8 py-7 sm:py-8">
            <p
              className="text-center text-[#1a1a1a] text-base sm:text-lg break-keep"
              style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
            >
              이 가격에 담긴 <span className="text-[#a8814f]">약속</span>
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
              {PRICE_REASONS.map(({ Icon, t, d }) => (
                <div key={t} className="flex items-start gap-3.5">
                  <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#faf6f0] border border-[#d4b896]/50">
                    <Icon size={17} className="text-[#a8814f]" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[#1a1a1a] text-[14.5px] sm:text-[15px] font-bold break-keep">{t}</p>
                    <p className="mt-1 text-[#777] text-[12.5px] sm:text-[13px] leading-relaxed break-keep">{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-[#999] text-xs mt-8">
            ※ 모든 가격은 부가세 포함 금액입니다. 자세한 내용은 카카오톡 상담을 통해 확인해주세요.
          </p>
        </div>

        {/* 안내 문구 (Included Service 항목은 이벤트 섹션 '사회자 예약 시 혜택'으로 통합) */}
        <div ref={anim3.ref} className={`mt-12 sm:mt-16 fade-up ${anim3.isVisible ? "visible" : ""}`}>
          {/* Notes */}
          <div className="space-y-3 max-w-3xl mx-auto">
            <p className="text-center text-[#777] text-xs sm:text-sm break-keep">
              ※ 랜덤 배정 / 지정 배정 모두 명시된 사항을 제외한 모든 혜택은 동일하게 제공됩니다.
            </p>
          </div>

          {/* 출장비 안내 */}
          <div className="mt-10 sm:mt-12 mx-auto max-w-md">
            <div className="flex items-center justify-center gap-2 text-[#1a1a1a] text-sm sm:text-[15px] font-bold">
              <MapPin size={15} className="text-[#a8814f] flex-shrink-0" />
              출장비 안내
            </div>
            <p className="mt-1.5 text-center text-[#999] text-[11.5px] sm:text-xs">사회자 1인 기준 · 부가세 포함</p>
            <ul className="mt-4 rounded-lg bg-white border border-[#ece7e0] divide-y divide-[#f0ece7]">
              {TRAVEL_AREAS.filter((a) => a.fee !== null).map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-4 px-4 sm:px-5 py-3 text-[13px] sm:text-sm">
                  <span className="text-[#555] break-keep">{a.label}</span>
                  <span className="text-[#1a1a1a] font-semibold whitespace-nowrap">
                    {a.fee === 0 ? "추가 비용 없음" : won(a.fee as number)}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-center text-[#888] text-[11.5px] sm:text-xs break-keep leading-relaxed">
              그 외 지역은 예식 장소를 알려주시면 확인 후 안내드리겠습니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
