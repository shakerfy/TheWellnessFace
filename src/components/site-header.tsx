import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-md bg-foreground text-background">
            <span className="text-[13px] font-bold">S</span>
          </div>
          <span className="text-[17px] font-semibold tracking-tight">Shakerfy</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#descubrir" className="transition hover:text-foreground">Descubrir</a>
          <a href="#disciplinas" className="transition hover:text-foreground">Disciplinas</a>
          <a href="#para-gimnasios" className="transition hover:text-foreground">Para gimnasios</a>
          <a href="#como-funciona" className="transition hover:text-foreground">Cómo funciona</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/auth">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Iniciar sesión</Button>
          </Link>
          <Link to="/auth">
            <Button size="sm" className="rounded-full px-4">Empezar</Button>
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
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-foreground text-background">
              <span className="text-[13px] font-bold">S</span>
            </div>
            <span className="text-base font-semibold tracking-tight">Shakerfy</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            El buscador con IA de gimnasios, fitness centers y studios. Encuentra, reserva y gestiona tu entrenamiento.
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
                <li key={i}><a href="#" className="transition hover:text-foreground">{i}</a></li>
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