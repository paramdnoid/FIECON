"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HoverCard } from "@/components/ui/HoverCard";
import { FadeIn } from "@/components/animations/FadeIn";

const LAW_ICONS: Record<string, React.ReactNode> = {
  kwg: (
    <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18" />
      <path d="M5 21V7l7-4 7 4v14" />
      <path d="M9 21v-6h6v6" />
      <path d="M9 9h1" />
      <path d="M14 9h1" />
      <path d="M9 12h1" />
      <path d="M14 12h1" />
    </svg>
  ),
  vag: (
    <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  estg: (
    <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
};

const LAWS = [
  { key: "kwg", number: "01" },
  { key: "vag", number: "02" },
  { key: "estg", number: "03" },
] as const;

export function Gesetze() {
  const t = useTranslations("gesetze");

  return (
    <section id="gesetze" className="py-20 sm:py-32 lg:py-40 bg-white">
      <Container size="lg">
        <FadeIn>
          <SectionHeading
            badge={t("badge")}
            headline={t("headline")}
            subtitle={t("subtitle")}
            gradient
            italic
          />
        </FadeIn>

        {/* Gradient divider */}
        <div aria-hidden="true" className="h-px bg-gradient-to-r from-transparent via-beige-400/30 to-transparent mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {LAWS.map((law, index) => (
            <FadeIn
              key={law.key}
              delay={0.1 + index * 0.15}
              className="h-full"
            >
              <HoverCard>
                {/* Number watermark */}
                <span aria-hidden="true" className="absolute top-4 right-5 font-display text-6xl font-light text-bordeaux-900 opacity-[0.04] select-none pointer-events-none">
                  {law.number}
                </span>

                {/* Icon circle */}
                <div className="w-14 h-14 rounded-full bg-bordeaux-900/5 group-hover:bg-bordeaux-900/10 flex items-center justify-center mx-auto mb-6 text-accent transition-colors duration-400">
                  {LAW_ICONS[law.key]}
                </div>

                <h3 className="font-display italic text-xl font-normal text-text-primary mb-1 text-center">
                  {t(`laws.${law.key}.abbreviation`)}
                </h3>
                <p className="text-sm text-accent mb-3 text-center">
                  {t(`laws.${law.key}.name`)}
                </p>
                <p className="flex-1 text-text-muted leading-relaxed text-sm max-w-xs mx-auto text-center">
                  {t(`laws.${law.key}.description`)}
                </p>
              </HoverCard>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
