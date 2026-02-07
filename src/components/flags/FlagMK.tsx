type Props = { className?: string };

export function FlagMK({ className = "w-6 h-4" }: Props) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      <rect width="30" height="20" fill="#CE2028" />
      <path d="M0 0 L13 10 L0 3.5z" fill="#F9D616" />
      <path d="M30 0 L17 10 L30 3.5z" fill="#F9D616" />
      <path d="M0 20 L13 10 L0 16.5z" fill="#F9D616" />
      <path d="M30 20 L17 10 L30 16.5z" fill="#F9D616" />
      <path d="M0 0 L15 8 L30 0 L30 2 L15 10 L0 2z" fill="#F9D616" />
      <path d="M0 20 L15 12 L30 20 L30 18 L15 10 L0 18z" fill="#F9D616" />
      <path d="M13 0 L15 8 L17 0z" fill="#F9D616" />
      <path d="M13 20 L15 12 L17 20z" fill="#F9D616" />
      <circle cx="15" cy="10" r="4" fill="#F9D616" />
      <circle cx="15" cy="10" r="3" fill="#CE2028" />
    </svg>
  );
}
