import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  Sun,
  Coffee,
  Dumbbell,
  Apple,
  Cake,
  ArrowLeft,
  ChevronLeft,
  ArrowRight,
  MoreHorizontal,
  Utensils,
  Barcode,
  Image as ImageIcon,
  Bookmark,
  Pencil,
  Zap,
  ZapOff,
  Scan,
  FileText,
  Mic,
  AudioLines,
  RefreshCw,
  Camera,
  Check,
  Loader2,
  Plus,
  Minus,
  List,
  Trash2,
  Search,
  Sparkles,
  Info,
  ShieldCheck,
  Award,
  Wind,
  HeartPulse,
  Clock,
  Users,
  Timer,
  Moon,
  Flame,
  Activity,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  X,
} from "lucide-react";
import {
  FoodScannerTutorialDialog,
  STORAGE_KEY_TUTORIAL_SEEN,
} from "@/components/food-scanner-tutorial";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { FoodProfileHero } from "@/components/food-profile-hero";
import { useNutritionSettings } from "@/lib/nutrition-settings";
import { detectBiologicalContext } from "@/lib/ai-suggestion-generator";
import { calculateTimingFit } from "@/lib/timing-fit";

export const Route = createFileRoute("/scan")({
  component: ScanMealPage,
});

export interface MealCalloutPin {
  name: string;
  calories: number;
  topPct: number;
  leftPct?: number;
  rightPct?: number;
}

export interface MealIngredientItem {
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

export interface NutritionVectorBadge {
  id: string;
  category: "processing" | "fiber" | "protein" | "sugar" | "fat" | "grains" | "sodium";
  badgeText: string;
  description: string;
}

export const NUTRIENT_VECTOR_SPECS = [
  { category: "processing", label: "Procesamiento" },
  { category: "fiber", label: "Fibra" },
  { category: "protein", label: "Proteína" },
  { category: "sugar", label: "Azúcares añadidos" },
  { category: "fat", label: "Grasas" },
  { category: "grains", label: "Granos" },
  { category: "sodium", label: "Sodio" },
] as const;

const EN_TO_ES_NUTRIENTS: Record<string, string> = {
  "minimally processed": "Mínimamente procesado",
  "moderately processed": "Moderadamente procesado",
  "unprocessed": "Sin procesar",
  "good source": "Buena fuente",
  "high fiber": "Alto en fibra",
  "source of fiber": "Fuente de fibra",
  "lean": "Proteína magra",
  "lean / high": "Magra / Alta calidad",
  "plant / light": "Vegetal ligero",
  "high quality": "Alta calidad",
  "zero": "Sin azúcar añadido",
  "low": "Bajo",
  "moderate": "Moderadas",
  "healthy fats": "Grasas saludables",
  "healthy fats (omega-3)": "Saludables (Omega-3)",
  "healthy fats (avocado)": "Saludables (Palta)",
  "healthy fats (chia)": "Saludables (Chía)",
  "refined": "Refinados",
  "whole grains": "Granos enteros",
  "grain-free": "Sin granos",
  "elevated": "Elevado",
  "very low": "Muy bajo",
};

export function getMealNutrientRows(
  badges: NutritionVectorBadge[] = [],
  ingredients: MealIngredientItem[] = [],
  servings: number = 1,
): { category: string; label: string; value: string; iconType: "check" | "minus" }[] {
  const badgeMap = new Map<string, string>();
  badges.forEach((b) => badgeMap.set(b.category, b.badgeText));

  const totalFiber = ingredients.reduce((sum, i) => sum + (i.fiber || 0), 0) * servings;
  const totalProtein = ingredients.reduce((sum, i) => sum + (i.protein || 0), 0) * servings;
  const totalFat = ingredients.reduce((sum, i) => sum + (i.fat || 0), 0) * servings;
  const totalCarbs = ingredients.reduce((sum, i) => sum + (i.carbs || 0), 0) * servings;

  return NUTRIENT_VECTOR_SPECS.map(({ category, label }) => {
    let rawValue = badgeMap.get(category);
    let iconType: "check" | "minus" = "check";

    if (!rawValue) {
      if (category === "processing") rawValue = "Mínimamente procesado";
      else if (category === "fiber") rawValue = totalFiber >= 4 ? "Buena fuente" : totalFiber >= 2 ? "Moderada" : "Bajo aporte";
      else if (category === "protein") rawValue = totalProtein >= 25 ? "Proteína magra" : totalProtein >= 12 ? "Moderada" : "Aporte ligero";
      else if (category === "sugar") rawValue = "Sin azúcar añadido";
      else if (category === "fat") rawValue = totalFat >= 15 ? "Moderadas" : totalFat >= 5 ? "Moderadas" : "Bajo aporte";
      else if (category === "grains") rawValue = totalCarbs > 35 ? "Refinados" : totalCarbs > 15 ? "Granos enteros" : "Sin granos";
      else if (category === "sodium") rawValue = "Moderado";
    }

    const valKey = (rawValue || "").trim().toLowerCase();
    const translatedValue = EN_TO_ES_NUTRIENTS[valKey] || rawValue || "Moderado";

    const valLower = translatedValue.toLowerCase();
    if (category === "fat" && (valLower.includes("modera") || valLower.includes("elevad"))) {
      iconType = "minus";
    }

    return {
      category,
      label,
      value: translatedValue,
      iconType,
    };
  });
}

export type FoodScanCategory = "bebida" | "comida" | "snack" | "postre";

export const SCAN_FOOD_CATEGORIES: {
  id: FoodScanCategory;
  label: string;
  sublabel: string;
  icon: any;
  defaultMealType: string;
}[] = [
  { id: "bebida", label: "Bebida", sublabel: "Beverage", icon: Coffee, defaultMealType: "Bebida" },
  { id: "comida", label: "Comida", sublabel: "Meal", icon: Utensils, defaultMealType: "Almuerzo" },
  { id: "snack", label: "Snack", sublabel: "Snack", icon: Apple, defaultMealType: "Colación" },
  { id: "postre", label: "Postre", sublabel: "Dessert", icon: Cake, defaultMealType: "Postre" },
];

export const INITIAL_FOOD_NOTE_ITEMS: string[] = [
  "4 huevos revueltos con aceite de oliva",
  "2 tostadas de pan de masa madre",
  "1 vaso de jugo de naranja natural",
  "20g de almendras tostadas",
  "1 manzana roja fresca",
];

export interface FoodDatabaseItem {
  id: string;
  name: string;
  brand?: string;
  calories: number;
  servingLabel: string;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  category: "protein" | "carbs" | "fats" | "fruit" | "veggie" | "dairy";
}

export const INITIAL_FOOD_DATABASE_ITEMS: FoodDatabaseItem[] = [
  { id: "fd-1", name: "Peanut Butter", calories: 94, servingLabel: "tbsp", protein: 4, carbs: 3, fat: 8, fiber: 1, category: "fats" },
  { id: "fd-2", name: "Avocado", brand: "Calavo", calories: 130, servingLabel: "serving", protein: 2, carbs: 6, fat: 12, fiber: 5, category: "fats" },
  { id: "fd-3", name: "Egg", calories: 74, servingLabel: "large", protein: 6, carbs: 0.4, fat: 5, fiber: 0, category: "protein" },
  { id: "fd-4", name: "Apples", calories: 72, servingLabel: "medium", protein: 0.3, carbs: 19, fat: 0.2, fiber: 3, category: "fruit" },
  { id: "fd-5", name: "Spinach", calories: 7, servingLabel: "cup", protein: 0.9, carbs: 1.1, fat: 0.1, fiber: 0.7, category: "veggie" },
  { id: "fd-6", name: "Oats / Avena", calories: 150, servingLabel: "1/2 cup (40g)", protein: 5, carbs: 27, fat: 3, fiber: 4, category: "carbs" },
  { id: "fd-7", name: "Chicken Breast", calories: 165, servingLabel: "100g", protein: 31, carbs: 0, fat: 3.6, fiber: 0, category: "protein" },
  { id: "fd-8", name: "Greek Yogurt", calories: 100, servingLabel: "150g", protein: 15, carbs: 6, fat: 0.5, fiber: 0, category: "dairy" },
  { id: "fd-9", name: "Brown Rice", calories: 112, servingLabel: "100g", protein: 2.6, carbs: 24, fat: 0.9, fiber: 1.8, category: "carbs" },
  { id: "fd-10", name: "Salmon", calories: 208, servingLabel: "100g", protein: 20, carbs: 0, fat: 13, fiber: 0, category: "protein" },
  { id: "fd-11", name: "Banana", calories: 105, servingLabel: "1 medium", protein: 1.3, carbs: 27, fat: 0.3, fiber: 3.1, category: "fruit" },
  { id: "fd-12", name: "Olive Oil", calories: 119, servingLabel: "1 tbsp", protein: 0, carbs: 0, fat: 14, fiber: 0, category: "fats" },
];

export interface PhytoColorItem {
  name: string;
  bgClass: string;
  phytochemical?: string;
}

export interface SampleMealModel {
  id: string;
  title: string;
  reportTitle: string;
  time: string;
  mealType: string;
  category?: FoodScanCategory;
  img: string;
  servings: number;
  servingLabel?: string;
  highlightNutrient?: string;
  highlightAmount?: string;
  healthScore: number;
  narrative: string;
  // Proprietary Shakerfy Bio-Nutrient Index (0-100)
  bioScore: number;
  bioGrade: string;
  bioQualityLabel: string;
  bioGaugeIndex: number; // 0 to 4
  vectorBadges: NutritionVectorBadge[];
  phytoColors: PhytoColorItem[];
  calloutPins: MealCalloutPin[];
  ingredients: MealIngredientItem[];
}

export const CAL_AI_SAMPLE_MEALS: SampleMealModel[] = [
  {
    id: "calai-raspberry",
    title: "Frambuesas Silvestres Frescas",
    reportTitle: "Frambuesas Silvestres Frescas",
    time: "9:41 AM",
    mealType: "Colación",
    category: "snack",
    img: "https://images.unsplash.com/photo-1577069808021-3e4b77134375?w=800&auto=format&fit=crop&q=80",
    servings: 1,
    servingLabel: "100g por porción",
    highlightNutrient: "Fuente de Vitamina C",
    highlightAmount: "25mg",
    healthScore: 10,
    narrative:
      "Las frambuesas silvestres son un fruto ligero y nutritivo con solo 52 kcal por 100g. Ricas en vitamina C natural, polifenoles antioxidantes y fibra activa.",
    bioScore: 98,
    bioGrade: "A+",
    bioQualityLabel: "Fuente de Vitamina C",
    bioGaugeIndex: 4,
    vectorBadges: [
      {
        id: "v-proc",
        category: "processing",
        badgeText: "Sin procesar",
        description: "Fruta fresca natural sin refinamiento ni aditivos.",
      },
      {
        id: "v-fib",
        category: "fiber",
        badgeText: "Alto en fibra",
        description: "6.5g de fibra vegetal activa por cada 100g.",
      },
      {
        id: "v-sug",
        category: "sugar",
        badgeText: "Sin azúcar añadido",
        description: "Azúcares intrínsecos de absorción modulada.",
      },
    ],
    phytoColors: [
      {
        name: "Rojo / Morado",
        bgClass: "bg-rose-500",
        phytochemical: "Antocianinas y Elagitaninos",
      },
    ],
    calloutPins: [
      {
        name: "Frambuesas Silvestres",
        calories: 52,
        topPct: 45,
        leftPct: 50,
      },
    ],
    ingredients: [
      {
        id: "ing-rasp",
        name: "Natural Raspberry",
        category: "fruits",
        grams: 100,
        calories: 52,
        protein: 1.2,
        carbs: 12,
        fat: 0.7,
        fiber: 6.5,
        calPer100g: 52,
        pPer100g: 1.2,
        cPer100g: 12,
        fPer100g: 0.7,
        fiberPer100g: 6.5,
      },
    ],
  },
  {
    id: "calai-pho",
    title: "Chicken Phở con Fideos de Arroz y Vegetales",
    reportTitle: "Chicken Phở with Noodles, Veggies and Broth",
    time: "2:00 PM",
    mealType: "Almuerzo",
    category: "comida",
    img: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&auto=format&fit=crop&q=80",
    servings: 1,
    healthScore: 8,
    narrative:
      "Sopa tradicional vietnamita con proteína magra de pechuga hervida y fibra de brotes frescos. Matriz de alimentos enteros con alta biodisponibilidad y digestión ligera.",
    bioScore: 88,
    bioGrade: "A",
    bioQualityLabel: "Nutrición Superior & Alta Densidad",
    bioGaugeIndex: 3,
    vectorBadges: [
      {
        id: "v-proc",
        category: "processing",
        badgeText: "Mínimamente procesado",
        description: "Ingredientes enteros cocidos sin aditivos ultraprocesados.",
      },
      {
        id: "v-fib",
        category: "fiber",
        badgeText: "Alto en fibra",
        description: "Aporte prebiótico de brotes de soja frescos y hierbas digestivas.",
      },
      {
        id: "v-prot",
        category: "protein",
        badgeText: "Proteína magra",
        description: "Pollo hervido con perfil completo de aminoácidos esenciales.",
      },
      {
        id: "v-sug",
        category: "sugar",
        badgeText: "Sin azúcar añadido",
        description: "Sin glucosa refinada ni endulzantes industriales.",
      },
      {
        id: "v-fat",
        category: "fat",
        badgeText: "Grasas moderadas",
        description: "Contenido graso bajo que facilita una rápida asimilación.",
      },
      {
        id: "v-grain",
        category: "grains",
        badgeText: "Granos simples",
        description: "Fideos de arroz bánh phở como combustible glucogénico limpio.",
      },
      {
        id: "v-sod",
        category: "sodium",
        badgeText: "Sodio moderado",
        description: "Caldo de huesos sazonado con anís estrellado y salsa de pescado tradicional.",
      },
    ],
    phytoColors: [
      {
        name: "Verde",
        bgClass: "bg-emerald-500",
        phytochemical: "Clorofila y Folatos (brotes y hierbas)",
      },
      {
        name: "Blanco",
        bgClass: "bg-stone-300 dark:bg-stone-400",
        phytochemical: "Alicina y almidón digestible (arroz y caldo)",
      },
    ],
    calloutPins: [
      { name: "Fideos de Arroz", calories: 230, topPct: 45, leftPct: 20 },
      { name: "Pollo Desmenuzado", calories: 170, topPct: 30, rightPct: 28 },
      { name: "Caldo Aromático & Hierbas", calories: 60, topPct: 65, rightPct: 35 },
    ],
    ingredients: [
      {
        id: "pho-noodles",
        name: "Fideos de Arroz (Bánh Phở)",
        category: "carbs",
        grams: 200,
        calories: 230,
        protein: 4,
        carbs: 48,
        fat: 1,
        fiber: 1.5,
        calPer100g: 108,
        pPer100g: 1.8,
        cPer100g: 24,
        fPer100g: 0.2,
        fiberPer100g: 1,
      },
      {
        id: "pho-chicken",
        name: "Pechuga de Pollo Pochada",
        category: "protein",
        grams: 110,
        calories: 170,
        protein: 26,
        carbs: 0,
        fat: 3.5,
        fiber: 0,
        calPer100g: 155,
        pPer100g: 24,
        cPer100g: 0,
        fPer100g: 3.2,
        fiberPer100g: 0,
      },
      {
        id: "pho-broth",
        name: "Caldo de Huesos con Anís",
        category: "veggies",
        grams: 350,
        calories: 60,
        protein: 6,
        carbs: 3,
        fat: 2,
        fiber: 0.5,
        calPer100g: 17,
        pPer100g: 1.7,
        cPer100g: 0.9,
        fPer100g: 0.6,
        fiberPer100g: 0.1,
      },
    ],
  },
  {
    id: "calai-salmon",
    title: "Salmón Salvaje & Brócoli al Vapor",
    reportTitle: "Wild Atlantic Salmon & Steamed Broccoli Tray",
    time: "1:45 PM",
    mealType: "Almuerzo",
    category: "comida",
    img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop&q=80",
    servings: 1,
    healthScore: 9,
    narrative:
      "Máxima densidad micronutricional con ácidos grasos esenciales Omega-3 (EPA/DHA), proteína marina magra y fitonutrientes crucíferos antiinflamatorios.",
    bioScore: 96,
    bioGrade: "A+",
    bioQualityLabel: "Densidad Nutricional Óptima",
    bioGaugeIndex: 4,
    vectorBadges: [
      {
        id: "v-proc",
        category: "processing",
        badgeText: "Sin procesar",
        description: "Cero refinamiento, ingredientes directos en su estado biológico natural.",
      },
      {
        id: "v-fib",
        category: "fiber",
        badgeText: "Alto en fibra",
        description: "Brócoli entero con fibra vegetal que optimiza la flora intestinal.",
      },
      {
        id: "v-prot",
        category: "protein",
        badgeText: "Alto en proteína",
        description: "Salmón del Atlántico con máxima biodisponibilidad proteica.",
      },
      {
        id: "v-sug",
        category: "sugar",
        badgeText: "Sin azúcar añadido",
        description: "Impacto glucémico neutro.",
      },
      {
        id: "v-fat",
        category: "fat",
        badgeText: "Grasas saludables",
        description: "Lípidos cardioprotectores Omega-3.",
      },
      {
        id: "v-grain",
        category: "grains",
        badgeText: "Sin granos",
        description: "Comida cetogénica / paleo limpia.",
      },
      {
        id: "v-sod",
        category: "sodium",
        badgeText: "Bajo en sodio",
        description: "Sin adición excesiva de sal marina.",
      },
    ],
    phytoColors: [
      {
        name: "Verde",
        bgClass: "bg-emerald-500",
        phytochemical: "Sulforafano y Clorofila (brócoli al vapor)",
      },
      {
        name: "Naranja",
        bgClass: "bg-amber-500",
        phytochemical: "Astaxantina y Omega-3 (salmón del Atlántico)",
      },
    ],
    calloutPins: [
      { name: "Salmón del Atlántico", calories: 380, topPct: 35, leftPct: 22 },
      { name: "Brócoli al Vapor", calories: 45, topPct: 58, rightPct: 24 },
    ],
    ingredients: [
      {
        id: "salmon-fillet",
        name: "Filete de Salmón al Grill",
        category: "protein",
        grams: 180,
        calories: 380,
        protein: 36,
        carbs: 0,
        fat: 22,
        fiber: 0,
        calPer100g: 208,
        pPer100g: 20,
        cPer100g: 0,
        fPer100g: 12,
        fiberPer100g: 0,
      },
      {
        id: "broccoli-veg",
        name: "Brócoli Fresco al Vapor",
        category: "veggies",
        grams: 130,
        calories: 45,
        protein: 3.5,
        carbs: 7,
        fat: 0.5,
        fiber: 3.2,
        calPer100g: 34,
        pPer100g: 2.8,
        cPer100g: 6.6,
        fPer100g: 0.4,
        fiberPer100g: 2.6,
      },
    ],
  },
  {
    id: "calai-chicken",
    title: "Bowl de Pollo Grill, Batata Asada & Palta",
    reportTitle: "Grilled Chicken & Sweet Potato Bowl",
    time: "8:15 PM",
    mealType: "Cena",
    category: "comida",
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
    servings: 1,
    healthScore: 9,
    narrative:
      "Equilibrio neuromuscular completo: carbohidratos complejos de batata para recarga de glucógeno, proteína magra de pechuga y grasas monoinsaturadas de palta fresca.",
    bioScore: 92,
    bioGrade: "A+",
    bioQualityLabel: "Densidad Nutricional Óptima",
    bioGaugeIndex: 4,
    vectorBadges: [
      {
        id: "v-proc",
        category: "processing",
        badgeText: "Mínimamente procesado",
        description: "Cocción al horno y plancha sin ultraprocesados.",
      },
      {
        id: "v-fib",
        category: "fiber",
        badgeText: "Alto en fibra",
        description: "Batata con piel y vegetales verdes ricos en fibra soluble.",
      },
      {
        id: "v-prot",
        category: "protein",
        badgeText: "Alto en proteína",
        description: "42g de proteína magra de alta digestibilidad.",
      },
      {
        id: "v-sug",
        category: "sugar",
        badgeText: "Sin azúcar añadido",
        description: "Dulzura natural de la batata asada.",
      },
      {
        id: "v-fat",
        category: "fat",
        badgeText: "Grasas saludables",
        description: "Palta Hass rica en ácido oleico monoinsaturado.",
      },
      {
        id: "v-grain",
        category: "grains",
        badgeText: "Granos enteros",
        description: "Carbohidratos complejos de absorción sostenida.",
      },
      {
        id: "v-sod",
        category: "sodium",
        badgeText: "Bajo en sodio",
        description: "Minerales electrolíticos balanceados.",
      },
    ],
    phytoColors: [
      {
        name: "Verde",
        bgClass: "bg-emerald-500",
        phytochemical: "Luteína y Ácido Oleico (palta y hojas verdes)",
      },
      { name: "Naranja", bgClass: "bg-amber-500", phytochemical: "Beta-carotenos (batata asada)" },
      {
        name: "Blanco",
        bgClass: "bg-stone-300 dark:bg-stone-400",
        phytochemical: "Proteína magra y fibra (pechuga y granos)",
      },
    ],
    calloutPins: [
      { name: "Pechuga de Pollo", calories: 290, topPct: 30, leftPct: 25 },
      { name: "Batata Asada", calories: 160, topPct: 55, rightPct: 22 },
      { name: "Palta & Verdes", calories: 95, topPct: 40, rightPct: 45 },
    ],
    ingredients: [
      {
        id: "chicken-breast",
        name: "Pechuga de Pollo al Grill",
        category: "protein",
        grams: 175,
        calories: 290,
        protein: 42,
        carbs: 0,
        fat: 6,
        fiber: 0,
        calPer100g: 165,
        pPer100g: 31,
        cPer100g: 0,
        fPer100g: 3.6,
        fiberPer100g: 0,
      },
      {
        id: "sweet-potatoes",
        name: "Cubos de Batata Horneada",
        category: "carbs",
        grams: 140,
        calories: 160,
        protein: 2.5,
        carbs: 35,
        fat: 1.5,
        fiber: 4.2,
        calPer100g: 86,
        pPer100g: 1.6,
        cPer100g: 20,
        fPer100g: 0.1,
        fiberPer100g: 3,
      },
      {
        id: "avocado-bowl",
        name: "Palta Hass en Rodajas",
        category: "fats",
        grams: 55,
        calories: 95,
        protein: 1,
        carbs: 4.5,
        fat: 8.5,
        fiber: 3.5,
        calPer100g: 160,
        pPer100g: 2,
        cPer100g: 8.5,
        fPer100g: 14.7,
        fiberPer100g: 6.7,
      },
    ],
  },
  {
    id: "calai-smoothie",
    title: "Smoothie Proteico de Frutos Rojos & Chía",
    reportTitle: "Wild Berry & Chia Protein Recovery Shake",
    time: "10:30 AM",
    mealType: "Bebida",
    category: "bebida",
    img: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&auto=format&fit=crop&q=80",
    servings: 1,
    healthScore: 9,
    narrative:
      "Bebida funcional regenerativa: matriz líquida con polifenoles antioxidantes de frutos del bosque, proteína aislada y ácidos grasos Omega-3 vegetales.",
    bioScore: 94,
    bioGrade: "A+",
    bioQualityLabel: "Densidad Nutricional Óptima",
    bioGaugeIndex: 4,
    vectorBadges: [
      {
        id: "v-proc",
        category: "processing",
        badgeText: "Mínimamente procesado",
        description: "Fruta entera licuada con leche vegetal pura.",
      },
      {
        id: "v-fib",
        category: "fiber",
        badgeText: "Alto en fibra",
        description: "Mucílagos de chía y fibra soluble de frutos rojos.",
      },
      {
        id: "v-prot",
        category: "protein",
        badgeText: "Alto en proteína",
        description: "22g de proteína de absorción eficiente.",
      },
      {
        id: "v-sug",
        category: "sugar",
        badgeText: "Sin azúcar añadido",
        description: "Cero azúcares añadidos ni jarabes industriales.",
      },
      {
        id: "v-fat",
        category: "fat",
        badgeText: "Grasas saludables",
        description: "Omega-3 ALA proveniente de las semillas de chía.",
      },
    ],
    phytoColors: [
      {
        name: "Morado",
        bgClass: "bg-purple-500",
        phytochemical: "Antocianinas y Elagitaninos (arándanos y frambuesas)",
      },
    ],
    calloutPins: [
      { name: "Frutos Rojos", calories: 65, topPct: 30, leftPct: 25 },
      { name: "Proteína Aislada", calories: 110, topPct: 55, rightPct: 30 },
      { name: "Semillas de Chía", calories: 55, topPct: 40, rightPct: 40 },
    ],
    ingredients: [
      {
        id: "berries-mix",
        name: "Mix de Arándanos & Frutillas",
        category: "fruits",
        grams: 130,
        calories: 65,
        protein: 1.5,
        carbs: 14,
        fat: 0.5,
        fiber: 4.5,
        calPer100g: 50,
        pPer100g: 1.1,
        cPer100g: 11,
        fPer100g: 0.4,
        fiberPer100g: 3.5,
      },
      {
        id: "whey-iso",
        name: "Proteína Whey Aislada Natural",
        category: "protein",
        grams: 28,
        calories: 110,
        protein: 24,
        carbs: 1,
        fat: 0.5,
        fiber: 0,
        calPer100g: 390,
        pPer100g: 85,
        cPer100g: 3.5,
        fPer100g: 1.8,
        fiberPer100g: 0,
      },
      {
        id: "chia-seeds",
        name: "Semillas de Chía Enteras",
        category: "fats",
        grams: 12,
        calories: 58,
        protein: 2,
        carbs: 5,
        fat: 3.8,
        fiber: 4,
        calPer100g: 486,
        pPer100g: 16.5,
        cPer100g: 42,
        fPer100g: 30.7,
        fiberPer100g: 34,
      },
    ],
  },
  {
    id: "calai-matcha",
    title: "Matcha Latte Ceremonial & Canela",
    reportTitle: "Ceremonial Matcha Oat Latte",
    time: "4:00 PM",
    mealType: "Bebida",
    category: "bebida",
    img: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=800&auto=format&fit=crop&q=80",
    servings: 1,
    healthScore: 9,
    narrative:
      "Infusión energizante sostenida con L-teanina y EGCG de té verde matcha puro, combinada con leche de avena sin azúcar y canela reguladora de glucosa.",
    bioScore: 90,
    bioGrade: "A",
    bioQualityLabel: "Antioxidante & Foco Sostenido",
    bioGaugeIndex: 3,
    vectorBadges: [
      {
        id: "v-proc",
        category: "processing",
        badgeText: "Mínimamente procesado",
        description: "Hojas de té matcha molidas a la piedra.",
      },
      {
        id: "v-sug",
        category: "sugar",
        badgeText: "Sin azúcar añadido",
        description: "Bebida pura sin jarabes.",
      },
    ],
    phytoColors: [
      {
        name: "Verde",
        bgClass: "bg-emerald-500",
        phytochemical: "EGCG y Clorofila Concentrada",
      },
    ],
    calloutPins: [
      { name: "Matcha Ceremonial", calories: 15, topPct: 40, leftPct: 35 },
      { name: "Leche de Avena", calories: 95, topPct: 60, rightPct: 25 },
    ],
    ingredients: [
      {
        id: "matcha-powder",
        name: "Matcha Ceremonial Grado A",
        category: "veggies",
        grams: 4,
        calories: 12,
        protein: 1,
        carbs: 1.5,
        fat: 0.2,
        fiber: 1,
        calPer100g: 300,
        pPer100g: 25,
        cPer100g: 38,
        fPer100g: 5,
        fiberPer100g: 25,
      },
      {
        id: "oat-milk",
        name: "Leche de Avena Sin Azúcar",
        category: "carbs",
        grams: 220,
        calories: 95,
        protein: 2.5,
        carbs: 14,
        fat: 3,
        fiber: 1.8,
        calPer100g: 43,
        pPer100g: 1.1,
        cPer100g: 6.5,
        fPer100g: 1.4,
        fiberPer100g: 0.8,
      },
    ],
  },
  {
    id: "calai-snack-mix",
    title: "Mix de Almendras, Manzana Verde & Cacao 85%",
    reportTitle: "Raw Almonds, Green Apple & Dark Chocolate",
    time: "5:30 PM",
    mealType: "Snack",
    category: "snack",
    img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80",
    servings: 1,
    healthScore: 9,
    narrative:
      "Colación de saciedad inteligente: pectina de manzana verde para ralentizar absorción, polifenoles de chocolate 85% y magnesio de frutos secos.",
    bioScore: 93,
    bioGrade: "A+",
    bioQualityLabel: "Densidad Nutricional Óptima",
    bioGaugeIndex: 4,
    vectorBadges: [
      {
        id: "v-proc",
        category: "processing",
        badgeText: "Sin procesar",
        description: "Fruta fresca y frutos secos crudos.",
      },
      {
        id: "v-fib",
        category: "fiber",
        badgeText: "Alto en fibra",
        description: "Pectina de manzana y fibra de almendras.",
      },
      {
        id: "v-fat",
        category: "fat",
        badgeText: "Grasas saludables",
        description: "Lípidos monoinsaturados cardioprotectores.",
      },
    ],
    phytoColors: [
      {
        name: "Verde",
        bgClass: "bg-emerald-500",
        phytochemical: "Pectina y Quercetina",
      },
      {
        name: "Marrón",
        bgClass: "bg-amber-900",
        phytochemical: "Flavanoles del Cacao",
      },
    ],
    calloutPins: [
      { name: "Almendras Tostadas", calories: 130, topPct: 35, leftPct: 25 },
      { name: "Manzana Verde", calories: 60, topPct: 55, rightPct: 30 },
      { name: "Chocolate 85%", calories: 55, topPct: 40, rightPct: 35 },
    ],
    ingredients: [
      {
        id: "almonds-raw",
        name: "Almendras Naturales",
        category: "fats",
        grams: 22,
        calories: 130,
        protein: 4.8,
        carbs: 4.5,
        fat: 11,
        fiber: 2.8,
        calPer100g: 579,
        pPer100g: 21,
        cPer100g: 20,
        fPer100g: 49,
        fiberPer100g: 12.5,
      },
      {
        id: "green-apple",
        name: "Manzana Verde Granny Smith",
        category: "fruits",
        grams: 120,
        calories: 62,
        protein: 0.5,
        carbs: 16,
        fat: 0.2,
        fiber: 3.2,
        calPer100g: 52,
        pPer100g: 0.3,
        cPer100g: 13.8,
        fPer100g: 0.2,
        fiberPer100g: 2.4,
      },
      {
        id: "dark-choc",
        name: "Chocolate Amargo 85% Cacao",
        category: "fats",
        grams: 10,
        calories: 55,
        protein: 1,
        carbs: 3.5,
        fat: 4.5,
        fiber: 1.5,
        calPer100g: 550,
        pPer100g: 9,
        cPer100g: 35,
        fPer100g: 45,
        fiberPer100g: 15,
      },
    ],
  },
  {
    id: "calai-greek-yogurt",
    title: "Yogur Griego Natural & Arándanos",
    reportTitle: "Greek Yogurt with Fresh Blueberries",
    time: "11:15 AM",
    mealType: "Snack",
    category: "snack",
    img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&auto=format&fit=crop&q=80",
    servings: 1,
    healthScore: 9,
    narrative:
      "Colación proteica probiótica con cultivos vivos que optimizan la microbiota intestinal y antocianinas antiinflamatorias.",
    bioScore: 95,
    bioGrade: "A+",
    bioQualityLabel: "Alta Proteína & Probióticos",
    bioGaugeIndex: 4,
    vectorBadges: [
      {
        id: "v-proc",
        category: "processing",
        badgeText: "Mínimamente procesado",
        description: "Lácteo fermentado natural.",
      },
      {
        id: "v-prot",
        category: "protein",
        badgeText: "Alto en proteína",
        description: "18g de proteína láctea de lenta asimilación.",
      },
      {
        id: "v-sug",
        category: "sugar",
        badgeText: "Sin azúcar añadido",
        description: "Sin edulcorantes ni glucosa añadida.",
      },
    ],
    phytoColors: [
      {
        name: "Morado",
        bgClass: "bg-purple-500",
        phytochemical: "Antocianinas de arándanos frescos",
      },
    ],
    calloutPins: [
      { name: "Yogur Griego", calories: 120, topPct: 45, leftPct: 30 },
      { name: "Arándanos Frescos", calories: 35, topPct: 30, rightPct: 35 },
    ],
    ingredients: [
      {
        id: "greek-yog",
        name: "Yogur Griego Natural 0%",
        category: "protein",
        grams: 180,
        calories: 120,
        protein: 18,
        carbs: 6,
        fat: 1.5,
        fiber: 0,
        calPer100g: 67,
        pPer100g: 10,
        cPer100g: 3.5,
        fPer100g: 0.8,
        fiberPer100g: 0,
      },
      {
        id: "fresh-blueberries",
        name: "Arándanos Frescos",
        category: "fruits",
        grams: 60,
        calories: 35,
        protein: 0.5,
        carbs: 8.5,
        fat: 0.2,
        fiber: 1.8,
        calPer100g: 57,
        pPer100g: 0.7,
        cPer100g: 14.5,
        fPer100g: 0.3,
        fiberPer100g: 2.4,
      },
    ],
  },
  {
    id: "calai-mousse",
    title: "Mousse de Cacao Puro, Palta & Frutillas",
    reportTitle: "Raw Dark Cacao & Avocado Conscious Mousse",
    time: "9:45 PM",
    mealType: "Postre",
    category: "postre",
    img: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&auto=format&fit=crop&q=80",
    servings: 1,
    healthScore: 9,
    narrative:
      "Postre funcional consciente: textura sedosa lograda con grasas monoinsaturadas de palta, cacao amargo 100% rico en teobromina y magnesio relajante nocturno.",
    bioScore: 90,
    bioGrade: "A",
    bioQualityLabel: "Dulce Consciente & Bajo Impacto Glucémico",
    bioGaugeIndex: 3,
    vectorBadges: [
      {
        id: "v-proc",
        category: "processing",
        badgeText: "Mínimamente procesado",
        description: "Postre a base de alimentos enteros crudos.",
      },
      {
        id: "v-fib",
        category: "fiber",
        badgeText: "Alto en fibra",
        description: "Fibra soluble e insoluble de palta y cacao puro.",
      },
      {
        id: "v-fat",
        category: "fat",
        badgeText: "Grasas saludables",
        description: "Ácidos grasos monoinsaturados que evitan picos de insulina.",
      },
    ],
    phytoColors: [
      {
        name: "Rojo",
        bgClass: "bg-rose-500",
        phytochemical: "Antocianinas y Vitamina C (frutillas)",
      },
      {
        name: "Marrón",
        bgClass: "bg-amber-950",
        phytochemical: "Polifenoles y Teobromina (cacao puro)",
      },
    ],
    calloutPins: [
      { name: "Mousse de Cacao & Palta", calories: 150, topPct: 40, leftPct: 25 },
      { name: "Frutillas Frescas", calories: 25, topPct: 30, rightPct: 30 },
    ],
    ingredients: [
      {
        id: "cacao-mousse-base",
        name: "Base de Palta & Cacao 100%",
        category: "fats",
        grams: 90,
        calories: 150,
        protein: 3.5,
        carbs: 11,
        fat: 11.5,
        fiber: 6,
        calPer100g: 166,
        pPer100g: 3.8,
        cPer100g: 12.2,
        fPer100g: 12.8,
        fiberPer100g: 6.6,
      },
      {
        id: "fresh-strawberries",
        name: "Frutillas en Láminas",
        category: "fruits",
        grams: 70,
        calories: 23,
        protein: 0.5,
        carbs: 5.5,
        fat: 0.2,
        fiber: 1.4,
        calPer100g: 32,
        pPer100g: 0.7,
        cPer100g: 7.7,
        fPer100g: 0.3,
        fiberPer100g: 2,
      },
    ],
  },
  {
    id: "calai-pancakes",
    title: "Pancakes con Arándanos Frescos & Miel de Maple",
    reportTitle: "Pancakes with Blueberries & Syrup",
    time: "9:30 AM",
    mealType: "Postre",
    category: "postre",
    img: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800&auto=format&fit=crop&q=80",
    servings: 1,
    healthScore: 7,
    narrative:
      "Desayuno o postre energético con arándanos enteros ricos en antocianinas antioxidantes y fibra, equilibrado con carbohidratos de asimilación activa y jarabe puro de arce.",
    bioScore: 78,
    bioGrade: "B+",
    bioQualityLabel: "Energía Matutina Equilibrada",
    bioGaugeIndex: 2,
    vectorBadges: [
      {
        id: "v-proc",
        category: "processing",
        badgeText: "Mínimamente procesado",
        description: "Cocción casera con fruta entera fresca.",
      },
      {
        id: "v-fib",
        category: "fiber",
        badgeText: "Buena fibra",
        description: "Polifenoles y fibra de arándanos enteros.",
      },
      {
        id: "v-prot",
        category: "protein",
        badgeText: "Proteína moderada",
        description: "Aporte proteico complementario de huevo y leche.",
      },
      {
        id: "v-sug",
        category: "sugar",
        badgeText: "Azúcar moderado",
        description: "Sirope de arce puro en porción moderada.",
      },
      {
        id: "v-fat",
        category: "fat",
        badgeText: "Bajo en grasas",
        description: "Carga lipídica ligera.",
      },
      {
        id: "v-grain",
        category: "grains",
        badgeText: "Granos simples",
        description: "Combustible glucídico matutino.",
      },
      {
        id: "v-sod",
        category: "sodium",
        badgeText: "Bajo en sodio",
        description: "Sin exceso de sal añadida.",
      },
    ],
    phytoColors: [
      {
        name: "Morado",
        bgClass: "bg-purple-500",
        phytochemical: "Antocianinas y Resveratrol (arándanos frescos)",
      },
      {
        name: "Dorado/Blanco",
        bgClass: "bg-amber-400",
        phytochemical: "Polifenoles y glucosa rápida (sirope puro)",
      },
    ],
    calloutPins: [
      { name: "Arándanos Frescos", calories: 8, topPct: 22, leftPct: 28 },
      { name: "Sirope de Maple", calories: 12, topPct: 62, leftPct: 18 },
      { name: "Pancakes Caseros", calories: 595, topPct: 40, rightPct: 22 },
    ],
    ingredients: [
      {
        id: "pancakes-base",
        name: "Pancakes Caseros (3 unidades)",
        category: "carbs",
        grams: 220,
        calories: 595,
        protein: 10,
        carbs: 85,
        fat: 20,
        fiber: 2.5,
        calPer100g: 270,
        pPer100g: 4.5,
        cPer100g: 38.6,
        fPer100g: 9.1,
        fiberPer100g: 1.1,
      },
      {
        id: "pancakes-syrup",
        name: "Sirope Puro de Maple",
        category: "carbs",
        grams: 15,
        calories: 12,
        protein: 0,
        carbs: 7,
        fat: 0,
        fiber: 0,
        calPer100g: 260,
        pPer100g: 0,
        cPer100g: 67,
        fPer100g: 0,
        fiberPer100g: 0,
      },
      {
        id: "pancakes-berries",
        name: "Arándanos Frescos",
        category: "fruits",
        grams: 25,
        calories: 8,
        protein: 1,
        carbs: 1,
        fat: 1,
        fiber: 0.8,
        calPer100g: 57,
        pPer100g: 0.7,
        cPer100g: 14.5,
        fPer100g: 0.3,
        fiberPer100g: 2.4,
      },
    ],
  },
  {
    id: "calai-burger",
    title: "Doble Cheeseburger con Papas Fritas",
    reportTitle: "Double Cheeseburger & Crispy Fries Combo",
    time: "9:15 PM",
    mealType: "Cena",
    category: "comida",
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80",
    servings: 1,
    healthScore: 4,
    narrative:
      "Combinación de alta densidad energética y baja densidad de micronutrientes. Presencia de grasas saturadas, aceites de fritura y sodio industrial con escaso aporte de fibra.",
    bioScore: 42,
    bioGrade: "C",
    bioQualityLabel: "Alimento Ultraprocesado",
    bioGaugeIndex: 0,
    vectorBadges: [
      {
        id: "v-proc",
        category: "processing",
        badgeText: "Ultraprocesado",
        description: "Matriz con aditivos, pan industrial y carnes reconstituidas.",
      },
      {
        id: "v-fib",
        category: "fiber",
        badgeText: "Bajo en fibra",
        description: "Carencia de fibra vegetal prebiótica, absorción glucémica acelerada.",
      },
      {
        id: "v-prot",
        category: "protein",
        badgeText: "Proteína grasa",
        description: "Aporte proteico acompañado de elevada fracción lipídica.",
      },
      {
        id: "v-sug",
        category: "sugar",
        badgeText: "Alto en azúcar",
        description: "Jarabes de alta fructosa en aderezos y panificado.",
      },
      {
        id: "v-fat",
        category: "fat",
        badgeText: "Alto en grasas",
        description: "Lípidos saturados y aceites reutilizados en fritura profunda.",
      },
      {
        id: "v-grain",
        category: "grains",
        badgeText: "Granos refinados",
        description: "Pan de hamburguesa desprovisto de salvado, rápida conversión en glucosa.",
      },
      {
        id: "v-sod",
        category: "sodium",
        badgeText: "Alto en sodio",
        description: "Supera el 50% del requerimiento diario sugerido por la OMS.",
      },
    ],
    phytoColors: [
      {
        name: "Rojo",
        bgClass: "bg-rose-500",
        phytochemical: "Licopeno procesado (salsa de tomate)",
      },
      {
        name: "Blanco/Dorado",
        bgClass: "bg-stone-300 dark:bg-stone-400",
        phytochemical: "Carbohidratos refinados (pan y patatas)",
      },
    ],
    calloutPins: [
      { name: "Medallones de Carne", calories: 480, topPct: 40, leftPct: 30 },
      { name: "Queso Cheddar Fundido", calories: 190, topPct: 32, rightPct: 25 },
      { name: "Papas Fritas", calories: 340, topPct: 65, rightPct: 20 },
    ],
    ingredients: [
      {
        id: "burger-patties",
        name: "Medallones de Carne Vacuna",
        category: "protein",
        grams: 200,
        calories: 480,
        protein: 34,
        carbs: 0,
        fat: 38,
        fiber: 0,
        calPer100g: 240,
        pPer100g: 17,
        cPer100g: 0,
        fPer100g: 19,
        fiberPer100g: 0,
      },
      {
        id: "burger-bun",
        name: "Pan de Hamburguesa Blanco",
        category: "carbs",
        grams: 90,
        calories: 250,
        protein: 7,
        carbs: 46,
        fat: 4,
        fiber: 1,
        calPer100g: 277,
        pPer100g: 7.7,
        cPer100g: 51,
        fPer100g: 4.4,
        fiberPer100g: 1.1,
      },
      {
        id: "burger-fries",
        name: "Papas Fritas en Aceite",
        category: "carbs",
        grams: 110,
        calories: 340,
        protein: 3.5,
        carbs: 42,
        fat: 17,
        fiber: 2.8,
        calPer100g: 310,
        pPer100g: 3.2,
        cPer100g: 38,
        fPer100g: 15.5,
        fiberPer100g: 2.5,
      },
    ],
  },
];

export const COMMON_FOODS_DATABASE = [
  {
    name: "Pancakes (Caseros)",
    calPer100g: 270,
    pPer100g: 4.5,
    cPer100g: 38.6,
    fPer100g: 9.1,
    fiberPer100g: 1.1,
    category: "carbs" as const,
  },
  {
    name: "Sirope de Maple",
    calPer100g: 260,
    pPer100g: 0,
    cPer100g: 67,
    fPer100g: 0,
    fiberPer100g: 0,
    category: "carbs" as const,
  },
  {
    name: "Arándanos Frescos",
    calPer100g: 57,
    pPer100g: 0.7,
    cPer100g: 14.5,
    fPer100g: 0.3,
    fiberPer100g: 2.4,
    category: "fruits" as const,
  },
  {
    name: "Huevo Entero (Hervido / Pochado)",
    calPer100g: 155,
    pPer100g: 13,
    cPer100g: 1.1,
    fPer100g: 11,
    fiberPer100g: 0,
    category: "protein" as const,
  },
  {
    name: "Pechuga de Pollo (Grill)",
    calPer100g: 165,
    pPer100g: 31,
    cPer100g: 0,
    fPer100g: 3.6,
    fiberPer100g: 0,
    category: "protein" as const,
  },
  {
    name: "Salmón Fresco (Grill)",
    calPer100g: 208,
    pPer100g: 20,
    cPer100g: 0,
    fPer100g: 12,
    fiberPer100g: 0,
    category: "protein" as const,
  },
  {
    name: "Batata Asada (Al Horno)",
    calPer100g: 86,
    pPer100g: 1.6,
    cPer100g: 20,
    fPer100g: 0.1,
    fiberPer100g: 3,
    category: "carbs" as const,
  },
  {
    name: "Arroz Blanco Cocido",
    calPer100g: 130,
    pPer100g: 2.7,
    cPer100g: 28,
    fPer100g: 0.3,
    fiberPer100g: 0.4,
    category: "carbs" as const,
  },
  {
    name: "Palta Hass Fresca",
    calPer100g: 160,
    pPer100g: 2,
    cPer100g: 8.5,
    fPer100g: 14.7,
    fiberPer100g: 6.7,
    category: "fats" as const,
  },
  {
    name: "Brócoli al Vapor",
    calPer100g: 34,
    pPer100g: 2.8,
    cPer100g: 6.6,
    fPer100g: 0.4,
    fiberPer100g: 2.6,
    category: "veggies" as const,
  },
  {
    name: "Yogur Griego Natural",
    calPer100g: 59,
    pPer100g: 10,
    cPer100g: 3.6,
    fPer100g: 0.4,
    fiberPer100g: 0,
    category: "dairy" as const,
  },
  {
    name: "Aceite de Oliva Extra Virgen",
    calPer100g: 884,
    pPer100g: 0,
    cPer100g: 0,
    fPer100g: 100,
    fiberPer100g: 0,
    category: "fats" as const,
  },
];

export const MEAL_TYPES = [
  "Desayuno",
  "Almuerzo",
  "Merienda",
  "Cena",
  "Pre-entreno",
  "Post-entreno",
  "Snack",
];

export const EATING_REASONS_CONFIG = [
  { id: "hunger", label: "Hambre física", icon: HeartPulse, desc: "Señal somática real de necesidad energética" },
  { id: "schedule", label: "Horario habitual", icon: Clock, desc: "Pauta biológica o rutina horaria del día" },
  { id: "social", label: "Social / Compartir", icon: Users, desc: "Comensalidad, amigos, familia o evento social" },
  { id: "craving", label: "Antojo / Placer", icon: Sparkles, desc: "Disfrute sensorial o deseo puntual consciente" },
  { id: "stress", label: "Estrés / Emocional", icon: Wind, desc: "Tensión, sobrecarga o búsqueda de calma" },
  { id: "convenience", label: "Prisa / Rutina", icon: Timer, desc: "Poco tiempo, practicidad o resolución rápida" },
];

export const POSTPRANDIAL_SYMPTOMS = [
  { id: "energia", label: "Con energía", icon: Zap },
  { id: "ligero", label: "Ligero / Óptimo", icon: Sparkles },
  { id: "somnolencia", label: "Somnolencia", icon: Moon },
  { id: "pesadez", label: "Pesadez / Hinchazón", icon: Activity },
  { id: "reflujo", label: "Reflujo / Acidez", icon: Flame },
];

// Helper: Contextual Meal Type and Timing Inference
function inferContextualMealType(timelineItems?: any[]): {
  mealType: string;
  contextTag: string;
  isPreWorkout: boolean;
  isPostWorkout: boolean;
  isNightWindow: boolean;
} {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const dateStr = now.toISOString().split("T")[0];

  let isPreWorkout = false;
  let isPostWorkout = false;

  // 1. Check recent activity in timeline (within past 150 min)
  if (timelineItems && Array.isArray(timelineItems)) {
    for (const item of timelineItems) {
      if (item && item.date === dateStr) {
        const isActivity =
          item.type === "activity" || item.type === "gym_session" || item.type === "class_session";
        if (isActivity && item.time) {
          const match = item.time.match(/(\d{1,2}):(\d{2})/);
          if (match) {
            const itemMin = parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
            const diff = currentMinutes - itemMin;
            if (diff >= 0 && diff <= 150) {
              isPostWorkout = true;
              break;
            }
          }
        }
      }
    }
  }

  // 2. Check scheduled upcoming class (within next 120 min)
  if (typeof window !== "undefined") {
    try {
      const res = JSON.parse(localStorage.getItem("shakerfy_user_reservations") || "[]");
      if (Array.isArray(res)) {
        for (const r of res) {
          if (r && r.time) {
            const match = r.time.match(/(\d{1,2}):(\d{2})/);
            if (match) {
              const resMin = parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
              const untilClass = resMin - currentMinutes;
              if (untilClass >= 0 && untilClass <= 120) {
                isPreWorkout = true;
                break;
              }
            }
          }
        }
      }
    } catch (_) {}
  }

  const isNightWindow = currentMinutes >= 21 * 60 + 30 || currentMinutes < 5 * 60;

  if (isPreWorkout) {
    return {
      mealType: "Pre-entreno",
      contextTag: "Ventana Pre-Entreno",
      isPreWorkout: true,
      isPostWorkout: false,
      isNightWindow,
    };
  }

  if (isPostWorkout) {
    return {
      mealType: "Post-entreno",
      contextTag: "Ventana Post-Entreno",
      isPreWorkout: false,
      isPostWorkout: true,
      isNightWindow,
    };
  }

  // Solar & Circadian Windows
  if (currentMinutes >= 5 * 60 && currentMinutes < 11 * 60 + 30) {
    return {
      mealType: "Desayuno",
      contextTag: "Activación Matutina",
      isPreWorkout: false,
      isPostWorkout: false,
      isNightWindow: false,
    };
  }
  if (currentMinutes >= 11 * 60 + 30 && currentMinutes < 15 * 60 + 30) {
    return {
      mealType: "Almuerzo",
      contextTag: "Cenit / Mediodía Solar",
      isPreWorkout: false,
      isPostWorkout: false,
      isNightWindow: false,
    };
  }
  if (currentMinutes >= 15 * 60 + 30 && currentMinutes < 19 * 60 + 30) {
    return {
      mealType: "Merienda",
      contextTag: "Recarga Vespertina",
      isPreWorkout: false,
      isPostWorkout: false,
      isNightWindow: false,
    };
  }
  if (currentMinutes >= 19 * 60 + 30 && currentMinutes < 23 * 60 + 30) {
    return {
      mealType: "Cena",
      contextTag: "Ventana Nocturna",
      isPreWorkout: false,
      isPostWorkout: false,
      isNightWindow: true,
    };
  }

  return {
    mealType: "Snack",
    contextTag: "Colación Nocturna",
    isPreWorkout: false,
    isPostWorkout: false,
    isNightWindow: true,
  };
}

// Helper: Contextual Natural Language AI Insight
function generateContextualAiInsight(params: {
  baseNarrative?: string;
  isPreWorkout: boolean;
  isPostWorkout: boolean;
  isNightWindow: boolean;
  bioScore: number;
}): string {
  const { baseNarrative, isPreWorkout, isPostWorkout, isNightWindow } = params;

  // Pre-workout with upcoming class (~90 min)
  if (isPreWorkout) {
    return `Detectamos una clase o sesión de entrenamiento próxima en tu agenda. Este plato aporta una base sólida; para optimizar tu reserva de glucógeno y disponibilidad energética, puedes sumar una porción de carbohidratos nobles de fácil asimilación (ej. papas al vapor, arroz o fruta fresca).`;
  }

  // Post-workout recovery
  if (isPostWorkout) {
    return `Ventana post-esfuerzo: la combinación de aminoácidos y micronutrientes de este plato apoya la recuperación muscular y reposición de glucógeno. Acompaña con hidratación de apoyo para favorecer el balance celular.`;
  }

  // Night window
  if (isNightWindow) {
    return `Ventana nocturna: una ingesta de digestión ligera preserva la secreción de melatonina y favorece el descanso reparador. Una infusión tibia al finalizar potenciará tu confort.`;
  }

  return (
    baseNarrative ||
    `Plato con balance de micronutrientes y fibra activa para una energía metabólica estable y confort digestivo sostenido.`
  );
}

// Helper: Calidad Nutricional para el Hero Widget (5 niveles evaluados desde los 7 Vectores y NOVA)
function getScanQualityProfile({
  score,
  mealTitle,
  mealNarrative,
  vectorBadges = [],
  totalProtein = 0,
  totalFiber = 0,
  totalFat = 0,
  totalCarbs = 0,
}: {
  score: number;
  mealTitle: string;
  mealNarrative?: string;
  vectorBadges?: NutritionVectorBadge[];
  totalProtein?: number;
  totalFiber?: number;
  totalFat?: number;
  totalCarbs?: number;
}): {
  label: "Pobre" | "Bajo" | "Regular" | "Bueno" | "Excelente";
  level: 1 | 2 | 3 | 4 | 5;
} {
  const text = `${mealTitle} ${mealNarrative || ""}`.toLowerCase();

  // Mapear los 7 vectores nutricionales
  const badgeMap = new Map<string, string>();
  vectorBadges.forEach((b) => badgeMap.set(b.category, (b.badgeText || "").toLowerCase()));

  const processing = badgeMap.get("processing") || "";
  const fiber = badgeMap.get("fiber") || "";
  const protein = badgeMap.get("protein") || "";
  const sugar = badgeMap.get("sugar") || "";
  const fat = badgeMap.get("fat") || "";
  const grains = badgeMap.get("grains") || "";

  const isUltraProcessed =
    processing.includes("ultra") ||
    /caramelo|golosina|sour patch|snack|gaseosa|refresco|chucher|donuts/i.test(text);

  const isProcessedOrFried =
    processing.includes("moderadamente") ||
    processing.includes("procesad") ||
    /papas fritas|facturas|cheeseburger|dulce|croissant|fritura/i.test(text);

  const hasAddedSugar =
    sugar.includes("añadid") ||
    sugar.includes("azúcar") ||
    sugar.includes("elevad") ||
    /azúcar|dulce|miel|jarabe|sirope/i.test(text);

  const hasHealthyFats =
    fat.includes("saludable") ||
    fat.includes("omega") ||
    fat.includes("palta") ||
    fat.includes("chía") ||
    fat.includes("oliva") ||
    /salmón|salmon|palta|aguacate|nuez|almendra|chía|oliva/i.test(text);

  const hasHighQualityProtein =
    protein.includes("alta calidad") ||
    protein.includes("magra") ||
    totalProtein >= 22 ||
    /pechuga|pollo|pescado|huevo|tofu|lenteja|garbanzo/i.test(text);

  const hasHighFiber =
    fiber.includes("buena fuente") ||
    fiber.includes("alto en fibra") ||
    totalFiber >= 3.5 ||
    grains.includes("entero") ||
    /quinoa|avena|integral|brócoli|espinaca|legumbre/i.test(text);

  // 1. POBRE (Nivel 1): Azúcar simple / Ultraprocesado / Mínima fibra y proteína
  if (
    (isUltraProcessed && hasAddedSugar) ||
    (hasAddedSugar && totalProtein < 8 && totalFiber < 2) ||
    score < 40
  ) {
    return { label: "Pobre", level: 1 };
  }

  // 2. BAJO (Nivel 2): Alta densidad calórica (harinas/grasas refinadas) con fibra y proteína bajas
  if (
    isProcessedOrFried ||
    (totalCarbs > 40 && totalProtein < 12 && totalFiber < 3) ||
    (totalFat > 20 && !hasHealthyFats && totalFiber < 2) ||
    score < 58
  ) {
    return { label: "Bajo", level: 2 };
  }

  // 5. EXCELENTE (Nivel 5): Alimento entero/sin procesar + Proteína completa + Grasas nobles + Fibra + Sin azúcar añadido
  const isMinimallyProcessed =
    processing.includes("mínimamente") ||
    processing.includes("sin procesar") ||
    !isUltraProcessed;

  if (
    isMinimallyProcessed &&
    hasHighQualityProtein &&
    hasHealthyFats &&
    hasHighFiber &&
    !hasAddedSugar &&
    score >= 82
  ) {
    return { label: "Excelente", level: 5 };
  }

  // 4. BUENO (Nivel 4): Mínimamente procesado, alta en fibra/vegetales y buena proteína
  if (
    isMinimallyProcessed &&
    (hasHighFiber || hasHighQualityProtein) &&
    !hasAddedSugar &&
    score >= 70
  ) {
    return { label: "Bueno", level: 4 };
  }

  // 3. REGULAR (Nivel 3): Comida estándar equilibrada de día a día
  return { label: "Regular", level: 3 };
}

function ScanMealPage() {
  const navigate = useNavigate();
  const { isAthleteMode, isWellnessMode } = useNutritionSettings();

  // Screen State: "scanner" (Live Camera Viewfinder) | "nutrition" (Unified Bio Report & Choice Chips) | "fix" (AI Correction)
  const [currentScreen, setCurrentScreen] = useState<"scanner" | "nutrition" | "fix">("scanner");

  // Food Scanner Precision Tutorial Dialog State (auto-opens if first time)
  const [showTutorial, setShowTutorial] = useState(() => {
    if (typeof window !== "undefined") {
      const seen = localStorage.getItem(STORAGE_KEY_TUTORIAL_SEEN);
      return seen !== "true";
    }
    return false;
  });

  // Video Ref & Stream State (Native MediaStream)
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCameraLoading, setIsCameraLoading] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraFacing, setCameraFacing] = useState<"environment" | "user">("environment");
  const [selectedCameraId, setSelectedCameraId] = useState<string>("");
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [activeCameraLabel, setActiveCameraLabel] = useState<string>("");

  const saveToDiaryRef = useRef<(overrides?: {
    customImg?: string;
    customTitle?: string;
    customReportTitle?: string;
    customIngredients?: MealIngredientItem[];
    customNarrative?: string;
  }) => void>(() => {});

  // Selected sample & custom capture
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);
  const initialSample = CAL_AI_SAMPLE_MEALS[selectedSampleIndex];
  const [customImage, setCustomImage] = useState<string | null>(null);
  const activeImage = customImage || initialSample.img;

  // Scanner UI & Category States
  const [selectedCategory, setSelectedCategory] = useState<FoodScanCategory>("comida");
  const [scanMode, setScanMode] = useState<"scan_food" | "voice_log" | "database" | "barcode" | "food_label">("scan_food");

  // Food Database States & Handlers (Matching Cal AI Food Database)
  const [databaseSearchQuery, setDatabaseSearchQuery] = useState("");
  const [activeDbTab, setActiveDbTab] = useState<"All" | "My meals" | "My foods" | "Saved scans">("All");
  const [customDbFoods, setCustomDbFoods] = useState<FoodDatabaseItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("shakerfy_user_custom_foods");
        if (raw) return JSON.parse(raw);
      } catch {}
    }
    return [];
  });
  const [showLogEmptyFoodModal, setShowLogEmptyFoodModal] = useState(false);
  const [emptyFoodName, setEmptyFoodName] = useState("");
  const [emptyFoodCalories, setEmptyFoodCalories] = useState("120");
  const [emptyFoodProtein, setEmptyFoodProtein] = useState("10");
  const [emptyFoodCarbs, setEmptyFoodCarbs] = useState("12");
  const [emptyFoodFat, setEmptyFoodFat] = useState("3");
  const [emptyFoodServing, setEmptyFoodServing] = useState("1 porción");

  // Reactive listener to update saved scans in real time when bookmarked in timeline
  const [timelineVersion, setTimelineVersion] = useState(0);
  useEffect(() => {
    const handler = () => setTimelineVersion((v) => v + 1);
    if (typeof window !== "undefined") {
      window.addEventListener("shakerfy:timeline-update", handler);
      window.addEventListener("storage", handler);
      return () => {
        window.removeEventListener("shakerfy:timeline-update", handler);
        window.removeEventListener("storage", handler);
      };
    }
  }, []);

  const filteredDbFoods = useMemo(() => {
    let baseList: FoodDatabaseItem[] = [];
    if (activeDbTab === "My foods") {
      baseList = customDbFoods;
    } else if (activeDbTab === "Saved scans") {
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("shakerfy_user_timeline_items");
          if (raw) {
            const items = JSON.parse(raw);
            const savedItems = items.filter(
              (it: any) => it.type === "meal" && (it.isSaved === true || it.saved === true),
            );
            baseList = savedItems.map((it: any) => ({
              id: it.id,
              name: it.title,
              calories: it.calories || it.kcal || 350,
              servingLabel: "Escaneo guardado ★",
              protein: it.protein || 20,
              carbs: it.carbs || 30,
              fat: it.fat || 10,
              fiber: it.fiber || 2,
              category: "protein" as const,
            }));
          }
        } catch {}
      }
    } else if (activeDbTab === "My meals") {
      baseList = customDbFoods.length > 0 ? customDbFoods : INITIAL_FOOD_DATABASE_ITEMS.slice(0, 4);
    } else {
      // "All"
      baseList = [...customDbFoods, ...INITIAL_FOOD_DATABASE_ITEMS];
    }

    if (!databaseSearchQuery.trim()) return baseList;
    const q = databaseSearchQuery.toLowerCase().trim();
    return baseList.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        (f.brand && f.brand.toLowerCase().includes(q)) ||
        f.category.toLowerCase().includes(q),
    );
  }, [activeDbTab, customDbFoods, databaseSearchQuery, timelineVersion]);

  const handleQuickAddFoodToDiary = (food: {
    name: string;
    calories: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    servingLabel?: string;
  }) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;
    const timeStr = now.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });

    let stored: any[] = [];
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("shakerfy_user_timeline_items");
        if (raw) stored = JSON.parse(raw);
        if (!Array.isArray(stored)) stored = [];
      } catch {
        stored = [];
      }
    }

    const context = inferContextualMealType(stored);
    const resolvedMealType = context.mealType || "Colación";

    const newMealItem = {
      id: `meal-${Date.now()}`,
      createdAt: now.toISOString(),
      type: "meal",
      mealType: resolvedMealType,
      time: timeStr,
      date: dateStr,
      title: food.name,
      subtitle: `${resolvedMealType} • Food Database`,
      img: null,
      calories: food.calories,
      kcal: food.calories,
      protein: food.protein || 0,
      carbs: food.carbs || 0,
      fat: food.fat || 0,
      fiber: food.fiber || 0,
      sugar: 0,
      sodium: 120,
      healthScore: 8,
      bioScore: 80,
      bioGrade: "A",
      scoreGrade: "A",
      bioQualityLabel: "Alimento Base",
      bioGaugeIndex: 3,
      ingredients: [
        {
          id: `ing-${Date.now()}`,
          name: food.name,
          category: (food.protein && food.protein > 12 ? "protein" : "carbs") as any,
          grams: 100,
          calories: food.calories,
          protein: food.protein || 0,
          carbs: food.carbs || 0,
          fat: food.fat || 0,
          fiber: food.fiber || 0,
          calPer100g: food.calories,
          pPer100g: food.protein || 0,
          cPer100g: food.carbs || 0,
          fPer100g: food.fat || 0,
          fiberPer100g: food.fiber || 0,
        },
      ],
      desc: `${food.name} • ${food.calories} kcal (${food.servingLabel || "1 porción"})`,
      summary: `${food.name} registrado desde Food Database.`,
      coachFeedback: `✓ Alimento registrado con éxito: ${food.name} (${food.calories} kcal).`,
      tag: "Food Database",
      consumed: true,
    };

    if (typeof window !== "undefined") {
      const updated = [newMealItem, ...stored];
      localStorage.setItem("shakerfy_user_timeline_items", JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("shakerfy:timeline-update"));
    }

    if ("vibrate" in navigator) {
      navigator.vibrate(15);
    }

    toast.success(`✓ ${food.name} agregado al diario`, {
      description: `${food.calories} kcal • ${food.servingLabel || "1 porción"}`,
      action: {
        label: "Ver Diario",
        onClick: () => navigate({ to: "/app", search: { tab: "diario" } }),
      },
    });
  };

  const handleSaveEmptyFood = () => {
    const name = emptyFoodName.trim() || "Alimento Personalizado";
    const cal = Math.max(0, parseInt(emptyFoodCalories, 10) || 100);
    const p = Math.max(0, parseFloat(emptyFoodProtein) || 0);
    const c = Math.max(0, parseFloat(emptyFoodCarbs) || 0);
    const f = Math.max(0, parseFloat(emptyFoodFat) || 0);
    const serving = emptyFoodServing.trim() || "1 porción";

    const newFood: FoodDatabaseItem = {
      id: `custom-${Date.now()}`,
      name,
      calories: cal,
      protein: p,
      carbs: c,
      fat: f,
      servingLabel: serving,
      category: p > 15 ? "protein" : c > 15 ? "carbs" : "fats",
    };

    setCustomDbFoods((prev) => {
      const next = [newFood, ...prev];
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("shakerfy_user_custom_foods", JSON.stringify(next));
        } catch {}
      }
      return next;
    });

    handleQuickAddFoodToDiary(newFood);
    setShowLogEmptyFoodModal(false);
    setEmptyFoodName("");
  };

  // Food Label Note States & Handlers (Minimalist interactive list)
  const [foodNoteItems, setFoodNoteItems] = useState<string[]>(INITIAL_FOOD_NOTE_ITEMS);

  const activeFoodItems = useMemo(() => {
    return foodNoteItems.map((it) => it.trim()).filter((it) => it.length > 0);
  }, [foodNoteItems]);

  const totalNotesItemsCount = activeFoodItems.length;

  const handleNoteItemChange = (itemIndex: number, value: string) => {
    setFoodNoteItems((prev) => {
      const next = [...prev];
      next[itemIndex] = value;
      return next;
    });
  };

  const handleNoteItemKeyDown = (
    itemIndex: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setFoodNoteItems((prev) => {
        const next = [...prev];
        next.splice(itemIndex + 1, 0, "");
        return next;
      });
      setTimeout(() => {
        const nextInput = document.querySelector(
          `input[data-note-idx="${itemIndex + 1}"]`,
        ) as HTMLInputElement | null;
        nextInput?.focus();
      }, 50);
    } else if (e.key === "Backspace") {
      if (foodNoteItems[itemIndex] === "" && foodNoteItems.length > 1) {
        e.preventDefault();
        setFoodNoteItems((prev) => prev.filter((_, idx) => idx !== itemIndex));
        setTimeout(() => {
          const prevIdx = Math.max(0, itemIndex - 1);
          const prevInput = document.querySelector(
            `input[data-note-idx="${prevIdx}"]`,
          ) as HTMLInputElement | null;
          prevInput?.focus();
        }, 50);
      }
    }
  };

  const handleAddNoteItem = () => {
    setFoodNoteItems((prev) => [...prev, ""]);
    setTimeout(() => {
      const nextIdx = foodNoteItems.length;
      const input = document.querySelector(
        `input[data-note-idx="${nextIdx}"]`,
      ) as HTMLInputElement | null;
      input?.focus();
    }, 50);
  };

  const handleRemoveNoteItem = (itemIndex: number) => {
    if (foodNoteItems.length <= 1) {
      setFoodNoteItems([""]);
      return;
    }
    setFoodNoteItems((prev) => prev.filter((_, idx) => idx !== itemIndex));
  };

  const handleResetNotes = () => {
    setFoodNoteItems(INITIAL_FOOD_NOTE_ITEMS);
    toast.info("Notas restauradas con el ejemplo estándar");
  };

  const handleClearNotes = () => {
    setFoodNoteItems([""]);
    toast.info("Notas vaciadas");
  };

  // AI Analysis of Food Notes
  const handleAnalyzeFoodNotes = () => {
    const itemsToAnalyze: string[] = foodNoteItems
      .map((it) => it.trim())
      .filter((it) => it.length > 0);

    if (itemsToAnalyze.length === 0) {
      toast.error("Escribe al menos un alimento antes de analizar", {
        description: "Ej: '4 huevos', '2 tostadas', '1 manzana'",
      });
      return;
    }

    toast.success("Analizando alimentos escritos con IA...", {
      description: `${itemsToAnalyze.length} alimentos detectados en tus notas`,
    });

    // Parse each item into structured ingredient
    const parsedIngredients: MealIngredientItem[] = itemsToAnalyze.map((text, idx) => {
      const lower = text.toLowerCase();
      let name = text;
      let category: MealIngredientItem["category"] = "carbs";
      let grams = 100;
      let cal = 120;
      let prot = 4;
      let carbs = 20;
      let fat = 2;
      let fiber = 2;

      if (lower.includes("huevo")) {
        const qtyMatch = lower.match(/(\d+)/);
        const qty = qtyMatch ? parseInt(qtyMatch[1], 10) : 2;
        name = `Huevos Enteros (${qty}u)`;
        category = "protein";
        grams = qty * 50;
        prot = qty * 6;
        fat = qty * 5;
        carbs = Math.round(qty * 0.4);
        fiber = 0;
        cal = qty * 70;
      } else if (lower.includes("tostada") || lower.includes("pan")) {
        const qtyMatch = lower.match(/(\d+)/);
        const qty = qtyMatch ? parseInt(qtyMatch[1], 10) : 2;
        name = `Tostadas Integrales (${qty}u)`;
        category = "carbs";
        grams = qty * 30;
        prot = qty * 3;
        carbs = qty * 15;
        fat = qty * 1;
        fiber = qty * 2;
        cal = qty * 80;
      } else if (lower.includes("naranja") || lower.includes("jugo")) {
        name = "Jugo de Naranja Natural (250ml)";
        category = "fruits";
        grams = 250;
        prot = 1.7;
        carbs = 26;
        fat = 0.5;
        fiber = 0.5;
        cal = 112;
      } else if (lower.includes("almendra") || lower.includes("nuez") || lower.includes("fruto seco")) {
        const gramsMatch = lower.match(/(\d+)\s*g/);
        const g = gramsMatch ? parseInt(gramsMatch[1], 10) : 20;
        name = `Almendras Tostadas (${g}g)`;
        category = "fats";
        grams = g;
        prot = Math.round(g * 0.21 * 10) / 10;
        fat = Math.round(g * 0.5 * 10) / 10;
        carbs = Math.round(g * 0.22 * 10) / 10;
        fiber = Math.round(g * 0.12 * 10) / 10;
        cal = Math.round(g * 5.8);
      } else if (lower.includes("manzana") || lower.includes("fruta")) {
        name = "Manzana Roja Fresca (1u)";
        category = "fruits";
        grams = 180;
        prot = 0.5;
        carbs = 25;
        fat = 0.3;
        fiber = 4.4;
        cal = 95;
      } else if (lower.includes("pollo") || lower.includes("carne") || lower.includes("bife")) {
        name = "Pechuga de Pollo a la Plancha";
        category = "protein";
        grams = 150;
        prot = 36;
        carbs = 0;
        fat = 4;
        fiber = 0;
        cal = 185;
      } else if (lower.includes("arroz") || lower.includes("pasta") || lower.includes("fideos")) {
        name = "Arroz Blanco Cocido";
        category = "carbs";
        grams = 150;
        prot = 4;
        carbs = 42;
        fat = 0.5;
        fiber = 0.6;
        cal = 195;
      } else if (lower.includes("palta") || lower.includes("aguacate")) {
        name = "Palta Hass Fresca";
        category = "fats";
        grams = 70;
        prot = 1.4;
        carbs = 6;
        fat = 10.5;
        fiber = 4.7;
        cal = 112;
      } else if (lower.includes("yogur") || lower.includes("leche")) {
        name = "Yogur Griego Natural";
        category = "dairy";
        grams = 150;
        prot = 15;
        carbs = 5.5;
        fat = 1;
        fiber = 0;
        cal = 90;
      } else if (lower.includes("cafe") || lower.includes("café")) {
        name = "Café Expreso Sin Azúcar";
        category = "carbs";
        grams = 100;
        prot = 0.2;
        carbs = 0.5;
        fat = 0.1;
        fiber = 0;
        cal = 5;
      }

      return {
        id: `note-item-${idx}-${Date.now()}`,
        name,
        category,
        grams,
        calories: cal,
        protein: prot,
        carbs,
        fat,
        fiber,
        calPer100g: Math.round((cal / grams) * 100),
        pPer100g: Math.round((prot / grams) * 100 * 10) / 10,
        cPer100g: Math.round((carbs / grams) * 100 * 10) / 10,
        fPer100g: Math.round((fat / grams) * 100 * 10) / 10,
        fiberPer100g: Math.round((fiber / grams) * 100 * 10) / 10,
      };
    });

    const primaryTitle =
      parsedIngredients.length > 0
        ? `Registro: ${parsedIngredients.slice(0, 2).map((p) => p.name.split(" ")[0]).join(" & ")}`
        : "Notas de Alimentos";

    setTitle(primaryTitle);
    setReportTitle("Registro Nutricional Markdown IA");
    setMealTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    setMealType("Comida");
    setIngredients(parsedIngredients);
    setServings(1);
    setNarrative(
      `Análisis completo de tus notas de comida: ${itemsToAnalyze.length} alimentos registrados. Distribución balanceada de macronutrientes, micronutrientes y aporte de fibra natural sin ultraprocesados.`,
    );
    setBioScore(88);
    setBioGrade("A-");
    setBioQualityLabel("Comida Real & Densidad Nutritiva Óptima");
    setBioGaugeIndex(3);
    setHighlightNutrient("Vitamina C y Fibra Natural");
    setHighlightAmount("45mg");

    setVectorBadges([
      {
        id: "v-proc",
        category: "processing",
        badgeText: "Mínimamente procesado",
        description: "Alimentos enteros sin aditivos artificiales.",
      },
      {
        id: "v-fib",
        category: "fiber",
        badgeText: "Alta fibra",
        description: "Fibra soluble e insoluble de frutas y granos enteros.",
      },
      {
        id: "v-prot",
        category: "protein",
        badgeText: "Proteína magra",
        description: "Aporte proteico biológicamente completo.",
      },
      {
        id: "v-sug",
        category: "sugar",
        badgeText: "Sin azúcar añadido",
        description: "Carbohidratos de fuentes naturales intactas.",
      },
      {
        id: "v-fat",
        category: "fat",
        badgeText: "Grasas saludables",
        description: "Ácidos grasos esenciales monoinsaturados y omega.",
      },
      {
        id: "v-grain",
        category: "grains",
        badgeText: "Granos enteros",
        description: "Energía glucídica de liberación sostenida.",
      },
      {
        id: "v-sod",
        category: "sodium",
        badgeText: "Bajo en sodio",
        description: "Perfil cardiovascular óptimo.",
      },
    ]);

    setCalloutPins([
      { name: parsedIngredients[0]?.name || "Desayuno", calories: parsedIngredients[0]?.calories || 150, topPct: 35, leftPct: 25 },
      { name: parsedIngredients[1]?.name || "Complemento", calories: parsedIngredients[1]?.calories || 80, topPct: 45, rightPct: 25 },
    ]);

    setCustomImage("https://images.unsplash.com/photo-1494859802809-d069c3b71a8a?w=800&auto=format&fit=crop&q=80");

    setIsScanningLaser(true);
    setTimeout(() => {
      setIsScanningLaser(false);
      saveToDiaryRef.current({
        customIngredients: parsedIngredients,
        customImg: "https://images.unsplash.com/photo-1494859802809-d069c3b71a8a?w=800&auto=format&fit=crop&q=80",
        customTitle: "Plato Casero Registrado",
        customReportTitle: "Registro por Notas",
      });
    }, 450);
  };
  const libraryInputRef = useRef<HTMLInputElement>(null);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [isScanningLaser, setIsScanningLaser] = useState(false);

  // Voice Log States & Handlers
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordedVoiceText, setRecordedVoiceText] = useState("");
  const recognitionRef = useRef<any>(null);

  const processVoiceLog = (text: string) => {
    toast.success("Nota de voz procesada con IA", {
      description: text,
    });
    const cleanTitle = text.length > 32 ? text.slice(0, 32) + "..." : text;
    setTitle(cleanTitle);
    setReportTitle("Registro por Voz IA");
    setNarrative(`Alimentos detectados por voz: "${text}". Composición analizada con éxito.`);
    setIsScanningLaser(true);
    setTimeout(() => {
      setIsScanningLaser(false);
      saveToDiaryRef.current({
        customTitle: cleanTitle,
        customReportTitle: "Registro por Voz IA",
        customNarrative: `Alimentos detectados por voz: "${text}". Composición analizada con éxito.`,
      });
    }, 450);
  };

  const handleToggleVoiceRecording = () => {
    if (isRecordingVoice) {
      setIsRecordingVoice(false);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
      processVoiceLog(recordedVoiceText || "2 huevos revueltos con tostada integral y café negro");
    } else {
      setIsRecordingVoice(true);
      setRecordedVoiceText("");

      if (typeof window !== "undefined") {
        const SpeechRecognition =
          (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (SpeechRecognition) {
          try {
            const recognition = new SpeechRecognition();
            recognition.lang = "es-AR";
            recognition.continuous = false;
            recognition.interimResults = true;

            recognition.onresult = (event: any) => {
              const transcript = Array.from(event.results)
                .map((result: any) => result[0].transcript)
                .join(" ");
              setRecordedVoiceText(transcript);
            };

            recognition.onend = () => {
              setIsRecordingVoice(false);
            };

            recognition.onerror = () => {
              setIsRecordingVoice(false);
            };

            recognition.start();
            recognitionRef.current = recognition;
            toast.info("Escuchando...", { description: "Di en voz alta los alimentos que consumiste" });
            return;
          } catch (err) {
            console.warn("SpeechRecognition error:", err);
          }
        }
      }

      toast.info("Escuchando...", { description: "Di lo que comiste para que la IA lo procese" });
      setTimeout(() => {
        setRecordedVoiceText("Tostadas integrales con palta, huevos poché y café");
      }, 1500);
    }
  };
  const [showOptions, setShowOptions] = useState(false);
  const [showBioScoreExplanation, setShowBioScoreExplanation] = useState(false);

  // Nutrition Report & breakdown data
  const [title, setTitle] = useState(initialSample.title);
  const [reportTitle, setReportTitle] = useState(initialSample.reportTitle);
  const [mealTime, setMealTime] = useState(initialSample.time || "12:46 PM");
  const [narrative, setNarrative] = useState(initialSample.narrative);
  const [bioScore, setBioScore] = useState(initialSample.bioScore);
  const [bioGrade, setBioGrade] = useState(initialSample.bioGrade);
  const [bioQualityLabel, setBioQualityLabel] = useState(initialSample.bioQualityLabel);
  const [highlightNutrient, setHighlightNutrient] = useState<string>(
    initialSample.highlightNutrient || "Source of Vitamin C",
  );
  const [highlightAmount, setHighlightAmount] = useState<string>(
    initialSample.highlightAmount || "25mg",
  );
  const [servingLabel, setServingLabel] = useState<string>(
    initialSample.servingLabel || "100g per day",
  );
  const [bioGaugeIndex, setBioGaugeIndex] = useState(initialSample.bioGaugeIndex);
  const [vectorBadges, setVectorBadges] = useState<NutritionVectorBadge[]>(
    initialSample.vectorBadges,
  );

  // ICN Theme Helper with dynamic biological color accents
  const getIcnTheme = (score: number) => {
    if (score >= 85) {
      return {
        scoreText: "text-emerald-500 dark:text-emerald-400",
        gradeBadge:
          "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
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
  const [mealType, setMealType] = useState(initialSample.mealType || "Almuerzo");
  const [servings, setServings] = useState(initialSample.servings);
  const [healthScore, setHealthScore] = useState(initialSample.healthScore);
  const [calloutPins, setCalloutPins] = useState<MealCalloutPin[]>(initialSample.calloutPins);
  const [ingredients, setIngredients] = useState<MealIngredientItem[]>(initialSample.ingredients);

  // Fix screen states
  const [aiPromptText, setAiPromptText] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isAddFoodOpen, setIsAddFoodOpen] = useState(false);
  const [foodSearchQuery, setFoodSearchQuery] = useState("");
  const [selectedAddFood, setSelectedAddFood] = useState(COMMON_FOODS_DATABASE[0]);
  const [addGrams, setAddGrams] = useState(100);

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

  // Synchronize stream lifecycle with scanner screen (stop camera if in food_label markdown mode or database)
  useEffect(() => {
    if (currentScreen === "scanner" && !customImage && scanMode !== "food_label" && scanMode !== "database") {
      startCamera();
    } else {
      stopStream();
    }

    return () => {
      stopStream();
    };
  }, [currentScreen, customImage, scanMode, startCamera, stopStream]);

  // Re-attach srcObject whenever element mounts
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

  // Synchronize when choosing a sample dish
  const handleSelectSample = (idx: number) => {
    setSelectedSampleIndex(idx);
    const s = CAL_AI_SAMPLE_MEALS[idx];
    if (s.category) {
      setSelectedCategory(s.category);
    }
    setCustomImage(null);
    setTitle(s.title);
    setReportTitle(s.reportTitle);
    setMealTime(s.time || "12:46 PM");
    setNarrative(s.narrative);
    setBioScore(s.bioScore);
    setBioGrade(s.bioGrade);
    setBioQualityLabel(s.bioQualityLabel);
    setHighlightNutrient(s.highlightNutrient || s.bioQualityLabel || "Source of Vitamin C");
    setHighlightAmount(s.highlightAmount || "25mg");
    setServingLabel(s.servingLabel || (s.servings === 1 ? "100g per day" : `${s.servings} porciones`));
    setBioGaugeIndex(s.bioGaugeIndex);
    setVectorBadges(s.vectorBadges);
    setMealType(s.mealType);
    setServings(s.servings);
    setHealthScore(s.healthScore);
    setCalloutPins(s.calloutPins);
    setIngredients(s.ingredients);
    setShowOptions(false);
    toast.success(`Plato seleccionado: ${s.title}`);
  };

  // Functional Category Selector: Bebida, Comida, Snack, Postre
  const handleSelectCategory = (catId: FoodScanCategory) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(12);
      } catch (_) {}
    }
    setSelectedCategory(catId);
    const catConfig = SCAN_FOOD_CATEGORIES.find((c) => c.id === catId);
    if (catConfig) {
      setMealType(catConfig.defaultMealType);
      toast.info(`Modo ${catConfig.label} seleccionado`);

      // If user is previewing sample dishes without custom captured photo, auto-switch to first matching sample
      if (!customImage) {
        const matchingSampleIdx = CAL_AI_SAMPLE_MEALS.findIndex(
          (s) => s.category === catId || (catId === "comida" && !s.category),
        );
        if (matchingSampleIdx !== -1) {
          handleSelectSample(matchingSampleIdx);
        }
      }
    }
  };

  // Handle Photo File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const uploadedImg = reader.result as string;
        setCustomImage(uploadedImg);
        toast.success("Foto cargada con éxito");
        setIsScanningLaser(true);
        setTimeout(() => {
          setIsScanningLaser(false);
          saveToDiaryRef.current({ customImg: uploadedImg });
        }, 450);
      };
      reader.readAsDataURL(file);
    }
  };

  // Shutter Capture Action: Snap instant frame via HTML5 Canvas
  const triggerCaptureScan = () => {
    setIsScanningLaser(true);

    let screenshot: string | null = null;
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
          screenshot = canvas.toDataURL("image/jpeg", 0.92);
          setCustomImage(screenshot);
        }
      }
    }

    setTimeout(() => {
      setIsScanningLaser(false);
      saveToDiaryRef.current({ customImg: screenshot || undefined });
    }, 450);
  };

  // Base Nutrient Calculations
  const baseCalories = useMemo(
    () => ingredients.reduce((acc, i) => acc + i.calories, 0),
    [ingredients],
  );
  const baseProtein = useMemo(
    () => ingredients.reduce((acc, i) => acc + i.protein, 0),
    [ingredients],
  );
  const baseCarbs = useMemo(() => ingredients.reduce((acc, i) => acc + i.carbs, 0), [ingredients]);
  const baseFat = useMemo(() => ingredients.reduce((acc, i) => acc + i.fat, 0), [ingredients]);
  const baseFiber = useMemo(() => ingredients.reduce((acc, i) => acc + i.fiber, 0), [ingredients]);

  const totalCalories = Math.round(baseCalories * servings);
  const totalProtein = Math.round(baseProtein * servings);
  const totalCarbs = Math.round(baseCarbs * servings);
  const totalFat = Math.round(baseFat * servings);
  const totalFiber = Math.round(baseFiber * servings * 10) / 10;

  // Update ingredient grams
  const handleUpdateGrams = (id: string, delta: number) => {
    setIngredients((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const newGrams = Math.max(10, item.grams + delta);
        const factor = newGrams / 100;
        return {
          ...item,
          grams: newGrams,
          calories: Math.round(item.calPer100g * factor),
          protein: Math.round(item.pPer100g * factor * 10) / 10,
          carbs: Math.round(item.cPer100g * factor * 10) / 10,
          fat: Math.round(item.fPer100g * factor * 10) / 10,
          fiber: Math.round(item.fiberPer100g * factor * 10) / 10,
        };
      }),
    );
  };

  // Delete ingredient
  const handleDeleteIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((i) => i.id !== id));
  };

  // Add ingredient from database
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

      if (lower.includes("sin") || lower.includes("no syrup") || lower.includes("sin jarabe")) {
        setIngredients((prev) => prev.filter((i) => !i.name.toLowerCase().includes("syrup")));
      } else if (lower.includes("doble") || lower.includes("double")) {
        setServings((s) => s * 2);
      } else if (lower.includes("mitad") || lower.includes("half")) {
        setServings((s) => Math.max(0.5, s / 2));
      } else if (lower.includes("extra") || lower.includes("mas") || lower.includes("arandanos")) {
        setIngredients((prev) =>
          prev.map((i) =>
            i.name.toLowerCase().includes("blueberr")
              ? { ...i, grams: i.grams + 30, calories: i.calories + 18 }
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
    }, 600);
  };

  // Save to User Diary Timeline and Navigate to /app
  const handleSaveToDiary = useCallback(
    (overrides?: {
      customImg?: string;
      customTitle?: string;
      customReportTitle?: string;
      customIngredients?: MealIngredientItem[];
      customNarrative?: string;
    }) => {
      stopStream();
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;
      const timeStr = now.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });

      let stored: any[] = [];
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("shakerfy_user_timeline_items");
          if (raw) stored = JSON.parse(raw);
          if (!Array.isArray(stored)) stored = [];
        } catch {
          stored = [];
        }
      }

      const context = inferContextualMealType(stored);
      const resolvedMealType = context.mealType || mealType || "Almuerzo";

      const effectiveIngredients = overrides?.customIngredients || ingredients;
      const effectiveCalories =
        effectiveIngredients.reduce((acc, i) => acc + (i.calories || 0), 0) || totalCalories;
      const effectiveProtein =
        effectiveIngredients.reduce((acc, i) => acc + (i.protein || 0), 0) || totalProtein;
      const effectiveCarbs =
        effectiveIngredients.reduce((acc, i) => acc + (i.carbs || 0), 0) || totalCarbs;
      const effectiveFat =
        effectiveIngredients.reduce((acc, i) => acc + (i.fat || 0), 0) || totalFat;
      const effectiveFiber =
        Math.round(
          (effectiveIngredients.reduce((acc, i) => acc + (i.fiber || 0), 0) || totalFiber) * 10,
        ) / 10;
      const effectiveTitle =
        overrides?.customReportTitle || overrides?.customTitle || reportTitle || title;
      const effectiveImg = overrides?.customImg || activeImage;
      const effectiveNarrative = overrides?.customNarrative || narrative;

      const dynamicInsight = generateContextualAiInsight({
        baseNarrative: effectiveNarrative,
        isPreWorkout: context.isPreWorkout,
        isPostWorkout: context.isPostWorkout,
        isNightWindow: context.isNightWindow,
        bioScore: bioScore,
      });

      let resolvedTimingFit = null;
      try {
        resolvedTimingFit = calculateTimingFit(
          {
            time: timeStr,
            date: dateStr,
            bioScore,
            vectorBadges,
            title: effectiveTitle,
          },
          stored,
        );
      } catch (e) {
        console.warn("Timing fit calculation skipped:", e);
      }

      const newMealItem = {
        id: `meal-${Date.now()}`,
        createdAt: now.toISOString(),
        type: "meal",
        mealType: resolvedMealType,
        time: timeStr,
        date: dateStr,
        title: effectiveTitle,
        subtitle: `${resolvedMealType} • Reporte Nutricional`,
        img: effectiveImg,
        calories: effectiveCalories,
        kcal: effectiveCalories,
        protein: effectiveProtein,
        carbs: effectiveCarbs,
        fat: effectiveFat,
        fiber: effectiveFiber,
        sugar: 12.0,
        sodium: 420,
        healthScore: healthScore,
        bioScore: bioScore,
        bioGrade: bioGrade || "A",
        scoreGrade: bioGrade || "A",
        bioQualityLabel: bioQualityLabel,
        bioGaugeIndex: bioGaugeIndex,
        ingredients: effectiveIngredients,
        narrative:
          effectiveNarrative ||
          effectiveIngredients
            .map((i) => `${i.name} (${Math.round(i.grams * servings)}g)`)
            .join(", "),
        desc:
          effectiveNarrative ||
          effectiveIngredients
            .map((i) => `${i.name} (${Math.round(i.grams * servings)}g)`)
            .join(", "),
        summary:
          effectiveNarrative ||
          `${effectiveTitle} con ${effectiveCalories} kcal, ${effectiveProtein}g de proteína.`,
        coachFeedback: dynamicInsight,
        tag: bioQualityLabel || "Valor Nutricional",
        vectorBadges: vectorBadges,
        consumed: true,
        timingFit: resolvedTimingFit,
      };

      if (typeof window !== "undefined") {
        try {
          const updated = [newMealItem, ...stored];
          try {
            localStorage.setItem("shakerfy_user_timeline_items", JSON.stringify(updated));
          } catch (storageErr) {
            console.warn(
              "Storage quota reached, saving meal with lightweight image reference:",
              storageErr,
            );
            const lightweightItem = {
              ...newMealItem,
              img: effectiveImg?.startsWith("data:") ? null : effectiveImg,
            };
            const safeStored = stored.map((item: any) => ({
              ...item,
              img: item.img?.startsWith("data:") ? null : item.img,
            }));
            localStorage.setItem(
              "shakerfy_user_timeline_items",
              JSON.stringify([lightweightItem, ...safeStored]),
            );
          }
          window.dispatchEvent(new CustomEvent("shakerfy:timeline-update"));
        } catch (err) {
          console.error("Error saving timeline meal item:", err);
        }
      }

      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        try {
          navigator.vibrate([25, 40, 25]);
        } catch (_) {}
      }

      toast.success("✓ Comida registrada en el diario", {
        description: `${effectiveTitle} se añadió a tu timeline`,
      });

      try {
        navigate({ to: "/app", search: { tab: "diario" } });
      } catch {
        window.location.href = "/app?tab=diario";
      }

      // Ensure fallback redirection if client router is delayed
      setTimeout(() => {
        if (typeof window !== "undefined" && window.location.pathname.startsWith("/scan")) {
          window.location.href = "/app?tab=diario";
        }
      }, 120);
    },
    [
      stopStream,
      mealType,
      ingredients,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      totalFiber,
      reportTitle,
      title,
      activeImage,
      narrative,
      bioScore,
      vectorBadges,
      healthScore,
      bioGrade,
      bioQualityLabel,
      bioGaugeIndex,
      servings,
      navigate,
    ],
  );

  useEffect(() => {
    saveToDiaryRef.current = handleSaveToDiary;
  }, [handleSaveToDiary]);

  const filteredFoods = COMMON_FOODS_DATABASE.filter((f) =>
    f.name.toLowerCase().includes(foodSearchQuery.toLowerCase()),
  );

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 w-screen h-[100dvh] overflow-hidden flex flex-col justify-between select-none transition-colors duration-300",
        scanMode === "food_label" || scanMode === "database"
          ? "bg-slate-50/70 dark:bg-background text-foreground"
          : "bg-slate-950 text-foreground",
      )}
    >
      {/* ========================================================================= */}
      {/* SCREEN 1: SCANNER FULL SCREEN (React-Webcam Live Camera Viewfinder)       */}
      {/* ========================================================================= */}
      {currentScreen === "scanner" && (
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
          ) : null}

          {/* Top Bar: Back to App, Scanner Title, Options */}
          <div className="relative z-20 pt-6 sm:pt-8 px-6 max-w-lg mx-auto w-full flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (scanMode === "food_label" || scanMode === "database") {
                  setScanMode("scan_food");
                } else if (scanMode === "barcode") {
                  setScanMode("database");
                } else {
                  navigate({ to: "/app", search: { tab: "diario" } });
                }
              }}
              className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-xl border border-border/60 text-foreground flex items-center justify-center hover:bg-background active:scale-95 transition cursor-pointer shadow-xs"
              aria-label={scanMode === "food_label" || scanMode === "database" ? "Volver a la Cámara" : scanMode === "barcode" ? "Volver a Database" : "Volver a la App"}
              title={scanMode === "food_label" || scanMode === "database" ? "Volver a la Cámara" : scanMode === "barcode" ? "Volver a Database" : "Volver a la App"}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="px-4 py-1.5 rounded-full bg-background/80 backdrop-blur-xl border border-border/60 shadow-xs flex items-center gap-2">
              <span className="text-foreground font-bold text-xs tracking-wide">
                {scanMode === "database"
                  ? "Food Database"
                  : scanMode === "barcode"
                    ? "Barcode Scanner"
                    : scanMode === "food_label"
                      ? "Notas de Comida"
                      : "Escanear Comida"}
              </span>
              {isCameraActive && !customImage && scanMode !== "food_label" && scanMode !== "database" && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </div>

            <div className="flex items-center gap-2">
              {scanMode === "food_label" ? (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleResetNotes}
                    className="text-[11px] font-semibold text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-full bg-background/80 backdrop-blur-xl border border-border/60 hover:bg-secondary transition cursor-pointer shadow-xs"
                    title="Cargar ejemplo estándar"
                  >
                    Ejemplo
                  </button>
                  <button
                    type="button"
                    onClick={handleClearNotes}
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
                    onClick={handleToggleCameraFacing}
                    className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-xl border border-border/60 text-foreground flex items-center justify-center hover:bg-background active:scale-95 transition cursor-pointer shadow-xs"
                    title="Cambiar Cámara"
                    aria-label="Cambiar Cámara"
                  >
                    <RefreshCw className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowTutorial(true)}
                    className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-xl border border-border/60 text-foreground flex items-center justify-center hover:bg-background active:scale-95 transition cursor-pointer shadow-xs"
                    aria-label="Guía de Escaneo"
                    title="Consejos de precisión"
                  >
                    <HelpCircle className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowOptions(!showOptions)}
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
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/30"
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
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 uppercase font-mono shrink-0">
                      {sample.category ? sample.category.toUpperCase() : "COMIDA"}
                    </Badge>
                    <span className="truncate">{sample.title}</span>
                  </div>
                  <span className="text-[10px] opacity-80 ml-1 shrink-0 font-medium text-muted-foreground">
                    {sample.bioGaugeIndex >= 4 ? "Óptimo" : sample.bioGaugeIndex >= 3 ? "Alto" : "Equilibrado"}
                  </span>
                </button>
              ))}

              <div className="pt-2 border-t border-border/50 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowOptions(false);
                    setShowTutorial(true);
                  }}
                  className="w-full text-left text-xs font-bold px-2.5 py-1.5 rounded-xl hover:bg-secondary flex items-center gap-1.5 cursor-pointer text-foreground"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Guía de Precisión (Tutorial)</span>
                </button>
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

          {/* RENDER CONDICIONAL: Si scanMode === 'database' se muestra la vista Food Database (Imagen 2) */}
          {scanMode === "database" ? (
            /* ========================================================================= */
            /* FOOD DATABASE SCREEN (Image 2: Manual Search + Barcode Button)            */
            /* ========================================================================= */
            <div className="relative z-10 flex-1 w-full max-w-xl mx-auto flex flex-col justify-between overflow-hidden px-4 sm:px-6 pt-3 pb-6 select-text">
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3.5 pb-6 pt-1">
                {/* 1. SEARCH BAR WITH INTEGRATED BARCODE ICON */}
                <div className="relative flex items-center w-full">
                  <div className="flex-1 flex items-center gap-2.5 px-4 h-12 rounded-2xl bg-secondary/50 border border-border/60 focus-within:border-foreground/40 focus-within:bg-secondary/80 transition-all shadow-xs">
                    <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                    <input
                      type="text"
                      value={databaseSearchQuery}
                      onChange={(e) => setDatabaseSearchQuery(e.target.value)}
                      placeholder="Describe what you ate"
                      className="bg-transparent border-0 outline-none text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/70 w-full font-medium"
                    />
                    {databaseSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setDatabaseSearchQuery("")}
                        className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                        aria-label="Borrar búsqueda"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {/* Botón Barcode integrado a la derecha del input */}
                    <button
                      type="button"
                      onClick={() => {
                        setScanMode("barcode");
                        toast.info("Escáner de código de barras activo", {
                          description: "Apunta al código de barras del producto",
                        });
                      }}
                      className="p-1.5 rounded-xl bg-background hover:bg-secondary text-foreground border border-border/60 hover:scale-105 active:scale-95 transition cursor-pointer shrink-0 shadow-2xs"
                      title="Escanear Código de Barras"
                      aria-label="Escanear Código de Barras"
                    >
                      <Barcode className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 2. FILTER CHIPS (All, My meals, My foods, Saved scans) */}
                <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar py-1 text-xs">
                  {(["All", "My meals", "My foods", "Saved scans"] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveDbTab(tab)}
                      className={cn(
                        "px-3.5 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap",
                        activeDbTab === tab
                          ? "bg-foreground text-background font-bold shadow-2xs"
                          : "bg-secondary/40 text-muted-foreground hover:text-foreground border border-border/40 font-medium",
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* 3. LOG EMPTY FOOD ACTION BUTTON */}
                <button
                  type="button"
                  onClick={() => setShowLogEmptyFoodModal(true)}
                  className="w-full py-2.5 px-4 rounded-full border border-border/80 bg-card hover:bg-secondary/50 text-foreground text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition cursor-pointer active:scale-98 shadow-2xs"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Log empty food</span>
                </button>

                {/* 4. SUGGESTIONS LIST (Image 2) */}
                <div className="space-y-2.5 pt-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {databaseSearchQuery
                        ? "Resultados de Búsqueda"
                        : activeDbTab === "Saved scans"
                          ? "Escaneos Guardados"
                          : activeDbTab === "My foods"
                            ? "Mis Alimentos"
                            : "Suggestions"}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {filteredDbFoods.length} {filteredDbFoods.length === 1 ? "alimento" : "alimentos"}
                    </span>
                  </div>

                  <div className="space-y-2 pb-6">
                    {filteredDbFoods.length === 0 ? (
                      <div className="p-8 text-center rounded-3xl border border-dashed border-border/60 bg-secondary/15 space-y-2.5">
                        {activeDbTab === "Saved scans" ? (
                          <Bookmark className="w-6 h-6 text-foreground/80 fill-foreground/20 mx-auto" />
                        ) : (
                          <Utensils className="w-6 h-6 text-muted-foreground/60 mx-auto" />
                        )}
                        <p className="text-xs font-semibold text-foreground">
                          {activeDbTab === "Saved scans"
                            ? "No tienes escaneos guardados aún"
                            : `No se encontraron alimentos en "${activeDbTab}".`}
                        </p>
                        <p className="text-[11px] text-muted-foreground max-w-xs mx-auto leading-relaxed">
                          {activeDbTab === "Saved scans"
                            ? "Toca el ícono de marcador en cualquier tarjeta de comida de tu diario para guardarla aquí."
                            : "Puedes dar de alta este alimento rápidamente."}
                        </p>
                        {activeDbTab === "Saved scans" ? (
                          <button
                            type="button"
                            onClick={() => navigate({ to: "/app", search: { tab: "diario" } })}
                            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 underline underline-offset-4 cursor-pointer pt-1"
                          >
                            Ir a Mi Diario
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setShowLogEmptyFoodModal(true)}
                            className="text-xs font-bold text-foreground underline underline-offset-4 cursor-pointer pt-1"
                          >
                            Crear este alimento manualmente
                          </button>
                        )}
                      </div>
                    ) : (
                      filteredDbFoods.map((food) => (
                        <div
                          key={food.id}
                          className="p-3 sm:p-3.5 rounded-2xl bg-card border border-border/60 flex items-center justify-between gap-3 hover:border-foreground/30 hover:shadow-xs transition group text-left"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                              <Flame className="w-4 h-4 text-orange-500 fill-orange-500/20" />
                            </div>
                            <div className="min-w-0 text-left">
                              <span className="text-xs sm:text-sm font-bold text-foreground block truncate">
                                {food.name}
                                {food.brand && (
                                  <span className="text-muted-foreground font-normal ml-1">
                                    • {food.brand}
                                  </span>
                                )}
                              </span>
                              <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                <span className="font-bold text-foreground">{food.calories} cal</span>
                                <span>•</span>
                                <span>{food.servingLabel}</span>
                                {food.protein ? (
                                  <>
                                    <span>•</span>
                                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{food.protein}g P</span>
                                  </>
                                ) : null}
                              </div>
                            </div>
                          </div>

                          {/* Quick Add + Button */}
                          <button
                            type="button"
                            onClick={() => handleQuickAddFoodToDiary(food)}
                            className="w-8 h-8 rounded-full bg-secondary/80 hover:bg-foreground hover:text-background border border-border/80 text-foreground flex items-center justify-center active:scale-90 transition cursor-pointer shrink-0 shadow-2xs"
                            title={`Agregar ${food.name} al diario`}
                            aria-label={`Agregar ${food.name} al diario`}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : scanMode === "food_label" ? (
            <div className="relative z-10 flex-1 w-full max-w-xl mx-auto flex flex-col justify-between overflow-hidden px-4 sm:px-6 pt-3 pb-24 select-text">
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pb-28 pt-1">
                {/* Header Card de Bienestar & Resumen Minimalista */}
                <div className="border border-border bg-card shadow-xs rounded-3xl p-5 space-y-3 text-left">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 block leading-none">
                          Registro Libre
                        </span>
                        <h2 className="text-base font-bold text-foreground tracking-tight mt-0.5">
                          Notas de Alimentos
                        </h2>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="rounded-full text-[10px] font-mono border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    >
                      {totalNotesItemsCount} {totalNotesItemsCount === 1 ? "alimento" : "alimentos"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Escribe lo que comiste y la IA analizará sus nutrientes al instante.
                  </p>
                </div>

                {/* Lista Interactiva con viñetas y edición directa */}
                <div className="border border-border bg-card shadow-xs rounded-3xl p-5 space-y-3 text-left transition-all duration-300 hover:border-foreground/30 hover:shadow-md">
                  <div className="space-y-2">
                    {foodNoteItems.map((itemText, idx) => {
                      const isFilled = itemText.trim().length > 0;

                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl bg-secondary/35 hover:bg-secondary/60 border border-border/50 focus-within:border-foreground/30 focus-within:bg-secondary/70 transition-all duration-200 group"
                        >
                          <span
                            className={cn(
                              "w-2 h-2 rounded-full shrink-0 transition-colors",
                              isFilled
                                ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]"
                                : "bg-muted-foreground/30",
                            )}
                          />

                          <input
                            type="text"
                            data-note-idx={idx}
                            value={itemText}
                            onChange={(e) => handleNoteItemChange(idx, e.target.value)}
                            onKeyDown={(e) => handleNoteItemKeyDown(idx, e)}
                            placeholder={
                              idx === 0 ? "Ej: 4 huevos revueltos con aceite de oliva..." : "Añadir otro alimento..."
                            }
                            className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-xs sm:text-sm font-medium text-foreground placeholder:text-muted-foreground/45 leading-tight"
                          />

                          {foodNoteItems.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveNoteItem(idx)}
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
                    onClick={handleAddNoteItem}
                    className="w-full py-2 px-3 rounded-2xl border border-dashed border-border/70 hover:border-foreground/30 text-muted-foreground hover:text-foreground text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-secondary/40 transition-all cursor-pointer active:scale-98"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Añadir alimento</span>
                  </button>
                </div>
              </div>

              {/* Botón Flotante Ergonómico de Acción Principal (Regla 10: Thumb-Zone Priority, fixed bottom-6 z-40) */}
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-md w-[calc(100%-2rem)]">
                <button
                  type="button"
                  onClick={handleAnalyzeFoodNotes}
                  className="w-full h-14 rounded-full bg-foreground text-background shadow-2xl hover:bg-foreground/90 active:scale-95 transition-all duration-200 flex items-center justify-between px-6 cursor-pointer border border-border/40 font-bold group"
                  aria-label="Analizar alimentos con IA"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-background/15 flex items-center justify-center text-background">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold leading-tight">Analizar con IA</p>
                      <p className="text-[10px] opacity-75 font-normal leading-tight">
                        {totalNotesItemsCount > 0
                          ? `${totalNotesItemsCount} ${totalNotesItemsCount === 1 ? "alimento listo" : "alimentos listos"}`
                          : "Anota al menos 1 alimento"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    <span>Continuar</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Camera Reticle Adaptativo según scanMode */}
              {scanMode === "voice_log" ? (
                <div className="relative z-10 mx-auto my-auto flex flex-col items-center justify-center gap-4 text-center p-4">
                  <div
                    className={cn(
                      "w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500",
                      isRecordingVoice
                        ? "bg-rose-500/20 border-2 border-rose-500 shadow-[0_0_35px_rgba(244,63,94,0.45)] scale-110"
                        : "bg-black/40 backdrop-blur-md border border-white/20 shadow-lg",
                    )}
                  >
                    {isRecordingVoice ? (
                      <AudioLines className="w-12 h-12 text-rose-500 animate-pulse" />
                    ) : (
                      <Mic className="w-12 h-12 text-white/90" />
                    )}
                  </div>
                  <div className="bg-black/65 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15 max-w-xs space-y-0.5 shadow-md">
                    <p className="text-xs font-bold text-white">
                      {isRecordingVoice ? "Escuchando tus alimentos..." : "Di en voz alta lo que comiste"}
                    </p>
                    <p className="text-[11px] text-white/70 leading-tight">
                      {isRecordingVoice
                        ? "Toca el botón rojo para procesar"
                        : "ej: '2 huevos revueltos con tostada y café'"}
                    </p>
                  </div>
                </div>
              ) : scanMode === "barcode" ? (
                <div className="relative z-10 mx-auto my-auto flex flex-col items-center gap-3">
                  <div className="px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white text-xs font-medium">
                    Apunta la cámara al código de barras del producto
                  </div>
                  <div className="relative w-72 h-44 sm:w-80 sm:h-48 pointer-events-none flex flex-col justify-between p-2">
                    <div className="flex justify-between">
                      <div className="w-8 h-8 border-t-3 border-l-3 border-red-500 rounded-tl-xl drop-shadow-lg" />
                      <div className="w-8 h-8 border-t-3 border-r-3 border-red-500 rounded-tr-xl drop-shadow-lg" />
                    </div>
                    <div className="w-full h-[2px] bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.9)] animate-pulse" />
                    <div className="flex justify-between">
                      <div className="w-8 h-8 border-b-3 border-l-3 border-red-500 rounded-bl-xl drop-shadow-lg" />
                      <div className="w-8 h-8 border-b-3 border-r-3 border-red-500 rounded-br-xl drop-shadow-lg" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        handleQuickAddFoodToDiary({
                          name: "Yogur Griego con Arándanos",
                          calories: 120,
                          protein: 12,
                          carbs: 14,
                          fat: 2,
                          fiber: 1,
                          servingLabel: "1 pote (EAN-13 779123456789)",
                        });
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-white text-black text-xs font-bold hover:bg-white/90 active:scale-95 transition cursor-pointer shadow-lg flex items-center gap-1.5"
                    >
                      <Barcode className="w-3.5 h-3.5" />
                      <span>Simular Escaneo</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setScanMode("database")}
                      className="px-3 py-1.5 rounded-full bg-black/70 hover:bg-black/90 text-white/90 text-xs font-semibold border border-white/20 active:scale-95 transition cursor-pointer"
                    >
                      Volver a Database
                    </button>
                  </div>
                </div>
              ) : (
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
              )}

              {/* Bottom Dock Navigation & Capture Area */}
              <div className="relative z-20 pb-8 sm:pb-12 px-4 sm:px-6 max-w-md mx-auto w-full space-y-4 select-none">
                {/* Fila Superior: Exactamente 4 Tarjetas de Modo (Scan Food, Voice Log, Database, Food Label) */}
                <div className="grid grid-cols-4 gap-2 w-full">
                  {/* 1. Scan Food */}
                  <button
                    type="button"
                    onClick={() => {
                      setScanMode("scan_food");
                      handleSelectCategory("comida");
                    }}
                    className={cn(
                      "flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-2xl h-[64px] sm:h-[68px] gap-1 transition-all duration-200 cursor-pointer text-center",
                      scanMode === "scan_food"
                        ? "bg-white text-black shadow-lg scale-102"
                        : "bg-neutral-900/80 backdrop-blur-md text-white/80 border border-white/10 hover:bg-neutral-800/90 active:scale-95",
                    )}
                  >
                    <div className="relative flex items-center justify-center w-5 h-5">
                      <Scan className="w-5 h-5" />
                      <Apple className={cn("w-2.5 h-2.5 absolute", scanMode === "scan_food" ? "text-black fill-black" : "text-white fill-white")} />
                    </div>
                    <span className={cn("text-[11px] tracking-tight truncate w-full", scanMode === "scan_food" ? "font-bold text-black" : "font-medium text-white/90")}>
                      Scan Food
                    </span>
                  </button>

                  {/* 2. Voice Log */}
                  <button
                    type="button"
                    onClick={() => {
                      setScanMode("voice_log");
                      toast.info("Modo Registro por Voz activo");
                    }}
                    className={cn(
                      "flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-2xl h-[64px] sm:h-[68px] gap-1 transition-all duration-200 cursor-pointer text-center",
                      scanMode === "voice_log"
                        ? "bg-white text-black shadow-lg scale-102"
                        : "bg-neutral-900/80 backdrop-blur-md text-white/80 border border-white/10 hover:bg-neutral-800/90 active:scale-95",
                    )}
                  >
                    <Mic className="w-5 h-5 shrink-0" />
                    <span className={cn("text-[11px] tracking-tight truncate w-full", scanMode === "voice_log" ? "font-bold text-black" : "font-medium text-white/90")}>
                      Voice Log
                    </span>
                  </button>

                  {/* 3. Database (Manual Search & Food DB) */}
                  <button
                    type="button"
                    onClick={() => {
                      setScanMode("database");
                      toast.info("Base de Datos de Alimentos activa");
                    }}
                    className="flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-2xl h-[64px] sm:h-[68px] gap-1 transition-all duration-200 cursor-pointer text-center bg-neutral-900/80 backdrop-blur-md text-white/80 border border-white/10 hover:bg-neutral-800/90 active:scale-95"
                  >
                    <Search className="w-5 h-5 shrink-0" />
                    <span className="text-[11px] tracking-tight truncate w-full font-medium text-white/90">
                      Database
                    </span>
                  </button>

                  {/* 4. Food Label */}
                  <button
                    type="button"
                    onClick={() => {
                      setScanMode("food_label");
                      toast.info("Modo Cuaderno de Notas activo");
                    }}
                    className="flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-2xl h-[64px] sm:h-[68px] gap-1 transition-all duration-200 cursor-pointer text-center bg-neutral-900/80 backdrop-blur-md text-white/80 border border-white/10 hover:bg-neutral-800/90 active:scale-95"
                  >
                    <FileText className="w-5 h-5 shrink-0" />
                    <span className="text-[11px] tracking-tight truncate w-full font-medium text-white/90">
                      Food Label
                    </span>
                  </button>
                </div>

                {/* Input oculto para subir desde galería */}
                <input
                  ref={libraryInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* Fila Inferior: Controles de Captura (Flash, Shutter Dinámico / Micrófono, Galería) */}
                <div className="flex items-center justify-between px-6 sm:px-10 pt-1 w-full">
                  {/* Botón Flash (Izquierda) */}
                  <button
                    type="button"
                    onClick={handleToggleFlashlight}
                    className={cn(
                      "w-12 h-12 rounded-full backdrop-blur-xl flex items-center justify-center transition cursor-pointer border shadow-md active:scale-90",
                      flashlightOn
                        ? "bg-amber-400 text-black border-amber-400 shadow-amber-400/40"
                        : "bg-neutral-900/85 border-white/15 text-white/90 hover:bg-neutral-800",
                    )}
                    aria-label="Linterna"
                    title={flashlightOn ? "Desactivar linterna" : "Activar linterna"}
                  >
                    {flashlightOn ? (
                      <Zap className="w-5 h-5 fill-current text-black" />
                    ) : (
                      <ZapOff className="w-5 h-5 text-white/80" />
                    )}
                  </button>

                  {/* Botón Central Dinámico: Shutter Blanco (en Foto/Barcode) o Micrófono (en Voice Log) */}
                  {scanMode === "voice_log" ? (
                    <button
                      type="button"
                      onClick={handleToggleVoiceRecording}
                      className={cn(
                        "w-18 h-18 sm:w-20 sm:h-20 rounded-full border-[3.5px] flex items-center justify-center transition-all cursor-pointer shadow-2xl relative shrink-0",
                        isRecordingVoice
                          ? "border-rose-500 bg-rose-600 animate-pulse scale-105 shadow-rose-500/50"
                          : "border-white bg-neutral-900/90 hover:scale-105 active:scale-90",
                      )}
                      aria-label={isRecordingVoice ? "Detener grabación" : "Iniciar grabación de voz"}
                      title={isRecordingVoice ? "Toca para finalizar" : "Toca para hablar"}
                    >
                      {isRecordingVoice && (
                        <span className="absolute inset-0 rounded-full border-2 border-rose-400 animate-ping opacity-75 pointer-events-none" />
                      )}
                      <Mic
                        className={cn(
                          "w-8 h-8 transition-colors",
                          isRecordingVoice ? "text-white fill-white" : "text-white",
                        )}
                      />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={triggerCaptureScan}
                      disabled={isScanningLaser}
                      className="w-18 h-18 sm:w-20 sm:h-20 rounded-full border-[3.5px] border-white flex items-center justify-center p-1.5 hover:scale-105 active:scale-90 transition-all shadow-2xl cursor-pointer shrink-0"
                      aria-label="Capturar y Analizar"
                    >
                      <div className="w-full h-full rounded-full bg-white active:bg-neutral-200 transition-colors shadow-inner" />
                    </button>
                  )}

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
      )}

      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* SCREEN 2: BIO-REPORTE NUTRICIONAL DE LA IA (PANTALLA ÚNICA)              */}
      {/* ========================================================================= */}
      {currentScreen === "nutrition" &&
        (() => {
          const icnTheme = getIcnTheme(bioScore);
          const storedTimeline =
            typeof window !== "undefined"
              ? JSON.parse(localStorage.getItem("shakerfy_user_timeline_items") || "[]")
              : [];
          const currentContext = inferContextualMealType(storedTimeline);
          const dynamicInsight = generateContextualAiInsight({
            baseNarrative: narrative,
            isPreWorkout: currentContext.isPreWorkout,
            isPostWorkout: currentContext.isPostWorkout,
            isNightWindow: currentContext.isNightWindow,
            bioScore: bioScore,
          });

          return (
            <div className="w-full h-full sm:min-h-screen bg-slate-950/95 dark:bg-black/95 flex items-center justify-center p-0 sm:p-4 overflow-y-auto custom-scrollbar animate-in fade-in duration-300 select-none">
              {/* Device Frame Wrapper (Full-screen on Mobile, Sleek Mobile Card on Desktop) */}
              <div className="w-full max-w-md h-full sm:h-auto sm:max-h-[92vh] sm:min-h-[760px] sm:rounded-[40px] overflow-hidden bg-white dark:bg-[#12151b] shadow-2xl border-0 sm:border sm:border-white/10 flex flex-col justify-between text-foreground relative my-auto">
                {/* Sample Dish Selector (if toggled from top options button) */}
                {showOptions && (
                  <div className="absolute top-16 right-4 z-50 bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-3 shadow-2xl space-y-2 animate-in fade-in zoom-in-95 text-left max-w-xs w-[calc(100%-2rem)]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1 block">
                      Seleccionar Muestra:
                    </span>
                    {CAL_AI_SAMPLE_MEALS.map((sample, idx) => (
                      <button
                        key={sample.id}
                        type="button"
                        onClick={() => handleSelectSample(idx)}
                        className={cn(
                          "w-full text-left text-xs font-semibold px-3 py-2 rounded-xl transition cursor-pointer flex items-center justify-between",
                          selectedSampleIndex === idx && !customImage
                            ? "bg-foreground text-background font-bold"
                            : "hover:bg-secondary text-foreground",
                        )}
                      >
                        <span className="truncate">{sample.title}</span>
                        <span className="text-[10px] opacity-80 ml-1 shrink-0 font-medium text-muted-foreground">
                          {sample.bioGaugeIndex >= 4 ? "Óptimo" : sample.bioGaugeIndex >= 3 ? "Alto" : "Equilibrado"}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* 1. TOP HERO IMAGE SECTION (Clean, Bright & Natural) */}
                <div className="relative h-64 sm:h-76 w-full overflow-hidden bg-muted shrink-0">
                  <img
                    src={activeImage}
                    alt="Foto del plato"
                    className="w-full h-full object-cover"
                  />

                  {/* Top Navigation Row */}
                  <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-4 w-full">
                    {/* Frosted Back Button */}
                    <button
                      type="button"
                      onClick={() => setCurrentScreen("scanner")}
                      className="w-9 h-9 rounded-full bg-background/80 backdrop-blur-xl border border-border/60 text-foreground flex items-center justify-center hover:bg-background active:scale-95 transition cursor-pointer shadow-xs"
                      aria-label="Volver"
                    >
                      <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                    </button>

                    {/* Title in center */}
                    <span className="text-xs font-bold text-foreground px-3.5 py-1.5 rounded-full bg-background/80 backdrop-blur-xl border border-border/60 shadow-xs tracking-wide">
                      Reporte de Nutrición
                    </span>

                    {/* Frosted More Button */}
                    <button
                      type="button"
                      onClick={() => setShowOptions(!showOptions)}
                      className="w-9 h-9 rounded-full bg-background/80 backdrop-blur-xl border border-border/60 text-foreground flex items-center justify-center hover:bg-background active:scale-95 transition cursor-pointer shadow-xs"
                      aria-label="Opciones"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* 2. BOTTOM WHITE SHEET CARD */}
                <div className="-mt-6 relative z-30 rounded-t-[32px] sm:rounded-t-[36px] bg-white dark:bg-[#12151b] shadow-2xl flex-1 w-full px-5 pt-5 pb-4 flex flex-col justify-between text-left overflow-y-auto custom-scrollbar">
                  <div className="space-y-4">
                    {/* Title & Calories Row */}
                    <div className="pt-0.5 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Bookmark className="w-3.5 h-3.5 text-muted-foreground/80" />
                        <span className="text-[11px] font-mono text-muted-foreground font-medium">
                          {mealTime || "12:46 PM"}
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between gap-3">
                        <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-foreground tracking-tight line-clamp-2">
                          {reportTitle || title}
                        </h1>
                        {isAthleteMode && (
                          <span className="text-sm font-medium text-slate-500 dark:text-muted-foreground font-sans shrink-0">
                            {totalCalories}kcal
                          </span>
                        )}
                      </div>
                    </div>

                    {narrative && (
                      <p className="text-xs text-slate-500/90 dark:text-muted-foreground leading-relaxed font-normal">
                        {narrative}
                      </p>
                    )}

                    {/* HERO WIDGET: ANILLO SELECTOR RADIAL + BADGES (Visible en Modo Wellness, oculto en Modo Atleta) */}
                    {!isAthleteMode &&
                      (() => {
                        const quality = getScanQualityProfile({
                          score: bioScore,
                          mealTitle: reportTitle || title,
                          mealNarrative: narrative,
                          vectorBadges,
                          totalProtein,
                          totalFiber,
                          totalFat,
                          totalCarbs,
                        });
                        const bioContext = detectBiologicalContext();
                        const contextBadge =
                          bioContext.type === "pre_workout" || bioContext.type === "post_workout"
                            ? { label: bioContext.title, type: bioContext.type }
                            : undefined;

                        const heroBadges =
                          vectorBadges && vectorBadges.length > 0
                            ? vectorBadges.slice(0, 4).map((vb) => ({
                                id: vb.id || vb.category,
                                category: vb.category,
                                label: vb.badgeText,
                              }))
                            : [
                                { id: "b-1", category: "processing", label: "Mínimamente procesado" },
                                {
                                  id: "b-2",
                                  category: "protein",
                                  label: totalProtein >= 25 ? "Alta en proteína" : "Proteína moderada",
                                },
                                {
                                  id: "b-3",
                                  category: "fiber",
                                  label: totalFiber >= 4 ? "Buena fuente de fibra" : "Aporte de fibra",
                                },
                                { id: "b-4", category: "sugar", label: "Sin azúcar añadido" },
                              ];

                        return (
                          <FoodProfileHero
                            qualityLabel={quality.label}
                            qualityLevel={quality.level}
                            badges={heroBadges}
                            contextBadge={contextBadge}
                          />
                        );
                      })()}

                    {/* 3. THREE VERTICAL MACRO PROGRESS BAR CARDS (Protein, Carbs, Fat) */}
                    {(() => {
                      const maxMacroGrams = Math.max(totalProtein, totalCarbs, totalFat, 10);
                      const proteinFillHeight = Math.min(
                        Math.max((totalProtein / maxMacroGrams) * 70 + 16, 18),
                        86,
                      );
                      const carbsFillHeight = Math.min(
                        Math.max((totalCarbs / maxMacroGrams) * 70 + 16, 18),
                        86,
                      );
                      const fatFillHeight = Math.min(
                        Math.max((totalFat / maxMacroGrams) * 70 + 16, 18),
                        86,
                      );

                      const macros = [
                        {
                          label: "Proteína",
                          grams: totalProtein,
                          fillHeight: proteinFillHeight,
                          fillBg: "bg-emerald-500/15 dark:bg-emerald-950/40",
                          textAccent: "text-emerald-700 dark:text-emerald-400",
                        },
                        {
                          label: "Carbohidratos",
                          grams: totalCarbs,
                          fillHeight: carbsFillHeight,
                          fillBg: "bg-amber-500/15 dark:bg-amber-950/40",
                          textAccent: "text-amber-600 dark:text-amber-400",
                        },
                        {
                          label: "Grasas",
                          grams: totalFat,
                          fillHeight: fatFillHeight,
                          fillBg: "bg-sky-500/15 dark:bg-sky-950/40",
                          textAccent: "text-sky-600 dark:text-sky-400",
                        },
                      ];

                      return (
                        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 w-full select-none pt-0.5 pb-1">
                          {macros.map((macro) => (
                            <div
                              key={macro.label}
                              className="h-36 sm:h-40 rounded-2xl bg-[#f0f4f9] dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/60 p-3 flex flex-col justify-between relative overflow-hidden text-center shadow-2xs"
                            >
                              {/* Top Macro Label */}
                              <span className="text-xs font-normal text-slate-400 dark:text-slate-500 z-10 pt-0.5">
                                {macro.label}
                              </span>

                              {/* Vertical Rising Fill Bar */}
                              <div
                                style={{ height: `${macro.fillHeight}%` }}
                                className={cn(
                                  "absolute bottom-0 left-0 right-0 rounded-b-2xl rounded-t-xl transition-all duration-700 ease-out pointer-events-none",
                                  macro.fillBg,
                                )}
                              />

                              {/* Bottom Grams Text */}
                              <span
                                className={cn(
                                  "text-sm font-bold z-10 pb-0.5 font-sans tracking-tight",
                                  macro.textAccent,
                                )}
                              >
                                {macro.grams} g
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    })()}

                    {/* 5. INGREDIENTS PREVIEW CAROUSEL/LIST */}
                    {ingredients && ingredients.length > 0 && (
                      <div className="space-y-2 pt-1 pb-1 text-left">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                            Ingredientes ({ingredients.length})
                          </span>
                          <button
                            type="button"
                            onClick={() => setCurrentScreen("fix")}
                            className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                          >
                            Ajustar
                          </button>
                        </div>

                        <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1.5 -mx-1 px-1">
                          {ingredients.map((ing) => (
                            <div
                              key={ing.id}
                              className="min-w-[125px] sm:min-w-[135px] p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/70 flex flex-col justify-between shrink-0 shadow-2xs text-left"
                            >
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                                {ing.name}
                              </span>
                              <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-2 font-mono">
                                <span>{Math.round(ing.grams * servings)}g</span>
                                <span className="font-semibold text-slate-700 dark:text-slate-300">
                                  {Math.round(ing.calories * servings)} cal
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 6. PINNED FIXED BOTTOM ACTION BUTTONS (Cal AI Style) */}
                  <div className="sticky bottom-0 z-40 bg-white/95 dark:bg-[#12151b]/95 backdrop-blur-md -mx-5 px-5 pt-3 pb-1 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2.5 mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentScreen("fix")}
                      className="flex-1 rounded-full py-4 h-12 font-bold text-xs border border-slate-200 dark:border-slate-800 text-foreground hover:bg-secondary cursor-pointer shadow-xs"
                    >
                      <Sparkles className="w-4 h-4 mr-1.5 text-foreground" />
                      <span>Ajustar Resultados</span>
                    </Button>

                    <Button
                      type="button"
                      onClick={() => handleSaveToDiary()}
                      className="flex-1 rounded-full py-4 h-12 font-bold text-xs bg-foreground text-background hover:opacity-90 shadow-md transition cursor-pointer"
                    >
                      <span>Listo</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

      {/* ========================================================================= */}
      {/* SCREEN 3: FIX RESULTS & EDIT INGREDIENTS SUB-SCREEN                       */}
      {/* ========================================================================= */}
      {currentScreen === "fix" && (
        <div className="relative w-full h-full flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md">
          <div className="max-w-md w-full h-full sm:h-[92vh] sm:max-h-[820px] rounded-none sm:rounded-[36px] overflow-hidden bg-background border-0 sm:border sm:border-border shadow-2xl p-5 space-y-4 overflow-y-auto custom-scrollbar text-left flex flex-col justify-between text-foreground">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-border/50">
                <button
                  type="button"
                  onClick={() => setCurrentScreen("nutrition")}
                  className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Volver al Reporte</span>
                </button>

                <span className="text-xs font-black uppercase text-foreground">
                  Ajustar Resultados
                </span>
              </div>

              {/* Title & Servings Edit Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Nombre del Plato
                  </label>
                  <input
                    type="text"
                    value={reportTitle || title}
                    onChange={(e) => {
                      setReportTitle(e.target.value);
                      setTitle(e.target.value);
                    }}
                    className="w-full h-10 px-3 rounded-xl bg-secondary/50 border border-border text-sm font-bold text-foreground focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Porciones
                  </label>
                  <div className="h-10 px-3 rounded-xl bg-secondary/50 border border-border flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setServings(Math.max(1, servings - 1))}
                      disabled={servings <= 1}
                      className="text-muted-foreground hover:text-foreground disabled:opacity-40 cursor-pointer p-1"
                      aria-label="Restar porción"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold font-mono">
                      {servings} {servings === 1 ? "porción" : "porciones"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setServings(servings + 1)}
                      className="text-muted-foreground hover:text-foreground cursor-pointer p-1"
                      aria-label="Sumar porción"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Describe with AI Prompt */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-foreground/80" />
                  <span>Describir correcciones con IA:</span>
                </label>
                <form onSubmit={handleApplyAiPrompt} className="flex gap-2">
                  <input
                    type="text"
                    value={aiPromptText}
                    onChange={(e) => setAiPromptText(e.target.value)}
                    placeholder="e.g. 'extra arándanos', 'sin sirope', 'media porción'..."
                    className="flex-1 h-10 px-3 rounded-xl bg-secondary/50 border border-border text-xs focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  />
                  <Button
                    type="submit"
                    disabled={isAiThinking || !aiPromptText.trim()}
                    className="h-10 px-4 rounded-xl bg-foreground text-background font-bold text-xs hover:opacity-90"
                  >
                    {isAiThinking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Ajustar"}
                  </Button>
                </form>
              </div>

              {/* Ingredients List with Grams Stepper */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Ingredientes ({ingredients.length})
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAddFoodOpen(true)}
                    className="text-xs font-bold text-foreground hover:bg-secondary h-7 px-2"
                  >
                    + Agregar Alimento
                  </Button>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                  {ingredients.map((ing) => (
                    <div
                      key={ing.id}
                      className="p-2.5 rounded-2xl bg-secondary/40 border border-border/40 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-foreground block truncate">
                          {ing.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {Math.round(ing.calories * servings)} cal • {ing.category}
                        </span>
                      </div>

                      {/* Stepper */}
                      <div className="flex items-center gap-1.5 bg-background px-2 py-1 rounded-xl border border-border shrink-0">
                        <button
                          type="button"
                          onClick={() => handleUpdateGrams(ing.id, -20)}
                          className="text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-12 text-center font-mono">
                          {Math.round(ing.grams * servings)}g
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateGrams(ing.id, 20)}
                          className="text-muted-foreground hover:text-foreground cursor-pointer"
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
            </div>

            {/* Bottom Button */}
            <div className="pt-3 border-t border-border/40">
              <Button
                type="button"
                onClick={() => setCurrentScreen("nutrition")}
                className="w-full h-11 rounded-2xl bg-foreground text-background font-bold text-xs hover:opacity-90 transition cursor-pointer"
              >
                Aplicar Cambios
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Food Dialog Modal */}
      {isAddFoodOpen && (
        <Dialog open onOpenChange={setIsAddFoodOpen}>
          <DialogContent className="sm:max-w-md rounded-3xl p-6 border border-border bg-card">
            <DialogHeader className="pb-2 border-b border-border/40">
              <DialogTitle className="text-base font-bold text-foreground">
                Agregar Ingrediente
              </DialogTitle>
            </DialogHeader>

            <div className="py-3 space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={foodSearchQuery}
                  onChange={(e) => setFoodSearchQuery(e.target.value)}
                  placeholder="Buscar alimentos..."
                  className="w-full pl-9 pr-3 py-2 bg-secondary/50 border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>

              {/* List */}
              <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-1">
                {filteredFoods.map((f, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedAddFood(f)}
                    className={cn(
                      "w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer",
                      selectedAddFood.name === f.name
                        ? "bg-foreground text-background font-bold"
                        : "hover:bg-secondary text-foreground",
                    )}
                  >
                    <span>{f.name}</span>
                    <span className="text-[10px] opacity-70 font-mono">
                      {f.calPer100g} kcal / 100g
                    </span>
                  </button>
                ))}
              </div>

              {/* Grams Selector */}
              <div className="p-3 bg-secondary/30 rounded-2xl border border-border/40 flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">Porción (gramos)</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAddGrams(Math.max(10, addGrams - 25))}
                    className="w-7 h-7 rounded-xl bg-background text-foreground flex items-center justify-center font-bold"
                  >
                    -
                  </button>
                  <span className="text-xs font-mono font-bold w-12 text-center">{addGrams}g</span>
                  <button
                    type="button"
                    onClick={() => setAddGrams(addGrams + 25)}
                    className="w-7 h-7 rounded-xl bg-background text-foreground flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-border/40 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsAddFoodOpen(false)}
                className="rounded-xl font-semibold text-xs"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAddIngredientSubmit}
                className="rounded-xl font-bold text-xs bg-foreground text-background"
              >
                Agregar al Plato
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Log Empty Food Dialog Modal */}
      {showLogEmptyFoodModal && (
        <Dialog open={showLogEmptyFoodModal} onOpenChange={setShowLogEmptyFoodModal}>
          <DialogContent className="sm:max-w-md rounded-3xl p-6 border border-border bg-card">
            <DialogHeader className="pb-2 border-b border-border/40">
              <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Pencil className="w-4 h-4 text-emerald-500" />
                Registrar alimento vacío
              </DialogTitle>
            </DialogHeader>

            <div className="py-3 space-y-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  Nombre del alimento
                </label>
                <input
                  type="text"
                  value={emptyFoodName}
                  onChange={(e) => setEmptyFoodName(e.target.value)}
                  placeholder="ej. Tarta de zapallitos casera"
                  className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Calorías (kcal)
                  </label>
                  <input
                    type="number"
                    value={emptyFoodCalories}
                    onChange={(e) => setEmptyFoodCalories(e.target.value)}
                    placeholder="250"
                    className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Porción / Medida
                  </label>
                  <input
                    type="text"
                    value={emptyFoodServing}
                    onChange={(e) => setEmptyFoodServing(e.target.value)}
                    placeholder="1 porción (150g)"
                    className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Proteínas (g)
                  </label>
                  <input
                    type="number"
                    value={emptyFoodProtein}
                    onChange={(e) => setEmptyFoodProtein(e.target.value)}
                    placeholder="15"
                    className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Carbohidratos (g)
                  </label>
                  <input
                    type="number"
                    value={emptyFoodCarbs}
                    onChange={(e) => setEmptyFoodCarbs(e.target.value)}
                    placeholder="20"
                    className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Grasas (g)
                  </label>
                  <input
                    type="number"
                    value={emptyFoodFat}
                    onChange={(e) => setEmptyFoodFat(e.target.value)}
                    placeholder="8"
                    className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-border/40 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowLogEmptyFoodModal(false)}
                className="rounded-xl font-semibold text-xs"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveEmptyFood}
                disabled={!emptyFoodName.trim()}
                className="rounded-xl font-bold text-xs bg-foreground text-background"
              >
                Guardar y Registrar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Food Scanner Precision Guide / Tutorial Modal */}
      <FoodScannerTutorialDialog
        open={showTutorial}
        onOpenChange={setShowTutorial}
      />
    </div>
  );
}
