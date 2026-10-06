import { useState, useRef } from "react";
import { Sparkles, Check, HelpCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { SwipeCardPayload, MiniGameResult } from "./mini-game-types";
import { miniGameAudio } from "./mini-game-audio";
import { cn } from "@/lib/utils";

interface SwipeCardGameProps {
  payload: SwipeCardPayload;
  onComplete?: (result: MiniGameResult) => void;
  initialCompleted?: boolean;
}

export function SwipeCardGame({
  payload,
  onComplete,
  initialCompleted,
}: SwipeCardGameProps) {
  const [decision, setDecision] = useState<"truth" | "myth" | null>(
    initialCompleted ? (payload.isTruth ? "truth" : "myth") : null
  );
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);
  const touchStartXRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);

  const handleChoose = (choice: "truth" | "myth") => {
    if (decision) return;
    setDecision(choice);
    setDragOffset(0);
    setIsSwiping(false);

    const isMatch = (choice === "truth") === payload.isTruth;
    if (isMatch) {
      miniGameAudio.playSuccessChime();
      miniGameAudio.triggerHaptic([20, 40, 20]);
    } else {
      miniGameAudio.playWarmInsightChime();
      miniGameAudio.triggerHaptic(15);
    }

    onComplete?.({
      gameType: "swipe_card",
      completedAt: new Date().toISOString(),
      summary: payload.explanation,
      userSelection: choice,
    });
  };

  // Touch Swipe Gesture Handlers (Mobile-First)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (decision) return;
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping || decision) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - touchStartXRef.current;
    const diffY = currentY - touchStartYRef.current;

    // Only swipe horizontally if dominant over vertical scroll
    if (Math.abs(diffX) > Math.abs(diffY)) {
      setDragOffset(diffX);
    }
  };

  const handleTouchEnd = () => {
    if (!isSwiping || decision) return;
    setIsSwiping(false);

    // Swipe threshold: 60px
    if (dragOffset < -60) {
      handleChoose("myth");
    } else if (dragOffset > 60) {
      handleChoose("truth");
    } else {
      setDragOffset(0);
    }
  };

  return (
    <div className="p-3 sm:p-3.5 rounded-2xl border border-border/70 bg-card/60 space-y-3 text-left">
      <div className="flex items-center gap-1.5 min-w-0">
        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span className="text-[11px] font-bold uppercase tracking-wider text-foreground truncate">
          {payload.title}
        </span>
      </div>

      {/* Swipeable Myth Card */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: !decision && dragOffset !== 0 ? `translateX(${dragOffset}px) rotate(${dragOffset * 0.06}deg)` : undefined,
          transition: isSwiping ? "none" : "transform 0.25s ease-out",
        }}
        className={cn(
          "p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-300 relative select-none",
          !decision && "cursor-grab active:cursor-grabbing",
          decision
            ? "bg-secondary/60 border-foreground/20"
            : "bg-secondary/30 border-border shadow-xs"
        )}
      >
        {/* Visual Swipe Direction Hints while dragging */}
        {!decision && isSwiping && Math.abs(dragOffset) > 15 && (
          <div
            className={cn(
              "absolute top-2.5 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider transition-opacity",
              dragOffset < 0
                ? "left-3 bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30"
                : "right-3 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
            )}
          >
            {dragOffset < 0 ? "← Mito" : "Verdad →"}
          </div>
        )}

        <div className="flex items-start gap-2.5 min-w-0">
          <HelpCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs sm:text-[13px] font-semibold text-foreground leading-snug break-words">
            "{payload.statement}"
          </p>
        </div>

        {decision && (
          <div className="mt-3 pt-3 border-t border-border/60 space-y-1.5 animate-in fade-in duration-300">
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0",
                  payload.isTruth
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    : "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400"
                )}
              >
                {payload.isTruth ? "Realidad biológica" : "Mito extendido"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed break-words">
              {payload.explanation}
            </p>
          </div>
        )}
      </div>

      {/* 2 Tap / Swipe Decision Buttons with 44px min touch target */}
      {!decision ? (
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          <button
            type="button"
            onClick={() => handleChoose("myth")}
            className="min-h-[44px] py-2.5 px-3 rounded-xl border border-border bg-secondary/50 hover:bg-secondary hover:border-foreground/30 text-xs font-bold text-foreground flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-[0.98]"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>Mito</span>
          </button>
          <button
            type="button"
            onClick={() => handleChoose("truth")}
            className="min-h-[44px] py-2.5 px-3 rounded-xl border border-border bg-secondary/50 hover:bg-secondary hover:border-foreground/30 text-xs font-bold text-foreground flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-[0.98]"
          >
            <span>Verdad</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground pt-0.5 min-w-0">
          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span className="truncate">{payload.takeaway}</span>
        </div>
      )}
    </div>
  );
}
