import { useState } from "react";
import { Sparkles, Check } from "lucide-react";
import { BalancingScalePayload, MiniGameResult } from "./mini-game-types";
import { miniGameAudio } from "./mini-game-audio";
import { cn } from "@/lib/utils";

interface BalancingScaleGameProps {
  payload: BalancingScalePayload;
  onComplete?: (result: MiniGameResult) => void;
  initialCompleted?: boolean;
}

export function BalancingScaleGame({
  payload,
  onComplete,
  initialCompleted,
}: BalancingScaleGameProps) {
  const [tiltedSide, setTiltedSide] = useState<"left" | "right" | null>(
    initialCompleted ? "left" : null
  );

  const handleTilt = (side: "left" | "right") => {
    if (tiltedSide === side) return;
    setTiltedSide(side);
    miniGameAudio.playSuccessChime();
    miniGameAudio.triggerHaptic([20, 35]);

    const activeSideData = side === "left" ? payload.sideA : payload.sideB;
    onComplete?.({
      gameType: "balancing_scale",
      completedAt: new Date().toISOString(),
      summary: `${activeSideData.label}: ${activeSideData.explanation}`,
      userSelection: side,
    });
  };

  const activeSide =
    tiltedSide === "left" ? payload.sideA : tiltedSide === "right" ? payload.sideB : null;

  return (
    <div className="p-3 sm:p-3.5 rounded-2xl border border-border/70 bg-card/60 space-y-3 text-left">
      <div className="flex items-center gap-1.5 min-w-0">
        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span className="text-[11px] font-bold uppercase tracking-wider text-foreground truncate">
          {payload.title}
        </span>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">{payload.question}</p>

      {/* SVG Balance Scale Visual */}
      <div className="py-2 flex justify-center">
        <svg className="w-40 sm:w-48 h-18 sm:h-20 max-w-full overflow-visible" viewBox="0 0 160 70">
          {/* Base & Pillar */}
          <line x1="80" y1="20" x2="80" y2="65" stroke="currentColor" strokeWidth="2.5" className="text-border" />
          <polygon points="70,65 90,65 80,55" fill="currentColor" className="text-muted-foreground/60" />

          {/* Pivot dot */}
          <circle cx="80" cy="20" r="3.5" fill="currentColor" className="text-foreground" />

          {/* Tilting Beam */}
          <g
            style={{
              transformOrigin: "80px 20px",
              transform:
                tiltedSide === "left"
                  ? "rotate(-9deg)"
                  : tiltedSide === "right"
                    ? "rotate(9deg)"
                    : "rotate(0deg)",
              transition: "transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            {/* Beam line */}
            <line x1="20" y1="20" x2="140" y2="20" stroke="currentColor" strokeWidth="3" className="text-foreground" strokeLinecap="round" />

            {/* Left Pan Strings & Tray */}
            <line x1="30" y1="20" x2="22" y2="40" stroke="currentColor" strokeWidth="1" className="text-muted-foreground" />
            <line x1="30" y1="20" x2="38" y2="40" stroke="currentColor" strokeWidth="1" className="text-muted-foreground" />
            <path d="M 16 40 Q 30 46 44 40 Z" fill="currentColor" className={cn(tiltedSide === "left" ? "text-amber-500" : "text-secondary")} />

            {/* Right Pan Strings & Tray */}
            <line x1="130" y1="20" x2="122" y2="40" stroke="currentColor" strokeWidth="1" className="text-muted-foreground" />
            <line x1="130" y1="20" x2="138" y2="40" stroke="currentColor" strokeWidth="1" className="text-muted-foreground" />
            <path d="M 116 40 Q 130 46 144 40 Z" fill="currentColor" className={cn(tiltedSide === "right" ? "text-emerald-500" : "text-secondary")} />
          </g>
        </svg>
      </div>

      {/* 2 Decision Buttons with 44px min touch target */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => handleTilt("left")}
          className={cn(
            "min-h-[44px] p-2.5 sm:p-3 rounded-xl border text-[11px] sm:text-xs font-bold text-center flex items-center justify-center leading-tight break-words cursor-pointer transition-all duration-200 select-none active:scale-[0.98]",
            tiltedSide === "left"
              ? "bg-amber-500/15 border-amber-500/40 text-foreground ring-2 ring-amber-400/50 shadow-xs"
              : "bg-secondary/50 border-border hover:bg-secondary hover:border-foreground/30 text-muted-foreground"
          )}
        >
          {payload.sideA.label}
        </button>

        <button
          type="button"
          onClick={() => handleTilt("right")}
          className={cn(
            "min-h-[44px] p-2.5 sm:p-3 rounded-xl border text-[11px] sm:text-xs font-bold text-center flex items-center justify-center leading-tight break-words cursor-pointer transition-all duration-200 select-none active:scale-[0.98]",
            tiltedSide === "right"
              ? "bg-emerald-500/15 border-emerald-500/40 text-foreground ring-2 ring-emerald-400/50 shadow-xs"
              : "bg-secondary/50 border-border hover:bg-secondary hover:border-foreground/30 text-muted-foreground"
          )}
        >
          {payload.sideB.label}
        </button>
      </div>

      {/* Resulting Ingredients Alignment */}
      {activeSide && (
        <div className="p-3 sm:p-3.5 rounded-xl bg-secondary/50 border border-border text-xs text-foreground space-y-1.5 animate-in fade-in duration-300">
          <div className="flex items-center gap-1.5 font-bold text-foreground">
            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Prioridad elegida: {activeSide.label}</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed break-words">
            {activeSide.explanation}
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {activeSide.highlightedIngredients.map((ing) => (
              <span
                key={ing}
                className="text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-md bg-background border border-border/80 text-foreground break-words max-w-full"
              >
                ✓ {ing}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
