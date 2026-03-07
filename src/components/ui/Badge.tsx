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
    default: "bg-beige-100 text-bordeaux-900",
    accent: "bg-bordeaux-900 text-white",
  };

  return (
    <span
      style={{ fontSize: "0.55rem" }}
      className={`inline-block whitespace-nowrap px-2.5 py-1 leading-none font-semibold tracking-widest uppercase rounded-full ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
