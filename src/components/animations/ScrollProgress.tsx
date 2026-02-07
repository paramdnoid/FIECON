"use client";

import { motion, useScroll, useReducedMotion } from "motion/react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const prefersReduced = useReducedMotion();

  // Show a static full-width bar instead of hiding the element entirely,
  // so the visual indicator remains present for reduced-motion users.
  if (prefersReduced) {
    return (
      <div
        className="fixed top-0 left-0 right-0 h-[2px] z-[60]"
        style={{
          background: "linear-gradient(90deg, var(--color-bordeaux-900) 0%, var(--color-bordeaux-700) 50%, var(--color-accent) 100%)",
        }}
      />
    );
  }

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left"
      style={{
        scaleX: scrollYProgress,
        background: "linear-gradient(90deg, var(--color-bordeaux-900) 0%, var(--color-bordeaux-700) 50%, var(--color-accent) 100%)",
      }}
    />
  );
}
