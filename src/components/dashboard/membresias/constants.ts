import { MembershipFormData } from "./types";

export const FITNESS_ACTIVITIES = [
  "Musculación / Sala de Máquinas",
  "CrossFit WOD",
  "Levantamiento Olímpico",
  "Yoga Vinyasa / Ashtanga",
  "Yoga Hatha / Iyengar",
  "Yoga Bikram / Caliente",
  "Entrenamiento Funcional",
  "Pilates Reformer",
  "Pilates de Suelo (Mat)",
  "Spinning / Ciclismo Indoor",
  "Natación Libre",
  "Natación Escuela (Niños/Adultos)",
  "Acuagym / Fitness Acuático",
  "Calistenia / Street Workout",
  "Boxeo Recreativo",
  "Boxeo de Competición",
  "Kickboxing / K1",
  "Muay Thai / Boxeo Tailandés",
  "Jiu Jitsu Brasileño (BJJ)",
  "MMA (Artes Marciales Mixtas)",
  "Zumba / Ritmos Latinos",
  "Gap (Glúteos, Abdomen, Piernas)",
  "HIIT / Circuitos de Alta Intensidad",
  "Running Club / Running Outdoor",
  "Kettlebells (Pesas Rusas)",
  "Fuerza de Powerlifting",
  "Estiramiento & Flexibilidad",
  "Gimnasia Artística",
  "Taekwondo WT/ITF",
  "Fisioterapia y Kinesiología",
];

export const PERIODICITY_OPTIONS = [
  "Semanal",
  "Mensual",
  "Trimestral",
  "Semestral",
  "Anual",
] as const;

export const TAG_OPTIONS = [
  "Pase Libre",
  "Planes Premium",
  "Solo Clases",
] as const;

export const PASS_TYPE_OPTIONS = [
  { value: "Pase Libre", label: "Pase Libre (Acceso ilimitado)" },
  { value: "Por Créditos", label: "Por Créditos (Límite de clases)" },
] as const;

export const ACCESS_HOURS_OPTIONS = [
  { value: "Todo Horario", label: "Todo Horario (Full Access)" },
  { value: "Off-Peak", label: "Off-Peak (Franja horaria especial)" },
] as const;

export const DAILY_CLASS_LIMITS = [
  "Ilimitado",
  "1 clase por día",
  "2 clases por día",
] as const;

export const DEFAULT_MEMBERSHIP_FORM: MembershipFormData = {
  name: "",
  price: "",
  originalPrice: "",
  periodicity: "Mensual",
  tag: "Pase Libre",
  passType: "Pase Libre",
  creditsCount: "12",
  accessHoursType: "Todo Horario",
  offPeakStart: "12:00",
  offPeakEnd: "16:00",
  includedActivities: [],
  selectedServices: [],
  registrationFee: "0",
  freezeDays: "0",
  dailyClassLimit: "Ilimitado",
};
