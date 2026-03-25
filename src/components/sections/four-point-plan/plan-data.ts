export const FOUR_POINT_PLAN_POINTS = [
  { key: "strategy", number: "01", subpoints: ["1_1", "1_2"] },
  { key: "tax", number: "02", subpoints: ["2_1", "2_2", "2_3"] },
  { key: "relief", number: "03", subpoints: ["3_1"] },
  { key: "pension", number: "04", subpoints: ["4_1"] },
] as const;

export type FourPointPlanPoint = (typeof FOUR_POINT_PLAN_POINTS)[number];
export type FourPointPlanPointKey = FourPointPlanPoint["key"];
export type FourPointPlanSubpointKey = FourPointPlanPoint["subpoints"][number];

export const FOUR_POINT_PLAN_SUBPOINT_ITEM_COUNT: Record<FourPointPlanSubpointKey, number> = {
  "1_1": 4,
  "1_2": 3,
  "2_1": 3,
  "2_2": 3,
  "2_3": 1,
  "3_1": 3,
  "4_1": 3,
};

export const FOUR_POINT_PLAN_ACCENT_CLASS: Record<FourPointPlanPointKey, string> = {
  strategy: "from-bordeaux-900 via-bordeaux-700 to-beige-400",
  tax: "from-bordeaux-700 via-bordeaux-900 to-beige-400",
  relief: "from-bordeaux-900 via-accent to-beige-400",
  pension: "from-bordeaux-700 via-bordeaux-900 to-beige-400",
};
