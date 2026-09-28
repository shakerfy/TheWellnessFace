import React from "react";
import { Link } from "@tanstack/react-router";
import { Dumbbell, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BlogPost } from "@/lib/blogs";

export interface BlogSidebarProps {
  relatedPosts: BlogPost[];
}

export function BlogSidebar({ relatedPosts }: BlogSidebarProps) {
  return (
    <aside className="lg:col-span-4 space-y-8">
      {/* Gym Search CTA */}
      <div className="rounded-3xl border border-border bg-card p-6 space-y-4">
        <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          <Dumbbell className="h-5 w-5" />
        </div>
        <h3 className="font-bold text-lg text-foreground">
          ¿Buscás dónde entrenar hoy?
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Encontrá gimnasios con aforo en tiempo real, clases de yoga, CrossFit
          y pases libres cerca de tu ubicación.
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
        <h3 className="font-bold text-lg text-background">
          ¿Sos dueño de un centro?
        </h3>
        <p className="text-xs text-background/80 leading-relaxed">
          Publicá tu gimnasio en Shakerfy, digitalizá tus cobros y aumentá la
          retención de tus alumnos.
        </p>
        <Link to="/auth/gym" className="block">
          <Button
            variant="secondary"
            className="w-full rounded-xl font-bold text-xs"
          >
            Sumar mi Gimnasio
          </Button>
        </Link>
      </div>

      {/* Related Posts in Sidebar */}
      {relatedPosts && relatedPosts.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-border">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
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
                  <span className="text-[10px] font-bold text-primary">
                    {rPost.category}
                  </span>
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
      )}
    </aside>
  );
}
