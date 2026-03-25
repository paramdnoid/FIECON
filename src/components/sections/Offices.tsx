"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "motion/react";
import { EllipseCarousel, EllipseCard, FadeIn } from "@/components/animations";
import { Container, SectionHeading } from "@/components/ui";
import { OFFICES, OFFICE_CITY_OVERRIDES } from "@/lib/constants";
import { useEllipseCarousel } from "@/hooks/useEllipseCarousel";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { COUNTRY_MAPS } from "@/components/maps";
import { BackgroundMap } from "./offices/BackgroundMap";
import {
  OfficeCarouselDots,
  OfficeCarouselNavButton,
} from "./offices/OfficeCarouselControls";
import {
  RADII,
  CARD,
  HEIGHT,
  DRAG_SENSITIVITY,
  MOBILE_DEPTH,
} from "./offices/offices-config";

/* ── Office card ───────────────────────────────────────────────────── */

function OfficeCardContent({
  office,
  t,
}: {
  office: (typeof OFFICES)[number];
  t: ReturnType<typeof useTranslations<"offices">>;
}) {
  const MapComponent = COUNTRY_MAPS[office.countryCode];
  const city = OFFICE_CITY_OVERRIDES[office.id] ?? t(`${office.id}.city`);

  return (
    <div className="fiecon-card-frame-dark h-full group relative overflow-hidden rounded-2xl text-white">
      <div className="p-5 sm:p-6 lg:p-8">
        {MapComponent && (
          <div className="absolute inset-y-4 right-4 sm:inset-y-6 sm:right-6 flex items-center select-none pointer-events-none max-w-[50%]">
            <MapComponent
              className="w-auto h-full max-h-full text-white/30 transition-colors duration-500 group-hover:text-white/50"
              dotClassName="fill-beige-400"
            />
          </div>
        )}

        <p className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase mb-4 sm:mb-6 text-beige-400">
          {t(`${office.id}.label`)}
        </p>

        <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-normal mb-1.5 sm:mb-2 text-white">
          {city}
        </h3>

        <p className="text-xs sm:text-sm text-beige-200">
          {t(`${office.id}.country`)}
        </p>

        <div
          aria-hidden="true"
          className="mt-5 sm:mt-8 w-2.5 h-2.5 sm:w-3 sm:h-3 rotate-45 bg-beige-400"
        />
      </div>
    </div>
  );
}

/* ── 3D Carousel ───────────────────────────────────────────────────── */

function Carousel3D({
  t,
  onActiveIndexChange,
}: {
  t: ReturnType<typeof useTranslations<"offices">>;
  onActiveIndexChange?: (index: number) => void;
}) {
  const isSm = useMediaQuery("(min-width: 640px)");
  const isMd = useMediaQuery("(min-width: 768px)");
  const isLg = useMediaQuery("(min-width: 1024px)");
  const isXl = useMediaQuery("(min-width: 1280px)");

  const bp = isXl ? "xl" : isLg ? "lg" : isMd ? "md" : isSm ? "sm" : "xs";
  const radii = RADII[bp];
  const card = CARD[bp];
  const cHeight = HEIGHT[bp];

  const {
    rotation,
    activeIndex,
    goTo,
    next,
    prev,
    pauseAutoPlay,
    resumeAutoPlay,
  } = useEllipseCarousel({ count: OFFICES.length, autoPlayMs: 5000 });

  /* Sync active index to parent for background map */
  useEffect(() => {
    onActiveIndexChange?.(activeIndex);
  }, [activeIndex, onActiveIndexChange]);

  const dragStartRotation = useRef(0);
  const touchStartX = useRef(0);
  const touchStartTime = useRef(0);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      pauseAutoPlay();
      touchStartX.current = e.touches[0].clientX;
      touchStartTime.current = Date.now();
      dragStartRotation.current = rotation.get();
    },
    [pauseAutoPlay, rotation],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const dx = e.touches[0].clientX - touchStartX.current;
      rotation.set(dragStartRotation.current + dx * DRAG_SENSITIVITY);
    },
    [rotation],
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const dt = Date.now() - touchStartTime.current;
      const velocity = Math.abs(dx / dt);
      const angleStep = (Math.PI * 2) / OFFICES.length;

      // Quick flick → just go next/prev
      if (velocity > 0.3 && Math.abs(dx) > 20) {
        if (dx > 0) prev();
        else next();
      } else {
        // Slow drag → snap to nearest
        const newRotation = dragStartRotation.current + dx * DRAG_SENSITIVITY;
        const nearestIndex = Math.round(-newRotation / angleStep) % OFFICES.length;
        goTo(((nearestIndex % OFFICES.length) + OFFICES.length) % OFFICES.length);
      }
      resumeAutoPlay();
    },
    [prev, next, goTo, resumeAutoPlay],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
    },
    [next, prev],
  );

  return (
    <FadeIn>
      <div
        className="relative md:px-14"
        onMouseEnter={pauseAutoPlay}
        onMouseLeave={resumeAutoPlay}
        onFocus={pauseAutoPlay}
        onBlur={resumeAutoPlay}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label={t("badge")}
      >
        <OfficeCarouselNavButton direction="prev" onClick={prev} />

        {/* Single carousel: responsive layout (mobile breakout + mask, desktop normal) */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="-mx-2 sm:-mx-4 overflow-hidden md:mx-0 md:overflow-visible"
          style={
            !isMd
              ? {
                  maskImage:
                    "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
                }
              : undefined
          }
        >
          <div className="px-2 md:px-0">
            <div style={{ touchAction: "pan-y" }}>
              <EllipseCarousel containerHeight={cHeight}>
                {OFFICES.map((office, i) => (
                  <EllipseCard
                    key={office.id}
                    index={i}
                    totalCount={OFFICES.length}
                    rotation={rotation}
                    radiusX={radii.x}
                    radiusY={radii.y}
                    onClick={() => goTo(i)}
                    cardWidth={card.w}
                    cardHeight={card.h}
                    depth={isMd ? undefined : MOBILE_DEPTH}
                  >
                    <OfficeCardContent office={office} t={t} />
                  </EllipseCard>
                ))}
              </EllipseCarousel>
            </div>
          </div>
        </div>

        <OfficeCarouselNavButton direction="next" onClick={next} />

        {/* Active slide announcement for screen readers */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {OFFICE_CITY_OVERRIDES[OFFICES[activeIndex].id] ??
            t(`${OFFICES[activeIndex].id}.city`)}{" "}
          — {t(`${OFFICES[activeIndex].id}.country`)}
        </div>

        <OfficeCarouselDots
          offices={OFFICES}
          activeIndex={activeIndex}
          onSelect={goTo}
          ariaLabel={t("badge")}
          getCityLabel={(officeId) =>
            OFFICE_CITY_OVERRIDES[
              officeId as keyof typeof OFFICE_CITY_OVERRIDES
            ] ?? t(`${officeId}.city`)
          }
        />
      </div>
    </FadeIn>
  );
}

/* ── Static fallback (reduced motion) ──────────────────────────────── */

function StaticGrid({
  t,
}: {
  t: ReturnType<typeof useTranslations<"offices">>;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
      {OFFICES.map((office, i) => (
        <div
          key={office.id}
          className={`col-span-1 sm:col-span-2 ${i === 3 ? "sm:col-start-2" : ""} ${i === 4 ? "col-start-1 sm:col-start-auto" : ""}`}
        >
          <OfficeCardContent office={office} t={t} />
        </div>
      ))}
    </div>
  );
}

/* ── Section export ────────────────────────────────────────────────── */

export function Offices() {
  const t = useTranslations("offices");
  const prefersReduced = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="offices" className="py-12 sm:py-16 lg:py-20 relative overflow-hidden">
      {/* Ambient background map — only when animations are enabled */}
      {!prefersReduced && <BackgroundMap activeIndex={activeIndex} />}

      <Container size="lg" className="relative z-10">
        <FadeIn>
          <SectionHeading
            badge={t("badge")}
            headline={t("headline")}
            subtitle={t("subtitle")}
            gradient
            headlineClassName="gradient-text-hero font-normal leading-[0.95] tracking-[-0.03em] sm:text-6xl lg:text-7xl"
          />
        </FadeIn>

        {prefersReduced ? (
          <StaticGrid t={t} />
        ) : (
          <Carousel3D t={t} onActiveIndexChange={setActiveIndex} />
        )}
      </Container>
    </section>
  );
}
