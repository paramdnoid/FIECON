type Props = {
  variant?: "line" | "diamond" | "dots";
  className?: string;
};

export function SectionDivider({ variant = "line", className = "" }: Props) {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      {variant === "line" && (
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-beige-400 to-transparent" />
      )}

      {variant === "diamond" && (
        <div className="flex items-center gap-4">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-beige-400" />
          <div className="w-2 h-2 rotate-45 border border-beige-400" />
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-beige-400" />
        </div>
      )}

      {variant === "dots" && (
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-beige-400/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-beige-400" />
          <div className="w-1 h-1 rounded-full bg-beige-400/40" />
        </div>
      )}
    </div>
  );
}
