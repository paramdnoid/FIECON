"use client";

import { motion, AnimatePresence } from "motion/react";
import { OFFICES } from "@/lib/constants";
import { COUNTRY_MAPS } from "@/components/maps";
import { PHOTO_MAP_CONFIG, BG_MAP_TRANSITION } from "./offices-config";
import { CountryPhotoMap } from "./CountryPhotoMap";

/**
 * Large ambient background map for the active office location.
 * Uses radial-gradient mask for soft vignette edges and cross-fades
 * between country maps via AnimatePresence.
 */
export function BackgroundMap({ activeIndex }: { activeIndex: number }) {
  const office = OFFICES[activeIndex];
  const MapComponent = COUNTRY_MAPS[office.countryCode];
  const hasPhoto = office.countryCode in PHOTO_MAP_CONFIG;

  if (!MapComponent) return null;

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none select-none overflow-hidden"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={office.countryCode}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.06 }}
          transition={BG_MAP_TRANSITION}
          className="absolute inset-0 flex items-center justify-center"
          style={{
            maskImage: hasPhoto
              ? "radial-gradient(ellipse 80% 85% at 50% 50%, black 0%, transparent 75%)"
              : "radial-gradient(ellipse 65% 75% at 50% 50%, black 0%, transparent 70%)",
            WebkitMaskImage: hasPhoto
              ? "radial-gradient(ellipse 80% 85% at 50% 50%, black 0%, transparent 75%)"
              : "radial-gradient(ellipse 65% 75% at 50% 50%, black 0%, transparent 70%)",
          }}
        >
          {hasPhoto ? (
            <CountryPhotoMap countryCode={office.countryCode} />
          ) : (
            <MapComponent
              className="w-[65%] sm:w-[60%] md:w-[55%] lg:w-[50%] h-auto max-h-[90%] text-bordeaux-900/12"
              dotClassName="fill-bordeaux-500/15"
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
