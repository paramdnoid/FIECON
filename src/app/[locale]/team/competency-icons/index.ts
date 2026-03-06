import { CompetencyIcons as PeterIcons } from "./peter-fiegler";
import { CompetencyIcons as ReneIcons } from "./rene-marquard";
import { CompetencyIcons as AndreIcons } from "./andre-zimmermann";
import type React from "react";

export const COMPETENCY_ICONS: Record<string, Record<string, React.ReactNode>> = {
  "peter-fiegler": PeterIcons,
  "rene-marquard": ReneIcons,
  "andre-zimmermann": AndreIcons,
};
