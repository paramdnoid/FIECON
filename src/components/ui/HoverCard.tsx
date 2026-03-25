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
        "group fiecon-card-frame rounded-2xl h-full overflow-hidden transition-all duration-400 hover:-translate-y-0.5 hover:shadow-[0_16px_38px_-26px_rgba(98,25,28,0.7)] hover:border-beige-400/70 focus-within:-translate-y-0.5 focus-within:shadow-[0_16px_38px_-26px_rgba(98,25,28,0.7)] focus-within:border-beige-400/70",
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

      <div className="p-6 sm:p-8 flex flex-col h-full">{children}</div>
    </div>
  );
}
