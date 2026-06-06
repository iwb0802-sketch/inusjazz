/**
 * Home Screen - 튜너 메인 화면
 * 실시간 피치 감지, 스트로브 표시, 센트 미터
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, Pressable, Platform, Alert, StyleSheet } from "react-native";
import { useKeepAwake } from "expo-keep-awake";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { useTuning } from "@/lib/tuning-context";
import { usePitchDetector, PitchResult } from "@/hooks/use-pitch-detector";
import { PIANO_KEYS } from "@/lib/piano-keys";
import { isInRange } from "@/lib/tuning-curve-data";
import { cn } from "@/lib/utils";
import { StrobeTuner } from "@/components/strobe-tuner";
import { CentsMeter } from "@/components/cents-meter";
import { SettingsModal } from "@/components/settings-modal";

export default function HomeScreen() {
  const {
    activeSession,
    activeSessionId,
    createSession,
    recordMeasurement,
    undoLastMeasurement,
    undoStack,
    measuredCount,
  } = useTuning();

  const [autoSave, setAutoSave] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [pendingPitch, setPendingPitch] = useState<PitchResult | null>(null);
  const autoSaveRef = useRef(true);
  const pendingRef = useRef<PitchResult | null>(null);
  const lastAutoSavedKeyRef = useRef<number | null>(null);
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 화면 꺼짐 방지
  useKeepAwake();

  const handlePitchDetected = useCallback((result: PitchResult) => {
    if (result.confidence >= 0.55) {
      setPendingPitch(result);
      pendingRef.current = result;

      if (autoSaveRef.current && activeSessionId) {
        if (lastAutoSavedKeyRef.current === result.keyIndex) return;

        if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
        autoSaveTimerRef.current = setTimeout(() => {
          if (!autoSaveRef.current) return;
          const p = pendingRef.current;
          if (!p || p.keyIndex === lastAutoSavedKeyRef.current) return;
          recordMeasurement(p.keyIndex, p.cents, p.frequency);
          lastAutoSavedKeyRef.current = p.keyIndex;
          if (Platform.OS !== "web") {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
          setPendingPitch(null);
          pendingRef.current = null;
        }, 800);
      }
    }
  }, [activeSessionId, recordMeasurement]);

  const { isListening, currentPitch, startListening, stopListening, error } =
    usePitchDetector(handlePitchDetected);

  const handleToggleAutoSave = useCallback(() => {
    setAutoSave(prev => {
      const next = !prev;
      autoSaveRef.current = next;
      if (!next && autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
        autoSaveTimerRef.current = null;
      }
      return next;
    });
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);

  const saveCurrent = useCallback(() => {
    const p = pendingRef.current;
    if (!p || !activeSessionId) return;
    recordMeasurement(p.keyIndex, p.cents, p.frequency);
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setPendingPitch(null);
    pendingRef.current = null;
  }, [activeSessionId, recordMeasurement]);

  const handleUndo = useCallback(() => {
    const removed = undoLastMeasurement();
    if (removed !== null) {
      lastAutoSavedKeyRef.current = null;
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    }
  }, [undoLastMeasurement]);

  const toggleListening = async () => {
    if (!activeSessionId) {
      const session = createSession();
      if (!session) return;
    }
    if (isListening) {
      stopListening();
    } else {
      await startListening();
    }
  };

  const displayPitch = currentPitch || pendingPitch;

  return (
    <ScreenContainer className="bg-background">
      <View className="flex-1 px-4 pt-2">
        {/* 헤더 */}
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text className="text-lg font-bold text-foreground">Piano Tuning Scope</Text>
            <Text className="text-xs text-muted">
              {activeSession ? `${activeSession.name} · ${measuredCount}/88` : "세션을 선택하세요"}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            {measuredCount > 0 && (
              <View className="bg-primary/10 px-2 py-1 rounded-lg">
                <Text className="text-xs font-bold text-primary">
                  {Math.round((measuredCount / 88) * 100)}%
                </Text>
              </View>
            )}
            <Pressable
              onPress={() => setShowSettings(true)}
              style={({ pressed }) => [{ padding: 8, borderRadius: 10, backgroundColor: '#f1f5f9' }, pressed && { opacity: 0.7 }]}
            >
              <MaterialIcons name="settings" size={20} color="#64748b" />
            </Pressable>
          </View>
        </View>

        {/* 음 표시 영역 */}
        <View className="bg-surface rounded-2xl p-5 mb-3 border border-border items-center">
          {displayPitch ? (
            <>
              <Text className="text-5xl font-bold text-foreground" style={styles.mono}>
                {displayPitch.noteName}{displayPitch.octave}
              </Text>
              <Text className="text-sm text-muted mt-1" style={styles.mono}>
                건반 {displayPitch.keyIndex + 1} · {displayPitch.frequency.toFixed(1)} Hz
              </Text>
              <CentsMeter cents={displayPitch.cents} keyIndex={displayPitch.keyIndex} />
            </>
          ) : (
            <View className="items-center py-4">
              <MaterialIcons name="music-note" size={48} color="#94a3b8" />
              <Text className="text-muted mt-2 text-sm">
                {isListening ? "음을 감지하는 중..." : "마이크를 시작하세요"}
              </Text>
            </View>
          )}
        </View>

        {/* 스트로브 튜너 */}
        <StrobeTuner
          detectedCents={displayPitch?.cents ?? null}
          isActive={isListening}
          keyIndex={displayPitch?.keyIndex ?? null}
        />

        {/* 에러 표시 */}
        {error && (
          <View className="bg-error/10 rounded-xl px-4 py-2 mt-2">
            <Text className="text-error text-xs">{error}</Text>
          </View>
        )}

        {/* 하단 컨트롤 */}
        <View className="mt-auto pb-4">
          {/* 자동저장 + 되돌리기 */}
          <View className="flex-row items-center justify-between mb-3">
            <Pressable
              onPress={handleToggleAutoSave}
              style={({ pressed }) => [
                styles.toggleBtn,
                autoSave ? styles.toggleActive : styles.toggleInactive,
                pressed && { opacity: 0.8 },
              ]}
            >
              <View style={[styles.dot, autoSave ? styles.dotActive : styles.dotInactive]} />
              <Text style={[styles.toggleText, autoSave ? styles.toggleTextActive : styles.toggleTextInactive]}>
                {autoSave ? "자동저장 ON" : "자동저장 OFF"}
              </Text>
            </Pressable>

            <View className="flex-row items-center gap-2">
              {!autoSave && pendingPitch && (
                <Pressable
                  onPress={saveCurrent}
                  style={({ pressed }) => [styles.saveBtn, pressed && { transform: [{ scale: 0.97 }] }]}
                >
                  <MaterialIcons name="check" size={18} color="#fff" />
                  <Text style={styles.saveBtnText}>저장</Text>
                </Pressable>
              )}
              <Pressable
                onPress={handleUndo}
                disabled={undoStack.length === 0}
                style={({ pressed }) => [
                  styles.undoBtn,
                  undoStack.length === 0 && { opacity: 0.3 },
                  pressed && { transform: [{ scale: 0.97 }] },
                ]}
              >
                <MaterialIcons name="undo" size={18} color="#64748b" />
                {undoStack.length > 0 && (
                  <View style={styles.undoBadge}>
                    <Text style={styles.undoBadgeText}>{undoStack.length}</Text>
                  </View>
                )}
              </Pressable>
            </View>
          </View>

          {/* 마이크 버튼 */}
          <Pressable
            onPress={toggleListening}
            style={({ pressed }) => [
              styles.micBtn,
              isListening ? styles.micBtnActive : styles.micBtnInactive,
              pressed && { transform: [{ scale: 0.97 }] },
            ]}
          >
            <MaterialIcons
              name={isListening ? "mic-off" : "mic"}
              size={24}
              color="#fff"
            />
            <Text style={styles.micBtnText}>
              {isListening ? "감지 중지" : "마이크 시작"}
            </Text>
          </Pressable>
        </View>
      </View>
      <SettingsModal visible={showSettings} onClose={() => setShowSettings(false)} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  mono: { fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace" },
  toggleBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  toggleActive: {
    backgroundColor: "#ecfdf5",
    borderColor: "#6ee7b7",
  },
  toggleInactive: {
    backgroundColor: "#f8fafc",
    borderColor: "#e2e8f0",
  },
  toggleText: { fontSize: 13, fontWeight: "600" },
  toggleTextActive: { color: "#059669" },
  toggleTextInactive: { color: "#64748b" },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotActive: { backgroundColor: "#10b981" },
  dotInactive: { backgroundColor: "#cbd5e1" },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#1e40af",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  saveBtnText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  undoBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  undoBadge: {
    backgroundColor: "#e2e8f0",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  undoBadgeText: { fontSize: 10, fontWeight: "700", color: "#64748b" },
  micBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
  },
  micBtnActive: { backgroundColor: "#dc2626" },
  micBtnInactive: { backgroundColor: "#1e40af" },
  micBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
