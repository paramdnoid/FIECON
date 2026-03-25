"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/animations/FadeIn";
import { FOUR_POINT_PLAN_POINTS } from "@/components/sections/four-point-plan/plan-data";

const PLAN_ICONS: Record<string, React.ReactNode> = {
  strategy: (
    <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v5h5" />
      <path d="M3 8c1.8-2.8 4.8-4.5 8-4.5 5.5 0 10 4.5 10 10S16.5 23.5 11 23.5 1 19 1 13.5" />
      <path d="M8.5 12.5h7" />
      <path d="M8.5 16h5" />
    </svg>
  ),
  tax: (
    <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6.5h16" />
      <path d="M7 3.5v6" />
      <path d="M17 3.5v6" />
      <rect x="4" y="4.5" width="16" height="16" rx="2" />
      <path d="M8.5 13h7" />
      <path d="M8.5 17h4.5" />
    </svg>
  ),
  relief: (
    <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h18" />
      <path d="M8 7l-5 5 5 5" />
      <path d="M16 17l5-5-5-5" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  pension: (
    <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18" />
      <path d="M17.5 7.5c0-2-2.2-3.5-5.5-3.5-3 0-5 1.3-5 3.3 0 2.1 1.9 2.9 5.2 3.5 3.2.6 4.8 1.4 4.8 3.4 0 2.2-2.2 3.8-5.6 3.8-3.2 0-5.5-1.4-5.9-3.5" />
    </svg>
  ),
};

export function FourPointPlan() {
  const t = useTranslations("fourPointPlan");

  return (
    <section id="four-point-plan" className="py-14 sm:py-16 lg:py-20 bg-white">
      <Container size="lg">
        <FadeIn>
          <div className="mb-4 lg:mb-5">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.22em] text-accent mb-2">
              {t("badge")}
            </p>
            <h2 className="font-display gradient-text text-3xl sm:text-4xl lg:text-5xl font-normal leading-[0.97] tracking-[-0.02em]">
              {t("headline")}
            </h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 mb-6 lg:mb-8">
          <FadeIn delay={0.05} className="lg:col-span-8">
            <p className="text-sm sm:text-base text-text-muted leading-relaxed max-w-3xl mb-2">
              {t("subtitle")}
            </p>
            <p className="text-xs sm:text-sm text-text-muted/90 leading-relaxed max-w-3xl">
              {t("intro")}
            </p>
          </FadeIn>

          <FadeIn delay={0.12} className="lg:col-span-4">
            <div className="fiecon-card-frame h-full rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-bordeaux-900/70">
                {t("badge")}
              </p>
              <Link
                href="/four-point-plan"
                className="group inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-bordeaux-900 hover:text-bordeaux-700 transition-colors"
              >
                {t("cta_details")}
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </div>
          </FadeIn>
        </div>

        <div aria-hidden="true" className="h-px bg-linear-to-r from-transparent via-beige-400/40 to-transparent mb-6 lg:mb-8" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-5 items-stretch">
          {FOUR_POINT_PLAN_POINTS.map((point, pointIndex) => (
            <FadeIn
              key={point.key}
              delay={0.1 + pointIndex * 0.08}
              className={`h-full ${
                pointIndex === 0 || pointIndex === 1
                  ? "lg:col-span-6"
                  : pointIndex === 2
                    ? "lg:col-span-7"
                    : "lg:col-span-5"
              }`}
            >
              <Link
                href={`/four-point-plan#plan-step-${point.key}`}
                className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux-800/65 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                <article className={`fiecon-card-frame fiecon-card-interactive relative flex h-full min-h-[138px] flex-col overflow-hidden rounded-2xl p-4 sm:p-5 ${pointIndex % 2 === 0 ? "hover:-translate-y-1" : "hover:translate-y-1"}`}>
                  <div className="absolute top-0 inset-x-0 h-[4px] bg-linear-to-r from-bordeaux-900 via-bordeaux-700 to-beige-400 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />

                  <span aria-hidden="true" className="absolute top-3 right-4 font-display text-5xl lg:text-6xl font-light text-bordeaux-900 opacity-[0.05] select-none pointer-events-none">
                    {point.number}
                  </span>

                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-bordeaux-900/5 text-accent transition-all duration-400 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-bordeaux-900/10">
                    {PLAN_ICONS[point.key]}
                  </div>

                  <h3 className="mb-2 font-display text-xl font-normal italic text-text-primary lg:text-2xl">
                    {t(`points.${point.key}.title`)}
                  </h3>

                  <p className="text-sm leading-relaxed text-text-muted">
                    {t(`points.${point.key}.teaser`)}
                  </p>
                </article>
              </Link>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.4}>
          <div className="mt-6 lg:mt-8 flex justify-end">
            <Link
              href="/four-point-plan"
              className="group inline-flex items-center justify-center gap-2.5 px-5 py-2.5 text-sm font-medium rounded-xl bg-bordeaux-900 text-white border border-transparent hover:bg-bordeaux-800 shadow-md hover:shadow-lg hover:shadow-bordeaux-900/25 transition-all duration-300"
            >
              {t("cta_details")}
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
