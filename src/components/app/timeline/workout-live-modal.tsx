import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Check,
  Activity,
  Flame,
  Footprints,
  Bike,
  Dumbbell,
  Sparkles,
  MapPin,
  Clock,
  Sparkle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MetActivity } from "@/lib/met-activities";

export interface WorkoutLiveModalProps {
  onClose: () => void;
  onSave: (
    activityName: string,
    duration: number,
    intensity: "low" | "med" | "high",
    metPoints: number,
    extra?: {
      distance?: number;
      notes?: string;
      kcal?: number;
      startTime?: string;
    },
  ) => void;
  activities: MetActivity[];
  userWeight?: number;
}

const FREQUENT_ACTIVITIES = [
  { name: "Caminata", icon: Footprints, label: "Caminata" },
  { name: "Correr", icon: Activity, label: "Correr" },
  { name: "Bicicleta", icon: Bike, label: "Bicicleta" },
  { name: "Entrenamiento de fuerza", icon: Dumbbell, label: "Fuerza" },
  { name: "Pilates", icon: Sparkles, label: "Pilates" },
];

export function WorkoutLiveModal({
  onClose,
  onSave,
  activities,
  userWeight = 70,
}: WorkoutLiveModalProps) {
  const [selectedActivity, setSelectedActivity] = useState(
    activities.find((a) => a.name === "Caminata")?.name || activities[0]?.name || "Caminata",
  );
  const [intensity, setIntensity] = useState<"low" | "med" | "high">("med");
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerIsRunning, setTimerIsRunning] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [notes, setNotes] = useState("");
  const startTimeRef = useRef<Date | null>(null);

  // Interval timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerIsRunning) {
      if (!startTimeRef.current) {
        startTimeRef.current = new Date();
      }
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerIsRunning]);

  const currentActivityObj =
    activities.find((a) => a.name === selectedActivity) || activities[0];
  const metValue = currentActivityObj ? currentActivityObj[intensity] : 3.5;

  // Real-time calculations
  const elapsedMinutes = Math.max(1, Math.round(timerSeconds / 60));
  const calculatedPoints =
    timerSeconds > 0
      ? Math.max(1, Math.round(metValue * (timerSeconds / 60)))
      : 0;

  // Approximate calories = MET * weight_kg * (seconds / 3600)
  const calculatedKcal =
    timerSeconds > 0
      ? Math.max(1, Math.round(metValue * userWeight * (timerSeconds / 3600)))
      : 0;

  // Check if distance activity
  const isDistanceAct =
    selectedActivity.toLowerCase().includes("caminat") ||
    selectedActivity.toLowerCase().includes("corr") ||
    selectedActivity.toLowerCase().includes("bici") ||
    selectedActivity.toLowerCase().includes("cicli") ||
    selectedActivity.toLowerCase().includes("nataci") ||
    selectedActivity.toLowerCase().includes("senderism");

  // Approximate distance (km) based on typical speed
  const speedKmH = selectedActivity.toLowerCase().includes("bici")
    ? 20
    : selectedActivity.toLowerCase().includes("corr")
      ? 10
      : 4.8;
  const calculatedDistance = isDistanceAct
    ? Number(((speedKmH * timerSeconds) / 3600).toFixed(2))
    : undefined;

  const formatTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleTogglePlayPause = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(20);
      } catch (_) {}
    }
    setTimerIsRunning(!timerIsRunning);
  };

  const handleReset = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate([15, 20]);
      } catch (_) {}
    }
    setTimerIsRunning(false);
    setTimerSeconds(0);
    setIsFinishing(false);
    startTimeRef.current = null;
  };

  const handleFinishPrompt = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate([20, 40]);
      } catch (_) {}
    }
    setTimerIsRunning(false);
    setIsFinishing(true);
  };

  const handleConfirmSave = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(30);
      } catch (_) {}
    }
    const finalMinutes = Math.max(1, Math.round(timerSeconds / 60));
    const finalPoints = Math.max(1, Math.round(metValue * finalMinutes));
    const finalKcal = Math.max(
      1,
      Math.round(metValue * userWeight * (finalMinutes / 60)),
    );

    const startTimeFormatted = startTimeRef.current
      ? startTimeRef.current.toLocaleTimeString("es-AR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : new Date().toLocaleTimeString("es-AR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

    onSave(selectedActivity, finalMinutes, intensity, finalPoints, {
      distance: calculatedDistance,
      notes: notes.trim() || undefined,
      kcal: finalKcal,
      startTime: startTimeFormatted,
    });
    onClose();
  };

  return (
    <div className="flex flex-col h-full max-h-[88vh] text-left">
      {/* Header Estilo Google Fit */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-border/50 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-foreground leading-tight truncate">
              Registrar entrenamiento
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              Google Fit • Seguimiento en vivo
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          type="button"
          className="w-8 h-8 rounded-full bg-secondary/80 hover:bg-secondary text-foreground flex items-center justify-center transition cursor-pointer shrink-0"
          aria-label="Cerrar ventana"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Contenido scrolleable */}
      <div className="p-5 space-y-5 overflow-y-auto custom-scrollbar flex-1">
        {/* Selector de Actividad con Chips de Acceso Rápido */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
            Deporte / Actividad
          </label>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {FREQUENT_ACTIVITIES.map((item) => {
              const Icon = item.icon;
              const isSelected = selectedActivity === item.name;
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setSelectedActivity(item.name)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer border",
                    isSelected
                      ? "bg-foreground text-background border-foreground shadow-xs"
                      : "bg-secondary/40 hover:bg-secondary border-border/60 text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Selector desplegable completo */}
          <select
            value={selectedActivity}
            onChange={(e) => setSelectedActivity(e.target.value)}
            className="w-full h-10 px-3 rounded-2xl border border-border bg-card text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer transition"
          >
            {activities.map((act) => (
              <option key={act.name} value={act.name}>
                {act.name}
              </option>
            ))}
          </select>
        </div>

        {/* Gran Cronómetro Digital Google Fit */}
        <div className="relative py-8 px-4 rounded-3xl bg-secondary/20 dark:bg-secondary/10 border border-border/60 flex flex-col items-center justify-center overflow-hidden">
          {/* Indicador de estado */}
          <div className="flex items-center gap-1.5 mb-2">
            <span
              className={cn(
                "w-2 h-2 rounded-full",
                timerIsRunning
                  ? "bg-sky-500 animate-pulse"
                  : timerSeconds > 0
                    ? "bg-amber-500"
                    : "bg-muted-foreground/40",
              )}
            />
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {timerIsRunning
                ? "Entrenamiento en curso"
                : timerSeconds > 0
                  ? "Sesión en pausa"
                  : "Listo para iniciar"}
            </span>
          </div>

          {/* Tiempo digital */}
          <span className="text-5xl sm:text-6xl font-mono font-black text-foreground tracking-tight drop-shadow-xs">
            {formatTimer(timerSeconds)}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mt-1">
            Tiempo transcurrido
          </span>
        </div>

        {/* Métricas en Tiempo Real (Google Fit Metric Tiles) */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Puntos MET */}
          <div className="p-3 rounded-2xl bg-sky-500/5 border border-sky-500/20 text-center flex flex-col items-center justify-center space-y-0.5">
            <div className="flex items-center gap-1 text-sky-500">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Puntos MET
              </span>
            </div>
            <span className="text-xl font-black text-foreground">
              +{calculatedPoints}
            </span>
            <span className="text-[9px] text-muted-foreground font-semibold">
              {metValue} Pts/min
            </span>
          </div>

          {/* Calorías */}
          <div className="p-3 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-center flex flex-col items-center justify-center space-y-0.5">
            <div className="flex items-center gap-1 text-amber-500">
              <Flame className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Calorías
              </span>
            </div>
            <span className="text-xl font-black text-foreground">
              ~{calculatedKcal}
            </span>
            <span className="text-[9px] text-muted-foreground font-semibold">
              Kcal est.
            </span>
          </div>

          {/* Distancia o Ritmo */}
          <div className="p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-center flex flex-col items-center justify-center space-y-0.5">
            <div className="flex items-center gap-1 text-emerald-500">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {isDistanceAct ? "Distancia" : "Intensidad"}
              </span>
            </div>
            <span className="text-xl font-black text-foreground">
              {isDistanceAct
                ? `${calculatedDistance || 0}`
                : intensity === "low"
                  ? "Baja"
                  : intensity === "med"
                    ? "Media"
                    : "Alta"}
            </span>
            <span className="text-[9px] text-muted-foreground font-semibold">
              {isDistanceAct ? "Kilómetros" : `${metValue} METs`}
            </span>
          </div>
        </div>

        {/* Nivel de Esfuerzo / Intensidad en Vivo */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
            Nivel de Esfuerzo (Ritmo de acumulación)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "low", label: "Ligero", desc: "Suave" },
              { id: "med", label: "Moderado", desc: "Activo" },
              { id: "high", label: "Vigoroso", desc: "Intenso" },
            ].map((lvl) => {
              const active = intensity === lvl.id;
              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setIntensity(lvl.id as any)}
                  className={cn(
                    "p-2.5 rounded-2xl border text-center transition-all cursor-pointer",
                    active
                      ? "border-sky-500 bg-sky-500/10 text-foreground ring-1 ring-sky-500"
                      : "border-border/60 bg-card hover:bg-secondary/30 text-muted-foreground",
                  )}
                >
                  <span className="text-xs font-bold block">{lvl.label}</span>
                  <span className="text-[10px] opacity-75">{lvl.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Si está finalizando: formulario de resumen rápido */}
        {isFinishing && (
          <div className="p-4 rounded-3xl bg-secondary/30 border border-border/80 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center gap-2 text-foreground font-bold text-xs uppercase tracking-wider">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>Resumen de tu sesión</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Completaste{" "}
              <strong className="text-foreground">{elapsedMinutes} minutos</strong>{" "}
              de {selectedActivity}, sumando{" "}
              <strong className="text-sky-500">+{calculatedPoints} Pts MET</strong> y quemando aproximadamente{" "}
              <strong className="text-amber-500">~{calculatedKcal} kcal</strong>.
            </p>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                Notas u observaciones (opcional)
              </label>
              <input
                type="text"
                placeholder="Ej. Sesión en el parque, ritmo cómodo..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-border bg-background text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        )}
      </div>

      {/* Thumb-Zone Controls al pie (Ergonomía Google Fit) */}
      <div className="p-4 border-t border-border/50 bg-card flex items-center justify-center gap-4 shrink-0">
        {/* Botón Reiniciar (si hay tiempo transcurrido) */}
        {timerSeconds > 0 && !isFinishing && (
          <button
            type="button"
            onClick={handleReset}
            className="w-12 h-12 rounded-full bg-secondary/80 hover:bg-secondary text-muted-foreground hover:text-foreground flex items-center justify-center transition cursor-pointer"
            title="Reiniciar cronómetro"
            aria-label="Reiniciar cronómetro"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        )}

        {/* Botón Central Grande Play/Pause */}
        {!isFinishing ? (
          <button
            type="button"
            onClick={handleTogglePlayPause}
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all duration-200 cursor-pointer active:scale-95",
              timerIsRunning
                ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20"
                : "bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/25",
            )}
            title={timerIsRunning ? "Pausar entrenamiento" : "Iniciar entrenamiento"}
            aria-label={timerIsRunning ? "Pausar entrenamiento" : "Iniciar entrenamiento"}
          >
            {timerIsRunning ? (
              <Pause className="w-7 h-7 fill-current" />
            ) : (
              <Play className="w-7 h-7 fill-current ml-0.5" />
            )}
          </button>
        ) : null}

        {/* Botón Finalizar / Guardar */}
        {timerSeconds > 0 && !isFinishing && (
          <button
            type="button"
            onClick={handleFinishPrompt}
            className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-md transition cursor-pointer"
            title="Finalizar y guardar"
            aria-label="Finalizar y guardar"
          >
            <Check className="w-6 h-6 stroke-[2.5]" />
          </button>
        )}

        {/* Botones definitivos si está en modo resumen */}
        {isFinishing && (
          <div className="flex items-center gap-2 w-full">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsFinishing(false)}
              className="flex-1 rounded-2xl h-11 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Volver
            </Button>
            <Button
              type="button"
              onClick={handleConfirmSave}
              className="flex-2 rounded-2xl h-11 bg-foreground text-background hover:opacity-90 text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md"
            >
              Guardar en el Diario
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
