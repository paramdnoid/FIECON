import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
};

export function HoverCard({ children, className }: Props) {
  return (
    <div
      className={cn(
        "group relative bg-white rounded-2xl border border-beige-200/60 h-full overflow-hidden transition-all duration-500 hover:shadow-lg hover:shadow-bordeaux-900/8 hover:border-beige-400/50",
        className,
      )}
    >
      {/* Bordeaux accent bar */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-bordeaux-900 via-bordeaux-700 to-transparent scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />

      <div className="p-7 lg:p-8 flex flex-col h-full">{children}</div>
    </div>
  );
}
