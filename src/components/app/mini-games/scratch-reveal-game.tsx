import { useState, useRef, useEffect } from "react";
import { Sparkles, Eye, Check } from "lucide-react";
import { ScratchRevealPayload, MiniGameResult } from "./mini-game-types";
import { miniGameAudio } from "./mini-game-audio";
import { cn } from "@/lib/utils";

interface ScratchRevealGameProps {
  payload: ScratchRevealPayload;
  onComplete?: (result: MiniGameResult) => void;
  initialCompleted?: boolean;
}

export function ScratchRevealGame({
  payload,
  onComplete,
  initialCompleted,
}: ScratchRevealGameProps) {
  const [isRevealed, setIsRevealed] = useState(Boolean(initialCompleted));
  const [scratchProgress, setScratchProgress] = useState(initialCompleted ? 100 : 0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScratchingRef = useRef(false);

  const handlePointerDown = () => {
    if (isRevealed) return;
    isScratchingRef.current = true;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isScratchingRef.current || isRevealed) return;

    setScratchProgress((prev) => {
      const next = Math.min(100, prev + 6);
      if (next % 18 < 6) {
        miniGameAudio.triggerHaptic(8);
      }
      if (next >= 60 && !isRevealed) {
        // Ejecutar en el siguiente tick fuera del render cycle de React
        setTimeout(() => triggerComplete(), 0);
      }
      return next;
    });
  };

  const handlePointerUp = () => {
    isScratchingRef.current = false;
  };

  const triggerComplete = () => {
    setIsRevealed(true);
    setScratchProgress(100);
    miniGameAudio.playSuccessChime();
    miniGameAudio.triggerHaptic([20, 50, 20]);
    onComplete?.({
      gameType: "scratch_reveal",
      completedAt: new Date().toISOString(),
      summary: `${payload.revealedTitle}: ${payload.revealedText}`,
    });
  };

  useEffect(() => {
    const handleGlobalUp = () => {
      isScratchingRef.current = false;
    };
    window.addEventListener("pointerup", handleGlobalUp);
    return () => window.removeEventListener("pointerup", handleGlobalUp);
  }, []);

  return (
    <div className="p-3 sm:p-3.5 rounded-2xl border border-border/70 bg-card/60 space-y-3 text-left">
      <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 min-w-0">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-foreground truncate">
            {payload.title}
          </span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary text-muted-foreground shrink-0 max-w-full truncate">
          {payload.foodSource}
        </span>
      </div>

      {/* Scratchable Card Container with touch-none for flawless mobile gesture */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={cn(
          "relative overflow-hidden rounded-xl border border-border min-h-[130px] sm:min-h-[140px] p-3.5 sm:p-4 flex flex-col justify-center select-none cursor-grab active:cursor-grabbing transition-all touch-none",
          isRevealed ? "bg-amber-500/10 border-amber-500/30" : "bg-secondary/40"
        )}
      >
        {/* Revealed Content Behind */}
        <div className="space-y-1.5 text-left">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-xs sm:text-[13px] font-bold text-foreground">
              {payload.revealedTitle}
            </span>
            <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 shrink-0">
              {payload.badge}
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {payload.revealedText}
          </p>
        </div>

        {/* Frosted Scratch Overlay */}
        {!isRevealed && (
          <div
            style={{
              opacity: Math.max(0, 1 - scratchProgress / 70),
              backdropFilter: `blur(${Math.max(0, 12 - (scratchProgress / 100) * 12)}px)`,
            }}
            className="absolute inset-0 bg-background/85 flex flex-col items-center justify-center p-3 text-center transition-opacity duration-150"
          >
            <Eye className="w-5 h-5 text-muted-foreground/80 animate-pulse mb-1" />
            <p className="text-xs font-bold text-foreground leading-snug px-2">{payload.teaser}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Frotá con el pulgar para despejar ({scratchProgress}%)
            </p>
          </div>
        )}
      </div>

      {!isRevealed ? (
        <button
          type="button"
          onClick={triggerComplete}
          className="w-full min-h-[44px] py-2 px-3 text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-center flex items-center justify-center active:scale-[0.99]"
        >
          O toca aquí para revelar directamente
        </button>
      ) : (
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
          <Check className="w-3.5 h-3.5 shrink-0" />
          <span>Dato descubierto.</span>
        </div>
      )}
    </div>
  );
}
