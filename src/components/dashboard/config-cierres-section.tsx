import React, { useState } from "react";
import { Plus, Edit2, Trash2, CalendarX, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export interface ConfigCierresSectionProps {
  blackoutDays: { id: string; date: string; reason: string }[];
  setBlackoutDays: React.Dispatch<
    React.SetStateAction<{ id: string; date: string; reason: string }[]>
  >;
}

export function ConfigCierresSection({
  blackoutDays,
  setBlackoutDays,
}: ConfigCierresSectionProps) {
  const [isCreateCierreOpen, setIsCreateCierreOpen] = useState(false);
  const [newBlackoutDate, setNewBlackoutDate] = useState("");
  const [newBlackoutReason, setNewBlackoutReason] = useState("");

  const [editingCierre, setEditingCierre] = useState<{
    id: string;
    date: string;
    reason: string;
  } | null>(null);

  const [deletingCierre, setDeletingCierre] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleCreateCierre = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlackoutDate || !newBlackoutReason) return;
    setBlackoutDays((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        date: newBlackoutDate,
        reason: newBlackoutReason,
      },
    ]);
    setNewBlackoutDate("");
    setNewBlackoutReason("");
    setIsCreateCierreOpen(false);
    toast.success("Día de cierre agregado correctamente");
  };

  const handleEditCierre = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCierre || !editingCierre.date || !editingCierre.reason) return;
    setBlackoutDays((prev) =>
      prev.map((c) => (c.id === editingCierre.id ? editingCierre : c)),
    );
    setEditingCierre(null);
    toast.success("Día de cierre actualizado");
  };

  const handleDeleteCierre = () => {
    if (!deletingCierre) return;
    setBlackoutDays((prev) => prev.filter((c) => c.id !== deletingCierre.id));
    toast.success("Día de cierre eliminado");
    setDeletingCierre(null);
  };

  return (
    <div className="space-y-6 max-w-2xl bg-card border border-border p-6 rounded-3xl animate-fade-up text-foreground">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-sm flex items-center gap-2">
            <CalendarX className="h-4 w-4 text-primary" />
            Calendario de Días de Cierre
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Establece feriados, festivos o jornadas de mantenimiento técnico/edilicio para suspender reservas automáticamente.
          </p>
        </div>
        <Button
          onClick={() => setIsCreateCierreOpen(true)}
          size="sm"
          className="rounded-xl font-bold text-xs gap-1 shrink-0"
        >
          <Plus className="h-4 w-4" /> Agregar Día de Cierre
        </Button>
      </div>

      {/* Dialog Crear Cierre */}
      <Dialog open={isCreateCierreOpen} onOpenChange={setIsCreateCierreOpen}>
        <DialogContent className="max-w-md border border-border bg-card">
          <DialogHeader>
            <DialogTitle>Agregar Día de Cierre</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateCierre} className="space-y-4 pt-2 text-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground font-semibold">
                  Fecha de Cierre
                </label>
                <input
                  type="date"
                  required
                  value={newBlackoutDate}
                  onChange={(e) => setNewBlackoutDate(e.target.value)}
                  className="flex h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus-visible:outline-none text-foreground"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground font-semibold">
                  Motivo del Cierre
                </label>
                <input
                  type="text"
                  required
                  value={newBlackoutReason}
                  onChange={(e) => setNewBlackoutReason(e.target.value)}
                  className="flex h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus-visible:outline-none text-foreground"
                  placeholder="Ej: Feriado Nacional o Desinfección"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-xl"
                onClick={() => setIsCreateCierreOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" size="sm" className="rounded-xl font-bold text-xs">
                Guardar Día
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Editar Cierre */}
      <Dialog open={!!editingCierre} onOpenChange={(o) => !o && setEditingCierre(null)}>
        <DialogContent className="max-w-md border border-border bg-card">
          <DialogHeader>
            <DialogTitle>Editar Día de Cierre</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditCierre} className="space-y-4 pt-2 text-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground font-semibold">
                  Fecha de Cierre
                </label>
                <input
                  type="date"
                  required
                  value={editingCierre?.date || ""}
                  onChange={(e) =>
                    setEditingCierre((prev) => (prev ? { ...prev, date: e.target.value } : null))
                  }
                  className="flex h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus-visible:outline-none text-foreground"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground font-semibold">
                  Motivo del Cierre
                </label>
                <input
                  type="text"
                  required
                  value={editingCierre?.reason || ""}
                  onChange={(e) =>
                    setEditingCierre((prev) => (prev ? { ...prev, reason: e.target.value } : null))
                  }
                  className="flex h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus-visible:outline-none text-foreground"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-xl"
                onClick={() => setEditingCierre(null)}
              >
                Cancelar
              </Button>
              <Button type="submit" size="sm" className="rounded-xl font-bold text-xs">
                Guardar Cambios
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Lista de cierres programados */}
      <div className="space-y-3 border-t border-border pt-4">
        <h4 className="text-xs font-bold text-muted-foreground uppercase">
          Fechas de Cierre Programadas
        </h4>
        <div className="divide-y divide-border">
          {blackoutDays.map((b) => (
            <div key={b.id} className="py-3.5 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-foreground">{b.reason}</div>
                <div className="text-xs text-muted-foreground">
                  📅 {b.date}{" "}
                  {b.date === "2026-06-29" && (
                    <span className="text-[10px] bg-destructive/10 text-destructive font-bold px-1.5 py-0.5 rounded ml-1.5 uppercase">
                      Hoy
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingCierre({ ...b })}
                  className="p-1.5 text-muted-foreground hover:bg-secondary rounded-lg transition"
                  title="Editar día de cierre"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setDeletingCierre({
                      id: b.id,
                      name: `${b.reason} (${b.date})`,
                    })
                  }
                  className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg transition"
                  title="Eliminar día de cierre"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {blackoutDays.length === 0 && (
            <p className="text-xs text-muted-foreground italic py-3">
              No hay días de cierre configurados.
            </p>
          )}
        </div>
      </div>

      {/* AlertDialog de eliminación segura */}
      <AlertDialog
        open={!!deletingCierre}
        onOpenChange={(open) => !open && setDeletingCierre(null)}
      >
        <AlertDialogContent className="sm:max-w-md border border-border bg-card p-6 rounded-3xl shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-rose-500" />
              ¿Eliminar día de cierre?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground pt-1 leading-relaxed">
              Estás a punto de habilitar reservas nuevamente para la fecha{" "}
              <strong>"{deletingCierre?.name}"</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 pt-2">
            <AlertDialogCancel
              onClick={() => setDeletingCierre(null)}
              className="rounded-xl text-xs h-9"
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCierre}
              className="rounded-xl text-xs h-9 bg-rose-600 hover:bg-rose-700 text-white font-bold"
            >
              Sí, eliminar fecha
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
