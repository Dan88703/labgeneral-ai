import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowUp, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAutoResizeTextarea } from "@/hooks/useAutoResizeTextarea";

interface WidgetChatInputProps {
    onSend: (text: string) => void;
    isStreaming: boolean;
}

const MAX_TEXTAREA_HEIGHT_PX = 120;

/**
 * Uproszczona wersja ChatInput dla widgetu — bez CategoryChips i bez
 * stopki z zastrzeżeniem, zgodnie z wytyczną „tylko linia promptu, nic więcej".
 */
export function WidgetChatInput({ onSend, isStreaming }: WidgetChatInputProps) {
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
        if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
            event.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex items-end gap-2 rounded-2xl border border-input bg-card px-3 py-2 shadow-sm transition-colors focus-within:border-primary/50">
            <Textarea
                ref={textareaRef}
                value={value}
                onChange={(event) => setValue(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Napisz wiadomość…"
                rows={1}
                disabled={isStreaming}
                aria-label="Treść wiadomości"
                className="max-h-[120px] py-1.5 border-none shadow-none focus-visible:ring-0"
            />
            <Button
                type="button"
                size="icon"
                onClick={handleSend}
                disabled={!canSend}
                aria-label="Wyślij wiadomość"
                className="mb-0.5 shrink-0 rounded-xl"
                style={canSend ? { background: "var(--color-yellow)", color: "var(--color-text)" } : undefined}
            >
                {isStreaming ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                    <ArrowUp className="h-4 w-4" aria-hidden="true" />
                )}
            </Button>
        </div>
    );
}