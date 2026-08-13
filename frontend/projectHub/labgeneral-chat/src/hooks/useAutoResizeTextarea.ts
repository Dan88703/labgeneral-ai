import { useLayoutEffect, type RefObject } from "react";

/**
 * Automatycznie dopasowuje wysokość textarea do wpisywanej treści,
 * do zadanej wysokości maksymalnej (potem pojawia się scroll wewnątrz pola).
 */
export function useAutoResizeTextarea(
  ref: RefObject<HTMLTextAreaElement>,
  value: string,
  maxHeightPx = 200
) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.height = "auto";
    const nextHeight = Math.min(el.scrollHeight, maxHeightPx);
    el.style.height = `${nextHeight}px`;
    el.style.overflowY = el.scrollHeight > maxHeightPx ? "auto" : "hidden";
  }, [ref, value, maxHeightPx]);
}
