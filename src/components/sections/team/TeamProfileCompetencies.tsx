"use client";

import React from "react";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/animations/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";

type CompetencyItem = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
};

type Props = {
  headline: string;
  competencies: CompetencyItem[];
};

const COMPETENCY_NUMBERS = ["01", "02", "03", "04"] as const;

export function TeamProfileCompetencies({ headline, competencies }: Props) {
  return (
    <section className="py-32 sm:py-40 bg-beige-50">
      <Container size="lg">
        <FadeIn>
          <SectionHeading headline={headline} gradient italic />
        </FadeIn>

        <div aria-hidden="true" className="h-px bg-linear-to-r from-transparent via-beige-400/30 to-transparent mb-12" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
          {competencies.map((comp, i) => (
            <FadeIn key={comp.id} delay={0.1 + i * 0.08} className="h-full">
              <div className="group relative bg-white rounded-2xl border border-beige-200/60 h-full overflow-hidden transition-all duration-500 hover:shadow-lg hover:shadow-bordeaux-900/8 hover:border-beige-400/50">
                {/* Bordeaux accent bar */}
                <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-bordeaux-900 via-bordeaux-700 to-transparent scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />

                <div className="p-7 lg:p-8 flex flex-col h-full">
                  {/* Number watermark */}
                  <span
                    aria-hidden="true"
                    className="absolute top-4 right-5 font-display text-6xl font-light text-bordeaux-900 opacity-[0.04] select-none pointer-events-none"
                  >
                    {COMPETENCY_NUMBERS[i] ?? String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-full bg-bordeaux-900 text-beige-100 flex items-center justify-center group-hover:bg-bordeaux-700 transition-colors duration-500 mb-5">
                    {comp.icon}
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-xl font-normal text-text-primary mb-2 tracking-tight">
                    {comp.title}
                  </h3>

                  {/* Divider */}
                  <div className="w-8 h-px bg-beige-400 mb-3" />

                  {/* Description */}
                  <p className="text-sm text-text-muted leading-relaxed flex-1">
                    {comp.description}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
