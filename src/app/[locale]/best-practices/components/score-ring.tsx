import { cn } from "@/utils/cn";

interface ScoreRingProps {
  score: number;
  label: string;
  delayMs?: number;
  className?: string;
}

export function ScoreRing({
  score,
  label,
  delayMs = 0,
  className,
}: ScoreRingProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div
        className="bp-ring grid size-28 place-items-center rounded-full md:size-32"
        style={{ "--bp-ring-delay": `${delayMs}ms` } as React.CSSProperties}
      >
        <div className="bp-ring-inner grid size-[calc(100%-6px)] place-items-center rounded-full">
          <span className="font-mono text-3xl font-medium tabular-nums md:text-4xl">
            {score}
          </span>
        </div>
      </div>
      <span className="text-muted-foreground text-sm">{label}</span>
    </div>
  );
}
