import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={isDark ? "Przełącz na jasny motyw" : "Przełącz na ciemny motyw"}
          className="text-muted-foreground hover:text-foreground"
        >
          {isDark ? (
            <Sun className="h-[18px] w-[18px]" aria-hidden="true" />
          ) : (
            <Moon className="h-[18px] w-[18px]" aria-hidden="true" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{isDark ? "Jasny motyw" : "Ciemny motyw"}</TooltipContent>
    </Tooltip>
  );
}
