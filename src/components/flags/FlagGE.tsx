type Props = { className?: string };

export function FlagGE({ className = "w-6 h-4" }: Props) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      {/* White background */}
      <rect width="30" height="20" fill="#fff" />
      {/* Large red cross */}
      <rect x="13" y="0" width="4" height="20" fill="#FF0000" />
      <rect x="0" y="8" width="30" height="4" fill="#FF0000" />
      {/* Small Bolnisi crosses in each quadrant */}
      {/* Top-left quadrant */}
      <rect x="5.5" y="3" width="2" height="6" fill="#FF0000" />
      <rect x="3.5" y="5" width="6" height="2" fill="#FF0000" />
      {/* Top-right quadrant */}
      <rect x="22.5" y="3" width="2" height="6" fill="#FF0000" />
      <rect x="20.5" y="5" width="6" height="2" fill="#FF0000" />
      {/* Bottom-left quadrant */}
      <rect x="5.5" y="13" width="2" height="6" fill="#FF0000" />
      <rect x="3.5" y="15" width="6" height="2" fill="#FF0000" />
      {/* Bottom-right quadrant */}
      <rect x="22.5" y="13" width="2" height="6" fill="#FF0000" />
      <rect x="20.5" y="15" width="6" height="2" fill="#FF0000" />
    </svg>
  );
}
