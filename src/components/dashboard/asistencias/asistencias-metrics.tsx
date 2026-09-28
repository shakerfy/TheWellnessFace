import { CheckCircle2, Scan, Navigation, DoorOpen } from "lucide-react";

export interface AsistenciasMetricsProps {
  currentOccupancy?: number;
  maxCapacity?: number;
  qrPercentage?: number;
  qrCount?: number;
  gpsPercentage?: number;
  gpsCount?: number;
  manualPercentage?: number;
  manualCount?: number;
}

export function AsistenciasMetrics({
  currentOccupancy = 42,
  maxCapacity = 80,
  qrPercentage = 65,
  qrCount = 28,
  gpsPercentage = 25,
  gpsCount = 11,
  manualPercentage = 10,
  manualCount = 4,
}: AsistenciasMetricsProps) {
  const occupancyPercent = Math.min(
    100,
    Math.round((currentOccupancy / (maxCapacity || 1)) * 100),
  );

  return (
    <div className="grid gap-5 md:grid-cols-4">
      {/* Aforo Actual */}
      <div className="rounded-3xl border border-border bg-card shadow-xs p-5 flex flex-col justify-between hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
            Aforo Actual Sede
          </span>
          <div className="h-9 w-9 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-3xl font-extrabold tracking-tight">
            {currentOccupancy} <span className="text-sm font-medium text-muted-foreground">/ {maxCapacity}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              style={{ width: `${occupancyPercent}%` }}
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
            />
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">
            Ocupación segura al {occupancyPercent}%
          </p>
        </div>
      </div>

      {/* Check-ins por QR */}
      <div className="rounded-3xl border border-border bg-card shadow-xs p-5 flex flex-col justify-between hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
            Check-ins QR
          </span>
          <div className="h-9 w-9 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
            <Scan className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-3xl font-extrabold tracking-tight">{qrPercentage}%</div>
          <p className="text-[11px] text-muted-foreground mt-1">{qrCount} ingresos escaneados hoy</p>
        </div>
      </div>

      {/* Check-ins por GPS */}
      <div className="rounded-3xl border border-border bg-card shadow-xs p-5 flex flex-col justify-between hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
            Check-ins GPS (50m)
          </span>
          <div className="h-9 w-9 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
            <Navigation className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-3xl font-extrabold tracking-tight">{gpsPercentage}%</div>
          <p className="text-[11px] text-muted-foreground mt-1">{gpsCount} accesos por cercanía</p>
        </div>
      </div>

      {/* Recepción Manual */}
      <div className="rounded-3xl border border-border bg-card shadow-xs p-5 flex flex-col justify-between hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
            Recepción Manual
          </span>
          <div className="h-9 w-9 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
            <DoorOpen className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-3xl font-extrabold tracking-tight">{manualPercentage}%</div>
          <p className="text-[11px] text-muted-foreground mt-1">{manualCount} validados en mostrador</p>
        </div>
      </div>
    </div>
  );
}
