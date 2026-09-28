import { MapPin, Star, Clock, Calendar, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface GymMapPinCardProps {
  slug: string;
  name: string;
  neighborhood: string;
  address?: string;
  rating: number;
  reviews?: number;
  distanceKm?: number;
  tags?: string[];
  image?: string;
  priceFrom?: number;
  nextOpenSlot?: {
    time: string;
    className: string;
    spotsLeft: number;
  } | null;
  onSelectGym?: (slug: string) => void;
  onBookTrial?: (slug: string) => void;
  className?: string;
}

export function GymMapPinCard({
  slug,
  name,
  neighborhood,
  address,
  rating,
  reviews = 0,
  distanceKm,
  tags = ["Pilates", "Reformer"],
  image,
  priceFrom,
  nextOpenSlot,
  onSelectGym,
  onBookTrial,
  className,
}: GymMapPinCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between rounded-3xl border border-border bg-card p-4 sm:p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg",
        className
      )}
    >
      <div>
        {/* Foto de Portada / Badge de Barrio y Rating */}
        {image && (
          <div className="relative w-full h-32 sm:h-36 rounded-2xl overflow-hidden mb-3 bg-secondary/50">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-xs">
              <span className="font-semibold flex items-center gap-1 drop-shadow-xs">
                <MapPin className="w-3.5 h-3.5 text-primary" /> {neighborhood}
                {distanceKm !== undefined && ` (${distanceKm} km)`}
              </span>
              <span className="font-bold flex items-center gap-1 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-full">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {rating.toFixed(1)}
              </span>
            </div>
          </div>
        )}

        {/* Sin foto: Header de texto limpio */}
        {!image && (
          <div className="flex items-center justify-between gap-2 pb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-primary" /> {neighborhood}
              {distanceKm !== undefined && ` • ${distanceKm} km`}
            </span>
            <span className="text-xs font-bold flex items-center gap-1 text-foreground">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {rating.toFixed(1)}
              {reviews > 0 && <span className="text-muted-foreground font-normal">({reviews})</span>}
            </span>
          </div>
        )}

        {/* Nombre del Estudio */}
        <h3 className="font-bebas text-2xl tracking-wide text-foreground group-hover:text-primary transition-colors">
          {name}
        </h3>
        {address && <p className="text-xs text-muted-foreground truncate mt-0.5">{address}</p>}

        {/* Tags / Disciplinas */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2.5">
            {tags.slice(0, 3).map((tag, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="text-[10px] uppercase font-semibold rounded-full px-2.5 py-0.5 bg-secondary/60 text-foreground/80"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Próximo turno disponible hoy (Disponibilidad en vivo) */}
        {nextOpenSlot && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <span className="font-semibold text-foreground/90 block text-[11px]">
                  {nextOpenSlot.className}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Hoy {nextOpenSlot.time}
                </span>
              </div>
            </div>
            <Badge
              variant="outline"
              className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 border-emerald-500/30 bg-emerald-500/10 rounded-full px-2 py-0.5"
            >
              {nextOpenSlot.spotsLeft} lugares
            </Badge>
          </div>
        )}
      </div>

      {/* Footer con Precio y Botón de Acción */}
      <div className="pt-3.5 mt-3 border-t border-border/40 flex items-center justify-between gap-2">
        {priceFrom ? (
          <div>
            <span className="text-[9px] uppercase font-bold text-muted-foreground block">
              Pase desde
            </span>
            <span className="font-bebas text-lg tracking-wide text-foreground">
              ${priceFrom.toLocaleString("es-AR")}
            </span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Verificado
          </span>
        )}

        <div className="flex items-center gap-1.5">
          {onSelectGym && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onSelectGym(slug)}
              className="h-8 rounded-full text-xs font-medium cursor-pointer"
            >
              Ver perfil
            </Button>
          )}

          <Button
            size="sm"
            onClick={() => (onBookTrial ? onBookTrial(slug) : onSelectGym?.(slug))}
            className="h-8 rounded-full px-3.5 text-xs font-semibold bg-foreground text-background hover:bg-foreground/90 cursor-pointer shadow-sm"
          >
            Clase de prueba <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
