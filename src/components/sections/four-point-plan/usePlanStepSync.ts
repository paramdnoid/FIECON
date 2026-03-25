"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  FOUR_POINT_PLAN_POINTS,
  type FourPointPlanPointKey,
} from "@/components/sections/four-point-plan/plan-data";

type StepRefMap = Partial<Record<FourPointPlanPointKey, HTMLElement | null>>;

function resolvePointKeyFromHash(hash: string): FourPointPlanPointKey | null {
  const rawHash = hash.replace(/^#/, "");
  const normalized = rawHash.startsWith("plan-step-")
    ? rawHash.replace("plan-step-", "")
    : rawHash;
  const key = normalized as FourPointPlanPointKey;

  return FOUR_POINT_PLAN_POINTS.some((point) => point.key === key) ? key : null;
}

export function usePlanStepSync(prefersReducedMotion: boolean) {
  const [activePoint, setActivePoint] = useState<FourPointPlanPointKey>(FOUR_POINT_PLAN_POINTS[0].key);
  const sectionRef = useRef<HTMLElement | null>(null);
  const stepRefs = useRef<StepRefMap>({});

  const activePointData = useMemo(
    () => FOUR_POINT_PLAN_POINTS.find((point) => point.key === activePoint) ?? FOUR_POINT_PLAN_POINTS[0],
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
          FOUR_POINT_PLAN_POINTS.length - 1,
          Math.floor(progress * FOUR_POINT_PLAN_POINTS.length),
        );
        const nextPoint = FOUR_POINT_PLAN_POINTS[nextPointIndex];
        if (nextPoint) {
          setActivePoint(nextPoint.key);
          return;
        }
      }

      const anchorY = viewportHeight * 0.32;
      let nearestKey: FourPointPlanPointKey = FOUR_POINT_PLAN_POINTS[0].key;
      let nearestDistance = Number.POSITIVE_INFINITY;
      for (const point of FOUR_POINT_PLAN_POINTS) {
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
        const key = mostVisible?.target.getAttribute("data-point-key") as FourPointPlanPointKey | null;
        if (key) {
          setActivePoint(key);
        }
      },
      {
        threshold: [0.35, 0.55, 0.75],
        rootMargin: "-18% 0px -42% 0px",
      },
    );

    for (const point of FOUR_POINT_PLAN_POINTS) {
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

  const handleJumpToPoint = (pointKey: FourPointPlanPointKey) => {
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

  const registerStepRef = (pointKey: FourPointPlanPointKey, element: HTMLElement | null) => {
    stepRefs.current[pointKey] = element;
  };

  return {
    activePoint,
    activePointData,
    sectionRef,
    registerStepRef,
    handleJumpToPoint,
  };
}
