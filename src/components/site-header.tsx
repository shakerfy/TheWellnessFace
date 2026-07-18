import { Link } from "@tanstack/react-router";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteHeader() {
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
