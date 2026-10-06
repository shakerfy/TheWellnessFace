import React, { useState, useMemo, useEffect, useRef } from "react";
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
  Sparkles,
} from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useNutritionSettings, getRecommendedRanges } from "@/lib/nutrition-settings";

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
  selectedDate?: string;
  completedDays?: string[];
  dayNutritionMap?: Record<string, { calories: number; protein: number }>;
  userGoal?: "musculo" | "en_forma" | "perder_peso" | "saludable";
  userWeight?: number;
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
  totalCalories = 0,
  proteinGrams = 0,
  carbsGrams = 0,
  fatGrams = 0,
  fiberGrams = 0,
  activityPoints = 168,
  activityMinutes = 45,
  weeklyAveragePoints = 164,
  streakDays = 5,
  selectedDate,
  completedDays = [],
  dayNutritionMap,
  userGoal = "en_forma",
  userWeight = 72,
  onSelectDate,
}: DailyNutritionHeroCardProps) {
  const { settings, isWellnessMode, effectiveTargets, updateSettings } =
    useNutritionSettings();
  const [activeTab, setActiveTab] = useState<"nutrition" | "activity">("activity");
  // 0 = Essential (Ladder exact hero: Cal + Prot + Giant Concentric Rings), 1 = Detailed Macros
  const [nutritionView, setNutritionView] = useState<0 | 1>(0);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isNutritionInfoOpen, setIsNutritionInfoOpen] = useState(false);
  // "consumed" = Show consumed & %, "remaining" = Show remaining & target range
  const [metricMode, setMetricMode] = useState<"consumed" | "remaining">("consumed");

  // Touch & Mouse Drag Swipe Detection (Gesture-First with axis discrimination & click suppression)
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const mouseStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const isTouchDeviceRef = useRef<boolean>(false);
  const lastSwipeTimeRef = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    isTouchDeviceRef.current = true;
    if (e.touches.length > 0) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || e.changedTouches.length === 0) {
      touchStartRef.current = null;
      return;
    }
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchEndX - touchStartRef.current.x;
    const diffY = touchEndY - touchStartRef.current.y;
    touchStartRef.current = null;

    // Must be predominantly horizontal (|diffX| > 40px and |diffX| > 1.2 * |diffY|)
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY) * 1.2) {
      lastSwipeTimeRef.current = Date.now();
      if (diffX < 0 && nutritionView === 0) {
        // Swipe left -> next view (Todos los macros)
        setNutritionView(1);
        try {
          if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate(10);
          }
        } catch (_) {}
      } else if (diffX > 0 && nutritionView === 1) {
        // Swipe right -> previous view (Esencial)
        setNutritionView(0);
        try {
          if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate(10);
          }
        } catch (_) {}
      }
    }
  };

  const handleTouchCancel = () => {
    touchStartRef.current = null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Ignore synthetic mouse events on touch devices, and only respond to primary left click
    if (isTouchDeviceRef.current || e.button !== 0) return;
    mouseStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
    };
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isTouchDeviceRef.current || !mouseStartRef.current) return;
    const diffX = e.clientX - mouseStartRef.current.x;
    const diffY = e.clientY - mouseStartRef.current.y;
    mouseStartRef.current = null;

    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY) * 1.2) {
      lastSwipeTimeRef.current = Date.now();
      if (diffX < 0 && nutritionView === 0) {
        setNutritionView(1);
      } else if (diffX > 0 && nutritionView === 1) {
        setNutritionView(0);
      }
    }
  };

  const toggleMetricMode = () => {
    // Suppress metric mode toggle if the click was part of a swipe or drag gesture
    if (Date.now() - lastSwipeTimeRef.current < 250) {
      return;
    }
    try {
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(12);
      }
    } catch (_) {}
    setMetricMode((prev) => (prev === "consumed" ? "remaining" : "consumed"));
  };

  // Week offset: 0 = current week, -1 = previous week, etc.
  const [weekOffset, setWeekOffset] = useState<number>(0);
  const [weekSlideDirection, setWeekSlideDirection] = useState<"left" | "right" | "none">("none");

  const handlePrevWeek = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(10);
      } catch (_) {}
    }
    setWeekSlideDirection("left");
    setWeekOffset((v) => v - 1);
  };

  const handleNextWeek = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(10);
      } catch (_) {}
    }
    setWeekSlideDirection("right");
    setWeekOffset((v) => v + 1);
  };

  const [internalSelectedIsoDate, setInternalSelectedIsoDate] = useState<string>(() => {
    return formatLocalIso(new Date());
  });

  const selectedIsoDate = selectedDate !== undefined ? selectedDate : internalSelectedIsoDate;

  // Sync weekOffset if selectedDate changes externally
  useEffect(() => {
    if (selectedDate) {
      try {
        const [y, m, d] = selectedDate.split("-").map(Number);
        const now = new Date();
        const currentDayOfWeek = now.getDay();
        const distToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
        const thisMonday = new Date(now);
        thisMonday.setDate(now.getDate() + distToMonday);
        thisMonday.setHours(0, 0, 0, 0);

        const target = new Date(y, m - 1, d);
        target.setHours(0, 0, 0, 0);

        const diffDays = Math.round((target.getTime() - thisMonday.getTime()) / (1000 * 60 * 60 * 24));
        const calculatedOffset = Math.floor(diffDays / 7);
        setWeekOffset((prev) => {
          if (prev !== calculatedOffset) {
            setWeekSlideDirection(calculatedOffset > prev ? "right" : "left");
          }
          return calculatedOffset;
        });
      } catch (_) {}
    }
  }, [selectedDate]);

  // Balance Neutro Universal o Metas Personalizadas
  const ranges = useMemo(() => {
    if (settings.customTargetsEnabled) {
      const cal = effectiveTargets.calories;
      const prot = effectiveTargets.protein;
      const carbs = effectiveTargets.carbs;
      const fat = effectiveTargets.fat;
      const fib = effectiveTargets.fiber || 30;
      return {
        calories: [Math.round(cal * 0.95), Math.round(cal * 1.05)] as [number, number],
        protein: [Math.round(prot * 0.95), Math.round(prot * 1.05)] as [number, number],
        carbs: [Math.round(carbs * 0.95), Math.round(carbs * 1.05)] as [number, number],
        fat: [Math.round(fat * 0.95), Math.round(fat * 1.05)] as [number, number],
        fiber: [Math.round(fib * 0.9), Math.round(fib * 1.15)] as [number, number],
      };
    }
    return getRecommendedRanges(userWeight || 72, settings.athleteGoal);
  }, [userWeight, settings.customTargetsEnabled, settings.athleteGoal, effectiveTargets]);

  // Target midpoint for ring scaling
  const targetCalories = settings.customTargetsEnabled
    ? effectiveTargets.calories
    : Math.round((ranges.calories[0] + ranges.calories[1]) / 2);
  const targetProtein = settings.customTargetsEnabled
    ? effectiveTargets.protein
    : Math.round((ranges.protein[0] + ranges.protein[1]) / 2);
  const targetCarbs = settings.customTargetsEnabled
    ? effectiveTargets.carbs
    : Math.round((ranges.carbs[0] + ranges.carbs[1]) / 2);
  const targetFat = settings.customTargetsEnabled
    ? effectiveTargets.fat
    : Math.round((ranges.fat[0] + ranges.fat[1]) / 2);

  // Remaining calculations
  const calRemainingMin = Math.max(0, ranges.calories[0] - totalCalories);
  const calRemainingMax = Math.max(0, ranges.calories[1] - totalCalories);

  const protRemainingMin = Math.max(0, ranges.protein[0] - proteinGrams);
  const protRemainingMax = Math.max(0, ranges.protein[1] - proteinGrams);

  const carbsRemainingMin = Math.max(0, ranges.carbs[0] - carbsGrams);
  const carbsRemainingMax = Math.max(0, ranges.carbs[1] - carbsGrams);

  const fatRemainingMin = Math.max(0, ranges.fat[0] - fatGrams);
  const fatRemainingMax = Math.max(0, ranges.fat[1] - fatGrams);

  const fiberRemainingMin = Math.max(0, ranges.fiber[0] - fiberGrams);
  const fiberRemainingMax = Math.max(0, ranges.fiber[1] - fiberGrams);

  // Biological Range States (Precision & Anti-Orthorexia)
  const isCalInTarget = totalCalories >= ranges.calories[0] && totalCalories <= ranges.calories[1];
  const isCalOverTarget = totalCalories > ranges.calories[1];

  const isProtInTarget = proteinGrams >= ranges.protein[0] && proteinGrams <= ranges.protein[1];
  const isProtOverTarget = proteinGrams > ranges.protein[1];

  const isCarbsInTarget = carbsGrams >= ranges.carbs[0] && carbsGrams <= ranges.carbs[1];
  const isCarbsOverTarget = carbsGrams > ranges.carbs[1];

  const isFatInTarget = fatGrams >= ranges.fat[0] && fatGrams <= ranges.fat[1];
  const isFatOverTarget = fatGrams > ranges.fat[1];

  const isFiberInTarget = fiberGrams >= ranges.fiber[0] && fiberGrams <= ranges.fiber[1];
  const isFiberOverTarget = fiberGrams > ranges.fiber[1];

  const isBothInTarget = totalCalories >= ranges.calories[0] && proteinGrams >= ranges.protein[0];

  // 100% threshold is reached when user fulfills the minimum target range (ranges.*[0])
  const calPct = Math.min(100, Math.round((totalCalories / (ranges.calories[0] || 1800)) * 100));
  const protPct = Math.min(100, Math.round((proteinGrams / (ranges.protein[0] || 115)) * 100));
  const carbsPct = Math.min(100, Math.round((carbsGrams / (ranges.carbs[0] || 180)) * 100));
  const fatPct = Math.min(100, Math.round((fatGrams / (ranges.fat[0] || 55)) * 100));
  const fiberPct = Math.min(100, Math.round((fiberGrams / (ranges.fiber[0] || 28)) * 100));

  const completedDaysSet = useMemo(() => new Set(completedDays), [completedDays]);

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

      week.push({
        dayName: dayLabels[i],
        dateNum,
        isoDate,
        isToday: isoDate === todayIso,
        isCompleted: completedDaysSet.has(isoDate),
      });
    }
    return week;
  }, [weekOffset, completedDaysSet]);

  const handleDayClick = (day: (typeof currentWeekDays)[0]) => {
    setInternalSelectedIsoDate(day.isoDate);
    if (onSelectDate) {
      onSelectDate(day.isoDate);
    }
  };

  // Concentric Rings Dimensions & 100% Target Threshold Marker Line + Shaded Target Zone
  // Outer Ring: Calories (scaled to ranges.calories[1], with single 100% marker at ranges.calories[0])
  const outerR = 64;
  const outerCircumference = 2 * Math.PI * outerR;
  const calRingRatio = Math.min(1, totalCalories / (ranges.calories[1] || 2000));
  const outerOffset = outerCircumference - calRingRatio * outerCircumference;

  // Single marker line at 100% baseline threshold (ranges.calories[0])
  const calTargetRatio = ranges.calories[0] / (ranges.calories[1] || 2000);
  const calAngle = calTargetRatio * 2 * Math.PI;
  const calCos = Math.cos(calAngle);
  const calSin = Math.sin(calAngle);
  const calX1 = 80 + 57 * calCos;
  const calY1 = 80 + 57 * calSin;
  const calX2 = 80 + 71 * calCos;
  const calY2 = 80 + 71 * calSin;

  // Shaded target zone arc on outer track
  const calZoneLength = Math.max(0, (1 - calTargetRatio) * outerCircumference);
  const calZoneOffset = -(calTargetRatio * outerCircumference);

  // Inner Ring: Protein (scaled to ranges.protein[1], with single 100% marker at ranges.protein[0])
  const innerR = 44;
  const innerCircumference = 2 * Math.PI * innerR;
  const protRingRatio = Math.min(1, proteinGrams / (ranges.protein[1] || 140));
  const innerOffset = innerCircumference - protRingRatio * innerCircumference;

  // Single marker line at 100% baseline threshold (ranges.protein[0])
  const protTargetRatio = ranges.protein[0] / (ranges.protein[1] || 140);
  const protAngle = protTargetRatio * 2 * Math.PI;
  const protCos = Math.cos(protAngle);
  const protSin = Math.sin(protAngle);
  const protX1 = 80 + 37 * protCos;
  const protY1 = 80 + 37 * protSin;
  const protX2 = 80 + 51 * protCos;
  const protY2 = 80 + 51 * protSin;

  // Shaded target zone arc on inner track
  const protZoneLength = Math.max(0, (1 - protTargetRatio) * innerCircumference);
  const protZoneOffset = -(protTargetRatio * innerCircumference);

  return (
    <div
      className={cn(
        "w-full rounded-3xl p-5 sm:p-6 flex flex-col justify-between select-none relative overflow-hidden border border-border bg-card text-card-foreground shadow-xs transition-all duration-300 hover:shadow-md hover:-translate-y-0.5",
        className,
      )}
    >
      {/* 1. TOP HEADER: Section Title + Info Popover & Week Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2 w-full mb-4">
        <div className="inline-flex items-center gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
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
                <Info className="w-3.5 h-3.5" />
              </button>
            </PopoverTrigger>

            <PopoverContent
              align="start"
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

              <div className="space-y-2 text-xs text-muted-foreground leading-relaxed pt-2.5">
                <p>
                  Tu racha premia la <strong>constancia acumulada</strong>, no la perfección diaria. Sumas días manteniendo tu <strong>promedio móvil de 7 días en nivel saludable (≥ 150 Puntos MET)</strong>, según las pautas de la OMS.
                </p>
                <p>
                  Gracias al promedio ponderado, tus <strong>días de descanso muscular</strong> no reinician tu contador a cero si mantienes una rutina regular. Entrena con foco, descansa sin culpa.
                </p>
              </div>

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

        {/* Week Switcher Navigation */}
        <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <button
            type="button"
            onClick={handlePrevWeek}
            className="w-6 h-6 rounded-full flex items-center justify-center transition-colors cursor-pointer active:scale-90 hover:bg-secondary text-muted-foreground hover:text-foreground"
            aria-label="Semana anterior"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span
            key={weekOffset}
            className={cn(
              "font-bold text-[11px] uppercase tracking-wider px-1 inline-block min-w-[95px] text-center select-none text-foreground",
              weekSlideDirection === "left" && "animate-week-label-left",
              weekSlideDirection === "right" && "animate-week-label-right",
            )}
          >
            {weekOffset === 0 ? "Esta Semana" : weekOffset === -1 ? "Semana Pasada" : `Semana ${weekOffset}`}
          </span>
          <button
            type="button"
            onClick={handleNextWeek}
            className="w-6 h-6 rounded-full flex items-center justify-center transition-colors cursor-pointer active:scale-90 hover:bg-secondary text-muted-foreground hover:text-foreground"
            aria-label="Semana siguiente"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. TOP CALENDAR: WELLNESS CHECKMARKS */}
      <div className="w-full mb-5 overflow-x-clip py-1.5">
        <div
          key={weekOffset}
          className={cn(
            "grid grid-cols-7 gap-1 sm:gap-2 w-full text-center",
            weekSlideDirection === "left" && "animate-week-slide-left",
            weekSlideDirection === "right" && "animate-week-slide-right",
          )}
        >
          {currentWeekDays.map((day) => {
            const isSelected = selectedIsoDate === day.isoDate;

            return (
              <button
                key={day.isoDate}
                type="button"
                onClick={() => handleDayClick(day)}
                title={`${day.dayName} ${day.dateNum}${day.isCompleted ? " — Hábitos completados" : ""}`}
                className="flex flex-col items-center gap-2 py-0.5 cursor-pointer group select-none transition-transform active:scale-95"
              >
                {/* Day name (Lun, Mar, Mié...) */}
                <span
                  className={cn(
                    "text-xs transition-colors",
                    isSelected
                      ? "text-foreground font-black"
                      : "text-muted-foreground/70 font-bold group-hover:text-foreground",
                  )}
                >
                  {day.dayName}
                </span>

                {/* Wellness Mode: Concentric Checkmarks vs Date Number */}
                {day.isCompleted ? (
                  <div
                    className={cn(
                      "relative w-8 h-8 rounded-full flex items-center justify-center transition-all",
                      isSelected && "ring-2 ring-foreground/40 ring-offset-2 ring-offset-card",
                    )}
                  >
                    <div
                      className={cn(
                        "absolute inset-0 rounded-full border-2 transition-colors",
                        isSelected ? "border-foreground/40" : "border-emerald-500/35",
                      )}
                    />
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center shadow-xs transition-colors",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
                      )}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>
                ) : (
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                      isSelected
                        ? "bg-primary text-primary-foreground font-black shadow-xs ring-2 ring-foreground/20 ring-offset-2 ring-offset-card"
                        : day.isToday
                          ? "border-2 border-foreground/70 text-foreground font-black"
                          : "text-muted-foreground group-hover:text-foreground group-hover:bg-secondary/60",
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

      {/* 3. ACTIVIDAD HERO: 2-COLUMN BALANCED WELLNESS METRICS */}
      <div className="space-y-4 animate-in fade-in duration-200">
        {/* Status Bar */}
        <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
          <span className="text-[11px] font-semibold text-muted-foreground">
            Balance energético y movimiento diario
          </span>

          {/* Target Status Pill */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary/70 border border-border/60 text-[11px] font-bold text-muted-foreground">
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                weeklyAveragePoints >= 150 ? "bg-emerald-500" : "bg-amber-500",
              )}
            />
            <span>{weeklyAveragePoints >= 150 ? "Nivel Saludable" : "En Progreso"}</span>
          </div>
        </div>

          {/* 2-COLUMN SPLIT (EXACT SYMMETRY WITH NUTRITION) */}
          <div className="grid grid-cols-12 items-center gap-2 pt-1 animate-in fade-in duration-200">
            {/* LEFT COLUMN: 3 STATS WITH VERTICAL ACCENT BARS */}
            <div className="col-span-7 sm:col-span-7 space-y-3.5">
              {/* 1. PUNTOS HOY */}
              <div className="flex items-start gap-3">
                <div className="w-1 h-10 bg-amber-500 rounded-full shrink-0 shadow-2xs mt-0.5" />
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-none tabular-nums font-sans">
                    {activityPoints}
                    <span className="text-xs font-bold text-muted-foreground ml-1.5 font-mono">pts</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mt-0.5">
                    Puntos Hoy
                  </span>
                </div>
              </div>

              {/* 2. TIEMPO ACTIVO */}
              <div className="flex items-start gap-3">
                <div className="w-1 h-10 bg-foreground rounded-full shrink-0 shadow-2xs mt-0.5" />
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-none tabular-nums font-sans">
                    {activityMinutes}
                    <span className="text-xs font-bold text-muted-foreground ml-1.5 font-mono">min</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mt-0.5">
                    Tiempo de Movimiento
                  </span>
                </div>
              </div>

              {/* 3. PROMEDIO 7 DÍAS */}
              <div className="flex items-start gap-3">
                <div className="w-1 h-10 bg-emerald-600 dark:bg-emerald-500 rounded-full shrink-0 shadow-2xs mt-0.5" />
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-none tabular-nums font-sans">
                    {weeklyAveragePoints}
                    <span className="text-xs font-bold text-muted-foreground ml-1.5 font-mono">pts</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mt-0.5">
                    Promedio 7D (Meta ≥ 150)
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: PROMINENT STREAK HERO (HORIZONTAL ICON + BOLD DAYS) */}
            <div className="col-span-5 sm:col-span-5 flex items-center justify-center relative min-h-[140px] sm:min-h-[150px]">
              <div className="flex flex-col items-center justify-center text-center select-none">
                {/* Horizontal Lockup: Icon to the Left of the Number */}
                <div className="flex items-center gap-2.5 sm:gap-3">
                  {/* Protagonist Flame Icon */}
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-md scale-110 pointer-events-none" />
                    <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/25 flex items-center justify-center shadow-xs">
                      <Flame className="w-6 h-6 sm:w-7 sm:h-7 text-amber-500 fill-amber-500" />
                    </div>
                  </div>

                  {/* Massive Bold Streak Days */}
                  <div className="text-4xl sm:text-5xl font-black tracking-tight text-foreground leading-none font-sans tabular-nums">
                    {streakDays}
                  </div>
                </div>

                {/* Subtitle Label */}
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground mt-2">
                  Días de Racha
                </span>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}

// Keep BioStateCard alias for backward compatibility
export const BioStateCard = DailyNutritionHeroCard;
