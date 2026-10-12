import { resolvePedagogicalCtas } from "./pedagogical-decision-engine";

// Helpers de Calidad Nutricional y Sinergia Somática para el Timeline
export function getMealQualityProfile(mealItem: any): {
  label: "Óptima" | "Equilibrada" | "Simple";
  tier: 1 | 2 | 3;
} {
  const score =
    mealItem?.bioScore ?? (mealItem?.healthScore ? mealItem.healthScore * 10 : 70);
  const text = `${mealItem?.title || ""} ${mealItem?.narrative || mealItem?.desc || ""}`.toLowerCase();

  // 1. Simple: golosinas, dulces, cereales refinados, frituras, ultraprocesados
  if (
    score < 55 ||
    /caramelo|golosina|sour patch|papas fritas|snack|gaseosa|refresco|chucher|donuts|facturas|cheeseburger|dulce/i.test(
      text,
    )
  ) {
    return { label: "Simple", tier: 1 };
  }

  // 3. Óptima: alimentos densos en micronutrientes, salmón, huevos, quinoa, ensaladas, legumbres
  if (
    score >= 75 ||
    /salmón|salmon|quinoa|pechuga|pollo|ensalada|huevo|avena|tofu|pescado|lenteja|garbanzo|integral|brócoli/i.test(
      text,
    )
  ) {
    return { label: "Óptima", tier: 3 };
  }

  // 2. Equilibrada: alimentos mixtos y preparaciones intermedias
  return { label: "Equilibrada", tier: 2 };
}

export function getMealCombinationTip(mealItem: any, tier: 1 | 2 | 3): string {
  if (
    mealItem?.coachFeedback &&
    !mealItem.coachFeedback.startsWith("Detectamos una clase")
  ) {
    return mealItem.coachFeedback;
  }
  const text = `${mealItem?.title || ""} ${mealItem?.narrative || mealItem?.desc || ""}`.toLowerCase();

  if (tier === 1) {
    if (/cereal|galleta|pan blanco|factura|medialuna|dulce|pancake/i.test(text)) {
      return "Sumar yogur natural, semillas o un huevo aporta proteína y fibra, reduciendo la velocidad de absorción y prolongando la saciedad.";
    }
    if (/frita|hamburguesa|burger|pizza/i.test(text)) {
      return "Acompañar con vegetales o una ensalada verde aporta fibra dietaria y facilita una digestión más liviana.";
    }
    return "Sumar una porción de proteína magra o vegetales ayuda a balancear el plato y mantener la saciedad por más tiempo.";
  }

  if (tier === 2) {
    if (/pasta|arroz|fideo/i.test(text)) {
      return "Sumar vegetales o un toque de aceite de oliva virgen extra ayuda a balancear el plato y prolongar la energía.";
    }
    if (/queso|sándwich|sandwich/i.test(text)) {
      return "Acompañar con rodajas de tomate o vegetales frescos añade vitaminas y minerales esenciales.";
    }
    return "Una adecuada hidratación después de esta comida favorece una digestión óptima.";
  }

  return "Comida completa y balanceada. Mantener una hidratación regular complementará adecuadamente tus requerimientos diarios.";
}

export interface MealDynamicCta {
  id: string;
  type?: "insight" | "balance" | "education" | "exploration" | "context";
  title: string;
  iconType:
    | "sparkles"
    | "apple"
    | "droplet"
    | "wind"
    | "pause"
    | "moon"
    | "sun"
    | "activity"
    | "shield"
    | "plus";
  markdown?: string;
  isOneTap?: boolean;
}

export function getMealDynamicCtas(mealItem: any): MealDynamicCta[] {
  return resolvePedagogicalCtas(mealItem);
}

export function getMealCoachInsightText(mealItem: any): string {
  const reason: "rutina" | "social" | "placer" | "confort" =
    mealItem?.eatingReason || "rutina";
  const title = mealItem?.title || "Comida";
  const continuityNote = mealItem?.appliedNextMealFocus
    ? ` ¡Excelente continuidad! Cumpliste tu intención previa de **${mealItem.appliedNextMealFocus}**.`
    : "";

  // Regla 6: Si el usuario eligió Social, Placer o Confort, el insight prioriza el contexto emocional/entorno
  if (reason === "social") {
    return `Compartir **${title}** en buena compañía ayuda a bajar el estrés y favorece la digestión. *Recordá que el bienestar se construye en el balance de toda la semana, no en un solo plato*; acompañar con agua fresca mantendrá tu confort digestivo.${continuityNote}`;
  }

  if (reason === "placer") {
    return `Un gusto para disfrutar con calma. Al aportar energía de absorción rápida, podés priorizar *fuentes de fibra y alimentos frescos* en tus próximas comidas para acompañar el equilibrio del día.${continuityNote}`;
  }

  if (reason === "confort") {
    return `Un plato elegido para brindar calma y abrigo. Comer sin prisa y regalarte *un minuto de respiración tranquila* al terminar ayudará a tu cuerpo a descansar y digerir con mayor ligereza.${continuityNote}`;
  }

  // Regla 9 y 10: Detección y Sincronización Pre/Post-Entreno y Reservas Somáticas
  const tag =
    mealItem?.timingFit?.tag ||
    (typeof mealItem?.contextBadge === "string" ? mealItem.contextBadge : mealItem?.contextBadge?.label) ||
    "";
  const isPreWorkout =
    mealItem?.isPreWorkout ||
    mealItem?.mealType === "Pre-entreno" ||
    /pre-entreno/i.test(tag) ||
    /pre-entreno/i.test(mealItem?.contextTag || "");
  const isPostWorkout =
    mealItem?.isPostWorkout ||
    mealItem?.mealType === "Post-entreno" ||
    /post-entreno/i.test(tag) ||
    /post-entreno/i.test(mealItem?.contextTag || "");
  const isEnergyRecharge =
    /recarga energ[eé]tica/i.test(tag) ||
    /recarga energ[eé]tica/i.test(mealItem?.contextTag || "");

  if (isPreWorkout) {
    return `Registrado en tu ventana previa al entrenamiento. **${title}** aporta combustible disponible para el movimiento; comer a un ritmo pausado y asegurar una hidratación ligera te permitirá iniciar tu sesión con confort digestivo y total soltura.${continuityNote}`;
  }

  if (isPostWorkout) {
    return `Registrado tras tu actividad física. Los nutrientes de **${title}** apoyan la síntesis proteica y la recarga de tus reservas de combustible muscular sin sobrecargar la digestión. Acompañar con agua fresca completará tu recuperación somática.${continuityNote}`;
  }

  if (isEnergyRecharge) {
    return `Tu cuerpo reporta una mayor demanda biológica de energía. **${title}** ayuda a restituir tus reservas somáticas; masticar despacio y comer hasta una saciedad cómoda sostendrá tu vitalidad.${continuityNote}`;
  }

  if (
    mealItem?.coachFeedback &&
    !mealItem.coachFeedback.startsWith("Detectamos una clase")
  ) {
    return `${mealItem.coachFeedback}${continuityNote}`;
  }

  const quality = getMealQualityProfile(mealItem);

  // Reglas 1, 2 y 4: Neutralidad médica + Adición (sumar antes que restar) + Mirada semanal
  if (quality.tier === 1) {
    return `Este registro de **${title}** aporta carbohidratos y energía de absorción rápida. Para que la energía se libere de forma más progresiva y aumente tu saciedad, una gran opción es acompañarlo con *una porción de fibra vegetal o proteína* (como vegetales frescos, huevo o unos frutos secos).${continuityNote}`;
  }

  if (quality.tier === 3 || (mealItem?.protein && mealItem.protein >= 20)) {
    return `Este registro de **${title}** combina proteínas y nutrientes que favorecen una *liberación de energía progresiva* y sostienen la saciedad durante tu rutina. Acompañar con agua fresca completará una digestión liviana.${continuityNote}`;
  }

  return `Para lograr un plato aún más completo en tu rutina con **${title}** y sostener tu saciedad por más tiempo, podés sumar una porción de *vegetales frescos (fibra) o semillas* en el plato o en tu siguiente comida.${continuityNote}`;
}

export function getMealCtaMarkdownContent(ctaId: string, mealItem: any): string {
  const title = mealItem?.title || "Comida";
  const text = `${title} ${mealItem?.narrative || mealItem?.desc || ""}`.toLowerCase();

  // CTA Primario: Ver Insight Somático Completo
  if (ctaId === "view-insight" || ctaId === "ver-insight") {
    return getMealCoachInsightText(mealItem);
  }

  // CTA Secundario 1: Equilibrar mi día (Continuidad Positiva / Visión 24h)
  if (ctaId === "balance-my-day" || ctaId === "balance-next-meal") {
    if (/hamburguesa vegetariana|veggie|tofu|soja|legumbre|vegetariano/i.test(text)) {
      return `Por ahora registraste **${title}**. Para equilibrar el resto del día, podés sumar una comida con lentejas o tofu, verduras de temporada y algún cereal como arroz o quinoa. Así incorporás más proteína y fibra sin dejar de lado los sabores vegetarianos que te gustan.`;
    }
    if (/cereal|galleta|pan blanco|factura|medialuna|dulce|sour patch|golosina/i.test(text)) {
      return `Por ahora registraste **${title}**, que aporta energía rápida. Para equilibrar el resto del día, priorizá una fuente de proteína limpia (como huevos, pollo o legumbres) y una porción generosa de vegetales frescos en tu siguiente comida para estabilizar tu saciedad.`;
    }
    if (/pasta|arroz|fideo|pizza/i.test(text)) {
      return `Por ahora registraste **${title}**. Para equilibrar el resto del día, tu siguiente comida puede priorizar hojas verdes frescas, grasas saludables (como palta o aceite de oliva extra virgen) y proteína magra para disfrutar de una digestión ligera.`;
    }
    if (/carne|pollo|salmón|pescado|bife|asado/i.test(text)) {
      return `Por ahora registraste **${title}**, con excelente aporte proteico. Para equilibrar el resto del día, podés sumar fibras variadas (vegetales crujientes o frutas de estación) y abundante agua fresca para acompañar una digestión liviana y despejada.`;
    }
    return `Opciones basadas en la **adición positiva** para tu siguiente comida tras **${title}**:

- **🥗 Sumar fibra vegetal fresca:** Hojas verdes, brócoli o tomate con oliva para aportar saciedad prolongada y suavizar la digestión.
- **🥚 Incorporar una fuente de proteína:** Huevo de campo, legumbres, pollo o tofu para sostener tu energía de forma pareja.
- **🥑 Grasas saludables de apoyo:** Palta o semillas que prolongan la sensación de plenitud sin generar pesadez.`;
  }

  // CTA Secundario 2: Por qué es importante la proteína
  if (ctaId === "why-protein-matters" || ctaId === "por-que-proteina") {
    return `La proteína ayuda a mantener y reparar los músculos, algo clave para sentirte más fuerte y progresar hacia tu objetivo de estar en forma.

- **Variedad vegetal:** Lentejas, garbanzos, porotos, tofu y semillas de chía o cáñamo.
- **Opciones prácticas:** Huevos de campo, yogur natural entero o quesos magros.
- **Combinación estratégica:** Como vegetariano o comensal variado, combinar legumbres con verduras y cereales (arroz o quinoa) hace más fácil y completo cubrir tus requerimientos diarios.`;
  }

  // CTA Secundario 2: Energía sostenida sin bajón
  if (ctaId === "sustained-energy" || ctaId === "anti-drowsiness-strategy") {
    return `Tres gestos simples para mantener la mente despejada y evitar el cansancio después de comer **${title}**:

- **🚶 Caminata suave de 5 a 10 minutos:** Mover las piernas después de comer ayuda a que tus músculos utilicen la energía del plato de forma gradual, evitando el pico de cansancio a media tarde.
- **🥗 El orden importa:** Empezar por las fibras vegetales o proteínas antes de los almidones hace que la digestión sea más progresiva y estable.
- **☀️ Luz natural y agua fresca:** Un vaso de agua fresca y unos minutos de luz natural reactivan el estado de alerta sin necesidad de sumar más cafeína.`;
  }

  // CTA Secundario 2: Preparar el descanso nocturno
  if (ctaId === "night-rest-prep" || ctaId === "digestion-descanso") {
    return `Pautas simples después de cenar **${title}** para dormir profundo y despertar con energía renovada:

- **⏳ Ventana de digestión (60 a 90 min):** Esperar al menos una hora antes de acostarte evita el reflujo y permite que tu ritmo cardíaco descienda durante la noche.
- **🍵 Infusión tibia:** Manzanilla, tilo o jengibre suave relajan el tracto digestivo y promueven una digestión confortable.
- **🌙 Luz cálida y baja:** Reducir el brillo de pantallas y luces ambientales ayuda a tu cerebro a liberar melatonina mientras terminás de digerir.`;
  }

  // CTA Secundario 2: Combustible y recuperación muscular
  if (ctaId === "workout-fuel" || ctaId === "explore_postworkout_fuel") {
    return `Nutrición en sincronía con tu entrenamiento para **${title}**:

- **⚡ Reposición de reservas:** Los nutrientes de este plato recargan el glucógeno muscular de forma progresiva sin saturar el sistema digestivo.
- **💪 Reparación somática:** Los aminoácidos disponibles apoyan la síntesis proteica y la recuperación muscular posterior al esfuerzo.
- **💧 Hidratación de apoyo:** Acompañar con agua fresca y sales minerales optimiza la entrega de nutrientes a las células.`;
  }

  // CTA Secundario 2: Sinergia de nutrientes en el plato
  if (ctaId === "plate-synergy" || ctaId === "nutrient-synergy") {
    return `Sinergia nutricional: cómo los ingredientes de **${title}** se potencian entre sí:

- **🍋 Vitamina C + Hierro vegetal:** Los cítricos, el tomate o el morrón fresco multiplican la absorción del hierro presente en legumbres, semillas o espinacas.
- **🫒 Grasas saludables + Vitaminas A, D, E y K:** El aceite de oliva virgen extra, la palta o las semillas permiten asimilar los antioxidantes y vitaminas liposolubles de los vegetales del plato.
- **🌱 Fibras prebióticas:** Alimentan las bacterias intestinales beneficiosas, favoreciendo la motilidad digestiva y la saciedad.`;
  }

  // CTA Secundario 2: Saciedad inteligente entre comidas
  if (ctaId === "smart-snack-idea") {
    return `Ideas de colaciones con alta densidad nutricional para llegar a la noche sin hambre acumulada:

- **🫐 Yogur natural con arándanos y semillas:** Combina proteínas de digestión suave y fibra soluble que sostiene la saciedad durante horas.
- **🥕 Bastones de vegetales crujientes con hummus:** Aporta fibra prebiótica y energía gradual sin generar pesadez ni letargo.
- **🥜 Puñado de almendras o nueces con una fruta fresca:** El aporte conjunto de fibra, agua y grasas saludables estabiliza el apetito antes de la cena.`;
  }

  // CTA Secundario: Hidratación Fisiológica
  if (ctaId === "evaluate-hydration" || ctaId === "check_hydration_armstrong") {
    return `Para asimilar bien **${title}** y sostener tu vitalidad, acompañá con agua fresca a lo largo del día.

- **💧 Indicador visual natural:** El color de la orina es tu mejor referencia fisiológica (tonos claros como limonada indican hidratación óptima; tonos oscuros sugieren sumar un vaso de agua).
- **🌿 Sin forzar cantidades:** Beber pequeños sorbos durante la jornada es mucho más efectivo para tus células que tomar grandes volúmenes de golpe.`;
  }

  // CTA Secundario: Pausa de respiración y calma
  if (ctaId === "take_a_pause") {
    return `Inhalá en **4 segundos**, exhalá en **6 segundos**. Un minuto de respiración tranquila al terminar de comer **${title}** activa tu sistema nervioso de descanso y favorece una digestión liviana y confortable.`;
  }

  if (ctaId === "check-satiety") {
    return `Escuchar tus señales de saciedad unos minutos después de terminar **${title}** te ayuda a reconectar con lo que tu cuerpo necesita hoy, reconociendo cuándo el estómago se siente cómodo sin llegar a la pesadez.`;
  }

  if (ctaId === "check-digestion") {
    return `Registrar cómo sentís tu digestión después de **${title}** te permite descubrir qué combinaciones y horarios te sientan con mayor ligereza y energía.`;
  }

  if (ctaId === "hydration-afternoon") {
    return `**Energía sostenida sin bajón:**\nAcompañar tu tarde con agua fresca guiándote por la sed fisiológica mantendrá tu nivel de alerta mental y evitará la típica somnolencia que aparece por deshidratación tras el almuerzo.`;
  }

  if (ctaId === "warm-comfort-digestion") {
    return `**Beneficio somático del calor:**\nLos alimentos calientes y de textura suave relajan la musculatura lisa del tracto digestivo, reduciendo la tensión gástrica que suele provocar el estrés acumulado del día.`;
  }

  if (ctaId === "night-gastric-comfort") {
    return `**Digestión sin interrupciones:**\nAl combinar proteínas de fácil asimilación con vegetales cocidos y bajo contenido graso, tu estómago no necesitará horas extra de trabajo pesado, protegiendo las fases de sueño delta/reparador.`;
  }

  return `Sugerencias de adición y bienestar para **${title}**:

- Sumar vegetales frescos o una porción de fibra aporta saciedad prolongada.
- Acompañar con agua fresca favorece una digestión confortable.`;
}
