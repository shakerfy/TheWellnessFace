import React from "react";
import { Eye } from "lucide-react";
import { type Gym } from "@/lib/gyms";

interface GymStaffSectionProps {
  staff?: Gym["staff"];
  onViewCertifications: (images: string[]) => void;
}

export function GymStaffSection({ staff, onViewCertifications }: GymStaffSectionProps) {
  if (!staff || staff.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-semibold tracking-tight">Nuestro Staff</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Entrenadores certificados listos para guiar tu entrenamiento.
      </p>
      <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {staff.map((coach) => (
          <div
            key={coach.id}
            className="rounded-2xl border border-border bg-card p-4 flex flex-col justify-between hover:border-foreground/30 hover:bg-secondary/10 transition duration-300 min-h-[140px]"
          >
            <div className="flex items-center gap-4">
              <img
                src={coach.photo}
                alt={coach.name}
                className="h-14 w-14 rounded-full object-cover border border-border shrink-0"
              />
              <div>
                <div className="text-sm font-bold text-foreground">{coach.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{coach.specialty}</div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {coach.certifications.map((c) => (
                    <span
                      key={c}
                      className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {coach.certificationImages && coach.certificationImages.length > 0 && (
              <button
                onClick={() => onViewCertifications(coach.certificationImages || [])}
                className="mt-3 text-[10px] font-bold text-primary hover:underline flex items-center gap-1 self-start"
              >
                <Eye className="h-3 w-3" /> Ver Certificados ({coach.certificationImages.length})
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
