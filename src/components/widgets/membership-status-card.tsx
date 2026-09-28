import { useState } from "react";
import { CreditCard, Copy, Check, Sparkles, RefreshCw, AlertCircle, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface MembershipStatusCardProps {
  gymName: string;
  planName: string;
  creditsRemaining: number;
  totalCredits?: number;
  expiresAt: string;
  isActive?: boolean;
  linkingCode?: string;
  onRenew?: () => void;
  onGenerateCode?: () => Promise<string> | string;
  className?: string;
}

export function MembershipStatusCard({
  gymName,
  planName,
  creditsRemaining,
  totalCredits = 12,
  expiresAt,
  isActive = true,
  linkingCode = "WF-4829",
  onRenew,
  onGenerateCode,
  className,
}: MembershipStatusCardProps) {
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState(linkingCode);
  const [generating, setGenerating] = useState(false);

  const isLowCredits = creditsRemaining <= 2;

  const handleCopyCode = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Código copiado para usar en ChatGPT, Claude o Google Calendar");
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(25);
      }
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("No se pudo copiar el código al portapapeles");
    }
  };

  const handleNewCode = async () => {
    if (generating) return;
    setGenerating(true);
    try {
      if (onGenerateCode) {
        const newCode = await onGenerateCode();
        setCode(newCode);
      } else {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        setCode(`WF-${randomNum}`);
      }
      toast.success("Nuevo código de vinculación generado");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between rounded-3xl border border-border bg-card p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg",
        !isActive && "border-amber-500/40 bg-amber-500/[0.02]",
        className
      )}
    >
      <div>
        {/* Header Kicker */}
        <div className="flex items-center justify-between gap-2 pb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-primary" /> Membresía Activa
          </span>

          <Badge
            variant={isActive ? "default" : "secondary"}
            className={cn(
              "text-[10px] font-semibold tracking-wider uppercase rounded-full px-2.5 py-0.5",
              isActive ? "bg-primary text-primary-foreground" : "bg-amber-500/10 text-amber-600 border-amber-500/30"
            )}
          >
            {isActive ? "Al día" : "Vencida"}
          </Badge>
        </div>

        {/* Gimnasio y Nombre del Plan */}
        <h3 className="font-bebas text-2xl tracking-wide text-foreground mt-1">
          {gymName}
        </h3>
        <p className="text-xs text-muted-foreground font-medium">{planName}</p>

        {/* Estado de Créditos */}
        <div className="mt-4 p-3.5 rounded-2xl bg-secondary/40 border border-border/60 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">
              Clases Disponibles
            </span>
            <span className="font-bebas text-2xl tracking-wide text-foreground">
              {creditsRemaining} <span className="text-xs font-sans text-muted-foreground">/ {totalCredits}</span>
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">
              Vencimiento
            </span>
            <span className="text-xs font-semibold text-foreground/90">
              {expiresAt}
            </span>
          </div>
        </div>

        {/* Caja de Código de Vinculación IA (ChatGPT, Claude, Google Workspace, Meta AI) */}
        <div className="mt-3.5 p-3 rounded-2xl border border-dashed border-primary/30 bg-primary/[0.03]">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Tu Código de Conexión IA
            </span>
            <button
              type="button"
              onClick={handleNewCode}
              disabled={generating}
              className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer transition-colors"
              title="Generar nuevo código"
            >
              <RefreshCw className={cn("w-2.5 h-2.5", generating && "animate-spin")} /> Renovar
            </button>
          </div>

          <div className="flex items-center justify-between gap-2">
            <code className="font-mono text-base font-bold tracking-widest text-foreground bg-background px-2.5 py-1 rounded-lg border border-border">
              {code}
            </code>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyCode}
              className="h-8 rounded-xl text-xs font-medium cursor-pointer"
            >
              {copied ? (
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <Check className="w-3.5 h-3.5" /> Copiado
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Copy className="w-3.5 h-3.5" /> Copiar
                </span>
              )}
            </Button>
          </div>
          <span className="text-[10px] text-muted-foreground block mt-1">
            Escribí este código en ChatGPT, Claude o Google Calendar para vincular tus turnos.
          </span>
        </div>
      </div>

      {/* Footer con Renovación */}
      {(isLowCredits || !isActive) && (
        <div className="pt-4 mt-3 border-t border-border/40 flex items-center justify-between">
          <span className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> {isActive ? "Pocos créditos" : "Membresía inactiva"}
          </span>

          <Button
            size="sm"
            onClick={onRenew}
            className="rounded-full px-4 text-xs font-semibold bg-foreground text-background hover:bg-foreground/90 cursor-pointer shadow-sm"
          >
            Renovar <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
