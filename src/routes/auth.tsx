import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular login exitoso de alumno
    navigate({ to: "/app" });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-background">
      {/* Mesh Gradient Background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.15),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(236,72,153,0.2),transparent_40%)] opacity-80 blur-3xl"
      />

      <Link
        to="/"
        className="absolute left-6 top-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Volver al buscador
      </Link>

      <div className="w-full max-w-sm sm:max-w-[400px] rounded-3xl border border-border bg-card p-6 sm:p-8 ">
        <div className="flex flex-col items-center text-center">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-foreground text-background mb-4">
            <Dumbbell className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {isLogin ? "¡Hola de nuevo!" : "Crea tu cuenta"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            {isLogin
              ? "Ingresa tus datos para acceder a Shakerfy"
              : "Comienza a reservar y entrenar hoy mismo"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Nombre completo</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm  transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Juan Pérez"
              />
            </div>
          )}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm  transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="juan@email.com"
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-muted-foreground">Contraseña</label>
              {isLogin && (
                <a href="#" className="text-xs text-muted-foreground hover:underline">
                  ¿La olvidaste?
                </a>
              )}
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm  transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" className="w-full rounded-xl mt-2">
            {isLogin ? "Iniciar sesión" : "Crear cuenta"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">
            {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
          </span>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-foreground hover:underline"
          >
            {isLogin ? "Regístrate" : "Inicia sesión"}
          </button>
        </div>

        {isLogin && (
          <div className="mt-6 pt-6 border-t border-border/60 text-center">
            <Link
              to="/auth/gym"
              className="text-xs text-muted-foreground hover:text-foreground hover:underline"
            >
              ¿Eres administrador de un gimnasio? Ingresa aquí
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
