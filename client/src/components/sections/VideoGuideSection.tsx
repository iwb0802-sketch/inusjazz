/**
 * VideoGuideSection - 실제 본식 사회 영상 안내
 * Design: Premium dark + gold accent, attention-grabbing layout
 * Brand: Mint (#5BB5A2) + Gold (#d4b896)
 */
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Crown, Star, Mic, Play, Sparkles, ChevronRight } from "lucide-react";

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

// 아직 널리 알려지지 않았지만 실력이 확실한 사회자 (숨은 강자)
const HIDDEN_GEMS = [
  {
    name: "민준호",
    tier: "PREMIUM",
    highlight: "위트있고 젠틀한 진행, 홈쇼핑 방송으로만 2억+ 매출",
    image: "/images/mc-minjunho.jpg",
    url: "https://blog.naver.com/inusmusics/223597460181",
  },
  {
    name: "심비성",
    tier: "STANDARD",
    highlight: "예식장 음향 감독 출신, 훈훈한 비주얼에 진행까지 깔끔",
    image: "/images/mc-simbiseong.jpg",
    url: "https://blog.naver.com/inusmusics/224198308789",
  },
  {
    name: "이도건",
    tier: "STANDARD",
    highlight: "예식장·호텔 음향 감독 출신, 훈훈한 비주얼과 안정감 있는 진행",
    image: "/images/mc-idogeon.jpg",
    url: "https://blog.naver.com/inusmusics/224099418463",
  },
  {
    name: "김범태",
    tier: "STANDARD",
    highlight: "라디오DJ 같은 부드럽고 위트있는 진행",
    image: "/images/mc-kimbeomtae.jpg",
    url: "https://blog.naver.com/inusmusics/223192531041",
  },
];

export default function VideoGuideSection() {
  const anim1 = useScrollAnimation();
  const anim2 = useScrollAnimation();
  const anim3 = useScrollAnimation();

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
            className="text-white text-2xl sm:text-3xl md:text-4xl leading-tight mb-5 break-keep"
            style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
          >
            연출 없는 <span className="text-[#5BB5A2]">실제 본식</span> 영상으로
            <br />
            사회자를 선택하세요
          </h2>

          <p className="text-white/50 text-sm sm:text-base max-w-lg mx-auto leading-relaxed break-keep">
            등급별 사회자의 실제 진행 영상을 확인하고
            <br />
            나에게 맞는 사회자를 직접 선택하세요
            <br />
            <span className="text-white/65 text-sm sm:text-base mt-1 inline-block">
              (숨은 실력자들도 많으니 꼭 한번 살펴보세요.)
            </span>
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

        {/* 숨은 강자 — 아직 널리 알려지지 않은 실력자들 */}
        <div
          ref={anim3.ref}
          className={`mt-16 sm:mt-20 fade-up ${anim3.isVisible ? "visible" : ""}`}
        >
          <div className="text-center mb-8 sm:mb-10">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
              style={{ background: "rgba(91,181,162,0.10)", border: "1px solid rgba(91,181,162,0.35)" }}
            >
              <Sparkles size={13} className="text-[#5BB5A2]" />
              <span className="text-[#5BB5A2] text-xs font-semibold tracking-[0.15em] uppercase">
                Hidden Gems
              </span>
            </div>
            <h3
              className="text-white text-xl sm:text-2xl mb-2 break-keep"
              style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
            >
              아직 저평가된 <span className="text-[#5BB5A2]">숨은 강자들</span>
            </h3>
            <p className="text-white/50 text-xs sm:text-sm break-keep">
              실력은 확실한데 상대적으로 덜 알려진 사회자입니다.
              <br className="sm:hidden" />
              {" "}지금 예약하시면 <span className="text-[#d4b896] font-semibold">1만원 추가 할인</span> 혜택도 드려요.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
            {HIDDEN_GEMS.map((mc) => (
              <a
                key={mc.name}
                href={mc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center text-center p-3 sm:p-4 rounded-lg transition-all duration-300"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(91,181,162,0.18)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(91,181,162,0.08)";
                  (e.currentTarget as HTMLAnchorElement).style.border = "1px solid rgba(91,181,162,0.5)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.03)";
                  (e.currentTarget as HTMLAnchorElement).style.border = "1px solid rgba(91,181,162,0.18)";
                }}
              >
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-3 flex-shrink-0"
                  style={{ border: "2px solid rgba(91,181,162,0.4)" }}
                >
                  <img src={mc.image} alt={`${mc.name} 사회자`} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <span
                  className="text-[9px] font-semibold tracking-wider px-2 py-0.5 rounded-full mb-1.5"
                  style={{
                    background: mc.tier === "PREMIUM" ? "rgba(212,184,150,0.15)" : "rgba(91,181,162,0.15)",
                    color: mc.tier === "PREMIUM" ? "#d4b896" : "#5BB5A2",
                  }}
                >
                  {mc.tier}
                </span>
                <p className="text-white text-sm font-semibold mb-1" style={{ fontFamily: "'Noto Serif KR', serif" }}>
                  {mc.name} 사회자
                </p>
                <p className="text-white/45 text-[11px] leading-snug break-keep">{mc.highlight}</p>
                <div className="flex items-center gap-0.5 text-[#5BB5A2]/70 text-[11px] mt-2 group-hover:gap-1.5 transition-all duration-300">
                  <span>프로필 보기</span>
                  <ChevronRight size={11} />
                </div>
              </a>
            ))}
          </div>
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
