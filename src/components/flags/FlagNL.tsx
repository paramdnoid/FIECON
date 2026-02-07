type Props = { className?: string };

export function FlagNL({ className = "w-6 h-4" }: Props) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      <rect width="30" height="7" fill="#AE1C28" />
      <rect y="7" width="30" height="6" fill="#FFF" />
      <rect y="13" width="30" height="7" fill="#21468B" />
    </svg>
  );
}
