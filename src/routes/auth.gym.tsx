import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/auth/gym")({
  component: GymAuthPage,
});

function GymAuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gymName, setGymName] = useState("");
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular login exitoso de administrador de gimnasio
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-background">
      {/* Mesh Background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(147,51,234,0.15),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.15),transparent_40%)] opacity-80 blur-3xl"
      />

      <Link
        to="/auth"
        className="absolute left-6 top-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a Alumnos
      </Link>

      <div className="w-full max-w-[400px] rounded-3xl border border-border bg-card p-8 ">
        <div className="flex flex-col items-center text-center">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground mb-4">
            <Building2 className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {isLogin ? "Acceso de Gimnasios" : "Suma tu gimnasio"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            {isLogin
              ? "Ingresa al panel de administración"
              : "Digitaliza tu negocio y vende tus membresías con IA"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {!isLogin && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Nombre del Gimnasio
                </label>
                <input
                  type="text"
                  required
                  value={gymName}
                  onChange={(e) => setGymName(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm  transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Kraft Strength Club"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Dirección</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm  transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Av. Santa Fe 3421, Palermo"
                />
              </div>
            </>
          )}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Email administrativo
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm  transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="admin@gimnasio.com"
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
            {isLogin ? "Entrar al panel" : "Registrar gimnasio"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">
            {isLogin ? "¿Aún no formas parte de Shakerfy? " : "¿Ya tienes cuenta registrada? "}
          </span>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-foreground hover:underline"
          >
            {isLogin ? "Sumarme" : "Inicia sesión"}
          </button>
        </div>
      </div>
    </div>
  );
}
