"use client";

import Image from "next/image";
import { COUNTRY_MAPS } from "@/components/maps";
import { PHOTO_MAP_CONFIG } from "./offices-config";
import { useCountryMask } from "./useCountryMask";

/**
 * Office photo revealed through the country map silhouette.
 * Uses the SVG outline as a CSS mask — the photo is only visible
 * within the country shape.
 */
export function CountryPhotoMap({ countryCode }: { countryCode: string }) {
  const config = PHOTO_MAP_CONFIG[countryCode];
  const MapSvg = COUNTRY_MAPS[countryCode];
  const { maskUrl, ref } = useCountryMask();
  if (!config || !MapSvg) return null;
  const { src } = config;

  return (
    <>
      <div ref={ref} className="absolute w-0 h-0 overflow-hidden" aria-hidden="true">
        <MapSvg className="w-full h-full text-black" dotClassName="fill-black" />
      </div>

      <div
        className="absolute inset-0"
        style={
          maskUrl
            ? {
                maskImage: `url("${maskUrl}")`,
                WebkitMaskImage: `url("${maskUrl}")`,
                maskSize: config.maskSize,
                WebkitMaskSize: config.webkitMaskSize,
                maskPosition: "center",
                WebkitMaskPosition: "center",
                maskRepeat: "no-repeat",
                WebkitMaskRepeat: "no-repeat",
              }
            : { display: "none" }
        }
      >
        <Image
          src={src}
          alt=""
          fill
          className="object-cover"
          style={{
            opacity: config.opacity,
            filter: `saturate(${config.saturate}) sepia(${config.sepia})`,
          }}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={false}
        />
      </div>
    </>
  );
}
