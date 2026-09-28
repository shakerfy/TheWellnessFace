import React, { useState, useMemo } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Gym } from "@/lib/gyms";

interface GymMembershipsSectionProps {
  gym: Gym;
}

export function GymMembershipsSection({ gym }: GymMembershipsSectionProps) {
  const [membershipFilter, setMembershipFilter] = useState("Todos");
  const [accessHoursFilter, setAccessHoursFilter] = useState("Todos");
  const [passTypeFilter, setPassTypeFilter] = useState("Todos");

  const membershipTags = useMemo(() => {
    const tagsSet = new Set<string>();
    gym.memberships.forEach((m) => {
      if (m.tag) tagsSet.add(m.tag);
    });
    return ["Todos", ...Array.from(tagsSet)];
  }, [gym.memberships]);

  const filteredMemberships = useMemo(() => {
    return gym.memberships.filter((m) => {
      const matchesTag = membershipFilter === "Todos" || m.tag === membershipFilter;

      const matchesHours =
        accessHoursFilter === "Todos" ||
        (accessHoursFilter === "Full-Time" && m.accessHoursType === "Full-Time") ||
        (accessHoursFilter === "Off-Peak" && m.accessHoursType === "Off-Peak");

      const matchesPass =
        passTypeFilter === "Todos" ||
        (passTypeFilter === "Ilimitado" && m.passType === "Pase Libre") ||
        (passTypeFilter === "Creditos" && m.passType === "Por Créditos");

      return matchesTag && matchesHours && matchesPass;
    });
  }, [gym.memberships, membershipFilter, accessHoursFilter, passTypeFilter]);

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-semibold tracking-tight">Membresías y planes</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Elegí el plan que mejor se adapta a tu ritmo.
      </p>

      {/* Memberships Filters */}
      <div className="mt-4 flex flex-col gap-4 border-b border-border/40 pb-4">
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {membershipTags.map((t) => (
            <button
              key={t}
              onClick={() => setMembershipFilter(t)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${
                membershipFilter === t
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Advanced Filters */}
        <div className="flex flex-wrap gap-x-6 gap-y-3 items-center text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Tipo:
            </span>
            <div className="flex gap-1 bg-secondary/35 p-0.5 rounded-lg border border-border/40">
              {[
                { label: "Todos", value: "Todos" },
                { label: "Pase Libre", value: "Ilimitado" },
                { label: "Por Clases", value: "Creditos" },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setPassTypeFilter(item.value)}
                  className={`px-2.5 py-1 rounded-md transition text-[11px] font-medium ${
                    passTypeFilter === item.value
                      ? "bg-background text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Horario:
            </span>
            <div className="flex gap-1 bg-secondary/35 p-0.5 rounded-lg border border-border/40">
              {[
                { label: "Todos", value: "Todos" },
                { label: "Todo Horario", value: "Full-Time" },
                { label: "Off-Peak", value: "Off-Peak" },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setAccessHoursFilter(item.value)}
                  className={`px-2.5 py-1 rounded-md transition text-[11px] font-medium ${
                    accessHoursFilter === item.value
                      ? "bg-background text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {filteredMemberships.length === 0 ? (
        <div className="mt-6 py-12 text-center border border-dashed border-border rounded-3xl bg-secondary/10">
          <p className="text-sm font-semibold text-foreground">
            No encontramos planes que coincidan con estos filtros.
          </p>
          <button
            onClick={() => {
              setMembershipFilter("Todos");
              setPassTypeFilter("Todos");
              setAccessHoursFilter("Todos");
            }}
            className="mt-3 text-xs font-semibold text-primary hover:underline"
          >
            Restablecer filtros de búsqueda
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {filteredMemberships.map((m, idx) => (
            <div
              key={m.name}
              className={`rounded-2xl border p-6 transition-all duration-300 flex flex-col justify-between ${
                idx === 1
                  ? "border-foreground bg-foreground text-background hover:scale-[1.01]"
                  : "border-border bg-background hover:border-foreground/40 hover:scale-[1.01] hover:bg-secondary/10"
              }`}
            >
              <div>
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-base font-semibold tracking-tight">{m.name}</div>
                    {m.tag && (
                      <span
                        className={`inline-block mt-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                          idx === 1
                            ? "bg-background/20 text-background"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {m.tag}
                      </span>
                    )}
                  </div>
                  <div
                    className={`text-xs ${idx === 1 ? "text-background/70" : "text-muted-foreground"}`}
                  >
                    {m.duration}
                  </div>
                </div>
                <div className="mt-4 text-3xl font-semibold tracking-tight">
                  {m.originalPrice && (
                    <span
                      className={`text-sm font-normal line-through mr-2 ${
                        idx === 1 ? "text-background/60" : "text-muted-foreground"
                      }`}
                    >
                      ${m.originalPrice.toLocaleString("es-AR")}
                    </span>
                  )}
                  ${m.price.toLocaleString("es-AR")}
                </div>

                {/* Advanced access details (pass type, hours, activities) */}
                <div
                  className={`mt-4 space-y-1.5 border-t pt-3 text-xs ${
                    idx === 1
                      ? "border-background/20 text-background/80"
                      : "border-border/60 text-muted-foreground"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>🎟️</span>
                    <span>
                      {m.passType === "Por Créditos"
                        ? `${m.creditsCount} clases / créditos`
                        : "Pase Libre (Ilimitado)"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>🕒</span>
                    <span>
                      {m.accessHoursType === "Off-Peak"
                        ? `Franja Off-Peak (${m.offPeakStart} - ${m.offPeakEnd} hs)`
                        : "Acceso Completo (Todo Horario)"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>💵</span>
                    <span>
                      {m.registrationFee && m.registrationFee > 0
                        ? `Matrícula: $${m.registrationFee.toLocaleString("es-AR")}`
                        : "Matrícula Bonificada 🎉"}
                    </span>
                  </div>

                  {m.freezeDays && m.freezeDays > 0 ? (
                    <div className="flex items-center gap-1.5">
                      <span>❄️</span>
                      <span>Congelamiento: {m.freezeDays} días/año</span>
                    </div>
                  ) : null}
                  {m.dailyClassLimit && m.dailyClassLimit !== "Ilimitado" ? (
                    <div className="flex items-center gap-1.5">
                      <span>🛡️</span>
                      <span>Límite: {m.dailyClassLimit}</span>
                    </div>
                  ) : null}
                </div>

                {/* Included activities */}
                {m.includedActivities && m.includedActivities.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {m.includedActivities.map((act) => (
                      <span
                        key={act}
                        className={`text-[8.5px] px-2 py-0.5 rounded-full font-medium ${
                          idx === 1
                            ? "bg-background/25 text-background"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {act}
                      </span>
                    ))}
                  </div>
                )}

                <ul className="mt-4 space-y-2 border-t border-border/60 pt-3 text-sm">
                  {m.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <Check
                        className={`mt-0.5 h-4 w-4 shrink-0 ${idx === 1 ? "text-background" : "text-foreground"}`}
                      />
                      <span
                        className={idx === 1 ? "text-background/90" : "text-muted-foreground"}
                      >
                        {b}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                variant={idx === 1 ? "secondary" : "outline"}
                className="mt-6 w-full rounded-full"
              >
                Elegir plan
              </Button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
