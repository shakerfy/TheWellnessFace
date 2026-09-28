import { useState, useMemo } from "react";
import {
  MessageCircle,
  Star,
  Send,
  Search,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  GymFacilityReview,
  PrivateFeedbackItem,
  ReseñasTabProps,
  INITIAL_FACILITY_REVIEWS,
  INITIAL_PRIVATE_FEEDBACK,
  ReviewKpis,
  ReviewBreakdown,
  PublicReviewCard,
  PrivateFeedbackCard,
  WhatsAppRequestDialog,
} from "./reseñas";

export type { Review, GymFacilityReview, PrivateFeedbackItem, ReseñasTabProps } from "./reseñas";
export * from "./reseñas";

export function ReseñasTab({ membersList = [] }: ReseñasTabProps) {
  const [subTab, setSubTab] = useState<"public" | "private">("public");

  // Facility reviews & private feedback
  const [facilityReviews, setFacilityReviews] = useState<GymFacilityReview[]>(
    INITIAL_FACILITY_REVIEWS,
  );
  const [privateFeedback, setPrivateFeedback] = useState<PrivateFeedbackItem[]>(
    INITIAL_PRIVATE_FEEDBACK,
  );
  const [featuredReviewIds, setFeaturedReviewIds] = useState<string[]>(["rev-1", "rev-4"]);

  // Filters State for Public Reviews
  const [publicSearch, setPublicSearch] = useState("");
  const [publicRatingFilter, setPublicRatingFilter] = useState("all");
  const [publicStatusFilter, setPublicStatusFilter] = useState("all");

  // Filters State for Private Feedback
  const [privateSearch, setPrivateSearch] = useState("");
  const [privateCategoryFilter, setPrivateCategoryFilter] = useState("all");
  const [privateStatusFilter, setPrivateStatusFilter] = useState("all");

  // Modals state
  const [showRequestWhatsAppModal, setShowRequestWhatsAppModal] = useState(false);
  const [deleteConfirmState, setDeleteConfirmState] = useState<{
    type: "reply_delete" | "private_delete";
    id: string;
    name: string;
  } | null>(null);

  // Calculations
  const totalEvaluationsCount = 312 + (facilityReviews.length - 4);

  const avgCleanliness = useMemo(() => {
    const sum = facilityReviews.reduce((acc, r) => acc + r.ratingCleanliness, 0);
    return (sum / facilityReviews.length).toFixed(1);
  }, [facilityReviews]);

  const avgEquipment = useMemo(() => {
    const sum = facilityReviews.reduce((acc, r) => acc + r.ratingEquipment, 0);
    return (sum / facilityReviews.length).toFixed(1);
  }, [facilityReviews]);

  const avgStaff = useMemo(() => {
    const sum = facilityReviews.reduce((acc, r) => acc + r.ratingStaff, 0);
    return (sum / facilityReviews.length).toFixed(1);
  }, [facilityReviews]);

  const avgPrice = useMemo(() => {
    const sum = facilityReviews.reduce((acc, r) => acc + r.ratingPrice, 0);
    return (sum / facilityReviews.length).toFixed(1);
  }, [facilityReviews]);

  const overallAvg = useMemo(() => {
    const sum = facilityReviews.reduce((acc, r) => acc + r.overallRating, 0);
    return (sum / facilityReviews.length).toFixed(1);
  }, [facilityReviews]);

  const responseRatePercentage = useMemo(() => {
    const repliedCount = facilityReviews.filter((r) => !!r.reply).length;
    return Math.round((repliedCount / facilityReviews.length) * 100);
  }, [facilityReviews]);

  const pendingRepliesCount = useMemo(() => {
    return facilityReviews.filter((r) => !r.reply).length;
  }, [facilityReviews]);

  const pendingPrivateCount = useMemo(() => {
    return privateFeedback.filter((f) => f.status === "Pendiente").length;
  }, [privateFeedback]);

  // Star Distribution
  const starCounts = useMemo(() => {
    return {
      5: Math.round(totalEvaluationsCount * 0.82),
      4: Math.round(totalEvaluationsCount * 0.14),
      3: Math.round(totalEvaluationsCount * 0.03),
      2: Math.round(totalEvaluationsCount * 0.007),
      1: Math.round(totalEvaluationsCount * 0.003),
    };
  }, [totalEvaluationsCount]);

  // Handlers
  const handleSendReply = (id: string, text: string) => {
    if (!text.trim()) return;
    setFacilityReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, reply: text.trim() } : r)),
    );
    toast.success("Respuesta oficial publicada correctamente.");
  };

  const handleToggleFeatured = (id: string) => {
    if (featuredReviewIds.includes(id)) {
      setFeaturedReviewIds((prev) => prev.filter((item) => item !== id));
      toast.info("Reseña removida de las destacadas del perfil público.");
    } else {
      setFeaturedReviewIds((prev) => [...prev, id]);
      toast.success("Reseña destacada para el perfil público.");
    }
  };

  const handleSaveAdminNote = (id: string, text: string) => {
    setPrivateFeedback((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, adminNotes: text.trim(), status: "Atendido" } : item,
      ),
    );
    toast.success("Nota interna guardada y sugerencia marcada como Atendida.");
  };

  const handleTogglePrivateStatus = (id: string) => {
    setPrivateFeedback((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === "Pendiente" ? "Atendido" : "Pendiente" }
          : item,
      ),
    );
    toast.info("Estado de sugerencia actualizado.");
  };

  const handleConfirmDeleteAction = () => {
    if (!deleteConfirmState) return;
    const { type, id, name } = deleteConfirmState;
    if (type === "reply_delete") {
      setFacilityReviews((prev) => prev.map((r) => (r.id === id ? { ...r, reply: "" } : r)));
      toast.info(`Respuesta oficial a "${name}" eliminada.`);
    } else if (type === "private_delete") {
      setPrivateFeedback((prev) => prev.filter((f) => f.id !== id));
      toast.info(`Sugerencia privada de "${name}" eliminada.`);
    }
    setDeleteConfirmState(null);
  };

  const sendWhatsAppReviewRequest = (phone: string, studentName: string) => {
    if (!phone.trim()) {
      toast.error("Por favor selecciona un alumno con número de WhatsApp válido.");
      return;
    }
    const cleanPhone = phone.replace(/[^\d+]/g, "");
    const text = encodeURIComponent(
      `Hola ${studentName || "estimado/a alumno/a"}, ¡gracias por entrenar en Shakerfy! Nos encantaría conocer tu opinión para seguir mejorando nuestras instalaciones y servicios. Podés enviarnos tus sugerencias o valorar tu experiencia en 1 minuto. ¡Muchas gracias!`,
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, "_blank");
    toast.success("Solicitud de opinión iniciada por WhatsApp.");
  };

  // Filtered Lists
  const filteredPublicReviews = useMemo(() => {
    return facilityReviews.filter((r) => {
      const q = publicSearch.toLowerCase();
      const matchSearch =
        r.studentName.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q) ||
        (r.reply && r.reply.toLowerCase().includes(q));

      const matchRating =
        publicRatingFilter === "all"
          ? true
          : Math.floor(r.overallRating) === parseInt(publicRatingFilter);

      const matchStatus =
        publicStatusFilter === "all"
          ? true
          : publicStatusFilter === "unreplied"
            ? !r.reply
            : publicStatusFilter === "replied"
              ? !!r.reply
              : publicStatusFilter === "featured"
                ? featuredReviewIds.includes(r.id)
                : true;

      return matchSearch && matchRating && matchStatus;
    });
  }, [facilityReviews, publicSearch, publicRatingFilter, publicStatusFilter, featuredReviewIds]);

  const filteredPrivateFeedback = useMemo(() => {
    return privateFeedback.filter((f) => {
      const q = privateSearch.toLowerCase();
      const matchSearch =
        f.studentName.toLowerCase().includes(q) ||
        f.message.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q);

      const matchCat = privateCategoryFilter === "all" || f.category === privateCategoryFilter;
      const matchStatus = privateStatusFilter === "all" || f.status === privateStatusFilter;

      return matchSearch && matchCat && matchStatus;
    });
  }, [privateFeedback, privateSearch, privateCategoryFilter, privateStatusFilter]);

  return (
    <div className="space-y-6 animate-fade-in text-foreground">
      {/* Navigation Header & Quick Request Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 bg-card border border-border/80 p-3 rounded-3xl shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5 bg-secondary/50 p-1 rounded-2xl border border-border/50">
          <button
            type="button"
            onClick={() => setSubTab("public")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              subTab === "public"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            Reseñas Públicas del Centro ({facilityReviews.length})
          </button>

          <button
            type="button"
            onClick={() => setSubTab("private")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 relative cursor-pointer ${
              subTab === "private"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <MessageCircle className="h-4 w-4 text-primary" />
            Buzón Privado & Sugerencias ({privateFeedback.length})
            {pendingPrivateCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            size="sm"
            onClick={() => setShowRequestWhatsAppModal(true)}
            className="h-9 rounded-xl font-bold text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
          >
            <Send className="h-4 w-4" /> Solicitar Reseña por WhatsApp
          </Button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <ReviewKpis
        overallAvg={overallAvg}
        totalEvaluationsCount={totalEvaluationsCount}
        responseRatePercentage={responseRatePercentage}
        pendingRepliesCount={pendingRepliesCount}
        featuredCount={featuredReviewIds.length}
        pendingPrivateCount={pendingPrivateCount}
      />

      {subTab === "public" ? (
        <div className="space-y-6">
          {/* Rating Breakdowns: Stars distribution + Sub-ratings */}
          <ReviewBreakdown
            avgCleanliness={avgCleanliness}
            avgEquipment={avgEquipment}
            avgStaff={avgStaff}
            avgPrice={avgPrice}
            starCounts={starCounts}
            totalEvaluationsCount={totalEvaluationsCount}
          />

          {/* Filter Bar for Public Reviews */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-secondary/20 border border-border/50 rounded-2xl">
            <div className="relative flex-1 min-w-[200px] sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por alumno o comentario..."
                value={publicSearch}
                onChange={(e) => setPublicSearch(e.target.value)}
                className="h-9 w-full pl-8 pr-3 rounded-xl border border-border bg-background text-xs font-bold text-foreground placeholder:font-normal placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <Select
                value={publicRatingFilter}
                onValueChange={(val) => setPublicRatingFilter(val)}
              >
                <SelectTrigger className="w-full sm:w-[160px] h-9 rounded-xl border border-border bg-background text-xs font-bold text-foreground">
                  <SelectValue placeholder="Puntuación" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-border bg-popover text-popover-foreground">
                  <SelectItem value="all">Todas las Estrellas</SelectItem>
                  <SelectItem value="5">5 Estrellas (★ 5.0)</SelectItem>
                  <SelectItem value="4">4 Estrellas (★ 4.0)</SelectItem>
                  <SelectItem value="3">3 Estrellas (★ 3.0)</SelectItem>
                  <SelectItem value="2">2 Estrellas (★ 2.0)</SelectItem>
                  <SelectItem value="1">1 Estrella (★ 1.0)</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={publicStatusFilter}
                onValueChange={(val) => setPublicStatusFilter(val)}
              >
                <SelectTrigger className="w-full sm:w-[190px] h-9 rounded-xl border border-border bg-background text-xs font-bold text-foreground">
                  <SelectValue placeholder="Estado de Respuesta" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-border bg-popover text-popover-foreground">
                  <SelectItem value="all">Todos los Estados</SelectItem>
                  <SelectItem value="unreplied">Sin Responder</SelectItem>
                  <SelectItem value="replied">Respondidas</SelectItem>
                  <SelectItem value="featured">Destacadas en Perfil</SelectItem>
                </SelectContent>
              </Select>

              {(publicSearch || publicRatingFilter !== "all" || publicStatusFilter !== "all") && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setPublicSearch("");
                    setPublicRatingFilter("all");
                    setPublicStatusFilter("all");
                  }}
                  className="h-9 text-[11px] font-bold text-muted-foreground hover:text-rose-600 rounded-xl cursor-pointer"
                >
                  Limpiar Filtros
                </Button>
              )}
            </div>
          </div>

          {/* Public Reviews Cards Feed */}
          <div className="space-y-4">
            {filteredPublicReviews.length === 0 ? (
              <div className="p-8 text-center bg-card border border-border/80 rounded-3xl text-muted-foreground italic text-xs">
                No se encontraron reseñas públicas con los filtros seleccionados.
              </div>
            ) : (
              filteredPublicReviews.map((rev) => (
                <PublicReviewCard
                  key={rev.id}
                  review={rev}
                  isFeatured={featuredReviewIds.includes(rev.id)}
                  onToggleFeatured={handleToggleFeatured}
                  onSendReply={handleSendReply}
                  onRequestDeleteReply={(id, name) =>
                    setDeleteConfirmState({ type: "reply_delete", id, name })
                  }
                />
              ))
            )}
          </div>
        </div>
      ) : (
        /* Private Suggestions & Feedback View */
        <div className="space-y-6">
          {/* Info Header */}
          <div className="p-4 rounded-2xl bg-secondary/30 border border-border/60 flex items-start gap-3">
            <MessageCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-foreground block">
                Buzón Privado de Mensajes y Sugerencias
              </span>
              <p className="text-muted-foreground leading-relaxed">
                Mensajes directos enviados por los alumnos a la dirección del centro. Este feedback
                es 100% privado y permite resolver inquietudes de forma personalizada.
              </p>
            </div>
          </div>

          {/* Filter Bar for Private Feedback */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-secondary/20 border border-border/50 rounded-2xl">
            <div className="relative flex-1 min-w-[200px] sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por alumno, mensaje o categoría..."
                value={privateSearch}
                onChange={(e) => setPrivateSearch(e.target.value)}
                className="h-9 w-full pl-8 pr-3 rounded-xl border border-border bg-background text-xs font-bold text-foreground placeholder:font-normal placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <Select
                value={privateCategoryFilter}
                onValueChange={(val) => setPrivateCategoryFilter(val)}
              >
                <SelectTrigger className="w-full sm:w-[180px] h-9 rounded-xl border border-border bg-background text-xs font-bold text-foreground">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-border bg-popover text-popover-foreground">
                  <SelectItem value="all">Todas las Categorías</SelectItem>
                  <SelectItem value="Instalaciones">Instalaciones</SelectItem>
                  <SelectItem value="Clases & Horarios">Clases & Horarios</SelectItem>
                  <SelectItem value="Climatización">Climatización</SelectItem>
                  <SelectItem value="Atención / Staff">Atención / Staff</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={privateStatusFilter}
                onValueChange={(val) => setPrivateStatusFilter(val)}
              >
                <SelectTrigger className="w-full sm:w-[160px] h-9 rounded-xl border border-border bg-background text-xs font-bold text-foreground">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-border bg-popover text-popover-foreground">
                  <SelectItem value="all">Todos los Estados</SelectItem>
                  <SelectItem value="Pendiente">Pendientes</SelectItem>
                  <SelectItem value="Atendido">Atendidos</SelectItem>
                </SelectContent>
              </Select>

              {(privateSearch ||
                privateCategoryFilter !== "all" ||
                privateStatusFilter !== "all") && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setPrivateSearch("");
                    setPrivateCategoryFilter("all");
                    setPrivateStatusFilter("all");
                  }}
                  className="h-9 text-[11px] font-bold text-muted-foreground hover:text-rose-600 rounded-xl cursor-pointer"
                >
                  Limpiar Filtros
                </Button>
              )}
            </div>
          </div>

          {/* Private Feedback Feed */}
          <div className="space-y-4">
            {filteredPrivateFeedback.length === 0 ? (
              <div className="p-8 text-center bg-card border border-border/80 rounded-3xl text-muted-foreground italic text-xs">
                No hay mensajes o sugerencias privadas con los filtros seleccionados.
              </div>
            ) : (
              filteredPrivateFeedback.map((fb) => (
                <PrivateFeedbackCard
                  key={fb.id}
                  feedback={fb}
                  onToggleStatus={handleTogglePrivateStatus}
                  onSaveAdminNote={handleSaveAdminNote}
                  onRequestDelete={(id, name) =>
                    setDeleteConfirmState({ type: "private_delete", id, name })
                  }
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* Modal: Solicitar Reseñas por WhatsApp */}
      <WhatsAppRequestDialog
        open={showRequestWhatsAppModal}
        onOpenChange={setShowRequestWhatsAppModal}
        membersList={membersList}
        onSendWhatsApp={sendWhatsAppReviewRequest}
      />

      {/* Confirmation Modal for Deletions */}
      {deleteConfirmState && (
        <AlertDialog
          open={!!deleteConfirmState}
          onOpenChange={(open) => !open && setDeleteConfirmState(null)}
        >
          <AlertDialogContent className="sm:max-w-md border border-border bg-card p-6 rounded-3xl shadow-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-rose-600" /> Confirmar Eliminación
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs text-muted-foreground pt-1 leading-relaxed">
                {deleteConfirmState.type === "reply_delete" && (
                  <>
                    ¿Estás seguro de que deseas eliminar tu <strong>Respuesta Oficial</strong> a la
                    reseña de <strong>"{deleteConfirmState.name}"</strong>? La reseña volverá a
                    quedar como pendiente de respuesta.
                  </>
                )}
                {deleteConfirmState.type === "private_delete" && (
                  <>
                    ¿Estás seguro de que deseas eliminar la sugerencia privada enviada por{" "}
                    <strong>"{deleteConfirmState.name}"</strong>?
                  </>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2 pt-3">
              <AlertDialogCancel
                onClick={() => setDeleteConfirmState(null)}
                className="rounded-xl text-xs font-bold border-border cursor-pointer"
              >
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDeleteAction}
                className="rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs cursor-pointer"
              >
                Sí, Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
