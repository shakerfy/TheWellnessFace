import React from "react";

export function LandingStats() {
  const stats = [
    { value: "150+", label: "Gimnasios y Studios", desc: "Curados y verificados" },
    { value: "25.000+", label: "Reservas exitosas", desc: "Clases y pases diarios" },
    { value: "4.9 ★", label: "Calificación promedio", desc: "Por miles de alumnos" },
    { value: "98%", label: "Satisfacción", desc: "En soporte y reservas" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-12 border-b border-border/60">
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {stats.map((s, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center text-center p-4 rounded-2xl bg-secondary/20 border border-border/40"
          >
            <span className="text-3xl font-bold tracking-tight text-foreground">{s.value}</span>
            <span className="mt-2 text-sm font-semibold text-foreground/90">{s.label}</span>
            <span className="mt-1 text-xs text-muted-foreground">{s.desc}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
