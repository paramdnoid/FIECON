type Props = { className?: string };

export function FlagSK({ className = "w-6 h-4" }: Props) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      <rect width="30" height="7" fill="#FFFFFF" />
      <rect y="7" width="30" height="6" fill="#0B4EA2" />
      <rect y="13" width="30" height="7" fill="#EE1C25" />
    </svg>
  );
}
