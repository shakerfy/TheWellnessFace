import { MiniGamePayload } from "@/components/app/mini-games/mini-game-types";

export const SAMPLE_MINI_GAMES: Record<string, MiniGamePayload> = {
  // 1. El Emparejador (Sinergias de absorción)
  tap_to_pair: {
    type: "tap_to_pair",
    title: "Emparejar Nutrientes",
    instruction: "Toca un alimento o nutriente y luego su combinación complementaria:",
    items: [
      { id: "iron", label: "Hierro vegetal (Lentejas)", category: "nutrient", pairId: "p1" },
      { id: "omega3", label: "Grasas buenas (Palta)", category: "nutrient", pairId: "p2" },
      { id: "turmeric", label: "Cúrcuma dorada", category: "nutrient", pairId: "p3" },
      { id: "vitc", label: "Vitamina C (Limón)", category: "function", pairId: "p1" },
      { id: "carotenes", label: "Carotenos (Zanahoria)", category: "function", pairId: "p2" },
      { id: "pepper", label: "Pimienta negra (Piperina)", category: "function", pairId: "p3" },
    ],
    explanation: "La vitamina C multiplica la absorción del hierro vegetal, las grasas saludables activan los carotenos y la pimienta potencia los antioxidantes de la cúrcuma.",
  },

  // 2. El Raspa y Descubre
  scratch_reveal: {
    type: "scratch_reveal",
    title: "Raspa y Descubre",
    teaser: "Tu plato esconde un beneficio celular...",
    revealedTitle: "Antioxidantes Vegetales Activos",
    revealedText: "Los vegetales verdes liberan compuestos protectores al masticar, cuidando tus células y manteniendo tu vitalidad diaria.",
    badge: "Nutrición Celular",
    foodSource: "Vegetales Verdes",
  },

  // 3. El Intruso
  odd_one_out: {
    type: "odd_one_out",
    title: "El Intruso del Plato",
    prompt: "Tres de estos nutrientes alimentan y cuidan tu microbiota en este plato. ¿Cuál es el infiltrado?",
    options: [
      { id: "inulin", label: "Inulina prebiótica", isOut: false, explanation: "Fibra natural excelente para tus bacterias beneficiosas." },
      { id: "polyphenol", label: "Polifenoles antioxidantes", isOut: false, explanation: "Estimulan la diversidad y el equilibrio intestinal." },
      { id: "corn_syrup", label: "Jarabe de maíz industrial", isOut: true, explanation: "¡Exacto! El jarabe de maíz no aporta fibra ni nutrientes y tu plato está libre de él." },
      { id: "resistant_starch", label: "Almidón resistente", isOut: false, explanation: "Favorece un ambiente saludable y protegido en tu intestino." },
    ],
    successMessage: "Tu plato contiene alimentos enteros que cuidan el bienestar de tu digestión.",
  },

  // 4. El Dial Háptico
  haptic_slider: {
    type: "haptic_slider",
    title: "Termostato Somático",
    prompt: "Ajusta tu dial: ¿Cómo estimas que responderá tu nivel de energía en las próximas 2 horas?",
    minLabel: "Digestión Lenta",
    maxLabel: "Energía Sostenida",
    defaultValue: 65,
    feedbacks: [
      {
        range: [0, 35],
        label: "Digestión Pausada",
        text: "Una comida reconfortante. Regalate unos minutos de caminata suave o pausa para facilitar el vaciado gástrico.",
      },
      {
        range: [36, 75],
        label: "Energía Estable",
        text: "¡En el punto justo! La fibra modula la absorción, permitiendo una tarde con lucidez y energía pareja.",
      },
      {
        range: [76, 100],
        label: "Recarga Activa",
        text: "Ideal si tenés entrenamiento programado en breve o venís de una actividad física intensa.",
      },
    ],
  },

  // 5. El Swipe Rápido A/B
  swipe_card: {
    type: "swipe_card",
    title: "Mito Flash del Plato",
    statement: "¿Comer fruta de postre después de almorzar dificulta la digestión o altera sus nutrientes?",
    isTruth: false,
    explanation: "¡Mito total! El estómago gestiona los alimentos de manera eficiente sin importar el orden. La fruta fresca aporta agua y vitaminas que favorecen una digestión cómoda y natural.",
    takeaway: "Disfrutá tu fruta fresca con total tranquilidad.",
  },

  // 6. El Constructor de Ranuras
  slot_builder: {
    type: "slot_builder",
    title: "Constructor Post-Entreno",
    prompt: "Completa las 3 ranuras esenciales para optimizar tu recuperación de hoy:",
    slots: [
      { id: "s1", targetCategory: "protein", label: "Proteína" },
      { id: "s2", targetCategory: "carbs", label: "Glucógeno" },
      { id: "s3", targetCategory: "hydration", label: "Hidratación" },
    ],
    pool: [
      { id: "p1", label: "Pollo / Tofu", category: "protein" },
      { id: "p2", label: "Arroz / Batata", category: "carbs" },
      { id: "p3", label: "Agua fresca", category: "hydration" },
      { id: "p4", label: "Golosinas", category: "empty" },
      { id: "p5", label: "Frituras", category: "heavy" },
    ],
    comboName: "Trilogía de Recuperación",
    explanation: "Combinar proteína con carbohidratos naturales y buena hidratación repone tus reservas musculares sin pesadez.",
  },

  // 7. La Ruleta del Chef
  synergy_spin: {
    type: "synergy_spin",
    title: "La Ruleta del Chef",
    prompt: "Gira para descubrir un toque simple de alacena para este plato:",
    twists: [
      { id: "t1", name: "Gotas de lima + sésamo tostado", desc: "El sésamo aporta calcio vegetal y la acidez de la lima resalta las texturas frescas.", benefit: "Aporte natural de calcio y minerales" },
      { id: "t2", name: "Aceite de oliva virgen + orégano", desc: "Los aromas del orégano y las grasas buenas protegen la frescura del plato.", benefit: "Protege las grasas saludables" },
      { id: "t3", name: "Puñado de semillas de zapallo", desc: "Un toque crocante que suma magnesio y acompaña el descanso muscular.", benefit: "Relajación y bienestar muscular" },
      { id: "t4", name: "Pizca de pimentón ahumado", desc: "Suma profundidad aromática y activa suavemente la calidez digestiva.", benefit: "Activa suavemente la digestión" },
    ],
  },

  // 8. El Micro-Ritmo de Masticación
  pace_timer: {
    type: "pace_timer",
    title: "Ritmo del Primer Bocado",
    instruction: "Iniciá el círculo para sincronizar el ritmo de masticación antes de tragar:",
    durationSeconds: 15,
    phaseGuide: "Respirá, percibí el aroma y masticá despacio",
    completionInsight: "La masticación consciente despierta a tu estómago y le avisa que el alimento viene en camino, facilitando una digestión liviana y placentera.",
  },

  // 9. El Imán de Palabras
  tile_snap: {
    type: "tile_snap",
    title: "El Imán Somático",
    sentenceBefore: "Al empezar el plato por los vegetales verdes, la fibra soluble actúa como",
    sentenceAfter: "amortiguando la absorción gradual y manteniendo tu energía pareja.",
    correctTile: { id: "shield", label: "un escudo protector" },
    distractorTile: { id: "turbo", label: "una turbina veloz" },
    explanation: "La fibra forma una malla suave en el intestino que dosifica la asimilación de energía, evitando picos y caídas bruscas.",
  },

  // 10. La Balanza de Decisión
  balancing_scale: {
    type: "balancing_scale",
    title: "La Balanza de Prioridad",
    question: "¿Hacia dónde querés orientar el combustible de esta comida?",
    sideA: {
      id: "left",
      label: "Enfoque y Energía",
      highlightedIngredients: ["Arroz / Carbohidratos complejos", "Proteína magra"],
      explanation: "Los carbohidratos naturales aportan glucosa cerebral sostenida y la proteína brinda saciedad duradera.",
    },
    sideB: {
      id: "right",
      label: "Digestión Ligera",
      highlightedIngredients: ["Hojas verdes", "Palta / Grasas saludables"],
      explanation: "La abundancia de fibra suave y agua vegetal garantizan una tarde despejada y sin sensación de pesadez.",
    },
  },
};

/**
 * Deterministically picks a mini-game payload based on meal ID / title
 * so the 10 games rotate consistently across timeline items.
 */
export function getSampleMiniGameForMeal(mealItem: any): MiniGamePayload {
  const keys = Object.keys(SAMPLE_MINI_GAMES);
  const hash = String(mealItem?.id || mealItem?.title || "0")
    .split("")
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);

  const selectedKey = keys[hash % keys.length];
  return SAMPLE_MINI_GAMES[selectedKey];
}
