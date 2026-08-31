import { ZapIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { AppLocale } from "@/libs/i18n/utils";
import { cn } from "@/utils/cn";

interface ArticleTakeawaysProps {
  items: readonly string[];
  locale: AppLocale;
  className?: string;
}

export async function ArticleTakeaways({
  items,
  locale,
  className,
}: ArticleTakeawaysProps) {
  const t = await getTranslations({ locale });

  if (items.length === 0) {
    return null;
  }

  return (
    <aside
      id="tldr"
      aria-label={t("blog.article.takeawaysLabel")}
      className={cn(
        "tldr-outline my-10 scroll-mt-36 rounded-xl p-px xl:scroll-mt-24",
        className
      )}
    >
      <div className="bg-card rounded-[15px] p-5 md:p-6">
        <h2 className="text-secondary m-0 flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase">
          <ZapIcon className="size-3.5 shrink-0" aria-hidden="true" />
          {t("blog.article.takeaways")}
        </h2>

        <ul className="m-0 mt-4 list-none space-y-3 p-0">
          {items.map((item) => (
            <li
              key={item}
              className="text-foreground/90 m-0 flex gap-3 text-sm leading-relaxed"
            >
              <span
                className="bg-secondary mt-2 size-1.5 shrink-0 rounded-full shadow-[0_0_6px_0_var(--secondary)]"
                aria-hidden="true"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
