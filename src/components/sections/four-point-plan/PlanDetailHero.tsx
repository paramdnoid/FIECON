"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { Container } from "@/components/ui/Container";
import {
  FOUR_POINT_PLAN_ACCENT_CLASS,
  FOUR_POINT_PLAN_POINTS,
  type FourPointPlanPoint,
  type FourPointPlanPointKey,
} from "@/components/sections/four-point-plan/plan-data";

type TranslateFn = (key: string) => string;

type Props = {
  t: TranslateFn;
  tDetail: TranslateFn;
  activePoint: FourPointPlanPointKey;
  activePointData: FourPointPlanPoint;
  onJumpToPoint: (pointKey: FourPointPlanPointKey) => void;
};

export function PlanDetailHero({
  t,
  tDetail,
  activePoint,
  activePointData,
  onJumpToPoint,
}: Props) {
  return (
    <section className="relative overflow-hidden bg-beige-50 pt-32 pb-12 sm:pt-40 sm:pb-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -top-24 right-[-8%] h-72 w-72 rounded-full bg-bordeaux-900/10 blur-3xl" />
        <div className="absolute -bottom-28 left-[-10%] h-80 w-80 rounded-full bg-beige-400/25 blur-3xl" />
      </div>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 select-none font-display text-[18rem] leading-none text-bordeaux-900 opacity-[0.012] sm:text-[24rem] lg:block"
      >
        IV
      </span>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.45]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_20%,rgba(98,25,28,0.08),transparent_42%),radial-gradient(circle_at_78%_70%,rgba(158,113,97,0.14),transparent_48%)]" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(115deg,rgba(98,25,28,0.03)_0_1px,transparent_1px_16px)]" />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-beige-400/40 to-transparent"
      />

      <Container size="lg">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-8">
            <FadeIn>
              <span className="inline-block text-sm font-medium uppercase tracking-[0.4em] text-accent">
                {t("badge")}
              </span>
              <div aria-hidden="true" className="my-5 h-px w-10 bg-accent/40" />
              <h1 className="gradient-text font-display text-4xl font-light italic tracking-tight text-balance sm:text-5xl lg:text-6xl">
                {tDetail("headline")}
              </h1>
            </FadeIn>

            <FadeIn delay={0.07}>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-text-muted sm:text-lg">
                {tDetail("subtitle")}
              </p>
              <p className="mt-4 max-w-4xl text-sm leading-relaxed text-text-muted/90 sm:text-base">
                {t("intro")}
              </p>
            </FadeIn>
          </div>

          <FadeIn delay={0.14} className="lg:col-span-4 lg:pt-4">
            <div className="relative overflow-hidden rounded-2xl border border-beige-400/70 bg-beige-50/80 p-5 shadow-[0_18px_38px_-32px_rgba(98,25,28,0.35)] backdrop-blur-sm sm:p-6">
              <div
                aria-hidden="true"
                className={`absolute left-0 right-0 top-0 h-1.5 bg-linear-to-r ${FOUR_POINT_PLAN_ACCENT_CLASS[activePoint]}`}
              />
              <p className="text-[11px] uppercase tracking-[0.22em] text-bordeaux-900/70">
                {tDetail("focus_label")}
              </p>
              <p className="mt-2 font-display text-3xl italic text-bordeaux-900 sm:text-4xl">
                {activePointData.number}
              </p>
              <p className="mt-2 text-sm font-medium leading-snug text-text-primary">
                {t(`points.${activePointData.key}.title`)}
              </p>
              <p className="mt-3 text-xs leading-relaxed text-text-muted">
                {t(`points.${activePointData.key}.teaser`)}
              </p>
            </div>
          </FadeIn>
        </div>

        <section aria-label={tDetail("navigation_label")} className="mt-10 sm:mt-12">
          <div className="flex flex-wrap gap-2.5">
            {FOUR_POINT_PLAN_POINTS.map((point) => (
              <button
                key={`hero-chip-${point.key}`}
                type="button"
                onClick={() => onJumpToPoint(point.key)}
                aria-pressed={activePoint === point.key}
                className="rounded-xl p-px bg-linear-to-r from-beige-400/20 via-bordeaux-500/25 to-beige-400/20 transition-shadow duration-300 hover:shadow-[0_4px_20px_-6px_rgba(98,25,28,0.10)]"
              >
                <span
                  className={`inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                    activePoint === point.key
                      ? "bg-white text-bordeaux-900"
                      : "bg-beige-50/80 text-accent hover:bg-white"
                  }`}
                >
                  {t(`points.${point.key}.title`)}
                </span>
              </button>
            ))}
          </div>
        </section>
      </Container>
    </section>
  );
}
