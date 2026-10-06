import { useState } from "react";
import { Sparkles, Check, Zap } from "lucide-react";
import { HapticSliderPayload, MiniGameResult } from "./mini-game-types";
import { miniGameAudio } from "./mini-game-audio";
import { cn } from "@/lib/utils";

interface HapticSliderGameProps {
  payload: HapticSliderPayload;
  onComplete?: (result: MiniGameResult) => void;
  initialCompleted?: boolean;
}

export function HapticSliderGame({
  payload,
  onComplete,
  initialCompleted,
}: HapticSliderGameProps) {
  const [value, setValue] = useState(payload.defaultValue ?? 50);
  const [hasInteracted, setHasInteracted] = useState(Boolean(initialCompleted));

  const currentFeedback = payload.feedbacks.find(
    (fb) => value >= fb.range[0] && value <= fb.range[1]
  ) || payload.feedbacks[0];

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = parseInt(e.target.value, 10);
    if (Math.abs(newVal - value) >= 15) {
      miniGameAudio.triggerHaptic(8);
      miniGameAudio.playTick();
    }
    setValue(newVal);
  };

  const handlePointerUp = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      miniGameAudio.playSuccessChime();
      miniGameAudio.triggerHaptic([15, 30]);
      onComplete?.({
        gameType: "haptic_slider",
        completedAt: new Date().toISOString(),
        summary: `${currentFeedback?.label}: ${currentFeedback?.text}`,
        userSelection: value,
      });
    }
  };

  return (
    <div className="p-3 sm:p-3.5 rounded-2xl border border-border/70 bg-card/60 space-y-3.5 text-left">
      <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 min-w-0">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-foreground truncate">
            {payload.title}
          </span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary text-foreground shrink-0 max-w-full truncate">
          {currentFeedback?.label}
        </span>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">{payload.prompt}</p>

      {/* Slider Track with Native Thumb */}
      <div className="space-y-2 py-1.5">
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={handleSliderChange}
          onPointerUp={handlePointerUp}
          onTouchEnd={handlePointerUp}
          className="w-full h-3 sm:h-2.5 bg-secondary/80 rounded-full appearance-none cursor-pointer accent-foreground touch-pan-y"
        />
        <div className="flex justify-between items-center text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-wider gap-2">
          <span className="truncate max-w-[48%]">{payload.minLabel}</span>
          <span className="truncate max-w-[48%] text-right">{payload.maxLabel}</span>
        </div>
      </div>

      {/* Dynamic Feedback Card */}
      <div className={cn(
        "p-3 sm:p-3.5 rounded-xl border transition-all duration-300 text-xs",
        hasInteracted
          ? "bg-amber-500/10 border-amber-500/30 text-foreground"
          : "bg-secondary/40 border-border text-muted-foreground"
      )}>
        <div className="flex items-center gap-1.5 font-bold mb-1">
          {hasInteracted ? (
            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          ) : (
            <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          )}
          <span className="truncate">{currentFeedback?.label}</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          {currentFeedback?.text}
        </p>
      </div>
    </div>
  );
}
