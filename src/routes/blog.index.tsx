import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Search,
  Clock,
  ArrowRight,
  Sparkles,
  Tag,
  BookOpen,
  User,
  Calendar,
  Share2,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BLOG_POSTS, type BlogPost } from "@/lib/blogs";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog & Novedades — Shakerfy" },
      {
        name: "description",
        content:
          "Tendencias en entrenamiento, nutrición deportiva, salud y gestión de gimnasios inteligentes.",
      },
      { property: "og:title", content: "Blog & Novedades — Shakerfy" },
      {
        property: "og:description",
        content:
          "Artículos y guías sobre fitness, nutrición, entrenamiento y tecnología para gimnasios.",
      },
    ],
  }),
  component: BlogIndexPage,
});

const CATEGORIES = [
  "Todos",
  "Tendencias",
  "Nutrición",
  "Entrenamiento",
  "Gestión & Gimnasios",
  "Bienestar & Salud",
  "Tecnología Fitness",
];

function BlogIndexPage() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState("");

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchesCategory = selectedCategory === "Todos" || post.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q)) ||
        post.author.name.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const featuredPost = useMemo(() => {
    return BLOG_POSTS.find((p) => p.featured) || BLOG_POSTS[0];
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput("");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20">
      <SiteHeader />

      <main className="flex-1 pb-24 pt-28">
        {/* Header Hero Section */}
        <section className="relative overflow-hidden border-b border-border/60 pb-16 pt-8">
          <div aria-hidden className="pointer-events-none absolute inset-0 z-0 opacity-40">
            <div className="absolute -left-[200px] -top-[150px] h-[400px] w-[400px] rounded-full bg-primary/20 blur-[90px]" />
            <div className="absolute -right-[200px] top-[20%] h-[400px] w-[400px] rounded-full bg-secondary/20 blur-[90px]" />
          </div>

          <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
            <Badge
              variant="outline"
              className="mb-4 rounded-full border-border bg-card/60 px-3 py-1 text-xs font-semibold text-muted-foreground backdrop-blur-sm"
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5 text-primary" />
              Conocimiento & Comunidad Fitness
            </Badge>
            <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Blog & Novedades
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
              Guías completas, tendencias tecnológicas, consejos de nutrición y estrategias de
              gestión para entusiastas y dueños de centros.
            </p>

            {/* Search Bar */}
            <div className="mx-auto mt-8 max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar por tema, palabra clave o autor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 rounded-2xl glass-smoked pl-11 pr-4 text-sm transition-all focus:border-[#C5BAA8] focus:ring-1 focus:ring-[#C5BAA8]/30 text-foreground placeholder:text-muted-foreground"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    Limpiar
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? "bg-[#E8E2D5] text-[#0E0D0C] shadow-md font-bold"
                      : "glass-smoked-pill"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-6 pt-12">
          {/* Spotlight Featured Article (Visible when no search active and 'Todos' or matching category selected) */}
          {!searchQuery && selectedCategory === "Todos" && featuredPost && (
            <section className="mb-16">
              <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <Sparkles className="h-4 w-4" />
                <span>Artículo Destacado de la Semana</span>
              </div>

              <Link
                to="/blog/$slug"
                params={{ slug: featuredPost.slug }}
                className="group relative grid grid-cols-1 overflow-hidden rounded-3xl glass-smoked-interactive lg:grid-cols-12"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-muted lg:col-span-7 lg:aspect-auto">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
                  <Badge className="absolute left-4 top-4 rounded-full bg-primary font-bold text-primary-foreground">
                    {featuredPost.category}
                  </Badge>
                </div>

                <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-5">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        {featuredPost.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-medium text-foreground">
                        <Clock className="h-3.5 w-3.5 text-primary" />
                        {featuredPost.readTime}
                      </span>
                    </div>

                    <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-3xl">
                      {featuredPost.title}
                    </h2>

                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {featuredPost.excerpt}
                    </p>
                  </div>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-border/50 pt-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={featuredPost.author.avatar}
                        alt={featuredPost.author.name}
                        className="h-9 w-9 rounded-full object-cover border border-border"
                      />
                      <div>
                        <div className="text-xs font-bold text-foreground">
                          {featuredPost.author.name}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {featuredPost.author.role}
                        </div>
                      </div>
                    </div>

                    <span className="flex items-center text-xs font-bold text-primary transition-transform group-hover:translate-x-1">
                      Leer artículo completo <ArrowRight className="ml-1 h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </section>
          )}

          {/* Articles Grid Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                {selectedCategory === "Todos"
                  ? "Todos los Artículos"
                  : `Artículos sobre ${selectedCategory}`}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Mostrando {filteredPosts.length} publicación{filteredPosts.length === 1 ? "" : "es"}
              </p>
            </div>
          </div>

          {/* Articles Grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="group flex flex-col overflow-hidden rounded-3xl glass-smoked-interactive"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <Badge className="absolute left-3 top-3 rounded-full bg-background/90 text-foreground backdrop-blur-md text-[10px] font-semibold">
                      {post.category}
                    </Badge>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-medium text-foreground">
                          <Clock className="h-3 w-3 text-primary" />
                          {post.readTime}
                        </span>
                      </div>

                      <h3 className="mt-2 text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="h-7 w-7 rounded-full object-cover border border-border"
                        />
                        <span className="text-xs font-semibold text-foreground truncate max-w-[120px]">
                          {post.author.name}
                        </span>
                      </div>

                      <span className="text-xs font-bold text-primary flex items-center group-hover:translate-x-1 transition-transform">
                        Leer <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="my-12 flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/40 p-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground/60 mb-3" />
              <h3 className="text-lg font-semibold text-foreground">
                No encontramos publicaciones
              </h3>
              <p className="mt-1 text-xs text-muted-foreground max-w-sm">
                No hay artículos que coincidan con la búsqueda "{searchQuery}" en la categoría
                seleccionada.
              </p>
              <Button
                variant="outline"
                className="mt-4 rounded-xl text-xs font-semibold"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("Todos");
                }}
              >
                Restablecer Filtros
              </Button>
            </div>
          )}

          {/* Newsletter Subscription Banner */}
          <section className="mt-20 overflow-hidden rounded-3xl border border-border bg-foreground text-background p-8 sm:p-12 relative">
            <div
              aria-hidden
              className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl"
            />
            <div className="relative z-10 max-w-2xl">
              <Badge className="rounded-full bg-primary text-primary-foreground font-semibold mb-3">
                Newsletter Fitness
              </Badge>
              <h3 className="text-2xl font-bold tracking-tight text-background sm:text-3xl">
                Recibí los mejores artículos y tendencias cada semana
              </h3>
              <p className="mt-2 text-sm text-background/80">
                Únete a más de 12.000 entrenadores, deportistas y dueños de centros que leen
                nuestras guías exclusivas.
              </p>

              {subscribed ? (
                <div className="mt-6 flex items-center gap-2 rounded-2xl bg-primary/20 border border-primary/40 p-4 text-sm text-primary font-semibold">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <span>
                    ¡Te suscribiste con éxito! Revisá tu casilla de correo para la primera edición.
                  </span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    required
                    placeholder="Tu correo electrónico..."
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="h-11 rounded-xl bg-background/10 border-background/20 text-background placeholder:text-background/50 focus:border-background"
                  />
                  <Button
                    type="submit"
                    className="h-11 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 shrink-0"
                  >
                    Suscribirme Gratis
                  </Button>
                </form>
              )}
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
