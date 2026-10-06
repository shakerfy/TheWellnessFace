import React from "react";
import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";

export function LandingCTASection() {
  return (
    <section className="relative overflow-hidden bg-[#0A0909] text-[#F6F4EE] border-t border-[#24211D]">
      {/* Background radial effects */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -left-[10%] -top-[20%] h-[350px] w-[350px] rounded-full bg-[#C5BAA8]/15 blur-[100px]" />
        <div className="absolute -right-[10%] -bottom-[20%] h-[350px] w-[350px] rounded-full bg-[#C5BAA8]/15 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-20 text-center sm:py-24">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#38332C] bg-[#1C1A17] px-4 py-1.5 text-[10px] uppercase tracking-[0.22em] font-semibold text-[#C5BAA8] mb-6 backdrop-blur-md">
          Tu Próximo Hábito Empieza Hoy
        </div>
        <h2 className="text-balance text-3xl font-light tracking-tight text-[#F6F4EE] sm:text-4xl md:text-5xl">
          Elige cómo quieres moverte y recuperarte
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-balance text-sm sm:text-base text-[#A39C91] leading-relaxed">
          Crea tu cuenta de alumno, explora más de 150 estudios curados y reserva sesiones o pases de prueba en segundos. Sin contratos forzados.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/auth"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-[#E8E2D5] px-8 py-3.5 text-sm font-medium text-[#141312] transition hover:bg-[#F6F4EE] shadow-lg"
          >
            Comenzar gratis
          </Link>
          <a
            href="#descubrir"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-[#38332C] px-8 py-3.5 text-sm font-medium text-[#F6F4EE] transition hover:bg-[#1E1C19]"
          >
            Explorar espacios
          </a>
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-[#7D766D]">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C5BAA8]" /> Registro en 30 segundos
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C5BAA8]" /> Sin cuotas de intermediación
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C5BAA8]" /> Cancelación flexible
          </div>
        </div>
      </div>
    </section>
  );
}
