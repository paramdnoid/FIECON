"use client";

import { useRef } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { EASE_OUT_EXPO, COMPANY, getNavLinks } from "@/lib/constants";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useDialogBehavior } from "@/hooks/useDialogBehavior";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SectionNavLink } from "./SectionNavLink";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function MobileMenu({ isOpen, onClose }: Props) {
  const t = useTranslations("nav");
  const activeSection = useActiveSection();
  const locale = useLocale();
  const navLinks = getNavLinks(locale);
  const trapRef = useFocusTrap(isOpen);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useDialogBehavior(isOpen, onClose, closeButtonRef);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Fullscreen panel */}
          <motion.div
            ref={trapRef}
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
            className="fixed inset-0 bg-white z-50 lg:hidden flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label={t("navigation")}
          >
            {/* Header row — matches main header height */}
            <div className="relative z-20 flex items-center justify-between h-20 px-5 sm:px-8">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.svg"
                  alt={COMPANY.name}
                  width={36}
                  height={36}
                />
                <span className="font-display text-xl font-normal gradient-text-hero tracking-tight">
                  {COMPANY.name}
                </span>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                className="p-2.5 -mr-2.5 text-text-primary hover:text-bordeaux-900 transition-colors cursor-pointer"
                aria-label={t("close_menu")}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Divider */}
            <div className="relative z-10 mx-5 sm:mx-8 h-px bg-linear-to-r from-beige-400/40 via-beige-400/20 to-transparent" />

            {/* Navigation links */}
            <nav className="relative z-0 flex-1 flex flex-col justify-center px-5 sm:px-8 -mt-12">
              {navLinks.map((link, i) => {
                const isActive = activeSection === link.href;
                return (
                  <motion.div
                    key={link.id}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.1 + i * 0.06,
                      ease: EASE_OUT_EXPO,
                    }}
                  >
                    <SectionNavLink
                      link={link}
                      label={t(link.id)}
                      isActive={isActive}
                      variant="mobile"
                      onNavigate={onClose}
                    />
                  </motion.div>
                );
              })}
            </nav>

            {/* Footer area */}
            <div className="px-5 sm:px-8 pb-10">
              <div className="h-px bg-linear-to-r from-beige-400/40 via-beige-400/20 to-transparent mb-6" />
              <div className="flex items-center justify-between">
                <LanguageSwitcher />
                <span className="text-xs text-text-muted tracking-wide">
                  {COMPANY.fullName}
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
