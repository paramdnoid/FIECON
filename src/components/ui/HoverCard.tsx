import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  accentBarClassName?: string;
};

export function HoverCard({ children, className, accentBarClassName }: Props) {
  return (
    <div
      className={cn(
        "group relative bg-white rounded-2xl border border-beige-200/60 h-full overflow-hidden transition-all duration-500 hover:shadow-lg hover:shadow-bordeaux-900/8 hover:border-beige-400/50 focus-within:shadow-lg focus-within:shadow-bordeaux-900/8 focus-within:border-beige-400/50",
        className,
      )}
    >
      {/* Bordeaux accent bar — clipped to card bounds even when card has overflow-visible */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
        <div
          className={cn(
            "absolute top-0 start-0 w-full h-0.5 bg-linear-to-r from-bordeaux-900 via-bordeaux-700 to-transparent scale-x-0 origin-start group-hover:scale-x-100 group-focus-within:scale-x-100 transition-transform duration-500",
            accentBarClassName,
          )}
        />
      </div>

      <div className="p-7 lg:p-8 flex flex-col h-full">{children}</div>
    </div>
  );
}
