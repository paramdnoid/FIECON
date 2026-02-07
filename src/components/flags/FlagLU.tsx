type Props = { className?: string };

export function FlagLU({ className = "w-6 h-4" }: Props) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      {/* Red top third */}
      <rect x="0" y="0" width="30" height="6.667" fill="#EF3340" />
      {/* White middle third */}
      <rect x="0" y="6.667" width="30" height="6.667" fill="#fff" />
      {/* Light blue bottom third */}
      <rect x="0" y="13.333" width="30" height="6.667" fill="#00A2E1" />
    </svg>
  );
}
