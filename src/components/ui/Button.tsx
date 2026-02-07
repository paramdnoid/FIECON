"use client";

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "inverse";
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: () => void;
  className?: string;
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  className = "",
}: Props) {
  const base =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-400 ease-out cursor-pointer";

  const variants = {
    primary:
      "bg-bordeaux-900 text-white hover:bg-bordeaux-700 shadow-lg shadow-bordeaux-900/20 hover:shadow-xl hover:shadow-bordeaux-700/25",
    secondary:
      "border border-bordeaux-900 text-bordeaux-900 hover:bg-bordeaux-900 hover:text-white",
    ghost: "text-bordeaux-900 hover:text-bordeaux-700 hover:bg-beige-200/50",
    inverse:
      "border border-white text-white hover:bg-white hover:text-bordeaux-900",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <a href={`#${href}`} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
