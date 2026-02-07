type Props = { className?: string };

export function FlagBG({ className = "w-6 h-4" }: Props) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      <rect width="30" height="7" fill="#FFFFFF" />
      <rect y="7" width="30" height="6" fill="#00966E" />
      <rect y="13" width="30" height="7" fill="#D62612" />
    </svg>
  );
}
