import { useCallback, useRef, useState } from "react";

export function useCopyToClipboard(resetAfterMs = 2000) {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          // Fallback dla starszych/niestandardowych środowisk bez Clipboard API.
          const textarea = document.createElement("textarea");
          textarea.value = text;
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
        }

        setIsCopied(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setIsCopied(false), resetAfterMs);
        return true;
      } catch (error) {
        console.error("Nie udało się skopiować do schowka:", error);
        return false;
      }
    },
    [resetAfterMs]
  );

  return { isCopied, copy };
}
