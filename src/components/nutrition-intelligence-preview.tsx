import { useState, useEffect } from "react";
import { Camera, Sparkles, Zap, Dumbbell, CheckCircle2, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const SAMPLE_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80";

export function NutritionIntelligencePreview() {
  const [activeStep, setActiveStep] = useState<"scan" | "result">("result");

  // Subtle auto-toggle every 4s if user hasn't interacted
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev === "scan" ? "result" : "scan"));
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* Mobile Step Selector Pills */}
      <div className="flex sm:hidden items-center justify-center p-1 rounded-2xl bg-secondary/60 border border-border/60 mx-auto w-fit gap-1">
        <button
          type="button"
          onClick={() => setActiveStep("scan")}
          className={cn(
            "px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
            activeStep === "scan"
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>1. Foto rápida</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveStep("result")}
          className={cn(
            "px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
            activeStep === "result"
              ? "bg-foreground text-background shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>2. Análisis Somático</span>
        </button>
      </div>

      {/* Main Visual Composition (Responsive: side-by-side on sm+, toggleable/stacked on mobile) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch relative">
        {/* PANEL 1: CÁMARA / ESCÁNER */}
        <div
          className={cn(
            "rounded-3xl border border-border/80 bg-card overflow-hidden shadow-md flex flex-col justify-between transition-all duration-300 relative group",
            activeStep === "scan" ? "block" : "hidden sm:flex"
          )}
        >
          {/* Header of Viewfinder */}
          <div className="p-3.5 flex items-center justify-between border-b border-border/40 bg-secondary/30">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Visor en vivo
              </span>
            </div>
            <Badge
              variant="outline"
              className="text-[9px] font-black uppercase tracking-wider text-muted-foreground bg-background/60 py-0 px-1.5 rounded-full"
            >
              1 Toque
            </Badge>
          </div>

          {/* Meal Photo with Scanner Viewfinder Overlays */}
          <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-black/5">
            <img
              src={SAMPLE_IMAGE}
              alt="Plato siendo escaneado"
              className="w-full h-full object-cover select-none"
              loading="lazy"
            />
            {/* Viewfinder Corners */}
            <div className="absolute inset-4 pointer-events-none flex flex-col justify-between">
              <div className="flex justify-between">
                <div className="w-5 h-5 border-t-2 border-l-2 border-white/90 rounded-tl-lg shadow-xs" />
                <div className="w-5 h-5 border-t-2 border-r-2 border-white/90 rounded-tr-lg shadow-xs" />
              </div>
              <div className="flex justify-between">
                <div className="w-5 h-5 border-b-2 border-l-2 border-white/90 rounded-bl-lg shadow-xs" />
                <div className="w-5 h-5 border-b-2 border-r-2 border-white/90 rounded-br-lg shadow-xs" />
              </div>
            </div>

            {/* Target Reticle / Pulse Center */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-12 h-12 rounded-full border border-white/40 bg-white/10 backdrop-blur-xs flex items-center justify-center animate-ping duration-1000 opacity-30" />
            </div>

            {/* Bottom Floating Pill */}
            <div className="absolute bottom-3 inset-x-3 flex justify-center pointer-events-none">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium shadow-md flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-white/80" />
                Enfocá tu plato
              </span>
            </div>
          </div>

          {/* Footer note */}
          <div className="p-3 bg-secondary/20 text-center border-t border-border/40">
            <p className="text-[11px] text-muted-foreground font-medium">
              Sin tipear gramos ni buscar en listas eternas.
            </p>
          </div>
        </div>

        {/* CONNECTOR ARROW (Desktop only) */}
        <div className="hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-foreground text-background items-center justify-center shadow-xl border-2 border-background pointer-events-none">
          <ArrowRight className="w-4 h-4" />
        </div>

        {/* PANEL 2: RESULTADO DE LA IA (CAL AI VIBES PERO CON BIENESTAR SOMÁTICO) */}
        <div
          className={cn(
            "rounded-3xl border border-emerald-500/30 bg-card overflow-hidden shadow-lg flex flex-col justify-between transition-all duration-300 relative",
            activeStep === "result" ? "block" : "hidden sm:flex"
          )}
        >
          {/* Header of AI Analysis */}
          <div className="p-3.5 flex items-center justify-between border-b border-border/40 bg-emerald-500/5">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                Lectura Instantánea
              </span>
            </div>
            <Badge
              variant="outline"
              className="text-[9px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20 py-0 px-1.5 rounded-full"
            >
              PRO
            </Badge>
          </div>

          {/* Meal Photo with Floating Cal-AI Style Tooltips (Somatic, zero calories) */}
          <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-black/5">
            <img
              src={SAMPLE_IMAGE}
              alt="Plato analizado"
              className="w-full h-full object-cover select-none filter contrast-[1.03]"
              loading="lazy"
            />

            {/* Floating Tag 1: Salmón */}
            <div className="absolute top-4 left-3 animate-in fade-in zoom-in-95 duration-500">
              <div className="px-2.5 py-1 rounded-xl bg-background/90 backdrop-blur-md border border-border/80 shadow-md text-left">
                <span className="text-[10px] font-bold text-foreground block leading-tight">
                  Salmón grillado
                </span>
                <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400">
                  Proteína & Omega-3
                </span>
              </div>
            </div>

            {/* Floating Tag 2: Palta */}
            <div className="absolute top-12 right-3 animate-in fade-in zoom-in-95 duration-700">
              <div className="px-2.5 py-1 rounded-xl bg-background/90 backdrop-blur-md border border-border/80 shadow-md text-left">
                <span className="text-[10px] font-bold text-foreground block leading-tight">
                  Palta fresca
                </span>
                <span className="text-[9px] font-semibold text-sky-600 dark:text-sky-400">
                  Grasa saciante
                </span>
              </div>
            </div>

            {/* Floating Tag 3: Hojas verdes & semillas */}
            <div className="absolute bottom-3 left-3 animate-in fade-in zoom-in-95 duration-900">
              <div className="px-2.5 py-1 rounded-xl bg-background/90 backdrop-blur-md border border-border/80 shadow-md text-left">
                <span className="text-[10px] font-bold text-foreground block leading-tight">
                  Semillas & Verdes
                </span>
                <span className="text-[9px] font-semibold text-amber-600 dark:text-amber-400">
                  Fibra & Polifenoles
                </span>
              </div>
            </div>
          </div>

          {/* Somatic Context Card (The Real Wellness Difference) */}
          <div className="p-3.5 space-y-2 text-left bg-card">
            {/* Title + Quality Badge */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-foreground truncate">
                Bowl de Salmón & Hojas Vivas
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full shrink-0">
                Valor Alto
              </span>
            </div>

            {/* Timing Fit Badge (Synchronized with Gym) */}
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-secondary/50 border border-border/60">
              <Dumbbell className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <p className="text-[11px] font-semibold text-foreground leading-snug">
                Ideal Post-Entreno • Recarga de glucógeno y recuperación
              </p>
            </div>

            {/* Micro-Insight de 1 Toque */}
            <div className="flex items-start gap-1.5 px-2 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-900 dark:text-amber-200">
              <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span className="leading-tight">
                <strong>Sinergia activa:</strong> Las grasas buenas potencian la absorción de carotenoides.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Helper Prompt */}
      <div className="flex items-center justify-center gap-2 text-center text-[11px] font-medium text-muted-foreground">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
        <span>El 100% del análisis ocurre en 3 segundos al sacar la foto.</span>
      </div>
    </div>
  );
}
