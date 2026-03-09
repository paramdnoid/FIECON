"use client";

import { useTranslations } from "next-intl";
import { FadeIn } from "@/components/animations/FadeIn";
import { LAW_ICONS } from "../law-icons";
import type { LawKey } from "./gesetze-docs.config";

type Props = {
  lawKey: LawKey;
  index: number;
};

function getProvisionKeys(lawKey: LawKey, has: (key: string) => boolean) {
  const provisionKeys: string[] = [];

  for (let i = 0; ; i += 1) {
    const key = `${lawKey}_provision_${i}`;

    if (!has(key)) {
      break;
    }

    provisionKeys.push(key);
  }

  return provisionKeys;
}

export function GesetzDocArticle({ lawKey, index }: Props) {
  const t = useTranslations("gesetze_page");
  const provisionKeys = getProvisionKeys(lawKey, t.has);
  const decorativeNumber = String(index + 1).padStart(2, "0");

  return (
    <article
      id={lawKey}
      tabIndex={-1}
      aria-labelledby={`${lawKey}-title`}
      className="group/article scroll-mt-28 outline-hidden focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-4"
    >
      <FadeIn>
        <div
          className="relative overflow-hidden rounded-2xl bg-beige-50/70 px-6 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-4 top-6 hidden select-none font-display text-[10rem] font-light leading-none text-bordeaux-900 opacity-[0.025] xl:block"
          >
            {decorativeNumber}
          </span>

          {/* Header */}
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-bordeaux-900/5 text-accent ring-1 ring-bordeaux-900/10 transition-colors duration-400 group-hover/article:bg-bordeaux-900/8 sm:h-14 sm:w-14 sm:rounded-2xl">
              {LAW_ICONS[lawKey]}
            </div>
            <div className="min-w-0">
              <span className="inline-block text-xs font-semibold uppercase tracking-[0.4em] text-accent">
                {t(`${lawKey}_abbreviation`)}
              </span>
              <div aria-hidden="true" className="my-2.5 h-px w-10 bg-accent/40" />
              <h2
                id={`${lawKey}-title`}
                className="gradient-text font-display text-2xl font-light italic tracking-tight sm:text-3xl lg:text-4xl"
              >
                {t(`${lawKey}_name`)}
              </h2>
            </div>
          </div>

          {/* Body text */}
          <div className="mt-8 space-y-4">
            <p className="text-base leading-relaxed text-text-muted sm:text-lg">
              {t(`${lawKey}_intro`)}
            </p>
            <p className="text-base leading-relaxed text-text-muted sm:text-lg">
              {t(`${lawKey}_detail`)}
            </p>
          </div>

          {/* Provisions */}
          <div className="mt-10">
            <h3 className="mb-5 flex items-center gap-3 font-display text-lg text-text-primary sm:text-xl">
              <span
                aria-hidden="true"
                className="inline-block h-px w-8 bg-linear-to-r from-bordeaux-900/40 via-beige-400/50 to-transparent"
              />
              {t(`${lawKey}_provisions_headline`)}
            </h3>

            <div className="rounded-xl p-px bg-linear-to-r from-beige-400/20 via-bordeaux-500/25 to-beige-400/20">
              <ul className="overflow-hidden rounded-xl bg-white">
                {provisionKeys.map((key) => (
                  <li
                    key={key}
                    className="group/item flex items-baseline gap-3 border-b border-beige-200/60 px-4 py-3 transition-colors duration-300 last:border-b-0 hover:bg-beige-50/60 sm:px-5 sm:py-3.5"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent/40 transition-colors duration-300 group-hover/item:bg-accent/70"
                    />
                    <span className="text-sm leading-relaxed text-text-muted">
                      {t(key)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Consulting box */}
          <div className="mt-10">
            <div className="rounded-xl p-px bg-linear-to-r from-beige-400/30 via-bordeaux-500/40 to-beige-400/30">
              <div className="rounded-xl bg-white px-5 py-5 sm:px-6 sm:py-6">
                <span className="inline-block text-xs font-semibold uppercase tracking-[0.4em] text-accent">
                  {t(`${lawKey}_consulting_headline`)}
                </span>
                <div aria-hidden="true" className="my-2.5 h-px w-8 bg-accent/40" />
                <p className="text-sm leading-relaxed text-text-muted sm:text-base">
                  {t(`${lawKey}_consulting_text`)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </article>
  );
}
