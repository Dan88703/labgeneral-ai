# LABGeneral Asystent — frontend

Frontend czatu AI dla projektu **LABGeneral.pl**: React + Vite + TypeScript +
Tailwind CSS + shadcn/ui (Radix). Podłączony pod endpoint `POST /api/chat`,
z obsługą streamingu odpowiedzi, historią rozmów w `localStorage`,
trybem jasnym/ciemnym i pełną responsywnością.

## Uruchomienie

Wymagany Node.js 18+.

```bash
npm install
npm run dev
```

Aplikacja wystartuje pod `http://localhost:5173`.

Inne przydatne komendy:

```bash
npm run build      # build produkcyjny (uruchamia też sprawdzenie typów)
npm run typecheck  # tylko sprawdzenie typów TypeScript
npm run lint        # ESLint
npm run preview    # podgląd builda produkcyjnego
```

> **Uwaga:** ten projekt został przygotowany w środowisku bez dostępu do
> internetu, więc `npm install` nie zostało tu uruchomione — zależności w
> `package.json` nie zostały fizycznie pobrane ani zweryfikowane instalacją.
> Uruchom `npm install` lokalnie jako pierwszy krok; jeśli którakolwiek
> wersja pakietu okaże się niedostępna, `npm install` sam zaproponuje
> najbliższą kompatybilną.

## Podłączenie do backendu

Frontend wysyła żądania na **`/api/chat`** (ścieżka względna). W trybie
`npm run dev` backend zwykle działa pod innym portem — dodaj proxy w
`vite.config.ts` (miejsce już oznaczone komentarzem w pliku):

```ts
server: {
  proxy: {
    "/api": { target: "http://localhost:3000", changeOrigin: true },
  },
},
```

Wysyłany request:

```json
{
  "message": "treść wiadomości",
  "messages": [{ "role": "user", "content": "..." }],
  "conversationId": "..."
}
```

### Format streamingu

Backend powinien zwracać odpowiedź jako `ReadableStream`. Domyślnie frontend
zakłada surowy strumień tekstu (każdy odebrany fragment = fragment
odpowiedzi). Jeśli backend zwraca **SSE** (`text/event-stream`) lub
**NDJSON**, zmień jedną stałą w `src/lib/api.ts`:

```ts
// src/lib/api.ts
const STREAM_FORMAT: StreamFormat = "raw-text"; // "raw-text" | "sse" | "ndjson"
```

Parsery dla wszystkich trzech formatów są już zaimplementowane w tym samym
pliku (`extractRawText`, `extractSSE`, `extractNDJSON`) — wystarczy przełączyć
stałą, bez zmian w resztcie aplikacji.

## Struktura projektu

```
src/
├── components/       # komponenty UI aplikacji
│   ├── AppHeader.tsx        # górny pasek: marka, link do labgeneral.pl, status, motyw
│   ├── MobileTabBar.tsx     # zakładki Historia/Czat/Kategorie (mobile)
│   ├── ConversationsPanel.tsx  # historia rozmów + szybkie pytania (lewa kolumna / zakładka)
│   ├── CatalogPanel.tsx     # katalog kategorii produktów (prawa kolumna / zakładka)
│   ├── ChatWindow.tsx, Message.tsx, ChatInput.tsx, ...
│   └── ui/            # prymitywy shadcn/ui (Button, Textarea, Avatar, Tooltip, AlertDialog)
├── hooks/             # useChat, useConversations, useTheme, ...
├── lib/               # api.ts (komunikacja z backendem), storage.ts (localStorage), utils.ts
├── types/             # wspólne typy (ChatMessage, Conversation, ...)
├── App.tsx
├── main.tsx
└── index.css
```

**Układ:** na desktopie (`lg:` i szerzej) widoczne są trzy kolumny naraz —
historia rozmów, czat, katalog kategorii. Poniżej tego progu interfejs
przełącza się na trzy zakładki (Historia / Czat / Kategorie) sterowane
stanem `mobileTab` w `App.tsx`, zamiast wysuwanego szuflady (drawer).

- **`src/lib/storage.ts`** — dostęp do historii rozmów jest ukryty za
  interfejsem `ConversationsRepository`. Docelowo `localStorage` można
  zastąpić implementacją opartą o backend, nie zmieniając reszty aplikacji.
- **`src/hooks/useChat.ts`** — cała logika wysyłania wiadomości, streamingu,
  ponawiania po błędzie i zarządzania aktywną rozmową.
- **`src/lib/api.ts`** — cała komunikacja sieciowa z `/api/chat`.
- **`src/lib/constants.ts`** — dane katalogu kategorii (`CATALOG_CATEGORIES`)
  i przykładowe pytania są tu zdefiniowane statycznie (jak w referencyjnym
  projekcie) — podmień je na dane z realnego API, gdy będzie dostępne.

## Czego brakuje celowo

Zgodnie ze specyfikacją frontend **nie zawiera żadnego mockowanego
backendu** — jeśli `/api/chat` nie odpowiada, w interfejsie pojawi się
czytelny komunikat o błędzie połączenia (z możliwością ponowienia), a nie
podszywana odpowiedź AI.
