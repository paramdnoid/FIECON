"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="pt-32 pb-24 min-h-[60vh] flex items-center">
      <div className="mx-auto max-w-3xl px-6 sm:px-8 lg:px-12">
        <h1 className="text-3xl sm:text-4xl font-display font-semibold tracking-tight text-text-primary mb-4">
          Ein Fehler ist aufgetreten
        </h1>
        <p className="text-lg text-text-muted mb-8">
          Bitte versuchen Sie es erneut oder kehren Sie zur Startseite zurueck.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 bg-bordeaux-900 text-white text-sm font-medium rounded-lg hover:bg-bordeaux-700 transition-colors cursor-pointer"
        >
          Erneut versuchen
        </button>
      </div>
    </section>
  );
}
