/**
 * INUS MC CUE MATCH - "내가 사회자라면?" 인터랙티브 매칭 게임
 * 전체 기획 반영판: 브리핑 4문항 + 상황 3개(신부입장지연/축가후박수/예식지연) + 결과/공유/이미지저장
 * ⚠️ 테스트 전용 페이지 - 메인 네비게이션에 노출하지 않음 (/mc-game 직접 접근)
 */
import { useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import {
  Mic,
  Clock,
  Music,
  Users,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  ChevronLeft,
  Share2,
  Download,
} from "lucide-react";
import {
  Axis,
  GAME_MCS,
  GameMc,
  BRIEFING_QUESTIONS,
  SCENARIOS,
  RESULT_TYPES,
} from "@/data/mcGameData";
import { trackGameEvent } from "@/lib/mcGameAnalytics";

const GOLD = "#d4b896";
const MINT = "#5BB5A2";

type Step = "start" | "briefing" | "scenario-intro" | "scenario" | "result";

const ZERO_AXES: Record<Axis, number> = {
  flow: 0,
  emotion: 0,
  guest: 0,
  timing: 0,
  formal: 0,
};

function addAxes(base: Record<Axis, number>, add: Partial<Record<Axis, number>>, weight = 1) {
  const next = { ...base };
  (Object.keys(add) as Axis[]).forEach((k) => {
    next[k] = (next[k] ?? 0) + (add[k] ?? 0) * weight;
  });
  return next;
}

interface ShareState {
  briefingLabels: string[];
  scenarioLabels: string[];
  resultType: string;
  recommendedNames: string[];
}

function encodeShareState(s: ShareState): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify(s))));
}

function decodeShareState(encoded: string): ShareState | null {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(encoded))));
  } catch {
    return null;
  }
}

export default function McGame() {
  const [step, setStep] = useState<Step>("start");
  const [briefingIndex, setBriefingIndex] = useState(0);
  const [briefingSelections, setBriefingSelections] = useState<Record<string, number[]>>({});
  const [briefingAxes, setBriefingAxes] = useState<Record<Axis, number>>({ ...ZERO_AXES });

  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [scenarioChoiceIdx, setScenarioChoiceIdx] = useState<number | null>(null);
  const [scenarioChoiceLabels, setScenarioChoiceLabels] = useState<string[]>([]);
  const [scenarioAxes, setScenarioAxes] = useState<Record<Axis, number>>({ ...ZERO_AXES });
  const [gauges, setGauges] = useState({ flowGauge: 5, emotionGauge: 5, guestGauge: 5, timeGauge: 5 });

  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [sharedView, setSharedView] = useState<ShareState | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  // 공유 링크로 접속한 경우: 읽기 전용 결과 화면으로 바로 이동
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const r = params.get("r");
    if (r) {
      const decoded = decodeShareState(r);
      if (decoded) {
        setSharedView(decoded);
        trackGameEvent("shared_result_view");
      }
    } else {
      trackGameEvent("first_visit");
    }
  }, []);

  const currentQ = BRIEFING_QUESTIONS[briefingIndex];
  const currentBriefingSelections = briefingSelections[currentQ?.id] ?? [];
  const isOptionalQ = currentQ?.id === "avoid";
  const canGoNext = isOptionalQ || currentBriefingSelections.length > 0;

  const toggleBriefingOption = (qId: string, optIdx: number, maxSelect: number) => {
    setBriefingSelections((prev) => {
      const current = prev[qId] ?? [];
      let next: number[];
      if (current.includes(optIdx)) {
        next = current.filter((i) => i !== optIdx);
      } else if (current.length >= maxSelect) {
        next = maxSelect === 1 ? [optIdx] : [...current.slice(1), optIdx];
      } else {
        next = [...current, optIdx];
      }
      return { ...prev, [qId]: next };
    });
  };

  const goNextBriefing = () => {
    const q = BRIEFING_QUESTIONS[briefingIndex];
    const selected = briefingSelections[q.id] ?? [];
    let axes = briefingAxes;
    selected.forEach((idx) => {
      axes = addAxes(axes, q.options[idx].axisWeights);
    });
    setBriefingAxes(axes);
    trackGameEvent("briefing_question_answered", { question: q.id });

    if (briefingIndex < BRIEFING_QUESTIONS.length - 1) {
      setBriefingIndex(briefingIndex + 1);
    } else {
      trackGameEvent("briefing_completed");
      setStep("scenario-intro");
    }
  };

  const startScenarioSet = () => {
    trackGameEvent("scenario_started", { index: scenarioIndex });
    setStep("scenario");
  };

  const handleScenarioChoice = (idx: number) => {
    const scenario = SCENARIOS[scenarioIndex];
    setScenarioChoiceIdx(idx);
    const choice = scenario.choices[idx];
    setScenarioAxes((prev) => addAxes(prev, choice.axisWeights));
    setGauges((g) => ({
      flowGauge: g.flowGauge + choice.gaugeChange.flowGauge,
      emotionGauge: g.emotionGauge + choice.gaugeChange.emotionGauge,
      guestGauge: g.guestGauge + choice.gaugeChange.guestGauge,
      timeGauge: g.timeGauge + choice.gaugeChange.timeGauge,
    }));
    trackGameEvent("scenario_choice_selected", { scenario: scenario.title, choice: choice.label });
  };

  const goNextScenario = () => {
    setScenarioChoiceLabels((prev) => [
      ...prev,
      SCENARIOS[scenarioIndex].choices[scenarioChoiceIdx ?? 0].label,
    ]);
    setScenarioChoiceIdx(null);
    if (scenarioIndex < SCENARIOS.length - 1) {
      setScenarioIndex(scenarioIndex + 1);
    } else {
      trackGameEvent("all_scenarios_completed");
      setStep("result");
    }
  };

  // 최종 축 점수: 브리핑 60% + 게임선택 40%
  const finalAxes: Record<Axis, number> = useMemo(() => {
    const result = { ...ZERO_AXES };
    (Object.keys(result) as Axis[]).forEach((axis) => {
      result[axis] = briefingAxes[axis] * 0.6 + scenarioAxes[axis] * 0.4;
    });
    return result;
  }, [briefingAxes, scenarioAxes]);

  const topAxes = useMemo(() => {
    return (Object.keys(finalAxes) as Axis[])
      .filter((a) => finalAxes[a] > 0)
      .sort((a, b) => finalAxes[b] - finalAxes[a]);
  }, [finalAxes]);

  const resultType = useMemo(() => {
    const top2 = topAxes.slice(0, 2);
    const match = RESULT_TYPES.find((rt) => rt.axes.every((a) => top2.includes(a)));
    if (match) return match.title;
    const fallback = RESULT_TYPES.find((rt) => rt.axes.some((a) => topAxes.includes(a)));
    return fallback?.title ?? "우리 예식에 맞는 균형 잡힌 진행";
  }, [topAxes]);

  const recommended = useMemo(() => {
    const scored = GAME_MCS.map((mc) => {
      let score = 0;
      mc.strengths.forEach((axis) => {
        score += finalAxes[axis] ?? 0;
      });
      return { mc, score };
    });
    scored.sort((a, b) => b.score - a.score);

    const seenAxisSets = new Set<string>();
    const picked: typeof scored = [];
    for (const item of scored) {
      const key = [...item.mc.strengths].sort().join(",");
      if (picked.length < 3 && !seenAxisSets.has(key)) {
        picked.push(item);
        seenAxisSets.add(key);
      }
    }
    if (picked.length < 3) {
      for (const item of scored) {
        if (picked.length >= 3) break;
        if (!picked.includes(item)) picked.push(item);
      }
    }
    return picked.slice(0, 3);
  }, [finalAxes]);

  const briefingChoiceSummary = useMemo(() => {
    const lines: string[] = [];
    BRIEFING_QUESTIONS.forEach((q) => {
      const sel = briefingSelections[q.id] ?? [];
      sel.forEach((idx) => lines.push(q.options[idx].label));
    });
    return lines;
  }, [briefingSelections]);

  const summaryText = useMemo(() => {
    return `INUS MC CUE MATCH 체험 결과

예식 조건:
${briefingChoiceSummary.map((l) => `- ${l}`).join("\n")}

게임 중 선택:
${scenarioChoiceLabels.map((l) => `- ${l}`).join("\n")}

결과 유형: ${resultType}

추천 사회자: ${recommended.map((r) => r.mc.name).join(", ")}
`;
  }, [briefingChoiceSummary, scenarioChoiceLabels, resultType, recommended]);

  const copySummary = () => {
    navigator.clipboard.writeText(summaryText).then(() => {
      setCopied(true);
      trackGameEvent("result_summary_copied");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const copyShareLink = () => {
    const state: ShareState = {
      briefingLabels: briefingChoiceSummary,
      scenarioLabels: scenarioChoiceLabels,
      resultType,
      recommendedNames: recommended.map((r) => r.mc.name),
    };
    const encoded = encodeShareState(state);
    const url = `${window.location.origin}${window.location.pathname}?r=${encodeURIComponent(encoded)}`;
    navigator.clipboard.writeText(url).then(() => {
      setShareCopied(true);
      trackGameEvent("result_share_link_copied");
      setTimeout(() => setShareCopied(false), 2000);
    });
  };

  const saveResultImage = async () => {
    if (!resultRef.current) return;
    trackGameEvent("result_image_download");
    const canvas = await html2canvas(resultRef.current, { backgroundColor: "#0d0d0d", scale: 2 });
    const link = document.createElement("a");
    link.download = "inus-mc-cue-match-result.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const restart = () => {
    setStep("start");
    setBriefingIndex(0);
    setBriefingSelections({});
    setBriefingAxes({ ...ZERO_AXES });
    setScenarioIndex(0);
    setScenarioChoiceIdx(null);
    setScenarioChoiceLabels([]);
    setScenarioAxes({ ...ZERO_AXES });
    setGauges({ flowGauge: 5, emotionGauge: 5, guestGauge: 5, timeGauge: 5 });
  };

  return (
    <div className="min-h-screen" style={{ background: "#0d0d0d", fontFamily: "'Noto Sans KR', sans-serif" }}>
      <div className="w-full text-center py-2 text-[11px]" style={{ background: "#3a2f1c", color: GOLD }}>
        ⚠️ TEST ONLY — /mc-game 프로토타입, 실서비스 미반영
      </div>

      <div className="max-w-lg mx-auto px-4 py-8 sm:py-12">
        {sharedView ? (
          <SharedResultScreen state={sharedView} onPlay={() => { setSharedView(null); window.history.replaceState({}, "", window.location.pathname); }} />
        ) : (
          <>
            {step === "start" && <StartScreen onStart={() => { trackGameEvent("start_clicked"); setStep("briefing"); }} />}

            {step === "briefing" && currentQ && (
              <BriefingScreen
                question={currentQ}
                index={briefingIndex}
                total={BRIEFING_QUESTIONS.length}
                selected={currentBriefingSelections}
                onToggle={(idx) => toggleBriefingOption(currentQ.id, idx, currentQ.maxSelect)}
                onNext={goNextBriefing}
                onBack={() => (briefingIndex === 0 ? setStep("start") : setBriefingIndex(briefingIndex - 1))}
                canNext={canGoNext}
              />
            )}

            {step === "scenario-intro" && (
              <ScenarioIntroScreen gauges={gauges} onStart={startScenarioSet} />
            )}

            {step === "scenario" && (
              <ScenarioScreen
                scenarioIndex={scenarioIndex}
                total={SCENARIOS.length}
                choiceIdx={scenarioChoiceIdx}
                onChoose={handleScenarioChoice}
                onNext={goNextScenario}
              />
            )}

            {step === "result" && (
              <ResultScreen
                resultRef={resultRef}
                resultType={resultType}
                briefingChoiceSummary={briefingChoiceSummary}
                scenarioChoiceLabels={scenarioChoiceLabels}
                recommended={recommended.map((r) => r.mc)}
                onCopy={copySummary}
                copied={copied}
                onShare={copyShareLink}
                shareCopied={shareCopied}
                onSaveImage={saveResultImage}
                onRestart={restart}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ============================================================
// 화면 1: 시작 화면
// ============================================================
function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="text-center py-10">
      <div className="flex items-center justify-center gap-4 mb-8 opacity-70">
        <Mic size={22} style={{ color: GOLD }} />
        <Clock size={22} style={{ color: MINT }} />
        <Music size={22} style={{ color: GOLD }} />
        <Users size={22} style={{ color: MINT }} />
      </div>
      <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", color: GOLD }}>
        INUS MC CUE MATCH
      </p>
      <h1 className="text-white text-3xl sm:text-4xl font-bold mb-6" style={{ fontFamily: "'Noto Serif KR', serif" }}>
        내가 사회자라면?
      </h1>
      <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-1">결혼식 7분 전,</p>
      <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-8">
        이제부터 당신이 오늘 예식의 사회자입니다.
      </p>
      <button
        onClick={onStart}
        className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold transition-transform hover:scale-105"
        style={{ background: GOLD, color: "#0d0d0d" }}
      >
        사회자 체험 시작하기
        <ArrowRight size={16} />
      </button>
      <p className="text-white/30 text-xs mt-6">
        당신의 선택을 바탕으로 우리 예식에 잘 맞는 INUS 사회자를 찾아드립니다
      </p>
    </div>
  );
}

// ============================================================
// 화면 2: 예식 브리핑
// ============================================================
function BriefingScreen({
  question,
  index,
  total,
  selected,
  onToggle,
  onNext,
  onBack,
  canNext,
}: {
  question: (typeof BRIEFING_QUESTIONS)[number];
  index: number;
  total: number;
  selected: number[];
  onToggle: (idx: number) => void;
  onNext: () => void;
  onBack: () => void;
  canNext: boolean;
}) {
  return (
    <div>
      <button onClick={onBack} className="text-white/40 flex items-center gap-1 text-xs mb-6">
        <ChevronLeft size={14} /> 뒤로
      </button>
      <p className="text-xs mb-2" style={{ color: GOLD }}>
        {index + 1} / {total}
      </p>
      <div className="h-1 w-full rounded-full mb-8" style={{ background: "rgba(255,255,255,0.08)" }}>
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${((index + 1) / total) * 100}%`, background: `linear-gradient(90deg, ${GOLD}, ${MINT})` }}
        />
      </div>
      <h2 className="text-white text-lg sm:text-xl font-bold mb-6 leading-snug" style={{ fontFamily: "'Noto Serif KR', serif" }}>
        {question.question}
        {question.maxSelect > 1 && (
          <span className="text-white/30 text-sm font-normal ml-2">(최대 {question.maxSelect}개)</span>
        )}
      </h2>
      <div className="space-y-3 mb-8">
        {question.options.map((opt, idx) => {
          const isSelected = selected.includes(idx);
          return (
            <button
              key={idx}
              onClick={() => onToggle(idx)}
              className="w-full text-left px-5 py-4 rounded-lg text-sm transition-all duration-200"
              style={{
                background: isSelected ? "rgba(212,184,150,0.12)" : "rgba(255,255,255,0.03)",
                border: isSelected ? `1.5px solid ${GOLD}` : "1px solid rgba(255,255,255,0.08)",
                color: isSelected ? GOLD : "rgba(255,255,255,0.8)",
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      <button
        onClick={onNext}
        disabled={!canNext}
        className="w-full py-4 rounded-full text-sm font-semibold transition-opacity"
        style={{
          background: canNext ? GOLD : "rgba(212,184,150,0.25)",
          color: canNext ? "#0d0d0d" : "rgba(0,0,0,0.4)",
          cursor: canNext ? "pointer" : "not-allowed",
        }}
      >
        다음
      </button>
    </div>
  );
}

// ============================================================
// 화면 3: 가상 사회자 시작 (게이지 소개)
// ============================================================
function ScenarioIntroScreen({
  gauges,
  onStart,
}: {
  gauges: { flowGauge: number; emotionGauge: number; guestGauge: number; timeGauge: number };
  onStart: () => void;
}) {
  const items = [
    { label: "예식 흐름", value: gauges.flowGauge },
    { label: "감정선", value: gauges.emotionGauge },
    { label: "하객 몰입", value: gauges.guestGauge },
    { label: "남은 시간", value: gauges.timeGauge },
  ];
  return (
    <div className="text-center">
      <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: GOLD }}>
        SCENE 01-03
      </p>
      <h2 className="text-white text-xl sm:text-2xl font-bold mb-6" style={{ fontFamily: "'Noto Serif KR', serif" }}>
        이제부터 당신이
        <br />
        오늘 예식의 사회자입니다
      </h2>
      <p className="text-white/50 text-sm mb-10 leading-relaxed">
        신랑신부가 선택한 분위기와 기준을 지키면서
        <br />
        예식의 흐름을 진행해주세요 (총 3개 상황)
      </p>

      <div className="space-y-4 mb-10 text-left">
        {items.map((it) => (
          <div key={it.label}>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-white/50">{it.label}</span>
            </div>
            <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(0, Math.min(100, it.value * 10))}%`, background: MINT }}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onStart}
        className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold"
        style={{ background: GOLD, color: "#0d0d0d" }}
      >
        예식 진행 시작 <ArrowRight size={16} />
      </button>
    </div>
  );
}

// ============================================================
// 화면 4: 상황 1~3 (순차 진행)
// ============================================================
function ScenarioScreen({
  scenarioIndex,
  total,
  choiceIdx,
  onChoose,
  onNext,
}: {
  scenarioIndex: number;
  total: number;
  choiceIdx: number | null;
  onChoose: (idx: number) => void;
  onNext: () => void;
}) {
  const scenario = SCENARIOS[scenarioIndex];
  return (
    <div>
      <p className="text-xs mb-2" style={{ color: GOLD }}>
        상황 {scenarioIndex + 1} / {total}
      </p>
      <div className="h-1 w-full rounded-full mb-6" style={{ background: "rgba(255,255,255,0.08)" }}>
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${((scenarioIndex + 1) / total) * 100}%`, background: `linear-gradient(90deg, ${GOLD}, ${MINT})` }}
        />
      </div>
      <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: GOLD }}>
        {scenario.title.toUpperCase()}
      </p>
      <div
        className="p-5 rounded-lg mb-6 whitespace-pre-line text-white/80 text-sm leading-relaxed"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,184,150,0.15)" }}
      >
        {scenario.situation}
      </div>

      <div className="space-y-3 mb-6">
        {scenario.choices.map((choice, idx) => {
          const isSelected = choiceIdx === idx;
          return (
            <div key={idx}>
              <button
                onClick={() => onChoose(idx)}
                disabled={choiceIdx !== null}
                className="w-full text-left px-5 py-4 rounded-lg text-sm transition-all duration-200"
                style={{
                  background: isSelected ? "rgba(212,184,150,0.12)" : "rgba(255,255,255,0.03)",
                  border: isSelected ? `1.5px solid ${GOLD}` : "1px solid rgba(255,255,255,0.08)",
                  color: isSelected ? GOLD : "rgba(255,255,255,0.8)",
                  opacity: choiceIdx !== null && !isSelected ? 0.35 : 1,
                }}
              >
                {String.fromCharCode(65 + idx)}. {choice.label}
              </button>
              {isSelected && (
                <div
                  className="mt-2 px-4 py-3 text-xs text-white/60 leading-relaxed rounded-md"
                  style={{ background: "rgba(91,181,162,0.08)", border: "1px solid rgba(91,181,162,0.25)" }}
                >
                  {choice.resultText}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {choiceIdx !== null && (
        <button onClick={onNext} className="w-full py-4 rounded-full text-sm font-semibold" style={{ background: GOLD, color: "#0d0d0d" }}>
          {scenarioIndex < total - 1 ? "다음 상황으로" : "결과 확인하기"}
        </button>
      )}
    </div>
  );
}

// ============================================================
// 화면 5: 결과 화면
// ============================================================
function ResultScreen({
  resultRef,
  resultType,
  briefingChoiceSummary,
  scenarioChoiceLabels,
  recommended,
  onCopy,
  copied,
  onShare,
  shareCopied,
  onSaveImage,
  onRestart,
}: {
  resultRef: React.RefObject<HTMLDivElement>;
  resultType: string;
  briefingChoiceSummary: string[];
  scenarioChoiceLabels: string[];
  recommended: GameMc[];
  onCopy: () => void;
  copied: boolean;
  onShare: () => void;
  shareCopied: boolean;
  onSaveImage: () => void;
  onRestart: () => void;
}) {
  return (
    <div>
      <div ref={resultRef} className="p-1">
        <p className="text-xs tracking-[0.3em] uppercase mb-3 text-center" style={{ color: GOLD }}>
          RESULT
        </p>
        <h2 className="text-white text-lg sm:text-xl font-bold mb-2 text-center leading-snug" style={{ fontFamily: "'Noto Serif KR', serif" }}>
          두 분이 원하는 진행 방식은
          <br />
          <span style={{ color: GOLD }}>'{resultType}'</span>입니다
        </h2>

        <div
          className="p-5 rounded-lg my-6 text-white/60 text-xs sm:text-sm leading-relaxed"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-white/40 mb-2">두 분이 선택한 조건</p>
          <ul className="space-y-1 mb-3">
            {briefingChoiceSummary.map((l, i) => (
              <li key={i}>· {l}</li>
            ))}
          </ul>
          <p className="text-white/40 mb-1">게임 중 선택</p>
          <ul className="space-y-1">
            {scenarioChoiceLabels.map((l, i) => (
              <li key={i}>· {l}</li>
            ))}
          </ul>
        </div>

        <p className="text-white/40 text-xs mb-4 text-center">
          아래 사회자님들의 진행 강점이 두 분의 선택과 잘 맞아 추천되었습니다
        </p>

        <div className="space-y-4 mb-8">
          {recommended.map((mc, i) => (
            <div
              key={mc.name}
              className="rounded-lg overflow-hidden"
              style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${i === 0 ? GOLD : "rgba(255,255,255,0.1)"}` }}
            >
              <div className="flex gap-3 p-4">
                <img
                  src={mc.image}
                  alt={mc.name}
                  className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                  style={{ border: `1px solid ${GOLD}` }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{ background: i === 0 ? GOLD : "rgba(255,255,255,0.1)", color: i === 0 ? "#0d0d0d" : "rgba(255,255,255,0.5)" }}
                    >
                      {i === 0 ? "1순위" : i === 1 ? "2순위" : "3순위"}
                    </span>
                    <h3 className="text-white font-bold text-sm">{mc.name} 사회자</h3>
                  </div>
                  <p className="text-white/40 text-xs mb-2">{mc.fitDescription}</p>
                  <ul className="space-y-0.5">
                    {mc.strengths.map((axis) => (
                      <li key={axis} className="text-white/60 text-xs">
                        ✓ {mc.matchReasons[axis]}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="flex gap-2 px-4 pb-4">
                <a
                  href={mc.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-2 rounded-md text-xs font-medium"
                  style={{ background: "rgba(212,184,150,0.1)", border: "1px solid rgba(212,184,150,0.3)", color: GOLD }}
                >
                  프로필 보기
                </a>
                {mc.youtubeId && (
                  <a
                    href={`https://www.youtube.com/watch?v=${mc.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-2 rounded-md text-xs font-medium flex items-center justify-center gap-1"
                    style={{ background: "rgba(91,181,162,0.1)", border: "1px solid rgba(91,181,162,0.3)", color: MINT }}
                  >
                    본식 영상 <ExternalLink size={11} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <button
            onClick={onCopy}
            className="flex-1 py-3 rounded-full text-xs font-medium flex items-center justify-center gap-1.5"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "white" }}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? "복사 완료" : "결과 복사"}
          </button>
          <button
            onClick={onShare}
            className="flex-1 py-3 rounded-full text-xs font-medium flex items-center justify-center gap-1.5"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "white" }}
          >
            {shareCopied ? <Check size={13} /> : <Share2 size={13} />}
            {shareCopied ? "링크 복사됨" : "결과 공유"}
          </button>
          <button
            onClick={onSaveImage}
            className="flex-1 py-3 rounded-full text-xs font-medium flex items-center justify-center gap-1.5"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "white" }}
          >
            <Download size={13} />
            이미지 저장
          </button>
        </div>
        <a
          href="https://pf.kakao.com/_wxovaM/chat"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackGameEvent("consult_button_clicked")}
          className="w-full py-3.5 rounded-full text-sm font-semibold flex items-center justify-center gap-2"
          style={{ background: MINT, color: "#0d0d0d" }}
        >
          💬 이 결과로 카카오 상담하기
        </a>
        <button onClick={onRestart} className="w-full py-2 text-white/30 text-xs">
          다시 체험하기
        </button>
      </div>
    </div>
  );
}

// ============================================================
// 공유 링크로 접속 시: 읽기 전용 결과 화면
// ============================================================
function SharedResultScreen({ state, onPlay }: { state: ShareState; onPlay: () => void }) {
  const mcs = state.recommendedNames
    .map((name) => GAME_MCS.find((m) => m.name === name))
    .filter(Boolean) as GameMc[];

  return (
    <div>
      <p className="text-xs tracking-[0.3em] uppercase mb-3 text-center" style={{ color: GOLD }}>
        SHARED RESULT
      </p>
      <h2 className="text-white text-lg sm:text-xl font-bold mb-6 text-center leading-snug" style={{ fontFamily: "'Noto Serif KR', serif" }}>
        누군가 선택한 진행 방식은
        <br />
        <span style={{ color: GOLD }}>'{state.resultType}'</span>입니다
      </h2>

      <div className="space-y-3 mb-8">
        {mcs.map((mc, i) => (
          <div key={mc.name} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <img src={mc.image} alt={mc.name} className="w-12 h-12 rounded-full object-cover" style={{ border: `1px solid ${GOLD}` }} />
            <div>
              <span className="text-[10px]" style={{ color: GOLD }}>{i === 0 ? "1순위" : i === 1 ? "2순위" : "3순위"}</span>
              <p className="text-white text-sm font-bold">{mc.name} 사회자</p>
            </div>
          </div>
        ))}
      </div>

      <button onClick={onPlay} className="w-full py-4 rounded-full text-sm font-semibold" style={{ background: GOLD, color: "#0d0d0d" }}>
        나도 체험해보기
      </button>
    </div>
  );
}
