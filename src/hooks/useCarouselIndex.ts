"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

export function useCarouselIndex(
  itemCount: number
): [RefObject<HTMLDivElement | null>, number] {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = Array.from(
      container.querySelectorAll<HTMLElement>("[data-carousel-item]")
    );

    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const index = items.indexOf(entry.target as HTMLElement);
            if (index !== -1) setActiveIndex(index);
          }
        }
      },
      {
        root: container,
        threshold: 0.5,
      }
    );

    for (const item of items) {
      observer.observe(item);
    }

    return () => observer.disconnect();
  }, [itemCount]);

  return [containerRef, activeIndex];
}
