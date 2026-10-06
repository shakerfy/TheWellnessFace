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

export function PagosTab() {
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
            Desbloquea AI Food Scan ilimitado, timing fit con tus entrenamientos y micro-insights biológicos.
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
