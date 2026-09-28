import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  ConfigStaffSectionProps,
  StaffMember,
  StaffFormData,
  StaffCard,
  StaffFormDialog,
  DiplomasViewerModal,
  StaffDeleteDialog,
} from "./staff";

export type { ConfigStaffSectionProps, StaffMember, StaffFormData } from "./staff";
export * from "./staff";

export function ConfigStaffSection({ staffList, setStaffList }: ConfigStaffSectionProps) {
  const [isCreateStaffOpen, setIsCreateStaffOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [deletingStaff, setDeletingStaff] = useState<{ id: string; name: string } | null>(null);
  const [activeCertificationsViewer, setActiveCertificationsViewer] = useState<string[] | null>(null);

  const handleSaveStaff = (formData: StaffFormData, staffId?: string) => {
    const finalSpecialties =
      formData.specialties.length > 0
        ? formData.specialties
        : [formData.specialtyText || "General"];
    const finalSpecialtyStr = formData.specialtyText || finalSpecialties.join(", ");
    const certsArray = formData.certificationsText
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    if (staffId) {
      setStaffList((prev) =>
        prev.map((s) =>
          s.id === staffId
            ? {
                ...s,
                name: formData.name,
                specialty: finalSpecialtyStr,
                specialties: finalSpecialties,
                certifications: certsArray,
                photo:
                  formData.avatarUrl ||
                  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=150&q=80",
                certificationImages: formData.diplomas,
                role: formData.role,
                branchId: formData.branchId === "matriz" ? undefined : formData.branchId,
                availability: formData.availability,
              }
            : s,
        ),
      );
      toast.success("Profesor actualizado correctamente");
    } else {
      const newStaff: StaffMember = {
        id: `staff-${Date.now()}`,
        name: formData.name,
        specialty: finalSpecialtyStr,
        specialties: finalSpecialties,
        certifications: certsArray,
        photo:
          formData.avatarUrl ||
          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=150&q=80",
        certificationImages: formData.diplomas,
        role: formData.role,
        branchId: formData.branchId === "matriz" ? undefined : formData.branchId,
        status: "linked",
        availability: formData.availability,
      };
      setStaffList((prev) => [...prev, newStaff]);
      toast.success("Profesor añadido correctamente");
    }
  };

  const handleConfirmRemoveStaff = () => {
    if (!deletingStaff) return;
    setStaffList((prev) => prev.filter((s) => s.id !== deletingStaff.id));
    setDeletingStaff(null);
    toast.success("Profesor eliminado correctamente");
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-6 rounded-3xl">
        <div>
          <h3 className="font-bold text-sm">Staff</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Administra los entrenadores y coaches de tu sede.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingStaff(null);
            setIsCreateStaffOpen(true);
          }}
          className="rounded-xl font-bold text-xs gap-1.5 shrink-0 cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Añadir Coach / Profesor
        </Button>
      </div>

      {/* Staff Grid */}
      <div className="rounded-3xl border border-border bg-card p-6">
        <h3 className="text-sm font-bold text-muted-foreground uppercase mb-4">
          Staff Registrado
        </h3>
        {staffList.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground italic text-xs">
            No hay profesores registrados.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {staffList.map((s) => (
              <StaffCard
                key={s.id}
                staff={s}
                onEdit={(staff) => setEditingStaff(staff)}
                onDelete={(staff) => setDeletingStaff({ id: staff.id, name: staff.name })}
                onViewCertificates={(images) => setActiveCertificationsViewer(images)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Dialog */}
      <StaffFormDialog
        open={isCreateStaffOpen || !!editingStaff}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateStaffOpen(false);
            setEditingStaff(null);
          }
        }}
        editingStaff={editingStaff}
        onSave={handleSaveStaff}
      />

      {/* Diplomas Viewer Modal */}
      <DiplomasViewerModal
        images={activeCertificationsViewer}
        onClose={() => setActiveCertificationsViewer(null)}
      />

      {/* Universal Delete AlertDialog */}
      <StaffDeleteDialog
        staff={deletingStaff}
        onClose={() => setDeletingStaff(null)}
        onConfirm={handleConfirmRemoveStaff}
      />
    </div>
  );
}
