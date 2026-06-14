/**
 * McMatchModal - 내 결혼식에 어울리는 사회자 추천
 * 3단계 질문 → 스타일 매칭 → 사회자 추천
 */
import { useEffect, useState } from "react";
import { X, ChevronRight, RotateCcw, ExternalLink } from "lucide-react";

const MCS = [
  {
    name: "김민수",
    tier: "BEST",
    desc: "5년+ 경력",
    image: "/images/mc-profile-1_33531819.jpg",
    highlight: "안정적인 진행력과 맞춤 대본으로 예식의 전체 흐름을 설계합니다.",
    profileUrl: "https://blog.naver.com/inusmusics/223996383838",
    styles: ["품격형", "아나운서형"],
    profileKey: "김민수",
  },
  {
    name: "고승범",
    tier: "BEST",
    desc: "5년+ 경력",
    image: "/images/mc-profile-4_a9e52880.jpg",
    highlight: "자연스럽고 세련된 진행 스타일이 특징입니다.",
    profileUrl: "https://blog.naver.com/inusmusics/223235771542",
    styles: ["품격형", "아나운서형"],
    profileKey: "고승범",
  },
  {
    name: "이도영",
    tier: "BEST",
    desc: "4년+ 경력",
    image: "/images/mc-profile-2_f194877b.jpg",
    highlight: "따뜻하고 안정적인 진행으로 신랑신부님의 이야기를 감동적으로 전달합니다.",
    profileUrl: "https://blog.naver.com/inusmusics/223845891681",
    styles: ["품격형", "밝은형", "감동형"],
    profileKey: "이도영",
  },
  {
    name: "석재선",
    tier: "BEST",
    desc: "5년+ 경력",
    image: "/images/mc-profile-3_33ff7a32.jpg",
    highlight: "차분하면서도 격식 있는 진행으로 품격 있는 예식을 만들어드립니다.",
    profileUrl: "https://blog.naver.com/inusmusics/223822182933",
    styles: ["품격형", "감동형"],
    profileKey: "석재선",
  },
  {
    name: "이우영",
    tier: "PREMIUM",
    desc: "10년+ 경력",
    image: "/images/mc-lee-wooyoung-new_fa27e84d.webp",
    highlight: "편안한 아나운서 톤과 안정적인 진행력으로 위트 있고 깔끔한 예식을 완성합니다.",
    profileUrl: "/profile-wooyoung.html",
    styles: ["품격형", "밝은형", "감동형", "아나운서형"],
    profileKey: "이우영",
  },
  {
    name: "김선혁",
    tier: "BEST",
    desc: "5년+ 경력",
    image: "/images/host_sunhyuk_1ed704ab.jpg",
    highlight: "깔끔하고 안정감 있는 진행력과 탁월한 상황 대처 능력을 갖춘 사회자입니다.",
    profileUrl: "https://blog.naver.com/inusmusics/221025505211",
    styles: ["품격형", "아나운서형"],
    profileKey: "김선혁",
  },
  {
    name: "장윤태",
    tier: "PREMIUM",
    desc: "10년+ 경력",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663604364385/YIRjIXsBhCqAiMgE.jpg",
    highlight: "안정적인 진행력과 젠틀한 진행으로 예식의 완성도를 높입니다.",
    profileUrl: "https://blog.naver.com/inusmusics/223246261228",
    styles: ["품격형", "감동형"],
    profileKey: "장윤태",
  },
  {
    name: "길상우",
    tier: "BEST",
    desc: "5년+ 경력",
    image: "https://storage.googleapis.com/runable-templates/cli-uploads%2FeblzJGDjOG2vKrak7NizAO4MJKnCG921%2FPcvLRqLzT-JnfPrulzmCo%2Fmc-gilsangwoo.jpg",
    highlight: "센스와 위트를 겸비한 진행력이 강점인 사회자입니다.",
    profileUrl: "https://blog.naver.com/inusmusics/220802942529",
    styles: ["품격형", "밝은형"],
    profileKey: "길상우",
  },
];

const QUESTIONS = [
  {
    id: "venue",
    question: "어떤 예식장에서 결혼하세요?",
    sub: "예식 공간의 분위기에 맞는 사회자를 찾아드릴게요",
    options: [
      { label: "호텔 / 채플", value: "A" },
      { label: "고급 웨딩홀", value: "B" },
      { label: "일반 웨딩홀", value: "C" },
    ],
  },
  {
    id: "guests",
    question: "하객이 몇 분 정도 오세요?",
    sub: "예식 규모에 따라 진행 스타일이 달라져요",
    options: [
      { label: "100명 이하 소규모", value: "A" },
      { label: "100~200명", value: "B" },
      { label: "200명 이상 대규모", value: "C" },
    ],
  },
  {
    id: "mood",
    question: "어떤 분위기의 예식을 원하세요?",
    sub: "신랑신부님이 그리는 결혼식 감성을 알려주세요",
    options: [
      { label: "품격 있고 격식 있게", value: "A" },
      { label: "따뜻하고 감동적으로", value: "B" },
      { label: "밝고 화기애애하게", value: "C" },
    ],
  },
];

// 조합 키: 예식장(A호텔/B고급홀/C일반홀) - 하객수(A소규모/B중간/C대규모) - 분위기(A품격/B감동/C밝음)
// 8명 전원이 1위로 고르게 나오도록 수동 배분
const MATCH_TABLE: Record<string, { names: string[]; reason: string }> = {
  "A-A-A": { names: ["이우영", "고승범", "석재선"], reason: "호텔 소규모 예식에서 품격 있는 아나운서형 진행이 잘 어울립니다." },
  "A-A-B": { names: ["석재선", "이도영", "이우영"], reason: "소규모 채플 예식에서 차분하고 감동적인 진행이 빛을 발합니다." },
  "A-A-C": { names: ["길상우", "이도영", "고승범"], reason: "호텔 소규모라도 밝고 유쾌한 분위기를 원하신다면 위트 있는 진행이 포인트입니다." },
  "A-B-A": { names: ["고승범", "이우영", "김민수"], reason: "호텔 예식의 세련된 분위기에 맞는 안정적이고 품격 있는 진행을 추천드립니다." },
  "A-B-B": { names: ["이도영", "석재선", "장윤태"], reason: "중간 규모 호텔 예식에서 신랑신부의 이야기를 따뜻하게 전달하는 사회자입니다." },
  "A-B-C": { names: ["길상우", "이도영", "고승범"], reason: "호텔 예식이지만 하객들과 함께 즐기는 화기애애한 분위기를 만들어드립니다." },
  "A-C-A": { names: ["장윤태", "이우영", "김선혁"], reason: "대규모 호텔 예식에서 흔들림 없는 안정적 진행력이 가장 중요합니다." },
  "A-C-B": { names: ["이도영", "장윤태", "석재선"], reason: "많은 하객 앞에서도 신랑신부의 감동을 놓치지 않는 진행을 추천드립니다." },
  "A-C-C": { names: ["김선혁", "길상우", "장윤태"], reason: "대형 호텔 예식에서 넓은 공간을 장악하며 활기차게 이끌어가는 사회자입니다." },

  "B-A-A": { names: ["김민수", "고승범", "석재선"], reason: "고급 웨딩홀 소규모 예식에서 맞춤 대본으로 품격 있는 진행을 완성합니다." },
  "B-A-B": { names: ["이도영", "김민수", "석재선"], reason: "소규모이기에 더 따뜻하고 밀도 있는 감동을 전달할 수 있는 사회자입니다." },
  "B-A-C": { names: ["길상우", "김민수", "이도영"], reason: "소규모 웨딩홀에서 하객과 가까이 호흡하며 유쾌한 분위기를 만듭니다." },
  "B-B-A": { names: ["장윤태", "고승범", "김민수"], reason: "고급 웨딩홀의 격식에 젠틀하고 안정적인 진행이 잘 맞습니다." },
  "B-B-B": { names: ["이도영", "장윤태", "석재선"], reason: "중간 규모 고급홀에서 신랑신부 이야기를 중심으로 감동을 쌓아가는 진행입니다." },
  "B-B-C": { names: ["길상우", "이도영", "김선혁"], reason: "고급 웨딩홀에서도 하객들이 적극 참여하는 활기찬 예식을 원하시는 분께 추천드립니다." },
  "B-C-A": { names: ["김선혁", "장윤태", "이우영"], reason: "대규모 고급홀에서 탁월한 상황 대처와 안정적 진행력이 필요합니다." },
  "B-C-B": { names: ["장윤태", "이도영", "김선혁"], reason: "많은 하객 앞에서도 감동의 흐름을 유지하는 검증된 진행을 추천드립니다." },
  "B-C-C": { names: ["김선혁", "길상우", "장윤태"], reason: "대규모 고급홀에서 넓은 공간을 장악하며 하객 참여를 이끌어내는 사회자입니다." },

  "C-A-A": { names: ["고승범", "김민수", "석재선"], reason: "일반 웨딩홀 소규모 예식에서 깔끔하고 세련된 품격 진행을 원하시는 분께 맞습니다." },
  "C-A-B": { names: ["이도영", "고승범", "길상우"], reason: "친밀한 분위기의 소규모 예식에서 따뜻한 이야기 중심으로 감동을 전달합니다." },
  "C-A-C": { names: ["길상우", "김민수", "이도영"], reason: "소규모 예식에서 하객 한 분 한 분과 교감하며 즐거운 분위기를 만드는 사회자입니다." },
  "C-B-A": { names: ["김민수", "석재선", "고승범"], reason: "일반 웨딩홀에서도 격식 있고 완성도 높은 예식을 원하신다면 이 사회자가 딱입니다." },
  "C-B-B": { names: ["이도영", "길상우", "김민수"], reason: "중간 규모 웨딩홀에서 신랑신부의 스토리를 따뜻하게 풀어내는 진행입니다." },
  "C-B-C": { names: ["길상우", "이도영", "김선혁"], reason: "일반 웨딩홀에서 하객들이 함께 즐기는 활기찬 분위기를 만들어드립니다." },
  "C-C-A": { names: ["김선혁", "김민수", "고승범"], reason: "대규모 일반 웨딩홀에서 안정적이고 흔들림 없는 품격 진행이 강점입니다." },
  "C-C-B": { names: ["이도영", "김선혁", "길상우"], reason: "많은 하객 앞에서도 감동의 순간을 놓치지 않는 진행력을 추천드립니다." },
  "C-C-C": { names: ["길상우", "김선혁", "이도영"], reason: "대규모 예식에서 넓은 공간을 가득 채우는 유쾌하고 활기찬 진행입니다." },
};

function calcRecommendations(answers: Answer[]): { mcs: typeof MCS; reason: string } {
  const key = answers.map((a) => a.value).join("-");
  const entry = MATCH_TABLE[key] ?? { names: ["이도영", "길상우", "김민수"], reason: "답변을 바탕으로 가장 잘 어울리는 사회자를 추천드립니다." };
  const mcs = entry.names
    .map((name) => MCS.find((mc) => mc.name === name))
    .filter(Boolean) as typeof MCS;
  return { mcs, reason: entry.reason };
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenProfile: (key: string) => void;
}

export default function McMatchModal({ isOpen, onClose, onOpenProfile }: Props) {
  const [step, setStep] = useState(0); // 0~2: 질문, 3: 결과
  const [answers, setAnswers] = useState<{ value: string }[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);
  const [results, setResults] = useState<typeof MCS>([]);
  const [reason, setReason] = useState("");
  const [resultVisible, setResultVisible] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(0);
        setAnswers([]);
        setSelected(null);
        setResults([]);
        setReason("");
        setResultVisible(false);
      }, 300);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
      window.addEventListener("keydown", handleKey);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKey);
      };
    }
  }, [isOpen, onClose]);

  const handleSelect = (optionIndex: number) => {
    setSelected(optionIndex);
  };

  const handleNext = () => {
    if (selected === null) return;
    const q = QUESTIONS[step];
    const ans = q.options[selected];
    const newAnswers = [...answers, { value: ans.value }];

    setAnimating(true);
    setTimeout(() => {
      setAnswers(newAnswers);
      setSelected(null);

      if (step < QUESTIONS.length - 1) {
        setStep(step + 1);
        setAnimating(false);
      } else {
        // 결과 계산
        const { mcs: recs, reason: rec } = calcRecommendations(newAnswers);
        setResults(recs);
        setReason(rec);
        setStep(3);
        setAnimating(false);
        setTimeout(() => setResultVisible(true), 100);
      }
    }, 280);
  };

  const handleReset = () => {
    setResultVisible(false);
    setTimeout(() => {
      setStep(0);
      setAnswers([]);
      setSelected(null);
      setResults([]);
      setReason("");
    }, 200);
  };

  if (!isOpen) return null;

  const progress = step >= 3 ? 100 : Math.round((step / QUESTIONS.length) * 100);

  return (
    <div
      className="fixed inset-0 z-[250] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(10px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #141414 0%, #0d0d0d 100%)",
          border: "1px solid rgba(214,177,107,0.2)",
          borderRadius: "12px",
          animation: "fadeInUp 0.35s cubic-bezier(0.23,1,0.32,1)",
          maxHeight: "92vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid rgba(214,177,107,0.12)" }}
        >
          <div>
            <p
              className="text-[10px] tracking-[0.3em] uppercase"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: "#d6b16b" }}
            >
              MC MATCHING
            </p>
            <h3
              className="text-white text-base font-bold mt-0.5"
              style={{ fontFamily: "'Noto Serif KR', serif" }}
            >
              내 결혼식에 어울리는 사회자 찾기
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-white/50 hover:text-white transition-colors"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            <X size={15} />
          </button>
        </div>

        {/* 프로그레스 바 */}
        <div className="h-0.5 w-full" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #d6b16b, #5BB5A2)",
            }}
          />
        </div>

        {/* 질문 영역 */}
        {step < 3 && (
          <div
            className="px-6 py-8"
            style={{
              opacity: animating ? 0 : 1,
              transform: animating ? "translateY(8px)" : "translateY(0)",
              transition: "opacity 0.28s, transform 0.28s",
            }}
          >
            {/* 단계 표시 */}
            <p
              className="text-xs mb-3"
              style={{ fontFamily: "'Noto Sans KR', sans-serif", color: "rgba(214,177,107,0.6)", letterSpacing: "0.1em" }}
            >
              {step + 1} / {QUESTIONS.length}
            </p>

            <h4
              className="text-white text-lg font-bold mb-2"
              style={{ fontFamily: "'Noto Serif KR', serif", lineHeight: 1.5 }}
            >
              {QUESTIONS[step].question}
            </h4>
            <p
              className="text-white/40 text-sm mb-7"
              style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
            >
              {QUESTIONS[step].sub}
            </p>

            {/* 선택지 */}
            <div className="flex flex-col gap-3">
              {QUESTIONS[step].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className="flex items-center gap-4 w-full px-5 py-4 text-left transition-all duration-200"
                  style={{
                    background: selected === i
                      ? "linear-gradient(135deg, rgba(214,177,107,0.18) 0%, rgba(91,181,162,0.10) 100%)"
                      : "rgba(255,255,255,0.03)",
                    border: selected === i
                      ? "1px solid rgba(214,177,107,0.6)"
                      : "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "8px",
                    transform: selected === i ? "translateX(4px)" : "translateX(0)",
                  }}
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200"
                    style={{
                      border: selected === i ? "2px solid #d6b16b" : "2px solid rgba(255,255,255,0.2)",
                      background: selected === i ? "rgba(214,177,107,0.2)" : "transparent",
                    }}
                  >
                    {selected === i && (
                      <div className="w-2 h-2 rounded-full" style={{ background: "#d6b16b" }} />
                    )}
                  </div>
                  <span
                    className="text-sm font-medium"
                    style={{
                      fontFamily: "'Noto Sans KR', sans-serif",
                      color: selected === i ? "#fff" : "rgba(255,255,255,0.65)",
                    }}
                  >
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>

            {/* 다음 버튼 */}
            <button
              onClick={handleNext}
              disabled={selected === null}
              className="w-full mt-6 py-4 flex items-center justify-center gap-2 font-semibold transition-all duration-300"
              style={{
                fontFamily: "'Noto Sans KR', sans-serif",
                fontSize: "14px",
                letterSpacing: "0.05em",
                background: selected !== null
                  ? "linear-gradient(135deg, #d6b16b 0%, #c9a55a 100%)"
                  : "rgba(255,255,255,0.05)",
                color: selected !== null ? "#0d0d0d" : "rgba(255,255,255,0.2)",
                borderRadius: "8px",
                border: "none",
                cursor: selected !== null ? "pointer" : "not-allowed",
                boxShadow: selected !== null ? "0 4px 20px rgba(214,177,107,0.3)" : "none",
              }}
            >
              {step < QUESTIONS.length - 1 ? "다음" : "결과 보기"}
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* 결과 영역 */}
        {step === 3 && (
          <div
            className="px-6 py-8"
            style={{
              opacity: resultVisible ? 1 : 0,
              transform: resultVisible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.4s, transform 0.4s",
            }}
          >
            <div className="text-center mb-6">
              <p
                className="text-[10px] tracking-[0.3em] uppercase mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: "#d6b16b" }}
              >
                RESULT
              </p>
              <h4
                className="text-white text-xl font-bold"
                style={{ fontFamily: "'Noto Serif KR', serif" }}
              >
                이런 사회자가 잘 맞을 것 같아요
              </h4>
              {reason && (
                <p
                  className="mt-3 mx-auto text-sm leading-relaxed px-4 py-3 rounded-lg"
                  style={{
                    fontFamily: "'Noto Sans KR', sans-serif",
                    color: "rgba(214,177,107,0.9)",
                    background: "rgba(214,177,107,0.08)",
                    border: "1px solid rgba(214,177,107,0.2)",
                    maxWidth: "360px",
                  }}
                >
                  {reason}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {results.map((mc, i) => (
                <div
                  key={mc.name}
                  className="flex items-center gap-4 p-4 rounded-lg"
                  style={{
                    background: i === 0
                      ? "linear-gradient(135deg, rgba(214,177,107,0.12) 0%, rgba(91,181,162,0.06) 100%)"
                      : "rgba(255,255,255,0.03)",
                    border: i === 0
                      ? "1px solid rgba(214,177,107,0.4)"
                      : "1px solid rgba(255,255,255,0.07)",
                    animation: `fadeInUp ${0.3 + i * 0.12}s cubic-bezier(0.23,1,0.32,1) both`,
                  }}
                >
                  {/* 순위 */}
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                    style={{
                      background: i === 0
                        ? "linear-gradient(135deg, #d6b16b, #c9a55a)"
                        : "rgba(255,255,255,0.08)",
                      color: i === 0 ? "#0d0d0d" : "rgba(255,255,255,0.4)",
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "13px",
                    }}
                  >
                    {i + 1}
                  </div>

                  {/* 프로필 이미지 */}
                  <div
                    className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0"
                    style={{ border: i === 0 ? "2px solid rgba(214,177,107,0.5)" : "2px solid rgba(255,255,255,0.1)" }}
                  >
                    <img src={mc.image} alt={mc.name} className="w-full h-full object-cover object-top" />
                  </div>

                  {/* 정보 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className="text-white font-bold"
                        style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "15px" }}
                      >
                        {mc.name}
                      </span>
                      {mc.tier === "PREMIUM" && (
                        <span
                          className="text-[9px] px-1.5 py-0.5 tracking-widest"
                          style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            background: "linear-gradient(135deg, rgba(212,184,150,0.9), rgba(190,155,110,0.9))",
                            color: "#1a1a1a",
                            fontWeight: 700,
                          }}
                        >
                          PREMIUM
                        </span>
                      )}
                    </div>
                    <p
                      className="text-white/40 text-xs truncate"
                      style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
                    >
                      {mc.highlight}
                    </p>
                  </div>

                  {/* 프로필 버튼 */}
                  <button
                    onClick={() => { onClose(); onOpenProfile(mc.profileKey); }}
                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110"
                    style={{
                      background: "rgba(214,177,107,0.12)",
                      border: "1px solid rgba(214,177,107,0.3)",
                      color: "#d6b16b",
                    }}
                  >
                    <ExternalLink size={13} />
                  </button>
                </div>
              ))}
            </div>

            {/* 하단 버튼들 */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-2 flex-1 py-3 rounded-lg text-sm transition-all duration-200 hover:opacity-80"
                style={{
                  fontFamily: "'Noto Sans KR', sans-serif",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                <RotateCcw size={13} />
                다시 하기
              </button>
              <a
                href="https://pf.kakao.com/_wxovaM/chat"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 flex-1 py-3 rounded-lg text-sm font-semibold transition-all duration-200 hover:opacity-90"
                style={{
                  fontFamily: "'Noto Sans KR', sans-serif",
                  background: "#5BB5A2",
                  color: "#fff",
                }}
              >
                💬 카카오 상담하기
              </a>
            </div>
          </div>
        )}

        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </div>
  );
}
