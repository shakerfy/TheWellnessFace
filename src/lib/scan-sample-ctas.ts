import type { MealDynamicCta } from "./meal-coach-insights";

export interface ScanSamplePresetCtaConfig {
  ctas: MealDynamicCta[];
}

/**
 * Los 4 Arquetipos Canónicos Oficiales de The Wellness Face
 * (Definidos en la Sección IV de REGLAS_ANALISIS_NUTRICIONAL_Y_CTAS.md).
 * Cada arquetipo cuenta con su acción primaria obligatoria ('Ver insight')
 * y exactamente 2 CTAs secundarios interactivos con resolución 100% in-place.
 */
export const SCAN_SAMPLE_PRESET_CTAS: Record<string, ScanSamplePresetCtaConfig> = {
  // 1. Almuerzo de Rutina (Alta Densidad Biológica)
  "calai-chicken-quinoa": {
    ctas: [
      {
        id: "view-insight",
        type: "insight",
        title: "Ver insight",
        iconType: "sparkles",
        markdown:
          "Un plato con excelente densidad celular. La combinación de proteína completa y fibra de la quinoa y los vegetales permite que la energía se libere de forma sostenida a lo largo de toda la tarde, evitando pesadez digestiva o bajones de energía durante tu jornada.",
      },
      {
        id: "plate-synergy",
        type: "education",
        title: "Sinergia de nutrientes",
        iconType: "sparkles",
        markdown:
          "**Cómo interactúa este plato en tu cuerpo:**\nLa grasa saludable del aceite de oliva actúa como vehículo natural para absorber las vitaminas liposolubles (A y K) presentes en los vegetales verdes y la zanahoria, optimizando su asimilación celular.",
      },
      {
        id: "hydration-afternoon",
        type: "balance",
        title: "Hidratación para la tarde",
        iconType: "droplet",
        markdown:
          "**Energía sostenida sin bajón:**\nAcompañar tu tarde con agua fresca guiándote por la sed fisiológica mantendrá tu nivel de alerta mental y evitará la típica somnolencia que aparece por deshidratación tras el almuerzo.",
      },
    ],
  },

  // 2. Comida por Antojo o Salida (Disfrute Consciente y Anti-Culpa)
  "calai-burger": {
    ctas: [
      {
        id: "view-insight",
        type: "insight",
        title: "Ver insight",
        iconType: "sparkles",
        markdown:
          "Un momento de puro disfrute sensorial para saborear sin prisa. Al aportar energía rápida y mayor densidad de grasas, comer a un ritmo pausado ayudará a tu estómago a asimilarlo con mayor confort. Recordá que el bienestar digestivo y metabólico se construye en el balance de toda la semana, no en un solo plato.",
      },
      {
        id: "balance-my-day",
        type: "balance",
        title: "Balance para tus próximas comidas",
        iconType: "apple",
        markdown:
          "**Enfoque de adición positiva:**\nPara acompañar el equilibrio de tu día, una gran idea para tu próxima ingesta es sumar alimentos frescos con buena cantidad de agua y fibra (hojas verdes, fruta de estación o vegetales crudos), manteniendo una hidratación cómoda y tranquila.",
      },
      {
        id: "check-satiety",
        type: "education",
        title: "¿Cómo sentís tu saciedad?",
        iconType: "activity",
        markdown:
          "**Escuchar a tu cuerpo:**\nPrestá atención a cómo se siente tu estómago al comer. Si llegás a un punto de satisfacción cómoda, podés pausar y saborear el momento sin necesidad de terminar por inercia.",
      },
    ],
  },

  // 3. Momento de Sobrecarga o Estrés (Regulación Somática)
  "calai-pumpkin-soup": {
    ctas: [
      {
        id: "view-insight",
        type: "insight",
        title: "Ver insight",
        iconType: "sparkles",
        markdown:
          "Un plato elegido para brindar abrigo, pausa y descanso. La textura tibia y suave favorece el vaciamiento gástrico sin demandar un gran esfuerzo a tu sistema digestivo. Regaláte comer despacio, disfrutando el calor del plato como un momento para desconectar de la rutina.",
      },
      {
        id: "take_a_pause",
        type: "education",
        title: "Pausa de respiración (1 min)",
        iconType: "wind",
        markdown:
          "**Un minuto para calmar el ritmo:**\nInhalá suavemente por la nariz durante 4 segundos y exhalá lentamente por la boca durante 6 segundos. Repetir 5 o 6 ciclos ayuda a tu cuerpo a bajar las revoluciones y activa la señal de descanso que tu estómago necesita para digerir con ligereza.",
      },
      {
        id: "warm-comfort-digestion",
        type: "education",
        title: "Confort y digestión tibia",
        iconType: "sun",
        markdown:
          "**Beneficio somático del calor:**\nLos alimentos calientes y de textura suave relajan la musculatura lisa del tracto digestivo, reduciendo la tensión gástrica que suele provocar el estrés acumulado del día.",
      },
    ],
  },

  // 4. Cena Tardía y Descanso (Cronobiología y Sueño)
  "calai-spinach-omelette": {
    ctas: [
      {
        id: "view-insight",
        type: "insight",
        title: "Ver insight",
        iconType: "sparkles",
        markdown:
          "Excelente elección para cerrar la jornada. Al estar cerca de la hora de dormir, este plato aporta aminoácidos esenciales para la regeneración muscular nocturna con una digestión muy rápida y liviana, evitando la sensación de pesadez que suele interferir con el sueño profundo.",
      },
      {
        id: "night-rest-prep",
        type: "balance",
        title: "Preparar el descanso",
        iconType: "moon",
        markdown:
          "**Para un descanso profundo:**\nSi buscás potenciar la calidad de tu sueño, acompañar el final de la noche con una infusión tibia sin cafeína (como manzanilla o tilo) y atenuar las pantallas al menos 30 minutos antes de acostarte facilitará una conciliación más rápida y un descanso reparador.",
      },
      {
        id: "night-gastric-comfort",
        type: "education",
        title: "Confort gástrico nocturno",
        iconType: "shield",
        markdown:
          "**Digestión sin interrupciones:**\nAl combinar proteínas de fácil asimilación con vegetales cocidos y bajo contenido graso, tu estómago no necesitará horas extra de trabajo pesado, protegiendo las fases de sueño delta/reparador.",
      },
    ],
  },
};

/**
 * Retorna los CTAs exactos configurados para un plato de muestra del escáner.
 * Si el plato es personalizado, delega un set pedagógico estándar.
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

  // Fallback de CTAs para escaneos personalizados
  return [
    {
      id: "view-insight",
      type: "insight",
      title: "Ver insight",
      iconType: "sparkles",
    },
    {
      id: "balance-my-day",
      type: "balance",
      title: "Equilibrar mi día",
      iconType: "apple",
    },
    {
      id: "why-protein-matters",
      type: "education",
      title: "Por qué es importante la proteína",
      iconType: "shield",
    },
  ];
}
