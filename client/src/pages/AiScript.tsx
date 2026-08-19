import { useEffect, useMemo, useState } from "react";
import ExcelJS from "exceljs";

const API_URL = "/api/ai-script";
const ADMIN_HOME = "http://bnsmusics.godohosting.com/bns/admin/event_list.php?sUser_id=bnsmusic&sUser_nm=%EA%B4%80%EB%A6%AC%EC%9E%90";

type CeremonyType = "main" | "reception";
type ScriptStyle = "classic" | "trendy" | "warm";
type ScriptSection = { no: number; order: string; time: string; script: string; note: string };
type GeneratedScript = { title: string; subtitle: string; sections: ScriptSection[]; review_flags: string[] };
type WorkspaceTab = "generator" | "guide";

type FormValues = {
  groomName: string; brideName: string; mcName: string; ceremonyType: CeremonyType; style: ScriptStyle;
  weddingDate: string; weddingTime: string; venue: string; duration: string;
  customOrder: string; coupleStory: string; requests: string;
};

const defaultForm: FormValues = {
  groomName: "", brideName: "", mcName: "", ceremonyType: "main", style: "classic",
  weddingDate: "", weddingTime: "", venue: "", duration: "40분",
  customOrder: "", coupleStory: "", requests: "",
};

const C = {
  ink: "#111B2E", navy: "#17243B", mint: "#2D9B8A", mintSoft: "#E8FAF8", mintPale: "#F4FCFB",
  cream: "#F7F8F5", line: "#DCE4E3", text: "#263238", muted: "#71808A", coral: "#E36C6C", white: "#FFFFFF",
};

const DEFAULT_COMPANY_GUIDE = `# 이너스뮤직 프리미엄 사회 대본 기준

## 기본 문체
- 차분하고 품격 있는 한국어 존댓말을 사용합니다.
- 신랑은 "OOO 군", 신부는 "OOO 양"으로 표기합니다.
- 과장된 표현보다 따뜻하고 자연스러운 연결을 우선합니다.

## 기본 식순
하객 입장 안내 → 오프닝 → 개식 선언 → 혼주님 입장/화촉점화 → 신랑 입장 → 신부 입장 → 맞절 → 혼인서약 → 반지 교환 → 성혼선언 → 축가·덕담·편지(있는 경우) → 양가 인사 → 내빈 인사 → 행진 → 폐회

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

function GuideManager({ guide, onChange }: { guide: string; onChange: (value: string) => void }) {
  const [saved, setSaved] = useState(false);
  const save = () => {
    localStorage.setItem("inus_ai_company_guide", guide.trim());
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };
  const restore = () => {
    if (window.confirm("현재 작성한 지침을 기본 프리미엄 기준으로 되돌릴까요?")) onChange(DEFAULT_COMPANY_GUIDE);
  };
  return <section style={{ maxWidth: 980, background: C.white, border: `1px solid ${C.line}`, borderRadius: 16, overflow: "hidden", boxShadow: "0 6px 25px rgba(19,36,59,.05)" }}>
    <div style={{ padding: "20px 22px", background: C.mintPale, borderBottom: `1px solid ${C.line}` }}>
      <div style={{ fontSize: 16, color: C.ink, fontWeight: 900 }}>회사 지침 관리</div>
      <p style={{ margin: "6px 0 0", color: C.muted, fontSize: 12, lineHeight: 1.7 }}>여기에 적고 저장한 내용은 이 브라우저에서 보관되며, 이후 모든 AI 대본 생성 요청에 자동으로 함께 반영됩니다. 실제 대본 예시는 개인정보를 지운 핵심 표현·식순·금지 문구 중심으로 입력해주세요.</p>
    </div>
    <div style={{ padding: 22 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 10, marginBottom: 18 }}>
        {[["01", "필수 식순", "기본 순서·생략 가능 순서"], ["02", "표현 기준", "반드시 쓰거나 피할 표현"], ["03", "대본 예시", "좋은 문장·전환 방식"]].map(([num, title, desc]) => <div key={num} style={{ border: `1px solid ${C.line}`, borderRadius: 10, padding: 12, background: "#FBFDFC" }}><div style={{ color: C.mint, fontSize: 10, fontWeight: 900 }}>{num}</div><div style={{ color: C.ink, fontSize: 13, fontWeight: 900, marginTop: 3 }}>{title}</div><div style={{ color: C.muted, fontSize: 10, marginTop: 3, lineHeight: 1.5 }}>{desc}</div></div>)}
      </div>
      <FieldLabel>이너스뮤직 회사 지침</FieldLabel>
      <TextArea value={guide} onChange={onChange} rows={29} placeholder="회사 대본 작성 기준, 금지 표현, 식순 원칙, 좋은 멘트 예시를 입력하세요." />
      <div style={{ display: "flex", gap: 9, flexWrap: "wrap", alignItems: "center", marginTop: 16 }}>
        <PrimaryButton onClick={save}>회사 지침 저장</PrimaryButton>
        <button onClick={restore} style={{ minHeight: 46, padding: "0 15px", borderRadius: 10, border: `1px solid ${C.line}`, background: C.white, color: C.muted, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>기본 기준 복원</button>
        <span style={{ color: saved ? C.mint : C.muted, fontSize: 11, fontWeight: saved ? 800 : 500 }}>{saved ? "저장 완료 · 다음 대본부터 반영됩니다." : "저장 후 대본 작성 탭에서 생성하면 이 지침이 반영됩니다."}</span>
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
  const [showMore, setShowMore] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("generator");
  const [companyGuide, setCompanyGuide] = useState(DEFAULT_COMPANY_GUIDE);

  useEffect(() => {
    const savedGuide = localStorage.getItem("inus_ai_company_guide");
    if (savedGuide) setCompanyGuide(savedGuide);
  }, []);

  const update = <K extends keyof FormValues>(key: K, value: FormValues[K]) => setForm(prev => ({ ...prev, [key]: value }));
  const sectionCount = script?.sections.length || 0;

  const fullPlainText = useMemo(() => script ? script.sections.map(s => `[${s.no}. ${s.order}]\n${stripTags(s.script)}${s.note ? `\n※ ${s.note}` : ""}`).join("\n\n") : "", [script]);

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
    setLoading(true); setError(""); setScript(null);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Inus-Ai-Password": password },
        body: JSON.stringify({ ...form, companyGuide }),
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

  const updateSection = (index: number, field: keyof ScriptSection, value: string) => {
    setScript(current => current ? { ...current, sections: current.sections.map((section, i) => i === index ? { ...section, [field]: field === "no" ? Number(value) : value } : section) } : current);
  };

  const copyScript = async () => {
    await navigator.clipboard.writeText(fullPlainText);
    setCopied(true); window.setTimeout(() => setCopied(false), 1800);
  };

  const downloadExcel = async () => {
    if (!script) return;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("예식 대본", { views: [{ showGridLines: false }] });
    worksheet.columns = [
      { width: 6 }, { width: 15 }, { width: 14 }, { width: 78.5 }, { width: 39.4 },
    ];
    worksheet.mergeCells("A1:E1");
    worksheet.getCell("A1").value = script.title || `${form.groomName} 신랑 · ${form.brideName} 신부 결혼식 사회 대본`;
    worksheet.getCell("A1").font = { name: "Arial", size: 16, bold: true, color: { argb: "FFFFFFFF" } };
    worksheet.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2D9B8A" } };
    worksheet.getCell("A1").alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    worksheet.getRow(1).height = 31;

    worksheet.mergeCells("A2:E2");
    worksheet.getCell("A2").value = script.subtitle || `사회자: ${form.mcName || "미정"}`;
    worksheet.getCell("A2").font = { name: "Arial", size: 12, bold: true, color: { argb: "FFFFFFFF" } };
    worksheet.getCell("A2").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF5BC8B5" } };
    worksheet.getCell("A2").alignment = { horizontal: "center", vertical: "middle" };
    worksheet.getRow(2).height = 24;

    const header = worksheet.getRow(3);
    ["번호", "식순", "시간", "멘트", "비고"].forEach((value, index) => header.getCell(index + 1).value = value);
    header.height = 25;
    const thin = { style: "thin" as const, color: { argb: "FF808080" } };
    const mediumTeal = { style: "medium" as const, color: { argb: "FF2D9B8A" } };
    header.eachCell(cell => {
      cell.font = { name: "Arial", size: 11, bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1A7A6C" } };
      cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
      cell.border = { top: thin, bottom: mediumTeal, left: thin, right: thin };
    });

    script.sections.forEach((section) => {
      const row = worksheet.addRow([section.no, section.order, section.time, "", section.note]);
      row.getCell(4).value = toRichText(section.script);
      row.height = Math.max(46, Math.min(300, (stripTags(section.script).split("\n").length + 2) * 17));
      row.eachCell((cell, column) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE8FAF8" } };
        cell.border = { top: thin, bottom: mediumTeal, left: thin, right: thin };
        cell.alignment = { horizontal: column === 1 || column === 2 || column === 3 ? "center" : "left", vertical: column === 2 ? "middle" : "top", wrapText: true };
        if (column !== 4) cell.font = { name: "Arial", size: column === 5 ? 9 : 10, bold: column === 1 || column === 2, color: { argb: column === 1 ? "FF1A7A6C" : "FF2C2C2C" } };
      });
    });

    const footerRow = worksheet.addRow(["💚  두 분의 결혼을 진심으로 축하합니다  💚"]);
    worksheet.mergeCells(`A${footerRow.number}:E${footerRow.number}`);
    footerRow.height = 26;
    const footer = worksheet.getCell(`A${footerRow.number}`);
    footer.font = { name: "Arial", size: 11, bold: true, color: { argb: "FF2D9B8A" } };
    footer.alignment = { horizontal: "center", vertical: "middle" };

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${formatFilenamePart(form.groomName)}_${formatFilenamePart(form.brideName)}_결혼식_사회대본.xlsx`;
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
          {([ ["generator", "대본 작성"], ["guide", "회사 지침"] ] as [WorkspaceTab, string][]).map(([key, label]) => <button key={key} onClick={() => setActiveTab(key)} style={{ background: activeTab === key ? "#61D5C0" : "transparent", border: `1px solid ${activeTab === key ? "#61D5C0" : "rgba(255,255,255,.25)"}`, borderRadius: 7, color: activeTab === key ? C.ink : "#E4EEEC", fontSize: 11, padding: "7px 9px", cursor: "pointer", fontFamily: "inherit", fontWeight: 800 }}>{label}</button>)}
          <button onClick={() => { sessionStorage.removeItem("inus_ai_script_password"); setAuthenticated(false); setPassword(""); }} style={{ background: "transparent", border: "1px solid rgba(255,255,255,.25)", borderRadius: 7, color: "#E4EEEC", fontSize: 11, padding: "7px 9px", cursor: "pointer", fontFamily: "inherit" }}>잠금</button>
        </div>
      </div>
    </header>

    <main style={{ maxWidth: 1380, margin: "0 auto", padding: "28px 20px 80px", boxSizing: "border-box" }}>
      {activeTab === "guide" ? <GuideManager guide={companyGuide} onChange={setCompanyGuide} /> : <>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 27, color: C.ink, margin: 0, letterSpacing: "-1.2px" }}>맞춤형 사회 대본 생성</h1>
        <p style={{ margin: "8px 0 0", fontSize: 13, color: C.muted, lineHeight: 1.7 }}>필수 정보만으로 초안을 만든 뒤, 답변지·요청사항을 추가하면 회사 기준에 맞춰 더 정교하게 작성됩니다.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: script ? "minmax(320px, .85fr) minmax(460px, 1.15fr)" : "minmax(320px, 760px)", gap: 22, alignItems: "start" }}>
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
              <div><FieldLabel optional>예식 시간</FieldLabel><Input type="time" value={form.weddingTime} onChange={v => update("weddingTime", v)} /></div>
              <div><FieldLabel>대본 유형</FieldLabel><select value={form.ceremonyType} onChange={e => update("ceremonyType", e.target.value as CeremonyType)} style={{ boxSizing: "border-box", width: "100%", height: 44, border: `1px solid ${C.line}`, borderRadius: 9, padding: "0 10px", background: C.white, fontFamily: "inherit", color: C.text }}><option value="main">본식</option><option value="reception">2부 피로연</option></select></div>
            </div>

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
          <div style={{ padding: "18px 20px", background: C.ink, color: C.white, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}><div style={{ flex: 1, minWidth: 190 }}><div style={{ color: "#61D5C0", fontSize: 10, fontWeight: 900, letterSpacing: 2 }}>DRAFT READY</div><div style={{ fontWeight: 800, fontSize: 16, marginTop: 3 }}>03. 생성된 사회 대본 · {sectionCount}개 식순</div></div><button onClick={copyScript} style={{ border: "1px solid rgba(255,255,255,.25)", borderRadius: 7, background: "rgba(255,255,255,.08)", color: C.white, padding: "8px 10px", cursor: "pointer", fontFamily: "inherit", fontSize: 11 }}>{copied ? "복사 완료" : "전체 복사"}</button><button onClick={downloadExcel} style={{ border: "none", borderRadius: 7, background: "#61D5C0", color: C.ink, padding: "8px 10px", cursor: "pointer", fontFamily: "inherit", fontWeight: 900, fontSize: 11 }}>엑셀 다운로드</button></div>
          <div style={{ padding: 18 }}>
            <div style={{ marginBottom: 16, padding: "12px 14px", background: C.mintPale, border: `1px solid #C4EEE8`, borderRadius: 10 }}><div style={{ color: C.ink, fontSize: 14, fontWeight: 900 }}>{script.title}</div><div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>{script.subtitle}</div><div style={{ color: C.coral, fontSize: 10, marginTop: 8 }}>빨간색 굵은 글씨는 답변지·요청사항 인용 구간이며, 엑셀에도 동일하게 적용됩니다.</div></div>
            {script.review_flags.length > 0 && <div style={{ marginBottom: 16, padding: "11px 13px", background: "#FFF9E9", border: "1px solid #F2DFAB", borderRadius: 10 }}><div style={{ color: "#8A671D", fontSize: 11, fontWeight: 900, marginBottom: 6 }}>⚑ 발송 전 확인 필요</div>{script.review_flags.map((flag, index) => <div key={index} style={{ color: "#81672B", fontSize: 11, lineHeight: 1.6 }}>• {flag}</div>)}</div>}
            <div style={{ display: "grid", gap: 12 }}>{script.sections.map((section, index) => <article key={`${section.no}-${index}`} style={{ border: `1px solid ${C.line}`, borderRadius: 11, overflow: "hidden" }}><div style={{ display: "grid", gridTemplateColumns: "38px minmax(0,1fr) auto", alignItems: "center", gap: 9, padding: "10px 12px", background: C.mintPale, borderBottom: `1px solid ${C.line}` }}><div style={{ width: 27, height: 27, display: "grid", placeItems: "center", borderRadius: "50%", background: C.mint, color: C.white, fontWeight: 900, fontSize: 12 }}>{section.no}</div><input value={section.order} onChange={e => updateSection(index, "order", e.target.value)} style={{ minWidth: 0, color: C.ink, fontWeight: 900, fontSize: 13, border: "none", background: "transparent", fontFamily: "inherit", outline: "none" }} /><input value={section.time} onChange={e => updateSection(index, "time", e.target.value)} style={{ width: 70, color: C.mint, fontWeight: 800, textAlign: "right", fontSize: 11, border: "none", background: "transparent", fontFamily: "inherit", outline: "none" }} /></div><div style={{ padding: 13 }}><textarea value={section.script} onChange={e => updateSection(index, "script", e.target.value)} rows={Math.max(6, Math.min(18, section.script.split("\n").length + 1))} style={{ boxSizing: "border-box", resize: "vertical", width: "100%", color: C.text, fontSize: 12, lineHeight: 1.72, border: `1px solid ${C.line}`, borderRadius: 7, padding: 10, fontFamily: "inherit", outline: "none", background: "#FEFEFE" }} /><div style={{ marginTop: 8, padding: "8px 10px", borderRadius: 7, background: "#FFFDFD", border: "1px dashed #E3D4D4", whiteSpace: "pre-wrap", fontSize: 11, lineHeight: 1.7, color: C.text }}><span style={{ color: C.muted, fontWeight: 800, marginRight: 5 }}>미리보기</span>{answerPreview(section.script)}</div><div style={{ marginTop: 9 }}><FieldLabel optional>사회자 참고 비고</FieldLabel><TextArea value={section.note} onChange={v => updateSection(index, "note", v)} rows={2} placeholder="음원 타이밍, 확인 사항, 연출 주의사항" /></div></div></article>)}</div>
            <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end" }}><PrimaryButton onClick={downloadExcel}>↓ 엑셀 대본 저장</PrimaryButton></div>
          </div>
        </section>}
      </div>
      </>}
    </main>
  </div>;
}
