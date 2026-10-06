import type { MiniGamePayload } from "@/components/app/mini-games/mini-game-types";
import { resolvePedagogicalCtas } from "./pedagogical-decision-engine";
import { calculateTimingFit } from "./timing-fit";

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
  type: "exploration" | "context" | "micro_action" | "mini_game";
  title: string;
  iconType: "sparkles" | "apple" | "plus" | "droplet" | "wind" | "pause" | "gamepad";
  isOneTap?: boolean;
  gamePayload?: MiniGamePayload;
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
  const timing = mealItem?.timingFit || calculateTimingFit(mealItem);
  const tag =
    timing?.tag ||
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

  if (ctaId === "evaluate-hydration" || ctaId === "check_hydration_armstrong") {
    return `Para asimilar bien **${title}** y sostener tu energía, acompañá con agua fresca. En tu próxima ida al baño, tené en cuenta esta referencia visual (**Escala Armstrong**):`;
  }

  if (ctaId === "take_a_pause") {
    return `Inhalá en **4 segundos**, exhalá en **6 segundos**. Un minuto de calma aquí mismo para bajar el ritmo y digerir **${title}** con mayor ligereza:`;
  }

  if (ctaId === "anti-drowsiness-strategy") {
    return `Tres gestos simples para mantener la mente despejada y evitar el sueño después de comer **${title}**:

- **🚶 Caminata suave de 5 a 10 minutos:** Mover las piernas después de comer ayuda a que tus músculos utilicen la energía del plato de forma gradual, evitando el pico de cansancio a media tarde.
- **🥗 El orden importa:** Empezar por las fibras vegetales o proteínas antes de los almidones hace que la digestión sea más progresiva y estable.
- **☀️ Luz natural y agua fresca:** Un vaso de agua fresca y unos minutos de luz natural reactivan el estado de alerta sin necesidad de sumar más cafeína.`;
  }

  if (ctaId === "night-rest-prep") {
    return `Pautas simples después de cenar **${title}** para dormir profundo y despertar con energía:

- **⏳ Ventana de digestión (60 a 90 min):** Esperar al menos una hora antes de acostarte del todo evita el reflujo y permite que tu ritmo cardíaco baje durante la noche.
- **🍵 Infusión tibia o agua a temperatura ambiente:** Manzanilla, tilo o jengibre suave relajan el tracto digestivo sin interrumpir el sueño.
- **🌙 Luz cálida y baja:** Reducir el brillo de las pantallas ayuda a tu cerebro a liberar melatonina mientras terminás de digerir.`;
  }

  if (ctaId === "check-eating-pace") {
    return `La velocidad y el entorno en que comemos **${title}** cambian por completo cómo se absorben los nutrientes y cómo se siente tu abdomen:`;
  }

  if (ctaId === "balance-next-meal") {
    return `Opciones basadas en la **adición** para tu siguiente comida. Tocá una intención abajo para que el escáner te la recuerde en tu próximo registro:

- **🥗 Sumar fibra vegetal fresca:** Hojas verdes, brócoli o tomate con aceite de oliva para aportar saciedad prolongada y suavizar la digestión.
- **🥚 Incorporar una fuente de proteína:** Huevo de campo, pollo, legumbres o tofu para sostener tu energía de forma pareja.
- **🥑 Grasas saludables de apoyo:** Media palta o un puñado de semillas/nueces que prolongan la sensación de plenitud sin pesadez.`;
  }

  if (ctaId === "smart-snack-idea") {
    return `Ideas de colaciones con alta densidad nutricional para llegar a la noche sin hambre acumulada:

- **🫐 Yogur natural con arándanos y semillas de chía:** Combina proteínas de digestión suave y fibra soluble que mantiene la saciedad por horas.
- **🥕 Bastones de vegetales crujientes con hummus:** Aporta fibra prebiótica y energía gradual sin generar pesadez.
- **🥜 Puñado de almendras o nueces con una fruta fresca:** El aporte conjunto de fibra, agua y grasas saludables estabiliza el apetito antes de la cena.`;
  }

  if (ctaId === "thirst-or-fatigue") {
    return `¿Por qué a veces sentimos cansancio o antojos repentinos a mitad del día?

- **💧 La señal cruzada:** Una deshidratación leve (incluso del 1% al 2%) reduce la oxigenación y suele percibirse como falta de concentración, pesadez mental o ganas de comer algo rápido.
- **✨ Qué hacer ahora:** Tomá un vaso de agua fresca sin prisa y esperá 10 minutos; notarás cómo recupera claridad tu foco mental.`;
  }

  if (ctaId === "microbiota-function") {
    return `Cómo los ingredientes de **${title}** alimentan tu ecosistema digestivo:

- **🌱 Fibras prebióticas y polifenoles:** Las fibras vegetales y los pigmentos naturales de los alimentos frescos sirven de alimento directo para tus bacterias intestinales beneficiosas.
- **🧠 Conexión intestino-ánimo:** Al fermentar estas fibras, tu microbiota produce compuestos que desinflaman el intestino y envían señales de calma y saciedad a tu cerebro.`;
  }

  if (ctaId === "plate-synergy") {
    return `Sinergia nutricional: cómo los ingredientes de **${title}** se potencian entre sí:

- **🍋 Vitamina C + Hierro vegetal:** Los cítricos, el tomate o el morrón fresco multiplican la absorción del hierro presente en legumbres, carnes o espinacas.
- **🫒 Grasas saludables + Vitaminas A, D, E y K:** El aceite de oliva virgen extra, la palta o las semillas permiten absorber los antioxidantes y vitaminas liposolubles de los vegetales del plato.`;
  }

  if (ctaId === "check-satiety") {
    return `Escuchar tus señales de saciedad (leptina) unos minutos después de terminar **${title}** te ayuda a reconectar con lo que tu cuerpo necesita hoy:`;
  }

  if (ctaId === "check-digestion") {
    return `Registrar cómo sentís tu digestión después de **${title}** te permite descubrir qué combinaciones y horarios te sientan más livianos:`;
  }

  if (ctaId === "explore_postworkout_fuel") {
    return `Opciones prácticas para acompañar tu recuperación después de moverte:

- **🍠 Batata asada con pollo o tofu:** Energía progresiva y proteína para reponer fuerzas sin pesadez.
- **🥑 Tostón de masa madre con huevo y palta:** Grasas saludables y proteínas de digestión amigable.
- **🥣 Yogur natural con avena y frutos rojos:** Fresco, fácil de asimilar y con buen aporte de fibra.`;
  }

  if (ctaId === "balanced-meal-ideas") {
    return `Combinaciones simples para sumar variedad y saciedad a tu semana:

- **🥑 Bowl de quinoa, salmón o garbanzos y palta:** Aporta fibra vegetal, proteínas completas y grasas saludables para sostener tu energía toda la tarde.
- **🍠 Pechuga o tofu a las hierbas con vegetales al vapor:** Una opción cálida y saciante que favorece una digestión liviana.
- **🥗 Ensalada completa con huevo de campo y semillas:** Suma variedad de plantas, fibra y micronutrientes en pocos minutos.`;
  }

  if (ctaId === "explore-real-food") {
    return `Opciones prácticas para sumar en este plato o en tu próxima comida (Enfoque de Adición):

- **🥗 Sumar una fuente de fibra:** Una guarnición de hojas verdes, tomate o una fruta entera ayuda a que la energía se absorba de forma más progresiva.
- **🥚 Acompañar con proteína:** Sumar huevo, pollo, legumbres o yogur natural prolonga la saciedad durante más horas.
- **🥜 Incorporar grasas saludables:** Un toque de palta, semillas o frutos secos aporta saciedad y suaviza la digestión.`;
  }

  if (ctaId === "add-accompaniment") {
    return `Si acompañaste **${title}** con una bebida, ensalada o complemento, podés sumarlo en un toque:`;
  }

  return `Sugerencias de adición y bienestar para **${title}**:`;
}
