import type { Conversation } from "@/types/chat";
import { LOCAL_STORAGE_KEY } from "@/lib/constants";

/**
 * Kontrakt magazynu rozmów. `localStorage` to tylko jedna z możliwych
 * implementacji — w przyszłości można podmienić `LocalStorageConversationsRepository`
 * na implementację opartą o backend/API, nie zmieniając reszty aplikacji.
 */
export interface ConversationsRepository {
  load(): Conversation[];
  save(conversations: Conversation[]): void;
}

const isBrowser = typeof window !== "undefined" && typeof window.localStorage !== "undefined";

class LocalStorageConversationsRepository implements ConversationsRepository {
  load(): Conversation[] {
    if (!isBrowser) return [];

    try {
      const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!raw) return [];

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];

      return parsed.filter(isValidConversation);
    } catch (error) {
      console.error("Nie udało się odczytać historii rozmów z localStorage:", error);
      return [];
    }
  }

  save(conversations: Conversation[]): void {
    if (!isBrowser) return;

    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(conversations));
    } catch (error) {
      // Najczęstsza przyczyna: przekroczony limit pojemności localStorage.
      console.error("Nie udało się zapisać historii rozmów w localStorage:", error);
    }
  }
}

function isValidConversation(value: unknown): value is Conversation {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<Conversation>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    Array.isArray(candidate.messages) &&
    typeof candidate.createdAt === "number" &&
    typeof candidate.updatedAt === "number"
  );
}

export const conversationsRepository: ConversationsRepository =
  new LocalStorageConversationsRepository();
