"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/animations/FadeIn";
import { OFFICES } from "@/lib/constants";

const COUNTRY_CODES: Record<string, string> = {
  hamburg: "DE",
  belgrade: "RS",
  texas: "US",
};

export function Offices() {
  const t = useTranslations("offices");

  return (
    <section id="offices" className="py-32 sm:py-40">
      <Container size="lg">
        <FadeIn>
          <SectionHeading
            badge={t("badge")}
            headline={t("headline")}
            subtitle={t("subtitle")}
          />
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {OFFICES.map((office, i) => (
            <FadeIn key={office.id} delay={0.1 + i * 0.12}>
              <div
                className={`group relative overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-1 ${
                  office.isHQ
                    ? "bg-bordeaux-900 text-white shadow-xl shadow-bordeaux-900/20"
                    : "bg-white border border-border-subtle hover:border-beige-400 hover:shadow-lg hover:shadow-bordeaux-900/5"
                }`}
              >
                {/* Top accent bar */}
                {!office.isHQ && (
                  <div className="h-1 bg-linear-to-r from-bordeaux-900 via-bordeaux-700 to-beige-400" />
                )}

                <div className="p-8 lg:p-10">
                  {/* Country code as large watermark */}
                  <span
                    aria-hidden="true"
                    className={`absolute top-4 right-6 font-display text-7xl lg:text-8xl font-bold select-none pointer-events-none ${
                      office.isHQ
                        ? "text-white/10"
                        : "text-beige-200/60"
                    }`}
                  >
                    {COUNTRY_CODES[office.id]}
                  </span>

                  {/* Label / Region tag */}
                  <p
                    className={`text-xs font-semibold tracking-widest uppercase mb-6 ${
                      office.isHQ
                        ? "text-beige-400"
                        : "text-accent"
                    }`}
                  >
                    {t(`${office.id}.label`)}
                  </p>

                  {/* City */}
                  <h3
                    className={`font-display text-3xl lg:text-4xl font-normal mb-2 ${
                      office.isHQ ? "text-white" : "text-text-primary"
                    }`}
                  >
                    {t(`${office.id}.city`)}
                  </h3>

                  {/* Country */}
                  <p
                    className={`text-sm ${
                      office.isHQ ? "text-beige-200" : "text-text-muted"
                    }`}
                  >
                    {t(`${office.id}.country`)}
                  </p>

                  {/* Decorative diamond */}
                  <div
                    aria-hidden="true"
                    className={`mt-8 w-3 h-3 rotate-45 ${
                      office.isHQ ? "bg-beige-400" : "bg-bordeaux-900"
                    }`}
                  />
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
