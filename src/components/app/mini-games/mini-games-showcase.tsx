import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Gamepad2,
  Smartphone,
  Monitor,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  Layers,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SAMPLE_MINI_GAMES } from "@/lib/mini-game-samples";
import { MealMiniGameDispatcher } from "./meal-mini-game-dispatcher";
import { MiniGameType, MiniGameResult } from "./mini-game-types";
import { toast } from "sonner";

interface GameTab {
  id: MiniGameType;
  label: string;
  category: string;
}

const GAME_TABS: GameTab[] = [
  { id: "tap_to_pair", label: "1. Emparejador", category: "Sinergias" },
  { id: "scratch_reveal", label: "2. Raspa y Descubre", category: "Fitoquímicos" },
  { id: "odd_one_out", label: "3. El Intruso", category: "Microbiota" },
  { id: "haptic_slider", label: "4. Dial Háptico", category: "Termostato" },
  { id: "swipe_card", label: "5. Swipe A/B", category: "Mitos Flash" },
  { id: "slot_builder", label: "6. Ranuras", category: "Recuperación" },
  { id: "synergy_spin", label: "7. Ruleta Chef", category: "Toques Gourmet" },
  { id: "pace_timer", label: "8. Ritmo Masticación", category: "Pausa Somática" },
  { id: "tile_snap", label: "9. Imán de Palabras", category: "Conceptos" },
  { id: "balancing_scale", label: "10. Balanza", category: "Prioridad" },
];

export function MiniGamesShowcase() {
  const [activeGameId, setActiveGameId] = useState<MiniGameType>("tap_to_pair");
  const [viewMode, setViewMode] = useState<"mobile" | "fluid" | "all">("mobile");
  const [gameResetKeys, setGameResetKeys] = useState<Record<string, number>>({});
  const [completedStatus, setCompletedStatus] = useState<Record<string, boolean>>({});

  const handleResetCurrent = (gameId: string) => {
    setGameResetKeys((prev) => ({
      ...prev,
      [gameId]: (prev[gameId] || 0) + 1,
    }));
    setCompletedStatus((prev) => ({
      ...prev,
      [gameId]: false,
    }));
    toast.success("Minijuego reiniciado al estado inicial");
  };

  const handleGameComplete = (gameId: string, result: MiniGameResult) => {
    setCompletedStatus((prev) => ({
      ...prev,
      [gameId]: true,
    }));
    toast.success(`✓ Completado: ${result.summary}`);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-background text-foreground pb-20">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border/80 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <Link
              to="/app"
              className="p-2 -ml-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              title="Volver a la App"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Gamepad2 className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-foreground truncate flex items-center gap-1.5">
                  Laboratorio de Minijuegos
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground font-semibold">
                    10 juegos
                  </span>
                </h1>
                <p className="text-[11px] text-muted-foreground truncate">
                  Visualizá y testeá la responsividad y gestos táctiles de cada juego
                </p>
              </div>
            </div>
          </div>

          {/* Viewport switch controls */}
          <div className="flex items-center gap-1 p-1 bg-secondary/80 rounded-xl border border-border/60 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode("mobile")}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer",
                viewMode === "mobile"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Vista móvil estricta (360px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Móvil (360px)</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("fluid")}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer",
                viewMode === "fluid"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Vista fluida / ancho completo"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Fluido</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("all")}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer",
                viewMode === "all"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Ver los 10 minijuegos juntos"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Todos</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 pt-4 space-y-6">
        {/* Horizontal Navigation Pills (when not viewing all) */}
        {viewMode !== "all" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Selecciona un minijuego para probar:
              </span>
              <button
                type="button"
                onClick={() => handleResetCurrent(activeGameId)}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 font-semibold cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reiniciar juego</span>
              </button>
            </div>

            <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 -mx-1 px-1">
              {GAME_TABS.map((tab) => {
                const isActive = activeGameId === tab.id;
                const isCompleted = Boolean(completedStatus[tab.id]);

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveGameId(tab.id)}
                    className={cn(
                      "px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-2xs select-none",
                      isActive
                        ? "bg-foreground text-background border-foreground shadow-xs"
                        : "bg-card hover:bg-secondary/80 text-foreground border-border/80"
                    )}
                  >
                    <span>{tab.label}</span>
                    {isCompleted && (
                      <Check className="w-3 h-3 text-emerald-500 shrink-0 stroke-[3]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Viewport Render Area */}
        {viewMode === "all" ? (
          /* GALLERY: Render all 10 games stacked */
          <div className="space-y-6">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-foreground flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Mostrando los 10 minijuegos interactivos de la plataforma.</span>
              </div>
              <span className="text-[11px] text-muted-foreground shrink-0 font-semibold">
                Modo galería
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GAME_TABS.map((tab) => {
                const payload = SAMPLE_MINI_GAMES[tab.id];
                const key = `${tab.id}_${gameResetKeys[tab.id] || 0}`;

                return (
                  <div
                    key={tab.id}
                    className="p-4 rounded-3xl border border-border bg-card shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-border/60 pb-2">
                      <span className="text-xs font-bold text-foreground">
                        {tab.label}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleResetCurrent(tab.id)}
                        className="p-1.5 -m-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer"
                        title="Reiniciar este minijuego"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                    </div>

                    <MealMiniGameDispatcher
                      key={key}
                      payload={payload}
                      onComplete={(res) => handleGameComplete(tab.id, res)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ) : viewMode === "mobile" ? (
          /* MOBILE SIMULATOR: 360px viewport container */
          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-full max-w-[370px]">
              {/* Device Header Bar */}
              <div className="flex items-center justify-between px-3 py-1.5 bg-secondary/80 rounded-t-2xl border border-border border-b-0 text-[10px] font-bold text-muted-foreground">
                <span>SIMULADOR MÓVIL (360px)</span>
                <span className="text-emerald-600 dark:text-emerald-400">100% Responsivo</span>
              </div>

              {/* Mobile Device Frame */}
              <div className="w-full p-4 bg-card rounded-b-2xl border border-border shadow-lg space-y-3">
                <MealMiniGameDispatcher
                  key={`${activeGameId}_${gameResetKeys[activeGameId] || 0}`}
                  payload={SAMPLE_MINI_GAMES[activeGameId]}
                  onComplete={(res) => handleGameComplete(activeGameId, res)}
                />
              </div>

              <p className="text-[11px] text-muted-foreground text-center mt-3">
                💡 Podés redimensionar la ventana o activar el modo dispositivo en DevTools (F12) para probar diferentes anchos.
              </p>
            </div>
          </div>
        ) : (
          /* FLUID VIEW: Adapts to whatever width is available */
          <div className="max-w-2xl mx-auto p-5 rounded-3xl border border-border bg-card shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <span className="text-xs font-bold text-foreground">
                Vista fluida (se adapta al ancho disponible)
              </span>
              <button
                type="button"
                onClick={() => handleResetCurrent(activeGameId)}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reiniciar</span>
              </button>
            </div>

            <MealMiniGameDispatcher
              key={`${activeGameId}_${gameResetKeys[activeGameId] || 0}`}
              payload={SAMPLE_MINI_GAMES[activeGameId]}
              onComplete={(res) => handleGameComplete(activeGameId, res)}
            />
          </div>
        )}
      </main>
    </div>
  );
}
