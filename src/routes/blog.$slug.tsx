import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Share2,
  Check,
  Copy,
  Twitter,
  Linkedin,
  MessageCircle,
  ChevronRight,
  Bookmark,
  Sparkles,
  Building2,
  Dumbbell,
} from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getBlogPostBySlug, getRelatedPosts, type BlogPost } from "@/lib/blogs";

function parseInlineMarkdown(text: string): React.ReactNode {
  if (!text) return text;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={index} className="font-bold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    const italicParts = part.split(/(\*[^*]+\*)/g);
    if (italicParts.length > 1) {
      return italicParts.map((sub, subIdx) => {
        if (sub.startsWith("*") && sub.endsWith("*") && sub.length > 2) {
          return (
            <em key={subIdx} className="italic text-foreground/90">
              {sub.slice(1, -1)}
            </em>
          );
        }
        return sub;
      });
    }
    return part;
  });
}

function renderBlogMarkdown(content: string) {
  const blocks = content.split(/\n\s*\n/);

  return blocks.map((block, idx) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    // 1. Markdown Table (| Col | Col |)
    if (trimmed.startsWith("|") && trimmed.includes("|")) {
      const lines = trimmed.split("\n").map(l => l.trim()).filter(l => l.startsWith("|"));
      if (lines.length >= 2) {
        // Line 0: Header
        const headerCols = lines[0]
          .split("|")
          .map(c => c.trim())
          .filter((_, i, arr) => i > 0 && i < arr.length - 1);

        // Filter out delimiter line (|---|---|)
        const bodyLines = lines.slice(1).filter(l => !l.includes(":---") && !l.includes("---"));

        return (
          <div key={idx} className="my-8 overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-secondary/40 text-muted-foreground uppercase tracking-wider font-bold border-b border-border">
                <tr>
                  {headerCols.map((col, i) => (
                    <th key={i} className="px-4 py-3 font-extrabold text-foreground">{parseInlineMarkdown(col)}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-foreground">
                {bodyLines.map((rowLine, rIdx) => {
                  const cells = rowLine
                    .split("|")
                    .map(c => c.trim())
                    .filter((_, i, arr) => i > 0 && i < arr.length - 1);
                  return (
                    <tr key={rIdx} className="hover:bg-muted/30 transition-colors">
                      {cells.map((cell, cIdx) => (
                        <td key={cIdx} className="px-4 py-3 align-top font-medium">{parseInlineMarkdown(cell)}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }
    }

    // 2. Headings
    if (trimmed.startsWith("### ")) {
      return (
        <h3 key={idx} className="text-xl font-bold mt-8 mb-3 text-foreground tracking-tight">
          {parseInlineMarkdown(trimmed.replace("### ", ""))}
        </h3>
      );
    }
    if (trimmed.startsWith("#### ")) {
      return (
        <h4 key={idx} className="text-lg font-bold mt-6 mb-2 text-foreground">
          {parseInlineMarkdown(trimmed.replace("#### ", ""))}
        </h4>
      );
    }

    // 3. Blockquotes
    if (trimmed.startsWith("> ")) {
      const quoteText = trimmed.replace(/^>\s*/gm, "").replace(/"/g, "").trim();
      return (
        <blockquote key={idx} className="my-6 border-l-4 border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10 p-4 rounded-r-2xl italic text-foreground font-medium">
          {parseInlineMarkdown(quoteText)}
        </blockquote>
      );
    }

    // 4. Horizontal Rule
    if (trimmed === "---") {
      return <hr key={idx} className="my-8 border-border" />;
    }

    // 4b. Formula / Math Block ($$ ... $$)
    if (trimmed.startsWith("$$") || trimmed.includes("NRF 9.3 =")) {
      return (
        <div key={idx} className="my-8 p-6 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 flex flex-col items-center justify-center text-center space-y-3 shadow-sm">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fórmula Algorítmica NRF 9.3</span>
          </div>
          <div className="text-sm sm:text-base md:text-lg font-mono font-black text-foreground tracking-tight py-2 px-4 rounded-2xl bg-card border border-border shadow-inner max-w-full overflow-x-auto">
            NRF 9.3 = ∑ (Nutrientes Promovidos / VDR × 100) − ∑ (Nutrientes Limitados / VDR × 100)
          </div>
          <p className="text-xs text-muted-foreground font-medium max-w-lg leading-relaxed">
            Suma del % de Valor Diario Recomendado (VDR) de 9 nutrientes esenciales (Fibra, Proteína, Vit. A, C, E, Ca, Fe, Mg, K) menos el % acumulado de 3 nutrientes a moderar (Grasas Saturadas, Azúcar Añadido, Sodio).
          </p>
        </div>
      );
    }

    // 5. Unordered List (- item)
    if (trimmed.startsWith("- ")) {
      const items = trimmed.split("\n").map(li => li.replace(/^-\s*/, "").trim());
      return (
        <ul key={idx} className="my-4 space-y-2 list-disc list-inside text-foreground">
          {items.map((it, i) => (
            <li key={i} className="leading-relaxed">{parseInlineMarkdown(it)}</li>
          ))}
        </ul>
      );
    }

    // 6. Ordered List (1. item)
    if (/^\d+\.\s/.test(trimmed)) {
      const items = trimmed.split("\n").map(li => li.replace(/^\d+\.\s*/, "").trim());
      return (
        <ol key={idx} className="my-4 space-y-2 list-decimal list-inside text-foreground">
          {items.map((it, i) => (
            <li key={i} className="leading-relaxed">{parseInlineMarkdown(it)}</li>
          ))}
        </ol>
      );
    }

    // 7. Regular Paragraph
    return (
      <p key={idx} className="leading-relaxed text-foreground/90 my-3">
        {parseInlineMarkdown(trimmed)}
      </p>
    );
  });
}

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getBlogPostBySlug(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.post;
    const title = p ? `${p.title} — Blog Shakerfy` : "Artículo — Shakerfy";
    const desc = p?.excerpt ?? "Artículo de fitness y salud en Shakerfy.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        ...(p?.image ? [{ property: "og:image", content: p.image }] : []),
      ],
    };
  },
  component: BlogDetailPage,
});

function BlogDetailPage() {
  const { post } = Route.useLoaderData();
  const [copied, setCopied] = useState(false);
  const relatedPosts = getRelatedPosts(post.slug, post.category, 3);

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`Mirá este artículo en Shakerfy: ${post.title}\n${currentUrl}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(`"${post.title}" vía @ShakerfyApp`);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(currentUrl)}`,
      "_blank",
    );
  };

  const shareLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
      "_blank",
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20">
      <SiteHeader />

      <main className="flex-1 pb-24 pt-28">
        {/* Breadcrumb Navigation */}
        <div className="mx-auto max-w-5xl px-6">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground overflow-x-auto whitespace-nowrap [scrollbar-width:none]">
            <Link to="/" className="hover:text-foreground transition-colors">
              Inicio
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/blog" className="hover:text-foreground transition-colors">
              Blog
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-muted-foreground/80">{post.category}</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-xs">
              {post.title}
            </span>
          </nav>
        </div>

        {/* Article Header */}
        <article className="mx-auto max-w-5xl px-6 pt-6">
          <div className="space-y-4 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <Badge className="rounded-full bg-primary text-primary-foreground font-bold px-3 py-1">
                {post.category}
              </Badge>
              <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                {post.date}
              </span>
              <span className="text-muted-foreground/40">•</span>
              <span className="flex items-center gap-1 text-xs font-semibold text-primary">
                <Clock className="h-3.5 w-3.5" />
                {post.readTime}
              </span>
            </div>

            <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl leading-tight">
              {post.title}
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground/90 max-w-3xl leading-relaxed">
              {post.excerpt}
            </p>

            {/* Author bar & Share buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 border-y border-border/60 py-4 my-6">
              <div className="flex items-center gap-3">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="h-11 w-11 rounded-full object-cover border border-border"
                />
                <div className="text-left">
                  <div className="text-sm font-bold text-foreground">{post.author.name}</div>
                  <div className="text-xs text-muted-foreground">{post.author.role}</div>
                </div>
              </div>

              {/* Share actions */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground mr-1 hidden sm:inline">
                  Compartir:
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-xl hover:bg-green-500/10 hover:text-green-500 hover:border-green-500/30"
                  onClick={shareWhatsApp}
                  title="Compartir en WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-xl hover:bg-blue-400/10 hover:text-blue-400 hover:border-blue-400/30"
                  onClick={shareTwitter}
                  title="Compartir en Twitter / X"
                >
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-xl hover:bg-blue-600/10 hover:text-blue-600 hover:border-blue-600/30"
                  onClick={shareLinkedIn}
                  title="Compartir en LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-xl"
                  onClick={handleCopyLink}
                  title="Copiar enlace"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Featured Hero Image */}
          <div className="relative my-8 aspect-[16/9] overflow-hidden rounded-3xl border border-border bg-muted">
            <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
          </div>

          {/* Grid Layout: Main Article (8 cols) + Sidebar (4 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-10">
            {/* Article Body */}
            <div className="lg:col-span-8 space-y-6">
              <div className="typeset typeset-docs max-w-[37em]">
                {renderBlogMarkdown(post.content)}
              </div>

              {/* Article Tags */}
              <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-border">
                <span className="text-xs font-semibold text-muted-foreground mr-1">Etiquetas:</span>
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="rounded-full text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>

              {/* Author Bio Box */}
              <div className="my-8 rounded-3xl border border-border bg-card p-6 flex flex-col sm:flex-row gap-4 items-center sm:items-start text-center sm:text-left">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="h-16 w-16 rounded-full object-cover border border-border shrink-0"
                />
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase text-primary">Escrito por</div>
                  <h4 className="text-lg font-bold text-foreground">{post.author.name}</h4>
                  <p className="text-xs text-muted-foreground font-medium">{post.author.role}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                    {post.author.bio}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <aside className="lg:col-span-4 space-y-8">
              {/* Gym Search CTA */}
              <div className="rounded-3xl border border-border bg-card p-6 space-y-4">
                <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Dumbbell className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-lg text-foreground">¿Buscás dónde entrenar hoy?</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Encontrá gimnasios con aforo en tiempo real, clases de yoga, CrossFit y pases
                  libres cerca de tu ubicación.
                </p>
                <Link to="/" className="block">
                  <Button className="w-full rounded-xl bg-primary text-primary-foreground font-bold text-xs">
                    Probar Buscador con IA
                  </Button>
                </Link>
              </div>

              {/* Partner Gym CTA */}
              <div className="rounded-3xl border border-border bg-foreground text-background p-6 space-y-4">
                <div className="h-10 w-10 rounded-2xl bg-background/10 flex items-center justify-center text-background">
                  <Building2 className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-lg text-background">¿Sos dueño de un centro?</h3>
                <p className="text-xs text-background/80 leading-relaxed">
                  Publicá tu gimnasio en Shakerfy, digitalizá tus cobros y aumentá la retención de
                  tus alumnos.
                </p>
                <Link to="/auth/gym" className="block">
                  <Button variant="secondary" className="w-full rounded-xl font-bold text-xs">
                    Sumar mi Gimnasio
                  </Button>
                </Link>
              </div>

              {/* Related Posts in Sidebar */}
              <div className="space-y-4 pt-4 border-t border-border">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Artículos Relacionados
                </h4>
                <div className="space-y-4">
                  {relatedPosts.map((rPost) => (
                    <Link
                      key={rPost.id}
                      to="/blog/$slug"
                      params={{ slug: rPost.slug }}
                      className="group flex gap-3 items-start hover:opacity-95 transition-opacity"
                    >
                      <img
                        src={rPost.image}
                        alt={rPost.title}
                        className="h-16 w-16 rounded-2xl object-cover border border-border shrink-0"
                      />
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-primary">{rPost.category}</span>
                        <h5 className="text-xs font-bold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {rPost.title}
                        </h5>
                        <span className="text-[10px] text-muted-foreground block">
                          {rPost.readTime}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </article>

        {/* Bottom Related Posts Carousel/Grid */}
        <section className="mx-auto max-w-5xl px-6 mt-20 border-t border-border pt-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-foreground">Seguí Leyendo</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Otros artículos que podrían interesarte
              </p>
            </div>
            <Link to="/blog">
              <Button
                variant="ghost"
                className="text-xs font-bold text-primary hover:text-primary/80 gap-1"
              >
                Ver todo el Blog <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedPosts.map((rPost) => (
              <Link
                key={rPost.id}
                to="/blog/$slug"
                params={{ slug: rPost.slug }}
                className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all hover:border-foreground/30 hover:shadow-md"
              >
                <div className="aspect-[16/10] overflow-hidden bg-muted">
                  <img
                    src={rPost.image}
                    alt={rPost.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-primary uppercase">
                      {rPost.category}
                    </span>
                    <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mt-1">
                      {rPost.title}
                    </h4>
                  </div>
                  <div className="text-[11px] text-muted-foreground flex items-center justify-between pt-2 border-t border-border/40">
                    <span>{rPost.date}</span>
                    <span>{rPost.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
