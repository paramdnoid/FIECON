"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";
import { MagneticButton, FadeIn } from "@/components/animations";
import { Container, Button } from "@/components/ui";
import { CONTACT, EASE_OUT_EXPO } from "@/lib/constants";
import { useContactDialog } from "@/hooks/useContactDialog";

const CONTACT_ITEMS = [
  {
    key: "phone" as const,
    icon: (
      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    getValue: () => CONTACT.phone,
    getHref: () => `tel:${CONTACT.phone.replace(/[\s()-]/g, "")}`,
  },
  {
    key: "mobile" as const,
    icon: (
      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
    getValue: () => CONTACT.mobile,
    getHref: () => `tel:${CONTACT.mobile.replace(/[\s()-]/g, "")}`,
  },
  {
    key: "email" as const,
    icon: (
      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    getValue: () => CONTACT.email,
    getHref: () => `mailto:${CONTACT.email}`,
  },
  {
    key: "address" as const,
    icon: (
      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    getValue: () => `${CONTACT.address.street}, ${CONTACT.address.zip} ${CONTACT.address.city}`,
    getHref: () => null as string | null,
  },
] as const;

export function Contact() {
  const t = useTranslations("contact");
  const prefersReduced = useReducedMotion();
  const { openDialog, dialogNode } = useContactDialog();

  return (
    <section id="contact" className="relative py-16 sm:py-24 lg:py-32 overflow-hidden bg-white">
      {/* Top gradient border */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-beige-400/40 to-transparent" />

      {/* Scale-up reveal wrapper */}
      <motion.div
        {...(!prefersReduced && {
          initial: { opacity: 0, scale: 0.97 },
          whileInView: { opacity: 1, scale: 1 },
          viewport: { once: true, margin: "-80px" },
          transition: { duration: 0.8, ease: EASE_OUT_EXPO },
        })}
      >
        <Container size="md" className="relative z-10">
          {/* Heading */}
          <FadeIn>
            <div className="text-center mb-8 sm:mb-10">
              <span className="inline-block text-sm font-medium tracking-[0.4em] uppercase text-accent mb-4">
                {t("badge")}
              </span>
              <h2 className="font-display italic text-3xl sm:text-4xl md:text-5xl font-light tracking-tight mb-4 gradient-text text-balance">
                {t("headline")}
              </h2>
              <p className="text-base sm:text-lg text-text-muted max-w-md mx-auto leading-relaxed text-balance">
                {t("subtitle")}
              </p>
            </div>
          </FadeIn>

          {/* Gradient divider */}
          <div aria-hidden="true" className="h-px bg-linear-to-r from-transparent via-beige-400/30 to-transparent mb-8 sm:mb-10" />

          {/* Contact row — inline, symmetric */}
          <FadeIn delay={0.15}>
            <div className="flex flex-col sm:flex-row items-stretch justify-center gap-px max-w-2xl mx-auto mb-10 rounded-xl overflow-hidden border border-beige-200/60">
              {CONTACT_ITEMS.map((item, i) => {
                const value = item.getValue();
                const href = item.getHref();
                const isLink = href !== null;

                const inner = (
                  <div className="group flex flex-col items-center justify-center text-center px-5 py-5 bg-beige-50 hover:bg-beige-100/80 transition-colors duration-300 h-full">
                    <div className="w-8 h-8 rounded-full bg-bordeaux-900/5 flex items-center justify-center mb-2.5 text-accent group-hover:bg-bordeaux-900/10 transition-colors duration-300">
                      {item.icon}
                    </div>
                    <p className="text-[9px] font-medium tracking-[0.25em] uppercase text-accent/50 mb-1.5">
                      {t(item.key)}
                    </p>
                    <p className="text-xs text-text-primary leading-relaxed">
                      {value}
                    </p>
                  </div>
                );

                return isLink ? (
                  <a key={item.key} href={href} className={`flex-1 min-w-0 ${i > 0 ? "border-t sm:border-t-0 sm:border-l border-beige-200/60" : ""}`}>
                    {inner}
                  </a>
                ) : (
                  <div key={item.key} className={`flex-1 min-w-0 ${i > 0 ? "border-t sm:border-t-0 sm:border-l border-beige-200/60" : ""}`}>
                    {inner}
                  </div>
                );
              })}
            </div>
          </FadeIn>

          {/* CTA */}
          <FadeIn delay={0.25} className="w-full">
            <div className="flex justify-center">
              <MagneticButton>
                <Button
                  variant="primary"
                  size="md"
                  onClick={openDialog}
                >
                  {t("cta")}
                </Button>
              </MagneticButton>
            </div>
          </FadeIn>
        </Container>
      </motion.div>

      {dialogNode}

      {/* Bottom gradient border */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-beige-400/40 to-transparent" />
    </section>
  );
}
