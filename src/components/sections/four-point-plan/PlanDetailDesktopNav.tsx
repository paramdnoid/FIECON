"use client";

import { motion, type MotionValue } from "motion/react";
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
  scrollYProgress: MotionValue<number>;
};

export function PlanDetailDesktopNav({
  t,
  tDetail,
  activePoint,
  onJumpToPoint,
  scrollYProgress,
}: Props) {
  return (
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
              {FOUR_POINT_PLAN_POINTS.map((point) => {
                const isActive = point.key === activePoint;
                return (
                  <li key={point.key}>
                    <button
                      type="button"
                      onClick={() => onJumpToPoint(point.key)}
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
  );
}
