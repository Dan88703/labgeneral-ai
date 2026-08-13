import { useState } from "react";
import { Clock, MessageSquare, Trash2 } from "lucide-react";
import type { Conversation } from "@/types/chat";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn, formatRelativeTime } from "@/lib/utils";

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export function ConversationItem({
  conversation,
  isActive,
  onSelect,
  onDelete,
}: ConversationItemProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div
      className={cn(
        "group relative flex items-center rounded-xl",
        isActive ? "bg-accent" : "hover:bg-accent/60"
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        title={conversation.title}
        className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl py-2.5 pl-3 pr-10 text-left text-sm"
      >
        <MessageSquare
          className={cn(
            "h-4 w-4 shrink-0",
            isActive ? "text-primary" : "text-muted-foreground"
          )}
          aria-hidden="true"
        />
        <span className="min-w-0 flex-1">
          <span
            className={cn(
              "block truncate font-medium",
              isActive ? "text-foreground" : "text-foreground/85"
            )}
          >
            {conversation.title}
          </span>
          <span className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" aria-hidden="true" />
            {formatRelativeTime(conversation.createdAt)}
          </span>
        </span>
      </button>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Usuń rozmowę „${conversation.title}”`}
            onClick={(event) => event.stopPropagation()}
            className="absolute right-1 h-7 w-7 shrink-0 text-muted-foreground/70 hover:bg-transparent hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usunąć rozmowę?</AlertDialogTitle>
            <AlertDialogDescription>
              Rozmowa „{conversation.title}” zostanie trwale usunięta. Tej operacji nie
              można cofnąć.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={onDelete}>Usuń</AlertDialogAction>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
