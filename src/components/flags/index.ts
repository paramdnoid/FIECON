import type { ComponentType } from "react";
import { FlagDE } from "./FlagDE";
import { FlagGB } from "./FlagGB";
import { FlagNDS } from "./FlagNDS";
import { FlagTR } from "./FlagTR";
import { FlagAR } from "./FlagAR";
import { FlagPL } from "./FlagPL";
import { FlagRU } from "./FlagRU";
import { FlagRS } from "./FlagRS";
import { FlagHU } from "./FlagHU";
import { FlagBA } from "./FlagBA";
import { FlagHR } from "./FlagHR";
import { FlagROM } from "./FlagROM";
import { FlagES } from "./FlagES";

export const FLAGS: Record<string, ComponentType<{ className?: string }>> = {
  de: FlagDE,
  gb: FlagGB,
  nds: FlagNDS,
  tr: FlagTR,
  ar: FlagAR,
  pl: FlagPL,
  ru: FlagRU,
  rs: FlagRS,
  hu: FlagHU,
  ba: FlagBA,
  hr: FlagHR,
  rom: FlagROM,
  es: FlagES,
};
