type Props = { className?: string };

export function FlagUA({ className = "w-6 h-4" }: Props) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      <rect width="30" height="10" fill="#0057B8" />
      <rect y="10" width="30" height="10" fill="#FFD700" />
    </svg>
  );
}
