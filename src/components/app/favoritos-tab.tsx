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

export function FavoritosTab() {
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
