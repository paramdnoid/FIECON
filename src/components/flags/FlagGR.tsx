type Props = { className?: string };

export function FlagGR({ className = "w-6 h-4" }: Props) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      {/* 9 alternating stripes, each 20/9 tall */}
      <rect width="30" height="2.222" fill="#004C98" />
      <rect y="2.222" width="30" height="2.222" fill="#FFFFFF" />
      <rect y="4.444" width="30" height="2.222" fill="#004C98" />
      <rect y="6.667" width="30" height="2.222" fill="#FFFFFF" />
      <rect y="8.889" width="30" height="2.222" fill="#004C98" />
      <rect y="11.111" width="30" height="2.222" fill="#FFFFFF" />
      <rect y="13.333" width="30" height="2.222" fill="#004C98" />
      <rect y="15.556" width="30" height="2.222" fill="#FFFFFF" />
      <rect y="17.778" width="30" height="2.222" fill="#004C98" />
      {/* Blue canton covering top 5 stripes */}
      <rect width="11.111" height="11.111" fill="#004C98" />
      {/* White cross in canton */}
      <rect x="4.556" width="2" height="11.111" fill="#FFFFFF" />
      <rect y="4.556" width="11.111" height="2" fill="#FFFFFF" />
    </svg>
  );
}
