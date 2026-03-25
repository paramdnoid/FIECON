import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-[0.55rem] leading-none font-semibold tracking-widest uppercase",
  {
    variants: {
      variant: {
        default: "bg-beige-100 text-bordeaux-900",
        accent: "bg-bordeaux-900 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type Props = VariantProps<typeof badgeVariants> & {
  children: ReactNode;
  className?: string;
};

export function Badge({
  children,
  variant,
  className,
}: Props) {
  return (
    <span className={cn(badgeVariants({ variant }), className)}>
      {children}
    </span>
  );
}

export { badgeVariants };
