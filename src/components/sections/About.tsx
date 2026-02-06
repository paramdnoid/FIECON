"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
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
    <section id="about" className="py-24 sm:py-32 bg-white">
      <Container size="sm">
        <SlideReveal direction="left" delay={0}>
          <SectionHeading
            badge={t("badge")}
            headline={t("headline")}
            gradient
          />
        </SlideReveal>

        <SlideReveal direction="left" delay={0.15}>
          <div className="space-y-6 text-lg text-text-muted leading-relaxed">
            <p>{t("text_1")}</p>
            <p>{t("text_2")}</p>
          </div>
        </SlideReveal>

        {/* Pull quote */}
        <FadeIn delay={0.3}>
          <blockquote className="mt-12 mb-12 text-center">
            <p className="font-display italic text-2xl sm:text-3xl text-bordeaux-900/80 leading-snug max-w-lg mx-auto">
              <span className="text-beige-400 text-4xl leading-none">&ldquo;</span>
              {t("quote")}
              <span className="text-beige-400 text-4xl leading-none">&rdquo;</span>
            </p>
          </blockquote>
        </FadeIn>

        {/* Stats row */}
        <FadeIn delay={0.4}>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-beige-400/50 to-transparent mb-12" />
          <div className="flex items-center justify-center gap-8 sm:gap-16">
            {STATS.map((stat, i) => (
              <div key={stat.key} className="flex items-center gap-8 sm:gap-16">
                <div className="text-center">
                  <CountUp
                    to={stat.to}
                    duration={2}
                    delay={0.1 * i}
                    className="block font-display text-4xl sm:text-5xl font-semibold text-bordeaux-900"
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
