import { useEffect, useState } from "react";

/** 화면에 들어오면(start=true) 0에서 target까지 한 번만 올라가는 숫자. reduced-motion이면 바로 최종값. */
export function useCountUp(target: number, start: boolean, duration = 1100) {
  const [value, setValue] = useState(target);

  useEffect(() => {
    if (!start) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    setValue(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);

  return value;
}
