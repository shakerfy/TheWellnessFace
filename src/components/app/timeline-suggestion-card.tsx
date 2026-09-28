import React, { useState } from "react";
import {
  Sparkles,
  Check,
  Bookmark,
  Trash2,
  ChevronUp,
  ChevronDown,
  ThumbsUp,
  ThumbsDown,
  Utensils,
  ArrowRightLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TypewriterText } from "@/components/typewriter";
import { resolveSuggestionIngredients } from "./diario-helpers";

export interface TimelineSuggestionCardProps {
  item: any;
  onToggleConsumed: (id: string) => void;
  onConsumeOption: (
    id: string,
    optionIndex: number,
    macros?: { calories: number; protein: number; carbs: number; fat: number },
  ) => void;
  onToggleSave: (id: string) => void;
  onDelete: (id: string) => void;
  onLike?: (id: string) => void;
  onDislike?: (id: string) => void;
  onFeedbackChange?: (id: string, feedback: null) => void;
  onSwapIngredient?: (itemId: string, ingredientIndex: number) => void;
}

export function TimelineSuggestionCard({
  item,
  onToggleConsumed,
  onConsumeOption,
  onToggleSave,
  onDelete,
  onLike,
  onDislike,
  onFeedbackChange,
  onSwapIngredient,
}: TimelineSuggestionCardProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);

  // Dynamic Suggestion variant (ai_suggestion)
  if (item.type === "ai_suggestion") {
    const singleOpt = Array.isArray(item.options) && item.options[0];
    const optCals = typeof singleOpt === "object" ? singleOpt.calories : 380;
    const optProt = typeof singleOpt === "object" ? singleOpt.protein : 28;
    const optCarbs = typeof singleOpt === "object" ? singleOpt.carbs : 40;
    const optFat = typeof singleOpt === "object" ? singleOpt.fat : 12;

    return (
      <Card className="relative rounded-3xl border border-border bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg cursor-pointer select-none">
        <div className="flex flex-col p-5 sm:p-6 space-y-4 text-left">
          {/* 1. Header con Badge Contextual y Action Pill */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                Sugerencia del momento
              </span>
            </div>

          <div className="flex items-center gap-1 bg-secondary/80 backdrop-blur-md px-1.5 py-1 rounded-full border border-border/60 shadow-xs shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (item.consumed) {
                  onToggleConsumed(item.id);
                } else {
                  onConsumeOption(item.id, 0, {
                    calories: optCals,
                    protein: optProt,
                    carbs: optCarbs,
                    fat: optFat,
                  });
                }
              }}
              className={cn(
                "flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer",
                item.consumed
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold"
                  : "text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/10",
              )}
              title={item.consumed ? "Consumida (clic para desmarcar)" : "Marcar como consumida"}
            >
              <Check className={cn("w-3.5 h-3.5", item.consumed ? "stroke-[3]" : "stroke-[2]")} />
              <span>{item.consumed ? "Consumida" : "Consumir"}</span>
            </button>

            <span className="w-px h-3.5 bg-border/60 mx-0.5" />

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(item.id);
              }}
              className={cn(
                "p-1 transition cursor-pointer",
                item.isSaved || item.saved
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
              title={
                item.isSaved || item.saved
                  ? "Guardado en Saved Scans (clic para quitar)"
                  : "Guardar en Saved Scans"
              }
            >
              <Bookmark
                className={cn(
                  "w-3.5 h-3.5",
                  item.isSaved || item.saved ? "fill-foreground text-foreground" : "",
                )}
              />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
              className="p-1 text-muted-foreground hover:text-rose-500 transition cursor-pointer"
              title="Descartar sugerencia"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2. Título Contextual */}
        <div>
          <h3 className="text-base sm:text-lg font-black leading-tight text-foreground">
            {item.title}
          </h3>
        </div>

        {/* 3. Opción Única con efecto Typewriter y Desplegable 'Ver más' */}
        {Array.isArray(item.options) &&
          item.options.slice(0, 1).map((opt: any, optIdx: number) => {
            const optText = typeof opt === "string" ? opt : opt.text;
            return (
              <div key={item.streamKey || optIdx} className="space-y-3">
                <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed font-normal pt-0.5">
                  <TypewriterText text={optText} speed={16} />
                </p>

                <div className="flex items-center justify-start gap-2 w-full pt-0.5">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDetailsOpen(!isDetailsOpen);
                    }}
                    className="rounded-2xl h-8 px-3 text-xs font-medium border-border/30 bg-secondary/20 hover:bg-secondary/40 text-foreground transition-all cursor-pointer flex items-center gap-1.5 shadow-none"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate">{isDetailsOpen ? "Ver menos" : "Ver más"}</span>
                    {isDetailsOpen ? (
                      <ChevronUp className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    )}
                  </Button>
                </div>

                {/* Bloque desplegable de Información Nutricional */}
                {isDetailsOpen && (
                  <div className="pt-3.5 space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-200 border-t border-border/40 text-left">
                    <div className="grid grid-cols-4 gap-1.5 sm:gap-2 w-full select-none">
                      <div className="px-1 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-secondary/40 border border-border/60 flex flex-col items-center justify-center text-center shadow-2xs min-w-0">
                        <span className="text-[7px] sm:text-[7.5px] font-bold uppercase text-muted-foreground/80 leading-none">
                          Calorías
                        </span>
                        <span className="text-[11px] sm:text-xs font-black text-foreground tabular-nums leading-tight mt-0.5">
                          {optCals}
                        </span>
                      </div>
                      <div className="px-1 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/20 flex flex-col items-center justify-center text-center shadow-2xs min-w-0">
                        <span className="text-[7px] sm:text-[7.5px] font-bold uppercase text-emerald-700 dark:text-emerald-400 leading-none">
                          Proteínas
                        </span>
                        <span className="text-[11px] sm:text-xs font-black text-emerald-700 dark:text-emerald-400 tabular-nums leading-tight mt-0.5">
                          {optProt}g
                        </span>
                      </div>
                      <div className="px-1 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/20 flex flex-col items-center justify-center text-center shadow-2xs min-w-0">
                        <span className="text-[7px] sm:text-[7.5px] font-bold uppercase text-amber-700 dark:text-amber-400 leading-none">
                          Carbos
                        </span>
                        <span className="text-[11px] sm:text-xs font-black text-amber-700 dark:text-amber-400 tabular-nums leading-tight mt-0.5">
                          {optCarbs}g
                        </span>
                      </div>
                      <div className="px-1 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-sky-500/10 dark:bg-sky-950/30 border border-sky-500/20 flex flex-col items-center justify-center text-center shadow-2xs min-w-0">
                        <span className="text-[7px] sm:text-[7.5px] font-bold uppercase text-sky-700 dark:text-sky-400 leading-none">
                          Grasas
                        </span>
                        <span className="text-[11px] sm:text-xs font-black text-sky-700 dark:text-sky-400 tabular-nums leading-tight mt-0.5">
                          {optFat}g
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

        {/* 4. Feedback Interactivo Neutral */}
        <div className="pt-2 border-t border-border/40 space-y-3">
          {item.feedback === "like" ? (
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-secondary/40 border border-border/60 text-muted-foreground animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                <Check className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span>Guardado en tus gustos y preferencias</span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onFeedbackChange?.(item.id, null);
                }}
                className="text-[10px] font-semibold text-muted-foreground hover:text-foreground underline cursor-pointer"
              >
                Cambiar
              </button>
            </div>
          ) : item.feedback === "dislike" ? (
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-secondary/40 border border-border/60 text-muted-foreground animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                <Check className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span>Registrado para futuras sugerencias</span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onFeedbackChange?.(item.id, null);
                }}
                className="text-[10px] font-semibold text-muted-foreground hover:text-foreground underline cursor-pointer"
              >
                Cambiar
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onLike?.(item.id);
                }}
                className="h-8 rounded-xl text-xs font-medium gap-1.5 border-border/70 bg-secondary/30 hover:bg-secondary/70 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Me gusta</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDislike?.(item.id);
                }}
                className="h-8 rounded-xl text-xs font-medium gap-1.5 border-border/70 bg-secondary/30 hover:bg-secondary/70 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <ThumbsDown className="w-3.5 h-3.5 text-muted-foreground" />
                <span>No me gusta</span>
              </Button>
            </div>
          )}
        </div>

        {/* 5. Disclaimer */}
        <p className="text-[10px] sm:text-[11px] text-muted-foreground/70 leading-snug pt-1 text-left font-normal">
          Las sugerencias nutricionales por IA son orientativas y aproximadas. Revisa siempre los detalles nutricionales e ingredientes importantes.
        </p>
        </div>
      </Card>
    );
  }

  // Recipe Suggestion variant (item.isAiSuggestion)
  const rawDesc = item.desc || item.narrative || "";
  let cleanDesc = rawDesc;
  if (/Fórmula (Nutricional|Post-Entreno|Regenerativa|Energética|balanceada):/i.test(rawDesc)) {
    const lower = (item.contextBadge || item.subtitle || rawDesc).toLowerCase();
    if (lower.includes("post-entreno") || lower.includes("recarga")) {
      cleanDesc = "Combinación ideal para reponer energía y ayudar a tus músculos a recuperarse después del entrenamiento.";
    } else if (lower.includes("nocturna") || lower.includes("cena") || lower.includes("descanso")) {
      cleanDesc = "Plato ligero y de fácil digestión para nutrirte bien y favorecer un descanso profundo.";
    } else if (lower.includes("desayuno") || lower.includes("mañana") || lower.includes("energético")) {
      cleanDesc = "Energía constante y buena saciedad para empezar la mañana con claridad y vitalidad.";
    } else {
      cleanDesc = "Combinación equilibrada de proteína y energía limpia para mantenerte activo durante el día sin pesadez.";
    }
  } else {
    const cleaned = rawDesc
      .replace(/^Para [^:]+:\s*/i, "")
      .replace(/^Para (tu|arrancar|el|sostener|la)[^,]+,\s*(te sugiero\s*)?/i, "")
      .replace(/(En porciones de mano[^.]*\.)/gi, "")
      .trim();
    cleanDesc = cleaned ? cleaned.charAt(0).toUpperCase() + cleaned.slice(1) : rawDesc;
  }

  const ingList = resolveSuggestionIngredients(item);

  return (
    <Card className="relative rounded-3xl border border-border bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg cursor-pointer select-none">
      <div className="flex flex-col p-5 space-y-4 text-left">
      {/* 1. Header con Badge Contextual y Action Pill */}
      <div className="flex items-center justify-between gap-3 text-left">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
            Sugerencia con IA
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-secondary/80 backdrop-blur-md px-2 py-1 rounded-full border border-border/60 shadow-xs shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleConsumed(item.id);
            }}
            className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer group"
            title={item.consumed ? "Comida marcada como consumida (toca para desmarcar)" : "Marcar comida como consumida"}
          >
            <div
              className={cn(
                "w-4 h-4 rounded-md border flex items-center justify-center transition-all shadow-2xs",
                item.consumed
                  ? "bg-emerald-600 border-emerald-600 text-white"
                  : "border-muted-foreground/40 bg-background hover:border-emerald-500",
              )}
            >
              {item.consumed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
            </div>
            <span
              className={cn(
                "text-[10px] font-bold uppercase tracking-wider transition-colors",
                item.consumed
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-muted-foreground group-hover:text-foreground",
              )}
            >
              {item.consumed ? "Consumida" : "Consumir"}
            </span>
          </button>

          <span className="w-px h-3 bg-border/60 mx-0.5" />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(item.id);
            }}
            className={cn(
              "p-1 transition cursor-pointer",
              item.isSaved || item.saved
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
            title={
              item.isSaved || item.saved
                ? "Guardado en Saved Scans (clic para quitar)"
                : "Guardar en Saved Scans"
            }
          >
            <Bookmark
              className={cn(
                "w-3.5 h-3.5",
                item.isSaved || item.saved ? "fill-foreground text-foreground" : "",
              )}
            />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            className="p-1 text-muted-foreground hover:text-rose-500 transition cursor-pointer"
            title="Eliminar sugerencia"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Título y Por qué fisiológico */}
      <div className="space-y-1.5 text-left">
        <h3 className="text-base sm:text-lg font-black leading-tight text-foreground">
          {item.title ? item.title.charAt(0).toUpperCase() + item.title.slice(1) : ""}
        </h3>
        <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed font-normal">
          {cleanDesc}
        </p>
      </div>

      {/* 3. Ingredientes en Checklist */}
      {ingList && ingList.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-border/50 text-left">
          <div className="flex items-center justify-between pb-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-emerald-500" />
              <span>Ingredientes</span>
            </span>
            <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
              <ArrowRightLeft className="w-3 h-3 text-emerald-500" />
              <span>Toca para alternar</span>
            </span>
          </div>

          <div className="space-y-1.5">
            {ingList.map((ing: any, idx: number) => {
              const ingName = typeof ing === "object" && ing !== null ? ing.name : String(ing);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSwapIngredient?.(item.id, idx);
                  }}
                  className="group w-full px-3 py-2.5 rounded-2xl bg-secondary/30 hover:bg-secondary/70 border border-border/50 hover:border-emerald-500/40 text-xs font-semibold text-foreground flex items-center justify-between gap-3 transition-all cursor-pointer text-left shadow-2xs hover:-translate-y-0.5"
                  title="Toca para alternar este ingrediente por otra opción saludable"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-4 h-4 rounded-md border border-emerald-500/60 bg-emerald-500/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 shadow-2xs">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="font-medium text-foreground text-xs leading-tight truncate">
                      {ingName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground shrink-0 group-hover:text-emerald-500 font-bold bg-background/70 px-2 py-0.5 rounded-lg border border-border/40">
                    <ArrowRightLeft className="w-3 h-3" />
                    <span className="hidden xs:inline">Alternar</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Desplegable de Detalles & Insights */}
      <div className="pt-1 space-y-3">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsInsightsOpen(!isInsightsOpen);
          }}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-2xl bg-secondary/20 hover:bg-secondary/40 text-xs font-medium text-foreground/80 hover:text-foreground transition-all cursor-pointer border border-border/30 shadow-none"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>{isInsightsOpen ? "Ver menos" : "Ver más"}</span>
          </span>
          {isInsightsOpen ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        {isInsightsOpen && (
          <div className="pt-1 space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-200 border-t border-border/40 text-left">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                Macronutrientes Estimados
              </span>
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2 w-full select-none">
                <div className="px-1 py-1.5 sm:py-2 rounded-xl bg-secondary/40 border border-border/60 flex flex-col items-center justify-center text-center shadow-2xs min-w-0">
                  <span className="text-[7.5px] font-bold uppercase text-muted-foreground/80 leading-none">
                    Calorías
                  </span>
                  <span className="text-xs font-black text-foreground tabular-nums leading-tight mt-0.5">
                    {item.calories || 420}
                  </span>
                </div>
                <div className="px-1 py-1.5 sm:py-2 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/20 flex flex-col items-center justify-center text-center shadow-2xs min-w-0">
                  <span className="text-[7.5px] font-bold uppercase text-emerald-700 dark:text-emerald-400 leading-none">
                    Proteínas
                  </span>
                  <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 tabular-nums leading-tight mt-0.5">
                    {item.protein || 32}g
                  </span>
                </div>
                <div className="px-1 py-1.5 sm:py-2 rounded-xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/20 flex flex-col items-center justify-center text-center shadow-2xs min-w-0">
                  <span className="text-[7.5px] font-bold uppercase text-amber-700 dark:text-amber-400 leading-none">
                    Carbos
                  </span>
                  <span className="text-xs font-black text-amber-700 dark:text-amber-400 tabular-nums leading-tight mt-0.5">
                    {item.carbs || 45}g
                  </span>
                </div>
                <div className="px-1 py-1.5 sm:py-2 rounded-xl bg-sky-500/10 dark:bg-sky-950/30 border border-sky-500/20 flex flex-col items-center justify-center text-center shadow-2xs min-w-0">
                  <span className="text-[7.5px] font-bold uppercase text-sky-700 dark:text-sky-400 leading-none">
                    Grasas
                  </span>
                  <span className="text-xs font-black text-sky-700 dark:text-sky-400 tabular-nums leading-tight mt-0.5">
                    {item.fat || 12}g
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </Card>
);
}
