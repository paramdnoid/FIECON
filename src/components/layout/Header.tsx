"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { NAV_LINKS } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { ScrollProgress } from "@/components/animations/ScrollProgress";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useScrollProgress();
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
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2">
              <span className="font-display text-2xl font-bold gradient-text-hero tracking-tight">
                FIECON
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  className="relative text-sm font-medium text-text-muted hover:text-bordeaux-900 transition-colors group"
                >
                  {t(link.id)}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-bordeaux-900 transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-4">
              <div className="hidden lg:block">
                <LanguageSwitcher />
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 text-text-primary hover:text-bordeaux-900 transition-colors cursor-pointer"
                aria-label="Menu"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
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

        <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      </header>
    </>
  );
}
