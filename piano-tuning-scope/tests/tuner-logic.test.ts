/**
 * 튜너 핵심 로직 테스트
 */
import { describe, it, expect } from "vitest";
import { PIANO_KEYS, freqToCentOffset, correctOctaveError, median } from "../lib/piano-keys";
import { UPPER_ABS, LOWER_ABS, isInRange, RAILSBACK } from "../lib/tuning-curve-data";
import { detectPitchYIN, getRMS } from "../lib/pitch-detector";

describe("Piano Keys", () => {
  it("should have 88 keys", () => {
    expect(PIANO_KEYS).toHaveLength(88);
  });

  it("first key should be A0 (MIDI 21)", () => {
    expect(PIANO_KEYS[0].midi).toBe(21);
    expect(PIANO_KEYS[0].noteName).toBe("A");
    expect(PIANO_KEYS[0].octave).toBe(0);
    expect(PIANO_KEYS[0].keyNumber).toBe(1);
  });

  it("A4 (key 49) should be ~440Hz", () => {
    const a4 = PIANO_KEYS[48]; // index 48 = key 49
    expect(a4.noteName).toBe("A");
    expect(a4.octave).toBe(4);
    expect(Math.abs(a4.freq - 440)).toBeLessThan(0.01);
  });

  it("last key should be C8 (MIDI 108)", () => {
    expect(PIANO_KEYS[87].midi).toBe(108);
    expect(PIANO_KEYS[87].noteName).toBe("C");
    expect(PIANO_KEYS[87].octave).toBe(8);
  });
});

describe("freqToCentOffset", () => {
  it("440Hz should return A4 with 0 cents", () => {
    const result = freqToCentOffset(440);
    expect(result).not.toBeNull();
    expect(result!.keyIndex).toBe(48); // A4
    expect(Math.abs(result!.cents)).toBeLessThan(0.1);
  });

  it("442Hz should return A4 with positive cents", () => {
    const result = freqToCentOffset(442);
    expect(result).not.toBeNull();
    expect(result!.keyIndex).toBe(48);
    expect(result!.cents).toBeGreaterThan(0);
    expect(result!.cents).toBeLessThan(10);
  });

  it("should return null for out-of-range frequencies", () => {
    expect(freqToCentOffset(0)).toBeNull();
    expect(freqToCentOffset(-1)).toBeNull();
    expect(freqToCentOffset(10)).toBeNull(); // below A0
  });

  it("C4 (261.63Hz) should be correctly identified", () => {
    const result = freqToCentOffset(261.63);
    expect(result).not.toBeNull();
    expect(result!.note.noteName).toBe("C");
    expect(result!.note.octave).toBe(4);
  });
});

describe("correctOctaveError", () => {
  it("should correct +12 semitone error", () => {
    expect(correctOctaveError(60, 48)).toBe(48);
  });

  it("should correct -12 semitone error", () => {
    expect(correctOctaveError(36, 48)).toBe(48);
  });

  it("should not correct non-octave differences", () => {
    expect(correctOctaveError(50, 48)).toBe(50);
  });

  it("should return detected if ref is null", () => {
    expect(correctOctaveError(48, null)).toBe(48);
  });
});

describe("median", () => {
  it("should return median of odd array", () => {
    expect(median([1, 3, 5])).toBe(3);
  });

  it("should return median of even array", () => {
    expect(median([1, 2, 3, 4])).toBe(2.5);
  });

  it("should return 0 for empty array", () => {
    expect(median([])).toBe(0);
  });
});

describe("Tuning Curve Data", () => {
  it("should have 88 entries for UPPER_ABS", () => {
    expect(UPPER_ABS).toHaveLength(88);
  });

  it("should have 88 entries for LOWER_ABS", () => {
    expect(LOWER_ABS).toHaveLength(88);
  });

  it("UPPER should always be >= LOWER", () => {
    for (let i = 0; i < 88; i++) {
      expect(UPPER_ABS[i]).toBeGreaterThanOrEqual(LOWER_ABS[i]);
    }
  });

  it("isInRange should work correctly", () => {
    // A4 (key 49, index 48): upper=4, lower=-8
    expect(isInRange(48, 0)).toBe(true);
    expect(isInRange(48, 3)).toBe(true);
    expect(isInRange(48, -7)).toBe(true);
    expect(isInRange(48, 10)).toBe(false);
    expect(isInRange(48, -15)).toBe(false);
  });

  it("RAILSBACK should be between LOWER and UPPER", () => {
    for (let i = 0; i < 88; i++) {
      expect(RAILSBACK[i]).toBeGreaterThanOrEqual(LOWER_ABS[i]);
      expect(RAILSBACK[i]).toBeLessThanOrEqual(UPPER_ABS[i]);
    }
  });
});

describe("Pitch Detection", () => {
  it("getRMS should return 0 for silence", () => {
    const silence = new Float32Array(1024);
    expect(getRMS(silence)).toBe(0);
  });

  it("getRMS should return correct value for known signal", () => {
    const buf = new Float32Array(4);
    buf[0] = 1; buf[1] = -1; buf[2] = 1; buf[3] = -1;
    expect(getRMS(buf)).toBe(1);
  });

  it("detectPitchYIN should return -1 for silence", () => {
    const silence = new Float32Array(4096);
    expect(detectPitchYIN(silence, 44100)).toBe(-1);
  });

  it("detectPitchYIN should detect 440Hz sine wave", () => {
    const sampleRate = 44100;
    const freq = 440;
    const buf = new Float32Array(4096);
    for (let i = 0; i < buf.length; i++) {
      buf[i] = Math.sin(2 * Math.PI * freq * i / sampleRate);
    }
    const detected = detectPitchYIN(buf, sampleRate);
    expect(detected).toBeGreaterThan(430);
    expect(detected).toBeLessThan(450);
  });

  it("detectPitchYIN should detect 261.63Hz (C4)", () => {
    const sampleRate = 44100;
    const freq = 261.63;
    const buf = new Float32Array(4096);
    for (let i = 0; i < buf.length; i++) {
      buf[i] = Math.sin(2 * Math.PI * freq * i / sampleRate);
    }
    const detected = detectPitchYIN(buf, sampleRate);
    expect(detected).toBeGreaterThan(255);
    expect(detected).toBeLessThan(268);
  });
});
