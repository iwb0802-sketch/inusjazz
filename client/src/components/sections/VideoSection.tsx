/**
 * VideoSection - 리얼 웨딩 영상 모음
 * Design: Dark background, 2x2 grid of YouTube embeds with elegant styling
 * Brand: Mint (#5BB5A2) + Gold (#d4b896)
 */
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useState } from "react";
import { Play } from "lucide-react";

const VIDEOS = [
  {
    id: "4Quvg9TIGAk",
    title: "리얼 웨딩 영상 1",
  },
  {
    id: "prhKZqfMjfM",
    title: "리얼 웨딩 영상 2",
  },
  {
    id: "ali34pV7ALk",
    title: "리얼 웨딩 영상 3",
  },
  {
    id: "zx_iAhMkMns",
    title: "리얼 웨딩 영상 4",
  },
];

function VideoCard({ video }: { video: (typeof VIDEOS)[0] }) {
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    setPlaying(true);
  };

  return (
    <div
      className="group relative rounded-sm overflow-hidden transition-all duration-500 hover:-translate-y-1"
      style={{
        background: "#161616",
        border: "1px solid rgba(212,184,150,0.20)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.5), 0 0 0 0 rgba(212,184,150,0)",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 40px rgba(0,0,0,0.6), 0 0 20px rgba(212,184,150,0.08)";
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(212,184,150,0.45)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.5)";
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(212,184,150,0.20)";
      }}
    >
      {/* 상단 골드 하이라이트 라인 */}
      <div
        className="absolute top-0 left-0 right-0 h-px z-20 opacity-60 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "linear-gradient(to right, transparent, #d4b896, transparent)" }}
      />

      <div className="relative aspect-video">
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&mute=0&rel=0&playsinline=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full z-10"
          />
        ) : (
          <div
            onClick={handlePlay}
            className="cursor-pointer absolute inset-0"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handlePlay(); }}
          >
            <img
              src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
              alt={video.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
              }}
            />
            {/* 비네트 오버레이 */}
            <div className="absolute inset-0 bg-black/35 group-hover:bg-black/20 transition-colors duration-500" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)" }} />

            {/* 재생 버튼 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300"
                style={{
                  background: "rgba(212,184,150,0.90)",
                  boxShadow: "0 0 0 6px rgba(212,184,150,0.15), 0 4px 20px rgba(0,0,0,0.4)",
                }}
              >
                <Play size={28} className="ml-1" style={{ color: "#1a1a1a" }} fill="#1a1a1a" />
              </div>
            </div>

            {/* 하단 영상 제목 */}
            <div className="absolute bottom-0 left-0 right-0 px-4 py-3 z-10">
              <p
                className="text-white/80 text-xs tracking-[0.15em] uppercase"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {video.title}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VideoSection() {
  const anim1 = useScrollAnimation();
  const anim2 = useScrollAnimation();

  return (
    <section id="video" className="bg-[#0d0d0d] py-24 sm:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={anim1.ref}
          className={`text-center mb-16 sm:mb-20 fade-up ${anim1.isVisible ? "visible" : ""}`}
        >
          <span
            className="text-[#d4b896] text-xs sm:text-sm tracking-[0.3em] uppercase"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            REAL WEDDING FILM
          </span>
          <h2
            className="mt-4 text-white text-2xl sm:text-3xl md:text-4xl"
            style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700 }}
          >
            리얼 <span className="text-[#5BB5A2]">웨딩 영상</span> 모음
          </h2>
          <p className="mt-4 text-white/50 text-sm sm:text-base max-w-xl mx-auto">
            실제 본식에서 촬영된 영상으로 진행 스타일과 분위기를 직접 확인해보세요
          </p>
        </div>

        {/* Video Grid */}
        <div
          ref={anim2.ref}
          className={`fade-up ${anim2.isVisible ? "visible" : ""}`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
            {VIDEOS.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
