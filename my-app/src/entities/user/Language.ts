export const Language = {
  RO: "RO",
  EN: "EN",
} as const;
export type Language = (typeof Language)[keyof typeof Language];
