"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Button } from "@/components/ui/Button";
import { SlideReveal } from "@/components/animations/SlideReveal";
import { MagneticButton } from "@/components/animations/MagneticButton";
import {
  LOGO_PATHS,
  EASE_OUT_EXPO,
  HERO_LETTERS,
  HERO_LETTER_COLORS,
  CALLIGRAPHIC_STROKE,
} from "@/lib/constants";

export function Hero() {
  const t = useTranslations("hero");
  const prefersReduced = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 2200);
    return () => clearTimeout(timer);
  }, []);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const logoY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const logoScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  const letterAnimation = (index: number) => {
    if (prefersReduced) return {};
    if (hasAnimated) return { initial: false, animate: { opacity: 1, y: 0 } };
    return {
      initial: { opacity: 0, y: 60 },
      animate: { opacity: 1, y: 0 },
      transition: {
        duration: 0.8,
        delay: 0.3 + index * 0.12,
        ease: EASE_OUT_EXPO,
      },
    };
  };

  const fadeAnimation = (delay: number) => {
    if (prefersReduced) return {};
    if (hasAnimated) return { initial: false, animate: { opacity: 1, y: 0 } };
    return {
      initial: { opacity: 0, y: 15 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6, delay, ease: EASE_OUT_EXPO },
    };
  };

  return (
    <section ref={heroRef} className="relative min-h-svh overflow-hidden">
      {/* === BACKGROUND LAYERS === */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Radial spotlight */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(224,207,194,0.15) 0%, transparent 70%)",
          }}
        />

        {/* Logo watermark with parallax */}
        <motion.svg
          viewBox="0 0 1536 1536"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-160 h-160 sm:w-200 sm:h-200 lg:w-240 lg:h-240"
          style={!prefersReduced ? { y: logoY, scale: logoScale } : undefined}
          {...(!prefersReduced && {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            transition: { duration: 2.5, delay: 0, ease: EASE_OUT_EXPO },
          })}
        >
          <g fill="#62191C" fillOpacity={0.04} stroke="none">
            {LOGO_PATHS.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
        </motion.svg>

        {/* Calligraphic flourish stroke */}
        <svg
          viewBox="0 0 1300 700"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] max-w-5xl h-auto"
          fill="none"
          preserveAspectRatio="xMidYMid meet"
        >
          <motion.path
            d={CALLIGRAPHIC_STROKE}
            stroke="#62191C"
            strokeOpacity={0.05}
            strokeWidth={1.5}
            strokeLinecap="round"
            fill="none"
            {...(!prefersReduced && !hasAnimated
              ? {
                  initial: { pathLength: 0, opacity: 0 },
                  animate: { pathLength: 1, opacity: 1 },
                  transition: { duration: 2.0, delay: 0.7, ease: EASE_OUT_EXPO },
                }
              : {})}
          />
        </svg>

        {/* Horizontal editorial rule — top left */}
        <motion.div
          className="absolute top-[15%] left-0 h-px bg-bordeaux-900/8 origin-left hidden lg:block"
          {...(!prefersReduced && {
            initial: hasAnimated ? false : { scaleX: 0 },
            animate: { scaleX: 1 },
            transition: { duration: 1.2, delay: 0.1, ease: EASE_OUT_EXPO },
          })}
          style={{ width: "12%" }}
        />

        {/* Horizontal editorial rule — bottom right */}
        <motion.div
          className="absolute bottom-[15%] right-0 h-px bg-bordeaux-900/8 origin-right hidden lg:block"
          {...(!prefersReduced && {
            initial: hasAnimated ? false : { scaleX: 0 },
            animate: { scaleX: 1 },
            transition: { duration: 1.2, delay: 0.3, ease: EASE_OUT_EXPO },
          })}
          style={{ width: "12%" }}
        />
      </div>

      {/* === MAIN CONTENT — centered vertical axis === */}
      <div className="relative z-10 min-h-svh flex flex-col items-center justify-center px-6 sm:px-8 lg:px-12">
        {/* Tagline */}
        <motion.div {...fadeAnimation(1.1)} className="mb-8 sm:mb-10">
          <div className="flex items-center gap-4">
            <div className="w-8 h-px bg-accent/60" />
            <p className="text-xs font-medium tracking-[0.4em] uppercase text-accent font-body">
              {t("tagline")}
            </p>
            <div className="w-8 h-px bg-accent/60" />
          </div>
        </motion.div>

        {/* FIECON — monumental lettering */}
        <div className="mb-8 sm:mb-10">
          <h1
            className="font-hero font-normal leading-none select-none text-center"
            style={{
              fontSize: "clamp(2.5rem, 8vw, 8rem)",
              letterSpacing: "-0.04em",
            }}
          >
            {HERO_LETTERS.map((letter, i) => {
              if (prefersReduced || hasAnimated) {
                return (
                  <span
                    key={i}
                    className="inline-block"
                    style={{ color: HERO_LETTER_COLORS[i] }}
                  >
                    {letter}
                  </span>
                );
              }
              return (
                <motion.span
                  key={i}
                  className="inline-block"
                  style={{ color: HERO_LETTER_COLORS[i] }}
                  {...letterAnimation(i)}
                >
                  {letter}
                </motion.span>
              );
            })}
          </h1>
        </div>

        {/* Headline */}
        <SlideReveal direction="bottom" delay={1.3} animateOnMount className="mb-5">
          <p className="font-display text-2xl sm:text-3xl lg:text-4xl text-text-primary font-normal tracking-tight text-center text-balance">
            {t("headline")}
          </p>
        </SlideReveal>

        {/* Subtitle */}
        <motion.p
          {...fadeAnimation(1.5)}
          className="text-base sm:text-lg text-text-muted leading-relaxed text-center max-w-xl mb-12 text-balance"
        >
          {t("subtitle")}
        </motion.p>

        {/* CTAs */}
        <motion.div
          {...fadeAnimation(1.7)}
          className="flex flex-col sm:flex-row gap-4"
        >
          <MagneticButton>
            <Button variant="primary" size="lg" href="services">
              {t("cta_primary")}
            </Button>
          </MagneticButton>
          <MagneticButton>
            <Button variant="secondary" size="lg" href="contact">
              {t("cta_secondary")}
            </Button>
          </MagneticButton>
        </motion.div>
      </div>

      {/* Scroll indicator — bottom center */}
      <motion.div
        {...(!prefersReduced && (hasAnimated
          ? { initial: false, animate: { opacity: 1 } }
          : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.6, delay: 1.9 } }
        ))}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          {...(!prefersReduced && {
            animate: { y: [0, 4, 0], opacity: [0.3, 0.7, 0.3] },
            transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          })}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-accent"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Corner filigree dots — bottom right */}
      <motion.div
        {...fadeAnimation(2.0)}
        className="absolute bottom-12 right-12 gap-2 items-center hidden lg:flex"
        aria-hidden="true"
      >
        <div className="w-1 h-1 rounded-full bg-accent/15" />
        <div className="w-1.5 h-1.5 rounded-full bg-accent/20" />
        <div className="w-1 h-1 rounded-full bg-accent/10" />
      </motion.div>
    </section>
  );
}
