import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { MapPin, Sparkles, X, ChevronDown, Check } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { GYMS } from "@/lib/gyms";
import {
  MarketplaceCategoryRibbon,
  MarketplaceShelfRow,
  MarketplaceBottomDock,
  LandingGymSearch,
  LandingStats,
  LandingValueSection,
  LandingTestimonials,
  LandingFAQ,
  LandingCTASection,
} from "@/components/landing";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The wellness face - Tu bienestar, bien elegido." },
      {
        name: "description",
        content:
          "The wellness face - Tu bienestar, bien elegido. Marketplace asistido por IA de estudios de Pilates, boxes de Hyrox, yoga, funcional y centros de recuperación seleccionados.",
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

    // Scroll smoothly to discover section
    setTimeout(() => {
      const element = document.getElementById("marketplace-feed");
      element?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);

    // Simulate search processing
    setTimeout(() => {
      const q = query.toLowerCase();
      const newMatches: Record<string, { match: number; explanation: string }> = {};

      GYMS.forEach((g) => {
        let matchScore = 70; // baseline
        const explanationParts: string[] = [];

        // Check tags / disciplines
        g.tags.forEach((tag) => {
          if (q.includes(tag.toLowerCase())) {
            matchScore += 15;
            explanationParts.push(tag);
          }
        });

        // Check neighborhood
        if (q.includes(g.neighborhood.toLowerCase())) {
          matchScore += 20;
          explanationParts.push(g.neighborhood);
        }

        // Specific phrases match
        if (
          q.includes("musculación") &&
          g.tags.some((t) => t.toLowerCase().includes("musculación"))
        ) {
          matchScore += 10;
          explanationParts.push("Musculación");
        }
        if (q.includes("crossfit") && g.tags.some((t) => t.toLowerCase().includes("crossfit"))) {
          matchScore += 10;
          explanationParts.push("CrossFit WOD");
        }
        if (q.includes("yoga") && g.tags.some((t) => t.toLowerCase().includes("yoga"))) {
          matchScore += 10;
          explanationParts.push("Yoga Vinyasa");
        }
        if (
          (q.includes("pilates") || q.includes("reformer")) &&
          g.tags.some((t) => t.toLowerCase().includes("pilates") || t.toLowerCase().includes("reformer"))
        ) {
          matchScore += 15;
          explanationParts.push("Pilates Reformer");
        }
        if (q.includes("hyrox") && (g.tags.some((t) => t.toLowerCase().includes("funcional") || t.toLowerCase().includes("wod")))) {
          matchScore += 15;
          explanationParts.push("Preparación Hyrox");
        }
        if (
          q.includes("24 horas") &&
          (g.description.toLowerCase().includes("24 h") || g.hours.includes("24"))
        ) {
          matchScore += 15;
          explanationParts.push("Abierto 24h");
        }

        matchScore = Math.min(matchScore, 99);

        // Filter by neighborhood if explicitly mentioned
        const hasNeighborhoodInQuery = ["palermo", "recoleta", "villa crespo", "belgrano"].some(
          (n) => q.includes(n),
        );
        if (hasNeighborhoodInQuery && !q.includes(g.neighborhood.toLowerCase())) {
          matchScore -= 45;
        }

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
    }, 1200);
  };

  // Curated Shelves Data
  const popularGyms = useMemo(
    () => GYMS.filter((g) => (g.rating || 0) >= 4.7),
    [],
  );

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
    <div className="min-h-screen bg-[#0E0D0C] text-[#F6F4EE] selection:bg-[#C5BAA8] selection:text-[#0E0D0C] pb-24 sm:pb-28">
      {/* 1. Main Header */}
      {!hideHeader && <SiteHeader variant="sanctuary" />}

      {/* 2. Marketplace Sub-Navbar: Location & Quick Status */}
      <div className="w-full bg-[#141311] border-b border-[#262320] px-4 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
          {/* Location Dropdown (DoorDash style 'CASA v') */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1.5 font-semibold text-[#F6F4EE] hover:text-white transition cursor-pointer outline-none">
              <MapPin className="w-3.5 h-3.5 text-[#C5BAA8]" />
              <span>{selectedLocation}</span>
              <ChevronDown className="w-3 h-3 text-[#A39C91]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="bg-[#171513] border-[#2C2824] text-[#F6F4EE] rounded-2xl shadow-2xl p-1 min-w-[200px]"
            >
              {LOCATIONS.map((loc) => (
                <DropdownMenuItem
                  key={loc}
                  onClick={() => setSelectedLocation(loc)}
                  className="flex items-center justify-between text-xs px-3 py-2 rounded-xl cursor-pointer hover:bg-[#25221E] focus:bg-[#25221E]"
                >
                  <span>{loc}</span>
                  {selectedLocation === loc && <Check className="w-3.5 h-3.5 text-[#C5BAA8]" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Quick Info Pill */}
          <div className="flex items-center gap-2 text-[11px] text-[#A39C91]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">24 estudios y boxes con acceso directo</span>
            <span className="sm:hidden">24 espacios activos</span>
          </div>
        </div>
      </div>

      {/* 3. Horizontal Categories Ribbon (Sticky Top) */}
      <MarketplaceCategoryRibbon
        activeCategory={category}
        onSelectCategory={(c) => {
          setCategory(c);
          setAiActive(false);
          setShowOnlyFavorites(false);
        }}
        categories={CATEGORIES}
        favoritesCount={favorites.length}
        showOnlyFavorites={showOnlyFavorites}
        onToggleFavorites={() => {
          setShowOnlyFavorites(!showOnlyFavorites);
          setAiActive(false);
          setCategory("Todos");
        }}
      />

      {/* 4. Marketplace Feed Body */}
      <main id="marketplace-feed" className="w-full">
        {/* Active AI Search Banner */}
        {aiActive && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
            <div className="rounded-3xl border border-[#C5BAA8]/40 bg-[#171513] p-4 sm:p-5 flex items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-amber-400/10 text-amber-300 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5BAA8] block">
                    Búsqueda Asistida con IA
                  </span>
                  <p className="text-xs sm:text-sm text-[#F6F4EE] font-medium truncate">
                    Espacios afines a: <strong className="text-white font-bold">"{aiQuery}"</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setAiActive(false);
                  setAiQuery("");
                }}
                className="text-xs font-semibold text-[#A39C91] hover:text-[#F6F4EE] flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20 transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Limpiar filtro</span>
              </button>
            </div>
          </div>
        )}

        {/* If Default Browse Mode (no search/filter active): Show Themed Shelves */}
        {!isFilterActive && (
          <div className="space-y-2 pt-2">
            {/* Shelf 1: Populares cerca tuyo */}
            <MarketplaceShelfRow
              title="Populares en tu zona"
              subtitle="Los estudios y boxes con mejores valoraciones verificadas"
              badge="Top Selección"
              gyms={popularGyms}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />

            {/* Shelf 2: Tendencia Hyrox & Fuerza */}
            <MarketplaceShelfRow
              title="Tendencia Hyrox & Fuerza"
              subtitle="Racks de competición, levantamiento olímpico y acondicionamiento"
              badge="Alto Rendimiento"
              gyms={hyroxGyms}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />

            {/* Shelf 3: Santuarios de Pilates & Yoga */}
            <MarketplaceShelfRow
              title="Santuarios de Pilates & Calma"
              subtitle="Reformer con grupos reducidos, alineación postural y luz natural"
              badge="Confort Somático"
              gyms={pilatesGyms}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          </div>
        )}

        {/* Comprehensive Grid with Filters */}
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
        />

        {/* Secondary Trust & Narrative Sections */}
        <LandingStats />
        <LandingValueSection />
        <LandingTestimonials />
        <LandingFAQ />
        <LandingCTASection />
      </main>

      {/* 5. Footer */}
      <SiteFooter variant="sanctuary" />

      {/* 6. Floating Thumb-Zone Prompt Dock (DoorDash Style) */}
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
