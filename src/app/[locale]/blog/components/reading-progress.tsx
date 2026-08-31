"use client";

import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";

interface ReadingProgressProps {
  className?: string;
}

export function ReadingProgress({ className }: ReadingProgressProps = {}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    function update() {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;

      setProgress(scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0);
      frame = 0;
    }

    function onScroll() {
      if (frame === 0) {
        frame = window.requestAnimationFrame(update);
      }
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);

      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "bg-secondary fixed top-16 left-0 z-40 h-0.5 origin-left",
        className
      )}
      style={{ width: `${progress}%` }}
    />
  );
}
