type Props = { className?: string };

export function FlagGL({ className = "w-6 h-4" }: Props) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      {/* White background */}
      <rect width="30" height="20" fill="#fff" />
      {/* Blue diagonal stripe from lower-left to upper-right */}
      <path d="M0,20 L30,0" stroke="#0079C1" strokeWidth="5" />
    </svg>
  );
}
