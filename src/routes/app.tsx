import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import { 
  User, Calendar, BarChart3, CreditCard, Settings, 
  LogOut, QrCode, CheckCircle, Clock, AlertTriangle, 
  MapPin, ChevronRight, ChevronLeft, X, Sparkles, Shield, AlertCircle, ShieldAlert, Star, Heart,
  Flame, Coffee, Droplet, TrendingUp, Info, Edit, Sun, Moon, ArrowUpRight, Utensils,
  Camera, Dumbbell, Activity, Plus, Check, Loader2,
  Play, Pause, RotateCcw, Search, ChevronUp, ChevronDown, Trash2, FileDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tooltip as ShadcnTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel
} from "@/components/ui/alert-dialog";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
  BarChart, Bar, Cell, RadarChart, Radar, PolarGrid,
  PieChart, Pie,
  RadialBarChart, RadialBar, PolarRadiusAxis, PolarAngleAxis, Label
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";
// @ts-ignore
import * as SunCalc from "suncalc";

const SYMPTOMS_DATA = [
  { symptom: "ninguno", count: 18, fill: "var(--color-ninguno)" },
  { symptom: "cabeza", count: 14, fill: "var(--color-cabeza)" },
  { symptom: "fatiga", count: 10, fill: "var(--color-fatiga)" },
  { symptom: "hinchazon", count: 8, fill: "var(--color-hinchazon)" },
  { symptom: "humor", count: 7, fill: "var(--color-humor)" },
  { symptom: "estomago", count: 5, fill: "var(--color-estomago)" },
  { symptom: "nauseas", count: 3, fill: "var(--color-nauseas)" },
  { symptom: "otro", count: 2, fill: "var(--color-otro)" }
];

const SYMPTOMS_CHART_CONFIG = {
  ninguno: { label: "Ninguno", color: "#10b981" },
  cabeza: { label: "Dolor de cabeza", color: "#8b5cf6" },
  fatiga: { label: "Fatiga", color: "#f59e0b" },
  hinchazon: { label: "Hinchazón", color: "#f97316" },
  humor: { label: "Cambios de humor", color: "#ec4899" },
  estomago: { label: "Dolor de estómago", color: "#ef4444" },
  nauseas: { label: "Náuseas", color: "#eab308" },
  otro: { label: "Otro", color: "#94a3b8" }
};

const WHY_EAT_DATA = [
  { reason: "hambre", label: "Hambre", percentage: 35, fill: "var(--color-hambre)" },
  { reason: "estres", label: "Estrés", percentage: 15, fill: "var(--color-estres)" },
  { reason: "sabor", label: "Sabor", percentage: 15, fill: "var(--color-sabor)" },
  { reason: "social", label: "Social", percentage: 10, fill: "var(--color-social)" },
  { reason: "habito", label: "Hábito", percentage: 10, fill: "var(--color-habito)" },
  { reason: "emocional", label: "Emocional", percentage: 8, fill: "var(--color-emocional)" },
  { reason: "aburrimiento", label: "Aburrimiento", percentage: 5, fill: "var(--color-aburrimiento)" },
  { reason: "otro", label: "Otro", percentage: 2, fill: "var(--color-otro)" }
];

const WHY_EAT_CHART_CONFIG = {
  percentage: {
    label: "Porcentaje"
  },
  hambre: { label: "Hambre", color: "#10b981" },
  estres: { label: "Estrés", color: "#ef4444" },
  sabor: { label: "Sabor", color: "#eab308" },
  social: { label: "Social", color: "#0ea5e9" },
  habito: { label: "Hábito", color: "#6366f1" },
  emocional: { label: "Emocional", color: "#ec4899" },
  aburrimiento: { label: "Aburrimiento", color: "#a855f7" },
  otro: { label: "Otro", color: "#94a3b8" }
};

const ADHERENCE_DATA = [
  { name: "adherencia", value: 85, fill: "var(--color-adherencia)" }
];

const ADHERENCE_CHART_CONFIG = {
  value: {
    label: "Adherencia"
  },
  adherencia: {
    label: "Adherencia Nutricional",
    color: "#10b981"
  }
};

const STABILITY_DATA = [
  { subject: "Horarios", value: 85 },
  { subject: "Nutrición", value: 90 },
  { subject: "Humor", value: 75 },
  { subject: "Hidratación", value: 80 },
  { subject: "Consistencia", value: 95 }
];

const STABILITY_CHART_CONFIG = {
  value: {
    label: "Estabilidad",
    color: "#10b981"
  }
} satisfies ChartConfig;

const COLOR_PLATE_DATA = [
  { colorKey: "verde", percentage: 35, fill: "var(--color-verde)" },
  { colorKey: "amarillo", percentage: 20, fill: "var(--color-amarillo)" },
  { colorKey: "rojo", percentage: 15, fill: "var(--color-rojo)" },
  { colorKey: "marron", percentage: 13, fill: "var(--color-marron)" },
  { colorKey: "blanco", percentage: 12, fill: "var(--color-blanco)" },
  { colorKey: "otros", percentage: 5, fill: "var(--color-otros)" }
];

const COLOR_PLATE_CHART_CONFIG = {
  percentage: {
    label: "Porcentaje"
  },
  verde: { label: "Verde (Vegetales)", color: "#10b981" },
  amarillo: { label: "Amarillo/Naranja (Cítricos)", color: "#f59e0b" },
  rojo: { label: "Rojo (Frutos rojos)", color: "#f43f5e" },
  marron: { label: "Marrón (Granos/Proteínas)", color: "#92400e" },
  blanco: { label: "Blanco (Ajo/Hongos)", color: "#cbd5e1" },
  otros: { label: "Otros (Semillas)", color: "#94a3b8" }
} satisfies ChartConfig;

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
  const [checkedExercises, setCheckedExercises] = useState<Record<number, boolean>>({});
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [restMaxSeconds, setRestMaxSeconds] = useState<number>(60);
  const [showGeneralFeedback, setShowGeneralFeedback] = useState(false);
  const [generalRating, setGeneralRating] = useState<number>(0);
  const [finalEnergy, setFinalEnergy] = useState<string>("");
  const [generalComments, setGeneralComments] = useState<string>("");

  const toggleCheckExercise = (id: number) => {
    setCheckedExercises(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSetFeedback = (exerciseId: number, key: "intensity" | "technique", value: string) => {
    setFeedback(prev => {
      const next = {
        ...prev,
        [exerciseId]: {
          ...prev[exerciseId],
          [key]: value
        }
      };
      
      const current = next[exerciseId];
      if (current?.intensity && current?.technique) {
        const alreadyFilled = prev[exerciseId]?.intensity && prev[exerciseId]?.technique;
        if (!alreadyFilled) {
          const ex = exercises.find(e => e.id === exerciseId);
          if (ex && ex.rest) {
            setActiveRestId(ex.id);
            setRestSeconds(ex.rest);
            setRestMaxSeconds(ex.rest);
          }
        }
      }
      return next;
    });
  };

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

  if (showGeneralFeedback) {
    return (
      <div className="fixed inset-0 z-[70] flex flex-col bg-background/95 backdrop-blur-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-300">
        <div className="flex-1 overflow-y-auto px-4 py-12 pb-12 flex items-center justify-center">
          <div className="max-w-md w-full mx-auto bg-card border border-border/80 rounded-[2.5rem] shadow-2xl p-8 space-y-8 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mx-auto mb-2">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h2 className="text-2xl font-black text-foreground tracking-tight">¡Entrenamiento Finalizado!</h2>
              <p className="text-xs text-muted-foreground font-medium">
                Has registrado una sesión de <span className="font-bold text-foreground">{formatTime(seconds)}</span>. ¡Gran esfuerzo hoy!
              </p>
            </div>

            {/* Star Rating */}
            <div className="space-y-3">
              <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest block text-center">¿Cómo calificarías este entrenamiento?</span>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isActive = star <= generalRating;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setGeneralRating(star)}
                      className={`p-1.5 rounded-xl transition-all ${
                        isActive 
                          ? "text-yellow-500 scale-110" 
                          : "text-muted-foreground/30 hover:text-yellow-500/60 hover:scale-105"
                      }`}
                    >
                      <Star className={`w-8 h-8 ${isActive ? "fill-yellow-500" : ""}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Energy Emojis */}
            <div className="space-y-3">
              <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest block text-center">¿Cómo te sientes de energía al terminar?</span>
              <div className="flex items-center justify-center gap-3">
                {[
                  { emoji: "😫", label: "Agotado" },
                  { emoji: "🥱", label: "Cansado" },
                  { emoji: "😐", label: "Normal" },
                  { emoji: "🙂", label: "Bien" },
                  { emoji: "⚡", label: "Con energía" }
                ].map((item) => {
                  const isActive = finalEnergy === item.emoji;
                  return (
                    <button
                      key={item.emoji}
                      type="button"
                      onClick={() => setFinalEnergy(item.emoji)}
                      className={`w-12 h-12 text-2xl rounded-2xl flex flex-col items-center justify-center border transition-all ${
                        isActive
                          ? "bg-foreground text-background border-foreground scale-110 shadow-lg"
                          : "bg-secondary/40 border-border text-foreground hover:bg-secondary hover:scale-105"
                      }`}
                      title={item.label}
                    >
                      {item.emoji}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comments Area */}
            <div className="space-y-2">
              <label className="text-[10px] text-muted-foreground font-black uppercase tracking-widest block font-bold">Feedback para tu Coach IA (Opcional)</label>
              <Textarea 
                value={generalComments}
                onChange={(e) => setGeneralComments(e.target.value)}
                placeholder="¿Qué tal estuvo la rutina? Cuéntale a tu Coach IA para personalizar y adaptar tu próxima sesión..."
                className="w-full min-h-[90px] px-4 py-3 rounded-2xl bg-secondary border border-border text-sm font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 transition-colors resize-none"
              />
            </div>

            {/* Action Buttons */}
            <Button
              onClick={() => {
                if (onComplete) onComplete();
                onClose();
              }}
              className="w-full h-14 rounded-2xl bg-foreground text-background font-black text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              Guardar y Finalizar
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
                        const isChecked = !!checkedExercises[ex.id];
                        return (
                          <div key={ex.id} className="space-y-4 relative">
                            {/* Dot linking indicator */}
                            <div className="absolute -left-[27px] top-4 w-3 h-3 rounded-full bg-background border-2 border-rose-500 flex items-center justify-center">
                              <div className="w-1 h-1 rounded-full bg-rose-500" />
                            </div>

                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3 min-w-0">
                                <Checkbox
                                  id={`check-${ex.id}`}
                                  checked={isChecked}
                                  disabled={!workoutStarted}
                                  onCheckedChange={() => toggleCheckExercise(ex.id)}
                                  className="h-6 w-6 rounded-full border-2 border-muted-foreground/30 data-[state=checked]:border-emerald-500 data-[state=checked]:bg-emerald-500 text-background transition-all shrink-0 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                                />
                                <div 
                                  className="flex items-center gap-4 cursor-pointer group min-w-0"
                                  onClick={() => setActiveDetailExercise(ex)}
                                >
                                  <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-border bg-card shrink-0">
                                    <img src={ex.img} alt={ex.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-bold text-foreground group-hover:underline leading-snug truncate">{ex.reps} {ex.name} • {ex.weight}</p>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">Ver detalles →</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Two Segmented Controls for exercise feedback */}
                            {isChecked && (
                              <div className="space-y-3 mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div>
                                  <span className="text-[9px] text-muted-foreground font-black uppercase tracking-wider block mb-1">Esfuerzo Percibido</span>
                                  <div className="flex rounded-xl overflow-hidden border border-border bg-secondary shadow-sm">
                                    {options.map((opt) => {
                                      const isActive = currentFeedback?.intensity === opt;
                                      return (
                                        <button
                                          key={opt}
                                          type="button"
                                          onClick={() => handleSetFeedback(ex.id, "intensity", opt)}
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
                                          onClick={() => handleSetFeedback(ex.id, "technique", opt)}
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
                            )}
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
                const isChecked = !!checkedExercises[ex.id];
                return (
                  <div key={ex.id} className="space-y-4 bg-card/20 border border-border/60 rounded-3xl p-5 relative">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <Checkbox
                          id={`check-${ex.id}`}
                          checked={isChecked}
                          disabled={!workoutStarted}
                          onCheckedChange={() => toggleCheckExercise(ex.id)}
                          className="h-6 w-6 rounded-full border-2 border-muted-foreground/30 data-[state=checked]:border-emerald-500 data-[state=checked]:bg-emerald-500 text-background transition-all shrink-0 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        />
                        <div 
                          className="flex items-center gap-4 cursor-pointer group min-w-0"
                          onClick={() => setActiveDetailExercise(ex)}
                        >
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-border bg-card shrink-0">
                            <img src={ex.img} alt={ex.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-foreground group-hover:underline leading-snug truncate">{ex.reps} {ex.name} • {ex.weight}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">Descanso: {ex.rest}s • Ver detalles →</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Two Segmented Controls for exercise feedback */}
                    {isChecked && (
                      <div className="space-y-3 mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div>
                          <span className="text-[9px] text-muted-foreground font-black uppercase tracking-wider block mb-1">Esfuerzo Percibido</span>
                          <div className="flex rounded-xl overflow-hidden border border-border bg-secondary shadow-sm">
                            {options.map((opt) => {
                              const isActive = currentFeedback?.intensity === opt;
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => handleSetFeedback(ex.id, "intensity", opt)}
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
                                  onClick={() => handleSetFeedback(ex.id, "technique", opt)}
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
                    )}
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
                    const allChecked = exercises.every(ex => checkedExercises[ex.id]);
                    if (allChecked) {
                      setIsRunning(false);
                      setShowGeneralFeedback(true);
                    } else {
                      setShowConfirmClose(true);
                    }
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

      {/* Prominent Rest Timer floating panel */}
      {activeRestId !== null && restSeconds > 0 && (
        <div className="fixed bottom-28 left-4 right-4 z-[80] md:max-w-xl md:mx-auto bg-card/95 backdrop-blur-2xl border border-border/80 rounded-[2rem] shadow-2xl p-6 flex items-center justify-between gap-4 animate-in slide-in-from-bottom-8 duration-300">
          <div className="flex items-center gap-4">
            {/* Visual timer circle progress indicator */}
            <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="28" className="stroke-secondary" strokeWidth="4" fill="none" />
                <circle 
                  cx="32" 
                  cy="32" 
                  r="28" 
                  className="stroke-primary transition-all duration-1000" 
                  strokeWidth="4" 
                  fill="none" 
                  strokeDasharray="176" 
                  strokeDashoffset={176 - (176 * restSeconds) / restMaxSeconds} 
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-lg font-black font-mono text-primary">{restSeconds}s</span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest block">Tiempo de Descanso</span>
              <span className="text-xs font-bold text-foreground">
                Siguiente: {exercises.find(e => e.id === activeRestId)?.name}
              </span>
            </div>
          </div>
          <button 
            onClick={() => setActiveRestId(null)}
            className="px-5 py-3 rounded-2xl bg-secondary hover:bg-rose-500/10 text-rose-500 hover:text-rose-500 font-extrabold text-xs uppercase tracking-wider transition-all border border-border"
          >
            Omitir
          </button>
        </div>
      )}

      {/* Submodal de detalles del ejercicio */}
      {activeDetailExercise && (
        <ExerciseDetailModal 
          exercise={activeDetailExercise} 
          onClose={() => setActiveDetailExercise(null)} 
        />
      )}

      {/* Incomplete Workout Confirmation Dialog */}
      <AlertDialog open={showConfirmClose} onOpenChange={setShowConfirmClose}>
        <AlertDialogContent className="rounded-[2rem] border border-border p-6 bg-card max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-black text-foreground flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              ¿Registrar incompleto?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed mt-2">
              Aún tienes ejercicios pendientes en tu rutina. ¿Quieres finalizar y registrar tu progreso actual de todas formas?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-4">
            <AlertDialogCancel className="w-full sm:w-auto h-11 rounded-xl bg-secondary text-foreground hover:bg-border border border-border font-bold text-xs uppercase tracking-wider">
              Seguir entrenando
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                setShowConfirmClose(false);
                setIsRunning(false);
                setShowGeneralFeedback(true);
              }}
              className="w-full sm:w-auto h-11 rounded-xl bg-rose-500 text-background hover:bg-rose-600 font-bold text-xs uppercase tracking-wider"
            >
              Sí, registrar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

const parseTimeToMinutes = (timeStr: string): number => {
  const cleanStr = timeStr.trim().toUpperCase();
  const isPM = cleanStr.includes("PM");
  const isAM = cleanStr.includes("AM");
  const baseTime = cleanStr.replace("AM", "").replace("PM", "").trim();
  const parts = baseTime.split(":");
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1] ? parseInt(parts[1], 10) : 0;
  
  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;
  
  return hours * 60 + minutes;
};

const formatDateLabel = (dateStr: string) => {
  try {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    
    const isToday = today.getFullYear() === date.getFullYear() &&
                    today.getMonth() === date.getMonth() &&
                    today.getDate() === date.getDate();
                    
    const isYesterday = yesterday.getFullYear() === date.getFullYear() &&
                        yesterday.getMonth() === date.getMonth() &&
                        yesterday.getDate() === date.getDate();
                        
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    const formatted = date.toLocaleDateString('es-ES', options);
    const capitalized = formatted.charAt(0).toUpperCase() + formatted.slice(1);
    
    if (isToday) {
      return `Hoy — ${capitalized}`;
    } else if (isYesterday) {
      return `Ayer — ${capitalized}`;
    } else {
      return capitalized;
    }
  } catch (err) {
    return dateStr;
  }
};

// Subcomponent: AI Coach Diario (Wellfooder Timeline)
function DiarioTab() {
  const [subTab, setSubTab] = useState<"diario" | "analisis" | "recuperacion">("diario");
  const [insightPeriod, setInsightPeriod] = useState<"day" | "week" | "month" | "quarter" | "all">("week");
  const [sunTimes, setSunTimes] = useState({ sunrise: "06:30", sunset: "20:15" });

  useEffect(() => {
    const getSolarTimes = (lat: number, lng: number) => {
      try {
        // @ts-ignore
        const times = SunCalc.getTimes(new Date(), lat, lng);
        const formatTime = (date: Date) => {
          return date.toLocaleTimeString("es-AR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
        };
        setSunTimes({
          sunrise: formatTime(times.sunrise),
          sunset: formatTime(times.sunset),
        });
      } catch (err) {
        console.error("Error al calcular horarios solares con SunCalc:", err);
      }
    };

    // Coordenadas por defecto (Buenos Aires)
    const defaultLat = -34.6037;
    const defaultLng = -58.3816;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          getSolarTimes(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn("Error de geolocalización, usando Buenos Aires:", error);
          getSolarTimes(defaultLat, defaultLng);
        },
        { enableHighAccuracy: false, timeout: 5000 }
      );
    } else {
      getSolarTimes(defaultLat, defaultLng);
    }
  }, []);
  const [mood, setMood] = useState(75);
  const [hunger, setHunger] = useState(40);
  const [energy, setEnergy] = useState(60);

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


  const [mealsGoal, setMealsGoal] = useState(3);


  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeModal === "food-analysis" && foodAnalysisStep === "analyzing") {
      timer = setTimeout(() => {
        setFoodAnalysisStep("report");
      }, 2500);
    }
    return () => clearTimeout(timer);
  }, [activeModal, foodAnalysisStep]);

  const timelineItems = React.useMemo(() => {
    const baseItems = [
      {
        id: "1",
        date: "2026-07-15",
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
        date: "2026-07-15",
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
        date: "2026-07-15",
        time: "08:15 AM",
        title: "Café Negro",
        subtitle: "Desayuno",
        type: "coffee",
        img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=150&q=80",
        kcal: 2,
        tag: "Sin Azúcar",
        coachFeedback: null,
      },
      {
        id: "4",
        date: "2026-07-14",
        time: "09:30 AM",
        title: "Omelette de Espinacas & Queso",
        subtitle: "Desayuno",
        type: "food",
        img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80",
        kcal: 320,
        tag: "Proteína Alta",
        coachFeedback: "Muy buena elección proteica por la mañana. Mantener un desayuno con bajo índice glucémico estabiliza tu energía por horas.",
      },
      {
        id: "5",
        date: "2026-07-14",
        time: "04:15 PM",
        title: "Snack de Nueces y Almendras",
        subtitle: "Snack",
        type: "food",
        img: null,
        kcal: 180,
        tag: "Grasas Saludables",
        coachFeedback: "El snack de frutos secos aporta ácidos grasos esenciales y saciedad antes de tu cena.",
      },
      {
        id: "6",
        date: "2026-07-13",
        time: "08:30 AM",
        title: "Café con Leche y Tostadas de Masa Madre",
        subtitle: "Desayuno",
        type: "food",
        img: null,
        kcal: 280,
        tag: "Energía Compleja",
        coachFeedback: "La masa madre es excelente para tu microbiota digestiva. Buena combinación energética para arrancar el día.",
      },
      {
        id: "7",
        date: "2026-07-13",
        time: "08:30 PM",
        title: "Salmón Grillado con Espárragos",
        subtitle: "Cena",
        type: "food",
        img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80",
        kcal: 540,
        tag: "Omega 3 y Fitoquímicos",
        coachFeedback: "Excelente cena ligera y rica en grasas saludables que promueven la recuperación celular durante el sueño profundo.",
      }
    ];

    const formatTime12h = (time24: string) => {
      try {
        const parts = time24.split(":");
        const hrs = parseInt(parts[0], 10);
        const mins = parts[1];
        const ampm = hrs >= 12 ? "PM" : "AM";
        const displayHrs = hrs % 12 || 12;
        return `${displayHrs}:${mins} ${ampm}`;
      } catch {
        return time24;
      }
    };

    const uniqueDates = Array.from(new Set(baseItems.map(item => item.date)));
    
    const circadianEvents: any[] = [];
    uniqueDates.forEach(d => {
      circadianEvents.push(
        {
          id: `circadian-sunrise-${d}`,
          date: d,
          time: formatTime12h(sunTimes.sunrise),
          title: "Hito Solar: Amanecer",
          subtitle: "Ritmo Circadiano",
          type: "sunrise",
          img: null,
          kcal: 0,
          tag: "Inicio de Fase de Luz",
          coachFeedback: "Amanecer biológico. Tu cuerpo frena la melatonina e inicia la secreción de cortisol. Momento ideal para exponerte a la luz natural y activar tu metabolismo.",
        },
        {
          id: `circadian-peak-${d}`,
          date: d,
          time: "01:00 PM",
          title: "Pico Metabólico",
          subtitle: "Eficiencia Digestiva",
          type: "peak",
          img: null,
          kcal: 0,
          tag: "Máxima Sensibilidad",
          coachFeedback: "Pico de sensibilidad a la insulina y temperatura corporal. Tu capacidad de asimilación de nutrientes es óptima. Excelente momento para tu comida principal.",
        },
        {
          id: `circadian-sunset-${d}`,
          date: d,
          time: formatTime12h(sunTimes.sunset),
          title: "Hito Solar: Atardecer",
          subtitle: "Ritmo Circadiano",
          type: "sunset",
          img: null,
          kcal: 0,
          tag: "Inicio de Fase Oscura",
          coachFeedback: "Atardecer biológico. Comienza la transición hacia la producción de melatonina. Se recomienda cenar ligero y evitar pantallas de luz azul intensa.",
        }
      );
    });

    return [...baseItems, ...circadianEvents].sort((a, b) => {
      if (a.date !== b.date) {
        return b.date.localeCompare(a.date);
      }
      return parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time);
    });
  }, [sunTimes]);

  const dynamicAdherence = React.useMemo(() => {
    const foodLogsByDate: { [date: string]: number } = {};
    const foodItems = timelineItems.filter(item => item.type === "food");
    
    foodItems.forEach(item => {
      foodLogsByDate[item.date] = (foodLogsByDate[item.date] || 0) + 1;
    });

    const dates = Object.keys(foodLogsByDate);
    if (dates.length === 0) return 0;

    let totalAdherence = 0;
    dates.forEach(d => {
      const count = foodLogsByDate[d];
      const dailyPct = Math.min(100, (count / mealsGoal) * 100);
      totalAdherence += dailyPct;
    });

    return Math.round(totalAdherence / dates.length);
  }, [timelineItems, mealsGoal]);

  const handleDownloadReport = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const filteredItems = timelineItems.filter(item => {
      try {
        const [year, month, day] = item.date.split("-").map(Number);
        const itemDate = new Date(year, month - 1, day);
        
        const today = new Date(2026, 6, 15);
        const diffTime = Math.abs(today.getTime() - itemDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (insightPeriod === "day") {
          return diffDays <= 1;
        } else if (insightPeriod === "week") {
          return diffDays <= 7;
        } else if (insightPeriod === "month") {
          return diffDays <= 30;
        } else if (insightPeriod === "quarter") {
          return diffDays <= 90;
        } else {
          return true;
        }
      } catch {
        return true;
      }
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="utf-8">
        <title>Reporte de Bienestar y Alimentación — Shakerfy</title>
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            color: #1e293b;
            line-height: 1.5;
            margin: 40px;
          }
          .header {
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 20px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .logo {
            font-size: 24px;
            font-weight: 800;
            color: #10b981;
          }
          .date {
            font-size: 13px;
            color: #475569;
          }
          .section-title {
            font-size: 18px;
            font-weight: 700;
            color: #0f172a;
            margin-top: 35px;
            margin-bottom: 15px;
            border-left: 4px solid #10b981;
            padding-left: 10px;
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 30px;
          }
          .card {
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            background: #f8fafc;
          }
          .card-title {
            font-weight: 700;
            font-size: 13px;
            color: #475569;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .card-value {
            font-size: 28px;
            font-weight: 800;
            color: #0f172a;
          }
          .bar-container {
            margin-bottom: 10px;
          }
          .bar-label {
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            font-weight: 600;
            margin-bottom: 4px;
            color: #334155;
          }
          .bar-track {
            background-color: #e2e8f0;
            height: 8px;
            border-radius: 4px;
            overflow: hidden;
          }
          .bar-fill {
            height: 100%;
            border-radius: 4px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            margin-bottom: 30px;
          }
          th, td {
            text-align: left;
            padding: 10px 12px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 12px;
          }
          th {
            background-color: #f1f5f9;
            font-weight: 700;
            color: #334155;
          }
          .badge {
            display: inline-block;
            padding: 3px 6px;
            border-radius: 4px;
            font-size: 9px;
            font-weight: 700;
            text-transform: uppercase;
          }
          .badge-food { background-color: #d1fae5; color: #065f46; }
          .badge-hydration { background-color: #dbeafe; color: #1e40af; }
          .badge-coffee { background-color: #fef3c7; color: #92400e; }
          .badge-circadian { background-color: #f3e8ff; color: #6b21a8; }
          .disclaimer {
            font-size: 10px;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
            padding-top: 15px;
            margin-top: 40px;
            text-align: center;
            line-height: 1.4;
          }
          @media print {
            body { margin: 15px; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">Shakerfy</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Pulse Smart — Wellness Lab</div>
          </div>
          <div class="date" style="text-align: right;">
            <div><strong>Usuario:</strong> Agustín</div>
            <div style="margin-top: 4px;"><strong>Rango:</strong> ${insightPeriod === "day" ? "Hoy" : insightPeriod === "week" ? "Últimos 7 días" : insightPeriod === "month" ? "Último mes" : "Último trimestre"}</div>
            <div style="margin-top: 4px;"><strong>Fecha Emisión:</strong> ${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
          </div>
        </div>

        <div class="grid">
          <div class="card">
            <div class="card-title">Adherencia Nutricional</div>
            <div class="card-value">${dynamicAdherence}%</div>
            <p style="font-size: 11px; color: #64748b; margin-top: 5px;">Consistencia calculada en base a tu objetivo diario de <strong>${mealsGoal} comidas</strong>.</p>
          </div>
          <div class="card">
            <div class="card-title">Estabilidad de Horarios</div>
            <div class="card-value">95%</div>
            <p style="font-size: 11px; color: #64748b; margin-top: 5px;">Alineación de tus ingestas con tus ventanas biológicas óptimas.</p>
          </div>
        </div>

        <div class="grid">
          <div class="card" style="background: white;">
            <div class="card-title" style="border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; margin-bottom: 12px;">Causas Principales de Ingesta</div>
            ${WHY_EAT_DATA.map(d => `
              <div class="bar-container">
                <div class="bar-label">
                  <span>${d.label}</span>
                  <span>${d.percentage}%</span>
                </div>
                <div class="bar-track">
                  <div class="bar-fill" style="background-color: ${WHY_EAT_CHART_CONFIG[d.reason as keyof typeof WHY_EAT_CHART_CONFIG]?.color || '#10b981'}; width: ${d.percentage}%;"></div>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="card" style="background: white;">
            <div class="card-title" style="border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; margin-bottom: 12px;">Síntomas Físicos Reportados</div>
            ${SYMPTOMS_DATA.map(d => {
              const maxCount = Math.max(...SYMPTOMS_DATA.map(x => x.count));
              const pct = Math.round((d.count / maxCount) * 100);
              const label = SYMPTOMS_CHART_CONFIG[d.symptom as keyof typeof SYMPTOMS_CHART_CONFIG]?.label || d.symptom;
              const color = SYMPTOMS_CHART_CONFIG[d.symptom as keyof typeof SYMPTOMS_CHART_CONFIG]?.color || '#cbd5e1';
              return `
                <div class="bar-container">
                  <div class="bar-label">
                    <span>${label}</span>
                    <span>${d.count} veces</span>
                  </div>
                  <div class="bar-track">
                    <div class="bar-fill" style="background-color: ${color}; width: ${pct}%;"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div class="section-title">Detalle del Registro Diario de Actividad</div>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Categoría</th>
              <th>Detalle / Registro</th>
              <th>Impacto / Feedback Nutricional</th>
            </tr>
          </thead>
          <tbody>
            ${filteredItems.map(item => `
              <tr>
                <td style="font-weight: 600;">${item.date}</td>
                <td style="font-weight: 600;">${item.time}</td>
                <td>
                  <span class="badge badge-${item.type === 'food' ? 'food' : item.type === 'hydration' ? 'hydration' : item.type === 'coffee' ? 'coffee' : 'circadian'}">
                    ${item.type === 'food' ? 'Comida' : item.type === 'hydration' ? 'Hidratación' : item.type === 'coffee' ? 'Café' : 'Hito Solar'}
                  </span>
                </td>
                <td><strong>${item.title}</strong>${item.kcal > 0 ? ` (${item.kcal} kcal)` : ''}</td>
                <td style="font-size: 11px; color: #475569;">${item.coachFeedback || 'N/A'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="disclaimer">
          <strong>Aviso Médico & Disclaimer:</strong> Este documento es un resumen de registros de hábitos y estimaciones circadianas con fines informativos de autoconocimiento. No constituye un diagnóstico médico, prescripción clínica ni asesoramiento nutricional formal. Por favor, consulte con su médico, nutricionista o profesional de la salud matriculado antes de realizar cambios significativos en su dieta, rutina de ayuno o hábitos biológicos.
        </div>

        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

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
    <div className="mx-auto w-full space-y-8 pb-16 max-w-2xl">
      {/* Header Section */}
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl sm:text-3xl font-bebas tracking-wider text-foreground uppercase select-none">
            Shakerfy
          </span>
          <button 
            type="button"
            onClick={() => setActiveModal("racha-actividad")}
            className="inline-flex items-center gap-1.5 text-[11px] font-black px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20 hover:bg-orange-500/20 active:scale-95 transition-all cursor-pointer shadow-sm"
            title="Ver racha de actividad"
          >
            <Flame className="w-3.5 h-3.5 fill-orange-500 animate-pulse text-orange-500" />
            12 días
          </button>
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

          {/* Timeline */}
          <div className="relative pl-6 md:pl-0">
            {/* Vertical Line */}
            <div className="absolute left-6 md:left-[50%] top-0 bottom-0 w-[2px] bg-border transform -translate-x-1/2 md:-translate-x-[1px]"></div>

            {(() => {
              let lastDate = "";
              return timelineItems.map((item, index) => {
                const showDateSeparator = item.date !== lastDate;
                if (showDateSeparator) {
                  lastDate = item.date;
                }
                
                const isEven = index % 2 === 0;
                const showOnLeft = !isEven; // Zig-zag on desktop
                
                const category = 
                  item.type === "sunrise" || item.type === "sunset" || item.type === "thought"
                    ? "mente"
                    : item.type === "peak"
                    ? "movimiento"
                    : "nutricion"; // food, coffee, hydration

                const catConfig = {
                  mente: {
                    // bg: "bg-gradient-to-br from-[#ff7b7c]/70 via-[#ff7b7c]/15 to-card dark:from-[#ff7b7c]/45 dark:via-[#ff7b7c]/8 dark:to-card",
                    bg: "",
                  },
                  nutricion: {
                    // bg: "bg-gradient-to-br from-[#aafc75]/70 via-[#aafc75]/15 to-card dark:from-[#aafc75]/45 dark:via-[#aafc75]/8 dark:to-card",
                    bg: "",
                  },
                  movimiento: {
                    // bg: "bg-gradient-to-br from-[#60f2fc]/70 via-[#60f2fc]/15 to-card dark:from-[#60f2fc]/45 dark:via-[#60f2fc]/8 dark:to-card",
                    bg: "",
                  }
                }[category];

                return (
                  <React.Fragment key={item.id}>
                    {showDateSeparator && (
                      <div className="relative flex justify-center my-8 pl-6 md:pl-0 w-full select-none">
                        <div className="absolute top-1/2 left-6 md:left-0 right-0 h-[1px] bg-border/40 -translate-y-1/2"></div>
                        <Badge 
                          variant="outline" 
                          className="relative z-10 bg-background text-[11px] font-bold px-4 py-1.5 rounded-full flex items-center gap-2 border-border shadow-none"
                        >
                          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>{formatDateLabel(item.date)}</span>
                        </Badge>
                      </div>
                    )}
                    
                    <div className="relative mb-12 md:grid md:grid-cols-2 md:gap-12 items-center group">
                      {/* Timeline Dot */}
                      <div className="absolute left-0 md:left-1/2 w-4.5 h-4.5 rounded-full border-4 bg-background z-10 transform -translate-x-1/2 border-muted-foreground/30"></div>

                      {/* Time Label for Desktop */}
                      <div className={`hidden md:block ${showOnLeft ? "text-right pr-6 md:order-2" : "text-left pl-6 md:order-1"}`}>
                        <span className="font-bold text-base text-muted-foreground">{item.time}</span>
                        <p className="text-muted-foreground/60 text-xs mt-0.5">{item.subtitle}</p>
                      </div>

                      {/* Card Container */}
                      <div className={`pl-6 md:pl-0 ${showOnLeft ? "md:order-1" : "md:order-2"}`}>
                        <Card className={`rounded-2xl overflow-hidden transition-all duration-300 shadow-none border-border ${catConfig.bg}`}>
                          {item.img && (
                            <div className="relative h-40 w-full overflow-hidden">
                              <img 
                                src={item.img} 
                                alt={item.title} 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                          )}

                          <CardHeader className="p-5 pb-3">
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-1">
                                <CardTitle className="text-base font-bold leading-tight text-foreground">{item.title}</CardTitle>
                                <CardDescription className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                  {item.subtitle}
                                </CardDescription>
                              </div>
                              {!item.img && (
                                <div className="w-9 h-9 rounded-full bg-secondary text-muted-foreground flex items-center justify-center shrink-0 border border-border/40">
                                  {item.type === "hydration" && <Droplet className="w-4.5 h-4.5" />}
                                  {item.type === "coffee" && <Coffee className="w-4.5 h-4.5" />}
                                  {item.type === "thought" && <Sparkles className="w-4.5 h-4.5" />}
                                  {item.type === "sunrise" && <Sun className="w-4.5 h-4.5" />}
                                  {item.type === "sunset" && <Moon className="w-4.5 h-4.5" />}
                                  {item.type === "peak" && <TrendingUp className="w-4.5 h-4.5" />}
                                </div>
                              )}
                            </div>
                          </CardHeader>

                          {(item.kcal > 0 || item.tag) && (
                            <CardContent className="px-5 pb-4 pt-0">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                {item.kcal > 0 && (
                                  <span className="flex items-center gap-0.5 font-medium">
                                    <Flame className="w-3.5 h-3.5" /> {item.kcal} kcal
                                  </span>
                                )}
                                {item.kcal > 0 && item.tag && <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />}
                                {item.tag && <span className="font-medium">{item.tag}</span>}
                              </div>
                            </CardContent>
                          )}

                          {!item.img && item.type === "hydration" && (
                            <CardContent className="px-5 pb-4 pt-0 space-y-2">
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
                            </CardContent>
                          )}

                          {/* Mobile-only Time Stamp */}
                          <div className="md:hidden px-5 pb-4 text-xs font-semibold text-muted-foreground">
                            <span>{item.time}</span>
                          </div>

                          {/* Coach / AI Feedback Section */}
                          {item.coachFeedback && (
                            <CardFooter className="px-5 py-4 bg-secondary/20 border-t border-border flex items-start gap-2.5">
                              {item.type === "sunrise" ? (
                                <Sun className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                              ) : item.type === "sunset" ? (
                                <Moon className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                              ) : item.type === "peak" ? (
                                <TrendingUp className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                              ) : (
                                <Sparkles className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                              )}
                              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                                {item.coachFeedback}
                              </p>
                            </CardFooter>
                          )}
                        </Card>
                      </div>
                    </div>
                  </React.Fragment>
                );
              });
            })()}
          </div>
        </>
      )}

      {subTab === "analisis" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="text-sm text-muted-foreground">Perspectivas detalladas de tu alimentación y bienestar.</p>
            
            <Select 
              value={insightPeriod} 
              onValueChange={(val: any) => setInsightPeriod(val)}
            >
              <SelectTrigger className="w-full sm:w-48 bg-card border border-border text-xs font-bold h-9">
                <SelectValue placeholder="Seleccionar período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="text-xs font-bold" value="day">Día</SelectItem>
                <SelectItem className="text-xs font-bold" value="week">Semana</SelectItem>
                <SelectItem className="text-xs font-bold" value="month">Mes</SelectItem>
                <SelectItem className="text-xs font-bold" value="quarter">Trimestre</SelectItem>
                <SelectItem className="text-xs font-bold" value="all">Desde siempre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Alimentación Consciente */}
            <Card className="col-span-1 flex flex-col justify-between">
              <CardHeader className="pb-0 flex flex-row items-start justify-between space-y-0">
                <div>
                  <div className="flex items-center gap-1.5">
                    <CardTitle className="text-lg font-bold text-foreground tracking-tight leading-none">Alimentación consciente</CardTitle>
                    <TooltipProvider>
                      <ShadcnTooltip>
                        <TooltipTrigger asChild>
                          <button type="button" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Información de alimentación consciente">
                            <Info className="w-3.5 h-3.5" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[280px] text-xs leading-relaxed">
                          El porcentaje de consistencia calculado en base a tu objetivo diario de comidas registradas versus las comidas reales cargadas en tu diario.
                        </TooltipContent>
                      </ShadcnTooltip>
                    </TooltipProvider>
                  </div>
                  <CardDescription className="text-xs text-muted-foreground mt-1">Consistencia de tu diario</CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col items-center justify-center pb-0 pt-4">
                <ChartContainer
                  config={ADHERENCE_CHART_CONFIG}
                  className="mx-auto aspect-square w-full max-h-[170px] select-none"
                >
                  <RadialBarChart
                    data={[{ name: "adherencia", value: dynamicAdherence, fill: "var(--color-adherencia)" }]}
                    startAngle={90}
                    endAngle={-270}
                    innerRadius={70}
                    outerRadius={85}
                  >
                    <PolarAngleAxis
                      type="number"
                      domain={[0, 100]}
                      angleAxisId={0}
                      tick={false}
                    />
                    <RadialBar 
                      dataKey="value" 
                      background={{ fill: "var(--muted)" }} 
                      cornerRadius={10} 
                      barSize={15}
                    />
                    <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text
                                x={viewBox.cx}
                                y={viewBox.cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                <tspan
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  className="fill-foreground text-3xl font-black"
                                >
                                  {dynamicAdherence}%
                                </tspan>
                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy || 0) + 20}
                                  className="fill-muted-foreground text-[10px] font-bold uppercase tracking-wider"
                                >
                                  Registro
                                </tspan>
                              </text>
                            )
                          }
                        }}
                      />
                    </PolarRadiusAxis>
                  </RadialBarChart>
                </ChartContainer>
              </CardContent>

              <CardFooter className="border-t border-border/40 pt-3 pb-3 flex justify-between items-center text-xs">
                <span className="text-muted-foreground font-bold uppercase tracking-wider text-[9px]">Objetivo diario:</span>
                <div className="flex items-center gap-2">
                  <button 
                    type="button"
                    onClick={() => setMealsGoal(prev => Math.max(1, prev - 1))}
                    className="w-5 h-5 rounded bg-secondary hover:bg-secondary/80 flex items-center justify-center font-bold text-foreground transition"
                  >
                    -
                  </button>
                  <span className="font-extrabold text-foreground w-20 text-center">{mealsGoal} {mealsGoal === 1 ? "comida" : "comidas"}</span>
                  <button 
                    type="button"
                    onClick={() => setMealsGoal(prev => Math.min(8, prev + 1))}
                    className="w-5 h-5 rounded bg-secondary hover:bg-secondary/80 flex items-center justify-center font-bold text-foreground transition"
                  >
                    +
                  </button>
                </div>
              </CardFooter>
            </Card>

            {/* ¿Por qué comiste? */}
            <Card className="col-span-1 flex flex-col justify-between">
              <CardHeader className="pb-0 flex flex-row items-start justify-between space-y-0">
                <div>
                  <div className="flex items-center gap-1.5">
                    <CardTitle className="text-lg font-bold text-foreground tracking-tight leading-none">¿Por qué comiste?</CardTitle>
                    <TooltipProvider>
                      <ShadcnTooltip>
                        <TooltipTrigger asChild>
                          <button type="button" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Información de causas de ingesta">
                            <Info className="w-3.5 h-3.5" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[280px] text-xs leading-relaxed">
                          Clasificar tus ingestas te ayuda a distinguir el hambre fisiológica real de los desencadenantes de hambre emocional (como aburrimiento, estrés o hábitos sociales).
                        </TooltipContent>
                      </ShadcnTooltip>
                    </TooltipProvider>
                  </div>
                  <CardDescription className="text-xs text-muted-foreground mt-1">Causas principales de tus comidas</CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col items-center justify-center pb-2 pt-4">
                <ChartContainer
                  config={WHY_EAT_CHART_CONFIG}
                  className="mx-auto aspect-square w-full max-h-[220px] select-none"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={WHY_EAT_DATA}
                      dataKey="percentage"
                      nameKey="reason"
                      innerRadius={35}
                      outerRadius={55}
                      strokeWidth={3}
                    />
                    <ChartLegend
                      content={<ChartLegendContent nameKey="reason" />}
                      className="flex-wrap gap-2 *:basis-1/4 *:justify-center"
                    />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Síntomas Físicos */}
            <Card className="col-span-1 flex flex-col justify-between">
              <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
                <div>
                  <div className="flex items-center gap-1.5">
                    <CardTitle className="text-lg font-bold text-foreground tracking-tight leading-none">Síntomas Físicos</CardTitle>
                    <TooltipProvider>
                      <ShadcnTooltip>
                        <TooltipTrigger asChild>
                          <button type="button" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Información de síntomas físicos">
                            <Info className="w-3.5 h-3.5" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[280px] text-xs leading-relaxed">
                          Registrar molestias corporales post-ingesta ayuda a identificar intolerancias alimentarias ocultas y a comprender cómo reacciona tu digestión ante diferentes tipos de nutrientes.
                        </TooltipContent>
                      </ShadcnTooltip>
                    </TooltipProvider>
                  </div>
                  <CardDescription className="text-xs text-muted-foreground mt-1">Frecuencia de síntomas reportados</CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col justify-center pb-6 pt-4">
                <ChartContainer config={SYMPTOMS_CHART_CONFIG} className="w-full select-none">
                  <BarChart
                    accessibilityLayer
                    data={SYMPTOMS_DATA}
                    layout="vertical"
                    margin={{
                      left: 0,
                    }}
                  >
                    <YAxis
                      dataKey="symptom"
                      type="category"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      width={125}
                      tickFormatter={(value) =>
                        SYMPTOMS_CHART_CONFIG[value as keyof typeof SYMPTOMS_CHART_CONFIG]?.label || value
                      }
                      className="text-[11px] font-normal fill-muted-foreground"
                    />
                    <XAxis dataKey="count" type="number" hide />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar dataKey="count" radius={5} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Behavioral Stability Index */}
            <Card className="col-span-1 flex flex-col justify-between">
              <CardHeader className="pb-0 flex flex-row items-start justify-between space-y-0">
                <div>
                  <div className="flex items-center gap-1.5">
                    <CardTitle className="text-lg font-bold text-foreground tracking-tight leading-none">Estabilidad Conductual</CardTitle>
                    <TooltipProvider>
                      <ShadcnTooltip>
                        <TooltipTrigger asChild>
                          <button type="button" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Información de estabilidad conductual">
                            <Info className="w-3.5 h-3.5" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[280px] text-xs leading-relaxed">
                          Este gráfico de radar evalúa tu regularidad en 5 pilares clave del bienestar: horarios, nutrición, humor, hidratación y consistencia. Es fundamental mantener un equilibrio entre todos ellos, ya que la sinergia de estos factores es lo que verdaderamente estabiliza tu metabolismo y sincroniza tu ritmo circadiano.
                        </TooltipContent>
                      </ShadcnTooltip>
                    </TooltipProvider>
                  </div>
                  <CardDescription className="text-xs text-muted-foreground mt-1">Sincronización de hábitos y ritmos</CardDescription>
                </div>
                <div className="flex items-baseline gap-1 bg-secondary/30 px-2 py-1 rounded-lg border border-border/40">
                  <span className="text-sm font-black text-foreground">85</span>
                  <span className="text-[10px] text-muted-foreground font-bold">/100</span>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex items-center justify-center pt-4 pb-4">
                <ChartContainer
                  config={STABILITY_CHART_CONFIG}
                  className="mx-auto aspect-square w-full max-h-[180px] select-none"
                >
                  <RadarChart data={STABILITY_DATA}>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <PolarGrid strokeWidth={1} stroke="var(--border)" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: "var(--muted-foreground)", fontSize: 9, fontWeight: 400 }}
                    />
                    <Radar
                      name="Estabilidad"
                      dataKey="value"
                      fill="var(--color-value)"
                      fillOpacity={0.25}
                      stroke="var(--color-value)"
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Color Plate Trend */}
            <Card className="col-span-1 flex flex-col justify-between">
              <CardHeader className="pb-0 flex flex-row items-start justify-between space-y-0">
                <div>
                  <div className="flex items-center gap-1.5">
                    <CardTitle className="text-lg font-bold text-foreground tracking-tight leading-none">Tendencia del Plato</CardTitle>
                    <TooltipProvider>
                      <ShadcnTooltip>
                        <TooltipTrigger asChild>
                          <button type="button" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Información de tendencia del plato colorido">
                            <Info className="w-3.5 h-3.5" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[280px] text-xs leading-relaxed">
                          Este gráfico de torta categoriza tus comidas según su color dominante, reflejando el aporte de fitonutrientes y antioxidantes en tu dieta. Te ayuda a asegurar un plato colorido y balanceado, clave para tu salud celular y metabólica.
                        </TooltipContent>
                      </ShadcnTooltip>
                    </TooltipProvider>
                  </div>
                  <CardDescription className="text-xs text-muted-foreground mt-1">Diversidad de fitonutrientes</CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col items-center justify-center pb-2 pt-4">
                <ChartContainer
                  config={COLOR_PLATE_CHART_CONFIG}
                  className="mx-auto aspect-square w-full max-h-[220px] select-none"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={COLOR_PLATE_DATA}
                      dataKey="percentage"
                      nameKey="colorKey"
                      innerRadius={35}
                      outerRadius={55}
                      strokeWidth={3}
                    />
                    <ChartLegend
                      content={<ChartLegendContent nameKey="colorKey" />}
                      className="flex-wrap gap-x-2 gap-y-1 text-[10px] justify-center mt-2"
                    />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Alineación Circadiana Card */}
            <Card className="col-span-1 flex flex-col justify-between">
              <CardHeader className="pb-0 flex flex-row items-start justify-between space-y-0">
                <div>
                  <div className="flex items-center gap-1.5">
                    <CardTitle className="text-lg font-bold text-foreground tracking-tight leading-none">Alineación Circadiana</CardTitle>
                    <TooltipProvider>
                      <ShadcnTooltip>
                        <TooltipTrigger asChild>
                          <button type="button" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Información de alineación circadiana">
                            <Info className="w-3.5 h-3.5" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[280px] text-xs leading-relaxed">
                          Mantener tu ventana de alimentación sincronizada con tu ritmo circadiano optimiza la sensibilidad a la insulina y favorece la digestión antes de tu fase de descanso biológico.
                        </TooltipContent>
                      </ShadcnTooltip>
                    </TooltipProvider>
                  </div>
                  <CardDescription className="text-xs text-muted-foreground mt-1">Reloj biológico vs. Ingestas</CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6 pb-4 flex-1 flex flex-col justify-center">
                {/* Dial Chart */}
                <div className="flex items-center justify-center relative py-1">
                  <div className="relative w-44 h-44 select-none">
                    {/* Outer Ring (Day/Night) */}
                    <svg className="w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" fill="none" r="45" className="stroke-muted" strokeWidth="6"></circle>
                      <circle cx="50" cy="50" fill="none" r="45" className="stroke-muted-foreground/20" strokeDasharray="180 282" strokeDashoffset="0" strokeLinecap="round" strokeWidth="6"></circle>
                      <circle cx="50" cy="50" fill="none" r="35" className="stroke-violet-600 dark:stroke-violet-400" strokeDasharray="10 210" strokeDashoffset="-40" strokeLinecap="round" strokeWidth="4"></circle>
                      <circle cx="50" cy="50" fill="none" r="35" className="stroke-violet-600 dark:stroke-violet-400" strokeDasharray="15 205" strokeDashoffset="-90" strokeLinecap="round" strokeWidth="4"></circle>
                      <circle cx="50" cy="50" fill="none" r="35" className="stroke-violet-600 dark:stroke-violet-400" strokeDasharray="12 208" strokeDashoffset="-150" strokeLinecap="round" strokeWidth="4"></circle>
                      <circle cx="50" cy="5" className="fill-foreground" r="2.5"></circle>
                    </svg>
                    {/* Center Info */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Clock className="w-5 h-5 text-muted-foreground/30 mb-0.5" />
                      <span className="text-foreground text-lg font-black tracking-widest">
                        {insightPeriod === "day" ? "14:02" : "13:58"}
                      </span>
                      <span className="text-[8px] font-bold text-muted-foreground mt-0.5 uppercase tracking-wider">
                        {insightPeriod === "day" ? "Pico" : "Pico Prom."}
                      </span>
                    </div>
                    {/* Labels */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 text-[8px] font-bold text-muted-foreground/60">00:00</div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 text-[8px] font-bold text-muted-foreground/60">12:00</div>
                    <div className="absolute left-0 top-1/2 -translate-x-4 -translate-y-1/2 text-[8px] font-bold text-muted-foreground/60">18:00</div>
                    <div className="absolute right-0 top-1/2 translate-x-4 -translate-y-1/2 text-[8px] font-bold text-muted-foreground/60">06:00</div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="grid grid-cols-3 gap-1 border-t border-border/40 pt-3 pb-3 text-center text-xs">
                <div className="border-r border-border/40 pr-1 flex flex-col justify-center">
                  <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Melatonina</p>
                  <p className="text-[10px] font-extrabold text-foreground">
                    {insightPeriod === "day" ? "~ 21:30" : "~ 21:42 (Prom.)"}
                  </p>
                </div>
                <div className="border-r border-border/40 px-1 flex flex-col justify-center">
                  <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Ventana Ingesta</p>
                  <p className="text-[10px] font-extrabold text-foreground leading-none">
                    {insightPeriod === "day" ? (
                      <>10:00 <span className="text-[8px] text-muted-foreground font-semibold">AM</span> - 06:00 <span className="text-[8px] text-muted-foreground font-semibold">PM</span></>
                    ) : (
                      <>10:15 <span className="text-[8px] text-muted-foreground font-semibold">AM</span> - 06:12 <span className="text-[8px] text-muted-foreground font-semibold">PM</span> <span className="text-[7px] text-muted-foreground font-bold">(Prom.)</span></>
                    )}
                  </p>
                </div>
                <div className="pl-1 flex flex-col justify-center">
                  <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Cortisol</p>
                  <p className="text-[10px] font-extrabold text-foreground">
                    {insightPeriod === "day" ? "~ 06:45" : "~ 06:38 (Prom.)"}
                  </p>
                </div>
              </CardFooter>
            </Card>

          </div>

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

        </div>
      )}

      {/* Disclaimer and Download Report Section */}
      {subTab === "analisis" && (
        <div className="mt-12 pt-8 border-t border-border/60 space-y-6">
          <div className="bg-secondary/15 rounded-xl border border-border/40 p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="text-xs font-bold text-foreground">Aviso de Uso de Datos</h5>
              <p className="text-[11px] leading-relaxed text-muted-foreground font-medium">
                Este reporte es un resumen de registros de hábitos y estimaciones circadianas con fines meramente informativos y de autoconocimiento. No constituye un diagnóstico médico, prescripción clínica ni asesoramiento nutricional profesional. Consulta con un profesional de la salud matriculado antes de realizar cambios significativos en tu alimentación o estilo de vida.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card border border-border rounded-xl p-4 shadow-sm">
            <div className="space-y-0.5 text-center sm:text-left">
              <h4 className="text-sm font-bold text-foreground">Compartir con tu Profesional</h4>
              <p className="text-xs text-muted-foreground font-medium">
                Exporta un reporte clínico en PDF {insightPeriod === "day" ? "de hoy" : insightPeriod === "week" ? "de los últimos 7 días" : insightPeriod === "month" ? "del último mes" : "del último trimestre"} con tu adherencia, estabilidad conductual y registros circadianos.
              </p>
            </div>
            <Button 
              onClick={handleDownloadReport} 
              className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 font-bold flex items-center justify-center gap-2"
            >
              <FileDown className="w-4 h-4" />
              Descargar Reporte PDF
            </Button>
          </div>
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
                setActiveModal("estado-actual");
              }}
            >
              <span className="bg-card text-foreground text-xs font-bold px-3 py-2 rounded-lg border border-border shadow-sm group-hover:scale-105 transition-transform">Registrar estado actual</span>
              <div className="w-12 h-12 rounded-full bg-card border border-border shadow-sm flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
              </div>
            </button>
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



      {/* Racha de Actividad Modal */}
      {activeModal === "racha-actividad" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-card border border-border rounded-[2rem] shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
            {/* Header */}
            <div className="px-6 pt-8 pb-4 flex justify-between items-center bg-card">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">Racha de Actividad</h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20">
                  <Flame className="w-3.5 h-3.5 fill-orange-500 animate-pulse text-orange-500" />
                  12 días
                </span>
                <button 
                  onClick={() => setShowStreakInfo(true)}
                  className="text-muted-foreground hover:text-primary transition-colors p-1 rounded-full hover:bg-secondary/40 focus:outline-none cursor-pointer"
                  title="¿Cómo funciona mi racha?"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>
              <button 
                onClick={() => setActiveModal("none")} 
                className="p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 pt-0 overflow-y-auto">
              <div className="w-full">
                <div className="flex justify-between items-center text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-3 px-0.5">
                  <span>Curva de Actividad (7 días)</span>
                  <span className="text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Base: 150 ptos</span>
                </div>

                <ChartContainer config={chartConfig} className="h-44 w-full aspect-auto select-none">
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
            </div>
          </div>
        </div>
      )}

      {/* Estado Actual Modal */}
      {activeModal === "estado-actual" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-card border border-border rounded-[2rem] shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
            {/* Header */}
            <div className="px-6 pt-8 pb-4 flex justify-between items-center bg-card">
              <div>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest block mb-0.5">Control de Bienestar</span>
                <h3 className="text-lg font-bold text-foreground">Estado Actual</h3>
              </div>
              <button 
                onClick={() => setActiveModal("none")} 
                className="p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 pt-2 space-y-6 overflow-y-auto">
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
              
              <Button 
                onClick={() => setActiveModal("none")}
                className="w-full rounded-xl h-11 text-sm font-bold bg-foreground text-background hover:opacity-90 mt-4"
              >
                Guardar Registro
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Info Modal Overlay */}
      {showStreakInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-md rounded-[2rem] shadow-xl p-5 relative overflow-hidden space-y-4 animate-in zoom-in-95 duration-200">
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
              className="w-full text-xs font-bold py-2 rounded-xl"
            >
              Entendido
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
