type Props = { className?: string };

export function FlagEUS({ className = "w-6 h-4" }: Props) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      {/* Red background */}
      <rect width="30" height="20" fill="#D52B1E" />
      {/* Green diagonal cross (saltire / St Andrew's cross) */}
      <path d="M0,0 L30,20" stroke="#009B48" strokeWidth="3" />
      <path d="M30,0 L0,20" stroke="#009B48" strokeWidth="3" />
      {/* White regular cross */}
      <rect x="13" y="0" width="4" height="20" fill="#fff" />
      <rect x="0" y="8" width="30" height="4" fill="#fff" />
    </svg>
  );
}
