import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  quote: string;
  attribution: string;
  imageSrc: string;
  imageAlt: string;
  className?: string;
};

export function QuoteBlock({
  quote,
  attribution,
  imageSrc,
  imageAlt,
  className,
}: Props) {
  return (
    <blockquote
      className={cn(
        "relative flex flex-col items-center gap-8 overflow-hidden rounded-2xl bg-beige-50/80 px-8 py-12 sm:flex-row sm:items-center sm:gap-10 sm:px-12 sm:py-14 lg:gap-12 lg:px-16 lg:py-16",
        className,
      )}
    >
      {/* Portrait */}
      <div className="flex shrink-0 items-center sm:self-stretch">
        <div className="relative size-24 overflow-hidden rounded-full ring-1 ring-bordeaux-900/15 ring-offset-2 ring-offset-beige-50 sm:size-28 lg:size-32">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={128}
            height={128}
            className="size-full object-cover"
            sizes="(max-width: 640px) 96px, (max-width: 1024px) 112px, 128px"
          />
        </div>
      </div>

      {/* Quote + Attribution */}
      <div className="relative flex min-w-0 flex-1 flex-col items-center justify-center text-center sm:items-start sm:text-start">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-6 start-1/2 -translate-x-1/2 font-display text-[4rem] leading-none text-beige-400/50 select-none sm:start-0 sm:-top-8 sm:translate-x-0 sm:text-[5rem]"
        >
          &ldquo;
        </span>
        <p className="font-display italic text-xl sm:text-2xl lg:text-[1.75rem] font-light text-text-primary leading-relaxed">
          {quote}
        </p>
        <footer className="mt-5 flex flex-col items-center gap-2 sm:items-start">
          <div
            aria-hidden="true"
            className="h-px w-10 bg-bordeaux-900/20"
          />
          <cite className="text-xs sm:text-sm font-medium tracking-[0.2em] uppercase text-text-muted not-italic">
            {attribution}
          </cite>
        </footer>
      </div>
    </blockquote>
  );
}
