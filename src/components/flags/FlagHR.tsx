type Props = { className?: string };

export function FlagHR({ className = "w-6 h-4" }: Props) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      <rect width="30" height="7" fill="#FF0000" />
      <rect y="7" width="30" height="6" fill="#fff" />
      <rect y="13" width="30" height="7" fill="#171796" />
      {/* Simplified checkerboard coat of arms */}
      <rect x="11" y="5" width="8" height="8" rx="1" fill="#fff" stroke="#D52B1E" strokeWidth="0.5" />
      <rect x="11" y="5" width="1.6" height="1.6" fill="#FF0000" />
      <rect x="14.2" y="5" width="1.6" height="1.6" fill="#FF0000" />
      <rect x="17.4" y="5" width="1.6" height="1.6" fill="#FF0000" />
      <rect x="12.6" y="6.6" width="1.6" height="1.6" fill="#FF0000" />
      <rect x="15.8" y="6.6" width="1.6" height="1.6" fill="#FF0000" />
      <rect x="11" y="8.2" width="1.6" height="1.6" fill="#FF0000" />
      <rect x="14.2" y="8.2" width="1.6" height="1.6" fill="#FF0000" />
      <rect x="17.4" y="8.2" width="1.6" height="1.6" fill="#FF0000" />
      <rect x="12.6" y="9.8" width="1.6" height="1.6" fill="#FF0000" />
      <rect x="15.8" y="9.8" width="1.6" height="1.6" fill="#FF0000" />
      <rect x="11" y="11.4" width="1.6" height="1.6" fill="#FF0000" />
      <rect x="14.2" y="11.4" width="1.6" height="1.6" fill="#FF0000" />
      <rect x="17.4" y="11.4" width="1.6" height="1.6" fill="#FF0000" />
    </svg>
  );
}
