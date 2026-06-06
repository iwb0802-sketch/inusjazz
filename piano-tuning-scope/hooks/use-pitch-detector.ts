/**
 * use-pitch-detector.ts
 * 크로스플랫폼 피치 감지 훅
 * 
 * Web: Web Audio API (AnalyserNode + requestAnimationFrame)
 * Native: expo-audio 녹음 + 폴링 기반 분석
 * 
 * 이 훅은 Platform.OS에 따라 적절한 구현을 선택합니다.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { Platform, AppState, AppStateStatus } from "react-native";
import { PIANO_KEYS, freqToCentOffset, correctOctaveError, median } from "@/lib/piano-keys";
import { detectPitchYIN, getRMS, PitchResult } from "@/lib/pitch-detector";

export { PitchResult } from "@/lib/pitch-detector";

export interface UsePitchDetectorReturn {
  isListening: boolean;
  currentPitch: PitchResult | null;
  startListening: () => Promise<void>;
  stopListening: () => void;
  error: string | null;
  isRecovering: boolean;
}

export function usePitchDetector(
  onPitchDetected?: (result: PitchResult) => void
): UsePitchDetectorReturn {
  const [isListening, setIsListening] = useState(false);
  const [currentPitch, setCurrentPitch] = useState<PitchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);

  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bufRef = useRef<any>(null);
  const isRunningRef = useRef(false);
  const onPitchDetectedRef = useRef(onPitchDetected);

  // 안정화 윈도우
  const recentKeys = useRef<number[]>([]);
  const recentCents = useRef<number[]>([]);
  const lastKey = useRef<number | null>(null);
  const WINDOW = 15;
  const MIN_MATCH = 8;

  useEffect(() => {
    onPitchDetectedRef.current = onPitchDetected;
  }, [onPitchDetected]);

  const stopListening = useCallback(() => {
    isRunningRef.current = false;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    analyserRef.current = null;
    bufRef.current = null;
    recentKeys.current = [];
    recentCents.current = [];
    lastKey.current = null;
    setIsListening(false);
    setCurrentPitch(null);
    setIsRecovering(false);
  }, []);

  const startListening = useCallback(async () => {
    if (Platform.OS !== "web") {
      // 네이티브에서는 Web Audio API 사용 불가
      // expo-audio 기반 구현은 별도 처리 필요
      setError("네이티브 환경에서는 Expo Go에서 마이크 접근이 필요합니다.");
      return;
    }

    try {
      setError(null);
      setIsRecovering(false);

      // 마이크 스트림 획득
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
            autoGainControl: false,
            noiseSuppression: false,
            sampleRate: 44100,
          },
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
            autoGainControl: false,
            noiseSuppression: false,
          },
        });
      }
      streamRef.current = stream;

      // AudioContext 생성
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx({ sampleRate: 44100 });
      ctxRef.current = ctx;

      if (ctx.state === "suspended") {
        try { await ctx.resume(); } catch { /* continue */ }
      }

      // Analyser 설정
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 4096;
      analyser.smoothingTimeConstant = 0;
      analyserRef.current = analyser;

      const src = ctx.createMediaStreamSource(stream);
      src.connect(analyser);

      bufRef.current = new Float32Array(analyser.fftSize);
      isRunningRef.current = true;
      setIsListening(true);

      // 감지 루프
      const detect = () => {
        if (!isRunningRef.current) return;

        const ctx = ctxRef.current;
        const analyser = analyserRef.current;
        const buf = bufRef.current;
        if (!ctx || !analyser || !buf) return;

        if (ctx.state === "suspended") {
          ctx.resume().catch(() => {});
        }

        analyser.getFloatTimeDomainData(buf);
        const rms = getRMS(buf);

        if (rms < 0.003) {
          recentKeys.current = [];
          recentCents.current = [];
          setCurrentPitch(null);
          rafRef.current = requestAnimationFrame(detect);
          return;
        }

        const freq = detectPitchYIN(buf, ctx.sampleRate);
        if (freq > 0) {
          const r = freqToCentOffset(freq);
          if (r) {
            const ki = correctOctaveError(r.keyIndex, lastKey.current);
            const cr = ki !== r.keyIndex ? (freqToCentOffset(PIANO_KEYS[ki].freq) ?? r) : r;

            recentKeys.current.push(cr.keyIndex);
            recentCents.current.push(cr.cents);
            if (recentKeys.current.length > WINDOW) {
              recentKeys.current.shift();
              recentCents.current.shift();
            }

            const counts: Record<number, number> = {};
            recentKeys.current.forEach(k => { counts[k] = (counts[k] || 0) + 1; });
            const entries = Object.entries(counts).sort((a, b) => Number(b[1]) - Number(a[1]));
            const [topKey, topCount] = entries[0];
            const stableKi = parseInt(topKey);

            if (Number(topCount) >= MIN_MATCH) {
              const centsArr = recentKeys.current
                .map((k, i) => k === stableKi ? recentCents.current[i] : null)
                .filter((v): v is number => v !== null);
              const stableCents = Math.round(median(centsArr) * 10) / 10;

              const result: PitchResult = {
                frequency: freq,
                keyIndex: stableKi,
                noteName: PIANO_KEYS[stableKi].noteName,
                octave: PIANO_KEYS[stableKi].octave,
                cents: stableCents,
                confidence: Number(topCount) / WINDOW,
                rms,
              };

              if (result.confidence >= 0.55) {
                setCurrentPitch(result);
                onPitchDetectedRef.current?.(result);
                lastKey.current = stableKi;
              }
            }
          }
        }

        rafRef.current = requestAnimationFrame(detect);
      };

      rafRef.current = requestAnimationFrame(detect);
    } catch (err) {
      let msg = "마이크 접근 실패";
      if (err instanceof Error) {
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          msg = "마이크 권한이 거부되었습니다. 설정에서 마이크를 허용해 주세요.";
        } else if (err.name === "NotFoundError") {
          msg = "마이크를 찾을 수 없습니다.";
        } else if (err.name === "NotReadableError") {
          msg = "마이크를 사용할 수 없습니다. 다른 앱이 마이크를 사용 중일 수 있습니다.";
        } else {
          msg = err.message;
        }
      }
      setError(msg);
      setIsListening(false);
    }
  }, []);

  // AppState 변경 시 복구 (네이티브)
  useEffect(() => {
    if (Platform.OS === "web") {
      // Web: visibility change
      const handler = async () => {
        if (document.visibilityState !== "visible") return;
        if (!isRunningRef.current) return;
        const ctx = ctxRef.current;
        if (ctx && ctx.state === "suspended") {
          try { await ctx.resume(); } catch { /* ignore */ }
        }
      };
      document.addEventListener("visibilitychange", handler);
      return () => document.removeEventListener("visibilitychange", handler);
    } else {
      // Native: AppState
      const subscription = AppState.addEventListener("change", (state: AppStateStatus) => {
        if (state === "active" && isRunningRef.current) {
          setIsRecovering(true);
          // 네이티브 복구 로직
          setTimeout(() => setIsRecovering(false), 1000);
        }
      });
      return () => subscription.remove();
    }
  }, []);

  // 클린업
  useEffect(() => () => { stopListening(); }, [stopListening]);

  return { isListening, currentPitch, startListening, stopListening, error, isRecovering };
}
