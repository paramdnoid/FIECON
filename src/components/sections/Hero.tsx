"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { TextReveal } from "@/components/animations/TextReveal";
import { SlideReveal } from "@/components/animations/SlideReveal";
import { MagneticButton } from "@/components/animations/MagneticButton";

export function Hero() {
  const t = useTranslations("hero");
  const prefersReduced = useReducedMotion();

  return (
    <section className="relative min-h-svh flex items-center overflow-hidden">
      {/* Single subtle decorative gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-150 h-150 bg-beige-200/20 rounded-full blur-3xl" />

        {/* Fine decorative vertical line */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-px bg-linear-to-b from-accent/15 via-accent/5 to-transparent"
          {...(!prefersReduced && {
            initial: { height: 0 },
            animate: { height: "30%" },
            transition: { duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
          })}
        />
      </div>

      <Container size="lg" className="relative z-10 pt-32 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Tagline with decorative lines */}
          <motion.div
            {...(!prefersReduced && {
              initial: { opacity: 0 },
              whileInView: { opacity: 1 },
              viewport: { once: true },
              transition: { duration: 0.8, delay: 0.2 },
            })}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <div className="w-8 h-px bg-linear-to-r from-transparent to-accent" />
            <p className="text-sm font-medium tracking-[0.4em] uppercase text-accent">
              {t("tagline")}
            </p>
            <div className="w-8 h-px bg-linear-to-l from-transparent to-accent" />
          </motion.div>

          {/* Main heading with TextReveal */}
          <div className="mb-6">
            <TextReveal
              as="h1"
              delay={0.3}
              staggerDelay={0.1}
              className="font-display font-light tracking-tight text-8xl sm:text-9xl lg:text-[11rem] gradient-text-hero leading-none"
            >
              FIECON
            </TextReveal>
          </div>

          {/* Headline */}
          <SlideReveal direction="bottom" delay={0.6} className="mb-6">
            <p className="font-display text-2xl sm:text-3xl lg:text-4xl text-text-primary font-normal tracking-tight text-balance">
              {t("headline")}
            </p>
          </SlideReveal>

          {/* Subtitle */}
          <motion.p
            {...(!prefersReduced && {
              initial: { opacity: 0, y: 15 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
            })}
            className="text-lg sm:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed mb-12 text-balance"
          >
            {t("subtitle")}
          </motion.p>

          {/* CTAs */}
          <motion.div
            {...(!prefersReduced && {
              initial: { opacity: 0, y: 15 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.6, delay: 1.0 },
            })}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <MagneticButton>
              <Button variant="primary" size="lg" href="#services">
                {t("cta_primary")}
              </Button>
            </MagneticButton>
            <MagneticButton>
              <Button variant="secondary" size="lg" href="#contact">
                {t("cta_secondary")}
              </Button>
            </MagneticButton>
          </motion.div>
        </div>
      </Container>

      {/* Scroll indicator */}
      <motion.div
        {...(!prefersReduced && {
          initial: { opacity: 0 },
          whileInView: { opacity: 1 },
          viewport: { once: true },
          transition: { duration: 0.6, delay: 1.4 },
        })}
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
    </section>
  );
}
