"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/animations/FadeIn";

import React from "react";
import { hasTranslation } from "@/lib/utils";
import { HoverCard } from "@/components/ui/HoverCard";

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  consulting: (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
  finance: (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  construction: (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
      <path d="M8 4v16" />
      <path d="M16 4v16" />
    </svg>
  ),
  yacht: (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20h20" />
      <path d="M12 4v12" />
      <path d="M12 4l8 12H4z" />
    </svg>
  ),
  private_health_insurance: (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-4.35-7-10V5l7-3 7 3v6c0 5.65-7 10-7 10z" />
      <path d="M12 8v6" />
      <path d="M9 11h6" />
    </svg>
  ),
};

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
  tabs,
}: {
  serviceKey: string;
  t: ReturnType<typeof useTranslations<"services">>;
  tabs?: React.ReactNode;
}) {
  return (
    <>
      {/* Sub-service tabs (finance card) */}
      {tabs ? <div className="mb-7">{tabs}</div> : null}

      {/* Title row with icon — min-h ensures consistent alignment across cards */}
      <div className="flex items-start justify-between gap-3 mb-2 min-h-[4.5rem]">
        <h3 className="font-display text-base font-normal text-text-primary tracking-tight leading-snug">
          {t(`${serviceKey}.title`)}
        </h3>
        <div className="w-8 h-8 shrink-0 rounded-full bg-bordeaux-900 text-beige-100 flex items-center justify-center group-hover:bg-bordeaux-700 transition-colors duration-500">
          {SERVICE_ICONS[serviceKey]}
        </div>
      </div>

      {/* Divider */}
      <div className="w-8 h-px bg-beige-400 mb-3" />

      {/* Description */}
      <p className="text-[13px] text-text-muted leading-relaxed">
        {t(`${serviceKey}.description`)}
      </p>

      {/* Badges — pushed to bottom */}
      <div className="flex flex-wrap gap-1.5 mt-auto pt-4">
        {Array.from(
          { length: ITEMS_PER_SERVICE[serviceKey] },
          (_, i) => (
            <span
              key={i}
              className="px-2.5 py-0.5 text-[10px] font-medium tracking-wide uppercase bg-beige-50 text-bordeaux-900 rounded-full"
            >
              {t(`${serviceKey}.items.${i}`)}
            </span>
          ),
        )}
      </div>
    </>
  );
}

function FinanceCard({
  t,
}: {
  t: ReturnType<typeof useTranslations<"services">>;
}) {
  const visibleKeys = FINANCE_KEYS.filter((key) =>
    hasTranslation(t, `${key}.title`),
  );
  const [activeIdx, setActiveIdx] = useState(0);
  const activeKey = visibleKeys[activeIdx] ?? visibleKeys[0];

  if (visibleKeys.length === 0) return null;

  return (
    <HoverCard
      className="relative z-40 overflow-visible! isolate"
      accentBarClassName="start-1/2 w-[22rem] -translate-x-1/2 sm:w-[26rem]"
    >
      {visibleKeys.length > 1 ? (
        <div className="absolute top-0 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2">
          <div className="inline-flex items-center gap-0.5 rounded-xl border border-beige-200 bg-white/95 p-0.5 shadow-[0_8px_18px_-12px_rgba(98,25,28,0.35)] backdrop-blur-sm">
            {visibleKeys.map((key, i) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveIdx(i)}
                className={`px-2.5 py-1 text-[10px] font-medium tracking-wide uppercase rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux-900/40 ${
                  i === activeIdx
                    ? "bg-bordeaux-900 text-beige-100 shadow-[0_4px_12px_-6px_rgba(98,25,28,0.6)]"
                    : "bg-beige-100 text-text-muted hover:bg-beige-200 hover:text-text-primary"
                }`}
              >
                {hasTranslation(t, `${key}.tab`) ? t(`${key}.tab`) : t(`${key}.title`)}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <ServiceCardContent serviceKey={activeKey} t={t} />
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

  // First standalone card (consulting)
  if (visibleStandaloneKeys.includes("consulting")) {
    allCards.push(
      <FadeIn key="consulting" delay={0.1 + delayIdx * 0.08} className="h-full">
        <HoverCard>
          <ServiceCardContent serviceKey="consulting" t={t} />
        </HoverCard>
      </FadeIn>,
    );
    delayIdx++;
  }

  // Combined finance card
  if (hasFinance) {
    allCards.push(
      <FadeIn key="finance-group" delay={0.1 + delayIdx * 0.08} className="relative z-40 h-full overflow-visible">
        <FinanceCard t={t} />
      </FadeIn>,
    );
    delayIdx++;
  }

  // Remaining standalone cards (private_health_insurance)
  for (const key of visibleStandaloneKeys) {
    if (key === "consulting") continue;
    allCards.push(
      <FadeIn key={key} delay={0.1 + delayIdx * 0.08} className="h-full">
        <HoverCard>
          <ServiceCardContent serviceKey={key} t={t} />
        </HoverCard>
      </FadeIn>,
    );
    delayIdx++;
  }

  return (
    <section id="services" className="relative z-20 overflow-visible py-32 sm:py-40 bg-beige-50">
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
              <div className="relative pl-6 border-l border-beige-400/50 h-full flex flex-col">
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
