import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Amenity, Membership, MembershipFormData } from "./types";
import {
  ACCESS_HOURS_OPTIONS,
  DAILY_CLASS_LIMITS,
  DEFAULT_MEMBERSHIP_FORM,
  FITNESS_ACTIVITIES,
  PASS_TYPE_OPTIONS,
  PERIODICITY_OPTIONS,
  TAG_OPTIONS,
} from "./constants";

interface MembershipFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingPlan: Membership | null;
  amenities: Amenity[];
  onSave: (data: MembershipFormData, planId?: string) => void;
}

export function MembershipFormDialog({
  open,
  onOpenChange,
  editingPlan,
  amenities,
  onSave,
}: MembershipFormDialogProps) {
  const [formData, setFormData] = useState<MembershipFormData>(DEFAULT_MEMBERSHIP_FORM);
  const [searchActivity, setSearchActivity] = useState("");

  const isEditing = !!editingPlan;
  const activeAmenities = amenities.filter((a) => a.checked);

  useEffect(() => {
    if (editingPlan) {
      setFormData({
        name: editingPlan.name,
        price: editingPlan.price.toString(),
        originalPrice: editingPlan.originalPrice ? editingPlan.originalPrice.toString() : "",
        periodicity: editingPlan.duration,
        tag: editingPlan.tag || "Pase Libre",
        passType: editingPlan.passType || "Pase Libre",
        creditsCount: editingPlan.creditsCount ? editingPlan.creditsCount.toString() : "12",
        accessHoursType: editingPlan.accessHoursType || "Todo Horario",
        offPeakStart: editingPlan.offPeakStart || "12:00",
        offPeakEnd: editingPlan.offPeakEnd || "16:00",
        includedActivities: editingPlan.includedActivities || [],
        selectedServices: editingPlan.includedServices || [],
        registrationFee: editingPlan.registrationFee ? editingPlan.registrationFee.toString() : "0",
        freezeDays: editingPlan.freezeDays ? editingPlan.freezeDays.toString() : "0",
        dailyClassLimit: editingPlan.dailyClassLimit || "Ilimitado",
      });
    } else {
      setFormData(DEFAULT_MEMBERSHIP_FORM);
    }
    setSearchActivity("");
  }, [editingPlan, open]);

  const toggleService = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(id)
        ? prev.selectedServices.filter((s) => s !== id)
        : [...prev.selectedServices, id],
    }));
  };

  const handleAddActivity = (act: string) => {
    setFormData((prev) => ({
      ...prev,
      includedActivities: [...prev.includedActivities, act],
    }));
    setSearchActivity("");
  };

  const handleRemoveActivity = (act: string) => {
    setFormData((prev) => ({
      ...prev,
      includedActivities: prev.includedActivities.filter((x) => x !== act),
    }));
  };

  const filteredActivities =
    searchActivity.trim() === ""
      ? []
      : FITNESS_ACTIVITIES.filter(
          (act) =>
            act.toLowerCase().includes(searchActivity.toLowerCase()) &&
            !formData.includedActivities.includes(act),
        );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) return;
    onSave(formData, editingPlan?.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl border border-border bg-card rounded-3xl p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-foreground">
            {isEditing ? "Editar Plan de Membresía" : "Agregar Nuevo Plan de Membresía"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-xs text-foreground">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5 sm:col-span-1">
              <label className="text-xs font-semibold text-muted-foreground">
                Nombre del Plan
              </label>
              <Input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground"
                placeholder="Ej: Pase Libre"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Precio ($)</label>
              <Input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))}
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground"
                placeholder="25000"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Original/Tachado ($)
              </label>
              <Input
                type="number"
                value={formData.originalPrice}
                onChange={(e) => setFormData((p) => ({ ...p, originalPrice: e.target.value }))}
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
                placeholder="Opcional"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground block">
                Periodicidad del Cobro
              </label>
              <Select
                value={formData.periodicity}
                onValueChange={(val) => setFormData((p) => ({ ...p, periodicity: val }))}
              >
                <SelectTrigger className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground font-semibold">
                  <SelectValue placeholder="Selecciona periodicidad..." />
                </SelectTrigger>
                <SelectContent>
                  {PERIODICITY_OPTIONS.map((period) => (
                    <SelectItem key={period} value={period}>
                      {period}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground block">
                Etiqueta/Categoría del Plan
              </label>
              <Select
                value={formData.tag}
                onValueChange={(val) => setFormData((p) => ({ ...p, tag: val }))}
              >
                <SelectTrigger className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground font-semibold">
                  <SelectValue placeholder="Selecciona categoría..." />
                </SelectTrigger>
                <SelectContent>
                  {TAG_OPTIONS.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Pass Type & Credits configuration */}
          <div className="grid gap-4 sm:grid-cols-2 border-t border-border/40 pt-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground block">
                Tipo de Acceso
              </label>
              <Select
                value={formData.passType}
                onValueChange={(val) => setFormData((p) => ({ ...p, passType: val }))}
              >
                <SelectTrigger className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground font-semibold">
                  <SelectValue placeholder="Tipo de acceso..." />
                </SelectTrigger>
                <SelectContent>
                  {PASS_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {formData.passType === "Por Créditos" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Créditos/Clases Incluidas
                </label>
                <Input
                  type="number"
                  required
                  value={formData.creditsCount}
                  onChange={(e) => setFormData((p) => ({ ...p, creditsCount: e.target.value }))}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground"
                  placeholder="12"
                />
              </div>
            )}
          </div>

          {/* Time access restrictions */}
          <div className="grid gap-4 sm:grid-cols-2 border-t border-border/40 pt-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground block">
                Horario de Acceso
              </label>
              <Select
                value={formData.accessHoursType}
                onValueChange={(val) => setFormData((p) => ({ ...p, accessHoursType: val }))}
              >
                <SelectTrigger className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground font-semibold">
                  <SelectValue placeholder="Horario..." />
                </SelectTrigger>
                <SelectContent>
                  {ACCESS_HOURS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {formData.accessHoursType === "Off-Peak" && (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-muted-foreground">Desde</label>
                  <Input
                    type="text"
                    value={formData.offPeakStart}
                    onChange={(e) => setFormData((p) => ({ ...p, offPeakStart: e.target.value }))}
                    className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground font-semibold"
                    placeholder="12:00"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-muted-foreground">Hasta</label>
                  <Input
                    type="text"
                    value={formData.offPeakEnd}
                    onChange={(e) => setFormData((p) => ({ ...p, offPeakEnd: e.target.value }))}
                    className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground font-semibold"
                    placeholder="16:00"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Advanced business settings */}
          <div className="grid gap-4 sm:grid-cols-3 border-t border-border/40 pt-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground block">
                Costo de Matrícula ($)
              </label>
              <Input
                type="number"
                value={formData.registrationFee}
                onChange={(e) => setFormData((p) => ({ ...p, registrationFee: e.target.value }))}
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground font-semibold"
                placeholder="0 = Sin matrícula"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground block">
                Días Congelamiento/Año
              </label>
              <Input
                type="number"
                value={formData.freezeDays}
                onChange={(e) => setFormData((p) => ({ ...p, freezeDays: e.target.value }))}
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground font-semibold"
                placeholder="Ej: 15 días"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground block">
                Límite Diario de Reservas
              </label>
              <Select
                value={formData.dailyClassLimit}
                onValueChange={(val) => setFormData((p) => ({ ...p, dailyClassLimit: val }))}
              >
                <SelectTrigger className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground font-semibold">
                  <SelectValue placeholder="Límite..." />
                </SelectTrigger>
                <SelectContent>
                  {DAILY_CLASS_LIMITS.map((limit) => (
                    <SelectItem key={limit} value={limit}>
                      {limit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Activities Multi-select Search Box */}
          <div className="space-y-2 border-t border-border/40 pt-3 relative">
            <label className="text-xs font-semibold text-muted-foreground block">
              Actividades Incluidas
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {formData.includedActivities.map((act) => (
                <span
                  key={act}
                  className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full"
                >
                  {act}
                  <button
                    type="button"
                    onClick={() => handleRemoveActivity(act)}
                    className="hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {formData.includedActivities.length === 0 && (
                <span className="text-xs text-muted-foreground italic">
                  Todas las actividades del centro incluidas por defecto.
                </span>
              )}
            </div>

            <Input
              type="text"
              value={searchActivity}
              onChange={(e) => setSearchActivity(e.target.value)}
              className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground font-semibold"
              placeholder="Buscar actividades a incluir..."
            />

            {filteredActivities.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 bg-card border border-border rounded-xl max-h-48 overflow-y-auto z-10 p-1 space-y-0.5 shadow-lg">
                {filteredActivities.map((act) => (
                  <button
                    type="button"
                    key={act}
                    onClick={() => handleAddActivity(act)}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-secondary rounded-lg transition text-foreground"
                  >
                    {act}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Amenities selection */}
          <div className="space-y-2 border-t border-border/40 pt-3">
            <label className="text-xs font-semibold text-muted-foreground block">
              Amenities y Servicios Incluidos
            </label>
            {activeAmenities.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No tienes amenities activos en la pestaña de Configuración.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {activeAmenities.map((a) => (
                  <button
                    type="button"
                    key={a.id}
                    onClick={() => toggleService(a.id)}
                    className={cn(
                      "px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all",
                      formData.selectedServices.includes(a.id)
                        ? "bg-foreground text-background border-foreground font-bold shadow-sm"
                        : "bg-background border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
                    )}
                  >
                    {a.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="pt-3 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl text-xs font-bold"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="rounded-xl text-xs font-bold bg-primary text-primary-foreground"
            >
              {isEditing ? "Guardar Cambios" : "Crear Plan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
