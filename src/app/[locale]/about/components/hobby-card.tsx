import { ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { HOBBY_ITEMS } from "../constants/hobby-items";

interface HobbyCardProps {
  hobby: (typeof HOBBY_ITEMS)[number];
  animateDirectly?: boolean;
}

export function HobbyCard({ hobby, animateDirectly }: HobbyCardProps) {
  const t = useTranslations("about");

  const hasLink = "href" in hobby && hobby.href;

  const content = (
    <>
      <Image
        src={hobby.image}
        alt={t(`beyondCode.hobbies.${hobby.id}`)}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"
        aria-hidden="true"
      />
      {/* External Link Icon */}
      {hasLink && (
        <div
          className="absolute top-4 right-4 flex items-center gap-2 rounded-full bg-black/50 p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden="true"
        >
          {hobby.hrefDescription && (
            <span className="text-xs">
              {t(`beyondCode.hobbies.${hobby.hrefDescription}`)}
            </span>
          )}
          <ExternalLink className="size-4 text-white" />
        </div>
      )}
      {/* Label */}
      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="bg-(image:--text-gradient) bg-clip-text text-center text-xl font-semibold text-transparent">
          {t(`beyondCode.hobbies.${hobby.id}`)}
        </p>
      </div>
    </>
  );

  const motionProps = animateDirectly
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
      }
    : {
        variants: {
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        },
      };

  if (hasLink) {
    return (
      <motion.a
        href={hobby.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${t(`beyondCode.hobbies.${hobby.id}`)} — ${t("beyondCode.externalLink")}`}
        className="group relative block h-63.75 cursor-pointer overflow-hidden rounded-xl"
        {...motionProps}
        transition={{ duration: 0.5 }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.div
      className="group relative h-63.75 overflow-hidden rounded-xl"
      {...motionProps}
      transition={{ duration: 0.5 }}
    >
      {content}
    </motion.div>
  );
}