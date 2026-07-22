import { useState, useRef } from "react";
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
  BarChart3,
  CreditCard,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";

export function SiteHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

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
        {/* Left: Navigation links */}
        <div className="flex items-center flex-1 justify-start">
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

        {/* Center: Logo (Gymshark style) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <Link
            to="/"
            onClick={() => window.scrollTo(0, 0)}
            className="text-2xl sm:text-3xl font-bebas tracking-wider text-foreground uppercase select-none"
          >
            Shakerfy
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center flex-1 justify-end gap-2">
          {isLoggedIn ? (
            <div
              className="relative inline-block"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen} modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 rounded-full pl-2 pr-3 py-1.5 hover:bg-secondary border border-border/50"
                  >
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                      A
                    </div>
                    <span className="text-xs font-bold text-foreground hidden sm:inline-block">
                      Agustín
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
                        <Calendar className="mr-2 h-4 w-4 text-emerald-500" />
                        <span>Reservas</span>
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
                        <CreditCard className="mr-2 h-4 w-4 text-purple-500" />
                        <span>Suscripción</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to="/app" search={{ tab: "config" }}>
                        <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Configuración</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="cursor-pointer text-rose-500 focus:text-rose-500 focus:bg-rose-500/10"
                    onClick={() => {
                      setIsLoggedIn(false);
                      navigate({ to: "/" });
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
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
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Shakerfy. Todos los derechos reservados.</span>
          <span>Hecho con precisión.</span>
        </div>
      </div>
    </footer>
  );
}
