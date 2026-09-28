import { Dumbbell, Flame, Heart, TrendingUp } from "lucide-react";
import { AiMemoryItem, AppSettingsData, UserProfileData } from "./types";

export const DEFAULT_AI_MEMORIES: AiMemoryItem[] = [
  // Nutrición
  {
    id: "mem-1",
    text: "Prioriza pan de masa madre y granos enteros en desayunos",
    domain: "nutricion",
    category: "carbo",
  },
  {
    id: "mem-2",
    text: "Prefiere tofu marinado, pechuga de pollo y huevos como proteínas",
    domain: "nutricion",
    category: "proteina",
  },
  {
    id: "mem-3",
    text: "Grasas favoritas: Palta fresca, semillas de chía y frutos secos",
    domain: "nutricion",
    category: "grasa",
  },
  {
    id: "mem-4",
    text: "Suele optar por infusiones o bebidas vegetales ligeras sin azúcar",
    domain: "nutricion",
    category: "habito",
  },
  // Entrenamiento
  {
    id: "mem-5",
    text: "Ritmo de Fuerza & Hipertrofia óptimo: Mantener sobrecarga progresiva controlada",
    domain: "entrenamiento",
    category: "intensidad",
  },
  {
    id: "mem-6",
    text: "Prefiere ejercicios con banco ajustable, mancuernas y calentamiento articular guiado",
    domain: "entrenamiento",
    category: "ejercicio",
  },
  {
    id: "mem-7",
    text: "Prioriza descansos de 60-90s en series de alta demanda para cuidar técnica",
    domain: "entrenamiento",
    category: "cuidado",
  },
];

export const DEFAULT_USER_PROFILE: UserProfileData = {
  fullName: "Agustín Gómez",
  phone: "+54 9 11 4982-9011",
  email: "agustin.gomez@shakerfy.com",
  location: "Palermo, Buenos Aires",
  sex: "masculino",
  birthDate: "1996-05-14",
  units: "metrico",
  height: "175",
  weight: "72",
  goal: "en_forma",
};

export const DEFAULT_APP_SETTINGS: AppSettingsData = {
  theme: "system",
  language: "es",
  reminders: true,
};

export const GOAL_OPTIONS = [
  { id: "musculo", label: "Ganar músculo", icon: Dumbbell, color: "text-orange-500" },
  { id: "en_forma", label: "Ponerme en forma", icon: Flame, color: "text-amber-500" },
  { id: "perder_peso", label: "Perder peso", icon: TrendingUp, color: "text-emerald-500" },
  { id: "saludable", label: "Ser saludable", icon: Heart, color: "text-rose-500" },
] as const;

export function getGoalLabel(g: string): string {
  switch (g) {
    case "musculo":
      return "Ganar músculo";
    case "perder_peso":
      return "Perder peso";
    case "saludable":
      return "Ser saludable";
    default:
      return "Ponerme en forma";
  }
}
