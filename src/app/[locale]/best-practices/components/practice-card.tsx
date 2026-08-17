import { cn } from "@/utils/cn";
import { CheckIcon } from "lucide-react";

interface PracticeCardProps {
  index: number;
  title: string;
  items: string[];
  className?: string;
}

export function PracticeCard({
  index,
  title,
  items,
  className,
}: PracticeCardProps) {
  return (
    <div
      className={cn("rounded-lg bg-(image:--border-gradient) p-px", className)}
    >
      <div className="bg-card flex h-full flex-col gap-4 rounded-lg p-6">
        <div className="flex items-baseline gap-3">
          <span
            className="text-muted-foreground font-mono text-xs tabular-nums"
            aria-hidden="true"
          >
            {String(index).padStart(2, "0")}
          </span>
          <h4 className="text-lg font-semibold">{title}</h4>
        </div>

        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li
              key={item}
              className="text-muted-foreground flex items-start gap-2 text-sm leading-relaxed"
            >
              <CheckIcon
                className="text-secondary mt-1 size-3.5 shrink-0"
                aria-hidden="true"
              />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
