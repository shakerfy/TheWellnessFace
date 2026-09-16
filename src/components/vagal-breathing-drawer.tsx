import React, { useState, useEffect, useRef } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, CheckCircle2, Wind } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface VagalBreathingDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
  contextTitle?: string;
}

const INHALE_DURATION = 4; // 4 seconds inhale
const EXHALE_DURATION = 6; // 6 seconds exhale
const CYCLE_DURATION = INHALE_DURATION + EXHALE_DURATION; // 10 seconds
const TOTAL_CYCLES = 6; // 60 seconds total

export function VagalBreathingDrawer({
  open,
  onOpenChange,
  onComplete,
  contextTitle,
}: VagalBreathingDrawerProps) {
  const isMobile = useIsMobile();
  const [isActive, setIsActive] = useState(true);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const prevPhaseRef = useRef<"inhale" | "exhale">("inhale");

  // Reset state when opening
  useEffect(() => {
    if (open) {
      setIsActive(true);
      setSecondsElapsed(0);
      setIsFinished(false);
      prevPhaseRef.current = "inhale";
      setAnimKey((prev) => prev + 1);
    }
  }, [open]);

  // Main timer
  useEffect(() => {
    if (!open || !isActive || isFinished) return;

    const interval = setInterval(() => {
      setSecondsElapsed((prev) => {
        const next = prev + 1;
        if (next >= TOTAL_CYCLES * CYCLE_DURATION) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFinished(true);
            setIsActive(false);
            if (typeof navigator !== "undefined" && navigator.vibrate) {
              try {
                navigator.vibrate([40, 60, 40]);
              } catch (_) {}
            }
            onComplete?.();
          }, 0);
          return TOTAL_CYCLES * CYCLE_DURATION;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [open, isActive, isFinished, onComplete]);

  // Calculations for current cycle and phase
  const currentCycle = Math.min(
    TOTAL_CYCLES,
    Math.floor(secondsElapsed / CYCLE_DURATION) + 1,
  );
  const secondInCycle = secondsElapsed % CYCLE_DURATION;
  const isExhale = secondInCycle >= INHALE_DURATION;
  const currentPhase: "inhale" | "exhale" = isExhale ? "exhale" : "inhale";

  const phaseRemaining = isExhale
    ? CYCLE_DURATION - secondInCycle
    : INHALE_DURATION - secondInCycle;

  const totalSecondsRemaining = Math.max(
    0,
    TOTAL_CYCLES * CYCLE_DURATION - secondsElapsed,
  );
  const formattedRemaining = `${Math.floor(totalSecondsRemaining / 60)}:${(totalSecondsRemaining % 60).toString().padStart(2, "0")}`;

  // Haptic cue on phase change
  useEffect(() => {
    if (!open || !isActive || isFinished) return;
    if (prevPhaseRef.current !== currentPhase) {
      prevPhaseRef.current = currentPhase;
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        try {
          navigator.vibrate(25);
        } catch (_) {}
      }
    }
  }, [currentPhase, open, isActive, isFinished]);

  const handleRestart = () => {
    setSecondsElapsed(0);
    setIsFinished(false);
    setIsActive(true);
    prevPhaseRef.current = "inhale";
    setAnimKey((prev) => prev + 1);
  };

  const orbBody = (
    <div className="py-6 sm:py-8 flex flex-col items-center justify-center relative min-h-[240px]">
      {/* Keyframes de animación exacta y paralela: 40% (4s) crecimiento lineal continuo, 60% (6s) decrecimiento lineal continuo */}
      <style>{`
        @keyframes vagalOrbAnimation {
          0% {
            transform: scale(0.88);
            animation-timing-function: linear;
          }
          40% {
            transform: scale(1.18);
            animation-timing-function: linear;
          }
          100% {
            transform: scale(0.88);
          }
        }
        @keyframes vagalHaloAnimation {
          0% {
            transform: scale(0.85);
            opacity: 0.15;
            animation-timing-function: linear;
          }
          40% {
            transform: scale(1.30);
            opacity: 0.85;
            animation-timing-function: linear;
          }
          100% {
            transform: scale(0.85);
            opacity: 0.15;
          }
        }
      `}</style>

      {/* Orbe Animado */}
      <div className="relative flex items-center justify-center">
        {/* Halo Exterior Radiante */}
        <div
          key={`halo-${animKey}`}
          style={
            !open || isFinished
              ? undefined
              : {
                  animation: "vagalHaloAnimation 10s linear infinite",
                  animationPlayState: isActive ? "running" : "paused",
                }
          }
          className={cn(
            "absolute rounded-full pointer-events-none w-44 h-44 sm:w-52 sm:h-52 bg-emerald-500/20 dark:bg-emerald-500/25 blur-xl",
            isFinished && "opacity-0 transition-opacity duration-300",
          )}
        />

        {/* Núcleo del Orbe */}
        <div
          key={`orb-${animKey}`}
          style={
            !open || isFinished
              ? { transform: "scale(1)", transition: "all 0.4s ease-out" }
              : {
                  animation: "vagalOrbAnimation 10s linear infinite",
                  animationPlayState: isActive ? "running" : "paused",
                }
          }
          className={cn(
            "relative w-36 h-36 sm:w-44 sm:h-44 rounded-full flex flex-col items-center justify-center border shadow-xl transition-colors duration-700",
            isFinished
              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-600"
              : currentPhase === "inhale"
                ? "bg-emerald-500/15 border-emerald-500/40 text-foreground shadow-emerald-500/20"
                : "bg-secondary/70 border-border/80 text-foreground",
          )}
        >
          {isFinished ? (
            <div className="space-y-1 animate-in zoom-in-95 duration-300">
              <CheckCircle2 className="w-9 h-9 text-emerald-500 mx-auto stroke-[2.5]" />
              <span className="text-xs font-black uppercase tracking-wider block text-foreground">
                Tu cuerpo está en calma
              </span>
            </div>
          ) : (
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80 block">
                {currentPhase === "inhale" ? "Inhala" : "Exhala"}
              </span>
              <span className="text-4xl sm:text-5xl font-black tabular-nums tracking-tight block">
                {phaseRemaining}
              </span>
              <span className="text-[10px] font-medium text-muted-foreground/70 block">
                {currentPhase === "inhale" ? "por la nariz" : "suave por la boca"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Indicador de Ciclos y Tiempo Total */}
      <div className="mt-7 flex items-center justify-center gap-3 text-xs font-semibold text-muted-foreground">
        <span className="px-3 py-1 rounded-full bg-secondary/60 border border-border/60">
          Ciclo {currentCycle} de {TOTAL_CYCLES}
        </span>
        <span className="tabular-nums text-foreground/80">
          {formattedRemaining}
        </span>
      </div>
    </div>
  );

  const footerButtons = isFinished ? (
    <div className="flex items-center gap-2 w-full max-w-xs mx-auto">
      <Button
        type="button"
        variant="outline"
        onClick={handleRestart}
        className="flex-1 rounded-2xl h-11 text-xs font-bold gap-1.5 cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Repetir</span>
      </Button>
      <Button
        type="button"
        onClick={() => onOpenChange(false)}
        className="flex-1 rounded-2xl h-11 text-xs font-bold bg-foreground text-background hover:bg-foreground/90 cursor-pointer shadow-xs"
      >
        <span>Listo</span>
      </Button>
    </div>
  ) : (
    <div className="flex items-center gap-2 w-full max-w-xs mx-auto">
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsActive(!isActive)}
        className="flex-1 rounded-2xl h-11 text-xs font-bold gap-1.5 cursor-pointer"
      >
        {isActive ? (
          <>
            <Pause className="w-3.5 h-3.5" />
            <span>Pausar</span>
          </>
        ) : (
          <>
            <Play className="w-3.5 h-3.5" />
            <span>Continuar</span>
          </>
        )}
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={() => onOpenChange(false)}
        className="flex-1 rounded-2xl h-11 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
      >
        <span>Finalizar</span>
      </Button>
    </div>
  );

  // Versión de Escritorio (>= 768px): Modal centrado (Dialog)
  if (!isMobile) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6 sm:p-7 border border-border bg-card text-center select-none shadow-2xl">
          <DialogHeader className="pb-1 text-center sm:text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
              <Wind className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Un minuto de calma</span>
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
              Tomar una pausa
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground max-w-sm mx-auto">
              {contextTitle
                ? `Un minuto para relajar el cuerpo y disfrutar ${contextTitle} con tranquilidad.`
                : "Inhala en 4 segundos, exhala en 6. Un minuto para bajar el ritmo y digerir mejor."}
            </DialogDescription>
          </DialogHeader>

          {orbBody}

          <DialogFooter className="sm:justify-center pt-1">
            {footerButtons}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Versión Móvil (< 768px): Hoja deslizable (Drawer / Bottom Sheet)
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="px-6 pb-8 pt-2 text-center select-none overflow-hidden max-w-lg mx-auto">
        <DrawerHeader className="pb-2 pt-2 text-center sm:text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
            <Wind className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Un minuto de calma</span>
          </div>
          <DrawerTitle className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
            Tomar una pausa
          </DrawerTitle>
          <DrawerDescription className="text-xs text-muted-foreground max-w-sm mx-auto">
            {contextTitle
              ? `Un minuto para relajar el cuerpo y disfrutar ${contextTitle} con tranquilidad.`
              : "Inhala en 4 segundos, exhala en 6. Un minuto para bajar el ritmo y digerir mejor."}
          </DrawerDescription>
        </DrawerHeader>

        {orbBody}

        <DrawerFooter className="px-0 pt-0 pb-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
          {footerButtons}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
