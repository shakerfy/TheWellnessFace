import React, { useState } from "react";
import { Dumbbell, Plus, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { toast } from "sonner";

export interface EquipmentItem {
  id: string;
  name: string;
  category: string;
  checked: boolean;
  photo?: string;
}

export interface ConfigEquipmentSectionProps {
  equipment: EquipmentItem[];
  setEquipment: React.Dispatch<React.SetStateAction<EquipmentItem[]>>;
}

export function ConfigEquipmentSection({
  equipment,
  setEquipment,
}: ConfigEquipmentSectionProps) {
  const [isCreateEquipmentOpen, setIsCreateEquipmentOpen] = useState(false);
  const [newEquipName, setNewEquipName] = useState("");
  const [newEquipCategory, setNewEquipCategory] = useState("Musculación & Peso Libre");
  const [newEquipPhoto, setNewEquipPhoto] = useState("");

  const [editingEquipPhoto, setEditingEquipPhoto] = useState<{
    id: string;
    name: string;
    photo: string;
  } | null>(null);

  const handleToggleEquipment = (id: string) => {
    setEquipment((prev) =>
      prev.map((e) => (e.id === id ? { ...e, checked: !e.checked } : e)),
    );
  };

  const handleCreateEquipment = () => {
    if (!newEquipName.trim()) return;
    const newId = "equip-" + Date.now();
    const defaultPhoto =
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=300&q=80";
    setEquipment((prev) => [
      ...prev,
      {
        id: newId,
        name: newEquipName.trim(),
        category: newEquipCategory,
        checked: true,
        photo: newEquipPhoto.trim() || defaultPhoto,
      },
    ]);
    setNewEquipName("");
    setNewEquipPhoto("");
    setIsCreateEquipmentOpen(false);
    toast.success("Equipo añadido al catálogo");
  };

  const handleSaveEquipPhoto = () => {
    if (!editingEquipPhoto) return;
    setEquipment((prev) =>
      prev.map((e) =>
        e.id === editingEquipPhoto.id ? { ...e, photo: editingEquipPhoto.photo } : e,
      ),
    );
    setEditingEquipPhoto(null);
    toast.success("Fotografía actualizada");
  };

  const equipmentCategories = Array.from(new Set(equipment.map((e) => e.category)));

  return (
    <div className="space-y-6 max-w-4xl bg-card border border-border p-6 rounded-3xl animate-fade-in text-foreground">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <h3 className="font-bold text-sm flex items-center gap-2">
            <Dumbbell className="h-4 w-4 text-primary" />
            Equipamiento del Establecimiento
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Selecciona las máquinas, estaciones y elementos disponibles para que los alumnos los conozcan en tu perfil público.
          </p>
        </div>
        <Button
          onClick={() => setIsCreateEquipmentOpen(true)}
          size="sm"
          className="rounded-xl font-bold text-xs gap-1 shrink-0"
        >
          <Plus className="h-4 w-4" /> Añadir Equipo
        </Button>
      </div>

      <div className="space-y-6">
        {equipmentCategories.map((category) => (
          <div key={category} className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-border/80 pb-1.5 flex items-center justify-between">
              <span>{category}</span>
              <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full font-normal text-muted-foreground">
                {equipment.filter((e) => e.category === category && e.checked).length} /{" "}
                {equipment.filter((e) => e.category === category).length} seleccionados
              </span>
            </h4>
            <div className="grid gap-3 sm:grid-cols-2">
              {equipment
                .filter((e) => e.category === category)
                .map((e) => (
                  <div
                    key={e.id}
                    onClick={() => handleToggleEquipment(e.id)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition cursor-pointer ${
                      e.checked
                        ? "bg-primary/5 border-primary/40 text-foreground"
                        : "bg-secondary/20 border-transparent text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3 pr-2 overflow-hidden flex-1">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-secondary border border-border/60 group">
                        {e.photo ? (
                          <img
                            src={e.photo}
                            alt={e.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <Dumbbell className="w-5 h-5" />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={(ev) => {
                            ev.stopPropagation();
                            setEditingEquipPhoto({
                              id: e.id,
                              name: e.name,
                              photo: e.photo || "",
                            });
                          }}
                          className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center text-white transition rounded-xl"
                          title="Cambiar foto"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-sm font-semibold truncate block">{e.name}</span>
                      </div>
                    </div>

                    <div className="flex items-center shrink-0 pl-2">
                      <input
                        type="checkbox"
                        checked={e.checked}
                        onChange={() => {}} // Controlled by parent div click
                        className="h-5 w-5 accent-primary rounded cursor-pointer shrink-0 pointer-events-none"
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Crear Equipamiento */}
      <Dialog open={isCreateEquipmentOpen} onOpenChange={setIsCreateEquipmentOpen}>
        <DialogContent className="max-w-md rounded-3xl border border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-lg">Añadir Nuevo Equipamiento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-3 text-sm">
            <div className="space-y-1.5">
              <Label htmlFor="equip-name">Nombre o Descripción del Equipo</Label>
              <Input
                id="equip-name"
                placeholder="Ej. Escaladora StairMaster, Banco Scott..."
                value={newEquipName}
                onChange={(e) => setNewEquipName(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="equip-cat">Categoría</Label>
              <Select value={newEquipCategory} onValueChange={setNewEquipCategory}>
                <SelectTrigger className="rounded-xl pl-3.5 pr-9">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="Musculación & Peso Libre">
                    Musculación & Peso Libre
                  </SelectItem>
                  <SelectItem value="Máquinas Guiadas & Poleas">
                    Máquinas Guiadas & Poleas
                  </SelectItem>
                  <SelectItem value="Cardio & Acondicionamiento">
                    Cardio & Acondicionamiento
                  </SelectItem>
                  <SelectItem value="Funcional & Movilidad">Funcional & Movilidad</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="equip-photo">URL de Fotografía Ilustrativa (Opcional)</Label>
              <Input
                id="equip-photo"
                placeholder="https://images.unsplash.com/..."
                value={newEquipPhoto}
                onChange={(e) => setNewEquipPhoto(e.target.value)}
                className="rounded-xl font-mono text-xs"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setIsCreateEquipmentOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              className="rounded-xl font-semibold"
              disabled={!newEquipName.trim()}
              onClick={handleCreateEquipment}
            >
              Añadir a la Lista
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Editar / Subir Imagen Equipamiento */}
      <Dialog
        open={!!editingEquipPhoto}
        onOpenChange={(open) => !open && setEditingEquipPhoto(null)}
      >
        <DialogContent className="max-w-md rounded-3xl border border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-lg">Cambiar Imagen del Equipamiento</DialogTitle>
          </DialogHeader>
          {editingEquipPhoto && (
            <div className="space-y-4 py-3 text-sm">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/30 border border-border/60">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-secondary shrink-0 border border-border/80">
                  {editingEquipPhoto.photo ? (
                    <img
                      src={editingEquipPhoto.photo}
                      alt={editingEquipPhoto.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Dumbbell className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-foreground text-sm truncate">
                    {editingEquipPhoto.name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Sube la URL de la imagen representativa o fotografía de tu equipo.
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-equip-photo">URL de la Fotografía (o Unsplash)</Label>
                <Input
                  id="edit-equip-photo"
                  placeholder="https://images.unsplash.com/..."
                  value={editingEquipPhoto.photo}
                  onChange={(e) =>
                    setEditingEquipPhoto({ ...editingEquipPhoto, photo: e.target.value })
                  }
                  className="rounded-xl font-mono text-xs"
                />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setEditingEquipPhoto(null)}
            >
              Cancelar
            </Button>
            <Button className="rounded-xl font-semibold" onClick={handleSaveEquipPhoto}>
              Guardar Imagen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
