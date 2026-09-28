import React, { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Droplet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useNutritionSettings } from "@/lib/nutrition-settings";
import type { FoodQualityLevel } from "@/components/food-profile-hero";
import { ARMSTRONG_LEVELS } from "../app-utils";
import type { MealIngredientItem, CommonFoodItem } from "@/lib/food-database";
import { ArmstrongUrineScaleVisual } from "./armstrong-scale";
import { MealDetailScreen } from "./meal-detail-screen";
import { MealFixScreen } from "./meal-fix-screen";

export interface EditTimelineItemModalProps {
  item: any;
  onClose: () => void;
  onSave: (updated: any) => void;
  onToggleSave?: (id: string) => void;
}

export function EditTimelineItemModal({
  item,
  onClose,
  onSave,
  onToggleSave,
}: EditTimelineItemModalProps) {
  const isMeal = item.type === "meal";
  const { isAthleteMode } = useNutritionSettings();
  const [currentMealScreen, setCurrentMealScreen] = useState<"detail" | "fix">("detail");
  const [isSavedInModal, setIsSavedInModal] = useState<boolean>(Boolean(item.isSaved || item.saved));
  const [title, setTitle] = useState(item.title || "");
  const [time, setTime] = useState(item.time || "");
  const [servings, setServings] = useState<number>(item.servings || 1);
  const [coachFeedback, setCoachFeedback] = useState(
    item.coachFeedback || item.narrative || item.summary || item.desc || "",
  );
  const [level, setLevel] = useState<number>(item.level || 2);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Bloqueo de scroll y listener de tecla Escape para experiencia de pantalla completa
  useEffect(() => {
    if (!isMeal) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMeal, onClose]);

  // Ingredients State (initialized from item or generated from meal calories/macros)
  const [ingredients, setIngredients] = useState<MealIngredientItem[]>(() => {
    if (Array.isArray(item.ingredients) && item.ingredients.length > 0) {
      return item.ingredients;
    }
    const cal = item.calories ?? item.kcal ?? 350;
    const p = item.protein ?? 25;
    const c = item.carbs ?? item.carbohydrates ?? 35;
    const f = item.fat ?? 12;
    return [
      {
        id: `ing-${Date.now()}`,
        name: item.title || "Porción principal",
        category: "protein",
        grams: 150,
        calories: cal,
        protein: p,
        carbs: c,
        fat: f,
        fiber: 2,
        calPer100g: Math.round((cal / 150) * 100),
        pPer100g: Math.round((p / 150) * 100 * 10) / 10,
        cPer100g: Math.round((c / 150) * 100 * 10) / 10,
        fPer100g: Math.round((f / 150) * 100 * 10) / 10,
        fiberPer100g: 1.5,
      },
    ];
  });

  // Dynamic Base and Total Macros Calculation
  const baseCalories = useMemo(
    () => ingredients.reduce((acc, i) => acc + (i.calories || 0), 0),
    [ingredients],
  );
  const baseProtein = useMemo(
    () => ingredients.reduce((acc, i) => acc + (i.protein || 0), 0),
    [ingredients],
  );
  const baseCarbs = useMemo(
    () => ingredients.reduce((acc, i) => acc + (i.carbs || 0), 0),
    [ingredients],
  );
  const baseFat = useMemo(
    () => ingredients.reduce((acc, i) => acc + (i.fat || 0), 0),
    [ingredients],
  );
  const baseFiber = useMemo(
    () => ingredients.reduce((acc, i) => acc + (i.fiber || 0), 0),
    [ingredients],
  );

  const totalCalories = Math.round(baseCalories * servings);
  const totalProtein = Math.round(baseProtein * servings);
  const totalCarbs = Math.round(baseCarbs * servings);
  const totalFat = Math.round(baseFat * servings);
  const totalFiber = Math.round(baseFiber * servings * 10) / 10;

  // Update ingredient grams
  const handleUpdateGrams = (id: string, delta: number) => {
    setIngredients((prev) =>
      prev.map((ing) => {
        if (ing.id !== id) return ing;
        const newGrams = Math.max(10, ing.grams + delta);
        const calPer100 =
          ing.calPer100g || (ing.grams > 0 ? (ing.calories / ing.grams) * 100 : 150);
        const pPer100 =
          ing.pPer100g || (ing.grams > 0 ? (ing.protein / ing.grams) * 100 : 10);
        const cPer100 =
          ing.cPer100g || (ing.grams > 0 ? (ing.carbs / ing.grams) * 100 : 15);
        const fPer100 =
          ing.fPer100g || (ing.grams > 0 ? (ing.fat / ing.grams) * 100 : 5);
        const fiberPer100 = ing.fiberPer100g || 1;
        const factor = newGrams / 100;
        return {
          ...ing,
          grams: newGrams,
          calories: Math.round(calPer100 * factor),
          protein: Math.round(pPer100 * factor * 10) / 10,
          carbs: Math.round(cPer100 * factor * 10) / 10,
          fat: Math.round(fPer100 * factor * 10) / 10,
          fiber: Math.round(fiberPer100 * factor * 10) / 10,
          calPer100g: calPer100,
          pPer100g: pPer100,
          cPer100g: cPer100,
          fPer100g: fPer100,
          fiberPer100g: fiberPer100,
        };
      }),
    );
  };

  // Delete ingredient
  const handleDeleteIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((i) => i.id !== id));
  };

  // Add ingredient submit
  const handleAddIngredient = (food: CommonFoodItem, grams: number) => {
    const factor = grams / 100;
    const newItem: MealIngredientItem = {
      id: `food-${Date.now()}`,
      name: food.name,
      category: food.category,
      grams,
      calories: Math.round(food.calPer100g * factor),
      protein: Math.round(food.pPer100g * factor * 10) / 10,
      carbs: Math.round(food.cPer100g * factor * 10) / 10,
      fat: Math.round(food.fPer100g * factor * 10) / 10,
      fiber: Math.round(food.fiberPer100g * factor * 10) / 10,
      calPer100g: food.calPer100g,
      pPer100g: food.pPer100g,
      cPer100g: food.cPer100g,
      fPer100g: food.fPer100g,
      fiberPer100g: food.fiberPer100g,
    };
    setIngredients((prev) => [...prev, newItem]);
    toast.success(`+ ${food.name} (${grams}g) agregado`);
  };

  // Natural Language AI Correction
  const handleApplyAiPrompt = (promptText: string) => {
    setIsAiThinking(true);
    setTimeout(() => {
      const lower = promptText.toLowerCase();

      if (
        lower.includes("sin") ||
        lower.includes("no syrup") ||
        lower.includes("sin salsa") ||
        lower.includes("sin queso")
      ) {
        const matchWord = lower
          .replace("sin", "")
          .replace("no", "")
          .trim();
        setIngredients((prev) =>
          prev.filter((i) => !matchWord || !i.name.toLowerCase().includes(matchWord)),
        );
      } else if (lower.includes("doble") || lower.includes("double")) {
        setServings((s) => s * 2);
      } else if (lower.includes("mitad") || lower.includes("half")) {
        setServings((s) => Math.max(0.5, s / 2));
      } else if (lower.includes("extra") || lower.includes("mas") || lower.includes("más")) {
        const matchWord = lower
          .replace("extra", "")
          .replace("mas", "")
          .replace("más", "")
          .trim();
        setIngredients((prev) =>
          prev.map((i) =>
            matchWord && i.name.toLowerCase().includes(matchWord)
              ? {
                  ...i,
                  grams: i.grams + 40,
                  calories: Math.round(i.calories * 1.3),
                  protein: Math.round(i.protein * 1.3 * 10) / 10,
                }
              : i,
          ),
        );
      } else {
        const newItem: MealIngredientItem = {
          id: `custom-ai-${Date.now()}`,
          name: promptText.slice(0, 30),
          category: "carbs",
          grams: 80,
          calories: 140,
          protein: 4.5,
          carbs: 18.0,
          fat: 5.5,
          fiber: 2.0,
          calPer100g: 175,
          pPer100g: 5.6,
          cPer100g: 22.5,
          fPer100g: 6.8,
          fiberPer100g: 2.5,
        };
        setIngredients((prev) => [...prev, newItem]);
      }

      setIsAiThinking(false);
      toast.success("✓ Cal AI ajustó el plato");
    }, 400);
  };

  const handleSaveMeal = () => {
    onSave({
      ...item,
      title: title.trim() || item.title,
      time: time.trim() || item.time,
      servings,
      ingredients,
      calories: totalCalories,
      kcal: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      carbohydrates: totalCarbs,
      fat: totalFat,
      fiber: totalFiber,
      coachFeedback: coachFeedback.trim() || item.coachFeedback,
      narrative: coachFeedback.trim() || item.narrative,
    });
    toast.success("✓ Comida actualizada correctamente");
    onClose();
  };

  if (isMeal) {
    const activeImage =
      item.img ||
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&auto=format&fit=crop&q=80";

    const qualityLevel: FoodQualityLevel =
      (item.bioGaugeIndex as FoodQualityLevel) ??
      (item.bioScore
        ? item.bioScore >= 80
          ? 5
          : item.bioScore >= 65
            ? 4
            : item.bioScore >= 50
              ? 3
              : 2
        : item.scoreGrade === "A"
          ? 5
          : item.scoreGrade === "B"
            ? 4
            : 4);

    const qualityLabel =
      item.bioQualityLabel ||
      (qualityLevel >= 4 ? "Alto" : qualityLevel === 3 ? "Medio" : "Bajo");

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
              label: totalProtein >= 25 ? "Alta en proteína" : "Proteína moderada",
            },
            {
              id: "b-3",
              category: "fiber",
              label: totalFiber >= 4 ? "Buena fuente de fibra" : "Aporte de fibra",
            },
            { id: "b-4", category: "sugar", label: "Sin azúcar añadido" },
          ];

    const maxMacroGrams = Math.max(totalProtein, totalCarbs, totalFat, 10);
    const proteinFillHeight = Math.min(
      Math.max((totalProtein / maxMacroGrams) * 70 + 16, 18),
      86,
    );
    const carbsFillHeight = Math.min(
      Math.max((totalCarbs / maxMacroGrams) * 70 + 16, 18),
      86,
    );
    const fatFillHeight = Math.min(
      Math.max((totalFat / maxMacroGrams) * 70 + 16, 18),
      86,
    );

    const macros = [
      {
        label: "Proteína",
        grams: totalProtein,
        fillHeight: proteinFillHeight,
        fillBg: "bg-emerald-500/15 dark:bg-emerald-950/40",
        textAccent: "text-emerald-700 dark:text-emerald-400",
      },
      {
        label: "Carbohidratos",
        grams: totalCarbs,
        fillHeight: carbsFillHeight,
        fillBg: "bg-amber-500/15 dark:bg-amber-950/40",
        textAccent: "text-amber-600 dark:text-amber-400",
      },
      {
        label: "Grasas",
        grams: totalFat,
        fillHeight: fatFillHeight,
        fillBg: "bg-sky-500/15 dark:bg-sky-950/40",
        textAccent: "text-sky-600 dark:text-sky-400",
      },
    ];

    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-label={currentMealScreen === "detail" ? "Detalle de Comida" : "Ajustar Resultados"}
        className="fixed inset-0 z-50 w-screen h-[100dvh] bg-background flex flex-col overflow-hidden select-none animate-in fade-in duration-200"
      >
        <div className="w-full h-full max-w-2xl mx-auto flex flex-col bg-background relative sm:border-x sm:border-border/40 sm:shadow-2xl overflow-hidden">
          {currentMealScreen === "detail" ? (
            <MealDetailScreen
              itemId={item.id}
              activeImage={activeImage}
              title={title}
              time={time || item.time}
              coachFeedback={coachFeedback}
              totalCalories={totalCalories}
              servings={servings}
              qualityLevel={qualityLevel}
              qualityLabel={qualityLabel}
              heroBadges={heroBadges}
              timingFit={item.timingFit}
              macros={macros}
              ingredients={ingredients}
              isAthleteMode={isAthleteMode}
              isSavedInModal={isSavedInModal}
              onClose={onClose}
              onSave={handleSaveMeal}
              onToggleSave={onToggleSave}
              onToggleSavedInModal={() => {
                setIsSavedInModal((prev) => !prev);
                onToggleSave?.(item.id);
              }}
              onGoToFix={() => setCurrentMealScreen("fix")}
            />
          ) : (
            <MealFixScreen
              title={title}
              setTitle={setTitle}
              servings={servings}
              setServings={setServings}
              ingredients={ingredients}
              totalCalories={totalCalories}
              totalProtein={totalProtein}
              totalCarbs={totalCarbs}
              totalFat={totalFat}
              onBackToDetail={() => setCurrentMealScreen("detail")}
              onSave={handleSaveMeal}
              onUpdateGrams={handleUpdateGrams}
              onDeleteIngredient={handleDeleteIngredient}
              onAddIngredient={handleAddIngredient}
              onApplyAiPrompt={handleApplyAiPrompt}
              isAiThinking={isAiThinking}
            />
          )}
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (item.type === "hydration") {
      const currentLevelObj =
        ARMSTRONG_LEVELS.find((l) => l.level === level) || ARMSTRONG_LEVELS[1];
      onSave({
        ...item,
        title: title.trim(),
        time: time.trim() || item.time,
        level,
        desc: `${currentLevelObj.title} (${currentLevelObj.state})`,
        tag: `Nivel ${level} Armstrong`,
        coachFeedback: coachFeedback.trim() || `💧 Consejo Fisiológico: ${currentLevelObj.advice}`,
      });
      toast.success("✓ Registro de hidratación actualizado");
    } else {
      onSave({
        ...item,
        title: title.trim(),
        time: time.trim() || item.time,
        coachFeedback: coachFeedback.trim(),
        desc: coachFeedback.trim() || item.desc,
        narrative: coachFeedback.trim() || item.narrative,
      });
      toast.success("✓ Registro actualizado");
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg p-6 bg-card border border-border rounded-3xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader className="mb-3 text-left">
          <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
            {item.type === "hydration" ? (
              <>
                <Droplet className="w-4 h-4 text-sky-500 shrink-0" />
                <span>Editar Registro de Hidratación</span>
              </>
            ) : (
              <span>Editar Registro del Diario</span>
            )}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Modifica la información de tu tarjeta registrada en la línea de tiempo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Nombre / Título y Hora */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Título</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título del registro"
                className="flex w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground font-semibold"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Hora</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="Ej: 14:30"
                className="flex w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground font-semibold"
              />
            </div>
          </div>

          {/* Hidratación: Armstrong Scale */}
          {item.type === "hydration" && (
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                Nivel Colorimétrico Armstrong
              </label>
              <ArmstrongUrineScaleVisual
                selectedLevel={level}
                onSelectLevel={(l) => setLevel(l)}
                readOnly={false}
                title="Hydration Check"
                subtitle="Selecciona el nivel de la escala"
              />
            </div>
          )}

          {/* Nota solo para registros que no sean comida ni hidratación */}
          {!isMeal && item.type !== "hydration" && (
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-semibold text-muted-foreground">Nota</label>
              <textarea
                rows={2}
                value={coachFeedback}
                onChange={(e) => setCoachFeedback(e.target.value)}
                placeholder="Agrega una nota..."
                className="flex w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground font-medium"
              />
            </div>
          )}

          <div className="flex gap-2 justify-end pt-3 border-t border-border/40">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl text-xs font-bold"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="rounded-xl text-xs font-bold bg-foreground text-background hover:opacity-90 cursor-pointer"
            >
              Guardar Cambios
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
