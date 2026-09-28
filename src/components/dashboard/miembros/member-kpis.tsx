import React from "react";
import { Users, CreditCard, AlertCircle, ShieldAlert } from "lucide-react";

interface MemberKpisProps {
  stats: {
    actives: number;
    debts: number;
    expiredAptos: number;
    churnRisks: number;
  };
}

export function MemberKpis({ stats }: MemberKpisProps) {
  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      <div className="group rounded-3xl border border-border bg-card p-5 flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg shadow-xs cursor-pointer">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
            Alumnos Activos
          </span>
          <span className="text-2xl font-black text-primary mt-1 block">{stats.actives}</span>
        </div>
        <Users className="h-8 w-8 text-primary/30" />
      </div>

      <div className="group rounded-3xl border border-border bg-card p-5 flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg shadow-xs cursor-pointer">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
            En Mora / Deuda
          </span>
          <span className="text-2xl font-black text-destructive mt-1 block">{stats.debts}</span>
        </div>
        <CreditCard className="h-8 w-8 text-destructive/30" />
      </div>

      <div className="group rounded-3xl border border-border bg-card p-5 flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg shadow-xs cursor-pointer">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
            Apto Vencido
          </span>
          <span className="text-2xl font-black text-amber-500 mt-1 block">
            {stats.expiredAptos}
          </span>
        </div>
        <AlertCircle className="h-8 w-8 text-amber-500/30" />
      </div>

      <div className="group rounded-3xl border border-border bg-card p-5 flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg shadow-xs cursor-pointer">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
            Riesgo de Baja
          </span>
          <span className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1 block">
            {stats.churnRisks}
          </span>
        </div>
        <ShieldAlert className="h-8 w-8 text-purple-500/30" />
      </div>
    </div>
  );
}
