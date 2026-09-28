import React from "react";
import { ArrowLeft, Minus, Plus, Sparkles, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MealIngredientItem } from "@/lib/scan-data";

export interface ScanFixScreenProps {
  reportTitle: string;
  title: string;
  servings: number;
  aiPromptText: string;
  isAiThinking: boolean;
  ingredients: MealIngredientItem[];

  // Callbacks
  onBackToNutrition: () => void;
  onTitleChange: (newTitle: string) => void;
  onServingsChange: (newServings: number) => void;
  onAiPromptChange: (prompt: string) => void;
  onApplyAiPrompt: (e: React.FormEvent) => void;
  onOpenAddIngredient: () => void;
  onRenameIngredient: (id: string, newName: string) => void;
  onUpdateGrams: (id: string, delta: number) => void;
  onSetExactGrams: (id: string, exactGrams: number) => void;
  onDeleteIngredient: (id: string) => void;
  onSaveToDiary: () => void;
}

export function ScanFixScreen({
  reportTitle,
  title,
  servings,
  aiPromptText,
  isAiThinking,
  ingredients,
  onBackToNutrition,
  onTitleChange,
  onServingsChange,
  onAiPromptChange,
  onApplyAiPrompt,
  onOpenAddIngredient,
  onRenameIngredient,
  onUpdateGrams,
  onSetExactGrams,
  onDeleteIngredient,
  onSaveToDiary,
}: ScanFixScreenProps) {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md">
      <div className="max-w-md w-full h-full sm:h-[92vh] sm:max-h-[820px] rounded-none sm:rounded-[36px] overflow-hidden bg-background border-0 sm:border sm:border-border shadow-2xl p-5 space-y-4 overflow-y-auto custom-scrollbar text-left flex flex-col justify-between text-foreground">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <button
              type="button"
              onClick={onBackToNutrition}
              className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al Reporte</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-foreground">
                Ajustar Plato
              </span>
            </div>
          </div>

          {/* Title & Servings Edit Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Nombre del Plato
              </label>
              <input
                type="text"
                value={reportTitle || title}
                onChange={(e) => onTitleChange(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-secondary/50 border border-border text-sm font-bold text-foreground focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Porciones
              </label>
              <div className="h-10 px-3 rounded-xl bg-secondary/50 border border-border flex items-center justify-between">
                <button
                  type="button"
                  onClick={() =>
                    onServingsChange(Math.max(0.5, Math.round((servings - 0.5) * 10) / 10))
                  }
                  disabled={servings <= 0.5}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-40 cursor-pointer p-1"
                  aria-label="Restar porción"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-bold font-mono">
                  {servings} {servings === 1 ? "porción" : "porciones"}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onServingsChange(Math.round((servings + 0.5) * 10) / 10)
                  }
                  className="text-muted-foreground hover:text-foreground cursor-pointer p-1"
                  aria-label="Sumar porción"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Describe with AI Prompt */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Corrección rápida con IA:</span>
            </label>
            <form onSubmit={onApplyAiPrompt} className="flex gap-2">
              <input
                type="text"
                value={aiPromptText}
                onChange={(e) => onAiPromptChange(e.target.value)}
                placeholder="Ej: 'sin arroz', 'agregar 150g pollo', 'con palta'..."
                className="flex-1 h-10 px-3 rounded-xl bg-secondary/50 border border-border text-xs focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
              <Button
                type="submit"
                disabled={isAiThinking || !aiPromptText.trim()}
                className="h-10 px-4 rounded-xl bg-foreground text-background font-bold text-xs hover:opacity-90 cursor-pointer"
              >
                {isAiThinking ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  "Ajustar"
                )}
              </Button>
            </form>
          </div>

          {/* Ingredients List with In-Place Name & Grams Editing */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Ingredientes ({ingredients.length})
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onOpenAddIngredient}
                className="text-xs font-bold text-foreground hover:bg-secondary h-7 px-2.5 rounded-xl cursor-pointer"
              >
                + Agregar Ingrediente
              </Button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
              {ingredients.map((ing) => {
                const catLabel =
                  ing.category === "protein"
                    ? "Proteína"
                    : ing.category === "fats"
                      ? "Grasas saludables"
                      : ing.category === "veggies"
                        ? "Vegetales y fibra"
                        : ing.category === "fruits"
                          ? "Fruta fresca"
                          : ing.category === "dairy"
                            ? "Lácteos"
                            : "Carbohidratos";

                const displayGrams = Math.round(ing.grams * servings);

                return (
                  <div
                    key={ing.id}
                    className="p-2.5 rounded-2xl bg-secondary/40 border border-border/50 flex items-center justify-between gap-2 transition hover:border-foreground/25"
                  >
                    <div className="min-w-0 flex-1">
                      <input
                        type="text"
                        value={ing.name}
                        onChange={(e) => onRenameIngredient(ing.id, e.target.value)}
                        className="w-full bg-transparent border-0 outline-none text-xs font-bold text-foreground truncate focus:underline"
                        aria-label="Nombre del ingrediente"
                      />
                      <span className="text-[10px] text-muted-foreground block mt-0.5 font-mono">
                        {catLabel}
                      </span>
                    </div>

                    {/* In-Place Stepper + Direct Input */}
                    <div className="flex items-center gap-1 bg-background px-2 py-1 rounded-xl border border-border shrink-0">
                      <button
                        type="button"
                        onClick={() => onUpdateGrams(ing.id, -20)}
                        className="text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
                        aria-label="Restar 20g"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <div className="flex items-center">
                        <input
                          type="number"
                          min={5}
                          max={2000}
                          value={displayGrams}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val) && val > 0) {
                              onSetExactGrams(ing.id, val);
                            }
                          }}
                          className="w-11 text-center text-xs font-bold font-mono bg-transparent border-0 outline-none text-foreground [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          aria-label={`Gramos de ${ing.name}`}
                        />
                        <span className="text-[10px] font-mono text-muted-foreground -ml-1">
                          g
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onUpdateGrams(ing.id, 20)}
                        className="text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
                        aria-label="Sumar 20g"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDeleteIngredient(ing.id)}
                      className="text-muted-foreground hover:text-rose-500 cursor-pointer p-1 shrink-0"
                      title="Eliminar ingrediente"
                      aria-label={`Eliminar ${ing.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="pt-3 border-t border-border/40 flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onBackToNutrition}
            className="flex-1 h-11 rounded-2xl font-bold text-xs cursor-pointer"
          >
            Ver Reporte
          </Button>
          <Button
            type="button"
            onClick={onSaveToDiary}
            className="flex-1 h-11 rounded-2xl bg-foreground text-background font-bold text-xs hover:opacity-90 transition cursor-pointer"
          >
            Guardar Plato
          </Button>
        </div>
      </div>
    </div>
  );
}
