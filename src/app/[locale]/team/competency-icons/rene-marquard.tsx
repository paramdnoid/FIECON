import React from "react";

const iconProps = {
  "aria-hidden": true,
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const CompetencyIcons = {
  wealthManagement: (
    <svg {...iconProps}>
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  preciousMetals: (
    <svg {...iconProps}>
      <path d="M6 3h12l4 6-10 13L2 9z" />
      <path d="M2 9h20" />
      <path d="M10 9l2-6 2 6" />
      <path d="M6.5 9L12 22l5.5-13" />
    </svg>
  ),
  hrConsulting: (
    <svg {...iconProps}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  assetStrategy: (
    <svg {...iconProps}>
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
} as const satisfies Record<string, React.ReactNode>;
