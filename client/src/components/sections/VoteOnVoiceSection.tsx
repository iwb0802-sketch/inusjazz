/**
 * VoteOnVoiceSection - "VOTE ON VOICE" 사회자 투표 콘테스트 프로모션 섹션
 * Design: Dark background, gold/mint 브랜드 컬러, 콘테스트 페이지(/contest)로 연결
 */
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Crown, ChevronRight } from "lucide-react";
import { currentMonthLabel } from "@/components/contest/contestData";

const GOLD = "#d4b896";
const MINT = "#5BB5A2";

export default function VoteOnVoiceSection() {
  const anim1 = useScrollAnimation();
  const monthLabel = currentMonthLabel();

  return (
    <section id="vote-on-voice" className="relative overflow-hidden py-20 sm:py-28" style={{ background: "#0d0d0d" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(212,184,150,0.06) 0%, transparent 65%)" }} />

      <div
        ref={anim1.ref}
        className={`relative max-w-3xl mx-auto px-4 sm:px-6 text-center fade-up ${anim1.isVisible ? "visible" : ""}`}
      >
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
          style={{ background: "rgba(212,184,150,0.1)", border: "1px solid rgba(212,184,150,0.35)" }}
        >
          <Crown size={14} style={{ color: GOLD }} />
          <span className="text-xs font-semibold tracking-[0.15em] uppercase" style={{ color: GOLD }}>
            {monthLabel} <span style={{ color: MINT }}>V</span>OTE <span style={{ color: MINT }}>O</span>N <span style={{ color: MINT }}>V</span>OICE
          </span>
        </div>

        <h2
          className="text-white text-2xl sm:text-3xl md:text-4xl mb-5 leading-snug break-keep"
          style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
        >
          이달의 목소리는,
          <br />
          <span style={{ color: GOLD }}>당신의 투표</span>로 결정됩니다
        </h2>

        <p className="text-white/50 text-sm sm:text-base leading-relaxed mb-3 max-w-xl mx-auto break-keep">
          INUS MUSIC 사회자들의 매력 대결, <span className="whitespace-nowrap">VOTE ON VOICE.</span>
          <br />
          마음에 드는 사회자에게 하트를 투표하고,
          <br className="sm:hidden" />
          {" "}이달의 챔피언을 직접 만들어보세요.
        </p>

        <p className="text-sm sm:text-base leading-relaxed mb-10 max-w-xl mx-auto font-medium break-keep" style={{ color: MINT }}>
          투표로 뽑힌 지난달의 챔피언,
          <br className="sm:hidden" />
          {" "}예약하면 1만원 할인 혜택도 받을 수 있어요.
        </p>

        <a
          href="/contest"
          className="relative inline-flex items-center gap-1.5 sm:gap-2 px-6 sm:px-9 py-4 sm:py-[18px] rounded-full text-sm sm:text-base font-bold whitespace-nowrap transition-transform hover:scale-105"
          style={{
            background: `linear-gradient(135deg, ${GOLD} 0%, #e8cd9e 50%, ${GOLD} 100%)`,
            color: "#0d0d0d",
            animation: "voteGlowPulse 2.2s ease-in-out infinite",
          }}
        >
          <span style={{ color: MINT }}>V</span>OTE <span style={{ color: MINT }}>O</span>N <span style={{ color: MINT }}>V</span>OICE 투표하러 가기
          <ChevronRight size={18} className="shrink-0" />
        </a>

        <p className="text-white/35 text-xs mt-3">
          소요시간 2~3분
        </p>
      </div>

      <style>{`
        @keyframes voteGlowPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(212,184,150,0.55), 0 4px 20px rgba(212,184,150,0.35); }
          50% { box-shadow: 0 0 0 14px rgba(212,184,150,0), 0 4px 28px rgba(212,184,150,0.55); }
        }
      `}</style>
    </section>
  );
}
