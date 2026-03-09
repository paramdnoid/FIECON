"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { FadeIn } from "@/components/animations/FadeIn";
import { Link } from "@/i18n/navigation";
import { EASE_OUT_EXPO } from "@/lib/constants";

export function GesetzeHero() {
  const t = useTranslations("gesetze_page");
  const prefersReduced = useReducedMotion();

  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 bg-beige-50 overflow-hidden">
      {/* Large § watermark */}
      <span
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[20rem] sm:text-[28rem] lg:text-[36rem] font-light text-bordeaux-900 opacity-[0.015] select-none pointer-events-none leading-none"
      >
        §
      </span>

      {/* Bottom gradient border */}
      <div aria-hidden="true" className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-beige-400/40 to-transparent" />

      <Container size="lg">
        {/* Breadcrumb — above the grid */}
        <motion.nav
          aria-label="Breadcrumb"
          {...(!prefersReduced && {
            initial: { opacity: 0, y: -8 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5, ease: EASE_OUT_EXPO },
          })}
          className="mb-10"
        >
          <ol className="flex items-center gap-2 text-sm text-text-muted">
            <li>
              <Link href="/" className="hover:text-accent transition-colors duration-200">
                {t("breadcrumb_home")}
              </Link>
            </li>
            <li aria-hidden="true" className="text-beige-400">/</li>
            <li>
              <span className="text-text-primary font-medium" aria-current="page">
                {t("breadcrumb_current")}
              </span>
            </li>
          </ol>
        </motion.nav>

        {/* 12-column asymmetric grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-start">

          {/* Left col: Badge + accent line + H1 */}
          <div className="lg:col-span-5">
            <FadeIn>
              <div className="mb-4">
                <Badge>{t("hero_badge")}</Badge>
              </div>
              <div aria-hidden="true" className="w-10 h-px bg-accent/40 my-5" />
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight italic text-balance gradient-text">
                {t("hero_headline")}
              </h1>
            </FadeIn>
          </div>

          {/* Right col: Intro paragraphs + pill chips */}
          <div className="lg:col-span-7 lg:pt-4">
            <FadeIn delay={0.15}>
              <div className="space-y-4 mb-10">
                <p className="text-lg text-text-muted leading-relaxed">
                  {t("hero_intro_1")}
                </p>
                <p className="text-lg text-text-muted leading-relaxed">
                  {t("hero_intro_2")}
                </p>
              </div>

              {/* Law pill chips */}
              <div className="flex flex-wrap gap-3">
                {(["kwg", "vag", "estg"] as const).map((key) => (
                  <span
                    key={key}
                    className="inline-flex items-center px-4 py-1.5 rounded-full bg-bordeaux-900/5 border border-bordeaux-900/10 text-sm font-medium text-accent"
                  >
                    {t(`hero_chip_${key}`)}
                  </span>
                ))}
              </div>
            </FadeIn>
          </div>

        </div>
      </Container>
    </section>
  );
}
