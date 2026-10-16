import React from "react";
import { Link } from "@tanstack/react-router";
import { Star, Heart, ChevronRight, Sparkles, Check } from "lucide-react";
import { Gym } from "@/lib/gyms";
import { cn } from "@/lib/utils";

export interface MarketplaceShelfRowProps {
  title: string;
  subtitle?: string;
  badge?: string;
  gyms: Gym[];
  favorites: string[];
  onToggleFavorite: (slug: string, e: React.MouseEvent) => void;
  onSeeAll?: () => void;
  className?: string;
}

export function MarketplaceShelfRow({
  title,
  subtitle,
  badge,
  gyms,
  favorites,
  onToggleFavorite,
  onSeeAll,
  className,
}: MarketplaceShelfRowProps) {
  if (!gyms || gyms.length === 0) return null;

  return (
    <div className={cn("w-full py-6 select-none", className)}>
      {/* Shelf Header */}
      <div className="flex items-end justify-between px-4 sm:px-6 mb-4">
        <div>
          {badge && (
            <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3 h-3 text-amber-500 dark:text-amber-400" />
              <span>{badge}</span>
            </div>
          )}
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 font-normal">
              {subtitle}
            </p>
          )}
        </div>

        {onSeeAll && (
          <button
            type="button"
            onClick={onSeeAll}
            className="text-xs sm:text-sm font-medium text-foreground hover:text-muted-foreground flex items-center gap-0.5 transition cursor-pointer shrink-0 pb-0.5"
          >
            <span>Ver todos</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Horizontal Scroll Shelf */}
      <div className="flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar px-4 sm:px-6 pb-4 pt-1 scroll-smooth">
        {gyms.map((gym) => {
          const isFav = favorites.includes(gym.slug);
          const firstImage =
            gym.images?.[0] ||
            "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80";

          const startingPrice = gym.priceFrom
            ? `$${gym.priceFrom.toLocaleString("es-AR")}`
            : gym.memberships?.[0]?.price
              ? `$${gym.memberships[0].price.toLocaleString("es-AR")}`
              : "$14.500";

          const perClassPrice = gym.priceFrom
            ? `$${Math.round(gym.priceFrom / 6).toLocaleString("es-AR")}`
            : "$2.450";

          const primaryCategory = gym.tags?.[0] || "Estudio Boutique";
          const reviewsCount = gym.reviews || 142;

          return (
            <Link
              key={gym.slug}
              to="/gym/$slug"
              params={{ slug: gym.slug }}
              className="group relative flex-none w-[280px] sm:w-[320px] rounded-[28px] border border-border/80 bg-card text-card-foreground overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-foreground/20 flex flex-col justify-between shadow-xs"
            >
              {/* Image Container with Carousel Dots & Favorite Heart */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                <img
                  src={firstImage}
                  alt={gym.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Subtle top vignette for button contrast */}
                <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />

                {/* Favorite Heart Button */}
                <button
                  type="button"
                  onClick={(e) => onToggleFavorite(gym.slug, e)}
                  aria-label={isFav ? "Quitar de favoritos" : "Guardar en favoritos"}
                  className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/15 flex items-center justify-center text-white transition active:scale-75 hover:bg-black/60 cursor-pointer z-10"
                >
                  <Heart
                    className={cn(
                      "w-4 h-4 transition-colors",
                      isFav ? "fill-rose-500 text-rose-500" : "text-white/90 hover:text-white",
                    )}
                  />
                </button>

                {/* Carousel Pagination Dots (Minimalista Airbnb/DoorDash) */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/35 backdrop-blur-xs px-2.5 py-1 rounded-full pointer-events-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
                </div>
              </div>

              {/* Minimalist Card Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Line 1: Title and Star Rating */}
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-base sm:text-lg font-bold text-foreground group-hover:text-foreground/80 transition-colors truncate">
                      {gym.name}
                    </h4>
                    <div className="flex items-center gap-1 text-xs sm:text-sm font-bold text-foreground shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 dark:fill-amber-400 dark:text-amber-400" />
                      <span>{gym.rating?.toFixed(1) || "4.8"}</span>
                      <span className="text-muted-foreground font-normal text-xs">
                        ({reviewsCount})
                      </span>
                    </div>
                  </div>

                  {/* Line 2: Category and Neighborhood */}
                  <p className="text-xs sm:text-sm text-muted-foreground truncate font-normal mt-0.5">
                    {primaryCategory} · {gym.neighborhood || gym.city}
                  </p>

                  {/* Line 3: Schedule / Membership details */}
                  <p className="text-xs text-muted-foreground/80 truncate mt-1">
                    Horarios flexibles · Pase libre · Sin matrícula
                  </p>
                </div>

                {/* Subtle Fine Divider */}
                <div className="my-3 border-t border-border/60" />

                {/* Bottom Row: Price Breakdown & Reservar Action Button */}
                <div className="flex items-end justify-between gap-3">
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-sans">
                        {startingPrice}
                      </span>
                      <span className="text-[11px] sm:text-xs text-muted-foreground font-normal">
                        ARS total
                      </span>
                    </div>

                    <p className="text-[11px] text-muted-foreground truncate">
                      {perClassPrice} por clase estimada
                    </p>

                    <div className="flex items-center gap-1 text-[11px] sm:text-xs font-medium text-emerald-600 dark:text-emerald-400 pt-0.5">
                      <Check className="w-3.5 h-3.5 shrink-0" />
                      <span>Cancelación gratuita</span>
                    </div>
                  </div>

                  {/* Reservar CTA Button */}
                  <div className="shrink-0">
                    <span className="inline-flex items-center justify-center rounded-xl px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-95 bg-foreground text-background hover:bg-foreground/90 shadow-xs">
                      Reservar
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
