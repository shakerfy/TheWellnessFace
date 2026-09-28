import React from "react";
import { Badge } from "@/components/ui/badge";

export function LandingTestimonials() {
  const testimonials = [
    {
      name: "Martín Rodríguez",
      role: "Alumno (Palermo)",
      quote:
        "Buscaba un box de CrossFit que tuviera clases a las 7 AM cerca de mi oficina. La IA de The Wellness Face lo encontró al instante. Reservar es comodísimo.",
      avatar: "MR",
    },
    {
      name: "Camila Varela",
      role: "Alumna (Recoleta)",
      quote:
        "Me mudé hace poco y no sabía dónde hacer Yoga. Gracias a la plataforma encontré un studio boutique con una energía increíble. 100% recomendado.",
      avatar: "CV",
    },
    {
      name: "Damián K.",
      role: "Dueño de Kraft Strength Club",
      quote:
        "Desde que nos sumamos como partners, las visitas para pases de prueba crecieron un 35%. La plataforma nos trajo público muy calificado.",
      avatar: "DK",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 border-t border-border/60">
      <div className="mb-12 text-center">
        <Badge variant="secondary" className="rounded-full">
          Testimonios
        </Badge>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
          Lo que dicen en la comunidad
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Alumnos y dueños de centros entrenando y creciendo juntos.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((t, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between p-6 rounded-2xl border border-border bg-background"
          >
            <p className="text-sm leading-relaxed text-muted-foreground/90 italic">"{t.quote}"</p>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary font-semibold text-foreground text-xs">
                {t.avatar}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">{t.name}</h4>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
