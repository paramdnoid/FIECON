"use client";

import { useEffect, useState } from "react";
import { GESETZE_DOCS_SECTION_IDS, type GesetzDocsSectionId } from "./gesetze-docs.config";

const SECTION_ID_SET = new Set<GesetzDocsSectionId>(GESETZE_DOCS_SECTION_IDS);

function getInitialSectionId(): GesetzDocsSectionId {
  if (typeof window === "undefined") {
    return GESETZE_DOCS_SECTION_IDS[0];
  }

  const hash = window.location.hash.replace("#", "") as GesetzDocsSectionId;
  return GESETZE_DOCS_SECTION_IDS.includes(hash) ? hash : GESETZE_DOCS_SECTION_IDS[0];
}

export function useGesetzeScrollSpy() {
  const [activeSection, setActiveSection] = useState<GesetzDocsSectionId>(() => getInitialSectionId());

  useEffect(() => {
    // Ensure hash-based section is applied immediately on client mount.
    setActiveSection(getInitialSectionId());
    let suppressScrollSpyUntil = 0;
    let lockToHashUntilUserInput = false;

    const syncFromHash = () => {
      const hash = window.location.hash.replace("#", "") as GesetzDocsSectionId;
      if (!SECTION_ID_SET.has(hash)) {
        return;
      }

      suppressScrollSpyUntil = Date.now() + 900;
      lockToHashUntilUserInput = true;
      setActiveSection((prev) => (prev === hash ? prev : hash));
    };

    syncFromHash();

    const getAnchorOffset = () => {
      // Header (h-20 / h-24) + safety spacing for stable section switching.
      return window.matchMedia("(min-width: 1024px)").matches ? 140 : 112;
    };

    const updateActiveFromScroll = () => {
      if (Date.now() < suppressScrollSpyUntil) {
        return;
      }

      const offset = getAnchorOffset();
      const probeLine = offset + 1;
      const hash = window.location.hash.replace("#", "") as GesetzDocsSectionId;
      const hashIsKnown = SECTION_ID_SET.has(hash);

      if (hashIsKnown) {
        if (lockToHashUntilUserInput) {
          setActiveSection((prev) => (prev === hash ? prev : hash));
          return;
        }

        const hashSection = document.getElementById(hash);
        if (hashSection) {
          const hashTop = hashSection.getBoundingClientRect().top;
          const isInUpperViewport = hashTop >= -8 && hashTop <= window.innerHeight * 0.6;

          // Prioritize direct anchor targets (e.g. click on #kwg) so TOC doesn't briefly fall back.
          if (isInUpperViewport) {
            setActiveSection((prev) => (prev === hash ? prev : hash));
            return;
          }
        }
      }

      const sections = GESETZE_DOCS_SECTION_IDS
        .map((id) => {
          const element = document.getElementById(id);
          if (!element) {
            return null;
          }

          return {
            id,
            top: element.getBoundingClientRect().top,
          };
        })
        .filter((entry): entry is { id: GesetzDocsSectionId; top: number } => entry !== null);

      if (sections.length === 0) {
        return;
      }

      let nextActive = sections[0].id;

      for (const section of sections) {
        if (section.top <= probeLine) {
          nextActive = section.id;
        } else {
          break;
        }
      }

      setActiveSection((prev) => (prev === nextActive ? prev : nextActive));
    };

    let rafId: number | null = null;
    const scheduleUpdate = () => {
      if (rafId !== null) {
        return;
      }

      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        updateActiveFromScroll();
      });
    };

    const onHashChange = () => {
      syncFromHash();
      scheduleUpdate();
    };

    const unlockHashLockOnUserInput = () => {
      lockToHashUntilUserInput = false;
      scheduleUpdate();
    };

    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("wheel", unlockHashLockOnUserInput, { passive: true });
    window.addEventListener("touchstart", unlockHashLockOnUserInput, { passive: true });
    window.addEventListener("keydown", unlockHashLockOnUserInput);

    // Initial passes after mount/layout.
    syncFromHash();
    scheduleUpdate();
    window.setTimeout(() => {
      syncFromHash();
      scheduleUpdate();
    }, 80);
    window.setTimeout(() => {
      syncFromHash();
      scheduleUpdate();
    }, 220);
    window.setTimeout(() => {
      syncFromHash();
      scheduleUpdate();
    }, 500);

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("wheel", unlockHashLockOnUserInput);
      window.removeEventListener("touchstart", unlockHashLockOnUserInput);
      window.removeEventListener("keydown", unlockHashLockOnUserInput);
    };
  }, []);

  return activeSection;
}
