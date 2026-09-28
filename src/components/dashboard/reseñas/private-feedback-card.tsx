import { useState } from "react";
import { CheckCircle2, Clock, FileText, PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { PrivateFeedbackItem } from "./types";

interface PrivateFeedbackCardProps {
  feedback: PrivateFeedbackItem;
  onToggleStatus: (id: string) => void;
  onSaveAdminNote: (id: string, note: string) => void;
  onRequestDelete: (id: string, studentName: string) => void;
}

export function PrivateFeedbackCard({
  feedback: fb,
  onToggleStatus,
  onSaveAdminNote,
  onRequestDelete,
}: PrivateFeedbackCardProps) {
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [adminNoteText, setAdminNoteText] = useState(fb.adminNotes || "");

  const isPending = fb.status === "Pendiente";

  const handleStartEdit = () => {
    setAdminNoteText(fb.adminNotes || "");
    setIsEditingNote(true);
  };

  const handleSave = () => {
    onSaveAdminNote(fb.id, adminNoteText.trim());
    setIsEditingNote(false);
  };

  const handleCancel = () => {
    setAdminNoteText(fb.adminNotes || "");
    setIsEditingNote(false);
  };

  return (
    <div className="bg-card border border-border p-5 rounded-3xl space-y-3.5 hover:border-border/80 transition-all shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={fb.studentPhoto}
            alt={fb.studentName}
            className="w-10 h-10 rounded-full object-cover border border-border shrink-0 shadow-2xs"
          />
          <div>
            <div className="font-bold text-sm text-foreground flex items-center gap-2">
              <span>{fb.studentName}</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-secondary/60 text-foreground border border-border/60 text-[10px] font-extrabold">
                {fb.category}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">{fb.date}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleStatus(fb.id)}
            className={cn(
              "px-3 py-1 rounded-full border text-[10.5px] font-extrabold transition flex items-center gap-1.5 cursor-pointer",
              isPending
                ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 hover:bg-amber-500/20"
                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20",
            )}
          >
            {isPending ? (
              <>
                <Clock className="w-3 h-3 text-amber-500" />
                <span>Pendiente</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>Atendido</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => onRequestDelete(fb.id, fb.studentName)}
            className="p-1.5 text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
            title="Eliminar sugerencia"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className="text-xs sm:text-sm leading-relaxed text-foreground/90 font-medium bg-secondary/15 p-3 rounded-2xl border border-border/40">
        "{fb.message}"
      </p>

      {/* Internal Admin Note */}
      {fb.adminNotes && !isEditingNote ? (
        <div className="p-3.5 rounded-2xl bg-secondary/30 border border-border/60 text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-foreground flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-primary" /> Nota Interna de Administración
            </span>
            <button
              type="button"
              onClick={handleStartEdit}
              className="text-[10.5px] text-muted-foreground hover:text-foreground font-semibold underline cursor-pointer"
            >
              Editar Nota
            </button>
          </div>
          <p className="text-muted-foreground leading-relaxed">{fb.adminNotes}</p>
        </div>
      ) : !fb.adminNotes && !isEditingNote ? (
        <button
          type="button"
          onClick={() => setIsEditingNote(true)}
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1.5 pt-0.5 cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" /> Agregar nota interna de resolución
        </button>
      ) : null}

      {isEditingNote && (
        <div className="space-y-2 pt-2 animate-fade-in">
          <Textarea
            rows={2}
            value={adminNoteText}
            onChange={(e) => setAdminNoteText(e.target.value)}
            placeholder="Escribe una nota interna (ej: 'Revisado con el staff de limpieza el 29/07')..."
            className="flex w-full rounded-2xl border border-border bg-background px-3 py-2 text-xs font-bold text-foreground placeholder:font-normal placeholder:text-muted-foreground"
          />
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl text-xs font-bold"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              size="sm"
              className="rounded-xl text-xs font-bold bg-primary text-primary-foreground"
              onClick={handleSave}
            >
              Guardar Nota Interna
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
