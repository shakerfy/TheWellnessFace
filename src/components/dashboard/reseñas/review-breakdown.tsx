import { Star } from "lucide-react";

interface ReviewBreakdownProps {
  avgCleanliness: string;
  avgEquipment: string;
  avgStaff: string;
  avgPrice: string;
  starCounts: Record<number, number>;
  totalEvaluationsCount: number;
}

export function ReviewBreakdown({
  avgCleanliness,
  avgEquipment,
  avgStaff,
  avgPrice,
  starCounts,
  totalEvaluationsCount,
}: ReviewBreakdownProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Sub-ratings Breakdown */}
      <div className="bg-card border border-border p-6 rounded-3xl space-y-5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
          Calificaciones Promedio por Categoría
        </span>

        <div className="space-y-4">
          {[
            { label: "Limpieza & Vestuarios", score: avgCleanliness },
            { label: "Equipamiento & Mantenimiento", score: avgEquipment },
            { label: "Atención del Staff & Recepción", score: avgStaff },
            { label: "Relación Calidad / Precio", score: avgPrice },
          ].map((cat) => (
            <div key={cat.label} className="space-y-1">
              <div className="flex justify-between items-center text-xs font-bold text-foreground">
                <span>{cat.label}</span>
                <span className="font-mono text-sm text-amber-600 dark:text-amber-400 font-extrabold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  {cat.score}
                </span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 dark:bg-amber-500 rounded-full transition-all duration-700"
                  style={{ width: `${(parseFloat(cat.score) / 5) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stars Distribution Bar Graph */}
      <div className="bg-card border border-border p-6 rounded-3xl space-y-5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
          Distribución de Estrellas ({totalEvaluationsCount})
        </span>

        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = (starCounts as any)[stars] || 0;
            const pct = Math.round((count / totalEvaluationsCount) * 100);
            return (
              <div key={stars} className="flex items-center gap-3 text-xs">
                <span className="w-12 font-bold text-amber-500 dark:text-amber-400 text-right shrink-0 flex items-center justify-end gap-1">
                  {stars} <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                </span>
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 dark:bg-amber-500 rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-16 font-mono text-[11px] text-muted-foreground text-right shrink-0">
                  {pct}% ({count})
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
