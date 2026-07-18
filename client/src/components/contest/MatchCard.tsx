import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Play, Pause, ArrowUp } from "lucide-react";
import HeartButton from "./HeartButton";
import ProfileModal from "./ProfileModal";
import type { Contestant } from "./contestData";

interface MatchCardProps {
  contestant: Contestant;
  hearts: number;
  side: "left" | "right";
  onSelectWinner: () => void;
  onHeart: () => void;
  disabled?: boolean;
  heartLocked?: boolean;
}

// 카드 간 오디오는 하나만 재생되도록 전역으로 공유
let activeAudio: HTMLAudioElement | null = null;

export default function MatchCard({ contestant, hearts, side, onSelectWinner, onHeart, disabled, heartLocked }: MatchCardProps) {
  const [playing, setPlaying] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) {
      audioRef.current = new Audio(contestant.audioFile);
      audioRef.current.addEventListener("ended", () => setPlaying(false));
    }
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
      return;
    }
    if (activeAudio && activeAudio !== audioRef.current) {
      activeAudio.pause();
    }
    activeAudio = audioRef.current;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
    setPlaying(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: side === "left" ? -24 : 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-[#111]/70 backdrop-blur-sm"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img src={contestant.image} alt={contestant.name} className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
        <span
          className={`absolute top-3 left-3 text-[10px] tracking-wider px-2 py-1 rounded-full font-medium ${
            contestant.tier === "PREMIUM" ? "bg-[#d4b896] text-black" : "bg-[#5BB5A2] text-black"
          }`}
        >
          {contestant.tier}
        </span>
        <div className="absolute top-3 right-3">
          <HeartButton count={hearts} onHeart={onHeart} locked={heartLocked} />
        </div>

        {/* 하트 버튼 클릭 유도 - 반짝이는 화살표 표시 */}
        {!heartLocked && (
          <motion.div
            className="absolute top-11 right-4 pointer-events-none flex flex-col items-center"
            animate={{
              y: [0, -6, 0],
              filter: [
                "drop-shadow(0 0 2px rgba(255,226,122,0.4))",
                "drop-shadow(0 0 9px rgba(255,226,122,1))",
                "drop-shadow(0 0 2px rgba(255,226,122,0.4))",
              ],
            }}
            transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowUp size={26} strokeWidth={3.2} className="text-white" />
            <span className="text-[10px] font-bold text-white tracking-wide -mt-0.5">Click</span>
          </motion.div>
        )}

        {/* 목소리 미리듣기 재생 버튼 */}
        <button
          onClick={togglePlay}
          className="absolute inset-0 m-auto flex items-center justify-center"
          style={{ width: "fit-content", height: "fit-content", top: "40%" }}
          aria-label="목소리 미리듣기"
        >
          <motion.span
            animate={playing ? { scale: [1, 1.12, 1] } : { scale: 1 }}
            transition={{ duration: 1, repeat: playing ? Infinity : 0 }}
            className="flex items-center justify-center w-14 h-14 rounded-full bg-black/50 border border-white/40 backdrop-blur-sm hover:bg-black/65 transition-colors"
          >
            {playing ? (
              <Pause size={22} className="text-white fill-white" />
            ) : (
              <Play size={22} className="text-white fill-white ml-0.5" />
            )}
          </motion.span>
        </button>
        {playing && (
          <span className="absolute bottom-16 left-1/2 -translate-x-1/2 text-[10px] text-white/70 bg-black/40 px-2 py-0.5 rounded-full">
            목소리 재생중...
          </span>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3
            className="text-2xl text-white font-semibold"
            style={{ fontFamily: "'Noto Serif KR', serif" }}
          >
            {contestant.name}
          </h3>
          <p className="text-xs text-white/60 mt-0.5">{contestant.desc}</p>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <p className="text-xs text-white/55 leading-relaxed line-clamp-2" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
          {contestant.highlight}
        </p>
        <div className="flex items-center gap-2 mt-auto">
          <button
            onClick={onSelectWinner}
            disabled={disabled}
            className="flex-1 py-2.5 rounded-full bg-[#5BB5A2] text-black text-sm font-medium tracking-wide hover:bg-[#6fc5b2] transition-colors disabled:opacity-40"
          >
            사회자 선택
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowProfile(true);
            }}
            className="p-2.5 rounded-full border border-white/15 text-white/50 hover:text-white/90 hover:border-white/40 transition-colors"
            aria-label="프로필 보기"
          >
            <ExternalLink size={14} />
          </button>
        </div>
      </div>
      {showProfile && (
        <ProfileModal url={contestant.profileUrl} onClose={() => setShowProfile(false)} />
      )}
    </motion.div>
  );
}
