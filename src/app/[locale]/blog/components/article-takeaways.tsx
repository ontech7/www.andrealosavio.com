import { getLocale, getTranslations } from "next-intl/server";
import type { AppLocale } from "@/libs/i18n/utils";
import { cn } from "@/utils/cn";

interface ArticleTakeawaysProps {
  items: readonly string[];
  className?: string;
}

export async function ArticleTakeaways({
  items,
  className,
}: ArticleTakeawaysProps) {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations({ locale });

  return (
    <aside
      className={cn(
        "border-border bg-card/50 my-8 rounded-xl border p-5",
        className
      )}
    >
      <h2 className="text-foreground mb-3 text-sm font-semibold tracking-wide uppercase">
        {t("blog.article.takeaways")}
      </h2>
      <ul className="text-muted-foreground m-0 list-disc space-y-1 pl-5 text-sm">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </aside>
  );
}
