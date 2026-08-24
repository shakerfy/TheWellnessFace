import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, ReferenceLine } from "recharts";
import {
  User,
  Sparkles,
  Calendar,
  QrCode,
  BarChart3,
  CreditCard,
  Settings,
  LogOut,
  ChevronDown,
  Flame,
} from "lucide-react";

const STREAK_ACTIVITY_DATA = [
  { day: "Lun", puntos: 180 },
  { day: "Mar", puntos: 160 },
  { day: "Mié", puntos: 175 },
  { day: "Jue", puntos: 140 },
  { day: "Vie", puntos: 155 },
  { day: "Sáb", puntos: 190 },
  { day: "Dom", puntos: 168 },
];

const STREAK_CHART_CONFIG = {
  puntos: {
    label: "Puntos de Actividad",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function SiteHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [userPhoto, setUserPhoto] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("shakerfy_user_photo") ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
      );
    }
    return "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";
  });
  const [userName, setUserName] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("shakerfy_user_profile_edit");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.fullName) return parsed.fullName.split(" ")[0];
        } catch (e) {}
      }
    }
    return "Agustín";
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handlePhotoUpdate = (e: any) => {
      if (e.detail) setUserPhoto(e.detail);
    };
    const handleProfileUpdate = (e: any) => {
      if (e.detail?.fullName) setUserName(e.detail.fullName.split(" ")[0]);
    };
    window.addEventListener("shakerfy:photo-updated", handlePhotoUpdate);
    window.addEventListener("shakerfy:profile-updated", handleProfileUpdate);
    return () => {
      window.removeEventListener("shakerfy:photo-updated", handlePhotoUpdate);
      window.removeEventListener("shakerfy:profile-updated", handleProfileUpdate);
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsMenuOpen(false);
    }, 150);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 relative">
        {/* Left: User Profile Photo avatar on mobile, Nav links on desktop */}
        <div className="flex items-center flex-1 justify-start gap-3">
          {isLoggedIn && (
            <button
              type="button"
              onClick={() => navigate({ to: "/app", search: { tab: "config" } })}
              className="md:hidden w-8 h-8 rounded-full border border-border/80 overflow-hidden bg-secondary shrink-0 shadow-2xs select-none cursor-pointer active:scale-95 transition-transform"
              title="Ver mi perfil"
            >
              <img src={userPhoto} alt="Foto de Perfil" className="w-full h-full object-cover" />
            </button>
          )}
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="/#como-funciona" className="transition hover:text-foreground">
              Cómo funciona
            </a>
            <Link to="/blog" className="transition hover:text-foreground">
              Blog
            </Link>
            <a href="/#para-gimnasios" className="transition hover:text-foreground">
              Partners
            </a>
          </nav>
        </div>

        {/* Center: Logo (Bebas Neue) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <Link
            to="/"
            onClick={() => window.scrollTo(0, 0)}
            className="text-2xl sm:text-3xl font-bebas tracking-wider text-foreground uppercase select-none"
          >
            The wellness face
          </Link>
        </div>

        {/* Right: Actions (Racha de Actividad, Botón Configuración & Desktop Profile Menu) */}
        <div className="flex items-center flex-1 justify-end gap-2">
          {isLoggedIn ? (
            <>
              {/* Badge Racha de Actividad */}
              <button
                type="button"
                onClick={() => setIsStreakModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-black text-xs cursor-pointer transition-all active:scale-95 shadow-2xs select-none"
                title="Ver Racha de Actividad"
              >
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
                <span className="font-extrabold tracking-tight">12 Días</span>
              </button>

              {/* Botón de Configuración (Settings) al lado del badge de racha */}
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("shakerfy:open-settings"));
                  }
                  navigate({ to: "/app", search: { tab: "config" } });
                }}
                className="w-8 h-8 rounded-full border border-border/80 bg-card hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition cursor-pointer active:scale-95 shadow-2xs"
                title="Ajustes & Configuración"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* Desktop Only User Profile Dropdown Menu */}
              <div
                className="hidden md:inline-block relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen} modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 rounded-full pl-1.5 pr-2.5 py-1 hover:bg-secondary border border-border/50"
                    >
                      {/* User Profile Photo */}
                      <div className="w-7 h-7 rounded-full overflow-hidden bg-secondary shrink-0 shadow-2xs border border-white/50">
                        <img
                          src={userPhoto}
                          alt="Foto de Perfil"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs font-bold text-foreground hidden sm:inline-block">
                        {userName}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    className="w-56"
                    align="end"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-xs font-bold text-foreground leading-none">
                          Agustín Gómez
                        </p>
                        <p className="text-[11px] text-muted-foreground leading-none truncate">
                          agustin.gomez@email.com
                        </p>
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link to="/app" search={{ tab: "inicio" }}>
                          <User className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>Inicio</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link to="/app" search={{ tab: "diario" }}>
                          <Sparkles className="mr-2 h-4 w-4 text-indigo-500" />
                          <span>AI Coach</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link to="/app" search={{ tab: "clases" }}>
                          <QrCode className="mr-2 h-4 w-4 text-emerald-500" />
                          <span>Check-in</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link to="/app" search={{ tab: "progreso" }}>
                          <BarChart3 className="mr-2 h-4 w-4 text-amber-500" />
                          <span>Mi Progreso</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link to="/app" search={{ tab: "pagos" }}>
                          <CreditCard className="mr-2 h-4 w-4 text-sky-500" />
                          <span>Membresías & Pagos</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to="/app" search={{ tab: "config" }}>
                        <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Configuración</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      className="cursor-pointer text-destructive focus:text-destructive"
                      onClick={() => navigate({ to: "/" })}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Cerrar sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "hidden sm:inline-flex",
                )}
              >
                Iniciar sesión
              </Link>
              <Link to="/auth" className={cn(buttonVariants({ size: "sm" }), "rounded-full px-4")}>
                Empezar
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Modal: Racha de Actividad */}
      <Dialog open={isStreakModalOpen} onOpenChange={setIsStreakModalOpen}>
        <DialogContent className="sm:max-w-md bg-card text-card-foreground border border-border p-6 rounded-3xl shadow-2xl">
          <DialogHeader className="pb-3 border-b border-border/40 flex flex-row items-center justify-between space-y-0">
            <div>
              <span className="text-[10px] text-muted-foreground/80 font-bold uppercase tracking-wider block mb-0.5">
                Hábitos & Movimiento
              </span>
              <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <span>Racha de Actividad</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  12 días
                </span>
              </DialogTitle>
            </div>
            <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold border border-emerald-500/20">
              BASE: 150 PTOS
            </span>
          </DialogHeader>

          <div className="pt-3 space-y-4">
            <div className="flex justify-between items-center text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground px-0.5">
              <span>Curva de Actividad (7 días)</span>
              <span className="text-emerald-500 font-bold">Mínimo Saludable (150)</span>
            </div>

            <ChartContainer
              config={STREAK_CHART_CONFIG}
              className="h-44 w-full aspect-auto select-none"
            >
              <AreaChart
                data={STREAK_ACTIVITY_DATA}
                margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="recharts-activity-grad-header-modal"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  className="stroke-border/40"
                />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={6}
                  className="text-[10px] font-bold fill-muted-foreground"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={4}
                  domain={[100, 200]}
                  className="text-[9px] font-semibold fill-muted-foreground"
                />
                <ReferenceLine
                  y={150}
                  stroke="#10b981"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  label={{
                    value: "Mínimo Saludable (150)",
                    position: "insideBottomRight",
                    offset: 8,
                    fill: "#10b981",
                    fontSize: 9,
                    fontWeight: "bold",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="puntos"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#recharts-activity-grad-header-modal)"
                />
              </AreaChart>
            </ChartContainer>

            <p className="text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border/40">
              Mantén tu racha de actividad física diaria sumando al menos{" "}
              <strong>150 Puntos MET</strong>. Cada día completado fortalece tu consistencia
              metabólica.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background pb-16 md:pb-0">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-bebas tracking-wider text-foreground uppercase select-none">
              Shakerfy
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            El buscador con IA de gimnasios, fitness centers y studios. Encuentra, reserva y
            gestiona tu entrenamiento.
          </p>
        </div>
        {[
          { t: "Producto", l: ["Descubrir", "Disciplinas", "Planes", "Para gimnasios"] },
          { t: "Compañía", l: ["Sobre nosotros", "Carreras", "Prensa", "Contacto"] },
          { t: "Legal", l: ["Términos", "Privacidad", "Cookies"] },
        ].map((c) => (
          <div key={c.t}>
            <div className="text-sm font-semibold text-foreground">{c.t}</div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {c.l.map((i) => (
                <li key={i}>
                  <a href="#" className="transition hover:text-foreground">
                    {i}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between px-6 py-5 text-xs text-muted-foreground text-center sm:text-left">
          <span>© {new Date().getFullYear()} Shakerfy. Todos los derechos reservados.</span>
          <span>Hecho con precisión.</span>
        </div>
      </div>
    </footer>
  );
}
