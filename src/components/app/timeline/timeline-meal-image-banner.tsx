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
