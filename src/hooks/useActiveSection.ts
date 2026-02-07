"use client";

import { useEffect, useRef, useState } from "react";
import { NAV_LINKS, HEADER_HEIGHT } from "@/lib/constants";

const SECTION_IDS = NAV_LINKS.map((link) => link.href);

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState<string>("");
  const lastUrlSection = useRef<string>("");
  const mountedAt = useRef(0);

  useEffect(() => {
    mountedAt.current = Date.now();

    // Use scroll-based detection: the active section is whichever section's
    // top edge is closest to (but above) the detection line (header + offset).
    const DETECTION_OFFSET = 100; // px below header

    const handleScroll = () => {
      let best: string = "";
      let bestDistance = Infinity;

      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const topRelative = rect.top - HEADER_HEIGHT - DETECTION_OFFSET;

        // Section top is above or at the detection line, and section bottom is below it
        if (topRelative <= 0 && rect.bottom > HEADER_HEIGHT) {
          const distance = Math.abs(topRelative);
          if (distance < bestDistance) {
            bestDistance = distance;
            best = id;
          }
        }
      }

      setActiveSection(best);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync URL hash with active section (delay on mount to allow ScrollToSection to work first)
  useEffect(() => {
    const timeSinceMount = Date.now() - mountedAt.current;
    const delay = timeSinceMount < 300 ? 300 - timeSinceMount : 0;

    const timer = setTimeout(() => {
      const newHash = activeSection ? `#${activeSection}` : "";
      if (newHash !== lastUrlSection.current) {
        lastUrlSection.current = newHash;
        const basePath = window.location.pathname;
        window.history.replaceState(null, "", basePath + newHash);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [activeSection]);

  return activeSection;
}
