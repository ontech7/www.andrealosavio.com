"use client";

import { staggerContainerAnim } from "@/constants/motion";
import { PROJECTS } from "@/constants/projects";
import { cn } from "@/utils/cn";
import { motion } from "motion/react";
import { ProjectCard } from "../components/project-card";

interface ProjectsSectionProps {
  id: string;
  className?: string;
}

export function ProjectsSection({ id, className }: ProjectsSectionProps) {
  const leftColumn = PROJECTS.filter((_, i) => i % 2 === 0);
  const rightColumn = PROJECTS.filter((_, i) => i % 2 === 1);

  return (
    <section
      id={id}
      className={cn("mx-auto max-w-5xl px-6 pb-20 md:pb-30", className)}
    >
      <motion.div
        variants={staggerContainerAnim}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className={cn(
          "flex flex-col gap-6",
          "md:grid md:grid-cols-2 md:items-start"
        )}
      >
        {/* Mobile: single column */}
        <div className="flex flex-col gap-6 md:hidden">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* Desktop: masonry layout */}
        <div className="hidden flex-col gap-6 md:flex">
          {leftColumn.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        <div className="hidden flex-col gap-6 md:flex">
          {rightColumn.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
