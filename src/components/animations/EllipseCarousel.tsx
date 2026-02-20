"use client";

import type { ReactNode } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";

const TWO_PI = Math.PI * 2;

type EllipseCarouselProps = {
  children: ReactNode;
  containerHeight: number;
};

export function EllipseCarousel({
  children,
  containerHeight,
}: EllipseCarouselProps) {
  return (
    <div
      className="relative w-full"
      style={{ height: containerHeight }}
    >
      {children}
    </div>
  );
}

type EllipseCardProps = {
  index: number;
  totalCount: number;
  rotation: MotionValue<number>;
  radiusX: number;
  radiusY: number;
  onClick: () => void;
  children: ReactNode;
  cardWidth: number;
  cardHeight: number;
};

export function EllipseCard({
  index,
  totalCount,
  rotation,
  radiusX,
  radiusY,
  onClick,
  children,
  cardWidth,
  cardHeight,
}: EllipseCardProps) {
  const angleStep = TWO_PI / totalCount;

  const x = useTransform(rotation, (r) => {
    const angle = angleStep * index + r;
    return Math.sin(angle) * radiusX;
  });

  const y = useTransform(rotation, (r) => {
    const angle = angleStep * index + r;
    return -Math.cos(angle) * radiusY;
  });

  const scale = useTransform(rotation, (r) => {
    const angle = angleStep * index + r;
    const depth = (1 + Math.cos(angle)) / 2;
    return 0.6 + depth * 0.4;
  });

  const zIndex = useTransform(rotation, (r) => {
    const angle = angleStep * index + r;
    const depth = (1 + Math.cos(angle)) / 2;
    return Math.round(depth * 100);
  });

  const filter = useTransform(rotation, (r) => {
    const angle = angleStep * index + r;
    const depth = (1 + Math.cos(angle)) / 2;
    const brightness = 0.6 + depth * 0.4;
    const blur = (1 - depth) * 2.5;
    return `brightness(${brightness}) blur(${blur}px)`;
  });

  const opacity = useTransform(rotation, (r) => {
    const angle = angleStep * index + r;
    const depth = (1 + Math.cos(angle)) / 2;
    return 0.55 + depth * 0.45;
  });

  const boxShadow = useTransform(rotation, (r) => {
    const angle = angleStep * index + r;
    const depth = (1 + Math.cos(angle)) / 2;
    const spread = Math.round(depth * 30);
    const alpha = (depth * 0.25).toFixed(2);
    return `0 ${spread}px ${spread * 2}px rgba(98, 25, 28, ${alpha})`;
  });

  return (
    <motion.div
      style={{
        x,
        y,
        scale,
        zIndex,
        filter,
        opacity,
        boxShadow,
        position: "absolute",
        left: "50%",
        top: "50%",
        width: cardWidth,
        marginLeft: -(cardWidth / 2),
        marginTop: -(cardHeight / 2),
        willChange: "transform, filter, opacity",
      }}
      onClick={onClick}
      className="cursor-pointer rounded-2xl"
      role="group"
      aria-roledescription="slide"
    >
      {children}
    </motion.div>
  );
}
