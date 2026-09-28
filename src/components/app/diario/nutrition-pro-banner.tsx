import { Sparkles, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface NutritionProBannerProps {
  onClick: () => void;
}

export function NutritionProBanner({ onClick }: NutritionProBannerProps) {
  return (
    <div
      onClick={onClick}
      className="rounded-3xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-md transition-all duration-300 cursor-pointer flex items-center justify-between gap-3 text-left group"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-foreground">Nutrition Intelligence</span>
            <Badge
              variant="outline"
              className="text-[9px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20 py-0 px-1.5 rounded-full"
            >
              PRO
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground truncate">
            AI Food Scan, reporte semanal y progreso somático.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1 text-xs font-bold text-muted-foreground group-hover:text-foreground shrink-0 pr-1">
        <span className="hidden sm:inline">Conocer</span>
        <ChevronRight className="w-4 h-4" />
      </div>
    </div>
  );
}
