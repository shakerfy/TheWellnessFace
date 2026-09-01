import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  MUSCLE_GROUPS,
  RECOVERY_READY_THRESHOLD,
  getCalculatedMuscleRecovery,
  saveMuscleRecovery,
  type MuscleId,
} from "@/lib/muscle-recovery";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RotateCcw, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MuscleRecoveryTabProps {
  className?: string;
}

export function MuscleRecoveryTab({ className }: MuscleRecoveryTabProps) {
  const [levels, setLevels] = useState<Record<MuscleId, number>>(() =>
    getCalculatedMuscleRecovery(),
  );

  // Sincronizar niveles con eventos globales
  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<Record<MuscleId, number>>;
      if (customEvent.detail) {
        setLevels(customEvent.detail);
      } else {
        setLevels(getCalculatedMuscleRecovery());
      }
    };

    window.addEventListener("shakerfy:muscle-recovery-updated", handleUpdate);
    return () => {
      window.removeEventListener("shakerfy:muscle-recovery-updated", handleUpdate);
    };
  }, []);

  // Recalcular simulación cada 60s
  useEffect(() => {
    const interval = setInterval(() => {
      setLevels(getCalculatedMuscleRecovery());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleSliderChange = useCallback((id: MuscleId, newValue: number) => {
    setLevels((prev) => {
      const updated = { ...prev, [id]: newValue };
      saveMuscleRecovery(updated);
      return updated;
    });
  }, []);

  const handleResetAll100 = () => {
    const fullRecovery: Record<MuscleId, number> = {} as any;
    for (const g of MUSCLE_GROUPS) {
      fullRecovery[g.id] = 100;
    }
    setLevels(fullRecovery);
    saveMuscleRecovery(fullRecovery);
    toast.success("Todos los grupos musculares restablecidos al 100%");
  };

  const handleSimulateFatigue = () => {
    const fatigued: Record<MuscleId, number> = {
      hombros: 55,
      biceps: 60,
      triceps: 62,
      espalda: 45,
      pecho: 88,
      abdominales: 75,
      espalda_baja: 50,
      gluteos: 82,
      cuadriceps: 65,
      isquiotibiales: 40,
    };
    setLevels(fatigued);
    saveMuscleRecovery(fatigued);
    toast.info("Fatiga de entrenamiento simulada");
  };

  // Métricas globales
  const { averageRecovery, readyCount } = useMemo(() => {
    const values = Object.values(levels);
    const sum = values.reduce((acc, v) => acc + (typeof v === "number" ? v : 85), 0);
    const avg = values.length > 0 ? Math.round(sum / values.length) : 85;

    let ready = 0;
    for (const group of MUSCLE_GROUPS) {
      const val = levels[group.id] ?? 85;
      if (val >= RECOVERY_READY_THRESHOLD) {
        ready++;
      }
    }

    return {
      averageRecovery: avg,
      readyCount: ready,
    };
  }, [levels]);

  return (
    <div className={cn("space-y-5 animate-in fade-in duration-200 text-left select-none", className)}>
      {/* 1. HERO COMPACTO: ESTADO GLOBAL */}
      <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-xs hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-lg transition-all duration-300 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
              Recuperación Somática
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl sm:text-4xl font-black text-foreground tabular-nums">
                {averageRecovery}%
              </span>
              <span className="text-xs font-semibold text-muted-foreground">
                Capacidad Media
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                "font-bold text-xs py-1 px-3 rounded-full flex items-center gap-1.5",
                averageRecovery >= 75
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  : averageRecovery >= 60
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
              )}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{readyCount} de 10 listos (&gt;70%)</span>
            </Badge>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleResetAll100}
              className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer"
              title="Restablecer todos al 100%"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Minimal Progress Bar */}
        <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-700",
              averageRecovery >= 70
                ? "bg-emerald-500"
                : averageRecovery >= 50
                  ? "bg-amber-500"
                  : "bg-rose-500",
            )}
            style={{ width: `${averageRecovery}%` }}
          />
        </div>
      </div>

      {/* 2. GRID MINIMALISTA DE GRUPOS MUSCULARES (2 COLUMNAS) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
            Grupos Musculares ({MUSCLE_GROUPS.length})
          </span>
          <button
            type="button"
            onClick={handleSimulateFatigue}
            className="text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            Simular fatiga
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 w-full items-stretch">
          {MUSCLE_GROUPS.map((group) => {
            const currentVal = levels[group.id] ?? 85;
            const isReady = currentVal >= RECOVERY_READY_THRESHOLD;

            return (
              <div
                key={group.id}
                className="border border-border bg-card shadow-xs rounded-3xl p-4 sm:p-4.5 hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-3"
              >
                {/* Cabecera compacta: Imagen + Nombre + Porcentaje */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/50 p-1.5 flex items-center justify-center shrink-0 border border-border/40">
                    <img
                      src={group.image}
                      alt={group.name}
                      className="w-full h-full object-contain drop-shadow-2xs"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-foreground truncate">
                        {group.name}
                      </h4>
                      <span
                        className={cn(
                          "text-sm font-black tabular-nums",
                          isReady
                            ? "text-emerald-500"
                            : currentVal >= 50
                              ? "text-amber-500"
                              : "text-rose-500",
                        )}
                      >
                        {currentVal}%
                      </span>
                    </div>

                    <span className="text-[11px] font-medium text-muted-foreground truncate block mt-0.5">
                      {group.anatomy}
                    </span>
                  </div>
                </div>

                {/* Slider estilizado y limpio */}
                <div className="pt-0.5">
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[currentVal]}
                    onValueChange={(val) => handleSliderChange(group.id, val[0])}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
