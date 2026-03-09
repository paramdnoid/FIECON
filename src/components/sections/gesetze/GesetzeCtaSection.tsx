"use client";

import { useState, lazy, Suspense } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { FadeIn } from "@/components/animations/FadeIn";
import { Link } from "@/i18n/navigation";
import { EASE_OUT_EXPO } from "@/lib/constants";

const ContactDialog = lazy(() =>
  import("@/components/ui/ContactDialog").then((m) => ({
    default: m.ContactDialog,
  }))
);

export function GesetzeCtaSection() {
  const t = useTranslations("gesetze_page");
  const prefersReduced = useReducedMotion();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <section className="bg-bordeaux-900 text-white py-20 sm:py-28 relative overflow-hidden">
      {/* Decorative top line */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-linear-to-b from-white/10 to-transparent" />
      </div>

      {/* § watermark */}
      <span
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[20rem] sm:text-[28rem] font-light text-white opacity-[0.03] select-none pointer-events-none leading-none"
      >
        §
      </span>

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
                {t("cta_headline")}
              </h2>
              <p className="text-lg sm:text-xl text-beige-400 max-w-xl mx-auto leading-relaxed mb-12 text-balance">
                {t("cta_subline")}
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2} className="w-full">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <MagneticButton>
                <button
                  type="button"
                  onClick={() => setDialogOpen(true)}
                  className="inline-flex items-center px-8 py-4 bg-white text-bordeaux-900 rounded-lg font-medium hover:bg-beige-50 transition-colors duration-300"
                >
                  {t("cta_button")}
                </button>
              </MagneticButton>

              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/30 text-white/80 hover:border-white hover:text-white transition-all duration-300 text-sm font-medium"
              >
                {t("cta_back")}
              </Link>
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
