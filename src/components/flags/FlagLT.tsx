type Props = { className?: string };

export function FlagLT({ className = "w-6 h-4" }: Props) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      <rect width="30" height="6.667" fill="#FDB913" />
      <rect y="6.667" width="30" height="6.667" fill="#006A44" />
      <rect y="13.333" width="30" height="6.667" fill="#C1272D" />
    </svg>
  );
}
