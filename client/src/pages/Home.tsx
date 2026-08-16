/**
 * SoundCut Studio — 테이프 벤치
 * 따뜻한 편집 작업대와 정밀한 파형을 결합한다. 파형이 항상 가장 큰 시각적 면적을 차지하며,
 * 버밀리언은 선택 범위·재생·핵심 행동에만 사용한다.
 */
import { ChangeEvent, PointerEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Download,
  FileAudio,
  FolderOpen,
  Headphones,
  Info,
  Pause,
  Play,
  RotateCcw,
  Scissors,
  Square,
  Upload,
  Volume2,
  Waves,
  X,
} from "lucide-react";
import { toast } from "sonner";

type Range = { start: number; end: number };
type Clip = Range;

const vermilion = "#F04D38";
const sage = "#9BAA94";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "00:00.00";
  const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  const centis = Math.floor((seconds % 1) * 100).toString().padStart(2, "0");
  return `${mins}:${secs}.${centis}`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function normaliseRange(range: Range): Range {
  return range.start <= range.end ? range : { start: range.end, end: range.start };
}

function encodeWav(
  buffer: AudioBuffer,
  clip: Clip,
  volume: number,
  fadeIn: number,
  fadeOut: number,
) {
  const sampleRate = buffer.sampleRate;
  const channels = Math.min(buffer.numberOfChannels, 2);
  const startFrame = Math.floor(clip.start * sampleRate);
  const endFrame = Math.min(buffer.length, Math.ceil(clip.end * sampleRate));
  const frameCount = Math.max(0, endFrame - startFrame);
  const bytesPerSample = 2;
  const blockAlign = channels * bytesPerSample;
  const output = new ArrayBuffer(44 + frameCount * blockAlign);
  const view = new DataView(output);

  const writeText = (offset: number, text: string) => {
    text.split("").forEach((char, index) => view.setUint8(offset + index, char.charCodeAt(0)));
  };

  writeText(0, "RIFF");
  view.setUint32(4, 36 + frameCount * blockAlign, true);
  writeText(8, "WAVE");
  writeText(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  writeText(36, "data");
  view.setUint32(40, frameCount * blockAlign, true);

  const maxFadeInFrames = Math.max(1, Math.round(fadeIn * sampleRate));
  const maxFadeOutFrames = Math.max(1, Math.round(fadeOut * sampleRate));
  let offset = 44;
  for (let frame = 0; frame < frameCount; frame += 1) {
    let envelope = volume;
    if (fadeIn > 0 && frame < maxFadeInFrames) envelope *= frame / maxFadeInFrames;
    if (fadeOut > 0 && frame > frameCount - maxFadeOutFrames) {
      envelope *= Math.max(0, (frameCount - frame) / maxFadeOutFrames);
    }
    for (let channel = 0; channel < channels; channel += 1) {
      const sample = clamp(buffer.getChannelData(channel)[startFrame + frame] * envelope, -1, 1);
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += bytesPerSample;
    }
  }
  return new Blob([view], { type: "audio/wav" });
}

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const playStartRef = useRef({ audioOffset: 0, contextOffset: 0, end: 0 });
  const playheadRef = useRef(0);

  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [clip, setClip] = useState<Clip>({ start: 0, end: 0 });
  const [selection, setSelection] = useState<Range | null>(null);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playhead, setPlayhead] = useState(0);
  const [volume, setVolume] = useState(0.9);
  const [fadeIn, setFadeIn] = useState(0);
  const [fadeOut, setFadeOut] = useState(0);

  const duration = audioBuffer?.duration ?? 0;
  const clipDuration = Math.max(0, clip.end - clip.start);
  const selectionDuration = selection ? Math.max(0, selection.end - selection.start) : 0;

  const stopPlayback = useCallback((reset = false) => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    animationRef.current = null;
    if (sourceRef.current) {
      sourceRef.current.onended = null;
      try {
        sourceRef.current.stop();
      } catch {
        // 이미 종료된 source는 중지할 필요가 없습니다.
      }
    }
    sourceRef.current = null;
    gainRef.current = null;
    setIsPlaying(false);
    if (reset) {
      playheadRef.current = clip.start;
      setPlayhead(clip.start);
    }
  }, [clip.start]);

  useEffect(() => () => stopPlayback(), [stopPlayback]);

  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const scale = window.devicePixelRatio || 1;
    canvas.width = Math.floor(rect.width * scale);
    canvas.height = Math.floor(rect.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(scale, scale);
    const width = rect.width;
    const height = rect.height;
    const middle = height / 2;

    ctx.fillStyle = audioBuffer ? "#F7F4EE" : "rgba(247,244,238,.86)";
    ctx.fillRect(0, 0, width, height);
    for (let i = 0; i <= 12; i += 1) {
      const x = (i / 12) * width;
      ctx.strokeStyle = i % 3 === 0 ? "rgba(24,32,29,.15)" : "rgba(24,32,29,.06)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, height);
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(24,32,29,.16)";
    ctx.beginPath();
    ctx.moveTo(0, middle + 0.5);
    ctx.lineTo(width, middle + 0.5);
    ctx.stroke();

    if (!audioBuffer || duration === 0) {
      ctx.strokeStyle = "rgba(24,32,29,.26)";
      ctx.lineWidth = 1.5;
      for (let x = 8; x < width - 8; x += 5) {
        const seed = Math.sin(x * 0.16) * 20 + Math.sin(x * 0.037) * 30;
        ctx.beginPath();
        ctx.moveTo(x, middle - Math.abs(seed) * 0.28);
        ctx.lineTo(x, middle + Math.abs(seed) * 0.28);
        ctx.stroke();
      }
      return;
    }

    const clipStartX = (clip.start / duration) * width;
    const clipEndX = (clip.end / duration) * width;
    ctx.fillStyle = "rgba(155,170,148,.12)";
    ctx.fillRect(clipStartX, 0, Math.max(0, clipEndX - clipStartX), height);

    const data = audioBuffer.getChannelData(0);
    const samplesPerPixel = Math.max(1, Math.ceil(data.length / width));
    ctx.strokeStyle = "#25302B";
    ctx.lineWidth = 1.2;
    for (let x = 0; x < width; x += 1) {
      const start = x * samplesPerPixel;
      let min = 1;
      let max = -1;
      for (let sample = 0; sample < samplesPerPixel; sample += 1) {
        const value = data[start + sample] ?? 0;
        if (value < min) min = value;
        if (value > max) max = value;
      }
      ctx.beginPath();
      ctx.moveTo(x + 0.5, middle + min * (height * 0.38));
      ctx.lineTo(x + 0.5, middle + max * (height * 0.38));
      ctx.stroke();
    }

    if (selection) {
      const startX = (selection.start / duration) * width;
      const endX = (selection.end / duration) * width;
      ctx.fillStyle = "rgba(240,77,56,.20)";
      ctx.fillRect(startX, 0, Math.max(2, endX - startX), height);
      ctx.fillStyle = vermilion;
      ctx.fillRect(startX - 1, 0, 2, height);
      ctx.fillRect(endX - 1, 0, 2, height);
    }

    const headX = (playhead / duration) * width;
    ctx.strokeStyle = vermilion;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(headX, 0);
    ctx.lineTo(headX, height);
    ctx.stroke();
  }, [audioBuffer, clip, duration, playhead, selection]);

  useEffect(() => {
    drawWaveform();
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const observer = new ResizeObserver(drawWaveform);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [drawWaveform]);

  const positionFromPointer = (event: PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return clamp(((event.clientX - rect.left) / rect.width) * duration, clip.start, clip.end);
  };

  const handlePointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!audioBuffer) return;
    stopPlayback();
    event.currentTarget.setPointerCapture(event.pointerId);
    const position = positionFromPointer(event);
    setDragStart(position);
    setSelection({ start: position, end: position });
    setPlayhead(position);
    playheadRef.current = position;
  };

  const handlePointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!audioBuffer || dragStart === null) return;
    setSelection(normaliseRange({ start: dragStart, end: positionFromPointer(event) }));
  };

  const handlePointerUp = () => {
    if (!selection || selectionDuration < 0.03) setSelection(null);
    setDragStart(null);
  };

  const loadFile = async (file: File) => {
    if (!file.type.startsWith("audio/")) {
      toast.error("오디오 파일을 선택해 주세요.");
      return;
    }
    stopPlayback(true);
    try {
      const context = contextRef.current ?? new AudioContext();
      contextRef.current = context;
      const raw = await file.arrayBuffer();
      const decoded = await context.decodeAudioData(raw.slice(0));
      setAudioBuffer(decoded);
      setFileName(file.name);
      setFileSize(file.size);
      setClip({ start: 0, end: decoded.duration });
      setSelection(null);
      setPlayhead(0);
      playheadRef.current = 0;
      setFadeIn(0);
      setFadeOut(0);
      toast.success("파일을 작업대에 올렸습니다.");
    } catch {
      toast.error("이 파일은 브라우저에서 읽을 수 없습니다.");
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) void loadFile(file);
    event.target.value = "";
  };

  const togglePlayback = async () => {
    if (!audioBuffer) {
      inputRef.current?.click();
      return;
    }
    if (isPlaying) {
      stopPlayback();
      return;
    }
    const context = contextRef.current ?? new AudioContext();
    contextRef.current = context;
    if (context.state === "suspended") await context.resume();

    const target = selection && selectionDuration > 0.03 ? selection : clip;
    const start = clamp(playheadRef.current, target.start, target.end - 0.01);
    const end = target.end;
    const source = context.createBufferSource();
    const gain = context.createGain();
    source.buffer = audioBuffer;
    source.connect(gain).connect(context.destination);

    const now = context.currentTime;
    gain.gain.setValueAtTime(volume, now);
    if (fadeIn > 0 && start <= clip.start + 0.02) {
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume, now + Math.min(fadeIn, end - start));
    }
    if (fadeOut > 0 && end >= clip.end - 0.02) {
      gain.gain.setValueAtTime(volume, now + Math.max(0, end - start - fadeOut));
      gain.gain.linearRampToValueAtTime(0, now + (end - start));
    }
    sourceRef.current = source;
    gainRef.current = gain;
    playStartRef.current = { audioOffset: start, contextOffset: now, end };
    setIsPlaying(true);

    const tick = () => {
      const current = playStartRef.current.audioOffset + (context.currentTime - playStartRef.current.contextOffset);
      if (current >= playStartRef.current.end) {
        stopPlayback(true);
        return;
      }
      playheadRef.current = current;
      setPlayhead(current);
      animationRef.current = requestAnimationFrame(tick);
    };
    source.onended = () => stopPlayback(true);
    source.start(0, start, Math.max(0.01, end - start));
    animationRef.current = requestAnimationFrame(tick);
  };

  const trimToSelection = () => {
    if (!selection || selectionDuration < 0.03) {
      toast.message("파형에서 남길 구간을 먼저 드래그해 주세요.");
      return;
    }
    stopPlayback();
    setClip(selection);
    setPlayhead(selection.start);
    playheadRef.current = selection.start;
    setSelection(null);
    toast.success(`${formatTime(selectionDuration)} 구간만 남겼습니다.`);
  };

  const resetClip = () => {
    if (!audioBuffer) return;
    stopPlayback(true);
    setClip({ start: 0, end: audioBuffer.duration });
    setSelection(null);
    setFadeIn(0);
    setFadeOut(0);
    toast.message("원본 범위로 되돌렸습니다.");
  };

  const exportWav = () => {
    if (!audioBuffer) {
      toast.message("내보낼 오디오를 먼저 불러와 주세요.");
      return;
    }
    stopPlayback();
    const blob = encodeWav(audioBuffer, clip, volume, fadeIn, fadeOut);
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const baseName = (fileName || "soundcut").replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9가-힣_-]/g, "-");
    anchor.href = href;
    anchor.download = `${baseName}-edit.wav`;
    anchor.click();
    URL.revokeObjectURL(href);
    toast.success("WAV 파일을 준비했습니다.");
  };

  const setFadedValue = (setter: (value: number) => void, value: string) => {
    const maximum = Math.min(10, Math.max(0, clipDuration / 2));
    setter(clamp(Number(value) || 0, 0, maximum));
  };

  return (
    <div className="soundcut-shell">
      <input ref={inputRef} onChange={handleFileChange} type="file" accept="audio/*" className="sr-only" />
      <header className="topbar">
        <div className="brand-lockup">
          <img src="/manus-storage/soundcut-logo_bbd01bff.png" alt="SoundCut Studio" className="brand-mark" />
          <div>
            <p className="eyebrow">LOCAL AUDIO WORKBENCH</p>
            <h1>SoundCut <span>Studio</span></h1>
          </div>
        </div>
        <div className="session-note"><span className="status-dot" /> 브라우저 안에서만 처리됩니다</div>
        <button className="outline-button compact" type="button" onClick={() => inputRef.current?.click()}>
          <FolderOpen size={16} /> 파일 열기
        </button>
      </header>

      <main className={`workbench ${audioBuffer ? "has-audio" : ""}`}>
        <aside className="tool-rail" aria-label="편집 제어">
          <div className="rail-intro">
            <p className="section-number">01 / EDIT</p>
            <h2>다듬기</h2>
            <p>파형을 드래그해 남길 구간을 정하세요.</p>
          </div>

          <div className="control-stack">
            <section className="control-section">
              <div className="control-label"><Volume2 size={15} /><span>OUTPUT LEVEL</span><b>{Math.round(volume * 100)}%</b></div>
              <input className="range-input" type="range" min="0" max="1.25" step="0.01" value={volume} onChange={(e) => setVolume(Number(e.target.value))} aria-label="출력 음량" />
              <div className="range-ends"><span>0</span><span>125</span></div>
            </section>

            <section className="control-section paired-control">
              <div>
                <div className="control-label"><span>FADE IN</span><b>{fadeIn.toFixed(1)}s</b></div>
                <input className="range-input" type="range" min="0" max={Math.min(10, Math.max(0, clipDuration / 2))} step="0.1" value={fadeIn} onChange={(e) => setFadedValue(setFadeIn, e.target.value)} aria-label="페이드 인" />
              </div>
              <div>
                <div className="control-label"><span>FADE OUT</span><b>{fadeOut.toFixed(1)}s</b></div>
                <input className="range-input" type="range" min="0" max={Math.min(10, Math.max(0, clipDuration / 2))} step="0.1" value={fadeOut} onChange={(e) => setFadedValue(setFadeOut, e.target.value)} aria-label="페이드 아웃" />
              </div>
            </section>
          </div>

          <div className="rail-actions">
            <button type="button" className="text-action" onClick={trimToSelection} disabled={!audioBuffer}><Scissors size={16} /> 선택 영역으로 자르기</button>
            <button type="button" className="text-action" onClick={() => setSelection(null)} disabled={!selection}><X size={16} /> 선택 해제</button>
            <button type="button" className="text-action muted-action" onClick={resetClip} disabled={!audioBuffer}><RotateCcw size={16} /> 원본 범위 복원</button>
          </div>
        </aside>

        <section className="editor-stage">
          <div className="stage-head">
            <div>
              <p className="section-number">{audioBuffer ? "02 / TRACK" : "02 / TIMELINE"}</p>
              <h2>{audioBuffer ? fileName : "파일을 올려 파형을 만드세요"}</h2>
              <p className="track-meta">{audioBuffer ? `${(fileSize / 1024 / 1024).toFixed(1)} MB · ${audioBuffer.sampleRate.toLocaleString()} Hz · ${audioBuffer.numberOfChannels === 1 ? "MONO" : "STEREO"}` : "로컬 디코딩 · 드래그로 구간 선택 · WAV 저장"}</p>
            </div>
            {audioBuffer ? <button type="button" className="replace-button" onClick={() => inputRef.current?.click()}><Upload size={15} /> 교체</button> : <div className="bench-index" aria-label="입력 대기 상태"><i /><i /><i /><i /><i /><span>READY</span></div>}
          </div>

          {!audioBuffer && (
            <button type="button" className="empty-workspace" onClick={() => inputRef.current?.click()}>
              <img src="/manus-storage/soundcut-empty-workbench_02b085fb.jpg" alt="아날로그 오디오 편집 책상" />
              <div className="empty-overlay">
                <div className="upload-stamp"><Upload size={19} /> AUDIO IN</div>
                <h3>파일을 작업대에<br />놓으세요.</h3>
                <p>선택 즉시 로컬 파형을 생성합니다.</p>
                <span>파일 선택 <span aria-hidden="true">↗</span></span>
              </div>
            </button>
          )}

          <div className={`wave-area ${audioBuffer ? "ready" : "quiet"}`}>
            <div className="timeline-ruler" aria-hidden="true">
              {[0, 0.25, 0.5, 0.75, 1].map((mark) => <span key={mark} style={{ left: `${mark * 100}%` }}>{formatTime((duration || 60) * mark)}</span>)}
            </div>
            <canvas
              ref={canvasRef}
              className="wave-canvas"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              aria-label="오디오 파형. 드래그하여 편집 범위를 선택합니다."
            />
            {audioBuffer && <div className="wave-hint"><Waves size={14} /> 드래그하여 선택</div>}
          </div>

          <div className="transport">
            <button type="button" className="play-button" onClick={() => void togglePlayback()} aria-label={isPlaying ? "일시 정지" : "재생"}>
              {isPlaying ? <Pause size={21} fill="currentColor" /> : <Play size={21} fill="currentColor" />}
            </button>
            <button type="button" className="stop-button" onClick={() => stopPlayback(true)} disabled={!audioBuffer} aria-label="정지"><Square size={15} fill="currentColor" /></button>
            <div className="time-readout"><strong>{formatTime(playhead)}</strong><span>/ {formatTime(clip.end)}</span></div>
            <div className="transport-divider" />
            <div className="selection-readout">
              <span>SELECTION</span>
              <strong>{selection ? formatTime(selectionDuration) : "—"}</strong>
            </div>
            <div className="clip-readout">
              <span>CLIP</span>
              <strong>{audioBuffer ? formatTime(clipDuration) : "—"}</strong>
            </div>
          </div>
        </section>

        <aside className="export-rail" aria-label="내보내기">
          <div className="export-art"><img src="/manus-storage/soundcut-export-card_b487faaa.jpg" alt="자른 오디오 테이프" /></div>
          <p className="section-number">03 / COMMIT</p>
          <h2>새 파일로<br />저장하기</h2>
          <p>현재 클립 범위와 음량, 페이드 설정을 그대로 굽습니다.</p>
          <div className="export-spec">
            <div><span>FORMAT</span><b>WAV / PCM</b></div>
            <div><span>RANGE</span><b>{audioBuffer ? formatTime(clipDuration) : "—"}</b></div>
          </div>
          <button type="button" className="export-button" onClick={exportWav} disabled={!audioBuffer}><Download size={17} /> WAV 내보내기</button>
          <div className="privacy-note"><Info size={14} /> 오디오 파일은 서버로 전송되지 않습니다.</div>
        </aside>
      </main>

      <footer className="footer-strip">
        <span><Headphones size={14} /> SINGLE-TRACK EDITOR</span>
        <span>v1.0 · DESIGNED FOR QUICK CUTS</span>
      </footer>
    </div>
  );
}
