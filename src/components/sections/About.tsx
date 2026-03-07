"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SlideReveal } from "@/components/animations/SlideReveal";
import { FadeIn } from "@/components/animations/FadeIn";
import { CountUp } from "@/components/animations/CountUp";
import { QuoteBlock } from "@/components/ui/QuoteBlock";
import { Link } from "@/i18n/navigation";

const STATS = [
  { key: "stat_1_label", value: 5 },
  { key: "stat_2_label", value: 4 },
  { key: "stat_3_label", value: 3 },
] as const;

export function About() {
  const t = useTranslations("about");
  const tMember = useTranslations();

  return (
    <section id="about" className="bg-white">
      {/* === Zone 1: Narrative Intro === */}
      <div className="py-20 sm:py-32 lg:py-40">
        <Container size="lg">
          {/* Top decorative line */}
          <FadeIn>
            <div className="w-full h-px bg-linear-to-r from-transparent via-beige-400/40 to-transparent mb-20 sm:mb-24" />
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

                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight gradient-text text-balance">
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
          className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-beige-400/40 to-transparent"
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
                    className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-bordeaux-900 tracking-tight"
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
          className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-beige-400/40 to-transparent"
        />
      </div>

      {/* === Zone 3: Quote === */}
      <div className="py-24 sm:py-32">
        <Container size="md">
          <FadeIn>
            {/* Gradient frame */}
            <Link
              href="/team/peter-fiegler"
              aria-label={t("profile_link")}
              className="group mx-auto block max-w-4xl rounded-2xl p-px bg-linear-to-r from-beige-400/30 via-bordeaux-500/40 to-beige-400/30 shadow-[0_4px_24px_-8px_rgba(98,25,28,0.06)] transition-shadow duration-300 hover:shadow-[0_4px_20px_-6px_rgba(98,25,28,0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux-900 focus-visible:ring-offset-2"
            >
              <div className="relative">
                <QuoteBlock
                  quote={t("quote")}
                  attribution={t("quote_attribution")}
                  imageSrc="/team/peter-fiegler.webp"
                  imageAlt="Peter Fiegler"
                />
                <svg
                  aria-hidden="true"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute top-1/2 end-5 -translate-y-1/2 sm:end-5 lg:end-6 text-bordeaux-900/40 transition-all duration-300 group-hover:text-bordeaux-900 group-hover:translate-x-0.5 rtl:rotate-180"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            </Link>

            {/* Team member cards */}
            <div className="mx-auto max-w-4xl mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {[
                {
                  slug: "rene-marquard" as const,
                  translationKey: "team_rene_marquard",
                  name: "René Marquard",
                  imageSrc: "/team/rene-marquard.webp",
                },
                {
                  slug: "andre-zimmermann" as const,
                  translationKey: "team_andre_zimmermann",
                  name: "Andre Zimmermann",
                  imageSrc: "/team/andre-zimmermann.webp",
                },
              ].map((member) => (
                <Link
                  key={member.slug}
                  href={`/team/${member.slug}`}
                  className="group relative flex items-center gap-4 rounded-xl p-px bg-linear-to-r from-beige-400/20 via-bordeaux-500/25 to-beige-400/20 shadow-[0_2px_12px_-4px_rgba(98,25,28,0.04)] transition-shadow duration-300 hover:shadow-[0_4px_20px_-6px_rgba(98,25,28,0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux-900 focus-visible:ring-offset-2"
                >
                  <div className="flex w-full items-center gap-4 rounded-xl bg-beige-50/80 px-5 py-4 sm:px-6 sm:py-5">
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-full ring-1 ring-bordeaux-900/10 ring-offset-1 ring-offset-beige-50 sm:size-16">
                      <Image
                        src={member.imageSrc}
                        alt={member.name}
                        width={64}
                        height={64}
                        className="size-full object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-sm font-medium text-text-primary sm:text-base">
                        {member.name}
                      </p>
                      <p className="text-xs text-text-muted sm:text-sm">
                        {tMember(`${member.translationKey}.hero_role`)}
                      </p>
                    </div>
                    <svg
                      aria-hidden="true"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0 text-bordeaux-900/40 transition-all duration-300 group-hover:text-bordeaux-900 group-hover:translate-x-0.5 rtl:rotate-180"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </FadeIn>
        </Container>
      </div>

      {/* Bottom decorative line */}
      <Container size="lg">
        <FadeIn delay={0.3}>
          <div className="w-full h-px bg-linear-to-r from-transparent via-beige-400/40 to-transparent" />
        </FadeIn>
      </Container>
    </section>
  );
}
