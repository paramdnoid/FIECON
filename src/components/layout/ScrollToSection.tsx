"use client";

import { useEffect } from "react";
import { NAV_LINKS } from "@/lib/constants";
import { scrollToSection } from "@/lib/utils";

const SECTION_IDS = new Set<string>(NAV_LINKS.map((link) => link.href));

export function ScrollToSection() {
  useEffect(() => {
    // Extract section from path: e.g. /de/about → about, /en/services → services
    const pathSegments = window.location.pathname.split("/").filter(Boolean);
    const fromPath = pathSegments.length > 1 ? pathSegments[pathSegments.length - 1] : "";
    const fromHash = window.location.hash.replace("#", "");
    const section = SECTION_IDS.has(fromPath)
      ? fromPath
      : SECTION_IDS.has(fromHash)
        ? fromHash
        : null;

    if (section) {
      const timer = setTimeout(() => {
        scrollToSection(section, "instant");
      }, 50);
      return () => clearTimeout(timer);
    }
  }, []);

  return null;
}
