"use client";

import {
  ArrowRightIcon,
  ArrowUpIcon,
  CompassIcon,
  XIcon,
  ZapIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Link } from "@/libs/i18n/navigation";
import { cn } from "@/utils/cn";

interface ArticleQuickActionsProps {
  nextSlug?: string;
  className?: string;
}

function scrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}

const ringClassName =
  "rounded-full p-px shadow-[0_8px_24px_-6px_rgba(0,0,0,0.7)]";

const actionClassName =
  "bg-card text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors outline-none focus-visible:ring-[3px]";

export function ArticleQuickActions({
  nextSlug,
  className,
}: ArticleQuickActionsProps) {
  const t = useTranslations();
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    let frame = 0;

    function update() {
      const reached = window.scrollY > window.innerHeight * 0.6;

      setIsVisible(reached);

      if (!reached) {
        setIsOpen(false);
      }

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

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [isOpen]);

  const onBlur = useCallback((event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsOpen(false);
    }
  }, []);

  const close = () => setIsOpen(false);

  const openOnHover = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") {
      setIsOpen(true);
    }
  };

  const closeOnHover = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") {
      setIsOpen(false);
    }
  };

  const items = [
    {
      key: "top",
      label: t("blog.article.quickActions.top"),
      icon: <ArrowUpIcon className="size-5" aria-hidden="true" />,
      onClick: () => {
        window.scrollTo({ top: 0, behavior: scrollBehavior() });
        close();
      },
    },
    {
      key: "takeaways",
      label: t("blog.article.quickActions.takeaways"),
      icon: <ZapIcon className="size-5" aria-hidden="true" />,
      onClick: () => {
        document
          .getElementById("tldr")
          ?.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
        close();
      },
    },
    ...(nextSlug
      ? [
          {
            key: "next",
            label: t("blog.article.quickActions.next"),
            icon: <ArrowRightIcon className="size-5" aria-hidden="true" />,
            href: `/blog/${nextSlug}`,
          },
        ]
      : []),
  ];

  return (
    <>
      <div
        aria-hidden="true"
        className={cn(
          "from-background via-background/80 to-background/0 pointer-events-none fixed inset-x-0 bottom-0 z-30 bg-linear-to-t transition-[height,opacity] duration-300 motion-reduce:transition-none 2xl:hidden",
          isOpen ? "h-80" : "h-32",
          isVisible ? "opacity-100" : "opacity-0"
        )}
      />

      <div
        ref={containerRef}
        inert={!isVisible}
        onPointerEnter={openOnHover}
        onPointerLeave={closeOnHover}
        onFocus={() => setIsOpen(true)}
        onBlur={onBlur}
        className={cn(
          "fixed right-4 bottom-4 z-40 flex flex-col-reverse items-end gap-2 transition-[opacity,translate] duration-300 motion-reduce:transition-none md:right-6 md:bottom-6",
          isVisible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0",
          className
        )}
      >
        <span
          className={ringClassName}
          style={{ background: "var(--border-gradient)" }}
        >
          <button
            type="button"
            onClick={() => setIsOpen((previous) => !previous)}
            aria-expanded={isOpen}
            aria-controls={listId}
            aria-label={t("blog.article.quickActions.label")}
            className={cn(actionClassName, "size-12")}
          >
            {isOpen ? (
              <XIcon
                className="animate-in fade-in zoom-in-50 size-5 duration-200"
                aria-hidden="true"
              />
            ) : (
              <CompassIcon
                className="animate-in fade-in zoom-in-50 size-5 duration-200"
                aria-hidden="true"
              />
            )}
          </button>
        </span>

        <ul
          id={listId}
          hidden={!isOpen}
          className="m-0 flex list-none flex-col items-end gap-2 p-0"
        >
          {items.map((item, index) => (
            <li
              key={item.key}
              className={cn(
                "animate-in fade-in slide-in-from-bottom-2 fill-mode-backwards flex items-center gap-3 duration-200",
                index === 1 && "delay-75",
                index === 2 && "delay-150"
              )}
            >
              <span className="border-border bg-card text-foreground rounded-md border px-2.5 py-1 text-xs font-medium whitespace-nowrap shadow-[0_8px_24px_-6px_rgba(0,0,0,0.7)]">
                {item.label}
              </span>

              <span
                className={ringClassName}
                style={{ background: "var(--border-gradient)" }}
              >
                {item.href ? (
                  <Link
                    href={item.href}
                    onClick={close}
                    aria-label={item.label}
                    className={actionClassName}
                  >
                    {item.icon}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={item.onClick}
                    aria-label={item.label}
                    className={actionClassName}
                  >
                    {item.icon}
                  </button>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
