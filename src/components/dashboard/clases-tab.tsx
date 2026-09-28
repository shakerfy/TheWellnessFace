import React, { useState, useMemo, Fragment } from "react";
import { toast } from "sonner";
import {
  GymClassItem,
  ClasesTabProps,
  ConfirmDialogState,
  PromptDialogState,
  CancelSpotDialogState,
  DEFAULT_MEMBERS,
  computeAvailabilityWarning,
  computeConflictWarning,
  filterStaffByActivity,
  ClassCalendarView,
  ClassListView,
  ClassFormDialog,
  ClassDetailDialog,
  ClassStatsToolbar,
  ClassFilterBar,
  ClassModalsHost,
} from "./clases";

export type { GymClassItem, ClasesTabProps };

export function ClasesTab({
  classesList,
  setClassesList,
  staffList,
  canManageClasses,
  blackoutDays,
  salasList,
  cancellationPolicyHours,
  membersList,
}: ClasesTabProps) {
  const activeBlackout = blackoutDays.find((b) => b.date === "2026-06-29");
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  // Form states
  const [name, setName] = useState("");
  const [staffId, setStaffId] = useState("");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("09:00");
  const [creditsCost, setCreditsCost] = useState("1");
  const [salaId, setSalaId] = useState("");
  const [day, setDay] = useState(0);
  const [customCapacity, setCustomCapacity] = useState(20);
  const [isRecurrent, setIsRecurrent] = useState(false);
  const [recurrentWeeks, setRecurrentWeeks] = useState(4);

  // View mode and filters
  const [viewMode, setViewMode] = useState<"list" | "calendar">("calendar");
  const [selectedCalendarSalaId, setSelectedCalendarSalaId] = useState("");
  const [selectedFilterCoachId, setSelectedFilterCoachId] = useState("");
  const [selectedFilterActivity, setSelectedFilterActivity] = useState("");

  // Modals state
  const [enrollModalClass, setEnrollModalClass] =
    useState<GymClassItem | null>(null);
  const [enrollTargetSpotIndex, setEnrollTargetSpotIndex] = useState<
    number | null
  >(null);
  const [enrollSearchTerm, setEnrollSearchTerm] = useState("");
  const [enrollPlanFilter, setEnrollPlanFilter] = useState("todos");

  const [waitlistModalClass, setWaitlistModalClass] =
    useState<GymClassItem | null>(null);
  const [waitlistSearchTerm, setWaitlistSearchTerm] = useState("");
  const [waitlistPlanFilter, setWaitlistPlanFilter] = useState("todos");

  const [confirmDialog, setConfirmDialog] =
    useState<ConfirmDialogState | null>(null);
  const [promptDialog, setPromptDialog] = useState<PromptDialogState | null>(
    null,
  );
  const [promptInputValue, setPromptInputValue] = useState("");

  const [cancelSpotDialog, setCancelSpotDialog] =
    useState<CancelSpotDialogState | null>(null);
  const [cancelOption, setCancelOption] = useState<"refund" | "rereserva">(
    "refund",
  );

  const [substituteCoachModalClass, setSubstituteCoachModalClass] =
    useState<GymClassItem | null>(null);
  const [substituteSearchTerm, setSubstituteSearchTerm] = useState("");

  const time = `${startTime}-${endTime}`;

  const availableCoachesToSubstitute = useMemo(() => {
    const filtered = (staffList || []).filter((s) => {
      if (!substituteSearchTerm) return true;
      const term = substituteSearchTerm.toLowerCase();
      const specs = (s.specialties || []).map((sp) => sp.toLowerCase());
      return (
        s.name?.toLowerCase().includes(term) ||
        s.specialty?.toLowerCase().includes(term) ||
        specs.some((sp) => sp.includes(term))
      );
    });

    if (!substituteCoachModalClass) return filtered;

    const classActName = (substituteCoachModalClass.name || "").toLowerCase();

    return [...filtered].sort((a, b) => {
      const aSpecs = (a.specialties || []).map((sp) => sp.toLowerCase());
      const bSpecs = (b.specialties || []).map((sp) => sp.toLowerCase());

      const aMatch =
        aSpecs.some(
          (sp) => sp.includes(classActName) || classActName.includes(sp),
        ) || a.specialty?.toLowerCase().includes(classActName);
      const bMatch =
        bSpecs.some(
          (sp) => sp.includes(classActName) || classActName.includes(sp),
        ) || b.specialty?.toLowerCase().includes(classActName);

      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0;
    });
  }, [staffList, substituteSearchTerm, substituteCoachModalClass]);

  const activeMembersList = membersList || DEFAULT_MEMBERS;

  const availableMembersToEnroll = useMemo(() => {
    return activeMembersList.filter((m: any) => {
      const matchesSearch =
        !enrollSearchTerm ||
        m.name?.toLowerCase().includes(enrollSearchTerm.toLowerCase()) ||
        m.phone?.includes(enrollSearchTerm) ||
        m.email?.toLowerCase().includes(enrollSearchTerm.toLowerCase());

      const matchesPlan =
        enrollPlanFilter === "todos" ||
        m.plan?.toLowerCase() === enrollPlanFilter.toLowerCase();

      return matchesSearch && matchesPlan;
    });
  }, [activeMembersList, enrollSearchTerm, enrollPlanFilter]);

  const availableMembersToWaitlist = useMemo(() => {
    return activeMembersList.filter((m: any) => {
      const matchesSearch =
        !waitlistSearchTerm ||
        m.name?.toLowerCase().includes(waitlistSearchTerm.toLowerCase()) ||
        m.phone?.includes(waitlistSearchTerm) ||
        m.email?.toLowerCase().includes(waitlistSearchTerm.toLowerCase());

      const matchesPlan =
        waitlistPlanFilter === "todos" ||
        m.plan?.toLowerCase() === waitlistPlanFilter.toLowerCase();

      return matchesSearch && matchesPlan;
    });
  }, [activeMembersList, waitlistSearchTerm, waitlistPlanFilter]);

  const availabilityWarning = useMemo(
    () => computeAvailabilityWarning(staffId, time, day, staffList),
    [staffId, time, day, staffList],
  );

  const conflictWarning = useMemo(
    () =>
      computeConflictWarning(
        staffId,
        time,
        day,
        classesList,
        editingClassId,
      ),
    [staffId, time, day, classesList, editingClassId],
  );

  const filteredStaffForClass = useMemo(
    () => filterStaffByActivity(name, staffList),
    [name, staffList],
  );

  const staffForClassOptions = useMemo(() => {
    const list =
      filteredStaffForClass.length > 0 ? filteredStaffForClass : staffList;
    if (staffId && !list.some((s) => s.id === staffId)) {
      const selectedCoach = staffList.find((s) => s.id === staffId);
      if (selectedCoach) {
        return [selectedCoach, ...list];
      }
    }
    return list;
  }, [filteredStaffForClass, staffList, staffId]);

  const handleEnrollMemberInClass = (memberName: string) => {
    if (!enrollModalClass) return;
    setClassesList((prev) =>
      prev.map((item) => {
        if (item.id === enrollModalClass.id) {
          const copySpots = { ...(item.enrolledSpots || {}) };
          let targetIdx = enrollTargetSpotIndex;
          if (targetIdx === null || copySpots[targetIdx]) {
            targetIdx = 0;
            while (copySpots[targetIdx]) {
              targetIdx++;
            }
          }
          copySpots[targetIdx] = memberName;
          return {
            ...item,
            enrolledSpots: copySpots,
            booked: Object.keys(copySpots).length,
          };
        }
        return item;
      }),
    );
    const spotLabel =
      enrollTargetSpotIndex !== null
        ? ` en el Lugar #${enrollTargetSpotIndex + 1}`
        : "";
    toast.success(
      `Alumno "${memberName}" inscrito exitosamente${spotLabel} en "${enrollModalClass.name}". Notificación enviada.`,
    );
    setEnrollModalClass(null);
    setEnrollTargetSpotIndex(null);
  };

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !staffId || !time) return;

    if (conflictWarning) {
      setConfirmDialog({
        isOpen: true,
        title: "Conflicto de Horario del Entrenador",
        description: conflictWarning,
        confirmText: "Entendido",
        variant: "destructive",
        onConfirm: () => {},
      });
      toast.error(conflictWarning, { duration: 5000 });
      return;
    }

    const finalCap = Number(customCapacity) || 20;

    if (editingClassId) {
      setClassesList((prev) =>
        prev.map((c) => {
          if (c.id === editingClassId) {
            return {
              ...c,
              name,
              staffId,
              time,
              capacity: finalCap,
              salaId: salaId || undefined,
              day: day,
              creditsCost: parseInt(creditsCost) || 1,
            };
          }
          return c;
        }),
      );
      setEditingClassId(null);
    } else {
      if (isRecurrent) {
        const generatedClasses: GymClassItem[] = [];
        for (let i = 0; i < recurrentWeeks; i++) {
          generatedClasses.push({
            id: `recurrent-${Math.random()}`,
            name,
            staffId,
            time,
            capacity: finalCap,
            booked: 0,
            enrolledSpots: {},
            salaId: salaId || undefined,
            day: day,
            creditsCost: parseInt(creditsCost) || 1,
            status: "activa",
            weekOffset: i,
          });
        }
        setClassesList((prev) => [...prev, ...generatedClasses]);
      } else {
        const newClass: GymClassItem = {
          id: Math.random().toString(),
          name,
          staffId,
          time,
          capacity: finalCap,
          booked: 0,
          enrolledSpots: {},
          salaId: salaId || undefined,
          day: day,
          creditsCost: parseInt(creditsCost) || 1,
          status: "activa",
          weekOffset: 0,
        };
        setClassesList((prev) => [...prev, newClass]);
      }
    }

    setName("");
    setStaffId("");
    setStartTime("08:00");
    setEndTime("09:00");
    setSalaId("");
    setDay(0);
    setCreditsCost("1");
    setCustomCapacity(20);
    setShowAddForm(false);
  };

  const filteredClasses = useMemo(() => {
    return classesList.filter((c) => {
      const matchesWeek = (c.weekOffset || 0) === currentWeekOffset;
      const matchesSala = selectedCalendarSalaId
        ? c.salaId === selectedCalendarSalaId
        : true;
      const matchesCoach =
        !selectedFilterCoachId || c.staffId === selectedFilterCoachId;
      const matchesActivity =
        !selectedFilterActivity || c.name === selectedFilterActivity;
      return matchesWeek && matchesSala && matchesCoach && matchesActivity;
    });
  }, [
    classesList,
    currentWeekOffset,
    selectedCalendarSalaId,
    selectedFilterCoachId,
    selectedFilterActivity,
  ]);

  const classesForToday = useMemo(() => {
    return filteredClasses.filter((c) => c.day === 0);
  }, [filteredClasses]);

  const stats = useMemo(() => {
    const todayClasses = classesList.filter((c) => {
      const matchesWeek = (c.weekOffset || 0) === currentWeekOffset;
      return c.day === 0 && matchesWeek;
    });
    const totalBooked = todayClasses.reduce(
      (acc, c) => acc + (c.booked || 0),
      0,
    );
    const totalCapacity = todayClasses.reduce(
      (acc, c) => acc + (c.capacity || 0),
      0,
    );
    const avgOccupancy =
      totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0;
    const fullClasses = todayClasses.filter((c) => c.booked >= c.capacity).length;

    return {
      avgOccupancy,
      totalBooked,
      fullClasses,
    };
  }, [classesList, currentWeekOffset]);

  const isSecondaryModalOpen =
    !!enrollModalClass ||
    !!substituteCoachModalClass ||
    !!waitlistModalClass ||
    !!confirmDialog?.isOpen ||
    !!promptDialog?.isOpen ||
    !!cancelSpotDialog?.isOpen;

  return (
    <Fragment>
      {/* Secondary Modals & Dialogs Host */}
      <ClassModalsHost
        enrollModalClass={enrollModalClass}
        enrollTargetSpotIndex={enrollTargetSpotIndex}
        enrollSearchTerm={enrollSearchTerm}
        setEnrollSearchTerm={setEnrollSearchTerm}
        enrollPlanFilter={enrollPlanFilter}
        setEnrollPlanFilter={setEnrollPlanFilter}
        availableMembersToEnroll={availableMembersToEnroll}
        onEnrollMember={handleEnrollMemberInClass}
        onCloseEnrollModal={() => {
          setEnrollModalClass(null);
          setEnrollTargetSpotIndex(null);
        }}
        waitlistModalClass={waitlistModalClass}
        waitlistSearchTerm={waitlistSearchTerm}
        setWaitlistSearchTerm={setWaitlistSearchTerm}
        waitlistPlanFilter={waitlistPlanFilter}
        setWaitlistPlanFilter={setWaitlistPlanFilter}
        availableMembersToWaitlist={availableMembersToWaitlist}
        onAddToWaitlist={(studentName) => {
          if (!waitlistModalClass) return;
          setClassesList((prev) =>
            prev.map((item) => {
              if (item.id === waitlistModalClass.id) {
                const currentWaitlist = item.waitlist || [];
                return { ...item, waitlist: [...currentWaitlist, studentName] };
              }
              return item;
            }),
          );
          toast.success(`${studentName} registrado en la lista de espera.`);
          setWaitlistModalClass(null);
          setWaitlistSearchTerm("");
        }}
        onCloseWaitlistModal={() => {
          setWaitlistModalClass(null);
          setWaitlistSearchTerm("");
        }}
        substituteCoachModalClass={substituteCoachModalClass}
        substituteSearchTerm={substituteSearchTerm}
        setSubstituteSearchTerm={setSubstituteSearchTerm}
        availableCoachesToSubstitute={availableCoachesToSubstitute}
        onAssignSubstitute={(s) => {
          if (!substituteCoachModalClass) return;
          const coachName = s.name;
          setClassesList((prev) =>
            prev.map((item) =>
              item.id === substituteCoachModalClass.id
                ? { ...item, staffId: s.id, coach: coachName }
                : item,
            ),
          );
          toast.success(`Profesor ${coachName} asignado como sustituto.`);
          setSubstituteCoachModalClass(null);
          setSubstituteSearchTerm("");
        }}
        onCloseSubstituteModal={() => {
          setSubstituteCoachModalClass(null);
          setSubstituteSearchTerm("");
        }}
        cancelSpotDialog={cancelSpotDialog}
        cancelOption={cancelOption}
        setCancelOption={setCancelOption}
        onConfirmCancelSpot={() => {
          if (!cancelSpotDialog) return;
          const { c, index, studentName, displayNameForConfirm } =
            cancelSpotDialog;

          if (cancelOption === "rereserva") {
            setClassesList((prev) =>
              prev.map((item) => {
                if (item.id === c.id) {
                  const copySpots = { ...item.enrolledSpots };
                  delete copySpots[index];
                  const copyReleased = { ...(item.releasedSpots || {}) };
                  copyReleased[index] = {
                    originalStudent: studentName,
                    creditsCost: c.creditsCost || 1,
                  };
                  const copyAtt = { ...item.attendance };
                  delete copyAtt[index];
                  return {
                    ...item,
                    enrolledSpots: copySpots,
                    releasedSpots: copyReleased,
                    attendance: copyAtt,
                    booked: Object.keys(copySpots).length,
                  };
                }
                return item;
              }),
            );
            toast.info(
              `Lugar #${index + 1} liberado bajo modalidad "Disponible para Re-reserva".`,
            );
          } else {
            setClassesList((prev) =>
              prev.map((item) => {
                if (item.id === c.id) {
                  const copySpots = { ...item.enrolledSpots };
                  delete copySpots[index];
                  const copyAtt = { ...item.attendance };
                  delete copyAtt[index];
                  return {
                    ...item,
                    enrolledSpots: copySpots,
                    attendance: copyAtt,
                    booked: Object.keys(copySpots).length,
                  };
                }
                return item;
              }),
            );
            toast.success(
              `Reserva de ${displayNameForConfirm} cancelada. Crédito reembolsado automáticamente.`,
            );
          }
          setCancelSpotDialog(null);
        }}
        onCloseCancelSpot={() => setCancelSpotDialog(null)}
        confirmDialog={confirmDialog}
        onCloseConfirmDialog={() => setConfirmDialog(null)}
        promptDialog={promptDialog}
        promptInputValue={promptInputValue}
        setPromptInputValue={setPromptInputValue}
        onClosePromptDialog={() => {
          setPromptDialog(null);
          setPromptInputValue("");
        }}
      />

      {/* Header Toolbar & Quick Stats */}
      <ClassStatsToolbar
        currentWeekOffset={currentWeekOffset}
        setCurrentWeekOffset={setCurrentWeekOffset}
        viewMode={viewMode}
        setViewMode={setViewMode}
        canManageClasses={canManageClasses}
        onOpenCreateClass={() => {
          setEditingClassId(null);
          setName("");
          setStaffId("");
          setStartTime("08:00");
          setEndTime("09:00");
          setSalaId("");
          setDay(0);
          setCreditsCost("1");
          setCustomCapacity(20);
          setShowAddForm(true);
        }}
        stats={stats}
      />

      {/* Barra de Filtros */}
      <ClassFilterBar
        salasList={salasList}
        staffList={staffList}
        classesList={classesList}
        selectedCalendarSalaId={selectedCalendarSalaId}
        setSelectedCalendarSalaId={setSelectedCalendarSalaId}
        selectedFilterCoachId={selectedFilterCoachId}
        setSelectedFilterCoachId={setSelectedFilterCoachId}
        selectedFilterActivity={selectedFilterActivity}
        setSelectedFilterActivity={setSelectedFilterActivity}
      />

      {/* Modal Dialog: Crear / Editar Clase */}
      <ClassFormDialog
        open={showAddForm}
        onOpenChange={setShowAddForm}
        editingClassId={editingClassId}
        name={name}
        setName={setName}
        staffId={staffId}
        setStaffId={setStaffId}
        startTime={startTime}
        setStartTime={setStartTime}
        endTime={endTime}
        setEndTime={setEndTime}
        salaId={salaId}
        setSalaId={setSalaId}
        day={day}
        setDay={setDay}
        creditsCost={creditsCost}
        setCreditsCost={setCreditsCost}
        customCapacity={customCapacity}
        setCustomCapacity={setCustomCapacity}
        isRecurrent={isRecurrent}
        setIsRecurrent={setIsRecurrent}
        recurrentWeeks={recurrentWeeks}
        setRecurrentWeeks={setRecurrentWeeks}
        salasList={salasList}
        staffForClassOptions={staffForClassOptions}
        filteredStaffForClass={filteredStaffForClass}
        availabilityWarning={availabilityWarning}
        conflictWarning={conflictWarning}
        onSubmit={handleAddClass}
      />

      {/* Main content grid based on viewMode */}
      {viewMode === "list" ? (
        <ClassListView
          classesForToday={classesForToday}
          salasList={salasList}
          staffList={staffList}
          activeBlackout={activeBlackout}
          selectedClassId={selectedClass}
          onSelectClass={setSelectedClass}
        />
      ) : (
        <ClassCalendarView
          classesList={classesList}
          filteredClasses={filteredClasses}
          currentWeekOffset={currentWeekOffset}
          staffList={staffList}
          selectedClassId={selectedClass}
          onSelectClass={setSelectedClass}
        />
      )}

      {/* Detalle de Clase Dialog */}
      <ClassDetailDialog
        selectedClassId={selectedClass}
        onClose={() => setSelectedClass(null)}
        classesList={classesList}
        setClassesList={setClassesList}
        staffList={staffList}
        salasList={salasList}
        canManageClasses={canManageClasses}
        cancellationPolicyHours={cancellationPolicyHours}
        onOpenEnrollModal={(cls) => setEnrollModalClass(cls)}
        onOpenSubstituteModal={(cls) => {
          setSubstituteSearchTerm("");
          setSubstituteCoachModalClass(cls);
        }}
        onOpenWaitlistModal={(cls) => {
          setWaitlistSearchTerm("");
          setWaitlistPlanFilter("todos");
          setWaitlistModalClass(cls);
        }}
        onEditClass={(c) => {
          setName(c.name);
          setStaffId(c.staffId);
          const parts = c.time.split("-");
          setStartTime(parts[0]?.trim() || "08:00");
          setEndTime(parts[1]?.trim() || "09:00");
          setCreditsCost((c.creditsCost || 1).toString());
          setSalaId(c.salaId || "");
          setDay(c.day);
          setCustomCapacity(c.capacity || 20);
          setEditingClassId(c.id);
          setShowAddForm(true);
          setSelectedClass(null);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        setConfirmDialog={setConfirmDialog}
        setPromptDialog={setPromptDialog}
        setCancelSpotDialog={setCancelSpotDialog}
        setCancelOption={setCancelOption}
        isSecondaryModalOpen={isSecondaryModalOpen}
      />
    </Fragment>
  );
}
