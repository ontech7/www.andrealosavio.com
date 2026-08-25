"use client";

import { ProductHighlightCard } from "@/components/product-highlight-card";
import { fadeInUpAnim, staggerContainerAnim } from "@/constants/motion";
import { FEATURED_PRODUCTS } from "@/constants/products";
import { Link } from "@/libs/i18n/navigation";
import { cn } from "@/utils/cn";
import { ArrowRightIcon } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";

interface ProductsSectionProps {
  id: string;
  className?: string;
}

export function ProductsSection({ id, className }: ProductsSectionProps) {
  const t = useTranslations();

  return (
    <section
      id={id}
      className={cn(
        "mx-auto max-w-5xl scroll-mt-20 px-6 py-10 md:py-14",
        className
      )}
    >
      <motion.div
        className="mb-10 text-center"
        variants={staggerContainerAnim}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2
          className="bg-linear-to-t from-white via-white/75 to-white/60 bg-clip-text text-3xl font-bold text-transparent md:text-4xl"
          variants={fadeInUpAnim}
          transition={{ duration: 0.5 }}
        >
          {t("homepage.products.title")}
        </motion.h2>
        <motion.p
          className="text-muted-foreground mx-auto mt-3 max-w-md"
          variants={fadeInUpAnim}
          transition={{ duration: 0.5 }}
        >
          {t("homepage.products.subtitle")}
        </motion.p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
        variants={staggerContainerAnim}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {FEATURED_PRODUCTS.map((product) => (
          <motion.div
            key={product.id}
            className="h-full"
            variants={fadeInUpAnim}
            transition={{ duration: 0.5 }}
          >
            <ProductHighlightCard product={product} />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="mt-8 text-center"
        variants={fadeInUpAnim}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Link
          href="/projects"
          className="text-foreground hover:text-secondary inline-flex items-center gap-2 text-sm font-medium underline decoration-dotted underline-offset-4 transition-colors"
        >
          {t("homepage.products.cta")}
          <ArrowRightIcon className="size-3.5" aria-hidden="true" />
        </Link>
      </motion.div>
    </section>
  );
}
