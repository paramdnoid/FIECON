import type { ComponentType } from "react";
import { MapDE } from "./MapDE";
import { MapRS } from "./MapRS";
import { MapUS } from "./MapUS";

export { MapDE, MapRS, MapUS };

type MapProps = { className?: string; dotClassName?: string };

export const COUNTRY_MAPS: Record<string, ComponentType<MapProps>> = {
  DE: MapDE,
  RS: MapRS,
  US: MapUS,
};
