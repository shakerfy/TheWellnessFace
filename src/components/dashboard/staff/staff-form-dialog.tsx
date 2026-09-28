import React, { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { STAFF_SPECIALTY_PRESETS } from "../dashboard-utils";
import { createDefaultAvailability, DEFAULT_STAFF_FORM, WEEKDAYS } from "./constants";
import { StaffFormData, StaffMember } from "./types";

interface StaffFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingStaff: StaffMember | null;
  onSave: (data: StaffFormData, staffId?: string) => void;
}

export function StaffFormDialog({
  open,
  onOpenChange,
  editingStaff,
  onSave,
}: StaffFormDialogProps) {
  const [formData, setFormData] = useState<StaffFormData>(DEFAULT_STAFF_FORM);

  const coachAvatarRef = useRef<HTMLInputElement>(null);
  const coachCertsRef = useRef<HTMLInputElement>(null);

  const isEditing = !!editingStaff;

  useEffect(() => {
    if (editingStaff) {
      const existingSpecs =
        editingStaff.specialties && editingStaff.specialties.length > 0
          ? editingStaff.specialties
          : editingStaff.specialty
            ? editingStaff.specialty.split(",").map((s) => s.trim())
            : [];

      const loadedAvails =
        editingStaff.availability && editingStaff.availability.length > 0
          ? WEEKDAYS.map((day) => {
              const found = editingStaff.availability?.find((a) => a.day === day);
              return found ? { day, intervals: found.intervals || [] } : { day, intervals: [] };
            })
          : createDefaultAvailability();

      setFormData({
        name: editingStaff.name,
        specialties: existingSpecs,
        specialtyText: editingStaff.specialty || "",
        certificationsText: (editingStaff.certifications || []).join(", "),
        role: editingStaff.role || "coach",
        branchId: editingStaff.branchId || "matriz",
        avatarUrl: editingStaff.photo || null,
        diplomas: editingStaff.certificationImages || [],
        availability: loadedAvails,
      });
    } else {
      setFormData(DEFAULT_STAFF_FORM);
    }
  }, [editingStaff, open]);

  // Interval handlers
  const handleAddInterval = (dayIndex: number) => {
    setFormData((prev) => {
      const copy = [...prev.availability];
      copy[dayIndex] = {
        ...copy[dayIndex],
        intervals: [...copy[dayIndex].intervals, { from: "09:00", to: "13:00" }],
      };
      return { ...prev, availability: copy };
    });
  };

  const handleUpdateInterval = (
    dayIndex: number,
    intervalIndex: number,
    field: "from" | "to",
    value: string,
  ) => {
    setFormData((prev) => {
      const copy = [...prev.availability];
      const updatedIntervals = [...copy[dayIndex].intervals];
      updatedIntervals[intervalIndex] = {
        ...updatedIntervals[intervalIndex],
        [field]: value,
      };
      copy[dayIndex] = {
        ...copy[dayIndex],
        intervals: updatedIntervals,
      };
      return { ...prev, availability: copy };
    });
  };

  const handleRemoveInterval = (dayIndex: number, intervalIndex: number) => {
    setFormData((prev) => {
      const copy = [...prev.availability];
      copy[dayIndex] = {
        ...copy[dayIndex],
        intervals: copy[dayIndex].intervals.filter((_, idx) => idx !== intervalIndex),
      };
      return { ...prev, availability: copy };
    });
  };

  // Avatar upload
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        avatarUrl: URL.createObjectURL(e.target.files![0]),
      }));
    }
  };

  // Diplomas upload
  const handleDiplomasUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const objectUrls = filesArray.map((file) => URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        diplomas: [...prev.diplomas, ...objectUrls],
      }));
    }
  };

  const handleRemoveDiploma = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      diplomas: prev.diplomas.filter((_, idx) => idx !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSave(formData, editingStaff?.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border border-border bg-card">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Profesor / Coach" : "Añadir Profesor / Coach"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Nombre y Apellido
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
                placeholder="Juan Gómez"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs font-semibold text-muted-foreground block">
                Actividades / Especialidades que dicta (Selecciona 1 o varias)
              </label>

              {/* Selector de Chips elegidos */}
              <div className="flex flex-wrap gap-1.5 min-h-[38px] p-2 rounded-xl border border-border bg-background items-center">
                {formData.specialties.map((spec) => (
                  <span
                    key={spec}
                    className="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                  >
                    {spec}
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((p) => ({
                          ...p,
                          specialties: p.specialties.filter((s) => s !== spec),
                        }))
                      }
                      className="hover:text-destructive text-primary/70 transition-colors ml-0.5 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {formData.specialties.length === 0 && (
                  <span className="text-xs text-muted-foreground italic">
                    Haz clic en las actividades de abajo para vincularlas a este profesor...
                  </span>
                )}
              </div>

              {/* Botones de Selección Rápida */}
              <div className="flex flex-wrap gap-1 pt-1 max-h-[130px] overflow-y-auto custom-scrollbar p-2 bg-secondary/20 border border-border/40 rounded-xl">
                {STAFF_SPECIALTY_PRESETS.map((preset) => {
                  const isSelected = formData.specialties.includes(preset);
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setFormData((p) => ({
                          ...p,
                          specialties: isSelected
                            ? p.specialties.filter((s) => s !== preset)
                            : [...p.specialties, preset],
                        }));
                      }}
                      className={cn(
                        "text-[10.5px] font-bold px-2.5 py-1 rounded-lg border transition-all select-none cursor-pointer",
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow-2xs"
                          : "bg-background border-border/60 text-muted-foreground hover:bg-secondary hover:text-foreground",
                      )}
                    >
                      {isSelected ? "✓ " : "+ "}
                      {preset}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Certificaciones y Títulos (separados por comas)
            </label>
            <input
              type="text"
              value={formData.certificationsText}
              onChange={(e) => setFormData((p) => ({ ...p, certificationsText: e.target.value }))}
              className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
              placeholder="CF-L1, Prof. Educación Física, Guardavidas"
            />
          </div>

          <div className="border-t border-border/40 pt-4 space-y-4">
            <div>
              <h4 className="text-xs font-bold text-muted-foreground uppercase">
                Disponibilidad Horaria Semanal
              </h4>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Define los días y franjas horarias en los que el profesor puede dictar clases.
              </p>
            </div>

            <div className="space-y-3">
              {formData.availability.map((dayAvail, dayIdx) => (
                <div
                  key={dayAvail.day}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-2xl bg-secondary/10 border border-border/40 text-xs text-foreground"
                >
                  <span className="font-bold w-20 text-foreground shrink-0">{dayAvail.day}</span>

                  <div className="flex-1 space-y-2">
                    {dayAvail.intervals.map((interval, intervalIdx) => (
                      <div key={intervalIdx} className="flex items-center gap-2">
                        <input
                          type="time"
                          value={interval.from}
                          onChange={(e) =>
                            handleUpdateInterval(dayIdx, intervalIdx, "from", e.target.value)
                          }
                          className="px-2 py-1 rounded-lg border border-border bg-background text-xs text-foreground focus-visible:outline-none"
                        />
                        <span className="text-[10px] text-muted-foreground">a</span>
                        <input
                          type="time"
                          value={interval.to}
                          onChange={(e) =>
                            handleUpdateInterval(dayIdx, intervalIdx, "to", e.target.value)
                          }
                          className="px-2 py-1 rounded-lg border border-border bg-background text-xs text-foreground focus-visible:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveInterval(dayIdx, intervalIdx)}
                          className="p-1 text-destructive hover:bg-destructive/10 rounded transition cursor-pointer"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {dayAvail.intervals.length === 0 && (
                      <span className="text-[10px] text-muted-foreground italic bg-secondary/40 px-2 py-0.5 rounded inline-block">
                        No disponible
                      </span>
                    )}
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="self-start sm:self-center text-[10px] gap-1 py-1 h-7 rounded-lg cursor-pointer"
                    onClick={() => handleAddInterval(dayIdx)}
                  >
                    <Plus className="h-3 w-3" /> Turno
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground block">
                Foto de Perfil
              </label>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full overflow-hidden border border-border bg-muted flex items-center justify-center shrink-0">
                  {formData.avatarUrl ? (
                    <img
                      src={formData.avatarUrl}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Users className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="rounded-xl cursor-pointer"
                  onClick={() => coachAvatarRef.current?.click()}
                >
                  Subir Foto
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  ref={coachAvatarRef}
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground block">
                Adjuntar Diplomas / Certificaciones
              </label>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="rounded-xl gap-1.5 cursor-pointer"
                  onClick={() => coachCertsRef.current?.click()}
                >
                  <Plus className="h-4 w-4" /> Subir Certificados
                </Button>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  ref={coachCertsRef}
                  onChange={handleDiplomasUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {formData.diplomas.length > 0 && (
            <div className="space-y-1.5 border-t border-border/60 pt-3">
              <label className="text-xs font-semibold text-muted-foreground block">
                Diplomas Adjuntos ({formData.diplomas.length})
              </label>
              <div className="flex flex-wrap gap-2">
                {formData.diplomas.map((url, index) => (
                  <div
                    key={index}
                    className="relative h-12 w-16 rounded-lg overflow-hidden border border-border group shrink-0"
                  >
                    <img src={url} alt="Diploma" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveDiploma(index)}
                      className="absolute top-0.5 right-0.5 bg-black/60 text-white p-0.5 rounded-full hover:bg-black transition cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl cursor-pointer"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" className="rounded-xl cursor-pointer">
              {isEditing ? "Guardar Cambios" : "Añadir al Staff"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
