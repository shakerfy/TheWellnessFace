import React from "react";
import {
  HelpCircle,
  Wrench,
  MoreVertical,
  Plus,
  Users,
  Edit2,
  Check,
  Slash,
  Trash2,
  X,
  MoreHorizontal,
  UserCheck,
  UserX,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { getStudentPhoto } from "../dashboard-utils";
import {
  GymClassItem,
  StaffMember,
  SalaItem,
  ConfirmDialogState,
  PromptDialogState,
  CancelSpotDialogState,
} from "./types";

interface ClassDetailDialogProps {
  selectedClassId: string | null;
  onClose: () => void;
  classesList: GymClassItem[];
  setClassesList: React.Dispatch<React.SetStateAction<GymClassItem[]>>;
  staffList: StaffMember[];
  salasList: SalaItem[];
  canManageClasses: boolean;
  cancellationPolicyHours: number;
  onOpenEnrollModal: (cls: GymClassItem) => void;
  onOpenSubstituteModal: (cls: GymClassItem) => void;
  onOpenWaitlistModal: (cls: GymClassItem) => void;
  onEditClass: (cls: GymClassItem) => void;
  setConfirmDialog: (dialog: ConfirmDialogState | null) => void;
  setPromptDialog: (dialog: PromptDialogState | null) => void;
  setCancelSpotDialog: (dialog: CancelSpotDialogState | null) => void;
  setCancelOption: (opt: "refund" | "rereserva") => void;
  isSecondaryModalOpen: boolean;
}

const KNOWN_MEMBERS = [
  { name: "Agustín Gómez", plan: "Pase Libre", phone: "+54 9 11 3242-1241" },
  { name: "Camila Díaz", plan: "Performance", phone: "+54 9 11 4124-5124" },
  { name: "Marcos López", plan: "Pase Libre", phone: "+54 9 11 2341-2412" },
  { name: "Tomás Ruiz", plan: "Performance", phone: "+54 9 11 5122-1234" },
  { name: "Lucas Torres", plan: "Performance", phone: "+54 9 11 4124-1111" },
  { name: "Paula Cáceres", plan: "Pase Libre", phone: "+54 9 11 2344-9999" },
  { name: "Sofía Martínez", plan: "Pase Libre", phone: "+54 9 11 3333-8888" },
  { name: "Pedro Giménez", plan: "Pase Libre", phone: "+54 9 11 4444-7777" },
  { name: "María del Mar", plan: "Performance", phone: "+54 9 11 5555-6666" },
];

export function ClassDetailDialog({
  selectedClassId,
  onClose,
  classesList,
  setClassesList,
  staffList,
  salasList,
  canManageClasses,
  cancellationPolicyHours,
  onOpenEnrollModal,
  onOpenSubstituteModal,
  onOpenWaitlistModal,
  onEditClass,
  setConfirmDialog,
  setPromptDialog,
  setCancelSpotDialog,
  setCancelOption,
  isSecondaryModalOpen,
}: ClassDetailDialogProps) {
  const c = classesList.find((classObj) => classObj.id === selectedClassId);

  if (!selectedClassId || !c) {
    return (
      <Dialog open={!!selectedClassId} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-md border border-border bg-card text-center p-6 rounded-3xl">
          <DialogHeader>
            <DialogTitle>Detalle de clase</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
            <HelpCircle className="h-8 w-8 mb-2" />
            <p className="text-xs">Selecciona una clase para ver sus detalles.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const coach = staffList.find((s) => s.id === c.staffId);
  const salaName = salasList.find((s) => s.id === c.salaId)?.name || "Sin sala";

  const getEnrichedStudentInfo = (studentName: string) => {
    const username = `@${studentName.toLowerCase().replace(/[^a-z]/g, "")}`;
    const photo = getStudentPhoto(studentName);
    const matchedMember = KNOWN_MEMBERS.find(
      (m) => m.name.toLowerCase() === studentName.toLowerCase(),
    );

    return {
      username,
      photo,
      plan: matchedMember?.plan || "Pase Libre",
      phone: matchedMember?.phone || "+54 9 11 5555-1234",
    };
  };

  const handleCancelSpot = (index: number, studentName: string) => {
    const displayNameForConfirm = studentName;
    const hasWaitlist = Boolean(c.waitlist && c.waitlist.length > 0);

    if (hasWaitlist) {
      const nextStudent = c.waitlist![0];
      setConfirmDialog({
        isOpen: true,
        title: `Cancelar Reserva de ${displayNameForConfirm}`,
        description: `Se enviará una notificación automática (Push / WhatsApp) informando el cambio y reembolsando su crédito. Al haber alumnos en Lista de Espera, el lugar #${index + 1} se asignará automáticamente a ${nextStudent}.`,
        confirmText: "Confirmar Baja y Reasignar",
        variant: "destructive",
        onConfirm: () => {
          setClassesList((prev) =>
            prev.map((item) => {
              if (item.id === c.id) {
                const copySpots = { ...item.enrolledSpots };
                copySpots[index] = nextStudent;
                const nextWaitlist = (item.waitlist || []).slice(1);
                const copyAtt = { ...item.attendance };
                copyAtt[index] = "pendiente";
                return {
                  ...item,
                  enrolledSpots: copySpots,
                  waitlist: nextWaitlist,
                  attendance: copyAtt,
                };
              }
              return item;
            }),
          );
          toast.success(
            `Reserva de ${displayNameForConfirm} cancelada. Lugar #${index + 1} asignado a ${nextStudent} desde la lista de espera.`,
          );
        },
      });
      return;
    }

    setCancelOption("refund");
    setCancelSpotDialog({
      isOpen: true,
      c,
      index,
      studentName,
      displayNameForConfirm,
      hasWaitlist: false,
    });
  };

  return (
    <Dialog
      open={!!selectedClassId}
      onOpenChange={(open) => {
        if (!open && !isSecondaryModalOpen) {
          onClose();
        }
      }}
    >
      <DialogContent
        className="max-w-4xl h-[90vh] overflow-y-auto custom-scrollbar p-0 rounded-3xl border-border shadow-2xl bg-slate-50 dark:bg-background"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => {
          if (isSecondaryModalOpen) {
            e.preventDefault();
          } else {
            onClose();
          }
        }}
      >
        {/* Header Card */}
        <div className="p-6 bg-card border-b border-border/60 sticky top-0 z-20 space-y-4">
          {/* Row 1: Badges & Header Actions */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs bg-primary/10 text-primary font-bold px-2.5 py-0.5 rounded-full border border-primary/20">
                {salaName}
              </span>
              {c.status === "cancelada" ? (
                <span className="text-xs bg-destructive/10 text-destructive font-bold px-2.5 py-0.5 rounded-full border border-destructive/20">
                  Clase Cancelada
                </span>
              ) : (
                <span className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  Sesión Activa
                </span>
              )}
              <span className="text-xs bg-secondary border border-border/60 text-foreground font-bold px-2.5 py-0.5 rounded-full">
                {c.creditsCost || 1} {c.creditsCost === 1 ? "crédito" : "créditos"}
              </span>
            </div>

            {/* Header Actions Menu & Close Button */}
            <div className="flex items-center gap-2 shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 rounded-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 text-xs font-bold gap-1.5 shadow-xs"
                    title="Acciones de Gestión de Clase"
                  >
                    <Wrench className="h-3.5 w-3.5" />
                    <span>Acciones</span>
                    <MoreVertical className="h-3.5 w-3.5 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 rounded-2xl p-1.5 shadow-xl border-border"
                >
                  <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 py-1.5">
                    Gestión de Clase
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {/* Inscribir Alumno */}
                  {c.status !== "cancelada" && c.booked < c.capacity && (
                    <DropdownMenuItem
                      className="rounded-xl cursor-pointer text-xs font-semibold gap-2 py-2"
                      onClick={() => onOpenEnrollModal(c)}
                    >
                      <Plus className="h-4 w-4 text-primary" /> Inscribir Alumno
                    </DropdownMenuItem>
                  )}

                  {/* Sustituir Coach */}
                  <DropdownMenuItem
                    className="rounded-xl cursor-pointer text-xs font-semibold gap-2 py-2"
                    onClick={() => onOpenSubstituteModal(c)}
                  >
                    <Users className="h-4 w-4 text-blue-500" /> Sustituir Coach
                  </DropdownMenuItem>

                  {/* Editar Clase */}
                  <DropdownMenuItem
                    className="rounded-xl cursor-pointer text-xs font-semibold gap-2 py-2"
                    onClick={() => onEditClass(c)}
                  >
                    <Edit2 className="h-4 w-4 text-amber-500" /> Editar Clase
                  </DropdownMenuItem>

                  {/* Cancelar Clase / Reactivar */}
                  {c.status === "cancelada" ? (
                    <DropdownMenuItem
                      className="rounded-xl cursor-pointer text-xs font-semibold gap-2 py-2 text-primary"
                      onClick={() => {
                        setConfirmDialog({
                          isOpen: true,
                          title: "Reactivar Clase",
                          description: `¿Deseas reactivar la clase "${c.name}"?`,
                          confirmText: "Reactivar Clase",
                          onConfirm: () => {
                            setClassesList((prev) =>
                              prev.map((item) =>
                                item.id === c.id ? { ...item, status: "activa" } : item,
                              ),
                            );
                            toast.success(`La clase "${c.name}" ha sido reactivada.`);
                          },
                        });
                      }}
                    >
                      <Check className="h-4 w-4" /> Reactivar Clase
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      className="rounded-xl cursor-pointer text-xs font-semibold gap-2 py-2 text-amber-600 dark:text-amber-400"
                      onClick={() => {
                        setConfirmDialog({
                          isOpen: true,
                          title: "Cancelar Sesión de Clase",
                          description: `¿Confirmas cancelar la clase "${c.name}"?\n\n• Se reembolsarán los créditos a todos los alumnos agendados (${c.booked} inscriptos).\n• Se enviará una notificación automática (Push / WhatsApp).`,
                          confirmText: "Sí, Cancelar Clase",
                          variant: "destructive",
                          onConfirm: () => {
                            setClassesList((prev) =>
                              prev.map((item) =>
                                item.id === c.id
                                  ? {
                                      ...item,
                                      status: "cancelada",
                                      enrolledSpots: {},
                                      releasedSpots: {},
                                      booked: 0,
                                      attendance: {},
                                      waitlist: [],
                                    }
                                  : item,
                              ),
                            );
                            toast.info(
                              `Clase "${c.name}" cancelada. Notificación enviada a todos los inscriptos.`,
                            );
                          },
                        });
                      }}
                    >
                      <Slash className="h-4 w-4" /> Cancelar Clase
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />

                  {/* Eliminar Permanentemente */}
                  <DropdownMenuItem
                    className="rounded-xl cursor-pointer text-xs font-semibold gap-2 py-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                    onClick={() => {
                      setPromptDialog({
                        isOpen: true,
                        title: "Eliminar Clase Definitivamente",
                        description: `¿Eliminar permanentemente "${c.name}"?\n\nPara confirmar, escribe "eliminar". Se notificará a los ${c.booked} alumnos inscriptos.`,
                        placeholder: 'Escribe "eliminar"',
                        confirmText: "Eliminar Definitivamente",
                        variant: "destructive",
                        onConfirm: (confirmWord) => {
                          if (confirmWord?.trim().toLowerCase() === "eliminar") {
                            setClassesList((prev) => prev.filter((item) => item.id !== c.id));
                            onClose();
                            toast.success(`La clase "${c.name}" ha sido eliminada permanentemente.`);
                          } else {
                            toast.error('No escribiste "eliminar". La eliminación ha sido cancelada.');
                          }
                        },
                      });
                    }}
                  >
                    <Trash2 className="h-4 w-4" /> Eliminar Clase
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <button
                type="button"
                onClick={onClose}
                className="h-8 w-8 rounded-full bg-secondary/80 hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors border border-border/60"
                title="Cerrar ventana"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Row 2: Title & Stats on Left, Coach Card on Right */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <div>
              <h2 className="text-2xl font-black text-foreground tracking-tight">{c.name}</h2>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                <span>
                  Horario: <strong className="text-foreground font-bold">{c.time} hs</strong>
                </span>
                <span>·</span>
                <span>
                  Ocupación:{" "}
                  <strong className="text-foreground font-bold">
                    {c.booked} / {c.capacity} cupos
                  </strong>
                </span>
              </p>
            </div>

            {/* Coach Card */}
            <div className="bg-background border border-border/60 p-3 rounded-2xl flex items-center gap-3 shrink-0">
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm border border-primary/20 shrink-0 uppercase">
                {coach?.name
                  ? coach.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                  : "ST"}
              </div>
              <div className="text-xs">
                <span className="text-[10px] text-muted-foreground font-semibold block uppercase tracking-wider">
                  Profesor / Coach
                </span>
                <span className="font-bold text-foreground block">
                  {coach?.name || "Sin asignar"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Body: 2 Columns 50/50 Aligned System */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch w-full">
          {/* Row 2 Left: Lista de Reservas y Asistencia */}
          <div className="group rounded-3xl border border-border bg-card p-5 space-y-4 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg shadow-xs h-full flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border/40">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                  Lista de Reservas y Asistencia
                </span>
                <span className="text-[10px] text-muted-foreground/70 font-semibold uppercase tracking-wider">
                  {c.booked} inscriptos
                </span>
              </div>

              <div className="overflow-x-auto border border-border/40 rounded-2xl bg-secondary/20 max-h-[260px]">
                <table className="w-full text-left text-xs min-w-[380px] border-collapse">
                  <thead>
                    <tr className="border-b border-border/40 bg-secondary/60 text-muted-foreground font-bold text-[10px] uppercase">
                      <th className="p-2.5">Alumno</th>
                      <th className="p-2.5 text-center">Asistencia</th>
                      <th className="p-2.5 text-center">Lugar</th>
                      <th className="p-2.5 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {Object.entries(c.enrolledSpots || {}).map(([spotIdxStr, name]) => {
                      const idx = parseInt(spotIdxStr);
                      const displayName = name;
                      const enriched = getEnrichedStudentInfo(name);

                      const currentAttendance = c.attendance?.[idx] || "pendiente";
                      const attendanceLabels = {
                        pendiente: "Pendiente",
                        presente: "Presente",
                        ausente: "Ausente",
                      };

                      const handleToggleAttendance = () => {
                        const nextStatus =
                          currentAttendance === "pendiente"
                            ? "presente"
                            : currentAttendance === "presente"
                              ? "ausente"
                              : "pendiente";

                        setClassesList((prev) =>
                          prev.map((item) => {
                            if (item.id === c.id) {
                              const copyAtt = { ...(item.attendance || {}) };
                              copyAtt[idx] = nextStatus;
                              return { ...item, attendance: copyAtt };
                            }
                            return item;
                          }),
                        );
                      };

                      return (
                        <tr key={idx} className="hover:bg-background transition-colors">
                          <td className="p-2.5 font-semibold">
                            <div className="flex items-center gap-2">
                              <img
                                src={enriched.photo}
                                alt={displayName}
                                className="h-7 w-7 rounded-full object-cover shrink-0 border border-border/30"
                              />
                              <div className="leading-tight flex flex-col">
                                <span className="font-bold text-foreground text-xs truncate max-w-[120px]">
                                  {displayName}
                                </span>
                                <span className="text-[9.5px] text-muted-foreground">
                                  {enriched.username}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-2.5 text-center">
                            <button
                              type="button"
                              onClick={handleToggleAttendance}
                              className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition whitespace-nowrap ${
                                currentAttendance === "presente"
                                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                  : currentAttendance === "ausente"
                                    ? "bg-destructive/10 border-destructive/20 text-destructive"
                                    : "bg-background border-border text-muted-foreground"
                              }`}
                            >
                              <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle bg-current" />
                              {attendanceLabels[currentAttendance]}
                            </button>
                          </td>
                          <td className="p-2.5 text-center font-bold">
                            <span className="bg-background px-2 py-0.5 rounded font-bold text-[10px] text-foreground border border-border/40">
                              #{idx + 1}
                            </span>
                          </td>
                          <td className="p-2.5 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 rounded-lg hover:bg-secondary border border-transparent hover:border-border/60"
                                  title="Acciones del Alumno"
                                >
                                  <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="w-48 rounded-2xl p-1 shadow-xl border-border"
                              >
                                <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2.5 py-1.5 truncate">
                                  {displayName}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                {/* Marcar Presente */}
                                <DropdownMenuItem
                                  className="rounded-xl cursor-pointer text-xs font-semibold gap-2 py-1.5"
                                  onClick={() => {
                                    setClassesList((prev) =>
                                      prev.map((item) => {
                                        if (item.id === c.id) {
                                          const copyAtt = { ...(item.attendance || {}) };
                                          copyAtt[idx] = "presente";
                                          return { ...item, attendance: copyAtt };
                                        }
                                        return item;
                                      }),
                                    );
                                  }}
                                >
                                  <UserCheck className="h-3.5 w-3.5 text-emerald-500" /> Marcar
                                  Presente
                                </DropdownMenuItem>

                                {/* Marcar Ausente */}
                                <DropdownMenuItem
                                  className="rounded-xl cursor-pointer text-xs font-semibold gap-2 py-1.5"
                                  onClick={() => {
                                    setClassesList((prev) =>
                                      prev.map((item) => {
                                        if (item.id === c.id) {
                                          const copyAtt = { ...(item.attendance || {}) };
                                          copyAtt[idx] = "ausente";
                                          return { ...item, attendance: copyAtt };
                                        }
                                        return item;
                                      }),
                                    );
                                  }}
                                >
                                  <UserX className="h-3.5 w-3.5 text-destructive" /> Marcar
                                  Ausente
                                </DropdownMenuItem>

                                {/* Contactar por WhatsApp */}
                                <DropdownMenuItem
                                  className="rounded-xl cursor-pointer text-xs font-semibold gap-2 py-1.5 text-emerald-600 dark:text-emerald-400"
                                  onClick={() => {
                                    const rawPhone = enriched.phone.replace(/[^0-9]/g, "");
                                    window.open(`https://wa.me/${rawPhone}`, "_blank");
                                  }}
                                >
                                  <MessageCircle className="h-3.5 w-3.5" /> Contactar por WhatsApp
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                {/* Quitar Reserva */}
                                <DropdownMenuItem
                                  className="rounded-xl cursor-pointer text-xs font-semibold gap-2 py-1.5 text-destructive focus:text-destructive focus:bg-destructive/10"
                                  onClick={() => handleCancelSpot(idx, name)}
                                >
                                  <Trash2 className="h-3.5 w-3.5" /> Quitar Reserva
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      );
                    })}
                    {Object.keys(c.enrolledSpots || {}).length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-xs text-muted-foreground italic text-center py-6"
                        >
                          Ningún alumno reservó lugar todavía.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Row 2 Right: Lista de Espera */}
          <div className="group rounded-3xl border border-border bg-card p-5 space-y-4 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg shadow-xs h-full flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border/40">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                  Lista de Espera
                </span>
                <span className="text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  {c.waitlist?.length || 0} en cola
                </span>
              </div>

              {c.waitlist && c.waitlist.length > 0 ? (
                <div className="space-y-2">
                  {c.waitlist.map((wName, wIdx) => (
                    <div
                      key={wIdx}
                      className="flex items-center justify-between p-3 bg-secondary/20 border border-border/40 rounded-xl text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="h-6 w-6 rounded-full bg-background font-bold text-[10px] flex items-center justify-center border border-border/40 text-muted-foreground">
                          #{wIdx + 1}
                        </span>
                        <span className="font-bold text-foreground text-xs">{wName}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setConfirmDialog({
                              isOpen: true,
                              title: "Promover Alumno",
                              description: `¿Confirmas promover a ${wName} para ocupar un lugar vacante en la clase?`,
                              confirmText: "Promover Alumno",
                              onConfirm: () => {
                                setClassesList((prev) =>
                                  prev.map((item) => {
                                    if (item.id === c.id) {
                                      const nextWaitlist = (item.waitlist || []).filter(
                                        (_, idx) => idx !== wIdx,
                                      );
                                      const copySpots = { ...(item.enrolledSpots || {}) };
                                      let nextSpot = 0;
                                      while (copySpots[nextSpot]) nextSpot++;
                                      copySpots[nextSpot] = wName;
                                      return {
                                        ...item,
                                        waitlist: nextWaitlist,
                                        enrolledSpots: copySpots,
                                        booked: Object.keys(copySpots).length,
                                      };
                                    }
                                    return item;
                                  }),
                                );
                                toast.success(`${wName} inscripto en un lugar vacante.`);
                              },
                            });
                          }}
                          className="text-[10.5px] font-bold text-primary hover:underline px-1 py-0.5"
                        >
                          Asignar Lugar
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setConfirmDialog({
                              isOpen: true,
                              title: "Quitar de Lista de Espera",
                              description: `¿Quitar a "${wName}" de la lista de espera?\n\n• Se le enviará una notificación automática al alumno.`,
                              confirmText: "Quitar de la Lista",
                              variant: "destructive",
                              onConfirm: () => {
                                setClassesList((prev) =>
                                  prev.map((item) => {
                                    if (item.id === c.id) {
                                      const nextWaitlist = (item.waitlist || []).filter(
                                        (_, idx) => idx !== wIdx,
                                      );
                                      return { ...item, waitlist: nextWaitlist };
                                    }
                                    return item;
                                  }),
                                );
                                toast.info(
                                  `Alumno "${wName}" removido de la lista de espera.`,
                                );
                              },
                            });
                          }}
                          className="text-destructive hover:bg-destructive/10 p-1.5 rounded-lg transition-colors"
                          title="Quitar de lista de espera"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic py-8 text-center">
                  No hay alumnos en lista de espera para esta clase.
                </p>
              )}
            </div>

            {canManageClasses && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full text-xs font-bold border-border/60 hover:bg-secondary rounded-xl py-2 mt-2"
                onClick={() => onOpenWaitlistModal(c)}
              >
                + Sumar Alumno a Lista de Espera
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
