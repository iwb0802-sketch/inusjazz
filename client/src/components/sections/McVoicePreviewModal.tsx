import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MC_LIST = [
  { name: "김민수", tier: "BEST", styles: ["품격형", "아나운서형"], image: "https://storage.googleapis.com/runable-templates/cli-uploads%2FeblzJGDjOG2vKrak7NizAO4MJKnCG921%2FBYRtfbYIzXNdsFB6amBgH%2Fmc-minsu.jpg", audio: "/audio/mc-minsu.mp3" },
  { name: "고승범", tier: "BEST", styles: ["품격형", "아나운서형"], image: "https://storage.googleapis.com/runable-templates/cli-uploads%2FeblzJGDjOG2vKrak7NizAO4MJKnCG921%2FBwzFRGzJA1Kfhq7jlJAKC%2Fmc-seungbeom.jpg", audio: "/audio/mc-seungbeom.mp3" },
  { name: "이도영", tier: "BEST", styles: ["품격형", "밝은형", "감동형"], image: "https://storage.googleapis.com/runable-templates/cli-uploads%2FeblzJGDjOG2vKrak7NizAO4MJKnCG921%2FiuXMGK12MuFdSRk7uE0pN%2Fmc-idoyoung.jpg", audio: "/audio/mc-idoyoung.mp3" },
  { name: "석재선", tier: "BEST", styles: ["품격형", "감동형"], image: "https://storage.googleapis.com/runable-templates/cli-uploads%2FeblzJGDjOG2vKrak7NizAO4MJKnCG921%2FJz0RRPbGQ0vJOZ9gDMPDH%2Fmc-jaesun.jpg", audio: "/audio/mc-jaesun.mp3" },
  { name: "이우영", tier: "PREMIUM", styles: ["품격형", "밝은형", "감동형", "아나운서형"], image: "https://storage.googleapis.com/runable-templates/cli-uploads%2FeblzJGDjOG2vKrak7NizAO4MJKnCG921%2F1mW9tqg_svTMqRhA_gFkh%2Fmc-wooyoung.jpg", audio: "/audio/mc-wooyoung.mp3" },
  { name: "김선혁", tier: "BEST", styles: ["품격형", "아나운서형"], image: "https://storage.googleapis.com/runable-templates/cli-uploads%2FeblzJGDjOG2vKrak7NizAO4MJKnCG921%2FD3R6VD-jz9M3e2d3a9ygH%2Fmc-sunhyuk.jpg", audio: "/audio/mc-sunhyuk.mp3" },
  { name: "장윤태", tier: "PREMIUM", styles: ["품격형", "감동형"], image: "https://storage.googleapis.com/runable-templates/cli-uploads%2FeblzJGDjOG2vKrak7NizAO4MJKnCG921%2FpFD_oxjPfRdpyQbVVCi4D%2Fmc-yuntae.jpg", audio: "/audio/mc-yuntae.mp3" },
  { name: "길상우", tier: "BEST", styles: ["품격형", "밝은형"], image: "https://storage.googleapis.com/runable-templates/cli-uploads%2FeblzJGDjOG2vKrak7NizAO4MJKnCG921%2FPcvLRqLzT-JnfPrulzmCo%2Fmc-gilsangwoo.jpg", audio: "/audio/mc-gilsangwoo.mp3" },
];

const STYLES = ["품격형", "밝은형", "감동형"];

type Step = "form" | "mc" | "generating" | "result";

interface McVoicePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function McVoicePreviewModal({ isOpen, onClose }: McVoicePreviewModalProps) {
  const [step, setStep] = useState<Step>("form");
  const [groomName, setGroomName] = useState("");
  const [brideName, setBrideName] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("품격형");
  const [selectedMc, setSelectedMc] = useState<string | null>(null);
  const [previewingMc, setPreviewingMc] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  const reset = () => {
    setStep("form");
    setGroomName("");
    setBrideName("");
    setSelectedStyle("품격형");
    setSelectedMc(null);
    setPreviewingMc(null);
    setAudioUrl(null);
    setIsPlaying(false);
    setError(null);
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    if (previewAudioRef.current) { previewAudioRef.current.pause(); previewAudioRef.current = null; }
  };

  const handleClose = () => { reset(); onClose(); };

  const handlePreviewVoice = (mc: typeof MC_LIST[0]) => {
    if (previewingMc === mc.name) {
      previewAudioRef.current?.pause();
      setPreviewingMc(null);
      return;
    }
    if (previewAudioRef.current) previewAudioRef.current.pause();
    const audio = new Audio(mc.audio);
    audio.play().catch(() => {});
    audio.onended = () => setPreviewingMc(null);
    previewAudioRef.current = audio;
    setPreviewingMc(mc.name);
  };

  const getScript = (style: string, groom: string, bride: string) => {
    switch (style) {
      case "감동형":
        return `지금부터 두 분의 아름다운 예식을 시작하겠습니다. 신랑 ${groom} 님께서는 이 자리에서 가장 사랑하는 분을 만나기 위해 먼저 입장해 주시겠습니다. 신랑 ${groom} 님 입장입니다. 이제 오늘의 주인공, 신부 ${bride} 님께서 입장하시겠습니다. 모든 분들의 마음 속에 영원히 기억될 아름다운 순간입니다. 신부 ${bride} 님 입장입니다.`;
      case "밝은형":
        return `안녕하세요! 오늘 이 아름다운 자리에 와주신 모든 분들께 진심으로 감사드립니다. 자, 이제 오늘의 주인공 신랑 ${groom} 님께서 입장하십니다! 힘차고 따뜻한 박수로 맞이해 주세요! 신랑 ${groom} 님 입장! 자, 잠시 후 오늘의 가장 아름다운 순간이 펼쳐집니다. 신부 ${bride} 님께서 입장하십니다! 신부 ${bride} 님 입장!`;
      default:
        return `오늘 귀한 시간을 내어주신 모든 분들께 깊은 감사를 드립니다. 신랑 ${groom} 님의 입장을 안내해 드리겠습니다. 신랑 ${groom} 님, 입장해 주십시오. 이어서 신부 ${bride} 님의 입장이 있겠습니다. 신부 ${bride} 님, 행복한 걸음으로 입장해 주십시오.`;
    }
  };

  const VOICE_MAP: Record<string, string> = {
    "김민수": "JWuOh2mTRrGyGGPaD7WM",
    "고승범": "wg42EEjzSm99URqmlk1i",
    "이도영": "0A9yP2iWCjvoeUUQTyTK",
    "석재선": "Sqe8LWJ3mfDSe8s9PFkP",
    "이우영": "RamwLTJJSRWZIyoWej6F",
    "김선혁": "KSEIJT8t4VqiJgJAWKPi",
    "장윤태": "GQ8Ij9Yf59rv168AxSFB",
    "길상우": "OO3VnWQQL5x3ySM9jNb5",
  };

  const handleGenerate = async () => {
    if (!selectedMc) return;
    setStep("generating");
    setError(null);
    try {
      const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
      const voiceId = VOICE_MAP[selectedMc];
      const script = getScript(selectedStyle, groomName, brideName);

      const res = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          method: "POST",
          headers: {
            "xi-api-key": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: script,
            model_id: "eleven_multilingual_v2",
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.8,
              style: 0.3,
              use_speaker_boost: true,
            },
          }),
        }
      );
      if (!res.ok) throw new Error("생성 실패");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setStep("result");
    } catch (e) {
      setError("멘트 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
      setStep("mc");
    }
  };

  const handlePlay = () => {
    if (!audioUrl) return;
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }
    const audio = new Audio(audioUrl);
    audio.play().catch(() => {});
    audio.onended = () => setIsPlaying(false);
    audioRef.current = audio;
    setIsPlaying(true);
  };

  const selectedMcData = MC_LIST.find(m => m.name === selectedMc);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px",
        }}
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{
            background: "#0d0d0d",
            border: "1px solid rgba(214,177,107,0.2)",
            width: "100%", maxWidth: "560px",
            maxHeight: "90vh", overflowY: "auto",
            position: "relative",
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* 헤더 */}
          <div style={{
            padding: "28px 28px 0",
            borderBottom: "1px solid rgba(214,177,107,0.1)",
            paddingBottom: "20px",
            position: "sticky", top: 0, background: "#0d0d0d", zIndex: 1,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "11px", letterSpacing: "0.4em", color: "#d6b16b", textTransform: "uppercase", marginBottom: "6px" }}>INUS MUSIC</div>
                <h2 style={{ fontFamily: "'Noto Serif KR',serif", fontSize: "20px", fontWeight: 700, color: "#fff", margin: 0 }}>내 결혼식 입장 멘트 미리듣기</h2>
              </div>
              <button onClick={handleClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "20px", padding: "4px", lineHeight: 1 }}>✕</button>
            </div>
            {/* 스텝 인디케이터 */}
            <div style={{ display: "flex", gap: "8px", marginTop: "16px", alignItems: "center" }}>
              {["이름 입력", "사회자 선택", "멘트 생성"].map((label, i) => {
                const stepIdx = step === "form" ? 0 : step === "mc" ? 1 : 2;
                const active = i === stepIdx;
                const done = i < stepIdx;
                return (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{
                      width: "20px", height: "20px", borderRadius: "50%",
                      background: done ? "#d6b16b" : active ? "rgba(214,177,107,0.2)" : "rgba(255,255,255,0.05)",
                      border: `1px solid ${done || active ? "#d6b16b" : "rgba(255,255,255,0.1)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "10px", color: done ? "#000" : active ? "#d6b16b" : "rgba(255,255,255,0.3)",
                      fontWeight: 700, flexShrink: 0,
                    }}>
                      {done ? "✓" : i + 1}
                    </div>
                    <span style={{ fontSize: "11px", color: active ? "#d6b16b" : done ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)", whiteSpace: "nowrap" }}>{label}</span>
                    {i < 2 && <div style={{ width: "20px", height: "1px", background: "rgba(214,177,107,0.2)", flexShrink: 0 }} />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 바디 */}
          <div style={{ padding: "24px 28px 28px" }}>

            {/* STEP 1: 이름 입력 */}
            {step === "form" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "24px", lineHeight: 1.7 }}>
                  신랑, 신부 이름을 입력하시면 선택한 사회자의 목소리로<br />실제 입장 멘트를 생성해드립니다.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label style={{ fontSize: "11px", color: "#d6b16b", letterSpacing: "0.1em", display: "block", marginBottom: "8px" }}>신랑 이름</label>
                    <input
                      value={groomName}
                      onChange={e => setGroomName(e.target.value)}
                      placeholder="예) 홍길동"
                      style={{
                        width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(214,177,107,0.2)", color: "#fff", fontSize: "15px",
                        outline: "none", fontFamily: "'Noto Sans KR',sans-serif", boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "11px", color: "#d6b16b", letterSpacing: "0.1em", display: "block", marginBottom: "8px" }}>신부 이름</label>
                    <input
                      value={brideName}
                      onChange={e => setBrideName(e.target.value)}
                      placeholder="예) 김영희"
                      style={{
                        width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(214,177,107,0.2)", color: "#fff", fontSize: "15px",
                        outline: "none", fontFamily: "'Noto Sans KR',sans-serif", boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "11px", color: "#d6b16b", letterSpacing: "0.1em", display: "block", marginBottom: "12px" }}>분위기 선택</label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {STYLES.map(s => (
                        <button
                          key={s}
                          onClick={() => setSelectedStyle(s)}
                          style={{
                            flex: 1, padding: "10px 8px", fontSize: "13px", cursor: "pointer",
                            background: selectedStyle === s ? "rgba(214,177,107,0.15)" : "rgba(255,255,255,0.03)",
                            border: `1px solid ${selectedStyle === s ? "#d6b16b" : "rgba(255,255,255,0.1)"}`,
                            color: selectedStyle === s ? "#d6b16b" : "rgba(255,255,255,0.4)",
                            fontFamily: "'Noto Sans KR',sans-serif", transition: "all 0.2s",
                          }}
                        >{s}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => { if (groomName.trim() && brideName.trim()) setStep("mc"); }}
                  disabled={!groomName.trim() || !brideName.trim()}
                  style={{
                    width: "100%", marginTop: "24px", padding: "14px",
                    background: groomName.trim() && brideName.trim() ? "#d6b16b" : "rgba(255,255,255,0.05)",
                    border: "none", color: groomName.trim() && brideName.trim() ? "#000" : "rgba(255,255,255,0.2)",
                    fontSize: "14px", fontWeight: 700, cursor: groomName.trim() && brideName.trim() ? "pointer" : "not-allowed",
                    fontFamily: "'Noto Sans KR',sans-serif", letterSpacing: "0.05em", transition: "all 0.2s",
                  }}
                >다음 — 사회자 선택</button>
              </motion.div>
            )}

            {/* STEP 2: 사회자 선택 */}
            {step === "mc" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "20px", lineHeight: 1.7 }}>
                  ▶ 버튼으로 목소리를 미리 들어보고 원하는 사회자를 선택하세요.
                </p>
                {error && (
                  <div style={{ padding: "12px 16px", background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.3)", color: "#ff8080", fontSize: "13px", marginBottom: "16px" }}>
                    {error}
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {MC_LIST.map(mc => (
                    <div
                      key={mc.name}
                      onClick={() => setSelectedMc(mc.name)}
                      style={{
                        display: "flex", alignItems: "center", gap: "14px", padding: "12px 14px", cursor: "pointer",
                        background: selectedMc === mc.name ? "rgba(214,177,107,0.08)" : "rgba(255,255,255,0.02)",
                        border: `1px solid ${selectedMc === mc.name ? "#d6b16b" : "rgba(255,255,255,0.07)"}`,
                        transition: "all 0.2s",
                      }}
                    >
                      <img src={mc.image} alt={mc.name} style={{ width: "44px", height: "44px", objectFit: "cover", objectPosition: "top", flexShrink: 0, border: "1px solid rgba(214,177,107,0.15)" }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                          <span style={{ fontSize: "14px", fontWeight: 600, color: selectedMc === mc.name ? "#d6b16b" : "#fff" }}>{mc.name}</span>
                          <span style={{ fontSize: "9px", padding: "2px 6px", border: `1px solid ${mc.tier === "PREMIUM" ? "#d6b16b" : "rgba(255,255,255,0.2)"}`, color: mc.tier === "PREMIUM" ? "#d6b16b" : "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>{mc.tier}</span>
                        </div>
                        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                          {mc.styles.map(s => (
                            <span key={s} style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", padding: "1px 6px", border: "1px solid rgba(255,255,255,0.08)" }}>{s}</span>
                          ))}
                        </div>
                      </div>
                      {/* 목소리 미리듣기 버튼 */}
                      <button
                        onClick={e => { e.stopPropagation(); handlePreviewVoice(mc); }}
                        style={{
                          width: "34px", height: "34px", borderRadius: "50%", flexShrink: 0,
                          background: previewingMc === mc.name ? "rgba(91,181,162,0.2)" : "rgba(255,255,255,0.05)",
                          border: `1px solid ${previewingMc === mc.name ? "#5BB5A2" : "rgba(255,255,255,0.15)"}`,
                          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "all 0.2s",
                        }}
                      >
                        {previewingMc === mc.name ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="#5BB5A2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(255,255,255,0.6)"><polygon points="5,3 19,12 5,21"/></svg>
                        )}
                      </button>
                      {/* 선택 체크 */}
                      <div style={{
                        width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0,
                        background: selectedMc === mc.name ? "#d6b16b" : "transparent",
                        border: `1px solid ${selectedMc === mc.name ? "#d6b16b" : "rgba(255,255,255,0.15)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.2s",
                      }}>
                        {selectedMc === mc.name && <svg width="10" height="10" viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" stroke="#000" strokeWidth="2" fill="none"/></svg>}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
                  <button onClick={() => setStep("form")} style={{ flex: 1, padding: "14px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)", fontSize: "13px", cursor: "pointer", fontFamily: "'Noto Sans KR',sans-serif" }}>← 이전</button>
                  <button
                    onClick={handleGenerate}
                    disabled={!selectedMc}
                    style={{
                      flex: 2, padding: "14px",
                      background: selectedMc ? "#d6b16b" : "rgba(255,255,255,0.05)",
                      border: "none", color: selectedMc ? "#000" : "rgba(255,255,255,0.2)",
                      fontSize: "14px", fontWeight: 700, cursor: selectedMc ? "pointer" : "not-allowed",
                      fontFamily: "'Noto Sans KR',sans-serif", letterSpacing: "0.05em", transition: "all 0.2s",
                    }}
                  >🎤 입장 멘트 생성하기</button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: 생성 중 */}
            {step === "generating" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ marginBottom: "24px" }}>
                  <div style={{
                    width: "60px", height: "60px", margin: "0 auto 20px",
                    border: "2px solid rgba(214,177,107,0.2)", borderTop: "2px solid #d6b16b",
                    borderRadius: "50%", animation: "spin 1s linear infinite",
                  }} />
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
                <p style={{ fontFamily: "'Noto Serif KR',serif", fontSize: "18px", color: "#fff", marginBottom: "8px" }}>멘트를 생성하고 있습니다</p>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
                  {selectedMc} 사회자의 목소리로<br />
                  {groomName} 님, {brideName} 님의<br />
                  입장 멘트를 만들고 있어요...
                </p>
              </motion.div>
            )}

            {/* STEP 4: 결과 */}
            {step === "result" && selectedMcData && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                {/* 사회자 카드 */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", background: "rgba(214,177,107,0.05)", border: "1px solid rgba(214,177,107,0.2)", marginBottom: "24px" }}>
                  <img src={selectedMcData.image} alt={selectedMcData.name} style={{ width: "56px", height: "56px", objectFit: "cover", objectPosition: "top", border: "1px solid rgba(214,177,107,0.3)" }} />
                  <div>
                    <div style={{ fontSize: "12px", color: "#d6b16b", letterSpacing: "0.1em", marginBottom: "4px" }}>선택하신 사회자</div>
                    <div style={{ fontSize: "18px", fontWeight: 700, color: "#fff", fontFamily: "'Noto Serif KR',serif" }}>{selectedMcData.name} 사회자</div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>{selectedStyle} · {selectedMcData.tier}</div>
                  </div>
                </div>

                {/* 멘트 미리보기 */}
                <div style={{ padding: "16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: "20px" }}>
                  <div style={{ fontSize: "11px", color: "#d6b16b", letterSpacing: "0.1em", marginBottom: "10px" }}>입장 멘트 미리보기</div>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: 1.9, margin: 0 }}>
                    {selectedStyle === "감동형"
                      ? `지금부터 두 분의 아름다운 예식을 시작하겠습니다.\n\n신랑 ${groomName} 님 입장입니다.\n\n신부 ${brideName} 님 입장입니다.`
                      : selectedStyle === "밝은형"
                      ? `신랑 ${groomName} 님 입장! 신부 ${brideName} 님 입장!`
                      : `신랑 ${groomName} 님, 입장해 주십시오.\n\n신부 ${brideName} 님, 입장해 주십시오.`}
                  </p>
                </div>

                {/* 재생 버튼 */}
                <button
                  onClick={handlePlay}
                  style={{
                    width: "100%", padding: "16px", marginBottom: "12px",
                    background: isPlaying ? "rgba(91,181,162,0.15)" : "rgba(214,177,107,0.12)",
                    border: `1px solid ${isPlaying ? "#5BB5A2" : "#d6b16b"}`,
                    color: isPlaying ? "#5BB5A2" : "#d6b16b",
                    fontSize: "15px", fontWeight: 700, cursor: "pointer",
                    fontFamily: "'Noto Sans KR',sans-serif", letterSpacing: "0.05em",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                    transition: "all 0.2s",
                  }}
                >
                  {isPlaying ? (
                    <><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> 재생 중...</>
                  ) : (
                    <><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg> 🎤 입장 멘트 재생하기</>
                  )}
                </button>

                {/* CTA */}
                <a
                  href="http://pf.kakao.com/_xkxmxaWxj/chat"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "block", width: "100%", padding: "14px", textAlign: "center",
                    background: "#FEE500", border: "none", color: "#000",
                    fontSize: "14px", fontWeight: 700, cursor: "pointer",
                    fontFamily: "'Noto Sans KR',sans-serif", letterSpacing: "0.03em",
                    textDecoration: "none", marginBottom: "10px", boxSizing: "border-box",
                  }}
                >💬 {selectedMcData.name} 사회자로 상담받기</a>

                <button
                  onClick={() => { setStep("mc"); setAudioUrl(null); setIsPlaying(false); if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } }}
                  style={{ width: "100%", padding: "12px", background: "transparent", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.35)", fontSize: "12px", cursor: "pointer", fontFamily: "'Noto Sans KR',sans-serif" }}
                >← 다른 사회자로 다시 생성</button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
