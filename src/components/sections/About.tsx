"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SlideReveal } from "@/components/animations/SlideReveal";
import { FadeIn } from "@/components/animations/FadeIn";
import { CountUp } from "@/components/animations/CountUp";

const STATS = [
  { key: "stat_1_label", value: 3 },
  { key: "stat_2_label", value: 4 },
  { key: "stat_3_label", value: 3 },
] as const;

export function About() {
  const t = useTranslations("about");

  return (
    <section id="about" className="bg-white">
      {/* === Zone 1: Narrative Intro === */}
      <div className="py-32 sm:py-40">
        <Container size="lg">
          {/* Top decorative line */}
          <FadeIn>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-beige-400/40 to-transparent mb-20 sm:mb-24" />
          </FadeIn>

          {/* Asymmetric two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Left column — heading */}
            <div className="lg:col-span-5">
              <SlideReveal direction="left" delay={0}>
                <span className="inline-block text-sm font-medium tracking-[0.4em] uppercase text-accent mb-5">
                  {t("badge")}
                </span>

                {/* Short accent line under badge */}
                <div className="w-10 h-px bg-accent/40 mb-8" />

                <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight gradient-text text-balance">
                  {t("headline")}
                </h2>
              </SlideReveal>
            </div>

            {/* Right column — body text */}
            <div className="lg:col-span-7 lg:pt-4">
              <SlideReveal direction="right" delay={0.15}>
                <div className="space-y-6 text-lg sm:text-xl text-text-muted leading-relaxed">
                  <p>{t("text_1")}</p>
                  <p>{t("text_2")}</p>
                </div>
              </SlideReveal>
            </div>
          </div>
        </Container>
      </div>

      {/* === Zone 2: Statistics Band === */}
      <div className="py-16 sm:py-20 bg-beige-50">
        <Container size="md">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-0">
            {STATS.map((stat, i) => (
              <FadeIn key={stat.key} delay={i * 0.1}>
                <div
                  className={`text-center ${
                    i < STATS.length - 1
                      ? "sm:border-r sm:border-beige-300/50"
                      : ""
                  }`}
                >
                  <CountUp
                    to={stat.value}
                    duration={2}
                    delay={0.2 + i * 0.15}
                    className="font-display text-5xl sm:text-6xl lg:text-7xl font-light text-bordeaux-900 tracking-tight"
                  />
                  <p className="text-sm font-medium tracking-[0.2em] uppercase text-text-muted mt-3">
                    {t(stat.key)}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </div>

      {/* === Zone 3: Quote === */}
      <div className="py-20 sm:py-28">
        <Container size="md">
          <FadeIn>
            <blockquote className="text-center max-w-3xl mx-auto">
              {/* Decorative quotation mark */}
              <span
                aria-hidden="true"
                className="block font-display text-7xl sm:text-8xl text-bordeaux-900/10 leading-none select-none pointer-events-none"
              >
                &ldquo;
              </span>

              <p className="font-display italic text-2xl sm:text-3xl lg:text-4xl font-light text-text-primary leading-snug -mt-6 sm:-mt-8">
                {t("quote")}
              </p>

              {/* Attribution */}
              <footer className="mt-8">
                <div
                  aria-hidden="true"
                  className="w-10 h-px bg-bordeaux-900/20 mx-auto mb-4"
                />
                <cite className="text-sm tracking-[0.2em] uppercase text-text-muted not-italic">
                  {t("quote_attribution")}
                </cite>
              </footer>
            </blockquote>
          </FadeIn>
        </Container>
      </div>

      {/* Bottom decorative line */}
      <Container size="lg">
        <FadeIn delay={0.3}>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-beige-400/40 to-transparent" />
        </FadeIn>
      </Container>
    </section>
  );
}
