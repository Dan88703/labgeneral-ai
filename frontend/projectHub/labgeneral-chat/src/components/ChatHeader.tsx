import { Clock, MessageSquare } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

interface ChatHeaderProps {
  title: string;
  timestamp: number;
}

export function ChatHeader({ title, timestamp }: ChatHeaderProps) {
  return (
    <div className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-4 sm:px-6">
      <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <h2 className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">{title}</h2>
      <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" aria-hidden="true" />
        {formatRelativeTime(timestamp)}
      </span>
    </div>
  );
}
