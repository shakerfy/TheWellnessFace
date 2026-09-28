import React, { useState, useEffect, useMemo, useRef, useCallback, Fragment } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  User, Calendar, BarChart3, CreditCard, Settings, LogOut, QrCode,
  CheckCircle, CheckCircle2, Clock, AlertTriangle, MapPin, ChevronRight,
  ChevronLeft, X, Sparkles, Shield, ShieldCheck, Award, AlertCircle,
  ShieldAlert, Star, Heart, Flame, Coffee, Droplet, TrendingUp, Info,
  Edit, Sun, Moon, ArrowUpRight, Utensils, Zap, Wheat, MessageSquare,
  Bed, AlarmClock, ArrowUp, Camera, Dumbbell, Brain, Activity, Plus,
  Check, Loader2, ShoppingCart, Copy, Share2, Play, Pause, RotateCcw,
  Search, ChevronUp, ChevronDown, Trash2, FileDown, Navigation, Scan,
  Smartphone, ArrowRightLeft, Mic, Send, RefreshCw, Sliders, PlusCircle,
  MinusCircle, ArrowRight, Layers, Eye, Bookmark, MoreHorizontal, Upload,
  Pencil, ArrowLeft, Beef, Barcode, Minus, Image as ImageIcon, Wind,
  Phone, Mail, FileText, Apple, Sprout, Target, HeartPulse, Timer, Users,
  ChefHat, ThumbsUp, ThumbsDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel
} from "@/components/ui/alert-dialog";
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter
} from "@/components/ui/drawer";
import {
  Tooltip as ShadcnTooltip, TooltipContent, TooltipProvider, TooltipTrigger
} from "@/components/ui/tooltip";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { GYMS } from "@/lib/gyms";
import { useNutritionSettings } from "@/lib/nutrition-settings";
import { BioStateCard } from "@/components/bio-state-card";
import { AdvancedSettingsView } from "@/components/advanced-settings-view";
import { TypewriterText } from "@/components/typewriter";
import { useIsMobile } from "@/hooks/use-mobile";

export function QRScannerModal({
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
