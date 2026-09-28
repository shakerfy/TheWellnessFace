import { useState } from "react";
import {
  Brain,
  ChevronLeft,
  Plus,
  Sparkles,
  X,
  Utensils,
  Dumbbell,
  Shield,
  Zap,
  Coffee,
  Wheat,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AiMemoryItem } from "./types";

interface AiMemoryViewProps {
  aiMemories: AiMemoryItem[];
  onAddMemory: (text: string) => void;
  onDeleteMemory: (id: string) => void;
  onClearAll: () => void;
  onBack: () => void;
}

export function AiMemoryView({
  aiMemories,
  onAddMemory,
  onDeleteMemory,
  onClearAll,
  onBack,
}: AiMemoryViewProps) {
  const [newMemoryText, setNewMemoryText] = useState("");
  const [memoryFilter, setMemoryFilter] = useState<"all" | "nutricion" | "entrenamiento">("all");

  const nutritionCount = aiMemories.filter((m) => m.domain !== "entrenamiento").length;
  const trainingCount = aiMemories.filter((m) => m.domain === "entrenamiento").length;

  const filteredMemories = aiMemories.filter((m) => {
    if (memoryFilter === "nutricion") return m.domain !== "entrenamiento";
    if (memoryFilter === "entrenamiento") return m.domain === "entrenamiento";
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMemoryText.trim()) {
      onAddMemory(newMemoryText.trim());
      setNewMemoryText("");
    }
  };

  const getCategoryBadge = (mem: AiMemoryItem) => {
    if (mem.domain === "entrenamiento") {
      switch (mem.category) {
        case "intensidad":
          return {
            label: "Intensidad",
            color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
          };
        case "cuidado":
          return {
            label: "Cuidado",
            color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
          };
        case "ejercicio":
          return {
            label: "Ejercicio",
            color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
          };
        default:
          return {
            label: "Entreno",
            color: "bg-primary/10 text-primary border-primary/20",
          };
      }
    }

    switch (mem.category) {
      case "proteina":
        return {
          label: "Proteína",
          color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
        };
      case "carbo":
        return {
          label: "Carbohidrato",
          color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        };
      case "grasa":
        return {
          label: "Grasa",
          color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        };
      case "habito":
        return {
          label: "Hábito",
          color: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
        };
      default:
        return {
          label: "Nutrición",
          color: "bg-primary/10 text-primary border-primary/20",
        };
    }
  };

  return (
    <div className="space-y-6 max-w-3xl pb-16 animate-fade-in">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" /> Volver a Ajustes
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" /> Memoria & Preferencias de la IA
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            La IA aprende de lo que comes, tus rotaciones y tu feedback de entrenamientos. Puedes
            eliminar cualquier recuerdo para resetearlo.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Aprendizaje Activo
          </span>
        </div>
      </div>

      {/* Input para añadir gusto o preferencia manualmente */}
      <div className="border border-border bg-card shadow-xs rounded-3xl p-5 sm:p-6 space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
          Añadir preferencia o aprendizaje
        </div>
        <form onSubmit={handleAddSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={newMemoryText}
            onChange={(e) => setNewMemoryText(e.target.value)}
            placeholder="Ej: Prefiero leche de coco en batidos, o press inclinado con mancuernas..."
            className="flex-1 px-4 py-2.5 rounded-2xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:ring-1 focus:ring-primary"
          />
          <Button
            type="submit"
            size="sm"
            disabled={!newMemoryText.trim()}
            className="rounded-2xl font-bold gap-1.5 px-4 h-10 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Añadir
          </Button>
        </form>
      </div>

      {/* Lista de recuerdos con Filtros por Dominio */}
      <div className="border border-border bg-card shadow-xs rounded-3xl p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-4">
          {/* Filtros de Categoría */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-secondary/60 border border-border/60">
            <button
              type="button"
              onClick={() => setMemoryFilter("all")}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer",
                memoryFilter === "all"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Todos ({aiMemories.length})
            </button>
            <button
              type="button"
              onClick={() => setMemoryFilter("nutricion")}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5",
                memoryFilter === "nutricion"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Utensils className="w-3.5 h-3.5 text-indigo-500" />
              <span>Nutrición</span>
              <span className="text-[10px] opacity-70">({nutritionCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setMemoryFilter("entrenamiento")}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5",
                memoryFilter === "entrenamiento"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Dumbbell className="w-3.5 h-3.5 text-orange-500" />
              <span>Entrenamiento</span>
              <span className="text-[10px] opacity-70">({trainingCount})</span>
            </button>
          </div>

          {aiMemories.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-[11px] font-bold text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 transition cursor-pointer self-end sm:self-auto"
            >
              Resetear memoria
            </button>
          )}
        </div>

        {filteredMemories.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <Brain className="w-10 h-10 text-muted-foreground/30 mx-auto" />
            <p className="text-xs font-medium text-muted-foreground">
              No hay recuerdos registrados en esta categoría.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredMemories.map((mem) => {
              const badge = getCategoryBadge(mem);
              return (
                <div
                  key={mem.id}
                  className="flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-border/60 bg-background/50 hover:bg-background hover:border-border transition group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={cn(
                        "px-2.5 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border shrink-0",
                        badge.color,
                      )}
                    >
                      {badge.label}
                    </span>
                    <span className="text-xs font-medium text-foreground truncate">
                      {mem.text}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteMemory(mem.id)}
                    title="Eliminar este recuerdo de la memoria"
                    className="w-7 h-7 rounded-xl flex items-center justify-center text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 transition cursor-pointer shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Tarjeta explicativa */}
      <div className="rounded-3xl border border-border/70 bg-secondary/30 p-5 sm:p-6 space-y-2">
        <div className="text-xs font-bold text-foreground flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" /> ¿Cómo utiliza la IA esta memoria unificada?
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          <strong>Nutrición:</strong> En sugerencias y análisis nutricionales, la IA prioriza tus
          alimentos favoritos conservando un 25% de variedad biológica.
          <br />
          <strong>Entrenamiento & Actividad:</strong> El AI Coach orienta tus recomendaciones de
          hidratación y recuperación según tus sensaciones físicas y registros de actividad.
        </p>
      </div>
    </div>
  );
}
