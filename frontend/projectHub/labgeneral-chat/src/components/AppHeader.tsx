import { ExternalLink, Globe } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { APP_NAME, APP_SUBTITLE, SITE_HOSTNAME, SITE_URL } from "@/lib/constants";

export function AppHeader() {
    return (
        <header
            className="flex h-14 shrink-0 items-center gap-3 px-3 sm:px-5 text-white"
            style={{ background: "var(--primary-gradient)" }}
        >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                <img
                    src="/labgeneral-logo-white.svg"
                    alt="LABGeneral"
                    className="h-5 w-5"
                />
            </div>

            <div className="min-w-0 leading-tight">
                <div className="truncate text-sm font-semibold">
                    {APP_NAME}
                </div>

                <div className="truncate text-xs text-white/70">
                    / {APP_SUBTITLE}
                </div>
            </div>

            <div className="ml-auto flex items-center gap-4">
                <a
                    href={SITE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden items-center gap-1.5 text-xs text-white/70 transition-colors hover:text-white sm:flex"
                >
                    <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                    {SITE_HOSTNAME}
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>

                <ThemeToggle />
            </div>
        </header>
    );
}