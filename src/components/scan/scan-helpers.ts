import { MealIngredientItem } from "@/lib/scan-data";

/**
 * Parses user-entered freeform food note lines into structured MealIngredientItem objects.
 */
export function parseFoodNotesToIngredients(itemsToAnalyze: string[]): MealIngredientItem[] {
  return itemsToAnalyze.map((text, idx) => {
    const lower = text.toLowerCase();
    let name = text;
    let category: MealIngredientItem["category"] = "carbs";
    let grams = 100;
    let cal = 120;
    let prot = 4;
    let carbs = 20;
    let fat = 2;
    let fiber = 2;

    if (lower.includes("huevo")) {
      const qtyMatch = lower.match(/(\d+)/);
      const qty = qtyMatch ? parseInt(qtyMatch[1], 10) : 2;
      name = `Huevos Enteros (${qty}u)`;
      category = "protein";
      grams = qty * 50;
      prot = qty * 6;
      fat = qty * 5;
      carbs = Math.round(qty * 0.4);
      fiber = 0;
      cal = qty * 70;
    } else if (lower.includes("tostada") || lower.includes("pan")) {
      const qtyMatch = lower.match(/(\d+)/);
      const qty = qtyMatch ? parseInt(qtyMatch[1], 10) : 2;
      name = `Tostadas Integrales (${qty}u)`;
      category = "carbs";
      grams = qty * 30;
      prot = qty * 3;
      carbs = qty * 15;
      fat = qty * 1;
      fiber = qty * 2;
      cal = qty * 80;
    } else if (lower.includes("naranja") || lower.includes("jugo")) {
      name = "Jugo de Naranja Natural (250ml)";
      category = "fruits";
      grams = 250;
      prot = 1.7;
      carbs = 26;
      fat = 0.5;
      fiber = 0.5;
      cal = 112;
    } else if (lower.includes("almendra") || lower.includes("nuez") || lower.includes("fruto seco")) {
      const gramsMatch = lower.match(/(\d+)\s*g/);
      const g = gramsMatch ? parseInt(gramsMatch[1], 10) : 20;
      name = `Almendras Tostadas (${g}g)`;
      category = "fats";
      grams = g;
      prot = Math.round(g * 0.21 * 10) / 10;
      fat = Math.round(g * 0.5 * 10) / 10;
      carbs = Math.round(g * 0.22 * 10) / 10;
      fiber = Math.round(g * 0.12 * 10) / 10;
      cal = Math.round(g * 5.8);
    } else if (lower.includes("manzana") || lower.includes("fruta")) {
      name = "Manzana Roja Fresca (1u)";
      category = "fruits";
      grams = 180;
      prot = 0.5;
      carbs = 25;
      fat = 0.3;
      fiber = 4.4;
      cal = 95;
    } else if (lower.includes("pollo") || lower.includes("carne") || lower.includes("bife")) {
      name = "Pechuga de Pollo a la Plancha";
      category = "protein";
      grams = 150;
      prot = 36;
      carbs = 0;
      fat = 4;
      fiber = 0;
      cal = 185;
    } else if (lower.includes("arroz") || lower.includes("pasta") || lower.includes("fideos")) {
      name = "Arroz Blanco Cocido";
      category = "carbs";
      grams = 150;
      prot = 4;
      carbs = 42;
      fat = 0.5;
      fiber = 0.6;
      cal = 195;
    } else if (lower.includes("palta") || lower.includes("aguacate")) {
      name = "Palta Hass Fresca";
      category = "fats";
      grams = 70;
      prot = 1.4;
      carbs = 6;
      fat = 10.5;
      fiber = 4.7;
      cal = 112;
    } else if (lower.includes("yogur") || lower.includes("leche")) {
      name = "Yogur Griego Natural";
      category = "dairy";
      grams = 150;
      prot = 15;
      carbs = 5.5;
      fat = 1;
      fiber = 0;
      cal = 90;
    } else if (lower.includes("cafe") || lower.includes("café")) {
      name = "Café Expreso Sin Azúcar";
      category = "carbs";
      grams = 100;
      prot = 0.2;
      carbs = 0.5;
      fat = 0.1;
      fiber = 0;
      cal = 5;
    }

    return {
      id: `note-item-${idx}-${Date.now()}`,
      name,
      category,
      grams,
      calories: cal,
      protein: prot,
      carbs,
      fat,
      fiber,
      calPer100g: Math.round((cal / grams) * 100),
      pPer100g: Math.round((prot / grams) * 100 * 10) / 10,
      cPer100g: Math.round((carbs / grams) * 100 * 10) / 10,
      fPer100g: Math.round((fat / grams) * 100 * 10) / 10,
      fiberPer100g: Math.round((fiber / grams) * 100 * 10) / 10,
    };
  });
}

/**
 * Parses a natural language AI correction prompt (e.g. "sin arroz", "doble porción", "con 150g pollo").
 */
export function parseAiPromptAction(rawPrompt: string):
  | { type: "remove"; targetWord: string }
  | { type: "double" }
  | { type: "half" }
  | { type: "add"; item: MealIngredientItem } {
  const raw = rawPrompt.trim();
  const lower = raw.toLowerCase();

  if (lower.startsWith("sin ") || lower.startsWith("quitar ") || lower.startsWith("eliminar ")) {
    const targetWord = lower.replace(/^(sin|quitar|eliminar)\s+/i, "").trim();
    return { type: "remove", targetWord };
  }
  if (lower.includes("doble") || lower.includes("double")) {
    return { type: "double" };
  }
  if (lower.includes("mitad") || lower.includes("media porción") || lower.includes("media porcion")) {
    return { type: "half" };
  }

  const gramsMatch = lower.match(/(\d+)\s*g/);
  const customGrams = gramsMatch ? parseInt(gramsMatch[1], 10) : 80;
  const cleanName =
    raw
      .replace(/^(con|agregar|sumar|extra|más|mas)\s+/i, "")
      .replace(/\b\d+\s*g\b/i, "")
      .trim() || raw;

  let cal100 = 150;
  let p100 = 8;
  let c100 = 15;
  let f100 = 5;
  let fib100 = 2;
  let cat: MealIngredientItem["category"] = "carbs";

  if (/pollo|carne|bife|at[uú]n|pescado|pavo|whey|prote[ií]na/.test(lower)) {
    cat = "protein";
    cal100 = 165;
    p100 = 28;
    c100 = 1;
    f100 = 4;
    fib100 = 0;
  } else if (/huevo/.test(lower)) {
    cat = "protein";
    cal100 = 143;
    p100 = 12.6;
    c100 = 0.7;
    f100 = 9.5;
    fib100 = 0;
  } else if (/aceite|palta|aguacate|nuez|almendra|man[ií]|manteca/.test(lower)) {
    cat = "fats";
    cal100 = /aceite/.test(lower) ? 884 : 220;
    p100 = /aceite/.test(lower) ? 0 : 4;
    c100 = /aceite/.test(lower) ? 0 : 8;
    f100 = /aceite/.test(lower) ? 100 : 20;
    fib100 = /aceite/.test(lower) ? 0 : 5;
  } else if (/ensalada|verdura|br[oó]coli|espinaca|tomate/.test(lower)) {
    cat = "veggies";
    cal100 = 32;
    p100 = 2.2;
    c100 = 5;
    f100 = 0.4;
    fib100 = 2.8;
  }

  const factor = customGrams / 100;
  const item: MealIngredientItem = {
    id: `custom-ai-${Date.now()}`,
    name: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
    category: cat,
    grams: customGrams,
    calories: Math.round(cal100 * factor),
    protein: Math.round(p100 * factor * 10) / 10,
    carbs: Math.round(c100 * factor * 10) / 10,
    fat: Math.round(f100 * factor * 10) / 10,
    fiber: Math.round(fib100 * factor * 10) / 10,
    calPer100g: cal100,
    pPer100g: p100,
    cPer100g: c100,
    fPer100g: f100,
    fiberPer100g: fib100,
  };

  return { type: "add", item };
}
