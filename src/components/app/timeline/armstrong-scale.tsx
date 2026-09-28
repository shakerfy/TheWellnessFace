import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Droplet, Sparkles, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { ARMSTRONG_LEVELS } from "../app-utils";

export interface ArmstrongUrineScaleVisualProps {
  selectedLevel: number;
  onSelectLevel?: (level: number) => void;
  readOnly?: boolean;
  className?: string;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  hideAdvice?: boolean;
}

export function ArmstrongUrineScaleVisual({
  selectedLevel,
  onSelectLevel,
  readOnly = false,
  className,
  title = "Hydration Check",
  subtitle,
  actions,
  hideAdvice = false,
}: ArmstrongUrineScaleVisualProps) {
  const currentObj = ARMSTRONG_LEVELS.find((l) => l.level === selectedLevel) || ARMSTRONG_LEVELS[1];
  const displayTitle = (title || "Registro de Hidratación")
    .replace(/\s*\(Armstrong\)/gi, "")
    .trim();
  const displaySubtitle = (subtitle || currentObj.title)
    .replace(/\s*\(Hidratación Saludable\)/gi, "")
    .replace(/\s*\(Armstrong\)/gi, "")
    .trim();

  return (
    <div className={cn("space-y-5 text-left w-full", className)}>
      {/* Header section with flex alignment */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-0.5 text-left">
          <h3 className="text-lg font-bold text-foreground tracking-tight">{displayTitle}</h3>
          <p className="text-xs text-muted-foreground font-medium">{displaySubtitle}</p>
        </div>
        {actions}
      </div>

      {/* 8 Color Scale Bar */}
      <div className="space-y-2 pt-1">
        <div className="flex justify-between gap-1.5 h-16 w-full rounded-2xl bg-secondary/50 dark:bg-black/40 p-1.5 border border-border/40">
          {ARMSTRONG_LEVELS.map((item) => {
            const isSelected = selectedLevel === item.level;
            return (
              <button
                key={item.level}
                type="button"
                disabled={readOnly}
                onClick={() => onSelectLevel?.(item.level)}
                style={{ backgroundColor: item.hex }}
                className={cn(
                  "flex-1 h-full rounded-xl transition-all duration-200 relative cursor-pointer border border-black/10 focus:outline-none",
                  isSelected
                    ? "scale-110 shadow-lg ring-2 ring-foreground z-10 opacity-100"
                    : readOnly
                      ? "opacity-75"
                      : "opacity-80 hover:opacity-100 hover:scale-105",
                )}
                title={`${item.title} — ${item.state}`}
              >
                {/* Active indicator dot at the bottom */}
                {isSelected && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-foreground rounded-full shadow-xs" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footnote Labels under the scale */}
        <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/80 px-1 pt-1">
          <span className="text-emerald-600 dark:text-emerald-400">OPTIMAL</span>
          <span className="text-amber-600 dark:text-amber-400">DEHYDRATED</span>
        </div>
      </div>

      {/* AI Feedback Section with generous top padding */}
      {!hideAdvice && (
        <div className="pt-5 mt-2 border-t border-border/70 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed font-medium">
            {currentObj.advice}
          </p>
        </div>
      )}
    </div>
  );
}

export interface HydrationArmstrongDrawerProps {
  open?: boolean;
  onClose: () => void;
  onSave: (level: number, label: string, feedback: string) => void;
}

export function HydrationArmstrongDrawer({ open = true, onClose, onSave }: HydrationArmstrongDrawerProps) {
  const isMobile = useIsMobile();
  const [selectedLevel, setSelectedLevel] = useState<number>(2);
  const currentLevelObj =
    ARMSTRONG_LEVELS.find((l) => l.level === selectedLevel) || ARMSTRONG_LEVELS[1];

  const handleConfirm = () => {
    onSave(
      currentLevelObj.level,
      currentLevelObj.title,
      currentLevelObj.advice,
    );
    onClose();
  };

  const bodyContent = (
    <div className="py-2 space-y-4 text-left">
      <ArmstrongUrineScaleVisual
        selectedLevel={selectedLevel}
        onSelectLevel={(lvl) => setSelectedLevel(lvl)}
        readOnly={false}
        title="Hydration Check"
        subtitle="Toca la cápsula de color para seleccionar tu nivel"
      />

      {/* Riboflavin warning note & Disclaimer */}
      <div className="p-3.5 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-[11px] text-muted-foreground leading-relaxed space-y-1.5 text-left">
        <p>
          💡 <strong>Nota fisiológica:</strong> Suplementos de Vitamina B2 (Riboflavina) o multivitamínicos pueden pigmentar la orina de amarillo intenso sin implicar deshidratación.
        </p>
        <p className="text-[10px] text-muted-foreground/70">
          * Guía orientativa de bienestar basada en Armstrong (ACSM). No constituye prescripción médica ni sustituye la consulta médica.
        </p>
      </div>
    </div>
  );

  const footerButtons = (
    <>
      <Button
        variant="outline"
        type="button"
        onClick={onClose}
        className="flex-1 sm:flex-none rounded-xl font-semibold cursor-pointer"
      >
        Cancelar
      </Button>
      <Button
        type="button"
        onClick={handleConfirm}
        className="flex-1 sm:flex-none rounded-xl font-bold bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer shadow-xs"
      >
        Registrar Estado Hídrico
      </Button>
    </>
  );

  // Versión de Escritorio (>= 768px): Modal centrado (Dialog)
  if (!isMobile) {
    return (
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent className="sm:max-w-lg rounded-3xl p-6 sm:p-7 border border-border bg-card shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar text-left">
          <DialogHeader className="pb-2 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplet className="w-5 h-5 text-cyan-500 shrink-0" />
                <DialogTitle className="text-lg font-bold text-foreground">
                  Registro de Hidratación
                </DialogTitle>
              </div>
              <Link
                to="/blog/$slug"
                params={{ slug: "escala-de-armstrong-y-fisiologia-de-la-hidratacion" }}
                className="text-[11px] font-semibold text-emerald-500 hover:underline flex items-center gap-1 shrink-0"
              >
                <span>Escala Armstrong</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <DialogDescription className="text-xs text-muted-foreground pt-1 text-left">
              Selecciona el nivel colorimétrico de osmolalidad urinaria (Dr. Lawrence Armstrong, ACSM).
            </DialogDescription>
          </DialogHeader>

          {bodyContent}

          <DialogFooter className="px-0 pt-2 pb-0 flex flex-row items-center justify-end gap-2.5">
            {footerButtons}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Versión Móvil (< 768px): Hoja deslizable (Drawer / Bottom Sheet)
  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DrawerContent className="px-6 pb-8 pt-2 max-w-lg mx-auto overflow-hidden">
        <DrawerHeader className="pb-3 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplet className="w-5 h-5 text-cyan-500 shrink-0" />
              <DrawerTitle className="text-lg font-bold text-foreground">
                Registro de Hidratación
              </DrawerTitle>
            </div>
            <Link
              to="/blog/$slug"
              params={{ slug: "escala-de-armstrong-y-fisiologia-de-la-hidratacion" }}
              className="text-[11px] font-semibold text-emerald-500 hover:underline flex items-center gap-1 shrink-0"
            >
              <span>Escala Armstrong</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <DrawerDescription className="text-xs text-muted-foreground pt-1 text-left">
            Selecciona el nivel colorimétrico de osmolalidad urinaria (Dr. Lawrence Armstrong, ACSM).
          </DrawerDescription>
        </DrawerHeader>

        {bodyContent}

        <DrawerFooter className="px-0 pt-3 pb-0 flex flex-row items-center justify-end gap-2.5">
          {footerButtons}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
