import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  ArrowLeft,
  ArrowRight,
  MoreHorizontal,
  Utensils,
  Barcode,
  Image as ImageIcon,
  Bookmark,
  Pencil,
  Zap,
  RefreshCw,
  Camera,
  Check,
  Loader2,
  Plus,
  Minus,
  Trash2,
  Search,
  Sparkles,
  Info,
  ShieldCheck,
  Award,
  Wind
} from "lucide-react";
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
import { MindfulBreathingModal } from "@/components/mindful-breathing-modal";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
  img: string;
  servings: number;
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
    id: "calai-pho",
    title: "Chicken Phở con Fideos de Arroz y Vegetales",
    reportTitle: "Chicken Phở with Noodles, Veggies and Broth",
    time: "2:00 PM",
    mealType: "Almuerzo",
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
        description: "Ingredientes enteros cocidos sin aditivos ultraprocesados."
      },
      {
        id: "v-fib",
        category: "fiber",
        badgeText: "Alto en fibra",
        description: "Aporte prebiótico de brotes de soja frescos y hierbas digestivas."
      },
      {
        id: "v-prot",
        category: "protein",
        badgeText: "Proteína magra",
        description: "Pollo hervido con perfil completo de aminoácidos esenciales."
      },
      {
        id: "v-sug",
        category: "sugar",
        badgeText: "Sin azúcar añadido",
        description: "Sin glucosa refinada ni endulzantes industriales."
      },
      {
        id: "v-fat",
        category: "fat",
        badgeText: "Grasas moderadas",
        description: "Contenido graso bajo que facilita una rápida asimilación."
      },
      {
        id: "v-grain",
        category: "grains",
        badgeText: "Granos simples",
        description: "Fideos de arroz bánh phở como combustible glucogénico limpio."
      },
      {
        id: "v-sod",
        category: "sodium",
        badgeText: "Sodio moderado",
        description: "Caldo de huesos sazonado con anís estrellado y salsa de pescado tradicional."
      }
    ],
    phytoColors: [
      { name: "Verde", bgClass: "bg-emerald-500", phytochemical: "Clorofila y Folatos (brotes y hierbas)" },
      { name: "Blanco", bgClass: "bg-stone-300 dark:bg-stone-400", phytochemical: "Alicina y almidón digestible (arroz y caldo)" }
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
        description: "Cero refinamiento, ingredientes directos en su estado biológico natural."
      },
      {
        id: "v-fib",
        category: "fiber",
        badgeText: "Alto en fibra",
        description: "Brócoli entero con fibra vegetal que optimiza la flora intestinal."
      },
      {
        id: "v-prot",
        category: "protein",
        badgeText: "Alto en proteína",
        description: "Salmón del Atlántico con máxima biodisponibilidad proteica."
      },
      {
        id: "v-sug",
        category: "sugar",
        badgeText: "Sin azúcar añadido",
        description: "Impacto glucémico neutro."
      },
      {
        id: "v-fat",
        category: "fat",
        badgeText: "Grasas saludables",
        description: "Lípidos cardioprotectores Omega-3."
      },
      {
        id: "v-grain",
        category: "grains",
        badgeText: "Sin granos",
        description: "Comida cetogénica / paleo limpia."
      },
      {
        id: "v-sod",
        category: "sodium",
        badgeText: "Bajo en sodio",
        description: "Sin adición excesiva de sal marina."
      }
    ],
    phytoColors: [
      { name: "Verde", bgClass: "bg-emerald-500", phytochemical: "Sulforafano y Clorofila (brócoli al vapor)" },
      { name: "Naranja", bgClass: "bg-amber-500", phytochemical: "Astaxantina y Omega-3 (salmón del Atlántico)" }
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
        description: "Cocción al horno y plancha sin ultraprocesados."
      },
      {
        id: "v-fib",
        category: "fiber",
        badgeText: "Alto en fibra",
        description: "Batata con piel y vegetales verdes ricos en fibra soluble."
      },
      {
        id: "v-prot",
        category: "protein",
        badgeText: "Alto en proteína",
        description: "42g de proteína magra de alta digestibilidad."
      },
      {
        id: "v-sug",
        category: "sugar",
        badgeText: "Sin azúcar añadido",
        description: "Dulzura natural de la batata asada."
      },
      {
        id: "v-fat",
        category: "fat",
        badgeText: "Grasas saludables",
        description: "Palta Hass rica en ácido oleico monoinsaturado."
      },
      {
        id: "v-grain",
        category: "grains",
        badgeText: "Granos enteros",
        description: "Carbohidratos complejos de absorción sostenida."
      },
      {
        id: "v-sod",
        category: "sodium",
        badgeText: "Bajo en sodio",
        description: "Minerales electrolíticos balanceados."
      }
    ],
    phytoColors: [
      { name: "Verde", bgClass: "bg-emerald-500", phytochemical: "Luteína y Ácido Oleico (palta y hojas verdes)" },
      { name: "Naranja", bgClass: "bg-amber-500", phytochemical: "Beta-carotenos (batata asada)" },
      { name: "Blanco", bgClass: "bg-stone-300 dark:bg-stone-400", phytochemical: "Proteína magra y fibra (pechuga y granos)" }
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
    id: "calai-pancakes",
    title: "Pancakes con Arándanos Frescos & Miel de Maple",
    reportTitle: "Pancakes with Blueberries & Syrup",
    time: "9:30 AM",
    mealType: "Desayuno",
    img: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800&auto=format&fit=crop&q=80",
    servings: 1,
    healthScore: 7,
    narrative:
      "Desayuno energético con arándanos enteros ricos en antocianinas antioxidantes y fibra, equilibrado con carbohidratos de asimilación activa y jarabe puro de arce.",
    bioScore: 78,
    bioGrade: "B+",
    bioQualityLabel: "Energía Matutina Equilibrada",
    bioGaugeIndex: 2,
    vectorBadges: [
      {
        id: "v-proc",
        category: "processing",
        badgeText: "Mínimamente procesado",
        description: "Cocción casera con fruta entera fresca."
      },
      {
        id: "v-fib",
        category: "fiber",
        badgeText: "Buena fibra",
        description: "Polifenoles y fibra de arándanos enteros."
      },
      {
        id: "v-prot",
        category: "protein",
        badgeText: "Proteína moderada",
        description: "Aporte proteico complementario de huevo y leche."
      },
      {
        id: "v-sug",
        category: "sugar",
        badgeText: "Azúcar moderado",
        description: "Sirope de arce puro en porción moderada."
      },
      {
        id: "v-fat",
        category: "fat",
        badgeText: "Bajo en grasas",
        description: "Carga lipídica ligera."
      },
      {
        id: "v-grain",
        category: "grains",
        badgeText: "Granos simples",
        description: "Combustible glucídico matutino."
      },
      {
        id: "v-sod",
        category: "sodium",
        badgeText: "Bajo en sodio",
        description: "Sin exceso de sal añadida."
      }
    ],
    phytoColors: [
      { name: "Morado", bgClass: "bg-purple-500", phytochemical: "Antocianinas y Resveratrol (arándanos frescos)" },
      { name: "Dorado/Blanco", bgClass: "bg-amber-400", phytochemical: "Polifenoles y glucosa rápida (sirope puro)" }
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
        description: "Matriz con aditivos, pan industrial y carnes reconstituidas."
      },
      {
        id: "v-fib",
        category: "fiber",
        badgeText: "Bajo en fibra",
        description: "Carencia de fibra vegetal prebiótica, absorción glucémica acelerada."
      },
      {
        id: "v-prot",
        category: "protein",
        badgeText: "Proteína grasa",
        description: "Aporte proteico acompañado de elevada fracción lipídica."
      },
      {
        id: "v-sug",
        category: "sugar",
        badgeText: "Alto en azúcar",
        description: "Jarabes de alta fructosa en aderezos y panificado."
      },
      {
        id: "v-fat",
        category: "fat",
        badgeText: "Alto en grasas",
        description: "Lípidos saturados y aceites reutilizados en fritura profunda."
      },
      {
        id: "v-grain",
        category: "grains",
        badgeText: "Granos refinados",
        description: "Pan de hamburguesa desprovisto de salvado, rápida conversión en glucosa."
      },
      {
        id: "v-sod",
        category: "sodium",
        badgeText: "Alto en sodio",
        description: "Supera el 50% del requerimiento diario sugerido por la OMS."
      }
    ],
    phytoColors: [
      { name: "Rojo", bgClass: "bg-rose-500", phytochemical: "Licopeno procesado (salsa de tomate)" },
      { name: "Blanco/Dorado", bgClass: "bg-stone-300 dark:bg-stone-400", phytochemical: "Carbohidratos refinados (pan y patatas)" }
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
  { name: "Pancakes (Caseros)", calPer100g: 270, pPer100g: 4.5, cPer100g: 38.6, fPer100g: 9.1, fiberPer100g: 1.1, category: "carbs" as const },
  { name: "Sirope de Maple", calPer100g: 260, pPer100g: 0, cPer100g: 67, fPer100g: 0, fiberPer100g: 0, category: "carbs" as const },
  { name: "Arándanos Frescos", calPer100g: 57, pPer100g: 0.7, cPer100g: 14.5, fPer100g: 0.3, fiberPer100g: 2.4, category: "fruits" as const },
  { name: "Huevo Entero (Hervido / Pochado)", calPer100g: 155, pPer100g: 13, cPer100g: 1.1, fPer100g: 11, fiberPer100g: 0, category: "protein" as const },
  { name: "Pechuga de Pollo (Grill)", calPer100g: 165, pPer100g: 31, cPer100g: 0, fPer100g: 3.6, fiberPer100g: 0, category: "protein" as const },
  { name: "Salmón Fresco (Grill)", calPer100g: 208, pPer100g: 20, cPer100g: 0, fPer100g: 12, fiberPer100g: 0, category: "protein" as const },
  { name: "Batata Asada (Al Horno)", calPer100g: 86, pPer100g: 1.6, cPer100g: 20, fPer100g: 0.1, fiberPer100g: 3, category: "carbs" as const },
  { name: "Arroz Blanco Cocido", calPer100g: 130, pPer100g: 2.7, cPer100g: 28, fPer100g: 0.3, fiberPer100g: 0.4, category: "carbs" as const },
  { name: "Palta Hass Fresca", calPer100g: 160, pPer100g: 2, cPer100g: 8.5, fPer100g: 14.7, fiberPer100g: 6.7, category: "fats" as const },
  { name: "Brócoli al Vapor", calPer100g: 34, pPer100g: 2.8, cPer100g: 6.6, fPer100g: 0.4, fiberPer100g: 2.6, category: "veggies" as const },
  { name: "Yogur Griego Natural", calPer100g: 59, pPer100g: 10, cPer100g: 3.6, fPer100g: 0.4, fiberPer100g: 0, category: "dairy" as const },
  { name: "Aceite de Oliva Extra Virgen", calPer100g: 884, pPer100g: 0, cPer100g: 0, fPer100g: 100, fiberPer100g: 0, category: "fats" as const },
];

export const MEAL_TYPES = [
  "Desayuno",
  "Almuerzo",
  "Snack 1",
  "Merienda",
  "Snack 2",
  "Cena",
  "Pre-entreno",
  "Post-entreno",
];

export const EATING_REASONS = [
  { id: "hunger", label: "Hambre física" },
  { id: "schedule", label: "Horario habitual" },
  { id: "social", label: "Social / Compartir" },
  { id: "craving", label: "Antojo / Placer" },
  { id: "stress", label: "Estrés / Emocional" },
  { id: "convenience", label: "Prisa / Rutina" },
];

function ScanMealPage() {
  const navigate = useNavigate();

  // Screen State: "scanner" (Live Camera Viewfinder) | "nutrition" (Step 1: Bio Report) | "checkin" (Step 2: Mindful Check-in) | "fix" (AI Correction)
  const [currentScreen, setCurrentScreen] = useState<"scanner" | "nutrition" | "checkin" | "fix">("scanner");

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

  // Selected sample & custom capture
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);
  const initialSample = CAL_AI_SAMPLE_MEALS[selectedSampleIndex];
  const [customImage, setCustomImage] = useState<string | null>(null);
  const activeImage = customImage || initialSample.img;

  // Scanner UI States
  const [activeTab, setActiveTab] = useState<"scan" | "barcode" | "gallery" | "saved" | "manual">("scan");
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [isScanningLaser, setIsScanningLaser] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showBioScoreExplanation, setShowBioScoreExplanation] = useState(false);

  // Nutrition Report & breakdown data
  const [title, setTitle] = useState(initialSample.title);
  const [reportTitle, setReportTitle] = useState(initialSample.reportTitle);
  const [narrative, setNarrative] = useState(initialSample.narrative);
  const [bioScore, setBioScore] = useState(initialSample.bioScore);
  const [bioGrade, setBioGrade] = useState(initialSample.bioGrade);
  const [bioQualityLabel, setBioQualityLabel] = useState(initialSample.bioQualityLabel);
  const [bioGaugeIndex, setBioGaugeIndex] = useState(initialSample.bioGaugeIndex);
  const [vectorBadges, setVectorBadges] = useState<NutritionVectorBadge[]>(initialSample.vectorBadges);
  const [phytoColors, setPhytoColors] = useState<PhytoColorItem[]>(initialSample.phytoColors || []);

  // ICN Theme Helper with dynamic biological color accents
  const getIcnTheme = (score: number) => {
    if (score >= 85) {
      return {
        scoreText: "text-emerald-500 dark:text-emerald-400",
        gradeBadge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
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
  const [mealType, setMealType] = useState(initialSample.mealType);
  const [servings, setServings] = useState(initialSample.servings);
  const [healthScore, setHealthScore] = useState(initialSample.healthScore);
  const [calloutPins, setCalloutPins] = useState<MealCalloutPin[]>(initialSample.calloutPins);
  const [ingredients, setIngredients] = useState<MealIngredientItem[]>(initialSample.ingredients);
  const [selectedReasons, setSelectedReasons] = useState<string[]>(["Hambre física"]);
  const [showBreathingModal, setShowBreathingModal] = useState(false);

  const handleToggleReason = (reasonLabel: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reasonLabel)
        ? prev.filter((r) => r !== reasonLabel)
        : [...prev, reasonLabel]
    );
  };

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
        video: { deviceId: { ideal: selectedCameraId }, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
    }

    // 2. Ideal facing mode
    constraintsToTry.push({
      video: { facingMode: { ideal: cameraFacing }, width: { ideal: 1920 }, height: { ideal: 1080 } },
      audio: false,
    });

    // 3. Fallback opposite facing mode
    constraintsToTry.push({
      video: { facingMode: { ideal: cameraFacing === "environment" ? "user" : "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
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
    setCustomImage(null);
    setTitle(s.title);
    setReportTitle(s.reportTitle);
    setNarrative(s.narrative);
    setBioScore(s.bioScore);
    setBioGrade(s.bioGrade);
    setBioQualityLabel(s.bioQualityLabel);
    setBioGaugeIndex(s.bioGaugeIndex);
    setVectorBadges(s.vectorBadges);
    setPhytoColors(s.phytoColors || []);
    setMealType(s.mealType);
    setServings(s.servings);
    setHealthScore(s.healthScore);
    setCalloutPins(s.calloutPins);
    setIngredients(s.ingredients);
    setShowOptions(false);
    toast.success(`Plato seleccionado: ${s.title}`);
  };

  // Handle Photo File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCustomImage(reader.result as string);
        toast.success("Foto cargada con éxito");
        triggerCaptureScan();
      };
      reader.readAsDataURL(file);
    }
  };

  // Shutter Capture Action: Snap instant frame via HTML5 Canvas
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
    }, 600);
  };

  // Base Nutrient Calculations
  const baseCalories = useMemo(() => ingredients.reduce((acc, i) => acc + i.calories, 0), [ingredients]);
  const baseProtein = useMemo(() => ingredients.reduce((acc, i) => acc + i.protein, 0), [ingredients]);
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
      })
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
          prev.map((i) => (i.name.toLowerCase().includes("blueberr") ? { ...i, grams: i.grams + 30, calories: i.calories + 18 } : i))
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
  const handleSaveToDiary = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
    const dateStr = now.toISOString().split("T")[0];

    const newMealItem = {
      id: `meal-${Date.now()}`,
      type: "meal",
      time: timeStr,
      date: dateStr,
      title: reportTitle || title,
      subtitle: `${mealType || "Comida"} • Bio-Report (ICN ${bioScore})`,
      img: activeImage,
      calories: totalCalories,
      kcal: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat,
      fiber: totalFiber,
      sugar: 12.0,
      sodium: 420,
      healthScore: healthScore,
      bioScore: bioScore,
      bioGrade: bioGrade || "A",
      scoreGrade: bioGrade || "A",
      bioQualityLabel: bioQualityLabel,
      bioGaugeIndex: bioGaugeIndex,
      ingredients: ingredients,
      desc: narrative || ingredients.map((i) => `${i.name} (${Math.round(i.grams * servings)}g)`).join(", "),
      summary: narrative || `${title} with ${totalCalories} kcal, ${totalProtein}g protein, ${totalCarbs}g carbs and ${totalFat}g fats.`,
      coachFeedback: narrative || `Índice de Calidad Nutricional (ICN): ${bioScore}/100 — ${bioQualityLabel}.`,
      tag: `ICN ${bioScore}/100 • ${bioQualityLabel}`,
      vectorBadges: vectorBadges,
      phytoColors: phytoColors,
      reasons: selectedReasons
    };

    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(localStorage.getItem("shakerfy_user_timeline_items") || "[]");
        const updated = [newMealItem, ...stored];
        localStorage.setItem("shakerfy_user_timeline_items", JSON.stringify(updated));
      } catch (err) {
        console.error("Error saving timeline meal item:", err);
      }
    }

    toast.success("✓ Comida registrada en el diario");
    navigate({ to: "/app", search: { tab: "diario" } });
  };

  const filteredFoods = COMMON_FOODS_DATABASE.filter((f) =>
    f.name.toLowerCase().includes(foodSearchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 w-screen h-[100dvh] bg-slate-950 text-foreground overflow-hidden flex flex-col justify-between select-none">
      
      {/* ========================================================================= */}
      {/* SCREEN 1: SCANNER FULL SCREEN (React-Webcam Live Camera Viewfinder)       */}
      {/* ========================================================================= */}
      {currentScreen === "scanner" && (
        <div className="relative w-full h-full flex flex-col justify-between overflow-hidden">
          
          {/* Full Screen Viewfinder: HTML5 Video Stream or Custom Loaded Image */}
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
                  cameraFacing === "user" && !selectedCameraId && "-scale-x-100"
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
            {flashlightOn && (
              <div className="absolute inset-0 bg-white/20 pointer-events-none" />
            )}

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

          {/* Top Bar: Back to App, Scanner Title, Options */}
          <div className="relative z-20 pt-6 sm:pt-8 px-6 max-w-lg mx-auto w-full flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate({ to: "/app", search: { tab: "diario" } })}
              className="w-11 h-11 rounded-full bg-black/40 text-white backdrop-blur-md flex items-center justify-center hover:scale-105 active:scale-95 transition cursor-pointer border border-white/10 shadow-lg"
              aria-label="Volver a la App"
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

          {/* Sample Dishes & Device Selector Popover */}
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
                          : "hover:bg-secondary text-foreground"
                      )}
                    >
                      <span className="truncate">{cam.label || `Cámara ${idx + 1}`}</span>
                      {selectedCameraId === cam.deviceId && <Check className="w-3.5 h-3.5 shrink-0 ml-1 text-emerald-500" />}
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
                      : "hover:bg-secondary text-foreground"
                  )}
                >
                  <span className="truncate">{sample.title}</span>
                  <span className="text-[10px] opacity-80 ml-1 shrink-0 font-mono font-bold text-muted-foreground">{sample.bioScore} pts</span>
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

          {/* Camera Reticle / 4 Corner Brackets */}
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
          <div className="relative z-20 pb-8 sm:pb-12 px-6 max-w-md mx-auto w-full space-y-6">
            
            {/* Floating Dock Bar */}
            <div className="bg-white/85 dark:bg-black/75 backdrop-blur-xl rounded-full p-1.5 flex items-center justify-between shadow-2xl border border-white/30">
              
              {/* Scan food mode */}
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
                    : "text-foreground hover:bg-white/40"
                )}
              >
                <Utensils className="w-4 h-4" />
                <span>Scan food</span>
              </button>

              {/* Barcode mode */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab("barcode");
                  toast.info("Modo escáner de código de barras");
                }}
                className="p-2.5 text-foreground/80 hover:text-foreground hover:bg-white/40 rounded-full transition cursor-pointer"
                title="Barcode"
              >
                <Barcode className="w-4 h-4" />
              </button>

              {/* Gallery Image Upload */}
              <label className="p-2.5 text-foreground/80 hover:text-foreground hover:bg-white/40 rounded-full transition cursor-pointer">
                <ImageIcon className="w-4 h-4" />
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>

              {/* Bookmark Button */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab("saved");
                  toast.info("Comidas guardadas");
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
                  flashlightOn ? "bg-white text-black shadow-lg" : "bg-black/40 text-white"
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
                aria-label="Capturar y Analizar"
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
      {/* SCREEN 2: STEP 1 - BIO-REPORTE NUTRICIONAL DE LA IA                      */}
      {/* ========================================================================= */}
      {currentScreen === "nutrition" && (() => {
        const icnTheme = getIcnTheme(bioScore);
        return (
          <div className="min-h-screen w-full bg-background text-foreground flex flex-col justify-between overflow-x-hidden animate-in fade-in duration-300">
            
            {/* Top Bar */}
            <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/60 px-4 sm:px-6 py-3.5 flex items-center justify-between max-w-xl mx-auto w-full">
              <button
                type="button"
                onClick={() => setCurrentScreen("scanner")}
                className="w-9 h-9 rounded-full bg-secondary text-foreground flex items-center justify-center hover:bg-secondary/80 active:scale-95 transition cursor-pointer border border-border/50 shadow-xs"
                aria-label="Volver al escáner"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
                  PASO 1 DE 2
                </span>
                <span className="text-xs font-bold text-foreground">
                  Reporte Biológico
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowOptions(!showOptions)}
                className="w-9 h-9 rounded-full bg-secondary text-foreground flex items-center justify-center hover:bg-secondary/80 active:scale-95 transition cursor-pointer border border-border/50 shadow-xs"
                aria-label="Opciones"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Main Content Body */}
            <div className="flex-1 max-w-xl mx-auto w-full px-4 sm:px-6 py-5 space-y-5 text-left">
              
              {/* Sample Dish Selector (if toggled) */}
              {showOptions && (
                <div className="bg-card border border-border rounded-2xl p-3 shadow-xl space-y-2 animate-in fade-in zoom-in-95 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1 block">
                    Seleccionar Muestra de Análisis:
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
                          : "hover:bg-secondary text-foreground"
                      )}
                    >
                      <span className="truncate">{sample.title}</span>
                      <span className="text-[10px] opacity-80 ml-1 shrink-0 font-mono font-bold">{sample.bioScore} pts</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Meal Photo Card - Clean Image */}
              <div className="relative h-60 sm:h-72 w-full rounded-3xl overflow-hidden border border-border shadow-xs bg-muted group">
                <img 
                  src={activeImage} 
                  alt="Foto del plato" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>

              {/* Meal Title & AI Narrative */}
              <div className="space-y-1.5 pt-1">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground leading-snug">
                  {reportTitle || title}
                </h1>
                <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed font-normal">
                  {narrative}
                </p>
              </div>

              {/* ========================================================================= */}
              {/* PROPRIETARY SCORE: ÍNDICE DE CALIDAD NUTRICIONAL SHAKERFY (ICN) - COLOR   */}
              {/* ========================================================================= */}
              <Card className={cn("rounded-3xl border bg-card shadow-xs p-5 sm:p-6 space-y-4 text-left transition-all", icnTheme.cardBorder)}>
                <CardContent className="p-0 space-y-3.5">
                  
                  {/* Card Header with Info Button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className={cn("w-4 h-4", icnTheme.iconColor)} />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        Índice de Calidad Nutricional (ICN)
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowBioScoreExplanation(!showBioScoreExplanation)}
                      className={cn(
                        "text-muted-foreground hover:text-foreground transition p-1.5 rounded-full hover:bg-secondary cursor-pointer",
                        showBioScoreExplanation && "bg-secondary text-foreground"
                      )}
                      title="¿Cómo se calcula el ICN?"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Main Score Hero Row */}
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-baseline gap-1.5">
                        <span className={cn("text-3xl sm:text-4xl font-black tracking-tight font-mono", icnTheme.scoreText)}>
                          {bioScore}
                        </span>
                        <span className="text-xs font-bold text-muted-foreground">/ 100</span>
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground block">
                        {bioQualityLabel}
                      </span>
                    </div>

                    <Badge variant="outline" className={cn("text-xs font-bold px-3 py-1 rounded-xl shadow-none whitespace-nowrap shrink-0", icnTheme.gradeBadge)}>
                      Grado {bioGrade}
                    </Badge>
                  </div>

                  {/* 5-Segment Bio-Nutrient Gauge Bar with Biological Colors */}
                  <div className="space-y-1 pt-1 select-none">
                    <div className="flex items-center gap-1.5">
                      {[
                        { label: "Básico", min: 0 },
                        { label: "Moderado", min: 55 },
                        { label: "Equilibrado", min: 70 },
                        { label: "Superior", min: 85 },
                        { label: "Óptimo", min: 95 },
                      ].map((seg, idx) => {
                        const isReached = idx <= bioGaugeIndex;
                        const isCurrent = idx === bioGaugeIndex;

                        return (
                          <div
                            key={idx}
                            className={cn(
                              "h-1.5 flex-1 rounded-full transition-all duration-300",
                              isCurrent
                                ? cn(icnTheme.gaugeColor, "opacity-100 shadow-xs")
                                : isReached
                                ? cn(icnTheme.gaugeColor, "opacity-45")
                                : "bg-secondary border border-border/40"
                            )}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Inline Expandable Explanation */}
                  {showBioScoreExplanation && (
                    <div className="pt-3 border-t border-border/50 space-y-2.5 animate-in fade-in slide-in-from-top-2 text-xs text-muted-foreground leading-relaxed">
                      <div className="p-3 rounded-2xl bg-secondary/40 border border-border/40 space-y-1">
                        <span className="font-bold text-foreground block text-xs">Información Biológica, Cero Juicio</span>
                        <p className="text-[11px]">
                          El ICN cuantifica la biodisponibilidad y densidad de micronutrientes sin emitir juicios morales restrictivos.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2 rounded-xl bg-secondary/30 border border-border/30">
                          <span className="font-bold text-foreground block">Matriz NOVA:</span>
                          Nivel de procesamiento biológico.
                        </div>
                        <div className="p-2 rounded-xl bg-secondary/30 border border-border/30">
                          <span className="font-bold text-foreground block">Fibra Activa:</span>
                          Microbiota y regulación glucémica.
                        </div>
                        <div className="p-2 rounded-xl bg-secondary/30 border border-border/30">
                          <span className="font-bold text-foreground block">Proteína HBV:</span>
                          Biodisponibilidad de aminoácidos.
                        </div>
                        <div className="p-2 rounded-xl bg-secondary/30 border border-border/30">
                          <span className="font-bold text-foreground block">Perfil Lipídico:</span>
                          Ácidos grasos insaturados/omega-3.
                        </div>
                      </div>
                    </div>
                  )}

                </CardContent>
              </Card>

              {/* ========================================================================= */}
              {/* 7 NUTRITIONAL VECTORS: WITH CHECKMARK ICONS                              */}
              {/* ========================================================================= */}
              <div className="space-y-2.5 pt-1 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Vectores Nutricionales
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground/70 font-mono">
                    7 de 7
                  </span>
                </div>

                {/* Clean Badges Container with Check Icon */}
                <div className="flex flex-wrap gap-1.5">
                  {vectorBadges.map((badge) => (
                    <div
                      key={badge.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-secondary/80 text-secondary-foreground border border-border/50 shadow-none cursor-default select-none transition-colors"
                      title={badge.description}
                    >
                      <Check className="w-3.5 h-3.5 text-foreground shrink-0 stroke-[2.5]" />
                      <span>{badge.badgeText}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ========================================================================= */}
              {/* CROMONUTRICIÓN: PUNTOS SUTILES DE FITOCOLORES                            */}
              {/* ========================================================================= */}
              {phytoColors && phytoColors.length > 0 && (
                <div className="space-y-2 pt-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Cromonutrición
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground/70 font-mono">
                      {phytoColors.length}/5 fitocolores
                    </span>
                  </div>

                  {/* Subtle Color Dots with Phyto-labels */}
                  <div className="flex flex-wrap gap-1.5">
                    {phytoColors.map((phyto, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-secondary/80 text-secondary-foreground border border-border/50 shadow-none select-none cursor-default"
                        title={phyto.phytochemical ? `${phyto.name}: ${phyto.phytochemical}` : phyto.name}
                      >
                        <span className={cn("w-2 h-2 rounded-full shrink-0 shadow-2xs", phyto.bgClass)} />
                        <span>{phyto.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Visual Identification Disclaimer */}
              <p className="text-[11px] text-muted-foreground/70 leading-snug pt-1 pb-4">
                Visual identification may be inaccurate. Always check important details.
              </p>

            </div>

            {/* Sticky Bottom Action Footer */}
            <div className="sticky bottom-0 z-30 bg-background/90 backdrop-blur-xl border-t border-border px-4 sm:px-6 py-4 max-w-xl mx-auto w-full flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentScreen("scanner")}
                className="rounded-2xl px-4 py-5 font-semibold text-xs border-border text-foreground hover:bg-secondary cursor-pointer shadow-none"
              >
                <Camera className="w-4 h-4 mr-1.5" />
                <span>Escanear Otro</span>
              </Button>

              <Button
                type="button"
                onClick={() => setCurrentScreen("checkin")}
                className="flex-1 rounded-2xl py-5 font-bold text-sm bg-foreground text-background hover:opacity-90 shadow-md transition cursor-pointer"
              >
                <span>Continuar</span>
                <ArrowRight className="w-4 h-4 stroke-[3px] ml-1.5" />
              </Button>
            </div>

          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* SCREEN 3: STEP 2 - CHECK-IN CONSCIENTE & REGISTRO                         */}
      {/* ========================================================================= */}
      {currentScreen === "checkin" && (
        <div className="min-h-screen w-full bg-background text-foreground flex flex-col justify-between overflow-x-hidden animate-in fade-in duration-300">
          
          {/* Top Bar */}
          <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/60 px-4 sm:px-6 py-3.5 flex items-center justify-between max-w-xl mx-auto w-full">
            <button
              type="button"
              onClick={() => setCurrentScreen("nutrition")}
              className="w-9 h-9 rounded-full bg-secondary text-foreground flex items-center justify-center hover:bg-secondary/80 active:scale-95 transition cursor-pointer border border-border/50 shadow-xs"
              aria-label="Volver al reporte"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
                PASO 2 DE 2
              </span>
              <span className="text-xs font-bold text-foreground">
                Check-in Consciente
              </span>
            </div>

            <div className="w-9 h-9" />
          </div>

          {/* Main Form Body */}
          <div className="flex-1 max-w-xl mx-auto w-full px-4 sm:px-6 py-5 space-y-6 text-left">
            
            {/* Dish Context Snippet */}
            <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border/60 flex items-center gap-3.5 shadow-xs">
              <img 
                src={activeImage} 
                alt="Foto" 
                className="w-12 h-12 rounded-xl object-cover border border-border/50 shrink-0" 
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-foreground truncate">
                  {reportTitle || title}
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  ICN {bioScore}/100 • Grado {bioGrade}
                </p>
              </div>
            </div>

            {/* SECTION 1: MOMENTO DEL DÍA (SINGLE-SELECT) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  1. Momento del Día / Tipo de Comida
                </span>
                <span className="text-[10px] font-semibold text-muted-foreground/70">
                  Selección única
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {MEAL_TYPES.map((type) => {
                  const isSelected = (mealType || "Almuerzo") === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setMealType(type)}
                      className={cn(
                        "rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-all cursor-pointer shadow-none",
                        isSelected
                          ? "bg-foreground text-background border-foreground font-bold shadow-xs scale-[1.02]"
                          : "bg-secondary/60 text-secondary-foreground border-border/50 hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECTION 2: ¿POR QUÉ COMES HOY? (MULTI-SELECT) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  2. ¿Por qué comes este plato?
                </span>
                <span className="text-[10px] font-semibold text-muted-foreground/70">
                  Selección múltiple ({selectedReasons.length})
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {EATING_REASONS.map((r) => {
                  const isSelected = selectedReasons.includes(r.label);
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleToggleReason(r.label)}
                      className={cn(
                        "rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-all cursor-pointer shadow-none",
                        isSelected
                          ? "bg-foreground text-background border-foreground font-bold shadow-xs scale-[1.02]"
                          : "bg-secondary/60 text-secondary-foreground border-border/50 hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      {isSelected ? `✓ ${r.label}` : `+ ${r.label}`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CONDITIONAL PROMINENT MINDFUL PAUSE BANNER */}
            {selectedReasons.includes("Estrés / Emocional") && (
              <div className="p-4 sm:p-5 rounded-3xl bg-secondary/70 border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 animate-in fade-in slide-in-from-top-3 duration-300 shadow-sm">
                <div className="space-y-1 text-left flex-1">
                  <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                    <Wind className="w-4 h-4 text-foreground shrink-0" />
                    <span>¿Sientes tensión o ansiedad?</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Tómate 1 minuto para activar tu tono vagal y calmar tu sistema simpático antes del primer bocado.
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={() => setShowBreathingModal(true)}
                  className="w-full sm:w-auto rounded-2xl px-4 py-2.5 text-xs font-bold bg-foreground text-background hover:opacity-90 shadow-xs cursor-pointer shrink-0"
                >
                  <Wind className="w-3.5 h-3.5 mr-1.5" />
                  <span>Pausa de Respiración</span>
                </Button>
              </div>
            )}

            <p className="text-[11px] text-muted-foreground/70 leading-snug pt-2">
              Este check-in entrena tu conciencia interoceptiva para diferenciar hambre homeostática de apetito emocional.
            </p>

          </div>

          {/* Sticky Bottom Action Footer */}
          <div className="sticky bottom-0 z-30 bg-background/90 backdrop-blur-xl border-t border-border px-4 sm:px-6 py-4 max-w-xl mx-auto w-full flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentScreen("nutrition")}
              className="rounded-2xl px-4 py-5 font-semibold text-xs border-border text-foreground hover:bg-secondary cursor-pointer shadow-none"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Atrás</span>
            </Button>

            <Button
              type="button"
              onClick={handleSaveToDiary}
              className="flex-1 rounded-2xl py-5 font-bold text-sm bg-foreground text-background hover:opacity-90 shadow-md transition cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3px] mr-1.5" />
              <span>Guardar en el Diario</span>
            </Button>
          </div>

        </div>
      )}

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

                <span className="text-xs font-black uppercase text-foreground">Ajustar Resultados</span>
              </div>

              {/* Title Edit */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Nombre del Plato</label>
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
                        <span className="text-xs font-bold text-foreground block truncate">{ing.name}</span>
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
                className="w-full h-11 rounded-2xl bg-foreground text-background font-bold text-xs hover:opacity-90 transition"
              >
                Listo
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
                        : "hover:bg-secondary text-foreground"
                    )}
                  >
                    <span>{f.name}</span>
                    <span className="text-[10px] opacity-70 font-mono">{f.calPer100g} kcal / 100g</span>
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
              <Button variant="outline" onClick={() => setIsAddFoodOpen(false)} className="rounded-xl font-semibold text-xs">
                Cancelar
              </Button>
              <Button onClick={handleAddIngredientSubmit} className="rounded-xl font-bold text-xs bg-foreground text-background">
                Agregar al Plato
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Mindful Vagal Breathing Orb Modal */}
      <MindfulBreathingModal
        open={showBreathingModal}
        onOpenChange={setShowBreathingModal}
      />

    </div>
  );
}
