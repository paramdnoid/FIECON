"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useActiveSection } from "@/hooks/useActiveSection";
import { COMPANY, NAV_LINKS } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { ScrollProgress } from "@/components/animations/ScrollProgress";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useScrollProgress();
  const activeSection = useActiveSection();
  const t = useTranslations("nav");

  return (
    <>
      <ScrollProgress />
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-border-subtle"
            : "bg-transparent"
        }`}
      >
        <Container size="lg">
          <div className="flex items-center justify-between h-24">
            {/* Logo */}
            <button
              type="button"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                window.history.replaceState(null, "", "/");
              }}
              className="flex items-center gap-3 cursor-pointer"
              aria-label={t("home")}
            >
              <Image
                src="/logo.svg"
                alt={COMPANY.name}
                width={36}
                height={36}
                priority
              />
              <span className="font-display text-xl font-normal gradient-text-hero tracking-tight">
                {COMPANY.name}
              </span>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.href;
                return (
                  <a
                    key={link.id}
                    href={`#${link.href}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById(link.href);
                      if (el) {
                        const top = el.getBoundingClientRect().top + window.scrollY - 96;
                        window.scrollTo({ top, behavior: "smooth" });
                      }
                    }}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative text-xs font-medium tracking-widest uppercase transition-colors duration-400 group ${
                      isActive ? "text-bordeaux-900" : "text-text-muted hover:text-bordeaux-900"
                    }`}
                  >
                    {t(link.id)}
                    <span className={`absolute -bottom-1 left-0 h-px bg-accent transition-all duration-400 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`} />
                  </a>
                );
              })}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-4">
              <div className="hidden lg:block">
                <LanguageSwitcher />
              </div>

              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 text-text-primary hover:text-bordeaux-900 transition-colors cursor-pointer"
                aria-label={t("menu")}
                aria-expanded={menuOpen}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  {menuOpen ? (
                    <>
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </>
                  ) : (
                    <>
                      <line x1="4" y1="8" x2="20" y2="8" />
                      <line x1="4" y1="16" x2="20" y2="16" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>
        </Container>

      </header>
      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
