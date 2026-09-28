import React from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ClassStatsToolbarProps {
  currentWeekOffset: number;
  setCurrentWeekOffset: React.Dispatch<React.SetStateAction<number>>;
  viewMode: "list" | "calendar";
  setViewMode: (mode: "list" | "calendar") => void;
  canManageClasses: boolean;
  onOpenCreateClass: () => void;
  stats: {
    avgOccupancy: number;
    totalBooked: number;
    fullClasses: number;
  };
}

export function ClassStatsToolbar({
  currentWeekOffset,
  setCurrentWeekOffset,
  viewMode,
  setViewMode,
  canManageClasses,
  onOpenCreateClass,
  stats,
}: ClassStatsToolbarProps) {
  return (
    <>
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            Calendario de Clases
          </h2>
          <p className="text-sm text-muted-foreground">
            Clases planificadas vinculando los entrenadores de tu Staff.
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Week Pagination */}
          <div className="flex items-center rounded-xl bg-secondary p-1 border border-border/50 shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg text-foreground hover:bg-background disabled:opacity-30 cursor-pointer"
              onClick={() =>
                setCurrentWeekOffset((prev) => Math.max(0, prev - 1))
              }
              disabled={currentWeekOffset === 0}
              title="Semana anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs font-bold px-2 text-foreground/80 min-w-[70px] text-center select-none">
              Semana {currentWeekOffset + 1}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg text-foreground hover:bg-background cursor-pointer"
              onClick={() => setCurrentWeekOffset((prev) => prev + 1)}
              title="Semana siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* View Switcher */}
          <div className="flex rounded-xl bg-secondary p-1 border border-border/50 shrink-0">
            <Button
              type="button"
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              className={`h-7 text-xs font-semibold rounded-lg cursor-pointer ${
                viewMode === "list"
                  ? "bg-background text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setViewMode("list")}
            >
              Lista de Hoy
            </Button>
            <Button
              type="button"
              variant={viewMode === "calendar" ? "secondary" : "ghost"}
              size="sm"
              className={`h-7 text-xs font-semibold rounded-lg cursor-pointer ${
                viewMode === "calendar"
                  ? "bg-background text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setViewMode("calendar")}
            >
              Vista Semanal
            </Button>
          </div>

          {canManageClasses && (
            <Button
              size="sm"
              className="rounded-full bg-black hover:bg-black/90 text-white dark:bg-white dark:hover:bg-white/90 dark:text-black font-bold gap-1.5 px-4 cursor-pointer"
              onClick={onOpenCreateClass}
            >
              <Plus className="h-4 w-4" /> Crear clase
            </Button>
          )}
        </div>
      </div>

      {/* Quick Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch mt-6">
        <div className="group rounded-3xl border border-border bg-card p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg shadow-xs h-full">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
            Ocupación Hoy
          </span>
          <span className="text-2xl font-black text-foreground mt-2 block">
            {stats.avgOccupancy}%
          </span>
        </div>
        <div className="group rounded-3xl border border-border bg-card p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg shadow-xs h-full">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
            Reservas Activas
          </span>
          <span className="text-2xl font-black text-foreground mt-2 block">
            {stats.totalBooked} alumnos
          </span>
        </div>
        <div className="group rounded-3xl border border-border bg-card p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg shadow-xs h-full">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
            Clases Llenas
          </span>
          <span className="text-2xl font-black text-foreground mt-2 block">
            {stats.fullClasses} completadas
          </span>
        </div>
      </div>
    </>
  );
}
