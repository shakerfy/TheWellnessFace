import { StaffDayAvailability, StaffFormData } from "./types";

export const WEEKDAYS = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
] as const;

export function createDefaultAvailability(): StaffDayAvailability[] {
  return WEEKDAYS.map((day) => ({ day, intervals: [] }));
}

export const DEFAULT_STAFF_FORM: StaffFormData = {
  name: "",
  specialties: [],
  specialtyText: "",
  certificationsText: "",
  role: "coach",
  branchId: "matriz",
  avatarUrl: null,
  diplomas: [],
  availability: createDefaultAvailability(),
};
