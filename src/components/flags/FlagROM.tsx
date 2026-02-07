type Props = { className?: string };

export function FlagROM({ className = "w-6 h-4" }: Props) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      {/* Romani flag: blue top, green bottom, red chakra wheel */}
      <rect width="30" height="10" fill="#0038A8" />
      <rect y="10" width="30" height="10" fill="#009B3A" />
      {/* Red chakra wheel */}
      <circle cx="15" cy="10" r="4" fill="none" stroke="#C8102E" strokeWidth="1" />
      <circle cx="15" cy="10" r="1.5" fill="none" stroke="#C8102E" strokeWidth="0.8" />
      {/* Spokes */}
      <line x1="15" y1="6" x2="15" y2="14" stroke="#C8102E" strokeWidth="0.5" />
      <line x1="11" y1="10" x2="19" y2="10" stroke="#C8102E" strokeWidth="0.5" />
      <line x1="12.2" y1="7.2" x2="17.8" y2="12.8" stroke="#C8102E" strokeWidth="0.5" />
      <line x1="17.8" y1="7.2" x2="12.2" y2="12.8" stroke="#C8102E" strokeWidth="0.5" />
    </svg>
  );
}
