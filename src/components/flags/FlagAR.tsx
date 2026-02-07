type Props = { className?: string };

export function FlagAR({ className = "w-6 h-4" }: Props) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      {/* Saudi Arabia flag simplified */}
      <rect width="30" height="20" fill="#006C35" />
      {/* Simplified shahada text representation + sword */}
      <rect x="5" y="7" width="20" height="1" rx="0.5" fill="#fff" />
      <rect x="7" y="9" width="16" height="1" rx="0.5" fill="#fff" />
      <rect x="9" y="11" width="12" height="0.8" rx="0.4" fill="#fff" />
      <path d="M8,14 L22,14" stroke="#fff" strokeWidth="0.8" strokeLinecap="round" />
      <rect x="9" y="14.5" width="1" height="1.5" rx="0.3" fill="#fff" />
    </svg>
  );
}
