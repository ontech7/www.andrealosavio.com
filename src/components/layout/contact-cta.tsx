import { CONTACT_HREF } from "@/constants/navigation";
import { Link } from "@/libs/i18n/navigation";
import { cn } from "@/utils/cn";
import { SendIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface ContactCtaProps {
  className?: string;
  onNavigate?: () => void;
}

export function ContactCta({ className, onNavigate }: ContactCtaProps) {
  const t = useTranslations();

  return (
    <span
      className={cn(
        "contact-cta-outline relative inline-flex rounded-lg p-px",
        className
      )}
    >
      <Link
        href={CONTACT_HREF}
        onClick={onNavigate}
        aria-label={t("common.accessibility.contactCta")}
        className="bg-background text-foreground hover:bg-muted flex w-full items-center justify-center gap-2 rounded-[11px] px-5 py-1.5 text-base transition-colors"
      >
        {t("common.navigation.contact")}
        <SendIcon className="size-4" aria-hidden="true" />
      </Link>
    </span>
  );
}
