import React, { useState, useMemo } from "react";
import {
  X,
  Activity,
  Flame,
  Footprints,
  Bike,
  Dumbbell,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  FileText,
  Search,
  Plus,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MetActivity } from "@/lib/met-activities";

export interface ActivityManualModalProps {
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
      date?: string;
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

const DURATION_PRESETS = [15, 30, 45, 60, 90];

export function ActivityManualModal({
  onClose,
  onSave,
  activities,
  userWeight = 70,
}: ActivityManualModalProps) {
  const [selectedActivity, setSelectedActivity] = useState(
    activities.find((a) => a.name === "Caminata")?.name || activities[0]?.name || "Caminata",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [duration, setDuration] = useState(30);
  const [intensity, setIntensity] = useState<"low" | "med" | "high">("med");
  const [distance, setDistance] = useState<string>("");
  const [notes, setNotes] = useState("");

  // Date and Time (Google Fit style)
  const now = new Date();
  const defaultTime = now.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const [startTime, setStartTime] = useState(defaultTime);
  const [dateSelection, setDateSelection] = useState<"today" | "yesterday">("today");

  // Filter activities based on search
  const filteredActivities = useMemo(() => {
    if (!searchQuery.trim()) return activities;
    const q = searchQuery.toLowerCase();
    return activities.filter((a) => a.name.toLowerCase().includes(q));
  }, [activities, searchQuery]);

  const currentActivityObj =
    activities.find((a) => a.name === selectedActivity) || activities[0];
  const metValue = currentActivityObj ? currentActivityObj[intensity] : 3.5;

  // Real-time calculations
  const calculatedPoints = Math.max(1, Math.round(metValue * duration));
  const calculatedKcal = Math.max(
    1,
    Math.round(metValue * userWeight * (duration / 60)),
  );

  // Check if distance activity
  const isDistanceAct =
    selectedActivity.toLowerCase().includes("caminat") ||
    selectedActivity.toLowerCase().includes("corr") ||
    selectedActivity.toLowerCase().includes("bici") ||
    selectedActivity.toLowerCase().includes("cicli") ||
    selectedActivity.toLowerCase().includes("nataci") ||
    selectedActivity.toLowerCase().includes("senderism");

  const handleSave = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(25);
      } catch (_) {}
    }

    const targetDate = new Date();
    if (dateSelection === "yesterday") {
      targetDate.setDate(targetDate.getDate() - 1);
    }
    const dateIso = targetDate.toISOString().split("T")[0];

    onSave(selectedActivity, duration, intensity, calculatedPoints, {
      distance: isDistanceAct && distance ? parseFloat(distance) : undefined,
      notes: notes.trim() || undefined,
      kcal: calculatedKcal,
      startTime: startTime || defaultTime,
      date: dateIso,
    });
    onClose();
  };

  return (
    <div className="flex flex-col h-full max-h-[88vh] text-left">
      {/* Header Estilo Google Fit */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-border/50 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
            <Activity className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-foreground leading-tight truncate">
              Registrar actividad
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              Google Fit • Registro manual
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
        {/* Selector de Actividad con Chips de Acceso Frecuente */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
            Tipo de Actividad
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

          {/* Buscador y dropdown */}
          <div className="space-y-1.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar deporte o actividad..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-8 pr-3 rounded-xl border border-border bg-card text-xs font-medium text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <select
              value={selectedActivity}
              onChange={(e) => {
                setSelectedActivity(e.target.value);
                setSearchQuery("");
              }}
              className="w-full h-10 px-3 rounded-2xl border border-border bg-card text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer transition"
            >
              {filteredActivities.map((act) => (
                <option key={act.name} value={act.name}>
                  {act.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Fecha y Hora de Inicio (Google Fit layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Fecha */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Fecha</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setDateSelection("today")}
                className={cn(
                  "py-2 px-3 rounded-xl text-xs font-bold transition border cursor-pointer text-center",
                  dateSelection === "today"
                    ? "bg-foreground text-background border-foreground shadow-xs"
                    : "bg-secondary/30 hover:bg-secondary border-border/60 text-muted-foreground hover:text-foreground",
                )}
              >
                Hoy
              </button>
              <button
                type="button"
                onClick={() => setDateSelection("yesterday")}
                className={cn(
                  "py-2 px-3 rounded-xl text-xs font-bold transition border cursor-pointer text-center",
                  dateSelection === "yesterday"
                    ? "bg-foreground text-background border-foreground shadow-xs"
                    : "bg-secondary/30 hover:bg-secondary border-border/60 text-muted-foreground hover:text-foreground",
                )}
              >
                Ayer
              </button>
            </div>
          </div>

          {/* Hora de inicio */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Hora de inicio</span>
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-border bg-card text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            />
          </div>
        </div>

        {/* Duración con Chips Rápidos y Stepper */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              Duración del Entrenamiento
            </label>
            <span className="text-xs font-extrabold text-foreground bg-secondary/60 px-2 py-0.5 rounded-md">
              {duration} min
            </span>
          </div>

          {/* Chips de duración rápida */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {DURATION_PRESETS.map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setDuration(mins)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer border",
                  duration === mins
                    ? "bg-foreground text-background border-foreground shadow-xs"
                    : "bg-secondary/40 hover:bg-secondary border-border/60 text-muted-foreground hover:text-foreground",
                )}
              >
                {mins} min
              </button>
            ))}
          </div>

          {/* Stepper numérico */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDuration((prev) => Math.max(5, prev - 5))}
              className="w-10 h-10 rounded-xl bg-secondary/60 hover:bg-secondary text-foreground flex items-center justify-center transition cursor-pointer shrink-0"
              title="Restar 5 minutos"
              aria-label="Restar 5 minutos"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="range"
              min="5"
              max="180"
              step="5"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="flex-1 h-2 bg-secondary rounded-lg cursor-pointer accent-foreground"
            />
            <button
              type="button"
              onClick={() => setDuration((prev) => Math.min(240, prev + 5))}
              className="w-10 h-10 rounded-xl bg-secondary/60 hover:bg-secondary text-foreground flex items-center justify-center transition cursor-pointer shrink-0"
              title="Sumar 5 minutos"
              aria-label="Sumar 5 minutos"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Nivel de Esfuerzo (Baja, Media, Alta) */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
            Intensidad del Esfuerzo
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              {
                id: "low",
                label: "Baja / Suave",
                desc: "Respiración normal, permite conversar fluidamente.",
                met: currentActivityObj?.low || 3.0,
              },
              {
                id: "med",
                label: "Media / Moderada",
                desc: "Respiración agitada, oraciones breves.",
                met: currentActivityObj?.med || 5.0,
              },
              {
                id: "high",
                label: "Alta / Vigorosa",
                desc: "Esfuerzo intenso, frases cortas.",
                met: currentActivityObj?.high || 8.0,
              },
            ].map((opt) => {
              const active = intensity === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setIntensity(opt.id as any)}
                  className={cn(
                    "p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-1",
                    active
                      ? "border-orange-500 bg-orange-500/10 ring-1 ring-orange-500 shadow-xs"
                      : "border-border/60 bg-card hover:bg-secondary/30",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">
                      {opt.label}
                    </span>
                    <span className="text-[10px] font-extrabold text-muted-foreground bg-secondary/70 px-1.5 py-0.5 rounded">
                      {opt.met} MET
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-tight">
                    {opt.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Distancia en Kilómetros (si aplica) */}
        {isDistanceAct && (
          <div className="space-y-1.5 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-500" />
              <span>Distancia (km) (opcional)</span>
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              placeholder="Ej. 5.2"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-border bg-card text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        )}

        {/* Notas u observaciones libres */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block flex items-center gap-1">
            <FileText className="w-3 h-3" />
            <span>Notas personales (opcional)</span>
          </label>
          <input
            type="text"
            placeholder="Sensaciones, ejercicios o contexto..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-border bg-card text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Tarjeta de Métricas Calculadas Google Fit */}
        <div className="p-4 rounded-3xl bg-secondary/30 border border-border/80 flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-[9px] uppercase font-black text-muted-foreground tracking-wider block">
              Puntos de Actividad OMS
            </span>
            <div className="text-xl font-black text-foreground flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-orange-500" />
              <span>+{calculatedPoints}</span>
              <span className="text-xs font-bold text-muted-foreground">Pts MET</span>
            </div>
          </div>

          <div className="text-right space-y-0.5">
            <span className="text-[9px] uppercase font-black text-muted-foreground tracking-wider block">
              Gasto Estimado
            </span>
            <div className="text-sm font-extrabold text-foreground flex items-center justify-end gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>~{calculatedKcal} kcal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-border/50 bg-card flex items-center justify-end gap-2.5 shrink-0">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="rounded-2xl px-5 h-11 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground cursor-pointer"
        >
          Cancelar
        </Button>
        <Button
          type="button"
          onClick={handleSave}
          className="rounded-2xl px-6 h-11 bg-foreground text-background hover:opacity-90 text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md"
        >
          Guardar actividad
        </Button>
      </div>
    </div>
  );
}
