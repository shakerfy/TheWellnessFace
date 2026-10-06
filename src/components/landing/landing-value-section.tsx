import React from "react";
import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function LandingValueSection() {
  const items = [
    {
      k: "01",
      t: "Curaduría con IA",
      d: "Describe lo que buscas en lenguaje natural. Nuestra IA cruza ubicación, enfoque somático, metodología y horarios para encontrar tu espacio ideal.",
    },
    {
      k: "02",
      t: "Reserva en calma",
      d: "Reserva de camas de Pilates, clases boutique o sesiones funcionales con confirmación instantánea, sin fricción de WhatsApp.",
    },
    {
      k: "03",
      t: "Tu ritual unificado",
      d: "Gestiona asistencias, membresías, racha de hábitos y tu plan nutricional consciente desde una sola experiencia privada.",
    },
  ];

  return (
    <section id="como-funciona" className="border-t border-[#24211D] bg-[#0A0909] scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-3">
          {items.map((i) => (
            <div key={i.k} className="border-t border-[#24211D] pt-6">
              <div className="text-[11px] font-mono tracking-[0.22em] text-[#C5BAA8] uppercase">{i.k}</div>
              <h3 className="mt-3 text-xl font-light tracking-tight text-[#F6F4EE]">{i.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#A39C91]">{i.d}</p>
            </div>
          ))}
        </div>

        {/* Blog Section */}
        <div id="blog" className="mt-32 scroll-mt-24">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C5BAA8] mb-2">
                Perspectivas & Ciencia
              </div>
              <h2 className="text-2xl font-light tracking-tight md:text-3xl text-[#F6F4EE]">
                Cultura de Bienestar & Longevidad
              </h2>
              <p className="mt-1.5 text-sm text-[#A39C91]">
                Artículos sobre movimiento inteligente, nutrición somática y recuperación.
              </p>
            </div>
            <Link
              to="/blog"
              className="hidden sm:inline-flex items-center text-xs font-semibold tracking-wider uppercase text-[#C5BAA8] hover:text-[#F6F4EE] transition"
            >
              Ver todos los artículos →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              to="/blog/$slug"
              params={{ slug: "el-auge-del-fitness-hibrido" }}
              className="group cursor-pointer space-y-3 p-3 rounded-2xl bg-[#141311] border border-[#24211D] hover:border-[#38332C] transition-all duration-300"
            >
              <div className="aspect-[16/9] overflow-hidden rounded-xl bg-[#1C1A17]">
                <img
                  src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  alt="Blog 1"
                />
              </div>
              <div className="p-1">
                <div className="text-[10px] uppercase tracking-wider font-semibold text-[#8C857B]">Tendencias · 4 min</div>
                <h3 className="mt-1 text-sm font-medium tracking-tight text-[#F6F4EE] group-hover:text-[#C5BAA8] transition-colors">
                  El auge del atleta híbrido y el entrenamiento consciente
                </h3>
              </div>
            </Link>
            <Link
              to="/blog/$slug"
              params={{ slug: "guia-nutricion-pre-entrenamiento" }}
              className="group cursor-pointer space-y-3 p-3 rounded-2xl bg-[#141311] border border-[#24211D] hover:border-[#38332C] transition-all duration-300 hidden sm:block"
            >
              <div className="aspect-[16/9] overflow-hidden rounded-xl bg-[#1C1A17]">
                <img
                  src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  alt="Blog 2"
                />
              </div>
              <div className="p-1">
                <div className="text-[10px] uppercase tracking-wider font-semibold text-[#8C857B]">Nutrición Somática · 5 min</div>
                <h3 className="mt-1 text-sm font-medium tracking-tight text-[#F6F4EE] group-hover:text-[#C5BAA8] transition-colors">
                  Combustible celular: Nutrición sin culpa ni pesadez
                </h3>
              </div>
            </Link>
            <Link
              to="/blog/$slug"
              params={{ slug: "crossfit-vs-funcional-diferencias" }}
              className="group cursor-pointer space-y-3 p-3 rounded-2xl bg-[#141311] border border-[#24211D] hover:border-[#38332C] transition-all duration-300 hidden lg:block"
            >
              <div className="aspect-[16/9] overflow-hidden rounded-xl bg-[#1C1A17]">
                <img
                  src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  alt="Blog 3"
                />
              </div>
              <div className="p-1">
                <div className="text-[10px] uppercase tracking-wider font-semibold text-[#8C857B]">
                  Longevidad · 6 min
                </div>
                <h3 className="mt-1 text-sm font-medium tracking-tight text-[#F6F4EE] group-hover:text-[#C5BAA8] transition-colors">
                  Movilidad y descompresión espinal en la vida moderna
                </h3>
              </div>
            </Link>
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Link
              to="/blog"
              className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-[#C5BAA8] hover:text-[#F6F4EE]"
            >
              Ver todos los artículos →
            </Link>
          </div>
        </div>

        {/* Para gimnasios / B2B */}
        <div
          id="para-gimnasios"
          className="mt-32 flex flex-col items-start justify-between gap-6 rounded-3xl border border-[#2B2723] bg-[#141311] p-8 md:flex-row md:items-center md:p-12 scroll-mt-24 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#38332C] bg-[#1C1A17] px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#C5BAA8] mb-3">
              Partners & Estudios
            </div>
            <h3 className="mt-2 max-w-xl text-2xl font-light tracking-tight text-[#F6F4EE] md:text-3xl">
              Lleva tu estudio o club al próximo nivel con The Wellness Face
            </h3>
            <p className="mt-2 max-w-xl text-sm text-[#A39C91] leading-relaxed">
              Presencia en nuestra red curada, reservas sin fricción para tus alumnos y software de gestión 100% gratuito.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              className="rounded-full border-[#38332C] bg-transparent text-[#E8E2D5] hover:bg-[#1E1C19] hover:text-[#F6F4EE] text-xs font-medium px-6 py-2.5"
            >
              Ver demo
            </Button>
            <Button
              className="rounded-full bg-[#E8E2D5] text-[#141312] hover:bg-[#F6F4EE] text-xs font-medium px-6 py-2.5 transition-all shadow-md"
            >
              Sumar mi centro gratis
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
