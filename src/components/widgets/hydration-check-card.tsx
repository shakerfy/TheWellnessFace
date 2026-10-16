import React, { useState } from "react";
import { Droplet, Info, Check, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ARMSTRONG_LEVELS } from "@/components/app/app-utils";

export interface ArmstrongScaleBarProps {
  selectedLevel?: number;
  onSelectLevel?: (level: number) => void;
  interactive?: boolean;
  pillHeightClass?: string;
  optimalLabel?: string;
  dehydratedLabel?: string;
  className?: string;
}

/**
 * Barra visual de 8 niveles colorimétricos de la Escala Armstrong.
 * Muestra las 8 cápsulas verticales con anillo blanco en el nivel seleccionado.
 */
export function ArmstrongScaleBar({
  selectedLevel = 5,
  onSelectLevel,
  interactive = false,
  pillHeightClass = "h-14 sm:h-16",
  optimalLabel = "OPTIMAL",
  dehydratedLabel = "DEHYDRATED",
  className,
}: ArmstrongScaleBarProps) {
  return (
    <div className={cn("select-none w-full", className)}>
      <div
        role="radiogroup"
        aria-label="Escala de coloración urinaria de Armstrong"
        className="flex items-center justify-between gap-1.5 sm:gap-2 w-full select-none"
      >
        {ARMSTRONG_LEVELS.map((item) => {
          const isSelected = item.level === selectedLevel;
          const Tag = interactive ? "button" : "div";
          return (
            <Tag
              key={item.level}
              type={interactive ? "button" : undefined}
              role={interactive ? "radio" : undefined}
              aria-checked={interactive ? isSelected : undefined}
              aria-label={`${item.title}: ${item.state}`}
              onClick={interactive ? () => onSelectLevel?.(item.level) : undefined}
              style={{ backgroundColor: item.hex }}
              className={cn(
                "flex-1 rounded-full relative transition-all duration-200",
                pillHeightClass,
                isSelected
                  ? "ring-2 ring-white ring-offset-2 ring-offset-card scale-105 -translate-y-0.5 shadow-md z-10"
                  : interactive
                    ? "opacity-85 hover:opacity-100 hover:scale-102 cursor-pointer focus:outline-none"
                    : "opacity-80",
              )}
            />
          );
        })}
      </div>

      {/* Boundary Labels: OPTIMAL ... DEHYDRATED */}
      <div className="flex items-center justify-between mt-2 px-1 text-[9px] sm:text-[10px] font-bold tracking-wider uppercase text-muted-foreground/75">
        <span>{optimalLabel}</span>
        <span>{dehydratedLabel}</span>
      </div>
    </div>
  );
}

export interface HydrationCheckCardProps {
  initialLevel?: number;
  selectedLevel?: number;
  onSelectLevel?: (level: number) => void;
  onSave?: (level: number, details: (typeof ARMSTRONG_LEVELS)[0]) => void;
  className?: string;
  showSaveButton?: boolean;
  title?: string;
  subtitle?: string;
  optimalLabel?: string;
  dehydratedLabel?: string;
  onLearnMoreClick?: () => void;
}

export function HydrationCheckCard({
  initialLevel = 5,
  selectedLevel: controlledLevel,
  onSelectLevel,
  onSave,
  className,
  showSaveButton = true,
  title = "Hydration Check",
  subtitle = "Armstrong Scale Input",
  optimalLabel = "OPTIMAL",
  dehydratedLabel = "DEHYDRATED",
  onLearnMoreClick,
}: HydrationCheckCardProps) {
  const [internalLevel, setInternalLevel] = useState<number>(initialLevel);
  const activeLevel = controlledLevel !== undefined ? controlledLevel : internalLevel;

  const currentLevelObj =
    ARMSTRONG_LEVELS.find((l) => l.level === activeLevel) || ARMSTRONG_LEVELS[4]; // Default nivel 5 como la imagen de referencia

  const handleLevelClick = (level: number) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(20);
      } catch (_) {}
    }
    if (controlledLevel === undefined) {
      setInternalLevel(level);
    }
    onSelectLevel?.(level);
  };

  const handleSave = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate([15, 30]);
      } catch (_) {}
    }
    onSave?.(activeLevel, currentLevelObj);
  };

  // Estado semántico del badge según nivel de Armstrong
  const isOptimal = activeLevel <= 3;
  const isMild = activeLevel >= 4 && activeLevel <= 5;

  const statusBadgeVariant = isOptimal
    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
    : isMild
      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
      : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";

  return (
    <div
      className={cn(
        "rounded-3xl border border-border/80 bg-card text-card-foreground p-5 sm:p-6 shadow-xl relative overflow-hidden transition-all duration-300",
        className,
      )}
    >
      {/* Header: Title + Subtitle + Droplet Circular Icon */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="space-y-0.5 text-left">
          <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground font-medium">{subtitle}</p>
        </div>

        <div className="w-9 h-9 rounded-full bg-sky-500/15 dark:bg-sky-500/20 text-sky-500 flex items-center justify-center shrink-0 border border-sky-500/30 shadow-xs">
          <Droplet className="w-4 h-4 fill-sky-500/20" />
        </div>
      </div>

      {/* 8-Level Armstrong Color Bars (Vertical Capsule Pills) */}
      <div className="py-2">
        <ArmstrongScaleBar
          interactive={true}
          selectedLevel={activeLevel}
          onSelectLevel={handleLevelClick}
          pillHeightClass="h-14 sm:h-16"
          optimalLabel={optimalLabel}
          dehydratedLabel={dehydratedLabel}
        />
      </div>

      {/* Somatic Feedback & Physiological Advice (Uncovered Section) */}
      <div className="mt-4 pt-3.5 border-t border-border/50 text-left space-y-2.5 animate-in fade-in duration-200">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge
            variant="outline"
            className={cn(
              "text-[11px] font-bold uppercase tracking-wider py-0.5 px-2.5 rounded-full border",
              statusBadgeVariant,
            )}
          >
            {currentLevelObj.title} • {currentLevelObj.state}
          </Badge>
          <span className="text-[11px] font-mono text-muted-foreground/70">
            Usg {currentLevelObj.usg}
          </span>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          {currentLevelObj.advice}
        </p>

        {/* Disclaimer somático no punitivo */}
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/80 pt-0.5">
          <Info className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
          <span>Suplementos con vitamina B o alimentos pueden variar el tono temporalmente.</span>
        </div>

        {/* Action Button & Capa 2 Blog Link */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {onLearnMoreClick ? (
            <button
              type="button"
              onClick={onLearnMoreClick}
              className="text-[11px] font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Conoce más sobre la Escala Armstrong</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          ) : (
            <a
              href="/blog/escala-de-armstrong-y-fisiologia-de-la-hidratacion"
              className="text-[11px] font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Conoce más sobre la Escala Armstrong</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          {showSaveButton && onSave && (
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              className="rounded-full px-5 text-xs font-semibold bg-foreground text-background hover:bg-foreground/90 cursor-pointer shadow-sm ml-auto"
            >
              <Check className="w-3.5 h-3.5 mr-1.5" />
              Registrar Chequeo
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
