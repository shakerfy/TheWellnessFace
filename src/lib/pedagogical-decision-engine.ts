import type { MealDynamicCta } from "./meal-coach-insights";
import { getScanSampleCtas, SCAN_SAMPLE_PRESET_CTAS } from "./scan-sample-ctas";

/**
 * Motor de Decisión de CTAs y Educación Somática (The Wellness Face)
 *
 * Principio rector:
 * 1. Cero moralidad alimentaria (sin palabras punitivas como engordar, culpa o trampa).
 * 2. Cero minijuegos o mecánicas lúdicas artificiales: información en Markdown puro y revelación progresiva.
 * 3. Jerarquía predecible de hasta 3 CTAs por comida:
 *    - CTA 1 (Primario): "Ver insight" (análisis somático inmediato).
 *    - CTA 2 (Continuidad): "Equilibrar mi día" o "Digestión y descanso" (de noche).
 *    - CTA 3 (Educación contextual): según tipo de comida (proteína, energía, sinergia, combustible).
 */
export function resolvePedagogicalCtas(mealItem: any): MealDynamicCta[] {
  // 1. Si el ítem ya trae CTAs personalizados explícitos (ej. guardados desde el escáner)
  if (
    mealItem?.customCtas &&
    Array.isArray(mealItem.customCtas) &&
    mealItem.customCtas.length > 0
  ) {
    return mealItem.customCtas;
  }

  // 2. Si coincide con alguno de los 11 ejemplos del escáner
  if (mealItem?.id && SCAN_SAMPLE_PRESET_CTAS[mealItem.id]) {
    return getScanSampleCtas(mealItem.id);
  }

  const reason: "rutina" | "social" | "placer" | "confort" =
    mealItem?.eatingReason || "rutina";
  const title = mealItem?.title || "Comida";
  const text = `${title} ${mealItem?.narrative || mealItem?.desc || ""}`.toLowerCase();

  // Detectar Cronobiología (Cenas después de las 19:30 o indicadas como noche)
  const timeMatch = String(mealItem?.time || "").match(/(\d{1,2}):(\d{2})/);
  const parsedHour = timeMatch ? parseInt(timeMatch[1], 10) : new Date().getHours();
  const isNightMeal =
    parsedHour >= 19 ||
    parsedHour < 4 ||
    /cena|noche/i.test(`${mealItem?.mealType || ""} ${text}`);

  // Detectar Pre/Post Entrenamiento
  const tag =
    mealItem?.timingFit?.tag ||
    (typeof mealItem?.contextBadge === "string" ? mealItem.contextBadge : mealItem?.contextBadge?.label) ||
    "";
  const isWorkoutRelated =
    mealItem?.isPreWorkout ||
    mealItem?.isPostWorkout ||
    /pre-entreno|post-entreno|entrenamiento/i.test(`${tag} ${mealItem?.contextTag || ""}`);

  // Detectar si el plato es vegetariano o requiere educación sobre proteína
  const isVeggieOrLowProtein =
    /hamburguesa vegetariana|veggie|vegetariano|tofu|soja|ensalada|arroz|fruta|avena/i.test(text) ||
    (mealItem?.protein !== undefined && mealItem.protein < 18);

  // Detectar si es denso en azúcares simples / golosinas / energía rápida
  const isQuickEnergy =
    /sour patch|golosina|caramelo|galleta|dulce|factura|medialuna|pan blanco|gaseosa/i.test(text);

  // Detectar platos densos en micronutrientes (Tier 3)
  const isNutrientDense =
    /salmón|salmon|quinoa|pechuga|huevo|legumbre|lenteja|garbanzo|semillas|palta|brócoli/i.test(text);

  // Detectar si es snack o merienda
  const isSnack =
    /merienda|snack|colaci|tarde/i.test(`${mealItem?.mealType || ""} ${text}`);

  // 1. CTA PRIMARIO (Siempre presente)
  const primaryCta: MealDynamicCta = {
    id: "view-insight",
    type: "insight",
    title: "Ver insight",
    iconType: "sparkles",
  };

  // 2. CTA SECUNDARIO 1 (Continuidad Diaria / Balance 24h)
  const balanceCta: MealDynamicCta = isNightMeal
    ? {
        id: "night-rest-prep",
        type: "balance",
        title: "Digestión y descanso",
        iconType: "moon",
      }
    : {
        id: "balance-my-day",
        type: "balance",
        title: "Equilibrar mi día",
        iconType: "apple",
      };

  // 3. CTA SECUNDARIO 2 (Educación contextual adaptativa)
  let educationCta: MealDynamicCta;

  if (isVeggieOrLowProtein) {
    educationCta = {
      id: "why-protein-matters",
      type: "education",
      title: "Por qué es importante la proteína",
      iconType: "shield",
    };
  } else if (isWorkoutRelated) {
    educationCta = {
      id: "workout-fuel",
      type: "education",
      title: "Recuperación y combustible",
      iconType: "activity",
    };
  } else if (isQuickEnergy) {
    educationCta = {
      id: "sustained-energy",
      type: "education",
      title: "Energía sostenida sin bajón",
      iconType: "sun",
    };
  } else if (isNutrientDense) {
    educationCta = {
      id: "plate-synergy",
      type: "education",
      title: "Sinergia de nutrientes",
      iconType: "sparkles",
    };
  } else if (isSnack) {
    educationCta = {
      id: "smart-snack-idea",
      type: "education",
      title: "Saciedad inteligente",
      iconType: "apple",
    };
  } else if (reason === "confort") {
    educationCta = {
      id: "take_a_pause",
      type: "education",
      title: "Un minuto de respiración",
      iconType: "wind",
    };
  } else {
    educationCta = {
      id: "evaluate-hydration",
      type: "education",
      title: "Hidratación de apoyo",
      iconType: "droplet",
    };
  }

  // Retornar exactamente de 2 a 3 CTAs limpios
  return [primaryCta, balanceCta, educationCta];
}
