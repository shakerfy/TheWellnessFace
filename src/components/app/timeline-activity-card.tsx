import React from "react";
import {
  Clock,
  Activity,
  Bookmark,
  Edit,
  Trash2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface TimelineActivityCardProps {
  item: any;
  onEdit: (item: any) => void;
  onToggleSave: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TimelineActivityCard({
  item,
  onEdit,
  onToggleSave,
  onDelete,
}: TimelineActivityCardProps) {
  const workoutFocus = (() => {
    if (item.focus) return item.focus;
    if (item.targetRegion) return item.targetRegion;
    if (item.title && item.title.includes(":")) {
      return item.title.split(":")[1].trim();
    }
    return "Cuerpo Completo";
  })();

  const workoutDuration = (() => {
    if (item.durationMinutes) return `${item.durationMinutes} min`;
    if (item.duration) return `${item.duration} min`;
    const match = (item.subtitle || item.desc || item.coachFeedback || "").match(/(\d+)\s*min/i);
    return match ? `${match[1]} min` : "25 min";
  })();

  const workoutIntensity = (() => {
    if (item.intensityLabel) return item.intensityLabel;
    if (item.intensity) {
      return item.intensity === "high" || item.intensity === "extenuante"
        ? "Intensidad Alta"
        : item.intensity === "med" || item.intensity === "optima"
          ? "Intensidad Óptima"
          : "Intensidad Moderada";
    }
    const sub = (item.subtitle || "").toLowerCase();
    if (sub.includes("óptima") || sub.includes("optima")) return "Intensidad Óptima";
    if (sub.includes("alta") || sub.includes("extenuante")) return "Intensidad Alta";
    if (sub.includes("moderada") || sub.includes("media")) return "Intensidad Media";
    return "Intensidad Óptima";
  })();

  const actDuration =
    item.duration
      ? `${item.duration} min`
      : item.title?.match(/\((\d+)\s*min\)/i)?.[1]
        ? `${item.title.match(/\((\d+)\s*min\)/i)?.[1]} min`
        : item.coachFeedback?.match(/(\d+)\s*min/i)?.[1]
          ? `${item.coachFeedback.match(/(\d+)\s*min/i)?.[1]} min`
          : null;

  const rawIntensity =
    item.intensityLabel ||
    (item.intensity === "low"
      ? "Baja"
      : item.intensity === "med"
        ? "Media"
        : item.intensity === "high"
          ? "Alta"
          : item.intensity) ||
    item.coachFeedback?.match(/intensidad\s*([a-záéíóú]+)/i)?.[1] ||
    null;

  const actIntensity = rawIntensity
    ? rawIntensity.charAt(0).toUpperCase() + rawIntensity.slice(1).toLowerCase()
    : null;

  const displayTitle =
    item.type === "activity"
      ? (item.activityName || item.title || "")
          .replace(/\s*\(\d+\s*min\)/gi, "")
          .trim()
      : item.type === "workout"
        ? (item.workoutType || (item.title ? item.title.split(/[:\-–—]/)[0] : "Fuerza")).trim()
        : item.title;

  return (
    <Card className="relative rounded-3xl border border-border bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg cursor-pointer select-none">
      {item.img && (
        <div className="relative h-44 w-full rounded-t-3xl overflow-hidden group">
          <img
            src={item.img}
            alt={item.title}
            draggable={false}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none select-none"
          />
          <div className="absolute top-3 right-3 z-10 h-8 flex items-center gap-1 bg-background/80 backdrop-blur-md px-2 rounded-full border border-border/60 shadow-xs">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(item.id);
              }}
              className={cn(
                "p-1 transition cursor-pointer",
                item.isSaved || item.saved
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
              title={
                item.isSaved || item.saved
                  ? "Guardado en Saved Scans (clic para quitar)"
                  : "Guardar en Saved Scans"
              }
            >
              <Bookmark
                className={cn(
                  "w-3.5 h-3.5",
                  item.isSaved || item.saved ? "fill-foreground text-foreground" : "",
                )}
              />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
              className="p-1 text-muted-foreground hover:text-foreground transition cursor-pointer"
              title="Editar registro"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
              className="p-1 text-muted-foreground hover:text-rose-500 transition cursor-pointer"
              title="Eliminar registro"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <CardHeader className="p-5 pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-0 text-left">
            <CardTitle className="text-base sm:text-lg font-black leading-tight text-foreground">
              {displayTitle}
            </CardTitle>
            {item.subtitle ? (
              <CardDescription className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {item.subtitle}
              </CardDescription>
            ) : null}
          </div>

          {!item.img && (
            <div className="flex items-center gap-1 bg-secondary/80 backdrop-blur-md px-1.5 py-1 rounded-full border border-border/60 shadow-xs shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSave(item.id);
                }}
                className={cn(
                  "p-1 transition cursor-pointer",
                  item.isSaved || item.saved
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
                title={
                  item.isSaved || item.saved
                    ? "Guardado en Saved Scans (clic para quitar)"
                    : "Guardar en Saved Scans"
                }
              >
                <Bookmark
                  className={cn(
                    "w-3.5 h-3.5",
                    item.isSaved || item.saved ? "fill-foreground text-foreground" : "",
                  )}
                />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(item);
                }}
                className="p-1 text-muted-foreground hover:text-foreground transition cursor-pointer"
                title="Editar registro"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
                className="p-1 text-muted-foreground hover:text-rose-500 transition cursor-pointer"
                title="Eliminar registro"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-4 pt-0 space-y-3 text-left">
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-0.5">
          <div className="flex flex-wrap items-center gap-1.5">
            {item.type === "workout" ? (
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge
                  variant="outline"
                  className="rounded-full px-3 py-1 text-[11px] font-semibold border-border/70 bg-secondary/30 text-foreground flex items-center gap-1.5 shadow-none"
                >
                  <span>{workoutFocus}</span>
                </Badge>
                <Badge
                  variant="outline"
                  className="rounded-full px-3 py-1 text-[11px] font-semibold border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center gap-1.5 shadow-none"
                >
                  <Clock className="w-3.5 h-3.5 text-sky-500" />
                  <span>{workoutDuration}</span>
                </Badge>
                <Badge
                  variant="outline"
                  className="rounded-full px-3 py-1 text-[11px] font-semibold border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center gap-1.5 shadow-none"
                >
                  <Activity className="w-3.5 h-3.5 text-amber-500" />
                  <span>{workoutIntensity}</span>
                </Badge>
              </div>
            ) : item.type === "activity" ? (
              <div className="flex flex-wrap items-center gap-2">
                {actDuration && (
                  <Badge
                    variant="outline"
                    className="rounded-full px-3 py-1 text-[11px] font-bold border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center gap-1.5 shadow-none"
                  >
                    <Clock className="w-3.5 h-3.5 text-sky-500" />
                    <span>{actDuration}</span>
                  </Badge>
                )}
                {actIntensity && (
                  <Badge
                    variant="outline"
                    className="rounded-full px-3 py-1 text-[11px] font-bold border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 shadow-none"
                  >
                    <Activity className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Intensidad {actIntensity}</span>
                  </Badge>
                )}
                {item.metPoints ? (
                  <Badge
                    variant="outline"
                    className="rounded-full px-3 py-1 text-[11px] font-bold border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center gap-1.5 shadow-none"
                  >
                    <span>+{item.metPoints} Pts MET</span>
                  </Badge>
                ) : null}
              </div>
            ) : (
              item.tag && (
                <Badge
                  variant="outline"
                  className="rounded-full px-3 py-1 text-[11px] font-medium border-border/60 bg-secondary/25 text-muted-foreground flex items-center gap-1.5 shadow-none"
                >
                  <Activity className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{item.tag}</span>
                </Badge>
              )
            )}
          </div>
        </div>
      </CardContent>

      <div className="md:hidden px-5 pb-4 text-xs font-semibold text-muted-foreground text-left">
        <span>{item.time}</span>
      </div>
    </Card>
  );
}
