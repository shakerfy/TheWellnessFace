import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wind, Check, RotateCcw, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface MindfulBreathingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
}

type BreathPhase = "inhale" | "hold" | "exhale" | "rest";

const INHALE_DURATION = 4; // 4 seconds
const HOLD_DURATION = 4;   // 4 seconds
const EXHALE_DURATION = 4; // 4 seconds
const REST_DURATION = 4;   // 4 seconds (4-4-4-4 Box Breathing)
const CYCLE_DURATION = INHALE_DURATION + HOLD_DURATION + EXHALE_DURATION + REST_DURATION; // 16s
const TOTAL_CYCLES = 4; // 4 cycles = ~64 seconds

const PHASE_CONFIG: Record<
  BreathPhase,
  { label: string; text: string; subtext: string }
> = {
  inhale: {
    label: "INHALA",
    text: "Inhala profundamente",
    subtext: "Llena tus pulmones con calma por la nariz",
  },
  hold: {
    label: "SOSTÉN",
    text: "Sostén el aire",
    subtext: "Permite que tu mente se estabilice",
  },
  exhale: {
    label: "EXHALA",
    text: "Exhala despacio",
    subtext: "Libera la tensión acumulada por la boca",
  },
  rest: {
    label: "PAUSA",
    text: "Pausa en vacío",
    subtext: "Siente el reposo y la calma de tu cuerpo",
  },
};

// Smooth organic sine easing
function easeInOutSine(x: number): number {
  return -(Math.cos(Math.PI * x) - 1) / 2;
}

export function MindfulBreathingModal({
  open,
  onOpenChange,
  onComplete,
}: MindfulBreathingModalProps) {
  const [isStarted, setIsStarted] = useState(false);
  const [phase, setPhase] = useState<BreathPhase>("inhale");
  const [secondsLeft, setSecondsLeft] = useState(INHALE_DURATION);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);

  // DOM Refs for silky 60fps animation
  const orbRef = useRef<HTMLDivElement>(null);
  const halo1Ref = useRef<HTMLDivElement>(null);
  const halo2Ref = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number>(0);

  // Reset when dialog opens/closes
  useEffect(() => {
    if (!open) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      setIsStarted(false);
      setIsCompleted(false);
      return;
    }

    // Default to unstarted state on open
    setIsStarted(false);
    setPhase("inhale");
    setSecondsLeft(INHALE_DURATION);
    setCurrentCycle(1);
    setIsCompleted(false);

    const MIN_SCALE = 0.70;
    if (orbRef.current) orbRef.current.style.transform = `scale(${MIN_SCALE})`;
    if (halo1Ref.current) {
      halo1Ref.current.style.transform = `scale(0.65)`;
      halo1Ref.current.style.opacity = `0.1`;
    }
    if (halo2Ref.current) {
      halo2Ref.current.style.transform = `scale(0.68)`;
      halo2Ref.current.style.opacity = `0.2`;
    }
  }, [open]);

  // Launch animation loop only when isStarted is active
  useEffect(() => {
    if (!open || !isStarted || isCompleted) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const MIN_SCALE = 0.70;
    const MAX_SCALE = 1.25;

    let lastPhase: BreathPhase = "inhale";
    let lastSec = INHALE_DURATION;
    let lastCycle = 1;

    const frameLoop = (now: number) => {
      const elapsed = (now - startTimeRef.current) / 1000;

      // Check if all 4 cycles are finished
      if (elapsed >= TOTAL_CYCLES * CYCLE_DURATION) {
        setIsCompleted(true);
        if (orbRef.current) orbRef.current.style.transform = `scale(1)`;
        return;
      }

      const cycleNum = Math.min(
        TOTAL_CYCLES,
        Math.floor(elapsed / CYCLE_DURATION) + 1
      );
      const cycleTime = elapsed % CYCLE_DURATION;

      let currentPhase: BreathPhase = "inhale";
      let phaseSec = 4;
      let scale = MIN_SCALE;

      if (cycleTime < INHALE_DURATION) {
        currentPhase = "inhale";
        const progress = cycleTime / INHALE_DURATION;
        const eased = easeInOutSine(progress);
        scale = MIN_SCALE + (MAX_SCALE - MIN_SCALE) * eased;
        phaseSec = Math.max(1, Math.ceil(INHALE_DURATION - cycleTime));
      } else if (cycleTime < INHALE_DURATION + HOLD_DURATION) {
        currentPhase = "hold";
        const phaseTime = cycleTime - INHALE_DURATION;
        scale = MAX_SCALE;
        phaseSec = Math.max(1, Math.ceil(HOLD_DURATION - phaseTime));
      } else if (cycleTime < INHALE_DURATION + HOLD_DURATION + EXHALE_DURATION) {
        currentPhase = "exhale";
        const phaseTime = cycleTime - (INHALE_DURATION + HOLD_DURATION);
        const progress = phaseTime / EXHALE_DURATION;
        const eased = easeInOutSine(progress);
        scale = MAX_SCALE - (MAX_SCALE - MIN_SCALE) * eased;
        phaseSec = Math.max(1, Math.ceil(EXHALE_DURATION - phaseTime));
      } else {
        currentPhase = "rest";
        const phaseTime =
          cycleTime - (INHALE_DURATION + HOLD_DURATION + EXHALE_DURATION);
        scale = MIN_SCALE;
        phaseSec = Math.max(1, Math.ceil(REST_DURATION - phaseTime));
      }

      if (orbRef.current) {
        orbRef.current.style.transform = `scale(${scale})`;
      }

      const scaleNormalized = (scale - MIN_SCALE) / (MAX_SCALE - MIN_SCALE);
      if (halo1Ref.current) {
        halo1Ref.current.style.transform = `scale(${0.65 + 0.50 * scaleNormalized})`;
        halo1Ref.current.style.opacity = `${0.1 + 0.5 * scaleNormalized}`;
      }
      if (halo2Ref.current) {
        halo2Ref.current.style.transform = `scale(${0.68 + 0.44 * scaleNormalized})`;
        halo2Ref.current.style.opacity = `${0.2 + 0.6 * scaleNormalized}`;
      }

      if (currentPhase !== lastPhase) {
        lastPhase = currentPhase;
        setPhase(currentPhase);
      }
      if (phaseSec !== lastSec) {
        lastSec = phaseSec;
        setSecondsLeft(phaseSec);
      }
      if (cycleNum !== lastCycle) {
        lastCycle = cycleNum;
        setCurrentCycle(cycleNum);
      }

      animFrameRef.current = requestAnimationFrame(frameLoop);
    };

    animFrameRef.current = requestAnimationFrame(frameLoop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [open, isStarted, isCompleted]);

  const handleStart = () => {
    setIsStarted(true);
    setIsCompleted(false);
    setPhase("inhale");
    setSecondsLeft(INHALE_DURATION);
    setCurrentCycle(1);
    startTimeRef.current = performance.now();
  };

  const handleFinish = () => {
    toast.success("Pausa completada. Que disfrutes tu plato con presencia.");
    if (onComplete) onComplete();
    onOpenChange(false);
  };

  const handleRestart = () => {
    setIsCompleted(false);
    setIsStarted(true);
    setPhase("inhale");
    setSecondsLeft(INHALE_DURATION);
    setCurrentCycle(1);
    startTimeRef.current = performance.now();
  };

  const isExpanded = isStarted && (phase === "inhale" || phase === "hold");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6 sm:p-8 bg-card/95 backdrop-blur-2xl border border-border rounded-3xl shadow-2xl text-center flex flex-col items-center">
        <DialogHeader className="space-y-1 text-center items-center">
          <div className="w-10 h-10 rounded-full bg-secondary/80 flex items-center justify-center text-foreground mb-1 border border-border/50">
            <Wind className="w-5 h-5" />
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            Pausa Consciente & Tono Vagal
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground max-w-xs">
            Desactiva la urgencia simpática y reconecta con tus señales biológicas de saciedad.
          </DialogDescription>
        </DialogHeader>

        {/* Cycles Progress Tracker */}
        <div className="flex items-center gap-1.5 pt-2 pb-1">
          {Array.from({ length: TOTAL_CYCLES }).map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                !isStarted
                  ? "w-3 bg-secondary border border-border/50"
                  : idx + 1 < currentCycle || isCompleted
                  ? "w-7 bg-foreground"
                  : idx + 1 === currentCycle
                  ? "w-7 bg-foreground/60"
                  : "w-3 bg-secondary border border-border/50"
              )}
            />
          ))}
        </div>

        {/* Breathing Stage / Orb Visual Container */}
        <div className="relative my-6 w-64 h-64 flex items-center justify-center select-none">
          {/* Outer Ripple Halo 1 */}
          <div
            ref={halo1Ref}
            className="absolute w-56 h-56 rounded-full border border-foreground/10 pointer-events-none will-change-transform"
          />

          {/* Outer Ripple Halo 2 */}
          <div
            ref={halo2Ref}
            className="absolute w-44 h-44 rounded-full border border-foreground/20 bg-foreground/5 pointer-events-none will-change-transform"
          />

          {/* Central Breathing Orb */}
          <div
            ref={orbRef}
            className={cn(
              "relative z-10 w-32 h-32 rounded-full flex flex-col items-center justify-center border border-foreground/20 select-none shadow-xl will-change-transform transition-colors duration-500",
              isExpanded
                ? "bg-gradient-to-tr from-foreground/15 via-foreground/25 to-foreground/35 shadow-foreground/10"
                : "bg-gradient-to-tr from-secondary via-secondary/80 to-secondary/60 shadow-none"
            )}
          >
            {!isStarted ? (
              <Wind className="w-10 h-10 text-foreground/80 animate-in fade-in zoom-in-75 duration-300" />
            ) : isCompleted ? (
              <Check className="w-10 h-10 text-foreground animate-in zoom-in-50 duration-300" />
            ) : (
              <>
                <span className="text-3xl font-black font-mono tracking-tighter text-foreground">
                  {secondsLeft}s
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">
                  {PHASE_CONFIG[phase].label}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Dynamic Phase Guidance Text */}
        <div className="min-h-[60px] flex flex-col items-center justify-center space-y-1 text-center">
          {!isStarted ? (
            <>
              <h3 className="text-base font-bold text-foreground">
                Toma una postura cómoda
              </h3>
              <p className="text-xs text-muted-foreground max-w-xs leading-snug">
                Relaja los hombros, apoya los pies y presiona comenzar para guiar 4 ciclos de respiración (1 min).
              </p>
            </>
          ) : isCompleted ? (
            <>
              <h3 className="text-base font-bold text-foreground">
                Pausa completada
              </h3>
              <p className="text-xs text-muted-foreground max-w-xs">
                Has finalizado los 4 ciclos. Ahora puedes continuar con tu registro y disfrutar tu comida con presencia.
              </p>
            </>
          ) : (
            <>
              <h3 className="text-base font-bold text-foreground animate-in fade-in duration-300">
                {PHASE_CONFIG[phase].text}
              </h3>
              <p className="text-xs text-muted-foreground max-w-xs leading-snug">
                {PHASE_CONFIG[phase].subtext}
              </p>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="w-full flex items-center justify-between gap-3 pt-4 border-t border-border/50 mt-2">
          {!isStarted ? (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="rounded-2xl text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Cancelar
              </Button>

              <Button
                type="button"
                onClick={handleStart}
                className="flex-1 rounded-2xl text-xs font-bold bg-foreground text-background hover:opacity-90 shadow-sm transition cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
                Comenzar
              </Button>
            </>
          ) : isCompleted ? (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRestart}
                className="rounded-2xl text-xs font-semibold border-border text-foreground hover:bg-secondary cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                Repetir
              </Button>

              <Button
                type="button"
                onClick={handleFinish}
                className="flex-1 rounded-2xl text-xs font-bold bg-foreground text-background hover:opacity-90 shadow-sm transition cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 mr-1.5" />
                Continuar
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="rounded-2xl text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Omitir
              </Button>

              <Button
                type="button"
                onClick={handleFinish}
                className="flex-1 rounded-2xl text-xs font-bold bg-foreground text-background hover:opacity-90 shadow-sm transition cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 mr-1.5" />
                Finalizar pausa
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
