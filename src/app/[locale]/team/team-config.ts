export const TEAM_PAGE_CONFIG: Record<string, {
  memberIndex: number;
  competencies: { id: string; iconKey: string }[];
  languages: string[];
}> = {
  "peter-fiegler": {
    memberIndex: 0,
    competencies: [
      { id: "corporate-law", iconKey: "corporateLaw" },
      { id: "international", iconKey: "international" },
      { id: "finance", iconKey: "finance" },
      { id: "strategy", iconKey: "strategy" },
    ],
    languages: ["de", "en", "sr"],
  },
  "rene-marquard": {
    memberIndex: 1,
    competencies: [
      { id: "wealth-management", iconKey: "wealthManagement" },
      { id: "precious-metals", iconKey: "preciousMetals" },
      { id: "hr-consulting", iconKey: "hrConsulting" },
      { id: "asset-strategy", iconKey: "assetStrategy" },
    ],
    languages: ["de", "en"],
  },
  "andre-zimmermann": {
    memberIndex: 2,
    competencies: [
      { id: "web-development", iconKey: "webDevelopment" },
      { id: "software-architecture", iconKey: "softwareArchitecture" },
      { id: "project-management", iconKey: "projectManagement" },
      { id: "digital-infrastructure", iconKey: "digitalInfrastructure" },
    ],
    languages: ["de", "en", "es"],
  },
};
