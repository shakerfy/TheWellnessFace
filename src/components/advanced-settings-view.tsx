import React, { useState } from "react";
import { ChevronLeft, Sliders, Sparkles, Activity, RotateCcw, Check, Info, ShieldCheck, Sun, Moon, Laptop } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/use-theme";
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
    isWellnessMode,
    updateSettings,
    userWeight,
    recommendedTargets,
    recommendedRanges,
    effectiveTargets,
  } = useNutritionSettings();
  const { theme, setTheme } = useTheme();

  const currentGoal: AthleteGoal = settings.athleteGoal || "performance";
  const activeGoalConfig =
    ATHLETE_GOAL_OPTIONS.find((g) => g.id === currentGoal) || ATHLETE_GOAL_OPTIONS[1];

  // Local state for in-place numeric editing
  const [localCalories, setLocalCalories] = useState<number>(effectiveTargets.calories);
  const [localProtein, setLocalProtein] = useState<number>(effectiveTargets.protein);
  const [localCarbs, setLocalCarbs] = useState<number>(effectiveTargets.carbs);
  const [localFat, setLocalFat] = useState<number>(effectiveTargets.fat);

  // Trigger subtle haptic feedback if available
  const triggerHaptic = (ms = 15) => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(ms);
      } catch (_) {}
    }
  };

  const handleModeChange = (checked: boolean) => {
    triggerHaptic(checked ? 12 : 18);
    const newMode: NutritionMode = checked ? "athlete" : "wellness";
    updateSettings({ mode: newMode });
    if (newMode === "athlete") {
      toast.info("MODO ATLETA // TELEMETRÍA ACTIVA", {
        description: "Cabina de rendimiento activada: gramos, calorías y rangos 80/20.",
      });
    } else {
      toast.success("Modo Bienestar activado", {
        description: "Volviste al espacio de calma: perfil cualitativo sin conteo calórico.",
      });
    }
  };

  const handleSelectGoal = (goal: AthleteGoal) => {
    triggerHaptic(12);
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
    triggerHaptic(12);
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
    triggerHaptic(12);
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
          Ajustes de Nutrición y Apariencia
        </h1>
        <p className="text-xs text-muted-foreground">
          Configura el tema de la app y el cambio de habitación digital (Bienestar vs. Atleta).
        </p>
      </div>

      {/* SECCIÓN 0: TEMA DE LA APP (CLARO / OSCURO / AUTOMÁTICO) */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-0.5">
          Tema de Iluminación
        </div>
        <div className="border border-border bg-card rounded-3xl p-4">
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-secondary/40 rounded-2xl border border-border/50">
            <button
              type="button"
              onClick={() => {
                triggerHaptic(10);
                setTheme("light");
              }}
              className={cn(
                "py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none",
                theme === "light"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Claro</span>
            </button>
            <button
              type="button"
              onClick={() => {
                triggerHaptic(10);
                setTheme("dark");
              }}
              className={cn(
                "py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none",
                theme === "dark"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Oscuro</span>
            </button>
            <button
              type="button"
              onClick={() => {
                triggerHaptic(10);
                setTheme("system");
              }}
              className={cn(
                "py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none",
                theme === "system"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Laptop className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Sistema</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECCIÓN 1: ENFOQUE NUTRICIONAL (MODO BIENESTAR) */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-0.5">
          Enfoque Nutricional
        </div>

        <div className="rounded-3xl p-4 sm:p-5 space-y-2.5 border border-border bg-card text-card-foreground">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-bold text-foreground">
              Modo Bienestar (Calma Diaria)
            </span>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Nutrición consciente libre de conteo calórico restrictivo. Las recomendaciones priorizan saciedad, confort digestivo, energía sostenida y porciones de mano (Palma, Puño, Pulgar, Cuenco).
          </p>
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
