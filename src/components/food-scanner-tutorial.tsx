import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronLeft } from "lucide-react";

export interface FoodScannerTutorialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TUTORIAL_SLIDES = [
  {
    step: 1,
    tag: "CONSEJOS DE PRECISIÓN",
    title: "Muestra cada ingrediente",
    subtitle:
      "Evita tapar o comprimir los alimentos. La IA analiza con mayor precisión cuando los componentes están visibles de perfil.",
    image: "/scanner-tips/card-ingredients.png",
    alt: "Comparación de encuadre mostrando ingredientes visibles de lado vs vista superior",
  },
  {
    step: 2,
    tag: "CONSEJOS DE PRECISIÓN",
    title: "Evita tomas cenitales",
    subtitle:
      "Una toma inclinada a 45° captura con exactitud el volumen, la profundidad y la altura de las porciones servidas.",
    image: "/scanner-tips/card-angles.png",
    alt: "Comparación de ángulo inclinado a 45 grados vs toma plana desde arriba",
  },
  {
    step: 3,
    tag: "CONSEJOS DE PRECISIÓN",
    title: "Captura la comida completa",
    subtitle:
      "Incluye guarniciones, panes y bebidas dentro del encuadre para un análisis nutricional y balance hídrico integral.",
    image: "/scanner-tips/card-fullmeal.png",
    alt: "Comparación de plato completo con bebida y pan vs plato recortado",
  },
];

export const STORAGE_KEY_TUTORIAL_SEEN = "shakerfy_scanner_tutorial_seen";

export function FoodScannerTutorialDialog({
  open,
  onOpenChange,
}: FoodScannerTutorialDialogProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Reset to first slide whenever dialog opens
  useEffect(() => {
    if (open) {
      setCurrentStep(0);
    }
  }, [open]);

  // Keyboard navigation (Arrow keys)
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, currentStep]);

  const triggerHaptic = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(12);
      } catch (_) {}
    }
  };

  const handleNext = () => {
    triggerHaptic();
    if (currentStep < TUTORIAL_SLIDES.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    triggerHaptic();
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    try {
      localStorage.setItem(STORAGE_KEY_TUTORIAL_SEEN, "true");
    } catch (_) {}
    onOpenChange(false);
  };

  const handleDialogChange = (isOpen: boolean) => {
    if (!isOpen) {
      handleComplete();
    } else {
      onOpenChange(true);
    }
  };

  // Touch gesture handling (Rule 10: Swipe-to-navigate)
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    // Swipe left -> Next slide
    if (diff > 45) {
      handleNext();
    }
    // Swipe right -> Prev slide
    else if (diff < -45) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const activeSlide = TUTORIAL_SLIDES[currentStep];

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent
        className="w-[92vw] max-w-sm sm:max-w-md p-4 sm:p-5 border border-border bg-card rounded-3xl shadow-2xl select-none max-h-[88dvh] overflow-hidden flex flex-col justify-between gap-2.5"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Top Progress Segmented Pills (Centered, exactly 1 close button from Radix at right-4 top-4) */}
        <div className="pt-1 px-8 pb-0.5 flex items-center justify-center">
          <div className="flex items-center gap-1.5 w-28 sm:w-32">
            {TUTORIAL_SLIDES.map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  "h-1 flex-1 rounded-full transition-all duration-300",
                  idx === currentStep
                    ? "bg-foreground"
                    : idx < currentStep
                    ? "bg-foreground/40"
                    : "bg-secondary"
                )}
              />
            ))}
          </div>
        </div>

        {/* Slide Content Header: perfectly centered */}
        <DialogHeader className="px-2 pt-0 pb-0 text-center flex flex-col items-center justify-center space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block text-center">
            {activeSlide.tag}
          </span>
          <DialogTitle className="text-base sm:text-lg font-bold tracking-tight text-foreground text-center">
            {activeSlide.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground text-center leading-relaxed max-w-[280px] mx-auto">
            {activeSlide.subtitle}
          </DialogDescription>
        </DialogHeader>

        {/* Slide Visual Comparison Card: prominent, high-res & clear */}
        <div className="py-1 flex items-center justify-center">
          <div className="h-64 sm:h-80 max-h-[48vh] aspect-[394/517] rounded-2xl overflow-hidden border border-border bg-secondary/30 p-1 shadow-xs relative flex items-center justify-center">
            <img
              src={activeSlide.image}
              alt={activeSlide.alt}
              className="w-full h-full object-contain rounded-xl select-none pointer-events-none"
              loading="eager"
            />
          </div>
        </div>

        {/* Action Controls Footer: single horizontal row with buttons side-by-side */}
        <div className="pt-2 border-t border-border/40 flex items-center gap-2">
          {currentStep === 0 ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleComplete}
              className="flex-1 h-11 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground border-border/60 hover:bg-secondary transition cursor-pointer"
            >
              Omitir
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={handlePrev}
              className="flex-1 h-11 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground border-border/60 hover:bg-secondary transition cursor-pointer flex items-center justify-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Atrás</span>
            </Button>
          )}

          <Button
            type="button"
            onClick={handleNext}
            className="flex-[1.4] h-11 rounded-xl font-bold text-xs uppercase tracking-wider bg-foreground text-background hover:bg-foreground/90 shadow-xs transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>
              {currentStep === TUTORIAL_SLIDES.length - 1
                ? "Entendido, comenzar"
                : "Siguiente"}
            </span>
            {currentStep < TUTORIAL_SLIDES.length - 1 && (
              <ChevronRight className="w-4 h-4" />
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
