import { FlaskConical, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_DESCRIPTION, APP_NAME, EXAMPLE_QUESTIONS } from "@/lib/constants";

interface EmptyStateProps {
  onExampleClick: (question: string) => void;
  onStartNew: () => void;
}

export function EmptyState({ onExampleClick, onStartNew }: EmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center overflow-y-auto px-4 py-10">
      <div className="mx-auto flex w-full max-w-xl flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
          <FlaskConical className="h-8 w-8" aria-hidden="true" />
        </div>

        <h1 className="mt-5 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {APP_NAME}
        </h1>

        <p className="balance mt-3 max-w-md text-sm leading-6 text-muted-foreground sm:text-[0.95rem]">
          {APP_DESCRIPTION}
        </p>

        <Button
          onClick={onStartNew}
          size="lg"
          className="mt-6 gap-2 rounded-xl px-6 shadow-sm shadow-primary/25"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Rozpocznij nową rozmowę
        </Button>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {EXAMPLE_QUESTIONS.map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => onExampleClick(question)}
              className="rounded-full border border-border bg-card px-3.5 py-2 text-xs text-foreground/90 transition-colors hover:border-primary/40 hover:bg-accent sm:text-sm"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
