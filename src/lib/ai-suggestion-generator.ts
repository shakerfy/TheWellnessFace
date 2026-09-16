// Generador de Sugerencias Nutricionales Contextuales — The Wellness Face
// Motor de Recomendación: Contexto Temporal + Objetivos de Calorías y Macros + Medidas Cotidianas
import { getEffectiveTargets } from "@/lib/nutrition-settings";

export interface NutritionalVector {
  category: "processing" | "fiber" | "protein" | "sugar" | "fat" | "grains" | "sodium";
  label: string;
  value: string;
}

export interface AiSuggestionOption {
  text: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  vectors?: NutritionalVector[];
}

export interface AiSuggestionData {
  id: string;
  contextTitle: string;
  contextType: "pre_workout" | "post_workout" | "breakfast" | "lunch" | "snack" | "dinner";
  options: AiSuggestionOption[];
  targetSummary: {
    remainingCalories: number;
    remainingProtein: number;
    remainingCarbs: number;
    remainingFat: number;
    targetCalories: number;
    targetProtein: number;
    balanceType?: string;
  };
  preferenceUsed?: string;
  timestamp: string;
}

export type DietaryRestriction = "none" | "no_meat" | "gluten_free" | "dairy_free" | "vegan";

export interface ContextCheckResult {
  title: string;
  type: AiSuggestionData["contextType"];
}

/**
 * Detecta el contexto biológico temporal del usuario (Pre/Post entreno o Hito Circadiano)
 */
export function detectBiologicalContext(): ContextCheckResult {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // 1. Verificar si hay una clase reservada en los próximos 120 minutos (Pre-Entreno)
  if (typeof window !== "undefined") {
    try {
      const resStr = localStorage.getItem("shakerfy_user_reservations");
      if (resStr) {
        const reservations = JSON.parse(resStr);
        if (Array.isArray(reservations)) {
          for (const r of reservations) {
            if (r && r.time) {
              const match = r.time.match(/(\d{1,2}):(\d{2})/);
              if (match) {
                const resMin = parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
                const diff = resMin - currentMinutes;
                if (diff > 0 && diff <= 120) {
                  const className = r.name || "tu clase";
                  return {
                    title: `Pre-Entreno • ${className} en ${diff} min`,
                    type: "pre_workout",
                  };
                }
              }
            }
          }
        }
      }
    } catch (_) {}
  }

  // 2. Verificar si hubo actividad reciente o check-in en los últimos 150 minutos (Post-Entreno)
  if (typeof window !== "undefined") {
    try {
      const itemsStr = localStorage.getItem("shakerfy_user_timeline_items");
      if (itemsStr) {
        const items = JSON.parse(itemsStr);
        if (Array.isArray(items)) {
          const todayIso = now.toISOString().split("T")[0];
          const recentAct = items.find((it: any) => {
            if (!it || !it.time) return false;
            if (it.date && it.date !== todayIso) return false;
            const isAct = it.type === "activity" || it.type === "workout" || it.type === "class_session";
            if (!isAct) return false;
            const match = it.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
            if (!match) return false;
            let h = parseInt(match[1], 10);
            const m = parseInt(match[2], 10);
            const mer = match[3]?.toUpperCase();
            if (mer === "PM" && h < 12) h += 12;
            if (mer === "AM" && h === 12) h = 0;
            const actMin = h * 60 + m;
            const diff = currentMinutes - actMin;
            return diff >= 0 && diff <= 150;
          });

          if (recentAct) {
            const actName = recentAct.activityName || recentAct.title || "Actividad";
            const hour = now.getHours();
            const prefix = hour >= 19 ? "Cena • Post-Entreno" : hour >= 12 ? "Almuerzo • Post-Entreno" : "Post-Entreno";
            return {
              title: `${prefix} (${actName})`,
              type: "post_workout",
            };
          }
        }
      }
    } catch (_) {}
  }

  // 3. Hitos Solares / Ritmo Circadiano
  const hour = now.getHours();

  if (hour >= 5 && hour < 10) {
    return { title: "Desayuno • Activación Matutina", type: "breakfast" };
  }
  if (hour >= 10 && hour < 12) {
    return { title: "Media Mañana • Energía Estable", type: "snack" };
  }
  if (hour >= 12 && hour < 16) {
    return { title: "Almuerzo • Cenit Solar", type: "lunch" };
  }
  if (hour >= 16 && hour < 19) {
    return { title: "Merienda • Transición de Tarde", type: "snack" };
  }
  return { title: "Cena • Digestión Ligera", type: "dinner" };
}

/**
 * Calcula el presupuesto nutricional diario (consumido vs objetivos de calorías y macros)
 * Aplica Balance Neutro Universal para todos los usuarios (sin diferenciación por objetivo biológico)
 */
export function getUserNutritionBudget() {
  let weight = 72;

  if (typeof window !== "undefined") {
    try {
      const profStr = localStorage.getItem("shakerfy_user_profile_edit");
      if (profStr) {
        const p = JSON.parse(profStr);
        if (p.weight) weight = Number(p.weight) || 72;
      }
    } catch (_) {}
  }

  // Balance Neutro Universal o Metas Personalizadas (desde nutrition-settings)
  const targets = getEffectiveTargets(weight);
  const targetCalories = targets.calories;
  const targetProtein = targets.protein;
  const targetCarbs = targets.carbs;
  const targetFat = targets.fat;

  // Consumo registrado hoy
  let consumedCalories = 0;
  let consumedProtein = 0;
  let consumedCarbs = 0;
  let consumedFat = 0;

  if (typeof window !== "undefined") {
    try {
      const itemsStr = localStorage.getItem("shakerfy_user_timeline_items");
      if (itemsStr) {
        const items = JSON.parse(itemsStr);
        if (Array.isArray(items)) {
          const todayIso = new Date().toISOString().split("T")[0];
          const dayMeals = items.filter(
            (m: any) =>
              m &&
              m.consumed &&
              (m.type === "meal" || m.isAiSuggestion || m.type === "ai_suggestion") &&
              (m.date === todayIso || !m.date),
          );
          consumedCalories = Math.round(dayMeals.reduce((acc, m) => acc + (m.calories || m.kcal || 0), 0));
          consumedProtein = Math.round(dayMeals.reduce((acc, m) => acc + (m.protein || 0), 0));
          consumedCarbs = Math.round(dayMeals.reduce((acc, m) => acc + (m.carbs || m.carbohydrates || 0), 0));
          consumedFat = Math.round(dayMeals.reduce((acc, m) => acc + (m.fat || 0), 0));
        }
      }
    } catch (_) {}
  }

  const remainingCalories = Math.max(0, targetCalories - consumedCalories);
  const remainingProtein = Math.max(0, targetProtein - consumedProtein);
  const remainingCarbs = Math.max(0, targetCarbs - consumedCarbs);
  const remainingFat = Math.max(0, targetFat - consumedFat);

  return {
    targetCalories,
    targetProtein,
    targetCarbs,
    targetFat,
    consumedCalories,
    consumedProtein,
    consumedCarbs,
    consumedFat,
    remainingCalories,
    remainingProtein,
    remainingCarbs,
    remainingFat,
    balanceType: "Balance Neutro",
  };
}

/**
 * Obtiene las restricciones activas guardadas en memorias de la IA
 */
export function getSavedDietaryPreference(): DietaryRestriction {
  if (typeof window === "undefined") return "none";
  try {
    const memoriesStr = localStorage.getItem("shakerfy_ai_memory") || localStorage.getItem("shakerfy_ai_memories");
    if (memoriesStr) {
      const mems = JSON.parse(memoriesStr);
      if (Array.isArray(mems)) {
        if (mems.some((m: any) => m.text?.includes("Sin carne") || m.text?.includes("Vegetariano"))) {
          return "no_meat";
        }
        if (mems.some((m: any) => m.text?.includes("Vegano"))) {
          return "vegan";
        }
        if (mems.some((m: any) => m.text?.includes("Sin gluten") || m.text?.includes("Celíaco"))) {
          return "gluten_free";
        }
        if (mems.some((m: any) => m.text?.includes("Sin lácteos"))) {
          return "dairy_free";
        }
      }
    }
  } catch (_) {}
  return "none";
}

/**
 * Guarda una preferencia dietaria directamente en la memoria de la IA
 */
export function saveDietaryPreferenceToAiMemory(text: string): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem("shakerfy_ai_memory") || localStorage.getItem("shakerfy_ai_memories");
    const mems = raw ? JSON.parse(raw) : [];
    const newMem = {
      id: `mem-${Date.now()}`,
      text: text.trim(),
      domain: "nutricion",
      category: "habito",
      createdAt: new Date().toISOString(),
    };
    const updated = [newMem, ...(Array.isArray(mems) ? mems.filter((m: any) => m.text !== text.trim()) : [])];
    localStorage.setItem("shakerfy_ai_memory", JSON.stringify(updated));
    localStorage.setItem("shakerfy_ai_memories", JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("shakerfy:ai-memory-updated", { detail: updated }));
  } catch (_) {}
}

/**
 * Genera opciones concretas en medidas cotidianas calculadas según contexto, calorías y macros restantes
 */
export function generateAiSuggestion(forceRestriction?: DietaryRestriction): AiSuggestionData {
  const context = detectBiologicalContext();
  const restriction = forceRestriction || getSavedDietaryPreference();
  const budget = getUserNutritionBudget();

  const needProtein = budget.remainingProtein >= 30;
  const lowCalorieBudget = budget.remainingCalories < 400;

  let options: AiSuggestionOption[] = [];

  switch (context.type) {
    case "pre_workout":
      if (restriction === "no_meat" || restriction === "vegan") {
        options = [
          {
            text: "1 banana mediana con 1 cucharada de mantequilla de maní y 1 tostada de pan integral.",
            calories: 270,
            protein: 8,
            carbs: 45,
            fat: 8,
          },
        ];
      } else if (restriction === "gluten_free") {
        options = [
          {
            text: "1 banana madura con 1 puñado de frutos secos (almendras o nueces) y 1 cucharada de miel cruda.",
            calories: 250,
            protein: 6,
            carbs: 42,
            fat: 9,
          },
        ];
      } else {
        options = [
          {
            text: "1 banana fresca con 1 cucharada de mantequilla de maní y 1 tostada de pan integral de masa madre.",
            calories: 265,
            protein: 8,
            carbs: 44,
            fat: 8,
          },
        ];
      }
      break;

    case "post_workout":
      if (restriction === "no_meat" || restriction === "vegan") {
        options = [
          {
            text: needProtein
              ? "1 taza y media de tofu salteado o garbanzos con 1 taza de arroz o batatas al horno y ensalada verde con 1 cucharada de oliva."
              : "1 taza de tofu salteado con 1 taza de arroz o batatas al horno y ensalada fresca.",
            calories: needProtein ? 490 : 420,
            protein: needProtein ? 32 : 24,
            carbs: 58,
            fat: 14,
          },
        ];
      } else if (restriction === "gluten_free") {
        options = [
          {
            text: needProtein
              ? "1 filete generoso (180g) de pechuga de pollo o pescado con 1 papa mediana al horno y ensalada mixta con 1 cucharada de oliva."
              : "1 filete de pechuga de pollo con 1 papa mediana al horno y ensalada mixta con 1 cucharada de oliva.",
            calories: needProtein ? 490 : 430,
            protein: needProtein ? 44 : 36,
            carbs: 38,
            fat: 13,
          },
        ];
      } else {
        options = [
          {
            text: needProtein
              ? "1 filete grande (180g) de pechuga o carne magra con 1 taza de puré o arroz y un plato de ensalada fresca con oliva."
              : "1 filete de pollo o pescado con 1 taza de puré de calabaza (o arroz) y un plato de ensalada fresca.",
            calories: needProtein ? 510 : 440,
            protein: needProtein ? 45 : 36,
            carbs: 42,
            fat: 14,
          },
        ];
      }
      break;

    case "breakfast":
      if (restriction === "no_meat" || restriction === "vegan") {
        options = [
          {
            text: "1 taza de avena tibia cocida con leche de almendras, 1 cucharada de semillas de chía y 1 fruta fresca picada.",
            calories: 340,
            protein: 12,
            carbs: 56,
            fat: 9,
          },
        ];
      } else if (restriction === "gluten_free") {
        options = [
          {
            text: "2 a 3 huevos revueltos con 1/4 de palta fresca y 1 fruta entera (naranja o manzana).",
            calories: 340,
            protein: 20,
            carbs: 22,
            fat: 20,
          },
        ];
      } else {
        options = [
          {
            text: "2 huevos a la plancha con 2 tostadas integrales de masa madre y 1/4 de palta pisada.",
            calories: 380,
            protein: 21,
            carbs: 35,
            fat: 18,
          },
        ];
      }
      break;

    case "lunch":
      if (restriction === "no_meat" || restriction === "vegan") {
        options = [
          {
            text: "1 plato hondo de ensalada variada con 1 taza de lentejas o garbanzos, semillas y 1 taza de arroz integral.",
            calories: 470,
            protein: 22,
            carbs: 72,
            fat: 11,
          },
        ];
      } else if (restriction === "gluten_free") {
        options = [
          {
            text: "1 bife magro o pechuga de pollo (160g) con 1 plato de ensalada colorida y 1 papa mediana al horno con oliva.",
            calories: 480,
            protein: 40,
            carbs: 40,
            fat: 16,
          },
        ];
      } else {
        options = [
          {
            text: "1 filete de pechuga o carne magra con 1 taza de arroz o puré de calabaza y ensalada de hojas verdes con oliva.",
            calories: 490,
            protein: 42,
            carbs: 46,
            fat: 14,
          },
        ];
      }
      break;

    case "snack":
      if (restriction === "no_meat" || restriction === "vegan") {
        options = [
          {
            text: "1 taza de yogur vegetal con 1 puñado de nueces y trozos de manzana fresca.",
            calories: 240,
            protein: 8,
            carbs: 28,
            fat: 12,
          },
        ];
      } else if (restriction === "gluten_free") {
        options = [
          {
            text: "1 puñado de frutos secos surtidos con 1 banana madura fresca.",
            calories: 230,
            protein: 6,
            carbs: 32,
            fat: 10,
          },
        ];
      } else {
        options = [
          {
            text: "1 taza de yogur natural con 1 puñado de nueces picadas y 1 cucharadita de semillas de chía.",
            calories: 260,
            protein: 14,
            carbs: 22,
            fat: 13,
          },
        ];
      }
      break;

    case "dinner":
    default:
      if (restriction === "no_meat" || restriction === "vegan") {
        options = [
          {
            text: lowCalorieBudget
              ? "1 plato hondo de sopa de verduras con 1 taza de garbanzos cocidos y 1 cucharadita de semillas de calabaza."
              : "1 plato hondo de sopa de verduras con 1 taza de garbanzos o cubos de tofu tibio y 1 cucharada de semillas.",
            calories: lowCalorieBudget ? 310 : 390,
            protein: lowCalorieBudget ? 16 : 22,
            carbs: 45,
            fat: 8,
          },
        ];
      } else if (restriction === "gluten_free") {
        options = [
          {
            text: lowCalorieBudget
              ? "1 filete de pescado blanco al limón con 1 taza de zapallitos al vapor y 1 cucharadita de aceite de oliva."
              : "1 filete de pescado blanco al limón con 1 taza y media de verduras al vapor y 1 cucharada de aceite de oliva.",
            calories: lowCalorieBudget ? 270 : 350,
            protein: 34,
            carbs: 12,
            fat: lowCalorieBudget ? 8 : 14,
          },
        ];
      } else {
        options = [
          {
            text: lowCalorieBudget
              ? "1 filete de pechuga o pescado blanco al limón con 1 taza de verduras cocidas o sopa tibia y 1 cucharadita de oliva."
              : "1 filete de pollo o pescado blanco con 1 taza de verduras cocidas o sopa tibia y 1 cucharada de aceite de oliva.",
            calories: lowCalorieBudget ? 290 : 380,
            protein: 36,
            carbs: 14,
            fat: lowCalorieBudget ? 9 : 16,
          },
        ];
      }
      break;
  }

  const now = new Date();
  const timeStr = now.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });

  const enrichedOptions: AiSuggestionOption[] = options.map((opt) => ({
    ...opt,
    vectors: computeNutritionalVectors(opt.text, opt.protein),
  }));

  return {
    id: `ai-sugg-${Date.now()}`,
    contextTitle: context.title,
    contextType: context.type,
    options: enrichedOptions,
    targetSummary: {
      remainingCalories: budget.remainingCalories,
      remainingProtein: budget.remainingProtein,
      remainingCarbs: budget.remainingCarbs,
      remainingFat: budget.remainingFat,
      targetCalories: budget.targetCalories,
      targetProtein: budget.targetProtein,
      balanceType: budget.balanceType,
    },
    preferenceUsed: restriction !== "none" ? restriction : undefined,
    timestamp: timeStr,
  };
}

/**
 * Calcula los 7 Vectores Nutricionales para la opción sugerida
 */
export function computeNutritionalVectors(text: string, protein: number): NutritionalVector[] {
  const lower = text.toLowerCase();

  const hasHighFiber = /avena|quinoa|lentejas|garbanzos|batata|papa|espinacas|brócoli|zapallito|chía|manzana/i.test(lower);
  const hasHealthyFat = /palta|oliva|maní|almendras|nueces|semillas|salmón/i.test(lower);
  const hasWholeGrains = /avena|quinoa|integral|masa madre|arroz integral|maíz/i.test(lower);

  return [
    { category: "processing", label: "Procesamiento", value: "Mínimamente procesado" },
    { category: "fiber", label: "Fibra", value: hasHighFiber ? "Alto en fibra" : "Buena fuente" },
    { category: "protein", label: "Proteína", value: protein >= 25 ? "Alto en proteína" : "Proteína moderada" },
    { category: "sugar", label: "Azúcares añadidos", value: "Sin azúcar añadido" },
    { category: "fat", label: "Grasas", value: hasHealthyFat ? "Grasas saludables" : "Moderadas" },
    { category: "grains", label: "Granos", value: hasWholeGrains ? "Granos enteros" : "Sin granos refinados" },
    { category: "sodium", label: "Sodio", value: "Bajo en sodio" },
  ];
}
