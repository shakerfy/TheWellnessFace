import React, { useState } from "react";
import { ChevronLeft, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { UserProfileData } from "./types";
import { GOAL_OPTIONS } from "./constants";

interface EditProfileViewProps {
  photo: string;
  profile: UserProfileData;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onSave: (updatedProfile: UserProfileData) => void;
  onBack: () => void;
}

export function EditProfileView({
  photo,
  profile,
  fileInputRef,
  onSave,
  onBack,
}: EditProfileViewProps) {
  const [formData, setFormData] = useState<UserProfileData>(profile);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-16 animate-fade-in">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" /> Volver a Ajustes
      </button>

      <div>
        <h2 className="text-2xl font-bold tracking-tight">Editar Perfil</h2>
        <p className="text-sm text-muted-foreground">
          Configura tus datos de contacto, biometría y objetivo principal.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 border border-border bg-card shadow-xs rounded-3xl p-6 sm:p-8"
      >
        {/* Avatar Header with Change Photo */}
        <div className="flex items-center gap-4 pb-4 border-b border-border/40">
          <div className="relative group">
            <img
              src={photo}
              alt="Perfil"
              className="h-16 w-16 rounded-full object-cover border border-border shadow-xs"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-1 rounded-full bg-background border border-border shadow-xs text-foreground hover:scale-105 transition cursor-pointer"
              title="Cambiar foto"
            >
              <Pencil className="w-3 h-3" />
            </button>
          </div>
          <div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl text-xs font-semibold cursor-pointer"
            >
              Cambiar foto
            </Button>
            <p className="text-[11px] text-muted-foreground mt-1">JPG, PNG o WEBP. Máx 5MB.</p>
          </div>
        </div>

        {/* Nombre & Teléfono */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Nombre Completo</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))}
              className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Teléfono</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
              placeholder="+54 9 11 4982-9011"
              className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Email & Ubicación */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
              placeholder="agustin.gomez@shakerfy.com"
              className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Dirección / Gimnasio Base
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
              placeholder="Palermo, Buenos Aires"
              className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Sexo & Fecha de Nacimiento */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Sexo / Género</label>
            <Select
              value={formData.sex}
              onValueChange={(val: any) => setFormData((p) => ({ ...p, sex: val }))}
            >
              <SelectTrigger className="w-full rounded-xl">
                <SelectValue placeholder="Selecciona sexo" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="masculino">Masculino</SelectItem>
                <SelectItem value="femenino">Femenino</SelectItem>
                <SelectItem value="otro">Otro / Prefiero no decir</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              value={formData.birthDate}
              onChange={(e) => setFormData((p) => ({ ...p, birthDate: e.target.value }))}
              className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Sistema de Unidades */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">
            Sistema de Unidades
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setFormData((p) => ({ ...p, units: "metrico" }))}
              className={cn(
                "h-10 rounded-xl border text-xs font-semibold transition cursor-pointer flex items-center justify-center",
                formData.units === "metrico"
                  ? "border-foreground bg-accent text-foreground font-bold"
                  : "border-border/60 hover:border-border text-muted-foreground",
              )}
            >
              Métrico (kg, cm)
            </button>
            <button
              type="button"
              onClick={() => setFormData((p) => ({ ...p, units: "imperial" }))}
              className={cn(
                "h-10 rounded-xl border text-xs font-semibold transition cursor-pointer flex items-center justify-center",
                formData.units === "imperial"
                  ? "border-foreground bg-accent text-foreground font-bold"
                  : "border-border/60 hover:border-border text-muted-foreground",
              )}
            >
              Imperial (lbs, in)
            </button>
          </div>
        </div>

        {/* Altura & Peso */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Altura ({formData.units === "metrico" ? "cm" : "pulgadas"})
            </label>
            <input
              type="number"
              value={formData.height}
              onChange={(e) => setFormData((p) => ({ ...p, height: e.target.value }))}
              placeholder={formData.units === "metrico" ? "175" : "69"}
              className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Peso ({formData.units === "metrico" ? "kg" : "lbs"})
            </label>
            <input
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData((p) => ({ ...p, weight: e.target.value }))}
              placeholder={formData.units === "metrico" ? "70" : "154"}
              className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Objetivo Principal */}
        <div className="space-y-2 pt-2 border-t border-border/40">
          <label className="text-xs font-semibold text-foreground block">
            Objetivo Principal
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {GOAL_OPTIONS.map((item) => {
              const IconComp = item.icon;
              const isSelected = formData.goal === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setFormData((p) => ({ ...p, goal: item.id as any }))}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-medium transition cursor-pointer text-center space-y-1.5",
                    isSelected
                      ? "border-foreground bg-accent text-foreground font-bold shadow-xs"
                      : "border-border/60 hover:border-border text-muted-foreground",
                  )}
                >
                  <IconComp
                    className={cn("w-4 h-4", isSelected ? item.color : "text-muted-foreground")}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-4 flex items-center gap-3">
          <Button
            type="submit"
            size="default"
            className="rounded-xl font-bold flex-1 sm:flex-initial cursor-pointer"
          >
            Guardar Cambios de Perfil
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
