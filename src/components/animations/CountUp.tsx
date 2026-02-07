"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useInView,
  useReducedMotion,
} from "motion/react";
import { EASE_OUT_EXPO } from "@/lib/constants";

type Props = {
  from?: number;
  to: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
};

export function CountUp({
  from = 0,
  to,
  duration = 2,
  delay = 0,
  suffix = "",
  prefix = "",
  className = "",
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReduced = useReducedMotion();
  const motionValue = useMotionValue(from);
  const rounded = useTransform(motionValue, (v) => Math.round(v));

  useEffect(() => {
    if (!isInView) return;

    if (prefersReduced) {
      motionValue.set(to);
      return;
    }

    const controls = animate(motionValue, to, {
      duration,
      delay,
      ease: EASE_OUT_EXPO,
    });

    return controls.stop;
  }, [isInView, to, duration, delay, motionValue, prefersReduced]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}
