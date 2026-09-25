import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Music, Mic, Theater, MicVocal, Smartphone, AudioWaveform, Clapperboard } from "lucide-react";

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
  const anim3 = useScrollAnimation();

  return (
    <section id="package" className="bg-[#f8f6f3] py-24 sm:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={anim1.ref} className={`text-center mb-16 fade-up ${anim1.isVisible ? "visible" : ""}`}>
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
            사회 · 축가 · 연주 · 뮤지컬웨딩을
            <br className="sm:hidden" />
            각각 따로 준비하지 마세요.
            <br />
            하나로 설계될 때
            <br className="sm:hidden" />
            예식의 흐름과 완성도가 달라집니다.
          </p>
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
                      style={{ background: "#5BB5A2", color: "#fff", boxShadow: "0 2px 6px rgba(91,181,162,0.35)" }}
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
                    <Icon size={18} style={{ color: item.isNew ? "#5BB5A2" : "#d4b896" }} />
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
