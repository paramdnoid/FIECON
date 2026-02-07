type Props = { className?: string };

export function FlagEE({ className = "w-6 h-4" }: Props) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      <rect width="30" height="6.667" fill="#0072CE" />
      <rect y="6.667" width="30" height="6.667" fill="#000000" />
      <rect y="13.333" width="30" height="6.667" fill="#FFFFFF" />
    </svg>
  );
}
