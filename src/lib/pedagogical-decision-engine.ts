import type { MealDynamicCta } from "./meal-coach-insights";
import { getScanSampleCtas, SCAN_SAMPLE_PRESET_CTAS } from "./scan-sample-ctas";
import { getSampleMiniGameForMeal } from "./mini-game-samples";

/**
 * Motor de Decisión Pedagógica y Somática (The Wellness Face)
 *
 * Principio rector:
 * 1. Cero moralidad alimentaria (sin palabras punitivas como engordar, culpa o trampa).
 * 2. Lenguaje equilibrado: ni abstracto de laboratorio ni infantil; beneficio somático tangible.
 * 3. Los minijuegos son un recurso pedagógico OPORTUNO (aparecen solo cuando su interacción
 *    fija un concepto o derriba un mito mejor que un texto). En los demás momentos,
 *    prioriza información educativa, sugerencias de platos o regulación somática.
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
  const text = `${mealItem?.title || ""} ${mealItem?.narrative || mealItem?.desc || ""}`.toLowerCase();

  // 3. REGLA ANTI-ESTRÉS: Comidas por Confort / Ansiedad
  // Prohibidos los juegos y quizzes. El sistema nervioso necesita calma autonómica pura.
  if (reason === "confort") {
    return [
      {
        id: "take_a_pause",
        type: "micro_action",
        title: "Iniciar pausa de respiración (1 min)",
        iconType: "wind",
      },
    ];
  }

  // 4. CRONOBIOLOGÍA NOCTURNA: Cenas después de las 19:30 o indicadas como noche
  const timeMatch = String(mealItem?.time || "").match(/(\d{1,2}):(\d{2})/);
  const parsedHour = timeMatch ? parseInt(timeMatch[1], 10) : new Date().getHours();
  const isNightMeal =
    parsedHour >= 19 ||
    parsedHour < 4 ||
    /cena|noche/i.test(`${mealItem?.mealType || ""} ${text}`);

  if (isNightMeal) {
    return [
      {
        id: "night-rest-prep",
        type: "exploration",
        title: "Preparar tu descanso de esta noche",
        iconType: "sparkles",
      },
      {
        id: "check-digestion",
        type: "micro_action",
        title: "¿Cómo sentís tu digestión?",
        iconType: "sparkles",
      },
    ];
  }

  // 5. MEDIA TARDE / SNACK: Estabilidad glucémica sin bajón de energía
  const isAfternoonOrSnack = /merienda|snack|colaci|caf[eé]|yogur/i.test(
    `${mealItem?.mealType || ""} ${text}`,
  );

  if (isAfternoonOrSnack) {
    return [
      {
        id: "smart-snack-idea",
        type: "exploration",
        title: "Sugerencia de colación inteligente",
        iconType: "apple",
      },
      {
        id: "evaluate-hydration",
        type: "micro_action",
        title: "Ver guía de hidratación",
        iconType: "droplet",
      },
    ];
  }

  // 6. CADENCIA DE MINIJUEGOS OPORTUNOS:
  // Solo se activa cuando hay una oportunidad pedagógica genuina (aprox. 1 de cada 3 comidas)
  const hashSeed = String(mealItem?.id || mealItem?.title || "0")
    .split("")
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);

  const isGameOpportuneMoment = hashSeed % 3 === 0;

  if (isGameOpportuneMoment) {
    const miniGame = getSampleMiniGameForMeal(mealItem);
    return [
      {
        id: "balance-next-meal",
        type: "exploration",
        title: "Ideas para balancear tu próxima comida",
        iconType: "apple",
      },
      {
        id: `mini-game-${miniGame.type}`,
        type: "mini_game",
        title: miniGame.title,
        iconType: "gamepad",
        gamePayload: miniGame,
      },
    ];
  }

  // 7. PLATOS TIER 3 (Completos, salmón, legumbres, ensaladas): Información celular sin juegos
  const isOptimalTier = /salmón|salmon|quinoa|pechuga|pollo|ensalada|huevo|avena|tofu|pescado|lenteja|garbanzo|integral|brócoli/i.test(
    text,
  );

  if (isOptimalTier) {
    return [
      {
        id: "plate-synergy",
        type: "exploration",
        title: "Ver sinergia de este plato",
        iconType: "sparkles",
      },
      {
        id: "evaluate-hydration",
        type: "micro_action",
        title: "Ver guía de hidratación",
        iconType: "droplet",
      },
    ];
  }

  // 8. COMIDAS SOCIALES O DE PLACER: Escala somática de saciedad / confort
  if (reason === "social" || reason === "placer") {
    return [
      {
        id: "check-satiety",
        type: "micro_action",
        title: "¿Cómo está tu saciedad hoy?",
        iconType: "sparkles",
      },
      {
        id: "check-eating-pace",
        type: "micro_action",
        title: "¿A qué ritmo comiste hoy?",
        iconType: "sparkles",
      },
    ];
  }

  // 9. DEFAULT PEDAGÓGICO: Enfoque de adición positiva en 1 toque
  return [
    {
      id: "balance-next-meal",
      type: "exploration",
      title: "Ideas para balancear tu próxima comida",
      iconType: "apple",
    },
    {
      id: "evaluate-hydration",
      type: "micro_action",
      title: "Ver guía de hidratación",
      iconType: "droplet",
    },
  ];
}
