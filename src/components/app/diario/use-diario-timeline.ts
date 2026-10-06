import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { toast } from "sonner";
import { ARMSTRONG_LEVELS } from "../app-utils";
import { saveDietaryPreferenceToAiMemory } from "@/lib/ai-suggestion-generator";
import {
  parseTimeToMinutes,
  defaultIngredientSwaps,
  calculateSuggestionMacros,
  resolveSuggestionIngredients,
  generateDynamicSuggestionTitle,
  generateDynamicEducationalInsight,
} from "../diario-helpers";

export function getTodayIso() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function useDiarioTimeline() {
  const todayIso = useMemo(() => getTodayIso(), []);
  const [selectedTimelineDate, setSelectedTimelineDate] = useState<string>(() => getTodayIso());

  const [activityData, setActivityData] = useState([
    { day: "Lun", puntos: 180 },
    { day: "Mar", puntos: 160 },
    { day: "Mié", puntos: 175 },
    { day: "Jue", puntos: 140 },
    { day: "Vie", puntos: 155 },
    { day: "Sáb", puntos: 190 },
    { day: "Dom", puntos: 168 },
  ]);

  const [editingTimelineItem, setEditingTimelineItem] = useState<any | null>(null);
  const [expandedCardInsights, setExpandedCardInsights] = useState<Record<string, boolean>>({});

  const toggleCardInsights = (id: string) => {
    setExpandedCardInsights((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const [expandedMealCta, setExpandedMealCta] = useState<Record<string, string | null>>({});
  const [loggedMicroActions, setLoggedMicroActions] = useState<
    Record<string, { type: string; itemId?: string; level?: number; time: string } | null>
  >({});

  const toggleMealCta = (mealId: string, ctaId: string) => {
    setExpandedMealCta((prev) => ({
      ...prev,
      [mealId]: prev[mealId] === ctaId ? null : ctaId,
    }));
  };

  const [userTimelineItems, setUserTimelineItems] = useState<any[]>(() => {
    const todayStr = getTodayIso();
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("shakerfy_user_timeline_items");
      if (saved !== null) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed
              .map((item: any) => {
                const cleaned = item?.type === "activity" ? { ...item, kcal: 0 } : item;
                if (cleaned && (cleaned.date === "2026-07-15" || !cleaned.date)) {
                  return { ...cleaned, date: todayStr };
                }
                return cleaned;
              })
              .filter((item: any) => item && item.id);
          }
        } catch (e) {}
      }
    }
    return [
      {
        id: "activity-demo-1",
        date: todayStr,
        time: "10:30 AM",
        title: "Caminata Enérgica",
        activityName: "Caminata Enérgica",
        duration: 45,
        intensity: "med",
        intensityLabel: "Media",
        subtitle: "Registro de Actividad",
        type: "activity",
        img: null,
        kcal: 0,
        tag: "45 min • Media",
        coachFeedback:
          "Registraste 45 min de Caminata (intensidad Media). ¡Gran trabajo!",
      },
    ];
  });

  // Sync to localStorage on changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const validOnly = userTimelineItems.filter((item: any) => item && item.id);
      localStorage.setItem("shakerfy_user_timeline_items", JSON.stringify(validOnly));
    }
  }, [userTimelineItems]);

  useEffect(() => {
    const handleSyncStorage = () => {
      if (typeof window !== "undefined") {
        try {
          const saved = localStorage.getItem("shakerfy_user_timeline_items");
          if (saved !== null) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
              const validOnly = parsed
                .map((item: any) => (item?.type === "activity" ? { ...item, kcal: 0 } : item))
                .filter((item: any) => item && item.id);
              setUserTimelineItems(validOnly);
            }
          }
        } catch (e) {}
      }
    };

    window.addEventListener("shakerfy:timeline-update", handleSyncStorage);
    window.addEventListener("storage", handleSyncStorage);
    return () => {
      window.removeEventListener("shakerfy:timeline-update", handleSyncStorage);
      window.removeEventListener("storage", handleSyncStorage);
    };
  }, []);

  const handleLogArmstrongLevel = (mealId: string, level: number) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(15);
      } catch (_) {}
    }
    const currentObj = ARMSTRONG_LEVELS.find((l) => l.level === level) || ARMSTRONG_LEVELS[1];
    const now = new Date();
    const timeStr = now.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });

    // ponytail: Armstrong check is instantaneous in-place biofeedback on the meal card; no separate timeline card created
    setLoggedMicroActions((prev) => ({
      ...prev,
      [mealId]: { type: "armstrong", itemId: `armstrong-${mealId}`, level, time: timeStr },
    }));
    toast.success(`💧 Chequeo: Nivel ${level} Armstrong (${currentObj.state})`);
  };

  const handleUndoMicroAction = (mealId: string) => {
    setLoggedMicroActions((prev) => ({ ...prev, [mealId]: null }));
    toast.info("Acción deshecha");
  };

  const handleAddAccompanimentToMeal = (mealId: string, accompanimentName: string) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(20);
      } catch (_) {}
    }
    setUserTimelineItems((prev) =>
      prev.map((it) => {
        if (it.id !== mealId) return it;
        const currentIngs = Array.isArray(it.ingredients) ? it.ingredients : [];
        const updatedIngs = [
          ...currentIngs,
          { id: `ing-${Date.now()}`, name: accompanimentName, grams: 100, calories: 30, protein: 1, carbs: 4, fat: 1 },
        ];
        return {
          ...it,
          ingredients: updatedIngs,
          desc: it.desc ? `${it.desc} • ${accompanimentName}` : accompanimentName,
          narrative: it.narrative ? `${it.narrative} • ${accompanimentName}` : accompanimentName,
        };
      })
    );
    toast.success(`✓ "${accompanimentName}" sumado al registro`);
  };

  const handleDeleteTimelineItem = (id: string) => {
    const itemIndex = userTimelineItems.findIndex((item) => String(item.id) === String(id));
    if (itemIndex === -1) return;
    const deletedItem = userTimelineItems[itemIndex];
    const itemTitle = deletedItem.title || deletedItem.activityName || deletedItem.foodName || "Registro";

    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(25);
      } catch (_) {}
    }

    const nextItems = userTimelineItems.filter((item) => String(item.id) !== String(id));

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("shakerfy_user_timeline_items", JSON.stringify(nextItems));
      } catch (_) {}
    }

    setUserTimelineItems(nextItems);

    toast(`"${itemTitle}" eliminado`, {
      action: {
        label: "Deshacer",
        onClick: () => {
          if (typeof navigator !== "undefined" && navigator.vibrate) {
            try {
              navigator.vibrate([15, 30]);
            } catch (_) {}
          }
          setUserTimelineItems((prev) => {
            const restored = [...prev];
            if (itemIndex >= 0 && itemIndex <= restored.length) {
              restored.splice(itemIndex, 0, deletedItem);
            } else {
              restored.push(deletedItem);
            }
            if (typeof window !== "undefined") {
              try {
                localStorage.setItem("shakerfy_user_timeline_items", JSON.stringify(restored));
              } catch (_) {}
            }
            return restored;
          });
          toast.success(`✓ "${itemTitle}" restaurado`);
        },
      },
      duration: 5000,
    });
  };

  const handleToggleSaveTimelineItem = (id: string) => {
    const targetItem = userTimelineItems.find((item) => String(item.id) === String(id));
    if (!targetItem) return;

    const willBeSaved = !targetItem.isSaved && !targetItem.saved;
    const itemTitle = targetItem.title || targetItem.foodName || "Escaneo";

    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(25);
      } catch (_) {}
    }

    const nextItems = userTimelineItems.map((item) => {
      if (String(item.id) === String(id)) {
        return { ...item, isSaved: willBeSaved, saved: willBeSaved };
      }
      return item;
    });

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("shakerfy_user_timeline_items", JSON.stringify(nextItems));
        window.dispatchEvent(new CustomEvent("shakerfy:timeline-update"));
      } catch (_) {}
    }

    setUserTimelineItems(nextItems);

    if (willBeSaved) {
      toast.success(`✓ "${itemTitle}" guardado en Saved Scans`);
    } else {
      toast.info(`"${itemTitle}" removido de Saved Scans`);
    }
  };

  const handleConsumeAiSuggestionOption = (
    itemId: string,
    optIdx: number,
    macros: { calories: number; protein: number; carbs: number; fat: number }
  ) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(25);
      } catch (_) {}
    }
    setUserTimelineItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        return {
          ...item,
          consumed: true,
          consumedAt: new Date().toISOString(),
          isAiSuggestion: true,
          chosenOptionIndex: optIdx,
          calories: macros.calories,
          kcal: macros.calories,
          protein: macros.protein,
          carbs: macros.carbs,
          carbohydrates: macros.carbs,
          fat: macros.fat,
        };
      })
    );
    toast.success(`✓ ~${macros.calories} kcal y ${macros.protein}g proteína sumados a tu meta diaria`);
  };

  const handleAiSuggestionLike = (itemId: string) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(15);
      } catch (_) {}
    }
    const targetItem = userTimelineItems.find((item) => item.id === itemId);
    const singleOpt = Array.isArray(targetItem?.options) && targetItem.options[0];
    const optText = typeof singleOpt === "string" ? singleOpt : singleOpt?.text || targetItem?.title || "esta opción";

    setUserTimelineItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        return { ...item, feedback: "like" };
      }),
    );
    saveDietaryPreferenceToAiMemory(`Le gusta: ${optText}`);
    toast.success("✓ Guardado en tus gustos y preferencias de IA");
  };

  const handleAiSuggestionDislike = (itemId: string) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(15);
      } catch (_) {}
    }
    const targetItem = userTimelineItems.find((item) => item.id === itemId);
    const singleOpt = Array.isArray(targetItem?.options) && targetItem.options[0];
    const optText = typeof singleOpt === "string" ? singleOpt : singleOpt?.text || targetItem?.title || "esta opción";

    setUserTimelineItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        return { ...item, feedback: "dislike" };
      }),
    );
    saveDietaryPreferenceToAiMemory(`No prefiere: ${optText}`);
    toast.success("✓ Registrado en tus preferencias de IA");
  };

  const handleMealFeedback = (mealId: string, feedbackType: "like" | "dislike") => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(15);
      } catch (_) {}
    }
    const targetItem = userTimelineItems.find((item) => item.id === mealId);
    const mealName = targetItem?.title || targetItem?.foodName || "esta comida";
    const nextFeedback = targetItem?.feedback === feedbackType ? null : feedbackType;

    setUserTimelineItems((prev) =>
      prev.map((item) => {
        if (item.id !== mealId) return item;
        return { ...item, feedback: nextFeedback };
      }),
    );

    if (nextFeedback === "like") {
      saveDietaryPreferenceToAiMemory(`Le gusta: ${mealName}`);
      toast.success("✓ Guardado en tus gustos");
    } else if (nextFeedback === "dislike") {
      saveDietaryPreferenceToAiMemory(`No suele preferir: ${mealName}`);
      toast.info("No usaremos este plato para sugerencias");
    } else {
      toast.info("Preferencia desmarcada");
    }
  };

  const [doubleTapAnimationId, setDoubleTapAnimationId] = useState<string | null>(null);

  const handleDoubleTapLike = (mealId: string) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate([30, 50]);
      } catch (_) {}
    }

    setDoubleTapAnimationId(mealId);
    setTimeout(() => {
      setDoubleTapAnimationId((curr) => (curr === mealId ? null : curr));
    }, 850);

    const targetItem = userTimelineItems.find((item) => item.id === mealId);
    if (targetItem?.feedback !== "like") {
      setUserTimelineItems((prev) =>
        prev.map((item) => {
          if (item.id !== mealId) return item;
          return { ...item, feedback: "like" };
        }),
      );
      const mealName = targetItem?.title || targetItem?.foodName || "esta comida";
      saveDietaryPreferenceToAiMemory(`Le gusta: ${mealName}`);
      toast.success("✓ Guardado en tus gustos");
    }
  };

  const handleSaveEditedTimelineItem = (updated: any) => {
    setUserTimelineItems((prev) => {
      const next = prev.map((item) => (item.id === updated.id ? updated : item));
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("shakerfy_user_timeline_items", JSON.stringify(next));
          window.dispatchEvent(new CustomEvent("shakerfy:timeline-update"));
        } catch (_) {}
      }
      return next;
    });
    setEditingTimelineItem(null);
  };

  const handleToggleMealConsumed = (itemId: string) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(15);
      } catch (_) {}
    }
    setUserTimelineItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const nextConsumed = !item.consumed;
        if (nextConsumed) {
          toast.success("✓ Comida marcada como consumida");
        } else {
          toast.info("Comida desmarcada");
        }
        return {
          ...item,
          consumed: nextConsumed,
          consumedAt: nextConsumed ? new Date().toISOString() : undefined,
        };
      }),
    );
  };

  const handleSwapIngredient = (itemId: string, ingIndex: number) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(15);
      } catch (_) {}
    }
    setUserTimelineItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const currentList = resolveSuggestionIngredients(item);
        const updatedIngredients = currentList.map((ing: any, idx: number) => {
          if (idx !== ingIndex) return ing;
          const currentObj = typeof ing === "object" && ing !== null ? { ...ing } : { name: String(ing), selectedIndex: 0 };
          let options = currentObj.options;
          if (!options || options.length <= 1) {
            const lower = currentObj.name.toLowerCase();
            for (const [key, opts] of Object.entries(defaultIngredientSwaps)) {
              if (lower.includes(key)) {
                options = opts;
                break;
              }
            }
          }
          if (!options || options.length <= 1) return ing;
          const nextIndex = ((currentObj.selectedIndex ?? 0) + 1) % options.length;
          const newName = options[nextIndex];
          toast.info(`Sustituido: ${newName}`);
          return {
            ...currentObj,
            options,
            selectedIndex: nextIndex,
            name: newName,
          };
        });

        const newMacros = calculateSuggestionMacros(updatedIngredients);
        const newTitle = generateDynamicSuggestionTitle(updatedIngredients, item.title);
        const newInsight = generateDynamicEducationalInsight(updatedIngredients, item.contextBadge || item.subtitle || "");

        return {
          ...item,
          title: newTitle,
          desc: newInsight,
          narrative: newInsight,
          ingredients: updatedIngredients,
          calories: newMacros.calories,
          kcal: newMacros.calories,
          protein: newMacros.protein,
          carbs: newMacros.carbs,
          carbohydrates: newMacros.carbs,
          fat: newMacros.fat,
        };
      }),
    );
  };

  const timelineItems = useMemo(() => {
    const processedUserItems = userTimelineItems.filter((item) => {
      if (!item || !item.id || ["sunrise", "sunset", "peak", "circadian", "weight"].includes(item.type)) {
        return false;
      }
      if (item.date === selectedTimelineDate) return true;
      if (!item.date && selectedTimelineDate === todayIso) return true;
      if (item.createdAt) {
        const d = new Date(item.createdAt);
        const localIso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        if (localIso === selectedTimelineDate) return true;
      }
      return false;
    });

    return [...processedUserItems].sort((a, b) => {
      const getTimestamp = (item: any): number | null => {
        if (item.createdAt) {
          const t = new Date(item.createdAt).getTime();
          if (!isNaN(t)) return t;
        }
        if (item.id && typeof item.id === "string") {
          const match = item.id.match(/\d{10,}/);
          if (match) {
            const t = parseInt(match[0], 10);
            if (!isNaN(t)) return t;
          }
        }
        return null;
      };

      const tsA = getTimestamp(a);
      const tsB = getTimestamp(b);

      if (tsA !== null && tsB !== null) {
        return tsB - tsA;
      }
      if (tsA !== null && tsB === null) return -1;
      if (tsA === null && tsB !== null) return 1;

      return parseTimeToMinutes(b.time) - parseTimeToMinutes(a.time);
    });
  }, [userTimelineItems, selectedTimelineDate, todayIso]);

  const dailyNutritionStats = useMemo(() => {
    const consumedMeals = userTimelineItems.filter(
      (item) =>
        item.consumed &&
        (item.type === "meal" || item.isAiSuggestion || item.type === "ai_suggestion") &&
        (item.date === selectedTimelineDate || (!item.date && selectedTimelineDate === todayIso)),
    );
    if (consumedMeals.length === 0) {
      return {
        totalCalories: 0,
        proteinGrams: 0,
        carbsGrams: 0,
        fatGrams: 0,
        fiberGrams: 0,
      };
    }
    const cals = consumedMeals.reduce((acc, m) => acc + (m.calories || m.kcal || 0), 0);
    const protein = consumedMeals.reduce((acc, m) => acc + (m.protein || 0), 0);
    const carbs = consumedMeals.reduce((acc, m) => acc + (m.carbs || m.carbohydrates || 0), 0);
    const fat = consumedMeals.reduce((acc, m) => acc + (m.fat || 0), 0);
    const fiber = consumedMeals.reduce((acc, m) => acc + (m.fiber || 0), 0);

    return {
      totalCalories: Math.round(cals),
      proteinGrams: Math.round(protein),
      carbsGrams: Math.round(carbs),
      fatGrams: Math.round(fat),
      fiberGrams: Math.round(fiber),
    };
  }, [userTimelineItems, selectedTimelineDate, todayIso]);

  const dayActivityStats = useMemo(() => {
    const dayActivities = userTimelineItems.filter(
      (item) =>
        (item.type === "workout" || item.type === "activity") &&
        (item.date === selectedTimelineDate || (!item.date && selectedTimelineDate === todayIso)),
    );
    const dayMinutes = dayActivities.reduce(
      (acc, item) => acc + (item.durationMinutes || item.duration || 0),
      0,
    );
    const dayPoints = dayActivities.reduce(
      (acc, item) => acc + (item.metPoints || Math.round((item.duration || 0) * 3.7) || 0),
      0,
    );
    return {
      dayMinutes,
      dayPoints,
    };
  }, [userTimelineItems, selectedTimelineDate, todayIso]);

  const activityStreakStats = useMemo(() => {
    const weights = [1, 2, 3, 4, 5, 6, 7];
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    const weightedSum = activityData.reduce(
      (acc, curr, idx) => acc + curr.puntos * (weights[idx] || 1),
      0,
    );
    const weighted7DayAvg = Math.round(weightedSum / totalWeight);

    let streak = 0;
    for (let i = activityData.length - 1; i >= 0; i--) {
      if (activityData[i].puntos >= weighted7DayAvg) {
        streak++;
      } else {
        break;
      }
    }

    const todayPts = activityData[activityData.length - 1]?.puntos || 168;

    return {
      streakDays: streak > 0 ? streak : 5,
      weighted7DayAvg,
      todayPoints: todayPts,
      todayMinutes: Math.round(todayPts / 3.7) || 45,
      todayMets: 6.5,
    };
  }, [activityData]);

  const completedDays = useMemo(() => {
    const isActivityMet = activityStreakStats.weighted7DayAvg >= 150;
    if (!isActivityMet) return [];

    const uniqueDates = new Set<string>();
    uniqueDates.add(todayIso);
    userTimelineItems.forEach((item) => {
      if (item?.date) uniqueDates.add(item.date);
    });

    const completed: string[] = [];

    uniqueDates.forEach((dateStr) => {
      const dayMeals = userTimelineItems.filter(
        (item) =>
          item &&
          item.consumed &&
          (item.type === "meal" || item.isAiSuggestion || item.type === "ai_suggestion") &&
          (item.date === dateStr || (!item.date && dateStr === todayIso)),
      );
      if (dayMeals.length === 0) return;

      const dayCals = dayMeals.reduce((s, m) => s + (m.calories || m.kcal || 0), 0);
      const dayProt = dayMeals.reduce((s, m) => s + (m.protein || 0), 0);

      const isNutritionMet =
        dayCals >= 1400 ||
        dayProt >= 85 ||
        (dayMeals.length >= 2 && dayCals >= 1000);

      if (isNutritionMet) {
        completed.push(dateStr);
      }
    });

    return completed;
  }, [userTimelineItems, activityStreakStats.weighted7DayAvg, todayIso]);

  const userProfile = useMemo(() => {
    if (typeof window === "undefined") return { goal: "en_forma" as const, weight: 72 };
    try {
      const saved = localStorage.getItem("shakerfy_user_profile_edit");
      if (saved) {
        const parsed = JSON.parse(saved);
        const goal = parsed.goal || "en_forma";
        const weight = Number(parsed.weight) || 72;
        return { goal, weight };
      }
    } catch (_) {}
    return { goal: "en_forma" as const, weight: 72 };
  }, []);

  const dayNutritionMap = useMemo(() => {
    const map: Record<string, { calories: number; protein: number }> = {};
    userTimelineItems.forEach((item) => {
      if (
        item &&
        item.consumed &&
        (item.type === "meal" || item.isAiSuggestion || item.type === "ai_suggestion")
      ) {
        const itemDate = item.date || todayIso;
        if (!map[itemDate]) {
          map[itemDate] = { calories: 0, protein: 0 };
        }
        map[itemDate].calories += item.calories || item.kcal || 0;
        map[itemDate].protein += item.protein || 0;
      }
    });
    return map;
  }, [userTimelineItems, todayIso]);

  return {
    todayIso,
    selectedTimelineDate,
    setSelectedTimelineDate,
    activityData,
    setActivityData,
    userTimelineItems,
    setUserTimelineItems,
    timelineItems,
    dailyNutritionStats,
    dayActivityStats,
    activityStreakStats,
    completedDays,
    userProfile,
    dayNutritionMap,
    editingTimelineItem,
    setEditingTimelineItem,
    expandedCardInsights,
    toggleCardInsights,
    expandedMealCta,
    toggleMealCta,
    loggedMicroActions,
    setLoggedMicroActions,
    doubleTapAnimationId,
    handleLogArmstrongLevel,
    handleUndoMicroAction,
    handleAddAccompanimentToMeal,
    handleDeleteTimelineItem,
    handleToggleSaveTimelineItem,
    handleConsumeAiSuggestionOption,
    handleAiSuggestionLike,
    handleAiSuggestionDislike,
    handleMealFeedback,
    handleDoubleTapLike,
    handleSaveEditedTimelineItem,
    handleToggleMealConsumed,
    handleSwapIngredient,
  };
}
