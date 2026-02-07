"use client";

import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/constants";

const SECTION_IDS = NAV_LINKS.map((link) => link.href);

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((e) => e.isIntersecting);
        if (intersecting.length > 0) {
          const best = intersecting.reduce((a, b) =>
            a.intersectionRatio > b.intersectionRatio ? a : b,
          );
          setActiveSection(best.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return activeSection;
}
