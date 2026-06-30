import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, Plus, Mic, ArrowUp, Star, MapPin, Sparkles, ChevronDown } from "lucide-react";
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
    <section className="relative overflow-hidden pb-24 pt-24 md:pb-36 md:pt-32">
      {/* Pastel Floating Orbs Background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Orb 1: Red/Pink (Top Right) */}
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#FF3B5C]/45 blur-[50px]" />
        
        {/* Orb 2: Green (Center Left) */}
        <div className="absolute -left-24 top-[35%] h-96 w-96 rounded-full bg-[#A3E635]/55 blur-[50px]" />
        
        {/* Orb 3: Cyan/Blue (Bottom Right) */}
        <div className="absolute bottom-[-60px] right-[10%] h-96 w-96 rounded-full bg-[#00D2FF]/45 blur-[60px]" />
        
        {/* Smooth fade to background color at the bottom edge */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-[42px] lg:text-[46px]">
          Encuentra donde entrenar como te lo imaginas
        </h1>
        <p className="mt-4 max-w-2xl text-balance text-[14px] text-muted-foreground/85 sm:text-[15px] md:text-[16px] lg:whitespace-nowrap">
          Busca, compara y reserva en los mejores gimnasios, fitness centers y studios con IA.
        </p>

        <PromptBox />
      </div>
    </section>
  );
}

function PromptBox() {
  return (
    <div className="mt-10 w-full max-w-2xl px-2">
      <div className="rounded-3xl border border-border/80 bg-background p-5 text-left shadow-[0_20px_50px_-20px_rgba(0,0,0,0.12)] transition-shadow hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.16)]">
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
        <div className="mt-4 flex items-center justify-end gap-3 pt-2">
          <button className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition hover:text-foreground">
            <Mic className="h-4 w-4" />
          </button>
          <Button size="icon" className="h-8 w-8 rounded-full bg-foreground text-background hover:bg-foreground/90">
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function ValueSection() {
  const items = [
    { k: "01", t: "Búsqueda con IA", d: "Describe lo que querés en lenguaje natural y nuestra IA filtra por ubicación, presupuesto, disciplina y horarios." },
    { k: "02", t: "Reserva sin fricción", d: "Bookings de clases y pases de prueba con confirmación instantánea, sin llamados ni formularios." },
    { k: "03", t: "Control de tu rutina", d: "Administra tus membresías, historial de clases y pagos desde un panel centralizado para ti." },
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
          <div className="mb-10">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Blog & Novedades</h2>
            <p className="mt-2 text-sm text-muted-foreground">Últimas tendencias, consejos y noticias del mundo fitness.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="group cursor-pointer space-y-3">
              <div className="aspect-[16/9] overflow-hidden rounded-2xl bg-muted">
                <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" alt="Blog 1" />
              </div>
              <div>
                <div className="text-xs font-medium text-muted-foreground">Tendencias · 3 min</div>
                <h3 className="mt-1 font-semibold tracking-tight group-hover:underline">El auge del fitness híbrido</h3>
              </div>
            </div>
            <div className="group cursor-pointer space-y-3 hidden sm:block">
              <div className="aspect-[16/9] overflow-hidden rounded-2xl bg-muted">
                <img src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" alt="Blog 2" />
              </div>
              <div>
                <div className="text-xs font-medium text-muted-foreground">Nutrición · 5 min</div>
                <h3 className="mt-1 font-semibold tracking-tight group-hover:underline">Alimentación pre-entrenamiento</h3>
              </div>
            </div>
            <div className="group cursor-pointer space-y-3 hidden lg:block">
              <div className="aspect-[16/9] overflow-hidden rounded-2xl bg-muted">
                <img src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" alt="Blog 3" />
              </div>
              <div>
                <div className="text-xs font-medium text-muted-foreground">Entrenamiento · 4 min</div>
                <h3 className="mt-1 font-semibold tracking-tight group-hover:underline">CrossFit vs Funcional: ¿Cuál elegir?</h3>
              </div>
            </div>
          </div>
        </div>

        <div id="para-gimnasios" className="mt-32 flex flex-col items-start justify-between gap-6 rounded-3xl border border-border bg-background p-8 md:flex-row md:items-center md:p-12 scroll-mt-24">
          <div>
            <Badge variant="secondary" className="rounded-full">Para partners</Badge>
            <h3 className="mt-3 max-w-xl text-2xl font-semibold tracking-tight md:text-3xl">
              Llevá tu Centro al próximo nivel con Shakerfy.
            </h3>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Aparecé en miles de búsquedas, gestioná membresías y digitalizá tus clases.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-full">Ver demo</Button>
            <Button className="rounded-full">Sumar mi centro</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
