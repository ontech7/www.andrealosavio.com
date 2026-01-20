import { cn } from "@/utils/cn";
import { useId, useState } from "react";

interface FloatingTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function FloatingTextarea({
  label,
  id,
  ...props
}: FloatingTextareaProps) {
  const generatedId = useId();
  const textareaId = id || generatedId;
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const isFloating = isFocused || hasValue;

  return (
    <div className="relative">
      {/* Floating Label */}
      <label
        htmlFor={textareaId}
        className={cn(
          "pointer-events-none absolute left-3 z-2 transition-all duration-200",
          isFloating
            ? "text-muted-foreground/80 -top-2 px-1 text-xs"
            : "text-muted-foreground/60 top-3 text-sm"
        )}
      >
        {label}
      </label>

      {/* Floating Line */}
      <div
        className={cn(
          "bg-muted pointer-events-none absolute z-1 h-1 text-sm text-transparent transition-all duration-200",
          isFloating
            ? "top-0 left-3 px-1 text-xs"
            : "top-1/2 left-10 -translate-y-1/2"
        )}
      >
        {label}
      </div>

      <div
        className="rounded-lg p-px"
        style={{ background: "var(--border-gradient)" }}
      >
        <div className="bg-muted rounded-lg">
          <textarea
            id={textareaId}
            className="text-foreground w-full resize-none border-none p-3 text-sm outline-none"
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
              setIsFocused(false);
              setHasValue(e.target.value.length > 0);
            }}
            onChange={(e) => setHasValue(e.target.value.length > 0)}
            {...props}
          />
        </div>
      </div>
    </div>
  );
}
