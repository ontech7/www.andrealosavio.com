import type { MDXComponents } from "mdx/types";
import type { ComponentProps } from "react";

import { Callout } from "@/components/mdx/callout";
import { CodeBlock } from "@/components/mdx/code-block";
import { Figure } from "@/components/mdx/figure";
import { VideoFigure } from "@/components/mdx/video-figure";
import { Link } from "@/libs/i18n/navigation";
import { cn } from "@/utils/cn";

type InlineCodeProps = ComponentProps<"code"> & { "data-language"?: string };

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: (props) => (
      <h2
        className="text-foreground mt-14 mb-5 scroll-mt-36 text-2xl leading-snug font-bold tracking-tight md:text-[1.75rem] xl:scroll-mt-24"
        {...props}
      />
    ),
    h3: (props) => (
      <h3
        className="text-foreground mt-10 mb-3 scroll-mt-36 text-xl leading-snug font-semibold tracking-tight md:text-[1.375rem] xl:scroll-mt-24"
        {...props}
      />
    ),
    p: (props) => (
      <p
        className="text-muted-foreground my-6 text-[1.125rem] leading-[1.8] tracking-[0.01em]"
        {...props}
      />
    ),
    ul: (props) => (
      <ul
        className="text-muted-foreground marker:text-secondary/60 my-6 list-disc space-y-3 pl-6 text-[1.125rem] leading-[1.8] tracking-[0.01em]"
        {...props}
      />
    ),
    ol: (props) => (
      <ol
        className="text-muted-foreground marker:text-secondary/60 my-6 list-decimal space-y-3 pl-6 text-[1.125rem] leading-[1.8] tracking-[0.01em]"
        {...props}
      />
    ),
    strong: (props) => (
      <strong className="text-foreground font-semibold" {...props} />
    ),
    em: (props) => <em className="text-foreground/90 italic" {...props} />,
    code: ({ className, ...props }: InlineCodeProps) => {
      if (props["data-language"]) {
        return <code className={className} {...props} />;
      }

      return (
        <code
          className={cn(
            "bg-muted/70 border-border/60 text-foreground rounded-md border px-[0.32em] py-[0.1em] font-mono text-[0.85em] tracking-normal",
            className
          )}
          {...props}
        />
      );
    },
    blockquote: (props) => (
      <blockquote
        className="border-l-secondary/50 text-muted-foreground my-8 border-l-2 pl-5 text-[1.125rem] leading-[1.8] italic"
        {...props}
      />
    ),
    table: (props) => (
      <div className="my-8 overflow-x-auto">
        <table className="w-full text-base" {...props} />
      </div>
    ),
    th: (props) => (
      <th
        className="border-border border-b px-3 py-2 text-left font-semibold"
        {...props}
      />
    ),
    td: (props) => (
      <td
        className="border-border text-muted-foreground border-b px-3 py-2"
        {...props}
      />
    ),
    a: ({ href = "", children, ...props }) => {
      if (href.startsWith("/")) {
        return (
          <Link
            href={href}
            className="text-secondary decoration-secondary/40 underline underline-offset-4 transition-colors hover:decoration-current"
            {...props}
          >
            {children}
          </Link>
        );
      }

      if (href.startsWith("#")) {
        return (
          <a
            href={href}
            className="text-secondary decoration-secondary/40 underline underline-offset-4 transition-colors hover:decoration-current"
            {...props}
          >
            {children}
          </a>
        );
      }

      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-secondary decoration-secondary/40 underline underline-offset-4 transition-colors hover:decoration-current"
          {...props}
        >
          {children}
        </a>
      );
    },
    pre: CodeBlock,
    Callout,
    Figure,
    VideoFigure,
    ...components,
  };
}
