"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ComponentProps, useRef, useState } from "react";

import { cn } from "@/utils/cn";

interface CodeBlockProps extends ComponentProps<"pre"> {
  className?: string;
}

export function CodeBlock({ className, children, ...props }: CodeBlockProps) {
  const t = useTranslations();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isCopied, setIsCopied] = useState(false);

  async function handleCopy() {
    const code = wrapperRef.current?.querySelector("pre")?.textContent;

    if (!code) {
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 2000);
    } catch {
      setIsCopied(false);
    }
  }

  return (
    <div ref={wrapperRef} className="group relative">
      <pre
        className={cn(
          "bg-card border-border overflow-x-auto rounded-lg border p-4 text-sm",
          className
        )}
        {...props}
      >
        {children}
      </pre>

      <button
        type="button"
        onClick={handleCopy}
        aria-label={t("blog.article.copyCode")}
        className="text-muted-foreground hover:text-foreground bg-muted absolute top-2 right-2 cursor-pointer rounded-md p-2 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
      >
        {isCopied ? (
          <CheckIcon className="size-4" aria-hidden="true" />
        ) : (
          <CopyIcon className="size-4" aria-hidden="true" />
        )}
      </button>

      <span className="sr-only" aria-live="polite">
        {isCopied ? t("blog.article.copied") : ""}
      </span>
    </div>
  );
}
