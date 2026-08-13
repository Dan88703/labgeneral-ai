import { cn } from "@/lib/utils";

export type MobileTab = "history" | "chat" | "categories";

interface MobileTabBarProps {
  active: MobileTab;
  onChange: (tab: MobileTab) => void;
}

const TABS: Array<{ id: MobileTab; label: string }> = [
  { id: "history", label: "Historia" },
  { id: "chat", label: "Czat" },
  { id: "categories", label: "Kategorie" },
];

export function MobileTabBar({ active, onChange }: MobileTabBarProps) {
  return (
    <div
      role="tablist"
      aria-label="Nawigacja główna"
      className="flex shrink-0 border-b border-border bg-card/30 lg:hidden"
    >
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex-1 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
