import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { Sparkles, X, ArrowRight, Grid3X3 } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { GYMS } from "@/lib/gyms";
import {
  MarketplaceCategoryRibbon,
  MarketplaceShelfRow,
  MarketplaceBottomDock,
  LandingGymSearch,
  LandingFAQ,
} from "@/components/landing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The wellness face - Tu bienestar, bien elegido." },
      {
        name: "description",
        content:
          "The wellness face - Marketplace de bienestar asistido por IA. Estudios de Pilates, boxes de Hyrox, yoga, funcional y recuperación.",
      },
      { property: "og:title", content: "The wellness face - Marketplace de Bienestar" },
      {
        property: "og:description",
        content:
          "Descubrí y reservá en los mejores estudios de Pilates, Hyrox, Yoga y CrossFit con asistencia inteligente en tiempo real.",
      },
    ],
  }),
  component: Index,
});

const CATEGORIES = [
  "Todos",
  "Pilates",
  "Hyrox",
  "Yoga",
  "Funcional",
  "CrossFit",
  "Powerlifting",
  "Recuperación",
  "Boutique",
];

const LOCATIONS = [
  "Palermo, CABA",
  "Recoleta, CABA",
  "Belgrano, CABA",
  "Villa Crespo, CABA",
  "Todas las zonas",
];

export function Index({ hideHeader = false }: { hideHeader?: boolean } = {}) {
  const [selectedLocation, setSelectedLocation] = useState("Palermo, CABA");
  const [category, setCategory] = useState("Todos");
  const [isSearching, setIsSearching] = useState(false);
  const [aiActive, setAiActive] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [aiMatches, setAiMatches] = useState<
    Record<string, { match: number; explanation: string }>
  >({});

  const [favorites, setFavorites] = useState<string[]>([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [showAllGrid, setShowAllGrid] = useState(false);

  useEffect(() => {
    const saved =
      localStorage.getItem("wellness_favorites") || localStorage.getItem("shakerfy_favorites");
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const toggleFavorite = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = favorites.includes(slug)
      ? favorites.filter((s) => s !== slug)
      : [...favorites, slug];
    setFavorites(next);
    localStorage.setItem("wellness_favorites", JSON.stringify(next));
  };

  const handleSearch = (query: string) => {
    setIsSearching(true);
    setAiActive(false);

    setTimeout(() => {
      const q = query.toLowerCase();
      const newMatches: Record<string, { match: number; explanation: string }> = {};

      GYMS.forEach((g) => {
        let matchScore = 70;
        const explanationParts: string[] = [];

        g.tags.forEach((tag) => {
          if (q.includes(tag.toLowerCase())) {
            matchScore += 15;
            explanationParts.push(tag);
          }
        });

        if (q.includes(g.neighborhood.toLowerCase())) {
          matchScore += 20;
          explanationParts.push(g.neighborhood);
        }

        if (
          (q.includes("pilates") || q.includes("reformer")) &&
          g.tags.some((t) => t.toLowerCase().includes("pilates") || t.toLowerCase().includes("reformer"))
        ) {
          matchScore += 15;
          explanationParts.push("Pilates Reformer");
        }
        if (
          q.includes("hyrox") &&
          g.tags.some((t) => t.toLowerCase().includes("funcional") || t.toLowerCase().includes("wod"))
        ) {
          matchScore += 15;
          explanationParts.push("Preparación Hyrox");
        }

        matchScore = Math.min(matchScore, 99);

        if (matchScore >= 50) {
          newMatches[g.slug] = {
            match: matchScore,
            explanation:
              explanationParts.length > 0 ? `Coincide en: ${explanationParts.join(", ")}` : "",
          };
        }
      });

      setAiMatches(newMatches);
      setAiQuery(query);
      setAiActive(true);
      setIsSearching(false);
    }, 900);
  };

  // Curated Shelves Data
  const popularGyms = useMemo(() => GYMS.filter((g) => (g.rating || 0) >= 4.7), []);
  const hyroxGyms = useMemo(
    () =>
      GYMS.filter((g) =>
        g.tags.some((t) =>
          ["powerlifting", "crossfit", "funcional", "hiit", "coaching"].includes(t.toLowerCase()),
        ),
      ),
    [],
  );
  const pilatesGyms = useMemo(
    () =>
      GYMS.filter((g) =>
        g.tags.some((t) =>
          [
            "yoga",
            "pilates",
            "pilates reformer",
            "postural",
            "meditación",
            "boutique",
          ].includes(t.toLowerCase()),
        ),
      ),
    [],
  );

  // Filtered Gyms for Full Search Grid
  const baseGyms = aiActive
    ? GYMS.filter((g) => g.slug in aiMatches).sort(
        (a, b) => (aiMatches[b.slug]?.match || 0) - (aiMatches[a.slug]?.match || 0),
      )
    : category === "Todos"
      ? GYMS
      : GYMS.filter((g) => g.tags.some((t) => t.toLowerCase().includes(category.toLowerCase())));

  const filteredByLocationGyms =
    selectedLocation === "Todas las zonas"
      ? baseGyms
      : baseGyms.filter((g) =>
          selectedLocation.toLowerCase().includes(g.neighborhood.toLowerCase()),
        );

  const displayedGyms = filteredByLocationGyms.filter(
    (g) => !showOnlyFavorites || favorites.includes(g.slug),
  );

  const isFilterActive = aiActive || category !== "Todos" || showOnlyFavorites;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 pb-28 sm:pb-32">
      {/* 1. Main Header */}
      {!hideHeader && <SiteHeader variant="sanctuary" />}

      {/* 2. Unified Category Ribbon with Location Selector (Single sticky layer) */}
      <MarketplaceCategoryRibbon
        selectedLocation={selectedLocation}
        locations={LOCATIONS}
        onSelectLocation={setSelectedLocation}
        activeCategory={category}
        onSelectCategory={(c) => {
          setCategory(c);
          setAiActive(false);
          setShowOnlyFavorites(false);
          setShowAllGrid(false);
        }}
        categories={CATEGORIES}
        favoritesCount={favorites.length}
        showOnlyFavorites={showOnlyFavorites}
        onToggleFavorites={() => {
          setShowOnlyFavorites(!showOnlyFavorites);
          setAiActive(false);
          setCategory("Todos");
          setShowAllGrid(false);
        }}
      />

      {/* 3. Marketplace Body */}
      <main id="marketplace-feed" className="w-full">
        {/* Active AI Search Banner */}
        {aiActive && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
            <div className="rounded-3xl border border-border bg-card p-4 sm:p-5 flex items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Búsqueda Asistida con IA
                  </span>
                  <p className="text-xs sm:text-sm text-foreground font-medium truncate">
                    Espacios afines a: <strong className="font-bold">"{aiQuery}"</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setAiActive(false);
                  setAiQuery("");
                }}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-full border border-border hover:bg-muted transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Limpiar filtro</span>
              </button>
            </div>
          </div>
        )}

        {/* MODE A: Default Browse Mode -> Clean Curated Shelves (Zero duplication) */}
        {!isFilterActive && !showAllGrid && (
          <div className="space-y-6 pt-4">
            {/* Shelf 1: Populares cerca tuyo */}
            <MarketplaceShelfRow
              title="Populares en tu zona"
              subtitle="Los estudios y boxes con mejores valoraciones verificadas"
              badge="Top Selección"
              gyms={popularGyms}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onSeeAll={() => setShowAllGrid(true)}
            />

            {/* Shelf 2: Tendencia Hyrox & Fuerza */}
            <MarketplaceShelfRow
              title="Tendencia Hyrox & Fuerza"
              subtitle="Racks de competición, levantamiento olímpico y acondicionamiento"
              badge="Alto Rendimiento"
              gyms={hyroxGyms}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onSeeAll={() => {
                setCategory("Hyrox");
              }}
            />

            {/* Shelf 3: Santuarios de Pilates & Yoga */}
            <MarketplaceShelfRow
              title="Santuarios de Pilates & Calma"
              subtitle="Reformer con grupos reducidos, alineación postural y luz natural"
              badge="Confort Somático"
              gyms={pilatesGyms}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onSeeAll={() => {
                setCategory("Pilates");
              }}
            />

            {/* Clean action to view the entire catalog */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-12 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAllGrid(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-card hover:bg-muted text-foreground text-xs font-semibold transition-all duration-200 cursor-pointer shadow-xs hover:border-foreground/30"
              >
                <Grid3X3 className="w-4 h-4 text-muted-foreground" />
                <span>Explorar los {GYMS.length} estudios en lista completa</span>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>
        )}

        {/* MODE B: Filtered Grid Mode -> Only shown when searching, picking category or clicking view all */}
        {(isFilterActive || showAllGrid) && (
          <div className="pt-2">
            {showAllGrid && !isFilterActive && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Mostrando catálogo completo</span>
                <button
                  type="button"
                  onClick={() => setShowAllGrid(false)}
                  className="text-xs font-semibold text-foreground hover:text-muted-foreground transition cursor-pointer"
                >
                  ← Volver a estantes destacados
                </button>
              </div>
            )}
            <LandingGymSearch
              gyms={displayedGyms}
              category={category}
              setCategory={setCategory}
              categories={CATEGORIES}
              isSearching={isSearching}
              aiActive={aiActive}
              setAiActive={setAiActive}
              aiQuery={aiQuery}
              aiMatches={aiMatches}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              showOnlyFavorites={showOnlyFavorites}
              setShowOnlyFavorites={setShowOnlyFavorites}
              hideCategoryBar={true}
              customTitle={
                aiActive
                  ? "Coincidencias de Búsqueda"
                  : showOnlyFavorites
                    ? "Tus Espacios Favoritos"
                    : category !== "Todos"
                      ? `Estudios de ${category}`
                      : "Catálogo Completo de Espacios"
              }
              customSubtitle={
                aiActive
                  ? `Ordenados por afinidad para tu consulta: "${aiQuery}"`
                  : `${displayedGyms.length} espacios disponibles en ${selectedLocation}`
              }
            />
          </div>
        )}

        {/* Discreet FAQ section at the end for trust */}
        <div className="border-t border-border pt-8">
          <LandingFAQ />
        </div>
      </main>

      {/* 4. Footer */}
      <SiteFooter variant="sanctuary" />

      {/* 5. Floating Thumb-Zone Prompt Dock (DoorDash Style) */}
      <MarketplaceBottomDock
        onSearch={handleSearch}
        isSearching={isSearching}
        currentQuery={aiQuery}
        onClearQuery={() => {
          setAiActive(false);
          setAiQuery("");
        }}
      />
    </div>
  );
}
