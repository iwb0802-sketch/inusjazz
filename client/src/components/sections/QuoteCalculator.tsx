/**
 * QuoteCalculator - 내 조건 견적
 * 등급 선택 + 혜택 체크 → 최종 예상 금액을 계산 과정과 함께 보여주고 카톡으로 전달
 * 가격 데이터는 data/pricing.ts (가격표와 공용)
 */
import { useMemo, useState } from "react";
import { Check, Copy, MessageCircle, CalendarCheck } from "lucide-react";
import { BENEFIT_OPTIONS, PRICE_TIERS, amountFor, won, type BenefitOption, type TierId } from "@/data/pricing";

const KAKAO_LINK = "https://pf.kakao.com/_wxovaM/chat";

export default function QuoteCalculator() {
  const [tierId, setTierId] = useState<TierId>("premium");
  const [checked, setChecked] = useState<Record<string, boolean>>({ review: true, sns: false, friend: false, vov: false });
  const [notice, setNotice] = useState("");

  const tier = PRICE_TIERS.find((t) => t.id === tierId)!;
  const isApplicable = (b: BenefitOption) => !b.excludeTiers?.includes(tierId);

  const applied = useMemo(
    () => BENEFIT_OPTIONS.filter((b) => checked[b.id] && !b.excludeTiers?.includes(tierId)),
    [checked, tierId],
  );
  const discount = applied.reduce((n, b) => n + amountFor(b, tier), 0);
  const total = tier.list - discount;

  const summary = [
    "[이너스뮤직 사회자 견적 문의]",
    `등급: ${tier.name} (정가 ${won(tier.list)})`,
    ...applied.map((b) => `- ${b.label} -${won(amountFor(b, tier))}`),
    `예상 금액: ${won(total)}`,
    "예식일 / 예식장: ",
  ].join("\n");

  const sendToKakao = async () => {
    let copied = false;
    try {
      await navigator.clipboard.writeText(summary);
      copied = true;
    } catch {
      copied = false;
    }
    setNotice(
      copied
        ? "견적 내용이 복사되었습니다. 카톡 창에 붙여넣기 해주세요."
        : "카톡 창이 열립니다. 선택하신 등급과 혜택을 말씀해 주세요.",
    );
    window.open(KAKAO_LINK, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="mt-14 sm:mt-20">
      <div className="text-center mb-6 sm:mb-8">
        <span
          className="text-[#a8814f] text-[11px] sm:text-[13px] font-semibold tracking-[0.22em] uppercase"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          MY QUOTE
        </span>
        <h3
          className="mt-3 text-[#1a1a1a] text-[20px] sm:text-[26px] break-keep"
          style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
        >
          우리 예식 <span className="text-[#a8814f]">예상 금액</span> 계산
        </h3>
        <p className="mt-2 text-[#777] text-[12px] sm:text-[13px] break-keep leading-relaxed">
          등급과 혜택을 고르면 최종 금액을 바로 보여드립니다
        </p>
      </div>

      <div
        className="mx-auto max-w-2xl rounded-xl bg-white p-4 sm:p-7"
        style={{ border: "1px solid rgba(212,184,150,0.5)", boxShadow: "0 8px 32px -12px rgba(26,26,26,0.12)" }}
      >
        {/* 1. 등급 */}
        <p className="text-[#1a1a1a] text-[13.5px] sm:text-[14px] font-bold mb-2.5">
          <span className="text-[#a8814f] mr-1.5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>1</span>
          사회자 등급
        </p>
        <div role="radiogroup" aria-label="사회자 등급" className="grid grid-cols-2 gap-2 sm:gap-2.5">
          {PRICE_TIERS.map((t, i) => {
            const on = t.id === tierId;
            return (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setTierId(t.id)}
                className={`flex min-h-[60px] flex-col items-start justify-center rounded-lg px-3.5 py-2.5 text-left transition-all duration-200 active:scale-[0.98] ${
                  i === PRICE_TIERS.length - 1 ? "col-span-2" : ""
                }`}
                style={
                  on
                    ? { background: "#181512", border: "1px solid #181512" }
                    : { background: "#fff", border: "1px solid #e4dfd8" }
                }
              >
                <span className={`text-[13.5px] sm:text-[14px] font-semibold ${on ? "text-white" : "text-[#333]"}`}>
                  {t.name}
                </span>
                <span
                  className={`text-[12.5px] sm:text-[13px] font-bold mt-0.5 ${on ? "text-[#e0c188]" : "text-[#a8814f]"}`}
                >
                  {won(t.list)}
                </span>
              </button>
            );
          })}
        </div>

        {/* 2. 혜택 */}
        <p className="text-[#1a1a1a] text-[13.5px] sm:text-[14px] font-bold mt-6 mb-2.5">
          <span className="text-[#a8814f] mr-1.5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>2</span>
          적용할 혜택
        </p>
        <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #ece7e0" }}>
          {BENEFIT_OPTIONS.map((b, i) => {
            const ok = isApplicable(b);
            const on = ok && !!checked[b.id];
            return (
              <button
                key={b.id}
                type="button"
                role="checkbox"
                aria-checked={on}
                aria-disabled={!ok}
                disabled={!ok}
                onClick={() => setChecked((c) => ({ ...c, [b.id]: !c[b.id] }))}
                className={`flex w-full min-h-[60px] items-center gap-3 px-3.5 py-3 text-left transition-colors ${
                  ok ? "hover:bg-[#fbf7f2] active:bg-[#f5efe6]" : "bg-[#f7f5f2] cursor-not-allowed"
                }`}
                style={i > 0 ? { borderTop: "1px solid #f0ece7" } : undefined}
              >
                <span
                  className="flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-[5px]"
                  style={
                    on
                      ? { background: "#a8814f", border: "1px solid #a8814f" }
                      : { background: "#fff", border: `1px solid ${ok ? "#cfc7bc" : "#e3ded7"}` }
                  }
                >
                  {on && <Check size={14} className="text-white" strokeWidth={3} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block text-[13.5px] sm:text-[14.5px] break-keep leading-snug ${ok ? "text-[#2a2a2a]" : "text-[#aaa]"}`}>
                    {b.label}
                  </span>
                  <span className={`block text-[11.5px] mt-0.5 break-keep ${ok ? "text-[#999]" : "text-[#b5b0a8]"}`}>
                    {ok ? b.desc : "선택하신 등급에는 적용되지 않습니다"}
                  </span>
                </span>
                <span
                  className={`flex-shrink-0 text-[15px] sm:text-[16px] font-bold whitespace-nowrap ${ok ? "text-[#a8814f]" : "text-[#c5c0b8]"}`}
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  -{amountFor(b, tier) / 10000}만원
                </span>
              </button>
            );
          })}
        </div>

        {/* 결과 */}
        <div className="mt-6 rounded-lg px-4 py-5 sm:px-6" style={{ background: "#181512" }} aria-live="polite">
          <div className="space-y-1.5 text-[12.5px] sm:text-[13.5px]">
            <div className="flex items-center justify-between gap-3 text-white/60">
              <span>{tier.name} 정가</span>
              <span className="whitespace-nowrap">{won(tier.list)}</span>
            </div>
            {applied.map((b) => (
              <div key={b.id} className="flex items-center justify-between gap-3 text-white/60">
                <span className="break-keep">{b.label}</span>
                <span className="whitespace-nowrap text-[#e0c188]">-{won(amountFor(b, tier))}</span>
              </div>
            ))}
            {applied.length === 0 && (
              <div className="text-white/35 text-[12px]">적용된 혜택이 없습니다</div>
            )}
          </div>
          <div className="my-3.5 h-px bg-white/10" />
          <div className="flex items-end justify-between gap-3">
            <span className="text-white/80 text-[13px] sm:text-[14px] pb-1">최종 예상 금액</span>
            <span
              className="text-[#e0c188] text-[30px] sm:text-[36px] font-bold leading-none whitespace-nowrap"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {total.toLocaleString("ko-KR")}
              <span className="text-[15px] sm:text-[17px] ml-0.5 font-normal text-white/70" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>원</span>
            </span>
          </div>
          {discount > 0 && (
            <p className="mt-2 text-right text-white/40 text-[11px]">총 {won(discount)} 절약</p>
          )}
        </div>

        <p className="mt-3 text-center text-[#999] text-[11px] sm:text-[12px] break-keep leading-relaxed">
          부가세 포함 · 경기·인천 지역 출장비 별도
        </p>

        {/* 행동 */}
        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
          <button
            type="button"
            onClick={sendToKakao}
            className="inline-flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-sm bg-[#5BB5A2] px-5 text-[14.5px] font-bold text-white transition-colors hover:bg-[#4da393]"
          >
            <Copy size={16} />
            견적 복사하고 카톡 상담
          </button>
          <a
            href="/schedule"
            className="inline-flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-sm border border-[#1a1a1a]/20 px-5 text-[14px] font-semibold text-[#333] transition-colors hover:bg-[#fbf7f2]"
          >
            <CalendarCheck size={16} className="text-[#a8814f]" />
            예식일 가능한 사회자 확인
          </a>
        </div>
        {notice && (
          <p className="mt-3 flex items-start justify-center gap-1.5 text-center text-[#2f8b78] text-[12px] sm:text-[12.5px] font-medium break-keep leading-relaxed">
            <MessageCircle size={14} className="mt-[2px] flex-shrink-0" />
            {notice}
          </p>
        )}
      </div>
    </div>
  );
}
