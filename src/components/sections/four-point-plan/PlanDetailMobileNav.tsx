"use client";

import {
  FOUR_POINT_PLAN_POINTS,
  type FourPointPlanPointKey,
} from "@/components/sections/four-point-plan/plan-data";

type TranslateFn = (key: string) => string;

type Props = {
  t: TranslateFn;
  tDetail: TranslateFn;
  activePoint: FourPointPlanPointKey;
  onJumpToPoint: (pointKey: FourPointPlanPointKey) => void;
};

export function PlanDetailMobileNav({
  t,
  tDetail,
  activePoint,
  onJumpToPoint,
}: Props) {
  return (
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
            {FOUR_POINT_PLAN_POINTS.map((point) => {
              const isActive = point.key === activePoint;
              return (
                <button
                  key={`mobile-${point.key}`}
                  type="button"
                  onClick={() => onJumpToPoint(point.key)}
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
  );
}
