import { useState } from "react";
import { MessageCircle, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { GymFacilityReview } from "./types";

interface PublicReviewCardProps {
  review: GymFacilityReview;
  isFeatured: boolean;
  onToggleFeatured: (id: string) => void;
  onSendReply: (id: string, text: string) => void;
  onRequestDeleteReply: (id: string, studentName: string) => void;
}

export function PublicReviewCard({
  review: rev,
  isFeatured,
  onToggleFeatured,
  onSendReply,
  onRequestDeleteReply,
}: PublicReviewCardProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState(rev.reply || "");

  const handleStartEdit = () => {
    setReplyText(rev.reply || "");
    setIsReplying(true);
  };

  const handlePublish = () => {
    if (!replyText.trim()) return;
    onSendReply(rev.id, replyText.trim());
    setIsReplying(false);
  };

  const handleCancel = () => {
    setReplyText(rev.reply || "");
    setIsReplying(false);
  };

  return (
    <div className="bg-card border border-border p-5 rounded-3xl space-y-3.5 hover:border-border/80 transition-all shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={rev.studentPhoto}
            alt={rev.studentName}
            className="w-10 h-10 rounded-full object-cover border border-border shrink-0 shadow-2xs"
          />
          <div>
            <div className="font-bold text-sm text-foreground flex items-center gap-2">
              <span>{rev.studentName}</span>
              {isFeatured && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[10px] font-extrabold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  Destacada en Perfil
                </span>
              )}
            </div>
            <div className="text-xs text-muted-foreground">{rev.date}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 font-extrabold text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-xl border border-amber-500/30">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>{rev.overallRating.toFixed(1)}</span>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onToggleFeatured(rev.id)}
            className={cn(
              "h-8 text-[11px] font-bold rounded-xl gap-1 border-border",
              isFeatured
                ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 hover:bg-amber-500/20"
                : "hover:bg-secondary",
            )}
          >
            <Star className={cn("h-3.5 w-3.5", isFeatured && "fill-amber-500 text-amber-500")} />
            {isFeatured ? "Destacada" : "Destacar"}
          </Button>
        </div>
      </div>

      <p className="text-xs sm:text-sm leading-relaxed text-foreground/90 font-medium bg-secondary/15 p-3 rounded-2xl border border-border/40">
        "{rev.comment}"
      </p>

      {/* Sub-ratings badges */}
      <div className="flex flex-wrap gap-2 text-[10.5px] text-muted-foreground pt-0.5">
        <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 font-medium border border-amber-500/20">
          Limpieza: <strong className="font-mono text-foreground">{rev.ratingCleanliness} ★</strong>
        </span>
        <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 font-medium border border-amber-500/20">
          Equipamiento:{" "}
          <strong className="font-mono text-foreground">{rev.ratingEquipment} ★</strong>
        </span>
        <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 font-medium border border-amber-500/20">
          Staff: <strong className="font-mono text-foreground">{rev.ratingStaff} ★</strong>
        </span>
        <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 font-medium border border-amber-500/20">
          Precio: <strong className="font-mono text-foreground">{rev.ratingPrice} ★</strong>
        </span>
      </div>

      {/* Official Reply Section */}
      {rev.reply && !isReplying ? (
        <div className="mt-3 p-3.5 rounded-2xl bg-secondary/30 border border-border/60 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-primary flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-primary" /> Respuesta Oficial del Centro
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleStartEdit}
                className="text-[10.5px] text-muted-foreground hover:text-foreground font-semibold underline cursor-pointer"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() => onRequestDeleteReply(rev.id, rev.studentName)}
                className="text-[10.5px] text-rose-500 hover:text-rose-600 font-semibold underline flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="h-3 w-3" /> Eliminar Respuesta
              </button>
            </div>
          </div>
          <p className="text-muted-foreground leading-relaxed">{rev.reply}</p>
        </div>
      ) : !rev.reply && !isReplying ? (
        <button
          type="button"
          onClick={() => setIsReplying(true)}
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1.5 pt-1 cursor-pointer"
        >
          <MessageCircle className="w-3.5 h-3.5" /> Responder como Administrador
        </button>
      ) : null}

      {isReplying && (
        <div className="space-y-2 pt-2 animate-fade-in">
          <Textarea
            rows={2}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Escribe la respuesta oficial para el alumno..."
            className="flex w-full rounded-2xl border border-border bg-background px-3 py-2 text-xs font-bold text-foreground placeholder:font-normal placeholder:text-muted-foreground"
          />
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl text-xs font-bold"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              size="sm"
              className="rounded-xl text-xs font-bold bg-primary text-primary-foreground"
              onClick={handlePublish}
            >
              Publicar Respuesta Oficial
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
