/**
 * 목소리왕 콘테스트 - 임시 데모 페이지 (/contest)
 * 사회자 1:1 토너먼트 + 하트(투표) 시스템 + 이달의 목소리왕
 * 주의: 아직 메인 내비게이션에 연결되지 않은 임시 프로토타입입니다.
 * 하트 데이터는 브라우저 localStorage에만 저장됩니다 (서버 공유 없음).
 */
import { useEffect, useMemo, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Crown, RotateCcw, MessageCircle, ArrowLeft } from "lucide-react";
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

type Phase = "match" | "champion";

export default function Contest() {
  const [phase, setPhase] = useState<Phase>("match");
  const [roundIndex, setRoundIndex] = useState(1);
  const [roundSetup, setRoundSetup] = useState<RoundSetup | null>(null);
  const [matchIdx, setMatchIdx] = useState(0);
  const [winnersAcc, setWinnersAcc] = useState<string[]>([]);
  const [champion, setChampion] = useState<string | null>(null);
  const [sessionHearts, setSessionHearts] = useState(0);
  const [allTime, setAllTime] = useState<Record<string, number>>({});
  const [monthHearts, setMonthHearts] = useState<Record<string, number>>({});
  const [heartedThisGame, setHeartedThisGame] = useState<Set<string>>(new Set());

  const refreshHearts = useCallback(() => {
    setAllTime(getAllTimeHearts());
    setMonthHearts(getMonthHearts());
  }, []);

  useEffect(() => {
    refreshHearts();
  }, [refreshHearts]);

  // 접속 시 바로 토너먼트 시작 (인트로 화면 없이 즉시 대결 화면으로)
  useEffect(() => {
    beginTournament();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      <div className="max-w-3xl mx-auto px-4 pt-20">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <p className="text-[10px] tracking-[0.25em] text-[#d4b896] uppercase mb-3">INUSMUSIC VOICE KING</p>
          <h1
            className="text-3xl sm:text-5xl font-semibold mb-3 leading-tight"
            style={{ fontFamily: "'Noto Serif KR', serif" }}
          >
            이너스 목소리왕
            <br className="sm:hidden" />
            <span className="sm:ml-2">콘테스트</span>
          </h1>
          <p className="text-sm text-white/50 leading-relaxed max-w-md mx-auto">
            신부님들이 직접 추천하는 목소리왕 콘테스트.
            <br />
            이번달 목소리왕이 된 사회자는 한달간 지정 문의 시 1만원 할인 혜택이 주어집니다.
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
    </div>
  );
}
