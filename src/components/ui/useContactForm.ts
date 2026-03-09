"use client";

import { useCallback, useState, type FormEvent } from "react";
import { EMAIL_REGEX } from "@/lib/utils";

export type FormState = "idle" | "sending" | "success" | "error";
export type ErrorKind = "network" | "timeout" | "rate_limit" | "server";

export type FieldErrors = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const EMPTY_FORM: ContactFormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

type UseContactFormArgs = {
  t: (key: string) => string;
};

export function useContactForm({ t }: UseContactFormArgs) {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorKind, setErrorKind] = useState<ErrorKind>("server");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [form, setForm] = useState<ContactFormData>(EMPTY_FORM);

  const setField = useCallback((field: keyof ContactFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const reset = useCallback(() => {
    setFormState("idle");
    setErrors({});
    setForm(EMPTY_FORM);
  }, []);

  const retry = useCallback(() => setFormState("idle"), []);

  const validate = useCallback((): FieldErrors => {
    const nextErrors: FieldErrors = {};
    if (!form.name.trim()) nextErrors.name = t("required");
    if (!form.email.trim()) {
      nextErrors.email = t("required");
    } else if (!EMAIL_REGEX.test(form.email)) {
      nextErrors.email = t("invalid_email");
    }
    if (!form.subject.trim()) nextErrors.subject = t("required");
    if (!form.message.trim()) nextErrors.message = t("required");
    return nextErrors;
  }, [form.email, form.message, form.name, form.subject, t]);

  const submit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      const nextErrors = validate();
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length > 0) return;

      setFormState("sending");
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15_000);

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
          signal: controller.signal,
        });

        if (!response.ok) {
          setErrorKind(response.status === 429 ? "rate_limit" : "server");
          setFormState("error");
          return;
        }

        setFormState("success");
        setForm(EMPTY_FORM);
      } catch (error) {
        setErrorKind(
          error instanceof DOMException && error.name === "AbortError"
            ? "timeout"
            : "network",
        );
        setFormState("error");
      } finally {
        clearTimeout(timeout);
      }
    },
    [form, validate],
  );

  return {
    errors,
    errorKind,
    form,
    formState,
    reset,
    retry,
    setField,
    submit,
  };
}
