/**
 * reference-audio.ts
 * 기준음(440Hz) 및 맥놀이(Beat) 재생
 * 
 * Web: Web Audio API OscillatorNode
 * Native: expo-audio (향후 구현)
 */

import { Platform } from "react-native";

let audioContext: AudioContext | null = null;
let oscillators: OscillatorNode[] = [];
let gainNodes: GainNode[] = [];

function getAudioContext(): AudioContext | null {
  if (Platform.OS !== "web") return null;
  if (!audioContext || audioContext.state === "closed") {
    const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
    audioContext = new AudioCtx();
  }
  return audioContext;
}

/**
 * 모든 재생 중인 오실레이터 정지
 */
export function stopAll(): void {
  gainNodes.forEach(g => {
    try {
      g.gain.setTargetAtTime(0, g.context.currentTime, 0.05);
    } catch { /* ignore */ }
  });
  setTimeout(() => {
    oscillators.forEach(o => {
      try { o.stop(); } catch { /* ignore */ }
    });
    oscillators = [];
    gainNodes = [];
  }, 100);
}

/**
 * 주파수 배열로 사인파 재생
 */
export function playFrequencies(freqs: number[]): boolean {
  const ctx = getAudioContext();
  if (!ctx) return false;

  stopAll();

  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }

  freqs.forEach(freq => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.value = 0.3 / freqs.length;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    oscillators.push(osc);
    gainNodes.push(gain);
  });

  return true;
}

/**
 * 기준음 A4 (440Hz) 재생/정지
 */
export function toggleReferenceNote(): boolean {
  if (oscillators.length > 0) {
    stopAll();
    return false;
  }
  return playFrequencies([440]);
}

/**
 * 맥놀이 재생/정지 (440Hz + 440+rate Hz)
 */
export function toggleBeat(rate: number): boolean {
  if (oscillators.length > 0) {
    stopAll();
    return false;
  }
  return playFrequencies([440, 440 + rate]);
}

/**
 * 현재 재생 중인지 확인
 */
export function isPlaying(): boolean {
  return oscillators.length > 0;
}
