import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NutrientFactRow {
  category: string;
  label: string;
  value: string;
  iconType?: string;
}

export interface NutritionFactsTableProps {
  rows: NutrientFactRow[];
  title?: string;
  subtitle?: string;
  servingLabel?: string;
  className?: string;
  showDisclaimer?: boolean;
  qualityLabel?: "Óptima" | "Equilibrada" | "Simple";
  qualityTier?: 1 | 2 | 3;
  combinationInsight?: string;
}

export function NutritionFactsTable({
  rows,
  title = "PERFIL NUTRICIONAL",
  servingLabel,
  className,
  showDisclaimer = true,
  qualityLabel,
  qualityTier,
  combinationInsight,
}: NutritionFactsTableProps) {
  const [isInsightOpen, setIsInsightOpen] = useState(false);

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-card p-4 sm:p-5 text-left shadow-2xs transition-all",
        className,
      )}
    >
      {/* Header */}
      <div className="space-y-0.5">
        <h4 className="font-bebas text-2xl sm:text-3xl font-black tracking-wider text-foreground leading-none">
          {title}
        </h4>
        {servingLabel && (
          <p className="text-[11px] font-medium text-muted-foreground">
            {servingLabel}
          </p>
        )}
      </div>

      {/* Signature Divider Bar — Fina y elegante */}
      <div className="h-0.5 bg-foreground/70 w-full mt-2.5 mb-2 rounded-full" />

      {/* Indicador de Calidad Nutricional (Widget estilo 3 niveles sin juicios morales) */}
      {qualityLabel && qualityTier && (
        <div className="flex items-center justify-between py-2.5 px-3 rounded-2xl bg-secondary/30 border border-border/40 my-2.5">
          <div className="space-y-0.5">
            <span className="text-sm font-bold text-foreground block leading-tight">
              {qualityLabel}
            </span>
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
              Calidad Nutricional
            </span>
          </div>
          {/* Barra segmentada de 3 niveles */}
          <div
            className="flex items-center gap-1.5"
            aria-label={`Calidad ${qualityLabel} (${qualityTier} de 3)`}
          >
            <span
              className={cn(
                "h-1.5 w-6 rounded-full transition-colors",
                qualityTier >= 1
                  ? qualityTier === 1
                    ? "bg-amber-500"
                    : qualityTier === 2
                      ? "bg-sky-500"
                      : "bg-emerald-500"
                  : "bg-muted-foreground/20",
              )}
            />
            <span
              className={cn(
                "h-1.5 w-6 rounded-full transition-colors",
                qualityTier >= 2
                  ? qualityTier === 2
                    ? "bg-sky-500"
                    : "bg-emerald-500"
                  : "bg-muted-foreground/20",
              )}
            />
            <span
              className={cn(
                "h-1.5 w-6 rounded-full transition-colors",
                qualityTier >= 3 ? "bg-emerald-500" : "bg-muted-foreground/20",
              )}
            />
          </div>
        </div>
      )}

      {/* 7 Nutrient Rows (Sin checks: texto limpio y cápsula elegante) */}
      <div className="divide-y divide-border/30 text-xs">
        {rows.map((row) => (
          <div
            key={row.category}
            className="flex items-center justify-between gap-3 py-1.5 first:pt-1 last:pb-1"
          >
            <span className="font-medium text-foreground text-xs sm:text-[12.5px] shrink-0">
              {row.label}
            </span>
            <span className="font-medium text-foreground/85 text-right text-xs leading-tight px-2.5 py-0.5 rounded-full bg-secondary/40 border border-border/40">
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {/* Desplegable de sugerencia de combinación bajo demanda */}
      {combinationInsight && (
        <div className="pt-2.5 border-t border-border/30 mt-2">
          {isInsightOpen ? (
            <div className="p-3.5 rounded-2xl bg-secondary/30 border border-border/40 space-y-1.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                  Sinergia sugerida
                </span>
                <button
                  type="button"
                  onClick={() => setIsInsightOpen(false)}
                  className="text-[10.5px] font-medium text-muted-foreground hover:text-foreground transition cursor-pointer"
                >
                  Ocultar
                </button>
              </div>
              <p className="text-xs text-foreground/90 leading-relaxed font-normal">
                {combinationInsight}
              </p>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsInsightOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-secondary/20 hover:bg-secondary/40 border border-border/30 text-xs font-medium text-foreground transition-all cursor-pointer"
            >
              <span>Ver sugerencia de combinación</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          )}
        </div>
      )}

      {/* Footnote / Disclaimer */}
      {showDisclaimer && (
        <p className="text-[10px] text-muted-foreground/70 leading-relaxed font-normal pt-2 mt-2 border-t border-border/30">
          * La identificación visual por IA puede ser aproximada. Revisa siempre los detalles nutricionales importantes.
        </p>
      )}
    </div>
  );
}

export default NutritionFactsTable;
