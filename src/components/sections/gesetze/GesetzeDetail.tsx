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
  const isEvenSection = index % 2 === 0;
  const provisionKeys: string[] = [];

  for (let i = 0; ; i += 1) {
    const key = `${lawKey}_provision_${i}`;

    if (!t.has(key)) {
      break;
    }

    provisionKeys.push(key);
  }

  return (
    <section
      className={`relative overflow-hidden py-16 sm:py-20 lg:py-28 ${
        isEvenSection ? "bg-beige-50" : "bg-white"
      }`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-beige-400/30 to-transparent"
      />

      {/* Decorative number watermark — anchored to right edge, vertically centred */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 top-1/2 hidden -translate-y-1/2 select-none font-display text-[14rem] font-semibold leading-none text-bordeaux-900 lg:block lg:text-[16rem] xl:text-[18rem]"
        style={{ opacity: 0.02 }}
      >
        {decorativeNumber}
      </span>

      <Container size="lg">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-18 xl:gap-22">

          {/* Left col (5 spans): identity + provisions */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start">
            <FadeIn>
              {/* Icon circle + abbreviation + full name */}
              <div className="mb-7 flex items-center gap-4 sm:mb-8">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-bordeaux-900/5 text-accent ring-1 ring-bordeaux-900/8">
                  {LAW_ICONS[lawKey]}
                </div>
                <div>
                  <p className="font-display text-3xl font-normal italic leading-tight text-text-primary sm:text-[2rem]">
                    {t(`${lawKey}_abbreviation`)}
                  </p>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent/80 sm:text-sm">
                    {t(`${lawKey}_name`)}
                  </p>
                </div>
              </div>

              {/* Gradient divider */}
              <div
                aria-hidden="true"
                className="mb-8 h-px bg-linear-to-r from-bordeaux-900/20 via-bordeaux-700/15 to-transparent sm:mb-9"
              />

              {/* Provisions headline */}
              <h3 className="mb-6 font-display text-[1.35rem] font-semibold text-text-primary sm:mb-7">
                {t(`${lawKey}_provisions_headline`)}
              </h3>

              {/* Provisions list */}
              <ul className="divide-y divide-bordeaux-900/8 border-y border-bordeaux-900/10">
                {provisionKeys.map((key) => (
                  <li
                    key={key}
                    className="grid grid-cols-[1.25rem,1fr] items-start gap-3 py-4"
                  >
                    <span className="mt-0.5 font-display text-accent/85">§</span>
                    <span className="text-sm leading-7 text-text-secondary">
                      {t(key)}
                    </span>
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>

          {/* Right col (7 spans): intro + detail + consulting box */}
          <div className="lg:col-span-7 lg:pt-4">
            <FadeIn delay={0.15}>
              <p className="mb-5 max-w-[66ch] font-display text-[1.375rem] leading-[1.4] text-text-primary sm:text-[1.625rem]">
                {t(`${lawKey}_intro`)}
              </p>
              <p className="mb-10 max-w-[68ch] text-[0.98rem] leading-8 text-text-muted sm:mb-12">
                {t(`${lawKey}_detail`)}
              </p>

              <div
                aria-hidden="true"
                className="mb-7 h-px bg-linear-to-r from-bordeaux-900/15 via-beige-400/35 to-transparent sm:mb-8"
              />

              {/* Consulting box — gradient border frame (mirrors About.tsx quote cards) */}
              <div className="rounded-xl border border-bordeaux-900/12 bg-transparent shadow-sm">
                <div
                  className={`rounded-xl border-l-2 border-bordeaux-700/35 px-6 py-5 sm:px-8 sm:py-6 ${
                    isEvenSection ? "bg-white" : "bg-beige-50/50"
                  }`}
                >
                  <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-text-secondary">
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
