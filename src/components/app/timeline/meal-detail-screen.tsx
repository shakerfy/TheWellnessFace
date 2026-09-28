import React from "react";
import { ChevronLeft, X, Bookmark, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FoodProfileHero, type FoodQualityLevel } from "@/components/food-profile-hero";
import type { MealIngredientItem } from "@/lib/food-database";

export interface MealMacroDisplay {
  label: string;
  grams: number;
  fillHeight: number;
  fillBg: string;
  textAccent: string;
}

export interface MealDetailScreenProps {
  itemId: string;
  activeImage: string;
  title: string;
  time: string;
  coachFeedback: string;
  totalCalories: number;
  servings: number;
  qualityLevel: FoodQualityLevel;
  qualityLabel: string;
  heroBadges: { id: string; category: string; label: string }[];
  timingFit?: { label: string; type?: "pre_workout" | "post_workout" | "circadian" };
  macros: MealMacroDisplay[];
  ingredients: MealIngredientItem[];
  isAthleteMode: boolean;
  isSavedInModal: boolean;
  onClose: () => void;
  onSave: () => void;
  onToggleSave?: (id: string) => void;
  onToggleSavedInModal: () => void;
  onGoToFix: () => void;
}

export function MealDetailScreen({
  itemId,
  activeImage,
  title,
  time,
  coachFeedback,
  totalCalories,
  servings,
  qualityLevel,
  qualityLabel,
  heroBadges,
  timingFit,
  macros,
  ingredients,
  isAthleteMode,
  isSavedInModal,
  onClose,
  onSave,
  onToggleSave,
  onToggleSavedInModal,
  onGoToFix,
}: MealDetailScreenProps) {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden text-left text-foreground">
      {/* 1. TOP HERO IMAGE SECTION */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-muted shrink-0">
        <img
          src={activeImage}
          alt={title}
          className="w-full h-full object-cover"
        />

        {/* Top Navigation Row */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-4 w-full">
          {/* Frosted Back Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-background/80 backdrop-blur-xl border border-border/60 text-foreground flex items-center justify-center hover:bg-background active:scale-95 transition cursor-pointer shadow-xs"
            aria-label="Cerrar"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Title in center */}
          <span className="text-xs font-bold text-foreground px-3.5 py-1.5 rounded-full bg-background/80 backdrop-blur-xl border border-border/60 shadow-xs tracking-wide">
            Reporte de Nutrición
          </span>

          <div className="flex items-center gap-1.5">
            {onToggleSave && (
              <button
                type="button"
                onClick={onToggleSavedInModal}
                className="w-9 h-9 rounded-full bg-background/80 backdrop-blur-xl border border-border/60 flex items-center justify-center hover:bg-background active:scale-95 transition cursor-pointer shadow-xs text-foreground"
                aria-label="Guardar en Saved Scans"
                title={isSavedInModal ? "Quitar de Saved Scans" : "Guardar en Saved Scans"}
              >
                <Bookmark
                  className={cn("w-4 h-4", isSavedInModal && "fill-foreground text-foreground")}
                />
              </button>
            )}

            {/* Frosted Close X Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-background/80 backdrop-blur-xl border border-border/60 text-foreground flex items-center justify-center hover:bg-background active:scale-95 transition cursor-pointer shadow-xs"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. BOTTOM WHITE SHEET CARD */}
      <div className="-mt-6 relative z-30 rounded-t-[32px] sm:rounded-t-[36px] bg-white dark:bg-background shadow-2xl flex-1 w-full px-5 pt-5 pb-4 flex flex-col justify-between text-left overflow-y-auto custom-scrollbar">
        <div className="space-y-4">
          {/* Title & Calories Row */}
          <div className="pt-0.5 space-y-1">
            <div className="flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-muted-foreground/80" />
              <span className="text-[11px] font-mono text-muted-foreground font-medium">
                {time || "12:46 PM"}
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-foreground tracking-tight line-clamp-2">
                {title}
              </h1>
              <span className="text-sm font-medium text-slate-500 dark:text-muted-foreground font-sans shrink-0">
                {totalCalories}kcal
              </span>
            </div>
          </div>

          {coachFeedback && (
            <p className="text-xs text-slate-500/90 dark:text-muted-foreground leading-relaxed font-normal">
              {coachFeedback}
            </p>
          )}

          {/* HERO WIDGET: ANILLO SELECTOR RADIAL + BADGES */}
          {!isAthleteMode && (
            <FoodProfileHero
              qualityLabel={qualityLabel}
              qualityLevel={qualityLevel}
              badges={heroBadges}
              contextBadge={
                timingFit?.label
                  ? { label: timingFit.label, type: timingFit.type }
                  : undefined
              }
              isAthleteMode={false}
            />
          )}

          {/* 3 VERTICAL MACRO PROGRESS BAR CARDS (Protein, Carbs, Fat) */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 w-full select-none pt-0.5 pb-1">
            {macros.map((macro) => (
              <div
                key={macro.label}
                className="h-36 sm:h-40 rounded-2xl bg-[#f0f4f9] dark:bg-card border border-slate-200/50 dark:border-border p-3 flex flex-col justify-between relative overflow-hidden text-center shadow-2xs"
              >
                {/* Top Macro Label */}
                <span className="text-xs font-normal text-slate-400 dark:text-muted-foreground z-10 pt-0.5">
                  {macro.label}
                </span>

                {/* Vertical Rising Fill Bar */}
                <div
                  style={{ height: `${macro.fillHeight}%` }}
                  className={cn(
                    "absolute bottom-0 left-0 right-0 rounded-b-2xl rounded-t-xl transition-all duration-700 ease-out pointer-events-none",
                    macro.fillBg,
                  )}
                />

                {/* Bottom Grams Text */}
                <span
                  className={cn(
                    "text-sm font-bold z-10 pb-0.5 font-sans tracking-tight",
                    macro.textAccent,
                  )}
                >
                  {macro.grams} g
                </span>
              </div>
            ))}
          </div>

          {/* INGREDIENTS PREVIEW CAROUSEL */}
          {ingredients && ingredients.length > 0 && (
            <div className="space-y-2 pt-1 pb-1 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                  Ingredientes ({ingredients.length})
                </span>
                <button
                  type="button"
                  onClick={onGoToFix}
                  className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                >
                  Ajustar
                </button>
              </div>

              <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1.5 -mx-1 px-1">
                {ingredients.map((ing) => (
                  <div
                    key={ing.id}
                    className="min-w-[125px] sm:min-w-[135px] p-3 rounded-2xl bg-slate-50/80 dark:bg-card border border-slate-200/60 dark:border-border flex flex-col justify-between shrink-0 shadow-2xs text-left"
                  >
                    <span className="text-xs font-bold text-slate-800 dark:text-foreground truncate">
                      {ing.name}
                    </span>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-2 font-mono">
                      <span>{Math.round(ing.grams * servings)}g</span>
                      <span className="font-semibold text-slate-700 dark:text-foreground/80">
                        {Math.round(ing.calories * servings)} cal
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* PINNED FIXED BOTTOM ACTION BUTTONS */}
        <div className="sticky bottom-0 z-40 bg-white/95 dark:bg-background/95 backdrop-blur-md -mx-5 px-5 pt-3 pb-1 border-t border-slate-100 dark:border-border flex items-center gap-2.5 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onGoToFix}
            className="flex-1 rounded-full py-4 h-12 font-bold text-xs border border-slate-200 dark:border-slate-800 text-foreground hover:bg-secondary cursor-pointer shadow-xs"
          >
            <Sparkles className="w-4 h-4 mr-1.5 text-foreground" />
            <span>Ajustar Resultados</span>
          </Button>

          <Button
            type="button"
            onClick={onSave}
            className="flex-1 rounded-full py-4 h-12 font-bold text-xs bg-foreground text-background hover:opacity-90 shadow-md transition cursor-pointer"
          >
            <span>Listo</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
