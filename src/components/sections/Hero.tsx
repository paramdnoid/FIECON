"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { TextReveal } from "@/components/animations/TextReveal";
import { SlideReveal } from "@/components/animations/SlideReveal";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { LOGO_PATHS, EASE_OUT_EXPO } from "@/lib/constants";

export function Hero() {
  const t = useTranslations("hero");
  const prefersReduced = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  // After entrance animations complete (~1.5s), lock in the visible state
  // so hash-navigation re-renders never flash the hidden initial state.
  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const logoY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const logoScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  return (
    <section ref={heroRef} className="relative min-h-svh flex items-center overflow-hidden">
      {/* Background decorative layers */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Layer 1: Radial spotlight gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(224,207,194,0.15) 0%, transparent 70%)",
          }}
        />

        {/* Layer 2: Beige blob top-right (existing) */}
        <div className="absolute -top-32 -right-32 w-150 h-150 bg-beige-200/20 rounded-full blur-3xl" />

        {/* Layer 3: Bordeaux blob bottom-left (new) */}
        <div className="absolute -bottom-48 -left-40 w-120 h-120 bg-bordeaux-500/6 rounded-full blur-3xl" />

        {/* Layer 4: Logo watermark */}
        <motion.svg
          viewBox="0 0 1536 1536"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-160 h-160 sm:w-200 sm:h-200 lg:w-240 lg:h-240"
          style={!prefersReduced ? { y: logoY, scale: logoScale } : undefined}
          {...(!prefersReduced && {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            transition: {
              duration: 2.5,
              delay: 0.3,
              ease: EASE_OUT_EXPO,
            },
          })}
        >
          <g fill="#62191C" fillOpacity={0.03} stroke="none">
            {LOGO_PATHS.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
        </motion.svg>

        {/* Layer 5: Diagonal accent lines */}
        <motion.div
          className="absolute top-[15%] left-[10%] w-px h-32 bg-linear-to-b from-bordeaux-900/6 to-transparent origin-top rotate-25"
          {...(!prefersReduced && {
            initial: { scaleY: 0, opacity: 0 },
            animate: { scaleY: 1, opacity: 1 },
            transition: { duration: 1.8, delay: 1.0, ease: EASE_OUT_EXPO },
          })}
        />
        <motion.div
          className="absolute bottom-[20%] right-[12%] w-px h-24 bg-linear-to-t from-accent/8 to-transparent origin-bottom -rotate-20"
          {...(!prefersReduced && {
            initial: { scaleY: 0, opacity: 0 },
            animate: { scaleY: 1, opacity: 1 },
            transition: { duration: 1.8, delay: 1.2, ease: EASE_OUT_EXPO },
          })}
        />

        {/* Layer 6: Vertical line (enhanced) */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-px bg-linear-to-b from-accent/15 via-accent/5 to-transparent"
          {...(!prefersReduced && {
            initial: { height: 0 },
            animate: { height: "35%" },
            transition: { duration: 1.5, delay: 0.5, ease: EASE_OUT_EXPO },
          })}
        />

        {/* Layer 7: Diamond at line terminus */}
        <motion.div
          className="absolute top-[35%] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rotate-45 bg-accent/20"
          {...(!prefersReduced && {
            initial: { opacity: 0, scale: 0 },
            animate: { opacity: 1, scale: 1 },
            transition: { duration: 0.4, delay: 2.0, ease: EASE_OUT_EXPO },
          })}
        />

        {/* Layer 8: Floating ambient dots */}
        <motion.div
          className="absolute top-[30%] left-[8%] w-1 h-1 rounded-full bg-accent/20"
          {...(!prefersReduced && {
            animate: {
              y: [0, -15, 0],
              opacity: [0.15, 0.3, 0.15],
            },
            transition: {
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            },
          })}
        />
        <motion.div
          className="absolute top-[55%] right-[15%] w-1.5 h-1.5 rounded-full bg-bordeaux-900/10"
          {...(!prefersReduced && {
            animate: {
              y: [0, 12, 0],
              opacity: [0.1, 0.2, 0.1],
            },
            transition: {
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2.0,
            },
          })}
        />
      </div>

      <Container size="lg" className="relative z-10 pt-32 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Tagline with decorative lines */}
          <motion.div
            {...(!prefersReduced && (hasAnimated
              ? { initial: false, animate: { opacity: 1 } }
              : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.8, delay: 0.2 } }
            ))}
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
              animateOnMount
              className="font-display font-light tracking-tight text-8xl sm:text-9xl lg:text-[11rem] gradient-text-hero leading-none"
            >
              FIECON
            </TextReveal>
          </div>

          {/* Headline */}
          <SlideReveal direction="bottom" delay={0.6} animateOnMount className="mb-6">
            <p className="font-display text-2xl sm:text-3xl lg:text-4xl text-text-primary font-normal tracking-tight text-balance">
              {t("headline")}
            </p>
          </SlideReveal>

          {/* Subtitle */}
          <motion.p
            {...(!prefersReduced && (hasAnimated
              ? { initial: false, animate: { opacity: 1, y: 0 } }
              : { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: 0.8, ease: EASE_OUT_EXPO } }
            ))}
            className="text-lg sm:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed mb-12 text-balance"
          >
            {t("subtitle")}
          </motion.p>

          {/* CTAs */}
          <motion.div
            {...(!prefersReduced && (hasAnimated
              ? { initial: false, animate: { opacity: 1, y: 0 } }
              : { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 1.0 } }
            ))}
            className="flex flex-col sm:flex-row gap-4 justify-center"
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
      </Container>

      {/* Scroll indicator */}
      <motion.div
        {...(!prefersReduced && (hasAnimated
          ? { initial: false, animate: { opacity: 1 } }
          : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.6, delay: 1.4 } }
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
    </section>
  );
}
