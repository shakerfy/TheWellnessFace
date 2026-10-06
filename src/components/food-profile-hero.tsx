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
    strokeColor: "stroke-sky-500 dark:stroke-sky-400",
    textColor: "text-muted-foreground",
    description: "Menor densidad de micronutrientes o predominio de energía rápida.",
  },
  2: {
    label: "Medio",
    strokeColor: "stroke-sky-500 dark:stroke-sky-400",
    textColor: "text-muted-foreground",
    description: "Aporte nutricional intermedio y balance equilibrado de nutrientes.",
  },
  3: {
    label: "Alto",
    strokeColor: "stroke-sky-500 dark:stroke-sky-400",
    textColor: "text-muted-foreground",
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
  hideBadges?: boolean;
  className?: string;
}

export interface FoodProfileDialProps {
  qualityLabel?: string;
  qualityLevel?: FoodQualityLevel;
  qualityTier?: number;
  activeBarsCount?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function FoodProfileDial({
  qualityLabel,
  qualityLevel,
  qualityTier,
  activeBarsCount,
  size = "md",
  className,
}: FoodProfileDialProps) {
  const rawLabel = qualityLabel || "";
  const resolvedLabel =
    /excelente|bueno|alta|alto/i.test(rawLabel)
      ? "Alto"
      : /regular|intermedio|medio|moderad/i.test(rawLabel)
        ? "Medio"
        : /pobre|bajo|baja|ligero|ligera/i.test(rawLabel)
          ? "Bajo"
          : "";

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

  const radius = 46;
  const arcDash = 68;
  const arcGap = 221.026;

  const ARCS = [
    { level: 1 as const, offset: 34, label: "Bajo" },
    { level: 2 as const, offset: -62.34, label: "Medio" },
    { level: 3 as const, offset: -158.68, label: "Alto" },
  ];

  const sizeClasses = {
    sm: "w-11 h-11",
    md: "w-14 h-14 sm:w-15 sm:h-15",
    lg: "w-16 h-16 sm:w-18 sm:h-18",
  }[size];

  const fontClasses = {
    sm: "text-[7.5px] font-normal tracking-normal",
    md: "text-[8.5px] sm:text-[9px] font-normal tracking-normal",
    lg: "text-[9px] sm:text-[9.5px] font-normal tracking-normal",
  }[size];

  return (
    <div
      className={cn(
        "relative shrink-0 flex items-center justify-center select-none",
        sizeClasses,
        className,
      )}
      title={`Perfil Nutricional: ${finalLabel}`}
    >
      <svg
        className="w-full h-full -rotate-90 transform"
        viewBox="0 0 120 120"
        aria-hidden="true"
      >
        {ARCS.map((arc) => {
          const isArcActive = arc.level <= resolvedLevel;
          return (
            <circle
              key={arc.level}
              cx="60"
              cy="60"
              r={radius}
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${arcDash} ${arcGap}`}
              strokeDashoffset={arc.offset}
              className={cn(
                "transition-all duration-500 ease-out",
                isArcActive
                  ? levelConfig.strokeColor
                  : "stroke-secondary/70 dark:stroke-secondary/35",
              )}
            />
          );
        })}
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-0.5">
        <span
          className={cn(
            "leading-tight font-normal text-muted-foreground",
            fontClasses,
          )}
        >
          {finalLabel}
        </span>
      </div>
    </div>
  );
}

export function FoodProfileHero({
  qualityLabel,
  qualityLevel,
  qualityTier,
  activeBarsCount,
  badges = [],
  contextBadge,
  hideBadges = false,
  className,
}: FoodProfileHeroProps) {
  return (
    <div className={cn("text-left space-y-2.5 select-none", className)}>
      {/* 1. Encabezado: 'Perfil Nutricional' + Context Badge + Botón de información (i) a la derecha */}
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
              onClick={(e) => e.stopPropagation()}
              className="w-7 h-7 -mr-1 rounded-full flex items-center justify-center text-muted-foreground hover:text-sky-500 bg-black/[0.03] dark:bg-white/[0.06] backdrop-blur-xl border border-black/[0.08] dark:border-white/10 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.8),0_1px_4px_0_rgba(0,0,0,0.03)] hover:bg-black/[0.06] dark:hover:bg-white/15 transition cursor-pointer"
              aria-label="Más información sobre el Valor Nutricional"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            side="bottom"
            onClick={(e) => e.stopPropagation()}
            className="w-72 sm:w-80 p-3.5 rounded-2xl bg-card/95 backdrop-blur-md border border-border shadow-xl text-left z-50 space-y-1.5"
          >
            <h4 className="text-xs font-bold text-foreground">
              Aviso importante
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              La identificación visual y los insights tienen fines exclusivamente educativos y de bienestar general, y no constituyen un diagnóstico médico ni una prescripción dietética. Ante cualquier condición clínica, consultá siempre a un profesional de la salud matriculado.
            </p>
          </PopoverContent>
        </Popover>
      </div>

      {/* 2. Contenido: Indicador radial de 3 arcos progresivos */}
      <div className="flex items-center gap-3.5 sm:gap-5">
        <FoodProfileDial
          qualityLabel={qualityLabel}
          qualityLevel={qualityLevel}
          qualityTier={qualityTier}
          activeBarsCount={activeBarsCount}
          size="lg"
        />

        {/* Atributos / Especificaciones ordenadas con líneas divisorias sobrias si no están ocultos */}
        {!hideBadges && badges.length > 0 && (
          <div className="flex flex-col justify-center divide-y divide-border/40 dark:divide-border/30 flex-1 min-w-0">
            {badges.slice(0, 4).map((badge) => (
              <div
                key={badge.id || badge.label}
                className="py-1.5 first:pt-0 last:pb-0 flex items-center min-w-0"
              >
                <span className="text-xs font-medium text-foreground/90 truncate leading-tight tracking-tight">
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FoodProfileHero;
