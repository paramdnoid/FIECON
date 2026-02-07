type Props = {
  onClick: () => void;
  label: string;
};

export function CloseButton({ onClick, label }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center w-10 h-10 rounded-full text-text-muted hover:text-text-primary hover:bg-beige-100 transition-colors cursor-pointer"
      aria-label={label}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <path d="M4 4l10 10M14 4L4 14" />
      </svg>
    </button>
  );
}
