import React from "react";
import { cn } from "@/lib/utils";
import { Zap, Info } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

export type FoodQualityLevel = 1 | 2 | 3 | 4 | 5;

export interface FoodHeroBadge {
  id: string;
  label: string;
  category?: string;
}

export const QUALITY_LEVEL_CONFIG: Record<
  1 | 2 | 3,
  {
    label: string;
    strokeColor: string;
    textColor: string;
    description: string;
  }
> = {
  1: {
    label: "Bajo",
    strokeColor: "stroke-sky-500 dark:stroke-sky-400", // Azul informático / datos objetivos
    textColor: "text-sky-600 dark:text-sky-400",
    description: "Menor densidad de micronutrientes o predominio de energía rápida.",
  },
  2: {
    label: "Medio",
    strokeColor: "stroke-sky-500 dark:stroke-sky-400", // Azul informático uniforme
    textColor: "text-sky-600 dark:text-sky-400",
    description: "Aporte nutricional intermedio y balance equilibrado de nutrientes.",
  },
  3: {
    label: "Alto",
    strokeColor: "stroke-sky-500 dark:stroke-sky-400", // Azul informático uniforme
    textColor: "text-sky-600 dark:text-sky-400",
    description: "Alta densidad de micronutrientes, alimentos enteros y ricos en fibra.",
  },
};

export interface FoodProfileHeroProps {
  qualityLabel?: string;
  qualityLevel?: FoodQualityLevel;
  qualityTier?: number;
  activeBarsCount?: number;
  badges?: FoodHeroBadge[];
  contextBadge?: {
    label: string;
    type?: "pre_workout" | "post_workout" | "circadian";
  };
  isAthleteMode?: boolean;
  className?: string;
}

export function FoodProfileHero({
  qualityLabel,
  qualityLevel,
  qualityTier,
  activeBarsCount,
  badges = [],
  contextBadge,
  isAthleteMode = false,
  className,
}: FoodProfileHeroProps) {
  // Regla 7 de The Wellness Face: escala neutral no moralizante (Alto / Medio / Bajo)
  const rawLabel = qualityLabel || "";
  const resolvedLabel =
    /excelente|bueno|alta|alto/i.test(rawLabel)
      ? "Alto"
      : /regular|intermedio|medio/i.test(rawLabel)
        ? "Medio"
        : /pobre|bajo|baja/i.test(rawLabel)
          ? "Bajo"
          : "";

  // Resolver nivel a los 3 arcos exactos: 1 = Bajo, 2 = Medio, 3 = Alto
  let resolvedLevel: 1 | 2 | 3 = 2;
  if (resolvedLabel === "Alto") {
    resolvedLevel = 3;
  } else if (resolvedLabel === "Bajo") {
    resolvedLevel = 1;
  } else if (resolvedLabel === "Medio") {
    resolvedLevel = 2;
  } else if (qualityLevel) {
    resolvedLevel = qualityLevel >= 4 ? 3 : qualityLevel === 3 ? 2 : 1;
  } else if (qualityTier) {
    resolvedLevel = qualityTier >= 3 ? 3 : qualityTier === 2 ? 2 : 1;
  } else if (activeBarsCount) {
    resolvedLevel = activeBarsCount >= 4 ? 3 : activeBarsCount === 3 ? 2 : 1;
  }

  const finalLabel = resolvedLabel || QUALITY_LEVEL_CONFIG[resolvedLevel].label;
  const levelConfig = QUALITY_LEVEL_CONFIG[resolvedLevel];

  // Geometría del anillo de 3 arcos discretos (circunferencia ~289.026)
  // Arco 1 (Bajo): Izquierda/Abajo | Arco 2 (Medio): Superior | Arco 3 (Alto): Derecha/Abajo
  const radius = 46;
  const arcDash = 68;
  const arcGap = 221.026;

  const ARCS = [
    { level: 1 as const, offset: 34, label: "Bajo" }, // Arriba (Bajo)
    { level: 2 as const, offset: -62.34, label: "Medio" }, // Derecha (Medio)
    { level: 3 as const, offset: -158.68, label: "Alto" }, // Izquierda (Alto)
  ];

  return (
    <div className={cn("text-left space-y-2.5 select-none", className)}>
      {/* 1. Encabezado: 'Valor Nutricional' + Context Badge + Botón de información (i) a la derecha */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block shrink-0">
            Valor Nutricional
          </span>
          {contextBadge && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-secondary/80 text-foreground border border-border/60 truncate">
              <Zap className="w-2.5 h-2.5 text-amber-500 shrink-0" />
              <span className="truncate">{contextBadge.label}</span>
            </span>
          )}
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="w-7 h-7 -mr-1 rounded-full flex items-center justify-center text-muted-foreground/70 hover:text-foreground hover:bg-secondary/60 transition cursor-pointer"
              aria-label="Más información sobre el Valor Nutricional"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            side="bottom"
            className="w-72 p-3.5 rounded-2xl bg-card border border-border shadow-lg text-left space-y-2 z-50"
          >
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-foreground">
              {isAthleteMode ? "Valor Nutricional y Macros" : "Valor Nutricional"}
            </h4>
            <div className="space-y-1.5 text-xs text-muted-foreground leading-relaxed">
              <p>
                {isAthleteMode
                  ? "Evalúa la densidad de nutrientes y grado de procesamiento del alimento junto con el cálculo de macronutrientes."
                  : "Evalúa la calidad global del alimento según su densidad de nutrientes, aporte de fibra y grado de procesamiento."}
              </p>
              <p className="text-[11px] text-muted-foreground/80 pt-1 border-t border-border/40">
                {isAthleteMode
                  ? "Las calorías, macros e identificación visual son estimaciones aproximadas por IA. Podés editar los valores según tus porciones reales o pesaje."
                  : "La identificación visual por IA puede ser aproximada. Revisa siempre los detalles nutricionales importantes."}
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* 2. Contenido: Indicador radial de 3 arcos progresivos (1 = Bajo, 2 = Medio, 3 = Alto) */}
      <div className="flex items-center gap-3.5 sm:gap-5">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center select-none">
          <svg
            className="w-full h-full -rotate-90 transform"
            viewBox="0 0 120 120"
            aria-hidden="true"
          >
            {ARCS.map((arc) => {
              // Llenado acumulativo progresivo: 1 arco si es Bajo, 2 arcos si es Medio, 3 arcos si es Alto
              const isArcActive = arc.level <= resolvedLevel;
              return (
                <circle
                  key={arc.level}
                  cx="60"
                  cy="60"
                  r={radius}
                  strokeWidth="6"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={`${arcDash} ${arcGap}`}
                  strokeDashoffset={arc.offset}
                  className={cn(
                    "transition-all duration-500 ease-out",
                    isArcActive
                      ? "stroke-sky-500 dark:stroke-sky-400"
                      : "stroke-secondary/70 dark:stroke-secondary/35",
                  )}
                />
              );
            })}
          </svg>

          {/* Tipografía interna refinada: nombre del valor nutricional */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-1">
            <span
              className={cn(
                "text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-wider leading-tight",
                levelConfig.textColor,
              )}
            >
              {finalLabel}
            </span>
          </div>
        </div>

        {/* Atributos / Especificaciones ordenadas con líneas divisorias sobrias */}
        <div className="flex flex-col justify-center divide-y divide-border/40 dark:divide-border/30 flex-1 min-w-0">
          {badges.length > 0 ? (
            badges.slice(0, 4).map((badge) => (
              <div
                key={badge.id || badge.label}
                className="py-1.5 first:pt-0 last:pb-0 flex items-center min-w-0"
              >
                <span className="text-xs font-medium text-foreground/90 truncate leading-tight tracking-tight">
                  {badge.label}
                </span>
              </div>
            ))
          ) : (
            <div className="text-xs text-muted-foreground italic py-1">
              Sin componentes clave detectados
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FoodProfileHero;
