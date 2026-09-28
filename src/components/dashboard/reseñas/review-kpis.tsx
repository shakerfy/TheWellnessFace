import { Star } from "lucide-react";

interface ReviewKpisProps {
  overallAvg: string;
  totalEvaluationsCount: number;
  responseRatePercentage: number;
  pendingRepliesCount: number;
  featuredCount: number;
  pendingPrivateCount: number;
}

export function ReviewKpis({
  overallAvg,
  totalEvaluationsCount,
  responseRatePercentage,
  pendingRepliesCount,
  featuredCount,
  pendingPrivateCount,
}: ReviewKpisProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-card border border-border/80 p-5 rounded-3xl shadow-xs space-y-1 hover:-translate-y-1 transition-all duration-300">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
          Puntuación General
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-amber-500 dark:text-amber-400 flex items-center gap-1.5">
            <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
            {overallAvg}
          </span>
          <span className="text-xs text-muted-foreground font-semibold">/ 5.0</span>
        </div>
        <p className="text-[11px] text-muted-foreground pt-1">
          Basado en <strong>{totalEvaluationsCount}</strong> evaluaciones verificadas.
        </p>
      </div>

      <div className="bg-card border border-border/80 p-5 rounded-3xl shadow-xs space-y-1 hover:-translate-y-1 transition-all duration-300">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
          Tasa de Respuesta
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-foreground">{responseRatePercentage}%</span>
          <span className="text-xs text-emerald-600 font-bold">Oficial</span>
        </div>
        <p className="text-[11px] text-muted-foreground pt-1">
          {pendingRepliesCount > 0 ? (
            <span className="text-amber-600 font-semibold">
              {pendingRepliesCount} pendientes de respuesta.
            </span>
          ) : (
            <span className="text-emerald-600 font-semibold">100% de opiniones respondidas.</span>
          )}
        </p>
      </div>

      <div className="bg-card border border-border/80 p-5 rounded-3xl shadow-xs space-y-1 hover:-translate-y-1 transition-all duration-300">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
          Destacadas en Perfil
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-primary">{featuredCount}</span>
          <span className="text-xs text-muted-foreground">reseñas</span>
        </div>
        <p className="text-[11px] text-muted-foreground pt-1">
          Visibles en el perfil público del centro.
        </p>
      </div>

      <div className="bg-card border border-border/80 p-5 rounded-3xl shadow-xs space-y-1 hover:-translate-y-1 transition-all duration-300">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
          Sugerencias Privadas
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-foreground">{pendingPrivateCount}</span>
          <span className="text-xs text-amber-600 font-bold">Sin revisar</span>
        </div>
        <p className="text-[11px] text-muted-foreground pt-1">
          Mensajes directos para la administración.
        </p>
      </div>
    </div>
  );
}
