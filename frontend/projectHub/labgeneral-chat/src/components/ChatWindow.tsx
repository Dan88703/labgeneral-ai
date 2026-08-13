import type { Conversation } from "@/types/chat";
import { ChatHeader } from "@/components/ChatHeader";
import { MessageList } from "@/components/MessageList";
import { EmptyState } from "@/components/EmptyState";
import { ChatInput } from "@/components/ChatInput";

interface ChatWindowProps {
  conversation: Conversation | null;
  isStreaming: boolean;
  onSend: (text: string) => void;
  onRetry: (messageId: string) => void;
  onStartNew: () => void;
}

export function ChatWindow({
  conversation,
  isStreaming,
  onSend,
  onRetry,
  onStartNew,
}: ChatWindowProps) {
  const hasMessages = Boolean(conversation && conversation.messages.length > 0);

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col">
      {hasMessages && conversation && (
        <ChatHeader title={conversation.title} timestamp={conversation.createdAt} />
      )}

      <div className="min-h-0 flex-1">
        {hasMessages && conversation ? (
          <MessageList messages={conversation.messages} onRetry={onRetry} />
        ) : (
          <EmptyState onExampleClick={onSend} onStartNew={onStartNew} />
        )}
      </div>

      <ChatInput onSend={onSend} isStreaming={isStreaming} />
    </div>
  );
}
