import { useState, useRef, useEffect } from "react";
import { Sparkles, Check, Play, Pause, RotateCcw } from "lucide-react";
import { PaceTimerPayload, MiniGameResult } from "./mini-game-types";
import { miniGameAudio } from "./mini-game-audio";
import { cn } from "@/lib/utils";

interface PaceTimerGameProps {
  payload: PaceTimerPayload;
  onComplete?: (result: MiniGameResult) => void;
  initialCompleted?: boolean;
}

export function PaceTimerGame({
  payload,
  onComplete,
  initialCompleted,
}: PaceTimerGameProps) {
  const [timeLeft, setTimeLeft] = useState(initialCompleted ? 0 : payload.durationSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(Boolean(initialCompleted));
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const duration = payload.durationSeconds || 15;
  const progressPercent = Math.min(100, Math.round(((duration - timeLeft) / duration) * 100));

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            setIsCompleted(true);
            miniGameAudio.playSuccessChime();
            miniGameAudio.triggerHaptic([30, 60, 30]);
            onComplete?.({
              gameType: "pace_timer",
              completedAt: new Date().toISOString(),
              summary: payload.completionInsight,
            });
            return 0;
          }
          if (prev % 3 === 0) {
            miniGameAudio.triggerHaptic(8);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft, duration, onComplete, payload.completionInsight]);

  const togglePlay = () => {
    if (isCompleted) return;
    setIsRunning(!isRunning);
    miniGameAudio.triggerHaptic(15);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsCompleted(false);
    setTimeLeft(duration);
  };

  return (
    <div className="p-3 sm:p-3.5 rounded-2xl border border-border/70 bg-card/60 space-y-3 text-left">
      <div className="flex items-center justify-between gap-2 min-w-0">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-foreground truncate">
            {payload.title}
          </span>
        </div>
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider shrink-0 tabular-nums">
          {timeLeft}s restantes
        </span>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">{payload.instruction}</p>

      {/* Circular Progress & Control */}
      <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-secondary/30 border border-border min-w-0">
        {/* Animated Circle */}
        <div className="relative w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-secondary/80 stroke-current"
              strokeWidth="3.5"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={cn(
                "transition-all duration-300 stroke-current",
                isCompleted ? "text-emerald-500" : "text-amber-500"
              )}
              strokeDasharray={`${progressPercent}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <span className="absolute text-[11px] sm:text-xs font-bold text-foreground tabular-nums">
            {timeLeft}s
          </span>
        </div>

        {/* Phase Guide Text: Fully wraps without truncation */}
        <div className="flex-1 min-w-0 text-left">
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-muted-foreground block truncate">
            {isRunning ? "Masticación consciente" : isCompleted ? "Fase completada" : "Listo para iniciar"}
          </span>
          <p className="text-[11px] sm:text-xs font-semibold text-foreground leading-tight line-clamp-2 break-words mt-0.5">
            {isCompleted ? "¡Fase cefálica activada!" : payload.phaseGuide}
          </p>
        </div>

        {/* Play/Pause Button with 44px min touch target */}
        {!isCompleted ? (
          <button
            type="button"
            onClick={togglePlay}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-foreground text-background hover:bg-foreground/90 flex items-center justify-center shrink-0 cursor-pointer shadow-xs active:scale-95 transition-all select-none"
            aria-label={isRunning ? "Pausar" : "Iniciar"}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleReset}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center shrink-0 cursor-pointer text-muted-foreground hover:text-foreground transition-all select-none active:scale-95"
            title="Repetir"
            aria-label="Repetir"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      {isCompleted && (
        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-foreground space-y-1 animate-in fade-in duration-300">
          <div className="font-bold flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
            <Check className="w-3.5 h-3.5" />
            <span>Excelente pausa somática</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {payload.completionInsight}
          </p>
        </div>
      )}
    </div>
  );
}
