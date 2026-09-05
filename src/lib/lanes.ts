export const LANES = [
  "building",
  "investigating",
  "deciding",
  "keeping",
] as const;

export type Lane = (typeof LANES)[number];

export const LANE_LABELS: Record<Lane, string> = {
  building: "BUILDING",
  investigating: "INVESTIGATING",
  deciding: "DECIDING",
  keeping: "KEEPING",
};

export const LANE_DESCRIPTIONS: Record<Lane, string> = {
  building: "Things taking shape",
  investigating: "Questions worth exploring",
  deciding: "Choices worth remembering",
  keeping: "References worth saving",
};

export function isLane(value: string | null | undefined): value is Lane {
  return LANES.includes(value as Lane);
}
