"use client";

import React from "react";
import { useReducedMotion, useScroll } from "motion/react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import {
  FOUR_POINT_PLAN_POINTS,
  type FourPointPlanPointKey,
} from "@/components/sections/four-point-plan/plan-data";
import { PlanDetailHero } from "@/components/sections/four-point-plan/PlanDetailHero";
import { PlanDetailDesktopNav } from "@/components/sections/four-point-plan/PlanDetailDesktopNav";
import { PlanDetailMobileNav } from "@/components/sections/four-point-plan/PlanDetailMobileNav";
import { PlanDetailStepCard } from "@/components/sections/four-point-plan/PlanDetailStepCard";
import { PlanDetailCta } from "@/components/sections/four-point-plan/PlanDetailCta";
import { usePlanStepSync } from "@/components/sections/four-point-plan/usePlanStepSync";

export function FourPointPlanDetail() {
  const t = useTranslations("fourPointPlan");
  const tDetail = useTranslations("fourPointPlan.detail");
  const prefersReducedMotion = useReducedMotion();
  const {
    activePoint,
    activePointData,
    sectionRef,
    registerStepRef,
    handleJumpToPoint,
  } = usePlanStepSync(Boolean(prefersReducedMotion));
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.82", "end 0.2"],
  });

  return (
    <>
      <PlanDetailHero
        t={t}
        tDetail={tDetail}
        activePoint={activePoint}
        activePointData={activePointData}
        onJumpToPoint={handleJumpToPoint}
      />

      <section ref={sectionRef} data-scroll-sync-root="true" className="relative bg-white pt-6 pb-16 sm:pt-10 sm:pb-24">
        <Container size="lg">
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-10">
            <PlanDetailDesktopNav
              t={t}
              tDetail={tDetail}
              activePoint={activePoint}
              onJumpToPoint={handleJumpToPoint}
              scrollYProgress={scrollYProgress}
            />

            <main className="min-w-0 flex-1">
              <PlanDetailMobileNav
                t={t}
                tDetail={tDetail}
                activePoint={activePoint}
                onJumpToPoint={handleJumpToPoint}
              />

              <div className="space-y-6 sm:space-y-8">
                {FOUR_POINT_PLAN_POINTS.map((point, pointIndex) => {
                  const isActive = activePoint === point.key;

                  return (
                    <PlanDetailStepCard
                      key={point.key}
                      point={point}
                      pointIndex={pointIndex}
                      isActive={isActive}
                      t={t}
                      tDetail={tDetail}
                      registerStepRef={registerStepRef}
                    />
                  );
                })}
              </div>

              <PlanDetailCta t={t} tDetail={tDetail} />
            </main>
          </div>
        </Container>
      </section>
    </>
  );
}
