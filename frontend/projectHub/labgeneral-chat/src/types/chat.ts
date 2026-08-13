export type MessageRole = "user" | "assistant";

export type MessageStatus =
  | "idle" // wiadomość zakończona / statyczna
  | "streaming" // odpowiedź AI jest w trakcie generowania
  | "error"; // wystąpił błąd przy generowaniu tej wiadomości

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: number; // epoch ms
  status: MessageStatus;
  /** Widoczne wyłącznie dla wiadomości AI zakończonych błędem. */
  errorMessage?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

/** Ciało requestu wysyłanego do POST /api/chat */
export interface ChatRequestBody {
  message: string;
  /**
   * Historia rozmowy — dołączana, aby backend miał kontekst.
   * Format można dopasować do wymagań konkretnego API.
   */
  messages: Array<Pick<ChatMessage, "role" | "content">>;
  conversationId: string;
}

/** Rezultat pojedynczego kroku strumieniowania odpowiedzi. */
export interface StreamChunk {
  /** Fragment tekstu do dopisania do bieżącej wiadomości AI. */
  delta: string;
  /** true, gdy backend zasygnalizował koniec strumienia. */
  done: boolean;
}

export type ChatErrorKind =
  | "network" // brak połączenia z backendem
  | "http" // backend odpowiedział błędem (status >= 400)
  | "empty" // backend zwrócił pustą odpowiedź
  | "aborted" // przerwanie streamingu przez użytkownika lub połączenie
  | "unknown";

export class ChatError extends Error {
  readonly kind: ChatErrorKind;

  constructor(kind: ChatErrorKind, message: string) {
    super(message);
    this.name = "ChatError";
    this.kind = kind;
  }
}
