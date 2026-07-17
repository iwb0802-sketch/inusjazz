/**
 * 인스타 릴스 스타일 하트 버튼 - 탭하면 하트가 위로 튀어오르며 카운트 증가
 */
import { useState, useCallback, useRef } from "react";
import { Heart } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface FloatingHeart {
  id: number;
  x: number;
}

interface HeartButtonProps {
  count: number;
  onHeart: () => void;
  size?: "sm" | "lg";
  active?: boolean;
  locked?: boolean;
}

export default function HeartButton({ count, onHeart, size = "sm", active, locked }: HeartButtonProps) {
  const [floaters, setFloaters] = useState<FloatingHeart[]>([]);
  const [pop, setPop] = useState(false);
  const idRef = useRef(0);

  const trigger = useCallback(() => {
    if (locked) return;
    onHeart();
    const id = idRef.current++;
    const x = (Math.random() - 0.5) * 30;
    setFloaters((f) => [...f, { id, x }]);
    setPop(true);
    setTimeout(() => setPop(false), 220);
    setTimeout(() => {
      setFloaters((f) => f.filter((h) => h.id !== id));
    }, 900);
  }, [onHeart, locked]);

  const iconSize = size === "lg" ? 22 : 16;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        trigger();
      }}
      className={`relative flex items-center gap-1.5 select-none rounded-full px-3 py-1.5 transition-colors ${
        locked
          ? "bg-[#5BB5A2]/15 text-[#5BB5A2] cursor-not-allowed opacity-80"
          : active
          ? "bg-[#5BB5A2]/15 text-[#5BB5A2]"
          : "bg-black/30 text-white/80 hover:bg-black/45"
      }`}
      aria-label={locked ? "이미 응원했어요" : "하트 적립"}
    >
      <motion.span
        animate={pop ? { scale: [1, 1.5, 1] } : {}}
        transition={{ duration: 0.22 }}
      >
        <Heart
          size={iconSize}
          className={locked || active ? "fill-[#5BB5A2] text-[#5BB5A2]" : "fill-[#ff5c7a] text-[#ff5c7a]"}
        />
      </motion.span>
      <span className="text-xs font-medium tabular-nums" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
        {count.toLocaleString()}
      </span>

      <AnimatePresence>
        {floaters.map((h) => (
          <motion.span
            key={h.id}
            initial={{ opacity: 1, y: 0, scale: 0.6, x: h.x }}
            animate={{ opacity: 0, y: -70, scale: 1.3, x: h.x }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="absolute left-1/2 top-0 pointer-events-none"
          >
            <Heart size={18} className="fill-[#ff5c7a] text-[#ff5c7a]" />
          </motion.span>
        ))}
      </AnimatePresence>
    </button>
  );
}
