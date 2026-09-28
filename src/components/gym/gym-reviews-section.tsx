import React from "react";
import { Star } from "lucide-react";
import { type Gym } from "@/lib/gyms";

interface GymReviewsSectionProps {
  gym: Gym;
}

export function GymReviewsSection({ gym }: GymReviewsSectionProps) {
  return (
    <section className="mt-16 border-t border-border pt-16">
      <div className="flex items-center gap-2 mb-8">
        <Star className="h-6 w-6 fill-foreground text-foreground" />
        <h2 className="text-2xl font-semibold tracking-tight">
          {gym.rating.toFixed(1)} · {gym.reviews} evaluaciones
        </h2>
      </div>

      <div className="grid gap-10 md:grid-cols-3">
        {/* Left side: Rating breakdown */}
        <div className="md:col-span-1 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Calificaciones promedio
          </h3>

          {[
            { label: "Limpieza", score: 4.8 },
            { label: "Equipamiento", score: 4.9 },
            { label: "Atención del Staff", score: 5.0 },
            { label: "Relación Calidad/Precio", score: 4.7 },
          ].map((category) => (
            <div key={category.label} className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span>{category.label}</span>
                <span className="font-bold text-foreground">{category.score.toFixed(1)}</span>
              </div>
              {/* Progress bar */}
              <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-foreground rounded-full"
                  style={{ width: `${(category.score / 5) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Right side: Individual Reviews List */}
        <div className="md:col-span-2 grid gap-6 sm:grid-cols-2">
          {[
            {
              name: "Agustín Gómez",
              date: "Junio de 2026",
              rating: 5,
              comment:
                "El WOD de CrossFit es súper completo. Mateo es excelente corrigiendo posturas y adaptando el peso si tienes alguna molestia física. Los vestuarios siempre están limpios.",
              photo:
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80",
            },
            {
              name: "Paula Cáceres",
              date: "Mayo de 2026",
              rating: 5,
              comment:
                "Fui a la clase de Yoga por la tarde, el salón es amplio y silencioso. Los amenities como lockers y toallas de alquiler son súper cómodos.",
              photo:
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80",
            },
            {
              name: "Marcos López",
              date: "Abril de 2026",
              rating: 4,
              comment:
                "Muy buen equipamiento en la sala de musculación. Se llena un poco en la hora pico de las 19 hs, pero el aforo en tiempo real de la app ayuda a evitar esos horarios.",
              photo:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80",
            },
            {
              name: "Sofía Martínez",
              date: "Marzo de 2026",
              rating: 5,
              comment:
                "Las profesoras explican súper bien y adaptan los niveles de intensidad. Es un ambiente muy comunitario y libre de prejuicios.",
              photo:
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80",
            },
          ].map((review, i) => (
            <div
              key={i}
              className="space-y-2 p-4 border border-border bg-card/25 rounded-2xl hover:border-foreground/20 transition duration-300"
            >
              <div className="flex items-center gap-3">
                <img
                  src={review.photo}
                  alt={review.name}
                  className="h-9 w-9 rounded-full object-cover border border-border"
                />
                <div>
                  <div className="text-xs font-bold text-foreground">{review.name}</div>
                  <div className="text-[10px] text-muted-foreground">{review.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-0.5 text-amber-500">
                {Array.from({ length: review.rating }).map((_, idx) => (
                  <Star key={idx} className="h-3 w-3 fill-current" />
                ))}
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
