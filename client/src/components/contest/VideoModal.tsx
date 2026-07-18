import { useEffect } from "react";
import { X } from "lucide-react";

interface VideoModalProps {
  videoId: string;
  name: string;
  onClose: () => void;
}

export default function VideoModal({ videoId, name, onClose }: VideoModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.9)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2 px-1">
          <span
            className="text-sm tracking-widest"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "#d6b16b" }}
          >
            {name} 사회자 영상
          </span>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full text-white/70 hover:text-white transition-colors"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
            aria-label="닫기"
          >
            <X size={16} />
          </button>
        </div>
        <div className="w-full rounded-xl overflow-hidden" style={{ aspectRatio: "16/9", background: "#000" }}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&modestbranding=1&playsinline=1`}
            title={`${name} 사회자 영상`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
