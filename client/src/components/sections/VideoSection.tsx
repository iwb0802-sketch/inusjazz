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
    <div className="group relative rounded-sm overflow-hidden bg-[#161616] border border-white/5 hover:border-[#5BB5A2]/30 transition-all duration-500">
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
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-500" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#5BB5A2]/90 flex items-center justify-center group-hover:bg-[#5BB5A2] group-hover:scale-110 transition-all duration-300 shadow-lg">
                <Play size={28} className="text-white ml-1" fill="white" />
              </div>
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
