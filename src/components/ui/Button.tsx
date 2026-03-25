"use client";

import type { ComponentProps, ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-400 ease-out cursor-pointer disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        primary:
          "bg-bordeaux-900 text-white border border-transparent hover:bg-bordeaux-700 shadow-lg shadow-bordeaux-900/20 hover:shadow-xl hover:shadow-bordeaux-700/25",
        secondary:
          "border border-bordeaux-900 text-bordeaux-900 hover:bg-bordeaux-900 hover:text-white",
        ghost:
          "border border-transparent text-bordeaux-900 hover:text-bordeaux-700 hover:bg-beige-200/50",
        inverse:
          "border border-white text-white hover:bg-white hover:text-bordeaux-900",
      },
      size: {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type Props = VariantProps<typeof buttonVariants> &
  Omit<ComponentProps<"button">, "children"> & {
  children: ReactNode;
  href?: string;
  asChild?: boolean;
  className?: string;
};

export function Button({
  children,
  variant,
  size,
  href,
  asChild = false,
  className,
  type = "button",
  ...props
}: Props) {
  const classes = cn(buttonVariants({ variant, size }), className);

  if (href) {
    return (
      <a href={`#${href}`} className={classes}>
        {children}
      </a>
    );
  }

  if (asChild) {
    return <Slot className={classes}>{children}</Slot>;
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}

export { buttonVariants };
