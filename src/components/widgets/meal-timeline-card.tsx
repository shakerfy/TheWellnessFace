import { useState, useRef } from "react";
import { Utensils, Heart, Sparkles, Droplets, Clock, Plus, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface MealVector {
  label: string; // e.g. "Fibra", "Proteína", "Bajo Procesamiento"
  type?: "positive" | "neutral" | "caution";
}

export interface MealTimelineCardProps {
  id?: string;
  title: string;
  time?: string;
  nutritionalValue: "Alto" | "Medio" | "Bajo";
  indicators?: string[]; // 3-4 observable nutritional indicators
  handPortions?: {
    type: "Palma" | "Puño" | "Pulgar" | "Cuenco";
    name: string;
    portionLabel: string; // e.g. "1 palma de salmón"
  }[];
  contextualFit?: {
    badge: string; // e.g. "Ideal Post-Entreno"
    hint: string;
  } | null;
  additionSuggestion?: string; // e.g. "Sumá un vaso de agua fresca o semillas para enriquecer la fibra"
  armstrongLevel?: number; // 1 to 8 if hydration is paired
  isFavorite?: boolean;
  onToggleFavorite?: (id?: string) => void;
  onSaveToTimeline?: () => void;
  className?: string;
}

export function MealTimelineCard({
  id,
  title,
  time = "Hoy",
  nutritionalValue = "Alto",
  indicators = ["Rico en fibra natural", "Proteína de buena asimilación", "Mínimo procesamiento"],
  handPortions = [],
  contextualFit,
  additionSuggestion,
  armstrongLevel,
  isFavorite: initialFavorite = false,
  onToggleFavorite,
  onSaveToTimeline,
  className,
}: MealTimelineCardProps) {
  const [favorite, setFavorite] = useState(initialFavorite);
  const lastTapRef = useRef<number>(0);

  // Doble toque (Double-tap) para Favoritos (Modelo Mental #2 de AGENTS.md)
  const handleTouchEnd = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      setFavorite((prev) => !prev);
      onToggleFavorite?.(id);
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(25);
      }
    }
    lastTapRef.current = now;
  };

  const getNutritionalBadgeClass = (val: string) => {
    switch (val) {
      case "Alto":
        return "bg-secondary text-foreground border-border/80";
      case "Medio":
        return "bg-secondary/70 text-foreground/90 border-border/60";
      default:
        return "bg-secondary/50 text-muted-foreground border-border/40";
    }
  };

  return (
    <div
      onTouchEnd={handleTouchEnd}
      className={cn(
        "group relative flex flex-col justify-between rounded-3xl border border-border bg-card p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg select-none",
        className
      )}
    >
      <div>
        {/* Header Kicker + Badge de Perfil Nutricional + Favorito */}
        <div className="flex items-center justify-between gap-2 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-1.5">
              <Utensils className="w-3 h-3 text-primary" /> Conciencia Nutricional
            </span>
            {time && (
              <span className="text-[11px] text-muted-foreground/60 flex items-center gap-1 font-mono">
                <Clock className="w-2.5 h-2.5" /> {time}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] font-bold uppercase tracking-wider rounded-full px-2.5 py-0.5",
                getNutritionalBadgeClass(nutritionalValue)
              )}
            >
              Perfil {nutritionalValue}
            </Badge>

            <button
              type="button"
              onClick={() => {
                setFavorite((prev) => !prev);
                onToggleFavorite?.(id);
                if (typeof navigator !== "undefined" && "vibrate" in navigator) {
                  navigator.vibrate(25);
                }
              }}
              className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-rose-500 transition-colors cursor-pointer"
              aria-label="Marcar como favorito"
            >
              <Heart
                className={cn(
                  "w-4 h-4 transition-all",
                  favorite ? "fill-rose-500 text-rose-500 scale-110" : "text-muted-foreground/60"
                )}
              />
            </button>
          </div>
        </div>

        {/* Título del Plato */}
        <h3 className="font-bebas text-2xl tracking-wide text-foreground mt-0.5">
          {title}
        </h3>

        {/* Fit del Momento (Renderizado condicional por excepción según regla #9 de AGENTS.md) */}
        {contextualFit && (
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>{contextualFit.badge}</span>
            {contextualFit.hint && (
              <span className="text-[11px] font-normal text-muted-foreground opacity-90">
                — {contextualFit.hint}
              </span>
            )}
          </div>
        )}

        {/* Indicadores Observables (3-4 vectores clave) */}
        {indicators.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {indicators.map((ind, i) => (
              <span
                key={i}
                className="text-[11px] font-medium px-2.5 py-0.5 rounded-lg bg-secondary/50 text-foreground/80 border border-border/60"
              >
                {ind}
              </span>
            ))}
          </div>
        )}

        {/* Porciones de Mano (Palma, Puño, Pulgar, Cuenco) */}
        {handPortions.length > 0 && (
          <div className="mt-3.5 pt-3 border-t border-border/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 block mb-1.5">
              Porciones de Mano Conscientes
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {handPortions.map((p, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-xl bg-secondary/30 border border-border/40 flex items-center justify-between"
                >
                  <span className="font-semibold text-foreground/90 text-[11px]">{p.name}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">{p.type}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sugerencia de Adición (Adición sobre restricción, regla bioética #9) */}
        {additionSuggestion && (
          <div className="mt-3.5 p-3 rounded-2xl bg-sky-500/[0.05] border border-sky-500/20 text-xs text-sky-900 dark:text-sky-200">
            <div className="flex items-start gap-2">
              <Plus className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-[11px] text-sky-700 dark:text-sky-300">
                  Qué sumar para mayor ligereza:
                </span>
                <p className="mt-0.5 text-muted-foreground leading-relaxed text-[11px]">
                  {additionSuggestion}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Hidratación Armstrong integrada */}
        {armstrongLevel !== undefined && (
          <div className="mt-2.5 flex items-center gap-2 text-xs text-muted-foreground">
            <Droplets className="w-3.5 h-3.5 text-sky-500" />
            <span>Escala Armstrong: Nivel {armstrongLevel}</span>
          </div>
        )}
      </div>

      {/* Botón Guardar en Diario si se renderiza en Chat / MCP */}
      {onSaveToTimeline && (
        <div className="pt-4 mt-3 border-t border-border/40 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">¿Guardar en tu timeline diario?</span>
          <Button
            size="sm"
            onClick={onSaveToTimeline}
            className="rounded-full px-4 text-xs font-semibold bg-foreground text-background hover:bg-foreground/90 cursor-pointer shadow-sm"
          >
            Guardar en Diario
          </Button>
        </div>
      )}
    </div>
  );
}
