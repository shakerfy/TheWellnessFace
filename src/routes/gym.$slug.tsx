import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Star, Clock, ArrowLeft, Check, Users, Eye, X, FileText } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Button, buttonVariants } from "@/components/ui/button";
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
const WEEKDAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const HOURS = ["07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21"];

function GymPage() {
  const { gym } = Route.useLoaderData() as { gym: Gym };
  const [active, setActive] = useState(0);
  const [day, setDay] = useState<number>(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
  const [activeCertificationsViewer, setActiveCertificationsViewer] = useState<string[] | null>(null);
  const [hoursOpen, setHoursOpen] = useState(false);

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
              <button 
                onClick={() => setHoursOpen(!hoursOpen)}
                className="inline-flex items-center gap-1.5 hover:text-foreground transition focus:outline-none"
              >
                <span className={`h-1.5 w-1.5 rounded-full ${gym.isOpen ? "bg-emerald-500" : "bg-muted-foreground"}`} />
                {gym.isOpen ? "Abierto ahora" : "Cerrado"} · <Clock className="h-3.5 w-3.5" /> Ver horarios semanales
              </button>
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-primary" />
                <span>Aforo: <strong className="text-foreground font-semibold">42 / 80</strong> <span className="text-xs text-muted-foreground">(52%)</span></span>
              </span>
            </div>

            {/* Collapsible Weekly Hours */}
            {hoursOpen && (
              <div className="mt-4 border border-border bg-card p-4 rounded-2xl max-w-sm text-xs space-y-1.5 shadow-sm animate-fade-down">
                <div className="font-bold text-foreground pb-1.5 border-b border-border flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-primary" /> Detalle de Horarios Semanales
                </div>
                {gym.weeklyHours ? gym.weeklyHours.map((wh) => (
                  <div key={wh.day} className="flex justify-between py-0.5">
                    <span className="font-semibold text-foreground">{wh.day}:</span>
                    <span className="text-muted-foreground">
                      {wh.intervals && wh.intervals.length > 0 
                        ? wh.intervals.map(i => `${i.from} - ${i.to}`).join(" y ") 
                        : "Cerrado"}
                    </span>
                  </div>
                )) : (
                  <div className="flex justify-between py-0.5">
                    <span className="font-semibold text-foreground">Todos los días:</span>
                    <span className="text-muted-foreground">{gym.hours}</span>
                  </div>
                )}
              </div>
            )}
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">{gym.description}</p>

            {gym.requirements && gym.requirements.length > 0 && (
              <div className="mt-6">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Normas de ingreso:</span>
                <div className="flex flex-wrap gap-2">
                  {gym.requirements.map((req) => (
                    <span key={req} className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 px-3 py-1 text-xs text-amber-500 font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      {req}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="lg:col-span-1">
            <div className="rounded-2xl border border-border bg-secondary p-6">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Desde</div>
              <div className="mt-1 text-3xl font-semibold tracking-tight">
                ${gym.priceFrom.toLocaleString("es-AR")}
                <span className="text-sm font-normal text-muted-foreground"> / mes</span>
              </div>
              <Link to="/auth" className={buttonVariants({ className: "mt-5 w-full rounded-full" })}>
                Reservar clase de prueba
              </Link>
              <Button variant="outline" className="mt-2 w-full rounded-full">Contactar al gimnasio</Button>
              <div className="mt-5 border-t border-border pt-4 text-xs text-muted-foreground">
                Cancelación gratis hasta 4 horas antes de la clase.
              </div>
            </div>
          </aside>
        </div>

        {/* Horarios Populares / Concurrencia en Tiempo Real */}
        {gym.occupancyData && (
          <section className="mt-16 rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Horarios Populares</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Visitas estimadas basadas en la concurrencia histórica de los alumnos.</p>
              </div>
              
              {/* Day selection pills synced with classes calendar */}
              <div className="flex gap-1 overflow-x-auto pb-1">
                {WEEKDAYS.map((d, idx) => (
                  <button
                    key={d}
                    onClick={() => setDay(idx)}
                    className={`px-3.5 py-1 rounded-full text-xs font-semibold border transition ${
                      day === idx
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                    }`}
                  >
                    {d.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {/* CSS Bar Chart */}
            <div className="mt-8">
              <div className="flex items-end justify-between h-28 gap-1.5 sm:gap-2.5 px-2 border-b border-border/85 pb-1">
                {HOURS.map((hour, idx) => {
                  const percent = gym.occupancyData?.[WEEKDAYS[day]]?.[idx] || 0;
                  const isToday = day === (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
                  const isCurrentHour = isToday && parseInt(hour) === new Date().getHours();
                  
                  return (
                    <div key={hour} className="flex flex-col items-center gap-1.5 flex-1 group relative">
                      {/* Tooltip on hover */}
                      <span className="absolute -top-7 scale-0 group-hover:scale-100 transition-all bg-foreground text-background text-[10px] font-bold px-2 py-0.5 rounded shadow z-10 whitespace-nowrap">
                        {percent}% concurrencia
                      </span>
                      
                      {/* Bar */}
                      <div 
                        className={`w-full rounded-t-sm transition-all duration-300 ${
                          isCurrentHour
                            ? "bg-primary animate-pulse"
                            : "bg-muted-foreground/35 group-hover:bg-muted-foreground/50"
                        }`}
                        style={{ height: `${percent}%` }}
                      />
                      
                      {/* Label for hours (show every 2 hours or in desktop) */}
                      <span className="text-[10px] font-mono text-muted-foreground tracking-tighter mt-1">
                        {hour === "07" || hour === "11" || hour === "15" || hour === "18" || hour === "21" ? `${hour}h` : ""}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Concurrency Analysis Legend */}
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-muted-foreground gap-2">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                  <span>Hora actual (Tiempo Real)</span>
                  <div className="h-2.5 w-2.5 rounded bg-muted-foreground/35 ml-3" />
                  <span>Promedio histórico</span>
                </div>
                
                <span className="font-semibold text-foreground">
                  {(() => {
                    const currentHourInt = new Date().getHours();
                    const hourIndex = HOURS.indexOf(currentHourInt.toString().padStart(2, "0"));
                    const activePercent = gym.occupancyData?.[WEEKDAYS[day]]?.[hourIndex] || 0;
                    
                    if (activePercent === 0) return "Cerrado a esta hora";
                    if (activePercent < 35) return "Suele estar poco concurrido a esta hora.";
                    if (activePercent < 75) return "Suele estar moderadamente concurrido.";
                    return "Suele estar muy concurrido (Hora Pico).";
                  })()}
                </span>
              </div>
            </div>
          </section>
        )}

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

        {/* Staff / Equipo */}
        {gym.staff && gym.staff.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-semibold tracking-tight">Nuestro Staff</h2>
            <p className="mt-1 text-sm text-muted-foreground">Entrenadores certificados listos para guiar tu entrenamiento.</p>
            <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {gym.staff.map((coach) => (
                <div key={coach.id} className="rounded-2xl border border-border bg-card p-4 flex flex-col justify-between hover:border-foreground/20 transition min-h-[140px]">
                  <div className="flex items-center gap-4">
                    <img src={coach.photo} alt={coach.name} className="h-14 w-14 rounded-full object-cover border border-border shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-foreground">{coach.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{coach.specialty}</div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {coach.certifications.map((c) => (
                          <span key={c} className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {coach.certificationImages && coach.certificationImages.length > 0 && (
                    <button 
                      onClick={() => setActiveCertificationsViewer(coach.certificationImages || [])}
                      className="mt-3 text-[10px] font-bold text-primary hover:underline flex items-center gap-1 self-start"
                    >
                      <Eye className="h-3 w-3" /> Ver Certificados ({coach.certificationImages.length})
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

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
      {/* Diplomas Viewer Modal */}
      {activeCertificationsViewer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-fade-in">
          <div className="relative bg-card border border-border w-full max-w-[600px] rounded-3xl p-6 shadow-2xl flex flex-col text-foreground">
            <button 
              onClick={() => setActiveCertificationsViewer(null)}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-secondary transition z-10"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold tracking-tight mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" /> Diplomas y Certificaciones
            </h3>

            <div className="grid gap-3 grid-cols-2 overflow-y-auto max-h-[400px]">
              {activeCertificationsViewer.map((url, index) => (
                <div key={index} className="border border-border rounded-xl overflow-hidden aspect-video bg-muted relative group">
                  <img src={url} alt={`Diploma ${index}`} className="h-full w-full object-cover" />
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition text-white text-xs font-bold gap-1"
                  >
                    <Eye className="h-4 w-4" /> Ver pantalla completa
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      </div>
      <SiteFooter />
    </div>
  );
}