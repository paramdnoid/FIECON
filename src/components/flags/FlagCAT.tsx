type Props = { className?: string };

export function FlagCAT({ className = "w-6 h-4" }: Props) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      {/* Yellow background */}
      <rect width="30" height="20" fill="#FCDD09" />
      {/* 4 red stripes */}
      <rect x="0" y="2.222" width="30" height="2.222" fill="#DA121A" />
      <rect x="0" y="6.667" width="30" height="2.222" fill="#DA121A" />
      <rect x="0" y="11.111" width="30" height="2.222" fill="#DA121A" />
      <rect x="0" y="15.556" width="30" height="2.222" fill="#DA121A" />
    </svg>
  );
}
