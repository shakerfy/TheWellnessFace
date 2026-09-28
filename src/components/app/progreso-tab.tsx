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

export function ProgresoTab() {
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
