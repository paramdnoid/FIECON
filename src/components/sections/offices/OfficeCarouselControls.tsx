"use client";

type NavButtonProps = {
  direction: "prev" | "next";
  onClick: () => void;
};

export function OfficeCarouselNavButton({ direction, onClick }: NavButtonProps) {
  const isPrev = direction === "prev";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`hidden md:flex absolute ${isPrev ? "left-0" : "right-0"} bottom-0 z-110 h-14 w-14 items-center justify-center rounded-full bg-bordeaux-900 text-white shadow-lg shadow-bordeaux-900/25 transition-all duration-300 hover:bg-bordeaux-700 hover:shadow-xl hover:shadow-bordeaux-900/35 hover:scale-110 focus-visible:outline-2 focus-visible:outline-bordeaux-900`}
      aria-label={isPrev ? "Previous" : "Next"}
    >
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        {isPrev ? (
          <path
            d="M12.5 15L7.5 10L12.5 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M7.5 15L12.5 10L7.5 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}

type CarouselDotsProps = {
  offices: ReadonlyArray<{ id: string }>;
  activeIndex: number;
  getCityLabel: (officeId: string) => string;
  onSelect: (index: number) => void;
  ariaLabel: string;
};

export function OfficeCarouselDots({
  offices,
  activeIndex,
  getCityLabel,
  onSelect,
  ariaLabel,
}: CarouselDotsProps) {
  return (
    <div
      className="flex justify-center gap-2 sm:gap-2.5 mt-4 sm:mt-6"
      role="tablist"
      aria-label={ariaLabel}
    >
      {offices.map((office, i) => (
        <button
          key={office.id}
          type="button"
          role="tab"
          aria-selected={activeIndex === i}
          aria-label={`${getCityLabel(office.id)} (${i + 1} / ${offices.length})`}
          className={`h-2 rounded-full transition-all duration-300 ${
            activeIndex === i
              ? "bg-bordeaux-900 w-6 sm:w-7"
              : "bg-beige-400/50 w-2 hover:bg-beige-400"
          }`}
          onClick={() => onSelect(i)}
        />
      ))}
    </div>
  );
}
