import { useCallback, useState } from "react";
import type { ChatMessage } from "@/types/chat";
import { ChatError } from "@/types/chat";
import { sendChatMessage } from "@/lib/api";
import { generateId } from "@/lib/utils";
import { useConversations } from "@/hooks/useConversations";

export function useChat() {
  const {
    conversations,
    activeId,
    activeConversation,
    createConversation,
    deleteConversation,
    selectConversation: selectConversationBase,
    renameConversation,
    setConversationMessages,
  } = useConversations();

  const [isSending, setIsSending] = useState(false);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isSending) return;

      let conversationId = activeId;
      const isFirstMessage =
        !conversationId ||
        (conversations.find((c) => c.id === conversationId)?.messages.length ?? 0) === 0;

      if (!conversationId) {
        try {
          conversationId = await createConversation();
        } catch (error) {
          console.error("Nie udało się utworzyć rozmowy:", error);
          return;
        }
      }

      const userMessage: ChatMessage = {
        id: generateId(),
        role: "user",
        content: trimmed,
        createdAt: Date.now(),
        status: "idle",
      };
      const aiMessageId = generateId();
      const aiMessage: ChatMessage = {
        id: aiMessageId,
        role: "assistant",
        content: "",
        createdAt: Date.now(),
        status: "streaming", // status wykorzystywany jako "oczekiwanie na odpowiedź"
      };

      setConversationMessages(conversationId, (msgs) => [...msgs, userMessage, aiMessage]);

      if (isFirstMessage) {
        renameConversation(conversationId, trimmed.slice(0, 40));
      }

      setIsSending(true);
      try {
        const assistantReply = await sendChatMessage(conversationId, trimmed);
        setConversationMessages(conversationId, (msgs) =>
          msgs.map((m) =>
            m.id === aiMessageId
              ? { ...m, content: assistantReply.content, status: "idle" }
              : m
          )
        );
      } catch (error) {
        const chatError =
          error instanceof ChatError
            ? error
            : new ChatError("unknown", "Wystąpił nieoczekiwany błąd. Spróbuj ponownie.");
        setConversationMessages(conversationId, (msgs) =>
          msgs.map((m) =>
            m.id === aiMessageId
              ? { ...m, status: "error", errorMessage: chatError.message }
              : m
          )
        );
      } finally {
        setIsSending(false);
      }
    },
    [activeId, conversations, createConversation, isSending, renameConversation, setConversationMessages]
  );

  const retryMessage = useCallback(
    async (aiMessageId: string) => {
      if (!activeConversation || isSending) return;

      const { messages, id: conversationId } = activeConversation;
      const aiIndex = messages.findIndex((m) => m.id === aiMessageId);
      if (aiIndex <= 0) return;

      const userMessage = messages[aiIndex - 1];
      if (userMessage.role !== "user") return;

      setConversationMessages(conversationId, (msgs) =>
        msgs.map((m) =>
          m.id === aiMessageId
            ? { ...m, content: "", status: "streaming", errorMessage: undefined }
            : m
        )
      );

      setIsSending(true);
      try {
        const assistantReply = await sendChatMessage(conversationId, userMessage.content);
        setConversationMessages(conversationId, (msgs) =>
          msgs.map((m) =>
            m.id === aiMessageId
              ? { ...m, content: assistantReply.content, status: "idle" }
              : m
          )
        );
      } catch (error) {
        const chatError =
          error instanceof ChatError
            ? error
            : new ChatError("unknown", "Wystąpił nieoczekiwany błąd. Spróbuj ponownie.");
        setConversationMessages(conversationId, (msgs) =>
          msgs.map((m) =>
            m.id === aiMessageId
              ? { ...m, status: "error", errorMessage: chatError.message }
              : m
          )
        );
      } finally {
        setIsSending(false);
      }
    },
    [activeConversation, isSending, setConversationMessages]
  );

  const startNewConversation = useCallback(async () => {
    await createConversation();
  }, [createConversation]);

  const selectConversation = useCallback(
    (id: string) => {
      if (id === activeId) return;
      void selectConversationBase(id);
    },
    [activeId, selectConversationBase]
  );

  const removeConversation = useCallback(
    (id: string) => {
      void deleteConversation(id);
    },
    [deleteConversation]
  );

  return {
    conversations,
    activeConversation,
    isStreaming: isSending, // nazwa zachowana celowo — reszta UI już się do niej odwołuje
    sendMessage,
    retryMessage,
    startNewConversation,
    selectConversation,
    removeConversation,
  };
}

export type UseChatReturn = ReturnType<typeof useChat>;