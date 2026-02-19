"use client";

import { useState, lazy, Suspense } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { FadeIn } from "@/components/animations/FadeIn";
import { EASE_OUT_EXPO } from "@/lib/constants";

const ContactDialog = lazy(() =>
  import("@/components/ui/ContactDialog").then((m) => ({
    default: m.ContactDialog,
  }))
);

type Props = {
  headline: string;
  subline: string;
  ctaLabel: string;
};

export function TeamProfileCta({ headline, subline, ctaLabel }: Props) {
  const prefersReduced = useReducedMotion();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <section className="py-32 sm:py-40 relative overflow-hidden bg-bordeaux-900">
      {/* Decorative top line */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-linear-to-b from-white/10 to-transparent" />
      </div>

      <motion.div
        {...(!prefersReduced && {
          initial: { opacity: 0, scale: 0.96 },
          whileInView: { opacity: 1, scale: 1 },
          viewport: { once: true, margin: "-80px" },
          transition: { duration: 0.8, ease: EASE_OUT_EXPO },
        })}
      >
        <Container size="md" className="relative z-10">
          <FadeIn>
            <div className="text-center">
              <span className="inline-block text-sm font-medium tracking-[0.4em] uppercase text-beige-400 mb-4">
                FIECON
              </span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight mb-6 text-white text-balance">
                {headline}
              </h2>
              <p className="text-lg sm:text-xl text-beige-400 max-w-xl mx-auto leading-relaxed mb-12 text-balance">
                {subline}
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2} className="w-full">
            <div className="flex justify-center">
              <MagneticButton>
                <Button
                  variant="inverse"
                  size="lg"
                  onClick={() => setDialogOpen(true)}
                >
                  {ctaLabel}
                </Button>
              </MagneticButton>
            </div>
          </FadeIn>
        </Container>
      </motion.div>

      {dialogOpen && (
        <Suspense>
          <ContactDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
          />
        </Suspense>
      )}
    </section>
  );
}
