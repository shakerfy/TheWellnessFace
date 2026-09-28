import React from "react";
import { Calendar } from "lucide-react";
import { TimelineSuggestionCard } from "../timeline-suggestion-card";
import { TimelineMealCard } from "../timeline-meal-card";
import { TimelineActivityCard } from "../timeline-activity-card";

export interface TimelineFeedProps {
  timelineItems: any[];
  isAthleteMode: boolean;
  expandedMealInsights: Record<string, boolean>;
  toggleMealInsights: (id: string) => void;
  expandedMealCta: Record<string, string | null>;
  toggleMealCta: (mealId: string, ctaId: string) => void;
  loggedMicroActions: Record<string, any>;
  setLoggedMicroActions: React.Dispatch<React.SetStateAction<any>>;
  doubleTapAnimationId: string | null;
  onToggleMealConsumed: (id: string) => void;
  onConsumeOption: (id: string, optIdx: number, macros?: any) => void;
  onToggleSave: (id: string) => void;
  onDelete: (id: string) => void;
  onFeedback: (id: string, type: "like" | "dislike") => void;
  onSwapIngredient: (id: string, idx: number) => void;
  onEdit: (item: any) => void;
  onAddAccompaniment: (mealId: string, name: string) => void;
  onDoubleTapLike: (mealId: string) => void;
}

export function TimelineFeed({
  timelineItems,
  isAthleteMode,
  expandedMealInsights,
  toggleMealInsights,
  expandedMealCta,
  toggleMealCta,
  loggedMicroActions,
  setLoggedMicroActions,
  doubleTapAnimationId,
  onToggleMealConsumed,
  onConsumeOption,
  onToggleSave,
  onDelete,
  onFeedback,
  onSwapIngredient,
  onEdit,
  onAddAccompaniment,
  onDoubleTapLike,
}: TimelineFeedProps) {
  return (
    <div className="space-y-3">
      {/* Header de la Línea de Tiempo */}
      <div className="flex items-center justify-between pt-1 pb-0.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
          Línea de Tiempo
        </span>
      </div>

      {/* Timeline */}
      <div className="relative">
        {timelineItems.length === 0 ? (
          <div className="text-center py-12 px-6 rounded-3xl border border-dashed border-border/80 bg-card/40 my-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-secondary/60 flex items-center justify-center mx-auto text-muted-foreground shadow-2xs">
              <Calendar className="w-5 h-5 text-muted-foreground/80" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-foreground">Sin registros en este día</h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                No hay comidas ni actividades registradas para esta fecha. Usa el botón (+) para registrar una nueva actividad.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Vertical Line */}
            <div className="absolute left-3.5 md:left-[50%] top-0 bottom-0 w-[2px] bg-border transform -translate-x-1/2 md:-translate-x-[1px]" />

            {timelineItems
              .filter((item) => item.type !== "hydration")
              .map((item, index) => {
                const isEven = index % 2 === 0;
                const showOnLeft = !isEven; // Zig-zag on desktop

                return (
                  <React.Fragment key={item.id}>
                    <div className="relative mb-12 md:grid md:grid-cols-2 md:gap-12 items-center group">
                      {/* Timeline Dot */}
                      <div className="absolute left-3.5 md:left-1/2 w-4 h-4 rounded-full border-4 bg-background z-10 transform -translate-x-1/2 border-muted-foreground/30" />

                      {/* Time Label for Desktop */}
                      <div
                        className={`hidden md:block ${showOnLeft ? "text-right pr-6 md:order-2" : "text-left pl-6 md:order-1"}`}
                      >
                        <span className="font-bold text-base text-muted-foreground">
                          {item.time}
                        </span>
                        <p className="text-muted-foreground/60 text-xs mt-0.5">{item.subtitle}</p>
                      </div>

                      {/* Card Container */}
                      <div className={`pl-7 sm:pl-8 md:pl-0 w-full min-w-0 ${showOnLeft ? "md:order-1" : "md:order-2"}`}>
                        {item.type === "ai_suggestion" || item.isAiSuggestion ? (
                          <TimelineSuggestionCard
                            item={item}
                            onToggleConsumed={onToggleMealConsumed}
                            onConsumeOption={(id, optIdx, macros) =>
                              onConsumeOption(
                                id,
                                optIdx,
                                macros || { calories: 380, protein: 28, carbs: 40, fat: 12 },
                              )
                            }
                            onToggleSave={onToggleSave}
                            onDelete={onDelete}
                            onLike={(id) => onFeedback(id, "like")}
                            onDislike={(id) => onFeedback(id, "dislike")}
                            onFeedbackChange={(id) => onFeedback(id, "like")}
                            onSwapIngredient={onSwapIngredient}
                          />
                        ) : item.type === "meal" || item.type === "hydration" ? (
                          <TimelineMealCard
                            item={item}
                            isAthleteMode={isAthleteMode}
                            isExpanded={!!expandedMealInsights[item.id]}
                            onToggleExpand={toggleMealInsights}
                            onEdit={onEdit}
                            onToggleSave={onToggleSave}
                            onDelete={onDelete}
                            onFeedback={onFeedback}
                            expandedCtaId={expandedMealCta[item.id]}
                            onToggleCta={toggleMealCta}
                            loggedMicroAction={loggedMicroActions[item.id] || undefined}
                            onAddAccompaniment={onAddAccompaniment}
                            onCompleteBreathing={(mealId) => {
                              setLoggedMicroActions((prev: any) => ({
                                ...prev,
                                [mealId]: {
                                  type: "vagal_pause",
                                  itemId: mealId,
                                  time: new Date().toISOString(),
                                },
                              }));
                            }}
                            doubleTapAnimationId={doubleTapAnimationId}
                            onDoubleTapLike={onDoubleTapLike}
                          />
                        ) : (
                          <TimelineActivityCard
                            item={item}
                            onEdit={onEdit}
                            onToggleSave={onToggleSave}
                            onDelete={onDelete}
                          />
                        )}
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
          </>
        )}
      </div>
    </div>
  );
}
