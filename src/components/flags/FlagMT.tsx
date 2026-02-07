type Props = { className?: string };

export function FlagMT({ className = "w-6 h-4" }: Props) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      {/* White left half */}
      <rect x="0" y="0" width="15" height="20" fill="#fff" />
      {/* Red right half */}
      <rect x="15" y="0" width="15" height="20" fill="#CF142B" />
    </svg>
  );
}
