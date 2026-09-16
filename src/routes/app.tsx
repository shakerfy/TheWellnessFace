import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site-header";
import { BioStateCard } from "@/components/bio-state-card";
import { AdvancedSettingsView } from "@/components/advanced-settings-view";
import { useNutritionSettings } from "@/lib/nutrition-settings";
import {
  JournalInsightsDashboard,
  addStoredWeightLog,
} from "@/components/journal-insights";
import { calculateTimingFit, type TimingFit } from "@/lib/timing-fit";
import { FoodProfileHero, type FoodQualityLevel } from "@/components/food-profile-hero";
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
  Sprout,
  Scale,
  Target,
  HeartPulse,
  Timer,
  Users,
  ChefHat,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import {
  saveDietaryPreferenceToAiMemory,
  computeNutritionalVectors,
} from "@/lib/ai-suggestion-generator";
import { TypewriterText } from "@/components/typewriter-text";
import { NutritionFactsTable } from "@/components/nutrition-facts-table";
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
import { updateMuscleRecoveryForActivity, MUSCLE_GROUPS } from "@/lib/muscle-recovery";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { VagalBreathingDrawer } from "@/components/vagal-breathing-drawer";
import { useIsMobile } from "@/hooks/use-mobile";

export const Route = createFileRoute("/app")({
  validateSearch: (search: Record<string, unknown>): { tab?: string } => ({
    tab: typeof search?.tab === "string" ? search.tab : "inicio",
  }),
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
      "Se sugiere hidratarse con agua fresca para mantener un balance óptimo y evitar fatiga.",
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

function StudentDashboard() {
  const search = Route.useSearch();
  // ponytail: start with search.tab if present client-side, fallback to "inicio"
  const [activeTab, setActiveTab] = useState(() =>
    typeof window !== "undefined" && search?.tab && TABS.some((t) => t.id === search.tab)
      ? search.tab
      : "inicio",
  );

  useEffect(() => {
    if (search?.tab && TABS.some((t) => t.id === search.tab)) {
      setActiveTab(search.tab);
    }
  }, [search?.tab]);

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
    return () => {
      window.removeEventListener("popstate", updateTabFromUrl);
    };
  }, []);


  const [qrOpen, setQrOpen] = useState(false);
  const [scannerModalOpen, setScannerModalOpen] = useState(false);
  const [qrTimer, setQrTimer] = useState(60);
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
      className={`min-h-screen ${activeTab === "diario" ? "bg-[#f8fafc] dark:bg-background" : "bg-background"} text-foreground flex flex-col transition-colors duration-200 w-full`}
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
  const navigate = useNavigate();
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

      {/* Banner de Nutrition Intelligence Suite */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-foreground/30 hover:shadow-lg transition-all duration-300 text-left">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Suite de Inteligencia Nutricional
            </span>
            <Badge variant="outline" className="text-[9px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20 py-0 px-1.5 rounded-full">
              PRO
            </Badge>
          </div>
          <h3 className="text-lg font-bold text-foreground">
            Nutrition Intelligence Pro
          </h3>
          <p className="text-xs text-muted-foreground max-w-md">
            Desbloquea AI Food Scan, reporte semanal de hábitos y evolución biométrica de peso.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => navigate({ to: "/nutrition-intelligence" })}
          className="rounded-2xl text-xs font-bold px-4 h-10 bg-foreground text-background hover:bg-foreground/90 transition-all cursor-pointer shrink-0 gap-1"
        >
          <span>Conocer suite</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
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
export interface AiMemoryItem {
  id: string;
  text: string;
  domain?: "nutricion" | "entrenamiento";
  category?: "proteina" | "carbo" | "grasa" | "habito" | "intensidad" | "ejercicio" | "cuidado" | "general";
  createdAt?: string;
}

const DEFAULT_AI_MEMORIES: AiMemoryItem[] = [
  // Nutrición
  {
    id: "mem-1",
    text: "Prioriza pan de masa madre y granos enteros en desayunos",
    domain: "nutricion",
    category: "carbo",
  },
  {
    id: "mem-2",
    text: "Prefiere tofu marinado, pechuga de pollo y huevos como proteínas",
    domain: "nutricion",
    category: "proteina",
  },
  {
    id: "mem-3",
    text: "Grasas favoritas: Palta fresca, semillas de chía y frutos secos",
    domain: "nutricion",
    category: "grasa",
  },
  {
    id: "mem-4",
    text: "Suele optar por infusiones o bebidas vegetales ligeras sin azúcar",
    domain: "nutricion",
    category: "habito",
  },
  // Entrenamiento
  {
    id: "mem-5",
    text: "Ritmo de Fuerza & Hipertrofia óptimo: Mantener sobrecarga progresiva controlada",
    domain: "entrenamiento",
    category: "intensidad",
  },
  {
    id: "mem-6",
    text: "Prefiere ejercicios con banco ajustable, mancuernas y calentamiento articular guiado",
    domain: "entrenamiento",
    category: "ejercicio",
  },
  {
    id: "mem-7",
    text: "Prioriza descansos de 60-90s en series de alta demanda para cuidar técnica",
    domain: "entrenamiento",
    category: "cuidado",
  },
];

// Subcomponent: Config Tab (Perfil & Configuración)
function ConfigTab() {
  const navigate = useNavigate();
  const [subView, setSubView] = useState<
    "main" | "settings" | "edit-profile" | "ai-memory" | "app-settings" | "advanced-settings"
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

  // AI Memory State
  const [aiMemories, setAiMemories] = useState<AiMemoryItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("shakerfy_ai_memory");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (_) {}
    }
    return DEFAULT_AI_MEMORIES;
  });
  const [newMemoryText, setNewMemoryText] = useState("");
  const [memoryFilter, setMemoryFilter] = useState<"all" | "nutricion" | "entrenamiento">("all");

  // App Settings State
  const [theme, setTheme] = useState<"system" | "light" | "dark">("system");
  const [language, setLanguage] = useState("es");
  const [reminders, setReminders] = useState(true);

  useEffect(() => {
    const handleOpenSettingsEvent = () => {
      setSubView("settings");
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
  const [showWeightModal, setShowWeightModal] = useState(false);

  // Profile Completion Percentage Calculation (Gamificación sin bloqueo)
  const profileCompletion = useMemo(() => {
    let completedSteps = 0;
    const totalSteps = 5;

    if (fullName.trim().length > 0) completedSteps++;
    if (birthDate && sex) completedSteps++;
    if (height && weight && Number(height) > 0 && Number(weight) > 0) completedSteps++;
    if (goal) completedSteps++;
    if (aiMemories.length > 0) completedSteps++;

    return Math.round((completedSteps / totalSteps) * 100);
  }, [fullName, birthDate, sex, height, weight, goal, aiMemories]);

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
    setSubView("settings");
  };

  const handleDeleteMemory = (id: string) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(15);
      } catch (_) {}
    }
    setAiMemories((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      if (typeof window !== "undefined") {
        localStorage.setItem("shakerfy_ai_memory", JSON.stringify(updated));
      }
      return updated;
    });
    toast.info("Preferencia eliminada de la memoria");
  };

  const handleAddMemory = (text: string) => {
    if (!text.trim()) return;
    const lower = text.toLowerCase();
    let domain: AiMemoryItem["domain"] = "nutricion";
    let cat: AiMemoryItem["category"] = "general";

    if (/entreno|workout|fuerza|mancuerna|ejercicio|serie|repetic|sentadilla|press|hiit|cardio|músculo|rodilla|hombro|lumbar|articular/i.test(lower)) {
      domain = "entrenamiento";
      if (/ligero|pesado|extenuante|intensidad|carga|rpe|fallo/i.test(lower)) cat = "intensidad";
      else if (/rodilla|hombro|espalda|dolor|cuidado|molestia|articular|impacto|silencioso/i.test(lower)) cat = "cuidado";
      else cat = "ejercicio";
    } else {
      domain = "nutricion";
      if (/pollo|tofu|huevo|atún|salmón|proteína|carne|pavo|pescado/i.test(lower)) cat = "proteina";
      else if (/pan|avena|quinoa|arroz|papa|batata|carbo|masa madre|centeno/i.test(lower)) cat = "carbo";
      else if (/palta|aguacate|aceite|nuez|semilla|chía|grasa|maní|almendra/i.test(lower)) cat = "grasa";
      else if (/café|té|infusión|agua|leche|desayuno|cena|merienda|hábito|snack/i.test(lower)) cat = "habito";
    }

    const newMem: AiMemoryItem = {
      id: `mem-${Date.now()}`,
      text: text.trim(),
      domain: domain,
      category: cat,
      createdAt: new Date().toISOString(),
    };

    setAiMemories((prev) => {
      const updated = [newMem, ...prev];
      if (typeof window !== "undefined") {
        localStorage.setItem("shakerfy_ai_memory", JSON.stringify(updated));
      }
      return updated;
    });
    toast.success("Preferencia guardada en la memoria de la IA");
  };

  const handleClearAllMemories = () => {
    setAiMemories([]);
    if (typeof window !== "undefined") {
      localStorage.setItem("shakerfy_ai_memory", JSON.stringify([]));
    }
    toast.info("Memoria de la IA restablecida");
  };

  const handleSaveAppSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      const appSettingsData = { theme, language, reminders };
      localStorage.setItem("shakerfy_app_settings", JSON.stringify(appSettingsData));
    }
    toast.success("Configuración de la aplicación guardada");
    setSubView("settings");
  };

  const handleLogout = () => {
    setLogoutModalOpen(false);
    toast.success("Sesión cerrada correctamente");
    navigate({ to: "/" });
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

  // SUB-SCREEN 1: PERFIL (EDITAR PERFIL)
  if (subView === "edit-profile") {
    return (
      <div className="space-y-6 max-w-2xl mx-auto pb-16 animate-fade-in">
        <button
          type="button"
          onClick={() => setSubView("settings")}
          className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Volver a Ajustes
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
              onClick={() => setSubView("settings")}
              className="rounded-xl font-semibold cursor-pointer"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // SUB-SCREEN 2: MEMORIA & GUSTOS APRENDIDOS DE LA IA
  if (subView === "ai-memory") {
    const nutritionCount = aiMemories.filter((m) => m.domain !== "entrenamiento").length;
    const trainingCount = aiMemories.filter((m) => m.domain === "entrenamiento").length;

    const filteredMemories = aiMemories.filter((m) => {
      if (memoryFilter === "nutricion") return m.domain !== "entrenamiento";
      if (memoryFilter === "entrenamiento") return m.domain === "entrenamiento";
      return true;
    });

    return (
      <div className="space-y-6 max-w-3xl pb-16 animate-fade-in">
        <button
          type="button"
          onClick={() => setSubView("settings")}
          className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Volver a Ajustes
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Brain className="w-6 h-6 text-primary" /> Memoria & Preferencias de la IA
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              La IA aprende de lo que comes, tus rotaciones y tu feedback de entrenamientos. Puedes eliminar cualquier recuerdo para resetearlo.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Aprendizaje Activo
            </span>
          </div>
        </div>

        {/* Input para añadir gusto o preferencia manualmente */}
        <div className="border border-border bg-card shadow-xs rounded-3xl p-5 sm:p-6 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
            Añadir preferencia o aprendizaje
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (newMemoryText.trim()) {
                handleAddMemory(newMemoryText.trim());
                setNewMemoryText("");
              }
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={newMemoryText}
              onChange={(e) => setNewMemoryText(e.target.value)}
              placeholder="Ej: Prefiero leche de coco en batidos, o press inclinado con mancuernas..."
              className="flex-1 px-4 py-2.5 rounded-2xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:ring-1 focus:ring-primary"
            />
            <Button
              type="submit"
              size="sm"
              disabled={!newMemoryText.trim()}
              className="rounded-2xl font-bold gap-1.5 px-4 h-10 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Añadir
            </Button>
          </form>
        </div>

        {/* Lista de recuerdos con Filtros por Dominio */}
        <div className="border border-border bg-card shadow-xs rounded-3xl p-6 sm:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-4">
            {/* Filtros de Categoría */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-secondary/60 border border-border/60">
              <button
                type="button"
                onClick={() => setMemoryFilter("all")}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer",
                  memoryFilter === "all"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Todos ({aiMemories.length})
              </button>
              <button
                type="button"
                onClick={() => setMemoryFilter("nutricion")}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5",
                  memoryFilter === "nutricion"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span>🥗 Nutrición</span>
                <span className="text-[10px] opacity-70">({nutritionCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setMemoryFilter("entrenamiento")}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5",
                  memoryFilter === "entrenamiento"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span>🏋️ Entrenamiento</span>
                <span className="text-[10px] opacity-70">({trainingCount})</span>
              </button>
            </div>

            {aiMemories.length > 0 && (
              <button
                type="button"
                onClick={handleClearAllMemories}
                className="text-[11px] font-bold text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 transition cursor-pointer self-end sm:self-auto"
              >
                Resetear memoria
              </button>
            )}
          </div>

          {filteredMemories.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Brain className="w-10 h-10 text-muted-foreground/30 mx-auto" />
              <p className="text-xs font-medium text-muted-foreground">
                No hay recuerdos registrados en esta categoría.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredMemories.map((mem) => {
                const getCategoryBadge = (mem: AiMemoryItem) => {
                  if (mem.domain === "entrenamiento") {
                    switch (mem.category) {
                      case "intensidad":
                        return { label: "🏋️ Intensidad", color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20" };
                      case "cuidado":
                        return { label: "🛡️ Cuidado", color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20" };
                      case "ejercicio":
                        return { label: "⚡ Ejercicio", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20" };
                      default:
                        return { label: "🏋️ Entreno", color: "bg-primary/10 text-primary border-primary/20" };
                    }
                  }

                  switch (mem.category) {
                    case "proteina":
                      return { label: "🥗 Proteína", color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20" };
                    case "carbo":
                      return { label: "🌾 Carbohidrato", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" };
                    case "grasa":
                      return { label: "🥑 Grasa", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" };
                    case "habito":
                      return { label: "☕ Hábito", color: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20" };
                    default:
                      return { label: "🥗 Nutrición", color: "bg-primary/10 text-primary border-primary/20" };
                  }
                };
                const badge = getCategoryBadge(mem);

                return (
                  <div
                    key={mem.id}
                    className="flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-border/60 bg-background/50 hover:bg-background hover:border-border transition group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={cn(
                          "px-2.5 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border shrink-0",
                          badge.color,
                        )}
                      >
                        {badge.label}
                      </span>
                      <span className="text-xs font-medium text-foreground truncate">
                        {mem.text}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteMemory(mem.id)}
                      title="Eliminar este recuerdo de la memoria"
                      className="w-7 h-7 rounded-xl flex items-center justify-center text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 transition cursor-pointer shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Tarjeta explicativa de cómo aprende */}
        <div className="rounded-3xl border border-border/70 bg-secondary/30 p-5 sm:p-6 space-y-2">
          <div className="text-xs font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" /> ¿Cómo utiliza la IA esta memoria unificada?
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            <strong>Nutrición:</strong> En sugerencias y análisis nutricionales, la IA prioriza tus alimentos favoritos conservando un 25% de variedad biológica.<br />
            <strong>Entrenamiento & Actividad:</strong> El AI Coach orienta tus recomendaciones de hidratación y recuperación según tus sensaciones físicas y registros de actividad.
          </p>
        </div>
      </div>
    );
  }

  // SUB-SCREEN 3: CONFIGURACIÓN DE LA APLICACIÓN
  if (subView === "app-settings") {
    return (
      <div className="space-y-6 max-w-2xl pb-12 animate-fade-in">
        <button
          type="button"
          onClick={() => setSubView("settings")}
          className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Volver a Ajustes
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
              onClick={() => setSubView("settings")}
              className="rounded-xl font-semibold cursor-pointer"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // SUB-SCREEN: AJUSTES AVANZADOS (Modo Bienestar vs Atleta & Metas Personalizadas)
  if (subView === "advanced-settings") {
    return <AdvancedSettingsView onBack={() => setSubView("settings")} />;
  }

  // SUB-SCREEN 4: AJUSTES & CONFIGURACIÓN
  if (subView === "settings") {
    return (
      <div className="space-y-5 max-w-lg mx-auto pb-28 pt-2 animate-fade-in relative text-left">
        {/* Botón Volver al Perfil */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSubView("main")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-secondary text-xs font-semibold text-foreground transition cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Volver al Perfil
          </button>
        </div>

        {/* Encabezado */}
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" /> Ajustes & Configuración
          </h1>
          <p className="text-xs text-muted-foreground">
            Gestiona tus datos personales, preferencias de IA y opciones de cuenta.
          </p>
        </div>

        {/* GRUPO 1: OPCIONES DE CUENTA */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 px-1">
            Opciones de Cuenta
          </div>
          <div className="rounded-3xl border border-border bg-card shadow-xs overflow-hidden divide-y divide-border/40">
            {/* DATOS BIOLÓGICOS */}
            <button
              type="button"
              onClick={() => setSubView("edit-profile")}
              className="w-full flex items-center justify-between p-4 hover:bg-secondary/40 transition-all cursor-pointer text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                    Datos Biológicos & Perfil
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Edad, sexo, altura, peso y objetivo.
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-foreground group-hover:translate-x-0.5 transition shrink-0" />
            </button>

            {/* MEMORIA DE LA IA */}
            <button
              type="button"
              onClick={() => setSubView("ai-memory")}
              className="w-full flex items-center justify-between p-4 hover:bg-secondary/40 transition-all cursor-pointer text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground group-hover:text-emerald-500 transition-colors">
                    Memoria de la IA & Gustos Aprendidos
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Preferencias y patrones que la IA recuerda sobre ti.
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-foreground group-hover:translate-x-0.5 transition shrink-0" />
            </button>

            {/* AJUSTES DE LA APP */}
            <button
              type="button"
              onClick={() => setSubView("app-settings")}
              className="w-full flex items-center justify-between p-4 hover:bg-secondary/40 transition-all cursor-pointer text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground group-hover:text-sky-500 transition-colors">
                    Ajustes de la Aplicación
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Tema visual, idioma y notificaciones.
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-foreground group-hover:translate-x-0.5 transition shrink-0" />
            </button>

            {/* AJUSTES AVANZADOS */}
            <button
              type="button"
              onClick={() => setSubView("advanced-settings")}
              className="w-full flex items-center justify-between p-4 hover:bg-secondary/40 transition-all cursor-pointer text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    Ajustes Avanzados
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Modo nutrición (Bienestar vs Atleta) y metas de macros.
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-foreground group-hover:translate-x-0.5 transition shrink-0" />
            </button>

            {/* MEMBRESÍA & PAGOS */}
            <button
              type="button"
              onClick={() => navigate({ to: "/app", search: { tab: "pagos" } })}
              className="w-full flex items-center justify-between p-4 hover:bg-secondary/40 transition-all cursor-pointer text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground group-hover:text-amber-500 transition-colors">
                    Membresía & Pagos
                  </div>
                  <div className="text-[11px] text-muted-foreground">
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
          <div className="rounded-3xl border border-border bg-card shadow-xs overflow-hidden divide-y divide-border/40">
            {/* POLÍTICAS DE PRIVACIDAD */}
            <button
              type="button"
              onClick={() => setPrivacyModalOpen(true)}
              className="w-full flex items-center justify-between p-4 hover:bg-secondary/40 transition-all cursor-pointer text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
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
              onClick={() => setTermsModalOpen(true)}
              className="w-full flex items-center justify-between p-4 hover:bg-secondary/40 transition-all cursor-pointer text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
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
              onClick={() => setContactModalOpen(true)}
              className="w-full flex items-center justify-between p-4 hover:bg-secondary/40 transition-all cursor-pointer text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-500 flex items-center justify-center shrink-0">
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
              onClick={() => setLogoutModalOpen(true)}
              className="w-full flex items-center justify-between p-4 hover:bg-rose-500/10 transition-all cursor-pointer text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/15 text-rose-500 flex items-center justify-center shrink-0">
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
    );
  }

  // MAIN SCREEN: PERFIL CON TAB BAR (ANALÍTICAS / RECUPERACIÓN)
  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 sm:px-6 pb-28 pt-2 animate-fade-in relative text-left">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        accept="image/*"
        className="hidden"
      />

      {/* 1. ENCABEZADO DE PERFIL + BOTÓN DE AJUSTES ⚙ */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3.5">
          <div
            className="relative group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            title="Cambiar foto de perfil"
          >
            <img
              src={photo}
              alt={fullName}
              className="w-14 h-14 rounded-full object-cover border-2 border-border shadow-md group-hover:opacity-90 transition"
            />
            <div className="absolute bottom-0 right-0 p-1 rounded-full bg-foreground text-background shadow-xs">
              <Camera className="w-2.5 h-2.5" />
            </div>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-foreground truncate max-w-[200px]">
              {fullName}
            </h1>
            <p className="text-xs text-muted-foreground font-medium truncate max-w-[200px]">
              {email}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setSubView("settings")}
          className="w-10 h-10 rounded-2xl border border-border bg-card hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition shadow-2xs cursor-pointer active:scale-95"
          title="Ajustes & Configuración"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* 2. CONTENIDO: PROGRESO SOMÁTICO */}
      {/* ponytail: progreso somático minimalista y registro directo de peso */}
      <div className="animate-in fade-in duration-200">
        <JournalInsightsDashboard
          currentProfileWeight={parseFloat(weight) || 74.6}
          units={units}
          onOpenWeightLogModal={() => setShowWeightModal(true)}
        />
      </div>

      {/* Modal para registrar peso desde el perfil */}
      {showWeightModal && (
        <WeightLogModal
          currentWeight={parseFloat(weight) || 74.6}
          units={units}
          onClose={() => setShowWeightModal(false)}
          onSave={(weightVal, context) => {
            setWeight(String(weightVal));
            if (typeof window !== "undefined") {
              localStorage.setItem("user_weight", String(weightVal));
              const saved = localStorage.getItem("shakerfy_user_profile_edit");
              if (saved) {
                try {
                  const parsed = JSON.parse(saved);
                  parsed.weight = String(weightVal);
                  localStorage.setItem("shakerfy_user_profile_edit", JSON.stringify(parsed));
                } catch (e) {}
              }

              // Add directly to dedicated weight history
              addStoredWeightLog({
                weight: weightVal,
                context: context || "En ayunas",
                unit: units === "metrico" ? "kg" : "lbs",
              });
            }
            toast.success(`✓ Peso registrado: ${weightVal} ${units === "metrico" ? "kg" : "lbs"}`);
          }}
        />
      )}

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
              En The Wellness Face nos tomamos tu privacidad y la seguridad de tus datos biológicos con
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
              Al utilizar la plataforma The Wellness Face y el motor AI Coach, aceptas los siguientes
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

      {/* MODAL: CONTACTAR CON THE WELLNESS FACE */}
      <Dialog open={contactModalOpen} onOpenChange={setContactModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6 sm:p-8 border border-border bg-card text-center">
          <DialogHeader className="pb-3 border-b border-border/40">
            <DialogTitle className="text-base font-bold flex items-center justify-center gap-2 text-foreground">
              <MessageSquare className="w-5 h-5 text-teal-500" /> Contactar con The Wellness Face
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
                href="mailto:soporte@thewellnessface.com"
                className="flex items-center justify-center gap-2 p-3.5 rounded-2xl border border-border bg-background font-semibold hover:bg-secondary transition text-foreground"
              >
                <Info className="w-4 h-4 text-indigo-500" /> Email: soporte@thewellnessface.com
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
              <AlertTriangle className="w-5 h-5 text-rose-500" /> ¿Eliminar cuenta de The Wellness Face?
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

// Helpers de Calidad Nutricional y Sinergia Somática para el Timeline
function getMealQualityProfile(mealItem: any): {
  label: "Óptima" | "Equilibrada" | "Simple";
  tier: 1 | 2 | 3;
} {
  const score = mealItem?.bioScore ?? (mealItem?.healthScore ? mealItem.healthScore * 10 : 70);
  const text = `${mealItem?.title || ""} ${mealItem?.narrative || mealItem?.desc || ""}`.toLowerCase();

  // 1. Simple: golosinas, dulces, cereales refinados, frituras, ultraprocesados
  if (
    score < 55 ||
    /caramelo|golosina|sour patch|papas fritas|snack|gaseosa|refresco|chucher|donuts|facturas|cheeseburger|dulce/i.test(text)
  ) {
    return { label: "Simple", tier: 1 };
  }

  // 3. Óptima: alimentos densos en micronutrientes, salmón, huevos, quinoa, ensaladas, legumbres
  if (
    score >= 75 ||
    /salmón|salmon|quinoa|pechuga|pollo|ensalada|huevo|avena|tofu|pescado|lenteja|garbanzo|integral|brócoli/i.test(text)
  ) {
    return { label: "Óptima", tier: 3 };
  }

  // 2. Equilibrada: alimentos mixtos y preparaciones intermedias
  return { label: "Equilibrada", tier: 2 };
}

function getMealCombinationTip(mealItem: any, tier: 1 | 2 | 3): string {
  if (mealItem?.coachFeedback && !mealItem.coachFeedback.startsWith("Detectamos una clase")) {
    return mealItem.coachFeedback;
  }
  const text = `${mealItem?.title || ""} ${mealItem?.narrative || mealItem?.desc || ""}`.toLowerCase();

  if (tier === 1) {
    if (/cereal|galleta|pan blanco|factura|medialuna|dulce|pancake/i.test(text)) {
      return "Sumar yogur natural, semillas o un huevo aporta proteína y fibra, reduciendo la velocidad de absorción y prolongando la saciedad.";
    }
    if (/frita|hamburguesa|burger|pizza/i.test(text)) {
      return "Acompañar con vegetales o una ensalada verde aporta fibra dietaria y facilita una digestión más liviana.";
    }
    return "Sumar una porción de proteína magra o vegetales ayuda a balancear el plato y mantener la saciedad por más tiempo.";
  }

  if (tier === 2) {
    if (/pasta|arroz|fideo/i.test(text)) {
      return "Sumar vegetales o un toque de aceite de oliva virgen extra ayuda a balancear el plato y prolongar la energía.";
    }
    if (/queso|sándwich|sandwich/i.test(text)) {
      return "Acompañar con rodajas de tomate o vegetales frescos añade vitaminas y minerales esenciales.";
    }
    return "Una adecuada hidratación después de esta comida favorece una digestión óptima.";
  }

  return "Comida completa y balanceada. Mantener una hidratación regular complementará adecuadamente tus requerimientos diarios.";
}

interface MealDynamicCta {
  id: string;
  type: "exploration" | "context" | "micro_action";
  title: string;
  iconType: "sparkles" | "apple" | "plus" | "droplet" | "wind" | "pause";
  isOneTap?: boolean;
}

function getMealDynamicCtas(mealItem: any): MealDynamicCta[] {
  const text = `${mealItem?.title || ""} ${mealItem?.narrative || mealItem?.desc || ""}`.toLowerCase();
  const quality = getMealQualityProfile(mealItem);
  const isPostWorkout =
    /post|entreno|recuperaci|gym|fuerza|pesas/i.test(text) ||
    mealItem?.timingFit?.type === "post_workout" ||
    mealItem?.timingFit?.label?.toLowerCase().includes("post");
  const isUltraProcessed =
    quality.tier === 1 ||
    /caramelo|golosina|snack|gaseosa|refresco|chucher|donuts|facturas|cheeseburger|dulce|papas fritas|pizza/i.test(text);

  // Post-entreno: Recuperación muscular + Pausa
  if (isPostWorkout) {
    return [
      {
        id: "explore_postworkout_fuel",
        type: "exploration",
        title: "Ideas post-entreno",
        iconType: "sparkles",
      },
      {
        id: "take_a_pause",
        type: "micro_action",
        title: "Tomar una pausa",
        iconType: "wind",
      },
    ];
  }

  // Reglas Oficiales 20 y 21: Ultraprocesados / Rápida asimilación
  if (isUltraProcessed) {
    return [
      {
        id: "explore-real-food",
        type: "exploration",
        title: "Ideas de platos",
        iconType: "sparkles",
      },
      {
        id: "take_a_pause",
        type: "micro_action",
        title: "Tomar una pausa",
        iconType: "wind",
      },
    ];
  }

  // Comida Real / Proteína / Equilibrada: Ideas de comidas + Tomar una pausa
  return [
    {
      id: "balanced-meal-ideas",
      type: "exploration",
      title: "Ideas de comidas",
      iconType: "sparkles",
    },
    {
      id: "take_a_pause",
      type: "micro_action",
      title: "Tomar una pausa",
      iconType: "wind",
    },
  ];
}

function getMealCoachInsightText(mealItem: any): string {
  if (mealItem?.coachFeedback && !mealItem.coachFeedback.startsWith("Detectamos una clase")) {
    return mealItem.coachFeedback;
  }
  const title = mealItem?.title || "Comida";
  const quality = getMealQualityProfile(mealItem);

  if (quality.tier === 1) {
    return `Este registro de **${title}** aporta energía de rápida absorción. Para lograr un plato más completo, podés sumar fuentes de *proteína magra o fibra* que ayuden a prolongar la saciedad a lo largo del día.`;
  }

  if (quality.tier === 3 || (mealItem?.protein && mealItem.protein >= 20)) {
    return `Buen registro de **${title}**, con un adecuado aporte de proteínas y nutrientes clave para *favorecer la recuperación muscular* y sostener un nivel de energía estable.`;
  }

  return `Este registro de **${title}** aporta un *balance adecuado de macronutrientes* según tus actividades. Mantener variedad en tus fuentes de alimentos ayuda a cumplir tus requerimientos diarios.`;
}

function getMealCtaMarkdownContent(ctaId: string, mealItem: any): string {
  const title = mealItem?.title || "Comida";

  if (ctaId === "explore_postworkout_fuel") {
    return `Opciones de recuperación neuromuscular y reposición glucogénica post-esfuerzo:

- **🍠 Batata asada con pechuga magra:** Proporción ideal de glucógeno y aminoácidos esenciales para la síntesis de nuevas miofibrillas.
- **🥑 Tostón de masa madre con huevos poché y palta:** Ácidos grasos protectores y proteínas completas de alta digestibilidad.
- **🥣 Bowl de avena tibia con yogur griego y arándanos:** Rápida recarga glucogénica y polifenoles que amortiguan el estrés oxidativo.`;
  }

  if (ctaId === "balanced-meal-ideas") {
    return `Opciones balanceadas con alimentos reales para complementar tus requerimientos diarios:

- **🥑 Poke Bowl Mediterráneo:** Salmón grillado o garbanzos, quinoa tibia, **espinacas baby**, palta y semillas de sésamo. Aporte de proteínas completas y ácidos grasos esenciales.
- **🍠 Plato de Recuperación Muscular:** Pechuga magra o *tofu a las hierbas* con **batata asada** y brócoli al vapor. Favorece la reposición de glucógeno y la síntesis proteica.
- **🥗 Ensalada Mediterránea Completa:** Hojas verdes, **huevo de campo**, tomates cherry y *aceite de oliva virgen extra*. Excelente densidad nutricional y grasas monoinsaturadas.`;
  }

  if (ctaId === "discover-healthy-snacks") {
    return `Opciones de bajo procesamiento para mantener la saciedad y energía entre comidas:

- **🫐 Yogur natural con frutos rojos:** Fuente de probióticos, **fibra dietaria** y proteínas de absorción gradual.
- **🥕 Bastones de vegetales con hummus:** Zanahoria y pepino con hummus de garbanzo para un aporte de fibra y saciedad prolongada sin pesadez.
- **🥜 Frutos secos y semillas:** Porción controlada de almendras y nueces, ricas en **magnesio** y grasas saludables.`;
  }

  if (ctaId === "explore-real-food") {
    return `Recomendaciones prácticas para sumar calidad nutricional a tu alimentación:

- **🥚 Incorporar proteína entera:** Huevos, pollo, **tofu** o legumbres para optimizar la masa muscular y prolongar la saciedad.
- **🥗 Sumar fibra vegetal:** Hojas verdes de estación o semillas que favorecen la salud digestiva y regulan la absorción de nutrientes.
- **🥑 Grasas saludables:** Palta fresca, frutos secos o *aceite de oliva virgen extra* para mejorar el perfil lipídico y la absorción de vitaminas liposolubles.`;
  }

  if (ctaId === "add-accompaniment") {
    return `Registra si acompañaste esta comida con líquidos o alimentos adicionales para un seguimiento preciso:`;
  }

  return `Recomendaciones nutricionales para **${title}**:`;
}

// ponytail: Client-side typewriter simulating Gemini streaming API. In production, replace with SSE stream reader.
function renderInlineMarkdownTokens(text: string): React.ReactNode {
  if (!text) return text;
  const tokens = text.split(/(\*\*[^*]+?\*\*|\*[^*]+?\*|`[^`]+?`)/g);

  return tokens.map((token, idx) => {
    if (token.startsWith("**") && token.endsWith("**") && token.length >= 4) {
      return (
        <strong key={idx} className="font-bold text-foreground">
          {token.slice(2, -2)}
        </strong>
      );
    }
    if (token.startsWith("*") && token.endsWith("*") && token.length >= 2) {
      return (
        <em key={idx} className="italic text-foreground/90 font-medium">
          {token.slice(1, -1)}
        </em>
      );
    }
    if (token.startsWith("`") && token.endsWith("`") && token.length >= 2) {
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 rounded-md bg-secondary/80 font-mono text-[11px] font-semibold text-emerald-700 dark:text-emerald-300"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    return token;
  });
}

function parseRichMarkdown(text: string): React.ReactNode {
  if (!text) return null;
  const lines = text.split("\n");

  return lines.map((line, lIdx) => {
    const trimmed = line.trim();
    if (!trimmed) return <span key={lIdx} className="block h-2" />;

    if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.startsWith("• ")) {
      const content = trimmed.slice(2);
      return (
        <div key={lIdx} className="flex items-start gap-2 my-1 pl-1 text-left">
          <span className="text-emerald-600 dark:text-emerald-400 font-bold leading-none mt-1 shrink-0">•</span>
          <span className="flex-1 leading-relaxed">{renderInlineMarkdownTokens(content)}</span>
        </div>
      );
    }

    return (
      <span key={lIdx} className="block leading-relaxed">
        {renderInlineMarkdownTokens(line)}
      </span>
    );
  });
}

interface TypewriterMarkdownProps {
  content: string;
  speed?: number;
  chunkSize?: number;
  className?: string;
  onComplete?: () => void;
}

function TypewriterMarkdown({
  content,
  speed = 14,
  chunkSize = 2,
  className,
  onComplete,
}: TypewriterMarkdownProps) {
  const [displayedLength, setDisplayedLength] = useState(0);
  const [isSkipped, setIsSkipped] = useState(false);

  useEffect(() => {
    setDisplayedLength(0);
    setIsSkipped(false);
    if (!content) return;

    let current = 0;
    const interval = setInterval(() => {
      current = Math.min(content.length, current + chunkSize);
      setDisplayedLength(current);

      if (current >= content.length) {
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [content, speed, chunkSize, onComplete]);

  const displayedText = isSkipped ? content : content.slice(0, displayedLength);
  const isTyping = !isSkipped && displayedLength < content.length;

  let safeText = displayedText;
  const boldCount = (safeText.match(/\*\*/g) || []).length;
  if (boldCount % 2 !== 0) safeText += "**";
  const codeCount = (safeText.match(/`/g) || []).length;
  if (codeCount % 2 !== 0) safeText += "`";

  return (
    <div
      onClick={() => setIsSkipped(true)}
      className={cn("cursor-pointer select-text transition-opacity", className)}
      title={isTyping ? "Toca para revelar el texto completo" : undefined}
    >
      {parseRichMarkdown(safeText)}
      {isTyping && (
        <span className="inline-block w-1.5 h-3.5 bg-emerald-500 rounded-xs animate-pulse ml-0.5 align-middle" />
      )}
    </div>
  );
}

// Subcomponent: AI Coach Diario (Wellfooder Timeline)
function DiarioTab() {
  const navigate = useNavigate();
  const { isAthleteMode, isWellnessMode } = useNutritionSettings();

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

  const [showStreakInfo, setShowStreakInfo] = useState(false);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderScrolled(window.scrollY > 150);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [editingTimelineItem, setEditingTimelineItem] = useState<any | null>(null);
  const [expandedCardInsights, setExpandedCardInsights] = useState<Record<string, boolean>>({});

  const toggleCardInsights = (id: string) => {
    setExpandedCardInsights((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const expandedMealInsights = expandedCardInsights;
  const toggleMealInsights = toggleCardInsights;

  const [expandedMealCta, setExpandedMealCta] = useState<Record<string, string | null>>({});
  const [loggedMicroActions, setLoggedMicroActions] = useState<Record<string, { type: string; itemId: string; level?: number; time: string } | null>>({});

  const toggleMealCta = (mealId: string, ctaId: string) => {
    setExpandedMealCta((prev) => ({
      ...prev,
      [mealId]: prev[mealId] === ctaId ? null : ctaId,
    }));
  };

  const [isBreathingDrawerOpen, setIsBreathingDrawerOpen] = useState(false);
  const [breathingMealContext, setBreathingMealContext] = useState<string | undefined>(undefined);
  const [breathingOriginMealId, setBreathingOriginMealId] = useState<string | undefined>(undefined);

  const handleOpenBreathingPause = (mealId?: string, mealTitle?: string) => {
    setBreathingOriginMealId(mealId);
    setBreathingMealContext(mealTitle);
    setIsBreathingDrawerOpen(true);
  };

  const handleBreathingComplete = () => {
    if (breathingOriginMealId) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
      setLoggedMicroActions((prev) => ({
        ...prev,
        [breathingOriginMealId]: { type: "vagal_pause", itemId: `pause-${Date.now()}`, time: timeStr },
      }));
    }
    toast.success("✓ Pausa completada • Tu cuerpo está en calma");
  };

  const handleLogArmstrongLevel = (mealId: string, level: number) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate([25, 40, 25]);
      } catch (_) {}
    }
    const currentObj = ARMSTRONG_LEVELS.find((l) => l.level === level) || ARMSTRONG_LEVELS[1];
    const now = new Date();
    const timeStr = now.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
    const hydrationId = `hydration-${Date.now()}`;
    const newHydration = {
      id: hydrationId,
      date: selectedTimelineDate || todayIso,
      time: timeStr,
      title: `Nivel ${level} Armstrong`,
      subtitle: `${currentObj.title} (${currentObj.state})`,
      type: "hydration",
      level,
      desc: `${currentObj.title} — ${currentObj.state}`,
      tag: `Nivel ${level} Armstrong`,
      coachFeedback: `💧 Consejo Fisiológico: ${currentObj.advice}`,
      createdAt: now.toISOString(),
    };

    setUserTimelineItems((prev) => [newHydration, ...prev]);
    setLoggedMicroActions((prev) => ({
      ...prev,
      [mealId]: { type: "armstrong", itemId: hydrationId, level, time: timeStr },
    }));
    toast.success(`💧 Registrado: Nivel ${level} Armstrong (${currentObj.state})`);
  };

  const handleUndoMicroAction = (mealId: string) => {
    const action = loggedMicroActions[mealId];
    if (action && action.itemId) {
      setUserTimelineItems((prev) => prev.filter((it) => it.id !== action.itemId));
      setLoggedMicroActions((prev) => ({ ...prev, [mealId]: null }));
      toast.info("Registro de hidratación deshecho");
    }
  };

  const handleAddAccompanimentToMeal = (mealId: string, accompanimentName: string) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(20);
      } catch (_) {}
    }
    setUserTimelineItems((prev) =>
      prev.map((it) => {
        if (it.id !== mealId) return it;
        const currentIngs = Array.isArray(it.ingredients) ? it.ingredients : [];
        const updatedIngs = [
          ...currentIngs,
          { id: `ing-${Date.now()}`, name: accompanimentName, grams: 100, calories: 30, protein: 1, carbs: 4, fat: 1 },
        ];
        return {
          ...it,
          ingredients: updatedIngs,
          desc: it.desc ? `${it.desc} • ${accompanimentName}` : accompanimentName,
          narrative: it.narrative ? `${it.narrative} • ${accompanimentName}` : accompanimentName,
        };
      })
    );
    toast.success(`✓ "${accompanimentName}" sumado al registro`);
  };

  const getTodayIso = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const todayIso = useMemo(() => getTodayIso(), []);
  const [selectedTimelineDate, setSelectedTimelineDate] = useState<string>(() => getTodayIso());

  const [userTimelineItems, setUserTimelineItems] = useState<any[]>(() => {
    const todayStr = getTodayIso();
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("shakerfy_user_timeline_items");
      if (saved !== null) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed
              .map((item: any) => {
                const cleaned = item?.type === "activity" ? { ...item, kcal: 0 } : item;
                if (cleaned && (cleaned.date === "2026-07-15" || !cleaned.date)) {
                  return { ...cleaned, date: todayStr };
                }
                return cleaned;
              })
              .filter((item: any) => item && item.id);
          }
        } catch (e) {}
      }
    }
    return [
      {
        id: "hydration-demo",
        date: todayStr,
        time: "08:15 AM",
        title: "Registro de Hidratación",
        subtitle: "Chequeo Matutino / Hidratación",
        type: "hydration",
        level: 2,
        desc: "Nivel 2 — Amarillo Pálido",
        tag: "Nivel 2",
        coachFeedback:
          "💧 Consejo Fisiológico: Estado hídrico ideal para el rendimiento físico y deportivo continuo. Mantén sorbos constantes.",
      },
      {
        id: "activity-demo-1",
        date: todayStr,
        time: "10:30 AM",
        title: "Caminata Enérgica",
        activityName: "Caminata Enérgica",
        duration: 45,
        intensity: "med",
        intensityLabel: "Media",
        subtitle: "Registro de Actividad",
        type: "activity",
        img: null,
        kcal: 0,
        tag: "45 min • Media",
        coachFeedback:
          "Registraste 45 min de Caminata (intensidad Media). ¡Gran trabajo!",
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
          if (saved !== null) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
              const validOnly = parsed
                .map((item: any) => (item?.type === "activity" ? { ...item, kcal: 0 } : item))
                .filter((item: any) => item && item.id);
              setUserTimelineItems(validOnly);
            }
          }
        } catch (e) {}
      }
    };

    window.addEventListener("shakerfy:timeline-update", handleSyncStorage);
    window.addEventListener("storage", handleSyncStorage);
    return () => {
      window.removeEventListener("shakerfy:timeline-update", handleSyncStorage);
      window.removeEventListener("storage", handleSyncStorage);
    };
  }, []);

  const handleDeleteTimelineItem = (id: string) => {
    const itemIndex = userTimelineItems.findIndex((item) => String(item.id) === String(id));
    if (itemIndex === -1) return;
    const deletedItem = userTimelineItems[itemIndex];
    const itemTitle = deletedItem.title || deletedItem.activityName || deletedItem.foodName || "Registro";

    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(25);
      } catch (_) {}
    }

    // 1. Filtrar lista removiendo el elemento de forma reactiva inmediata
    const nextItems = userTimelineItems.filter((item) => String(item.id) !== String(id));

    // 2. Persistir inmediatamente en localStorage para blindar contra carreras
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("shakerfy_user_timeline_items", JSON.stringify(nextItems));
      } catch (_) {}
    }

    // 3. Mutar el estado en React
    setUserTimelineItems(nextItems);

    // Toast con opción de Deshacer (estilo Gmail / Telegram / Apple Notes)
    toast(`"${itemTitle}" eliminado`, {
      action: {
        label: "Deshacer",
        onClick: () => {
          if (typeof navigator !== "undefined" && navigator.vibrate) {
            try {
              navigator.vibrate([15, 30]);
            } catch (_) {}
          }
          setUserTimelineItems((prev) => {
            const restored = [...prev];
            if (itemIndex >= 0 && itemIndex <= restored.length) {
              restored.splice(itemIndex, 0, deletedItem);
            } else {
              restored.push(deletedItem);
            }
            if (typeof window !== "undefined") {
              try {
                localStorage.setItem("shakerfy_user_timeline_items", JSON.stringify(restored));
              } catch (_) {}
            }
            return restored;
          });
          toast.success(`✓ "${itemTitle}" restaurado`);
        },
      },
      duration: 5000,
    });
  };


  const handleConsumeAiSuggestionOption = (
    itemId: string,
    optIdx: number,
    macros: { calories: number; protein: number; carbs: number; fat: number }
  ) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(25);
      } catch (_) {}
    }
    setUserTimelineItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        return {
          ...item,
          consumed: true,
          consumedAt: new Date().toISOString(),
          isAiSuggestion: true,
          chosenOptionIndex: optIdx,
          calories: macros.calories,
          kcal: macros.calories,
          protein: macros.protein,
          carbs: macros.carbs,
          carbohydrates: macros.carbs,
          fat: macros.fat,
        };
      })
    );
    toast.success(`✓ ~${macros.calories} kcal y ${macros.protein}g proteína sumados a tu meta diaria`);
  };

  const handleAiSuggestionLike = (itemId: string) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(15);
      } catch (_) {}
    }
    const targetItem = userTimelineItems.find((item) => item.id === itemId);
    const singleOpt = Array.isArray(targetItem?.options) && targetItem.options[0];
    const optText = typeof singleOpt === "string" ? singleOpt : singleOpt?.text || targetItem?.title || "esta opción";

    setUserTimelineItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        return { ...item, feedback: "like" };
      }),
    );
    saveDietaryPreferenceToAiMemory(`Le gusta: ${optText}`);
    toast.success("✓ Guardado en tus gustos y preferencias de IA");
  };

  const handleAiSuggestionDislike = (itemId: string) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(15);
      } catch (_) {}
    }
    const targetItem = userTimelineItems.find((item) => item.id === itemId);
    const singleOpt = Array.isArray(targetItem?.options) && targetItem.options[0];
    const optText = typeof singleOpt === "string" ? singleOpt : singleOpt?.text || targetItem?.title || "esta opción";

    setUserTimelineItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        return { ...item, feedback: "dislike" };
      }),
    );
    saveDietaryPreferenceToAiMemory(`No prefiere: ${optText}`);
    toast.success("✓ Registrado en tus preferencias de IA");
  };

  const handleMealFeedback = (mealId: string, feedbackType: "like" | "dislike") => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(15);
      } catch (_) {}
    }
    const targetItem = userTimelineItems.find((item) => item.id === mealId);
    const mealName = targetItem?.title || targetItem?.foodName || "esta comida";
    const nextFeedback = targetItem?.feedback === feedbackType ? null : feedbackType;

    setUserTimelineItems((prev) =>
      prev.map((item) => {
        if (item.id !== mealId) return item;
        return { ...item, feedback: nextFeedback };
      }),
    );

    if (nextFeedback === "like") {
      saveDietaryPreferenceToAiMemory(`Le gusta: ${mealName}`);
      toast.success("✓ Guardado en tus gustos");
    } else if (nextFeedback === "dislike") {
      saveDietaryPreferenceToAiMemory(`No suele preferir: ${mealName}`);
      toast.info("No usaremos este plato para sugerencias");
    } else {
      toast.info("Preferencia desmarcada");
    }
  };

  const [doubleTapAnimationId, setDoubleTapAnimationId] = useState<string | null>(null);
  const lastTapRef = useRef<{ id: string; time: number }>({ id: "", time: 0 });
  const touchStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleDoubleTapLike = (mealId: string) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate([30, 50]);
      } catch (_) {}
    }

    setDoubleTapAnimationId(mealId);
    setTimeout(() => {
      setDoubleTapAnimationId((curr) => (curr === mealId ? null : curr));
    }, 850);

    const targetItem = userTimelineItems.find((item) => item.id === mealId);
    if (targetItem?.feedback !== "like") {
      setUserTimelineItems((prev) =>
        prev.map((item) => {
          if (item.id !== mealId) return item;
          return { ...item, feedback: "like" };
        }),
      );
      const mealName = targetItem?.title || targetItem?.foodName || "esta comida";
      saveDietaryPreferenceToAiMemory(`Le gusta: ${mealName}`);
      toast.success("✓ Guardado en tus gustos");
    }
  };

  const handleSaveEditedTimelineItem = (updated: any) => {
    setUserTimelineItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    setEditingTimelineItem(null);
  };

  const [isFabOpen, setIsFabOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string>("none");


  const [expandedSuggestionVectors, setExpandedSuggestionVectors] = useState<Record<string, boolean>>({});
  const handleToggleMealConsumed = (itemId: string) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(15);
      } catch (_) {}
    }
    setUserTimelineItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const nextConsumed = !item.consumed;
        if (nextConsumed) {
          toast.success("✓ Comida marcada como consumida");
        } else {
          toast.info("Comida desmarcada");
        }
        return {
          ...item,
          consumed: nextConsumed,
          consumedAt: nextConsumed ? new Date().toISOString() : undefined,
        };
      }),
    );
  };

  const defaultIngredientSwaps: Record<string, string[]> = {
    yogur: ["1 taza de yogur griego natural sin azúcar", "1 taza de yogur de coco o soja", "1 taza de queso batido 0%", "1 taza de kéfir artesanal"],
    banana: ["1 banana mediana en rodajas", "1 manzana roja en cubos", "1/2 taza de arándanos o fresas", "1 durazno o pera picada"],
    nueces: ["1 puñado de nueces troceadas", "1 puñado de almendras tostadas", "1 cda de mantequilla de maní", "1 puñado de avellanas o pistachos"],
    chía: ["1 cda de semillas de chía", "1 cda de semillas de lino", "1 cda de semillas de cáñamo"],
    miel: ["1 cdita de miel cruda y canela", "1 cdita de sirope de agave", "1 toque de canela pura (sin endulzante)"],
    avena: ["1 taza de avena integral", "1 taza de quinoa inflada", "1 taza de copos de trigo sarraceno", "1 taza de harina de avena"],
    leche: ["1 taza de leche de almendras", "1 taza de leche descremada", "1 taza de bebida de avena", "1 taza de agua tibia + yogur"],
    proteína: ["1 scoop de proteína aislada de vainilla", "3 cdas de yogur griego natural", "2 claras de huevo batidas", "2 cdas de mantequilla de maní"],
    pan: ["2 rebanadas de pan de masa madre", "2 rebanadas de pan 100% integral", "2 tostadas de centeno", "1 tortilla integral"],
    huevo: ["2-3 huevos de campo frescos", "1 lata de atún al natural", "120g de tofu revuelto con cúrcuma", "100g de queso cottage"],
    palta: ["1/2 palta / aguacate maduro", "1 cda de aceite de oliva virgen extra", "2 cdas de hummus tradicional", "1 cda de queso crema descremado"],
    pollo: ["150g de pechuga de pollo en tiras", "150g de carne magra", "1 lata grande de atún al natural", "150g de tofu marinado"],
    quinoa: ["1 taza de quinoa cocida", "1 taza de arroz integral o basmati", "1 taza de fideos integrales", "1 taza de cous cous"],
    brócoli: ["1 taza de brócoli al vapor", "1 taza de calabacín salteado", "1 taza de judías verdes", "1 taza de espárragos"],
    salmón: ["1 filete de salmón fresco", "1 filete de merluza al horno", "1 pechuga de pollo a la plancha", "1 filete de atún fresco"],
    batata: ["1 batata mediana asada", "1 papa mediana al horno", "1 taza de puré de calabaza", "1 taza de arroz jazmín"],
    pavo: ["150g de pechuga de pavo en cubos", "150g de solomillo de cerdo magro", "1 lata de atún al natural", "150g de tofu firme"],
    calabacín: ["1 calabacín mediano en rodajas", "1 berenjena en dados", "1 pimiento rojo en juliana", "1 taza de judías verdes"],
    arroz: ["1 taza pequeña de arroz jazmín", "1 taza de fideos de arroz", "1 taza de quinoa cocida", "1 papa hervida pequeña"],
  };

  const INGREDIENT_MACRO_MAP: Record<string, { cal: number; p: number; c: number; f: number }> = {
    // Avena & Carbos
    "1 taza de avena integral": { cal: 150, p: 5, c: 27, f: 3 },
    "1 taza de quinoa inflada": { cal: 120, p: 4, c: 23, f: 2 },
    "1 taza de copos de trigo sarraceno": { cal: 140, p: 5, c: 28, f: 1 },
    "1 taza de harina de avena": { cal: 160, p: 6, c: 28, f: 3 },
    "2 rebanadas de pan de masa madre": { cal: 160, p: 6, c: 32, f: 1 },
    "2 rebanadas de pan 100% integral": { cal: 140, p: 6, c: 26, f: 2 },
    "2 tostadas de centeno": { cal: 130, p: 4, c: 26, f: 1 },
    "1 tortilla integral": { cal: 130, p: 4, c: 22, f: 3 },
    "1 taza de quinoa cocida": { cal: 220, p: 8, c: 39, f: 4 },
    "1 taza de arroz integral o basmati": { cal: 215, p: 5, c: 45, f: 2 },
    "1 taza de fideos integrales": { cal: 200, p: 7, c: 42, f: 1 },
    "1 taza de cous cous": { cal: 175, p: 6, c: 36, f: 1 },
    "1 batata mediana asada": { cal: 115, p: 2, c: 27, f: 0 },
    "1 papa mediana al horno": { cal: 130, p: 3, c: 30, f: 0 },
    "1 taza de puré de calabaza": { cal: 50, p: 2, c: 12, f: 0 },
    "1 taza de arroz jazmín": { cal: 205, p: 4, c: 45, f: 0 },
    "1 taza pequeña de arroz jazmín": { cal: 160, p: 3, c: 35, f: 0 },
    "1 taza de fideos de arroz": { cal: 190, p: 3, c: 42, f: 0 },
    "1 papa hervida pequeña": { cal: 100, p: 2, c: 23, f: 0 },

    // Proteínas
    "1 scoop de proteína aislada de vainilla": { cal: 120, p: 25, c: 2, f: 1 },
    "1 scoop de proteína aislada": { cal: 120, p: 25, c: 2, f: 1 },
    "3 cdas de yogur griego natural": { cal: 60, p: 7, c: 2, f: 2 },
    "2 claras de huevo batidas": { cal: 35, p: 7, c: 0, f: 0 },
    "2 cdas de mantequilla de maní": { cal: 190, p: 8, c: 7, f: 16 },
    "2-3 huevos de campo frescos": { cal: 180, p: 14, c: 1, f: 13 },
    "1 lata de atún al natural": { cal: 130, p: 28, c: 0, f: 1 },
    "1 lata grande de atún al natural": { cal: 160, p: 35, c: 0, f: 1 },
    "120g de tofu revuelto con cúrcuma": { cal: 110, p: 12, c: 3, f: 6 },
    "100g de queso cottage": { cal: 98, p: 11, c: 3, f: 4 },
    "150g de pechuga de pollo en tiras": { cal: 195, p: 39, c: 0, f: 4 },
    "150g de carne magra": { cal: 220, p: 36, c: 0, f: 8 },
    "150g de tofu marinado": { cal: 140, p: 15, c: 4, f: 7 },
    "150g de tofu firme": { cal: 130, p: 14, c: 3, f: 7 },
    "1 filete de salmón fresco": { cal: 250, p: 26, c: 0, f: 16 },
    "1 filete de merluza al horno": { cal: 120, p: 24, c: 0, f: 2 },
    "1 pechuga de pollo a la plancha": { cal: 195, p: 39, c: 0, f: 4 },
    "1 filete de atún fresco": { cal: 180, p: 38, c: 0, f: 2 },
    "150g de pechuga de pavo en cubos": { cal: 180, p: 36, c: 0, f: 3 },
    "150g de solomillo de cerdo magro": { cal: 190, p: 34, c: 0, f: 5 },
    "1 taza de yogur griego natural sin azúcar": { cal: 130, p: 17, c: 6, f: 4 },
    "1 taza de yogur de coco o soja": { cal: 100, p: 4, c: 10, f: 5 },
    "1 taza de queso batido 0%": { cal: 90, p: 16, c: 5, f: 0 },
    "1 taza de kéfir artesanal": { cal: 110, p: 9, c: 9, f: 3 },

    // Grasas & Frutos Secos
    "1/2 palta / aguacate maduro": { cal: 120, p: 1, c: 6, f: 11 },
    "1 cda de aceite de oliva virgen extra": { cal: 120, p: 0, c: 0, f: 14 },
    "2 cdas de hummus tradicional": { cal: 70, p: 2, c: 6, f: 4 },
    "1 cda de queso crema descremado": { cal: 35, p: 2, c: 2, f: 2 },
    "1 puñado de nueces troceadas": { cal: 180, p: 4, c: 4, f: 18 },
    "1 puñado de almendras tostadas": { cal: 160, p: 6, c: 6, f: 14 },
    "1 puñado de avellanas o pistachos": { cal: 160, p: 5, c: 7, f: 14 },
    "1 cda de semillas de chía": { cal: 60, p: 2, c: 5, f: 4 },
    "1 cda de semillas de lino": { cal: 55, p: 2, c: 3, f: 4 },
    "1 cda de semillas de cáñamo": { cal: 60, p: 3, c: 1, f: 5 },

    // Frutas & Endulzantes & Vegetales
    "1/2 taza de arándanos o fresas": { cal: 40, p: 1, c: 9, f: 0 },
    "1 banana mediana en rodajas": { cal: 105, p: 1, c: 27, f: 0 },
    "1 manzana roja en cubos": { cal: 80, p: 0, c: 21, f: 0 },
    "1 durazno o pera picada": { cal: 60, p: 1, c: 15, f: 0 },
    "1 cdita de miel cruda y canela": { cal: 25, p: 0, c: 6, f: 0 },
    "1 cdita de sirope de agave": { cal: 20, p: 0, c: 5, f: 0 },
    "1 toque de canela pura (sin endulzante)": { cal: 5, p: 0, c: 1, f: 0 },
    "1 taza de brócoli al vapor": { cal: 35, p: 3, c: 6, f: 0 },
    "1 taza de calabacín salteado": { cal: 30, p: 1, c: 4, f: 1 },
    "1 calabacín mediano en rodajas": { cal: 25, p: 2, c: 4, f: 0 },
    "1 berenjena en dados": { cal: 25, p: 1, c: 6, f: 0 },
    "1 pimiento rojo en juliana": { cal: 30, p: 1, c: 7, f: 0 },
    "1 taza de judías verdes": { cal: 35, p: 2, c: 7, f: 0 },
    "1 taza de espárragos": { cal: 30, p: 3, c: 5, f: 0 },
    "1 cuenco de tomates cherry": { cal: 25, p: 1, c: 5, f: 0 },
    "1 tomate en rodajas": { cal: 22, p: 1, c: 5, f: 0 },
    "1 taza de espinacas baby": { cal: 15, p: 2, c: 2, f: 0 },
    "2 cuencos de espinacas salteadas": { cal: 40, p: 4, c: 6, f: 1 },
    "1 taza de champiñones salteados": { cal: 35, p: 3, c: 4, f: 1 },
    "1 taza de setas portobello": { cal: 30, p: 3, c: 5, f: 0 },
  };

  const calculateSuggestionMacros = (ingredients: any[]) => {
    let totalCal = 0;
    let totalP = 0;
    let totalC = 0;
    let totalF = 0;

    for (const ing of ingredients) {
      const name = typeof ing === "object" && ing !== null ? ing.name : String(ing);
      const m = INGREDIENT_MACRO_MAP[name];
      if (m) {
        totalCal += m.cal;
        totalP += m.p;
        totalC += m.c;
        totalF += m.f;
      } else {
        totalCal += 70;
        totalP += 4;
        totalC += 8;
        totalF += 2;
      }
    }

    return {
      calories: Math.max(50, totalCal),
      protein: Math.max(2, totalP),
      carbs: Math.max(2, totalC),
      fat: Math.max(1, totalF),
    };
  };

  const resolveSuggestionIngredients = React.useCallback((item: any) => {
    if (Array.isArray(item.ingredients) && item.ingredients.length > 0) {
      return item.ingredients;
    }
    const text = `${item.title || ""} ${item.desc || ""} ${item.narrative || ""}`.toLowerCase();
    const detected: any[] = [];

    const checkMap: Array<{ key: string; defaultName: string; options: string[] }> = [
      { key: "avena", defaultName: "1 taza de avena integral", options: defaultIngredientSwaps.avena },
      { key: "proteína", defaultName: "1 scoop de proteína aislada de vainilla", options: defaultIngredientSwaps.proteína },
      { key: "frutos rojos", defaultName: "1/2 taza de arándanos o fresas", options: defaultIngredientSwaps.banana },
      { key: "arándanos", defaultName: "1/2 taza de arándanos o fresas", options: defaultIngredientSwaps.banana },
      { key: "chía", defaultName: "1 cda de semillas de chía", options: defaultIngredientSwaps.chía },
      { key: "pan", defaultName: "2 rebanadas de pan de masa madre", options: defaultIngredientSwaps.pan },
      { key: "tostada", defaultName: "2 rebanadas de pan de masa madre", options: defaultIngredientSwaps.pan },
      { key: "tostón", defaultName: "2 rebanadas de pan de masa madre", options: defaultIngredientSwaps.pan },
      { key: "huevo", defaultName: "2-3 huevos de campo frescos", options: defaultIngredientSwaps.huevo },
      { key: "palta", defaultName: "1/2 palta / aguacate maduro", options: defaultIngredientSwaps.palta },
      { key: "aguacate", defaultName: "1/2 palta / aguacate maduro", options: defaultIngredientSwaps.palta },
      { key: "tomate", defaultName: "1 cuenco de tomates cherry", options: ["1 cuenco de tomates cherry", "1 tomate en rodajas", "1 taza de espinacas baby"] },
      { key: "pollo", defaultName: "150g de pechuga de pollo en tiras", options: defaultIngredientSwaps.pollo },
      { key: "pechuga", defaultName: "150g de pechuga de pollo en tiras", options: defaultIngredientSwaps.pollo },
      { key: "quinoa", defaultName: "1 taza de quinoa cocida", options: defaultIngredientSwaps.quinoa },
      { key: "brócoli", defaultName: "1 taza de brócoli al vapor", options: defaultIngredientSwaps.brócoli },
      { key: "salmón", defaultName: "1 filete de salmón fresco", options: defaultIngredientSwaps.salmón },
      { key: "batata", defaultName: "1 batata mediana asada", options: defaultIngredientSwaps.batata },
      { key: "papa", defaultName: "1 batata mediana asada", options: defaultIngredientSwaps.batata },
      { key: "yogur", defaultName: "1 taza de yogur griego natural sin azúcar", options: defaultIngredientSwaps.yogur },
      { key: "banana", defaultName: "1 banana mediana en rodajas", options: defaultIngredientSwaps.banana },
      { key: "nueces", defaultName: "1 puñado de nueces troceadas", options: defaultIngredientSwaps.nueces },
      { key: "almendras", defaultName: "1 puñado de almendras tostadas", options: defaultIngredientSwaps.nueces },
      { key: "miel", defaultName: "1 cdita de miel cruda y canela", options: defaultIngredientSwaps.miel },
      { key: "pavo", defaultName: "150g de pechuga de pavo en cubos", options: defaultIngredientSwaps.pavo },
      { key: "calabacín", defaultName: "1 calabacín mediano en rodajas", options: defaultIngredientSwaps.calabacín },
      { key: "arroz", defaultName: "1 taza pequeña de arroz jazmín", options: defaultIngredientSwaps.arroz },
      { key: "espinaca", defaultName: "2 cuencos de espinacas salteadas", options: ["2 cuencos de espinacas salteadas", "1 taza de brócoli al vapor", "1 taza de judías verdes"] },
      { key: "champiñ", defaultName: "1 taza de champiñones salteados", options: ["1 taza de champiñones salteados", "1 taza de setas portobello", "1 taza de espárragos"] },
    ];

    const addedKeys = new Set<string>();
    for (const entry of checkMap) {
      if (text.includes(entry.key) && !addedKeys.has(entry.key)) {
        addedKeys.add(entry.key);
        detected.push({
          id: `ing-${detected.length + 1}`,
          name: entry.defaultName,
          selectedIndex: 0,
          options: entry.options,
        });
      }
    }

    if (detected.length === 0) {
      return [
        { id: "ing-1", name: "150g de pechuga de pollo en tiras", selectedIndex: 0, options: defaultIngredientSwaps.pollo },
        { id: "ing-2", name: "1 taza de quinoa cocida", selectedIndex: 0, options: defaultIngredientSwaps.quinoa },
        { id: "ing-3", name: "1 taza de brócoli al vapor", selectedIndex: 0, options: defaultIngredientSwaps.brócoli },
        { id: "ing-4", name: "1/2 palta / aguacate maduro", selectedIndex: 0, options: defaultIngredientSwaps.palta },
      ];
    }
    return detected;
  }, [defaultIngredientSwaps]);

  const capitalizeFirst = (str: string): string => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const simplifyIngredientShortName = (fullName: string): string => {
    return fullName
      .replace(/^(\d+(-\d+)?|\d+\/\d+|\d+(\.\d+)?)\s*(taza|tazas|cdita|cditas|cda|cdas|scoop|scoops|puñado|puñados|rebanada|rebanadas|tostada|tostadas|lata|latas|filete|filetes|porción|porciones|cuenco|cuencos|g|gr|ml)\s*(de\s*)?/i, "")
      .replace(/\s*(en rodajas|en cubos|en tiras|troceadas|tostadas|cocida|al vapor|salteado|salteados|al horno|a la plancha|natural|sin azúcar|fresco|frescos|maduro|artesanal|0%|descremada|tibia|cruda|pura|rústico|caliente|descremado)\b/gi, "")
      .trim();
  };

  const generateDynamicSuggestionTitle = (ingredients: any[], currentTitle: string = ""): string => {
    if (!ingredients || ingredients.length === 0) return capitalizeFirst(currentTitle);
    const names = ingredients.map((ing) => {
      const raw = typeof ing === "object" && ing !== null ? ing.name : String(ing);
      return capitalizeFirst(simplifyIngredientShortName(raw));
    });

    const lowerCurrent = currentTitle.toLowerCase();

    // 1. Tostón / Tostadas
    if (lowerCurrent.includes("tost") || lowerCurrent.includes("pan") || names.some(n => /pan|centeno|masa madre/i.test(n))) {
      const bread = names.find(n => /pan|tostada|centeno|masa madre|tortilla/i.test(n)) || "Masa Madre";
      const protein = names.find(n => /huevo|tofu|atún|cottage|pollo/i.test(n)) || "Huevos Revueltos";
      const accent = names.find(n => /palta|aguacate|tomate|hummus|queso/i.test(n)) || "Palta";
      return capitalizeFirst(`Tostón de ${bread} con ${protein} & ${accent}`);
    }

    // 2. Bowl de Yogur / Merienda
    if (lowerCurrent.includes("yogur") || names.some(n => /yogur|kéfir|queso/i.test(n))) {
      const base = names.find(n => /yogur|kéfir|queso/i.test(n)) || "Yogur Griego";
      const fruit = names.find(n => /banana|manzana|arándano|fresa|fruto|durazno/i.test(n)) || "Fruta Fresca";
      const nut = names.find(n => /nuez|nueces|almendra|maní|avellana|semilla/i.test(n)) || "Frutos Secos";
      return capitalizeFirst(`Bowl de ${base} con ${fruit} & ${nut}`);
    }

    // 3. Bowl de Avena / Desayuno
    if (lowerCurrent.includes("avena") || names.some(n => /avena|quinoa inflada|sarraceno/i.test(n))) {
      const carb = names.find(n => /avena|quinoa|sarraceno/i.test(n)) || "Avena Integral";
      const fruit = names.find(n => /arándano|fresa|fruto|banana|manzana/i.test(n)) || "Frutos Rojos";
      const protein = names.find(n => /proteína|yogur|clara/i.test(n)) || "Proteína";
      return capitalizeFirst(`Bowl de ${carb} con ${fruit} & ${protein}`);
    }

    // 4. Bowl de Quinoa / Granos
    if (lowerCurrent.includes("quinoa") || (names.some(n => /quinoa|arroz|fideo/i.test(n)) && names.some(n => /pollo|carne|tofu/i.test(n)))) {
      const carb = names.find(n => /quinoa|arroz|fideo|cous cous/i.test(n)) || "Quinoa";
      const protein = names.find(n => /pollo|carne|tofu|atún|salmón|pavo/i.test(n)) || "Pechuga Grillada";
      const veggie = names.find(n => /brócoli|calabacín|judía|espárrago|palta|tomate|espinaca/i.test(n)) || "Vegetales";
      return capitalizeFirst(`Bowl de ${carb} con ${protein} & ${veggie}`);
    }

    // 5. Proteína Principal con Guarniciones (Salmón, Atún, Pollo, Pavo, etc.)
    const mainProtein = names.find(n => /salmón|merluza|pescado|atún|pollo|pavo|tofu|huevo|carne/i.test(n));
    const mainCarb = names.find(n => /batata|papa|calabaza|arroz|quinoa/i.test(n));
    const mainVeggie = names.find(n => /espinaca|brócoli|vegetal|judía|espárrago|champiñón|ensalada|tomate|calabacín/i.test(n));

    if (mainProtein && (mainCarb || mainVeggie)) {
      const secondPart = mainCarb && mainVeggie ? ` con ${mainCarb} & ${mainVeggie}` : mainCarb ? ` con ${mainCarb}` : ` con ${mainVeggie}`;
      return capitalizeFirst(`${mainProtein}${secondPart}`);
    }

    // 6. Salteado Ligero (Cena)
    if (lowerCurrent.includes("salteado") || lowerCurrent.includes("pavo") || names.some(n => /saltead/i.test(n))) {
      const protein = names.find(n => /pavo|pollo|tofu|cerdo/i.test(n)) || "Pavo";
      const veggie = names.find(n => /calabacín|berenjena|pimiento|champiñón/i.test(n)) || "Vegetales Salteados";
      const carb = names.find(n => /arroz|quinoa|papa/i.test(n)) || "Arroz Jazmín";
      return capitalizeFirst(`Salteado de ${protein} con ${veggie} & ${carb}`);
    }

    // Fallback general armónico
    const p1 = names[0] || "Plato Saludable";
    const p2 = names[1] ? ` con ${names[1]}` : "";
    const p3 = names[2] ? ` & ${names[2]}` : "";
    return capitalizeFirst(`${p1}${p2}${p3}`);
  };

  const generateDynamicEducationalInsight = (ingredients: any[], contextBadge: string = ""): string => {
    const isPostWorkout = /post-entreno|recarga/i.test(contextBadge);
    const isNight = /nocturna|cena/i.test(contextBadge);
    const isMorning = /desayuno|matutina|energético/i.test(contextBadge);

    if (isPostWorkout) {
      return "Combinación ideal para reponer energía y ayudar a tus músculos a recuperarse después del entrenamiento.";
    }

    if (isNight) {
      return "Plato ligero y de fácil digestión para nutrirte bien y favorecer un descanso profundo.";
    }

    if (isMorning) {
      return "Energía constante y buena saciedad para empezar la mañana con claridad y vitalidad.";
    }

    return "Combinación equilibrada de proteína y energía limpia para mantenerte activo durante el día sin pesadez.";
  };

  const handleSwapIngredient = (itemId: string, ingIndex: number) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(15);
      } catch (_) {}
    }
    setUserTimelineItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const currentList = resolveSuggestionIngredients(item);
        const updatedIngredients = currentList.map((ing: any, idx: number) => {
          if (idx !== ingIndex) return ing;
          let currentObj = typeof ing === "object" && ing !== null ? { ...ing } : { name: String(ing), selectedIndex: 0 };
          let options = currentObj.options;
          if (!options || options.length <= 1) {
            const lower = currentObj.name.toLowerCase();
            for (const [key, opts] of Object.entries(defaultIngredientSwaps)) {
              if (lower.includes(key)) {
                options = opts;
                break;
              }
            }
          }
          if (!options || options.length <= 1) return ing;
          const nextIndex = ((currentObj.selectedIndex ?? 0) + 1) % options.length;
          const newName = options[nextIndex];
          toast.info(`Sustituido: ${newName}`);
          return {
            ...currentObj,
            options,
            selectedIndex: nextIndex,
            name: newName,
          };
        });

        // Recalcular macros y calorías basados en los nuevos ingredientes
        const newMacros = calculateSuggestionMacros(updatedIngredients);

        // Generar título dinámico y descripción educativa de aprendizaje
        const newTitle = generateDynamicSuggestionTitle(updatedIngredients, item.title);
        const newInsight = generateDynamicEducationalInsight(updatedIngredients, item.contextBadge || item.subtitle || "");

        return {
          ...item,
          title: newTitle,
          desc: newInsight,
          narrative: newInsight,
          ingredients: updatedIngredients,
          calories: newMacros.calories,
          kcal: newMacros.calories,
          protein: newMacros.protein,
          carbs: newMacros.carbs,
          carbohydrates: newMacros.carbs,
          fat: newMacros.fat,
        };
      }),
    );
  };

  const timelineItems = React.useMemo(() => {
    const processedUserItems = userTimelineItems.filter((item) => {
      if (!item || !item.id || ["sunrise", "sunset", "peak", "circadian", "weight"].includes(item.type)) {
        return false;
      }
      if (item.date === selectedTimelineDate) return true;
      if (!item.date && selectedTimelineDate === todayIso) return true;
      if (item.createdAt) {
        const d = new Date(item.createdAt);
        const localIso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        if (localIso === selectedTimelineDate) return true;
      }
      return false;
    });

    // El registro más reciente debe quedar en la parte superior
    return [...processedUserItems].sort((a, b) => {
      const getTimestamp = (item: any): number | null => {
        if (item.createdAt) {
          const t = new Date(item.createdAt).getTime();
          if (!isNaN(t)) return t;
        }
        if (item.id && typeof item.id === "string") {
          const match = item.id.match(/\d{10,}/);
          if (match) {
            const t = parseInt(match[0], 10);
            if (!isNaN(t)) return t;
          }
        }
        return null;
      };

      const tsA = getTimestamp(a);
      const tsB = getTimestamp(b);

      // Si ambos tienen timestamp de creación real: el más recientemente creado arriba
      if (tsA !== null && tsB !== null) {
        return tsB - tsA;
      }

      // Si uno es un registro real del usuario y el otro es demo: el registro real va arriba
      if (tsA !== null && tsB === null) return -1;
      if (tsA === null && tsB !== null) return 1;

      // Si ambos son demo o ninguno tiene timestamp numérico, ordenar por hora del día (más tarde arriba)
      return parseTimeToMinutes(b.time) - parseTimeToMinutes(a.time);
    });
  }, [userTimelineItems, selectedTimelineDate, todayIso]);

  const dailyNutritionStats = React.useMemo(() => {
    const consumedMeals = userTimelineItems.filter(
      (item) =>
        item.consumed &&
        (item.type === "meal" || item.isAiSuggestion || item.type === "ai_suggestion") &&
        (item.date === selectedTimelineDate || (!item.date && selectedTimelineDate === todayIso)),
    );
    if (consumedMeals.length === 0) {
      return {
        totalCalories: 0,
        proteinGrams: 0,
        carbsGrams: 0,
        fatGrams: 0,
      };
    }
    const cals = consumedMeals.reduce((acc, m) => acc + (m.calories || m.kcal || 0), 0);
    const protein = consumedMeals.reduce((acc, m) => acc + (m.protein || 0), 0);
    const carbs = consumedMeals.reduce((acc, m) => acc + (m.carbs || m.carbohydrates || 0), 0);
    const fat = consumedMeals.reduce((acc, m) => acc + (m.fat || 0), 0);
    const fiber = consumedMeals.reduce((acc, m) => acc + (m.fiber || 0), 0);

    return {
      totalCalories: Math.round(cals),
      proteinGrams: Math.round(protein),
      carbsGrams: Math.round(carbs),
      fatGrams: Math.round(fat),
      fiberGrams: Math.round(fiber),
    };
  }, [userTimelineItems, selectedTimelineDate, todayIso]);

  const dayActivityStats = React.useMemo(() => {
    const dayActivities = userTimelineItems.filter(
      (item) =>
        (item.type === "workout" || item.type === "activity") &&
        (item.date === selectedTimelineDate || (!item.date && selectedTimelineDate === todayIso)),
    );
    const dayMinutes = dayActivities.reduce(
      (acc, item) => acc + (item.durationMinutes || item.duration || 0),
      0,
    );
    const dayPoints = dayActivities.reduce(
      (acc, item) => acc + (item.metPoints || Math.round((item.duration || 0) * 3.7) || 0),
      0,
    );
    return {
      dayMinutes,
      dayPoints,
    };
  }, [userTimelineItems, selectedTimelineDate, todayIso]);

  const activityStreakStats = React.useMemo(() => {
    // Promedio ponderado de los últimos 7 días (pesos crecientes por recencia 1..7)
    const weights = [1, 2, 3, 4, 5, 6, 7];
    const totalWeight = weights.reduce((a, b) => a + b, 0); // 28
    const weightedSum = activityData.reduce(
      (acc, curr, idx) => acc + curr.puntos * (weights[idx] || 1),
      0,
    );
    const weighted7DayAvg = Math.round(weightedSum / totalWeight);

    // Suma 1 día a la racha por cada día consecutivo que supere el promedio ponderado
    let streak = 0;
    for (let i = activityData.length - 1; i >= 0; i--) {
      if (activityData[i].puntos >= weighted7DayAvg) {
        streak++;
      } else {
        break;
      }
    }

    const todayPts = activityData[activityData.length - 1]?.puntos || 168;

    return {
      streakDays: streak > 0 ? streak : 5,
      weighted7DayAvg,
      todayPoints: todayPts,
      todayMinutes: Math.round(todayPts / 3.7) || 45,
      todayMets: 6.5,
    };
  }, [activityData]);

  // Días que completaron la condición dual (Promedio 7D >= 150 METs + Nutrición en rango de adherencia)
  const completedDays = React.useMemo(() => {
    // 1. Verificar si el promedio ponderado móvil de actividad alcanza el nivel saludable (>= 150 METs)
    const isActivityMet = activityStreakStats.weighted7DayAvg >= 150;
    if (!isActivityMet) return [];

    // 2. Extraer todos los días únicos presentes en los registros
    const uniqueDates = new Set<string>();
    uniqueDates.add(todayIso);
    userTimelineItems.forEach((item) => {
      if (item?.date) uniqueDates.add(item.date);
    });

    const completed: string[] = [];

    uniqueDates.forEach((dateStr) => {
      const dayMeals = userTimelineItems.filter(
        (item) =>
          item &&
          item.consumed &&
          (item.type === "meal" || item.isAiSuggestion || item.type === "ai_suggestion") &&
          (item.date === dateStr || (!item.date && dateStr === todayIso)),
      );
      if (dayMeals.length === 0) return;

      const dayCals = dayMeals.reduce((s, m) => s + (m.calories || m.kcal || 0), 0);
      const dayProt = dayMeals.reduce((s, m) => s + (m.protein || 0), 0);

      // Criterio de adherencia nutricional:
      // Haber alcanzado al menos el rango de adherencia (>= 1400 kcal o >= 85g proteína, o al menos 2 comidas consumidas con >= 1000 kcal)
      const isNutritionMet =
        dayCals >= 1400 ||
        dayProt >= 85 ||
        (dayMeals.length >= 2 && dayCals >= 1000);

      if (isNutritionMet) {
        completed.push(dateStr);
      }
    });

    return completed;
  }, [userTimelineItems, activityStreakStats.weighted7DayAvg, todayIso]);

  const userProfile = React.useMemo(() => {
    if (typeof window === "undefined") return { goal: "en_forma" as const, weight: 72 };
    try {
      const saved = localStorage.getItem("shakerfy_user_profile_edit");
      if (saved) {
        const parsed = JSON.parse(saved);
        const goal = parsed.goal || "en_forma";
        const weight = Number(parsed.weight) || 72;
        return { goal, weight };
      }
    } catch (_) {}
    return { goal: "en_forma" as const, weight: 72 };
  }, []);

  return (
    <div className="w-full max-w-full pb-20 transition-transform duration-300">
      {/* MAIN CENTERED CONTENT CONTAINER FOR AI COACH TIMELINE */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-2">
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Current State Check-in Widget (Replicated from Reference Design) */}
          <div>
            <BioStateCard
              selectedDate={selectedTimelineDate}
              onSelectDate={(dateStr) => setSelectedTimelineDate(dateStr)}
              completedDays={completedDays}
              totalCalories={dailyNutritionStats.totalCalories}
              proteinGrams={dailyNutritionStats.proteinGrams}
              carbsGrams={dailyNutritionStats.carbsGrams}
              fatGrams={dailyNutritionStats.fatGrams}
              fiberGrams={dailyNutritionStats.fiberGrams}
              activityPoints={dayActivityStats.dayPoints > 0 ? dayActivityStats.dayPoints : (selectedTimelineDate === todayIso ? activityStreakStats.todayPoints : 0)}
              activityMinutes={dayActivityStats.dayMinutes > 0 ? dayActivityStats.dayMinutes : (selectedTimelineDate === todayIso ? activityStreakStats.todayMinutes : 0)}
              weeklyAveragePoints={activityStreakStats.weighted7DayAvg}
              streakDays={activityStreakStats.streakDays}
              userGoal={userProfile.goal}
              userWeight={userProfile.weight}
            />
          </div>

          {/* Banner sutil a Nutrition Intelligence Suite */}
          <div
            onClick={() => navigate({ to: "/nutrition-intelligence" })}
            className="rounded-3xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-md transition-all duration-300 cursor-pointer flex items-center justify-between gap-3 text-left group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground">Nutrition Intelligence</span>
                  <Badge variant="outline" className="text-[9px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20 py-0 px-1.5 rounded-full">
                    PRO
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground truncate">
                  AI Food Scan, reporte semanal y progreso somático.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-muted-foreground group-hover:text-foreground shrink-0 pr-1">
              <span className="hidden sm:inline">Conocer</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Header de la Línea de Tiempo */}
          <div className="flex items-center justify-between pt-1 pb-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
              Línea de Tiempo
            </span>
          </div>

          {/* Timeline */}
          <div className="relative">
            {timelineItems.length === 0 ? (
              <div className="text-center py-12 px-6 rounded-3xl border border-dashed border-border/80 bg-card/40 my-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-secondary/60 flex items-center justify-center mx-auto text-muted-foreground shadow-2xs">
                  <Calendar className="w-5 h-5 text-muted-foreground/80" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-foreground">Sin registros en este día</h4>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                    No hay comidas ni actividades registradas para esta fecha. Usa el botón (+) para registrar una nueva actividad.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Vertical Line */}
                <div className="absolute left-3.5 md:left-[50%] top-0 bottom-0 w-[2px] bg-border transform -translate-x-1/2 md:-translate-x-[1px]"></div>

            {(() => {
              return timelineItems.map((item, index) => {
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
                    <div className="relative mb-12 md:grid md:grid-cols-2 md:gap-12 items-center group">
                      {/* Timeline Dot */}
                      <div className="absolute left-3.5 md:left-1/2 w-4 h-4 rounded-full border-4 bg-background z-10 transform -translate-x-1/2 border-muted-foreground/30"></div>

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
                      <div className={`pl-7 sm:pl-8 md:pl-0 w-full min-w-0 ${showOnLeft ? "md:order-1" : "md:order-2"}`}>
                        <Card
                          onDoubleClick={
                            item.type === "meal"
                              ? (e) => {
                                  if ((e.target as HTMLElement)?.closest('button, a, input, select, textarea, [role="button"]')) {
                                    return;
                                  }
                                  e.stopPropagation();
                                  handleDoubleTapLike(item.id);
                                }
                              : undefined
                          }
                          onTouchStart={
                            item.type === "meal"
                              ? (e) => {
                                  if (e.touches.length === 1) {
                                    touchStartPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                                  }
                                }
                              : undefined
                          }
                          onTouchEnd={
                            item.type === "meal"
                              ? (e) => {
                                  if ((e.target as HTMLElement)?.closest('button, a, input, select, textarea, [role="button"]')) {
                                    return;
                                  }
                                  if (e.changedTouches.length === 1) {
                                    const dx = Math.abs(e.changedTouches[0].clientX - touchStartPosRef.current.x);
                                    const dy = Math.abs(e.changedTouches[0].clientY - touchStartPosRef.current.y);
                                    if (dx < 15 && dy < 15) {
                                      const now = Date.now();
                                      const diff = now - lastTapRef.current.time;
                                      if (lastTapRef.current.id === item.id && diff < 350 && diff > 40) {
                                        handleDoubleTapLike(item.id);
                                        lastTapRef.current = { id: "", time: 0 };
                                      } else {
                                        lastTapRef.current = { id: item.id, time: now };
                                      }
                                    }
                                  }
                                }
                              : undefined
                          }
                          className={cn(
                            "relative rounded-3xl border border-border bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg cursor-pointer select-none",
                            catConfig.bg,
                          )}
                        >
                          {/* Animación Pop de Doble Toque (Like Burst) */}
                          {item.type === "meal" && doubleTapAnimationId === item.id && (
                            <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none rounded-3xl overflow-hidden bg-black/10 backdrop-blur-[1px] animate-in fade-in zoom-in-75 duration-200">
                              <div className="p-4 rounded-full bg-background/90 dark:bg-background/95 shadow-2xl border border-border/80 flex items-center justify-center animate-in zoom-in-75 duration-200">
                                <ThumbsUp className="w-10 h-10 sm:w-12 sm:h-12 text-foreground fill-foreground drop-shadow-sm" />
                              </div>
                            </div>
                          )}
                          {item.type === "ai_suggestion" ? (
                            <div className="flex flex-col p-5 sm:p-6 space-y-4 text-left">
                              {/* 1. Header con Badge Contextual y Action Pill */}
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                                    Sugerencia del momento
                                  </span>
                                </div>

                                <div className="flex items-center gap-1 bg-secondary/80 backdrop-blur-md px-1.5 py-1 rounded-full border border-border/60 shadow-xs shrink-0">
                                  {/* Botón sutil de consumir / desmarcar al lado de eliminar */}
                                  {(() => {
                                    const singleOpt = Array.isArray(item.options) && item.options[0];
                                    const optCals = typeof singleOpt === "object" ? singleOpt.calories : 380;
                                    const optProt = typeof singleOpt === "object" ? singleOpt.protein : 28;
                                    const optCarbs = typeof singleOpt === "object" ? singleOpt.carbs : 40;
                                    const optFat = typeof singleOpt === "object" ? singleOpt.fat : 12;

                                    return (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (item.consumed) {
                                            handleToggleMealConsumed(item.id);
                                          } else {
                                            handleConsumeAiSuggestionOption(item.id, 0, {
                                              calories: optCals,
                                              protein: optProt,
                                              carbs: optCarbs,
                                              fat: optFat,
                                            });
                                          }
                                        }}
                                        className={cn(
                                          "flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer",
                                          item.consumed
                                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold"
                                            : "text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/10",
                                        )}
                                        title={item.consumed ? "Consumida (clic para desmarcar)" : "Marcar como consumida"}
                                      >
                                        <Check className={cn("w-3.5 h-3.5", item.consumed ? "stroke-[3]" : "stroke-[2]")} />
                                        <span>{item.consumed ? "Consumida" : "Consumir"}</span>
                                      </button>
                                    );
                                  })()}

                                  <span className="w-px h-3.5 bg-border/60 mx-0.5" />

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteTimelineItem(item.id);
                                    }}
                                    className="p-1 text-muted-foreground hover:text-rose-500 transition cursor-pointer"
                                    title="Descartar sugerencia"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* 2. Título Contextual */}
                              <div>
                                <h3 className="text-base sm:text-lg font-black leading-tight text-foreground">
                                  {item.title}
                                </h3>
                              </div>

                              {/* 3. Opción Única con efecto Typewriter y Desplegable 'Ver más' */}
                              {Array.isArray(item.options) &&
                                item.options.slice(0, 1).map((opt: any, optIdx: number) => {
                                  const optText = typeof opt === "string" ? opt : opt.text;
                                  const optCals = typeof opt === "object" ? opt.calories : 380;
                                  const optProt = typeof opt === "object" ? opt.protein : 28;
                                  const optCarbs = typeof opt === "object" ? opt.carbs : 40;
                                  const optFat = typeof opt === "object" ? opt.fat : 12;

                                  // Normalización robusta de los 7 vectores según el estándar visual exacto del escaneo de comidas
                                  const rawVectorsList = Array.isArray(opt.vectors) && opt.vectors.length > 0 
                                    ? opt.vectors 
                                    : computeNutritionalVectors(optText, optProt);

                                  const standardCategories = [
                                    { category: "processing", label: "Procesamiento", fallback: "Mínimamente procesado" },
                                    { category: "fiber", label: "Fibra", fallback: "Alto en fibra" },
                                    { category: "protein", label: "Proteína", fallback: "Alto en proteína" },
                                    { category: "sugar", label: "Azúcares añadidos", fallback: "Sin azúcar añadido" },
                                    { category: "fat", label: "Grasas", fallback: "Grasas saludables" },
                                    { category: "grains", label: "Granos", fallback: "Granos enteros" },
                                    { category: "sodium", label: "Sodio", fallback: "Bajo en sodio" },
                                  ];

                                  const normalizedVectors = standardCategories.map((spec) => {
                                    const found = rawVectorsList.find((v: any) => v.category === spec.category);
                                    const rawVal = found ? found.value : spec.fallback;
                                    const vLower = (rawVal || "").toLowerCase();

                                    let value = spec.fallback;
                                    if (spec.category === "processing") {
                                      value = "Mínimamente procesado";
                                    } else if (spec.category === "fiber") {
                                      value = vLower.includes("alto") || vLower.includes("excelente") ? "Alto en fibra" : "Buena fuente";
                                    } else if (spec.category === "protein") {
                                      value = vLower.includes("alto") || vLower.includes("alta") || vLower.includes("magra") ? "Alto en proteína" : "Proteína moderada";
                                    } else if (spec.category === "sugar") {
                                      value = "Sin azúcar añadido";
                                    } else if (spec.category === "fat") {
                                      value = vLower.includes("saludable") || vLower.includes("omega") || vLower.includes("palta") || vLower.includes("oliva") ? "Grasas saludables" : "Moderadas";
                                    } else if (spec.category === "grains") {
                                      value = vLower.includes("entero") || vLower.includes("lenta") || vLower.includes("avena") || vLower.includes("quinoa") ? "Granos enteros" : "Sin granos";
                                    } else if (spec.category === "sodium") {
                                      value = "Bajo en sodio";
                                    }

                                    return {
                                      category: spec.category,
                                      label: spec.label,
                                      value,
                                    };
                                  });

                                  const isDetailsOpen = !!expandedSuggestionVectors[item.id];

                                  return (
                                    <div key={item.streamKey || optIdx} className="space-y-3">
                                      {/* Texto de la sugerencia con la fuente de la descripción de alimento en el escaneo de comidas */}
                                      <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed font-normal pt-0.5">
                                        <TypewriterText text={optText} speed={16} />
                                      </p>

                                      {/* Botón 'Ver más' / 'Ver menos' (idéntico al de la card de comida escaneada) */}
                                      <div className="flex items-center justify-start gap-2 w-full pt-0.5">
                                        <Button
                                          type="button"
                                          variant="outline"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setExpandedSuggestionVectors((prev) => ({
                                              ...prev,
                                              [item.id]: !prev[item.id],
                                            }));
                                          }}
                                           className="rounded-2xl h-8 px-3 text-xs font-medium border-border/30 bg-secondary/20 hover:bg-secondary/40 text-foreground transition-all cursor-pointer flex items-center gap-1.5 shadow-none"
                                        >
                                          <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                          <span className="truncate">
                                            {isDetailsOpen ? "Ver menos" : "Ver más"}
                                          </span>
                                          {isDetailsOpen ? (
                                            <ChevronUp className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                          ) : (
                                            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                          )}
                                        </Button>
                                      </div>

                                      {/* Bloque desplegable de Información Nutricional (idéntico al de la card de comida escaneada) */}
                                      {isDetailsOpen && (
                                        <div className="pt-3.5 space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-200 border-t border-border/40 text-left">
                                          {/* A. Macros y Calorías */}
                                          <div className="grid grid-cols-4 gap-1.5 sm:gap-2 w-full select-none">
                                            {/* Calorías */}
                                            <div
                                              title="Calorías"
                                              className="px-1 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-secondary/40 border border-border/60 flex flex-col items-center justify-center text-center shadow-2xs min-w-0"
                                            >
                                              <span className="text-[7px] sm:text-[7.5px] font-bold uppercase text-muted-foreground/80 leading-none">
                                                Calorías
                                              </span>
                                              <span className="text-[11px] sm:text-xs font-black text-foreground tabular-nums leading-tight mt-0.5">
                                                {optCals}
                                              </span>
                                            </div>

                                            {/* Proteínas */}
                                            <div
                                              title="Proteínas"
                                              className="px-1 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/20 flex flex-col items-center justify-center text-center shadow-2xs min-w-0"
                                            >
                                              <span className="text-[7px] sm:text-[7.5px] font-bold uppercase text-emerald-700 dark:text-emerald-400 leading-none">
                                                Proteínas
                                              </span>
                                              <span className="text-[11px] sm:text-xs font-black text-emerald-700 dark:text-emerald-400 tabular-nums leading-tight mt-0.5">
                                                {optProt}g
                                              </span>
                                            </div>

                                            {/* Carbos */}
                                            <div
                                              title="Carbohidratos"
                                              className="px-1 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/20 flex flex-col items-center justify-center text-center shadow-2xs min-w-0"
                                            >
                                              <span className="text-[7px] sm:text-[7.5px] font-bold uppercase text-amber-700 dark:text-amber-400 leading-none">
                                                Carbos
                                              </span>
                                              <span className="text-[11px] sm:text-xs font-black text-amber-700 dark:text-amber-400 tabular-nums leading-tight mt-0.5">
                                                {optCarbs}g
                                              </span>
                                            </div>

                                            {/* Grasas */}
                                            <div
                                              title="Grasas"
                                              className="px-1 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-sky-500/10 dark:bg-sky-950/30 border border-sky-500/20 flex flex-col items-center justify-center text-center shadow-2xs min-w-0"
                                            >
                                              <span className="text-[7px] sm:text-[7.5px] font-bold uppercase text-sky-700 dark:text-sky-400 leading-none">
                                                Grasas
                                              </span>
                                              <span className="text-[11px] sm:text-xs font-black text-sky-700 dark:text-sky-400 tabular-nums leading-tight mt-0.5">
                                                {optFat}g
                                              </span>
                                            </div>
                                          </div>

                                          {/* B. 7 Vectores Nutricionales — Estilo Nutrition Facts */}
                                          <NutritionFactsTable rows={normalizedVectors} className="mt-2" />
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}

                              {/* 4. Feedback Interactivo Neutral */}
                              <div className="pt-2 border-t border-border/40 space-y-3">
                                {item.feedback === "like" ? (
                                  <div className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-secondary/40 border border-border/60 text-muted-foreground animate-in fade-in duration-200">
                                    <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                                      <Check className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                      <span>Guardado en tus gustos y preferencias</span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setUserTimelineItems((prev) =>
                                          prev.map((it) => (it.id === item.id ? { ...it, feedback: null } : it)),
                                        );
                                      }}
                                      className="text-[10px] font-semibold text-muted-foreground hover:text-foreground underline cursor-pointer"
                                    >
                                      Cambiar
                                    </button>
                                  </div>
                                ) : item.feedback === "dislike" ? (
                                  <div className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-secondary/40 border border-border/60 text-muted-foreground animate-in fade-in duration-200">
                                    <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                                      <Check className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                      <span>Registrado para futuras sugerencias</span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setUserTimelineItems((prev) =>
                                          prev.map((it) => (it.id === item.id ? { ...it, feedback: null } : it)),
                                        );
                                      }}
                                      className="text-[10px] font-semibold text-muted-foreground hover:text-foreground underline cursor-pointer"
                                    >
                                      Cambiar
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleAiSuggestionLike(item.id);
                                      }}
                                      className="h-8 rounded-xl text-xs font-medium gap-1.5 border-border/70 bg-secondary/30 hover:bg-secondary/70 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                    >
                                      <ThumbsUp className="w-3.5 h-3.5 text-muted-foreground" />
                                      <span>Me gusta</span>
                                    </Button>

                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleAiSuggestionDislike(item.id);
                                      }}
                                      className="h-8 rounded-xl text-xs font-medium gap-1.5 border-border/70 bg-secondary/30 hover:bg-secondary/70 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                    >
                                      <ThumbsDown className="w-3.5 h-3.5 text-muted-foreground" />
                                      <span>No me gusta</span>
                                    </Button>
                                  </div>
                                )}
                              </div>

                              {/* 5. Disclaimer Text: Always Visible */}
                              <p className="text-[10px] sm:text-[11px] text-muted-foreground/70 leading-snug pt-1 text-left font-normal">
                                Las sugerencias nutricionales por IA son orientativas y aproximadas. Revisa siempre los detalles nutricionales e ingredientes importantes.
                              </p>
                            </div>
                          ) : item.isAiSuggestion ? (
                            <div className="flex flex-col p-5 space-y-4 text-left">
                              {/* 1. Header con Badge Contextual y Action Pill */}
                              <div className="flex items-center justify-between gap-3 text-left">
                                <div className="flex items-center gap-2">
                                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                                    Sugerencia con IA
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5 bg-secondary/80 backdrop-blur-md px-2 py-1 rounded-full border border-border/60 shadow-xs shrink-0">
                                  {/* Checkbox para marcar como consumida */}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleMealConsumed(item.id);
                                    }}
                                    className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer group"
                                    title={item.consumed ? "Comida marcada como consumida (toca para desmarcar)" : "Marcar comida como consumida"}
                                  >
                                    <div
                                      className={cn(
                                        "w-4 h-4 rounded-md border flex items-center justify-center transition-all shadow-2xs",
                                        item.consumed
                                          ? "bg-emerald-600 border-emerald-600 text-white"
                                          : "border-muted-foreground/40 bg-background hover:border-emerald-500",
                                      )}
                                    >
                                      {item.consumed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                    </div>
                                    <span
                                      className={cn(
                                        "text-[10px] font-bold uppercase tracking-wider transition-colors",
                                        item.consumed
                                          ? "text-emerald-600 dark:text-emerald-400"
                                          : "text-muted-foreground group-hover:text-foreground",
                                      )}
                                    >
                                      {item.consumed ? "Consumida" : "Consumir"}
                                    </span>
                                  </button>

                                  <span className="w-px h-3 bg-border/60 mx-0.5" />

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteTimelineItem(item.id);
                                    }}
                                    className="p-1 text-muted-foreground hover:text-rose-500 transition cursor-pointer"
                                    title="Eliminar sugerencia"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* 2. Título y Por qué fisiológico */}
                              <div className="space-y-1.5 text-left">
                                <h3 className="text-base sm:text-lg font-black leading-tight text-foreground">
                                  {item.title ? item.title.charAt(0).toUpperCase() + item.title.slice(1) : ""}
                                </h3>
                                <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed font-normal">
                                  {(() => {
                                    const rawDesc = item.desc || item.narrative || "";
                                    if (/Fórmula (Nutricional|Post-Entreno|Regenerativa|Energética|balanceada):/i.test(rawDesc)) {
                                      const lower = (item.contextBadge || item.subtitle || rawDesc).toLowerCase();
                                      if (lower.includes("post-entreno") || lower.includes("recarga")) {
                                        return "Combinación ideal para reponer energía y ayudar a tus músculos a recuperarse después del entrenamiento.";
                                      }
                                      if (lower.includes("nocturna") || lower.includes("cena") || lower.includes("descanso")) {
                                        return "Plato ligero y de fácil digestión para nutrirte bien y favorecer un descanso profundo.";
                                      }
                                      if (lower.includes("desayuno") || lower.includes("mañana") || lower.includes("energético")) {
                                        return "Energía constante y buena saciedad para empezar la mañana con claridad y vitalidad.";
                                      }
                                      return "Combinación equilibrada de proteína y energía limpia para mantenerte activo durante el día sin pesadez.";
                                    }
                                    const cleaned = rawDesc
                                      .replace(/^Para [^:]+:\s*/i, "")
                                      .replace(/^Para (tu|arrancar|el|sostener|la)[^,]+,\s*(te sugiero\s*)?/i, "")
                                      .replace(/(En porciones de mano[^.]*\.)/gi, "")
                                      .trim();
                                    return cleaned ? cleaned.charAt(0).toUpperCase() + cleaned.slice(1) : rawDesc;
                                  })()}
                                </p>
                              </div>

                              {/* 3. Ingredientes en Checklist de 1 Columna */}
                              {(() => {
                                const ingList = resolveSuggestionIngredients(item);
                                if (!ingList || ingList.length === 0) return null;
                                return (
                                  <div className="space-y-2 pt-2 border-t border-border/50 text-left">
                                    <div className="flex items-center justify-between pb-0.5">
                                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-1.5">
                                        <Utensils className="w-3.5 h-3.5 text-emerald-500" />
                                        <span>Ingredientes</span>
                                      </span>
                                      <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                                        <ArrowRightLeft className="w-3 h-3 text-emerald-500" />
                                        <span>Toca para alternar</span>
                                      </span>
                                    </div>

                                    <div className="space-y-1.5">
                                      {ingList.map((ing: any, idx: number) => {
                                        const ingName = typeof ing === "object" && ing !== null ? ing.name : String(ing);
                                        return (
                                          <button
                                            key={idx}
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleSwapIngredient(item.id, idx);
                                            }}
                                            className="group w-full px-3 py-2.5 rounded-2xl bg-secondary/30 hover:bg-secondary/70 border border-border/50 hover:border-emerald-500/40 text-xs font-semibold text-foreground flex items-center justify-between gap-3 transition-all cursor-pointer text-left shadow-2xs hover:-translate-y-0.5"
                                            title="Toca para alternar este ingrediente por otra opción saludable"
                                          >
                                            <div className="flex items-center gap-2.5 min-w-0">
                                              <div className="w-4 h-4 rounded-md border border-emerald-500/60 bg-emerald-500/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 shadow-2xs">
                                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                                              </div>
                                              <span className="font-medium text-foreground text-xs leading-tight truncate">
                                                {ingName}
                                              </span>
                                            </div>
                                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground shrink-0 group-hover:text-emerald-500 font-bold bg-background/70 px-2 py-0.5 rounded-lg border border-border/40">
                                              <ArrowRightLeft className="w-3 h-3" />
                                              <span className="hidden xs:inline">Alternar</span>
                                            </div>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })()}

                              {/* 4. Desplegable de Detalles & Insights (Macros + 7 Vectores Nutricionales) */}
                              {(() => {
                                const isExpanded = !!expandedCardInsights[item.id];
                                const ingText = (resolveSuggestionIngredients(item) || [])
                                  .map((i: any) => (typeof i === "object" && i !== null ? i.name : String(i)).toLowerCase())
                                  .join(" ");

                                const vectors = [
                                  { category: "processing", label: "Procesamiento", value: "Mínimamente procesado" },
                                  {
                                    category: "fiber",
                                    label: "Fibra",
                                    value: /avena|quinoa|brócoli|judía|espinaca|chía|manzana|arándano/i.test(ingText)
                                      ? "Excelente fuente natural"
                                      : "Buena fuente",
                                  },
                                  {
                                    category: "protein",
                                    label: "Proteína",
                                    value: (item.protein || 30) >= 30 ? "Proteína magra de alto valor" : "Proteína magra",
                                  },
                                  { category: "sugar", label: "Azúcares añadidos", value: "Sin azúcar añadido" },
                                  {
                                    category: "fat",
                                    label: "Grasas",
                                    value: /palta|salmón|nuez|almendra|chía|oliva/i.test(ingText)
                                      ? "Grasas saludables (Omega-3)"
                                      : "Moderadas",
                                  },
                                  {
                                    category: "grains",
                                    label: "Granos",
                                    value: /avena|quinoa|masa madre|arroz/i.test(ingText)
                                      ? "Granos enteros / Lenta absorción"
                                      : "Sin harinas refinadas",
                                  },
                                  { category: "sodium", label: "Sodio", value: "Bajo en sodio" },
                                ];

                                return (
                                  <div className="pt-1 space-y-3">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleCardInsights(item.id);
                                      }}
                                      className="w-full flex items-center justify-between px-3.5 py-2 rounded-2xl bg-secondary/20 hover:bg-secondary/40 text-xs font-medium text-foreground/80 hover:text-foreground transition-all cursor-pointer border border-border/30 shadow-none"
                                    >
                                      <span className="flex items-center gap-2">
                                        <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                                        <span>{isExpanded ? "Ver menos" : "Ver más"}</span>
                                      </span>
                                      {isExpanded ? (
                                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                                      ) : (
                                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                      )}
                                    </button>

                                    {isExpanded && (
                                      <div className="pt-1 space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-200 border-t border-border/40 text-left">
                                        {/* A. Macronutrientes Estimados */}
                                        <div className="space-y-1.5">
                                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                                            Macronutrientes Estimados
                                          </span>
                                          <div className="grid grid-cols-4 gap-1.5 sm:gap-2 w-full select-none">
                                            {/* Calorías */}
                                            <div
                                              title="Calorías"
                                              className="px-1 py-1.5 sm:py-2 rounded-xl bg-secondary/40 border border-border/60 flex flex-col items-center justify-center text-center shadow-2xs min-w-0"
                                            >
                                              <span className="text-[7.5px] font-bold uppercase text-muted-foreground/80 leading-none">
                                                Calorías
                                              </span>
                                              <span className="text-xs font-black text-foreground tabular-nums leading-tight mt-0.5">
                                                {item.calories || 420}
                                              </span>
                                            </div>

                                            {/* Proteínas */}
                                            <div
                                              title="Proteínas"
                                              className="px-1 py-1.5 sm:py-2 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/20 flex flex-col items-center justify-center text-center shadow-2xs min-w-0"
                                            >
                                              <span className="text-[7.5px] font-bold uppercase text-emerald-700 dark:text-emerald-400 leading-none">
                                                Proteínas
                                              </span>
                                              <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 tabular-nums leading-tight mt-0.5">
                                                {item.protein || 32}g
                                              </span>
                                            </div>

                                            {/* Carbos */}
                                            <div
                                              title="Carbohidratos"
                                              className="px-1 py-1.5 sm:py-2 rounded-xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/20 flex flex-col items-center justify-center text-center shadow-2xs min-w-0"
                                            >
                                              <span className="text-[7.5px] font-bold uppercase text-amber-700 dark:text-amber-400 leading-none">
                                                Carbos
                                              </span>
                                              <span className="text-xs font-black text-amber-700 dark:text-amber-400 tabular-nums leading-tight mt-0.5">
                                                {item.carbs || 45}g
                                              </span>
                                            </div>

                                            {/* Grasas */}
                                            <div
                                              title="Grasas"
                                              className="px-1 py-1.5 sm:py-2 rounded-xl bg-sky-500/10 dark:bg-sky-950/30 border border-sky-500/20 flex flex-col items-center justify-center text-center shadow-2xs min-w-0"
                                            >
                                              <span className="text-[7.5px] font-bold uppercase text-sky-700 dark:text-sky-400 leading-none">
                                                Grasas
                                              </span>
                                              <span className="text-xs font-black text-sky-700 dark:text-sky-400 tabular-nums leading-tight mt-0.5">
                                                {item.fat || 12}g
                                              </span>
                                            </div>
                                          </div>
                                        </div>

                                        {/* B. 7 Vectores Nutricionales — Estilo Nutrition Facts */}
                                        <NutritionFactsTable rows={vectors} className="mt-2" />
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}
                            </div>
                          ) : (
                            <>
                              {item.img && (
                                <div className="relative h-44 w-full rounded-t-3xl overflow-hidden group">
                                  <img
                                    src={item.img}
                                    alt={item.title}
                                    draggable={false}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none select-none"
                                  />

                                  <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-background/80 backdrop-blur-md px-1.5 py-1 rounded-full border border-border/60 shadow-xs">
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
                                        handleDeleteTimelineItem(item.id);
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
                                title={(item.title || "Registro de Hidratación")
                                  .replace(/\s*\(Armstrong\)/gi, "")
                                  .trim()}
                                subtitle={(item.desc || "Nivel 2 — Amarillo Pálido")
                                  .replace(/\s*\(Hidratación Saludable\)/gi, "")
                                  .replace(/\s*\(Armstrong\)/gi, "")
                                  .trim()}
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
                                        handleDeleteTimelineItem(item.id);
                                      }}
                                      className="p-1 text-muted-foreground hover:text-rose-500 transition cursor-pointer"
                                      title="Eliminar registro"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                }
                              />
                            </div>
                          ) : (
                            <>
                              <CardHeader className="p-5 pb-3">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="space-y-1.5 flex-1 min-w-0 text-left">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <CardTitle className="text-base sm:text-lg font-black leading-tight text-foreground">
                                        {item.type === "activity"
                                          ? (item.activityName || item.title || "")
                                              .replace(/\s*\(\d+\s*min\)/gi, "")
                                              .trim()
                                          : item.type === "workout"
                                            ? (item.workoutType || (item.title ? item.title.split(/[:\-–—]/)[0] : "Fuerza")).trim()
                                            : item.title}
                                      </CardTitle>
                                      {item.isAiSuggestion && (
                                        <Badge
                                          variant="outline"
                                          className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] font-black rounded-full px-2 py-0.5 shadow-none flex items-center gap-1 shrink-0"
                                        >
                                          <Sparkles className="w-3 h-3 text-amber-500" />
                                          <span>Sugerencia IA</span>
                                        </Badge>
                                      )}
                                    </div>
                                    {item.type !== "meal" && item.subtitle ? (
                                      <CardDescription className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                        {item.subtitle}
                                      </CardDescription>
                                    ) : null}
                                  </div>
                                  {!item.img && (
                                    <div className="flex items-center gap-1 bg-secondary/80 backdrop-blur-md px-1.5 py-1 rounded-full border border-border/60 shadow-xs shrink-0">
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
                                          handleDeleteTimelineItem(item.id);
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
                                 <CardContent className="px-5 pb-4 pt-0 space-y-3.5">
                                   {(() => {
                                     const isExpanded = !!expandedMealInsights[item.id];
                                     const mealCalories = Math.round(
                                       item.calories ??
                                         item.kcal ??
                                         (item.ingredients && item.ingredients.length > 0
                                           ? item.ingredients.reduce(
                                               (s: number, i: any) => s + (i.calories || 0),
                                               0,
                                             )
                                           : item.isAiSuggestion
                                             ? 420
                                             : 0),
                                     );
                                     const mealProtein = Math.round(
                                       item.protein ??
                                         (item.ingredients && item.ingredients.length > 0
                                           ? item.ingredients.reduce(
                                               (s: number, i: any) => s + (i.protein || 0),
                                               0,
                                             )
                                           : item.isAiSuggestion
                                             ? 32
                                             : 0),
                                     );
                                     const mealCarbs = Math.round(
                                       item.carbs ??
                                         item.carbohydrates ??
                                         (item.ingredients && item.ingredients.length > 0
                                           ? item.ingredients.reduce(
                                               (s: number, i: any) => s + (i.carbs || 0),
                                               0,
                                             )
                                           : item.isAiSuggestion
                                             ? 45
                                             : 0),
                                     );
                                     const mealFat = Math.round(
                                       item.fat ??
                                         (item.ingredients && item.ingredients.length > 0
                                           ? item.ingredients.reduce(
                                               (s: number, i: any) => s + (i.fat || 0),
                                               0,
                                             )
                                           : item.isAiSuggestion
                                             ? 12
                                             : 0),
                                     );
                                     const mealFiber = Math.round(
                                       item.fiber ??
                                         (item.ingredients && item.ingredients.length > 0
                                           ? item.ingredients.reduce(
                                               (s: number, i: any) => s + (i.fiber || 0),
                                               0,
                                             )
                                           : item.isAiSuggestion
                                             ? 8
                                             : 4),
                                     );

                                      const dynamicCtas = getMealDynamicCtas(item);
                                      const coachInsightText = getMealCoachInsightText(item);

                                      const heroBadges =
                                        item.vectorBadges && item.vectorBadges.length > 0
                                          ? item.vectorBadges.slice(0, 4).map((vb: any) => ({
                                              id: vb.id || vb.category,
                                              category: vb.category,
                                              label: vb.badgeText || vb.label || vb.text,
                                            }))
                                          : [
                                              { id: "b-1", category: "processing", label: "Mínimamente procesado" },
                                              {
                                                id: "b-2",
                                                category: "protein",
                                                label: mealProtein >= 25 ? "Alta en proteína" : "Proteína moderada",
                                              },
                                              {
                                                id: "b-3",
                                                category: "fiber",
                                                label: mealFiber >= 4 ? "Buena fuente de fibra" : "Aporte de fibra",
                                              },
                                              { id: "b-4", category: "sugar", label: "Sin azúcar añadido" },
                                            ];

                                      const qualityLevel: FoodQualityLevel =
                                        (item.bioGaugeIndex as FoodQualityLevel) ??
                                        (item.bioScore
                                          ? item.bioScore >= 80
                                            ? 5
                                            : item.bioScore >= 65
                                              ? 4
                                              : item.bioScore >= 50
                                                ? 3
                                                : item.bioScore >= 35
                                                  ? 2
                                                  : 1
                                          : item.scoreGrade === "A"
                                            ? 5
                                            : item.scoreGrade === "B"
                                              ? 4
                                              : item.scoreGrade === "C"
                                                ? 3
                                                : 4);

                                      const qualityLabel =
                                        item.bioQualityLabel ||
                                        (qualityLevel >= 4
                                          ? "Alto"
                                          : qualityLevel === 3
                                            ? "Medio"
                                            : "Bajo");

                                      const contextBadge = item.timingFit?.label
                                        ? { label: item.timingFit.label, type: item.timingFit.type }
                                        : item.contextBadge
                                          ? { label: item.contextBadge }
                                          : undefined;

                                      return (
                                          <div className="space-y-3 pt-0.5 text-left">
                                            {/* VALOR NUTRICIONAL: Dial radial con badges cualitativos (Visible en Bienestar y Atleta) */}
                                            <div className="pb-0.5">
                                              <FoodProfileHero
                                                qualityLabel={qualityLabel}
                                                qualityLevel={qualityLevel}
                                                badges={heroBadges}
                                                contextBadge={contextBadge}
                                                isAthleteMode={isAthleteMode}
                                              />
                                            </div>

                                            {/* MODO ATLETA: Barra horizontal compacta de macros de precisión */}
                                            {isAthleteMode && (
                                              <div className="pt-2 border-t border-border/40 animate-in fade-in duration-200">
                                                <div className="flex flex-wrap items-center justify-between gap-y-1.5 gap-x-2 py-0.5 select-none">
                                                  {/* Calorías */}
                                                  <div className="flex items-baseline gap-1">
                                                    <span className="text-sm sm:text-base font-black text-foreground tabular-nums">
                                                      {mealCalories}
                                                    </span>
                                                    <span className="text-[11px] font-medium text-muted-foreground">
                                                      kcal
                                                    </span>
                                                  </div>

                                                  {/* Píldoras compactas inline de macros */}
                                                  <div className="flex items-center gap-1.5 sm:gap-2">
                                                    {/* Proteína */}
                                                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400">
                                                      <span className="text-[10px] font-black uppercase tracking-wider">P</span>
                                                      <span className="text-xs font-bold tabular-nums text-foreground">{mealProtein}g</span>
                                                    </div>

                                                    {/* Grasas */}
                                                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
                                                      <span className="text-[10px] font-black uppercase tracking-wider">G</span>
                                                      <span className="text-xs font-bold tabular-nums text-foreground">{mealFat}g</span>
                                                    </div>

                                                    {/* Carbos */}
                                                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                                                      <span className="text-[10px] font-black uppercase tracking-wider">C</span>
                                                      <span className="text-xs font-bold tabular-nums text-foreground">{mealCarbs}g</span>
                                                    </div>

                                                    {/* Fibra */}
                                                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400">
                                                      <span className="text-[10px] font-black uppercase tracking-wider">F</span>
                                                      <span className="text-xs font-bold tabular-nums text-foreground">{mealFiber}g</span>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            )}

                                          {/* 3. Fila con Botón Ver Insight y Reacciones (Mg / No Mg) a la derecha */}
                                          <div className="flex items-center justify-between gap-2 py-1">
                                            {/* Botón Ver Insight */}
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                toggleMealInsights(item.id);
                                              }}
                                              className="relative z-10 rounded-full px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 bg-secondary/80 hover:bg-secondary text-foreground border border-border/80 hover:border-foreground/30 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 transition-all duration-300 cursor-pointer shrink-0"
                                            >
                                              <Sparkles className="w-3.5 h-3.5 text-foreground/80 shrink-0" />
                                              <span>{isExpanded ? "Ocultar insight" : "Ver insight"}</span>
                                            </button>

                                            {/* Reacciones / Feedback estilo red social (Mg / No Mg) */}
                                            <div className="flex items-center gap-0.5 shrink-0">
                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleMealFeedback(item.id, "like");
                                                }}
                                                className="p-1.5 flex items-center justify-center transition-transform active:scale-75 cursor-pointer text-muted-foreground/60 hover:text-foreground"
                                                title="Me gusta"
                                                aria-label="Me gusta"
                                              >
                                                <ThumbsUp
                                                  className={cn(
                                                    "w-4 h-4 transition-all duration-200",
                                                    item.feedback === "like"
                                                      ? "fill-foreground text-foreground scale-110"
                                                      : "stroke-[1.75] hover:scale-110",
                                                  )}
                                                />
                                              </button>

                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleMealFeedback(item.id, "dislike");
                                                }}
                                                className="p-1.5 flex items-center justify-center transition-transform active:scale-75 cursor-pointer text-muted-foreground/60 hover:text-foreground"
                                                title="No me gusta"
                                                aria-label="No me gusta"
                                              >
                                                <ThumbsDown
                                                  className={cn(
                                                    "w-4 h-4 transition-all duration-200",
                                                    item.feedback === "dislike"
                                                      ? "fill-foreground text-foreground scale-110"
                                                      : "stroke-[1.75] hover:scale-110",
                                                  )}
                                                />
                                              </button>
                                            </div>
                                          </div>

                                          {/* 4. Sección de Insight Minimalista y Plano */}
                                          {isExpanded && (
                                            <div className="pt-1 pb-1 space-y-3.5 text-left animate-in fade-in slide-in-from-top-2 duration-300">
                                              {/* Texto de Insight con elevación hover y Typewriter Markdown */}
                                              <div className="p-3.5 sm:p-4 rounded-2xl border border-border/50 bg-secondary/20 hover:border-foreground/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                                                <TypewriterMarkdown
                                                  content={coachInsightText}
                                                  className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed font-normal"
                                                />
                                              </div>

                                              {/* CTAs Dinámicos — Cada CTA con su propia línea de puntos y botón secundario refinado */}
                                              {dynamicCtas.map((cta) => {
                                                const isCtaExpanded = expandedMealCta[item.id] === cta.id;
                                                const isArmstrongLogged =
                                                  loggedMicroActions[item.id]?.type === "armstrong" &&
                                                  (cta.id === "evaluate-hydration" || cta.id === "check_hydration_armstrong");
                                                const currentArmstrongLevel =
                                                  loggedMicroActions[item.id]?.level;
                                                const isBreathingLogged =
                                                  loggedMicroActions[item.id]?.type === "vagal_pause" &&
                                                  cta.id === "take_a_pause";

                                                return (
                                                  <div key={cta.id} className="space-y-2">
                                                    {/* Fila con Botón CTA */}
                                                    <div className="flex items-center gap-2 py-0.5">
                                                      {/* Botón CTA Píldora Neutro Secundario */}
                                                      <button
                                                        type="button"
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                          if (cta.id === "take_a_pause") {
                                                            handleOpenBreathingPause(item.id, item.title);
                                                            return;
                                                          }
                                                          if (cta.id === "evaluate-hydration" || cta.id === "check_hydration_armstrong") {
                                                            setActiveModal("hydration-armstrong");
                                                            return;
                                                          }
                                                          toggleMealCta(item.id, cta.id);
                                                        }}
                                                        className={cn(
                                                          "relative z-10 rounded-full px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 border shadow-2xs hover:shadow-xs hover:-translate-y-0.5 transition-all duration-300 cursor-pointer shrink-0 max-w-[85%]",
                                                          isCtaExpanded
                                                            ? "bg-secondary text-foreground border-foreground/30 shadow-xs"
                                                            : "bg-secondary/60 hover:bg-secondary text-foreground border-border/80 hover:border-foreground/30",
                                                        )}
                                                      >
                                                        {cta.iconType === "apple" ? (
                                                          <Apple className="w-3.5 h-3.5 text-foreground/80 shrink-0" />
                                                        ) : cta.iconType === "droplet" ? (
                                                          <Droplet className="w-3.5 h-3.5 text-foreground/80 shrink-0" />
                                                        ) : cta.iconType === "wind" ? (
                                                          <Wind className="w-3.5 h-3.5 text-foreground/80 shrink-0" />
                                                        ) : cta.iconType === "plus" ? (
                                                          <PlusCircle className="w-3.5 h-3.5 text-foreground/80 shrink-0" />
                                                        ) : (
                                                          <Sparkles className="w-3.5 h-3.5 text-foreground/80 shrink-0" />
                                                        )}
                                                        <span className="truncate">{cta.title}</span>
                                                        {isArmstrongLogged && (
                                                          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ml-1">
                                                            <Check className="w-3 h-3 stroke-[3]" />
                                                            Nivel {currentArmstrongLevel}
                                                          </span>
                                                        )}
                                                        {isBreathingLogged && (
                                                          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ml-1">
                                                            <Check className="w-3 h-3 stroke-[3]" />
                                                            Realizada
                                                          </span>
                                                        )}
                                                      </button>
                                                    </div>

                                                      {/* In-Place Expanded Content del CTA en formato Markdown fluido con streaming */}
                                                      {isCtaExpanded && (
                                                        <div className="px-1 py-1 text-left space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                                                          <div className="p-3.5 sm:p-4 rounded-2xl border border-border/50 bg-secondary/20 hover:border-foreground/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                                                            <TypewriterMarkdown
                                                              content={getMealCtaMarkdownContent(cta.id, item)}
                                                              className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed font-normal"
                                                            />
                                                          </div>

                                                          {cta.id === "add-accompaniment" && (
                                                            <div className="pt-1 space-y-1.5">
                                                              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                                                                Toca para sumar a este plato (1 toque)
                                                              </span>
                                                              <div className="flex flex-wrap gap-1.5">
                                                                {[
                                                                  "Agua fresca de apoyo",
                                                                  "Café o té sin azúcar",
                                                                  "Ensalada de hojas verdes",
                                                                  "Fruta fresca",
                                                                  "Puñado de frutos secos",
                                                                ].map((acc) => (
                                                                  <button
                                                                    key={acc}
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                      e.stopPropagation();
                                                                      handleAddAccompanimentToMeal(item.id, acc);
                                                                    }}
                                                                    className="px-3 py-1.5 rounded-full bg-secondary/60 hover:bg-secondary border border-border/60 hover:border-foreground/30 hover:-translate-y-0.5 hover:shadow-xs text-xs font-medium text-foreground transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95"
                                                                  >
                                                                    <Plus className="w-3 h-3 text-foreground/70" />
                                                                    <span>{acc}</span>
                                                                  </button>
                                                                ))}
                                                              </div>
                                                            </div>
                                                          )}
                                                        </div>
                                                      )}
                                                    </div>
                                                  );
                                                })}
                                            </div>
                                          )}

                                        </div>
                                      );
                                   })()}
                                 </CardContent>
                              ) : (
                                <CardContent className="px-5 pb-4 pt-0 space-y-3 text-left">
                                  {(() => {
                                    const resolvedMuscles =
                                      item.muscleImages && item.muscleImages.length > 0
                                        ? item.muscleImages
                                        : (item.musclesWorked || item.muscles || []).map(
                                            (mId: string) => {
                                              const g = MUSCLE_GROUPS.find(
                                                (mg) => mg.id === mId,
                                              );
                                              return {
                                                id: mId,
                                                name: g?.name || mId,
                                                image: g?.image || "/gimnasia.png",
                                              };
                                            },
                                          );

                                    return (
                                      <>
                                        {/* Description / Summary / Badges & Muscle Avatars */}
                                        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-0.5">
                                          <div className="flex flex-wrap items-center gap-1.5">
                                            {item.type === "workout" ? (
                                              (() => {
                                                const workoutFocus = (() => {
                                                  if (item.focus) return item.focus;
                                                  if (item.targetRegion) return item.targetRegion;
                                                  if (item.title && item.title.includes(":")) {
                                                    return item.title.split(":")[1].trim();
                                                  }
                                                  const muscles = (item.musclesWorked || item.muscles || []).map((m: any) =>
                                                    typeof m === "string" ? m.toLowerCase() : (m.id || m.name || "").toLowerCase(),
                                                  );
                                                  const upper = ["pecho", "espalda", "hombros", "biceps", "triceps", "pectoral", "dorsal", "trapecio"];
                                                  const lower = ["cuadriceps", "gluteos", "isquios", "pantorrillas", "femoral", "piernas"];
                                                  const hasUpper = muscles.some((m: string) => upper.some((u) => m.includes(u)));
                                                  const hasLower = muscles.some((m: string) => lower.some((l) => m.includes(l)));
                                                  if (hasUpper && hasLower) return "Cuerpo Completo";
                                                  if (hasLower) return "Tren Inferior";
                                                  return "Tren Superior";
                                                })();

                                                const workoutDuration = (() => {
                                                  if (item.durationMinutes) return `${item.durationMinutes} min`;
                                                  if (item.duration) return `${item.duration} min`;
                                                  const match = (item.subtitle || item.desc || item.coachFeedback || "").match(/(\d+)\s*min/i);
                                                  return match ? `${match[1]} min` : "25 min";
                                                })();

                                                const workoutIntensity = (() => {
                                                  if (item.intensityLabel) return item.intensityLabel;
                                                  if (item.intensity) {
                                                    return item.intensity === "high" || item.intensity === "extenuante"
                                                      ? "Intensidad Alta"
                                                      : item.intensity === "med" || item.intensity === "optima"
                                                        ? "Intensidad Óptima"
                                                        : "Intensidad Moderada";
                                                  }
                                                  const sub = (item.subtitle || "").toLowerCase();
                                                  if (sub.includes("óptima") || sub.includes("optima")) return "Intensidad Óptima";
                                                  if (sub.includes("alta") || sub.includes("extenuante")) return "Intensidad Alta";
                                                  if (sub.includes("moderada") || sub.includes("media")) return "Intensidad Media";
                                                  return "Intensidad Óptima";
                                                })();

                                                return (
                                                  <div className="flex flex-wrap items-center gap-1.5">
                                                    <Badge
                                                      variant="outline"
                                                      className="rounded-full px-3 py-1 text-[11px] font-semibold border-border/70 bg-secondary/30 text-foreground flex items-center gap-1.5 shadow-none"
                                                    >
                                                      <span>{workoutFocus}</span>
                                                    </Badge>
                                                    <Badge
                                                      variant="outline"
                                                      className="rounded-full px-3 py-1 text-[11px] font-semibold border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center gap-1.5 shadow-none"
                                                    >
                                                      <Clock className="w-3.5 h-3.5 text-sky-500" />
                                                      <span>{workoutDuration}</span>
                                                    </Badge>
                                                    <Badge
                                                      variant="outline"
                                                      className="rounded-full px-3 py-1 text-[11px] font-semibold border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center gap-1.5 shadow-none"
                                                    >
                                                      <Activity className="w-3.5 h-3.5 text-amber-500" />
                                                      <span>{workoutIntensity}</span>
                                                    </Badge>
                                                  </div>
                                                );
                                              })()
                                            ) : item.type === "activity" ? (
                                              (() => {
                                                const actDuration =
                                                  item.duration
                                                    ? `${item.duration} min`
                                                    : item.title?.match(/\((\d+)\s*min\)/i)?.[1]
                                                      ? `${item.title.match(/\((\d+)\s*min\)/i)?.[1]} min`
                                                      : item.coachFeedback?.match(/(\d+)\s*min/i)?.[1]
                                                        ? `${item.coachFeedback.match(/(\d+)\s*min/i)?.[1]} min`
                                                        : null;

                                                const rawIntensity =
                                                  item.intensityLabel ||
                                                  (item.intensity === "low"
                                                    ? "Baja"
                                                    : item.intensity === "med"
                                                      ? "Media"
                                                      : item.intensity === "high"
                                                        ? "Alta"
                                                        : item.intensity) ||
                                                  item.coachFeedback?.match(/intensidad\s*([a-záéíóú]+)/i)?.[1] ||
                                                  null;

                                                const actIntensity = rawIntensity
                                                  ? rawIntensity.charAt(0).toUpperCase() + rawIntensity.slice(1).toLowerCase()
                                                  : null;

                                                return (
                                                  <div className="flex flex-wrap items-center gap-2">
                                                    {actDuration && (
                                                      <Badge
                                                        variant="outline"
                                                        className="rounded-full px-3 py-1 text-[11px] font-bold border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center gap-1.5 shadow-none"
                                                      >
                                                        <Clock className="w-3.5 h-3.5 text-sky-500" />
                                                        <span>{actDuration}</span>
                                                      </Badge>
                                                    )}
                                                    {actIntensity && (
                                                      <Badge
                                                        variant="outline"
                                                        className="rounded-full px-3 py-1 text-[11px] font-bold border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 shadow-none"
                                                      >
                                                        <Activity className="w-3.5 h-3.5 text-emerald-500" />
                                                        <span>Intensidad {actIntensity}</span>
                                                      </Badge>
                                                    )}
                                                  </div>
                                                );
                                              })()
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

                                          {/* Overlapping muscle group avatars (Stacked like social media reaction bubbles) */}
                                          {resolvedMuscles && resolvedMuscles.length > 0 && (
                                            <div
                                              className="flex items-center -space-x-2.5 overflow-visible py-1 pl-1 shrink-0"
                                              title={`Grupos trabajados: ${resolvedMuscles.map((m: any) => m.name).join(", ")}`}
                                            >
                                              {resolvedMuscles.map((m: any, idx: number) => (
                                                <div
                                                  key={m.id || idx}
                                                  title={m.name}
                                                  className="relative inline-flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-card bg-secondary/90 p-1 shadow-xs transition-all duration-200 hover:scale-125 hover:z-30 hover:ring-foreground/40 cursor-pointer"
                                                  style={{ zIndex: 10 - idx }}
                                                >
                                                  <img
                                                    src={m.image}
                                                    alt={m.name}
                                                    className="h-full w-full object-contain drop-shadow-2xs"
                                                  />
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      </>
                                    );
                                  })()}
                                </CardContent>
                              )}

                              <div className="md:hidden px-5 pb-4 text-xs font-semibold text-muted-foreground">
                                <span>{item.time}</span>
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </Card>
                      </div>
                    </div>
                  </React.Fragment>
                );
              });
            })()}
              </>
            )}
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
                navigate({ to: "/scan" });
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-secondary/70 transition-colors text-left group cursor-pointer"
            >
              <Camera className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform shrink-0" />
              <span className="text-xs font-semibold text-foreground flex-1">
                Escanear comida
              </span>
            </button>

            <button
              onClick={() => {
                setIsFabOpen(false);
                handleOpenBreathingPause();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-secondary/70 transition-colors text-left group cursor-pointer"
            >
              <Wind className="w-4 h-4 text-teal-500 group-hover:scale-110 transition-transform shrink-0" />
              <span className="text-xs font-semibold text-foreground flex-1">
                Tomar una pausa (Respiración)
              </span>
            </button>

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
                Registrar hidratación
              </span>
            </button>

            <button
              onClick={() => {
                setIsFabOpen(false);
                setActiveModal("registrar-peso");
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-secondary/70 transition-colors text-left group cursor-pointer"
            >
              <Scale className="w-4 h-4 text-violet-500 group-hover:scale-110 transition-transform shrink-0" />
              <span className="text-xs font-semibold text-foreground flex-1">
                Registrar peso
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
                    {activityStreakStats.weighted7DayAvg} Pts MET
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

      {/* Check-in QR Scanner Modal */}
      {activeModal === "check-in" && (
        <QRScannerModal
          onClose={() => setActiveModal("none")}
          onScanSuccess={(data) => {
            setActiveModal("none");
            const now = new Date();
            const timeStr = now.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
            const dateStr = now.toISOString().split("T")[0];

            // Actualizar fatiga y recuperación muscular fisiológica
            updateMuscleRecoveryForActivity(
              data.className || "Check-in en Club",
              "med",
              data.durationMinutes || 45,
            );

            const newCheckinItem = {
              id: `checkin-${Date.now()}`,
              createdAt: now.toISOString(),
              type: "workout",
              time: timeStr,
              date: dateStr,
              title: data.className || "Check-in en Club",
              subtitle: data.club,
              desc: `Acceso validado en ${data.club} • ${data.durationMinutes || 45} min`,
              calories: Math.round((data.baseMets || 150) * 2.2),
              coachFeedback: `✓ Check-in verificado en ${data.club}. ¡Excelente sesión!`,
              tag: "Check-in Verificado",
            };

            setUserTimelineItems((prev) => [newCheckinItem, ...prev]);
            toast.success(`✓ Acceso validado en ${data.club}`);
          }}
        />
      )}

      {/* Hydration Armstrong Drawer */}
      <HydrationArmstrongDrawer
        open={activeModal === "hydration-armstrong"}
        onClose={() => setActiveModal("none")}
        onSave={(level, label, feedback) => {
          const now = new Date();
          const timeStr = now.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
          const dateStr = selectedTimelineDate || getTodayIso();

          const newHydrationItem = {
            id: `hydration-${Date.now()}`,
            createdAt: now.toISOString(),
            type: "hydration",
            time: timeStr,
            date: dateStr,
            title: "Registro de Hidratación",
            subtitle: "Chequeo Matutino / Hidratación",
            desc: label
              .replace(/\s*\(Hidratación Saludable\)/gi, "")
              .replace(/\s*\(Armstrong\)/gi, "")
              .trim(),
            level: level,
            coachFeedback: `💧 Consejo Fisiológico: ${feedback}`,
            tag: `Nivel ${level}`,
          };

          setUserTimelineItems((prev) => [newHydrationItem, ...prev]);
          toast.success(`✓ Hidratación registrada: Nivel ${level}`);
        }}
      />

      {/* Vagal Breathing Drawer (Tomar una pausa) */}
      <VagalBreathingDrawer
        open={isBreathingDrawerOpen}
        onOpenChange={setIsBreathingDrawerOpen}
        contextTitle={breathingMealContext}
        onComplete={handleBreathingComplete}
      />

      {/* Registrar Actividad Modal */}
      {activeModal === "registrar-actividad" && (
        <ActivityLogModal
          onClose={() => setActiveModal("none")}
          onSave={(activityName, duration, intensity, metPoints) => {
            const dayLabels = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
            const todayLabel = dayLabels[new Date().getDay()];

            // Actualizar fatiga y recuperación muscular fisiológica
            updateMuscleRecoveryForActivity(activityName, intensity, duration);

            // 1. Update activityData points
            setActivityData((prev) =>
              prev.map((item) =>
                item.day === todayLabel ? { ...item, puntos: item.puntos + metPoints } : item,
              ),
            );

            const intensityName =
              intensity === "low" ? "Baja" : intensity === "med" ? "Media" : "Alta";

            // 2. Append timeline log
            const newAct = {
              id: `custom-act-${Date.now()}`,
              createdAt: new Date().toISOString(),
              date: selectedTimelineDate || new Date().toISOString().split("T")[0],
              time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
              title: activityName,
              activityName: activityName,
              duration: duration,
              intensity: intensity,
              intensityLabel: intensityName,
              subtitle: "Registro de Actividad",
              type: "activity",
              img: null,
              kcal: 0,
              tag: `${duration} min • ${intensityName}`,
              coachFeedback: `Registraste ${duration} min de ${activityName} (intensidad ${intensityName}). ¡Gran trabajo!`,
            };
            setUserTimelineItems((prev) => [newAct, ...prev]);
          }}
          activities={MET_ACTIVITIES}
        />
      )}

      {/* Registrar Peso Modal */}
      {activeModal === "registrar-peso" && (
        <WeightLogModal
          currentWeight={(() => {
            if (typeof window !== "undefined") {
              const savedDirect = localStorage.getItem("user_weight");
              if (savedDirect) return parseFloat(savedDirect);
              const saved = localStorage.getItem("shakerfy_user_profile_edit");
              if (saved) {
                try {
                  const parsed = JSON.parse(saved);
                  if (parsed.weight) return parseFloat(parsed.weight);
                } catch (e) {}
              }
            }
            return 74.2;
          })()}
          units={(() => {
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
          })()}
          onClose={() => setActiveModal("none")}
          onSave={(weightVal, context) => {
            const userUnits = (() => {
              try {
                const s = localStorage.getItem("shakerfy_user_profile_edit");
                if (s) {
                  const p = JSON.parse(s);
                  if (p.units) return p.units;
                }
              } catch (_) {}
              return "metrico";
            })();

            if (typeof window !== "undefined") {
              localStorage.setItem("user_weight", String(weightVal));
              const saved = localStorage.getItem("shakerfy_user_profile_edit");
              if (saved) {
                try {
                  const parsed = JSON.parse(saved);
                  parsed.weight = String(weightVal);
                  localStorage.setItem("shakerfy_user_profile_edit", JSON.stringify(parsed));
                } catch (e) {}
              }

              // Add directly to dedicated weight history
              addStoredWeightLog({
                weight: weightVal,
                context: context || "En ayunas",
                unit: userUnits === "metrico" ? "kg" : "lbs",
                date: selectedTimelineDate || getTodayIso(),
              });
            }

            if ("vibrate" in navigator) {
              navigator.vibrate(15);
            }
            toast.success(`✓ Peso registrado: ${weightVal} ${userUnits === "metrico" ? "kg" : "lbs"}`);
          }}
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
    name: "Greek Yogurt 0%",
    category: "dairy" as const,
    calPer100g: 59,
    pPer100g: 10.0,
    cPer100g: 3.6,
    fPer100g: 0.4,
    fiberPer100g: 0.0,
  },
  {
    name: "Ground Beef 90/10",
    category: "protein" as const,
    calPer100g: 176,
    pPer100g: 20.0,
    cPer100g: 0.0,
    fPer100g: 10.0,
    fiberPer100g: 0.0,
  },
  {
    name: "Spinach",
    category: "veggies" as const,
    calPer100g: 23,
    pPer100g: 2.9,
    cPer100g: 3.6,
    fPer100g: 0.4,
    fiberPer100g: 2.2,
  },
  {
    name: "Banana",
    category: "fruits" as const,
    calPer100g: 89,
    pPer100g: 1.1,
    cPer100g: 22.8,
    fPer100g: 0.3,
    fiberPer100g: 2.6,
  },
  {
    name: "Almonds",
    category: "fats" as const,
    calPer100g: 579,
    pPer100g: 21.0,
    cPer100g: 21.6,
    fPer100g: 49.9,
    fiberPer100g: 12.5,
  },
];

// Subcomponent: Edit Timeline Item Modal (Full Meal, Servings & Ingredients Editor)
function EditTimelineItemModal({
  item,
  onClose,
  onSave,
}: {
  item: any;
  onClose: () => void;
  onSave: (updated: any) => void;
}) {
  const isMeal = item.type === "meal";
  const [title, setTitle] = useState(item.title || "");
  const [time, setTime] = useState(item.time || "");
  const [servings, setServings] = useState<number>(item.servings || 1);
  const [coachFeedback, setCoachFeedback] = useState(
    item.coachFeedback || item.narrative || item.summary || item.desc || "",
  );
  const [level, setLevel] = useState<number>(item.level || 2);
  const isWeight = item.type === "weight";
  const [weightVal, setWeightVal] = useState<string>(String(item.weight || item.val || 74.2));
  const [weightContext, setWeightContext] = useState<string>(item.context || "En ayunas");

  // Ingredients State (initialized from item or generated from meal calories/macros)
  const [ingredients, setIngredients] = useState<MealIngredientItem[]>(() => {
    if (Array.isArray(item.ingredients) && item.ingredients.length > 0) {
      return item.ingredients;
    }
    const cal = item.calories ?? item.kcal ?? 350;
    const p = item.protein ?? 25;
    const c = item.carbs ?? item.carbohydrates ?? 35;
    const f = item.fat ?? 12;
    return [
      {
        id: `ing-${Date.now()}`,
        name: item.title || "Porción principal",
        category: "protein",
        grams: 150,
        calories: cal,
        protein: p,
        carbs: c,
        fat: f,
        fiber: 2,
        calPer100g: Math.round((cal / 150) * 100),
        pPer100g: Math.round((p / 150) * 100 * 10) / 10,
        cPer100g: Math.round((c / 150) * 100 * 10) / 10,
        fPer100g: Math.round((f / 150) * 100 * 10) / 10,
        fiberPer100g: 1.5,
      },
    ];
  });

  // AI Prompt Adjustment State
  const [aiPromptText, setAiPromptText] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Quick Add Food State
  const [isAddFoodOpen, setIsAddFoodOpen] = useState(false);
  const [foodSearchQuery, setFoodSearchQuery] = useState("");
  const [selectedAddFood, setSelectedAddFood] = useState(COMMON_FOODS_DATABASE[0]);
  const [addGrams, setAddGrams] = useState(100);

  // Dynamic Base and Total Macros Calculation
  const baseCalories = useMemo(
    () => ingredients.reduce((acc, i) => acc + (i.calories || 0), 0),
    [ingredients],
  );
  const baseProtein = useMemo(
    () => ingredients.reduce((acc, i) => acc + (i.protein || 0), 0),
    [ingredients],
  );
  const baseCarbs = useMemo(
    () => ingredients.reduce((acc, i) => acc + (i.carbs || 0), 0),
    [ingredients],
  );
  const baseFat = useMemo(
    () => ingredients.reduce((acc, i) => acc + (i.fat || 0), 0),
    [ingredients],
  );
  const baseFiber = useMemo(
    () => ingredients.reduce((acc, i) => acc + (i.fiber || 0), 0),
    [ingredients],
  );

  const totalCalories = Math.round(baseCalories * servings);
  const totalProtein = Math.round(baseProtein * servings);
  const totalCarbs = Math.round(baseCarbs * servings);
  const totalFat = Math.round(baseFat * servings);
  const totalFiber = Math.round(baseFiber * servings * 10) / 10;

  // Update ingredient grams
  const handleUpdateGrams = (id: string, delta: number) => {
    setIngredients((prev) =>
      prev.map((ing) => {
        if (ing.id !== id) return ing;
        const newGrams = Math.max(10, ing.grams + delta);
        const calPer100 =
          ing.calPer100g || (ing.grams > 0 ? (ing.calories / ing.grams) * 100 : 150);
        const pPer100 =
          ing.pPer100g || (ing.grams > 0 ? (ing.protein / ing.grams) * 100 : 10);
        const cPer100 =
          ing.cPer100g || (ing.grams > 0 ? (ing.carbs / ing.grams) * 100 : 15);
        const fPer100 =
          ing.fPer100g || (ing.grams > 0 ? (ing.fat / ing.grams) * 100 : 5);
        const fiberPer100 = ing.fiberPer100g || 1;
        const factor = newGrams / 100;
        return {
          ...ing,
          grams: newGrams,
          calories: Math.round(calPer100 * factor),
          protein: Math.round(pPer100 * factor * 10) / 10,
          carbs: Math.round(cPer100 * factor * 10) / 10,
          fat: Math.round(fPer100 * factor * 10) / 10,
          fiber: Math.round(fiberPer100 * factor * 10) / 10,
          calPer100g: calPer100,
          pPer100g: pPer100,
          cPer100g: cPer100,
          fPer100g: fPer100,
          fiberPer100g: fiberPer100,
        };
      }),
    );
  };

  // Delete ingredient
  const handleDeleteIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((i) => i.id !== id));
  };

  // Add ingredient submit
  const handleAddIngredientSubmit = () => {
    const factor = addGrams / 100;
    const newItem: MealIngredientItem = {
      id: `food-${Date.now()}`,
      name: selectedAddFood.name,
      category: selectedAddFood.category,
      grams: addGrams,
      calories: Math.round(selectedAddFood.calPer100g * factor),
      protein: Math.round(selectedAddFood.pPer100g * factor * 10) / 10,
      carbs: Math.round(selectedAddFood.cPer100g * factor * 10) / 10,
      fat: Math.round(selectedAddFood.fPer100g * factor * 10) / 10,
      fiber: Math.round(selectedAddFood.fiberPer100g * factor * 10) / 10,
      calPer100g: selectedAddFood.calPer100g,
      pPer100g: selectedAddFood.pPer100g,
      cPer100g: selectedAddFood.cPer100g,
      fPer100g: selectedAddFood.fPer100g,
      fiberPer100g: selectedAddFood.fiberPer100g,
    };
    setIngredients((prev) => [...prev, newItem]);
    setIsAddFoodOpen(false);
    toast.success(`+ ${selectedAddFood.name} (${addGrams}g) agregado`);
  };

  // Natural Language AI Correction
  const handleApplyAiPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPromptText.trim()) return;

    setIsAiThinking(true);
    setTimeout(() => {
      const lower = aiPromptText.toLowerCase();

      if (
        lower.includes("sin") ||
        lower.includes("no syrup") ||
        lower.includes("sin salsa") ||
        lower.includes("sin queso")
      ) {
        const matchWord = lower
          .replace("sin", "")
          .replace("no", "")
          .trim();
        setIngredients((prev) =>
          prev.filter((i) => !matchWord || !i.name.toLowerCase().includes(matchWord)),
        );
      } else if (lower.includes("doble") || lower.includes("double")) {
        setServings((s) => s * 2);
      } else if (lower.includes("mitad") || lower.includes("half")) {
        setServings((s) => Math.max(0.5, s / 2));
      } else if (lower.includes("extra") || lower.includes("mas") || lower.includes("más")) {
        const matchWord = lower
          .replace("extra", "")
          .replace("mas", "")
          .replace("más", "")
          .trim();
        setIngredients((prev) =>
          prev.map((i) =>
            matchWord && i.name.toLowerCase().includes(matchWord)
              ? {
                  ...i,
                  grams: i.grams + 40,
                  calories: Math.round(i.calories * 1.3),
                  protein: Math.round(i.protein * 1.3 * 10) / 10,
                }
              : i,
          ),
        );
      } else {
        const newItem: MealIngredientItem = {
          id: `custom-ai-${Date.now()}`,
          name: aiPromptText.slice(0, 30),
          category: "carbs",
          grams: 80,
          calories: 140,
          protein: 4.5,
          carbs: 18.0,
          fat: 5.5,
          fiber: 2.0,
          calPer100g: 175,
          pPer100g: 5.6,
          cPer100g: 22.5,
          fPer100g: 6.8,
          fiberPer100g: 2.5,
        };
        setIngredients((prev) => [...prev, newItem]);
      }

      setIsAiThinking(false);
      setAiPromptText("");
      toast.success("✓ Cal AI ajustó el plato");
    }, 400);
  };

  const filteredFoods = COMMON_FOODS_DATABASE.filter((f) =>
    f.name.toLowerCase().includes(foodSearchQuery.toLowerCase()),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isMeal) {
      onSave({
        ...item,
        title: title.trim(),
        time: time.trim() || item.time,
        servings,
        ingredients,
        calories: totalCalories,
        kcal: totalCalories,
        protein: totalProtein,
        carbs: totalCarbs,
        carbohydrates: totalCarbs,
        fat: totalFat,
        fiber: totalFiber,
      });
      toast.success("✓ Comida actualizada correctamente");
    } else if (item.type === "hydration") {
      const currentLevelObj =
        ARMSTRONG_LEVELS.find((l) => l.level === level) || ARMSTRONG_LEVELS[1];
      onSave({
        ...item,
        title: title.trim(),
        time: time.trim() || item.time,
        level,
        desc: `${currentLevelObj.title} (${currentLevelObj.state})`,
        tag: `Nivel ${level} Armstrong`,
        coachFeedback: coachFeedback.trim() || `💧 Consejo Fisiológico: ${currentLevelObj.advice}`,
      });
      toast.success("✓ Registro de hidratación actualizado");
    } else if (item.type === "weight") {
      const parsedW = parseFloat(weightVal) || item.weight || 74.2;
      onSave({
        ...item,
        title: title.trim() || `Registro de Peso (${parsedW} ${item.unit || "kg"})`,
        time: time.trim() || item.time,
        weight: parsedW,
        context: weightContext,
        subtitle: `Check-in Biométrico • ${weightContext}`,
        desc: `Peso: ${parsedW} ${item.unit || "kg"} (${weightContext})`,
        tag: `${parsedW} ${item.unit || "kg"}`,
        coachFeedback: coachFeedback.trim() || item.coachFeedback,
      });
      toast.success("✓ Registro de peso actualizado");
    } else {
      onSave({
        ...item,
        title: title.trim(),
        time: time.trim() || item.time,
        coachFeedback: coachFeedback.trim(),
        desc: coachFeedback.trim() || item.desc,
        narrative: coachFeedback.trim() || item.narrative,
      });
      toast.success("✓ Registro actualizado");
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg p-6 bg-card border border-border rounded-3xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader className="mb-3 text-left">
          <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
            {isMeal ? (
              <>
                <Utensils className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Editar Comida Escaneada</span>
              </>
            ) : item.type === "hydration" ? (
              <>
                <Droplet className="w-4 h-4 text-sky-500 shrink-0" />
                <span>Editar Registro de Hidratación</span>
              </>
            ) : item.type === "weight" ? (
              <>
                <Scale className="w-4 h-4 text-violet-500 shrink-0" />
                <span>Editar Registro de Peso</span>
              </>
            ) : (
              <span>Editar Registro del Diario</span>
            )}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isMeal
              ? "Ajusta porciones, ingredientes y macronutrientes de este registro."
              : "Modifica la información de tu tarjeta registrada en la línea de tiempo."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Nombre / Título y Hora */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                {isMeal ? "Nombre del plato / comida" : "Título"}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Pechuga de pollo con arroz y ensalada"
                className="flex w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground font-semibold"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Hora</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="Ej: 14:30"
                className="flex w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground font-semibold"
              />
            </div>
          </div>

          {/* Peso y Contexto (si es registro de peso) */}
          {isWeight && (
            <div className="space-y-3 p-3.5 rounded-2xl bg-secondary/30 border border-border/50">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Peso ({item.unit || "kg"})
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={weightVal}
                  onChange={(e) => setWeightVal(e.target.value)}
                  className="flex w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-bold text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Contexto / Momento
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["En ayunas", "Post-entreno", "Noche", "Habitual"].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setWeightContext(opt)}
                      className={cn(
                        "px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer text-center",
                        weightContext === opt
                          ? "bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/30 font-bold shadow-2xs"
                          : "bg-secondary/40 text-muted-foreground border-border/60 hover:bg-secondary hover:text-foreground",
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Porciones (si es comida) */}
          {isMeal && (
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-secondary/30 border border-border/50">
              <div>
                <span className="text-xs font-bold text-foreground block">Porciones</span>
                <span className="text-[10px] text-muted-foreground">Ajusta la cantidad consumida</span>
              </div>
              <div className="h-[34px] px-2.5 rounded-xl bg-background border border-border flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setServings((s) => Math.max(0.5, s - 0.5))}
                  disabled={servings <= 0.5}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-40 cursor-pointer p-1"
                  aria-label="Restar porción"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-bold font-mono min-w-[50px] text-center">
                  {servings} {servings === 1 ? "porc." : "porcs."}
                </span>
                <button
                  type="button"
                  onClick={() => setServings((s) => s + 0.5)}
                  className="text-muted-foreground hover:text-foreground cursor-pointer p-1"
                  aria-label="Sumar porción"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Si es comida: Resumen de Macros y Calorías Dinámicas */}
          {isMeal && (
            <>
              {/* Macro Cards Resumen */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                  Macronutrientes Totales ({servings} {servings === 1 ? "porción" : "porciones"})
                </span>
                <div className="grid grid-cols-4 gap-1.5 sm:gap-2 w-full select-none">
                  {/* Calorías */}
                  <div
                    title="Calorías"
                    className="px-1 py-1.5 sm:py-2 rounded-xl bg-secondary/40 border border-border/60 flex flex-col items-center justify-center text-center shadow-2xs min-w-0"
                  >
                    <span className="text-[7.5px] font-bold uppercase text-muted-foreground/80 leading-none">
                      Calorías
                    </span>
                    <span className="text-xs font-black text-foreground tabular-nums leading-tight mt-0.5">
                      {totalCalories}
                    </span>
                  </div>

                  {/* Proteínas */}
                  <div
                    title="Proteínas"
                    className="px-1 py-1.5 sm:py-2 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/20 flex flex-col items-center justify-center text-center shadow-2xs min-w-0"
                  >
                    <span className="text-[7.5px] font-bold uppercase text-emerald-700 dark:text-emerald-400 leading-none">
                      Proteínas
                    </span>
                    <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 tabular-nums leading-tight mt-0.5">
                      {totalProtein}g
                    </span>
                  </div>

                  {/* Carbos */}
                  <div
                    title="Carbohidratos"
                    className="px-1 py-1.5 sm:py-2 rounded-xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/20 flex flex-col items-center justify-center text-center shadow-2xs min-w-0"
                  >
                    <span className="text-[7.5px] font-bold uppercase text-amber-700 dark:text-amber-400 leading-none">
                      Carbos
                    </span>
                    <span className="text-xs font-black text-amber-700 dark:text-amber-400 tabular-nums leading-tight mt-0.5">
                      {totalCarbs}g
                    </span>
                  </div>

                  {/* Grasas */}
                  <div
                    title="Grasas"
                    className="px-1 py-1.5 sm:py-2 rounded-xl bg-sky-500/10 dark:bg-sky-950/30 border border-sky-500/20 flex flex-col items-center justify-center text-center shadow-2xs min-w-0"
                  >
                    <span className="text-[7.5px] font-bold uppercase text-sky-700 dark:text-sky-400 leading-none">
                      Grasas
                    </span>
                    <span className="text-xs font-black text-sky-700 dark:text-sky-400 tabular-nums leading-tight mt-0.5">
                      {totalFat}g
                    </span>
                  </div>
                </div>
              </div>

              {/* Ajuste Rápido con IA */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-foreground/80" />
                  <span>Ajustar con IA:</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiPromptText}
                    onChange={(e) => setAiPromptText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleApplyAiPrompt(e);
                      }
                    }}
                    placeholder="e.g. 'sin salsa', 'extra pollo', 'mitad de arroz'..."
                    className="flex-1 h-9 px-3 rounded-xl bg-secondary/50 border border-border text-xs focus:outline-none focus:ring-1 focus:ring-ring text-foreground"
                  />
                  <Button
                    type="button"
                    onClick={handleApplyAiPrompt}
                    disabled={isAiThinking || !aiPromptText.trim()}
                    className="h-9 px-3.5 rounded-xl bg-foreground text-background font-bold text-xs hover:opacity-90 cursor-pointer shrink-0"
                  >
                    {isAiThinking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Ajustar"}
                  </Button>
                </div>
              </div>

              {/* Lista de Ingredientes con Stepper de Gramos */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Ingredientes ({ingredients.length})
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAddFoodOpen(!isAddFoodOpen)}
                    className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:bg-sky-500/10 h-7 px-2 cursor-pointer"
                  >
                    {isAddFoodOpen ? "Cerrar selector" : "+ Agregar Alimento"}
                  </Button>
                </div>

                {/* Sub-panel para Agregar Alimento */}
                {isAddFoodOpen && (
                  <div className="p-3 rounded-2xl bg-secondary/60 border border-border/80 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                    <span className="text-xs font-bold text-foreground block">
                      Selecciona un alimento de la base de datos
                    </span>
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={foodSearchQuery}
                        onChange={(e) => setFoodSearchQuery(e.target.value)}
                        placeholder="Buscar alimento (ej: Pollo, Avena, Huevo)..."
                        className="w-full h-8 pl-8 pr-3 rounded-xl bg-background border border-border text-xs focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto custom-scrollbar">
                      {filteredFoods.slice(0, 8).map((food) => (
                        <button
                          key={food.name}
                          type="button"
                          onClick={() => setSelectedAddFood(food)}
                          className={cn(
                            "p-2 rounded-xl text-left text-xs border transition-all cursor-pointer flex flex-col justify-between",
                            selectedAddFood.name === food.name
                              ? "bg-foreground text-background border-foreground font-bold"
                              : "bg-background/80 hover:bg-background border-border/60 text-foreground",
                          )}
                        >
                          <span className="truncate block font-semibold">{food.name}</span>
                          <span className="text-[10px] opacity-70">
                            {food.calPer100g} kcal / 100g
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-1 border-t border-border/40">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground">Cantidad:</span>
                        <input
                          type="number"
                          min="10"
                          step="10"
                          value={addGrams}
                          onChange={(e) => setAddGrams(Math.max(10, Number(e.target.value) || 10))}
                          className="w-16 h-8 px-2 rounded-lg bg-background border border-border text-xs font-bold text-center"
                        />
                        <span className="text-xs text-muted-foreground font-medium">gramos</span>
                      </div>

                      <Button
                        type="button"
                        size="sm"
                        onClick={handleAddIngredientSubmit}
                        className="h-8 px-3 rounded-xl bg-foreground text-background font-bold text-xs hover:opacity-90 cursor-pointer"
                      >
                        + Agregar
                      </Button>
                    </div>
                  </div>
                )}

                {/* Lista de Items */}
                <div className="space-y-1.5 max-h-52 overflow-y-auto custom-scrollbar pr-0.5">
                  {ingredients.map((ing) => (
                    <div
                      key={ing.id}
                      className="p-2.5 rounded-2xl bg-secondary/30 border border-border/50 flex items-center justify-between gap-2 text-left"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-foreground block truncate">
                          {ing.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {Math.round(ing.calories * servings)} kcal • {ing.category}
                        </span>
                      </div>

                      {/* Stepper de Gramos */}
                      <div className="flex items-center gap-1 bg-background px-2 py-1 rounded-xl border border-border shrink-0">
                        <button
                          type="button"
                          onClick={() => handleUpdateGrams(ing.id, -20)}
                          className="text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
                          title="Restar 20g"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-12 text-center font-mono">
                          {Math.round(ing.grams * servings)}g
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateGrams(ing.id, 20)}
                          className="text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
                          title="Sumar 20g"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteIngredient(ing.id)}
                        className="text-muted-foreground hover:text-rose-500 cursor-pointer p-1"
                        title="Eliminar ingrediente"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Hidratación: Armstrong Scale */}
          {item.type === "hydration" && (
            <div className="space-y-1.5 pt-1">
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

          {/* Nota solo para registros que no sean comida ni hidratación */}
          {!isMeal && item.type !== "hydration" && (
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-semibold text-muted-foreground">Nota</label>
              <textarea
                rows={2}
                value={coachFeedback}
                onChange={(e) => setCoachFeedback(e.target.value)}
                placeholder="Agrega una nota..."
                className="flex w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground font-medium"
              />
            </div>
          )}

          <div className="flex gap-2 justify-end pt-3 border-t border-border/40">
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
              className="rounded-xl text-xs font-bold bg-foreground text-background hover:opacity-90 cursor-pointer"
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
  const displayTitle = (title || "Registro de Hidratación")
    .replace(/\s*\(Armstrong\)/gi, "")
    .trim();
  const displaySubtitle = (subtitle || currentObj.title)
    .replace(/\s*\(Hidratación Saludable\)/gi, "")
    .replace(/\s*\(Armstrong\)/gi, "")
    .trim();

  return (
    <div className={cn("space-y-5 text-left w-full", className)}>
      {/* Header section with flex alignment */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-0.5 text-left">
          <h3 className="text-lg font-bold text-foreground tracking-tight">{displayTitle}</h3>
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

interface HydrationArmstrongDrawerProps {
  open?: boolean;
  onClose: () => void;
  onSave: (level: number, label: string, feedback: string) => void;
}

function HydrationArmstrongDrawer({ open = true, onClose, onSave }: HydrationArmstrongDrawerProps) {
  const isMobile = useIsMobile();
  const [selectedLevel, setSelectedLevel] = useState<number>(2);
  const currentLevelObj =
    ARMSTRONG_LEVELS.find((l) => l.level === selectedLevel) || ARMSTRONG_LEVELS[1];

  const handleConfirm = () => {
    onSave(
      currentLevelObj.level,
      currentLevelObj.title,
      currentLevelObj.advice,
    );
    onClose();
  };

  const bodyContent = (
    <div className="py-2 space-y-4 text-left">
      <ArmstrongUrineScaleVisual
        selectedLevel={selectedLevel}
        onSelectLevel={(lvl) => setSelectedLevel(lvl)}
        readOnly={false}
        title="Hydration Check"
        subtitle="Toca la cápsula de color para seleccionar tu nivel"
      />

      {/* Riboflavin warning note & Disclaimer */}
      <div className="p-3.5 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-[11px] text-muted-foreground leading-relaxed space-y-1.5 text-left">
        <p>
          💡 <strong>Nota fisiológica:</strong> Suplementos de Vitamina B2 (Riboflavina) o multivitamínicos pueden pigmentar la orina de amarillo intenso sin implicar deshidratación.
        </p>
        <p className="text-[10px] text-muted-foreground/70">
          * Guía orientativa de bienestar basada en Armstrong (ACSM). No constituye prescripción médica ni sustituye la consulta médica.
        </p>
      </div>
    </div>
  );

  const footerButtons = (
    <>
      <Button
        variant="outline"
        type="button"
        onClick={onClose}
        className="flex-1 sm:flex-none rounded-xl font-semibold cursor-pointer"
      >
        Cancelar
      </Button>
      <Button
        type="button"
        onClick={handleConfirm}
        className="flex-1 sm:flex-none rounded-xl font-bold bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer shadow-xs"
      >
        Registrar Estado Hídrico
      </Button>
    </>
  );

  // Versión de Escritorio (>= 768px): Modal centrado (Dialog)
  if (!isMobile) {
    return (
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent className="sm:max-w-lg rounded-3xl p-6 sm:p-7 border border-border bg-card shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar text-left">
          <DialogHeader className="pb-2 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplet className="w-5 h-5 text-cyan-500 shrink-0" />
                <DialogTitle className="text-lg font-bold text-foreground">
                  Registro de Hidratación
                </DialogTitle>
              </div>
              <Link
                to="/blog/$slug"
                params={{ slug: "escala-de-armstrong-y-fisiologia-de-la-hidratacion" }}
                className="text-[11px] font-semibold text-emerald-500 hover:underline flex items-center gap-1 shrink-0"
              >
                <span>Escala Armstrong</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <DialogDescription className="text-xs text-muted-foreground pt-1 text-left">
              Selecciona el nivel colorimétrico de osmolalidad urinaria (Dr. Lawrence Armstrong, ACSM).
            </DialogDescription>
          </DialogHeader>

          {bodyContent}

          <DialogFooter className="px-0 pt-2 pb-0 flex flex-row items-center justify-end gap-2.5">
            {footerButtons}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Versión Móvil (< 768px): Hoja deslizable (Drawer / Bottom Sheet)
  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DrawerContent className="px-6 pb-8 pt-2 max-w-lg mx-auto overflow-hidden">
        <DrawerHeader className="pb-3 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplet className="w-5 h-5 text-cyan-500 shrink-0" />
              <DrawerTitle className="text-lg font-bold text-foreground">
                Registro de Hidratación
              </DrawerTitle>
            </div>
            <Link
              to="/blog/$slug"
              params={{ slug: "escala-de-armstrong-y-fisiologia-de-la-hidratacion" }}
              className="text-[11px] font-semibold text-emerald-500 hover:underline flex items-center gap-1 shrink-0"
            >
              <span>Escala Armstrong</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <DrawerDescription className="text-xs text-muted-foreground pt-1 text-left">
            Selecciona el nivel colorimétrico de osmolalidad urinaria (Dr. Lawrence Armstrong, ACSM).
          </DrawerDescription>
        </DrawerHeader>

        {bodyContent}

        <DrawerFooter className="px-0 pt-3 pb-0 flex flex-row items-center justify-end gap-2.5">
          {footerButtons}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

interface WeightLogModalProps {
  currentWeight: string | number;
  units: string;
  onClose: () => void;
  onSave: (weightVal: number, context: string) => void;
}

function WeightLogModal({ currentWeight, units, onClose, onSave }: WeightLogModalProps) {
  const [val, setVal] = useState<string>(String(currentWeight || 74.2));
  const [context, setContext] = useState<string>("En ayunas");

  const contextOptions = [
    "En ayunas",
    "Post-entreno",
    "Noche",
    "Habitual",
  ];

  const handleConfirm = () => {
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed > 0) {
      onSave(parsed, context);
      onClose();
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-3xl p-6 sm:p-7 border border-border bg-card max-h-[90vh] overflow-y-auto custom-scrollbar text-left">
        <DialogHeader className="pb-3 border-b border-border/40">
          <DialogTitle className="text-base font-bold flex items-center gap-2 text-foreground">
            <Scale className="w-5 h-5 text-violet-500" />
            <span>Registro de Peso Biométrico</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground pt-1">
            Registra tu peso para actualizar tu tendencia somática y media móvil semanal.
          </DialogDescription>
        </DialogHeader>

        <div className="py-3 space-y-4">
          {/* Main Weight Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground block">
              Peso ({units === "metrico" ? "kg" : "lbs"})
            </label>
            <div className="relative flex items-center">
              <input
                type="number"
                step="0.1"
                min="20"
                max="300"
                value={val}
                onChange={(e) => setVal(e.target.value)}
                placeholder="74.2"
                className="flex h-14 w-full rounded-2xl border border-border bg-secondary/30 px-4 text-2xl font-black tabular-nums text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                autoFocus
              />
              <span className="absolute right-4 text-sm font-bold text-muted-foreground">
                {units === "metrico" ? "kg" : "lbs"}
              </span>
            </div>
          </div>

          {/* Context Options */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground block">
              Momento / Contexto de la medición
            </label>
            <div className="grid grid-cols-2 gap-2">
              {contextOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setContext(opt)}
                  className={cn(
                    "px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center",
                    context === opt
                      ? "bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/30 font-bold shadow-xs"
                      : "bg-secondary/40 text-muted-foreground border-border/60 hover:bg-secondary hover:text-foreground",
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Somatic Context Note */}
          <div className="p-3.5 rounded-2xl border border-violet-500/20 bg-violet-500/5 text-[11px] text-muted-foreground leading-relaxed space-y-1">
            <p>
              ⚖️ <strong>Tendencia sin ruido:</strong> Tu registro se integrará en la media móvil de 7 días para filtrar oscilaciones temporales de agua y glucógeno.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-border/40 flex items-center justify-end gap-2">
          <Button variant="outline" onClick={onClose} className="rounded-xl font-semibold">
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            className="rounded-xl font-bold bg-violet-600 hover:bg-violet-700 text-white"
          >
            Guardar en Diario
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
