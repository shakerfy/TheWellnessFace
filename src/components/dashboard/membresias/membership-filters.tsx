import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PERIODICITY_OPTIONS, TAG_OPTIONS } from "./constants";

interface MembershipFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  tagFilter: string;
  onTagFilterChange: (value: string) => void;
  periodicityFilter: string;
  onPeriodicityFilterChange: (value: string) => void;
  onResetFilters: () => void;
}

export function MembershipFilters({
  searchQuery,
  onSearchChange,
  tagFilter,
  onTagFilterChange,
  periodicityFilter,
  onPeriodicityFilterChange,
  onResetFilters,
}: MembershipFiltersProps) {
  const hasActiveFilters =
    searchQuery.trim() !== "" || tagFilter !== "all" || periodicityFilter !== "all";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-secondary/20 border border-border/50 rounded-2xl">
      <div className="relative flex-1 min-w-[200px] sm:max-w-xs">
        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar por nombre o actividad..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-9 w-full pl-8 pr-3 rounded-xl border border-border bg-background text-xs font-bold text-foreground placeholder:font-normal placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        <Select value={tagFilter} onValueChange={onTagFilterChange}>
          <SelectTrigger className="w-full sm:w-[170px] h-9 rounded-xl border border-border bg-background text-xs font-bold text-foreground">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border border-border bg-popover text-popover-foreground">
            <SelectItem value="all">Todas las Categorías</SelectItem>
            <SelectItem value="featured">Plan Destacado</SelectItem>
            {TAG_OPTIONS.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={periodicityFilter} onValueChange={onPeriodicityFilterChange}>
          <SelectTrigger className="w-full sm:w-[160px] h-9 rounded-xl border border-border bg-background text-xs font-bold text-foreground">
            <SelectValue placeholder="Periodicidad" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border border-border bg-popover text-popover-foreground">
            <SelectItem value="all">Todas las Duraciones</SelectItem>
            {PERIODICITY_OPTIONS.map((period) => (
              <SelectItem key={period} value={period}>
                {period}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="h-9 text-[11px] font-bold text-muted-foreground hover:text-rose-600 rounded-xl"
          >
            Limpiar Filtros
          </Button>
        )}
      </div>
    </div>
  );
}
