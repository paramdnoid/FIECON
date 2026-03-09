"use client";

import type { MouseEvent } from "react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { GESETZE_DOCS_SECTIONS, type GesetzDocsSectionId } from "./gesetze-docs.config";

type Props = {
  activeSection: GesetzDocsSectionId;
  mobile?: boolean;
};

export function GesetzeDocsToc({ activeSection, mobile = false }: Props) {
  const t = useTranslations("gesetze_page");
  const [hashSection, setHashSection] = useState<GesetzDocsSectionId | undefined>(undefined);

  useEffect(() => {
    const syncHashSection = () => {
      const next = window.location.hash.replace("#", "") as GesetzDocsSectionId;
      setHashSection(next);
    };

    syncHashSection();
    window.addEventListener("hashchange", syncHashSection);
    return () => window.removeEventListener("hashchange", syncHashSection);
  }, []);
  const resolvedActiveSection =
    activeSection === "overview" &&
    hashSection &&
    hashSection !== "overview" &&
    GESETZE_DOCS_SECTIONS.some((section) => section.id === hashSection)
      ? hashSection
      : activeSection;

  const links = GESETZE_DOCS_SECTIONS.map((section) => ({
    id: section.id,
    label: t(section.labelKey),
  }));

  const handleAnchorClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const hash = event.currentTarget.getAttribute("href");
    if (!hash) {
      return;
    }

    const sectionId = hash.replace("#", "");
    window.requestAnimationFrame(() => {
      const section = document.getElementById(sectionId);
      section?.focus({ preventScroll: true });
    });
  };

  if (mobile) {
    return (
      <nav
        aria-label={t("breadcrumb_current")}
        className="rounded-2xl p-px bg-linear-to-r from-beige-400/20 via-bordeaux-500/25 to-beige-400/20"
      >
        <div className="rounded-2xl bg-beige-50/80 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.4em] text-accent">
            {t("breadcrumb_current")}
          </p>
          <div aria-hidden="true" className="mb-3 h-px bg-linear-to-r from-beige-400/40 to-transparent" />
          <ul className="flex flex-wrap gap-2">
            {links.map((link) => {
              const isActive = resolvedActiveSection === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={handleAnchorClick}
                    aria-current={isActive ? "location" : undefined}
                    className={`inline-flex rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 ${
                      isActive
                        ? "bg-bordeaux-900 text-white shadow-md shadow-bordeaux-900/15"
                        : "bg-white text-text-muted ring-1 ring-beige-200 hover:ring-bordeaux-900/20 hover:text-text-primary"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    );
  }

  return (
    <nav
      aria-label={t("breadcrumb_current")}
      className="rounded-2xl p-px bg-linear-to-r from-beige-400/20 via-bordeaux-500/25 to-beige-400/20"
    >
      <div className="rounded-2xl bg-beige-50/80 p-5 backdrop-blur-sm">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-accent">
          {t("breadcrumb_current")}
        </p>
        <div
          aria-hidden="true"
          className="mb-4 h-px bg-linear-to-r from-beige-400/40 to-transparent"
        />
        <ul className="space-y-1">
          {links.map((link) => {
          const isActive = resolvedActiveSection === link.id;
            return (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={handleAnchorClick}
                  aria-current={isActive ? "location" : undefined}
                  className={`group relative block rounded-lg px-3 py-2.5 text-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 ${
                    isActive
                      ? "bg-bordeaux-900 font-medium text-white shadow-md shadow-bordeaux-900/15"
                      : "text-text-muted hover:bg-white hover:text-text-primary hover:shadow-sm"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-full transition-all duration-300 ${
                      isActive
                        ? "bg-beige-200 opacity-100"
                        : "bg-bordeaux-900/20 opacity-0 group-hover:opacity-100"
                    }`}
                  />
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
