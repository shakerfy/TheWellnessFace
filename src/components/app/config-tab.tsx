import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  User,
  CreditCard,
  Settings,
  LogOut,
  ChevronRight,
  Shield,
  MessageSquare,
  Camera,
  Brain,
  Sliders,
  FileText,
} from "lucide-react";
import { AdvancedSettingsView } from "@/components/advanced-settings-view";
import {
  AiMemoryItem,
  UserProfileData,
  AppSettingsData,
  ConfigSubView,
  DEFAULT_AI_MEMORIES,
  DEFAULT_USER_PROFILE,
  DEFAULT_APP_SETTINGS,
  EditProfileView,
  AiMemoryView,
  AppSettingsView,
  ConfigLegalModals,
} from "./config";

export type { AiMemoryItem, UserProfileData, AppSettingsData, ConfigSubView };
export * from "./config";

export function ConfigTab() {
  const navigate = useNavigate();
  const [subView, setSubView] = useState<ConfigSubView>("main");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile Form States
  const [photo, setPhoto] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("shakerfy_user_photo");
      if (saved) return saved;
    }
    return "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";
  });

  const [profile, setProfile] = useState<UserProfileData>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("shakerfy_user_profile_edit");
      if (saved) {
        try {
          return { ...DEFAULT_USER_PROFILE, ...JSON.parse(saved) };
        } catch (_) {}
      }
    }
    return DEFAULT_USER_PROFILE;
  });

  // AI Memory State
  const [aiMemories, setAiMemories] = useState<AiMemoryItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("shakerfy_ai_memory");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (_) {}
    }
    return DEFAULT_AI_MEMORIES;
  });

  // App Settings State
  const [appSettings, setAppSettings] = useState<AppSettingsData>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("shakerfy_app_settings");
        if (stored) {
          return { ...DEFAULT_APP_SETTINGS, ...JSON.parse(stored) };
        }
      } catch (_) {}
    }
    return DEFAULT_APP_SETTINGS;
  });

  // Legal & Info Modals
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);

  useEffect(() => {
    const handleOpenSettingsEvent = () => setSubView("main");
    window.addEventListener("shakerfy:open-settings", handleOpenSettingsEvent);
    return () => {
      window.removeEventListener("shakerfy:open-settings", handleOpenSettingsEvent);
    };
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen debe pesar menos de 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setPhoto(base64);
        if (typeof window !== "undefined") {
          localStorage.setItem("shakerfy_user_photo", base64);
          window.dispatchEvent(new CustomEvent("shakerfy:photo-updated", { detail: base64 }));
        }
        toast.success("Foto de perfil actualizada");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (updatedProfile: UserProfileData) => {
    setProfile(updatedProfile);
    if (typeof window !== "undefined") {
      localStorage.setItem("shakerfy_user_profile_edit", JSON.stringify(updatedProfile));
      localStorage.setItem("shakerfy_user_photo", photo);
      window.dispatchEvent(new CustomEvent("shakerfy:profile-updated", { detail: updatedProfile }));
    }
    toast.success("Perfil guardado correctamente");
    setSubView("main");
  };

  const handleAddMemory = (text: string) => {
    if (!text.trim()) return;
    const lower = text.toLowerCase();
    let domain: AiMemoryItem["domain"] = "nutricion";
    let cat: AiMemoryItem["category"] = "general";

    if (
      /entreno|workout|fuerza|mancuerna|ejercicio|serie|repetic|sentadilla|press|hiit|cardio|músculo|rodilla|hombro|lumbar|articular/i.test(
        lower,
      )
    ) {
      domain = "entrenamiento";
      if (/ligero|pesado|extenuante|intensidad|carga|rpe|fallo/i.test(lower)) cat = "intensidad";
      else if (
        /rodilla|hombro|espalda|dolor|cuidado|molestia|articular|impacto|silencioso/i.test(lower)
      )
        cat = "cuidado";
      else cat = "ejercicio";
    } else {
      domain = "nutricion";
      if (/pollo|tofu|huevo|atún|salmón|proteína|carne|pavo|pescado/i.test(lower)) cat = "proteina";
      else if (/pan|avena|quinoa|arroz|papa|batata|carbo|masa madre|centeno/i.test(lower))
        cat = "carbo";
      else if (/palta|aguacate|aceite|nuez|semilla|chía|grasa|maní|almendra/i.test(lower))
        cat = "grasa";
      else if (/café|té|infusión|agua|leche|desayuno|cena|merienda|hábito|snack/i.test(lower))
        cat = "habito";
    }

    const newMem: AiMemoryItem = {
      id: `mem-${Date.now()}`,
      text: text.trim(),
      domain,
      category: cat,
      createdAt: new Date().toISOString(),
    };

    setAiMemories((prev) => {
      const updated = [newMem, ...prev];
      if (typeof window !== "undefined") {
        localStorage.setItem("shakerfy_ai_memory", JSON.stringify(updated));
      }
      return updated;
    });
    toast.success("Preferencia guardada en la memoria de la IA");
  };

  const handleDeleteMemory = (id: string) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(15);
      } catch (_) {}
    }
    setAiMemories((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      if (typeof window !== "undefined") {
        localStorage.setItem("shakerfy_ai_memory", JSON.stringify(updated));
      }
      return updated;
    });
    toast.info("Preferencia eliminada de la memoria");
  };

  const handleClearAllMemories = () => {
    setAiMemories([]);
    if (typeof window !== "undefined") {
      localStorage.setItem("shakerfy_ai_memory", JSON.stringify([]));
    }
    toast.info("Memoria de la IA restablecida");
  };

  const handleSaveAppSettings = (newSettings: AppSettingsData) => {
    setAppSettings(newSettings);
    if (typeof window !== "undefined") {
      localStorage.setItem("shakerfy_app_settings", JSON.stringify(newSettings));
    }
    toast.success("Configuración de la aplicación guardada");
    setSubView("main");
  };

  const handleLogout = () => {
    setLogoutModalOpen(false);
    toast.success("Sesión cerrada correctamente");
    navigate({ to: "/" });
  };

  const handleDeleteAccountConfirm = () => {
    setDeleteAccountModalOpen(false);
    toast.success("Tu cuenta ha sido eliminada correctamente");
    navigate({ to: "/" });
  };

  // Sub-screens routing
  if (subView === "edit-profile") {
    return (
      <EditProfileView
        photo={photo}
        profile={profile}
        fileInputRef={fileInputRef}
        onSave={handleSaveProfile}
        onBack={() => setSubView("main")}
      />
    );
  }

  if (subView === "ai-memory") {
    return (
      <AiMemoryView
        aiMemories={aiMemories}
        onAddMemory={handleAddMemory}
        onDeleteMemory={handleDeleteMemory}
        onClearAll={handleClearAllMemories}
        onBack={() => setSubView("main")}
      />
    );
  }

  if (subView === "app-settings") {
    return (
      <AppSettingsView
        settings={appSettings}
        onSave={handleSaveAppSettings}
        onDeleteAccount={() => setDeleteAccountModalOpen(true)}
        onBack={() => setSubView("main")}
      />
    );
  }

  if (subView === "advanced-settings") {
    return <AdvancedSettingsView onBack={() => setSubView("main")} />;
  }

  // Main Screen
  return (
    <div className="space-y-6 max-w-lg mx-auto px-1 sm:px-2 pb-28 pt-2 animate-fade-in relative text-left">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        accept="image/*"
        className="hidden"
      />

      {/* 1. Encabezado de perfil */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3.5">
          <div
            className="relative group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            title="Cambiar foto de perfil"
          >
            <img
              src={photo}
              alt={profile.fullName}
              className="w-14 h-14 rounded-full object-cover border-2 border-border shadow-md group-hover:opacity-90 transition"
            />
            <div className="absolute bottom-0 right-0 p-1 rounded-full bg-foreground text-background shadow-xs">
              <Camera className="w-2.5 h-2.5" />
            </div>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-foreground truncate max-w-[240px]">
              {profile.fullName}
            </h1>
            <p className="text-xs text-muted-foreground font-medium truncate max-w-[240px]">
              {profile.email}
            </p>
          </div>
        </div>
      </div>

      {/* Grupo 1: Opciones de Cuenta */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 px-1">
          Opciones de Cuenta
        </div>
        <div className="rounded-3xl border border-border bg-card shadow-xs overflow-hidden divide-y divide-border/40">
          {/* Datos Biológicos */}
          <button
            type="button"
            onClick={() => setSubView("edit-profile")}
            className="w-full flex items-center justify-between p-4 hover:bg-secondary/40 transition-all cursor-pointer text-left group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                  Datos Biológicos & Perfil
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Edad, sexo, altura, peso y objetivo.
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-foreground group-hover:translate-x-0.5 transition shrink-0" />
          </button>

          {/* Memoria de la IA */}
          <button
            type="button"
            onClick={() => setSubView("ai-memory")}
            className="w-full flex items-center justify-between p-4 hover:bg-secondary/40 transition-all cursor-pointer text-left group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-foreground group-hover:text-emerald-500 transition-colors">
                  Memoria de la IA & Gustos Aprendidos
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Preferencias y patrones que la IA recuerda sobre ti.
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-foreground group-hover:translate-x-0.5 transition shrink-0" />
          </button>

          {/* Ajustes de la App */}
          <button
            type="button"
            onClick={() => setSubView("app-settings")}
            className="w-full flex items-center justify-between p-4 hover:bg-secondary/40 transition-all cursor-pointer text-left group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-foreground group-hover:text-sky-500 transition-colors">
                  Ajustes de la Aplicación
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Tema visual, idioma y notificaciones.
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-foreground group-hover:translate-x-0.5 transition shrink-0" />
          </button>

          {/* Ajustes Avanzados */}
          <button
            type="button"
            onClick={() => setSubView("advanced-settings")}
            className="w-full flex items-center justify-between p-4 hover:bg-secondary/40 transition-all cursor-pointer text-left group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  Ajustes Avanzados
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Modo nutrición y metas de nutrientes.
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-foreground group-hover:translate-x-0.5 transition shrink-0" />
          </button>

          {/* Membresía & Pagos */}
          <button
            type="button"
            onClick={() => navigate({ to: "/app", search: { tab: "pagos" } })}
            className="w-full flex items-center justify-between p-4 hover:bg-secondary/40 transition-all cursor-pointer text-left group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-foreground group-hover:text-amber-500 transition-colors">
                  Membresía & Pagos
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Pase mensual, comprobantes y facturación.
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-foreground group-hover:translate-x-0.5 transition shrink-0" />
          </button>
        </div>
      </div>

      {/* Grupo 2: Información & Legal */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 px-1">
          Información & Legal
        </div>
        <div className="rounded-3xl border border-border bg-card shadow-xs overflow-hidden divide-y divide-border/40">
          {/* Políticas de Privacidad */}
          <button
            type="button"
            onClick={() => setPrivacyModalOpen(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-secondary/40 transition-all cursor-pointer text-left group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-foreground group-hover:text-purple-500 transition-colors">
                Políticas de Privacidad
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-foreground group-hover:translate-x-0.5 transition shrink-0" />
          </button>

          {/* Términos y Condiciones */}
          <button
            type="button"
            onClick={() => setTermsModalOpen(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-secondary/40 transition-all cursor-pointer text-left group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-foreground group-hover:text-amber-500 transition-colors">
                Términos y Condiciones
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-foreground group-hover:translate-x-0.5 transition shrink-0" />
          </button>

          {/* Contactar con Shakerfy */}
          <button
            type="button"
            onClick={() => setContactModalOpen(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-secondary/40 transition-all cursor-pointer text-left group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-500 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-foreground group-hover:text-teal-500 transition-colors">
                Contactar con Shakerfy
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-foreground group-hover:translate-x-0.5 transition shrink-0" />
          </button>

          {/* Cerrar Sesión */}
          <button
            type="button"
            onClick={() => setLogoutModalOpen(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-rose-500/10 transition-all cursor-pointer text-left group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/15 text-rose-500 flex items-center justify-center shrink-0">
                <LogOut className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-rose-600 dark:text-rose-400">
                Cerrar sesión
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-rose-400 group-hover:translate-x-0.5 transition shrink-0" />
          </button>
        </div>
      </div>

      {/* Modales Legales y de Confirmación */}
      <ConfigLegalModals
        privacyModalOpen={privacyModalOpen}
        setPrivacyModalOpen={setPrivacyModalOpen}
        termsModalOpen={termsModalOpen}
        setTermsModalOpen={setTermsModalOpen}
        contactModalOpen={contactModalOpen}
        setContactModalOpen={setContactModalOpen}
        logoutModalOpen={logoutModalOpen}
        setLogoutModalOpen={setLogoutModalOpen}
        deleteAccountModalOpen={deleteAccountModalOpen}
        setDeleteAccountModalOpen={setDeleteAccountModalOpen}
        onLogout={handleLogout}
        onDeleteAccountConfirm={handleDeleteAccountConfirm}
      />
    </div>
  );
}
