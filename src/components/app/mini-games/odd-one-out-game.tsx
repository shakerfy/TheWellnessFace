import { useState } from "react";
import { Sparkles, Check, XCircle } from "lucide-react";
import { OddOneOutPayload, MiniGameResult } from "./mini-game-types";
import { miniGameAudio } from "./mini-game-audio";
import { cn } from "@/lib/utils";

interface OddOneOutGameProps {
  payload: OddOneOutPayload;
  onComplete?: (result: MiniGameResult) => void;
  initialCompleted?: boolean;
}

export function OddOneOutGame({
  payload,
  onComplete,
  initialCompleted,
}: OddOneOutGameProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isResolved, setIsResolved] = useState(Boolean(initialCompleted));

  const handleSelect = (option: OddOneOutPayload["options"][0]) => {
    if (isResolved) return;
    setSelectedId(option.id);
    setIsResolved(true);

    if (option.isOut) {
      miniGameAudio.playSuccessChime();
      miniGameAudio.triggerHaptic([25, 40, 25]);
    } else {
      miniGameAudio.playWarmInsightChime();
      miniGameAudio.triggerHaptic(15);
    }

    onComplete?.({
      gameType: "odd_one_out",
      completedAt: new Date().toISOString(),
      summary: option.explanation,
      userSelection: option.id,
    });
  };

  const chosenOption = payload.options.find((o) => o.id === selectedId);

  return (
    <div className="p-3 sm:p-3.5 rounded-2xl border border-border/70 bg-card/60 space-y-3 text-left">
      <div className="flex items-center gap-1.5 min-w-0">
        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span className="text-[11px] font-bold uppercase tracking-wider text-foreground truncate">
          {payload.title}
        </span>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">{payload.prompt}</p>

      {/* 4 Options Grid: 1 col on narrow mobile, 2 cols on >=420px */}
      <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-2">
        {payload.options.map((opt) => {
          const isSelected = selectedId === opt.id;
          const isIntruder = opt.isOut;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelect(opt)}
              disabled={isResolved}
              className={cn(
                "min-h-[44px] p-2.5 sm:p-3 rounded-xl border text-[11px] sm:text-xs font-semibold flex items-center justify-between gap-2 transition-all duration-300 cursor-pointer text-left select-none active:scale-[0.98]",
                !isResolved && "bg-secondary/50 border-border hover:bg-secondary/80 hover:border-foreground/30 text-foreground",
                isResolved && isIntruder && (
                  isSelected
                    ? "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300 line-through opacity-75"
                    : "border-border/50 text-muted-foreground line-through opacity-50"
                ),
                isResolved && !isIntruder && "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
              )}
            >
              <span className="line-clamp-2 leading-tight break-words flex-1 min-w-0">{opt.label}</span>
              {isResolved && isIntruder && (
                <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 ml-1" />
              )}
              {isResolved && !isIntruder && (
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 ml-1" />
              )}
            </button>
          );
        })}
      </div>

      {isResolved && chosenOption && (
        <div className="p-2.5 sm:p-3 rounded-xl bg-secondary/50 border border-border text-xs text-foreground space-y-1 animate-in fade-in duration-300">
          <div className="font-bold flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>{chosenOption.isOut ? "¡Intruso descartado con éxito!" : "¡Buen punto!"}</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {chosenOption.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
