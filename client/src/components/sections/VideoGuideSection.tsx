/**
 * VideoGuideSection - 실제 본식 사회 영상 안내
 * Design: Premium dark + gold accent, attention-grabbing layout
 * Brand: Mint (#5BB5A2) + Gold (#d4b896)
 */
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Crown, Star, Mic, Play } from "lucide-react";

const TIERS = [
  {
    name: "프리미엄",
    sub: "PREMIUM",
    icon: Crown,
    desc: "10년+ 경력의 최상위 사회자",
    link: "https://blog.naver.com/PostList.naver?blogId=inusmusics&from=postList&categoryNo=59",
  },
  {
    name: "베스트",
    sub: "BEST",
    icon: Star,
    desc: "검증된 실력의 인기 사회자",
    link: "https://blog.naver.com/PostList.naver?blogId=inusmusics&from=postList&categoryNo=69",
  },
  {
    name: "스탠다드",
    sub: "STANDARD",
    icon: Mic,
    desc: "안정적인 진행의 전문 사회자",
    link: "https://blog.naver.com/PostList.naver?blogId=inusmusics&from=postList&categoryNo=62",
  },
];

export default function VideoGuideSection() {
  const anim1 = useScrollAnimation();
  const anim2 = useScrollAnimation();

  return (
    <section id="video-guide" className="relative bg-[#0a0a0a] py-24 sm:py-32 lg:py-40 overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4b896]/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4b896]/30 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#d4b896]/[0.02] blur-[100px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={anim1.ref}
          className={`text-center mb-16 sm:mb-20 fade-up ${anim1.isVisible ? "visible" : ""}`}
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-[#d4b896]/60" />
            <span
              className="text-[#d4b896] text-xs tracking-[0.4em] uppercase"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              REAL WEDDING FILM
            </span>
            <div className="w-8 h-px bg-[#d4b896]/60" />
          </div>

          <h2
            className="text-white text-2xl sm:text-3xl md:text-4xl leading-tight mb-5"
            style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
          >
            연출 없는 <span className="text-[#5BB5A2]">실제 본식</span> 영상으로
            <br />
            사회자를 선택하세요
          </h2>

          <p className="text-white/50 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            등급별 사회자의 실제 진행 영상을 확인하고
            <br className="sm:hidden" />
            {" "}나에게 맞는 사회자를 직접 선택하세요
          </p>
        </div>

        {/* Tier Cards */}
        <div
          ref={anim2.ref}
          className={`grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 fade-up ${anim2.isVisible ? "visible" : ""}`}
          style={{ transitionDelay: "0.2s" }}
        >
          {TIERS.map((tier, i) => {
            const Icon = tier.icon;
            return (
              <a
                key={tier.name}
                href={tier.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-gradient-to-b from-[#181818] to-[#111111] border border-[#d4b896]/20 rounded-sm overflow-hidden transition-all duration-500 hover:border-[#d4b896]/50 hover:shadow-xl hover:shadow-[#d4b896]/10 hover:-translate-y-2"
              >
                {/* 상단 골드 라인 */}
                <div className="h-[2px] bg-gradient-to-r from-transparent via-[#d4b896]/60 to-transparent" />

                <div className="p-6 sm:p-8 text-center">
                  {/* Icon */}
                  <div className="mx-auto w-16 h-16 rounded-full bg-[#0d0d0d] border border-[#d4b896]/30 flex items-center justify-center mb-5 group-hover:border-[#d4b896]/60 group-hover:shadow-lg group-hover:shadow-[#d4b896]/10 transition-all duration-500">
                    <Icon size={24} className="text-[#d4b896]" />
                  </div>

                  {/* Sub label */}
                  <p
                    className="text-[#d4b896]/60 text-[10px] tracking-[0.3em] uppercase mb-1"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {tier.sub}
                  </p>

                  {/* Name */}
                  <h4
                    className="text-white text-xl sm:text-2xl font-bold mb-2"
                    style={{ fontFamily: "'Noto Serif KR', serif" }}
                  >
                    {tier.name}
                  </h4>

                  {/* Description */}
                  <p className="text-white/40 text-xs sm:text-sm mb-6">{tier.desc}</p>

                  {/* CTA */}
                  <div className="flex items-center justify-center gap-2 text-[#5BB5A2] text-xs sm:text-sm font-medium group-hover:gap-3 transition-all duration-300">
                    <Play size={14} className="fill-[#5BB5A2]" />
                    <span>영상 보러가기</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform duration-300">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Bottom text */}
        <p
          className="text-center text-white/45 text-sm sm:text-base tracking-wide leading-relaxed mt-12 sm:mt-16"
          style={{ fontFamily: "'Noto Serif KR', serif" }}
        >
          여러 업체를 비교하신 고객님들께서 최종적으로 선택하신 이유는
          <br className="hidden sm:block" />
          <span className="text-[#d4b896] font-medium"> 실제 본식에서 확인되는 분위기, 완성도 높은 진행의 차이</span>입니다.
        </p>
      </div>
    </section>
  );
}
