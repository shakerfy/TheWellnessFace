import type { AttendanceHistoryItem, RecentCheckinItem } from "./types";

export const INITIAL_ATTENDANCE_HISTORY: AttendanceHistoryItem[] = [
  {
    id: "h1",
    name: "Agustín Gómez",
    date: "Hoy",
    time: "11:24 AM",
    method: "Scan QR",
    status: "Presente",
    distance: "En recepción",
    class: "CrossFit WOD",
  },
  {
    id: "h2",
    name: "Camila Díaz",
    date: "Hoy",
    time: "11:15 AM",
    method: "Geolocalización GPS",
    status: "Presente",
    distance: "18m de sede",
    class: "Musculación Libre",
  },
  {
    id: "h3",
    name: "Marcos López",
    date: "Hoy",
    time: "10:54 AM",
    method: "Scan QR",
    status: "Presente",
    distance: "En recepción",
    class: "CrossFit WOD",
  },
  {
    id: "h4",
    name: "Sofía Martínez",
    date: "Hoy",
    time: "09:30 AM",
    method: "Geolocalización GPS",
    status: "Presente",
    distance: "24m de sede",
    class: "Yoga Ashtanga",
  },
  {
    id: "h5",
    name: "Lucas Torres",
    date: "Ayer",
    time: "19:10 PM",
    method: "Recepción",
    status: "Presente",
    distance: "Manual Recepción",
    class: "Spinning Pro",
  },
  {
    id: "h6",
    name: "Mateo Rossi",
    date: "Ayer",
    time: "18:00 PM",
    method: "Scan QR",
    status: "Ausente / No-Show",
    distance: "-",
    class: "Functional Training",
  },
];

export const INITIAL_RECENT_CHECKINS: RecentCheckinItem[] = [
  {
    name: "Agustín Gómez",
    time: "11:24 AM",
    method: "Scan QR",
    alert: "Lesión Rodilla",
    alertColor: "bg-secondary text-secondary-foreground border-border",
    photo:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80",
  },
  {
    name: "Camila Díaz",
    time: "11:15 AM",
    method: "Geolocalización GPS",
    alert: "Pago Pendiente",
    alertColor: "bg-destructive/10 text-destructive border-destructive/30",
    photo:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80",
  },
  {
    name: "Marcos López",
    time: "10:54 AM",
    method: "Scan QR",
    alert: null,
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80",
  },
  {
    name: "Lucía Fernández",
    time: "10:30 AM",
    method: "Geolocalización GPS",
    alert: null,
    photo:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80",
  },
];
