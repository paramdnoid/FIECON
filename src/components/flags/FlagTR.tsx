type Props = { className?: string };

export function FlagTR({ className = "w-6 h-4" }: Props) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      <rect width="30" height="20" fill="#E30A17" />
      <circle cx="11" cy="10" r="5" fill="#fff" />
      <circle cx="12.5" cy="10" r="4" fill="#E30A17" />
      <polygon
        points="16,10 17.5,8.5 16.2,9.8 18,10 16.2,10.2 17.5,11.5"
        fill="#fff"
      />
    </svg>
  );
}
