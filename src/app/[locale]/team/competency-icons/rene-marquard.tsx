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
  hrConsulting: (
    <svg {...iconProps}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  recruiting: (
    <svg {...iconProps}>
      <circle cx="10" cy="8" r="4" />
      <path d="M4 21v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 3 1" />
      <path d="M17 14v6" />
      <path d="M14 17h6" />
    </svg>
  ),
  organisation: (
    <svg {...iconProps}>
      <rect x="9" y="2" width="6" height="6" rx="1" />
      <rect x="2" y="16" width="6" height="6" rx="1" />
      <rect x="16" y="16" width="6" height="6" rx="1" />
      <path d="M12 8v4M5 16v-2h14v2M12 12v4" />
    </svg>
  ),
  advisory: (
    <svg {...iconProps}>
      <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
      <path d="M9 21h6" />
      <path d="M10 17v4M14 17v4" />
    </svg>
  ),
} as const satisfies Record<string, React.ReactNode>;
