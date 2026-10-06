import React from "react";
import { ChevronLeft, MoreHorizontal, Bookmark, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { FoodProfileHero, FoodProfileDial } from "@/components/food-profile-hero";
import { ScanNutrientList } from "./scan-nutrient-list";
import { cn } from "@/lib/utils";
import {
  CAL_AI_SAMPLE_MEALS,
  MealIngredientItem,
  NutritionVectorBadge,
  getDescriptiveMealNarrative,
  getScanQualityProfile,
} from "@/lib/scan-data";
import { detectBiologicalContext } from "@/lib/ai-suggestion-generator";
import { TimelineMealCtas } from "@/components/app/timeline/timeline-meal-ctas";
import { getScanSampleCtas } from "@/lib/scan-sample-ctas";
import { toast } from "sonner";

export interface ScanNutritionReportProps {
  activeImage: string;
  reportTitle: string;
  title: string;
  mealTime: string;
  narrative: string;
  bioScore: number;
  vectorBadges: NutritionVectorBadge[];
  totalProtein: number;
  totalFiber: number;
  totalFat: number;
  totalCarbs: number;
  ingredients: MealIngredientItem[];
  servings: number;
  selectedSampleIndex: number;
  customImage: string | null;
  showOptions: boolean;

  // Callbacks
  onBackToScanner: () => void;
  onToggleOptions: () => void;
  onSelectSample: (index: number) => void;
  onNavigateToFix?: () => void;
  onSaveToDiary: () => void;
}

export function ScanNutritionReport({
  activeImage,
  reportTitle,
  title,
  mealTime,
  narrative,
  bioScore,
  vectorBadges,
  totalProtein,
  totalFiber,
  totalFat,
  totalCarbs,
  ingredients,
  servings,
  selectedSampleIndex,
  customImage,
  showOptions,
  onBackToScanner,
  onToggleOptions,
  onSelectSample,
  onNavigateToFix,
  onSaveToDiary,
}: ScanNutritionReportProps) {
  const quality = getScanQualityProfile({
    score: bioScore,
    mealTitle: reportTitle || title,
    mealNarrative: narrative,
    vectorBadges,
    totalProtein,
    totalFiber,
    totalFat,
    totalCarbs,
  });

  const bioContext = detectBiologicalContext();
  const contextBadge =
    bioContext.type === "pre_workout" || bioContext.type === "post_workout"
      ? { label: bioContext.title, type: bioContext.type }
      : undefined;

  const [expandedCtaId, setExpandedCtaId] = React.useState<string | null>(null);
  const [loggedMicroAction, setLoggedMicroAction] = React.useState<
    { type: string; level?: number } | undefined
  >();

  const currentSample = CAL_AI_SAMPLE_MEALS[selectedSampleIndex];
  const sampleId = customImage ? "custom-scan" : currentSample?.id || "scan-sample";
  const sampleCtas = React.useMemo(() => {
    return getScanSampleCtas({ id: sampleId, title: reportTitle || title });
  }, [sampleId, reportTitle, title]);

  React.useEffect(() => {
    setExpandedCtaId(null);
    setLoggedMicroAction(undefined);
  }, [selectedSampleIndex]);

  const heroBadges =
    vectorBadges && vectorBadges.length > 0
      ? vectorBadges.slice(0, 4).map((vb) => ({
          id: vb.id || vb.category,
          category: vb.category,
          label: vb.badgeText,
        }))
      : [
          { id: "b-1", category: "processing", label: "Mínimamente procesado" },
          {
            id: "b-2",
            category: "protein",
            label: totalProtein >= 25 ? "Alta en proteína" : "Proteína moderada",
          },
          {
            id: "b-3",
            category: "fiber",
            label: totalFiber >= 4 ? "Buena fuente de fibra" : "Aporte de fibra",
          },
          { id: "b-4", category: "sugar", label: "Sin azúcar añadido" },
        ];

  const displayNarrative = getDescriptiveMealNarrative({
    title: reportTitle || title,
    narrative,
    ingredients,
    category: currentSample?.category,
  });

  return (
    <div className="w-full h-full sm:min-h-screen bg-slate-950/95 dark:bg-black/95 flex items-center justify-center p-0 sm:p-4 overflow-y-auto custom-scrollbar animate-in fade-in duration-300 select-none">
      {/* Device Frame Wrapper (Full-screen on Mobile, Sleek Mobile Card on Desktop) */}
      <div className="w-full max-w-md h-full sm:h-auto sm:max-h-[92vh] sm:min-h-[760px] sm:rounded-[40px] overflow-hidden bg-white dark:bg-background shadow-2xl border-0 sm:border sm:border-border flex flex-col justify-between text-foreground relative my-auto">
        {/* Sample Dish Selector (if toggled from top options button) */}
        {showOptions && (
          <div className="absolute top-16 right-4 z-50 bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-3 shadow-2xl space-y-2 animate-in fade-in zoom-in-95 text-left max-w-xs w-[calc(100%-2rem)]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1 block">
              Seleccionar Muestra:
            </span>
            {CAL_AI_SAMPLE_MEALS.map((sample, idx) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => onSelectSample(idx)}
                className={cn(
                  "w-full text-left text-xs font-semibold px-3 py-2 rounded-xl transition cursor-pointer flex items-center justify-between",
                  selectedSampleIndex === idx && !customImage
                    ? "bg-foreground text-background font-bold"
                    : "hover:bg-secondary text-foreground",
                )}
              >
                <span className="truncate">{sample.title}</span>
                <span className="text-[10px] opacity-80 ml-1 shrink-0 font-medium text-muted-foreground">
                  {sample.bioGaugeIndex >= 4
                    ? "Alto"
                    : sample.bioGaugeIndex >= 3
                      ? "Medio"
                      : "Ligero"}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* 1. TOP HERO IMAGE SECTION */}
        <div className="relative h-64 sm:h-76 w-full overflow-hidden bg-muted shrink-0">
          <img
            src={activeImage}
            alt="Foto del plato"
            className="w-full h-full object-cover"
          />

          {/* Top Navigation Row */}
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-4 w-full">
            <button
              type="button"
              onClick={onBackToScanner}
              className="w-9 h-9 rounded-full bg-background/80 backdrop-blur-xl border border-border/60 text-foreground flex items-center justify-center hover:bg-background active:scale-95 transition cursor-pointer shadow-xs"
              aria-label="Volver"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>

            <span className="text-xs font-bold text-foreground px-3.5 py-1.5 rounded-full bg-background/80 backdrop-blur-xl border border-border/60 shadow-xs tracking-wide">
              Perfil Nutricional
            </span>

            <button
              type="button"
              onClick={onToggleOptions}
              className="w-9 h-9 rounded-full bg-background/80 backdrop-blur-xl border border-border/60 text-foreground flex items-center justify-center hover:bg-background active:scale-95 transition cursor-pointer shadow-xs"
              aria-label="Opciones"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. BOTTOM SHEET CARD */}
        <div className="-mt-6 relative z-30 rounded-t-[32px] sm:rounded-t-[36px] shadow-2xl flex-1 w-full px-5 pt-5 pb-4 flex flex-col justify-between text-left overflow-y-auto custom-scrollbar transition-colors duration-150 bg-white dark:bg-background">
          <div className="space-y-4">
            {/* Title & Dial Header Row */}
            <div className="pt-0.5 flex items-center gap-3.5">
              <FoodProfileDial
                qualityLabel={quality.label}
                qualityLevel={quality.level}
                size="md"
              />
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <Bookmark className="w-3.5 h-3.5 text-muted-foreground/80" />
                    <span className="text-[11px] font-mono text-muted-foreground font-medium">
                      {mealTime || "12:46 PM"}
                    </span>
                  </div>
                  {contextBadge && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-secondary/80 text-foreground border border-border/60">
                      <Zap className="w-2.5 h-2.5 text-amber-500 shrink-0" />
                      <span>{contextBadge.label}</span>
                    </span>
                  )}
                </div>

                <div className="flex items-baseline justify-between gap-3">
                  <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-foreground tracking-tight line-clamp-2">
                    {reportTitle || title}
                  </h1>
                </div>
              </div>
            </div>

            {displayNarrative && (
              <p className="text-xs text-slate-500/90 dark:text-muted-foreground leading-relaxed font-normal text-left">
                {displayNarrative}
              </p>
            )}

            {/* ACCORDION DE ANÁLISIS NUTRICIONAL */}
            <Accordion type="single" collapsible className="w-full border-none">
              <AccordionItem value="nutrition-analysis" className="border-none">
                <AccordionTrigger
                  className="py-1.5 px-0 hover:no-underline flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 hover:text-foreground cursor-pointer group"
                >
                  <span>Análisis Nutricional</span>
                </AccordionTrigger>
                <AccordionContent className="pt-1.5 pb-0.5">
                  <ScanNutrientList
                    sampleId={sampleId}
                    title={reportTitle || title}
                    vectorBadges={vectorBadges}
                    ingredients={ingredients}
                    servings={servings}
                    totalProtein={totalProtein}
                    totalFiber={totalFiber}
                    totalFat={totalFat}
                    totalCarbs={totalCarbs}
                    hideHeader={true}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* CTAs Y MINIJUEGO INTERACTIVO DEL ESCÁNER */}
            <div className="space-y-2 pt-1 pb-1 text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                Interacciones y Guías del Plato
              </span>
              <TimelineMealCtas
                variant="accordion"
                item={{
                  id: sampleId,
                  title: reportTitle || title,
                  eatingReason: "rutina",
                }}
                dynamicCtas={sampleCtas}
                expandedCtaId={expandedCtaId}
                onToggleCta={(_itemId, ctaId) =>
                  setExpandedCtaId((prev) => (prev === ctaId ? null : ctaId))
                }
                loggedMicroAction={loggedMicroAction}
                onAddAccompaniment={(_itemId, acc) => {
                  toast.success(`✓ Sumado a este plato: ${acc}`);
                }}
                onCompleteBreathing={() => {
                  setLoggedMicroAction({ type: "vagal_pause" });
                  toast.success(
                    "✓ Pausa completada. Tu sistema parasimpático está activo.",
                  );
                }}
                onLogArmstrongLevel={(_itemId, lvl) => {
                  setLoggedMicroAction({ type: "armstrong", level: lvl });
                  toast.success(`✓ Escala Armstrong: Nivel ${lvl} registrado`);
                }}
              />
            </div>

            {/* INGREDIENTS PREVIEW CAROUSEL/LIST */}
            {ingredients && ingredients.length > 0 && (
              <div className="space-y-2 pt-1 pb-1 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                    Ingredientes ({ingredients.length})
                  </span>
                </div>

                <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1.5 -mx-1 px-1">
                  {ingredients.map((ing) => (
                    <div
                      key={ing.id}
                      className="min-w-[125px] sm:min-w-[135px] p-3 rounded-2xl border flex flex-col justify-between shrink-0 shadow-2xs text-left transition-colors duration-100 bg-slate-50/80 dark:bg-card border-slate-200/60 dark:border-border"
                    >
                      <span className="text-xs font-bold truncate text-slate-800 dark:text-foreground">
                        {ing.name}
                      </span>
                      <div className="flex items-center justify-between text-[10px] pt-2 font-mono tabular-nums text-muted-foreground">
                        <span>{Math.round(ing.grams * servings)}g</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nota sutil de identificación visual (Estilo Apple Visual Intelligence) */}
            <p className="text-[11px] text-muted-foreground/70 leading-relaxed pt-1">
              La identificación visual puede ser aproximada. Revisá siempre los detalles importantes.
            </p>
          </div>

          {/* FIXED BOTTOM ACTION BUTTONS */}
          <div className="sticky bottom-0 z-40 bg-white/95 dark:bg-background/95 backdrop-blur-md -mx-5 px-5 pt-3 pb-1 border-t border-slate-100 dark:border-border flex items-center gap-2.5 mt-4">
            <Button
              type="button"
              onClick={onSaveToDiary}
              className="w-full rounded-full py-4 h-12 font-bold text-xs bg-foreground text-background hover:opacity-90 shadow-md transition cursor-pointer"
            >
              <span>Guardar en Mi Diario</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
