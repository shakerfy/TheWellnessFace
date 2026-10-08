import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Droplet,
  Wind,
  Sparkles,
  Smartphone,
  Monitor,
  Layers,
  RotateCcw,
  ArrowLeft,
  Check,
  Plus,
  Utensils,
  Moon,
  Clock,
  Compass,
  SlidersHorizontal,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  InlineArmstrongGuideWidget,
  InlineBreathingGuideWidget,
  TypewriterMarkdown,
  getMealCtaMarkdownContent,
} from "../diario-helpers";
import { TimelineMealCtas } from "../timeline/timeline-meal-ctas";
import { resolvePedagogicalCtas } from "@/lib/pedagogical-decision-engine";
import {
  CTA_TABS,
  SIMULATOR_MEALS,
  type CtaItemId,
  type SimulatorMealPreset,
} from "./cta-lab-items";

export function CtaLabShowcase() {
  const [activeTabId, setActiveTabId] = useState<CtaItemId>("armstrong");
  const [viewMode, setViewMode] = useState<"mobile" | "fluid" | "all">("mobile");

  // Estados interactivos para pruebas
  const [armstrongLevel, setArmstrongLevel] = useState<number | undefined>(2);
  const [breathingCompleted, setBreathingCompleted] = useState(false);
  const [satietyChoice, setSatietyChoice] = useState<string | null>(null);
  const [digestionChoice, setDigestionChoice] = useState<string | null>(null);
  const [paceChoice, setPaceChoice] = useState<string | null>(null);
  const [addedAccompaniments, setAddedAccompaniments] = useState<string[]>([
    "Agua fresca de apoyo",
  ]);
  const [nextMealFocus, setNextMealFocus] = useState<string>(() => {
    if (typeof window === "undefined") return "Sumar hojas verdes / fibra";
    try {
      return (
        localStorage.getItem("twf_next_meal_focus") ||
        "Sumar hojas verdes / fibra"
      );
    } catch {
      return "Sumar hojas verdes / fibra";
    }
  });

  // Estado del simulador de comida real
  const [selectedMealIndex, setSelectedMealIndex] = useState(0);
  const [simulatorVariant, setSimulatorVariant] = useState<"pills" | "accordion">("pills");
  const [simulatorExpandedCtaId, setSimulatorExpandedCtaId] = useState<string | null>(
    "evaluate-hydration",
  );
  const [simulatorLoggedMicro, setSimulatorLoggedMicro] = useState<{
    type: string;
    level?: number;
  }>({ type: "armstrong", level: 2 });

  const activeMeal: SimulatorMealPreset = SIMULATOR_MEALS[selectedMealIndex];
  const dynamicSimulatorCtas = resolvePedagogicalCtas(activeMeal);

  const handleResetCurrent = (tabId: CtaItemId) => {
    switch (tabId) {
      case "armstrong":
        setArmstrongLevel(undefined);
        toast.info("Escala Armstrong reiniciada");
        break;
      case "breathing":
        setBreathingCompleted(false);
        toast.info("Pausa de respiración reiniciada");
        break;
      case "satiety":
        setSatietyChoice(null);
        toast.info("Escala de saciedad reiniciada");
        break;
      case "digestion":
        setDigestionChoice(null);
        toast.info("Registro digestivo reiniciado");
        break;
      case "pace":
        setPaceChoice(null);
        toast.info("Ritmo y entorno reiniciado");
        break;
      case "accompaniment":
        setAddedAccompaniments([]);
        toast.info("Acompañamientos limpiados");
        break;
      case "next_meal":
        setNextMealFocus("");
        try {
          localStorage.removeItem("twf_next_meal_focus");
        } catch {}
        toast.info("Foco de siguiente comida reiniciado");
        break;
      case "meal_simulator":
        setSimulatorExpandedCtaId(null);
        setSimulatorLoggedMicro({ type: "none" });
        toast.info("Simulador de comida reiniciado");
        break;
      default:
        toast.info("CTA reiniciado al estado inicial");
    }
  };

  const renderCtaInteractiveContent = (tabId: CtaItemId) => {
    switch (tabId) {
      case "armstrong":
        return (
          <div className="space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
              Nivel de hidratación
            </span>

            <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-border/60 bg-slate-100/50 dark:bg-card/40">
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                Elegí el color más parecido a tu orina para registrar cómo venís hoy con el agua:
              </p>
              <InlineArmstrongGuideWidget
                selectedLevel={armstrongLevel}
                onSelectLevel={(lvl) => {
                  setArmstrongLevel(lvl);
                  toast.success(`Nivel de hidratación: ${lvl}`, {
                    description:
                      lvl <= 3
                        ? "Estás en equilibrio y bien hidratado."
                        : lvl <= 5
                          ? "Tomá un poco de agua de a sorbos durante la tarde."
                          : "Priorizá tomar agua fresca para acompañar tu digestión.",
                  });
                }}
              />
            </div>

            <div className="p-3 rounded-2xl bg-secondary/40 border border-border/60 flex items-start gap-2.5 text-left">
              <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                <strong className="text-foreground font-semibold">Por qué funciona: </strong>
                Guiarte por el color de tu orina es más simple y preciso que obligarte a contar una cantidad fija de vasos al día.
              </p>
            </div>
          </div>
        );

      case "breathing":
        return (
          <div className="space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
              Un minuto para respirar
            </span>

            <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-border/60 bg-slate-100/50 dark:bg-card/40">
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                Inhalá en 4 segundos, exhalá en 6. Un respiro para bajar el ritmo y digerir con tranquilidad:
              </p>
              <InlineBreathingGuideWidget
                onComplete={() => {
                  setBreathingCompleted(true);
                }}
              />
            </div>

            {breathingCompleted && (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300 font-semibold">
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Pausa completada. Tu cuerpo está en calma.</span>
              </div>
            )}

            <div className="p-3 rounded-2xl bg-secondary/40 border border-border/60 flex items-start gap-2.5 text-left">
              <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                <strong className="text-foreground font-semibold">Por qué funciona: </strong>
                Exhalar lento le avisa a tu sistema nervioso que es momento de relajarse, ayudando a que tu digestión sea más liviana.
              </p>
            </div>
          </div>
        );

      case "satiety":
        return (
          <div className="space-y-4 text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
              Nivel de saciedad
            </span>

            <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-border/60 bg-slate-100/50 dark:bg-card/40 space-y-3">
              <p className="text-xs text-muted-foreground leading-relaxed">
                ¿Cómo te sentís al terminar de comer?
              </p>
              <div className="flex flex-wrap gap-2">
                {["No hambriento", "Satisfecho", "Muy lleno"].map((level) => {
                  const isSelected = satietyChoice === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => {
                        if (typeof navigator !== "undefined" && navigator.vibrate) {
                          navigator.vibrate(15);
                        }
                        setSatietyChoice(level);
                        toast.success(`Saciedad: ${level}`, {
                          description:
                            "Reconocer esta señal te ayuda a comer en sintonía con tu cuerpo.",
                        });
                      }}
                      className={cn(
                        "px-3.5 py-2 rounded-full border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95",
                        isSelected
                          ? "bg-foreground text-background border-foreground shadow-xs"
                          : "bg-secondary/70 hover:bg-secondary text-foreground border-border/80 hover:border-foreground/30",
                      )}
                    >
                      {isSelected ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-emerald-500/70" />
                      )}
                      <span>{level}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {satietyChoice && (
              <div className="p-3 rounded-2xl bg-secondary/50 border border-border/60 text-xs text-foreground flex items-center justify-between">
                <span>Registrado: <strong>{satietyChoice}</strong></span>
                <button
                  type="button"
                  onClick={() => setSatietyChoice(null)}
                  className="text-xs text-muted-foreground hover:text-foreground font-semibold cursor-pointer"
                >
                  Cambiar
                </button>
              </div>
            )}
          </div>
        );

      case "digestion":
        return (
          <div className="space-y-4 text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
              Confort digestivo
            </span>

            <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-border/60 bg-slate-100/50 dark:bg-card/40 space-y-3">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Registrá cómo te cayó este plato para descubrir qué combinaciones te sientan mejor:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Liviana y con energía",
                  "Confortable",
                  "Pesadez o inflamación",
                ].map((state) => {
                  const isSelected = digestionChoice === state;
                  return (
                    <button
                      key={state}
                      type="button"
                      onClick={() => {
                        if (typeof navigator !== "undefined" && navigator.vibrate) {
                          navigator.vibrate(15);
                        }
                        setDigestionChoice(state);
                        toast.success(`Digestión: ${state}`, {
                          description:
                            "Guardado en tu diario para identificar los platos que mejor te sientan.",
                        });
                      }}
                      className={cn(
                        "px-3.5 py-2 rounded-full border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95",
                        isSelected
                          ? "bg-foreground text-background border-foreground shadow-xs"
                          : "bg-secondary/70 hover:bg-secondary text-foreground border-border/80 hover:border-foreground/30",
                      )}
                    >
                      {isSelected ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-violet-500/70" />
                      )}
                      <span>{state}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {digestionChoice && (
              <div className="p-3 rounded-2xl bg-secondary/50 border border-border/60 text-xs text-foreground flex items-center justify-between">
                <span>Registrado: <strong>{digestionChoice}</strong></span>
                <button
                  type="button"
                  onClick={() => setDigestionChoice(null)}
                  className="text-xs text-muted-foreground hover:text-foreground font-semibold cursor-pointer"
                >
                  Cambiar
                </button>
              </div>
            )}
          </div>
        );

      case "pace":
        return (
          <div className="space-y-4 text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
              Ritmo al comer
            </span>

            <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-border/60 bg-slate-100/50 dark:bg-card/40 space-y-3">
              <p className="text-xs text-muted-foreground leading-relaxed">
                ¿Con qué tranquilidad comiste hoy?
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Con calma",
                  "Ritmo normal",
                  "Con prisa / Frente a pantalla",
                ].map((pace) => {
                  const isSelected = paceChoice === pace;
                  return (
                    <button
                      key={pace}
                      type="button"
                      onClick={() => {
                        if (typeof navigator !== "undefined" && navigator.vibrate) {
                          navigator.vibrate(15);
                        }
                        setPaceChoice(pace);
                        toast.success(`Ritmo registrado: ${pace}`, {
                          description:
                            pace === "Con prisa / Frente a pantalla"
                              ? "Comer frente a pantallas suele explicar la pesadez más que el alimento en sí."
                              : "Comer sin prisa mejora la señal de saciedad y alivia la digestión.",
                        });
                      }}
                      className={cn(
                        "px-3.5 py-2 rounded-full border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95",
                        isSelected
                          ? "bg-foreground text-background border-foreground shadow-xs"
                          : "bg-secondary/70 hover:bg-secondary text-foreground border-border/80 hover:border-foreground/30",
                      )}
                    >
                      {isSelected ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : (
                        <Clock className="w-3 h-3 text-muted-foreground" />
                      )}
                      <span>{pace}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-secondary/40 border border-border/60 text-[11px] text-muted-foreground leading-relaxed">
              💡 <strong>Un detalle importante:</strong> Comer sin prisa y sin pantallas ayuda a que el cuerpo reciba y asimile mejor los alimentos.
            </div>
          </div>
        );

      case "accompaniment":
        return (
          <div className="space-y-4 text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
              Sumar a este plato
            </span>

            <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-border/60 bg-slate-100/50 dark:bg-card/40 space-y-3">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tocá para agregar lo que acompañó tu plato sin tener que sacar otra foto:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Agua fresca de apoyo",
                  "Café o té sin azúcar",
                  "Ensalada de hojas verdes",
                  "Fruta fresca",
                  "Puñado de frutos secos",
                ].map((acc) => {
                  const isAdded = addedAccompaniments.includes(acc);
                  return (
                    <button
                      key={acc}
                      type="button"
                      onClick={() => {
                        if (typeof navigator !== "undefined" && navigator.vibrate) {
                          navigator.vibrate(15);
                        }
                        if (isAdded) {
                          setAddedAccompaniments((prev) =>
                            prev.filter((item) => item !== acc),
                          );
                          toast.info(`Removido: ${acc}`);
                        } else {
                          setAddedAccompaniments((prev) => [...prev, acc]);
                          toast.success(`Añadido: ${acc}`, {
                            description:
                              "Se sumó a tu plato para completar los nutrientes del día.",
                          });
                        }
                      }}
                      className={cn(
                        "px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95",
                        isAdded
                          ? "bg-foreground text-background border-foreground shadow-xs"
                          : "bg-secondary/70 hover:bg-secondary text-foreground border-border/80 hover:border-foreground/30",
                      )}
                    >
                      {isAdded ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : (
                        <Plus className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                      <span>{acc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {addedAccompaniments.length > 0 && (
              <div className="p-3 rounded-2xl bg-secondary/50 border border-border/60 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                  Agregado a tu plato:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {addedAccompaniments.map((acc) => (
                    <span
                      key={acc}
                      className="px-2.5 py-1 rounded-full bg-card border border-border text-xs font-medium text-foreground flex items-center gap-1"
                    >
                      <Check className="w-3 h-3 text-emerald-500" />
                      {acc}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "next_meal":
        return (
          <div className="space-y-4 text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
              Recordar en tu próxima comida
            </span>

            <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-border/60 bg-slate-100/50 dark:bg-card/40 space-y-3">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Elegí una intención para tenerla presente cuando registres tu siguiente plato:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Sumar hojas verdes / fibra",
                  "Priorizar proteína",
                  "Semillas o frutos secos",
                ].map((focus) => {
                  const isSelected = nextMealFocus === focus;
                  return (
                    <button
                      key={focus}
                      type="button"
                      onClick={() => {
                        if (typeof navigator !== "undefined" && navigator.vibrate) {
                          navigator.vibrate(15);
                        }
                        setNextMealFocus(focus);
                        try {
                          localStorage.setItem("twf_next_meal_focus", focus);
                        } catch {}
                        toast.success(`Foco guardado: ${focus}`, {
                          description:
                            "Te lo mostraremos al registrar tu próximo plato.",
                        });
                      }}
                      className={cn(
                        "px-3.5 py-2 rounded-full border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95",
                        isSelected
                          ? "bg-foreground text-background border-foreground shadow-xs"
                          : "bg-secondary/70 hover:bg-secondary text-foreground border-border/80 hover:border-foreground/30",
                      )}
                    >
                      {isSelected ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : (
                        <Compass className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                      <span>{focus}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {nextMealFocus && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-foreground space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                  Vista previa en cámara:
                </span>
                <p className="font-semibold flex items-center gap-1.5 text-foreground">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  Recordatorio activo: &ldquo;{nextMealFocus}&rdquo;
                </p>
              </div>
            )}
          </div>
        );

      case "anti_drowsiness":
        return (
          <div className="space-y-4 text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
              Mantener la energía
            </span>

            <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-border/60 bg-slate-100/50 dark:bg-card/40">
              <TypewriterMarkdown
                content={getMealCtaMarkdownContent("anti-drowsiness-strategy", {
                  title: "Almuerzo",
                })}
                className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed font-normal"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  toast.success("Caminata suave registrada (5-10 min)", {
                    description: "Mover las piernas ayuda a utilizar la energía del plato con ligereza.",
                  });
                }}
                className="p-2.5 rounded-2xl bg-secondary/60 hover:bg-secondary border border-border/60 text-xs font-semibold text-foreground text-center transition-colors cursor-pointer"
              >
                🚶 Caminata 5m
              </button>
              <button
                type="button"
                onClick={() => {
                  toast.success("Agua fresca registrada", {
                    description: "Hidratar reactiva tu foco mental y te despeja.",
                  });
                }}
                className="p-2.5 rounded-2xl bg-secondary/60 hover:bg-secondary border border-border/60 text-xs font-semibold text-foreground text-center transition-colors cursor-pointer"
              >
                💧 Agua fresca
              </button>
              <button
                type="button"
                onClick={() => {
                  toast.success("Luz natural recibida", {
                    description: "Unos minutos al sol despiertan tu reloj biológico.",
                  });
                }}
                className="p-2.5 rounded-2xl bg-secondary/60 hover:bg-secondary border border-border/60 text-xs font-semibold text-foreground text-center transition-colors cursor-pointer"
              >
                ☀️ Luz solar
              </button>
            </div>
          </div>
        );

      case "night_rest":
        return (
          <div className="space-y-4 text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
              Preparar el descanso
            </span>

            <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-border/60 bg-slate-100/50 dark:bg-card/40">
              <TypewriterMarkdown
                content={getMealCtaMarkdownContent("night-rest-prep", {
                  title: "Cena",
                })}
                className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed font-normal"
              />
            </div>

            <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-start gap-2.5">
              <Moon className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                <strong className="text-foreground font-semibold">Consejo nocturno: </strong>
                Cenar liviano y reducir las pantallas al terminar permite que tu cuerpo descanse mejor durante toda la noche.
              </p>
            </div>
          </div>
        );

      case "meal_simulator":
        return (
          <div className="space-y-4 text-left">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                Ejemplo en una comida real
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSimulatorVariant("pills")}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                    simulatorVariant === "pills"
                      ? "bg-foreground text-background shadow-xs"
                      : "text-muted-foreground hover:text-foreground bg-secondary/50",
                  )}
                >
                  Píldoras
                </button>
                <button
                  type="button"
                  onClick={() => setSimulatorVariant("accordion")}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                    simulatorVariant === "accordion"
                      ? "bg-foreground text-background shadow-xs"
                      : "text-muted-foreground hover:text-foreground bg-secondary/50",
                  )}
                >
                  Acordeón
                </button>
              </div>
            </div>

            {/* Selector de comida preset */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                Selecciona un plato para simular:
              </span>
              <div className="flex gap-1.5 overflow-x-auto custom-scrollbar pb-1">
                {SIMULATOR_MEALS.map((meal, idx) => {
                  const isSelected = selectedMealIndex === idx;
                  return (
                    <button
                      key={meal.id}
                      type="button"
                      onClick={() => {
                        setSelectedMealIndex(idx);
                        setSimulatorExpandedCtaId(null);
                      }}
                      className={cn(
                        "px-3 py-1.5 rounded-xl border text-xs font-semibold shrink-0 transition-all cursor-pointer",
                        isSelected
                          ? "bg-foreground text-background border-foreground shadow-xs"
                          : "bg-card text-foreground border-border/80 hover:bg-secondary/70",
                      )}
                    >
                      {meal.title.split(",")[0].split(" con ")[0]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tarjeta de simulación */}
            <div className="p-4 rounded-3xl border border-border bg-card shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <div>
                  <h4 className="text-sm font-bold text-foreground">
                    {activeMeal.title}
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    {activeMeal.mealType} · {activeMeal.time} · Razón: {activeMeal.eatingReason}
                  </p>
                </div>
              </div>

              {/* Renderizado de TimelineMealCtas exacto del diario */}
              <TimelineMealCtas
                item={activeMeal}
                dynamicCtas={dynamicSimulatorCtas}
                expandedCtaId={simulatorExpandedCtaId}
                variant={simulatorVariant}
                onToggleCta={(_itemId, ctaId) => {
                  setSimulatorExpandedCtaId((prev) => (prev === ctaId ? null : ctaId));
                }}
                loggedMicroAction={simulatorLoggedMicro}
                onLogArmstrongLevel={(_itemId, level) => {
                  setSimulatorLoggedMicro({ type: "armstrong", level });
                  toast.success(`Nivel Armstrong ${level} guardado en la comida`);
                }}
                onCompleteBreathing={(_itemId) => {
                  setSimulatorLoggedMicro({ type: "vagal_pause" });
                  toast.success("Pausa respiratoria registrada en la comida");
                }}
                onAddAccompaniment={(_itemId, acc) => {
                  toast.success(`Sumado a este plato: ${acc}`);
                }}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-background text-foreground pb-20">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border/80 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <Link
              to="/app"
              className="p-2 -ml-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              title="Volver a la App"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center shrink-0">
                <Droplet className="w-4 h-4 text-sky-500" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-foreground truncate flex items-center gap-1.5">
                  Laboratorio de Hábitos
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground font-semibold">
                    10 acciones
                  </span>
                </h1>
                <p className="text-[11px] text-muted-foreground truncate">
                  Probá cómo se sienten la hidratación, respiración, saciedad y pausas del día
                </p>
              </div>
            </div>
          </div>

          {/* Viewport switch controls */}
          <div className="flex items-center gap-1 p-1 bg-secondary/80 rounded-xl border border-border/60 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode("mobile")}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer",
                viewMode === "mobile"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
              title="Vista móvil estricta (360px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Móvil (360px)</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("fluid")}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer",
                viewMode === "fluid"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
              title="Vista fluida / ancho completo"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Fluido</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("all")}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer",
                viewMode === "all"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
              title="Ver todas las acciones juntas"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Todas</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 pt-4 space-y-6">
        {/* Horizontal Navigation Pills (when not viewing all) */}
        {viewMode !== "all" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Elegí una acción para probar:
              </span>
              <button
                type="button"
                onClick={() => handleResetCurrent(activeTabId)}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 font-semibold cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reiniciar</span>
              </button>
            </div>

            <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 -mx-1 px-1">
              {CTA_TABS.map((tab) => {
                const isActive = activeTabId === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTabId(tab.id)}
                    className={cn(
                      "px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-2xs select-none",
                      isActive
                        ? "bg-foreground text-background border-foreground shadow-xs"
                        : "bg-card hover:bg-secondary/80 text-foreground border-border/80",
                    )}
                  >
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Viewport Render Area */}
        {viewMode === "all" ? (
          /* GALLERY: Render all CTAs stacked */
          <div className="space-y-6">
            <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-xs text-foreground flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-500 shrink-0" />
                <span>Mostrando todas las acciones de bienestar de la plataforma.</span>
              </div>
              <span className="text-[11px] text-muted-foreground shrink-0 font-semibold">
                Modo galería
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
              {CTA_TABS.map((tab) => (
                <div
                  key={tab.id}
                  className="p-5 rounded-3xl border border-border bg-card shadow-xs flex flex-col justify-between hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg transition-all duration-300 text-left"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-border/60 pb-2">
                      <span className="text-xs font-bold text-foreground">
                        {tab.label}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleResetCurrent(tab.id)}
                        className="p-1.5 -m-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer"
                        title="Reiniciar este CTA"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                    </div>

                    <div>{renderCtaInteractiveContent(tab.id)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : viewMode === "mobile" ? (
          /* MOBILE SIMULATOR: 360px viewport container */
          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-full max-w-[370px]">
              {/* Device Header Bar */}
              <div className="flex items-center justify-between px-3 py-1.5 bg-secondary/80 rounded-t-2xl border border-border border-b-0 text-[10px] font-bold text-muted-foreground">
                <span>SIMULADOR MÓVIL (360px)</span>
                <span className="text-emerald-600 dark:text-emerald-400">100% Responsivo</span>
              </div>

              {/* Mobile Device Frame */}
              <div className="w-full p-4 bg-card rounded-b-2xl border border-border shadow-lg space-y-3">
                {renderCtaInteractiveContent(activeTabId)}
              </div>

              <p className="text-[11px] text-muted-foreground text-center mt-3">
                💡 Podés redimensionar la ventana o activar el modo dispositivo en DevTools (F12) para probar en pantallas estrechas.
              </p>
            </div>
          </div>
        ) : (
          /* FLUID VIEW: Adapts to whatever width is available */
          <div className="max-w-2xl mx-auto p-5 rounded-3xl border border-border bg-card shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <span className="text-xs font-bold text-foreground">
                Vista fluida (se adapta al ancho disponible)
              </span>
              <button
                type="button"
                onClick={() => handleResetCurrent(activeTabId)}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reiniciar</span>
              </button>
            </div>

            <div>{renderCtaInteractiveContent(activeTabId)}</div>
          </div>
        )}
      </main>
    </div>
  );
}
