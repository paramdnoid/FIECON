"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { SlideReveal } from "@/components/animations/SlideReveal";
import { FadeIn } from "@/components/animations/FadeIn";
import { OFFICES } from "@/lib/constants";

const OFFICE_DECORATIONS: Record<string, { emoji: string; gradient: string }> = {
  hamburg: {
    emoji: "DE",
    gradient: "from-bordeaux-900/10 to-beige-200/50",
  },
  belgrade: {
    emoji: "RS",
    gradient: "from-accent/10 to-beige-200/50",
  },
  texas: {
    emoji: "US",
    gradient: "from-bordeaux-700/10 to-beige-200/50",
  },
};

const DIRECTIONS = ["left", "bottom", "right"] as const;

export function Offices() {
  const t = useTranslations("offices");

  return (
    <section id="offices" className="py-24 sm:py-32">
      <Container size="lg">
        <FadeIn>
          <SectionHeading
            badge={t("badge")}
            headline={t("headline")}
            subtitle={t("subtitle")}
          />
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {OFFICES.map((office, i) => {
            const decoration = OFFICE_DECORATIONS[office.id];
            return (
              <SlideReveal
                key={office.id}
                direction={DIRECTIONS[i]}
                delay={0.1 + i * 0.12}
              >
                <div className="group relative p-8 lg:p-10 bg-white rounded-2xl border border-border-subtle hover:border-beige-400 transition-all duration-500 hover:shadow-2xl hover:shadow-bordeaux-900/8 hover:scale-[1.02] overflow-hidden">
                  {/* Decorative gradient */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${decoration.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  {/* Country code */}
                  <div className="w-14 h-14 rounded-xl border border-beige-200 bg-beige-50 flex items-center justify-center text-bordeaux-900 font-bold text-sm mb-6 group-hover:bg-beige-100 group-hover:border-beige-400 transition-all duration-300">
                    {decoration.emoji}
                  </div>

                  {/* Content */}
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-display text-2xl font-semibold text-text-primary">
                      {t(`${office.id}.city`)}
                    </h3>
                    {office.isHQ && (
                      <Badge variant="accent">
                        {t(`${office.id}.label`)}
                      </Badge>
                    )}
                  </div>
                  <p className="text-text-muted">{t(`${office.id}.country`)}</p>
                  {!office.isHQ && (
                    <p className="text-xs text-accent mt-2 font-medium">
                      {t(`${office.id}.label`)}
                    </p>
                  )}
                </div>
              </SlideReveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
