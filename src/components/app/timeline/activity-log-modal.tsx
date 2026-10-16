import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { MetActivity } from "@/lib/met-activities";
import { WorkoutLiveModal } from "./workout-live-modal";
import { ActivityManualModal } from "./activity-manual-modal";

export interface ActivityLogModalProps {
  mode?: "manual" | "timer";
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

export function ActivityLogModal({
  mode = "manual",
  onClose,
  onSave,
  activities,
  userWeight = 70,
}: ActivityLogModalProps) {
  const isMobile = useIsMobile();
  const title =
    mode === "timer"
      ? "Registrar entrenamiento (Google Fit en vivo)"
      : "Registrar actividad (Google Fit manual)";

  const content =
    mode === "timer" ? (
      <WorkoutLiveModal
        onClose={onClose}
        onSave={onSave}
        activities={activities}
        userWeight={userWeight}
      />
    ) : (
      <ActivityManualModal
        onClose={onClose}
        onSave={onSave}
        activities={activities}
        userWeight={userWeight}
      />
    );

  // Mobile: Bottom Sheet / Drawer adaptativo (Regla 11 & Modelo Mental 1)
  if (isMobile) {
    return (
      <Drawer open onOpenChange={(open) => !open && onClose()}>
        <DrawerContent className="p-0 border-none bg-card max-w-lg mx-auto overflow-hidden rounded-t-[2.5rem]">
          <DrawerTitle className="sr-only">{title}</DrawerTitle>
          <DrawerDescription className="sr-only">
            Ventana para registrar ejercicio físico con la estructura de Google Fit
          </DrawerDescription>
          <div className="mx-auto w-12 h-1.5 rounded-full bg-muted-foreground/30 my-2 shrink-0" />
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop: Dialog centrado
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg p-0 border border-border bg-card shadow-2xl rounded-[2rem] overflow-hidden [&>button:last-child]:hidden">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">
          Ventana para registrar ejercicio físico con la estructura de Google Fit
        </DialogDescription>
        {content}
      </DialogContent>
    </Dialog>
  );
}
