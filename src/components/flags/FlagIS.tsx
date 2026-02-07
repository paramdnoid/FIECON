type Props = { className?: string };

export function FlagIS({ className = "w-6 h-4" }: Props) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      {/* Blue background */}
      <rect width="30" height="20" fill="#003897" />
      {/* White cross */}
      <rect x="8" y="0" width="4" height="20" fill="#fff" />
      <rect x="0" y="8" width="30" height="4" fill="#fff" />
      {/* Red cross */}
      <rect x="9" y="0" width="2" height="20" fill="#D72828" />
      <rect x="0" y="9" width="30" height="2" fill="#D72828" />
    </svg>
  );
}
