import React from "react";
import { Badge } from "@/components/ui/badge";

export function LandingTestimonials() {
  const testimonials = [
    {
      name: "Martín Rodríguez",
      role: "Atleta híbrido (Palermo)",
      quote:
        "Buscaba un box de Hyrox y funcional que tuviera sesiones a las 7 AM y zona de recovery cerca de mi oficina. La IA de The Wellness Face lo encontró al instante. Reservar es comodísimo.",
      avatar: "MR",
    },
    {
      name: "Camila Varela",
      role: "Alumna de Pilates (Pichincha, Rosario)",
      quote:
        "Me mudé hace poco y quería un estudio de reformer con luz natural y grupos chicos. Gracias a la plataforma encontré un santuario increíble. Cero burocracia de WhatsApp.",
      avatar: "CV",
    },
    {
      name: "Damián K.",
      role: "Director de Kraft Athletic Club",
      quote:
        "Desde que nos sumamos como partners, las reservas para clases de prueba crecieron un 35%. La plataforma nos trajo personas que valoran de verdad la salud y el entrenamiento.",
      avatar: "DK",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 border-t border-[#24211D] bg-[#0E0D0C]">
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#38332C] bg-[#1C1A17] px-3.5 py-1 text-[10px] uppercase tracking-[0.22em] font-semibold text-[#C5BAA8] mb-3">
          Comunidad Consciente
        </div>
        <h2 className="mt-2 text-2xl font-light tracking-tight md:text-3xl text-[#F6F4EE]">
          Voces de Alumnos & Instructores
        </h2>
        <p className="mt-1.5 text-sm text-[#A39C91]">
          Espacios y personas conectadas por el movimiento inteligente.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((t, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between p-6 rounded-2xl border border-[#24211D] bg-[#141311] hover:border-[#38332C] transition-all duration-300"
          >
            <p className="text-sm leading-relaxed text-[#B8B2A8] italic">"{t.quote}"</p>
            <div className="mt-6 flex items-center gap-3 pt-4 border-t border-[#1F1C19]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1F1C19] border border-[#38332C] font-semibold text-[#D4CEBA] text-xs">
                {t.avatar}
              </div>
              <div>
                <h4 className="text-sm font-medium text-[#F6F4EE]">{t.name}</h4>
                <p className="text-xs text-[#7D766D]">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
