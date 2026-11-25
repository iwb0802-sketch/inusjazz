import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Music, Mic, Theater, MicVocal, Smartphone, AudioWaveform, Clapperboard, Crown, Sparkles, Music4, Gem, ExternalLink, ArrowRight } from "lucide-react";

const KAKAO_LINK = "https://pf.kakao.com/_wxovaM/chat";
const PACKAGE_LINK = "https://blog.naver.com/inusmusics/220652965646";

// 완성형 웨딩 패키지 등급 (GRAND → PRESTIGE → CLASSIC → ESSENTIAL)
// 주의: "SIGNATURE"는 사회자 최상위 등급명(McSection)으로 별도 사용 중이므로 패키지 쪽엔 쓰지 않음
const PACKAGE_TIERS = [
  {
    key: "GRAND",
    icon: Crown,
    label: "GRAND",
    badge: "가장 완성도 높은 선택",
    name: "프리미엄 콜렉트",
    rows: [{ n: "뮤지컬 4인(5곡) + 피아노 독주 + 주례없는 사회", p: "950,000원" }],
    color: "#cba55f",
    featured: true,
  },
  {
    key: "PRESTIGE",
    icon: Sparkles,
    label: "PRESTIGE",
    badge: "고급형",
    name: "프레스티지",
    rows: [{ n: "뮤지컬 4인(3곡) + 주례없는 사회", p: "680,000원" }],
    color: "#a8814f",
    featured: false,
  },
  {
    key: "CLASSIC",
    icon: Music4,
    label: "CLASSIC",
    badge: "스탠다드형",
    name: "클래식",
    rows: [
      { n: "뮤지컬 2인(3곡) + 주례없는 사회", p: "450,000원" },
      { n: "피아노 3중주 + 축가 + 주례없는 사회", p: "480,000원" },
      { n: "재즈 3중주 + 축가 + 주례없는 사회", p: "520,000원" },
    ],
    color: "#c09a7e",
    featured: false,
  },
  {
    key: "ESSENTIAL",
    icon: Gem,
    label: "ESSENTIAL",
    badge: "실속형",
    name: "에센셜",
    rows: [{ n: "축가 + 주례없는 사회", p: "260,000원" }],
    color: "#999",
    featured: false,
  },
];


const EXTRAS: { icon: any; label: string; href: string; isNew?: boolean }[] = [
  { icon: Music, label: "클래식 연주", href: "https://inusclassic.kr/" },
  { icon: Mic, label: "재즈 연주", href: "https://inusjazz.kr/" },
  { icon: MicVocal, label: "축가", href: "https://inusmusic.kr/" },
  { icon: Theater, label: "뮤지컬 웨딩", href: "https://inusmw.kr/" },
  { icon: Smartphone, label: "모바일 청첩장", href: "https://inuscard.com" },
  { icon: AudioWaveform, label: "음원편집", href: "/audio", isNew: true },
  { icon: Clapperboard, label: "식전영상제작", href: "https://prewedding-video-renderer-production.up.railway.app/editor", isNew: true },
];

export default function PackageSection() {
  const anim1 = useScrollAnimation();
  const anim2 = useScrollAnimation();
  const anim3 = useScrollAnimation();

  return (
    <section id="package" className="relative bg-[#f8f6f3] py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={anim1.ref} className={`text-center mb-10 sm:mb-12 fade-up ${anim1.isVisible ? "visible" : ""}`}>
          <span
            className="text-[#a8814f] text-[11px] sm:text-[13px] font-semibold tracking-[0.22em] uppercase"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            MORE SERVICES
          </span>
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
            <h2
              className="text-[#1a1a1a] text-xl sm:text-3xl md:text-4xl"
              style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
            >
              함께 준비하면 좋은 서비스
            </h2>
          </div>
          <p className="mt-4 text-[#666] text-xs sm:text-base max-w-xl mx-auto leading-relaxed px-4 sm:px-0">
            사회 · 축가 · 연주 · 뮤지컬웨딩을{" "}
            <br className="sm:hidden" />
            각각 따로 준비하지 마세요.
            <br />
            하나로 설계될 때{" "}
            <br className="sm:hidden" />
            예식의 흐름과 완성도가 달라집니다.
          </p>
        </div>

        {/* 완성형 웨딩 패키지 */}
        <div ref={anim2.ref} className={`fade-up ${anim2.isVisible ? "visible" : ""} max-w-5xl mx-auto mb-12 sm:mb-16`}>
          <div className="text-center mb-6 sm:mb-8">
            <h3
              className="text-[#1a1a1a] text-[20px] sm:text-[26px] leading-snug break-keep"
              style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
            >
              완성형 <span className="text-[#a8814f]">웨딩 패키지</span>
            </h3>
            <p className="mt-2.5 text-[#777] text-[12px] sm:text-sm leading-relaxed break-keep">
              등급 상관없이 원하는 사회자 또는 아티스트 지정 가능 · 같은 팀이 사전에 호흡을 맞춰 예식이 매끄럽습니다
            </p>
            <p className="mt-1.5 text-[#a8814f] text-[11px] sm:text-xs leading-relaxed break-keep">
              ※ 시그니처 등급 사회자 지정 시 추가 비용이 발생합니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {PACKAGE_TIERS.map((tier) => (
              <div
                key={tier.key}
                className={`relative rounded-xl overflow-hidden ${tier.featured ? "md:col-span-3" : ""}`}
                style={
                  tier.featured
                    ? { background: "#1a1a1a", border: "2px solid #cba55f", boxShadow: "0 8px 28px rgba(203,165,95,0.25)" }
                    : { background: "#fff", border: "1px solid rgba(212,184,150,0.4)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }
                }
              >
                <div className={`p-5 sm:p-7 ${tier.featured ? "sm:flex sm:items-center sm:gap-8" : ""}`}>
                  <div className={tier.featured ? "sm:flex-1 min-w-0" : ""}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: tier.featured ? "rgba(203,165,95,0.18)" : `${tier.color}1f` }}
                      >
                        <tier.icon size={16} style={{ color: tier.featured ? "#e0c188" : tier.color }} />
                      </div>
                      <span
                        className="text-[10px] sm:text-[11px] font-bold tracking-[0.16em]"
                        style={{ color: tier.featured ? "#e0c188" : tier.color }}
                      >
                        {tier.label}
                      </span>
                      <span
                        className="text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full"
                        style={
                          tier.featured
                            ? { background: "rgba(203,165,95,0.18)", color: "#e0c188" }
                            : { background: "#f5f2ee", color: "#999" }
                        }
                      >
                        {tier.badge}
                      </span>
                    </div>
                    <h4
                      className={`${tier.featured ? "text-white" : "text-[#1a1a1a]"} text-[17px] sm:text-[19px] font-bold break-keep`}
                      style={{ fontFamily: "'Noto Serif KR', serif" }}
                    >
                      {tier.name}
                    </h4>
                  </div>

                  <div className={`mt-3.5 rounded-lg overflow-hidden ${tier.featured ? "sm:mt-0 sm:flex-1" : ""}`} style={{ border: tier.featured ? "1px solid rgba(203,165,95,0.35)" : "1px solid rgba(212,184,150,0.35)" }}>
                    {tier.rows.map((r, i) => (
                      <div
                        key={r.n}
                        className="flex items-center justify-between gap-3 px-3 py-2.5 sm:px-4"
                        style={{
                          background: tier.featured
                            ? i % 2 === 0 ? "rgba(255,255,255,0.04)" : "transparent"
                            : i % 2 === 0 ? "rgba(212,184,150,0.08)" : "#fff",
                          borderTop: i === 0 ? "none" : tier.featured ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(212,184,150,0.3)",
                        }}
                      >
                        <span
                          className={`${tier.featured ? "text-[#e8e8e8]" : "text-[#3a3a3a]"} text-[12px] sm:text-[13px] leading-snug break-keep text-balance font-medium`}
                        >
                          {r.n}
                        </span>
                        <span
                          className="text-[14px] sm:text-[15px] font-bold whitespace-nowrap flex-shrink-0"
                          style={{ color: tier.featured ? "#e0c188" : "#a8814f" }}
                        >
                          {r.p}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 sm:mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={PACKAGE_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-1.5 w-full sm:w-auto rounded-lg px-5 py-3.5 text-[13px] sm:text-sm font-bold text-[#555] transition-all duration-300 hover:-translate-y-[2px]"
              style={{ background: "#fff", border: "1px solid #ddd" }}
            >
              <span className="whitespace-nowrap">더 자세한 패키지 보기</span>
              <ExternalLink size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href={KAKAO_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-1.5 w-full sm:w-auto rounded-lg px-5 py-3.5 text-[13px] sm:text-sm font-bold transition-all duration-300 hover:-translate-y-[2px]"
              style={{
                background: "linear-gradient(135deg,#e0c188,#cba55f)",
                color: "#1a1a1a",
                boxShadow: "0 6px 18px rgba(203,165,95,0.28)",
              }}
            >
              <span className="whitespace-nowrap">패키지 문의하기</span>
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        {/* 추가 옵션 서비스 (구 ServiceSection 흡수) */}
        <div ref={anim3.ref} className={`fade-up ${anim3.isVisible ? "visible" : ""}`}>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
            {EXTRAS.map((item, i) => {
              const Icon = item.icon;
              return (
                <a
                  key={i}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden bg-white rounded-sm p-5 text-center transition-all duration-400 hover:-translate-y-0.5"
                  style={
                    item.isNew
                      ? { border: "1px solid rgba(91,181,162,0.38)", boxShadow: "0 2px 12px rgba(91,181,162,0.12)" }
                      : { border: "1px solid rgba(212,184,150,0.22)", boxShadow: "0 2px 10px rgba(212,184,150,0.06)" }
                  }
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                    style={{ background: "linear-gradient(90deg, transparent, #d4b896, transparent)" }}
                  />
                  {item.isNew && (
                    <span
                      className="absolute top-2 right-2 text-[8.5px] font-bold leading-none px-1.5 py-[3px] rounded-full tracking-[0.08em]"
                      style={{ background: "#a8814f", color: "#fff", boxShadow: "0 2px 6px rgba(168,129,79,0.35)" }}
                    >
                      NEW
                    </span>
                  )}
                  <div
                    className="w-10 h-10 mx-auto mb-3 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: item.isNew
                        ? "linear-gradient(145deg, rgba(91,181,162,0.18), rgba(91,181,162,0.07))"
                        : "linear-gradient(145deg, rgba(212,184,150,0.15), rgba(212,184,150,0.06))",
                      border: item.isNew ? "1px solid rgba(91,181,162,0.3)" : "1px solid rgba(212,184,150,0.25)",
                    }}
                  >
                    <Icon size={18} style={{ color: item.isNew ? "#a8814f" : "#d4b896" }} />
                  </div>
                  <p className="text-[#333] text-sm break-keep">{item.label}</p>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
