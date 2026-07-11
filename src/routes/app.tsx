import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import { 
  User, Calendar, BarChart3, CreditCard, Settings, 
  LogOut, QrCode, CheckCircle, Clock, AlertTriangle, 
  MapPin, ChevronRight, ChevronLeft, X, Sparkles, Shield, AlertCircle, ShieldAlert, Star,
  Flame, Coffee, Droplet, TrendingUp, Info, Edit,
  Camera, Dumbbell, Activity, Plus, Check, Loader2,
  Play, Pause, RotateCcw, Search, ChevronUp, ChevronDown, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine 
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export const Route = createFileRoute("/app")({
  component: StudentDashboard,
});

const TABS = [
  { id: "inicio", label: "Inicio", icon: User },
  { id: "diario", label: "AI Coach", icon: Sparkles },
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

  // REVIEWS LATEST USER REQUEST STATE
  const [showReviewPrompt, setShowReviewPrompt] = useState(true);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [ratingCleanliness, setRatingCleanliness] = useState(5);
  const [ratingEquipment, setRatingEquipment] = useState(5);
  const [ratingStaff, setRatingStaff] = useState(5);
  const [ratingPrice, setRatingPrice] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

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
            showReviewPrompt={showReviewPrompt}
            setReviewModalOpen={setReviewModalOpen}
          />
        )}
        {activeTab === "diario" && <DiarioTab />}
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
          <div className="relative bg-card border border-border w-full max-w-[360px] rounded-3xl p-8  text-center">
            <button 
              onClick={() => setQrOpen(false)}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-secondary transition"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold tracking-tight">QR de Ingreso</h3>
            <p className="text-xs text-muted-foreground mt-1">Escanea este código en la entrada</p>

            {/* Simulated QR Code Visual */}
            <div className="mx-auto my-6 p-4 bg-white rounded-2xl w-48 h-48 flex flex-col items-center justify-center relative border border-border -inner">
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
          <div className="relative bg-card border border-border w-full max-w-[420px] rounded-3xl p-6  flex flex-col text-center items-center">
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

      {/* Immersive Verified Review Form Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-fade-in text-foreground">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              alert("¡Gracias por tu opinión! Tu reseña ha sido verificada con tus check-ins de asistencia por QR y fue publicada exitosamente.");
              setShowReviewPrompt(false);
              setReviewModalOpen(false);
            }}
            className="relative bg-card border border-border w-full max-w-[450px] rounded-3xl p-6  flex flex-col"
          >
            <button 
              type="button"
              onClick={() => setReviewModalOpen(false)}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-secondary transition z-10"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center mb-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold tracking-tight">Califica tu Centro</h3>
              <p className="text-xs text-muted-foreground">Miembro Verificado: Agustín Gómez</p>
            </div>

            <div className="space-y-4">
              {/* Category Sliders / Star Pickers */}
              {[
                { label: "Limpieza", value: ratingCleanliness, setter: setRatingCleanliness },
                { label: "Equipamiento", value: ratingEquipment, setter: setRatingEquipment },
                { label: "Atención del Staff", value: ratingStaff, setter: setRatingStaff },
                { label: "Relación Calidad/Precio", value: ratingPrice, setter: setRatingPrice }
              ].map((cat) => (
                <div key={cat.label} className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">{cat.label}</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => cat.setter(star)}
                        className="p-0.5 hover:scale-110 transition"
                      >
                        <Star className={`h-4.5 w-4.5 ${star <= cat.value ? "fill-amber-500 text-amber-500" : "text-zinc-300 dark:text-zinc-700"}`} />
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Textarea for comments */}
              <div className="space-y-1.5 mt-2">
                <label className="text-xs font-semibold text-muted-foreground">Escribe tu opinión</label>
                <textarea
                  required
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Cuéntale a otros qué tal tu experiencia con los coaches, la limpieza del lugar, etc..."
                  className="flex w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </div>

            <Button type="submit" className="rounded-xl mt-6">
              Enviar Reseña Verificada
            </Button>
          </form>
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
  showReviewPrompt: boolean;
  setReviewModalOpen: (v: boolean) => void;
}

function InicioTab({ setQrOpen, reservations, setReservations, setBlockedCancellationClass, showReviewPrompt, setReviewModalOpen }: InicioTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">¡Hola, Agustín! 👋</h2>
        <p className="text-sm text-muted-foreground">Tu entrenamiento de hoy te espera.</p>
      </div>

      {/* Member State Card */}
      <div className="grid gap-6 md:grid-cols-2 items-start">
        <div className="rounded-3xl border border-border bg-card p-6  flex flex-col justify-between h-[230px]">
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
            <div key={res.id} className="rounded-3xl border border-border bg-card p-6  flex flex-col justify-between border-primary/20">
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
            <div className="rounded-3xl border border-dashed border-border p-6  text-center flex flex-col items-center justify-center py-8">
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

      {/* Verified Review Trigger Card */}
      {showReviewPrompt && (
        <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6  flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
              <Sparkles className="h-3 w-3" /> Reseña Verificada (Estilo Airbnb)
            </span>
            <h4 className="font-bold text-sm text-foreground">¿Te gusta entrenar en Kraft Strength Club?</h4>
            <p className="text-xs text-muted-foreground">Como miembro activo con check-ins de asistencia registrados, tu opinión ayuda a la comunidad.</p>
          </div>
          <Button 
            size="sm" 
            className="rounded-xl shrink-0"
            onClick={() => setReviewModalOpen(true)}
          >
            Calificar Experiencia
          </Button>
        </div>
      )}
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

      <div className="rounded-2xl border border-border bg-card p-6 ">
        <h3 className="text-sm font-bold text-muted-foreground mb-6 uppercase tracking-wider">Asistencias Conversión</h3>
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

// Subcomponent: Workout Generator Modal
const muscleImages = [
  { id: "pecho", name: "Pecho", img: "/gimnasia.png" },
  { id: "espalda", name: "Espalda", img: "/atras (4).png" },
  { id: "espalda-baja", name: "Espalda Baja", img: "/atras (3).png" },
  { id: "hombros", name: "Hombros", img: "/hombro (2).png" },
  { id: "biceps", name: "Bíceps", img: "/biceps.png" },
  { id: "triceps", name: "Tríceps", img: "/musculos (4).png" },
  { id: "abdominales", name: "Abdominales", img: "/culturismo.png" },
  { id: "cuadriceps", name: "Cuádriceps", img: "/capacitacion.png" },
  { id: "isquiotibiales", name: "Isquiotibiales", img: "/atras (1).png" },
  { id: "gluteos", name: "Glúteos", img: "/atras (5).png" },
  { id: "gemelos", name: "Gemelos", img: "/atras (6).png" } // Añadí gemelos para completar la pierna
];

function WorkoutGeneratorModal({ 
  onClose, 
  onGenerate,
  muscleRecovery
}: { 
  onClose: () => void, 
  onGenerate: () => void,
  muscleRecovery?: Record<string, number>
}) {
  const [view, setView] = useState<"main" | "muscles" | "equipment">("main");
  const [location, setLocation] = useState("Gimnasio");
  const [selectedGym, setSelectedGym] = useState("Kraft Strength Club");
  const [time, setTime] = useState("40 min");
  const [muscles, setMuscles] = useState<string[]>(() => 
    muscleImages.filter(m => !muscleRecovery || (muscleRecovery[m.id] ?? 100) >= 70).map(m => m.id)
  );
  const [intensity, setIntensity] = useState("Moderada");
  const [supersets, setSupersets] = useState(false);
  const [cardio, setCardio] = useState<string[]>([]);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [injuries, setInjuries] = useState<string[]>(["Ninguna"]);
  const [environment, setEnvironment] = useState<string[]>([]);

  const toggleMuscle = (muscleId: string) => {
    if (muscleRecovery && (muscleRecovery[muscleId] ?? 100) < 70) return;
    let next = [...muscles];
    if (next.includes(muscleId)) {
      next = next.filter(m => m !== muscleId);
    } else {
      next.push(muscleId);
    }
    setMuscles(next);
  };

  const toggleInjury = (item: string) => {
    let next = [...injuries];
    if (item === "Ninguna") {
      next = ["Ninguna"];
    } else {
      next = next.filter(x => x !== "Ninguna");
      if (next.includes(item)) {
        next = next.filter(x => x !== item);
      } else {
        next.push(item);
      }
      if (next.length === 0) {
        next = ["Ninguna"];
      }
    }
    setInjuries(next);
  };

  const toggleMulti = (item: string, state: string[], setState: any) => {
    if (state.includes(item)) {
      setState(state.filter((i: string) => i !== item));
    } else {
      setState([...state, item]);
    }
  };

  const renderChips = (options: string[], state: any, setState: any, isMulti: boolean = false) => {
    return (
      <div className="flex flex-wrap gap-1.5 mt-3">
        {options.map(opt => {
          const isActive = isMulti ? state.includes(opt) : state === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => isMulti ? toggleMulti(opt, state, setState) : setState(opt)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition duration-300 ${
                isActive 
                  ? "border-foreground bg-foreground text-background shadow-sm" 
                  : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    );
  };

  const renderEquipmentGrid = (options: string[], state: string[], setState: any) => {
    const defaultImages = [
      "/cable-crossover.png",
      "/lat-pulldown.png",
      "/prone-leg-curl.png",
      "/seated-leg-curl.png",
      "/seated-hamstring-curl.png",
    ];

    return (
      <div className="flex flex-col gap-2 mt-3">
        {options.map((opt, i) => {
          const isActive = state.includes(opt);
          const imgIndex = (opt.length + i) % defaultImages.length;
          const bgImg = defaultImages[imgIndex];
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggleMulti(opt, state, setState)}
              className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all duration-300 ${
                isActive 
                  ? "bg-foreground/[0.03] border-foreground shadow-sm ring-1 ring-foreground" 
                  : "bg-card border-border hover:border-foreground/30 hover:bg-secondary/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-border shrink-0 bg-background">
                  <img src={bgImg} alt={opt} className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-bold text-foreground text-left leading-tight">
                  {opt}
                </span>
              </div>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                isActive ? "bg-foreground border-foreground text-background" : "border-border text-transparent"
              }`}>
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-background overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-300">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center gap-3">
          {view !== "main" && (
            <button onClick={() => setView("main")} className="w-10 h-10 -ml-2 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-border transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h2 className="text-xl font-black text-foreground tracking-tight">
              {view === "main" ? "Generar Workout" : view === "muscles" ? "Músculos Objetivo" : "Equipamiento"}
            </h2>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
              {view === "main" ? "Configuración de IA" : "Selección Múltiple"}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-border transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-6 pb-32">
        <div className="max-w-2xl mx-auto space-y-10">
          
          {view === "main" && (
            <>
              {/* Ubicación */}
              <section className="space-y-3.5">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" /> Ubicación
                  </h3>
                  {renderChips(["Casa", "Gimnasio"], location, setLocation, false)}
                </div>

                {location === "Gimnasio" && (
                  <div className="pl-4 border-l-2 border-border/80 mt-2 space-y-1.5 animate-in slide-in-from-left-2 duration-300">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                      Seleccionar Club (Membresía Activa)
                    </label>
                    {renderChips(["Kraft Strength Club"], selectedGym, setSelectedGym, false)}
                  </div>
                )}
              </section>

              {/* Tiempo */}
              <section>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" /> Tiempo
                </h3>
                {renderChips(["20 min", "30 min", "40 min", "50 min", "60 min", "80 min"], time, setTime, false)}
              </section>

              {/* Músculos objetivo (Summary) */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Dumbbell className="w-4 h-4 text-muted-foreground" /> Músculos objetivo
                  </h3>
                </div>
                <button 
                  onClick={() => setView("muscles")} 
                  className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-foreground/30 transition-colors"
                >
                  <div className="text-left">
                    <span className="block text-sm font-bold text-foreground">
                      Músculos objetivo
                    </span>
                    <span className="block text-xs text-muted-foreground mt-0.5">
                      {(() => {
                        const upperBodyMuscles = ["pecho", "espalda", "espalda-baja", "hombros", "biceps", "triceps", "abdominales"];
                        const lowerBodyMuscles = ["cuadriceps", "isquiotibiales", "gluteos", "gemelos"];
                        
                        if (muscles.length === muscleImages.length) return "Cuerpo completo";
                        if (muscles.length === upperBodyMuscles.length && muscles.every(m => upperBodyMuscles.includes(m))) return "Tren superior";
                        if (muscles.length === lowerBodyMuscles.length && muscles.every(m => lowerBodyMuscles.includes(m))) return "Tren inferior";
                        return `${muscles.length} ${muscles.length === 1 ? "seleccionado" : "seleccionados"}`;
                      })()}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              </section>

              {/* Intensidad */}
              <section>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Flame className="w-4 h-4 text-muted-foreground" /> Intensidad
                </h3>
                {renderChips(["Baja", "Moderada", "Alta"], intensity, setIntensity, false)}
              </section>

              {/* Equipo (Summary) */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Settings className="w-4 h-4 text-muted-foreground" /> Equipamiento
                  </h3>
                </div>
                <button 
                  onClick={() => setView("equipment")} 
                  className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-foreground/30 transition-colors"
                >
                  <div className="text-left">
                    <span className="block text-sm font-bold text-foreground">
                      Equipamiento
                    </span>
                    <span className="block text-xs text-muted-foreground mt-0.5">
                      {equipment.length + cardio.length} seleccionados
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              </section>

              {/* Superseries Toggle */}
              <section className="bg-card border border-border rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Superseries</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 font-medium">Combinar ejercicios sin descanso.</p>
                  </div>
                  <button 
                    onClick={() => setSupersets(!supersets)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 shrink-0 ${supersets ? "bg-foreground" : "bg-secondary border border-border"}`}
                  >
                    <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-background shadow-sm transition-transform duration-300 ${supersets ? "left-7" : "left-1"}`} />
                  </button>
                </div>
              </section>

              {/* Lesiones */}
              <section>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-muted-foreground" /> Lesiones / Restricciones
                </h3>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {["Ninguna", "Molestia en rodillas", "Molestia en hombros", "Dolor lumbar"].map(opt => {
                    const isActive = injuries.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleInjury(opt)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition duration-300 ${
                          isActive 
                            ? "border-foreground bg-foreground text-background shadow-sm" 
                            : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Entorno y Condiciones */}
              <section>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Info className="w-4 h-4 text-muted-foreground" /> Condiciones y Entorno
                  </h3>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">Opcional</span>
                </div>
                {renderChips(["No tengo espacio", "No puedo correr", "Necesito entrenar sin hacer mucho ruido"], environment, setEnvironment, true)}
              </section>
            </>
          )}

          {view === "muscles" && (() => {
            const upperBodyMuscles = ["pecho", "espalda", "espalda-baja", "hombros", "biceps", "triceps", "abdominales"];
            const lowerBodyMuscles = ["cuadriceps", "isquiotibiales", "gluteos", "gemelos"];
            
            // Check counts filtering out fatigued muscles (under 70% recovery)
            const availableMuscles = muscleImages.filter(m => !muscleRecovery || (muscleRecovery[m.id] ?? 100) >= 70);
            const availableUpper = upperBodyMuscles.filter(id => !muscleRecovery || (muscleRecovery[id] ?? 100) >= 70);
            const availableLower = lowerBodyMuscles.filter(id => !muscleRecovery || (muscleRecovery[id] ?? 100) >= 70);

            const isCuerpoCompleto = muscles.length === availableMuscles.length && muscles.every(m => availableMuscles.map(x => x.id).includes(m));
            const isTrenSuperior = muscles.length === availableUpper.length && muscles.every(m => availableUpper.includes(m));
            const isTrenInferior = muscles.length === availableLower.length && muscles.every(m => availableLower.includes(m));

            return (
              <section className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                {/* Fatigued Warning */}
                {muscleImages.some(m => (muscleRecovery?.[m.id] ?? 100) < 70) && (
                  <div className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-3 flex gap-2.5 items-start text-[11px] text-muted-foreground leading-snug">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>
                      Algunos grupos musculares se han desactivado porque su nivel de recuperación actual es menor al 70%.
                    </span>
                  </div>
                )}

                {/* Accesos Rápidos Presets */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                    Accesos Rápidos
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setMuscles(availableMuscles.map(m => m.id))}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition duration-300 ${
                        isCuerpoCompleto
                          ? "border-foreground bg-foreground text-background shadow-sm"
                          : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                      }`}
                    >
                      Cuerpo completo
                    </button>
                    <button
                      type="button"
                      onClick={() => setMuscles(availableUpper)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition duration-300 ${
                        isTrenSuperior
                          ? "border-foreground bg-foreground text-background shadow-sm"
                          : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                      }`}
                    >
                      Tren superior
                    </button>
                    <button
                      type="button"
                      onClick={() => setMuscles(availableLower)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition duration-300 ${
                        isTrenInferior
                          ? "border-foreground bg-foreground text-background shadow-sm"
                          : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                      }`}
                    >
                      Tren inferior
                    </button>
                  </div>
                </div>

                {/* Grid de Músculos */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {muscleImages.map(m => {
                    const isActive = muscles.includes(m.id);
                    const isFatigued = muscleRecovery && (muscleRecovery[m.id] ?? 100) < 70;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        disabled={isFatigued}
                        onClick={() => toggleMuscle(m.id)}
                        className={`relative aspect-square flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                          isFatigued
                            ? "opacity-40 cursor-not-allowed bg-secondary/40 border-dashed border-border"
                            : isActive 
                              ? "bg-foreground/5 border-foreground shadow-sm ring-1 ring-foreground" 
                              : "bg-card border-border hover:border-foreground/30"
                        }`}
                      >
                        {isFatigued && (
                          <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500" title="Fatigado" />
                        )}
                        <img src={m.img} alt={m.name} className={`w-10 h-10 object-contain transition-all ${isActive && !isFatigued ? "" : "opacity-40 grayscale"}`} />
                        <span className={`text-[9px] font-bold mt-2 truncate w-full text-center ${isFatigued ? "text-rose-500/80" : isActive ? "text-foreground" : "text-muted-foreground"}`}>
                          {m.name}
                        </span>
                        {isFatigued && (
                          <span className="text-[7px] font-black uppercase text-rose-500 tracking-wider absolute bottom-1.5">
                            {muscleRecovery[m.id]}%
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })()}

          {view === "equipment" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-10">
              <section>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Activity className="w-4 h-4 text-muted-foreground" /> Entrenamiento Cardiovascular
                  </h3>
                </div>
                {renderEquipmentGrid(["Bicicleta de asalto", "Bicicleta estática", "Cinta de correr", "Elíptica", "Escalador", "Máquina de remo"], cardio, setCardio)}
              </section>

              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Settings className="w-4 h-4 text-muted-foreground" /> Equipo Disponible
                  </h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Pesas Libres</h4>
                    {renderEquipmentGrid(["Barra", "Barra EZ", "Barra hexagonal", "Disco", "Mancuernas", "Pesas rusas", "Pivote de barra"], equipment, setEquipment)}
                  </div>
                  
                  <div>
                    <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Máquinas de Cable</h4>
                    {renderEquipmentGrid(["Máquina de cable cruzado", "Máquina de jalón dorsal", "Máquina de poleas"], equipment, setEquipment)}
                  </div>

                  <div>
                    <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Máquina de Pesas</h4>
                    {renderEquipmentGrid(["Curl de piernas", "Curl de piernas sentado", "Extensión de pierna", "Máquina smith", "Máquina de abducción de cadera", "Máquina de aducción de cadera", "Máquina de aperturas", "Máquina de bíceps", "Máquina de crunch abdominal", "Máquina de deltoides", "Máquina de fondos para tríceps", "Máquina de press de hombros", "Máquina de remo sentado", "Prensa de pecho", "Prensa de piernas", "Prensa de piernas 45°", "Remo T"], equipment, setEquipment)}
                  </div>

                  <div>
                    <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Barras y Bancos</h4>
                    {renderEquipmentGrid(["Banco plano", "Banco de abdominales", "Banco de curls", "Banco inclinado", "Barra de dominadas", "Rack"], equipment, setEquipment)}
                  </div>

                  <div>
                    <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Bandas y Otros</h4>
                    {renderEquipmentGrid(["Banda de resistencia", "Banda elástica", "Esfera", "Esfera de estabilidad", "Caja pliométrica", "Colchoneta de yoga", "Cuerda para saltar", "Rodillo", "Rueda abdominal"], equipment, setEquipment)}
                  </div>
                </div>
              </section>
            </div>
          )}

        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-background/90 backdrop-blur-xl border-t border-border z-20">
        <div className="max-w-2xl mx-auto flex flex-col md:flex-row gap-3">
          {view === "main" ? (
            <>
              <Button 
                onClick={onGenerate} 
                className="h-12 w-full md:flex-1 order-1 md:order-2 rounded-xl bg-foreground text-background font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                Generar Workout con IA
              </Button>
              <Button 
                onClick={onClose} 
                variant="outline" 
                className="h-12 w-full md:w-auto order-2 md:order-1 px-6 rounded-xl font-bold border-border bg-card hover:bg-secondary text-xs transition-colors"
              >
                Cancelar
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => setView("main")} 
              className="h-12 w-full rounded-xl bg-foreground text-background font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              Confirmar Selección
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Subcomponent: Exercise Detail Modal
function ExerciseDetailModal({ exercise, onClose }: { exercise: any, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-background/95 backdrop-blur-2xl animate-in fade-in duration-250">
      <div className="w-full max-w-md bg-card border border-border rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden max-h-[85vh]">
        {/* Header */}
        <div className="px-6 pt-8 pb-4 flex justify-between items-start bg-card">
          <div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest block mb-0.5">Ejecución del Ejercicio</span>
            <h2 className="text-xl font-black text-foreground tracking-tight">{exercise.name}</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Video / Loop Animation Screen */}
        <div className="relative aspect-square sm:aspect-[4/5] bg-black border-y border-border overflow-hidden group">
          {exercise.video?.endsWith('.mp4') ? (
            <video 
              src={exercise.video} 
              className="w-full h-full object-contain bg-black"
              autoPlay 
              loop 
              muted 
              playsInline
            />
          ) : (
            <>
              <img 
                src={exercise.video} 
                alt={exercise.name} 
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-black/45 flex items-center justify-center group-hover:bg-black/25 transition-colors cursor-pointer">
                <div className="w-14 h-14 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 active:scale-95">
                  <svg className="w-5 h-5 fill-current translate-x-0.5" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </>
          )}
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-background uppercase tracking-wider">
            Demostración de Video
          </div>
        </div>

        {/* Details Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Músculos Involucrados */}
          <div>
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Músculos Principales</h4>
            <p className="text-xs font-bold text-foreground bg-secondary px-3 py-1.5 rounded-lg border border-border inline-block uppercase tracking-wide">
              {exercise.muscles}
            </p>
          </div>

          {/* Instrucciones */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Paso a Paso</h4>
            <ol className="space-y-2.5">
              {exercise.instructions.map((step: string, idx: number) => (
                <li key={idx} className="flex gap-3 text-sm text-foreground/90 font-medium">
                  <span className="w-5 h-5 rounded-full bg-secondary border border-border flex items-center justify-center text-[10px] font-black text-foreground shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Tips del Coach */}
          {exercise.tips && (
            <div className="p-4 rounded-2xl bg-secondary/35 border border-border flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-foreground mb-1">Consejo del Coach</h5>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                  {exercise.tips}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Subcomponent: Workout Library Modal
function WorkoutLibraryModal({ 
  onClose, 
  customWorkouts, 
  onStartWorkout, 
  onEditWorkout, 
  onDeleteWorkout,
  onCreateNew
}: { 
  onClose: () => void; 
  customWorkouts: any[]; 
  onStartWorkout: (workout: any) => void;
  onEditWorkout: (workout: any) => void;
  onDeleteWorkout: (id: string) => void;
  onCreateNew: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background animate-in fade-in duration-200">
      <div className="w-full max-w-xl mx-auto flex-1 flex flex-col overflow-hidden h-full">
        {/* Header */}
        <div className="px-6 pt-8 pb-4 flex justify-between items-start bg-card">
          <div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest block mb-0.5">Mis Rutinas</span>
            <h2 className="text-xl font-black text-foreground tracking-tight">Biblioteca de Workouts</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {customWorkouts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Dumbbell className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-semibold">No tienes workouts creados.</p>
              <p className="text-xs mt-1">Crea tu primera rutina personalizada abajo.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {customWorkouts.map((w) => (
                <div key={w.id} className="p-4 bg-secondary/30 border border-border rounded-2xl flex items-center justify-between gap-4 hover:border-foreground/25 transition-all">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{w.name}</h3>
                    <p className="text-[10px] font-bold text-muted-foreground mt-0.5 uppercase tracking-wider">
                      {w.exercises.length} ejercicios • {w.duration}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => onStartWorkout(w)}
                      className="w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                      title="Iniciar Workout"
                    >
                      <Play className="w-4 h-4 fill-current translate-x-0.5" />
                    </button>
                    <button 
                      onClick={() => onEditWorkout(w)}
                      className="w-9 h-9 rounded-full bg-card border border-border text-foreground flex items-center justify-center hover:bg-secondary transition-colors"
                      title="Editar"
                    >
                      <Settings className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button 
                      onClick={() => onDeleteWorkout(w.id)}
                      className="w-9 h-9 rounded-full bg-card border border-border text-rose-500 flex items-center justify-center hover:bg-rose-500/10 transition-colors"
                      title="Eliminar"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-card/50">
          <Button 
            onClick={onCreateNew} 
            className="w-full h-12 rounded-xl bg-foreground text-background font-bold text-sm hover:opacity-90 transition-opacity"
          >
            Crear Nuevo Workout
          </Button>
        </div>
      </div>
    </div>
  );
}

// Subcomponent: Manual Workout Creator Modal
function ManualWorkoutCreatorModal({
  onClose,
  onSave,
  workoutToEdit
}: {
  onClose: () => void;
  onSave: (workout: any) => void;
  workoutToEdit?: any | null;
}) {
  const [name, setName] = useState(workoutToEdit?.name || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  const availableExercises = [
    { id: 1, name: "Dominadas en Barra", rest: 90, img: "/pull-up.png", muscles: "Espalda" },
    { id: 2, name: "Cable Crossover", rest: 60, img: "/cable-crossover.png", muscles: "Pecho" },
    { id: 3, name: "Jalón Dorsal", rest: 60, img: "/lat-pulldown.png", muscles: "Espalda" },
    { id: 4, name: "Camilla de Femorales Tumbado", rest: 60, img: "/prone-leg-curl.png", muscles: "Isquiotibiales" },
    { id: 5, name: "Sillón de Flexión de Piernas", rest: 60, img: "/seated-leg-curl.png", muscles: "Isquiotibiales" },
    { id: 6, name: "Camilla de Isquiotibiales Sentado", rest: 60, img: "/seated-hamstring-curl.png", muscles: "Isquiotibiales" }
  ];

  const [selectedIds, setSelectedIds] = useState<number[]>(
    workoutToEdit?.exercises.map((e: any) => e.id) || []
  );

  // Per-exercise specs: reps/time, weight, and rest
  const [exerciseParams, setExerciseParams] = useState<Record<number, { type: "reps" | "secs"; value: number; weight: string; rest: number }>>(() => {
    const initial: Record<number, { type: "reps" | "secs"; value: number; weight: string; rest: number }> = {};
    if (workoutToEdit) {
      workoutToEdit.exercises.forEach((ex: any) => {
        const isReps = ex.reps?.endsWith("x");
        const numVal = parseInt(ex.reps) || 12;
        const wt = ex.weight === "Peso corporal" ? "" : ex.weight?.replace("kg", "") || "";
        initial[ex.id] = {
          type: isReps ? "reps" : "secs",
          value: numVal,
          weight: wt,
          rest: ex.rest ?? 60
        };
      });
    }
    return initial;
  });

  const toggleExercise = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
      if (!exerciseParams[id]) {
        const ex = availableExercises.find(x => x.id === id);
        setExerciseParams(prev => ({
          ...prev,
          [id]: { type: "reps", value: 12, weight: "", rest: ex?.rest || 60 }
        }));
      }
    }
  };

  const removeExercise = (id: number) => {
    setSelectedIds(selectedIds.filter(x => x !== id));
  };

  const moveExercise = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === selectedIds.length - 1) return;
    
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    const newIds = [...selectedIds];
    const temp = newIds[index];
    newIds[index] = newIds[nextIndex];
    newIds[nextIndex] = temp;
    setSelectedIds(newIds);
  };

  const updateParam = (id: number, field: string, val: any) => {
    setExerciseParams(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: val
      }
    }));
  };

  // Calculate total workout duration
  const calculateTotalDuration = () => {
    let totalSeconds = 0;
    selectedIds.forEach(id => {
      const ex = availableExercises.find(x => x.id === id);
      if (!ex) return;
      const params = exerciseParams[id] || { type: "reps", value: 12, weight: "", rest: 60 };
      
      // Exercise active time
      if (params.type === "reps") {
        totalSeconds += params.value * 3; // ~3 seconds per rep
      } else {
        totalSeconds += params.value; // seconds directly
      }
      
      // Rest time
      totalSeconds += params.rest || 0;
    });
    
    const minutes = Math.max(1, Math.round(totalSeconds / 60));
    return `${minutes} min`;
  };

  const handleSave = () => {
    if (!name.trim()) return;
    
    const selectedExercises = selectedIds
      .map(id => availableExercises.find(ex => ex.id === id))
      .filter((ex): ex is typeof availableExercises[0] => !!ex)
      .map(ex => {
        const params = exerciseParams[ex.id] || { type: "reps", value: 12, weight: "", rest: 60 };
        const repsString = params.type === "reps" ? `${params.value}x` : `${params.value}s`;
        const weightString = params.weight.trim() ? `${params.weight}kg` : "Peso corporal";
        return {
          ...ex,
          reps: repsString,
          weight: weightString,
          rest: params.rest,
          video: ex.img,
          instructions: ["Realiza el movimiento de forma controlada."],
          tips: "Mantén una buena postura."
        };
      });

    onSave({
      id: workoutToEdit?.id || `custom-${Date.now()}`,
      name,
      duration: calculateTotalDuration(),
      exercises: selectedExercises
    });
  };

  // RENDER SEARCH MODE OR PREVIEW MODE
  if (isSearching) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-background animate-in fade-in duration-200">
        <div className="w-full max-w-xl mx-auto flex-1 flex flex-col overflow-hidden h-full">
          {/* Header */}
          <div className="px-6 pt-8 pb-4 flex justify-between items-center bg-card border-b border-border">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsSearching(false)} 
                className="p-2 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                title="Volver"
              >
                <ChevronLeft className="w-5 h-5 text-muted-foreground" />
              </button>
              <div>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest block mb-0.5">Agregar Ejercicios</span>
                <h2 className="text-sm font-bold text-foreground tracking-tight">Biblioteca</h2>
              </div>
            </div>
            <button 
              onClick={() => setIsSearching(false)} 
              className="px-4 py-2 text-xs font-bold bg-foreground text-background rounded-xl hover:opacity-95 transition-opacity"
            >
              Listo
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Buscador */}
            <div className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por ejercicio o músculo..." 
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border border-border text-sm font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 transition-colors"
              />
              <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted text-muted-foreground transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* List pool */}
            <div className="grid grid-cols-1 gap-3">
              {(() => {
                const unselected = availableExercises.filter(ex => !selectedIds.includes(ex.id));
                const filtered = unselected.filter(ex => 
                  ex.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  ex.muscles.toLowerCase().includes(searchQuery.toLowerCase())
                );
                
                if (filtered.length === 0) {
                  return (
                    <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-3xl">
                      <p className="text-xs font-semibold">No hay más ejercicios disponibles</p>
                      <p className="text-[10px] mt-0.5">
                        {searchQuery ? "Prueba buscando otra palabra" : "Has seleccionado todos los ejercicios"}
                      </p>
                    </div>
                  );
                }

                return filtered.map(ex => (
                  <div
                    key={ex.id}
                    onClick={() => toggleExercise(ex.id)}
                    className="p-3.5 rounded-3xl border border-border bg-card hover:border-foreground/10 flex items-center justify-between gap-3 cursor-pointer select-none transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl overflow-hidden border border-border shrink-0 bg-background">
                        <img src={ex.img} alt={ex.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-foreground truncate">{ex.name}</p>
                        <p className="text-[10px] font-semibold text-muted-foreground">{ex.muscles}</p>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors shrink-0">
                      <Plus className="w-4 h-4 text-foreground" />
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PREVIEW / EDIT MODE
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background animate-in fade-in duration-200">
      <div className="w-full max-w-xl mx-auto flex-1 flex flex-col overflow-hidden h-full">
        {/* Header */}
        <div className="px-6 pt-8 pb-4 flex justify-between items-start bg-card border-b border-border">
          <div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest block mb-0.5">Creador Manual</span>
            <h2 className="text-xl font-black text-foreground tracking-tight">
              {workoutToEdit ? "Editar Workout" : "Nuevo Workout"}
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Nombre */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Nombre de la Rutina</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Mi rutina de torso" 
              className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm font-semibold text-foreground focus:outline-none focus:border-foreground/30 transition-colors"
            />
          </div>

          {/* Tu rutina */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">Ejercicios de la Rutina ({selectedIds.length})</label>
              {selectedIds.length > 0 && (
                <span className="text-xs font-bold text-indigo-500 bg-indigo-500/10 px-2.5 py-1 rounded-lg">
                  Est. {calculateTotalDuration()}
                </span>
              )}
            </div>
            
            {selectedIds.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground border border-dashed border-border rounded-3xl bg-secondary/10">
                <Dumbbell className="w-8 h-8 mx-auto mb-2 opacity-25" />
                <p className="text-xs font-semibold">Rutina vacía</p>
                <p className="text-[10px] mt-0.5 mb-4">Añade ejercicios para comenzar a configurar</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3.5">
                {selectedIds.map((id, index) => {
                  const ex = availableExercises.find(x => x.id === id);
                  if (!ex) return null;
                  
                  return (
                    <div
                      key={ex.id}
                      className="p-4 rounded-3xl border border-foreground/25 bg-foreground/[0.02] shadow-sm flex flex-col transition-all animate-in fade-in duration-200"
                    >
                      {/* Top Row */}
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-border shrink-0 bg-background">
                          <img src={ex.img} alt={ex.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-foreground truncate">{ex.name}</p>
                          <p className="text-[10px] font-semibold text-muted-foreground">{ex.muscles}</p>
                        </div>
                        
                        {/* Order & Trash */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => moveExercise(index, "up")}
                            disabled={index === 0}
                            className="p-1.5 rounded-lg hover:bg-secondary disabled:opacity-30 disabled:hover:bg-transparent text-muted-foreground transition-all"
                            title="Subir"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveExercise(index, "down")}
                            disabled={index === selectedIds.length - 1}
                            className="p-1.5 rounded-lg hover:bg-secondary disabled:opacity-30 disabled:hover:bg-transparent text-muted-foreground transition-all"
                            title="Bajar"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeExercise(ex.id)}
                            className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-500 transition-colors ml-1"
                            title="Quitar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Params inputs */}
                      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 pt-3 border-t border-border/50">
                        <div>
                          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Métrica</label>
                          <select
                            value={exerciseParams[ex.id]?.type || "reps"}
                            onChange={(e) => updateParam(ex.id, "type", e.target.value as any)}
                            className="w-full text-xs font-bold px-3 py-2.5 rounded-xl bg-secondary border border-border text-foreground focus:outline-none"
                          >
                            <option value="reps">Reps</option>
                            <option value="secs">Segundos</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                            {(exerciseParams[ex.id]?.type || "reps") === "reps" ? "Reps" : "Segs"}
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={exerciseParams[ex.id]?.value ?? 12}
                            onChange={(e) => updateParam(ex.id, "value", parseInt(e.target.value) || 1)}
                            className="w-full text-xs font-bold px-3 py-2.5 rounded-xl bg-secondary border border-border text-foreground focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Peso (kg)</label>
                          <input
                            type="text"
                            placeholder="Cuerpo"
                            value={exerciseParams[ex.id]?.weight ?? ""}
                            onChange={(e) => updateParam(ex.id, "weight", e.target.value)}
                            className="w-full text-xs font-bold px-3 py-2.5 rounded-xl bg-secondary border border-border text-foreground focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Descanso (segs)</label>
                          <input
                            type="number"
                            min="0"
                            step="5"
                            value={exerciseParams[ex.id]?.rest ?? 60}
                            onChange={(e) => updateParam(ex.id, "rest", parseInt(e.target.value) || 0)}
                            className="w-full text-xs font-bold px-3 py-2.5 rounded-xl bg-secondary border border-border text-foreground focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Añadir ejercicio button */}
            <button
              type="button"
              onClick={() => setIsSearching(true)}
              className="w-full py-4 border-2 border-dashed border-border rounded-3xl text-muted-foreground hover:text-foreground hover:border-foreground/20 flex flex-col items-center justify-center gap-2 group transition-all mt-4 bg-secondary/10 hover:bg-secondary/20"
            >
              <Plus className="w-5 h-5 text-muted-foreground group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold">Añadir Ejercicio</span>
              <span className="text-[10px] text-muted-foreground font-medium">Busca en la biblioteca</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-card/50">
          <Button 
            onClick={handleSave} 
            disabled={!name.trim() || selectedIds.length === 0}
            className="w-full h-12 rounded-xl bg-foreground text-background font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Guardar Workout
          </Button>
        </div>
      </div>
    </div>
  );
}

// Subcomponent: Workout Feedback Modal
function WorkoutFeedbackModal({ 
  onClose, 
  customExercises, 
  workoutTitle,
  onComplete
}: { 
  onClose: () => void, 
  customExercises?: any[], 
  workoutTitle?: string,
  onComplete?: () => void
}) {
  const defaultExercises = [
    { 
      id: 1, 
      name: "Dominadas en Barra (Pull-ups)", 
      reps: "12x", 
      weight: "Peso corporal", 
      rest: 90, 
      img: "/pull-up.png", 
      video: "/chinupreversewidegrip_x264(2).mp4", 
      muscles: "Dorsal Ancho, Bíceps, Redondo Mayor, Trapecio",
      instructions: [
        "Sujeta la barra con las palmas hacia el frente (pronación) a un ancho ligeramente mayor al de los hombros.",
        "Mantén el core activo y los hombros hacia abajo y atrás antes de empezar.",
        "Tira de tu cuerpo hacia arriba concentrándote en llevar los codos hacia abajo, hasta que tu barbilla pase la barra.",
        "Controla la bajada lentamente hasta estirar completamente los brazos de forma segura."
      ],
      tips: "Evita balancear el cuerpo. Si te cuesta subir, usa una banda elástica de resistencia para asistir el movimiento.",
      superset: "Superserie A"
    },
    { 
      id: 2, 
      name: "Cable Crossover", 
      reps: "15x", 
      weight: "15kg", 
      rest: 60, 
      img: "/cable-crossover.png", 
      video: "/cable-crossover.png",
      muscles: "Pectoral Mayor, Deltoides Anterior",
      instructions: [
        "Coloca las poleas en una posición alta y sujeta las manijas.",
        "Da un paso al frente para crear tensión en los cables e inclina ligeramente el torso hacia adelante.",
        "Con los codos levemente flexionados, junta las manos al frente y abajo simulando dar un abrazo.",
        "Regresa lentamente sintiendo el estiramiento en el pecho."
      ],
      tips: "No uses el impulso del cuerpo. Mantén una velocidad constante durante todo el recorrido.",
      superset: "Superserie A"
    },
    { 
      id: 3, 
      name: "Jalón Dorsal (Lat Pulldown)", 
      reps: "15x", 
      weight: "45kg", 
      rest: 60, 
      img: "/lat-pulldown.png", 
      video: "/lat-pulldown.png",
      muscles: "Dorsal Ancho, Bíceps, Redondo Mayor",
      instructions: [
        "Siéntate en la máquina de jalón dorsal y ajusta las almohadillas sobre tus muslos.",
        "Sujeta la barra con un agarre amplio y mantén la espalda recta.",
        "Tira de la barra hacia abajo hacia la parte superior de tu pecho, llevando los codos hacia tus costados.",
        "Sube de manera controlada controlando el peso de regreso."
      ],
      tips: "Mantén el pecho erguido y no te reclines excesivamente hacia atrás.",
      superset: null
    },
    { 
      id: 4, 
      name: "Camilla de Femorales Tumbado", 
      reps: "12x", 
      weight: "30kg", 
      rest: 60, 
      img: "/prone-leg-curl.png", 
      video: "/prone-leg-curl.png",
      muscles: "Isquiotibiales, Gastrocnemio",
      instructions: [
        "Acuéstate boca abajo en la máquina, alineando las rodillas con el eje de rotación.",
        "Coloca el rodillo de tobillo justo encima de los talones.",
        "Sujeta los agarres y flexiona las piernas llevando los talones hacia los glúteos de forma controlada.",
        "Regresa lentamente a la posición inicial."
      ],
      tips: "Mantén las caderas pegadas al banco durante todo el movimiento para aislar bien el femoral.",
      superset: "Superserie B"
    },
    { 
      id: 5, 
      name: "Sillón de Flexión de Piernas Sentado", 
      reps: "12x", 
      weight: "35kg", 
      rest: 60, 
      img: "/seated-leg-curl.png", 
      video: "/seated-leg-curl.png",
      muscles: "Isquiotibiales, Gastrocnemio",
      instructions: [
        "Siéntate y ajusta el respaldo para alinear la articulación de la rodilla con la máquina.",
        "Asegura el rodillo superior sobre los muslos y coloca las piernas extendidas sobre el rodillo inferior.",
        "Flexiona las rodillas llevando los talones hacia atrás y abajo.",
        "Regresa controlando el peso lentamente."
      ],
      tips: "Aprieta por un segundo en la parte final de la contracción.",
      superset: "Superserie B"
    },
    { 
      id: 6, 
      name: "Camilla de Isquiotibiales Sentado", 
      reps: "12x", 
      weight: "30kg", 
      rest: 60, 
      img: "/seated-hamstring-curl.png", 
      video: "/seated-hamstring-curl.png",
      muscles: "Isquiotibiales, Glúteo Mayor",
      instructions: [
        "Ajusta los soportes de la máquina y adopta una postura erguida.",
        "Empuja el rodillo hacia abajo utilizando la fuerza de tus femorales.",
        "Extiende las piernas lentamente controlando la carga."
      ],
      tips: "Evita arquear la espalda baja.",
      superset: null
    }
  ];

  const exercises = customExercises || defaultExercises;

  const [feedback, setFeedback] = useState<Record<number, { intensity?: string; technique?: string }>>({});

  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [workoutStarted, setWorkoutStarted] = useState(false);

  // Active rest timer states
  const [activeRestId, setActiveRestId] = useState<number | null>(null);
  const [restSeconds, setRestSeconds] = useState<number>(0);

  // Detail Modal exercise state
  const [activeDetailExercise, setActiveDetailExercise] = useState<any | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  // Countdown timer for active rest
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (activeRestId !== null && restSeconds > 0) {
      interval = setInterval(() => {
        setRestSeconds(prev => {
          if (prev <= 1) {
            setActiveRestId(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeRestId, restSeconds]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const getResponse = (f: string) => {
    switch (f) {
      case "Muy fácil": return "Aumentaremos mucho la intensidad.";
      case "Fácil": return "Aumentaremos un poco la intensidad.";
      case "Bien": return "Mantendremos esta intensidad.";
      case "Difícil": return "Reduciremos un poco la intensidad.";
      case "Muy difícil": return "Reduciremos mucho la intensidad.";
      default: return "";
    }
  };

  const options = ["Muy fácil", "Fácil", "Bien", "Difícil", "Muy difícil"];
  const techniqueOptions = ["No muy buena", "Buena", "Muy buena", "Excelente"];

  const getTechniqueResponse = (t: string) => {
    switch (t) {
      case "No muy buena": return "Nos enfocaremos en mejorar la postura y reducir el peso.";
      case "Buena": return "Buen control, seguiremos perfeccionando el rango de movimiento.";
      case "Muy buena": return "Excelente ejecución, mantén ese ritmo y control.";
      case "Excelente": return "No necesité pausas adicionales y pude completar todas las repeticiones con una técnica perfecta.";
      default: return "";
    }
  };

  // Group exercises by superset or render individually
  const groupedExercises: Array<{
    type: "single" | "superset";
    name?: string | null;
    items: typeof exercises;
  }> = [];

  exercises.forEach(ex => {
    if (ex.superset) {
      const lastGroup = groupedExercises[groupedExercises.length - 1];
      if (lastGroup && lastGroup.type === "superset" && lastGroup.name === ex.superset) {
        lastGroup.items.push(ex);
      } else {
        groupedExercises.push({
          type: "superset",
          name: ex.superset,
          items: [ex]
        });
      }
    } else {
      groupedExercises.push({
        type: "single",
        items: [ex]
      });
    }
  });

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-background/95 backdrop-blur-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-300">
      <div className="flex-1 overflow-y-auto px-4 py-12 pb-32">
        <div className="max-w-xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-2 pr-4">
              <span className="text-[10px] uppercase font-bold text-muted-foreground bg-secondary px-2.5 py-1 rounded-md">Rutina Generada con IA</span>
              <h1 className="text-3xl font-black text-foreground leading-tight tracking-tight">
                {workoutTitle || "Fuerza Funcional & Core"}
              </h1>
              <p className="text-sm text-muted-foreground font-medium">
                Enfoque: Cuerpo Completo • Equipamiento: Mancuernas y Pesas Libres • Estimado: 40 min
              </p>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-border transition-colors shrink-0">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Exercises List */}
          <div className="space-y-8">
            {groupedExercises.map((group, groupIdx) => {
              if (group.type === "superset") {
                return (
                  <div key={`group-${groupIdx}`} className="bg-card/40 border border-border/80 rounded-3xl p-5 space-y-6 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-black text-rose-500 bg-rose-500/10 px-2.5 py-1 rounded-md tracking-wider flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 fill-current" />
                        {group.name}
                      </span>
                      <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wider bg-rose-500/5 px-2.5 py-1 rounded-lg border border-rose-500/10">
                        Sin descanso entre ejercicios
                      </span>
                    </div>

                    <div className="space-y-6 relative pl-5 border-l-2 border-dashed border-rose-500/20 ml-2">
                      {group.items.map((ex, itemIdx) => {
                        const currentFeedback = feedback[ex.id];
                        const isLast = itemIdx === group.items.length - 1;
                        return (
                          <div key={ex.id} className="space-y-4 relative">
                            {/* Dot linking indicator */}
                            <div className="absolute -left-[27px] top-4 w-3 h-3 rounded-full bg-background border-2 border-rose-500 flex items-center justify-center">
                              <div className="w-1 h-1 rounded-full bg-rose-500" />
                            </div>

                            <div className="flex items-center justify-between gap-4">
                              <div 
                                className="flex items-center gap-4 cursor-pointer group"
                                onClick={() => setActiveDetailExercise(ex)}
                              >
                                <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-border bg-card">
                                  <img src={ex.img} alt={ex.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-foreground group-hover:underline leading-snug">{ex.reps} {ex.name} • {ex.weight}</p>
                                  <p className="text-[11px] text-muted-foreground mt-0.5">Ver detalles →</p>
                                </div>
                              </div>

                              {/* Rest timer is only shown at the end of the superset */}
                              {isLast && (
                                <>
                                  {activeRestId === ex.id ? (
                                    <div className="flex items-center gap-2 shrink-0">
                                      <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-foreground text-background flex items-center gap-1.5 animate-pulse">
                                        <Clock className="w-3.5 h-3.5" />
                                        {restSeconds}s
                                      </span>
                                      <button 
                                        onClick={() => setActiveRestId(null)}
                                        className="px-2 py-1 bg-secondary text-rose-500 hover:bg-rose-500/10 border border-border rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all"
                                      >
                                        Omitir
                                      </button>
                                    </div>
                                  ) : (
                                    <button 
                                      onClick={() => {
                                        setActiveRestId(ex.id);
                                        setRestSeconds(ex.rest);
                                      }}
                                      className="px-3 py-1.5 rounded-full text-xs font-bold bg-secondary hover:bg-border text-foreground border border-border/80 flex items-center gap-1.5 transition-all shrink-0"
                                    >
                                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                                      Descanso
                                    </button>
                                  )}
                                </>
                              )}
                            </div>

                            {/* Two Segmented Controls for exercise feedback */}
                            <div className="space-y-3 mt-2">
                              <div>
                                <span className="text-[9px] text-muted-foreground font-black uppercase tracking-wider block mb-1">Esfuerzo Percibido</span>
                                <div className="flex rounded-xl overflow-hidden border border-border bg-secondary shadow-sm">
                                  {options.map((opt) => {
                                    const isActive = currentFeedback?.intensity === opt;
                                    return (
                                      <button
                                        key={opt}
                                        type="button"
                                        onClick={() => setFeedback({ 
                                          ...feedback, 
                                          [ex.id]: { ...feedback[ex.id], intensity: opt } 
                                        })}
                                        className={`flex-1 py-2 px-1 text-[10px] font-bold text-center border-r border-border/50 last:border-r-0 transition-all leading-tight ${
                                          isActive 
                                            ? "bg-foreground text-background shadow-md" 
                                            : "text-muted-foreground hover:bg-border hover:text-foreground"
                                        }`}
                                      >
                                        {opt}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              <div>
                                <span className="text-[9px] text-muted-foreground font-black uppercase tracking-wider block mb-1">¿Qué tal estuvo tu técnica?</span>
                                <div className="flex rounded-xl overflow-hidden border border-border bg-secondary shadow-sm">
                                  {techniqueOptions.map((opt) => {
                                    const isActive = currentFeedback?.technique === opt;
                                    return (
                                      <button
                                        key={opt}
                                        type="button"
                                        onClick={() => setFeedback({ 
                                          ...feedback, 
                                          [ex.id]: { ...feedback[ex.id], technique: opt } 
                                        })}
                                        className={`flex-1 py-2 px-1 text-[10px] font-bold text-center border-r border-border/50 last:border-r-0 transition-all leading-tight ${
                                          isActive 
                                            ? "bg-foreground text-background shadow-md" 
                                            : "text-muted-foreground hover:bg-border hover:text-foreground"
                                        }`}
                                      >
                                        {opt}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              <div className="min-h-[1.5rem] text-[11px] font-semibold text-foreground space-y-0.5 mt-1">
                                {currentFeedback?.intensity && (
                                  <p className="leading-relaxed">Esfuerzo: <span className="font-bold text-muted-foreground">{getResponse(currentFeedback.intensity)}</span></p>
                                )}
                                {currentFeedback?.technique && (
                                  <p className="leading-relaxed">Técnica: <span className="font-bold text-muted-foreground">{getTechniqueResponse(currentFeedback.technique)}</span></p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              } else {
                // Single exercise layout
                const ex = group.items[0];
                const currentFeedback = feedback[ex.id];
                return (
                  <div key={ex.id} className="space-y-4 bg-card/20 border border-border/60 rounded-3xl p-5 relative">
                    <div className="flex items-center justify-between gap-4">
                      <div 
                        className="flex items-center gap-4 cursor-pointer group"
                        onClick={() => setActiveDetailExercise(ex)}
                      >
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-border bg-card">
                          <img src={ex.img} alt={ex.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground group-hover:underline leading-snug">{ex.reps} {ex.name} • {ex.weight}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">Descanso: {ex.rest}s • Ver detalles →</p>
                        </div>
                      </div>

                      {activeRestId === ex.id ? (
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-foreground text-background flex items-center gap-1.5 animate-pulse">
                            <Clock className="w-3.5 h-3.5" />
                            {restSeconds}s
                          </span>
                          <button 
                            onClick={() => setActiveRestId(null)}
                            className="px-2 py-1 bg-secondary text-rose-500 hover:bg-rose-500/10 border border-border rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all"
                          >
                            Omitir
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => {
                            setActiveRestId(ex.id);
                            setRestSeconds(ex.rest);
                          }}
                          className="px-3 py-1.5 rounded-full text-xs font-bold bg-secondary hover:bg-border text-foreground border border-border/80 flex items-center gap-1.5 transition-all shrink-0"
                        >
                          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                          Descanso
                        </button>
                      )}
                    </div>

                    {/* Two Segmented Controls for exercise feedback */}
                    <div className="space-y-3 mt-2">
                      <div>
                        <span className="text-[9px] text-muted-foreground font-black uppercase tracking-wider block mb-1">Esfuerzo Percibido</span>
                        <div className="flex rounded-xl overflow-hidden border border-border bg-secondary shadow-sm">
                          {options.map((opt) => {
                            const isActive = currentFeedback?.intensity === opt;
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setFeedback({ 
                                  ...feedback, 
                                  [ex.id]: { ...feedback[ex.id], intensity: opt } 
                                })}
                                className={`flex-1 py-2 px-1 text-[10px] font-bold text-center border-r border-border/50 last:border-r-0 transition-all leading-tight ${
                                  isActive 
                                    ? "bg-foreground text-background shadow-md" 
                                    : "text-muted-foreground hover:bg-border hover:text-foreground"
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <span className="text-[9px] text-muted-foreground font-black uppercase tracking-wider block mb-1">¿Qué tal estuvo tu técnica?</span>
                        <div className="flex rounded-xl overflow-hidden border border-border bg-secondary shadow-sm">
                          {techniqueOptions.map((opt) => {
                            const isActive = currentFeedback?.technique === opt;
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setFeedback({ 
                                  ...feedback, 
                                  [ex.id]: { ...feedback[ex.id], technique: opt } 
                                })}
                                className={`flex-1 py-2 px-1 text-[10px] font-bold text-center border-r border-border/50 last:border-r-0 transition-all leading-tight ${
                                  isActive 
                                    ? "bg-foreground text-background shadow-md" 
                                    : "text-muted-foreground hover:bg-border hover:text-foreground"
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="min-h-[1.5rem] text-[11px] font-semibold text-foreground space-y-0.5 mt-1">
                        {currentFeedback?.intensity && (
                          <p className="leading-relaxed">Esfuerzo: <span className="font-bold text-muted-foreground">{getResponse(currentFeedback.intensity)}</span></p>
                        )}
                        {currentFeedback?.technique && (
                          <p className="leading-relaxed">Técnica: <span className="font-bold text-muted-foreground">{getTechniqueResponse(currentFeedback.technique)}</span></p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
          
        </div>
      </div>
      
      {/* Sticky Bottom Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-background/90 backdrop-blur-xl border-t border-border z-10">
        <div className="max-w-xl mx-auto">
          {!workoutStarted ? (
            <Button 
              onClick={() => {
                setWorkoutStarted(true);
                setIsRunning(true);
              }} 
              className="w-full h-14 rounded-2xl bg-foreground text-background font-black text-lg hover:opacity-90 transition-opacity shadow-md flex items-center justify-center gap-2 animate-bounce-subtle"
            >
              <Play className="w-5 h-5 fill-current" />
              Comenzar Workout
            </Button>
          ) : (
            <div className="flex items-center justify-between gap-4">
              {/* Compact Redesigned Timer */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                  <span className="text-[9px] text-muted-foreground font-black uppercase tracking-wider">Tiempo</span>
                </div>
                <span className="text-2xl sm:text-3xl font-mono font-black text-foreground">{formatTime(seconds)}</span>
              </div>
              
              {/* Controls & End Button */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsRunning(!isRunning)}
                  className={`p-3 rounded-xl border transition-all ${
                    isRunning 
                      ? "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20" 
                      : "bg-foreground text-background border-foreground hover:opacity-90"
                  }`}
                  title={isRunning ? "Pausar" : "Reanudar"}
                >
                  {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                
                <button 
                  onClick={() => { setSeconds(0); setIsRunning(false); }}
                  className="p-3 rounded-xl bg-secondary hover:bg-border text-foreground border border-border transition-colors"
                  title="Reiniciar"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                
                <Button 
                  onClick={() => {
                    if (onComplete) onComplete();
                    onClose();
                  }} 
                  variant="outline"
                  className="h-11 px-5 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border-rose-500/30 font-black text-sm transition-colors"
                >
                  Finalizar
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submodal de detalles del ejercicio */}
      {activeDetailExercise && (
        <ExerciseDetailModal 
          exercise={activeDetailExercise} 
          onClose={() => setActiveDetailExercise(null)} 
        />
      )}
    </div>
  );
}

// Subcomponent: AI Coach Diario (Wellfooder Timeline)
function DiarioTab() {
  const [subTab, setSubTab] = useState<"diario" | "analisis" | "recuperacion">("diario");
  const [insightPeriod, setInsightPeriod] = useState<"day" | "week" | "month" | "quarter">("week");
  const [mood, setMood] = useState(75);
  const [hunger, setHunger] = useState(40);
  const [energy, setEnergy] = useState(60);
  const [checkinPage, setCheckinPage] = useState(0);
  const [swipeStartX, setSwipeStartX] = useState<number | null>(null);
  const [swipeCurrentX, setSwipeCurrentX] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  const handleSwipeStart = (clientX: number, target: HTMLElement) => {
    if (
      target.closest('.cursor-pointer') || 
      target.closest('.cursor-col-resize') || 
      target.closest('button') ||
      target.closest('input') ||
      target.closest('select')
    ) {
      return;
    }
    setSwipeStartX(clientX);
    setIsSwiping(true);
  };

  const handleSwipeMove = (clientX: number) => {
    if (!isSwiping || swipeStartX === null) return;
    setSwipeCurrentX(clientX);
  };

  const handleSwipeEnd = () => {
    if (!isSwiping || swipeStartX === null || swipeCurrentX === null) {
      setIsSwiping(false);
      setSwipeStartX(null);
      setSwipeCurrentX(null);
      return;
    }
    const diff = swipeStartX - swipeCurrentX;
    const threshold = 60;
    if (diff > threshold && checkinPage === 0) {
      setCheckinPage(1);
    } else if (diff < -threshold && checkinPage === 1) {
      setCheckinPage(0);
    }
    setIsSwiping(false);
    setSwipeStartX(null);
    setSwipeCurrentX(null);
  };

  const [hydrationLevel, setHydrationLevel] = useState(5);

  const activityData = [
    { day: "Lun", puntos: 180 },
    { day: "Mar", puntos: 160 },
    { day: "Mié", puntos: 175 },
    { day: "Jue", puntos: 140 },
    { day: "Vie", puntos: 155 },
    { day: "Sáb", puntos: 190 },
    { day: "Dom", puntos: 168 }
  ];

  const chartConfig = {
    puntos: {
      label: "Puntos de Actividad",
      color: "hsl(var(--primary))",
    },
  };

  // States and data for page 2 (Racha de Actividad & MET Calculator)
  const MET_ACTIVITIES = [
    { name: "Aeróbica", low: 3.5, med: 5.0, high: 7.3 },
    { name: "Artes marciales", low: 5.3, med: 7.0, high: 10.3 },
    { name: "Baile", low: 3.3, med: 5.0, high: 7.0 },
    { name: "Básquetbol", low: 4.5, med: 6.0, high: 8.0 },
    { name: "Bicicleta", low: 4.0, med: 8.0, high: 10.0 },
    { name: "Boxeo", low: 5.5, med: 7.0, high: 12.8 },
    { name: "Calistenia", low: 3.5, med: 5.0, high: 8.0 },
    { name: "Caminata", low: 2.5, med: 3.5, high: 4.5 },
    { name: "Caminata rápida", low: 3.8, med: 5.0, high: 6.5 },
    { name: "Ciclismo urbano", low: 4.0, med: 6.8, high: 10.0 },
    { name: "Correr", low: 7.0, med: 10.0, high: 15.0 },
    { name: "Crossfit", low: 5.0, med: 8.0, high: 12.0 },
    { name: "Elíptico", low: 4.5, med: 7.0, high: 10.0 },
    { name: "Entrenamiento de fuerza", low: 3.0, med: 5.0, high: 6.0 },
    { name: "Fútbol", low: 5.0, med: 7.0, high: 10.0 },
    { name: "Natación", low: 5.3, med: 8.0, high: 10.0 },
    { name: "Pilates", low: 2.5, med: 3.5, high: 5.0 },
    { name: "Saltar la cuerda", low: 8.0, med: 11.0, high: 14.0 },
    { name: "Senderismo", low: 3.5, med: 6.0, high: 9.0 },
    { name: "Yoga", low: 2.0, med: 3.0, high: 4.0 },
    { name: "Zumba", low: 4.0, med: 6.5, high: 8.5 }
  ];

  const STREAK_FAQ = [
    {
      q: "¿Qué es la racha y cómo se mide?",
      a: "La Racha de Actividad ayuda a mantener tu constancia física a largo plazo. En lugar de evaluar día a día, la app calcula un promedio ponderado de 7 días de tu actividad física (caminar, correr, gimnasio, etc.), donde las actividades más recientes tienen mayor peso."
    },
    {
      q: "¿Cómo se mantiene y cuándo se pierde?",
      a: "Para mantener tu racha, tu promedio de 7 días debe estar en el nivel Saludable (150 Puntos o más). Si cae por debajo de este límite, tu racha vuelve a cero. No obstante, ¡se permite descansar! Si te saltas un día pero tu promedio sigue arriba de 150, tu racha no se romperá."
    },
    {
      q: "¿Qué es la Curva de Actividad y la Línea Base?",
      a: "La Curva de Actividad grafica tu promedio de Puntos de Actividad de los últimos 7 días. La Línea Base Saludable (150 puntos) combina las pautas de actividad física diaria de la Organización Mundial de la Salud (OMS) con el MET."
    },
    {
      q: "¿Cómo se calculan los Puntos de Actividad?",
      a: "Los puntos diarios son el promedio ponderado de los minutos MET. El MET (Equivalente Metabólico) mide la energía que consume una actividad comparada con el reposo. Los minutos MET de cada ejercicio se calculan multiplicando el valor MET de la actividad (según su intensidad) por los minutos entrenados."
    }
  ];

  const [calcActivityIdx, setCalcActivityIdx] = useState(7); // default to Caminata
  const [calcIntensity, setCalcIntensity] = useState<"low" | "med" | "high">("med");
  const [calcDuration, setCalcDuration] = useState(30);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showStreakInfo, setShowStreakInfo] = useState(false);

  const [muscleRecovery, setMuscleRecovery] = useState<Record<string, number>>({
    "pecho": 95,
    "espalda": 80,
    "espalda-baja": 45,
    "hombros": 90,
    "biceps": 85,
    "triceps": 60,
    "abdominales": 100,
    "cuadriceps": 50,
    "isquiotibiales": 75,
    "gluteos": 80,
    "gemelos": 90
  });
  const [isEditingRecovery, setIsEditingRecovery] = useState(false);
  const [showRecoveryInfo, setShowRecoveryInfo] = useState(false);
  const [showMindfulRateInfo, setShowMindfulRateInfo] = useState(false);

  const handleWorkoutComplete = (exercisesTrained: any[]) => {
    setMuscleRecovery(prev => {
      const next = { ...prev };
      exercisesTrained.forEach(ex => {
        if (!ex.muscles) return;
        const text = ex.muscles.toLowerCase();
        if (text.includes("biceps") || text.includes("bíceps")) next["biceps"] = Math.max(0, next["biceps"] - 35);
        if (text.includes("triceps") || text.includes("tríceps")) next["triceps"] = Math.max(0, next["triceps"] - 35);
        if (text.includes("pectoral") || text.includes("pecho")) next["pecho"] = Math.max(0, next["pecho"] - 35);
        if (text.includes("dorsal") || text.includes("espalda")) next["espalda"] = Math.max(0, next["espalda"] - 35);
        if (text.includes("lumbar") || text.includes("baja")) next["espalda-baja"] = Math.max(0, next["espalda-baja"] - 35);
        if (text.includes("deltoides") || text.includes("hombro")) next["hombros"] = Math.max(0, next["hombros"] - 35);
        if (text.includes("abdominal") || text.includes("abs")) next["abdominales"] = Math.max(0, next["abdominales"] - 35);
        if (text.includes("cuadriceps") || text.includes("cuádriceps")) next["cuadriceps"] = Math.max(0, next["cuadriceps"] - 35);
        if (text.includes("femoral") || text.includes("isquiotibiales")) next["isquiotibiales"] = Math.max(0, next["isquiotibiales"] - 35);
        if (text.includes("gluteo") || text.includes("glúteo")) next["gluteos"] = Math.max(0, next["gluteos"] - 35);
        if (text.includes("gemelo")) next["gemelos"] = Math.max(0, next["gemelos"] - 35);
      });
      return next;
    });
  };

  const [isFabOpen, setIsFabOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string>("none");
  const [foodAnalysisStep, setFoodAnalysisStep] = useState<"upload" | "analyzing" | "report">("upload");

  // Custom Workouts State for Manual Creator
  const [customWorkouts, setCustomWorkouts] = useState<any[]>([
    {
      id: "custom-1",
      name: "Brazos de Acero",
      focus: "Bíceps y Tríceps",
      duration: "30 min",
      exercises: [
        { 
          id: 1, 
          name: "Dominadas en Barra (Pull-ups)", 
          reps: "12x", 
          weight: "Peso corporal", 
          rest: 90, 
          img: "/pull-up.png", 
          video: "/chinupreversewidegrip_x264(2).mp4", 
          muscles: "Bíceps",
          instructions: ["Sujeta los agarres y flexiona."], 
          tips: "Controla el movimiento",
          superset: "Superserie A"
        },
        { 
          id: 2, 
          name: "Cable Crossover", 
          reps: "15x", 
          weight: "15kg", 
          rest: 60, 
          img: "/cable-crossover.png", 
          video: "/cable-crossover.png", 
          muscles: "Pecho",
          instructions: ["Junta las manos al frente y abajo."], 
          tips: "No uses el impulso del cuerpo",
          superset: "Superserie A"
        }
      ]
    },
    {
      id: "custom-2",
      name: "Rutina de Piernas Básica",
      focus: "Isquiotibiales",
      duration: "20 min",
      exercises: [
        {
          id: 4,
          name: "Camilla de Femorales Tumbado",
          reps: "12x",
          weight: "30kg",
          rest: 60,
          img: "/prone-leg-curl.png",
          video: "/prone-leg-curl.png",
          muscles: "Isquiotibiales",
          instructions: ["Acuéstate boca abajo y flexiona las piernas."],
          tips: "Mantén las caderas pegadas al banco."
        }
      ]
    }
  ]);
  const [selectedCustomWorkout, setSelectedCustomWorkout] = useState<any | null>(null);
  const [workoutToEdit, setWorkoutToEdit] = useState<any | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeModal === "food-analysis" && foodAnalysisStep === "analyzing") {
      timer = setTimeout(() => {
        setFoodAnalysisStep("report");
      }, 2500);
    }
    return () => clearTimeout(timer);
  }, [activeModal, foodAnalysisStep]);

  const timelineItems = [
    {
      id: "1",
      time: "12:30 PM",
      title: "Avocado Toast & Hojas Verdes",
      subtitle: "Almuerzo",
      type: "food",
      img: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80",
      kcal: 420,
      tag: "Fibra Alta",
      coachFeedback: "Excelente balance de grasas saludables. Considerá agregar una fuente de proteína la próxima vez para prolongar la saciedad.",
    },
    {
      id: "2",
      time: "02:00 PM",
      title: "Registro de Hidratación",
      subtitle: "Control de Rutina",
      type: "hydration",
      img: null,
      kcal: 0,
      tag: "Armstrong 5",
      coachFeedback: "Nivel 5 indica deshidratación leve. Toma 500ml de agua ahora mismo para compensar el entrenamiento de la mañana.",
    },
    {
      id: "3",
      time: "08:15 AM",
      title: "Café Negro",
      subtitle: "Desayuno",
      type: "coffee",
      img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=150&q=80",
      kcal: 2,
      tag: "Sin Azúcar",
      coachFeedback: null,
    }
  ];

  const CustomSlider = ({ value, onChange, labelLeft, labelRight, colorClass }: any) => {
    const handleSliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = Math.round((x / rect.width) * 100);
      onChange(Math.max(0, Math.min(100, pct)));
    };

    return (
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground tracking-wide font-bold uppercase select-none">
          <span>{labelLeft}</span>
          <span className="text-foreground">{labelRight}</span>
        </div>
        <div 
          onClick={handleSliderClick}
          className="relative h-12 bg-slate-100 dark:bg-slate-900/60 rounded-xl overflow-hidden group cursor-pointer border border-border select-none flex items-center"
        >
          <div 
            className={`absolute top-0 left-0 h-full bg-gradient-to-r ${colorClass} rounded-xl transition-all duration-300`} 
            style={{ width: `${value}%` }}
          />
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white border border-slate-300 dark:border-slate-700 rounded-full transform -translate-x-1/2 transition-all duration-300 cursor-col-resize shadow-sm"
            style={{ left: `${value}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={`mx-auto w-full space-y-8 pb-16 ${subTab === "analisis" ? "max-w-4xl" : "max-w-2xl"}`}>
      {/* Header Section */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1.5">Tu Bitácora AI</p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
            {subTab === "diario" ? "Bitácora de Bienestar" : subTab === "analisis" ? "Alimentación y Hábitos" : "Recuperación Muscular"}
          </h1>
        </div>
        <div className="flex p-1 bg-secondary/35 rounded-xl border border-border self-start">
          <button 
            type="button"
            onClick={() => setSubTab("diario")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
              subTab === "diario" 
                ? "bg-foreground text-background" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Diario
          </button>
          <button 
            type="button"
            onClick={() => setSubTab("recuperacion")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
              subTab === "recuperacion" 
                ? "bg-foreground text-background" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Recuperación
          </button>
          <button 
            type="button"
            onClick={() => setSubTab("analisis")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
              subTab === "analisis" 
                ? "bg-foreground text-background" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Alimentación
          </button>
        </div>
      </header>

      {subTab === "diario" && (
        <>
          {/* Status Check-in Page View */}
          <section className="bg-card border border-border rounded-2xl p-5 md:p-6 space-y-5 relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
                  {checkinPage === 0 ? (
                    "Estado Actual"
                  ) : (
                    <span className="flex items-center gap-2">
                      Racha de Actividad
                      <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20">
                        <Flame className="w-3.5 h-3.5 fill-orange-500 animate-pulse text-orange-500" />
                        12 días
                      </span>
                    </span>
                  )}
                </h2>
                {checkinPage === 1 && (
                  <button 
                    onClick={() => setShowStreakInfo(true)}
                    className="text-muted-foreground hover:text-primary transition-colors p-1 rounded-full hover:bg-secondary/40 focus:outline-none cursor-pointer"
                    title="¿Cómo funciona mi racha?"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Page content with smooth swipe/drag and fade animation */}
            <div 
              className="relative min-h-[100px] cursor-grab active:cursor-grabbing select-none touch-pan-y"
              onTouchStart={(e) => handleSwipeStart(e.touches[0].clientX, e.target as HTMLElement)}
              onTouchMove={(e) => handleSwipeMove(e.touches[0].clientX)}
              onTouchEnd={handleSwipeEnd}
              onMouseDown={(e) => handleSwipeStart(e.clientX, e.target as HTMLElement)}
              onMouseMove={(e) => handleSwipeMove(e.clientX)}
              onMouseUp={handleSwipeEnd}
              onMouseLeave={() => {
                if (isSwiping) handleSwipeEnd();
              }}
            >
              {checkinPage === 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-in fade-in slide-in-from-left-4 duration-300">
                  <CustomSlider 
                    value={mood} 
                    onChange={setMood} 
                    labelLeft="Ansioso" 
                    labelRight="Calmo" 
                    colorClass="from-[#150a21] to-[#7f20df] dark:from-[#0a0410] dark:to-[#7f20df]"
                  />
                  <CustomSlider 
                    value={hunger} 
                    onChange={setHunger} 
                    labelLeft="Hambriento" 
                    labelRight="Saciado" 
                    colorClass="from-[#041f14] to-[#10b981] dark:from-[#020f0a] dark:to-[#10b981]"
                  />
                  <CustomSlider 
                    value={energy} 
                    onChange={setEnergy} 
                    labelLeft="Cansado" 
                    labelRight="Enérgico" 
                    colorClass="from-[#221a05] to-[#f59e0b] dark:from-[#181203] dark:to-[#f59e0b]"
                  />
                </div>
              ) : (
                <div className="w-full animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex justify-between items-center text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-3 px-0.5">
                    <span>Curva de Actividad (7 días)</span>
                    <span className="text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Base: 150 ptos</span>
                  </div>

                  <ChartContainer config={chartConfig} className="h-36 w-full aspect-auto select-none">
                    <AreaChart
                      data={activityData}
                      margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="recharts-activity-grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/40" />
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
                          fontWeight: "bold"
                        }} 
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area 
                        type="monotone" 
                        dataKey="puntos" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2.5} 
                        fillOpacity={1} 
                        fill="url(#recharts-activity-grad)" 
                      />
                    </AreaChart>
                  </ChartContainer>
                </div>
              )}
            </div>

            {/* FAQ Info Modal Overlay */}
            {showStreakInfo && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-xl p-5 relative overflow-hidden space-y-4 animate-in zoom-in-95 duration-200">
                  <button
                    onClick={() => setShowStreakInfo(false)}
                    className="absolute top-4 right-4 size-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all cursor-pointer"
                    aria-label="Cerrar"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-foreground">
                    <Info className="w-4 h-4 text-primary" />
                    <span>¿Cómo funciona mi Racha?</span>
                  </div>

                  <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                    {STREAK_FAQ.map((faq, idx) => {
                      const isOpen = activeFaq === idx;
                      return (
                        <div key={idx} className="border-b border-border/40 last:border-b-0 pb-1.5 last:pb-0">
                          <button
                            onClick={() => setActiveFaq(isOpen ? null : idx)}
                            className="w-full flex items-center justify-between text-left py-1 text-[11px] font-bold text-foreground hover:text-primary transition-colors focus:outline-none cursor-pointer"
                          >
                            <span>{faq.q}</span>
                            {isOpen ? (
                              <ChevronUp className="w-3.5 h-3.5 shrink-0 ml-1 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 shrink-0 ml-1 text-muted-foreground" />
                            )}
                          </button>
                          
                          {isOpen && (
                            <p className="text-[10px] text-muted-foreground leading-relaxed mt-1 animate-in fade-in slide-in-from-top-1 duration-200 select-text">
                              {faq.a}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <Button 
                    onClick={() => setShowStreakInfo(false)}
                    className="w-full text-xs font-bold py-2"
                  >
                    Entendido
                  </Button>
                </div>
              </div>
            )}
          </section>

          {/* Page View Indicators & Navigation Controls (Below & Outside the card) */}
          <div className="flex items-center justify-between px-2 pt-2.5">
            {/* Dots Indicator */}
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setCheckinPage(0)}
                className={`size-2 rounded-full transition-all duration-300 ${checkinPage === 0 ? "bg-primary scale-125" : "bg-muted hover:bg-muted-foreground/40"} cursor-pointer`}
                aria-label="Página 1"
              />
              <button 
                onClick={() => setCheckinPage(1)}
                className={`size-2 rounded-full transition-all duration-300 ${checkinPage === 1 ? "bg-primary scale-125" : "bg-muted hover:bg-muted-foreground/40"} cursor-pointer`}
                aria-label="Página 2"
              />
            </div>
            
            {/* Chevrons Navigation */}
            <div className="flex items-center gap-2">
              <button
                disabled={checkinPage === 0}
                onClick={() => setCheckinPage(0)}
                className="size-7 rounded-lg border border-border flex items-center justify-center text-foreground hover:bg-secondary disabled:opacity-40 disabled:pointer-events-none transition-all duration-200 cursor-pointer"
                title="Página Anterior"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={checkinPage === 1}
                onClick={() => setCheckinPage(1)}
                className="size-7 rounded-lg border border-border flex items-center justify-center text-foreground hover:bg-secondary disabled:opacity-40 disabled:pointer-events-none transition-all duration-200 cursor-pointer"
                title="Siguiente Página"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative pl-6 md:pl-0">
            {/* Vertical Line */}
            <div className="absolute left-6 md:left-[50%] top-0 bottom-0 w-[2px] bg-border transform -translate-x-1/2 md:-translate-x-[1px]"></div>

            {timelineItems.map((item, index) => {
              const isEven = index % 2 === 0;
              const showOnLeft = !isEven; // Zig-zag on desktop
              
              return (
                <div key={item.id} className="relative mb-12 md:grid md:grid-cols-2 md:gap-12 items-center group">
                  {/* Timeline Dot */}
                  <div className={`absolute left-0 md:left-1/2 w-4.5 h-4.5 rounded-full border-4 bg-background z-10 transform -translate-x-1/2 ${
                    item.type === "food" ? "border-primary" : item.type === "hydration" ? "border-blue-500" : "border-muted-foreground/50"
                  }`}></div>

                  {/* Time Label for Desktop */}
                  <div className={`hidden md:block ${showOnLeft ? "text-right pr-6 md:order-2" : "text-left pl-6 md:order-1"}`}>
                    <span className="text-primary font-bold text-base">{item.time}</span>
                    <p className="text-muted-foreground text-xs mt-0.5">{item.subtitle}</p>
                  </div>

                  {/* Card Container */}
                  <div className={`pl-6 md:pl-0 ${showOnLeft ? "md:order-1" : "md:order-2"}`}>
                    <div className="bg-card border border-border rounded-2xl overflow-hidden">
                      {item.img && (
                        <div className="relative h-44 w-full overflow-hidden">
                          <img 
                            src={item.img} 
                            alt={item.title} 
                            className="w-full h-full object-cover" 
                          />
                          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background/90 to-transparent"></div>
                          <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-foreground text-base font-extrabold">{item.title}</h3>
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground font-bold">
                              {item.kcal > 0 && (
                                <span className="flex items-center gap-0.5 text-primary">
                                  <Flame className="w-3.5 h-3.5" /> {item.kcal} kcal
                                </span>
                              )}
                              {item.kcal > 0 && <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />}
                              <span className="uppercase tracking-wider">{item.tag}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {!item.img && item.type === "hydration" && (
                        <div className="p-5 space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-foreground text-base font-extrabold">{item.title}</h3>
                              <p className="text-[10px] text-muted-foreground font-bold uppercase mt-0.5">{item.subtitle}</p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                              <Droplet className="w-5 h-5" />
                            </div>
                          </div>

                          {/* Hydration Selector */}
                          <div className="space-y-2">
                            <div className="flex justify-between gap-1 h-12 w-full rounded-xl overflow-hidden bg-secondary/20 p-1">
                              {[
                                { level: 1, color: "#fbfce1" },
                                { level: 2, color: "#f9f9cd" },
                                { level: 3, color: "#f6f2a9" },
                                { level: 4, color: "#f2e285" },
                                { level: 5, color: "#eec863" },
                                { level: 6, color: "#e8a33a" },
                                { level: 7, color: "#d4812f" },
                                { level: 8, color: "#a66a2e" }
                              ].map(h => (
                                <button
                                  key={h.level}
                                  type="button"
                                  onClick={() => {
                                    setHydrationLevel(h.level);
                                  }}
                                  className={`flex-1 h-full rounded-lg transition-all relative ${
                                    hydrationLevel === h.level 
                                      ? "border-2 border-foreground z-10" 
                                      : "hover:opacity-90"
                                  }`}
                                  style={{ backgroundColor: h.color }}
                                >
                                  {hydrationLevel === h.level && (
                                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-foreground rounded-full"></span>
                                  )}
                                </button>
                              ))}
                            </div>
                            <div className="flex justify-between text-[9px] uppercase font-bold text-muted-foreground/80 tracking-wider">
                              <span>Óptimo</span>
                              <span>Deshidratado</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {!item.img && item.type !== "hydration" && (
                        <div className="p-4 flex items-center gap-4">
                          {item.type === "coffee" && (
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
                              <Coffee className="w-5 h-5" />
                            </div>
                          )}
                          {item.type === "thought" && (
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                              <Sparkles className="w-5 h-5" />
                            </div>
                          )}
                          <div>
                            <h4 className="text-foreground text-sm font-extrabold">{item.title}</h4>
                            <p className="text-[10px] text-muted-foreground font-bold mt-0.5">{item.kcal > 0 ? `${item.kcal} kcal • ` : ""}{item.tag}</p>
                          </div>
                        </div>
                      )}

                      {/* Coach / AI Feedback Section */}
                      {item.coachFeedback && (
                        <div className="p-4 bg-secondary/20 border-t border-border">
                          <div className="flex items-start gap-2.5">
                            <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                              {item.coachFeedback}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Mobile-only Time Stamp */}
                    <div className="md:hidden mt-2 ml-1 text-primary font-bold text-xs">
                      <span>{item.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {subTab === "analisis" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="text-sm text-muted-foreground">Perspectivas detalladas de tu alimentación y bienestar.</p>
            
            <div className="flex p-0.5 bg-secondary/35 rounded-xl border border-border">
              {(["day", "week", "month", "quarter"] as const).map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setInsightPeriod(period)}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition capitalize ${
                    insightPeriod === period
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {period === "day" ? "Día" : period === "week" ? "Semana" : period === "month" ? "Mes" : "Trimestre"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Mindful Rate */}
            <div className="bg-card border border-border p-6 rounded-2xl flex flex-col items-center justify-center text-center">
              <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-6">Mindful rate</h3>
              <div className="relative flex items-center justify-center size-48">
                <svg className="size-48 transform -rotate-90">
                  <circle className="text-secondary/40" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeWidth="6"></circle>
                  <circle className="text-violet-600 dark:text-violet-500" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeDasharray="502.6" strokeDashoffset="75.4" strokeLinecap="round" strokeWidth="8"></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-foreground">85%</span>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-muted-foreground">
                <button
                  type="button"
                  onClick={() => setShowMindfulRateInfo(!showMindfulRateInfo)}
                  className={`p-1 rounded-full transition-colors flex items-center justify-center ${
                    showMindfulRateInfo ? "bg-secondary text-foreground" : "hover:bg-secondary text-muted-foreground"
                  }`}
                  title="Ver explicación"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
                <p className="text-xs font-medium">Porcentaje de días registrados</p>
              </div>

              {showMindfulRateInfo && (
                <div className="mt-3 p-3 bg-secondary/35 border border-border/50 rounded-xl text-left text-[11px] leading-relaxed text-muted-foreground animate-in fade-in slide-in-from-top-1 duration-200">
                  <span className="block font-bold text-foreground mb-1">¿Qué es el mindful Rate?</span>
                  El porcentaje de días en los que registró su ingesta de alimentos, dividido por el número total de días del intervalo seleccionado.
                </div>
              )}
            </div>

            {/* Why did you eat */}
            <div className="bg-card border border-border p-6 rounded-2xl flex flex-col justify-between">
              <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-6">¿Por qué comiste?</h3>
              <div className="flex flex-col items-center">
                <div className="relative size-40 mb-6">
                  <svg className="size-full" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" fill="transparent" r="15.9" stroke="var(--border)" strokeOpacity="0.2" strokeWidth="2"></circle>
                    {/* Hunger (45%) */}
                    <circle cx="18" cy="18" fill="transparent" r="15.9" stroke="currentColor" strokeDasharray="45 55" strokeDashoffset="85" strokeWidth="2.5" className="text-violet-600 dark:text-violet-500"></circle>
                    {/* Stress (20%) */}
                    <circle cx="18" cy="18" fill="transparent" r="15.9" stroke="currentColor" strokeDasharray="20 80" strokeDashoffset="40" strokeWidth="2.5" className="text-purple-500 dark:text-purple-400"></circle>
                    {/* Social (15%) */}
                    <circle cx="18" cy="18" fill="transparent" r="15.9" stroke="currentColor" strokeDasharray="15 85" strokeDashoffset="100" strokeWidth="2.5" className="text-indigo-400 dark:text-indigo-500"></circle>
                    {/* Time (20%) */}
                    <circle cx="18" cy="18" fill="transparent" r="15.9" stroke="currentColor" strokeDasharray="20 80" strokeDashoffset="20" strokeWidth="2.5" className="text-fuchsia-400 dark:text-fuchsia-500"></circle>
                  </svg>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full mt-2">
                  <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-full bg-violet-600 dark:bg-violet-500"></div>
                    <span className="text-[11px] text-foreground font-bold">Hambre (45%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-full bg-purple-500 dark:bg-purple-400"></div>
                    <span className="text-[11px] text-foreground font-bold">Estrés (20%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-full bg-indigo-400 dark:bg-indigo-500"></div>
                    <span className="text-[11px] text-foreground font-bold">Social (15%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-full bg-fuchsia-400 dark:bg-fuchsia-500"></div>
                    <span className="text-[11px] text-foreground font-bold">Tiempo (20%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Food Symptoms */}
            <div className="bg-card border border-border p-6 rounded-2xl flex flex-col justify-between">
              <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-6">Síntomas Físicos</h3>
              <div className="space-y-4 w-full">
                {[
                  { label: "Dolor de Cabeza", count: 12, pct: 65, color: "bg-violet-400 dark:bg-violet-500" },
                  { label: "Hinchazón", count: 8, pct: 45, color: "bg-purple-400 dark:bg-purple-500" },
                  { label: "Dolor de Estómago", count: 5, pct: 25, color: "bg-indigo-300 dark:bg-indigo-400" },
                  { label: "Fatiga", count: 15, pct: 85, color: "bg-violet-600 dark:bg-violet-500" }
                ].map((sym, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-foreground">{sym.label}</span>
                      <span className="text-muted-foreground">{sym.count} veces</span>
                    </div>
                    <div className="h-1.5 w-full bg-secondary/40 rounded-full overflow-hidden">
                      <div className={`h-full ${sym.color} rounded-full`} style={{ width: `${sym.pct}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Behavioral Stability Index */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-card border border-border p-6 rounded-2xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="md:w-1/2 space-y-4">
                  <div>
                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-1">Algoritmo Inteligente</p>
                    <h3 className="text-xl font-extrabold text-foreground">Índice de Estabilidad Conductual</h3>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black tracking-tighter text-foreground">85</span>
                    <span className="text-muted-foreground text-lg font-bold">/ 100</span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Tu índice de estabilidad es un 12% mayor que la semana pasada. Esto indica una mejor sincronización entre las necesidades reales de tu cuerpo y los horarios de tus comidas.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="px-3 py-1.5 bg-violet-600 dark:bg-violet-500 text-background rounded-lg text-xs font-bold uppercase tracking-wider">Patrón Estable</span>
                    <span className="px-3 py-1.5 bg-secondary text-foreground border border-border rounded-lg text-xs font-bold uppercase tracking-wider">Hidratación Óptima</span>
                  </div>
                </div>
                <div className="md:w-1/2 flex items-center justify-center py-4 relative">
                  <svg className="overflow-visible w-[240px] h-[240px]" viewBox="0 0 200 200">
                    <polygon className="text-border" points="100,20 176,75 147,165 53,165 24,75" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" fill="none"></polygon>
                    <polygon className="text-border" points="100,40 157,81 135,148 65,148 43,81" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" fill="none"></polygon>
                    <polygon className="text-border" points="100,60 138,88 123,132 77,132 62,88" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" fill="none"></polygon>
                    <polygon className="text-border" points="100,80 119,94 111,116 89,116 81,94" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" fill="none"></polygon>
                    <polygon points="100,35 165,78 140,150 75,145 35,70" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2.5" className="text-violet-600 dark:text-violet-500"></polygon>
                    <text fill="currentColor" fontSize="7" fontWeight="700" textAnchor="middle" x="100" y="12" className="text-muted-foreground opacity-90 uppercase">Horarios</text>
                    <text fill="currentColor" fontSize="7" fontWeight="700" textAnchor="start" x="182" y="77" className="text-muted-foreground opacity-90 uppercase">Nutrición</text>
                    <text fill="currentColor" fontSize="7" fontWeight="700" textAnchor="middle" x="160" y="176" className="text-muted-foreground opacity-90 uppercase">Humor</text>
                    <text fill="currentColor" fontSize="7" fontWeight="700" textAnchor="middle" x="40" y="176" className="text-muted-foreground opacity-90 uppercase">Agua</text>
                    <text fill="currentColor" fontSize="7" fontWeight="700" textAnchor="end" x="18" y="77" className="text-muted-foreground opacity-90 uppercase">Registro</text>
                  </svg>
                </div>
              </div>
            </div>

            {/* Color Plate Trend (Tendencia del Plato Colorido) */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-card border border-border p-6 rounded-2xl space-y-6">
              <div>
                <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-1">Diversidad de Fitonutrientes</p>
                <h3 className="text-xl font-extrabold text-foreground">Tendencia del Plato Colorido (Color Plate Trend)</h3>
                <p className="text-sm text-muted-foreground mt-1">Análisis de la distribución de colores de los alimentos ingeridos en tu diario.</p>
              </div>

              {/* Stacked Horizontal Bar */}
              <div className="h-6 w-full rounded-xl overflow-hidden flex shadow-inner border border-border/40 select-none">
                <div className="h-full bg-emerald-500 transition-all duration-300 flex items-center justify-center text-[10px] font-extrabold text-white animate-in slide-in-from-left duration-500" style={{ width: "35%" }} title="Verde: 35%">35%</div>
                <div className="h-full bg-rose-500 transition-all duration-300 flex items-center justify-center text-[10px] font-extrabold text-white animate-in slide-in-from-left duration-500" style={{ width: "15%" }} title="Rojo: 15%">15%</div>
                <div className="h-full bg-amber-500 transition-all duration-300 flex items-center justify-center text-[10px] font-extrabold text-white animate-in slide-in-from-left duration-500" style={{ width: "20%" }} title="Amarillo/Naranja: 20%">20%</div>
                <div className="h-full bg-slate-200 dark:bg-slate-300 transition-all duration-300 flex items-center justify-center text-[10px] font-extrabold text-slate-800 animate-in slide-in-from-left duration-500" style={{ width: "12%" }} title="Blanco: 12%">12%</div>
                <div className="h-full bg-[#92400e] transition-all duration-300 flex items-center justify-center text-[10px] font-extrabold text-white animate-in slide-in-from-left duration-500" style={{ width: "13%" }} title="Marrón: 13%">13%</div>
                <div className="h-full bg-secondary/80 text-muted-foreground transition-all duration-300 flex items-center justify-center text-[10px] font-extrabold animate-in slide-in-from-left duration-500" style={{ width: "5%" }} title="Otros: 5%">5%</div>
              </div>

              {/* Legends Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-2">
                <div className="p-3 bg-secondary/20 rounded-xl border border-border/40 flex flex-col justify-between hover:border-foreground/20 transition-all duration-300">
                  <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-full bg-emerald-500"></div>
                    <span className="text-[11px] font-bold text-foreground">Verde</span>
                  </div>
                  <span className="text-lg font-black text-foreground mt-1.5">35%</span>
                  <span className="text-[11px] text-muted-foreground font-medium">Vegetales y hojas</span>
                </div>

                <div className="p-3 bg-secondary/20 rounded-xl border border-border/40 flex flex-col justify-between hover:border-foreground/20 transition-all duration-300">
                  <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-full bg-rose-500"></div>
                    <span className="text-[11px] font-bold text-foreground">Rojo</span>
                  </div>
                  <span className="text-lg font-black text-foreground mt-1.5">15%</span>
                  <span className="text-[11px] text-muted-foreground font-medium">Tomates y frutos rojos</span>
                </div>

                <div className="p-3 bg-secondary/20 rounded-xl border border-border/40 flex flex-col justify-between hover:border-foreground/20 transition-all duration-300">
                  <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-full bg-amber-500"></div>
                    <span className="text-[11px] font-bold text-foreground">Amarillo/Nar</span>
                  </div>
                  <span className="text-lg font-black text-foreground mt-1.5">20%</span>
                  <span className="text-[11px] text-muted-foreground font-medium">Cítricos y zanahorias</span>
                </div>

                <div className="p-3 bg-secondary/20 rounded-xl border border-border/40 flex flex-col justify-between hover:border-foreground/20 transition-all duration-300">
                  <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-full bg-slate-300 dark:bg-slate-400"></div>
                    <span className="text-[11px] font-bold text-foreground">Blanco</span>
                  </div>
                  <span className="text-lg font-black text-foreground mt-1.5">12%</span>
                  <span className="text-[11px] text-muted-foreground font-medium">Ajo, cebolla y hongos</span>
                </div>

                <div className="p-3 bg-secondary/20 rounded-xl border border-border/40 flex flex-col justify-between hover:border-foreground/20 transition-all duration-300">
                  <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-full bg-[#92400e]"></div>
                    <span className="text-[11px] font-bold text-foreground">Marrón</span>
                  </div>
                  <span className="text-lg font-black text-foreground mt-1.5">13%</span>
                  <span className="text-[11px] text-muted-foreground font-medium">Granos y proteínas</span>
                </div>

                <div className="p-3 bg-secondary/20 rounded-xl border border-border/40 flex flex-col justify-between hover:border-foreground/20 transition-all duration-300">
                  <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-full bg-muted"></div>
                    <span className="text-[11px] font-bold text-foreground">Otros</span>
                  </div>
                  <span className="text-lg font-black text-foreground mt-1.5">5%</span>
                  <span className="text-[11px] text-muted-foreground font-medium">Otros alimentos</span>
                </div>
              </div>
            </div>

            {/* Bottom Info Cards */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 bg-card border border-border rounded-xl flex items-center gap-4">
                <div className="size-12 rounded-lg bg-secondary flex items-center justify-center text-foreground shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Precisión de Nutrición</p>
                  <p className="text-lg font-black text-foreground">92% Match</p>
                </div>
              </div>
              <div className="p-5 bg-card border border-border rounded-xl flex items-center gap-4">
                <div className="size-12 rounded-lg bg-secondary flex items-center justify-center text-foreground shrink-0">
                  <Droplet className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Promedio Hidratación</p>
                  <p className="text-lg font-black text-foreground">2.4L / día</p>
                </div>
              </div>
              <div className="p-5 bg-card border border-border rounded-xl flex items-center gap-4">
                <div className="size-12 rounded-lg bg-secondary flex items-center justify-center text-foreground shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Regularidad</p>
                  <p className="text-lg font-black text-foreground">Estabilidad Alta</p>
                </div>
              </div>
            </div>
          </div>

          <footer className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-muted-foreground text-xs">
            <p>© 2026 Wellfooder Wellness Lab. Premium Intelligence.</p>
            <div className="flex gap-6 font-bold">
              <a className="hover:text-primary transition-colors" href="#">Políticas de Privacidad</a>
              <a className="hover:text-primary transition-colors" href="#">Metodología</a>
              <a className="hover:text-primary transition-colors" href="#">Soporte</a>
            </div>
          </footer>
        </div>
      )}

      {subTab === "recuperacion" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">Monitorea y edita el estado de fatiga de tus grupos musculares.</p>
              <button 
                type="button"
                onClick={() => setShowRecoveryInfo(!showRecoveryInfo)}
                className={`p-1.5 rounded-full transition-colors shrink-0 flex items-center justify-center ${
                  showRecoveryInfo ? "bg-secondary text-foreground" : "hover:bg-secondary text-muted-foreground"
                }`}
                title="Explicación de exclusión"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
            <Button
              onClick={() => setIsEditingRecovery(!isEditingRecovery)}
              variant={isEditingRecovery ? "default" : "outline"}
              className="h-10 px-4 rounded-xl font-bold flex items-center gap-2 text-xs transition-colors shrink-0"
            >
              {isEditingRecovery ? (
                <>
                  <Check className="w-4 h-4" />
                  Guardar Estado
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4" />
                  Editar Estado
                </>
              )}
            </Button>
          </div>

          {/* Info Banner (Toggled by "i" button) */}
          {showRecoveryInfo && (
            <div className="bg-card border border-border rounded-2xl p-5 space-y-4 text-xs leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex gap-3 pb-3 border-b border-border/50">
                <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-foreground mb-0.5">Exclusión de Músculos por Fatiga</span>
                  <span className="text-muted-foreground">
                    Los grupos musculares con recuperación **inferior al 70%** se excluirán automáticamente del Generador de Workouts con IA para prevenir lesiones y optimizar el descanso.
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <span className="block font-bold text-foreground">¿Cómo estimar tu porcentaje de recuperación?</span>
                <p className="text-muted-foreground">Utiliza esta guía física y muscular sencilla para arrastrar los deslizadores al valor adecuado:</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-secondary/15 rounded-xl border border-border/40 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-500">
                      <div className="size-2 rounded-full bg-emerald-500" />
                      <span>90% - 100% (Listo/Sano)</span>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed">Sin agujetas, dolor ni molestia. Fuerza al máximo y rango de movimiento normal completo.</p>
                  </div>

                  <div className="p-3 bg-secondary/15 rounded-xl border border-border/40 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-500">
                      <div className="size-2 rounded-full bg-teal-500" />
                      <span>70% - 80% (Leve cansancio)</span>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed">Cansancio muscular leve o agujetas mínimas que desaparecen al calentar. Fuerza normal.</p>
                  </div>

                  <div className="p-3 bg-secondary/15 rounded-xl border border-border/40 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-500">
                      <div className="size-2 rounded-full bg-amber-500" />
                      <span>50% - 60% (Fatiga moderada)</span>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed">Agujetas moderadas (DOMS) al tacto o al estirar. Rigidez leve. Evita entrenar hoy este músculo a alta intensidad.</p>
                  </div>

                  <div className="p-3 bg-secondary/15 rounded-xl border border-border/40 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-500">
                      <div className="size-2 rounded-full bg-rose-500" />
                      <span>Menos de 50% (Sobrecarga)</span>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed">Dolor fuerte o rigidez limitante en la vida diaria. Pérdida notable de fuerza. Requiere descanso absoluto.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Muscles List */}
          <div className="space-y-3">
            {muscleImages.map(m => {
              const value = muscleRecovery[m.id] ?? 100;
              const isExcluded = value < 70;
              return (
                <div key={m.id} className="flex items-center justify-between p-4 bg-card border border-border rounded-2xl transition duration-300 hover:border-foreground/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary/40 flex items-center justify-center p-1.5 shrink-0 border border-border/40">
                      <img src={m.img} alt={m.name} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-foreground">{m.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    {isEditingRecovery ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={value}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setMuscleRecovery(prev => ({ ...prev, [m.id]: val }));
                          }}
                          className="w-24 sm:w-32 h-1.5 bg-secondary rounded-lg cursor-pointer accent-foreground"
                        />
                        <span className="text-xs font-extrabold text-foreground w-8 text-right shrink-0">{value}%</span>
                      </div>
                    ) : (
                      <div 
                        onClick={() => setIsEditingRecovery(true)}
                        className="flex items-center gap-2.5 cursor-pointer group"
                        title="Haga clic para editar manualmente"
                      >
                        <span className="text-xs font-extrabold text-foreground w-8 text-right shrink-0">{value}%</span>
                        <div className="w-20 h-2 bg-secondary rounded-full overflow-hidden shrink-0">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${isExcluded ? "bg-rose-500" : "bg-emerald-500"}`}
                            style={{ width: `${value}%` }}
                          />
                        </div>
                        <Edit className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <footer className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-muted-foreground text-xs">
            <p>© 2026 Wellfooder Wellness Lab. Premium Intelligence.</p>
            <div className="flex gap-6 font-bold">
              <a className="hover:text-primary transition-colors" href="#">Políticas de Privacidad</a>
              <a className="hover:text-primary transition-colors" href="#">Metodología</a>
              <a className="hover:text-primary transition-colors" href="#">Soporte</a>
            </div>
          </footer>
        </div>
      )}

      {/* FAB Overlay Blur */}
      {isFabOpen && (
        <div 
          className="fixed inset-0 bg-background/60 backdrop-blur-md z-40 animate-in fade-in duration-300"
          onClick={() => setIsFabOpen(false)}
        />
      )}

      {/* FAB Menu */}
      <div className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-50 flex flex-col items-end gap-4">
        {isFabOpen && (
          <div className="flex flex-col items-end gap-3 animate-in slide-in-from-bottom-5 fade-in duration-200">
            <button 
              className="flex items-center gap-3 group" 
              onClick={() => {
                setIsFabOpen(false);
                setActiveModal("generate-workout");
              }}
            >
              <span className="bg-card text-foreground text-xs font-bold px-3 py-2 rounded-lg border border-border shadow-sm group-hover:scale-105 transition-transform">Generar Workout con IA</span>
              <div className="w-12 h-12 rounded-full bg-card border border-border shadow-sm flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5 fill-current" />
              </div>
            </button>
            <button 
              className="flex items-center gap-3 group" 
              onClick={() => {
                setIsFabOpen(false);
                setActiveModal("workout-library");
              }}
            >
              <span className="bg-card text-foreground text-xs font-bold px-3 py-2 rounded-lg border border-border shadow-sm group-hover:scale-105 transition-transform">Crear workout manualmente</span>
              <div className="w-12 h-12 rounded-full bg-card border border-border shadow-sm flex items-center justify-center text-foreground group-hover:scale-110 transition-transform">
                <Dumbbell className="w-5 h-5" />
              </div>
            </button>
            <button className="flex items-center gap-3 group" onClick={() => setIsFabOpen(false)}>
              <span className="bg-card text-foreground text-xs font-bold px-3 py-2 rounded-lg border border-border shadow-sm group-hover:scale-105 transition-transform">Registrar hidratación</span>
              <div className="w-12 h-12 rounded-full bg-card border border-border shadow-sm flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                <Droplet className="w-5 h-5" />
              </div>
            </button>
            <button className="flex items-center gap-3 group" onClick={() => setIsFabOpen(false)}>
              <span className="bg-card text-foreground text-xs font-bold px-3 py-2 rounded-lg border border-border shadow-sm group-hover:scale-105 transition-transform">Registrar actividad</span>
              <div className="w-12 h-12 rounded-full bg-card border border-border shadow-sm flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
            </button>
            <button 
              className="flex items-center gap-3 group" 
              onClick={() => {
                setIsFabOpen(false);
                setActiveModal("food-analysis");
                setFoodAnalysisStep("upload");
              }}
            >
              <span className="bg-card text-foreground text-xs font-bold px-3 py-2 rounded-lg border border-border shadow-sm group-hover:scale-105 transition-transform">Registrar comida</span>
              <div className="w-12 h-12 rounded-full bg-card border border-border shadow-sm flex items-center justify-center text-foreground group-hover:scale-110 transition-transform">
                <Camera className="w-5 h-5" />
              </div>
            </button>
          </div>
        )}
        
        <button 
          onClick={() => setIsFabOpen(!isFabOpen)}
          className="w-14 h-14 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className={`w-6 h-6 transition-transform duration-300 ${isFabOpen ? "rotate-45" : ""}`} />
        </button>
      </div>

      {/* Food Analysis Modal */}
      {activeModal === "food-analysis" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-card border border-border rounded-[2rem] shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
            {/* Header */}
            <div className="px-6 pt-8 pb-4 flex justify-between items-center bg-card">
              <h3 className="text-sm font-bold tracking-widest uppercase text-muted-foreground">Nutrition Report</h3>
              <button 
                onClick={() => { setActiveModal("none"); setFoodAnalysisStep("upload"); }} 
                className="p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {foodAnalysisStep === "upload" && (
              <div className="p-8 flex flex-col items-center justify-center gap-6 min-h-[400px]">
                <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center">
                  <Camera className="w-10 h-10 text-muted-foreground" />
                </div>
                <p className="text-center text-sm font-medium text-muted-foreground">Toma una foto de tu comida para analizar sus macros y valor nutricional con IA.</p>
                <Button 
                  onClick={() => setFoodAnalysisStep("analyzing")} 
                  className="w-full rounded-xl h-12 text-base font-bold bg-foreground text-background hover:opacity-90 mt-4"
                >
                  Tomar Fotografía
                </Button>
              </div>
            )}

            {foodAnalysisStep === "analyzing" && (
              <div className="p-8 flex flex-col items-center justify-center gap-6 min-h-[400px]">
                <Loader2 className="w-12 h-12 text-foreground animate-spin" />
                <p className="text-center text-sm font-bold text-foreground">Procesando y analizando...</p>
              </div>
            )}

            {foodAnalysisStep === "report" && (
              <div className="px-6 pb-8 overflow-y-auto animate-in slide-in-from-bottom-4 fade-in duration-300">
                <h2 className="text-[22px] font-black text-foreground leading-tight tracking-tight mb-3">Chicken Phở with Noodles, Veggies and Broth</h2>
                <p className="text-sm text-foreground/80 leading-relaxed font-medium mb-8">
                  This Vietnamese noodle soup gets lean protein from the chicken and fiber from bean sprouts, all minimally processed. Fish sauce-based broths tend to be high in sodium, and the noodles are made from refined grains.
                </p>
                
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Overview</h4>
                <h3 className="text-4xl font-light text-foreground mb-1 tracking-tight">HIGH</h3>
                <p className="text-sm font-semibold text-foreground mb-6">Nutritional Value</p>
                
                {/* Progress Bar */}
                <div className="flex justify-between text-[11px] font-bold text-muted-foreground mb-2">
                  <span>Very Low</span>
                  <span>Very High</span>
                </div>
                <div className="flex gap-1 mb-8">
                  <div className="h-1 flex-1 rounded-full bg-border"></div>
                  <div className="h-1 flex-1 rounded-full bg-border"></div>
                  <div className="h-1 flex-1 rounded-full bg-border"></div>
                  <div className="h-1 flex-1 rounded-full bg-blue-600 dark:bg-blue-500"></div>
                  <div className="h-1 flex-1 rounded-full bg-border"></div>
                </div>
                
                {/* Detail List */}
                <div className="space-y-4">
                  {[
                    { label: "Processing", value: "Minimally Processed", icon: "check" },
                    { label: "Fiber", value: "Good Source", icon: "check" },
                    { label: "Protein", value: "Lean", icon: "check" },
                    { label: "Added Sugars", value: "Zero", icon: "check" },
                    { label: "Fat", value: "Moderate", icon: "warn" },
                    { label: "Grains", value: "Refined", icon: "check" },
                    { label: "Sodium", value: "Elevated", icon: "check" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0 last:pb-0">
                      <span className="text-[13px] font-bold text-foreground">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-semibold text-blue-600/90 dark:text-blue-400">{item.value}</span>
                        {item.icon === "check" ? (
                          <Check className="w-[18px] h-[18px] text-blue-600 dark:text-blue-500" strokeWidth={3} />
                        ) : (
                          <AlertCircle className="w-[18px] h-[18px] text-muted-foreground" strokeWidth={2.5} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-border flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-muted-foreground shrink-0" />
                  <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                    Visual identification may be inaccurate. Always check important details manually.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Workout Generator Modal */}
      {activeModal === "generate-workout" && (
        <WorkoutGeneratorModal 
          onClose={() => setActiveModal("none")} 
          onGenerate={() => setActiveModal("workout-feedback")} 
          muscleRecovery={muscleRecovery}
        />
      )}

      {/* Workout Feedback Modal */}
      {activeModal === "workout-feedback" && (
        <WorkoutFeedbackModal 
          onClose={() => setActiveModal("none")} 
          onComplete={() => {
            // For AI workout, we can simulate training some muscles (e.g. Espalda and Bíceps)
            handleWorkoutComplete([
              { muscles: "Dorsal Ancho, Bíceps" },
              { muscles: "Deltoides Anterior" }
            ]);
          }}
        />
      )}

      {/* Workout Library Modal */}
      {activeModal === "workout-library" && (
        <WorkoutLibraryModal 
          onClose={() => setActiveModal("none")}
          customWorkouts={customWorkouts}
          onStartWorkout={(w) => {
            setSelectedCustomWorkout(w);
            setActiveModal("workout-feedback-custom");
          }}
          onEditWorkout={(w) => {
            setWorkoutToEdit(w);
            setActiveModal("create-custom-workout");
          }}
          onDeleteWorkout={(id) => {
            setCustomWorkouts(customWorkouts.filter(x => x.id !== id));
          }}
          onCreateNew={() => {
            setWorkoutToEdit(null);
            setActiveModal("create-custom-workout");
          }}
        />
      )}

      {/* Manual Workout Creator Modal */}
      {activeModal === "create-custom-workout" && (
        <ManualWorkoutCreatorModal 
          onClose={() => setActiveModal("workout-library")}
          workoutToEdit={workoutToEdit}
          onSave={(workout) => {
            if (workoutToEdit) {
              setCustomWorkouts(customWorkouts.map(x => x.id === workout.id ? workout : x));
            } else {
              setCustomWorkouts([...customWorkouts, workout]);
            }
            setActiveModal("workout-library");
          }}
        />
      )}

      {/* Custom Workout Session Modal (Reuses feedback modal) */}
      {activeModal === "workout-feedback-custom" && selectedCustomWorkout && (
        <WorkoutFeedbackModal 
          onClose={() => {
            setActiveModal("workout-library");
            setSelectedCustomWorkout(null);
          }} 
          customExercises={selectedCustomWorkout.exercises}
          workoutTitle={selectedCustomWorkout.name}
          onComplete={() => handleWorkoutComplete(selectedCustomWorkout.exercises)}
        />
      )}
    </div>
  );
}
