"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SlideReveal } from "@/components/animations/SlideReveal";
import { FadeIn } from "@/components/animations/FadeIn";

const VALUE_ICONS: Record<string, React.ReactNode> = {
  expertise: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  personal: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  trust: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  ),
};

const VALUE_KEYS = ["expertise", "personal", "trust"] as const;

export function Philosophy() {
  const t = useTranslations("approach");

  return (
    <section id="approach" className="py-24 sm:py-32 bg-gradient-to-b from-white to-beige-50">
      <Container size="lg">
        <FadeIn>
          <SectionHeading badge={t("badge")} headline={t("headline")} gradient italic />
        </FadeIn>

        {/* Connecting line (hidden on mobile) */}
        <div className="relative">
          <div className="hidden md:block absolute top-8 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-transparent via-beige-400/30 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {VALUE_KEYS.map((key, index) => (
              <SlideReveal
                key={key}
                direction="bottom"
                delay={0.1 + index * 0.15}
              >
                <div className="text-center relative">
                  <div className="w-16 h-16 rounded-2xl border border-beige-200 bg-white flex items-center justify-center text-bordeaux-900 mx-auto mb-6 relative z-10">
                    {VALUE_ICONS[key]}
                  </div>
                  <h3 className="font-display italic text-xl font-semibold text-text-primary mb-3">
                    {t(`values.${key}.title`)}
                  </h3>
                  <p className="text-text-muted leading-relaxed max-w-xs mx-auto">
                    {t(`values.${key}.description`)}
                  </p>
                </div>
              </SlideReveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
