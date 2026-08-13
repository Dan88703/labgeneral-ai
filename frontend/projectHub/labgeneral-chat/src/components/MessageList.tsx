import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/types/chat";
import { Message } from "@/components/Message";

interface MessageListProps {
  messages: ChatMessage[];
  onRetry: (messageId: string) => void;
}

const NEAR_BOTTOM_THRESHOLD_PX = 120;

export function MessageList({ messages, onRetry }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      isNearBottomRef.current =
        scrollHeight - scrollTop - clientHeight < NEAR_BOTTOM_THRESHOLD_PX;
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Trzyma widok przy najnowszej wiadomości — także w trakcie streamingu —
  // ale tylko wtedy, gdy użytkownik sam nie przewinął w górę, by przeczytać historię.
  useEffect(() => {
    if (isNearBottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [messages]);

  return (
    <div ref={containerRef} className="thin-scrollbar h-full overflow-y-auto">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6">
        {messages.map((message) => (
          <Message key={message.id} message={message} onRetry={onRetry} />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
