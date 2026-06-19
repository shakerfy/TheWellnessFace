import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, Plus, Mic, ArrowUp, Star, MapPin, Sparkles } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Typewriter } from "@/components/typewriter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GYMS } from "@/lib/gyms";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shakerfy — Encuentra tu gimnasio con IA" },
      { name: "description", content: "Buscador con IA de gimnasios, fitness centers y studios. Reserva clases y gestiona tu membresía." },
      { property: "og:title", content: "Shakerfy — Encuentra tu gimnasio con IA" },
      { property: "og:description", content: "Buscador con IA de gimnasios, fitness centers y studios." },
    ],
  }),
  component: Index,
});

const CATEGORIES = ["Todos", "CrossFit", "Yoga", "Pilates", "Funcional", "Spinning", "Powerlifting", "Boutique"];

function Index() {
  const [category, setCategory] = useState("Todos");
  const gyms = category === "Todos" ? GYMS : GYMS.filter((g) => g.tags.some((t) => t.toLowerCase().includes(category.toLowerCase())));

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <Hero />
      <section id="descubrir" className="mx-auto max-w-7xl px-6 pb-24">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Gimnasios cerca de ti</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Curados por nuestra IA según ubicación, disciplina y presupuesto.
            </p>
          </div>
          <div className="-mx-6 flex w-screen gap-2 overflow-x-auto px-6 md:mx-0 md:w-auto md:overflow-visible">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                  category === c
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {gyms.map((g, idx) => (
            <Link
              key={g.slug}
              to="/gym/$slug"
              params={{ slug: g.slug }}
              className="group block animate-fade-up"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
                <img
                  src={g.images[0]}
                  alt={g.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-medium backdrop-blur">
                  <span className={`h-1.5 w-1.5 rounded-full ${g.isOpen ? "bg-emerald-500" : "bg-muted-foreground"}`} />
                  {g.isOpen ? "Abierto ahora" : "Cerrado"}
                </div>
              </div>
              <div className="mt-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-[15px] font-semibold tracking-tight">{g.name}</div>
                  <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {g.neighborhood}, {g.city}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-medium">
                  <Star className="h-3.5 w-3.5 fill-foreground" />
                  {g.rating.toFixed(1)}
                </div>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{g.tags.slice(0, 2).join(" · ")}</div>
              <div className="mt-1 text-sm">
                <span className="font-semibold text-foreground">${g.priceFrom.toLocaleString("es-AR")}</span>
                <span className="text-muted-foreground"> / mes desde</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <ValueSection />
      <SiteFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[-10%] -z-10 mx-auto h-[520px] max-w-5xl rounded-[100%] bg-secondary blur-3xl opacity-70" />
      <div className="mx-auto flex max-w-5xl flex-col items-center px-6 pb-24 pt-20 text-center md:pt-28">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" />
          Buscador inteligente · powered by AI
        </div>
        <h1 className="mt-6 max-w-3xl text-balance text-5xl font-semibold tracking-tight md:text-6xl lg:text-7xl">
          Encuentra tu próximo gimnasio<br className="hidden md:block" /> con una sola frase
        </h1>
        <p className="mt-5 max-w-xl text-balance text-base text-muted-foreground md:text-lg">
          Shakerfy busca, compara y reserva en cientos de gimnasios, fitness centers y studios. Habla en lenguaje natural.
        </p>

        <PromptBox />

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
          <span>Sugerencias:</span>
          {[
            "CrossFit en Palermo bajo $25.000",
            "Yoga matutino cerca de casa",
            "Estudio de pilates con primera clase gratis",
          ].map((s) => (
            <span key={s} className="rounded-full border border-border bg-background px-3 py-1">
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function PromptBox() {
  return (
    <div className="mt-10 w-full max-w-2xl">
      <div className="rounded-3xl border border-border bg-secondary p-5 text-left shadow-[0_24px_60px_-24px_rgba(0,0,0,0.18)]">
        <div className="min-h-[64px] text-[15px] leading-relaxed text-muted-foreground">
          <Typewriter
            phrases={[
              "Quiero un gimnasio con sala de musculación cerca de Palermo bajo $20.000…",
              "Buscame clases de yoga matutino en Recoleta…",
              "Necesito un box de CrossFit con WOD a las 19hs…",
              "Pilates reformer con grupos chicos en Villa Crespo…",
            ]}
          />
        </div>
        <div className="mt-4 flex items-center justify-between">
          <button className="grid h-9 w-9 place-items-center rounded-full border border-border bg-background text-muted-foreground transition hover:text-foreground">
            <Plus className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2">
            <button className="hidden items-center gap-1 rounded-full px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground sm:inline-flex">
              Crear <ArrowUpRight className="h-3 w-3" />
            </button>
            <button className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition hover:text-foreground">
              <Mic className="h-4 w-4" />
            </button>
            <Button size="icon" className="h-9 w-9 rounded-full">
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ValueSection() {
  const items = [
    { k: "01", t: "Búsqueda con IA", d: "Describe lo que querés en lenguaje natural y nuestra IA filtra por ubicación, presupuesto, disciplina y horarios." },
    { k: "02", t: "Reserva sin fricción", d: "Bookings de clases y pases de prueba con confirmación instantánea, sin llamados ni formularios." },
    { k: "03", t: "Gestión para gimnasios", d: "Panel para administrar membresías, clases, pagos y asistencias en un solo lugar." },
  ];
  return (
    <section id="para-gimnasios" className="border-t border-border bg-secondary/40">
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
        <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-3xl border border-border bg-background p-8 md:flex-row md:items-center md:p-12">
          <div>
            <Badge variant="secondary" className="rounded-full">Para gimnasios</Badge>
            <h3 className="mt-3 max-w-xl text-2xl font-semibold tracking-tight md:text-3xl">
              Llevá tu estudio o gimnasio al próximo nivel con Shakerfy.
            </h3>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Aparecé en miles de búsquedas, gestioná membresías y digitalizá tus clases.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-full">Ver demo</Button>
            <Button className="rounded-full">Sumar mi gimnasio</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
