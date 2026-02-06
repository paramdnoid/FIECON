import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "span" | "p";
  variant?: "default" | "hero";
  className?: string;
};

export function GradientText({
  children,
  as: Tag = "span",
  variant = "default",
  className = "",
}: Props) {
  const gradientClass =
    variant === "hero" ? "gradient-text-hero" : "gradient-text";

  return <Tag className={`${gradientClass} ${className}`}>{children}</Tag>;
}
