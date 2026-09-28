import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Membership,
  MembresiasTabProps,
  MembershipFormData,
  MembershipFilters,
  MembershipCard,
  MembershipFormDialog,
  MembershipDeleteDialog,
} from "./membresias";

export type { Membership, MembresiasTabProps };
export * from "./membresias";

export function MembresiasTab({
  membershipsList,
  setMembershipsList,
  amenities,
}: MembresiasTabProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Membership | null>(null);
  const [deletingPlan, setDeletingPlan] = useState<Membership | null>(null);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [tagFilter, setTagFilter] = useState("all");
  const [periodicityFilter, setPeriodicityFilter] = useState("all");

  const handleSaveMembership = (formData: MembershipFormData, planId?: string) => {
    if (planId) {
      setMembershipsList((prev) =>
        prev.map((m) => {
          if (m.id === planId) {
            return {
              ...m,
              name: formData.name,
              price: parseFloat(formData.price),
              originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
              duration: formData.periodicity,
              tag: formData.tag,
              passType: formData.passType,
              creditsCount:
                formData.passType === "Por Créditos" ? parseInt(formData.creditsCount) : null,
              accessHoursType: formData.accessHoursType,
              offPeakStart:
                formData.accessHoursType === "Off-Peak" ? formData.offPeakStart : null,
              offPeakEnd: formData.accessHoursType === "Off-Peak" ? formData.offPeakEnd : null,
              includedActivities: formData.includedActivities,
              includedServices: formData.selectedServices,
              registrationFee: formData.registrationFee ? parseFloat(formData.registrationFee) : 0,
              freezeDays: formData.freezeDays ? parseInt(formData.freezeDays) : 0,
              dailyClassLimit: formData.dailyClassLimit,
            };
          }
          return m;
        }),
      );
      toast.success("Plan actualizado con éxito.");
    } else {
      const newPlan: Membership = {
        id: Math.random().toString(),
        name: formData.name,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        duration: formData.periodicity,
        activeCount: 0,
        includedServices: formData.selectedServices,
        tag: formData.tag,
        passType: formData.passType,
        creditsCount:
          formData.passType === "Por Créditos" ? parseInt(formData.creditsCount) : null,
        accessHoursType: formData.accessHoursType,
        offPeakStart: formData.accessHoursType === "Off-Peak" ? formData.offPeakStart : null,
        offPeakEnd: formData.accessHoursType === "Off-Peak" ? formData.offPeakEnd : null,
        includedActivities: formData.includedActivities,
        registrationFee: formData.registrationFee ? parseFloat(formData.registrationFee) : 0,
        freezeDays: formData.freezeDays ? parseInt(formData.freezeDays) : 0,
        dailyClassLimit: formData.dailyClassLimit,
      };
      setMembershipsList((prev) => [...prev, newPlan]);
      toast.success("Plan creado con éxito.");
    }
  };

  const handleDeletePlan = (plan: Membership) => {
    setMembershipsList((prev) => prev.filter((x) => x.id !== plan.id));
    toast.success(`Plan "${plan.name}" eliminado.`);
  };

  const handleDuplicatePlan = (m: Membership) => {
    const newPlan: Membership = {
      ...m,
      id: `plan-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: `${m.name} (Copia)`,
      activeCount: 0,
      isFeatured: false,
    };
    setMembershipsList((prev) => [...prev, newPlan]);
    toast.success(`Plan "${m.name}" duplicado como "${newPlan.name}".`);
  };

  const handleToggleFeaturedPlan = (id: string) => {
    setMembershipsList((prev) =>
      prev.map((m) => ({
        ...m,
        isFeatured: m.id === id ? !m.isFeatured : false,
      })),
    );
    const target = membershipsList.find((m) => m.id === id);
    if (target && !target.isFeatured) {
      toast.success(`Plan "${target.name}" marcado como Plan Destacado.`);
    } else {
      toast.info("Plan quitado de destacados.");
    }
  };

  const handleDeleteClick = (m: Membership) => {
    if (m.activeCount > 0) {
      toast.error(
        `No se puede eliminar el plan "${m.name}" porque tiene ${m.activeCount} alumnos activos.`,
      );
    } else {
      setDeletingPlan(m);
    }
  };

  const filteredMemberships = useMemo(() => {
    return membershipsList.filter((m) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        m.name.toLowerCase().includes(q) ||
        (m.tag && m.tag.toLowerCase().includes(q)) ||
        (m.includedActivities && m.includedActivities.some((act) => act.toLowerCase().includes(q)));

      const matchTag =
        tagFilter === "all"
          ? true
          : tagFilter === "featured"
            ? !!m.isFeatured
            : m.tag === tagFilter;

      const matchPeriod = periodicityFilter === "all" || m.duration === periodicityFilter;

      return matchSearch && matchTag && matchPeriod;
    });
  }, [membershipsList, searchQuery, tagFilter, periodicityFilter]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setTagFilter("all");
    setPeriodicityFilter("all");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Planes de Membresía</h2>
          <p className="text-sm text-muted-foreground">
            Tarifas y selección de amenities incluidos en cada plan.
          </p>
        </div>
        <Button
          size="sm"
          className="rounded-full bg-black hover:bg-black/90 text-white dark:bg-white dark:hover:bg-white/90 dark:text-black font-bold gap-1.5 px-4"
          onClick={() => {
            setEditingPlan(null);
            setShowAddForm(true);
          }}
        >
          <Plus className="h-4 w-4" /> Nuevo Plan
        </Button>
      </div>

      {/* Search & Multi-Filters Bar */}
      <MembershipFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        tagFilter={tagFilter}
        onTagFilterChange={setTagFilter}
        periodicityFilter={periodicityFilter}
        onPeriodicityFilterChange={setPeriodicityFilter}
        onResetFilters={handleResetFilters}
      />

      {filteredMemberships.length === 0 ? (
        <div className="p-8 text-center bg-card border border-border/80 rounded-3xl text-muted-foreground italic text-xs">
          No se encontraron planes de membresía con los filtros seleccionados.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {filteredMemberships.map((m) => (
            <MembershipCard
              key={m.id}
              membership={m}
              amenities={amenities}
              onToggleFeatured={handleToggleFeaturedPlan}
              onDuplicate={handleDuplicatePlan}
              onEdit={(plan) => setEditingPlan(plan)}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <MembershipFormDialog
        open={showAddForm || !!editingPlan}
        onOpenChange={(open) => {
          if (!open) {
            setShowAddForm(false);
            setEditingPlan(null);
          }
        }}
        editingPlan={editingPlan}
        amenities={amenities}
        onSave={handleSaveMembership}
      />

      {/* Delete Confirmation Dialog */}
      <MembershipDeleteDialog
        plan={deletingPlan}
        onClose={() => setDeletingPlan(null)}
        onConfirm={handleDeletePlan}
      />
    </div>
  );
}
