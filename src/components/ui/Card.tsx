import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "fiecon-card-frame rounded-2xl",
        className,
      )}
      {...props}
    />
  );
}

export function CardInteractive({ className, ...props }: ComponentProps<"div">) {
  return (
    <Card
      className={cn("fiecon-card-interactive", className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-2", className)} {...props} />;
}

export function CardTitle({ className, ...props }: ComponentProps<"h3">) {
  return (
    <h3
      className={cn("font-display text-xl font-normal text-text-primary", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn("text-sm leading-relaxed text-text-muted", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("p-6 sm:p-8", className)} {...props} />;
}

