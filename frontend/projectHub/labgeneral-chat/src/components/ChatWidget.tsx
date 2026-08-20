import { useState } from "react";
import { MessageCircle, X, History, Plus } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { Message } from "@/components/Message";
import { ConversationItem } from "@/components/ConversationItem";
import { WidgetChatInput } from "@/components/WidgetChatInput";

type View = "chat" | "history";

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<View>("chat");

    const {
        conversations,
        activeConversation,
        sendMessage,
        retryMessage,
        isStreaming,
        startNewConversation,
        selectConversation,
        removeConversation,
    } = useChat();

    function openWidget() {
        if (!activeConversation) startNewConversation();
        setIsOpen(true);
    }

    function pickConversation(id: string) {
        selectConversation(id);
        setView("chat");
    }

    function newConversation() {
        startNewConversation();
        setView("chat");
    }

    return (
        <div className="fixed bottom-5 right-5 z-[999999] font-sans">
            {isOpen && (
                <div className="mb-3 w-[380px] max-w-[calc(100vw-2.5rem)] h-[560px] max-h-[calc(100vh-6rem)] bg-white border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up">
                    {/* Nagłówek — tylko 3 przyciski: historia, nowa rozmowa, zamknij */}
                    <div
                        className="flex items-center justify-between px-4 py-3 text-white shrink-0"
                        style={{ background: "var(--primary-gradient)" }}
                    >
                        <button
                            onClick={() => setView(view === "chat" ? "history" : "chat")}
                            className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                            aria-label={view === "chat" ? "Pokaż historię" : "Wróć do czatu"}
                        >
                            <History size={18} />
                        </button>

                        <span className="font-semibold text-sm">Asystent LABGeneral</span>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={newConversation}
                                className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                                aria-label="Nowa rozmowa"
                            >
                                <Plus size={18} />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                                aria-label="Zamknij czat"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {view === "chat" ? (
                        <>
                            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 bg-white">
                                {!activeConversation || activeConversation.messages.length === 0 ? (
                                    <div className="text-sm text-muted-foreground text-center mt-8">
                                        Cześć! Zapytaj mnie o program LABGeneral 👋
                                    </div>
                                ) : (
                                    activeConversation.messages.map((m) => (
                                        <Message key={m.id} message={m} onRetry={retryMessage} />
                                    ))
                                )}
                            </div>

                            <div className="border-t border-border p-3 bg-white shrink-0">
                                <WidgetChatInput onSend={sendMessage} isStreaming={isStreaming} />
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 overflow-y-auto bg-white p-2">
                            {conversations.length === 0 ? (
                                <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                                    Brak wcześniejszych rozmów.
                                </p>
                            ) : (
                                conversations.map((c) => (
                                    <ConversationItem
                                        key={c.id}
                                        conversation={c}
                                        isActive={c.id === activeConversation?.id}
                                        onSelect={() => pickConversation(c.id)}
                                        onDelete={() => removeConversation(c.id)}
                                    />
                                ))
                            )}
                        </div>
                    )}
                </div>
            )}

            <button
                onClick={() => (isOpen ? setIsOpen(false) : openWidget())}
                className="w-14 h-14 rounded-full shadow-xl flex items-center justify-center hover:scale-105 transition-transform"
                style={{ background: "var(--color-yellow)", color: "var(--color-text)" }}
                aria-label="Otwórz czat"
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </button>
        </div>
    );
}