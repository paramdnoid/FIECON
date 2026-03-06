"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { EASE_OUT_EXPO } from "@/lib/constants";
import { useAnimationComplete } from "@/hooks/useAnimationComplete";

type Props = {
  children: ReactNode;
  direction?: "left" | "right" | "bottom" | "top";
  delay?: number;
  duration?: number;
  className?: string;
  animateOnMount?: boolean;
};

const clipPaths = {
  left: { hidden: "inset(0 100% 0 0)", visible: "inset(0 0% 0 0)" },
  right: { hidden: "inset(0 0 0 100%)", visible: "inset(0 0 0 0%)" },
  bottom: { hidden: "inset(0 0 100% 0)", visible: "inset(0 0 0% 0)" },
  top: { hidden: "inset(100% 0 0 0)", visible: "inset(0% 0 0 0)" },
};

export function SlideReveal({
  children,
  direction = "bottom",
  delay = 0,
  duration = 0.8,
  className = "",
  animateOnMount = false,
}: Props) {
  const prefersReduced = useReducedMotion();
  const hasAnimated = useAnimationComplete(animateOnMount, (delay + duration) * 1000);

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  // After animation completes, render a plain div so hash-navigation
  // re-renders never flash the clipped initial state.
  if (animateOnMount && hasAnimated) {
    return <div className={className}>{children}</div>;
  }

  const clip = clipPaths[direction];

  return (
    <motion.div
      initial={{ clipPath: clip.hidden, opacity: 0 }}
      {...(animateOnMount
        ? { animate: { clipPath: clip.visible, opacity: 1 } }
        : { whileInView: { clipPath: clip.visible, opacity: 1 }, viewport: { once: true, margin: "0px" } }
      )}
      transition={{
        duration,
        delay,
        ease: EASE_OUT_EXPO,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
