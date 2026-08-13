import { AlertCircle, FlaskConical, RotateCw, User } from "lucide-react";
import type { ChatMessage } from "@/types/chat";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { CopyButton } from "@/components/CopyButton";
import { cn, formatTime } from "@/lib/utils";

interface MessageProps {
  message: ChatMessage;
  onRetry: (messageId: string) => void;
}

export function Message({ message, onRetry }: MessageProps) {
  const isUser = message.role === "user";
  const isEmptyAndStreaming = message.status === "streaming" && message.content.length === 0;
  const isTypingLive = message.status === "streaming" && message.content.length > 0;

  return (
    <div
      className={cn("flex items-start gap-3 animate-fade-in-up", isUser && "flex-row-reverse")}
    >
      <Avatar className="mt-0.5 rounded-lg">
        {isUser ? (
          <AvatarFallback className="rounded-lg bg-secondary text-secondary-foreground">
            <User className="h-4 w-4" aria-hidden="true" />
          </AvatarFallback>
        ) : (
          <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
            <FlaskConical className="h-4 w-4" aria-hidden="true" />
          </AvatarFallback>
        )}
      </Avatar>

      <div
        className={cn(
          "flex min-w-0 max-w-[88%] flex-col gap-1 sm:max-w-[75%]",
          isUser && "items-end"
        )}
      >
        <div
          className={cn(
            "min-w-0 rounded-2xl px-4 py-2.5",
            isUser
              ? "bg-primary text-primary-foreground"
              : "border border-border bg-card"
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap break-words text-[0.95rem] leading-6">
              {message.content}
            </p>
          ) : isEmptyAndStreaming ? (
            <LoadingIndicator />
          ) : (
            <>
              <MarkdownRenderer content={message.content} />
              {isTypingLive && (
                <span
                  className="ml-0.5 inline-block h-4 w-[3px] translate-y-0.5 animate-blink bg-primary"
                  aria-hidden="true"
                />
              )}
            </>
          )}
        </div>

        {!isUser && message.status === "error" && (
          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="flex-1">
              {message.errorMessage ?? "Wystąpił błąd podczas generowania odpowiedzi."}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRetry(message.id)}
              className="h-6 gap-1 px-2 text-xs text-destructive hover:bg-destructive/15 hover:text-destructive"
            >
              <RotateCw className="h-3 w-3" aria-hidden="true" />
              Ponów
            </Button>
          </div>
        )}

        <div
          className={cn(
            "flex items-center gap-2 px-1 text-xs text-muted-foreground",
            isUser && "flex-row-reverse"
          )}
        >
          <span>{formatTime(message.createdAt)}</span>
          {!isUser && message.status === "idle" && message.content && (
            <CopyButton text={message.content} />
          )}
        </div>
      </div>
    </div>
  );
}
