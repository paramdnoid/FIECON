type Props = { className?: string };

export function FlagPT({ className = "w-6 h-4" }: Props) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      <rect width="12" height="20" fill="#006600" />
      <rect x="12" width="18" height="20" fill="#FF0000" />
    </svg>
  );
}
