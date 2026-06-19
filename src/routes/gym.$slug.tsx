import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Star, Clock, ArrowLeft, Check, Users } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getGym, type Gym } from "@/lib/gyms";

export const Route = createFileRoute("/gym/$slug")({
  loader: ({ params }) => {
    const gym = getGym(params.slug);
    if (!gym) throw notFound();
    return { gym };
  },
  head: ({ loaderData }) => {
    const g = loaderData?.gym;
    const title = g ? `${g.name} — Shakerfy` : "Gimnasio — Shakerfy";
    const desc = g?.description ?? "Perfil de gimnasio en Shakerfy.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        ...(g?.images[0] ? [{ property: "og:image", content: g.images[0] }] : []),
      ],
    };
  },
  component: GymPage,
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Gimnasio no encontrado</h1>
        <Link to="/" className="mt-3 inline-block text-sm text-muted-foreground underline">Volver al inicio</Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <h1 className="text-xl font-semibold">No pudimos cargar el gimnasio</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      </div>
    </div>
  ),
});

const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function GymPage() {
  const { gym } = Route.useLoaderData() as { gym: Gym };
  const [active, setActive] = useState(0);
  const [day, setDay] = useState<number>(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);

  const classesByDay = useMemo(
    () => gym.classes.filter((c) => c.day === day).sort((a, b) => a.time.localeCompare(b.time)),
    [gym, day],
  );

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Volver al buscador
        </Link>

        {/* Carousel */}
        <div className="mt-5 grid gap-3 md:grid-cols-4 md:grid-rows-2">
          <div className="relative col-span-1 row-span-2 aspect-[4/3] overflow-hidden rounded-2xl bg-muted md:col-span-2 md:aspect-auto">
            <img src={gym.images[active]} alt={gym.name} className="h-full w-full object-cover transition-opacity duration-500" />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
              <button
                onClick={() => setActive((v) => (v - 1 + gym.images.length) % gym.images.length)}
                className="grid h-9 w-9 place-items-center rounded-full bg-background/90 backdrop-blur transition hover:bg-background"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setActive((v) => (v + 1) % gym.images.length)}
                className="grid h-9 w-9 place-items-center rounded-full bg-background/90 backdrop-blur transition hover:bg-background"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          {gym.images.slice(0, 4).map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActive(i)}
              className={`relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted transition ${
                active === i ? "ring-2 ring-foreground" : "hover:opacity-90"
              }`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>

        {/* Header info */}
        <div className="mt-10 grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex flex-wrap items-center gap-2">
              {gym.tags.map((t) => (
                <Badge key={t} variant="secondary" className="rounded-full">{t}</Badge>
              ))}
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{gym.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Star className="h-3.5 w-3.5 fill-foreground text-foreground" /> {gym.rating.toFixed(1)} <span className="text-muted-foreground">({gym.reviews})</span></span>
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {gym.address}</span>
              <span className="inline-flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${gym.isOpen ? "bg-emerald-500" : "bg-muted-foreground"}`} />
                {gym.isOpen ? "Abierto ahora" : "Cerrado"} · <Clock className="h-3.5 w-3.5" /> {gym.hours}
              </span>
            </div>
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">{gym.description}</p>
          </div>

          <aside className="lg:col-span-1">
            <div className="rounded-2xl border border-border bg-secondary p-6">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Desde</div>
              <div className="mt-1 text-3xl font-semibold tracking-tight">
                ${gym.priceFrom.toLocaleString("es-AR")}
                <span className="text-sm font-normal text-muted-foreground"> / mes</span>
              </div>
              <Button className="mt-5 w-full rounded-full">Reservar clase de prueba</Button>
              <Button variant="outline" className="mt-2 w-full rounded-full">Contactar al gimnasio</Button>
              <div className="mt-5 border-t border-border pt-4 text-xs text-muted-foreground">
                Cancelación gratis hasta 4 horas antes de la clase.
              </div>
            </div>
          </aside>
        </div>

        {/* Memberships */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold tracking-tight">Membresías y planes</h2>
          <p className="mt-1 text-sm text-muted-foreground">Elegí el plan que mejor se adapta a tu ritmo.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {gym.memberships.map((m, idx) => (
              <div
                key={m.name}
                className={`rounded-2xl border p-6 transition ${
                  idx === 1 ? "border-foreground bg-foreground text-background" : "border-border bg-background hover:border-foreground/40"
                }`}
              >
                <div className="flex items-baseline justify-between">
                  <div className="text-base font-semibold tracking-tight">{m.name}</div>
                  <div className={`text-xs ${idx === 1 ? "text-background/70" : "text-muted-foreground"}`}>{m.duration}</div>
                </div>
                <div className="mt-4 text-3xl font-semibold tracking-tight">
                  ${m.price.toLocaleString("es-AR")}
                </div>
                <ul className="mt-5 space-y-2 text-sm">
                  {m.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <Check className={`mt-0.5 h-4 w-4 ${idx === 1 ? "text-background" : "text-foreground"}`} />
                      <span className={idx === 1 ? "text-background/90" : "text-muted-foreground"}>{b}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant={idx === 1 ? "secondary" : "outline"}
                  className="mt-6 w-full rounded-full"
                >
                  Elegir plan
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Classes calendar */}
        <section className="mt-16">
          <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Clases de la semana</h2>
              <p className="mt-1 text-sm text-muted-foreground">Filtrá por día y reservá tu lugar.</p>
            </div>
            <div className="flex gap-1.5 overflow-x-auto">
              {DAYS.map((d, i) => (
                <button
                  key={d}
                  onClick={() => setDay(i)}
                  className={`min-w-[64px] rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    day === i
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-border">
            {classesByDay.length === 0 ? (
              <div className="p-10 text-center text-sm text-muted-foreground">No hay clases programadas este día.</div>
            ) : (
              <ul className="divide-y divide-border">
                {classesByDay.map((c, i) => {
                  const available = c.capacity - c.booked;
                  return (
                    <li key={i} className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-5">
                        <div className="w-16 text-sm font-semibold tabular-nums">{c.time}</div>
                        <div>
                          <div className="text-[15px] font-semibold tracking-tight">{c.name}</div>
                          <div className="text-xs text-muted-foreground">{c.instructor} · {c.duration} min</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Users className="h-3.5 w-3.5" />
                          {available > 0 ? `${available} lugares` : "Completa"}
                        </div>
                        <Button
                          size="sm"
                          variant={available > 0 ? "default" : "outline"}
                          disabled={available === 0}
                          className="rounded-full"
                        >
                          {available > 0 ? "Reservar" : "Lista de espera"}
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
      </div>
      <SiteFooter />
    </div>
  );
}