"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMotionValue, animate, useReducedMotion } from "motion/react";

const TWO_PI = Math.PI * 2;

const CAROUSEL_SPRING = {
  type: "spring" as const,
  stiffness: 180,
  damping: 28,
  mass: 1.2,
};

export type UseEllipseCarouselOptions = {
  count: number;
  autoPlayMs?: number;
};

export function useEllipseCarousel({
  count,
  autoPlayMs = 5000,
}: UseEllipseCarouselOptions) {
  const angleStep = TWO_PI / count;
  const rotation = useMotionValue(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReduced = useReducedMotion();
  const pausedRef = useRef(false);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (index: number) => {
      const target = -angleStep * index;
      const current = rotation.get();

      let diff = target - current;
      diff = ((diff + Math.PI) % TWO_PI + TWO_PI) % TWO_PI - Math.PI;

      if (prefersReduced) {
        rotation.set(current + diff);
      } else {
        animate(rotation, current + diff, CAROUSEL_SPRING);
      }
      setActiveIndex(index);
    },
    [angleStep, rotation, prefersReduced],
  );

  const next = useCallback(() => {
    goTo((activeIndex + 1) % count);
  }, [goTo, activeIndex, count]);

  const prev = useCallback(() => {
    goTo((activeIndex - 1 + count) % count);
  }, [goTo, activeIndex, count]);

  const pauseAutoPlay = useCallback(() => {
    pausedRef.current = true;
  }, []);

  const resumeAutoPlay = useCallback(() => {
    pausedRef.current = false;
  }, []);

  useEffect(() => {
    if (autoPlayMs <= 0) return;

    autoPlayRef.current = setInterval(() => {
      if (pausedRef.current) return;
      setActiveIndex((prev) => {
        const nextIdx = (prev + 1) % count;
        const target = -angleStep * nextIdx;
        const current = rotation.get();
        let diff = target - current;
        diff = ((diff + Math.PI) % TWO_PI + TWO_PI) % TWO_PI - Math.PI;
        animate(rotation, current + diff, CAROUSEL_SPRING);
        return nextIdx;
      });
    }, autoPlayMs);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [autoPlayMs, count, angleStep, rotation]);

  return {
    rotation,
    activeIndex,
    angleStep,
    goTo,
    next,
    prev,
    pauseAutoPlay,
    resumeAutoPlay,
  };
}
