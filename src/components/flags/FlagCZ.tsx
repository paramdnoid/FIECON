type Props = { className?: string };

export function FlagCZ({ className = "w-6 h-4" }: Props) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      <rect width="30" height="10" fill="#FFFFFF" />
      <rect y="10" width="30" height="10" fill="#D7141A" />
      <path d="M0,0 L15,10 L0,20 Z" fill="#11457E" />
    </svg>
  );
}
