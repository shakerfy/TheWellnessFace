import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, Scale } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { Badge } from "@/components/ui/badge";

type TimeframeOption = "30d" | "90d" | "6m" | "1y";

export interface WeightLogItem {
  id: string;
  date: string;
  time?: string;
  weight: number;
  unit?: string;
  context?: string;
}

interface ProgressData {
  timeframeLabel: string;
  lastWeight: number;
  lastWeightDelta: string;
  avgWeight: number;
  avgWeightDelta: string;
  goalWeight: number;
  startWeight: number;
  goalDonePct: number;
  chartPoints: { name: string; weight: number; goal: number }[];
}

const PROGRESS_DATA_MAP: Record<TimeframeOption, ProgressData> = {
  "30d": {
    timeframeLabel: "30 Días",
    lastWeight: 74.6,
    lastWeightDelta: "+0.5 hoy",
    avgWeight: 74.1,
    avgWeightDelta: "-0.3 sem",
    startWeight: 76.8,
    goalWeight: 70.0,
    goalDonePct: 80,
    chartPoints: [
      { name: "Sáb", weight: 76.5, goal: 70.0 },
      { name: "Dom", weight: 76.2, goal: 70.0 },
      { name: "Lun", weight: 75.8, goal: 70.0 },
      { name: "Mar", weight: 75.1, goal: 70.0 },
      { name: "Mié", weight: 74.8, goal: 70.0 },
      { name: "Jue", weight: 74.4, goal: 70.0 },
      { name: "Vie", weight: 74.1, goal: 70.0 },
    ],
  },
  "90d": {
    timeframeLabel: "90 Días",
    lastWeight: 74.6,
    lastWeightDelta: "+0.5 hoy",
    avgWeight: 74.1,
    avgWeightDelta: "-1.8 mes",
    startWeight: 78.5,
    goalWeight: 70.0,
    goalDonePct: 82,
    chartPoints: [
      { name: "Mes 1", weight: 78.2, goal: 70.0 },
      { name: "Sem 5", weight: 77.0, goal: 70.0 },
      { name: "Sem 7", weight: 76.1, goal: 70.0 },
      { name: "Mes 2", weight: 75.4, goal: 70.0 },
      { name: "Sem 10", weight: 74.8, goal: 70.0 },
      { name: "Mes 3", weight: 74.1, goal: 70.0 },
    ],
  },
  "6m": {
    timeframeLabel: "6 Meses",
    lastWeight: 74.6,
    lastWeightDelta: "+0.5 hoy",
    avgWeight: 74.1,
    avgWeightDelta: "-3.5 acum",
    startWeight: 81.0,
    goalWeight: 70.0,
    goalDonePct: 85,
    chartPoints: [
      { name: "Mes 1", weight: 80.8, goal: 70.0 },
      { name: "Mes 2", weight: 79.2, goal: 70.0 },
      { name: "Mes 3", weight: 77.6, goal: 70.0 },
      { name: "Mes 4", weight: 76.1, goal: 70.0 },
      { name: "Mes 5", weight: 75.0, goal: 70.0 },
      { name: "Mes 6", weight: 74.1, goal: 70.0 },
    ],
  },
  "1y": {
    timeframeLabel: "1 Año",
    lastWeight: 74.6,
    lastWeightDelta: "+0.5 hoy",
    avgWeight: 74.1,
    avgWeightDelta: "-5.8 año",
    startWeight: 84.5,
    goalWeight: 70.0,
    goalDonePct: 90,
    chartPoints: [
      { name: "T1", weight: 83.5, goal: 70.0 },
      { name: "T2", weight: 79.8, goal: 70.0 },
      { name: "T3", weight: 76.4, goal: 70.0 },
      { name: "T4", weight: 74.1, goal: 70.0 },
    ],
  },
};

interface JournalInsightsProps {
  className?: string;
  weightLogs?: WeightLogItem[];
  currentProfileWeight?: number;
  goalWeight?: number;
  units?: "metrico" | "imperial";
}

export function JournalInsightsDashboard({
  className,
  weightLogs = [],
  currentProfileWeight,
  goalWeight = 70.0,
  units = "metrico",
}: JournalInsightsProps) {
  const [timeframe, setTimeframe] = useState<TimeframeOption>("30d");
  const baseData = PROGRESS_DATA_MAP[timeframe];

  // Dynamic values derived from actual user logs
  const hasRealLogs = Array.isArray(weightLogs) && weightLogs.length > 0;
  const latestLog = hasRealLogs ? weightLogs[0] : null;

  const currentWeightVal = latestLog
    ? latestLog.weight
    : currentProfileWeight || baseData.lastWeight;

  const prevLog = hasRealLogs && weightLogs.length > 1 ? weightLogs[1] : null;
  const lastDeltaVal = prevLog ? currentWeightVal - prevLog.weight : 0.5;
  const lastWeightDeltaText = prevLog
    ? `${lastDeltaVal >= 0 ? `+${lastDeltaVal.toFixed(1)}` : lastDeltaVal.toFixed(1)} ${units === "metrico" ? "kg" : "lbs"}`
    : baseData.lastWeightDelta;

  const computedAvgWeight = hasRealLogs
    ? Math.round(
        (weightLogs.reduce((acc, l) => acc + l.weight, 0) / weightLogs.length) * 10,
      ) / 10
    : baseData.avgWeight;

  // Dynamic chart points
  const dynamicChartPoints = baseData.chartPoints.map((pt, idx) => {
    if (idx === baseData.chartPoints.length - 1) {
      return {
        ...pt,
        weight: currentWeightVal,
        goal: goalWeight,
      };
    }
    return {
      ...pt,
      goal: goalWeight,
    };
  });

  return (
    <div className={cn("space-y-4 w-full select-none text-left animate-in fade-in duration-200", className)}>
      {/* 1. TOP ROW: 2 COMPACT METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 w-full items-stretch">
        {/* Card 1: Último Registro */}
        <div className="rounded-3xl border border-border bg-card p-5 shadow-xs hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
              Último Registro
            </span>
            <div className="w-7 h-7 rounded-xl bg-secondary/80 flex items-center justify-center text-foreground">
              <Scale className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-black text-foreground tabular-nums">
                {currentWeightVal}
              </span>
              <span className="text-xs font-bold text-muted-foreground uppercase">
                {units === "metrico" ? "kg" : "lbs"}
              </span>
            </div>

            <Badge
              variant="outline"
              className="bg-secondary/60 text-foreground border-border/80 text-[11px] font-bold py-0.5 px-2.5 rounded-full tabular-nums"
            >
              {lastWeightDeltaText}
            </Badge>
          </div>
        </div>

        {/* Card 2: Peso Promedio */}
        <div className="rounded-3xl border border-border bg-card p-5 shadow-xs hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
              Peso Promedio
            </span>
            <div className="w-7 h-7 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-black text-foreground tabular-nums">
                {computedAvgWeight}
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                {units === "metrico" ? "kg" : "lbs"}
              </span>
            </div>

            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[11px] font-bold py-0.5 px-2.5 rounded-full tabular-nums flex items-center gap-1"
            >
              <TrendingUp className="w-3 h-3" />
              {baseData.avgWeightDelta}
            </Badge>
          </div>
        </div>
      </div>

      {/* 2. TIMEFRAME PILL SELECTOR */}
      <div className="flex items-center justify-start pt-0.5">
        <div className="bg-secondary/60 dark:bg-secondary/30 p-1 rounded-full border border-border/80 inline-flex items-center gap-1 shadow-2xs">
          {[
            { id: "30d", label: "30 Días" },
            { id: "90d", label: "90 Días" },
            { id: "6m", label: "6 Meses" },
            { id: "1y", label: "1 Año" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTimeframe(t.id as TimeframeOption)}
              className={cn(
                "px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer select-none",
                timeframe === t.id
                  ? "bg-foreground text-background shadow-xs font-black"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. HERO CARD: PROGRESO HACIA LA META */}
      <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-xs hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-md transition-all duration-200 space-y-4">
        {/* Header with Title & Badges */}
        <div className="flex items-center justify-between gap-2 pb-1 border-b border-border/40">
          <div>
            <h3 className="text-base sm:text-lg font-black text-foreground tracking-tight">
              Progreso hacia la Meta
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Objetivo: {goalWeight} {units === "metrico" ? "kg" : "lbs"}
            </p>
          </div>

          <Badge
            variant="outline"
            className="bg-secondary text-foreground border-border text-xs font-black py-0.5 px-2.5 rounded-full"
          >
            {baseData.goalDonePct}%
          </Badge>
        </div>

        {/* Goal Progress Line Chart */}
        <div className="h-60 sm:h-64 w-full relative pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={dynamicChartPoints}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" strokeOpacity={0.4} />
              <XAxis
                dataKey="name"
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 11, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 11, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                domain={[68, 82]}
                unit={units === "metrico" ? "kg" : "lb"}
              />
              <Tooltip
                formatter={(value: number) => [
                  `${value} ${units === "metrico" ? "kg" : "lbs"}`,
                  "Peso",
                ]}
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  borderColor: "var(--color-border)",
                  borderRadius: "1rem",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              />
              {/* Meta Goal Reference Line */}
              <ReferenceLine
                y={goalWeight}
                stroke="#10B981"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: `Meta ${goalWeight}`,
                  fill: "#10B981",
                  fontSize: 10,
                  fontWeight: 700,
                  position: "insideTopRight",
                }}
              />
              <Area
                type="monotone"
                dataKey="weight"
                stroke="#10B981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#progressGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
