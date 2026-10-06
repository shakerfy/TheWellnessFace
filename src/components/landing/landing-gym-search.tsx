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
    <section id="descubrir" className="mx-auto max-w-7xl px-6 pb-24 pt-16 scroll-mt-16 bg-[#0E0D0C]">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C5BAA8] mb-2">
            Curaduría de Espacios
          </div>
          <h2 className="text-2xl font-light tracking-tight md:text-3xl lg:text-4xl text-[#F6F4EE]">
            Estudios, Boxes y Santuarios
          </h2>
          <p className="mt-1.5 text-sm text-[#A39C91]">
            Curados por nuestra IA según tu disciplina, ubicación y confort somático.
          </p>
        </div>
        <div className="flex w-full gap-2 overflow-x-auto max-w-full md:overflow-visible pb-1 md:pb-0">
          <button
            onClick={() => {
              setShowOnlyFavorites(!showOnlyFavorites);
              setAiActive(false);
              setCategory("Todos");
            }}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
              showOnlyFavorites
                ? "border-[#C5BAA8] bg-[#C5BAA8]/15 text-[#E8E2D5]"
                : "border-[#262320] bg-[#141311] text-[#A39C91] hover:border-[#3D3833] hover:text-[#F6F4EE]"
            }`}
          >
            <Heart
              className={`h-3.5 w-3.5 ${showOnlyFavorites ? "fill-[#C5BAA8] text-[#C5BAA8]" : "text-[#7D766D]"}`}
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
                  ? "border-[#C5BAA8] bg-[#221F1B] text-[#F6F4EE] shadow-xs"
                  : "border-[#262320] bg-[#141311] text-[#A39C91] hover:border-[#3D3833] hover:text-[#F6F4EE]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* AI Searching State */}
      {isSearching && (
        <div className="mt-8 flex flex-col items-center justify-center py-20 rounded-3xl border border-dashed border-[#38332C] bg-[#141311] animate-pulse">
          <div className="flex items-center gap-3">
            <span className="h-5 w-5 border-2 border-[#C5BAA8] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium text-[#F6F4EE]">
              La IA de The Wellness Face está evaluando espacios afines...
            </p>
          </div>
          <p className="mt-2 text-xs text-[#7D766D]">
            Buscando coincidencias de disciplina, luz natural, profesores y metodologías...
          </p>
        </div>
      )}

      {/* AI Results Banner */}
      {aiActive && (
        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-[#171513] border border-[#2D2824] p-4.5 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-[#26221E] text-[#C5BAA8] border border-[#38332C]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#F6F4EE]">Curaduría inteligente personalizada</p>
              <p className="text-xs text-[#A39C91]">Criterio de búsqueda: "{aiQuery}"</p>
            </div>
          </div>
          <button
            onClick={() => {
              setAiActive(false);
              setCategory("Todos");
            }}
            className="text-xs font-semibold hover:underline flex items-center gap-1.5 text-[#C5BAA8] hover:text-[#F6F4EE] transition"
          >
            Restablecer curaduría <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {!isSearching && (
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {gyms.map((g, idx) => (
            <Link
              key={g.slug}
              to="/gym/$slug"
              params={{ slug: g.slug }}
              className="group block animate-fade-up"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#141311] border border-[#26221E] group-hover:border-[#3D3833] transition-all duration-500">
                <img
                  src={g.images[0]}
                  alt={g.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0D0C]/80 via-transparent to-transparent pointer-events-none" />

                <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-[#12110F]/85 border border-[#2E2A26] px-2.5 py-1 text-[10px] font-medium tracking-wide uppercase text-[#D8D2C5] backdrop-blur-md">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${g.isOpen ? "bg-emerald-400" : "bg-[#7D766D]"}`}
                  />
                  {g.isOpen ? "Abierto" : "Cerrado"}
                </div>

                {/* Heart favorite overlay button */}
                <button
                  onClick={(e) => toggleFavorite(g.slug, e)}
                  className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-[#12110F]/85 border border-[#2E2A26] text-[#A39C91] backdrop-blur-md transition hover:scale-105 hover:text-[#F6F4EE] active:scale-95"
                  title="Guardar en favoritos"
                >
                  <Heart
                    className={`h-3.5 w-3.5 transition-colors ${
                      favorites.includes(g.slug)
                        ? "fill-[#C5BAA8] text-[#C5BAA8]"
                        : "text-[#A39C91] hover:text-[#F6F4EE]"
                    }`}
                  />
                </button>

                {/* Match score overlay badge */}
                {aiActive && aiMatches[g.slug] && (
                  <div className="absolute right-[48px] top-3 flex items-center gap-1 rounded-full bg-[#1C1916]/90 border border-[#C5BAA8]/40 text-[#E8E2D5] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md animate-fade-in">
                    <Sparkles className="h-3 w-3 text-[#C5BAA8] animate-pulse" />
                    {aiMatches[g.slug].match}% Afinidad
                  </div>
                )}
              </div>
              <div className="mt-3.5 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-[15px] font-medium tracking-tight text-[#F6F4EE] group-hover:text-[#C5BAA8] transition-colors">
                    {g.name}
                  </div>
                  <div className="mt-0.5 flex items-center gap-1 text-xs text-[#8C857B]">
                    <MapPin className="h-3 w-3 text-[#C5BAA8]" /> {g.neighborhood}, {g.city}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-[#D8D2C5]">
                  <Star className="h-3.5 w-3.5 fill-[#C5BAA8] text-[#C5BAA8]" />
                  {g.rating.toFixed(1)}
                </div>
              </div>

              {/* AI Explanation badge */}
              {aiActive && aiMatches[g.slug] && aiMatches[g.slug].explanation && (
                <div className="mt-1.5 flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-[#D4CEBA] bg-[#221F1B] border border-[#38332C] rounded-md px-2 py-0.5 w-fit">
                  <Sparkles className="h-2.5 w-2.5 text-[#C5BAA8]" />
                  <span className="truncate">{aiMatches[g.slug].explanation}</span>
                </div>
              )}

              <div className="mt-1 text-xs text-[#7D766D] tracking-wide">
                {g.tags.slice(0, 2).join(" · ")}
              </div>
              <div className="mt-1.5 text-xs">
                <span className="font-semibold text-[#F6F4EE]">
                  ${g.priceFrom.toLocaleString("es-AR")}
                </span>
                <span className="text-[#8C857B]"> / mes desde</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!isSearching && gyms.length === 0 && (
        <div className="mt-8 flex flex-col items-center justify-center py-20 rounded-3xl border border-dashed border-[#26221E] bg-[#141311] text-center px-6">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#1C1A17] text-[#C5BAA8] mb-4 border border-[#2E2924]">
            {showOnlyFavorites ? (
              <Heart className="h-6 w-6 text-[#C5BAA8] fill-[#C5BAA8] animate-pulse" />
            ) : (
              <Star className="h-6 w-6 text-[#C5BAA8]" />
            )}
          </div>
          <h3 className="text-base font-medium text-[#F6F4EE]">
            {showOnlyFavorites ? "No tienes espacios guardados" : "No encontramos coincidencias"}
          </h3>
          <p className="mt-1 text-sm text-[#A39C91] max-w-sm">
            {showOnlyFavorites
              ? "Explora nuestra lista de estudios y haz clic en el corazón para guardarlos en tus favoritos."
              : "Prueba ajustando los filtros o realizando otra búsqueda en el concierge."}
          </p>
          {showOnlyFavorites && (
            <Button
              onClick={() => setShowOnlyFavorites(false)}
              className="mt-6 rounded-full text-xs bg-[#E8E2D5] text-[#141312] hover:bg-[#F6F4EE]"
            >
              Ver todos los espacios
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
