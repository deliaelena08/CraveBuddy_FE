export const UserRole = {
  USER: "USER",
  OWNER: "OWNER",
  ADMIN: "ADMIN",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
