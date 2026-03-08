import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  variant?: "default" | "accent";
  className?: string;
};

const VARIANTS = {
  default: "bg-beige-100 text-bordeaux-900",
  accent: "bg-bordeaux-900 text-white",
} as const;

export function Badge({
  children,
  variant = "default",
  className,
}: Props) {
  return (
    <span
      style={{ fontSize: "0.55rem" }}
      className={cn(
        "inline-block whitespace-nowrap px-2.5 py-1 leading-none font-semibold tracking-widest uppercase rounded-full",
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
