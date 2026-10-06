import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import { SiteHeader } from "@/components/site-header";
import { Index } from "./index";
import { Button } from "@/components/ui/button";
import {
  User,
  Sparkles,
  QrCode,
  Heart,
  CreditCard,
  Settings,
  Clock,
  Shield,
  ShieldAlert,
  Star,
  X,
} from "lucide-react";
import {
  FavoritosTab,
  ClasesTab,
  PagosTab,
  ConfigTab,
  DiarioTab,
  QRScannerModal,
} from "@/components/app";

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
  { id: "pagos", label: "Suscripción", icon: CreditCard },
  { id: "config", label: "Configuración", icon: Settings },
];

function InicioTab() {
  return <Index hideHeader={true} />;
}

function StudentDashboard() {
  const search = Route.useSearch();
  const validTab = search?.tab && TABS.some((t) => t.id === search.tab) ? (search.tab as string) : "inicio";
  const [activeTab, setActiveTab] = useState(validTab);

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

  // MOCK STATE FOR RESERVATIONS & CANCELLATION VALIDATION
  const [blockedCancellationClass, setBlockedCancellationClass] = useState<any | null>(null);

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
          <div className="relative bg-card border border-border w-full max-w-[360px] rounded-3xl p-6 sm:p-8 text-center">
            <button
              onClick={() => setQrOpen(false)}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-secondary transition"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold tracking-tight">QR de Ingreso</h3>
            <p className="text-xs text-muted-foreground mt-1">Escanea este código en la entrada</p>

            {/* Simulated QR Code Visual */}
            <div className="mx-auto my-6 p-4 bg-white rounded-2xl w-48 h-48 flex flex-col items-center justify-center relative border border-border">
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
          <div className="relative bg-card border border-border w-full max-w-[420px] rounded-3xl p-6 flex flex-col text-center items-center">
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
            className="relative bg-card border border-border w-full max-w-[450px] rounded-3xl p-6 flex flex-col"
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
