"use client";

import { Link } from "@/i18n/navigation";
import type { NavLinkItem } from "@/lib/constants";
import { scrollToSection, cn } from "@/lib/utils";

type Props = {
  link: NavLinkItem;
  label: string;
  isActive: boolean;
  variant: "desktop" | "mobile";
  onNavigate?: () => void;
};

export function SectionNavLink({
  link,
  label,
  isActive,
  variant,
  onNavigate,
}: Props) {
  return (
    <Link
      href={`/#${link.href}`}
      onClick={(e) => {
        if (document.getElementById(link.href)) {
          e.preventDefault();
          scrollToSection(link.href);
        }
        onNavigate?.();
      }}
      aria-current={variant === "desktop" && isActive ? "true" : undefined}
      className={cn(
        variant === "desktop"
          ? "relative text-xs font-medium tracking-widest uppercase transition-colors duration-400 group"
          : "group flex items-center gap-4 py-4 text-left cursor-pointer transition-colors duration-300",
        isActive
          ? "text-bordeaux-900"
          : variant === "desktop"
            ? "text-text-muted hover:text-bordeaux-900"
            : "text-text-primary hover:text-bordeaux-900",
      )}
    >
      {variant === "mobile" && (
        <span
          className={cn(
            "h-px transition-all duration-300",
            isActive
              ? "w-8 bg-bordeaux-900"
              : "w-0 group-hover:w-8 bg-bordeaux-900/50",
          )}
        />
      )}
      <span
        className={cn(
          variant === "desktop"
            ? ""
            : "font-display text-xl sm:text-2xl md:text-3xl font-light tracking-tight",
        )}
      >
        {label}
      </span>
      {variant === "desktop" && (
        <span
          className={cn(
            "absolute -bottom-1 left-0 h-px bg-accent transition-all duration-400",
            isActive ? "w-full" : "w-0 group-hover:w-full",
          )}
        />
      )}
    </Link>
  );
}
