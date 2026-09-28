import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { BioStateCard } from "@/components/bio-state-card";
import {
  useDiarioTimeline,
  NutritionProBanner,
  TimelineFeed,
  DiarioActionModals,
} from "./diario";

export function DiarioTab() {
  const navigate = useNavigate();
  const timeline = useDiarioTimeline();

  const [isFabOpen, setIsFabOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string>("none");
  const [activityModalMode, setActivityModalMode] = useState<"manual" | "timer">("manual");
  const [showStreakInfo, setShowStreakInfo] = useState(false);
  const [isBreathingDrawerOpen, setIsBreathingDrawerOpen] = useState(false);
  const [breathingMealContext, setBreathingMealContext] = useState<string | undefined>(undefined);
  const [breathingOriginMealId, setBreathingOriginMealId] = useState<string | undefined>(undefined);

  const handleBreathingComplete = () => {
    if (breathingOriginMealId) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
      timeline.setLoggedMicroActions((prev: any) => ({
        ...prev,
        [breathingOriginMealId]: { type: "vagal_pause", itemId: `pause-${Date.now()}`, time: timeStr },
      }));
    }
    toast.success("✓ Pausa completada • Tu cuerpo está en calma");
  };

  const handleSaveActivity = (
    activityName: string,
    duration: number,
    intensity: "low" | "med" | "high",
    metPoints: number,
  ) => {
    const dayLabels = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const todayLabel = dayLabels[new Date().getDay()];

    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(25);
      } catch (_) {}
    }

    // 1. Update activityData points
    timeline.setActivityData((prev) =>
      prev.map((item) =>
        item.day === todayLabel ? { ...item, puntos: item.puntos + metPoints } : item,
      ),
    );

    const intensityName =
      intensity === "low" ? "Baja" : intensity === "med" ? "Media" : "Alta";

    // 2. Append timeline log
    const newActId = `custom-act-${Date.now()}`;
    const now = new Date();
    const newAct = {
      id: newActId,
      createdAt: now.toISOString(),
      date: timeline.selectedTimelineDate || timeline.todayIso,
      time: now.toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      title: activityName,
      activityName: activityName,
      duration: duration,
      intensity: intensity,
      intensityLabel: intensityName,
      metPoints: metPoints,
      subtitle: "Registro de Actividad",
      type: "activity",
      img: null,
      kcal: 0,
      tag: `${duration} min • ${intensityName}`,
      coachFeedback: `Registraste ${duration} min de ${activityName} (intensidad ${intensityName}). ¡Sumaste +${metPoints} Pts MET a tu promedio de 7 días!`,
    };
    timeline.setUserTimelineItems((prev) => [newAct, ...prev]);

    toast.success(`✓ ${activityName} registrada (+${metPoints} Pts MET)`, {
      description: `${duration} min • Intensidad ${intensityName} sumados a tu promedio de 7 días.`,
      action: {
        label: "Deshacer",
        onClick: () => {
          if (typeof navigator !== "undefined" && navigator.vibrate) {
            try {
              navigator.vibrate([15, 30]);
            } catch (_) {}
          }
          timeline.setUserTimelineItems((prev) => prev.filter((it) => it.id !== newActId));
          timeline.setActivityData((prev) =>
            prev.map((item) =>
              item.day === todayLabel
                ? { ...item, puntos: Math.max(0, item.puntos - metPoints) }
                : item,
            ),
          );
          toast.info(`Registro de "${activityName}" deshecho`);
        },
      },
      duration: 5000,
    });
  };

  const handleSaveHydration = (level: number, label: string, feedback: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
    const dateStr = timeline.selectedTimelineDate || timeline.todayIso;

    const newHydrationItem = {
      id: `hydration-${Date.now()}`,
      createdAt: now.toISOString(),
      type: "hydration",
      time: timeStr,
      date: dateStr,
      title: "Registro de Hidratación",
      subtitle: "Chequeo Matutino / Hidratación",
      desc: label
        .replace(/\s*\(Hidratación Saludable\)/gi, "")
        .replace(/\s*\(Armstrong\)/gi, "")
        .trim(),
      level: level,
      coachFeedback: `💧 Consejo Fisiológico: ${feedback}`,
      tag: `Nivel ${level}`,
    };

    timeline.setUserTimelineItems((prev) => [newHydrationItem, ...prev]);
    toast.success(`✓ Hidratación registrada: Nivel ${level}`);
  };

  const handleCheckinSuccess = (data: any) => {
    setActiveModal("none");
    const now = new Date();
    const timeStr = now.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
    const dateStr = now.toISOString().split("T")[0];

    const newCheckinItem = {
      id: `checkin-${Date.now()}`,
      createdAt: now.toISOString(),
      type: "workout",
      time: timeStr,
      date: dateStr,
      title: data.className || "Check-in en Club",
      subtitle: data.club,
      desc: `Acceso validado en ${data.club} • ${data.durationMinutes || 45} min`,
      coachFeedback: `✓ Check-in verificado en ${data.club}. ¡Excelente sesión!`,
      tag: "Check-in Verificado",
    };

    timeline.setUserTimelineItems((prev) => [newCheckinItem, ...prev]);
    toast.success(`✓ Acceso validado en ${data.club}`);
  };

  return (
    <div className="w-full max-w-full pb-20 transition-transform duration-300">
      {/* MAIN CENTERED CONTENT CONTAINER FOR AI COACH TIMELINE */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-2">
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Current State Check-in Widget */}
          <div>
            <BioStateCard
              selectedDate={timeline.selectedTimelineDate}
              onSelectDate={(dateStr) => timeline.setSelectedTimelineDate(dateStr)}
              completedDays={timeline.completedDays}
              dayNutritionMap={timeline.dayNutritionMap}
              totalCalories={timeline.dailyNutritionStats.totalCalories}
              proteinGrams={timeline.dailyNutritionStats.proteinGrams}
              carbsGrams={timeline.dailyNutritionStats.carbsGrams}
              fatGrams={timeline.dailyNutritionStats.fatGrams}
              fiberGrams={timeline.dailyNutritionStats.fiberGrams}
              activityPoints={
                timeline.dayActivityStats.dayPoints > 0
                  ? timeline.dayActivityStats.dayPoints
                  : timeline.selectedTimelineDate === timeline.todayIso
                    ? timeline.activityStreakStats.todayPoints
                    : 0
              }
              activityMinutes={
                timeline.dayActivityStats.dayMinutes > 0
                  ? timeline.dayActivityStats.dayMinutes
                  : timeline.selectedTimelineDate === timeline.todayIso
                    ? timeline.activityStreakStats.todayMinutes
                    : 0
              }
              weeklyAveragePoints={timeline.activityStreakStats.weighted7DayAvg}
              streakDays={timeline.activityStreakStats.streakDays}
              userGoal={timeline.userProfile.goal}
              userWeight={timeline.userProfile.weight}
            />
          </div>

          {/* Banner sutil a Nutrition Intelligence Suite */}
          <NutritionProBanner onClick={() => navigate({ to: "/nutrition-intelligence" })} />

          {/* Feed de la Línea de Tiempo */}
          <TimelineFeed
            timelineItems={timeline.timelineItems}
            expandedMealInsights={timeline.expandedCardInsights}
            toggleMealInsights={timeline.toggleCardInsights}
            expandedMealCta={timeline.expandedMealCta}
            toggleMealCta={timeline.toggleMealCta}
            loggedMicroActions={timeline.loggedMicroActions}
            setLoggedMicroActions={timeline.setLoggedMicroActions}
            doubleTapAnimationId={timeline.doubleTapAnimationId}
            onToggleMealConsumed={timeline.handleToggleMealConsumed}
            onConsumeOption={timeline.handleConsumeAiSuggestionOption}
            onToggleSave={timeline.handleToggleSaveTimelineItem}
            onDelete={timeline.handleDeleteTimelineItem}
            onFeedback={timeline.handleMealFeedback}
            onSwapIngredient={timeline.handleSwapIngredient}
            onEdit={timeline.setEditingTimelineItem}
            onAddAccompaniment={timeline.handleAddAccompanimentToMeal}
            onDoubleTapLike={timeline.handleDoubleTapLike}
          />
        </div>
      </div>

      {/* FAB & Action Modals (Streak, QR, Armstrong, Breathing, Activity, Edit) */}
      <DiarioActionModals
        isFabOpen={isFabOpen}
        setIsFabOpen={setIsFabOpen}
        activeModal={activeModal}
        setActiveModal={setActiveModal}
        activityModalMode={activityModalMode}
        setActivityModalMode={setActivityModalMode}
        showStreakInfo={showStreakInfo}
        setShowStreakInfo={setShowStreakInfo}
        editingTimelineItem={timeline.editingTimelineItem}
        setEditingTimelineItem={timeline.setEditingTimelineItem}
        isBreathingDrawerOpen={isBreathingDrawerOpen}
        setIsBreathingDrawerOpen={setIsBreathingDrawerOpen}
        breathingMealContext={breathingMealContext}
        onBreathingComplete={handleBreathingComplete}
        activityStreakStats={timeline.activityStreakStats}
        onNavigateToScan={() => navigate({ to: "/scan" })}
        onSaveEditedTimelineItem={timeline.handleSaveEditedTimelineItem}
        onToggleSaveTimelineItem={timeline.handleToggleSaveTimelineItem}
        onSaveActivity={handleSaveActivity}
        onSaveHydration={handleSaveHydration}
        onCheckinSuccess={handleCheckinSuccess}
      />
    </div>
  );
}