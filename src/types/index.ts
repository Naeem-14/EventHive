export type Role = "attendee" | "organizer";

export const USER_ROLES = {
  attendee: "attendee",
  organizer: "organizer",
} as const;

export interface LoginCredentials {
  email: string;
  password: string;
}

