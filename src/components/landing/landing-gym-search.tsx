import React from "react";
import { Link } from "@tanstack/react-router";
import { Heart, Sparkles, MapPin, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface LandingGymSearchProps {
  gyms: any[];
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
}: LandingGymSearchProps) {
  return (
    <section id="descubrir" className="mx-auto max-w-7xl px-6 pb-24 pt-12 scroll-mt-16">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Gimnasios cerca de ti
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Curados por nuestra IA según ubicación, disciplina y presupuesto.
          </p>
        </div>
        <div className="flex w-full gap-2 overflow-x-auto max-w-full md:overflow-visible">
          <button
            onClick={() => {
              setShowOnlyFavorites(!showOnlyFavorites);
              setAiActive(false);
              setCategory("Todos");
            }}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
              showOnlyFavorites
                ? "border-primary bg-primary/10 text-primary hover:bg-primary/20"
                : "border-border bg-background text-muted-foreground hover:border-foreground/40 hover:text-foreground"
            }`}
          >
            <Heart
              className={`h-3.5 w-3.5 ${showOnlyFavorites ? "fill-primary text-primary" : "text-muted-foreground"}`}
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
              className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                category === c && !aiActive && !showOnlyFavorites
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-muted-foreground hover:border-foreground/40 hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* AI Searching State */}
      {isSearching && (
        <div className="mt-8 flex flex-col items-center justify-center py-20 rounded-3xl border border-dashed border-foreground/20 bg-secondary/30 animate-pulse">
          <div className="flex items-center gap-3">
            <span className="h-5 w-5 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-semibold text-foreground">
              La IA de The Wellness Face está analizando gimnasios...
            </p>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Buscando coincidencias de ubicación, precios y clases...
          </p>
        </div>
      )}

      {/* AI Results Banner */}
      {aiActive && (
        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-secondary/50 border border-border p-4 animate-fade-in">
          <div className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-foreground text-background">
              <Sparkles className="h-4 w-4 fill-background" />
            </div>
            <div>
              <p className="text-sm font-semibold">Resultados sugeridos por la IA</p>
              <p className="text-xs text-muted-foreground">Para: "{aiQuery}"</p>
            </div>
          </div>
          <button
            onClick={() => {
              setAiActive(false);
              setCategory("Todos");
            }}
            className="text-xs font-semibold hover:underline flex items-center gap-1 text-muted-foreground hover:text-foreground transition"
          >
            Restablecer búsqueda <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {!isSearching && (
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
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${g.isOpen ? "bg-emerald-500" : "bg-muted-foreground"}`}
                  />
                  {g.isOpen ? "Abierto ahora" : "Cerrado"}
                </div>

                {/* Heart favorite overlay button */}
                <button
                  onClick={(e) => toggleFavorite(g.slug, e)}
                  className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-background/95 backdrop-blur transition hover:scale-105 active:scale-95"
                >
                  <Heart
                    className={`h-4 w-4 transition-colors ${
                      favorites.includes(g.slug)
                        ? "fill-primary text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  />
                </button>

                {/* Match score overlay badge */}
                {aiActive && aiMatches[g.slug] && (
                  <div className="absolute right-[52px] top-3 flex items-center gap-1 rounded-full bg-foreground text-background px-2.5 py-1 text-[11px] font-semibold animate-fade-in">
                    <Sparkles className="h-3 w-3 fill-background animate-pulse" />
                    {aiMatches[g.slug].match}% Match
                  </div>
                )}
              </div>
              <div className="mt-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-[15px] font-semibold tracking-tight">
                    {g.name}
                  </div>
                  <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {g.neighborhood}, {g.city}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-medium">
                  <Star className="h-3.5 w-3.5 fill-foreground" />
                  {g.rating.toFixed(1)}
                </div>
              </div>

              {/* AI Explanation badge */}
              {aiActive && aiMatches[g.slug] && aiMatches[g.slug].explanation && (
                <div className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 rounded-md px-2 py-0.5 w-fit">
                  <Sparkles className="h-3 w-3" />
                  <span className="truncate">{aiMatches[g.slug].explanation}</span>
                </div>
              )}

              <div className="mt-1 text-sm text-muted-foreground">
                {g.tags.slice(0, 2).join(" · ")}
              </div>
              <div className="mt-1 text-sm">
                <span className="font-semibold text-foreground">
                  ${g.priceFrom.toLocaleString("es-AR")}
                </span>
                <span className="text-muted-foreground"> / mes desde</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!isSearching && gyms.length === 0 && (
        <div className="mt-8 flex flex-col items-center justify-center py-20 rounded-3xl border border-dashed border-border bg-card text-center px-6">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-muted-foreground mb-4">
            {showOnlyFavorites ? (
              <Heart className="h-6 w-6 text-primary fill-primary animate-pulse" />
            ) : (
              <Star className="h-6 w-6" />
            )}
          </div>
          <h3 className="text-base font-semibold text-foreground">
            {showOnlyFavorites ? "No tienes gimnasios guardados" : "No encontramos gimnasios"}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm">
            {showOnlyFavorites
              ? "Explora nuestra lista de gimnasios y haz clic en el corazón para guardarlos en tus favoritos."
              : "Prueba ajustando los filtros o realizando otra búsqueda."}
          </p>
          {showOnlyFavorites && (
            <Button
              onClick={() => setShowOnlyFavorites(false)}
              className="mt-6 rounded-full text-xs"
              variant="outline"
            >
              Ver todos los gimnasios
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
