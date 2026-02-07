type Props = { className?: string };

export function FlagWAL({ className = "w-6 h-4" }: Props) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      {/* White top half */}
      <rect x="0" y="0" width="30" height="10" fill="#fff" />
      {/* Green bottom half */}
      <rect x="0" y="10" width="30" height="10" fill="#00AB39" />
    </svg>
  );
}
