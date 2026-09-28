import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { GYMS } from "@/lib/gyms";
import {
  LandingHero,
  LandingStats,
  LandingGymSearch,
  LandingValueSection,
  LandingTestimonials,
  LandingFAQ,
  LandingCTASection,
} from "@/components/landing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The wellness face - Tu bienestar, bien elegido." },
      {
        name: "description",
        content:
          "The wellness face - Tu bienestar, bien elegido. Buscador con IA de gimnasios, fitness centers y studios. Reserva clases y gestiona tu membresía.",
      },
      { property: "og:title", content: "The wellness face - Tu bienestar, bien elegido." },
      {
        property: "og:description",
        content:
          "The wellness face - Tu bienestar, bien elegido. Buscador con IA de gimnasios, fitness centers y studios.",
      },
    ],
  }),
  component: Index,
});

const CATEGORIES = [
  "Todos",
  "CrossFit",
  "Yoga",
  "Pilates",
  "Funcional",
  "Spinning",
  "Powerlifting",
  "Boutique",
];

export function Index({ hideHeader = false }: { hideHeader?: boolean } = {}) {
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
      const element = document.getElementById("descubrir");
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

        // Check price
        if (
          q.includes("bajo") ||
          q.includes("barato") ||
          q.includes("económico") ||
          q.includes("<") ||
          q.includes("menos")
        ) {
          const matchNum = q.match(/\d+[.\d+]*/);
          if (matchNum) {
            const parsedPrice = parseInt(matchNum[0].replace(".", ""));
            if (g.priceFrom <= parsedPrice) {
              matchScore += 15;
              explanationParts.push(
                `$${g.priceFrom.toLocaleString("es-AR")} < $${parsedPrice.toLocaleString("es-AR")}`,
              );
            } else {
              matchScore -= 25;
            }
          } else {
            if (g.priceFrom < 25000) {
              matchScore += 10;
              explanationParts.push(`Precio bajo ($${g.priceFrom.toLocaleString("es-AR")})`);
            }
          }
        }

        // Specific phrases match
        if (
          q.includes("musculación") &&
          g.tags.some((t) => t.toLowerCase().includes("musculación"))
        ) {
          matchScore += 10;
          explanationParts.push("Sala de musculación");
        }
        if (q.includes("crossfit") && g.tags.some((t) => t.toLowerCase().includes("crossfit"))) {
          matchScore += 10;
          explanationParts.push("CrossFit WOD");
        }
        if (q.includes("yoga") && g.tags.some((t) => t.toLowerCase().includes("yoga"))) {
          matchScore += 10;
          explanationParts.push("Yoga Vinyasa");
        }
        if (q.includes("pilates") && g.tags.some((t) => t.toLowerCase().includes("pilates"))) {
          matchScore += 10;
          explanationParts.push("Pilates Reformer");
        }
        if (
          q.includes("24 horas") &&
          (g.description.toLowerCase().includes("24 h") || g.hours.includes("24"))
        ) {
          matchScore += 15;
          explanationParts.push("Abierto 24h");
        }

        // Caps score at 99
        matchScore = Math.min(matchScore, 99);

        // Filter by neighborhood if mentioned
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
    }, 1500);
  };

  const baseGyms = aiActive
    ? GYMS.filter((g) => g.slug in aiMatches).sort(
        (a, b) => (aiMatches[b.slug]?.match || 0) - (aiMatches[a.slug]?.match || 0),
      )
    : category === "Todos"
      ? GYMS
      : GYMS.filter((g) => g.tags.some((t) => t.toLowerCase().includes(category.toLowerCase())));

  const gyms = baseGyms.filter((g) => !showOnlyFavorites || favorites.includes(g.slug));

  return (
    <div className="min-h-screen bg-background">
      {!hideHeader && <SiteHeader />}
      <LandingHero onSearch={handleSearch} isSearching={isSearching} />
      <LandingStats />
      <LandingGymSearch
        gyms={gyms}
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
      <LandingValueSection />
      <LandingTestimonials />
      <LandingFAQ />
      <LandingCTASection />
      <SiteFooter />
    </div>
  );
}
