import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Star,
  Clock,
  ArrowLeft,
  Users,
  Heart,
} from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { getGym } from "@/lib/gyms";
import {
  getAmenityIcon,
  GymCertificationsModal,
  GymLightboxModal,
  GymSidebarCard,
  GymPopularHoursSection,
  GymMembershipsSection,
  GymStaffSection,
  GymScheduleSection,
  GymReviewsSection,
  GymEquipmentSection,
  GymFAQSection,
} from "@/components/gym";

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
        <Link to="/" className="mt-3 inline-block text-sm text-muted-foreground underline">
          Volver al inicio
        </Link>
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

function GymPage() {
  const { gym } = Route.useLoaderData();
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

  const activeAddress = gym.address;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
        >
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
                className="grid h-9 w-9 place-items-center rounded-full bg-background/90 backdrop-blur transition hover:bg-background text-foreground"
                aria-label="Foto anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setActive((v) => (v + 1) % gym.images.length)}
                className="grid h-9 w-9 place-items-center rounded-full bg-background/90 backdrop-blur transition hover:bg-background text-foreground"
                aria-label="Foto siguiente"
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
                <Badge key={t} variant="secondary" className="rounded-full">
                  {t}
                </Badge>
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
            <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 fill-foreground text-foreground" />{" "}
                {gym.rating.toFixed(1)}{" "}
                <span className="text-muted-foreground">({gym.reviews})</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> {activeAddress}
              </span>
              <button
                onClick={() => setHoursOpen(!hoursOpen)}
                className="inline-flex items-center gap-1.5 hover:text-foreground transition focus:outline-none"
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${gym.isOpen ? "bg-emerald-500" : "bg-muted-foreground"}`}
                />
                {gym.isOpen ? "Abierto ahora" : "Cerrado"} · <Clock className="h-3.5 w-3.5" /> Ver
                horarios semanales
              </button>
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-primary" />
                <span>
                  Aforo: <strong className="text-foreground font-semibold">42 / 80</strong>{" "}
                  <span className="text-xs text-muted-foreground">(52%)</span>
                </span>
              </span>
            </div>

            {/* Collapsible Weekly Hours */}
            {hoursOpen && (
              <div className="mt-4 border border-border bg-card p-4 rounded-2xl max-w-sm text-xs space-y-1.5 hover:border-foreground/20 transition duration-300 animate-fade-down">
                <div className="font-bold text-foreground pb-1.5 border-b border-border flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-primary" /> Detalle de Horarios Semanales
                </div>
                {gym.weeklyHours ? (
                  gym.weeklyHours.map((wh) => (
                    <div key={wh.day} className="flex justify-between py-0.5">
                      <span className="font-semibold text-foreground">{wh.day}:</span>
                      <span className="text-muted-foreground">
                        {wh.intervals && wh.intervals.length > 0
                          ? wh.intervals.map((i) => `${i.from} - ${i.to}`).join(" y ")
                          : "Cerrado"}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-between py-0.5">
                    <span className="font-semibold text-foreground">Todos los días:</span>
                    <span className="text-muted-foreground">{gym.hours}</span>
                  </div>
                )}
              </div>
            )}
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              {gym.description}
            </p>

            {gym.requirements && gym.requirements.length > 0 && (
              <div className="mt-6">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                  Normas de ingreso:
                </span>
                <div className="flex flex-wrap gap-2">
                  {gym.requirements.map((req) => (
                    <span
                      key={req}
                      className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 px-3 py-1 text-xs text-amber-500 font-medium"
                    >
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
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-3">
                  Servicios y Amenities:
                </span>
                <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
                  {gym.amenities.map((amenity) => {
                    const Icon = getAmenityIcon(amenity);
                    return (
                      <div
                        key={amenity}
                        className="flex items-center gap-2.5 p-3 rounded-2xl border border-border bg-card/45 text-xs font-medium text-foreground hover:border-foreground/30 hover:bg-secondary/10 transition duration-300"
                      >
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

          {/* Right Sidebar */}
          <GymSidebarCard gym={gym} />
        </div>

        {/* Popular Hours */}
        <GymPopularHoursSection
          gym={gym}
          selectedDay={day}
          onSelectDay={setDay}
        />

        {/* Equipment Section */}
        <GymEquipmentSection slug={gym.slug} />

        {/* Memberships Section */}
        <GymMembershipsSection gym={gym} />

        {/* Staff Section */}
        <GymStaffSection
          staff={gym.staff}
          onViewCertifications={setActiveCertificationsViewer}
        />

        {/* Schedule Section */}
        <GymScheduleSection
          classes={gym.classes}
          selectedDay={day}
          onSelectDay={setDay}
        />

        {/* Reviews Section */}
        <GymReviewsSection gym={gym} />

        {/* FAQ Section */}
        <GymFAQSection gym={gym} />

        {/* Modals */}
        <GymCertificationsModal
          images={activeCertificationsViewer}
          onClose={() => setActiveCertificationsViewer(null)}
        />

        <GymLightboxModal
          isOpen={lightboxOpen}
          images={gym.images}
          activeIndex={active}
          gymName={gym.name}
          onClose={() => setLightboxOpen(false)}
          onSelectIndex={setActive}
        />
      </div>
      <SiteFooter />
    </div>
  );
}
