import React from "react";
import { Camera, Timer, Activity, Plus, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { STREAK_FAQ, MET_ACTIVITIES } from "@/lib/met-activities";
import { QRScannerModal } from "../qr-scanner-modal";
import { VagalBreathingDrawer } from "@/components/vagal-breathing-drawer";
import {
  HydrationArmstrongDrawer,
  ActivityLogModal,
  EditTimelineItemModal,
} from "../timeline-modals";

export interface DiarioActionModalsProps {
  isFabOpen: boolean;
  setIsFabOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeModal: string;
  setActiveModal: React.Dispatch<React.SetStateAction<string>>;
  activityModalMode: "manual" | "timer";
  setActivityModalMode: React.Dispatch<React.SetStateAction<"manual" | "timer">>;
  showStreakInfo: boolean;
  setShowStreakInfo: React.Dispatch<React.SetStateAction<boolean>>;
  editingTimelineItem: any;
  setEditingTimelineItem: React.Dispatch<React.SetStateAction<any>>;
  isBreathingDrawerOpen: boolean;
  setIsBreathingDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  breathingMealContext?: string;
  onBreathingComplete: () => void;
  activityStreakStats: { weighted7DayAvg: number };
  onNavigateToScan: () => void;
  onSaveEditedTimelineItem: (item: any) => void;
  onToggleSaveTimelineItem: (id: string) => void;
  onSaveActivity: (
    activityName: string,
    duration: number,
    intensity: "low" | "med" | "high",
    metPoints: number,
  ) => void;
  onSaveHydration: (level: number, label: string, feedback: string) => void;
  onCheckinSuccess: (data: any) => void;
}

export function DiarioActionModals({
  isFabOpen,
  setIsFabOpen,
  activeModal,
  setActiveModal,
  activityModalMode,
  setActivityModalMode,
  showStreakInfo,
  setShowStreakInfo,
  editingTimelineItem,
  setEditingTimelineItem,
  isBreathingDrawerOpen,
  setIsBreathingDrawerOpen,
  breathingMealContext,
  onBreathingComplete,
  activityStreakStats,
  onNavigateToScan,
  onSaveEditedTimelineItem,
  onToggleSaveTimelineItem,
  onSaveActivity,
  onSaveHydration,
  onCheckinSuccess,
}: DiarioActionModalsProps) {
  return (
    <>
      {/* FAB Overlay Blur */}
      {isFabOpen && (
        <div
          className="fixed inset-0 bg-background/60 backdrop-blur-md z-40 animate-in fade-in duration-300"
          onClick={() => setIsFabOpen(false)}
        />
      )}

      {/* FAB Menu */}
      <div className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-50 flex flex-col items-end gap-3">
        {isFabOpen && (
          <div className="bg-card/95 border border-border/80 rounded-3xl p-2 sm:p-2.5 shadow-2xl min-w-[260px] sm:min-w-[280px] max-w-[310px] animate-in slide-in-from-bottom-4 fade-in duration-200 space-y-0.5 backdrop-blur-xl">
            <button
              onClick={() => {
                setIsFabOpen(false);
                onNavigateToScan();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-secondary/70 transition-colors text-left group cursor-pointer"
            >
              <Camera className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform shrink-0" />
              <span className="text-xs font-semibold text-foreground flex-1">
                Escanear comida
              </span>
            </button>

            <button
              onClick={() => {
                setIsFabOpen(false);
                setActivityModalMode("timer");
                setActiveModal("registrar-actividad");
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-secondary/70 transition-colors text-left group cursor-pointer"
            >
              <Timer className="w-4 h-4 text-sky-500 group-hover:scale-110 transition-transform shrink-0" />
              <span className="text-xs font-semibold text-foreground flex-1">
                Registrar entrenamiento
              </span>
            </button>

            <button
              onClick={() => {
                setIsFabOpen(false);
                setActivityModalMode("manual");
                setActiveModal("registrar-actividad");
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-secondary/70 transition-colors text-left group cursor-pointer"
            >
              <Activity className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform shrink-0" />
              <span className="text-xs font-semibold text-foreground flex-1">
                Registrar actividad
              </span>
            </button>
          </div>
        )}

        <button
          onClick={() => setIsFabOpen(!isFabOpen)}
          className="w-14 h-14 rounded-full bg-foreground text-background flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
          aria-label="Abrir menú de acciones"
        >
          <Plus
            className={`w-6 h-6 transition-transform duration-300 ${isFabOpen ? "rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* Streak Info Modal */}
      {showStreakInfo && (
        <Dialog open onOpenChange={() => setShowStreakInfo(false)}>
          <DialogContent className="sm:max-w-md rounded-3xl p-6 border border-border bg-card max-h-[85vh] overflow-y-auto custom-scrollbar">
            <DialogHeader className="pb-3 border-b border-border/40 text-left">
              <DialogTitle className="text-base font-bold flex items-center gap-2 text-foreground">
                <Flame className="w-5 h-5 text-amber-500 fill-amber-500 animate-pulse" />
                <span>Racha de Actividad — 12 Días</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Promedio ponderado de 7 días calculado según las pautas de actividad física diaria OMS & minutos MET.
              </DialogDescription>
            </DialogHeader>

            <div className="py-3 space-y-4 text-left">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-3 bg-secondary/50 rounded-2xl border border-border/40">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-0.5">
                    Promedio 7 Días
                  </span>
                  <span className="text-base font-black text-amber-500">
                    {activityStreakStats.weighted7DayAvg} Pts MET
                  </span>
                </div>
                <div className="p-3 bg-secondary/50 rounded-2xl border border-border/40">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-0.5">
                    Meta Diaria OMS
                  </span>
                  <span className="text-base font-black text-emerald-500">150 Pts</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Detalles & Funcionamiento
                </h4>
                {STREAK_FAQ.map((faq, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-secondary/30 border border-border/40 space-y-1"
                  >
                    <span className="text-xs font-bold text-foreground block">{faq.q}</span>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-border/40 flex justify-end">
              <Button
                onClick={() => setShowStreakInfo(false)}
                className="rounded-xl px-5 py-2 font-bold text-xs bg-foreground text-background hover:opacity-90 cursor-pointer"
              >
                Entendido
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Check-in QR Scanner Modal */}
      {activeModal === "check-in" && (
        <QRScannerModal
          onClose={() => setActiveModal("none")}
          onScanSuccess={onCheckinSuccess}
        />
      )}

      {/* Hydration Armstrong Drawer */}
      <HydrationArmstrongDrawer
        open={activeModal === "hydration-armstrong"}
        onClose={() => setActiveModal("none")}
        onSave={onSaveHydration}
      />

      {/* Vagal Breathing Drawer */}
      <VagalBreathingDrawer
        open={isBreathingDrawerOpen}
        onOpenChange={setIsBreathingDrawerOpen}
        contextTitle={breathingMealContext}
        onComplete={onBreathingComplete}
      />

      {/* Registrar Actividad / Entrenamiento Modal */}
      {activeModal === "registrar-actividad" && (
        <ActivityLogModal
          mode={activityModalMode}
          onClose={() => setActiveModal("none")}
          onSave={onSaveActivity}
          activities={MET_ACTIVITIES}
        />
      )}

      {/* Modal Editar Registro de Timeline */}
      {editingTimelineItem && (
        <EditTimelineItemModal
          item={editingTimelineItem}
          onClose={() => setEditingTimelineItem(null)}
          onSave={onSaveEditedTimelineItem}
          onToggleSave={onToggleSaveTimelineItem}
        />
      )}
    </>
  );
}
