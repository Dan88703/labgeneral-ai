import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowUp, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAutoResizeTextarea } from "@/hooks/useAutoResizeTextarea";
import { SITE_HOSTNAME } from "@/lib/constants";

interface ChatInputProps {
  onSend: (text: string) => void;
  isStreaming: boolean;
}

const MAX_TEXTAREA_HEIGHT_PX = 200;

export function ChatInput({ onSend, isStreaming }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useAutoResizeTextarea(textareaRef, value, MAX_TEXTAREA_HEIGHT_PX);

  const canSend = value.trim().length > 0 && !isStreaming;

  const handleSend = () => {
    if (!canSend) return;
    onSend(value);
    setValue("");
    requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    // isComposing chroni użytkowników korzystających z IME (np. wpisujących
    // znaki azjatyckie), dla których Enter zatwierdza tylko wybór znaku.
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="shrink-0 border-t border-border bg-background px-3 pb-3 pt-2.5 sm:px-6 sm:pb-5">

      <div className="mx-auto flex w-full max-w-3xl items-end gap-2 rounded-2xl border border-input bg-card px-3 py-2 shadow-sm transition-colors focus-within:border-primary/50">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Zapytaj o produkty, wysyłkę, ceny…"
          rows={1}
          disabled={isStreaming}
          aria-label="Treść wiadomości"
          className="max-h-[200px] py-1.5"
        />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              size="icon"
              onClick={handleSend}
              disabled={!canSend}
              aria-label="Wyślij wiadomość"
              className="mb-0.5 shrink-0 rounded-xl"
            >
              {isStreaming ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <ArrowUp className="h-4 w-4" aria-hidden="true" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Wyślij (Enter)</TooltipContent>
        </Tooltip>
      </div>

      <p className="mx-auto mt-2 max-w-3xl text-center text-[11px] text-muted-foreground">
        Odpowiedzi bazują na publicznie dostępnych informacjach z {SITE_HOSTNAME}
      </p>
    </div>
  );
}
