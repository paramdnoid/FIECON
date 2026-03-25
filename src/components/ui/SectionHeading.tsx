import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  badge?: string;
  headline: string;
  subtitle?: string;
  children?: ReactNode;
  align?: "center" | "left";
  gradient?: boolean;
  italic?: boolean;
  headlineClassName?: string;
};

export function SectionHeading({
  badge,
  headline,
  subtitle,
  children,
  align = "center",
  gradient = false,
  italic = false,
  headlineClassName,
}: Props) {
  const alignment = align === "center" ? "text-center" : "text-left";

  return (
    <div className={cn(alignment, "mb-10 sm:mb-12 lg:mb-16")}>
      {badge && (
        <span className="inline-block text-sm font-medium tracking-[0.4em] uppercase text-accent mb-4">
          {badge}
        </span>
      )}
      <h2
        className={cn(
          "font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-6 text-balance",
          gradient ? "gradient-text" : "text-text-primary",
          italic && "italic",
          headlineClassName,
        )}
      >
        {headline}
      </h2>
      {subtitle && (
        <p className="text-lg sm:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed text-balance">
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
}
