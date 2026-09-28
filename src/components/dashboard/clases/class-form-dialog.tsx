import React from "react";
import { AlertCircle, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StaffMember, SalaItem } from "./types";

interface ClassFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingClassId: string | null;
  name: string;
  setName: (val: string) => void;
  staffId: string;
  setStaffId: (val: string) => void;
  startTime: string;
  setStartTime: (val: string) => void;
  endTime: string;
  setEndTime: (val: string) => void;
  salaId: string;
  setSalaId: (val: string) => void;
  day: number;
  setDay: (val: number) => void;
  creditsCost: string;
  setCreditsCost: (val: string) => void;
  customCapacity: number;
  setCustomCapacity: (val: number) => void;
  isRecurrent: boolean;
  setIsRecurrent: (val: boolean) => void;
  recurrentWeeks: number;
  setRecurrentWeeks: (val: number) => void;
  salasList: SalaItem[];
  staffForClassOptions: StaffMember[];
  filteredStaffForClass: StaffMember[];
  availabilityWarning: string | null;
  conflictWarning: string | null;
  onSubmit: (e: React.FormEvent) => void;
}

const TIME_SLOTS = [
  "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
  "19:00", "19:30", "20:00", "20:30", "21:00", "21:30",
  "22:00", "22:30",
];

const STANDARD_ACTIVITIES = [
  "CrossFit", "CrossFit WOD", "Entrenamiento Funcional", "Funcional HIIT",
  "Levantamiento Olímpico", "Powerlifting", "Calistenia", "Fuerza de Potencia",
  "Spinning", "Spinning Pro", "HIIT / Tabata", "Boxeo Recreativo",
  "Kickboxing", "Zumba", "Ritmos / Dance", "Yoga Ashtanga",
  "Yoga Vinyasa", "Yoga Hatha", "Pilates Reformer", "Pilates Mat",
  "Barré", "Estiramiento / Flex", "Meditación", "GAP",
  "AquaGym", "Running Club", "Tercera Edad Adaptada",
];

export function ClassFormDialog({
  open,
  onOpenChange,
  editingClassId,
  name,
  setName,
  staffId,
  setStaffId,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  salaId,
  setSalaId,
  day,
  setDay,
  creditsCost,
  setCreditsCost,
  customCapacity,
  setCustomCapacity,
  isRecurrent,
  setIsRecurrent,
  recurrentWeeks,
  setRecurrentWeeks,
  salasList,
  staffForClassOptions,
  filteredStaffForClass,
  availabilityWarning,
  conflictWarning,
  onSubmit,
}: ClassFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[88vh] border border-border bg-slate-50 dark:bg-background rounded-3xl p-6 overflow-hidden flex flex-col">
        <DialogHeader className="shrink-0 pb-2">
          <DialogTitle className="text-lg font-bold text-foreground">
            {editingClassId ? "Editar Clase" : "Crear Nueva Clase"}
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto custom-scrollbar flex-1 pr-1.5 pt-1">
          <form onSubmit={onSubmit} className="space-y-4 text-xs text-foreground pb-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Actividad</label>
              <Select value={name} onValueChange={setName}>
                <SelectTrigger className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground font-semibold">
                  <SelectValue placeholder="Selecciona una actividad..." />
                </SelectTrigger>
                <SelectContent>
                  {name && !STANDARD_ACTIVITIES.includes(name) && (
                    <SelectGroup>
                      <SelectLabel>Actividad Seleccionada</SelectLabel>
                      <SelectItem value={name}>{name}</SelectItem>
                    </SelectGroup>
                  )}
                  <SelectGroup>
                    <SelectLabel>Fuerza y Musculación</SelectLabel>
                    <SelectItem value="CrossFit WOD">CrossFit WOD</SelectItem>
                    <SelectItem value="CrossFit">CrossFit</SelectItem>
                    <SelectItem value="Entrenamiento Funcional">
                      Entrenamiento Funcional
                    </SelectItem>
                    <SelectItem value="Funcional HIIT">Funcional HIIT</SelectItem>
                    <SelectItem value="Levantamiento Olímpico">Levantamiento Olímpico</SelectItem>
                    <SelectItem value="Powerlifting">Powerlifting</SelectItem>
                    <SelectItem value="Calistenia">Calistenia</SelectItem>
                    <SelectItem value="Fuerza de Potencia">Fuerza de Potencia</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Cardio y Combate</SelectLabel>
                    <SelectItem value="Spinning Pro">Spinning Pro</SelectItem>
                    <SelectItem value="Spinning">Spinning / Cycling</SelectItem>
                    <SelectItem value="HIIT / Tabata">HIIT / Tabata</SelectItem>
                    <SelectItem value="Boxeo Recreativo">Boxeo Recreativo</SelectItem>
                    <SelectItem value="Kickboxing">Kickboxing</SelectItem>
                    <SelectItem value="Zumba">Zumba Fitness</SelectItem>
                    <SelectItem value="Ritmos / Dance">Ritmos / Dance</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Flexibilidad y Cuerpo-Mente</SelectLabel>
                    <SelectItem value="Yoga Ashtanga">Yoga Ashtanga</SelectItem>
                    <SelectItem value="Yoga Vinyasa">Yoga Vinyasa</SelectItem>
                    <SelectItem value="Yoga Hatha">Yoga Hatha</SelectItem>
                    <SelectItem value="Pilates Reformer">Pilates Reformer</SelectItem>
                    <SelectItem value="Pilates Mat">Pilates Mat</SelectItem>
                    <SelectItem value="Barré">Barré</SelectItem>
                    <SelectItem value="Estiramiento / Flex">
                      Estiramiento & Flexibilidad
                    </SelectItem>
                    <SelectItem value="Meditación">Meditación & Mindfulness</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Especializadas y Localizadas</SelectLabel>
                    <SelectItem value="GAP">GAP (Glúteo-Abdo-Pierna)</SelectItem>
                    <SelectItem value="AquaGym">AquaGym</SelectItem>
                    <SelectItem value="Running Club">Running Club</SelectItem>
                    <SelectItem value="Tercera Edad Adaptada">Tercera Edad Adaptada</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-1 flex-wrap">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Instructor de Staff
                  </label>
                </div>
                <Select value={staffId} onValueChange={setStaffId}>
                  <SelectTrigger className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground font-semibold">
                    <SelectValue placeholder="Selecciona un entrenador..." />
                  </SelectTrigger>
                  <SelectContent>
                    {staffForClassOptions.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} —{" "}
                        <span className="opacity-75 font-normal text-xs">{s.specialty}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {name && filteredStaffForClass.length === 0 && (
                  <p className="text-[10.5px] text-amber-600 dark:text-amber-400 font-medium pt-0.5">
                    No hay entrenadores con especialidad en "{name}" cargada. Se muestran todos
                    los profesores del staff.
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Día de la Semana
                </label>
                <Select value={day.toString()} onValueChange={(val) => setDay(Number(val))}>
                  <SelectTrigger className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground font-semibold">
                    <SelectValue placeholder="Selecciona un día..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Lunes</SelectItem>
                    <SelectItem value="1">Martes</SelectItem>
                    <SelectItem value="2">Miércoles</SelectItem>
                    <SelectItem value="3">Jueves</SelectItem>
                    <SelectItem value="4">Viernes</SelectItem>
                    <SelectItem value="5">Sábado</SelectItem>
                    <SelectItem value="6">Domingo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Horario de la Clase
                </label>
                <div className="flex items-center gap-2">
                  <Select value={startTime} onValueChange={setStartTime}>
                    <SelectTrigger className="flex h-10 w-full rounded-xl border border-border bg-background px-2 py-2 text-xs text-foreground font-semibold">
                      <SelectValue placeholder="Inicio" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.slice(0, -1).map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <span className="text-xs font-bold text-muted-foreground">a</span>

                  <Select value={endTime} onValueChange={setEndTime}>
                    <SelectTrigger className="flex h-10 w-full rounded-xl border border-border bg-background px-2 py-2 text-xs text-foreground font-semibold">
                      <SelectValue placeholder="Fin" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.slice(1).map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Sala / Salón
                </label>
                <Select
                  value={salaId}
                  onValueChange={(val) => {
                    setSalaId(val);
                    const selectedSala = salasList.find((s) => s.id === val);
                    if (selectedSala && selectedSala.capacity) {
                      setCustomCapacity(selectedSala.capacity);
                    }
                  }}
                >
                  <SelectTrigger className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground font-semibold">
                    <SelectValue placeholder="Selecciona una sala..." />
                  </SelectTrigger>
                  <SelectContent>
                    {salasList.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} (Capacidad: {s.capacity || "N/A"})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Cupos / Capacidad Máxima
                </label>
                <Input
                  type="number"
                  required
                  min="1"
                  max="100"
                  value={customCapacity}
                  onChange={(e) => setCustomCapacity(Number(e.target.value))}
                  className="h-10 rounded-xl text-sm font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Créditos Necesarios
                </label>
                <Input
                  type="number"
                  required
                  min="1"
                  value={creditsCost}
                  onChange={(e) => setCreditsCost(e.target.value)}
                  className="h-10 rounded-xl text-sm font-semibold"
                />
              </div>
            </div>

            {availabilityWarning && (
              <div className="p-3 bg-secondary/80 border border-border text-secondary-foreground rounded-xl text-xs font-semibold animate-fade-in flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
                <span>{availabilityWarning}</span>
              </div>
            )}

            {conflictWarning && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-xs font-semibold animate-fade-in flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{conflictWarning}</span>
              </div>
            )}

            {!editingClassId && (
              <div className="p-3.5 border border-border/60 bg-secondary/15 rounded-2xl space-y-2.5">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="isRecurrent"
                    checked={isRecurrent}
                    onCheckedChange={(checked) => setIsRecurrent(!!checked)}
                  />
                  <label
                    htmlFor="isRecurrent"
                    className="text-xs font-bold text-foreground cursor-pointer select-none flex items-center gap-1.5"
                  >
                    <Repeat className="h-3.5 w-3.5 text-primary" /> Programar como Clase
                    Recurrente (semanal)
                  </label>
                </div>
                {isRecurrent && (
                  <div className="space-y-1 pl-6 animate-fade-in">
                    <label className="text-[11px] text-muted-foreground font-semibold">
                      Repetir semanalmente durante:
                    </label>
                    <div className="flex items-center gap-2">
                      <Select
                        value={recurrentWeeks.toString()}
                        onValueChange={(val) => setRecurrentWeeks(Number(val))}
                      >
                        <SelectTrigger className="flex h-8 w-28 rounded-lg border border-border bg-background px-2 text-xs text-foreground font-bold">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[2, 3, 4, 6, 8, 12].map((w) => (
                            <SelectItem key={w} value={w.toString()}>
                              {w} semanas
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <span className="text-[11px] text-muted-foreground">
                        Generará {recurrentWeeks} clases en total.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <DialogFooter className="pt-3 gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl text-xs font-bold"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="rounded-xl text-xs font-bold bg-primary text-primary-foreground"
              >
                {editingClassId ? "Guardar Cambios" : "Programar Clase"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
