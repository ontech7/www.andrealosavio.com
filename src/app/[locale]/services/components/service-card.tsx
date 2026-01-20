"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fadeInUpAnim } from "@/constants/motion";
import { SERVICES } from "@/constants/services";
import { cn } from "@/utils/cn";
import { ArrowRightIcon } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface ServiceCardProps {
  service: (typeof SERVICES)[number];
  reversed?: boolean;
}

export function ServiceCard({ service, reversed = false }: ServiceCardProps) {
  const t = useTranslations("services.availableServices");

  return (
    <motion.div
      id={service.id}
      variants={fadeInUpAnim}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-background overflow-hidden p-5">
        <CardContent
          className={cn(
            "flex flex-col gap-4 px-0 md:flex-row md:gap-8",
            reversed && "md:[&>*:first-child]:order-2"
          )}
        >
          {/* Image Column */}
          <div className="relative h-50 shrink-0 overflow-hidden rounded-lg md:h-63.75">
            <Image
              src={service.imageSrc}
              alt={t(`${service.id}.title`)}
              width={340 * 3}
              height={255 * 3}
              className="h-auto w-full md:h-full md:w-auto"
            />
          </div>

          {/* Text Column */}
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="mb-3 text-2xl font-semibold">
                {t(`${service.id}.title`)}
              </h3>
              <p className="text-muted-foreground">
                {t.has(`${service.id}.highlight`) ? (
                  <>
                    {
                      t(`${service.id}.description`).split(
                        t(`${service.id}.highlight`)
                      )[0]
                    }
                    <span className="text-secondary font-medium">
                      {t(`${service.id}.highlight`)}
                    </span>
                    {
                      t(`${service.id}.description`).split(
                        t(`${service.id}.highlight`)
                      )[1]
                    }
                  </>
                ) : (
                  t(`${service.id}.description`)
                )}
              </p>
            </div>

            <div className="mt-6">
              <Button variant="gradient-primary" size="default">
                <div className="bg-secondary size-2.5 shrink-0 animate-pulse rounded-full shadow-(--shadow-secondary)" />

                {t.rich(`${service.id}.cta`, {
                  price: (children) => (
                    <span className="-ml-1.5 font-medium">{children}</span>
                  ),
                })}
                <ArrowRightIcon className="size-4" />
              </Button>
              {t.has(`${service.id}.ctaNote`) && (
                <p className="text-muted-foreground mt-1 ml-5.5 text-xs">
                  {t(`${service.id}.ctaNote`)}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
