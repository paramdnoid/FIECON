"use client";

import { useEffect, useRef, useState } from "react";

const _maskCache: Record<string, string> = {};

/**
 * Generates a data-URL mask from an SVG map component (filled regions only).
 * Cached per country code so each mask is only computed once.
 */
export function useCountryMask(countryCode: string) {
  const [maskUrl, setMaskUrl] = useState(_maskCache[countryCode] ?? null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (_maskCache[countryCode]) {
      setMaskUrl(_maskCache[countryCode]);
      return;
    }
    if (!ref.current) return;
    const svg = ref.current.querySelector("svg");
    if (!svg) return;

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
    _maskCache[countryCode] = url;
    setMaskUrl(url);
  }, [countryCode]);

  return { maskUrl, ref };
}
