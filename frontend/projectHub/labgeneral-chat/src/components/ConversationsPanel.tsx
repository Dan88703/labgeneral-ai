import type { Conversation } from "@/types/chat";
import { NewConversationButton } from "@/components/NewConversationButton";
import { ConversationItem } from "@/components/ConversationItem";
import { EXAMPLE_QUESTIONS } from "@/lib/constants";

interface ConversationsPanelProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onNewConversation: () => void;
  onQuickAsk: (question: string) => void;
}

export function ConversationsPanel({
  conversations,
  activeId,
  onSelect,
  onDelete,
  onNewConversation,
  onQuickAsk,
}: ConversationsPanelProps) {
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="px-3 pb-3 pt-4">
        <NewConversationButton onClick={onNewConversation} />
      </div>

      <nav
        aria-label="Historia rozmów"
        className="thin-scrollbar flex-1 space-y-0.5 overflow-y-auto px-3 pb-2"
      >
        {conversations.length === 0 ? (
          <p className="px-3 py-6 text-center text-xs leading-5 text-muted-foreground">
            Historia rozmów pojawi się tutaj po wysłaniu pierwszej wiadomości.
          </p>
        ) : (
          conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isActive={conversation.id === activeId}
              onSelect={() => onSelect(conversation.id)}
              onDelete={() => onDelete(conversation.id)}
            />
          ))
        )}
      </nav>

      <div className="border-t border-sidebar-border px-4 py-3.5">
        <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Szybkie pytania
        </h3>
        <ul className="space-y-1.5">
          {EXAMPLE_QUESTIONS.slice(0, 4).map((question) => (
            <li key={question}>
              <button
                type="button"
                onClick={() => onQuickAsk(question)}
                className="truncate text-left text-xs text-muted-foreground transition-colors hover:text-primary"
              >
                {question}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
