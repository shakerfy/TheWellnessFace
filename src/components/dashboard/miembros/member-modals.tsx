import React from "react";
import {
  CreditCard,
  ShieldAlert,
  AlertCircle,
  Snowflake,
  Send,
  MessageCircle,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { MemberItem, MemberPayment } from "./types";

interface RenewMemberModalProps {
  renewMemberId: string | null;
  renewPlan: string;
  setRenewPlan: (p: string) => void;
  renewMonths: string;
  setRenewMonths: (m: string) => void;
  renewPaymentMethod: string;
  setRenewPaymentMethod: (pm: string) => void;
  mpRenewAction: "skip" | "cancel";
  setMpRenewAction: (action: "skip" | "cancel") => void;
  membersList: MemberItem[];
  membershipsList?: any[];
  onConfirmRenew: () => void;
  onClose: () => void;
}

export function RenewMemberModal({
  renewMemberId,
  renewPlan,
  setRenewPlan,
  renewMonths,
  setRenewMonths,
  renewPaymentMethod,
  setRenewPaymentMethod,
  mpRenewAction,
  setMpRenewAction,
  membersList,
  membershipsList,
  onConfirmRenew,
  onClose,
}: RenewMemberModalProps) {
  const memberObj = membersList.find((m) => m.name === renewMemberId);
  const isMp = memberObj?.paymentMethod === "Mercado Pago (Auto)" || memberObj?.isAutoRenew;

  return (
    <Dialog open={!!renewMemberId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md rounded-3xl p-6 border-border shadow-2xl bg-card">
        <DialogHeader>
          <DialogTitle className="text-lg font-black text-foreground flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" /> Registrar Pago / Renovar Plan
          </DialogTitle>
        </DialogHeader>

        <div className="py-2 space-y-4">
          <p className="text-xs text-muted-foreground">
            ¿Confirmás la renovación del plan para{" "}
            <strong className="text-foreground font-bold">{renewMemberId}</strong>?
          </p>

          {isMp && (
            <div className="p-3.5 bg-blue-500/10 border border-blue-500/30 rounded-2xl space-y-2.5 text-xs">
              <div className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" />
                <span>Alumno con Débito Automático Activo</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Este alumno abona mediante Mercado Pago. Selecciona la acción a tomar en la
                pasarela al registrar este cobro manual:
              </p>
              <RadioGroup
                value={mpRenewAction}
                onValueChange={(val: "skip" | "cancel") => setMpRenewAction(val)}
                className="space-y-2 pt-1"
              >
                <div className="flex items-start gap-2.5 cursor-pointer font-medium text-[11px]">
                  <RadioGroupItem value="skip" id="mp-skip" className="mt-0.5" />
                  <Label htmlFor="mp-skip" className="cursor-pointer font-normal">
                    <span className="font-bold block text-foreground">
                      Saltear este mes en Mercado Pago
                    </span>
                    <span className="text-muted-foreground text-[10px]">
                      Pospone la fecha del próximo débito automático 30 días.
                    </span>
                  </Label>
                </div>
                <div className="flex items-start gap-2.5 cursor-pointer font-medium text-[11px]">
                  <RadioGroupItem value="cancel" id="mp-cancel" className="mt-0.5" />
                  <Label htmlFor="mp-cancel" className="cursor-pointer font-normal">
                    <span className="font-bold block text-foreground">
                      Cancelar Débito Automático
                    </span>
                    <span className="text-muted-foreground text-[10px]">
                      Cancela la suscripción en MP para pasar a pago manual permanente.
                    </span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-xs font-bold">Plan a contratar / renovar</Label>
            <Select
              value={renewPlan || memberObj?.plan || membershipsList?.[0]?.name || "Pase Libre"}
              onValueChange={(val) => setRenewPlan(val)}
            >
              <SelectTrigger className="h-9 rounded-xl text-xs bg-secondary/30">
                <SelectValue placeholder="Seleccionar plan" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {membershipsList?.map((p: any) => (
                  <SelectItem key={p.id} value={p.name}>
                    {p.name} (${p.price?.toLocaleString()} / {p.duration || "Mensual"})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold">Duración de la renovación</Label>
            <Select value={renewMonths} onValueChange={setRenewMonths}>
              <SelectTrigger className="h-9 rounded-xl text-xs bg-secondary/30">
                <SelectValue placeholder="Seleccionar duración" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="1">1 Mes</SelectItem>
                <SelectItem value="3">3 Meses (Trimestre)</SelectItem>
                <SelectItem value="6">6 Meses (Semestre)</SelectItem>
                <SelectItem value="12">12 Meses (Año)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold">Método de Pago</Label>
            <Select value={renewPaymentMethod} onValueChange={setRenewPaymentMethod}>
              <SelectTrigger className="h-9 rounded-xl text-xs bg-secondary/30">
                <SelectValue placeholder="Método de pago" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
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
          <p className="text-xs text-muted-foreground bg-primary/10 text-primary p-2.5 rounded-xl border border-primary/20">
            Se actualizará su estado a <span className="font-bold">Activo</span> y se extenderá
            su vencimiento por {renewMonths} mes{renewMonths === "1" ? "" : "es"}.
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" className="rounded-xl font-bold" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={onConfirmRenew}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-xl"
          >
            Confirmar Pago
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface CancelConfirmModalProps {
  cancelConfirmMember: MemberItem | null;
  onConfirmCancel: () => void;
  onClose: () => void;
}

export function CancelConfirmModal({
  cancelConfirmMember,
  onConfirmCancel,
  onClose,
}: CancelConfirmModalProps) {
  return (
    <AlertDialog open={!!cancelConfirmMember} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="rounded-3xl border-border shadow-2xl bg-card max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-black text-foreground flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-500" /> Dar de Baja / Archivar Alumno
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-muted-foreground pt-1 space-y-2">
            <span>
              ¿Confirmás la baja del alumno{" "}
              <strong className="text-foreground">{cancelConfirmMember?.name}</strong>?
            </span>
            {(cancelConfirmMember?.paymentMethod === "Mercado Pago (Auto)" ||
              cancelConfirmMember?.isAutoRenew) && (
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-700 dark:text-amber-300 font-medium text-[11px] leading-relaxed mt-2">
                <strong>Aviso Mercado Pago:</strong> Este alumno tiene una suscripción activa de
                Débito Automático. Al darlo de baja, la suscripción se cancelará automáticamente en
                Mercado Pago para evitar cobros futuros.
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 gap-2">
          <AlertDialogCancel className="rounded-xl font-bold" onClick={onClose}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            className="rounded-xl font-bold bg-amber-600 text-white hover:bg-amber-700"
            onClick={onConfirmCancel}
          >
            Confirmar Baja
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface CantDeleteWarningModalProps {
  cantDeleteWarningMember: MemberItem | null;
  onClose: () => void;
}

export function CantDeleteWarningModal({
  cantDeleteWarningMember,
  onClose,
}: CantDeleteWarningModalProps) {
  return (
    <AlertDialog open={!!cantDeleteWarningMember} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="rounded-3xl border-border shadow-2xl bg-card max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-black text-foreground flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" /> No es posible eliminar
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-muted-foreground pt-1 space-y-2">
            <span>
              No se puede eliminar físicamente la ficha de{" "}
              <strong className="text-foreground">{cantDeleteWarningMember?.name}</strong> porque
              cuenta con registros contables de pagos en Caja o Mercado Pago.
            </span>
            <div className="p-3 bg-muted/40 border border-border/60 rounded-2xl text-foreground font-medium text-[11px] leading-relaxed mt-2">
              <strong>Recomendación de Producción:</strong> Te sugerimos usar la opción{" "}
              <strong>"Dar de Baja / Archivar"</strong> para pausar la cuenta y cancelar sus débitos
              sin alterar la integridad de tus reportes financieros.
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogAction
            className="rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={onClose}
          >
            Entendido
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface FreezeMemberModalProps {
  freezeDialogMember: string | null;
  freezeDaysInput: string;
  setFreezeDaysInput: (days: string) => void;
  onConfirmFreeze: () => void;
  onClose: () => void;
}

export function FreezeMemberModal({
  freezeDialogMember,
  freezeDaysInput,
  setFreezeDaysInput,
  onConfirmFreeze,
  onClose,
}: FreezeMemberModalProps) {
  return (
    <Dialog open={!!freezeDialogMember} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md rounded-3xl p-6 border-border shadow-2xl bg-card">
        <DialogHeader>
          <DialogTitle className="text-lg font-black text-foreground flex items-center gap-2">
            <Snowflake className="h-5 w-5 text-blue-500" /> Congelar Membresía
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground pt-1">
            Selecciona o ingresa por cuántos días deseas pausar la membresía de{" "}
            <strong className="text-foreground">{freezeDialogMember}</strong>.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold">Días de Congelamiento</Label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {["7", "15", "30", "45", "60"].map((d) => (
                <Button
                  key={d}
                  type="button"
                  variant={freezeDaysInput === d ? "default" : "outline"}
                  size="sm"
                  className="rounded-xl text-xs font-bold"
                  onClick={() => setFreezeDaysInput(d)}
                >
                  {d} días
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">
              Otro período (días personalizados):
            </Label>
            <Input
              type="number"
              value={freezeDaysInput}
              onChange={(e) => setFreezeDaysInput(e.target.value)}
              className="rounded-xl text-xs bg-secondary/30"
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" className="rounded-xl font-bold" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            className="rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white"
            onClick={onConfirmFreeze}
          >
            Confirmar Congelamiento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ReceiptModalProps {
  viewingReceipt: { member: MemberItem; payment: MemberPayment } | null;
  onClose: () => void;
}

export function ReceiptModal({ viewingReceipt, onClose }: ReceiptModalProps) {
  return (
    <Dialog open={!!viewingReceipt} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm font-mono text-xs text-foreground p-6 bg-card border border-border">
        {viewingReceipt && (
          <div className="space-y-4">
            <div className="border border-border/80 p-4 bg-secondary/30 rounded-xl space-y-3 relative overflow-hidden">
              <div className="absolute right-4 top-2 text-[120px] font-black text-foreground/5 pointer-events-none select-none">
                X
              </div>

              <div className="text-center border-b border-dashed border-border pb-3">
                <h3 className="font-bold text-sm tracking-wider uppercase">Kraft Strength Club</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Av. Coronel Díaz 2140, Palermo
                </p>
                <p className="text-[9px] text-muted-foreground">C.A.B.A - Argentina</p>
              </div>

              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between font-bold">
                  <span>DOC. NO VÁLIDO COMO FACTURA</span>
                  <span className="px-1.5 py-0.2 bg-black text-white text-[9px] rounded">
                    RECIBO X
                  </span>
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">
                  Nro Recibo: {viewingReceipt.payment.id}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Fecha: {viewingReceipt.payment.date}
                </div>
              </div>

              <div className="border-t border-b border-dashed border-border py-2 my-2 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Recibimos de:</span>
                  <span className="font-bold">{viewingReceipt.member.name}</span>
                </div>
                {viewingReceipt.member.dni && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">DNI:</span>
                    <span className="font-semibold">{viewingReceipt.member.dni}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Concepto:</span>
                  <span className="font-semibold">
                    Membresía {viewingReceipt.member.plan} ({viewingReceipt.payment.duration})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Forma de Pago:</span>
                  <span className="font-semibold">{viewingReceipt.payment.method}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm pt-1">
                <span className="font-bold uppercase tracking-wider">Total Pagado:</span>
                <span className="font-black text-primary text-lg">
                  ${viewingReceipt.payment.amount}
                </span>
              </div>

              <div className="text-center text-[9px] text-muted-foreground pt-4 border-t border-dashed border-border/60">
                Gracias por entrenar con nosotros.
              </div>
            </div>

            <DialogFooter className="sm:justify-end flex flex-wrap gap-2 pt-2">
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-xs font-bold rounded-xl border-border hover:bg-secondary"
                    >
                      <Send className="w-3.5 h-3.5 text-primary" />
                      <span>Compartir</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 rounded-xl p-1.5 shadow-xl border-border"
                  >
                    <DropdownMenuItem
                      disabled={!viewingReceipt.member.phone}
                      onClick={() => {
                        const phone = (viewingReceipt.member.phone || "").replace(/[^0-9]/g, "");
                        const shareText = encodeURIComponent(
                          `Recibo de Pago - Shakerfy\n\nAlumno: ${viewingReceipt.member.name}\nConcepto: Membresía ${viewingReceipt.member.plan} (${viewingReceipt.payment.duration})\nMonto: $${viewingReceipt.payment.amount}\nFecha: ${viewingReceipt.payment.date}\nNº Recibo: ${viewingReceipt.payment.id}\n\n¡Gracias por entrenar con nosotros!`,
                        );
                        window.open(`https://wa.me/${phone}?text=${shareText}`, "_blank");
                        toast.success("Recibo compartido por WhatsApp.");
                      }}
                      className="text-xs font-medium cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 mr-2 text-emerald-500" />
                      <span>Por WhatsApp</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={!viewingReceipt.member.email}
                      onClick={() => {
                        const email = viewingReceipt.member.email || "";
                        const mailSubject = encodeURIComponent(
                          `Recibo de Pago Nº ${viewingReceipt.payment.id} - Shakerfy`,
                        );
                        const mailBody = encodeURIComponent(
                          `Hola ${viewingReceipt.member.name},\n\nAquí tienes el comprobante de tu recibo de pago:\n\nConcepto: Membresía ${viewingReceipt.member.plan} (${viewingReceipt.payment.duration})\nMonto Total: $${viewingReceipt.payment.amount}\nFecha: ${viewingReceipt.payment.date}\nNº Comprobante: ${viewingReceipt.payment.id}\n\n¡Gracias por entrenar con nosotros!`,
                        );
                        window.open(`mailto:${email}?subject=${mailSubject}&body=${mailBody}`);
                        toast.success("Recibo compartido por Email.");
                      }}
                      className="text-xs font-medium cursor-pointer"
                    >
                      <Send className="w-4 h-4 mr-2 text-blue-500" />
                      <span>Por Correo</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  size="sm"
                  onClick={() => {
                    window.print();
                  }}
                  className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl font-bold"
                >
                  <Download className="w-3.5 h-3.5" /> Imprimir Recibo
                </Button>
              </div>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
