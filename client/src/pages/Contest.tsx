/**
 * VOTE ON VOICE 콘테스트 - 임시 데모 페이지 (/contest)
 * 사회자 1:1 토너먼트 + 하트(투표) 시스템 + 이달의 VOTE ON VOICE
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
  fetchHeartsFromServer,
  currentMonthLabel,
} from "@/components/contest/contestData";
import { buildRound, roundLabel, type RoundSetup } from "@/components/contest/bracketEngine";
import MatchCard from "@/components/contest/MatchCard";
import VoiceKingBanner from "@/components/contest/VoiceKingBanner";
import { setSoundMuted, isSoundMuted, playSfx } from "@/components/contest/soundEffects";

const MINT = "#5BB5A2";

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
  const [monthLabel, setMonthLabel] = useState(currentMonthLabel());
  const [lastMonthChampion, setLastMonthChampion] = useState<{
    name: string;
    hearts: number;
    monthLabel: string;
  } | null>(null);
  const [heartedThisGame, setHeartedThisGame] = useState<Set<string>>(new Set());
  const [muted, setMuted] = useState(isSoundMuted());
  const [isBlind, setIsBlind] = useState(false);

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      setSoundMuted(next);
      return next;
    });
  }, []);


  const refreshHearts = useCallback(() => {
    // 로컬 값으로 즉시 표시 (optimistic), 서버 응답 오면 아래에서 실제값으로 덮어씀
    setAllTime(getAllTimeHearts());
    setMonthHearts(getMonthHearts());
  }, []);

  useEffect(() => {
    refreshHearts();
  }, [refreshHearts]);

  // 서버(Railway DB 연동 후) 전체 방문자 공유 집계로 동기화. 서버 미연결 시 로컬 값 유지.
  useEffect(() => {
    fetchHeartsFromServer().then((data) => {
      if (!data) return;
      setAllTime(data.allTime);
      setMonthHearts(data.month);
      setMonthLabel(data.currentMonthLabel);
      setLastMonthChampion(data.lastMonthChampion);
    });
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

  const beginTournament = useCallback(
    (blind: boolean = false) => {
      const names = CONTESTANTS.map((c) => c.name);
      setIsBlind(blind);
      setChampion(null);
      setSessionHearts(0);
      setHeartedThisGame(new Set());
      setRoundIndex(1);
      startRound(names, 1);
    },
    [startRound],
  );

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
        className="fixed top-4 left-4 z-40 flex items-center gap-1.5 text-xs font-semibold text-white/90 hover:text-white transition-colors bg-black/60 px-3 py-2 rounded-full backdrop-blur-sm border border-white/15"
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
                <span style={{ color: MINT }}>V</span>OTE <span style={{ color: MINT }}>O</span>N
                <br />
                <span style={{ color: MINT }}>V</span>OICE
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
                className="text-sm text-white/55 leading-relaxed max-w-sm mx-auto mb-9 break-keep"
              >
                신랑신부님들이 직접 뽑는,
                <br />
                가장 매력적인 목소리.
                <br />
                이너스뮤직 사회자들의 1:1 목소리 매치를
                <br />
                직접 선택하고
                <br />
                가장 마음에 드는 목소리에
                <br />
                하트를 선물해 주세요.
                <br />
                마지막으로 선택한 목소리가,
                <br />
                여러분과 가장 잘 어울리는 사회자예요.
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
                  { icon: Sparkles, label: "이달의 VOV", desc: "월간 VOTE ON VOICE 선정" },
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

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.52, duration: 0.5 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-3"
              >
                <button
                  onClick={() => beginTournament(false)}
                  className="w-full sm:w-auto sm:px-10 py-3.5 rounded-full text-black text-sm font-semibold tracking-wide transition-transform hover:scale-[1.03] active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg, #e8cfa0, #d4b896)",
                    boxShadow: "0 8px 30px rgba(212,184,150,0.25)",
                  }}
                >
                  일반 모드
                </button>
                <button
                  onClick={() => beginTournament(true)}
                  className="w-full sm:w-auto sm:px-10 py-3.5 rounded-full text-white text-sm font-semibold tracking-wide border border-white/25 bg-white/[0.04] transition-transform hover:scale-[1.03] hover:border-white/45 active:scale-[0.98]"
                >
                  블라인드 모드
                </button>
              </motion.div>
              <p className="text-[10px] text-white/35 mt-3 tracking-wide break-keep">
                블라인드 모드는 이름·사진 없이 목소리만 듣고 선택해요
              </p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-[10px] text-white/30 mt-5 tracking-wide break-keep"
              >
                지난달 VOTE ON VOICE가 된 사회자는 이번달 한달 간 지정 예약시 1만원 할인혜택이 주어집니다.(이벤트 중복적용가능)
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {phase !== "intro" && (
      <div className="max-w-3xl mx-auto px-4 pt-20">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <p className="text-[10px] tracking-[0.25em] text-[#d4b896] uppercase mb-3">INUSMUSIC VOTE ON VOICE</p>
          <h1
            className="text-3xl sm:text-5xl mb-3 leading-tight tracking-wide"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
          >
            <span style={{ color: MINT }}>V</span>OTE <span style={{ color: MINT }}>O</span>N <span style={{ color: MINT }}>V</span>OICE
          </h1>
          <p className="text-sm text-white/50 leading-relaxed max-w-md mx-auto break-keep">
            신랑신부님들이 직접 추천하는
            <br />
            VOTE ON VOICE 콘테스트.
            <br />
            지난달 VOTE ON VOICE가 된 사회자는
            <br />
            이번달 한달 간 지정 예약시
            <br />
            1만원 할인혜택이 주어집니다.
            <br />
            (이벤트 중복적용가능)
          </p>
        </div>

        {!(isBlind && phase === "match") && (
          <div className="mb-10">
            <VoiceKingBanner monthHearts={monthHearts} monthLabel={monthLabel} lastMonthChampion={lastMonthChampion} />
          </div>
        )}

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
                  blind={isBlind}
                />
                <MatchCard
                  contestant={contestantB}
                  hearts={allTime[contestantB.name] || 0}
                  side="right"
                  onSelectWinner={() => selectWinner(contestantB.name)}
                  onHeart={() => manualHeart(contestantB.name)}
                  heartLocked={heartedThisGame.has(contestantB.name)}
                  blind={isBlind}
                />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-[#d4b896] bg-[#0d0d0d] border border-[#d4b896]/40 rounded-full w-9 h-9 flex items-center justify-center">
                  VS
                </span>
              </div>
              <div className="text-center mt-5 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 max-w-sm mx-auto">
                <p className="text-[13px] text-white/70 leading-relaxed break-keep">
                  선택 시 해당 사회자에게 자동으로 하트가 하나씩 주어집니다.
                </p>
                <p className="text-[13px] text-[#ff9db0] leading-relaxed break-keep mt-1">
                  선택 못받은 사회자에게도 하트를 선물해 보세요 <span className="text-[#ff5c7a] font-semibold">♥</span>
                </p>
              </div>
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
                <img src={championData.image} alt={championData.name} className="w-full h-full object-cover object-top" />
              </div>
              <h2 className="text-3xl font-semibold mb-2" style={{ fontFamily: "'Noto Serif KR', serif" }}>
                {championData.name}
              </h2>
              <p className="text-sm text-white/55 max-w-sm mx-auto mb-6 break-keep">{championData.highlight}</p>
              <p className="text-xs text-white/40 mb-8">
                {championData.name} 사회자는 이번 달 현재까지 총{" "}
                <span className="text-[#5BB5A2] font-medium">
                  {(monthHearts[championData.name] || 0).toLocaleString()}개
                </span>
                의 하트를 받았습니다.
              </p>

              {/* 예약 혜택 프리미엄 카드 */}
              <div className="relative max-w-lg mx-auto mb-9 text-left">
                <div
                  className="absolute -inset-[1.5px] rounded-2xl opacity-90"
                  style={{
                    background: "linear-gradient(135deg, #f4e2b8, #d4b896, #8a6d3b, #f4e2b8)",
                  }}
                />
                <div className="relative rounded-2xl bg-[#14110b] px-5 py-6 sm:px-7 sm:py-7 overflow-hidden">
                  <div
                    className="pointer-events-none absolute inset-0 opacity-60"
                    style={{
                      background:
                        "radial-gradient(circle at 15% 0%, rgba(244,226,184,0.16) 0%, transparent 55%), radial-gradient(circle at 100% 100%, rgba(212,184,150,0.12) 0%, transparent 50%)",
                    }}
                  />
                  <div className="relative">
                    <div className="flex items-center justify-center gap-2 mb-5">
                      <span className="h-px w-6 bg-[#f4e2b8]/50" />
                      <Sparkles size={13} className="text-[#f4e2b8]" />
                      <p className="text-[10px] tracking-[0.25em] text-[#f4e2b8] uppercase font-semibold">
                        {championData.name} 사회자 예약 시 프리미엄 혜택
                      </p>
                      <Sparkles size={13} className="text-[#f4e2b8]" />
                      <span className="h-px w-6 bg-[#f4e2b8]/50" />
                    </div>

                    <div className="mb-5">
                      <p className="text-[11px] tracking-[0.15em] text-[#f4e2b8]/90 uppercase font-semibold mb-2.5">
                        공통 혜택
                      </p>
                      <ul className="space-y-1.5">
                        {[
                          { text: "숨고 상담후기 작성 시 2만원 할인" },
                          { text: "결혼식 준비에 필요한 체크리스트 & 웨딩가이드(예식주간과 당일 안내 꿀팁) 자료 제공" },
                          { text: "이너스뮤직 365일 이벤트 자세히 보기 →", href: "https://blog.naver.com/inusmusics/220652958346" },
                          { text: "지인할인 적용 (코드번호 부여받을 시 1만원 할인)" },
                          { text: "MR 제공" },
                          { text: "MR 편집 & AR 편집" },
                          { text: "모바일청첩장 무료 제공 (예약고객에 한함)" },
                        ].map((item) => (
                          <li key={item.text} className="flex items-start gap-2 text-[13px] text-white/80 leading-relaxed break-keep">
                            <span className="mt-1.5 w-1 h-1 rounded-full bg-[#f4e2b8] flex-shrink-0" />
                            {item.href ? (
                              <a
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#f4e2b8] hover:text-[#ffe9b8] underline underline-offset-2 decoration-[#f4e2b8]/40 transition-colors"
                              >
                                {item.text}
                              </a>
                            ) : (
                              item.text
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="h-px w-full bg-gradient-to-r from-transparent via-[#f4e2b8]/25 to-transparent mb-5" />

                    <div>
                      <p className="text-[11px] tracking-[0.15em] text-[#f4e2b8]/90 uppercase font-semibold mb-2.5">
                        Wedding MC · 결혼식 사회자 예약 시 혜택
                      </p>
                      <ul className="space-y-1.5">
                        {[
                          "두 사람의 이야기를 담은 맞춤형 대본 제작",
                          "예식 분위기에 맞는 BGM 100여 곡 제공",
                          "완성도 높은 혼인서약서 샘플 8종 제공",
                          "격식과 감성을 담은 성혼선언문 샘플 8종 제공",
                          "감동을 더하는 덕담 샘플 6종 제공",
                        ].map((item) => (
                          <li key={item} className="flex items-start gap-2 text-[13px] text-white/80 leading-relaxed break-keep">
                            <span className="mt-1.5 w-1 h-1 rounded-full bg-[#f4e2b8] flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-white/35 mb-2.5 tracking-wide">다시 도전할 모드를 선택해 주세요</p>
              <div className="flex flex-wrap items-center justify-center gap-3 mb-3">
                <button
                  onClick={() => beginTournament(false)}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-full border border-white/20 text-white/80 text-sm hover:border-white/40 transition-colors"
                >
                  <RotateCcw size={14} /> 일반 모드로 다시 도전
                </button>
                <button
                  onClick={() => beginTournament(true)}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-full border border-white/20 text-white/80 text-sm hover:border-white/40 transition-colors"
                >
                  <RotateCcw size={14} /> 블라인드 모드로 다시 도전
                </button>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
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
