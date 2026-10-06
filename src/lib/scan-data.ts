import {
  Coffee, Utensils, Apple, Cake, HeartPulse, Clock, Users,
  Sparkles, Wind, Timer, Zap, Moon, Activity, Flame
} from "lucide-react";
import type { MealDynamicCta } from "./meal-coach-insights";

export interface MealCalloutPin {
  name: string;
  calories: number;
  topPct: number;
  leftPct?: number;
  rightPct?: number;
}

export interface MealIngredientItem {
  id: string;
  name: string;
  category: "protein" | "carbs" | "fats" | "veggies" | "fruits" | "dairy";
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  calPer100g: number;
  pPer100g: number;
  cPer100g: number;
  fPer100g: number;
  fiberPer100g: number;
}

export interface NutritionVectorBadge {
  id: string;
  category: "processing" | "fiber" | "protein" | "sugar" | "fat" | "grains" | "carbs" | "sodium";
  badgeText: string;
  description: string;
}

export const NUTRIENT_VECTOR_SPECS = [
  { category: "processing", label: "Procesamiento" },
  { category: "protein", label: "Proteína" },
  { category: "carbs", label: "Carbohidratos" },
  { category: "fiber", label: "Fibra" },
  { category: "sugar", label: "Azúcares añadidos" },
  { category: "fat", label: "Grasas" },
  { category: "sodium", label: "Sodio" },
] as const;

const EN_TO_ES_NUTRIENTS: Record<string, string> = {
  "minimally processed": "Mínimamente procesado",
  "ultra-processed": "Ultraprocesado",
  "ultraprocessed": "Ultraprocesado",
  "moderately processed": "Moderadamente procesado",
  "unprocessed": "Sin procesar",
  "good source": "Buena fuente",
  "high fiber": "Alto en fibra",
  "source of fiber": "Fuente de fibra",
  "lean and complete": "Magra y completa",
  "magra y completa": "Magra y completa",
  "high protein": "Alto en proteína",
  "plant source": "Fuente vegetal",
  "fuente vegetal": "Fuente vegetal",
  "lean": "Magra y completa",
  "lean / high": "Magra y completa",
  "plant / light": "Fuente vegetal",
  "high quality": "Alto en proteína",
  "zero": "Sin azúcar añadido",
  "low": "Bajo",
  "moderate": "Moderadas",
  "healthy fats": "Grasas saludables",
  "healthy fats (omega-3)": "Saludables (Omega-3)",
  "saludables (omega-3)": "Saludables (Omega-3)",
  "healthy fats (avocado)": "Saludables (Palta)",
  "healthy fats (chia)": "Saludables (Chía)",
  "high fat": "Alto en grasas",
  "alto en grasas": "Alto en grasas",
  "complex": "Complejos",
  "complejos": "Complejos",
  "fast absorption": "Absorción rápida",
  "absorción rápida": "Absorción rápida",
  "refined": "Absorción rápida",
  "whole grains": "Complejos",
  "grain-free": "Sin granos",
  "high sodium": "Alto en sodio",
  "alto en sodio": "Alto en sodio",
  "elevated": "Alto en sodio",
  "very low": "Muy bajo",
};

export function getMealNutrientRows(
  badges: NutritionVectorBadge[] = [],
  ingredients: MealIngredientItem[] = [],
  servings: number = 1,
): { category: string; label: string; value: string; iconType: "check" | "minus" }[] {
  const badgeMap = new Map<string, string>();
  badges.forEach((b) => badgeMap.set(b.category, b.badgeText));

  const totalFiber = ingredients.reduce((sum, i) => sum + (i.fiber || 0), 0) * servings;
  const totalProtein = ingredients.reduce((sum, i) => sum + (i.protein || 0), 0) * servings;
  const totalFat = ingredients.reduce((sum, i) => sum + (i.fat || 0), 0) * servings;
  const totalCarbs = ingredients.reduce((sum, i) => sum + (i.carbs || 0), 0) * servings;

  return NUTRIENT_VECTOR_SPECS.map(({ category, label }) => {
    let rawValue = badgeMap.get(category);
    let iconType: "check" | "minus" = "check";

    if (!rawValue) {
      if (category === "processing") rawValue = "Mínimamente procesado";
      else if (category === "fiber") rawValue = totalFiber >= 5 ? "Alto en fibra" : totalFiber >= 2 ? "Buena fuente" : "";
      else if (category === "protein") rawValue = totalProtein >= 25 ? "Alto en proteína" : totalProtein >= 18 ? "Magra y completa" : totalProtein >= 10 ? "Buena fuente" : "";
      else if (category === "sugar") rawValue = "Sin azúcar añadido";
      else if (category === "fat") rawValue = totalFat >= 15 ? "Alto en grasas" : totalFat >= 5 ? "Grasas saludables" : "";
      else if (category === "carbs") rawValue = totalCarbs >= 25 ? "Complejos" : totalCarbs >= 10 ? "Absorción rápida" : "";
      else if (category === "sodium") rawValue = "";
    }

    const valKey = (rawValue || "").trim().toLowerCase();
    const translatedValue = EN_TO_ES_NUTRIENTS[valKey] || rawValue || "Moderado";

    const valLower = translatedValue.toLowerCase();
    if (category === "fat" && (valLower.includes("modera") || valLower.includes("elevad"))) {
      iconType = "minus";
    }

    return {
      category,
      label,
      value: translatedValue,
      iconType,
    };
  });
}

export interface OrderedNutritionRow {
  category: "processing" | "fiber" | "protein" | "sugar" | "fat" | "carbs" | "sodium" | string;
  label: string;
  value: string;
  isSubItem?: boolean;
}

export function getOrderedNutritionReportRows(
  badges: NutritionVectorBadge[] = [],
  ingredients: MealIngredientItem[] = [],
  servings: number = 1,
  sampleId?: string,
  explicitMacros?: { protein?: number; fiber?: number; fat?: number; carbs?: number },
): OrderedNutritionRow[] {
  // Caso de muestra calibrada 'calai-pho'
  if (sampleId === "calai-pho") {
    return [
      { category: "processing", label: "Procesamiento", value: "Mínimamente procesado", isSubItem: false },
      { category: "protein", label: "Proteína", value: "Magra y completa", isSubItem: false },
      { category: "carbs", label: "Carbohidratos", value: "Absorción moderada", isSubItem: false },
      { category: "fiber", label: "Fibra", value: "Buena fuente", isSubItem: false },
      { category: "sugar", label: "Azúcares añadidos", value: "Sin azúcar añadido", isSubItem: false },
      { category: "fat", label: "Grasas", value: "Grasas saludables", isSubItem: false },
      { category: "sodium", label: "Sodio", value: "Alto en sodio", isSubItem: false },
    ];
  }

  const badgeMap = new Map<string, string>();
  badges.forEach((b) => badgeMap.set(b.category, b.badgeText));

  const totalFiber =
    explicitMacros?.fiber !== undefined && explicitMacros.fiber > 0
      ? explicitMacros.fiber
      : ingredients.reduce((sum, i) => sum + (i.fiber || 0), 0) * servings;
  const totalProtein =
    explicitMacros?.protein !== undefined && explicitMacros.protein > 0
      ? explicitMacros.protein
      : ingredients.reduce((sum, i) => sum + (i.protein || 0), 0) * servings;
  const totalFat =
    explicitMacros?.fat !== undefined && explicitMacros.fat > 0
      ? explicitMacros.fat
      : ingredients.reduce((sum, i) => sum + (i.fat || 0), 0) * servings;
  const totalCarbs =
    explicitMacros?.carbs !== undefined && explicitMacros.carbs > 0
      ? explicitMacros.carbs
      : ingredients.reduce((sum, i) => sum + (i.carbs || 0), 0) * servings;

  const resolveVal = (category: string, defaultVal: string) => {
    const raw = badgeMap.get(category);
    if (!raw) return defaultVal;
    return raw;
  };

  // 1. Procesamiento (Sello de comida real / Alerta de refinado)
  const procVal = resolveVal("processing", "Mínimamente procesado");

  // 2. Proteína (Calidad y densidad biológica; jamás dice 'Bajo en proteína')
  const proteinVal = resolveVal(
    "protein",
    totalProtein >= 25 ? "Alto en proteína" : totalProtein >= 18 ? "Magra y completa" : totalProtein >= 10 ? "Buena fuente" : "Aporte moderado",
  );

  // 3. Carbohidratos (Cinética de energía sostenida; jamás dice 'Bajo en carbs')
  const carbsVal = resolveVal(
    "grains",
    totalCarbs > 35 ? "Absorción rápida" : totalCarbs > 15 ? "Complejos" : "Aporte moderado",
  );

  // 4. Fibra (Vector de alta relevancia; jamás dice 'Bajo en fibra')
  const fiberVal = resolveVal(
    "fiber",
    totalFiber >= 5 ? "Alto en fibra" : totalFiber >= 2 ? "Buena fuente" : "Aporte moderado",
  );

  // 5. Azúcares añadidos (Vector de confirmación / alerta)
  const sugarVal = resolveVal("sugar", "Sin azúcar añadido");

  // 6. Grasas (Perfil lipídico somático)
  const fatVal = resolveVal(
    "fat",
    totalFat >= 18 ? "Alto en grasas" : totalFat >= 8 ? "Grasas saludables" : "Aporte moderado",
  );

  // 7. Sodio (Balance hidroelectrolítico)
  const sodVal = resolveVal("sodium", "Moderado");

  return [
    { category: "processing", label: "Procesamiento", value: procVal, isSubItem: false },
    { category: "protein", label: "Proteína", value: proteinVal, isSubItem: false },
    { category: "carbs", label: "Carbohidratos", value: carbsVal, isSubItem: false },
    { category: "fiber", label: "Fibra", value: fiberVal, isSubItem: false },
    { category: "sugar", label: "Azúcares añadidos", value: sugarVal, isSubItem: false },
    { category: "fat", label: "Grasas", value: fatVal, isSubItem: false },
    { category: "sodium", label: "Sodio", value: sodVal, isSubItem: false },
  ];
}

export type FoodScanCategory = "bebida" | "comida" | "snack" | "postre";

export const SCAN_FOOD_CATEGORIES: {
  id: FoodScanCategory;
  label: string;
  sublabel: string;
  icon: any;
  defaultMealType: string;
}[] = [
  { id: "bebida", label: "Bebida", sublabel: "Beverage", icon: Coffee, defaultMealType: "Bebida" },
  { id: "comida", label: "Comida", sublabel: "Meal", icon: Utensils, defaultMealType: "Almuerzo" },
  { id: "snack", label: "Snack", sublabel: "Snack", icon: Apple, defaultMealType: "Colación" },
  { id: "postre", label: "Postre", sublabel: "Dessert", icon: Cake, defaultMealType: "Postre" },
];

export const INITIAL_FOOD_NOTE_ITEMS: string[] = [
  "4 huevos revueltos con aceite de oliva",
  "2 tostadas de pan de masa madre",
  "1 vaso de jugo de naranja natural",
  "20g de almendras tostadas",
  "1 manzana roja fresca",
];

export interface FoodDatabaseItem {
  id: string;
  name: string;
  brand?: string;
  calories: number;
  servingLabel: string;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  category: "protein" | "carbs" | "fats" | "fruit" | "veggie" | "dairy";
}

export const INITIAL_FOOD_DATABASE_ITEMS: FoodDatabaseItem[] = [
  { id: "fd-1", name: "Peanut Butter", calories: 94, servingLabel: "tbsp", protein: 4, carbs: 3, fat: 8, fiber: 1, category: "fats" },
  { id: "fd-2", name: "Avocado", brand: "Calavo", calories: 130, servingLabel: "serving", protein: 2, carbs: 6, fat: 12, fiber: 5, category: "fats" },
  { id: "fd-3", name: "Egg", calories: 74, servingLabel: "large", protein: 6, carbs: 0.4, fat: 5, fiber: 0, category: "protein" },
  { id: "fd-4", name: "Apples", calories: 72, servingLabel: "medium", protein: 0.3, carbs: 19, fat: 0.2, fiber: 3, category: "fruit" },
  { id: "fd-5", name: "Spinach", calories: 7, servingLabel: "cup", protein: 0.9, carbs: 1.1, fat: 0.1, fiber: 0.7, category: "veggie" },
  { id: "fd-6", name: "Oats / Avena", calories: 150, servingLabel: "1/2 cup (40g)", protein: 5, carbs: 27, fat: 3, fiber: 4, category: "carbs" },
  { id: "fd-7", name: "Chicken Breast", calories: 165, servingLabel: "100g", protein: 31, carbs: 0, fat: 3.6, fiber: 0, category: "protein" },
  { id: "fd-8", name: "Greek Yogurt", calories: 100, servingLabel: "150g", protein: 15, carbs: 6, fat: 0.5, fiber: 0, category: "dairy" },
  { id: "fd-9", name: "Brown Rice", calories: 112, servingLabel: "100g", protein: 2.6, carbs: 24, fat: 0.9, fiber: 1.8, category: "carbs" },
  { id: "fd-10", name: "Salmon", calories: 208, servingLabel: "100g", protein: 20, carbs: 0, fat: 13, fiber: 0, category: "protein" },
  { id: "fd-11", name: "Banana", calories: 105, servingLabel: "1 medium", protein: 1.3, carbs: 27, fat: 0.3, fiber: 3.1, category: "fruit" },
  { id: "fd-12", name: "Olive Oil", calories: 119, servingLabel: "1 tbsp", protein: 0, carbs: 0, fat: 14, fiber: 0, category: "fats" },
];

export interface PhytoColorItem {
  name: string;
  bgClass: string;
  phytochemical?: string;
}

export interface SampleMealModel {
  id: string;
  title: string;
  reportTitle: string;
  time: string;
  mealType: string;
  category?: FoodScanCategory;
  img: string;
  servings: number;
  servingLabel?: string;
  highlightNutrient?: string;
  highlightAmount?: string;
  healthScore: number;
  narrative: string;
  // Proprietary Shakerfy Bio-Nutrient Index (0-100)
  bioScore: number;
  bioGrade: string;
  bioQualityLabel: string;
  bioGaugeIndex: number; // 0 to 4
  vectorBadges: NutritionVectorBadge[];
  phytoColors: PhytoColorItem[];
  calloutPins: MealCalloutPin[];
  ingredients: MealIngredientItem[];
  customCtas?: MealDynamicCta[];
}

function isDryIngredientList(
  text: string,
  ingredients?: Array<{ name?: string } | string>,
): boolean {
  if (!text || !text.trim()) return true;
  const trimmed = text.trim();

  // Si contiene etiquetas de calorías o macros como "(120 kcal, 24g P)"
  if (/\b\d+\s*kcal\b|\(\s*\d+\s*(kcal|g|cal)/i.test(trimmed)) {
    return true;
  }

  // Si empieza con "Ingredientes:" o "Contiene:"
  if (/^(ingredientes|contiene|alimentos)\s*:/i.test(trimmed)) {
    return true;
  }

  // Si es un volcado de nombres separados por coma o "y"
  const rawParts = trimmed.split(/,\s*|\s+y\s+/i).map((p) => p.trim());
  if (rawParts.length >= 2) {
    const allShortParts = rawParts.every((p) => p.split(/\s+/).length <= 4);
    const hasVerbsOrAdjectives =
      /\b(tierno|tierna|dorado|dorada|crujiente|crocante|fresco|fresca|frescos|frescas|asado|asada|horneado|horneada|cremoso|cremosa|suave|suaves|arom[aá]tico|arom[aá]tica|reconfortante|ligero|ligera|liviano|liviana|esponjoso|esponjosa|sedoso|sedosa|aterciopelado|aterciopelada|jugoso|jugosa|maduro|madura|salteado|salteada|pochado|pochada|hervido|hervida|estaci[oó]n|digesti[oó]n|saciedad|textura|sabor|preparad|cocinad|servid|acompañad|elaborad|combinad|pensad|ideal)\b/i.test(
        trimmed,
      );
    if (allShortParts && !hasVerbsOrAdjectives) {
      return true;
    }
  }

  // Comparación contra array de ingredientes
  if (Array.isArray(ingredients) && ingredients.length > 0) {
    const ingNames = ingredients
      .map((i) => (typeof i === "string" ? i : i?.name || ""))
      .filter(Boolean)
      .map((n) => n.toLowerCase().trim());

    const lowerTrimmed = trimmed.toLowerCase();
    const joinedIngs = ingNames.join(", ");
    if (lowerTrimmed === joinedIngs || joinedIngs.includes(lowerTrimmed)) {
      return true;
    }
  }

  // Si es muy corto (< 6 palabras) y carece de estructura narrativa
  const words = trimmed.split(/\s+/);
  if (words.length <= 6 && !/\b(con|en|para|de|al|y)\b/i.test(trimmed)) {
    return true;
  }

  return false;
}

export function getDescriptiveMealNarrative(item?: {
  title?: string;
  name?: string;
  narrative?: string;
  description?: string;
  desc?: string;
  summary?: string;
  ingredients?: Array<{ name?: string } | string>;
  mealType?: string;
  category?: string;
} | null): string {
  if (!item) return "";

  const title = (item.title || item.name || "").trim();
  const lowerTitle = title.toLowerCase();

  // 1. Si existe una narrativa explícita y NO es un simple volcado de ingredientes ni calorías
  const explicit = item.description || item.narrative;
  if (explicit && explicit.trim()) {
    const cleaned = explicit
      .replace(/\b(con solo \d+\s*kcal(\s*por\s*100g)?|\d+\s*kcal|\d+\s*calorías)\b/gi, "")
      .replace(/\s{2,}/g, " ")
      .trim();

    if (
      cleaned.length > 20 &&
      cleaned.toLowerCase() !== lowerTitle &&
      !isDryIngredientList(cleaned, item.ingredients) &&
      !cleaned.toLowerCase().startsWith("análisis completo de tus notas") &&
      !cleaned.includes("P, ")
    ) {
      return cleaned;
    }
  }

  // 2. Extracción de ingredientes principales para tejer la narrativa culinaria
  const ingNames = Array.isArray(item.ingredients)
    ? item.ingredients
        .map((i) => (typeof i === "string" ? i : i?.name || ""))
        .filter(Boolean)
    : [];

  const translations: Record<string, string> = {
    "natural raspberry": "frambuesas silvestres",
    raspberry: "frambuesas",
    blueberries: "arándanos frescos",
    "fresh blueberries": "arándanos frescos",
    "chicken breast": "pechuga de pollo",
    "rice noodles": "fideos de arroz",
    "sweet potato": "batata horneada",
    avocado: "palta fresca",
    "green apple": "manzana verde",
    "dark chocolate": "chocolate amargo",
    "greek yogurt": "yogur griego",
  };

  const mainIngs = ingNames.slice(0, 3).map((n) => {
    const raw = n.toLowerCase().replace(/\s*\(.*?\)/g, "").trim();
    return translations[raw] || raw;
  });

  const ingsPhrase =
    mainIngs.length === 1
      ? mainIngs[0]
      : mainIngs.length === 2
        ? `${mainIngs[0]} y ${mainIngs[1]}`
        : mainIngs.length >= 3
          ? `${mainIngs[0]}, ${mainIngs[1]} y ${mainIngs[2]}`
          : "";

  // 3. Mapeo culinario, sensorial y somático por tipo de plato con límites de palabra estrictos (\b)
  if (
    /\b(frambuesa|frambuesas|frutilla|frutillas|manzana|manzanas|ar[aá]ndano|ar[aá]ndanos|banana|bananas|fruta|frutas|berry|berries)\b/i.test(
      lowerTitle,
    )
  ) {
    return ingsPhrase
      ? `Selección fresca y natural de ${ingsPhrase}, con acidez y dulzura equilibradas, alta concentración de agua y antioxidantes vivos.`
      : "Porción de fruta fresca de estación, jugosa y naturalmente rica en fibra y vitaminas protectoras.";
  }

  if (
    /\b(salm[oó]n|pescado|pescados|fish|at[uú]n|merluza|trucha|marisco|mariscos|camar[oó]n|camarones|langostino|langostinos)\b/i.test(
      lowerTitle,
    )
  ) {
    return ingsPhrase
      ? `Filete tierno de pescado dorado al punto justo con ${ingsPhrase}, combinando frescura marina, grasas saludables y liviandad digestiva.`
      : "Filete tierno de pescado dorado al grill con vegetales al vapor, rico en grasas saludables y proteína marina de fácil asimilación.";
  }

  if (/\b(pollo|chicken|pechuga|pechugas|pavo)\b/i.test(lowerTitle)) {
    return ingsPhrase
      ? `Plato principal a base de ${ingsPhrase}, dorado a las finas hierbas para brindar saciedad confortable y energía progresiva.`
      : "Pechuga de pollo tierna dorada al grill, acompañada de guarnición fresca para un balance proteico ideal.";
  }

  if (
    /\b(carne|carnes|lomo|bife|bifes|asado|\bres\b|vacun[oa]|ternera|cerdo|costilla|costillas)\b/i.test(
      lowerTitle,
    )
  ) {
    return ingsPhrase
      ? `Corte tierno de carne cocido a la plancha acompañado de ${ingsPhrase}, de cocción cuidada para una saciedad plena y reconfortante.`
      : "Corte tierno de carne asada al punto justo con guarnición fresca y saciedad duradera.";
  }

  if (/\b(bowl|bowls|poke|pokes)\b/i.test(lowerTitle)) {
    return ingsPhrase
      ? `Bowl fresco y colorido sobre una base equilibrada de ${ingsPhrase}, combinando texturas crujientes con suavidad y saciedad prolongada.`
      : "Bowl fresco y equilibrado con vegetales crocantes, granos enteros y fuentes nobles de proteína y grasas saludables.";
  }

  if (/\b(ensalada|ensaladas|salad|salads)\b/i.test(lowerTitle)) {
    return ingsPhrase
      ? `Ensalada fresca y crujiente a base de ${ingsPhrase}, pensada para una digestión liviana, óptima hidratación y aporte vivo de micronutrientes.`
      : "Ensalada fresca y colorida con hojas verdes crocantes, vegetales frescos y aderezo equilibrado para una digestión ágil.";
  }

  if (/\b(sopa|sopas|pho|phở|ramen|caldo|caldos|guiso|guisos|stew)\b/i.test(lowerTitle)) {
    return ingsPhrase
      ? `Preparación caliente y reconfortante en caldo aromático con ${ingsPhrase}, de asimilación pausada y excelente confort digestivo.`
      : "Sopa cálida y aromática elaborada con caldo casero, hierbas frescas e ingredientes suaves de fácil digestión.";
  }

  if (/\b(huevo|huevos|egg|eggs|omelette|omelettes|revuelto|revueltos|tortilla)\b/i.test(lowerTitle)) {
    return ingsPhrase
      ? `Preparación suave y cremosa con ${ingsPhrase}, cocinados al punto justo para una energía limpia y saciedad prolongada.`
      : "Huevos de campo revueltos al punto cremoso, acompañados de tostadas o vegetales para una energía matutina estable.";
  }

  if (/\b(tostad[ao]s?|tost[oó]n|pan|sandwich|sandwiches|avocado toast|wrap|wraps|arepa|arepas)\b/i.test(lowerTitle)) {
    return ingsPhrase
      ? `Tostada artesanal crocante coronada con ${ingsPhrase}, equilibrando texturas suaves y crujientes con grasas saludables.`
      : "Tostada crujiente de masa madre con cubierta fresca y nutritiva para una saciedad limpia.";
  }

  if (/\b(smoothie|smoothies|batido|batidos|licuado|licuados|shake|shakes)\b/i.test(lowerTitle)) {
    return ingsPhrase
      ? `Batido cremoso y refrescante a base de ${ingsPhrase}, ideal para una rápida absorción de micronutrientes e hidratación ligera.`
      : "Batido funcional suave y refrescante, preparado con frutas enteras e hidratación ligera.";
  }

  if (/\b(matcha|caf[eé]|latte|t[eé]|infusi[oó]n|infusiones)\b/i.test(lowerTitle)) {
    return ingsPhrase
      ? `Infusión aromática y revitalizante a base de ${ingsPhrase}, diseñada para un foco sostenido y una digestión serena.`
      : "Bebida aromática emulsionada al punto justo, ideal para acompañar la jornada con energía equilibrada.";
  }

  if (/\b(yogur|yogurt|chia|pudding|avena|porridge)\b/i.test(lowerTitle)) {
    return ingsPhrase
      ? `Copa fresca y aterciopelada a base de ${ingsPhrase}, rica en cultivos vivos, textura cremosa y bienestar digestivo.`
      : "Yogur natural cremoso con frutas frescas y semillas, aportando frescura láctea y confort digestivo.";
  }

  if (/\b(mousse|pancake|pancakes|postre|postres|dulce|dulces|brownie|torta|tortas)\b/i.test(lowerTitle)) {
    return ingsPhrase
      ? `Preparación dulce y delicada elaborada con ${ingsPhrase}, de textura sedosa y perfil amable para una sobremesa sin pesadez.`
      : "Postre artesanal equilibrado, combinando dulzura noble con ingredientes enteros de asimilación pausada.";
  }

  if (/\b(burger|burgers|hamburguesa|hamburguesas|pizza|pizzas|papas?)\b/i.test(lowerTitle)) {
    return ingsPhrase
      ? `Comida sabrosa y reconfortante con ${ingsPhrase}, pensada para disfrutar el momento con sabores intensos y texturas doradas.`
      : "Hamburguesa clásica a la parrilla con ingredientes seleccionados y guarnición dorada para disfrutar sin prisa.";
  }

  if (/\b(pasta|pastas|fideo|fideos|arroz|arroces|risotto|quinoa)\b/i.test(lowerTitle)) {
    return ingsPhrase
      ? `Plato reconfortante preparado con ${ingsPhrase}, cocinado al dente para una recarga gradual de energía y bienestar digestivo.`
      : "Plato caliente de granos al dente con aderezo fresco e ingredientes seleccionados de digestión amable.";
  }

  if (/\b(lenteja|lentejas|garbanzo|garbanzos|poroto|porotos|legumbre|legumbres)\b/i.test(lowerTitle)) {
    return ingsPhrase
      ? `Guisado tierno de legumbres con ${ingsPhrase}, rico en fibra prebiótica, minerales y saciedad sostenida.`
      : "Plato tibio y reconfortante de legumbres tiernas cocinadas a fuego lento con hierbas aromáticas.";
  }

  if (ingsPhrase) {
    return `Plato nutritivo y equilibrado preparado con ${ingsPhrase}, combinando frescura, texturas naturales y saciedad confortable.`;
  }

  return `Preparación casera y nutritiva con ingredientes frescos, pensada para sostener tu energía y brindar confort digestivo.`;
}

export const CAL_AI_SAMPLE_MEALS: SampleMealModel[] = [
  {
    id: "calai-raspberry",
    title: "Frambuesas Silvestres Frescas",
    reportTitle: "Frambuesas Silvestres Frescas",
    time: "9:41 AM",
    mealType: "Colación",
    category: "snack",
    img: "https://images.unsplash.com/photo-1577069808021-3e4b77134375?w=800&auto=format&fit=crop&q=80",
    servings: 1,
    servingLabel: "100g por porción",
    highlightNutrient: "Fuente de Vitamina C",
    highlightAmount: "25mg",
    healthScore: 10,
    narrative:
      "Frutos rojos frescos de recolección silvestre con acidez equilibrada y textura jugosa, ricos en vitamina C natural, polifenoles antioxidantes y fibra activa.",
    bioScore: 98,
    bioGrade: "A+",
    bioQualityLabel: "Fuente de Vitamina C",
    bioGaugeIndex: 4,
    vectorBadges: [
      {
        id: "v-proc",
        category: "processing",
        badgeText: "Sin procesar",
        description: "Fruta fresca natural sin refinamiento ni aditivos.",
      },
      {
        id: "v-fib",
        category: "fiber",
        badgeText: "Alto en fibra",
        description: "6.5g de fibra vegetal activa por cada 100g.",
      },
      {
        id: "v-sug",
        category: "sugar",
        badgeText: "Sin azúcar añadido",
        description: "Azúcares intrínsecos de absorción modulada.",
      },
    ],
    phytoColors: [
      {
        name: "Rojo / Morado",
        bgClass: "bg-rose-500",
        phytochemical: "Antocianinas y Elagitaninos",
      },
    ],
    calloutPins: [
      {
        name: "Frambuesas Silvestres",
        calories: 52,
        topPct: 45,
        leftPct: 50,
      },
    ],
    ingredients: [
      {
        id: "ing-rasp",
        name: "Natural Raspberry",
        category: "fruits",
        grams: 100,
        calories: 52,
        protein: 1.2,
        carbs: 12,
        fat: 0.7,
        fiber: 6.5,
        calPer100g: 52,
        pPer100g: 1.2,
        cPer100g: 12,
        fPer100g: 0.7,
        fiberPer100g: 6.5,
      },
    ],
  },
  {
    id: "calai-pho",
    title: "Chicken Phở con Fideos de Arroz y Vegetales",
    reportTitle: "Chicken Phở with Noodles, Veggies and Broth",
    time: "2:00 PM",
    mealType: "Almuerzo",
    category: "comida",
    img: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&auto=format&fit=crop&q=80",
    servings: 1,
    healthScore: 8,
    narrative:
      "Sopa tradicional vietnamita con caldo aromático infusionado con especias suaves, fideos elásticos de arroz, pechuga de pollo pochada y brotes crocantes de soja fresca.",
    bioScore: 88,
    bioGrade: "A",
    bioQualityLabel: "Nutrición Superior & Alta Densidad",
    bioGaugeIndex: 3,
    vectorBadges: [
      {
        id: "v-proc",
        category: "processing",
        badgeText: "Minimally Processed",
        description: "Ingredientes enteros cocidos sin aditivos ultraprocesados.",
      },
      {
        id: "v-fib",
        category: "fiber",
        badgeText: "Good Source",
        description: "Aporte prebiótico de brotes de soja frescos y hierbas digestivas.",
      },
      {
        id: "v-prot",
        category: "protein",
        badgeText: "Lean & Complete",
        description: "Pollo hervido con perfil completo de aminoácidos esenciales.",
      },
      {
        id: "v-sug",
        category: "sugar",
        badgeText: "Zero",
        description: "Sin glucosa refinada ni endulzantes industriales.",
      },
      {
        id: "v-fat",
        category: "fat",
        badgeText: "Mostly Unsaturated",
        description: "Contenido graso moderado mayormente insaturado de asimilación ligera.",
      },
      {
        id: "v-grain",
        category: "grains",
        badgeText: "Moderate-Fast Absorption",
        description: "Fideos de arroz bánh phở como combustible glucogénico limpio.",
      },
      {
        id: "v-sod",
        category: "sodium",
        badgeText: "Elevated",
        description: "Caldo sazonado con salsa de pescado tradicional rica en sodio.",
      },
    ],
    phytoColors: [
      {
        name: "Verde",
        bgClass: "bg-emerald-500",
        phytochemical: "Clorofila y Folatos (brotes y hierbas)",
      },
      {
        name: "Blanco",
        bgClass: "bg-stone-300 dark:bg-stone-400",
        phytochemical: "Alicina y almidón digestible (arroz y caldo)",
      },
    ],
    calloutPins: [
      { name: "Fideos de Arroz", calories: 230, topPct: 45, leftPct: 20 },
      { name: "Pollo Desmenuzado", calories: 170, topPct: 30, rightPct: 28 },
      { name: "Caldo Aromático & Hierbas", calories: 60, topPct: 65, rightPct: 35 },
    ],
    ingredients: [
      {
        id: "pho-noodles",
        name: "Fideos de Arroz (Bánh Phở)",
        category: "carbs",
        grams: 200,
        calories: 230,
        protein: 4,
        carbs: 48,
        fat: 1,
        fiber: 1.5,
        calPer100g: 108,
        pPer100g: 1.8,
        cPer100g: 24,
        fPer100g: 0.2,
        fiberPer100g: 1,
      },
      {
        id: "pho-chicken",
        name: "Pechuga de Pollo Pochada",
        category: "protein",
        grams: 110,
        calories: 170,
        protein: 26,
        carbs: 0,
        fat: 3.5,
        fiber: 0,
        calPer100g: 155,
        pPer100g: 24,
        cPer100g: 0,
        fPer100g: 3.2,
        fiberPer100g: 0,
      },
      {
        id: "pho-broth",
        name: "Caldo de Huesos con Anís",
        category: "veggies",
        grams: 350,
        calories: 60,
        protein: 6,
        carbs: 3,
        fat: 2,
        fiber: 0.5,
        calPer100g: 17,
        pPer100g: 1.7,
        cPer100g: 0.9,
        fPer100g: 0.6,
        fiberPer100g: 0.1,
      },
    ],
  },
  {
    id: "calai-salmon",
    title: "Salmón Salvaje & Brócoli al Vapor",
    reportTitle: "Wild Atlantic Salmon & Steamed Broccoli Tray",
    time: "1:45 PM",
    mealType: "Almuerzo",
    category: "comida",
    img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop&q=80",
    servings: 1,
    healthScore: 9,
    narrative:
      "Filete tierno de salmón salvaje dorado al grill, acompañado de ramilletes crujientes de brócoli al vapor con sal marina y aceite de oliva virgen extra para una digestión liviana y saciedad limpia.",
    bioScore: 96,
    bioGrade: "A+",
    bioQualityLabel: "Alta Densidad Nutricional",
    bioGaugeIndex: 4,
    vectorBadges: [
      {
        id: "v-proc",
        category: "processing",
        badgeText: "Sin procesar",
        description: "Cero refinamiento, ingredientes directos en su estado biológico natural.",
      },
      {
        id: "v-fib",
        category: "fiber",
        badgeText: "Alto en fibra",
        description: "Brócoli entero con fibra vegetal que optimiza la flora intestinal.",
      },
      {
        id: "v-prot",
        category: "protein",
        badgeText: "Alto en proteína",
        description: "Salmón del Atlántico con máxima biodisponibilidad proteica.",
      },
      {
        id: "v-sug",
        category: "sugar",
        badgeText: "Sin azúcar añadido",
        description: "Impacto glucémico neutro.",
      },
      {
        id: "v-fat",
        category: "fat",
        badgeText: "Grasas saludables",
        description: "Lípidos cardioprotectores Omega-3.",
      },
      {
        id: "v-grain",
        category: "grains",
        badgeText: "Sin granos",
        description: "Comida cetogénica / paleo limpia.",
      },
      {
        id: "v-sod",
        category: "sodium",
        badgeText: "Bajo en sodio",
        description: "Sin adición excesiva de sal marina.",
      },
    ],
    phytoColors: [
      {
        name: "Verde",
        bgClass: "bg-emerald-500",
        phytochemical: "Sulforafano y Clorofila (brócoli al vapor)",
      },
      {
        name: "Naranja",
        bgClass: "bg-amber-500",
        phytochemical: "Astaxantina y Omega-3 (salmón del Atlántico)",
      },
    ],
    calloutPins: [
      { name: "Salmón del Atlántico", calories: 380, topPct: 35, leftPct: 22 },
      { name: "Brócoli al Vapor", calories: 45, topPct: 58, rightPct: 24 },
    ],
    ingredients: [
      {
        id: "salmon-fillet",
        name: "Filete de Salmón al Grill",
        category: "protein",
        grams: 180,
        calories: 380,
        protein: 36,
        carbs: 0,
        fat: 22,
        fiber: 0,
        calPer100g: 208,
        pPer100g: 20,
        cPer100g: 0,
        fPer100g: 12,
        fiberPer100g: 0,
      },
      {
        id: "broccoli-veg",
        name: "Brócoli Fresco al Vapor",
        category: "veggies",
        grams: 130,
        calories: 45,
        protein: 3.5,
        carbs: 7,
        fat: 0.5,
        fiber: 3.2,
        calPer100g: 34,
        pPer100g: 2.8,
        cPer100g: 6.6,
        fPer100g: 0.4,
        fiberPer100g: 2.6,
      },
    ],
  },
  {
    id: "calai-chicken",
    title: "Bowl de Pollo Grill, Batata Asada & Palta",
    reportTitle: "Grilled Chicken & Sweet Potato Bowl",
    time: "8:15 PM",
    mealType: "Cena",
    category: "comida",
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
    servings: 1,
    healthScore: 9,
    narrative:
      "Pechuga de pollo tierna dorada a las finas hierbas con cubos de batata horneada caramelizada y rodajas cremosas de palta fresca sobre hojas verdes crujientes.",
    bioScore: 92,
    bioGrade: "A+",
    bioQualityLabel: "Alta Densidad Nutricional",
    bioGaugeIndex: 4,
    vectorBadges: [
      {
        id: "v-proc",
        category: "processing",
        badgeText: "Mínimamente procesado",
        description: "Cocción al horno y plancha sin ultraprocesados.",
      },
      {
        id: "v-fib",
        category: "fiber",
        badgeText: "Alto en fibra",
        description: "Batata con piel y vegetales verdes ricos en fibra soluble.",
      },
      {
        id: "v-prot",
        category: "protein",
        badgeText: "Alto en proteína",
        description: "42g de proteína magra de alta digestibilidad.",
      },
      {
        id: "v-sug",
        category: "sugar",
        badgeText: "Sin azúcar añadido",
        description: "Dulzura natural de la batata asada.",
      },
      {
        id: "v-fat",
        category: "fat",
        badgeText: "Grasas saludables",
        description: "Palta Hass rica en ácido oleico monoinsaturado.",
      },
      {
        id: "v-grain",
        category: "grains",
        badgeText: "Granos enteros",
        description: "Carbohidratos complejos de absorción sostenida.",
      },
      {
        id: "v-sod",
        category: "sodium",
        badgeText: "Bajo en sodio",
        description: "Minerales electrolíticos balanceados.",
      },
    ],
    phytoColors: [
      {
        name: "Verde",
        bgClass: "bg-emerald-500",
        phytochemical: "Luteína y Ácido Oleico (palta y hojas verdes)",
      },
      { name: "Naranja", bgClass: "bg-amber-500", phytochemical: "Beta-carotenos (batata asada)" },
      {
        name: "Blanco",
        bgClass: "bg-stone-300 dark:bg-stone-400",
        phytochemical: "Proteína magra y fibra (pechuga y granos)",
      },
    ],
    calloutPins: [
      { name: "Pechuga de Pollo", calories: 290, topPct: 30, leftPct: 25 },
      { name: "Batata Asada", calories: 160, topPct: 55, rightPct: 22 },
      { name: "Palta & Verdes", calories: 95, topPct: 40, rightPct: 45 },
    ],
    ingredients: [
      {
        id: "chicken-breast",
        name: "Pechuga de Pollo al Grill",
        category: "protein",
        grams: 175,
        calories: 290,
        protein: 42,
        carbs: 0,
        fat: 6,
        fiber: 0,
        calPer100g: 165,
        pPer100g: 31,
        cPer100g: 0,
        fPer100g: 3.6,
        fiberPer100g: 0,
      },
      {
        id: "sweet-potatoes",
        name: "Cubos de Batata Horneada",
        category: "carbs",
        grams: 140,
        calories: 160,
        protein: 2.5,
        carbs: 35,
        fat: 1.5,
        fiber: 4.2,
        calPer100g: 86,
        pPer100g: 1.6,
        cPer100g: 20,
        fPer100g: 0.1,
        fiberPer100g: 3,
      },
      {
        id: "avocado-bowl",
        name: "Palta Hass en Rodajas",
        category: "fats",
        grams: 55,
        calories: 95,
        protein: 1,
        carbs: 4.5,
        fat: 8.5,
        fiber: 3.5,
        calPer100g: 160,
        pPer100g: 2,
        cPer100g: 8.5,
        fPer100g: 14.7,
        fiberPer100g: 6.7,
      },
    ],
  },
  {
    id: "calai-smoothie",
    title: "Smoothie Proteico de Frutos Rojos & Chía",
    reportTitle: "Wild Berry & Chia Protein Recovery Shake",
    time: "10:30 AM",
    mealType: "Bebida",
    category: "bebida",
    img: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&auto=format&fit=crop&q=80",
    servings: 1,
    healthScore: 9,
    narrative:
      "Batido cremoso y refrescante de frutos silvestres y chía hidratada con un toque suave de vainilla, ideal para hidratar y revitalizar el cuerpo de forma ligera.",
    bioScore: 94,
    bioGrade: "A+",
    bioQualityLabel: "Alta Densidad Nutricional",
    bioGaugeIndex: 4,
    vectorBadges: [
      {
        id: "v-proc",
        category: "processing",
        badgeText: "Mínimamente procesado",
        description: "Fruta entera licuada con leche vegetal pura.",
      },
      {
        id: "v-fib",
        category: "fiber",
        badgeText: "Alto en fibra",
        description: "Mucílagos de chía y fibra soluble de frutos rojos.",
      },
      {
        id: "v-prot",
        category: "protein",
        badgeText: "Alto en proteína",
        description: "22g de proteína de absorción eficiente.",
      },
      {
        id: "v-sug",
        category: "sugar",
        badgeText: "Sin azúcar añadido",
        description: "Cero azúcares añadidos ni jarabes industriales.",
      },
      {
        id: "v-fat",
        category: "fat",
        badgeText: "Grasas saludables",
        description: "Omega-3 ALA proveniente de las semillas de chía.",
      },
    ],
    phytoColors: [
      {
        name: "Morado",
        bgClass: "bg-purple-500",
        phytochemical: "Antocianinas y Elagitaninos (arándanos y frambuesas)",
      },
    ],
    calloutPins: [
      { name: "Frutos Rojos", calories: 65, topPct: 30, leftPct: 25 },
      { name: "Proteína Aislada", calories: 110, topPct: 55, rightPct: 30 },
      { name: "Semillas de Chía", calories: 55, topPct: 40, rightPct: 40 },
    ],
    ingredients: [
      {
        id: "berries-mix",
        name: "Mix de Arándanos & Frutillas",
        category: "fruits",
        grams: 130,
        calories: 65,
        protein: 1.5,
        carbs: 14,
        fat: 0.5,
        fiber: 4.5,
        calPer100g: 50,
        pPer100g: 1.1,
        cPer100g: 11,
        fPer100g: 0.4,
        fiberPer100g: 3.5,
      },
      {
        id: "whey-iso",
        name: "Proteína Whey Aislada Natural",
        category: "protein",
        grams: 28,
        calories: 110,
        protein: 24,
        carbs: 1,
        fat: 0.5,
        fiber: 0,
        calPer100g: 390,
        pPer100g: 85,
        cPer100g: 3.5,
        fPer100g: 1.8,
        fiberPer100g: 0,
      },
      {
        id: "chia-seeds",
        name: "Semillas de Chía Enteras",
        category: "fats",
        grams: 12,
        calories: 58,
        protein: 2,
        carbs: 5,
        fat: 3.8,
        fiber: 4,
        calPer100g: 486,
        pPer100g: 16.5,
        cPer100g: 42,
        fPer100g: 30.7,
        fiberPer100g: 34,
      },
    ],
  },
  {
    id: "calai-matcha",
    title: "Matcha Latte Ceremonial & Canela",
    reportTitle: "Ceremonial Matcha Oat Latte",
    time: "4:00 PM",
    mealType: "Bebida",
    category: "bebida",
    img: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=800&auto=format&fit=crop&q=80",
    servings: 1,
    healthScore: 9,
    narrative:
      "Té matcha ceremonial batido a la espuma con leche tibia de avena y una pizca sutil de canela dulce, para una energía serena y foco prolongado sin sobresaltos.",
    bioScore: 90,
    bioGrade: "A",
    bioQualityLabel: "Antioxidante & Foco Sostenido",
    bioGaugeIndex: 3,
    vectorBadges: [
      {
        id: "v-proc",
        category: "processing",
        badgeText: "Mínimamente procesado",
        description: "Hojas de té matcha molidas a la piedra.",
      },
      {
        id: "v-sug",
        category: "sugar",
        badgeText: "Sin azúcar añadido",
        description: "Bebida pura sin jarabes.",
      },
    ],
    phytoColors: [
      {
        name: "Verde",
        bgClass: "bg-emerald-500",
        phytochemical: "EGCG y Clorofila Concentrada",
      },
    ],
    calloutPins: [
      { name: "Matcha Ceremonial", calories: 15, topPct: 40, leftPct: 35 },
      { name: "Leche de Avena", calories: 95, topPct: 60, rightPct: 25 },
    ],
    ingredients: [
      {
        id: "matcha-powder",
        name: "Matcha Ceremonial Grado A",
        category: "veggies",
        grams: 4,
        calories: 12,
        protein: 1,
        carbs: 1.5,
        fat: 0.2,
        fiber: 1,
        calPer100g: 300,
        pPer100g: 25,
        cPer100g: 38,
        fPer100g: 5,
        fiberPer100g: 25,
      },
      {
        id: "oat-milk",
        name: "Leche de Avena Sin Azúcar",
        category: "carbs",
        grams: 220,
        calories: 95,
        protein: 2.5,
        carbs: 14,
        fat: 3,
        fiber: 1.8,
        calPer100g: 43,
        pPer100g: 1.1,
        cPer100g: 6.5,
        fPer100g: 1.4,
        fiberPer100g: 0.8,
      },
    ],
  },
  {
    id: "calai-snack-mix",
    title: "Mix de Almendras, Manzana Verde & Cacao 85%",
    reportTitle: "Raw Almonds, Green Apple & Dark Chocolate",
    time: "5:30 PM",
    mealType: "Snack",
    category: "snack",
    img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80",
    servings: 1,
    healthScore: 9,
    narrative:
      "Mix crocante de almendras tostadas con rodajas crujientes de manzana verde y bocados intensos de chocolate amargo 85%, ideal para una pausa equilibrada.",
    bioScore: 93,
    bioGrade: "A+",
    bioQualityLabel: "Alta Densidad Nutricional",
    bioGaugeIndex: 4,
    vectorBadges: [
      {
        id: "v-proc",
        category: "processing",
        badgeText: "Sin procesar",
        description: "Fruta fresca y frutos secos crudos.",
      },
      {
        id: "v-fib",
        category: "fiber",
        badgeText: "Alto en fibra",
        description: "Pectina de manzana y fibra de almendras.",
      },
      {
        id: "v-fat",
        category: "fat",
        badgeText: "Grasas saludables",
        description: "Lípidos monoinsaturados cardioprotectores.",
      },
    ],
    phytoColors: [
      {
        name: "Verde",
        bgClass: "bg-emerald-500",
        phytochemical: "Pectina y Quercetina",
      },
      {
        name: "Marrón",
        bgClass: "bg-amber-900",
        phytochemical: "Flavanoles del Cacao",
      },
    ],
    calloutPins: [
      { name: "Almendras Tostadas", calories: 130, topPct: 35, leftPct: 25 },
      { name: "Manzana Verde", calories: 60, topPct: 55, rightPct: 30 },
      { name: "Chocolate 85%", calories: 55, topPct: 40, rightPct: 35 },
    ],
    ingredients: [
      {
        id: "almonds-raw",
        name: "Almendras Naturales",
        category: "fats",
        grams: 22,
        calories: 130,
        protein: 4.8,
        carbs: 4.5,
        fat: 11,
        fiber: 2.8,
        calPer100g: 579,
        pPer100g: 21,
        cPer100g: 20,
        fPer100g: 49,
        fiberPer100g: 12.5,
      },
      {
        id: "green-apple",
        name: "Manzana Verde Granny Smith",
        category: "fruits",
        grams: 120,
        calories: 62,
        protein: 0.5,
        carbs: 16,
        fat: 0.2,
        fiber: 3.2,
        calPer100g: 52,
        pPer100g: 0.3,
        cPer100g: 13.8,
        fPer100g: 0.2,
        fiberPer100g: 2.4,
      },
      {
        id: "dark-choc",
        name: "Chocolate Amargo 85% Cacao",
        category: "fats",
        grams: 10,
        calories: 55,
        protein: 1,
        carbs: 3.5,
        fat: 4.5,
        fiber: 1.5,
        calPer100g: 550,
        pPer100g: 9,
        cPer100g: 35,
        fPer100g: 45,
        fiberPer100g: 15,
      },
    ],
  },
  {
    id: "calai-greek-yogurt",
    title: "Yogur Griego Natural & Arándanos",
    reportTitle: "Greek Yogurt with Fresh Blueberries",
    time: "11:15 AM",
    mealType: "Snack",
    category: "snack",
    img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&auto=format&fit=crop&q=80",
    servings: 1,
    healthScore: 9,
    narrative:
      "Yogur griego espeso y aterciopelado servido con arándanos frescos de estación, combinando frescura láctea, suave acidez y bienestar digestivo.",
    bioScore: 95,
    bioGrade: "A+",
    bioQualityLabel: "Alta Proteína & Probióticos",
    bioGaugeIndex: 4,
    vectorBadges: [
      {
        id: "v-proc",
        category: "processing",
        badgeText: "Mínimamente procesado",
        description: "Lácteo fermentado natural.",
      },
      {
        id: "v-prot",
        category: "protein",
        badgeText: "Alto en proteína",
        description: "18g de proteína láctea de lenta asimilación.",
      },
      {
        id: "v-sug",
        category: "sugar",
        badgeText: "Sin azúcar añadido",
        description: "Sin edulcorantes ni glucosa añadida.",
      },
    ],
    phytoColors: [
      {
        name: "Morado",
        bgClass: "bg-purple-500",
        phytochemical: "Antocianinas de arándanos frescos",
      },
    ],
    calloutPins: [
      { name: "Yogur Griego", calories: 120, topPct: 45, leftPct: 30 },
      { name: "Arándanos Frescos", calories: 35, topPct: 30, rightPct: 35 },
    ],
    ingredients: [
      {
        id: "greek-yog",
        name: "Yogur Griego Natural 0%",
        category: "protein",
        grams: 180,
        calories: 120,
        protein: 18,
        carbs: 6,
        fat: 1.5,
        fiber: 0,
        calPer100g: 67,
        pPer100g: 10,
        cPer100g: 3.5,
        fPer100g: 0.8,
        fiberPer100g: 0,
      },
      {
        id: "fresh-blueberries",
        name: "Arándanos Frescos",
        category: "fruits",
        grams: 60,
        calories: 35,
        protein: 0.5,
        carbs: 8.5,
        fat: 0.2,
        fiber: 1.8,
        calPer100g: 57,
        pPer100g: 0.7,
        cPer100g: 14.5,
        fPer100g: 0.3,
        fiberPer100g: 2.4,
      },
    ],
  },
  {
    id: "calai-mousse",
    title: "Mousse de Cacao Puro, Palta & Frutillas",
    reportTitle: "Raw Dark Cacao & Avocado Conscious Mousse",
    time: "9:45 PM",
    mealType: "Postre",
    category: "postre",
    img: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&auto=format&fit=crop&q=80",
    servings: 1,
    healthScore: 9,
    narrative:
      "Mousse artesanal de textura sedosa y aterciopelada a base de palta y cacao puro, coronada con frutillas frescas para un dulce indulgente y ligero.",
    bioScore: 90,
    bioGrade: "A",
    bioQualityLabel: "Dulce Consciente & Bajo Impacto Glucémico",
    bioGaugeIndex: 3,
    vectorBadges: [
      {
        id: "v-proc",
        category: "processing",
        badgeText: "Mínimamente procesado",
        description: "Postre a base de alimentos enteros crudos.",
      },
      {
        id: "v-fib",
        category: "fiber",
        badgeText: "Alto en fibra",
        description: "Fibra soluble e insoluble de palta y cacao puro.",
      },
      {
        id: "v-fat",
        category: "fat",
        badgeText: "Grasas saludables",
        description: "Ácidos grasos monoinsaturados que evitan picos de insulina.",
      },
    ],
    phytoColors: [
      {
        name: "Rojo",
        bgClass: "bg-rose-500",
        phytochemical: "Antocianinas y Vitamina C (frutillas)",
      },
      {
        name: "Marrón",
        bgClass: "bg-amber-950",
        phytochemical: "Polifenoles y Teobromina (cacao puro)",
      },
    ],
    calloutPins: [
      { name: "Mousse de Cacao & Palta", calories: 150, topPct: 40, leftPct: 25 },
      { name: "Frutillas Frescas", calories: 25, topPct: 30, rightPct: 30 },
    ],
    ingredients: [
      {
        id: "cacao-mousse-base",
        name: "Base de Palta & Cacao 100%",
        category: "fats",
        grams: 90,
        calories: 150,
        protein: 3.5,
        carbs: 11,
        fat: 11.5,
        fiber: 6,
        calPer100g: 166,
        pPer100g: 3.8,
        cPer100g: 12.2,
        fPer100g: 12.8,
        fiberPer100g: 6.6,
      },
      {
        id: "fresh-strawberries",
        name: "Frutillas en Láminas",
        category: "fruits",
        grams: 70,
        calories: 23,
        protein: 0.5,
        carbs: 5.5,
        fat: 0.2,
        fiber: 1.4,
        calPer100g: 32,
        pPer100g: 0.7,
        cPer100g: 7.7,
        fPer100g: 0.3,
        fiberPer100g: 2,
      },
    ],
  },
  {
    id: "calai-pancakes",
    title: "Pancakes con Arándanos Frescos & Miel de Maple",
    reportTitle: "Pancakes with Blueberries & Syrup",
    time: "9:30 AM",
    mealType: "Postre",
    category: "postre",
    img: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800&auto=format&fit=crop&q=80",
    servings: 1,
    healthScore: 7,
    narrative:
      "Torre de pancakes caseros esponjosos y dorados, coronados con arándanos frescos jugosos y un baño suave de sirope puro de maple.",
    bioScore: 78,
    bioGrade: "B+",
    bioQualityLabel: "Energía Matutina Equilibrada",
    bioGaugeIndex: 2,
    vectorBadges: [
      {
        id: "v-proc",
        category: "processing",
        badgeText: "Mínimamente procesado",
        description: "Cocción casera con fruta entera fresca.",
      },
      {
        id: "v-fib",
        category: "fiber",
        badgeText: "Buena fibra",
        description: "Polifenoles y fibra de arándanos enteros.",
      },
      {
        id: "v-prot",
        category: "protein",
        badgeText: "Proteína moderada",
        description: "Aporte proteico complementario de huevo y leche.",
      },
      {
        id: "v-sug",
        category: "sugar",
        badgeText: "Azúcar moderado",
        description: "Sirope de arce puro en porción moderada.",
      },
      {
        id: "v-fat",
        category: "fat",
        badgeText: "Bajo en grasas",
        description: "Carga lipídica ligera.",
      },
      {
        id: "v-grain",
        category: "grains",
        badgeText: "Granos simples",
        description: "Combustible glucídico matutino.",
      },
      {
        id: "v-sod",
        category: "sodium",
        badgeText: "Bajo en sodio",
        description: "Sin exceso de sal añadida.",
      },
    ],
    phytoColors: [
      {
        name: "Morado",
        bgClass: "bg-purple-500",
        phytochemical: "Antocianinas y Resveratrol (arándanos frescos)",
      },
      {
        name: "Dorado/Blanco",
        bgClass: "bg-amber-400",
        phytochemical: "Polifenoles y glucosa rápida (sirope puro)",
      },
    ],
    calloutPins: [
      { name: "Arándanos Frescos", calories: 8, topPct: 22, leftPct: 28 },
      { name: "Sirope de Maple", calories: 12, topPct: 62, leftPct: 18 },
      { name: "Pancakes Caseros", calories: 595, topPct: 40, rightPct: 22 },
    ],
    ingredients: [
      {
        id: "pancakes-base",
        name: "Pancakes Caseros (3 unidades)",
        category: "carbs",
        grams: 220,
        calories: 595,
        protein: 10,
        carbs: 85,
        fat: 20,
        fiber: 2.5,
        calPer100g: 270,
        pPer100g: 4.5,
        cPer100g: 38.6,
        fPer100g: 9.1,
        fiberPer100g: 1.1,
      },
      {
        id: "pancakes-syrup",
        name: "Sirope Puro de Maple",
        category: "carbs",
        grams: 15,
        calories: 12,
        protein: 0,
        carbs: 7,
        fat: 0,
        fiber: 0,
        calPer100g: 260,
        pPer100g: 0,
        cPer100g: 67,
        fPer100g: 0,
        fiberPer100g: 0,
      },
      {
        id: "pancakes-berries",
        name: "Arándanos Frescos",
        category: "fruits",
        grams: 25,
        calories: 8,
        protein: 1,
        carbs: 1,
        fat: 1,
        fiber: 0.8,
        calPer100g: 57,
        pPer100g: 0.7,
        cPer100g: 14.5,
        fPer100g: 0.3,
        fiberPer100g: 2.4,
      },
    ],
  },
  {
    id: "calai-burger",
    title: "Doble Cheeseburger con Papas Fritas",
    reportTitle: "Double Cheeseburger & Crispy Fries Combo",
    time: "9:15 PM",
    mealType: "Cena",
    category: "comida",
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80",
    servings: 1,
    healthScore: 4,
    narrative:
      "Hamburguesa doble a la plancha con queso derretido en pan artesanal dorado, acompañada de papas crujientes para disfrutar el momento con calma.",
    bioScore: 42,
    bioGrade: "C",
    bioQualityLabel: "Alimento Ultraprocesado",
    bioGaugeIndex: 0,
    vectorBadges: [
      {
        id: "v-proc",
        category: "processing",
        badgeText: "Ultraprocesado",
        description: "Matriz con aditivos, pan industrial y carnes reconstituidas.",
      },
      {
        id: "v-fib",
        category: "fiber",
        badgeText: "Bajo en fibra",
        description: "Carencia de fibra vegetal prebiótica, absorción glucémica acelerada.",
      },
      {
        id: "v-prot",
        category: "protein",
        badgeText: "Proteína grasa",
        description: "Aporte proteico acompañado de elevada fracción lipídica.",
      },
      {
        id: "v-sug",
        category: "sugar",
        badgeText: "Alto en azúcar",
        description: "Jarabes de alta fructosa en aderezos y panificado.",
      },
      {
        id: "v-fat",
        category: "fat",
        badgeText: "Alto en grasas",
        description: "Lípidos saturados y aceites reutilizados en fritura profunda.",
      },
      {
        id: "v-grain",
        category: "grains",
        badgeText: "Granos refinados",
        description: "Pan de hamburguesa desprovisto de salvado, rápida conversión en glucosa.",
      },
      {
        id: "v-sod",
        category: "sodium",
        badgeText: "Alto en sodio",
        description: "Supera el 50% del requerimiento diario sugerido por la OMS.",
      },
    ],
    phytoColors: [
      {
        name: "Rojo",
        bgClass: "bg-rose-500",
        phytochemical: "Licopeno procesado (salsa de tomate)",
      },
      {
        name: "Blanco/Dorado",
        bgClass: "bg-stone-300 dark:bg-stone-400",
        phytochemical: "Carbohidratos refinados (pan y patatas)",
      },
    ],
    calloutPins: [
      { name: "Medallones de Carne", calories: 480, topPct: 40, leftPct: 30 },
      { name: "Queso Cheddar Fundido", calories: 190, topPct: 32, rightPct: 25 },
      { name: "Papas Fritas", calories: 340, topPct: 65, rightPct: 20 },
    ],
    ingredients: [
      {
        id: "burger-patties",
        name: "Medallones de Carne Vacuna",
        category: "protein",
        grams: 200,
        calories: 480,
        protein: 34,
        carbs: 0,
        fat: 38,
        fiber: 0,
        calPer100g: 240,
        pPer100g: 17,
        cPer100g: 0,
        fPer100g: 19,
        fiberPer100g: 0,
      },
      {
        id: "burger-bun",
        name: "Pan de Hamburguesa Blanco",
        category: "carbs",
        grams: 90,
        calories: 250,
        protein: 7,
        carbs: 46,
        fat: 4,
        fiber: 1,
        calPer100g: 277,
        pPer100g: 7.7,
        cPer100g: 51,
        fPer100g: 4.4,
        fiberPer100g: 1.1,
      },
      {
        id: "burger-fries",
        name: "Papas Fritas en Aceite",
        category: "carbs",
        grams: 110,
        calories: 340,
        protein: 3.5,
        carbs: 42,
        fat: 17,
        fiber: 2.8,
        calPer100g: 310,
        pPer100g: 3.2,
        cPer100g: 38,
        fPer100g: 15.5,
        fiberPer100g: 2.5,
      },
    ],
  },
];

export const COMMON_FOODS_DATABASE = [
  {
    name: "Pancakes (Caseros)",
    calPer100g: 270,
    pPer100g: 4.5,
    cPer100g: 38.6,
    fPer100g: 9.1,
    fiberPer100g: 1.1,
    category: "carbs" as const,
  },
  {
    name: "Sirope de Maple",
    calPer100g: 260,
    pPer100g: 0,
    cPer100g: 67,
    fPer100g: 0,
    fiberPer100g: 0,
    category: "carbs" as const,
  },
  {
    name: "Arándanos Frescos",
    calPer100g: 57,
    pPer100g: 0.7,
    cPer100g: 14.5,
    fPer100g: 0.3,
    fiberPer100g: 2.4,
    category: "fruits" as const,
  },
  {
    name: "Huevo Entero (Hervido / Pochado)",
    calPer100g: 155,
    pPer100g: 13,
    cPer100g: 1.1,
    fPer100g: 11,
    fiberPer100g: 0,
    category: "protein" as const,
  },
  {
    name: "Pechuga de Pollo (Grill)",
    calPer100g: 165,
    pPer100g: 31,
    cPer100g: 0,
    fPer100g: 3.6,
    fiberPer100g: 0,
    category: "protein" as const,
  },
  {
    name: "Salmón Fresco (Grill)",
    calPer100g: 208,
    pPer100g: 20,
    cPer100g: 0,
    fPer100g: 12,
    fiberPer100g: 0,
    category: "protein" as const,
  },
  {
    name: "Batata Asada (Al Horno)",
    calPer100g: 86,
    pPer100g: 1.6,
    cPer100g: 20,
    fPer100g: 0.1,
    fiberPer100g: 3,
    category: "carbs" as const,
  },
  {
    name: "Arroz Blanco Cocido",
    calPer100g: 130,
    pPer100g: 2.7,
    cPer100g: 28,
    fPer100g: 0.3,
    fiberPer100g: 0.4,
    category: "carbs" as const,
  },
  {
    name: "Palta Hass Fresca",
    calPer100g: 160,
    pPer100g: 2,
    cPer100g: 8.5,
    fPer100g: 14.7,
    fiberPer100g: 6.7,
    category: "fats" as const,
  },
  {
    name: "Brócoli al Vapor",
    calPer100g: 34,
    pPer100g: 2.8,
    cPer100g: 6.6,
    fPer100g: 0.4,
    fiberPer100g: 2.6,
    category: "veggies" as const,
  },
  {
    name: "Yogur Griego Natural",
    calPer100g: 59,
    pPer100g: 10,
    cPer100g: 3.6,
    fPer100g: 0.4,
    fiberPer100g: 0,
    category: "dairy" as const,
  },
  {
    name: "Aceite de Oliva Extra Virgen",
    calPer100g: 884,
    pPer100g: 0,
    cPer100g: 0,
    fPer100g: 100,
    fiberPer100g: 0,
    category: "fats" as const,
  },
];

export const MEAL_TYPES = [
  "Desayuno",
  "Almuerzo",
  "Merienda",
  "Cena",
  "Pre-entreno",
  "Post-entreno",
  "Snack",
];

export const EATING_REASONS_CONFIG = [
  { id: "hunger", label: "Hambre física", icon: HeartPulse, desc: "Señal somática real de necesidad energética" },
  { id: "schedule", label: "Horario habitual", icon: Clock, desc: "Pauta biológica o rutina horaria del día" },
  { id: "social", label: "Social / Compartir", icon: Users, desc: "Comensalidad, amigos, familia o evento social" },
  { id: "craving", label: "Antojo / Placer", icon: Sparkles, desc: "Disfrute sensorial o deseo puntual consciente" },
  { id: "stress", label: "Estrés / Emocional", icon: Wind, desc: "Tensión, sobrecarga o búsqueda de calma" },
  { id: "convenience", label: "Prisa / Rutina", icon: Timer, desc: "Poco tiempo, practicidad o resolución rápida" },
];

export const POSTPRANDIAL_SYMPTOMS = [
  { id: "energia", label: "Con energía", icon: Zap },
  { id: "ligero", label: "Ligero / Óptimo", icon: Sparkles },
  { id: "somnolencia", label: "Somnolencia", icon: Moon },
  { id: "pesadez", label: "Pesadez / Hinchazón", icon: Activity },
  { id: "reflujo", label: "Reflujo / Acidez", icon: Flame },
];

// Helper: Contextual Meal Type and Timing Inference
export function inferContextualMealType(timelineItems?: any[]): {
  mealType: string;
  contextTag: string;
  isPreWorkout: boolean;
  isPostWorkout: boolean;
  isNightWindow: boolean;
} {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const dateStr = now.toISOString().split("T")[0];

  let isPreWorkout = false;
  let isPostWorkout = false;

  // 1. Check recent activity in timeline (within past 150 min)
  if (timelineItems && Array.isArray(timelineItems)) {
    for (const item of timelineItems) {
      if (item && item.date === dateStr) {
        const isActivity =
          item.type === "activity" || item.type === "gym_session" || item.type === "class_session";
        if (isActivity && item.time) {
          const match = item.time.match(/(\d{1,2}):(\d{2})/);
          if (match) {
            const itemMin = parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
            const diff = currentMinutes - itemMin;
            if (diff >= 0 && diff <= 150) {
              isPostWorkout = true;
              break;
            }
          }
        }
      }
    }
  }

  // 2. Check scheduled upcoming class (within next 120 min)
  if (typeof window !== "undefined") {
    try {
      const res = JSON.parse(localStorage.getItem("shakerfy_user_reservations") || "[]");
      if (Array.isArray(res)) {
        for (const r of res) {
          if (r && r.time) {
            const match = r.time.match(/(\d{1,2}):(\d{2})/);
            if (match) {
              const resMin = parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
              const untilClass = resMin - currentMinutes;
              if (untilClass >= 0 && untilClass <= 120) {
                isPreWorkout = true;
                break;
              }
            }
          }
        }
      }
    } catch (_) {}
  }

  const isNightWindow = currentMinutes >= 21 * 60 + 30 || currentMinutes < 5 * 60;

  if (isPreWorkout) {
    return {
      mealType: "Pre-entreno",
      contextTag: "Ventana Pre-Entreno",
      isPreWorkout: true,
      isPostWorkout: false,
      isNightWindow,
    };
  }

  if (isPostWorkout) {
    return {
      mealType: "Post-entreno",
      contextTag: "Ventana Post-Entreno",
      isPreWorkout: false,
      isPostWorkout: true,
      isNightWindow,
    };
  }

  // Solar & Circadian Windows
  if (currentMinutes >= 5 * 60 && currentMinutes < 11 * 60 + 30) {
    return {
      mealType: "Desayuno",
      contextTag: "Activación Matutina",
      isPreWorkout: false,
      isPostWorkout: false,
      isNightWindow: false,
    };
  }
  if (currentMinutes >= 11 * 60 + 30 && currentMinutes < 15 * 60 + 30) {
    return {
      mealType: "Almuerzo",
      contextTag: "Cenit / Mediodía Solar",
      isPreWorkout: false,
      isPostWorkout: false,
      isNightWindow: false,
    };
  }
  if (currentMinutes >= 15 * 60 + 30 && currentMinutes < 19 * 60 + 30) {
    return {
      mealType: "Merienda",
      contextTag: "Recarga Vespertina",
      isPreWorkout: false,
      isPostWorkout: false,
      isNightWindow: false,
    };
  }
  if (currentMinutes >= 19 * 60 + 30 && currentMinutes < 23 * 60 + 30) {
    return {
      mealType: "Cena",
      contextTag: "Ventana Nocturna",
      isPreWorkout: false,
      isPostWorkout: false,
      isNightWindow: true,
    };
  }

  return {
    mealType: "Snack",
    contextTag: "Colación Nocturna",
    isPreWorkout: false,
    isPostWorkout: false,
    isNightWindow: true,
  };
}

// Helper: Contextual Natural Language AI Insight (Cumple las 11 Reglas de Oro de Nutrition Intelligence)
export function generateContextualAiInsight(params: {
  baseNarrative?: string;
  isPreWorkout: boolean;
  isPostWorkout: boolean;
  isNightWindow: boolean;
  bioScore: number;
  eatingReason?: "rutina" | "social" | "placer" | "confort";
}): string {
  const { baseNarrative, isPreWorkout, isPostWorkout, isNightWindow, bioScore, eatingReason = "rutina" } = params;

  // Regla 6: Subordinación y adaptación empática según la categoría situacional elegida
  if (eatingReason === "social") {
    return `Compartir la mesa en buena compañía ayuda a reducir el estrés y favorece una mejor asimilación digestiva. Disfrutá el momento: recordá que el bienestar se construye en el balance de toda la semana, no en una comida puntual. Acompañar con agua fresca mantendrá tu confort digestivo.`;
  }

  if (eatingReason === "placer") {
    return `Un gusto para disfrutar sin apuro. Al aportar energía de absorción rápida, podés priorizar fuentes de fibra y alimentos frescos en tus próximas comidas para acompañar el equilibrio del día.`;
  }

  if (eatingReason === "confort") {
    return `Un plato elegido para brindar calma y abrigo. Comer sin prisa y regalarte un minuto de respiración tranquila al terminar ayudará a tu cuerpo a descansar y digerir con total ligereza.`;
  }

  // Categoría "Rutina" (por defecto) combinada con contexto biológico y Reglas 1, 2 y 4
  if (isPreWorkout) {
    return `Detectamos una sesión de entrenamiento próxima en tu agenda. Este plato aporta una base práctica; para que la energía se libere de forma progresiva durante el movimiento, podés acompañarlo con agua fresca o una porción de fruta.`;
  }

  if (isPostWorkout) {
    return `Registrado después de tu actividad física: los nutrientes de este plato apoyan la recuperación muscular y reponen energía. Acompañar con hidratación de apoyo favorecerá tu descanso posterior.`;
  }

  if (isNightWindow) {
    return `Para el cierre del día, acompañar este plato con una infusión tibia sin cafeína y comer a un ritmo pausado ayudará a lograr una digestión liviana y un descanso nocturno reparador.`;
  }

  if (bioScore < 60) {
    return `Este plato aporta energía de absorción rápida para tu rutina. Para lograr una liberación más progresiva y prolongar tu saciedad, una gran opción es sumar una porción de fibra vegetal o proteína (como vegetales frescos, huevo o unos frutos secos).`;
  }

  return (
    baseNarrative ||
    `Para lograr un plato equilibrado en tu rutina y sostener tu saciedad por más tiempo, combinar fuentes de proteína con fibra vegetal e hidratación de apoyo mantiene tu energía estable a lo largo del día.`
  );
}

// Helper: Calidad Nutricional para el Hero Widget (5 niveles evaluados desde los 7 Vectores y NOVA)
export function getScanQualityProfile({
  score,
  mealTitle,
  mealNarrative,
  vectorBadges = [],
  totalProtein = 0,
  totalFiber = 0,
  totalFat = 0,
  totalCarbs = 0,
}: {
  score: number;
  mealTitle: string;
  mealNarrative?: string;
  vectorBadges?: NutritionVectorBadge[];
  totalProtein?: number;
  totalFiber?: number;
  totalFat?: number;
  totalCarbs?: number;
}): {
  label: "Pobre" | "Bajo" | "Regular" | "Bueno" | "Excelente";
  level: 1 | 2 | 3 | 4 | 5;
} {
  const text = `${mealTitle} ${mealNarrative || ""}`.toLowerCase();

  // Mapear los 7 vectores nutricionales
  const badgeMap = new Map<string, string>();
  vectorBadges.forEach((b) => badgeMap.set(b.category, (b.badgeText || "").toLowerCase()));

  const processing = badgeMap.get("processing") || "";
  const fiber = badgeMap.get("fiber") || "";
  const protein = badgeMap.get("protein") || "";
  const sugar = badgeMap.get("sugar") || "";
  const fat = badgeMap.get("fat") || "";
  const carbs = badgeMap.get("carbs") || badgeMap.get("grains") || "";

  const isUltraProcessed =
    processing.includes("ultra") ||
    /caramelo|golosina|sour patch|snack|gaseosa|refresco|chucher|donuts/i.test(text);

  const isProcessedOrFried =
    processing.includes("moderadamente") ||
    processing.includes("procesad") ||
    /papas fritas|facturas|cheeseburger|dulce|croissant|fritura/i.test(text);

  const hasAddedSugar =
    sugar.includes("añadid") ||
    sugar.includes("azúcar") ||
    sugar.includes("elevad") ||
    /azúcar|dulce|miel|jarabe|sirope/i.test(text);

  const hasHealthyFats =
    fat.includes("saludable") ||
    fat.includes("omega") ||
    fat.includes("palta") ||
    fat.includes("chía") ||
    fat.includes("oliva") ||
    /salmón|salmon|palta|aguacate|nuez|almendra|chía|oliva/i.test(text);

  const hasHighQualityProtein =
    protein.includes("magra y completa") ||
    protein.includes("alta calidad") ||
    protein.includes("magra") ||
    protein.includes("alto en proteína") ||
    totalProtein >= 22 ||
    /pechuga|pollo|pescado|huevo|tofu|lenteja|garbanzo/i.test(text);

  const hasHighFiber =
    fiber.includes("buena fuente") ||
    fiber.includes("alto en fibra") ||
    totalFiber >= 3.5 ||
    carbs.includes("complejos") ||
    carbs.includes("entero") ||
    /quinoa|avena|integral|brócoli|espinaca|legumbre/i.test(text);

  // 1. POBRE (Nivel 1): Azúcar simple / Ultraprocesado / Mínima fibra y proteína
  if (
    (isUltraProcessed && hasAddedSugar) ||
    (hasAddedSugar && totalProtein < 8 && totalFiber < 2) ||
    score < 40
  ) {
    return { label: "Pobre", level: 1 };
  }

  // 2. BAJO (Nivel 2): Alta densidad calórica (harinas/grasas refinadas) con fibra y proteína bajas
  if (
    isProcessedOrFried ||
    (totalCarbs > 40 && totalProtein < 12 && totalFiber < 3) ||
    (totalFat > 20 && !hasHealthyFats && totalFiber < 2) ||
    score < 58
  ) {
    return { label: "Bajo", level: 2 };
  }

  // 5. EXCELENTE (Nivel 5): Alimento entero/sin procesar + Proteína completa + Grasas nobles + Fibra + Sin azúcar añadido
  const isMinimallyProcessed =
    processing.includes("mínimamente") ||
    processing.includes("sin procesar") ||
    !isUltraProcessed;

  if (
    isMinimallyProcessed &&
    hasHighQualityProtein &&
    hasHealthyFats &&
    hasHighFiber &&
    !hasAddedSugar &&
    score >= 82
  ) {
    return { label: "Excelente", level: 5 };
  }

  // 4. BUENO (Nivel 4): Mínimamente procesado, alta en fibra/vegetales y buena proteína
  if (
    isMinimallyProcessed &&
    (hasHighFiber || hasHighQualityProtein) &&
    !hasAddedSugar &&
    score >= 70
  ) {
    return { label: "Bueno", level: 4 };
  }

  // 3. REGULAR (Nivel 3): Comida estándar equilibrada de día a día
  return { label: "Regular", level: 3 };
}
