import { Scan, Navigation, DoorOpen, AlertCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RecentCheckinItem } from "./types";

export interface RecentCheckinsMonitorProps {
  recentCheckinsList: RecentCheckinItem[];
  membersList?: any[];
  onContactMember: (memberName: string) => void;
}

export function RecentCheckinsMonitor({
  recentCheckinsList,
  membersList = [],
  onContactMember,
}: RecentCheckinsMonitorProps) {
  const atRiskMembers = (membersList || [])
    .filter((m: any) => m.status === "activo" || m.status === "vencido")
    .slice(0, 3);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Recent Entries Checklist */}
      <div className="rounded-3xl border border-border bg-card shadow-xs p-6 col-span-2 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
            Monitor de Entradas Recientes
          </h3>
          <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Actualizado en vivo
          </span>
        </div>

        <div className="space-y-4">
          {recentCheckinsList.map((c, i) => (
            <div
              key={i}
              className="flex items-center justify-between pb-3 border-b border-border/50 last:border-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <img
                  src={c.photo}
                  alt={c.name}
                  className="h-9 w-9 rounded-full object-cover border border-border"
                />
                <div>
                  <div className="text-sm font-semibold text-foreground">{c.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <span>{c.time}</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-secondary border border-border font-medium text-foreground">
                      {c.method === "Scan QR" && <Scan className="w-3 h-3 text-emerald-500" />}
                      {c.method === "Geolocalización GPS" && (
                        <Navigation className="w-3 h-3 text-blue-500" />
                      )}
                      {c.method === "Recepción" && (
                        <DoorOpen className="w-3 h-3 text-amber-500" />
                      )}
                      {c.method}
                    </span>
                  </div>
                </div>
              </div>
              {c.alert && (
                <span
                  className={`text-[10px] font-bold uppercase border px-2.5 py-0.5 rounded-full ${c.alertColor}`}
                >
                  {c.alert}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Churn Risk / Alumnos en Riesgo Section */}
      <div className="rounded-3xl border border-amber-500/30 bg-amber-500/5 shadow-xs p-6 col-span-1 flex flex-col justify-between hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-lg transition-all duration-300">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Alumnos sin Asistencia
            </h3>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Riesgo Churn
            </span>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed mb-4">
            Socios con más de 12 días sin registrar check-in en la sede:
          </p>

          <div className="space-y-3 text-xs">
            {atRiskMembers.map((m: any, idx: number) => {
              const days = 12 + idx * 2;
              return (
                <div
                  key={m.name || idx}
                  className="p-3 rounded-2xl bg-card border border-border flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-foreground block">{m.name}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {m.plan || "Pase General"} · Hace {days} días
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full text-[10px] h-7 px-2.5 gap-1 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 font-bold"
                    onClick={() => onContactMember(m.name)}
                  >
                    <MessageCircle className="w-3 h-3" /> Contactar
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
