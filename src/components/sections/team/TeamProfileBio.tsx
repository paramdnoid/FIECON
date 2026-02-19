"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SlideReveal } from "@/components/animations/SlideReveal";
import { FadeIn } from "@/components/animations/FadeIn";

type Props = {
  badge: string;
  paragraphs: string[];
  imageSrc: string;
  imageAlt: string;
  imagePosition?: "left" | "right";
};

export function TeamProfileBio({
  badge,
  paragraphs,
  imageSrc,
  imageAlt,
  imagePosition = "left",
}: Props) {
  const imageContent = (
    <SlideReveal direction={imagePosition === "left" ? "left" : "right"}>
      <div className="relative">
        {/* Gradient border frame */}
        <div className="rounded-2xl p-px bg-linear-to-br from-beige-400/30 via-bordeaux-500/20 to-beige-400/30">
          <div className="relative aspect-4/5 w-full rounded-2xl overflow-hidden bg-beige-100">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
        </div>
        {/* Decorative accent line below image */}
        <div
          className="mt-6 flex items-center gap-3"
          aria-hidden="true"
        >
          <div className="w-8 h-px bg-accent/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-accent/30" />
        </div>
      </div>
    </SlideReveal>
  );

  const textContent = (
    <SlideReveal
      direction={imagePosition === "left" ? "right" : "left"}
      delay={0.15}
    >
      <div className="lg:pt-4">
        <span className="inline-block text-sm font-medium tracking-[0.4em] uppercase text-accent mb-5">
          {badge}
        </span>
        <div className="w-10 h-px bg-accent/40 mb-8" />

        <div className="space-y-6 text-lg sm:text-xl text-text-muted leading-relaxed">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </SlideReveal>
  );

  return (
    <section className="py-24 sm:py-32 bg-white">
      <Container size="lg">
        <FadeIn>
          <div className="w-full h-px bg-linear-to-r from-transparent via-beige-400/40 to-transparent mb-20 sm:mb-24" />
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {imagePosition === "left" ? (
            <>
              <div className="lg:col-span-5">{imageContent}</div>
              <div className="lg:col-span-7">{textContent}</div>
            </>
          ) : (
            <>
              <div className="lg:col-span-7">{textContent}</div>
              <div className="lg:col-span-5">{imageContent}</div>
            </>
          )}
        </div>
      </Container>
    </section>
  );
}
