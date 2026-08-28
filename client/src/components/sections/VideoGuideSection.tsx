/**
 * VideoGuideSection - 실제 본식 사회 영상 안내 (컴팩트)
 * 사회자 카드/숨은 강자에서 이미 인물은 전부 노출되므로, 등급별 영상 링크만 짧게 제공
 * Design: Premium dark + gold accent
 */
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Crown, Star, Mic, Play } from "lucide-react";

const TIERS = [
  {
    name: "프리미엄",
    sub: "PREMIUM",
    icon: Crown,
    link: "https://blog.naver.com/PostList.naver?blogId=inusmusics&from=postList&categoryNo=59",
  },
  {
    name: "베스트",
    sub: "BEST",
    icon: Star,
    link: "https://blog.naver.com/PostList.naver?blogId=inusmusics&from=postList&categoryNo=69",
  },
  {
    name: "스탠다드",
    sub: "STANDARD",
    icon: Mic,
    link: "https://blog.naver.com/PostList.naver?blogId=inusmusics&from=postList&categoryNo=62",
  },
];

export default function VideoGuideSection() {
  const anim = useScrollAnimation();

  return (
    <section id="video-guide" className="relative bg-[#0a0a0a] py-14 sm:py-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4b896]/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4b896]/30 to-transparent" />
      </div>

      <div
        ref={anim.ref}
        className={`relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 fade-up ${anim.isVisible ? "visible" : ""}`}
      >
        {/* Header */}
        <div className="text-center mb-7 sm:mb-9">
          <span
            className="text-[#d4b896] text-[11px] sm:text-xs tracking-[0.28em] uppercase font-semibold"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            REAL WEDDING FILM
          </span>

          <h2
            className="mt-2.5 text-white text-[19px] min-[375px]:text-[21px] sm:text-[26px] leading-snug break-keep"
            style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
          >
            <span className="whitespace-nowrap">
              연출 없는 <span className="text-[#5BB5A2]">실제 본식 영상</span>
            </span>{" "}
            <span className="whitespace-nowrap">등급별로 보기</span>
          </h2>
        </div>

        {/* Tier Rows */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
          {TIERS.map((tier) => {
            const Icon = tier.icon;
            return (
              <a
                key={tier.name}
                href={tier.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 sm:flex-col sm:gap-2 sm:text-center bg-[#141414] border border-[#d4b896]/20 rounded-lg px-4 py-3.5 sm:py-5 transition-all duration-300 hover:border-[#d4b896]/50 active:scale-[0.99]"
              >
                <div className="w-9 h-9 rounded-full bg-[#0d0d0d] border border-[#d4b896]/30 flex items-center justify-center flex-shrink-0 transition-colors duration-300 group-hover:border-[#d4b896]/60">
                  <Icon size={16} className="text-[#d4b896]" />
                </div>

                <div className="min-w-0 flex-1 sm:flex-none text-left sm:text-center">
                  <p
                    className="text-[#d4b896]/55 text-[9px] tracking-[0.24em] uppercase"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {tier.sub}
                  </p>
                  <h3
                    className="text-white text-[15px] sm:text-lg font-bold"
                    style={{ fontFamily: "'Noto Serif KR', serif" }}
                  >
                    {tier.name}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 text-[#5BB5A2] text-xs font-medium flex-shrink-0 sm:mt-1">
                  <Play size={11} className="fill-[#5BB5A2]" />
                  <span className="whitespace-nowrap">영상 보기</span>
                </div>
              </a>
            );
          })}
        </div>

        <p className="mt-6 text-center text-white/40 text-[12.5px] sm:text-sm leading-relaxed break-keep">
          <span className="whitespace-nowrap">실제 본식에서 확인되는</span>{" "}
          <span className="text-[#d4b896]/90 whitespace-nowrap">분위기와 진행 완성도</span>를{" "}
          <span className="whitespace-nowrap">직접 비교해보세요.</span>
        </p>
      </div>
    </section>
  );
}
