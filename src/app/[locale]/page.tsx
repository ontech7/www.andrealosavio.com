import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("homepage");

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="text-center">
        <h1 className="text-foreground mb-4 text-4xl font-bold">
          {t("placeholder.title")}
        </h1>
        <p className="text-muted-foreground">{t("placeholder.description")}</p>
      </div>
    </div>
  );
}
