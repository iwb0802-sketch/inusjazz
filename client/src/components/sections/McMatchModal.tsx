/**
 * McMatchModal - 내 결혼식에 어울리는 사회자 추천
 * 5단계 질문 → 스타일 매칭 → 사회자 추천
 */
import { useEffect, useRef, useState } from "react";
import { X, ChevronRight, RotateCcw, ExternalLink, Copy, Instagram } from "lucide-react";
import html2canvas from "html2canvas";

const MCS = [
  {
    name: "김민수",
    tier: "BEST",
    desc: "5년+ 경력",
    image: "/images/mc-profile-1_33531819.jpg",
    highlight: "안정적인 진행력과 맞춤 대본으로 예식의 전체 흐름을 설계합니다.",
    profileUrl: "https://blog.naver.com/inusmusics/223996383838",
    // 태그: 품격, 야외/하우스 적응력, 합리적예산, 깔끔한진행
    tags: ["품격", "깔끔", "중간규모", "합리적", "프리미엄"],
    profileKey: "김민수",
  },
  {
    name: "고승범",
    tier: "BEST",
    desc: "5년+ 경력",
    image: "/images/mc-profile-4_a9e52880.jpg",
    highlight: "자연스럽고 세련된 진행 스타일이 특징입니다.",
    profileUrl: "https://blog.naver.com/inusmusics/223235771542",
    tags: ["품격", "깔끔", "소규모", "합리적", "중간예산"],
    profileKey: "고승범",
  },
  {
    name: "이도영",
    tier: "BEST",
    desc: "4년+ 경력",
    image: "/images/mc-profile-2_f194877b.jpg",
    highlight: "따뜻하고 안정적인 진행으로 신랑신부님의 이야기를 감동적으로 전달합니다.",
    profileUrl: "https://blog.naver.com/inusmusics/223845891681",
    tags: ["감동", "웃음", "전규모", "합리적", "중간예산", "야외"],
    profileKey: "이도영",
  },
  {
    name: "석재선",
    tier: "BEST",
    desc: "5년+ 경력",
    image: "/images/mc-profile-3_33ff7a32.jpg",
    highlight: "차분하면서도 격식 있는 진행으로 품격 있는 예식을 만들어드립니다.",
    profileUrl: "https://blog.naver.com/inusmusics/223822182933",
    tags: ["품격", "감동", "깔끔", "소규모", "중간규모", "합리적", "중간예산"],
    profileKey: "석재선",
  },
  {
    name: "이우영",
    tier: "PREMIUM",
    desc: "10년+ 경력",
    image: "/images/mc-lee-wooyoung-new_fa27e84d.webp",
    highlight: "편안한 아나운서 톤과 안정적인 진행력으로 위트 있고 깔끔한 예식을 완성합니다.",
    profileUrl: "/profile-wooyoung.html",
    tags: ["품격", "깔끔", "감동", "전규모", "프리미엄", "중간예산"],
    profileKey: "이우영",
  },
  {
    name: "김선혁",
    tier: "BEST",
    desc: "5년+ 경력",
    image: "/images/host_sunhyuk_1ed704ab.jpg",
    highlight: "깔끔하고 안정감 있는 진행력과 탁월한 상황 대처 능력을 갖춘 사회자입니다.",
    profileUrl: "https://blog.naver.com/inusmusics/221025505211",
    tags: ["깔끔", "품격", "대규모", "중간예산", "프리미엄"],
    profileKey: "김선혁",
  },
  {
    name: "장윤태",
    tier: "PREMIUM",
    desc: "10년+ 경력",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663604364385/YIRjIXsBhCqAiMgE.jpg",
    highlight: "안정적인 진행력과 젠틀한 진행으로 예식의 완성도를 높입니다.",
    profileUrl: "https://blog.naver.com/inusmusics/223246261228",
    tags: ["품격", "감동", "대규모", "중간규모", "프리미엄"],
    profileKey: "장윤태",
  },
  {
    name: "길상우",
    tier: "BEST",
    desc: "5년+ 경력",
    image: "https://storage.googleapis.com/runable-templates/cli-uploads%2FeblzJGDjOG2vKrak7NizAO4MJKnCG921%2FPcvLRqLzT-JnfPrulzmCo%2Fmc-gilsangwoo.jpg",
    highlight: "센스와 위트를 겸비한 진행력이 강점인 사회자입니다.",
    profileUrl: "https://blog.naver.com/inusmusics/220802942529",
    tags: ["웃음", "야외", "하우스", "소규모", "중간규모", "합리적", "중간예산"],
    profileKey: "길상우",
  },
];

const QUESTIONS = [
  {
    id: "venue",
    question: "어떤 예식장에서 결혼하세요?",
    sub: "예식 공간의 분위기에 맞는 사회자를 찾아드릴게요",
    options: [
      { label: "호텔 / 채플", value: "hotel" },
      { label: "고급 웨딩홀", value: "premium_hall" },
      { label: "일반 웨딩홀", value: "normal_hall" },
      { label: "하우스웨딩 / 야외", value: "outdoor" },
    ],
  },
  {
    id: "guests",
    question: "하객이 몇 분 정도 오세요?",
    sub: "예식 규모에 따라 진행 스타일이 달라져요",
    options: [
      { label: "100명 이하 소규모", value: "small" },
      { label: "100~200명", value: "medium" },
      { label: "200명 이상 대규모", value: "large" },
    ],
  },
  {
    id: "mood",
    question: "어떤 분위기의 예식을 원하세요?",
    sub: "신랑신부님이 그리는 결혼식 감성을 알려주세요",
    options: [
      { label: "품격 있고 격식 있게", value: "formal" },
      { label: "따뜻하고 감동적으로", value: "emotional" },
      { label: "밝고 화기애애하게", value: "joyful" },
    ],
  },
  {
    id: "budget",
    question: "사회자 예산은 어느 정도 생각하세요?",
    sub: "예산에 맞는 최적의 사회자를 추천해드릴게요",
    options: [
      { label: "합리적인 가격으로", value: "budget" },
      { label: "중간 정도", value: "mid" },
      { label: "특별한 날, 프리미엄으로", value: "premium" },
    ],
  },
  {
    id: "priority",
    question: "사회자에게 가장 중요하게 생각하는 건요?",
    sub: "핵심 가치를 알려주시면 더 정확하게 매칭해드려요",
    options: [
      { label: "하객과 함께하는 웃음과 즐거움", value: "fun" },
      { label: "신랑신부의 감동과 눈물", value: "emotion" },
      { label: "흔들림 없는 깔끔한 진행", value: "clean" },
    ],
  },
];

// 답변 기반 점수 계산으로 사회자 매칭
// 각 사회자에게 답변별 가중치 점수 부여 → 상위 3명 추천
function calcRecommendations(answers: { id: string; value: string }[]): { mcs: typeof MCS; reason: string } {
  const venue = answers.find((a) => a.id === "venue")?.value ?? "";
  const guests = answers.find((a) => a.id === "guests")?.value ?? "";
  const mood = answers.find((a) => a.id === "mood")?.value ?? "";
  const budget = answers.find((a) => a.id === "budget")?.value ?? "";
  const priority = answers.find((a) => a.id === "priority")?.value ?? "";

  // 사회자별 점수 계산
  const scores: Record<string, number> = {};
  MCS.forEach((mc) => { scores[mc.name] = 0; });

  // 예식장 점수
  const venueMap: Record<string, string[]> = {
    hotel: ["이우영", "고승범", "김민수", "장윤태", "김선혁"],
    premium_hall: ["장윤태", "김선혁", "이우영", "김민수", "석재선"],
    normal_hall: ["이도영", "길상우", "고승범", "석재선", "김민수"],
    outdoor: ["길상우", "이도영", "고승범", "석재선", "이우영"],
  };
  venueMap[venue]?.forEach((name, i) => { scores[name] += 5 - i; });

  // 하객수 점수
  const guestsMap: Record<string, string[]> = {
    small: ["길상우", "고승범", "석재선", "이도영", "김민수"],
    medium: ["이도영", "장윤태", "김민수", "길상우", "석재선"],
    large: ["이우영", "김선혁", "장윤태", "이도영", "길상우"],
  };
  guestsMap[guests]?.forEach((name, i) => { scores[name] += 5 - i; });

  // 분위기 점수
  const moodMap: Record<string, string[]> = {
    formal: ["이우영", "고승범", "장윤태", "김선혁", "김민수"],
    emotional: ["이도영", "석재선", "장윤태", "고승범", "길상우"],
    joyful: ["길상우", "이도영", "김선혁", "김민수", "고승범"],
  };
  moodMap[mood]?.forEach((name, i) => { scores[name] += 5 - i; });

  // 예산 점수
  const budgetMap: Record<string, string[]> = {
    budget: ["고승범", "이도영", "길상우", "김민수", "석재선"],
    mid: ["석재선", "김선혁", "이도영", "길상우", "고승범"],
    premium: ["이우영", "장윤태", "김선혁", "김민수", "석재선"],
  };
  budgetMap[budget]?.forEach((name, i) => { scores[name] += 5 - i; });

  // 우선순위 점수
  const priorityMap: Record<string, string[]> = {
    fun: ["길상우", "이도영", "김선혁", "고승범", "김민수"],
    emotion: ["이도영", "석재선", "장윤태", "이우영", "고승범"],
    clean: ["이우영", "김민수", "고승범", "김선혁", "장윤태"],
  };
  priorityMap[priority]?.forEach((name, i) => { scores[name] += 5 - i; });

  // 점수 순 정렬
  const sorted = MCS.slice().sort((a, b) => scores[b.name] - scores[a.name]);
  const top3 = sorted.slice(0, 3);

  // 추천 이유 생성
  const reasonMap: Record<string, Record<string, string>> = {
    outdoor: {
      fun: "야외/하우스웨딩에서 하객과 자유롭게 호흡하며 유쾌한 분위기를 만드는 사회자를 추천드려요.",
      emotion: "야외의 자연스러운 분위기 속에서 신랑신부의 감동 스토리를 따뜻하게 전달할 사회자예요.",
      clean: "야외 예식의 변수에도 흔들림 없이 깔끔하게 진행하는 사회자를 추천드립니다.",
    },
    hotel: {
      fun: "호텔의 품격을 유지하면서도 하객들이 즐길 수 있는 위트 있는 진행을 선보입니다.",
      emotion: "호텔 예식의 격식 속에서 신랑신부의 이야기를 감동적으로 풀어내는 사회자예요.",
      clean: "호텔 예식에 걸맞은 안정적이고 세련된 진행으로 완성도를 높여드립니다.",
    },
    premium_hall: {
      fun: "고급 웨딩홀에서도 하객들이 함께 즐기는 활기찬 분위기를 만들어드립니다.",
      emotion: "고급홀의 아름다운 공간에서 신랑신부만의 감동 스토리가 빛나도록 진행합니다.",
      clean: "고급 웨딩홀에 어울리는 품격 있고 흔들림 없는 완벽한 진행을 보장합니다.",
    },
    normal_hall: {
      fun: "친근한 웨딩홀에서 하객 한 분 한 분과 교감하며 즐거운 예식을 만들어드려요.",
      emotion: "편안한 공간에서 신랑신부의 진심 어린 이야기가 하객에게 고스란히 전달됩니다.",
      clean: "일반 웨딩홀에서도 완성도 높은 깔끔한 진행으로 기억에 남는 예식을 완성합니다.",
    },
  };

  const venueKey = venue in reasonMap ? venue : "normal_hall";
  const priorityKey = priority in (reasonMap[venueKey] ?? {}) ? priority : "clean";
  const reason = reasonMap[venueKey]?.[priorityKey] ?? "답변을 바탕으로 가장 잘 어울리는 사회자를 추천드립니다.";

  return { mcs: top3, reason };
}

type Answer = { id: string; value: string };

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenProfile: (key: string) => void;
}

export default function McMatchModal({ isOpen, onClose, onOpenProfile }: Props) {
  const [step, setStep] = useState(0); // 0~4: 질문, 5: 결과
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);
  const [results, setResults] = useState<typeof MCS>([]);
  const [reason, setReason] = useState("");
  const [resultVisible, setResultVisible] = useState(false);
  const [toast, setToast] = useState("");
  const [savingImg, setSavingImg] = useState(false);
  const resultCardRef = useRef<HTMLDivElement>(null);

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
    const newAnswers = [...answers, { id: q.id, value: ans.value }];

    setAnimating(true);
    setTimeout(() => {
      setAnswers(newAnswers);
      setSelected(null);

      if (step < QUESTIONS.length - 1) {
        setStep(step + 1);
        setAnimating(false);
      } else {
        const { mcs: recs, reason: rec } = calcRecommendations(newAnswers);
        setResults(recs);
        setReason(rec);
        setStep(QUESTIONS.length);
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

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const handleKakaoShare = async () => {
    const top = results[0];
    const text = `💍 내 결혼식에 어울리는 사회자 추천 결과\n\n1순위: ${top?.name} 사회자\n\n${reason}\n\n▶ 이너스뮤직 사회자 보러가기\nhttps://inusmusic.com`;
    try {
      await navigator.clipboard.writeText(text);
      showToast("📋 카카오톡에 붙여넣기 하세요!");
    } catch {
      showToast("복사 실패 — 직접 복사해주세요");
    }
  };

  // 이미지 URL → base64 변환 (CORS 우회용)
  const toBase64 = (url: string): Promise<string> =>
    new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const c = document.createElement("canvas");
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        c.getContext("2d")!.drawImage(img, 0, 0);
        try { resolve(c.toDataURL("image/jpeg", 0.9)); }
        catch { resolve(url); } // CORS 실패 시 원본 유지
      };
      img.onerror = () => resolve(url);
      img.src = url + (url.includes("?") ? "&" : "?") + "_t=" + Date.now();
    });

  const handleInstaShare = async () => {
    if (!resultCardRef.current) return;
    setSavingImg(true);
    try {
      // 1) 캡처 영역 내 모든 img를 base64로 교체 (CORS 이미지 대응)
      const imgs = resultCardRef.current.querySelectorAll<HTMLImageElement>("img");
      const origSrcs: string[] = [];
      await Promise.all(
        Array.from(imgs).map(async (img, i) => {
          origSrcs[i] = img.src;
          img.src = await toBase64(img.src);
        })
      );

      // 2) 캡처
      const canvas = await html2canvas(resultCardRef.current, {
        backgroundColor: "#0d0d0d",
        scale: 2,
        useCORS: false,   // base64로 교체했으므로 불필요
        allowTaint: false,
        logging: false,
      });

      // 3) 원본 src 복원
      Array.from(imgs).forEach((img, i) => { img.src = origSrcs[i]; });

      // 4) 저장
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      canvas.toBlob((blob) => {
        if (!blob) { showToast("이미지 생성 실패"); return; }
        const url = URL.createObjectURL(blob);

        if (isMobile) {
          const newTab = window.open(url, "_blank");
          if (newTab) {
            showToast("📸 이미지를 길게 눌러 저장하세요!");
          } else {
            // 팝업 차단 시 data URL 폴백
            const a = document.createElement("a");
            a.href = canvas.toDataURL("image/png");
            a.download = "이너스뮤직_사회자추천.png";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            showToast("📸 저장 완료!");
          }
          setTimeout(() => URL.revokeObjectURL(url), 15000);
        } else {
          const a = document.createElement("a");
          a.href = url;
          a.download = "이너스뮤직_사회자추천.png";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(url), 1000);
          showToast("📸 이미지 저장 완료! 인스타에 올려보세요");
        }
      }, "image/png");

    } catch (e) {
      console.error("캡처 실패:", e);
      showToast("이미지 저장 실패 — 스크린샷을 이용해주세요");
    } finally {
      setSavingImg(false);
    }
  };

  if (!isOpen) return null;

  const totalSteps = QUESTIONS.length;
  const progress = step >= totalSteps ? 100 : Math.round((step / totalSteps) * 100);

  return (
    <div
      className="fixed inset-0 z-[250] overflow-y-auto flex flex-col items-center py-6 px-4"
      style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(10px)", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg"
        style={{
          background: "linear-gradient(160deg, #141414 0%, #0d0d0d 100%)",
          border: "1px solid rgba(214,177,107,0.2)",
          borderRadius: "12px",
          animation: "fadeInUp 0.35s cubic-bezier(0.23,1,0.32,1)",
          overflowX: "hidden",
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
        {step < totalSteps && (
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
              {step + 1} / {totalSteps}
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
              {step < totalSteps - 1 ? "다음" : "결과 보기"}
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* 결과 영역 */}
        {step === totalSteps && (
          <div
            className="px-6 py-8"
            style={{
              opacity: resultVisible ? 1 : 0,
              transform: resultVisible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.4s, transform 0.4s",
            }}
          >
            {/* 캡처 대상 카드 */}
            <div ref={resultCardRef} style={{ background: "#0d0d0d", padding: "4px" }}>
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
                      onClick={() => { onOpenProfile(mc.profileKey); }}
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
            </div>

            {/* 공유 버튼 */}
            <div className="flex gap-2 mt-5">
              <button
                onClick={handleKakaoShare}
                className="flex items-center justify-center gap-2 flex-1 py-3 rounded-lg text-sm font-semibold transition-all duration-200 hover:opacity-90"
                style={{
                  fontFamily: "'Noto Sans KR', sans-serif",
                  background: "#FEE500",
                  color: "#3C1E1E",
                }}
              >
                <Copy size={13} />
                카카오톡 공유
              </button>
              <button
                onClick={handleInstaShare}
                disabled={savingImg}
                className="flex items-center justify-center gap-2 flex-1 py-3 rounded-lg text-sm font-semibold transition-all duration-200 hover:opacity-90"
                style={{
                  fontFamily: "'Noto Sans KR', sans-serif",
                  background: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
                  color: "#fff",
                  opacity: savingImg ? 0.7 : 1,
                }}
              >
                <Instagram size={13} />
                {savingImg ? "저장 중..." : "인스타 이미지 저장"}
              </button>
            </div>

            {/* 하단 버튼들 */}
            <div className="flex gap-3 mt-3">
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

        {/* 토스트 알림 */}
        {toast && (
          <div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-full text-sm font-semibold z-[300] pointer-events-none"
            style={{
              fontFamily: "'Noto Sans KR', sans-serif",
              background: "rgba(214,177,107,0.95)",
              color: "#0d0d0d",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              animation: "fadeInUp 0.3s ease",
              whiteSpace: "nowrap",
            }}
          >
            {toast}
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
