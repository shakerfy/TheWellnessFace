import React, { useState } from "react";
import { ChevronLeft, Moon, Smartphone, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { AppSettingsData } from "./types";

interface AppSettingsViewProps {
  settings: AppSettingsData;
  onSave: (settings: AppSettingsData) => void;
  onDeleteAccount: () => void;
  onBack: () => void;
}

export function AppSettingsView({
  settings,
  onSave,
  onDeleteAccount,
  onBack,
}: AppSettingsViewProps) {
  const [formData, setFormData] = useState<AppSettingsData>(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="space-y-6 max-w-2xl pb-12 animate-fade-in">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" /> Volver a Ajustes
      </button>

      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configuración de la Aplicación</h2>
        <p className="text-sm text-muted-foreground">
          Personaliza el tema visual, idioma y tus notificaciones de recordatorios.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 border border-border bg-card shadow-xs rounded-3xl p-6 sm:p-8"
      >
        {/* Tema visual */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-foreground block">Tema de Interfaz</label>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => setFormData((p) => ({ ...p, theme: "light" }))}
              className={cn(
                "flex flex-col items-center justify-center p-3.5 rounded-2xl border text-xs font-medium transition-all cursor-pointer space-y-1.5",
                formData.theme === "light"
                  ? "border-foreground bg-accent text-foreground font-bold shadow-xs"
                  : "border-border/60 hover:border-border text-muted-foreground",
              )}
            >
              <Sun className="w-4 h-4" />
              <span>Claro</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData((p) => ({ ...p, theme: "dark" }))}
              className={cn(
                "flex flex-col items-center justify-center p-3.5 rounded-2xl border text-xs font-medium transition-all cursor-pointer space-y-1.5",
                formData.theme === "dark"
                  ? "border-foreground bg-accent text-foreground font-bold shadow-xs"
                  : "border-border/60 hover:border-border text-muted-foreground",
              )}
            >
              <Moon className="w-4 h-4" />
              <span>Oscuro</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData((p) => ({ ...p, theme: "system" }))}
              className={cn(
                "flex flex-col items-center justify-center p-3.5 rounded-2xl border text-xs font-medium transition-all cursor-pointer space-y-1.5",
                formData.theme === "system"
                  ? "border-foreground bg-accent text-foreground font-bold shadow-xs"
                  : "border-border/60 hover:border-border text-muted-foreground",
              )}
            >
              <Smartphone className="w-4 h-4" />
              <span>Sistema</span>
            </button>
          </div>
        </div>

        {/* Idioma */}
        <div className="space-y-1.5 pt-2 border-t border-border/40">
          <label className="text-xs font-semibold text-foreground block">
            Idioma de Preferencia
          </label>
          <Select
            value={formData.language}
            onValueChange={(val) => setFormData((p) => ({ ...p, language: val }))}
          >
            <SelectTrigger className="w-full rounded-xl h-11">
              <SelectValue placeholder="Selecciona idioma" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="es">Español (Latinoamérica)</SelectItem>
              <SelectItem value="en">English (US)</SelectItem>
              <SelectItem value="pt">Português (Brasil)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Switch Recordatorios */}
        <div className="space-y-2 pt-2 border-t border-border/40">
          <label className="text-xs font-semibold text-foreground block">Notificaciones</label>
          <div className="flex items-center justify-between p-4 rounded-2xl border border-border/60 bg-muted/20">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-foreground">Recordatorios</div>
              <div className="text-[11px] text-muted-foreground">
                Alertas y avisos de tus clases, reservas e hidratación.
              </div>
            </div>
            <Switch
              checked={formData.reminders}
              onCheckedChange={(val) => setFormData((p) => ({ ...p, reminders: val }))}
            />
          </div>
        </div>

        {/* Zona de Peligro: Eliminar Cuenta */}
        <div className="space-y-2 pt-4 border-t border-rose-500/20">
          <label className="text-[11px] font-bold text-rose-500 block uppercase tracking-wider">
            Zona de Peligro
          </label>
          <div className="p-4 rounded-2xl border border-rose-500/30 bg-rose-500/5 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-rose-600 dark:text-rose-400">
                Eliminar cuenta permanentemente
              </div>
              <div className="text-[11px] text-muted-foreground">
                Borrará definitivamente tus datos biológicos, historial y créditos.
              </div>
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={onDeleteAccount}
              className="rounded-xl font-bold text-xs shrink-0"
            >
              Eliminar cuenta
            </Button>
          </div>
        </div>

        <div className="pt-4 flex items-center gap-3">
          <Button
            type="submit"
            size="default"
            className="rounded-xl font-bold flex-1 sm:flex-initial"
          >
            Guardar Configuración
          </Button>
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={onBack}
            className="rounded-xl font-semibold cursor-pointer"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
