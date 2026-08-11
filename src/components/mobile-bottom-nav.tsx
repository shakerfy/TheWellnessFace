import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { Home, QrCode, Sparkles, Heart, User, Settings, CreditCard, BarChart3, LogOut, ChevronRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";

export function MobileBottomNav() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>("inicio");
  const [pathname, setPathname] = useState<string>("/");
  const navigate = useNavigate();

  useEffect(() => {
    const updateLocationInfo = () => {
      if (typeof window !== "undefined") {
        setPathname(window.location.pathname);
        const tab = new URLSearchParams(window.location.search).get("tab");
        if (tab) {
          setCurrentTab(tab);
        } else if (window.location.pathname === "/") {
          setCurrentTab("landing");
        } else if (window.location.pathname === "/app") {
          setCurrentTab("inicio");
        }
      }
    };

    updateLocationInfo();
    window.addEventListener("popstate", updateLocationInfo);
    const interval = setInterval(updateLocationInfo, 250);
    return () => {
      window.removeEventListener("popstate", updateLocationInfo);
      clearInterval(interval);
    };
  }, []);

  // Hide mobile bottom nav on gym admin dashboard
  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  const isInicioActive = pathname === "/" || (pathname === "/app" && (currentTab === "inicio" || !currentTab));
  const isCheckInActive = pathname === "/app" && currentTab === "clases";
  const isAiCoachActive = pathname === "/app" && currentTab === "diario";
  const isFavoritosActive = pathname === "/app" && currentTab === "favoritos";
  const isPerfilActive = pathname === "/app" && ["config", "pagos", "progreso"].includes(currentTab);

  const handleNavClick = (tabId: string) => {
    setSheetOpen(false);
    if (tabId === "landing") {
      navigate({ to: "/" });
    } else {
      navigate({ to: "/app", search: { tab: tabId } });
    }
  };

  return (
    <nav className="flex md:hidden fixed bottom-0 left-0 right-0 border-t border-border/60 bg-background/80 backdrop-blur-xl px-1.5 py-1.5 justify-around items-center z-50 shadow-2xl">
      {/* 1. Inicio */}
      <button
        onClick={() => handleNavClick(pathname === "/" ? "landing" : "inicio")}
        className={`flex flex-col items-center gap-1 flex-1 py-1 rounded-2xl transition-all duration-200 ${
          isInicioActive
            ? "text-black dark:text-white font-bold scale-105"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Home className={`h-5 w-5 ${isInicioActive ? "stroke-[2.5px] text-black dark:text-white" : "stroke-[1.8px]"}`} />
        <span className="text-[10px] font-medium tracking-tight">Inicio</span>
      </button>

      {/* 2. Check-in */}
      <button
        onClick={() => handleNavClick("clases")}
        className={`flex flex-col items-center gap-1 flex-1 py-1 rounded-2xl transition-all duration-200 ${
          isCheckInActive
            ? "text-black dark:text-white font-bold scale-105"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <QrCode className={`h-5 w-5 ${isCheckInActive ? "stroke-[2.5px] text-black dark:text-white" : "stroke-[1.8px]"}`} />
        <span className="text-[10px] font-medium tracking-tight">Check-in</span>
      </button>

      {/* 3. AI Coach */}
      <button
        onClick={() => handleNavClick("diario")}
        className={`flex flex-col items-center gap-1 flex-1 py-1 rounded-2xl transition-all duration-200 ${
          isAiCoachActive
            ? "text-black dark:text-white font-bold scale-105"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Sparkles className={`h-5 w-5 ${isAiCoachActive ? "stroke-[2.5px] text-black dark:text-white" : "stroke-[1.8px]"}`} />
        <span className="text-[10px] font-medium tracking-tight">AI Coach</span>
      </button>

      {/* 4. Favoritos */}
      <button
        onClick={() => handleNavClick("favoritos")}
        className={`flex flex-col items-center gap-1 flex-1 py-1 rounded-2xl transition-all duration-200 ${
          isFavoritosActive
            ? "text-black dark:text-white font-bold scale-105"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Heart className={`h-5 w-5 ${isFavoritosActive ? "stroke-[2.5px] fill-black dark:fill-white text-black dark:text-white" : "stroke-[1.8px]"}`} />
        <span className="text-[10px] font-medium tracking-tight">Favoritos</span>
      </button>

      {/* 5. Perfil (con Sheet para Configuración y Suscripción) */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <button
            className={`flex flex-col items-center gap-1 flex-1 py-1 rounded-2xl transition-all duration-200 ${
              isPerfilActive
                ? "text-black dark:text-white font-bold scale-105"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <User className={`h-5 w-5 ${isPerfilActive ? "stroke-[2.5px] text-black dark:text-white" : "stroke-[1.8px]"}`} />
            <span className="text-[10px] font-medium tracking-tight">Perfil</span>
          </button>
        </SheetTrigger>

        <SheetContent side="bottom" className="rounded-t-3xl border-t border-border bg-card p-6 shadow-2xl">
          <SheetHeader className="text-left pb-4 border-b border-border/60">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-emerald-500 text-white font-bold text-base flex items-center justify-center shadow-md">
                A
              </div>
              <div className="flex flex-col">
                <SheetTitle className="text-base font-bold text-foreground">Agustín Gómez</SheetTitle>
                <p className="text-xs text-muted-foreground">agustin.gomez@email.com</p>
              </div>
            </div>
          </SheetHeader>

          <div className="py-4 space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
              Mi Perfil & Ajustes
            </div>

            <div className="grid gap-2">
              {/* Tema Visual (Claro / Oscuro Rimu) */}
              <div className="flex items-center justify-between w-full p-3.5 rounded-2xl border border-border/60 bg-background/50">
                <div>
                  <div className="text-xs font-semibold text-foreground">Tema & Apariencia</div>
                  <div className="text-[11px] text-muted-foreground">Claro, Oscuro (Rimu) o Sistema</div>
                </div>
                <ThemeToggle variant="outline" size="sm" showLabel />
              </div>

              {/* Configuración */}
              <button
                onClick={() => handleNavClick("config")}
                className="flex items-center justify-between w-full p-3.5 rounded-2xl border border-border/60 bg-background/50 hover:bg-secondary/60 transition duration-200 text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-secondary text-foreground group-hover:scale-105 transition-transform">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-foreground">Configuración</div>
                    <div className="text-[11px] text-muted-foreground">Preferencias y datos personales</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>

              {/* Suscripción */}
              <button
                onClick={() => handleNavClick("pagos")}
                className="flex items-center justify-between w-full p-3.5 rounded-2xl border border-border/60 bg-background/50 hover:bg-secondary/60 transition duration-200 text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-foreground">Suscripción</div>
                    <div className="text-[11px] text-muted-foreground">Planes, pagos y membresías</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>

              {/* Mi Progreso */}
              <button
                onClick={() => handleNavClick("progreso")}
                className="flex items-center justify-between w-full p-3.5 rounded-2xl border border-border/60 bg-background/50 hover:bg-secondary/60 transition duration-200 text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
                    <BarChart3 className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-foreground">Mi Progreso</div>
                    <div className="text-[11px] text-muted-foreground">Métricas, asistencia y estadísticas</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <div className="pt-2 border-t border-border/60">
              <button
                onClick={() => {
                  setSheetOpen(false);
                  navigate({ to: "/" });
                }}
                className="flex items-center gap-3 w-full p-3 rounded-2xl text-rose-500 hover:bg-rose-500/10 transition text-xs font-semibold"
              >
                <LogOut className="h-4 w-4" />
                <span>Cerrar sesión</span>
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
