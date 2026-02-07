type Props = { className?: string };

export function FlagLV({ className = "w-6 h-4" }: Props) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      <rect width="30" height="8" fill="#9E3039" />
      <rect y="8" width="30" height="4" fill="#FFFFFF" />
      <rect y="12" width="30" height="8" fill="#9E3039" />
    </svg>
  );
}
