import React from "react";
import { Link } from "@tanstack/react-router";
import { Star, Heart, MapPin, ChevronRight, Sparkles } from "lucide-react";
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
      <div className="flex items-end justify-between px-4 sm:px-6 mb-3.5">
        <div>
          {badge && (
            <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#C5BAA8] flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>{badge}</span>
            </div>
          )}
          <h3 className="text-lg sm:text-xl md:text-2xl font-light tracking-tight text-[#F6F4EE]">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-[#A39C91] mt-0.5 font-normal">
              {subtitle}
            </p>
          )}
        </div>

        {onSeeAll && (
          <button
            type="button"
            onClick={onSeeAll}
            className="text-xs font-semibold text-[#C5BAA8] hover:text-[#F6F4EE] flex items-center gap-0.5 transition cursor-pointer shrink-0 pb-0.5"
          >
            <span>Ver todos</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Horizontal Scroll Shelf */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 sm:px-6 pb-2 pt-1 scroll-smooth">
        {gyms.map((gym) => {
          const isFav = favorites.includes(gym.slug);
          const firstImage = gym.images?.[0] || "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80";
          const startingPrice = gym.priceFrom
            ? `$${gym.priceFrom.toLocaleString("es-AR")}`
            : gym.memberships?.[0]?.price
              ? `$${gym.memberships[0].price.toLocaleString("es-AR")}`
              : null;

          return (
            <Link
              key={gym.slug}
              to="/gym/$slug"
              params={{ slug: gym.slug }}
              className="group relative flex-none w-[270px] sm:w-[310px] rounded-3xl border border-[#262320] bg-[#141311] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[#3D3833] hover:shadow-[0_12px_32px_rgba(0,0,0,0.6)] flex flex-col justify-between"
            >
              {/* Image Container with Badges */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#1E1B18]">
                <img
                  src={firstImage}
                  alt={gym.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#141311] via-transparent to-black/30 pointer-events-none" />

                {/* Favorite Heart Button */}
                <button
                  type="button"
                  onClick={(e) => onToggleFavorite(gym.slug, e)}
                  aria-label={isFav ? "Quitar de favoritos" : "Guardar en favoritos"}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/45 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition active:scale-75 hover:bg-black/70 cursor-pointer z-10"
                >
                  <Heart
                    className={cn(
                      "w-4 h-4 transition-colors",
                      isFav ? "fill-[#C5BAA8] text-[#C5BAA8]" : "text-white/80 hover:text-white",
                    )}
                  />
                </button>

                {/* Rating Badge */}
                <div className="absolute bottom-2.5 left-3 inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 px-2 py-0.5 text-[11px] font-bold text-[#F6F4EE]">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{gym.rating?.toFixed(1) || "4.9"}</span>
                  <span className="text-[#A39C91] text-[10px] font-normal">
                    ({gym.reviews || 85})
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-semibold text-[#F6F4EE] group-hover:text-white transition-colors truncate">
                    {gym.name}
                  </h4>

                  <div className="flex items-center gap-1.5 text-xs text-[#A39C91] mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#7D766D] shrink-0" />
                    <span className="truncate">{gym.neighborhood || gym.city}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-medium">Abierto</span>
                  </div>
                </div>

                {/* Tags & Price Row */}
                <div className="pt-2 border-t border-[#221F1B] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 overflow-hidden">
                    {gym.tags?.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-[#1F1C19] border border-[#2C2824] text-[#DDD6CB] whitespace-nowrap"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {startingPrice && (
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-[#7D766D] block leading-none">Desde</span>
                      <span className="text-xs font-bold text-[#F6F4EE]">{startingPrice}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
