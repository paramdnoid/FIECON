"use client";

import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { NAV_LINKS } from "@/lib/constants";
import { LanguageSwitcher } from "./LanguageSwitcher";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function MobileMenu({ isOpen, onClose }: Props) {
  const t = useTranslations("nav");

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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-20 left-4 right-4 bg-white rounded-2xl shadow-2xl border border-border-subtle z-50 lg:hidden p-6"
          >
            <nav className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={onClose}
                  className="px-4 py-3 text-lg font-medium text-text-primary hover:text-bordeaux-900 hover:bg-beige-100 rounded-lg transition-colors"
                >
                  {t(link.id)}
                </a>
              ))}
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
