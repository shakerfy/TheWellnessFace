import { Edit2, Eye, Trash2 } from "lucide-react";
import { StaffMember } from "./types";

interface StaffCardProps {
  staff: StaffMember;
  onEdit: (staff: StaffMember) => void;
  onDelete: (staff: StaffMember) => void;
  onViewCertificates: (images: string[]) => void;
}

export function StaffCard({
  staff: s,
  onEdit,
  onDelete,
  onViewCertificates,
}: StaffCardProps) {
  const hasAvailability =
    s.availability && s.availability.some((a) => a.intervals && a.intervals.length > 0);

  const activeAvails = s.availability?.filter((a) => a.intervals.length > 0) || [];

  return (
    <div className="relative p-4 border border-border rounded-2xl bg-secondary/10 flex flex-col justify-between min-h-[140px] hover:border-border/80 transition-all shadow-xs">
      <div className="absolute top-2 right-2 flex gap-1 z-10">
        <button
          type="button"
          onClick={() => onEdit(s)}
          className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition cursor-pointer"
          title="Editar miembro"
        >
          <Edit2 className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(s)}
          className="p-1.5 rounded-full hover:bg-destructive/10 text-destructive transition cursor-pointer"
          title="Eliminar miembro"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <img
          src={s.photo}
          alt={s.name}
          className="h-12 w-12 rounded-full object-cover border border-border shrink-0"
        />
        <div className="min-w-0 pr-14">
          <div className="text-xs font-bold text-foreground truncate">{s.name}</div>
          <div className="text-[10px] text-muted-foreground truncate">{s.specialty}</div>
          <div className="mt-1 flex flex-wrap gap-1">
            {s.role && (
              <span className="text-[8px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                {s.role === "coach" ? "Coach" : s.role === "receptionist" ? "Recep" : "Manager"}
              </span>
            )}
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {s.certifications.map((c: string) => (
              <span
                key={c}
                className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Availability details */}
      {hasAvailability && (
        <div className="mt-3.5 border-t border-border/40 pt-2 text-[10px] space-y-1 bg-secondary/5 p-2 rounded-xl">
          <div
            className="text-muted-foreground font-medium line-clamp-2"
            title={activeAvails
              .map((a) => `${a.day}: ${a.intervals.map((i) => `${i.from}-${i.to}`).join(", ")}`)
              .join("\n")}
          >
            <span className="font-bold text-foreground">Disponibilidad:</span>{" "}
            {activeAvails
              .map((a) => `${a.day.slice(0, 3)} (${a.intervals.map((i) => `${i.from}-${i.to}`).join(",")})`)
              .join(" | ")}
          </div>
        </div>
      )}

      {s.certificationImages && s.certificationImages.length > 0 && (
        <button
          type="button"
          onClick={() => onViewCertificates(s.certificationImages || [])}
          className="mt-3 text-[10px] font-bold text-primary hover:underline self-start flex items-center gap-1 cursor-pointer"
        >
          <Eye className="h-3 w-3" /> Ver Certificados ({s.certificationImages.length})
        </button>
      )}
    </div>
  );
}
