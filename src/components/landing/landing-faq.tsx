import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function LandingFAQ() {
  const faqs = [
    {
      q: "¿Tiene costo adicional reservar a través de The Wellness Face?",
      a: "No, en The Wellness Face mostramos los mismos precios directos de los gimnasios. No cobramos comisiones extras ni cargos ocultos a los alumnos.",
    },
    {
      q: "¿Cómo funciona la búsqueda asistida por IA?",
      a: "Nuestra IA analiza tu descripción en lenguaje natural (ej. 'clases de yoga matutinas bajo $25.000 en Belgrano') y cruza los datos de ubicación, precios, horarios de clases y equipamiento de nuestra base para sugerirte las mejores opciones.",
    },
    {
      q: "¿Qué pasa si quiero cancelar una reserva de clase?",
      a: "Podés cancelar cualquier reserva directamente desde tu panel de usuario. Las políticas de cancelación (tiempo límite) dependen de cada gimnasio, pero normalmente es hasta 2 horas antes de la clase.",
    },
    {
      q: "Tengo un centro de entrenamiento, ¿cómo me registro?",
      a: "Hacé clic en el botón 'Sumar mi centro' al final de la página, completá el formulario de tu gimnasio y nos pondremos en contacto para ayudarte a configurar tu perfil de partner en minutos.",
    },
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="mx-auto max-w-3xl px-6 py-24 border-t border-border/60">
      <div className="mb-12 text-center">
        <Badge variant="secondary" className="rounded-full">
          FAQ
        </Badge>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
          Preguntas Frecuentes
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Todo lo que necesitas saber sobre el uso de la plataforma.
        </p>
      </div>
      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="border border-border rounded-xl bg-background overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="flex w-full items-center justify-between p-5 text-left font-medium text-sm text-foreground hover:bg-secondary/20 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`transition-all duration-200 ease-in-out ${
                  isOpen
                    ? "max-h-[160px] border-t border-border p-5 bg-secondary/5"
                    : "max-h-0 overflow-hidden"
                }`}
              >
                <p className="text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
