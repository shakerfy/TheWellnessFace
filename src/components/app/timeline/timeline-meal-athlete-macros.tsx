import React from "react";

export interface MealAthleteMacrosProps {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
}

export function MealAthleteMacros({
  calories,
  protein,
  fat,
  carbs,
  fiber,
}: MealAthleteMacrosProps) {
  return (
    <div className="pt-2 border-t border-border/40 animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-y-1.5 gap-x-2 py-0.5 select-none">
        <div className="flex items-baseline gap-1">
          <span className="text-sm sm:text-base font-black text-foreground tabular-nums">
            {calories}
          </span>
          <span className="text-[11px] font-medium text-muted-foreground">
            kcal
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400">
            <span className="text-[10px] font-black uppercase tracking-wider">
              P
            </span>
            <span className="text-xs font-bold tabular-nums text-foreground">
              {protein}g
            </span>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
            <span className="text-[10px] font-black uppercase tracking-wider">
              G
            </span>
            <span className="text-xs font-bold tabular-nums text-foreground">
              {fat}g
            </span>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <span className="text-[10px] font-black uppercase tracking-wider">
              C
            </span>
            <span className="text-xs font-bold tabular-nums text-foreground">
              {carbs}g
            </span>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400">
            <span className="text-[10px] font-black uppercase tracking-wider">
              F
            </span>
            <span className="text-xs font-bold tabular-nums text-foreground">
              {fiber}g
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
