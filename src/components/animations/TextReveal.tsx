"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { EASE_OUT_EXPO } from "@/lib/constants";

type Props = {
  children: string;
  delay?: number;
  staggerDelay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  animateOnMount?: boolean;
};

export function TextReveal({
  children,
  delay = 0,
  staggerDelay = 0.08,
  as: Tag = "span",
  className = "",
  animateOnMount = false,
}: Props) {
  const prefersReduced = useReducedMotion();
  const words = children.split(" ");
  const [hasAnimated, setHasAnimated] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Track when the entrance animation has completed so re-renders
  // (e.g. hash navigation) never flash the hidden initial state.
  useEffect(() => {
    if (animateOnMount && !hasAnimated) {
      const totalDuration = (delay + (words.length - 1) * staggerDelay + 0.7) * 1000;
      timeoutRef.current = setTimeout(() => setHasAnimated(true), totalDuration);
      return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
    }
  }, [animateOnMount, hasAnimated, delay, staggerDelay, words.length]);

  if (prefersReduced) {
    return <Tag className={className}>{children}</Tag>;
  }

  // After the initial animation completes, render without motion wrappers
  // so hash-navigation re-renders can never reset the text to invisible.
  if (animateOnMount && hasAnimated) {
    return (
      <Tag className={className}>
        {words.map((word, i) => (
          <span key={i} className="inline-block">
            <span className="inline-block">{word}</span>
            {i < words.length - 1 && "\u00A0"}
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.15em]">
          <motion.span
            className="inline-block"
            initial={{ y: "100%", opacity: 0 }}
            {...(animateOnMount
              ? { animate: { y: "0%", opacity: 1 } }
              : { whileInView: { y: "0%", opacity: 1 }, viewport: { once: true, margin: "-80px" } }
            )}
            transition={{
              duration: 0.7,
              delay: delay + i * staggerDelay,
              ease: EASE_OUT_EXPO,
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && "\u00A0"}
        </span>
      ))}
    </Tag>
  );
}
