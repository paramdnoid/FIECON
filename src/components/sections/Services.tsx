"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/animations/FadeIn";

import React from "react";

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  consulting: (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
  finance: (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  construction: (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
      <path d="M8 4v16" />
      <path d="M16 4v16" />
    </svg>
  ),
  yacht: (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20h20" />
      <path d="M12 4v12" />
      <path d="M12 4l8 12H4z" />
    </svg>
  ),
};

const SERVICE_KEYS = ["consulting", "finance", "construction", "yacht"] as const;
const ITEMS_PER_SERVICE = 2;

export function Services() {
  const t = useTranslations("services");

  return (
    <section id="services" className="py-32 sm:py-40 bg-beige-50">
      <Container size="lg">
        <FadeIn>
          <SectionHeading
            badge={t("badge")}
            headline={t("headline")}
            subtitle={t("subtitle")}
          />
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
          {SERVICE_KEYS.map((key, i) => (
            <FadeIn key={key} delay={0.1 + i * 0.08} className="h-full">
              <div className="group relative bg-white rounded-2xl border border-beige-200/60 h-full overflow-hidden transition-all duration-500 hover:shadow-lg hover:shadow-bordeaux-900/8 hover:border-beige-400/50">
                {/* Bordeaux accent bar */}
                <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-bordeaux-900 via-bordeaux-700 to-transparent scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />

                <div className="p-7 lg:p-8 flex flex-col h-full">
                  {/* Icon — top right */}
                  <div className="absolute top-6 right-6 w-9 h-9 rounded-full bg-bordeaux-900 text-beige-100 flex items-center justify-center group-hover:bg-bordeaux-700 transition-colors duration-500">
                    {SERVICE_ICONS[key]}
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-xl font-normal text-text-primary mb-2 tracking-tight pr-16">
                    {t(`${key}.title`)}
                  </h3>

                  {/* Divider */}
                  <div className="w-8 h-px bg-beige-400 mb-3" />

                  {/* Description */}
                  <p className="text-sm text-text-muted leading-relaxed">
                    {t(`${key}.description`)}
                  </p>

                  {/* Badges — pushed to bottom */}
                  <div className="flex flex-wrap gap-2 mt-auto pt-4">
                    {Array.from({ length: ITEMS_PER_SERVICE }, (_, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-[11px] font-medium tracking-wide uppercase bg-beige-50 text-bordeaux-900 rounded-full"
                      >
                        {t(`${key}.items.${i}`)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
