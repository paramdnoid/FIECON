"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

type Props = {
  children: ReactNode;
  direction?: "left" | "right" | "bottom" | "top";
  delay?: number;
  duration?: number;
  className?: string;
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
}: Props) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  const clip = clipPaths[direction];

  return (
    <motion.div
      initial={{ clipPath: clip.hidden, opacity: 0 }}
      whileInView={{ clipPath: clip.visible, opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
