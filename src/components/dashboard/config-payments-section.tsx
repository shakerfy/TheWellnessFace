import React, { useState } from "react";
import {
  Wallet,
  Zap,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Unlink,
  Copy,
  DollarSign,
  CreditCard,
  Building2,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export function ConfigPaymentsSection() {
  const [cashEnabled, setCashEnabled] = useState(true);
  const [transferEnabled, setTransferEnabled] = useState(true);
  const [bankDetails, setBankDetails] = useState({
    alias: "GIMNASIO.SHAKERFY",
    cbu: "0000003100049281749281",
    bankName: "Banco Galicia",
    accountHolder: "Shakerfy Gym SRL",
    cuit: "30-71629401-9",
  });
  const [posEnabled, setPosEnabled] = useState(true);
  const [mpEnabled, setMpEnabled] = useState(true);
  const [mpConnected, setMpConnected] = useState(false);
  const [mpIsConnecting, setMpIsConnecting] = useState(false);
  const [mpAccountInfo, setMpAccountInfo] = useState<{
    merchantName: string;
    email: string;
    accountId: string;
    accessToken: string;
    publicKey: string;
    linkedDate: string;
  } | null>(null);
  const [mpUseSandbox, setMpUseSandbox] = useState(false);
  const [mpSubscriptionsEnabled, setMpSubscriptionsEnabled] = useState(true);
  const [mpInstallmentsEnabled, setMpInstallmentsEnabled] = useState(true);

  const handleConnectMercadoPago = () => {
    setMpIsConnecting(true);
    setTimeout(() => {
      setMpConnected(true);
      setMpAccountInfo({
        merchantName: "Gimnasio Shakerfy",
        email: "pagos@shakerfy.com",
        accountId: "MP-USR-82947192",
        accessToken: "APP_USR-8492049281940291-080215-9482710492-748392",
        publicKey: "APP_USR-83921049-8392-4920-b481-948201948291",
        linkedDate: new Date().toLocaleDateString("es-AR"),
      });
      setMpIsConnecting(false);
      toast.success("★ Cuenta de Mercado Pago vinculada exitosamente vía OAuth");
    }, 1200);
  };

  const handleDisconnectMercadoPago = () => {
    setMpConnected(false);
    setMpAccountInfo(null);
    toast.info("Cuenta de Mercado Pago desvinculada.");
  };

  return (
    <div className="space-y-8 max-w-4xl animate-fade-up text-foreground">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" /> Métodos de Cobro y Pagos Digitales
          </h3>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Activa y gestiona las pasarelas de pago digitales y cobros presenciales habilitados para tu gimnasio.
          </p>
        </div>
      </div>

      {/* Tarjeta Destacada: Mercado Pago Integración OAuth */}
      <div className="rounded-3xl border border-[#009EE3]/30 bg-gradient-to-b from-[#009EE3]/5 to-card p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-[#009EE3] text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
              <Zap className="h-6 w-6 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-base text-foreground">Mercado Pago</h4>
                {mpConnected ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full uppercase">
                    <CheckCircle2 className="h-3 w-3" /> Conectado
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-black bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full uppercase">
                    <AlertCircle className="h-3 w-3" /> No Vinculado
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Permite que tus alumnos paguen con tarjetas de crédito, débito, dinero en cuenta o suscripciones automáticas.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-muted-foreground">Habilitar MP:</span>
            <Switch checked={mpEnabled} onCheckedChange={setMpEnabled} />
          </div>
        </div>

        {/* Status Box & OAuth Action */}
        {!mpConnected ? (
          <div className="rounded-2xl border border-dashed border-[#009EE3]/40 bg-card p-5 space-y-4">
            <div className="space-y-1">
              <h5 className="font-bold text-xs text-foreground uppercase tracking-wider text-muted-foreground/80">
                Vinculación con Mercado Pago
              </h5>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Conecta tu cuenta de Mercado Pago para que tus usuarios puedan abonar sus membresías y pases directamente desde Shakerfy.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button
                type="button"
                onClick={handleConnectMercadoPago}
                disabled={mpIsConnecting}
                className="bg-[#009EE3] hover:bg-[#0089C7] text-white font-bold rounded-xl px-5 h-11 shadow-sm gap-2 text-xs"
              >
                <Zap className="h-4 w-4 fill-white" />
                {mpIsConnecting ? "Conectando..." : "Conectar con Mercado Pago"}
              </Button>
              <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Conexión segura de cuenta
              </span>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-4">
              <div>
                <span className="text-[10.5px] font-bold uppercase text-muted-foreground tracking-wider block mb-0.5">
                  Cuenta Conectada
                </span>
                <div className="text-sm font-extrabold text-foreground flex items-center gap-2">
                  {mpAccountInfo?.merchantName}
                  <span className="text-xs font-semibold text-muted-foreground font-mono">
                    ({mpAccountInfo?.accountId})
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Email: <strong className="text-foreground">{mpAccountInfo?.email}</strong> · Vinculado el {mpAccountInfo?.linkedDate}
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDisconnectMercadoPago}
                className="rounded-xl text-xs font-bold border-rose-500/30 text-rose-600 hover:bg-rose-500/10 hover:text-rose-700 h-9 gap-1.5"
              >
                <Unlink className="h-3.5 w-3.5" /> Desconectar Cuenta
              </Button>
            </div>

            {/* Webhook notification URL listener */}
            <div className="pt-1">
              <span className="text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                URL de Webhook Notificaciones
              </span>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  readOnly
                  value="https://api.shakerfy.com/v1/webhooks/mercadopago"
                  className="h-9 font-mono text-xs bg-background border-border text-foreground rounded-xl"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText("https://api.shakerfy.com/v1/webhooks/mercadopago");
                    toast.success("✓ URL de Webhook copiada");
                  }}
                  className="h-9 rounded-xl text-xs font-bold gap-1 shrink-0"
                >
                  <Copy className="h-3.5 w-3.5" /> Copiar
                </Button>
              </div>
            </div>

            {/* Advanced Mercado Pago Switches */}
            <div className="grid gap-4 sm:grid-cols-3 pt-3 border-t border-border/40">
              <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/20 border border-border/40">
                <div className="space-y-0.5">
                  <Label className="text-xs font-bold text-foreground">Suscripciones Recurrentes</Label>
                  <p className="text-[10px] text-muted-foreground">Débito automático mensual</p>
                </div>
                <Switch
                  checked={mpSubscriptionsEnabled}
                  onCheckedChange={setMpSubscriptionsEnabled}
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/20 border border-border/40">
                <div className="space-y-0.5">
                  <Label className="text-xs font-bold text-foreground">Aceptar Cuotas</Label>
                  <p className="text-[10px] text-muted-foreground">Habilitar tarjetas en cuotas</p>
                </div>
                <Switch
                  checked={mpInstallmentsEnabled}
                  onCheckedChange={setMpInstallmentsEnabled}
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/20 border border-border/40">
                <div className="space-y-0.5">
                  <Label className="text-xs font-bold text-foreground">Modo Sandbox (Pruebas)</Label>
                  <p className="text-[10px] text-muted-foreground">Usar credenciales TEST</p>
                </div>
                <Switch
                  checked={mpUseSandbox}
                  onCheckedChange={(val) => {
                    setMpUseSandbox(val);
                    toast.info(val ? "Modo Sandbox activado para pruebas." : "Modo Producción activado.");
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tarjeta: Métodos Manuales y Presenciales */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-6">
        <div>
          <h4 className="font-bold text-sm text-foreground uppercase tracking-wider text-muted-foreground/80">
            Cobros Presenciales & Métodos Manuales
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Habilita las opciones de cobro recibidas en recepción o mostrador.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Efectivo */}
          <div className="rounded-2xl border border-border bg-background p-4 flex flex-col justify-between space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <DollarSign className="h-4 w-4" />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-foreground">Efectivo</h5>
                  <span className="text-[10px] text-muted-foreground">En mostrador / caja</span>
                </div>
              </div>
              <Switch checked={cashEnabled} onCheckedChange={setCashEnabled} />
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Permite registrar cobros de membresías en dinero en efectivo en el establecimiento.
            </p>
          </div>

          {/* POS Terminal */}
          <div className="rounded-2xl border border-border bg-background p-4 flex flex-col justify-between space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-foreground">Tarjeta en POS</h5>
                  <span className="text-[10px] text-muted-foreground">Terminal de red local</span>
                </div>
              </div>
              <Switch checked={posEnabled} onCheckedChange={setPosEnabled} />
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Procesa tarjetas de débito/crédito con la posnet física del local.
            </p>
          </div>

          {/* Transferencia Bancaria */}
          <div className="rounded-2xl border border-border bg-background p-4 flex flex-col justify-between space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-foreground">Transferencia</h5>
                  <span className="text-[10px] text-muted-foreground">CBU / CVU / Alias</span>
                </div>
              </div>
              <Switch checked={transferEnabled} onCheckedChange={setTransferEnabled} />
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Muestra los datos bancarios del gimnasio para transferencias directas de alumnos.
            </p>
          </div>
        </div>

        {/* Formulario Datos Bancarios si Transferencia está activa */}
        {transferEnabled && (
          <div className="rounded-2xl border border-border/80 bg-secondary/15 p-5 space-y-4 pt-4">
            <h5 className="font-bold text-xs text-foreground uppercase tracking-wider text-muted-foreground/80 flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-primary" /> Datos de la Cuenta Bancaria (CBU / Alias)
            </h5>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground font-semibold">Alias Bancario</Label>
                <Input
                  type="text"
                  value={bankDetails.alias}
                  onChange={(e) => setBankDetails({ ...bankDetails, alias: e.target.value })}
                  placeholder="Ej: GIMNASIO.SHAKERFY"
                  className="h-9 text-xs rounded-xl bg-background border-border text-foreground font-bold"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground font-semibold">CBU / CVU (22 dígitos)</Label>
                <Input
                  type="text"
                  value={bankDetails.cbu}
                  onChange={(e) => setBankDetails({ ...bankDetails, cbu: e.target.value })}
                  placeholder="Ej: 0000003100049281749281"
                  className="h-9 text-xs rounded-xl bg-background border-border text-foreground font-mono"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground font-semibold">Banco / Entidad Financiera</Label>
                <Input
                  type="text"
                  value={bankDetails.bankName}
                  onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                  placeholder="Ej: Banco Galicia / Mercado Pago"
                  className="h-9 text-xs rounded-xl bg-background border-border text-foreground"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground font-semibold">Titular de la Cuenta</Label>
                <Input
                  type="text"
                  value={bankDetails.accountHolder}
                  onChange={(e) => setBankDetails({ ...bankDetails, accountHolder: e.target.value })}
                  placeholder="Ej: Shakerfy Gym SRL"
                  className="h-9 text-xs rounded-xl bg-background border-border text-foreground font-semibold"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* General Save Confirmation */}
      <div className="flex justify-end pt-2">
        <Button
          type="button"
          onClick={() => toast.success("✓ Ajustes de Métodos de Cobro guardados con éxito.")}
          className="rounded-xl text-xs font-bold px-6 h-10 bg-primary text-primary-foreground shadow-sm gap-1.5"
        >
          <Save className="h-4 w-4" /> Guardar Métodos de Cobro
        </Button>
      </div>
    </div>
  );
}
