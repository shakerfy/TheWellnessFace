import React, { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import {
  Flame,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Info,
  Check,
  RotateCw,
} from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

export interface DailyNutritionHeroCardProps {
  className?: string;
  totalCalories?: number;
  proteinGrams?: number;
  carbsGrams?: number;
  fatGrams?: number;
  fiberGrams?: number;
  burnedCalories?: number;
  activityPoints?: number;
  activityMinutes?: number;
  weeklyAveragePoints?: number;
  streakDays?: number;
  onSelectDate?: (dateStr: string) => void;
}

function formatLocalIso(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function DailyNutritionHeroCard({
  className,
  totalCalories = 1700,
  proteinGrams = 120,
  carbsGrams = 185,
  fatGrams = 52,
  activityPoints = 168,
  activityMinutes = 45,
  weeklyAveragePoints = 164,
  streakDays = 5,
  onSelectDate,
}: DailyNutritionHeroCardProps) {
  const [activeTab, setActiveTab] = useState<"nutrition" | "activity">("nutrition");
  // 0 = Essential (Ladder exact hero: Cal + Prot + Giant Concentric Rings), 1 = Detailed Macros
  const [nutritionView, setNutritionView] = useState<0 | 1>(0);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  // Week offset: 0 = current week, -1 = previous week, etc.
  const [weekOffset, setWeekOffset] = useState<number>(0);

  const [selectedIsoDate, setSelectedIsoDate] = useState<string>(() => {
    return formatLocalIso(new Date());
  });

  // Targets
  const targetCalories = 1890;
  const targetProtein = 120;
  const targetCarbs = 210;
  const targetFat = 65;

  const calPct = Math.min(100, Math.round((totalCalories / targetCalories) * 100));
  const protPct = Math.min(100, Math.round((proteinGrams / targetProtein) * 100));
  const carbsPct = Math.min(100, Math.round((carbsGrams / targetCarbs) * 100));
  const fatPct = Math.min(100, Math.round((fatGrams / targetFat) * 100));

  // Generate 7 days for the selected week offset (Monday to Sunday)
  const currentWeekDays = useMemo(() => {
    const now = new Date();
    const currentDayOfWeek = now.getDay();
    const distToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;

    const baseMonday = new Date(now);
    baseMonday.setDate(now.getDate() + distToMonday + weekOffset * 7);

    const dayLabels = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    const todayIso = formatLocalIso(now);

    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(baseMonday);
      d.setDate(baseMonday.getDate() + i);
      const isoDate = formatLocalIso(d);
      const dateNum = d.getDate();
      const isPastOrToday = d <= now;

      week.push({
        dayName: dayLabels[i],
        dateNum,
        isoDate,
        isToday: isoDate === todayIso,
        isCompleted: isPastOrToday && isoDate !== todayIso,
      });
    }
    return week;
  }, [weekOffset]);

  const handleDayClick = (day: (typeof currentWeekDays)[0]) => {
    setSelectedIsoDate(day.isoDate);
    if (onSelectDate) {
      onSelectDate(day.isoDate);
    }
  };

  // Concentric Rings Dimensions (Ladder SVG Geometry)
  // Outer Ring: Calories (Warm Amber / Terracotta #d97706)
  const outerR = 64;
  const outerCircumference = 2 * Math.PI * outerR;
  const outerOffset = outerCircumference - (calPct / 100) * outerCircumference;

  // Inner Ring: Protein (Deep Forest Botanical Emerald #059669)
  const innerR = 44;
  const innerCircumference = 2 * Math.PI * innerR;
  const innerOffset = innerCircumference - (protPct / 100) * innerCircumference;

  return (
    <div
      className={cn(
        "w-full rounded-3xl border border-border bg-card text-card-foreground p-5 sm:p-6 shadow-xs flex flex-col justify-between select-none relative overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5",
        className,
      )}
    >
      {/* 1. TOP HEADER: Navigation Tabs & Week Controls */}
      <div className="flex items-center justify-between w-full mb-5">
        {/* Minimalist Switcher */}
        <div className="bg-secondary/60 dark:bg-secondary/30 p-1 rounded-full border border-border/70 inline-flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("nutrition")}
            className={cn(
              "px-3.5 py-1 rounded-full text-xs font-black transition-all cursor-pointer select-none",
              activeTab === "nutrition"
                ? "bg-background text-foreground shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Nutrición
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("activity")}
            className={cn(
              "px-3.5 py-1 rounded-full text-xs font-black transition-all cursor-pointer select-none",
              activeTab === "activity"
                ? "bg-background text-foreground shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Actividad
          </button>
        </div>

        {/* Week Switcher Navigation */}
        <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <button
            type="button"
            onClick={() => setWeekOffset((v) => v - 1)}
            className="w-6 h-6 rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Semana anterior"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="font-bold text-[11px] uppercase tracking-wider text-foreground px-1">
            {weekOffset === 0 ? "Esta Semana" : weekOffset === -1 ? "Semana Pasada" : `Semana ${weekOffset}`}
          </span>
          <button
            type="button"
            onClick={() => setWeekOffset((v) => v + 1)}
            className="w-6 h-6 rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Semana siguiente"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. TOP CALENDAR: BOTANICAL FOREST CONCENTRIC CHECKMARKS & DATE ROW */}
      <div className="w-full mb-6">
        <div className="grid grid-cols-7 gap-1 sm:gap-2 w-full text-center">
          {currentWeekDays.map((day) => {
            const isSelected = selectedIsoDate === day.isoDate;
            return (
              <button
                key={day.isoDate}
                type="button"
                onClick={() => handleDayClick(day)}
                className="flex flex-col items-center gap-2 cursor-pointer group select-none transition-transform active:scale-95"
              >
                {/* Day name (Lun, Mar, Mié...) */}
                <span
                  className={cn(
                    "text-[11px] font-bold tracking-tight transition-colors",
                    isSelected
                      ? "text-foreground font-black scale-105"
                      : "text-muted-foreground/70 group-hover:text-foreground",
                  )}
                >
                  {day.dayName}
                </span>

                {/* Ladder Circle: Completed Concentric Deep Forest Ring vs Date Number */}
                {day.isCompleted || day.isToday ? (
                  <div
                    className={cn(
                      "relative w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all",
                      isSelected && "ring-2 ring-emerald-700/60 dark:ring-emerald-400 ring-offset-2 ring-offset-background",
                    )}
                  >
                    {/* Concentric Forest Green Outer Track */}
                    <div className="absolute inset-0 rounded-full border-2 border-emerald-600/25 dark:border-emerald-400/30" />
                    {/* Deep Forest Inner Disc with Check */}
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                      <Check className="w-3 h-3 stroke-[3.5]" />
                    </div>
                  </div>
                ) : (
                  <div
                    className={cn(
                      "w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                      isSelected
                        ? "bg-foreground text-background font-black shadow-xs"
                        : "text-muted-foreground group-hover:text-foreground",
                    )}
                  >
                    {day.dateNum}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. NUTRITION HERO: LADDER FITNESS SPLIT LAYOUT (AMBER CALORIES + FOREST EMERALD PROTEIN) */}
      {activeTab === "nutrition" ? (
        <div className="space-y-4">
          {/* View Switcher Sub-header */}
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <div className="inline-flex items-center gap-2">
              <button
                type="button"
                onClick={() => setNutritionView(0)}
                className={cn(
                  "text-xs font-black transition-colors cursor-pointer select-none",
                  nutritionView === 0 ? "text-foreground font-bold" : "text-muted-foreground hover:text-foreground",
                )}
              >
                Esencial
              </button>
              <span className="text-muted-foreground/40 text-xs">•</span>
              <button
                type="button"
                onClick={() => setNutritionView(1)}
                className={cn(
                  "text-xs font-black transition-colors cursor-pointer select-none",
                  nutritionView === 1 ? "text-foreground font-bold" : "text-muted-foreground hover:text-foreground",
                )}
              >
                Todos los Macros
              </button>
            </div>

            {/* Micro Slider Dots */}
            <div className="inline-flex items-center gap-1">
              <button
                type="button"
                onClick={() => setNutritionView(0)}
                className={cn(
                  "h-1 rounded-full transition-all",
                  nutritionView === 0 ? "w-3 bg-foreground" : "w-1 bg-muted-foreground/30",
                )}
                aria-label="Vista Esencial"
              />
              <button
                type="button"
                onClick={() => setNutritionView(1)}
                className={cn(
                  "h-1 rounded-full transition-all",
                  nutritionView === 1 ? "w-3 bg-foreground" : "w-1 bg-muted-foreground/30",
                )}
                aria-label="Vista Detallada"
              />
            </div>
          </div>

          {nutritionView === 0 ? (
            /* SLIDE 1: EXACT LADDER HERO (WARM AMBER CALORIES + BOTANICAL EMERALD PROTEIN) */
            <div className="grid grid-cols-12 items-center gap-2 pt-1 animate-in fade-in duration-200">
              {/* LEFT COLUMN: STATS WITH VERTICAL ACCENT BARS */}
              <div className="col-span-7 sm:col-span-7 space-y-5">
                {/* 1. CALORIES CONSUMED (Monochrome Black / Foreground) */}
                <div className="flex items-start gap-3">
                  {/* Vertical Accent Bar (Black / Foreground) */}
                  <div className="w-1 h-12 bg-foreground rounded-full shrink-0 shadow-2xs" />

                  <div>
                    {/* Target percentage badge */}
                    <div className="inline-flex items-center gap-1 text-[11px] font-extrabold text-foreground mb-0.5">
                      <RotateCw className="w-2.5 h-2.5 stroke-[3]" />
                      <span>{calPct}%</span>
                    </div>

                    {/* Massive Bold Number */}
                    <div className="text-3xl sm:text-4xl font-black text-foreground tracking-tight leading-none tabular-nums font-sans">
                      {totalCalories}
                    </div>

                    {/* Label */}
                    <span className="text-xs font-semibold text-muted-foreground block mt-1">
                      Calorías Consumidas
                    </span>
                  </div>
                </div>

                {/* 2. PROTEIN CONSUMED (Deep Forest Botanical Emerald #059669) */}
                <div className="flex items-start gap-3">
                  {/* Vertical Accent Bar (Deep Forest #059669) */}
                  <div className="w-1 h-12 bg-emerald-600 dark:bg-emerald-500 rounded-full shrink-0 shadow-2xs" />

                  <div>
                    {/* Target percentage badge */}
                    <div className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400 mb-0.5">
                      <RotateCw className="w-2.5 h-2.5 stroke-[3]" />
                      <span>{protPct}%</span>
                    </div>

                    {/* Massive Bold Number */}
                    <div className="text-3xl sm:text-4xl font-black text-foreground tracking-tight leading-none tabular-nums font-sans">
                      {proteinGrams}g
                    </div>

                    {/* Label */}
                    <span className="text-xs font-semibold text-muted-foreground block mt-1">
                      Proteína Consumida
                    </span>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: GIANT LADDER CONCENTRIC RINGS (OUTER MONOCHROME CALORIES + INNER EMERALD PROTEIN) */}
              <div className="col-span-5 sm:col-span-5 flex items-center justify-end relative">
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
                  <svg
                    className="w-full h-full -rotate-90 transform pointer-events-none"
                    viewBox="0 0 160 160"
                  >
                    {/* Outer Ring Track (Calories Background) */}
                    <circle
                      cx="80"
                      cy="80"
                      r={outerR}
                      fill="none"
                      stroke="currentColor"
                      className="text-secondary dark:text-zinc-800"
                      strokeWidth="13"
                    />

                    {/* Outer Ring Active Progress (Black / Monochrome #18181b) */}
                    <circle
                      cx="80"
                      cy="80"
                      r={outerR}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="13"
                      strokeDasharray={outerCircumference}
                      strokeDashoffset={outerOffset}
                      strokeLinecap="butt"
                      className="text-zinc-900 dark:text-zinc-100 transition-all duration-700 ease-out"
                    />

                    {/* Outer Ring Radial Head Ticks (Signature Detail) */}
                    <circle
                      cx="80"
                      cy="80"
                      r={outerR}
                      fill="none"
                      stroke="currentColor"
                      className="text-muted-foreground/30 opacity-40"
                      strokeWidth="14"
                      strokeDasharray="2 6"
                    />

                    {/* Inner Ring Track (Protein Background) */}
                    <circle
                      cx="80"
                      cy="80"
                      r={innerR}
                      fill="none"
                      stroke="currentColor"
                      className="text-secondary dark:text-zinc-800"
                      strokeWidth="13"
                    />

                    {/* Inner Ring Active Progress (DEEP FOREST BOTANICAL EMERALD #059669) */}
                    <circle
                      cx="80"
                      cy="80"
                      r={innerR}
                      fill="none"
                      stroke="#059669"
                      strokeWidth="13"
                      strokeDasharray={innerCircumference}
                      strokeDashoffset={innerOffset}
                      strokeLinecap="butt"
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ) : (
            /* SLIDE 2: ALL MACROS DETAILED BREAKDOWN */
            <div className="space-y-3.5 pt-1 animate-in fade-in duration-200">
              <div className="grid grid-cols-2 gap-3">
                {/* Calories Card (Black / Monochrome Progress) */}
                <div className="p-3.5 rounded-2xl bg-secondary/40 dark:bg-secondary/20 border border-border/70 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Calorías
                    </span>
                    <span className="text-xs font-black text-foreground">{calPct}%</span>
                  </div>
                  <div className="text-xl font-black text-foreground tabular-nums mb-2">
                    {totalCalories} <span className="text-xs font-normal text-muted-foreground">/ {targetCalories} kcal</span>
                  </div>
                  <div className="w-full h-1.5 bg-secondary dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-foreground rounded-full" style={{ width: `${calPct}%` }} />
                  </div>
                </div>

                {/* Protein Card (Deep Forest Emerald Progress) */}
                <div className="p-3.5 rounded-2xl bg-secondary/40 dark:bg-secondary/20 border border-border/70 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Proteína
                    </span>
                    <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">{protPct}%</span>
                  </div>
                  <div className="text-xl font-black text-foreground tabular-nums mb-2">
                    {proteinGrams}g <span className="text-xs font-normal text-muted-foreground">/ {targetProtein}g</span>
                  </div>
                  <div className="w-full h-1.5 bg-secondary dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full" style={{ width: `${protPct}%` }} />
                  </div>
                </div>

                {/* Carbs Card (Warm Golden Amber Progress) */}
                <div className="p-3.5 rounded-2xl bg-secondary/40 dark:bg-secondary/20 border border-border/70 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Carbohidratos
                    </span>
                    <span className="text-xs font-black text-amber-600 dark:text-amber-400">{carbsPct}%</span>
                  </div>
                  <div className="text-xl font-black text-foreground tabular-nums mb-2">
                    {carbsGrams}g <span className="text-xs font-normal text-muted-foreground">/ {targetCarbs}g</span>
                  </div>
                  <div className="w-full h-1.5 bg-secondary dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 dark:bg-amber-400 rounded-full" style={{ width: `${carbsPct}%` }} />
                  </div>
                </div>

                {/* Fat Card (Sky Blue Progress) */}
                <div className="p-3.5 rounded-2xl bg-secondary/40 dark:bg-secondary/20 border border-border/70 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Grasas
                    </span>
                    <span className="text-xs font-black text-sky-600 dark:text-sky-400">{fatPct}%</span>
                  </div>
                  <div className="text-xl font-black text-foreground tabular-nums mb-2">
                    {fatGrams}g <span className="text-xs font-normal text-muted-foreground">/ {targetFat}g</span>
                  </div>
                  <div className="w-full h-1.5 bg-secondary dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-500 dark:bg-sky-400 rounded-full" style={{ width: `${fatPct}%` }} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ACTIVIDAD TAB: LADDER STREAK HERO */
        <div className="text-center py-4 space-y-4 animate-in fade-in duration-200">
          <div className="space-y-1">
            <div className="text-5xl sm:text-6xl font-black tracking-tight text-foreground leading-none font-sans flex items-center justify-center gap-2">
              <span>{streakDays}</span>
              <span className="text-2xl font-bold text-muted-foreground">
                días
              </span>
            </div>

            <div className="flex items-center justify-center gap-1.5 pt-1">
              <Flame className="w-4 h-4 text-amber-600 dark:text-amber-500 fill-amber-600/20" />
              <span className="text-xs font-bold text-muted-foreground">
                Racha de Actividad Física
              </span>

              <Popover open={isInfoOpen} onOpenChange={setIsInfoOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    onMouseEnter={() => setIsInfoOpen(true)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsInfoOpen((v) => !v);
                    }}
                    className="w-4 h-4 rounded-full inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-all cursor-pointer select-none"
                    aria-label="Información sobre la racha de actividad"
                  >
                    <Info className="w-3 h-3" />
                  </button>
                </PopoverTrigger>

                <PopoverContent
                  align="center"
                  side="bottom"
                  sideOffset={6}
                  onMouseEnter={() => setIsInfoOpen(true)}
                  onMouseLeave={() => setIsInfoOpen(false)}
                  className="w-72 sm:w-80 p-4 rounded-2xl bg-card border border-border text-card-foreground shadow-xl z-50 text-left"
                >
                  <div className="flex items-center gap-1.5 pb-2 border-b border-border/60">
                    <Flame className="w-4 h-4 text-amber-600 fill-amber-600" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Racha de Actividad
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed pt-2.5">
                    Suma <strong>+1 día a tu racha</strong> por cada día consecutivo que iguale o supere tu{" "}
                    <strong>promedio ponderado de los últimos 7 días</strong>.
                  </p>

                  <div className="pt-3 mt-2 border-t border-border/60 flex justify-end">
                    <Link
                      to="/blog/$slug"
                      params={{ slug: "ciencia-de-la-racha-de-actividad-y-mets" }}
                      className="text-xs font-bold text-foreground hover:underline inline-flex items-center gap-1 group/link"
                    >
                      <span>Leer más</span>
                      <ArrowRight className="w-3 h-3 transition-transform group-hover/link:translate-x-0.5" />
                    </Link>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* 3 Columns Strip */}
          <div className="grid grid-cols-3 divide-x divide-border/60 w-full pt-4 border-t border-border/60">
            <div className="text-center px-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Puntos Hoy
              </span>
              <span className="text-sm font-black text-foreground font-sans block tracking-tight tabular-nums">
                {activityPoints} pts
              </span>
            </div>

            <div className="text-center px-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Minutos
              </span>
              <span className="text-sm font-black text-foreground font-sans block tracking-tight tabular-nums">
                {activityMinutes} min
              </span>
            </div>

            <div className="text-center px-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Promedio 7D
              </span>
              <span className="text-sm font-black text-foreground font-sans block tracking-tight tabular-nums">
                {weeklyAveragePoints} pts
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Keep BioStateCard alias for backward compatibility
export const BioStateCard = DailyNutritionHeroCard;
