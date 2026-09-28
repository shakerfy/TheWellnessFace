import React, { useState, useEffect } from "react";
import { X, Activity, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ActivityLogModalProps {
  mode?: "manual" | "timer";
  onClose: () => void;
  onSave: (
    activityName: string,
    duration: number,
    intensity: "low" | "med" | "high",
    metPoints: number,
  ) => void;
  activities: { name: string; low: number; med: number; high: number }[];
}

export function ActivityLogModal({
  mode = "manual",
  onClose,
  onSave,
  activities,
}: ActivityLogModalProps) {
  const activeTab = mode;
  const [selectedActivity, setSelectedActivity] = useState(
    activities[7]?.name || activities[0]?.name || "Caminata",
  );
  const [intensity, setIntensity] = useState<"low" | "med" | "high">("med");
  const [duration, setDuration] = useState(30);

  // Timer states
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerIsRunning, setTimerIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerIsRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerIsRunning]);

  const currentActivityObj = activities.find((a) => a.name === selectedActivity) || activities[0];
  const metValue = currentActivityObj ? currentActivityObj[intensity] : 3.0;

  // Real-time calculation of points
  const calculatedPointsManual = Math.round(metValue * duration);
  const calculatedPointsTimer = Math.max(
    timerSeconds > 0 ? Math.round(metValue) : 0,
    Math.round(metValue * (timerSeconds / 60)),
  );

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSave = () => {
    if (activeTab === "manual") {
      onSave(selectedActivity, duration, intensity, calculatedPointsManual);
    } else {
      // Use elapsed minutes (min 1 minute if timer ran at least a bit)
      const elapsedMinutes = Math.max(1, Math.round(timerSeconds / 60));
      const finalTimerPoints = Math.round(metValue * elapsedMinutes);
      onSave(selectedActivity, elapsedMinutes, intensity, finalTimerPoints);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[80] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-card border border-border rounded-[2rem] shadow-2xl flex flex-col overflow-hidden max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 pt-7 pb-3 flex justify-between items-start bg-card border-b border-border/40">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground block text-left">
              Promedio de 7 días
            </span>
            <h3 className="text-xl font-black text-foreground text-left">
              {activeTab === "timer" ? "Registrar Entrenamiento" : "Registrar Actividad"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-border transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="px-6 py-5 space-y-5 overflow-y-auto custom-scrollbar flex-1">
          {/* CRONÓMETRO EN VIVO (Visible arriba cuando es "Registrar entrenamiento") */}
          {activeTab === "timer" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200 flex flex-col items-center">
              {/* Large Digital Timer */}
              <div className="w-full py-6 bg-secondary/15 rounded-3xl border border-border/40 flex flex-col items-center justify-center relative overflow-hidden">
                {timerIsRunning && (
                  <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-sky-500 rounded-full animate-ping" />
                )}
                <span className="text-4xl font-mono font-black text-foreground tracking-tight">
                  {formatTimer(timerSeconds)}
                </span>
                <span className="text-[9px] uppercase font-black tracking-widest text-muted-foreground mt-1">
                  Tiempo de Entrenamiento
                </span>
              </div>

              {/* Timer Controls */}
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setTimerIsRunning(!timerIsRunning)}
                  className={`px-6 py-2 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer ${
                    timerIsRunning
                      ? "bg-amber-500 text-amber-foreground hover:bg-amber-500/90"
                      : "bg-foreground text-background hover:opacity-90"
                  }`}
                >
                  {timerIsRunning ? "Pausar" : timerSeconds > 0 ? "Reanudar" : "Iniciar"}
                </Button>

                {timerSeconds > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setTimerIsRunning(false);
                      setTimerSeconds(0);
                    }}
                    className="px-4 py-2 font-bold text-xs uppercase tracking-wider rounded-xl border-border text-foreground hover:bg-secondary cursor-pointer"
                  >
                    Reiniciar
                  </Button>
                )}
              </div>

              {/* Dynamic live counter of MET points */}
              <div className="w-full p-4 bg-secondary/35 border border-border/40 rounded-[1.5rem] flex items-center justify-between gap-4">
                <div className="space-y-0.5 text-left">
                  <span className="text-[9px] uppercase font-black text-muted-foreground tracking-wider block">
                    Puntos en Tiempo Real
                  </span>
                  <div className="text-lg font-black text-foreground flex items-center gap-1">
                    <Activity className="w-4 h-4 text-sky-500 animate-pulse" />
                    {calculatedPointsTimer}{" "}
                    <span className="text-xs font-bold text-muted-foreground">Pts MET</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase font-black text-muted-foreground tracking-wider block">
                    Ritmo MET
                  </span>
                  <span className="text-xs font-extrabold text-foreground">
                    {metValue} Pts / min
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Select Activity */}
          <div className="space-y-1.5 text-left">
            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
              Actividad
            </label>
            <select
              value={selectedActivity}
              onChange={(e) => setSelectedActivity(e.target.value)}
              className="w-full h-11 px-3 rounded-xl border border-border bg-background text-sm font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer"
            >
              {activities.map((act) => (
                <option key={act.name} value={act.name}>
                  {act.name}
                </option>
              ))}
            </select>
          </div>

          {/* Select Intensity */}
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest block">
              Intensidad del Esfuerzo
            </label>
            <div className="space-y-2">
              {[
                {
                  id: "low",
                  label: "Baja",
                  desc: "Respiración normal que permite conversar o cantar.",
                  border: "border-emerald-500/20 dark:border-emerald-500/10",
                  bg: "bg-emerald-500/5",
                  activeBorder: "border-emerald-500 ring-1 ring-emerald-500",
                },
                {
                  id: "med",
                  label: "Media",
                  desc: "Respiración agitada que permite conversar brevemente, pero no cantar.",
                  border: "border-amber-500/20 dark:border-amber-500/10",
                  bg: "bg-amber-500/5",
                  activeBorder: "border-amber-500 ring-1 ring-amber-500",
                },
                {
                  id: "high",
                  label: "Alta",
                  desc: "Respiración muy agitada que solo permite hablar con oraciones breves.",
                  border: "border-rose-500/20 dark:border-rose-500/10",
                  bg: "bg-rose-500/5",
                  activeBorder: "border-rose-500 ring-1 ring-rose-500",
                },
              ].map((opt) => {
                const isActive = intensity === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setIntensity(opt.id as any)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer ${opt.border} ${
                      isActive ? `${opt.activeBorder} ${opt.bg}` : "bg-card hover:bg-secondary/15"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-xs font-bold text-foreground">{opt.label}</span>
                      <span className="text-[10px] font-extrabold text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-md">
                        {currentActivityObj
                          ? currentActivityObj[opt.id as "low" | "med" | "high"]
                          : 3.0}{" "}
                        MET
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">{opt.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* MODO MANUAL: DURACIÓN Y PUNTOS ACUMULADOS */}
          {activeTab === "manual" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
              {/* Duration Slider */}
              <div className="space-y-1.5 text-left">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                    Duración (minutos)
                  </label>
                  <span className="text-xs font-extrabold text-foreground bg-secondary/50 px-2.5 py-0.5 rounded-md">
                    {duration} min
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="180"
                  step="5"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-secondary rounded-lg cursor-pointer accent-foreground"
                />
              </div>

              {/* Dynamic MET points preview */}
              <div className="p-4 bg-secondary/35 border border-border/40 rounded-[1.5rem] flex items-center justify-between gap-4">
                <div className="space-y-0.5 text-left">
                  <span className="text-[9px] uppercase font-black text-muted-foreground tracking-wider block">
                    Puntos Acumulados
                  </span>
                  <div className="text-lg font-black text-foreground flex items-center gap-1">
                    <Activity className="w-4 h-4 text-orange-500" />
                    {calculatedPointsManual}{" "}
                    <span className="text-xs font-bold text-muted-foreground">Pts MET</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase font-black text-muted-foreground tracking-wider block">
                    Valor MET
                  </span>
                  <span className="text-sm font-extrabold text-foreground">{metValue} METs</span>
                </div>
              </div>
            </div>
          )}

          {/* AI Advice/Explanation footnote */}
          <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex items-start gap-2.5 text-left">
            <Sparkles className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
            <p className="text-[10px] text-muted-foreground leading-relaxed font-semibold">
              <span className="text-foreground">¿Qué son los Puntos MET?</span> El Equivalente
              Metabólico (MET) mide la intensidad de tu ejercicio. La OMS recomienda sumar al menos{" "}
              <span className="text-foreground">150 Puntos de Actividad</span> diarios para mantener
              un estilo de vida saludable y conservar tu racha.
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-5 border-t border-border flex justify-end gap-2 bg-card">
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-xl px-4 py-2 font-bold text-xs uppercase tracking-wider text-foreground hover:bg-secondary cursor-pointer"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={activeTab === "timer" && timerSeconds === 0}
            className="rounded-xl px-5 py-2 font-bold text-xs uppercase tracking-wider bg-foreground text-background hover:opacity-90 disabled:opacity-50 cursor-pointer"
          >
            {activeTab === "timer" ? "Finalizar y Guardar" : "Guardar Actividad"}
          </Button>
        </div>
      </div>
    </div>
  );
}
