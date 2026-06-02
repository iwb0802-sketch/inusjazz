/**
 * VideoGuideSection - 실제 본식 사회 영상 안내
 * Design: Dark background, 3 tier cards (프리미엄/베스트/일반)
 * Brand: Mint (#5BB5A2) + Gold (#d4b896)
 * Placed below VideoSection (리얼 웨딩 영상 모음)
 */
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Crown, Star, Mic } from "lucide-react";

const TIERS = [
  {
    name: "프리미엄",
    sub: "사회자",
    icon: Crown,
    color: "#d4b896",
    bgGradient: "from-[#d4b896]/20 to-[#d4b896]/5",
    borderColor: "border-[#d4b896]/30",
    hoverBorder: "hover:border-[#d4b896]/60",
    link: "https://blog.naver.com/PostList.naver?blogId=inusmusics&from=postList&categoryNo=59",
  },
  {
    name: "베스트",
    sub: "사회자",
    icon: Star,
    color: "#d4b896",
    bgGradient: "from-[#d4b896]/15 to-[#d4b896]/5",
    borderColor: "border-[#d4b896]/25",
    hoverBorder: "hover:border-[#d4b896]/50",
    link: "https://blog.naver.com/PostList.naver?blogId=inusmusics&from=postList&categoryNo=69",
  },
  {
    name: "일반",
    sub: "사회자",
    icon: Mic,
    color: "#d4b896",
    bgGradient: "from-[#d4b896]/10 to-[#d4b896]/5",
    borderColor: "border-[#d4b896]/20",
    hoverBorder: "hover:border-[#d4b896]/40",
    link: "https://blog.naver.com/PostList.naver?blogId=inusmusics&from=postList&categoryNo=62",
  },
];

export default function VideoGuideSection() {
  const anim1 = useScrollAnimation();
  const anim2 = useScrollAnimation();

  return (
    <section id="video-guide" className="bg-[#0d0d0d] pb-24 sm:pb-32 lg:pb-40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Card */}
        <div
          ref={anim1.ref}
          className={`fade-up ${anim1.isVisible ? "visible" : ""}`}
        >
          <div className="relative border border-white/10 rounded-sm bg-[#141414] p-8 sm:p-10 mb-8">
            {/* Top accent line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[2px] bg-gradient-to-r from-transparent via-[#d4b896] to-transparent" />

            <div className="flex items-start gap-5">
              <div className="flex-shrink-0 w-14 h-14 rounded-sm bg-[#1a1a1a] border border-[#d4b896]/20 flex items-center justify-center">
                <Mic size={24} className="text-[#d4b896]" />
              </div>
              <div>
                <p className="text-white/70 text-base sm:text-lg font-medium tracking-wide mb-2">연출 없는</p>
                <h3
                  className="text-white text-base sm:text-2xl"
                  style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
                >
                  실제 본식 사회 <span className="text-[#5BB5A2]">영상 안내</span>
                </h3>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3 pl-0 sm:pl-[4.75rem]">
              <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5BB5A2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 15l-2 5L9 9l11 4-5 2z" />
                  <path d="M14.828 14.828L21 21" />
                </svg>
              </div>
              <p className="text-white/60 text-sm">
                아이콘 클릭 시 <span className="text-white font-medium">등급별 사회자</span> 영상 확인 가능합니다
              </p>
            </div>
          </div>
        </div>

        {/* Tier Cards */}
        <div
          ref={anim2.ref}
          className={`grid grid-cols-3 gap-3 sm:gap-5 fade-up ${anim2.isVisible ? "visible" : ""}`}
          style={{ transitionDelay: "0.15s" }}
        >
          {TIERS.map((tier) => {
            const Icon = tier.icon;
            return (
              <a
                key={tier.name}
                href={tier.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative bg-[#141414] border ${tier.borderColor} ${tier.hoverBorder} rounded-sm p-5 sm:p-7 text-center transition-all duration-500 hover:bg-[#1a1a1a] hover:shadow-lg hover:shadow-[#d4b896]/5 hover:-translate-y-1`}
              >
                {/* Icon Circle */}
                <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-b from-[#1e1e1e] to-[#141414] border border-[#d4b896]/20 flex items-center justify-center mb-4 sm:mb-5 group-hover:border-[#d4b896]/40 transition-colors duration-500">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#1a1a1a] border border-[#d4b896]/15 flex items-center justify-center">
                    <Icon size={22} className="text-[#d4b896] sm:w-6 sm:h-6" />
                  </div>
                </div>

                {/* Text */}
                <h4
                  className="text-white text-base sm:text-lg lg:text-xl font-bold tracking-wide"
                  style={{ fontFamily: "'Noto Serif KR', serif" }}
                >
                  {tier.name}
                </h4>
                <p className="text-white/50 text-sm sm:text-base mt-1 font-medium">{tier.sub}</p>

                {/* Arrow */}
                <div className="mt-3 sm:mt-4 flex justify-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white/20 group-hover:text-[#5BB5A2] group-hover:translate-y-0.5 transition-all duration-300"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </a>
            );
          })}
        </div>

        {/* Subtitle */}
        <p
          className="text-center text-white/55 text-sm sm:text-base tracking-wide leading-relaxed mt-8 sm:mt-10"
          style={{ fontFamily: "'Noto Serif KR', serif" }}
        >
          여러 업체를 비교하신 고객님들께서 최종적으로 선택하신 이유는
          <br className="hidden sm:block" />
          <span className="text-white/75 font-medium"> 실제 본식에서 확인되는 분위기, 완성도 높은 진행의 차이입니다.</span>
        </p>
      </div>
    </section>
  );
}
