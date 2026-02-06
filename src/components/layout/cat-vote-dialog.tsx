"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/libs/i18n/navigation";
import confetti from "canvas-confetti";
import { Heart, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface CatImage {
  id: string;
  url: string;
  width: number;
  height: number;
}

interface CatVoteDialogProps {
  children: React.ReactNode;
}

export function CatVoteDialog({ children }: CatVoteDialogProps) {
  const t = useTranslations("common");

  const [cat, setCat] = useState<CatImage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchCat = useCallback(async () => {
    setIsLoading(true);
    setHasVoted(false);

    try {
      const response = await fetch(
        "https://api.thecatapi.com/v1/images/search?size=med"
      );
      const data = await response.json();
      if (data && data.length > 0) {
        setCat(data[0]);
      }
    } catch (error) {
      console.error("Failed to fetch cat:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open && !cat) {
      fetchCat();
    }
  }, [open, cat, fetchCat]);

  const triggerConfetti = (intensity: "normal" | "high") => {
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    };

    if (intensity === "high") {
      const duration = 800;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          ...defaults,
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#ff9ff3"],
        });
        confetti({
          ...defaults,
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#ff9ff3"],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    } else {
      confetti({
        ...defaults,
        particleCount: 50,
        spread: 60,
        colors: ["#ff6b6b", "#ffd93d", "#6bcb77"],
      });
    }
  };

  const handleLinkClick = () => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleVote = async (value: number) => {
    if (!cat) return;

    try {
      await fetch("https://api.thecatapi.com/v1/votes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image_id: cat.id,
          value,
        }),
      });
      triggerConfetti(value === 10 ? "high" : "normal");
      setHasVoted(true);
    } catch (error) {
      console.error("Failed to vote:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="w-[calc(100%-24px)] max-w-lg"
        closeLabel={t("accessibility.closeDialog")}
      >
        <DialogHeader>
          <DialogTitle>
            {hasVoted ? t("catVote.thankYou.title") : t("catVote.title")}
          </DialogTitle>
          <DialogDescription>
            {hasVoted
              ? t("catVote.thankYou.description")
              : t("catVote.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          {isLoading ? (
            <Skeleton className="h-70 w-full max-w-xs rounded-lg" />
          ) : !hasVoted && cat ? (
            <div className="relative h-70 w-full max-w-xs overflow-hidden rounded-lg">
              <Image
                src={cat.url}
                alt={t("catVote.catAlt")}
                fill
                className="object-cover"
                sizes="(max-width: 320px) 100vw, 320px"
              />
            </div>
          ) : null}

          {!hasVoted ? (
            <div className="flex w-full justify-center gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={() => handleVote(1)}
                disabled={isLoading || !cat}
                className="flex-1"
              >
                <Heart className="text-pink-500" />
                {t("catVote.like")}
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={() => handleVote(10)}
                disabled={isLoading || !cat}
                className="flex-1"
              >
                <Sparkles className="text-yellow-500" />
                {t("catVote.love")}
              </Button>
            </div>
          ) : (
            <div className="mt-4 flex w-full flex-col gap-3">
              <div className="flex flex-col flex-wrap justify-center gap-2">
                <Button variant="primary" asChild onClick={handleLinkClick}>
                  <Link href="/services">{t("catVote.explore.services")}</Link>
                </Button>
                <Button variant="primary" asChild onClick={handleLinkClick}>
                  <Link href="/projects">{t("catVote.explore.projects")}</Link>
                </Button>
                <Button variant="primary" asChild onClick={handleLinkClick}>
                  <Link href="/about">{t("catVote.explore.about")}</Link>
                </Button>
              </div>
            </div>
          )}

          <p className="text-muted-foreground/70 text-xs">
            powered by{" "}
            <a
              href="https://thecatapi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-muted-foreground underline transition-colors"
            >
              The Cat API
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
