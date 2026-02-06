"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { FadeIn } from "@/components/animations/FadeIn";
import { ContactDialog } from "@/components/ui/ContactDialog";
import { CONTACT } from "@/lib/constants";

export function Contact() {
  const t = useTranslations("contact");
  const prefersReduced = useReducedMotion();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <section id="contact" className="py-32 sm:py-40 relative overflow-hidden" style={{ backgroundColor: '#62191C' }}>
      {/* Minimal decorative line */}
      <div className="absolute inset-0 pointer-events-none">
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
              <span className="inline-block text-sm font-medium tracking-[0.4em] uppercase text-beige-400 mb-4">
                {t("badge")}
              </span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight mb-6 text-white text-balance">
                {t("headline")}
              </h2>
              <p className="text-lg sm:text-xl text-beige-400 max-w-xl mx-auto leading-relaxed text-balance">
                {t("subtitle")}
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 max-w-2xl mx-auto mb-12">
              {/* Phone */}
              <div className="text-left">
                <p className="text-xs font-medium tracking-[0.3em] uppercase text-beige-400/60 mb-2">
                  {t("phone")}
                </p>
                <a
                  href={`tel:${CONTACT.phone.replace(/[\s()-]/g, "")}`}
                  className="text-lg text-white hover:text-beige-200 transition-colors duration-400"
                >
                  {CONTACT.phone}
                </a>
              </div>

              {/* Mobile */}
              <div className="text-left sm:text-right">
                <p className="text-xs font-medium tracking-[0.3em] uppercase text-beige-400/60 mb-2">
                  {t("mobile")}
                </p>
                <a
                  href={`tel:${CONTACT.mobile.replace(/[\s()-]/g, "")}`}
                  className="text-lg text-white hover:text-beige-200 transition-colors duration-400"
                >
                  {CONTACT.mobile}
                </a>
              </div>

              {/* Email */}
              <div className="text-left">
                <p className="text-xs font-medium tracking-[0.3em] uppercase text-beige-400/60 mb-2">
                  {t("email")}
                </p>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="text-lg text-white hover:text-beige-200 transition-colors duration-400 break-all"
                >
                  {CONTACT.email}
                </a>
              </div>

              {/* Address */}
              <div className="text-left sm:text-right">
                <p className="text-xs font-medium tracking-[0.3em] uppercase text-beige-400/60 mb-2">
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

          <FadeIn delay={0.3} className="w-full">
            <div className="flex justify-center">
              <MagneticButton>
                <Button
                  variant="inverse"
                  size="lg"
                  onClick={() => setDialogOpen(true)}
                >
                  {t("cta")}
                </Button>
              </MagneticButton>
            </div>
          </FadeIn>
        </Container>
      </motion.div>

      <ContactDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </section>
  );
}
