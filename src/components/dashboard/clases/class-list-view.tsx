import React from "react";
import { DoorOpen } from "lucide-react";
import { GymClassItem, StaffMember, SalaItem, BlackoutDayItem } from "./types";

interface ClassListViewProps {
  classesForToday: GymClassItem[];
  salasList: SalaItem[];
  staffList: StaffMember[];
  activeBlackout?: BlackoutDayItem;
  selectedClassId: string | null;
  onSelectClass: (classId: string) => void;
}

export function ClassListView({
  classesForToday,
  salasList,
  staffList,
  activeBlackout,
  selectedClassId,
  onSelectClass,
}: ClassListViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full items-stretch">
      {/* Card 1: Schedule (Hoy) */}
      <div className="group rounded-3xl border border-border bg-card p-5 space-y-4 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg shadow-xs h-full flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border/40">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
              Clases Programadas (Hoy)
            </span>
            <span className="text-[10px] text-muted-foreground/70 font-semibold uppercase tracking-wider">
              {classesForToday.length} clases
            </span>
          </div>
          <div className="space-y-3">
            {classesForToday.map((c) => {
              const instructorName =
                staffList.find((s) => s.id === c.staffId)?.name || "Sin asignar";
              const salaName = salasList.find((s) => s.id === c.salaId)?.name || "Sin sala";
              return (
                <div
                  key={c.id}
                  onClick={() => onSelectClass(c.id)}
                  className={`p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between ${
                    c.status === "cancelada"
                      ? "border-destructive/30 bg-destructive/5 opacity-60 cursor-pointer"
                      : activeBlackout
                        ? "border-border opacity-50 cursor-not-allowed bg-secondary/10"
                        : selectedClassId === c.id
                          ? "border-primary bg-primary/5 cursor-pointer shadow-xs"
                          : "border-border/60 hover:border-border hover:bg-secondary/30 cursor-pointer"
                  }`}
                >
                  <div>
                    <h4
                      className={`font-bold text-sm ${
                        c.status === "cancelada" ? "text-destructive line-through" : ""
                      }`}
                    >
                      {c.name}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground flex-wrap">
                      <span>{instructorName}</span>
                      <span>·</span>
                      <span>{c.time} hs</span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded-lg text-[10px] font-bold">
                        <DoorOpen className="h-3 w-3 shrink-0" />
                        {salaName}
                      </span>
                    </div>
                  </div>
                  {c.status === "cancelada" ? (
                    <span className="text-[9px] bg-destructive/10 text-destructive px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                      Cancelada
                    </span>
                  ) : activeBlackout ? (
                    <span className="text-[9px] bg-destructive/10 text-destructive px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                      Suspendida
                    </span>
                  ) : (
                    <span className="text-xs font-semibold bg-secondary px-2.5 py-1 rounded-full text-foreground">
                      {c.booked} / {c.capacity} cupos
                    </span>
                  )}
                </div>
              );
            })}
            {classesForToday.length === 0 && (
              <p className="text-xs text-muted-foreground italic py-8 text-center">
                No hay clases programadas para el día de hoy.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Card 2: Resumen de Salas y Disponibilidad */}
      <div className="group rounded-3xl border border-border bg-card p-5 space-y-4 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg shadow-xs h-full flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border/40">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
              Estado de Salas y Espacios
            </span>
            <span className="text-[10px] text-muted-foreground/70 font-semibold uppercase tracking-wider">
              {salasList.length} espacios activos
            </span>
          </div>
          <div className="space-y-3">
            {salasList.map((sala) => {
              const currentClassInSala = classesForToday.find((c) => c.salaId === sala.id);
              return (
                <div
                  key={sala.id}
                  className="p-3.5 rounded-2xl border border-border/40 bg-secondary/20 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-foreground block">{sala.name}</span>
                    <span className="text-[10px] text-muted-foreground font-semibold">
                      Capacidad máxima: {sala.capacity || 20} personas
                    </span>
                  </div>
                  {currentClassInSala ? (
                    <span className="text-[10px] font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full border border-primary/20">
                      {currentClassInSala.name} ({currentClassInSala.time} hs)
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-muted-foreground bg-background px-2.5 py-1 rounded-full border border-border/40">
                      Disponible
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
