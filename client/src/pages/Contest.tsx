/**
 * 보이스 크라운 콘테스트 - 임시 데모 페이지 (/contest)
 * 사회자 1:1 토너먼트 + 하트(투표) 시스템 + 이달의 보이스 크라운
 * 주의: 아직 메인 내비게이션에 연결되지 않은 임시 프로토타입입니다.
 * 하트 데이터는 브라우저 localStorage에만 저장됩니다 (서버 공유 없음).
 */
import { useEffect, useMemo, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Crown, RotateCcw, MessageCircle, ArrowLeft, Heart, Sparkles, Play, Volume2, VolumeX } from "lucide-react";
import {
  CONTESTANTS,
  getContestant,
  addHeart,
  getAllTimeHearts,
  getMonthHearts,
} from "@/components/contest/contestData";
import { buildRound, roundLabel, type RoundSetup } from "@/components/contest/bracketEngine";
import MatchCard from "@/components/contest/MatchCard";
import VoiceKingBanner from "@/components/contest/VoiceKingBanner";
import { setSoundMuted, isSoundMuted, playSfx } from "@/components/contest/soundEffects";

type Phase = "intro" | "match" | "champion";

export default function Contest() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [roundIndex, setRoundIndex] = useState(1);
  const [roundSetup, setRoundSetup] = useState<RoundSetup | null>(null);
  const [matchIdx, setMatchIdx] = useState(0);
  const [winnersAcc, setWinnersAcc] = useState<string[]>([]);
  const [champion, setChampion] = useState<string | null>(null);
  const [sessionHearts, setSessionHearts] = useState(0);
  const [allTime, setAllTime] = useState<Record<string, number>>({});
  const [monthHearts, setMonthHearts] = useState<Record<string, number>>({});
  const [heartedThisGame, setHeartedThisGame] = useState<Set<string>>(new Set());
  const [muted, setMuted] = useState(isSoundMuted());

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      setSoundMuted(next);
      return next;
    });
  }, []);


  const refreshHearts = useCallback(() => {
    setAllTime(getAllTimeHearts());
    setMonthHearts(getMonthHearts());
  }, []);

  useEffect(() => {
    refreshHearts();
  }, [refreshHearts]);

  const giveHeart = useCallback(
    (name: string, amount = 1) => {
      addHeart(name, amount);
      refreshHearts();
      setSessionHearts((v) => v + amount);
    },
    [refreshHearts],
  );

  // 수동 하트 탭은 게임(토너먼트 1회)당 사회자 한 명에게 최대 1회만 허용
  const manualHeart = useCallback(
    (name: string) => {
      if (heartedThisGame.has(name)) return;
      setHeartedThisGame((prev) => new Set(prev).add(name));
      giveHeart(name, 1);
      playSfx("heart");
    },
    [heartedThisGame, giveHeart],
  );

  const startRound = useCallback(
    (players: string[], idx: number) => {
      const setup = buildRound(players, idx);
      setRoundSetup(setup);
      setMatchIdx(0);
      setWinnersAcc(setup.bye ? [setup.bye] : []);
      if (setup.bye) {
        giveHeart(setup.bye, 1);
      }
      setPhase("match");
    },
    [giveHeart],
  );

  const beginTournament = useCallback(() => {
    const names = CONTESTANTS.map((c) => c.name);
    setChampion(null);
    setSessionHearts(0);
    setHeartedThisGame(new Set());
    setRoundIndex(1);
    startRound(names, 1);
  }, [startRound]);

  const selectWinner = useCallback(
    (winner: string) => {
      if (!roundSetup) return;
      giveHeart(winner, 1);
      playSfx("select");
      const nextWinners = [...winnersAcc, winner];
      const isLastMatch = matchIdx + 1 >= roundSetup.matches.length;
      if (!isLastMatch) {
        setWinnersAcc(nextWinners);
        setMatchIdx((v) => v + 1);
        return;
      }
      // 라운드 종료
      if (nextWinners.length === 1) {
        setChampion(nextWinners[0]);
        setPhase("champion");
        playSfx("champion");
      } else {
        const nextIdx = roundIndex + 1;
        setRoundIndex(nextIdx);
        startRound(nextWinners, nextIdx);
      }
    },
    [roundSetup, winnersAcc, matchIdx, roundIndex, startRound, giveHeart],
  );

  const currentMatch = roundSetup?.matches[matchIdx];
  const contestantA = currentMatch ? getContestant(currentMatch.a) : undefined;
  const contestantB = currentMatch ? getContestant(currentMatch.b) : undefined;

  const totalMatchesThisRound = roundSetup?.matches.length ?? 0;
  const label = roundSetup ? roundLabel(roundSetup.playersIn.length) : "";

  const championData = champion ? getContestant(champion) : undefined;

  return (
    <div
      className="min-h-screen w-full bg-[#0d0d0d] text-white pb-24"
      style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
    >
      <a
        href="/"
        className="fixed top-4 left-4 z-40 flex items-center gap-1.5 text-xs text-white/50 hover:text-white/90 transition-colors bg-black/40 px-3 py-2 rounded-full backdrop-blur-sm"
      >
        <ArrowLeft size={13} /> 메인으로
      </a>

      <button
        type="button"
        onClick={toggleMute}
        aria-label={muted ? "소리 켜기" : "소리 끄기"}
        className="fixed top-4 right-4 z-40 flex items-center justify-center w-9 h-9 text-white/60 hover:text-white/90 transition-colors bg-black/40 rounded-full backdrop-blur-sm"
      >
        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>

      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen w-full flex items-center justify-center px-5 relative overflow-hidden"
          >
            {/* 배경 장식 */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 50% 15%, rgba(212,184,150,0.14) 0%, transparent 55%), radial-gradient(circle at 85% 85%, rgba(91,181,162,0.10) 0%, transparent 50%)",
              }}
            />
            <div className="relative max-w-md w-full text-center py-16">
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="mb-6 flex items-center justify-center gap-2"
              >
                <span className="h-px w-8 bg-[#d4b896]/40" />
                <p className="text-[10px] tracking-[0.3em] text-[#d4b896] uppercase">Wedding MC Contest</p>
                <span className="h-px w-8 bg-[#d4b896]/40" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mx-auto mb-6 w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(145deg, rgba(212,184,150,0.18), rgba(212,184,150,0.02))",
                  border: "1px solid rgba(212,184,150,0.35)",
                }}
              >
                <Crown className="text-[#d4b896]" size={26} />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.5 }}
                className="text-5xl sm:text-6xl mb-1 leading-tight tracking-wide"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
              >
                INUS
                <br />
                VOICE CROWN
              </motion.h1>
              <p
                className="text-[11px] tracking-[0.4em] text-white/40 uppercase mb-5"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Contest
              </p>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.36, duration: 0.5 }}
                className="text-sm text-white/55 leading-relaxed max-w-sm mx-auto mb-9"
              >
                신랑신부님들이 직접 뽑는, 가장 매력적인 목소리.
                <br />
                이너스뮤직 사회자들의 1:1 매치를 직접 감상하고
                <br />
                가장 마음에 드는 목소리에 하트를 선물해 주세요.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex items-center justify-center gap-3 sm:gap-5 mb-9 text-white/45"
              >
                <span className="text-[11px] tracking-wide whitespace-nowrap">
                  Since <span className="text-[#d4b896] font-medium">2015</span>
                </span>
                <span className="w-px h-3 bg-white/15" />
                <span className="text-[11px] tracking-wide whitespace-nowrap">
                  누적 <span className="text-[#d4b896] font-medium">4만쌍+</span> 진행
                </span>
                <span className="w-px h-3 bg-white/15" />
                <span className="text-[11px] tracking-wide whitespace-nowrap">
                  후기 <span className="text-[#d4b896] font-medium">1,500건+</span>
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.44, duration: 0.5 }}
                className="grid grid-cols-3 gap-2 mb-10 text-left"
              >
                {[
                  { icon: Play, label: "1:1 매치", desc: "실제 음성으로 대결" },
                  { icon: Heart, label: "하트 투표", desc: "마음에 드는 목소리 선택" },
                  { icon: Sparkles, label: "이달의 크라운", desc: "월간 보이스 크라운 선정" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-4 flex flex-col items-center text-center gap-1.5"
                  >
                    <item.icon size={16} className="text-[#d4b896]" />
                    <span className="text-[11px] font-medium text-white/85">{item.label}</span>
                    <span className="text-[10px] text-white/40 leading-snug">{item.desc}</span>
                  </div>
                ))}
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.52, duration: 0.5 }}
                onClick={beginTournament}
                className="w-full sm:w-auto sm:px-14 py-3.5 rounded-full text-black text-sm font-semibold tracking-wide transition-transform hover:scale-[1.03] active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, #e8cfa0, #d4b896)",
                  boxShadow: "0 8px 30px rgba(212,184,150,0.25)",
                }}
              >
                콘테스트 시작하기
              </motion.button>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-[10px] text-white/30 mt-5 tracking-wide"
              >
                지난달 보이스 크라운이 된 사회자는 이번달 한달 간 지정 예약시 1만원 할인혜택이 주어집니다.
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {phase !== "intro" && (
      <div className="max-w-3xl mx-auto px-4 pt-20">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <p className="text-[10px] tracking-[0.25em] text-[#d4b896] uppercase mb-3">INUSMUSIC VOICE CROWN</p>
          <h1
            className="text-3xl sm:text-5xl mb-3 leading-tight tracking-wide"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
          >
            INUS VOICE CROWN
          </h1>
          <p className="text-sm text-white/50 leading-relaxed max-w-md mx-auto">
            신랑신부님들이 직접 추천하는 보이스 크라운 콘테스트.
            <br />
            지난달 보이스 크라운이 된 사회자는 이번달 한달 간 지정 예약시 1만원 할인혜택이 주어집니다.
          </p>
        </div>

        <div className="mb-10">
          <VoiceKingBanner monthHearts={monthHearts} />
        </div>

        <AnimatePresence mode="wait">
          {phase === "match" && contestantA && contestantB && roundSetup && (
            <motion.div key={`match-${roundIndex}-${matchIdx}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-4 text-xs text-white/45">
                <span className="tracking-wide">{label}</span>
                <span>
                  대결 {matchIdx + 1} / {totalMatchesThisRound}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-5 relative">
                <MatchCard
                  contestant={contestantA}
                  hearts={allTime[contestantA.name] || 0}
                  side="left"
                  onSelectWinner={() => selectWinner(contestantA.name)}
                  onHeart={() => manualHeart(contestantA.name)}
                  heartLocked={heartedThisGame.has(contestantA.name)}
                />
                <MatchCard
                  contestant={contestantB}
                  hearts={allTime[contestantB.name] || 0}
                  side="right"
                  onSelectWinner={() => selectWinner(contestantB.name)}
                  onHeart={() => manualHeart(contestantB.name)}
                  heartLocked={heartedThisGame.has(contestantB.name)}
                />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-[#d4b896] bg-[#0d0d0d] border border-[#d4b896]/40 rounded-full w-9 h-9 flex items-center justify-center">
                  VS
                </span>
              </div>
              <p className="text-center text-xs text-white/40 mt-4 leading-relaxed">
                선택 시 해당 사회자에게 자동으로 하트가 하나씩 주어집니다.
                <br />
                (선택 못받은 사회자에게도 하트를 선물해 보세요 <span className="text-[#ff5c7a]">♥</span>)
              </p>
            </motion.div>
          )}

          {phase === "champion" && championData && (
            <motion.div
              key="champion"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center rounded-2xl border border-[#d4b896]/30 bg-gradient-to-b from-[#d4b896]/10 to-transparent p-10"
            >
              <Crown className="mx-auto mb-3 text-[#d4b896]" size={32} />
              <p className="text-[10px] tracking-[0.2em] text-[#d4b896] uppercase mb-4">이번 회차 챔피언</p>
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 ring-4 ring-[#d4b896]/50">
                <img src={championData.image} alt={championData.name} className="w-full h-full object-cover" />
              </div>
              <h2 className="text-3xl font-semibold mb-2" style={{ fontFamily: "'Noto Serif KR', serif" }}>
                {championData.name}
              </h2>
              <p className="text-sm text-white/55 max-w-sm mx-auto mb-6">{championData.highlight}</p>
              <p className="text-xs text-white/40 mb-8">
                이번 회차에서 총 <span className="text-[#5BB5A2] font-medium">{sessionHearts}개</span>의 하트가
                적립되었습니다.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={beginTournament}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-full border border-white/20 text-white/80 text-sm hover:border-white/40 transition-colors"
                >
                  <RotateCcw size={14} /> 다시 도전하기
                </button>
                <a
                  href="https://pf.kakao.com/_wxovaM/chat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#5BB5A2] text-black text-sm font-medium hover:bg-[#6fc5b2] transition-colors"
                >
                  <MessageCircle size={14} /> {championData.name} 사회자 상담하기
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      )}
    </div>
  );
}
