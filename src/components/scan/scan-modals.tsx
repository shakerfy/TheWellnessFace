import React from "react";
import { Search, Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { COMMON_FOODS_DATABASE } from "@/lib/scan-data";

export type CommonFoodItem = (typeof COMMON_FOODS_DATABASE)[number];

export interface AddIngredientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  foodSearchQuery: string;
  onFoodSearchChange: (query: string) => void;
  filteredFoods: CommonFoodItem[];
  selectedAddFood: CommonFoodItem;
  onSelectFood: (food: CommonFoodItem) => void;
  addGrams: number;
  onAddGramsChange: (grams: number) => void;
  onSubmit: () => void;
}

export function AddIngredientModal({
  open,
  onOpenChange,
  foodSearchQuery,
  onFoodSearchChange,
  filteredFoods,
  selectedAddFood,
  onSelectFood,
  addGrams,
  onAddGramsChange,
  onSubmit,
}: AddIngredientModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl p-6 border border-border bg-card">
        <DialogHeader className="pb-2 border-b border-border/40">
          <DialogTitle className="text-base font-bold text-foreground">
            Agregar Ingrediente
          </DialogTitle>
        </DialogHeader>

        <div className="py-3 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={foodSearchQuery}
              onChange={(e) => onFoodSearchChange(e.target.value)}
              placeholder="Buscar o escribir ingrediente (ej. Pollo, Palta, Huevo)..."
              className="w-full pl-9 pr-3 py-2 bg-secondary/50 border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          {/* List */}
          <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-1">
            {filteredFoods.length > 0 ? (
              filteredFoods.map((f, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onSelectFood(f)}
                  className={cn(
                    "w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer",
                    selectedAddFood.name === f.name
                      ? "bg-foreground text-background font-bold"
                      : "hover:bg-secondary text-foreground",
                  )}
                >
                  <span>{f.name}</span>
                </button>
              ))
            ) : (
              <div className="p-3 rounded-xl bg-secondary/40 border border-border/60 text-xs text-foreground flex items-center justify-between">
                <span>
                  Agregar <strong>"{foodSearchQuery.trim()}"</strong> como ingrediente
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {addGrams}g
                </span>
              </div>
            )}
          </div>

          {/* Grams Selector */}
          <div className="p-3 bg-secondary/30 rounded-2xl border border-border/40 flex items-center justify-between">
            <span className="text-xs font-bold text-foreground">Porción (gramos)</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onAddGramsChange(Math.max(10, addGrams - 25))}
                className="w-7 h-7 rounded-xl bg-background text-foreground flex items-center justify-center font-bold cursor-pointer"
              >
                -
              </button>
              <input
                type="number"
                min={5}
                max={1500}
                value={addGrams}
                onChange={(e) =>
                  onAddGramsChange(Math.max(5, parseInt(e.target.value, 10) || 50))
                }
                className="text-xs font-mono font-bold w-14 text-center bg-background rounded-lg py-1 border border-border text-foreground"
              />
              <button
                type="button"
                onClick={() => onAddGramsChange(addGrams + 25)}
                className="w-7 h-7 rounded-xl bg-background text-foreground flex items-center justify-center font-bold cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-border/40 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl font-semibold text-xs cursor-pointer"
          >
            Cancelar
          </Button>
          <Button
            onClick={onSubmit}
            className="rounded-xl font-bold text-xs bg-foreground text-background cursor-pointer"
          >
            Agregar al Plato
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export interface LogEmptyFoodModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  emptyFoodName: string;
  onEmptyFoodNameChange: (val: string) => void;
  emptyFoodCalories: string;
  onEmptyFoodCaloriesChange: (val: string) => void;
  emptyFoodServing: string;
  onEmptyFoodServingChange: (val: string) => void;
  emptyFoodProtein: string;
  onEmptyFoodProteinChange: (val: string) => void;
  emptyFoodCarbs: string;
  onEmptyFoodCarbsChange: (val: string) => void;
  emptyFoodFat: string;
  onEmptyFoodFatChange: (val: string) => void;
  onSave: () => void;
}

export function LogEmptyFoodModal({
  open,
  onOpenChange,
  emptyFoodName,
  onEmptyFoodNameChange,
  emptyFoodCalories,
  onEmptyFoodCaloriesChange,
  emptyFoodServing,
  onEmptyFoodServingChange,
  emptyFoodProtein,
  onEmptyFoodProteinChange,
  emptyFoodCarbs,
  onEmptyFoodCarbsChange,
  emptyFoodFat,
  onEmptyFoodFatChange,
  onSave,
}: LogEmptyFoodModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl p-6 border border-border bg-card">
        <DialogHeader className="pb-2 border-b border-border/40">
          <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <Pencil className="w-4 h-4 text-emerald-500" />
            Registrar alimento vacío
          </DialogTitle>
        </DialogHeader>

        <div className="py-3 space-y-3">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
              Nombre del alimento
            </label>
            <input
              type="text"
              value={emptyFoodName}
              onChange={(e) => onEmptyFoodNameChange(e.target.value)}
              placeholder="ej. Tarta de zapallitos casera"
              className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Calorías (kcal)
              </label>
              <input
                type="number"
                value={emptyFoodCalories}
                onChange={(e) => onEmptyFoodCaloriesChange(e.target.value)}
                placeholder="250"
                className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Porción / Medida
              </label>
              <input
                type="text"
                value={emptyFoodServing}
                onChange={(e) => onEmptyFoodServingChange(e.target.value)}
                placeholder="1 porción (150g)"
                className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Proteínas (g)
              </label>
              <input
                type="number"
                value={emptyFoodProtein}
                onChange={(e) => onEmptyFoodProteinChange(e.target.value)}
                placeholder="15"
                className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Carbohidratos (g)
              </label>
              <input
                type="number"
                value={emptyFoodCarbs}
                onChange={(e) => onEmptyFoodCarbsChange(e.target.value)}
                placeholder="20"
                className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Grasas (g)
              </label>
              <input
                type="number"
                value={emptyFoodFat}
                onChange={(e) => onEmptyFoodFatChange(e.target.value)}
                placeholder="8"
                className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-border/40 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl font-semibold text-xs"
          >
            Cancelar
          </Button>
          <Button
            onClick={onSave}
            disabled={!emptyFoodName.trim()}
            className="rounded-xl font-bold text-xs bg-foreground text-background"
          >
            Guardar y Registrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
