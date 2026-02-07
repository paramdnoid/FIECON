"use client";

import { useEffect } from "react";
import { NAV_LINKS } from "@/lib/constants";

const SECTION_IDS = new Set<string>(NAV_LINKS.map((link) => link.href));

export function ScrollToSection() {
  useEffect(() => {
    const fromPath = window.location.pathname.replace("/", "");
    const fromHash = window.location.hash.replace("#", "");
    const section = SECTION_IDS.has(fromPath)
      ? fromPath
      : SECTION_IDS.has(fromHash)
        ? fromHash
        : null;

    if (section) {
      const timer = setTimeout(() => {
        const el = document.getElementById(section);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 96;
          window.scrollTo({ top, behavior: "instant" });
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, []);

  return null;
}
