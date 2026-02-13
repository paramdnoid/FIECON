"use client";

import Image from "next/image";
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
      <div className="relative py-16 sm:py-20 bg-beige-50">
        {/* Gradient border top */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-beige-400/40 to-transparent"
        />
        <Container size="md">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-0">
            {STATS.map((stat, i) => (
              <FadeIn key={stat.key} delay={i * 0.1}>
                <div
                  className={`text-center ${i < STATS.length - 1
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
        {/* Gradient border bottom */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-beige-400/40 to-transparent"
        />
      </div>

      {/* === Zone 3: Quote === */}
      <div className="py-24 sm:py-32">
        <Container size="md">
          <FadeIn>
            {/* Gradient frame */}
            <div className="mx-auto max-w-4xl rounded-2xl p-px bg-linear-to-r from-beige-400/30 via-bordeaux-500/40 to-beige-400/30 shadow-[0_4px_24px_-8px_rgba(98,25,28,0.06)]">
              <blockquote
                className="relative flex flex-col items-center gap-8 overflow-hidden rounded-2xl bg-beige-50/80 px-8 py-12 sm:flex-row sm:items-center sm:gap-10 sm:px-12 sm:py-14 lg:gap-12 lg:px-16 lg:py-16"
                role="article"
                aria-label={t("quote")}
              >
                {/* Portrait — links, vertikal zentriert */}
                <div className="flex shrink-0 items-center sm:self-stretch">
                  <div className="relative size-24 overflow-hidden rounded-full ring-1 ring-bordeaux-900/15 ring-offset-2 ring-offset-beige-50 sm:size-28 lg:size-32">
                    <Image
                      src="/team/peter-fiegler.png"
                      alt=""
                      width={128}
                      height={128}
                      className="size-full object-cover"
                      sizes="(max-width: 640px) 96px, (max-width: 1024px) 112px, 128px"
                    />
                  </div>
                </div>

                {/* Quote + Attribution — rechts */}
                <div className="relative flex min-w-0 flex-1 flex-col items-center justify-center text-center sm:items-start sm:text-left">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 font-display text-[4rem] leading-none text-beige-400/50 select-none sm:left-0 sm:-top-8 sm:translate-x-0 sm:text-[5rem]"
                  >
                    &ldquo;
                  </span>
                  <p className="font-display italic text-xl sm:text-2xl lg:text-[1.75rem] font-light text-text-primary leading-relaxed">
                    {t("quote")}
                  </p>
                  <footer className="mt-5 flex flex-col items-center gap-2 sm:items-start">
                    <div
                      aria-hidden="true"
                      className="h-px w-10 bg-bordeaux-900/20"
                    />
                    <cite className="text-xs sm:text-sm font-medium tracking-[0.2em] uppercase text-text-muted not-italic">
                      {t("quote_attribution")}
                    </cite>
                  </footer>
                </div>
              </blockquote>
            </div>
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
