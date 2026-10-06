import { useState, useRef } from "react";
import { Sparkles, Dices, Check, Bookmark } from "lucide-react";
import { SynergySpinPayload, MiniGameResult } from "./mini-game-types";
import { miniGameAudio } from "./mini-game-audio";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SynergySpinGameProps {
  payload: SynergySpinPayload;
  onComplete?: (result: MiniGameResult) => void;
  initialCompleted?: boolean;
}

export function SynergySpinGame({
  payload,
  onComplete,
  initialCompleted,
}: SynergySpinGameProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    initialCompleted ? 0 : null
  );
  const [isSaved, setIsSaved] = useState(false);
  const spinIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setIsSaved(false);

    let count = 0;
    const totalSteps = 14;

    spinIntervalRef.current = setInterval(() => {
      count++;
      const nextIdx = count % payload.twists.length;
      setSelectedIndex(nextIdx);
      miniGameAudio.playTick();
      miniGameAudio.triggerHaptic(6);

      if (count >= totalSteps) {
        if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
        setIsSpinning(false);
        const finalIdx = Math.floor(Math.random() * payload.twists.length);
        setSelectedIndex(finalIdx);
        miniGameAudio.playSuccessChime();
        miniGameAudio.triggerHaptic([20, 50, 20]);

        const chosen = payload.twists[finalIdx];
        onComplete?.({
          gameType: "synergy_spin",
          completedAt: new Date().toISOString(),
          summary: `${chosen.name}: ${chosen.desc}`,
          userSelection: chosen.id,
        });
      }
    }, 85);
  };

  const currentTwist =
    selectedIndex !== null ? payload.twists[selectedIndex] : null;

  return (
    <div className="p-3 sm:p-3.5 rounded-2xl border border-border/70 bg-card/60 space-y-3 text-left">
      <div className="flex items-center gap-1.5 min-w-0">
        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span className="text-[11px] font-bold uppercase tracking-wider text-foreground truncate">
          {payload.title}
        </span>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">{payload.prompt}</p>

      {/* Reel Result Box */}
      <div className={cn(
        "p-3 sm:p-3.5 rounded-xl border text-left min-h-[90px] flex flex-col justify-center transition-all duration-300",
        currentTwist && !isSpinning
          ? "bg-amber-500/10 border-amber-500/30 shadow-2xs"
          : "bg-secondary/40 border-border"
      )}>
        {currentTwist ? (
          <div className="space-y-1.5 animate-in fade-in duration-200">
            <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
              <span className="text-xs sm:text-[13px] font-bold text-foreground break-words flex-1 min-w-0">
                {currentTwist.name}
              </span>
              <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 shrink-0">
                Toque gourmet
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed break-words">
              {currentTwist.desc}
            </p>
            <p className="text-[10px] sm:text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 pt-0.5">
              💡 {currentTwist.benefit}
            </p>
          </div>
        ) : (
          <div className="text-center text-xs text-muted-foreground font-medium py-2">
            Tocá el botón para descubrir un toque de alacena para este plato.
          </div>
        )}
      </div>

      {/* Action Controls: Stacks cleanly on narrow mobile */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-0.5">
        <button
          type="button"
          onClick={handleSpin}
          disabled={isSpinning}
          className="flex-1 min-h-[44px] py-2.5 px-3 rounded-xl bg-foreground text-background hover:bg-foreground/90 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-[0.98] shadow-xs disabled:opacity-50 select-none"
        >
          <Dices className={cn("w-3.5 h-3.5 shrink-0", isSpinning && "animate-spin")} />
          <span>{isSpinning ? "Girando alacena..." : "Girar toque culinario"}</span>
        </button>

        {currentTwist && !isSpinning && (
          <button
            type="button"
            onClick={() => {
              setIsSaved(true);
              miniGameAudio.triggerHaptic(15);
              toast.success(`Guardado: "${currentTwist.name}" para tu próxima comida.`);
            }}
            disabled={isSaved}
            className={cn(
              "min-h-[44px] py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-[0.98] shrink-0 select-none",
              isSaved
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                : "bg-secondary border-border hover:border-foreground/30 text-foreground"
            )}
          >
            {isSaved ? <Check className="w-3.5 h-3.5 shrink-0 text-emerald-500" /> : <Bookmark className="w-3.5 h-3.5 shrink-0" />}
            <span>{isSaved ? "Guardado" : "Guardar"}</span>
          </button>
        )}
      </div>
    </div>
  );
}
