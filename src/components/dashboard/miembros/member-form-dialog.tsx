import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { getExpirationDateForPlan } from "./member-helpers";

interface MemberFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingMemberId: string | null;
  newMember: any;
  setNewMember: React.Dispatch<React.SetStateAction<any>>;
  membershipsList?: any[];
  onSave: () => void;
  onClose: () => void;
}

export function MemberFormDialog({
  open,
  onOpenChange,
  editingMemberId,
  newMember,
  setNewMember,
  membershipsList,
  onSave,
  onClose,
}: MemberFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-4">
          <DialogTitle>{editingMemberId ? "Editar Miembro" : "Nuevo Miembro"}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {editingMemberId
              ? "Modificá los datos del alumno."
              : "Completá los datos del alumno. Los campos de salud y prepaga son fundamentales para la cobertura."}
          </p>
        </DialogHeader>
        <div className="space-y-6">
          {/* Datos Personales */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider">
              A. Datos Personales
            </h3>
            <div className="space-y-2">
              <Label>Nombre Completo</Label>
              <Input
                placeholder="Ej. Juan Pérez"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>DNI</Label>
                <Input
                  placeholder="Sin puntos"
                  value={newMember.dni}
                  onChange={(e) => setNewMember({ ...newMember, dni: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Fecha de Nacimiento</Label>
                <Input
                  type="date"
                  value={newMember.dob}
                  onChange={(e) => setNewMember({ ...newMember, dob: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Teléfono</Label>
                <Input
                  placeholder="+54 9 11..."
                  value={newMember.phone}
                  onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="juan@email.com"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Salud y Legal */}
          <div className="space-y-4 pt-4 border-t border-border/50">
            <h3 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider">
              B. Salud y Legal
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Contacto de Emergencia</Label>
                <Input
                  placeholder="Nombre"
                  value={newMember.emergencyContactName}
                  onChange={(e) =>
                    setNewMember({ ...newMember, emergencyContactName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Tel. de Emergencia</Label>
                <Input
                  placeholder="Teléfono"
                  value={newMember.emergencyContactPhone}
                  onChange={(e) =>
                    setNewMember({ ...newMember, emergencyContactPhone: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Obra Social / Prepaga</Label>
                <Input
                  placeholder="Ej. OSDE"
                  value={newMember.medicalInsurance}
                  onChange={(e) =>
                    setNewMember({ ...newMember, medicalInsurance: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Nro de Afiliado</Label>
                <Input
                  placeholder="Número"
                  value={newMember.affiliateNumber}
                  onChange={(e) =>
                    setNewMember({ ...newMember, affiliateNumber: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="bg-secondary/30 p-3 rounded-lg border border-border/50 space-y-4">
              <div className="space-y-2">
                <Label>Apto Médico Físico</Label>
                <Select
                  value={newMember.hasApto}
                  onValueChange={(val) => setNewMember({ ...newMember, hasApto: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Estado del Apto Médico" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entregado">Entregado y Vigente</SelectItem>
                    <SelectItem value="Pendiente">Pendiente de Entrega</SelectItem>
                    <SelectItem value="No Aplica">No Aplica / Eximido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {newMember.hasApto === "Entregado" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in zoom-in-95">
                  <div className="space-y-2">
                    <Label>Vencimiento del Apto</Label>
                    <Input
                      type="date"
                      value={newMember.aptoExp}
                      onChange={(e) => setNewMember({ ...newMember, aptoExp: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Subir Certificado (PDF/Imagen)</Label>
                    <Input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setNewMember((prev: any) => ({
                              ...prev,
                              aptoDocUrl: reader.result as string,
                            }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="h-9 py-1 text-xs cursor-pointer bg-background"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>Notas Médicas / Alergias / Lesiones</Label>
              <Textarea
                value={newMember.medicalNotes}
                onChange={(e) => setNewMember({ ...newMember, medicalNotes: e.target.value })}
                placeholder="Ej: Problemas lumbares, asma, etc."
                className="min-h-[80px] text-xs bg-background"
              />
            </div>
          </div>

          {/* Comercial */}
          <div className="space-y-4 pt-4 border-t border-border/50">
            <h3 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider">
              C. Comercial
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Plan de Membresía</Label>
                <Select
                  value={newMember.plan}
                  onValueChange={(val) => {
                    const autoEnd = getExpirationDateForPlan(val, membershipsList);
                    setNewMember((prev: any) => ({ ...prev, plan: val, end: autoEnd }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar Plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {membershipsList?.map((m: any) => (
                      <SelectItem key={m.id} value={m.name}>
                        {m.name}
                      </SelectItem>
                    )) || <SelectItem value="Pase Libre">Pase Libre</SelectItem>}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Método de Pago del Alumno</Label>
                <Select
                  value={newMember.paymentMethod || "Efectivo"}
                  onValueChange={(val) =>
                    setNewMember((prev: any) => ({ ...prev, paymentMethod: val }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar Método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Efectivo">Efectivo</SelectItem>
                    <SelectItem value="Transferencia Bancaria / CBU">
                      Transferencia Bancaria / CBU
                    </SelectItem>
                    <SelectItem value="Mercado Pago (Marketplace / App)">
                      Mercado Pago (Marketplace / App)
                    </SelectItem>
                    <SelectItem value="Tarjeta de Débito / Crédito (POS)">
                      Tarjeta Posnet (Débito / Crédito)
                    </SelectItem>
                    <SelectItem value="Otro">Otro Medio de Pago</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Estado de Cuenta</Label>
                <Select
                  value={newMember.status}
                  onValueChange={(val) => setNewMember({ ...newMember, status: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="pendiente">Pago Pendiente</SelectItem>
                    <SelectItem value="vencido">Vencido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Vencimiento del Plan</Label>
                <Input
                  type="date"
                  value={newMember.end}
                  onChange={(e) => setNewMember({ ...newMember, end: e.target.value })}
                />
                <p className="text-[10.5px] text-muted-foreground">
                  Auto-calculado (
                  {membershipsList?.find((m: any) => m.name === newMember.plan)?.duration ||
                    "Mensual"}
                  ). Podés ajustarlo si lo deseás.
                </p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="mt-8 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onSave} disabled={!newMember.name || !newMember.dni}>
            {editingMemberId ? "Guardar Cambios" : "Guardar Alumno"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
