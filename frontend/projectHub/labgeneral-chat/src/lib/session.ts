const SESSION_STORAGE_KEY = "labgeneral.sessionId";

/** Zwraca stały identyfikator sesji przeglądarki — generowany raz
 *  i zapisywany w localStorage, żeby rozmowy użytkownika przetrwały
 *  odświeżenie strony, ale nie były widoczne dla innych odwiedzających. */
export function getSessionId(): string {
    let sessionId = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    }
    return sessionId;
}