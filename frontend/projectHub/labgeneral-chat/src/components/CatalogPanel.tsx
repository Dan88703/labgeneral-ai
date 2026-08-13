import { BookOpen, FlaskConical, Microscope, Package, type LucideIcon } from "lucide-react";
import { CATALOG_CATEGORIES, TOTAL_PRODUCTS_LABEL, type CatalogIcon } from "@/lib/constants";

export const CATEGORY_ICONS: Record<CatalogIcon, LucideIcon> = {
  flask: FlaskConical,
  microscope: Microscope,
  package: Package,
  book: BookOpen,
};

interface CatalogPanelProps {
  onSelectCategory: (question: string) => void;
}

export function CatalogPanel({ onSelectCategory }: CatalogPanelProps) {
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="thin-scrollbar flex-1 overflow-y-auto px-4 py-4">
        <h3 className="mb-3 px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Katalog
        </h3>

        <div className="space-y-1.5">
          {CATALOG_CATEGORIES.map((category) => {
            const Icon = CATEGORY_ICONS[category.icon];
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onSelectCategory(category.question)}
                className="flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-left transition-colors hover:border-border hover:bg-accent"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-primary">{category.count}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {category.label}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-sidebar-border px-5 py-3.5">
        <p className="text-xs text-muted-foreground">Produkty łącznie</p>
        <p className="text-lg font-semibold text-foreground">{TOTAL_PRODUCTS_LABEL}</p>
      </div>
    </div>
  );
}
