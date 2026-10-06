import React from "react";
import { cn } from "@/lib/utils";
import {
  MealIngredientItem,
  NutritionVectorBadge,
  getOrderedNutritionReportRows,
} from "@/lib/scan-data";

export interface ScanNutrientListProps {
  sampleId?: string;
  title?: string;
  vectorBadges?: NutritionVectorBadge[];
  ingredients?: MealIngredientItem[];
  servings?: number;
  totalProtein?: number;
  totalFiber?: number;
  totalFat?: number;
  totalCarbs?: number;
  hideHeader?: boolean;
  className?: string;
}

export function ScanNutrientList({
  sampleId,
  vectorBadges = [],
  ingredients = [],
  servings = 1,
  totalProtein,
  totalFiber,
  totalFat,
  totalCarbs,
  hideHeader = false,
  className,
}: ScanNutrientListProps) {
  const rows = React.useMemo(() => {
    return getOrderedNutritionReportRows(
      vectorBadges,
      ingredients,
      servings,
      sampleId,
      {
        protein: totalProtein,
        fiber: totalFiber,
        fat: totalFat,
        carbs: totalCarbs,
      },
    );
  }, [
    vectorBadges,
    ingredients,
    servings,
    sampleId,
    totalProtein,
    totalFiber,
    totalFat,
    totalCarbs,
  ]);

  return (
    <div className={cn("w-full space-y-1.5 text-left select-none", className)}>
      {!hideHeader && (
        <div className="flex items-center justify-between px-0.5">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
            Análisis Nutricional
          </span>
        </div>
      )}

      <div className="rounded-xl border border-border/50 bg-secondary/20 dark:bg-card/40 divide-y divide-border/25 overflow-hidden">
        {rows.map((row) => (
          <div
            key={row.category}
            className="flex items-center justify-between py-2 px-3 transition-colors hover:bg-secondary/40"
          >
            {/* Left: Etiqueta del Vector Nutricional */}
            <div className="flex items-center shrink-0 pr-2">
              {row.isSubItem ? (
                <div className="flex items-center gap-1.5 pl-3 text-muted-foreground">
                  <span className="text-[10px] text-muted-foreground/50 select-none font-mono leading-none">
                    ↳
                  </span>
                  <span className="text-[11px] sm:text-xs font-normal text-muted-foreground/80 tracking-tight whitespace-nowrap">
                    {row.label}
                  </span>
                </div>
              ) : (
                <span className="text-[11px] sm:text-xs font-medium text-foreground tracking-tight whitespace-nowrap">
                  {row.label}
                </span>
              )}
            </div>

            {/* Right: Valor Cualitativo */}
            <div className="min-w-0 flex-1 text-right pl-2">
              <span
                className={cn(
                  "text-[11px] sm:text-xs tracking-tight truncate block",
                  row.isSubItem
                    ? "font-normal text-muted-foreground/80"
                    : "font-normal text-foreground/90",
                )}
                title={row.value}
              >
                {row.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ScanNutrientList;
