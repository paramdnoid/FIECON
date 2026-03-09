"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FadeIn } from "@/components/animations";
import { hasTranslation } from "@/lib/utils";
import { Badge, Container, HoverCard, SectionHeading } from "@/components/ui";
import { ServicesFocusAreas } from "./services/ServicesFocusAreas";
import { SERVICE_ICONS } from "./services/service-icons";
const STANDALONE_KEYS = [
  "consulting",
  "private_health_insurance",
] as const;

const FINANCE_KEYS = ["finance", "construction", "yacht"] as const;

const ITEMS_PER_SERVICE: Record<string, number> = {
  consulting: 2,
  finance: 2,
  construction: 3,
  yacht: 2,
  private_health_insurance: 3,
};

function ServiceCardContent({
  serviceKey,
  t,
  ordinal,
  children,
}: {
  serviceKey: string;
  t: ReturnType<typeof useTranslations<"services">>;
  ordinal?: string;
  children?: React.ReactNode;
}) {
  return (
    <>
      {/* Number watermark — like Philosophy */}
      {ordinal && (
        <span aria-hidden="true" className="absolute top-4 right-5 font-display text-6xl font-light text-bordeaux-900 opacity-[0.04] select-none pointer-events-none">
          {ordinal}
        </span>
      )}

      {/* Icon + Title block + optional tabs */}
      <div style={{ minHeight: "4.2rem" }} className="flex items-start gap-4 mb-3">
        {SERVICE_ICONS[serviceKey] && (
          <div className="w-10 h-10 rounded-full bg-bordeaux-900/5 group-hover:bg-bordeaux-900/10 flex items-center justify-center text-accent transition-colors duration-400 shrink-0 mt-0.5">
            {SERVICE_ICONS[serviceKey]}
          </div>
        )}
        <div className="flex-1 min-w-0">
          {children && (
            <div className="flex items-center gap-3 mb-1.5">
              {children}
            </div>
          )}
          <h3 className="font-display text-lg sm:text-xl font-normal text-text-primary tracking-tight leading-snug">
            {t(`${serviceKey}.title`)}
          </h3>
        </div>
      </div>

      {/* Divider */}
      <div className="w-8 h-px bg-accent/30 mb-4" />

      {/* Description */}
      <p className="text-sm text-text-muted leading-relaxed">
        {t(`${serviceKey}.description`)}
      </p>

      {/* Items — using design system Badge */}
      <div className="flex flex-wrap gap-2 mt-auto pt-8">
        {Array.from({ length: ITEMS_PER_SERVICE[serviceKey] }, (_, i) => (
          <Badge key={i}>{t(`${serviceKey}.items.${i}`)}</Badge>
        ))}
      </div>
    </>
  );
}

function FinanceCard({
  t,
  ordinal,
}: {
  t: ReturnType<typeof useTranslations<"services">>;
  ordinal?: string;
}) {
  const visibleKeys = FINANCE_KEYS.filter((key) =>
    hasTranslation(t, `${key}.title`),
  );
  const [activeIdx, setActiveIdx] = useState(0);
  const activeKey = visibleKeys[activeIdx] ?? visibleKeys[0];

  if (visibleKeys.length === 0) return null;

  return (
    <HoverCard>
      <ServiceCardContent serviceKey={activeKey} t={t} ordinal={ordinal}>
        {visibleKeys.length > 1 && (
          <>
            {visibleKeys.map((key, i) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveIdx(i)}
                className={`relative px-2.5 py-1 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux-900/40 focus-visible:ring-offset-2 ${
                  i === activeIdx
                    ? "bg-bordeaux-900 text-white shadow-sm"
                    : "bg-beige-100 text-bordeaux-900/50 hover:bg-beige-200 hover:text-bordeaux-900/80"
                }`}
                style={{ fontSize: "0.55rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}
              >
                {hasTranslation(t, `${key}.tab`) ? t(`${key}.tab`) : t(`${key}.title`)}
              </button>
            ))}
          </>
        )}
      </ServiceCardContent>
    </HoverCard>
  );
}

export function Services() {
  const t = useTranslations("services");
  const visibleStandaloneKeys = STANDALONE_KEYS.filter((key) =>
    hasTranslation(t, `${key}.title`),
  );
  const hasFinance = FINANCE_KEYS.some((key) =>
    hasTranslation(t, `${key}.title`),
  );

  const allCards: React.ReactNode[] = [];
  let delayIdx = 0;

  // Finance card first — spans 2 columns, dark hero variant
  if (hasFinance) {
    const ordinal = String(delayIdx + 1).padStart(2, "0");
    allCards.push(
      <FadeIn key="finance-group" delay={0.1 + delayIdx * 0.08} className="relative z-40 h-full overflow-visible">
        <FinanceCard t={t} ordinal={ordinal} />
      </FadeIn>,
    );
    delayIdx++;
  }

  // Consulting card — 1 column
  if (visibleStandaloneKeys.includes("consulting")) {
    const ordinal = String(delayIdx + 1).padStart(2, "0");
    allCards.push(
      <FadeIn key="consulting" delay={0.1 + delayIdx * 0.08} className="h-full">
        <HoverCard>
          <ServiceCardContent serviceKey="consulting" t={t} ordinal={ordinal} />
        </HoverCard>
      </FadeIn>,
    );
    delayIdx++;
  }

  // Remaining standalone cards (private_health_insurance)
  for (const key of visibleStandaloneKeys) {
    if (key === "consulting") continue;
    const ordinal = String(delayIdx + 1).padStart(2, "0");
    allCards.push(
      <FadeIn key={key} delay={0.1 + delayIdx * 0.08} className="h-full">
        <HoverCard>
          <ServiceCardContent serviceKey={key} t={t} ordinal={ordinal} />
        </HoverCard>
      </FadeIn>,
    );
    delayIdx++;
  }

  return (
    <section id="services" className="relative z-20 overflow-visible py-20 sm:py-32 lg:py-40 bg-beige-50">
      <Container size="lg" className="relative z-30 overflow-visible">
        <FadeIn>
          <SectionHeading
            badge={t("badge")}
            headline={t("headline")}
            subtitle={t("subtitle")}
            gradient
            headlineClassName="gradient-text-hero font-normal leading-[0.95] tracking-[-0.03em] sm:text-6xl lg:text-7xl"
          />
        </FadeIn>

        <div className="relative z-30 grid grid-cols-1 gap-5 overflow-visible md:grid-cols-3 lg:gap-6">
          {allCards}
        </div>

        <ServicesFocusAreas t={t} />
      </Container>
    </section>
  );
}
