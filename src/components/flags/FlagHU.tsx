type Props = { className?: string };

export function FlagHU({ className = "w-6 h-4" }: Props) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      <rect width="30" height="7" fill="#CE2939" />
      <rect y="7" width="30" height="6" fill="#fff" />
      <rect y="13" width="30" height="7" fill="#477050" />
    </svg>
  );
}
