import type { ComponentType } from "react";
import { MapDE } from "./MapDE";
import { MapRS } from "./MapRS";
import { MapUS } from "./MapUS";
import { MapME } from "./MapME";
import { MapVU } from "./MapVU";

export { MapDE, MapRS, MapUS, MapME, MapVU };

type MapProps = { className?: string; dotClassName?: string };

export const COUNTRY_MAPS: Record<string, ComponentType<MapProps>> = {
  DE: MapDE,
  RS: MapRS,
  US: MapUS,
  ME: MapME,
  VU: MapVU,
};
