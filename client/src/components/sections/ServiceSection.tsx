import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Music, Mic, Theater, MicVocal, Package, Smartphone } from "lucide-react";

const EXTRAS = [
  { icon: Music, label: "클래식 연주", href: "https://inusclassic.kr/" },
  { icon: Mic, label: "재즈 연주", href: "https://inusjazz.kr/" },
  { icon: MicVocal, label: "축가", href: "https://inusmusic.kr/" },
  { icon: Theater, label: "뮤지컬 웨딩", href: "https://inusmw.kr/" },
  { icon: Smartphone, label: "모바일 청첩장", href: "https://inuscard.com" },
  { icon: Package, label: "완성 패키지", href: "https://blog.naver.com/inusmusics/220652965646" },
];

export default function ServiceSection() {
  const anim1 = useScrollAnimation();
  const anim3 = useScrollAnimation();

  return (
    <section id="service" className="bg-[#f8f6f3] py-24 sm:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={anim1.ref} className={`text-center mb-16 fade-up ${anim1.isVisible ? "visible" : ""}`}>
          <span
            className="text-[#d4b896] text-xs sm:text-sm tracking-[0.3em] uppercase"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            EXTRA OPTIONS
          </span>
          <h2
            className="mt-4 text-[#1a1a1a] text-2xl sm:text-3xl md:text-4xl"
            style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
          >
            추가 <span className="text-[#d4b896]">옵션 서비스</span>
          </h2>
        </div>

        {/* Extra Options */}
        <div ref={anim3.ref} className={`fade-up ${anim3.isVisible ? "visible" : ""}`}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {EXTRAS.map((item, i) => {
              const Icon = item.icon;
              const content = (
                <>
                  {/* 상단 골드 라인 */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                    style={{ background: "linear-gradient(90deg, transparent, #d4b896, transparent)" }}
                  />
                  <div className="w-10 h-10 mx-auto mb-3 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: "linear-gradient(145deg, rgba(212,184,150,0.15), rgba(212,184,150,0.06))",
                      border: "1px solid rgba(212,184,150,0.25)",
                    }}>
                    <Icon size={18} style={{ color: "#d4b896" }} />
                  </div>
                  <p className="text-[#333] text-sm">{item.label}</p>
                </>
              );

              const cardStyle = {
                border: "1px solid rgba(212,184,150,0.22)",
                boxShadow: "0 2px 10px rgba(212,184,150,0.06)",
              };

              if (item.href) {
                return (
                  <a
                    key={i}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden bg-white rounded-sm p-5 text-center transition-all duration-400 hover:-translate-y-0.5"
                    style={cardStyle}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.border = "1px solid rgba(212,184,150,0.50)";
                      (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 28px rgba(212,184,150,0.22)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.border = "1px solid rgba(212,184,150,0.22)";
                      (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 2px 10px rgba(212,184,150,0.06)";
                    }}
                  >
                    {content}
                  </a>
                );
              }

              return (
                <div
                  key={i}
                  className="group relative overflow-hidden bg-white rounded-sm p-5 text-center transition-all duration-400 hover:-translate-y-0.5"
                  style={cardStyle}
                >
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
