"use client";

import { useCallback, useRef, type KeyboardEvent } from "react";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/animations/FadeIn";
import {
  EllipseCarousel,
  EllipseCard,
  type DepthConfig,
} from "@/components/animations/EllipseCarousel";
import { OFFICES } from "@/lib/constants";
import { useEllipseCarousel } from "@/hooks/useEllipseCarousel";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { COUNTRY_MAPS } from "@/components/maps";

const RADII = {
  xs: { x: 165, y: 22 },
  sm: { x: 210, y: 28 },
  md: { x: 320, y: 45 },
  lg: { x: 420, y: 55 },
  xl: { x: 480, y: 65 },
};

const CARD = {
  xs: { w: 270, h: 195 },
  sm: { w: 290, h: 200 },
  md: { w: 290, h: 200 },
  lg: { w: 340, h: 210 },
  xl: { w: 380, h: 220 },
};

const HEIGHT = { xs: 305, sm: 320, md: 340, lg: 380, xl: 420 };

const DRAG_SENSITIVITY = 0.004;

const MOBILE_DEPTH: DepthConfig = {
  scaleRange: [0.5, 1.0],
  blurMax: 4,
  brightnessRange: [0.45, 1.0],
  opacityRange: [0.25, 1.0],
  shadowSpreadMax: 24,
  shadowAlphaMax: 0.3,
};

function OfficeCardContent({
  office,
  t,
}: {
  office: (typeof OFFICES)[number];
  t: ReturnType<typeof useTranslations<"offices">>;
}) {
  const MapComponent = COUNTRY_MAPS[office.countryCode];

  return (
    <div className="h-full group relative overflow-hidden rounded-2xl bg-bordeaux-900 text-white">
      <div className="p-6 sm:p-8 lg:p-10">
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
          {t(`${office.id}.city`)}
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

function Carousel3D({
  t,
}: {
  t: ReturnType<typeof useTranslations<"offices">>;
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

  const dragStartRotation = useRef(0);

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
        {/* Prev button — desktop only */}
        <button
          type="button"
          onClick={prev}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-110 h-12 w-12 items-center justify-center rounded-full border border-bordeaux-900/10 bg-white text-bordeaux-900 shadow-md transition-all duration-300 hover:bg-bordeaux-900 hover:text-white hover:scale-110 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-bordeaux-900"
          aria-label="Previous"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Single carousel: responsive layout (mobile breakout + mask, desktop normal) */}
        <div
          className="-mx-6 overflow-hidden md:mx-0 md:overflow-visible"
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
          <div className="px-6 md:px-0">
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0}
              dragMomentum={false}
              onDragStart={() => {
                pauseAutoPlay();
                dragStartRotation.current = rotation.get();
              }}
              onDrag={(_, info) => {
                rotation.set(
                  dragStartRotation.current + info.offset.x * DRAG_SENSITIVITY,
                );
              }}
              onDragEnd={(_, info) => {
                const delta = info.offset.x * DRAG_SENSITIVITY;
                const angleStep = (Math.PI * 2) / OFFICES.length;
                const newRotation = dragStartRotation.current + delta;
                const nearestIndex =
                  Math.round(-newRotation / angleStep) % OFFICES.length;
                goTo(((nearestIndex % OFFICES.length) + OFFICES.length) % OFFICES.length);
                resumeAutoPlay();
              }}
              style={{ cursor: "grab", touchAction: "pan-y" }}
              whileDrag={{ cursor: "grabbing" }}
            >
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
            </motion.div>
          </div>
        </div>

        {/* Next button — desktop only */}
        <button
          type="button"
          onClick={next}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-110 h-12 w-12 items-center justify-center rounded-full border border-bordeaux-900/10 bg-white text-bordeaux-900 shadow-md transition-all duration-300 hover:bg-bordeaux-900 hover:text-white hover:scale-110 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-bordeaux-900"
          aria-label="Next"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Active slide announcement for screen readers */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {t(`${OFFICES[activeIndex].id}.city`)} — {t(`${OFFICES[activeIndex].id}.country`)}
        </div>

        {/* Dots */}
        <div
          className="flex justify-center gap-2 sm:gap-2.5 mt-6 sm:mt-10"
          role="tablist"
          aria-label={t("badge")}
        >
          {OFFICES.map((office, i) => (
            <button
              key={office.id}
              type="button"
              role="tab"
              aria-selected={activeIndex === i}
              aria-label={`${t(`${office.id}.city`)} (${i + 1} / ${OFFICES.length})`}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === i
                  ? "bg-bordeaux-900 w-6 sm:w-7"
                  : "bg-beige-400/50 w-2 hover:bg-beige-400"
              }`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>
    </FadeIn>
  );
}

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

export function Offices() {
  const t = useTranslations("offices");
  const prefersReduced = useReducedMotion();

  return (
    <section id="offices" className="py-32 sm:py-20">
      <Container size="lg">
        <FadeIn>
          <SectionHeading
            badge={t("badge")}
            headline={t("headline")}
            subtitle={t("subtitle")}
          />
        </FadeIn>

        {prefersReduced ? (
          <StaticGrid t={t} />
        ) : (
          <Carousel3D t={t} />
        )}
      </Container>
    </section>
  );
}
