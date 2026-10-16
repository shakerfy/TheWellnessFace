import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export function LandingFAQ() {
  const faqs = [
    {
      q: "¿Tiene costo adicional reservar a través de The Wellness Face?",
      a: "No, en The Wellness Face mostramos los mismos precios directos de los estudios y centros. No cobramos comisiones extras ni cargos ocultos a los alumnos.",
    },
    {
      q: "¿Cómo funciona la curaduría y búsqueda con IA?",
      a: "Nuestra IA analiza tu descripción en lenguaje natural (ej. 'clases de yoga restaurativo cerca de Palermo' o 'box de Hyrox con recovery') y cruza los datos de metodología, enfoque de impacto físico, profesores y horarios para sugerirte el santuario óptimo.",
    },
    {
      q: "¿Qué pasa si necesito cancelar o reprogramar una clase?",
      a: "Puedes gestionar tus reservas con 1 toque desde tu panel personal. Las políticas de cancelación dependen de cada estudio, asegurando que las camas y cupos se aprovechen sin perjudicar a otros alumnos.",
    },
    {
      q: "Tengo un estudio o box, ¿cómo sumo mi espacio a la plataforma?",
      a: "Haz clic en 'Partners' en la cabecera. Te ayudamos a configurar tu perfil de partner en pocos minutos sin costo de mantenimiento ni comisiones fijas.",
    },
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1 text-[10px] uppercase tracking-[0.2em] font-semibold text-muted-foreground mb-3">
          Claridad & Preguntas
        </div>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl text-foreground">
          Preguntas Frecuentes
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
          Todo lo que necesitas saber sobre el uso de la plataforma y reservas.
        </p>
      </div>
      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="border border-border/80 rounded-2xl bg-card overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="flex w-full items-center justify-between p-4 sm:p-5 text-left font-medium text-sm text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform duration-300 shrink-0 ml-2 ${
                    isOpen ? "rotate-180 text-foreground" : ""
                  }`}
                />
              </button>
              <div
                className={`transition-all duration-300 ease-in-out ${
                  isOpen
                    ? "max-h-[160px] border-t border-border/60 p-4 sm:p-5 bg-muted/20"
                    : "max-h-0 overflow-hidden"
                }`}
              >
                <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
