import { MemberItem, MemberHistory } from "./types";
import { toast } from "sonner";

export const DAY_NAMES_ES = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

export const getStatusBadgeColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "activo":
      return "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20";
    case "pendiente":
    case "vencido":
      return "text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20";
    case "congelado":
      return "text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20";
    case "cancelado":
      return "text-muted-foreground bg-secondary border border-border";
    default:
      return "text-destructive bg-destructive/10 border border-destructive/20";
  }
};

export const getExpirationDateForPlan = (planName: string, membershipsList?: any[]) => {
  const planObj = membershipsList?.find((m: any) => m.name === planName);
  const duration = planObj?.duration || "Mensual";
  const now = new Date();
  if (duration === "Semanal") {
    now.setDate(now.getDate() + 7);
  } else if (duration === "Trimestral") {
    now.setMonth(now.getMonth() + 3);
  } else if (duration === "Semestral") {
    now.setMonth(now.getMonth() + 6);
  } else if (duration === "Anual") {
    now.setFullYear(now.getFullYear() + 1);
  } else {
    now.setMonth(now.getMonth() + 1);
  }
  return now.toISOString().split("T")[0];
};

export const getMemberHistory = (memberName: string, classesList?: any[]): MemberHistory => {
  const attended: {
    className: string;
    day: string;
    time: string;
    staffId: string;
    rating?: { stars: number; comment?: string };
  }[] = [];
  const enrolled: { className: string; day: string; time: string }[] = [];

  (classesList || []).forEach((c: any) => {
    const enrolledEntry = Object.entries(c.enrolledSpots || {}).find(
      ([, name]) => name === memberName,
    );
    if (!enrolledEntry) return;
    const spotIdx = parseInt(enrolledEntry[0]);
    const att = c.attendance?.[spotIdx];
    const dayLabel = DAY_NAMES_ES[c.day] ?? `Día ${c.day}`;

    if (att === "presente") {
      attended.push({
        className: c.name,
        day: dayLabel,
        time: c.time,
        staffId: c.staffId,
        rating: c.ratings?.[memberName],
      });
    } else if (!att || att === "pendiente") {
      enrolled.push({ className: c.name, day: dayLabel, time: c.time });
    }
  });

  const absentCount = (classesList || []).filter(
    (c: any) =>
      Object.values(c.enrolledSpots || {}).includes(memberName) &&
      c.attendance &&
      Object.entries(c.enrolledSpots || {}).some(
        ([idx, name]) => name === memberName && c.attendance?.[parseInt(idx)] === "ausente",
      ),
  ).length;

  const totalEnrolled = attended.length + enrolled.length + absentCount;
  const attendanceRate = totalEnrolled > 0 ? Math.round((attended.length / totalEnrolled) * 100) : null;
  const lastClass = attended[attended.length - 1];
  const isChurnRisk = attended.length === 0 || (attended.length <= 1 && enrolled.length === 0);

  return { attended, enrolled, attendanceRate, lastClass, isChurnRisk };
};

export const computeMemberStats = (membersList: MemberItem[], classesList?: any[]) => {
  let actives = 0;
  let debts = 0;
  let expiredAptos = 0;
  let churnRisks = 0;

  membersList.forEach((m) => {
    if (m.status === "activo") actives++;
    if (m.status === "vencido" || m.status === "pendiente") debts++;

    const isAptoExpired =
      m.hasApto !== "Entregado" ||
      (m.hasApto === "Entregado" && m.aptoExp && new Date(m.aptoExp) < new Date());
    if (isAptoExpired) expiredAptos++;

    const history = getMemberHistory(m.name, classesList);
    if (history.isChurnRisk) churnRisks++;
  });

  return { actives, debts, expiredAptos, churnRisks };
};

export const exportMembersToCsv = (filteredMembers: MemberItem[]) => {
  if (!filteredMembers.length) {
    toast.error("No hay alumnos visibles para exportar.");
    return;
  }
  const headers = [
    "Nombre",
    "DNI",
    "Email",
    "Teléfono",
    "Plan",
    "Estado",
    "Vencimiento",
    "Apto Médico",
  ];
  const rows = filteredMembers.map((m) => [
    `"${m.name || ""}"`,
    `"${m.dni || ""}"`,
    `"${m.email || ""}"`,
    `"${m.phone || ""}"`,
    `"${m.plan || ""}"`,
    `"${m.status || ""}"`,
    `"${m.end || ""}"`,
    `"${m.hasApto || "Pendiente"}"`,
  ]);
  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `miembros_shakerfy_${new Date().toISOString().split("T")[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  toast.success("Nómina de alumnos exportada a CSV con éxito.");
};
