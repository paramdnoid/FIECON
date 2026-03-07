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
        "group relative bg-white rounded-2xl border border-beige-200/60 h-full overflow-hidden transition-all duration-400 hover:shadow-lg hover:shadow-bordeaux-900/8 hover:border-beige-400/50 focus-within:shadow-lg focus-within:shadow-bordeaux-900/8 focus-within:border-beige-400/50",
        className,
      )}
    >
      {/* Top gradient accent bar — like Philosophy cards */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
        <div
          className={cn(
            "absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-bordeaux-900 via-bordeaux-700 to-beige-400 origin-left scale-x-0 group-hover:scale-x-100 group-focus-within:scale-x-100 transition-transform duration-500",
            accentBarClassName,
          )}
        />
      </div>

      <div className="p-8 flex flex-col h-full">{children}</div>
    </div>
  );
}
