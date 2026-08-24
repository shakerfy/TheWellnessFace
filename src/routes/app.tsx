import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site-header";
import { BioStateCard } from "@/components/bio-state-card";
import { calculateTimingFit, type TimingFit } from "@/lib/timing-fit";
import { Index } from "./index";
import { GYMS } from "@/lib/gyms";
import { cn } from "@/lib/utils";
import {
  User,
  Calendar,
  BarChart3,
  CreditCard,
  Settings,
  LogOut,
  QrCode,
  CheckCircle,
  CheckCircle2,
  Flag,
  Clock,
  AlertTriangle,
  MapPin,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  Shield,
  ShieldCheck,
  Award,
  AlertCircle,
  ShieldAlert,
  Star,
  Heart,
  Flame,
  Coffee,
  Droplet,
  TrendingUp,
  Info,
  Edit,
  Sun,
  Moon,
  ArrowUpRight,
  Utensils,
  Zap,
  Wheat,
  MessageSquare,
  Bed,
  AlarmClock,
  ArrowUp,
  Camera,
  Dumbbell,
  Brain,
  Activity,
  Plus,
  Check,
  Loader2,
  ShoppingCart,
  Copy,
  Share2,
  Play,
  Pause,
  RotateCcw,
  Search,
  ChevronUp,
  ChevronDown,
  Trash2,
  FileDown,
  Navigation,
  Scan,
  Smartphone,
  ArrowRightLeft,
  Mic,
  Send,
  RefreshCw,
  Sliders,
  PlusCircle,
  MinusCircle,
  ArrowRight,
  Layers,
  Eye,
  Bookmark,
  MoreHorizontal,
  Upload,
  Pencil,
  ArrowLeft,
  Beef,
  Barcode,
  Minus,
  Image as ImageIcon,
  Wind,
  Phone,
  Mail,
  FileText,
  Apple,
  Scale,
  Target,
  HeartPulse,
  Timer,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Tooltip as ShadcnTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { MindfulBreathingModal } from "@/components/mindful-breathing-modal";
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
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  BarChart,
  Bar,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PieChart,
  Pie,
  RadialBarChart,
  RadialBar,
  PolarRadiusAxis,
  PolarAngleAxis,
  Label,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

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
  const [scannerModalOpen, setScannerModalOpen] = useState(false);
  const [qrTimer, setQrTimer] = useState(60);
  const [globalQuickLogOpen, setGlobalQuickLogOpen] = useState(false);

  const [globalLogWeightOpen, setGlobalLogWeightOpen] = useState(false);
  const [globalCheatDaysOpen, setGlobalCheatDaysOpen] = useState(false);
  const [globalWeightInput, setGlobalWeightInput] = useState("72.4");
  const [globalCheatCount, setGlobalCheatCount] = useState(2);

  // Global Shake / Accelerometer Detection
  useEffect(() => {
    let lastX: number | null = null;
    let lastY: number | null = null;
    let lastZ: number | null = null;
    let lastTime = 0;

    const handleMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity;
      if (!acc || acc.x === null || acc.y === null || acc.z === null) return;

      const curTime = Date.now();
      if (curTime - lastTime > 150) {
        const diffTime = curTime - lastTime;
        lastTime = curTime;

        if (lastX !== null && lastY !== null && lastZ !== null) {
          const delta = Math.abs(acc.x + acc.y + acc.z - lastX - lastY - lastZ);
          const speed = (delta / diffTime) * 10000;
          if (speed > 800) {
            setActiveTab("diario");
            if (typeof navigator !== "undefined" && navigator.vibrate) {
              try {
                navigator.vibrate(200);
              } catch (_) {}
            }
          }
        }

        lastX = acc.x;
        lastY = acc.y;
        lastZ = acc.z;
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("devicemotion", handleMotion, true);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("devicemotion", handleMotion, true);
      }
    };
  }, []);
  const navigate = useNavigate();

  // MOCK STATE FOR RESERVATIONS & CANCELLATION VALIDATION
  const [blockedCancellationClass, setBlockedCancellationClass] = useState<any | null>(null);
  const [reservations, setReservations] = useState([
    {
      id: "1",
      name: "CrossFit WOD",
      instructor: "Mateo Rossi",
      time: "19:00",
      timeLabel: "Hoy, 19:00 hs",
      cannotCancel: true,
      timeRemainingLabel: "45 minutos",
    },
    {
      id: "2",
      name: "Yoga Vinyasa",
      instructor: "Valeria Soto",
      time: "22:00",
      timeLabel: "Hoy, 22:00 hs",
      cannotCancel: false,
      timeRemainingLabel: "3 horas y 45 minutos",
    },
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
    <div
      className={`min-h-screen ${activeTab === "diario" ? "bg-slate-50/70 dark:bg-background" : "bg-background"} text-foreground flex flex-col transition-colors duration-200 w-full`}
    >
      {/* Site Header with User Dropdown Menu always visible at top */}
      <SiteHeader />

      <div className="flex-1 pb-16 md:pb-0 w-full">
        {/* Main Content Area */}
        <main
          className={`flex-1 w-full ${activeTab === "inicio" ? "" : activeTab === "diario" ? "px-3 pt-0 pb-4 sm:px-6 sm:pb-6 md:px-10 md:pb-10 max-w-5xl mx-auto" : "px-3 py-4 sm:p-6 md:p-10 max-w-5xl mx-auto"}`}
        >
          {activeTab === "inicio" && <InicioTab />}
          {activeTab === "diario" && <DiarioTab />}
          {activeTab === "clases" && (
            <ClasesTab
              onOpenQr={() => setQrOpen(true)}
              onOpenScanner={() => setScannerModalOpen(true)}
            />
          )}
          {activeTab === "favoritos" && <FavoritosTab />}
          {activeTab === "progreso" && <ProgresoTab />}
          {activeTab === "pagos" && <PagosTab />}
          {activeTab === "config" && <ConfigTab />}
        </main>
      </div>

      {/* Global QR Scanner Modal from Clases Tab */}
      {scannerModalOpen && (
        <QRScannerModal
          onClose={() => setScannerModalOpen(false)}
          onScanSuccess={(data) => {
            setScannerModalOpen(false);
            setActiveTab("diario");
            if (typeof window !== "undefined") {
              setTimeout(() => {
                window.dispatchEvent(new CustomEvent("shakerfy:qr-scan", { detail: data }));
              }, 100);
            }
          }}
        />
      )}

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

            <h3 className="text-lg font-bold tracking-tight text-foreground">
              Cancelación Excedida
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              No cumple con la política de anticipación mínima.
            </p>

            <div className="mt-4 p-4 rounded-2xl bg-secondary/35 text-xs text-left space-y-2 border border-border w-full">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Clase:</span>
                <span className="font-semibold text-foreground">
                  {blockedCancellationClass.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Comienza en:</span>
                <span className="font-semibold text-rose-500">
                  {blockedCancellationClass.timeRemainingLabel}
                </span>
              </div>
              <div className="flex justify-between border-t border-border/60 pt-2 mt-2">
                <span className="text-muted-foreground">Política del Gimnasio:</span>
                <span className="font-semibold text-foreground">Mínimo 2 horas antes</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
              De acuerdo con las normas de <strong>Kraft Strength Club</strong>, las cancelaciones
              deben realizarse con al menos 2 horas de antelación para permitir que otros alumnos en
              lista de espera tomen el cupo.
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
              alert(
                "¡Gracias por tu opinión! Tu reseña ha sido verificada con tus check-ins de asistencia por QR y fue publicada exitosamente.",
              );
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
                { label: "Relación Calidad/Precio", value: ratingPrice, setter: setRatingPrice },
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
                        <Star
                          className={`h-4.5 w-4.5 ${star <= cat.value ? "fill-amber-500 text-amber-500" : "text-zinc-300 dark:text-zinc-700"}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Textarea for comments */}
              <div className="space-y-1.5 mt-2">
                <label className="text-xs font-semibold text-muted-foreground">
                  Escribe tu opinión
                </label>
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

      {/* GLOBAL FLOATING ACTION BUTTON (FAB) & SHAKE AI */}
      <div className="fixed bottom-20 md:bottom-8 right-4 sm:right-6 md:right-8 z-40 flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => {
            setActiveTab("diario");
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-100 dark:bg-card border border-border shadow-md hover:shadow-lg text-foreground font-bold text-xs sm:text-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/30 active:scale-95 cursor-pointer select-none"
          title="AI Coach"
        >
          <Sparkles className="w-4 h-4 stroke-[2] text-foreground" />
          <span>AI Coach</span>
        </button>

        <button
          type="button"
          onClick={() => setGlobalQuickLogOpen(true)}
          className="w-12 h-12 rounded-full bg-slate-950 text-white dark:bg-foreground dark:text-background flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer shrink-0"
          title="Acciones rápidas / Registro"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* GLOBAL MODAL: QUICK ACTION MENU */}
      <Dialog open={globalQuickLogOpen} onOpenChange={setGlobalQuickLogOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6 border border-border bg-card">
          <DialogHeader className="pb-3 border-b border-border/40 text-left">
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-foreground">
              <Plus className="w-5 h-5 text-foreground" /> Registro Rápido
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Selecciona la acción que deseas realizar.
            </DialogDescription>
          </DialogHeader>
          <div className="py-3 space-y-2.5">
            {/* 1. HERO: AI COACH DIARIO */}
            <button
              type="button"
              onClick={() => {
                setGlobalQuickLogOpen(false);
                setActiveTab("diario");
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-purple-500/15 via-primary/15 to-purple-500/10 hover:from-purple-500/25 hover:to-primary/25 transition-all border border-primary/35 text-left group cursor-pointer shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-foreground block">
                      Shake & Build AI
                    </span>
                    <Badge className="bg-primary text-white text-[9px] font-extrabold px-1.5 py-0 h-4 shadow-none">
                      MOTOR 3 BLOQUES
                    </Badge>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    Sugerencia nutricional contextual o agita tu móvil
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-0.5 transition" />
            </button>

            {/* 2. ESCANEAR COMIDA CON IA */}
            <button
              type="button"
              onClick={() => {
                setGlobalQuickLogOpen(false);
                navigate({ to: "/scan" });
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-secondary/50 hover:bg-secondary transition border border-border text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-foreground block">
                    Escanear Comida con IA
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Foto instantánea y análisis ICN
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition" />
            </button>

            {/* 3. REGISTRAR PESO */}
            <button
              type="button"
              onClick={() => {
                setGlobalQuickLogOpen(false);
                setGlobalLogWeightOpen(true);
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-secondary/50 hover:bg-secondary transition border border-border text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-foreground block">Registrar Peso</span>
                  <span className="text-[10px] text-muted-foreground">
                    Actualiza tu peso corporal de hoy
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition" />
            </button>

            {/* 4. ANOTAR CHEAT DAY / COMIDA LIBRE */}
            <button
              type="button"
              onClick={() => {
                setGlobalQuickLogOpen(false);
                setGlobalCheatDaysOpen(true);
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-secondary/50 hover:bg-secondary transition border border-border text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                  <Apple className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-foreground block">
                    Anotar Cheat Day / Comida Libre
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Registra un día o comida libre
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition" />
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* GLOBAL MODAL: SHAKE & BUILD (MOTOR 3 BLOQUES) */}

      {/* GLOBAL MODAL: REGISTRAR PESO */}
      <Dialog open={globalLogWeightOpen} onOpenChange={setGlobalLogWeightOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6 border border-border bg-card">
          <DialogHeader className="pb-3 border-b border-border/40 text-left">
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-foreground">
              <Scale className="w-5 h-5 text-emerald-500" /> Registrar Peso Actual
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Mantén actualizado tu progreso corporal diario.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Peso (kg)</label>
              <input
                type="number"
                step="0.1"
                value={globalWeightInput}
                onChange={(e) => setGlobalWeightInput(e.target.value)}
                placeholder="72.4"
                className="w-full px-4 py-3 rounded-2xl bg-secondary border border-border font-extrabold text-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-2">
              {["68.0", "70.5", "72.4", "75.0"].map((quickVal) => (
                <button
                  key={quickVal}
                  type="button"
                  onClick={() => setGlobalWeightInput(quickVal)}
                  className="flex-1 py-1.5 rounded-xl bg-secondary/70 hover:bg-secondary text-xs font-bold text-muted-foreground hover:text-foreground border border-border/40 transition cursor-pointer"
                >
                  {quickVal} kg
                </button>
              ))}
            </div>
          </div>
          <div className="pt-3 border-t border-border/40 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setGlobalLogWeightOpen(false)}
              className="rounded-xl font-semibold cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setGlobalLogWeightOpen(false);
                if (typeof window !== "undefined") {
                  try {
                    localStorage.setItem("shakerfy_user_weight", globalWeightInput);
                  } catch (_) {}
                }
                toast.success(`Peso actualizado a ${globalWeightInput} kg`);
              }}
              className="rounded-xl font-bold bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer"
            >
              Guardar Peso
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* GLOBAL MODAL: CHEAT DAYS */}
      <Dialog open={globalCheatDaysOpen} onOpenChange={setGlobalCheatDaysOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6 border border-border bg-card text-left">
          <DialogHeader className="pb-3 border-b border-border/40 text-left">
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-foreground">
              <Apple className="w-5 h-5 text-indigo-500" /> Registro de Días / Comidas Libres
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Registra comidas libres dentro de tu plan de hábitos conscientes.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/50 border border-border">
              <div>
                <span className="text-xs font-bold text-foreground block">
                  Cheat Meals esta semana
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Permitidos recomendados: 2 por semana
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full cursor-pointer"
                  onClick={() => setGlobalCheatCount(Math.max(0, globalCheatCount - 1))}
                >
                  -
                </Button>
                <span className="font-mono font-bold text-base">{globalCheatCount}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full cursor-pointer"
                  onClick={() => setGlobalCheatCount(globalCheatCount + 1)}
                >
                  +
                </Button>
              </div>
            </div>
          </div>
          <div className="pt-3 border-t border-border/40 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setGlobalCheatDaysOpen(false)}
              className="rounded-xl font-semibold cursor-pointer"
            >
              Cerrar
            </Button>
            <Button
              onClick={() => {
                setGlobalCheatDaysOpen(false);
                toast.success("Comidas libres actualizadas");
              }}
              className="rounded-xl font-bold bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer"
            >
              Guardar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
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
            Explora gimnasios en la página principal y presiona el ícono de corazón para guardarlos
            aquí.
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
                  <img src={gym.images[0]} alt={gym.name} className="w-full h-full object-cover" />
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
                      <span>
                        {gym.neighborhood}, {gym.city}
                      </span>
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
            {isBooked && (
              <Badge className="bg-emerald-500 text-black text-xs font-black">Reservada</Badge>
            )}
            {isFull && (
              <Badge variant="secondary" className="text-xs">
                Completo
              </Badge>
            )}
            {classData.status === "urgent" && (
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
                Ultimos cupos
              </Badge>
            )}
          </div>
          <h2 className="text-xl font-extrabold text-foreground tracking-tight">
            {classData.name}
          </h2>
          <p className="text-xs text-muted-foreground flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> {classData.instructor}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {classData.time}
            </span>
            {classData.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {classData.location}
              </span>
            )}
          </p>
        </div>
        <div className="p-5 space-y-2 text-xs text-muted-foreground">
          <div>
            <span className="font-semibold text-foreground">Cupos: </span>
            {classData.slots}
          </div>
          {classData.salaName && (
            <div>
              <span className="font-semibold text-foreground">Sala: </span>
              {classData.salaName}
            </div>
          )}
        </div>
        <div className="px-5 pb-5 flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="rounded-full flex-1">
            Cerrar
          </Button>
          {isBooked ? (
            onOpenQr && (
              <Button
                onClick={() => {
                  onClose();
                  onOpenQr();
                }}
                className="rounded-full flex-1 bg-emerald-500 text-black hover:bg-emerald-400 font-bold gap-2"
              >
                <QrCode className="w-4 h-4" /> Check-in QR
              </Button>
            )
          ) : isFull ? (
            <Button variant="secondary" disabled className="rounded-full flex-1">
              Clase llena
            </Button>
          ) : (
            <Button
              onClick={() => {
                alert(`Reserva confirmada en ${classData.name}`);
                onClose();
              }}
              className="rounded-full flex-1 font-bold"
            >
              Reservar
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Subcomponent: Clases / Check-in Tab
function ClasesTab({
  onOpenQr,
  onOpenScanner,
}: {
  onOpenQr?: () => void;
  onOpenScanner?: () => void;
}) {
  const [selectedClassDetail, setSelectedClassDetail] = useState<any | null>(null);

  const userMemberships = [
    {
      id: "kraft-club",
      gymName: "Kraft Club",
      planName: "Pase Libre Total",
      badge: "VIP PASSPORT",
      code: "KC-884291",
      status: "Activa (Pase Libre)",
      location: "Palermo, CABA",
      passType: "Pase Libre",
      remainingCredits: null as number | null,
      creditsCount: null as number | null,
      color: "from-zinc-950 via-zinc-900 to-black border-zinc-700/60 shadow-xl",
      accentBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      logoIcon: "🏋️",
    },
    {
      id: "fitflow-studio",
      gymName: "FitFlow Studio",
      planName: "Pase 8 Clases / Mes",
      badge: "YOGA & PILATES",
      code: "FF-330194",
      status: "Activa",
      location: "Recoleta, CABA",
      passType: "Por Creditos",
      remainingCredits: 5,
      creditsCount: 8,
      color: "from-slate-950 via-indigo-950 to-slate-900 border-indigo-500/40 shadow-xl",
      accentBg: "bg-indigo-500/10 text-indigo-300 border-indigo-500/30",
      logoIcon: "🧘",
    },
    {
      id: "box-central",
      gymName: "Box Central",
      planName: "CrossFit 12 Sesiones",
      badge: "OFFICIAL BOX",
      code: "BC-772105",
      status: "Activa",
      location: "Belgrano, CABA",
      passType: "Por Creditos",
      remainingCredits: 3,
      creditsCount: 12,
      color: "from-stone-950 via-amber-950/90 to-neutral-950 border-amber-500/40 shadow-xl",
      accentBg: "bg-amber-500/10 text-amber-300 border-amber-500/30",
      logoIcon: "⚡",
    },
  ];

  const upcomingReservations = [
    {
      id: "res-1",
      gymName: "Box Central",
      name: "CrossFit WOD",
      instructor: "Mateo Rossi",
      timeLabel: "Hoy, 19:00 hs",
      location: "Belgrano, CABA",
      status: "booked",
    },
    {
      id: "res-2",
      gymName: "FitFlow Studio",
      name: "Yoga Vinyasa Flow",
      instructor: "Valeria Soto",
      timeLabel: "Hoy, 22:00 hs",
      location: "Recoleta, CABA",
      status: "booked",
    },
    {
      id: "res-3",
      gymName: "Kraft Club",
      name: "Musculacion & Funcional",
      instructor: "Daniel Gomez",
      timeLabel: "Manana, 10:00 hs",
      location: "Palermo, CABA",
      status: "booked",
    },
  ];

  const allClasses = [
    {
      id: "c1",
      gymName: "Box Central",
      name: "CrossFit WOD Express",
      instructor: "Mateo Rossi",
      time: "08:00 hs",
      slots: "10 cupos",
      status: "available",
    },
    {
      id: "c2",
      gymName: "FitFlow Studio",
      name: "Yoga Ashtanga & Meditacion",
      instructor: "Valeria Soto",
      time: "09:30 hs",
      slots: "Ultimos 2 cupos",
      status: "urgent",
    },
    {
      id: "c3",
      gymName: "Kraft Club",
      name: "Entrenamiento Funcional HIIT",
      instructor: "Daniel Gomez",
      time: "18:00 hs",
      slots: "Completo",
      status: "full",
    },
    {
      id: "c4",
      gymName: "Box Central",
      name: "CrossFit WOD Noche",
      instructor: "Mateo Rossi",
      time: "19:00 hs",
      slots: "Reservado",
      status: "booked",
    },
    {
      id: "c5",
      gymName: "FitFlow Studio",
      name: "Pilates Reformer Core",
      instructor: "Sofia Martinez",
      time: "20:00 hs",
      slots: "5 cupos",
      status: "available",
    },
    {
      id: "c6",
      gymName: "Kraft Club",
      name: "Body Sculpt & Stretch",
      instructor: "Lucia Fernandez",
      time: "21:00 hs",
      slots: "7 cupos",
      status: "available",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight">Check-in & Membresias</h2>
            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-xs font-semibold"
            >
              Socio Activo
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Tus carnets activos, proximas clases y horario disponible.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onOpenScanner && (
            <Button
              onClick={onOpenScanner}
              variant="outline"
              className="rounded-full font-semibold border-border hover:bg-secondary flex items-center gap-2 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Escanear QR Club</span>
            </Button>
          )}
          {onOpenQr && (
            <Button
              onClick={onOpenQr}
              className="rounded-full bg-foreground text-background font-semibold shadow-lg hover:opacity-90 flex items-center gap-2 cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>Abrir Pase QR</span>
            </Button>
          )}
        </div>
      </div>

      {/* Carnets */}
      <div className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-emerald-500" /> Mis Carnets ({userMemberships.length})
        </div>
        <div className="flex gap-4 overflow-x-auto pb-3 pt-1 snap-x [scrollbar-width:none] -mx-2 px-2">
          {userMemberships.map((card) => (
            <div
              key={card.id}
              className={`snap-start flex-shrink-0 w-[280px] sm:w-[300px] rounded-2xl p-5 border relative overflow-hidden bg-gradient-to-br ${card.color}`}
            >
              <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-white/5 blur-2xl pointer-events-none" />
              <div className="flex justify-between items-start relative z-10">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{card.logoIcon}</span>
                  <div>
                    <h3 className="font-extrabold text-white text-base tracking-tight leading-none">
                      {card.gymName}
                    </h3>
                    <p className="text-[11px] text-zinc-400 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {card.location}
                    </p>
                  </div>
                </div>
                <Badge
                  className={`text-[10px] font-bold uppercase tracking-wider border ${card.accentBg}`}
                >
                  {card.badge}
                </Badge>
              </div>
              <div className="mt-5 mb-4 relative z-10">
                <div className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
                  Titular
                </div>
                <div className="text-sm font-extrabold text-white tracking-wide">AGUSTIN GOMEZ</div>
                <div className="text-xs text-zinc-300 font-medium mt-1">{card.planName}</div>
              </div>
              <div className="pt-3 border-t border-white/10 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-zinc-300 font-medium text-[11px]">
                    {card.passType === "Por Creditos"
                      ? `${card.remainingCredits}/${card.creditsCount} creditos`
                      : card.status}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-zinc-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                  {card.code}
                </span>
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
          <span className="text-xs text-muted-foreground font-medium ml-auto">
            {upcomingReservations.length} reservas activas
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {upcomingReservations.map((res) => (
            <div
              key={res.id}
              className="rounded-2xl border border-border bg-card p-4 flex flex-col gap-3 shadow-sm"
            >
              <div className="flex justify-between items-start gap-2">
                <div>
                  <Badge
                    variant="outline"
                    className="text-[10px] font-bold text-emerald-500 border-emerald-500/30 bg-emerald-500/10 mb-1.5"
                  >
                    {res.gymName}
                  </Badge>
                  <h4 className="text-sm font-bold text-foreground">{res.name}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <User className="w-3.5 h-3.5" /> {res.instructor}
                  </p>
                </div>
                <Badge variant="secondary" className="text-[11px] flex items-center gap-1 shrink-0">
                  <Clock className="w-3 h-3 text-amber-500" /> {res.timeLabel}
                </Badge>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {res.location}
                </span>
                <Button
                  size="sm"
                  onClick={onOpenQr}
                  className="rounded-full text-xs font-semibold gap-1.5 h-8 px-3.5 bg-foreground text-background hover:opacity-90"
                >
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
          <p className="text-xs text-muted-foreground">
            Todas tus clases disponibles para reservar hoy.
          </p>
        </div>
        <div className="rounded-2xl border border-border overflow-hidden bg-card">
          <ul className="divide-y divide-border">
            {allClasses.map((c) => (
              <li
                key={c.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 hover:bg-muted/30 transition"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-foreground">{c.name}</span>
                    <Badge variant="outline" className="text-[10px] text-muted-foreground">
                      {c.gymName}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Prof. {c.instructor} · {c.time}
                  </div>
                </div>
                <div className="flex items-center gap-3 justify-between sm:justify-start shrink-0">
                  <span
                    className={`text-xs font-medium ${c.status === "urgent" ? "text-amber-500 font-semibold" : c.status === "booked" ? "text-emerald-500 font-semibold" : "text-muted-foreground"}`}
                  >
                    {c.status === "booked" && <Check className="w-3.5 h-3.5 inline mr-0.5" />}
                    {c.slots}
                  </span>
                  <Button
                    size="sm"
                    variant={c.status === "booked" || c.status === "full" ? "outline" : "default"}
                    disabled={c.status === "full"}
                    onClick={() => setSelectedClassDetail({ ...c, location: "CABA" })}
                    className="rounded-full min-w-[90px]"
                  >
                    {c.status === "booked"
                      ? "Ver Detalles"
                      : c.status === "full"
                        ? "Completo"
                        : "Reservar"}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <UserClassDetailModal
        classData={selectedClassDetail}
        isOpen={!!selectedClassDetail}
        onClose={() => setSelectedClassDetail(null)}
        onOpenQr={onOpenQr}
      />
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
        <h3 className="text-sm font-bold text-muted-foreground mb-6 uppercase tracking-wider">
          Asistencias Conversión
        </h3>
        <div className="flex items-end justify-between h-48 px-4">
          {chartData.map((d) => {
            const heightPercentage = `${(d.visits / 25) * 100}%`;
            return (
              <div
                key={d.month}
                className="flex flex-col items-center gap-2 h-full justify-end flex-1"
              >
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
    {
      date: "20-Jun-2026",
      concept: "Pase Mensual - Kraft Club",
      amount: "$18.900",
      method: "Tarjeta (Visa)",
      status: "Pagado",
    },
    {
      date: "20-May-2026",
      concept: "Pase Mensual - Kraft Club",
      amount: "$18.900",
      method: "Tarjeta (Visa)",
      status: "Pagado",
    },
    {
      date: "20-Abr-2026",
      concept: "Pase Mensual - Kraft Club",
      amount: "$18.900",
      method: "Tarjeta (Visa)",
      status: "Pagado",
    },
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
            <p className="text-sm text-muted-foreground mt-0.5">
              Acceso a todas las clases y sala de musculación.
            </p>
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
// Food Categories Data for Pantry Selector
const FOOD_CATEGORIES = [
  {
    id: "hortalizas",
    name: "Hortalizas & Vegetales",
    items: [
      "Lechuga",
      "Rúcula",
      "Radicheta",
      "Tomate",
      "Puerro",
      "Cebolla",
      "Berenjena",
      "Zapallito",
      "Morrón",
      "Brócoli",
      "Coliflor",
      "Brotes de soja",
      "Repollito de bruselas",
      "Remolacha",
      "Ajo",
      "Zanahoria",
      "Repollo",
      "Champiñon",
      "Calabaza",
      "Zapallo",
      "Apio",
    ],
  },
  {
    id: "frutas",
    name: "Frutas Frescas",
    items: [
      "Banana",
      "Manzana",
      "Mandarina",
      "Naranja",
      "Pera",
      "Uva",
      "Frutilla",
      "Arándano",
      "Sandía",
      "Melón",
      "Durazno",
      "Ananá",
    ],
  },
  {
    id: "dulces",
    name: "Dulces Saludables",
    items: ["Miel", "Mermelada sin azúcar", "Dátiles"],
  },
  {
    id: "proteina_animal",
    name: "Proteína Animal",
    items: ["Cerdo", "Pescado", "Pollo", "Vaca", "Huevo", "Jamón cocido", "Lomito", "Pavita"],
  },
  {
    id: "proteina_vegetal",
    name: "Proteína Vegetal",
    items: [
      "Lenteja",
      "Garbanzo",
      "Poroto",
      "Soja",
      "Arveja",
      "Habas",
      "Soja texturizada",
      "Tofu",
      "Tempeh",
      "Levadura nutricional",
      "Germen de trigo",
      "Seitán",
      "Medallones de legumbres",
    ],
  },
  {
    id: "grasas_saludables",
    name: "Grasas Saludables",
    items: ["Aceite", "Palta", "Aceituna", "Frutos secos", "Semillas", "Pasta de maní"],
  },
  {
    id: "lacteos",
    name: "Lácteos & Quesos",
    items: ["Leche parcialmente descremada", "Yogurt parcialmente descremado", "Quesos magros"],
  },
  {
    id: "carbohidratos",
    name: "Carbohidratos & Granos",
    items: [
      "Amaranto",
      "Arroz",
      "Avena",
      "Cebada",
      "Centeno",
      "Trigo",
      "Trigo sarraceno",
      "Trigo burgol",
      "Cous cous",
      "Mijo",
      "Quinoa",
      "Polenta",
      "Almidón de maíz",
      "Pastas simples",
      "Pastas rellenas",
      "Masas de empanadas",
      "Masas de tartas",
      "Masas de fajitas",
      "Pan",
      "Papa",
      "Batata",
      "Choclo",
    ],
  },
  {
    id: "condimentos",
    name: "Condimentos & Especias",
    items: [
      "Nuez moscada",
      "Pimentón",
      "Pimienta blanca / negra",
      "Perejil",
      "Orégano",
      "Ají",
      "Cúrcuma",
      "Curry",
    ],
  },
  {
    id: "otros",
    name: "Otros Esenciales",
    items: [
      "Bebidas vegetales sin azúcar",
      "Coco rallado",
      "Esencia de vainilla",
      "Stevia",
      "Polvo para hornear",
    ],
  },
];

// Muscle Anatomy & Groups Data
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
  { id: "gemelos", name: "Gemelos", img: "/atras (6).png" },
];

// Subcomponent: Config Tab (Perfil & Configuración)
function ConfigTab() {
  const navigate = useNavigate();
  const [subView, setSubView] = useState<
    "main" | "edit-profile" | "diet-preferences" | "app-settings"
  >("main");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile Form States
  const [photo, setPhoto] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("shakerfy_user_photo");
      if (saved) return saved;
    }
    return "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";
  });
  const [fullName, setFullName] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("shakerfy_user_profile_edit");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.fullName) return parsed.fullName;
        } catch (e) {}
      }
    }
    return "Agustín Gómez";
  });
  const [phone, setPhone] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("shakerfy_user_profile_edit");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.phone) return parsed.phone;
        } catch (e) {}
      }
    }
    return "+54 9 11 4982-9011";
  });
  const [email, setEmail] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("shakerfy_user_profile_edit");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.email) return parsed.email;
        } catch (e) {}
      }
    }
    return "agustin.gomez@shakerfy.com";
  });
  const [location, setLocation] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("shakerfy_user_profile_edit");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.location) return parsed.location;
        } catch (e) {}
      }
    }
    return "Palermo, Buenos Aires";
  });
  const [sex, setSex] = useState<"masculino" | "femenino" | "otro">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("shakerfy_user_profile_edit");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.sex) return parsed.sex;
        } catch (e) {}
      }
    }
    return "masculino";
  });
  const [birthDate, setBirthDate] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("shakerfy_user_profile_edit");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.birthDate) return parsed.birthDate;
        } catch (e) {}
      }
    }
    return "1996-05-14";
  });
  const [units, setUnits] = useState<"metrico" | "imperial">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("shakerfy_user_profile_edit");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.units) return parsed.units;
        } catch (e) {}
      }
    }
    return "metrico";
  });
  const [height, setHeight] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("shakerfy_user_profile_edit");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.height) return parsed.height;
        } catch (e) {}
      }
    }
    return "175";
  });
  const [weight, setWeight] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("shakerfy_user_profile_edit");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.weight) return parsed.weight;
        } catch (e) {}
      }
    }
    return "72";
  });
  const [goal, setGoal] = useState<"musculo" | "en_forma" | "perder_peso" | "saludable">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("shakerfy_user_profile_edit");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.goal) return parsed.goal;
        } catch (e) {}
      }
    }
    return "en_forma";
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen debe pesar menos de 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setPhoto(base64);
        if (typeof window !== "undefined") {
          localStorage.setItem("shakerfy_user_photo", base64);
          window.dispatchEvent(new CustomEvent("shakerfy:photo-updated", { detail: base64 }));
        }
        toast.success("Foto de perfil actualizada");
      }
    };
    reader.readAsDataURL(file);
  };

  // Diet Preferences Form States
  const [dietType, setDietType] = useState<string>("recomendada");
  const [restrictions, setRestrictions] = useState<string[]>([]);
  const [meals, setMeals] = useState<string[]>(["desayuno", "almuerzo", "snack_1", "cena"]);
  const [suggestionStyle, setSuggestionStyle] = useState<"recetas" | "ingredientes">("recetas");
  const [variety, setVariety] = useState<"mucha" | "moderada" | "poca">("moderada");
  const [selectedFoods, setSelectedFoods] = useState<string[]>(() => {
    return FOOD_CATEGORIES.flatMap((c) => c.items);
  });

  // App Settings State
  const [theme, setTheme] = useState<"system" | "light" | "dark">("system");
  const [language, setLanguage] = useState("es");
  const [reminders, setReminders] = useState(true);
  const [motionSensorEnabled, setMotionSensorEnabled] = useState(false);

  // Settings Popup Dialog State
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // Progress/Profile Screen States (matching reference design)
  const [timePeriod, setTimePeriod] = useState<"90_days" | "6_months" | "1_year" | "all_time">(
    "90_days",
  );
  const [logWeightModalOpen, setLogWeightModalOpen] = useState(false);
  const [cheatDaysModalOpen, setCheatDaysModalOpen] = useState(false);
  const [editGoalModalOpen, setEditGoalModalOpen] = useState(false);
  const [quickLogModalOpen, setQuickLogModalOpen] = useState(false);

  // Shake / Accelerometer Detection for "Shake & Build"
  useEffect(() => {
    let lastX: number | null = null;
    let lastY: number | null = null;
    let lastZ: number | null = null;
    let lastTime = 0;

    const handleMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity;
      if (!acc || acc.x === null || acc.y === null || acc.z === null) return;

      const curTime = Date.now();
      if (curTime - lastTime > 150) {
        const diffTime = curTime - lastTime;
        lastTime = curTime;

        if (lastX !== null && lastY !== null && lastZ !== null) {
          const delta = Math.abs(acc.x + acc.y + acc.z - lastX - lastY - lastZ);
          const speed = (delta / diffTime) * 10000;
          if (speed > 800) {
            window.dispatchEvent(new CustomEvent("shakerfy:shake-trigger"));
            if (typeof navigator !== "undefined" && navigator.vibrate) {
              try {
                navigator.vibrate(200);
              } catch (_) {}
            }
          }
        }

        lastX = acc.x;
        lastY = acc.y;
        lastZ = acc.z;
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("devicemotion", handleMotion, true);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("devicemotion", handleMotion, true);
      }
    };
  }, []);
  const [newWeightInput, setNewWeightInput] = useState(weight);
  const [cheatCount, setCheatCount] = useState(2);
  const [goalPercent, setGoalPercent] = useState(80);

  useEffect(() => {
    const handleOpenSettingsEvent = () => {
      setSettingsModalOpen(true);
    };
    window.addEventListener("shakerfy:open-settings", handleOpenSettingsEvent);
    return () => {
      window.removeEventListener("shakerfy:open-settings", handleOpenSettingsEvent);
    };
  }, []);

  // Legal, Contact, Logout & Delete Account Modals State
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);

  // Profile Completion Percentage Calculation (Gamificación sin bloqueo)
  const profileCompletion = useMemo(() => {
    let completedSteps = 0;
    const totalSteps = 7;

    if (fullName.trim().length > 0) completedSteps++;
    if (birthDate && sex) completedSteps++;
    if (height && weight && Number(height) > 0 && Number(weight) > 0) completedSteps++;
    if (goal) completedSteps++;
    if (dietType) completedSteps++;
    if (meals.length > 0) completedSteps++;
    if (selectedFoods.length > 0) completedSteps++;

    return Math.round((completedSteps / totalSteps) * 100);
  }, [fullName, birthDate, sex, height, weight, goal, dietType, meals, selectedFoods]);

  const handleToggleMotionSensor = async (enabled: boolean) => {
    setMotionSensorEnabled(enabled);
    if (enabled) {
      if (
        typeof window !== "undefined" &&
        typeof (DeviceMotionEvent as any)?.requestPermission === "function"
      ) {
        try {
          const permissionState = await (DeviceMotionEvent as any).requestPermission();
          if (permissionState === "granted") {
            toast.success("Permiso de sensor de movimiento activado para iPhone");
          } else {
            toast.error("Permiso de acelerómetro denegado en iOS");
            setMotionSensorEnabled(false);
          }
        } catch (err) {
          toast.info("Sensor de movimiento activado para Shake AI");
        }
      } else {
        toast.success("Sensor de movimiento Shake AI activado");
      }
    } else {
      toast.info("Sensor de movimiento desactivado");
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      const updatedProfile = {
        fullName,
        phone,
        email,
        location,
        sex,
        birthDate,
        units,
        height,
        weight,
        goal,
      };
      localStorage.setItem("shakerfy_user_profile_edit", JSON.stringify(updatedProfile));
      localStorage.setItem("shakerfy_user_photo", photo);
      window.dispatchEvent(new CustomEvent("shakerfy:profile-updated", { detail: updatedProfile }));
    }
    toast.success("Perfil guardado correctamente");
    setSubView("main");
  };

  const handleSaveDietPreferences = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      const dietData = { dietType, restrictions, meals, suggestionStyle, variety, selectedFoods };
      localStorage.setItem("shakerfy_diet_preferences", JSON.stringify(dietData));
    }
    toast.success("Preferencias alimenticias guardadas");
    setSubView("main");
  };

  const handleSaveAppSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      const appSettingsData = { theme, language, reminders, motionSensorEnabled };
      localStorage.setItem("shakerfy_app_settings", JSON.stringify(appSettingsData));
    }
    toast.success("Configuración de la aplicación guardada");
    setSubView("main");
  };

  const handleLogout = () => {
    setLogoutModalOpen(false);
    toast.success("Sesión cerrada correctamente");
    navigate({ to: "/" });
  };

  const toggleRestriction = (res: string) => {
    setRestrictions((prev) =>
      prev.includes(res) ? prev.filter((r) => r !== res) : [...prev, res],
    );
  };

  const toggleMeal = (meal: string) => {
    setMeals((prev) => (prev.includes(meal) ? prev.filter((m) => m !== meal) : [...prev, meal]));
  };

  const toggleFood = (item: string) => {
    setSelectedFoods((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  const toggleCategoryFoods = (categoryItems: string[]) => {
    const allSelected = categoryItems.every((i) => selectedFoods.includes(i));
    if (allSelected) {
      setSelectedFoods((prev) => prev.filter((i) => !categoryItems.includes(i)));
    } else {
      setSelectedFoods((prev) => Array.from(new Set([...prev, ...categoryItems])));
    }
  };

  const getGoalLabel = (g: string) => {
    switch (g) {
      case "musculo":
        return "Ganar músculo";
      case "perder_peso":
        return "Perder peso";
      case "saludable":
        return "Ser saludable";
      default:
        return "Ponerme en forma";
    }
  };

  const getDietTypeLabel = (d: string) => {
    switch (d) {
      case "alta_proteinas":
        return "Alta en proteínas";
      case "baja_carbos":
        return "Baja en carbohidratos";
      case "keto":
        return "Keto";
      case "bajo_grasas":
        return "Bajo en grasas";
      default:
        return "Recomendada";
    }
  };

  // SUB-SCREEN 1: PERFIL (EDITAR PERFIL)
  if (subView === "edit-profile") {
    return (
      <div className="space-y-6 max-w-2xl mx-auto pb-16 animate-fade-in">
        <button
          type="button"
          onClick={() => setSubView("main")}
          className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Volver a Perfil
        </button>

        <div>
          <h2 className="text-2xl font-bold tracking-tight">Editar Perfil</h2>
          <p className="text-sm text-muted-foreground">
            Configura tus datos de contacto, biometría y objetivo principal.
          </p>
        </div>

        <form
          onSubmit={handleSaveProfile}
          className="space-y-6 border border-border bg-card shadow-xs rounded-3xl p-6 sm:p-8"
        >
          {/* Avatar Header with Change Photo */}
          <div className="flex items-center gap-4 pb-4 border-b border-border/40">
            <div className="relative group">
              <img
                src={photo}
                alt="Perfil"
                className="h-16 w-16 rounded-full object-cover border border-border shadow-xs"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-1 rounded-full bg-background border border-border shadow-xs text-foreground hover:scale-105 transition cursor-pointer"
                title="Cambiar foto"
              >
                <Pencil className="w-3 h-3" />
              </button>
            </div>
            <div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cambiar foto
              </Button>
              <p className="text-[11px] text-muted-foreground mt-1">JPG, PNG o WEBP. Máx 5MB.</p>
            </div>
          </div>

          {/* Nombre & Teléfono */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Nombre Completo</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Teléfono</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+54 9 11 4982-9011"
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Email & Ubicación */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="agustin.gomez@shakerfy.com"
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Dirección / Gimnasio Base
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Palermo, Buenos Aires"
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Sexo & Fecha de Nacimiento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Sexo / Género</label>
              <Select value={sex} onValueChange={(val: any) => setSex(val)}>
                <SelectTrigger className="w-full rounded-xl">
                  <SelectValue placeholder="Selecciona sexo" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="femenino">Femenino</SelectItem>
                  <SelectItem value="otro">Otro / Prefiero no decir</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Sistema de Unidades */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Sistema de Unidades
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setUnits("metrico")}
                className={cn(
                  "h-10 rounded-xl border text-xs font-semibold transition cursor-pointer flex items-center justify-center",
                  units === "metrico"
                    ? "border-foreground bg-accent text-foreground font-bold"
                    : "border-border/60 hover:border-border text-muted-foreground",
                )}
              >
                Métrico (kg, cm)
              </button>
              <button
                type="button"
                onClick={() => setUnits("imperial")}
                className={cn(
                  "h-10 rounded-xl border text-xs font-semibold transition cursor-pointer flex items-center justify-center",
                  units === "imperial"
                    ? "border-foreground bg-accent text-foreground font-bold"
                    : "border-border/60 hover:border-border text-muted-foreground",
                )}
              >
                Imperial (lbs, in)
              </button>
            </div>
          </div>

          {/* Altura & Peso */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Altura ({units === "metrico" ? "cm" : "pulgadas"})
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder={units === "metrico" ? "175" : "69"}
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Peso ({units === "metrico" ? "kg" : "lbs"})
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder={units === "metrico" ? "70" : "154"}
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Objetivo Principal */}
          <div className="space-y-2 pt-2 border-t border-border/40">
            <label className="text-xs font-semibold text-foreground block">
              Objetivo Principal
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: "musculo", label: "Ganar músculo", icon: Dumbbell, color: "text-orange-500" },
                { id: "en_forma", label: "Ponerme en forma", icon: Flame, color: "text-amber-500" },
                {
                  id: "perder_peso",
                  label: "Perder peso",
                  icon: TrendingUp,
                  color: "text-emerald-500",
                },
                { id: "saludable", label: "Ser saludable", icon: Heart, color: "text-rose-500" },
              ].map((item) => {
                const IconComp = item.icon;
                const isSelected = goal === item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setGoal(item.id as any)}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-medium transition cursor-pointer text-center space-y-1.5",
                      isSelected
                        ? "border-foreground bg-accent text-foreground font-bold shadow-xs"
                        : "border-border/60 hover:border-border text-muted-foreground",
                    )}
                  >
                    <IconComp
                      className={cn("w-4 h-4", isSelected ? item.color : "text-muted-foreground")}
                    />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex items-center gap-3">
            <Button
              type="submit"
              size="default"
              className="rounded-xl font-bold flex-1 sm:flex-initial cursor-pointer"
            >
              Guardar Cambios de Perfil
            </Button>
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={() => setSubView("main")}
              className="rounded-xl font-semibold cursor-pointer"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // SUB-SCREEN 2: PREFERENCIAS ALIMENTICIAS
  if (subView === "diet-preferences") {
    return (
      <div className="space-y-6 max-w-3xl pb-16 animate-fade-in">
        <button
          type="button"
          onClick={() => setSubView("main")}
          className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Volver a Configuración
        </button>

        <div>
          <h2 className="text-2xl font-bold tracking-tight">Preferencias Alimenticias</h2>
          <p className="text-sm text-muted-foreground">
            Personaliza tus metas nutricionales, tipo de sugerencias y disponibilidad de alimentos.
          </p>
        </div>

        <form onSubmit={handleSaveDietPreferences} className="space-y-8">
          {/* 1. TIPO DE DIETA */}
          <div className="border border-border bg-card shadow-xs rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Utensils className="w-4 h-4 text-emerald-500" /> ¿Qué tipo de dieta prefieres?
              </h3>
              <p className="text-xs text-muted-foreground">
                La IA ajustará la distribución de nutrientes según tu filosofía nutricional.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: "recomendada",
                  title: "Recomendada",
                  desc: "La mejor para ti. Mezcla óptima de proteínas, carbohidratos y grasas.",
                },
                {
                  id: "alta_proteinas",
                  title: "Alta en proteínas",
                  desc: "Más proteínas, menos carbohidratos y grasas moderadas.",
                },
                {
                  id: "baja_carbos",
                  title: "Baja en carbohidratos",
                  desc: "Menos carbohidratos, más grasas y proteínas moderadas.",
                },
                {
                  id: "keto",
                  title: "Keto",
                  desc: "Muy baja en carbohidratos, alta en grasas y proteínas moderadas.",
                },
                {
                  id: "bajo_grasas",
                  title: "Bajo en grasas",
                  desc: "Menos grasas, más carbohidratos y proteínas moderadas.",
                },
              ].map((dt) => {
                const isSelected = dietType === dt.id;
                return (
                  <button
                    type="button"
                    key={dt.id}
                    onClick={() => setDietType(dt.id)}
                    className={cn(
                      "p-4 rounded-2xl border text-left transition cursor-pointer space-y-1",
                      isSelected
                        ? "border-foreground bg-accent/80 text-foreground shadow-xs"
                        : "border-border/60 hover:border-border text-muted-foreground",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">{dt.title}</span>
                      {isSelected && <Check className="w-4 h-4 text-emerald-500" />}
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{dt.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. RESTRICCIONES & FRECUENCIA DE COMIDAS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Restricciones */}
            <div className="border border-border bg-card shadow-xs rounded-3xl p-6 space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-foreground">Restricciones Alimentarias</h3>
                <p className="text-xs text-muted-foreground">
                  Selecciona si sigues algún régimen estricto.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { id: "vegano", label: "Vegano" },
                  { id: "vegetariano", label: "Vegetariano" },
                  { id: "sin_lactosa", label: "Sin Lactosa" },
                  { id: "sin_gluten", label: "Sin Gluten / Celiaco" },
                ].map((res) => {
                  const isChecked = restrictions.includes(res.id);
                  return (
                    <button
                      type="button"
                      key={res.id}
                      onClick={() => toggleRestriction(res.id)}
                      className={cn(
                        "px-3.5 py-2 rounded-xl border text-xs font-semibold transition cursor-pointer flex items-center gap-1.5",
                        isChecked
                          ? "border-foreground bg-foreground text-background"
                          : "border-border/60 hover:border-border text-muted-foreground",
                      )}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5" />}
                      <span>{res.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Frecuencia de comidas */}
            <div className="border border-border bg-card shadow-xs rounded-3xl p-6 space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-foreground">Distribución de Comidas</h3>
                <p className="text-xs text-muted-foreground">
                  ¿Cuántas comidas al día sueles o deseas hacer?
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { id: "desayuno", label: "Desayuno" },
                  { id: "almuerzo", label: "Almuerzo" },
                  { id: "snack_1", label: "Snack 1" },
                  { id: "cena", label: "Cena" },
                  { id: "snack_2", label: "Snack 2" },
                ].map((m) => {
                  const isChecked = meals.includes(m.id);
                  return (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => toggleMeal(m.id)}
                      className={cn(
                        "px-3.5 py-2 rounded-xl border text-xs font-semibold transition cursor-pointer flex items-center gap-1.5",
                        isChecked
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "border-border/60 hover:border-border text-muted-foreground",
                      )}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5" />}
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. FORMATO & VARIEDAD DE SUGERENCIAS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Formato de Sugerencias */}
            <div className="border border-border bg-card shadow-xs rounded-3xl p-6 space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-foreground">Formato de Sugerencias</h3>
                <p className="text-xs text-muted-foreground">
                  ¿Cómo prefieres que la IA te presente tus comidas?
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    id: "recetas",
                    title: "📖 Recetas",
                    desc: "Instrucciones paso a paso. Ej: Avocado Chicken Sandwich.",
                  },
                  {
                    id: "ingredientes",
                    title: "🥩 Solo ingredientes",
                    desc: "Prepáralos como quieras. Ej: 1 filete de pollo, 1 taza de arroz, 1/2 palta.",
                  },
                ].map((fmt) => {
                  const isSelected = suggestionStyle === fmt.id;
                  return (
                    <button
                      type="button"
                      key={fmt.id}
                      onClick={() => setSuggestionStyle(fmt.id as any)}
                      className={cn(
                        "w-full p-3.5 rounded-2xl border text-left transition cursor-pointer space-y-1",
                        isSelected
                          ? "border-foreground bg-accent text-foreground font-bold"
                          : "border-border/60 hover:border-border text-muted-foreground",
                      )}
                    >
                      <div className="text-xs font-bold text-foreground">{fmt.title}</div>
                      <p className="text-[11px] text-muted-foreground">{fmt.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Variedad de Comidas */}
            <div className="border border-border bg-card shadow-xs rounded-3xl p-6 space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-foreground">Variedad en tus Comidas</h3>
                <p className="text-xs text-muted-foreground">
                  ¿Cuánta diversidad te gustaría en tus menúes cotidianos?
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    id: "mucha",
                    title: "Mucha variedad",
                    desc: "Ideal si te gusta preparar diferentes platos todos los días.",
                  },
                  {
                    id: "moderada",
                    title: "Variedad moderada",
                    desc: "Buena si te gusta repetir platos pero quieres algo de variedad.",
                  },
                  {
                    id: "poca",
                    title: "Poca variedad",
                    desc: "Perfecta para facilitar la planificación y compra de supermercado.",
                  },
                ].map((v) => {
                  const isSelected = variety === v.id;
                  return (
                    <button
                      type="button"
                      key={v.id}
                      onClick={() => setVariety(v.id as any)}
                      className={cn(
                        "w-full p-3 rounded-2xl border text-left transition cursor-pointer space-y-0.5",
                        isSelected
                          ? "border-foreground bg-accent text-foreground font-bold"
                          : "border-border/60 hover:border-border text-muted-foreground",
                      )}
                    >
                      <div className="text-xs font-bold text-foreground">{v.title}</div>
                      <p className="text-[11px] text-muted-foreground">{v.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4. ALIMENTOS DISPONIBLES EN ALACENA (POR CATEGORÍAS) */}
          <div className="border border-border bg-card shadow-xs rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-4">
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Wheat className="w-4 h-4 text-amber-500" /> Selecciona tus Alimentos Disponibles
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Tus sugerencias dependerán exclusivamente de las elecciones que marques aquí.
                </p>
              </div>
              <Badge variant="outline" className="text-xs font-bold self-start sm:self-auto">
                {selectedFoods.length} alimentos activos
              </Badge>
            </div>

            <div className="space-y-6">
              {FOOD_CATEGORIES.map((cat) => {
                const categorySelectedCount = cat.items.filter((i) =>
                  selectedFoods.includes(i),
                ).length;
                const allSelected = categorySelectedCount === cat.items.length;

                return (
                  <div
                    key={cat.id}
                    className="space-y-2.5 border-b border-border/30 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground/90">
                        {cat.name} ({categorySelectedCount}/{cat.items.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleCategoryFoods(cat.items)}
                        className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                      >
                        {allSelected ? "Desmarcar todos" : "Seleccionar todos"}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {cat.items.map((item) => {
                        const isChecked = selectedFoods.includes(item);
                        return (
                          <button
                            type="button"
                            key={item}
                            onClick={() => toggleFood(item)}
                            className={cn(
                              "px-2.5 py-1.5 rounded-xl border text-[11px] font-medium transition cursor-pointer select-none",
                              isChecked
                                ? "border-foreground/80 bg-foreground text-background font-semibold"
                                : "border-border/60 hover:border-border text-muted-foreground/80 bg-background/50",
                            )}
                          >
                            {isChecked ? `✓ ${item}` : item}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="submit"
              size="default"
              className="rounded-xl font-bold flex-1 sm:flex-initial"
            >
              Guardar Preferencias Alimenticias
            </Button>
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={() => setSubView("main")}
              className="rounded-xl font-semibold"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // SUB-SCREEN 3: CONFIGURACIÓN DE LA APLICACIÓN
  if (subView === "app-settings") {
    return (
      <div className="space-y-6 max-w-2xl pb-12 animate-fade-in">
        <button
          type="button"
          onClick={() => setSubView("main")}
          className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Volver a Configuración
        </button>

        <div>
          <h2 className="text-2xl font-bold tracking-tight">Configuración de la Aplicación</h2>
          <p className="text-sm text-muted-foreground">
            Personaliza el tema visual, idioma y tus notificaciones de recordatorios.
          </p>
        </div>

        <form
          onSubmit={handleSaveAppSettings}
          className="space-y-6 border border-border bg-card shadow-xs rounded-3xl p-6 sm:p-8"
        >
          {/* Tema visual */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground block">Tema de Interfaz</label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={cn(
                  "flex flex-col items-center justify-center p-3.5 rounded-2xl border text-xs font-medium transition-all cursor-pointer space-y-1.5",
                  theme === "light"
                    ? "border-foreground bg-accent text-foreground font-bold shadow-xs"
                    : "border-border/60 hover:border-border text-muted-foreground",
                )}
              >
                <Sun className="w-4 h-4" />
                <span>Claro</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={cn(
                  "flex flex-col items-center justify-center p-3.5 rounded-2xl border text-xs font-medium transition-all cursor-pointer space-y-1.5",
                  theme === "dark"
                    ? "border-foreground bg-accent text-foreground font-bold shadow-xs"
                    : "border-border/60 hover:border-border text-muted-foreground",
                )}
              >
                <Moon className="w-4 h-4" />
                <span>Oscuro</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme("system")}
                className={cn(
                  "flex flex-col items-center justify-center p-3.5 rounded-2xl border text-xs font-medium transition-all cursor-pointer space-y-1.5",
                  theme === "system"
                    ? "border-foreground bg-accent text-foreground font-bold shadow-xs"
                    : "border-border/60 hover:border-border text-muted-foreground",
                )}
              >
                <Smartphone className="w-4 h-4" />
                <span>Sistema</span>
              </button>
            </div>
          </div>

          {/* Idioma */}
          <div className="space-y-1.5 pt-2 border-t border-border/40">
            <label className="text-xs font-semibold text-foreground block">
              Idioma de Preferencia
            </label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full rounded-xl h-11">
                <SelectValue placeholder="Selecciona idioma" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="es">Español (Latinoamérica)</SelectItem>
                <SelectItem value="en">English (US)</SelectItem>
                <SelectItem value="pt">Português (Brasil)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Switch Recordatorios */}
          <div className="space-y-2 pt-2 border-t border-border/40">
            <label className="text-xs font-semibold text-foreground block">Notificaciones</label>
            <div className="flex items-center justify-between p-4 rounded-2xl border border-border/60 bg-muted/20">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-foreground">Recordatorios</div>
                <div className="text-[11px] text-muted-foreground">
                  Alertas y avisos de tus clases, reservas e hidratación.
                </div>
              </div>
              <Switch checked={reminders} onCheckedChange={setReminders} />
            </div>
          </div>

          {/* Sensor de Movimiento (Shake AI) */}
          <div className="space-y-2 pt-2 border-t border-border/40">
            <label className="text-xs font-semibold text-foreground block">
              Sensor de Movimiento
            </label>
            <div className="flex items-center justify-between p-4 rounded-2xl border border-border/60 bg-muted/20">
              <div className="space-y-0.5 max-w-[78%]">
                <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" /> Shake AI (Gesto de agitar iPhone)
                </div>
                <div className="text-[11px] text-muted-foreground leading-relaxed">
                  Permite agitar tu dispositivo para consultar al AI Coach. Solicita permiso
                  explícito de acelerómetro en iOS.
                </div>
              </div>
              <Switch checked={motionSensorEnabled} onCheckedChange={handleToggleMotionSensor} />
            </div>
          </div>

          {/* Zona de Peligro: Eliminar Cuenta */}
          <div className="space-y-2 pt-4 border-t border-rose-500/20">
            <label className="text-[11px] font-bold text-rose-500 block uppercase tracking-wider">
              Zona de Peligro
            </label>
            <div className="p-4 rounded-2xl border border-rose-500/30 bg-rose-500/5 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-rose-600 dark:text-rose-400">
                  Eliminar cuenta permanentemente
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Borrará definitivamente tus datos biológicos, historial y créditos.
                </div>
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => setDeleteAccountModalOpen(true)}
                className="rounded-xl font-bold text-xs shrink-0"
              >
                Eliminar cuenta
              </Button>
            </div>
          </div>
          <div className="pt-4 flex items-center gap-3">
            <Button
              type="submit"
              size="default"
              className="rounded-xl font-bold flex-1 sm:flex-initial"
            >
              Guardar Configuración
            </Button>
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={() => setSubView("main")}
              className="rounded-xl font-semibold"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // MAIN SCREEN: PERFIL / PROGRESO (EXACT REPLICA DE LA IMAGEN DE REFERENCIA CON SHADCN/UI)
  return (
    <div className="space-y-4 sm:space-y-5 max-w-md mx-auto pb-28 pt-2 animate-fade-in relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        accept="image/*"
        className="hidden"
      />

      {/* 1. ENCABEZADO: PROGRESS */}
      <div className="flex items-center justify-between px-1">
        <h1 className="text-3xl font-black tracking-tight text-foreground">Progress</h1>
        <button
          type="button"
          onClick={() => setSettingsModalOpen(true)}
          className="w-10 h-10 rounded-full border border-border/80 bg-card hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition shadow-2xs cursor-pointer active:scale-95"
          title="Ajustes y Configuración"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* 2. TOP 2 METRIC CARDS (GRID SIMÉTRICO: LAST WEIGHT & DAYS LOGGED) */}
      <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
        {/* TARJETA 1: LAST WEIGHT */}
        <button
          type="button"
          onClick={() => setLogWeightModalOpen(true)}
          className="rounded-3xl border border-border bg-card p-4 sm:p-5 shadow-xs flex flex-col items-center justify-between text-center min-h-[168px] hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer group w-full"
        >
          {/* Circular Gauge */}
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r="34"
                stroke="hsl(var(--secondary))"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="40"
                cy="40"
                r="34"
                stroke="hsl(var(--foreground))"
                strokeWidth="6"
                strokeDasharray="213.6"
                strokeDashoffset="64"
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-9 h-9 rounded-full bg-secondary/80 flex items-center justify-center text-foreground group-hover:scale-110 transition-transform">
                <Scale className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="space-y-0.5 mt-2">
            <span className="text-xs font-semibold text-muted-foreground block">Last weight</span>
            <span className="text-lg sm:text-xl font-black text-foreground tracking-tight block">
              {units === "imperial" ? `${Math.round(Number(weight) * 2.20462)} lbs` : "245 lbs"}
            </span>
          </div>
        </button>

        {/* TARJETA 2: DAYS LOGGED */}
        <button
          type="button"
          onClick={() => setCheatDaysModalOpen(true)}
          className="rounded-3xl border border-border bg-card p-4 sm:p-5 shadow-xs flex flex-col items-center justify-between text-center min-h-[168px] hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer group w-full"
        >
          {/* Circular Gauge */}
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r="34"
                stroke="hsl(var(--secondary))"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="40"
                cy="40"
                r="34"
                stroke="hsl(var(--foreground))"
                strokeWidth="6"
                strokeDasharray="213.6"
                strokeDashoffset="60"
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700"
              />
              <circle
                cx="40"
                cy="40"
                r="34"
                stroke="#6366f1"
                strokeWidth="6"
                strokeDasharray="213.6"
                strokeDashoffset="165"
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-9 h-9 rounded-full bg-secondary/80 flex items-center justify-center text-foreground group-hover:scale-110 transition-transform">
                <Apple className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="space-y-1 mt-2 w-full flex flex-col items-center">
            <span className="text-xs font-semibold text-muted-foreground block">Days logged</span>
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              <span className="text-sm sm:text-base font-black text-foreground tracking-tight">
                5 logged
              </span>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-bold text-[10px] border border-indigo-500/20 shadow-2xs">
                {cheatCount} Cheat <Pencil className="w-2.5 h-2.5 ml-0.5" />
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* 3. TIME PERIOD SELECTOR (SEGMENTED BAR: 90 DAYS / 6 MONTHS / 1 YEAR / ALL TIME) */}
      <div className="p-1 rounded-2xl bg-secondary/50 border border-border/50 grid grid-cols-4 text-center select-none shadow-2xs">
        {[
          { id: "90_days", label: "90 Days" },
          { id: "6_months", label: "6 Months" },
          { id: "1_year", label: "1 Year" },
          { id: "all_time", label: "All time" },
        ].map((period) => {
          const isActive = timePeriod === period.id;
          return (
            <button
              key={period.id}
              type="button"
              onClick={() => setTimePeriod(period.id as any)}
              className={cn(
                "py-2 text-xs sm:text-sm rounded-xl transition-all cursor-pointer",
                isActive
                  ? "bg-card text-foreground font-bold shadow-xs border border-border/40"
                  : "text-muted-foreground hover:text-foreground font-medium",
              )}
            >
              {period.label}
            </button>
          );
        })}
      </div>

      {/* 4. GOAL PROGRESS CARD (MAIN CHART CARD) */}
      <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-4 hover:-translate-y-0.5 transition-all">
        {/* Encabezado: Goal Progress + Badge */}
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base sm:text-lg font-extrabold text-foreground tracking-tight">
            Goal Progress
          </h2>
          <button
            type="button"
            onClick={() => setEditGoalModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/80 hover:bg-secondary border border-border/60 text-xs font-bold text-foreground transition cursor-pointer active:scale-95 shadow-2xs"
          >
            <Flag className="w-3 h-3 text-foreground" />
            <span>{goalPercent}% of goal done</span>
            <Pencil className="w-3 h-3 text-muted-foreground ml-0.5" />
          </button>
        </div>

        {/* Gráfico de Evolución con Curva Suave & Marcadores */}
        <div className="h-60 sm:h-64 w-full relative pt-2">
          <ChartContainer
            config={{
              weight: { label: "Logged (kg)", color: "#22c55e" },
              projected: { label: "Projected (kg)", color: "hsl(var(--foreground))" },
            }}
            className="h-full w-full"
          >
            <AreaChart
              data={[
                { day: "Sat", weight: 61.0, projected: null, fullDate: "19 Oct 2024" },
                { day: "Sun", weight: 64.6, projected: null, fullDate: "20 Oct 2024" },
                { day: "Mon", weight: 63.1, projected: null, fullDate: "21 Oct 2024" },
                { day: "Tue", weight: 67.5, projected: null, fullDate: "22 Oct 2024" },
                {
                  day: "Wed",
                  weight: 72.0,
                  projected: 72.0,
                  isCurrent: true,
                  fullDate: "21 Oct 2024",
                },
                { day: "Thu", weight: null, projected: 74.2, fullDate: "22 Oct 2024 (Est.)" },
                { day: "Fri", weight: null, projected: 78.4, fullDate: "23 Oct 2024 (Meta)" },
              ]}
              margin={{ top: 38, right: 12, left: -22, bottom: 0 }}
            >
              <defs>
                <linearGradient id="goalProgressGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.22} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--border))"
                opacity={0.65}
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11, fontWeight: 500 }}
              />
              <YAxis
                domain={[60, 80]}
                ticks={[60, 65, 70, 75, 80]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    const val = payload[0].value;
                    return (
                      <div className="bg-slate-900 text-white dark:bg-card dark:text-foreground border border-border/80 shadow-2xl rounded-2xl px-3 py-2 text-center -translate-y-2 pointer-events-none z-30">
                        <span className="text-xs sm:text-sm font-extrabold block leading-tight">
                          {val} Kg
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-muted-foreground block font-medium mt-0.5">
                          {item.fullDate}
                        </span>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {/* Curva Histórica de Peso Logeado */}
              <Area
                type="monotone"
                dataKey="weight"
                stroke="#22c55e"
                strokeWidth={2.5}
                fill="url(#goalProgressGrad)"
                dot={(props: any) => {
                  if (props.payload.isCurrent) {
                    return (
                      <circle
                        key={props.key}
                        cx={props.cx}
                        cy={props.cy}
                        r={5}
                        fill="#22c55e"
                        stroke="#ffffff"
                        strokeWidth={2.5}
                        className="shadow-md"
                      />
                    );
                  }
                  return <React.Fragment key={props.key} />;
                }}
              />
              {/* Proyección a Futuro */}
              <Area
                type="monotone"
                dataKey="projected"
                stroke="hsl(var(--foreground))"
                strokeWidth={2}
                fill="transparent"
              />
            </AreaChart>
          </ChartContainer>

          {/* Tooltip flotante estático sobre el día miércoles como en la imagen */}
          <div className="absolute top-1 left-[67%] -translate-x-1/2 pointer-events-none">
            <div className="bg-slate-900 text-white dark:bg-card dark:text-foreground border border-border shadow-xl rounded-2xl px-3 py-1.5 text-center">
              <span className="text-xs font-black block leading-none">68.2 Kg</span>
              <span className="text-[10px] text-slate-400 dark:text-muted-foreground font-medium block mt-0.5">
                21 Oct 2024
              </span>
            </div>
          </div>
        </div>

        {/* Mensaje Motivacional en Banner Verde Suave */}
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
            Great job! Consistency is key, and you&apos;re mastering it!
          </p>
        </div>
      </div>

      {/* 5. FLOATING ACTION BUTTON (+) */}
      <button
        type="button"
        onClick={() => setQuickLogModalOpen(true)}
        className="fixed bottom-24 right-6 md:bottom-10 md:right-10 z-40 w-14 h-14 rounded-full bg-slate-900 text-white dark:bg-foreground dark:text-background flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
        title="Registrar Peso / Cheat / Meta"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* MODAL: LOG WEIGHT */}
      <Dialog open={logWeightModalOpen} onOpenChange={setLogWeightModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6 border border-border bg-card">
          <DialogHeader className="pb-3 border-b border-border/40">
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-foreground">
              <Scale className="w-5 h-5 text-emerald-500" /> Registrar Peso Actual
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Mantén actualizado tu progreso corporal diario.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Peso ({units === "imperial" ? "lbs" : "kg"})
              </label>
              <input
                type="number"
                step="0.1"
                value={newWeightInput}
                onChange={(e) => setNewWeightInput(e.target.value)}
                placeholder="72.4"
                className="w-full px-4 py-3 rounded-2xl bg-secondary border border-border font-extrabold text-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-2">
              {[68.0, 70.5, 72.4, 75.0].map((quickVal) => (
                <button
                  key={quickVal}
                  type="button"
                  onClick={() => setNewWeightInput(quickVal.toString())}
                  className="flex-1 py-1.5 rounded-xl bg-secondary/70 hover:bg-secondary text-xs font-bold text-muted-foreground hover:text-foreground border border-border/40 transition"
                >
                  {quickVal} kg
                </button>
              ))}
            </div>
          </div>
          <div className="pt-3 border-t border-border/40 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setLogWeightModalOpen(false)}
              className="rounded-xl font-semibold"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setWeight(newWeightInput);
                setLogWeightModalOpen(false);
                toast.success(`Peso actualizado a ${newWeightInput} kg`);
              }}
              className="rounded-xl font-bold bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              Guardar Peso
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL: CHEAT DAYS */}
      <Dialog open={cheatDaysModalOpen} onOpenChange={setCheatDaysModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6 border border-border bg-card">
          <DialogHeader className="pb-3 border-b border-border/40">
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-foreground">
              <Apple className="w-5 h-5 text-indigo-500" /> Registro de Días / Comidas Libres
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Registra comidas libres (cheat meals) dentro de tu plan nutricional.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/50 border border-border">
              <div>
                <span className="text-xs font-bold text-foreground block">
                  Cheat Meals esta semana
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Permitidos recomendados: 2 por semana
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCheatCount(Math.max(0, cheatCount - 1))}
                  className="w-8 h-8 rounded-xl bg-card border border-border flex items-center justify-center text-foreground font-bold hover:bg-secondary transition"
                >
                  -
                </button>
                <span className="text-base font-black text-foreground w-6 text-center">
                  {cheatCount}
                </span>
                <button
                  type="button"
                  onClick={() => setCheatCount(cheatCount + 1)}
                  className="w-8 h-8 rounded-xl bg-card border border-border flex items-center justify-center text-foreground font-bold hover:bg-secondary transition"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div className="pt-3 border-t border-border/40 flex justify-end">
            <Button
              onClick={() => {
                setCheatDaysModalOpen(false);
                toast.success(`Días libres actualizados: ${cheatCount}`);
              }}
              className="rounded-xl font-bold"
            >
              Listo
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL: EDIT GOAL */}
      <Dialog open={editGoalModalOpen} onOpenChange={setEditGoalModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6 border border-border bg-card">
          <DialogHeader className="pb-3 border-b border-border/40">
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-foreground">
              <Flag className="w-5 h-5 text-amber-500" /> Ajustar Meta de Progreso
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Ajusta el porcentaje completado de tu objetivo actual.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-foreground">
                <span>Progreso Alcanzado</span>
                <span className="text-emerald-500 font-extrabold">{goalPercent}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={goalPercent}
                onChange={(e) => setGoalPercent(parseInt(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg cursor-pointer accent-emerald-500"
              />
            </div>
          </div>
          <div className="pt-3 border-t border-border/40 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setEditGoalModalOpen(false)}
              className="rounded-xl font-semibold"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setEditGoalModalOpen(false);
                toast.success(`Meta actualizada al ${goalPercent}%`);
              }}
              className="rounded-xl font-bold bg-primary text-primary-foreground"
            >
              Guardar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL: QUICK ACTION MENU (+) */}
      <Dialog open={quickLogModalOpen} onOpenChange={setQuickLogModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6 border border-border bg-card">
          <DialogHeader className="pb-3 border-b border-border/40">
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-foreground">
              <Plus className="w-5 h-5 text-foreground" /> Registro Rápido
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Selecciona la acción que deseas registrar hoy.
            </DialogDescription>
          </DialogHeader>
          <div className="py-3 space-y-2.5">
            {/* Shake for AI Hero Button */}
            <button
              type="button"
              onClick={() => {
                setQuickLogModalOpen(false);
                if (typeof window !== "undefined") {
                  const url = new URL(window.location.href);
                  url.searchParams.set("tab", "diario");
                  window.history.pushState({}, "", url.toString());
                }
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-primary/10 to-purple-500/5 hover:from-purple-500/20 hover:to-primary/20 transition-all border border-primary/30 text-left group cursor-pointer shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-foreground block">
                      Shake & Build AI
                    </span>
                    <Badge className="bg-primary text-white text-[9px] font-extrabold px-1.5 py-0 h-4">
                      MOTOR 3 BLOQUES
                    </Badge>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    Sugerencia nutricional contextual o agita tu móvil
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-0.5 transition" />
            </button>

            <button
              type="button"
              onClick={() => {
                setQuickLogModalOpen(false);
                setLogWeightModalOpen(true);
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-secondary/50 hover:bg-secondary transition border border-border text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-foreground block">Registrar Peso</span>
                  <span className="text-[10px] text-muted-foreground">
                    Actualiza tu peso corporal de hoy
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition" />
            </button>

            <button
              type="button"
              onClick={() => {
                setQuickLogModalOpen(false);
                setCheatDaysModalOpen(true);
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-secondary/50 hover:bg-secondary transition border border-border text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                  <Apple className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-foreground block">
                    Anotar Cheat Day / Comida Libre
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Registra un día o comida libre
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition" />
            </button>

            <button
              type="button"
              onClick={() => {
                setQuickLogModalOpen(false);
                setEditGoalModalOpen(true);
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-secondary/50 hover:bg-secondary transition border border-border text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Flag className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-foreground block">Actualizar Meta</span>
                  <span className="text-[10px] text-muted-foreground">
                    Modifica tu objetivo de porcentaje
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition" />
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL: SHAKE & BUILD (MOTOR 3 BLOQUES) */}

      {/* ========================================================================= */}
      {/* POPUP MODAL: AJUSTES & CONFIGURACIÓN (ABIERTO AL PRESIONAR LA TUERCA ⚙) */}
      {/* ========================================================================= */}
      <Dialog open={settingsModalOpen} onOpenChange={setSettingsModalOpen}>
        <DialogContent className="sm:max-w-lg rounded-3xl p-5 sm:p-7 border border-border bg-card max-h-[85vh] overflow-y-auto custom-scrollbar">
          <DialogHeader className="pb-3 border-b border-border/40">
            <DialogTitle className="text-base font-bold flex items-center gap-2.5 text-foreground">
              <Settings className="w-5 h-5 text-primary" /> Ajustes & Configuración
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Gestiona tus datos personales, preferencias de IA y opciones de cuenta.
            </DialogDescription>
          </DialogHeader>

          <div className="py-2 space-y-5">
            {/* GRUPO 1: OPCIONES DE CUENTA */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 px-1">
                Opciones de Cuenta
              </div>
              <div className="rounded-2xl border border-border bg-secondary/30 overflow-hidden divide-y divide-border/40">
                {/* DATOS BIOLÓGICOS */}
                <button
                  type="button"
                  onClick={() => {
                    setSettingsModalOpen(false);
                    setSubView("edit-profile");
                  }}
                  className="w-full flex items-center justify-between p-3 sm:p-3.5 hover:bg-secondary/60 transition cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                        Datos Biológicos & Perfil
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        Edad, sexo, altura, peso y objetivo.
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-foreground group-hover:translate-x-0.5 transition shrink-0" />
                </button>

                {/* PREFERENCIAS ALIMENTICIAS */}
                <button
                  type="button"
                  onClick={() => {
                    setSettingsModalOpen(false);
                    setSubView("diet-preferences");
                  }}
                  className="w-full flex items-center justify-between p-3 sm:p-3.5 hover:bg-secondary/60 transition cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Utensils className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground group-hover:text-emerald-500 transition-colors">
                        Preferencias Nutricionales & Alacena
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        Tipo de dieta, comidas al día y alimentos activos.
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-foreground group-hover:translate-x-0.5 transition shrink-0" />
                </button>

                {/* AJUSTES DE LA APP */}
                <button
                  type="button"
                  onClick={() => {
                    setSettingsModalOpen(false);
                    setSubView("app-settings");
                  }}
                  className="w-full flex items-center justify-between p-3 sm:p-3.5 hover:bg-secondary/60 transition cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
                      <Settings className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground group-hover:text-sky-500 transition-colors">
                        Ajustes de la Aplicación
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        Tema visual, acelerómetro Shake AI y notificaciones.
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-foreground group-hover:translate-x-0.5 transition shrink-0" />
                </button>

                {/* MEMBRESÍA & PAGOS */}
                <button
                  type="button"
                  onClick={() => {
                    setSettingsModalOpen(false);
                    navigate({ to: "/app", search: { tab: "pagos" } });
                  }}
                  className="w-full flex items-center justify-between p-3 sm:p-3.5 hover:bg-secondary/60 transition cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground group-hover:text-amber-500 transition-colors">
                        Membresía & Pagos
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        Pase mensual, comprobantes y facturación.
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-foreground group-hover:translate-x-0.5 transition shrink-0" />
                </button>
              </div>
            </div>

            {/* GRUPO 2: INFORMACIÓN & LEGAL */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 px-1">
                Información & Legal
              </div>
              <div className="rounded-2xl border border-border bg-secondary/30 overflow-hidden divide-y divide-border/40">
                {/* POLÍTICAS DE PRIVACIDAD */}
                <button
                  type="button"
                  onClick={() => {
                    setSettingsModalOpen(false);
                    setPrivacyModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-3 sm:p-3.5 hover:bg-secondary/60 transition cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-foreground group-hover:text-purple-500 transition-colors">
                      Políticas de Privacidad
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-foreground group-hover:translate-x-0.5 transition shrink-0" />
                </button>

                {/* TÉRMINOS Y CONDICIONES */}
                <button
                  type="button"
                  onClick={() => {
                    setSettingsModalOpen(false);
                    setTermsModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-3 sm:p-3.5 hover:bg-secondary/60 transition cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-foreground group-hover:text-amber-500 transition-colors">
                      Términos y Condiciones
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-foreground group-hover:translate-x-0.5 transition shrink-0" />
                </button>

                {/* CONTACTAR CON SHAKERFY */}
                <button
                  type="button"
                  onClick={() => {
                    setSettingsModalOpen(false);
                    setContactModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-3 sm:p-3.5 hover:bg-secondary/60 transition cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-foreground group-hover:text-teal-500 transition-colors">
                      Contactar con Shakerfy
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-foreground group-hover:translate-x-0.5 transition shrink-0" />
                </button>

                {/* CERRAR SESIÓN */}
                <button
                  type="button"
                  onClick={() => {
                    setSettingsModalOpen(false);
                    setLogoutModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-3 sm:p-3.5 hover:bg-rose-500/10 transition cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-500 flex items-center justify-center shrink-0">
                      <LogOut className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-rose-600 dark:text-rose-400">
                      Cerrar sesión
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-rose-400 group-hover:translate-x-0.5 transition shrink-0" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-border/40 flex justify-end">
            <Button
              variant="outline"
              onClick={() => setSettingsModalOpen(false)}
              className="rounded-xl font-bold text-xs"
            >
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL: POLÍTICAS DE PRIVACIDAD */}
      <Dialog open={privacyModalOpen} onOpenChange={setPrivacyModalOpen}>
        <DialogContent className="sm:max-w-lg rounded-3xl p-6 sm:p-8 border border-border bg-card">
          <DialogHeader className="pb-3 border-b border-border/40">
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-foreground">
              <Shield className="w-5 h-5 text-purple-500" /> Políticas de Privacidad
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-3 text-xs text-muted-foreground leading-relaxed max-h-[55vh] overflow-y-auto custom-scrollbar">
            <p className="font-semibold text-foreground">
              En Shakerfy nos tomamos tu privacidad y la seguridad de tus datos biológicos con
              máxima seriedad.
            </p>
            <p>
              1. <strong>Protección de Datos Biométricos:</strong> Toda tu información de peso,
              altura, frecuencia de comidas y entrenamientos se almacena de forma encriptada
              localmente y nunca se vende a terceros.
            </p>
            <p>
              2. <strong>Uso de Inteligencia Artificial:</strong> Las consultas enviadas al AI Coach
              se procesan de forma anónima para generar recomendaciones nutricionales y deportivas
              sin vincular datos personales identificables.
            </p>
            <p>
              3. <strong>Derecho de Cancelación:</strong> Puedes solicitar en cualquier momento la
              eliminación total de tus métricas y registros de la plataforma.
            </p>
          </div>
          <div className="pt-3 border-t border-border/40 flex justify-end">
            <Button onClick={() => setPrivacyModalOpen(false)} className="rounded-xl font-bold">
              Entendido
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL: TÉRMINOS Y CONDICIONES */}
      <Dialog open={termsModalOpen} onOpenChange={setTermsModalOpen}>
        <DialogContent className="sm:max-w-lg rounded-3xl p-6 sm:p-8 border border-border bg-card">
          <DialogHeader className="pb-3 border-b border-border/40">
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-foreground">
              <FileDown className="w-5 h-5 text-amber-500" /> Términos y Condiciones
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-3 text-xs text-muted-foreground leading-relaxed max-h-[55vh] overflow-y-auto custom-scrollbar">
            <p className="font-semibold text-foreground">
              Al utilizar la plataforma Shakerfy y el motor AI Coach, aceptas los siguientes
              términos de servicio:
            </p>
            <p>
              1. <strong>Alcance Informativo:</strong> El AI Coach brinda sugerencias de nutrición
              deportiva general y hábitos saludables. No constituye asesoramiento médico ni
              prescripción dietoterápica clínica.
            </p>
            <p>
              2. <strong>Uso Personal e Intransferible:</strong> Tu cuenta y tus reservas en centros
              asociados (gimnasios, pases y clases) son personales.
            </p>
            <p>
              3. <strong>Políticas de Reserva:</strong> Las cancelaciones de clases se rigen por la
              anticipación mínima definida por cada centro deportivo registrado.
            </p>
          </div>
          <div className="pt-3 border-t border-border/40 flex justify-end">
            <Button onClick={() => setTermsModalOpen(false)} className="rounded-xl font-bold">
              Aceptar Términos
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL: CONTACTAR CON SHAKERFY */}
      <Dialog open={contactModalOpen} onOpenChange={setContactModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6 sm:p-8 border border-border bg-card text-center">
          <DialogHeader className="pb-3 border-b border-border/40">
            <DialogTitle className="text-base font-bold flex items-center justify-center gap-2 text-foreground">
              <MessageSquare className="w-5 h-5 text-teal-500" /> Contactar con Shakerfy
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4 text-xs">
            <p className="text-muted-foreground">
              ¿Tienes alguna consulta o necesitas ayuda con tus clases, pagos o el AI Coach?
            </p>

            <div className="grid grid-cols-1 gap-2.5">
              <a
                href="https://wa.me/5491132421241"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition shadow-xs"
              >
                <Smartphone className="w-4 h-4" /> WhatsApp Oficial de Soporte
              </a>

              <a
                href="mailto:soporte@shakerfy.com"
                className="flex items-center justify-center gap-2 p-3.5 rounded-2xl border border-border bg-background font-semibold hover:bg-secondary transition text-foreground"
              >
                <Info className="w-4 h-4 text-indigo-500" /> Email: soporte@shakerfy.com
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL: CONFIRMACIÓN CERRAR SESIÓN */}
      <AlertDialog open={logoutModalOpen} onOpenChange={setLogoutModalOpen}>
        <AlertDialogContent className="rounded-3xl p-6 sm:p-8 border border-border bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
              <LogOut className="w-5 h-5 text-rose-500" /> ¿Cerrar sesión?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground pt-1">
              Tendrás que volver a ingresar tus credenciales para acceder a tus reservas, rutinas y
              el AI Coach.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-4 gap-2">
            <AlertDialogCancel className="rounded-xl font-semibold">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="rounded-xl bg-rose-500 hover:bg-rose-600 font-bold text-white"
            >
              Sí, cerrar sesión
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* MODAL: CONFIRMACIÓN ELIMINAR CUENTA */}
      <AlertDialog open={deleteAccountModalOpen} onOpenChange={setDeleteAccountModalOpen}>
        <AlertDialogContent className="rounded-3xl p-6 sm:p-8 border border-rose-500/30 bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold text-rose-500 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" /> ¿Eliminar cuenta de Shakerfy?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground pt-1 leading-relaxed">
              Esta acción es <strong>definitiva e irreversible</strong>. Se borrarán de manera
              permanente tus datos personales, historial de clases, preferencias de nutrición y
              registro con el AI Coach.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-4 gap-2">
            <AlertDialogCancel className="rounded-xl font-semibold">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setDeleteAccountModalOpen(false);
                toast.success("Tu cuenta ha sido eliminada correctamente");
                navigate({ to: "/" });
              }}
              className="rounded-xl bg-rose-600 hover:bg-rose-700 font-bold text-white"
            >
              Sí, eliminar mi cuenta
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Subcomponent: QR Scanner Modal for Reception Check-in
function QRScannerModal({
  onClose,
  onScanSuccess,
}: {
  onClose: () => void;
  onScanSuccess: (data: {
    club: string;
    activityType: "gym_session" | "class";
    className?: string;
    instructor?: string;
    durationMinutes?: number;
    baseMets: number;
  }) => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedClubName, setScannedClubName] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: "environment" } })
      .then((s) => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          videoRef.current.play();
          setCameraActive(true);
        }
      })
      .catch((err) => {
        console.warn("Camera access not available or denied:", err);
        setCameraError(
          "Cámara no disponible en este dispositivo. Puedes usar los accesos de prueba o el código manual.",
        );
      });

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleQuickScan = (preset: "kraft" | "yoga" | "crossfit") => {
    if (isScanning) return;
    setIsScanning(true);

    let payload: {
      club: string;
      activityType: "gym_session" | "class";
      className?: string;
      instructor?: string;
      durationMinutes?: number;
      baseMets: number;
    } = {
      club: "Kraft Strength Club",
      activityType: "gym_session",
      baseMets: 150,
      durationMinutes: 45,
    };

    if (preset === "kraft") {
      setScannedClubName("Kraft Strength Club");
      payload = {
        club: "Kraft Strength Club",
        activityType: "gym_session",
        baseMets: 150,
        durationMinutes: 45,
      };
    } else if (preset === "yoga") {
      setScannedClubName("FitFlow Studio");
      payload = {
        club: "FitFlow Studio",
        activityType: "class",
        className: "Yoga Vinyasa Flow",
        instructor: "Valeria Soto",
        durationMinutes: 50,
        baseMets: 130,
      };
    } else if (preset === "crossfit") {
      setScannedClubName("Box Central");
      payload = {
        club: "Box Central",
        activityType: "class",
        className: "CrossFit WOD",
        instructor: "Mateo Rossi",
        durationMinutes: 50,
        baseMets: 220,
      };
    }

    setTimeout(() => {
      onScanSuccess(payload);
    }, 450);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = manualCode.toUpperCase().trim();
    if (!code) return;
    if (code.includes("YOGA") || code.includes("FITFLOW")) {
      handleQuickScan("yoga");
    } else if (code.includes("CROSS") || code.includes("BOX")) {
      handleQuickScan("crossfit");
    } else {
      handleQuickScan("kraft");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-card border border-border w-full max-w-md rounded-3xl p-6 overflow-hidden shadow-2xl flex flex-col items-center text-center">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-secondary transition text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-3">
          <QrCode className="w-6 h-6 text-foreground" />
        </div>

        <h3 className="text-lg font-black tracking-tight text-foreground">
          Escanear QR de Recepción
        </h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-xs">
          Apunta la cámara al código QR de la entrada o tótem del club para validar tu acceso.
        </p>

        {/* Video / Camera Viewfinder */}
        <div className="relative w-full max-w-[280px] aspect-square rounded-2xl overflow-hidden bg-black my-5 border-2 border-dashed border-border flex items-center justify-center">
          {cameraActive ? (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
              autoPlay
            />
          ) : (
            <div className="p-4 text-center space-y-2">
              <QrCode className="w-16 h-16 text-muted-foreground/40 mx-auto animate-pulse" />
              <p className="text-[11px] text-muted-foreground">
                {cameraError || "Iniciando visor óptico..."}
              </p>
            </div>
          )}

          {/* Laser Scanner Overlay Box */}
          <div className="absolute inset-4 border-2 border-foreground/80 rounded-xl pointer-events-none flex flex-col justify-between p-2">
            <div className="w-full h-0.5 bg-emerald-500 shadow-[0_0_8px_#10b981] animate-bounce" />
            <div className="flex justify-between text-[10px] text-foreground/80 font-mono">
              <span>SCAN</span>
              <span>QR READY</span>
            </div>
          </div>

          {/* Validation Feedback Overlay */}
          {isScanning && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center text-white z-20 animate-in fade-in duration-150 p-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center shadow-xl mb-2.5 animate-in zoom-in-75 duration-200">
                <Check className="w-8 h-8 text-white stroke-[3]" />
              </div>
              <span className="text-xs font-bold text-emerald-300">✓ Acceso Validado</span>
              <span className="text-[11px] text-zinc-300 mt-0.5 font-medium truncate max-w-full">
                {scannedClubName}
              </span>
            </div>
          )}
        </div>

        {/* Quick Testing Presets */}
        <div className="w-full space-y-2 text-left">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block text-center">
            Accesos Rápidos de Prueba
          </label>
          <div className="grid grid-cols-1 gap-1.5">
            <button
              type="button"
              disabled={isScanning}
              onClick={() => handleQuickScan("kraft")}
              className="w-full p-2.5 rounded-xl border border-border/80 bg-secondary/30 hover:bg-secondary/70 hover:border-foreground/30 transition flex items-center justify-between text-xs font-semibold text-foreground cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <Dumbbell className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Kraft Strength Club (Musculación)</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            </button>

            <button
              type="button"
              disabled={isScanning}
              onClick={() => handleQuickScan("yoga")}
              className="w-full p-2.5 rounded-xl border border-border/80 bg-secondary/30 hover:bg-secondary/70 hover:border-foreground/30 transition flex items-center justify-between text-xs font-semibold text-foreground cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
                <span>FitFlow Studio (Yoga Vinyasa 50 min)</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            </button>

            <button
              type="button"
              disabled={isScanning}
              onClick={() => handleQuickScan("crossfit")}
              className="w-full p-2.5 rounded-xl border border-border/80 bg-secondary/30 hover:bg-secondary/70 hover:border-foreground/30 transition flex items-center justify-between text-xs font-semibold text-foreground cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Box Central (CrossFit WOD 50 min)</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Manual Code Input Form */}
        <form
          onSubmit={handleManualSubmit}
          className="w-full flex items-center gap-2 mt-4 pt-3 border-t border-border/50"
        >
          <input
            type="text"
            placeholder="O ingresa código (ej. KC-8842)"
            value={manualCode}
            disabled={isScanning}
            onChange={(e) => setManualCode(e.target.value)}
            className="flex-1 px-3 py-2 text-xs rounded-xl bg-secondary/40 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 disabled:opacity-50"
          />
          <Button
            type="submit"
            size="sm"
            disabled={isScanning}
            className="rounded-xl px-3 text-xs font-bold cursor-pointer"
          >
            Validar
          </Button>
        </form>
      </div>
    </div>
  );
}

const getLocalDateString = (d: Date = new Date()): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getLocalTimeString = (d: Date = new Date()): string => {
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
};

const parseTimeToMinutes = (timeStr: string): number => {
  if (!timeStr) return 0;
  try {
    const cleanStr = timeStr.trim().toUpperCase();
    const isPM =
      cleanStr.includes("PM") ||
      cleanStr.includes("P. M.") ||
      cleanStr.includes("P.M.") ||
      cleanStr.includes("P. M");
    const isAM =
      cleanStr.includes("AM") ||
      cleanStr.includes("A. M.") ||
      cleanStr.includes("A.M.") ||
      cleanStr.includes("A. M");
    const digitsOnly = cleanStr.replace(/[^0-9:]/g, "");
    const parts = digitsOnly.split(":");
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

    const isToday =
      today.getFullYear() === date.getFullYear() &&
      today.getMonth() === date.getMonth() &&
      today.getDate() === date.getDate();

    const isYesterday =
      yesterday.getFullYear() === date.getFullYear() &&
      yesterday.getMonth() === date.getMonth() &&
      yesterday.getDate() === date.getDate();

    const options: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long" };
    const formatted = date.toLocaleDateString("es-ES", options);
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
  const strokeDashoffset =
    circumference - (Math.min(100, Math.max(0, percent)) / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
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
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">{children}</div>
      )}
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

interface ActivityHistoryItem {
  label: string;
  puntos: number;
}

const INITIAL_ACTIVITY_HISTORY: Record<"week" | "month" | "quarter", ActivityHistoryItem[]> = {
  week: [
    { label: "Lun", puntos: 180 },
    { label: "Mar", puntos: 160 },
    { label: "Mié", puntos: 175 },
    { label: "Jue", puntos: 140 },
    { label: "Vie", puntos: 155 },
    { label: "Sáb", puntos: 190 },
    { label: "Dom", puntos: 168 },
  ],
  month: [
    { label: "Sem 1", puntos: 165 },
    { label: "Sem 2", puntos: 158 },
    { label: "Sem 3", puntos: 178 },
    { label: "Sem 4", puntos: 170 },
  ],
  quarter: [
    { label: "Mayo", puntos: 162 },
    { label: "Junio", puntos: 171 },
    { label: "Julio", puntos: 168 },
  ],
};

const activityChartConfig = {
  puntos: {
    label: "Puntos MET",
    color: "#f59e0b",
  },
} satisfies ChartConfig;

// ICN Theme Helper with dynamic biological color accents (Shared with Scan Screen)
const getIcnTheme = (score: number) => {
  if (score >= 85) {
    return {
      scoreText: "text-emerald-500 dark:text-emerald-400",
      gradeBadge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
      cardBorder: "border-emerald-500/20",
      iconColor: "text-emerald-500",
      gaugeColor: "bg-emerald-500",
    };
  }
  if (score >= 70) {
    return {
      scoreText: "text-sky-500 dark:text-sky-400",
      gradeBadge: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30",
      cardBorder: "border-sky-500/20",
      iconColor: "text-sky-500",
      gaugeColor: "bg-sky-500",
    };
  }
  if (score >= 55) {
    return {
      scoreText: "text-amber-500 dark:text-amber-400",
      gradeBadge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
      cardBorder: "border-amber-500/20",
      iconColor: "text-amber-500",
      gaugeColor: "bg-amber-500",
    };
  }
  return {
    scoreText: "text-rose-500 dark:text-rose-400",
    gradeBadge: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
    cardBorder: "border-rose-500/20",
    iconColor: "text-rose-500",
    gaugeColor: "bg-rose-500",
  };
};

// Subcomponent: AI Coach Diario (Wellfooder Timeline)
function DiarioTab() {
  const navigate = useNavigate();

  const [activityFilter, setActivityFilter] = useState<"week" | "month" | "quarter">("week");
  const [activityHistory, setActivityHistory] = useState(INITIAL_ACTIVITY_HISTORY);

  const currentActivityHistory = activityHistory[activityFilter];
  const avgActivityPoints = Math.round(
    currentActivityHistory.reduce(
      (acc: number, curr: ActivityHistoryItem) => acc + curr.puntos,
      0,
    ) / currentActivityHistory.length,
  );
  const activityTargetPercent = Math.round((avgActivityPoints / 150) * 100);

  const [activityData, setActivityData] = useState([
    { day: "Lun", puntos: 180 },
    { day: "Mar", puntos: 160 },
    { day: "Mié", puntos: 175 },
    { day: "Jue", puntos: 140 },
    { day: "Vie", puntos: 155 },
    { day: "Sáb", puntos: 190 },
    { day: "Dom", puntos: 168 },
  ]);

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
    { name: "Zumba", low: 4.0, med: 6.5, high: 8.5 },
  ];

  const STREAK_FAQ = [
    {
      q: "¿Qué es la racha y cómo se mide?",
      a: "La Racha de Actividad ayuda a mantener tu constancia física a largo plazo. En lugar de evaluar día a día, la app calcula un promedio ponderado de 7 días de tu actividad física (caminar, correr, gimnasio, etc.), donde las actividades más recientes tienen mayor peso.",
    },
    {
      q: "¿Cómo se mantiene y cuándo se pierde?",
      a: "Para mantener tu racha, tu promedio de 7 días debe estar en el nivel Saludable (150 Puntos o más). Si cae por debajo de este límite, tu racha vuelve a cero. No obstante, ¡se permite descansar! Si te saltas un día pero tu promedio sigue arriba de 150, tu racha no se romperá.",
    },
    {
      q: "¿Qué es la Curva de Actividad y la Línea Base?",
      a: "La Curva de Actividad grafica tu promedio de Puntos de Actividad de los últimos 7 días. La Línea Base Saludable (150 puntos) combina las pautas de actividad física diaria de la Organización Mundial de la Salud (OMS) con el MET.",
    },
    {
      q: "¿Cómo se calculan los Puntos de Actividad?",
      a: "Los puntos diarios son el promedio ponderado de los minutos MET. El MET (Equivalente Metabólico) mide la energía que consume una actividad comparada con el reposo. Los minutos MET de cada ejercicio se calculan multiplicando el valor MET de la actividad (según su intensidad) por los minutos entrenados.",
    },
  ];

  const [calcActivityIdx, setCalcActivityIdx] = useState(7); // default to Caminata
  const [calcIntensity, setCalcIntensity] = useState<"low" | "med" | "high">("med");
  const [calcDuration, setCalcDuration] = useState(30);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showStreakInfo, setShowStreakInfo] = useState(false);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderScrolled(window.scrollY > 150);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      pecho: 95,
      espalda: 80,
      "espalda-baja": 45,
      hombros: 90,
      biceps: 85,
      triceps: 60,
      abdominales: 100,
      cuadriceps: 50,
      isquiotibiales: 75,
      gluteos: 80,
      gemelos: 90,
    };
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("shakerfy_muscle_recovery", JSON.stringify(muscleRecovery));
    }
  }, [muscleRecovery]);

  const [editingTimelineItem, setEditingTimelineItem] = useState<any | null>(null);
  const [showBreathingModal, setShowBreathingModal] = useState(false);
  const [expandedCardInsights, setExpandedCardInsights] = useState<Record<string, boolean>>({});

  const toggleCardInsights = (id: string) => {
    setExpandedCardInsights((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const expandedMealInsights = expandedCardInsights;
  const toggleMealInsights = toggleCardInsights;

  const [userTimelineItems, setUserTimelineItems] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("shakerfy_user_timeline_items");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const validOnly = parsed
              .map((item: any) => (item?.type === "activity" ? { ...item, kcal: 0 } : item))
              .filter((item: any) => item && item.id);
            if (validOnly.length > 0) return validOnly;
          }
        } catch (e) {}
      }
    }
    return [
      {
        id: "hydration-demo",
        date: "2026-07-15",
        time: "08:15 AM",
        title: "Registro de Hidratación (Armstrong)",
        subtitle: "Chequeo Matutino / Hidratación",
        type: "hydration",
        level: 2,
        desc: "Nivel 2 — Amarillo Pálido (Hidratación Saludable)",
        tag: "Nivel 2 Armstrong",
        coachFeedback:
          "💧 Consejo Fisiológico: Estado hídrico ideal para el rendimiento físico y deportivo continuo. Mantén sorbos constantes.",
      },
      {
        id: "activity-demo-1",
        date: "2026-07-15",
        time: "10:30 AM",
        title: "Caminata Enérgica (45 min)",
        subtitle: "Registro de Actividad",
        type: "activity",
        img: null,
        kcal: 0,
        tag: "135 Pts MET",
        coachFeedback:
          "Registraste 45 min de Caminata (intensidad Media). Sumaste 135 puntos MET a tu curva de actividad diaria.",
      },
    ];
  });

  // Sync to localStorage on changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const validOnly = userTimelineItems.filter((item: any) => item && item.id);
      localStorage.setItem("shakerfy_user_timeline_items", JSON.stringify(validOnly));
    }
  }, [userTimelineItems]);

  useEffect(() => {
    const handleSyncStorage = () => {
      if (typeof window !== "undefined") {
        try {
          const saved = localStorage.getItem("shakerfy_user_timeline_items");
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const validOnly = parsed
                .map((item: any) => (item?.type === "activity" ? { ...item, kcal: 0 } : item))
                .filter((item: any) => item && item.id);
              if (validOnly.length > 0) {
                setUserTimelineItems(validOnly);
              }
            }
          }
        } catch (e) {}
      }
    };

    window.addEventListener("shakerfy:timeline-update", handleSyncStorage);
    window.addEventListener("storage", handleSyncStorage);
    window.addEventListener("focus", handleSyncStorage);
    return () => {
      window.removeEventListener("shakerfy:timeline-update", handleSyncStorage);
      window.removeEventListener("storage", handleSyncStorage);
      window.removeEventListener("focus", handleSyncStorage);
    };
  }, []);

  const handleDeleteTimelineItem = (id: string) => {
    setUserTimelineItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSaveEditedTimelineItem = (updated: any) => {
    setUserTimelineItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    setEditingTimelineItem(null);
  };

  const [isFabOpen, setIsFabOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string>("none");

  const timelineItems = React.useMemo(() => {
    // ponytail: Los hitos solares/circadianos sirven exclusivamente de contexto para los prompts y la IA, no se renderizan como cards visuales en la timeline.
    const processedUserItems = userTimelineItems.filter(
      (item) => item && item.id && !["sunrise", "sunset", "peak", "circadian"].includes(item.type),
    );

    return [...processedUserItems].sort((a, b) => {
      const dateA = a.date || "";
      const dateB = b.date || "";
      if (dateA !== dateB) {
        return dateB.localeCompare(dateA);
      }
      return parseTimeToMinutes(b.time) - parseTimeToMinutes(a.time);
    });
  }, [userTimelineItems]);

  return (
    <div className="w-full max-w-full pb-20 transition-transform duration-300">
      {/* MAIN CENTERED CONTENT CONTAINER FOR AI COACH TIMELINE */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-2">
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Current State Check-in Widget */}
          <BioStateCard />

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
                  item.type === "activity" ||
                  item.type === "gym_session" ||
                  item.type === "class_session"
                    ? "movimiento"
                    : "nutricion"; // meal, hydration, etc.

                const catConfig = {
                  nutricion: {
                    bg: "",
                  },
                  movimiento: {
                    bg: "",
                  },
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
                      <div
                        className={`hidden md:block ${showOnLeft ? "text-right pr-6 md:order-2" : "text-left pl-6 md:order-1"}`}
                      >
                        <span className="font-bold text-base text-muted-foreground">
                          {item.time}
                        </span>
                        <p className="text-muted-foreground/60 text-xs mt-0.5">{item.subtitle}</p>
                      </div>

                      {/* Card Container */}
                      <div className={`pl-6 md:pl-0 ${showOnLeft ? "md:order-1" : "md:order-2"}`}>
                        <Card
                          className={cn(
                            "rounded-3xl overflow-hidden border border-border bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg cursor-pointer",
                            catConfig.bg,
                          )}
                        >
                          {item.img && (
                            <div className="relative h-44 w-full overflow-hidden group">
                              <img
                                src={item.img}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />

                              <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-background/80 backdrop-blur-md px-2 py-1 rounded-full border border-border/60 shadow-sm">
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
                            </div>
                          )}

                          {item.type === "hydration" ? (
                            <div className="p-5 sm:p-6 space-y-3">
                              <ArmstrongUrineScaleVisual
                                selectedLevel={
                                  item.level ||
                                  parseInt(String(item.tag || "").replace(/\D/g, "")) ||
                                  2
                                }
                                readOnly={true}
                                title={item.title || "Registro de Hidratación (Armstrong)"}
                                subtitle={item.desc || "Chequeo Matutino / Hidratación"}
                                hideAdvice={true}
                                actions={
                                  <div className="flex items-center gap-1 bg-secondary/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-border/60 shadow-xs shrink-0">
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
                                        if (
                                          confirm(`¿Deseas eliminar "${item.title}" de tu diario?`)
                                        ) {
                                          handleDeleteTimelineItem(item.id);
                                        }
                                      }}
                                      className="p-1 text-muted-foreground hover:text-rose-500 transition cursor-pointer"
                                      title="Eliminar registro"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                }
                              />

                              {/* Collapsible Trigger: Ver insights / Ocultar insights */}
                              {(() => {
                                const isExpanded = !!expandedCardInsights[item.id];
                                const currentLevel =
                                  item.level ||
                                  parseInt(String(item.tag || "").replace(/\D/g, "")) ||
                                  2;
                                const currentObj =
                                  ARMSTRONG_LEVELS.find((l) => l.level === currentLevel) ||
                                  ARMSTRONG_LEVELS[1];

                                return (
                                  <div className="pt-1 space-y-3">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleCardInsights(item.id);
                                      }}
                                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-secondary/30 hover:bg-secondary/60 text-xs font-semibold text-foreground/80 hover:text-foreground transition-all cursor-pointer border border-border/40"
                                    >
                                      <span className="flex items-center gap-2">
                                        <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                                        <span>
                                          {isExpanded ? "Ocultar insights" : "Ver insights"}
                                        </span>
                                      </span>
                                      {isExpanded ? (
                                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                                      ) : (
                                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                      )}
                                    </button>

                                    {isExpanded && (
                                      <div className="pt-1 space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-200 border-t border-border/40 text-left">
                                        {/* Osmorregulación & Escala Armstrong */}
                                        <div className="space-y-1.5 pt-1">
                                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                                            Osmorregulación & Escala Armstrong
                                          </span>
                                          <div className="p-3 rounded-2xl bg-secondary/20 border border-border/40 text-xs space-y-1">
                                            <div className="flex justify-between items-center">
                                              <span className="text-muted-foreground">
                                                Diagnóstico colorimétrico:
                                              </span>
                                              <span className="font-bold text-foreground">
                                                Nivel {currentObj.level} — {currentObj.title}
                                              </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                              <span className="text-muted-foreground">
                                                Estatus de hidratación:
                                              </span>
                                              <span
                                                className={cn(
                                                  "font-bold",
                                                  currentObj.level <= 3
                                                    ? "text-emerald-500"
                                                    : currentObj.level <= 5
                                                      ? "text-amber-500"
                                                      : "text-rose-500",
                                                )}
                                              >
                                                {currentObj.state}
                                              </span>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Coach Feedback / Consejo Fisiológico */}
                                        {(item.coachFeedback || currentObj.advice) && (
                                          <div className="p-3 rounded-xl bg-secondary/30 border border-border/40 flex items-start gap-2 text-left">
                                            <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                                              {(item.coachFeedback || currentObj.advice)
                                                .replace(
                                                  /^(🌱|🍲|⚡|🛡️|💬|💧)?\s*(Aporte Biológico\s*(&|\+)?\s*Consejo:|Aporte Biológico:|Consejo Fisiológico:)?\s*/i,
                                                  "",
                                                )
                                                .trim()}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}
                            </div>
                          ) : (
                            <>
                              <CardHeader className="p-5 pb-3">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="space-y-1.5 flex-1 min-w-0 text-left">
                                    <CardTitle className="text-base sm:text-lg font-black leading-tight text-foreground">
                                      {item.title}
                                    </CardTitle>
                                    {item.type !== "meal" && item.subtitle && (
                                      <CardDescription className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                        {item.subtitle}
                                      </CardDescription>
                                    )}
                                    {item.type === "meal" &&
                                      (item.narrative || item.desc || item.summary) && (
                                        <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed font-normal pt-0.5">
                                          {item.narrative || item.desc || item.summary}
                                        </p>
                                      )}
                                  </div>
                                  {!item.img && (
                                    <div className="flex items-center gap-1 bg-secondary/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-border/60 shadow-xs shrink-0">
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
                                          if (
                                            confirm(
                                              `¿Deseas eliminar "${item.title}" de tu diario?`,
                                            )
                                          ) {
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
                              </CardHeader>

                              {item.type === "meal" ? (
                                <CardContent className="px-5 pb-5 pt-0 space-y-3.5">
                                  {/* Proprietary Valor Nutricional Hero Card */}
                                  {(() => {
                                    const itemScore =
                                      item.bioScore || item.healthScore
                                        ? item.bioScore || item.healthScore * 10
                                        : 88;
                                    const icnTheme = getIcnTheme(itemScore);
                                    const currentGauge =
                                      item.bioGaugeIndex !== undefined
                                        ? item.bioGaugeIndex
                                        : itemScore >= 90
                                          ? 4
                                          : itemScore >= 80
                                            ? 3
                                            : itemScore >= 65
                                              ? 2
                                              : itemScore >= 50
                                                ? 1
                                                : 0;

                                    const rawQualityLabel =
                                      item.bioQualityLabel || "Densidad Nutricional Óptima";
                                    const qualityLabel = rawQualityLabel
                                      .replace(/\s*\(Consumo Esporádico\)/gi, "")
                                      .trim();

                                    const qualitativeHeadline =
                                      currentGauge >= 4
                                        ? "Óptimo"
                                        : currentGauge >= 3
                                          ? "Alto"
                                          : currentGauge >= 2
                                            ? "Equilibrado"
                                            : currentGauge >= 1
                                              ? "Moderado"
                                              : "Básico";

                                    return (
                                      <div
                                        className={cn(
                                          "p-3.5 rounded-2xl bg-secondary/40 border space-y-2 text-left transition-all",
                                          icnTheme.cardBorder,
                                        )}
                                      >
                                        <div className="flex items-center justify-between gap-2">
                                          <div className="flex items-center gap-1.5 min-w-0">
                                            <ShieldCheck
                                              className={cn(
                                                "w-3.5 h-3.5 shrink-0",
                                                icnTheme.iconColor,
                                              )}
                                            />
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground truncate">
                                              Valor Nutricional
                                            </span>
                                          </div>
                                        </div>

                                        <div className="flex items-baseline justify-between gap-3">
                                          <span
                                            className={cn(
                                              "text-base sm:text-lg font-black tracking-tight uppercase font-mono",
                                              icnTheme.scoreText,
                                            )}
                                          >
                                            {qualitativeHeadline}
                                          </span>
                                          <span className="text-[11px] font-semibold text-muted-foreground text-right truncate">
                                            {qualityLabel}
                                          </span>
                                        </div>

                                        {/* 5-Segment Mini Gauge */}
                                        <div className="space-y-1 pt-0.5 select-none">
                                          <div className="flex items-center gap-1">
                                            {[0, 1, 2, 3, 4].map((segIdx) => {
                                              const isReached = segIdx <= currentGauge;
                                              const isCurrent = segIdx === currentGauge;
                                              return (
                                                <div
                                                  key={segIdx}
                                                  className={cn(
                                                    "h-1.5 flex-1 rounded-full transition-all duration-300",
                                                    isCurrent
                                                      ? cn(
                                                          icnTheme.gaugeColor,
                                                          "opacity-100 shadow-xs",
                                                        )
                                                      : isReached
                                                        ? cn(icnTheme.gaugeColor, "opacity-40")
                                                        : "bg-secondary border border-border/40",
                                                  )}
                                                />
                                              );
                                            })}
                                          </div>
                                          <div className="flex justify-between items-center text-[9px] font-bold text-muted-foreground/60 px-0.5">
                                            <span>Bajo</span>
                                            <span>Muy Alto</span>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })()}

                                   {/* 1. Collapsible Trigger: Ver insights / Ocultar insights */}
                                  {(() => {
                                    const isExpanded = !!expandedMealInsights[item.id];
                                    return (
                                      <div className="pt-0.5 space-y-3">
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleMealInsights(item.id);
                                          }}
                                          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-secondary/30 hover:bg-secondary/60 text-xs font-semibold text-foreground/80 hover:text-foreground transition-all cursor-pointer border border-border/40"
                                        >
                                          <span className="flex items-center gap-2">
                                            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                                            <span>
                                              {isExpanded ? "Ocultar insights" : "Ver insights"}
                                            </span>
                                          </span>
                                          {isExpanded ? (
                                            <ChevronUp className="w-4 h-4 text-muted-foreground" />
                                          ) : (
                                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                          )}
                                        </button>

                                        {/* Collapsible Content */}
                                        {isExpanded && (
                                          <div className="pt-1 space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-200 border-t border-border/40 text-left">
                                            {/* A. Vectores Nutricionales */}
                                            <div className="space-y-1.5 pt-1">
                                              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                                                Vectores Nutricionales
                                              </span>
                                              <div className="flex flex-wrap gap-1.5">
                                                {(item.vectorBadges && item.vectorBadges.length > 0
                                                  ? item.vectorBadges
                                                  : [
                                                      { badgeText: "Mínimamente procesado" },
                                                      { badgeText: "Alto en fibra" },
                                                      { badgeText: "Proteína magra" },
                                                      { badgeText: "Sin azúcar añadido" },
                                                      { badgeText: "Grasas saludables" },
                                                      { badgeText: "Granos enteros" },
                                                      { badgeText: "Bajo en sodio" },
                                                    ]
                                                ).map((badge: any, idx: number) => (
                                                  <div
                                                    key={idx}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-secondary/40 text-foreground border border-border/60 shadow-none select-none cursor-default"
                                                    title={badge.description || badge.badgeText}
                                                  >
                                                    <Check className="w-3 h-3 text-foreground shrink-0 stroke-[2.5]" />
                                                    <span>{badge.badgeText}</span>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>

                                            {/* B. Cromonutrición */}
                                            {item.phytoColors && item.phytoColors.length > 0 && (
                                              <div className="space-y-1 select-none">
                                                <div className="flex items-center justify-between">
                                                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                                                    Cromonutrición
                                                  </span>
                                                  <span className="text-[10px] font-mono font-bold text-muted-foreground/70">
                                                    {item.phytoColors.length}/5 fitocolores
                                                  </span>
                                                </div>
                                                <div className="flex flex-wrap gap-1.5">
                                                  {item.phytoColors.map((c: any, i: number) => (
                                                    <div
                                                      key={i}
                                                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-secondary/40 text-foreground border border-border/60 shadow-none cursor-default select-none transition-transform hover:scale-105"
                                                      title={
                                                        c.phytochemical
                                                          ? `${c.name}: ${c.phytochemical}`
                                                          : c.name
                                                      }
                                                    >
                                                      <span
                                                        className={cn(
                                                          "w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs",
                                                          c.bgClass,
                                                        )}
                                                      />
                                                      <span>{c.name}</span>
                                                    </div>
                                                  ))}
                                                </div>
                                              </div>
                                            )}

                                            {/* C. Motivo de Ingesta */}
                                            {item.reasons && item.reasons.length > 0 && (
                                              <div className="space-y-1.5">
                                                <div className="flex items-center justify-between">
                                                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                                                    Motivo de Ingesta
                                                  </span>
                                                  {item.reasons.includes("Estrés / Emocional") && (
                                                    <button
                                                      type="button"
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        setShowBreathingModal(true);
                                                      }}
                                                      className="text-[10px] font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 transition cursor-pointer"
                                                      title="Realizar una micro-pausa de respiración"
                                                    >
                                                      <Wind className="w-3 h-3" />
                                                      <span>Pausa Vagal</span>
                                                    </button>
                                                  )}
                                                </div>
                                                <div className="flex flex-wrap gap-1.5">
                                                  {item.reasons.map(
                                                    (reason: string, idx: number) => {
                                                      const isStress =
                                                        reason === "Estrés / Emocional";
                                                      return (
                                                        <Badge
                                                          key={idx}
                                                          variant="outline"
                                                          onClick={
                                                            isStress
                                                              ? (e) => {
                                                                  e.stopPropagation();
                                                                  setShowBreathingModal(true);
                                                                }
                                                              : undefined
                                                          }
                                                          className={cn(
                                                            "rounded-full px-2.5 py-1 text-[11px] font-medium border-border/60 bg-secondary/40 text-foreground shadow-none",
                                                            isStress &&
                                                              "hover:bg-secondary cursor-pointer border-border/80",
                                                          )}
                                                          title={
                                                            isStress
                                                              ? "Toca para abrir la pausa de respiración consciente"
                                                              : undefined
                                                          }
                                                        >
                                                          {isStress && (
                                                            <Wind className="w-3 h-3 mr-1 text-muted-foreground" />
                                                          )}
                                                          {reason}
                                                        </Badge>
                                                      );
                                                    },
                                                  )}
                                                </div>
                                              </div>
                                            )}

                                            {/* D. Insight del Coach Biológico */}
                                            {(item.coachFeedback ||
                                              item.narrative ||
                                              item.summary ||
                                              item.desc) && (
                                              <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border/60 flex items-start gap-2.5 text-left">
                                                <Sparkles className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                                <div className="space-y-0.5 flex-1 min-w-0">
                                                  <span className="text-[10px] font-bold uppercase tracking-wider text-foreground block">
                                                    Insight del Coach Biológico
                                                  </span>
                                                  <p className="text-xs text-foreground/90 leading-relaxed font-normal">
                                                    {item.coachFeedback ||
                                                      item.narrative ||
                                                      item.summary ||
                                                      item.desc}
                                                  </p>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })()}

                                  {/* Disclaimer Text: Always Visible */}
                                  <p className="text-[11px] text-muted-foreground/60 leading-snug pt-1 text-left">
                                    Visual identification may be inaccurate. Always check important
                                    details.
                                  </p>
                                </CardContent>
                              ) : (
                                <CardContent className="px-5 pb-4 pt-0 space-y-3 text-left">
                                  {/* Description / Summary / Badges */}
                                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                                    {item.type === "hydration" ? (
                                      <>
                                        <Badge
                                          variant="outline"
                                          className="rounded-full px-3 py-1 text-[11px] font-medium border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5 shadow-none"
                                        >
                                          <Droplet className="w-3.5 h-3.5" />
                                          <span>
                                            {item.tag || `Nivel ${item.level || 2} Armstrong`}
                                          </span>
                                        </Badge>
                                        {item.desc && (
                                          <span className="text-xs text-muted-foreground font-medium">
                                            {item.desc}
                                          </span>
                                        )}
                                      </>
                                    ) : (
                                      item.tag && (
                                        <Badge
                                          variant="outline"
                                          className="rounded-full px-3 py-1 text-[11px] font-medium border-border/60 bg-secondary/25 text-muted-foreground flex items-center gap-1.5 shadow-none"
                                        >
                                          <Activity className="w-3.5 h-3.5 text-emerald-500" />
                                          <span>{item.tag}</span>
                                        </Badge>
                                      )
                                    )}
                                  </div>

                                  {/* Collapsible Trigger: Ver insights / Ocultar insights */}
                                  {(() => {
                                    const isExpanded = !!expandedCardInsights[item.id];
                                    return (
                                      <div className="pt-1 space-y-3">
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleCardInsights(item.id);
                                          }}
                                          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-secondary/30 hover:bg-secondary/60 text-xs font-semibold text-foreground/80 hover:text-foreground transition-all cursor-pointer border border-border/40"
                                        >
                                          <span className="flex items-center gap-2">
                                            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                                            <span>
                                              {isExpanded ? "Ocultar insights" : "Ver insights"}
                                            </span>
                                          </span>
                                          {isExpanded ? (
                                            <ChevronUp className="w-4 h-4 text-muted-foreground" />
                                          ) : (
                                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                          )}
                                        </button>

                                        {isExpanded && (
                                          <div className="pt-1 space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-200 border-t border-border/40 text-left">
                                            {item.type === "hydration" ? (
                                              <div className="space-y-1.5 pt-1">
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                                                  Osmorregulación & Escala Armstrong
                                                </span>
                                                <div className="p-3 rounded-2xl bg-secondary/20 border border-border/40 text-xs space-y-1">
                                                  <div className="flex justify-between items-center">
                                                    <span className="text-muted-foreground">
                                                      Estado colorimétrico:
                                                    </span>
                                                    <span className="font-bold text-foreground">
                                                      Nivel {item.level || 2} de 8
                                                    </span>
                                                  </div>
                                                  <div className="flex justify-between items-center">
                                                    <span className="text-muted-foreground">
                                                      Estatus celular:
                                                    </span>
                                                    <span className="font-bold text-emerald-500">
                                                      {(item.level || 2) <= 3
                                                        ? "Óptimo / Euhidratado"
                                                        : (item.level || 2) <= 5
                                                          ? "Ligera deshidratación"
                                                          : "Atención sugerida"}
                                                    </span>
                                                  </div>
                                                </div>
                                              </div>
                                            ) : (
                                              <div className="space-y-1.5 pt-1">
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                                                  Detalle Metabólico
                                                </span>
                                                <div className="p-3 rounded-2xl bg-secondary/20 border border-border/40 text-xs space-y-1">
                                                  <div className="flex justify-between items-center">
                                                    <span className="text-muted-foreground">
                                                      Registro de sesión:
                                                    </span>
                                                    <span className="font-bold text-foreground">
                                                      {item.title}
                                                    </span>
                                                  </div>
                                                  <div className="flex justify-between items-center">
                                                    <span className="text-muted-foreground">
                                                      Aporte al diario:
                                                    </span>
                                                    <span className="font-mono font-bold text-emerald-500">
                                                      {item.tag || "Puntos MET registrados"}
                                                    </span>
                                                  </div>
                                                </div>
                                              </div>
                                            )}

                                            {/* Coach Feedback */}
                                            {(item.coachFeedback || item.summary || item.desc) && (
                                              <div className="p-3 rounded-xl bg-secondary/30 border border-border/40 flex items-start gap-2 text-left">
                                                <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                                                  {(item.coachFeedback || item.summary || item.desc)
                                                    .replace(
                                                      /^(🌱|🍲|⚡|🛡️|💬|💧)?\s*(Aporte Biológico\s*(&|\+)?\s*Consejo:|Aporte Biológico:|Consejo Fisiológico:)?\s*/i,
                                                      "",
                                                    )
                                                    .trim()}
                                                </p>
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })()}
                                </CardContent>
                              )}

                              <div className="md:hidden px-5 pb-4 text-xs font-semibold text-muted-foreground">
                                <span>{item.time}</span>
                              </div>
                            </>
                          )}
                        </Card>
                      </div>
                    </div>
                  </React.Fragment>
                );
              });
            })()}
          </div>
        </div>
      </div>

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
            <button
              onClick={() => {
                setIsFabOpen(false);
                setActiveModal("registrar-actividad");
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-secondary/70 transition-colors text-left group cursor-pointer"
            >
              <Activity className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform shrink-0" />
              <span className="text-xs font-semibold text-foreground flex-1">
                Registrar actividad
              </span>
            </button>

            <button
              onClick={() => {
                setIsFabOpen(false);
                setActiveModal("hydration-armstrong");
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-secondary/70 transition-colors text-left group cursor-pointer"
            >
              <Droplet className="w-4 h-4 text-cyan-500 group-hover:scale-110 transition-transform shrink-0" />
              <span className="text-xs font-semibold text-foreground flex-1">
                Registrar Hidratación (Armstrong)
              </span>
            </button>

            <button
              onClick={() => {
                setIsFabOpen(false);
                navigate({ to: "/scan" });
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-secondary/70 transition-colors text-left group cursor-pointer"
            >
              <Camera className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform shrink-0" />
              <span className="text-xs font-semibold text-foreground flex-1">
                Analizar Foto de Plato (IA)
              </span>
            </button>
          </div>
        )}

        <button
          onClick={() => setIsFabOpen(!isFabOpen)}
          className="w-14 h-14 rounded-full bg-foreground text-background flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
          aria-label="Abrir menú de acciones"
        >
          <Plus
            className={`w-6 h-6 transition-transform duration-300 ${isFabOpen ? "rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* Streak Info Modal */}
      {showStreakInfo && (
        <Dialog open onOpenChange={() => setShowStreakInfo(false)}>
          <DialogContent className="sm:max-w-md rounded-3xl p-6 border border-border bg-card max-h-[85vh] overflow-y-auto custom-scrollbar">
            <DialogHeader className="pb-3 border-b border-border/40 text-left">
              <DialogTitle className="text-base font-bold flex items-center gap-2 text-foreground">
                <Flame className="w-5 h-5 text-amber-500 fill-amber-500 animate-pulse" />
                <span>Racha de Actividad — 12 Días</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Promedio ponderado de 7 días calculado según las pautas de actividad física diaria
                OMS & minutos MET.
              </DialogDescription>
            </DialogHeader>

            <div className="py-3 space-y-4 text-left">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-3 bg-secondary/50 rounded-2xl border border-border/40">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-0.5">
                    Promedio 7 Días
                  </span>
                  <span className="text-base font-black text-amber-500">
                    {avgActivityPoints} Pts MET
                  </span>
                </div>
                <div className="p-3 bg-secondary/50 rounded-2xl border border-border/40">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-0.5">
                    Meta Diaria OMS
                  </span>
                  <span className="text-base font-black text-emerald-500">150 Pts</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Detalles & Funcionamiento
                </h4>
                {STREAK_FAQ.map((faq, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-secondary/30 border border-border/40 space-y-1"
                  >
                    <span className="text-xs font-bold text-foreground block">{faq.q}</span>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-border/40 flex justify-end">
              <Button
                onClick={() => setShowStreakInfo(false)}
                className="rounded-xl px-5 py-2 font-bold text-xs bg-foreground text-background hover:opacity-90 cursor-pointer"
              >
                Entendido
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Hydration Armstrong Modal */}
      {activeModal === "hydration-armstrong" && (
        <HydrationArmstrongModal
          onClose={() => setActiveModal("none")}
          onSave={(level, label, feedback) => {
            const now = new Date();
            const timeStr = now.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
            const dateStr = now.toISOString().split("T")[0];

            const newHydrationItem = {
              id: `hydration-${Date.now()}`,
              type: "hydration",
              time: timeStr,
              date: dateStr,
              title: "Registro de Hidratación (Armstrong)",
              subtitle: "Chequeo Matutino / Hidratación",
              desc: label,
              level: level,
              coachFeedback: `💧 Consejo Fisiológico: ${feedback}`,
              tag: `Nivel ${level} Armstrong`,
            };

            setUserTimelineItems((prev) => [newHydrationItem, ...prev]);
            toast.success(`✓ Hidratación registrada: Nivel ${level} (Armstrong)`);
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

            // 1. Update activityData & activityHistory points
            setActivityData((prev) =>
              prev.map((item) =>
                item.day === todayLabel ? { ...item, puntos: item.puntos + metPoints } : item,
              ),
            );
            setActivityHistory((prev) => ({
              ...prev,
              week: prev.week.map((item) =>
                item.label === todayLabel ? { ...item, puntos: item.puntos + metPoints } : item,
              ),
            }));

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
              coachFeedback: `Registraste ${duration} min de ${activityName} (intensidad ${intensity === "low" ? "Baja" : intensity === "med" ? "Media" : "Alta"}). Sumaste ${metPoints} puntos MET a tu curva de actividad diaria. ¡Gran trabajo!`,
            };
            setUserTimelineItems((prev) => [newAct, ...prev]);
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

      {/* Mindful Vagal Breathing Orb Modal */}
      <MindfulBreathingModal open={showBreathingModal} onOpenChange={setShowBreathingModal} />
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
  const [level, setLevel] = useState<number>(item.level || 2);
  const [coachFeedback, setCoachFeedback] = useState(item.coachFeedback || "");
  const [reasons, setReasons] = useState<string[]>(item.reasons || ["Hambre física"]);
  const [symptoms, setSymptoms] = useState<string[]>(
    Array.isArray(item.symptoms) ? item.symptoms : item.symptom ? [item.symptom] : [],
  );

  const reasonsList = [
    "Hambre física",
    "Horario habitual",
    "Social / Compartir",
    "Antojo / Placer",
    "Estrés / Emocional",
    "Prisa / Rutina",
  ];

  const symptomsList = [
    "Con energía",
    "Ligero / Óptimo",
    "Somnolencia",
    "Pesadez / Hinchazón",
    "Reflujo / Acidez",
  ];

  const handleToggleReason = (r: string) => {
    setReasons((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));
  };

  const handleToggleSymptomInModal = (s: string) => {
    setSymptoms((prev) => (prev.includes(s) ? [] : [s]));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (item.type === "hydration") {
      const currentLevelObj =
        ARMSTRONG_LEVELS.find((l) => l.level === level) || ARMSTRONG_LEVELS[1];
      onSave({
        ...item,
        title,
        subtitle,
        level,
        desc: `${currentLevelObj.title} (${currentLevelObj.state})`,
        tag: `Nivel ${level} Armstrong`,
        coachFeedback: coachFeedback || `💧 Consejo Fisiológico: ${currentLevelObj.advice}`,
      });
    } else {
      onSave({
        ...item,
        title,
        subtitle,
        kcal: Number(kcal),
        coachFeedback,
        reasons: item.type === "meal" ? reasons : item.reasons,
        symptoms: item.type === "meal" ? symptoms : item.symptoms,
        symptom: item.type === "meal" ? symptoms[0] || undefined : item.symptom,
      });
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-6 bg-card border border-border rounded-3xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-bold text-foreground">
            Editar Registro del Diario
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Modifica la información de tu tarjeta registrada en la línea de tiempo.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {item.type === "hydration" && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                Nivel Colorimétrico Armstrong
              </label>
              <ArmstrongUrineScaleVisual
                selectedLevel={level}
                onSelectLevel={(l) => setLevel(l)}
                readOnly={false}
                title="Hydration Check"
                subtitle="Selecciona el nivel de la escala"
              />
            </div>
          )}

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
              <label className="text-xs font-semibold text-muted-foreground">
                Categoría / Momento
              </label>
              <input
                type="text"
                required
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="flex w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground font-semibold"
              />
            </div>
            {item.type !== "hydration" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Calorías (kcal)
                </label>
                <input
                  type="number"
                  min="0"
                  value={kcal}
                  onChange={(e) => setKcal(Number(e.target.value))}
                  className="flex w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground font-semibold"
                />
              </div>
            )}
          </div>

          {item.type === "meal" && (
            <>
              <div className="space-y-2 pt-1 text-left">
                <label className="text-xs font-semibold text-muted-foreground block">
                  Motivos por los que comes (Contexto)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {reasonsList.map((r, idx) => {
                    const isSelected = reasons.includes(r);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleToggleReason(r)}
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-semibold border transition-all cursor-pointer",
                          isSelected
                            ? "bg-foreground text-background border-foreground font-bold shadow-xs"
                            : "bg-secondary/70 text-secondary-foreground border-border/50 hover:bg-secondary",
                        )}
                      >
                        {isSelected ? `✓ ${r}` : `+ ${r}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2 pt-1 text-left">
                <label className="text-xs font-semibold text-muted-foreground block">
                  Respuesta Postprandial (¿Cómo te cayó?)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {symptomsList.map((s, idx) => {
                    const isSelected = symptoms.includes(s);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleToggleSymptomInModal(s)}
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-semibold border transition-all cursor-pointer",
                          isSelected
                            ? "bg-foreground text-background border-foreground font-bold shadow-xs"
                            : "bg-secondary/70 text-secondary-foreground border-border/50 hover:bg-secondary",
                        )}
                      >
                        {isSelected ? `✓ ${s}` : `+ ${s}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Nota / AI Feedback
            </label>
            <textarea
              rows={3}
              value={coachFeedback}
              onChange={(e) => setCoachFeedback(e.target.value)}
              placeholder="Agrega una nota o sugerencia nutricional..."
              className="flex w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground font-medium"
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl text-xs font-bold"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="rounded-xl text-xs font-bold bg-foreground text-background hover:opacity-90"
            >
              Guardar Cambios
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface ActivityLogModalProps {
  onClose: () => void;
  onSave: (
    activityName: string,
    duration: number,
    intensity: "low" | "med" | "high",
    metPoints: number,
  ) => void;
  activities: { name: string; low: number; med: number; high: number }[];
}

function ActivityLogModal({ onClose, onSave, activities }: ActivityLogModalProps) {
  const [activeTab, setActiveTab] = useState<"manual" | "timer">("manual");
  const [selectedActivity, setSelectedActivity] = useState(
    activities[7]?.name || activities[0]?.name || "Caminata",
  );
  const [intensity, setIntensity] = useState<"low" | "med" | "high">("med");
  const [duration, setDuration] = useState(30);

  // Timer states
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerIsRunning, setTimerIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerIsRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerIsRunning]);

  const currentActivityObj = activities.find((a) => a.name === selectedActivity) || activities[0];
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
            <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground block text-left">
              Google Fit Sync
            </span>
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
              {activities.map((act) => (
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
                  activeBorder: "border-emerald-500 ring-1 ring-emerald-500",
                },
                {
                  id: "med",
                  label: "Media",
                  desc: "Respiración agitada que permite conversar brevemente, pero no cantar.",
                  border: "border-amber-500/20 dark:border-amber-500/10",
                  bg: "bg-amber-500/5",
                  activeBorder: "border-amber-500 ring-1 ring-amber-500",
                },
                {
                  id: "high",
                  label: "Alta",
                  desc: "Respiración muy agitada que solo permite hablar con oraciones breves.",
                  border: "border-rose-500/20 dark:border-rose-500/10",
                  bg: "bg-rose-500/5",
                  activeBorder: "border-rose-500 ring-1 ring-rose-500",
                },
              ].map((opt) => {
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
                        {currentActivityObj
                          ? currentActivityObj[opt.id as "low" | "med" | "high"]
                          : 3.0}{" "}
                        MET
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
                  <span className="text-[9px] uppercase font-black text-muted-foreground tracking-wider block">
                    Puntos Acumulados
                  </span>
                  <div className="text-lg font-black text-foreground flex items-center gap-1">
                    <Activity className="w-4 h-4 text-orange-500" />
                    {calculatedPointsManual}{" "}
                    <span className="text-xs font-bold text-muted-foreground">Pts MET</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase font-black text-muted-foreground tracking-wider block">
                    Valor MET
                  </span>
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
                  <span className="text-[9px] uppercase font-black text-muted-foreground tracking-wider block">
                    Puntos en Tiempo Real
                  </span>
                  <div className="text-lg font-black text-foreground flex items-center gap-1">
                    <Activity className="w-4 h-4 text-orange-500 animate-pulse" />
                    {calculatedPointsTimer}{" "}
                    <span className="text-xs font-bold text-muted-foreground">Pts MET</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase font-black text-muted-foreground tracking-wider block">
                    Ritmo MET
                  </span>
                  <span className="text-xs font-extrabold text-foreground">
                    {metValue} Pts / min
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* AI Advice/Explanation footnote */}
          <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex items-start gap-2.5 text-left">
            <Sparkles className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
            <p className="text-[10px] text-muted-foreground leading-relaxed font-semibold">
              <span className="text-foreground">¿Qué son los Puntos MET?</span> El Equivalente
              Metabólico (MET) mide la intensidad de tu ejercicio. La OMS recomienda sumar al menos{" "}
              <span className="text-foreground">150 Puntos de Actividad</span> diarios para mantener
              un estilo de vida saludable y conservar tu racha.
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

// Subcomponent: Armstrong Urine Color Scale (Visual component matching exact reference HTML design)
const ARMSTRONG_LEVELS = [
  {
    level: 1,
    hex: "#fbfce1",
    color:
      "bg-cyan-50 border-cyan-200 text-cyan-900 dark:bg-cyan-950/40 dark:border-cyan-800 dark:text-cyan-200",
    dot: "bg-cyan-100 border-cyan-300",
    title: "Nivel 1 — Transparente",
    usg: "< 1.010 g/cm³",
    state: "Euhidratación Óptima",
    advice: "Excelente balance celular. Mantén pequeños sorbos de agua potable a lo largo del día.",
  },
  {
    level: 2,
    hex: "#f9f9cd",
    color:
      "bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-950/40 dark:border-yellow-800 dark:text-yellow-200",
    dot: "bg-yellow-200 border-yellow-300",
    title: "Nivel 2 — Amarillo Pálido",
    usg: "1.010 g/cm³",
    state: "Hidratación Saludable",
    advice: "Estado hídrico ideal para el rendimiento físico y deportivo continuo.",
  },
  {
    level: 3,
    hex: "#f6f2a9",
    color:
      "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200",
    dot: "bg-amber-300 border-amber-400",
    title: "Nivel 3 — Amarillo Claro",
    usg: "1.015 g/cm³",
    state: "Bien Hidratado",
    advice: "Buen estado hídrico para afrontar tus entrenamientos.",
  },
  {
    level: 4,
    hex: "#f2e285",
    color:
      "bg-amber-100 border-amber-300 text-amber-950 dark:bg-amber-900/40 dark:border-amber-700 dark:text-amber-200",
    dot: "bg-amber-400 border-amber-500",
    title: "Nivel 4 — Amarillo Dorado",
    usg: "1.020 g/cm³",
    state: "Deshidratación Leve",
    advice:
      "Se sugiere tomar 1 o 2 vasos de agua fresca para mantener un balance óptimo y evitar fatiga.",
  },
  {
    level: 5,
    hex: "#eec863",
    color:
      "bg-amber-200 border-amber-400 text-amber-950 dark:bg-amber-800/40 dark:border-amber-600 dark:text-amber-100",
    dot: "bg-amber-500 border-amber-600",
    title: "Nivel 5 — Miel / Ámbar Claro",
    usg: "1.025 g/cm³",
    state: "Deshidratación Moderada",
    advice:
      "Considera reponer líquidos con agua y una fuente ligera de electrolitos o sales minerales.",
  },
  {
    level: 6,
    hex: "#e8a33a",
    color:
      "bg-amber-300 border-amber-500 text-amber-950 dark:bg-amber-700/50 dark:border-amber-500 dark:text-amber-100",
    dot: "bg-amber-700 border-amber-800",
    title: "Nivel 6 — Ámbar Oscuro",
    usg: "1.028 g/cm³",
    state: "Deshidratación Significativa",
    advice:
      "Tu cuerpo muestra signos de necesitar hidratación. Es un buen momento para reponer líquidos gradualmente con agua o una bebida isotónica.",
  },
  {
    level: 7,
    hex: "#d4812f",
    color:
      "bg-amber-700/20 border-amber-700 text-amber-900 dark:bg-amber-950/80 dark:border-amber-700 dark:text-amber-200",
    dot: "bg-amber-800 border-amber-900",
    title: "Nivel 7 — Té Oscuro",
    usg: "1.030 g/cm³",
    state: "Deshidratación Elevada",
    advice:
      "Refleja una pérdida hídrica considerable. Conviene resguardarte del calor y priorizar una rehidratación paulatina con sales y líquidos.",
  },
  {
    level: 8,
    hex: "#a66a2e",
    color:
      "bg-stone-800/20 border-stone-800 text-stone-900 dark:bg-stone-900 dark:border-stone-700 dark:text-stone-100",
    dot: "bg-stone-900 border-stone-950",
    title: "Nivel 8 — Café / Marrón",
    usg: "> 1.030 g/cm³",
    state: "Deshidratación Severa (Alerta)",
    advice:
      "Concentración urinaria muy alta. Se recomienda pausar la actividad intensa, hidratarte y, si el tono persiste tras varias horas, consultar a un profesional de la salud.",
  },
];

interface ArmstrongUrineScaleVisualProps {
  selectedLevel: number;
  onSelectLevel?: (level: number) => void;
  readOnly?: boolean;
  className?: string;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  hideAdvice?: boolean;
}

function ArmstrongUrineScaleVisual({
  selectedLevel,
  onSelectLevel,
  readOnly = false,
  className,
  title = "Hydration Check",
  subtitle,
  actions,
  hideAdvice = false,
}: ArmstrongUrineScaleVisualProps) {
  const currentObj = ARMSTRONG_LEVELS.find((l) => l.level === selectedLevel) || ARMSTRONG_LEVELS[1];
  const displaySubtitle = subtitle || `${currentObj.title} (${currentObj.state})`;

  return (
    <div className={cn("space-y-5 text-left w-full", className)}>
      {/* Header section with flex alignment */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-0.5 text-left">
          <h3 className="text-lg font-bold text-foreground tracking-tight">{title}</h3>
          <p className="text-xs text-muted-foreground font-medium">{displaySubtitle}</p>
        </div>
        {actions}
      </div>

      {/* 8 Color Scale Bar */}
      <div className="space-y-2 pt-1">
        <div className="flex justify-between gap-1.5 h-16 w-full rounded-2xl bg-secondary/50 dark:bg-black/40 p-1.5 border border-border/40">
          {ARMSTRONG_LEVELS.map((item) => {
            const isSelected = selectedLevel === item.level;
            return (
              <button
                key={item.level}
                type="button"
                disabled={readOnly}
                onClick={() => onSelectLevel?.(item.level)}
                style={{ backgroundColor: item.hex }}
                className={cn(
                  "flex-1 h-full rounded-xl transition-all duration-200 relative cursor-pointer border border-black/10 focus:outline-none",
                  isSelected
                    ? "scale-110 shadow-lg ring-2 ring-foreground z-10 opacity-100"
                    : readOnly
                      ? "opacity-75"
                      : "opacity-80 hover:opacity-100 hover:scale-105",
                )}
                title={`${item.title} — ${item.state}`}
              >
                {/* Active indicator dot at the bottom */}
                {isSelected && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-foreground rounded-full shadow-xs" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footnote Labels under the scale */}
        <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/80 px-1 pt-1">
          <span className="text-emerald-600 dark:text-emerald-400">OPTIMAL</span>
          <span className="text-amber-600 dark:text-amber-400">DEHYDRATED</span>
        </div>
      </div>

      {/* AI Feedback Section with generous top padding */}
      {!hideAdvice && (
        <div className="pt-5 mt-2 border-t border-border/70 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed font-medium">
            {currentObj.advice}
          </p>
        </div>
      )}
    </div>
  );
}

interface HydrationArmstrongModalProps {
  onClose: () => void;
  onSave: (level: number, label: string, feedback: string) => void;
}

function HydrationArmstrongModal({ onClose, onSave }: HydrationArmstrongModalProps) {
  const [selectedLevel, setSelectedLevel] = useState<number>(2);
  const currentLevelObj =
    ARMSTRONG_LEVELS.find((l) => l.level === selectedLevel) || ARMSTRONG_LEVELS[1];

  const handleConfirm = () => {
    onSave(
      currentLevelObj.level,
      `${currentLevelObj.title} (${currentLevelObj.state})`,
      currentLevelObj.advice,
    );
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg rounded-3xl p-6 sm:p-8 border border-border bg-card max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader className="pb-3 border-b border-border/40">
          <DialogTitle className="text-base font-bold flex items-center justify-between text-foreground">
            <div className="flex items-center gap-2">
              <Droplet className="w-5 h-5 text-cyan-500" />
              <span>Registro de Hidratación</span>
            </div>
            <Link
              to="/blog/$slug"
              params={{ slug: "escala-de-armstrong-y-fisiologia-de-la-hidratacion" }}
              className="text-[11px] font-semibold text-emerald-500 hover:underline flex items-center gap-1"
            >
              <span>Escala Armstrong</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground pt-1">
            Selecciona el nivel colorimétrico de osmolalidad urinaria (Dr. Lawrence Armstrong,
            ACSM).
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 space-y-4">
          <ArmstrongUrineScaleVisual
            selectedLevel={selectedLevel}
            onSelectLevel={(lvl) => setSelectedLevel(lvl)}
            readOnly={false}
            title="Hydration Check"
            subtitle="Haz clic en la cápsula de color para seleccionar tu nivel"
          />

          {/* Riboflavin warning note & Disclaimer */}
          <div className="p-3.5 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-[11px] text-muted-foreground leading-relaxed space-y-1.5">
            <p>
              💡 <strong>Nota fisiológica:</strong> Suplementos de Vitamina B2 (Riboflavina) o
              multivitamínicos pueden pigmentar la orina de amarillo intenso sin implicar
              deshidratación.
            </p>
            <p className="text-[10px] text-muted-foreground/70">
              * Guía orientativa de bienestar basada en Armstrong (ACSM). No constituye prescripción
              médica ni sustituye la consulta con un profesional de la salud.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-border/40 flex items-center justify-end gap-2">
          <Button variant="outline" onClick={onClose} className="rounded-xl font-semibold">
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            className="rounded-xl font-bold bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            Registrar Estado Hídrico
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Subcomponent: Photo Meal Analysis Modal — Complete Cal AI (Scanner & Nutrition Flow)
interface MealCalloutPin {
  name: string;
  calories: number;
  topPct: number; // e.g. 15
  leftPct?: number; // e.g. 20
  rightPct?: number; // e.g. 10
}

interface MealIngredientItem {
  id: string;
  name: string;
  category: "protein" | "carbs" | "fats" | "veggies" | "fruits" | "dairy";
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  calPer100g: number;
  pPer100g: number;
  cPer100g: number;
  fPer100g: number;
  fiberPer100g: number;
}

interface SampleMealModel {
  id: string;
  title: string;
  time: string;
  mealType: string;
  img: string;
  servings: number;
  healthScore: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  calloutPins: MealCalloutPin[];
  ingredients: MealIngredientItem[];
}

const COMMON_FOODS_DATABASE = [
  {
    name: "Pancakes Stack",
    category: "carbs" as const,
    calPer100g: 297,
    pPer100g: 5.0,
    cPer100g: 41.0,
    fPer100g: 9.5,
    fiberPer100g: 1.5,
  },
  {
    name: "Fresh Blueberries",
    category: "fruits" as const,
    calPer100g: 57,
    pPer100g: 0.7,
    cPer100g: 14.5,
    fPer100g: 0.3,
    fiberPer100g: 2.4,
  },
  {
    name: "Maple Syrup",
    category: "carbs" as const,
    calPer100g: 260,
    pPer100g: 0.0,
    cPer100g: 67.0,
    fPer100g: 0.0,
    fiberPer100g: 0.0,
  },
  {
    name: "Salmon Fillet",
    category: "protein" as const,
    calPer100g: 208,
    pPer100g: 22.0,
    cPer100g: 0.0,
    fPer100g: 13.0,
    fiberPer100g: 0.0,
  },
  {
    name: "Broccoli Florets",
    category: "veggies" as const,
    calPer100g: 35,
    pPer100g: 2.8,
    cPer100g: 7.0,
    fPer100g: 0.4,
    fiberPer100g: 2.6,
  },
  {
    name: "Seasoning & Olive Oil",
    category: "fats" as const,
    calPer100g: 884,
    pPer100g: 0.0,
    cPer100g: 0.0,
    fPer100g: 100.0,
    fiberPer100g: 0.0,
  },
  {
    name: "Spring Onions",
    category: "veggies" as const,
    calPer100g: 32,
    pPer100g: 1.8,
    cPer100g: 7.3,
    fPer100g: 0.2,
    fiberPer100g: 2.6,
  },
  {
    name: "Grilled Chicken Breast",
    category: "protein" as const,
    calPer100g: 150,
    pPer100g: 31.0,
    cPer100g: 0.0,
    fPer100g: 2.5,
    fiberPer100g: 0.0,
  },
  {
    name: "Sweet Potato",
    category: "carbs" as const,
    calPer100g: 104,
    pPer100g: 1.8,
    cPer100g: 24.0,
    fPer100g: 0.2,
    fiberPer100g: 3.2,
  },
  {
    name: "Fresh Avocado",
    category: "fats" as const,
    calPer100g: 160,
    pPer100g: 2.0,
    cPer100g: 8.5,
    fPer100g: 14.7,
    fiberPer100g: 6.7,
  },
  {
    name: "Cooked White Rice",
    category: "carbs" as const,
    calPer100g: 130,
    pPer100g: 2.7,
    cPer100g: 28.0,
    fPer100g: 0.3,
    fiberPer100g: 1.8,
  },
  {
    name: "Whole Eggs",
    category: "protein" as const,
    calPer100g: 143,
    pPer100g: 12.6,
    cPer100g: 0.8,
    fPer100g: 9.6,
    fiberPer100g: 0.0,
  },
  {
    name: "Rolled Oats",
    category: "carbs" as const,
    calPer100g: 375,
    pPer100g: 13.5,
    cPer100g: 66.0,
    fPer100g: 6.8,
    fiberPer100g: 10.0,
  },
  {
    name: "Banana",
    category: "fruits" as const,
    calPer100g: 89,
    pPer100g: 1.1,
    cPer100g: 23.0,
    fPer100g: 0.3,
    fiberPer100g: 2.6,
  },
  {
    name: "Grated Cheese",
    category: "dairy" as const,
    calPer100g: 350,
    pPer100g: 25.0,
    cPer100g: 1.3,
    fPer100g: 28.0,
    fiberPer100g: 0.0,
  },
];

const CAL_AI_SAMPLE_MEALS: SampleMealModel[] = [
  {
    id: "calai-pancakes",
    title: "Pancakes with blueberries & syrup",
    time: "9:41 AM",
    mealType: "Breakfast",
    img: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80",
    servings: 1,
    healthScore: 7,
    calories: 615,
    protein: 11,
    carbs: 93,
    fat: 21,
    calloutPins: [
      { name: "Blueberries", calories: 8, topPct: 10, leftPct: 18 },
      { name: "Syrup", calories: 12, topPct: 32, leftPct: 6 },
      { name: "Pancakes", calories: 595, topPct: 20, rightPct: 6 },
    ],
    ingredients: [
      {
        id: "ing-1",
        name: "Pancakes",
        category: "carbs",
        grams: 200,
        calories: 595,
        protein: 10.0,
        carbs: 82.0,
        fat: 19.0,
        fiber: 3.0,
        calPer100g: 297,
        pPer100g: 5.0,
        cPer100g: 41.0,
        fPer100g: 9.5,
        fiberPer100g: 1.5,
      },
      {
        id: "ing-2",
        name: "Blueberries",
        category: "fruits",
        grams: 15,
        calories: 8,
        protein: 0.1,
        carbs: 2.1,
        fat: 0.0,
        fiber: 0.4,
        calPer100g: 57,
        pPer100g: 0.7,
        cPer100g: 14.5,
        fPer100g: 0.3,
        fiberPer100g: 2.4,
      },
      {
        id: "ing-3",
        name: "Syrup",
        category: "carbs",
        grams: 10,
        calories: 12,
        protein: 0.0,
        carbs: 8.9,
        fat: 0.0,
        fiber: 0.0,
        calPer100g: 260,
        pPer100g: 0.0,
        cPer100g: 67.0,
        fPer100g: 0.0,
        fiberPer100g: 0.0,
      },
    ],
  },
  {
    id: "calai-salmon",
    title: "Salmon and Broccoli Tray Bake",
    time: "12:46 PM",
    mealType: "Lunch",
    img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
    servings: 1,
    healthScore: 7,
    calories: 621,
    protein: 52,
    carbs: 20,
    fat: 36,
    calloutPins: [
      { name: "Salmon", calories: 437, topPct: 24, leftPct: 15 },
      { name: "Broccoli", calories: 63, topPct: 12, rightPct: 12 },
      { name: "Olive Oil", calories: 106, topPct: 40, leftPct: 8 },
      { name: "Spring Onions", calories: 15, topPct: 35, rightPct: 10 },
    ],
    ingredients: [
      {
        id: "ing-1",
        name: "Salmon Fillet",
        category: "protein",
        grams: 210,
        calories: 437,
        protein: 46.2,
        carbs: 0.0,
        fat: 27.3,
        fiber: 0.0,
        calPer100g: 208,
        pPer100g: 22.0,
        cPer100g: 0.0,
        fPer100g: 13.0,
        fiberPer100g: 0.0,
      },
      {
        id: "ing-2",
        name: "Broccoli Florets",
        category: "veggies",
        grams: 180,
        calories: 63,
        protein: 5.0,
        carbs: 12.6,
        fat: 0.7,
        fiber: 4.7,
        calPer100g: 35,
        pPer100g: 2.8,
        cPer100g: 7.0,
        fPer100g: 0.4,
        fiberPer100g: 2.6,
      },
      {
        id: "ing-3",
        name: "Seasoning & Olive Oil",
        category: "fats",
        grams: 12,
        calories: 106,
        protein: 0.0,
        carbs: 0.0,
        fat: 12.0,
        fiber: 0.0,
        calPer100g: 884,
        pPer100g: 0.0,
        cPer100g: 0.0,
        fPer100g: 100.0,
        fiberPer100g: 0.0,
      },
      {
        id: "ing-4",
        name: "Spring Onions",
        category: "veggies",
        grams: 45,
        calories: 15,
        protein: 0.8,
        carbs: 3.3,
        fat: 0.1,
        fiber: 1.2,
        calPer100g: 32,
        pPer100g: 1.8,
        cPer100g: 7.3,
        fPer100g: 0.2,
        fiberPer100g: 2.6,
      },
    ],
  },
  {
    id: "calai-chicken",
    title: "Grilled Chicken & Sweet Potato Bowl",
    time: "01:15 PM",
    mealType: "Lunch",
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    servings: 1,
    healthScore: 9,
    calories: 518,
    protein: 42,
    carbs: 48,
    fat: 16,
    calloutPins: [
      { name: "Chicken", calories: 240, topPct: 20, leftPct: 15 },
      { name: "Sweet Potato", calories: 156, topPct: 22, rightPct: 12 },
      { name: "Avocado", calories: 88, topPct: 42, leftPct: 10 },
    ],
    ingredients: [
      {
        id: "ing-1",
        name: "Grilled Chicken Breast",
        category: "protein",
        grams: 160,
        calories: 240,
        protein: 49.6,
        carbs: 0.0,
        fat: 4.0,
        fiber: 0.0,
        calPer100g: 150,
        pPer100g: 31.0,
        cPer100g: 0.0,
        fPer100g: 2.5,
        fiberPer100g: 0.0,
      },
      {
        id: "ing-2",
        name: "Baked Sweet Potato",
        category: "carbs",
        grams: 150,
        calories: 156,
        protein: 2.7,
        carbs: 36.0,
        fat: 0.3,
        fiber: 4.8,
        calPer100g: 104,
        pPer100g: 1.8,
        cPer100g: 24.0,
        fPer100g: 0.2,
        fiberPer100g: 3.2,
      },
      {
        id: "ing-3",
        name: "Fresh Avocado",
        category: "fats",
        grams: 55,
        calories: 88,
        protein: 1.1,
        carbs: 4.7,
        fat: 8.1,
        fiber: 3.7,
        calPer100g: 160,
        pPer100g: 2.0,
        cPer100g: 8.5,
        fPer100g: 14.7,
        fiberPer100g: 6.7,
      },
    ],
  },
  {
    id: "calai-pho",
    title: "Vietnamese Chicken Phở Bowl",
    time: "08:15 PM",
    mealType: "Dinner",
    img: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80",
    servings: 1,
    healthScore: 8,
    calories: 465,
    protein: 38,
    carbs: 58,
    fat: 8,
    calloutPins: [
      { name: "Chicken", calories: 210, topPct: 22, leftPct: 15 },
      { name: "Rice Noodles", calories: 216, topPct: 35, rightPct: 15 },
      { name: "Bean Sprouts", calories: 25, topPct: 15, rightPct: 20 },
    ],
    ingredients: [
      {
        id: "ing-1",
        name: "Shredded Chicken Breast",
        category: "protein",
        grams: 140,
        calories: 210,
        protein: 43.4,
        carbs: 0.0,
        fat: 3.5,
        fiber: 0.0,
        calPer100g: 150,
        pPer100g: 31.0,
        cPer100g: 0.0,
        fPer100g: 2.5,
        fiberPer100g: 0.0,
      },
      {
        id: "ing-2",
        name: "Rice Noodles",
        category: "carbs",
        grams: 160,
        calories: 216,
        protein: 4.0,
        carbs: 46.4,
        fat: 0.6,
        fiber: 1.6,
        calPer100g: 135,
        pPer100g: 2.5,
        cPer100g: 29.0,
        fPer100g: 0.4,
        fiberPer100g: 1.0,
      },
      {
        id: "ing-3",
        name: "Bean Sprouts & Herbs",
        category: "veggies",
        grams: 80,
        calories: 25,
        protein: 2.4,
        carbs: 4.0,
        fat: 0.2,
        fiber: 2.2,
        calPer100g: 31,
        pPer100g: 3.0,
        cPer100g: 5.0,
        fPer100g: 0.3,
        fiberPer100g: 2.8,
      },
    ],
  },
];

interface PhotoMealAnalysisModalProps {
  onClose: () => void;
  onSave: (mealData: {
    title: string;
    mealType?: string;
    img: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
    healthScore: number;
    scoreGrade: string;
    ingredients: MealIngredientItem[];
    desc: string;
    summary: string;
    coachFeedback: string;
    tag: string;
  }) => void;
}

function PhotoMealAnalysisModal({ onClose, onSave }: PhotoMealAnalysisModalProps) {
  // Screen state machine: "scanner" -> "nutrition" -> "fix"
  const [currentScreen, setCurrentScreen] = useState<"scanner" | "nutrition" | "fix">("scanner");

  // Camera Ref & State
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCameraLoading, setIsCameraLoading] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraFacing, setCameraFacing] = useState<"environment" | "user">("environment");
  const [selectedCameraId, setSelectedCameraId] = useState<string>("");
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [activeCameraLabel, setActiveCameraLabel] = useState<string>("");

  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [isScanningLaser, setIsScanningLaser] = useState(false);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [activeTab, setActiveTab] = useState<"scan" | "barcode" | "gallery" | "saved" | "manual">(
    "scan",
  );
  const [showOptions, setShowOptions] = useState(false);

  const initialSample = CAL_AI_SAMPLE_MEALS[selectedSampleIndex];
  const [title, setTitle] = useState(initialSample.title);
  const [mealType, setMealType] = useState(initialSample.mealType);
  const [servings, setServings] = useState(1);
  const [ingredients, setIngredients] = useState<MealIngredientItem[]>(
    initialSample.ingredients.map((i) => ({ ...i })),
  );
  const [calloutPins, setCalloutPins] = useState<MealCalloutPin[]>(initialSample.calloutPins);

  // "Describe with AI" state in Fix Results
  const [aiPromptText, setAiPromptText] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Quick Add Food State
  const [isAddFoodOpen, setIsAddFoodOpen] = useState(false);
  const [foodSearchQuery, setFoodSearchQuery] = useState("");
  const [selectedAddFood, setSelectedAddFood] = useState(COMMON_FOODS_DATABASE[0]);
  const [addGrams, setAddGrams] = useState(100);

  const activeImage = customImage || initialSample.img;

  // Safely stop stream tracks
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  }, []);

  // Start camera with graceful progressive fallback
  const startCamera = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setCameraError("La cámara no está disponible o no es compatible con este navegador.");
      setIsCameraLoading(false);
      return;
    }

    setIsCameraLoading(true);
    setCameraError(null);
    stopStream();

    const constraintsToTry: MediaStreamConstraints[] = [];

    // 1. If specific device selected
    if (selectedCameraId) {
      constraintsToTry.push({
        video: {
          deviceId: { ideal: selectedCameraId },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });
    }

    // 2. Ideal facing mode
    constraintsToTry.push({
      video: {
        facingMode: { ideal: cameraFacing },
        width: { ideal: 1920 },
        height: { ideal: 1080 },
      },
      audio: false,
    });

    // 3. Fallback opposite facing mode
    constraintsToTry.push({
      video: {
        facingMode: { ideal: cameraFacing === "environment" ? "user" : "environment" },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    });

    // 4. Universal fallback
    constraintsToTry.push({
      video: true,
      audio: false,
    });

    let activeStream: MediaStream | null = null;
    let lastError: unknown = null;

    for (const constraints of constraintsToTry) {
      try {
        activeStream = await navigator.mediaDevices.getUserMedia(constraints);
        if (activeStream) break;
      } catch (err) {
        lastError = err;
      }
    }

    if (!activeStream) {
      console.warn("Camera stream acquisition failed:", lastError);
      setIsCameraActive(false);
      setIsCameraLoading(false);
      setCameraError("No se pudo conectar con la cámara. Verifica los permisos del navegador.");
      return;
    }

    streamRef.current = activeStream;
    if (videoRef.current) {
      videoRef.current.srcObject = activeStream;
      videoRef.current.play().catch((err) => {
        console.warn("Video autoplay error:", err);
      });
    }

    setIsCameraActive(true);
    setIsCameraLoading(false);

    const activeTrack = activeStream.getVideoTracks()[0];
    if (activeTrack) {
      setActiveCameraLabel(activeTrack.label || "Cámara Activa");
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((d) => d.kind === "videoinput" && d.deviceId);
      setAvailableCameras(videoDevices);
    } catch (err) {
      console.warn("Error enumerating devices:", err);
    }
  }, [selectedCameraId, cameraFacing, stopStream]);

  // Synchronize stream lifecycle with scanner screen
  useEffect(() => {
    if (currentScreen === "scanner" && !customImage) {
      startCamera();
    } else {
      stopStream();
    }

    return () => {
      stopStream();
    };
  }, [currentScreen, customImage, startCamera, stopStream]);

  // Ensure srcObject is attached whenever video element re-renders
  useEffect(() => {
    if (videoRef.current && streamRef.current && videoRef.current.srcObject !== streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  });

  // Toggle Camera Front / Back or Switch Next Device
  const handleToggleCameraFacing = () => {
    if (availableCameras.length > 1) {
      const currentIdx = availableCameras.findIndex((c) => c.deviceId === selectedCameraId);
      const nextIdx = (currentIdx + 1) % availableCameras.length;
      const nextDev = availableCameras[nextIdx];
      setSelectedCameraId(nextDev.deviceId);
      setActiveCameraLabel(nextDev.label || `Cámara ${nextIdx + 1}`);
      toast.info(`Cambiando a: ${nextDev.label || `Cámara ${nextIdx + 1}`}`);
    } else {
      const newFacing = cameraFacing === "environment" ? "user" : "environment";
      setCameraFacing(newFacing);
      setSelectedCameraId("");
      toast.info(newFacing === "user" ? "Cámara frontal" : "Cámara trasera");
    }
  };

  // Toggle Flashlight/Torch
  const handleToggleFlashlight = async () => {
    const nextState = !flashlightOn;
    setFlashlightOn(nextState);
    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0];
      if (track) {
        try {
          const capabilities = (track.getCapabilities && track.getCapabilities()) as any;
          if (capabilities && "torch" in capabilities) {
            await (track as any).applyConstraints({
              advanced: [{ torch: nextState }],
            });
          }
        } catch (e) {
          console.warn("Torch constraint not supported:", e);
        }
      }
    }
  };

  const handleSelectSample = (idx: number) => {
    setSelectedSampleIndex(idx);
    setCustomImage(null);
    const sample = CAL_AI_SAMPLE_MEALS[idx];
    setTitle(sample.title);
    setMealType(sample.mealType);
    setServings(sample.servings);
    setIngredients(sample.ingredients.map((i) => ({ ...i })));
    setCalloutPins(sample.calloutPins);
    setShowOptions(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setCustomImage(result);
        setTitle("Pancakes with blueberries & syrup");
        setMealType("Breakfast");
        setServings(1);
        setCalloutPins([
          { name: "Blueberries", calories: 8, topPct: 10, leftPct: 18 },
          { name: "Syrup", calories: 12, topPct: 32, leftPct: 6 },
          { name: "Pancakes", calories: 595, topPct: 20, rightPct: 6 },
        ]);
        setIngredients([
          {
            id: `c-ing-1`,
            name: "Pancakes",
            category: "carbs",
            grams: 200,
            calories: 595,
            protein: 10.0,
            carbs: 82.0,
            fat: 19.0,
            fiber: 3.0,
            calPer100g: 297,
            pPer100g: 5.0,
            cPer100g: 41.0,
            fPer100g: 9.5,
            fiberPer100g: 1.5,
          },
          {
            id: `c-ing-2`,
            name: "Blueberries",
            category: "fruits",
            grams: 15,
            calories: 8,
            protein: 0.1,
            carbs: 2.1,
            fat: 0.0,
            fiber: 0.4,
            calPer100g: 57,
            pPer100g: 0.7,
            cPer100g: 14.5,
            fPer100g: 0.3,
            fiberPer100g: 2.4,
          },
          {
            id: `c-ing-3`,
            name: "Syrup",
            category: "carbs",
            grams: 10,
            calories: 12,
            protein: 0.0,
            carbs: 8.9,
            fat: 0.0,
            fiber: 0.0,
            calPer100g: 260,
            pPer100g: 0.0,
            cPer100g: 67.0,
            fPer100g: 0.0,
            fiberPer100g: 0.0,
          },
        ]);
        triggerCaptureScan();
      };
      reader.readAsDataURL(file);
    }
  };

  // Shutter button trigger -> sweeps laser and transitions to Nutrition
  const triggerCaptureScan = () => {
    setIsScanningLaser(true);

    if (videoRef.current && isCameraActive && !customImage) {
      const video = videoRef.current;
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          if (cameraFacing === "user" && !selectedCameraId) {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
          }
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const screenshot = canvas.toDataURL("image/jpeg", 0.92);
          setCustomImage(screenshot);
        }
      }
    }

    setTimeout(() => {
      setIsScanningLaser(false);
      setCurrentScreen("nutrition");
      toast.success("✓ Cal AI analyzed food & macros");
    }, 600);
  };

  // Calculations
  const baseCalories = useMemo(() => {
    return Math.round(ingredients.reduce((acc, item) => acc + item.calories, 0));
  }, [ingredients]);

  const baseProtein = useMemo(() => {
    return Math.round(ingredients.reduce((acc, item) => acc + item.protein, 0));
  }, [ingredients]);

  const baseCarbs = useMemo(() => {
    return Math.round(ingredients.reduce((acc, item) => acc + item.carbs, 0));
  }, [ingredients]);

  const baseFat = useMemo(() => {
    return Math.round(ingredients.reduce((acc, item) => acc + item.fat, 0));
  }, [ingredients]);

  const baseFiber = useMemo(() => {
    return Math.round(ingredients.reduce((acc, item) => acc + (item.fiber || 0), 0) * 10) / 10;
  }, [ingredients]);

  // Scaled totals based on servings
  const totalCalories = Math.round(baseCalories * servings);
  const totalProtein = Math.round(baseProtein * servings);
  const totalCarbs = Math.round(baseCarbs * servings);
  const totalFat = Math.round(baseFat * servings);
  const totalFiber = Math.round(baseFiber * servings * 10) / 10;

  const healthScore = initialSample.healthScore || 7;

  // Stepper quantity update inside Fix Results
  const handleUpdateGrams = (id: string, delta: number) => {
    setIngredients((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const newGrams = Math.max(5, item.grams + delta);
        const ratio = newGrams / 100;
        return {
          ...item,
          grams: newGrams,
          calories: Math.round(item.calPer100g * ratio),
          protein: Math.round(item.pPer100g * ratio * 10) / 10,
          carbs: Math.round(item.cPer100g * ratio * 10) / 10,
          fat: Math.round(item.fPer100g * ratio * 10) / 10,
          fiber: Math.round(item.fiberPer100g * ratio * 10) / 10,
        };
      }),
    );
  };

  const handleDeleteIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((item) => item.id !== id));
    toast.info("Item removed");
  };

  const handleAddIngredientSubmit = () => {
    const food = selectedAddFood;
    const ratio = addGrams / 100;
    const newItem: MealIngredientItem = {
      id: `added-${Date.now()}`,
      name: food.name,
      category: food.category,
      grams: addGrams,
      calories: Math.round(food.calPer100g * ratio),
      protein: Math.round(food.pPer100g * ratio * 10) / 10,
      carbs: Math.round(food.cPer100g * ratio * 10) / 10,
      fat: Math.round(food.fPer100g * ratio * 10) / 10,
      fiber: Math.round(food.fiberPer100g * ratio * 10) / 10,
      calPer100g: food.calPer100g,
      pPer100g: food.pPer100g,
      cPer100g: food.cPer100g,
      fPer100g: food.fPer100g,
      fiberPer100g: food.fiberPer100g,
    };
    setIngredients((prev) => [...prev, newItem]);
    setIsAddFoodOpen(false);
    toast.success(`✓ Added ${food.name} (${addGrams}g)`);
  };

  const handleApplyAiPrompt = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiPromptText.trim()) return;

    setIsAiThinking(true);
    setTimeout(() => {
      const lower = aiPromptText.toLowerCase();
      if (lower.includes("oil") || lower.includes("aceite")) {
        setIngredients((prev) =>
          prev.map((i) =>
            i.name.toLowerCase().includes("oil") ? { ...i, grams: 6, calories: 53, fat: 6 } : i,
          ),
        );
      } else if (lower.includes("no syrup") || lower.includes("sin sirope")) {
        setIngredients((prev) =>
          prev.filter(
            (i) =>
              !i.name.toLowerCase().includes("syrup") && !i.name.toLowerCase().includes("sirope"),
          ),
        );
      } else if (lower.includes("more blueberries") || lower.includes("más arándanos")) {
        setIngredients((prev) =>
          prev.map((i) =>
            i.name.toLowerCase().includes("blueberries")
              ? { ...i, grams: 50, calories: 28, carbs: 7.2 }
              : i,
          ),
        );
      } else if (lower.includes("egg") || lower.includes("huevo")) {
        const newItem: MealIngredientItem = {
          id: `ai-egg-${Date.now()}`,
          name: "Boiled Egg (1 pc)",
          category: "protein",
          grams: 50,
          calories: 72,
          protein: 6.3,
          carbs: 0.4,
          fat: 4.8,
          fiber: 0.0,
          calPer100g: 143,
          pPer100g: 12.6,
          cPer100g: 0.8,
          fPer100g: 9.6,
          fiberPer100g: 0.0,
        };
        setIngredients((prev) => [...prev, newItem]);
      }

      setIsAiThinking(false);
      setAiPromptText("");
      toast.success("✓ Cal AI adjusted the meal");
    }, 600);
  };

  const handleSaveToDiary = () => {
    onSave({
      title: title,
      mealType: mealType || "Breakfast",
      img: activeImage,
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat,
      fiber: totalFiber,
      sugar: 12.0,
      sodium: 420,
      healthScore: healthScore,
      scoreGrade: healthScore >= 8 ? "A+" : healthScore >= 6 ? "B" : "C",
      ingredients: ingredients,
      desc: ingredients.map((i) => `${i.name} (${Math.round(i.grams * servings)}g)`).join(", "),
      summary: `${title} with ${totalCalories} kcal, ${totalProtein}g protein, ${totalCarbs}g carbs and ${totalFat}g fats.`,
      coachFeedback: `Health score ${healthScore}/10: Balanced breakfast portion.`,
      tag: `${totalCalories} kcal • ${totalCarbs}g C | ${totalProtein}g P | ${totalFat}g G`,
    });
    onClose();
  };

  const filteredFoods = COMMON_FOODS_DATABASE.filter((f) =>
    f.name.toLowerCase().includes(foodSearchQuery.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-50 w-screen h-[100dvh] bg-slate-950 text-foreground overflow-hidden flex flex-col justify-between select-none animate-in fade-in duration-200">
      {/* ========================================================================= */}
      {/* SCREEN 1: SCANNER FULL SCREEN (Takes 100% of the entire viewport)         */}
      {/* ========================================================================= */}
      {currentScreen === "scanner" && (
        <div className="relative w-full h-full flex flex-col justify-between overflow-hidden">
          {/* Full Screen Viewfinder: Native HTML5 Video Stream or Custom Image */}
          <div className="absolute inset-0 z-0 bg-black flex items-center justify-center overflow-hidden">
            {!customImage ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                onLoadedMetadata={() => {
                  videoRef.current?.play().catch(() => {});
                }}
                className={cn(
                  "w-full h-full object-cover",
                  cameraFacing === "user" && !selectedCameraId && "-scale-x-100",
                )}
              />
            ) : (
              <img
                src={activeImage}
                alt="Scanner Viewfinder"
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/25 pointer-events-none" />

            {/* Flashlight overlay effect */}
            {flashlightOn && <div className="absolute inset-0 bg-white/20 pointer-events-none" />}

            {/* Dynamic Laser Scanning Beam */}
            {isScanningLaser && (
              <div className="absolute inset-0 pointer-events-none z-30">
                <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_30px_#10b981] animate-laser-scan" />
                <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-[1px]" />
              </div>
            )}

            {/* Camera Status Loading */}
            {isCameraLoading && !customImage && (
              <div className="absolute top-24 z-20 px-4 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                <span>Conectando cámara...</span>
              </div>
            )}

            {cameraError && !customImage && (
              <div className="absolute top-24 z-20 px-4 py-2.5 rounded-2xl bg-black/85 backdrop-blur-md border border-white/15 text-white text-xs max-w-xs text-center space-y-2 shadow-2xl">
                <p className="text-amber-300 font-semibold">{cameraError}</p>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      startCamera();
                    }}
                    className="px-3 py-1 bg-white text-black rounded-lg font-bold text-[11px] cursor-pointer hover:bg-slate-200"
                  >
                    Reintentar Conexión
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Top Bar: Back, Scanner Title, Options */}
          <div className="relative z-20 pt-6 sm:pt-8 px-6 max-w-lg mx-auto w-full flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="w-11 h-11 rounded-full bg-black/40 text-white backdrop-blur-md flex items-center justify-center hover:scale-105 active:scale-95 transition cursor-pointer border border-white/10 shadow-lg"
              aria-label="Cerrar Escáner"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center">
              <span className="text-white font-bold text-lg tracking-wide drop-shadow-md">
                Scanner
              </span>
              {isCameraActive && !customImage && (
                <span className="text-[10px] text-emerald-400 font-mono font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  {activeCameraLabel ? activeCameraLabel.slice(0, 22) : "CÁMARA EN VIVO"}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowOptions(!showOptions)}
              className="w-11 h-11 rounded-full bg-black/40 text-white backdrop-blur-md flex items-center justify-center hover:scale-105 active:scale-95 transition cursor-pointer border border-white/10 shadow-lg"
              aria-label="Opciones"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Sample Dish & Camera Device Selector Dropdown */}
          {showOptions && (
            <div className="absolute top-20 right-6 sm:right-auto sm:left-1/2 sm:translate-x-24 z-40 bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-2.5 shadow-2xl space-y-2 w-64 animate-in fade-in zoom-in-95 text-left max-h-[80vh] overflow-y-auto custom-scrollbar">
              {/* Camera Hardware Device List */}
              {availableCameras.length > 0 && (
                <div className="space-y-1 pb-2 border-b border-border/50">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 block">
                    Dispositivos de Cámara:
                  </span>
                  {availableCameras.map((cam, idx) => (
                    <button
                      key={cam.deviceId || idx}
                      type="button"
                      onClick={() => {
                        setCustomImage(null);
                        setSelectedCameraId(cam.deviceId);
                        setActiveCameraLabel(cam.label || `Cámara ${idx + 1}`);
                        setShowOptions(false);
                        toast.success(`Cámara: ${cam.label || `Cámara ${idx + 1}`}`);
                      }}
                      className={cn(
                        "w-full text-left text-xs font-semibold px-2.5 py-1.5 rounded-xl transition cursor-pointer flex items-center justify-between",
                        selectedCameraId === cam.deviceId
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30"
                          : "hover:bg-secondary text-foreground",
                      )}
                    >
                      <span className="truncate">{cam.label || `Cámara ${idx + 1}`}</span>
                      {selectedCameraId === cam.deviceId && (
                        <Check className="w-3.5 h-3.5 shrink-0 ml-1 text-emerald-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 block">
                Platos de Muestra:
              </span>
              {CAL_AI_SAMPLE_MEALS.map((sample, idx) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleSelectSample(idx)}
                  className={cn(
                    "w-full text-left text-xs font-semibold px-2.5 py-2 rounded-xl transition cursor-pointer flex items-center justify-between",
                    selectedSampleIndex === idx && !customImage
                      ? "bg-foreground text-background font-bold"
                      : "hover:bg-secondary text-foreground",
                  )}
                >
                  <span className="truncate">{sample.title}</span>
                  <span className="text-[10px] opacity-70 ml-1 shrink-0 font-mono">
                    {sample.calories} kcal
                  </span>
                </button>
              ))}

              <div className="pt-2 border-t border-border/50 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setCustomImage(null);
                    setShowOptions(false);
                  }}
                  className="w-full text-left text-xs font-bold px-2.5 py-1.5 rounded-xl text-emerald-600 dark:text-emerald-400 hover:bg-secondary flex items-center gap-1.5 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Activar Cámara en Vivo</span>
                </button>
              </div>
            </div>
          )}

          {/* Camera Reticle / 4 Corner Brackets around the plate */}
          <div className="relative z-10 mx-auto my-auto w-72 h-72 sm:w-84 sm:h-84 pointer-events-none flex flex-col justify-between p-1">
            <div className="flex justify-between">
              <div className="w-10 h-10 border-t-3 border-l-3 border-white rounded-tl-2xl drop-shadow-lg" />
              <div className="w-10 h-10 border-t-3 border-r-3 border-white rounded-tr-2xl drop-shadow-lg" />
            </div>
            <div className="flex justify-between">
              <div className="w-10 h-10 border-b-3 border-l-3 border-white rounded-bl-2xl drop-shadow-lg" />
              <div className="w-10 h-10 border-b-3 border-r-3 border-white rounded-br-2xl drop-shadow-lg" />
            </div>
          </div>

          {/* Bottom Controls Area */}
          <div className="relative z-20 pb-8 sm:pb-12 px-6 max-w-md mx-auto w-full space-y-6">
            {/* Floating Dock Navigation Bar */}
            <div className="bg-white/85 dark:bg-black/75 backdrop-blur-xl rounded-full p-1.5 flex items-center justify-between shadow-2xl border border-white/30">
              {/* Active Scan Food Button */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab("scan");
                  setCustomImage(null);
                }}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition cursor-pointer",
                  activeTab === "scan"
                    ? "bg-white text-black shadow-md font-extrabold"
                    : "text-foreground hover:bg-white/40",
                )}
              >
                <Utensils className="w-4 h-4" />
                <span>Scan food</span>
              </button>

              {/* Barcode Button */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab("barcode");
                  toast.info("Barcode scanner mode active");
                }}
                className="p-2.5 text-foreground/80 hover:text-foreground hover:bg-white/40 rounded-full transition cursor-pointer"
                title="Barcode"
              >
                <Barcode className="w-4 h-4" />
              </button>

              {/* Gallery Upload Button */}
              <label className="p-2.5 text-foreground/80 hover:text-foreground hover:bg-white/40 rounded-full transition cursor-pointer">
                <ImageIcon className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Bookmark Button */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab("saved");
                  toast.info("Saved meals");
                }}
                className="p-2.5 text-foreground/80 hover:text-foreground hover:bg-white/40 rounded-full transition cursor-pointer"
                title="Saved"
              >
                <Bookmark className="w-4 h-4" />
              </button>

              {/* Manual Edit Button */}
              <button
                type="button"
                onClick={() => setCurrentScreen("fix")}
                className="p-2.5 text-foreground/80 hover:text-foreground hover:bg-white/40 rounded-full transition cursor-pointer"
                title="Manual Entry"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>

            {/* Shutter Capture Row */}
            <div className="flex items-center justify-between px-4">
              {/* Flashlight toggle */}
              <button
                type="button"
                onClick={handleToggleFlashlight}
                className={cn(
                  "w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center transition cursor-pointer border border-white/10 shadow-lg",
                  flashlightOn ? "bg-white text-black shadow-lg" : "bg-black/40 text-white",
                )}
                aria-label="Flashlight"
              >
                <Zap className="w-5 h-5" />
              </button>

              {/* Big White Shutter Button */}
              <button
                type="button"
                onClick={triggerCaptureScan}
                disabled={isScanningLaser}
                className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center hover:scale-105 active:scale-90 transition shadow-2xl cursor-pointer"
                aria-label="Capture & Scan"
              >
                <div className="w-14 h-14 rounded-full bg-white active:bg-slate-200 transition" />
              </button>

              {/* Toggle Front / Rear Camera or Switch Device */}
              <button
                type="button"
                onClick={handleToggleCameraFacing}
                className="w-12 h-12 rounded-full bg-black/40 text-white backdrop-blur-md flex items-center justify-center hover:scale-105 active:scale-95 transition cursor-pointer border border-white/10 shadow-lg"
                title="Cambiar Cámara"
                aria-label="Cambiar Cámara"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 2: NUTRITION RESULT VIEW (Desktop Centered / Mobile Full Height)    */}
      {/* ========================================================================= */}
      {currentScreen === "nutrition" && (
        <div className="relative w-full h-full flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md">
          <div className="max-w-md w-full h-full sm:h-[92vh] sm:max-h-[820px] rounded-none sm:rounded-[44px] overflow-hidden bg-background border-0 sm:border sm:border-border/80 shadow-2xl flex flex-col justify-between text-foreground">
            {/* Top Half: Photo with Floating Callouts */}
            <div className="relative w-full h-64 sm:h-72 bg-slate-900 shrink-0 overflow-hidden select-none">
              <img src={activeImage} alt={title} className="w-full h-full object-cover" />

              {/* Subtle top shadow for button legibility */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent pointer-events-none" />

              {/* Floating Header Actions */}
              <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-20">
                <button
                  type="button"
                  onClick={() => setCurrentScreen("scanner")}
                  className="w-10 h-10 rounded-full bg-black/40 text-white backdrop-blur-md flex items-center justify-center hover:scale-105 active:scale-95 transition shadow-sm cursor-pointer border-0"
                  aria-label="Back to Scanner"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <span className="text-white font-bold text-base tracking-wide drop-shadow-md">
                  Nutrition
                </span>

                <button
                  type="button"
                  onClick={() => setShowOptions(!showOptions)}
                  className="w-10 h-10 rounded-full bg-black/40 text-white backdrop-blur-md flex items-center justify-center hover:scale-105 active:scale-95 transition shadow-sm cursor-pointer border-0"
                  aria-label="Options"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              {/* Options Popover */}
              {showOptions && (
                <div className="absolute top-16 right-5 z-40 bg-card border border-border rounded-2xl p-2 shadow-2xl space-y-1 w-52 animate-in fade-in zoom-in-95 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 block">
                    Choose Food Dish:
                  </span>
                  {CAL_AI_SAMPLE_MEALS.map((sample, idx) => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => handleSelectSample(idx)}
                      className={cn(
                        "w-full text-left text-xs font-semibold px-2.5 py-1.5 rounded-xl transition cursor-pointer flex items-center justify-between",
                        selectedSampleIndex === idx && !customImage
                          ? "bg-foreground text-background font-bold"
                          : "hover:bg-secondary text-foreground",
                      )}
                    >
                      <span className="truncate">{sample.title}</span>
                      <span className="text-[10px] opacity-70 ml-1 shrink-0 font-mono">
                        {sample.calories} kcal
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* FLOATING FOOD CALLOUT BADGES */}
              {calloutPins.map((pin, idx) => {
                const style: React.CSSProperties = {
                  top: `${pin.topPct}%`,
                };
                if (pin.leftPct !== undefined) style.left = `${pin.leftPct}%`;
                if (pin.rightPct !== undefined) style.right = `${pin.rightPct}%`;

                return (
                  <div
                    key={idx}
                    style={style}
                    className="absolute z-10 bg-white/95 dark:bg-card text-foreground px-3.5 py-1.5 rounded-2xl shadow-xl border border-border/40 text-center animate-in fade-in zoom-in duration-300 pointer-events-none"
                  >
                    <span className="text-[11px] font-bold block leading-tight text-slate-800 dark:text-slate-100">
                      {pin.name}
                    </span>
                    <span className="text-sm font-black text-black dark:text-white leading-none mt-0.5 block">
                      {Math.round(pin.calories * servings)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Bottom Half: White Overlapping Sheet Card */}
            <div className="-mt-7 relative z-10 bg-background rounded-t-[32px] px-5 pt-4 pb-5 space-y-3 flex-1 overflow-y-auto custom-scrollbar text-left shadow-xl">
              {/* Category Pill: Breakfast / Lunch / Dinner */}
              <div>
                <span className="bg-secondary text-muted-foreground text-[11px] font-semibold px-3 py-1 rounded-full inline-block">
                  {mealType}
                </span>
              </div>

              {/* Title & Servings Stepper Row */}
              <div className="flex items-center justify-between gap-3 pt-0.5">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-foreground leading-tight flex-1">
                  {title}
                </h2>

                {/* Servings Stepper [ - 1 + ] */}
                <div className="flex items-center gap-2.5 px-3 py-1 rounded-full border border-border bg-card text-foreground font-bold text-xs shrink-0 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setServings(Math.max(0.5, servings - 0.5))}
                    className="text-muted-foreground hover:text-foreground cursor-pointer font-bold"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-black text-sm">{servings}</span>
                  <button
                    type="button"
                    onClick={() => setServings(servings + 0.5)}
                    className="text-muted-foreground hover:text-foreground cursor-pointer font-bold"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* 2x2 MACRO GRID (Calories, Carbs, Protein, Fats with pencil icons) */}
              <div className="grid grid-cols-2 gap-2.5 w-full">
                {/* Calories Card */}
                <div className="p-3 rounded-2xl bg-card border border-border/70 shadow-xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center text-foreground shrink-0">
                      <Flame className="w-4 h-4 fill-foreground text-foreground" />
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground font-medium block leading-none">
                        Calories
                      </span>
                      <span className="text-base font-black text-foreground tracking-tight leading-snug">
                        {totalCalories}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentScreen("fix")}
                    className="text-muted-foreground/60 hover:text-foreground cursor-pointer"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                </div>

                {/* Carbs Card */}
                <div className="p-3 rounded-2xl bg-card border border-border/70 shadow-xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                      <Wheat className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground font-medium block leading-none">
                        Carbs
                      </span>
                      <span className="text-base font-black text-foreground tracking-tight leading-snug">
                        {totalCarbs}g
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentScreen("fix")}
                    className="text-muted-foreground/60 hover:text-foreground cursor-pointer"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                </div>

                {/* Protein Card */}
                <div className="p-3 rounded-2xl bg-card border border-border/70 shadow-xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
                      <Beef className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground font-medium block leading-none">
                        Protein
                      </span>
                      <span className="text-base font-black text-foreground tracking-tight leading-snug">
                        {totalProtein}g
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentScreen("fix")}
                    className="text-muted-foreground/60 hover:text-foreground cursor-pointer"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                </div>

                {/* Fats Card */}
                <div className="p-3 rounded-2xl bg-card border border-border/70 shadow-xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-500 shrink-0">
                      <Droplet className="w-4 h-4 fill-sky-500" />
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground font-medium block leading-none">
                        Fats
                      </span>
                      <span className="text-base font-black text-foreground tracking-tight leading-snug">
                        {totalFat}g
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentScreen("fix")}
                    className="text-muted-foreground/60 hover:text-foreground cursor-pointer"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Health Score Card */}
              <div className="p-3.5 rounded-2xl bg-card border border-border/70 shadow-xs flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">Health score</span>
                    <span className="text-xs font-black text-foreground">{healthScore}/10</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (healthScore / 10) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Action Buttons: Fix Results & Done */}
              <div className="pt-2 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setCurrentScreen("fix")}
                  className="h-11 px-5 rounded-full border border-foreground bg-card text-foreground font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-secondary active:scale-98 transition cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-foreground" />
                  <span>Fix Results</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveToDiary}
                  className="h-11 px-6 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold text-xs flex-1 flex items-center justify-center hover:opacity-90 active:scale-98 transition cursor-pointer shadow-md"
                >
                  <span>Done</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 3: FIX RESULTS & EDIT INGREDIENTS SUB-SCREEN                       */}
      {/* ========================================================================= */}
      {currentScreen === "fix" && (
        <div className="relative w-full h-full flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md">
          <div className="max-w-md w-full h-full sm:h-[92vh] sm:max-h-[820px] rounded-none sm:rounded-[44px] overflow-hidden bg-background border-0 sm:border sm:border-border/80 shadow-2xl p-5 space-y-4 overflow-y-auto custom-scrollbar text-left flex flex-col justify-between text-foreground">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-border/50">
                <button
                  type="button"
                  onClick={() => setCurrentScreen("nutrition")}
                  className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Nutrition</span>
                </button>

                <span className="text-xs font-black uppercase text-foreground">Fix Results</span>
              </div>

              {/* Title Edit */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Meal Name
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-secondary/50 border border-border text-sm font-bold text-foreground focus:outline-none"
                />
              </div>

              {/* Describe with AI Prompt */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Describe Corrections with AI:</span>
                </label>
                <form onSubmit={handleApplyAiPrompt} className="flex gap-2">
                  <input
                    type="text"
                    value={aiPromptText}
                    onChange={(e) => setAiPromptText(e.target.value)}
                    placeholder="e.g. 'extra blueberries', 'no syrup', 'half portion'..."
                    className="flex-1 h-10 px-3 rounded-xl bg-secondary/50 border border-border text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                  <Button
                    type="submit"
                    disabled={isAiThinking || !aiPromptText.trim()}
                    className="h-10 px-4 rounded-xl font-bold bg-foreground text-background text-xs cursor-pointer shrink-0"
                  >
                    {isAiThinking ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                  </Button>
                </form>
              </div>

              {/* Servings Stepper Multiplier */}
              <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border/60 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-foreground block">
                    Servings Multiplier
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Scale ingredients & calories
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {[0.5, 1, 1.5, 2].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setServings(s)}
                      className={cn(
                        "px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer",
                        servings === s
                          ? "bg-foreground text-background"
                          : "bg-card border border-border hover:bg-secondary text-foreground",
                      )}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Detected Ingredients Edit List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">
                    Ingredients ({ingredients.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAddFoodOpen(true)}
                    className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>+ Add Ingredient</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-52 overflow-y-auto custom-scrollbar pr-1">
                  {ingredients.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-card border border-border/70 flex items-center justify-between gap-2 shadow-2xs"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-foreground block truncate">
                          {item.name}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-mono">
                          {Math.round(item.calories * servings)} kcal •{" "}
                          {Math.round(item.carbs * servings)}g C |{" "}
                          {Math.round(item.protein * servings)}g P
                        </span>
                      </div>

                      {/* Stepper */}
                      <div className="flex items-center gap-1 bg-secondary rounded-xl p-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleUpdateGrams(item.id, -20)}
                          className="w-6 h-6 rounded-lg bg-card text-foreground flex items-center justify-center font-bold text-xs cursor-pointer shadow-2xs"
                        >
                          -
                        </button>
                        <span className="text-xs font-mono font-bold px-1.5 min-w-8 text-center text-foreground">
                          {Math.round(item.grams * servings)}g
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateGrams(item.id, 20)}
                          className="w-6 h-6 rounded-lg bg-card text-foreground flex items-center justify-center font-bold text-xs cursor-pointer shadow-2xs"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteIngredient(item.id)}
                        className="p-1.5 text-muted-foreground hover:text-rose-500 transition cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Done Fixing Button */}
            <div className="pt-3 border-t border-border/40">
              <Button
                type="button"
                onClick={() => setCurrentScreen("nutrition")}
                className="w-full h-12 rounded-full font-bold bg-foreground text-background hover:opacity-90 transition cursor-pointer shadow-md text-sm"
              >
                Save &amp; View Nutrition ({totalCalories} kcal)
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK ADD FOOD MODAL */}
      {isAddFoodOpen && (
        <Dialog open onOpenChange={() => setIsAddFoodOpen(false)}>
          <DialogContent className="sm:max-w-md rounded-3xl p-6 bg-card border border-border max-h-[85vh] overflow-y-auto custom-scrollbar">
            <DialogHeader className="pb-2 border-b border-border/40 text-left">
              <DialogTitle className="text-base font-bold text-foreground">
                Add Ingredient
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Search common foods and choose portion size.
              </DialogDescription>
            </DialogHeader>

            <div className="py-3 space-y-4 text-left">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  value={foodSearchQuery}
                  onChange={(e) => setFoodSearchQuery(e.target.value)}
                  placeholder="Search pancakes, blueberries, syrup, chicken, eggs..."
                  className="w-full h-10 pl-9 pr-3 rounded-xl bg-secondary/50 border border-border text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              {/* Food List Selector */}
              <div className="max-h-44 overflow-y-auto custom-scrollbar space-y-1 pr-1">
                {filteredFoods.map((f) => {
                  const isSelected = selectedAddFood.name === f.name;
                  return (
                    <button
                      key={f.name}
                      type="button"
                      onClick={() => setSelectedAddFood(f)}
                      className={cn(
                        "w-full p-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition cursor-pointer border",
                        isSelected
                          ? "bg-foreground text-background font-bold border-foreground"
                          : "border-transparent hover:bg-secondary/70 text-foreground",
                      )}
                    >
                      <span>{f.name}</span>
                      <span className="text-[10px] font-mono opacity-70 font-normal">
                        {f.calPer100g} kcal / 100g
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Grams Input */}
              <div className="space-y-1.5 pt-2 border-t border-border/40">
                <label className="text-xs font-bold text-foreground block">
                  Portion in Grams (g):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={5}
                    max={1000}
                    step={10}
                    value={addGrams}
                    onChange={(e) => setAddGrams(Number(e.target.value) || 50)}
                    className="h-10 px-3 rounded-xl bg-secondary/50 border border-border text-sm font-bold font-mono w-28 text-foreground focus:outline-none"
                  />
                  <div className="flex items-center gap-1.5">
                    {[25, 50, 100, 150, 200].map((quickGrams) => (
                      <button
                        key={quickGrams}
                        type="button"
                        onClick={() => setAddGrams(quickGrams)}
                        className={cn(
                          "px-2 py-1.5 rounded-lg text-xs font-mono font-bold border transition cursor-pointer",
                          addGrams === quickGrams
                            ? "bg-foreground text-background border-foreground"
                            : "bg-card border-border hover:bg-secondary",
                        )}
                      >
                        {quickGrams}g
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border/40 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsAddFoodOpen(false)}
                className="rounded-xl font-semibold"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddIngredientSubmit}
                className="rounded-xl font-bold bg-foreground text-background"
              >
                Add to Meal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
