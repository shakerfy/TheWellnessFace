import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ArmstrongUrineScaleVisual } from "./armstrong-scale";

export interface TimelineHydrationCardProps {
  item: any;
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
}

export function TimelineHydrationCard({
  item,
  onEdit,
  onDelete,
}: TimelineHydrationCardProps) {
  return (
    <Card className="relative rounded-3xl border border-border bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg cursor-pointer select-none">
      <div className="p-5 sm:p-6 space-y-3">
        <ArmstrongUrineScaleVisual
          selectedLevel={
            item.level ||
            parseInt(String(item.tag || "").replace(/\D/g, "")) ||
            2
          }
          readOnly={true}
          title={(item.title || "Registro de Hidratación")
            .replace(/\s*\(Armstrong\)/gi, "")
            .trim()}
          subtitle={(item.desc || "Nivel 2 — Amarillo Pálido")
            .replace(/\s*\(Hidratación Saludable\)/gi, "")
            .replace(/\s*\(Armstrong\)/gi, "")
            .trim()}
          hideAdvice={true}
          actions={
            <div className="flex items-center gap-1 bg-secondary/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-border/60 shadow-xs shrink-0">
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
          }
        />
      </div>
    </Card>
  );
}
