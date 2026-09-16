import { useState, useEffect, useCallback } from "react";

export type NutritionMode = "wellness" | "athlete";

export type AthleteGoal = "definition" | "performance" | "hypertrophy";

export interface NutritionTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

export interface NutritionSettings {
  /**
   * Modo activo:
   * - "wellness": Enfoque cualitativo, perfil nutricional, sin conteo obsesivo ni culpa (predeterminado).
   * - "athlete": Enfoque cuantitativo con calorías y desglose exacto de macros en gramos.
   */
  mode: NutritionMode;
  /**
   * Foco fisiológico / Fase de entrenamiento (Modo Atleta):
   * - "definition": Déficit controlado, mayor proteína para retención muscular (23-26 kcal/kg, 1.8-2.4 g/kg P)
   * - "performance": Normocalórica, balance somático y energía sostenida (26-30 kcal/kg, 1.6-2.0 g/kg P)
   * - "hypertrophy": Superávit limpio, mayor combustible y síntesis proteica (31-35 kcal/kg, 1.6-2.2 g/kg P, 3.6-4.8 g/kg C)
   */
  athleteGoal?: AthleteGoal;
  /**
   * Si está habilitada la personalización manual de calorías y macros.
   */
  customTargetsEnabled: boolean;
  /**
   * Valores personalizados si customTargetsEnabled es true.
   */
  customCalories?: number;
  customProtein?: number;
  customCarbs?: number;
  customFat?: number;
}

const STORAGE_KEY = "shakerfy_nutrition_settings";
const SETTINGS_EVENT = "shakerfy_nutrition_settings_updated";

export const DEFAULT_NUTRITION_SETTINGS: NutritionSettings = {
  mode: "wellness",
  athleteGoal: "performance",
  customTargetsEnabled: false,
};

export interface AthleteGoalOption {
  id: AthleteGoal;
  title: string;
  subtitle: string;
  description: string;
  kcalTag: string;
  protTag: string;
  carbsTag: string;
  fatTag: string;
}

export const ATHLETE_GOAL_OPTIONS: AthleteGoalOption[] = [
  {
    id: "definition",
    title: "Definición",
    subtitle: "Retención Magra",
    description: "Déficit controlado para optimizar porcentaje graso protegiendo la masa muscular activa.",
    kcalTag: "23 – 26 kcal/kg",
    protTag: "1.8 – 2.4 g/kg",
    carbsTag: "2.0 – 2.8 g/kg",
    fatTag: "0.7 – 0.9 g/kg",
  },
  {
    id: "performance",
    title: "Rendimiento",
    subtitle: "Balance Somático",
    description: "Normocalórica para recuperación atlética, energía sostenida y equilibrio metabólico.",
    kcalTag: "26 – 30 kcal/kg",
    protTag: "1.6 – 2.0 g/kg",
    carbsTag: "2.8 – 3.4 g/kg",
    fatTag: "0.8 – 1.0 g/kg",
  },
  {
    id: "hypertrophy",
    title: "Hipertrofia",
    subtitle: "Fuerza y Volumen",
    description: "Superávit energético moderado para síntesis proteica miofibrilar y recarga de glucógeno.",
    kcalTag: "31 – 35 kcal/kg",
    protTag: "1.6 – 2.2 g/kg",
    carbsTag: "3.6 – 4.8 g/kg",
    fatTag: "0.8 – 1.1 g/kg",
  },
];

/**
 * Estructura de rangos biológicos recomendados [mínimo, máximo]
 */
export interface NutritionRanges {
  calories: [number, number];
  protein: [number, number];
  carbs: [number, number];
  fat: [number, number];
  fiber: [number, number];
}

/**
 * Obtiene el objetivo atlético predeterminado desde el perfil del usuario si existe.
 */
export function getUserAthleteGoal(): AthleteGoal {
  if (typeof window !== "undefined") {
    try {
      const profStr = localStorage.getItem("shakerfy_user_profile_edit");
      if (profStr) {
        const p = JSON.parse(profStr);
        if (p.goal === "musculo") return "hypertrophy";
        if (p.goal === "perder_peso") return "definition";
      }
    } catch (_) {}
  }
  return "performance";
}

/**
 * Obtiene el peso registrado del usuario en su perfil local, o 72 kg por defecto.
 */
export function getUserWeight(): number {
  if (typeof window !== "undefined") {
    try {
      const directWeight = localStorage.getItem("user_weight");
      if (directWeight) {
        const parsed = Number(directWeight);
        if (!isNaN(parsed) && parsed > 0) return parsed;
      }
      const profStr = localStorage.getItem("shakerfy_user_profile_edit");
      if (profStr) {
        const p = JSON.parse(profStr);
        if (p.weight) {
          const parsed = Number(p.weight);
          if (!isNaN(parsed) && parsed > 0) return parsed;
        }
      }
    } catch (_) {}
  }
  return 72;
}

/**
 * Calcula los rangos biológicos recomendados bajo evidencia científica deportiva (Target Ranges)
 * según el peso y la fase/objetivo fisiológico del atleta:
 * - "definition": Déficit moderado (~23-26 kcal/kg), alta proteína blindaje (~1.8-2.4 g/kg), carbos moderados (~2.0-2.8 g/kg)
 * - "hypertrophy": Superávit limpio (~31-35 kcal/kg), proteína hipertrofia (~1.6-2.2 g/kg), altos carbos (~3.6-4.8 g/kg)
 * - "performance": Normocalórica (~26-30 kcal/kg), balance magro (~1.6-2.0 g/kg), energía versátil (~2.8-3.4 g/kg)
 */
export function getRecommendedRanges(weight?: number, goal?: AthleteGoal): NutritionRanges {
  const w = weight || getUserWeight();
  const g = goal || "performance";

  if (g === "definition") {
    return {
      calories: [Math.round(w * 23), Math.round(w * 26)],
      protein: [Math.round(w * 1.8), Math.round(w * 2.4)],
      carbs: [Math.round(w * 2.0), Math.round(w * 2.8)],
      fat: [Math.round(w * 0.7), Math.round(w * 0.9)],
      fiber: [26, 34],
    };
  }

  if (g === "hypertrophy") {
    return {
      calories: [Math.round(w * 31), Math.round(w * 35)],
      protein: [Math.round(w * 1.6), Math.round(w * 2.2)],
      carbs: [Math.round(w * 3.6), Math.round(w * 4.8)],
      fat: [Math.round(w * 0.8), Math.round(w * 1.1)],
      fiber: [30, 42],
    };
  }

  // "performance"
  return {
    calories: [Math.round(w * 26), Math.round(w * 30)],
    protein: [Math.round(w * 1.6), Math.round(w * 2.0)],
    carbs: [Math.round(w * 2.8), Math.round(w * 3.4)],
    fat: [Math.round(w * 0.8), Math.round(w * 1.0)],
    fiber: [28, 38],
  };
}

/**
 * Calcula el punto medio de recomendación biológica según el objetivo
 */
export function getRecommendedTargets(weight?: number, goal?: AthleteGoal): NutritionTargets {
  const ranges = getRecommendedRanges(weight, goal);
  return {
    calories: Math.round((ranges.calories[0] + ranges.calories[1]) / 2),
    protein: Math.round((ranges.protein[0] + ranges.protein[1]) / 2),
    carbs: Math.round((ranges.carbs[0] + ranges.carbs[1]) / 2),
    fat: Math.round((ranges.fat[0] + ranges.fat[1]) / 2),
    fiber: Math.round((ranges.fiber[0] + ranges.fiber[1]) / 2),
  };
}

/**
 * Obtiene los ajustes guardados de nutrición.
 */
export function getNutritionSettings(): NutritionSettings {
  if (typeof window === "undefined") return DEFAULT_NUTRITION_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_NUTRITION_SETTINGS;
    const parsed = JSON.parse(raw);
    const validGoal: AthleteGoal =
      parsed.athleteGoal === "definition" ||
      parsed.athleteGoal === "hypertrophy" ||
      parsed.athleteGoal === "performance"
        ? parsed.athleteGoal
        : getUserAthleteGoal();

    return {
      mode: parsed.mode === "athlete" ? "athlete" : "wellness",
      athleteGoal: validGoal,
      customTargetsEnabled: Boolean(parsed.customTargetsEnabled),
      customCalories: typeof parsed.customCalories === "number" ? parsed.customCalories : undefined,
      customProtein: typeof parsed.customProtein === "number" ? parsed.customProtein : undefined,
      customCarbs: typeof parsed.customCarbs === "number" ? parsed.customCarbs : undefined,
      customFat: typeof parsed.customFat === "number" ? parsed.customFat : undefined,
    };
  } catch (_) {
    return DEFAULT_NUTRITION_SETTINGS;
  }
}

/**
 * Guarda los ajustes de nutrición y dispara un evento reactivo para actualizar toda la app en tiempo real.
 */
export function saveNutritionSettings(settings: Partial<NutritionSettings>): NutritionSettings {
  const current = getNutritionSettings();
  const updated: NutritionSettings = {
    ...current,
    ...settings,
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent(SETTINGS_EVENT, { detail: updated }));
    } catch (_) {}
  }

  return updated;
}

/**
 * Obtiene las metas efectivas (ya sean las personalizadas si están activas, o las recomendadas).
 */
export function getEffectiveTargets(weight?: number, goal?: AthleteGoal): NutritionTargets {
  const settings = getNutritionSettings();
  const rec = getRecommendedTargets(weight, goal || settings.athleteGoal);

  if (settings.customTargetsEnabled) {
    return {
      calories: settings.customCalories && settings.customCalories > 0 ? settings.customCalories : rec.calories,
      protein: settings.customProtein && settings.customProtein > 0 ? settings.customProtein : rec.protein,
      carbs: settings.customCarbs && settings.customCarbs > 0 ? settings.customCarbs : rec.carbs,
      fat: settings.customFat && settings.customFat > 0 ? settings.customFat : rec.fat,
    };
  }

  return rec;
}

/**
 * Hook de React para consumir y suscribirse reactivamente a los ajustes de nutrición.
 */
export function useNutritionSettings() {
  const [settings, setSettingsState] = useState<NutritionSettings>(getNutritionSettings);
  const [userWeight, setUserWeight] = useState<number>(getUserWeight);

  useEffect(() => {
    // Sincronizar ajustes iniciales
    setSettingsState(getNutritionSettings());
    setUserWeight(getUserWeight());

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<NutritionSettings>;
      if (customEvent.detail) {
        setSettingsState(customEvent.detail);
      } else {
        setSettingsState(getNutritionSettings());
      }
      setUserWeight(getUserWeight());
    };

    window.addEventListener(SETTINGS_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(SETTINGS_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const update = useCallback((newPartial: Partial<NutritionSettings>) => {
    const saved = saveNutritionSettings(newPartial);
    setSettingsState(saved);
  }, []);

  const athleteGoal = settings.athleteGoal || "performance";
  const recommendedTargets = getRecommendedTargets(userWeight, athleteGoal);
  const recommendedRanges = getRecommendedRanges(userWeight, athleteGoal);
  const effectiveTargets = getEffectiveTargets(userWeight, athleteGoal);

  const setAthleteGoal = useCallback((goal: AthleteGoal) => {
    update({ athleteGoal: goal });
  }, [update]);

  return {
    settings,
    athleteGoal,
    setAthleteGoal,
    isAthleteMode: settings.mode === "athlete",
    isWellnessMode: settings.mode === "wellness",
    isUsingRecommendedRanges: !settings.customTargetsEnabled,
    updateSettings: update,
    userWeight,
    recommendedTargets,
    recommendedRanges,
    effectiveTargets,
  };
}
