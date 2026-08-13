import { CATALOG_CATEGORIES } from "@/lib/constants";
import { CATEGORY_ICONS } from "@/components/CatalogPanel";

interface CategoryChipsProps {
  onSelect: (question: string) => void;
}

export function CategoryChips({ onSelect }: CategoryChipsProps) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-wrap gap-2 px-1 pb-2.5">
      {CATALOG_CATEGORIES.map((category) => {
        const Icon = CATEGORY_ICONS[category.icon];
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category.question)}
            className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <Icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
