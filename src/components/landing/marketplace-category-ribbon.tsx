import React from "react";
import {
  Compass,
  Sparkles,
  Flame,
  Heart,
  Activity,
  Dumbbell,
  Zap,
  Droplets,
  Award,
  MapPin,
  ChevronDown,
  Check,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface MarketplaceCategoryRibbonProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  categories: string[];
  favoritesCount: number;
  showOnlyFavorites: boolean;
  onToggleFavorites: () => void;
  selectedLocation?: string;
  locations?: string[];
  onSelectLocation?: (location: string) => void;
  className?: string;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Todos: <Compass className="w-3.5 h-3.5" />,
  Pilates: <Sparkles className="w-3.5 h-3.5 text-amber-300" />,
  Hyrox: <Flame className="w-3.5 h-3.5 text-orange-400" />,
  Yoga: <Heart className="w-3.5 h-3.5 text-rose-400" />,
  Funcional: <Activity className="w-3.5 h-3.5 text-emerald-400" />,
  CrossFit: <Dumbbell className="w-3.5 h-3.5 text-sky-400" />,
  Powerlifting: <Zap className="w-3.5 h-3.5 text-yellow-400" />,
  Recuperación: <Droplets className="w-3.5 h-3.5 text-cyan-400" />,
  Boutique: <Award className="w-3.5 h-3.5 text-purple-400" />,
};

export function MarketplaceCategoryRibbon({
  activeCategory,
  onSelectCategory,
  categories,
  favoritesCount,
  showOnlyFavorites,
  onToggleFavorites,
  selectedLocation,
  locations,
  onSelectLocation,
  className,
}: MarketplaceCategoryRibbonProps) {
  return (
    <div
      className={cn(
        "w-full bg-[#11100E]/90 backdrop-blur-md border-b border-[#262320]/80 py-2.5 px-4 sm:px-6 sticky top-16 z-30 transition-all select-none",
        className,
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
        {/* 1. Location Selector (DoorDash style 'CASA v') */}
        {selectedLocation && onSelectLocation && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/10 bg-[#1A1815] px-3.5 py-1.5 text-xs font-semibold text-[#F6F4EE] hover:border-white/25 hover:text-white transition cursor-pointer outline-none shrink-0 shadow-2xs active:scale-95">
                <MapPin className="w-3.5 h-3.5 text-[#C5BAA8]" />
                <span>{selectedLocation}</span>
                <ChevronDown className="w-3 h-3 text-[#A39C91]" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="bg-[#171513] border-[#2C2824] text-[#F6F4EE] rounded-2xl shadow-2xl p-1 min-w-[200px] z-50"
              >
                {locations?.map((loc) => (
                  <DropdownMenuItem
                    key={loc}
                    onClick={() => onSelectLocation(loc)}
                    className="flex items-center justify-between text-xs px-3 py-2 rounded-xl cursor-pointer hover:bg-[#25221E] focus:bg-[#25221E]"
                  >
                    <span>{loc}</span>
                    {selectedLocation === loc && <Check className="w-3.5 h-3.5 text-[#C5BAA8]" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="h-4 w-[1px] bg-[#2A2622] shrink-0 mx-0.5" />
          </>
        )}

        {/* 2. Favoritos button */}
        <button
          type="button"
          onClick={onToggleFavorites}
          className={cn(
            "flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all shrink-0 cursor-pointer select-none",
            showOnlyFavorites
              ? "border-[#C5BAA8] bg-[#C5BAA8]/20 text-[#F6F4EE] shadow-xs"
              : "border-[#262320] bg-[#171513] text-[#A39C91] hover:border-[#3D3833] hover:text-[#F6F4EE]",
          )}
        >
          <Heart
            className={cn(
              "w-3.5 h-3.5 transition-transform",
              showOnlyFavorites ? "fill-[#C5BAA8] text-[#C5BAA8] scale-110" : "text-[#7D766D]",
            )}
          />
          <span>Favoritos</span>
          {favoritesCount > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#262320] text-[#E8E2D5] font-bold">
              {favoritesCount}
            </span>
          )}
        </button>

        <div className="h-4 w-[1px] bg-[#2A2622] shrink-0 mx-0.5" />

        {/* 3. Categories Pills */}
        {categories.map((cat) => {
          const isActive = activeCategory === cat && !showOnlyFavorites;
          const icon = CATEGORY_ICONS[cat] || <Compass className="w-3.5 h-3.5" />;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={cn(
                "flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all shrink-0 cursor-pointer select-none",
                isActive
                  ? "border-[#C5BAA8] bg-[#221F1B] text-[#F6F4EE] font-semibold shadow-xs"
                  : "border-[#262320] bg-[#141311] text-[#A39C91] hover:border-[#3D3833] hover:text-[#F6F4EE]",
              )}
            >
              <span className="shrink-0">{icon}</span>
              <span>{cat}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
