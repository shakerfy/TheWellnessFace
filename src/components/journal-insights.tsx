import React, { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Scale,
  TrendingUp,
  Plus,
  Flag,
  Sparkles,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type TimeframeOption = "90d" | "6m" | "1y" | "all";

export interface WeightLogItem {
  id: string;
  date: string;
  time?: string;
  weight: number;
  unit?: string;
  context?: string;
  createdAt?: string;
}

export interface WeightDataPoint {
  dateLabel: string;
  dateFull: string;
  weight: number;
  isProjected?: boolean;
}

const TIMEFRAME_DATA: Record<
  TimeframeOption,
  {
    label: string;
    points: WeightDataPoint[];
    targetProgress: number; // percentage
    targetWeight: number;
  }
> = {
  "90d": {
    label: "90 Días",
    targetProgress: 80,
    targetWeight: 72.0,
    points: [
      { dateLabel: "Sáb", dateFull: "19 Oct 2026", weight: 75.8 },
      { dateLabel: "Dom", dateFull: "20 Oct 2026", weight: 75.2 },
      { dateLabel: "Lun", dateFull: "21 Oct 2026", weight: 74.9 },
      { dateLabel: "Mar", dateFull: "22 Oct 2026", weight: 74.5 },
      { dateLabel: "Mié", dateFull: "23 Oct 2026", weight: 74.2 },
      { dateLabel: "Jue", dateFull: "24 Oct 2026", weight: 73.8 },
      { dateLabel: "Vie", dateFull: "25 Oct 2026", weight: 73.5 },
    ],
  },
  "6m": {
    label: "6 Meses",
    targetProgress: 75,
    targetWeight: 72.0,
    points: [
      { dateLabel: "May", dateFull: "15 May 2026", weight: 77.2 },
      { dateLabel: "Jun", dateFull: "15 Jun 2026", weight: 76.5 },
      { dateLabel: "Jul", dateFull: "15 Jul 2026", weight: 75.8 },
      { dateLabel: "Ago", dateFull: "15 Ago 2026", weight: 75.0 },
      { dateLabel: "Sep", dateFull: "15 Sep 2026", weight: 74.2 },
      { dateLabel: "Oct", dateFull: "15 Oct 2026", weight: 73.5 },
    ],
  },
  "1y": {
    label: "1 Año",
    targetProgress: 85,
    targetWeight: 72.0,
    points: [
      { dateLabel: "T1", dateFull: "Ene 2026", weight: 79.4 },
      { dateLabel: "T2", dateFull: "Abr 2026", weight: 77.1 },
      { dateLabel: "T3", dateFull: "Jul 2026", weight: 75.2 },
      { dateLabel: "T4", dateFull: "Oct 2026", weight: 73.5 },
    ],
  },
  all: {
    label: "Todo el año",
    targetProgress: 90,
    targetWeight: 72.0,
    points: [
      { dateLabel: "Inicio", dateFull: "Nov 2025", weight: 81.0 },
      { dateLabel: "Mes 3", dateFull: "Feb 2026", weight: 78.3 },
      { dateLabel: "Mes 6", dateFull: "May 2026", weight: 76.2 },
      { dateLabel: "Mes 9", dateFull: "Ago 2026", weight: 74.5 },
      { dateLabel: "Actual", dateFull: "Oct 2026", weight: 73.5 },
    ],
  },
};

export function getStoredWeightLogs(): WeightLogItem[] {
  if (typeof window === "undefined") return [];
  try {
    const directHistory = localStorage.getItem("shakerfy_weight_history");
    if (directHistory) {
      const parsed = JSON.parse(directHistory);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    // Migration fallback from timeline
    const savedTimeline = localStorage.getItem("shakerfy_user_timeline_items");
    if (savedTimeline) {
      const items = JSON.parse(savedTimeline);
      if (Array.isArray(items)) {
        const weightItems: WeightLogItem[] = items
          .filter((it: any) => it && it.type === "weight" && it.weight)
          .map((it: any) => ({
            id: it.id || `weight-${Date.now()}`,
            date: it.date || new Date().toISOString().split("T")[0],
            time: it.time || "08:30",
            weight: parseFloat(it.weight),
            unit: it.unit || "kg",
            context: it.context || "En ayunas",
            createdAt: it.createdAt || new Date().toISOString(),
          }));
        if (weightItems.length > 0) {
          localStorage.setItem("shakerfy_weight_history", JSON.stringify(weightItems));
          return weightItems;
        }
      }
    }
  } catch (_) {}
  return [];
}

export function deleteStoredWeightLog(id: string): WeightLogItem[] {
  if (typeof window === "undefined") return [];
  const current = getStoredWeightLogs();
  const updated = current.filter((it) => it.id !== id);
  localStorage.setItem("shakerfy_weight_history", JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent("shakerfy:weight-history-updated"));
  return updated;
}

export function restoreStoredWeightLog(item: WeightLogItem): WeightLogItem[] {
  if (typeof window === "undefined") return [];
  const current = getStoredWeightLogs();
  const updated = [item, ...current];
  localStorage.setItem("shakerfy_weight_history", JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent("shakerfy:weight-history-updated"));
  return updated;
}

export function addStoredWeightLog(entry: {
  weight: number;
  context?: string;
  unit?: string;
  date?: string;
  time?: string;
}): WeightLogItem[] {
  if (typeof window === "undefined") return [];
  const current = getStoredWeightLogs();
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const defaultDate = `${year}-${month}-${day}`;
  const defaultTime = now.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });

  const newItem: WeightLogItem = {
    id: `weight-${Date.now()}`,
    date: entry.date || defaultDate,
    time: entry.time || defaultTime,
    weight: entry.weight,
    unit: entry.unit || "kg",
    context: entry.context || "En ayunas",
    createdAt: now.toISOString(),
  };

  const updated = [newItem, ...current];
  localStorage.setItem("shakerfy_weight_history", JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent("shakerfy:weight-history-updated"));
  return updated;
}

export interface JournalInsightsProps {
  className?: string;
  weightLogs?: WeightLogItem[];
  currentProfileWeight?: number;
  units?: "metrico" | "imperial";
  onOpenWeightLogModal?: () => void;
}

export function JournalInsightsDashboard({
  className,
  weightLogs,
  currentProfileWeight = 74.6,
  units = "metrico",
  onOpenWeightLogModal,
}: JournalInsightsProps) {
  const [timeframe, setTimeframe] = useState<TimeframeOption>("90d");
  const baseData = TIMEFRAME_DATA[timeframe];

  // Reactive state for weight logs (synced with storage events)
  const [localLogs, setLocalLogs] = useState<WeightLogItem[]>(() => {
    if (weightLogs && weightLogs.length > 0) return weightLogs;
    return getStoredWeightLogs();
  });

  useEffect(() => {
    if (weightLogs && weightLogs.length > 0) {
      setLocalLogs(weightLogs);
      return;
    }
    const handleUpdate = () => {
      setLocalLogs(getStoredWeightLogs());
    };
    window.addEventListener("shakerfy:weight-history-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("shakerfy:weight-history-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [weightLogs]);

  const unitLabel = units === "metrico" ? "kg" : "lbs";

  const handleDeleteLog = (logItem: WeightLogItem) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(15);
      } catch (_) {}
    }
    const updated = deleteStoredWeightLog(logItem.id);
    setLocalLogs(updated);

    toast(`Registro de ${logItem.weight} ${unitLabel} eliminado`, {
      action: {
        label: "Deshacer",
        onClick: () => {
          const restored = restoreStoredWeightLog(logItem);
          setLocalLogs(restored);
          toast.success("✓ Registro restaurado");
        },
      },
      duration: 4000,
    });
  };

  // Retrieve all weight numbers from reactive localLogs
  const allWeightValues = useMemo(() => {
    return localLogs
      .map((log) => log.weight)
      .filter((w) => typeof w === "number" && !isNaN(w) && w > 0);
  }, [localLogs]);

  const latestWeight = useMemo(() => {
    if (allWeightValues.length > 0) {
      return allWeightValues[0];
    }
    return currentProfileWeight || 74.6;
  }, [allWeightValues, currentProfileWeight]);

  const averageWeight = useMemo(() => {
    if (allWeightValues.length > 0) {
      const sum = allWeightValues.reduce((acc, v) => acc + v, 0);
      const avg = sum / allWeightValues.length;
      return Math.round(avg * 10) / 10;
    }
    return currentProfileWeight || 74.6;
  }, [allWeightValues, currentProfileWeight]);

  const displayWeight = units === "metrico" ? latestWeight : Math.round(latestWeight * 2.20462);
  const displayAvgWeight =
    units === "metrico"
      ? averageWeight
      : Math.round(averageWeight * 2.20462 * 10) / 10;

  // Dynamic chart data merging user's actual latest weight
  const chartPoints = useMemo(() => {
    return baseData.points.map((pt, idx) => {
      if (idx === baseData.points.length - 1) {
        return {
          ...pt,
          weight: displayWeight,
        };
      }
      return {
        ...pt,
        weight: units === "metrico" ? pt.weight : Math.round(pt.weight * 2.20462),
      };
    });
  }, [baseData, displayWeight, units]);

  // Geometry for Circular Progress Rings
  // Ring 1 (Latest Weight): radius 36, perimeter 2 * PI * 36 = ~226.2
  const ringRadius = 36;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const weightProgressRatio = Math.min(1, Math.max(0.2, (displayWeight - 60) / 30));
  const weightStrokeDashoffset = ringCircumference - weightProgressRatio * ringCircumference;

  // Ring 2 (Average Weight):
  const avgProgressRatio = Math.min(1, Math.max(0.2, (displayAvgWeight - 60) / 30));
  const avgStrokeDashoffset = ringCircumference - avgProgressRatio * ringCircumference;

  return (
    <div className={cn("space-y-5 w-full select-none text-left animate-in fade-in duration-200", className)}>
      {/* 1. TOP ROW: 2 SYMMETRICAL CARDS WITH CIRCULAR PROGRESS RINGS */}
      <div className="grid grid-cols-2 gap-3.5 sm:gap-4 w-full items-stretch">
        {/* Card 1: Last weight (Último peso) */}
        <div className="rounded-3xl border border-border bg-card p-4 sm:p-5 shadow-xs hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center justify-between gap-3">
          {/* Circular Progress Ring with Scale Icon */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 88 88">
              {/* Background Track */}
              <circle
                cx="44"
                cy="44"
                r={ringRadius}
                fill="none"
                className="stroke-secondary dark:stroke-secondary/40"
                strokeWidth="6"
              />
              {/* Active Progress Arc */}
              <circle
                cx="44"
                cy="44"
                r={ringRadius}
                fill="none"
                className="stroke-foreground transition-all duration-700 ease-out"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={ringCircumference}
                strokeDashoffset={weightStrokeDashoffset}
              />
            </svg>

            {/* Centered Scale Icon Badge */}
            <div className="absolute inset-0 m-auto w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-secondary/80 flex items-center justify-center text-foreground shadow-2xs">
              <Scale className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
          </div>

          {/* Metric Labels */}
          <div className="space-y-0.5">
            <span className="text-xs text-muted-foreground font-medium block">
              Último peso
            </span>
            <div className="text-lg sm:text-2xl font-black text-foreground tabular-nums tracking-tight">
              {displayWeight} {unitLabel}
            </div>
          </div>
        </div>

        {/* Card 2: Average weight (Peso promedio) */}
        <div className="rounded-3xl border border-border bg-card p-4 sm:p-5 shadow-xs hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center justify-between gap-3">
          {/* Circular Progress Ring with TrendingUp Icon */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 88 88">
              {/* Background Track */}
              <circle
                cx="44"
                cy="44"
                r={ringRadius}
                fill="none"
                className="stroke-secondary dark:stroke-secondary/40"
                strokeWidth="6"
              />
              {/* Active Progress Arc */}
              <circle
                cx="44"
                cy="44"
                r={ringRadius}
                fill="none"
                className="stroke-foreground transition-all duration-700 ease-out"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={ringCircumference}
                strokeDashoffset={avgStrokeDashoffset}
              />
            </svg>

            {/* Centered TrendingUp Icon Badge */}
            <div className="absolute inset-0 m-auto w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-secondary/80 flex items-center justify-center text-foreground shadow-2xs">
              <TrendingUp className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
          </div>

          {/* Metric Labels */}
          <div className="space-y-0.5">
            <span className="text-xs text-muted-foreground font-medium block">
              Peso promedio
            </span>
            <div className="text-lg sm:text-2xl font-black text-foreground tabular-nums tracking-tight">
              {displayAvgWeight} {unitLabel}
            </div>
          </div>
        </div>
      </div>

      {/* 2. TIMEFRAME PILL SELECTOR (Pill switch bar) */}
      <div className="w-full flex justify-center pt-1 pb-1">
        <div className="bg-secondary/60 dark:bg-secondary/30 p-1 rounded-full border border-border/70 inline-flex items-center gap-1 shadow-2xs">
          {(
            [
              { id: "90d", label: "90 Días" },
              { id: "6m", label: "6 Meses" },
              { id: "1y", label: "1 Año" },
              { id: "all", label: "Todo el año" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTimeframe(t.id)}
              className={cn(
                "px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer select-none",
                timeframe === t.id
                  ? "bg-card text-foreground shadow-xs font-black border border-border/60"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. GOAL PROGRESS HERO CARD (Curva gráfica con tooltip exacto y banner motivacional) */}
      <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-xs hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg transition-all duration-300 space-y-4">
        {/* Header: Title + Goal Done Badge */}
        <div className="flex items-center justify-between gap-3 pb-2 border-b border-border/40">
          <div>
            <h3 className="text-base sm:text-lg font-black text-foreground tracking-tight">
              Progreso del Objetivo
            </h3>
            <p className="text-xs text-muted-foreground">
              Evolución sostenida hacia tu peso meta
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/80 bg-secondary/50 text-xs font-bold text-foreground">
            <Flag className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="tabular-nums">{baseData.targetProgress}% completado</span>
          </div>
        </div>

        {/* Recharts Area / Line Chart */}
        <div className="h-52 sm:h-60 w-full relative pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartPoints}
              margin={{ top: 15, right: 12, left: -24, bottom: 0 }}
            >
              <defs>
                <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="var(--color-border)"
                strokeDasharray="3 3"
                strokeOpacity={0.35}
                vertical={false}
              />

              <XAxis
                dataKey="dateLabel"
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 11, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 11, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                domain={["dataMin - 3", "dataMax + 3"]}
                unit={` ${unitLabel}`}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length > 0) {
                    const data = payload[0].payload as WeightDataPoint;
                    return (
                      <div className="bg-slate-900 text-white dark:bg-slate-950 px-3.5 py-2 rounded-2xl shadow-xl border border-slate-800 text-center animate-in fade-in zoom-in-95 duration-150">
                        <div className="text-sm font-black tracking-tight tabular-nums">
                          {data.weight} {unitLabel}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          {data.dateFull}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Area
                type="monotone"
                dataKey="weight"
                stroke="#10B981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#weightGrad)"
                activeDot={{
                  r: 6,
                  fill: "#10B981",
                  stroke: "var(--color-card)",
                  strokeWidth: 2.5,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Motivational Consistency Somatic Banner (Matching Green pill from mockup) */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
          <p className="text-xs sm:text-[13px] font-bold text-emerald-700 dark:text-emerald-400 leading-snug">
            ¡Gran trabajo! La constancia es la clave y la estás dominando.
          </p>
        </div>

        {/* Quick Log Weight Action CTA */}
        {onOpenWeightLogModal && (
          <div className="pt-1 flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onOpenWeightLogModal}
              className="rounded-full text-xs font-bold gap-1.5 px-4 h-9 border-border/80 hover:bg-secondary cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Registrar peso hoy</span>
            </Button>
          </div>
        )}
      </div>

      {/* 4. HISTORIAL DE REGISTROS DE PESO */}
      <div className="rounded-3xl border border-border bg-card p-5 shadow-xs space-y-4 text-left">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
              Historial de registros
            </span>
            <Badge
              variant="outline"
              className="text-[10px] font-bold py-0.5 px-2 rounded-full border-border/60 text-muted-foreground"
            >
              {localLogs.length} {localLogs.length === 1 ? "registro" : "registros"}
            </Badge>
          </div>

          {onOpenWeightLogModal && (
            <button
              type="button"
              onClick={onOpenWeightLogModal}
              className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir</span>
            </button>
          )}
        </div>

        {localLogs.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted-foreground">
            Aún no hay registros de peso guardados.
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {localLogs.map((log) => {
              const displayVal =
                units === "metrico"
                  ? log.weight
                  : Math.round(log.weight * 2.20462 * 10) / 10;
              return (
                <div
                  key={log.id}
                  className="py-3 flex items-center justify-between gap-3 text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-500 shrink-0">
                      <Scale className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-foreground">
                          {log.date}
                        </span>
                        {log.time && (
                          <span className="text-[11px] text-muted-foreground">
                            {log.time}
                          </span>
                        )}
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-secondary/70 text-muted-foreground border border-border/40">
                          {log.context || "En ayunas"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <span className="text-sm font-black text-foreground tabular-nums">
                      {displayVal} {unitLabel}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteLog(log)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground/60 hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Eliminar registro"
                      aria-label="Eliminar registro"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
