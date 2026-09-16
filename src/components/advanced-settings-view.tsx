import React, { useState } from "react";
import { ChevronLeft, Sliders, Sparkles, Activity, RotateCcw, Check, Info, ShieldCheck } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  useNutritionSettings,
  NutritionMode,
  AthleteGoal,
  ATHLETE_GOAL_OPTIONS,
  getRecommendedTargets,
  type NutritionTargets,
} from "@/lib/nutrition-settings";

interface AdvancedSettingsViewProps {
  onBack: () => void;
}

export function AdvancedSettingsView({ onBack }: AdvancedSettingsViewProps) {
  const {
    settings,
    isAthleteMode,
    isWellnessMode,
    updateSettings,
    userWeight,
    recommendedTargets,
    recommendedRanges,
    effectiveTargets,
  } = useNutritionSettings();

  const currentGoal: AthleteGoal = settings.athleteGoal || "performance";
  const activeGoalConfig =
    ATHLETE_GOAL_OPTIONS.find((g) => g.id === currentGoal) || ATHLETE_GOAL_OPTIONS[1];

  // Local state for in-place numeric editing
  const [localCalories, setLocalCalories] = useState<number>(effectiveTargets.calories);
  const [localProtein, setLocalProtein] = useState<number>(effectiveTargets.protein);
  const [localCarbs, setLocalCarbs] = useState<number>(effectiveTargets.carbs);
  const [localFat, setLocalFat] = useState<number>(effectiveTargets.fat);

  // Trigger subtle haptic feedback if available
  const triggerHaptic = () => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(15);
      } catch (_) {}
    }
  };

  const handleModeChange = (checked: boolean) => {
    triggerHaptic();
    const newMode: NutritionMode = checked ? "athlete" : "wellness";
    updateSettings({ mode: newMode });
    if (newMode === "athlete") {
      toast.info("Modo Atleta activado", {
        description: "Se mostrarán calorías numéricas y conteo de macronutrientes en gramos.",
      });
    } else {
      toast.success("Modo Bienestar activado", {
        description: "Enfoque cualitativo, perfil nutricional y nutrición consciente.",
      });
    }
  };

  const handleSelectGoal = (goal: AthleteGoal) => {
    triggerHaptic();
    updateSettings({ athleteGoal: goal });
    const newTargets = getRecommendedTargets(userWeight, goal);
    if (!settings.customTargetsEnabled) {
      setLocalCalories(newTargets.calories);
      setLocalProtein(newTargets.protein);
      setLocalCarbs(newTargets.carbs);
      setLocalFat(newTargets.fat);
    }
    const opt = ATHLETE_GOAL_OPTIONS.find((g) => g.id === goal);
    toast.info(`Fase: ${opt?.title || goal}`, {
      description: `${opt?.subtitle} (${opt?.kcalTag})`,
    });
  };

  const handleCustomToggle = (checked: boolean) => {
    triggerHaptic();
    if (checked) {
      // Initialize with current effective or recommended
      const initialCal = settings.customCalories || recommendedTargets.calories;
      const initialProt = settings.customProtein || recommendedTargets.protein;
      const initialCarbs = settings.customCarbs || recommendedTargets.carbs;
      const initialFat = settings.customFat || recommendedTargets.fat;

      setLocalCalories(initialCal);
      setLocalProtein(initialProt);
      setLocalCarbs(initialCarbs);
      setLocalFat(initialFat);

      updateSettings({
        customTargetsEnabled: true,
        customCalories: initialCal,
        customProtein: initialProt,
        customCarbs: initialCarbs,
        customFat: initialFat,
      });

      toast.info("Personalización de metas activada");
    } else {
      updateSettings({
        customTargetsEnabled: false,
      });
      setLocalCalories(recommendedTargets.calories);
      setLocalProtein(recommendedTargets.protein);
      setLocalCarbs(recommendedTargets.carbs);
      setLocalFat(recommendedTargets.fat);
      toast.info("Metas restablecidas a recomendaciones biológicas");
    }
  };

  const handleUpdateField = (
    field: "customCalories" | "customProtein" | "customCarbs" | "customFat",
    value: number,
  ) => {
    const clamped = Math.max(0, Math.round(value));
    if (field === "customCalories") setLocalCalories(clamped);
    if (field === "customProtein") setLocalProtein(clamped);
    if (field === "customCarbs") setLocalCarbs(clamped);
    if (field === "customFat") setLocalFat(clamped);

    updateSettings({
      customTargetsEnabled: true,
      [field]: clamped,
    });
  };

  const handleResetToRecommended = () => {
    triggerHaptic();
    const activeGoal = settings.athleteGoal || "performance";
    const goalTargets = getRecommendedTargets(userWeight, activeGoal);
    setLocalCalories(goalTargets.calories);
    setLocalProtein(goalTargets.protein);
    setLocalCarbs(goalTargets.carbs);
    setLocalFat(goalTargets.fat);

    updateSettings({
      customTargetsEnabled: false,
      customCalories: undefined,
      customProtein: undefined,
      customCarbs: undefined,
      customFat: undefined,
    });

    const opt = ATHLETE_GOAL_OPTIONS.find((g) => g.id === activeGoal);
    toast.success("Valores restablecidos a la recomendación biológica", {
      description: `Fase ${opt?.title || "Rendimiento"} calculada para ${userWeight} kg.`,
    });
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto pb-28 pt-2 animate-fade-in relative text-left">
      {/* Botón Volver a Ajustes */}
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border border-border bg-card hover:bg-secondary text-xs font-semibold text-foreground transition cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Volver a Ajustes
        </button>
      </div>

      {/* Encabezado */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Ajustes de Nutrición
        </h1>
        <p className="text-xs text-muted-foreground">
          Configura tu enfoque de alimentación y personaliza tus metas diarias.
        </p>
      </div>

      {/* SECCIÓN 1: SELECTOR DE MODO */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-0.5">
          Enfoque
        </div>

        <div className="border border-border bg-card rounded-3xl p-4 space-y-3">
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-secondary/40 rounded-2xl border border-border/50">
            <button
              type="button"
              onClick={() => handleModeChange(false)}
              className={cn(
                "py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer select-none",
                isWellnessMode
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Modo Bienestar</span>
            </button>
            <button
              type="button"
              onClick={() => handleModeChange(true)}
              className={cn(
                "py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer select-none",
                isAthleteMode
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Activity className="w-3.5 h-3.5 text-amber-500" />
              <span>Modo Atleta</span>
            </button>
          </div>

          <p className="text-xs text-muted-foreground px-1 leading-relaxed">
            {isAthleteMode
              ? "Modo cuantitativo con conteo calórico y desglose de macronutrientes en gramos."
              : "Modo cualitativo con perfil nutricional, saciedad somática y sin conteo calórico."}
          </p>
        </div>
      </div>

      {/* SECCIÓN 2: METAS Y MACRONUTRIENTES */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Metas y Macronutrientes
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">
            {userWeight} kg
          </span>
        </div>

        <div className="border border-border bg-card rounded-3xl p-4 sm:p-5 space-y-4">
          {/* Fase Deportiva (Modo Atleta) */}
          {isAthleteMode && (
            <div className="space-y-1.5 pb-3 border-b border-border/40">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <span>Fase</span>
                <span className="font-mono text-[10px] text-foreground/70 lowercase">{activeGoalConfig.kcalTag}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-secondary/40 rounded-2xl border border-border/40">
                {ATHLETE_GOAL_OPTIONS.map((g) => {
                  const isSelected = currentGoal === g.id;
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
          )}

          {/* Switch Personalizar */}
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <Label htmlFor="custom-switch" className="text-xs font-bold text-foreground cursor-pointer">
                Personalizar valores
              </Label>
              <p className="text-[11px] text-muted-foreground">
                {settings.customTargetsEnabled
                  ? "Valores fijos asignados manualmente."
                  : `Rangos fisiológicos recomendados para ${userWeight} kg.`}
              </p>
            </div>
            <Switch
              id="custom-switch"
              checked={settings.customTargetsEnabled}
              onCheckedChange={handleCustomToggle}
            />
          </div>

          {/* Vista de Datos: Rangos o Sliders */}
          {!settings.customTargetsEnabled ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 animate-in fade-in duration-150">
              <div className="p-3 rounded-2xl bg-secondary/25 border border-border/40 space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Calorías</span>
                <span className="text-base font-black font-mono tabular-nums text-foreground block">
                  {recommendedRanges.calories[0]}–{recommendedRanges.calories[1]}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground block">kcal</span>
              </div>
              <div className="p-3 rounded-2xl bg-secondary/25 border border-border/40 space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">Proteína</span>
                <span className="text-base font-black font-mono tabular-nums text-foreground block">
                  {recommendedRanges.protein[0]}–{recommendedRanges.protein[1]}g
                </span>
                <span className="text-[10px] font-mono text-muted-foreground block">{activeGoalConfig.protTag}</span>
              </div>
              <div className="p-3 rounded-2xl bg-secondary/25 border border-border/40 space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">Carbos</span>
                <span className="text-base font-black font-mono tabular-nums text-foreground block">
                  {recommendedRanges.carbs[0]}–{recommendedRanges.carbs[1]}g
                </span>
                <span className="text-[10px] font-mono text-muted-foreground block">{activeGoalConfig.carbsTag}</span>
              </div>
              <div className="p-3 rounded-2xl bg-secondary/25 border border-border/40 space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 block">Grasas</span>
                <span className="text-base font-black font-mono tabular-nums text-foreground block">
                  {recommendedRanges.fat[0]}–{recommendedRanges.fat[1]}g
                </span>
                <span className="text-[10px] font-mono text-muted-foreground block">{activeGoalConfig.fatTag}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4 pt-1 animate-in fade-in duration-150">
              {/* Macro ratio bar */}
              {(() => {
                const pK = localProtein * 4;
                const cK = localCarbs * 4;
                const fK = localFat * 9;
                const totalK = pK + cK + fK || 1;
                const pPct = Math.round((pK / totalK) * 100);
                const cPct = Math.round((cK / totalK) * 100);
                const fPct = Math.max(0, 100 - pPct - cPct);
                return (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-muted-foreground">Distribución:</span>
                      <span className="font-bold text-foreground">
                        {pPct}% P • {cPct}% C • {fPct}% G
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden flex">
                      <div style={{ width: `${pPct}%` }} className="bg-emerald-600 transition-all duration-200" />
                      <div style={{ width: `${cPct}%` }} className="bg-amber-500 transition-all duration-200" />
                      <div style={{ width: `${fPct}%` }} className="bg-sky-500 transition-all duration-200" />
                    </div>
                  </div>
                );
              })()}

              <div className="space-y-3">
                {/* Calorías */}
                <div className="p-3 rounded-2xl bg-secondary/20 border border-border/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">Calorías Diarias</span>
                    <span className="text-xs font-black font-mono">{localCalories} kcal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdateField("customCalories", localCalories - 50)}
                      className="w-7 h-7 rounded-lg border border-border bg-card hover:bg-secondary text-xs font-bold transition flex items-center justify-center shrink-0 cursor-pointer select-none active:scale-95"
                    >
                      -
                    </button>
                    <Slider
                      value={[localCalories]}
                      onValueChange={([v]) => handleUpdateField("customCalories", v)}
                      min={1200}
                      max={4200}
                      step={25}
                      className="cursor-pointer flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => handleUpdateField("customCalories", localCalories + 50)}
                      className="w-7 h-7 rounded-lg border border-border bg-card hover:bg-secondary text-xs font-bold transition flex items-center justify-center shrink-0 cursor-pointer select-none active:scale-95"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Proteína */}
                <div className="p-3 rounded-2xl bg-secondary/20 border border-border/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Proteína</span>
                    <span className="text-xs font-black font-mono">{localProtein} g</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdateField("customProtein", localProtein - 5)}
                      className="w-7 h-7 rounded-lg border border-border bg-card hover:bg-secondary text-xs font-bold transition flex items-center justify-center shrink-0 cursor-pointer select-none active:scale-95"
                    >
                      -
                    </button>
                    <Slider
                      value={[localProtein]}
                      onValueChange={([v]) => handleUpdateField("customProtein", v)}
                      min={50}
                      max={260}
                      step={5}
                      className="cursor-pointer flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => handleUpdateField("customProtein", localProtein + 5)}
                      className="w-7 h-7 rounded-lg border border-border bg-card hover:bg-secondary text-xs font-bold transition flex items-center justify-center shrink-0 cursor-pointer select-none active:scale-95"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Carbohidratos */}
                <div className="p-3 rounded-2xl bg-secondary/20 border border-border/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Carbohidratos</span>
                    <span className="text-xs font-black font-mono">{localCarbs} g</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdateField("customCarbs", localCarbs - 5)}
                      className="w-7 h-7 rounded-lg border border-border bg-card hover:bg-secondary text-xs font-bold transition flex items-center justify-center shrink-0 cursor-pointer select-none active:scale-95"
                    >
                      -
                    </button>
                    <Slider
                      value={[localCarbs]}
                      onValueChange={([v]) => handleUpdateField("customCarbs", v)}
                      min={60}
                      max={500}
                      step={5}
                      className="cursor-pointer flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => handleUpdateField("customCarbs", localCarbs + 5)}
                      className="w-7 h-7 rounded-lg border border-border bg-card hover:bg-secondary text-xs font-bold transition flex items-center justify-center shrink-0 cursor-pointer select-none active:scale-95"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Grasas */}
                <div className="p-3 rounded-2xl bg-secondary/20 border border-border/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-600 dark:text-sky-400">Grasas</span>
                    <span className="text-xs font-black font-mono">{localFat} g</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdateField("customFat", localFat - 2)}
                      className="w-7 h-7 rounded-lg border border-border bg-card hover:bg-secondary text-xs font-bold transition flex items-center justify-center shrink-0 cursor-pointer select-none active:scale-95"
                    >
                      -
                    </button>
                    <Slider
                      value={[localFat]}
                      onValueChange={([v]) => handleUpdateField("customFat", v)}
                      min={25}
                      max={150}
                      step={2}
                      className="cursor-pointer flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => handleUpdateField("customFat", localFat + 2)}
                      className="w-7 h-7 rounded-lg border border-border bg-card hover:bg-secondary text-xs font-bold transition flex items-center justify-center shrink-0 cursor-pointer select-none active:scale-95"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleResetToRecommended}
                  className="rounded-xl text-xs text-muted-foreground hover:text-foreground gap-1.5 cursor-pointer h-7"
                >
                  <RotateCcw className="w-3 h-3" />
                  Restablecer
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer minimalista */}
      <div className="text-center pt-2">
        <p className="text-[11px] text-muted-foreground">
          The Wellness Face • Nutrición basada en confort somático y bienestar consciente.
        </p>
      </div>
    </div>
  );
}
