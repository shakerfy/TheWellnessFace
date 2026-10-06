import { useState } from "react";
import { Sparkles, Check } from "lucide-react";
import { TileSnapPayload, MiniGameResult } from "./mini-game-types";
import { miniGameAudio } from "./mini-game-audio";
import { cn } from "@/lib/utils";

interface TileSnapGameProps {
  payload: TileSnapPayload;
  onComplete?: (result: MiniGameResult) => void;
  initialCompleted?: boolean;
}

export function TileSnapGame({
  payload,
  onComplete,
  initialCompleted,
}: TileSnapGameProps) {
  const [selectedTileId, setSelectedTileId] = useState<string | null>(
    initialCompleted ? payload.correctTile.id : null
  );

  const handleTileClick = (tile: { id: string; label: string }) => {
    if (selectedTileId) return;
    setSelectedTileId(tile.id);

    const isCorrect = tile.id === payload.correctTile.id;
    if (isCorrect) {
      miniGameAudio.playSuccessChime();
      miniGameAudio.triggerHaptic([20, 45, 20]);
    } else {
      miniGameAudio.playWarmInsightChime();
      miniGameAudio.triggerHaptic(15);
    }

    onComplete?.({
      gameType: "tile_snap",
      completedAt: new Date().toISOString(),
      summary: payload.explanation,
      userSelection: tile.id,
    });
  };

  const chosenTile =
    selectedTileId === payload.correctTile.id
      ? payload.correctTile
      : selectedTileId === payload.distractorTile.id
        ? payload.distractorTile
        : null;

  return (
    <div className="p-3 sm:p-3.5 rounded-2xl border border-border/70 bg-card/60 space-y-3 text-left">
      <div className="flex items-center gap-1.5 min-w-0">
        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span className="text-[11px] font-bold uppercase tracking-wider text-foreground truncate">
          {payload.title}
        </span>
      </div>

      {/* Sentence with Gap */}
      <div className="p-3 sm:p-3.5 rounded-xl border border-border bg-secondary/30 text-xs sm:text-[13px] text-foreground leading-relaxed text-left break-words">
        <span>{payload.sentenceBefore} </span>
        <span
          className={cn(
            "inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-lg border font-bold transition-all duration-300 align-middle my-0.5 mx-1 max-w-full text-center leading-snug",
            chosenTile
              ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 shadow-2xs animate-in zoom-in-95"
              : "bg-secondary border-dashed border-border/80 text-muted-foreground"
          )}
        >
          {chosenTile ? chosenTile.label : "___ ? ___"}
        </span>
        <span> {payload.sentenceAfter}</span>
      </div>

      {/* 2 Tiles to choose from: 1 col on narrow mobile, 2 cols on >=400px */}
      {!selectedTileId ? (
        <div className="space-y-1.5 pt-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
            Toca la ficha que completa el concepto:
          </span>
          <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-2">
            {[payload.correctTile, payload.distractorTile].map((tile) => (
              <button
                key={tile.id}
                type="button"
                onClick={() => handleTileClick(tile)}
                className="min-h-[44px] py-2.5 px-3 rounded-xl border border-border bg-secondary/60 hover:bg-secondary hover:border-foreground/30 text-[11px] sm:text-xs font-bold text-foreground flex items-center justify-center text-center cursor-pointer transition-all active:scale-[0.98] shadow-2xs leading-tight break-words select-none"
              >
                {tile.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-2.5 sm:p-3 rounded-xl bg-secondary/50 border border-border text-xs text-foreground space-y-1 animate-in fade-in duration-300">
          <div className="font-bold flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
            <Check className="w-3.5 h-3.5 shrink-0" />
            <span>Concepto biológico completado</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {payload.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
