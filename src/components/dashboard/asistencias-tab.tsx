import { useState, useMemo } from "react";
import { DoorOpen, Search, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getStudentPhoto } from "./dashboard-utils";
import {
  INITIAL_ATTENDANCE_HISTORY,
  INITIAL_RECENT_CHECKINS,
  AsistenciasMetrics,
  RecentCheckinsMonitor,
  AsistenciasHistoryTable,
  ReceptionCheckinModal,
  type AsistenciasTabProps,
  type AttendanceHistoryItem,
  type RecentCheckinItem,
} from "./asistencias";

export function AsistenciasTab({
  blackoutDays,
  membersList = [],
  classesList = [],
  setClassesList,
  currentUser,
}: AsistenciasTabProps) {
  const [historySearch, setHistorySearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("Todos");
  const [dateFilter, setDateFilter] = useState("Todos");
  const [historyList] = useState<AttendanceHistoryItem[]>(INITIAL_ATTENDANCE_HISTORY);
  const [recentCheckinsList, setRecentCheckinsList] = useState<RecentCheckinItem[]>(INITIAL_RECENT_CHECKINS);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [receptionSearchTerm, setReceptionSearchTerm] = useState("");

  // Map member bookings for today's classes
  const memberBookings = useMemo(() => {
    const map: Record<
      string,
      { classId: string; className: string; time: string; spotIndex: number; isPresent: boolean }[]
    > = {};

    (classesList || []).forEach((c: any) => {
      Object.entries(c.enrolledSpots || {}).forEach(([spotIdxStr, studentName]) => {
        const key = (studentName as string).toLowerCase().trim();
        if (!map[key]) map[key] = [];
        const spotIndex = Number(spotIdxStr);
        const isPresent = c.attendance?.[spotIndex] === "present";
        map[key].push({
          classId: c.id,
          className: c.name,
          time: c.time,
          spotIndex,
          isPresent,
        });
      });
    });

    return map;
  }, [classesList]);

  const availableMembersForCheckIn = useMemo(() => {
    const list = membersList || [];
    if (!receptionSearchTerm.trim()) {
      return [...list].sort((a: any, b: any) => {
        const aKey = a.name.toLowerCase().trim();
        const bKey = b.name.toLowerCase().trim();
        const aHasRes = (memberBookings[aKey] || []).length > 0;
        const bHasRes = (memberBookings[bKey] || []).length > 0;
        if (aHasRes && !bHasRes) return -1;
        if (!aHasRes && bHasRes) return 1;
        return 0;
      });
    }

    const term = receptionSearchTerm.toLowerCase().trim();
    return list.filter((m: any) => {
      return (
        m.name.toLowerCase().includes(term) ||
        (m.dni && m.dni.includes(term)) ||
        (m.phone && m.phone.includes(term))
      );
    });
  }, [membersList, receptionSearchTerm, memberBookings]);

  // Filtering history by search, method and date
  const filteredHistory = useMemo(() => {
    return historyList.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(historySearch.toLowerCase()) ||
        item.class.toLowerCase().includes(historySearch.toLowerCase());
      if (!matchesSearch) return false;

      // Method Filter
      if (methodFilter !== "Todos" && item.method !== methodFilter) return false;

      // Date Filter
      if (dateFilter === "Hoy" && item.date !== "Hoy") return false;
      if (dateFilter === "Ayer" && item.date !== "Ayer") return false;
      if (dateFilter === "Esta Semana" && item.date !== "Hoy" && item.date !== "Ayer") return false;

      return true;
    });
  }, [historyList, historySearch, methodFilter, dateFilter]);

  const handleContactNoAttendanceMember = (memberName: string) => {
    const member = (membersList || []).find(
      (m: any) => m.name.toLowerCase().trim() === memberName.toLowerCase().trim(),
    );

    const actualGymName = (currentUser as any)?.gymName || "Kraft Strength Club";

    const messageText = `Hola ${memberName}, ¡te extrañamos en ${actualGymName}! 👋 Notamos que hace unos días no registras asistencia a tus clases. ¿Cómo venís con tus entrenamientos? Avisanos si necesitas ayuda para agendar tus horarios. 💪`;

    if (member?.phone) {
      const cleanPhone = member.phone.replace(/[^0-9]/g, "");
      const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;
      window.open(waUrl, "_blank");
      toast.success(`Redirigiendo a WhatsApp para enviar mensaje a ${memberName}...`);
      return;
    }

    if (member?.email) {
      const subject = encodeURIComponent(`¡Te extrañamos en ${actualGymName}!`);
      const body = encodeURIComponent(messageText);
      window.open(`mailto:${member.email}?subject=${subject}&body=${body}`, "_blank");
      toast.success(`Abriendo cliente de correo para contactar a ${memberName}...`);
      return;
    }

    toast.error(`No hay teléfono ni correo registrado en la ficha de ${memberName}.`);
  };

  const handleExport = () => {
    const csvHeader = "Nombre,Fecha,Hora,Metodo,Estado,Detalle,Clase\n";
    const csvRows = filteredHistory
      .map(
        (h) =>
          `"${h.name}","${h.date}","${h.time}","${h.method}","${h.status}","${h.distance}","${h.class}"`,
      )
      .join("\n");
    const blob = new Blob([csvHeader + csvRows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `asistencias_gimnasio_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmClassCheckIn = (member: any, booking: any, isAptoExpired: boolean) => {
    // Perform checkin for this class
    setClassesList?.((prev: any[]) =>
      prev.map((c) => {
        if (c.id === booking.classId) {
          const copyAtt = { ...(c.attendance || {}) };
          copyAtt[booking.spotIndex] = "present";
          return { ...c, attendance: copyAtt };
        }
        return c;
      }),
    );

    // Add to recent checkins list
    const nowTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setRecentCheckinsList((prev) => [
      {
        name: member.name,
        time: nowTime,
        method: "Recepción",
        alert: isAptoExpired ? "Apto Pendiente" : null,
        alertColor: isAptoExpired ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : "",
        photo: member.photo || getStudentPhoto(member.name),
      },
      ...prev,
    ]);

    toast.success(
      `✓ Check-in exitoso: ${member.name} ingresó a ${booking.className} (${booking.time} hs)`,
    );
    setIsCheckInModalOpen(false);
  };

  const handleConfirmGeneralCheckIn = (member: any, isAptoExpired: boolean) => {
    const nowTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setRecentCheckinsList((prev) => [
      {
        name: member.name,
        time: nowTime,
        method: "Recepción",
        alert: isAptoExpired ? "Apto Pendiente" : null,
        alertColor: isAptoExpired ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : "",
        photo: member.photo || getStudentPhoto(member.name),
      },
      ...prev,
    ]);
    toast.success(`✓ Ingreso general a sala registrado para ${member.name}`);
    setIsCheckInModalOpen(false);
  };

  const activeBlackout = blackoutDays.find((b) => b.date === "2026-06-29");

  return (
    <div className="space-y-8">
      {activeBlackout && (
        <div className="p-4 bg-destructive/10 border border-destructive/30 text-destructive rounded-3xl text-xs font-semibold flex items-center gap-3 shadow-md shadow-destructive/10 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div>
            <div className="font-bold">Sede Cerrada por Día de Cierre / Feriado</div>
            <div className="text-[11px] text-destructive/80 mt-0.5">
              Motivo: {activeBlackout.reason}. Los check-ins de hoy están inhabilitados.
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Metrics Header (Occupancy & Access Methods Breakdown) */}
      <AsistenciasMetrics />

      {/* Control de Acceso (Check-in en Recepción) */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <DoorOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-foreground">
              Control de Acceso (Check-in en Recepción)
            </h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed pl-1">
            Valida el ingreso presencial de los socios. Detecta automáticamente sus reservas de
            clases para el día de hoy.
          </p>
        </div>

        <Button
          onClick={() => {
            setReceptionSearchTerm("");
            setIsCheckInModalOpen(true);
          }}
          className="rounded-2xl font-bold text-xs gap-2 shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs px-5 h-10 cursor-pointer"
        >
          <Search className="h-4 w-4" /> Buscar Socio para Check-in
        </Button>
      </div>

      {/* Live Feed & Recent Checkins Monitor + Churn Risk */}
      <RecentCheckinsMonitor
        recentCheckinsList={recentCheckinsList}
        membersList={membersList}
        onContactMember={handleContactNoAttendanceMember}
      />

      {/* General History Table with Date, Method & Action Filters */}
      <AsistenciasHistoryTable
        historyList={historyList}
        filteredHistory={filteredHistory}
        historySearch={historySearch}
        onSearchChange={setHistorySearch}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        methodFilter={methodFilter}
        onMethodFilterChange={setMethodFilter}
        onClearFilters={() => {
          setHistorySearch("");
          setDateFilter("Todos");
          setMethodFilter("Todos");
        }}
        onExport={handleExport}
      />

      {/* Modal Shadcn UI: Check-in en Recepción & Validación Presencial */}
      <ReceptionCheckinModal
        open={isCheckInModalOpen}
        onOpenChange={setIsCheckInModalOpen}
        searchTerm={receptionSearchTerm}
        onSearchTermChange={setReceptionSearchTerm}
        availableMembers={availableMembersForCheckIn}
        memberBookings={memberBookings}
        onConfirmClassCheckIn={handleConfirmClassCheckIn}
        onConfirmGeneralCheckIn={handleConfirmGeneralCheckIn}
      />
    </div>
  );
}
