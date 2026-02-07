"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="pt-32 pb-24 min-h-[60vh] flex items-center">
      <div className="mx-auto max-w-3xl px-6 sm:px-8 lg:px-12">
        <h1 className="text-3xl sm:text-4xl font-display font-semibold tracking-tight text-text-primary mb-4">
          {t("title")}
        </h1>
        <p className="text-lg text-text-muted mb-8">
          {t("description")}
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 bg-bordeaux-900 text-white text-sm font-medium rounded-lg hover:bg-bordeaux-700 transition-colors cursor-pointer"
        >
          {t("retry")}
        </button>
      </div>
    </section>
  );
}
