/**
 * SettingsModal - 설정 모달
 * 기준음 재생, 맥놀이, 내보내기, 안정 대기 시간 등
 */

import { useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
  Platform,
  StyleSheet,
  Alert,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Haptics from "expo-haptics";

import { useTuning } from "@/lib/tuning-context";
import { toggleReferenceNote, toggleBeat, stopAll, isPlaying } from "@/lib/reference-audio";
import { shareReport, shareCSV } from "@/lib/export-chart";

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const { activeSession, clearAllMeasurements, measuredCount } = useTuning();
  const [isRefPlaying, setIsRefPlaying] = useState(false);
  const [beatRate, setBeatRate] = useState<number | null>(null);
  const [userName, setUserName] = useState("");

  const handleReferenceNote = () => {
    const playing = toggleReferenceNote();
    setIsRefPlaying(playing);
    setBeatRate(null);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleBeat = (rate: number) => {
    if (beatRate === rate) {
      stopAll();
      setBeatRate(null);
      setIsRefPlaying(false);
    } else {
      const playing = toggleBeat(rate);
      if (playing) {
        setBeatRate(rate);
        setIsRefPlaying(true);
      }
    }
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleStopAll = () => {
    stopAll();
    setIsRefPlaying(false);
    setBeatRate(null);
  };

  const handleExportReport = () => {
    if (!activeSession) return;
    shareReport(activeSession, userName || undefined);
  };

  const handleExportCSV = () => {
    if (!activeSession) return;
    shareCSV(activeSession);
  };

  const handleClear = () => {
    Alert.alert(
      "측정 초기화",
      "현재 세션의 모든 측정 데이터를 삭제할까요?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "초기화",
          style: "destructive",
          onPress: () => {
            clearAllMeasurements();
            if (Platform.OS !== "web") {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            }
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.content} onPress={() => {}}>
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-foreground">설정</Text>
            <Pressable onPress={onClose} style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.6 }]}>
              <MaterialIcons name="close" size={22} color="#64748b" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* 기준음 */}
            <Text style={styles.sectionTitle}>기준음 / 맥놀이</Text>
            <View className="flex-row flex-wrap gap-2 mb-4">
              <Pressable
                onPress={handleReferenceNote}
                style={[styles.audioBtn, isRefPlaying && !beatRate && styles.audioBtnActive]}
              >
                <MaterialIcons name="music-note" size={16} color={isRefPlaying && !beatRate ? "#fff" : "#1e40af"} />
                <Text style={[styles.audioBtnText, isRefPlaying && !beatRate && { color: "#fff" }]}>
                  A4 (440Hz)
                </Text>
              </Pressable>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(rate => (
                <Pressable
                  key={rate}
                  onPress={() => handleBeat(rate)}
                  style={[styles.beatBtn, beatRate === rate && styles.beatBtnActive]}
                >
                  <Text style={[styles.beatBtnText, beatRate === rate && { color: "#fff" }]}>
                    {rate}Hz
                  </Text>
                </Pressable>
              ))}
              {isRefPlaying && (
                <Pressable onPress={handleStopAll} style={styles.stopBtn}>
                  <MaterialIcons name="stop" size={16} color="#fff" />
                  <Text style={styles.stopBtnText}>정지</Text>
                </Pressable>
              )}
            </View>

            {/* 내보내기 */}
            <Text style={styles.sectionTitle}>내보내기</Text>
            <TextInput
              value={userName}
              onChangeText={setUserName}
              placeholder="성명 입력 (리포트에 표시)"
              placeholderTextColor="#94a3b8"
              style={styles.input}
              returnKeyType="done"
            />
            <View className="flex-row gap-2 mt-2 mb-4">
              <Pressable
                onPress={handleExportReport}
                disabled={measuredCount === 0}
                style={[styles.exportBtn, measuredCount === 0 && { opacity: 0.4 }]}
              >
                <MaterialIcons name="description" size={18} color="#fff" />
                <Text style={styles.exportBtnText}>리포트 공유</Text>
              </Pressable>
              <Pressable
                onPress={handleExportCSV}
                disabled={measuredCount === 0}
                style={[styles.exportBtnGreen, measuredCount === 0 && { opacity: 0.4 }]}
              >
                <MaterialIcons name="table-chart" size={18} color="#fff" />
                <Text style={styles.exportBtnText}>CSV 공유</Text>
              </Pressable>
            </View>

            {/* 데이터 관리 */}
            <Text style={styles.sectionTitle}>데이터 관리</Text>
            <Pressable
              onPress={handleClear}
              disabled={measuredCount === 0}
              style={[styles.dangerBtn, measuredCount === 0 && { opacity: 0.4 }]}
            >
              <MaterialIcons name="delete-forever" size={18} color="#dc2626" />
              <Text style={styles.dangerBtnText}>현재 세션 측정 초기화</Text>
            </Pressable>

            <View style={{ height: 40 }} />
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "80%",
  },
  closeBtn: {
    padding: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  audioBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#1e40af",
    backgroundColor: "#eff6ff",
  },
  audioBtnActive: {
    backgroundColor: "#1e40af",
    borderColor: "#1e40af",
  },
  audioBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1e40af",
  },
  beatBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
  },
  beatBtnActive: {
    backgroundColor: "#d97706",
    borderColor: "#d97706",
  },
  beatBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  stopBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#dc2626",
  },
  stopBtnText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: "#0f172a",
  },
  exportBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#1e40af",
  },
  exportBtnGreen: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#16a34a",
  },
  exportBtnText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  dangerBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#fecaca",
    backgroundColor: "#fef2f2",
  },
  dangerBtnText: { fontSize: 13, fontWeight: "600", color: "#dc2626" },
});
