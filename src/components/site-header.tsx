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
        "sticky top-0 z-40 transition-all duration-500",
        isSanctuary
          ? "border-b border-white/[0.08] bg-[#151311]/45 backdrop-blur-xl text-[#F6F4EE] shadow-[0_15px_45px_rgba(0,0,0,0.45)]"
          : "border-b border-border/60 bg-background/80 backdrop-blur-xl",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 relative">
        {/* Left: User Profile Photo avatar on mobile, Nav links on desktop */}
        <div className="flex items-center flex-1 justify-start gap-3">
          {isLoggedIn && (
            <button
              type="button"
              onClick={() => navigate({ to: "/app", search: { tab: "config" } })}
              className={cn(
                "md:hidden w-8 h-8 rounded-full border overflow-hidden shrink-0 shadow-2xs select-none cursor-pointer active:scale-95 transition-transform",
                isSanctuary
                  ? "border-white/[0.1] bg-[#181614]/60 hover:border-white/[0.2]"
                  : "border-border/80 bg-secondary",
              )}
              title="Ver mi perfil"
            >
              <img src={userPhoto} alt="Foto de Perfil" className="w-full h-full object-cover" />
            </button>
          )}
          <nav
            className={cn(
              "hidden items-center gap-6 text-sm md:flex transition-colors",
              isSanctuary ? "text-[#A39C91]" : "text-muted-foreground",
            )}
          >
            <a
              href="/#como-funciona"
              className={cn(
                "transition",
                isSanctuary ? "hover:text-[#F6F4EE]" : "hover:text-foreground",
              )}
            >
              Cómo funciona
            </a>
            <Link
              to="/blog"
              className={cn(
                "transition",
                isSanctuary ? "hover:text-[#F6F4EE]" : "hover:text-foreground",
              )}
            >
              Blog
            </Link>
            <a
              href="/#para-gimnasios"
              className={cn(
                "transition",
                isSanctuary ? "hover:text-[#F6F4EE]" : "hover:text-foreground",
              )}
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
            <WellnessSymbol
              className={cn(
                "w-7 h-7 sm:w-8 sm:h-8 transition-transform duration-300 group-hover:scale-105",
                isSanctuary ? "text-[#E8E2D5]" : "text-foreground",
              )}
            />
            <span
              className={cn(
                "text-xl sm:text-2xl font-poppins font-semibold tracking-tight whitespace-nowrap",
                isSanctuary ? "text-[#F6F4EE]" : "text-foreground",
              )}
            >
              The Wellness Face
            </span>
          </Link>
        </div>

        {/* Right: Actions (Selector Modo Oscuro/Claro, Botón Configuración & Desktop Profile Menu) */}
        <div className="flex items-center flex-1 justify-end gap-2">
          <div
            className={cn(
              isSanctuary &&
                "[&_button]:border-white/[0.1] [&_button]:bg-[#181614]/60 [&_button]:text-[#A39C91] hover:[&_button]:text-[#F6F4EE] hover:[&_button]:bg-[#201D1A]",
            )}
          >
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
                className={cn(
                  "w-8 h-8 rounded-full border flex items-center justify-center transition cursor-pointer active:scale-95 shadow-2xs",
                  isSanctuary
                    ? "border-white/[0.1] bg-[#181614]/60 text-[#A39C91] hover:text-[#F6F4EE] hover:bg-[#201D1A] hover:border-white/[0.2]"
                    : "border-border/80 bg-card hover:bg-secondary text-muted-foreground hover:text-foreground",
                )}
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
                      className={cn(
                        "flex items-center gap-2 rounded-full pl-1.5 pr-2.5 py-1 border transition",
                        isSanctuary
                          ? "border-white/[0.1] bg-[#181614]/60 hover:bg-[#201D1A] hover:border-white/[0.2] text-[#F6F4EE]"
                          : "hover:bg-secondary border-border/50",
                      )}
                    >
                      {/* User Profile Photo */}
                      <div
                        className={cn(
                          "w-7 h-7 rounded-full overflow-hidden shrink-0 shadow-2xs border",
                          isSanctuary ? "border-white/20 bg-[#201D1A]" : "bg-secondary border-white/50",
                        )}
                      >
                        <img
                          src={userPhoto}
                          alt="Foto de Perfil"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span
                        className={cn(
                          "text-xs font-bold hidden sm:inline-block",
                          isSanctuary ? "text-[#F6F4EE]" : "text-foreground",
                        )}
                      >
                        {userName}
                      </span>
                      <ChevronDown
                        className={cn("w-3.5 h-3.5", isSanctuary ? "text-[#A39C91]" : "text-muted-foreground")}
                      />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    className={cn(
                      "w-56",
                      isSanctuary &&
                        "bg-[#141210]/95 backdrop-blur-2xl border-white/[0.1] text-[#F6F4EE] shadow-[0_20px_50px_rgba(0,0,0,0.85)]",
                    )}
                    align="end"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className={cn("text-xs font-bold leading-none", isSanctuary ? "text-[#F6F4EE]" : "text-foreground")}>
                          Agustín Gómez
                        </p>
                        <p className={cn("text-[11px] leading-none truncate", isSanctuary ? "text-[#A39C91]" : "text-muted-foreground")}>
                          agustin.gomez@email.com
                        </p>
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator className={cn(isSanctuary && "bg-white/[0.08]")} />

                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild className={cn("cursor-pointer", isSanctuary && "hover:bg-white/[0.06] focus:bg-white/[0.06]")}>
                        <Link to="/app" search={{ tab: "inicio" }}>
                          <User className="mr-2 h-4 w-4 text-[#C5BAA8]" />
                          <span>Inicio</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild className={cn("cursor-pointer", isSanctuary && "hover:bg-white/[0.06] focus:bg-white/[0.06]")}>
                        <Link to="/app" search={{ tab: "diario" }}>
                          <Sparkles className="mr-2 h-4 w-4 text-amber-400" />
                          <span>Diario</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild className={cn("cursor-pointer", isSanctuary && "hover:bg-white/[0.06] focus:bg-white/[0.06]")}>
                        <Link to="/app" search={{ tab: "clases" }}>
                          <QrCode className="mr-2 h-4 w-4 text-emerald-400" />
                          <span>Check-in</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild className={cn("cursor-pointer", isSanctuary && "hover:bg-white/[0.06] focus:bg-white/[0.06]")}>
                        <Link to="/app" search={{ tab: "pagos" }}>
                          <CreditCard className="mr-2 h-4 w-4 text-sky-400" />
                          <span>Membresías & Pagos</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator className={cn(isSanctuary && "bg-white/[0.08]")} />

                    <DropdownMenuItem asChild className={cn("cursor-pointer", isSanctuary && "hover:bg-white/[0.06] focus:bg-white/[0.06]")}>
                      <Link to="/app" search={{ tab: "config" }}>
                        <Settings className="mr-2 h-4 w-4 text-[#A39C91]" />
                        <span>Configuración</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className={cn(isSanctuary && "bg-white/[0.08]")} />

                    <DropdownMenuItem
                      className={cn(
                        "cursor-pointer text-destructive focus:text-destructive",
                        isSanctuary && "hover:bg-rose-950/30 focus:bg-rose-950/30",
                      )}
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
                  isSanctuary && "text-[#A39C91] hover:text-[#F6F4EE] hover:bg-white/[0.05]",
                )}
              >
                Iniciar sesión
              </Link>
              <Link
                to="/auth"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "rounded-full px-4",
                  isSanctuary && "bg-[#E8E2D5] text-[#141312] hover:bg-[#F6F4EE]",
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
  const isSanctuary = variant === "sanctuary";

  return (
    <footer
      className={cn(
        "border-t pb-16 md:pb-0 transition-colors duration-300",
        isSanctuary
          ? "border-[#26221E] bg-[#0A0909] text-[#F5F3EE]"
          : "border-border/60 bg-background",
      )}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2.5 group select-none">
            <WellnessSymbol
              className={cn(
                "w-6 h-6 transition-transform duration-300 group-hover:scale-105",
                isSanctuary ? "text-[#E8E2D5]" : "text-foreground",
              )}
            />
            <span
              className={cn(
                "text-xl font-poppins font-semibold tracking-tight",
                isSanctuary ? "text-[#F5F3EE]" : "text-foreground",
              )}
            >
              The Wellness Face
            </span>
          </Link>
          <p
            className={cn(
              "mt-4 max-w-xs text-sm",
              isSanctuary ? "text-[#A39C91]" : "text-muted-foreground",
            )}
          >
            Tu bienestar, bien elegido.
          </p>
        </div>
        {[
          { t: "Producto", l: ["Descubrir", "Disciplinas", "Planes", "Para gimnasios"] },
          { t: "Compañía", l: ["Sobre nosotros", "Carreras", "Prensa", "Contacto"] },
          { t: "Legal", l: ["Términos", "Privacidad", "Cookies"] },
        ].map((c) => (
          <div key={c.t}>
            <div
              className={cn(
                "text-sm font-semibold tracking-wide",
                isSanctuary ? "text-[#F5F3EE] uppercase text-[12px] tracking-[0.15em]" : "text-foreground",
              )}
            >
              {c.t}
            </div>
            <ul
              className={cn(
                "mt-3 space-y-2 text-sm",
                isSanctuary ? "text-[#A39C91]" : "text-muted-foreground",
              )}
            >
              {c.l.map((i) => (
                <li key={i}>
                  <a
                    href="#"
                    className={cn(
                      "transition",
                      isSanctuary ? "hover:text-[#F5F3EE]" : "hover:text-foreground",
                    )}
                  >
                    {i}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div
        className={cn(
          "border-t",
          isSanctuary ? "border-[#1F1C19]" : "border-border/60",
        )}
      >
        <div
          className={cn(
            "mx-auto flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between px-6 py-5 text-xs text-center sm:text-left",
            isSanctuary ? "text-[#7D766D]" : "text-muted-foreground",
          )}
        >
          <span>© {new Date().getFullYear()} The Wellness Face. Todos los derechos reservados.</span>
          <span>Hecho con precisión y calma.</span>
        </div>
      </div>
    </footer>
  );
}
