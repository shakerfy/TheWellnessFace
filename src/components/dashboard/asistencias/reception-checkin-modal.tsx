import { DoorOpen, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getStudentPhoto } from "../dashboard-utils";

export interface ReceptionCheckinModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  availableMembers: any[];
  memberBookings: Record<
    string,
    { classId: string; className: string; time: string; spotIndex: number; isPresent: boolean }[]
  >;
  onConfirmClassCheckIn: (member: any, booking: any, isAptoExpired: boolean) => void;
  onConfirmGeneralCheckIn: (member: any, isAptoExpired: boolean) => void;
}

export function ReceptionCheckinModal({
  open,
  onOpenChange,
  searchTerm,
  onSearchTermChange,
  availableMembers,
  memberBookings,
  onConfirmClassCheckIn,
  onConfirmGeneralCheckIn,
}: ReceptionCheckinModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[85vh] rounded-3xl p-6 border-border shadow-2xl bg-slate-50 dark:bg-background overflow-hidden flex flex-col">
        <DialogHeader className="pb-3 border-b border-border/40 shrink-0">
          <DialogTitle className="text-lg font-black text-foreground flex items-center gap-2">
            <DoorOpen className="h-5 w-5 text-amber-500" /> Check-in en Recepción (Validación Presencial)
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed pt-1">
            Busca un alumno por nombre, DNI o teléfono. El sistema resalta automáticamente a los socios con reserva en las clases de hoy.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-3 overflow-hidden flex flex-col flex-1">
          {/* Buscador */}
          <div className="relative shrink-0">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por DNI, Nombre o Teléfono..."
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              className="pl-10 rounded-xl text-xs bg-secondary/30 border-border/60 h-10"
              autoFocus
            />
          </div>

          {/* Lista de Alumnos */}
          <div className="max-h-[380px] overflow-y-auto custom-scrollbar space-y-2.5 pr-1 flex-1">
            {availableMembers.map((m: any) => {
              const nameKey = (m.name || "").toLowerCase().trim();
              const bookings = memberBookings[nameKey] || [];
              const activeBooking = bookings.find((b) => !b.isPresent) || bookings[0];

              const isAptoExpired =
                m.hasApto !== "Entregado" ||
                (m.hasApto === "Entregado" && m.aptoExp && new Date(m.aptoExp) < new Date());

              return (
                <div
                  key={m.name || m.id}
                  className="p-3.5 rounded-2xl border border-border/60 bg-card hover:bg-secondary/30 transition-all space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={m.photo || getStudentPhoto(m.name)}
                        alt={m.name}
                        className="h-10 w-10 rounded-full object-cover shrink-0 border border-border/60 shadow-2xs"
                      />
                      <div className="leading-tight min-w-0">
                        <span className="font-bold text-xs text-foreground block truncate">
                          {m.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1.5 flex-wrap mt-0.5">
                          <span className="bg-primary/10 text-primary px-1.5 py-0.2 rounded font-bold">
                            {m.plan || "Pase Libre"}
                          </span>
                          <span>· DNI: {m.dni || "38.412.901"}</span>
                          <span>· {m.status || "Activo"}</span>
                        </span>
                      </div>
                    </div>

                    {/* Apto físico badge */}
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 border",
                        isAptoExpired
                          ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
                      )}
                    >
                      {isAptoExpired ? "Apto Pendiente" : "Apto Vigente"}
                    </span>
                  </div>

                  {/* Ficha de Reserva Próxima de la Clase */}
                  {activeBooking ? (
                    <div className="p-2.5 rounded-xl bg-secondary/50 border border-border/40 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="relative flex h-2 w-2 shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        <div className="text-[11px] font-medium text-foreground truncate">
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            Reserva Próxima Hoy:
                          </span>{" "}
                          {activeBooking.className} ({activeBooking.time} hs)
                        </div>
                      </div>

                      {activeBooking.isPresent ? (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20 shrink-0">
                          ✓ Presente
                        </span>
                      ) : (
                        <Button
                          type="button"
                          size="sm"
                          className="h-7 text-[11px] font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs shrink-0 px-3 cursor-pointer"
                          onClick={() => onConfirmClassCheckIn(m, activeBooking, isAptoExpired)}
                        >
                          Confirmar Check-in
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="p-2 rounded-xl bg-secondary/30 flex items-center justify-between gap-2">
                      <span className="text-[10.5px] text-muted-foreground italic">
                        Sin reservas próximas para hoy.
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 text-[10.5px] font-bold rounded-xl shrink-0 cursor-pointer"
                        onClick={() => onConfirmGeneralCheckIn(m, isAptoExpired)}
                      >
                        Ingreso General
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}

            {availableMembers.length === 0 && (
              <p className="text-xs text-muted-foreground italic text-center py-8">
                No se encontraron alumnos que coincidan con la búsqueda.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
