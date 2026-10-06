// Timing Fit Engine — Contextual Chrono-Metabolic Fit (Shakerfy AI)
// Bioethics & Anti-TCA Compliant (Addition over restriction, no food moralization)

export interface TimingFit {
  tag: string;
  type: "optimal" | "balanced" | "caution";
  hint: string;
  iconName?: "target" | "moon" | "zap" | "sparkles" | "sun";
}

function parseTimeToMinutes(timeStr?: string): number {
  if (!timeStr) return 0;
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3]?.toUpperCase();

  if (meridiem === "PM" && hours < 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

export function calculateTimingFit(
  meal: {
    time?: string;
    date?: string;
    vectorBadges?: any[];
    reasons?: string[];
    bioScore?: number;
    title?: string;
    mealType?: string;
    contextTag?: string;
    isPreWorkout?: boolean;
    isPostWorkout?: boolean;
  },
  allTimelineItems?: any[],
): TimingFit | null {
  if (!meal.time) return null;

  const mealMinutes = parseTimeToMinutes(meal.time);

  // Fallback to localStorage timeline items if not provided
  let timelineItems = allTimelineItems;
  if (!timelineItems && typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("shakerfy_user_timeline_items");
      if (stored) timelineItems = JSON.parse(stored);
    } catch (_) {}
  }

  // 1. Explicit or Flagged Pre-Entreno
  if (
    meal.isPreWorkout ||
    meal.mealType === "Pre-entreno" ||
    (meal.contextTag && /pre-entreno/i.test(meal.contextTag))
  ) {
    return {
      tag: "Preparación Pre-Entreno",
      type: "optimal",
      hint: "Energía disponible y digestión ligera para llegar con confort a tu sesión.",
      iconName: "zap",
    };
  }

  // 2. Explicit or Flagged Post-Entreno
  if (
    meal.isPostWorkout ||
    meal.mealType === "Post-entreno" ||
    (meal.contextTag && /post-entreno/i.test(meal.contextTag))
  ) {
    return {
      tag: "Ideal Post-Entreno",
      type: "optimal",
      hint: "Aporte oportuno para restaurar glucógeno y apoyar la síntesis proteica.",
      iconName: "target",
    };
  }

  // 3. Upcoming workout/class in reservations (within next 120 minutes)
  if (typeof window !== "undefined") {
    try {
      const resStr = localStorage.getItem("shakerfy_user_reservations");
      if (resStr) {
        const reservations = JSON.parse(resStr);
        if (Array.isArray(reservations)) {
          for (const r of reservations) {
            const timeStr = r?.time || r?.timeLabel;
            if (timeStr) {
              const resMin = parseTimeToMinutes(timeStr);
              const diff = resMin - mealMinutes;
              if (diff > 0 && diff <= 120) {
                return {
                  tag: "Preparación Pre-Entreno",
                  type: "optimal",
                  hint: "Energía disponible y digestión ligera para llegar con confort a tu sesión.",
                  iconName: "zap",
                };
              }
            }
          }
        }
      }
    } catch (_) {}
  }

  // 4. Upcoming activity in timeline (within next 120 minutes on same date)
  if (timelineItems && Array.isArray(timelineItems)) {
    const hasUpcomingActivity = timelineItems.some((item) => {
      if (!item || !item.date || (meal.date && item.date !== meal.date)) return false;
      const isActivity =
        item.type === "activity" || item.type === "gym_session" || item.type === "class_session" || item.type === "workout";
      if (!isActivity || !item.time) return false;

      const actMinutes = parseTimeToMinutes(item.time);
      const diff = actMinutes - mealMinutes;
      return diff > 0 && diff <= 120;
    });

    if (hasUpcomingActivity) {
      return {
        tag: "Preparación Pre-Entreno",
        type: "optimal",
        hint: "Energía disponible y digestión ligera para llegar con confort a tu sesión.",
        iconName: "zap",
      };
    }
  }

  // 5. Recent workout/activity in timeline (within 150 minutes prior on same date)
  if (timelineItems && Array.isArray(timelineItems)) {
    const hasRecentActivity = timelineItems.some((item) => {
      if (!item || !item.date || (meal.date && item.date !== meal.date)) return false;
      const isActivity =
        item.type === "activity" || item.type === "gym_session" || item.type === "class_session" || item.type === "workout";
      if (!isActivity || !item.time) return false;

      const actMinutes = parseTimeToMinutes(item.time);
      const diff = mealMinutes - actMinutes;
      return diff >= 0 && diff <= 150; // Meal happened up to 2.5h after workout
    });

    if (hasRecentActivity) {
      return {
        tag: "Ideal Post-Entreno",
        type: "optimal",
        hint: "Aporte oportuno para restaurar glucógeno y apoyar la síntesis proteica.",
        iconName: "target",
      };
    }
  }

  // 6. Check for late night digestion window (>= 21:30 or <= 04:00)
  if (mealMinutes >= 21 * 60 + 30 || mealMinutes <= 4 * 60) {
    return {
      tag: "Digestión Nocturna",
      type: "caution",
      hint: "Ventana nocturna; hidratación y reposo favorecen un descanso profundo.",
      iconName: "moon",
    };
  }

  // 7. Check for early morning activation (06:00 to 09:30)
  if (mealMinutes >= 6 * 60 && mealMinutes <= 9 * 60 + 30) {
    return {
      tag: "Activación Matutina",
      type: "optimal",
      hint: "Nutrientes basales para un arranque con energía estable.",
      iconName: "sun",
    };
  }

  // 8. Check Current Bio State from localStorage (if user reported high fatigue / depleted reserves)
  if (typeof window !== "undefined") {
    try {
      const savedBio = localStorage.getItem("shakerfy_current_bio_state");
      if (savedBio) {
        const bio = JSON.parse(savedBio);
        if (
          bio.energy !== undefined &&
          bio.energy < 35 &&
          bio.hunger !== undefined &&
          bio.hunger < 40
        ) {
          return {
            tag: "Recarga Energética",
            type: "balanced",
            hint: "Soporte oportuno ante demanda biológica de energía.",
            iconName: "zap",
          };
        }
      }
    } catch (_) {}
  }

  // 9. Default: No special acute context (Graceful Silence / No badge rendered)
  return null;
}
