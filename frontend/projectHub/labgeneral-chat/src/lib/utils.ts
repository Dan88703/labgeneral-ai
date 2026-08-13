import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Łączy klasy Tailwind, poprawnie rozwiązując konflikty (np. p-2 vs p-4). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Generuje identyfikator wystarczająco unikalny na potrzeby danych lokalnych. */
export function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Formatuje znacznik czasu do czytelnej godziny, np. "14:32". */
export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Formatuje znacznik czasu jako względny czas, np. "2 dni temu", "przed chwilą". */
export function formatRelativeTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const diffMinutes = Math.round(diffMs / 60_000);

  if (diffMinutes < 1) return "przed chwilą";
  if (diffMinutes < 60) return `${diffMinutes} min temu`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} godz. temu`;

  const diffDays = Math.round(diffHours / 24);
  if (diffDays === 1) return "1 dzień temu";
  if (diffDays < 30) return `${diffDays} dni temu`;

  return new Date(timestamp).toLocaleDateString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/** Tworzy tytuł rozmowy na podstawie pierwszej wiadomości użytkownika. */
export function deriveConversationTitle(message: string, maxLength = 48): string {
  const normalized = message.trim().replace(/\s+/g, " ");
  if (normalized.length <= maxLength) return normalized || "Nowa rozmowa";
  return `${normalized.slice(0, maxLength).trimEnd()}…`;
}
