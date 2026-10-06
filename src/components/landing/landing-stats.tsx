import React from "react";

export function LandingStats() {
  const stats = [
    { value: "150+", label: "Estudios & Clubs", desc: "Curados y verificados" },
    { value: "25.000+", label: "Sesiones completadas", desc: "Movimiento y calma" },
    { value: "4.9 ★", label: "Calificación promedio", desc: "Comunidad activa" },
    { value: "98%", label: "Adherencia & Hábito", desc: "Sin culpa ni frustración" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-12 border-b border-[#24211D] bg-[#0E0D0C]">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 sm:gap-6">
        {stats.map((s, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center text-center p-5 rounded-2xl bg-[#141311] border border-[#24211D] hover:border-[#38332C] transition-colors"
          >
            <span className="text-2xl sm:text-3xl font-light tracking-tight text-[#F6F4EE]">{s.value}</span>
            <span className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C5BAA8]">{s.label}</span>
            <span className="mt-1 text-xs text-[#7D766D]">{s.desc}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
