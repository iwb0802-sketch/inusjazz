import { useEffect, useRef } from "react";

/**
 * 스크롤 위치에 따라 [data-rf] 항목을 은은하게 활성화하는 훅.
 *  - 화면 중앙 띠(상단 38% ~ 58%)에 들어온 항목 → data-state="active"
 *  - 한 번 지나간 항목 → data-state="seen" (밝은 상태 유지, 훑은 양이 쌓여 보이게)
 *  - 아직 안 읽은 항목 → 상태 없음 (살짝 흐리게, CSS 쪽에서 처리)
 * 스크롤 가로채기·스냅 없음. DOM 속성만 바꿔서 리렌더 없음.
 * prefers-reduced-motion 이거나 IntersectionObserver가 없으면 아무것도 하지 않음(전부 평상시 표시).
 */
export function useReadingFocus<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-rf]"));
    const io = new IntersectionObserver(
      (entries) => {
        // IO는 '변화'에만 반응해서, 빠르게 건너뛴 항목은 콜백이 안 옴 → 띠 위로 지나간 항목을 한 번에 정리
        const bandTop = window.innerHeight * 0.38;
        for (const el of items) {
          if (!el.dataset.state && el.getBoundingClientRect().bottom <= bandTop) el.dataset.state = "seen";
        }
        for (const e of entries) {
          const el = e.target as HTMLElement;
          if (e.isIntersecting) {
            el.dataset.state = "active";
          } else if (e.rootBounds && e.boundingClientRect.bottom <= e.rootBounds.top) {
            // 띠 위로 지나간 항목(점프로 건너뛴 경우 포함)
            el.dataset.state = "seen";
          } else if (el.dataset.state === "active") {
            // 위로 되돌아 스크롤하며 띠 아래로 빠진 항목은 읽은 것으로 유지
            el.dataset.state = "seen";
          }
        }
      },
      { rootMargin: "-38% 0px -42% 0px", threshold: 0 }
    );

    items.forEach((el) => io.observe(el));
    root.dataset.rfOn = "";
    return () => {
      io.disconnect();
      delete root.dataset.rfOn;
    };
  }, []);

  return ref;
}
