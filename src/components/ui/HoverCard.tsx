import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { CardInteractive, CardContent } from "./Card";

type Props = {
  children: ReactNode;
  className?: string;
  accentBarClassName?: string;
};

export function HoverCard({ children, className, accentBarClassName }: Props) {
  return (
    <CardInteractive
      className={cn(
        "group h-full overflow-hidden hover:-translate-y-0.5 focus-within:-translate-y-0.5",
        className,
      )}
    >
      {/* Top gradient accent bar — like Philosophy cards */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
        <div
          className={cn(
            "absolute top-0 inset-x-0 h-[3px] bg-linear-to-r from-bordeaux-900 via-bordeaux-700 to-beige-400 origin-left scale-x-0 group-hover:scale-x-100 group-focus-within:scale-x-100 transition-transform duration-500",
            accentBarClassName,
          )}
        />
      </div>

      <CardContent className="flex h-full flex-col">{children}</CardContent>
    </CardInteractive>
  );
}
