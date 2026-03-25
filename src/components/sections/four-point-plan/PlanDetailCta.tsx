"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { Link } from "@/i18n/navigation";

type TranslateFn = (key: string) => string;

type Props = {
  t: TranslateFn;
  tDetail: TranslateFn;
};

export function PlanDetailCta({ t, tDetail }: Props) {
  return (
    <FadeIn delay={0.16}>
      <div className="mt-10 rounded-2xl border border-bordeaux-900/15 bg-linear-to-br from-bordeaux-900 to-bordeaux-700 p-6 text-white sm:p-7">
        <p className="text-[11px] uppercase tracking-[0.22em] text-beige-200">{t("badge")}</p>
        <p className="mt-2 font-display text-3xl italic leading-tight sm:text-4xl">
          {tDetail("cta_panel_title")}
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-beige-100/95 sm:text-base">
          {tDetail("cta_panel_text")}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/#contact"
            className="inline-flex items-center justify-center rounded-xl border border-transparent bg-white px-5 py-2.5 text-sm font-medium text-bordeaux-900 transition-all duration-300 hover:bg-beige-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:ring-offset-2 focus-visible:ring-offset-bordeaux-900"
          >
            {tDetail("cta_contact")}
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-white/55 bg-transparent px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:ring-offset-2 focus-visible:ring-offset-bordeaux-900"
          >
            {tDetail("cta_back_home")}
          </Link>
        </div>
      </div>
    </FadeIn>
  );
}
