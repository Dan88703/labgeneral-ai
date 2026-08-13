import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChatMessage, Conversation } from "@/types/chat";
import * as api from "@/lib/api";

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Przy starcie aplikacji pobieramy listę rozmów bezpośrednio z backendu
  // (localStorage nie jest już źródłem prawdy — historia jest w Postgresie).
  useEffect(() => {
    let cancelled = false;
    api
      .fetchConversations()
      .then((list) => {
        if (!cancelled) setConversations(list);
      })
      .catch((error) => {
        console.error("Nie udało się pobrać listy rozmów:", error);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId]
  );

  const createConversation = useCallback(async (): Promise<string> => {
    const conversation = await api.createConversation("Nowa rozmowa");
    setConversations((prev) => [conversation, ...prev]);
    setActiveId(conversation.id);
    return conversation.id;
  }, []);

  const deleteConversation = useCallback(async (id: string) => {
    await api.deleteConversation(id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
    setActiveId((current) => (current === id ? null : current));
  }, []);

  const selectConversation = useCallback(async (id: string) => {
    setActiveId(id);
    try {
      const messages = await api.fetchMessages(id);
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, messages } : c))
      );
    } catch (error) {
      console.error("Nie udało się pobrać wiadomości rozmowy:", error);
    }
  }, []);

  // UWAGA: backend nie ma endpointu do zmiany tytułu rozmowy — tytuł zmienia
  // się wyłącznie lokalnie w UI i NIE jest zapisywany trwale po odświeżeniu.
  const renameConversation = useCallback((id: string, title: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title } : c))
    );
  }, []);

  const setConversationMessages = useCallback(
    (id: string, updater: (messages: ChatMessage[]) => ChatMessage[]) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, messages: updater(c.messages), updatedAt: Date.now() }
            : c
        )
      );
    },
    []
  );

  return {
    conversations,
    activeId,
    activeConversation,
    isLoading,
    createConversation,
    deleteConversation,
    selectConversation,
    renameConversation,
    setConversationMessages,
  };
}

export type UseConversationsReturn = ReturnType<typeof useConversations>;