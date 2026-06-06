/**
 * CentsMeter - 센트 오차 시각화 컴포넌트
 * 수평 바 + 큰 숫자로 현재 오차 표시
 */

import { View, Text, Platform, StyleSheet } from "react-native";
import { isInRange, UPPER_ABS, LOWER_ABS } from "@/lib/tuning-curve-data";

interface CentsMeterProps {
  cents: number;
  keyIndex: number;
}

export function CentsMeter({ cents, keyIndex }: CentsMeterProps) {
  const inRange = isInRange(keyIndex, cents);
  const absCents = Math.abs(cents);

  // 색상 결정
  let color = "#16a34a"; // 녹색 (정확)
  if (absCents > 8) color = "#dc2626"; // 빨강 (크게 벗어남)
  else if (absCents > 3) color = "#d97706"; // 주황 (약간 벗어남)

  // 바 위치 계산 (-50 ~ +50 범위를 0~100%로 매핑)
  const barPosition = Math.max(0, Math.min(100, ((cents + 50) / 100) * 100));

  return (
    <View className="w-full mt-4">
      {/* 센트 숫자 */}
      <View className="items-center mb-2">
        <Text
          style={[styles.centsText, { color }]}
        >
          {cents > 0 ? "+" : ""}{cents.toFixed(1)}¢
        </Text>
        <Text className="text-xs text-muted mt-0.5">
          {inRange ? "허용 범위 내" : "허용 범위 초과"}
        </Text>
      </View>

      {/* 수평 바 */}
      <View className="w-full h-3 bg-border rounded-full overflow-hidden relative">
        {/* 중앙 마커 */}
        <View style={styles.centerLine} />
        {/* 현재 위치 인디케이터 */}
        <View
          style={[
            styles.indicator,
            {
              left: `${barPosition}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>

      {/* 스케일 레이블 */}
      <View className="flex-row justify-between mt-1">
        <Text className="text-xs text-muted" style={styles.mono}>-50</Text>
        <Text className="text-xs text-muted" style={styles.mono}>0</Text>
        <Text className="text-xs text-muted" style={styles.mono}>+50</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centsText: {
    fontSize: 36,
    fontWeight: "800",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  centerLine: {
    position: "absolute",
    left: "50%",
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: "#64748b",
    marginLeft: -1,
    zIndex: 1,
  },
  indicator: {
    position: "absolute",
    top: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    marginLeft: -7,
    borderWidth: 2,
    borderColor: "#fff",
    zIndex: 2,
  },
  mono: {
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
});
