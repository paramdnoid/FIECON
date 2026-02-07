type Props = { className?: string };

export function FlagBA({ className = "w-6 h-4" }: Props) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      <rect width="30" height="20" fill="#002395" />
      {/* Yellow triangle */}
      <polygon points="7,0 23,0 7,20" fill="#FECB00" />
      {/* White stars along hypotenuse */}
      <circle cx="8" cy="2" r="1" fill="#fff" />
      <circle cx="10" cy="4.5" r="1" fill="#fff" />
      <circle cx="12" cy="7" r="1" fill="#fff" />
      <circle cx="14" cy="9.5" r="1" fill="#fff" />
      <circle cx="16" cy="12" r="1" fill="#fff" />
      <circle cx="18" cy="14.5" r="1" fill="#fff" />
      <circle cx="20" cy="17" r="1" fill="#fff" />
    </svg>
  );
}
