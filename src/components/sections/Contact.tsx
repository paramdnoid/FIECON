"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { FadeIn } from "@/components/animations/FadeIn";
import { CONTACT } from "@/lib/constants";

export function Contact() {
  const t = useTranslations("contact");
  const prefersReduced = useReducedMotion();

  return (
    <section id="contact" className="py-24 sm:py-32 bg-bordeaux-900 text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-bordeaux-700/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        {/* Fine decorative line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-white/10 to-transparent" />
      </div>

      {/* Scale-up reveal wrapper */}
      <motion.div
        {...(!prefersReduced && {
          initial: { opacity: 0, scale: 0.96 },
          whileInView: { opacity: 1, scale: 1 },
          viewport: { once: true, margin: "-80px" },
          transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
        })}
      >
        <Container size="md" className="relative z-10">
          <FadeIn>
            <div className="text-center mb-16">
              <span className="inline-block text-sm font-medium tracking-[0.3em] uppercase text-beige-400 mb-4">
                {t("badge")}
              </span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight mb-6 text-white text-balance">
                {t("headline")}
              </h2>
              <p className="text-lg sm:text-xl text-beige-400 max-w-xl mx-auto leading-relaxed text-balance">
                {t("subtitle")}
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto mb-12">
              {/* Phone */}
              <div className="text-center sm:text-left">
                <p className="text-xs font-medium tracking-wider uppercase text-beige-400/60 mb-2">
                  {t("phone")}
                </p>
                <a
                  href={`tel:${CONTACT.phone.replace(/[\s()-]/g, "")}`}
                  className="text-lg text-white hover:text-beige-200 transition-colors duration-300"
                >
                  {CONTACT.phone}
                </a>
              </div>

              {/* Mobile */}
              <div className="text-center sm:text-left">
                <p className="text-xs font-medium tracking-wider uppercase text-beige-400/60 mb-2">
                  {t("mobile")}
                </p>
                <a
                  href={`tel:${CONTACT.mobile.replace(/[\s()-]/g, "")}`}
                  className="text-lg text-white hover:text-beige-200 transition-colors duration-300"
                >
                  {CONTACT.mobile}
                </a>
              </div>

              {/* Email */}
              <div className="text-center sm:text-left">
                <p className="text-xs font-medium tracking-wider uppercase text-beige-400/60 mb-2">
                  {t("email")}
                </p>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="text-lg text-white hover:text-beige-200 transition-colors duration-300 break-all"
                >
                  {CONTACT.email}
                </a>
              </div>

              {/* Address */}
              <div className="text-center sm:text-left">
                <p className="text-xs font-medium tracking-wider uppercase text-beige-400/60 mb-2">
                  {t("address")}
                </p>
                <p className="text-lg text-white">
                  {CONTACT.address.street}
                  <br />
                  {CONTACT.address.zip} {CONTACT.address.city}
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="text-center">
              <MagneticButton strength={0.15}>
                <Button
                  variant="inverse"
                  size="lg"
                  href={`mailto:${CONTACT.email}`}
                >
                  {t("cta")}
                </Button>
              </MagneticButton>
            </div>
          </FadeIn>
        </Container>
      </motion.div>
    </section>
  );
}
