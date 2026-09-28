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
export function ClasesTab({
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
