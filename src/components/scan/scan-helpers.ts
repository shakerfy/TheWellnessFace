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


