"use client";

import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/animations/FadeIn";
import { QuoteBlock } from "@/components/ui/QuoteBlock";

type Props = {
  quote: string;
  attribution: string;
  imageSrc: string;
  imageAlt: string;
};

export function TeamProfileQuote({
  quote,
  attribution,
  imageSrc,
  imageAlt,
}: Props) {
  return (
    <section className="py-24 sm:py-32 bg-white">
      <Container size="md">
        <FadeIn>
          {/* Gradient frame */}
          <div className="mx-auto max-w-4xl rounded-2xl p-px bg-linear-to-r from-beige-400/30 via-bordeaux-500/40 to-beige-400/30 shadow-[0_4px_24px_-8px_rgba(98,25,28,0.06)]">
            <QuoteBlock
              quote={quote}
              attribution={attribution}
              imageSrc={imageSrc}
              imageAlt={imageAlt}
            />
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
