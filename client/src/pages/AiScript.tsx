import { useEffect, useMemo, useState } from "react";
import ExcelJS from "exceljs";

const API_URL = "/api/ai-script";
const REVISION_API_URL = "/api/ai-script-revise";
const GUIDE_API_URL = "/api/ai-guide";
const GUIDE_CHAT_API_URL = "/api/ai-guide-chat";
const GUIDE_LEARN_API_URL = "/api/ai-guide-learn";
const ADMIN_HOME = "http://bnsmusics.godohosting.com/bns/admin/event_list.php?sUser_id=bnsmusic&sUser_nm=%EA%B4%80%EB%A6%AC%EC%9E%90";

type CeremonyType = "main" | "reception";
type ScriptStyle = "classic" | "trendy" | "warm";
type FamilyEntranceMode = "lighting_only" | "parents_and_lighting";
type CoupleEntranceMode = "separate" | "together";
type RingExchangeMode = "include" | "exclude";
type ScriptSection = { no: number; order: string; time: string; script: string; note: string };
type GeneratedScript = { title: string; subtitle: string; sections: ScriptSection[]; review_flags: string[] };
type RevisionMessage = { role: "user" | "assistant"; content: string; createdAt: string };
type GuideChatMessage = { role: "user" | "assistant"; content: string; createdAt: string };
type LearnedPattern = { id: string; title: string; summary: string; createdAt: string };
type GuideVersion = { id: string; guide: string; savedAt: string };
type SharedGuideResponse = { guide: string; learnedPatterns: LearnedPattern[]; guideHistory: GuideVersion[]; currentVersionId: string | null; updatedAt: string | null };
type WorkspaceTab = "generator" | "editor" | "guide";

type FormValues = {
  groomName: string; brideName: string; mcName: string; ceremonyType: CeremonyType; style: ScriptStyle;
  weddingDate: string; weddingTime: string; venue: string; duration: string; familyEntranceMode: FamilyEntranceMode; coupleEntranceMode: CoupleEntranceMode; ringExchangeMode: RingExchangeMode;
  customOrder: string; coupleStory: string; requests: string;
};

const defaultForm: FormValues = {
  groomName: "", brideName: "", mcName: "", ceremonyType: "main", style: "classic",
  weddingDate: "", weddingTime: "12:00", venue: "", duration: "40분", familyEntranceMode: "lighting_only", coupleEntranceMode: "separate", ringExchangeMode: "include",
  customOrder: "", coupleStory: "", requests: "",
};

const C = {
  ink: "#111B2E", navy: "#17243B", mint: "#2D9B8A", mintSoft: "#E8FAF8", mintPale: "#F4FCFB",
  cream: "#F7F8F5", line: "#DCE4E3", text: "#263238", muted: "#71808A", coral: "#E36C6C", white: "#FFFFFF",
};

const WEDDING_TIME_OPTIONS = Array.from({ length: 85 }, (_, index) => {
  const totalMinutes = 8 * 60 + index * 10;
  const hour = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const minute = String(totalMinutes % 60).padStart(2, "0");
  return `${hour}:${minute}`;
});

const DEFAULT_COMPANY_GUIDE = `# 이너스뮤직 프리미엄 사회 대본 기준

## 기본 문체
- 차분하고 품격 있는 한국어 존댓말을 사용합니다.
- 신랑은 "OOO 군", 신부는 "OOO 양"으로 표기합니다.
- 과장된 표현보다 따뜻하고 자연스러운 연결을 우선합니다.

## 기본 식순
하객 입장 안내 → 오프닝 → 개식 선언 → 화촉점화 → 신랑 입장 → 신부 입장 → 맞절 → 혼인서약 → 반지 교환 → 성혼선언 → 축가·덕담·편지(있는 경우) → 양가 인사 → 내빈 인사 → 행진 → 폐회

혼주님 입장은 기본 식순이 아닙니다. 대본 작성 화면에서 “혼주님 입장 + 화촉점화”를 선택한 경우에만 개식 선언 뒤에 혼주님 입장을 추가하고, 기본 선택인 “화촉점화만”에서는 혼주님 입장 식순을 만들지 않습니다. 신랑·신부는 기본으로 따로 입장하며, 동시입장을 선택하면 두 분의 동시입장 식순 하나만 작성합니다. 반지 교환은 기본으로 포함하되, 반지 교환 없음을 선택하면 관련 식순과 멘트를 작성하지 않습니다.

## 반드시 지킬 사항
- 제공되지 않은 첫 만남, 직업, 가족관계, 곡명, 관계를 만들지 않습니다.
- 답변지의 실제 인용 문장만 <answer>와 </answer>로 감싸서 반영합니다.
- 음원 타이밍·연출·서프라이즈 주의는 멘트가 아니라 비고에 작성합니다.
- 박수 요청은 반드시 대상을 명시하고, 실제 진행 가능한 콜 구령을 넣습니다.
- 신부 입장은 감성적으로 강조하되 콜 직전에는 "그럼 불러보겠습니다."를 사용합니다.
- 화촉점화 뒤에는 양가 인사, 내빈 인사, 혼주석 착석 안내가 자연스럽게 이어지게 합니다.
- 민감한 가족 정보나 답변지의 상충 정보는 멘트에 쓰지 않고 확인 필요 사항으로 남깁니다.

## 프리미엄 대본 스타일
- 각 식순 사이의 감정과 진행 흐름이 끊기지 않게 연결합니다.
- 오프닝은 참석자 환영과 예식의 의미를 자연스럽게 전달합니다.
- 입장 순서에서는 답변지에 있는 실제 매력과 이야기를 품격 있게 연결합니다.
- 축가·덕담 소개는 제공된 관계와 곡명만 사용합니다.
- 양가 인사와 행진은 감사와 축복의 분위기로 마무리합니다.`;

function stripTags(text: string) {
  return (text || "").replace(/<answer>/g, "").replace(/<\/answer>/g, "");
}

function answerPreview(text: string) {
  const parts = (text || "").split(/(<answer>[\s\S]*?<\/answer>)/g);
  return parts.map((part, index) => {
    const matched = part.match(/^<answer>([\s\S]*?)<\/answer>$/);
    return matched ? <strong key={index} style={{ color: "#D13F3F", fontWeight: 800 }}>{matched[1]}</strong> : <span key={index}>{part}</span>;
  });
}

function toRichText(text: string) {
  const parts = (text || "").split(/(<answer>[\s\S]*?<\/answer>)/g);
  return {
    richText: parts.filter(Boolean).map((part) => {
      const matched = part.match(/^<answer>([\s\S]*?)<\/answer>$/);
      return matched
        ? { text: matched[1], font: { name: "Arial", size: 10, bold: true, color: { argb: "FFD13F3F" } } }
        : { text: part, font: { name: "Arial", size: 10, color: { argb: "FF2C2C2C" } } };
    }),
  };
}

function formatFilenamePart(value: string) {
  return (value || "미정").replace(/[\\/:*?"<>|]/g, "").trim();
}

function FieldLabel({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: C.ink, marginBottom: 7 }}>{children}{optional && <span style={{ marginLeft: 6, color: C.muted, fontWeight: 500 }}>(선택)</span>}</label>;
}

function Input({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (value: string) => void; placeholder?: string; type?: string }) {
  return <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    style={{ boxSizing: "border-box", width: "100%", height: 44, border: `1px solid ${C.line}`, borderRadius: 9, background: C.white, color: C.text, padding: "0 12px", fontFamily: "inherit", fontSize: 14, outline: "none" }} />;
}

function TextArea({ value, onChange, placeholder, rows = 4 }: { value: string; onChange: (value: string) => void; placeholder?: string; rows?: number }) {
  return <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
    style={{ boxSizing: "border-box", width: "100%", resize: "vertical", border: `1px solid ${C.line}`, borderRadius: 9, background: C.white, color: C.text, padding: 12, fontFamily: "inherit", fontSize: 13, lineHeight: 1.6, outline: "none" }} />;
}

function PrimaryButton({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return <button onClick={onClick} disabled={disabled} style={{ border: "none", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? .62 : 1, fontFamily: "inherit", fontWeight: 800, fontSize: 14, color: C.white, background: `linear-gradient(135deg,${C.mint},#54BDA9)`, borderRadius: 10, minHeight: 46, padding: "0 18px", boxShadow: "0 7px 18px rgba(45,155,138,.22)" }}>{children}</button>;
}

function RevisionSidebar({ messages, instruction, loading, error, onInstructionChange, onSubmit }: {
  messages: RevisionMessage[]; instruction: string; loading: boolean; error: string;
  onInstructionChange: (value: string) => void; onSubmit: () => void;
}) {
  const suggestions = ["오프닝을 더 감성적으로", "신부 입장만 더 웅장하게", "전체 멘트를 조금 더 간결하게", "축가 소개를 자연스럽게 다듬어줘"];
  return <aside className="ai-revision-sidebar" aria-label="AI 대본 수정 대화창">
    <div style={{ padding: "14px 15px", background: C.mintPale, borderBottom: "1px solid #BCE8E0" }}><div style={{ color: C.ink, fontSize: 14, fontWeight: 900 }}>AI 대본 수정 대화</div><div style={{ color: C.muted, fontSize: 10, lineHeight: 1.55, marginTop: 4 }}>대본을 보면서 원하는 부분을 바로 지시하세요. 이 창은 화면을 내려도 따라옵니다.</div></div>
    <div style={{ padding: 13 }}>
      {messages.length > 0 && <div style={{ display: "grid", gap: 8, maxHeight: 250, overflowY: "auto", marginBottom: 11, paddingRight: 2 }}>{messages.map((message, index) => <div key={`${message.createdAt}-${index}`} style={{ justifySelf: message.role === "user" ? "end" : "start", maxWidth: "94%", padding: "9px 10px", borderRadius: message.role === "user" ? "11px 11px 2px 11px" : "11px 11px 11px 2px", background: message.role === "user" ? C.ink : C.mintSoft, color: message.role === "user" ? C.white : C.text, fontSize: 11, lineHeight: 1.62, whiteSpace: "pre-wrap" }}><div style={{ fontSize: 9, fontWeight: 900, color: message.role === "user" ? "#BFEDE5" : C.mint, marginBottom: 3 }}>{message.role === "user" ? "나의 수정 요청" : "AI 수정 완료"}</div>{message.content}</div>)}</div>}
      {messages.length === 0 && <div style={{ color: C.muted, background: C.white, border: `1px dashed ${C.line}`, borderRadius: 9, padding: "10px 11px", fontSize: 10, lineHeight: 1.65, marginBottom: 11 }}>예: “오프닝을 조금 더 감성적으로 바꿔줘”, “축가 소개는 두 문장으로 짧게”, “전체를 20% 줄여줘”</div>}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 9 }}>{suggestions.map((suggestion) => <button key={suggestion} onClick={() => onInstructionChange(suggestion)} disabled={loading} style={{ border: `1px solid ${C.line}`, borderRadius: 999, background: C.white, color: C.muted, padding: "5px 8px", fontSize: 10, cursor: "pointer", fontFamily: "inherit" }}>{suggestion}</button>)}</div>
      <TextArea value={instruction} onChange={onInstructionChange} rows={5} placeholder="수정 요청을 입력하세요. 예: 화촉점화부터 신랑 입장까지의 연결이 매끄럽게 이어지도록 수정해줘." />
      {error && <div style={{ marginTop: 8, padding: "8px 10px", borderRadius: 7, background: "#FFF2F2", color: "#B53B3B", fontSize: 10, lineHeight: 1.55 }}>{error}</div>}
      <div style={{ marginTop: 10 }}><PrimaryButton onClick={onSubmit} disabled={loading || !instruction.trim()}>{loading ? "AI가 수정 중입니다…" : "수정 요청 보내기"}</PrimaryButton></div>
      <div style={{ marginTop: 9, color: C.muted, fontSize: 10, lineHeight: 1.55 }}>수정된 대본은 아래에서 직접 보완한 뒤 엑셀로 저장할 수 있습니다.</div>
    </div>
  </aside>;
}

function GuideManager({ guide, patterns, versions, currentVersionId, password, loading, updatedAt, onChange, onPatternsChange, onSave, onRestore, onReload }: {
  guide: string; patterns: LearnedPattern[]; versions: GuideVersion[]; currentVersionId: string | null; password: string; loading: boolean; updatedAt: string | null;
  onChange: (value: string) => void; onPatternsChange: (value: LearnedPattern[]) => void;
  onSave: (guide: string, patterns: LearnedPattern[]) => Promise<void>; onRestore: (versionId: string) => Promise<void>; onReload: () => Promise<void>;
}) {
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [learning, setLearning] = useState(false);
  const [exampleTitle, setExampleTitle] = useState("");
  const [exampleSource, setExampleSource] = useState("");
  const [showVersions, setShowVersions] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [guideChatInput, setGuideChatInput] = useState("");
  const [guideChatMessages, setGuideChatMessages] = useState<GuideChatMessage[]>([]);
  const [guideChatLoading, setGuideChatLoading] = useState(false);
  const [guideChatError, setGuideChatError] = useState("");
  const [copiedGuideChatIndex, setCopiedGuideChatIndex] = useState<number | null>(null);

  const save = async (nextPatterns = patterns) => {
    setSaving(true); setStatus("");
    try {
      await onSave(guide, nextPatterns);
      setStatus("공용 저장 완료 · 다른 관리자 기기에서도 같은 지침을 불러옵니다.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "공용 지침 저장에 실패했습니다.");
    } finally { setSaving(false); }
  };

  const restoreVersion = async (version: GuideVersion) => {
    if (!window.confirm(`「${new Date(version.savedAt).toLocaleString("ko-KR")}」에 저장한 지침으로 공용 내용을 복원할까요? 현재 작성 중인 내용은 이 저장 버전으로 교체됩니다.`)) return;
    setRestoring(true); setStatus("");
    try {
      await onRestore(version.id);
      setShowVersions(false);
      setStatus("선택한 저장 버전으로 공용 지침을 복원했습니다.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "저장 버전 복원에 실패했습니다.");
    } finally { setRestoring(false); }
  };

  const askGuideAssistant = async () => {
    if (!guideChatInput.trim() || guideChatLoading) return;
    const userMessage: GuideChatMessage = { role: "user", content: guideChatInput.trim(), createdAt: new Date().toISOString() };
    const conversation = [...guideChatMessages, userMessage];
    setGuideChatMessages(conversation);
    setGuideChatInput("");
    setGuideChatLoading(true); setGuideChatError("");
    try {
      const response = await fetch(GUIDE_CHAT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Inus-Ai-Password": password },
        body: JSON.stringify({ message: userMessage.content, currentGuide: guide, conversation }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "AI 지침 대화에 실패했습니다.");
      setGuideChatMessages((current) => [...current, { role: "assistant", content: String(result.reply || "아이디어를 정리하지 못했습니다."), createdAt: new Date().toISOString() }]);
    } catch (error) {
      setGuideChatError(error instanceof Error ? error.message : "AI 지침 대화 중 오류가 발생했습니다.");
    } finally { setGuideChatLoading(false); }
  };

  const copyGuideChatAnswer = async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedGuideChatIndex(index);
      window.setTimeout(() => setCopiedGuideChatIndex(null), 1800);
    } catch {
      setGuideChatError("복사에 실패했습니다. 답변을 길게 눌러 직접 복사해주세요.");
    }
  };

  const loadExampleFile = async (file: File) => {
    if (file.size > 3 * 1024 * 1024) throw new Error("예시 파일은 3MB 이하만 불러올 수 있습니다.");
    const filename = file.name.toLowerCase();
    if (filename.endsWith(".xlsx")) {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(await file.arrayBuffer());
      const text = workbook.worksheets.map((sheet) => {
        const rows: string[] = [];
        sheet.eachRow((row) => {
          const cells: string[] = [];
          row.eachCell({ includeEmpty: false }, (cell) => cells.push(String(cell.text || cell.value || "").trim()));
          if (cells.length) rows.push(cells.join(" | "));
        });
        return rows.join("\n");
      }).join("\n\n");
      setExampleSource(text.slice(0, 45000));
    } else if (filename.endsWith(".txt") || filename.endsWith(".md") || filename.endsWith(".csv")) {
      setExampleSource((await file.text()).slice(0, 45000));
    } else {
      throw new Error("현재는 .xlsx, .txt, .md, .csv 형식만 지원합니다. 워드·PDF 원문은 내용을 복사해 붙여넣어주세요.");
    }
    if (!exampleTitle.trim()) setExampleTitle(file.name.replace(/\.[^.]+$/, ""));
  };

  const learnExample = async () => {
    if (exampleSource.trim().length < 80) { setStatus("대본 예시를 80자 이상 붙여넣거나 파일에서 불러와주세요."); return; }
    setLearning(true); setStatus("");
    try {
      const response = await fetch(GUIDE_LEARN_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Inus-Ai-Password": password },
        body: JSON.stringify({ title: exampleTitle, sourceText: exampleSource }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "대본 예시 학습에 실패했습니다.");
      const nextPatterns = [...patterns, result.pattern as LearnedPattern].slice(-20);
      onPatternsChange(nextPatterns);
      await onSave(guide, nextPatterns);
      setExampleSource(""); setExampleTitle("");
      setStatus("개인정보를 제외한 학습 요약을 공용 지침에 저장했습니다. 원본 대본은 저장되지 않습니다.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "대본 예시 학습에 실패했습니다.");
    } finally { setLearning(false); }
  };

  const deletePattern = async (id: string) => {
    const nextPatterns = patterns.filter((pattern) => pattern.id !== id);
    onPatternsChange(nextPatterns);
    try { await onSave(guide, nextPatterns); setStatus("학습 요약을 공용 저장소에서 삭제했습니다."); }
    catch (error) { setStatus(error instanceof Error ? error.message : "학습 요약 삭제에 실패했습니다."); }
  };

  return <section style={{ maxWidth: 980, background: C.white, border: `1px solid ${C.line}`, borderRadius: 16, overflow: "hidden", boxShadow: "0 6px 25px rgba(19,36,59,.05)" }}>
    <div style={{ padding: "20px 22px", background: C.mintPale, borderBottom: `1px solid ${C.line}` }}>
      <div style={{ fontSize: 16, color: C.ink, fontWeight: 900 }}>회사 지침 관리</div>
      <p style={{ margin: "6px 0 0", color: C.muted, fontSize: 12, lineHeight: 1.7 }}>저장한 지침과 개인정보가 제거된 학습 요약은 공용 저장소에 보관되어 모든 관리자 기기에서 동일하게 반영됩니다. 실제 고객 대본 원문은 저장하지 않습니다.</p>
    </div>
    <div style={{ padding: 22 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 10, marginBottom: 18 }}>
        {[['01', '필수 식순', '기본 순서·생략 가능 순서'], ['02', '표현 기준', '반드시 쓰거나 피할 표현'], ['03', '학습 요약', '개인정보 제거 문체·전환 원칙']].map(([num, title, desc]) => <div key={num} style={{ border: `1px solid ${C.line}`, borderRadius: 10, padding: 12, background: "#FBFDFC" }}><div style={{ color: C.mint, fontSize: 10, fontWeight: 900 }}>{num}</div><div style={{ color: C.ink, fontSize: 13, fontWeight: 900, marginTop: 3 }}>{title}</div><div style={{ color: C.muted, fontSize: 10, marginTop: 3, lineHeight: 1.5 }}>{desc}</div></div>)}
      </div>
      <section style={{ marginBottom: 22, border: `1px solid #BCE8E0`, borderRadius: 12, overflow: "hidden", background: "#FBFFFE" }}>
        <div style={{ padding: "14px 15px", background: C.mintPale, borderBottom: "1px solid #BCE8E0" }}><div style={{ color: C.ink, fontSize: 14, fontWeight: 900 }}>AI 지침 아이디어 대화</div><div style={{ color: C.muted, fontSize: 10, lineHeight: 1.6, marginTop: 4 }}>운영 아이디어나 지침으로 정리하고 싶은 내용을 편하게 설명하세요. AI 답변은 자동 저장되지 않으며, 필요한 문장만 복사해 아래 회사 지침 칸에 직접 붙여넣으면 됩니다.</div></div>
        <div style={{ padding: 14 }}>
          {guideChatMessages.length > 0 && <div style={{ display: "grid", gap: 9, maxHeight: 340, overflowY: "auto", marginBottom: 12, paddingRight: 2 }}>{guideChatMessages.map((message, index) => <div key={`${message.createdAt}-${index}`} style={{ justifySelf: message.role === "user" ? "end" : "start", maxWidth: "94%", padding: "10px 11px", borderRadius: message.role === "user" ? "12px 12px 3px 12px" : "12px 12px 12px 3px", background: message.role === "user" ? C.ink : C.white, color: message.role === "user" ? C.white : C.text, border: message.role === "assistant" ? `1px solid ${C.line}` : "none", fontSize: 12, lineHeight: 1.7, whiteSpace: "pre-wrap" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 4 }}><span style={{ fontSize: 9, fontWeight: 900, color: message.role === "user" ? "#BFEDE5" : C.mint }}>{message.role === "user" ? "나의 아이디어" : "AI 아이디어 정리"}</span>{message.role === "assistant" && <button onClick={() => void copyGuideChatAnswer(message.content, index)} style={{ flexShrink: 0, border: `1px solid ${C.line}`, borderRadius: 6, background: C.white, color: C.ink, fontSize: 10, fontWeight: 800, padding: "4px 7px", cursor: "pointer", fontFamily: "inherit" }}>{copiedGuideChatIndex === index ? "복사 완료" : "답변 복사"}</button>}</div>{message.content}</div>)}</div>}
          {guideChatMessages.length === 0 && <div style={{ color: C.muted, background: C.white, border: `1px dashed ${C.line}`, borderRadius: 9, padding: "10px 11px", fontSize: 11, lineHeight: 1.65, marginBottom: 11 }}>예: “신부 입장 전 멘트는 이런 분위기로 진행하고 싶어. 회사 지침 문장으로 정리해줘.” 또는 “축가 소개에서 반드시 피해야 할 표현을 같이 정리해보자.”</div>}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 9 }}>{["이 내용을 지침 문장으로 정리해줘", "금지 표현 기준을 함께 정리해보자", "현재 지침에서 빠진 확인 사항을 제안해줘"].map((suggestion) => <button key={suggestion} onClick={() => setGuideChatInput(suggestion)} disabled={guideChatLoading} style={{ border: `1px solid ${C.line}`, borderRadius: 999, background: C.white, color: C.muted, padding: "5px 8px", fontSize: 10, cursor: "pointer", fontFamily: "inherit" }}>{suggestion}</button>)}</div>
          <TextArea value={guideChatInput} onChange={setGuideChatInput} rows={4} placeholder="추가하고 싶은 원칙, 고민되는 표현, 운영 아이디어를 편하게 입력하세요." />
          {guideChatError && <div style={{ marginTop: 8, padding: "8px 10px", borderRadius: 7, background: "#FFF2F2", color: "#B53B3B", fontSize: 10, lineHeight: 1.55 }}>{guideChatError}</div>}
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", marginTop: 10 }}><span style={{ color: C.muted, fontSize: 10, lineHeight: 1.45 }}>대화 내용은 이 브라우저에서만 이어지며 공용 지침에 자동 저장되지 않습니다.</span><PrimaryButton onClick={askGuideAssistant} disabled={guideChatLoading || !guideChatInput.trim()}>{guideChatLoading ? "AI가 정리 중입니다…" : "AI에게 물어보기"}</PrimaryButton></div>
        </div>
      </section>
      <FieldLabel>이너스뮤직 회사 지침</FieldLabel>
      <TextArea value={guide} onChange={onChange} rows={24} placeholder="회사 대본 작성 기준, 금지 표현, 식순 원칙, 좋은 멘트 예시를 입력하세요." />
      <div style={{ display: "flex", gap: 9, flexWrap: "wrap", alignItems: "center", marginTop: 16 }}>
        <PrimaryButton onClick={() => save()} disabled={saving || loading || restoring}>{saving ? "공용 저장 중…" : "공용 지침 저장"}</PrimaryButton>
        <button onClick={() => setShowVersions((value) => !value)} disabled={saving || loading || restoring || versions.length === 0} style={{ minHeight: 46, padding: "0 15px", borderRadius: 10, border: `1px solid ${C.mint}`, background: showVersions ? C.mintSoft : C.white, color: C.ink, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>{showVersions ? "저장 버전 닫기" : `저장 버전 복원${versions.length ? ` (${versions.length})` : ""}`}</button>
        <button onClick={() => { void onReload().then(() => setStatus("공용 저장소의 최신 지침을 불러왔습니다.")).catch((error) => setStatus(error instanceof Error ? error.message : "새로고침에 실패했습니다.")); }} disabled={loading || saving || restoring} style={{ minHeight: 46, padding: "0 15px", borderRadius: 10, border: `1px solid ${C.line}`, background: C.white, color: C.muted, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>최신 지침 불러오기</button>
      </div>
      <div style={{ color: status ? (status.includes("실패") || status.includes("입력") || status.includes("지원") ? "#B53B3B" : C.mint) : C.muted, fontSize: 11, fontWeight: status ? 800 : 500, lineHeight: 1.65, marginTop: 10 }}>{status || (updatedAt ? `마지막 공용 저장: ${new Date(updatedAt).toLocaleString("ko-KR")}` : "아직 공용 저장된 지침이 없습니다. 첫 저장 후 버전 선택 복원을 사용할 수 있습니다.")}</div>
      {showVersions && <div style={{ marginTop: 16, padding: 14, borderRadius: 11, border: `1px solid #BCE8E0`, background: C.mintPale }}><div style={{ color: C.ink, fontWeight: 900, fontSize: 13 }}>저장된 지침 버전 선택</div><p style={{ margin: "5px 0 12px", color: C.muted, fontSize: 10, lineHeight: 1.6 }}>저장할 때마다 최대 20개 버전이 보관됩니다. 원하는 버전만 선택해 현재 공용 지침으로 복원할 수 있습니다.</p><div style={{ display: "grid", gap: 8 }}>{versions.map((version) => <article key={version.id} style={{ border: `1px solid ${version.id === currentVersionId ? C.mint : C.line}`, borderRadius: 9, padding: "10px 11px", background: C.white }}><div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}><div style={{ minWidth: 0 }}><div style={{ color: C.ink, fontWeight: 900, fontSize: 11 }}>{new Date(version.savedAt).toLocaleString("ko-KR")}{version.id === currentVersionId && <span style={{ marginLeft: 6, color: C.mint, fontSize: 10 }}>현재 사용 중</span>}</div><div style={{ marginTop: 4, color: C.muted, fontSize: 10, lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{version.guide.replace(/[#*`\n]/g, " ").replace(/\s+/g, " ").trim().slice(0, 95) || "내용 없음"}</div></div><button onClick={() => void restoreVersion(version)} disabled={restoring || version.id === currentVersionId} style={{ flexShrink: 0, border: "none", borderRadius: 7, background: version.id === currentVersionId ? "#E9EEEE" : C.mint, color: version.id === currentVersionId ? C.muted : C.white, fontWeight: 800, fontSize: 10, padding: "8px 9px", cursor: version.id === currentVersionId ? "default" : "pointer", fontFamily: "inherit" }}>{version.id === currentVersionId ? "현재 버전" : restoring ? "복원 중…" : "이 버전 복원"}</button></div></article>)}</div></div>}

      <div style={{ marginTop: 28, paddingTop: 22, borderTop: `1px solid ${C.line}` }}>
        <div style={{ fontSize: 14, color: C.ink, fontWeight: 900 }}>대본 예시 학습 요약</div>
        <p style={{ margin: "6px 0 14px", color: C.muted, fontSize: 11, lineHeight: 1.7 }}>예시 원문을 잠시 분석해 문체·식순·전환 방식만 비식별 요약으로 저장합니다. 신랑·신부 이름, 연락처, 예식장 등 원문은 저장되지 않습니다.</p>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: 9, alignItems: "end", marginBottom: 10 }}>
          <div><FieldLabel optional>예시 제목</FieldLabel><Input value={exampleTitle} onChange={setExampleTitle} placeholder="예: 프리미엄 본식 진행 흐름" /></div>
          <label style={{ minHeight: 44, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 13px", borderRadius: 9, border: `1px solid ${C.line}`, background: C.white, color: C.ink, fontWeight: 800, cursor: "pointer", fontSize: 12 }}>
            엑셀·텍스트 불러오기
            <input type="file" accept=".xlsx,.txt,.md,.csv" style={{ display: "none" }} onChange={(event) => { const file = event.target.files?.[0]; if (!file) return; void loadExampleFile(file).catch((error) => setStatus(error instanceof Error ? error.message : "파일을 불러오지 못했습니다.")); event.currentTarget.value = ""; }} />
          </label>
        </div>
        <TextArea value={exampleSource} onChange={setExampleSource} rows={8} placeholder="실제 대본 예시를 붙여넣거나 엑셀(.xlsx)·텍스트 파일에서 불러오세요. 분석 후 원문은 저장되지 않고, 개인정보를 제외한 학습 요약만 공용 저장됩니다." />
        <div style={{ display: "flex", gap: 9, flexWrap: "wrap", alignItems: "center", marginTop: 12 }}><PrimaryButton onClick={learnExample} disabled={learning || saving}>{learning ? "개인정보를 제외해 학습 중…" : "학습 요약 생성·공용 저장"}</PrimaryButton><span style={{ color: C.muted, fontSize: 10 }}>지원: .xlsx, .txt, .md, .csv · Word/PDF는 내용을 붙여넣어주세요.</span></div>
        {patterns.length > 0 && <div style={{ display: "grid", gap: 10, marginTop: 18 }}>{patterns.map((pattern) => <article key={pattern.id} style={{ border: `1px solid ${C.line}`, borderRadius: 10, padding: "13px 14px", background: "#FBFDFC" }}><div style={{ display: "flex", gap: 10, justifyContent: "space-between", alignItems: "start" }}><div><div style={{ color: C.ink, fontSize: 12, fontWeight: 900 }}>{pattern.title}</div><div style={{ color: C.muted, fontSize: 10, marginTop: 3 }}>{new Date(pattern.createdAt).toLocaleString("ko-KR")}</div></div><button onClick={() => { if (window.confirm("이 학습 요약을 공용 저장소에서 삭제할까요?")) void deletePattern(pattern.id); }} style={{ border: "none", background: "transparent", color: C.coral, fontSize: 11, fontWeight: 800, cursor: "pointer", padding: 0 }}>삭제</button></div><div style={{ color: C.text, fontSize: 11, lineHeight: 1.7, whiteSpace: "pre-wrap", marginTop: 10 }}>{pattern.summary}</div></article>)}</div>}
      </div>
    </div>
  </section>;
}

export default function AiScript() {
  const [password, setPassword] = useState(() => sessionStorage.getItem("inus_ai_script_password") || "");
  const [passwordInput, setPasswordInput] = useState("");
  const [authenticated, setAuthenticated] = useState(() => Boolean(sessionStorage.getItem("inus_ai_script_password")));
  const [form, setForm] = useState<FormValues>(defaultForm);
  const [script, setScript] = useState<GeneratedScript | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [revisionInstruction, setRevisionInstruction] = useState("");
  const [revisionMessages, setRevisionMessages] = useState<RevisionMessage[]>([]);
  const [revisionLoading, setRevisionLoading] = useState(false);
  const [revisionError, setRevisionError] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("generator");
  const [companyGuide, setCompanyGuide] = useState(DEFAULT_COMPANY_GUIDE);
  const [learnedPatterns, setLearnedPatterns] = useState<LearnedPattern[]>([]);
  const [guideHistory, setGuideHistory] = useState<GuideVersion[]>([]);
  const [currentGuideVersionId, setCurrentGuideVersionId] = useState<string | null>(null);
  const [guideUpdatedAt, setGuideUpdatedAt] = useState<string | null>(null);
  const [guideLoading, setGuideLoading] = useState(false);
  const [uploadedScript, setUploadedScript] = useState<GeneratedScript | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadRevisionInstruction, setUploadRevisionInstruction] = useState("");
  const [uploadRevisionMessages, setUploadRevisionMessages] = useState<RevisionMessage[]>([]);
  const [uploadRevisionLoading, setUploadRevisionLoading] = useState(false);
  const [uploadRevisionError, setUploadRevisionError] = useState("");

  const loadSharedGuide = async () => {
    if (!password) return;
    setGuideLoading(true);
    try {
      const response = await fetch(GUIDE_API_URL, { headers: { "X-Inus-Ai-Password": password, "Cache-Control": "no-cache" } });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 401) { sessionStorage.removeItem("inus_ai_script_password"); setAuthenticated(false); setPassword(""); }
        throw new Error(result.error || "공용 회사 지침을 불러오지 못했습니다.");
      }
      const data = result as SharedGuideResponse;
      setCompanyGuide(data.guide?.trim() || DEFAULT_COMPANY_GUIDE);
      setLearnedPatterns(Array.isArray(data.learnedPatterns) ? data.learnedPatterns : []);
      setGuideHistory(Array.isArray(data.guideHistory) ? data.guideHistory : []);
      setCurrentGuideVersionId(data.currentVersionId || null);
      setGuideUpdatedAt(data.updatedAt || null);
    } finally { setGuideLoading(false); }
  };

  const saveSharedGuide = async (guide: string, patterns: LearnedPattern[]) => {
    const response = await fetch(GUIDE_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Inus-Ai-Password": password },
      body: JSON.stringify({ guide, learnedPatterns: patterns }),
    });
    const result = await response.json();
    if (!response.ok) {
      if (response.status === 401) { sessionStorage.removeItem("inus_ai_script_password"); setAuthenticated(false); setPassword(""); }
      throw new Error(result.error || "공용 회사 지침 저장에 실패했습니다.");
    }
    const data = result as SharedGuideResponse;
    setCompanyGuide(data.guide || guide);
    setLearnedPatterns(Array.isArray(data.learnedPatterns) ? data.learnedPatterns : patterns);
    setGuideHistory(Array.isArray(data.guideHistory) ? data.guideHistory : []);
    setCurrentGuideVersionId(data.currentVersionId || null);
    setGuideUpdatedAt(data.updatedAt || null);
  };

  const restoreSharedGuideVersion = async (versionId: string) => {
    const response = await fetch(GUIDE_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Inus-Ai-Password": password },
      body: JSON.stringify({ restoreVersionId: versionId }),
    });
    const result = await response.json();
    if (!response.ok) {
      if (response.status === 401) { sessionStorage.removeItem("inus_ai_script_password"); setAuthenticated(false); setPassword(""); }
      throw new Error(result.error || "저장 버전 복원에 실패했습니다.");
    }
    const data = result as SharedGuideResponse;
    setCompanyGuide(data.guide || DEFAULT_COMPANY_GUIDE);
    setLearnedPatterns(Array.isArray(data.learnedPatterns) ? data.learnedPatterns : []);
    setGuideHistory(Array.isArray(data.guideHistory) ? data.guideHistory : []);
    setCurrentGuideVersionId(data.currentVersionId || null);
    setGuideUpdatedAt(data.updatedAt || null);
  };

  useEffect(() => {
    if (authenticated && password) void loadSharedGuide().catch(() => undefined);
  }, [authenticated, password]);

  const update = <K extends keyof FormValues>(key: K, value: FormValues[K]) => setForm(prev => ({ ...prev, [key]: value }));
  const sectionCount = script?.sections.length || 0;

  const fullPlainText = useMemo(() => script ? script.sections.map(s => `[${s.no}. ${s.order}]\n${stripTags(s.script)}${s.note ? `\n※ ${s.note}` : ""}`).join("\n\n") : "", [script]);
  const guideForGeneration = useMemo(() => {
    const summaries = learnedPatterns.map((pattern, index) => `[학습 요약 ${index + 1}: ${pattern.title}]\n${pattern.summary}`);
    return [companyGuide, ...summaries].filter(Boolean).join("\n\n");
  }, [companyGuide, learnedPatterns]);

  const login = () => {
    if (!passwordInput.trim()) return;
    sessionStorage.setItem("inus_ai_script_password", passwordInput.trim());
    setPassword(passwordInput.trim());
    setPasswordInput("");
    setAuthenticated(true);
  };

  const generate = async () => {
    if (!form.groomName.trim() || !form.brideName.trim()) {
      setError("신랑·신부 이름을 모두 입력해주세요.");
      return;
    }
    setLoading(true); setError(""); setScript(null); setRevisionMessages([]); setRevisionInstruction(""); setRevisionError("");
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Inus-Ai-Password": password },
        body: JSON.stringify({ ...form, companyGuide: guideForGeneration }),
      });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 401) { sessionStorage.removeItem("inus_ai_script_password"); setAuthenticated(false); setPassword(""); }
        throw new Error(result.error || "대본 생성에 실패했습니다.");
      }
      setScript(result.script as GeneratedScript);
    } catch (e) {
      setError(e instanceof Error ? e.message : "대본 생성 중 오류가 발생했습니다.");
    } finally { setLoading(false); }
  };

  const reviseScript = async () => {
    if (!script || !revisionInstruction.trim() || revisionLoading) return;
    const userMessage: RevisionMessage = { role: "user", content: revisionInstruction.trim(), createdAt: new Date().toISOString() };
    const conversation = [...revisionMessages, userMessage];
    setRevisionMessages(conversation);
    setRevisionInstruction("");
    setRevisionLoading(true); setRevisionError("");
    try {
      const response = await fetch(REVISION_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Inus-Ai-Password": password },
        body: JSON.stringify({ instruction: userMessage.content, script, companyGuide: guideForGeneration, conversation }),
      });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 401) { sessionStorage.removeItem("inus_ai_script_password"); setAuthenticated(false); setPassword(""); }
        throw new Error(result.error || "AI 대본 수정에 실패했습니다.");
      }
      setScript(result.script as GeneratedScript);
      setRevisionMessages((current) => [...current, { role: "assistant", content: String(result.assistantMessage || "요청하신 내용을 반영해 대본을 수정했습니다."), createdAt: new Date().toISOString() }]);
    } catch (e) {
      setRevisionError(e instanceof Error ? e.message : "AI 대본 수정 중 오류가 발생했습니다.");
    } finally { setRevisionLoading(false); }
  };

  const updateSection = (index: number, field: keyof ScriptSection, value: string) => {
    setScript(current => current ? { ...current, sections: current.sections.map((section, i) => i === index ? { ...section, [field]: field === "no" ? Number(value) : value } : section) } : current);
  };

  const updateUploadedSection = (index: number, field: keyof ScriptSection, value: string) => {
    setUploadedScript(current => current ? { ...current, sections: current.sections.map((section, i) => i === index ? { ...section, [field]: field === "no" ? Number(value) : value } : section) } : current);
  };

  const uploadExistingScript = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".xlsx")) throw new Error("이너스뮤직 사회 대본 엑셀(.xlsx) 파일만 올려주세요.");
    if (file.size > 8 * 1024 * 1024) throw new Error("업로드 파일은 8MB 이하만 가능합니다.");
    setUploadLoading(true); setUploadError("");
    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(await file.arrayBuffer());
      const worksheet = workbook.worksheets[0];
      if (!worksheet) throw new Error("엑셀 시트를 찾지 못했습니다.");
      const normalizeHeader = (value: string) => value.replace(/\s+/g, "").replace(/[·:]/g, "").toLowerCase();
      const aliases: Record<string, string[]> = {
        no: ["번호", "no"], order: ["식순", "순서"], time: ["시간", "예식시간"], script: ["진행멘트", "멘트", "대본"], note: ["사회자참고비고", "비고", "참고사항"],
      };
      let headerRowNumber = 0;
      let columns: Record<string, number> = {};
      for (let rowNumber = 1; rowNumber <= Math.min(worksheet.rowCount, 30); rowNumber += 1) {
        const row = worksheet.getRow(rowNumber);
        const candidate: Record<string, number> = {};
        for (let columnNumber = 1; columnNumber <= Math.max(worksheet.columnCount, 5); columnNumber += 1) {
          const text = normalizeHeader(String(row.getCell(columnNumber).text || ""));
          Object.entries(aliases).forEach(([key, names]) => { if (names.includes(text)) candidate[key] = columnNumber; });
        }
        if (candidate.order && candidate.script) { headerRowNumber = rowNumber; columns = candidate; break; }
      }
      if (!headerRowNumber) throw new Error("식순·진행 멘트 열을 찾지 못했습니다. 이너스뮤직에서 내려받은 대본 엑셀인지 확인해주세요.");
      const sections: ScriptSection[] = [];
      for (let rowNumber = headerRowNumber + 1; rowNumber <= worksheet.rowCount; rowNumber += 1) {
        const row = worksheet.getRow(rowNumber);
        const order = String(row.getCell(columns.order).text || "").trim();
        const scriptText = String(row.getCell(columns.script).text || "").trim();
        if (!order && !scriptText) continue;
        if (/새로운시작|이너스뮤직/.test(`${order} ${scriptText}`) && !scriptText) continue;
        if (!order || !scriptText) continue;
        const noText = columns.no ? String(row.getCell(columns.no).text || "") : "";
        sections.push({
          no: Number(noText.replace(/[^0-9]/g, "")) || sections.length + 1,
          order,
          time: columns.time ? String(row.getCell(columns.time).text || "").trim() : "",
          script: scriptText,
          note: columns.note ? String(row.getCell(columns.note).text || "").trim() : "",
        });
      }
      if (!sections.length) throw new Error("수정할 대본 식순을 읽지 못했습니다. 엑셀 파일의 내용이 비어 있는지 확인해주세요.");
      const title = String(worksheet.getCell("A1").text || "").trim() || "업로드한 결혼식 사회 대본";
      const subtitle = String(worksheet.getCell("A2").text || "").trim();
      setUploadedScript({ title, subtitle, sections, review_flags: [] });
      setUploadedFileName(file.name);
      setUploadRevisionMessages([]); setUploadRevisionInstruction(""); setUploadRevisionError("");
    } finally { setUploadLoading(false); }
  };

  const reviseUploadedScript = async () => {
    if (!uploadedScript || !uploadRevisionInstruction.trim() || uploadRevisionLoading) return;
    const userMessage: RevisionMessage = { role: "user", content: uploadRevisionInstruction.trim(), createdAt: new Date().toISOString() };
    const conversation = [...uploadRevisionMessages, userMessage];
    setUploadRevisionMessages(conversation);
    setUploadRevisionInstruction("");
    setUploadRevisionLoading(true); setUploadRevisionError("");
    try {
      const response = await fetch(REVISION_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Inus-Ai-Password": password },
        body: JSON.stringify({ instruction: userMessage.content, script: uploadedScript, companyGuide: guideForGeneration, conversation }),
      });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 401) { sessionStorage.removeItem("inus_ai_script_password"); setAuthenticated(false); setPassword(""); }
        throw new Error(result.error || "업로드 대본 수정에 실패했습니다.");
      }
      setUploadedScript(result.script as GeneratedScript);
      setUploadRevisionMessages((current) => [...current, { role: "assistant", content: String(result.assistantMessage || "요청하신 내용을 반영했습니다."), createdAt: new Date().toISOString() }]);
    } catch (error) {
      setUploadRevisionError(error instanceof Error ? error.message : "업로드 대본 수정 중 오류가 발생했습니다.");
    } finally { setUploadRevisionLoading(false); }
  };

  const copyScript = async () => {
    await navigator.clipboard.writeText(fullPlainText);
    setCopied(true); window.setTimeout(() => setCopied(false), 1800);
  };

  const downloadExcel = async (targetScript: GeneratedScript | null = script, filename?: string) => {
    if (!targetScript) return;
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "이너스뮤직";
    workbook.created = new Date();
    const worksheet = workbook.addWorksheet("예식 대본", { views: [{ showGridLines: false, state: "frozen", ySplit: 3 }] });
    worksheet.columns = [
      { width: 6.5 }, { width: 18 }, { width: 13 }, { width: 76 }, { width: 35 },
    ];
    worksheet.pageSetup = { orientation: "landscape", fitToPage: true, fitToWidth: 1, fitToHeight: 0, paperSize: 9, margins: { left: 0.25, right: 0.25, top: 0.35, bottom: 0.35, header: 0.15, footer: 0.15 } };
    worksheet.headerFooter.oddFooter = "&C이너스뮤직 · 결혼식 사회 대본";

    const fontName = "맑은 고딕";
    const thin = { style: "thin" as const, color: { argb: "FFB8D9D4" } };
    const divider = { style: "medium" as const, color: { argb: "FF319587" } };
    const solidFill = (argb: string) => ({ type: "pattern" as const, pattern: "solid" as const, fgColor: { argb } });

    worksheet.mergeCells("A1:E1");
    const title = worksheet.getCell("A1");
    title.value = targetScript.title || `${form.groomName} 신랑 · ${form.brideName} 신부 결혼식 사회 대본`;
    title.font = { name: fontName, size: 16, bold: true, color: { argb: "FFFFFFFF" } };
    title.fill = solidFill("FF2F8077");
    title.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    worksheet.getRow(1).height = 32;

    worksheet.mergeCells("A2:E2");
    const subtitle = worksheet.getCell("A2");
    subtitle.value = targetScript.subtitle || `사회자: ${form.mcName || "미정"}`;
    subtitle.font = { name: fontName, size: 11, bold: true, color: { argb: "FF285A54" } };
    subtitle.fill = solidFill("FFDDF4EF");
    subtitle.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    subtitle.border = { bottom: divider };
    worksheet.getRow(2).height = 24;

    const header = worksheet.getRow(3);
    ["번호", "식순", "시간", "진행 멘트", "사회자 참고 비고"].forEach((value, index) => header.getCell(index + 1).value = value);
    header.height = 27;
    header.eachCell(cell => {
      cell.font = { name: fontName, size: 10, bold: true, color: { argb: "FF1B514B" } };
      cell.fill = solidFill("FFBEEDE6");
      cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
      cell.border = { top: thin, bottom: divider, left: thin, right: thin };
    });

    const sectionColors = [
      { no: "FF8DDDD2", order: "FFC0F1EA", time: "FFE6F8F5", note: "FFF4FCFA" },
      { no: "FF9EE3D8", order: "FFD0F4ED", time: "FFEAF9F6", note: "FFF6FCFB" },
      { no: "FF80D4C8", order: "FFB9ECE4", time: "FFE2F6F2", note: "FFF2FBF9" },
    ];

    targetScript.sections.forEach((section, index) => {
      const color = sectionColors[index % sectionColors.length];
      const row = worksheet.addRow([section.no, section.order, section.time, "", section.note]);
      const scriptText = stripTags(section.script);
      const estimatedLines = scriptText.split("\n").reduce((sum, line) => sum + Math.max(1, Math.ceil(line.length / 52)), 0);
      row.height = Math.max(58, Math.min(330, estimatedLines * 16 + 22));
      row.getCell(4).value = toRichText(section.script);

      row.getCell(1).fill = solidFill(color.no);
      row.getCell(1).font = { name: fontName, size: 12, bold: true, color: { argb: "FF164E48" } };
      row.getCell(2).fill = solidFill(color.order);
      row.getCell(2).font = { name: fontName, size: 11, bold: true, color: { argb: "FF194F49" } };
      row.getCell(3).fill = solidFill(color.time);
      row.getCell(3).font = { name: fontName, size: 10, italic: true, color: { argb: "FF317D73" } };
      row.getCell(4).fill = solidFill("FFFFFFFF");
      row.getCell(5).fill = solidFill(color.note);
      row.getCell(5).font = { name: fontName, size: 9, italic: true, color: { argb: "FF3E625D" } };

      row.eachCell((cell, column) => {
        cell.border = { top: thin, bottom: divider, left: thin, right: thin };
        cell.alignment = { horizontal: column <= 3 ? "center" : "left", vertical: column <= 3 ? "middle" : "top", wrapText: true };
        if (column === 4) cell.font = { name: fontName, size: 10, color: { argb: "FF202B29" } };
      });
    });

    const footerRow = worksheet.addRow(["두 분의 새로운 시작을 진심으로 축하합니다 · 이너스뮤직"]);
    worksheet.mergeCells(`A${footerRow.number}:E${footerRow.number}`);
    footerRow.height = 28;
    const footer = worksheet.getCell(`A${footerRow.number}`);
    footer.font = { name: fontName, size: 10, bold: true, color: { argb: "FF2F8077" } };
    footer.fill = solidFill("FFE7F7F3");
    footer.alignment = { horizontal: "center", vertical: "middle" };
    footer.border = { top: divider, bottom: thin, left: thin, right: thin };

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename || `${formatFilenamePart(form.groomName)}_${formatFilenamePart(form.brideName)}_결혼식_사회대본.xlsx`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  if (!authenticated) {
    return <div style={{ minHeight: "100vh", fontFamily: "'Apple SD Gothic Neo','Noto Sans KR',sans-serif", background: `radial-gradient(circle at 20% 10%,#254C54 0,#111B2E 38%,#0B1322 100%)`, display: "grid", placeItems: "center", padding: 20 }}>
      <div style={{ width: "min(100%,420px)", background: "rgba(255,255,255,.96)", borderRadius: 20, padding: "34px 28px", boxShadow: "0 24px 70px rgba(0,0,0,.35)" }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: C.mint, fontWeight: 900, marginBottom: 10 }}>INUS MUSIC · ADMIN</div>
        <h1 style={{ color: C.ink, fontSize: 25, margin: "0 0 9px", letterSpacing: "-1px" }}>AI 사회 대본 작성</h1>
        <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.7, margin: "0 0 25px" }}>회사 지침을 반영해 맞춤형 예식 사회 대본을 생성합니다.</p>
        <FieldLabel>관리자 비밀번호</FieldLabel>
        <input type="password" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} onKeyDown={e => e.key === "Enter" && login()} placeholder="비밀번호 입력" autoFocus
          style={{ boxSizing: "border-box", width: "100%", height: 46, border: `1px solid ${C.line}`, borderRadius: 9, padding: "0 13px", fontSize: 14, marginBottom: 12, outline: "none" }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
          <PrimaryButton onClick={login}>관리자 도구 열기</PrimaryButton>
          <a href={ADMIN_HOME} style={{ color: C.muted, textAlign: "center", fontSize: 12, textDecoration: "none", padding: 4 }}>← 기존 관리자 페이지로</a>
        </div>
      </div>
    </div>;
  }

  return <div style={{ minHeight: "100vh", background: C.cream, color: C.text, fontFamily: "'Apple SD Gothic Neo','Noto Sans KR',sans-serif" }}>
    <header style={{ background: C.ink, color: C.white, position: "sticky", top: 0, zIndex: 10, borderBottom: "1px solid rgba(255,255,255,.1)" }}>
      <div style={{ maxWidth: 1380, margin: "0 auto", padding: "15px 20px", display: "flex", alignItems: "center", gap: 14 }}>
        <a href={ADMIN_HOME} style={{ color: "#BFEDE5", textDecoration: "none", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>← 관리자</a>
        <div style={{ width: 1, height: 18, background: "rgba(255,255,255,.18)" }} />
        <div style={{ minWidth: 0, flex: 1 }}><div style={{ color: "#61D5C0", fontSize: 10, fontWeight: 900, letterSpacing: 2.6 }}>INUS MUSIC</div><div style={{ fontWeight: 800, fontSize: 16, letterSpacing: "-.4px" }}>AI 사회 대본 작성실</div></div>
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          {([ ["generator", "대본 작성"], ["editor", "대본 수정"], ["guide", "회사 지침"] ] as [WorkspaceTab, string][]).map(([key, label]) => <button key={key} onClick={() => setActiveTab(key)} style={{ background: activeTab === key ? "#61D5C0" : "transparent", border: `1px solid ${activeTab === key ? "#61D5C0" : "rgba(255,255,255,.25)"}`, borderRadius: 7, color: activeTab === key ? C.ink : "#E4EEEC", fontSize: 11, padding: "7px 9px", cursor: "pointer", fontFamily: "inherit", fontWeight: 800 }}>{label}</button>)}
          <button onClick={() => { sessionStorage.removeItem("inus_ai_script_password"); setAuthenticated(false); setPassword(""); }} style={{ background: "transparent", border: "1px solid rgba(255,255,255,.25)", borderRadius: 7, color: "#E4EEEC", fontSize: 11, padding: "7px 9px", cursor: "pointer", fontFamily: "inherit" }}>잠금</button>
        </div>
      </div>
    </header>

    <main style={{ maxWidth: 1380, margin: "0 auto", padding: "28px 20px 80px", boxSizing: "border-box" }}>
      {activeTab === "guide" ? <GuideManager guide={companyGuide} patterns={learnedPatterns} versions={guideHistory} currentVersionId={currentGuideVersionId} password={password} loading={guideLoading} updatedAt={guideUpdatedAt} onChange={setCompanyGuide} onPatternsChange={setLearnedPatterns} onSave={saveSharedGuide} onRestore={restoreSharedGuideVersion} onReload={loadSharedGuide} /> : activeTab === "editor" ? <>
        <div style={{ marginBottom: 22 }}>
          <h1 style={{ fontSize: 27, color: C.ink, margin: 0, letterSpacing: "-1.2px" }}>기존 대본 수정</h1>
          <p style={{ margin: "8px 0 0", fontSize: 13, color: C.muted, lineHeight: 1.7 }}>이전에 내려받은 이너스뮤직 사회 대본 엑셀을 올린 뒤 수정사항을 말하면 AI가 반영합니다. 수정 후에는 같은 진행용 양식의 엑셀로 다시 저장할 수 있습니다.</p>
        </div>
        {!uploadedScript ? <section style={{ maxWidth: 760, background: C.white, border: `1px solid ${C.line}`, borderRadius: 16, overflow: "hidden", boxShadow: "0 6px 25px rgba(19,36,59,.05)" }}>
          <div style={{ padding: "18px 20px", background: C.mintPale, borderBottom: `1px solid ${C.line}` }}><div style={{ fontSize: 14, fontWeight: 900, color: C.ink }}>01. 이전 대본 엑셀 불러오기</div><div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>대본 작성 화면에서 내려받은 `.xlsx` 파일을 선택해주세요.</div></div>
          <div style={{ padding: 22 }}>
            <label style={{ minHeight: 150, border: `2px dashed ${C.mint}`, borderRadius: 12, background: C.mintPale, display: "grid", placeItems: "center", textAlign: "center", padding: 20, cursor: uploadLoading ? "wait" : "pointer", boxSizing: "border-box" }}>
              <div><div style={{ color: C.ink, fontWeight: 900, fontSize: 15 }}>{uploadLoading ? "대본 엑셀을 읽는 중입니다…" : "대본 엑셀 파일 선택"}</div><div style={{ color: C.muted, fontSize: 11, marginTop: 7, lineHeight: 1.6 }}>지원 형식: `.xlsx` · 최대 8MB<br />식순·시간·진행 멘트·비고를 자동으로 읽어옵니다.</div></div>
              <input type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" disabled={uploadLoading} style={{ display: "none" }} onChange={(event) => { const file = event.target.files?.[0]; if (!file) return; void uploadExistingScript(file).catch((error) => setUploadError(error instanceof Error ? error.message : "엑셀 파일을 불러오지 못했습니다.")); event.currentTarget.value = ""; }} />
            </label>
            {uploadError && <div style={{ marginTop: 14, padding: "11px 12px", borderRadius: 9, background: "#FFF2F2", border: "1px solid #F1C2C2", color: "#B53B3B", fontSize: 12, lineHeight: 1.6 }}>⚠️ {uploadError}</div>}
          </div>
        </section> : <div className="ai-script-workspace ai-script-workspace--has-script">
          <section style={{ minWidth: 0, background: C.white, border: `1px solid ${C.line}`, borderRadius: 16, overflow: "hidden", boxShadow: "0 6px 25px rgba(19,36,59,.05)" }}>
            <div style={{ padding: "18px 20px", background: C.ink, color: C.white, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}><div style={{ flex: 1, minWidth: 180 }}><div style={{ color: "#61D5C0", fontSize: 10, fontWeight: 900, letterSpacing: 2 }}>UPLOADED SCRIPT</div><div style={{ fontWeight: 800, fontSize: 16, marginTop: 3 }}>{uploadedScript.title} · {uploadedScript.sections.length}개 식순</div><div style={{ color: "#BFEDE5", fontSize: 10, marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{uploadedFileName}</div></div><button onClick={() => { setUploadedScript(null); setUploadedFileName(""); setUploadError(""); setUploadRevisionMessages([]); }} style={{ border: "1px solid rgba(255,255,255,.25)", borderRadius: 7, background: "rgba(255,255,255,.08)", color: C.white, padding: "8px 10px", cursor: "pointer", fontFamily: "inherit", fontSize: 11 }}>다른 파일</button><button onClick={() => void downloadExcel(uploadedScript, `${formatFilenamePart(uploadedFileName.replace(/\.xlsx$/i, "") || "수정대본")}_수정본.xlsx`)} style={{ border: "none", borderRadius: 7, background: "#61D5C0", color: C.ink, padding: "8px 10px", cursor: "pointer", fontFamily: "inherit", fontWeight: 900, fontSize: 11 }}>수정본 엑셀 저장</button></div>
            <div style={{ padding: 18 }}>
              <div style={{ marginBottom: 16, padding: "12px 14px", background: C.mintPale, border: `1px solid #C4EEE8`, borderRadius: 10 }}><div style={{ color: C.ink, fontSize: 14, fontWeight: 900 }}>업로드한 대본을 직접 확인·수정할 수 있습니다.</div><div style={{ color: C.muted, fontSize: 11, lineHeight: 1.6, marginTop: 4 }}>오른쪽 대화창에서 AI 수정 요청을 보내거나, 각 식순의 내용을 직접 바꾼 뒤 수정본 엑셀 저장을 누르세요.</div><div style={{ marginTop: 8, padding: "7px 9px", borderRadius: 7, background: C.white, color: C.mint, fontSize: 10, fontWeight: 800, lineHeight: 1.55 }}>현재 공용 회사 지침과 저장된 대본 예시 학습 요약이 모든 AI 수정 요청에 우선 적용됩니다.</div></div>
              <div style={{ display: "grid", gap: 12 }}>{uploadedScript.sections.map((section, index) => <article key={`${section.no}-${index}`} style={{ border: `1px solid ${C.line}`, borderRadius: 11, overflow: "hidden" }}><div style={{ display: "grid", gridTemplateColumns: "38px minmax(0,1fr) auto", alignItems: "center", gap: 9, padding: "10px 12px", background: C.mintPale, borderBottom: `1px solid ${C.line}` }}><div style={{ width: 27, height: 27, display: "grid", placeItems: "center", borderRadius: "50%", background: C.mint, color: C.white, fontWeight: 900, fontSize: 12 }}>{section.no}</div><input value={section.order} onChange={e => updateUploadedSection(index, "order", e.target.value)} style={{ minWidth: 0, color: C.ink, fontWeight: 900, fontSize: 13, border: "none", background: "transparent", fontFamily: "inherit", outline: "none" }} /><input value={section.time} onChange={e => updateUploadedSection(index, "time", e.target.value)} style={{ width: 70, color: C.mint, fontWeight: 800, textAlign: "right", fontSize: 11, border: "none", background: "transparent", fontFamily: "inherit", outline: "none" }} /></div><div style={{ padding: 13 }}><textarea value={section.script} onChange={e => updateUploadedSection(index, "script", e.target.value)} rows={Math.max(5, Math.min(18, section.script.split("\n").length + 1))} style={{ boxSizing: "border-box", resize: "vertical", width: "100%", color: C.text, fontSize: 12, lineHeight: 1.72, border: `1px solid ${C.line}`, borderRadius: 7, padding: 10, fontFamily: "inherit", outline: "none", background: "#FEFEFE" }} /><div style={{ marginTop: 9 }}><FieldLabel optional>사회자 참고 비고</FieldLabel><TextArea value={section.note} onChange={v => updateUploadedSection(index, "note", v)} rows={2} placeholder="음원 타이밍, 확인 사항, 연출 주의사항" /></div></div></article>)}</div>
              <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end" }}><PrimaryButton onClick={() => void downloadExcel(uploadedScript, `${formatFilenamePart(uploadedFileName.replace(/\.xlsx$/i, "") || "수정대본")}_수정본.xlsx`)}>↓ 수정본 엑셀 저장</PrimaryButton></div>
            </div>
          </section>
          <RevisionSidebar messages={uploadRevisionMessages} instruction={uploadRevisionInstruction} loading={uploadRevisionLoading} error={uploadRevisionError} onInstructionChange={setUploadRevisionInstruction} onSubmit={reviseUploadedScript} />
        </div>}
      </> : <>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 27, color: C.ink, margin: 0, letterSpacing: "-1.2px" }}>맞춤형 사회 대본 생성</h1>
        <p style={{ margin: "8px 0 0", fontSize: 13, color: C.muted, lineHeight: 1.7 }}>필수 정보만으로 초안을 만든 뒤, 답변지·요청사항을 추가하면 회사 기준에 맞춰 더 정교하게 작성됩니다.</p>
      </div>

      <div className={`ai-script-workspace${script ? " ai-script-workspace--has-script" : ""}`}>
        <section style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 16, overflow: "hidden", boxShadow: "0 6px 25px rgba(19,36,59,.05)" }}>
          <div style={{ padding: "18px 20px", background: C.mintPale, borderBottom: `1px solid ${C.line}` }}><div style={{ fontSize: 14, fontWeight: 900, color: C.ink }}>01. 기본 정보</div><div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>신랑·신부 이름만 입력해도 기본 대본 초안을 생성합니다.</div></div>
          <div style={{ padding: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              <div><FieldLabel>신랑 이름</FieldLabel><Input value={form.groomName} onChange={v => update("groomName", v)} placeholder="예: 안규대" /></div>
              <div><FieldLabel>신부 이름</FieldLabel><Input value={form.brideName} onChange={v => update("brideName", v)} placeholder="예: 이희진" /></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              <div><FieldLabel optional>사회자 이름</FieldLabel><Input value={form.mcName} onChange={v => update("mcName", v)} placeholder="예: 석재선" /></div>
              <div><FieldLabel optional>예식장</FieldLabel><Input value={form.venue} onChange={v => update("venue", v)} placeholder="예: 더 리버사이드 호텔" /></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 17 }}>
              <div><FieldLabel optional>예식 날짜</FieldLabel><Input type="date" value={form.weddingDate} onChange={v => update("weddingDate", v)} /></div>
              <div><FieldLabel optional>예식 시간</FieldLabel><select value={form.weddingTime} onChange={e => update("weddingTime", e.target.value)} style={{ boxSizing: "border-box", width: "100%", height: 44, border: `1px solid ${C.line}`, borderRadius: 9, padding: "0 10px", background: C.white, fontFamily: "inherit", color: C.text }}><option value="">시간 미정</option>{WEDDING_TIME_OPTIONS.map((time) => <option key={time} value={time}>{time.replace(":", "시 ")}분</option>)}</select><div style={{ color: C.muted, fontSize: 9, marginTop: 4 }}>10분 단위 · 기본 12시 00분</div></div>
              <div><FieldLabel>대본 유형</FieldLabel><select value={form.ceremonyType} onChange={e => update("ceremonyType", e.target.value as CeremonyType)} style={{ boxSizing: "border-box", width: "100%", height: 44, border: `1px solid ${C.line}`, borderRadius: 9, padding: "0 10px", background: C.white, fontFamily: "inherit", color: C.text }}><option value="main">본식</option><option value="reception">2부 피로연</option></select></div>
            </div>

            <FieldLabel>혼주님 입장 · 화촉점화</FieldLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 6 }}>
              {([ ["lighting_only", "화촉점화만", "기본 · 혼주님 입장은 제외"], ["parents_and_lighting", "혼주님 입장 + 화촉점화", "혼주님 입장 후 화촉점화 진행"] ] as [FamilyEntranceMode, string, string][]).map(([key, label, description]) => <button key={key} onClick={() => update("familyEntranceMode", key)} style={{ border: form.familyEntranceMode === key ? `2px solid ${C.mint}` : `1px solid ${C.line}`, background: form.familyEntranceMode === key ? C.mintSoft : C.white, color: C.ink, borderRadius: 10, padding: "11px 8px", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}><div style={{ fontSize: 12, fontWeight: 900 }}>{label}</div><div style={{ color: C.muted, fontSize: 9, lineHeight: 1.45, marginTop: 3 }}>{description}</div></button>)}
            </div>
            <div style={{ color: C.muted, fontSize: 10, marginBottom: 18, lineHeight: 1.5 }}>기본은 화촉점화만입니다. 혼주님 입장 진행이 있는 예식만 두 번째 항목을 선택하세요.</div>

            <FieldLabel>신랑 · 신부 입장 방식</FieldLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 6 }}>
              {([ ["separate", "신랑 · 신부 따로 입장", "기본 · 신랑 입장 후 신부 입장"], ["together", "신랑 · 신부 동시입장", "두 분을 함께 소개하고 동시에 입장"] ] as [CoupleEntranceMode, string, string][]).map(([key, label, description]) => <button key={key} onClick={() => update("coupleEntranceMode", key)} style={{ border: form.coupleEntranceMode === key ? `2px solid ${C.mint}` : `1px solid ${C.line}`, background: form.coupleEntranceMode === key ? C.mintSoft : C.white, color: C.ink, borderRadius: 10, padding: "11px 8px", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}><div style={{ fontSize: 12, fontWeight: 900 }}>{label}</div><div style={{ color: C.muted, fontSize: 9, lineHeight: 1.45, marginTop: 3 }}>{description}</div></button>)}
            </div>
            <div style={{ color: C.muted, fontSize: 10, marginBottom: 18, lineHeight: 1.5 }}>기본은 신랑·신부 따로 입장입니다.</div>

            <FieldLabel>반지 교환</FieldLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 6 }}>
              {([ ["include", "반지 교환 있음", "기본 · 반지 교환 식순 생성"], ["exclude", "반지 교환 없음", "반지 교환 식순을 만들지 않음"] ] as [RingExchangeMode, string, string][]).map(([key, label, description]) => <button key={key} onClick={() => update("ringExchangeMode", key)} style={{ border: form.ringExchangeMode === key ? `2px solid ${C.mint}` : `1px solid ${C.line}`, background: form.ringExchangeMode === key ? C.mintSoft : C.white, color: C.ink, borderRadius: 10, padding: "11px 8px", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}><div style={{ fontSize: 12, fontWeight: 900 }}>{label}</div><div style={{ color: C.muted, fontSize: 9, lineHeight: 1.45, marginTop: 3 }}>{description}</div></button>)}
            </div>
            <div style={{ color: C.muted, fontSize: 10, marginBottom: 18, lineHeight: 1.5 }}>기본은 반지 교환 있음입니다.</div>

            <FieldLabel>대본 분위기</FieldLabel>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 20 }}>
              {([ ["classic", "클래식", "품격 있고 안정적인"], ["trendy", "트렌디", "세련되고 자연스러운"], ["warm", "감성", "따뜻하고 감동적인"] ] as [ScriptStyle, string, string][]).map(([key, label, description]) => <button key={key} onClick={() => update("style", key)} style={{ border: form.style === key ? `2px solid ${C.mint}` : `1px solid ${C.line}`, background: form.style === key ? C.mintSoft : C.white, color: C.ink, borderRadius: 10, padding: "11px 7px", cursor: "pointer", fontFamily: "inherit" }}><div style={{ fontSize: 12, fontWeight: 900 }}>{label}</div><div style={{ color: C.muted, fontSize: 9, marginTop: 3 }}>{description}</div></button>)}
            </div>

            <button onClick={() => setShowMore(value => !value)} style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between", color: C.ink, background: "transparent", border: "none", borderTop: `1px solid ${C.line}`, padding: "15px 0 3px", cursor: "pointer", fontFamily: "inherit", fontWeight: 800, fontSize: 13 }}><span>02. 답변지·요청사항 입력</span><span style={{ color: C.mint }}>{showMore ? "− 접기" : "+ 펼치기"}</span></button>
            {showMore && <div style={{ paddingTop: 14 }}>
              <div style={{ marginBottom: 14 }}><FieldLabel optional>신랑신부 스토리·답변지</FieldLabel><TextArea value={form.coupleStory} onChange={v => update("coupleStory", v)} rows={7} placeholder="첫 만남, 서로의 매력, 부모님께 드리는 말, 두 사람의 다짐 등 답변지 내용을 그대로 붙여넣으세요." /></div>
              <div style={{ marginBottom: 14 }}><FieldLabel optional>특별 요청·음원·연출</FieldLabel><TextArea value={form.requests} onChange={v => update("requests", v)} rows={5} placeholder="축가자, 곡명, 음원 타이밍, 서프라이즈 연출, 화동, 덕담 등 요청사항을 입력하세요." /></div>
              <div><FieldLabel optional>지정 식순</FieldLabel><TextArea value={form.customOrder} onChange={v => update("customOrder", v)} rows={3} placeholder="기본 식순과 달라야 하면 순서를 입력하세요. 예: 신랑 입장 → 신부 입장 → 축가 → 반지 교환" /></div>
            </div>}

            {error && <div style={{ marginTop: 16, padding: "11px 12px", borderRadius: 9, background: "#FFF2F2", border: "1px solid #F1C2C2", color: "#B53B3B", fontSize: 12, lineHeight: 1.6 }}>⚠️ {error}</div>}
            <div style={{ marginTop: 20, display: "flex", gap: 10, alignItems: "center" }}><PrimaryButton onClick={generate} disabled={loading}>{loading ? "AI가 대본을 작성 중입니다…" : "✦ AI 대본 생성"}</PrimaryButton><span style={{ color: C.muted, fontSize: 10, lineHeight: 1.5 }}>생성 후 직접 수정하고 엑셀로 저장할 수 있습니다.</span></div>
          </div>
        </section>

        {script && <section style={{ minWidth: 0, background: C.white, border: `1px solid ${C.line}`, borderRadius: 16, overflow: "hidden", boxShadow: "0 6px 25px rgba(19,36,59,.05)" }}>
          <div style={{ padding: "18px 20px", background: C.ink, color: C.white, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}><div style={{ flex: 1, minWidth: 190 }}><div style={{ color: "#61D5C0", fontSize: 10, fontWeight: 900, letterSpacing: 2 }}>DRAFT READY</div><div style={{ fontWeight: 800, fontSize: 16, marginTop: 3 }}>03. 생성된 사회 대본 · {sectionCount}개 식순</div></div><button onClick={copyScript} style={{ border: "1px solid rgba(255,255,255,.25)", borderRadius: 7, background: "rgba(255,255,255,.08)", color: C.white, padding: "8px 10px", cursor: "pointer", fontFamily: "inherit", fontSize: 11 }}>{copied ? "복사 완료" : "전체 복사"}</button><button onClick={() => void downloadExcel()} style={{ border: "none", borderRadius: 7, background: "#61D5C0", color: C.ink, padding: "8px 10px", cursor: "pointer", fontFamily: "inherit", fontWeight: 900, fontSize: 11 }}>엑셀 다운로드</button></div>
          <div style={{ padding: 18 }}>
            <div style={{ marginBottom: 16, padding: "12px 14px", background: C.mintPale, border: `1px solid #C4EEE8`, borderRadius: 10 }}><div style={{ color: C.ink, fontSize: 14, fontWeight: 900 }}>{script.title}</div><div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>{script.subtitle}</div><div style={{ color: C.coral, fontSize: 10, marginTop: 8 }}>빨간색 굵은 글씨는 답변지·요청사항 인용 구간이며, 엑셀에도 동일하게 적용됩니다.</div></div>
            {script.review_flags.length > 0 && <div style={{ marginBottom: 16, padding: "11px 13px", background: "#FFF9E9", border: "1px solid #F2DFAB", borderRadius: 10 }}><div style={{ color: "#8A671D", fontSize: 11, fontWeight: 900, marginBottom: 6 }}>⚑ 발송 전 확인 필요</div>{script.review_flags.map((flag, index) => <div key={index} style={{ color: "#81672B", fontSize: 11, lineHeight: 1.6 }}>• {flag}</div>)}</div>}
            <section style={{ display: "none" }} aria-hidden="true">
              <div style={{ padding: "12px 14px", background: C.mintPale, borderBottom: "1px solid #BCE8E0" }}><div style={{ color: C.ink, fontSize: 13, fontWeight: 900 }}>AI와 대화하며 대본 다듬기</div><div style={{ color: C.muted, fontSize: 10, lineHeight: 1.55, marginTop: 4 }}>현재 작성된 전체 대본을 기준으로 요청한 부분만 수정합니다. 수정 후에도 다시 이어서 지시할 수 있습니다.</div></div>
              <div style={{ padding: 13 }}>
                {revisionMessages.length > 0 && <div style={{ display: "grid", gap: 8, maxHeight: 230, overflowY: "auto", marginBottom: 11, paddingRight: 2 }}>{revisionMessages.map((message, index) => <div key={`${message.createdAt}-${index}`} style={{ justifySelf: message.role === "user" ? "end" : "start", maxWidth: "92%", padding: "9px 11px", borderRadius: message.role === "user" ? "11px 11px 2px 11px" : "11px 11px 11px 2px", background: message.role === "user" ? C.ink : C.mintSoft, color: message.role === "user" ? C.white : C.text, fontSize: 11, lineHeight: 1.65, whiteSpace: "pre-wrap" }}><div style={{ fontSize: 9, fontWeight: 900, color: message.role === "user" ? "#BFEDE5" : C.mint, marginBottom: 3 }}>{message.role === "user" ? "나의 수정 요청" : "AI 수정 완료"}</div>{message.content}</div>)}</div>}
                {revisionMessages.length === 0 && <div style={{ color: C.muted, background: C.white, border: `1px dashed ${C.line}`, borderRadius: 9, padding: "10px 11px", fontSize: 10, lineHeight: 1.65, marginBottom: 11 }}>예: “오프닝을 조금 더 감성적으로 바꿔줘”, “신부 입장 멘트만 더 웅장하게”, “축가 소개는 두 문장으로 짧게”, “전체적으로 너무 길어서 20% 줄여줘”</div>}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 9 }}>{["오프닝을 더 감성적으로", "신부 입장만 더 웅장하게", "전체 멘트를 조금 더 간결하게", "축가 소개를 자연스럽게 다듬어줘"].map((suggestion) => <button key={suggestion} onClick={() => setRevisionInstruction(suggestion)} disabled={revisionLoading} style={{ border: `1px solid ${C.line}`, borderRadius: 999, background: C.white, color: C.muted, padding: "5px 8px", fontSize: 10, cursor: "pointer", fontFamily: "inherit" }}>{suggestion}</button>)}</div>
                <TextArea value={revisionInstruction} onChange={setRevisionInstruction} rows={3} placeholder="수정 요청을 자연스럽게 입력하세요. 예: 화촉점화부터 신랑 입장까지의 연결이 매끄럽게 이어지도록 수정해줘." />
                {revisionError && <div style={{ marginTop: 8, padding: "8px 10px", borderRadius: 7, background: "#FFF2F2", color: "#B53B3B", fontSize: 10, lineHeight: 1.55 }}>{revisionError}</div>}
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", marginTop: 10 }}><span style={{ color: C.muted, fontSize: 10, lineHeight: 1.45 }}>AI가 수정한 뒤에도 직접 칸을 고쳐 엑셀로 저장할 수 있습니다.</span><PrimaryButton onClick={reviseScript} disabled={revisionLoading || !revisionInstruction.trim()}>{revisionLoading ? "AI가 수정 중입니다…" : "수정 요청 보내기"}</PrimaryButton></div>
              </div>
            </section>
            <div style={{ display: "grid", gap: 12 }}>{script.sections.map((section, index) => <article key={`${section.no}-${index}`} style={{ border: `1px solid ${C.line}`, borderRadius: 11, overflow: "hidden" }}><div style={{ display: "grid", gridTemplateColumns: "38px minmax(0,1fr) auto", alignItems: "center", gap: 9, padding: "10px 12px", background: C.mintPale, borderBottom: `1px solid ${C.line}` }}><div style={{ width: 27, height: 27, display: "grid", placeItems: "center", borderRadius: "50%", background: C.mint, color: C.white, fontWeight: 900, fontSize: 12 }}>{section.no}</div><input value={section.order} onChange={e => updateSection(index, "order", e.target.value)} style={{ minWidth: 0, color: C.ink, fontWeight: 900, fontSize: 13, border: "none", background: "transparent", fontFamily: "inherit", outline: "none" }} /><input value={section.time} onChange={e => updateSection(index, "time", e.target.value)} style={{ width: 70, color: C.mint, fontWeight: 800, textAlign: "right", fontSize: 11, border: "none", background: "transparent", fontFamily: "inherit", outline: "none" }} /></div><div style={{ padding: 13 }}><textarea value={section.script} onChange={e => updateSection(index, "script", e.target.value)} rows={Math.max(6, Math.min(18, section.script.split("\n").length + 1))} style={{ boxSizing: "border-box", resize: "vertical", width: "100%", color: C.text, fontSize: 12, lineHeight: 1.72, border: `1px solid ${C.line}`, borderRadius: 7, padding: 10, fontFamily: "inherit", outline: "none", background: "#FEFEFE" }} /><div style={{ marginTop: 8, padding: "8px 10px", borderRadius: 7, background: "#FFFDFD", border: "1px dashed #E3D4D4", whiteSpace: "pre-wrap", fontSize: 11, lineHeight: 1.7, color: C.text }}><span style={{ color: C.muted, fontWeight: 800, marginRight: 5 }}>미리보기</span>{answerPreview(section.script)}</div><div style={{ marginTop: 9 }}><FieldLabel optional>사회자 참고 비고</FieldLabel><TextArea value={section.note} onChange={v => updateSection(index, "note", v)} rows={2} placeholder="음원 타이밍, 확인 사항, 연출 주의사항" /></div></div></article>)}</div>
            <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end" }}><PrimaryButton onClick={downloadExcel}>↓ 엑셀 대본 저장</PrimaryButton></div>
          </div>
        </section>}
        {script && <RevisionSidebar messages={revisionMessages} instruction={revisionInstruction} loading={revisionLoading} error={revisionError} onInstructionChange={setRevisionInstruction} onSubmit={reviseScript} />}
      </div>
      </>}
    </main>
  </div>;
}
