import { Download, Search, X, Filter, Scan, Navigation, DoorOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AttendanceHistoryItem } from "./types";

export interface AsistenciasHistoryTableProps {
  historyList: AttendanceHistoryItem[];
  filteredHistory: AttendanceHistoryItem[];
  historySearch: string;
  onSearchChange: (value: string) => void;
  dateFilter: string;
  onDateFilterChange: (value: string) => void;
  methodFilter: string;
  onMethodFilterChange: (value: string) => void;
  onClearFilters: () => void;
  onExport: () => void;
}

export function AsistenciasHistoryTable({
  historyList,
  filteredHistory,
  historySearch,
  onSearchChange,
  dateFilter,
  onDateFilterChange,
  methodFilter,
  onMethodFilterChange,
  onClearFilters,
  onExport,
}: AsistenciasHistoryTableProps) {
  const hasActiveFilters = historySearch !== "" || dateFilter !== "Todos" || methodFilter !== "Todos";

  return (
    <div className="rounded-3xl border border-border bg-card shadow-xs p-6 space-y-5">
      {/* Header Block: Title + Subtitle + Count Badge + Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 whitespace-nowrap">
              Historial General de Asistencias
            </h3>
            <span className="whitespace-nowrap inline-flex items-center px-2.5 py-0.5 rounded-full bg-secondary border border-border text-[10px] font-bold text-foreground shrink-0">
              {filteredHistory.length} de {historyList.length} registros
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Registros detallados de accesos por escaneo QR, geolocalización GPS y recepción manual.
          </p>
        </div>

        {/* Top Actions: Export CSV */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <Button
            size="sm"
            variant="outline"
            className="rounded-xl gap-1.5 text-xs h-8 px-3"
            onClick={onExport}
          >
            <Download className="h-3.5 w-3.5" /> Exportar CSV
          </Button>
        </div>
      </div>

      {/* Toolbar: Search & Filter Pills Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-muted/30 p-3 rounded-2xl border border-border/60">
        {/* Search Input */}
        <div className="relative shrink-0">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar socio o clase..."
            value={historySearch}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-4 h-9 w-full sm:w-56 rounded-xl border border-border bg-background text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>

        {/* Filter Pills Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Filter */}
          <div className="flex bg-muted p-1 rounded-xl gap-1 text-xs border border-border/50">
            {["Todos", "Hoy", "Ayer", "Esta Semana"].map((d) => (
              <button
                key={d}
                onClick={() => onDateFilterChange(d)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition whitespace-nowrap cursor-pointer ${
                  dateFilter === d
                    ? "bg-background text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Method Filter */}
          <div className="flex bg-muted p-1 rounded-xl gap-1 text-xs border border-border/50">
            {["Todos", "Scan QR", "Geolocalización GPS", "Recepción"].map((m) => (
              <button
                key={m}
                onClick={() => onMethodFilterChange(m)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition whitespace-nowrap cursor-pointer ${
                  methodFilter === m
                    ? "bg-background text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Limpiar Filtros Button */}
          {hasActiveFilters && (
            <Button
              size="sm"
              variant="ghost"
              className="rounded-xl gap-1 text-xs h-8 px-2.5 text-muted-foreground hover:text-foreground border border-border/60 bg-background cursor-pointer"
              onClick={onClearFilters}
            >
              <X className="h-3.5 w-3.5" /> Limpiar Filtros
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden border border-border rounded-2xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted font-bold text-muted-foreground border-b border-border text-[11px] uppercase tracking-wider">
            <tr>
              <th className="p-3.5">Socio</th>
              <th className="p-3.5">Fecha</th>
              <th className="p-3.5">Hora de Entrada</th>
              <th className="p-3.5">Método de Acceso</th>
              <th className="p-3.5">Validación / Distancia</th>
              <th className="p-3.5">Clase / Actividad</th>
              <th className="p-3.5 text-right">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredHistory.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted-foreground text-xs">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Filter className="w-8 h-8 text-muted-foreground/40" />
                    <p className="font-semibold text-foreground">No se encontraron asistencias</p>
                    <p className="text-[11px] text-muted-foreground">
                      No hay coincidencias con los criterios de búsqueda o filtros seleccionados.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2 rounded-full text-xs gap-1 border-border cursor-pointer"
                      onClick={onClearFilters}
                    >
                      <X className="w-3 h-3" /> Restablecer filtros
                    </Button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredHistory.map((h) => (
                <tr key={h.id} className="hover:bg-secondary/20 transition">
                  <td className="p-3.5 font-semibold text-foreground">{h.name}</td>
                  <td className="p-3.5 text-muted-foreground">{h.date}</td>
                  <td className="p-3.5 text-foreground font-medium">{h.time}</td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] bg-secondary border border-border font-semibold text-foreground">
                      {h.method === "Scan QR" && (
                        <Scan className="w-3.5 h-3.5 text-emerald-500" />
                      )}
                      {h.method === "Geolocalización GPS" && (
                        <Navigation className="w-3.5 h-3.5 text-blue-500" />
                      )}
                      {h.method === "Recepción" && (
                        <DoorOpen className="w-3.5 h-3.5 text-amber-500" />
                      )}
                      {h.method}
                    </span>
                  </td>
                  <td className="p-3.5 text-muted-foreground text-[11px]">{h.distance}</td>
                  <td className="p-3.5 text-foreground font-medium">{h.class}</td>
                  <td className="p-3.5 text-right">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        h.status === "Presente"
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                          : "bg-destructive/10 text-destructive border-destructive/30"
                      }`}
                    >
                      {h.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
