import React from "react";
import { Edit, Trash2, Info } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface MealCardActionsProps {
  item: any;
  onToggleSave?: (id: string) => void;
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
  className?: string;
}

export function MealCardActions({
  item,
  onEdit,
  onDelete,
  className,
}: MealCardActionsProps) {
  const hasImage = Boolean(item?.img);

  return (
    <div
      className={cn(
        "flex items-center gap-0.5 px-2 py-0.5 rounded-full transition-all duration-300",
        hasImage
          ? "bg-white/20 dark:bg-black/30 backdrop-blur-xl backdrop-saturate-200 border border-white/40 dark:border-white/20 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.6),0_4px_16px_0_rgba(0,0,0,0.12)] text-zinc-900 dark:text-white"
          : "bg-black/[0.03] dark:bg-white/[0.06] backdrop-blur-xl backdrop-saturate-180 border border-black/[0.08] dark:border-white/10 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.8),0_1px_4px_0_rgba(0,0,0,0.03)] text-muted-foreground",
        className,
      )}
    >
      {/* Botón Informativo 'i' (Cómo opera la IA y Descargo de Responsabilidad) */}
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "p-1 rounded-full transition cursor-pointer",
              hasImage
                ? "text-zinc-800 dark:text-zinc-100 hover:text-sky-500 hover:bg-white/35 dark:hover:bg-white/20"
                : "text-muted-foreground hover:text-sky-500 hover:bg-black/[0.05] dark:hover:bg-white/15",
            )}
            title="Aviso importante y descargo de responsabilidad"
            aria-label="Aviso importante y descargo de responsabilidad"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          side="bottom"
          onClick={(e) => e.stopPropagation()}
          className="w-72 sm:w-80 p-3.5 rounded-2xl bg-card/95 backdrop-blur-xl border border-border shadow-xl text-left z-50 space-y-1.5"
        >
          <h4 className="text-xs font-bold text-foreground">
            Aviso importante
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            La identificación visual y los insights tienen fines exclusivamente educativos y de bienestar general, y no constituyen un diagnóstico médico ni una prescripción dietética. Ante cualquier condición clínica, consultá siempre a un profesional de la salud matriculado.
          </p>
        </PopoverContent>
      </Popover>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onEdit(item);
        }}
        className={cn(
          "p-1 rounded-full transition cursor-pointer",
          hasImage
            ? "text-zinc-800 dark:text-zinc-100 hover:text-foreground hover:bg-white/35 dark:hover:bg-white/20"
            : "text-muted-foreground hover:text-foreground hover:bg-black/[0.05] dark:hover:bg-white/15",
        )}
        title="Editar registro"
        aria-label="Editar registro"
      >
        <Edit className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(item.id);
        }}
        className="p-1 rounded-full text-muted-foreground hover:text-rose-500 hover:bg-rose-500/15 transition cursor-pointer"
        title="Eliminar registro"
        aria-label="Eliminar registro"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
