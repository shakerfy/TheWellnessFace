import React, { useState } from "react";
import { ArrowLeft, Minus, Plus, Sparkles, Loader2, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  COMMON_FOODS_DATABASE,
  type MealIngredientItem,
  type CommonFoodItem,
} from "@/lib/food-database";

export interface MealFixScreenProps {
  title: string;
  setTitle: (t: string) => void;
  servings: number;
  setServings: React.Dispatch<React.SetStateAction<number>>;
  ingredients: MealIngredientItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  onBackToDetail: () => void;
  onSave: () => void;
  onUpdateGrams: (id: string, delta: number) => void;
  onDeleteIngredient: (id: string) => void;
  onAddIngredient: (food: CommonFoodItem, grams: number) => void;
  onApplyAiPrompt: (promptText: string) => void;
  isAiThinking: boolean;
}

export function MealFixScreen({
  title,
  setTitle,
  servings,
  setServings,
  ingredients,
  totalCalories,
  totalProtein,
  totalCarbs,
  totalFat,
  onBackToDetail,
  onSave,
  onUpdateGrams,
  onDeleteIngredient,
  onAddIngredient,
  onApplyAiPrompt,
  isAiThinking,
}: MealFixScreenProps) {
  // AI Prompt Adjustment State
  const [aiPromptText, setAiPromptText] = useState("");

  // Quick Add Food State
  const [isAddFoodOpen, setIsAddFoodOpen] = useState(false);
  const [foodSearchQuery, setFoodSearchQuery] = useState("");
  const [selectedAddFood, setSelectedAddFood] = useState<CommonFoodItem>(COMMON_FOODS_DATABASE[0]);
  const [addGrams, setAddGrams] = useState(100);

  const filteredFoods = COMMON_FOODS_DATABASE.filter((f) =>
    f.name.toLowerCase().includes(foodSearchQuery.toLowerCase()),
  );

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPromptText.trim() || isAiThinking) return;
    onApplyAiPrompt(aiPromptText.trim());
    setAiPromptText("");
  };

  const handleAddSubmit = () => {
    onAddIngredient(selectedAddFood, addGrams);
    setIsAddFoodOpen(false);
  };

  return (
    <div className="p-5 flex flex-col justify-between h-full overflow-y-auto custom-scrollbar text-left text-foreground">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border/50">
          <button
            type="button"
            onClick={onBackToDetail}
            className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Reporte</span>
          </button>

          <span className="text-xs font-black uppercase text-foreground">
            Ajustar Resultados
          </span>
        </div>

        {/* Title & Servings Edit Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Nombre del Plato
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
                onClick={() => setServings((s) => Math.max(0.5, s - 0.5))}
                disabled={servings <= 0.5}
                className="text-muted-foreground hover:text-foreground disabled:opacity-40 cursor-pointer p-1"
                aria-label="Restar porción"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold font-mono">
                {servings} {servings === 1 ? "porc." : "porcs."}
              </span>
              <button
                type="button"
                onClick={() => setServings((s) => s + 0.5)}
                className="text-muted-foreground hover:text-foreground cursor-pointer p-1"
                aria-label="Sumar porción"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Macros Pill Preview */}
        <div className="grid grid-cols-4 gap-1.5 p-2 rounded-2xl bg-secondary/30 border border-border/50 text-center">
          <div className="p-1">
            <span className="text-[9px] uppercase font-bold text-muted-foreground block">Calorías</span>
            <span className="text-xs font-black text-foreground">{totalCalories}</span>
          </div>
          <div className="p-1">
            <span className="text-[9px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">Proteína</span>
            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">{totalProtein}g</span>
          </div>
          <div className="p-1">
            <span className="text-[9px] uppercase font-bold text-amber-600 dark:text-amber-400 block">Carbos</span>
            <span className="text-xs font-black text-amber-600 dark:text-amber-400">{totalCarbs}g</span>
          </div>
          <div className="p-1">
            <span className="text-[9px] uppercase font-bold text-sky-600 dark:text-sky-400 block">Grasas</span>
            <span className="text-xs font-black text-sky-600 dark:text-sky-400">{totalFat}g</span>
          </div>
        </div>

        {/* Describe with AI Prompt */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-foreground/80" />
            <span>Describir correcciones con IA:</span>
          </label>
          <form onSubmit={handleAiSubmit} className="flex gap-2">
            <input
              type="text"
              value={aiPromptText}
              onChange={(e) => setAiPromptText(e.target.value)}
              placeholder="e.g. 'extra pollo', 'sin salsa', 'mitad de arroz'..."
              className="flex-1 h-10 px-3 rounded-xl bg-secondary/50 border border-border text-xs focus:outline-none focus:ring-1 focus:ring-ring text-foreground"
            />
            <Button
              type="submit"
              disabled={isAiThinking || !aiPromptText.trim()}
              className="h-10 px-4 rounded-xl bg-foreground text-background font-bold text-xs hover:opacity-90 shrink-0 cursor-pointer"
            >
              {isAiThinking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Ajustar"}
            </Button>
          </form>
        </div>

        {/* Ingredients List with Grams Stepper */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Ingredientes ({ingredients.length})
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsAddFoodOpen(!isAddFoodOpen)}
              className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:bg-sky-500/10 h-7 px-2 cursor-pointer"
            >
              {isAddFoodOpen ? "Cerrar selector" : "+ Agregar Alimento"}
            </Button>
          </div>

          {/* Sub-panel para Agregar Alimento */}
          {isAddFoodOpen && (
            <div className="p-3 rounded-2xl bg-secondary/60 border border-border/80 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
              <span className="text-xs font-bold text-foreground block">
                Selecciona un alimento de la base de datos
              </span>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={foodSearchQuery}
                  onChange={(e) => setFoodSearchQuery(e.target.value)}
                  placeholder="Buscar alimento (ej: Pollo, Avena, Huevo)..."
                  className="w-full h-8 pl-8 pr-3 rounded-xl bg-background border border-border text-xs focus:outline-none text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto custom-scrollbar">
                {filteredFoods.slice(0, 8).map((food) => (
                  <button
                    key={food.name}
                    type="button"
                    onClick={() => setSelectedAddFood(food)}
                    className={cn(
                      "p-2 rounded-xl text-left text-xs border transition-all cursor-pointer flex flex-col justify-between",
                      selectedAddFood.name === food.name
                        ? "bg-foreground text-background border-foreground font-bold"
                        : "bg-background/80 hover:bg-background border-border/60 text-foreground",
                    )}
                  >
                    <span className="truncate block font-semibold">{food.name}</span>
                    <span className="text-[10px] opacity-70">
                      {food.calPer100g} kcal / 100g
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between gap-3 pt-1 border-t border-border/40">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">Cantidad:</span>
                  <input
                    type="number"
                    min="10"
                    step="10"
                    value={addGrams}
                    onChange={(e) => setAddGrams(Math.max(10, Number(e.target.value) || 10))}
                    className="w-16 h-8 px-2 rounded-lg bg-background border border-border text-xs font-bold text-center text-foreground"
                  />
                  <span className="text-xs text-muted-foreground font-medium">gramos</span>
                </div>

                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddSubmit}
                  className="h-8 px-3 rounded-xl bg-foreground text-background font-bold text-xs hover:opacity-90 cursor-pointer"
                >
                  + Agregar
                </Button>
              </div>
            </div>
          )}

          {/* Lista de Items */}
          <div className="space-y-1.5 max-h-56 overflow-y-auto custom-scrollbar pr-0.5">
            {ingredients.map((ing) => (
              <div
                key={ing.id}
                className="p-2.5 rounded-2xl bg-secondary/30 border border-border/50 flex items-center justify-between gap-2 text-left"
              >
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-foreground block truncate">
                    {ing.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {Math.round(ing.calories * servings)} kcal • {ing.category}
                  </span>
                </div>

                {/* Stepper de Gramos */}
                <div className="flex items-center gap-1 bg-background px-2 py-1 rounded-xl border border-border shrink-0">
                  <button
                    type="button"
                    onClick={() => onUpdateGrams(ing.id, -20)}
                    className="text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
                    title="Restar 20g"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold w-12 text-center font-mono">
                    {Math.round(ing.grams * servings)}g
                  </span>
                  <button
                    type="button"
                    onClick={() => onUpdateGrams(ing.id, 20)}
                    className="text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
                    title="Sumar 20g"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteIngredient(ing.id)}
                  className="text-muted-foreground hover:text-rose-500 cursor-pointer p-1"
                  title="Eliminar ingrediente"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Buttons in Fix Screen */}
      <div className="sticky bottom-0 z-40 bg-white/95 dark:bg-background/95 backdrop-blur-md -mx-5 px-5 pt-3 pb-1 border-t border-slate-100 dark:border-border flex items-center gap-2.5 mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBackToDetail}
          className="flex-1 rounded-full py-4 h-12 font-bold text-xs border border-border text-foreground hover:bg-secondary cursor-pointer"
        >
          Volver al Reporte
        </Button>
        <Button
          type="button"
          onClick={onSave}
          className="flex-1 rounded-full py-4 h-12 font-bold text-xs bg-foreground text-background hover:opacity-90 shadow-md cursor-pointer"
        >
          Guardar Cambios
        </Button>
      </div>
    </div>
  );
}
