import type { MDXComponents } from "mdx/types";

import { Callout } from "@/components/mdx/callout";
import { CodeBlock } from "@/components/mdx/code-block";
import { Figure } from "@/components/mdx/figure";
import { Link } from "@/libs/i18n/navigation";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: (props) => (
      <h2
        className="text-foreground mt-12 mb-4 scroll-mt-24 text-2xl font-bold"
        {...props}
      />
    ),
    h3: (props) => (
      <h3
        className="text-foreground mt-8 mb-3 scroll-mt-24 text-xl font-semibold"
        {...props}
      />
    ),
    p: (props) => (
      <p className="text-muted-foreground my-4 leading-relaxed" {...props} />
    ),
    ul: (props) => (
      <ul className="text-muted-foreground my-4 list-disc pl-6" {...props} />
    ),
    ol: (props) => (
      <ol className="text-muted-foreground my-4 list-decimal pl-6" {...props} />
    ),
    blockquote: (props) => (
      <blockquote
        className="border-l-border text-muted-foreground my-6 border-l-2 pl-4 italic"
        {...props}
      />
    ),
    table: (props) => (
      <div className="my-6 overflow-x-auto">
        <table className="w-full text-sm" {...props} />
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
            className="text-secondary hover:underline"
            {...props}
          >
            {children}
          </Link>
        );
      }

      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-secondary hover:underline"
          {...props}
        >
          {children}
        </a>
      );
    },
    pre: CodeBlock,
    Callout,
    Figure,
    ...components,
  };
}
