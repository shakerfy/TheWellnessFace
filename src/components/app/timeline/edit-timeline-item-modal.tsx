import React, { useState } from "react";
import { toast } from "sonner";
import { UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export interface EditTimelineItemModalProps {
  item: any;
  onClose: () => void;
  onSave: (updated: any) => void;
  onToggleSave?: (id: string) => void;
}

export function EditTimelineItemModal({
  item,
  onClose,
  onSave,
}: EditTimelineItemModalProps) {
  const isMeal = item.type === "meal";

  // ponytail: simplified to 1-field text correction for dish name or timeline title
  const [title, setTitle] = useState(item.title || "");
  const [time, setTime] = useState(item.time || "");
  const [coachFeedback, setCoachFeedback] = useState(
    item.coachFeedback || item.narrative || item.summary || item.desc || "",
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isMeal) {
      onSave({
        ...item,
        title: title.trim(),
        time: time.trim() || item.time,
      });
      toast.success("✓ Plato actualizado");
    } else {
      onSave({
        ...item,
        title: title.trim(),
        time: time.trim() || item.time,
        coachFeedback: coachFeedback.trim(),
        desc: coachFeedback.trim() || item.desc,
        narrative: coachFeedback.trim() || item.narrative,
      });
      toast.success("✓ Registro actualizado");
    }
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-6 bg-card border border-border rounded-3xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader className="mb-3 text-left">
          <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
            {isMeal ? (
              <>
                <UtensilsCrossed className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Corregir Plato</span>
              </>
            ) : (
              <span>Editar Registro del Diario</span>
            )}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isMeal
              ? "Modificá el nombre del plato si la identificación visual requiere corrección."
              : "Modificá los detalles de tu registro en la línea de tiempo."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Nombre / Título y Hora */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                {isMeal ? "Nombre del plato" : "Título"}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isMeal ? "Ej: Salmón con verduras al vapor" : "Título del registro"}
                className="flex w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground font-semibold"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Hora</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="Ej: 14:30"
                className="flex w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground font-semibold"
              />
            </div>
          </div>

          {/* Nota solo para registros que no sean comida */}
          {!isMeal && (
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-semibold text-muted-foreground">Nota</label>
              <textarea
                rows={2}
                value={coachFeedback}
                onChange={(e) => setCoachFeedback(e.target.value)}
                placeholder="Agrega una nota..."
                className="flex w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground font-medium"
              />
            </div>
          )}

          <div className="flex gap-2 justify-end pt-3 border-t border-border/40">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl text-xs font-bold"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="rounded-xl text-xs font-bold bg-foreground text-background hover:opacity-90 cursor-pointer"
            >
              Guardar Cambios
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
