import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { useToast } from "@/components/ToastProvider";

interface CopyButtonProps {
  text: string;
}

export function CopyButton({ text }: CopyButtonProps) {
  const { isCopied, copy } = useCopyToClipboard();
  const { showToast } = useToast();

  const handleCopy = async () => {
    const success = await copy(text);
    if (success) showToast("Skopiowano do schowka");
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          aria-label="Kopiuj odpowiedź"
          className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          {isCopied ? (
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {isCopied ? "Skopiowano" : "Kopiuj"}
        </Button>
      </TooltipTrigger>
      <TooltipContent>Kopiuj pełną odpowiedź</TooltipContent>
    </Tooltip>
  );
}
