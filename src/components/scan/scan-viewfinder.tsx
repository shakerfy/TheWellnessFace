import React from "react";
import {
  ArrowLeft,
  RefreshCw,
  HelpCircle,
  MoreHorizontal,
  Check,
  Camera,
  Sparkles,
  X,
  Baseline,
  ImageIcon,
  Minus,
  Plus,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CAL_AI_SAMPLE_MEALS } from "@/lib/scan-data";

export interface EatingReasonOption {
  id: "rutina" | "social" | "placer" | "confort";
  emoji?: string;
  label: string;
  description: string;
}

export const EATING_REASON_OPTIONS: EatingReasonOption[] = [
  {
    id: "rutina",
    emoji: "💼",
    label: "Rutina",
    description: "El día a día, comidas normales, de oficina, estudio o la cena habitual.",
  },
  {
    id: "social",
    emoji: "🎉",
    label: "Social",
    description: "Eventos, reuniones, salidas o comidas compartidas que reducen el cortisol.",
  },
  {
    id: "placer",
    emoji: "🍕",
    label: "Placer",
    description: "Antojos, comidas altamente sabrosas por puro disfrute y recompensa.",
  },
  {
    id: "confort",
    emoji: "🧘",
    label: "Confort",
    description: "Platos cálidos, mimos para el alma o momentos que buscan regulación o alivio emocional.",
  },
];

export interface ScanViewfinderProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  customImage: string | null;
  activeImage: string;
  cameraFacing: "environment" | "user";
  selectedCameraId: string;
  flashlightOn: boolean;
  isScanningLaser: boolean;
  isCameraLoading: boolean;
  cameraError: string | null;
  scanMode: "scan_food" | "voice_log" | "database" | "barcode" | "food_label";
  isCameraActive: boolean;
  availableCameras: MediaDeviceInfo[];
  selectedSampleIndex: number;
  showOptions: boolean;
  nextMealFocus: string | null;
  eatingReason: "rutina" | "social" | "placer" | "confort";
  foodNoteItems: string[];
  totalNotesItemsCount: number;
  libraryInputRef: React.RefObject<HTMLInputElement | null>;

  // Callbacks
  onNavigateBack: () => void;
  onSetScanMode: (mode: "scan_food" | "voice_log" | "database" | "barcode" | "food_label") => void;
  onToggleCameraFacing: () => void;
  onOpenTutorial: () => void;
  onToggleOptions: () => void;
  onSelectCamera: (deviceId: string, label: string) => void;
  onSelectSample: (index: number) => void;
  onActivateLiveCamera: () => void;
  onResetNotes: () => void;
  onClearNotes: () => void;
  onNoteItemChange: (index: number, value: string) => void;
  onNoteItemKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  onAddNoteItem: () => void;
  onRemoveNoteItem: (index: number) => void;
  onAnalyzeFoodNotes: () => void;
  onSetEatingReason: (reason: "rutina" | "social" | "placer" | "confort") => void;
  onDismissNextMealFocus: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTriggerCapture: () => void;
  onRetryCamera: () => void;
}

export function ScanViewfinder({
  videoRef,
  customImage,
  activeImage,
  cameraFacing,
  selectedCameraId,
  flashlightOn,
  isScanningLaser,
  isCameraLoading,
  cameraError,
  scanMode,
  isCameraActive,
  availableCameras,
  selectedSampleIndex,
  showOptions,
  nextMealFocus,
  eatingReason,
  foodNoteItems,
  totalNotesItemsCount,
  libraryInputRef,
  onNavigateBack,
  onSetScanMode,
  onToggleCameraFacing,
  onOpenTutorial,
  onToggleOptions,
  onSelectCamera,
  onSelectSample,
  onActivateLiveCamera,
  onResetNotes,
  onClearNotes,
  onNoteItemChange,
  onNoteItemKeyDown,
  onAddNoteItem,
  onRemoveNoteItem,
  onAnalyzeFoodNotes,
  onSetEatingReason,
  onDismissNextMealFocus,
  onFileUpload,
  onTriggerCapture,
  onRetryCamera,
}: ScanViewfinderProps) {
  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden">
      {scanMode !== "food_label" && scanMode !== "database" ? (
        /* Full Screen Viewfinder: HTML5 Video Stream or Custom Loaded Image */
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

          {/* Camera Loading Indicator */}
          {isCameraLoading && !customImage && (
            <div className="absolute top-24 z-20 px-4 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              <span>Conectando cámara...</span>
            </div>
          )}

          {/* Camera Permission / Error Dialog */}
          {cameraError && !customImage && (
            <div className="absolute top-24 z-20 px-4 py-2.5 rounded-2xl bg-black/85 backdrop-blur-md border border-white/15 text-white text-xs max-w-xs text-center space-y-2 shadow-2xl">
              <p className="text-amber-300 font-semibold">{cameraError}</p>
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={onRetryCamera}
                  className="px-3 py-1 bg-white text-black rounded-lg font-bold text-[11px] cursor-pointer hover:bg-slate-200"
                >
                  Reintentar Conexión
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* Top Bar: Back to App, Scanner Title, Options */}
      <div className="relative z-20 pt-6 sm:pt-8 px-6 max-w-lg mx-auto w-full flex items-center justify-between">
        <button
          type="button"
          onClick={onNavigateBack}
          className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-xl border border-border/60 text-foreground flex items-center justify-center hover:bg-background active:scale-95 transition cursor-pointer shadow-xs"
          aria-label={
            scanMode === "food_label" || scanMode === "database"
              ? "Volver a la Cámara"
              : scanMode === "barcode"
                ? "Volver a Database"
                : "Volver a la App"
          }
          title={
            scanMode === "food_label" || scanMode === "database"
              ? "Volver a la Cámara"
              : scanMode === "barcode"
                ? "Volver a Database"
                : "Volver a la App"
          }
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {scanMode !== "scan_food" ? (
          <div className="px-4 py-1.5 rounded-full bg-background/80 backdrop-blur-xl border border-border/60 shadow-xs flex items-center gap-2">
            <span className="text-foreground font-bold text-xs tracking-wide">
              {scanMode === "database"
                ? "Food Database"
                : scanMode === "barcode"
                  ? "Barcode Scanner"
                  : "Notas de Comida"}
            </span>
            {isCameraActive &&
              !customImage &&
              scanMode !== "food_label" &&
              scanMode !== "database" && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
          </div>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2">
          {scanMode === "food_label" ? (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onResetNotes}
                className="text-[11px] font-semibold text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-full bg-background/80 backdrop-blur-xl border border-border/60 hover:bg-secondary transition cursor-pointer shadow-xs"
                title="Cargar ejemplo estándar"
              >
                Ejemplo
              </button>
              <button
                type="button"
                onClick={onClearNotes}
                className="text-[11px] font-semibold text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-full bg-background/80 backdrop-blur-xl border border-border/60 hover:bg-secondary transition cursor-pointer shadow-xs"
                title="Vaciar notas"
              >
                Vaciar
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={onToggleCameraFacing}
                className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-xl border border-border/60 text-foreground flex items-center justify-center hover:bg-background active:scale-95 transition cursor-pointer shadow-xs"
                title="Cambiar Cámara"
                aria-label="Cambiar Cámara"
              >
                <RefreshCw className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>

              <button
                type="button"
                onClick={onOpenTutorial}
                className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-xl border border-border/60 text-foreground flex items-center justify-center hover:bg-background active:scale-95 transition cursor-pointer shadow-xs"
                aria-label="Guía de Escaneo"
                title="Consejos de precisión"
              >
                <HelpCircle className="w-5 h-5 text-muted-foreground hover:text-foreground" />
              </button>

              <button
                type="button"
                onClick={onToggleOptions}
                className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-xl border border-border/60 text-foreground flex items-center justify-center hover:bg-background active:scale-95 transition cursor-pointer shadow-xs"
                aria-label="Opciones"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Sample Dishes & Device Selector Popover */}
      {showOptions && (
        <div className="absolute top-20 right-6 sm:right-auto sm:left-1/2 sm:translate-x-24 z-40 bg-background/80 backdrop-blur-xl border border-border/60 rounded-2xl p-2.5 shadow-2xl space-y-2 w-64 animate-in fade-in zoom-in-95 text-left max-h-[80vh] overflow-y-auto custom-scrollbar">
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
                  onClick={() =>
                    onSelectCamera(cam.deviceId, cam.label || `Cámara ${idx + 1}`)
                  }
                  className={cn(
                    "w-full text-left text-xs font-semibold px-2.5 py-1.5 rounded-xl transition cursor-pointer flex items-center justify-between",
                    selectedCameraId === cam.deviceId && !customImage
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/30"
                      : "hover:bg-secondary text-foreground",
                  )}
                >
                  <span className="truncate">{cam.label || `Cámara ${idx + 1}`}</span>
                  {selectedCameraId === cam.deviceId && !customImage && (
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
              onClick={() => onSelectSample(idx)}
              className={cn(
                "w-full text-left text-xs font-semibold px-2.5 py-2 rounded-xl transition cursor-pointer flex items-center justify-between",
                selectedSampleIndex === idx && customImage === sample.img
                  ? "bg-foreground text-background font-bold"
                  : "hover:bg-secondary text-foreground",
              )}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <Badge
                  variant="outline"
                  className="text-[9px] px-1.5 py-0 uppercase font-mono shrink-0"
                >
                  {sample.category ? sample.category.toUpperCase() : "COMIDA"}
                </Badge>
                <span className="truncate">{sample.title}</span>
              </div>
              <span className="text-[10px] opacity-80 ml-1 shrink-0 font-medium text-muted-foreground">
                {sample.bioGaugeIndex >= 4
                  ? "Óptimo"
                  : sample.bioGaugeIndex >= 3
                    ? "Alto"
                    : "Equilibrado"}
              </span>
            </button>
          ))}

          <div className="pt-2 border-t border-border/50 space-y-1">
            <button
              type="button"
              onClick={onOpenTutorial}
              className="w-full text-left text-xs font-bold px-2.5 py-1.5 rounded-xl hover:bg-secondary flex items-center gap-1.5 cursor-pointer text-foreground"
            >
              <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Guía de Precisión (Tutorial)</span>
            </button>
            <button
              type="button"
              onClick={onActivateLiveCamera}
              className="w-full text-left text-xs font-bold px-2.5 py-1.5 rounded-xl text-emerald-600 dark:text-emerald-400 hover:bg-secondary flex items-center gap-1.5 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Activar Cámara en Vivo</span>
            </button>
          </div>
        </div>
      )}

      {/* RENDER CONDICIONAL: Solo 2 modos minimalistas ('scan_food' = Foto, 'food_label' = Texto) */}
      {scanMode === "food_label" ? (
        <div className="relative z-10 flex-1 w-full max-w-md mx-auto flex flex-col justify-between overflow-hidden px-5 pt-4 pb-28 select-text">
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pb-28 pt-2">
            {/* Tarjeta Única Minimalista de Texto */}
            <div className="border border-border bg-card shadow-xs rounded-3xl p-5 space-y-4 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                    Registro por Texto
                  </span>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Anotá los alimentos o porciones que comiste.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground">
                  {totalNotesItemsCount} {totalNotesItemsCount === 1 ? "ítem" : "ítems"}
                </span>
              </div>

              <div className="space-y-2">
                {foodNoteItems.map((itemText, idx) => {
                  const isFilled = itemText.trim().length > 0;

                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-secondary/40 border border-border/50 focus-within:border-foreground/30 focus-within:bg-secondary/70 transition-all duration-200 group"
                    >
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full shrink-0 transition-colors",
                          isFilled ? "bg-emerald-500" : "bg-muted-foreground/30",
                        )}
                      />

                      <input
                        type="text"
                        data-note-idx={idx}
                        value={itemText}
                        onChange={(e) => onNoteItemChange(idx, e.target.value)}
                        onKeyDown={(e) => onNoteItemKeyDown(idx, e)}
                        placeholder={
                          idx === 0
                            ? "Ej: 2 huevos revueltos y 1 tostada..."
                            : "Añadir otro alimento..."
                        }
                        className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-xs sm:text-sm font-medium text-foreground placeholder:text-muted-foreground/45 leading-tight"
                      />

                      {foodNoteItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => onRemoveNoteItem(idx)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-rose-500 rounded-lg transition-opacity cursor-pointer"
                          title="Eliminar línea"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Botón "+ Añadir alimento" */}
              <button
                type="button"
                onClick={onAddNoteItem}
                className="w-full py-2 px-3 rounded-2xl border border-dashed border-border/70 hover:border-foreground/30 text-muted-foreground hover:text-foreground text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-secondary/40 transition-all cursor-pointer active:scale-98"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir alimento</span>
              </button>
            </div>
          </div>

          {/* Dock Inferior Minimalista en Modo Texto: Selector Por Qué Comes + Botón Cámara + Botón Analizar */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-md w-[calc(100%-2.5rem)] space-y-3 flex flex-col items-center">
            {/* Selector Píldora de Estado Mental / Metabólico (Solo texto limpio) */}
            <div className="inline-flex items-center p-1 rounded-full bg-secondary/95 backdrop-blur-xl border border-border shadow-md max-w-full">
              {EATING_REASON_OPTIONS.map((opt) => {
                const isActive = eatingReason === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onSetEatingReason(opt.id)}
                    title={opt.description}
                    className={cn(
                      "px-3.5 sm:px-4 py-1.5 rounded-full text-xs flex items-center justify-center transition-all cursor-pointer select-none shrink-0",
                      isActive
                        ? "bg-foreground text-background font-bold shadow-xs"
                        : "text-muted-foreground hover:text-foreground font-semibold",
                    )}
                  >
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Fila de Acción en Modo Texto: Volver a Cámara + Analizar Comida */}
            <div className="flex items-center gap-2.5 w-full">
              <button
                type="button"
                onClick={() => onSetScanMode("scan_food")}
                className="w-12 h-12 rounded-full bg-secondary hover:bg-secondary/80 border border-border text-foreground flex items-center justify-center transition cursor-pointer shadow-md active:scale-90 shrink-0"
                title="Registrar con cámara"
                aria-label="Registrar con cámara"
              >
                <Camera className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={onAnalyzeFoodNotes}
                className="flex-1 h-12 rounded-full bg-foreground text-background shadow-xl hover:bg-foreground/90 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 px-6 cursor-pointer font-bold text-xs sm:text-sm"
                aria-label="Analizar alimentos"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Analizar comida ({totalNotesItemsCount})</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Center Framing Reticle */}
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

          {/* Bottom Dock Navigation & Capture Area */}
          <div className="relative z-20 pb-8 sm:pb-12 px-4 sm:px-6 max-w-md mx-auto w-full space-y-3 select-none flex flex-col items-center">
            {nextMealFocus && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 backdrop-blur-xl border border-emerald-400/30 text-emerald-100 text-[11px] font-medium shadow-lg animate-in fade-in slide-in-from-bottom-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>
                  Intención de tu comida anterior:{" "}
                  <strong className="font-bold text-white">{nextMealFocus}</strong>
                </span>
                <button
                  type="button"
                  onClick={onDismissNextMealFocus}
                  className="ml-1 text-white/60 hover:text-white cursor-pointer"
                  aria-label="Descartar recordatorio"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Switcher Píldora de 4 Categorías de Estado Mental y Metabólico */}
            <div className="inline-flex items-center p-1 rounded-full bg-black/55 backdrop-blur-xl border border-white/15 shadow-lg max-w-full">
              {EATING_REASON_OPTIONS.map((opt) => {
                const isActive = eatingReason === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onSetEatingReason(opt.id)}
                    title={opt.description}
                    className={cn(
                      "px-3.5 sm:px-4 py-1.5 rounded-full text-xs flex items-center justify-center transition-all cursor-pointer select-none shrink-0",
                      isActive
                        ? "bg-white text-black font-bold shadow-xs"
                        : "text-white/75 hover:text-white font-semibold",
                    )}
                  >
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Input oculto para subir desde galería */}
            <input
              ref={libraryInputRef}
              type="file"
              accept="image/*"
              onChange={onFileUpload}
              className="hidden"
            />

            {/* Fila Inferior: Controles de Captura */}
            <div className="flex items-center justify-between px-6 sm:px-10 pt-1 w-full">
              {/* Botón Registrar con Texto (Izquierda) */}
              <button
                type="button"
                onClick={() => onSetScanMode("food_label")}
                className="w-12 h-12 rounded-full bg-neutral-900/85 backdrop-blur-xl border border-white/15 text-white/95 hover:bg-neutral-800 active:scale-90 flex items-center justify-center transition cursor-pointer shadow-md"
                aria-label="Registrar con texto"
                title="Registrar con texto"
              >
                <Baseline className="w-5 h-5 text-white/95 stroke-[2.25]" />
              </button>

              {/* Botón Central: Shutter Blanco (Cámara por defecto) */}
              <button
                type="button"
                onClick={onTriggerCapture}
                disabled={isScanningLaser}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-full border-[3.5px] border-white flex items-center justify-center p-1.5 hover:scale-105 active:scale-90 transition-all shadow-2xl cursor-pointer shrink-0"
                aria-label="Capturar y Analizar"
              >
                <div className="w-full h-full rounded-full bg-white active:bg-neutral-200 transition-colors shadow-inner" />
              </button>

              {/* Botón Galería / Library (Derecha) */}
              <button
                type="button"
                onClick={() => libraryInputRef.current?.click()}
                className="w-12 h-12 rounded-full bg-neutral-900/85 backdrop-blur-xl border border-white/15 text-white/90 hover:bg-neutral-800 active:scale-90 flex items-center justify-center transition cursor-pointer shadow-md"
                title="Subir foto desde galería"
                aria-label="Galería"
              >
                <ImageIcon className="w-5 h-5 text-white/90" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
