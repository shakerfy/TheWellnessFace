import React, { useState, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function InlineArmstrongGuideWidget({
  selectedLevel,
  onSelectLevel,
}: {
  selectedLevel?: number;
  onSelectLevel?: (level: number) => void;
}) {
  const tones = [
    { level: 1, hex: "#FEFCE8" },
    { level: 2, hex: "#FEF08A" },
    { level: 3, hex: "#FDE047" },
    { level: 4, hex: "#FACC15" },
    { level: 5, hex: "#EAB308" },
    { level: 6, hex: "#CA8A04" },
    { level: 7, hex: "#A16207" },
    { level: 8, hex: "#713F12" },
  ];

  const handleSelect = (lvl: number) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(15);
      } catch (_) {}
    }
    onSelectLevel?.(lvl);
  };

  return (
    <div className="pt-1.5 space-y-2.5 select-none">
      <div className="flex items-center justify-between text-[11px] text-muted-foreground px-0.5">
        <span>Toca tu tono de color actual:</span>
        {selectedLevel && (
          <span className="font-bold text-foreground">
            Registrado: Nivel {selectedLevel}
          </span>
        )}
      </div>

      {/* Barra compacta de 8 niveles de color */}
      <div className="grid grid-cols-8 gap-1.5">
        {tones.map((t) => {
          const isSelected = selectedLevel === t.level;
          return (
            <button
              key={t.level}
              type="button"
              onClick={() => handleSelect(t.level)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl p-1 transition-all cursor-pointer hover:scale-105 active:scale-95",
                isSelected
                  ? "ring-2 ring-foreground bg-foreground/10 shadow-xs"
                  : "hover:bg-secondary/50",
              )}
            >
              <div
                style={{ backgroundColor: t.hex }}
                className={cn(
                  "w-full h-7 rounded-lg border border-black/15 dark:border-white/15 shadow-2xs transition-transform",
                  isSelected ? "scale-105" : "",
                )}
                title={`Nivel ${t.level}`}
              />
              <span
                className={cn(
                  "text-[10px] font-bold leading-none",
                  isSelected ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {t.level}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3 Zonas clínicas de referencia rápida */}
      <div className="grid grid-cols-3 gap-1.5 text-left">
        <button
          type="button"
          onClick={() => handleSelect(2)}
          className={cn(
            "p-2 rounded-xl border text-left transition-colors cursor-pointer",
            selectedLevel && selectedLevel >= 1 && selectedLevel <= 3
              ? "bg-emerald-500/10 border-emerald-500/40 text-foreground"
              : "bg-secondary/40 border-border/50 hover:bg-secondary/70",
          )}
        >
          <div className="flex items-center gap-1.5 mb-0.5">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: "#FEF08A" }}
            />
            <span className="text-[10px] font-bold text-foreground">
              Tonos 1 – 3
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground leading-tight">
            Hidratación ideal. Estás en equilibrio.
          </p>
        </button>
        <button
          type="button"
          onClick={() => handleSelect(4)}
          className={cn(
            "p-2 rounded-xl border text-left transition-colors cursor-pointer",
            selectedLevel && selectedLevel >= 4 && selectedLevel <= 5
              ? "bg-amber-500/10 border-amber-500/40 text-foreground"
              : "bg-secondary/40 border-border/50 hover:bg-secondary/70",
          )}
        >
          <div className="flex items-center gap-1.5 mb-0.5">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: "#EAB308" }}
            />
            <span className="text-[10px] font-bold text-foreground">
              Tonos 4 – 5
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground leading-tight">
            Reponer agua. Sumá 1–2 vasos de a sorbos.
          </p>
        </button>
        <button
          type="button"
          onClick={() => handleSelect(6)}
          className={cn(
            "p-2 rounded-xl border text-left transition-colors cursor-pointer",
            selectedLevel && selectedLevel >= 6 && selectedLevel <= 8
              ? "bg-rose-500/10 border-rose-500/40 text-foreground"
              : "bg-secondary/40 border-border/50 hover:bg-secondary/70",
          )}
        >
          <div className="flex items-center gap-1.5 mb-0.5">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: "#A16207" }}
            />
            <span className="text-[10px] font-bold text-foreground">
              Tonos 6 – 8
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground leading-tight">
            Falta de agua. Priorizá hidratarte hoy.
          </p>
        </button>
      </div>
    </div>
  );
}

export function InlineBreathingGuideWidget({
  onComplete,
}: {
  onComplete?: () => void;
}) {
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);

  useEffect(() => {
    if (!isRunning) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          setIsRunning(false);
          if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate([30, 60, 40]);
          }
          onComplete?.();
          toast.success("Pausa de 1 minuto completada", {
            description:
              "Tu sistema nervioso y tu digestión están más relajados.",
          });
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isRunning, onComplete]);

  // Ciclo de 10 segundos: 4s inhalar, 6s exhalar
  const elapsedInCycle = (60 - secondsLeft) % 10;
  const isInhaling = elapsedInCycle < 4;
  const phaseText = !isRunning
    ? "Listo para empezar (Inhalá 4s · Exhalá 6s)"
    : isInhaling
      ? `Inhalá suave por nariz... (${4 - elapsedInCycle}s)`
      : `Exhalá lento soltando hombros... (${10 - elapsedInCycle}s)`;

  return (
    <div className="pt-1.5">
      <div className="p-3 rounded-2xl bg-secondary/40 border border-border/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Anillo animado de respiración */}
          <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
            <span
              className={cn(
                "absolute inset-0 rounded-full border-2 border-foreground/30 transition-all duration-1000 ease-in-out",
                isRunning
                  ? isInhaling
                    ? "scale-110 bg-foreground/15 border-foreground/70"
                    : "scale-75 bg-foreground/5 border-foreground/30"
                  : "scale-95 bg-foreground/5",
              )}
            />
            <span className="text-[11px] font-bold tabular-nums text-foreground relative z-10">
              {secondsLeft}s
            </span>
          </div>

          <div className="min-w-0">
            <span className="text-xs font-semibold text-foreground block truncate">
              {phaseText}
            </span>
            <span className="text-[11px] text-muted-foreground block">
              6 ciclos lentos para aliviar la digestión
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (typeof navigator !== "undefined" && navigator.vibrate) {
              navigator.vibrate(15);
            }
            setIsRunning((prev) => !prev);
          }}
          className="px-3.5 py-1.5 rounded-full bg-foreground text-background hover:opacity-90 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shrink-0 active:scale-95"
        >
          {isRunning ? (
            <>
              <Pause className="w-3 h-3 fill-current" />
              <span>Pausar</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3 fill-current" />
              <span>{secondsLeft < 60 ? "Continuar" : "Iniciar"}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
