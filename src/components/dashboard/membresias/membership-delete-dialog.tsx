import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Membership } from "./types";

interface MembershipDeleteDialogProps {
  plan: Membership | null;
  onClose: () => void;
  onConfirm: (plan: Membership) => void;
}

export function MembershipDeleteDialog({
  plan,
  onClose,
  onConfirm,
}: MembershipDeleteDialogProps) {
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  useEffect(() => {
    setDeleteConfirmText("");
  }, [plan]);

  if (!plan) return null;

  const handleConfirm = () => {
    if (deleteConfirmText === "ELIMINAR") {
      onConfirm(plan);
      onClose();
    }
  };

  return (
    <AlertDialog open={!!plan} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="sm:max-w-md border border-border bg-card p-6 rounded-3xl shadow-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-rose-600" /> Confirmar Eliminación de Plan
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-muted-foreground pt-1">
            Para confirmar la eliminación definitiva del plan{" "}
            <strong>"{plan.name}"</strong>, escribe la palabra clave <strong>ELIMINAR</strong> a
            continuación:
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-2 space-y-2">
          <Input
            type="text"
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-center font-bold text-foreground placeholder:font-normal"
            placeholder="Escribe ELIMINAR para confirmar"
            autoFocus
          />
        </div>

        <AlertDialogFooter className="gap-2 pt-2">
          <AlertDialogCancel onClick={onClose} className="rounded-xl text-xs font-bold border-border">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={deleteConfirmText !== "ELIMINAR"}
            className="rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs disabled:opacity-50"
          >
            Sí, Eliminar Plan
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
