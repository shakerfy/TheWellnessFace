import { GymClassItem, StaffMember } from "./types";

export const DEFAULT_MEMBERS = [
  { name: "Agustín Gómez", plan: "Pase Libre", status: "activo", phone: "+54 9 11 3242-1241" },
  { name: "Camila Díaz", plan: "Performance", status: "activo", phone: "+54 9 11 4124-5124" },
  { name: "Marcos López", plan: "Pase Libre", status: "activo", phone: "+54 9 11 2341-2412" },
  { name: "Tomás Ruiz", plan: "Performance", status: "activo", phone: "+54 9 11 5122-1234" },
  { name: "Lucas Torres", plan: "Performance", status: "activo", phone: "+54 9 11 4124-1111" },
  { name: "Paula Cáceres", plan: "Pase Libre", status: "activo", phone: "+54 9 11 2344-9999" },
  { name: "Sofía Martínez", plan: "Pase Libre", status: "activo", phone: "+54 9 11 3333-8888" },
  { name: "Pedro Giménez", plan: "Pase Libre", status: "activo", phone: "+54 9 11 4444-7777" },
  { name: "María del Mar", plan: "Performance", status: "activo", phone: "+54 9 11 5555-6666" },
];

export function isTimeOverlapping(time1: string, time2: string): boolean {
  try {
    const toMinutes = (timeStr: string) => {
      const [start, end] = timeStr.split("-").map((t) => t.trim());
      const [startH, startM] = start.split(":").map(Number);
      const [endH, endM] = end.split(":").map(Number);
      return { startMin: startH * 60 + startM, endMin: endH * 60 + endM };
    };
    const r1 = toMinutes(time1);
    const r2 = toMinutes(time2);
    return r1.startMin < r2.endMin && r2.startMin < r1.endMin;
  } catch {
    return false;
  }
}

export function computeAvailabilityWarning(
  staffId: string,
  time: string,
  day: number,
  staffList: StaffMember[],
): string | null {
  if (!staffId || !time) return null;
  const coach = staffList.find((s) => s.id === staffId);
  if (!coach || !coach.availability || coach.availability.length === 0) return null;

  const weekdayNames = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  const targetDayName = weekdayNames[day];
  const DayAvail = coach.availability.find((a) => a.day === targetDayName);

  if (!DayAvail || !DayAvail.intervals || DayAvail.intervals.length === 0) {
    return `Alerta: El instructor no tiene disponibilidad los ${targetDayName}.`;
  }

  try {
    const [classFrom, classTo] = time.split("-").map((t) => t.trim());
    const toMinutes = (h: string) => {
      const [hh, mm] = h.split(":").map(Number);
      return hh * 60 + mm;
    };

    const classStart = toMinutes(classFrom);
    const classEnd = toMinutes(classTo);

    const fits = DayAvail.intervals.some((interval) => {
      const intervalStart = toMinutes(interval.from);
      const intervalEnd = toMinutes(interval.to);
      return classStart >= intervalStart && classEnd <= intervalEnd;
    });

    if (!fits) {
      const intervalsStr = DayAvail.intervals
        .map((i) => `${i.from} a ${i.to}`)
        .join(" o ");
      return `Alerta: El horario (${time}) está fuera de la disponibilidad del instructor (${intervalsStr}).`;
    }
  } catch {
    // ignore
  }
  return null;
}

export function computeConflictWarning(
  staffId: string,
  time: string,
  day: number,
  classesList: GymClassItem[],
  editingClassId: string | null,
): string | null {
  if (!staffId || !time) return null;
  const conflictingClass = classesList.find((c) => {
    const matchesDay = c.day === day;
    const matchesStaff = c.staffId === staffId;
    const isNotSelf = c.id !== editingClassId;
    return matchesDay && matchesStaff && isNotSelf && isTimeOverlapping(c.time, time);
  });
  if (conflictingClass) {
    return `Conflicto: El instructor ya tiene asignada la clase "${conflictingClass.name}" el mismo día a las ${conflictingClass.time} hs.`;
  }
  return null;
}

export function filterStaffByActivity(name: string, staffList: StaffMember[]): StaffMember[] {
  if (!name) return staffList;
  const selectedActLower = name.toLowerCase().trim();

  return staffList.filter((s) => {
    const specs: string[] = s.specialties || [];
    const legacySpec: string = s.specialty || "";

    const matchesArray = specs.some((sp: string) => {
      const spLower = sp.toLowerCase();
      return (
        spLower.includes(selectedActLower) ||
        selectedActLower.includes(spLower) ||
        (selectedActLower.includes("crossfit") && spLower.includes("crossfit")) ||
        (selectedActLower.includes("yoga") && spLower.includes("yoga")) ||
        (selectedActLower.includes("spinning") && spLower.includes("spinning")) ||
        (selectedActLower.includes("pilates") && spLower.includes("pilates")) ||
        (selectedActLower.includes("funcional") && spLower.includes("funcional")) ||
        (selectedActLower.includes("fuerza") && spLower.includes("fuerza"))
      );
    });

    const matchesLegacy =
      legacySpec.toLowerCase().includes(selectedActLower) ||
      selectedActLower.includes(legacySpec.toLowerCase());

    return matchesArray || matchesLegacy;
  });
}
