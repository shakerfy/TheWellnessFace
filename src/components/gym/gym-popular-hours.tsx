import React from "react";
import { type Gym } from "@/lib/gyms";

export const WEEKDAYS = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

export const HOURS = [
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
];

interface GymPopularHoursSectionProps {
  gym: Gym;
  selectedDay: number;
  onSelectDay: (day: number) => void;
}

export function GymPopularHoursSection({
  gym,
  selectedDay,
  onSelectDay,
}: GymPopularHoursSectionProps) {
  if (!gym.occupancyData) return null;

  return (
    <section className="mt-16 rounded-3xl border border-border bg-card p-6 hover:border-foreground/20 transition duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Horarios Populares</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Visitas estimadas basadas en la concurrencia histórica de los alumnos.
          </p>
        </div>

        {/* Day selection pills synced with classes calendar */}
        <div className="flex gap-1 overflow-x-auto pb-1">
          {WEEKDAYS.map((d, idx) => (
            <button
              key={d}
              onClick={() => onSelectDay(idx)}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold border transition ${
                selectedDay === idx
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
              }`}
            >
              {d.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {/* CSS Bar Chart */}
      <div className="mt-8">
        <div className="flex items-end justify-between h-28 gap-1.5 sm:gap-2.5 px-2 border-b border-border/85 pb-1">
          {HOURS.map((hour, idx) => {
            const percent = gym.occupancyData?.[WEEKDAYS[selectedDay]]?.[idx] || 0;
            const isToday =
              selectedDay === (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
            const isCurrentHour = isToday && parseInt(hour) === new Date().getHours();

            return (
              <div
                key={hour}
                className="flex-1 group relative h-full flex flex-col justify-end items-center"
              >
                {/* Tooltip on hover */}
                <span className="absolute -top-7 scale-0 group-hover:scale-100 transition-all bg-foreground text-background text-[10px] font-bold px-2 py-0.5 rounded z-10 whitespace-nowrap">
                  {percent}% concurrencia
                </span>

                {/* Bar container that occupies the available height for bars */}
                <div className="w-full h-[80%] flex items-end">
                  <div
                    className={`w-full rounded-t-sm transition-all duration-300 ${
                      isCurrentHour
                        ? "bg-primary animate-pulse"
                        : "bg-muted-foreground/35 group-hover:bg-muted-foreground/50"
                    }`}
                    style={{ height: `${percent}%` }}
                  />
                </div>

                {/* Label for hours (show key hours) */}
                <span className="text-[10px] font-mono text-muted-foreground tracking-tighter mt-1 block h-[20%] text-center">
                  {hour === "07" ||
                  hour === "11" ||
                  hour === "15" ||
                  hour === "18" ||
                  hour === "21"
                    ? `${hour}h`
                    : ""}
                </span>
              </div>
            );
          })}
        </div>

        {/* Concurrency Analysis Legend */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-muted-foreground gap-2">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-primary" />
            <span>Hora actual (Tiempo Real)</span>
            <div className="h-2.5 w-2.5 rounded bg-muted-foreground/35 ml-3" />
            <span>Promedio histórico</span>
          </div>

          <span className="font-semibold text-foreground">
            {(() => {
              const currentHourInt = new Date().getHours();
              const hourIndex = HOURS.indexOf(currentHourInt.toString().padStart(2, "0"));
              const activePercent =
                gym.occupancyData?.[WEEKDAYS[selectedDay]]?.[hourIndex] || 0;

              if (activePercent === 0) return "Cerrado a esta hora";
              if (activePercent < 35) return "Suele estar poco concurrido a esta hora.";
              if (activePercent < 75) return "Suele estar moderadamente concurrido.";
              return "Suele estar muy concurrido (Hora Pico).";
            })()}
          </span>
        </div>
      </div>
    </section>
  );
}
