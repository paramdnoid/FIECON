"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { TextReveal } from "@/components/animations/TextReveal";
import { SlideReveal } from "@/components/animations/SlideReveal";
import { ParallaxLayer } from "@/components/animations/ParallaxLayer";
import { MagneticButton } from "@/components/animations/MagneticButton";

export function Hero() {
  const t = useTranslations("hero");
  const prefersReduced = useReducedMotion();

  return (
    <section className="relative min-h-svh flex items-center justify-center overflow-hidden">
      {/* Decorative background with parallax */}
      <div className="absolute inset-0 pointer-events-none">
        <ParallaxLayer speed={0.3} className="absolute inset-0">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-bordeaux-900/5 rounded-full blur-3xl" />
        </ParallaxLayer>
        <ParallaxLayer speed={0.5} className="absolute inset-0">
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-beige-400/20 rounded-full blur-3xl" />
        </ParallaxLayer>
        <ParallaxLayer speed={0.2} className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-beige-200/30 to-transparent rounded-full blur-3xl" />
        </ParallaxLayer>

        {/* Fine decorative vertical line */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-bordeaux-900/10 via-bordeaux-900/5 to-transparent"
          {...(!prefersReduced && {
            initial: { height: 0 },
            animate: { height: "30%" },
            transition: { duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
          })}
        />
      </div>

      <Container size="md" className="relative z-10 pt-24 pb-16">
        <div className="text-center">
          {/* Tagline with decorative lines */}
          <motion.div
            {...(!prefersReduced && {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { duration: 0.8, delay: 0.2 },
            })}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-accent" />
            <p className="text-sm font-medium tracking-[0.3em] uppercase text-accent">
              {t("tagline")}
            </p>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-accent" />
          </motion.div>

          {/* Main heading with TextReveal */}
          <div className="mb-4">
            <TextReveal
              as="h1"
              delay={0.4}
              staggerDelay={0.12}
              className="font-display font-bold tracking-tight text-7xl sm:text-8xl lg:text-9xl gradient-text-hero leading-none"
            >
              FIECON
            </TextReveal>
          </div>

          {/* Headline */}
          <SlideReveal direction="bottom" delay={0.7} className="mb-6">
            <p className="font-display text-2xl sm:text-3xl lg:text-4xl text-text-primary font-medium tracking-tight text-balance">
              {t("headline")}
            </p>
          </SlideReveal>

          {/* Subtitle */}
          <motion.p
            {...(!prefersReduced && {
              initial: { opacity: 0, y: 15 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.8, delay: 1.0, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
            })}
            className="text-lg sm:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed mb-12 text-balance"
          >
            {t("subtitle")}
          </motion.p>

          {/* CTAs with MagneticButton */}
          <motion.div
            {...(!prefersReduced && {
              initial: { opacity: 0, y: 15 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.6, delay: 1.2 },
            })}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <MagneticButton strength={0.15}>
              <Button variant="primary" size="lg" href="#services">
                {t("cta_primary")}
              </Button>
            </MagneticButton>
            <MagneticButton strength={0.15}>
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
          animate: { opacity: 1 },
          transition: { duration: 0.6, delay: 1.6 },
        })}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          {...(!prefersReduced && {
            animate: { y: [0, 6, 0], opacity: [0.4, 1, 0.4] },
            transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
          })}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
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
