import React from "react";
import {
  Plus,
  Clock,
  Users,
  Search,
  Check,
  ShieldAlert,
  AlertCircle,
  Edit2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { getStudentPhoto } from "../dashboard-utils";
import {
  GymClassItem,
  StaffMember,
  ConfirmDialogState,
  PromptDialogState,
  CancelSpotDialogState,
} from "./types";

interface EnrollMemberModalProps {
  enrollModalClass: GymClassItem | null;
  enrollTargetSpotIndex: number | null;
  enrollSearchTerm: string;
  setEnrollSearchTerm: (v: string) => void;
  enrollPlanFilter: string;
  setEnrollPlanFilter: (v: string) => void;
  availableMembersToEnroll: any[];
  onEnrollMember: (memberName: string) => void;
  onClose: () => void;
}

export function EnrollMemberModal({
  enrollModalClass,
  enrollTargetSpotIndex,
  enrollSearchTerm,
  setEnrollSearchTerm,
  enrollPlanFilter,
  setEnrollPlanFilter,
  availableMembersToEnroll,
  onEnrollMember,
  onClose,
}: EnrollMemberModalProps) {
  return (
    <Dialog open={!!enrollModalClass} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md rounded-3xl p-6 border-border shadow-2xl bg-slate-50 dark:bg-background">
        <DialogHeader className="pb-3 border-b border-border/40">
          <DialogTitle className="text-lg font-black text-foreground flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" /> Inscribir Alumno
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Busca y selecciona un alumno activo para inscribirlo
            {enrollTargetSpotIndex !== null ? (
              <>
                {" "}
                en el{" "}
                <strong className="text-primary font-bold">
                  Lugar #{enrollTargetSpotIndex + 1}
                </strong>{" "}
                de{" "}
              </>
            ) : (
              <> en </>
            )}
            <strong className="text-foreground font-bold">{enrollModalClass?.name}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-3">
          <div className="space-y-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, email o teléfono..."
                value={enrollSearchTerm}
                onChange={(e) => setEnrollSearchTerm(e.target.value)}
                className="pl-9 rounded-xl text-xs bg-secondary/30 border-border/60"
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Filtrar por Plan:
              </span>
              <Select value={enrollPlanFilter} onValueChange={setEnrollPlanFilter}>
                <SelectTrigger className="h-8 text-xs rounded-xl bg-secondary/30 border-border/60 w-44">
                  <SelectValue placeholder="Todos los planes" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="todos">Todos los planes</SelectItem>
                  <SelectItem value="Pase Libre">Pase Libre</SelectItem>
                  <SelectItem value="Performance">Performance</SelectItem>
                  <SelectItem value="Musculación">Musculación</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="max-h-[280px] overflow-y-auto custom-scrollbar space-y-2 pr-1 pt-1">
            {availableMembersToEnroll.map((m: any) => {
              const isAlreadyEnrolled = Object.values(
                enrollModalClass?.enrolledSpots || {},
              ).includes(m.name);
              return (
                <div
                  key={m.name}
                  className="flex items-center justify-between p-2.5 rounded-2xl border border-border/50 bg-card hover:bg-secondary/30 transition-colors gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={m.photo || getStudentPhoto(m.name)}
                      alt={m.name}
                      className="h-9 w-9 rounded-full object-cover shrink-0 border border-border/60 shadow-2xs"
                    />
                    <div className="leading-tight min-w-0">
                      <span className="font-bold text-xs text-foreground block truncate">
                        {m.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1.5 flex-wrap">
                        <span className="bg-primary/10 text-primary px-1.5 py-0.2 rounded font-bold">
                          {m.plan || "Pase Libre"}
                        </span>
                        <span>· {m.status || "Activo"}</span>
                      </span>
                    </div>
                  </div>

                  {isAlreadyEnrolled ? (
                    <span className="text-[10px] font-bold text-muted-foreground bg-secondary px-2.5 py-1 rounded-xl border border-border/60 shrink-0">
                      Ya Inscripto
                    </span>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      className="h-8 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs shrink-0 px-3"
                      onClick={() => onEnrollMember(m.name)}
                    >
                      Inscribir
                    </Button>
                  )}
                </div>
              );
            })}

            {availableMembersToEnroll.length === 0 && (
              <p className="text-xs text-muted-foreground italic text-center py-8">
                No se encontraron alumnos activos coincidentes.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface WaitlistMemberModalProps {
  waitlistModalClass: GymClassItem | null;
  waitlistSearchTerm: string;
  setWaitlistSearchTerm: (v: string) => void;
  waitlistPlanFilter: string;
  setWaitlistPlanFilter: (v: string) => void;
  availableMembersToWaitlist: any[];
  onAddToWaitlist: (studentName: string) => void;
  onClose: () => void;
}

export function WaitlistMemberModal({
  waitlistModalClass,
  waitlistSearchTerm,
  setWaitlistSearchTerm,
  waitlistPlanFilter,
  setWaitlistPlanFilter,
  availableMembersToWaitlist,
  onAddToWaitlist,
  onClose,
}: WaitlistMemberModalProps) {
  return (
    <Dialog open={!!waitlistModalClass} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md rounded-3xl p-6 border-border shadow-2xl bg-slate-50 dark:bg-background">
        <DialogHeader className="pb-3 border-b border-border/40">
          <DialogTitle className="text-lg font-black text-foreground flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" /> Añadir a Lista de Espera
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed pt-1">
            Busca y selecciona un alumno activo para anotarlo en la lista de espera de{" "}
            <strong className="text-foreground font-bold">{waitlistModalClass?.name}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-3">
          <div className="space-y-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, email o teléfono..."
                value={waitlistSearchTerm}
                onChange={(e) => setWaitlistSearchTerm(e.target.value)}
                className="pl-9 rounded-xl text-xs bg-secondary/30 border-border/60"
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Filtrar por Plan:
              </span>
              <Select value={waitlistPlanFilter} onValueChange={setWaitlistPlanFilter}>
                <SelectTrigger className="h-8 text-xs rounded-xl bg-secondary/30 border-border/60 w-44">
                  <SelectValue placeholder="Todos los planes" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="todos">Todos los planes</SelectItem>
                  <SelectItem value="Pase Libre">Pase Libre</SelectItem>
                  <SelectItem value="Performance">Performance</SelectItem>
                  <SelectItem value="Musculación">Musculación</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="max-h-[280px] overflow-y-auto custom-scrollbar space-y-2 pr-1 pt-1">
            {availableMembersToWaitlist.map((m: any) => {
              const isEnrolled = Object.values(waitlistModalClass?.enrolledSpots || {}).includes(
                m.name,
              );
              const isInWaitlist = (waitlistModalClass?.waitlist || []).includes(m.name);

              return (
                <div
                  key={m.name}
                  className="flex items-center justify-between p-2.5 rounded-2xl border border-border/50 bg-card hover:bg-secondary/30 transition-colors gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={m.photo || getStudentPhoto(m.name)}
                      alt={m.name}
                      className="h-9 w-9 rounded-full object-cover shrink-0 border border-border/60 shadow-2xs"
                    />
                    <div className="leading-tight min-w-0">
                      <span className="font-bold text-xs text-foreground block truncate">
                        {m.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1.5 flex-wrap">
                        <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.2 rounded font-bold">
                          {m.plan || "Pase Libre"}
                        </span>
                        <span>· {m.status || "Activo"}</span>
                      </span>
                    </div>
                  </div>

                  {isEnrolled ? (
                    <span className="text-[10px] font-bold text-muted-foreground bg-secondary px-2.5 py-1 rounded-xl border border-border/60 shrink-0">
                      Ya Inscripto
                    </span>
                  ) : isInWaitlist ? (
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20 shrink-0">
                      En Espera
                    </span>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      className="h-8 text-xs font-bold rounded-xl bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 shadow-2xs shrink-0 px-3"
                      onClick={() => onAddToWaitlist(m.name)}
                    >
                      Añadir a Lista
                    </Button>
                  )}
                </div>
              );
            })}

            {availableMembersToWaitlist.length === 0 && (
              <p className="text-xs text-muted-foreground italic text-center py-8">
                No se encontraron alumnos activos coincidentes.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface SubstituteCoachModalProps {
  substituteCoachModalClass: GymClassItem | null;
  substituteSearchTerm: string;
  setSubstituteSearchTerm: (v: string) => void;
  availableCoachesToSubstitute: StaffMember[];
  onAssignSubstitute: (coach: StaffMember) => void;
  onClose: () => void;
}

export function SubstituteCoachModal({
  substituteCoachModalClass,
  substituteSearchTerm,
  setSubstituteSearchTerm,
  availableCoachesToSubstitute,
  onAssignSubstitute,
  onClose,
}: SubstituteCoachModalProps) {
  return (
    <Dialog open={!!substituteCoachModalClass} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md rounded-3xl p-6 border-border shadow-2xl bg-slate-50 dark:bg-background">
        <DialogHeader className="pb-3 border-b border-border/40">
          <DialogTitle className="text-lg font-black text-foreground flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" /> Sustituir Profesor
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed pt-1">
            Busca y selecciona un profesor del Staff para sustituir la clase{" "}
            <strong className="text-foreground font-bold">
              {substituteCoachModalClass?.name}
            </strong>
            .
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar profesor por nombre o especialidad..."
              value={substituteSearchTerm}
              onChange={(e) => setSubstituteSearchTerm(e.target.value)}
              className="pl-9 rounded-xl text-xs bg-secondary/30 border-border/60"
            />
          </div>

          <div className="max-h-[280px] overflow-y-auto custom-scrollbar space-y-2 pr-1 pt-1">
            {availableCoachesToSubstitute.map((s) => {
              const isCurrentCoach =
                substituteCoachModalClass?.staffId === s.id ||
                substituteCoachModalClass?.coach?.toLowerCase() === s.name?.toLowerCase();

              return (
                <div
                  key={s.id || s.name}
                  className="flex items-center justify-between p-2.5 rounded-2xl border border-border/50 bg-card hover:bg-secondary/30 transition-colors gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={
                        s.photo ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&q=80"
                      }
                      alt={s.name}
                      className="h-9 w-9 rounded-full object-cover shrink-0 border border-border/60 shadow-2xs"
                    />
                    <div className="leading-tight min-w-0">
                      <span className="font-bold text-xs text-foreground block truncate">
                        {s.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1.5 flex-wrap">
                        <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 px-1.5 py-0.2 rounded font-bold">
                          {s.specialty || "Entrenador"}
                        </span>
                      </span>
                    </div>
                  </div>

                  {isCurrentCoach ? (
                    <span className="text-[10px] font-bold text-muted-foreground bg-secondary px-2.5 py-1 rounded-xl border border-border/60 shrink-0">
                      Coach Actual
                    </span>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      className="h-8 text-xs font-bold rounded-xl bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 shadow-2xs shrink-0 px-3"
                      onClick={() => onAssignSubstitute(s)}
                    >
                      Asignar Sustituto
                    </Button>
                  )}
                </div>
              );
            })}

            {availableCoachesToSubstitute.length === 0 && (
              <p className="text-xs text-muted-foreground italic text-center py-8">
                No se encontraron profesores del Staff coincidentes.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface CancelSpotModalProps {
  cancelSpotDialog: CancelSpotDialogState | null;
  cancelOption: "refund" | "rereserva";
  setCancelOption: (opt: "refund" | "rereserva") => void;
  onConfirmCancelSpot: () => void;
  onClose: () => void;
}

export function CancelSpotModal({
  cancelSpotDialog,
  cancelOption,
  setCancelOption,
  onConfirmCancelSpot,
  onClose,
}: CancelSpotModalProps) {
  return (
    <Dialog open={!!cancelSpotDialog?.isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md rounded-3xl p-6 border-border shadow-2xl bg-background">
        <DialogHeader className="pb-3 border-b border-border/40">
          <DialogTitle className="text-lg font-black text-foreground flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-500" /> Cancelar Reserva
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Elige la modalidad para procesar la baja de{" "}
            <strong>{cancelSpotDialog?.displayNameForConfirm}</strong>:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-3">
          <div
            onClick={() => setCancelOption("refund")}
            className={cn(
              "p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex items-start gap-3",
              cancelOption === "refund"
                ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                : "border-border/60 bg-card hover:bg-secondary/40",
            )}
          >
            <div
              className={cn(
                "h-5 w-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-colors",
                cancelOption === "refund"
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground/40",
              )}
            >
              {cancelOption === "refund" && <Check className="h-3 w-3 stroke-[3]" />}
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground">
                1. Devolver créditos automáticamente
              </h4>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                Reembolso inmediato e incondicional del crédito a la cuenta del alumno.
              </p>
            </div>
          </div>

          <div
            onClick={() => setCancelOption("rereserva")}
            className={cn(
              "p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex items-start gap-3",
              cancelOption === "rereserva"
                ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                : "border-border/60 bg-card hover:bg-secondary/40",
            )}
          >
            <div
              className={cn(
                "h-5 w-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-colors",
                cancelOption === "rereserva"
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground/40",
              )}
            >
              {cancelOption === "rereserva" && <Check className="h-3 w-3 stroke-[3]" />}
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground">
                2. Aplicar modalidad "Re-reserva"
              </h4>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                Libera el casillero en la sala. El reembolso se procesará únicamente si otro
                alumno vuelve a agendar la plaza.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4 border-t border-border/40 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-xl text-xs font-semibold"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            size="sm"
            className="rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={onConfirmCancelSpot}
          >
            Confirmar Baja
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface GenericConfirmDialogProps {
  confirmDialog: ConfirmDialogState | null;
  onClose: () => void;
}

export function GenericConfirmDialog({ confirmDialog, onClose }: GenericConfirmDialogProps) {
  return (
    <AlertDialog open={!!confirmDialog?.isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="max-w-md rounded-3xl p-6 border-border shadow-2xl bg-background">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-black text-foreground flex items-center gap-2">
            {confirmDialog?.variant === "destructive" ? (
              <ShieldAlert className="h-5 w-5 text-destructive" />
            ) : (
              <AlertCircle className="h-5 w-5 text-primary" />
            )}
            {confirmDialog?.title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed pt-1">
            {confirmDialog?.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="pt-4 border-t border-border/40 gap-2 sm:gap-2">
          <AlertDialogCancel onClick={onClose} className="rounded-xl text-xs font-semibold mt-0">
            {confirmDialog?.cancelText || "Cancelar"}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (confirmDialog?.onConfirm) confirmDialog.onConfirm();
              onClose();
            }}
            className={cn(
              "rounded-xl text-xs font-bold",
              confirmDialog?.variant === "destructive"
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
          >
            {confirmDialog?.confirmText || "Confirmar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface GenericPromptDialogProps {
  promptDialog: PromptDialogState | null;
  inputValue: string;
  setInputValue: (v: string) => void;
  onClose: () => void;
}

export function GenericPromptDialog({
  promptDialog,
  inputValue,
  setInputValue,
  onClose,
}: GenericPromptDialogProps) {
  return (
    <Dialog open={!!promptDialog?.isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md rounded-3xl p-6 border-border shadow-2xl bg-background">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg font-black text-foreground flex items-center gap-2">
            <Edit2 className="h-5 w-5 text-primary" />
            {promptDialog?.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground pt-1">
            {promptDialog?.description}
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <Input
            autoFocus
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={promptDialog?.placeholder || "Ingresa un valor..."}
            className="rounded-xl text-xs bg-secondary/30 border-border/60"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (promptDialog?.onConfirm) promptDialog.onConfirm(inputValue);
                onClose();
              }
            }}
          />
        </div>
        <DialogFooter className="pt-3 border-t border-border/40 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-xl text-xs font-semibold"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            size="sm"
            className={cn(
              "rounded-xl text-xs font-bold",
              promptDialog?.variant === "destructive"
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
            onClick={() => {
              if (promptDialog?.onConfirm) promptDialog.onConfirm(inputValue);
              onClose();
            }}
          >
            {promptDialog?.confirmText || "Aceptar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
