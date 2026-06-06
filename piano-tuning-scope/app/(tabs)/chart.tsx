/**
 * Chart Screen - 조율 커브 그래프
 * PT-100 스타일 88건반 조율 커브 시각화
 */

import { useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable, Platform, StyleSheet, Dimensions } from "react-native";
import Svg, { Line, Circle, Path, Rect, G, Text as SvgText } from "react-native-svg";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { ScreenContainer } from "@/components/screen-container";
import { useTuning } from "@/lib/tuning-context";
import { PIANO_KEYS } from "@/lib/piano-keys";
import { UPPER_ABS, LOWER_ABS, isInRange } from "@/lib/tuning-curve-data";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ChartScreen() {
  const { activeSession, chartData, measuredCount } = useTuning();
  const [showStats, setShowStats] = useState(true);

  // SVG 치수
  const SVG_W = Math.max(SCREEN_WIDTH - 32, 340);
  const SVG_H = 320;
  const PAD = { top: 25, right: 35, bottom: 50, left: 35 };
  const PW = SVG_W - PAD.left - PAD.right;
  const PH = SVG_H - PAD.top - PAD.bottom;
  const Y_MIN = -40;
  const Y_MAX = 40;
  const Y_RANGE = Y_MAX - Y_MIN;

  const xOf = (ki: number) => (ki / 87) * PW;
  const yOf = (c: number) => PH - ((c - Y_MIN) / Y_RANGE) * PH;

  // 허용 커브 경로
  const upperPath = useMemo(() => {
    let d = "";
    for (let i = 0; i < 88; i++) {
      const x = xOf(i);
      const y = yOf(UPPER_ABS[i]);
      d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    }
    return d;
  }, []);

  const lowerPath = useMemo(() => {
    let d = "";
    for (let i = 0; i < 88; i++) {
      const x = xOf(i);
      const y = yOf(LOWER_ABS[i]);
      d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    }
    return d;
  }, []);

  // A음 인덱스
  const aIndices = PIANO_KEYS
    .map((k, i) => ({ ...k, i }))
    .filter(k => k.noteName === "A")
    .map(k => k.i);

  // 통계
  const measured = chartData.filter(d => d.cents !== null);
  const stats = useMemo(() => {
    if (measured.length === 0) return null;
    const values = measured.map(d => d.cents!);
    const avg = values.reduce((s, v) => s + v, 0) / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const inRangeCount = measured.filter(d => isInRange(d.keyIndex, d.cents!)).length;
    return { avg, max, min, inRangeCount, total: measured.length };
  }, [measured]);

  return (
    <ScreenContainer className="bg-background">
      <View className="flex-1 px-4 pt-2">
        {/* 헤더 */}
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text className="text-lg font-bold text-foreground">조율 커브</Text>
            <Text className="text-xs text-muted">
              {activeSession ? activeSession.name : "세션 없음"}
            </Text>
          </View>
          {measuredCount > 0 && (
            <View className="bg-primary/10 px-3 py-1.5 rounded-lg">
              <Text className="text-sm font-bold text-primary">
                {measuredCount}/88
              </Text>
            </View>
          )}
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* 그래프 */}
          <View className="bg-surface rounded-2xl p-3 border border-border mb-3">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Svg width={SVG_W} height={SVG_H}>
                <G x={PAD.left} y={PAD.top}>
                  {/* 배경 */}
                  <Rect x={0} y={0} width={PW} height={PH} fill="#ffffff" stroke="#374151" strokeWidth={0.8} />

                  {/* 수평 격자 (10센트 단위) */}
                  {[-40, -30, -20, -10, 0, 10, 20, 30, 40].map(c => (
                    <Line
                      key={`h${c}`}
                      x1={0} y1={yOf(c)} x2={PW} y2={yOf(c)}
                      stroke={c === 0 ? "#374151" : "#e5e7eb"}
                      strokeWidth={c === 0 ? 1 : 0.5}
                    />
                  ))}

                  {/* A음 수직선 */}
                  {aIndices.map(ki => (
                    <Line
                      key={`a${ki}`}
                      x1={xOf(ki)} y1={0} x2={xOf(ki)} y2={PH}
                      stroke="#94a3b8" strokeWidth={0.5} strokeDasharray="3,3"
                    />
                  ))}

                  {/* 허용 커브 */}
                  <Path d={upperPath} fill="none" stroke="#1f2937" strokeWidth={1.5} />
                  <Path d={lowerPath} fill="none" stroke="#1f2937" strokeWidth={1.5} />

                  {/* 측정 점 */}
                  {chartData.filter(d => d.cents !== null).map(d => {
                    const inR = isInRange(d.keyIndex, d.cents!);
                    return (
                      <Circle
                        key={`p${d.keyIndex}`}
                        cx={xOf(d.keyIndex)}
                        cy={yOf(d.cents!)}
                        r={3.5}
                        fill={inR ? "#1e3a5f" : "#dc2626"}
                      />
                    );
                  })}

                  {/* Y축 레이블 */}
                  {[-40, -20, 0, 20, 40].map(c => (
                    <SvgText
                      key={`yl${c}`}
                      x={-5} y={yOf(c) + 3}
                      textAnchor="end"
                      fontSize={8}
                      fill="#64748b"
                    >
                      {c > 0 ? `+${c}` : `${c}`}
                    </SvgText>
                  ))}

                  {/* X축 레이블 */}
                  {[1, 10, 20, 30, 40, 50, 60, 70, 80, 88].map(kn => (
                    <SvgText
                      key={`xl${kn}`}
                      x={xOf(kn - 1)} y={PH + 12}
                      textAnchor="middle"
                      fontSize={7}
                      fill="#64748b"
                    >
                      {kn}
                    </SvgText>
                  ))}

                  {/* A음 상단 마커 */}
                  {aIndices.map(ki => (
                    <SvgText
                      key={`am${ki}`}
                      x={xOf(ki)} y={-8}
                      textAnchor="middle"
                      fontSize={8}
                      fontWeight="bold"
                      fill="#374151"
                    >
                      A
                    </SvgText>
                  ))}

                  {/* 피아노 건반 (하단) */}
                  {PIANO_KEYS.map((key, i) => {
                    if (key.isBlack) return null;
                    const x = xOf(i);
                    const w = PW / 52;
                    return (
                      <Rect
                        key={`wk${i}`}
                        x={x - w / 2}
                        y={PH + 18}
                        width={w - 0.5}
                        height={20}
                        fill={chartData[i].measured ? "#dbeafe" : "#ffffff"}
                        stroke="#94a3b8"
                        strokeWidth={0.3}
                      />
                    );
                  })}
                  {PIANO_KEYS.map((key, i) => {
                    if (!key.isBlack) return null;
                    const x = xOf(i);
                    const w = (PW / 52) * 0.6;
                    return (
                      <Rect
                        key={`bk${i}`}
                        x={x - w / 2}
                        y={PH + 18}
                        width={w}
                        height={13}
                        fill={chartData[i].measured ? "#1e40af" : "#1f2937"}
                      />
                    );
                  })}
                </G>
              </Svg>
            </ScrollView>

            {/* 범례 */}
            <View className="flex-row items-center justify-center gap-4 mt-2">
              <View className="flex-row items-center gap-1">
                <View style={{ width: 20, height: 2, backgroundColor: "#1f2937" }} />
                <Text className="text-xs text-muted">허용 범위</Text>
              </View>
              <View className="flex-row items-center gap-1">
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#1e3a5f" }} />
                <Text className="text-xs text-muted">범위 내</Text>
              </View>
              <View className="flex-row items-center gap-1">
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#dc2626" }} />
                <Text className="text-xs text-muted">범위 외</Text>
              </View>
            </View>
          </View>

          {/* 통계 */}
          {stats && (
            <View className="bg-surface rounded-2xl p-4 border border-border mb-3">
              <Text className="text-sm font-bold text-foreground mb-3">측정 통계</Text>
              <View className="flex-row flex-wrap gap-3">
                <StatCard label="측정 완료" value={`${stats.total}/88`} color="#1e40af" />
                <StatCard label="범위 내" value={`${stats.inRangeCount}건`} color="#16a34a" />
                <StatCard label="평균 오차" value={`${stats.avg > 0 ? "+" : ""}${stats.avg.toFixed(1)}¢`} color="#d97706" />
                <StatCard label="최대" value={`+${stats.max.toFixed(1)}¢`} color="#dc2626" />
                <StatCard label="최소" value={`${stats.min.toFixed(1)}¢`} color="#3b82f6" />
              </View>
            </View>
          )}

          {/* 빈 상태 */}
          {measuredCount === 0 && (
            <View className="items-center py-12">
              <MaterialIcons name="show-chart" size={48} color="#94a3b8" />
              <Text className="text-muted mt-3 text-center">
                아직 측정 데이터가 없습니다.{"\n"}튜너 탭에서 측정을 시작하세요.
              </Text>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Text className="text-xs text-muted">{label}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statCard: {
    flex: 1,
    minWidth: 80,
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    padding: 10,
    borderLeftWidth: 3,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "800",
    marginTop: 2,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
});
