import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function Container({ children, size = "lg", className }: Props) {
  const maxWidth = {
    sm: "max-w-3xl",
    md: "max-w-5xl",
    lg: "max-w-7xl",
  }[size];

  return (
    <div className={cn("mx-auto px-6 sm:px-8 lg:px-12", maxWidth, className)}>
      {children}
    </div>
  );
}
