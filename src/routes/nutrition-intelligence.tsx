import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  X,
  Camera,
  Sparkles,
  Dumbbell,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { NutritionCalibrationView } from "@/components/nutrition-calibration-view";
import { NutritionIntelligencePreview } from "@/components/nutrition-intelligence-preview";

export const Route = createFileRoute("/nutrition-intelligence")({
  component: NutritionIntelligencePage,
});

export function NutritionIntelligencePage() {
  const navigate = useNavigate();

  const [isCalibrating, setIsCalibrating] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("calibrate") === "true";
    }
    return false;
  });

  const [isActive, setIsActive] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("shakerfy_nutrition_intelligence_active") === "true";
    }
    return false;
  });

  const handleStartTrial = () => {
    localStorage.setItem("shakerfy_nutrition_intelligence_active", "true");
    localStorage.setItem("shakerfy_nutrition_trial_started_at", new Date().toISOString());
    setIsActive(true);
    toast.success("¡Prueba de 7 días activada! Escaneá tu primera comida.");
    navigate({ to: "/scan" });
  };

  const handleRestore = () => {
    toast.info("Buscando suscripciones activas vinculadas a tu cuenta...");
    setTimeout(() => {
      const stored = localStorage.getItem("shakerfy_nutrition_intelligence_active") === "true";
      if (stored) {
        setIsActive(true);
        toast.success("Suscripción restaurada correctamente.");
      } else {
        toast.error("No se encontraron suscripciones activas previas.");
      }
    }, 1200);
  };

  const benefits = [
    {
      id: "scan",
      title: "AI Food Scan Ilimitado",
      desc: "Sacá una foto en cualquier restaurante, oficina o casa y entendé el valor real de tu comida en 3 segundos sin anotar nada.",
      icon: Camera,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-500/10",
    },
    {
      id: "timing",
      title: "Timing Fit con tu Gimnasio y el Sol",
      desc: "La IA sincroniza tu plato con tus clases agendadas y la hora solar: ventana pre-entreno, post-recuperación o corte nocturno.",
      icon: Dumbbell,
      iconColor: "text-emerald-500",
      iconBg: "bg-emerald-500/10",
    },
    {
      id: "insights",
      title: "Micro-Insights y Sinergias del Plato",
      desc: "Hacks biológicos de 1 toque en cada sobremesa: combinaciones de absorción, desmitificación de creencias y saciedad sin culpa.",
      icon: Sparkles,
      iconColor: "text-sky-500",
      iconBg: "bg-sky-500/10",
    },
  ];

  if (isCalibrating) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-primary/20">
        <header className="w-full px-5 py-4 flex items-center justify-between border-b border-border/40 max-w-xl mx-auto">
          <button
            type="button"
            onClick={() => setIsCalibrating(false)}
            className="w-9 h-9 rounded-full bg-secondary/60 hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
          <span className="font-bebas text-lg tracking-widest text-foreground">
            THE WELLNESS FACE
          </span>
          <div className="w-9" />
        </header>

        <main className="w-full max-w-xl mx-auto px-5 py-6 sm:py-8 flex-1">
          <NutritionCalibrationView
            onComplete={() => {
              navigate({ to: "/app", search: { tab: "diario" } });
            }}
            onCancel={() => setIsCalibrating(false)}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-primary/20">
      {/* Top Bar / Navigation */}
      <header className="w-full px-5 py-4 flex items-center justify-between border-b border-border/40 max-w-xl mx-auto">
        <button
          type="button"
          onClick={() => navigate({ to: "/app", search: { tab: "diario" } })}
          className="w-9 h-9 rounded-full bg-secondary/60 hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          aria-label="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>

        <span className="font-bebas text-lg tracking-widest text-foreground">
          THE WELLNESS FACE
        </span>

        <button
          type="button"
          onClick={handleRestore}
          className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          Restaurar
        </button>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-xl mx-auto px-5 py-6 sm:py-8 flex-1 flex flex-col justify-center space-y-7">
        {/* Header / Kicker + Title + Subtitle */}
        <div className="text-center space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
            NUTRITION INTELLIGENCE PRO
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Tu plato sincronizado con tu cuerpo.
          </h1>
          <div className="space-y-1 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
            <p className="font-semibold text-foreground/90">
              Cero pesajes. Cero calorías. Cero reportes que te juzguen.
            </p>
            <p>
              Claridad biológica instantánea en cada comida, conectada con tu entrenamiento diario.
            </p>
          </div>
        </div>

        {/* Visual Demonstration: Cal AI style before/after */}
        <NutritionIntelligencePreview />

        {/* Active Member Banner */}
        {isActive && (
          <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-left flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-foreground block">
                Tu membresía a Nutrition Intelligence está activa
              </span>
              <p className="text-[11px] text-muted-foreground">
                Tenés acceso ilimitado al escáner y análisis en tiempo real.
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={() => navigate({ to: "/app", search: { tab: "diario" } })}
              className="rounded-xl text-xs font-bold shrink-0 cursor-pointer h-8"
            >
              Ir al diario
            </Button>
          </div>
        )}

        {/* 3 Beneficios Principales */}
        <div className="space-y-3">
          {benefits.map((benefit) => {
            const IconComp = benefit.icon;
            return (
              <div
                key={benefit.id}
                className="flex items-start sm:items-center gap-3.5 p-4 rounded-3xl border border-border bg-card shadow-2xs hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-md transition-all duration-300 text-left"
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0",
                    benefit.iconBg,
                    benefit.iconColor
                  )}
                >
                  <IconComp className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-foreground leading-snug">
                    {benefit.title}
                  </div>
                  <div className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                    {benefit.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Anti-Diet Peace of Mind Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 py-1 text-[11px] font-semibold text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/60 border border-border/60">
            <Check className="w-3.5 h-3.5 text-emerald-500" />
            Sin pesar comida
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/60 border border-border/60">
            <Check className="w-3.5 h-3.5 text-emerald-500" />
            Sin contar calorías
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/60 border border-border/60">
            <Check className="w-3.5 h-3.5 text-emerald-500" />
            Sin deberes ni reportes
          </span>
        </div>

        {/* Pricing & CTA Section */}
        <div className="space-y-3 pt-1">
          {/* Pricing Callout */}
          <div className="rounded-3xl border border-border/80 bg-card p-4.5 text-center space-y-1 shadow-xs">
            <div className="text-base sm:text-lg font-bold text-foreground">
              7 días de prueba completa sin cargo
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground font-medium">
              Luego AR$ 9.900 / mes • Cancelás con un toque cuando quieras
            </div>
          </div>

          {/* Primary CTA Button */}
          <Button
            type="button"
            onClick={handleStartTrial}
            className="w-full h-12 sm:h-13 rounded-2xl text-sm font-bold uppercase tracking-wider bg-foreground text-background hover:bg-foreground/90 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer shadow-md"
          >
            Comenzar 7 días gratis
          </Button>

          {/* Subtext */}
          <p className="text-center text-xs text-muted-foreground font-medium">
            Activación instantánea. Escaneá tu próxima comida hoy mismo.
          </p>
        </div>
      </main>

      {/* Footer / Legal minimal */}
      <footer className="w-full max-w-xl mx-auto px-5 py-4 text-center">
        <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
          Herramienta pedagógica de bienestar y hábitos. No constituye diagnóstico médico ni prescripción clínica.
        </p>
      </footer>
    </div>
  );
}

export default NutritionIntelligencePage;
