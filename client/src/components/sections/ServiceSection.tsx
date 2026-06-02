import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Music, Mic, Users, Theater, MicVocal, Package } from "lucide-react";

const EXTRAS = [
  { icon: Music, label: "클래식 연주", href: "https://inusclassic.kr/" },
  { icon: Mic, label: "재즈 연주", href: "https://inusjazz.kr/" },
  { icon: Users, label: "중창/팝페라", href: "https://blog.naver.com/inusmusics/220622621535" },
  { icon: Theater, label: "뮤지컬 웨딩", href: "https://inusmw.kr/" },
  { icon: MicVocal, label: "축가", href: "https://inusmusic.kr/" },
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
            추가 <span className="text-[#5BB5A2]">옵션 서비스</span>
          </h2>
        </div>

        {/* Extra Options */}
        <div ref={anim3.ref} className={`fade-up ${anim3.isVisible ? "visible" : ""}`}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {EXTRAS.map((item, i) => {
              const Icon = item.icon;
              const content = (
                <>
                  <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-[#d4b896]/10 flex items-center justify-center group-hover:bg-[#d4b896]/20 transition-colors duration-300">
                    <Icon size={18} className="text-[#d4b896]" />
                  </div>
                  <p className="text-[#333] text-sm">{item.label}</p>
                </>
              );

              if (item.href) {
                return (
                  <a
                    key={i}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white border border-[#e8e4df] rounded-sm p-5 text-center hover:border-[#d4b896]/40 hover:shadow-md transition-all duration-400"
                  >
                    {content}
                  </a>
                );
              }

              return (
                <div
                  key={i}
                  className="group bg-white border border-[#e8e4df] rounded-sm p-5 text-center hover:border-[#d4b896]/40 hover:shadow-md transition-all duration-400"
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
