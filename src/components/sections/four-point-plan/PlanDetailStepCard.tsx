"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import {
  FOUR_POINT_PLAN_SUBPOINT_ITEM_COUNT,
  type FourPointPlanPoint,
  type FourPointPlanPointKey,
} from "@/components/sections/four-point-plan/plan-data";

type TranslateFn = (key: string) => string;

type Props = {
  point: FourPointPlanPoint;
  pointIndex: number;
  isActive: boolean;
  t: TranslateFn;
  tDetail: TranslateFn;
  registerStepRef: (pointKey: FourPointPlanPointKey, element: HTMLElement | null) => void;
};

export function PlanDetailStepCard({
  point,
  pointIndex,
  isActive,
  t,
  tDetail,
  registerStepRef,
}: Props) {
  const pointItemCount = point.subpoints.reduce(
    (sum, subpointKey) => sum + (FOUR_POINT_PLAN_SUBPOINT_ITEM_COUNT[subpointKey] ?? 0),
    0,
  );

  return (
    <FadeIn delay={pointIndex * 0.05}>
      <article
        id={`plan-step-${point.key}`}
        ref={(element) => {
          registerStepRef(point.key, element);
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
                      {Array.from({ length: FOUR_POINT_PLAN_SUBPOINT_ITEM_COUNT[subpointKey] }, (_, itemIndex) => (
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
}
