type Props = { className?: string };

export function FlagRS({ className = "w-6 h-4" }: Props) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      <rect width="30" height="7" fill="#C6363C" />
      <rect y="7" width="30" height="6" fill="#0C4076" />
      <rect y="13" width="30" height="7" fill="#fff" />
    </svg>
  );
}
