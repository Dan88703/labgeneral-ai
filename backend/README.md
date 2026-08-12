# LABgeneral AI — Backend

Asystent AI odpowiadający na pytania wyłącznie na podstawie treści strony [labgeneral.pl](https://labgeneral.pl).

## Stack technologiczny

- **Backend:** Spring Boot 3.5.5 (Java 21)
- **Baza danych:** PostgreSQL (Docker)
- **AI:** Groq API (kompatybilne z formatem OpenAI, model `llama-3.3-70b-versatile`)
- **Frontend:** React + Vite (osobne repo/folder)

## Jak uruchomić backend lokalnie

### 1. Uruchom bazę danych

```bash
docker-compose up -d
```

Sprawdź, czy kontener działa:
```bash
docker ps
```
Powinieneś zobaczyć `labgeneral-postgres` ze statusem `Up`.

### 2. Ustaw zmienną środowiskową z kluczem API

Backend korzysta z Groq (darmowy, kompatybilny z OpenAI API). Klucz dostajesz na [console.groq.com](https://console.groq.com) — rejestracja przez Google, bez karty płatniczej.

**Windows (PowerShell), na stałe:**
```powershell
setx GROQ_API_KEY "twój_klucz"
```
Uwaga: `setx` działa dopiero w **nowej** sesji terminala — zamknij i otwórz PowerShell ponownie po ustawieniu.

**Windows (PowerShell), tymczasowo w bieżącej sesji:**
```powershell
$env:GROQ_API_KEY = "twój_klucz"
```

### 3. Uruchom backend

```bash
cd backend
mvn spring-boot:run
```

Backend wystartuje na porcie **8081**.

### 4. Sprawdź, czy działa

```bash
curl http://localhost:8081/api/health
```

---

## Endpointy API (dla Frontend Developera)

Base URL lokalnie: `http://localhost:8081`

### Utwórz rozmowę
```
POST /api/conversations?title=Nazwa
```
Odpowiedź:
```json
{ "id": 1, "title": "Nazwa", "createdAt": "...", "messages": [] }
```

### Wyślij wiadomość (i dostań odpowiedź AI)
```
POST /api/conversations/{id}/messages
Content-Type: application/json

{ "content": "Dla kogo jest program LABGeneral?" }
```
Odpowiedź — **to jest wiadomość ASYSTENTA**, nie echo tego, co wysłał użytkownik:
```json
{ "id": 5, "content": "Program jest skierowany do...", "role": "ASSISTANT" }
```
Wiadomość użytkownika jest zapisywana automatycznie po stronie backendu — frontend wysyła tylko `content`, bez `role`.

### Pobierz historię wiadomości danej rozmowy
```
GET /api/conversations/{id}/messages
```
Odpowiedź:
```json
[
  { "id": 4, "content": "Dla kogo jest program?", "role": "USER" },
  { "id": 5, "content": "Program jest skierowany do...", "role": "ASSISTANT" }
]
```

### Lista wszystkich rozmów
```
GET /api/conversations
```
Odpowiedź:
```json
[{ "id": 1, "title": "Nazwa", "createdAt": "..." }, ...]
```

### Usuń rozmowę
```
DELETE /api/conversations/{id}
```

### Health check
```
GET /api/health
```

---

## CORS

Backend akceptuje żądania z `http://localhost:5173` (domyślny port Vite). Jeśli Twój frontend działa na innym porcie, daj znać — trzeba będzie to zaktualizować w `@CrossOrigin`.

## Obsługa błędów

Backend zwraca błędy w formacie:
```json
{ "error": "NOT_FOUND", "message": "Conversation not found" }
```
lub
```json
{ "error": "AI_UNAVAILABLE", "message": "..." }
```
z odpowiednim kodem HTTP (404, 502 itd.) — warto to obsłużyć w UI (np. komunikat „Coś poszło nie tak, spróbuj ponownie”).

---

## Struktura zespołu

| Rola | Osoba | Zakres |
|---|---|---|
| Team Lead / Backend | Ty | Spring Boot, baza danych, integracja z AI |
| AI Engineer | — | Baza wiedzy, scraping, embeddingi, RAG (patrz niżej) |
| Frontend Developer | — | React + Vite, UI czatu |
| QA / UX | — | Testy, scenariusze pytań |

## Integracja z RAG (dla AI Engineera)

Obecnie `OpenAiService` wysyła pytanie użytkownika bezpośrednio do modelu z całą historią rozmowy, bez wyszukiwania w bazie wiedzy. Docelowo AI Engineer dostarczy serwis wyszukujący pasujące fragmenty strony, np.:

```java
List<String> retrieveRelevantChunks(String userQuestion, int topK);
```

Ten serwis zostanie podłączony w `MessageService.create()`, przed wywołaniem `openAiService.askGpt(...)` — wynik retrievalu trafi jako dodatkowy kontekst w system prompcie.

---

## Znane pułapki (żeby nie tracić czasu jak ja 😅)

- `setx` w Windows ustawia zmienną **na stałe**, ale tylko dla **nowych** okien terminala — stare okna nadal mają starą wartość, dopóki ich nie zamkniesz.
- `$env:` w PowerShell nadpisuje zmienną tylko w **bieżącej** sesji terminala.
- Jeśli backend rzuca błąd połączenia z bazą — sprawdź, czy kontener Docker (`docker ps`) w ogóle działa.
- Jeśli backend rzuca `401 Invalid API Key` od Groq — sprawdź dokładnie, czy zmienna środowiskowa faktycznie zawiera klucz Groq (`gsk_...`), a nie stary klucz OpenAI (`sk-...`).
