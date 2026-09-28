import React from "react";
import { Bookmark, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MealCardActionsProps {
  item: any;
  onToggleSave: (id: string) => void;
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
  className?: string;
}

export function MealCardActions({
  item,
  onToggleSave,
  onEdit,
  onDelete,
  className,
}: MealCardActionsProps) {
  const isSaved = item.isSaved || item.saved;

  return (
    <div
      className={cn(
        "flex items-center gap-1 bg-background/80 backdrop-blur-md px-2 rounded-full border border-border/60 shadow-xs",
        className,
      )}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleSave(item.id);
        }}
        className={cn(
          "p-1 transition cursor-pointer",
          isSaved
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
        title={
          isSaved
            ? "Guardado en Saved Scans (clic para quitar)"
            : "Guardar en Saved Scans"
        }
      >
        <Bookmark
          className={cn(
            "w-3.5 h-3.5",
            isSaved ? "fill-foreground text-foreground" : "",
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
  );
}
