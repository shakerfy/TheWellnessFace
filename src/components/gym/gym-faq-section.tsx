import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { type Gym } from "@/lib/gyms";

interface GymFAQSectionProps {
  gym: Gym;
}

export function GymFAQSection({ gym }: GymFAQSectionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs = [
    {
      q: "¿Cómo reservo una clase de prueba o pase diario?",
      a: `Puedes reservar directamente presionando el botón 'Reservar clase de prueba'. Completas tus datos en 30 segundos, eliges el día y horario, y recibirás la confirmación inmediata. Si es tu primera vez en ${gym.name}, ¡la clase de prueba es gratuita!`,
    },
    {
      q: "¿Cuál es la política de cancelación de clases?",
      a: "Puedes cancelar cualquier clase reservada sin penalización hasta 4 horas antes del horario de inicio directamente desde tu panel de usuario. Si cancelas fuera de término, el crédito no será reembolsado.",
    },
    {
      q: "¿Qué necesito presentar para ingresar el primer día?",
      a: `${gym.requirements?.join(" y ") || "Apto médico físico y toalla personal"}. Además, deberás presentar el código QR que se genera en tu cuenta desde la app de Shakerfy al ingresar al centro.`,
    },
    {
      q: "¿Cómo funcionan las membresías y la renovación?",
      a: "Nuestras membresías se facturan mensualmente de forma automática. No tienen contratos de permanencia mínima, por lo que puedes pausar, cambiar de plan o cancelar tu suscripción en cualquier momento sin cargos adicionales.",
    },
    {
      q: "¿Puedo congelar mi membresía por viaje o enfermedad?",
      a: `Sí. Según el plan que elijas, cuentas con días de congelamiento (por ejemplo, 7, 15 o 30 días anuales). Puedes solicitar el congelamiento desde tu panel de usuario antes de la fecha en que dejes de asistir.`,
    },
    {
      q: "¿El acceso a las sedes y vestuarios está incluido?",
      a: `¡Sí! Todas las membresías contratadas en ${gym.name} incluyen el uso libre de los vestuarios, duchas con agua caliente, lockers de seguridad (debes traer tu propio candado) y WiFi de alta velocidad.`,
    },
  ];

  return (
    <section className="mt-16 border-t border-border pt-16">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Preguntas Frecuentes</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Despeja tus dudas sobre el funcionamiento de {gym.name}, reservas y membresías.
        </p>
      </div>

      <div className="space-y-4 max-w-3xl mx-auto">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                isOpen
                  ? "border-foreground bg-card"
                  : "border-border bg-card hover:border-foreground/30"
              }`}
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="flex w-full items-center justify-between p-5 text-left font-medium text-sm text-foreground hover:bg-secondary/45 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`transition-all duration-200 ease-in-out overflow-hidden ${
                  isOpen ? "max-h-[200px] border-t border-border p-5 bg-secondary/15" : "max-h-0"
                }`}
              >
                <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
