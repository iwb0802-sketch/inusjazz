/**
 * use-tuning-session.ts
 * 조율 세션 상태 관리 훅
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { PIANO_KEYS } from "@/lib/piano-keys";
import {
  TuningSession,
  KeyMeasurement,
  loadSessions,
  saveSessions,
  loadActiveSessionId,
  saveActiveSessionId,
  createNewSession,
  addMeasurement,
  removeMeasurement,
  clearMeasurements,
  getMeasuredCount,
} from "@/lib/tuning-session";

export interface ChartDataPoint {
  keyNumber: number;
  keyIndex: number;
  noteName: string;
  octave: number;
  isBlack: boolean;
  cents: number | null;
  measured: boolean;
}

export function useTuningSession() {
  const [sessions, setSessions] = useState<TuningSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [undoStack, setUndoStack] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? null;

  // 초기 로드
  useEffect(() => {
    (async () => {
      const loaded = await loadSessions();
      const activeId = await loadActiveSessionId();
      setSessions(loaded);
      if (activeId && loaded.some(s => s.id === activeId)) {
        setActiveSessionId(activeId);
      }
      setIsLoading(false);
    })();
  }, []);

  // 디바운스 저장 (800ms)
  const debouncedSave = useCallback((updatedSessions: TuningSession[]) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveSessions(updatedSessions);
    }, 800);
  }, []);

  // 활성 세션 변경 시 저장
  useEffect(() => {
    if (!isLoading) {
      saveActiveSessionId(activeSessionId);
    }
  }, [activeSessionId, isLoading]);

  const handleSetActiveSessionId = useCallback((id: string | null) => {
    setActiveSessionId(id);
    setUndoStack([]);
  }, []);

  const handleCreateSession = useCallback((name?: string) => {
    const session = createNewSession(name);
    setSessions(prev => {
      const updated = [session, ...prev].slice(0, 20);
      debouncedSave(updated);
      return updated;
    });
    setActiveSessionId(session.id);
    setUndoStack([]);
    return session;
  }, [debouncedSave]);

  const handleDeleteSession = useCallback((id: string) => {
    setSessions(prev => {
      const updated = prev.filter(s => s.id !== id);
      debouncedSave(updated);
      return updated;
    });
    setActiveSessionId(prev => prev === id ? null : prev);
  }, [debouncedSave]);

  const handleRenameSession = useCallback((id: string, name: string) => {
    setSessions(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, name } : s);
      debouncedSave(updated);
      return updated;
    });
  }, [debouncedSave]);

  const recordMeasurement = useCallback(
    (keyIndex: number, cents: number, frequency: number) => {
      if (!activeSessionId) return;
      setSessions(prev => {
        const updated = prev.map(s =>
          s.id === activeSessionId
            ? addMeasurement(s, keyIndex, cents, frequency)
            : s
        );
        debouncedSave(updated);
        return updated;
      });
      setUndoStack(prev => [...prev, keyIndex]);
    },
    [activeSessionId, debouncedSave]
  );

  const undoLastMeasurement = useCallback((): number | null => {
    if (undoStack.length === 0 || !activeSessionId) return null;
    const lastKeyIndex = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    setSessions(prev => {
      const updated = prev.map(s =>
        s.id === activeSessionId ? removeMeasurement(s, lastKeyIndex) : s
      );
      debouncedSave(updated);
      return updated;
    });
    return lastKeyIndex;
  }, [activeSessionId, undoStack, debouncedSave]);

  const handleClearAllMeasurements = useCallback(() => {
    if (!activeSessionId) return;
    setSessions(prev => {
      const updated = prev.map(s =>
        s.id === activeSessionId ? clearMeasurements(s) : s
      );
      debouncedSave(updated);
      return updated;
    });
    setUndoStack([]);
  }, [activeSessionId, debouncedSave]);

  // 차트 데이터 생성
  const chartData: ChartDataPoint[] = PIANO_KEYS.map((key, i) => {
    const m = activeSession?.measurements[i];
    return {
      keyNumber: key.keyNumber,
      keyIndex: i,
      noteName: key.noteName,
      octave: key.octave,
      isBlack: key.isBlack,
      cents: m ? m.cents : null,
      measured: !!m,
    };
  });

  const measuredCount = getMeasuredCount(activeSession);

  return {
    sessions,
    activeSession,
    activeSessionId,
    setActiveSessionId: handleSetActiveSessionId,
    createSession: handleCreateSession,
    deleteSession: handleDeleteSession,
    renameSession: handleRenameSession,
    recordMeasurement,
    undoLastMeasurement,
    undoStack,
    clearAllMeasurements: handleClearAllMeasurements,
    chartData,
    measuredCount,
    isLoading,
  };
}
