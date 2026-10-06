import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function LandingFAQ() {
  const faqs = [
    {
      q: "¿Tiene costo adicional reservar a través de The Wellness Face?",
      a: "No, en The Wellness Face mostramos los mismos precios directos de los estudios y centros. No cobramos comisiones extras ni cargos ocultos a los alumnos.",
    },
    {
      q: "¿Cómo funciona la curaduría y búsqueda con IA?",
      a: "Nuestra IA analiza tu descripción en lenguaje natural (ej. 'clases de yoga restaurativo cerca de Oroño' o 'box de Hyrox con recovery') y cruza los datos de metodología, enfoque de impacto físico, profesores y horarios para sugerirte el santuario óptimo.",
    },
    {
      q: "¿Qué pasa si necesito cancelar o reprogramar una clase?",
      a: "Puedes gestionar tus reservas con 1 toque desde tu panel personal. Las políticas de cancelación dependen de cada estudio, asegurando que las camas y cupos se aprovechen sin perjudicar a otros alumnos.",
    },
    {
      q: "Tengo un estudio o box, ¿cómo sumo mi espacio a la plataforma?",
      a: "Haz clic en 'Sumar mi centro gratis' al final de la página. Te ayudamos a configurar tu perfil de partner en pocos minutos sin costo de mantenimiento ni comisiones fijas.",
    },
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="mx-auto max-w-3xl px-6 py-24 border-t border-[#24211D] bg-[#0E0D0C]">
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#38332C] bg-[#1C1A17] px-3.5 py-1 text-[10px] uppercase tracking-[0.22em] font-semibold text-[#C5BAA8] mb-3">
          Claridad & Preguntas
        </div>
        <h2 className="mt-2 text-2xl font-light tracking-tight md:text-3xl text-[#F6F4EE]">
          Preguntas Frecuentes
        </h2>
        <p className="mt-1.5 text-sm text-[#A39C91]">
          Todo lo que necesitas saber sobre el uso de la plataforma y reservas.
        </p>
      </div>
      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="border border-[#24211D] rounded-xl bg-[#141311] overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="flex w-full items-center justify-between p-5 text-left font-normal text-sm text-[#F6F4EE] hover:bg-[#1A1815] transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-[#A39C91] transition-transform duration-300 ${isOpen ? "rotate-180 text-[#C5BAA8]" : ""}`}
                />
              </button>
              <div
                className={`transition-all duration-300 ease-in-out ${
                  isOpen
                    ? "max-h-[160px] border-t border-[#1F1C19] p-5 bg-[#100F0E]"
                    : "max-h-0 overflow-hidden"
                }`}
              >
                <p className="text-sm leading-relaxed text-[#A39C91]">{faq.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
