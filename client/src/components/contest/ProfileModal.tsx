import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface ProfileModalProps {
  url: string;
  onClose: () => void;
}

export default function ProfileModal({ url, onClose }: ProfileModalProps) {
  const [loaded, setLoaded] = useState(false);

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
      className="fixed inset-0 z-[300] flex flex-col"
      style={{ background: "#0b0b0b" }}
      onClick={onClose}
    >
      <div
        className="flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(214,177,107,0.2)", background: "rgba(11,11,11,0.98)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <span
          className="text-sm tracking-widest"
          style={{ fontFamily: "'Cormorant Garamond', serif", color: "#d6b16b" }}
        >
          INUSMUSIC PROFILE
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

      <div className="flex-1 relative" onClick={(e) => e.stopPropagation()}>
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: "#0b0b0b" }}>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  border: "2px solid rgba(214,177,107,0.2)",
                  borderTop: "2px solid #d6b16b",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                  margin: "0 auto 16px",
                }}
              />
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, letterSpacing: "0.3em", color: "rgba(214,177,107,0.6)" }}>
                LOADING
              </p>
            </div>
          </div>
        )}
        <iframe
          src={url}
          className="w-full h-full"
          style={{ border: 0, display: loaded ? "block" : "none" }}
          title="사회자 프로필"
          onLoad={() => setLoaded(true)}
        />
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
