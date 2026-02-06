"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

type Props = {
  children: string;
  delay?: number;
  staggerDelay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
};

export function TextReveal({
  children,
  delay = 0,
  staggerDelay = 0.08,
  as: Tag = "span",
  className = "",
}: Props) {
  const prefersReduced = useReducedMotion();
  const words = children.split(" ");

  if (prefersReduced) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: "100%", opacity: 0 }}
            whileInView={{ y: "0%", opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.7,
              delay: delay + i * staggerDelay,
              ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
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
