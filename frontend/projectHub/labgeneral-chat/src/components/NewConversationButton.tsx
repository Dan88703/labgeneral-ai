import { SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NewConversationButtonProps {
  onClick: () => void;
}

export function NewConversationButton({ onClick }: NewConversationButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="w-full justify-center gap-2 rounded-xl shadow-sm shadow-primary/25"
    >
      <SquarePen className="h-4 w-4" aria-hidden="true" />
      Nowa rozmowa
    </Button>
  );
}
