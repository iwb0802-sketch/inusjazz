/**
 * McSection - 전문 사회자 슬라이드 캐러셀 + 스타일 필터
 * Design: Dark background, large profile photos with slide navigation
 * Uses Embla Carousel (already in dependencies)
 */
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X, ExternalLink } from "lucide-react";

const MCS = [
  {
    name: "김민수",
    role: "",
    tier: "BEST",
    desc: "5년+ 경력",
    image: "/images/mc-profile-1_33531819.jpg",
    tags: ["웨딩 사회 경력 5년+", "누적 진행 500회 이상"],
    highlight: "안정적인 진행력과 맞춤 대본으로 예식의 전체 흐름을 설계합니다.",
    profileUrl: "https://blog.naver.com/inusmusics/223996383838",
    styles: ["품격형", "아나운서형"],
    youtubeId: "",
    profileCardImg: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663604364385/DyhPmZzlNmUwZcsY.png",
  },
  {
    name: "고승범",
    role: "",
    tier: "BEST",
    desc: "5년+ 경력",
    image: "/images/mc-profile-4_a9e52880.jpg",
    tags: ["웨딩 사회 경력 5년+", "누적 진행 500건+"],
    highlight: "자연스럽고 세련된 진행 스타일이 특징입니다.",
    profileUrl: "https://blog.naver.com/inusmusics/223235771542",
    styles: ["품격형", "아나운서형"],
    youtubeId: "",
    profileCardImg: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663604364385/SPAinOSuRkaiNJTx.png",
  },
  {
    name: "이도영",
    role: "",
    tier: "BEST",
    desc: "4년+ 경력",
    image: "/images/mc-profile-2_f194877b.jpg",
    tags: ["웨딩 사회 경력 4년+", "누적 진행 400회 이상"],
    highlight: "따뜻하고 안정적인 진행으로 신랑신부님의 이야기를 감동적으로 전달합니다.",
    profileUrl: "https://blog.naver.com/inusmusics/223845891681",
    styles: ["품격형", "밝은형", "감동형"],
    youtubeId: "ali34pV7ALk",
    profileCardImg: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663604364385/ppTgmcIFaCtGyINq.png",
  },
  {
    name: "석재선",
    role: "",
    tier: "BEST",
    desc: "5년+ 경력",
    image: "/images/mc-profile-3_33ff7a32.jpg",
    tags: ["웨딩 사회 경력 5년+", "누적 진행 500회 이상"],
    highlight: "차분하면서도 격식 있는 진행으로 품격 있는 예식을 만들어드립니다.",
    profileUrl: "https://blog.naver.com/inusmusics/223822182933",
    styles: ["품격형", "감동형"],
    youtubeId: "zx_iAhMkMns",
    profileCardImg: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663604364385/RWSmnUABYYeEBdIF.png",
  },
  {
    name: "이우영",
    role: "",
    tier: "PREMIUM",
    desc: "10년+ 경력",
    image: "/images/mc-lee-wooyoung-new_fa27e84d.webp",
    tags: ["웨딩 사회 경력 10년+", "누적 진행 1000회 이상"],
    highlight: "편안한 아나운서 톤과 안정적인 진행력으로 위트 있고 깔끔한 예식을 완성하는 사회자입니다.",
    profileUrl: "https://blog.naver.com/inusmusics/220767962639",
    styles: ["품격형", "밝은형", "감동형", "아나운서형"],
    youtubeId: "prhKZqfMjfM",
    profileCardImg: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663604364385/COZSQEgdKVpfNtAZ.png",
  },
  {
    name: "김선혁",
    role: "",
    tier: "BEST",
    desc: "5년+ 경력",
    image: "/images/host_sunhyuk_1ed704ab.jpg",
    tags: ["웨딩 사회 경력 5년+", "누적 진행 500회 이상"],
    highlight: "깔끔하고 안정감 있는 진행력을 기반으로 다년간의 연극 경험에서 비롯된 탁월한 상황 대처 능력을 갖춘 사회자입니다.",
    profileUrl: "https://blog.naver.com/inusmusics/221025505211",
    styles: ["품격형", "아나운서형"],
    youtubeId: "4Quvg9TIGAk",
    profileCardImg: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663604364385/BNPzIkSNQIGLZEfs.png",
  },
  {
    name: "장윤태",
    role: "",
    tier: "PREMIUM",
    desc: "10년+ 경력",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663604364385/YIRjIXsBhCqAiMgE.jpg",
    tags: ["웨딩 사회 경력 10년+", "누적 진행 1000회 이상"],
    highlight: "안정적인 진행력과 젠틀한 진행으로 예식의 완성도를 높입니다.",
    profileUrl: "https://blog.naver.com/inusmusics/223246261228",
    styles: ["품격형", "감동형"],
    youtubeId: "",
    profileCardImg: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663604364385/BzyEbfDYgsDXpYvx.png",
  },
];

const STYLE_FILTERS = ["전체", "품격형", "밝은형", "감동형", "아나운서형"];

const STYLE_DESCRIPTIONS: Record<string, string> = {
  "품격형": "차분하고 격식 있는 호텔·채플 예식에 어울리는 사회자입니다.",
  "밝은형": "자연스럽고 유쾌한 분위기로 하객 반응을 살리는 사회자입니다.",
  "감동형": "신랑신부의 이야기와 부모님 감사 순서를 따뜻하게 전달하는 사회자입니다.",
  "아나운서형": "정확한 발성, 안정적인 톤, 깔끔한 식순 진행에 강한 사회자입니다.",
};

type MC = typeof MCS[0];

// iframe 모달 컴포넌트
function IframeModal({ url, onClose }: { url: string; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[300] flex flex-col"
      style={{ background: "#0b0b0b" }}
    >
      {/* 닫기 바 */}
      <div
        className="flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(214,177,107,0.2)", background: "rgba(11,11,11,0.98)" }}
      >
        <span
          className="text-sm tracking-widest"
          style={{ fontFamily: "'Cormorant Garamond', serif", color: "#d6b16b" }}
        >
          INUSMUSIC PROFILE
        </span>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full text-white/60 hover:text-white transition-colors"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
        >
          <X size={15} />
        </button>
      </div>
      {/* iframe */}
      <iframe
        src={url}
        className="flex-1 w-full"
        style={{ border: 0 }}
        title="사회자 프로필"
      />
    </div>
  );
}

// 페이지 로드 시 모든 프로필 카드 이미지 프리로드
if (typeof window !== "undefined") {
  MCS.forEach((mc) => {
    if (mc.profileCardImg) {
      const img = new Image();
      img.src = mc.profileCardImg;
    }
  });
}

// 프로필 모달 컴포넌트
function ProfileModal({ mc, onClose, onOpenIframe }: { mc: MC; onClose: () => void; onOpenIframe: (url: string) => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  const tierColor = mc.tier === "PREMIUM"
    ? { border: "border-[#d4b896]/60", text: "text-[#d4b896]", bg: "bg-[#d4b896]/10" }
    : { border: "border-[#5BB5A2]/60", text: "text-[#5BB5A2]", bg: "bg-[#5BB5A2]/10" };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
      style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl overflow-hidden shadow-2xl"
        style={{
          animation: "fadeInUp 0.35s cubic-bezier(0.23,1,0.32,1)",
          maxHeight: "92vh",
          background: "linear-gradient(145deg, #161616 0%, #0d0d0d 100%)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "12px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full text-white hover:scale-110 transition-all duration-200"
          style={{ background: "rgba(0,0,0,0.7)", border: "1.5px solid rgba(255,255,255,0.3)", boxShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
        >
          <X size={17} strokeWidth={2.5} />
        </button>

        {/* 스크롤 영역 */}
        <div className="overflow-y-auto" style={{ maxHeight: "calc(92vh - 80px)" }}>
          {/* 위: 영상 or 프로필 카드 이미지 */}
          <div className="w-full">
            {mc.youtubeId ? (
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  src={`https://www.youtube.com/embed/${mc.youtubeId}?autoplay=1&mute=0&rel=0&playsinline=1&modestbranding=1`}
                  title={`${mc.name} 진행 영상`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 0 }}
                />
              </div>
            ) : (
              <img
                src={mc.profileCardImg}
                alt={`${mc.name} 프로필`}
                className="w-full block"
              />
            )}
          </div>

          {/* 영상 있는 경우 아래에 프로필 카드 이미지도 표시 */}
          {mc.youtubeId && (
            <div className="w-full" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <img
                src={mc.profileCardImg}
                alt={`${mc.name} 프로필`}
                className="w-full block"
              />
            </div>
          )}
        </div>

        {/* 하단 고정 버튼 영역 */}
        <div className="px-4 py-3 flex flex-row gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.5)", flexShrink: 0 }}>
          {mc.name === "이우영" ? (
            <button
              onClick={() => onOpenIframe("/profile-wooyoung.html")}
              className={`flex items-center justify-center gap-1.5 flex-1 py-3 text-sm tracking-wide transition-all duration-300 rounded-sm ${tierColor.text} ${tierColor.bg} ${tierColor.border} border hover:opacity-80`}
              style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
            >
              프로필 자세히 보기
              <ExternalLink size={13} />
            </button>
          ) : (
            <a
              href={mc.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-1.5 flex-1 py-3 text-sm tracking-wide transition-all duration-300 rounded-sm ${tierColor.text} ${tierColor.bg} ${tierColor.border} border hover:opacity-80`}
              style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
            >
              블로그 프로필 보기
              <ExternalLink size={13} />
            </a>
          )}
          <a
            href="https://pf.kakao.com/_wxovaM/chat"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 flex-1 py-3 text-white text-sm font-semibold tracking-wide transition-all duration-300 hover:opacity-90 rounded-sm"
            style={{ background: "#5BB5A2", fontFamily: "'Noto Sans KR', sans-serif" }}
          >
            💬 카카오 상담하기
          </a>
        </div>
      </div>
    </div>
  );
}

export default function McSection() {
  const anim1 = useScrollAnimation();
  const [activeFilter, setActiveFilter] = useState("전체");
  const [filteredMcs, setFilteredMcs] = useState(MCS);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    slidesToScroll: 1,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedMc, setSelectedMc] = useState<MC | null>(null);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);

  const handleFilterChange = useCallback((filter: string) => {
    if (filter === activeFilter) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveFilter(filter);
      if (filter === "전체") {
        setFilteredMcs(MCS);
      } else {
        setFilteredMcs(MCS.filter((mc) => mc.styles.includes(filter)));
      }
      setSelectedIndex(0);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
  }, [activeFilter]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit();
      emblaApi.scrollTo(0);
    }
  }, [filteredMcs, emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <>
      <section id="mc" className="bg-[#0d0d0d] py-24 sm:py-32 lg:py-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div ref={anim1.ref} className={`text-center mb-12 sm:mb-16 fade-up ${anim1.isVisible ? "visible" : ""}`}>
            <span
              className="text-[#d4b896] text-xs sm:text-sm tracking-[0.3em] uppercase"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              INUSMUSIC MCs
            </span>
            <h2
              className="mt-4 text-white text-2xl sm:text-3xl md:text-4xl"
              style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
            >
              전문 사회자를 <span className="text-[#5BB5A2]">직접 선택</span>하세요
            </h2>
            <p className="mt-4 text-white/50 text-sm sm:text-base">
              고객님들이 가장 많이 선택한 TOP 사회자들입니다
            </p>

            <div className="mt-8 flex overflow-x-auto no-scrollbar justify-start sm:justify-center gap-2 sm:gap-3 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
              {STYLE_FILTERS.map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleFilterChange(filter)}
                  className={`flex-shrink-0 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm tracking-wider transition-all duration-300 border ${
                    activeFilter === filter
                      ? "bg-[#5BB5A2] border-[#5BB5A2] text-white shadow-lg shadow-[#5BB5A2]/20"
                      : "bg-transparent border-white/20 text-white/60 hover:border-[#5BB5A2]/50 hover:text-white/90"
                  }`}
                  style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="mt-4 h-6 flex items-center justify-center">
              <p
                className={`text-white/50 text-xs sm:text-sm transition-all duration-400 ${
                  activeFilter !== "전체" && STYLE_DESCRIPTIONS[activeFilter]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-1"
                }`}
                style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
              >
                {STYLE_DESCRIPTIONS[activeFilter] || ""}
              </p>
            </div>
          </div>

          {/* Carousel */}
          <div className="relative">
            <div ref={emblaRef} className={`overflow-hidden transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
              <div className="flex">
                {filteredMcs.map((mc, i) => (
                  <div
                    key={mc.name}
                    className="flex-[0_0_85%] sm:flex-[0_0_70%] md:flex-[0_0_50%] lg:flex-[0_0_42%] min-w-0 px-3 sm:px-4"
                  >
                    <div
                      className={`group relative bg-[#161616] border rounded-sm overflow-hidden transition-all duration-500 ${
                        selectedIndex === i
                          ? "border-[#5BB5A2]/40 shadow-lg shadow-[#5BB5A2]/5"
                          : "border-white/5 opacity-60"
                      }`}
                    >
                      {/* Profile Image */}
                      <div className="relative aspect-[3/4] overflow-hidden">
                        <img
                          src={mc.image}
                          alt={mc.name}
                          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-[#161616]/30 to-transparent" />

                        <div className="absolute top-4 left-4">
                          <span className={`inline-block px-3 py-1.5 bg-[#1a1a1a]/80 backdrop-blur-sm border text-[10px] sm:text-xs tracking-[0.2em] uppercase ${mc.tier === "PREMIUM" ? "border-[#d4b896]/50 text-[#d4b896]" : "border-[#5BB5A2]/40 text-[#5BB5A2]"}`}
                            style={{ fontFamily: "'Cormorant Garamond', serif" }}
                          >
                            {mc.tier}
                          </span>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                          <h3
                            className="text-white text-2xl sm:text-3xl font-bold"
                            style={{ fontFamily: "'Noto Serif KR', serif" }}
                          >
                            {mc.name}
                          </h3>
                          <p className="text-white/50 text-sm mt-1">{mc.desc}</p>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-5 sm:p-6">
                        <p className="text-white/60 text-sm leading-relaxed mb-5">
                          {mc.highlight}
                        </p>

                        <div className="space-y-2 mb-6">
                          {mc.tags.map((tag, j) => (
                            <div key={j} className="flex items-center gap-2.5 text-white/50 text-xs sm:text-sm">
                              <span className="w-1 h-1 rounded-full bg-[#5BB5A2] flex-shrink-0" />
                              {tag}
                            </div>
                          ))}
                        </div>

                        {/* 프로필 버튼 → 이우영은 직접 풀페이지, 나머지는 모달 */}
                        <button
                          onClick={() => mc.name === "이우영" ? setIframeUrl("/profile-wooyoung.html") : setSelectedMc(mc)}
                          className="flex items-center justify-center gap-2 w-full py-3 bg-[#5BB5A2]/10 border border-[#5BB5A2]/30 text-[#5BB5A2] text-sm tracking-wide hover:bg-[#5BB5A2]/20 hover:border-[#5BB5A2]/50 transition-all duration-300"
                          style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
                        >
                          프로필 보기
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={scrollPrev}
              className="absolute left-0 top-1/3 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-[#1a1a1a]/80 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:border-[#5BB5A2]/40 transition-all duration-300"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-0 top-1/3 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-[#1a1a1a]/80 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:border-[#5BB5A2]/40 transition-all duration-300"
            >
              <ChevronRight size={20} />
            </button>

            <div className="flex justify-center gap-2 mt-8">
              {filteredMcs.map((_, i) => (
                <button
                  key={i}
                  onClick={() => emblaApi?.scrollTo(i)}
                  className={`transition-all duration-300 rounded-full ${
                    selectedIndex === i
                      ? "w-8 h-2 bg-[#5BB5A2]"
                      : "w-2 h-2 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 프로필 모달 */}
      {selectedMc && (
        <ProfileModal
          mc={selectedMc}
          onClose={() => setSelectedMc(null)}
          onOpenIframe={(url) => { setSelectedMc(null); setIframeUrl(url); }}
        />
      )}

      {/* iframe 풀페이지 프로필 모달 */}
      {iframeUrl && (
        <IframeModal url={iframeUrl} onClose={() => setIframeUrl(null)} />
      )}
    </>
  );
}
