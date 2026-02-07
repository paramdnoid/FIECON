"use client";

import { useEffect, useRef, useState } from "react";
import { NAV_LINKS } from "@/lib/constants";

const SECTION_IDS = NAV_LINKS.map((link) => link.href);

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState<string>("");
  const lastUrlSection = useRef<string>("");
  const mountedAt = useRef(0);

  useEffect(() => {
    mountedAt.current = Date.now();

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((e) => e.isIntersecting);
        if (intersecting.length > 0) {
          const best = intersecting.reduce((a, b) =>
            a.intersectionRatio > b.intersectionRatio ? a : b,
          );
          setActiveSection(best.target.id);
        } else {
          setActiveSection("");
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

  // Sync URL with active section (delay on mount to allow ScrollToSection to work first)
  useEffect(() => {
    const timeSinceMount = Date.now() - mountedAt.current;
    const delay = timeSinceMount < 300 ? 300 - timeSinceMount : 0;

    const timer = setTimeout(() => {
      const newPath = activeSection ? `/${activeSection}` : "/";
      if (newPath !== lastUrlSection.current) {
        lastUrlSection.current = newPath;
        window.history.replaceState(null, "", newPath);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [activeSection]);

  return activeSection;
}
