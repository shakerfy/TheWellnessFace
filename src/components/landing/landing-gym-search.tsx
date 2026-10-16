import React from "react";
import { Link } from "@tanstack/react-router";
import { Heart, Sparkles, Star, X, Check } from "lucide-react";
import { Gym } from "@/lib/gyms";
import { cn } from "@/lib/utils";

export interface LandingGymSearchProps {
  gyms: Gym[];
  category: string;
  setCategory: (c: string) => void;
  categories: string[];
  isSearching: boolean;
  aiActive: boolean;
  setAiActive: (a: boolean) => void;
  aiQuery: string;
  aiMatches: Record<string, { match: number; explanation: string }>;
  favorites: string[];
  toggleFavorite: (slug: string, e: React.MouseEvent) => void;
  showOnlyFavorites: boolean;
  setShowOnlyFavorites: (s: boolean) => void;
  hideCategoryBar?: boolean;
  customTitle?: string;
  customSubtitle?: string;
}

export function LandingGymSearch({
  gyms,
  category,
  setCategory,
  categories,
  isSearching,
  aiActive,
  setAiActive,
  aiQuery,
  aiMatches,
  favorites,
  toggleFavorite,
  showOnlyFavorites,
  setShowOnlyFavorites,
  hideCategoryBar = false,
  customTitle,
  customSubtitle,
}: LandingGymSearchProps) {
  return (
    <section id="descubrir" className="mx-auto max-w-7xl px-4 sm:px-6 pb-20 pt-4 scroll-mt-16">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end mb-6">
        <div>
          <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">
            {customTitle ? "Selección Filtrada" : "Curaduría de Espacios"}
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            {customTitle || "Estudios, Boxes y Santuarios"}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            {customSubtitle || "Curados por nuestra IA según tu disciplina, ubicación y confort somático."}
          </p>
        </div>

        {!hideCategoryBar && (
          <div className="flex w-full gap-2 overflow-x-auto max-w-full md:overflow-visible pb-1 md:pb-0">
            <button
              onClick={() => {
                setShowOnlyFavorites(!showOnlyFavorites);
                setAiActive(false);
                setCategory("Todos");
              }}
              className={cn(
                "flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium transition cursor-pointer select-none",
                showOnlyFavorites
                  ? "border-foreground/30 bg-foreground/10 text-foreground font-semibold shadow-xs"
                  : "border-border bg-card text-muted-foreground hover:border-foreground/20 hover:text-foreground",
              )}
            >
              <Heart
                className={cn(
                  "h-3.5 w-3.5",
                  showOnlyFavorites ? "fill-rose-500 text-rose-500" : "text-muted-foreground",
                )}
              />
              Favoritos ({favorites.length})
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCategory(c);
                  setAiActive(false);
                  setShowOnlyFavorites(false);
                }}
                className={cn(
                  "whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium transition cursor-pointer select-none",
                  category === c && !aiActive && !showOnlyFavorites
                    ? "border-foreground bg-foreground text-background font-semibold shadow-xs"
                    : "border-border bg-card text-muted-foreground hover:border-foreground/20 hover:text-foreground",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* AI Searching State */}
      {isSearching && (
        <div className="mt-8 flex flex-col items-center justify-center py-20 rounded-[28px] border border-dashed border-border bg-card/50 animate-pulse text-center px-4">
          <div className="flex items-center gap-3">
            <span className="h-5 w-5 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-semibold text-foreground">
              La IA de The Wellness Face está evaluando espacios afines...
            </p>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Buscando coincidencias de disciplina, luz natural, profesores y metodologías...
          </p>
        </div>
      )}

      {/* AI Results Banner */}
      {aiActive && (
        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-card border border-border p-4 shadow-sm animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Curaduría inteligente personalizada</p>
              <p className="text-xs text-muted-foreground">Criterio de búsqueda: "{aiQuery}"</p>
            </div>
          </div>
          <button
            onClick={() => {
              setAiActive(false);
              setCategory("Todos");
            }}
            className="text-xs font-semibold flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition cursor-pointer"
          >
            Restablecer curaduría <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Minimalist Grid of Cards (Matching the user's reference images) */}
      {!isSearching && (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {gyms.map((g, idx) => {
            const isFav = favorites.includes(g.slug);
            const firstImage =
              g.images?.[0] ||
              "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80";

            const startingPrice = g.priceFrom
              ? `$${g.priceFrom.toLocaleString("es-AR")}`
              : g.memberships?.[0]?.price
                ? `$${g.memberships[0].price.toLocaleString("es-AR")}`
                : "$14.500";

            const perClassPrice = g.priceFrom
              ? `$${Math.round(g.priceFrom / 6).toLocaleString("es-AR")}`
              : "$2.450";

            const primaryCategory = g.tags?.[0] || "Estudio Boutique";
            const reviewsCount = g.reviews || 142;

            return (
              <Link
                key={g.slug}
                to="/gym/$slug"
                params={{ slug: g.slug }}
                className="group relative rounded-[28px] border border-border/80 bg-card text-card-foreground overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-foreground/20 flex flex-col justify-between shadow-xs select-none"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* Photo Container with Carousel Dots & Heart */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                  <img
                    src={firstImage}
                    alt={g.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Gradient vignette for top buttons */}
                  <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />

                  {/* AI Match Badge */}
                  {aiActive && aiMatches[g.slug] && (
                    <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider z-10">
                      <Sparkles className="h-3 w-3 text-amber-400" />
                      {aiMatches[g.slug].match}% Match
                    </div>
                  )}

                  {/* Favorite Heart Button */}
                  <button
                    type="button"
                    onClick={(e) => toggleFavorite(g.slug, e)}
                    aria-label={isFav ? "Quitar de favoritos" : "Guardar en favoritos"}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/15 flex items-center justify-center text-white transition active:scale-75 hover:bg-black/60 cursor-pointer z-10"
                  >
                    <Heart
                      className={cn(
                        "w-4 h-4 transition-colors",
                        isFav ? "fill-rose-500 text-rose-500" : "text-white/90 hover:text-white",
                      )}
                    />
                  </button>

                  {/* Minimal Carousel Dots */}
                  <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/35 backdrop-blur-xs px-2.5 py-1 rounded-full pointer-events-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
                  </div>
                </div>

                {/* Minimalist Card Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Line 1: Title and Star Rating */}
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-base sm:text-lg font-bold text-foreground group-hover:text-foreground/80 transition-colors truncate">
                        {g.name}
                      </h4>
                      <div className="flex items-center gap-1 text-xs sm:text-sm font-bold text-foreground shrink-0">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 dark:fill-amber-400 dark:text-amber-400" />
                        <span>{g.rating?.toFixed(1) || "4.8"}</span>
                        <span className="text-muted-foreground font-normal text-xs">
                          ({reviewsCount})
                        </span>
                      </div>
                    </div>

                    {/* Line 2: Category and Neighborhood */}
                    <p className="text-xs sm:text-sm text-muted-foreground truncate font-normal mt-0.5">
                      {primaryCategory} · {g.neighborhood || g.city}
                    </p>

                    {/* Line 3: Schedule details or tags */}
                    <p className="text-xs text-muted-foreground/80 truncate mt-1">
                      Horarios flexibles · Pase libre · Sin matrícula
                    </p>

                    {/* AI Explanation highlight */}
                    {aiActive && aiMatches[g.slug]?.explanation && (
                      <div className="mt-2 text-[11px] text-amber-600 dark:text-amber-300 bg-amber-500/10 rounded-lg px-2 py-1 font-medium truncate">
                        {aiMatches[g.slug].explanation}
                      </div>
                    )}
                  </div>

                  {/* Subtle Fine Divider */}
                  <div className="my-3 border-t border-border/60" />

                  {/* Bottom Row: Price Breakdown & Reservar Action Button */}
                  <div className="flex items-end justify-between gap-3">
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold tracking-tight text-foreground font-sans">
                          {startingPrice}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-normal">
                          total
                        </span>
                      </div>

                      <p className="text-[11px] text-muted-foreground truncate">
                        {perClassPrice} por clase
                      </p>

                      <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 pt-0.5">
                        <Check className="w-3.5 h-3.5 shrink-0" />
                        <span>Cancelación gratuita</span>
                      </div>
                    </div>

                    {/* Reservar CTA Button */}
                    <div className="shrink-0">
                      <span className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 active:scale-95 bg-foreground text-background hover:bg-foreground/90 shadow-xs">
                        Reservar
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!isSearching && gyms.length === 0 && (
        <div className="mt-8 flex flex-col items-center justify-center py-20 rounded-[28px] border border-dashed border-border bg-card text-center px-6">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-muted text-muted-foreground mb-4 border border-border">
            {showOnlyFavorites ? (
              <Heart className="h-6 w-6 text-rose-500 fill-rose-500 animate-pulse" />
            ) : (
              <Star className="h-6 w-6 text-amber-500" />
            )}
          </div>
          <h3 className="text-base font-semibold text-foreground">
            {showOnlyFavorites
              ? "Aún no tenés espacios en favoritos"
              : "No encontramos espacios con ese criterio"}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm">
            {showOnlyFavorites
              ? "Explorá el catálogo y tocá el icono de corazón en cualquier estudio para guardarlo aquí."
              : "Probá ajustando la categoría o el término de búsqueda para descubrir más opciones."}
          </p>
        </div>
      )}
    </section>
  );
}
