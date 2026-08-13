import { ExternalLink, FlaskConical, Globe } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { APP_NAME, APP_SUBTITLE, SITE_HOSTNAME, SITE_URL } from "@/lib/constants";

export function AppHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-card/40 px-3 sm:px-5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/30">
        <FlaskConical className="h-5 w-5" aria-hidden="true" />
      </div>

      <div className="min-w-0 leading-tight">
        <div className="truncate text-sm font-semibold text-foreground">{APP_NAME}</div>
        <div className="truncate text-xs text-muted-foreground">/ {APP_SUBTITLE}</div>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <a
          href={SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary sm:flex"
        >
          <Globe className="h-3.5 w-3.5" aria-hidden="true" />
          {SITE_HOSTNAME}
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </a>

        <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-online" aria-hidden="true" />
          Online
        </span>

        <ThemeToggle />
      </div>
    </header>
  );
}
