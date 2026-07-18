import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Play, Pause, ArrowUp, HelpCircle } from "lucide-react";
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
  /** 블라인드 모드: 이름/사진/프로필 등 신상 정보를 전부 가리고 음성 재생만 노출 */
  blind?: boolean;
}

// 카드 간 오디오는 하나만 재생되도록 전역으로 공유
let activeAudio: HTMLAudioElement | null = null;

export default function MatchCard({ contestant, hearts, side, onSelectWinner, onHeart, disabled, heartLocked, blind }: MatchCardProps) {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  // 인스타그램 등 인앱 브라우저는 new Audio()로 만든, DOM에 붙지 않은 오디오 엘리먼트의 재생을
  // 조용히 막는 경우가 있어 실제 <audio> 태그를 DOM에 렌더링해서 사용한다.
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const loadingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    };
  }, []);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    // 로딩 중 중복 탭 방지: load()를 다시 호출하면 진행 중이던 play() 요청이
    // 취소되면서(AbortError) "여러 번 눌러야 재생되는" 증상이 발생하므로 무시한다.
    if (loading) return;

    if (!audio.paused) {
      audio.pause();
      audio.currentTime = 0;
      setPlaying(false);
      return;
    }

    if (activeAudio && activeAudio !== audio) {
      activeAudio.pause();
      activeAudio.currentTime = 0;
    }
    activeAudio = audio;
    setLoading(true);
    if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    // 네트워크 문제 등으로 재생이 끝내 시작되지 않을 경우 로딩 상태에 갇히지 않도록 안전장치
    loadingTimeoutRef.current = setTimeout(() => {
      setLoading(false);
    }, 8000);
    audio
      .play()
      .catch(() => {
        setLoading(false);
        setPlaying(false);
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: side === "left" ? -24 : 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-[#111]/70 backdrop-blur-sm"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        {blind ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1c1c1c] to-[#0a0a0a]">
            <HelpCircle size={44} className="text-white/15" strokeWidth={1.4} />
          </div>
        ) : (
          <img src={contestant.image} alt={contestant.name} className="w-full h-full object-cover object-top" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
        {!blind && (
          <span
            className={`absolute top-3 left-3 text-[10px] tracking-wider px-2 py-1 rounded-full font-medium ${
              contestant.tier === "PREMIUM" ? "bg-[#d4b896] text-black" : "bg-[#5BB5A2] text-black"
            }`}
          >
            {contestant.tier}
          </span>
        )}
        {blind && (
          <span className="absolute top-3 left-3 text-[10px] tracking-wider px-2 py-1 rounded-full font-medium bg-white/10 text-white/60">
            BLIND
          </span>
        )}
        <div className="absolute top-3 right-3">
          <HeartButton count={hearts} onHeart={onHeart} locked={heartLocked} hideCount={blind} />
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

        <audio
          ref={audioRef}
          src={contestant.audioFile}
          preload="auto"
          playsInline
          onPlaying={() => {
            setLoading(false);
            setPlaying(true);
          }}
          onWaiting={() => setLoading(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onError={() => {
            setLoading(false);
            setPlaying(false);
          }}
        />

        {/* 목소리 미리듣기 재생 버튼 - 블라인드 모드는 기존처럼 이미지 중앙(얼굴 없음), 일반 모드는 이름 옆 */}
        {blind && (
          <button
            onClick={togglePlay}
            className="absolute left-1/2 flex items-center justify-center z-10 pointer-events-auto"
            style={{ top: "38%", transform: "translate(-50%, -50%)" }}
            aria-label="목소리 미리듣기"
          >
            <motion.span
              animate={playing ? { scale: [1, 1.12, 1] } : { scale: 1 }}
              transition={{ duration: 1, repeat: playing ? Infinity : 0 }}
              className="flex items-center justify-center w-14 h-14 rounded-full bg-black/50 border border-white/40 backdrop-blur-sm hover:bg-black/65 transition-colors"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : playing ? (
                <Pause size={22} className="text-white fill-white" />
              ) : (
                <Play size={22} className="text-white fill-white ml-0.5" />
              )}
            </motion.span>
          </button>
        )}
        {loading && (
          <span className="absolute bottom-16 left-1/2 -translate-x-1/2 text-[10px] text-white/70 bg-black/40 px-2 py-0.5 rounded-full">
            불러오는 중...
          </span>
        )}
        {playing && !loading && (
          <span className="absolute bottom-16 left-1/2 -translate-x-1/2 text-[10px] text-white/70 bg-black/40 px-2 py-0.5 rounded-full">
            목소리 재생중...
          </span>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between gap-2">
          {blind ? (
            <h3
              className="text-2xl text-white/70 font-semibold tracking-widest pointer-events-none"
              style={{ fontFamily: "'Noto Serif KR', serif" }}
            >
              {side === "left" ? "사회자 A" : "사회자 B"}
            </h3>
          ) : (
            <>
              <div className="min-w-0 pointer-events-none">
                <h3
                  className="text-2xl text-white font-semibold truncate"
                  style={{ fontFamily: "'Noto Serif KR', serif" }}
                >
                  {contestant.name}
                </h3>
                <p className="text-xs text-white/60 mt-0.5 truncate">{contestant.desc}</p>
              </div>
              <button
                onClick={togglePlay}
                className="flex-shrink-0 flex items-center justify-center pointer-events-auto"
                aria-label="목소리 미리듣기"
              >
                <motion.span
                  animate={playing ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                  transition={{ duration: 1, repeat: playing ? Infinity : 0 }}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-black/55 border border-white/40 backdrop-blur-sm hover:bg-black/70 transition-colors"
                >
                  {loading ? (
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : playing ? (
                    <Pause size={18} className="text-white fill-white" />
                  ) : (
                    <Play size={18} className="text-white fill-white ml-0.5" />
                  )}
                </motion.span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        {!blind && (
          <p className="text-xs text-white/55 leading-relaxed line-clamp-2" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
            {contestant.highlight}
          </p>
        )}
        <div className="flex items-center gap-2 mt-auto">
          <button
            onClick={onSelectWinner}
            disabled={disabled}
            className="flex-1 py-2.5 rounded-full bg-[#5BB5A2] text-black text-sm font-medium tracking-wide hover:bg-[#6fc5b2] transition-colors disabled:opacity-40"
          >
            사회자 선택
          </button>
          {!blind && (
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
          )}
        </div>
      </div>
      {showProfile && !blind && (
        <ProfileModal url={contestant.profileUrl} onClose={() => setShowProfile(false)} />
      )}
    </motion.div>
  );
}
