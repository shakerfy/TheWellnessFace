import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  X,
  Camera,
  BarChart3,
  Scale,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { NutritionCalibrationView } from "@/components/nutrition-calibration-view";

export const Route = createFileRoute("/nutrition-intelligence")({
  component: NutritionIntelligencePage,
});

export function NutritionIntelligencePage() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<"annual" | "monthly">("annual");

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
    const planName = selectedPlan === "annual" ? "Plan Anual (12 Meses)" : "Plan Mensual";
    toast.success(`Activando suscripción para ${planName}. ¡Bienvenido a Nutrition Intelligence!`);
    setIsActive(true);
    setIsCalibrating(true);
  };

  const handleRestore = () => {
    toast.info("Buscando suscripciones activas vinculadas a tu cuenta...");
    setTimeout(() => {
      toast.error("No se encontraron suscripciones activas previas.");
    }, 1500);
  };

  const tools = [
    {
      id: "food-scan",
      title: "AI Food Scan",
      desc: "Foto instantánea, macros y calidad biológica sin balanzas digitales.",
      icon: Camera,
      iconColor: "text-emerald-500",
      iconBg: "bg-emerald-500/10",
    },
    {
      id: "weekly-analysis",
      title: "Nutrition Analysis",
      desc: "Reporte semanal de consistencia proteica, fibra y diversidad de plato.",
      icon: BarChart3,
      iconColor: "text-sky-500",
      iconBg: "bg-sky-500/10",
    },
    {
      id: "weight-evolution",
      title: "Evolución de Peso & Constancia",
      desc: "Media móvil semanal y seguimiento de constancia con metas personalizadas.",
      icon: Scale,
      iconColor: "text-violet-500",
      iconBg: "bg-violet-500/10",
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
      {/* Top Bar / Navigation (Freeletics style: X button + Logo + Restore) */}
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

      {/* Main Content (Freeletics style: high focus, clean typography, centered) */}
      <main className="w-full max-w-xl mx-auto px-5 py-6 sm:py-8 flex-1 flex flex-col justify-center space-y-6">
        {/* Hero Section */}
        <div className="text-center space-y-2">
          <Badge
            variant="outline"
            className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/90 border-border/80 bg-secondary/30 px-3 py-0.5 rounded-full"
          >
            Suite Premium
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Nutrition Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Tu coach inteligente con IA. Conecta tu alimentación real, tus clases en el Studio y la evolución de tu cuerpo.
          </p>
        </div>

        {/* Active PRO Member Banner */}
        {isActive && (
          <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-left flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-foreground block">
                Tu membresía a Nutrition Intelligence está activa
              </span>
              <p className="text-[11px] text-muted-foreground">
                Puedes volver a calibrar tu modo y tus metas de macronutrientes en cualquier momento.
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={() => setIsCalibrating(true)}
              className="rounded-xl text-xs font-bold shrink-0 cursor-pointer h-8"
            >
              Recalibrar
            </Button>
          </div>
        )}

        {/* 4 Tools: Freeletics Benefit List */}
        <div className="space-y-2.5">
          {tools.map((tool) => {
            const IconComp = tool.icon;
            return (
              <div
                key={tool.id}
                className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-border bg-card shadow-2xs hover:border-foreground/20 transition-all"
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                    tool.iconBg,
                    tool.iconColor
                  )}
                >
                  <IconComp className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-xs sm:text-sm font-bold text-foreground leading-snug">
                    {tool.title}
                  </div>
                  <div className="text-[11px] sm:text-xs text-muted-foreground truncate leading-normal">
                    {tool.desc}
                  </div>
                </div>
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              </div>
            );
          })}
        </div>

        {/* Freeletics Plan Selector Cards */}
        <div className="space-y-3 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Annual Plan */}
            <Card
              onClick={() => setSelectedPlan("annual")}
              className={cn(
                "relative rounded-2xl border p-4 cursor-pointer transition-all duration-200 text-left flex flex-col justify-between",
                selectedPlan === "annual"
                  ? "border-foreground bg-secondary/40 shadow-sm ring-1 ring-foreground"
                  : "border-border bg-card/60 hover:border-foreground/30"
              )}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                    12 Meses
                  </span>
                  <Badge className="text-[9px] font-black uppercase tracking-wider bg-foreground text-background px-2 py-0.5 rounded-full border-none">
                    Ahorra 40%
                  </Badge>
                </div>

                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-black text-foreground">
                      $6.990
                    </span>
                    <span className="text-[11px] font-medium text-muted-foreground">
                      / mes
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Facturado anualmente ($83.880/año)
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-border/50 flex items-center justify-between text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <span>7 días gratis</span>
                <div
                  className={cn(
                    "w-4 h-4 rounded-full border flex items-center justify-center",
                    selectedPlan === "annual"
                      ? "border-foreground bg-foreground text-background"
                      : "border-muted-foreground/40"
                  )}
                >
                  {selectedPlan === "annual" && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
              </div>
            </Card>

            {/* Monthly Plan */}
            <Card
              onClick={() => setSelectedPlan("monthly")}
              className={cn(
                "relative rounded-2xl border p-4 cursor-pointer transition-all duration-200 text-left flex flex-col justify-between",
                selectedPlan === "monthly"
                  ? "border-foreground bg-secondary/40 shadow-sm ring-1 ring-foreground"
                  : "border-border bg-card/60 hover:border-foreground/30"
              )}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                    1 Mes
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground">
                    Flexible
                  </span>
                </div>

                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-black text-foreground">
                      $9.900
                    </span>
                    <span className="text-[11px] font-medium text-muted-foreground">
                      / mes
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Facturación mensual recurrente
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-border/50 flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
                <span>Sin permanencia</span>
                <div
                  className={cn(
                    "w-4 h-4 rounded-full border flex items-center justify-center",
                    selectedPlan === "monthly"
                      ? "border-foreground bg-foreground text-background"
                      : "border-muted-foreground/40"
                  )}
                >
                  {selectedPlan === "monthly" && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Master Action CTA Button */}
        <div className="space-y-2.5 pt-2">
          <Button
            type="button"
            onClick={handleStartTrial}
            className="w-full h-12 sm:h-13 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider bg-foreground text-background hover:bg-foreground/90 transition-all cursor-pointer shadow-md"
          >
            {selectedPlan === "annual"
              ? "Comenzar 7 días gratis"
              : "Comenzar suscripción mensual"}
          </Button>

          <p className="text-center text-[11px] text-muted-foreground font-medium">
            {selectedPlan === "annual"
              ? "Prueba 100% gratuita. Cancela en 1 toque antes del día 7 sin cobro."
              : "Cancela en 1 toque en cualquier momento desde tu perfil."}
          </p>
        </div>

        {/* Reassurance & Legal Disclaimer */}
        <div className="pt-2 text-center space-y-2">
          <div className="flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
            <span>✓ Cancela cuando quieras</span>
            <span>•</span>
            <span>✓ Sin cargos ocultos</span>
            <span>•</span>
            <span>✓ Acceso inmediato</span>
          </div>

          <p className="text-[10px] text-muted-foreground/60 leading-relaxed max-w-sm mx-auto">
            Herramienta pedagógica de bienestar y hábitos. No constituye diagnóstico médico ni prescripción clínica.
          </p>
        </div>
      </main>
    </div>
  );
}

export default NutritionIntelligencePage;
