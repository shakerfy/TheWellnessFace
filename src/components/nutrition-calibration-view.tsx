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
          Calibra tu Nutrición
        </h1>
        <p className="text-xs text-muted-foreground">
          Elige tu enfoque de alimentación. Puedes modificarlo cuando lo desees.
        </p>
      </div>

      {/* Selector de Modo: Segmented Minimalista */}
      <div className="grid grid-cols-2 gap-1.5 p-1 bg-secondary/40 rounded-2xl border border-border/50">
        <button
          type="button"
          onClick={() => handleSelectMode("wellness")}
          className={cn(
            "py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer select-none",
            selectedMode === "wellness"
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          <span>Modo Bienestar</span>
        </button>
        <button
          type="button"
          onClick={() => handleSelectMode("athlete")}
          className={cn(
            "py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer select-none",
            selectedMode === "athlete"
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Activity className="w-3.5 h-3.5 text-amber-500" />
          <span>Modo Atleta</span>
        </button>
      </div>

      {/* Contenido según modo */}
      {selectedMode === "wellness" ? (
        <div className="p-4 rounded-3xl border border-border/60 bg-card/60 flex items-center gap-3.5 animate-in fade-in duration-200">
          <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-foreground block">Nutrición Consciente Activada</span>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Enfocado en calidad biológica, saciedad somática y perfil nutricional sin conteo calórico.
            </p>
          </div>
        </div>
      ) : (
        /* MODO ATLETA: MINIMALISTA Y SOFISTICADO */
        <div className="border border-border bg-card rounded-3xl p-4 sm:p-5 space-y-4 animate-in fade-in duration-200">
          {/* Fase Deportiva */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <span>Fase</span>
              <span className="font-mono text-[10px] text-foreground/70 lowercase">{activeGoalConfig.kcalTag}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-secondary/40 rounded-2xl border border-border/40">
              {ATHLETE_GOAL_OPTIONS.map((g) => {
                const isSelected = selectedGoal === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => handleSelectGoal(g.id)}
                    className={cn(
                      "py-2 px-2 rounded-xl text-xs font-semibold transition-all text-center cursor-pointer select-none",
                      isSelected
                        ? "bg-background text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {g.title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Formato: Rangos vs Sliders */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <span>Formato</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-secondary/40 rounded-2xl border border-border/40">
              <button
                type="button"
                onClick={() => handleSelectFormat("ranges")}
                className={cn(
                  "py-2 px-3 rounded-xl text-xs font-semibold transition-all text-center cursor-pointer select-none",
                  athleteFormat === "ranges"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Rangos Recomendados
              </button>
              <button
                type="button"
                onClick={() => handleSelectFormat("custom")}
                className={cn(
                  "py-2 px-3 rounded-xl text-xs font-semibold transition-all text-center cursor-pointer select-none",
                  athleteFormat === "custom"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Valores Fijos
              </button>
            </div>
          </div>

          {/* Vista de Metas */}
          {athleteFormat === "ranges" ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 animate-in fade-in duration-150">
              <div className="p-3 rounded-2xl bg-secondary/25 border border-border/40 space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Calorías</span>
                <span className="text-base font-black font-mono tabular-nums text-foreground block">
                  {activeRanges.calories[0]}–{activeRanges.calories[1]}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground block">kcal</span>
              </div>
              <div className="p-3 rounded-2xl bg-secondary/25 border border-border/40 space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">Proteína</span>
                <span className="text-base font-black font-mono tabular-nums text-foreground block">
                  {activeRanges.protein[0]}–{activeRanges.protein[1]}g
                </span>
                <span className="text-[10px] font-mono text-muted-foreground block">{activeGoalConfig.protTag}</span>
              </div>
              <div className="p-3 rounded-2xl bg-secondary/25 border border-border/40 space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">Carbos</span>
                <span className="text-base font-black font-mono tabular-nums text-foreground block">
                  {activeRanges.carbs[0]}–{activeRanges.carbs[1]}g
                </span>
                <span className="text-[10px] font-mono text-muted-foreground block">{activeGoalConfig.carbsTag}</span>
              </div>
              <div className="p-3 rounded-2xl bg-secondary/25 border border-border/40 space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 block">Grasas</span>
                <span className="text-base font-black font-mono tabular-nums text-foreground block">
                  {activeRanges.fat[0]}–{activeRanges.fat[1]}g
                </span>
                <span className="text-[10px] font-mono text-muted-foreground block">{activeGoalConfig.fatTag}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5 pt-1 animate-in fade-in duration-150">
              {/* Macro breakdown bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-muted-foreground">Distribución:</span>
                  <span className="font-bold text-foreground">
                    {protPct}% P • {carbsPct}% C • {fatPct}% G
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden flex">
                  <div style={{ width: `${protPct}%` }} className="bg-emerald-600 transition-all duration-200" />
                  <div style={{ width: `${carbsPct}%` }} className="bg-amber-500 transition-all duration-200" />
                  <div style={{ width: `${fatPct}%` }} className="bg-sky-500 transition-all duration-200" />
                </div>
              </div>

              {/* Sliders compactos */}
              <div className="space-y-2.5">
                <div className="space-y-1.5 p-3 rounded-2xl bg-secondary/20 border border-border/40">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">Calorías</span>
                    <span className="font-bold font-mono">{calories} kcal</span>
                  </div>
                  <Slider
                    value={[calories]}
                    onValueChange={([val]) => handleSliderChange("calories", val)}
                    min={1200}
                    max={4200}
                    step={25}
                    className="cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5 p-3 rounded-2xl bg-secondary/20 border border-border/40">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">Proteína</span>
                    <span className="font-bold font-mono">{protein} g</span>
                  </div>
                  <Slider
                    value={[protein]}
                    onValueChange={([val]) => handleSliderChange("protein", val)}
                    min={50}
                    max={260}
                    step={5}
                    className="cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5 p-3 rounded-2xl bg-secondary/20 border border-border/40">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-amber-600 dark:text-amber-400">Carbohidratos</span>
                    <span className="font-bold font-mono">{carbs} g</span>
                  </div>
                  <Slider
                    value={[carbs]}
                    onValueChange={([val]) => handleSliderChange("carbs", val)}
                    min={60}
                    max={500}
                    step={5}
                    className="cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5 p-3 rounded-2xl bg-secondary/20 border border-border/40">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-sky-600 dark:text-sky-400">Grasas</span>
                    <span className="font-bold font-mono">{fat} g</span>
                  </div>
                  <Slider
                    value={[fat]}
                    onValueChange={([val]) => handleSliderChange("fat", val)}
                    min={25}
                    max={150}
                    step={2}
                    className="cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-0.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleResetToRecommended}
                  className="text-[11px] text-muted-foreground hover:text-foreground h-7 px-2 cursor-pointer gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Restablecer
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

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
