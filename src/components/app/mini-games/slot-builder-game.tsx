import { useState } from "react";
import { Sparkles, Check, Plus, RotateCcw } from "lucide-react";
import { SlotBuilderPayload, MiniGameResult } from "./mini-game-types";
import { miniGameAudio } from "./mini-game-audio";
import { cn } from "@/lib/utils";

interface SlotBuilderGameProps {
  payload: SlotBuilderPayload;
  onComplete?: (result: MiniGameResult) => void;
  initialCompleted?: boolean;
}

export function SlotBuilderGame({
  payload,
  onComplete,
  initialCompleted,
}: SlotBuilderGameProps) {
  const [filledSlots, setFilledSlots] = useState<Record<string, string>>(
    initialCompleted
      ? payload.slots.reduce((acc, s, idx) => ({ ...acc, [s.id]: payload.pool[idx]?.label || s.label }), {})
      : {}
  );
  const [isComplete, setIsComplete] = useState(Boolean(initialCompleted));

  const filledCount = Object.keys(filledSlots).length;
  const totalSlots = payload.slots.length;

  const handlePoolItemClick = (poolItem: SlotBuilderPayload["pool"][0]) => {
    if (isComplete) return;

    // Find first empty slot that matches category or is free
    const emptySlot = payload.slots.find(
      (s) => !filledSlots[s.id] && (s.targetCategory === poolItem.category || !s.targetCategory)
    ) || payload.slots.find((s) => !filledSlots[s.id]);

    if (!emptySlot) return;

    const nextFilled = { ...filledSlots, [emptySlot.id]: poolItem.label };
    setFilledSlots(nextFilled);
    miniGameAudio.playSnapChime();
    miniGameAudio.triggerHaptic(15);

    if (Object.keys(nextFilled).length >= totalSlots) {
      setIsComplete(true);
      miniGameAudio.playSuccessChime();
      miniGameAudio.triggerHaptic([20, 50, 20]);
      onComplete?.({
        gameType: "slot_builder",
        completedAt: new Date().toISOString(),
        summary: payload.explanation,
        userSelection: Object.values(nextFilled),
      });
    }
  };

  const handleReset = () => {
    setFilledSlots({});
    setIsComplete(false);
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
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-bold text-muted-foreground tabular-nums">
            {filledCount}/{totalSlots}
          </span>
          {filledCount > 0 && !isComplete && (
            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 -m-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer flex items-center justify-center transition-colors"
              title="Reiniciar ranuras"
              aria-label="Reiniciar ranuras"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">{payload.prompt}</p>

      {/* Target Slots Row */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
        {payload.slots.map((slot) => {
          const filledLabel = filledSlots[slot.id];
          return (
            <div
              key={slot.id}
              className={cn(
                "p-1.5 sm:p-2.5 rounded-xl border text-center flex flex-col justify-center min-h-[62px] sm:min-h-[66px] transition-all duration-200 select-none",
                filledLabel
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-200 shadow-2xs"
                  : "bg-secondary/30 border-dashed border-border/80 text-muted-foreground"
              )}
            >
              <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider block opacity-70 truncate px-0.5">
                {slot.label}
              </span>
              <span className="text-[10px] sm:text-xs font-bold leading-tight line-clamp-2 break-words mt-0.5 px-0.5">
                {filledLabel || "Tocar abajo"}
              </span>
            </div>
          );
        })}
      </div>

      {/* Pool of Available Ingredients */}
      {!isComplete ? (
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
            Ingredientes disponibles:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {payload.pool.map((p) => {
              const isUsed = Object.values(filledSlots).includes(p.label);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handlePoolItemClick(p)}
                  disabled={isUsed}
                  className={cn(
                    "px-3 py-2 min-h-[40px] rounded-xl border text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 select-none",
                    isUsed
                      ? "opacity-35 bg-secondary text-muted-foreground cursor-default border-transparent"
                      : "bg-secondary/70 hover:bg-secondary border-border hover:border-foreground/30 text-foreground shadow-2xs"
                  )}
                >
                  <Plus className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="break-words">{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-foreground space-y-1 animate-in fade-in duration-300">
          <div className="font-bold flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
            <Check className="w-3.5 h-3.5 shrink-0" />
            <span>{payload.comboName} activo</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {payload.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
