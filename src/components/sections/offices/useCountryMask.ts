"use client";

import { useCallback, useMemo, useState } from "react";

/**
 * Generates a data-URL mask from an SVG map component (filled regions only).
 * Computed from the rendered SVG map and memoized per hook lifecycle.
 */
export function useCountryMask() {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const ref = useCallback((node: HTMLDivElement | null) => {
    setContainer(node);
  }, []);

  const maskUrl = useMemo(() => {
    if (!container) {
      return null;
    }

    const svg = container.querySelector("svg");
    if (!svg) {
      return null;
    }

    const clone = svg.cloneNode(true) as SVGElement;
    clone.removeAttribute("class");
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.querySelectorAll("path").forEach((p) => {
      if (p.getAttribute("fill") === "none") p.remove();
    });
    clone.querySelectorAll("circle").forEach((c) => c.remove());
    clone.querySelectorAll("g").forEach((g) => {
      g.removeAttribute("class");
      g.setAttribute("fill", "white");
    });

    const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      new XMLSerializer().serializeToString(clone),
    )}`;
    return url;
  }, [container]);

  return { maskUrl, ref };
}
