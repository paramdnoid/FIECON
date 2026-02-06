import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  variant?: "default" | "accent";
  className?: string;
};

export function Badge({
  children,
  variant = "default",
  className = "",
}: Props) {
  const variants = {
    default: "bg-beige-200 text-bordeaux-900",
    accent: "bg-bordeaux-900 text-white",
  };

  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
