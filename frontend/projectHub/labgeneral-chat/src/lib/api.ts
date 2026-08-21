import type { ChatMessage, Conversation } from "@/types/chat";
import { ChatError } from "@/types/chat";
import { getSessionId } from "@/lib/session";

// ────────────────────────────────────────────────────────────────────────
// DTO odpowiadające dokładnie strukturze JSON zwracanej przez backend
// (Spring Boot: MessageResponse / ConversationResponse).
// ────────────────────────────────────────────────────────────────────────

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

interface BackendMessageDto {
  id: number;
  content: string;
  role: "USER" | "ASSISTANT";
}

interface BackendConversationDto {
  id: number;
  title: string;
  createdAt: string;
}

function mapMessage(dto: BackendMessageDto): ChatMessage {
  return {
    id: String(dto.id),
    role: dto.role === "USER" ? "user" : "assistant",
    content: dto.content,
    createdAt: Date.now(),
    status: "idle",
  };
}

function mapConversation(dto: BackendConversationDto): Conversation {
  const timestamp = Date.parse(dto.createdAt) || Date.now();
  return {
    id: String(dto.id),
    title: dto.title,
    messages: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

async function handleJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = `Serwer zwrócił błąd (status ${response.status}).`;
    try {
      const body = await response.json();
      if (typeof body?.message === "string") message = body.message;
    } catch {
      // brak treści JSON w odpowiedzi błędu — zostawiamy komunikat domyślny
    }
    throw new ChatError("http", message);
  }
  return response.json() as Promise<T>;
}

function wrapNetworkError(): never {
  throw new ChatError(
      "network",
      "Nie udało się połączyć z serwerem. Sprawdź swoje połączenie internetowe."
  );
}

/** Nagłówki wspólne dla każdego zapytania — identyfikują sesję przeglądarki,
 *  wymagane przez backend do rozdzielenia rozmów różnych użytkowników. */
function sessionHeaders(): HeadersInit {
  return { "X-Session-Id": getSessionId() };
}

export async function fetchConversations(): Promise<Conversation[]> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/conversations`, {
      headers: sessionHeaders(),
    });
  } catch {
    return wrapNetworkError();
  }
  const dtos = await handleJsonResponse<BackendConversationDto[]>(response);
  return dtos.map(mapConversation);
}

export async function fetchMessages(conversationId: string): Promise<ChatMessage[]> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/conversations/${conversationId}/messages`, {
      headers: sessionHeaders(),
    });
  } catch {
    return wrapNetworkError();
  }
  const dtos = await handleJsonResponse<BackendMessageDto[]>(response);
  return dtos.map(mapMessage);
}

export async function createConversation(title: string): Promise<Conversation> {
  let response: Response;
  try {
    response = await fetch(
        `${API_BASE_URL}/api/conversations?title=${encodeURIComponent(title)}`,
        { method: "POST", headers: sessionHeaders() }
    );
  } catch {
    return wrapNetworkError();
  }
  const dto = await handleJsonResponse<BackendConversationDto>(response);
  return mapConversation(dto);
}

export async function deleteConversation(conversationId: string): Promise<void> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/conversations/${conversationId}`, {
      method: "DELETE",
      headers: sessionHeaders(),
    });
  } catch {
    return wrapNetworkError();
  }
  if (!response.ok && response.status !== 204) {
    throw new ChatError("http", `Nie udało się usunąć rozmowy (status ${response.status}).`);
  }
}

/** Wysyła wiadomość użytkownika i zwraca odpowiedź asystenta (backend nie streamuje). */
export async function sendChatMessage(
    conversationId: string,
    content: string
): Promise<ChatMessage> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/conversations/${conversationId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...sessionHeaders() },
      body: JSON.stringify({ content }),
    });
  } catch {
    return wrapNetworkError();
  }
  const dto = await handleJsonResponse<BackendMessageDto>(response);
  return mapMessage(dto);
}