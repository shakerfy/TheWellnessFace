import React from "react";
import {
  Sparkles,
  Check,
  Apple,
  Droplet,
  Wind,
  PlusCircle,
  Plus,
  Gamepad2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  TypewriterMarkdown,
  InlineArmstrongGuideWidget,
  InlineBreathingGuideWidget,
  getMealCtaMarkdownContent,
  type MealDynamicCta,
} from "../diario-helpers";
import { MealMiniGameDispatcher, type MiniGameResult } from "../mini-games";

export interface TimelineMealCtasProps {
  item: any;
  dynamicCtas: MealDynamicCta[];
  expandedCtaId?: string | null;
  onToggleCta: (itemId: string, ctaId: string) => void;
  loggedMicroAction?: { type: string; level?: number };
  onAddAccompaniment: (itemId: string, accompaniment: string) => void;
  onCompleteBreathing: (itemId: string) => void;
  onLogArmstrongLevel?: (itemId: string, level: number) => void;
  variant?: "pills" | "accordion";
  className?: string;
}

export function TimelineMealCtas({
  item,
  dynamicCtas,
  expandedCtaId,
  onToggleCta,
  loggedMicroAction,
  onAddAccompaniment,
  onCompleteBreathing,
  onLogArmstrongLevel,
  variant = "pills",
  className,
}: TimelineMealCtasProps) {
  const [completedGames, setCompletedGames] = React.useState<
    Record<string, boolean>
  >(() => {
    if (typeof window === "undefined") return {};
    try {
      const saved = localStorage.getItem("twf_completed_minigames");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleMiniGameComplete = (ctaId: string, _result: MiniGameResult) => {
    const key = `${item.id}_${ctaId}`;
    setCompletedGames((prev) => {
      const updated = { ...prev, [key]: true };
      try {
        localStorage.setItem("twf_completed_minigames", JSON.stringify(updated));
      } catch {
        // Ignorar excepciones de cuota o modo incógnito en localStorage
      }
      return updated;
    });
  };

  if (!dynamicCtas || dynamicCtas.length === 0) return null;

  const getCtaIcon = (iconType?: string) => {
    switch (iconType) {
      case "apple":
        return <Apple className="w-3.5 h-3.5 text-foreground/80 shrink-0" />;
      case "droplet":
        return <Droplet className="w-3.5 h-3.5 text-foreground/80 shrink-0" />;
      case "wind":
        return <Wind className="w-3.5 h-3.5 text-foreground/80 shrink-0" />;
      case "plus":
        return <PlusCircle className="w-3.5 h-3.5 text-foreground/80 shrink-0" />;
      case "gamepad":
        return <Gamepad2 className="w-3.5 h-3.5 text-foreground/80 shrink-0" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-foreground/80 shrink-0" />;
    }
  };

  const renderCtaBody = (
    cta: MealDynamicCta,
    isGameCompleted: boolean,
    currentArmstrongLevel?: number,
  ) => {
    if (cta.gamePayload) {
      return (
        <MealMiniGameDispatcher
          payload={cta.gamePayload}
          initialCompleted={isGameCompleted}
          onComplete={(res) => handleMiniGameComplete(cta.id, res)}
        />
      );
    }

    return (
      <div className="space-y-3">
        <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-border/60 bg-slate-100/50 dark:bg-card/40 hover:border-foreground/30 hover:shadow-xs transition-all duration-300">
          <TypewriterMarkdown
            content={getMealCtaMarkdownContent(cta.id, item)}
            className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed font-normal"
          />
        </div>

        {(cta.id === "evaluate-hydration" ||
          cta.id === "check_hydration_armstrong") && (
          <InlineArmstrongGuideWidget
            selectedLevel={currentArmstrongLevel}
            onSelectLevel={(lvl) => onLogArmstrongLevel?.(item.id, lvl)}
          />
        )}

        {cta.id === "take_a_pause" && (
          <InlineBreathingGuideWidget
            onComplete={() => onCompleteBreathing(item.id)}
          />
        )}

        {cta.id === "add-accompaniment" && (
          <div className="pt-1 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
              Toca para sumar a este plato (1 toque)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                "Agua fresca de apoyo",
                "Café o té sin azúcar",
                "Ensalada de hojas verdes",
                "Fruta fresca",
                "Puñado de frutos secos",
              ].map((acc) => (
                <button
                  key={acc}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddAccompaniment(item.id, acc);
                  }}
                  className="px-3 py-1.5 rounded-full bg-secondary/60 hover:bg-secondary border border-border/60 hover:border-foreground/30 hover:-translate-y-0.5 hover:shadow-xs text-xs font-medium text-foreground transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95"
                >
                  <Plus className="w-3 h-3 text-foreground/70" />
                  <span>{acc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {cta.id === "check-satiety" && (
          <div className="pt-1 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
              Escala de saciedad (1 toque)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {["No hambriento", "Satisfecho", "Muy lleno"].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (typeof navigator !== "undefined" && navigator.vibrate) {
                      navigator.vibrate(15);
                    }
                    toast.success(`Saciedad registrada: ${level}`, {
                      description:
                        "Entrenar esta señal mejora tu conexión natural con la saciedad.",
                    });
                  }}
                  className="px-3 py-1.5 rounded-full bg-secondary/60 hover:bg-secondary border border-border/60 hover:border-foreground/30 hover:-translate-y-0.5 hover:shadow-xs text-xs font-medium text-foreground transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95"
                >
                  <Check className="w-3 h-3 text-foreground/70" />
                  <span>{level}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {cta.id === "check-digestion" && (
          <div className="pt-1 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
              Confort digestivo (1 toque)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                "Liviana y con energía",
                "Confortable",
                "Pesadez o inflamación",
              ].map((state) => (
                <button
                  key={state}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (typeof navigator !== "undefined" && navigator.vibrate) {
                      navigator.vibrate(15);
                    }
                    toast.success(`Digestión registrada: ${state}`, {
                      description:
                        "Guardado en tu diario para identificar qué platos te sientan mejor.",
                    });
                  }}
                  className="px-3 py-1.5 rounded-full bg-secondary/60 hover:bg-secondary border border-border/60 hover:border-foreground/30 hover:-translate-y-0.5 hover:shadow-xs text-xs font-medium text-foreground transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95"
                >
                  <Check className="w-3 h-3 text-foreground/70" />
                  <span>{state}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {cta.id === "check-eating-pace" && (
          <div className="pt-1 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
              Ritmo y entorno (1 toque)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                "Con calma",
                "Ritmo normal",
                "Con prisa / Frente a pantalla",
              ].map((pace) => (
                <button
                  key={pace}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (typeof navigator !== "undefined" && navigator.vibrate) {
                      navigator.vibrate(15);
                    }
                    toast.success(`Ritmo registrado: ${pace}`, {
                      description:
                        pace === "Con prisa / Frente a pantalla"
                          ? "Comer frente a pantallas suele explicar la pesadez más que el alimento en sí."
                          : "Comer sin prisa mejora la señal de saciedad y alivia la digestión.",
                    });
                  }}
                  className="px-3 py-1.5 rounded-full bg-secondary/60 hover:bg-secondary border border-border/60 hover:border-foreground/30 hover:-translate-y-0.5 hover:shadow-xs text-xs font-medium text-foreground transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95"
                >
                  <Check className="w-3 h-3 text-foreground/70" />
                  <span>{pace}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {cta.id === "balance-next-meal" && (
          <div className="pt-1 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
              Recordar en tu próxima comida (1 toque)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                "Sumar hojas verdes / fibra",
                "Priorizar proteína",
                "Semillas o frutos secos",
              ].map((focus) => (
                <button
                  key={focus}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (typeof navigator !== "undefined" && navigator.vibrate) {
                      navigator.vibrate(15);
                    }
                    try {
                      localStorage.setItem("twf_next_meal_focus", focus);
                    } catch (_) {
                      // Ignorar fallo de almacenamiento local
                    }
                    toast.success(`Foco guardado: ${focus}`, {
                      description:
                        "Te lo recordaremos arriba de la cámara cuando registres tu próxima comida.",
                    });
                  }}
                  className="px-3 py-1.5 rounded-full bg-secondary/60 hover:bg-secondary border border-border/60 hover:border-foreground/30 hover:-translate-y-0.5 hover:shadow-xs text-xs font-medium text-foreground transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95"
                >
                  <Plus className="w-3 h-3 text-foreground/70" />
                  <span>{focus}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (variant === "accordion") {
    return (
      <Accordion
        type="single"
        collapsible
        value={expandedCtaId ?? ""}
        onValueChange={(val) => {
          onToggleCta(item.id, val || "");
        }}
        className={cn(
          "w-full rounded-2xl border border-slate-200/80 dark:border-border/80 bg-slate-50/50 dark:bg-card/40 divide-y divide-slate-200/60 dark:divide-border/40 overflow-hidden shadow-2xs",
          className,
        )}
      >
        {dynamicCtas.map((cta) => {
          const isArmstrongLogged =
            loggedMicroAction?.type === "armstrong" &&
            (cta.id === "evaluate-hydration" ||
              cta.id === "check_hydration_armstrong");
          const currentArmstrongLevel = loggedMicroAction?.level;
          const isBreathingLogged =
            loggedMicroAction?.type === "vagal_pause" &&
            cta.id === "take_a_pause";
          const isGameCompleted = Boolean(completedGames[`${item.id}_${cta.id}`]);

          return (
            <AccordionItem
              key={cta.id}
              value={cta.id}
              className="border-0 px-3.5 sm:px-4 py-0 transition-colors"
            >
              <AccordionTrigger className="py-2.5 sm:py-3 hover:no-underline cursor-pointer">
                <div className="flex items-center gap-2 min-w-0 pr-2 flex-1">
                  {getCtaIcon(cta.iconType)}
                  <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-foreground truncate tracking-tight flex-1 min-w-0">
                    {cta.title}
                  </span>
                  {cta.type === "mini_game" && isGameCompleted && (
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ml-1">
                      <Check className="w-3 h-3 stroke-[3]" />
                      Listo
                    </span>
                  )}
                  {isArmstrongLogged && (
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ml-1">
                      <Check className="w-3 h-3 stroke-[3]" />
                      Nivel {currentArmstrongLevel}
                    </span>
                  )}
                  {isBreathingLogged && (
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ml-1">
                      <Check className="w-3 h-3 stroke-[3]" />
                      Realizada
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-3.5 pt-0 text-left">
                {renderCtaBody(cta, isGameCompleted, currentArmstrongLevel)}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    );
  }

  return (
    <>
      {dynamicCtas.map((cta) => {
        const isCtaExpanded = expandedCtaId === cta.id;
        const isArmstrongLogged =
          loggedMicroAction?.type === "armstrong" &&
          (cta.id === "evaluate-hydration" ||
            cta.id === "check_hydration_armstrong");
        const currentArmstrongLevel = loggedMicroAction?.level;
        const isBreathingLogged =
          loggedMicroAction?.type === "vagal_pause" &&
          cta.id === "take_a_pause";
        const isGameCompleted = Boolean(completedGames[`${item.id}_${cta.id}`]);

        return (
          <div key={cta.id} className="space-y-2">
            <div className="flex items-center gap-2 py-0.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleCta(item.id, cta.id);
                }}
                className={cn(
                  "relative z-10 rounded-full px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 border shadow-2xs hover:shadow-xs hover:-translate-y-0.5 transition-all duration-300 cursor-pointer shrink-0 max-w-[95%] sm:max-w-[85%]",
                  isCtaExpanded
                    ? "bg-secondary text-foreground border-foreground/30 shadow-xs"
                    : "bg-secondary/60 hover:bg-secondary text-foreground border-border/80 hover:border-foreground/30",
                )}
              >
                {getCtaIcon(cta.iconType)}
                <span className="truncate flex-1 min-w-0">{cta.title}</span>
                {cta.type === "mini_game" && isGameCompleted && (
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ml-1">
                    <Check className="w-3 h-3 stroke-[3]" />
                    Listo
                  </span>
                )}
                {isArmstrongLogged && (
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ml-1">
                    <Check className="w-3 h-3 stroke-[3]" />
                    Nivel {currentArmstrongLevel}
                  </span>
                )}
                {isBreathingLogged && (
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ml-1">
                    <Check className="w-3 h-3 stroke-[3]" />
                    Realizada
                  </span>
                )}
              </button>
            </div>

            {isCtaExpanded && (
              <div className="px-1 py-1 text-left space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                {renderCtaBody(cta, isGameCompleted, currentArmstrongLevel)}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
