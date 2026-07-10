import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronDown, MapPin, Star, Clock, ArrowLeft, Check, Users, Eye, X, FileText, Wifi, Car, Coffee, Flame, Lock, Bath, HelpCircle, Navigation, Map, Bike, Droplet, ShoppingBag, Instagram, Sparkles, Heart, Search } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.709 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
);

function getAmenityIcon(name: string) {
  const lowercase = name.toLowerCase();
  if (lowercase.includes("wifi")) return Wifi;
  if (lowercase.includes("estacionamiento") || lowercase.includes("parking")) return Car;
  if (lowercase.includes("cafeteria") || lowercase.includes("bar") || lowercase.includes("café")) return Coffee;
  if (lowercase.includes("sauna")) return Flame;
  if (lowercase.includes("ducha") || lowercase.includes("vestuario") || lowercase.includes("baño")) return Bath;
  if (lowercase.includes("locker") || lowercase.includes("seguridad")) return Lock;
  if (lowercase.includes("bicicletero") || lowercase.includes("bici")) return Bike;
  if (lowercase.includes("agua") || lowercase.includes("bebedero") || lowercase.includes("dispensador")) return Droplet;
  if (lowercase.includes("suplemento") || lowercase.includes("bebida") || lowercase.includes("tienda")) return ShoppingBag;
  return HelpCircle;
}

function GymPage() {
  const { gym } = Route.useLoaderData() as { gym: Gym };
  const [active, setActive] = useState(0);
  const [day, setDay] = useState<number>(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
  const [activeCertificationsViewer, setActiveCertificationsViewer] = useState<string[] | null>(null);
  const [hoursOpen, setHoursOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("shakerfy_favorites");
    if (saved) {
      try {
        const list = JSON.parse(saved);
        setIsFavorite(list.includes(gym.slug));
      } catch (e) {}
    }
  }, [gym.slug]);

  const toggleFavorite = () => {
    const saved = localStorage.getItem("shakerfy_favorites");
    let list: string[] = [];
    if (saved) {
      try {
        list = JSON.parse(saved);
      } catch (e) {}
    }
    const next = list.includes(gym.slug)
      ? list.filter((s: string) => s !== gym.slug)
      : [...list, gym.slug];
    setIsFavorite(next.includes(gym.slug));
    localStorage.setItem("shakerfy_favorites", JSON.stringify(next));
  };

  const [membershipFilter, setMembershipFilter] = useState("Todos");
  const [accessHoursFilter, setAccessHoursFilter] = useState("Todos");
  const [passTypeFilter, setPassTypeFilter] = useState("Todos");
  const [coverageFilter, setCoverageFilter] = useState("Todos");
  const [disciplineFilter, setDisciplineFilter] = useState("Todos");
  const [selectedBranchId, setSelectedBranchId] = useState("matriz");

  const activeBranch = useMemo(() => {
    return gym.branches?.find(b => b.id === selectedBranchId);
  }, [gym.branches, selectedBranchId]);

  const activeAddress = activeBranch ? activeBranch.address : gym.address;

  const membershipTags = useMemo(() => {
    const tagsSet = new Set<string>();
    gym.memberships.forEach(m => {
      if (m.tag) tagsSet.add(m.tag);
    });
    return ["Todos", ...Array.from(tagsSet)];
  }, [gym.memberships]);

  const filteredMemberships = useMemo(() => {
    return gym.memberships.filter(m => {
      const matchesTag = membershipFilter === "Todos" || m.tag === membershipFilter;
      
      const matchesHours = accessHoursFilter === "Todos" || 
        (accessHoursFilter === "Full-Time" && m.accessHoursType === "Full-Time") ||
        (accessHoursFilter === "Off-Peak" && m.accessHoursType === "Off-Peak");
      
      const matchesPass = passTypeFilter === "Todos" ||
        (passTypeFilter === "Ilimitado" && m.passType === "Pase Libre") ||
        (passTypeFilter === "Creditos" && m.passType === "Por Créditos");
        
      const matchesCoverage = coverageFilter === "Todos" ||
        (coverageFilter === "Multisede" && m.isMultisede);

      return matchesTag && matchesHours && matchesPass && matchesCoverage;
    });
  }, [gym.memberships, membershipFilter, accessHoursFilter, passTypeFilter, coverageFilter]);

  const disciplines = useMemo(() => {
    const discSet = new Set<string>();
    gym.classes.forEach(c => {
      discSet.add(c.name);
    });
    return ["Todos", ...Array.from(discSet)];
  }, [gym.classes]);

  const classesByBranchAndDay = useMemo(() => {
    let list = gym.classes;
    if (selectedBranchId === "matriz") {
      list = list.filter(c => !c.branchId);
    } else {
      list = list.filter(c => c.branchId === selectedBranchId);
    }
    list = list.filter((c) => c.day === day);
    if (disciplineFilter !== "Todos") {
      list = list.filter(c => c.name === disciplineFilter);
    }
    return list.sort((a, b) => a.time.localeCompare(b.time));
  }, [gym.classes, day, disciplineFilter, selectedBranchId]);

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
            <img 
              src={gym.images[active]} 
              alt={gym.name} 
              onClick={() => setLightboxOpen(true)}
              className="h-full w-full object-cover transition-opacity duration-500 cursor-zoom-in hover:opacity-95 transition-all" 
            />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
              <button
                onClick={() => setActive((v) => (v - 1 + gym.images.length) % gym.images.length)}
                className="grid h-9 w-9 place-items-center rounded-full bg-background/90 backdrop-blur transition hover:bg-background  text-foreground"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setActive((v) => (v + 1) % gym.images.length)}
                className="grid h-9 w-9 place-items-center rounded-full bg-background/90 backdrop-blur transition hover:bg-background  text-foreground"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          {gym.images.slice(0, 4).map((src, i) => (
            <button
              key={src + i}
              onClick={() => {
                if (active === i) {
                  setLightboxOpen(true);
                } else {
                  setActive(i);
                }
              }}
              className={`relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted transition cursor-zoom-in ${
                active === i ? "ring-2 ring-primary" : "opacity-80 hover:opacity-100"
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
            <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{gym.name}</h1>
              <button 
                onClick={toggleFavorite}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all duration-300 ${
                  isFavorite 
                    ? "border-primary bg-primary/10 text-primary hover:bg-primary/20" 
                    : "border-border hover:border-foreground/30 hover:bg-secondary/25 text-muted-foreground hover:text-foreground"
                }`}
              >
                <Heart className={`h-3.5 w-3.5 ${isFavorite ? "fill-primary text-primary" : ""}`} />
                {isFavorite ? "Guardado en Favoritos" : "Guardar en Favoritos"}
              </button>
            </div>

            {/* Branch / Sede selector */}
            {gym.branches && gym.branches.length > 0 && (
              <div className="mt-4 flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold text-muted-foreground uppercase mr-1">📍 Sede Activa:</span>
                <button
                  onClick={() => setSelectedBranchId("matriz")}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${
                    selectedBranchId === "matriz"
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Palermo (Matriz)
                </button>
                {gym.branches.map(b => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBranchId(b.id)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${
                      selectedBranchId === b.id
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {b.name.replace("Sede ", "")}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Star className="h-3.5 w-3.5 fill-foreground text-foreground" /> {gym.rating.toFixed(1)} <span className="text-muted-foreground">({gym.reviews})</span></span>
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {activeAddress}</span>
              <button 
                onClick={() => setHoursOpen(!hoursOpen)}
                className="inline-flex items-center gap-1.5 hover:text-foreground transition focus:outline-none"
              >
                <span className={`h-1.5 w-1.5 rounded-full ${gym.isOpen ? "bg-emerald-500" : "bg-muted-foreground"}`} />
                {gym.isOpen ? "Abierto ahora" : "Cerrado"} · <Clock className="h-3.5 w-3.5" /> Ver horarios semanales
              </button>
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-primary" />
                <span>
                  Aforo:{" "}
                  <strong className="text-foreground font-semibold">
                    {selectedBranchId === "matriz" && "42 / 80"}
                    {selectedBranchId === "1" && "24 / 50"}
                    {selectedBranchId === "2" && "18 / 40"}
                  </strong>{" "}
                  <span className="text-xs text-muted-foreground">
                    ({selectedBranchId === "matriz" ? "52%" : selectedBranchId === "1" ? "48%" : "45%"})
                  </span>
                </span>
              </span>
            </div>

            {/* Collapsible Weekly Hours */}
            {hoursOpen && (
              <div className="mt-4 border border-border bg-card p-4 rounded-2xl max-w-sm text-xs space-y-1.5 hover:border-foreground/20 transition duration-300 animate-fade-down">
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

            {/* Visual Amenities Grid */}
            {gym.amenities && gym.amenities.length > 0 && (
              <div className="mt-8">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-3">Servicios y Amenities:</span>
                <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
                  {gym.amenities.map((amenity) => {
                    const Icon = getAmenityIcon(amenity);
                    return (
                      <div key={amenity} className="flex items-center gap-2.5 p-3 rounded-2xl border border-border bg-card/45 text-xs font-medium text-foreground hover:border-foreground/30 hover:bg-secondary/10 transition duration-300">
                        <div className="h-7 w-7 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span>{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <aside className="lg:col-span-1 space-y-6">
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

            {/* Stylized Google Maps Placeholder */}
            <div className="border border-border bg-card rounded-2xl overflow-hidden hover:border-foreground/20 transition duration-300">
              <div 
                id="google-maps-container" 
                className="w-full h-40 bg-secondary/50 relative flex items-center justify-center overflow-hidden"
              >
                {/* Simulated map grid */}
                <div 
                  className="absolute inset-0 opacity-20 pointer-events-none" 
                  style={{ 
                    backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)", 
                    backgroundSize: "16px 16px" 
                  }} 
                />
                
                {/* Pulsing gym pin */}
                <div className="relative flex items-center justify-center">
                  <div className="absolute h-8 w-8 rounded-full bg-primary/20 animate-ping" />
                  <div className="h-4 w-4 rounded-full bg-primary border-2 border-background " />
                </div>
                
                <span className="absolute bottom-2 left-2 text-[9px] bg-background/80 border border-border px-2 py-0.5 rounded-md font-mono text-muted-foreground">
                  Google Maps SDK (Ready)
                </span>
              </div>
              
              <div className="p-4">
                <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary" /> {gym.address}
                </div>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(gym.name + " " + gym.address)}`}
                  target="_blank" 
                  rel="noreferrer"
                  className={buttonVariants({ variant: "outline", size: "sm", className: "mt-3 w-full rounded-xl text-xs gap-1.5" })}
                >
                  <Navigation className="h-3.5 w-3.5" /> Cómo llegar
                </a>
              </div>
            </div>

            {/* Social Networks Links */}
            {(gym.instagram || gym.tiktok || gym.whatsapp) && (
              <div className="border border-border bg-card rounded-2xl p-4 space-y-3 hover:border-foreground/20 transition duration-300">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Redes Sociales</span>
                <div className="flex gap-2">
                  {gym.instagram && (
                    <a 
                      href={`https://instagram.com/${gym.instagram}`}
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center justify-center h-9 w-9 rounded-xl bg-secondary hover:bg-primary/10 hover:text-primary border border-border text-muted-foreground transition"
                      title="Instagram"
                    >
                      <Instagram className="h-4 w-4" />
                    </a>
                  )}
                  {gym.tiktok && (
                    <a 
                      href={`https://tiktok.com/@${gym.tiktok}`}
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center justify-center h-9 w-9 rounded-xl bg-secondary hover:bg-primary/10 hover:text-primary border border-border text-muted-foreground transition"
                      title="TikTok"
                    >
                      <TikTokIcon className="h-4 w-4" />
                    </a>
                  )}
                  {gym.whatsapp && (
                    <a 
                      href={`https://wa.me/${gym.whatsapp}`}
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center justify-center h-9 w-9 rounded-xl bg-secondary hover:bg-primary/10 hover:text-primary border border-border text-muted-foreground transition"
                      title="WhatsApp"
                    >
                      <WhatsAppIcon className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* Horarios Populares / Concurrencia en Tiempo Real */}
        {gym.occupancyData && (
          <section className="mt-16 rounded-3xl border border-border bg-card p-6 hover:border-foreground/20 transition duration-300">
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
                        ? "border-foreground bg-foreground text-background"
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
                    <div key={hour} className="flex-1 group relative h-full flex flex-col justify-end items-center">
                      {/* Tooltip on hover */}
                      <span className="absolute -top-7 scale-0 group-hover:scale-100 transition-all bg-foreground text-background text-[10px] font-bold px-2 py-0.5 rounded  z-10 whitespace-nowrap">
                        {percent}% concurrencia
                      </span>
                      
                      {/* Bar container that occupies the available height for bars */}
                      <div className="w-full h-[80%] flex items-end">
                        <div 
                          className={`w-full rounded-t-sm transition-all duration-300 ${
                            isCurrentHour
                              ? "bg-primary animate-pulse"
                              : "bg-muted-foreground/35 group-hover:bg-muted-foreground/50"
                          }`}
                          style={{ height: `${percent}%` }}
                        />
                      </div>
                      
                      {/* Label for hours (show every 2 hours or in desktop) */}
                      <span className="text-[10px] font-mono text-muted-foreground tracking-tighter mt-1 block h-[20%] text-center">
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

        <EquipmentSection slug={gym.slug} />

        {/* Memberships */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold tracking-tight">Membresías y planes</h2>
          <p className="mt-1 text-sm text-muted-foreground">Elegí el plan que mejor se adapta a tu ritmo.</p>
          
          {/* Memberships Filters */}
          <div className="mt-4 flex flex-col gap-4 border-b border-border/40 pb-4">
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {membershipTags.map((t) => (
                <button
                  key={t}
                  onClick={() => setMembershipFilter(t)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${
                    membershipFilter === t
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Advanced Filters */}
            <div className="flex flex-wrap gap-x-6 gap-y-3 items-center text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Tipo:</span>
                <div className="flex gap-1 bg-secondary/35 p-0.5 rounded-lg border border-border/40">
                  {[
                    { label: "Todos", value: "Todos" },
                    { label: "Pase Libre", value: "Ilimitado" },
                    { label: "Por Clases", value: "Creditos" }
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => setPassTypeFilter(item.value)}
                      className={`px-2.5 py-1 rounded-md transition text-[11px] font-medium ${
                        passTypeFilter === item.value
                          ? "bg-background text-foreground "
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Horario:</span>
                <div className="flex gap-1 bg-secondary/35 p-0.5 rounded-lg border border-border/40">
                  {[
                    { label: "Todos", value: "Todos" },
                    { label: "Todo Horario", value: "Full-Time" },
                    { label: "Off-Peak", value: "Off-Peak" }
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => setAccessHoursFilter(item.value)}
                      className={`px-2.5 py-1 rounded-md transition text-[11px] font-medium ${
                        accessHoursFilter === item.value
                          ? "bg-background text-foreground "
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Sede:</span>
                <div className="flex gap-1 bg-secondary/35 p-0.5 rounded-lg border border-border/40">
                  {[
                    { label: "Cualquiera", value: "Todos" },
                    { label: "Multisede", value: "Multisede" }
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => setCoverageFilter(item.value)}
                      className={`px-2.5 py-1 rounded-md transition text-[11px] font-medium ${
                        coverageFilter === item.value
                          ? "bg-background text-foreground "
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {filteredMemberships.length === 0 ? (
            <div className="mt-6 py-12 text-center border border-dashed border-border rounded-3xl bg-secondary/10">
              <p className="text-sm font-semibold text-foreground">No encontramos planes que coincidan con estos filtros.</p>
              <button 
                onClick={() => {
                  setMembershipFilter("Todos");
                  setPassTypeFilter("Todos");
                  setAccessHoursFilter("Todos");
                  setCoverageFilter("Todos");
                }}
                className="mt-3 text-xs font-semibold text-primary hover:underline"
              >
                Restablecer filtros de búsqueda
              </button>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {filteredMemberships.map((m, idx) => (
                <div
                  key={m.name}
                  className={`rounded-2xl border p-6 transition-all duration-300 flex flex-col justify-between ${
                    idx === 1 
                      ? "border-foreground bg-foreground text-background hover:scale-[1.01]" 
                      : "border-border bg-background hover:border-foreground/40 hover:scale-[1.01] hover:bg-secondary/10"
                  }`}
                >
                  <div>
                    <div className="flex items-baseline justify-between">
                      <div>
                        <div className="text-base font-semibold tracking-tight">{m.name}</div>
                        {m.tag && (
                          <span className={`inline-block mt-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                            idx === 1 ? "bg-background/20 text-background" : "bg-primary/10 text-primary"
                          }`}>
                            {m.tag}
                          </span>
                        )}
                      </div>
                      <div className={`text-xs ${idx === 1 ? "text-background/70" : "text-muted-foreground"}`}>{m.duration}</div>
                    </div>
                    <div className="mt-4 text-3xl font-semibold tracking-tight">
                      {m.originalPrice && (
                        <span className={`text-sm font-normal line-through mr-2 ${
                          idx === 1 ? "text-background/60" : "text-muted-foreground"
                        }`}>
                          ${m.originalPrice.toLocaleString("es-AR")}
                        </span>
                      )}
                      ${m.price.toLocaleString("es-AR")}
                    </div>

                    {/* Advanced access details (pass type, hours, activities) */}
                    <div className={`mt-4 space-y-1.5 border-t pt-3 text-xs ${
                      idx === 1 ? "border-background/20 text-background/80" : "border-border/60 text-muted-foreground"
                    }`}>
                      <div className="flex items-center gap-1.5">
                        <span>🎟️</span>
                        <span>
                          {m.passType === "Por Créditos" 
                            ? `${m.creditsCount} clases / créditos` 
                            : "Pase Libre (Ilimitado)"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span>🕒</span>
                        <span>
                          {m.accessHoursType === "Off-Peak" 
                            ? `Franja Off-Peak (${m.offPeakStart} - ${m.offPeakEnd} hs)` 
                            : "Acceso Completo (Todo Horario)"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span>💵</span>
                        <span>
                          {m.registrationFee && m.registrationFee > 0 
                            ? `Matrícula: $${m.registrationFee.toLocaleString("es-AR")}` 
                            : "Matrícula Bonificada 🎉"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span>🏢</span>
                        <span>
                          {m.isMultisede 
                            ? "Acceso Multisede (Toda la red)" 
                            : "Solo Sede Matriz (Palermo)"}
                        </span>
                      </div>
                      {m.freezeDays && m.freezeDays > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <span>❄️</span>
                          <span>Congelamiento: {m.freezeDays} días/año</span>
                        </div>
                      ) : null}
                      {m.dailyClassLimit && m.dailyClassLimit !== "Ilimitado" ? (
                        <div className="flex items-center gap-1.5">
                          <span>🛡️</span>
                          <span>Límite: {m.dailyClassLimit}</span>
                        </div>
                      ) : null}
                    </div>

                    {/* Included activities */}
                    {m.includedActivities && m.includedActivities.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {m.includedActivities.map((act) => (
                          <span 
                            key={act} 
                            className={`text-[8.5px] px-2 py-0.5 rounded-full font-medium ${
                              idx === 1 ? "bg-background/25 text-background" : "bg-secondary text-secondary-foreground"
                            }`}
                          >
                            {act}
                          </span>
                        ))}
                      </div>
                    )}

                    <ul className="mt-4 space-y-2 border-t border-border/60 pt-3 text-sm">
                      {m.benefits.map((b) => (
                        <li key={b} className="flex items-start gap-2">
                          <Check className={`mt-0.5 h-4 w-4 shrink-0 ${idx === 1 ? "text-background" : "text-foreground"}`} />
                          <span className={idx === 1 ? "text-background/90" : "text-muted-foreground"}>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    variant={idx === 1 ? "secondary" : "outline"}
                    className="mt-6 w-full rounded-full"
                  >
                    Elegir plan
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Staff / Equipo */}
        {gym.staff && gym.staff.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-semibold tracking-tight">Nuestro Staff</h2>
            <p className="mt-1 text-sm text-muted-foreground">Entrenadores certificados listos para guiar tu entrenamiento.</p>
            <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {gym.staff.map((coach) => (
                <div key={coach.id} className="rounded-2xl border border-border bg-card p-4 flex flex-col justify-between hover:border-foreground/30 hover:bg-secondary/10 transition duration-300 min-h-[140px]">
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

          {/* Discipline/Activity Filters */}
          <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1 border-t border-border/40 pt-3">
            {disciplines.map((d) => (
              <button
                key={d}
                onClick={() => setDisciplineFilter(d)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                  disciplineFilter === d
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-border">
            {classesByBranchAndDay.length === 0 ? (
              <div className="p-10 text-center text-sm text-muted-foreground">No hay clases programadas este día.</div>
            ) : (
              <ul className="divide-y divide-border">
                {classesByBranchAndDay.map((c, i) => {
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

        {/* Airbnb-style Ratings & Reviews Section */}
        <section className="mt-16 border-t border-border pt-16">
          <div className="flex items-center gap-2 mb-8">
            <Star className="h-6 w-6 fill-foreground text-foreground" />
            <h2 className="text-2xl font-semibold tracking-tight">
              {gym.rating.toFixed(1)} · {gym.reviews} evaluaciones
            </h2>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            {/* Left side: Rating breakdown */}
            <div className="md:col-span-1 space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Calificaciones promedio</h3>
              
              {[
                { label: "Limpieza", score: 4.8 },
                { label: "Equipamiento", score: 4.9 },
                { label: "Atención del Staff", score: 5.0 },
                { label: "Relación Calidad/Precio", score: 4.7 }
              ].map((category) => (
                <div key={category.label} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span>{category.label}</span>
                    <span className="font-bold text-foreground">{category.score.toFixed(1)}</span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-foreground rounded-full" 
                      style={{ width: `${(category.score / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Right side: Individual Reviews List */}
            <div className="md:col-span-2 grid gap-6 sm:grid-cols-2">
              {[
                { 
                  name: "Agustín Gómez", 
                  date: "Junio de 2026", 
                  rating: 5, 
                  comment: "El WOD de CrossFit es súper completo. Mateo es excelente corrigiendo posturas y adaptando el peso si tienes alguna molestia física. Los vestuarios siempre están limpios.",
                  photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80"
                },
                { 
                  name: "Paula Cáceres", 
                  date: "Mayo de 2026", 
                  rating: 5, 
                  comment: "Fui a la clase de Yoga por la tarde, el salón es amplio y silencioso. Los amenities como lockers y toallas de alquiler son súper cómodos.",
                  photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80"
                },
                { 
                  name: "Marcos López", 
                  date: "Abril de 2026", 
                  rating: 4, 
                  comment: "Muy buen equipamiento en la sala de musculación. Se llena un poco en la hora pico de las 19 hs, pero el aforo en tiempo real de la app ayuda a evitar esos horarios.",
                  photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80"
                },
                { 
                  name: "Sofía Martínez", 
                  date: "Marzo de 2026", 
                  rating: 5, 
                  comment: "Las profesoras explican súper bien y adaptan los niveles de intensidad. Es un ambiente muy comunitario y libre de prejuicios.",
                  photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80"
                }
              ].map((review, i) => (
                <div key={i} className="space-y-2 p-4 border border-border bg-card/25 rounded-2xl hover:border-foreground/20 transition duration-300">
                  <div className="flex items-center gap-3">
                    <img src={review.photo} alt={review.name} className="h-9 w-9 rounded-full object-cover border border-border" />
                    <div>
                      <div className="text-xs font-bold text-foreground">{review.name}</div>
                      <div className="text-[10px] text-muted-foreground">{review.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: review.rating }).map((_, idx) => (
                      <Star key={idx} className="h-3 w-3 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <GymFAQSection gym={gym} />

      {/* Diplomas Viewer Modal */}
      {activeCertificationsViewer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-fade-in">
          <div className="relative bg-card border border-border w-full max-w-[600px] rounded-3xl p-6  flex flex-col text-foreground">
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

      {/* Immersive Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black/95 flex flex-col justify-between p-6 z-50 animate-fade-in text-white">
          {/* Top Bar */}
          <div className="flex justify-between items-center w-full max-w-7xl mx-auto">
            <span className="text-xs font-mono text-zinc-400">
              Foto {active + 1} de {gym.images.length}
            </span>
            <button 
              onClick={() => setLightboxOpen(false)}
              className="p-2.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white transition  border border-zinc-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Main Large Image view */}
          <div className="flex-1 flex items-center justify-between w-full max-w-7xl mx-auto relative my-4">
            <button
              onClick={() => setActive((v) => (v - 1 + gym.images.length) % gym.images.length)}
              className="p-3.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white transition shrink-0  border border-zinc-800 mr-2"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <div className="flex-1 h-full max-h-[72vh] flex items-center justify-center p-2">
              <img 
                src={gym.images[active]} 
                alt={gym.name} 
                className="max-w-full max-h-full object-contain rounded-xl  select-none" 
              />
            </div>

            <button
              onClick={() => setActive((v) => (v + 1) % gym.images.length)}
              className="p-3.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white transition shrink-0  border border-zinc-800 ml-2"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Bottom Thumbnails strip */}
          <div className="w-full max-w-4xl mx-auto overflow-x-auto py-2 flex justify-center gap-2">
            {gym.images.map((src, i) => (
              <button
                key={src + i}
                onClick={() => setActive(i)}
                className={`relative h-12 w-16 rounded-lg overflow-hidden shrink-0 transition ${
                  active === i ? "ring-2 ring-primary opacity-100" : "opacity-40 hover:opacity-100"
                }`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      </div>
      <SiteFooter />
    </div>
  );
}

function getGymEquipment(slug: string) {
  const defaultImg = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=400&q=80`;
  
  if (slug === "kraft-strength-club") {
    return [
      { name: "Poleas Ajustables Dobles", image: "/cable-crossover.png", desc: "Estación de poleas cruzadas regulable en altura para entrenamiento de fuerza." },
      { name: "Polea Alta para Espalda (Lat Pulldown)", image: "/lat-pulldown.png", desc: "Máquina profesional con polea superior y rodillos de fijación ajustables." },
      { name: "Camilla de Femorales Tumbado", image: "/prone-leg-curl.png", desc: "Aislamiento perfecto de isquiotibiales en posición prona." },
      { name: "Sillón de Flexión de Piernas Sentado", image: "/seated-leg-curl.png", desc: "Trabajo biomecánico guiado para flexores de rodilla y cuádriceps." },
      { name: "Camilla de Isquiotibiales Sentado", image: "/seated-hamstring-curl.png", desc: "Máquina de aislamiento para la cadena posterior con rango de movimiento controlado." },
    ];
  }
  
  if (slug.includes("yoga") || slug.includes("pilates") || slug.includes("studio") || slug.includes("zen")) {
    return [
      { name: "Camas de Pilates Reformer", image: defaultImg("photo-1518611012118-696072aa579a"), desc: "Reformers de madera con resortes regulables." },
      { name: "Mats de Yoga de Corcho", image: defaultImg("photo-1544367567-0f2fcb009e0b"), desc: "Mats ecológicos antideslizantes de alta densidad." },
      { name: "Bloques y Correas de Soporte", image: defaultImg("photo-1600880292203-757bb62b4baf"), desc: "Accesorios para alineación y estiramientos." },
      { name: "Pelotas de Pilates (Fitballs)", image: defaultImg("photo-1518310383802-640c2de311b2"), desc: "Diferentes tamaños para fortalecimiento de core." },
      { name: "Rodillos de Espuma (Foam Rollers)", image: defaultImg("photo-1600880292089-90a7e086ee0c"), desc: "Para liberación miofascial y masajes." },
    ];
  }

  if (slug.includes("crossfit") || slug.includes("box") || slug.includes("concept")) {
    return [
      { name: "Estructura Rigs para Pull-Ups", image: defaultImg("photo-1517838277536-f5f99be501cd"), desc: "Rigs multiestación para calistenia y gimnasia." },
      { name: "Remos Concept2", image: defaultImg("photo-1517963879433-6ad2b056d712"), desc: "Ergómetros Concept2 con monitor PM5." },
      { name: "Kettlebells de Competición", image: defaultImg("photo-1541534741688-6078c6bfb5c5"), desc: "Pesas rusas de acero de 8kg a 32kg." },
      { name: "Med Balls de Lanzamiento", image: defaultImg("photo-1601422407692-ec4eeec1d9b3"), desc: "Wall balls con costuras reforzadas." },
      { name: "Cajones Pliométricos", image: defaultImg("photo-1517838277536-f5f99be501cd"), desc: "Cajones de madera de 3 alturas regulables." },
    ];
  }

  return [
    { name: "Poleas Ajustables Dobles", image: "/cable-crossover.png", desc: "Estación de poleas cruzadas regulable en altura para entrenamiento funcional y de fuerza." },
    { name: "Polea Alta para Espalda (Lat Pulldown)", image: "/lat-pulldown.png", desc: "Máquina profesional con polea superior y rodillos de fijación ajustables para dorsales." },
    { name: "Camilla de Femorales Tumbado", image: "/prone-leg-curl.png", desc: "Aislamiento perfecto de isquiotibiales en posición prona con rodillo acolchado autorregulable." },
    { name: "Sillón de Flexión de Piernas Sentado", image: "/seated-leg-curl.png", desc: "Trabajo biomecánico guiado para flexores de rodilla y cuádriceps en posición sentada." },
    { name: "Camilla de Isquiotibiales Sentado", image: "/seated-hamstring-curl.png", desc: "Máquina de aislamiento para la cadena posterior con rango de movimiento controlado." },
  ];
}

function EquipmentSection({ slug }: { slug: string }) {
  const equipment = getGymEquipment(slug);
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredEquipment = equipment.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.desc?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    const slider = containerRef.current;
    if (!slider) return;
    isDownRef.current = true;
    slider.style.cursor = "grabbing";
    startXRef.current = e.pageX - slider.offsetLeft;
    scrollLeftRef.current = slider.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDownRef.current = false;
    const slider = containerRef.current;
    if (slider) {
      slider.style.cursor = "grab";
    }
  };

  const handleMouseUp = () => {
    isDownRef.current = false;
    const slider = containerRef.current;
    if (slider) {
      slider.style.cursor = "grab";
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDownRef.current) return;
    const slider = containerRef.current;
    if (!slider) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startXRef.current) * 1.5; // speed multiplier
    slider.scrollLeft = scrollLeftRef.current - walk;
  };

  return (
    <section className="mt-16 border-t border-border pt-16 select-none">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Equipamiento disponible</h2>
          <p className="mt-1 text-sm text-muted-foreground">Maquinaria, accesorios y herramientas disponibles en este centro.</p>
          <p className="mt-1.5 text-[10px] text-muted-foreground/70 italic">* Las imágenes son de carácter ilustrativo y representativo del equipamiento del centro.</p>
        </div>
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar equipamiento..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-card"
          />
        </div>
      </div>

      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{ cursor: "grab" }}
        className="mt-6 flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory min-h-[200px]"
      >
        {filteredEquipment.length > 0 ? (
          filteredEquipment.map((item, idx) => (
            <div 
              key={idx} 
              className="w-[240px] sm:w-[260px] shrink-0 snap-start bg-card/25 rounded-3xl p-3 hover:bg-secondary/10 hover:scale-[1.01] transition-all duration-300"
            >
              <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  draggable="false"
                  className="h-full w-full object-cover hover:scale-[1.03] transition duration-500 select-none" 
                />
              </div>
              <div className="mt-3 px-1">
                <h3 className="font-semibold text-sm tracking-tight text-foreground">{item.name}</h3>
                {item.desc && <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{item.desc}</p>}
              </div>
            </div>
          ))
        ) : (
          <div className="flex w-full items-center justify-center p-8 text-center text-muted-foreground bg-secondary/20 rounded-2xl border border-border border-dashed">
            No se encontró equipamiento con ese nombre.
          </div>
        )}
      </div>
    </section>
  );
}

function GymFAQSection({ gym }: { gym: Gym }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs = [
    {
      q: "¿Cómo reservo una clase de prueba o pase diario?",
      a: `Puedes reservar directamente presionando el botón 'Reservar clase de prueba'. Completas tus datos en 30 segundos, eliges el día y horario, y recibirás la confirmación inmediata. Si es tu primera vez en ${gym.name}, ¡la clase de prueba es gratuita!`
    },
    {
      q: "¿Cuál es la política de cancelación de clases?",
      a: "Puedes cancelar cualquier clase reservada sin penalización hasta 4 horas antes del horario de inicio directamente desde tu panel de usuario. Si cancelas fuera de término, el crédito no será reembolsado."
    },
    {
      q: "¿Qué necesito presentar para ingresar el primer día?",
      a: `${gym.requirements?.join(" y ") || "Apto médico físico y toalla personal"}. Además, deberás presentar el código QR que se genera en tu cuenta desde la app de Shakerfy al ingresar al centro.`
    },
    {
      q: "¿Cómo funcionan las membresías y la renovación?",
      a: "Nuestras membresías se facturan mensualmente de forma automática. No tienen contratos de permanencia mínima, por lo que puedes pausar, cambiar de plan o cancelar tu suscripción en cualquier momento sin cargos adicionales."
    },
    {
      q: "¿Puedo congelar mi membresía por viaje o enfermedad?",
      a: `Sí. Según el plan que elijas, cuentas con días de congelamiento (por ejemplo, 7, 15 o 30 días anuales). Puedes solicitar el congelamiento desde tu panel de usuario antes de la fecha en que dejes de asistir.`
    },
    {
      q: "¿El acceso a las sedes y vestuarios está incluido?",
      a: `¡Sí! Todas las membresías contratadas en ${gym.name} incluyen el uso libre de los vestuarios, duchas con agua caliente, lockers de seguridad (debes traer tu propio candado) y WiFi de alta velocidad.`
    }
  ];

  return (
    <section className="mt-16 border-t border-border pt-16">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Preguntas Frecuentes</h2>
        <p className="mt-2 text-sm text-muted-foreground">Despeja tus dudas sobre el funcionamiento de {gym.name}, reservas y membresías.</p>
      </div>

      <div className="space-y-4 max-w-3xl mx-auto">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={idx} className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
              isOpen ? "border-foreground bg-card" : "border-border bg-card hover:border-foreground/30"
            }`}>
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="flex w-full items-center justify-between p-5 text-left font-medium text-sm text-foreground hover:bg-secondary/45 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
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