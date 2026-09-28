import React, { useState, useMemo } from "react";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Gym } from "@/lib/gyms";

export const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

interface GymScheduleSectionProps {
  classes: Gym["classes"];
  selectedDay: number;
  onSelectDay: (day: number) => void;
}

export function GymScheduleSection({
  classes,
  selectedDay,
  onSelectDay,
}: GymScheduleSectionProps) {
  const [disciplineFilter, setDisciplineFilter] = useState("Todos");

  const disciplines = useMemo(() => {
    const discSet = new Set<string>();
    classes.forEach((c) => {
      discSet.add(c.name);
    });
    return ["Todos", ...Array.from(discSet)];
  }, [classes]);

  const classesByBranchAndDay = useMemo(() => {
    let list = classes.filter((c) => c.day === selectedDay);
    if (disciplineFilter !== "Todos") {
      list = list.filter((c) => c.name === disciplineFilter);
    }
    return list.sort((a, b) => a.time.localeCompare(b.time));
  }, [classes, selectedDay, disciplineFilter]);

  return (
    <section className="mt-16">
      <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Clases de la semana</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Filtrá por día y reservá tu lugar.
          </p>
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {DAYS.map((d, i) => (
            <button
              key={d}
              onClick={() => onSelectDay(i)}
              className={`min-w-[64px] rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                selectedDay === i
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-muted-foreground hover:border-foreground/40 hover:text-foreground"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Discipline/Activity Filters */}
      <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1 border-t border-border/40 pt-3">
        {disciplines.map((d) => (
          <button
            key={d}
            onClick={() => setDisciplineFilter(d)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
              disciplineFilter === d
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border">
        {classesByBranchAndDay.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No hay clases programadas este día.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {classesByBranchAndDay.map((c, i) => {
              const available = c.capacity - c.booked;
              return (
                <li
                  key={i}
                  className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-16 text-sm font-semibold tabular-nums">{c.time}</div>
                    <div>
                      <div className="text-[15px] font-semibold tracking-tight">{c.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {c.instructor} · {c.duration} min
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      {available > 0 ? `${available} lugares` : "Completa"}
                    </div>
                    <Button
                      size="sm"
                      variant={available > 0 ? "default" : "outline"}
                      disabled={available === 0}
                      className="rounded-full"
                    >
                      {available > 0 ? "Reservar" : "Lista de espera"}
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
