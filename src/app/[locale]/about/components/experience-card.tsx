import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { ExperienceItem } from "../constants/experience-items";

interface ExperienceCardProps {
  experience: ExperienceItem;
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  const t = useTranslations();

  const formatDateRange = (startDate: string, endDate: string | null) => {
    const formatDate = (dateStr: string) => {
      const [year, month] = dateStr.split("-");
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date
        .toLocaleDateString("en-US", { month: "short", year: "numeric" })
        .toUpperCase();
    };

    const start = formatDate(startDate);
    const end = endDate ? formatDate(endDate) : t("about.experiences.present");

    return `${start} — ${end}`;
  };

  const getContractType = () => {
    const types = {
      freelance: t("about.experiences.contractTypes.freelance"),
      permanent: t("about.experiences.contractTypes.permanent"),
      apprenticeship: t("about.experiences.contractTypes.apprenticeship"),
    };
    return types[experience.type];
  };

  const getWorkMode = () => {
    const modes = {
      remote: t("about.experiences.workModes.remote"),
      hybrid: t("about.experiences.workModes.hybrid"),
      onsite: t("about.experiences.workModes.onsite"),
    };
    return modes[experience.workMode];
  };

  return (
    <motion.div
      className="flex flex-col gap-6 md:flex-row md:gap-12"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5 }}
    >
      <div className="shrink-0 md:w-48">
        <p className="text-muted-foreground text-sm font-medium tracking-wider">
          {formatDateRange(experience.startDate, experience.endDate)}
        </p>
      </div>

      <div className="flex-1">
        <h3 className="-mt-1 mb-0.5 text-lg font-semibold text-white">
          {t(`about.experiences.roles.${experience.roleKey}`)}
        </h3>

        <div className="mb-4 flex items-center gap-2">
          <Image
            src={experience.logo}
            alt={experience.company}
            width={20}
            height={20}
            className="size-5 shrink-0 object-contain"
          />
          <span className="text-muted-foreground text-sm">
            {experience.company} - {experience.location}, {getWorkMode()} (
            {getContractType()})
          </span>
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed">
          {t(`about.experiences.items.${experience.id}.description`)}
        </p>

        <ul className="space-y-2">
          {(
            t.raw(
              `about.experiences.items.${experience.id}.achievements`
            ) as string[]
          ).map((achievement, index) => (
            <li
              key={index}
              className="text-muted-foreground flex items-start gap-2 text-sm"
            >
              <span className="bg-muted-foreground mt-2 size-1 shrink-0 rounded-full" />
              <span>{achievement}</span>
            </li>
          ))}
        </ul>

        {t.raw(`about.experiences.items.${experience.id}.note`) && (
          <p className="text-muted-foreground text-sm italic">
            {t.rich(`about.experiences.items.${experience.id}.note`, {
              highlight: (children) => (
                <span className="bg-(image:--outline-gradient-light) bg-clip-text text-transparent">
                  {children}
                </span>
              ),
            })}
          </p>
        )}
      </div>
    </motion.div>
  );
}
