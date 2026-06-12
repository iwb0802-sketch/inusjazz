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
    youtubeId: "YmqVrha13G0",
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
    youtubeId: "iKi77thkR4s",
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
    youtubeId: "U5cJiiF-WcY",
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

// 페이지 로드 시 프로필 HTML 파일 프리페치 + 이미지 프리로드
if (typeof window !== "undefined") {
  // 프로필 HTML 프리페치 (백그라운드 다운로드)
  const profileUrls = [
    "/profile-wooyoung.html",
    "/profile-sunhyuk.html",
    "/profile-seungbeom.html",
    "/profile-yuntae.html",
    "/profile-idoyoung.html",
    "/profile-jaesun.html",
    "/profile-minsu.html",
  ];
  profileUrls.forEach((url) => {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = url;
    link.as = "document";
    document.head.appendChild(link);
  });

  // 프로필 카드 이미지 프리로드
  MCS.forEach((mc) => {
    if (mc.profileCardImg) {
      const img = new Image();
      img.src = mc.profileCardImg;
    }
  });
}

// iframe 모달 컴포넌트
function IframeModal({ url, onClose }: { url: string; onClose: () => void }) {
  const [loaded, setLoaded] = useState(false);

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
      {/* 로딩 스피너 */}
      {!loaded && (
        <div className="flex-1 flex items-center justify-center" style={{ background: "#0b0b0b" }}>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 40, height: 40,
                border: "2px solid rgba(214,177,107,0.2)",
                borderTop: "2px solid #d6b16b",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto 16px",
              }}
            />
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, letterSpacing: "0.3em", color: "rgba(214,177,107,0.6)" }}>LOADING</p>
          </div>
        </div>
      )}
      {/* iframe */}
      <iframe
        src={url}
        className="flex-1 w-full"
        style={{ border: 0, display: loaded ? "block" : "none" }}
        title="사회자 프로필"
        onLoad={() => setLoaded(true)}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
        <div className="px-4 py-3 flex flex-row gap-2" style={{ borderTop: "1px solid rgba(214,177,107,0.2)", background: "rgba(0,0,0,0.6)", flexShrink: 0 }}>
          {mc.name === "이우영" ? (
            <button
              onClick={() => onOpenIframe("/profile-wooyoung.html")}
              className="relative flex items-center justify-center gap-2 flex-1 py-3.5 overflow-hidden group transition-all duration-300"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "13px",
                letterSpacing: "0.2em",
                background: "linear-gradient(135deg, rgba(214,177,107,0.15) 0%, rgba(214,177,107,0.05) 100%)",
                border: "1px solid rgba(214,177,107,0.5)",
                color: "#d6b16b",
              }}
            >
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "linear-gradient(135deg, rgba(214,177,107,0.3) 0%, rgba(214,177,107,0.1) 100%)" }} />
              <span className="relative" style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: "13px", letterSpacing: "0.05em", fontWeight: 500 }}>사회자 프로필 자세히 보기</span>
              <ExternalLink size={13} className="relative" />
            </button>
          ) : (
            <a
              href={mc.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex items-center justify-center gap-2 flex-1 py-3.5 overflow-hidden group transition-all duration-300"
              style={{
                fontFamily: "'Noto Sans KR', sans-serif",
                fontSize: "13px",
                letterSpacing: "0.05em",
                fontWeight: 500,
                background: "linear-gradient(135deg, rgba(214,177,107,0.15) 0%, rgba(214,177,107,0.05) 100%)",
                border: "1px solid rgba(214,177,107,0.5)",
                color: "#d6b16b",
              }}
            >
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "linear-gradient(135deg, rgba(214,177,107,0.3) 0%, rgba(214,177,107,0.1) 100%)" }} />
              <span className="relative">사회자 프로필 자세히 보기</span>
              <ExternalLink size={13} className="relative" />
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
  const [playingAudio, setPlayingAudio] = useState<string | null>(null); // 현재 재생 중인 사회자 이름

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

          {/* Grid Layout */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredMcs.map((mc, mcIndex) => (
              <div
                key={mc.name}
                className="group relative bg-[#161616] border rounded-sm overflow-hidden transition-all duration-500 border-white/5 hover:border-[#5BB5A2]/40 hover:shadow-lg hover:shadow-[#5BB5A2]/5 cursor-pointer flex flex-col"
                onClick={() => {
                  const profileMap: Record<string, string> = {
                    "이우영": "/profile-wooyoung.html",
                    "김선혁": "/profile-sunhyuk.html",
                    "고승범": "/profile-seungbeom.html",
                    "장윤태": "/profile-yuntae.html",
                    "이도영": "/profile-idoyoung.html",
                    "석재선": "/profile-jaesun.html",
                    "김민수": "/profile-minsu.html",
                  };
                  if (profileMap[mc.name]) setIframeUrl(profileMap[mc.name]);
                  else setSelectedMc(mc);
                }}
              >
                {/* Profile Image */}
                <div className="relative overflow-hidden" style={{ height: "320px" }}>
                  <img
                    src={mc.image}
                    alt={mc.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-[#161616]/30 to-transparent" />



                  <div className="absolute top-4 left-4 flex items-start justify-start gap-2">
                    <span className={`inline-block px-3 py-1.5 bg-[#1a1a1a]/80 backdrop-blur-sm border text-[10px] sm:text-xs tracking-[0.2em] uppercase ${mc.tier === "PREMIUM" ? "border-[#d4b896]/50 text-[#d4b896]" : "border-[#5BB5A2]/40 text-[#5BB5A2]"}`}
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {mc.tier}
                    </span>
                  </div>

                  {/* 첫 번째 카드에만 말풍선 툴팁 */}
                  {mc.youtubeId && mcIndex === 0 && playingAudio === null && (
                    <div
                      className="absolute z-20 pointer-events-none"
                      style={{
                        top: "-52px",
                        right: "0px",
                      }}
                    >
                      <div
                        style={{
                          background: "rgba(255,255,255,0.88)",
                          backdropFilter: "blur(8px)",
                          borderRadius: "10px",
                          padding: "7px 11px",
                          fontSize: "10px",
                          color: "#1a1a1a",
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                          fontFamily: "'Noto Sans KR', sans-serif",
                          boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
                        }}
                      >
                        클릭하면 목소리 확인 가능
                      </div>
                      {/* 말풍선 꼬리 */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: "-7px",
                          right: "14px",
                          width: 0,
                          height: 0,
                          borderLeft: "7px solid transparent",
                          borderRight: "7px solid transparent",
                          borderTop: "7px solid rgba(255,255,255,0.88)",
                        }}
                      />
                    </div>
                  )}

                  {/* 소리 재생 버튼 - youtubeId 있는 경우만 표시 */}
                  {mc.youtubeId && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPlayingAudio(playingAudio === mc.name ? null : mc.name);
                      }}
                      className="absolute top-3 right-3 z-10 flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300"
                      style={{
                        background: playingAudio === mc.name ? "rgba(91,181,162,0.9)" : "rgba(11,11,11,0.75)",
                        border: playingAudio === mc.name ? "1px solid #5BB5A2" : "1px solid rgba(255,255,255,0.2)",
                        backdropFilter: "blur(8px)",
                      }}
                      title="목소리 듣기"
                    >
                      {playingAudio === mc.name ? (
                        /* 파동 애니메이션 */
                        <div className="flex items-end gap-[2px] h-4">
                          {[1,2,3,4].map((i) => (
                            <div
                              key={i}
                              className="w-[3px] rounded-full bg-white"
                              style={{
                                animation: `wave ${0.4 + i * 0.1}s ease-in-out infinite alternate`,
                                height: `${8 + i * 3}px`,
                              }}
                            />
                          ))}
                        </div>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-white/80 ml-0.5">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      )}
                    </button>
                  )}

                  {/* 오디오 iframe - 화면 밖에 배치하여 소리 재생 */}
                  {mc.youtubeId && playingAudio === mc.name && (
                    <iframe
                      src={`https://www.youtube.com/embed/${mc.youtubeId}?autoplay=1&mute=0&rel=0&playsinline=1`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                      style={{
                        position: "fixed",
                        top: "-9999px",
                        left: "-9999px",
                        width: "320px",
                        height: "180px",
                        opacity: 0,
                        pointerEvents: "none",
                        zIndex: -1,
                      }}
                      title="오디오 재생"
                    />
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                    {/* 스타일 태그 - 한 줄 고정 */}
                    <div className="flex flex-nowrap gap-1 mb-2 overflow-hidden">
                      {mc.styles.slice(0, 3).map((style) => (
                        <span
                          key={style}
                          className="inline-flex items-center flex-shrink-0 px-1.5 py-0.5"
                          style={{
                            fontFamily: "'Noto Sans KR', sans-serif",
                            fontSize: "9px",
                            letterSpacing: "0.02em",
                            background: "rgba(11,11,11,0.75)",
                            border: "1px solid rgba(214,177,107,0.4)",
                            color: "#d4b896",
                            backdropFilter: "blur(4px)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {style}
                        </span>
                      ))}
                    </div>
                    <h3
                      className="text-white text-lg sm:text-xl font-bold"
                      style={{ fontFamily: "'Noto Serif KR', serif" }}
                    >
                      {mc.name}
                    </h3>
                    <p className="text-white/50 text-xs sm:text-sm mt-0.5">{mc.desc}</p>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3 sm:p-4 flex flex-col flex-1">
                  <p className="text-white/60 text-xs sm:text-sm leading-relaxed mb-3">
                    {mc.highlight}
                  </p>

                  <div className="space-y-1.5 mb-4 flex-1">
                    {mc.tags.slice(0, 2).map((tag, j) => (
                      <div key={j} className="flex items-center gap-2 text-white/50 text-xs">
                        <span className="w-0.5 h-0.5 rounded-full bg-[#5BB5A2] flex-shrink-0" />
                        {tag}
                      </div>
                    ))}
                  </div>

                  {/* 프로필 버튼 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const profileMap: Record<string, string> = {
                        "이우영": "/profile-wooyoung.html",
                        "김선혁": "/profile-sunhyuk.html",
                        "고승범": "/profile-seungbeom.html",
                        "장윤태": "/profile-yuntae.html",
                        "이도영": "/profile-idoyoung.html",
                        "석재선": "/profile-jaesun.html",
                        "김민수": "/profile-minsu.html",
                      };
                      if (profileMap[mc.name]) setIframeUrl(profileMap[mc.name]);
                      else setSelectedMc(mc);
                    }}
                    className="mt-auto relative flex items-center justify-center gap-1.5 w-full py-2.5 text-xs tracking-wider font-medium overflow-hidden group transition-all duration-300"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "11px",
                      letterSpacing: "0.2em",
                      background: "linear-gradient(135deg, rgba(214,177,107,0.15) 0%, rgba(214,177,107,0.05) 100%)",
                      border: "1px solid rgba(214,177,107,0.5)",
                      color: "#d6b16b",
                    }}
                  >
                    <span
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: "linear-gradient(135deg, rgba(214,177,107,0.3) 0%, rgba(214,177,107,0.1) 100%)" }}
                    />
                    <span className="relative">PROFILE</span>
                    <svg className="relative" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
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
