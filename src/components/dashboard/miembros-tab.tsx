import React, { useState, useMemo } from "react";
import { Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  MemberItem,
  MemberPayment,
  MiembrosTabProps,
  getStatusBadgeColor,
  getExpirationDateForPlan,
  computeMemberStats,
  exportMembersToCsv,
  MemberKpis,
  MemberTable,
  MemberFormDialog,
  RenewMemberModal,
  CancelConfirmModal,
  CantDeleteWarningModal,
  FreezeMemberModal,
  ReceiptModal,
} from "./miembros";

export type { MemberItem, MemberPayment, MiembrosTabProps };

export function MiembrosTab({
  classesList,
  membersList,
  setMembersList,
  membershipsList,
  setCashTransactions,
  currentUser,
}: MiembrosTabProps) {
  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState("name_asc");

  // Renewal state
  const [renewMemberId, setRenewMemberId] = useState<string | null>(null);
  const [renewPlan, setRenewPlan] = useState<string>("");
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [renewMonths, setRenewMonths] = useState<string>("1");
  const [renewPaymentMethod, setRenewPaymentMethod] = useState<string>("Efectivo");
  const [mpRenewAction, setMpRenewAction] = useState<"skip" | "cancel">("skip");

  // Receipt and confirmation states
  const [viewingReceipt, setViewingReceipt] = useState<{
    member: MemberItem;
    payment: MemberPayment;
  } | null>(null);
  const [cancelConfirmMember, setCancelConfirmMember] = useState<MemberItem | null>(null);
  const [cantDeleteWarningMember, setCantDeleteWarningMember] = useState<MemberItem | null>(null);
  const [freezeDialogMember, setFreezeDialogMember] = useState<string | null>(null);
  const [freezeDaysInput, setFreezeDaysInput] = useState<string>("15");

  // Form state
  const [newMember, setNewMember] = useState<MemberItem>({
    name: "",
    phone: "",
    email: "",
    dni: "",
    dob: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    medicalInsurance: "",
    affiliateNumber: "",
    hasApto: "Pendiente",
    aptoExp: "",
    plan: "",
    paymentMethod: "Efectivo",
    status: "activo",
    end: "",
    medicalNotes: "",
    aptoDocUrl: "",
  });

  const filteredMembers = useMemo(() => {
    const result = membersList.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        Boolean(m.dni && m.dni.includes(searchTerm));
      if (!matchesSearch) return false;

      if (filterStatus === "all") return m.status !== "cancelado";
      if (filterStatus === "activos") return m.status === "activo";
      if (filterStatus === "vencidos") return m.status === "vencido" || m.status === "pendiente";
      if (filterStatus === "congelados") return m.status === "congelado";
      if (filterStatus === "archivados") return m.status === "cancelado";
      if (filterStatus === "apto")
        return (
          m.hasApto !== "Entregado" ||
          Boolean(m.hasApto === "Entregado" && m.aptoExp && new Date(m.aptoExp) < new Date())
        );
      return true;
    });

    return result.sort((a, b) => {
      if (sortOrder === "name_asc") return a.name.localeCompare(b.name);
      if (sortOrder === "name_desc") return b.name.localeCompare(a.name);
      if (sortOrder === "end_date_asc") {
        return (
          new Date(a.end.split("/").reverse().join("-")).getTime() -
          new Date(b.end.split("/").reverse().join("-")).getTime()
        );
      }
      if (sortOrder === "end_date_desc") {
        return (
          new Date(b.end.split("/").reverse().join("-")).getTime() -
          new Date(a.end.split("/").reverse().join("-")).getTime()
        );
      }
      return 0;
    });
  }, [membersList, searchTerm, filterStatus, sortOrder]);

  const stats = useMemo(() => {
    return computeMemberStats(membersList, classesList);
  }, [membersList, classesList]);

  const handleStartRenewMember = (m: MemberItem) => {
    setRenewMemberId(m.name);
    setRenewPlan(m.plan || membershipsList?.[0]?.name || "Pase Libre");
    setRenewMonths("1");
    setRenewPaymentMethod(m.paymentMethod || "Efectivo");
  };

  const handleOpenAddMember = () => {
    const defaultPlan = membershipsList?.[0]?.name || "Pase Libre";
    const defaultEnd = getExpirationDateForPlan(defaultPlan, membershipsList);
    setEditingMemberId(null);
    setNewMember({
      name: "",
      phone: "",
      email: "",
      dni: "",
      dob: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      medicalInsurance: "",
      affiliateNumber: "",
      hasApto: "Pendiente",
      aptoExp: "",
      plan: defaultPlan,
      paymentMethod: "Efectivo",
      status: "activo",
      end: defaultEnd,
      medicalNotes: "",
      aptoDocUrl: "",
    });
    setIsAddOpen(true);
  };

  const handleAddMember = () => {
    if (editingMemberId) {
      setMembersList((prev) =>
        prev.map((m) => {
          if (m.name === editingMemberId) {
            return {
              ...m,
              ...newMember,
              color: getStatusBadgeColor(newMember.status),
              photo: m.photo,
            };
          }
          return m;
        }),
      );
      toast.success(`Datos de ${newMember.name} actualizados.`);
    } else {
      const selectedPlanObj = membershipsList?.find((m: any) => m.name === newMember.plan);
      const planPrice = selectedPlanObj?.price || 18000;
      const planDuration = selectedPlanObj?.duration || "1 Mes";
      const selectedPaymentMethod = newMember.paymentMethod || "Efectivo";

      const initialPayments =
        newMember.status === "activo"
          ? [
              {
                id: "pay_" + Math.random().toString(36).substr(2, 9),
                date: new Date().toISOString().split("T")[0],
                amount: planPrice,
                method: selectedPaymentMethod,
                duration: planDuration,
              },
            ]
          : [];

      const memberToAdd: MemberItem = {
        ...newMember,
        paymentMethod: selectedPaymentMethod,
        color: getStatusBadgeColor(newMember.status),
        photo: "https://api.dicebear.com/7.x/initials/svg?seed=" + newMember.name,
        payments: initialPayments,
      };
      setMembersList((prev) => [memberToAdd, ...prev]);

      if (newMember.status === "activo" && setCashTransactions) {
        const channelType =
          selectedPaymentMethod === "Efectivo"
            ? "cash"
            : selectedPaymentMethod.includes("Mercado Pago")
              ? "mercadopago"
              : "transfer";

        setCashTransactions((prev) => [
          {
            id: `tx-new-${Date.now()}`,
            date: new Date().toISOString().split("T")[0],
            type: "income",
            channel: channelType,
            description: `Alta de Alumno (${newMember.plan || "Plan"}) - ${newMember.name} [${selectedPaymentMethod}]`,
            amount: planPrice,
            registeredBy: currentUser?.name || "Recepción",
            memberName: newMember.name,
          },
          ...prev,
        ]);
        toast.success(`Alumno ${newMember.name} registrado con éxito (${selectedPaymentMethod}).`);
      } else {
        toast.success(`Alumno ${newMember.name} registrado con éxito.`);
      }
    }
    setIsAddOpen(false);
    setEditingMemberId(null);
  };

  const handleEditMemberClick = (m: MemberItem) => {
    setNewMember({
      name: m.name || "",
      phone: m.phone || "",
      email: m.email || "",
      dni: m.dni || "",
      dob: m.dob || "",
      emergencyContactName: m.emergencyContactName || "",
      emergencyContactPhone: m.emergencyContactPhone || "",
      medicalInsurance: m.medicalInsurance || "",
      affiliateNumber: m.affiliateNumber || "",
      hasApto: m.hasApto || "Pendiente",
      aptoExp: m.aptoExp || "",
      plan: m.plan || "",
      paymentMethod: m.paymentMethod || "Efectivo",
      status: m.status || "activo",
      end: m.end || "",
      medicalNotes: m.medicalNotes || "",
      aptoDocUrl: m.aptoDocUrl || "",
    });
    setEditingMemberId(m.name);
    setIsAddOpen(true);
  };

  const confirmCancelPlanAction = () => {
    if (!cancelConfirmMember) return;
    const isMp =
      cancelConfirmMember.paymentMethod === "Mercado Pago (Auto)" ||
      cancelConfirmMember.isAutoRenew;

    setMembersList((prev) =>
      prev.map((m) =>
        m.name === cancelConfirmMember.name
          ? {
              ...m,
              status: "cancelado",
              color: getStatusBadgeColor("cancelado"),
              isAutoRenew: false,
            }
          : m,
      ),
    );

    if (isMp) {
      toast.info(
        `Alumno ${cancelConfirmMember.name} dado de baja. Suscripción de Mercado Pago cancelada vía API.`,
      );
    } else {
      toast.info(`Alumno ${cancelConfirmMember.name} dado de baja / archivado.`);
    }
    setCancelConfirmMember(null);
  };

  const handleReactivateMember = (memberName: string) => {
    setMembersList((prev) =>
      prev.map((m) =>
        m.name === memberName
          ? { ...m, status: "activo", color: getStatusBadgeColor("activo") }
          : m,
      ),
    );
    toast.success(`Membresía de ${memberName} reactivada con éxito.`);
  };

  const handleDeleteMember = (member: MemberItem) => {
    if (member.payments && member.payments.length > 0) {
      setCantDeleteWarningMember(member);
    } else {
      setMembersList((prev) => prev.filter((m) => m.name !== member.name));
      toast.success(`Alumno ${member.name} eliminado del sistema.`);
    }
  };

  const handleFreezeMember = (memberName: string) => {
    setFreezeDialogMember(memberName);
    setFreezeDaysInput("15");
  };

  const handleUnfreezeMember = (memberName: string) => {
    setMembersList((prev) =>
      prev.map((m) =>
        m.name === memberName
          ? {
              ...m,
              status: "activo",
              color: getStatusBadgeColor("activo"),
              notes:
                (m.notes || "") + ` | Descongelado el ${new Date().toISOString().split("T")[0]}`,
            }
          : m,
      ),
    );
    toast.success(`Membresía de ${memberName} reactivada / descongelada con éxito.`);
  };

  const confirmFreezeMemberAction = () => {
    if (!freezeDialogMember) return;
    const days = parseInt(freezeDaysInput) || 15;
    setMembersList((prev) =>
      prev.map((m) => {
        if (m.name === freezeDialogMember) {
          return {
            ...m,
            status: "congelado",
            color: getStatusBadgeColor("congelado"),
            notes:
              (m.notes || "") +
              ` | Congelado ${days}d desde ${new Date().toISOString().split("T")[0]}`,
          };
        }
        return m;
      }),
    );
    toast.success(`Membresía de ${freezeDialogMember} congelada por ${days} días.`);
    setFreezeDialogMember(null);
  };

  const handleRenewMember = () => {
    if (!renewMemberId) return;

    setMembersList((prev) =>
      prev.map((m) => {
        if (m.name === renewMemberId) {
          const planToUse = renewPlan || m.plan || membershipsList?.[0]?.name || "Pase Libre";
          const currentEnd = new Date(m.end);
          let nextEndStr = "";
          const monthsToAdd = parseInt(renewMonths);

          if (isNaN(currentEnd.getTime()) || currentEnd < new Date()) {
            const nextDate = new Date();
            nextDate.setMonth(nextDate.getMonth() + monthsToAdd);
            nextEndStr = nextDate.toISOString().split("T")[0];
          } else {
            currentEnd.setMonth(currentEnd.getMonth() + monthsToAdd);
            nextEndStr = currentEnd.toISOString().split("T")[0];
          }

          const selectedPlanObj = membershipsList?.find((p: any) => p.name === planToUse);
          const planPrice = selectedPlanObj?.price || 18000;
          const totalAmount = planPrice * monthsToAdd;
          const paymentMethodToUse = renewPaymentMethod || m.paymentMethod || "Efectivo";

          const newPayment: MemberPayment = {
            id: "pay_" + Math.random().toString(36).substr(2, 9),
            date: new Date().toISOString().split("T")[0],
            amount: totalAmount,
            method: paymentMethodToUse,
            duration: monthsToAdd === 1 ? "1 Mes" : `${monthsToAdd} Meses`,
          };

          if (setCashTransactions) {
            const channelType =
              paymentMethodToUse === "Efectivo"
                ? "cash"
                : paymentMethodToUse.includes("Mercado Pago")
                  ? "mercadopago"
                  : "transfer";

            setCashTransactions((prevTx) => [
              {
                id: `tx-renew-${Date.now()}`,
                date: new Date().toISOString().split("T")[0],
                type: "income",
                channel: channelType,
                description: `Renovación Membresía ${planToUse} (${monthsToAdd}m) - ${m.name} [${paymentMethodToUse}]`,
                amount: totalAmount,
                registeredBy: currentUser?.name || "Recepción",
                memberName: m.name,
              },
              ...prevTx,
            ]);
          }

          const existingPayments = m.payments || [];
          return {
            ...m,
            plan: planToUse,
            paymentMethod: paymentMethodToUse,
            status: "activo",
            end: nextEndStr,
            color: getStatusBadgeColor("activo"),
            payments: [newPayment, ...existingPayments],
          };
        }
        return m;
      }),
    );
    toast.success(
      `Membresía (${renewPlan || "actual"}) de ${renewMemberId} renovada por ${renewMonths} mes(es).`,
    );
    setRenewMemberId(null);
    setRenewPlan("");
    setRenewMonths("1");
  };

  const handleValidateApto = (memberName: string) => {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const expDate = nextYear.toISOString().split("T")[0];

    setMembersList((prev) =>
      prev.map((m) => {
        if (m.name === memberName) {
          return {
            ...m,
            hasApto: "Entregado",
            aptoExp: expDate,
          };
        }
        return m;
      }),
    );
    toast.success(`Apto médico de ${memberName} validado y renovado por 1 año.`);
  };

  const handleGenerateAiCode = (member: MemberItem) => {
    const code = `WF-${Math.floor(1000 + Math.random() * 9000)}`;
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(code);
    }
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(25);
    }
    toast.success(`Código IA para ${member.name}: ${code}`, {
      description: "Copiado al portapapeles. El alumno puede ingresarlo en ChatGPT o Claude para vincular su cuenta.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Administración de Miembros</h2>
          <p className="text-sm text-muted-foreground">
            Listado general de alumnos ({filteredMembers.length} de {membersList.length} registrados).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl gap-1.5 font-semibold text-xs h-9 border-border hover:bg-secondary"
            onClick={() => exportMembersToCsv(filteredMembers)}
          >
            <Download className="h-4 w-4 text-primary" /> Exportar CSV
          </Button>
          <Button
            size="sm"
            className="rounded-xl gap-1.5 font-bold h-9"
            onClick={handleOpenAddMember}
          >
            <Plus className="h-4 w-4" /> Agregar Miembro
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <MemberKpis stats={stats} />

      {/* Table & Expanded Rows */}
      <MemberTable
        filteredMembers={filteredMembers}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        expandedMember={expandedMember}
        setExpandedMember={setExpandedMember}
        classesList={classesList}
        onReactivateMember={handleReactivateMember}
        onStartRenew={handleStartRenewMember}
        onFreezeMember={handleFreezeMember}
        onUnfreezeMember={handleUnfreezeMember}
        onGenerateAiCode={handleGenerateAiCode}
        onValidateApto={handleValidateApto}
        onEditMember={handleEditMemberClick}
        onCancelPlan={(m) => setCancelConfirmMember(m)}
        onDeleteMember={handleDeleteMember}
        onViewReceipt={(receipt) => setViewingReceipt(receipt)}
      />

      {/* Form Dialog */}
      <MemberFormDialog
        open={isAddOpen}
        onOpenChange={(val) => {
          setIsAddOpen(val);
          if (!val) setEditingMemberId(null);
        }}
        editingMemberId={editingMemberId}
        newMember={newMember}
        setNewMember={setNewMember}
        membershipsList={membershipsList}
        onSave={handleAddMember}
        onClose={() => {
          setIsAddOpen(false);
          setEditingMemberId(null);
        }}
      />

      {/* Action Modals */}
      <RenewMemberModal
        renewMemberId={renewMemberId}
        renewPlan={renewPlan}
        setRenewPlan={setRenewPlan}
        renewMonths={renewMonths}
        setRenewMonths={setRenewMonths}
        renewPaymentMethod={renewPaymentMethod}
        setRenewPaymentMethod={setRenewPaymentMethod}
        mpRenewAction={mpRenewAction}
        setMpRenewAction={setMpRenewAction}
        membersList={membersList}
        membershipsList={membershipsList}
        onConfirmRenew={handleRenewMember}
        onClose={() => {
          setRenewMemberId(null);
          setRenewMonths("1");
        }}
      />

      <CancelConfirmModal
        cancelConfirmMember={cancelConfirmMember}
        onConfirmCancel={confirmCancelPlanAction}
        onClose={() => setCancelConfirmMember(null)}
      />

      <CantDeleteWarningModal
        cantDeleteWarningMember={cantDeleteWarningMember}
        onClose={() => setCantDeleteWarningMember(null)}
      />

      <FreezeMemberModal
        freezeDialogMember={freezeDialogMember}
        freezeDaysInput={freezeDaysInput}
        setFreezeDaysInput={setFreezeDaysInput}
        onConfirmFreeze={confirmFreezeMemberAction}
        onClose={() => setFreezeDialogMember(null)}
      />

      <ReceiptModal
        viewingReceipt={viewingReceipt}
        onClose={() => setViewingReceipt(null)}
      />
    </div>
  );
}
