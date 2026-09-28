import {
  Star,
  Copy,
  Edit2,
  Trash2,
  Ticket,
  Clock,
  CreditCard,
  Snowflake,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Amenity, Membership } from "./types";

interface MembershipCardProps {
  membership: Membership;
  amenities: Amenity[];
  onToggleFeatured: (id: string) => void;
  onDuplicate: (m: Membership) => void;
  onEdit: (m: Membership) => void;
  onDelete: (m: Membership) => void;
}

export function MembershipCard({
  membership: m,
  amenities,
  onToggleFeatured,
  onDuplicate,
  onEdit,
  onDelete,
}: MembershipCardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border bg-card p-6 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 shadow-xs",
        m.isFeatured
          ? "border-amber-500/50 dark:border-amber-400/50 ring-1 ring-amber-500/30 shadow-md"
          : "border-border hover:border-foreground/30",
      )}
    >
      <div>
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-bold text-lg text-foreground">{m.name}</h3>
              {m.isFeatured && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/30 text-[9.5px] font-black flex items-center gap-1">
                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                  Más Elegido
                </span>
              )}
            </div>
            {m.tag && (
              <span className="inline-block mt-1.5 text-[9.5px] font-extrabold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {m.tag}
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground font-semibold bg-secondary/50 px-2.5 py-1 rounded-xl border border-border/50">
            {m.duration}
          </span>
        </div>

        <div className="mt-4 text-3xl font-extrabold tracking-tight text-foreground">
          {m.originalPrice && (
            <span className="text-sm font-normal text-muted-foreground line-through mr-2">
              ${m.originalPrice.toLocaleString("es-AR")}
            </span>
          )}
          ${m.price.toLocaleString("es-AR")}
        </div>

        {/* Pass Type & Hours Badges */}
        <div className="mt-4 space-y-2 border-t border-border/60 pt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Ticket className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>
              {m.passType === "Por Créditos"
                ? `${m.creditsCount} clases / créditos`
                : "Pase Libre (Ilimitado)"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span>
              {m.accessHoursType === "Off-Peak"
                ? `Franja Off-Peak (${m.offPeakStart} - ${m.offPeakEnd} hs)`
                : "Acceso Completo (Todo Horario)"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span>
              {m.registrationFee && m.registrationFee > 0
                ? `Matrícula: $${m.registrationFee.toLocaleString("es-AR")}`
                : "Matrícula Bonificada"}
            </span>
          </div>
          {m.freezeDays && m.freezeDays > 0 ? (
            <div className="flex items-center gap-2">
              <Snowflake className="h-3.5 w-3.5 text-blue-500 shrink-0" />
              <span>Congelamiento: {m.freezeDays} días/año</span>
            </div>
          ) : null}
          {m.dailyClassLimit && m.dailyClassLimit !== "Ilimitado" ? (
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span>Límite: {m.dailyClassLimit}</span>
            </div>
          ) : null}
        </div>

        {/* Included Activities badges */}
        {m.includedActivities && m.includedActivities.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {m.includedActivities.map((act) => (
              <span
                key={act}
                className="text-[9.5px] bg-secondary text-secondary-foreground border border-border/50 px-2.5 py-0.5 rounded-full font-bold"
              >
                {act}
              </span>
            ))}
          </div>
        )}

        <ul className="mt-4 space-y-2 border-t border-border/60 pt-3">
          {m.includedServices.map((serviceId) => {
            const serviceName = amenities.find((a) => a.id === serviceId)?.name || serviceId;
            return (
              <li
                key={serviceId}
                className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" /> {serviceName}
              </li>
            );
          })}
          {m.includedServices.length === 0 && (
            <li className="text-xs text-muted-foreground italic">
              Sin amenities especiales incluidos.
            </li>
          )}
        </ul>
      </div>

      <div className="space-y-4 mt-6">
        <div className="border-t border-border/60 pt-4 flex items-center justify-between text-xs text-muted-foreground font-semibold">
          <span>Miembros activos:</span>
          <span className="font-bold text-foreground bg-secondary/80 border border-border/60 px-2.5 py-0.5 rounded-full font-mono">
            {m.activeCount}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          <button
            type="button"
            onClick={() => onToggleFeatured(m.id)}
            className={cn(
              "flex items-center justify-center gap-1 px-2 py-1.5 rounded-xl border text-[10.5px] font-bold transition",
              m.isFeatured
                ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 hover:bg-amber-500/20"
                : "border-border bg-background hover:bg-secondary text-muted-foreground hover:text-foreground",
            )}
            title="Marcar como Plan Destacado en el Perfil del Gimnasio"
          >
            <Star className={cn("h-3.5 w-3.5", m.isFeatured && "fill-amber-500 text-amber-500")} />
            {m.isFeatured ? "Destacado" : "Destacar"}
          </button>
          <button
            type="button"
            onClick={() => onDuplicate(m)}
            className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-xl border border-border bg-background hover:bg-secondary text-[10.5px] text-muted-foreground hover:text-foreground font-bold transition"
            title="Duplicar plan"
          >
            <Copy className="h-3.5 w-3.5" /> Clonar
          </button>
          <button
            type="button"
            onClick={() => onEdit(m)}
            className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-xl border border-border bg-background hover:bg-secondary text-[10.5px] text-muted-foreground hover:text-foreground font-bold transition"
          >
            <Edit2 className="h-3.5 w-3.5" /> Editar
          </button>
          <button
            type="button"
            onClick={() => onDelete(m)}
            className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-xl border border-border bg-background hover:bg-rose-500/10 hover:text-rose-600 text-[10.5px] text-muted-foreground font-bold transition"
          >
            <Trash2 className="h-3.5 w-3.5" /> Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
