import type { MealDynamicCta } from "@/lib/meal-coach-insights";

export type CtaItemId =
  | "armstrong"
  | "breathing"
  | "satiety"
  | "digestion"
  | "pace"
  | "accompaniment"
  | "next_meal"
  | "anti_drowsiness"
  | "night_rest"
  | "meal_simulator";

export interface CtaTabMeta {
  id: CtaItemId;
  label: string;
  category: string;
  description: string;
  clinicalTag?: string;
}

export const CTA_TABS: CtaTabMeta[] = [
  {
    id: "armstrong",
    label: "1. Hidratación",
    category: "Agua",
    description: "Reconocé tu nivel de hidratación de un vistazo, sin contar vasos.",
  },
  {
    id: "breathing",
    label: "2. Respirar",
    category: "Calma",
    description: "Un minuto guiado para bajar el ritmo y digerir con ligereza.",
  },
  {
    id: "satiety",
    label: "3. Saciedad",
    category: "Sensaciones",
    description: "Conectá con las señales naturales de tu cuerpo al terminar de comer.",
  },
  {
    id: "digestion",
    label: "4. Digestión",
    category: "Confort",
    description: "Registrá qué combinaciones te hacen sentir más liviano y con energía.",
  },
  {
    id: "pace",
    label: "5. Ritmo",
    category: "Pausa",
    description: "Comer sin prisa y sin pantallas cambia cómo se siente tu cuerpo.",
  },
  {
    id: "accompaniment",
    label: "6. Sumar al plato",
    category: "Adición",
    description: "Agregá agua fresca, fibra o complementos en un solo toque.",
  },
  {
    id: "next_meal",
    label: "7. Próxima comida",
    category: "Hábitos",
    description: "Guardá un foco para tenerlo presente en tu siguiente plato.",
  },
  {
    id: "anti_drowsiness",
    label: "8. Energía",
    category: "Vitalidad",
    description: "Gestos simples para despejar la mente y evitar el bajón de la tarde.",
  },
  {
    id: "night_rest",
    label: "9. Descanso",
    category: "Noche",
    description: "Pautas sencillas para cenar liviano y dormir profundo.",
  },
  {
    id: "meal_simulator",
    label: "10. Vista en el diario",
    category: "Ejemplo",
    description: "Mirá cómo se adaptan estas acciones dentro de una comida real.",
  },
];

export interface SimulatorMealPreset {
  id: string;
  title: string;
  desc: string;
  mealType: string;
  eatingReason: "rutina" | "social" | "placer" | "confort";
  time: string;
  bioScore: number;
  protein?: number;
  isPostWorkout?: boolean;
}

export const SIMULATOR_MEALS: SimulatorMealPreset[] = [
  {
    id: "sim_salmon",
    title: "Bowl de Salmón, Quinoa y Palta",
    desc: "Salmón dorado con semillas de sésamo, base de quinoa tibia, hojas verdes y vegetales frescos.",
    mealType: "Almuerzo",
    eatingReason: "rutina",
    time: "13:15",
    bioScore: 88,
    protein: 32,
  },
  {
    id: "sim_pasta",
    title: "Pasta con Salsa de Tomate y Albahaca",
    desc: "Plato de fideos caseros con salsa de tomate natural, oliva extra virgen y queso rallado.",
    mealType: "Almuerzo",
    eatingReason: "placer",
    time: "13:45",
    bioScore: 62,
    protein: 14,
  },
  {
    id: "sim_comfort",
    title: "Sopa de Verduras con Tostadas",
    desc: "Cazuela caliente de vegetales en día de alta exigencia laboral o estrés acumulado.",
    mealType: "Cena",
    eatingReason: "confort",
    time: "20:30",
    bioScore: 70,
  },
  {
    id: "sim_postworkout",
    title: "Omelette de Huevo con Espinaca y Batata",
    desc: "Comida registrada tras 50 minutos de fuerza en el gimnasio.",
    mealType: "Post-entreno",
    eatingReason: "rutina",
    time: "19:00",
    bioScore: 84,
    protein: 26,
    isPostWorkout: true,
  },
  {
    id: "sim_snack",
    title: "Yogur Natural con Nueces y Arándanos",
    desc: "Colación de media tarde para sostener energía de forma pareja sin bajones.",
    mealType: "Merienda",
    eatingReason: "rutina",
    time: "17:15",
    bioScore: 78,
  },
];
