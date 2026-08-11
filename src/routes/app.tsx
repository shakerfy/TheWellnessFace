import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import React, { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site-header";
import { Index } from "./index";
import { GYMS } from "@/lib/gyms";
import { 
  User, Calendar, BarChart3, CreditCard, Settings, 
  LogOut, QrCode, CheckCircle, Clock, AlertTriangle, 
  MapPin, ChevronRight, ChevronLeft, X, Sparkles, Shield, AlertCircle, ShieldAlert, Star, Heart,
  Flame, Coffee, Droplet, TrendingUp, Info, Edit, Sun, Moon, ArrowUpRight, Utensils, Zap, Wheat, MessageSquare, Bed, AlarmClock, ArrowUp,
  Camera, Dumbbell, Brain, Activity, Plus, Check, Loader2, ShoppingCart, Copy, Share2,
  Play, Pause, RotateCcw, Search, ChevronUp, ChevronDown, Trash2, FileDown, Navigation, Scan, Smartphone, ArrowRightLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tooltip as ShadcnTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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

const HOLISTIC_RADAR_DATA = [
  { subject: "BODY AWARENESS", value: 86 },
  { subject: "HORARIOS", value: 88 },
  { subject: "NUTRICIÓN", value: 90 },
  { subject: "HIDRATACIÓN", value: 82 },
  { subject: "DENSIDAD", value: 85 }
];

const HOLISTIC_RADAR_CONFIG = {
  value: {
    label: "Nivel",
    color: "#10b981"
  }
} satisfies ChartConfig;

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
  { id: "clases", label: "Check-in", icon: QrCode },
  { id: "favoritos", label: "Favoritos", icon: Heart },
  { id: "progreso", label: "Mi Progreso", icon: BarChart3 },
  { id: "pagos", label: "Suscripción", icon: CreditCard },
  { id: "config", label: "Configuración", icon: Settings },
];

function StudentDashboard() {
  // ponytail: always start with "inicio" server-side to avoid SSR hydration mismatch;
  // useEffect below syncs from URL on client mount.
  const [activeTab, setActiveTab] = useState("inicio");

  useEffect(() => {
    const updateTabFromUrl = () => {
      if (typeof window !== "undefined") {
        const tab = new URLSearchParams(window.location.search).get("tab");
        if (tab && TABS.some((t) => t.id === tab)) {
          setActiveTab(tab);
        }
      }
    };
    updateTabFromUrl();
    window.addEventListener("popstate", updateTabFromUrl);
    const interval = setInterval(updateTabFromUrl, 200);
    return () => {
      window.removeEventListener("popstate", updateTabFromUrl);
      clearInterval(interval);
    };
  }, []);

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
    <div className={`min-h-screen ${activeTab === "diario" ? "bg-slate-50/70 dark:bg-background" : "bg-background"} text-foreground flex flex-col transition-colors duration-200`}>
      {/* Site Header with User Dropdown Menu always visible at top */}
      <SiteHeader />

      <div className="flex-1 pb-16 md:pb-0">
        {/* Main Content Area */}
        <main className={`flex-1 w-full ${activeTab === "inicio" ? "" : activeTab === "diario" ? "px-3 pt-0 pb-4 sm:px-6 sm:pb-6 md:px-10 md:pb-10 max-w-5xl mx-auto" : "px-3 py-4 sm:p-6 md:p-10 max-w-5xl mx-auto"}`}>

        {activeTab === "inicio" && <InicioTab />}
        {activeTab === "diario" && <DiarioTab />}
        {activeTab === "clases" && <ClasesTab onOpenQr={() => setQrOpen(true)} />}
        {activeTab === "favoritos" && <FavoritosTab />}
        {activeTab === "progreso" && <ProgresoTab />}
        {activeTab === "pagos" && <PagosTab />}
        {activeTab === "config" && <ConfigTab />}
      </main>
      </div>

      {/* QR Modal Overlay */}
      {qrOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-fade-in">
          <div className="relative bg-card border border-border w-full max-w-[360px] rounded-3xl p-6 sm:p-8  text-center">
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
function InicioTab() {
  return <Index hideHeader={true} />;
}

// Subcomponent: Favoritos Tab
function FavoritosTab() {
  const navigate = useNavigate();
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("shakerfy_favorites");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setFavoriteSlugs(parsed);
            return;
          }
        } catch (e) {}
      }
      // Default sample favorites if none stored
      const defaults = ["pulsar-fit", "zenith-studio"];
      setFavoriteSlugs(defaults);
      localStorage.setItem("shakerfy_favorites", JSON.stringify(defaults));
    }
  }, []);

  const favoriteGyms = GYMS.filter((g) => favoriteSlugs.includes(g.slug));

  const removeFavorite = (slug: string) => {
    const updated = favoriteSlugs.filter((s) => s !== slug);
    setFavoriteSlugs(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("shakerfy_favorites", JSON.stringify(updated));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
          Mis Favoritos
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
          Gimnasios Guardados
        </h1>
        <p className="text-sm text-muted-foreground">
          Centros de entrenamiento y studios que has guardado en tus favoritos.
        </p>
      </div>

      {favoriteGyms.length === 0 ? (
        <Card className="p-8 text-center border border-border bg-card rounded-3xl">
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
            <Heart className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">No tienes gimnasios guardados</h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
            Explora gimnasios en la página principal y presiona el ícono de corazón para guardarlos aquí.
          </p>
          <Button
            onClick={() => navigate({ to: "/" })}
            className="mt-4 rounded-full text-xs"
            size="sm"
          >
            Explorar gimnasios
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full items-stretch">
          {favoriteGyms.map((gym) => (
            <Card
              key={gym.slug}
              className="border border-border bg-card shadow-xs rounded-3xl p-5 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-40 rounded-2xl overflow-hidden mb-4 bg-muted">
                  <img
                    src={gym.images[0]}
                    alt={gym.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeFavorite(gym.slug)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur text-rose-500 hover:bg-background transition"
                  >
                    <Heart className="h-4 w-4 fill-rose-500" />
                  </button>
                  <div className="absolute bottom-3 left-3 bg-background/90 backdrop-blur px-2.5 py-1 rounded-full text-[11px] font-semibold text-foreground flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span>{gym.rating}</span>
                    <span className="text-muted-foreground">({gym.reviews})</span>
                  </div>
                </div>

                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-base text-foreground">{gym.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" />
                      <span>{gym.neighborhood}, {gym.city}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      Desde ${gym.priceFrom.toLocaleString()}/mes
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {gym.tags.map((t) => (
                    <Badge key={t} variant="secondary" className="text-[10px] rounded-full">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{gym.hours}</span>
                <Link
                  to="/gym/$slug"
                  params={{ slug: gym.slug }}
                  className="inline-flex items-center justify-center text-xs font-semibold text-primary hover:underline gap-1"
                >
                  <span>Ver detalle</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}




// Subcomponent: User Class Detail Modal (simple)
function UserClassDetailModal({
  classData,
  isOpen,
  onClose,
  onOpenQr,
}: {
  classData: any | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenQr?: () => void;
}) {
  if (!classData) return null;
  const isBooked = classData.status === "booked";
  const isFull = classData.status === "full";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md rounded-3xl border border-border bg-card p-0 gap-0">
        <div className="p-5 border-b border-border space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-xs font-bold">
              {classData.gymName || "Centro Deportivo"}
            </Badge>
            {isBooked && <Badge className="bg-emerald-500 text-black text-xs font-black">Reservada</Badge>}
            {isFull && <Badge variant="secondary" className="text-xs">Completo</Badge>}
            {classData.status === "urgent" && (
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">Ultimos cupos</Badge>
            )}
          </div>
          <h2 className="text-xl font-extrabold text-foreground tracking-tight">{classData.name}</h2>
          <p className="text-xs text-muted-foreground flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {classData.instructor}</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {classData.time}</span>
            {classData.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {classData.location}</span>}
          </p>
        </div>
        <div className="p-5 space-y-2 text-xs text-muted-foreground">
          <div><span className="font-semibold text-foreground">Cupos: </span>{classData.slots}</div>
          {classData.salaName && <div><span className="font-semibold text-foreground">Sala: </span>{classData.salaName}</div>}
        </div>
        <div className="px-5 pb-5 flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="rounded-full flex-1">Cerrar</Button>
          {isBooked ? (
            onOpenQr && (
              <Button onClick={() => { onClose(); onOpenQr(); }} className="rounded-full flex-1 bg-emerald-500 text-black hover:bg-emerald-400 font-bold gap-2">
                <QrCode className="w-4 h-4" /> Check-in QR
              </Button>
            )
          ) : isFull ? (
            <Button variant="secondary" disabled className="rounded-full flex-1">Clase llena</Button>
          ) : (
            <Button onClick={() => { alert(`Reserva confirmada en ${classData.name}`); onClose(); }} className="rounded-full flex-1 font-bold">
              Reservar
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Subcomponent: Clases / Check-in Tab
function ClasesTab({ onOpenQr }: { onOpenQr?: () => void }) {
  const [selectedClassDetail, setSelectedClassDetail] = useState<any | null>(null);

  const userMemberships = [
    { id: "kraft-club", gymName: "Kraft Club", planName: "Pase Libre Total", badge: "VIP PASSPORT", code: "KC-884291", status: "Activa (Pase Libre)", location: "Palermo, CABA", passType: "Pase Libre", remainingCredits: null as number | null, creditsCount: null as number | null, color: "from-zinc-950 via-zinc-900 to-black border-zinc-700/60 shadow-xl", accentBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30", logoIcon: "🏋️" },
    { id: "fitflow-studio", gymName: "FitFlow Studio", planName: "Pase 8 Clases / Mes", badge: "YOGA & PILATES", code: "FF-330194", status: "Activa", location: "Recoleta, CABA", passType: "Por Creditos", remainingCredits: 5, creditsCount: 8, color: "from-slate-950 via-indigo-950 to-slate-900 border-indigo-500/40 shadow-xl", accentBg: "bg-indigo-500/10 text-indigo-300 border-indigo-500/30", logoIcon: "🧘" },
    { id: "box-central", gymName: "Box Central", planName: "CrossFit 12 Sesiones", badge: "OFFICIAL BOX", code: "BC-772105", status: "Activa", location: "Belgrano, CABA", passType: "Por Creditos", remainingCredits: 3, creditsCount: 12, color: "from-stone-950 via-amber-950/90 to-neutral-950 border-amber-500/40 shadow-xl", accentBg: "bg-amber-500/10 text-amber-300 border-amber-500/30", logoIcon: "⚡" },
  ];

  const upcomingReservations = [
    { id: "res-1", gymName: "Box Central", name: "CrossFit WOD", instructor: "Mateo Rossi", timeLabel: "Hoy, 19:00 hs", location: "Belgrano, CABA", status: "booked" },
    { id: "res-2", gymName: "FitFlow Studio", name: "Yoga Vinyasa Flow", instructor: "Valeria Soto", timeLabel: "Hoy, 22:00 hs", location: "Recoleta, CABA", status: "booked" },
    { id: "res-3", gymName: "Kraft Club", name: "Musculacion & Funcional", instructor: "Daniel Gomez", timeLabel: "Manana, 10:00 hs", location: "Palermo, CABA", status: "booked" },
  ];

  const allClasses = [
    { id: "c1", gymName: "Box Central", name: "CrossFit WOD Express", instructor: "Mateo Rossi", time: "08:00 hs", slots: "10 cupos", status: "available" },
    { id: "c2", gymName: "FitFlow Studio", name: "Yoga Ashtanga & Meditacion", instructor: "Valeria Soto", time: "09:30 hs", slots: "Ultimos 2 cupos", status: "urgent" },
    { id: "c3", gymName: "Kraft Club", name: "Entrenamiento Funcional HIIT", instructor: "Daniel Gomez", time: "18:00 hs", slots: "Completo", status: "full" },
    { id: "c4", gymName: "Box Central", name: "CrossFit WOD Noche", instructor: "Mateo Rossi", time: "19:00 hs", slots: "Reservado", status: "booked" },
    { id: "c5", gymName: "FitFlow Studio", name: "Pilates Reformer Core", instructor: "Sofia Martinez", time: "20:00 hs", slots: "5 cupos", status: "available" },
    { id: "c6", gymName: "Kraft Club", name: "Body Sculpt & Stretch", instructor: "Lucia Fernandez", time: "21:00 hs", slots: "7 cupos", status: "available" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight">Check-in & Membresias</h2>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-xs font-semibold">Socio Activo</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Tus carnets activos, proximas clases y horario disponible.</p>
        </div>
        {onOpenQr && (
          <Button onClick={onOpenQr} className="rounded-full bg-foreground text-background font-semibold shadow-lg hover:opacity-90 flex items-center gap-2 self-start sm:self-auto">
            <QrCode className="w-4 h-4" /><span>Abrir Pase QR</span>
          </Button>
        )}
      </div>

      {/* Carnets */}
      <div className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-emerald-500" /> Mis Carnets ({userMemberships.length})
        </div>
        <div className="flex gap-4 overflow-x-auto pb-3 pt-1 snap-x [scrollbar-width:none] -mx-2 px-2">
          {userMemberships.map((card) => (
            <div key={card.id} className={`snap-start flex-shrink-0 w-[280px] sm:w-[300px] rounded-2xl p-5 border relative overflow-hidden bg-gradient-to-br ${card.color}`}>
              <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-white/5 blur-2xl pointer-events-none" />
              <div className="flex justify-between items-start relative z-10">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{card.logoIcon}</span>
                  <div>
                    <h3 className="font-extrabold text-white text-base tracking-tight leading-none">{card.gymName}</h3>
                    <p className="text-[11px] text-zinc-400 mt-0.5 flex items-center gap-1"><MapPin className="w-3 h-3" /> {card.location}</p>
                  </div>
                </div>
                <Badge className={`text-[10px] font-bold uppercase tracking-wider border ${card.accentBg}`}>{card.badge}</Badge>
              </div>
              <div className="mt-5 mb-4 relative z-10">
                <div className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">Titular</div>
                <div className="text-sm font-extrabold text-white tracking-wide">AGUSTIN GOMEZ</div>
                <div className="text-xs text-zinc-300 font-medium mt-1">{card.planName}</div>
              </div>
              <div className="pt-3 border-t border-white/10 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-zinc-300 font-medium text-[11px]">
                    {card.passType === "Por Creditos" ? `${card.remainingCredits}/${card.creditsCount} creditos` : card.status}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-zinc-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">{card.code}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Proximas Reservas */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-500" />
          <h3 className="text-lg font-bold tracking-tight">Proximas Clases</h3>
          <span className="text-xs text-muted-foreground font-medium ml-auto">{upcomingReservations.length} reservas activas</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {upcomingReservations.map((res) => (
            <div key={res.id} className="rounded-2xl border border-border bg-card p-4 flex flex-col gap-3 shadow-sm">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <Badge variant="outline" className="text-[10px] font-bold text-emerald-500 border-emerald-500/30 bg-emerald-500/10 mb-1.5">{res.gymName}</Badge>
                  <h4 className="text-sm font-bold text-foreground">{res.name}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1"><User className="w-3.5 h-3.5" /> {res.instructor}</p>
                </div>
                <Badge variant="secondary" className="text-[11px] flex items-center gap-1 shrink-0">
                  <Clock className="w-3 h-3 text-amber-500" /> {res.timeLabel}
                </Badge>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <span className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {res.location}</span>
                <Button size="sm" onClick={onOpenQr} className="rounded-full text-xs font-semibold gap-1.5 h-8 px-3.5 bg-foreground text-background hover:opacity-90">
                  <QrCode className="w-3.5 h-3.5" /> Check-in QR
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Horario de Hoy */}
      <div className="space-y-4 pt-2">
        <div className="border-t border-border pt-6">
          <h3 className="text-lg font-bold tracking-tight">Horario de Hoy</h3>
          <p className="text-xs text-muted-foreground">Todas tus clases disponibles para reservar hoy.</p>
        </div>
        <div className="rounded-2xl border border-border overflow-hidden bg-card">
          <ul className="divide-y divide-border">
            {allClasses.map((c) => (
              <li key={c.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 hover:bg-muted/30 transition">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-foreground">{c.name}</span>
                    <Badge variant="outline" className="text-[10px] text-muted-foreground">{c.gymName}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">Prof. {c.instructor} · {c.time}</div>
                </div>
                <div className="flex items-center gap-3 justify-between sm:justify-start shrink-0">
                  <span className={`text-xs font-medium ${c.status === "urgent" ? "text-amber-500 font-semibold" : c.status === "booked" ? "text-emerald-500 font-semibold" : "text-muted-foreground"}`}>
                    {c.status === "booked" && <Check className="w-3.5 h-3.5 inline mr-0.5" />}{c.slots}
                  </span>
                  <Button
                    size="sm"
                    variant={c.status === "booked" || c.status === "full" ? "outline" : "default"}
                    disabled={c.status === "full"}
                    onClick={() => setSelectedClassDetail({ ...c, location: "CABA" })}
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

      <UserClassDetailModal classData={selectedClassDetail} isOpen={!!selectedClassDetail} onClose={() => setSelectedClassDetail(null)} onOpenQr={onOpenQr} />
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
                  { emoji: "ðŸ˜«", label: "Agotado" },
                  { emoji: "ðŸ¥±", label: "Cansado" },
                  { emoji: "ðŸ˜", label: "Normal" },
                  { emoji: "ðŸ™‚", label: "Bien" },
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
  if (!timeStr) return 0;
  try {
    const cleanStr = timeStr.trim().toUpperCase();
    const isPM = cleanStr.includes("PM");
    const isAM = cleanStr.includes("AM");
    const baseTime = cleanStr.replace("AM", "").replace("PM", "").trim();
    const parts = baseTime.split(":");
    let hours = parseInt(parts[0], 10) || 0;
    const minutes = parts[1] ? parseInt(parts[1], 10) || 0 : 0;
    
    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;
    
    return hours * 60 + minutes;
  } catch {
    return 0;
  }
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

// Helper component to render dynamic glassmorphism badges for meals & recipes
interface MealOrganizerBadgesProps {
  category: string; // Momento del día (Desayuno, Almuerzo, Cena, Snack)
  tags?: string[]; // Badges nutricionales (Alta en Proteínas, Baja en Carbohidratos, etc.)
  className?: string;
}

function MealOrganizerBadges({
  category,
  tags = [],
  className = "",
}: MealOrganizerBadgesProps) {
  return (
    <div className={`flex flex-wrap gap-1.5 items-center ${className}`}>
      {/* 1. Momento del Día */}
      {category && (
        <span className="inline-flex items-center backdrop-blur-md bg-secondary text-foreground text-[10px] font-bold tracking-wide px-2.5 py-0.5 rounded-full shadow-xs">
          <span>{category}</span>
        </span>
      )}

      {/* 2. Badges Nutricionales & Características */}
      {tags.map((tag, idx) => (
        <span 
          key={idx} 
          className="inline-flex items-center backdrop-blur-md bg-secondary/50 text-muted-foreground text-[10px] font-medium tracking-wide px-2.5 py-0.5 rounded-full"
        >
          <span>{tag}</span>
        </span>
      ))}
    </div>
  );
}

const RECIPES_POOL = [
  {
    id: "receta-1",
    title: "Smoothie Bowl de Proteína y Berries",
    category: "Desayuno",
    tags: ["Alto en Proteína", "Sin Gluten", "Alto en Fibra", "Vegan"],
    img: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80",
    kcal: 340,
    protein: "22g",
    carbs: "45g",
    fat: "6g",
    prepTime: "10 min",
    difficulty: "Fácil",
    tag: "Alto en Proteína",
    coachFeedback: "Excelente para reponer glucógeno post-entreno y aportar antioxidantes para combatir el estrés oxidativo celular.",
    ingredients: [
      "1 taza de frutos rojos congelados (arándanos, frambuesas)",
      "1 scoop de proteína de vainilla (suero o vegetal)",
      "1/2 taza de leche de almendras sin azúcar",
      "1 cda de granola integral sin azúcar",
      "1 cdta de semillas de chía"
    ],
    instructions: [
      "Licúa los frutos rojos, la proteína y la leche de almendras hasta obtener una consistencia cremosa y espesa.",
      "Vierte la mezcla en un bowl profundo.",
      "Decora por encima con la granola, las semillas de chía y algunos frutos rojos frescos.",
      "Consumir de inmediato con cuchara."
    ]
  },
  {
    id: "receta-2",
    title: "Bowl de Quinoa, Salmón y Aguacate",
    category: "Almuerzo",
    tags: ["Grasas Saludables", "Sin Lactosa", "Alto en Proteína", "Sin Gluten"],
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    kcal: 580,
    protein: "38g",
    carbs: "45g",
    fat: "24g",
    prepTime: "20 min",
    difficulty: "Fácil",
    tag: "Grasas Saludables",
    coachFeedback: "Excelente combinación de grasas saludables omega-3 y carbohidratos complejos. Ideal para tu ventana metabólica post-entrenamiento.",
    ingredients: [
      "150g de filete de salmón fresco",
      "1/2 taza de quinoa cocida",
      "1/2 aguacate mediano en rebanadas",
      "1 taza de espinacas baby limpias",
      "1/2 taza de tomates cherry cortados al medio",
      "1 cda de aderezo de limón y aceite de oliva"
    ],
    instructions: [
      "Sazona el salmón con sal, y pimienta al gusto. Cocínalo a la plancha por 4 minutos de cada lado.",
      "Coloca la quinoa cocida como base en un bowl.",
      "Acomoda las hojas de espinaca baby, los tomates cherry y las rebanadas de aguacate.",
      "Añade el salmón desmenuzado por encima y vierte el aderezo de limón."
    ]
  },
  {
    id: "receta-3",
    title: "Pechuga de Pollo con Camote y Brócoli",
    category: "Cena",
    tags: ["Alto en Proteína", "Bajo en Hidratos", "Sin Gluten", "Sin Lactosa"],
    img: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=600&q=80",
    kcal: 460,
    protein: "42g",
    carbs: "35g",
    fat: "12g",
    prepTime: "25 min",
    difficulty: "Fácil",
    tag: "Alto en Proteína",
    coachFeedback: "Una cena ligera pero rica en aminoácidos para optimizar la síntesis proteica nocturna y favorecer la recuperación muscular.",
    ingredients: [
      "150g de pechuga de pollo cortada en filetes",
      "1 camote (batata) mediano",
      "1 taza de floretes de brócoli fresco",
      "1 diente de ajo picado fino",
      "Jugo de 1/2 limón fresco",
      "1 cdta de aceite de coco para cocinar"
    ],
    instructions: [
      "Corta el camote en rodajas y hornéalo con un toque de sal a 200°C durante 20 minutos hasta que esté suave.",
      "Saltea el ajo y el pollo en una sartén con aceite de coco hasta dorar.",
      "Agrega el jugo de limón al pollo y cocina a fuego lento por 5 minutos más.",
      "Cocina el brócoli al vapor durante 5 minutos para que quede al dente.",
      "Sirve todo en un plato y disfruta."
    ]
  },
  {
    id: "receta-4",
    title: "Pancakes Fit de Avena y Banano",
    category: "Desayuno",
    tags: ["Alto en Fibra", "Vegan", "Sin Lactosa", "Alto en Proteína"],
    img: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=80",
    kcal: 320,
    protein: "18g",
    carbs: "42g",
    fat: "6g",
    prepTime: "15 min",
    difficulty: "Muy Fácil",
    tag: "Alto en Fibra",
    coachFeedback: "Aporte rápido de carbohidratos de absorción lenta y potasio, perfecto para energía pre-entreno sin pesadez.",
    ingredients: [
      "1 banano mediano maduro",
      "1 huevo entero",
      "1/3 taza de harina de avena",
      "1/2 scoop de proteína de vainilla",
      "Pizca de polvo de hornear",
      "1/4 taza de leche descremada o de almendras"
    ],
    instructions: [
      "En una licuadora, mezcla el banano, el huevo, la harina de avena, la proteína, el polvo de hornear y la leche hasta lograr una pasta homogénea.",
      "Calienta una sartén antiadherente a fuego medio y pincela con una gota de aceite.",
      "Vierte porciones pequeñas para formar los pancakes.",
      "Cocina hasta que aparezcan burbujas en la superficie, voltea y cocina 1 minuto del otro lado.",
      "Sirve opcionalmente con frutos secos picados."
    ]
  },
  {
    id: "receta-5",
    title: "Tostada de Masa Madre con Ricotta e Higos",
    category: "Snack",
    tags: ["Alto en Fibra", "Bajo en Hidratos", "Grasas Saludables", "Vegan"],
    img: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80",
    kcal: 290,
    protein: "12g",
    carbs: "38g",
    fat: "8g",
    prepTime: "10 min",
    difficulty: "Muy Fácil",
    tag: "Alto en Fibra",
    coachFeedback: "El pan de masa madre es excelente para la digestión y la ricotta ofrece una liberación sustained de aminoácidos.",
    ingredients: [
      "1 rebanada gruesa de pan de masa madre tostado",
      "3 cdas de queso ricotta descremado o cottage",
      "2 higos frescos rebanados",
      "1 cdta de miel de abeja pura o jarabe de agave",
      "Hojitas de albahaca fresca para decorar"
    ],
    instructions: [
      "Tuesta la rebanada de pan de masa madre al nivel deseado.",
      "Esparce uniformemente el queso ricotta sobre la tostada caliente.",
      "Acomoda las rebanadas de higo fresco encima.",
      "Rocía con el hilo de miel y decora con la albahaca fresca antes de servir."
    ]
  }
];

function CircularProgress({
  percent,
  color,
  size = 64,
  strokeWidth = 6,
  trackClass = "stroke-zinc-200 dark:stroke-zinc-800",
  children,
}: {
  percent: number;
  color: string;
  size?: number;
  strokeWidth?: number;
  trackClass?: string;
  children?: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, percent)) / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className={`${trackClass} fill-none`}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {children && <div className="absolute inset-0 flex items-center justify-center">{children}</div>}
    </div>
  );
}

function TypewriterOnce({ text, speed = 25 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    setDisplayedText("");
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span>
      {displayedText}
      {displayedText.length < text.length && (
        <span className="inline-block w-1.5 h-3.5 bg-amber-500 ml-1 animate-pulse rounded-xs align-middle" />
      )}
    </span>
  );
}

interface SleepHistoryItem {
  label: string;
  hours: number;
  qualityScore: number;
}

const INITIAL_SLEEP_HISTORY: Record<"week" | "month" | "quarter", SleepHistoryItem[]> = {
  week: [
    { label: "Lun", hours: 7.2, qualityScore: 82 },
    { label: "Mar", hours: 7.8, qualityScore: 88 },
    { label: "Mié", hours: 6.5, qualityScore: 74 },
    { label: "Jue", hours: 8.0, qualityScore: 92 },
    { label: "Vie", hours: 7.5, qualityScore: 85 },
    { label: "Sáb", hours: 8.4, qualityScore: 95 },
    { label: "Dom", hours: 7.75, qualityScore: 88 },
  ],
  month: [
    { label: "Sem 1", hours: 7.4, qualityScore: 84 },
    { label: "Sem 2", hours: 6.9, qualityScore: 78 },
    { label: "Sem 3", hours: 7.9, qualityScore: 90 },
    { label: "Sem 4", hours: 7.75, qualityScore: 88 },
  ],
  quarter: [
    { label: "Mayo", hours: 7.3, qualityScore: 81 },
    { label: "Junio", hours: 7.6, qualityScore: 86 },
    { label: "Julio", hours: 7.8, qualityScore: 89 },
  ],
};

const sleepChartConfig = {
  hours: {
    label: "Horas de Sueño",
    color: "#6366f1",
  },
} satisfies ChartConfig;

// Subcomponent: AI Coach Diario (Wellfooder Timeline)
function DiarioTab() {
  const [subTab, setSubTab] = useState<"diario" | "analisis" | "sueno" | "recuperacion" | "recetas">("diario");
  const [nutritionMode, setNutritionMode] = useState<"qualitative" | "quantitative">("quantitative");
  const [insightPeriod, setInsightPeriod] = useState<"day" | "week" | "month" | "quarter" | "all">("week");
  const [sunTimes, setSunTimes] = useState({ sunrise: "06:30", sunset: "20:15" });
  const [calMode, setCalMode] = useState<"consumed" | "remaining" | "target">("consumed");
  const [proteinMode, setProteinMode] = useState<"consumed" | "remaining" | "target">("consumed");
  const [carbsMode, setCarbsMode] = useState<"consumed" | "remaining" | "target">("consumed");
  const [fatsMode, setFatsMode] = useState<"consumed" | "remaining" | "target">("consumed");
  const [sleepData, setSleepData] = useState({
    duration: "7h 45m",
    hours: 7.75,
    bedtime: "23:30",
    wakeTime: "07:15",
    quality: "Reparador",
    score: 88,
    factors: ["Magnesio", "Habitación fresca"],
  });
  const [sleepFilter, setSleepFilter] = useState<"week" | "month" | "quarter">("week");
  const [sleepHistory, setSleepHistory] = useState(INITIAL_SLEEP_HISTORY);

  const currentSleepData = sleepHistory[sleepFilter];
  const avgSleepHours = (currentSleepData.reduce((acc: number, curr: SleepHistoryItem) => acc + curr.hours, 0) / currentSleepData.length).toFixed(1);
  const targetPercent = Math.round((Number(avgSleepHours) / 8) * 100);

  useEffect(() => {
    const getSolarTimes = (lat: number, lng: number) => {
      try {
        // @ts-ignore
        const times = SunCalc.getTimes(new Date(), lat, lng);
        const formatTime = (date: Date | null) => {
          if (!date) return "--:--";
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

  const [activityData, setActivityData] = useState([
    { day: "Lun", puntos: 180 },
    { day: "Mar", puntos: 160 },
    { day: "Mié", puntos: 175 },
    { day: "Jue", puntos: 140 },
    { day: "Vie", puntos: 155 },
    { day: "Sáb", puntos: 190 },
    { day: "Dom", puntos: 168 }
  ]);

  const [customActivities, setCustomActivities] = useState<any[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<string[]>(["receta-5"]);
  const [cartRecipeIds, setCartRecipeIds] = useState<string[]>(["receta-5"]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showSwipeStack, setShowSwipeStack] = useState(true);
  const [isSwipeModalOpen, setIsSwipeModalOpen] = useState(false);
  const [currentSwipeIndex, setCurrentSwipeIndex] = useState(0);
  const [activeRecipeDetail, setActiveRecipeDetail] = useState<any | null>(null);

  const handleOpenExplorarIdeas = () => {
    setSubTab("diario");
    const todayStr = new Date().toISOString().split("T")[0];
    const newStackId = `swipe-stack-${Date.now()}`;
    const newStackItem = {
      id: newStackId,
      date: todayStr,
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      title: "Explorar Ideas",
      subtitle: "Explorar Ideas",
      type: "swipe-stack",
    };
    setUserTimelineItems(prev => [newStackItem, ...prev]);

    setTimeout(() => {
      const el = document.getElementById(`recipe-swipe-stack-card-${newStackId}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  // Shake for AI State & Logic
  const [shakeModalOpen, setShakeModalOpen] = useState(false);
  const [shakeData, setShakeData] = useState<{
    title: string;
    icon: string;
    description: string;
    actionText: string;
    actionType: "water" | "scan" | "recipe" | "diario";
  } | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const lastShakeTimeRef = React.useRef(0);

  const triggerShakeAI = React.useCallback(() => {
    const now = Date.now();
    if (now - lastShakeTimeRef.current < 2500) return; // 2.5s cooldown
    lastShakeTimeRef.current = now;

    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try { navigator.vibrate([40, 30, 40]); } catch (e) {}
    }

    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);

    const hour = new Date().getHours();
    let recommendation;

    if (hour >= 6 && hour < 11) {
      recommendation = {
        title: "Tu Mezcla Matutina",
        icon: "🥣",
        description: "Aún es temprano para consolidar tu energía. Media taza de avena cocida con yogur natural y trozos de banana o arándanos te dará saciedad duradera con comida real.",
        actionText: "Ver recetas de desayuno",
        actionType: "recipe" as const,
      };
    } else if (hour >= 11 && hour < 15) {
      recommendation = {
        title: "Nutrición de Mediodía",
        icon: "🍗",
        description: "¿A punto de almorzar? Un filete de pechuga de pollo o tofu salteado (~150g) con un bowl de ensalada fresca y quinoa repondrá tus reservas sin pesadez.",
        actionText: "Escanear mi almuerzo",
        actionType: "scan" as const,
      };
    } else if (hour >= 15 && hour < 19) {
      recommendation = {
        title: "Recarga de Hidratación & Energía",
        icon: "🥤",
        description: "Es un excelente momento para hidratarte. Toma un vaso de agua fresca (250ml) y acompáñalo con un puñado de frutos secos (~30g) para mantener tu concentración.",
        actionText: "+250ml Agua pura",
        actionType: "water" as const,
      };
    } else if (hour >= 19 && hour < 22) {
      recommendation = {
        title: "Cena de Recuperación Muscular",
        icon: "🥑",
        description: "Para tu cena, una porción de salmón o huevos al plato con camote (batata) al horno repondrá el tejido muscular de tu día de forma ligera.",
        actionText: "Explorar ideas de cena",
        actionType: "recipe" as const,
      };
    } else {
      recommendation = {
        title: "Cierre de Jornada",
        icon: "🌙",
        description: "Completaste tus comidas del día con alimentos reales. Desconéctate de las pantallas e inicia tu rutina de descanso para optimizar tu melatonina.",
        actionText: "Cerrar diario de hoy",
        actionType: "diario" as const,
      };
    }

    const newShakeItem = {
      id: `shake-ai-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      title: recommendation.title,
      subtitle: "Shake for AI",
      type: "shake-ai",
      icon: recommendation.icon,
      kcal: 0,
      tag: "IA Contextual",
      coachFeedback: recommendation.description,
      actionText: recommendation.actionText,
      actionType: recommendation.actionType,
    };

    setUserTimelineItems(prev => [newShakeItem, ...prev]);
    toast.success("🥤 ¡Shake for AI! Se generó una recomendación en tu diario.");
  }, []);

  useEffect(() => {
    let lastX = 0, lastY = 0, lastZ = 0;
    let lastTime = Date.now();

    const handleMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc || acc.x === null || acc.y === null || acc.z === null) return;

      const currentTime = Date.now();
      if (currentTime - lastTime > 100) {
        const diffTime = currentTime - lastTime;
        lastTime = currentTime;

        const deltaX = Math.abs(acc.x - lastX);
        const deltaY = Math.abs(acc.y - lastY);
        const deltaZ = Math.abs(acc.z - lastZ);

        const speed = ((deltaX + deltaY + deltaZ) / diffTime) * 10000;
        if (speed > 800) {
          triggerShakeAI();
        }

        lastX = acc.x;
        lastY = acc.y;
        lastZ = acc.z;
      }
    };

    if (typeof window !== "undefined" && "DeviceMotionEvent" in window) {
      window.addEventListener("devicemotion", handleMotion, false);
    }
    return () => {
      if (typeof window !== "undefined" && "DeviceMotionEvent" in window) {
        window.removeEventListener("devicemotion", handleMotion, false);
      }
    };
  }, [triggerShakeAI]);

  const toggleCartRecipe = (recipeId: string) => {
    setCartRecipeIds(prev => 
      prev.includes(recipeId) 
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  // States and data for page 2 (Racha de Actividad & MET Calculator)
  const MET_ACTIVITIES = [
    { name: "Aeróbica", low: 3.5, med: 5.0, high: 7.3 },
    { name: "Artes marciales", low: 5.3, med: 7.0, high: 10.3 },
    { name: "Artes marciales combinadas", low: 6.0, med: 9.0, high: 12.0 },
    { name: "Bádminton", low: 4.5, med: 5.5, high: 7.0 },
    { name: "Baile", low: 3.3, med: 5.0, high: 7.0 },
    { name: "Baile floss", low: 3.0, med: 4.5, high: 6.0 },
    { name: "Básquetbol", low: 4.5, med: 6.0, high: 8.0 },
    { name: "Béisbol", low: 3.0, med: 4.0, high: 5.0 },
    { name: "Biatlón", low: 7.0, med: 10.5, high: 13.5 },
    { name: "Bicicleta", low: 4.0, med: 8.0, high: 10.0 },
    { name: "Bicicleta fija", low: 3.5, med: 6.0, high: 8.5 },
    { name: "Boxeo", low: 5.5, med: 7.0, high: 12.8 },
    { name: "Buceo", low: 4.0, med: 7.0, high: 10.0 },
    { name: "Calistenia", low: 3.5, med: 5.0, high: 8.0 },
    { name: "Caminata", low: 2.5, med: 3.5, high: 4.5 },
    { name: "Caminata a ritmo rápido", low: 3.8, med: 5.0, high: 6.5 },
    { name: "Caminata con un carrito para niños", low: 3.0, med: 4.0, high: 5.0 },
    { name: "Caminata en la cinta", low: 2.5, med: 3.8, high: 5.0 },
    { name: "Caminata nórdica", low: 3.0, med: 4.8, high: 6.0 },
    { name: "Caminata rápida", low: 3.8, med: 5.0, high: 6.5 },
    { name: "Ciclismo de montaña", low: 5.5, med: 8.5, high: 14.0 },
    { name: "Ciclismo de ruta", low: 6.0, med: 9.0, high: 12.0 },
    { name: "Ciclismo manual", low: 3.0, med: 5.0, high: 7.5 },
    { name: "Ciclismo urbano", low: 4.0, med: 6.8, high: 10.0 },
    { name: "Circuito de entrenamiento", low: 4.0, med: 6.0, high: 8.0 },
    { name: "Clavadismo", low: 3.0, med: 4.0, high: 5.0 },
    { name: "Correr", low: 7.0, med: 10.0, high: 15.0 },
    { name: "Correr en cinta", low: 7.0, med: 9.8, high: 14.0 },
    { name: "Correr en la arena", low: 8.0, med: 11.5, high: 16.0 },
    { name: "Críquet", low: 3.0, med: 4.8, high: 6.0 },
    { name: "Crossfit", low: 5.0, med: 8.0, high: 12.0 },
    { name: "Curling", low: 2.5, med: 3.5, high: 4.5 },
    { name: "Elíptico", low: 4.5, med: 7.0, high: 10.0 },
    { name: "Entrenamiento de fuerza", low: 3.0, med: 5.0, high: 6.0 },
    { name: "Entrenamiento por intervalos", low: 4.5, med: 7.0, high: 10.0 },
    { name: "Entrenamiento por intervalos intenso", low: 6.0, med: 9.5, high: 13.0 },
    { name: "Equitación", low: 3.0, med: 5.5, high: 8.0 },
    { name: "Escalada", low: 5.0, med: 8.0, high: 11.0 },
    { name: "Escalador", low: 4.5, med: 7.5, high: 10.0 },
    { name: "Esgrima", low: 4.0, med: 6.0, high: 8.0 },
    { name: "Esquí", low: 4.5, med: 7.0, high: 9.5 },
    { name: "Esquí con raquetas de nieve", low: 5.0, med: 8.0, high: 11.0 },
    { name: "Esquí cuesta abajo", low: 4.0, med: 6.0, high: 8.0 },
    { name: "Esquí de fondo", low: 5.5, med: 9.0, high: 12.5 },
    { name: "Freeride", low: 5.0, med: 7.5, high: 10.0 },
    { name: "Frisbee", low: 3.0, med: 4.0, high: 5.0 },
    { name: "Fútbol", low: 5.0, med: 7.0, high: 10.0 },
    { name: "Fútbol americano", low: 4.5, med: 7.0, high: 9.0 },
    { name: "Fútbol australiano", low: 5.0, med: 7.5, high: 10.5 },
    { name: "Gimnasia", low: 3.0, med: 4.0, high: 6.0 },
    { name: "Golf", low: 2.5, med: 3.5, high: 4.5 },
    { name: "Handball", low: 5.0, med: 8.0, high: 11.0 },
    { name: "Hockey", low: 5.0, med: 7.8, high: 10.0 },
    { name: "Hyrox", low: 6.0, med: 9.0, high: 13.0 },
    { name: "Jardinería", low: 2.5, med: 3.8, high: 5.0 },
    { name: "Kayakismo", low: 3.0, med: 5.0, high: 8.0 },
    { name: "Kickboxing", low: 5.5, med: 8.0, high: 11.5 },
    { name: "Kite esquí", low: 5.0, med: 7.5, high: 10.0 },
    { name: "Kitesurf", low: 5.0, med: 7.8, high: 11.0 },
    { name: "Levantamiento de pesas", low: 3.0, med: 5.0, high: 6.0 },
    { name: "Máquina de ejercicios", low: 3.0, med: 4.5, high: 6.0 },
    { name: "Máquina de remo", low: 3.5, med: 6.0, high: 8.5 },
    { name: "Meditación", low: 1.0, med: 1.2, high: 1.5 },
    { name: "Monopatín", low: 3.0, med: 5.0, high: 6.5 },
    { name: "Natación", low: 5.3, med: 8.0, high: 10.0 },
    { name: "Natación en aguas abiertas", low: 6.0, med: 8.5, high: 11.0 },
    { name: "Natación en piscinas", low: 5.0, med: 7.5, high: 9.5 },
    { name: "Otro", low: 3.0, med: 5.0, high: 7.0 },
    { name: "P90x", low: 5.5, med: 7.8, high: 10.5 },
    { name: "Parapente", low: 2.0, med: 2.8, high: 3.5 },
    { name: "Patinaje", low: 4.0, med: 6.0, high: 8.0 },
    { name: "Patinaje en línea", low: 4.5, med: 7.0, high: 9.8 },
    { name: "Patinaje en pista cubierta", low: 4.0, med: 6.5, high: 8.5 },
    { name: "Patinaje nórdico", low: 5.0, med: 7.5, high: 10.5 },
    { name: "Patinaje sobre hielo", low: 3.5, med: 5.5, high: 7.5 },
    { name: "Pesas rusas", low: 4.0, med: 7.0, high: 9.5 },
    { name: "Pilates", low: 2.5, med: 3.5, high: 5.0 },
    { name: "Polo", low: 4.0, med: 6.0, high: 8.0 },
    { name: "Polo acústico", low: 3.0, med: 4.5, high: 6.0 },
    { name: "Ráquetbol", low: 5.0, med: 7.5, high: 10.0 },
    { name: "Remo", low: 3.5, med: 6.0, high: 8.5 },
    { name: "Rugby", low: 5.0, med: 8.0, high: 11.0 },
    { name: "Saltar la cuerda", low: 8.0, med: 11.0, high: 14.0 },
    { name: "Senderismo", low: 3.5, med: 6.0, high: 9.0 },
    { name: "Silla de ruedas", low: 3.0, med: 4.5, high: 6.5 },
    { name: "Skateboard", low: 3.0, med: 5.0, high: 6.5 },
    { name: "Skiroll", low: 5.0, med: 7.5, high: 10.5 },
    { name: "Snowboard", low: 4.0, med: 5.5, high: 7.5 },
    { name: "Softabll", low: 3.0, med: 4.0, high: 5.0 },
    { name: "Spinning", low: 5.0, med: 7.5, high: 10.0 },
    { name: "Squash", low: 5.5, med: 8.5, high: 12.0 },
    { name: "Subir escaleras", low: 4.0, med: 8.0, high: 12.0 },
    { name: "Surf", low: 3.0, med: 5.0, high: 7.5 },
    { name: "Surf de remo", low: 3.5, med: 6.0, high: 8.5 },
    { name: "Tenis", low: 4.5, med: 6.5, high: 8.5 },
    { name: "Tenis de mesa", low: 2.5, med: 4.0, high: 5.5 },
    { name: "Trineo", low: 4.0, med: 6.0, high: 8.0 },
    { name: "Trote", low: 5.5, med: 8.0, high: 10.5 },
    { name: "Vela", low: 2.5, med: 4.0, high: 6.0 },
    { name: "Voleibol", low: 3.0, med: 4.0, high: 6.0 },
    { name: "Voleibol de playa", low: 4.0, med: 6.0, high: 8.0 },
    { name: "Voleibol de interiores", low: 3.0, med: 4.0, high: 6.0 },
    { name: "Wakeboard", low: 4.0, med: 5.5, high: 7.5 },
    { name: "Windsurf", low: 4.5, med: 6.5, high: 8.5 },
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

  const [muscleRecovery, setMuscleRecovery] = useState<Record<string, number>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("shakerfy_muscle_recovery");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return {
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
    };
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("shakerfy_muscle_recovery", JSON.stringify(muscleRecovery));
    }
  }, [muscleRecovery]);

  const [editingTimelineItem, setEditingTimelineItem] = useState<any | null>(null);

  const [userTimelineItems, setUserTimelineItems] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("shakerfy_user_timeline_items");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {}
      }
    }
    return [
      {
        id: "1",
        date: "2026-07-15",
        time: "12:30 PM",
        title: "Avocado Toast & Hojas Verdes",
        subtitle: "Almuerzo",
        type: "food",
        img: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80",
        kcal: 420,
        protein: "14g",
        carbs: "48g",
        fat: "18g",
        tags: ["Alta en Fibra", "Grasas Saludables"],
        tag: "Alta en Fibra",
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
        coachFeedback: "Nivel 5 indica deshidratación leve. Toma 500ml de agua ahora mismo para compensar el entrenamiento o la actividad.",
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
        protein: "0g",
        carbs: "0g",
        fat: "0g",
        tags: ["Sin Azúcar", "Cero Calorías"],
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
        protein: "24g",
        carbs: "4g",
        fat: "22g",
        tags: ["Alta en Proteínas", "Baja en Carbohidratos"],
        tag: "Alta en Proteínas",
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
        protein: "6g",
        carbs: "8g",
        fat: "15g",
        tags: ["Grasas Saludables", "Baja en Carbohidratos"],
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
        protein: "10g",
        carbs: "40g",
        fat: "8g",
        tags: ["Energía Compleja", "Microbiota Amigable"],
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
        protein: "44g",
        carbs: "6g",
        fat: "36g",
        tags: ["Alta en Proteínas", "Baja en Carbohidratos", "Omega 3"],
        tag: "Alta en Proteínas",
        coachFeedback: "Excelente cena ligera y rica en grasas saludables que promueven la recuperación celular durante el sueño profundo.",
      }
    ];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("shakerfy_user_timeline_items", JSON.stringify(userTimelineItems));
    }
  }, [userTimelineItems]);

  const handleDeleteTimelineItem = (id: string) => {
    setUserTimelineItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSaveEditedTimelineItem = (updated: any) => {
    setUserTimelineItems(prev => prev.map(item => item.id === updated.id ? updated : item));
    setEditingTimelineItem(null);
  };

  const [isEditingRecovery, setIsEditingRecovery] = useState(false);
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

    const dayLabels = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const todayLabel = dayLabels[new Date().getDay()];
    setActivityData(prev => prev.map(item => 
      item.day === todayLabel ? { ...item, puntos: item.puntos + 185 } : item
    ));

    const newWorkoutCard = {
      id: `workout-ai-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      title: "Entrenamiento IA Completado",
      subtitle: "Rutina Inteligente",
      type: "activity",
      img: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
      kcal: 380,
      tag: "185 Pts MET",
      coachFeedback: "Completaste tu rutina personalizada de musculación generada por la IA. Excelente técnica y volumen de trabajo. Tus niveles de recuperación muscular se han actualizado."
    };

    setUserTimelineItems(prev => [newWorkoutCard, ...prev]);
    toast.success("🏋️ Registraste tu entrenamiento con IA en tu diario");
  };

  const [isFabOpen, setIsFabOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string>("none");
  const [foodAnalysisStep, setFoodAnalysisStep] = useState<"upload" | "analyzing" | "report" | "reason" | "breathing_prompt" | "breathing_exercise">("upload");
  const [selectedEatReason, setSelectedEatReason] = useState<string>("hambre");
  const [whyEatData, setWhyEatData] = useState(WHY_EAT_DATA);

  const [breathingPhase, setBreathingPhase] = useState<"inhale" | "hold1" | "exhale" | "hold2">("inhale");
  const [breathingSeconds, setBreathingSeconds] = useState<number>(4);
  const [breathingCyclesCompleted, setBreathingCyclesCompleted] = useState<number>(0);
  const [breathingStartTime, setBreathingStartTime] = useState<number>(0);
  const [breathingOrbScale, setBreathingOrbScale] = useState<number>(0.60);

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

  // Motor de respiración guiada a 60 FPS sincronizado con reloj de tiempo real (Date.now())
  useEffect(() => {
    let animationFrameId: number;
    let isCompleted = false;

    if (activeModal === "food-analysis" && foodAnalysisStep === "breathing_exercise" && breathingStartTime > 0) {
      const updateBreathing = () => {
        const totalElapsed = Date.now() - breathingStartTime;
        const cycleIndex = Math.floor(totalElapsed / 16000);

        if (cycleIndex >= 3 && !isCompleted) {
          isCompleted = true;
          handleFinalizeFoodRegistration();
          return;
        }

        const phaseMs = totalElapsed % 16000;

        if (phaseMs < 4000) {
          // 1. Inhala (0s - 4s): Expansión fluida desde 0.60 hasta 1.00
          const progress = phaseMs / 4000;
          setBreathingPhase("inhale");
          setBreathingSeconds(Math.ceil((4000 - phaseMs) / 1000) || 1);
          setBreathingOrbScale(0.60 + progress * 0.40);
        } else if (phaseMs < 8000) {
          // 2. Pausa Lleno (4s - 8s): Retención estática en 1.00
          setBreathingPhase("hold1");
          setBreathingSeconds(Math.ceil((8000 - phaseMs) / 1000) || 1);
          setBreathingOrbScale(1.00);
        } else if (phaseMs < 12000) {
          // 3. Exhala (8s - 12s): Contracción fluida desde 1.00 hasta 0.60
          const progress = (phaseMs - 8000) / 4000;
          setBreathingPhase("exhale");
          setBreathingSeconds(Math.ceil((12000 - phaseMs) / 1000) || 1);
          setBreathingOrbScale(1.00 - progress * 0.40);
        } else {
          // 4. Pausa Vacío (12s - 16s): Retención estática en 0.60
          setBreathingPhase("hold2");
          setBreathingSeconds(Math.ceil((16000 - phaseMs) / 1000) || 1);
          setBreathingOrbScale(0.60);
        }

        setBreathingCyclesCompleted(cycleIndex);

        if (!isCompleted) {
          animationFrameId = requestAnimationFrame(updateBreathing);
        }
      };

      animationFrameId = requestAnimationFrame(updateBreathing);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [activeModal, foodAnalysisStep, breathingStartTime]);

  const handleFinalizeFoodRegistration = () => {
    setWhyEatData((prevData) => {
      const totalCount = prevData.reduce((acc, curr) => acc + curr.percentage, 0);
      const newTotal = totalCount + 1;
      return prevData.map((item) => {
        if (item.reason === selectedEatReason) {
          const newPct = Math.round(((item.percentage * totalCount / 100 + 1) / newTotal) * 100);
          return { ...item, percentage: newPct };
        } else {
          const newPct = Math.round(((item.percentage * totalCount / 100) / newTotal) * 100);
          return { ...item, percentage: newPct };
        }
      });
    });

    const newFood = {
      id: `food-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      title: "Chicken Phá»Ÿ con Vegetales",
      subtitle: "Comida Registrada",
      type: "food",
      img: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80",
      kcal: 480,
      protein: "32g",
      carbs: "54g",
      fat: "12g",
      tags: ["Mínimamente Procesado", "Score NRF 9.3"],
      tag: "Score NRF 9.3 (88/100)",
      coachFeedback: "Excelente balance de proteínas y fibra en la sopa. Considerá controlar el aporte de sodio del caldo para optimizar tu perfil diario.",
    };
    setUserTimelineItems(prev => [newFood, ...prev]);

    setActiveModal("none");
    setFoodAnalysisStep("upload");
  };

  const timelineItems = React.useMemo(() => {
    const getHydrationFeedback = (level: number) => {
      if (level <= 2) {
        return {
          tag: `Armstrong ${level}`,
          feedback: `Nivel ${level} indica hidratación óptima. ¡Excelente trabajo manteniendo tu cuerpo equilibrado!`
        };
      } else if (level <= 4) {
        return {
          tag: `Armstrong ${level}`,
          feedback: `Nivel ${level} indica hidratación normal tirando a levemente baja. Bebe un vaso de agua (250ml) ahora para mantener el estado óptimo.`
        };
      } else if (level <= 6) {
        return {
          tag: `Armstrong ${level}`,
          feedback: `Nivel ${level} indica deshidratación leve. Toma 500ml de agua ahora mismo para compensar el entrenamiento o la actividad.`
        };
      } else {
        return {
          tag: `Armstrong ${level}`,
          feedback: `¡Atención! Nivel ${level} indica deshidratación severa. Consume de 750ml a 1L de agua, preferiblemente con electrolitos, y modera el esfuerzo físico.`
        };
      }
    };

    const hydData = getHydrationFeedback(hydrationLevel);

    const processedUserItems = userTimelineItems.map(item => {
      if (item.type === "hydration") {
        return {
          ...item,
          tag: hydData.tag,
          coachFeedback: hydData.feedback
        };
      }
      return item;
    });

    const formatTime12h = (time24: string) => {
      try {
        const parts = time24.split(":");
        const hrs = parseInt(parts[0], 10);
        const mins = parts[1];
        const ampm = hrs >= 12 ? "PM" : "AM";
        const displayHrs = hrs % 12 || 12;
        return `${displayHrs.toString().padStart(2, "0")}:${mins} ${ampm}`;
      } catch {
        return time24;
      }
    };

    const todayStr = new Date().toISOString().split("T")[0];
    const uniqueDates = Array.from(new Set([
      todayStr,
      ...processedUserItems.map(item => item.date),
      ...customActivities.map(item => item.date),
    ]));
    
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const circadianEvents: any[] = [];
    uniqueDates.forEach(d => {
      const isToday = d === todayStr;
      
      const sunriseTime = formatTime12h(sunTimes.sunrise);
      const sunriseMin = parseTimeToMinutes(sunriseTime);

      const peakTime = "01:00 PM";
      const peakMin = parseTimeToMinutes(peakTime);

      const sunsetTime = formatTime12h(sunTimes.sunset);
      const sunsetMin = parseTimeToMinutes(sunsetTime);

      const showSunrise = !isToday || currentMinutes >= (sunriseMin - 60);
      const showPeak = !isToday || currentMinutes >= (peakMin - 120);
      const showSunset = !isToday || currentMinutes >= (sunsetMin - 120);

      if (showSunrise) {
        circadianEvents.push({
          id: `circadian-sunrise-${d}`,
          date: d,
          time: sunriseTime,
          title: "Hito Solar: Amanecer",
          subtitle: "Ritmo Circadiano",
          type: "sunrise",
          img: null,
          kcal: 0,
          tag: "Inicio de Fase de Luz",
          coachFeedback: "Amanecer biológico. Tu cuerpo frena la melatonina e inicia la secreción de cortisol. Momento ideal para exponerte a la luz natural y activar tu metabolismo.",
        });
      }

      if (showPeak) {
        circadianEvents.push({
          id: `circadian-peak-${d}`,
          date: d,
          time: peakTime,
          title: "Pico Metabólico",
          subtitle: "Eficiencia Digestiva",
          type: "peak",
          img: null,
          kcal: 0,
          tag: "Máxima Sensibilidad",
          coachFeedback: "Pico de sensibilidad a la insulina y temperatura corporal. Tu capacidad de asimilación de nutrientes es óptima. Excelente momento para tu comida principal.",
        });
      }

      if (showSunset) {
        circadianEvents.push({
          id: `circadian-sunset-${d}`,
          date: d,
          time: sunsetTime,
          title: "Hito Solar: Atardecer",
          subtitle: "Ritmo Circadiano",
          type: "sunset",
          img: null,
          kcal: 0,
          tag: "Inicio de Fase Oscura",
          coachFeedback: "Atardecer biológico. Comienza la transición hacia la producción de melatonina. Se recomienda cenar ligero y evitar pantallas de luz azul intensa.",
        });
      }
    });

    return [...processedUserItems, ...customActivities, ...circadianEvents].sort((a, b) => {
      if (a.date !== b.date) {
        return b.date.localeCompare(a.date);
      }
      return parseTimeToMinutes(b.time) - parseTimeToMinutes(a.time);
    });
  }, [userTimelineItems, sunTimes, hydrationLevel, customActivities]);

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
                  <div class="bar-fill" style="background-color: ${(WHY_EAT_CHART_CONFIG[d.reason as keyof typeof WHY_EAT_CHART_CONFIG] as any)?.color || '#10b981'}; width: ${d.percentage}%;"></div>
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
                  <span class="badge badge-${item.type === 'food' ? 'food' : item.type === 'hydration' ? 'hydration' : item.type === 'coffee' ? 'coffee' : item.type === 'activity' ? 'activity' : 'circadian'}">
                    ${item.type === 'food' ? 'Comida' : item.type === 'hydration' ? 'Hidratación' : item.type === 'coffee' ? 'Café' : item.type === 'activity' ? 'Actividad' : 'Hito Solar'}
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

  return (
    <div className={`mx-auto w-full space-y-5 sm:space-y-8 pb-20 max-w-2xl transition-transform duration-300 ${isShaking ? "animate-bounce scale-[0.98]" : ""}`}>
      {/* Header Section (Sticky Equal-Width Subtabs) */}
      <header className="sticky top-16 z-30 bg-background/80 backdrop-blur-xl border-b border-border/60 pt-3 pb-0 transition-all">
        <div className="grid grid-cols-5 w-full select-none text-center">
          {[
            { id: "diario", label: "Diario" },
            { id: "analisis", label: "Alimentación" },
            { id: "sueno", label: "Sueño" },
            { id: "recuperacion", label: "Recuperación" },
            { id: "recetas", label: "Recetas" },
          ].map((tab) => {
            const isActive = subTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSubTab(tab.id as any)}
                className={`pb-3 text-[11px] sm:text-xs font-bold border-b-2 transition-all whitespace-nowrap text-center justify-center flex items-center cursor-pointer px-1 ${
                  isActive
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
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
                    : item.type === "peak" || item.type === "activity"
                    ? "movimiento"
                    : "nutricion"; // food, coffee, hydration

                const catConfig = {
                  mente: {
                    bg: "",
                  },
                  nutricion: {
                    bg: "",
                  },
                  movimiento: {
                    bg: "",
                  }
                }[category];

                if (item.type === "swipe-stack") {
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

                      <div id={`recipe-swipe-stack-card-${item.id}`} className="relative mb-12 md:grid md:grid-cols-2 md:gap-12 items-center group animate-in slide-in-from-top-4 duration-300">
                        {/* Timeline Dot */}
                        <div className="absolute left-0 md:left-1/2 w-4.5 h-4.5 rounded-full border-4 bg-background z-10 transform -translate-x-1/2 border-emerald-500 shadow-xs"></div>

                        {/* Time Label for Desktop */}
                        <div className={`hidden md:block ${showOnLeft ? "text-right pr-6 md:order-2" : "text-left pl-6 md:order-1"}`}>
                          <span className="font-extrabold text-base text-foreground">{item.time}</span>
                          <p className="text-emerald-500 font-bold text-xs mt-0.5">Explorar Ideas</p>
                        </div>

                        {/* Card Container */}
                        <div className={`pl-6 md:pl-0 ${showOnLeft ? "md:order-1" : "md:order-2"}`}>
                          <RecipeSwipeStack 
                            onClose={() => handleDeleteTimelineItem(item.id)}
                            savedRecipes={savedRecipes}
                            setSavedRecipes={setSavedRecipes}
                            currentSwipeIndex={currentSwipeIndex}
                            setCurrentSwipeIndex={setCurrentSwipeIndex}
                            onSaveRecipeTimeline={(recipe) => {
                              const newMeal = {
                                id: `swipe-saved-${Date.now()}`,
                                date: new Date().toISOString().split('T')[0],
                                time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
                                title: recipe.title,
                                subtitle: recipe.category || "Receta Guardada",
                                type: "food",
                                img: recipe.img,
                                kcal: recipe.kcal,
                                tags: recipe.tags || (recipe.tag ? [recipe.tag] : []),
                                tag: recipe.tag,
                                coachFeedback: recipe.coachFeedback || `Guardaste "${recipe.title}" en tu diario de alimentación.`,
                              };
                              setUserTimelineItems(prev => [newMeal, ...prev]);
                              toast.success(`❤️ Receta "${recipe.title}" agregada a tu diario`);
                            }}
                          />
                        </div>
                      </div>
                    </React.Fragment>
                  );
                }

                if (item.type === "shake-ai") {
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

                      <div className="relative mb-12 md:grid md:grid-cols-2 md:gap-12 items-center group animate-in slide-in-from-top-5 duration-300">
                        {/* Timeline Dot */}
                        <div className="absolute left-0 md:left-1/2 w-4.5 h-4.5 rounded-full border-4 bg-background z-10 transform -translate-x-1/2 border-amber-500 shadow-xs"></div>

                        {/* Time Label for Desktop */}
                        <div className={`hidden md:block ${showOnLeft ? "text-right pr-6 md:order-2" : "text-left pl-6 md:order-1"}`}>
                          <span className="font-extrabold text-base text-amber-600 dark:text-amber-400">{item.time}</span>
                          <p className="text-amber-500/80 text-xs mt-0.5 font-bold">Shake for AI</p>
                        </div>

                        {/* Card Container */}
                        <div className={`pl-6 md:pl-0 ${showOnLeft ? "md:order-1" : "md:order-2"}`}>
                          <Card className="rounded-2xl overflow-hidden transition-all duration-300 border border-amber-500/40 bg-card/90 dark:bg-card/80 backdrop-blur-md shadow-sm hover:border-amber-500/60 p-5 space-y-3.5 relative">
                            {/* Ambient Light */}
                            <div className="pointer-events-none absolute -right-10 -top-10 w-28 h-28 bg-amber-500/15 rounded-full blur-2xl" />

                            <div className="flex items-start justify-between relative z-10">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl shrink-0 shadow-xs">
                                  {item.icon || "🥤"}
                                </div>
                                <div>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 block mb-0.5">
                                    SHAKE FOR AI
                                  </span>
                                  <h4 className="text-sm font-black text-foreground">{item.title}</h4>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDeleteTimelineItem(item.id)}
                                className="text-muted-foreground hover:text-rose-500 transition-colors p-1 cursor-pointer"
                                title="Eliminar recomendación"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="bg-secondary/40 border border-border/50 rounded-xl p-3.5 text-xs text-foreground leading-relaxed font-medium relative z-10">
                              <TypewriterOnce text={item.coachFeedback || ""} speed={25} />
                            </div>

                            {item.actionText && (
                              <Button
                                onClick={() => {
                                  if (item.actionType === "water") {
                                    setHydrationLevel(prev => Math.min(8, prev + 1));
                                    const newHydCard = {
                                      id: `hydration-${Date.now()}`,
                                      date: new Date().toISOString().split("T")[0],
                                      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
                                      title: "Registro de Hidratación (+250ml)",
                                      subtitle: "Control de Rutina",
                                      type: "hydration",
                                      img: null,
                                      kcal: 0,
                                      tag: "Hidratación +250ml",
                                      coachFeedback: "Sumaste +250ml de agua pura recomendados por tu Coach IA. Tu nivel de hidratación se mantiene en estado óptimo.",
                                    };
                                    setUserTimelineItems(prev => [newHydCard, ...prev]);
                                    toast.success("✓ Registraste +250ml de agua pura");
                                  } else if (item.actionType === "scan") {
                                    setActiveModal("food-analysis");
                                  } else if (item.actionType === "recipe") {
                                    handleOpenExplorarIdeas();
                                  } else if (item.actionType === "diario") {
                                    const newClosureCard = {
                                      id: `closure-${Date.now()}`,
                                      date: new Date().toISOString().split("T")[0],
                                      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
                                      title: "Cierre de Jornada & Descanso",
                                      subtitle: "Ritmo Circadiano",
                                      type: "thought",
                                      img: null,
                                      kcal: 0,
                                      tag: "Recuperación Nocturna",
                                      coachFeedback: "Completaste el seguimiento de hábitos de hoy con éxito. Desconecta pantallas e inicia tu rutina de descanso para un sueño reparador.",
                                    };
                                    setUserTimelineItems(prev => [newClosureCard, ...prev]);
                                    toast.success("🌙 Registraste tu cierre de jornada");
                                  }
                                }}
                                className="w-full rounded-xl bg-foreground text-background font-bold text-xs h-10 hover:opacity-90 transition-opacity gap-2 relative z-10 shadow-xs cursor-pointer"
                              >
                                <span>{item.actionText}</span>
                              </Button>
                            )}
                          </Card>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                }

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
                        <Card className={`rounded-2xl overflow-hidden transition-all duration-300 shadow-none border-border hover:-translate-y-1.5 hover:shadow-xl hover:shadow-foreground/5 hover:border-border/80 cursor-pointer ${catConfig.bg}`}>
                          {item.img && (
                            <div className="relative h-40 w-full overflow-hidden">
                              <img 
                                src={item.img} 
                                alt={item.title} 
                                className="w-full h-full object-cover" 
                              />
                              {item.type !== "sunrise" && item.type !== "sunset" && item.type !== "peak" && (
                                <div className="absolute top-3 right-3 flex items-center gap-1 bg-background/80 backdrop-blur-md px-2 py-1 rounded-full border border-border/60 shadow-sm">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingTimelineItem(item);
                                    }}
                                    className="p-1 text-muted-foreground hover:text-foreground transition cursor-pointer"
                                    title="Editar registro"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (confirm(`¿Deseas eliminar "${item.title}" de tu diario?`)) {
                                        handleDeleteTimelineItem(item.id);
                                      }
                                    }}
                                    className="p-1 text-muted-foreground hover:text-rose-500 transition cursor-pointer"
                                    title="Eliminar registro"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          )}

                          <CardHeader className="p-5 pb-3">
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <CardTitle className="text-base font-bold leading-tight text-foreground">{item.title}</CardTitle>
                                  {(item.type === "sunrise" || item.type === "sunset" || item.type === "peak") && (
                                    <TooltipProvider>
                                      <ShadcnTooltip>
                                        <TooltipTrigger asChild>
                                          <button
                                            type="button"
                                            className="p-0.5 text-muted-foreground hover:text-emerald-500 transition-colors rounded-full hover:bg-secondary/60 cursor-pointer"
                                            aria-label="Información sobre ritmos circadianos"
                                          >
                                            <Info className="w-3.5 h-3.5 text-emerald-500" />
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-[280px] p-3 text-xs leading-relaxed space-y-2 bg-popover text-popover-foreground border border-border shadow-xl">
                                          <p className="font-medium">
                                            Tu cuerpo funciona en ciclos de 24 hs. Estas tarjetas te indican los momentos óptimos del día para comer, activar tu metabolismo y descansar.
                                          </p>
                                          <div className="pt-1.5 border-t border-border/60 flex justify-end">
                                            <Link
                                              to="/blog/$slug"
                                              params={{ slug: "ritmos-circadianos-y-bienestar" }}
                                              className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 hover:underline text-[11px]"
                                            >
                                              <span>Leer más</span>
                                              <ArrowUpRight className="w-3.5 h-3.5" />
                                            </Link>
                                          </div>
                                        </TooltipContent>
                                      </ShadcnTooltip>
                                    </TooltipProvider>
                                  )}
                                </div>
                                <CardDescription className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                  {item.subtitle}
                                </CardDescription>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {!item.img && item.type !== "sunrise" && item.type !== "sunset" && item.type !== "peak" && (
                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingTimelineItem(item);
                                      }}
                                      className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition cursor-pointer"
                                      title="Editar registro"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm(`¿Deseas eliminar "${item.title}" de tu diario?`)) {
                                          handleDeleteTimelineItem(item.id);
                                        }
                                      }}
                                      className="p-1.5 rounded-lg hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition cursor-pointer"
                                      title="Eliminar registro"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                )}
                                {!item.img && (
                                  <div className="w-9 h-9 rounded-full bg-secondary text-muted-foreground flex items-center justify-center shrink-0 border border-border/40">
                                    {item.type === "hydration" && <Droplet className="w-4.5 h-4.5" />}
                                    {item.type === "coffee" && <Coffee className="w-4.5 h-4.5" />}
                                    {item.type === "thought" && <Sparkles className="w-4.5 h-4.5" />}
                                    {item.type === "sunrise" && <Sun className="w-4.5 h-4.5 text-amber-500" />}
                                    {item.type === "sunset" && <Moon className="w-4.5 h-4.5 text-indigo-400" />}
                                    {item.type === "peak" && <TrendingUp className="w-4.5 h-4.5 text-emerald-500" />}
                                    {item.type === "activity" && <Activity className="w-4.5 h-4.5 text-orange-500" />}
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardHeader>

                          {(item.type === "food" || item.type === "coffee") ? (
                            <CardContent className="px-5 pb-4 pt-0">
                              <MealOrganizerBadges
                                category={item.subtitle}
                                tags={item.tags || (item.tag ? [item.tag] : [])}
                              />
                            </CardContent>
                          ) : (item.kcal > 0 || item.tag) && (
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
                                <Sun className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                              ) : item.type === "sunset" ? (
                                <Moon className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                              ) : item.type === "peak" ? (
                                <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              ) : item.type === "activity" ? (
                                <Activity className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
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
                          <button type="button" className="text-muted-foreground hover:text-emerald-500 transition-colors cursor-pointer" aria-label="Información de alimentación consciente">
                            <Info className="w-3.5 h-3.5 text-emerald-500" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[280px] p-3 text-xs leading-relaxed space-y-2 bg-popover text-popover-foreground border border-border shadow-xl">
                          <p className="font-medium">
                            El porcentaje de consistencia calculado en base a tu objetivo diario de comidas registradas versus las comidas reales cargadas en tu diario.
                          </p>
                          <div className="pt-1.5 border-t border-border/60 flex justify-end">
                            <Link
                              to="/blog/$slug"
                              params={{ slug: "alimentacion-consciente-y-adherencia" }}
                              className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 hover:underline text-[11px]"
                            >
                              <span>Leer más</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
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
                      {...({ barSize: 15 } as any)}
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
                          <button type="button" className="text-muted-foreground hover:text-emerald-500 transition-colors cursor-pointer" aria-label="Información de causas de ingesta">
                            <Info className="w-3.5 h-3.5 text-emerald-500" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[280px] p-3 text-xs leading-relaxed space-y-2 bg-popover text-popover-foreground border border-border shadow-xl">
                          <p className="font-medium">
                            Clasificar tus ingestas te ayuda a distinguir el hambre fisiológica real de los desencadenantes de hambre emocional (como aburrimiento, estrés o hábitos sociales).
                          </p>
                          <div className="pt-1.5 border-t border-border/60 flex justify-end">
                            <Link
                              to="/blog/$slug"
                              params={{ slug: "hambre-emocional-vs-fisiologica" }}
                              className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 hover:underline text-[11px]"
                            >
                              <span>Leer más</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
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
                      data={whyEatData}
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
                          <button type="button" className="text-muted-foreground hover:text-emerald-500 transition-colors cursor-pointer" aria-label="Información de síntomas físicos">
                            <Info className="w-3.5 h-3.5 text-emerald-500" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[280px] p-3 text-xs leading-relaxed space-y-2 bg-popover text-popover-foreground border border-border shadow-xl">
                          <p className="font-medium">
                            Registrar molestias corporales post-ingesta ayuda a identificar intolerancias alimentarias ocultas y a comprender cómo reacciona tu digestión ante diferentes tipos de nutrientes.
                          </p>
                          <div className="pt-1.5 border-t border-border/60 flex justify-end">
                            <Link
                              to="/blog/$slug"
                              params={{ slug: "sintomas-fisicos-salud-digestiva" }}
                              className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 hover:underline text-[11px]"
                            >
                              <span>Leer más</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
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

            {/* Balance Alimentario */}
            <Card className="col-span-1 flex flex-col justify-between p-5 space-y-4">
              <CardHeader className="p-0 flex flex-row items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <CardTitle className="text-base font-bold text-foreground tracking-tight">Balance Alimentario</CardTitle>
                  <TooltipProvider>
                    <ShadcnTooltip>
                      <TooltipTrigger asChild>
                        <button type="button" className="text-muted-foreground hover:text-emerald-500 transition-colors cursor-pointer" aria-label="Información del Balance Alimentario">
                          <Info className="w-3.5 h-3.5 text-emerald-500" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[280px] p-3 text-xs leading-relaxed space-y-2 bg-popover text-popover-foreground border border-border shadow-xl">
                        <p className="font-medium">
                          Evaluación multidimensional de tus hábitos: calidad nutricional, densidad de comida real, hidratación, sincronía con tus horarios y escucha corporal (Body Awareness).
                        </p>
                        <div className="pt-1.5 border-t border-border/60 flex justify-end">
                          <Link
                            to="/blog/$slug"
                            params={{ slug: "por-que-no-contar-calorias-nutricion-consciente" }}
                            className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 hover:underline text-[11px]"
                          >
                            <span>Leer más</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </TooltipContent>
                    </ShadcnTooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-baseline gap-1 bg-secondary/40 px-2.5 py-1 rounded-xl border border-border/40">
                  <span className="text-xs font-black text-foreground">85</span>
                  <span className="text-[10px] text-muted-foreground font-bold">/100 Pts</span>
                </div>
              </CardHeader>

              <CardContent className="p-0 pt-2 flex-1 flex items-center justify-center">
                <ChartContainer
                  config={HOLISTIC_RADAR_CONFIG}
                  className="mx-auto aspect-square w-full max-h-[195px] select-none"
                >
                  <RadarChart data={HOLISTIC_RADAR_DATA} margin={{ top: 10, right: 15, bottom: 10, left: 15 }}>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <PolarGrid strokeWidth={1} stroke="var(--border)" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: "var(--muted-foreground)", fontSize: 8.5, fontWeight: 700 }}
                    />
                    <Radar
                      name="Nivel"
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
                          <button type="button" className="text-muted-foreground hover:text-emerald-500 transition-colors cursor-pointer" aria-label="Información de tendencia del plato colorido">
                            <Info className="w-3.5 h-3.5 text-emerald-500" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[280px] p-3 text-xs leading-relaxed space-y-2 bg-popover text-popover-foreground border border-border shadow-xl">
                          <p className="font-medium">
                            Este gráfico categoriza tus comidas según su color dominante, reflejando el aporte de fitonutrientes y antioxidantes en tu dieta para asegurar un plato balanceado.
                          </p>
                          <div className="pt-1.5 border-t border-border/60 flex justify-end">
                            <Link
                              to="/blog/$slug"
                              params={{ slug: "platodelbienestar-fitonutrientes-colores" }}
                              className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 hover:underline text-[11px]"
                            >
                              <span>Leer más</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
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
                          <button type="button" className="text-muted-foreground hover:text-emerald-500 transition-colors cursor-pointer" aria-label="Información de alineación circadiana">
                            <Info className="w-3.5 h-3.5 text-emerald-500" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[280px] p-3 text-xs leading-relaxed space-y-2 bg-popover text-popover-foreground border border-border shadow-xl">
                          <p className="font-medium">
                            Mantener tu ventana de alimentación sincronizada con tu ritmo circadiano optimiza la sensibilidad a la insulina y favorece la digestión antes de tu descanso.
                          </p>
                          <div className="pt-1.5 border-t border-border/60 flex justify-end">
                            <Link
                              to="/blog/$slug"
                              params={{ slug: "ritmos-circadianos-y-bienestar" }}
                              className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 hover:underline text-[11px]"
                            >
                              <span>Leer más</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
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

      {/* Dedicated Pestaña: Sueño & Ritmo Circadiano */}
      {subTab === "sueno" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* CARD 1: Gestión y Seguimiento del Sueño con Filtros (Full Width) */}
          <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all flex flex-col justify-between w-full">
            {/* Card Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border/40 pb-3 gap-3">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-indigo-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-muted-foreground/80 font-bold uppercase tracking-wider block mb-0.5">
                    Fisiología & Descanso
                  </span>
                  <h3 className="text-sm font-bold text-foreground">Gestión & Seguimiento del Sueño</h3>
                </div>
                <TooltipProvider>
                  <ShadcnTooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="p-1 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors shrink-0 flex items-center justify-center cursor-pointer border-0 bg-transparent"
                      >
                        <Info className="w-3.5 h-3.5 text-emerald-500" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" align="start" className="max-w-xs p-3.5 bg-card border border-border shadow-xl rounded-2xl text-xs space-y-2 text-left">
                      <p className="font-bold text-foreground">Evidencia Científica del Sueño</p>
                      <p className="text-muted-foreground text-[11px] leading-relaxed">
                        La fase de sueño de onda lenta (SWS) secreta el 60-70% de la hormona de crecimiento (hGH) para reparar tejidos musculares. Dormir menos de 8 horas duplica (1.7x) el riesgo de lesiones.
                      </p>
                      <div className="pt-1.5 border-t border-border/60 text-[10px]">
                        <Link
                          to="/blog/$slug"
                          params={{ slug: "fisiologia-del-sueno-y-recuperacion-muscular" }}
                          className="text-emerald-500 font-bold hover:underline flex items-center justify-between gap-1 group"
                        >
                          <span>📖 Leer evidencia sobre hGH, cortisol y lesiones</span>
                          <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                      </div>
                    </TooltipContent>
                  </ShadcnTooltip>
                </TooltipProvider>
              </div>

              {/* Filtros de Tiempo (Pills) Alineados */}
              <div className="flex items-center gap-1 bg-secondary/60 p-1 rounded-2xl border border-border/60 shrink-0 self-end sm:self-center">
                {(["week", "month", "quarter"] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setSleepFilter(period)}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                      sleepFilter === period
                        ? "bg-foreground text-background shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {period === "week" ? "Semana" : period === "month" ? "Mes" : "Trimestre"}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats Bar Explicativas */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 bg-secondary/30 border border-border/40 rounded-2xl flex flex-col justify-center">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block mb-0.5">Promedio Noche</span>
                <span className="text-xs sm:text-sm font-black text-foreground">{avgSleepHours}h</span>
                <span className="text-[9px] text-muted-foreground font-semibold">por descanso</span>
              </div>
              <div className="p-2.5 bg-secondary/30 border border-border/40 rounded-2xl flex flex-col justify-center">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block mb-0.5">Meta Circadiana</span>
                <span className="text-xs sm:text-sm font-black text-indigo-500">{targetPercent}%</span>
                <span className="text-[9px] text-muted-foreground font-semibold">de 8h objetivo</span>
              </div>
              <div className="p-2.5 bg-secondary/30 border border-border/40 rounded-2xl flex flex-col justify-center">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block mb-0.5">Calidad (SWS)</span>
                <span className="text-xs sm:text-sm font-black text-emerald-500">{sleepData.score} Pts</span>
                <span className="text-[9px] text-emerald-500/80 font-bold">{sleepData.quality}</span>
              </div>
            </div>

            {/* AreaChart para el Seguimiento del Sueño */}
            <div className="h-44 w-full pt-1">
              <ChartContainer config={sleepChartConfig} className="h-full w-full">
                <AreaChart data={sleepHistory[sleepFilter]} margin={{ top: 12, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="sleepAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={6} tick={{ fontSize: 10, fill: "currentColor", opacity: 0.7 }} />
                  <YAxis domain={[4, 10]} ticks={[4, 6, 8, 10]} tickLine={false} axisLine={false} tickMargin={4} tickFormatter={(v) => `${v}h`} tick={{ fontSize: 10, fill: "currentColor", opacity: 0.7 }} />
                  <ReferenceLine y={8} stroke="#6366f1" strokeDasharray="3 3" opacity={0.6} label={{ value: "Obj. 8h", position: "insideTopRight", fill: "#6366f1", fontSize: 9, fontWeight: "bold" }} />
                  <ChartTooltip content={<ChartTooltipContent indicator="line" formatter={(value) => [`${value} hrs`, "Sueño"]} />} />
                  <Area type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#sleepAreaGradient)" dot={{ r: 3.5, fill: "#6366f1", strokeWidth: 0 }} activeDot={{ r: 5.5, strokeWidth: 0 }} />
                </AreaChart>
              </ChartContainer>
            </div>

            {/* Bottom Info & Register Action */}
            <div className="space-y-3 pt-1 border-t border-border/40">
              <div className="flex flex-wrap justify-between items-center text-[10px] text-muted-foreground gap-1">
                <span>Horario habitual ({sleepData.bedtime} - {sleepData.wakeTime})</span>
                <span className="text-indigo-400 font-semibold">Atardecer: {sunTimes.sunset}</span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1">
                  {sleepData.factors.map((factor) => (
                    <span key={factor} className="px-2 py-0.5 rounded-md bg-secondary/40 text-muted-foreground text-[10px] font-semibold">
                      ✓ {factor}
                    </span>
                  ))}
                </div>

                <Button
                  onClick={() => setActiveModal("registrar-sueno")}
                  size="sm"
                  className="h-8 px-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Registrar</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Pestaña: Recuperación Muscular */}
      {subTab === "recuperacion" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all flex flex-col justify-between h-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-border/40 pb-3">
              <div className="flex items-center gap-2">
                <div>
                  <span className="text-[10px] text-muted-foreground/80 font-bold uppercase tracking-wider block mb-0.5">
                    Recuperación Tisular
                  </span>
                  <h3 className="text-sm font-bold text-foreground">Fatiga & Estado Muscular por Grupos</h3>
                </div>
                <TooltipProvider>
                  <ShadcnTooltip>
                    <TooltipTrigger asChild>
                      <button 
                        type="button"
                        className="p-1 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors shrink-0 flex items-center justify-center cursor-pointer border-0 bg-transparent"
                      >
                        <Info className="w-3.5 h-3.5 text-emerald-500" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" align="start" className="max-w-xs p-3.5 bg-card border border-border shadow-xl rounded-2xl text-xs space-y-2 text-left">
                      <div className="flex gap-2 pb-2 border-b border-border/50">
                        <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="block font-bold text-foreground mb-0.5">Exclusión por Fatiga</span>
                          <span className="text-muted-foreground text-[11px] leading-relaxed">
                            Músculos &lt; 70% se excluyen del Generador de Workouts IA para prevenir lesiones.
                          </span>
                        </div>
                      </div>
                      <div className="pt-1 border-t border-border/60 text-[10px]">
                        <Link 
                          to="/blog/$slug"
                          params={{ slug: "fisiologia-de-la-recuperacion-muscular-y-fatiga" }}
                          className="text-emerald-500 font-bold hover:underline flex items-center justify-between gap-1 group"
                        >
                          <span>🛡️ Leer evidencia de fatiga</span>
                          <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                      </div>
                    </TooltipContent>
                  </ShadcnTooltip>
                </TooltipProvider>
              </div>

              <Button
                onClick={() => setIsEditingRecovery(!isEditingRecovery)}
                variant={isEditingRecovery ? "default" : "outline"}
                className="h-8 px-3 rounded-xl font-bold flex items-center gap-1.5 text-[11px] transition-colors shrink-0 cursor-pointer"
              >
                {isEditingRecovery ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Guardar
                  </>
                ) : (
                  <>
                    <Edit className="w-3.5 h-3.5" />
                    Editar Estado
                  </>
                )}
              </Button>
            </div>

            {/* Muscles List Grid (2 Columnas Simétricas) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {muscleImages.map(m => {
                const value = muscleRecovery[m.id] ?? 100;
                const isExcluded = value < 70;
                return (
                  <div key={m.id} className="flex items-center justify-between p-3 bg-secondary/20 border border-border/40 rounded-2xl transition duration-300 hover:border-foreground/20">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-secondary/50 flex items-center justify-center p-1 shrink-0 border border-border/40">
                        <img src={m.img} alt={m.name} className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-foreground">{m.name}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {isExcluded ? "En descanso (IA Excluido)" : "Listo para cargar"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
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
                            className="w-16 sm:w-20 h-1.5 bg-secondary rounded-lg cursor-pointer accent-foreground"
                          />
                          <span className="text-xs font-extrabold text-foreground w-7 text-right shrink-0">{value}%</span>
                        </div>
                      ) : (
                        <div 
                          onClick={() => setIsEditingRecovery(true)}
                          className="flex items-center gap-2 cursor-pointer group"
                          title="Haga clic para editar manualmente"
                        >
                          <span className="text-xs font-extrabold text-foreground w-7 text-right shrink-0">{value}%</span>
                          <div className="w-14 h-2 bg-secondary rounded-full overflow-hidden shrink-0">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${isExcluded ? "bg-rose-500" : "bg-emerald-500"}`}
                              style={{ width: `${value}%` }}
                            />
                          </div>
                          <Edit className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
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

      {subTab === "recetas" && (
        <RecipesGridTab 
          savedRecipes={savedRecipes} 
          setSavedRecipes={setSavedRecipes}
          cartRecipeIds={cartRecipeIds}
          onToggleCart={toggleCartRecipe}
          onOpenCart={() => setIsCartOpen(true)}
          onExploreClick={handleOpenExplorarIdeas}
          onOpenDetail={(recipe) => setActiveRecipeDetail(recipe)}
        />
      )}

      {activeRecipeDetail && (
        <RecipeDetailModal 
          recipe={activeRecipeDetail}
          onClose={() => setActiveRecipeDetail(null)}
          isInCart={cartRecipeIds.includes(activeRecipeDetail.id)}
          onToggleCart={toggleCartRecipe}
          onLog={(recipe) => {
            const newMeal = {
              id: `custom-recipe-${Date.now()}`,
              date: new Date().toISOString().split('T')[0],
              time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
              title: recipe.title,
              subtitle: recipe.category,
              type: "food",
              img: recipe.img,
              kcal: recipe.kcal,
              tags: recipe.tags || (recipe.tag ? [recipe.tag] : []),
              tag: recipe.tag,
              coachFeedback: recipe.coachFeedback,
            };
            setUserTimelineItems(prev => [newMeal, ...prev]);
            setActiveRecipeDetail(null);
            setSubTab("diario");
            alert(`¡Registrado! Se añadió "${recipe.title}" a tu diario de hoy.`);
          }}
          onRemove={(recipeId) => {
            setSavedRecipes(prev => prev.filter(id => id !== recipeId));
            setCartRecipeIds(prev => prev.filter(id => id !== recipeId));
            setActiveRecipeDetail(null);
          }}
        />
      )}

      {isCartOpen && (
        <ShoppingCartModal 
          cartRecipeIds={cartRecipeIds}
          onClose={() => setIsCartOpen(false)}
          onToggleCart={toggleCartRecipe}
          onClearCart={() => setCartRecipeIds([])}
        />
      )}



      {/* FAB Overlay Blur */}
      {isFabOpen && (
        <div 
          className="fixed inset-0 bg-background/60 backdrop-blur-md z-40 animate-in fade-in duration-300"
          onClick={() => setIsFabOpen(false)}
        />
      )}

      {/* FAB Menu */}
      <div className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-50 flex flex-col items-end gap-3">
        {isFabOpen && (
          <div className="bg-card/95 border border-border/80 rounded-3xl p-2 sm:p-2.5 shadow-2xl min-w-[260px] sm:min-w-[280px] max-w-[310px] animate-in slide-in-from-bottom-4 fade-in duration-200 space-y-0.5 backdrop-blur-xl">
            {/* Group 1: Registros Diarios */}
            <button 
              onClick={() => {
                setIsFabOpen(false);
                setActiveModal("registrar-sueno");
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-secondary/70 transition-colors text-left group cursor-pointer"
            >
              <Moon className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform shrink-0" />
              <span className="text-xs font-semibold text-foreground flex-1">Registrar sueño & descanso</span>
            </button>

            <button 
              onClick={() => {
                setIsFabOpen(false);
                setActiveModal("estado-actual");
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-secondary/70 transition-colors text-left group cursor-pointer"
            >
              <Heart className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform shrink-0" />
              <span className="text-xs font-semibold text-foreground flex-1">Registrar estado actual</span>
            </button>

            <button 
              onClick={() => {
                setIsFabOpen(false);
                setActiveModal("registrar-hidratacion");
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-secondary/70 transition-colors text-left group cursor-pointer"
            >
              <Droplet className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform shrink-0" />
              <span className="text-xs font-semibold text-foreground flex-1">Registrar hidratación</span>
            </button>

            <button 
              onClick={() => {
                setIsFabOpen(false);
                setActiveModal("food-analysis");
                setFoodAnalysisStep("upload");
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-secondary/70 transition-colors text-left group cursor-pointer"
            >
              <Camera className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform shrink-0" />
              <span className="text-xs font-semibold text-foreground flex-1">Registrar comida</span>
            </button>

            <button 
              onClick={() => {
                setIsFabOpen(false);
                setActiveModal("registrar-actividad");
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-secondary/70 transition-colors text-left group cursor-pointer"
            >
              <Activity className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform shrink-0" />
              <span className="text-xs font-semibold text-foreground flex-1">Registrar actividad</span>
            </button>

            {/* Separator Line */}
            <div className="h-[1px] bg-border/50 my-1 mx-2" />

            {/* Group 2: Herramientas IA & Exploración */}
            <button 
              onClick={() => {
                setIsFabOpen(false);
                setActiveModal("generate-workout");
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-secondary/70 transition-colors text-left group cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform shrink-0" />
              <span className="text-xs font-semibold text-foreground flex-1">Generar Workout con IA</span>
            </button>

            <button 
              onClick={() => {
                setIsFabOpen(false);
                handleOpenExplorarIdeas();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-secondary/70 transition-colors text-left group cursor-pointer"
            >
              <Utensils className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform shrink-0" />
              <span className="text-xs font-semibold text-foreground flex-1">Explorar ideas</span>
            </button>

            <button 
              onClick={() => {
                setIsFabOpen(false);
                triggerShakeAI();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-secondary/70 transition-colors text-left group cursor-pointer"
            >
              <span className="text-base leading-none shrink-0 group-hover:scale-110 transition-transform">🥤</span>
              <span className="text-xs font-semibold text-foreground flex-1">Shake for AI (Sugerencia)</span>
            </button>
          </div>
        )}
        
        <button 
          onClick={() => setIsFabOpen(!isFabOpen)}
          className="w-14 h-14 rounded-full bg-foreground text-background flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
          aria-label="Abrir menú de acciones"
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
                {/* Encabezado Principal de la Comida */}
                <div className="mb-4">
                  <h2 className="text-lg font-black text-foreground tracking-tight leading-snug">Chicken Phở con Vegetales</h2>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">ANÁLISIS DE CALIDAD NUTRICIONAL</p>
                </div>

                {/* Score de Calidad Nutricional basado en evidencia */}
                <div className="bg-card border border-border rounded-2xl p-4 mb-6 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">SCORE NRF 9.3</span>
                      <TooltipProvider>
                        <ShadcnTooltip>
                          <TooltipTrigger asChild>
                            <Link
                              to="/blog/$slug"
                              params={{ slug: "score-calidad-nutricional-evidencia" }}
                              className="w-5 h-5 rounded-full bg-secondary border border-border/60 text-muted-foreground hover:text-foreground hover:bg-secondary/80 flex items-center justify-center transition-colors cursor-pointer"
                              aria-label="Información del Score Nutricional"
                            >
                              <Info className="w-3.5 h-3.5" />
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-[260px] p-3 text-xs leading-relaxed space-y-2 bg-popover text-popover-foreground border border-border shadow-xl">
                            <p className="font-medium">
                              Score basado en el <strong>Nutrient Rich Foods Index (NRF 9.3)</strong> y la escala <strong>NOVA</strong> de procesamiento.
                            </p>
                            <div className="pt-1.5 border-t border-border/60 flex justify-end">
                              <Link
                                to="/blog/$slug"
                                params={{ slug: "score-calidad-nutricional-evidencia" }}
                                className="inline-flex items-center gap-1 font-bold text-foreground hover:underline text-[11px]"
                              >
                                <span>Leer más</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </TooltipContent>
                        </ShadcnTooltip>
                      </TooltipProvider>
                    </div>
                    <span className="bg-secondary text-foreground text-xs font-bold px-3 py-1 rounded-full">
                      Excelente
                    </span>
                  </div>
                  
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-4xl font-black text-foreground tracking-tight">88</span>
                    <span className="text-xs font-bold text-muted-foreground">/ 100 pts</span>
                  </div>

                  {/* Barra de progreso */}
                  <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden flex p-0.5 border border-border/60">
                    <div className="h-full bg-foreground rounded-full transition-all duration-1000" style={{ width: "88%" }}></div>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-muted-foreground mt-1.5 px-0.5">
                    <span>0 (Bajo)</span>
                    <span>50 (Moderado)</span>
                    <span>100 (Excelente)</span>
                  </div>
                </div>
                
                {/* Vectores completos de Calidad Nutricional NRF 9.3 & LIM3 */}
                <div className="space-y-6">
                  {/* 1. Matriz de Procesamiento Industrial (NOVA) */}
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">MATRIZ INDUSTRIAL</h4>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-xs font-bold text-foreground">Grado de Procesamiento</span>
                      <span className="bg-secondary text-foreground text-xs font-bold px-3 py-1 rounded-full">
                        Mínimamente Procesado
                      </span>
                    </div>
                  </div>

                  {/* 2. 9 Nutrientes a Promover (NR9) */}
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">NUTRIENTES A PROMOVER (NR9)</h4>
                    <div className="space-y-2.5">
                      {[
                        { label: "Proteína Magra", value: "Alta Calidad", isPrimary: true },
                        { label: "Fibra Dietética", value: "Buena Fuente", isPrimary: true },
                        { label: "Hierro", value: "Buena Fuente", isPrimary: true },
                        { label: "Magnesio", value: "Buena Fuente", isPrimary: true },
                        { label: "Calcio", value: "Aporte Moderado", isPrimary: false },
                        { label: "Potasio", value: "Buena Fuente", isPrimary: true },
                        { label: "Vitamina C", value: "Buena Fuente", isPrimary: true },
                        { label: "Vitamina A", value: "Aporte Moderado", isPrimary: false },
                        { label: "Vitamina E", value: "Aporte Moderado", isPrimary: false },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-0.5">
                          <span className="text-xs font-bold text-foreground">{item.label}</span>
                          <span className={`${item.isPrimary ? "bg-secondary text-foreground font-bold" : "bg-secondary/60 text-muted-foreground font-medium"} text-xs px-3 py-1 rounded-full`}>
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. 3 Componentes a Moderar / Limitar (LIM3) */}
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">COMPONENTES A LIMITAR (LIM3)</h4>
                    <div className="space-y-2.5">
                      {[
                        { label: "Azúcares Añadidos", value: "Sin Añadidos", isPrimary: true },
                        { label: "Grasas Saturadas / Trans", value: "Bajo", isPrimary: true },
                        { label: "Sodio", value: "Elevado", isPrimary: false },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-0.5">
                          <span className="text-xs font-bold text-foreground">{item.label}</span>
                          <span className={`${item.isPrimary ? "bg-secondary text-foreground font-bold" : "bg-secondary/60 text-muted-foreground font-medium"} text-xs px-3 py-1 rounded-full`}>
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => setFoodAnalysisStep("reason")} 
                  className="w-full rounded-xl h-12 text-sm font-bold bg-foreground text-background hover:opacity-90 mt-6 shadow-md"
                >
                  Continuar a Registro
                </Button>

                {/* Caja de Insight del AI Coach (Copiado idéntico al pie de card de timeline de la imagen) */}
                <div className="mt-6 pt-4 border-t border-border/60 flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-foreground/80 shrink-0 mt-0.5" />
                  <p className="text-xs font-medium text-foreground/80 leading-relaxed">
                    Excelente balance de proteínas y fibra en la sopa. Considerá controlar el aporte de sodio del caldo para optimizar tu perfil diario.
                  </p>
                </div>
              </div>
            )}

            {/* Paso 4: ¿Por qué comiste? */}
            {foodAnalysisStep === "reason" && (
              <div className="px-6 pb-8 overflow-y-auto animate-in slide-in-from-right-4 fade-in duration-300">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-1">¿Por qué comiste?</h3>
                <p className="text-xs text-muted-foreground font-medium mb-5">Selecciona el motivo o desencadenante principal de esta ingesta para tu diario de alimentación.</p>
                
                <div className="grid grid-cols-2 gap-2.5 mb-6">
                  {[
                    { id: "hambre", label: "Hambre", icon: "🌱", color: "hover:border-emerald-500/50 hover:bg-emerald-500/5" },
                    { id: "estres", label: "Estrés", icon: "⚡", color: "hover:border-rose-500/50 hover:bg-rose-500/5" },
                    { id: "sabor", label: "Sabor", icon: "😋", color: "hover:border-amber-500/50 hover:bg-amber-500/5" },
                    { id: "social", label: "Social", icon: "👥", color: "hover:border-sky-500/50 hover:bg-sky-500/5" },
                    { id: "habito", label: "Hábito", icon: "🔄", color: "hover:border-indigo-500/50 hover:bg-indigo-500/5" },
                    { id: "emocional", label: "Emocional", icon: "💖", color: "hover:border-pink-500/50 hover:bg-pink-500/5" },
                    { id: "aburrimiento", label: "Aburrimiento", icon: "🥱", color: "hover:border-purple-500/50 hover:bg-purple-500/5" },
                    { id: "otro", label: "Otro", icon: "❓", color: "hover:border-slate-500/50 hover:bg-slate-500/5" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedEatReason(item.id)}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all text-left ${
                        selectedEatReason === item.id 
                          ? "border-foreground bg-secondary/90 font-bold shadow-sm" 
                          : `border-border bg-card font-medium ${item.color}`
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-xs text-foreground font-semibold">{item.label}</span>
                    </button>
                  ))}
                </div>

                <div className="flex gap-2.5">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFoodAnalysisStep("report")}
                    className="rounded-xl h-11 text-xs font-bold border-border"
                  >
                    Atrás
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      const isNegativeTrigger = ["estres", "emocional", "aburrimiento"].includes(selectedEatReason);
                      if (isNegativeTrigger) {
                        setFoodAnalysisStep("breathing_prompt");
                      } else {
                        handleFinalizeFoodRegistration();
                      }
                    }}
                    className="flex-1 rounded-xl h-11 text-sm font-bold bg-foreground text-background hover:opacity-90 shadow-md"
                  >
                    Guardar Registro
                  </Button>
                </div>
              </div>
            )}

            {/* Paso 5: Sugerencia de Respiración Guiada para emociones negativas */}
            {foodAnalysisStep === "breathing_prompt" && (
              <div className="px-6 pb-8 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-300">
                <div className="w-14 h-14 rounded-full bg-secondary border border-border/80 text-foreground flex items-center justify-center mb-4 mt-4 shadow-xs">
                  <Brain className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-black text-foreground mb-2 tracking-tight">Pausa Reguladora</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-6 max-w-[280px] font-medium">
                  Detectamos que el motivo de tu comida fue <strong>{WHY_EAT_CHART_CONFIG[selectedEatReason as keyof typeof WHY_EAT_CHART_CONFIG]?.label || selectedEatReason}</strong>. ¿Te gustaría hacer 1 minuto de respiración guiada para autorregular tu sistema nervioso?
                </p>
                
                <div className="w-full space-y-2.5">
                  <Button
                    type="button"
                    onClick={() => {
                      setBreathingStartTime(Date.now());
                      setBreathingPhase("inhale");
                      setBreathingSeconds(4);
                      setBreathingCyclesCompleted(0);
                      setBreathingOrbScale(0.60);
                      setFoodAnalysisStep("breathing_exercise");
                    }}
                    className="w-full rounded-xl h-12 text-sm font-bold bg-foreground text-background hover:opacity-90 shadow-md"
                  >
                    Iniciar Respiración Guiada
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleFinalizeFoodRegistration()}
                    className="w-full rounded-xl h-10 text-xs font-bold text-muted-foreground hover:text-foreground"
                  >
                    Omitir e ir a guardar
                  </Button>
                </div>
              </div>
            )}

            {/* Paso 6: Ejercicio Interactivo de Respiración Guiada */}
            {foodAnalysisStep === "breathing_exercise" && (
              <div className="px-6 pb-8 flex flex-col items-center text-center animate-in fade-in duration-300">
                <div className="flex justify-between items-center w-full mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">RESPIRACIÓN CUADRADA</span>
                  <span className="bg-secondary text-foreground text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-border/60">
                    Ciclos completados: {breathingCyclesCompleted}
                  </span>
                </div>
                
                {/* Círculo animado interactivo: Expansión y contracción continua a 60 FPS sincronizado en tiempo real */}
                <div className="relative w-44 h-44 my-6 flex items-center justify-center">
                  <div 
                    style={{ 
                      transform: `scale(${breathingOrbScale})`
                    }}
                    className="absolute inset-0 rounded-full border-2 bg-secondary/80 border-foreground/60 shadow-md"
                  />
                  <div className="relative z-10 flex flex-col items-center">
                    <span className="text-base font-black tracking-wider uppercase text-foreground">
                      {breathingPhase === "inhale" && "Inhala"}
                      {breathingPhase === "hold1" && "Pausa (Lleno)"}
                      {breathingPhase === "exhale" && "Exhala"}
                      {breathingPhase === "hold2" && "Pausa (Vacío)"}
                    </span>
                    <span className="text-3xl font-black text-foreground tracking-tight mt-1">{breathingSeconds}s</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mb-6 font-medium max-w-[260px] h-8 flex items-center justify-center">
                  {breathingPhase === "inhale" && "Inhala profundamente por la nariz expandiendo el abdomen."}
                  {breathingPhase === "hold1" && "Sostén el aire con serenidad en la caja torácica."}
                  {breathingPhase === "exhale" && "Exhala lentamente por la boca liberando toda la tensión."}
                  {breathingPhase === "hold2" && "Mantén los pulmones vacíos en profunda calma."}
                </p>

                <Button
                  type="button"
                  onClick={() => handleFinalizeFoodRegistration()}
                  className="w-full rounded-xl h-11 text-xs font-bold bg-foreground text-background hover:opacity-90 shadow-md"
                >
                  Finalizar y Guardar
                </Button>
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








      {/* Registrar Hidratación Modal */}
      {activeModal === "registrar-hidratacion" && (
        <HydrationLogModal 
          onClose={() => setActiveModal("none")} 
          currentLevel={hydrationLevel}
          onSave={(level) => {
            setHydrationLevel(level);
            const newHyd = {
              id: `hydration-log-${Date.now()}`,
              date: new Date().toISOString().split("T")[0],
              time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
              title: `Registro de Hidratación (Nivel ${level})`,
              subtitle: "Control de Rutina",
              type: "hydration",
              img: null,
              kcal: 0,
              tag: `Nivel ${level}`,
              coachFeedback: `Actualizaste tu nivel de hidratación a ${level}/8. Mantener una ingesta sostenida de agua optimiza la oxigenación celular y previene la fatiga muscular.`
            };
            setUserTimelineItems(prev => [newHyd, ...prev]);
            toast.success(`✓ Registraste tu nivel de hidratación: ${level}/8`);
          }}
        />
      )}

      {/* Modal Registrar Estado Actual */}
      {activeModal === "estado-actual" && (
        <StateLogModal 
          onClose={() => setActiveModal("none")}
          mood={mood}
          setMood={setMood}
          hunger={hunger}
          setHunger={setHunger}
          energy={energy}
          setEnergy={setEnergy}
          onSave={() => {
            const newStatusCard = {
              id: `status-log-${Date.now()}`,
              date: new Date().toISOString().split("T")[0],
              time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
              title: "Registro de Estado Actual",
              subtitle: "Autoconocimiento & Bienestar",
              type: "thought",
              img: null,
              kcal: 0,
              tag: `Ánimo: ${mood}% • Apetito: ${hunger}% • Energía: ${energy}%`,
              coachFeedback: `Registraste tu estado de bienestar de hoy. Ánimo: ${mood >= 60 ? "Calmo" : "Ansioso"}, Apetito: ${hunger >= 60 ? "Saciado" : "Hambriento"}, Energía: ${energy >= 60 ? "Enérgico" : "Cansado"}. Este monitoreo regular optimiza tu autorregulación conductual.`
            };
            setUserTimelineItems(prev => [newStatusCard, ...prev]);
            setActiveModal("none");
            toast.success("✓ Registro de estado actual guardado en tu diario");
          }}
        />
      )}

      {/* Modal Registrar Sueño & Descanso */}
      {activeModal === "registrar-sueno" && (
        <SleepLogModal
          onClose={() => setActiveModal("none")}
          onSave={(data) => {
            const totalHours = data.hours + data.minutes / 60;
            setSleepData({
              duration: `${data.hours}h ${data.minutes}m`,
              hours: totalHours,
              bedtime: data.bedtime,
              wakeTime: data.wakeTime,
              quality: data.quality,
              score: data.score,
              factors: data.factors,
            });

            if (totalHours < 6) {
              setMuscleRecovery((prev) => {
                const updated: Record<string, number> = {};
                Object.keys(prev).forEach((key) => {
                  updated[key] = Math.max(20, prev[key] - 15);
                });
                return updated;
              });
            }

            // Update real-time sleep history chart
            setSleepHistory((prev: typeof INITIAL_SLEEP_HISTORY) => {
              const updatedWeek = [...prev.week];
              updatedWeek[updatedWeek.length - 1] = {
                ...updatedWeek[updatedWeek.length - 1],
                hours: Number(totalHours.toFixed(1)),
                qualityScore: data.score,
              };
              return { ...prev, week: updatedWeek };
            });

            const newSleepItem = {
              id: `sleep-${Date.now()}`,
              date: new Date().toISOString().split("T")[0],
              time: data.wakeTime,
              title: `Descanso Nocturno (${data.hours}h ${data.minutes}m)`,
              subtitle: `Calidad: ${data.quality}`,
              type: "thought",
              kcal: 0,
              tag: "Sueño & Circadiano",
              coachFeedback:
                totalHours < 6
                  ? `Registraste un descanso de ${data.hours}h. El déficit de sueño eleva el cortisol matutino y desacelera la síntesis proteica miofibrilar. Se incrementó la fatiga estimada muscular en +15% para prevenir lesiones.`
                  : `Excelente descanso de ${data.hours}h ${data.minutes}m. La fase de sueño profundo (SWS) optimizó la secreción de hGH para la reparación de microlesiones musculares.`,
            };

            setUserTimelineItems((prev) => [newSleepItem, ...prev]);
            setActiveModal("none");
            toast.success("🌙 Descanso nocturno registrado en tu diario");
          }}
        />
      )}

      {/* Registrar Actividad Modal */}
      {activeModal === "registrar-actividad" && (
        <ActivityLogModal 
          onClose={() => setActiveModal("none")} 
          onSave={(activityName, duration, intensity, metPoints) => {
            const dayLabels = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
            const todayLabel = dayLabels[new Date().getDay()];
            
            // 1. Update activityData points
            setActivityData(prev => prev.map(item => 
              item.day === todayLabel ? { ...item, puntos: item.puntos + metPoints } : item
            ));

            // 2. Append timeline log
            const newAct = {
              id: `custom-act-${Date.now()}`,
              date: new Date().toISOString().split("T")[0],
              time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
              title: `${activityName} (${duration} min)`,
              subtitle: "Registro de Actividad",
              type: "activity",
              img: null,
              kcal: 0,
              tag: `${metPoints} Pts MET`,
              coachFeedback: `Registraste ${duration} min de ${activityName} (intensidad ${intensity === "low" ? "Baja" : intensity === "med" ? "Media" : "Alta"}). Sumaste ${metPoints} puntos MET a tu curva de actividad diaria. ¡Gran trabajo!`
            };
            setUserTimelineItems(prev => [newAct, ...prev]);
          }}
          activities={MET_ACTIVITIES}
        />
      )}

      {/* Modal Editar Registro de Timeline */}
      {editingTimelineItem && (
        <EditTimelineItemModal
          item={editingTimelineItem}
          onClose={() => setEditingTimelineItem(null)}
          onSave={handleSaveEditedTimelineItem}
        />
      )}
    </div>
  );
}

// Subcomponent: Edit Timeline Item Modal
function EditTimelineItemModal({
  item,
  onClose,
  onSave,
}: {
  item: any;
  onClose: () => void;
  onSave: (updated: any) => void;
}) {
  const [title, setTitle] = useState(item.title || "");
  const [subtitle, setSubtitle] = useState(item.subtitle || "");
  const [kcal, setKcal] = useState(item.kcal || 0);
  const [coachFeedback, setCoachFeedback] = useState(item.coachFeedback || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...item,
      title,
      subtitle,
      kcal: Number(kcal),
      coachFeedback,
    });
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-6 bg-card border border-border rounded-3xl">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-bold text-foreground">Editar Registro del Diario</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Modifica la información de tu tarjeta registrada en la línea de tiempo.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Título</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Categoría / Momento</label>
              <input
                type="text"
                required
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="flex w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground font-semibold"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Calorías (kcal)</label>
              <input
                type="number"
                min="0"
                value={kcal}
                onChange={(e) => setKcal(Number(e.target.value))}
                className="flex w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground font-semibold"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Nota / AI Feedback</label>
            <textarea
              rows={3}
              value={coachFeedback}
              onChange={(e) => setCoachFeedback(e.target.value)}
              placeholder="Agrega una nota o sugerencia nutricional..."
              className="flex w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground font-medium"
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl text-xs font-bold">
              Cancelar
            </Button>
            <Button type="submit" className="rounded-xl text-xs font-bold bg-foreground text-background hover:opacity-90">
              Guardar Cambios
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface HydrationLogModalProps {
  onClose: () => void;
  currentLevel: number;
  onSave: (level: number) => void;
}

function HydrationLogModal({ onClose, currentLevel, onSave }: HydrationLogModalProps) {
  const [localLevel, setLocalLevel] = useState(currentLevel);

  const colors = [
    { level: 1, color: "#fbfce1" },
    { level: 2, color: "#f9f9cd" },
    { level: 3, color: "#f6f2a9" },
    { level: 4, color: "#f2e285" },
    { level: 5, color: "#eec863" },
    { level: 6, color: "#e8a33a" },
    { level: 7, color: "#d4812f" },
    { level: 8, color: "#a66a2e" }
  ];

  const getHydrationAdvice = (level: number) => {
    if (level <= 2) {
      return `Nivel ${level} indica hidratación óptima. ¡Excelente trabajo manteniendo tu cuerpo equilibrado!`;
    } else if (level <= 4) {
      return `Nivel ${level} indica hidratación normal tirando a levemente baja. Bebe un vaso de agua (250ml) ahora para mantener el estado óptimo.`;
    } else if (level <= 6) {
      return `Nivel ${level} indica deshidratación leve. Toma 500ml de agua ahora mismo para compensar el entrenamiento de la mañana.`;
    } else {
      return `¡Atención! Nivel ${level} indica deshidratación severa. Consume de 750ml a 1L de agua, preferiblemente con electrolitos, y modera el esfuerzo físico.`;
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[80] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-card border border-border rounded-[2rem] shadow-2xl flex flex-col overflow-hidden max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 pt-8 pb-4 flex justify-between items-start bg-card">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground text-left block">Control de Rutina</span>
            <h3 className="text-xl font-black text-foreground text-left">Registro de Hidratación</h3>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-border transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-6 overflow-y-auto">
          {/* Display Level */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground">Escala de Armstrong</span>
              <TooltipProvider>
                <ShadcnTooltip>
                  <TooltipTrigger asChild>
                    <button 
                      type="button"
                      className="p-1 rounded-full hover:bg-secondary/40 text-muted-foreground hover:text-foreground transition-colors shrink-0 flex items-center justify-center cursor-pointer border-0 bg-transparent"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="start" className="max-w-xs sm:max-w-sm p-4 bg-card border border-border shadow-2xl rounded-2xl text-xs space-y-3 text-left">
                    <div className="flex items-center gap-2 font-bold text-foreground border-b border-border/50 pb-2">
                      <Droplet className="w-4 h-4 text-blue-500 fill-blue-500" />
                      <span>Evaluación de Hidratación (Armstrong)</span>
                    </div>
                    
                    <div className="space-y-2 text-[11px] leading-relaxed text-muted-foreground">
                      <p>
                        <strong className="text-foreground">Estándar Clínico (Ucol):</strong> Desarrollado por el Dr. Lawrence Armstrong (UCONN) para medir la osmolalidad urinaria sin requerir laboratorios.
                      </p>
                      <p>
                        <strong className="text-foreground">Rango Objetivo:</strong> Mantenerse en Niveles 1, 2 y 3. Perder un 2% de agua corporal reduce la fuerza y resistencia hasta un 15%.
                      </p>
                    </div>

                    <div className="pt-2 border-t border-border/60 text-[10px]">
                      <Link 
                        to="/blog/$slug"
                        params={{ slug: "escala-de-armstrong-y-fisiologia-de-la-hidratacion" }}
                        className="text-emerald-500 font-bold hover:underline flex items-center justify-between gap-1 group"
                      >
                        <span>🛡️ Leer artículo completo sobre la Escala de Armstrong y la Hidratación</span>
                        <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </Link>
                    </div>
                  </TooltipContent>
                </ShadcnTooltip>
              </TooltipProvider>
            </div>
            <Badge variant="secondary" className="px-3 py-1 text-xs font-black uppercase bg-secondary text-foreground">
              Armstrong {localLevel}
            </Badge>
          </div>

          {/* Color Scale */}
          <div className="space-y-2">
            <div className="flex justify-between gap-1.5 h-12 w-full rounded-2xl overflow-hidden bg-secondary/15 p-1 border border-border/40 relative">
              {colors.map(h => {
                const isActive = localLevel === h.level;
                return (
                  <button
                    key={h.level}
                    type="button"
                    onClick={() => setLocalLevel(h.level)}
                    className={`flex-1 h-full rounded-lg transition-all relative ${
                      isActive 
                        ? "border-2 border-foreground z-10 scale-105 shadow-md" 
                        : "hover:opacity-90"
                    }`}
                    style={{ backgroundColor: h.color }}
                  >
                    {isActive && (
                      <div className="absolute -bottom-[8px] left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground rotate-45 transform origin-center border-r border-b border-background z-20" />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between text-[9px] uppercase font-black text-muted-foreground/80 tracking-widest px-1">
              <span>Óptimo</span>
              <span>Deshidratado</span>
            </div>
          </div>

          {/* Coach / AI Feedback dynamic banner */}
          <div className="p-4 bg-secondary/35 border border-border/40 rounded-2xl flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground font-semibold leading-relaxed text-left">
              {getHydrationAdvice(localLevel)}
            </p>
          </div>

          {/* Symptoms of Dehydration grid */}
          <div className="space-y-2.5">
            <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest block text-left">
              Síntomas de Deshidratación a vigilar
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-secondary/20 border border-border/20">
                <Droplet className="w-4.5 h-4.5 text-blue-400 shrink-0" />
                <div className="min-w-0 text-left">
                  <p className="text-xs font-bold text-foreground leading-tight">Boca Seca</p>
                  <p className="text-[10px] text-muted-foreground leading-none">Falta de saliva</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-secondary/20 border border-border/20">
                <Coffee className="w-4.5 h-4.5 text-amber-500 shrink-0" />
                <div className="min-w-0 text-left">
                  <p className="text-xs font-bold text-foreground leading-tight">Fatiga</p>
                  <p className="text-[10px] text-muted-foreground leading-none">Cansancio general</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-secondary/20 border border-border/20">
                <Brain className="w-4.5 h-4.5 text-purple-400 shrink-0" />
                <div className="min-w-0 text-left">
                  <p className="text-xs font-bold text-foreground leading-tight">Cefalea</p>
                  <p className="text-[10px] text-muted-foreground leading-none">Dolor de cabeza</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-secondary/20 border border-border/20">
                <AlertCircle className="w-4.5 h-4.5 text-rose-400 shrink-0" />
                <div className="min-w-0 text-left">
                  <p className="text-xs font-bold text-foreground leading-tight">Mareos</p>
                  <p className="text-[10px] text-muted-foreground leading-none">Pérdida de balance</p>
                </div>
              </div>
            </div>
          </div>

          {/* Explanation disclaimer footnote */}
          <div className="text-[10px] text-muted-foreground leading-relaxed flex items-start gap-2 bg-secondary/10 p-3 rounded-2xl border border-border/10">
            <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-left">
              <span className="font-bold text-foreground">Aviso sobre coloración:</span> Ciertos suplementos (como el complejo de vitamina B) y alimentos (como la remolacha) pueden intensificar temporalmente el color de la orina, sin representar deshidratación real.
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-6 border-t border-border flex justify-end gap-2 bg-card">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="rounded-xl px-4 py-2 font-bold text-xs uppercase tracking-wider text-foreground hover:bg-secondary"
          >
            Cancelar
          </Button>
          <Button 
            onClick={() => {
              onSave(localLevel);
              onClose();
            }} 
            className="rounded-xl px-5 py-2 font-bold text-xs uppercase tracking-wider bg-foreground text-background hover:opacity-90"
          >
            Guardar Registro
          </Button>
        </div>
      </div>
    </div>
  );
}

interface ActivityLogModalProps {
  onClose: () => void;
  onSave: (activityName: string, duration: number, intensity: "low" | "med" | "high", metPoints: number) => void;
  activities: { name: string; low: number; med: number; high: number }[];
}

function ActivityLogModal({ onClose, onSave, activities }: ActivityLogModalProps) {
  const [activeTab, setActiveTab] = useState<"manual" | "timer">("manual");
  const [selectedActivity, setSelectedActivity] = useState(activities[7]?.name || activities[0]?.name || "Caminata");
  const [intensity, setIntensity] = useState<"low" | "med" | "high">("med");
  const [duration, setDuration] = useState(30);

  // Timer states
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerIsRunning, setTimerIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerIsRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerIsRunning]);

  const currentActivityObj = activities.find(a => a.name === selectedActivity) || activities[0];
  const metValue = currentActivityObj ? currentActivityObj[intensity] : 3.0;

  // Real-time calculation of points
  const calculatedPointsManual = Math.round(metValue * duration);
  const calculatedPointsTimer = Math.round(metValue * (timerSeconds / 60));

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSave = () => {
    if (activeTab === "manual") {
      onSave(selectedActivity, duration, intensity, calculatedPointsManual);
    } else {
      // Use elapsed minutes (min 1 minute if timer ran at least a bit)
      const elapsedMinutes = Math.max(1, Math.round(timerSeconds / 60));
      onSave(selectedActivity, elapsedMinutes, intensity, calculatedPointsTimer);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[80] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-card border border-border rounded-[2rem] shadow-2xl flex flex-col overflow-hidden max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 pt-8 pb-4 flex justify-between items-start bg-card">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground block text-left">Google Fit Sync</span>
            <h3 className="text-xl font-black text-foreground text-left">Registrar Actividad</h3>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-border transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selectors */}
        <div className="px-6">
          <div className="grid grid-cols-2 p-1 bg-secondary/30 rounded-xl border border-border/40">
            <button
              onClick={() => setActiveTab("manual")}
              className={`py-2 text-xs font-black uppercase rounded-lg transition-all ${
                activeTab === "manual" 
                  ? "bg-card text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Manual
            </button>
            <button
              onClick={() => setActiveTab("timer")}
              className={`py-2 text-xs font-black uppercase rounded-lg transition-all ${
                activeTab === "timer" 
                  ? "bg-card text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Cronómetro
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-6 py-5 space-y-5 overflow-y-auto flex-1">
          {/* Select Activity */}
          <div className="space-y-1.5 text-left">
            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
              Actividad
            </label>
            <select
              value={selectedActivity}
              onChange={(e) => setSelectedActivity(e.target.value)}
              className="w-full h-11 px-3 rounded-xl border border-border bg-background text-sm font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            >
              {activities.map(act => (
                <option key={act.name} value={act.name}>
                  {act.name}
                </option>
              ))}
            </select>
          </div>

          {/* Select Intensity */}
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest block">
              Intensidad del Esfuerzo
            </label>
            <div className="space-y-2">
              {[
                { 
                  id: "low", 
                  label: "Baja", 
                  desc: "Respiración normal que permite conversar o cantar.", 
                  border: "border-emerald-500/20 dark:border-emerald-500/10",
                  bg: "bg-emerald-500/5", 
                  activeBorder: "border-emerald-500 ring-1 ring-emerald-500" 
                },
                { 
                  id: "med", 
                  label: "Media", 
                  desc: "Respiración agitada que permite conversar brevemente, pero no cantar.", 
                  border: "border-amber-500/20 dark:border-amber-500/10",
                  bg: "bg-amber-500/5", 
                  activeBorder: "border-amber-500 ring-1 ring-amber-500" 
                },
                { 
                  id: "high", 
                  label: "Alta", 
                  desc: "Respiración muy agitada que solo permite hablar con oraciones breves.", 
                  border: "border-rose-500/20 dark:border-rose-500/10",
                  bg: "bg-rose-500/5", 
                  activeBorder: "border-rose-500 ring-1 ring-rose-500" 
                }
              ].map(opt => {
                const isActive = intensity === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setIntensity(opt.id as any)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all ${opt.border} ${
                      isActive ? `${opt.activeBorder} ${opt.bg}` : "bg-card hover:bg-secondary/15"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-xs font-bold text-foreground">{opt.label}</span>
                      <span className="text-[10px] font-extrabold text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-md">
                        {currentActivityObj ? currentActivityObj[opt.id as "low"|"med"|"high"] : 3.0} MET
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">{opt.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TAB 1: MANUAL ENTRY */}
          {activeTab === "manual" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
              {/* Duration Slider */}
              <div className="space-y-1.5 text-left">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                    Duración (minutos)
                  </label>
                  <span className="text-xs font-extrabold text-foreground bg-secondary/50 px-2.5 py-0.5 rounded-md">
                    {duration} min
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="180"
                  step="5"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-secondary rounded-lg cursor-pointer accent-foreground"
                />
              </div>

              {/* Dynamic MET points preview */}
              <div className="p-4 bg-secondary/35 border border-border/40 rounded-[1.5rem] flex items-center justify-between gap-4">
                <div className="space-y-0.5 text-left">
                  <span className="text-[9px] uppercase font-black text-muted-foreground tracking-wider block">Puntos Acumulados</span>
                  <div className="text-lg font-black text-foreground flex items-center gap-1">
                    <Activity className="w-4 h-4 text-orange-500" />
                    {calculatedPointsManual} <span className="text-xs font-bold text-muted-foreground">Pts MET</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase font-black text-muted-foreground tracking-wider block">Valor MET</span>
                  <span className="text-sm font-extrabold text-foreground">{metValue} METs</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TIMER STOPWATCH */}
          {activeTab === "timer" && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-200 flex flex-col items-center">
              {/* Large Digital Timer */}
              <div className="w-full py-6 bg-secondary/15 rounded-3xl border border-border/40 flex flex-col items-center justify-center relative overflow-hidden">
                {timerIsRunning && (
                  <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                )}
                <span className="text-4xl font-mono font-black text-foreground tracking-tight">
                  {formatTimer(timerSeconds)}
                </span>
                <span className="text-[9px] uppercase font-black tracking-widest text-muted-foreground mt-1">
                  Tiempo Transcurrido
                </span>
              </div>

              {/* Timer Controls */}
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setTimerIsRunning(!timerIsRunning)}
                  className={`px-5 py-2 font-bold text-xs uppercase tracking-wider rounded-xl ${
                    timerIsRunning 
                      ? "bg-amber-500 text-amber-foreground hover:bg-amber-500/90" 
                      : "bg-foreground text-background hover:opacity-90"
                  }`}
                >
                  {timerIsRunning ? "Pausar" : timerSeconds > 0 ? "Reanudar" : "Iniciar"}
                </Button>
                
                {timerSeconds > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setTimerIsRunning(false);
                      setTimerSeconds(0);
                    }}
                    className="px-4 py-2 font-bold text-xs uppercase tracking-wider rounded-xl border-border text-foreground hover:bg-secondary"
                  >
                    Reiniciar
                  </Button>
                )}
              </div>

              {/* Dynamic live counter of MET points */}
              <div className="w-full p-4 bg-secondary/35 border border-border/40 rounded-[1.5rem] flex items-center justify-between gap-4">
                <div className="space-y-0.5 text-left">
                  <span className="text-[9px] uppercase font-black text-muted-foreground tracking-wider block">Puntos en Tiempo Real</span>
                  <div className="text-lg font-black text-foreground flex items-center gap-1">
                    <Activity className="w-4 h-4 text-orange-500 animate-pulse" />
                    {calculatedPointsTimer} <span className="text-xs font-bold text-muted-foreground">Pts MET</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase font-black text-muted-foreground tracking-wider block">Ritmo MET</span>
                  <span className="text-xs font-extrabold text-foreground">{metValue} Pts / min</span>
                </div>
              </div>
            </div>
          )}

          {/* AI Advice/Explanation footnote */}
          <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex items-start gap-2.5 text-left">
            <Sparkles className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
            <p className="text-[10px] text-muted-foreground leading-relaxed font-semibold">
              <span className="text-foreground">¿Qué son los Puntos MET?</span> El Equivalente Metabólico (MET) mide la intensidad de tu ejercicio. La OMS recomienda sumar al menos <span className="text-foreground">150 Puntos de Actividad</span> diarios para mantener un estilo de vida saludable y conservar tu racha.
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-6 border-t border-border flex justify-end gap-2 bg-card">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="rounded-xl px-4 py-2 font-bold text-xs uppercase tracking-wider text-foreground hover:bg-secondary"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={activeTab === "timer" && timerSeconds === 0}
            className="rounded-xl px-5 py-2 font-bold text-xs uppercase tracking-wider bg-foreground text-background hover:opacity-90 disabled:opacity-50"
          >
            Guardar Registro
          </Button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// RECIPE IA FEATURES (Tinder Swipe & Grid)
// ==========================================

interface RecipeSwipeStackProps {
  onClose?: () => void;
  savedRecipes: string[];
  setSavedRecipes: React.Dispatch<React.SetStateAction<string[]>>;
  currentSwipeIndex: number;
  setCurrentSwipeIndex: React.Dispatch<React.SetStateAction<number>>;
  onSaveRecipeTimeline?: (recipe: any) => void;
}

function RecipeSwipeStack({
  onClose,
  savedRecipes,
  setSavedRecipes,
  currentSwipeIndex,
  setCurrentSwipeIndex,
  onSaveRecipeTimeline,
}: RecipeSwipeStackProps) {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [swipeDir, setSwipeDir] = useState<"left" | "right" | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const hasCards = currentSwipeIndex < RECIPES_POOL.length;
  const currentRecipe = hasCards ? RECIPES_POOL[currentSwipeIndex] : null;
  const nextRecipe = currentSwipeIndex + 1 < RECIPES_POOL.length ? RECIPES_POOL[currentSwipeIndex + 1] : null;

  const handleSwipe = (direction: "left" | "right") => {
    if (swipeDir) return;
    setSwipeDir(direction);
    setShowInfo(false);
    setTimeout(() => {
      if (direction === "right" && currentRecipe) {
        if (!savedRecipes.includes(currentRecipe.id)) {
          setSavedRecipes(prev => [...prev, currentRecipe.id]);
        }
        if (onSaveRecipeTimeline) {
          onSaveRecipeTimeline(currentRecipe);
        }
      }
      setCurrentSwipeIndex(prev => prev + 1);
      setSwipeDir(null);
      setDragOffset({ x: 0, y: 0 });
    }, 300);
  };

  const handleDragStart = (clientX: number, clientY: number) => {
    if (!hasCards || swipeDir) return;
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const dx = clientX - dragStart.x;
    const dy = clientY - dragStart.y;
    setDragOffset({ x: dx, y: dy * 0.2 });
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset.x > 120) {
      handleSwipe("right");
    } else if (dragOffset.x < -120) {
      handleSwipe("left");
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  return (
    <Card className="w-full bg-card border border-border shadow-none rounded-[2rem] p-5 overflow-hidden animate-in slide-in-from-top-4 duration-300 flex flex-col text-left hover:-translate-y-1.5 hover:shadow-xl hover:shadow-foreground/5 hover:border-border/80 transition-all">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-foreground border border-border/40 shrink-0">
            <Sparkles className="w-4 h-4 text-foreground" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-foreground leading-tight">Explorar Recetas IA</h3>
            <p className="text-[10px] text-muted-foreground font-semibold">Desliza para guardar o pasar</p>
          </div>
        </div>

        {onClose && (
          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-secondary/80 hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer border-0"
            title="Cerrar exploration"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="w-full">
        {hasCards && currentRecipe ? (
          <div className="flex flex-col items-center gap-4">
            {/* Card Stack Area */}
            <div className="relative w-full h-[270px] select-none touch-none">
              {/* Background Card */}
              {nextRecipe && (
                <div 
                  className="absolute inset-0 rounded-2xl border border-border bg-card overflow-hidden shadow-sm scale-95 translate-y-2 opacity-60 transition-all duration-300 pointer-events-none"
                  style={{ zIndex: 10 }}
                >
                  <img 
                    src={nextRecipe.img} 
                    alt={nextRecipe.title} 
                    className="w-full h-full object-cover grayscale-[20%]" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-left">
                    <h4 className="text-xs font-bold text-white leading-tight line-clamp-1">{nextRecipe.title}</h4>
                  </div>
                </div>
              )}

              {/* Top Card */}
              <div
                className="absolute inset-0 rounded-2xl border border-border bg-card overflow-hidden shadow-md select-none cursor-grab active:cursor-grabbing"
                style={{
                  zIndex: 20,
                  transform: swipeDir 
                    ? `translate3d(${swipeDir === "right" ? 400 : -400}px, ${dragOffset.y}px, 0) rotate(${swipeDir === "right" ? 10 : -10}deg)`
                    : `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotate(${dragOffset.x * 0.05}deg)`,
                  transition: isDragging ? "none" : "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  touchAction: "none"
                }}
                onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
                onMouseMove={(e) => handleDragMove(e.clientX, e.clientY)}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchStart={(e) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY)}
                onTouchMove={(e) => handleDragMove(e.touches[0].clientX, e.touches[0].clientY)}
                onTouchEnd={handleDragEnd}
              >
                <img 
                  src={currentRecipe.img} 
                  alt={currentRecipe.title} 
                  className="w-full h-full object-cover pointer-events-none" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10 pointer-events-none" />

                {/* Status Badges */}
                {dragOffset.x > 40 && (
                  <div className="absolute top-4 left-4 border border-foreground text-white font-black text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md pointer-events-none">
                    GUARDAR ❤️
                  </div>
                )}
                {dragOffset.x < -40 && (
                  <div className="absolute top-4 right-4 border border-rose-500 text-rose-400 font-black text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md pointer-events-none">
                    PASAR ❌
                  </div>
                )}

                {/* Card Contents */}
                <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none">
                  <div className="flex justify-between items-start gap-1 flex-wrap">
                    <span className="backdrop-blur-md bg-black/50 text-white text-[9px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-xs">
                      {currentRecipe.category}
                    </span>
                    <span className="backdrop-blur-md bg-black/50 text-white/90 text-[9px] font-bold px-2.5 py-1 rounded-full shrink-0">
                      {currentRecipe.prepTime}
                    </span>
                  </div>

                  <div className="text-left space-y-2 pointer-events-auto">
                    <h4 className="text-sm font-extrabold text-white leading-tight drop-shadow-sm line-clamp-2">
                      {currentRecipe.title}
                    </h4>
                    
                    <div className="flex flex-wrap gap-1.5 text-white/90 text-[9px] font-semibold">
                      {(currentRecipe.tags || [currentRecipe.tag]).map((t: string, idx: number) => (
                        <span key={idx} className="backdrop-blur-md bg-white/15 text-white px-2.5 py-0.5 rounded-full shadow-xs">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Info Overlay */}
                {showInfo && (
                  <div className="absolute inset-0 bg-card/95 backdrop-blur-md p-4 flex flex-col justify-between overflow-y-auto animate-in fade-in duration-200" style={{ zIndex: 30 }}>
                    <div className="text-left space-y-3">
                      <div className="flex justify-between items-center border-b border-border pb-1.5">
                        <h4 className="font-extrabold text-foreground text-xs uppercase tracking-wider">Ingredientes</h4>
                        <button 
                          onClick={() => setShowInfo(false)}
                          className="text-[10px] text-muted-foreground hover:text-foreground font-bold border-0 bg-transparent cursor-pointer"
                        >
                          Cerrar
                        </button>
                      </div>
                      <ul className="space-y-1.5">
                        {currentRecipe.ingredients.slice(0, 5).map((ing: string, i: number) => (
                          <li key={i} className="text-[10px] font-semibold text-muted-foreground flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-foreground mt-1.5 shrink-0" />
                            <span className="line-clamp-1">{ing}</span>
                          </li>
                        ))}
                        {currentRecipe.ingredients.length > 5 && (
                          <li className="text-[9px] text-muted-foreground/70 italic font-bold">
                            + {currentRecipe.ingredients.length - 5} ingredientes más
                          </li>
                        )}
                      </ul>
                    </div>
                    <Button 
                      onClick={() => setShowInfo(false)}
                      variant="outline" 
                      className="w-full text-[10px] h-8 font-bold rounded-xl mt-2"
                    >
                      Volver
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 items-center justify-center pt-1">
              <button 
                onClick={() => handleSwipe("left")}
                className="w-10 h-10 rounded-full bg-secondary/80 hover:bg-secondary active:scale-95 text-muted-foreground hover:text-rose-500 border border-border flex items-center justify-center shadow-xs transition-all cursor-pointer"
                title="Pasar"
              >
                <X className="w-4 h-4 stroke-[3]" />
              </button>
              
              <button 
                onClick={() => setShowInfo(!showInfo)}
                className={`w-9 h-9 rounded-full border flex items-center justify-center shadow-xs transition-all cursor-pointer ${
                  showInfo 
                    ? "bg-foreground text-background border-foreground" 
                    : "bg-secondary/40 hover:bg-secondary text-muted-foreground border-border"
                }`}
                title="Ver info"
              >
                <Info className="w-4 h-4" />
              </button>

              <button 
                onClick={() => handleSwipe("right")}
                className="w-10 h-10 rounded-full bg-foreground text-background hover:opacity-90 active:scale-95 border border-foreground flex items-center justify-center shadow-xs transition-all cursor-pointer"
                title="Guardar receta"
              >
                <Heart className="w-4 h-4 fill-current" />
              </button>
            </div>

            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Receta {currentSwipeIndex + 1} de {RECIPES_POOL.length}
            </div>
          </div>
        ) : (
          <div className="p-6 flex flex-col items-center justify-center gap-3 text-center animate-in fade-in duration-300">
            <div className="w-10 h-10 rounded-full bg-secondary/60 flex items-center justify-center text-foreground mb-1">
              <Check className="w-5 h-5 stroke-[3]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground">¡Todo explorado!</h4>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                Revisa tus platos guardados en <strong>Mis recetas</strong> o inicia una nueva ronda.
              </p>
            </div>
            <div className="w-full mt-1">
              <Button 
                onClick={() => setCurrentSwipeIndex(0)} 
                className="w-full text-[10px] h-8 font-bold rounded-xl bg-foreground text-background"
              >
                Reiniciar exploración
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

// Recipes Grid Tab Component
interface RecipesGridTabProps {
  savedRecipes: string[];
  setSavedRecipes: React.Dispatch<React.SetStateAction<string[]>>;
  cartRecipeIds: string[];
  onToggleCart: (recipeId: string) => void;
  onOpenCart: () => void;
  onExploreClick: () => void;
  onOpenDetail: (recipe: any) => void;
}

function RecipesGridTab({
  savedRecipes,
  setSavedRecipes,
  cartRecipeIds,
  onToggleCart,
  onOpenCart,
  onExploreClick,
  onOpenDetail,
}: RecipesGridTabProps) {
  const [filterText, setFilterText] = useState("");
  const [selectedChips, setSelectedChips] = useState<string[]>([]);

  const choiceChips = [
    "Desayuno", "Almuerzo", "Cena", "Snack",
    "Alto en Proteína", "Alto en Fibra", "Bajo en Hidratos",
    "Sin Gluten", "Vegan", "Grasas Saludables", "Sin Lactosa"
  ];

  const list = RECIPES_POOL.filter(r => savedRecipes.includes(r.id));

  const recipeMatchesChip = (r: any, chipId: string): boolean => {
    const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const target = norm(chipId);
    if (norm(r.category || "") === target) return true;
    const allTags = [...(r.tags || []), r.tag].filter(Boolean);
    return allTags.some(t => {
      const nTag = norm(t);
      if (nTag === target) return true;
      if (target.includes("proteina") && (nTag.includes("proteina") || nTag.includes("protein"))) return true;
      if (target.includes("fibra") && nTag.includes("fibra")) return true;
      if (target.includes("hidrato") && (nTag.includes("hidrato") || nTag.includes("carbohidrat"))) return true;
      if (target.includes("gluten") && nTag.includes("gluten")) return true;
      if (target.includes("vegan") && (nTag.includes("vegan") || nTag.includes("vegetar"))) return true;
      if (target.includes("grasa") && nTag.includes("grasa")) return true;
      if (target.includes("lactosa") && nTag.includes("lactosa")) return true;
      return false;
    });
  };

  const toggleChip = (chipId: string) => {
    if (chipId === "Todas") {
      setSelectedChips([]);
      return;
    }
    setSelectedChips(prev => 
      prev.includes(chipId)
        ? prev.filter(c => c !== chipId)
        : [...prev, chipId]
    );
  };

  const filteredList = list.filter(r => {
    const matchesText = r.title.toLowerCase().includes(filterText.toLowerCase()) || 
                        r.coachFeedback.toLowerCase().includes(filterText.toLowerCase());
    const matchesChips = selectedChips.length === 0 || selectedChips.every(chip => recipeMatchesChip(r, chip));
    return matchesText && matchesChips;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300 text-left px-6 py-6 pb-24 max-w-6xl mx-auto">
      <div className="flex flex-col gap-4">
        {/* Title & Cart Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-[22px] font-black text-foreground leading-tight tracking-tight">Mis Recetas Guardadas</h2>
            <p className="text-xs text-muted-foreground mt-1 font-medium">
              Platos recomendados por tu Coach IA que has guardado durante la exploración.
            </p>
          </div>

          <Button
            onClick={onOpenCart}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl px-4 py-2.5 flex items-center gap-2 transition-all shadow-md shrink-0 cursor-pointer self-start sm:self-auto"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Lista de Compras</span>
            <span className="bg-white/20 text-white text-[10px] font-black px-2 py-0.5 rounded-full ml-0.5">
              {cartRecipeIds.length}
            </span>
          </Button>
        </div>

        {/* Search & Multi-Select Choice Chips */}
        {list.length > 0 && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar recetas por nombre o ingrediente..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="w-full bg-secondary/35 border border-border rounded-xl pl-10 pr-4 py-3 text-xs font-semibold focus:outline-none focus:border-foreground/30 transition-colors"
              />
            </div>
            
            {/* Multi-Select Choice Chips */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                  Filtros de Comida {selectedChips.length > 0 && `(${selectedChips.length} activos)`}
                </span>
                {selectedChips.length > 0 && (
                  <button
                    onClick={() => setSelectedChips([])}
                    className="text-[11px] font-bold text-rose-500 hover:underline cursor-pointer"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {choiceChips.map(chip => {
                  const isSelected = selectedChips.includes(chip);
                  return (
                    <button
                      key={chip}
                      onClick={() => toggleChip(chip)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer select-none flex items-center gap-1.5 ${
                        isSelected
                          ? "border-foreground bg-foreground text-background shadow-xs font-bold"
                          : "border-border/80 bg-secondary/30 text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-background" />}
                      <span>{chip}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {list.length === 0 ? (
        <div className="border border-dashed border-border rounded-[2rem] p-10 flex flex-col items-center justify-center text-center gap-4 bg-card/40 min-h-[300px]">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <Heart className="w-7 h-7 fill-emerald-500/20" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">Aún no tienes recetas guardadas</h4>
            <p className="text-xs text-muted-foreground mt-1.5 max-w-xs mx-auto leading-relaxed font-medium">
              Descubre platos saludables recomendados por tu Coach IA en la herramienta "Explorar ideas".
            </p>
          </div>
          <Button 
            onClick={onExploreClick}
            className="rounded-xl text-xs font-bold bg-foreground text-background px-5 py-2.5 hover:opacity-90 mt-2 transition-opacity"
          >
            Explorar ideas ahora
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredList.map(recipe => {
            const isInCart = cartRecipeIds.includes(recipe.id);
            return (
              <Card 
                key={recipe.id}
                onClick={() => onOpenDetail(recipe)}
                className="group rounded-2xl overflow-hidden transition-all duration-300 border border-border/80 bg-card hover:border-foreground/20 hover:shadow-md flex flex-col h-full cursor-pointer select-none"
              >
                {/* Image Banner */}
                <div className="relative h-44 w-full overflow-hidden shrink-0 bg-secondary/30">
                  <img 
                    src={recipe.img} 
                    alt={recipe.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  
                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                    {recipe.category}
                  </span>

                  {/* Cart Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleCart(recipe.id);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
                      isInCart 
                        ? "bg-foreground text-background border-foreground shadow-md scale-105"
                        : "bg-black/50 hover:bg-black/70 text-white/80 hover:text-white border-white/20"
                    }`}
                    title={isInCart ? "Quitar de lista de compras" : "Añadir a lista de compras"}
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                  </button>

                  {/* Prep Time & Quick Info Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[10px] font-bold">
                    <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full">
                      {recipe.prepTime}
                    </span>
                    <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full">
                      350 kcal
                    </span>
                  </div>
                </div>

                {/* Header */}
                <CardHeader className="p-4 pb-2 text-left">
                  <CardDescription className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
                    Receta IA • {recipe.category}
                  </CardDescription>
                  <CardTitle className="text-sm font-extrabold leading-snug text-foreground group-hover:text-emerald-500 transition-colors line-clamp-2">
                    {recipe.title}
                  </CardTitle>
                </CardHeader>

                {/* Content */}
                <CardContent className="px-4 pb-4 pt-1 flex-1 flex flex-col justify-end text-left">
                  <div className="pt-2 border-t border-border/40 space-y-2">
                    <MealOrganizerBadges
                      category={recipe.category}
                      tags={recipe.tags || (recipe.tag ? [recipe.tag] : [])}
                    />
                  </div>
                </CardContent>

                {/* Footer */}
                <CardFooter className="px-4 py-3 bg-secondary/20 border-t border-border flex items-center justify-between shrink-0">
                  <span className="text-[11px] font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                    Ver preparación
                  </span>
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Recipe Detail Modal Component
interface RecipeDetailModalProps {
  recipe: any;
  onClose: () => void;
  onLog: (recipe: any) => void;
  onRemove: (recipeId: string) => void;
  isInCart: boolean;
  onToggleCart: (recipeId: string) => void;
}

function RecipeDetailModal({
  recipe,
  onClose,
  onLog,
  onRemove,
  isInCart,
  onToggleCart,
}: RecipeDetailModalProps) {
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});

  const toggleIngredient = (idx: number) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-background/95 backdrop-blur-2xl animate-in fade-in duration-250">
      <div className="w-full max-w-lg bg-card border border-border rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden max-h-[85vh] animate-in zoom-in-95 duration-200 text-left">
        {/* Hero image header */}
        <div className="h-56 relative overflow-hidden shrink-0">
          <img 
            src={recipe.img} 
            alt={recipe.title} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 border border-white/10 hover:bg-black/80 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-left">
            <span className="bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md inline-block mb-2">
              {recipe.category}
            </span>
            <h2 className="text-xl font-black text-white leading-tight tracking-tight drop-shadow-md">
              {recipe.title}
            </h2>
          </div>
        </div>

        {/* Scrollable contents */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-left">
          {/* Quick info row */}
          <div className="grid grid-cols-4 gap-2 text-center bg-secondary/35 rounded-2xl p-3 border border-border/50">
            <div>
              <span className="block text-[9px] uppercase font-black text-muted-foreground tracking-wider">Calorías</span>
              <span className="text-xs font-extrabold text-foreground">{recipe.kcal} kcal</span>
            </div>
            <div>
              <span className="block text-[9px] uppercase font-black text-muted-foreground tracking-wider">Proteínas</span>
              <span className="text-xs font-extrabold text-foreground">{recipe.protein}</span>
            </div>
            <div>
              <span className="block text-[9px] uppercase font-black text-muted-foreground tracking-wider">Grasas</span>
              <span className="text-xs font-extrabold text-foreground">{recipe.fat}</span>
            </div>
            <div>
              <span className="block text-[9px] uppercase font-black text-muted-foreground tracking-wider">Prep</span>
              <span className="text-xs font-extrabold text-foreground">{recipe.prepTime}</span>
            </div>
          </div>

          {/* Características Nutricionales Badges */}
          <div className="bg-secondary/20 rounded-2xl p-3.5 border border-border/60 space-y-2">
            <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              Características Nutricionales
            </h5>
            <MealOrganizerBadges
              category={recipe.category}
              tags={recipe.tags || (recipe.tag ? [recipe.tag] : [])}
            />
          </div>

          {/* Coach Advice */}
          <div className="bg-emerald-500/5 dark:bg-emerald-500/[0.02] border border-emerald-500/10 rounded-2xl p-4 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-0.5">Consejo del Coach IA</h5>
              <p className="text-[11px] font-medium text-foreground/80 leading-relaxed">
                {recipe.coachFeedback}
              </p>
            </div>
          </div>

          {/* Ingredients list */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-1.5">
              Ingredientes ({recipe.ingredients.length})
            </h4>
            <div className="space-y-2">
              {recipe.ingredients.map((ing: string, i: number) => {
                const isChecked = checkedIngredients[i] || false;
                return (
                  <div 
                    key={i} 
                    onClick={() => toggleIngredient(i)}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isChecked 
                        ? "bg-emerald-500/[0.02] border-emerald-500/20 text-muted-foreground line-through" 
                        : "bg-card border-border/70 hover:border-foreground/20 text-foreground"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                      isChecked ? "bg-emerald-500 border-emerald-500 text-white" : "border-border"
                    }`}>
                      {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    <span className="text-xs font-semibold leading-none">{ing}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-1.5">
              Preparación
            </h4>
            <ol className="space-y-3">
              {recipe.instructions.map((step: string, i: number) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-secondary text-[10px] font-black text-muted-foreground shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-xs text-foreground/90 leading-relaxed font-semibold">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-6 border-t border-border flex flex-col sm:flex-row gap-3 bg-card justify-between items-center shrink-0">
          <button
            onClick={() => onRemove(recipe.id)}
            className="text-[10px] text-rose-500 font-bold uppercase tracking-widest hover:underline p-1 border-0 bg-transparent cursor-pointer"
          >
            Quitar de mis recetas
          </button>
          
          <div className="flex gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap">
            <Button
              onClick={() => onToggleCart(recipe.id)}
              variant="outline"
              className={`rounded-xl px-3 py-2 font-bold text-xs gap-1.5 flex-1 sm:flex-initial ${
                isInCart 
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "border-border hover:bg-secondary text-foreground"
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              {isInCart ? "En Compras" : "Añadir a Compras"}
            </Button>

            <Button 
              variant="outline" 
              onClick={onClose} 
              className="rounded-xl px-3 py-2 font-bold text-xs text-foreground hover:bg-secondary flex-1 sm:flex-initial"
            >
              Cerrar
            </Button>
            
            <Button 
              onClick={() => onLog(recipe)}
              className="rounded-xl px-4 py-2 font-bold text-xs uppercase tracking-wider bg-foreground text-background hover:opacity-90 flex-1 sm:flex-initial"
            >
              Registrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Shopping Cart Modal Component
interface ShoppingCartModalProps {
  cartRecipeIds: string[];
  onClose: () => void;
  onToggleCart: (recipeId: string) => void;
  onClearCart: () => void;
}

function ShoppingCartModal({
  cartRecipeIds,
  onClose,
  onToggleCart,
  onClearCart,
}: ShoppingCartModalProps) {
  const selectedRecipes = RECIPES_POOL.filter(r => cartRecipeIds.includes(r.id));
  
  // Combine ingredients across selected recipes
  const allIngredients = selectedRecipes.flatMap(r => r.ingredients);
  const uniqueIngredients = Array.from(new Set(allIngredients));

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  const toggleItem = (item: string) => {
    setCheckedItems(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const getFormattedList = () => {
    return `ðŸ›’ LISTA DE COMPRAS (Shakerfy)\n\n` +
      `Recetas (${selectedRecipes.length}):\n` +
      selectedRecipes.map(r => `- ${r.title}`).join('\n') +
      `\n\nIngredientes:\n` +
      uniqueIngredients.map(ing => `${checkedItems[ing] ? '✓' : 'â˜'} ${ing}`).join('\n');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getFormattedList());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const text = getFormattedList();
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Lista de Compras - Shakerfy",
          text: text,
        });
      } catch (e) {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
      }
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-background/95 backdrop-blur-2xl animate-in fade-in duration-250">
      <div className="w-full max-w-lg bg-card border border-border rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden max-h-[85vh] animate-in zoom-in-95 duration-200 text-left">
        {/* Header */}
        <div className="p-6 border-b border-border flex justify-between items-center bg-secondary/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-foreground leading-tight">Lista de Compras</h3>
              <p className="text-[11px] text-muted-foreground font-semibold">
                {selectedRecipes.length} {selectedRecipes.length === 1 ? "receta seleccionada" : "recetas seleccionadas"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer border-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {selectedRecipes.length === 0 ? (
            <div className="p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center mx-auto text-muted-foreground">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-foreground">Tu lista de compras está vacía</p>
              <p className="text-[11px] text-muted-foreground max-w-xs mx-auto leading-relaxed font-medium">
                Presiona el icono de carrito en tus recetas guardadas para generar la lista de compras automáticamente.
              </p>
            </div>
          ) : (
            <>
              {/* Selected Recipes Pills */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
                  Recetas incluidas ({selectedRecipes.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedRecipes.map(r => (
                    <div 
                      key={r.id}
                      className="bg-secondary/40 border border-border rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs font-bold text-foreground"
                    >
                      <span className="line-clamp-1 max-w-[180px]">{r.title}</span>
                      <button 
                        onClick={() => onToggleCart(r.id)}
                        className="text-muted-foreground hover:text-rose-500 cursor-pointer border-0 bg-transparent p-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Consolidated Ingredients Checklist */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
                    Ingredientes Necesarios ({uniqueIngredients.length})
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    {Object.values(checkedItems).filter(Boolean).length} / {uniqueIngredients.length} listos
                  </span>
                </div>

                <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                  {uniqueIngredients.map((ing, idx) => {
                    const isChecked = !!checkedItems[ing];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleItem(ing)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 select-none ${
                          isChecked 
                            ? "bg-emerald-500/[0.04] border-emerald-500/20 text-muted-foreground line-through" 
                            : "bg-card border-border hover:border-foreground/20 text-foreground font-semibold"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                          isChecked ? "bg-emerald-500 border-emerald-500 text-white" : "border-muted-foreground/40 bg-background"
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="text-xs">{ing}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {selectedRecipes.length > 0 && (
          <div className="p-4 border-t border-border bg-secondary/10 flex items-center justify-between gap-2 shrink-0">
            <Button
              onClick={onClearCart}
              variant="outline"
              className="text-xs font-bold text-rose-500 border-rose-500/20 hover:bg-rose-500/10 rounded-xl px-3"
            >
              Vaciar
            </Button>
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <Button
                onClick={handleShare}
                className="text-xs font-bold rounded-xl gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <Share2 className="w-3.5 h-3.5" />
                Compartir
              </Button>
              <Button
                onClick={handleCopy}
                variant="outline"
                className="text-xs font-bold rounded-xl gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "¡Copiado!" : "Copiar"}
              </Button>
              <Button
                onClick={onClose}
                className="text-xs font-bold rounded-xl bg-foreground text-background px-4"
              >
                Listo
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Subcomponent: State Log Modal (Registrar estado actual)
function StateLogModal({
  onClose,
  mood,
  setMood,
  hunger,
  setHunger,
  energy,
  setEnergy,
  onSave,
}: {
  onClose: () => void;
  mood: number;
  setMood: (val: number) => void;
  hunger: number;
  setHunger: (val: number) => void;
  energy: number;
  setEnergy: (val: number) => void;
  onSave: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-card border border-border rounded-[2rem] shadow-2xl flex flex-col overflow-hidden relative">
        <div className="px-6 pt-6 pb-4 flex justify-between items-center bg-card border-b border-border/40">
          <div>
            <span className="text-[10px] text-muted-foreground/80 font-bold uppercase tracking-wider block mb-0.5">
              Autoconocimiento & Salud
            </span>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <span>Registrar Estado Actual</span>
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-xs text-muted-foreground font-medium">Ajusta los indicadores para registrar tu nivel de calma, saciedad y energía de hoy.</p>
          
          <div className="space-y-4">
            <CustomSlider
              value={mood}
              onChange={setMood}
              labelLeft="Ansioso"
              labelRight="Calmo"
              colorClass="from-[#46e8f5]/30 via-[#46e8f5]/70 to-[#46e8f5]"
            />
            <CustomSlider
              value={hunger}
              onChange={setHunger}
              labelLeft="Hambriento"
              labelRight="Saciado"
              colorClass="from-[#8ee853]/30 via-[#8ee853]/70 to-[#8ee853]"
            />
            <CustomSlider
              value={energy}
              onChange={setEnergy}
              labelLeft="Cansado"
              labelRight="Enérgico"
              colorClass="from-[#ff7b7c]/30 via-[#ff7b7c]/70 to-[#ff7b7c]"
            />
          </div>

          <Button
            onClick={onSave}
            className="w-full rounded-xl h-12 text-sm font-bold bg-foreground text-background hover:opacity-90 transition-all shadow-md cursor-pointer mt-2"
          >
            Guardar Registro
          </Button>
        </div>
      </div>
    </div>
  );
}

// Subcomponent: Custom Slider
function CustomSlider({ value, onChange, labelLeft, labelRight, colorClass }: any) {
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
}

// Subcomponent: Sleep Log Modal (Diseño fiel a la referencia)
function SleepLogModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (data: {
    hours: number;
    minutes: number;
    bedtime: string;
    wakeTime: string;
    quality: string;
    score: number;
    factors: string[];
  }) => void;
}) {
  const [bedtime, setBedtime] = useState("23:00");
  const [wakeTime, setWakeTime] = useState("09:00");
  const [is24h, setIs24h] = useState(false);
  const [quality, setQuality] = useState("Reparador");
  const [selectedFactors, setSelectedFactors] = useState<string[]>(["Magnesio", "Habitación fresca"]);

  const calculateDuration = () => {
    try {
      const [bH, bM] = bedtime.split(":").map(Number);
      const [wH, wM] = wakeTime.split(":").map(Number);
      let bMins = bH * 60 + bM;
      let wMins = wH * 60 + wM;
      if (wMins <= bMins) wMins += 24 * 60;
      const diffMins = wMins - bMins;
      const h = Math.floor(diffMins / 60);
      const m = diffMins % 60;
      return { hours: h, minutes: m, diffMins };
    } catch (e) {
      return { hours: 10, minutes: 0, diffMins: 600 };
    }
  };

  const { hours, minutes, diffMins } = calculateDuration();

  const computeTrackPositions = () => {
    try {
      const [bH, bM] = bedtime.split(":").map(Number);
      const startMins = bH * 60 + bM;
      const startTimelineMins = 20 * 60; // 8 PM (20:00)
      let offsetMins = startMins - startTimelineMins;
      if (offsetMins < 0) offsetMins += 24 * 60;
      const leftPct = Math.max(0, Math.min(95, (offsetMins / (24 * 60)) * 100));
      const widthPct = Math.max(5, Math.min(100 - leftPct, (diffMins / (24 * 60)) * 100));
      return { leftPct, widthPct };
    } catch (e) {
      return { leftPct: 12.5, widthPct: 41.6 };
    }
  };

  const { leftPct, widthPct } = computeTrackPositions();

  const trackRef = React.useRef<HTMLDivElement>(null);
  const [activeDrag, setActiveDrag] = useState<"start" | "end" | null>(null);

  const pctToTimeStr = (pct: number) => {
    const clamped = Math.max(0, Math.min(100, pct));
    const offsetMins = (clamped / 100) * 1440;
    const snappedOffset = Math.round(offsetMins / 15) * 15;
    const actualMins = (20 * 60 + snappedOffset) % 1440;
    const h = Math.floor(actualMins / 60) % 24;
    const m = actualMins % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, handle?: "start" | "end") => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickPct = (clickX / rect.width) * 100;

    let target = handle;
    if (!target) {
      const distStart = Math.abs(clickPct - leftPct);
      const distEnd = Math.abs(clickPct - (leftPct + widthPct));
      target = distStart <= distEnd ? "start" : "end";
    }

    setActiveDrag(target);
    const newTime = pctToTimeStr(clickPct);
    if (target === "start") setBedtime(newTime);
    else setWakeTime(newTime);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!activeDrag || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const moveX = e.clientX - rect.left;
    const movePct = (moveX / rect.width) * 100;
    const newTime = pctToTimeStr(movePct);
    if (activeDrag === "start") setBedtime(newTime);
    else setWakeTime(newTime);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activeDrag) {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      setActiveDrag(null);
    }
  };

  const formatDisplayTime = (timeStr: string) => {
    if (!timeStr) return { num: "11", ampm: "PM" };
    const [h, m] = timeStr.split(":").map(Number);
    if (is24h) {
      return { num: `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`, ampm: "HRS" };
    }
    const ampm = h >= 12 ? "PM" : "AM";
    let hour12 = h % 12;
    if (hour12 === 0) hour12 = 12;
    const num = m > 0 ? `${hour12}:${m.toString().padStart(2, "0")}` : `${hour12}`;
    return { num, ampm };
  };

  const bedDisplay = formatDisplayTime(bedtime);
  const wakeDisplay = formatDisplayTime(wakeTime);

  const handleToggleFactor = (factor: string) => {
    setSelectedFactors((prev) =>
      prev.includes(factor) ? prev.filter((f) => f !== factor) : [...prev, factor]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalH = hours + minutes / 60;
    const score = Math.min(
      100,
      Math.max(
        40,
        Math.round((totalH / 8) * 90 + (quality === "Reparador" ? 10 : quality === "Levemente fragmentado" ? 0 : -15))
      )
    );
    onSave({
      hours,
      minutes,
      bedtime,
      wakeTime,
      quality,
      score,
      factors: selectedFactors,
    });
  };

  const factorOptions = [
    "Magnesio",
    "Habitación fresca",
    "Sin pantallas pre-sueño",
    "Cafeína tardía",
    "Cena abundante",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-card border border-border rounded-[2.2rem] shadow-2xl flex flex-col overflow-hidden relative max-h-[92vh] text-foreground">
        
        {/* Top Sheet Handle */}
        <div className="w-12 h-1 bg-secondary/80 rounded-full mx-auto mt-3" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-3 pb-4 border-b border-border/40">
          <div className="flex items-center gap-2">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black tracking-tight text-foreground">sleep</span>
              <span className="text-xs font-bold text-muted-foreground/80">timings</span>
            </div>
            <span className="text-muted-foreground/30 font-light">|</span>
            <span className="text-xs font-semibold text-muted-foreground">when did you sleep last night?</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">

          {/* Dual Readout Section (Sleep time | Wake time) */}
          <div className="grid grid-cols-2 gap-4 items-center relative py-1">
            {/* Left: Sleep Time */}
            <div className="text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-muted-foreground/80 text-[11px] font-bold">
                <Bed className="w-3.5 h-3.5" />
                <span>Sleep time</span>
              </div>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-black tracking-tight text-foreground">{bedDisplay.num}</span>
                <span className="text-xs font-bold uppercase text-muted-foreground">{bedDisplay.ampm}</span>
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-[1px] bg-border/60" />

            {/* Right: Wake Time */}
            <div className="text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-muted-foreground/80 text-[11px] font-bold">
                <AlarmClock className="w-3.5 h-3.5" />
                <span>Wake time</span>
              </div>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-black tracking-tight text-foreground">{wakeDisplay.num}</span>
                <span className="text-xs font-bold uppercase text-muted-foreground">{wakeDisplay.ampm}</span>
              </div>
            </div>
          </div>

          {/* Dynamic Duration Label */}
          <div className="text-center">
            <span className="text-xs font-bold text-muted-foreground/80">
              ~{hours} hours {minutes > 0 ? `and ${minutes} mins ` : ""}of sleep
            </span>
          </div>

          {/* Visual 24-Hour Interactive Timeline Bar */}
          <div className="space-y-2 pt-2">
            <div
              ref={trackRef}
              onPointerDown={(e) => handlePointerDown(e)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="relative h-12 bg-secondary/40 rounded-xl border border-border/60 p-1 flex items-center overflow-hidden select-none cursor-pointer touch-none"
            >
              {/* Background Tick Marks */}
              <div className="absolute inset-x-3 top-0 bottom-0 flex justify-between items-center pointer-events-none opacity-30">
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-3 w-[1px] bg-foreground/60" />
                ))}
              </div>

              {/* Active Sleep Range Bar */}
              <div
                className="absolute top-1 bottom-1 rounded-lg bg-gradient-to-r from-indigo-400 via-indigo-500 to-purple-400 dark:from-indigo-500 dark:to-purple-600 shadow-sm flex items-center justify-between border border-indigo-400/40 transition-all duration-75"
                style={{
                  left: `${leftPct}%`,
                  width: `${widthPct}%`,
                }}
              >
                {/* Left Start Handle */}
                <div
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    handlePointerDown(e, "start");
                  }}
                  className="w-3 h-full flex items-center justify-center cursor-col-resize group z-20"
                >
                  <div className="w-1.5 h-6 bg-white border border-slate-300 dark:border-slate-700 rounded-full shadow-sm group-hover:scale-110 transition-all" />
                </div>

                {/* Right End Handle */}
                <div
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    handlePointerDown(e, "end");
                  }}
                  className="w-3 h-full flex items-center justify-center cursor-col-resize group z-20"
                >
                  <div className="w-1.5 h-6 bg-white border border-slate-300 dark:border-slate-700 rounded-full shadow-sm group-hover:scale-110 transition-all" />
                </div>
              </div>
            </div>

            {/* Timeline Tick Labels */}
            <div className="flex justify-between text-[9px] font-bold text-muted-foreground/60 px-2 uppercase select-none">
              <span>8 PM</span>
              <span>12 AM</span>
              <span>4 AM</span>
              <span>8 AM</span>
              <span>12 PM</span>
              <span>4 PM</span>
              <span>8 PM</span>
            </div>
          </div>

          {/* Quality & Factors Selectors */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Calidad Percibida</span>
              <div className="flex gap-1.5">
                {[
                  { label: "Reparador", val: "Reparador" },
                  { label: "Fragmentado", val: "Levemente fragmentado" },
                  { label: "Insuficiente", val: "Insuficiente" },
                ].map((q) => (
                  <button
                    key={q.val}
                    type="button"
                    onClick={() => setQuality(q.val)}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                      quality === q.val
                        ? "bg-indigo-500/15 border-indigo-500/40 text-foreground"
                        : "bg-secondary/30 border-border/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Factores del Descanso</span>
              <div className="flex flex-wrap gap-1.5">
                {factorOptions.map((factor) => {
                  const isSelected = selectedFactors.includes(factor);
                  return (
                    <button
                      key={factor}
                      type="button"
                      onClick={() => handleToggleFactor(factor)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-foreground text-background border-foreground"
                          : "bg-secondary/30 border-border/60 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {isSelected ? "✓ " : ""}{factor}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Bar: Format Toggle & Action Button */}
          <div className="flex items-center justify-between pt-3 border-t border-border/40">
            <button
              type="button"
              onClick={() => setIs24h(!is24h)}
              className="px-3.5 py-2.5 rounded-2xl bg-secondary/50 hover:bg-secondary text-[11px] font-bold text-muted-foreground hover:text-foreground border border-border/60 transition-all cursor-pointer"
            >
              {is24h ? "Formato 12h" : "Formato 24h"}
            </button>

            <button
              type="submit"
              onClick={handleSubmit}
              className="h-11 px-6 rounded-2xl bg-foreground text-background hover:opacity-90 font-extrabold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              <span>Guardar descanso</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
