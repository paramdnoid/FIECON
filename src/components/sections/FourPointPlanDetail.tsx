"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll } from "motion/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { FadeIn } from "@/components/animations/FadeIn";
import { Container } from "@/components/ui/Container";

const PLAN_POINTS = [
  { key: "strategy", number: "01", subpoints: ["1_1", "1_2"] },
  { key: "tax", number: "02", subpoints: ["2_1", "2_2", "2_3"] },
  { key: "relief", number: "03", subpoints: ["3_1"] },
  { key: "pension", number: "04", subpoints: ["4_1"] },
] as const;

const SUBPOINT_ITEM_COUNT: Record<string, number> = {
  "1_1": 4,
  "1_2": 3,
  "2_1": 3,
  "2_2": 3,
  "2_3": 1,
  "3_1": 3,
  "4_1": 3,
};

const ACCENT_CLASS: Record<string, string> = {
  strategy: "from-bordeaux-900 via-bordeaux-700 to-beige-400",
  tax: "from-bordeaux-700 via-bordeaux-900 to-beige-400",
  relief: "from-bordeaux-900 via-accent to-beige-400",
  pension: "from-bordeaux-700 via-bordeaux-900 to-beige-400",
};

type PlanPoint = (typeof PLAN_POINTS)[number];
type PlanPointKey = PlanPoint["key"];

function resolvePointKeyFromHash(hash: string): PlanPointKey | null {
  const rawHash = hash.replace(/^#/, "");
  const normalized = rawHash.startsWith("plan-step-")
    ? rawHash.replace("plan-step-", "")
    : rawHash;
  const key = normalized as PlanPointKey;

  return PLAN_POINTS.some((point) => point.key === key) ? key : null;
}

export function FourPointPlanDetail() {
  const t = useTranslations("fourPointPlan");
  const tDetail = useTranslations("fourPointPlan.detail");
  const prefersReducedMotion = useReducedMotion();

  const [activePoint, setActivePoint] = useState<PlanPointKey>(PLAN_POINTS[0].key);
  const sectionRef = useRef<HTMLElement | null>(null);
  const stepRefs = useRef<Partial<Record<PlanPointKey, HTMLElement | null>>>({});

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.82", "end 0.2"],
  });
  const activePointData = useMemo(
    () => PLAN_POINTS.find((point) => point.key === activePoint) ?? PLAN_POINTS[0],
    [activePoint],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const updateActiveByScroll = () => {
      const viewportHeight = window.innerHeight || 1000;
      const rootRect = sectionRef.current?.getBoundingClientRect();

      if (rootRect && rootRect.height >= viewportHeight * 0.8) {
        const activationOffset = viewportHeight * 0.2;
        const enteredDistance = activationOffset - rootRect.top;
        const usableScrollDistance = Math.max(rootRect.height - viewportHeight * 0.65, 1);
        const progress = Math.min(Math.max(enteredDistance / usableScrollDistance, 0), 0.9999);
        const nextPointIndex = Math.min(
          PLAN_POINTS.length - 1,
          Math.floor(progress * PLAN_POINTS.length),
        );
        const nextPoint = PLAN_POINTS[nextPointIndex];
        if (nextPoint) {
          setActivePoint(nextPoint.key);
          return;
        }
      }

      const anchorY = viewportHeight * 0.32;
      let nearestKey: PlanPointKey = PLAN_POINTS[0].key;
      let nearestDistance = Number.POSITIVE_INFINITY;
      for (const point of PLAN_POINTS) {
        const element = stepRefs.current[point.key];
        if (!element) {
          continue;
        }
        const rect = element.getBoundingClientRect();
        const distance = Math.abs(rect.top - anchorY);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestKey = point.key;
        }
      }
      setActivePoint(nearestKey);
    };

    updateActiveByScroll();
    window.addEventListener("scroll", updateActiveByScroll, { passive: true });
    window.addEventListener("resize", updateActiveByScroll);

    if (typeof window.IntersectionObserver !== "function") {
      return () => {
        window.removeEventListener("scroll", updateActiveByScroll);
        window.removeEventListener("resize", updateActiveByScroll);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const mostVisible = visibleEntries[0];
        const key = mostVisible?.target.getAttribute("data-point-key") as PlanPointKey | null;
        if (key) {
          setActivePoint(key);
        }
      },
      {
        threshold: [0.35, 0.55, 0.75],
        rootMargin: "-18% 0px -42% 0px",
      },
    );

    for (const point of PLAN_POINTS) {
      const element = stepRefs.current[point.key];
      if (element) {
        observer.observe(element);
      }
    }

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateActiveByScroll);
      window.removeEventListener("resize", updateActiveByScroll);
    };
  }, []);

  const handleJumpToPoint = (pointKey: PlanPointKey) => {
    setActivePoint(pointKey);
    const element = stepRefs.current[pointKey];
    if (!element) {
      return;
    }

    if (typeof element.scrollIntoView === "function") {
      element.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const hashPointKey = resolvePointKeyFromHash(window.location.hash);
    if (!hashPointKey) {
      return;
    }

    setActivePoint(hashPointKey);

    const element = stepRefs.current[hashPointKey];
    if (!element || typeof element.scrollIntoView !== "function") {
      return;
    }

    window.requestAnimationFrame(() => {
      element.scrollIntoView({
        behavior: "auto",
        block: "start",
      });
    });
  }, []);

  return (
    <>
      <section className="relative overflow-hidden bg-beige-50 pt-32 pb-12 sm:pt-40 sm:pb-16">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute -top-24 right-[-8%] h-72 w-72 rounded-full bg-bordeaux-900/10 blur-3xl" />
          <div className="absolute -bottom-28 left-[-10%] h-80 w-80 rounded-full bg-beige-400/25 blur-3xl" />
        </div>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 select-none font-display text-[18rem] leading-none text-bordeaux-900 opacity-[0.012] sm:text-[24rem] lg:block"
        >
          IV
        </span>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.45]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_20%,rgba(98,25,28,0.08),transparent_42%),radial-gradient(circle_at_78%_70%,rgba(158,113,97,0.14),transparent_48%)]" />
          <div className="absolute inset-0 bg-[repeating-linear-gradient(115deg,rgba(98,25,28,0.03)_0_1px,transparent_1px_16px)]" />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-beige-400/40 to-transparent"
        />

        <Container size="lg">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-8">
              <FadeIn>
                <span className="inline-block text-sm font-medium uppercase tracking-[0.4em] text-accent">
                  {t("badge")}
                </span>
                <div aria-hidden="true" className="my-5 h-px w-10 bg-accent/40" />
                <h1 className="gradient-text font-display text-4xl font-light italic tracking-tight text-balance sm:text-5xl lg:text-6xl">
                  {tDetail("headline")}
                </h1>
              </FadeIn>

              <FadeIn delay={0.07}>
                <p className="mt-5 max-w-3xl text-base leading-relaxed text-text-muted sm:text-lg">
                  {tDetail("subtitle")}
                </p>
                <p className="mt-4 max-w-4xl text-sm leading-relaxed text-text-muted/90 sm:text-base">
                  {t("intro")}
                </p>
              </FadeIn>
            </div>

            <FadeIn delay={0.14} className="lg:col-span-4 lg:pt-4">
              <div className="relative overflow-hidden rounded-2xl border border-beige-400/70 bg-beige-50/80 p-5 shadow-[0_18px_38px_-32px_rgba(98,25,28,0.35)] backdrop-blur-sm sm:p-6">
                <div
                  aria-hidden="true"
                  className={`absolute left-0 right-0 top-0 h-1.5 bg-linear-to-r ${ACCENT_CLASS[activePoint]}`}
                />
                <p className="text-[11px] uppercase tracking-[0.22em] text-bordeaux-900/70">
                  {tDetail("focus_label")}
                </p>
                <p className="mt-2 font-display text-3xl italic text-bordeaux-900 sm:text-4xl">
                  {activePointData.number}
                </p>
                <p className="mt-2 text-sm font-medium leading-snug text-text-primary">
                  {t(`points.${activePointData.key}.title`)}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-text-muted">
                  {t(`points.${activePointData.key}.teaser`)}
                </p>
              </div>
            </FadeIn>
          </div>

          <section aria-label={tDetail("navigation_label")} className="mt-10 sm:mt-12">
            <div className="flex flex-wrap gap-2.5">
              {PLAN_POINTS.map((point) => (
                <button
                  key={`hero-chip-${point.key}`}
                  type="button"
                  onClick={() => handleJumpToPoint(point.key)}
                  aria-pressed={activePoint === point.key}
                  className="rounded-xl p-px bg-linear-to-r from-beige-400/20 via-bordeaux-500/25 to-beige-400/20 transition-shadow duration-300 hover:shadow-[0_4px_20px_-6px_rgba(98,25,28,0.10)]"
                >
                  <span
                    className={`inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                      activePoint === point.key
                        ? "bg-white text-bordeaux-900"
                        : "bg-beige-50/80 text-accent hover:bg-white"
                    }`}
                  >
                    {t(`points.${point.key}.title`)}
                  </span>
                </button>
              ))}
            </div>
          </section>
        </Container>
      </section>

      <section ref={sectionRef} data-scroll-sync-root="true" className="relative bg-white pt-6 pb-16 sm:pt-10 sm:pb-24">
        <Container size="lg">
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-10">
            <aside className="hidden shrink-0 lg:block lg:w-72 xl:w-72">
              <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-2xl p-px bg-linear-to-r from-beige-400/20 via-bordeaux-500/25 to-beige-400/20">
                <div className="rounded-2xl bg-beige-50/80 p-5 backdrop-blur-sm">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-accent">
                    {tDetail("navigation_label")}
                  </p>
                  <div
                    aria-hidden="true"
                    className="mb-4 h-px bg-linear-to-r from-beige-400/40 to-transparent"
                  />
                  <div className="relative">
                    <div
                      aria-hidden="true"
                      className="absolute bottom-2 left-0 top-2 w-0.5 rounded-full bg-beige-200/70"
                    />
                    <motion.div
                      aria-hidden="true"
                      className="absolute left-0 top-2 w-0.5 origin-top rounded-full bg-linear-to-b from-bordeaux-900 via-bordeaux-700 to-beige-400"
                      style={{ scaleY: scrollYProgress, height: "calc(100% - 1rem)" }}
                    />
                    <ul className="space-y-1">
                      {PLAN_POINTS.map((point) => {
                        const isActive = point.key === activePoint;
                        return (
                          <li key={point.key}>
                            <button
                              type="button"
                              onClick={() => handleJumpToPoint(point.key)}
                              aria-pressed={isActive}
                              className={`group relative block w-full overflow-hidden rounded-lg px-3 py-2.5 text-left text-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 ${
                                isActive
                                  ? "bg-bordeaux-900 font-medium text-white shadow-md shadow-bordeaux-900/15"
                                  : "text-text-muted hover:bg-white hover:text-text-primary hover:shadow-sm"
                              }`}
                            >
                              <span
                                aria-hidden="true"
                                className={`absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full transition-all duration-300 ${
                                  isActive
                                    ? "bg-beige-200 opacity-100"
                                    : "bg-bordeaux-900/20 opacity-0 group-hover:opacity-100"
                                }`}
                              />
                              <span className="inline-flex items-baseline gap-2 whitespace-nowrap">
                                <span className="font-display text-xl italic leading-none">
                                  {point.number}
                                </span>
                                <span>{t(`points.${point.key}.title`)}</span>
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </aside>

            <main className="min-w-0 flex-1">
              <div className="mb-10 lg:hidden">
                <div className="rounded-2xl p-px bg-linear-to-r from-beige-400/20 via-bordeaux-500/25 to-beige-400/20">
                  <div className="rounded-2xl bg-beige-50/80 p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.4em] text-accent">
                      {tDetail("navigation_label")}
                    </p>
                    <div
                      aria-hidden="true"
                      className="mb-3 h-px bg-linear-to-r from-beige-400/40 to-transparent"
                    />
                    <div className="flex flex-wrap gap-2">
                      {PLAN_POINTS.map((point) => {
                        const isActive = point.key === activePoint;
                        return (
                          <button
                            key={`mobile-${point.key}`}
                            type="button"
                            onClick={() => handleJumpToPoint(point.key)}
                            aria-pressed={isActive}
                            className={`inline-flex rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 ${
                              isActive
                                ? "bg-bordeaux-900 text-white shadow-md shadow-bordeaux-900/15"
                                : "bg-white text-text-muted ring-1 ring-beige-200 hover:ring-bordeaux-900/20 hover:text-text-primary"
                            }`}
                          >
                            {t(`points.${point.key}.title`)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6 sm:space-y-8">

                {PLAN_POINTS.map((point, pointIndex) => {
                  const pointItemCount = point.subpoints.reduce(
                    (sum, subpointKey) => sum + (SUBPOINT_ITEM_COUNT[subpointKey] ?? 0),
                    0,
                  );
                  const isActive = activePoint === point.key;

                  return (
                    <FadeIn key={point.key} delay={pointIndex * 0.05}>
                      <article
                        id={`plan-step-${point.key}`}
                        ref={(element) => {
                          stepRefs.current[point.key] = element;
                        }}
                        data-point-key={point.key}
                        className={`group/article scroll-mt-28 outline-hidden focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-4 relative overflow-hidden rounded-2xl border px-6 py-10 shadow-[0_22px_46px_-38px_rgba(98,25,28,0.32)] transition-all duration-300 sm:px-8 sm:py-12 lg:px-10 lg:py-14 ${
                          isActive
                            ? "border-beige-400/85 bg-beige-50/88"
                            : "border-beige-400/70 bg-beige-50/70 hover:border-beige-400/85"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute -right-4 top-6 hidden select-none font-display text-[10rem] font-light leading-none text-bordeaux-900 opacity-[0.025] xl:block"
                        >
                          {point.number}
                        </span>
                        <div
                          aria-hidden="true"
                          className={`absolute left-3 top-8 hidden h-4 w-4 rounded-full border-2 sm:block ${
                            isActive
                              ? "border-bordeaux-900 bg-bordeaux-900"
                              : "border-beige-400 bg-white group-hover:border-bordeaux-700/70"
                          }`}
                        />

                        <span className="inline-block text-xs font-semibold uppercase tracking-[0.4em] text-accent">
                          {tDetail("focus_label")}
                        </span>
                        <div aria-hidden="true" className="my-2.5 h-px w-10 bg-accent/40" />

                        <div className="mb-5 flex flex-wrap items-center gap-2.5">
                          <span className="inline-flex items-center rounded-full bg-white/88 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-bordeaux-900/80 shadow-[inset_0_0_0_1px_rgba(98,25,28,0.12)]">
                            {point.number}
                          </span>
                          <span className="inline-flex items-center rounded-full bg-white/88 px-3 py-1 text-xs text-text-muted shadow-[inset_0_0_0_1px_rgba(98,25,28,0.12)]">
                            {point.subpoints.length} {tDetail("subpoints_label")}
                          </span>
                          <span className="inline-flex items-center rounded-full bg-white/88 px-3 py-1 text-xs text-text-muted shadow-[inset_0_0_0_1px_rgba(98,25,28,0.12)]">
                            {pointItemCount} {tDetail("items_label")}
                          </span>
                        </div>

                        <h2 className="gradient-text font-display text-2xl font-light italic tracking-tight sm:text-3xl lg:text-4xl">
                          {t(`points.${point.key}.title`)}
                        </h2>
                        <p className="mt-4 max-w-3xl text-base leading-relaxed text-text-muted sm:text-lg">
                          {t(`points.${point.key}.description`)}
                        </p>

                        <div className="mt-6 space-y-3">
                          {point.subpoints.map((subpointKey) => {
                            const isExpanded = true;
                            return (
                              <div
                                key={subpointKey}
                                className="rounded-xl p-px bg-linear-to-r from-beige-400/20 via-bordeaux-500/25 to-beige-400/20"
                              >
                                <div className="rounded-xl border border-beige-200/85 bg-white p-4">
                                  <button
                                    type="button"
                                    className="flex w-full items-start justify-between gap-3 rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux-700/65 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                                  >
                                    <h3 className="text-sm font-medium leading-snug text-text-primary sm:text-[1.02rem]">
                                      {t(`points.${point.key}.subpoints.${subpointKey}.title`)}
                                    </h3>
                                    <span
                                      aria-hidden="true"
                                      className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full border border-beige-300/75 bg-bordeaux-900/4 text-bordeaux-900"
                                    >
                                      -
                                    </span>
                                  </button>

                                  {isExpanded ? (
                                    <ul className="mt-3 overflow-hidden rounded-xl border border-beige-200/60">
                                      {Array.from({ length: SUBPOINT_ITEM_COUNT[subpointKey] }, (_, itemIndex) => (
                                        <li
                                          key={itemIndex}
                                          className="group/item flex items-baseline gap-3 border-b border-beige-200/60 px-4 py-3 text-sm leading-relaxed text-text-muted transition-colors duration-300 last:border-b-0 hover:bg-beige-50/60"
                                        >
                                          <span
                                            aria-hidden="true"
                                            className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent/40 transition-colors duration-300 group-hover/item:bg-accent/70"
                                          />
                                          <span>
                                            {t(`points.${point.key}.subpoints.${subpointKey}.items.${itemIndex}`)}
                                          </span>
                                        </li>
                                      ))}
                                    </ul>
                                  ) : null}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </article>
                    </FadeIn>
                  );
                })}
              </div>

              <FadeIn delay={0.16}>
                <div className="mt-10 rounded-2xl border border-bordeaux-900/15 bg-linear-to-br from-bordeaux-900 to-bordeaux-700 p-6 text-white sm:p-7">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-beige-200">{t("badge")}</p>
                  <p className="mt-2 font-display text-3xl italic leading-tight sm:text-4xl">
                    {tDetail("cta_panel_title")}
                  </p>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-beige-100/95 sm:text-base">
                    {tDetail("cta_panel_text")}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href="/#contact"
                      className="inline-flex items-center justify-center rounded-xl border border-transparent bg-white px-5 py-2.5 text-sm font-medium text-bordeaux-900 transition-all duration-300 hover:bg-beige-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:ring-offset-2 focus-visible:ring-offset-bordeaux-900"
                    >
                      {tDetail("cta_contact")}
                    </Link>
                    <Link
                      href="/"
                      className="inline-flex items-center justify-center rounded-xl border border-white/55 bg-transparent px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:ring-offset-2 focus-visible:ring-offset-bordeaux-900"
                    >
                      {tDetail("cta_back_home")}
                    </Link>
                  </div>
                </div>
              </FadeIn>
            </main>
          </div>
        </Container>
      </section>
    </>
  );
}
