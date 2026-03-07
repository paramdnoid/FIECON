"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/animations/FadeIn";

import React from "react";
import { hasTranslation } from "@/lib/utils";
import { HoverCard } from "@/components/ui/HoverCard";
import { Badge } from "@/components/ui/Badge";


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

const FOCUS_AREAS = [
  { key: "corporate_law", itemCount: 3 },
  { key: "transparency", itemCount: 3 },
] as const;

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  consulting: (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
  finance: (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  construction: (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  ),
  yacht: (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17l3-7 5 3 5-9 3 13H3z" />
      <path d="M3 21h18" />
    </svg>
  ),
  private_health_insurance: (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  ),
};

const FOCUS_ICONS: Record<string, React.ReactNode> = {
  corporate_law: (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
  transparency: (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
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
      <div className="flex items-start gap-4 mb-3">
        {SERVICE_ICONS[serviceKey] && (
          <div className="w-10 h-10 rounded-full bg-bordeaux-900/5 group-hover:bg-bordeaux-900/10 flex items-center justify-center text-accent transition-colors duration-400 shrink-0 mt-0.5">
            {SERVICE_ICONS[serviceKey]}
          </div>
        )}
        <div className="flex-1 min-w-0">
          {children && (
            <div className="flex items-center justify-end gap-3 mb-1.5">
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
      <div className="flex flex-wrap gap-2 mt-auto pt-5">
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
                className={`text-[10px] tracking-[0.15em] uppercase transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux-900/40 focus-visible:ring-offset-2 rounded-sm ${
                  i === activeIdx
                    ? "font-semibold text-bordeaux-900"
                    : "font-medium text-bordeaux-900/30 hover:text-bordeaux-900/60"
                }`}
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

        {/* === Focus Areas — subtle detail zone === */}
        <FadeIn delay={0.3}>
          <div aria-hidden="true" className="h-px bg-linear-to-r from-transparent via-beige-400/30 to-transparent mt-16 mb-14" />
        </FadeIn>

        <FadeIn delay={0.35}>
          <p className="text-center text-sm font-medium tracking-[0.4em] uppercase text-accent mb-10">
            {t("focus_headline")}
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {FOCUS_AREAS.map((area, i) => (
            <FadeIn key={area.key} delay={0.4 + i * 0.1} className="h-full min-h-0">
              <div className="relative pl-4 sm:pl-6 border-l border-beige-400/50 h-full flex flex-col">
                {/* Icon + Title */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-accent shrink-0">
                    {FOCUS_ICONS[area.key]}
                  </span>
                  <h4 className="font-display text-lg font-normal text-text-primary tracking-tight">
                    {t(`${area.key}.title`)}
                  </h4>
                </div>

                {/* Lead text */}
                <p className="text-sm text-text-muted leading-relaxed mb-4">
                  {t(`${area.key}.lead`)}
                </p>

                {/* Items list */}
                <ul className="space-y-2">
                  {Array.from({ length: area.itemCount }, (_, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2.5 text-sm text-text-muted leading-relaxed"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 w-1 h-1 rounded-full bg-bordeaux-900/30 shrink-0"
                      />
                      {t(`${area.key}.items.${j}`)}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
