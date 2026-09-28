import React, { useState } from "react";
import { Sparkles, X, ArrowUpRight } from "lucide-react";

export type AIQuestion = {
  question: string;
  hint: string;
  chips: { emoji: string; label: string; value: string }[];
};

export const AI_QUESTIONS: AIQuestion[] = [
  {
    question: "¿Qué tipo de actividad te interesa?",
    hint: "Podés elegir una o simplemente saltear si no lo tenés claro todavía.",
    chips: [
      { emoji: "🏋️", label: "Musculación y fuerza", value: "musculación fuerza" },
      { emoji: "🧘", label: "Yoga o pilates", value: "yoga pilates" },
      { emoji: "🥊", label: "Funcional o CrossFit", value: "funcional crossfit" },
      { emoji: "🚴", label: "Cardio o spinning", value: "cardio spinning" },
      { emoji: "🤸", label: "Clases grupales variadas", value: "clases grupales" },
    ],
  },
  {
    question: "¿En qué zona de Buenos Aires preferís entrenar?",
    hint: "Te mostramos los mejores gimnasios de esa área.",
    chips: [
      { emoji: "📍", label: "Palermo", value: "Palermo" },
      { emoji: "📍", label: "Belgrano", value: "Belgrano" },
      { emoji: "📍", label: "Recoleta", value: "Recoleta" },
      { emoji: "📍", label: "Villa Crespo", value: "Villa Crespo" },
      { emoji: "🗺️", label: "Me da igual la zona", value: "" },
    ],
  },
  {
    question: "¿Cuándo preferís entrenar?",
    hint: "Así filtramos gimnasios con horarios disponibles para vos.",
    chips: [
      { emoji: "🌅", label: "Mañana (6 a 12 hs)", value: "mañana horario matutino" },
      { emoji: "☀️", label: "Mediodía (12 a 16 hs)", value: "mediodía" },
      { emoji: "🌆", label: "Tarde/noche (16 a 21 hs)", value: "tarde noche" },
      { emoji: "🕐", label: "Necesito 24 horas", value: "24 horas" },
      { emoji: "🤷", label: "Cualquier horario", value: "" },
    ],
  },
  {
    question: "¿Cuánto querés gastar por mes?",
    hint: "Te ayudamos a encontrar opciones que se ajusten a tu presupuesto.",
    chips: [
      { emoji: "💚", label: "Hasta $15.000", value: "económico barato precio bajo" },
      { emoji: "💛", label: "$15.000 a $35.000", value: "precio medio" },
      { emoji: "💙", label: "Más de $35.000", value: "premium high-end" },
      { emoji: "🤷", label: "El precio no importa", value: "" },
    ],
  },
];

interface SmartAssistantProps {
  onSearch: (query: string) => void;
  onClose: () => void;
}

export function SmartAssistant({ onSearch, onClose }: SmartAssistantProps) {
  const [answers, setAnswers] = useState<{ idx: number; label: string; value: string }[]>([]);
  const currentIdx = answers.length;
  const isDone = currentIdx >= AI_QUESTIONS.length;

  const handleChip = (chip: { label: string; value: string }) => {
    const next = [...answers, { idx: currentIdx, label: chip.label, value: chip.value }];
    setAnswers(next);

    if (next.length >= AI_QUESTIONS.length) {
      const query = next
        .map((a) => a.value)
        .filter(Boolean)
        .join(" ")
        .trim();
      onSearch(query || "gimnasio");
    }
  };

  const handleSkip = () => {
    handleChip({ label: "Sin preferencia", value: "" });
  };

  const handleSearchNow = () => {
    const query = answers
      .map((a) => a.value)
      .filter(Boolean)
      .join(" ")
      .trim();
    onSearch(query || "gimnasio");
  };

  const currentQ = AI_QUESTIONS[currentIdx];

  return (
    <div className="w-full max-w-2xl px-2 mt-3 animate-in slide-in-from-top-2 fade-in duration-300">
      <div className="rounded-3xl border border-border bg-background overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-foreground flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-background fill-background" />
            </div>
            <span className="text-xs font-semibold text-foreground">The Wellness Face IA</span>
            <span className="text-[10px] text-muted-foreground font-medium">
              — te ayuda a encontrar el gym ideal
            </span>
          </div>
          <button
            onClick={onClose}
            className="grid h-6 w-6 place-items-center rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {answers.map((a, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="mt-0.5 h-5 w-5 rounded-full bg-foreground/8 border border-border flex items-center justify-center shrink-0">
                <svg className="h-2.5 w-2.5 text-foreground" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-[11px] text-muted-foreground font-medium">
                  {AI_QUESTIONS[i].question}
                </p>
                <p className="text-xs font-semibold text-foreground mt-0.5">{a.label}</p>
              </div>
            </div>
          ))}

          {answers.length > 0 && !isDone && <div className="border-t border-border/40" />}

          {!isDone && currentQ && (
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{currentQ.question}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{currentQ.hint}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentQ.chips.map((chip) => (
                  <button
                    key={chip.label}
                    onClick={() => handleChip(chip)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-border bg-background text-xs font-medium text-foreground hover:border-foreground/50 hover:bg-secondary/60 transition-all duration-150 active:scale-95"
                  >
                    <span>{chip.emoji}</span>
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1">
              {AI_QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i < answers.length
                      ? "w-4 bg-foreground"
                      : i === answers.length
                        ? "w-4 bg-foreground/40"
                        : "w-1.5 bg-border"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              {!isDone && (
                <button
                  onClick={handleSkip}
                  className="text-[11px] text-muted-foreground hover:text-foreground transition font-medium"
                >
                  Saltear →
                </button>
              )}
              {answers.length > 0 && (
                <button
                  onClick={handleSearchNow}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-foreground text-background text-xs font-semibold hover:bg-foreground/90 transition active:scale-95"
                >
                  <ArrowUpRight className="h-3 w-3" />
                  Buscar ahora
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
