import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BlogPost } from "@/lib/blogs";

export interface BlogBottomRelatedProps {
  relatedPosts: BlogPost[];
}

export function BlogBottomRelated({ relatedPosts }: BlogBottomRelatedProps) {
  if (!relatedPosts || relatedPosts.length === 0) return null;

  return (
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
            className="text-xs font-bold text-primary hover:text-primary/80 gap-1 cursor-pointer"
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
  );
}
