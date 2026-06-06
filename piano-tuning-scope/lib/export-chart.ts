/**
 * export-chart.ts
 * 조율 커브 차트를 이미지로 내보내기 (공유 시트 활용)
 * 
 * React Native에서는 ViewShot이나 Canvas 대신
 * SVG를 문자열로 생성하여 공유하는 방식을 사용합니다.
 */

import { Platform, Share } from "react-native";
import { PIANO_KEYS } from "@/lib/piano-keys";
import { UPPER_ABS, LOWER_ABS, isInRange } from "@/lib/tuning-curve-data";
import { TuningSession } from "@/lib/tuning-session";

/**
 * 측정 데이터를 텍스트 리포트로 내보내기
 */
export function generateReport(session: TuningSession, userName?: string): string {
  const measurements = Object.values(session.measurements);
  const count = measurements.length;
  
  if (count === 0) return "측정 데이터가 없습니다.";

  const inRangeCount = measurements.filter(m => isInRange(m.keyIndex, m.cents)).length;
  const avg = measurements.reduce((s, m) => s + m.cents, 0) / count;
  const max = Math.max(...measurements.map(m => m.cents));
  const min = Math.min(...measurements.map(m => m.cents));

  let report = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  report += `  Piano Tuning Scope 조율 리포트\n`;
  report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  report += `세션: ${session.name}\n`;
  if (userName) report += `성명: ${userName}\n`;
  report += `날짜: ${new Date().toLocaleDateString("ko-KR")}\n`;
  report += `측정: ${count}/88 건반\n\n`;
  report += `── 통계 ──────────────────────────\n`;
  report += `  허용 범위 내: ${inRangeCount}/${count} (${Math.round((inRangeCount / count) * 100)}%)\n`;
  report += `  평균 오차: ${avg > 0 ? "+" : ""}${avg.toFixed(1)}¢\n`;
  report += `  최대: +${max.toFixed(1)}¢\n`;
  report += `  최소: ${min.toFixed(1)}¢\n\n`;
  report += `── 측정 상세 ──────────────────────\n`;
  report += `건반  음이름  센트    상태\n`;
  report += `────  ──────  ──────  ────\n`;

  measurements
    .sort((a, b) => a.keyIndex - b.keyIndex)
    .forEach(m => {
      const key = PIANO_KEYS[m.keyIndex];
      const inR = isInRange(m.keyIndex, m.cents);
      const pad = (s: string, n: number) => s.padEnd(n);
      report += `${pad(String(m.keyIndex + 1), 6)}${pad(`${key.noteName}${key.octave}`, 8)}${pad(`${m.cents > 0 ? "+" : ""}${m.cents.toFixed(1)}¢`, 8)}${inR ? "✓" : "✗"}\n`;
    });

  report += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  return report;
}

/**
 * 공유 시트를 통해 리포트 공유
 */
export async function shareReport(session: TuningSession, userName?: string): Promise<void> {
  const report = generateReport(session, userName);
  
  try {
    await Share.share({
      message: report,
      title: `조율 리포트 - ${session.name}`,
    });
  } catch (error) {
    console.error("Share failed:", error);
  }
}

/**
 * CSV 형식으로 내보내기
 */
export function generateCSV(session: TuningSession): string {
  let csv = "건반번호,음이름,옥타브,센트,주파수,허용범위내,측정시각\n";
  
  Object.values(session.measurements)
    .sort((a, b) => a.keyIndex - b.keyIndex)
    .forEach(m => {
      const key = PIANO_KEYS[m.keyIndex];
      const inR = isInRange(m.keyIndex, m.cents);
      csv += `${m.keyIndex + 1},${key.noteName},${key.octave},${m.cents.toFixed(1)},${m.frequency.toFixed(2)},${inR ? "Y" : "N"},${new Date(m.measuredAt).toISOString()}\n`;
    });

  return csv;
}

/**
 * CSV 공유
 */
export async function shareCSV(session: TuningSession): Promise<void> {
  const csv = generateCSV(session);
  
  try {
    await Share.share({
      message: csv,
      title: `조율데이터_${session.name}.csv`,
    });
  } catch (error) {
    console.error("Share CSV failed:", error);
  }
}
