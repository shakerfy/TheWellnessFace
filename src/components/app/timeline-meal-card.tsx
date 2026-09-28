import React, { useRef } from "react";
import { ThumbsUp, ThumbsDown, Sparkles } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FoodProfileHero } from "@/components/food-profile-hero";
import {
  TypewriterMarkdown,
  getMealCoachInsightText,
  getMealDynamicCtas,
} from "./diario-helpers";
import {
  TimelineHydrationCard,
  MealImageBanner,
  MealCardActions,
  MealAthleteMacros,
  TimelineMealCtas,
  calculateMealMacros,
  getMealQualityData,
} from "./timeline";

export interface TimelineMealCardProps {
  item: any;
  isAthleteMode: boolean;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onEdit: (item: any) => void;
  onToggleSave: (id: string) => void;
  onDelete: (id: string) => void;
  onFeedback: (id: string, feedback: "like" | "dislike") => void;
  expandedCtaId?: string | null;
  onToggleCta: (itemId: string, ctaId: string) => void;
  loggedMicroAction?: { type: string; level?: number };
  onAddAccompaniment: (itemId: string, accompaniment: string) => void;
  onCompleteBreathing: (itemId: string) => void;
  doubleTapAnimationId?: string | null;
  onDoubleTapLike?: (itemId: string) => void;
}

export function TimelineMealCard({
  item,
  isAthleteMode,
  isExpanded,
  onToggleExpand,
  onEdit,
  onToggleSave,
  onDelete,
  onFeedback,
  expandedCtaId,
  onToggleCta,
  loggedMicroAction,
  onAddAccompaniment,
  onCompleteBreathing,
  doubleTapAnimationId,
  onDoubleTapLike,
}: TimelineMealCardProps) {
  const lastTapRef = useRef<{ id: string; time: number }>({ id: "", time: 0 });
  const touchStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Hydration card variant
  if (item.type === "hydration") {
    return (
      <TimelineHydrationCard
        item={item}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
  }

  // Meal Macros calculations
  const { mealCalories, mealProtein, mealCarbs, mealFat, mealFiber } =
    calculateMealMacros(item);

  const dynamicCtas = getMealDynamicCtas(item);
  const coachInsightText = getMealCoachInsightText(item);

  // Quality and Vector Badges
  const { heroBadges, qualityLevel, qualityLabel, contextBadge } =
    getMealQualityData(item, mealProtein, mealFiber);

  return (
    <Card
      onClick={(e) => {
        if (
          (e.target as HTMLElement)?.closest(
            'button, a, input, select, textarea, [role="button"]',
          )
        ) {
          return;
        }
        onEdit(item);
      }}
      onDoubleClick={(e) => {
        if (
          (e.target as HTMLElement)?.closest(
            'button, a, input, select, textarea, [role="button"]',
          )
        ) {
          return;
        }
        e.stopPropagation();
        onDoubleTapLike?.(item.id);
      }}
      onTouchStart={(e) => {
        if (e.touches.length === 1) {
          touchStartPosRef.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
          };
        }
      }}
      onTouchEnd={(e) => {
        if (
          (e.target as HTMLElement)?.closest(
            'button, a, input, select, textarea, [role="button"]',
          )
        ) {
          return;
        }
        if (e.changedTouches.length === 1) {
          const dx = Math.abs(
            e.changedTouches[0].clientX - touchStartPosRef.current.x,
          );
          const dy = Math.abs(
            e.changedTouches[0].clientY - touchStartPosRef.current.y,
          );
          if (dx < 15 && dy < 15) {
            const now = Date.now();
            const diff = now - lastTapRef.current.time;
            if (
              lastTapRef.current.id === item.id &&
              diff < 350 &&
              diff > 40
            ) {
              onDoubleTapLike?.(item.id);
              lastTapRef.current = { id: "", time: 0 };
            } else {
              lastTapRef.current = { id: item.id, time: now };
            }
          }
        }
      }}
      className="relative rounded-3xl border border-border bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg cursor-pointer select-none"
    >
      {/* Animación Pop de Doble Toque (Like Burst) */}
      {doubleTapAnimationId === item.id && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none rounded-3xl overflow-hidden bg-black/10 backdrop-blur-[1px] animate-in fade-in zoom-in-75 duration-200">
          <div className="p-4 rounded-full bg-background/90 dark:bg-background/95 shadow-2xl border border-border/80 flex items-center justify-center animate-in zoom-in-75 duration-200">
            <ThumbsUp className="w-10 h-10 sm:w-12 sm:h-12 text-foreground fill-foreground drop-shadow-sm" />
          </div>
        </div>
      )}

      {/* Image Banner */}
      <MealImageBanner
        item={item}
        onToggleSave={onToggleSave}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      {/* Card Header */}
      <CardHeader className="p-5 pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-0 text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-base sm:text-lg font-black leading-tight text-foreground">
                {item.title}
              </CardTitle>
              {item.isAiSuggestion && (
                <Badge
                  variant="outline"
                  className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] font-black rounded-full px-2 py-0.5 shadow-none flex items-center gap-1 shrink-0"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Sugerencia IA</span>
                </Badge>
              )}
            </div>
            {item.subtitle ? (
              <CardDescription className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {item.subtitle}
              </CardDescription>
            ) : null}
          </div>

          {!item.img && (
            <MealCardActions
              item={item}
              onToggleSave={onToggleSave}
              onEdit={onEdit}
              onDelete={onDelete}
              className="bg-secondary/80 px-1.5 py-1 shrink-0"
            />
          )}
        </div>
      </CardHeader>

      {/* Card Content */}
      <CardContent className="px-5 pb-4 pt-0 space-y-3.5">
        <div className="space-y-3 pt-0.5 text-left">
          {/* VALOR NUTRICIONAL: Dial radial con badges cualitativos (Visible en Modo Wellness) */}
          {!isAthleteMode && (
            <div className="pb-0.5">
              <FoodProfileHero
                qualityLabel={qualityLabel}
                qualityLevel={qualityLevel}
                badges={heroBadges}
                contextBadge={contextBadge}
              />
            </div>
          )}

          {/* MODO ATLETA: Barra horizontal compacta de macros */}
          {isAthleteMode && (
            <MealAthleteMacros
              calories={mealCalories}
              protein={mealProtein}
              fat={mealFat}
              carbs={mealCarbs}
              fiber={mealFiber}
            />
          )}

          {/* Fila con Botón Ver Insight y Reacciones (Mg / No Mg) */}
          <div className="flex items-center justify-between gap-2 py-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand(item.id);
              }}
              className="relative z-10 rounded-full px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 bg-secondary/80 hover:bg-secondary text-foreground border border-border/80 hover:border-foreground/30 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 transition-all duration-300 cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-foreground/80 shrink-0" />
              <span>{isExpanded ? "Ocultar insight" : "Ver insight"}</span>
            </button>

            <div className="flex items-center gap-0.5 shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onFeedback(item.id, "like");
                }}
                className="p-1.5 flex items-center justify-center transition-transform active:scale-75 cursor-pointer text-muted-foreground/60 hover:text-foreground"
                title="Me gusta"
                aria-label="Me gusta"
              >
                <ThumbsUp
                  className={cn(
                    "w-4 h-4 transition-all duration-200",
                    item.feedback === "like"
                      ? "fill-foreground text-foreground scale-110"
                      : "stroke-[1.75] hover:scale-110",
                  )}
                />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onFeedback(item.id, "dislike");
                }}
                className="p-1.5 flex items-center justify-center transition-transform active:scale-75 cursor-pointer text-muted-foreground/60 hover:text-foreground"
                title="No me gusta"
                aria-label="No me gusta"
              >
                <ThumbsDown
                  className={cn(
                    "w-4 h-4 transition-all duration-200",
                    item.feedback === "dislike"
                      ? "fill-foreground text-foreground scale-110"
                      : "stroke-[1.75] hover:scale-110",
                  )}
                />
              </button>
            </div>
          </div>

          {/* Sección de Insight Expandida */}
          {isExpanded && (
            <div className="pt-1 pb-1 space-y-3.5 text-left animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="p-3.5 sm:p-4 rounded-2xl border border-border/50 bg-secondary/20 hover:border-foreground/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <TypewriterMarkdown
                  content={coachInsightText}
                  className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed font-normal"
                />
              </div>

              {/* CTAs Dinámicos */}
              <TimelineMealCtas
                item={item}
                dynamicCtas={dynamicCtas}
                expandedCtaId={expandedCtaId}
                onToggleCta={onToggleCta}
                loggedMicroAction={loggedMicroAction}
                onAddAccompaniment={onAddAccompaniment}
                onCompleteBreathing={onCompleteBreathing}
              />
            </div>
          )}
        </div>
      </CardContent>

      <div className="md:hidden px-5 pb-4 text-xs font-semibold text-muted-foreground text-left">
        <span>{item.time}</span>
      </div>
    </Card>
  );
}
