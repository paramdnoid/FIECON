"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { EASE_OUT_EXPO, LOGO_PATHS } from "@/lib/constants";
import { Container } from "@/components/ui/Container";

type Props = {
  name: string;
  role: string;
  tagline: string;
  imageSrc: string;
  imageAlt: string;
  breadcrumbs: { label: string; href?: string }[];
};

export function TeamProfileHero({
  name,
  role,
  tagline,
  imageSrc,
  imageAlt,
  breadcrumbs,
}: Props) {
  const prefersReduced = useReducedMotion();

  const fadeUp = (delay: number) => {
    if (prefersReduced) return {};
    return {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.7, delay, ease: EASE_OUT_EXPO },
    };
  };

  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-linear-to-b from-beige-50 via-white to-white" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(98,25,28,0.03) 0%, transparent 70%)",
          }}
        />

        {/* Logo watermark */}
        <motion.svg
          viewBox="0 0 1536 1536"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] lg:w-[60vw] lg:h-[60vw] max-w-275 max-h-275"
          {...(!prefersReduced && {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            transition: { duration: 2.5, delay: 0, ease: EASE_OUT_EXPO },
          })}
        >
          <g fill="#62191C" fillOpacity={0.035} stroke="none">
            {LOGO_PATHS.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
        </motion.svg>

        {/* Decorative horizontal rules */}
        <motion.div
          className="absolute top-[20%] left-0 h-px bg-bordeaux-900/6 origin-left hidden lg:block"
          {...(!prefersReduced && {
            initial: { scaleX: 0 },
            animate: { scaleX: 1 },
            transition: { duration: 1.2, delay: 0.3, ease: EASE_OUT_EXPO },
          })}
          style={{ width: "8%" }}
        />
        <motion.div
          className="absolute bottom-[25%] right-0 h-px bg-bordeaux-900/6 origin-right hidden lg:block"
          {...(!prefersReduced && {
            initial: { scaleX: 0 },
            animate: { scaleX: 1 },
            transition: { duration: 1.2, delay: 0.5, ease: EASE_OUT_EXPO },
          })}
          style={{ width: "8%" }}
        />
      </div>

      <Container size="lg" className="relative z-10">
        {/* Breadcrumb */}
        <motion.nav
          {...fadeUp(0.1)}
          aria-label="Breadcrumb"
          className="mb-12 sm:mb-16"
        >
          <ol className="flex items-center gap-2 text-sm text-text-muted">
            {breadcrumbs.map((crumb, i) => (
              <li key={i} className="flex items-center gap-2">
                {i > 0 && (
                  <span aria-hidden="true" className="text-beige-400">
                    /
                  </span>
                )}
                {crumb.href ? (
                  <a
                    href={crumb.href}
                    className="hover:text-bordeaux-900 transition-colors duration-300"
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-text-primary font-medium">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </motion.nav>

        {/* Main hero content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Text content */}
          <div className="lg:col-span-7 xl:col-span-8">
            <motion.div {...fadeUp(0.2)}>
              <span className="inline-block text-sm font-medium tracking-[0.4em] uppercase text-accent mb-5">
                {role}
              </span>
              <div className="w-10 h-px bg-accent/40 mb-8" />
            </motion.div>

            <motion.h1
              {...fadeUp(0.35)}
              className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-light tracking-tight gradient-text mb-6"
            >
              {name}
            </motion.h1>

            <motion.p
              {...fadeUp(0.5)}
              className="text-lg sm:text-xl text-text-muted leading-relaxed max-w-2xl text-balance"
            >
              {tagline}
            </motion.p>
          </div>

          {/* Portrait */}
          <div className="lg:col-span-5 xl:col-span-4 flex justify-center lg:justify-end">
            <motion.div
              {...(!prefersReduced && {
                initial: { opacity: 0, scale: 0.95 },
                animate: { opacity: 1, scale: 1 },
                transition: { duration: 0.9, delay: 0.4, ease: EASE_OUT_EXPO },
              })}
              className="relative"
            >
              {/* Gradient border ring */}
              <div className="rounded-2xl p-px bg-linear-to-br from-beige-400/40 via-bordeaux-500/30 to-beige-400/40 shadow-xl shadow-bordeaux-900/8">
                <div className="relative w-64 h-80 sm:w-72 sm:h-88 lg:w-80 lg:h-96 rounded-2xl overflow-hidden bg-beige-100">
                  <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 256px, (max-width: 1024px) 288px, 320px"
                    priority
                  />
                </div>
              </div>
              {/* Corner accent dots */}
              <div
                className="absolute -bottom-3 -left-3 hidden items-center gap-1.5 sm:flex"
                aria-hidden="true"
              >
                <div className="w-1 h-1 rounded-full bg-bordeaux-900/15" />
                <div className="w-1.5 h-1.5 rounded-full bg-accent/25" />
                <div className="w-1 h-1 rounded-full bg-bordeaux-900/10" />
              </div>
            </motion.div>
          </div>
        </div>
      </Container>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 inset-x-0">
        <Container size="lg">
          <div className="h-px bg-linear-to-r from-transparent via-beige-400/40 to-transparent" />
        </Container>
      </div>
    </section>
  );
}
