"use client";

import { useTranslations } from "next-intl";
import { FadeIn, MagneticButton } from "@/components/animations";
import { Link } from "@/i18n/navigation";
import { useContactDialog } from "@/hooks/useContactDialog";
import { GESETZE_DOCS_LAWS } from "./gesetze-docs.config";
import { GesetzDocArticle } from "./GesetzDocArticle";

export function GesetzeDocsContent() {
  const t = useTranslations("gesetze_page");
  const { openDialog, dialogNode } = useContactDialog();

  return (
    <div>
      {/* Law articles */}
      <div className="space-y-6 sm:space-y-8">
        {GESETZE_DOCS_LAWS.map((law) => (
          <GesetzDocArticle key={law.id} lawKey={law.id} index={law.index} />
        ))}
      </div>

      {/* CTA */}
      <section
        id="contact"
        tabIndex={-1}
        aria-labelledby="gesetze-contact-title"
        className="scroll-mt-28 mt-10 sm:mt-12 outline-hidden focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-4"
      >
        <FadeIn>
          <div className="relative overflow-hidden rounded-2xl bg-bordeaux-900 px-8 py-14 text-center shadow-xl sm:px-12 sm:py-20">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-display text-[16rem] leading-none text-white opacity-[0.03] sm:text-[22rem]"
            >
              §
            </span>
            <div
              aria-hidden="true"
              className="absolute top-0 left-1/2 h-24 w-px -translate-x-1/2 bg-linear-to-b from-white/10 to-transparent"
            />

            <span className="mb-4 inline-block text-sm font-medium uppercase tracking-[0.4em] text-beige-400">
              FIECON
            </span>
            <h2
              id="gesetze-contact-title"
              className="mx-auto max-w-lg font-display text-3xl font-light tracking-tight text-white text-balance sm:text-4xl lg:text-5xl"
            >
              {t("cta_headline")}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-beige-400 text-balance sm:text-lg">
              {t("cta_subline")}
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <MagneticButton>
                <button
                  type="button"
                  onClick={openDialog}
                  className="inline-flex items-center rounded-lg bg-white px-8 py-4 font-medium text-bordeaux-900 transition-colors duration-300 hover:bg-beige-50"
                >
                  {t("cta_button")}
                </button>
              </MagneticButton>

              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3 text-sm font-medium text-white/80 transition-all duration-300 hover:border-white hover:text-white"
              >
                {t("cta_back")}
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>

      {dialogNode}
    </div>
  );
}
