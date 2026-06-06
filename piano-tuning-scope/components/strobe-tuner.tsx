/**
 * StrobeTuner - PT-100 스타일 스트로브 튜너
 * 빨간 바가 센트 오차에 비례하여 흐르며, 정확하면 멈춤
 * React Native에서는 Animated API로 구현
 */

import { useEffect, useRef } from "react";
import { View, Text, Platform, StyleSheet, Animated } from "react-native";

interface StrobeTunerProps {
  detectedCents: number | null;
  isActive: boolean;
  keyIndex: number | null;
}

const BAR_COUNT = 12;
const BAR_WIDTH = 6;

export function StrobeTuner({ detectedCents, isActive, keyIndex }: StrobeTunerProps) {
  const offsetAnim = useRef(new Animated.Value(0)).current;
  const animRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (!isActive || detectedCents === null) {
      // 비활성: 애니메이션 정지
      if (animRef.current) {
        animRef.current.stop();
        animRef.current = null;
      }
      offsetAnim.setValue(0);
      return;
    }

    // 속도: 센트 오차에 비례 (0이면 멈춤)
    const speed = Math.abs(detectedCents);
    if (speed < 0.8) {
      // 거의 정확 - 멈춤
      if (animRef.current) {
        animRef.current.stop();
        animRef.current = null;
      }
      return;
    }

    // 방향에 따라 애니메이션
    const duration = Math.max(100, 3000 / speed);
    const toValue = detectedCents > 0 ? 1 : -1;

    const anim = Animated.loop(
      Animated.timing(offsetAnim, {
        toValue,
        duration,
        useNativeDriver: true,
      })
    );
    animRef.current = anim;
    anim.start();

    return () => {
      anim.stop();
    };
  }, [isActive, detectedCents, offsetAnim]);

  const isStopped = detectedCents !== null && Math.abs(detectedCents) <= 0.8;

  // 바 색상
  let barColor = "#3b0000"; // 비활성
  if (isActive && detectedCents !== null) {
    if (isStopped) {
      barColor = "#00ff50"; // 정확 - 초록
    } else {
      const brightness = Math.min(1, 0.4 + (Math.abs(detectedCents) / 15) * 0.6);
      const r = Math.round(235 * brightness);
      barColor = `rgb(${r}, 20, 20)`;
    }
  }

  const translateX = offsetAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-30, 0, 30],
  });

  return (
    <View style={styles.container}>
      {/* 스트로브 바 영역 */}
      <View style={styles.strobeArea}>
        <Animated.View
          style={[
            styles.barsContainer,
            { transform: [{ translateX }] },
          ]}
        >
          {Array.from({ length: BAR_COUNT * 3 }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.bar,
                {
                  backgroundColor: barColor,
                  opacity: (i % 3 === 0) ? 1 : 0.6,
                },
              ]}
            />
          ))}
        </Animated.View>

        {/* 정확 시 글로우 효과 */}
        {isStopped && (
          <View style={styles.glowOverlay} />
        )}
      </View>

      {/* 상태 표시 */}
      <View style={styles.statusBar}>
        <Text style={[styles.statusText, { color: getStatusColor(isActive, detectedCents, isStopped) }]}>
          {getStatusLabel(isActive, detectedCents, isStopped)}
        </Text>
        {detectedCents !== null && (
          <Text style={[styles.centsLabel, { color: isStopped ? "#22c55e" : "#f59e0b" }]}>
            {detectedCents > 0 ? "+" : ""}{detectedCents.toFixed(1)}¢
          </Text>
        )}
      </View>
    </View>
  );
}

function getStatusColor(isActive: boolean, cents: number | null, isStopped: boolean): string {
  if (!isActive) return "#4b5563";
  if (cents === null) return "#4b5563";
  if (isStopped) return "#22c55e";
  if (cents > 0) return "#f97316";
  return "#60a5fa";
}

function getStatusLabel(isActive: boolean, cents: number | null, isStopped: boolean): string {
  if (!isActive) return "대기 중";
  if (cents === null) return "무음";
  if (isStopped) return "● 정확";
  if (cents > 0) return "▶ 높음";
  return "◀ 낮음";
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#080808",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1e293b",
    marginBottom: 12,
  },
  strobeArea: {
    height: 52,
    overflow: "hidden",
    justifyContent: "center",
  },
  barsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    gap: 8,
    paddingHorizontal: 20,
  },
  bar: {
    width: BAR_WIDTH,
    height: 40,
    borderRadius: 2,
  },
  glowOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 255, 80, 0.08)",
  },
  statusBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#1e293b",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  centsLabel: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
});
