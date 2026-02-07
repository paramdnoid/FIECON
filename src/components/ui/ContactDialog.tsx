"use client";

import {
  useState,
  useEffect,
  useRef,
  type FormEvent,
} from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { CONTACT, COMPANY, LOGO_PATHS, EASE_OUT_EXPO } from "@/lib/constants";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { FormField } from "./FormField";
import { CloseButton } from "./CloseButton";
import { Spinner } from "./Spinner";

type Props = {
  open: boolean;
  onClose: () => void;
};

type FormState = "idle" | "sending" | "success" | "error";

type FieldErrors = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};


export function ContactDialog({ open, onClose }: Props) {
  const t = useTranslations("contact.dialog");
  const tContact = useTranslations("contact");
  const prefersReduced = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const trapRef = useFocusTrap(open);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const [formState, setFormState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Focus first input on open
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => firstInputRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  function validate(): FieldErrors {
    const errs: FieldErrors = {};
    if (!form.name.trim()) errs.name = t("required");
    if (!form.email.trim()) {
      errs.email = t("required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = t("invalid_email");
    }
    if (!form.subject.trim()) errs.subject = t("required");
    if (!form.message.trim()) errs.message = t("required");
    return errs;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setFormState("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Request failed");

      setFormState("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setFormState("error");
    }
  }

  function handleClose() {
    onClose();
    setTimeout(() => {
      setFormState("idle");
      setErrors({});
    }, 300);
  }

  const motionProps = prefersReduced
    ? {}
    : {
        initial: { opacity: 0, scale: 0.96, y: 24 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.96, y: 24 },
        transition: { duration: 0.4, ease: EASE_OUT_EXPO },
      };

  const backdropMotion = prefersReduced
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.3 },
      };

  return (
    <AnimatePresence>
      {open && (
        <div ref={trapRef} className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            {...backdropMotion}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Dialog */}
          <motion.div
            {...motionProps}
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={t("title")}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white rounded-2xl shadow-2xl shadow-bordeaux-900/25 flex flex-col lg:flex-row"
          >
            {/* Left panel — branding & contact info */}
            <div className="hidden lg:flex lg:w-[380px] flex-col justify-between text-white p-10 relative overflow-hidden bg-bordeaux-900">
              {/* Decorative circles with logo watermark */}
              <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-bordeaux-700/20 flex items-center justify-center">
                <svg
                  viewBox="0 0 1536 1536"
                  className="w-40 h-40 -translate-x-4 -translate-y-4 opacity-[0.08]"
                  fill="white"
                >
                  {LOGO_PATHS.map((d, i) => (
                    <path key={i} d={d} />
                  ))}
                </svg>
              </div>
              <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/5" />

              <div className="relative z-10 space-y-6">
                <div className="w-10 h-1 bg-beige-400 rounded-full" />
                <div>
                  <h2 className="font-display text-4xl font-light leading-tight mb-3">
                    {t("title")}
                  </h2>
                  <p className="text-beige-200/70 text-sm leading-relaxed">
                    {t("panel_subtitle")}
                  </p>
                </div>
              </div>

              <div className="relative z-10 space-y-6 text-sm">
                <div>
                  <p className="text-beige-400/50 text-xs font-medium tracking-[0.2em] uppercase mb-1.5">
                    {tContact("email")}
                  </p>
                  <p className="text-beige-100 break-all">{CONTACT.email}</p>
                </div>
                <div>
                  <p className="text-beige-400/50 text-xs font-medium tracking-[0.2em] uppercase mb-1.5">
                    {tContact("phone")}
                  </p>
                  <p className="text-beige-100">{CONTACT.phone}</p>
                </div>
                <div>
                  <p className="text-beige-400/50 text-xs font-medium tracking-[0.2em] uppercase mb-1.5">
                    {tContact("address")}
                  </p>
                  <p className="text-beige-100 leading-relaxed">
                    {CONTACT.address.street}
                    <br />
                    {CONTACT.address.zip} {CONTACT.address.city}
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <div className="w-2 h-2 rotate-45 bg-beige-400/30" />
                  <p className="text-beige-400/30 text-xs">
                    {COMPANY.fullName}
                  </p>
                </div>
              </div>
            </div>

            {/* Right panel — form */}
            <div className="flex-1 overflow-y-auto max-h-[90vh]">
              {/* Header */}
              <div className="flex items-center justify-between p-6 lg:p-8 lg:hidden">
                <h2 className="font-display text-2xl sm:text-3xl font-light text-text-primary">
                  {t("title")}
                </h2>
                <CloseButton onClick={handleClose} label={t("close")} />
              </div>

              {/* Close button for desktop */}
              <div className="hidden lg:flex justify-end p-6 pb-0">
                <CloseButton onClick={handleClose} label={t("close")} />
              </div>

              {/* Screen reader status announcements */}
              <div aria-live="polite" aria-atomic="true" className="sr-only">
                {formState === "sending" && t("sending")}
                {formState === "success" && t("success_title")}
                {formState === "error" && t("error_title")}
              </div>

              {/* Content */}
              <div className="p-6 lg:p-8 lg:pt-4">
                {formState === "success" ? (
                  <SuccessView t={t} onClose={handleClose} />
                ) : formState === "error" ? (
                  <ErrorView t={t} onRetry={() => setFormState("idle")} />
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    {/* Name + Email row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <FormField
                        id="contact-name"
                        label={t("name")}
                        placeholder={t("name_placeholder")}
                        value={form.name}
                        error={errors.name}
                        ref={firstInputRef}
                        onChange={(v) =>
                          setForm((f) => ({ ...f, name: v }))
                        }
                      />
                      <FormField
                        id="contact-email"
                        label={t("email")}
                        type="email"
                        placeholder={t("email_placeholder")}
                        value={form.email}
                        error={errors.email}
                        onChange={(v) =>
                          setForm((f) => ({ ...f, email: v }))
                        }
                      />
                    </div>

                    <FormField
                      id="contact-subject"
                      label={t("subject")}
                      placeholder={t("subject_placeholder")}
                      value={form.subject}
                      error={errors.subject}
                      onChange={(v) =>
                        setForm((f) => ({ ...f, subject: v }))
                      }
                    />

                    <FormField
                      id="contact-message"
                      label={t("message")}
                      placeholder={t("message_placeholder")}
                      value={form.message}
                      error={errors.message}
                      multiline
                      onChange={(v) =>
                        setForm((f) => ({ ...f, message: v }))
                      }
                    />

                    <button
                      type="submit"
                      disabled={formState === "sending"}
                      className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-base font-medium rounded-xl bg-bordeaux-900 text-white hover:bg-bordeaux-700 shadow-lg shadow-bordeaux-900/15 hover:shadow-xl hover:shadow-bordeaux-900/20 transition-all duration-400 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {formState === "sending" ? (
                        <>
                          <Spinner />
                          {t("sending")}
                        </>
                      ) : (
                        <>
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M22 2L11 13" />
                            <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                          </svg>
                          {t("submit")}
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ---------- Dialog-specific sub-views ---------- */

function SuccessView({
  t,
  onClose,
}: {
  t: (key: string) => string;
  onClose: () => void;
}) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-20 h-20 rounded-full bg-bordeaux-900/5 flex items-center justify-center mb-8">
        <div className="w-14 h-14 rounded-full bg-bordeaux-900/10 flex items-center justify-center">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-bordeaux-900"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
      </div>
      <h3 className="font-display text-3xl font-light text-text-primary mb-3">
        {t("success_title")}
      </h3>
      <p className="text-text-muted max-w-xs mx-auto mb-10 leading-relaxed">
        {t("success_text")}
      </p>
      <button
        type="button"
        onClick={onClose}
        className="px-8 py-3 rounded-xl border border-bordeaux-900 text-bordeaux-900 hover:bg-bordeaux-900 hover:text-white transition-all duration-400 font-medium cursor-pointer"
      >
        {t("close")}
      </button>
    </div>
  );
}

function ErrorView({
  t,
  onRetry,
}: {
  t: (key: string) => string;
  onRetry: () => void;
}) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-8">
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-red-600"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M15 9l-6 6M9 9l6 6" />
          </svg>
        </div>
      </div>
      <h3 className="font-display text-3xl font-light text-text-primary mb-3">
        {t("error_title")}
      </h3>
      <p className="text-text-muted max-w-xs mx-auto mb-10 leading-relaxed">
        {t("error_text")}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="px-8 py-3 rounded-xl bg-bordeaux-900 text-white hover:bg-bordeaux-700 transition-all duration-400 font-medium cursor-pointer"
      >
        {t("retry")}
      </button>
    </div>
  );
}
