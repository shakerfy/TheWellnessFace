import React from "react";
import { cn } from "@/lib/utils";
import { MealCardActions } from "./timeline-meal-actions";

export interface MealImageBannerProps {
  item: any;
  onToggleSave: (id: string) => void;
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
}

export function MealImageBanner({
  item,
  onToggleSave,
  onEdit,
  onDelete,
}: MealImageBannerProps) {
  if (!item.img) return null;

  return (
    <div className="relative h-44 w-full rounded-t-3xl overflow-hidden group">
      <img
        src={item.img}
        alt={item.title}
        draggable={false}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none select-none"
      />

      {/* 6-Bar Ascending Signal / Confidence Meter */}
      <div className="absolute top-3 left-3 z-10">
        <div
          className="h-8 px-3 rounded-full bg-background/80 backdrop-blur-md border border-border/60 shadow-xs flex items-center gap-2 select-none"
          aria-label="Precisión estimada del escaneo"
        >
          <span className="text-[11px] font-semibold tracking-tight text-foreground whitespace-nowrap leading-none translate-y-[1px]">
            Precisión est.
          </span>
          <div
            className="flex items-end gap-[2.5px] h-3.5 shrink-0"
            aria-hidden="true"
          >
            {[4, 6, 8, 10, 12, 14].map((barH, barIdx) => {
              const activeBars = (item.bioGaugeIndex ?? 4) >= 5 ? 5 : 4;
              const isBarActive = barIdx < activeBars;
              return (
                <span
                  key={barH}
                  style={{ width: "3px", height: `${barH}px` }}
                  className={cn(
                    "block shrink-0 rounded-full transition-colors",
                    isBarActive
                      ? "bg-zinc-900 dark:bg-zinc-100"
                      : "bg-zinc-400/50 dark:bg-zinc-600",
                  )}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Right Action Pill */}
      <MealCardActions
        item={item}
        onToggleSave={onToggleSave}
        onEdit={onEdit}
        onDelete={onDelete}
        className="absolute top-3 right-3 z-10 h-8"
      />
    </div>
  );
}
