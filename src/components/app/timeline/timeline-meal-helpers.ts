import type { FoodQualityLevel } from "@/components/food-profile-hero";
import { calculateTimingFit } from "@/lib/timing-fit";

export interface MealMacros {
  mealCalories: number;
  mealProtein: number;
  mealCarbs: number;
  mealFat: number;
  mealFiber: number;
}

export function calculateMealMacros(item: any): MealMacros {
  const mealCalories = Math.round(
    item.calories ??
      item.kcal ??
      (item.ingredients && item.ingredients.length > 0
        ? item.ingredients.reduce(
            (s: number, i: any) => s + (i.calories || 0),
            0,
          )
        : item.isAiSuggestion
          ? 420
          : 0),
  );

  const mealProtein = Math.round(
    item.protein ??
      (item.ingredients && item.ingredients.length > 0
        ? item.ingredients.reduce(
            (s: number, i: any) => s + (i.protein || 0),
            0,
          )
        : item.isAiSuggestion
          ? 32
          : 0),
  );

  const mealCarbs = Math.round(
    item.carbs ??
      item.carbohydrates ??
      (item.ingredients && item.ingredients.length > 0
        ? item.ingredients.reduce(
            (s: number, i: any) => s + (i.carbs || 0),
            0,
          )
        : item.isAiSuggestion
          ? 45
          : 0),
  );

  const mealFat = Math.round(
    item.fat ??
      (item.ingredients && item.ingredients.length > 0
        ? item.ingredients.reduce(
            (s: number, i: any) => s + (i.fat || 0),
            0,
          )
        : item.isAiSuggestion
          ? 12
          : 0),
  );

  const mealFiber = Math.round(
    item.fiber ??
      (item.ingredients && item.ingredients.length > 0
        ? item.ingredients.reduce(
            (s: number, i: any) => s + (i.fiber || 0),
            0,
          )
        : item.isAiSuggestion
          ? 8
          : 4),
  );

  return { mealCalories, mealProtein, mealCarbs, mealFat, mealFiber };
}

export function getMealQualityData(
  item: any,
  mealProtein: number,
  mealFiber: number,
) {
  const heroBadges =
    item.vectorBadges && item.vectorBadges.length > 0
      ? item.vectorBadges.slice(0, 4).map((vb: any) => ({
          id: vb.id || vb.category,
          category: vb.category,
          label: vb.badgeText || vb.label || vb.text,
        }))
      : [
          { id: "b-1", category: "processing", label: "Mínimamente procesado" },
          {
            id: "b-2",
            category: "protein",
            label: mealProtein >= 25 ? "Alta en proteína" : "Proteína moderada",
          },
          {
            id: "b-3",
            category: "fiber",
            label: mealFiber >= 4 ? "Buena fuente de fibra" : "Aporte de fibra",
          },
          { id: "b-4", category: "sugar", label: "Sin azúcar añadido" },
        ];

  const qualityLevel: FoodQualityLevel =
    (item.bioGaugeIndex as FoodQualityLevel) ??
    (item.bioScore
      ? item.bioScore >= 80
        ? 5
        : item.bioScore >= 65
          ? 4
          : item.bioScore >= 50
            ? 3
            : item.bioScore >= 35
              ? 2
              : 1
      : item.scoreGrade === "A"
        ? 5
        : item.scoreGrade === "B"
          ? 4
          : item.scoreGrade === "C"
            ? 3
            : 4);

  const qualityLabel =
    item.bioQualityLabel ||
    (qualityLevel >= 4
      ? "Alto"
      : qualityLevel === 3
        ? "Medio"
        : "Bajo");

  const fitTag = item.timingFit?.tag || item.timingFit?.label;
  const dynamicFit = !fitTag && !item.contextBadge ? calculateTimingFit(item) : null;
  const resolvedTag =
    fitTag ||
    dynamicFit?.tag ||
    (typeof item.contextBadge === "string" ? item.contextBadge : item.contextBadge?.label);
  const resolvedType =
    item.timingFit?.type || dynamicFit?.type || item.contextBadge?.type || "optimal";

  const contextBadge = resolvedTag ? { label: resolvedTag, type: resolvedType } : undefined;

  return { heroBadges, qualityLevel, qualityLabel, contextBadge };
}
