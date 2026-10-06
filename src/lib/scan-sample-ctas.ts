import type { MealDynamicCta } from "./meal-coach-insights";
import type { MiniGamePayload } from "@/components/app/mini-games/mini-game-types";

export interface ScanSamplePresetCtaConfig {
  ctas: MealDynamicCta[];
  miniGame?: MiniGamePayload;
}

export const SCAN_SAMPLE_PRESET_CTAS: Record<string, ScanSamplePresetCtaConfig> = {
  // =========================================================================
  // GRUPO A: EJEMPLOS CON MINIJUEGO OPORTUNO (4 de 11)
  // Se justifica porque la interacción táctil educa un concepto o derriba un mito
  // =========================================================================

  // 1. Frambuesas Silvestres Frescas (Fitoquímicos invisibles que se revelan)
  "calai-raspberry": {
    miniGame: {
      type: "scratch_reveal",
      title: "Raspa y Descubre",
      teaser: "Las frambuesas guardan un fitoquímico protector invisible...",
      revealedTitle: "Antioxidantes Vegetales Activos",
      revealedText:
        "Tienen antioxidantes naturales que cuidan tus células por dentro y ayudan a mantenerte con energía limpia y renovada.",
      badge: "Nutrición Celular",
      foodSource: "Frambuesas Silvestres",
    },
    ctas: [
      {
        id: "smart-snack-idea",
        type: "exploration",
        title: "Sugerencia de combinación inteligente",
        iconType: "apple",
      },
      {
        id: "mini-game-scratch_reveal",
        type: "mini_game",
        title: "Raspa y Descubre",
        iconType: "gamepad",
        gamePayload: {
          type: "scratch_reveal",
          title: "Raspa y Descubre",
          teaser: "Las frambuesas guardan un fitoquímico protector invisible...",
          revealedTitle: "Antioxidantes Vegetales Activos",
          revealedText:
            "Tienen antioxidantes naturales que cuidan tus células por dentro y ayudan a mantenerte con energía limpia y renovada.",
          badge: "Nutrición Celular",
          foodSource: "Frambuesas Silvestres",
        },
      },
    ],
  },

  // 2. Bowl de Salmón & Quinoa (Aprender físicamente qué nutriente absorbe a cuál)
  "calai-salmon": {
    miniGame: {
      type: "tap_to_pair",
      title: "Emparejar Nutrientes",
      instruction:
        "Toca un nutriente y su par complementario para activar la absorción:",
      items: [
        {
          id: "omega3",
          label: "Omega-3 (Salmón)",
          category: "nutrient",
          pairId: "p1",
        },
        {
          id: "quinoa_fe",
          label: "Hierro vegetal (Quinoa)",
          category: "nutrient",
          pairId: "p2",
        },
        {
          id: "carotenes",
          label: "Carotenos (Vegetales)",
          category: "nutrient",
          pairId: "p3",
        },
        {
          id: "vitd",
          label: "Vitamina D natural",
          category: "function",
          pairId: "p1",
        },
        {
          id: "lemon_c",
          label: "Vitamina C (Toque de limón)",
          category: "function",
          pairId: "p2",
        },
        {
          id: "healthy_fats",
          label: "Grasas buenas (Asimilación)",
          category: "function",
          pairId: "p3",
        },
      ],
      explanation:
        "Las grasas buenas del salmón activan la vitamina D y los carotenos, mientras que el toque cítrico multiplica la absorción del hierro vegetal.",
    },
    ctas: [
      {
        id: "plate-synergy",
        type: "exploration",
        title: "Ver sinergia de este plato",
        iconType: "sparkles",
      },
      {
        id: "mini-game-tap_to_pair",
        type: "mini_game",
        title: "Emparejar Nutrientes",
        iconType: "gamepad",
        gamePayload: {
          type: "tap_to_pair",
          title: "Emparejar Nutrientes",
          instruction:
            "Toca un nutriente y su par complementario para activar la absorción:",
          items: [
            {
              id: "omega3",
              label: "Omega-3 (Salmón)",
              category: "nutrient",
              pairId: "p1",
            },
            {
              id: "quinoa_fe",
              label: "Hierro vegetal (Quinoa)",
              category: "nutrient",
              pairId: "p2",
            },
            {
              id: "carotenes",
              label: "Carotenos (Vegetales)",
              category: "nutrient",
              pairId: "p3",
            },
            {
              id: "vitd",
              label: "Vitamina D natural",
              category: "function",
              pairId: "p1",
            },
            {
              id: "lemon_c",
              label: "Vitamina C (Toque de limón)",
              category: "function",
              pairId: "p2",
            },
            {
              id: "healthy_fats",
              label: "Grasas buenas (Asimilación)",
              category: "function",
              pairId: "p3",
            },
          ],
          explanation:
            "Las grasas buenas del salmón activan la vitamina D y los carotenos, mientras que el toque cítrico multiplica la absorción del hierro vegetal.",
        },
      },
    ],
  },

  // 3. Pechuga Grillada con Vegetales (Aprender a armar la tríada post-entreno)
  "calai-chicken": {
    miniGame: {
      type: "slot_builder",
      title: "Constructor Post-Entreno",
      prompt:
        "Armá las 3 ranuras esenciales para optimizar la reconstrucción muscular de hoy:",
      slots: [
        { id: "s1", targetCategory: "protein", label: "Proteína" },
        { id: "s2", targetCategory: "carbs", label: "Glucógeno" },
        { id: "s3", targetCategory: "hydration", label: "Hidratación" },
      ],
      pool: [
        { id: "p1", label: "Pechuga grillada", category: "protein" },
        { id: "p2", label: "Batata asada", category: "carbs" },
        { id: "p3", label: "Agua fresca", category: "hydration" },
        { id: "p4", label: "Golosinas", category: "empty" },
        { id: "p5", label: "Bebida energizante", category: "stimulant" },
      ],
      comboName: "Trilogía de Recuperación",
      explanation:
        "Combinar proteína magra con carbohidratos naturales y buena hidratación repone tu energía muscular de forma liviana.",
    },
    ctas: [
      {
        id: "evaluate-hydration",
        type: "micro_action",
        title: "Ver guía de hidratación Armstrong",
        iconType: "droplet",
      },
      {
        id: "mini-game-slot_builder",
        type: "mini_game",
        title: "Constructor Post-Entreno",
        iconType: "gamepad",
        gamePayload: {
          type: "slot_builder",
          title: "Constructor Post-Entreno",
          prompt:
            "Armá las 3 ranuras esenciales para optimizar la reconstrucción muscular de hoy:",
          slots: [
            { id: "s1", targetCategory: "protein", label: "Proteína" },
            { id: "s2", targetCategory: "carbs", label: "Glucógeno" },
            { id: "s3", targetCategory: "hydration", label: "Hidratación" },
          ],
          pool: [
            { id: "p1", label: "Pechuga grillada", category: "protein" },
            { id: "p2", label: "Batata asada", category: "carbs" },
            { id: "p3", label: "Agua fresca", category: "hydration" },
            { id: "p4", label: "Golosinas", category: "empty" },
            { id: "p5", label: "Bebida energizante", category: "stimulant" },
          ],
          comboName: "Trilogía de Recuperación",
          explanation:
            "Combinar proteína magra con carbohidratos naturales y buena hidratación repone tu energía muscular de forma liviana.",
        },
      },
    ],
  },

  // 4. Hamburguesa Clásica Artesanal (Desmitificar físicamente la culpa de fin de semana)
  "calai-burger": {
    miniGame: {
      type: "swipe_card",
      title: "Mito Flash del Balance",
      statement:
        "¿Disfrutar de una hamburguesa el fin de semana arruina los hábitos saludables de tu semana?",
      isTruth: false,
      explanation:
        "¡Mito total! El cuerpo aprovecha los nutrientes en el balance acumulado de toda la semana. Disfrutá tu comida con calma y sin culpa.",
      takeaway:
        "Comé sin prisa, masticá despacio y disfrutá de la buena compañía.",
    },
    ctas: [
      {
        id: "check-eating-pace",
        type: "micro_action",
        title: "¿A qué ritmo comiste hoy?",
        iconType: "sparkles",
      },
      {
        id: "mini-game-swipe_card",
        type: "mini_game",
        title: "Mito Flash del Balance",
        iconType: "gamepad",
        gamePayload: {
          type: "swipe_card",
          title: "Mito Flash del Balance",
          statement:
            "¿Disfrutar de una hamburguesa el fin de semana arruina los hábitos saludables de tu semana?",
          isTruth: false,
          explanation:
            "¡Mito total! El cuerpo aprovecha los nutrientes en el balance acumulado de toda la semana. Disfrutá tu comida con calma y sin culpa.",
          takeaway:
            "Comé sin prisa, masticá despacio y disfrutá de la buena compañía.",
        },
      },
    ],
  },

  // =========================================================================
  // GRUPO B: EJEMPLOS CON SOLO INFORMACIÓN EDUCATIVA Y CIENCIA CELULAR (3 de 11)
  // Cero juegos: Refuerzo positivo del plato con lectura rápida y relevante
  // =========================================================================

  // 5. Chicken Phở Tradicional
  "calai-pho": {
    ctas: [
      {
        id: "plate-synergy",
        type: "exploration",
        title: "Ver bondades del caldo herbal",
        iconType: "sparkles",
      },
      {
        id: "take_a_pause",
        type: "micro_action",
        title: "Iniciar pausa de respiración (1 min)",
        iconType: "wind",
      },
    ],
  },

  // 6. Matcha Latte con Avena
  "calai-matcha": {
    ctas: [
      {
        id: "plate-synergy",
        type: "exploration",
        title: "Enfoque sereno con L-teanina",
        iconType: "sparkles",
      },
      {
        id: "smart-snack-idea",
        type: "exploration",
        title: "Sugerencia para tu jornada",
        iconType: "apple",
      },
    ],
  },

  // 7. Yogur Griego con Berries
  "calai-greek-yogurt": {
    ctas: [
      {
        id: "microbiota-function",
        type: "exploration",
        title: "Cuidado de tu flora intestinal",
        iconType: "sparkles",
      },
      {
        id: "add-accompaniment",
        type: "exploration",
        title: "Toca para sumar a este plato",
        iconType: "plus",
      },
    ],
  },

  // =========================================================================
  // GRUPO C: EJEMPLOS CON SUGERENCIAS SOMÁTICAS, HÁBITOS Y ADICIÓN (4 de 11)
  // Cero juegos: Hábitos reales de saciedad, hidratación y balance
  // =========================================================================

  // 8. Pancakes de Avena & Banana
  "calai-pancakes": {
    ctas: [
      {
        id: "balance-next-meal",
        type: "exploration",
        title: "Ideas para balancear tu próxima comida",
        iconType: "apple",
      },
      {
        id: "check-satiety",
        type: "micro_action",
        title: "¿Cómo está tu saciedad?",
        iconType: "sparkles",
      },
    ],
  },

  // 9. Mix Energético de Frutos Secos
  "calai-snack-mix": {
    ctas: [
      {
        id: "check-satiety",
        type: "micro_action",
        title: "Escala de saciedad (1 toque)",
        iconType: "sparkles",
      },
      {
        id: "evaluate-hydration",
        type: "micro_action",
        title: "Ver guía de hidratación Armstrong",
        iconType: "droplet",
      },
    ],
  },

  // 10. Smoothie Verde Detox
  "calai-smoothie": {
    ctas: [
      {
        id: "check-digestion",
        type: "micro_action",
        title: "¿Cómo sentís tu digestión hoy?",
        iconType: "sparkles",
      },
      {
        id: "anti-drowsiness-strategy",
        type: "exploration",
        title: "Estrategia de energía sostenida",
        iconType: "sparkles",
      },
    ],
  },

  // 11. Mousse de Cacao Amargo
  "calai-mousse": {
    ctas: [
      {
        id: "night-rest-prep",
        type: "exploration",
        title: "Preparar tu descanso nocturno",
        iconType: "sparkles",
      },
      {
        id: "check-digestion",
        type: "micro_action",
        title: "Confort digestivo",
        iconType: "sparkles",
      },
    ],
  },
};

/**
 * Retorna los CTAs exactos configurados para un plato de muestra del escáner.
 * Si el plato es personalizado, delega al motor pedagógico.
 */
export function getScanSampleCtas(
  sampleIdOrMeal: string | { id?: string; title?: string },
): MealDynamicCta[] {
  const id =
    typeof sampleIdOrMeal === "string" ? sampleIdOrMeal : sampleIdOrMeal?.id || "";

  const config = SCAN_SAMPLE_PRESET_CTAS[id];
  if (config) {
    return config.ctas;
  }

  // Fallback pedagógico para escaneos personalizados
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
