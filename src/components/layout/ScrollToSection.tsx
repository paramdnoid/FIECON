"use client";

import { useEffect, useMemo } from "react";
import { useLocale } from "next-intl";
import { getNavLinks } from "@/lib/constants";
import { scrollToSection } from "@/lib/utils";

export function ScrollToSection() {
  const locale = useLocale();
  const sectionIds = useMemo(
    () => new Set<string>(getNavLinks(locale).map((link) => link.href)),
    [locale],
  );

  useEffect(() => {
    // Extract section from path: e.g. /de/about → about, /en/services → services
    const pathSegments = window.location.pathname.split("/").filter(Boolean);
    const fromPath = pathSegments.length > 1 ? pathSegments[pathSegments.length - 1] : "";
    const fromHash = window.location.hash.replace("#", "");
    const section = sectionIds.has(fromPath)
      ? fromPath
      : sectionIds.has(fromHash)
        ? fromHash
        : null;

    if (section) {
      const timer = setTimeout(() => {
        scrollToSection(section, "instant");
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [sectionIds]);

  return null;
}
