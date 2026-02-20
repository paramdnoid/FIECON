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

export type DepthConfig = {
  scaleRange: [number, number];
  blurMax: number;
  brightnessRange: [number, number];
  opacityRange: [number, number];
  shadowSpreadMax: number;
  shadowAlphaMax: number;
};

const DEFAULT_DEPTH: DepthConfig = {
  scaleRange: [0.6, 1.0],
  blurMax: 2.5,
  brightnessRange: [0.6, 1.0],
  opacityRange: [0.55, 1.0],
  shadowSpreadMax: 30,
  shadowAlphaMax: 0.25,
};

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
  depth?: DepthConfig;
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
  depth: d = DEFAULT_DEPTH,
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
    const t = (1 + Math.cos(angle)) / 2;
    return d.scaleRange[0] + t * (d.scaleRange[1] - d.scaleRange[0]);
  });

  const zIndex = useTransform(rotation, (r) => {
    const angle = angleStep * index + r;
    const t = (1 + Math.cos(angle)) / 2;
    return Math.round(t * 100);
  });

  const filter = useTransform(rotation, (r) => {
    const angle = angleStep * index + r;
    const t = (1 + Math.cos(angle)) / 2;
    const brightness = d.brightnessRange[0] + t * (d.brightnessRange[1] - d.brightnessRange[0]);
    const blur = (1 - t) * d.blurMax;
    return `brightness(${brightness}) blur(${blur}px)`;
  });

  const opacity = useTransform(rotation, (r) => {
    const angle = angleStep * index + r;
    const t = (1 + Math.cos(angle)) / 2;
    return d.opacityRange[0] + t * (d.opacityRange[1] - d.opacityRange[0]);
  });

  const boxShadow = useTransform(rotation, (r) => {
    const angle = angleStep * index + r;
    const t = (1 + Math.cos(angle)) / 2;
    const spread = Math.round(t * d.shadowSpreadMax);
    const alpha = (t * d.shadowAlphaMax).toFixed(2);
    return `0 ${spread}px ${spread * 2}px rgba(98, 25, 28, ${alpha})`;
  });

  return (
    <motion.div
      suppressHydrationWarning
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
