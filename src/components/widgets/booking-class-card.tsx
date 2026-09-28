import { useState } from "react";
import { Clock, User, Check, Calendar, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface BookingClassCardProps {
  gymName?: string;
  className?: string;
  classId?: string;
  name: string;
  instructor: string;
  time: string;
  duration: number; // minutes
  capacity: number;
  booked: number;
  isBooked?: boolean;
  onBook?: (classId?: string) => Promise<boolean> | boolean | void;
  onCancel?: (classId?: string) => Promise<boolean> | boolean | void;
  compact?: boolean;
}

export function BookingClassCard({
  gymName,
  className,
  classId,
  name,
  instructor,
  time,
  duration,
  capacity,
  booked,
  isBooked = false,
  onBook,
  onCancel,
  compact = false,
}: BookingClassCardProps) {
  const [loading, setLoading] = useState(false);
  const [bookedState, setBookedState] = useState(isBooked);

  const availableSpots = Math.max(0, capacity - (bookedState && !isBooked ? booked + 1 : booked));
  const isFull = availableSpots === 0 && !bookedState;

  const handleAction = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (bookedState) {
        await onCancel?.(classId);
        setBookedState(false);
        if (typeof navigator !== "undefined" && "vibrate" in navigator) {
          navigator.vibrate(30);
        }
      } else {
        await onBook?.(classId);
        setBookedState(true);
        if (typeof navigator !== "undefined" && "vibrate" in navigator) {
          navigator.vibrate([25, 40, 25]);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between rounded-3xl border border-border bg-card p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg",
        bookedState && "border-emerald-500/50 bg-emerald-500/[0.03]",
        className
      )}
    >
      <div>
        {/* Header con Gym Name o Kicker */}
        <div className="flex items-center justify-between gap-2 pb-2">
          {gymName ? (
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
              {gymName}
            </span>
          ) : (
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-1.5">
              <Calendar className="w-3 h-3" /> Turno del día
            </span>
          )}

          <Badge
            variant={bookedState ? "default" : isFull ? "secondary" : "outline"}
            className={cn(
              "text-[10px] font-semibold tracking-wider uppercase rounded-full px-2.5 py-0.5",
              bookedState && "bg-emerald-600 hover:bg-emerald-700 text-white border-transparent",
              !bookedState && !isFull && "text-emerald-700 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
              isFull && "text-muted-foreground bg-secondary/50"
            )}
          >
            {bookedState ? "Reservado" : isFull ? "Completo" : `${availableSpots} libres`}
          </Badge>
        </div>

        {/* Nombre de la clase */}
        <h3 className="font-bebas text-2xl tracking-wide text-foreground mt-1 group-hover:text-primary transition-colors">
          {name}
        </h3>

        {/* Info de instructor, horario y duración */}
        <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-muted-foreground mt-1.5">
          <span className="flex items-center gap-1 font-medium text-foreground/90">
            <Clock className="w-3.5 h-3.5 text-primary" />
            {time} ({duration} min)
          </span>
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            {instructor}
          </span>
        </div>
      </div>

      {/* Botón de Acción Directo (Regla de los 2 toques) */}
      <div className="pt-4 mt-2 border-t border-border/40 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {bookedState ? "Lugar asegurado" : isFull ? "Sin cupo disponible" : "Confirmación inmediata"}
        </span>

        <Button
          size={compact ? "sm" : "default"}
          variant={bookedState ? "outline" : isFull ? "secondary" : "default"}
          disabled={loading || (isFull && !bookedState)}
          onClick={handleAction}
          className={cn(
            "rounded-full px-5 font-semibold text-xs transition-all cursor-pointer",
            bookedState && "text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30",
            !bookedState && !isFull && "bg-foreground text-background hover:bg-foreground/90 shadow-sm"
          )}
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
          ) : bookedState ? (
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> Cancelar
            </span>
          ) : (
            <span className="flex items-center gap-1">
              Reservar <ArrowRight className="w-3.5 h-3.5" />
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
