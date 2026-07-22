import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  ArrowUpRight,
  Plus,
  Mic,
  ArrowUp,
  Star,
  MapPin,
  Sparkles,
  ChevronDown,
  X,
  Heart,
} from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Typewriter } from "@/components/typewriter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GYMS } from "@/lib/gyms";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shakerfy — Encuentra tu gimnasio con IA" },
      {
        name: "description",
        content:
          "Buscador con IA de gimnasios, fitness centers y studios. Reserva clases y gestiona tu membresía.",
      },
      { property: "og:title", content: "Shakerfy — Encuentra tu gimnasio con IA" },
      {
        property: "og:description",
        content: "Buscador con IA de gimnasios, fitness centers y studios.",
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
    const saved = localStorage.getItem("shakerfy_favorites");
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
    localStorage.setItem("shakerfy_favorites", JSON.stringify(next));
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
        let explanationParts: string[] = [];

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
          const matchNum = q.match(/\d+[\.\d+]*/);
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
      <Hero onSearch={handleSearch} isSearching={isSearching} />

      <StatsSection />

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
          <div className="-mx-6 flex w-screen gap-2 overflow-x-auto px-6 md:mx-0 md:w-auto md:overflow-visible">
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
            {CATEGORIES.map((c) => (
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
                La IA de Shakerfy está analizando gimnasios...
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

      <ValueSection />

      <TestimonialsSection />

      <FAQSection />

      <StudentCTASection />

      <SiteFooter />
    </div>
  );
}

// ── SmartAssistant — simulated AI conversation as structured Q&A ──────────
// Answered steps stay visible (with ✓). New question appears below.
// ponytail: decision tree in a static array — no AI endpoint needed for demo.

type AIQuestion = {
  question: string;
  hint: string;
  chips: { emoji: string; label: string; value: string }[];
};

const AI_QUESTIONS: AIQuestion[] = [
  {
    question: "¿Qué tipo de actividad te interesa?",
    hint: "Podés elegir una o simplemente saltear si no lo tenés claro todavía.",
    chips: [
      { emoji: "🏋️", label: "Musculación y fuerza", value: "musculación fuerza" },
      { emoji: "🧘", label: "Yoga o pilates", value: "yoga pilates" },
      { emoji: "🥊", label: "Funcional o CrossFit", value: "funcional crossfit" },
      { emoji: "🚴", label: "Cardio o spinning", value: "cardio spinning" },
      { emoji: "🤸", label: "Clases grupales variadas", value: "clases grupales" },
    ],
  },
  {
    question: "¿En qué zona de Buenos Aires preferís entrenar?",
    hint: "Te mostramos los mejores gimnasios de esa área.",
    chips: [
      { emoji: "📍", label: "Palermo", value: "Palermo" },
      { emoji: "📍", label: "Belgrano", value: "Belgrano" },
      { emoji: "📍", label: "Recoleta", value: "Recoleta" },
      { emoji: "📍", label: "Villa Crespo", value: "Villa Crespo" },
      { emoji: "🗺️", label: "Me da igual la zona", value: "" },
    ],
  },
  {
    question: "¿Cuándo preferís entrenar?",
    hint: "Así filtramos gimnasios con horarios disponibles para vos.",
    chips: [
      { emoji: "🌅", label: "Mañana (6 a 12 hs)", value: "mañana horario matutino" },
      { emoji: "☀️", label: "Mediodía (12 a 16 hs)", value: "mediodía" },
      { emoji: "🌆", label: "Tarde/noche (16 a 21 hs)", value: "tarde noche" },
      { emoji: "🕐", label: "Necesito 24 horas", value: "24 horas" },
      { emoji: "🤷", label: "Cualquier horario", value: "" },
    ],
  },
  {
    question: "¿Cuánto querés gastar por mes?",
    hint: "Te ayudamos a encontrar opciones que se ajusten a tu presupuesto.",
    chips: [
      { emoji: "💚", label: "Hasta $15.000", value: "económico barato precio bajo" },
      { emoji: "💛", label: "$15.000 a $35.000", value: "precio medio" },
      { emoji: "💙", label: "Más de $35.000", value: "premium high-end" },
      { emoji: "🤷", label: "El precio no importa", value: "" },
    ],
  },
];

function SmartAssistant({
  onSearch,
  onClose,
}: {
  onSearch: (query: string) => void;
  onClose: () => void;
}) {
  // Each answered step: { questionIdx, chipLabel, chipValue }
  const [answers, setAnswers] = useState<{ idx: number; label: string; value: string }[]>([]);
  const currentIdx = answers.length;
  const isDone = currentIdx >= AI_QUESTIONS.length;

  const handleChip = (chip: { label: string; value: string }) => {
    const next = [...answers, { idx: currentIdx, label: chip.label, value: chip.value }];
    setAnswers(next);

    if (next.length >= AI_QUESTIONS.length) {
      // All questions answered → fire search
      const query = next
        .map((a) => a.value)
        .filter(Boolean)
        .join(" ")
        .trim();
      onSearch(query || "gimnasio");
    }
  };

  const handleSkip = () => {
    handleChip({ label: "Sin preferencia", value: "" });
  };

  const handleSearchNow = () => {
    const query = answers
      .map((a) => a.value)
      .filter(Boolean)
      .join(" ")
      .trim();
    onSearch(query || "gimnasio");
  };

  const currentQ = AI_QUESTIONS[currentIdx];

  return (
    <div className="w-full max-w-2xl px-2 mt-3 animate-in slide-in-from-top-2 fade-in duration-300">
      <div className="rounded-3xl border border-border bg-background overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-foreground flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-background fill-background" />
            </div>
            <span className="text-xs font-semibold text-foreground">Shakerfy IA</span>
            <span className="text-[10px] text-muted-foreground font-medium">
              — te ayuda a encontrar el gym ideal
            </span>
          </div>
          <button
            onClick={onClose}
            className="grid h-6 w-6 place-items-center rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Answered steps — stay visible with ✓ */}
          {answers.map((a, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="mt-0.5 h-5 w-5 rounded-full bg-foreground/8 border border-border flex items-center justify-center shrink-0">
                <svg className="h-2.5 w-2.5 text-foreground" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-[11px] text-muted-foreground font-medium">
                  {AI_QUESTIONS[i].question}
                </p>
                <p className="text-xs font-semibold text-foreground mt-0.5">{a.label}</p>
              </div>
            </div>
          ))}

          {/* Separator if there are answers above */}
          {answers.length > 0 && !isDone && <div className="border-t border-border/40" />}

          {/* Current question */}
          {!isDone && currentQ && (
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{currentQ.question}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{currentQ.hint}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentQ.chips.map((chip) => (
                  <button
                    key={chip.label}
                    onClick={() => handleChip(chip)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-border bg-background text-xs font-medium text-foreground hover:border-foreground/50 hover:bg-secondary/60 transition-all duration-150 active:scale-95"
                  >
                    <span>{chip.emoji}</span>
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer actions */}
          <div className="flex items-center justify-between pt-1">
            {/* Progress dots */}
            <div className="flex items-center gap-1">
              {AI_QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i < answers.length
                      ? "w-4 bg-foreground"
                      : i === answers.length
                        ? "w-4 bg-foreground/40"
                        : "w-1.5 bg-border"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              {!isDone && (
                <button
                  onClick={handleSkip}
                  className="text-[11px] text-muted-foreground hover:text-foreground transition font-medium"
                >
                  Saltear →
                </button>
              )}
              {answers.length > 0 && (
                <button
                  onClick={handleSearchNow}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-foreground text-background text-xs font-semibold hover:bg-foreground/90 transition active:scale-95"
                >
                  <ArrowUpRight className="h-3 w-3" />
                  Buscar ahora
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero({
  onSearch,
  isSearching,
}: {
  onSearch: (query: string) => void;
  isSearching: boolean;
}) {
  const handleSearch = (q: string) => {
    onSearch(q);
  };

  return (
    <section className="relative overflow-hidden pb-24 pt-24 md:pb-36 md:pt-32">
      {/* Animated Pastel Orbs Background (Restricted to Hero) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-90"
      >
        <div
          className="absolute -right-[200px] -top-[200px] h-[400px] w-[400px] rounded-full bg-[#ff7b7c]/75 blur-[70px]"
          style={{ animation: "orb1 25s infinite ease-in-out" }}
        />
        <div
          className="absolute -left-[250px] top-[10%] h-[500px] w-[500px] rounded-full bg-[#aafc75]/75 blur-[70px]"
          style={{ animation: "orb2 28s infinite ease-in-out 1s" }}
        />
        <div
          className="absolute -bottom-[200px] -right-[150px] h-[400px] w-[400px] rounded-full bg-[#60f2fc]/75 blur-[80px]"
          style={{ animation: "orb3 30s infinite ease-in-out 3s" }}
        />
        {/* Smooth fade to background color at the bottom edge */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent z-10" />
      </div>
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-[42px] lg:text-[46px]">
          Encuentra donde entrenar como te lo imaginas
        </h1>
        <p className="mt-4 max-w-2xl text-balance text-[14px] text-muted-foreground/85 sm:text-[15px] md:text-[16px] lg:whitespace-nowrap">
          Busca, compara y reserva en los mejores gimnasios, fitness centers y studios con IA.
        </p>

        <PromptBox onSearch={handleSearch} isSearching={isSearching} />
      </div>
    </section>
  );
}

function PromptBox({
  onSearch,
  isSearching,
}: {
  onSearch: (query: string) => void;
  isSearching: boolean;
}) {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    ) {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "es-AR";

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue((prev) => (prev ? prev + " " + transcript : transcript));
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return alert("Tu navegador no soporta reconocimiento de voz.");
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue);
    }
  };

  return (
    <div className="mt-10 w-full max-w-2xl px-2 relative z-20">
      <form
        onSubmit={handleSubmit}
        className={`relative rounded-3xl border transition-all duration-300 bg-background p-5 text-left ${
          isSearching
            ? "border-foreground ring-2 ring-foreground/10"
            : isFocused
              ? "border-foreground"
              : "border-border/80"
        }`}
      >
        <div className="relative min-h-[64px] text-[15px] leading-relaxed">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder=""
            className="w-full min-h-[64px] bg-transparent text-foreground placeholder-transparent focus:outline-none resize-none border-none p-0 focus:ring-0"
            disabled={isSearching}
          />

          {!inputValue && !isFocused && (
            <div className="absolute inset-0 pointer-events-none text-muted-foreground select-none">
              <Typewriter
                phrases={[
                  "Quiero un gimnasio con sala de musculación cerca de Palermo bajo $20.000…",
                  "Buscame clases de yoga matutino en Recoleta…",
                  "Necesito un box de CrossFit con WOD a las 19hs…",
                  "Pilates reformer con grupos reducidos en Villa Crespo…",
                  "Estudio de spinning con luces y buena música en Belgrano…",
                  "Un gimnasio que abra 24 horas y tenga estacionamiento…",
                  "Clases de funcional al aire libre para los sábados a la mañana…",
                  "Lugar de powerlifting con discos olímpicos y barras buenas…",
                  "Busco clases de zumba o baile divertidas después del trabajo…",
                ]}
              />
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={toggleListening}
            className={`grid h-8 w-8 place-items-center rounded-full transition ${
              isListening
                ? "bg-red-500 text-white animate-pulse"
                : "text-muted-foreground hover:text-foreground"
            }`}
            disabled={isSearching}
          >
            <Mic className="h-4 w-4" />
          </button>
          <Button
            type="submit"
            size="icon"
            className={`h-8 w-8 rounded-full transition-all duration-300 ${
              inputValue.trim()
                ? "bg-foreground text-background hover:bg-foreground/90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
            disabled={isSearching || !inputValue.trim()}
          >
            {isSearching ? (
              <span className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
            ) : (
              <ArrowUp className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

function StudentCTASection() {
  return (
    <section className="relative overflow-hidden bg-foreground text-background border-t border-border">
      {/* Background radial effects */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -left-[10%] -top-[20%] h-[350px] w-[350px] rounded-full bg-[#FF3B5C]/35 blur-[80px]" />
        <div className="absolute -right-[10%] -bottom-[20%] h-[350px] w-[350px] rounded-full bg-[#00D2FF]/35 blur-[80px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-20 text-center sm:py-24">
        <Badge className="bg-background/10 text-background hover:bg-background/20 border-none rounded-full px-3 py-1 text-xs mb-6 backdrop-blur">
          Únete hoy gratis
        </Badge>
        <h2 className="text-balance text-3xl font-bold tracking-tight text-background sm:text-4xl md:text-5xl">
          Tu próximo entrenamiento empieza con Shakerfy
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-balance text-sm sm:text-base text-background/80">
          Crea tu cuenta de alumno, explora más de 150 gimnasios calificados y reserva clases o
          pases en segundos. Sin contratos a largo plazo.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/auth"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-background px-8 py-3 text-sm font-semibold text-foreground transition hover:bg-background/90"
          >
            Comenzar gratis
          </Link>
          <a
            href="#descubrir"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-background/20 px-8 py-3 text-sm font-semibold text-background transition hover:bg-background/10 hover:border-background/40"
          >
            Explorar gimnasios
          </a>
        </div>
        <div className="mt-12 flex items-center justify-center gap-6 text-xs text-background/60">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Registro en 30 segundos
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Cancelación flexible
          </div>
        </div>
      </div>
    </section>
  );
}

function ValueSection() {
  const items = [
    {
      k: "01",
      t: "Búsqueda con IA",
      d: "Describe lo que querés en lenguaje natural y nuestra IA filtra por ubicación, presupuesto, disciplina y horarios.",
    },
    {
      k: "02",
      t: "Reserva sin fricción",
      d: "Bookings de clases y pases de prueba con confirmación instantánea, sin llamados ni formularios.",
    },
    {
      k: "03",
      t: "Control de tu rutina",
      d: "Administra tus membresías, historial de clases y pagos desde un panel centralizado para ti.",
    },
  ];
  return (
    <section id="como-funciona" className="border-t border-border bg-secondary/40 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-3">
          {items.map((i) => (
            <div key={i.k} className="border-t border-foreground/10 pt-6">
              <div className="text-xs font-medium text-muted-foreground">{i.k}</div>
              <h3 className="mt-3 text-xl font-semibold tracking-tight">{i.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{i.d}</p>
            </div>
          ))}
        </div>

        {/* Blog Section */}
        <div id="blog" className="mt-32 scroll-mt-24">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Blog & Novedades
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Últimas tendencias, consejos y noticias del mundo fitness.
              </p>
            </div>
            <Link
              to="/blog"
              className="hidden sm:inline-flex items-center text-xs font-bold text-primary hover:underline"
            >
              Ver todos los artículos →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              to="/blog/$slug"
              params={{ slug: "el-auge-del-fitness-hibrido" }}
              className="group cursor-pointer space-y-3"
            >
              <div className="aspect-[16/9] overflow-hidden rounded-2xl bg-muted">
                <img
                  src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  alt="Blog 1"
                />
              </div>
              <div>
                <div className="text-xs font-medium text-muted-foreground">Tendencias · 4 min</div>
                <h3 className="mt-1 font-semibold tracking-tight group-hover:underline">
                  El auge del fitness híbrido
                </h3>
              </div>
            </Link>
            <Link
              to="/blog/$slug"
              params={{ slug: "guia-nutricion-pre-entrenamiento" }}
              className="group cursor-pointer space-y-3 hidden sm:block"
            >
              <div className="aspect-[16/9] overflow-hidden rounded-2xl bg-muted">
                <img
                  src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  alt="Blog 2"
                />
              </div>
              <div>
                <div className="text-xs font-medium text-muted-foreground">Nutrición · 5 min</div>
                <h3 className="mt-1 font-semibold tracking-tight group-hover:underline">
                  Guía completa de nutrición pre-entrenamiento
                </h3>
              </div>
            </Link>
            <Link
              to="/blog/$slug"
              params={{ slug: "crossfit-vs-funcional-diferencias" }}
              className="group cursor-pointer space-y-3 hidden lg:block"
            >
              <div className="aspect-[16/9] overflow-hidden rounded-2xl bg-muted">
                <img
                  src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  alt="Blog 3"
                />
              </div>
              <div>
                <div className="text-xs font-medium text-muted-foreground">
                  Entrenamiento · 6 min
                </div>
                <h3 className="mt-1 font-semibold tracking-tight group-hover:underline">
                  CrossFit vs Entrenamiento Funcional
                </h3>
              </div>
            </Link>
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Link
              to="/blog"
              className="inline-flex items-center text-xs font-bold text-primary hover:underline"
            >
              Ver todos los artículos →
            </Link>
          </div>
        </div>

        <div
          id="para-gimnasios"
          className="mt-32 flex flex-col items-start justify-between gap-6 rounded-3xl border border-border bg-background p-8 md:flex-row md:items-center md:p-12 scroll-mt-24"
        >
          <div>
            <Badge variant="secondary" className="rounded-full">
              Para partners
            </Badge>
            <h3 className="mt-3 max-w-xl text-2xl font-semibold tracking-tight md:text-3xl">
              Llevá tu Centro al próximo nivel con Shakerfy.
            </h3>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Aparecé en miles de búsquedas, gestioná membresías y digitalizá tus clases.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-full">
              Ver demo
            </Button>
            <Button className="rounded-full">Sumar mi centro</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { value: "150+", label: "Gimnasios y Studios", desc: "Curados y verificados" },
    { value: "25.000+", label: "Reservas exitosas", desc: "Clases y pases diarios" },
    { value: "4.9 ★", label: "Calificación promedio", desc: "Por miles de alumnos" },
    { value: "98%", label: "Satisfacción", desc: "En soporte y reservas" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-12 border-b border-border/60">
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {stats.map((s, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center text-center p-4 rounded-2xl bg-secondary/20 border border-border/40"
          >
            <span className="text-3xl font-bold tracking-tight text-foreground">{s.value}</span>
            <span className="mt-2 text-sm font-semibold text-foreground/90">{s.label}</span>
            <span className="mt-1 text-xs text-muted-foreground">{s.desc}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      name: "Martín Rodríguez",
      role: "Alumno (Palermo)",
      quote:
        "Buscaba un box de CrossFit que tuviera clases a las 7 AM cerca de mi oficina. La IA de Shakerfy lo encontró al instante. Reservar es comodísimo.",
      avatar: "MR",
    },
    {
      name: "Camila Varela",
      role: "Alumna (Recoleta)",
      quote:
        "Me mudé hace poco y no sabía dónde hacer Yoga. Gracias a la plataforma encontré un studio boutique con una energía increíble. 100% recomendado.",
      avatar: "CV",
    },
    {
      name: "Damián K.",
      role: "Dueño de Kraft Strength Club",
      quote:
        "Desde que nos sumamos como partners, las visitas para pases de prueba crecieron un 35%. La plataforma nos trajo público muy calificado.",
      avatar: "DK",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 border-t border-border/60">
      <div className="mb-12 text-center">
        <Badge variant="secondary" className="rounded-full">
          Testimonios
        </Badge>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
          Lo que dicen en la comunidad
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Alumnos y dueños de centros entrenando y creciendo juntos.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((t, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between p-6 rounded-2xl border border-border bg-background"
          >
            <p className="text-sm leading-relaxed text-muted-foreground/90 italic">"{t.quote}"</p>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary font-semibold text-foreground text-xs">
                {t.avatar}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">{t.name}</h4>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FAQSection() {
  const faqs = [
    {
      q: "¿Tiene costo adicional reservar a través de Shakerfy?",
      a: "No, en Shakerfy mostramos los mismos precios directos de los gimnasios. No cobramos comisiones extras ni cargos ocultos a los alumnos.",
    },
    {
      q: "¿Cómo funciona la búsqueda asistida por IA?",
      a: "Nuestra IA analiza tu descripción en lenguaje natural (ej. 'clases de yoga matutinas bajo $25.000 en Belgrano') y cruza los datos de ubicación, precios, horarios de clases y equipamiento de nuestra base para sugerirte las mejores opciones.",
    },
    {
      q: "¿Qué pasa si quiero cancelar una reserva de clase?",
      a: "Podés cancelar cualquier reserva directamente desde tu panel de usuario. Las políticas de cancelación (tiempo límite) dependen de cada gimnasio, pero normalmente es hasta 2 horas antes de la clase.",
    },
    {
      q: "Tengo un centro de entrenamiento, ¿cómo me registro?",
      a: "Hacé clic en el botón 'Sumar mi centro' al final de la página, completá el formulario de tu gimnasio y nos pondremos en contacto para ayudarte a configurar tu perfil de partner en minutos.",
    },
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="mx-auto max-w-3xl px-6 py-24 border-t border-border/60">
      <div className="mb-12 text-center">
        <Badge variant="secondary" className="rounded-full">
          FAQ
        </Badge>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
          Preguntas Frecuentes
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Todo lo que necesitas saber sobre el uso de la plataforma.
        </p>
      </div>
      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="border border-border rounded-xl bg-background overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="flex w-full items-center justify-between p-5 text-left font-medium text-sm text-foreground hover:bg-secondary/20 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`transition-all duration-200 ease-in-out ${
                  isOpen
                    ? "max-h-[160px] border-t border-border p-5 bg-secondary/5"
                    : "max-h-0 overflow-hidden"
                }`}
              >
                <p className="text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
