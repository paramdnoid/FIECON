export type LawKey = "kwg" | "vag" | "estg";

export type GesetzDocsLaw = {
  id: LawKey;
  index: number;
};

export type GesetzDocsSectionMeta = {
  id: "overview" | LawKey | "contact";
  labelKey: string;
  kind: "overview" | "law" | "contact";
};

export const GESETZE_DOCS_LAWS: readonly GesetzDocsLaw[] = [
  { id: "kwg", index: 0 },
  { id: "vag", index: 1 },
  { id: "estg", index: 2 },
];

export const GESETZE_DOCS_SECTION_IDS = [
  "overview",
  ...GESETZE_DOCS_LAWS.map((law) => law.id),
  "contact",
] as const;

export type GesetzDocsSectionId = (typeof GESETZE_DOCS_SECTION_IDS)[number];

export const GESETZE_DOCS_SECTIONS: readonly GesetzDocsSectionMeta[] = [
  { id: "overview", labelKey: "hero_headline", kind: "overview" },
  ...GESETZE_DOCS_LAWS.map((law) => ({
    id: law.id,
    labelKey: `${law.id}_name`,
    kind: "law" as const,
  })),
  { id: "contact", labelKey: "cta_headline", kind: "contact" },
];
