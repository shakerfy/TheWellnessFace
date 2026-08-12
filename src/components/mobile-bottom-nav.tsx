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

      {/* 5. Perfil & Configuración */}
      <button
        onClick={() => handleNavClick("config")}
        className={`flex flex-col items-center gap-1 flex-1 py-1 rounded-2xl transition-all duration-200 ${
          isPerfilActive
            ? "text-black dark:text-white font-bold scale-105"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <User className={`h-5 w-5 ${isPerfilActive ? "stroke-[2.5px] text-black dark:text-white" : "stroke-[1.8px]"}`} />
        <span className="text-[10px] font-medium tracking-tight">Perfil</span>
      </button>
    </nav>
  );
}
