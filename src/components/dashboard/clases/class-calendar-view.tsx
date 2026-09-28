import React from "react";
import { GymClassItem, StaffMember } from "./types";

interface ClassCalendarViewProps {
  classesList: GymClassItem[];
  filteredClasses: GymClassItem[];
  currentWeekOffset: number;
  staffList: StaffMember[];
  selectedClassId: string | null;
  onSelectClass: (classId: string) => void;
}

export function ClassCalendarView({
  classesList,
  filteredClasses,
  currentWeekOffset,
  staffList,
  selectedClassId,
  onSelectClass,
}: ClassCalendarViewProps) {
  const hoursList = Array.from(
    new Set(
      classesList
        .filter((c) => (c.weekOffset || 0) === currentWeekOffset)
        .map((c) => c.time.split("-")[0].trim()),
    ),
  ).sort();

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-border bg-card p-6 space-y-6 overflow-x-auto pb-4 transition-all duration-300 hover:border-foreground/30 hover:shadow-lg shadow-xs">
        <div className="min-w-[680px] space-y-6">
          {/* Grid Header (Days of the week) */}
          <div className="grid grid-cols-8 gap-3 text-center select-none font-bold text-xs text-muted-foreground border-b border-border/40 pb-3">
            <div /> {/* Hour labels column spacer */}
            <div>LUN</div>
            <div>MAR</div>
            <div>MIÉ</div>
            <div>JUE</div>
            <div>VIE</div>
            <div>SÁB</div>
            <div>DOM</div>
          </div>

          {/* Weekly Calendar Grid Rows */}
          <div className="space-y-3">
            {hoursList.map((hour) => (
              <div key={hour} className="grid grid-cols-8 gap-3 items-center">
                {/* Hour Label */}
                <div className="text-right text-xs font-bold text-muted-foreground pr-1">
                  {hour}
                </div>

                {/* Day Cells */}
                {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
                  const classesInSlot = filteredClasses.filter((c) => {
                    const startHour = c.time.split("-")[0].trim();
                    return c.day === dayIndex && startHour === hour;
                  });

                  if (classesInSlot.length === 0) {
                    return (
                      <div
                        key={`empty-${hour}-${dayIndex}`}
                        className="border border-dashed border-border/60 rounded-xl h-[72px] bg-transparent"
                      />
                    );
                  }

                  const c = classesInSlot[0];
                  const coach = staffList.find((s) => s.id === c.staffId);
                  const instructorName = coach
                    ? `${coach.name.split(" ")[0][0]}. ${coach.name.split(" ")[1] || ""}`
                    : "Sin asignar";
                  const isFull = c.booked >= c.capacity;
                  const isSelected = selectedClassId === c.id;

                  return (
                    <div
                      key={`class-${c.id}-${hour}-${dayIndex}`}
                      onClick={() => onSelectClass(c.id)}
                      className={`border rounded-xl p-2.5 h-[72px] flex flex-col justify-between text-left cursor-pointer transition-all ${
                        c.status === "cancelada"
                          ? "bg-destructive/10 border-destructive/20 text-destructive/80 opacity-60"
                          : isFull
                            ? "bg-destructive/10 border-destructive/30 text-destructive"
                            : "bg-card border-border text-foreground hover:border-muted-foreground/30 hover:bg-secondary/10"
                      } ${
                        isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-card" : ""
                      }`}
                    >
                      <div className="min-w-0">
                        <h4
                          className={`font-bold text-[11px] truncate leading-tight ${
                            c.status === "cancelada"
                              ? "text-destructive line-through"
                              : "text-foreground"
                          }`}
                        >
                          {c.name}
                        </h4>
                        <p className="text-[9.5px] text-muted-foreground truncate mt-0.5">
                          {instructorName}
                        </p>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-semibold">
                        {c.status === "cancelada" ? "Cancelada" : `${c.booked}/${c.capacity}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}

            {hoursList.length === 0 && (
              <p className="text-xs text-muted-foreground italic py-8 text-center">
                No hay clases programadas para esta semana.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
