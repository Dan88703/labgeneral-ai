export function LoadingIndicator() {
  return (
    <div className="flex items-center gap-2 py-1 text-sm text-muted-foreground" role="status">
      <span className="flex items-center gap-1">
        <span className="h-1.5 w-1.5 animate-blink rounded-full bg-primary [animation-delay:0ms]" />
        <span className="h-1.5 w-1.5 animate-blink rounded-full bg-primary [animation-delay:200ms]" />
        <span className="h-1.5 w-1.5 animate-blink rounded-full bg-primary [animation-delay:400ms]" />
      </span>
      <span>AI pisze…</span>
    </div>
  );
}
