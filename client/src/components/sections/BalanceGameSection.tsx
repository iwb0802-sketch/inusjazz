/**
 * BalanceGameSection - 밸런스 게임 진입 배너
 * "당신의 웨딩 사회 취향은?" 재미있는 밸런스 게임으로 참여 유도
 */
import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import BalanceGameModal from "./BalanceGameModal";

export default function BalanceGameSection() {
  const [open, setOpen] = useState(false);
  const anim = useScrollAnimation();

  return (
    <section className="bg-[#0d0d0d] py-20 sm:py-24 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#5BB5A2] blur-[180px]" />
      </div>

      <div ref={anim.ref} className={`relative max-w-2xl mx-auto px-4 sm:px-6 text-center fade-up ${anim.isVisible ? "visible" : ""}`}>
        <span className="text-[#5BB5A2] text-xs sm:text-sm tracking-[0.3em] uppercase" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          BALANCE GAME
        </span>
        <h2 className="mt-4 text-white text-2xl sm:text-3xl md:text-4xl mb-4" style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}>
          🎉 당신의 <span className="text-[#5BB5A2]">웨딩 사회 취향</span>은?
        </h2>
        <p className="text-white/50 text-sm sm:text-base mb-10 leading-relaxed break-keep">
          8개의 밸런스 게임으로 알아보는 나의 웨딩 사회 취향!
          <br />
          결과에 따라 나랑 찰떡궁합인 사회자도 알려드려요.
        </p>

        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-3 px-10 py-4 text-sm sm:text-base font-semibold tracking-wider transition-all duration-300 rounded-sm hover:-translate-y-0.5"
          style={{
            background: "linear-gradient(135deg, #5BB5A2 0%, #4a9d8c 100%)",
            color: "#fff",
            boxShadow: "0 4px 24px rgba(91,181,162,0.35)",
          }}
        >
          🎮 밸런스 게임 시작하기
        </button>
      </div>

      <BalanceGameModal isOpen={open} onClose={() => setOpen(false)} />
    </section>
  );
}
