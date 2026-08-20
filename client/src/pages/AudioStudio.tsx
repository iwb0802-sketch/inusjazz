import { upload } from "@vercel/blob/client";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import { ArrowLeft, Check, Download, FileAudio, KeyRound, LoaderCircle, LockKeyhole, Music2, Play, RotateCcw, Scissors, UploadCloud, Volume2 } from "lucide-react";

type Stage = "locked" | "ready" | "uploading" | "separating" | "done" | "failed";
type Stems = { vocalsUrl: string; instrumentalUrl: string };

const SESSION_KEY = "inus-audio-password";
const AUDIO_TYPES = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/x-wav", "audio/flac", "audio/x-flac"];

function getError(body: unknown, fallback: string) {
  return body && typeof body === "object" && "error" in body && typeof (body as { error?: unknown }).error === "string" ? (body as { error: string }).error : fallback;
}

function StemCard({ label, description, color, url, fileName }: { label: string; description: string; color: "rose" | "teal"; url: string; fileName: string }) {
  return <article className={`rounded-2xl border border-stone-200 bg-white p-5 shadow-sm ${color === "rose" ? "border-l-4 border-l-rose-500" : "border-l-4 border-l-teal-500"}`}><div className="flex flex-wrap items-center justify-between gap-3"><div><p className={`text-[11px] font-black tracking-[0.18em] ${color === "rose" ? "text-rose-500" : "text-teal-600"}`}>{label}</p><h3 className="mt-1 text-lg font-bold text-stone-900">{description}</h3></div><a href={url} download={fileName} className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-3 py-2 text-xs font-bold text-stone-700 transition hover:border-stone-900 hover:text-stone-950"><Download size={15} />다운로드</a></div><audio className="mt-4 w-full" controls preload="metadata" src={url} aria-label={`${label} 재생기`} /></article>;
}

export default function AudioStudio() {
  const [password, setPassword] = useState(() => sessionStorage.getItem(SESSION_KEY) ?? "");
  const [stage, setStage] = useState<Stage>(() => sessionStorage.getItem(SESSION_KEY) ? "ready" : "locked");
  const [passwordDraft, setPasswordDraft] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [stems, setStems] = useState<Stems | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isBusy = stage === "uploading" || stage === "separating";

  useEffect(() => {
    if (stage !== "separating") return;
    const timer = window.setInterval(() => setProgress((value) => Math.min(value + (value < 45 ? 7 : 2), 92)), 850);
    return () => window.clearInterval(timer);
  }, [stage]);

  function pickFile(next?: File) {
    if (!next) return;
    if (!AUDIO_TYPES.includes(next.type)) return toast.error("MP3, WAV, FLAC 파일만 올릴 수 있습니다.");
    if (next.size > 24 * 1024 * 1024) return toast.error("음원 파일은 24MB 이하로 올려주세요.");
    setFile(next); setStage("ready"); setError(null); setStems(null); setProgress(0);
  }

  function unlock(event: React.FormEvent) {
    event.preventDefault();
    if (!passwordDraft.trim()) return;
    sessionStorage.setItem(SESSION_KEY, passwordDraft);
    setPassword(passwordDraft); setPasswordDraft(""); setStage("ready");
  }

  async function callApi(path: string, body: object) {
    const response = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json", "X-Inus-Audio-Password": password }, body: JSON.stringify(body) });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(getError(payload, "작업 요청에 실패했습니다."));
    return payload;
  }

  async function beginSeparation() {
    if (!file || isBusy) return;
    try {
      setError(null); setProgress(4); setStage("uploading");
      const blob = await upload(`audio-source/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`, file, {
        access: "public", handleUploadUrl: "/api/audio-upload", clientPayload: JSON.stringify({ password }),
        onUploadProgress: ({ percentage }) => setProgress(Math.max(4, Math.round(percentage * 0.25))),
      });
      setStage("separating"); setProgress(28);
      const prediction = await callApi("/api/audio-split", { sourceUrl: blob.url }) as { id: string };
      let attempts = 0;
      while (attempts < 120) {
        await new Promise((resolve) => window.setTimeout(resolve, 3000));
        const status = await callApi("/api/audio-status", { predictionId: prediction.id }) as { status: string; error?: string; vocalsUrl?: string; instrumentalUrl?: string };
        if (status.status === "succeeded" && status.vocalsUrl && status.instrumentalUrl) {
          setStems({ vocalsUrl: status.vocalsUrl, instrumentalUrl: status.instrumentalUrl }); setProgress(100); setStage("done"); toast.success("MR과 보컬 트랙이 준비되었습니다."); return;
        }
        if (status.status === "failed") throw new Error(status.error ?? "분리 작업이 중단되었습니다.");
        attempts += 1;
      }
      throw new Error("처리 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.");
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "분리 요청을 시작하지 못했습니다.";
      setError(message); setStage("failed"); toast.error(message);
    }
  }

  function reset() { setFile(null); setStems(null); setError(null); setProgress(0); setStage(password ? "ready" : "locked"); }

  if (stage === "locked") return <main className="min-h-screen bg-[#151516] px-5 py-8 text-stone-100"><div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center"><form onSubmit={unlock} className="w-full max-w-md rounded-3xl border border-white/15 bg-white/[0.06] p-8 shadow-2xl backdrop-blur"><Link href="/" className="inline-flex items-center gap-2 text-xs text-stone-400 transition hover:text-white"><ArrowLeft size={14} />Inus Music으로 돌아가기</Link><div className="mt-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-stone-950"><LockKeyhole size={22} /></div><p className="mt-6 text-xs font-black tracking-[0.2em] text-amber-300">INUS MUSIC · MR STUDIO</p><h1 className="mt-3 text-4xl font-black tracking-tight">MR 제작<br /><span className="text-amber-300">작업대</span></h1><p className="mt-4 text-sm leading-6 text-stone-400">공용 작업 비밀번호를 입력하면 MP3, WAV, FLAC에서 반주(MR)와 보컬을 분리할 수 있습니다.</p><label className="mt-7 block text-xs font-bold text-stone-300" htmlFor="audio-password">작업 비밀번호</label><input id="audio-password" type="password" value={passwordDraft} onChange={(event) => setPasswordDraft(event.target.value)} autoFocus className="mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none ring-amber-300 transition focus:ring-2" placeholder="비밀번호 입력" /><button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-3 text-sm font-black text-stone-950 transition hover:bg-amber-300"><KeyRound size={16} />작업대 열기</button></form></div></main>;

  return <main className="min-h-screen bg-[#f8f5f0] text-stone-950"><header className="border-b border-stone-200 bg-white/90 px-5 py-4 backdrop-blur"><div className="mx-auto flex max-w-6xl items-center justify-between gap-4"><Link href="/" className="inline-flex items-center gap-2 text-sm font-black tracking-wide"><span className="grid h-8 w-8 place-items-center rounded-full bg-stone-950 text-amber-300"><Music2 size={16} /></span>INUS MUSIC</Link><span className="inline-flex items-center gap-2 text-xs font-bold text-teal-700"><Check size={15} />PRIVATE WORKSPACE</span></div></header><section className="mx-auto max-w-6xl px-5 py-10 md:py-16"><div className="max-w-3xl"><p className="text-xs font-black tracking-[0.2em] text-amber-600">AUDIO EDITING · MR MAKER</p><h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">내 음원에서<br /><span className="text-amber-600">MR을 만드세요.</span></h1><p className="mt-5 max-w-2xl text-sm leading-7 text-stone-600 md:text-base">한 곡을 업로드하면 AI가 보컬과 반주를 두 개의 개별 트랙으로 분리합니다. 결과는 이 화면에서 듣고 바로 저장할 수 있습니다.</p></div><div className="mt-10 grid gap-6 lg:grid-cols-[.95fr_1.05fr]"><section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm md:p-7"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-black tracking-[0.16em] text-stone-400">01 · SOURCE TRACK</p><h2 className="mt-1 text-2xl font-black">음원 업로드</h2></div><span className="rounded-full bg-stone-100 px-3 py-1 text-[11px] font-bold text-stone-500">MAX 24MB</span></div><div onClick={() => inputRef.current?.click()} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); pickFile(event.dataTransfer.files[0]); }} className={`mt-6 cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition ${dragging ? "border-amber-500 bg-amber-50" : "border-stone-200 hover:border-amber-400"}`} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter") inputRef.current?.click(); }}><input ref={inputRef} className="sr-only" type="file" accept="audio/*" onChange={(event) => pickFile(event.target.files?.[0])} />{file ? <><FileAudio className="mx-auto text-teal-600" size={30} /><p className="mt-3 break-all font-bold">{file.name}</p><p className="mt-1 text-xs text-stone-500">{(file.size / 1024 / 1024).toFixed(1)}MB · 클릭해 교체</p></> : <><UploadCloud className="mx-auto text-amber-600" size={32} /><p className="mt-3 font-bold">여기에 음원 파일을 놓으세요</p><p className="mt-1 text-xs text-stone-500">MP3, WAV, FLAC 지원</p></>}</div><div className="mt-5 rounded-2xl bg-stone-950 p-4 text-stone-100"><div className="flex items-center justify-between"><span className="text-xs font-black tracking-[0.16em] text-amber-300">HTDEMUCS</span><span className="text-xs text-stone-400">2 STEMS</span></div><p className="mt-2 text-sm text-stone-300">보컬과 반주를 각각의 고음질 MP3 트랙으로 출력합니다.</p></div><button disabled={!file || isBusy} onClick={beginSeparation} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-stone-950 px-5 py-4 text-sm font-black text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300">{isBusy ? <LoaderCircle size={18} className="animate-spin" /> : <Scissors size={18} />}{stage === "uploading" ? "파일을 올리는 중" : stage === "separating" ? "보컬과 MR을 분리하는 중" : "MR 만들기"}</button></section><section className="rounded-3xl bg-stone-950 p-6 text-white shadow-xl md:p-8"><div className="flex items-center justify-between"><div><p className="text-xs font-black tracking-[0.16em] text-amber-300">02 · RESULT</p><h2 className="mt-1 text-2xl font-black">분리된 트랙</h2></div>{stage === "done" && <button onClick={reset} className="inline-flex items-center gap-1 text-xs font-bold text-stone-300 hover:text-white"><RotateCcw size={14} />새 작업</button>}</div><div className="mt-8 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-amber-400 transition-all duration-500" style={{ width: `${progress}%` }} /></div><p className="mt-3 text-xs text-stone-400">{stage === "ready" ? "파일을 선택한 뒤 MR 만들기를 눌러주세요." : stage === "uploading" ? "보안 업로드 경로를 준비하고 있습니다." : stage === "separating" ? "AI가 보컬과 반주를 분석하고 있습니다." : stage === "done" ? "두 개의 결과 트랙이 준비되었습니다." : stage === "failed" ? "작업을 완료하지 못했습니다." : "작업대가 준비되었습니다."}</p>{error && <div className="mt-5 rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-200">{error}</div>}{stems ? <div className="mt-6 space-y-4"><StemCard label="VOCALS" description="보컬 트랙" color="rose" url={stems.vocalsUrl} fileName="inus-vocals.mp3" /><StemCard label="INSTRUMENTAL" description="MR · 반주 트랙" color="teal" url={stems.instrumentalUrl} fileName="inus-mr.mp3" /></div> : <div className="mt-8 grid gap-3"><div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-rose-400/15 text-rose-300"><Volume2 size={17} /></span><div><p className="text-xs font-black tracking-[0.16em] text-rose-300">VOCALS</p><p className="mt-1 text-sm text-stone-400">목소리 트랙</p></div></div></div><div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-teal-400/15 text-teal-300"><Play size={17} /></span><div><p className="text-xs font-black tracking-[0.16em] text-teal-300">INSTRUMENTAL</p><p className="mt-1 text-sm text-stone-400">MR · 반주 트랙</p></div></div></div></div>}</section></div><p className="mt-6 text-xs leading-5 text-stone-500">업로드한 원본은 분리 요청에만 사용됩니다. 음악 파일에 대한 이용 권한은 업로드한 사용자에게 있어야 합니다.</p></section></main>;
}
