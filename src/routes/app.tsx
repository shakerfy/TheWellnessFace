import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { 
  User, Calendar, BarChart3, CreditCard, Settings, 
  LogOut, QrCode, CheckCircle, Clock, AlertTriangle, 
  MapPin, ChevronRight, X, Sparkles, Shield, AlertCircle, ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app")({
  component: StudentDashboard,
});

const TABS = [
  { id: "inicio", label: "Inicio", icon: User },
  { id: "clases", label: "Reservas", icon: Calendar },
  { id: "progreso", label: "Mi Progreso", icon: BarChart3 },
  { id: "pagos", label: "Suscripción", icon: CreditCard },
  { id: "config", label: "Configuración", icon: Settings },
];

function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("inicio");
  const [qrOpen, setQrOpen] = useState(false);
  const [qrTimer, setQrTimer] = useState(60);
  const navigate = useNavigate();

  // MOCK STATE FOR RESERVATIONS & CANCELLATION VALIDATION
  const [blockedCancellationClass, setBlockedCancellationClass] = useState<any | null>(null);
  const [reservations, setReservations] = useState([
    { id: "1", name: "CrossFit WOD", instructor: "Mateo Rossi", time: "19:00", timeLabel: "Hoy, 19:00 hs", cannotCancel: true, timeRemainingLabel: "45 minutos" },
    { id: "2", name: "Yoga Vinyasa", instructor: "Valeria Soto", time: "22:00", timeLabel: "Hoy, 22:00 hs", cannotCancel: false, timeRemainingLabel: "3 horas y 45 minutos" }
  ]);

  // QR Timer Countdown Simulation
  useEffect(() => {
    if (!qrOpen) return;
    setQrTimer(60);
    const interval = setInterval(() => {
      setQrTimer((prev) => (prev > 1 ? prev - 1 : 60));
    }, 1000);
    return () => clearInterval(interval);
  }, [qrOpen]);

  const handleLogout = () => {
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row pb-16 md:pb-0">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border p-6 h-screen sticky top-0">
        <div className="flex items-center gap-2 mb-8">
          <div className="grid h-7 w-7 place-items-center rounded-md bg-foreground text-background">
            <span className="text-[13px] font-bold">S</span>
          </div>
          <span className="text-lg font-bold tracking-tight">Shakerfy App</span>
        </div>

        <nav className="flex-1 space-y-1.5">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "bg-foreground text-background"
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
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition mt-auto"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
        {/* Mobile Header */}
        <header className="flex md:hidden items-center justify-between mb-6 pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-foreground text-background">
              <span className="text-[12px] font-bold">S</span>
            </div>
            <span className="text-base font-bold tracking-tight">Shakerfy</span>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </header>

        {activeTab === "inicio" && (
          <InicioTab 
            setQrOpen={setQrOpen} 
            reservations={reservations} 
            setReservations={setReservations} 
            setBlockedCancellationClass={setBlockedCancellationClass}
          />
        )}
        {activeTab === "clases" && <ClasesTab />}
        {activeTab === "progreso" && <ProgresoTab />}
        {activeTab === "pagos" && <PagosTab />}
        {activeTab === "config" && <ConfigTab />}
      </main>

      {/* Bottom Nav for Mobile */}
      <nav className="flex md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-card/90 backdrop-blur px-4 py-2 justify-between z-40">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 flex-1 py-1 rounded-xl transition ${
                activeTab === tab.id
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* QR Modal Overlay */}
      {qrOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-fade-in">
          <div className="relative bg-card border border-border w-full max-w-[360px] rounded-3xl p-8 shadow-2xl text-center">
            <button 
              onClick={() => setQrOpen(false)}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-secondary transition"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold tracking-tight">QR de Ingreso</h3>
            <p className="text-xs text-muted-foreground mt-1">Escanea este código en la entrada</p>

            {/* Simulated QR Code Visual */}
            <div className="mx-auto my-6 p-4 bg-white rounded-2xl w-48 h-48 flex flex-col items-center justify-center relative border border-border shadow-inner">
              <QrCode className="h-36 w-36 text-zinc-950" />
              <div className="absolute inset-0 bg-emerald-500/5 flex items-center justify-center rounded-2xl pointer-events-none" />
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-semibold">
              <Clock className="h-3.5 w-3.5 animate-pulse" />
              Actualiza en {qrTimer}s
            </div>
            
            <p className="text-[11px] text-muted-foreground mt-4 flex items-center justify-center gap-1">
              <Shield className="h-3 w-3" /> Token de seguridad dinámico encriptado
            </p>
          </div>
        </div>
      )}

      {/* Cancellation Blocked Alert Modal */}
      {blockedCancellationClass && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-fade-in">
          <div className="relative bg-card border border-border w-full max-w-[420px] rounded-3xl p-6 shadow-2xl flex flex-col text-center items-center">
            <button 
              onClick={() => setBlockedCancellationClass(null)}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-secondary transition z-10"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="h-12 w-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4">
              <ShieldAlert className="h-6 w-6" />
            </div>

            <h3 className="text-lg font-bold tracking-tight text-foreground">Cancelación Excedida</h3>
            <p className="text-xs text-muted-foreground mt-1">No cumple con la política de anticipación mínima.</p>

            <div className="mt-4 p-4 rounded-2xl bg-secondary/35 text-xs text-left space-y-2 border border-border w-full">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Clase:</span>
                <span className="font-semibold text-foreground">{blockedCancellationClass.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Comienza en:</span>
                <span className="font-semibold text-rose-500">{blockedCancellationClass.timeRemainingLabel}</span>
              </div>
              <div className="flex justify-between border-t border-border/60 pt-2 mt-2">
                <span className="text-muted-foreground">Política del Gimnasio:</span>
                <span className="font-semibold text-foreground">Mínimo 2 horas antes</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
              De acuerdo con las normas de <strong>Kraft Strength Club</strong>, las cancelaciones deben realizarse con al menos 2 horas de antelación para permitir que otros alumnos en lista de espera tomen el cupo.
            </p>

            <div className="mt-6 flex gap-2 w-full">
              <Button 
                variant="secondary" 
                className="rounded-xl flex-1"
                onClick={() => setBlockedCancellationClass(null)}
              >
                Entendido
              </Button>
              <a 
                href="https://wa.me/5491132421241" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center rounded-xl flex-1 bg-emerald-500 text-white hover:bg-emerald-600 text-xs font-bold transition"
              >
                Contactar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Subcomponent: Inicio Tab
interface InicioTabProps {
  setQrOpen: (v: boolean) => void;
  reservations: { id: string; name: string; instructor: string; time: string; timeLabel: string; cannotCancel: boolean; timeRemainingLabel: string }[];
  setReservations: React.Dispatch<React.SetStateAction<{ id: string; name: string; instructor: string; time: string; timeLabel: string; cannotCancel: boolean; timeRemainingLabel: string }[]>>;
  setBlockedCancellationClass: (v: any) => void;
}

function InicioTab({ setQrOpen, reservations, setReservations, setBlockedCancellationClass }: InicioTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">¡Hola, Agustín! 👋</h2>
        <p className="text-sm text-muted-foreground">Tu entrenamiento de hoy te espera.</p>
      </div>

      {/* Member State Card */}
      <div className="grid gap-6 md:grid-cols-2 items-start">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between h-[230px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Membresía Activa</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                <CheckCircle className="h-3 w-3" /> Activa
              </span>
            </div>
            <h3 className="text-xl font-bold tracking-tight mt-3">Pase Libre Mensual</h3>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> Kraft Strength Club · Palermo
            </p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-2xl font-bold">22</span>
              <span className="text-xs text-muted-foreground">días restantes (Vence el 20 de Julio)</span>
            </div>
          </div>
          <div className="mt-auto flex gap-3 pt-4">
            <Button size="sm" className="rounded-xl flex-1 gap-2" onClick={() => setQrOpen(true)}>
              <QrCode className="h-4 w-4" /> Mostrar QR
            </Button>
            <Button size="sm" variant="outline" className="rounded-xl flex-1">Renovar</Button>
          </div>
        </div>

        {/* Next Class Cards */}
        <div className="space-y-4">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Reservas para hoy</span>
          {reservations.map((res) => (
            <div key={res.id} className="rounded-3xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between border-primary/20">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">Próxima Clase</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                    <Sparkles className="h-3 w-3" /> Hoy
                  </span>
                </div>
                <h3 className="text-lg font-bold tracking-tight mt-2">{res.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Instructor: {res.instructor} · 60 min</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-foreground font-semibold">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" /> {res.timeLabel}
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="rounded-xl flex-1 text-rose-500 hover:bg-rose-500/10 hover:text-rose-500 text-xs"
                  onClick={() => {
                    if (res.cannotCancel) {
                      setBlockedCancellationClass(res);
                    } else {
                      alert(`Tu reserva para "${res.name}" a las ${res.time} hs ha sido cancelada con éxito.`);
                      setReservations(prev => prev.filter(r => r.id !== res.id));
                    }
                  }}
                >
                  Cancelar Reserva
                </Button>
                <Button size="sm" variant="outline" className="rounded-xl flex-1 text-xs">Ubicación</Button>
              </div>
            </div>
          ))}
          {reservations.length === 0 && (
            <div className="rounded-3xl border border-dashed border-border p-6 shadow-sm text-center flex flex-col items-center justify-center py-8">
              <Calendar className="h-6 w-6 text-muted-foreground mb-1" />
              <p className="text-xs font-bold text-foreground">No tienes clases reservadas para hoy</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Alert Banner */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-amber-500 text-xs">
        <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
        <div>
          <span className="font-semibold">Recomendación médica:</span> Tu ficha tiene agendada una molestia de rodilla izquierda. Recuerda avisar a tu coach antes del inicio del WOD para adaptar los movimientos de carga.
        </div>
      </div>
    </div>
  );
}

// Subcomponent: Clases Tab
function ClasesTab() {
  const [filter, setFilter] = useState("Todos");
  const disciplines = ["Todos", "CrossFit", "Yoga", "Funcional", "Pilates"];

  const classes = [
    { name: "CrossFit WOD", instructor: "Mateo", time: "08:00 hs", slots: "10 cupos", status: "available" },
    { name: "Yoga Ashtanga", instructor: "Valeria", time: "09:30 hs", slots: "Últimos 2 cupos", status: "urgent" },
    { name: "Entrenamiento Funcional", instructor: "Daniel", time: "18:00 hs", slots: "Completo", status: "full" },
    { name: "CrossFit WOD", instructor: "Mateo", time: "19:00 hs", slots: "Reservado", status: "booked" },
    { name: "Pilates Reformer", instructor: "Sofía", time: "20:00 hs", slots: "5 cupos", status: "available" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Reserva de Clases</h2>
        <p className="text-sm text-muted-foreground">Calendario semanal de actividades.</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {disciplines.map((d) => (
          <button
            key={d}
            onClick={() => setFilter(d)}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${
              filter === d 
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Class List */}
      <div className="rounded-2xl border border-border overflow-hidden">
        <div className="bg-muted px-4 py-3 text-xs font-bold text-muted-foreground border-b border-border">
          Clases para hoy
        </div>
        <ul className="divide-y divide-border">
          {classes.map((c, i) => (
            <li key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
              <div>
                <div className="text-sm font-semibold">{c.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{c.instructor} · {c.time}</div>
              </div>
              <div className="flex items-center gap-4 justify-between sm:justify-start">
                <span className={`text-xs font-medium ${
                  c.status === "urgent" ? "text-amber-500" :
                  c.status === "booked" ? "text-emerald-500" :
                  c.status === "full" ? "text-muted-foreground" : "text-muted-foreground"
                }`}>
                  {c.slots}
                </span>

                <Button 
                  size="sm" 
                  variant={c.status === "booked" ? "outline" : c.status === "full" ? "secondary" : "default"}
                  disabled={c.status === "full"}
                  className="rounded-full min-w-[90px]"
                >
                  {c.status === "booked" ? "Ver Detalles" : c.status === "full" ? "Completo" : "Reservar"}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Subcomponent: Progreso Tab
function ProgresoTab() {
  const chartData = [
    { month: "Ene", visits: 12 },
    { month: "Feb", visits: 15 },
    { month: "Mar", visits: 18 },
    { month: "Abr", visits: 20 },
    { month: "May", visits: 22 },
    { month: "Jun", visits: 19 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Mi Progreso</h2>
        <p className="text-sm text-muted-foreground">Tu historial de constancia física.</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-4 text-center">
          <div className="text-xs font-semibold text-muted-foreground uppercase">Este Mes</div>
          <div className="text-2xl font-bold text-foreground mt-2">18</div>
          <div className="text-[10px] text-muted-foreground mt-1">clases completadas</div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 text-center">
          <div className="text-xs font-semibold text-muted-foreground uppercase">Racha</div>
          <div className="text-2xl font-bold text-foreground mt-2">5</div>
          <div className="text-[10px] text-muted-foreground mt-1">semanas consecutivas</div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 text-center">
          <div className="text-xs font-semibold text-muted-foreground uppercase">Favorita</div>
          <div className="text-sm font-bold text-foreground truncate mt-2.5">CrossFit</div>
          <div className="text-[10px] text-muted-foreground mt-1">82% de asistencias</div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-sm font-bold text-muted-foreground mb-6 uppercase tracking-wider">Asistencias Mensuales</h3>
        <div className="flex items-end justify-between h-48 px-4">
          {chartData.map((d) => {
            const heightPercentage = `${(d.visits / 25) * 100}%`;
            return (
              <div key={d.month} className="flex flex-col items-center gap-2 h-full justify-end flex-1">
                <span className="text-[11px] font-bold text-foreground">{d.visits}</span>
                <div 
                  className="w-8 bg-foreground rounded-t-lg transition-all duration-500 hover:opacity-80"
                  style={{ height: heightPercentage }}
                />
                <span className="text-xs text-muted-foreground">{d.month}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Subcomponent: Pagos Tab
function PagosTab() {
  const invoices = [
    { date: "20-Jun-2026", concept: "Pase Mensual - Kraft Club", amount: "$18.900", method: "Tarjeta (Visa)", status: "Pagado" },
    { date: "20-May-2026", concept: "Pase Mensual - Kraft Club", amount: "$18.900", method: "Tarjeta (Visa)", status: "Pagado" },
    { date: "20-Abr-2026", concept: "Pase Mensual - Kraft Club", amount: "$18.900", method: "Tarjeta (Visa)", status: "Pagado" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Suscripción y Pagos</h2>
        <p className="text-sm text-muted-foreground">Tus recibos e información financiera.</p>
      </div>

      <div className="rounded-2xl border border-border bg-secondary/50 p-6">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase">Plan contratado</h3>
        <div className="flex justify-between items-end mt-2">
          <div>
            <h4 className="text-lg font-bold">Pase Libre Mensual</h4>
            <p className="text-sm text-muted-foreground mt-0.5">Acceso a todas las clases y sala de musculación.</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-extrabold text-foreground">$18.900</span>
            <span className="text-xs text-muted-foreground block">facturado por mes</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted text-xs font-bold text-muted-foreground border-b border-border">
            <tr>
              <th className="p-4">Fecha</th>
              <th className="p-4">Concepto</th>
              <th className="p-4">Monto</th>
              <th className="p-4">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {invoices.map((inv, idx) => (
              <tr key={idx} className="hover:bg-secondary/25 transition">
                <td className="p-4 font-medium">{inv.date}</td>
                <td className="p-4 text-muted-foreground">{inv.concept}</td>
                <td className="p-4 text-foreground font-semibold">{inv.amount}</td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    {inv.status}
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

// Subcomponent: Config Tab
function ConfigTab() {
  const [photo, setPhoto] = useState("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80");
  const [whatsapp, setWhatsapp] = useState(true);
  const [emailAlert, setEmailAlert] = useState(true);

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configuración</h2>
        <p className="text-sm text-muted-foreground">Preferencias y datos personales.</p>
      </div>

      <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
        <h3 className="text-sm font-bold text-muted-foreground uppercase mb-4">Datos Personales</h3>
        
        <div className="flex items-center gap-4">
          <img src={photo} alt="Perfil" className="h-16 w-16 rounded-full object-cover border border-border" />
          <Button size="sm" variant="outline" className="rounded-xl">Cambiar foto</Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 mt-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Teléfono</label>
            <input type="text" className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" defaultValue="+54 9 11 3242-1241" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Email</label>
            <input type="email" className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" defaultValue="agustin.gomez@email.com" />
          </div>
        </div>
        <Button size="sm" className="rounded-xl mt-2">Guardar cambios</Button>
      </div>

      <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
        <h3 className="text-sm font-bold text-muted-foreground uppercase mb-4">Notificaciones</h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Recordatorios por WhatsApp</div>
              <div className="text-xs text-muted-foreground">Recibe avisos automáticos 2 horas antes de tu clase.</div>
            </div>
            <input 
              type="checkbox" 
              checked={whatsapp} 
              onChange={() => setWhatsapp(!whatsapp)} 
              className="h-5 w-10 accent-foreground rounded-full cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-between border-t border-border/60 pt-3">
            <div>
              <div className="text-sm font-semibold">Emails de Confirmación</div>
              <div className="text-xs text-muted-foreground">Confirmaciones de reservas y facturas digitales en tu casilla de correo.</div>
            </div>
            <input 
              type="checkbox" 
              checked={emailAlert} 
              onChange={() => setEmailAlert(!emailAlert)} 
              className="h-5 w-10 accent-foreground rounded-full cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
