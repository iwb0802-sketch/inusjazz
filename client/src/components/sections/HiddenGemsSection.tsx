/**
 * HiddenGemsSection - 아직 저평가된 숨은 강자 사회자 소개
 * Design: Premium dark + mint accent / 매거진형 프로필 카드
 * Brand: Mint (#5BB5A2) + Gold (#d4b896)
 */
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Sparkles, ChevronRight, Play, Pause, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// 아직 널리 알려지지 않았지만 실력이 확실한 사회자 (숨은 강자)
const HIDDEN_GEMS = [
  {
    name: "민준호",
    tier: "PREMIUM",
    badge: "홈쇼핑 쇼호스트 출신",
    career: "경력 10년+ · 진행 1000회 이상",
    highlight: "부드러운 딕션과 안정적인 진행력으로 완성도 높은 예식을 만듭니다.",
    fit: "격식 있는 호텔·하우스 예식",
    image: "/images/mc-minjunho.jpg",
    audioFile: "/audio/mc-minjunho.mp3",
    url: "https://blog.naver.com/inusmusics/223597460181",
  },
  {
    name: "심비성",
    tier: "STANDARD",
    badge: "예식장 음향감독 출신",
    career: "경력 3년+ · 진행 300회 이상",
    highlight: "현장 흐름을 꿰뚫는 세심한 체크와 깔끔한 진행톤이 강점입니다.",
    fit: "군더더기 없이 깔끔한 예식",
    image: "/images/mc-simbiseong.jpg",
    audioFile: "/audio/mc-simbisung.mp3",
    url: "https://blog.naver.com/inusmusics/224198308789",
  },
  {
    name: "이도건",
    tier: "STANDARD",
    badge: "호텔·예식장 음향감독 출신",
    career: "경력 3년+ · 진행 350회 이상",
    highlight: "정확한 딕션과 세심한 준비로 예식을 안정감 있게 이끕니다.",
    fit: "전달력과 정확함이 중요한 예식",
    image: "/images/mc-idogeon.jpg",
    audioFile: "/audio/mc-idogeon.mp3",
    url: "https://blog.naver.com/inusmusics/224099418463",
  },
  {
    name: "김범태",
    tier: "STANDARD",
    badge: "현직 배우 · 연극 무대 출신",
    career: "경력 4년+ · 진행 320회 이상",
    highlight: "라디오DJ 같은 부드러운 목소리에 재치 있는 순발력을 더합니다.",
    fit: "화기애애하고 편안한 분위기",
    image: "/images/mc-kimbeomtae.jpg",
    audioFile: "/audio/mc-beomtae.mp3",
    url: "https://blog.naver.com/inusmusics/223192531041",
  },
  {
    name: "김태우",
    tier: "BEST",
    badge: "스탠드업 코미디언 출신",
    career: "경력 6년+ · 진행 500회 이상",
    highlight: "유쾌한 입담과 뛰어난 순발력, 문학으로 다진 표현력이 돋보입니다.",
    fit: "웃음 많고 활기찬 예식",
    image: "/images/mc-kimtaewoo.jpg",
    audioFile: "/audio/mc-taewoo.mp3",
    url: "https://blog.naver.com/inusmusics/224364756942",
  },
  {
    name: "김한솔",
    tier: "STANDARD",
    badge: "행사·파티 전문 MC 출신",
    career: "진행 300회 이상",
    highlight: "부드럽고 편안한 진행과 센스있는 멘트로 분위기를 리드합니다.",
    fit: "화기애애하고 편안한 분위기",
    image: "/images/mc-kimhansol.jpg",
    audioFile: "/audio/mc-kimhansol.mp3",
    url: "https://blog.naver.com/inusmusics/224393408893",
  },
];

const tierStyle = (tier: string) =>
  tier === "PREMIUM"
    ? { background: "rgba(212,184,150,0.18)", color: "#e5cba3", border: "1px solid rgba(212,184,150,0.45)" }
    : tier === "BEST"
    ? { background: "rgba(91,181,162,0.18)", color: "#7fd3c1", border: "1px solid rgba(91,181,162,0.45)" }
    : { background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.18)" };

export default function HiddenGemsSection() {
  const anim3 = useScrollAnimation();
  const [playing, setPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const togglePlay = (name: string, src: string) => {
    if (playing === name) {
      audioRef.current?.pause();
      if (audioRef.current) audioRef.current.currentTime = 0;
      audioRef.current = null;
      setPlaying(null);
      return;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    const audio = new Audio(src);
    audio.play().catch(() => {});
    audio.onended = () => setPlaying(null);
    audioRef.current = audio;
    setPlaying(name);
  };

  return (
    <section id="hidden-gems" className="relative bg-[#0d0d0d] pt-0 pb-24 sm:pb-32 lg:pb-40 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
        <div ref={anim3.ref} className={`fade-up ${anim3.isVisible ? "visible" : ""}`}>
          <div className="text-center mb-8 sm:mb-10">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
              style={{ background: "rgba(91,181,162,0.10)", border: "1px solid rgba(91,181,162,0.35)" }}
            >
              <Sparkles size={13} className="text-[#5BB5A2]" />
              <span className="text-[#5BB5A2] text-xs font-semibold tracking-[0.15em] uppercase">Hidden Gems</span>
            </div>

            {/* 규모(17명) 전달 + TOP 9와 우열 뉘앙스 제거 (기준 축: 인기 vs 인지도 대비 실력) */}
            <h3
              className="text-white text-[17px] min-[375px]:text-[19px] leading-snug sm:text-2xl mb-3 break-keep max-w-[19rem] sm:max-w-none mx-auto"
              style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
            >
              <span className="whitespace-nowrap">
                소속 사회자 <span className="text-[#d4b896]">17명</span>.
              </span>
              <br className="sm:hidden" />{" "}
              <span className="whitespace-nowrap">
                그중 <span className="text-[#5BB5A2]">아직 덜 알려진</span>
              </span>
              <br className="sm:hidden" />{" "}
              <span className="whitespace-nowrap">
                <span className="text-[#5BB5A2]">실력자 6인</span>을 따로 소개합니다.
              </span>
            </h3>

            <p className="text-white/50 text-xs sm:text-sm leading-relaxed break-keep max-w-[19rem] sm:max-w-xl mx-auto">
              <span className="whitespace-nowrap">검증 기준은 위 TOP 사회자와 똑같습니다.</span>
              <br className="sm:hidden" />{" "}
              <span className="whitespace-nowrap">다른 건 인지도뿐입니다.</span>
              <br className="sm:hidden" />{" "}
              <span className="whitespace-nowrap">
                그래서 지금 예약하시면 <span className="text-[#d4b896] font-semibold">1만원 추가 할인</span>을 드려요.
              </span>
            </p>
          </div>

          {/* 프로필 카드: 모바일 = 가로형 리스트 / 데스크탑 = 매거진 세로 카드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 max-w-5xl mx-auto">
            {HIDDEN_GEMS.map((mc) => (
              <div
                key={mc.name}
                className="group flex sm:flex-col rounded-xl overflow-hidden transition-all duration-300"
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.02) 100%)",
                  border: "1px solid rgba(91,181,162,0.18)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(91,181,162,0.45)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(91,181,162,0.18)";
                }}
              >
                {/* 사진 */}
                <div className="relative w-[104px] min-[375px]:w-[118px] sm:w-full flex-shrink-0 aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-[#151515]">
                  <img
                    src={mc.image}
                    alt={`${mc.name} 사회자`}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 38%, rgba(13,13,13,0.85) 100%)" }}
                  />
                  <span
                    className="absolute top-2 left-2 text-[8px] sm:text-[9px] font-bold tracking-[0.12em] px-2 py-[3px] rounded-full backdrop-blur-sm"
                    style={tierStyle(mc.tier)}
                  >
                    {mc.tier}
                  </span>
                </div>

                {/* 정보 */}
                <div className="flex-1 min-w-0 flex flex-col p-3 sm:p-4 pl-3.5 sm:pl-4">
                  {/* 이력 배지 */}
                  <span
                    className="self-start text-[9px] sm:text-[10px] font-semibold px-2 py-[3px] rounded-md mb-1.5 break-keep"
                    style={{ background: "rgba(91,181,162,0.12)", color: "#7fd3c1", border: "1px solid rgba(91,181,162,0.28)" }}
                  >
                    {mc.badge}
                  </span>

                  <p className="text-white text-[15px] sm:text-base font-bold leading-tight" style={{ fontFamily: "'Noto Serif KR', serif" }}>
                    {mc.name} 사회자
                  </p>
                  <p className="text-[#d4b896]/85 text-[10px] sm:text-[11px] font-medium mt-1 mb-2 break-keep">{mc.career}</p>

                  <p className="text-white/55 text-[11px] sm:text-[12px] leading-relaxed break-keep">{mc.highlight}</p>

                  {/* 이런 예식에 잘 맞아요 */}
                  <div className="flex items-start gap-1.5 mt-2 mb-2.5">
                    <span className="text-[9px] sm:text-[10px] text-white/35 flex-shrink-0 mt-[1px]">이런 예식에</span>
                    <span className="text-[10px] sm:text-[11px] text-white/80 font-medium break-keep leading-snug">{mc.fit}</span>
                  </div>

                  {/* 할인 배지 */}
                  <span
                    className="self-start text-[9px] sm:text-[10px] font-semibold px-2 py-[3px] rounded-md mb-2.5"
                    style={{ background: "rgba(212,184,150,0.12)", color: "#d4b896", border: "1px dashed rgba(212,184,150,0.4)" }}
                  >
                    1만원 추가 할인
                  </span>

                  {/* 액션 */}
                  <div className="mt-auto flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => togglePlay(mc.name, mc.audioFile)}
                      aria-label={`${mc.name} 사회자 목소리 미리듣기`}
                      className="flex items-center justify-center gap-1 flex-1 basis-0 min-w-0 rounded-md py-[9px] sm:py-[10px] text-[11px] sm:text-[12px] font-semibold transition-all duration-300"
                      style={
                        playing === mc.name
                          ? { background: "#5BB5A2", color: "#0d0d0d", border: "1px solid #5BB5A2" }
                          : { background: "rgba(91,181,162,0.10)", color: "#7fd3c1", border: "1px solid rgba(91,181,162,0.4)" }
                      }
                    >
                      {playing === mc.name ? <Pause size={12} /> : <Play size={12} />}
                      <span className="whitespace-nowrap">{playing === mc.name ? "재생 중" : "목소리 듣기"}</span>
                      {playing === mc.name && <Volume2 size={12} className="animate-pulse" />}
                    </button>

                    <a
                      href={mc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mc-gem-profile flex items-center justify-center gap-0.5 flex-1 basis-0 min-w-0 rounded-md py-[9px] sm:py-[10px] text-[11px] sm:text-[12px] font-bold transition-all duration-300"
                      style={{
                        background: "rgba(212,184,150,0.10)",
                        color: "#e5cba3",
                        border: "1px solid rgba(212,184,150,0.45)",
                      }}
                      onMouseEnter={(e) => {
                        const t = e.currentTarget as HTMLAnchorElement;
                        t.style.background = "rgba(212,184,150,0.22)";
                        t.style.color = "#f2e0c2";
                      }}
                      onMouseLeave={(e) => {
                        const t = e.currentTarget as HTMLAnchorElement;
                        t.style.background = "rgba(212,184,150,0.10)";
                        t.style.color = "#e5cba3";
                      }}
                    >
                      <span className="whitespace-nowrap">프로필 보기</span>
                      <ChevronRight size={12} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
