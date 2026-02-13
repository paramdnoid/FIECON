"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/animations/FadeIn";
import { OFFICES } from "@/lib/constants";
import { useCarouselIndex } from "@/hooks/useCarouselIndex";
import { COUNTRY_MAPS } from "@/components/maps";

export function Offices() {
  const t = useTranslations("offices");
  const [carouselRef, activeIndex] = useCarouselIndex(OFFICES.length);

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

        {/* Cards: horizontal scroll-snap on mobile, 3-column grid on desktop */}
        <div
          ref={carouselRef}
          className="flex snap-x snap-mandatory overflow-x-auto scrollbar-hide gap-4 pb-2 md:grid md:grid-cols-3 md:gap-6 lg:gap-8 md:overflow-visible md:pb-0"
        >
          {/* Spacer for centering first card on mobile */}
          <div className="min-w-[7.5%] flex-shrink-0 md:hidden" aria-hidden="true" />
          {OFFICES.map((office, i) => (
            <FadeIn
              key={office.id}
              delay={0.1 + i * 0.12}
              className="min-w-[85%] snap-center flex-shrink-0 md:min-w-0 md:flex-shrink"
            >
              <div
                data-carousel-item
                className="h-full group relative overflow-hidden rounded-2xl bg-bordeaux-900 text-white shadow-xl shadow-bordeaux-900/20 transition-all duration-500 hover:-translate-y-1"
              >

                <div className="p-8 lg:p-10">
                  {/* Country map silhouette */}
                  {(() => {
                    const MapComponent = COUNTRY_MAPS[office.countryCode];
                    if (!MapComponent) return null;
                    return (
                      <div className="absolute inset-y-6 right-6 flex items-center select-none pointer-events-none max-w-[50%]">
                        <MapComponent
                          className="w-auto h-full max-h-full text-white/30"
                          dotClassName="fill-beige-400"
                        />
                      </div>
                    );
                  })()}

                  {/* Label / Region tag */}
                  <p className="text-xs font-semibold tracking-widest uppercase mb-6 text-beige-400">
                    {t(`${office.id}.label`)}
                  </p>

                  {/* City */}
                  <h3 className="font-display text-3xl lg:text-4xl font-normal mb-2 text-white">
                    {t(`${office.id}.city`)}
                  </h3>

                  {/* Country */}
                  <p className="text-sm text-beige-200">
                    {t(`${office.id}.country`)}
                  </p>

                  {/* Decorative diamond */}
                  <div
                    aria-hidden="true"
                    className="mt-8 w-3 h-3 rotate-45 bg-beige-400"
                  />
                </div>
              </div>
            </FadeIn>
          ))}
          {/* Spacer for centering last card on mobile */}
          <div className="min-w-[7.5%] flex-shrink-0 md:hidden" aria-hidden="true" />
        </div>

        {/* Pagination dots — mobile only */}
        <div
          className="flex justify-center gap-2 mt-6 md:hidden"
          role="tablist"
          aria-label={t("badge")}
        >
          {OFFICES.map((office, i) => (
            <button
              key={office.id}
              type="button"
              role="tab"
              aria-selected={activeIndex === i}
              aria-label={`${i + 1} / ${OFFICES.length}`}
              className={`h-2 rounded-full transition-all duration-300 ${activeIndex === i
                  ? "bg-bordeaux-900 w-6"
                  : "bg-beige-400/60 w-2 hover:bg-beige-400"
                }`}
              onClick={() => {
                const container = carouselRef.current;
                if (!container) return;
                const items =
                  container.querySelectorAll<HTMLElement>(
                    "[data-carousel-item]"
                  );
                items[i]?.scrollIntoView({
                  behavior: "smooth",
                  block: "nearest",
                  inline: "center",
                });
              }}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
