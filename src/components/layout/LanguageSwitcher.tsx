"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { LOCALES, EASE_OUT_EXPO } from "@/lib/constants";
import { FLAGS } from "@/components/flags";
import { useFocusTrap } from "@/hooks/useFocusTrap";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("language");
  const [open, setOpen] = useState(false);
  const prefersReduced = useReducedMotion();
  const trapRef = useFocusTrap(open);
  const firstButtonRef = useRef<HTMLButtonElement>(null);

  const currentLocale = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];
  const CurrentFlag = FLAGS[currentLocale.flag];

  // Focus first button on open
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => firstButtonRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  const switchLocale = useCallback(
    (code: string) => {
      globalThis.document.cookie = `NEXT_LOCALE=${code};path=/;max-age=31536000;SameSite=Lax`;
      setOpen(false);
      router.push(`/${code}`);
    },
    [router],
  );

  const backdropMotion = prefersReduced
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.3 },
      };

  const modalMotion = prefersReduced
    ? {}
    : {
        initial: { opacity: 0, scale: 0.96, y: 24 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.96, y: 24 },
        transition: { duration: 0.4, ease: EASE_OUT_EXPO },
      };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-bordeaux-900 border border-border rounded-md hover:bg-beige-200/50 transition-colors cursor-pointer"
        aria-label={t("title")}
        aria-haspopup="dialog"
      >
        {CurrentFlag && (
          <CurrentFlag className="w-5 h-3.5 rounded-[2px] overflow-hidden" />
        )}
        <span className="uppercase tracking-wide text-xs">
          {currentLocale.code.split("-")[0]}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 5l3 3 3-3" />
        </svg>
      </button>

      {/* Language modal */}
      <AnimatePresence>
        {open && (
          <div
            ref={trapRef}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
          >
            {/* Backdrop */}
            <motion.div
              {...backdropMotion}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            {/* Modal */}
            <motion.div
              {...modalMotion}
              role="dialog"
              aria-modal="true"
              aria-label={t("title")}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl shadow-bordeaux-900/25 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 pb-4">
                <div>
                  <div className="w-10 h-1 bg-bordeaux-900 rounded-full mb-4" />
                  <h2 className="font-display text-2xl font-light text-text-primary">
                    {t("title")}
                  </h2>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center w-10 h-10 rounded-full text-text-muted hover:text-text-primary hover:bg-beige-100 transition-colors cursor-pointer"
                  aria-label={t("close")}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  >
                    <path d="M4 4l10 10M14 4L4 14" />
                  </svg>
                </button>
              </div>

              {/* Language grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 px-6 pb-6">
                {LOCALES.map((loc, i) => {
                  const isActive = loc.code === locale;
                  const Flag = FLAGS[loc.flag];
                  return (
                    <button
                      key={loc.code}
                      ref={i === 0 ? firstButtonRef : undefined}
                      onClick={() => switchLocale(loc.code)}
                      aria-current={isActive ? "true" : undefined}
                      className={`flex items-center gap-3 px-3.5 py-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "bg-beige-100 border-bordeaux-900/20 text-bordeaux-900"
                          : "border-transparent hover:bg-beige-50 text-text-primary hover:text-bordeaux-900"
                      }`}
                    >
                      {Flag && (
                        <Flag className="w-6 h-4 rounded-[2px] overflow-hidden shrink-0" />
                      )}
                      <span className="text-sm font-medium truncate">
                        {loc.nativeName}
                      </span>
                      {isActive && (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="shrink-0 ml-auto"
                          aria-hidden="true"
                        >
                          <path d="M11 4L5.5 10L3 7.5" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
