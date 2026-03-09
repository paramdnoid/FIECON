"use client";

import { FadeIn } from "@/components/animations/FadeIn";

const FOCUS_AREAS = [
  { key: "corporate_law", itemCount: 3 },
  { key: "transparency", itemCount: 3 },
] as const;

type Props = {
  t: (key: string) => string;
};

export function ServicesFocusAreas({ t }: Props) {
  return (
    <>
      <FadeIn delay={0.3}>
        <div
          aria-hidden="true"
          className="h-px bg-linear-to-r from-transparent via-beige-400/30 to-transparent mt-16 mb-14"
        />
      </FadeIn>

      <FadeIn delay={0.35}>
        <p className="text-center text-sm font-medium tracking-[0.4em] uppercase text-accent mb-12">
          {t("focus_headline")}
        </p>
      </FadeIn>

      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        <div
          aria-hidden="true"
          className="max-md:hidden"
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            bottom: 0,
            width: "1px",
            transform: "translateX(-50%)",
            background:
              "linear-gradient(to bottom, transparent 0%, #CAAE9F 30%, #CAAE9F 70%, transparent 100%)",
          }}
        />

        {FOCUS_AREAS.map((area, i) => (
          <FadeIn key={area.key} delay={0.4 + i * 0.1}>
            <div style={i === 0 ? { textAlign: "right" } : undefined}>
              <p
                className="text-accent mb-2"
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                {t(`${area.key}.lead`)}
              </p>
              <h4 className="font-display text-lg font-normal text-bordeaux-900 tracking-tight mb-5">
                {t(`${area.key}.title`)}
              </h4>

              <ul className="space-y-3">
                {Array.from({ length: area.itemCount }, (_, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-3 text-sm text-text-muted leading-relaxed"
                    style={
                      i === 0
                        ? { flexDirection: "row-reverse", textAlign: "right" }
                        : undefined
                    }
                  >
                    <span
                      aria-hidden="true"
                      className="mt-0.5 w-5 h-5 rounded-full text-white flex items-center justify-center shrink-0"
                      style={{
                        fontSize: "0.55rem",
                        fontWeight: 600,
                        backgroundColor: "#873632",
                      }}
                    >
                      0{j + 1}
                    </span>
                    {t(`${area.key}.items.${j}`)}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        ))}
      </div>
    </>
  );
}
