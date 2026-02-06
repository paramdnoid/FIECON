"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SlideReveal } from "@/components/animations/SlideReveal";
import { CountUp } from "@/components/animations/CountUp";
import { FadeIn } from "@/components/animations/FadeIn";

const STATS = [
  { key: "stat_1", to: 3 },
  { key: "stat_2", to: 4 },
  { key: "stat_3", to: 3 },
] as const;

export function About() {
  const t = useTranslations("about");

  return (
    <section id="about" className="py-32 sm:py-40 bg-white">
      <Container size="lg">
        {/* Asymmetric two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left column — heading */}
          <div className="lg:col-span-4">
            <SlideReveal direction="left" delay={0}>
              <span className="inline-block text-sm font-medium tracking-[0.4em] uppercase text-accent mb-4">
                {t("badge")}
              </span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight gradient-text text-balance">
                {t("headline")}
              </h2>
            </SlideReveal>
          </div>

          {/* Right column — body text */}
          <div className="lg:col-span-8 lg:pt-2">
            <SlideReveal direction="right" delay={0.15}>
              <div className="space-y-6 text-lg text-text-muted leading-relaxed">
                <p>{t("text_1")}</p>
                <p>{t("text_2")}</p>
              </div>
            </SlideReveal>

            {/* Pull quote with left border */}
            <FadeIn delay={0.3}>
              <blockquote className="mt-12 mb-12 border-l-2 border-accent pl-6">
                <p className="font-display italic text-2xl sm:text-3xl font-light text-bordeaux-900/80 leading-snug">
                  {t("quote")}
                </p>
              </blockquote>
            </FadeIn>
          </div>
        </div>

        {/* Stats row */}
        <FadeIn delay={0.4}>
          <div className="w-full h-px bg-linear-to-r from-transparent via-beige-400/30 to-transparent mt-16 mb-12" />
          <div className="flex items-center justify-center gap-8 sm:gap-16">
            {STATS.map((stat, i) => (
              <div key={stat.key} className="flex items-center gap-8 sm:gap-16">
                <div className="text-center">
                  <CountUp
                    to={stat.to}
                    duration={2}
                    delay={0.1 * i}
                    className="block font-display text-5xl sm:text-6xl font-light text-bordeaux-900"
                  />
                  <span className="block text-sm text-text-muted mt-1 tracking-wide">
                    {t(`${stat.key}_label`)}
                  </span>
                </div>
                {i < STATS.length - 1 && (
                  <div className="w-px h-12 bg-beige-400/40" />
                )}
              </div>
            ))}
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
