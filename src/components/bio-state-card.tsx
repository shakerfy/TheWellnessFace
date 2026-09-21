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
  const { settings, isAthleteMode, isWellnessMode, effectiveTargets } = useNutritionSettings();
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
            onClick={() => setActiveTab("activity")}
            className={cn(
              "px-3.5 py-1 rounded-full text-xs font-black transition-all cursor-pointer select-none",
              activeTab === "activity" || !isAthleteMode
                ? "bg-background text-foreground shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Actividad
          </button>

          {isAthleteMode && (
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
          )}
        </div>

        {/* Week Switcher Navigation */}
        <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          {isAthleteMode && (
            <div className="hidden sm:flex items-center gap-2.5 mr-2 text-[10px] text-muted-foreground/80 font-semibold select-none">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                Calorías
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                Proteína
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={handlePrevWeek}
            className="w-6 h-6 rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer active:scale-90"
            aria-label="Semana anterior"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span
            key={weekOffset}
            className={cn(
              "font-bold text-[11px] uppercase tracking-wider text-foreground px-1 inline-block min-w-[95px] text-center select-none",
              weekSlideDirection === "left" && "animate-week-label-left",
              weekSlideDirection === "right" && "animate-week-label-right",
            )}
          >
            {weekOffset === 0 ? "Esta Semana" : weekOffset === -1 ? "Semana Pasada" : `Semana ${weekOffset}`}
          </span>
          <button
            type="button"
            onClick={handleNextWeek}
            className="w-6 h-6 rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer active:scale-90"
            aria-label="Semana siguiente"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. TOP CALENDAR: DUAL PROGRESS RINGS (ATHLETE MODE) / CHECKMARKS (WELLNESS MODE) */}
      <div className="w-full mb-6 overflow-hidden">
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

            // Day nutrition stats (Calories & Protein)
            const dayStats = dayNutritionMap?.[day.isoDate];
            let dayCals = dayStats?.calories ?? 0;
            let dayProt = dayStats?.protein ?? 0;

            if (isSelected && totalCalories !== undefined) {
              dayCals = totalCalories;
              dayProt = proteinGrams;
            } else if (dayCals === 0 && dayProt === 0 && day.isCompleted) {
              dayCals = effectiveTargets.calories;
              dayProt = effectiveTargets.protein;
            }

            const calTarget = effectiveTargets.calories || 2000;
            const protTarget = effectiveTargets.protein || 140;

            const calPct = Math.min(100, Math.round((dayCals / calTarget) * 100));
            const protPct = Math.min(100, Math.round((dayProt / protTarget) * 100));

            // Circumference of rings:
            // Outer (Calories): r = 15.2, C = 2 * PI * 15.2 ≈ 95.5
            // Inner (Protein):  r = 12.0, C = 2 * PI * 12.0 ≈ 75.4
            const cCalCirc = 95.5;
            const cProtCirc = 75.4;
            const calOffset = cCalCirc * (1 - calPct / 100);
            const protOffset = cProtCirc * (1 - protPct / 100);

            return (
              <button
                key={day.isoDate}
                type="button"
                onClick={() => handleDayClick(day)}
                title={
                  isAthleteMode
                    ? `${day.dayName} ${day.dateNum}: ${dayCals} kcal (${calPct}%) • ${dayProt}g proteína (${protPct}%)`
                    : `${day.dayName} ${day.dateNum}${day.isCompleted ? " — Hábitos completados" : ""}`
                }
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

                {/* Athlete Mode: Circular Concentric Progress Rings (Outer=Calories, Inner=Protein) */}
                {isAthleteMode ? (
                  <div
                    className={cn(
                      "relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center transition-all",
                      isSelected && "scale-105",
                    )}
                  >
                    {/* SVG Dual Progress Rings */}
                    <svg
                      className="absolute inset-0 w-full h-full -rotate-90 transform pointer-events-none"
                      viewBox="0 0 36 36"
                    >
                      {/* Outer Track: Calories */}
                      <circle
                        cx="18"
                        cy="18"
                        r="15.2"
                        fill="none"
                        stroke="currentColor"
                        className="text-secondary dark:text-zinc-800"
                        strokeWidth="2"
                      />
                      {calPct > 0 && (
                        <circle
                          cx="18"
                          cy="18"
                          r="15.2"
                          fill="none"
                          stroke="currentColor"
                          className="text-amber-500 dark:text-amber-400 transition-all duration-500 ease-out"
                          strokeWidth="2"
                          strokeDasharray={cCalCirc}
                          strokeDashoffset={calOffset}
                          strokeLinecap="round"
                        />
                      )}

                      {/* Inner Track: Protein */}
                      <circle
                        cx="18"
                        cy="18"
                        r="12"
                        fill="none"
                        stroke="currentColor"
                        className="text-secondary dark:text-zinc-800"
                        strokeWidth="2"
                      />
                      {protPct > 0 && (
                        <circle
                          cx="18"
                          cy="18"
                          r="12"
                          fill="none"
                          stroke="currentColor"
                          className="text-emerald-500 dark:text-emerald-400 transition-all duration-500 ease-out"
                          strokeWidth="2"
                          strokeDasharray={cProtCirc}
                          strokeDashoffset={protOffset}
                          strokeLinecap="round"
                        />
                      )}
                    </svg>

                    {/* Center Date Number */}
                    <div
                      className={cn(
                        "relative z-10 w-5 h-5 rounded-full flex items-center justify-center text-[10.5px] sm:text-[11px] font-bold transition-all",
                        isSelected
                          ? "bg-foreground text-background font-black shadow-xs"
                          : day.isToday
                            ? "text-foreground font-black ring-1.5 ring-foreground/60"
                            : "text-muted-foreground group-hover:text-foreground",
                      )}
                    >
                      {day.dateNum}
                    </div>
                  </div>
                ) : (
                  /* Wellness Mode: Original Concentric Checkmarks vs Date Number */
                  day.isCompleted ? (
                    <div
                      className={cn(
                        "relative w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all",
                        isSelected && "ring-2 ring-emerald-700/60 dark:ring-emerald-400 ring-offset-2 ring-offset-background",
                      )}
                    >
                      <div className="absolute inset-0 rounded-full border-2 border-emerald-600/25 dark:border-emerald-400/30" />
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3 h-3 stroke-[3.5]" />
                      </div>
                    </div>
                  ) : (
                    <div
                      className={cn(
                        "w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                        isSelected
                          ? "bg-foreground text-background font-black shadow-xs scale-105"
                          : day.isToday
                            ? "border-2 border-foreground/70 text-foreground font-black"
                            : "text-muted-foreground group-hover:text-foreground",
                      )}
                    >
                      {day.dateNum}
                    </div>
                  )
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. NUTRITION HERO: LADDER FITNESS SPLIT LAYOUT (SOLO EN MODO ATLETA) */}
      {isAthleteMode && activeTab === "nutrition" ? (
        <div
          className="space-y-4 touch-pan-y select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchCancel}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          {/* View Switcher Sub-header */}
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <div className="inline-flex items-center gap-2">
              <button
                type="button"
                onClick={() => setNutritionView(0)}
                className={cn(
                  "text-xs font-black uppercase tracking-wider transition-colors cursor-pointer select-none",
                  nutritionView === 0 ? "text-foreground font-bold" : "text-muted-foreground hover:text-foreground",
                )}
              >
                ESENCIAL
              </button>
              <span className="text-muted-foreground/40 text-xs">•</span>
              <button
                type="button"
                onClick={() => setNutritionView(1)}
                className={cn(
                  "text-xs font-black uppercase tracking-wider transition-colors cursor-pointer select-none",
                  nutritionView === 1 ? "text-foreground font-bold" : "text-muted-foreground hover:text-foreground",
                )}
              >
                TODOS LOS MACROS
              </button>

              <Popover open={isNutritionInfoOpen} onOpenChange={setIsNutritionInfoOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    onMouseEnter={() => setIsNutritionInfoOpen(true)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsNutritionInfoOpen((v) => !v);
                    }}
                    className="w-4 h-4 rounded-full inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-all cursor-pointer select-none ml-0.5"
                    aria-label="Información sobre la regla 80/20 en nutrición"
                  >
                    <Info className="w-3 h-3" />
                  </button>
                </PopoverTrigger>

                <PopoverContent
                  align="start"
                  side="bottom"
                  sideOffset={6}
                  onMouseEnter={() => setIsNutritionInfoOpen(true)}
                  onMouseLeave={() => setIsNutritionInfoOpen(false)}
                  className="w-72 sm:w-80 p-4 rounded-2xl bg-card border border-border text-card-foreground shadow-xl z-50 text-left"
                >
                  <div className="flex items-center gap-1.5 pb-2 border-b border-border/60">
                    <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 fill-emerald-600/20" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      La Regla del 80/20 en Nutrición
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-muted-foreground leading-relaxed pt-2.5">
                    <p>
                      Las <strong>calorías</strong> y la <strong>proteína</strong> son los dos pilares no negociables que determinan tu balance energético y la preservación de tu masa muscular.
                    </p>
                    <p>
                      Los <strong>carbohidratos y grasas</strong> son el combustible flexible que completan tus calorías según tu día y entrenamiento (puedes consultarlos en detalle en <em>Todos los Macros</em>), mientras que los <strong>micronutrientes</strong> se cubren con alimentos reales y variados, sin la ansiedad de contar cada microgramo.
                    </p>
                  </div>

                  <div className="pt-3 mt-2 border-t border-border/60 flex justify-end">
                    <Link
                      to="/blog/$slug"
                      params={{ slug: "la-ciencia-del-80-20-en-nutricion-por-que-menos-es-mas" }}
                      className="text-xs font-bold text-foreground hover:underline inline-flex items-center gap-1 group/link"
                    >
                      <span>Leer más</span>
                      <ArrowRight className="w-3 h-3 transition-transform group-hover/link:translate-x-0.5" />
                    </Link>
                  </div>
                </PopoverContent>
              </Popover>
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
              <div className="col-span-7 sm:col-span-7 space-y-4">
                {/* 1. CALORIES CONSUMED / REMAINING (Interactive Tap) */}
                <button
                  type="button"
                  onClick={toggleMetricMode}
                  className="flex items-start gap-3 text-left w-full group/metric cursor-pointer select-none rounded-xl p-1 -ml-1 transition-all duration-200 hover:bg-secondary/40 active:scale-[0.98]"
                  title="Toca para alternar entre consumo y faltantes para el objetivo"
                >
                  {/* Vertical Accent Bar (Warm Amber #f59e0b) */}
                  <div className="w-1 h-10 bg-amber-500 rounded-full shrink-0 shadow-2xs mt-0.5 group-hover/metric:scale-105 transition-transform" />

                  <div className="w-full">
                    {metricMode === "consumed" ? (
                      <div key="cal-consumed" className="animate-in fade-in duration-150">
                        {/* Consumed Number + Target Percentage Badge */}
                        <div className="flex items-baseline gap-2">
                          <div className="text-3xl sm:text-4xl font-black text-foreground tracking-tight leading-none tabular-nums font-sans">
                            {totalCalories}
                          </div>

                          <div className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-600 dark:text-amber-400">
                            <RotateCw className="w-2.5 h-2.5 stroke-[3] transition-transform duration-300" />
                            <span>{calPct >= 100 ? `✓ ${calPct}%` : `${calPct}%`}</span>
                          </div>
                        </div>

                        {/* Label */}
                        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mt-1">
                          CALORÍAS CONSUMIDAS
                        </span>
                      </div>
                    ) : (
                      <div key="cal-remaining" className="animate-in fade-in duration-150">
                        {/* Remaining Range + Remaining Badge */}
                        <div className="flex items-baseline gap-2">
                          <div className="text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-none tabular-nums font-sans">
                            {isCalOverTarget
                              ? `+${totalCalories - ranges.calories[1]} kcal`
                              : isCalInTarget
                                ? "EN RANGO"
                                : `${calRemainingMin} – ${calRemainingMax}`}
                          </div>

                          <div
                            className={cn(
                              "inline-flex items-center text-[10px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded",
                              isCalInTarget
                                ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                                : isCalOverTarget
                                  ? "bg-secondary text-muted-foreground"
                                  : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                            )}
                          >
                            <RotateCw className="w-2.5 h-2.5 stroke-[3] mr-1 rotate-180 transition-transform duration-300" />
                            {isCalInTarget ? "ZONA ÓPTIMA" : isCalOverTarget ? "META CUBIERTA" : "FALTAN"}
                          </div>
                        </div>

                        {/* Target Range Label */}
                        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mt-1">
                          {settings.customTargetsEnabled
                            ? `META FIJA: ${effectiveTargets.calories} KCAL`
                            : `RANGO META: ${ranges.calories[0]} – ${ranges.calories[1]} KCAL`}
                        </span>
                      </div>
                    )}
                  </div>
                </button>

                {/* 2. PROTEIN CONSUMED / REMAINING (Interactive Tap) */}
                <button
                  type="button"
                  onClick={toggleMetricMode}
                  className="flex items-start gap-3 text-left w-full group/metric cursor-pointer select-none rounded-xl p-1 -ml-1 transition-all duration-200 hover:bg-secondary/40 active:scale-[0.98]"
                  title="Toca para alternar entre consumo y faltantes para el objetivo"
                >
                  {/* Vertical Accent Bar (Botanical Emerald #10b981) */}
                  <div className="w-1 h-10 bg-emerald-500 rounded-full shrink-0 shadow-2xs mt-0.5 group-hover/metric:scale-105 transition-transform" />

                  <div className="w-full">
                    {metricMode === "consumed" ? (
                      <div key="prot-consumed" className="animate-in fade-in duration-150">
                        {/* Consumed Number + Target Percentage Badge */}
                        <div className="flex items-baseline gap-2">
                          <div className="text-3xl sm:text-4xl font-black text-foreground tracking-tight leading-none tabular-nums font-sans">
                            {proteinGrams}g
                          </div>

                          <div className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">
                            <RotateCw className="w-2.5 h-2.5 stroke-[3] transition-transform duration-300" />
                            <span>{protPct >= 100 ? `✓ ${protPct}%` : `${protPct}%`}</span>
                          </div>
                        </div>

                        {/* Label */}
                        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mt-1">
                          PROTEÍNA CONSUMIDA
                        </span>
                      </div>
                    ) : (
                      <div key="prot-remaining" className="animate-in fade-in duration-150">
                        {/* Remaining Range + Remaining Badge */}
                        <div className="flex items-baseline gap-2">
                          <div className="text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-none tabular-nums font-sans">
                            {isProtOverTarget
                              ? `+${proteinGrams - ranges.protein[1]}g`
                              : isProtInTarget
                                ? "EN RANGO"
                                : `${protRemainingMin} – ${protRemainingMax}g`}
                          </div>

                          <div
                            className={cn(
                              "inline-flex items-center text-[10px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded",
                              isProtInTarget
                                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                                : isProtOverTarget
                                  ? "bg-secondary text-muted-foreground"
                                  : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                            )}
                          >
                            <RotateCw className="w-2.5 h-2.5 stroke-[3] mr-1 rotate-180 transition-transform duration-300" />
                            {isProtInTarget ? "ZONA ÓPTIMA" : isProtOverTarget ? "META CUBIERTA" : "FALTAN"}
                          </div>
                        </div>

                        {/* Target Range Label */}
                        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mt-1">
                          {settings.customTargetsEnabled
                            ? `META FIJA: ${effectiveTargets.protein}G`
                            : `RANGO META: ${ranges.protein[0]} – ${ranges.protein[1]}G`}
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              </div>

              {/* RIGHT COLUMN: GIANT LADDER CONCENTRIC RINGS (OUTER AMBER CALORIES + INNER EMERALD PROTEIN) */}
              <div className="col-span-5 sm:col-span-5 flex items-center justify-end relative">
                <button
                  type="button"
                  onClick={toggleMetricMode}
                  className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center rounded-full cursor-pointer select-none transition-transform duration-200 active:scale-95 group/rings focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
                  title="Toca los anillos para alternar entre consumo y faltantes"
                  aria-label="Alternar métricas nutricionales"
                >
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

                    {/* Outer Ring Target Range Highlight Zone (Shaded Warm Amber Landing Strip) */}
                    <circle
                      cx="80"
                      cy="80"
                      r={outerR}
                      fill="none"
                      stroke="currentColor"
                      className="text-amber-500/25 dark:text-amber-400/20"
                      strokeWidth="13"
                      strokeDasharray={`${calZoneLength} ${outerCircumference}`}
                      strokeDashoffset={calZoneOffset}
                      strokeLinecap="butt"
                    />

                    {/* Outer Ring Active Progress (Warm Amber #f59e0b) */}
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
                      className="text-amber-500 dark:text-amber-400 transition-all duration-700 ease-out"
                    />

                    {/* Outer Ring (Calories) 100% Target Threshold Marker Line (Single clean divider marking target range entry) */}
                    <line
                      x1={calX1}
                      y1={calY1}
                      x2={calX2}
                      y2={calY2}
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      className="text-card"
                    />
                    <line
                      x1={calX1}
                      y1={calY1}
                      x2={calX2}
                      y2={calY2}
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      className="text-foreground/80 dark:text-foreground/90"
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

                    {/* Inner Ring Target Range Highlight Zone (Shaded Emerald Landing Strip) */}
                    <circle
                      cx="80"
                      cy="80"
                      r={innerR}
                      fill="none"
                      stroke="currentColor"
                      className="text-emerald-500/25 dark:text-emerald-400/20"
                      strokeWidth="13"
                      strokeDasharray={`${protZoneLength} ${innerCircumference}`}
                      strokeDashoffset={protZoneOffset}
                      strokeLinecap="butt"
                    />

                    {/* Inner Ring Active Progress (Botanical Emerald #10b981 / emerald-500) */}
                    <circle
                      cx="80"
                      cy="80"
                      r={innerR}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="13"
                      strokeDasharray={innerCircumference}
                      strokeDashoffset={innerOffset}
                      strokeLinecap="butt"
                      className="text-emerald-500 dark:text-emerald-400 transition-all duration-700 ease-out"
                    />

                    {/* Inner Ring (Protein) 100% Target Threshold Marker Line (Single clean divider marking target range entry) */}
                    <line
                      x1={protX1}
                      y1={protY1}
                      x2={protX2}
                      y2={protY2}
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      className="text-card"
                    />
                    <line
                      x1={protX1}
                      y1={protY1}
                      x2={protX2}
                      y2={protY2}
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      className="text-foreground/80 dark:text-foreground/90"
                    />
                  </svg>

                  {/* Center Milestone / Mode Switch Indicator */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-2">
                    {isBothInTarget ? (
                      <div className="flex flex-col items-center justify-center animate-in zoom-in-95 duration-300">
                        <Sparkles className="w-4 h-4 text-emerald-500 fill-emerald-500/20 mb-0.5" />
                        <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 leading-tight">
                          EN RANGO
                        </span>
                        <span className="text-[8px] font-bold text-muted-foreground/80 leading-none mt-0.5">
                          {metricMode === "consumed" ? "Óptimo" : "Cubierto"}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-muted-foreground/60 group-hover/rings:text-foreground transition-colors">
                        <RotateCw
                          className={cn(
                            "w-3.5 h-3.5 transition-transform duration-300",
                            metricMode === "remaining" && "rotate-180 text-foreground"
                          )}
                        />
                        <span className="text-[8px] font-black uppercase tracking-widest mt-1 text-muted-foreground/70">
                          {metricMode === "consumed" ? "Consumo" : "Faltan"}
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              </div>
            </div>
          ) : (
            /* SLIDE 2: ALL MACROS DETAILED BREAKDOWN (WITH TAP TO TOGGLE) */
            <div className="space-y-3.5 pt-1 animate-in fade-in duration-200">
              <div className="grid grid-cols-2 gap-3">
                {/* Protein Card */}
                <button
                  type="button"
                  onClick={toggleMetricMode}
                  className="p-3.5 rounded-2xl bg-secondary/40 dark:bg-secondary/20 border border-border/70 flex flex-col justify-between text-left cursor-pointer hover:bg-secondary/60 transition-all duration-200 active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      PROTEÍNA
                    </span>
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                      {metricMode === "consumed"
                        ? (protPct >= 100 ? `✓ ${protPct}%` : `${protPct}%`)
                        : (isProtInTarget ? "EN RANGO" : isProtOverTarget ? "CUBIERTO" : "FALTAN")}
                    </span>
                  </div>
                  <div className="text-xl font-black text-foreground tabular-nums mb-2">
                    {metricMode === "consumed" ? (
                      <div key="slide2-prot-consumed" className="animate-in fade-in duration-150">
                        {proteinGrams}g <span className="text-xs font-normal text-muted-foreground">/ {settings.customTargetsEnabled ? `${effectiveTargets.protein}g` : `${ranges.protein[0]}–${ranges.protein[1]}g`}</span>
                      </div>
                    ) : (
                      <div key="slide2-prot-remaining" className="animate-in fade-in duration-150">
                        {isProtOverTarget ? (
                          <>+{proteinGrams - ranges.protein[1]}g <span className="text-xs font-normal text-muted-foreground">extra</span></>
                        ) : isProtInTarget ? (
                          <span className="text-base text-emerald-600 dark:text-emerald-400">Zona Óptima</span>
                        ) : (
                          <>{protRemainingMin}–{protRemainingMax}g <span className="text-xs font-normal text-muted-foreground">faltan</span></>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="relative w-full h-1.5 bg-secondary dark:bg-zinc-800 rounded-full overflow-hidden">
                    {/* Shaded Target Range Landing Strip */}
                    <div
                      className="absolute top-0 bottom-0 bg-emerald-500/25 dark:bg-emerald-400/20"
                      style={{
                        left: `${Math.round(protTargetRatio * 100)}%`,
                        right: 0,
                      }}
                    />
                    <div
                      className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full transition-all duration-500 relative z-[2]"
                      style={{ width: `${Math.min(100, Math.round((proteinGrams / (ranges.protein[1] || 140)) * 100))}%` }}
                    />
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-emerald-700/80 dark:bg-emerald-300/80 z-10 -translate-x-1/2"
                      style={{ left: `${Math.round(protTargetRatio * 100)}%` }}
                    />
                  </div>
                </button>

                {/* Fiber Card */}
                <button
                  type="button"
                  onClick={toggleMetricMode}
                  className="p-3.5 rounded-2xl bg-secondary/40 dark:bg-secondary/20 border border-border/70 flex flex-col justify-between text-left cursor-pointer hover:bg-secondary/60 transition-all duration-200 active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      FIBRA
                    </span>
                    <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                      {metricMode === "consumed"
                        ? (fiberPct >= 100 ? `✓ ${fiberPct}%` : `${fiberPct}%`)
                        : (isFiberInTarget ? "EN RANGO" : isFiberOverTarget ? "CUBIERTO" : "FALTAN")}
                    </span>
                  </div>
                  <div className="text-xl font-black text-foreground tabular-nums mb-2">
                    {metricMode === "consumed" ? (
                      <div key="slide2-fiber-consumed" className="animate-in fade-in duration-150">
                        {fiberGrams}g <span className="text-xs font-normal text-muted-foreground">/ {settings.customTargetsEnabled && effectiveTargets.fiber ? `${effectiveTargets.fiber}g` : `${ranges.fiber[0]}–${ranges.fiber[1]}g`}</span>
                      </div>
                    ) : (
                      <div key="slide2-fiber-remaining" className="animate-in fade-in duration-150">
                        {isFiberOverTarget ? (
                          <>+{fiberGrams - ranges.fiber[1]}g <span className="text-xs font-normal text-muted-foreground">extra</span></>
                        ) : isFiberInTarget ? (
                          <span className="text-base text-indigo-600 dark:text-indigo-400">Zona Óptima</span>
                        ) : (
                          <>{fiberRemainingMin}–{fiberRemainingMax}g <span className="text-xs font-normal text-muted-foreground">faltan</span></>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="relative w-full h-1.5 bg-secondary dark:bg-zinc-800 rounded-full overflow-hidden">
                    {/* Shaded Target Range Landing Strip */}
                    <div
                      className="absolute top-0 bottom-0 bg-indigo-500/25 dark:bg-indigo-400/20"
                      style={{
                        left: `${Math.round((ranges.fiber[0] / (ranges.fiber[1] || 38)) * 100)}%`,
                        right: 0,
                      }}
                    />
                    <div
                      className="h-full bg-indigo-500 dark:bg-indigo-400 rounded-full transition-all duration-500 relative z-[2]"
                      style={{ width: `${Math.min(100, Math.round((fiberGrams / (ranges.fiber[1] || 38)) * 100))}%` }}
                    />
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-indigo-700/80 dark:bg-indigo-300/80 z-10 -translate-x-1/2"
                      style={{ left: `${Math.round((ranges.fiber[0] / (ranges.fiber[1] || 38)) * 100)}%` }}
                    />
                  </div>
                </button>

                {/* Carbs Card */}
                <button
                  type="button"
                  onClick={toggleMetricMode}
                  className="p-3.5 rounded-2xl bg-secondary/40 dark:bg-secondary/20 border border-border/70 flex flex-col justify-between text-left cursor-pointer hover:bg-secondary/60 transition-all duration-200 active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      CARBOHIDRATOS
                    </span>
                    <span className="text-xs font-black text-orange-600 dark:text-orange-400">
                      {metricMode === "consumed"
                        ? (carbsPct >= 100 ? `✓ ${carbsPct}%` : `${carbsPct}%`)
                        : (isCarbsInTarget ? "EN RANGO" : isCarbsOverTarget ? "CUBIERTO" : "FALTAN")}
                    </span>
                  </div>
                  <div className="text-xl font-black text-foreground tabular-nums mb-2">
                    {metricMode === "consumed" ? (
                      <div key="slide2-carbs-consumed" className="animate-in fade-in duration-150">
                        {carbsGrams}g <span className="text-xs font-normal text-muted-foreground">/ {settings.customTargetsEnabled ? `${effectiveTargets.carbs}g` : `${ranges.carbs[0]}–${ranges.carbs[1]}g`}</span>
                      </div>
                    ) : (
                      <div key="slide2-carbs-remaining" className="animate-in fade-in duration-150">
                        {isCarbsOverTarget ? (
                          <>+{carbsGrams - ranges.carbs[1]}g <span className="text-xs font-normal text-muted-foreground">extra</span></>
                        ) : isCarbsInTarget ? (
                          <span className="text-base text-orange-600 dark:text-orange-400">Zona Óptima</span>
                        ) : (
                          <>{carbsRemainingMin}–{carbsRemainingMax}g <span className="text-xs font-normal text-muted-foreground">faltan</span></>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="relative w-full h-1.5 bg-secondary dark:bg-zinc-800 rounded-full overflow-hidden">
                    {/* Shaded Target Range Landing Strip */}
                    <div
                      className="absolute top-0 bottom-0 bg-orange-500/25 dark:bg-orange-400/20"
                      style={{
                        left: `${Math.round((ranges.carbs[0] / (ranges.carbs[1] || 250)) * 100)}%`,
                        right: 0,
                      }}
                    />
                    <div
                      className="h-full bg-orange-500 dark:bg-orange-400 rounded-full transition-all duration-500 relative z-[2]"
                      style={{ width: `${Math.min(100, Math.round((carbsGrams / (ranges.carbs[1] || 250)) * 100))}%` }}
                    />
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-foreground/80 z-10 -translate-x-1/2"
                      style={{ left: `${Math.round((ranges.carbs[0] / (ranges.carbs[1] || 250)) * 100)}%` }}
                    />
                  </div>
                </button>

                {/* Fat Card */}
                <button
                  type="button"
                  onClick={toggleMetricMode}
                  className="p-3.5 rounded-2xl bg-secondary/40 dark:bg-secondary/20 border border-border/70 flex flex-col justify-between text-left cursor-pointer hover:bg-secondary/60 transition-all duration-200 active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      GRASAS
                    </span>
                    <span className="text-xs font-black text-sky-600 dark:text-sky-400">
                      {metricMode === "consumed"
                        ? (fatPct >= 100 ? `✓ ${fatPct}%` : `${fatPct}%`)
                        : (isFatInTarget ? "EN RANGO" : isFatOverTarget ? "CUBIERTO" : "FALTAN")}
                    </span>
                  </div>
                  <div className="text-xl font-black text-foreground tabular-nums mb-2">
                    {metricMode === "consumed" ? (
                      <div key="slide2-fat-consumed" className="animate-in fade-in duration-150">
                        {fatGrams}g <span className="text-xs font-normal text-muted-foreground">/ {settings.customTargetsEnabled ? `${effectiveTargets.fat}g` : `${ranges.fat[0]}–${ranges.fat[1]}g`}</span>
                      </div>
                    ) : (
                      <div key="slide2-fat-remaining" className="animate-in fade-in duration-150">
                        {isFatOverTarget ? (
                          <>+{fatGrams - ranges.fat[1]}g <span className="text-xs font-normal text-muted-foreground">extra</span></>
                        ) : isFatInTarget ? (
                          <span className="text-base text-sky-600 dark:text-sky-400">Zona Óptima</span>
                        ) : (
                          <>{fatRemainingMin}–{fatRemainingMax}g <span className="text-xs font-normal text-muted-foreground">faltan</span></>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="relative w-full h-1.5 bg-secondary dark:bg-zinc-800 rounded-full overflow-hidden">
                    {/* Shaded Target Range Landing Strip */}
                    <div
                      className="absolute top-0 bottom-0 bg-sky-500/25 dark:bg-sky-400/20"
                      style={{
                        left: `${Math.round((ranges.fat[0] / (ranges.fat[1] || 70)) * 100)}%`,
                        right: 0,
                      }}
                    />
                    <div
                      className="h-full bg-sky-500 dark:bg-sky-400 rounded-full transition-all duration-500 relative z-[2]"
                      style={{ width: `${Math.min(100, Math.round((fatGrams / (ranges.fat[1] || 70)) * 100))}%` }}
                    />
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-foreground/80 z-10 -translate-x-1/2"
                      style={{ left: `${Math.round((ranges.fat[0] / (ranges.fat[1] || 70)) * 100)}%` }}
                    />
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ACTIVIDAD TAB: 2-COLUMN BALANCED HERO (SYMMETRIC TO NUTRITION) */
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* View Sub-header */}
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <div className="inline-flex items-center gap-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-foreground">
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
                    className="w-4 h-4 rounded-full inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-all cursor-pointer select-none ml-0.5"
                    aria-label="Información sobre la racha de actividad"
                  >
                    <Info className="w-3 h-3" />
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
      )}
    </div>
  );
}

// Keep BioStateCard alias for backward compatibility
export const BioStateCard = DailyNutritionHeroCard;
