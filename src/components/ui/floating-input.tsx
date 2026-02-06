import { cn } from "@/utils/cn";
import { useId, useState } from "react";

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

export function FloatingInput({
  label,
  icon,
  id,
  ...props
}: FloatingInputProps) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const isFloating = isFocused || hasValue;

  return (
    <div className="relative">
      {/* Floating Label */}
      <label
        htmlFor={inputId}
        className={cn(
          "pointer-events-none absolute left-11 z-2 transition-all duration-200",
          isFloating
            ? icon
              ? "text-muted-foreground/80 -top-2 left-3 px-1 text-xs"
              : "text-muted-foreground/80 -top-2 px-1 text-xs"
            : "text-muted-foreground/60 top-1/2 -translate-y-1/2 text-sm"
        )}
      >
        {label}
      </label>

      {/* Floating Line */}
      <div
        aria-hidden="true"
        className={cn(
          "bg-muted pointer-events-none absolute z-1 h-1 text-sm text-transparent transition-all duration-200",
          isFloating
            ? icon
              ? "top-0 left-3 px-1 text-xs"
              : "top-0 px-1 text-xs"
            : "top-1/2 left-11 -translate-y-1/2"
        )}
      >
        {label}
      </div>

      <div
        className="rounded-lg p-px"
        style={{ background: "var(--border-gradient)" }}
      >
        <div className="bg-muted flex rounded-lg">
          {icon && (
            <span className="text-muted-foreground shrink-0 py-3 pr-1 pl-3" aria-hidden="true">
              {icon}
            </span>
          )}
          <input
            id={inputId}
            className="text-foreground w-full bg-transparent p-2 text-sm outline-none"
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
