"use client";

import { useEffect } from "react";
import { NAV_LINKS } from "@/lib/constants";

const SECTION_IDS = new Set<string>(NAV_LINKS.map((link) => link.href));

export function ScrollToSection() {
  useEffect(() => {
    const section = window.location.pathname.replace("/", "");
    if (section && SECTION_IDS.has(section)) {
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
