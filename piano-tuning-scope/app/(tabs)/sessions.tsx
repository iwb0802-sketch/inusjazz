/**
 * Sessions Screen - 세션 관리
 * 세션 목록, 생성, 삭제, 이름 변경
 */

import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  Alert,
  Platform,
  StyleSheet,
  Modal,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { useTuning } from "@/lib/tuning-context";
import { TuningSession } from "@/lib/tuning-session";
import { cn } from "@/lib/utils";

export default function SessionsScreen() {
  const {
    sessions,
    activeSessionId,
    setActiveSessionId,
    createSession,
    deleteSession,
    renameSession,
    clearAllMeasurements,
  } = useTuning();

  const [showNewModal, setShowNewModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleCreate = () => {
    const name = newName.trim() || undefined;
    createSession(name);
    setNewName("");
    setShowNewModal(false);
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      "세션 삭제",
      `"${name}" 세션을 삭제할까요?\n모든 측정 데이터가 삭제됩니다.`,
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: () => deleteSession(id),
        },
      ]
    );
  };

  const handleRename = (id: string) => {
    if (editName.trim()) {
      renameSession(id, editName.trim());
    }
    setEditingId(null);
    setEditName("");
  };

  const renderSession = ({ item }: { item: TuningSession }) => {
    const isActive = item.id === activeSessionId;
    const count = Object.keys(item.measurements).length;
    const progress = (count / 88) * 100;

    return (
      <Pressable
        onPress={() => {
          setActiveSessionId(item.id);
          if (Platform.OS !== "web") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        }}
        style={({ pressed }) => [
          styles.sessionCard,
          isActive && styles.sessionCardActive,
          pressed && { opacity: 0.8 },
        ]}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1 mr-3">
            {editingId === item.id ? (
              <TextInput
                value={editName}
                onChangeText={setEditName}
                onBlur={() => handleRename(item.id)}
                onSubmitEditing={() => handleRename(item.id)}
                autoFocus
                style={styles.editInput}
                returnKeyType="done"
              />
            ) : (
              <>
                <Text
                  className={cn("text-base font-semibold", isActive ? "text-primary" : "text-foreground")}
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
                <Text className="text-xs text-muted mt-0.5">
                  {count}건반 측정 · {new Date(item.createdAt).toLocaleDateString("ko-KR")}
                </Text>
              </>
            )}
          </View>

          <View className="flex-row items-center gap-2">
            {/* 진행률 바 */}
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text className="text-xs text-muted w-8 text-right" style={styles.mono}>
              {count}
            </Text>

            {/* 액션 버튼 */}
            <Pressable
              onPress={() => {
                setEditingId(item.id);
                setEditName(item.name);
              }}
              style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.6 }]}
            >
              <MaterialIcons name="edit" size={16} color="#64748b" />
            </Pressable>
            <Pressable
              onPress={() => handleDelete(item.id, item.name)}
              style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.6 }]}
            >
              <MaterialIcons name="delete" size={16} color="#dc2626" />
            </Pressable>
          </View>
        </View>

        {/* 활성 표시 */}
        {isActive && (
          <View className="flex-row items-center mt-2 pt-2 border-t border-border">
            <View style={styles.activeDot} />
            <Text className="text-xs text-primary font-medium ml-1">현재 활성 세션</Text>
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <ScreenContainer className="bg-background">
      <View className="flex-1 px-4 pt-2">
        {/* 헤더 */}
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-lg font-bold text-foreground">세션 관리</Text>
            <Text className="text-xs text-muted">{sessions.length}개 세션</Text>
          </View>
          <Pressable
            onPress={() => setShowNewModal(true)}
            style={({ pressed }) => [styles.newBtn, pressed && { transform: [{ scale: 0.97 }] }]}
          >
            <MaterialIcons name="add" size={20} color="#fff" />
            <Text style={styles.newBtnText}>새 세션</Text>
          </Pressable>
        </View>

        {/* 세션 목록 */}
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id}
          renderItem={renderSession}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center py-16">
              <MaterialIcons name="folder-open" size={48} color="#94a3b8" />
              <Text className="text-muted mt-3 text-center">
                세션이 없습니다.{"\n"}새 세션을 만들어 시작하세요.
              </Text>
            </View>
          }
        />
      </View>

      {/* 새 세션 모달 */}
      <Modal visible={showNewModal} transparent animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowNewModal(false)}
        >
          <Pressable style={styles.modalContent} onPress={() => {}}>
            <Text className="text-lg font-bold text-foreground mb-4">새 세션 만들기</Text>
            <TextInput
              value={newName}
              onChangeText={setNewName}
              placeholder="세션 이름 (비워두면 자동 생성)"
              placeholderTextColor="#94a3b8"
              style={styles.modalInput}
              returnKeyType="done"
              onSubmitEditing={handleCreate}
            />
            <View className="flex-row gap-3 mt-4">
              <Pressable
                onPress={() => setShowNewModal(false)}
                style={({ pressed }) => [styles.cancelBtn, pressed && { opacity: 0.8 }]}
              >
                <Text style={styles.cancelBtnText}>취소</Text>
              </Pressable>
              <Pressable
                onPress={handleCreate}
                style={({ pressed }) => [styles.createBtn, pressed && { transform: [{ scale: 0.97 }] }]}
              >
                <Text style={styles.createBtnText}>만들기</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  mono: { fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace" },
  sessionCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  sessionCardActive: {
    backgroundColor: "#eff6ff",
    borderColor: "#93c5fd",
  },
  editInput: {
    fontSize: 15,
    fontWeight: "600",
    borderBottomWidth: 1,
    borderBottomColor: "#3b82f6",
    paddingVertical: 2,
    color: "#0f172a",
  },
  progressBar: {
    width: 40,
    height: 4,
    backgroundColor: "#e2e8f0",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3b82f6",
    borderRadius: 2,
  },
  iconBtn: {
    padding: 6,
    borderRadius: 8,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#3b82f6",
  },
  newBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#1e40af",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  newBtnText: { color: "#fff", fontSize: 14, fontWeight: "700" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 340,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#0f172a",
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
  },
  cancelBtnText: { fontSize: 15, fontWeight: "600", color: "#64748b" },
  createBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#1e40af",
    alignItems: "center",
  },
  createBtnText: { fontSize: 15, fontWeight: "700", color: "#fff" },
});
