type Props = { className?: string };

export function FlagNO({ className = "w-6 h-4" }: Props) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      <rect width="30" height="20" fill="#BA0C2F" />
      <rect x="0" y="8" width="30" height="4" fill="#FFFFFF" />
      <rect x="9" y="0" width="4" height="20" fill="#FFFFFF" />
      <rect x="0" y="9" width="30" height="2" fill="#00205B" />
      <rect x="10" y="0" width="2" height="20" fill="#00205B" />
    </svg>
  );
}
