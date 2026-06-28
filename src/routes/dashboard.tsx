import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { 
  Building2, Users, Calendar, CreditCard, Settings, LogOut,
  Bell, CheckCircle2, AlertCircle, Search, Download, 
  MapPin, Clock, Plus, HelpCircle, Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard")({
  component: GymDashboard,
});

const TABS = [
  { id: "asistencia", label: "Asistencias", icon: Activity },
  { id: "miembros", label: "Miembros", icon: Users },
  { id: "membresias", label: "Membresías", icon: CreditCard },
  { id: "clases", label: "Clases", icon: Calendar },
  { id: "config", label: "Configuración", icon: Settings },
];

function GymDashboard() {
  const [activeTab, setActiveTab] = useState("asistencia");
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate({ to: "/auth/gym" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-card border-b md:border-b-0 md:border-r border-border p-6 flex flex-col h-auto md:h-screen sticky top-0 z-30">
        <div className="flex items-center gap-2 mb-8 justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground">
              <Building2 className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold tracking-tight">Shakerfy Admin</span>
          </div>
          <button 
            onClick={handleLogout}
            className="md:hidden p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-1.5 flex-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <button 
          onClick={handleLogout}
          className="hidden md:flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition mt-auto"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 w-full max-w-7xl mx-auto">
        {/* Top Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Kraft Strength Club</h1>
            <p className="text-sm text-muted-foreground">Panel de Control de Recepción y Administración.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center relative cursor-pointer">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500" />
            </div>
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Admin" className="h-9 w-9 rounded-full border border-border" />
          </div>
        </header>

        {activeTab === "asistencia" && <AsistenciasTab />}
        {activeTab === "miembros" && <MiembrosTab />}
        {activeTab === "membresias" && <MembresiasTab />}
        {activeTab === "clases" && <ClasesTab />}
        {activeTab === "config" && <ConfigTab />}
      </main>
    </div>
  );
}

// Subcomponent: Asistencias Tab
function AsistenciasTab() {
  const [historySearch, setHistorySearch] = useState("");
  
  const recentCheckins = [
    { name: "Agustín Gómez", time: "11:24 AM", alert: "Lesión Rodilla", alertColor: "bg-amber-500/10 text-amber-500 border-amber-500/20", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80" },
    { name: "Camila Díaz", time: "11:15 AM", alert: "Pago Pendiente", alertColor: "bg-rose-500/10 text-rose-500 border-rose-500/20", photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80" },
    { name: "Marcos López", time: "10:54 AM", alert: null, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80" },
  ];

  const history = [
    { name: "Agustín Gómez", date: "Hoy", time: "11:24 AM", method: "QR Scan", class: "CrossFit WOD" },
    { name: "Camila Díaz", date: "Hoy", time: "11:15 AM", method: "Recepción", class: "Musculación Libre" },
    { name: "Marcos López", date: "Hoy", time: "10:54 AM", method: "QR Scan", class: "CrossFit WOD" },
    { name: "Sofía Martínez", date: "Ayer", time: "19:10 PM", method: "QR Scan", class: "Yoga Ashtanga" },
  ];

  const handleExport = () => {
    alert("Exportando registros de asistencia a CSV...");
  };

  return (
    <div className="space-y-8">
      {/* Live Feed Header / Current Attendance Counter */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm flex items-center justify-between col-span-1">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Aforo Actual</span>
            <div className="text-4xl font-extrabold tracking-tight mt-2">42 <span className="text-lg font-medium text-muted-foreground">/ 80</span></div>
            <p className="text-xs text-muted-foreground mt-1">Capacidad segura al 52%</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        {/* Live Feed Checklist */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm col-span-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Monitor de Entradas Recientes</h3>
          <div className="space-y-4">
            {recentCheckins.map((c, i) => (
              <div key={i} className="flex items-center justify-between pb-3 border-b border-border/50 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <img src={c.photo} alt={c.name} className="h-9 w-9 rounded-full object-cover" />
                  <div>
                    <div className="text-sm font-semibold">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.time}</div>
                  </div>
                </div>
                {c.alert && (
                  <span className={`text-[10px] font-bold uppercase border px-2.5 py-0.5 rounded-full ${c.alertColor}`}>
                    {c.alert}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* History table */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Historial General</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Buscar miembro..." 
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="pl-9 pr-4 h-9 w-48 rounded-xl border border-border bg-background text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <Button size="sm" variant="outline" className="rounded-xl gap-1.5" onClick={handleExport}>
              <Download className="h-3.5 w-3.5" /> Exportar
            </Button>
          </div>
        </div>

        <div className="overflow-hidden border border-border rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted font-bold text-muted-foreground border-b border-border">
              <tr>
                <th className="p-3">Miembro</th>
                <th className="p-3">Fecha</th>
                <th className="p-3">Hora de Entrada</th>
                <th className="p-3">Acceso</th>
                <th className="p-3">Clase</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {history.map((h, i) => (
                <tr key={i} className="hover:bg-secondary/20 transition">
                  <td className="p-3 font-semibold">{h.name}</td>
                  <td className="p-3 text-muted-foreground">{h.date}</td>
                  <td className="p-3 text-foreground font-medium">{h.time}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-secondary border border-border font-medium text-foreground">
                      {h.method}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground">{h.class}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Subcomponent: Miembros Tab
function MiembrosTab() {
  const members = [
    { name: "Agustín Gómez", phone: "+54 9 11 3242-1241", email: "agustin@email.com", plan: "Pase Libre", end: "20-Jul-2026", status: "activo", color: "text-emerald-500 bg-emerald-500/10" },
    { name: "Camila Díaz", phone: "+54 9 11 4124-5124", email: "camila@email.com", plan: "Performance", end: "01-Jul-2026", status: "pendiente", color: "text-amber-500 bg-amber-500/10" },
    { name: "Marcos López", phone: "+54 9 11 2341-2412", email: "marcos@email.com", plan: "Pase Libre", end: "15-Jun-2026", status: "vencido", color: "text-rose-500 bg-rose-500/10" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Administración de Miembros</h2>
          <p className="text-sm text-muted-foreground">Listado general de alumnos registrados en tu gimnasio.</p>
        </div>
        <Button size="sm" className="rounded-xl gap-1.5"><Plus className="h-4 w-4" /> Agregar Miembro</Button>
      </div>

      <div className="overflow-hidden border border-border rounded-2xl bg-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted text-xs font-bold text-muted-foreground border-b border-border">
            <tr>
              <th className="p-4">Nombre</th>
              <th className="p-4">Contacto</th>
              <th className="p-4">Plan Activo</th>
              <th className="p-4">Vencimiento</th>
              <th className="p-4">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {members.map((m, i) => (
              <tr key={i} className="hover:bg-secondary/20 transition">
                <td className="p-4 font-semibold">{m.name}</td>
                <td className="p-4">
                  <div className="text-xs text-foreground">{m.phone}</div>
                  <div className="text-xs text-muted-foreground">{m.email}</div>
                </td>
                <td className="p-4 font-medium text-foreground">{m.plan}</td>
                <td className="p-4 text-muted-foreground">{m.end}</td>
                <td className="p-4">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${m.color}`}>
                    {m.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Subcomponent: Membresias Tab
function MembresiasTab() {
  const memberships = [
    { name: "Pase Libre", price: "$18.900", duration: "Mensual", activeCount: 142, benefits: ["Acceso ilimitado", "Musculación", "Vestuarios"] },
    { name: "Performance", price: "$28.500", duration: "Mensual", activeCount: 68, benefits: ["Pase libre", "Plan de entrenamiento", "4 Clases coacheadas"] },
    { name: "Elite Coached", price: "$42.000", duration: "Mensual", activeCount: 12, benefits: ["Todo Performance", "PT semanal 1:1", "Análisis postural"] },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Planes de Membresía</h2>
          <p className="text-sm text-muted-foreground">Define tus tarifas y beneficios mensuales.</p>
        </div>
        <Button size="sm" className="rounded-xl gap-1.5"><Plus className="h-4 w-4" /> Nuevo Plan</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {memberships.map((m, i) => (
          <div key={i} className="rounded-3xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between hover:border-foreground/20 transition">
            <div>
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg">{m.name}</h3>
                <span className="text-xs text-muted-foreground font-medium">{m.duration}</span>
              </div>
              <div className="mt-4 text-3xl font-extrabold tracking-tight">{m.price}</div>
              
              <ul className="mt-5 space-y-2 border-t border-border/60 pt-4">
                {m.benefits.map((b, idx) => (
                  <li key={idx} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> {b}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-6 border-t border-border/60 pt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>Miembros activos:</span>
              <span className="font-bold text-foreground bg-secondary px-2.5 py-0.5 rounded-full">{m.activeCount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Subcomponent: Clases Tab
function ClasesTab() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const classes = [
    { id: "1", name: "CrossFit WOD", instructor: "Mateo", time: "08:00 - 09:00", booked: "12 / 15 cupos", enrolled: ["Agustín Gómez", "Marcos López", "Tomás Ruiz"] },
    { id: "2", name: "Yoga Ashtanga", instructor: "Valeria", time: "09:30 - 10:30", booked: "8 / 10 cupos", enrolled: ["Paula Cáceres", "Sofía Martínez"] },
    { id: "3", name: "Funcional", instructor: "Daniel", time: "18:00 - 19:00", booked: "15 / 15 cupos", enrolled: ["Pedro Giménez", "María del Mar"] },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Calendario de Clases</h2>
        <p className="text-sm text-muted-foreground">Clases planificadas y alumnos agendados en cada horario.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Side: Schedule */}
        <div className="col-span-2 space-y-4">
          <div className="rounded-2xl border border-border bg-card p-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase mb-4">Hoy</h3>
            <div className="space-y-3">
              {classes.map((c) => (
                <div 
                  key={c.id} 
                  onClick={() => setSelectedClass(c.id)}
                  className={`p-4 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    selectedClass === c.id 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-foreground/20"
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-sm">{c.name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{c.instructor} · {c.time} hs</p>
                  </div>
                  <span className="text-xs font-semibold bg-secondary px-2.5 py-1 rounded-full text-foreground">
                    {c.booked}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Enrolled members view */}
        <div className="col-span-1">
          <div className="rounded-2xl border border-border bg-card p-4 h-full min-h-[300px] flex flex-col">
            <h3 className="text-xs font-bold text-muted-foreground uppercase mb-4">Alumnos Inscritos</h3>
            {selectedClass ? (
              <ul className="space-y-3 flex-1">
                {classes.find(c => c.id === selectedClass)?.enrolled.map((name, idx) => (
                  <li key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/40 text-xs font-semibold">
                    <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px]">
                      {name[0]}
                    </div>
                    {name}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
                <HelpCircle className="h-8 w-8 mb-2" />
                <p className="text-xs">Haz clic en una clase de la agenda para ver los alumnos agendados en ese horario.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Subcomponent: Config Tab
function ConfigTab() {
  return (
    <div className="space-y-6 max-w-2xl bg-card border border-border p-6 rounded-3xl shadow-sm">
      <div>
        <h2 className="text-lg font-bold">Configuración del Gimnasio</h2>
        <p className="text-xs text-muted-foreground">Edita la ficha de información pública que ven tus miembros.</p>
      </div>

      <form className="space-y-4 text-sm" onSubmit={(e) => e.preventDefault()}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Nombre Comercial</label>
            <input type="text" className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" defaultValue="Kraft Strength Club" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Zona horaria</label>
            <input type="text" className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" defaultValue="America/Argentina/Buenos_Aires" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">Dirección Física</label>
          <input type="text" className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" defaultValue="Av. Santa Fe 3421, Palermo, CABA" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Hora de Apertura</label>
            <input type="time" className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" defaultValue="06:00" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Hora de Cierre</label>
            <input type="time" className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" defaultValue="23:00" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">Webhook URL (Integraciones)</label>
          <input type="text" className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" placeholder="https://api.tudominio.com/webhooks/payments" />
        </div>

        <Button className="rounded-xl mt-4">Guardar cambios</Button>
      </form>
    </div>
  );
}
