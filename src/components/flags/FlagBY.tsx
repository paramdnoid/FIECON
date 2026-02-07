type Props = { className?: string };

export function FlagBY({ className = "w-6 h-4" }: Props) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      {/* Red top two-thirds */}
      <rect x="0" y="0" width="30" height="13.333" fill="#CF101A" />
      {/* Green bottom one-third */}
      <rect x="0" y="13.333" width="30" height="6.667" fill="#007C30" />
    </svg>
  );
}
