import React from "react";
import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function LandingValueSection() {
  const items = [
    {
      k: "01",
      t: "Búsqueda con IA",
      d: "Describe lo que querés en lenguaje natural y nuestra IA filtra por ubicación, presupuesto, disciplina y horarios.",
    },
    {
      k: "02",
      t: "Reserva sin fricción",
      d: "Bookings de clases y pases de prueba con confirmación instantánea, sin llamados ni formularios.",
    },
    {
      k: "03",
      t: "Control de tu rutina",
      d: "Administra tus membresías, historial de clases y pagos desde un panel centralizado para ti.",
    },
  ];

  return (
    <section id="como-funciona" className="border-t border-border bg-secondary/40 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-3">
          {items.map((i) => (
            <div key={i.k} className="border-t border-foreground/10 pt-6">
              <div className="text-xs font-medium text-muted-foreground">{i.k}</div>
              <h3 className="mt-3 text-xl font-semibold tracking-tight">{i.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{i.d}</p>
            </div>
          ))}
        </div>

        {/* Blog Section */}
        <div id="blog" className="mt-32 scroll-mt-24">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Blog & Novedades
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Últimas tendencias, consejos y noticias del mundo fitness.
              </p>
            </div>
            <Link
              to="/blog"
              className="hidden sm:inline-flex items-center text-xs font-bold text-primary hover:underline"
            >
              Ver todos los artículos →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              to="/blog/$slug"
              params={{ slug: "el-auge-del-fitness-hibrido" }}
              className="group cursor-pointer space-y-3"
            >
              <div className="aspect-[16/9] overflow-hidden rounded-2xl bg-muted">
                <img
                  src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  alt="Blog 1"
                />
              </div>
              <div>
                <div className="text-xs font-medium text-muted-foreground">Tendencias · 4 min</div>
                <h3 className="mt-1 font-semibold tracking-tight group-hover:underline">
                  El auge del fitness híbrido
                </h3>
              </div>
            </Link>
            <Link
              to="/blog/$slug"
              params={{ slug: "guia-nutricion-pre-entrenamiento" }}
              className="group cursor-pointer space-y-3 hidden sm:block"
            >
              <div className="aspect-[16/9] overflow-hidden rounded-2xl bg-muted">
                <img
                  src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  alt="Blog 2"
                />
              </div>
              <div>
                <div className="text-xs font-medium text-muted-foreground">Nutrición · 5 min</div>
                <h3 className="mt-1 font-semibold tracking-tight group-hover:underline">
                  Guía completa de nutrición pre-entrenamiento
                </h3>
              </div>
            </Link>
            <Link
              to="/blog/$slug"
              params={{ slug: "crossfit-vs-funcional-diferencias" }}
              className="group cursor-pointer space-y-3 hidden lg:block"
            >
              <div className="aspect-[16/9] overflow-hidden rounded-2xl bg-muted">
                <img
                  src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  alt="Blog 3"
                />
              </div>
              <div>
                <div className="text-xs font-medium text-muted-foreground">
                  Entrenamiento · 6 min
                </div>
                <h3 className="mt-1 font-semibold tracking-tight group-hover:underline">
                  CrossFit vs Entrenamiento Funcional
                </h3>
              </div>
            </Link>
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Link
              to="/blog"
              className="inline-flex items-center text-xs font-bold text-primary hover:underline"
            >
              Ver todos los artículos →
            </Link>
          </div>
        </div>

        {/* Para gimnasios / B2B */}
        <div
          id="para-gimnasios"
          className="mt-32 flex flex-col items-start justify-between gap-6 rounded-3xl border border-border bg-background p-8 md:flex-row md:items-center md:p-12 scroll-mt-24"
        >
          <div>
            <Badge variant="secondary" className="rounded-full">
              Para partners
            </Badge>
            <h3 className="mt-3 max-w-xl text-2xl font-semibold tracking-tight md:text-3xl">
              Llevá tu Centro al próximo nivel con The Wellness Face.
            </h3>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Aparecé en miles de búsquedas, gestioná membresías y digitalizá tus clases.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button variant="outline" className="rounded-full">
              Ver demo
            </Button>
            <Button className="rounded-full">Sumar mi centro</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
