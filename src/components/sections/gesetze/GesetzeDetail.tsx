"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/animations/FadeIn";
import { LAW_ICONS } from "./law-icons";

type Props = {
  lawKey: "kwg" | "vag" | "estg";
  index: number;
};

export function GesetzeDetail({ lawKey, index }: Props) {
  const t = useTranslations("gesetze_page");
  const decorativeNumber = String(index + 1).padStart(2, "0");

  return (
    <section
      className={`py-12 sm:py-16 lg:py-20 relative overflow-hidden ${
        index % 2 === 0 ? "bg-beige-50" : "bg-white"
      }`}
    >
      {/* Decorative number watermark — anchored to right edge, vertically centred */}
      <span
        aria-hidden="true"
        className="absolute -right-6 top-1/2 -translate-y-1/2 font-display text-[18rem] font-bold text-bordeaux-900 opacity-[0.04] select-none pointer-events-none leading-none"
      >
        {decorativeNumber}
      </span>

      <Container size="lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

          {/* Left col (5 spans): identity + provisions */}
          <div className="lg:col-span-5">
            <FadeIn>
              {/* Icon circle + abbreviation + full name */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-bordeaux-900/5 ring-1 ring-bordeaux-900/[0.06] flex items-center justify-center text-accent shrink-0">
                  {LAW_ICONS[lawKey]}
                </div>
                <div>
                  <p className="font-display italic text-2xl font-normal text-text-primary leading-tight">
                    {t(`${lawKey}_abbreviation`)}
                  </p>
                  <p className="text-sm font-medium text-accent/80 tracking-wide">
                    {t(`${lawKey}_name`)}
                  </p>
                </div>
              </div>

              {/* Gradient divider */}
              <div
                aria-hidden="true"
                className="h-px bg-gradient-to-r from-bordeaux-900/20 via-bordeaux-700/15 to-transparent mb-8"
              />

              {/* Provisions headline */}
              <h3 className="font-display text-xl font-semibold text-text-primary mb-6">
                {t(`${lawKey}_provisions_headline`)}
              </h3>

              {/* Provisions list */}
              <ul className="space-y-4">
                {([0, 1, 2, 3] as const).map((i) => (
                  <li key={i} className="flex gap-3">
                    <span className="font-display text-accent shrink-0 mt-0.5">§</span>
                    <span className="text-text-muted leading-relaxed text-sm">
                      {t(`${lawKey}_provision_${i}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>

          {/* Right col (7 spans): intro + detail + consulting box */}
          <div className="lg:col-span-7 lg:pt-2">
            <FadeIn delay={0.15}>
              <p className="text-text-muted leading-relaxed text-lg mb-5">
                {t(`${lawKey}_intro`)}
              </p>
              <p className="text-text-muted leading-relaxed mb-10">
                {t(`${lawKey}_detail`)}
              </p>

              {/* Consulting box — gradient border frame (mirrors About.tsx quote cards) */}
              <div className="rounded-2xl p-px bg-linear-to-r from-beige-400/30 via-bordeaux-500/20 to-beige-400/30 shadow-[0_4px_24px_-8px_rgba(98,25,28,0.06)]">
                <div className={`rounded-2xl px-6 py-5 sm:px-8 sm:py-6 ${index % 2 === 0 ? "bg-white" : "bg-beige-50"}`}>
                  <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent mb-3">
                    {t(`${lawKey}_consulting_headline`)}
                  </p>
                  <p className="text-text-muted leading-relaxed">
                    {t(`${lawKey}_consulting_text`)}
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>

        </div>
      </Container>
    </section>
  );
}
