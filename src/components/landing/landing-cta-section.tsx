import React from "react";
import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";

export function LandingCTASection() {
  return (
    <section className="relative overflow-hidden bg-foreground text-background border-t border-border">
      {/* Background radial effects */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -left-[10%] -top-[20%] h-[350px] w-[350px] rounded-full bg-[#C9B89F]/25 blur-[80px]" />
        <div className="absolute -right-[10%] -bottom-[20%] h-[350px] w-[350px] rounded-full bg-[#C9B89F]/25 blur-[80px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-20 text-center sm:py-24">
        <Badge className="bg-background/10 text-background hover:bg-background/20 border-none rounded-full px-3 py-1 text-xs mb-6 backdrop-blur">
          Únete hoy gratis
        </Badge>
        <h2 className="text-balance text-3xl font-bold tracking-tight text-background sm:text-4xl md:text-5xl">
          Tu próximo entrenamiento empieza con The Wellness Face
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-balance text-sm sm:text-base text-background/80">
          Crea tu cuenta de alumno, explora más de 150 gimnasios calificados y reserva clases o
          pases en segundos. Sin contratos a largo plazo.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/auth"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-background px-8 py-3 text-sm font-semibold text-foreground transition hover:bg-background/90"
          >
            Comenzar gratis
          </Link>
          <a
            href="#descubrir"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-background/20 px-8 py-3 text-sm font-semibold text-background transition hover:bg-background/10 hover:border-background/40"
          >
            Explorar gimnasios
          </a>
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-background/60">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Registro en 30 segundos
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Cancelación flexible
          </div>
        </div>
      </div>
    </section>
  );
}
