import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { TapToPairPayload, MiniGameResult } from "./mini-game-types";
import { miniGameAudio } from "./mini-game-audio";

interface TapToPairGameProps {
  payload: TapToPairPayload;
  onComplete?: (result: MiniGameResult) => void;
  initialCompleted?: boolean;
}

export function TapToPairGame({ payload, onComplete, initialCompleted }: TapToPairGameProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(Boolean(initialCompleted));
  const [shakeId, setShakeId] = useState<string | null>(null);

  const totalPairs = payload.items.length / 2;
  const currentMatchedPairs = matchedIds.length / 2;

  const handleTileClick = (item: TapToPairPayload["items"][0]) => {
    if (isCompleted || matchedIds.includes(item.id)) return;

    // First selection
    if (!selectedId) {
      setSelectedId(item.id);
      miniGameAudio.playSnapChime();
      miniGameAudio.triggerHaptic(15);
      return;
    }

    // Tapped the same item: deselect
    if (selectedId === item.id) {
      setSelectedId(null);
      return;
    }

    const firstItem = payload.items.find((i) => i.id === selectedId);
    if (!firstItem) {
      setSelectedId(item.id);
      return;
    }

    // Check if they form a matching pair
    if (firstItem.pairId === item.pairId && firstItem.category !== item.category) {
      // Valid Match!
      const newMatched = [...matchedIds, firstItem.id, item.id];
      setMatchedIds(newMatched);
      setSelectedId(null);
      miniGameAudio.playSuccessChime();
      miniGameAudio.triggerHaptic([20, 40, 20]);

      if (newMatched.length / 2 >= totalPairs) {
        setIsCompleted(true);
        onComplete?.({
          gameType: "tap_to_pair",
          completedAt: new Date().toISOString(),
          summary: payload.explanation,
        });
      }
    } else {
      // Gentle non-punitive mismatch: soft shake and reset
      setShakeId(item.id);
      miniGameAudio.playTone(320, 0.12, "sine", 0.04);
      miniGameAudio.triggerHaptic(10);
      setTimeout(() => {
        setShakeId(null);
        setSelectedId(null);
      }, 350);
    }
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
        <span className="text-[10px] font-bold text-muted-foreground shrink-0 tabular-nums">
          {currentMatchedPairs}/{totalPairs} pares
        </span>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">{payload.instruction}</p>

      {/* Tiles Grid: 1 col on narrow mobile, 2 cols on >=420px */}
      <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-2">
        {payload.items.map((item) => {
          const isSelected = selectedId === item.id;
          const isMatched = matchedIds.includes(item.id);
          const isShaking = shakeId === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleTileClick(item)}
              disabled={isMatched}
              className={cn(
                "min-h-[44px] p-2.5 sm:p-3 rounded-xl border text-[11px] sm:text-xs font-semibold flex items-center justify-between gap-2 transition-all duration-200 cursor-pointer text-left select-none active:scale-[0.98]",
                isMatched
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 opacity-80 cursor-default"
                  : isSelected
                    ? "bg-amber-500/15 border-amber-500/40 text-foreground ring-2 ring-amber-400/50 -translate-y-0.5 shadow-xs"
                    : "bg-secondary/50 border-border hover:bg-secondary/80 hover:border-foreground/30 text-foreground",
                isShaking && "animate-shake border-amber-500/40"
              )}
            >
              <span className="line-clamp-2 leading-tight break-words flex-1 min-w-0">{item.label}</span>
              {isMatched && <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 ml-1" />}
            </button>
          );
        })}
      </div>

      {isCompleted && (
        <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-200 space-y-1 animate-in fade-in duration-300">
          <div className="font-bold flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 shrink-0" />
            <span>¡Sinergias biológicas conectadas!</span>
          </div>
          <p className="text-[11px] leading-relaxed opacity-90">{payload.explanation}</p>
        </div>
      )}
    </div>
  );
}
