import React, { useState } from "react";
import { DoorOpen, Plus, Edit2, Trash2 } from "lucide-react";
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

interface ConfigSalasSectionProps {
  salasList: {
    id: string;
    name: string;
    capacity?: number;
    branchId?: string;
    description?: string;
  }[];
  setSalasList: React.Dispatch<
    React.SetStateAction<
      { id: string; name: string; capacity?: number; branchId?: string; description?: string }[]
    >
  >;
}

export function ConfigSalasSection({ salasList, setSalasList }: ConfigSalasSectionProps) {
  const [isCreateSalaOpen, setIsCreateSalaOpen] = useState(false);
  const [newSalaName, setNewSalaName] = useState("");
  const [newSalaCapacity, setNewSalaCapacity] = useState("");
  const [newSalaDescription, setNewSalaDescription] = useState("");

  const [editingSala, setEditingSala] = useState<{
    id: string;
    name: string;
    capacity?: number;
    description?: string;
  } | null>(null);

  const [deletingSala, setDeletingSala] = useState<{ id: string; name: string } | null>(null);

  const handleCreateSala = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSalaName) return;
    setSalasList((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        name: newSalaName,
        capacity: newSalaCapacity ? parseInt(newSalaCapacity) : undefined,
        description: newSalaDescription || undefined,
      },
    ]);
    setNewSalaName("");
    setNewSalaCapacity("");
    setNewSalaDescription("");
    setIsCreateSalaOpen(false);
    toast.success("Sala agregada exitosamente");
  };

  const handleSaveEditSala = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSala) return;
    setSalasList((prev) =>
      prev.map((s) => (s.id === editingSala.id ? { ...s, ...editingSala } : s))
    );
    setEditingSala(null);
    toast.success("Cambios guardados");
  };

  const handleDeleteSala = () => {
    if (!deletingSala) return;
    setSalasList((prev) => prev.filter((s) => s.id !== deletingSala.id));
    toast.success("Sala eliminada");
    setDeletingSala(null);
  };

  return (
    <div className="space-y-6 max-w-2xl bg-card border border-border p-6 rounded-3xl animate-fade-up text-foreground">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-sm">Salas y Salones de la Sede</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Administra los espacios físicos de esta sede (ej: Sala de musculación, estudio de yoga,
            box de CrossFit). Cada sala limita el cupo y organiza el calendario de clases.
          </p>
        </div>
        <Button
          onClick={() => setIsCreateSalaOpen(true)}
          size="sm"
          className="rounded-xl font-bold text-xs gap-1.5 shrink-0"
        >
          <Plus className="h-4 w-4" /> Agregar Sala / Salón
        </Button>
      </div>

      {/* Modal: Create Sala */}
      <Dialog open={isCreateSalaOpen} onOpenChange={setIsCreateSalaOpen}>
        <DialogContent className="max-w-lg border border-border bg-card">
          <DialogHeader>
            <DialogTitle>Agregar Sala / Salón</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSala} className="space-y-4 pt-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground font-semibold">
                  Nombre de la Sala
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej: Box Principal / Sala Yoga"
                  value={newSalaName}
                  onChange={(e) => setNewSalaName(e.target.value)}
                  className="flex h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus-visible:outline-none text-foreground"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground font-semibold">
                  Capacidad de Alumnos (Opcional)
                </label>
                <input
                  type="number"
                  placeholder="ej: 25"
                  value={newSalaCapacity}
                  onChange={(e) => setNewSalaCapacity(e.target.value)}
                  className="flex h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus-visible:outline-none text-foreground"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-semibold">
                Descripción o Equipamiento de la Sala (Opcional)
              </label>
              <input
                type="text"
                placeholder="ej: Piso de goma de alto impacto, 6 barras olímpicas, sonido estéreo"
                value={newSalaDescription}
                onChange={(e) => setNewSalaDescription(e.target.value)}
                className="flex h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus-visible:outline-none text-foreground"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-xl"
                onClick={() => setIsCreateSalaOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" size="sm" className="rounded-xl">
                Guardar Sala
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Edit Sala */}
      <Dialog open={!!editingSala} onOpenChange={(o) => !o && setEditingSala(null)}>
        <DialogContent className="max-w-md border border-border bg-card">
          <DialogHeader>
            <DialogTitle>Editar Sala / Salón</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveEditSala} className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-semibold">
                Nombre de la Sala
              </label>
              <input
                type="text"
                required
                value={editingSala?.name || ""}
                onChange={(e) =>
                  setEditingSala({ ...editingSala!, name: e.target.value })
                }
                className="flex h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus-visible:outline-none text-foreground"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-semibold">Capacidad</label>
              <input
                type="number"
                value={editingSala?.capacity || ""}
                onChange={(e) =>
                  setEditingSala({
                    ...editingSala!,
                    capacity: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                className="flex h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus-visible:outline-none text-foreground"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-semibold">
                Descripción o Equipamiento (Opcional)
              </label>
              <input
                type="text"
                value={editingSala?.description || ""}
                onChange={(e) =>
                  setEditingSala({ ...editingSala!, description: e.target.value })
                }
                className="flex h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus-visible:outline-none text-foreground"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-xl"
                onClick={() => setEditingSala(null)}
              >
                Cancelar
              </Button>
              <Button type="submit" size="sm" className="rounded-xl">
                Guardar Cambios
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation alert */}
      <AlertDialog open={!!deletingSala} onOpenChange={(o) => !o && setDeletingSala(null)}>
        <AlertDialogContent className="sm:max-w-md border border-border bg-card p-6 rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-foreground">
              ¿Eliminar sala {deletingSala?.name}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground">
              Esta acción no se puede deshacer. Se desvinculará de las clases asociadas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 pt-2">
            <AlertDialogCancel className="rounded-xl text-xs">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSala}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl text-xs font-bold"
            >
              Eliminar Sala
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rooms list */}
      <div className="border-t border-border pt-4">
        <h4 className="text-xs font-bold text-muted-foreground uppercase mb-3">Salas Registradas</h4>
        <div className="divide-y divide-border/60">
          {salasList.map((sala) => (
            <div key={sala.id} className="py-3.5 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <DoorOpen className="h-4 w-4 text-primary shrink-0" />
                  {sala.name}
                </div>
                {sala.description && (
                  <div className="text-xs text-muted-foreground mt-0.5">{sala.description}</div>
                )}
                <div className="flex gap-3 mt-1 text-[10px] text-muted-foreground">
                  <span>👥 Capacidad sugerida: {sala.capacity || "Sin límite"} alumnos</span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingSala({ ...sala })}
                  className="p-1.5 text-muted-foreground hover:bg-secondary rounded-lg transition"
                  title="Editar sala"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingSala({ id: sala.id, name: sala.name })}
                  className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg transition"
                  title="Eliminar sala"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
          {salasList.length === 0 && (
            <p className="text-xs text-muted-foreground italic py-3 text-center font-medium">
              No hay salas registradas.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
