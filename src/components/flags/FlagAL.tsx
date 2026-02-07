type Props = { className?: string };

export function FlagAL({ className = "w-6 h-4" }: Props) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      <rect width="30" height="20" fill="#E41E20" />
      <path
        d="M15 4 l-1 0.5 -0.5-1.5 -1.5 1 0.5 1.5 -2-0.5 -0.5 1.5 2 1 -1.5 1 1 1
           l-2 0 0.5 1.5 1.5 0 0 1.5 1 0.5 0.5-1.5 1 1 0.5-1
           l0.5 1 1-1 0.5 1.5 1-0.5 0 -1.5 1.5 0 0.5-1.5 -2 0 1-1 -1.5-1 2-1 -0.5-1.5
           l-2 0.5 0.5-1.5 -1.5-1 -0.5 1.5z"
        fill="#000000"
      />
    </svg>
  );
}
