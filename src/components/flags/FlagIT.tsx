type Props = { className?: string };

export function FlagIT({ className = "w-6 h-4" }: Props) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      <rect width="10" height="20" fill="#008C45" />
      <rect x="10" width="10" height="20" fill="#FFFFFF" />
      <rect x="20" width="10" height="20" fill="#CD212A" />
    </svg>
  );
}
