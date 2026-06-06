/**
 * tuning-context.tsx
 * 앱 전역 튜닝 세션 상태 컨텍스트
 */

import React, { createContext, useContext, ReactNode } from "react";
import { useTuningSession } from "@/hooks/use-tuning-session";

type TuningContextType = ReturnType<typeof useTuningSession>;

const TuningContext = createContext<TuningContextType | null>(null);

export function TuningProvider({ children }: { children: ReactNode }) {
  const tuning = useTuningSession();
  return (
    <TuningContext.Provider value={tuning}>
      {children}
    </TuningContext.Provider>
  );
}

export function useTuning(): TuningContextType {
  const ctx = useContext(TuningContext);
  if (!ctx) throw new Error("useTuning must be used within TuningProvider");
  return ctx;
}
