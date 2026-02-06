"use client";

import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { NAV_LINKS } from "@/lib/constants";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { LanguageSwitcher } from "./LanguageSwitcher";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function MobileMenu({ isOpen, onClose }: Props) {
  const t = useTranslations("nav");
  const activeSection = useActiveSection();
  const trapRef = useFocusTrap(isOpen);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
          <motion.div
            ref={trapRef}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-24 left-4 right-4 bg-white rounded-xl shadow-2xl border border-border-subtle z-50 lg:hidden p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
          >
            <nav className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.href;
                return (
                  <button
                    key={link.id}
                    onClick={() => {
                      document.getElementById(link.href)?.scrollIntoView({ behavior: "smooth" });
                      onClose();
                    }}
                    className={`px-4 py-3 text-left text-sm font-medium tracking-widest uppercase rounded-lg transition-colors duration-400 cursor-pointer ${
                      isActive
                        ? "text-bordeaux-900 bg-beige-100"
                        : "text-text-primary hover:text-bordeaux-900 hover:bg-beige-100"
                    }`}
                  >
                    {t(link.id)}
                  </button>
                );
              })}
            </nav>
            <div className="mt-4 pt-4 border-t border-border-subtle flex justify-center">
              <LanguageSwitcher />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
