import React, { useState } from "react";
import { Sparkles, Activity, Check, RotateCcw, ArrowRight, ShieldCheck, ChevronLeft } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  useNutritionSettings,
  NutritionMode,
  AthleteGoal,
  ATHLETE_GOAL_OPTIONS,
  getRecommendedRanges,
  getRecommendedTargets,
  type NutritionTargets,
} from "@/lib/nutrition-settings";

interface NutritionCalibrationViewProps {
  onComplete: () => void;
  onCancel?: () => void;
  title?: string;
  subtitle?: string;
}

export function NutritionCalibrationView({
  onComplete,
  onCancel,
  title = "Calibra tu Nutrición Inteligente",
  subtitle = "Elige tu enfoque de alimentación y personaliza tus objetivos con rigor científico.",
}: NutritionCalibrationViewProps) {
  const {
    settings,
    athleteGoal: savedAthleteGoal,
    updateSettings,
    userWeight,
    recommendedTargets: baseRecommendedTargets,
    recommendedRanges: baseRecommendedRanges,
    effectiveTargets,
  } = useNutritionSettings();

  // Step 1: Mode selection ("wellness" | "athlete")
  const [selectedMode, setSelectedMode] = useState<NutritionMode>(settings.mode || "wellness");

  // Step 2: Athlete Training Phase / Goal ("definition" | "performance" | "hypertrophy")
  const [selectedGoal, setSelectedGoal] = useState<AthleteGoal>(
    settings.athleteGoal || savedAthleteGoal || "performance"
  );

  // Dynamic ranges and targets for the currently selected goal
  const activeRanges = getRecommendedRanges(userWeight, selectedGoal);
  const activeRecommendedTargets = getRecommendedTargets(userWeight, selectedGoal);
  const activeGoalConfig =
    ATHLETE_GOAL_OPTIONS.find((g) => g.id === selectedGoal) || ATHLETE_GOAL_OPTIONS[1];

  // Target format ("ranges" | "custom")
  const [athleteFormat, setAthleteFormat] = useState<"ranges" | "custom">(
    settings.customTargetsEnabled ? "custom" : "ranges"
  );

  const [calories, setCalories] = useState<number>(
    settings.customCalories && settings.customCalories > 0
      ? settings.customCalories
      : activeRecommendedTargets.calories
  );
  const [protein, setProtein] = useState<number>(
    settings.customProtein && settings.customProtein > 0
      ? settings.customProtein
      : activeRecommendedTargets.protein
  );
  const [carbs, setCarbs] = useState<number>(
    settings.customCarbs && settings.customCarbs > 0
      ? settings.customCarbs
      : activeRecommendedTargets.carbs
  );
  const [fat, setFat] = useState<number>(
    settings.customFat && settings.customFat > 0
      ? settings.customFat
      : activeRecommendedTargets.fat
  );

  // Subtle haptics
  const triggerHaptic = () => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(15);
      } catch (_) {}
    }
  };

  const handleSelectMode = (mode: NutritionMode) => {
    triggerHaptic();
    setSelectedMode(mode);
  };

  const handleSelectGoal = (goal: AthleteGoal) => {
    triggerHaptic();
    setSelectedGoal(goal);
    const newTargets = getRecommendedTargets(userWeight, goal);
    setCalories(newTargets.calories);
    setProtein(newTargets.protein);
    setCarbs(newTargets.carbs);
    setFat(newTargets.fat);
  };

  const handleSelectFormat = (format: "ranges" | "custom") => {
    triggerHaptic();
    setAthleteFormat(format);
  };

  const handleResetToRecommended = () => {
    triggerHaptic();
    setCalories(activeRecommendedTargets.calories);
    setProtein(activeRecommendedTargets.protein);
    setCarbs(activeRecommendedTargets.carbs);
    setFat(activeRecommendedTargets.fat);
    toast.info("Valores de sliders restablecidos a la recomendación de la fase");
  };

  const handleSliderChange = (
    field: "calories" | "protein" | "carbs" | "fat",
    value: number
  ) => {
    if (field === "calories") {
      setCalories(value);
    } else if (field === "protein") {
      setProtein(value);
    } else if (field === "carbs") {
      setCarbs(value);
    } else if (field === "fat") {
      setFat(value);
    }
  };

  const handleSaveAndFinish = () => {
    triggerHaptic();

    if (selectedMode === "wellness") {
      updateSettings({
        mode: "wellness",
        customTargetsEnabled: false,
      });
      toast.success("Modo Bienestar activado", {
        description: "Enfoque cualitativo, perfil nutricional y nutrición consciente.",
      });
    } else {
      const useCustom = athleteFormat === "custom";
      updateSettings({
        mode: "athlete",
        athleteGoal: selectedGoal,
        customTargetsEnabled: useCustom,
        customCalories: useCustom ? calories : activeRecommendedTargets.calories,
        customProtein: useCustom ? protein : activeRecommendedTargets.protein,
        customCarbs: useCustom ? carbs : activeRecommendedTargets.carbs,
        customFat: useCustom ? fat : activeRecommendedTargets.fat,
      });
      const goalLabel =
        selectedGoal === "definition"
          ? "Definición"
          : selectedGoal === "hypertrophy"
            ? "Hipertrofia"
            : "Rendimiento";
      toast.success(`Modo Atleta • ${goalLabel} configurado`, {
        description: useCustom
          ? `Metas fijas personalizadas: ${calories} kcal (${protein}g P / ${carbs}g C / ${fat}g G)`
          : `Rangos activos (${activeRanges.protein[0]}–${activeRanges.protein[1]}g P / ${activeRanges.calories[0]}–${activeRanges.calories[1]} kcal).`,
      });
    }

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("shakerfy_nutrition_onboarding_completed", "true");
        localStorage.setItem("shakerfy_nutrition_intelligence_active", "true");
      } catch (_) {}
    }

    onComplete();
  };

  // Macro math for athlete view
  const isCustomizing = athleteFormat === "custom";
  const protKcal = protein * 4;
  const carbsKcal = carbs * 4;
  const fatKcal = fat * 9;
  const sumKcal = protKcal + carbsKcal + fatKcal;
  const effectiveCal = isCustomizing ? calories : activeRecommendedTargets.calories;

  const protPct = Math.round((protKcal / (sumKcal || 1)) * 100);
  const carbsPct = Math.round((carbsKcal / (sumKcal || 1)) * 100);
  const fatPct = Math.max(0, 100 - protPct - carbsPct);

  return (
    <div className="w-full max-w-lg mx-auto space-y-5 text-left animate-fade-in pb-10">
      {/* Header */}
      <div className="space-y-1">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border border-border bg-card hover:bg-secondary text-xs font-semibold text-foreground transition cursor-pointer mb-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Volver
          </button>
        )}

        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Nutrición Consciente (Modo Bienestar)
        </h1>
        <p className="text-xs text-muted-foreground">
          Enfoque diseñado para acompañarte con calma, saciedad y energía sostenida.
        </p>
      </div>

      {/* Contenido Modo Bienestar */}
      <div className="p-4 rounded-3xl border border-border/60 bg-card/60 flex items-center gap-3.5 animate-in fade-in duration-200">
        <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="space-y-0.5">
          <span className="text-xs font-bold text-foreground block">Nutrición Consciente Activada</span>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Enfocado en calidad biológica, saciedad somática, porciones de mano y perfil nutricional sin conteo calórico.
          </p>
        </div>
      </div>

      {/* Action CTA Button */}
      <div className="pt-2">
        <Button
          type="button"
          onClick={handleSaveAndFinish}
          className="w-full h-11 rounded-2xl text-xs font-bold uppercase tracking-wider bg-foreground text-background hover:bg-foreground/90 transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2"
        >
          <span>Continuar</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
