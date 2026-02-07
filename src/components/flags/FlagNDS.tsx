type Props = { className?: string };

export function FlagNDS({ className = "w-6 h-4" }: Props) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      {/* Niedersachsen: red field with white horse (Sachsenross) simplified */}
      <rect width="30" height="20" fill="#CE1126" />
      {/* Simplified white horse silhouette */}
      <path
        d="M8,16 C8,14 9,12 10,11 L11,9 C11.5,8 12,7.5 13,7 C14,6.5 14.5,6 15,5.5 C15.5,5 16,5 16.5,5.5 L17,6 C17,6.5 16.5,7 16,7.5 L15.5,8 C16,8 17,8 18,8.5 C19,9 20,10 21,11 L22,13 C22.5,14 22,15 21.5,15.5 L21,16 L19,16 L18.5,14 L17,12 L16,11.5 L15,12 L14,14 L13,16 Z"
        fill="#FFF"
      />
    </svg>
  );
}
