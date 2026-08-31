"use client";

import { useEffect, useState } from "react";
import type { TocEntry } from "@/libs/blog/toc";

export function useActiveHeading(
  entries: readonly TocEntry[],
  topOffset: number
): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (entries.length < 2) {
      return;
    }

    const headings = entries
      .map((entry) => document.getElementById(entry.id))
      .filter((element): element is HTMLElement => element !== null);

    if (headings.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (observed) => {
        const visible = observed
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: `-${topOffset}px 0px -60% 0px`, threshold: 0 }
    );

    for (const heading of headings) {
      observer.observe(heading);
    }

    return () => observer.disconnect();
  }, [entries, topOffset]);

  return activeId;
}
