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
import {
  User,
  Sparkles,
  Calendar,
  QrCode,
  CreditCard,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { WellnessSymbol } from "@/components/wellness-symbol";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader({ variant = "sanctuary" }: { variant?: "default" | "sanctuary" } = {}) {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const isSanctuary = variant === "sanctuary";

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        "border-b border-border/80 bg-background/85 backdrop-blur-xl text-foreground shadow-2xs",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 relative">
        {/* Left: User Profile Photo avatar on mobile, Nav links on desktop */}
        <div className="flex items-center flex-1 justify-start gap-3">
          {isLoggedIn && (
            <button
              type="button"
              onClick={() => navigate({ to: "/app", search: { tab: "config" } })}
              className="md:hidden w-8 h-8 rounded-full border border-border/80 bg-card hover:bg-muted overflow-hidden shrink-0 shadow-2xs select-none cursor-pointer active:scale-95 transition-transform"
              title="Ver mi perfil"
            >
              <img src={userPhoto} alt="Foto de Perfil" className="w-full h-full object-cover" />
            </button>
          )}
          <nav className="hidden items-center gap-6 text-sm md:flex transition-colors text-muted-foreground">
            <a
              href="/#como-funciona"
              className="transition hover:text-foreground"
            >
              Cómo funciona
            </a>
            <Link
              to="/blog"
              className="transition hover:text-foreground"
            >
              Blog
            </Link>
            <a
              href="/#para-gimnasios"
              className="transition hover:text-foreground"
            >
              Partners
            </a>
          </nav>
        </div>

        {/* Center: Logo (Brand Guide: Isotipo + The Wellness Face) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <Link
            to="/"
            onClick={() => window.scrollTo(0, 0)}
            className="flex items-center gap-2.5 sm:gap-3 select-none group"
          >
            <WellnessSymbol className="w-7 h-7 sm:w-8 sm:h-8 transition-transform duration-300 group-hover:scale-105 text-foreground" />
            <span className="text-xl sm:text-2xl font-poppins font-semibold tracking-tight whitespace-nowrap text-foreground">
              The Wellness Face
            </span>
          </Link>
        </div>

        {/* Right: Actions (Selector Modo Oscuro/Claro, Botón Configuración & Desktop Profile Menu) */}
        <div className="flex items-center flex-1 justify-end gap-2">
          <div>
            <ThemeToggle variant="outline" size="icon" />
          </div>
          {isLoggedIn ? (
            <>
              {/* Botón de Configuración (Settings) */}
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("shakerfy:open-settings"));
                  }
                  navigate({ to: "/app", search: { tab: "config" } });
                }}
                className="w-8 h-8 rounded-full border border-border/80 bg-card hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition cursor-pointer active:scale-95 shadow-2xs"
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
                      className="flex items-center gap-2 rounded-full pl-1.5 pr-2.5 py-1 border border-border/80 bg-card hover:bg-muted text-foreground transition"
                    >
                      {/* User Profile Photo */}
                      <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 shadow-2xs border border-border/80 bg-muted">
                        <img
                          src={userPhoto}
                          alt="Foto de Perfil"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs font-bold hidden sm:inline-block text-foreground">
                        {userName}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    className="w-56 bg-card/95 backdrop-blur-2xl border-border text-foreground shadow-xl rounded-2xl"
                    align="end"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-xs font-bold leading-none text-foreground">
                          Agustín Gómez
                        </p>
                        <p className="text-[11px] leading-none truncate text-muted-foreground">
                          agustin.gomez@email.com
                        </p>
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator className="bg-border/60" />

                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild className="cursor-pointer hover:bg-muted focus:bg-muted">
                        <Link to="/app" search={{ tab: "inicio" }}>
                          <User className="mr-2 h-4 w-4 text-foreground" />
                          <span>Inicio</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild className="cursor-pointer hover:bg-muted focus:bg-muted">
                        <Link to="/app" search={{ tab: "diario" }}>
                          <Sparkles className="mr-2 h-4 w-4 text-amber-500" />
                          <span>Diario</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild className="cursor-pointer hover:bg-muted focus:bg-muted">
                        <Link to="/app" search={{ tab: "clases" }}>
                          <QrCode className="mr-2 h-4 w-4 text-emerald-500" />
                          <span>Check-in</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild className="cursor-pointer hover:bg-muted focus:bg-muted">
                        <Link to="/app" search={{ tab: "pagos" }}>
                          <CreditCard className="mr-2 h-4 w-4 text-sky-500" />
                          <span>Membresías & Pagos</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator className="bg-border/60" />

                    <DropdownMenuItem asChild className="cursor-pointer hover:bg-muted focus:bg-muted">
                      <Link to="/app" search={{ tab: "config" }}>
                        <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Configuración</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-border/60" />

                    <DropdownMenuItem
                      className="cursor-pointer text-destructive focus:text-destructive hover:bg-destructive/10 focus:bg-destructive/10"
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
                  "hidden sm:inline-flex text-muted-foreground hover:text-foreground",
                )}
              >
                Iniciar sesión
              </Link>
              <Link
                to="/auth"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "rounded-full px-4 bg-foreground text-background hover:bg-foreground/90",
                )}
              >
                Empezar
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter({ variant = "sanctuary" }: { variant?: "default" | "sanctuary" } = {}) {
  return (
    <footer className="border-t border-border/80 bg-card/40 text-foreground pb-16 md:pb-0 transition-colors duration-300">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2.5 group select-none">
            <WellnessSymbol className="w-6 h-6 transition-transform duration-300 group-hover:scale-105 text-foreground" />
            <span className="text-xl font-poppins font-semibold tracking-tight text-foreground">
              The Wellness Face
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Tu bienestar, bien elegido.
          </p>
        </div>
        {[
          { t: "Producto", l: ["Descubrir", "Disciplinas", "Planes", "Para gimnasios"] },
          { t: "Compañía", l: ["Sobre nosotros", "Carreras", "Prensa", "Contacto"] },
          { t: "Legal", l: ["Términos", "Privacidad", "Cookies"] },
        ].map((c) => (
          <div key={c.t}>
            <div className="text-sm font-semibold tracking-wide text-foreground uppercase text-[12px] tracking-[0.15em]">
              {c.t}
            </div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {c.l.map((i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="transition hover:text-foreground"
                  >
                    {i}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border/80">
        <div className="mx-auto flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between px-6 py-5 text-xs text-center sm:text-left text-muted-foreground">
          <span>© {new Date().getFullYear()} The Wellness Face. Todos los derechos reservados.</span>
          <span>Hecho con precisión y calma.</span>
        </div>
      </div>
    </footer>
  );
}
