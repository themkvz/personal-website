export const TRACK_EVENTS = {
  HERO_WORKBENCH_CLICKED: "Clicked Explore the Workbench",
  HERO_ABOUT_CLICKED: "Clicked About",
  CONTACT_EMAIL_CLICKED: "Clicked Get in Touch",
  NOT_FOUND_CLICKED_BACK: "Clicked Back from Not Found",
  ARTIFACT_VIEWED: "Viewed Artifact",
  ARTIFACT_NOT_FOUND: "Requested Missing Artifact",
} as const;

export type TrackEvent = (typeof TRACK_EVENTS)[keyof typeof TRACK_EVENTS];
