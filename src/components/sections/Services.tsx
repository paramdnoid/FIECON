"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SlideReveal } from "@/components/animations/SlideReveal";
import { FadeIn } from "@/components/animations/FadeIn";

import React from "react";

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  consulting: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
  finance: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  construction: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
      <path d="M8 4v16" />
      <path d="M16 4v16" />
    </svg>
  ),
  yacht: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20h20" />
      <path d="M12 4v12" />
      <path d="M12 4l8 12H4z" />
    </svg>
  ),
};

const SERVICE_KEYS = ["consulting", "finance", "construction", "yacht"] as const;

export function Services() {
  const t = useTranslations("services");

  return (
    <section id="services" className="py-24 sm:py-32">
      <Container size="lg">
        <FadeIn>
          <SectionHeading
            badge={t("badge")}
            headline={t("headline")}
            subtitle={t("subtitle")}
          />
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {SERVICE_KEYS.map((key, i) => (
            <SlideReveal
              key={key}
              direction={i % 2 === 0 ? "left" : "right"}
              delay={0.1 + i * 0.1}
            >
              <div className="group relative p-8 lg:p-10 bg-white rounded-2xl border border-border-subtle hover:border-beige-400 transition-all duration-500 hover:shadow-2xl hover:shadow-bordeaux-900/8 hover:scale-[1.02]">
                {/* Icon */}
                <div className="w-16 h-16 rounded-xl border border-beige-200 bg-beige-50 flex items-center justify-center text-bordeaux-900 mb-6 group-hover:bg-beige-100 group-hover:border-beige-400 transition-all duration-300">
                  {SERVICE_ICONS[key]}
                </div>

                {/* Content */}
                <h3 className="font-display text-2xl font-semibold text-text-primary mb-3">
                  {t(`${key}.title`)}
                </h3>
                <p className="text-text-muted leading-relaxed mb-4">
                  {t(`${key}.description`)}
                </p>

                {/* Sub-items for consulting */}
                {key === "consulting" && (
                  <div className="flex flex-wrap gap-2">
                    {t("consulting.items")
                      .split(", ")
                      .map((item: string) => (
                        <span
                          key={item}
                          className="px-3 py-1 text-xs font-medium bg-beige-100 text-bordeaux-700 rounded-full"
                        >
                          {item}
                        </span>
                      ))}
                  </div>
                )}

                {/* Hover accent line */}
                <div className="absolute bottom-0 left-8 right-8 h-0.5 bg-gradient-to-r from-bordeaux-900 via-bordeaux-700 to-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
              </div>
            </SlideReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
