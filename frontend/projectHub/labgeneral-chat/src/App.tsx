import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { ConversationsPanel } from "@/components/ConversationsPanel";
import { CatalogPanel } from "@/components/CatalogPanel";
import { ChatWindow } from "@/components/ChatWindow";
import { MobileTabBar, type MobileTab } from "@/components/MobileTabBar";
import { ToastProvider } from "@/components/ToastProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useChat } from "@/hooks/useChat";
import { cn } from "@/lib/utils";

export default function App() {
  const {
    conversations,
    activeConversation,
    isStreaming,
    sendMessage,
    retryMessage,
    startNewConversation,
    selectConversation,
    removeConversation,
  } = useChat();

  const [mobileTab, setMobileTab] = useState<MobileTab>("chat");

  const handleSelectConversation = (id: string) => {
    selectConversation(id);
    setMobileTab("chat");
  };

  const handleNewConversation = () => {
    startNewConversation();
    setMobileTab("chat");
  };

  /** Wysyła wiadomość (np. z przykładowego pytania lub kategorii) i przełącza na zakładkę czatu na mobile. */
  const handleSend = (text: string) => {
    sendMessage(text);
    setMobileTab("chat");
  };

  return (
    <TooltipProvider delayDuration={300}>
      <ToastProvider>
        <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-background text-foreground">
          <AppHeader />
          <MobileTabBar active={mobileTab} onChange={setMobileTab} />

          <div className="flex min-h-0 flex-1">
            <div
              className={cn(
                "w-full lg:w-72 lg:shrink-0 lg:border-r lg:border-border",
                mobileTab === "history" ? "block" : "hidden",
                "lg:block"
              )}
            >
              <ConversationsPanel
                conversations={conversations}
                activeId={activeConversation?.id ?? null}
                onSelect={handleSelectConversation}
                onDelete={removeConversation}
                onNewConversation={handleNewConversation}
                onQuickAsk={handleSend}
              />
            </div>

            <div
              className={cn(
                "min-w-0 flex-1",
                mobileTab === "chat" ? "flex flex-col" : "hidden",
                "lg:flex lg:flex-col"
              )}
            >
              <ChatWindow
                conversation={activeConversation}
                isStreaming={isStreaming}
                onSend={handleSend}
                onRetry={retryMessage}
                onStartNew={handleNewConversation}
              />
            </div>

            <div
              className={cn(
                "w-full lg:w-72 lg:shrink-0 lg:border-l lg:border-border",
                mobileTab === "categories" ? "block" : "hidden",
                "lg:block"
              )}
            >
              <CatalogPanel onSelectCategory={handleSend} />
            </div>
          </div>
        </div>
      </ToastProvider>
    </TooltipProvider>
  );
}
