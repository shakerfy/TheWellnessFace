import React from "react";
import { Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";


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
