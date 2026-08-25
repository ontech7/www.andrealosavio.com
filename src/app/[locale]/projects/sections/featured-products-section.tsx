"use client";

import { ProductHighlightCard } from "@/components/product-highlight-card";
import { fadeInUpAnim, staggerContainerAnim } from "@/constants/motion";
import { FEATURED_PRODUCTS } from "@/constants/products";
import { cn } from "@/utils/cn";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";

interface FeaturedProductsSectionProps {
  id: string;
  className?: string;
}

export function FeaturedProductsSection({
  id,
  className,
}: FeaturedProductsSectionProps) {
  const t = useTranslations();

  return (
    <section
      id={id}
      className={cn("mx-auto max-w-5xl scroll-mt-20 px-6 pb-14", className)}
    >
      <motion.div
        className="mb-8"
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
          {t("projects.featured.title")}
        </motion.h2>
        <motion.p
          className="text-muted-foreground mt-3 max-w-md"
          variants={fadeInUpAnim}
          transition={{ duration: 0.5 }}
        >
          {t("projects.featured.subtitle")}
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
    </section>
  );
}
