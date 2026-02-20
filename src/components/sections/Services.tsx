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
const ITEMS_PER_SERVICE: Record<string, number> = { consulting: 2, finance: 2, construction: 3, yacht: 2 };

const FOCUS_AREAS = [
  { key: "corporate_law", itemCount: 3 },
  { key: "transparency", itemCount: 3 },
] as const;

const FOCUS_ICONS: Record<string, React.ReactNode> = {
  corporate_law: (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
  transparency: (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
};

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
                    {Array.from({ length: ITEMS_PER_SERVICE[key] }, (_, i) => (
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

        {/* === Focus Areas — subtle detail zone === */}
        <FadeIn delay={0.3}>
          <div aria-hidden="true" className="h-px bg-linear-to-r from-transparent via-beige-400/30 to-transparent mt-16 mb-14" />
        </FadeIn>

        <FadeIn delay={0.35}>
          <p className="text-center text-sm font-medium tracking-[0.4em] uppercase text-accent mb-10">
            {t("focus_headline")}
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {FOCUS_AREAS.map((area, i) => (
            <FadeIn key={area.key} delay={0.4 + i * 0.1} className="h-full min-h-0">
              <div className="relative pl-6 border-l border-beige-400/50 h-full flex flex-col">
                {/* Icon + Title */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-accent shrink-0">
                    {FOCUS_ICONS[area.key]}
                  </span>
                  <h4 className="font-display text-lg font-normal text-text-primary tracking-tight">
                    {t(`${area.key}.title`)}
                  </h4>
                </div>

                {/* Lead text */}
                <p className="text-sm text-text-muted leading-relaxed mb-4">
                  {t(`${area.key}.lead`)}
                </p>

                {/* Items list */}
                <ul className="space-y-2">
                  {Array.from({ length: area.itemCount }, (_, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2.5 text-sm text-text-muted leading-relaxed"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 w-1 h-1 rounded-full bg-bordeaux-900/30 shrink-0"
                      />
                      {t(`${area.key}.items.${j}`)}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
