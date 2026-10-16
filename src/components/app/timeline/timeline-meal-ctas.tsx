import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Apple,
  Droplet,
  Wind,
  Moon,
  Sun,
  Activity,
  Shield,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  TypewriterMarkdown,
  getMealCtaMarkdownContent,
  type MealDynamicCta,
} from "../diario-helpers";

export interface TimelineMealCtasProps {
  item: any;
  dynamicCtas: MealDynamicCta[];
  expandedCtaId?: string | string[] | null;
  expandedCtaIds?: string[];
  onToggleCta?: (itemId: string, ctaId: string) => void;
  // Props heredadas para compatibilidad con llamadas existentes (opcionales)
  loggedMicroAction?: { type: string; level?: number };
  onAddAccompaniment?: (itemId: string, accompaniment: string) => void;
  onCompleteBreathing?: (itemId: string) => void;
  onLogArmstrongLevel?: (itemId: string, level: number) => void;
  variant?: "pills" | "accordion";
  className?: string;
}

export function TimelineMealCtas({
  item,
  dynamicCtas,
  expandedCtaId,
  expandedCtaIds: propExpandedCtaIds,
  onToggleCta,
  variant = "pills",
  className,
}: TimelineMealCtasProps) {
  // Convertir props de IDs expandidos a un array normalizado
  const parsePropsToIds = (): string[] => {
    if (Array.isArray(propExpandedCtaIds)) return propExpandedCtaIds;
    if (Array.isArray(expandedCtaId)) return expandedCtaId;
    if (typeof expandedCtaId === "string" && expandedCtaId.length > 0) return [expandedCtaId];
    return [];
  };

  // Estado local para permitir despliegue múltiple simultáneo e instantáneo
  const [localExpandedIds, setLocalExpandedIds] = useState<string[]>(parsePropsToIds);

  // Sincronizar si cambian las props externas
  useEffect(() => {
    const fromProps = parsePropsToIds();
    setLocalExpandedIds(fromProps);
  }, [expandedCtaId, propExpandedCtaIds]);

  if (!dynamicCtas || dynamicCtas.length === 0) return null;

  const isCtaExpanded = (ctaId: string) => localExpandedIds.includes(ctaId);

  const handleToggle = (ctaId: string) => {
    setLocalExpandedIds((prev) =>
      prev.includes(ctaId) ? prev.filter((id) => id !== ctaId) : [...prev, ctaId],
    );
    onToggleCta?.(item.id, ctaId);
  };

  const getCtaIcon = (iconType?: string) => {
    switch (iconType) {
      case "apple":
        return <Apple className="w-3.5 h-3.5 text-foreground/80 shrink-0" />;
      case "droplet":
        return <Droplet className="w-3.5 h-3.5 text-foreground/80 shrink-0" />;
      case "wind":
        return <Wind className="w-3.5 h-3.5 text-foreground/80 shrink-0" />;
      case "moon":
        return <Moon className="w-3.5 h-3.5 text-foreground/80 shrink-0" />;
      case "sun":
        return <Sun className="w-3.5 h-3.5 text-foreground/80 shrink-0" />;
      case "activity":
        return <Activity className="w-3.5 h-3.5 text-foreground/80 shrink-0" />;
      case "shield":
        return <Shield className="w-3.5 h-3.5 text-foreground/80 shrink-0" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-foreground/80 shrink-0" />;
    }
  };

  const getCtaMarkdown = (cta: MealDynamicCta) => {
    return cta.markdown || getMealCtaMarkdownContent(cta.id, item);
  };

  // VARIANTE ACORDEÓN (Usada en el Reporte del Escáner, con soporte de despliegue múltiple)
  if (variant === "accordion") {
    return (
      <Accordion
        type="multiple"
        value={localExpandedIds}
        onValueChange={(vals) => {
          setLocalExpandedIds(vals);
          // Si hubo cambio de elemento puntual, notificar al parent
          const added = vals.find((v) => !localExpandedIds.includes(v));
          const removed = localExpandedIds.find((v) => !vals.includes(v));
          if (added) onToggleCta?.(item.id, added);
          else if (removed) onToggleCta?.(item.id, removed);
        }}
        className={cn(
          "w-full rounded-2xl border border-slate-200/80 dark:border-border/80 bg-slate-50/50 dark:bg-card/40 divide-y divide-slate-200/60 dark:divide-border/40 overflow-hidden shadow-2xs",
          className,
        )}
      >
        {dynamicCtas.map((cta) => {
          const content = getCtaMarkdown(cta);

          return (
            <AccordionItem
              key={cta.id}
              value={cta.id}
              className="border-0 px-3.5 sm:px-4 py-0 transition-colors"
            >
              <AccordionTrigger className="py-2.5 sm:py-3 hover:no-underline cursor-pointer">
                <div className="flex items-center gap-2 min-w-0 pr-2 flex-1 text-left">
                  {getCtaIcon(cta.iconType)}
                  <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-foreground truncate tracking-tight flex-1 min-w-0">
                    {cta.title}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-3.5 pt-1 text-left">
                <TypewriterMarkdown
                  content={content}
                  className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed font-normal"
                />
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    );
  }

  // VARIANTE PÍLDORAS (Usada en el Timeline del Diario)
  // Cada CTA tiene su botón y, si está expandido, su texto respectivo inmediatamente debajo
  return (
    <div className={cn("space-y-2.5 pt-1", className)}>
      {dynamicCtas.map((cta) => {
        const isExpanded = isCtaExpanded(cta.id);

        return (
          <div key={cta.id} className="space-y-2 text-left">
            {/* Botón Píldora del CTA */}
            <div className="flex items-center min-w-0 max-w-full">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggle(cta.id);
                }}
                className={cn(
                  "relative z-10 max-w-full min-w-0 rounded-full px-3.5 py-1.5 text-xs font-semibold inline-flex items-center gap-1.5 border transition-all duration-200 cursor-pointer shadow-2xs hover:-translate-y-0.5",
                  isExpanded
                    ? "bg-secondary text-foreground border-foreground/30 shadow-xs"
                    : "bg-secondary/60 hover:bg-secondary text-foreground/90 border-border/70 hover:border-foreground/30",
                )}
              >
                {getCtaIcon(cta.iconType)}
                <span className="truncate min-w-0">{cta.title}</span>
                <ChevronDown
                  className={cn(
                    "w-3 h-3 text-muted-foreground transition-transform duration-200 shrink-0",
                    isExpanded ? "rotate-180 text-foreground" : "",
                  )}
                />
              </button>
            </div>

            {/* Texto respectivo de este CTA justo debajo de su píldora */}
            {isExpanded && (
              <div className="animate-in fade-in slide-in-from-top-1 duration-200 text-left pt-1">
                <TypewriterMarkdown
                  content={getCtaMarkdown(cta)}
                  className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed font-normal"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
