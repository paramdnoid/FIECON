type Props = { className?: string };

export function FlagSE({ className = "w-6 h-4" }: Props) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      <rect width="30" height="20" fill="#004B87" />
      {/* Horizontal bar of the cross */}
      <rect y="8" width="30" height="4" fill="#FECC00" />
      {/* Vertical bar of the cross, offset to the left */}
      <rect x="9" width="4" height="20" fill="#FECC00" />
    </svg>
  );
}
