import React from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SalaItem, StaffMember, GymClassItem } from "./types";

export interface ClassFilterBarProps {
  salasList: SalaItem[];
  staffList: StaffMember[];
  classesList: GymClassItem[];
  selectedCalendarSalaId: string;
  setSelectedCalendarSalaId: (id: string) => void;
  selectedFilterCoachId: string;
  setSelectedFilterCoachId: (id: string) => void;
  selectedFilterActivity: string;
  setSelectedFilterActivity: (act: string) => void;
}

export function ClassFilterBar({
  salasList,
  staffList,
  classesList,
  selectedCalendarSalaId,
  setSelectedCalendarSalaId,
  selectedFilterCoachId,
  setSelectedFilterCoachId,
  selectedFilterActivity,
  setSelectedFilterActivity,
}: ClassFilterBarProps) {
  const hasActiveFilters = Boolean(
    selectedCalendarSalaId || selectedFilterCoachId || selectedFilterActivity,
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-card border border-border rounded-3xl shadow-xs mt-6 mb-6">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-primary shrink-0" />
        <span className="font-bold text-xs uppercase tracking-wider text-muted-foreground/90">
          Filtrar clases:
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <Select
          value={selectedCalendarSalaId || "all"}
          onValueChange={(val) =>
            setSelectedCalendarSalaId(val === "all" ? "" : val)
          }
        >
          <SelectTrigger className="h-8 rounded-xl border border-border bg-background px-3 text-xs text-foreground font-bold w-[160px]">
            <SelectValue placeholder="Todas las salas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las salas</SelectItem>
            {salasList.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedFilterCoachId || "all"}
          onValueChange={(val) =>
            setSelectedFilterCoachId(val === "all" ? "" : val)
          }
        >
          <SelectTrigger className="h-8 rounded-xl border border-border bg-background px-3 text-xs text-foreground font-bold w-[170px]">
            <SelectValue placeholder="Todos los profesores" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los profesores</SelectItem>
            {staffList.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedFilterActivity || "all"}
          onValueChange={(val) =>
            setSelectedFilterActivity(val === "all" ? "" : val)
          }
        >
          <SelectTrigger className="h-8 rounded-xl border border-border bg-background px-3 text-xs text-foreground font-bold w-[170px]">
            <SelectValue placeholder="Todas las actividades" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las actividades</SelectItem>
            {Array.from(new Set(classesList.map((c) => c.name)))
              .sort()
              .map((actName) => (
                <SelectItem key={actName} value={actName}>
                  {actName}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedCalendarSalaId("");
              setSelectedFilterCoachId("");
              setSelectedFilterActivity("");
            }}
            className="h-8 px-3 text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl transition border border-rose-500/20 shrink-0 cursor-pointer"
          >
            Limpiar filtros
          </Button>
        )}
      </div>
    </div>
  );
}
