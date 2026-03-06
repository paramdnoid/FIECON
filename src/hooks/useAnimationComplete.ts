"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks when a timed animation has completed so subsequent re-renders
 * (e.g. hash navigation) never flash the hidden initial state.
 */
export function useAnimationComplete(
  animateOnMount: boolean,
  durationMs: number,
): boolean {
  const [hasAnimated, setHasAnimated] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (animateOnMount && !hasAnimated) {
      timeoutRef.current = setTimeout(() => setHasAnimated(true), durationMs);
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }
  }, [animateOnMount, hasAnimated, durationMs]);

  return hasAnimated;
}
