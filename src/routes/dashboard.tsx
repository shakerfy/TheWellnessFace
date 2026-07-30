import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useMemo, useEffect, Fragment } from "react";
import {
  Building2,
  Users,
  Calendar,
  CreditCard,
  Settings,
  LogOut,
  Bell,
  CheckCircle2,
  AlertCircle,
  Search,
  Download,
  MapPin,
  Clock,
  Plus,
  HelpCircle,
  Activity,
  Trash2,
  Check,
  Edit2,
  Dumbbell,
  Image as ImageIcon,
  FileText,
  Eye,
  X,
  ShieldAlert,
  DoorOpen,
  MessageCircle,
  Star,
  Flag,
  MoreHorizontal,
  Wrench,
  Zap,
  Snowflake,
  DollarSign,
  Receipt,
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  BarChart2,
  Navigation,
  Scan,
  ShoppingCart,
  Package,
  PackagePlus,
  PlusCircle,
  Upload,
  QrCode,
  Printer,
  Filter,
  MoreVertical,
  Slash,
  UserCheck,
  UserX,
  Layers,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/dashboard")({
  component: GymDashboard,
});

const TABS = [
  { id: "asistencia", label: "Asistencias", icon: Activity },
  { id: "clases", label: "Clases", icon: Calendar },
  { id: "miembros", label: "Miembros", icon: Users },
  { id: "caja", label: "Caja / POS", icon: DollarSign },
  { id: "finanzas", label: "Finanzas", icon: TrendingUp },
  { id: "reportes", label: "Reportes", icon: BarChart2 },
  { id: "inventario", label: "Inventario", icon: Package },
  { id: "reseñas", label: "Reseñas", icon: MessageCircle },
  { id: "membresias", label: "Membresías", icon: CreditCard },
  { id: "config", label: "Configuración", icon: Settings },
];

interface CurrentUser {
  name: string;
  email: string;
  role?: string;
}

function GymDashboard() {
  const [activeTab, setActiveTab] = useState("asistencia");
  const navigate = useNavigate();
  const [currentUser] = useState<CurrentUser>({
    name: "Alan Kraft",
    email: "admin@studiopulse.com",
    role: "superadmin",
  });

  // STATE LIFTED UP (Models the Firebase data structure in local memory)

  // 1. Staff List
  const [staffList, setStaffList] = useState<
    {
      id: string;
      name: string;
      specialty: string;
      specialties?: string[];
      certifications: string[];
      photo: string;
      certificationImages?: string[];
      role?: string;
      branchId?: string;
      linkingCode: string | null;
      status: "pending" | "linked";
      availability?: any[];
      // Payroll config
      payModel?: "fixed_class" | "per_student" | "hybrid" | "percent";
      fixedRatePerClass?: number;
      ratePerStudent?: number;
      revenuePercent?: number;
    }[]
  >([
    {
      id: "1",
      name: "Mateo Rossi",
      specialty: "CrossFit, Levantamiento Olímpico, Fuerza de Potencia",
      specialties: ["CrossFit", "Levantamiento Olímpico", "Powerlifting", "Fuerza de Potencia"],
      certifications: ["CF-L2", "Coaching de Fuerza"],
      photo:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80",
      certificationImages: [
        "https://images.unsplash.com/photo-1589330694653-ded6df53f7ec?auto=format&fit=crop&w=300&q=80",
        "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=300&q=80",
      ],
      role: "coach",
      branchId: undefined,
      linkingCode: null,
      status: "linked",
      availability: [
        { day: "Lunes", intervals: [{ from: "08:00", to: "12:00" }] },
        { day: "Miércoles", intervals: [{ from: "08:00", to: "12:00" }] },
        { day: "Viernes", intervals: [{ from: "08:00", to: "12:00" }] },
      ],
      payModel: "hybrid",
      fixedRatePerClass: 3000,
      ratePerStudent: 500,
    },
    {
      id: "2",
      name: "Valeria Soto",
      specialty: "Yoga Vinyasa, Yoga Hatha, Estiramiento & Flexibilidad",
      specialties: ["Yoga Vinyasa", "Yoga Hatha", "Estiramiento / Flex"],
      certifications: ["RYT-200", "Yoga Terapéutico"],
      photo:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&h=80&q=80",
      certificationImages: [
        "https://images.unsplash.com/photo-1589330694653-ded6df53f7ec?auto=format&fit=crop&w=300&q=80",
      ],
      role: "coach",
      branchId: undefined,
      linkingCode: "7821",
      status: "pending",
      availability: [
        { day: "Martes", intervals: [{ from: "09:00", to: "15:00" }] },
        { day: "Jueves", intervals: [{ from: "09:00", to: "15:00" }] },
      ],
      payModel: "fixed_class",
      fixedRatePerClass: 5000,
    },
    {
      id: "3",
      name: "Daniel Castro",
      specialty: "Entrenamiento Funcional, HIIT / Tabata, Spinning",
      specialties: ["Entrenamiento Funcional", "HIIT / Tabata", "Spinning"],
      certifications: ["Prof. Educación Física", "FMS Level 1"],
      photo:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80",
      certificationImages: [],
      role: "manager",
      branchId: "1",
      linkingCode: "4310",
      status: "pending",
      availability: [
        { day: "Lunes", intervals: [{ from: "14:00", to: "20:00" }] },
        { day: "Viernes", intervals: [{ from: "14:00", to: "20:00" }] },
      ],
      payModel: "per_student",
      ratePerStudent: 800,
    },
  ]);

  // 2. Expanded Amenities
  const [amenities, setAmenities] = useState([
    { id: "vestuarios", name: "Vestuarios Completos", category: "Instalaciones", checked: true },
    { id: "duchas", name: "Duchas de Agua Caliente", category: "Instalaciones", checked: true },
    { id: "lockers", name: "Lockers de Seguridad", category: "Instalaciones", checked: true },
    { id: "sauna", name: "Sauna Húmedo / Seco", category: "Instalaciones", checked: false },
    { id: "parking", name: "Estacionamiento Propio", category: "Instalaciones", checked: true },
    { id: "cafe", name: "Cafetería / Bar Saludable", category: "Instalaciones", checked: false },
    { id: "coworking", name: "Zona de Coworking", category: "Instalaciones", checked: false },
    { id: "ac", name: "Aire Acondicionado", category: "Instalaciones", checked: true },
    { id: "pool", name: "Piscina Climatizada", category: "Instalaciones", checked: false },
    { id: "canchas", name: "Canchas (Pádel / Fútbol)", category: "Instalaciones", checked: false },
    { id: "outdoor", name: "Área al Aire Libre", category: "Instalaciones", checked: false },
    { id: "guarderia", name: "Guardería Infantil", category: "Instalaciones", checked: false },
    { id: "wifi", name: "WiFi Alta Velocidad", category: "Servicios", checked: true },
    { id: "nutrition", name: "Asesoramiento Nutricional", category: "Servicios", checked: false },
    {
      id: "kinesiologia",
      name: "Kinesiología & Fisioterapia",
      category: "Servicios",
      checked: false,
    },
    { id: "masajes", name: "Gabinete de Masajes", category: "Servicios", checked: false },
    { id: "towels", name: "Alquiler de Toallas", category: "Servicios", checked: false },
    { id: "merch", name: "Tienda de Indumentaria / Merch", category: "Servicios", checked: false },
    {
      id: "bike",
      name: "Bicicletero / Estacionamiento de Bici",
      category: "Instalaciones",
      checked: true,
    },
    {
      id: "water",
      name: "Dispensador de Agua / Bebedero",
      category: "Instalaciones",
      checked: true,
    },
    {
      id: "supplements",
      name: "Venta de Suplementos / Bebidas",
      category: "Servicios",
      checked: true,
    },
  ]);

  // 3. Expanded Requirements
  const [requirements, setRequirements] = useState([
    {
      id: "apto",
      name: "Apto médico obligatorio (Ficha al día)",
      category: "Documentación",
      checked: true,
    },
    {
      id: "toalla",
      name: "Traer toalla personal obligatoria",
      category: "Higiene y Vestimenta",
      checked: true,
    },
    {
      id: "calzado",
      name: "Uso de calzado limpio exclusivo para la sala",
      category: "Higiene y Vestimenta",
      checked: true,
    },
    {
      id: "mat",
      name: "Traer mat de yoga propio",
      category: "Higiene y Vestimenta",
      checked: false,
    },
    {
      id: "indumentaria",
      name: "Ropa deportiva obligatoria",
      category: "Higiene y Vestimenta",
      checked: true,
    },
    {
      id: "reserva",
      name: "Reserva de clase con anticipación",
      category: "Normas de la Sala",
      checked: true,
    },
    {
      id: "pesos",
      name: "Devolver discos y mancuernas a su lugar",
      category: "Normas de la Sala",
      checked: true,
    },
    {
      id: "magnesio",
      name: "Prohibido el magnesio suelto (solo en bloque/líquido)",
      category: "Normas de la Sala",
      checked: false,
    },
    {
      id: "limpieza",
      name: "Desinfectar máquinas después de usarlas",
      category: "Normas de la Sala",
      checked: true,
    },
  ]);

  // 3.5. Gym Equipment State
  const [equipment, setEquipment] = useState([
    {
      id: "racks",
      name: "Racks olímpicos y jaulas de potencia",
      category: "Musculación & Peso Libre",
      checked: true,
      photo:
        "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=300&q=80",
      trackingType: "volume",
      maintenanceRule: "Inspección de anclajes (Mensual)",
      status: "ok",
      stats: "14,200 kg hoy",
    },
    {
      id: "mancuernas",
      name: "Set de mancuernas (1 kg a 50 kg)",
      category: "Musculación & Peso Libre",
      checked: true,
      photo:
        "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=300&q=80",
      trackingType: "volume",
      maintenanceRule: "Ajuste de tornillería (Bimestral)",
      status: "ok",
      stats: "8,500 kg hoy",
    },
    {
      id: "barras",
      name: "Barras olímpicas y discos bumpers",
      category: "Musculación & Peso Libre",
      checked: true,
      photo:
        "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=300&q=80",
      trackingType: "volume",
      maintenanceRule: "Lubricación de bujes (Trimestral)",
      status: "ok",
      stats: "45 sesiones",
    },
    {
      id: "bancos",
      name: "Bancos planos, inclinados y regulables",
      category: "Musculación & Peso Libre",
      checked: true,
      photo:
        "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=300&q=80",
      trackingType: "passive",
      maintenanceRule: "Revisión de tapizados (Mensual)",
      status: "ok",
      stats: "Uso continuo",
    },
    {
      id: "plataformas",
      name: "Plataformas de levantamiento (Weightlifting)",
      category: "Musculación & Peso Libre",
      checked: false,
      photo:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=300&q=80",
      trackingType: "passive",
      maintenanceRule: "Impacto y juntas (Semestral)",
      status: "ok",
      stats: "Uso medio",
    },
    {
      id: "kettlebells",
      name: "Pesas rusas / Kettlebells de competición",
      category: "Musculación & Peso Libre",
      checked: true,
      photo:
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=300&q=80",
      trackingType: "volume",
      maintenanceRule: "Inspección de asas (Semestral)",
      status: "ok",
      stats: "3,100 kg hoy",
    },
    {
      id: "poleas",
      name: "Poleas cruzadas / Torre multifunción",
      category: "Máquinas Guiadas & Poleas",
      checked: true,
      photo:
        "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=300&q=80",
      trackingType: "direct",
      maintenanceRule: "Engrase de guías y cables (200 hs)",
      status: "warning",
      stats: "185 hs • Próximo",
    },
    {
      id: "prensa",
      name: "Prensa de piernas 45° / Hack Squat",
      category: "Máquinas Guiadas & Poleas",
      checked: true,
      photo:
        "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=300&q=80",
      trackingType: "direct",
      maintenanceRule: "Rodamientos lineales (300 hs)",
      status: "ok",
      stats: "210 hs de uso",
    },
    {
      id: "sillones",
      name: "Sillón de cuádriceps e isquiotibiales",
      category: "Máquinas Guiadas & Poleas",
      checked: true,
      photo:
        "https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=300&q=80",
      trackingType: "direct",
      maintenanceRule: "Revisión de cinta y ejes (250 hs)",
      status: "ok",
      stats: "142 hs de uso",
    },
    {
      id: "smith",
      name: "Máquina Smith / Multipower",
      category: "Máquinas Guiadas & Poleas",
      checked: true,
      photo:
        "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=300&q=80",
      trackingType: "direct",
      maintenanceRule: "Barras guía y seguros (200 hs)",
      status: "ok",
      stats: "168 hs de uso",
    },
    {
      id: "lat",
      name: "Dorsalera (Lat Pulldown) y Remo bajo",
      category: "Máquinas Guiadas & Poleas",
      checked: true,
      photo:
        "https://images.unsplash.com/photo-1596357395217-80de13130e92?auto=format&fit=crop&w=300&q=80",
      trackingType: "direct",
      maintenanceRule: "Cable de acero y mosquetón (200 hs)",
      status: "ok",
      stats: "190 hs de uso",
    },
    {
      id: "cintas",
      name: "Cintas de correr profesionales",
      category: "Cardio & Acondicionamiento",
      checked: true,
      photo:
        "https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=300&q=80",
      trackingType: "direct",
      maintenanceRule: "Alineación y tensión (300 hs)",
      status: "maintenance_due",
      stats: "315 hs • Atención",
    },
    {
      id: "bikes",
      name: "Bicicletas de Spinning / Indoor Cycle",
      category: "Cardio & Acondicionamiento",
      checked: true,
      photo:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=300&q=80",
      trackingType: "direct",
      maintenanceRule: "Correa y freno (250 hs)",
      status: "ok",
      stats: "180 hs de uso",
    },
    {
      id: "remos",
      name: "Remos ergonómetricos (Concept2)",
      category: "Cardio & Acondicionamiento",
      checked: false,
      photo:
        "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=300&q=80",
      trackingType: "direct",
      maintenanceRule: "Cadena y turbina (350 hs)",
      status: "ok",
      stats: "95 hs de uso",
    },
    {
      id: "airbikes",
      name: "Assault Bikes / Air Bikes",
      category: "Cardio & Acondicionamiento",
      checked: false,
      photo:
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=300&q=80",
      trackingType: "direct",
      maintenanceRule: "Tensión de cadena (200 hs)",
      status: "ok",
      stats: "110 hs de uso",
    },
    {
      id: "skierg",
      name: "SkiErg de Concept2",
      category: "Cardio & Acondicionamiento",
      checked: false,
      photo:
        "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=300&q=80",
      trackingType: "direct",
      maintenanceRule: "Cuerdas de tiro (350 hs)",
      status: "ok",
      stats: "64 hs de uso",
    },
    {
      id: "escaladoras",
      name: "Escaladoras continuas (StairMaster)",
      category: "Cardio & Acondicionamiento",
      checked: false,
      photo:
        "https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=300&q=80",
      trackingType: "direct",
      maintenanceRule: "Cadena principal (250 hs)",
      status: "ok",
      stats: "140 hs de uso",
    },
    {
      id: "trx",
      name: "TRX / Sistema de entrenamiento en suspensión",
      category: "Funcional & Movilidad",
      checked: true,
      photo:
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=300&q=80",
      trackingType: "passive",
      maintenanceRule: "Costuras y anclaje (Trimestral)",
      status: "ok",
      stats: "Alta durabilidad",
    },
    {
      id: "plyo",
      name: "Cajones pliométricos de madera y soft",
      category: "Funcional & Movilidad",
      checked: true,
      photo:
        "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=300&q=80",
      trackingType: "passive",
      maintenanceRule: "Estabilidad y bordes (Semestral)",
      status: "ok",
      stats: "Buen estado",
    },
    {
      id: "wallballs",
      name: "Balones medicinales y Wall Balls",
      category: "Funcional & Movilidad",
      checked: true,
      photo:
        "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=300&q=80",
      trackingType: "passive",
      maintenanceRule: "Costuras y forma (Trimestral)",
      status: "ok",
      stats: "2 u. desgaste leve",
    },
    {
      id: "ropes",
      name: "Sogas de batir (Battle Ropes)",
      category: "Funcional & Movilidad",
      checked: false,
      photo:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=300&q=80",
      trackingType: "passive",
      maintenanceRule: "Empuñaduras (Semestral)",
      status: "ok",
      stats: "Sin novedades",
    },
    {
      id: "mats",
      name: "Mats de Yoga y rodillos de liberación miofascial",
      category: "Funcional & Movilidad",
      checked: true,
      photo:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=300&q=80",
      trackingType: "passive",
      maintenanceRule: "Desinfección • Cambio semestral",
      status: "ok",
      stats: "Reposición en 60 d.",
    },
    {
      id: "bandas",
      name: "Bandas elásticas y de resistencia",
      category: "Funcional & Movilidad",
      checked: true,
      photo:
        "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=300&q=80",
      trackingType: "passive",
      maintenanceRule: "Control de fisuras (Trimestral)",
      status: "ok",
      stats: "Lote renovado",
    },
  ]);

  // 4. Gym Photos State
  const [gymPhotos, setGymPhotos] = useState([
    "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=500&q=80",
  ]);

  // 5. 7-Day Business Hours with Split Intervals State
  const [weeklyHours, setWeeklyHours] = useState([
    {
      day: "Lunes",
      intervals: [
        { from: "07:00", to: "12:00" },
        { from: "14:00", to: "21:00" },
      ],
    },
    {
      day: "Martes",
      intervals: [
        { from: "07:00", to: "12:00" },
        { from: "14:00", to: "21:00" },
      ],
    },
    {
      day: "Miércoles",
      intervals: [
        { from: "07:00", to: "12:00" },
        { from: "14:00", to: "21:00" },
      ],
    },
    {
      day: "Jueves",
      intervals: [
        { from: "07:00", to: "12:00" },
        { from: "14:00", to: "21:00" },
      ],
    },
    {
      day: "Viernes",
      intervals: [
        { from: "07:00", to: "12:00" },
        { from: "14:00", to: "21:00" },
      ],
    },
    { day: "Sábado", intervals: [{ from: "08:00", to: "14:00" }] },
    { day: "Domingo", intervals: [] }, // Closed
  ]);

  // 6. Reservation Cancellation Policy State (cancellation limit in hours)
  const [cancellationPolicyHours, setCancellationPolicyHours] = useState(2);

  // 7. Branches / Sedes list
  const [branchesList, setBranchesList] = useState<
    {
      id: string;
      name: string;
      address: string;
      manager?: string;
      lat?: number;
      lng?: number;
      creditCostMultiplier?: number;
    }[]
  >([
    {
      id: "matriz",
      name: "Studio Central (Sede Única)",
      address: "Av. Santa Fe 3200, Palermo, CABA",
      manager: "Alan Kraft",
      lat: -34.5889,
      lng: -58.4105,
      creditCostMultiplier: 1.0,
    },
  ]);
  const [selectedBranchId, setSelectedBranchId] = useState("matriz");

  // 7. Classes List
  const [classesList, setClassesList] = useState<
    {
      id: string;
      name: string;
      staffId: string;
      time: string;
      capacity: number;
      booked: number;
      enrolledSpots: { [spotIndex: number]: string };
      branchId?: string;
      salaId?: string;
      day: number;
      creditsCost?: number;
      layout?: boolean[];
      attendance?: { [spotIndex: number]: "presente" | "ausente" | "pendiente" };
      waitlist?: string[];
      releasedSpots?: { [spotIndex: number]: { originalStudent: string; creditsCost: number } };
      status?: "activa" | "cancelada";
      weekOffset?: number;
      ratings?: { [studentName: string]: { stars: number; comment?: string } };
      blocks?: any[];
    }[]
  >([
    // Belgrano (branchId: "1")
    {
      id: "1",
      name: "CrossFit WOD",
      staffId: "1",
      time: "08:00 - 09:30",
      capacity: 15,
      booked: 3,
      enrolledSpots: { 0: "Agustín Gómez", 1: "Marcos López", 2: "Tomás Ruiz" },
      branchId: "1",
      salaId: "s4",
      day: 0,
      creditsCost: 2,
      layout: Array(100)
        .fill(false)
        .map((_, i) => i < 15),
      blocks: [
        {
          id: "b1",
          type: "warmup",
          title: "Calentamiento Articular & Cardio",
          subtitle: "3 Rondas - 8 min Cap",
          description: "- 200m Running / Remadora\n- 10 Pass-throughs con PVC\n- 15 Air Squats\n- 30s Plank Isométrico",
          timeCap: "8 min",
        },
        {
          id: "b2",
          type: "strength",
          title: "Trabajo de Fuerza: Back Squat",
          subtitle: "5 Series x 5 Repeticiones",
          description: "Trabajar a 75-80% de 1RM\nDescanso: 2 min entre cada serie\nEnfocarse en la profundidad y estabilidad del torso",
          timeCap: "18 min",
        },
        {
          id: "b3",
          type: "main",
          title: "WOD Principal: 'Helen Modified'",
          subtitle: "3 Rondas por Tiempo (For Time)",
          description: "- 400m Run\n- 21 Kettlebell Swings (24kg / 16kg)\n- 12 Pull-ups / Dominadas",
          timeCap: "14 min",
        },
        {
          id: "b4",
          type: "cooldown",
          title: "Vuelta a la Calma & Estiramientos",
          subtitle: "Recuperación Pasiva",
          description: "- 3 min Couch Stretch (Isquios y Psoas)\n- Movilidad pasiva de hombros con banda",
          timeCap: "5 min",
        },
      ],
    },
    {
      id: "1b",
      name: "CrossFit WOD",
      staffId: "1",
      time: "10:00 - 11:30",
      capacity: 15,
      booked: 2,
      enrolledSpots: { 0: "Agustín Gómez", 1: "Lucas Torres" },
      branchId: "1",
      salaId: "s4",
      day: 0,
      creditsCost: 2,
      layout: Array(100)
        .fill(false)
        .map((_, i) => i < 15),
    },
    {
      id: "1c",
      name: "CrossFit WOD",
      staffId: "1",
      time: "08:00 - 09:30",
      capacity: 15,
      booked: 0,
      enrolledSpots: {},
      branchId: "1",
      salaId: "s4",
      day: 2,
      creditsCost: 2,
      layout: Array(100)
        .fill(false)
        .map((_, i) => i < 15),
    },
    {
      id: "1d",
      name: "Spinning Pro",
      staffId: "3",
      time: "09:00 - 10:00",
      capacity: 15,
      booked: 0,
      enrolledSpots: {},
      branchId: "1",
      salaId: "s5",
      day: 1,
      creditsCost: 1,
      layout: Array(100)
        .fill(false)
        .map((_, i) => i < 15),
    },
    {
      id: "1e",
      name: "Spinning Pro",
      staffId: "3",
      time: "18:30 - 19:30",
      capacity: 15,
      booked: 0,
      enrolledSpots: {},
      branchId: "1",
      salaId: "s5",
      day: 3,
      creditsCost: 1,
      layout: Array(100)
        .fill(false)
        .map((_, i) => i < 15),
    },

    // Las Cañitas (branchId: "2")
    {
      id: "2",
      name: "Yoga Ashtanga",
      staffId: "2",
      time: "09:30 - 10:45",
      capacity: 10,
      booked: 2,
      enrolledSpots: { 0: "Paula Cáceres", 1: "Sofía Martínez" },
      branchId: "2",
      salaId: "s6",
      day: 1,
      creditsCost: 1,
      layout: Array(100)
        .fill(false)
        .map((_, i) => i < 10),
    },
    {
      id: "2b",
      name: "Yoga Vinyasa",
      staffId: "2",
      time: "11:00 - 12:15",
      capacity: 12,
      booked: 0,
      enrolledSpots: {},
      branchId: "2",
      salaId: "s6",
      day: 3,
      creditsCost: 1,
      layout: Array(100)
        .fill(false)
        .map((_, i) => i < 12),
    },
    {
      id: "2c",
      name: "Funcional HIIT",
      staffId: "3",
      time: "09:00 - 10:00",
      capacity: 18,
      booked: 0,
      enrolledSpots: {},
      branchId: "2",
      salaId: "s7",
      day: 4,
      creditsCost: 1,
      layout: Array(100)
        .fill(false)
        .map((_, i) => i < 18),
    },
    {
      id: "2d",
      name: "Pilates Reformer",
      staffId: "2",
      time: "10:00 - 11:00",
      capacity: 12,
      booked: 0,
      enrolledSpots: {},
      branchId: "2",
      salaId: "s6",
      day: 6,
      creditsCost: 1,
      layout: Array(100)
        .fill(false)
        .map((_, i) => i < 12),
    },

    // Palermo / Matriz (branchId: undefined / "matriz")
    {
      id: "ejemplo",
      name: "Spinning Pro",
      staffId: "3",
      time: "19:00 - 20:00",
      capacity: 15,
      booked: 6,
      enrolledSpots: {
        0: "Agustín Gómez",
        2: "Camila Díaz",
        4: "Marcos López",
        6: "Tomás Ruiz",
        8: "Lucas Torres",
        10: "Paula Cáceres",
      },
      branchId: undefined,
      salaId: "s2",
      day: 0,
      creditsCost: 2,
      layout: Array(100)
        .fill(false)
        .map((_, i) => i < 15),
      attendance: {
        0: "presente",
        2: "presente",
        4: "presente",
        6: "presente",
        8: "ausente",
        10: "presente",
      },
      ratings: {
        "Agustín Gómez": { stars: 5, comment: "Clase increíble, excelente ritmo" },
        "Camila Díaz": { stars: 4, comment: "Muy buena, me gustó el calentamiento" },
        "Marcos López": { stars: 3 },
        "Paula Cáceres": { stars: 5, comment: "Lo mejor de la semana 🔥" },
      },
      waitlist: ["Sofía Martínez", "Pedro Giménez", "María del Mar"],
    },
    {
      id: "3",
      name: "Entrenamiento Funcional",
      staffId: "3",
      time: "18:00 - 19:15",
      capacity: 15,
      booked: 2,
      enrolledSpots: { 0: "Pedro Giménez", 1: "María del Mar" },
      branchId: undefined,
      salaId: "s1",
      day: 2,
      creditsCost: 1,
      layout: Array(100)
        .fill(false)
        .map((_, i) => i < 15),
      attendance: { 0: "presente", 1: "presente" },
      ratings: { "Pedro Giménez": { stars: 4, comment: "Muy completo" } },
    },
    {
      id: "3b",
      name: "Fuerza de Potencia",
      staffId: "1",
      time: "11:00 - 12:30",
      capacity: 20,
      booked: 0,
      enrolledSpots: {},
      branchId: undefined,
      salaId: "s1",
      day: 1,
      creditsCost: 2,
      layout: Array(100)
        .fill(false)
        .map((_, i) => i < 20),
    },
    {
      id: "3c",
      name: "Box CrossFit",
      staffId: "1",
      time: "09:00 - 10:15",
      capacity: 15,
      booked: 0,
      enrolledSpots: {},
      branchId: undefined,
      salaId: "s2",
      day: 0,
      creditsCost: 2,
      layout: Array(100)
        .fill(false)
        .map((_, i) => i < 15),
    },
    {
      id: "3d",
      name: "Hatha Yoga",
      staffId: "2",
      time: "12:00 - 13:00",
      capacity: 12,
      booked: 0,
      enrolledSpots: {},
      branchId: undefined,
      salaId: "s3",
      day: 4,
      creditsCost: 1,
      layout: Array(100)
        .fill(false)
        .map((_, i) => i < 12),
    },
  ]);

  // 7b. Salas List (Rooms)
  const [salasList, setSalasList] = useState<
    { id: string; name: string; capacity?: number; branchId: string; description?: string }[]
  >([
    { id: "s1", name: "Sala Fuerza", capacity: 25, branchId: "matriz" },
    { id: "s2", name: "Box CrossFit", capacity: 15, branchId: "matriz" },
    { id: "s3", name: "Estudio Yoga", capacity: 12, branchId: "matriz" },
    { id: "s4", name: "Salón Principal", capacity: 20, branchId: "1" },
    { id: "s5", name: "Sala de Spinning", capacity: 15, branchId: "1" },
    { id: "s6", name: "Sala Zen", capacity: 12, branchId: "2" },
    { id: "s7", name: "Salón Funcional", capacity: 18, branchId: "2" },
  ]);

  // 8. Memberships List
  const [membershipsList, setMembershipsList] = useState([
    {
      id: "1",
      name: "Pase Libre",
      price: 18900,
      duration: "Mensual",
      activeCount: 142,
      includedServices: ["vestuarios", "duchas", "lockers", "wifi"],
    },
    {
      id: "2",
      name: "Performance",
      price: 28500,
      duration: "Mensual",
      activeCount: 68,
      includedServices: ["vestuarios", "duchas", "lockers", "wifi", "parking"],
    },
    {
      id: "3",
      name: "Elite Coached",
      price: 42000,
      duration: "Mensual",
      activeCount: 12,
      includedServices: ["vestuarios", "duchas", "lockers", "wifi", "parking", "sauna"],
    },
  ]);

  // 9. Blackout Days (Días de Cierre)
  const [blackoutDays, setBlackoutDays] = useState<{ id: string; date: string; reason: string }[]>([
    { id: "1", date: "2026-06-29", reason: "Feriado Nacional (Día de Prueba)" },
  ]);

  // 10. No-Show & Late Cancel Penalties State
  const [penaltySettings, setPenaltySettings] = useState({
    enabled: true,
    type: "deduct_credit", // "deduct_credit" | "block_reservations"
    maxAbsences: 2,
  });

  // 11. Trial Class Config & Requests
  const [trialClassSettings, setTrialClassSettings] = useState({
    enabled: true,
    price: 0,
    description: "Clase introductoria para evaluar nivel y conocer las instalaciones.",
  });

  const [trialRequests, setTrialRequests] = useState([
    {
      id: "tr1",
      name: "Lucas Ramírez",
      email: "lucas@example.com",
      phone: "+549114321000",
      classId: "1",
      date: "2026-06-30",
      status: "pending",
    },
    {
      id: "tr2",
      name: "Martina Soler",
      email: "martina@example.com",
      phone: "+549114321001",
      classId: "2",
      date: "2026-06-30",
      status: "approved",
    },
    {
      id: "tr3",
      name: "Gonzalo Gil",
      email: "gonzalo@example.com",
      phone: "+549114321002",
      classId: "3",
      date: "2026-06-29",
      status: "converted",
    },
    {
      id: "tr4",
      name: "Julieta Vargas",
      email: "julieta@example.com",
      phone: "+549114321003",
      classId: "1",
      date: "2026-06-28",
      status: "no_show",
    },
    {
      id: "tr5",
      name: "Tomás Blanco",
      email: "tomas@example.com",
      phone: "+549114321004",
      classId: "2",
      date: "2026-06-28",
      status: "attended_no_buy",
    },
  ]);

  const [membersList, setMembersList] = useState<any[]>([
    {
      name: "Agustín Gómez",
      phone: "+54 9 11 3242-1241",
      email: "agustin@email.com",
      plan: "Pase Libre",
      end: "2026-07-20",
      status: "activo",
      color: "text-primary bg-primary/",
      photo:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80",
      hasApto: "Entregado",
      aptoExp: "2027-05-15",
      medicalNotes:
        "Lesión leve en rodilla izquierda. Evitar sentadillas profundas sin supervisión.",
      aptoDocUrl: "",
      debtAmount: 0,
      payments: [
        {
          id: "pay_1",
          date: "2026-06-20",
          amount: 18000,
          method: "MercadoPago",
          duration: "1 Mes",
        },
        {
          id: "pay_2",
          date: "2026-05-20",
          amount: 18000,
          method: "MercadoPago",
          duration: "1 Mes",
        },
      ],
    },
    {
      name: "Camila Díaz",
      phone: "+54 9 11 4124-5124",
      email: "camila@email.com",
      plan: "Performance",
      end: "2026-07-01",
      status: "pendiente",
      color: "text-secondary-foreground bg-secondary/",
      photo:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80",
      hasApto: "Pendiente",
      aptoExp: "",
      medicalNotes: "Asmática. Lleva siempre el inhalador.",
      aptoDocUrl: "",
      debtAmount: 28500,
      payments: [],
    },
    {
      name: "Marcos López",
      phone: "+54 9 11 2341-2412",
      email: "marcos@email.com",
      plan: "Pase Libre",
      end: "2026-06-15",
      status: "vencido",
      color: "text-destructive bg-destructive/",
      photo:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80",
      hasApto: "Entregado",
      aptoExp: "2027-02-10",
      medicalNotes: "",
      aptoDocUrl: "",
      debtAmount: 37800,
      payments: [
        { id: "pay_3", date: "2026-05-15", amount: 18000, method: "Efectivo", duration: "1 Mes" },
      ],
    },
    {
      name: "Tomás Ruiz",
      phone: "+54 9 11 5122-1234",
      email: "tomas@email.com",
      plan: "Performance",
      end: "2026-07-30",
      status: "activo",
      color: "text-primary bg-primary/",
      photo:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80",
      hasApto: "Pendiente",
      aptoExp: "",
      medicalNotes: "",
      aptoDocUrl: "",
      debtAmount: 0,
      payments: [
        {
          id: "pay_4",
          date: "2026-06-30",
          amount: 15000,
          method: "Transferencia Bancaria",
          duration: "1 Mes",
        },
      ],
    },
    {
      name: "Lucas Torres",
      phone: "+54 9 11 4124-1111",
      email: "lucas@email.com",
      plan: "Performance",
      end: "2026-07-10",
      status: "activo",
      color: "text-primary bg-primary/",
      photo:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80",
      hasApto: "Entregado",
      aptoExp: "2026-12-20",
      medicalNotes: "Hipertenso bajo control farmacológico.",
      aptoDocUrl: "",
      debtAmount: 0,
      payments: [
        {
          id: "pay_5",
          date: "2026-06-10",
          amount: 15000,
          method: "Transferencia Bancaria",
          duration: "1 Mes",
        },
      ],
    },
    {
      name: "Paula Cáceres",
      phone: "+54 9 11 2344-9999",
      email: "paula@email.com",
      plan: "Pase Libre",
      end: "2026-07-25",
      status: "activo",
      color: "text-primary bg-primary/",
      photo:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80",
      hasApto: "Vencido",
      aptoExp: "2026-06-10",
      medicalNotes: "",
      aptoDocUrl: "",
      debtAmount: 0,
      payments: [
        { id: "pay_6", date: "2026-06-25", amount: 18000, method: "Efectivo", duration: "1 Mes" },
      ],
    },
  ]);

  const [otpInput, setOtpInput] = useState("");
  interface Protocol {
    id: string;
    title: string;
    role: string;
    time: string;
    items: string[];
  }

  const [protocols, setProtocols] = useState<Protocol[]>([
    {
      id: "1",
      title: "Protocolo de Apertura",
      role: "receptionist",
      time: "Mañana",
      items: [
        "Encender luces principales",
        "Verificar caja chica",
        "Encender música",
        "Desactivar alarma",
      ],
    },
    {
      id: "2",
      title: "Limpieza de Salón",
      role: "coach",
      time: "Antes de cada clase",
      items: ["Acomodar colchonetas", "Verificar sonido", "Ventilar salón"],
    },
    {
      id: "3",
      title: "Cierre de Local",
      role: "manager",
      time: "Noche",
      items: ["Revisar candados", "Activar alarma", "Apagar servidores", "Cerrar sistema de pagos"],
    },
  ]);
  const [completedProtocols, setCompletedProtocols] = useState<
    Record<string, { savedBy: string; savedTime: string }>
  >({});
  const [protocolItemChecks, setProtocolItemChecks] = useState<Record<string, boolean>>({});
  const [isChecklistVisible, setIsChecklistVisible] = useState(true);
  const [checklistLogs, setChecklistLogs] = useState([
    {
      id: "log-1",
      date: "2026-07-01",
      time: "08:15",
      protocolTitle: "Protocolo de Apertura",
      staffName: "Camila Díaz",
      role: "receptionist",
      itemsCount: 4,
    },
    {
      id: "log-2",
      date: "2026-06-30",
      time: "22:05",
      protocolTitle: "Cierre de Local",
      staffName: "Marcos Pérez",
      role: "manager",
      itemsCount: 4,
    },
  ]);
  const [reviewsList, setReviewsList] = useState([
    {
      id: "rev-1",
      date: "2026-07-01",
      studentName: "Agustín Gómez",
      studentPhoto:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80",
      rating: 5,
      className: "Crossfit",
      coachName: "Mateo Rossi",
      comment:
        "Excelente clase, el coach Mateo me ayudó mucho a corregir la técnica de sentadillas. ¡Muy recomendado!",
      featured: true,
      reply: "",
      verificationType: "app_payment" as const,
    },
    {
      id: "rev-2",
      date: "2026-06-30",
      studentName: "Juan Pérez",
      studentPhoto:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80",
      rating: 4,
      className: "Spinning",
      coachName: "Camila Díaz",
      comment:
        "La música estuvo genial, la intensidad perfecta. Los vestuarios podrían estar un poco más ordenados al mediodía.",
      featured: false,
      reply:
        "Hola Juan! Gracias por tu feedback. Ya coordinamos con Recepción para intensificar la limpieza a esa hora.",
      verificationType: "attendance" as const,
    },
    {
      id: "rev-3",
      date: "2026-06-29",
      studentName: "Paula Cáceres",
      studentPhoto:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80",
      rating: 5,
      className: "Yoga",
      coachName: "Elena Gómez",
      comment:
        "La clase de yoga es un cable a tierra hermoso. La sala Belgrano tiene muy buena iluminación natural.",
      featured: true,
      reply: "",
      verificationType: "app_payment" as const,
    },
  ]);

  // Financial: Cash register transactions
  const [cashTransactions, setCashTransactions] = useState<
    {
      id: string;
      date: string;
      type: "income" | "expense";
      channel: "cash" | "transfer" | "app" | "payroll";
      description: string;
      amount: number;
      registeredBy: string;
    }[]
  >([
    {
      id: "tx-1",
      date: "2026-07-02",
      type: "income",
      channel: "app",
      description: "Pago Membresía Mensual - Agustín Gómez",
      amount: 15000,
      registeredBy: "Sistema",
    },
    {
      id: "tx-2",
      date: "2026-07-02",
      type: "income",
      channel: "cash",
      description: "Pase diario en efectivo - Visitante",
      amount: 3000,
      registeredBy: "Camila Díaz",
    },
    {
      id: "tx-3",
      date: "2026-07-02",
      type: "income",
      channel: "transfer",
      description: "Pago Membresía Trimestral - Paula Cáceres",
      amount: 38000,
      registeredBy: "Camila Díaz",
    },
    {
      id: "tx-4",
      date: "2026-07-01",
      type: "income",
      channel: "app",
      description: "Pago Membresía Mensual - Marcos López",
      amount: 15000,
      registeredBy: "Sistema",
    },
    {
      id: "tx-5",
      date: "2026-07-01",
      type: "expense",
      channel: "cash",
      description: "Limpieza e insumos de limpieza",
      amount: 5500,
      registeredBy: "Marcos Pérez",
    },
    {
      id: "tx-6",
      date: "2026-06-30",
      type: "income",
      channel: "app",
      description: "Pago Membresía Mensual - Lucía Fernández",
      amount: 15000,
      registeredBy: "Sistema",
    },
    {
      id: "tx-7",
      date: "2026-06-30",
      type: "expense",
      channel: "cash",
      description: "Reposición suplementos / proteínas",
      amount: 12000,
      registeredBy: "Marcos Pérez",
    },
  ]);

  // Financial: Payroll liquidation records
  const [payrollRecords, setPayrollRecords] = useState<
    {
      id: string;
      staffId: string;
      period: string;
      classesGiven: number;
      studentsAttended: number;
      totalAmount: number;
      status: "pending" | "paid";
      paidAt?: string;
    }[]
  >([
    {
      id: "pay-1",
      staffId: "1",
      period: "Junio 2026",
      classesGiven: 18,
      studentsAttended: 210,
      totalAmount: 159000,
      status: "paid",
      paidAt: "15/06/2026",
    },
  ]);

  const [inventoryItems, setInventoryItems] = useState([
    {
      id: "inv-1",
      name: "Bebida Isotónica Gatorade 500ml",
      category: "Bebidas",
      price: 2500,
      cost: 1200,
      stock: 48,
      minStock: 15,
      unit: "unidades",
      barcode: "7791234567890",
      image: "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "inv-2",
      name: "Proteína Whey Protein Isolate 1kg",
      category: "Suplementos",
      price: 38000,
      cost: 24000,
      stock: 8,
      minStock: 10,
      unit: "potes",
      barcode: "7798765432109",
      image: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "inv-3",
      name: "Barra Proteica ENA Choco Crunch",
      category: "Snacks",
      price: 3200,
      cost: 1600,
      stock: 65,
      minStock: 20,
      unit: "unidades",
      barcode: "7795555444333",
      image: "https://images.unsplash.com/photo-1622484210800-88554284814e?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "inv-4",
      name: "Toalla Secado Rápido Shakerfy",
      category: "Merchandising",
      price: 14500,
      cost: 7000,
      stock: 14,
      minStock: 5,
      unit: "unidades",
      barcode: "7790001000200",
      image: "https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "inv-5",
      name: "Botella Shakerfy Pro 750ml",
      category: "Merchandising",
      price: 9800,
      cost: 4500,
      stock: 22,
      minStock: 8,
      unit: "unidades",
      barcode: "7799999888777",
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "inv-6",
      name: "Cintas de Suspensión Pro-Gym",
      category: "Equipamiento",
      price: 45000,
      cost: 28000,
      stock: 4,
      minStock: 3,
      unit: "unidades",
      barcode: "7793333222111",
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=150&auto=format&fit=crop&q=80",
    },
  ]);

  const pendingSubstitutionsCount = useMemo(() => {
    return classesList.filter((c: any) => c.seekingBackup).length;
  }, [classesList]);

  const visibleClasses = classesList;
  const visibleTabs = TABS;

  const handleLogout = () => {
    navigate({ to: "/auth/gym" });
  };

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-background text-foreground flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-card border-b md:border-b-0 md:border-r border-border p-6 flex flex-col h-auto md:h-screen sticky top-0 z-30 shrink-0">
        <div className="flex items-center justify-center mb-8 relative w-full">
          <Link
            to="/"
            className="text-2xl sm:text-3xl font-bebas tracking-widest text-foreground uppercase select-none hover:opacity-90 transition text-center"
          >
            Shakerfy
          </Link>
          <button
            onClick={handleLogout}
            className="md:hidden absolute right-0 p-2 rounded-xl text-destructive hover:bg-destructive/10 transition"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 flex flex-col gap-1.5 overflow-y-auto pr-2 pb-6 [&::-webkit-scrollbar]:hidden">
          {visibleTabs.map((tab) => {
            const Icon = tab.icon;
            const hasSubstitutionsBadge = tab.id === "clases" && pendingSubstitutionsCount > 0;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  activeTab === tab.id
                    ? "bg-secondary text-foreground font-bold border border-border/80 shadow-2xs"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${activeTab === tab.id ? "text-primary" : "text-muted-foreground"}`} />
                <span className="truncate">{tab.label}</span>
                {hasSubstitutionsBadge && (
                  <span className="ml-auto bg-primary/10 text-primary font-extrabold text-[9px] px-2 py-0.5 rounded-full shrink-0 animate-pulse uppercase tracking-wider border border-primary/20">
                    {pendingSubstitutionsCount} suplencia
                    {pendingSubstitutionsCount > 1 ? "s" : ""}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile Info in Sidebar */}
        <div className="pt-4 border-t border-border/60 mt-auto mb-2 flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Admin"
              className="h-9 w-9 rounded-full border border-border/60 object-cover shrink-0"
            />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-foreground truncate">
                {currentUser.name || "Alan Kraft"}
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider truncate">
                Administrador
              </span>
            </div>
          </div>
          <ThemeToggle variant="outline" size="icon" />
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Cerrar sesión</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 w-full max-w-7xl mx-auto overflow-x-auto min-w-0">

        {currentUser.role === "coach" && pendingSubstitutionsCount > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-secondary/35 border border-border text-xs flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-secondary/ text-secondary-foreground shrink-0">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="font-extrabold text-foreground text-sm">
                  🟡 ¡Hay suplencias disponibles en la bolsa!
                </div>
                <div className="text-muted-foreground mt-0.5 font-medium">
                  Hay {pendingSubstitutionsCount} clase{pendingSubstitutionsCount > 1 ? "s" : ""}{" "}
                  esperando un profesor suplente. Puedes revisarlas y tomarlas desde la agenda.
                </div>
              </div>
            </div>
            <Button
              size="sm"
              className="rounded-xl font-bold bg-secondary text-white hover:bg-secondary shrink-0 text-[11px]"
              onClick={() => setActiveTab("clases")}
            >
              Ver Agenda
            </Button>
          </div>
        )}

        {/* Staff Operations Checklist (Mejora 4) */}


        {activeTab === "asistencia" && (
          <AsistenciasTab
            selectedBranchId={selectedBranchId}
            blackoutDays={blackoutDays}
            membersList={membersList}
            classesList={classesList}
            setClassesList={setClassesList}
          />
        )}
        {activeTab === "miembros" && (
          <MiembrosTab
            classesList={classesList}
            membersList={membersList}
            setMembersList={setMembersList}
            membershipsList={membershipsList}
            setCashTransactions={setCashTransactions}
            currentUser={currentUser}
          />
        )}
        {activeTab === "membresias" && (
          <MembresiasTab
            membershipsList={membershipsList}
            setMembershipsList={setMembershipsList}
            amenities={amenities}
            branchesList={branchesList}
          />
        )}

        {activeTab === "clases" && (
          <ClasesTab
            classesList={visibleClasses}
            setClassesList={setClassesList}
            staffList={staffList}
            canManageClasses={currentUser.role === "superadmin" || currentUser.role === "manager" || currentUser.role === "admin"}
            blackoutDays={blackoutDays}
            salasList={salasList}
            branchesList={branchesList}
            selectedBranchId={selectedBranchId}
            cancellationPolicyHours={cancellationPolicyHours}
            currentUser={currentUser}
            membersList={membersList}
          />
        )}
        {activeTab === "reseñas" && (
          <ReseñasTab reviewsList={reviewsList as any} setReviewsList={setReviewsList as any} />
        )}
        {activeTab === "caja" && (
          <CajaTab
            cashTransactions={cashTransactions}
            setCashTransactions={setCashTransactions}
            currentUser={currentUser}
            inventoryItems={inventoryItems}
            setInventoryItems={setInventoryItems}
            membersList={membersList}
          />
        )}
        {activeTab === "finanzas" && (
          <FinanzasTab
            payrollRecords={payrollRecords}
            setPayrollRecords={setPayrollRecords}
            staffList={staffList}
            cashTransactions={cashTransactions}
            setCashTransactions={setCashTransactions}
            classesList={classesList}
          />
        )}
        {activeTab === "reportes" && (
          <ReportesTab
            membersList={membersList}
            classesList={classesList}
            membershipsList={membershipsList}
            staffList={staffList}
            salasList={salasList}
            cashTransactions={cashTransactions}
          />
        )}
        {activeTab === "inventario" && (
          <InventarioTab
            inventoryItems={inventoryItems}
            setInventoryItems={setInventoryItems}
          />
        )}


        {activeTab === "config" && (
          <ConfigTab
            selectedBranchId={selectedBranchId}
            staffList={staffList as any}
            setStaffList={setStaffList as any}
            amenities={amenities}
            setAmenities={setAmenities}
            requirements={requirements}
            setRequirements={setRequirements}
            equipment={equipment as any}
            setEquipment={setEquipment as any}
            gymPhotos={gymPhotos}
            setGymPhotos={setGymPhotos}
            weeklyHours={weeklyHours}
            setWeeklyHours={setWeeklyHours}
            cancellationPolicyHours={cancellationPolicyHours}
            setCancellationPolicyHours={setCancellationPolicyHours}
            branchesList={branchesList}
            setBranchesList={setBranchesList}
            blackoutDays={blackoutDays}
            setBlackoutDays={setBlackoutDays}
            penaltySettings={penaltySettings}
            setPenaltySettings={setPenaltySettings}
            salasList={salasList}
            setSalasList={setSalasList}
            protocols={protocols}
            setProtocols={setProtocols}
            checklistLogs={checklistLogs}
            setChecklistLogs={setChecklistLogs}
          />
        )}
      </main>


    </div>
  );
}

interface Review {
  id: string;
  date: string;
  studentName: string;
  studentPhoto: string;
  rating: number;
  className: string;
  coachName: string;
  comment: string;
  featured: boolean;
  reply: string;
  reported?: boolean;
  reportReason?: string;
  verificationType?: "app_payment" | "attendance" | "normal";
}

interface GymFacilityReview {
  id: string;
  date: string;
  studentName: string;
  studentPhoto: string;
  ratingCleanliness: number;
  ratingEquipment: number;
  ratingStaff: number;
  ratingPrice: number;
  overallRating: number;
  comment: string;
  reply: string;
  reported?: boolean;
  reportReason?: string;
}

function CajaTab({
  cashTransactions,
  setCashTransactions,
  currentUser,
  inventoryItems,
  setInventoryItems,
  membersList,
}: {
  cashTransactions: any[];
  setCashTransactions: React.Dispatch<React.SetStateAction<any[]>>;
  currentUser: CurrentUser;
  inventoryItems: any[];
  setInventoryItems: React.Dispatch<React.SetStateAction<any[]>>;
  membersList: any[];
}) {
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [showAddTx, setShowAddTx] = useState(false);
  const [showArqueo, setShowArqueo] = useState(false);
  const [countedCash, setCountedCash] = useState("");
  
  const [posMode, setPosMode] = useState<"custom" | "store">("custom");
  const [selectedProdId, setSelectedProdId] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [prodQuantity, setProdQuantity] = useState<number>(1);

  const [txType, setTxType] = useState<"income" | "expense">("income");
  const [txChannel, setTxChannel] = useState<"cash" | "transfer" | "app" | "split">("cash");
  const [splitCashAmount, setSplitCashAmount] = useState("");
  const [splitDigitalAmount, setSplitDigitalAmount] = useState("");
  const [splitDigitalChannel, setSplitDigitalChannel] = useState<"app" | "transfer">("app");
  const [txDesc, setTxDesc] = useState("");
  const [txAmount, setTxAmount] = useState("");

  // Cash in register calculations
  const totalIncome = cashTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = cashTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const totalCashIncome = cashTransactions
    .filter((t) => t.type === "income" && t.channel === "cash")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalCashExpense = cashTransactions
    .filter((t) => t.type === "expense" && t.channel === "cash")
    .reduce((sum, t) => sum + t.amount, 0);

  const expectedCashInDrawer = totalCashIncome - totalCashExpense;

  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [channelFilter, setChannelFilter] = useState<"all" | "cash" | "app" | "transfer">("all");

  const todayStr = new Date().toISOString().split("T")[0];

  const filteredTx = cashTransactions.filter((t) => {
    // 1. Tipo (Ingreso / Egreso)
    if (filterType !== "all" && t.type !== filterType) return false;

    // 2. Canal de Pago
    if (channelFilter !== "all" && t.channel !== channelFilter) return false;

    // 3. Buscador por texto
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      const matchDesc = t.description.toLowerCase().includes(q);
      const matchUser = t.registeredBy.toLowerCase().includes(q);
      if (!matchDesc && !matchUser) return false;
    }

    // 4. Rango de Fechas
    if (dateFilter === "today") {
      return t.date === todayStr;
    } else if (dateFilter === "week") {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      return t.date >= weekAgo;
    } else if (dateFilter === "month") {
      const monthPrefix = todayStr.substring(0, 7);
      return t.date.startsWith(monthPrefix);
    }

    return true;
  });

  const handleProductSelect = (prodId: string, qty: number = prodQuantity) => {
    setSelectedProdId(prodId);
    const prod = inventoryItems.find((i) => i.id === prodId);
    if (prod) {
      const validQty = Math.max(1, Math.min(qty, prod.stock > 0 ? prod.stock : 1));
      setProdQuantity(validQty);
      setTxDesc(`Venta Tienda: ${prod.name}${validQty > 1 ? ` x${validQty}` : ""}`);
      setTxAmount((prod.price * validQty).toString());
    } else {
      setTxDesc("");
      setTxAmount("");
    }
  };

  const exportTransactionsCSV = () => {
    if (filteredTx.length === 0) {
      toast.warning("No hay transacciones para exportar.");
      return;
    }
    const headers = ["ID", "Fecha", "Tipo", "Canal", "Concepto", "Monto", "Registrado Por"];
    const rows = filteredTx.map((t) => [
      t.id,
      t.date,
      t.type === "income" ? "Ingreso" : "Egreso",
      t.channel,
      `"${t.description.replace(/"/g, '""')}"`,
      t.amount,
      `"${t.registeredBy.replace(/"/g, '""')}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `movimientos_caja_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-card border border-border/80 p-5 rounded-3xl space-y-1 shadow-xs transition-all hover:-translate-y-1 hover:shadow-lg">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
            Ingresos en Caja (Turno)
          </span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <ArrowUpRight className="h-5 w-5" /> ${totalIncome.toLocaleString()}
          </div>
          <p className="text-[10.5px] text-muted-foreground">Efectivo, MercadoPago y Transferencias</p>
        </div>

        <div className="bg-card border border-border/80 p-5 rounded-3xl space-y-1 shadow-xs transition-all hover:-translate-y-1 hover:shadow-lg">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
            Egresos & Gastos Menores
          </span>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 flex items-center gap-1">
            <ArrowDownRight className="h-5 w-5" /> ${totalExpense.toLocaleString()}
          </div>
          <p className="text-[10.5px] text-muted-foreground">Insumos de limpieza, suplementos y gastos</p>
        </div>

        <div className="bg-card border border-border/80 p-5 rounded-3xl space-y-1 shadow-xs transition-all hover:-translate-y-1 hover:shadow-lg">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
            Efectivo Esperado en Cajón
          </span>
          <div className="text-2xl font-black text-primary flex items-center gap-1">
            <Wallet className="h-5 w-5" /> ${expectedCashInDrawer.toLocaleString()}
          </div>
          <p className="text-[10.5px] text-muted-foreground">Efectivo para Arqueo de Turno</p>
        </div>
      </div>

      {/* Control Bar & POS Action Form */}
      <div className="bg-card border border-border/80 p-6 rounded-3xl space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/40">
          <div>
            <h3 className="font-bold text-sm text-foreground">Registro de Movimientos de Caja & POS</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Registra cobros de pases diarios en mostrador, ventas de suplementos o gastos operativos.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 shrink-0">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={exportTransactionsCSV}
              className="rounded-xl font-bold text-xs gap-1.5 border-border text-foreground hover:bg-secondary"
            >
              <Download className="h-4 w-4" /> Exportar CSV
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setShowArqueo(true)}
              className="rounded-xl font-bold text-xs gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
            >
              <Receipt className="h-4 w-4" /> Arqueo & Cierre
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => setShowAddTx(!showAddTx)}
              className="rounded-xl font-bold text-xs gap-1.5 shadow-xs"
            >
              <PlusCircle className="h-4 w-4" /> {showAddTx ? "Cerrar POS" : "Nuevo Movimiento"}
            </Button>
          </div>
        </div>

        {showAddTx && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const member = membersList.find((m) => m.id === selectedMemberId);
              const baseDesc = txDesc.trim() || (posMode === "store" ? "Venta Tienda" : "Movimiento POS");
              const finalDesc = member ? `${baseDesc} (Alumno: ${member.name})` : baseDesc;

              if (txChannel === "split") {
                const cashVal = parseFloat(splitCashAmount);
                const digVal = parseFloat(splitDigitalAmount);
                if (isNaN(cashVal) || cashVal <= 0 || isNaN(digVal) || digVal <= 0) {
                  toast.error("Ingresa montos válidos para ambas partes del pago mixto (Efectivo y Digital).");
                  return;
                }
                const tx1 = {
                  id: `tx-${Date.now()}-1`,
                  date: new Date().toISOString().split("T")[0],
                  type: txType,
                  channel: "cash" as const,
                  description: `${finalDesc} [Pago Mixto - Efectivo]`,
                  amount: cashVal,
                  registeredBy: currentUser.name || "Recepción",
                };
                const tx2 = {
                  id: `tx-${Date.now()}-2`,
                  date: new Date().toISOString().split("T")[0],
                  type: txType,
                  channel: splitDigitalChannel,
                  description: `${finalDesc} [Pago Mixto - ${splitDigitalChannel === "app" ? "MercadoPago" : "Transferencia"}]`,
                  amount: digVal,
                  registeredBy: currentUser.name || "Recepción",
                };
                setCashTransactions((prev) => [tx1, tx2, ...prev]);
              } else {
                if (!txAmount || parseFloat(txAmount) <= 0) {
                  toast.error("Ingresa un monto válido y una descripción.");
                  return;
                }
                const newTx = {
                  id: `tx-${Date.now()}`,
                  date: new Date().toISOString().split("T")[0],
                  type: txType,
                  channel: txChannel,
                  description: finalDesc,
                  amount: parseFloat(txAmount),
                  registeredBy: currentUser.name || "Recepción",
                };
                setCashTransactions((prev) => [newTx, ...prev]);
              }

              // If selling inventory product, decrement stock by prodQuantity
              if (posMode === "store" && selectedProdId) {
                setInventoryItems((prev) =>
                  prev.map((item) =>
                    item.id === selectedProdId
                      ? { ...item, stock: Math.max(0, item.stock - prodQuantity) }
                      : item,
                  ),
                );
              }

              setTxDesc("");
              setTxAmount("");
              setSelectedProdId("");
              setSelectedMemberId("");
              setProdQuantity(1);
              setSplitCashAmount("");
              setSplitDigitalAmount("");
              setShowAddTx(false);
              toast.success("✓ Movimiento POS registrado y stock actualizado con éxito.");
            }}
            className="p-4 bg-secondary/20 border border-border/60 rounded-2xl space-y-4 animate-fade-in"
          >
            {/* Mode Switch: Venta de Tienda vs Concepto Libre */}
            <div className="flex items-center gap-2 pb-2 border-b border-border/40">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                Modo POS:
              </span>
              <button
                type="button"
                onClick={() => {
                  setPosMode("custom");
                  setSelectedProdId("");
                  setTxDesc("");
                  setTxAmount("");
                  setProdQuantity(1);
                }}
                className={`text-xs font-bold px-3 py-1 rounded-xl transition ${
                  posMode === "custom"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background border border-border text-muted-foreground"
                }`}
              >
                Cobro / Movimiento Libre
              </button>
              <button
                type="button"
                onClick={() => {
                  setPosMode("store");
                  setTxType("income");
                }}
                className={`text-xs font-bold px-3 py-1 rounded-xl transition ${
                  posMode === "store"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background border border-border text-muted-foreground"
                }`}
              >
                🛍️ Venta de Producto (Tienda / Inventario)
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {posMode === "store" ? (
                <>
                  <div className="sm:col-span-2">
                    <label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                      Seleccionar Producto del Inventario:
                    </label>
                    <select
                      value={selectedProdId}
                      onChange={(e) => handleProductSelect(e.target.value, prodQuantity)}
                      className="w-full h-9 rounded-xl border border-border bg-background px-2.5 text-xs font-bold text-foreground focus-visible:outline-none"
                    >
                      <option value="">-- Seleccionar Artículo --</option>
                      {inventoryItems.map((prod) => (
                        <option key={prod.id} value={prod.id} disabled={prod.stock <= 0}>
                          {prod.name} (${prod.price.toLocaleString()}) - Stock: {prod.stock} {prod.unit}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                      Cantidad:
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={prodQuantity}
                      onChange={(e) => {
                        const qty = parseInt(e.target.value) || 1;
                        if (selectedProdId) {
                          handleProductSelect(selectedProdId, qty);
                        } else {
                          setProdQuantity(qty);
                        }
                      }}
                      className="w-full h-9 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground focus-visible:outline-none"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Tipo de Movimiento:
                  </label>
                  <select
                    value={txType}
                    onChange={(e) => setTxType(e.target.value as any)}
                    className="w-full h-9 rounded-xl border border-border bg-background px-2.5 text-xs font-bold text-foreground focus-visible:outline-none"
                  >
                    <option value="income">🟢 Ingreso (Cobro / Venta)</option>
                    <option value="expense">🔴 Egreso (Gasto Operativo)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  Canal de Pago:
                </label>
                <select
                  value={txChannel}
                  onChange={(e) => setTxChannel(e.target.value as any)}
                  className="w-full h-9 rounded-xl border border-border bg-background px-2.5 text-xs font-bold text-foreground focus-visible:outline-none"
                >
                  <option value="cash">💵 Efectivo (Caja Chica)</option>
                  <option value="app">📱 MercadoPago / QR</option>
                  <option value="transfer">🏦 Transferencia Bancaria</option>
                  <option value="split">⚡ Pago Mixto (Efectivo + Digital)</option>
                </select>
              </div>

              {txChannel !== "split" && (
                <div>
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Monto Total ($):
                  </label>
                  <input
                    type="number"
                    placeholder="Ej: 3500"
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    className="w-full h-9 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground focus-visible:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  Asociar Alumno (Opcional):
                </label>
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="w-full h-9 rounded-xl border border-border bg-background px-2.5 text-xs font-bold text-foreground focus-visible:outline-none"
                >
                  <option value="">-- Cliente General / Venta Mostrador --</option>
                  {membersList.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.plan})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Split Payment Fields */}
            {txChannel === "split" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-secondary/40 border border-border/70 rounded-xl">
                <div>
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Monto en Efectivo ($):
                  </label>
                  <input
                    type="number"
                    placeholder="Ej: 2000"
                    value={splitCashAmount}
                    onChange={(e) => setSplitCashAmount(e.target.value)}
                    className="w-full h-9 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground focus-visible:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Monto Digital ($):
                  </label>
                  <input
                    type="number"
                    placeholder="Ej: 3000"
                    value={splitDigitalAmount}
                    onChange={(e) => setSplitDigitalAmount(e.target.value)}
                    className="w-full h-9 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground focus-visible:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Canal Pago Digital:
                  </label>
                  <select
                    value={splitDigitalChannel}
                    onChange={(e) => setSplitDigitalChannel(e.target.value as any)}
                    className="w-full h-9 rounded-xl border border-border bg-background px-2.5 text-xs font-bold text-foreground focus-visible:outline-none"
                  >
                    <option value="app">📱 MercadoPago / QR</option>
                    <option value="transfer">🏦 Transferencia Bancaria</option>
                  </select>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Descripción / Detalle de la Venta:
              </label>
              <input
                type="text"
                placeholder="Ej: Pase Diario Musculación o Venta suplemento"
                value={txDesc}
                onChange={(e) => setTxDesc(e.target.value)}
                className="w-full h-9 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground focus-visible:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="submit" size="sm" className="rounded-xl font-bold text-xs px-5">
                Registrar Transacción POS
              </Button>
            </div>
          </form>
        )}

        {/* Transactions Table with Structured Filters */}
        <div className="space-y-4 pt-2">
          {/* Row 1: Section Header & Search/Channel Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                Historial de Transacciones
              </span>
              <span className="px-2 py-0.5 rounded-full bg-secondary text-[10px] font-extrabold text-foreground border border-border/60">
                {filteredTx.length}
              </span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              {/* Search Bar */}
              <div className="relative flex-1 sm:w-60">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar por concepto o usuario..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-full pl-8 pr-3 rounded-xl border border-border bg-background text-xs font-bold text-foreground focus-visible:outline-none placeholder:font-normal placeholder:text-muted-foreground"
                />
              </div>

              {/* Channel Selector (Shadcn/ui Select) */}
              <Select value={channelFilter} onValueChange={(val) => setChannelFilter(val as any)}>
                <SelectTrigger className="w-[190px] h-9 rounded-xl border border-border bg-background text-xs font-bold text-foreground">
                  <SelectValue placeholder="Canal de Pago" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-border bg-popover text-popover-foreground">
                  <SelectItem value="all">💳 Todos los Canales</SelectItem>
                  <SelectItem value="cash">💵 Efectivo</SelectItem>
                  <SelectItem value="app">📱 MercadoPago / QR</SelectItem>
                  <SelectItem value="transfer">🏦 Transferencia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 2: Secondary Filter Bar (Types & Date Ranges) */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-secondary/20 border border-border/50 rounded-2xl">
            {/* Type Filter Tabs */}
            <div className="flex items-center gap-1 bg-background p-1 rounded-xl border border-border/60 shadow-xs">
              <button
                type="button"
                onClick={() => setFilterType("all")}
                className={`text-[11px] font-bold px-3 py-1 rounded-lg transition ${
                  filterType === "all"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => setFilterType("income")}
                className={`text-[11px] font-bold px-3 py-1 rounded-lg transition ${
                  filterType === "income"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Ingresos
              </button>
              <button
                type="button"
                onClick={() => setFilterType("expense")}
                className={`text-[11px] font-bold px-3 py-1 rounded-lg transition ${
                  filterType === "expense"
                    ? "bg-rose-600 text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Egresos
              </button>
            </div>

            {/* Date Filter Pills */}
            <div className="flex items-center gap-1 bg-background p-1 rounded-xl border border-border/60 shadow-xs">
              <button
                type="button"
                onClick={() => setDateFilter("all")}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition ${
                  dateFilter === "all"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Todo
              </button>
              <button
                type="button"
                onClick={() => setDateFilter("today")}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition ${
                  dateFilter === "today"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Hoy
              </button>
              <button
                type="button"
                onClick={() => setDateFilter("week")}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition ${
                  dateFilter === "week"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                7 Días
              </button>
              <button
                type="button"
                onClick={() => setDateFilter("month")}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition ${
                  dateFilter === "month"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Este Mes
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-border/60 rounded-2xl bg-background">
            <table className="w-full text-left text-xs min-w-[500px] border-collapse">
              <thead>
                <tr className="border-b border-border/60 bg-secondary/40 text-muted-foreground font-bold text-[10px] uppercase">
                  <th className="p-3">Fecha</th>
                  <th className="p-3">Concepto</th>
                  <th className="p-3">Canal</th>
                  <th className="p-3">Registrado por</th>
                  <th className="p-3 text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredTx.map((tx) => (
                  <tr key={tx.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3 text-muted-foreground font-mono text-[11px]">{tx.date}</td>
                    <td className="p-3 font-bold text-foreground">{tx.description}</td>
                    <td className="p-3">
                      <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full border bg-secondary text-foreground uppercase">
                        {tx.channel}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground text-xs">{tx.registeredBy}</td>
                    <td
                      className={`p-3 text-right font-black text-sm ${
                        tx.type === "income"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {tx.type === "income" ? "+" : "-"}${tx.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Arqueo / Cierre de Caja Modal */}
      {showArqueo && (
        <Dialog open={showArqueo} onOpenChange={setShowArqueo}>
          <DialogContent className="sm:max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Receipt className="h-5 w-5 text-primary" /> Arqueo & Cierre de Caja del Turno
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-secondary/30 border border-border/60 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-semibold">Efectivo Ingresado:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">+${totalCashIncome.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-semibold">Efectivo Retirado / Gastos:</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">-${totalCashExpense.toLocaleString()}</span>
                </div>
                <div className="border-t border-border/60 pt-2 flex justify-between items-center font-bold text-sm">
                  <span className="text-foreground">Efectivo Calculado por Sistema:</span>
                  <span className="text-primary">${expectedCashInDrawer.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase block">
                  Efectivo Físico Contado en Cajón ($):
                </label>
                <input
                  type="number"
                  placeholder={`Ej: ${expectedCashInDrawer}`}
                  value={countedCash}
                  onChange={(e) => setCountedCash(e.target.value)}
                  className="w-full h-10 rounded-xl border border-border bg-background px-3 text-sm font-bold text-foreground focus-visible:outline-none"
                />
              </div>

              {countedCash !== "" && (
                <div className="p-3.5 rounded-2xl border text-xs font-bold flex justify-between items-center bg-secondary/20 border-border/60">
                  <span>Diferencia de Caja:</span>
                  {parseFloat(countedCash) === expectedCashInDrawer ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">🟢 $0 (Caja Cuadrada OK)</span>
                  ) : parseFloat(countedCash) < expectedCashInDrawer ? (
                    <span className="text-rose-600 dark:text-rose-400 font-bold">
                      ⚠️ Faltante: -${(expectedCashInDrawer - parseFloat(countedCash)).toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      🟢 Sobrante: +${(parseFloat(countedCash) - expectedCashInDrawer).toLocaleString()}
                    </span>
                  )}
                </div>
              )}

              <DialogFooter className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 pt-3 border-t border-border/40">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowArqueo(false)}
                  className="rounded-xl text-xs font-bold"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const countedNum = parseFloat(countedCash) || expectedCashInDrawer;
                    const diff = countedNum - expectedCashInDrawer;
                    const diffText =
                      diff === 0
                        ? "Cuadrada OK"
                        : diff < 0
                          ? `Faltante -$${Math.abs(diff)}`
                          : `Sobrante +$${diff}`;
                    const csvLines = [
                      "Reporte de Arqueo y Cierre de Caja del Turno",
                      `Fecha,${new Date().toLocaleDateString()}`,
                      `Responsable,"${currentUser.name}"`,
                      `Efectivo Ingresado,$${totalCashIncome}`,
                      `Efectivo Retirado/Gastos,$${totalCashExpense}`,
                      `Efectivo Esperado,$${expectedCashInDrawer}`,
                      `Efectivo Contado,$${countedNum}`,
                      `Diferencia,${diffText}`,
                    ];
                    const csvContent = "data:text/csv;charset=utf-8," + csvLines.join("\n");
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute(
                      "download",
                      `arqueo_caja_${new Date().toISOString().split("T")[0]}.csv`,
                    );
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="rounded-xl text-xs font-bold gap-1.5 border-border text-foreground hover:bg-secondary"
                >
                  <Download className="h-3.5 w-3.5" /> Exportar Reporte
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    const countedNum = parseFloat(countedCash);
                    if (isNaN(countedNum)) {
                      toast.error("Ingresa un monto en efectivo contado válido.");
                      return;
                    }
                    const diff = countedNum - expectedCashInDrawer;
                    const diffText =
                      diff === 0
                        ? "Cuadrada OK"
                        : diff < 0
                          ? `Faltante -$${Math.abs(diff)}`
                          : `Sobrante +$${diff}`;

                    const newTx = {
                      id: `tx-${Date.now()}`,
                      date: new Date().toISOString().split("T")[0],
                      type: "expense" as const,
                      channel: "cash" as const,
                      description: `🔒 CIERRE DE CAJA TURNO (${currentUser.name}) - ${diffText}`,
                      amount: 0,
                      registeredBy: currentUser.name || "Recepción",
                    };

                    setCashTransactions((prev) => [newTx, ...prev]);
                    setShowArqueo(false);
                    setCountedCash("");
                    toast.success(`✓ Cierre de caja del turno registrado exitosamente (${diffText}).`);
                  }}
                  className="rounded-xl text-xs font-bold bg-primary text-primary-foreground"
                >
                  Confirmar Cierre de Turno
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function FinanzasTab({
  payrollRecords,
  setPayrollRecords,
  staffList,
  cashTransactions,
  setCashTransactions,
  classesList,
}: {
  payrollRecords: any[];
  setPayrollRecords: React.Dispatch<React.SetStateAction<any[]>>;
  staffList: any[];
  cashTransactions: any[];
  setCashTransactions: React.Dispatch<React.SetStateAction<any[]>>;
  classesList: any[];
}) {
  const [selectedPeriod, setSelectedPeriod] = useState("Junio 2026");
  const [activeReceipt, setActiveReceipt] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "pending">("all");

  const [fixedExpenseItems, setFixedExpenseItems] = useState([
    { id: "fix-1", category: "Alquiler de Sede", amount: 250000 },
    { id: "fix-2", category: "Luz & Energía Eléctrica", amount: 60000 },
    { id: "fix-3", category: "Agua & Servicios Sanitarios", amount: 15000 },
    { id: "fix-4", category: "Internet, Software & Servidores", amount: 25000 },
    { id: "fix-5", category: "Mantenimiento & Seguridad", amount: 30000 },
  ]);
  const [tempItems, setTempItems] = useState([...fixedExpenseItems]);
  const [newCatName, setNewCatName] = useState("");
  const [newCatAmount, setNewCatAmount] = useState("");
  const [showFixedModal, setShowFixedModal] = useState(false);

  const baseFixedExpenses = fixedExpenseItems.reduce((sum, item) => sum + (item.amount || 0), 0);
  const tempBaseFixedExpenses = tempItems.reduce((sum, item) => sum + (item.amount || 0), 0);

  const filteredPayroll = payrollRecords.filter((p) => {
    // 1. Period
    if (selectedPeriod !== "all" && p.period !== selectedPeriod) return false;

    // 2. Status
    if (statusFilter !== "all" && p.status !== statusFilter) return false;

    // 3. Search query
    const coach = staffList.find((s) => s.id === p.staffId);
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      const matchName = coach?.name?.toLowerCase().includes(q);
      const matchSpec = coach?.specialty?.toLowerCase().includes(q);
      if (!matchName && !matchSpec) return false;
    }

    return true;
  });

  const totalPayrollPaid = filteredPayroll
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.totalAmount, 0);

  const totalPayrollPending = filteredPayroll
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.totalAmount, 0);

  // Dynamic Financial Income & Expenses from Caja & POS
  const posIncome = cashTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const posExpenses = cashTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // Estimated base memberships + dynamic POS sales
  const grossMonthlyIncome = 1350000 + posIncome;
  const totalFixedAndOperatingExpenses = baseFixedExpenses + posExpenses;
  const netMonthlyMargin = grossMonthlyIncome - totalPayrollPaid - totalFixedAndOperatingExpenses;

  const handleRecalculatePayroll = () => {
    const newRecords = staffList.map((coach) => {
      const coachClasses = classesList.filter((c) => c.staffId === coach.id);
      let totalStudents = 0;

      coachClasses.forEach((c) => {
        if (c.attendance) {
          const presentCount = Object.values(c.attendance).filter((st) => st === "presente").length;
          totalStudents += presentCount;
        }
      });

      const classesCount = coachClasses.length || 12;
      const computedStudents = totalStudents || classesCount * 14;
      const baseSalary = coach.baseSalary ?? 60000;
      const payPerClass = coach.payPerClass ?? 5000;
      const payPerStudent = coach.payPerStudent ?? 300;
      const computedAmount = baseSalary + classesCount * payPerClass + computedStudents * payPerStudent;

      return {
        id: `pay-${coach.id}-${Date.now()}`,
        staffId: coach.id,
        period: selectedPeriod === "all" ? "Junio 2026" : selectedPeriod,
        classesGiven: classesCount,
        studentsAttended: computedStudents,
        totalAmount: computedAmount,
        status: "pending" as const,
      };
    });

    setPayrollRecords(newRecords);
    toast.success(`✓ Liquidaciones para el período ${selectedPeriod} recalculadas exitosamente según asistencias.`);
  };

  const exportPayrollCSV = () => {
    if (filteredPayroll.length === 0) {
      toast.warning("No hay registros de liquidación para exportar.");
      return;
    }
    const headers = ["Profesor/Coach", "Especialidad", "Período", "Clases Dictadas", "Alumnos Asistentes", "Monto Total (ARS)", "Estado", "Fecha de Pago"];
    const rows = filteredPayroll.map((p) => {
      const coach = staffList.find((s) => s.id === p.staffId);
      return [
        `"${(coach?.name || "Staff").replace(/"/g, '""')}"`,
        `"${(coach?.specialty || "-").replace(/"/g, '""')}"`,
        p.period,
        p.classesGiven,
        p.studentsAttended,
        p.totalAmount,
        p.status === "paid" ? "Pagado" : "Pendiente",
        p.paidAt || "-",
      ];
    });
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `liquidaciones_staff_${selectedPeriod.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div className="bg-card border border-border/80 p-5 rounded-3xl space-y-1 shadow-xs transition-all hover:-translate-y-1 hover:shadow-lg">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
            Ingresos Brutos (Mes Actual)
          </span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <TrendingUp className="h-5 w-5" /> ${grossMonthlyIncome.toLocaleString()}
          </div>
          <p className="text-[10.5px] text-muted-foreground">Membresías + Ventas POS de Mostrador</p>
        </div>

        <div className="bg-card border border-border/80 p-5 rounded-3xl space-y-1 shadow-xs transition-all hover:-translate-y-1 hover:shadow-lg">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
            Honorarios Staff Liquidados
          </span>
          <div className="text-2xl font-black text-foreground flex items-center gap-1">
            <Receipt className="h-5 w-5" /> ${totalPayrollPaid.toLocaleString()}
          </div>
          <p className="text-[10.5px] text-muted-foreground">Sueldos abonados a entrenadores</p>
        </div>

        <div className="bg-card border border-border/80 p-5 rounded-3xl space-y-1 shadow-xs transition-all hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
              Gastos Fijos & Operativos
            </span>
            <button
              type="button"
              onClick={() => {
                setTempItems([...fixedExpenseItems]);
                setNewCatName("");
                setNewCatAmount("");
                setShowFixedModal(true);
              }}
              className="text-[10px] font-bold text-primary hover:underline"
            >
              Ajustar Rubros
            </button>
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 flex items-center gap-1">
            <ArrowDownRight className="h-5 w-5" /> ${totalFixedAndOperatingExpenses.toLocaleString()}
          </div>
          <p className="text-[10.5px] text-muted-foreground">Alquiler, servicios + Egresos POS</p>
        </div>

        <div className="bg-card border border-border/80 p-5 rounded-3xl space-y-1 shadow-xs transition-all hover:-translate-y-1 hover:shadow-lg">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
            Margen Operativo Neto
          </span>
          <div className="text-2xl font-black text-primary flex items-center gap-1">
            <DollarSign className="h-5 w-5" /> ${netMonthlyMargin.toLocaleString()}
          </div>
          <p className="text-[10.5px] text-muted-foreground">Ingresos menos sueldos y costos fijos</p>
        </div>
      </div>

      {/* Payroll Liquidation Table with Structured 2-Row Controls */}
      <div className="bg-card border border-border/80 p-6 rounded-3xl space-y-4 shadow-xs">
        {/* Row 1: Header Title & Main Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/40">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-foreground">
                Reporte de Liquidaciones de Staff & Coaches
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-secondary text-[10px] font-extrabold text-foreground border border-border/60">
                {filteredPayroll.length}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Cálculo mensual de honorarios por clases dictadas y alumnos asistentes.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={exportPayrollCSV}
              className="h-9 rounded-xl font-bold text-xs gap-1.5 border-border text-foreground hover:bg-secondary"
            >
              <Download className="h-4 w-4" /> Exportar CSV
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={handleRecalculatePayroll}
              className="h-9 rounded-xl font-bold text-xs gap-1.5 bg-primary text-primary-foreground shadow-xs"
            >
              <Zap className="h-4 w-4" /> Recalcular Asistencias
            </Button>
          </div>
        </div>

        {/* Row 2: Secondary Filter Bar (Search + Dropdowns) */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 bg-secondary/20 border border-border/50 rounded-2xl">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[200px] sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar coach por nombre o especialidad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full pl-8 pr-3 rounded-xl border border-border bg-background text-xs font-bold text-foreground focus-visible:outline-none placeholder:font-normal placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* Status Filter (Shadcn/ui Select) */}
            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val as any)}>
              <SelectTrigger className="w-[165px] h-9 rounded-xl border border-border bg-background text-xs font-bold text-foreground">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border border-border bg-popover text-popover-foreground">
                <SelectItem value="all">📋 Todos los Estados</SelectItem>
                <SelectItem value="pending">⏳ Pendientes de Pago</SelectItem>
                <SelectItem value="paid">✅ Acreditados / Pagados</SelectItem>
              </SelectContent>
            </Select>

            {/* Period Selector (Shadcn/ui Select) */}
            <Select value={selectedPeriod} onValueChange={(val) => setSelectedPeriod(val)}>
              <SelectTrigger className="w-[155px] h-9 rounded-xl border border-border bg-background text-xs font-bold text-foreground">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border border-border bg-popover text-popover-foreground">
                <SelectItem value="Junio 2026">📅 Junio 2026</SelectItem>
                <SelectItem value="Mayo 2026">📅 Mayo 2026</SelectItem>
                <SelectItem value="all">📅 Todos los Períodos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto border border-border/60 rounded-2xl bg-background">
          <table className="w-full text-left text-xs min-w-[700px] border-collapse">
            <thead>
              <tr className="border-b border-border/60 bg-secondary/40 text-muted-foreground font-bold text-[10px] uppercase tracking-wider">
                <th className="p-3.5">Profesor / Coach</th>
                <th className="p-3.5 text-center">Período</th>
                <th className="p-3.5 text-center">Clases Dictadas</th>
                <th className="p-3.5 text-center">Alumnos Asistentes</th>
                <th className="p-3.5 text-right">Monto Total</th>
                <th className="p-3.5 text-center">Estado</th>
                <th className="p-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filteredPayroll.map((pay) => {
                const coach = staffList.find((s) => s.id === pay.staffId);
                return (
                  <tr key={pay.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 font-bold text-foreground">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border border-primary/20 shrink-0 uppercase">
                          {coach?.name ? coach.name.split(" ").map((n: string) => n[0]).join("") : "CO"}
                        </div>
                        <div className="min-w-0">
                          <span className="block font-bold text-foreground truncate">{coach?.name || "Coach Inactivo"}</span>
                          <span className="text-[10px] text-muted-foreground truncate block">{coach?.specialty || "Staff"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 text-center text-muted-foreground font-semibold">
                      <span className="px-2 py-0.5 rounded-lg bg-secondary/50 border border-border/40 text-[11px]">
                        {pay.period}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="font-bold text-foreground block">{pay.classesGiven} clases</span>
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="font-bold text-foreground block">{pay.studentsAttended} alumnos</span>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="font-black text-sm text-foreground">
                        ${pay.totalAmount.toLocaleString()}
                      </div>
                      <span className="text-[9.5px] font-bold text-muted-foreground/80 block uppercase">
                        Base + Asistencias
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                          pay.status === "paid"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                        }`}
                      >
                        {pay.status === "paid" ? "✅ Acreditado" : "⏳ Pendiente"}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setActiveReceipt(pay)}
                          className="h-8 text-[11px] font-bold rounded-xl border-border gap-1.5 hover:bg-secondary"
                        >
                          <FileText className="h-3.5 w-3.5 text-primary" /> Recibo
                        </Button>

                        {pay.status === "pending" ? (
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => {
                              const today = new Date().toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
                              setPayrollRecords((prev) =>
                                prev.map((p) =>
                                  p.id === pay.id ? { ...p, status: "paid", paidAt: today } : p,
                                ),
                              );

                              // Post auto-expense to Cash Register
                              const newExpenseTx = {
                                id: `tx-pay-${Date.now()}`,
                                date: new Date().toISOString().split("T")[0],
                                type: "expense" as const,
                                channel: "transfer" as const,
                                description: `Liquidación Honorarios Coach: ${coach?.name || "Staff"} (${pay.period})`,
                                amount: pay.totalAmount,
                                registeredBy: "Administración / Finanzas",
                              };
                              setCashTransactions((prev) => [newExpenseTx, ...prev]);

                              toast.success(
                                `✓ Liquidación de $${pay.totalAmount.toLocaleString()} acreditada a ${coach?.name}. Se registró el egreso en Caja/POS.`,
                              );
                            }}
                            className="h-8 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-3 shadow-xs gap-1"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" /> Acreditar Pago
                          </Button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-xl shrink-0">
                            <CheckCircle2 className="h-3.5 w-3.5" /> {pay.paidAt ? `Pago: ${pay.paidAt}` : "Acreditado"}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recibo / Comprobante Modal */}
      {activeReceipt && (
        <Dialog open={!!activeReceipt} onOpenChange={(o) => !o && setActiveReceipt(null)}>
          <DialogContent className="max-w-md border border-border bg-card">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" /> Recibo de Liquidación de Honorarios
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 pt-2 text-xs">
              {(() => {
                const coach = staffList.find((s) => s.id === activeReceipt.staffId);
                const baseVal = coach?.baseSalary ?? 60000;
                const payPerClassRate = coach?.payPerClass ?? 5000;
                const payPerStudentRate = coach?.payPerStudent ?? 300;
                const perClassVal = activeReceipt.classesGiven * payPerClassRate;
                const perStudentVal = activeReceipt.studentsAttended * payPerStudentRate;

                return (
                  <div className="space-y-3">
                    <div className="p-3.5 bg-secondary/30 border border-border/60 rounded-2xl space-y-1">
                      <div className="font-bold text-sm text-foreground">{coach?.name || "Coach"}</div>
                      <div className="text-muted-foreground">{coach?.specialty || "Entrenador Staff"}</div>
                      <div className="text-[10.5px] text-primary font-bold">Período: {activeReceipt.period}</div>
                    </div>

                    <div className="space-y-2 border-t border-b border-border/60 py-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                        Desglose de Conceptos Liquidados:
                      </span>

                      <div className="flex justify-between font-medium">
                        <span>Base Fija Mensual</span>
                        <span>${baseVal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>{activeReceipt.classesGiven} Clases Dictadas (${payPerClassRate.toLocaleString()} c/u)</span>
                        <span>${perClassVal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>{activeReceipt.studentsAttended} Alumnos Asistentes (${payPerStudentRate.toLocaleString()} c/u)</span>
                        <span>${perStudentVal.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl flex justify-between items-center text-sm font-bold">
                      <span className="text-foreground">TOTAL A COBRAR:</span>
                      <span className="text-primary text-base font-black">
                        ${activeReceipt.totalAmount.toLocaleString()} ARS
                      </span>
                    </div>
                  </div>
                );
              })()}

              <DialogFooter className="gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveReceipt(null)}
                  className="rounded-xl text-xs font-bold"
                >
                  Cerrar
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    toast.info("Imprimiendo recibo oficial de liquidación...");
                    window.print();
                  }}
                  className="rounded-xl text-xs font-bold bg-primary text-primary-foreground gap-1"
                >
                  Imprimir / Descargar Recibo
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Ajustar Gastos Fijos Base Modal */}
      {showFixedModal && (
        <Dialog open={showFixedModal} onOpenChange={setShowFixedModal}>
          <DialogContent className="sm:max-w-xl rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" /> Desglose de Gastos Fijos de Sede
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 text-xs">
              <p className="text-muted-foreground">
                Configura el presupuesto itemizado de costos fijos mensuales (alquiler, luz, internet, servicios). El sistema calculará la suma automáticamente.
              </p>

              {/* Form to add new item */}
              <div className="p-3.5 bg-secondary/30 border border-border/60 rounded-2xl space-y-2">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Agregar Nuevo Rubro / Gasto Fijo:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
                  <input
                    type="text"
                    placeholder="Ej: Impuestos Municipales"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="sm:col-span-4 h-8.5 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground focus-visible:outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Monto ($)"
                    value={newCatAmount}
                    onChange={(e) => setNewCatAmount(e.target.value)}
                    className="sm:col-span-2 h-8.5 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground focus-visible:outline-none"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      if (!newCatName.trim() || !newCatAmount || parseFloat(newCatAmount) <= 0) {
                        toast.error("Ingresa un nombre de rubro y un monto válido.");
                        return;
                      }
                      const newItem = {
                        id: `fix-${Date.now()}`,
                        category: newCatName.trim(),
                        amount: parseFloat(newCatAmount),
                      };
                      setTempItems((prev) => [...prev, newItem]);
                      setNewCatName("");
                      setNewCatAmount("");
                    }}
                    className="sm:col-span-1 h-8.5 rounded-xl text-xs font-bold px-2"
                  >
                    + Añadir
                  </Button>
                </div>
              </div>

              {/* List of itemized categories */}
              <div className="space-y-2">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Rubros Fijos Configurados ({tempItems.length}):
                </span>
                <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                  {tempItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2.5 bg-background border border-border/70 rounded-xl gap-2"
                    >
                      <input
                        type="text"
                        value={item.category}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTempItems((prev) =>
                            prev.map((i) => (i.id === item.id ? { ...i, category: val } : i)),
                          );
                        }}
                        className="flex-1 h-8 rounded-lg border border-transparent hover:border-border bg-transparent px-2 text-xs font-bold text-foreground focus-visible:bg-secondary/30 focus-visible:outline-none"
                      />
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground font-bold">$</span>
                        <input
                          type="number"
                          value={item.amount}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setTempItems((prev) =>
                              prev.map((i) => (i.id === item.id ? { ...i, amount: val } : i)),
                            );
                          }}
                          className="w-24 h-8 rounded-lg border border-border/80 bg-background px-2 text-xs font-bold text-foreground text-right focus-visible:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setTempItems((prev) => prev.filter((i) => i.id !== item.id));
                          }}
                          className="p-1 text-muted-foreground hover:text-rose-600 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary calculations */}
              <div className="p-3.5 bg-secondary/30 rounded-2xl border border-border/60 text-xs space-y-1.5">
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground">Sumatoria de Rubros Fijos:</span>
                  <span className="font-bold text-foreground">${tempBaseFixedExpenses.toLocaleString()} ARS</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground">+ Egresos Variables POS (Mostrador):</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">+${posExpenses.toLocaleString()} ARS</span>
                </div>
                <div className="border-t border-border/60 pt-1.5 flex justify-between font-extrabold text-sm">
                  <span className="text-foreground">Total Gastos Operativos:</span>
                  <span className="text-rose-600 dark:text-rose-400">${(tempBaseFixedExpenses + posExpenses).toLocaleString()} ARS</span>
                </div>
              </div>

              <DialogFooter className="gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowFixedModal(false)}
                  className="rounded-xl text-xs font-bold"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setFixedExpenseItems(tempItems);
                    setShowFixedModal(false);
                    toast.success("✓ Presupuesto de gastos fijos itemizado actualizado con éxito.");
                  }}
                  className="rounded-xl text-xs font-bold bg-primary text-primary-foreground"
                >
                  Guardar Presupuesto Fijo
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function ReportesTab({
  membersList = [],
  classesList = [],
  membershipsList = [],
  staffList = [],
  salasList = [],
  cashTransactions = [],
}: {
  membersList?: any[];
  classesList?: any[];
  membershipsList?: any[];
  staffList?: any[];
  salasList?: any[];
  cashTransactions?: any[];
}) {
  const [timeRange, setTimeRange] = useState<"today" | "week" | "month" | "prev_month" | "quarter">("month");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("all");
  const [reportSubTab, setReportSubTab] = useState<"finanzas" | "asistencia" | "socios" | "staff">("finanzas");

  // Dynamic calculations based on state
  const totalActiveMembers = useMemo(() => {
    return membersList.filter((m) => m.status === "activo" || !m.status).length || 240;
  }, [membersList]);

  const calculatedRevenue = useMemo(() => {
    if (!membersList.length) return 4320000;
    return membersList.reduce((sum, m) => {
      const plan = membershipsList.find((p) => p.name === m.plan);
      return sum + (plan?.price || 18000);
    }, 0);
  }, [membersList, membershipsList]);

  const avgTicket = useMemo(() => {
    return totalActiveMembers > 0 ? Math.round(calculatedRevenue / totalActiveMembers) : 18000;
  }, [calculatedRevenue, totalActiveMembers]);

  const totalClassesCount = useMemo(() => {
    if (selectedDiscipline === "all") return classesList.length || 42;
    return classesList.filter((c) => (c.name || "").toLowerCase().includes(selectedDiscipline.toLowerCase())).length || 12;
  }, [classesList, selectedDiscipline]);

  const totalBookedSpots = useMemo(() => {
    return classesList.reduce((sum, c) => sum + (c.booked || 0), 0) || 842;
  }, [classesList]);

  const totalCapacity = useMemo(() => {
    return classesList.reduce((sum, c) => sum + (c.capacity || 20), 0) || 1080;
  }, [classesList]);

  const occupancyRate = useMemo(() => {
    return totalCapacity > 0 ? ((totalBookedSpots / totalCapacity) * 100).toFixed(1) : "78.4";
  }, [totalBookedSpots, totalCapacity]);

  // Payment methods breakdown calculated dynamically from cashTransactions
  const paymentStats = useMemo(() => {
    const incomeTx = cashTransactions.filter((t) => t.type === "income");
    const totalIncome = incomeTx.reduce((sum, t) => sum + (t.amount || 0), 0);

    if (totalIncome === 0) {
      return {
        mpAmount: Math.round(calculatedRevenue * 0.62),
        mpPercent: 62,
        transfAmount: Math.round(calculatedRevenue * 0.24),
        transfPercent: 24,
        cashAmount: Math.round(calculatedRevenue * 0.14),
        cashPercent: 14,
        total: calculatedRevenue,
      };
    }

    const mpTotal = incomeTx.filter((t) => t.channel === "app").reduce((sum, t) => sum + t.amount, 0);
    const transfTotal = incomeTx.filter((t) => t.channel === "transfer").reduce((sum, t) => sum + t.amount, 0);
    const cashTotal = incomeTx.filter((t) => t.channel === "cash").reduce((sum, t) => sum + t.amount, 0);

    const mpP = Math.round((mpTotal / totalIncome) * 100) || 0;
    const transfP = Math.round((transfTotal / totalIncome) * 100) || 0;
    const cashP = Math.round((cashTotal / totalIncome) * 100) || 0;

    return {
      mpAmount: mpTotal,
      mpPercent: mpP,
      transfAmount: transfTotal,
      transfPercent: transfP,
      cashAmount: cashTotal,
      cashPercent: cashP,
      total: totalIncome,
    };
  }, [cashTransactions, calculatedRevenue]);

  // WhatsApp Re-engagement Action
  const handleSendWhatsAppReminder = (memberName: string, phone?: string) => {
    const cleanPhone = phone || "5491155550000";
    const msg = `¡Hola ${memberName}! 👋 Te extrañamos en el studio. Tenés clases disponibles en tu plan. ¿Te anotamos para la sesión de mañana? 💪`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, "_blank");
    toast.success(`📱 Abriendo WhatsApp con plantilla de re-engagement para ${memberName}...`);
  };

  // CSV Export Handler
  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: string[][] = [];
    let filename = `reporte_${reportSubTab}_${timeRange}.csv`;

    if (reportSubTab === "finanzas") {
      headers = ["Periodo", "Facturacion Total ($)", "Socios Activos", "Ticket Promedio ($)", "Cobros MercadoPago ($)", "Cobros Transf ($)", "Cobros Efectivo ($)"];
      rows = [
        [timeRange, calculatedRevenue.toString(), totalActiveMembers.toString(), avgTicket.toString(), `$${paymentStats.mpAmount}`, `$${paymentStats.transfAmount}`, `$${paymentStats.cashAmount}`],
      ];
    } else if (reportSubTab === "asistencia") {
      headers = ["Clase", "Disciplina", "Profesor", "Capacidad", "Inscritos", "% Ocupacion"];
      rows = classesList.length > 0
        ? classesList.map((c) => [c.name, c.discipline || "General", c.staffId, c.capacity.toString(), c.booked.toString(), `${Math.round((c.booked / c.capacity) * 100)}%`])
        : [["CrossFit WOD", "CrossFit", "Mateo Rossi", "20", "18", "90%"], ["Spinning Pro", "Spinning", "Lucía Fernández", "25", "24", "96%"]];
    } else if (reportSubTab === "socios") {
      headers = ["Nombre", "Plan", "Estado", "Vencimiento", "Asistencias Mes"];
      rows = membersList.length > 0
        ? membersList.map((m) => [m.name, m.plan, m.status || "Activo", m.expirationDate || "Al día", "8"])
        : [["Agustín Gómez", "Pase Libre", "Activo", "15/08/2026", "12"]];
    } else if (reportSubTab === "staff") {
      headers = ["Profesor/Coach", "Especialidad", "Clases Dictadas", "Asistencia Promedio", "Calificacion"];
      rows = staffList.length > 0
        ? staffList.map((s) => [s.name, s.specialty, "18", "16 alumnos", "4.9 ⭐"])
        : [["Mateo Rossi", "CrossFit", "24", "18 alumnos", "4.9 ⭐"], ["Valeria Soto", "Yoga & Pilates", "16", "14 alumnos", "5.0 ⭐"]];
    }

    const csvContent = [headers.join(","), ...rows.map((r) => r.map((val) => `"${val}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`✓ Reporte ${reportSubTab.toUpperCase()} exportado a CSV exitosamente.`);
  };

  const handlePrint = () => {
    toast.info("Generando vista de impresión / PDF...");
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in text-foreground">
      {/* Header & Controls Toolbar */}
      <div className="bg-card border border-border/80 p-6 rounded-3xl space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight">Reportes & Analítica de Negocio</h2>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold">
                Estadísticas en Tiempo Real
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Indicadores ejecutivos de facturación, tasa de retención, ocupación de salones y rendimiento de staff.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="rounded-xl text-xs font-bold gap-2 border-border text-foreground hover:bg-secondary"
            >
              <Download className="h-4 w-4 text-primary" />
              Exportar CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="rounded-xl text-xs font-bold gap-2 border-border text-foreground hover:bg-secondary"
            >
              <Printer className="h-4 w-4 text-muted-foreground" />
              Imprimir / PDF
            </Button>
          </div>
        </div>

        {/* Filters Controls Row */}
        <div className="pt-3 border-t border-border/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Sub-Tab Category Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setReportSubTab("finanzas")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                reportSubTab === "finanzas"
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" /> Finanzas e Ingresos
            </button>

            <button
              onClick={() => setReportSubTab("asistencia")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                reportSubTab === "asistencia"
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Activity className="w-3.5 h-3.5" /> Asistencia y Ocupación
            </button>

            <button
              onClick={() => setReportSubTab("socios")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                reportSubTab === "socios"
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Users className="w-3.5 h-3.5" /> Retención y Alumnos
            </button>

            <button
              onClick={() => setReportSubTab("staff")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                reportSubTab === "staff"
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Star className="w-3.5 h-3.5" /> Staff & Coaches
            </button>
          </div>

          {/* Time & Discipline Selectors (Shadcn/ui Select) */}
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={(val) => setTimeRange(val as any)}>
              <SelectTrigger className="w-[145px] h-9 rounded-xl border border-border bg-background text-xs font-bold text-foreground">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border border-border bg-popover text-popover-foreground">
                <SelectItem value="today">📅 Hoy</SelectItem>
                <SelectItem value="week">📅 Últimos 7 días</SelectItem>
                <SelectItem value="month">📅 Este Mes</SelectItem>
                <SelectItem value="prev_month">📅 Mes Anterior</SelectItem>
                <SelectItem value="quarter">📅 Trimestre Actual</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedDiscipline} onValueChange={(val) => setSelectedDiscipline(val)}>
              <SelectTrigger className="w-[155px] h-9 rounded-xl border border-border bg-background text-xs font-bold text-foreground">
                <SelectValue placeholder="Disciplina" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border border-border bg-popover text-popover-foreground">
                <SelectItem value="all">🏋️ Todas las Clases</SelectItem>
                <SelectItem value="CrossFit">🔥 CrossFit</SelectItem>
                <SelectItem value="Spinning">🚴 Spinning</SelectItem>
                <SelectItem value="Yoga">🧘 Yoga</SelectItem>
                <SelectItem value="Pilates">🤸 Pilates</SelectItem>
                <SelectItem value="Funcional">⚡ Funcional</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* SUBTAB 1: FINANZAS E INGRESOS */}
      {reportSubTab === "finanzas" && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
            <div className="bg-card border border-border/80 p-5 rounded-3xl space-y-1 shadow-xs transition-all hover:-translate-y-1 hover:shadow-lg">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                Facturación Estimada ({timeRange})
              </span>
              <div className="text-2xl font-black text-foreground">${calculatedRevenue.toLocaleString("es-AR")}</div>
              <p className="text-[10.5px] text-emerald-600 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +14.2% vs. periodo anterior
              </p>
            </div>

            <div className="bg-card border border-border/80 p-5 rounded-3xl space-y-1 shadow-xs transition-all hover:-translate-y-1 hover:shadow-lg">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                Ticket Promedio por Socio
              </span>
              <div className="text-2xl font-black text-primary">${avgTicket.toLocaleString("es-AR")}</div>
              <p className="text-[10.5px] text-muted-foreground">Planes mensuales + cuotas</p>
            </div>

            <div className="bg-card border border-border/80 p-5 rounded-3xl space-y-1 shadow-xs transition-all hover:-translate-y-1 hover:shadow-lg">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                Ingresos Recurrentes (Pases)
              </span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">86.5%</div>
              <p className="text-[10.5px] text-muted-foreground">Suscripciones automáticas</p>
            </div>

            <div className="bg-card border border-border/80 p-5 rounded-3xl space-y-1 shadow-xs transition-all hover:-translate-y-1 hover:shadow-lg">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                Plan Más Vendido
              </span>
              <div className="text-xl font-black text-foreground truncate">Pase Libre Total</div>
              <p className="text-[10.5px] text-muted-foreground">48% de la recaudación</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-card border border-border/80 p-6 rounded-3xl space-y-4 shadow-xs">
              <h3 className="font-bold text-sm text-foreground uppercase tracking-wider text-muted-foreground/80 border-b border-border/40 pb-2">
                Distribución por Métodos de Pago
              </h3>
              <div className="space-y-3 pt-1">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>MercadoPago / Tarjetas de Crédito y Débito</span>
                    <span className="text-primary font-black">{paymentStats.mpPercent}% (${paymentStats.mpAmount.toLocaleString("es-AR")})</span>
                  </div>
                  <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${paymentStats.mpPercent}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Transferencias Bancarias (CBU / CVU)</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-black">{paymentStats.transfPercent}% (${paymentStats.transfAmount.toLocaleString("es-AR")})</span>
                  </div>
                  <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${paymentStats.transfPercent}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Efectivo en Recepción</span>
                    <span className="text-muted-foreground font-black">{paymentStats.cashPercent}% (${paymentStats.cashAmount.toLocaleString("es-AR")})</span>
                  </div>
                  <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-muted-foreground/40 rounded-full" style={{ width: `${paymentStats.cashPercent}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border/80 p-6 rounded-3xl space-y-4 shadow-xs">
              <h3 className="font-bold text-sm text-foreground uppercase tracking-wider text-muted-foreground/80 border-b border-border/40 pb-2">
                Resumen de Planes de Membresía
              </h3>
              <div className="space-y-3 pt-1">
                {membershipsList.length > 0 ? (
                  membershipsList.map((plan) => (
                    <div key={plan.id} className="p-3 bg-secondary/30 border border-border/60 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="font-bold text-xs block">{plan.name}</span>
                        <span className="text-[11px] text-muted-foreground">{plan.duration} · ${plan.price.toLocaleString("es-AR")}</span>
                      </div>
                      <Badge variant="outline" className="text-xs font-bold border-primary/20 text-primary">
                        {plan.passType || "Pase Activo"}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">No hay planes registrados.</p>
                )}
              </div>
            </div>
          </div>

          {/* Executive Revenue Trend Chart */}
          <div className="bg-card border border-border/80 p-6 rounded-3xl space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/40 pb-3 gap-2">
              <div>
                <h3 className="font-bold text-sm text-foreground uppercase tracking-wider text-muted-foreground/80">
                  Evolución Mensual de Facturación Bruta (Últimos 6 Meses)
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Comparativa semestral de recaudación bruta e inscripciones totales.
                </p>
              </div>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs font-bold w-fit">
                +14.2% Crecimiento
              </Badge>
            </div>

            <div className="pt-2">
              <div className="grid grid-cols-6 gap-2 sm:gap-4 items-end h-44 pt-6 pb-2 border-b border-border/60">
                {[
                  { month: "Ene", amount: "$3.1M", height: "45%", count: "620 al." },
                  { month: "Feb", amount: "$3.4M", height: "55%", count: "690 al." },
                  { month: "Mar", amount: "$3.8M", height: "68%", count: "740 al." },
                  { month: "Abr", amount: "$3.9M", height: "72%", count: "780 al." },
                  { month: "May", amount: "$4.1M", height: "85%", count: "810 al." },
                  { month: "Jun", amount: `$${(calculatedRevenue / 1000000).toFixed(2)}M`, height: "98%", count: `${totalBookedSpots} al.`, current: true },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] font-black text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100 sm:opacity-100">
                      {item.amount}
                    </span>
                    <div className="w-full max-w-[40px] bg-secondary/60 rounded-t-xl overflow-hidden h-full flex items-end p-0.5">
                      <div
                        className={`w-full rounded-t-lg transition-all duration-500 ${
                          item.current
                            ? "bg-primary shadow-xs"
                            : "bg-primary/40 group-hover:bg-primary/70"
                        }`}
                        style={{ height: item.height }}
                      />
                    </div>
                    <span className={`text-[11px] font-bold ${item.current ? "text-primary font-extrabold" : "text-muted-foreground"}`}>
                      {item.month}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-[11px] text-muted-foreground pt-2.5 gap-1">
                <span>* Datos actualizados al cierre de {timeRange === "month" ? "Junio 2026" : "período seleccionado"}.</span>
                <span className="font-bold text-foreground">Promedio Semestral: $3.77M / mes</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: ASISTENCIA Y OCUPACION */}
      {reportSubTab === "asistencia" && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
            <div className="bg-card border border-border/80 p-5 rounded-3xl space-y-1 shadow-xs transition-all hover:-translate-y-1 hover:shadow-lg">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                Asistencias Confirmadas
              </span>
              <div className="text-2xl font-black text-foreground">{totalBookedSpots}</div>
              <p className="text-[10.5px] text-emerald-600 font-semibold">+8.4% vs. mes anterior</p>
            </div>

            <div className="bg-card border border-border/80 p-5 rounded-3xl space-y-1 shadow-xs transition-all hover:-translate-y-1 hover:shadow-lg">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                Ocupación Promedio de Salones
              </span>
              <div className="text-2xl font-black text-primary">{occupancyRate}%</div>
              <p className="text-[10.5px] text-muted-foreground">Capacidad en horas pico</p>
            </div>

            <div className="bg-card border border-border/80 p-5 rounded-3xl space-y-1 shadow-xs transition-all hover:-translate-y-1 hover:shadow-lg">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                Tasa de Ausentismo (No-shows)
              </span>
              <div className="text-2xl font-black text-amber-500">5.8%</div>
              <p className="text-[10.5px] text-muted-foreground">Reservas sin check-in</p>
            </div>

            <div className="bg-card border border-border/80 p-5 rounded-3xl space-y-1 shadow-xs transition-all hover:-translate-y-1 hover:shadow-lg">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                Lista de Espera Convertida
              </span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">38</div>
              <p className="text-[10.5px] text-muted-foreground">Cupos liberados asignados</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-card border border-border/80 p-6 rounded-3xl space-y-4 shadow-xs">
              <h3 className="font-bold text-sm text-foreground uppercase tracking-wider text-muted-foreground/80 border-b border-border/40 pb-2">
                Ocupación por Franja Horaria (Lunes a Viernes)
              </h3>
              <div className="space-y-3 pt-1">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Mañana (08:00 - 11:00 hs)</span>
                    <span className="text-primary font-black">82% Ocupación</span>
                  </div>
                  <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full w-[82%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Mediodía (12:00 - 15:00 hs)</span>
                    <span className="text-muted-foreground font-black">54% Ocupación</span>
                  </div>
                  <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-secondary-foreground/40 rounded-full w-[54%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Tarde / Noche (18:00 - 21:00 hs) - Hora Pico</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-black">94% Ocupación</span>
                  </div>
                  <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-[94%]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border/80 p-6 rounded-3xl space-y-4 shadow-xs">
              <h3 className="font-bold text-sm text-foreground uppercase tracking-wider text-muted-foreground/80 border-b border-border/40 pb-2">
                Rendimiento por Salón / Espacio
              </h3>
              <div className="space-y-3 pt-1">
                {salasList.length > 0 ? (
                  salasList.map((sala) => (
                    <div key={sala.id} className="p-3.5 bg-secondary/30 border border-border/60 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="font-bold text-sm block">{sala.name}</span>
                        <span className="text-xs text-muted-foreground">Capacidad: {sala.capacity || 20} lugares</span>
                      </div>
                      <span className="text-xs font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">
                        84% Ocupación
                      </span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="p-3.5 bg-secondary/30 border border-border/60 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="font-bold text-sm block">Sala 1 - WOD & CrossFit</span>
                        <span className="text-xs text-muted-foreground">Capacidad: 25 lugares · 420 inscripciones/mes</span>
                      </div>
                      <span className="text-xs font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">
                        84% Ocupación
                      </span>
                    </div>
                    <div className="p-3.5 bg-secondary/30 border border-border/60 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="font-bold text-sm block">Sala 2 - Studio & Pilates</span>
                        <span className="text-xs text-muted-foreground">Capacidad: 18 lugares · 580 inscripciones/mes</span>
                      </div>
                      <span className="text-xs font-black bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">
                        76% Ocupación
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: RETENCION Y SOCIOS */}
      {reportSubTab === "socios" && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
            <div className="bg-card border border-border/80 p-5 rounded-3xl space-y-1 shadow-xs transition-all hover:-translate-y-1 hover:shadow-lg">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                Socios Activos Totales
              </span>
              <div className="text-2xl font-black text-foreground">{totalActiveMembers}</div>
              <p className="text-[10.5px] text-emerald-600 font-semibold">+18 este mes</p>
            </div>

            <div className="bg-card border border-border/80 p-5 rounded-3xl space-y-1 shadow-xs transition-all hover:-translate-y-1 hover:shadow-lg">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                Tasa de Retención
              </span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">92.4%</div>
              <p className="text-[10.5px] text-muted-foreground">Renovaciones mensuales</p>
            </div>

            <div className="bg-card border border-border/80 p-5 rounded-3xl space-y-1 shadow-xs transition-all hover:-translate-y-1 hover:shadow-lg">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                Tasa de Cancelación (Churn)
              </span>
              <div className="text-2xl font-black text-amber-500">2.6%</div>
              <p className="text-[10.5px] text-muted-foreground">Bajas registradas</p>
            </div>

            <div className="bg-card border border-border/80 p-5 rounded-3xl space-y-1 shadow-xs transition-all hover:-translate-y-1 hover:shadow-lg">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                En Riesgo de Abandono
              </span>
              <div className="text-2xl font-black text-destructive">6</div>
              <p className="text-[10.5px] text-muted-foreground">14+ días sin check-in</p>
            </div>
          </div>

          <div className="bg-card border border-border/80 p-6 rounded-3xl space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <h3 className="font-bold text-sm text-foreground uppercase tracking-wider text-muted-foreground/80">
                ⚠️ Alumnos en Riesgo de Abandono (Sin Asistencias Recientes)
              </h3>
              <Badge variant="outline" className="text-xs font-bold border-destructive/30 text-destructive bg-destructive/10">
                Requiere Seguimiento
              </Badge>
            </div>

            <div className="space-y-2.5 pt-1">
              <div className="p-3.5 bg-secondary/30 border border-border/60 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-destructive/10 text-destructive flex items-center justify-center font-bold text-xs border border-destructive/20 shrink-0">
                    AG
                  </div>
                  <div>
                    <span className="font-bold text-xs block text-foreground">Agustín Gómez</span>
                    <span className="text-[11px] text-muted-foreground">Plan Pase 8 Clases · Última asistencia hace 16 días</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSendWhatsAppReminder("Agustín Gómez", "5491155551234")}
                  className="rounded-xl text-xs font-bold border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 gap-1.5 shrink-0"
                >
                  <MessageCircle className="h-3.5 w-3.5" /> Contactar por WhatsApp
                </Button>
              </div>

              <div className="p-3.5 bg-secondary/30 border border-border/60 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xs border border-amber-500/20 shrink-0">
                    CD
                  </div>
                  <div>
                    <span className="font-bold text-xs block text-foreground">Camila Díaz</span>
                    <span className="text-[11px] text-muted-foreground">Plan CrossFit 12 · Última asistencia hace 14 días</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSendWhatsAppReminder("Camila Díaz", "5491155555678")}
                  className="rounded-xl text-xs font-bold border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 gap-1.5 shrink-0"
                >
                  <MessageCircle className="h-3.5 w-3.5" /> Contactar por WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: STAFF Y COACHES */}
      {reportSubTab === "staff" && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
            <div className="bg-card border border-border/80 p-5 rounded-3xl space-y-1 shadow-xs transition-all hover:-translate-y-1 hover:shadow-lg">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                Coaches Activos
              </span>
              <div className="text-2xl font-black text-foreground">{staffList.length || 6}</div>
              <p className="text-[10.5px] text-muted-foreground">Instructores del studio</p>
            </div>

            <div className="bg-card border border-border/80 p-5 rounded-3xl space-y-1 shadow-xs transition-all hover:-translate-y-1 hover:shadow-lg">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                Clases Dictadas (Mes)
              </span>
              <div className="text-2xl font-black text-primary">{totalClassesCount}</div>
              <p className="text-[10.5px] text-emerald-600 font-semibold">100% asistidas</p>
            </div>

            <div className="bg-card border border-border/80 p-5 rounded-3xl space-y-1 shadow-xs transition-all hover:-translate-y-1 hover:shadow-lg">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                Promedio Alumnos / Clase
              </span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">16.4</div>
              <p className="text-[10.5px] text-muted-foreground">Asistencia promedio</p>
            </div>

            <div className="bg-card border border-border/80 p-5 rounded-3xl space-y-1 shadow-xs transition-all hover:-translate-y-1 hover:shadow-lg">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                Puntualidad de Sesiones
              </span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                100%
              </div>
              <p className="text-[10.5px] text-muted-foreground">Cumplimiento de horario</p>
            </div>
          </div>

          <div className="bg-card border border-border/80 p-6 rounded-3xl space-y-4 shadow-xs">
            <h3 className="font-bold text-sm text-foreground uppercase tracking-wider text-muted-foreground/80 border-b border-border/40 pb-2">
              Performance de Instructores
            </h3>
            <div className="space-y-3 pt-1">
              {staffList.length > 0 ? (
                staffList.map((coach) => (
                  <div key={coach.id} className="p-3.5 bg-secondary/30 border border-border/60 rounded-2xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={coach.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                        alt={coach.name}
                        className="w-10 h-10 rounded-full object-cover border border-border"
                      />
                      <div>
                        <span className="font-bold text-sm block">{coach.name}</span>
                        <span className="text-xs text-muted-foreground">{coach.specialty}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-xs">
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase font-bold">Clases</span>
                        <span className="font-extrabold text-foreground">18 dic.</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase font-bold">Asistencia Prom.</span>
                        <span className="font-extrabold text-primary">17.2 al.</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase font-bold">Estado</span>
                        <span className="font-extrabold text-emerald-500">
                          Activo
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3.5 bg-secondary/30 border border-border/60 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                      alt="Mateo Rossi"
                      className="w-10 h-10 rounded-full object-cover border border-border"
                    />
                    <div>
                      <span className="font-bold text-sm block">Mateo Rossi</span>
                      <span className="text-xs text-muted-foreground">CrossFit & High Intensity</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-xs">
                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase font-bold">Clases</span>
                      <span className="font-extrabold text-foreground">24 dic.</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase font-bold">Estado</span>
                      <span className="font-extrabold text-emerald-500">
                        Activo
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InventarioTab({
  inventoryItems,
  setInventoryItems,
}: {
  inventoryItems: any[];
  setInventoryItems: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  const [showAdjustModal, setShowAdjustModal] = useState<any | null>(null);
  const [adjustAmount, setAdjustAmount] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<any | null>(null);

  // Form for new product
  const [newProdName, setNewProdName] = useState("");
  const [newProdCat, setNewProdCat] = useState("Suplementos");
  const [newProdCost, setNewProdCost] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdStock, setNewProdStock] = useState("");
  const [newProdMinStock, setNewProdMinStock] = useState("5");
  const [newProdUnit, setNewProdUnit] = useState("unid");
  const [newProdBarcode, setNewProdBarcode] = useState("");
  const [newProdImage, setNewProdImage] = useState("");

  // Form for editing product
  const [editProdName, setEditProdName] = useState("");
  const [editProdCat, setEditProdCat] = useState("Suplementos");
  const [editProdCost, setEditProdCost] = useState("");
  const [editProdPrice, setEditProdPrice] = useState("");
  const [editProdMinStock, setEditProdMinStock] = useState("5");
  const [editProdUnit, setEditProdUnit] = useState("unid");
  const [editProdBarcode, setEditProdBarcode] = useState("");
  const [editProdImage, setEditProdImage] = useState("");

  const totalValue = inventoryItems.reduce((sum, item) => sum + item.stock * item.price, 0);
  const lowStockCount = inventoryItems.filter((item) => item.stock <= item.minStock).length;

  const filteredItems = useMemo(() => {
    return inventoryItems.filter((item) => {
      const query = searchQuery.toLowerCase();
      const matchSearch =
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        (item.barcode && item.barcode.toLowerCase().includes(query));
      const matchCat = categoryFilter === "all" || item.category.toLowerCase() === categoryFilter.toLowerCase();
      return matchSearch && matchCat;
    });
  }, [inventoryItems, searchQuery, categoryFilter]);

  const handleImageFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImageFn: (val: string) => void,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecciona un archivo de imagen válido (PNG, JPG, WEBP).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setImageFn(result);
        toast.success("📷 Foto cargada exitosamente.");
      }
    };
    reader.readAsDataURL(file);
  };

  const exportInventoryCSV = () => {
    if (filteredItems.length === 0) {
      toast.warning("No hay productos para exportar.");
      return;
    }
    const headers = ["ID", "Código Barras", "Producto", "Categoría", "Precio Costo", "Precio Venta", "Stock Actual", "Stock Mínimo", "Valor Stock ($)", "Estado"];
    const rows = filteredItems.map((item) => [
      item.id,
      `"${(item.barcode || "-").replace(/"/g, '""')}"`,
      `"${item.name.replace(/"/g, '""')}"`,
      `"${item.category.replace(/"/g, '""')}"`,
      item.cost,
      item.price,
      item.stock,
      item.minStock,
      item.stock * item.price,
      item.stock <= item.minStock ? "Bajo Stock" : "OK",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `inventario_tienda_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("✓ Inventario exportado a CSV correctamente.");
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice || parseFloat(newProdPrice) <= 0) {
      toast.error("Ingresa un nombre de producto y un precio de venta válido.");
      return;
    }

    const newItem = {
      id: `prod-${Date.now()}`,
      name: newProdName.trim(),
      category: newProdCat,
      cost: parseFloat(newProdCost) || 0,
      price: parseFloat(newProdPrice) || 0,
      stock: parseInt(newProdStock) || 0,
      minStock: parseInt(newProdMinStock) || 5,
      unit: newProdUnit || "unid",
      barcode: newProdBarcode.trim() || `779${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      image: newProdImage.trim() || "https://images.unsplash.com/photo-1544816155-12df9643f363?w=150&auto=format&fit=crop&q=80",
    };

    setInventoryItems((prev) => [newItem, ...prev]);
    setShowAddModal(false);
    setNewProdName("");
    setNewProdCost("");
    setNewProdPrice("");
    setNewProdStock("");
    setNewProdBarcode("");
    setNewProdImage("");
    toast.success(`✓ "${newItem.name}" agregado exitosamente al inventario.`);
  };

  const handleOpenEditModal = (item: any) => {
    setShowEditModal(item);
    setEditProdName(item.name || "");
    setEditProdCat(item.category || "Suplementos");
    setEditProdCost(item.cost ? item.cost.toString() : "0");
    setEditProdPrice(item.price ? item.price.toString() : "0");
    setEditProdMinStock(item.minStock ? item.minStock.toString() : "5");
    setEditProdUnit(item.unit || "unid");
    setEditProdBarcode(item.barcode || "");
    setEditProdImage(item.image || "");
  };

  const handleSaveEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditModal) return;
    if (!editProdName.trim() || !editProdPrice || parseFloat(editProdPrice) <= 0) {
      toast.error("Ingresa un nombre y precio de venta válido.");
      return;
    }

    setInventoryItems((prev) =>
      prev.map((item) =>
        item.id === showEditModal.id
          ? {
              ...item,
              name: editProdName.trim(),
              category: editProdCat,
              cost: parseFloat(editProdCost) || 0,
              price: parseFloat(editProdPrice) || 0,
              minStock: parseInt(editProdMinStock) || 5,
              unit: editProdUnit || "unid",
              barcode: editProdBarcode.trim(),
              image: editProdImage.trim() || item.image,
            }
          : item,
      ),
    );

    setShowEditModal(null);
    toast.success(`✓ Producto "${editProdName}" actualizado correctamente.`);
  };

  const handleDeleteProduct = (id: string, name: string) => {
    setInventoryItems((prev) => prev.filter((i) => i.id !== id));
    toast.info(`Producto "${name}" eliminado del inventario.`);
  };

  return (
    <div className="space-y-6 animate-fade-in text-foreground">
      {/* Inventory Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-card border border-border/80 p-5 rounded-3xl space-y-1 shadow-xs transition-all hover:-translate-y-1 hover:shadow-lg">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
            Total Productos Registrados
          </span>
          <div className="text-2xl font-black text-foreground">{inventoryItems.length} artículos</div>
          <p className="text-[10.5px] text-muted-foreground">Bebidas, suplementos y merchandising</p>
        </div>

        <div className="bg-card border border-border/80 p-5 rounded-3xl space-y-1 shadow-xs transition-all hover:-translate-y-1 hover:shadow-lg">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
            Alertas de Bajo Stock
          </span>
          <div className={`text-2xl font-black ${lowStockCount > 0 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600"}`}>
            {lowStockCount} {lowStockCount === 1 ? "artículo" : "artículos"}
          </div>
          <p className="text-[10.5px] text-muted-foreground">Por debajo del stock mínimo</p>
        </div>

        <div className="bg-card border border-border/80 p-5 rounded-3xl space-y-1 shadow-xs transition-all hover:-translate-y-1 hover:shadow-lg">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
            Valor de Inventario (Precio Venta)
          </span>
          <div className="text-2xl font-black text-primary">${totalValue.toLocaleString()}</div>
          <p className="text-[10.5px] text-muted-foreground">Mercadería en depósito/mostrador</p>
        </div>
      </div>

      {/* Inventory Table Card */}
      <div className="bg-card border border-border/80 p-6 rounded-3xl space-y-4 shadow-xs">
        {/* Row 1: Title and Header Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/40">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-foreground">Inventario & Stock de Tienda</h3>
              <span className="px-2 py-0.5 rounded-full bg-secondary text-[10px] font-extrabold text-foreground border border-border/60">
                {filteredItems.length}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Control de existencias, código de barras y fotos de productos para el POS.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={exportInventoryCSV}
              className="h-9 rounded-xl font-bold text-xs gap-1.5 border-border text-foreground hover:bg-secondary"
            >
              <Download className="h-4 w-4" /> Exportar CSV
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={() => setShowAddModal(true)}
              className="h-9 rounded-xl font-bold text-xs gap-1.5 bg-primary text-primary-foreground shadow-xs"
            >
              <PlusCircle className="h-4 w-4" /> Nuevo Producto
            </Button>
          </div>
        </div>

        {/* Row 2: Search & Category Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 bg-secondary/20 border border-border/50 rounded-2xl">
          <div className="relative flex-1 min-w-[200px] sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nombre, categoría o código de barras..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full pl-8 pr-3 rounded-xl border border-border bg-background text-xs font-bold text-foreground focus-visible:outline-none placeholder:font-normal placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <Select value={categoryFilter} onValueChange={(val) => setCategoryFilter(val)}>
              <SelectTrigger className="w-[170px] h-9 rounded-xl border border-border bg-background text-xs font-bold text-foreground">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border border-border bg-popover text-popover-foreground">
                <SelectItem value="all">📦 Todas las Categorías</SelectItem>
                <SelectItem value="Suplementos">💊 Suplementos</SelectItem>
                <SelectItem value="Bebidas">🥤 Bebidas</SelectItem>
                <SelectItem value="Accesorios">🎒 Accesorios</SelectItem>
                <SelectItem value="Indumentaria">👕 Indumentaria</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table list */}
        <div className="overflow-x-auto border border-border/60 rounded-2xl bg-background">
          <table className="w-full text-left text-xs min-w-[800px] border-collapse">
            <thead>
              <tr className="border-b border-border/60 bg-secondary/40 text-muted-foreground font-bold text-[10px] uppercase tracking-wider">
                <th className="p-3.5 w-14 text-center">Imagen</th>
                <th className="p-3.5">Producto & Cód. Barras</th>
                <th className="p-3.5">Categoría</th>
                <th className="p-3.5 text-right">Precio Costo</th>
                <th className="p-3.5 text-right">Precio Venta</th>
                <th className="p-3.5 text-center">Stock Actual</th>
                <th className="p-3.5 text-center">Estado Stock</th>
                <th className="p-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filteredItems.map((item) => {
                const isLow = item.stock <= item.minStock;
                return (
                  <tr key={item.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 text-center">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-xl object-cover border border-border mx-auto shrink-0 shadow-2xs"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center text-muted-foreground font-bold text-xs mx-auto">
                          📦
                        </div>
                      )}
                    </td>
                    <td className="p-3.5 font-bold text-foreground">
                      <span className="block font-bold text-foreground">{item.name}</span>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                        <QrCode className="h-3 w-3 text-muted-foreground/80" />
                        <span className="font-mono">{item.barcode || "Sin Cód. Barras"}</span>
                        <span className="mx-1">•</span>
                        <span>Min: {item.minStock} {item.unit}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg border bg-secondary/50 border-border/60 text-foreground">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-3.5 text-right text-muted-foreground font-semibold">${item.cost.toLocaleString()}</td>
                    <td className="p-3.5 text-right font-black text-sm text-foreground">${item.price.toLocaleString()}</td>
                    <td className="p-3.5 text-center font-black text-sm">
                      {item.stock} <span className="text-xs font-normal text-muted-foreground">{item.unit}</span>
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                          isLow
                            ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20"
                            : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                        }`}
                      >
                        {isLow ? "⚠️ Bajo Stock" : "🟢 OK"}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowAdjustModal(item)}
                          className="h-8 text-[11px] font-bold rounded-xl border-border gap-1 hover:bg-secondary"
                        >
                          <PackagePlus className="h-3.5 w-3.5 text-primary" /> Stock
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEditModal(item)}
                          className="h-8 text-[11px] font-bold rounded-xl border-border gap-1 hover:bg-secondary"
                        >
                          <Edit2 className="h-3.5 w-3.5 text-foreground" /> Editar
                        </Button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(item.id, item.name)}
                          className="p-1.5 text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 rounded-lg transition ml-0.5"
                          title="Eliminar producto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Crear Nuevo Producto */}
      {showAddModal && (
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent className="sm:max-w-md border border-border bg-card p-6 rounded-3xl shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-primary" /> Registrar Nuevo Producto en Tienda
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Nombre del Producto:
                </label>
                <input
                  type="text"
                  placeholder="Ej: Proteína Whey 1kg Vainilla"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full h-9 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground focus-visible:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block flex items-center gap-1">
                    <QrCode className="h-3 w-3 text-muted-foreground" /> Código de Barras:
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: 7791234567890"
                    value={newProdBarcode}
                    onChange={(e) => setNewProdBarcode(e.target.value)}
                    className="w-full h-9 rounded-xl border border-border bg-background px-3 text-xs font-mono font-bold text-foreground focus-visible:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Categoría:
                  </label>
                  <Select value={newProdCat} onValueChange={(val) => setNewProdCat(val)}>
                    <SelectTrigger className="w-full h-9 rounded-xl border border-border bg-background text-xs font-bold text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-border bg-popover text-popover-foreground">
                      <SelectItem value="Suplementos">💊 Suplementos</SelectItem>
                      <SelectItem value="Bebidas">🥤 Bebidas</SelectItem>
                      <SelectItem value="Accesorios">🎒 Accesorios</SelectItem>
                      <SelectItem value="Indumentaria">👕 Indumentaria</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Foto del Producto:
                </label>

                <div className="flex items-center gap-3 bg-secondary/30 border border-border/60 p-2.5 rounded-2xl">
                  {newProdImage ? (
                    <div className="relative shrink-0">
                      <img
                        src={newProdImage}
                        alt="Vista previa"
                        className="w-12 h-12 rounded-xl object-cover border border-border shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setNewProdImage("")}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs shadow-xs hover:bg-rose-700"
                        title="Quitar foto"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-secondary border border-border/80 flex items-center justify-center text-muted-foreground shrink-0">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <input
                      type="file"
                      id="new-prod-file-input"
                      accept="image/*"
                      onChange={(e) => handleImageFileUpload(e, setNewProdImage)}
                      className="hidden"
                    />
                    <label
                      htmlFor="new-prod-file-input"
                      className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-background border border-border text-xs font-bold text-foreground hover:bg-secondary transition shadow-2xs"
                    >
                      <Upload className="h-3.5 w-3.5 text-primary" /> Subir desde PC / Celular
                    </label>
                    <p className="text-[10px] text-muted-foreground mt-1 truncate">
                      JPG, PNG o WEBP de tu galería o computadora.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Precio Costo ($):
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={newProdCost}
                    onChange={(e) => setNewProdCost(e.target.value)}
                    className="w-full h-9 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground focus-visible:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Precio Venta ($):
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full h-9 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground focus-visible:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Stock Inicial:
                  </label>
                  <input
                    type="number"
                    placeholder="10"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    className="w-full h-9 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground focus-visible:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Stock Mínimo:
                  </label>
                  <input
                    type="number"
                    placeholder="5"
                    value={newProdMinStock}
                    onChange={(e) => setNewProdMinStock(e.target.value)}
                    className="w-full h-9 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground focus-visible:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Unidad:
                  </label>
                  <input
                    type="text"
                    placeholder="unid, bot"
                    value={newProdUnit}
                    onChange={(e) => setNewProdUnit(e.target.value)}
                    className="w-full h-9 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground focus-visible:outline-none"
                  />
                </div>
              </div>

              <DialogFooter className="gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl text-xs font-bold"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="rounded-xl text-xs font-bold bg-primary text-primary-foreground"
                >
                  Guardar Producto
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal: Editar Producto Existente */}
      {showEditModal && (
        <Dialog open={!!showEditModal} onOpenChange={(open) => !open && setShowEditModal(null)}>
          <DialogContent className="sm:max-w-md border border-border bg-card p-6 rounded-3xl shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Edit2 className="h-5 w-5 text-primary" /> Editar Detalles de Producto
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSaveEditProduct} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Nombre del Producto:
                </label>
                <input
                  type="text"
                  value={editProdName}
                  onChange={(e) => setEditProdName(e.target.value)}
                  className="w-full h-9 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground focus-visible:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block flex items-center gap-1">
                    <QrCode className="h-3 w-3 text-muted-foreground" /> Código de Barras:
                  </label>
                  <input
                    type="text"
                    value={editProdBarcode}
                    onChange={(e) => setEditProdBarcode(e.target.value)}
                    className="w-full h-9 rounded-xl border border-border bg-background px-3 text-xs font-mono font-bold text-foreground focus-visible:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Categoría:
                  </label>
                  <Select value={editProdCat} onValueChange={(val) => setEditProdCat(val)}>
                    <SelectTrigger className="w-full h-9 rounded-xl border border-border bg-background text-xs font-bold text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-border bg-popover text-popover-foreground">
                      <SelectItem value="Suplementos">💊 Suplementos</SelectItem>
                      <SelectItem value="Bebidas">🥤 Bebidas</SelectItem>
                      <SelectItem value="Accesorios">🎒 Accesorios</SelectItem>
                      <SelectItem value="Indumentaria">👕 Indumentaria</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Foto del Producto:
                </label>

                <div className="flex items-center gap-3 bg-secondary/30 border border-border/60 p-2.5 rounded-2xl">
                  {editProdImage ? (
                    <div className="relative shrink-0">
                      <img
                        src={editProdImage}
                        alt="Vista previa"
                        className="w-12 h-12 rounded-xl object-cover border border-border shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setEditProdImage("")}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs shadow-xs hover:bg-rose-700"
                        title="Quitar foto"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-secondary border border-border/80 flex items-center justify-center text-muted-foreground shrink-0">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <input
                      type="file"
                      id="edit-prod-file-input"
                      accept="image/*"
                      onChange={(e) => handleImageFileUpload(e, setEditProdImage)}
                      className="hidden"
                    />
                    <label
                      htmlFor="edit-prod-file-input"
                      className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-background border border-border text-xs font-bold text-foreground hover:bg-secondary transition shadow-2xs"
                    >
                      <Upload className="h-3.5 w-3.5 text-primary" /> Cambiar desde PC / Celular
                    </label>
                    <p className="text-[10px] text-muted-foreground mt-1 truncate">
                      JPG, PNG o WEBP de tu galería o computadora.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Precio Costo ($):
                  </label>
                  <input
                    type="number"
                    value={editProdCost}
                    onChange={(e) => setEditProdCost(e.target.value)}
                    className="w-full h-9 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground focus-visible:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Precio Venta ($):
                  </label>
                  <input
                    type="number"
                    value={editProdPrice}
                    onChange={(e) => setEditProdPrice(e.target.value)}
                    className="w-full h-9 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground focus-visible:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Stock Mínimo (Alerta):
                  </label>
                  <input
                    type="number"
                    value={editProdMinStock}
                    onChange={(e) => setEditProdMinStock(e.target.value)}
                    className="w-full h-9 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground focus-visible:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Unidad:
                  </label>
                  <input
                    type="text"
                    value={editProdUnit}
                    onChange={(e) => setEditProdUnit(e.target.value)}
                    className="w-full h-9 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground focus-visible:outline-none"
                  />
                </div>
              </div>

              <DialogFooter className="gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEditModal(null)}
                  className="rounded-xl text-xs font-bold"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="rounded-xl text-xs font-bold bg-primary text-primary-foreground"
                >
                  Guardar Cambios
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Adjust Stock Modal */}
      {showAdjustModal && (
        <Dialog open={!!showAdjustModal} onOpenChange={(open) => !open && setShowAdjustModal(null)}>
          <DialogContent className="max-w-md border border-border bg-card p-6 rounded-3xl shadow-2xl space-y-4">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <PackagePlus className="h-5 w-5 text-primary" /> Reabastecer / Ajustar Stock
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2 text-xs">
              <div className="p-3.5 bg-secondary/30 border border-border/60 rounded-2xl">
                <span className="font-bold text-sm block text-foreground">{showAdjustModal.name}</span>
                <span className="text-xs text-muted-foreground">
                  Stock Actual: <strong>{showAdjustModal.stock} {showAdjustModal.unit}</strong> (Min: {showAdjustModal.minStock})
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase block">
                  Cantidad a Ingresar (o restar con signo -):
                </label>
                <input
                  type="number"
                  placeholder="Ej: 20 para agregar o -5 para reducir"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  className="w-full h-9.5 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground focus-visible:outline-none"
                />
              </div>

              <DialogFooter className="gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAdjustModal(null)}
                  className="rounded-xl text-xs font-bold"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    const parsed = parseInt(adjustAmount);
                    if (isNaN(parsed)) {
                      toast.error("Ingresa un número válido para el ajuste.");
                      return;
                    }
                    setInventoryItems((prev) =>
                      prev.map((i) =>
                        i.id === showAdjustModal.id ? { ...i, stock: Math.max(0, i.stock + parsed) } : i,
                      ),
                    );
                    setAdjustAmount("");
                    setShowAdjustModal(null);
                    toast.success(`✓ Stock de ${showAdjustModal.name} actualizado correctamente.`);
                  }}
                  className="rounded-xl text-xs font-bold bg-primary text-primary-foreground"
                >
                  Guardar Ajuste
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}


function ReseñasTab({
  reviewsList,
  setReviewsList,
}: {
  reviewsList: Review[];
  setReviewsList: React.Dispatch<React.SetStateAction<Review[]>>;
}) {
  const [allReviews, setAllReviews] = useState<GymFacilityReview[]>([
    {
      id: "rev-1",
      date: "2026-07-20",
      studentName: "Agustín Gómez",
      studentPhoto:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80",
      ratingCleanliness: 4.8,
      ratingEquipment: 4.9,
      ratingStaff: 5.0,
      ratingPrice: 4.7,
      overallRating: 4.9,
      comment:
        "Excelente gimnasio. La atención del personal es de 10 y las máquinas son de última generación. Muy limpio siempre.",
      reply: "¡Muchas gracias Agustín por tu comentario! Nos alegra mucho que disfrutes del centro.",
    },
    {
      id: "rev-2",
      date: "2026-07-18",
      studentName: "Camila Díaz",
      studentPhoto:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80",
      ratingCleanliness: 5.0,
      ratingEquipment: 4.8,
      ratingStaff: 5.0,
      ratingPrice: 4.6,
      overallRating: 4.8,
      comment: "Vestuarios impecables y excelente ambiente para entrenar. El staff siempre muy atento.",
      reply: "",
    },
    {
      id: "rev-3",
      date: "2026-07-12",
      studentName: "Lucas Peralta",
      studentPhoto:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80",
      ratingCleanliness: 4.7,
      ratingEquipment: 5.0,
      ratingStaff: 5.0,
      ratingPrice: 4.8,
      overallRating: 4.9,
      comment: "Muy buena relación precio-calidad. Variedad de pesas y áreas bien cuidadas.",
      reply: "",
    },
  ]);

  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  const totalEvaluationsCount = 312 + (allReviews.length - 3);

  const avgCleanliness = useMemo(() => {
    const sum = allReviews.reduce((acc, r) => acc + r.ratingCleanliness, 0);
    return (sum / allReviews.length).toFixed(1);
  }, [allReviews]);

  const avgEquipment = useMemo(() => {
    const sum = allReviews.reduce((acc, r) => acc + r.ratingEquipment, 0);
    return (sum / allReviews.length).toFixed(1);
  }, [allReviews]);

  const avgStaff = useMemo(() => {
    const sum = allReviews.reduce((acc, r) => acc + r.ratingStaff, 0);
    return (sum / allReviews.length).toFixed(1);
  }, [allReviews]);

  const avgPrice = useMemo(() => {
    const sum = allReviews.reduce((acc, r) => acc + r.ratingPrice, 0);
    return (sum / allReviews.length).toFixed(1);
  }, [allReviews]);

  const overallAvg = useMemo(() => {
    const sum = allReviews.reduce((acc, r) => acc + r.overallRating, 0);
    return (sum / allReviews.length).toFixed(1);
  }, [allReviews]);

  const handleSendReply = (id: string) => {
    const text = replyTexts[id];
    if (!text?.trim()) return;
    setAllReviews((prev) => prev.map((r) => (r.id === id ? { ...r, reply: text.trim() } : r)));
    setReplyTexts((prev) => ({ ...prev, [id]: "" }));
    setActiveReplyId(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 text-foreground max-w-4xl">
      {/* Top Header: Overall Score */}
      <div className="flex items-center gap-2 text-2xl sm:text-3xl font-black tracking-tight pb-2 border-b border-border/40">
        <span className="text-foreground">★ {overallAvg}</span>
        <span className="text-muted-foreground font-semibold">· {totalEvaluationsCount} evaluaciones</span>
      </div>

      {/* Average Ratings Section (Reference Image Inspired) */}
      <div className="bg-card border border-border p-6 rounded-3xl space-y-6">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
          Calificaciones Promedio
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
          {[
            { label: "Limpieza", score: avgCleanliness },
            { label: "Equipamiento", score: avgEquipment },
            { label: "Atención del Staff", score: avgStaff },
            { label: "Relación Calidad/Precio", score: avgPrice },
          ].map((cat) => (
            <div key={cat.label} className="space-y-1.5">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span>{cat.label}</span>
                <span className="font-extrabold text-foreground">{cat.score}</span>
              </div>
              <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-foreground rounded-full transition-all duration-700"
                  style={{ width: `${(parseFloat(cat.score.toString()) / 5) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
          Opiniones de los Alumnos ({allReviews.length})
        </h3>

        <div className="space-y-4">
          {allReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-card border border-border p-5 rounded-3xl space-y-3 transition-colors hover:border-border/80"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.studentPhoto}
                    alt={rev.studentName}
                    className="w-10 h-10 rounded-full object-cover border border-border shrink-0"
                  />
                  <div>
                    <div className="font-bold text-sm text-foreground">{rev.studentName}</div>
                    <div className="text-xs text-muted-foreground">{rev.date}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1 font-extrabold text-sm bg-secondary/30 px-3 py-1 rounded-full border border-border/50">
                  <span className="text-amber-500">★</span>
                  <span>{rev.overallRating.toFixed(1)}</span>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-foreground/90 font-medium">
                "{rev.comment}"
              </p>

              {/* Sub-ratings badges */}
              <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground pt-1">
                <span className="px-2.5 py-0.5 rounded-full bg-secondary/50 font-medium">
                  Limpieza: <strong className="text-foreground">{rev.ratingCleanliness}</strong>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-secondary/50 font-medium">
                  Equipamiento: <strong className="text-foreground">{rev.ratingEquipment}</strong>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-secondary/50 font-medium">
                  Staff: <strong className="text-foreground">{rev.ratingStaff}</strong>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-secondary/50 font-medium">
                  Precio: <strong className="text-foreground">{rev.ratingPrice}</strong>
                </span>
              </div>

              {/* Official Reply section */}
              {rev.reply ? (
                <div className="mt-3 p-3.5 rounded-2xl bg-secondary/25 border border-border/60 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-primary flex items-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5" /> Respuesta oficial del centro
                    </span>
                    <button
                      onClick={() => {
                        setReplyTexts((prev) => ({ ...prev, [rev.id]: rev.reply }));
                        setActiveReplyId(rev.id);
                      }}
                      className="text-[10px] text-muted-foreground hover:text-foreground font-semibold underline"
                    >
                      Editar
                    </button>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{rev.reply}</p>
                </div>
              ) : (
                activeReplyId !== rev.id && (
                  <button
                    onClick={() => setActiveReplyId(rev.id)}
                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1.5 pt-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> Responder como Administrador
                  </button>
                )
              )}

              {activeReplyId === rev.id && (
                <div className="space-y-2 pt-2 animate-fade-in">
                  <textarea
                    rows={2}
                    value={replyTexts[rev.id] || ""}
                    onChange={(e) =>
                      setReplyTexts((prev) => ({ ...prev, [rev.id]: e.target.value }))
                    }
                    placeholder="Escribe la respuesta oficial..."
                    className="flex w-full rounded-2xl border border-border bg-background px-3 py-2 text-xs focus-visible:outline-none text-foreground placeholder:text-muted-foreground"
                  />
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl text-xs"
                      onClick={() => {
                        setActiveReplyId(null);
                        setReplyTexts((prev) => ({ ...prev, [rev.id]: "" }));
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      className="rounded-xl text-xs bg-primary text-primary-foreground"
                      onClick={() => handleSendReply(rev.id)}
                    >
                      Publicar Respuesta
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Subcomponent: Asistencias Tab
function AsistenciasTab({
  selectedBranchId,
  blackoutDays,
  membersList = [],
  classesList = [],
  setClassesList,
}: {
  selectedBranchId: string;
  blackoutDays: { id: string; date: string; reason: string }[];
  membersList?: any[];
  classesList?: any[];
  setClassesList?: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  const [historySearch, setHistorySearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("Todos");
  const [dateFilter, setDateFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");

  // Interactive History & Delete Confirmation states
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [clearConfirmInput, setClearConfirmInput] = useState("");

  const [historyList, setHistoryList] = useState([
    {
      id: "h1",
      name: "Agustín Gómez",
      date: "Hoy",
      time: "11:24 AM",
      method: "Scan QR",
      status: "Presente",
      distance: "En recepción",
      class: "CrossFit WOD",
    },
    {
      id: "h2",
      name: "Camila Díaz",
      date: "Hoy",
      time: "11:15 AM",
      method: "Geolocalización GPS",
      status: "Presente",
      distance: "18m de sede",
      class: "Musculación Libre",
    },
    {
      id: "h3",
      name: "Marcos López",
      date: "Hoy",
      time: "10:54 AM",
      method: "Scan QR",
      status: "Presente",
      distance: "En recepción",
      class: "CrossFit WOD",
    },
    {
      id: "h4",
      name: "Sofía Martínez",
      date: "Hoy",
      time: "09:30 AM",
      method: "Geolocalización GPS",
      status: "Presente",
      distance: "24m de sede",
      class: "Yoga Ashtanga",
    },
    {
      id: "h5",
      name: "Lucas Torres",
      date: "Ayer",
      time: "19:10 PM",
      method: "Recepción",
      status: "Presente",
      distance: "Manual Recepción",
      class: "Spinning Pro",
    },
    {
      id: "h6",
      name: "Mateo Rossi",
      date: "Ayer",
      time: "18:00 PM",
      method: "Scan QR",
      status: "Ausente / No-Show",
      distance: "-",
      class: "Functional Training",
    },
  ]);

  const [recentCheckinsList, setRecentCheckinsList] = useState([
    {
      name: "Agustín Gómez",
      time: "11:24 AM",
      method: "Scan QR",
      alert: "Lesión Rodilla",
      alertColor: "bg-secondary text-secondary-foreground border-border",
      photo:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80",
    },
    {
      name: "Camila Díaz",
      time: "11:15 AM",
      method: "Geolocalización GPS",
      alert: "Pago Pendiente",
      alertColor: "bg-destructive/10 text-destructive border-destructive/30",
      photo:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80",
    },
    {
      name: "Marcos López",
      time: "10:54 AM",
      method: "Scan QR",
      alert: null,
      photo:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80",
    },
    {
      name: "Lucía Fernández",
      time: "10:30 AM",
      method: "Geolocalización GPS",
      alert: null,
      photo:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80",
    },
  ]);

  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [receptionSearchTerm, setReceptionSearchTerm] = useState("");

  // Map member bookings for today's classes
  const memberBookings = useMemo(() => {
    const map: Record<
      string,
      { classId: string; className: string; time: string; spotIndex: number; isPresent: boolean }[]
    > = {};

    (classesList || []).forEach((c: any) => {
      Object.entries(c.enrolledSpots || {}).forEach(([spotIdxStr, studentName]) => {
        const key = (studentName as string).toLowerCase().trim();
        if (!map[key]) map[key] = [];
        const spotIndex = Number(spotIdxStr);
        const isPresent = c.attendance?.[spotIndex] === "present";
        map[key].push({
          classId: c.id,
          className: c.name,
          time: c.time,
          spotIndex,
          isPresent,
        });
      });
    });

    return map;
  }, [classesList]);

  const availableMembersForCheckIn = useMemo(() => {
    const list = membersList || [];
    if (!receptionSearchTerm.trim()) {
      return [...list].sort((a: any, b: any) => {
        const aKey = a.name.toLowerCase().trim();
        const bKey = b.name.toLowerCase().trim();
        const aHasRes = (memberBookings[aKey] || []).length > 0;
        const bHasRes = (memberBookings[bKey] || []).length > 0;
        if (aHasRes && !bHasRes) return -1;
        if (!aHasRes && bHasRes) return 1;
        return 0;
      });
    }

    const term = receptionSearchTerm.toLowerCase().trim();
    return list.filter((m: any) => {
      return (
        m.name.toLowerCase().includes(term) ||
        (m.dni && m.dni.includes(term)) ||
        (m.phone && m.phone.includes(term))
      );
    });
  }, [membersList, receptionSearchTerm, memberBookings]);

  // Filtering history by search, method, date and status
  const filteredHistory = useMemo(() => {
    return historyList.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(historySearch.toLowerCase()) ||
        item.class.toLowerCase().includes(historySearch.toLowerCase());
      if (!matchesSearch) return false;

      // Method Filter
      if (methodFilter !== "Todos" && item.method !== methodFilter) return false;

      // Date Filter
      if (dateFilter === "Hoy" && item.date !== "Hoy") return false;
      if (dateFilter === "Ayer" && item.date !== "Ayer") return false;
      if (dateFilter === "Esta Semana" && item.date !== "Hoy" && item.date !== "Ayer") return false;

      // Status Filter
      if (statusFilter !== "Todos") {
        if (statusFilter === "Presente" && item.status !== "Presente") return false;
        if (statusFilter === "Ausente" && !item.status.includes("Ausente")) return false;
      }
      return true;
    });
  }, [historyList, historySearch, methodFilter, dateFilter, statusFilter]);

  const handleExport = () => {
    const csvHeader = "Nombre,Fecha,Hora,Metodo,Estado,Detalle,Clase\n";
    const csvRows = filteredHistory
      .map((h) => `"${h.name}","${h.date}","${h.time}","${h.method}","${h.status}","${h.distance}","${h.class}"`)
      .join("\n");
    const blob = new Blob([csvHeader + csvRows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `asistencias_gimnasio_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const activeBlackout = blackoutDays.find((b) => b.date === "2026-06-29");

  return (
    <div className="space-y-8">
      {activeBlackout && (
        <div className="p-4 bg-destructive/10 border border-destructive/30 text-destructive rounded-3xl text-xs font-semibold flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div>
            <div className="font-bold">Sede Cerrada por Día de Cierre / Feriado</div>
            <div className="text-[11px] text-destructive/80 mt-0.5">
              Motivo: {activeBlackout.reason}. Los check-ins de hoy están inhabilitados.
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Metrics Header (Occupancy & Access Methods Breakdown) */}
      <div className="grid gap-5 md:grid-cols-4">
        {/* Aforo Actual */}
        <div className="rounded-3xl border border-border bg-card shadow-xs p-5 flex flex-col justify-between hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
              Aforo Actual Sede
            </span>
            <div className="h-9 w-9 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold tracking-tight">
              42 <span className="text-sm font-medium text-muted-foreground">/ 80</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full w-[52%]" />
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              Ocupación segura al 52%
            </p>
          </div>
        </div>

        {/* Check-ins por QR */}
        <div className="rounded-3xl border border-border bg-card shadow-xs p-5 flex flex-col justify-between hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
              Check-ins QR
            </span>
            <div className="h-9 w-9 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
              <Scan className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold tracking-tight">65%</div>
            <p className="text-[11px] text-muted-foreground mt-1">
              28 ingresos escaneados hoy
            </p>
          </div>
        </div>

        {/* Check-ins por GPS */}
        <div className="rounded-3xl border border-border bg-card shadow-xs p-5 flex flex-col justify-between hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
              Check-ins GPS (50m)
            </span>
            <div className="h-9 w-9 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
              <Navigation className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold tracking-tight">25%</div>
            <p className="text-[11px] text-muted-foreground mt-1">
              11 accesos por cercanía
            </p>
          </div>
        </div>

        {/* Recepción Manual */}
        <div className="rounded-3xl border border-border bg-card shadow-xs p-5 flex flex-col justify-between hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
              Recepción Manual
            </span>
            <div className="h-9 w-9 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
              <DoorOpen className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold tracking-tight">10%</div>
            <p className="text-[11px] text-muted-foreground mt-1">
              4 validados en mostrador
            </p>
          </div>
        </div>
      </div>

      {/* Control de Acceso (Check-in en Recepción) */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <DoorOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-foreground">
              Control de Acceso (Check-in en Recepción)
            </h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed pl-1">
            Valida el ingreso presencial de los socios. Detecta automáticamente sus reservas de clases para el día de hoy.
          </p>
        </div>

        <Button
          onClick={() => {
            setReceptionSearchTerm("");
            setIsCheckInModalOpen(true);
          }}
          className="rounded-2xl font-bold text-xs gap-2 shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs px-5 h-10"
        >
          <Search className="h-4 w-4" /> Buscar Socio para Check-in
        </Button>
      </div>

      {/* Live Feed & Recent Checkins Monitor */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Recent Entries Checklist */}
        <div className="rounded-3xl border border-border bg-card shadow-xs p-6 col-span-2 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
              Monitor de Entradas Recientes
            </h3>
            <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Actualizado en vivo
            </span>
          </div>

          <div className="space-y-4">
            {recentCheckinsList.map((c, i) => (
              <div
                key={i}
                className="flex items-center justify-between pb-3 border-b border-border/50 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <img src={c.photo} alt={c.name} className="h-9 w-9 rounded-full object-cover border border-border" />
                  <div>
                    <div className="text-sm font-semibold text-foreground">{c.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <span>{c.time}</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-secondary border border-border font-medium text-foreground">
                        {c.method === "Scan QR" && <Scan className="w-3 h-3 text-emerald-500" />}
                        {c.method === "Geolocalización GPS" && <Navigation className="w-3 h-3 text-blue-500" />}
                        {c.method === "Recepción" && <DoorOpen className="w-3 h-3 text-amber-500" />}
                        {c.method}
                      </span>
                    </div>
                  </div>
                </div>
                {c.alert && (
                  <span
                    className={`text-[10px] font-bold uppercase border px-2.5 py-0.5 rounded-full ${c.alertColor}`}
                  >
                    {c.alert}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Churn Risk / Alumnos en Riesgo Section */}
        <div className="rounded-3xl border border-amber-500/30 bg-amber-500/5 shadow-xs p-6 col-span-1 flex flex-col justify-between hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-lg transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                Alumnos sin Asistencia
              </h3>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Riesgo Churn
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              Socios con más de 12 días sin registrars check-in en la sede:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-card border border-border flex items-center justify-between">
                <div>
                  <span className="font-bold text-foreground block">Martín Silva</span>
                  <span className="text-[10px] text-muted-foreground">Pase 8 Clases · Hace 14 días</span>
                </div>
                <Button size="sm" variant="outline" className="rounded-full text-[10px] h-7 px-2.5 gap-1 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10" onClick={() => alert("Abriendo WhatsApp con plantilla de re-engagement para Martín Silva...")}>
                  <MessageCircle className="w-3 h-3" /> Contactar
                </Button>
              </div>

              <div className="p-3 rounded-2xl bg-card border border-border flex items-center justify-between">
                <div>
                  <span className="font-bold text-foreground block">Valeria Ríos</span>
                  <span className="text-[10px] text-muted-foreground">CrossFit 12 · Hace 16 días</span>
                </div>
                <Button size="sm" variant="outline" className="rounded-full text-[10px] h-7 px-2.5 gap-1 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10" onClick={() => alert("Abriendo WhatsApp con plantilla de re-engagement para Valeria Ríos...")}>
                  <MessageCircle className="w-3 h-3" /> Contactar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* General History Table with Date, Method & Action Filters */}
      <div className="rounded-3xl border border-border bg-card shadow-xs p-6 space-y-5">
        {/* Header Block: Title + Subtitle + Count Badge + Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border/40">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 whitespace-nowrap">
                Historial General de Asistencias
              </h3>
              <span className="whitespace-nowrap inline-flex items-center px-2.5 py-0.5 rounded-full bg-secondary border border-border text-[10px] font-bold text-foreground shrink-0">
                {filteredHistory.length} de {historyList.length} registros
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Registros detallados de accesos por escaneo QR, geolocalización GPS y recepción manual.
            </p>
          </div>

          {/* Top Actions: Export & Delete */}
          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            {/* Export CSV */}
            <Button
              size="sm"
              variant="outline"
              className="rounded-xl gap-1.5 text-xs h-8 px-3"
              onClick={handleExport}
            >
              <Download className="h-3.5 w-3.5" /> Exportar CSV
            </Button>

            {/* Clear / Delete History Button */}
            <Button
              size="sm"
              variant="outline"
              className="rounded-xl gap-1.5 text-xs h-8 px-3 border-destructive/40 text-destructive hover:bg-destructive/10"
              onClick={() => {
                setClearConfirmInput("");
                setIsClearModalOpen(true);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" /> Eliminar Historial
            </Button>
          </div>
        </div>

        {/* Toolbar: Search & Filter Pills Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-muted/30 p-3 rounded-2xl border border-border/60">
          {/* Search Input */}
          <div className="relative shrink-0">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar socio o clase..."
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              className="pl-9 pr-4 h-9 w-full sm:w-56 rounded-xl border border-border bg-background text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring shadow-xs"
            />
          </div>

          {/* Filter Pills Group */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Date Filter */}
            <div className="flex bg-muted p-1 rounded-xl gap-1 text-xs border border-border/50">
              {["Todos", "Hoy", "Ayer", "Esta Semana"].map((d) => (
                <button
                  key={d}
                  onClick={() => setDateFilter(d)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition whitespace-nowrap ${
                    dateFilter === d
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Method Filter */}
            <div className="flex bg-muted p-1 rounded-xl gap-1 text-xs border border-border/50">
              {["Todos", "Scan QR", "Geolocalización GPS", "Recepción"].map((m) => (
                <button
                  key={m}
                  onClick={() => setMethodFilter(m)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition whitespace-nowrap ${
                    methodFilter === m
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Limpiar Filtros Button (Only visible when active filters exist) */}
            {(historySearch !== "" || dateFilter !== "Todos" || methodFilter !== "Todos") && (
              <Button
                size="sm"
                variant="ghost"
                className="rounded-xl gap-1 text-xs h-8 px-2.5 text-muted-foreground hover:text-foreground border border-border/60 bg-background"
                onClick={() => {
                  setHistorySearch("");
                  setDateFilter("Todos");
                  setMethodFilter("Todos");
                }}
              >
                <X className="h-3.5 w-3.5" /> Limpiar Filtros
              </Button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden border border-border rounded-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted font-bold text-muted-foreground border-b border-border text-[11px] uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Socio</th>
                <th className="p-3.5">Fecha</th>
                <th className="p-3.5">Hora de Entrada</th>
                <th className="p-3.5">Método de Acceso</th>
                <th className="p-3.5">Validación / Distancia</th>
                <th className="p-3.5">Clase / Actividad</th>
                <th className="p-3.5 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground text-xs">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Filter className="w-8 h-8 text-muted-foreground/40" />
                      <p className="font-semibold text-foreground">No se encontraron asistencias</p>
                      <p className="text-[11px] text-muted-foreground">
                        No hay coincidencias con los criterios de búsqueda o filtros seleccionados.
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 rounded-full text-xs gap-1 border-border"
                        onClick={() => {
                          setHistorySearch("");
                          setDateFilter("Todos");
                          setMethodFilter("Todos");
                        }}
                      >
                        <X className="w-3 h-3" /> Restablecer filtros
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredHistory.map((h) => (
                  <tr key={h.id} className="hover:bg-secondary/20 transition">
                    <td className="p-3.5 font-semibold text-foreground">{h.name}</td>
                    <td className="p-3.5 text-muted-foreground">{h.date}</td>
                    <td className="p-3.5 text-foreground font-medium">{h.time}</td>
                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] bg-secondary border border-border font-semibold text-foreground">
                        {h.method === "Scan QR" && <Scan className="w-3.5 h-3.5 text-emerald-500" />}
                        {h.method === "Geolocalización GPS" && <Navigation className="w-3.5 h-3.5 text-blue-500" />}
                        {h.method === "Recepción" && <DoorOpen className="w-3.5 h-3.5 text-amber-500" />}
                        {h.method}
                      </span>
                    </td>
                    <td className="p-3.5 text-muted-foreground text-[11px]">{h.distance}</td>
                    <td className="p-3.5 text-foreground font-medium">{h.class}</td>
                    <td className="p-3.5 text-right">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                          h.status === "Presente"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                            : "bg-destructive/10 text-destructive border-destructive/30"
                        }`}
                      >
                        {h.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete History Strict Confirmation Dialog */}
      <Dialog open={isClearModalOpen} onOpenChange={setIsClearModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border border-border bg-card p-6 gap-4">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-destructive flex items-center gap-2">
              <Trash2 className="w-5 h-5" /> Eliminar Historial de Asistencias
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Esta acción eliminará de forma permanente todos los registros de asistencias del gimnasio. Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 space-y-3 text-xs text-destructive">
            <span className="font-bold block">Confirmación de seguridad requerida:</span>
            <p className="text-[11px] opacity-90 leading-normal">
              Escribe la palabra <strong className="underline uppercase font-black">Eliminar</strong> en el campo a continuación para habilitar la confirmación:
            </p>
            <input
              type="text"
              placeholder="Escribe 'Eliminar'"
              value={clearConfirmInput}
              onChange={(e) => setClearConfirmInput(e.target.value)}
              className="w-full h-9 px-3 rounded-xl border border-destructive/40 bg-background text-foreground text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-destructive"
            />
          </div>

          <div className="flex gap-2 justify-end pt-2 border-t border-border">
            <Button
              variant="outline"
              onClick={() => setIsClearModalOpen(false)}
              className="rounded-full text-xs font-semibold"
            >
              Cancelar
            </Button>
            <Button
              disabled={clearConfirmInput.trim().toLowerCase() !== "eliminar"}
              onClick={() => {
                setHistoryList([]);
                setIsClearModalOpen(false);
                setClearConfirmInput("");
                alert("El historial de asistencias ha sido eliminado correctamente.");
              }}
              variant="destructive"
              className="rounded-full text-xs font-bold gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-3.5 h-3.5" /> Confirmar Eliminación
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Shadcn UI: Check-in en Recepción & Validación Presencial */}
      <Dialog open={isCheckInModalOpen} onOpenChange={setIsCheckInModalOpen}>
        <DialogContent className="max-w-xl max-h-[85vh] rounded-3xl p-6 border-border shadow-2xl bg-slate-50 dark:bg-background overflow-hidden flex flex-col">
          <DialogHeader className="pb-3 border-b border-border/40 shrink-0">
            <DialogTitle className="text-lg font-black text-foreground flex items-center gap-2">
              <DoorOpen className="h-5 w-5 text-amber-500" /> Check-in en Recepción (Validación Presencial)
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed pt-1">
              Busca un alumno por nombre, DNI o teléfono. El sistema resalta automáticamente a los socios con reserva en las clases de hoy.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-3 overflow-hidden flex flex-col flex-1">
            {/* Buscador */}
            <div className="relative shrink-0">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por DNI, Nombre o Teléfono..."
                value={receptionSearchTerm}
                onChange={(e) => setReceptionSearchTerm(e.target.value)}
                className="pl-10 rounded-xl text-xs bg-secondary/30 border-border/60 h-10"
                autoFocus
              />
            </div>

            {/* Lista de Alumnos */}
            <div className="max-h-[380px] overflow-y-auto custom-scrollbar space-y-2.5 pr-1 flex-1">
              {availableMembersForCheckIn.map((m: any) => {
                const nameKey = (m.name || "").toLowerCase().trim();
                const bookings = memberBookings[nameKey] || [];
                const activeBooking = bookings.find((b) => !b.isPresent) || bookings[0];

                const isAptoExpired =
                  m.hasApto !== "Entregado" ||
                  (m.hasApto === "Entregado" && m.aptoExp && new Date(m.aptoExp) < new Date());

                return (
                  <div
                    key={m.name || m.id}
                    className="p-3.5 rounded-2xl border border-border/60 bg-card hover:bg-secondary/30 transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={m.photo || getStudentPhoto(m.name)}
                          alt={m.name}
                          className="h-10 w-10 rounded-full object-cover shrink-0 border border-border/60 shadow-2xs"
                        />
                        <div className="leading-tight min-w-0">
                          <span className="font-bold text-xs text-foreground block truncate">
                            {m.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1.5 flex-wrap mt-0.5">
                            <span className="bg-primary/10 text-primary px-1.5 py-0.2 rounded font-bold">
                              {m.plan || "Pase Libre"}
                            </span>
                            <span>· DNI: {m.dni || "38.412.901"}</span>
                            <span>· {m.status || "Activo"}</span>
                          </span>
                        </div>
                      </div>

                      {/* Apto físico badge */}
                      <span
                        className={cn(
                          "text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 border",
                          isAptoExpired
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        )}
                      >
                        {isAptoExpired ? "Apto Pendiente" : "Apto Vigente"}
                      </span>
                    </div>

                    {/* Ficha de Reserva Próxima de la Clase */}
                    {activeBooking ? (
                      <div className="p-2.5 rounded-xl bg-secondary/50 border border-border/40 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="relative flex h-2 w-2 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                          </span>
                          <div className="text-[11px] font-medium text-foreground truncate">
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                              Reserva Próxima Hoy:
                            </span>{" "}
                            {activeBooking.className} ({activeBooking.time} hs)
                          </div>
                        </div>

                        {activeBooking.isPresent ? (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20 shrink-0">
                            ✓ Presente
                          </span>
                        ) : (
                          <Button
                            type="button"
                            size="sm"
                            className="h-7 text-[11px] font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs shrink-0 px-3"
                            onClick={() => {
                              // Perform checkin for this class
                              setClassesList?.((prev: any[]) =>
                                prev.map((c) => {
                                  if (c.id === activeBooking.classId) {
                                    const copyAtt = { ...(c.attendance || {}) };
                                    copyAtt[activeBooking.spotIndex] = "present";
                                    return { ...c, attendance: copyAtt };
                                  }
                                  return c;
                                })
                              );

                              // Add to recent checkins list
                              const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                              setRecentCheckinsList((prev) => [
                                {
                                  name: m.name,
                                  time: nowTime,
                                  method: "Recepción",
                                  alert: isAptoExpired ? "Apto Pendiente" : null,
                                  alertColor: isAptoExpired ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : "",
                                  photo: m.photo || getStudentPhoto(m.name),
                                },
                                ...prev,
                              ]);

                              toast.success(
                                `✓ Check-in exitoso: ${m.name} ingresó a ${activeBooking.className} (${activeBooking.time} hs)`
                              );
                              setIsCheckInModalOpen(false);
                            }}
                          >
                            Confirmar Check-in
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="p-2 rounded-xl bg-secondary/30 flex items-center justify-between gap-2">
                        <span className="text-[10.5px] text-muted-foreground italic">
                          Sin reservas próximas para hoy.
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 text-[10.5px] font-bold rounded-xl shrink-0"
                          onClick={() => {
                            const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            setRecentCheckinsList((prev) => [
                              {
                                name: m.name,
                                time: nowTime,
                                method: "Recepción",
                                alert: isAptoExpired ? "Apto Pendiente" : null,
                                alertColor: isAptoExpired ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : "",
                                photo: m.photo || getStudentPhoto(m.name),
                              },
                              ...prev,
                            ]);
                            toast.success(`✓ Ingreso general a sala registrado para ${m.name}`);
                            setIsCheckInModalOpen(false);
                          }}
                        >
                          Ingreso General
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}

              {availableMembersForCheckIn.length === 0 && (
                <p className="text-xs text-muted-foreground italic text-center py-8">
                  No se encontraron alumnos que coincidan con la búsqueda.
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

type ClassItem = {
  id: string;
  name: string;
  staffId: string;
  time: string;
  capacity: number;
  booked: number;
  enrolledSpots: { [spotIndex: number]: string };
  branchId?: string;
  salaId?: string;
  day: number;
  creditsCost?: number;
  layout?: boolean[];
  attendance?: { [spotIndex: number]: "presente" | "ausente" | "pendiente" };
  waitlist?: string[];
  releasedSpots?: { [spotIndex: number]: { originalStudent: string; creditsCost: number } };
  status?: "activa" | "cancelada";
  weekOffset?: number;
  ratings?: { [studentName: string]: { stars: number; comment?: string } };
  seekingBackup?: boolean;
};

const DAY_NAMES_ES = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

function MiembrosTab({
  classesList,
  membersList,
  setMembersList,
  membershipsList,
  setCashTransactions,
  currentUser,
}: any) {
  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState("name_asc");
  const [renewMemberId, setRenewMemberId] = useState<string | null>(null);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [renewMonths, setRenewMonths] = useState<string>("1");

  // Check-in and Receipt states
  const [checkInQuery, setCheckInQuery] = useState("");
  const [checkInResult, setCheckInResult] = useState<any | null>(null);
  const [viewingReceipt, setViewingReceipt] = useState<any | null>(null);

  const handleCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkInQuery.trim()) return;

    const member = membersList.find(
      (m: any) =>
        m.name.toLowerCase().includes(checkInQuery.toLowerCase()) ||
        (m.dni && m.dni === checkInQuery),
    );

    if (!member) {
      setCheckInResult({
        success: false,
        message: "Alumno no encontrado. Verifique el DNI o nombre.",
      });
      return;
    }

    const isAptoExpired =
      member.hasApto !== "Entregado" ||
      (member.hasApto === "Entregado" && member.aptoExp && new Date(member.aptoExp) < new Date());

    let status = "allowed";
    let message = "";
    if (member.status === "activo" && !isAptoExpired) {
      status = "allowed";
      message = "Ingreso autorizado. Plan activo y apto físico vigente.";
    } else if (member.status === "activo" && isAptoExpired) {
      status = "conditional";
      message =
        "Ingreso condicional. Plan activo pero Apto Físico VENCIDO o PENDIENTE. Exigir certificado.";
    } else {
      status = "denied";
      message = `Ingreso denegado. Estado de membresía: ${member.status.toUpperCase()}. Registrar pago para habilitar.`;
    }

    setCheckInResult({
      success: true,
      member,
      status,
      message,
    });
  };

  const handleConfirmCheckIn = () => {
    if (!checkInResult || !checkInResult.member) return;

    // Simulate logging attendance by pushing to checking history or adding a generic check-in
    setCheckInResult(null);
    setCheckInQuery("");
    alert(`Asistencia registrada con éxito para ${checkInResult.member.name}`);
  };

  const filteredMembers = useMemo(() => {
    let result = membersList.filter((m: any) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.dni && m.dni.includes(searchTerm));
      if (!matchesSearch) return false;

      if (filterStatus === "all") return true;
      if (filterStatus === "activos") return m.status === "activo";
      if (filterStatus === "vencidos") return m.status === "vencido" || m.status === "pendiente";
      if (filterStatus === "apto")
        return (
          m.hasApto !== "Entregado" ||
          (m.hasApto === "Entregado" && m.aptoExp && new Date(m.aptoExp) < new Date())
        );
      return true;
    });

    return result.sort((a: any, b: any) => {
      if (sortOrder === "name_asc") return a.name.localeCompare(b.name);
      if (sortOrder === "name_desc") return b.name.localeCompare(a.name);
      if (sortOrder === "end_date_asc") {
        return (
          new Date(a.end.split("/").reverse().join("-")).getTime() -
          new Date(b.end.split("/").reverse().join("-")).getTime()
        );
      }
      if (sortOrder === "end_date_desc") {
        return (
          new Date(b.end.split("/").reverse().join("-")).getTime() -
          new Date(a.end.split("/").reverse().join("-")).getTime()
        );
      }
      return 0;
    });
  }, [membersList, searchTerm, filterStatus, sortOrder]);

  // Form state
  const [newMember, setNewMember] = useState({
    name: "",
    phone: "",
    email: "",
    dni: "",
    dob: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    medicalInsurance: "",
    affiliateNumber: "",
    hasApto: "Pendiente",
    aptoExp: "",
    plan: "",
    status: "activo",
    end: "",
    medicalNotes: "",
    aptoDocUrl: "",
  });

  const handleAddMember = () => {
    if (editingMemberId) {
      setMembersList((prev: any) =>
        prev.map((m: any) => {
          if (m.name === editingMemberId) {
            return {
              ...m,
              ...newMember,
              color:
                newMember.status === "activo"
                  ? "text-primary bg-primary/"
                  : newMember.status === "pendiente"
                    ? "text-secondary-foreground bg-secondary/"
                    : newMember.status === "cancelado"
                      ? "text-neutral-500 bg-neutral-500/10"
                      : "text-destructive bg-destructive/",
              photo: m.photo,
            };
          }
          return m;
        }),
      );
    } else {
      const initialPayments =
        newMember.status === "activo"
          ? [
              {
                id: "pay_" + Math.random().toString(36).substr(2, 9),
                date: new Date().toISOString().split("T")[0],
                amount:
                  membershipsList?.find((m: any) => m.name === newMember.plan)?.price || 18000,
                method: "Efectivo",
                duration: "1 Mes",
              },
            ]
          : [];

      const memberToAdd = {
        ...newMember,
        color:
          newMember.status === "activo"
            ? "text-primary bg-primary/"
            : newMember.status === "pendiente"
              ? "text-secondary-foreground bg-secondary/"
              : "text-destructive bg-destructive/",
        photo: "https://api.dicebear.com/7.x/initials/svg?seed=" + newMember.name,
        payments: initialPayments,
      };
      setMembersList([memberToAdd, ...membersList]);
    }
    setIsAddOpen(false);
    setEditingMemberId(null);
    setNewMember({
      name: "",
      phone: "",
      email: "",
      dni: "",
      dob: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      medicalInsurance: "",
      affiliateNumber: "",
      hasApto: "Pendiente",
      aptoExp: "",
      plan: "",
      status: "activo",
      end: "",
      medicalNotes: "",
      aptoDocUrl: "",
    });
  };

  const handleEditMemberClick = (m: any) => {
    setNewMember({
      name: m.name || "",
      phone: m.phone || "",
      email: m.email || "",
      dni: m.dni || "",
      dob: m.dob || "",
      emergencyContactName: m.emergencyContactName || "",
      emergencyContactPhone: m.emergencyContactPhone || "",
      medicalInsurance: m.medicalInsurance || "",
      affiliateNumber: m.affiliateNumber || "",
      hasApto: m.hasApto || "Pendiente",
      aptoExp: m.aptoExp || "",
      plan: m.plan || "",
      status: m.status || "activo",
      end: m.end || "",
      medicalNotes: m.medicalNotes || "",
      aptoDocUrl: m.aptoDocUrl || "",
    });
    setEditingMemberId(m.name);
    setIsAddOpen(true);
  };

  const handleCancelPlan = (memberName: string) => {
    setMembersList((prev: any) =>
      prev.map((m: any) =>
        m.name === memberName
          ? { ...m, status: "cancelado", color: "text-neutral-500 bg-neutral-500/10" }
          : m,
      ),
    );
  };

  const handleDeleteMember = (memberName: string) => {
    if (window.confirm(`¿Seguro que deseas eliminar definitivamente a ${memberName}?`)) {
      setMembersList((prev: any) => prev.filter((m: any) => m.name !== memberName));
    }
  };

  // Build attendance history per member from classesList (no new state)
  const getMemberHistory = (memberName: string) => {
    const attended: {
      className: string;
      day: string;
      time: string;
      staffId: string;
      rating?: { stars: number; comment?: string };
    }[] = [];
    const enrolled: { className: string; day: string; time: string }[] = [];

    (classesList || []).forEach((c: any) => {
      const enrolledEntry = Object.entries(c.enrolledSpots || {}).find(
        ([, name]) => name === memberName,
      );
      if (!enrolledEntry) return;
      const spotIdx = parseInt(enrolledEntry[0]);
      const att = c.attendance?.[spotIdx];
      const dayLabel = DAY_NAMES_ES[c.day] ?? `Día ${c.day}`;

      if (att === "presente") {
        attended.push({
          className: c.name,
          day: dayLabel,
          time: c.time,
          staffId: c.staffId,
          rating: c.ratings?.[memberName],
        });
      } else if (!att || att === "pendiente") {
        enrolled.push({ className: c.name, day: dayLabel, time: c.time });
      }
    });

    const totalEnrolled =
      attended.length +
      enrolled.length +
      classesList.filter(
        (c: any) =>
          Object.values(c.enrolledSpots || {}).includes(memberName) &&
          c.attendance &&
          Object.entries(c.enrolledSpots || {}).some(
            ([idx, name]) => name === memberName && c.attendance?.[parseInt(idx)] === "ausente",
          ),
      ).length;

    const attendanceRate =
      totalEnrolled > 0 ? Math.round((attended.length / totalEnrolled) * 100) : null;
    const lastClass = attended[attended.length - 1];
    // ponytail: "churn risk" is purely demo logic — days since last class from seed data
    const isChurnRisk = attended.length === 0 || (attended.length <= 1 && enrolled.length === 0);

    return { attended, enrolled, attendanceRate, lastClass, isChurnRisk };
  };

  const stats = useMemo(() => {
    let actives = 0;
    let debts = 0;
    let expiredAptos = 0;
    let churnRisks = 0;

    membersList.forEach((m: any) => {
      if (m.status === "activo") actives++;
      if (m.status === "vencido" || m.status === "pendiente") debts++;

      const isAptoExpired =
        m.hasApto !== "Entregado" ||
        (m.hasApto === "Entregado" && m.aptoExp && new Date(m.aptoExp) < new Date());
      if (isAptoExpired) expiredAptos++;

      const history = getMemberHistory(m.name);
      if (history.isChurnRisk) churnRisks++;
    });

    return { actives, debts, expiredAptos, churnRisks };
  }, [membersList, classesList]);

  const handleRenewMember = () => {
    if (!renewMemberId) return;

    setMembersList((prev: any) =>
      prev.map((m: any) => {
        if (m.name === renewMemberId) {
          const currentEnd = new Date(m.end);
          let nextEndStr = "";
          const monthsToAdd = parseInt(renewMonths);

          if (isNaN(currentEnd.getTime())) {
            const nextDate = new Date();
            nextDate.setMonth(nextDate.getMonth() + monthsToAdd);
            nextEndStr = nextDate.toISOString().split("T")[0];
          } else {
            currentEnd.setMonth(currentEnd.getMonth() + monthsToAdd);
            nextEndStr = currentEnd.toISOString().split("T")[0];
          }

          const planPrice = membershipsList?.find((p: any) => p.name === m.plan)?.price || 18000;
          const totalAmount = planPrice * monthsToAdd;
          const newPayment = {
            id: "pay_" + Math.random().toString(36).substr(2, 9),
            date: new Date().toISOString().split("T")[0],
            amount: totalAmount,
            method: "Efectivo",
            duration: monthsToAdd === 1 ? "1 Mes" : `${monthsToAdd} Meses`,
          };

          if (setCashTransactions) {
            setCashTransactions((prevTx: any) => [
              {
                id: `tx-renew-${Date.now()}`,
                date: new Date().toISOString().split("T")[0],
                type: "income",
                channel: "cash",
                description: `Renovación Membresía (${monthsToAdd}m) - ${m.name}`,
                amount: totalAmount,
                registeredBy: currentUser?.name || "Recepción",
              },
              ...prevTx,
            ]);
          }

          const existingPayments = m.payments || [];
          return {
            ...m,
            status: "activo",
            debtAmount: 0,
            end: nextEndStr,
            color: "text-primary bg-primary/",
            payments: [newPayment, ...existingPayments],
          };
        }
        return m;
      }),
    );
    setRenewMemberId(null);
    setRenewMonths("1");
  };

  const handleFreezeMember = (memberName: string) => {
    const daysStr = prompt(
      `Congelar Membresía para ${memberName}.\n\n¿Por cuántos días deseas pausar la membresía?`,
      "15",
    );
    if (!daysStr) return;
    const days = parseInt(daysStr);
    if (isNaN(days) || days <= 0) return;

    setMembersList((prev: any) =>
      prev.map((m: any) => {
        if (m.name === memberName) {
          return {
            ...m,
            status: "congelado",
            color: "text-muted-foreground bg-secondary/50",
            notes:
              (m.notes || "") +
              ` | Congelado ${days}d desde ${new Date().toISOString().split("T")[0]}`,
          };
        }
        return m;
      }),
    );
  };

  const handleValidateApto = (memberName: string) => {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const expDate = nextYear.toISOString().split("T")[0];

    setMembersList((prev: any) =>
      prev.map((m: any) => {
        if (m.name === memberName) {
          return {
            ...m,
            hasApto: "Entregado",
            aptoExp: expDate,
          };
        }
        return m;
      }),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Administración de Miembros</h2>
          <p className="text-sm text-muted-foreground">
            Listado general de alumnos registrados en tu gimnasio.
          </p>
        </div>
        <Button size="sm" className="rounded-xl gap-1.5" onClick={() => setIsAddOpen(true)}>
          <Plus className="h-4 w-4" /> Agregar Miembro
        </Button>
      </div>

      <Dialog
        open={isAddOpen}
        onOpenChange={(val) => {
          setIsAddOpen(val);
          if (!val) setEditingMemberId(null);
        }}
      >
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="mb-4">
            <DialogTitle>{editingMemberId ? "Editar Miembro" : "Nuevo Miembro"}</DialogTitle>
            <p className="text-sm text-muted-foreground">
              {editingMemberId
                ? "Modificá los datos del alumno."
                : "Completá los datos del alumno. Los campos de salud y prepaga son fundamentales para la cobertura."}
            </p>
          </DialogHeader>
          <div className="space-y-6">
            {/* Datos Personales */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider">
                A. Datos Personales
              </h3>
              <div className="space-y-2">
                <Label>Nombre Completo</Label>
                <Input
                  placeholder="Ej. Juan Pérez"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>DNI</Label>
                  <Input
                    placeholder="Sin puntos"
                    value={newMember.dni}
                    onChange={(e) => setNewMember({ ...newMember, dni: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fecha de Nacimiento</Label>
                  <Input
                    type="date"
                    value={newMember.dob}
                    onChange={(e) => setNewMember({ ...newMember, dob: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Teléfono</Label>
                  <Input
                    placeholder="+54 9 11..."
                    value={newMember.phone}
                    onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="juan@email.com"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Salud y Legal */}
            <div className="space-y-4 pt-4 border-t border-border/50">
              <h3 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider">
                B. Salud y Legal
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Contacto de Emergencia</Label>
                  <Input
                    placeholder="Nombre"
                    value={newMember.emergencyContactName}
                    onChange={(e) =>
                      setNewMember({ ...newMember, emergencyContactName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tel. de Emergencia</Label>
                  <Input
                    placeholder="Teléfono"
                    value={newMember.emergencyContactPhone}
                    onChange={(e) =>
                      setNewMember({ ...newMember, emergencyContactPhone: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Obra Social / Prepaga</Label>
                  <Input
                    placeholder="Ej. OSDE"
                    value={newMember.medicalInsurance}
                    onChange={(e) =>
                      setNewMember({ ...newMember, medicalInsurance: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nro de Afiliado</Label>
                  <Input
                    placeholder="Número"
                    value={newMember.affiliateNumber}
                    onChange={(e) =>
                      setNewMember({ ...newMember, affiliateNumber: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="bg-secondary/30 p-3 rounded-lg border border-border/50 space-y-4">
                <div className="space-y-2">
                  <Label>Apto Médico Físico</Label>
                  <Select
                    value={newMember.hasApto}
                    onValueChange={(val) => setNewMember({ ...newMember, hasApto: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Estado del Apto Médico" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Entregado">Entregado y Vigente</SelectItem>
                      <SelectItem value="Pendiente">Pendiente de Entrega</SelectItem>
                      <SelectItem value="No Aplica">No Aplica / Eximido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newMember.hasApto === "Entregado" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in zoom-in-95">
                    <div className="space-y-2">
                      <Label>Vencimiento del Apto</Label>
                      <Input
                        type="date"
                        value={newMember.aptoExp}
                        onChange={(e) => setNewMember({ ...newMember, aptoExp: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Subir Certificado (PDF/Imagen)</Label>
                      <Input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewMember((prev) => ({
                                ...prev,
                                aptoDocUrl: reader.result as string,
                              }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="h-9 py-1 text-xs cursor-pointer bg-background"
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Notas Médicas / Alergias / Lesiones</Label>
                <textarea
                  value={newMember.medicalNotes}
                  onChange={(e) => setNewMember({ ...newMember, medicalNotes: e.target.value })}
                  placeholder="Ej: Problemas lumbares, asma, etc."
                  className="w-full min-h-[80px] rounded-lg border border-border bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </div>

            {/* Comercial */}
            <div className="space-y-4 pt-4 border-t border-border/50">
              <h3 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider">
                C. Comercial
              </h3>
              <div className="space-y-2">
                <Label>Plan de Membresía</Label>
                <Select
                  value={newMember.plan}
                  onValueChange={(val) => setNewMember({ ...newMember, plan: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar Plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {membershipsList?.map((m: any) => (
                      <SelectItem key={m.id} value={m.name}>
                        {m.name}
                      </SelectItem>
                    )) || <SelectItem value="Pase Libre">Pase Libre</SelectItem>}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Estado de Cuenta</Label>
                  <Select
                    value={newMember.status}
                    onValueChange={(val) => setNewMember({ ...newMember, status: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activo">Activo</SelectItem>
                      <SelectItem value="pendiente">Pago Pendiente</SelectItem>
                      <SelectItem value="vencido">Vencido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Vencimiento del Plan</Label>
                  <Input
                    type="date"
                    value={newMember.end}
                    onChange={(e) => setNewMember({ ...newMember, end: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-8 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddMember} disabled={!newMember.name || !newMember.dni}>
              {editingMemberId ? "Guardar Cambios" : "Guardar Alumno"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Panel de KPIs */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className=" border-border">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Alumnos Activos
              </p>
              <h3 className="text-2xl font-black text-primary mt-1">{stats.actives}</h3>
            </div>
            <Users className="h-8 w-8 text-primary/20" />
          </CardContent>
        </Card>
        <Card className=" border-border">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                En Mora / Deuda
              </p>
              <h3 className="text-2xl font-black text-destructive mt-1">{stats.debts}</h3>
            </div>
            <CreditCard className="h-8 w-8 text-destructive/20" />
          </CardContent>
        </Card>
        <Card className=" border-border">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Apto Vencido</p>
              <h3 className="text-2xl font-black text-secondary-foreground mt-1">
                {stats.expiredAptos}
              </h3>
            </div>
            <AlertCircle className="h-8 w-8 text-secondary-foreground/20" />
          </CardContent>
        </Card>
        <Card className=" border-border">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Riesgo de Baja
              </p>
              <h3 className="text-2xl font-black text-purple-600 mt-1">{stats.churnRisks}</h3>
            </div>
            <ShieldAlert className="h-8 w-8 text-purple-500/20" />
          </CardContent>
        </Card>
      </div>



      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Toolbar integrada en la tabla */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o DNI..."
              className="pl-9 bg-transparent -none border-border h-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[160px] h-9 bg-transparent -none border-border">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="activos">Activos</SelectItem>
                <SelectItem value="vencidos">Deuda / Vencidos</SelectItem>
                <SelectItem value="apto">Apto Vencido</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-full sm:w-[180px] h-9 bg-transparent -none border-border">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name_asc">Nombre (A-Z)</SelectItem>
                <SelectItem value="name_desc">Nombre (Z-A)</SelectItem>
                <SelectItem value="end_date_asc">Vencimiento (Próximos)</SelectItem>
                <SelectItem value="end_date_desc">Vencimiento (Lejanos)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Miembro</th>
                <th className="px-6 py-4 font-medium">Contacto</th>
                <th className="px-6 py-4 font-medium">Membresía</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium">Asistencia</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredMembers.map((m: any) => {
                const isOpen = expandedMember === m.name;
                const history = getMemberHistory(m.name);

                return (
                  <Fragment key={m.name}>
                    <tr
                      className={`hover:bg-muted/30 transition-colors cursor-pointer ${isOpen ? "bg-muted/30" : ""}`}
                      onClick={() => setExpandedMember(isOpen ? null : m.name)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={m.photo}
                            alt={m.name}
                            className="h-10 w-10 rounded-full object-cover border border-border/40 shrink-0"
                          />
                          <span className="font-medium text-foreground">{m.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-muted-foreground">
                            {m.email || m.name.toLowerCase().replace(/ /g, "") + "@email.com"}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs">{m.phone}</span>
                            <a
                              href={`https://wa.me/${m.phone.replace(/[^0-9]/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-500 hover:text-green-600 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-medium">{m.plan}</span>
                          <span className="text-[11px] text-muted-foreground">Vence: {m.end}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${m.color}`}
                        >
                          {m.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 items-start">
                          {history.attendanceRate !== null ? (
                            <span
                              className={`font-semibold text-xs ${
                                history.attendanceRate >= 70
                                  ? "text-primary"
                                  : history.attendanceRate >= 40
                                    ? "text-secondary-foreground"
                                    : "text-destructive"
                              }`}
                            >
                              {history.attendanceRate}%
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                          {history.isChurnRisk && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-destructive/ text-destructive border border-destructive/">
                              ⚠️ Riesgo Baja
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-full"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={() => setRenewMemberId(m.name)}>
                                  <CreditCard className="h-4 w-4 mr-2" /> Renovar / Cobrar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleFreezeMember(m.name)}>
                                  <Snowflake className="h-4 w-4 mr-2 text-blue-400" /> Congelar
                                  Membresía
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleValidateApto(m.name)}>
                                  <CheckCircle2 className="h-4 w-4 mr-2 text-primary" /> Validar
                                  Apto Médico
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditMemberClick(m)}>
                                  <Edit2 className="h-4 w-4 mr-2" /> Editar Alumno
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-secondary-foreground focus:text-secondary-foreground"
                                  onClick={() => handleCancelPlan(m.name)}
                                >
                                  <ShieldAlert className="h-4 w-4 mr-2" /> Dar de baja
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleDeleteMember(m.name)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <span
                            className={`text-base text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                          >
                            ▾
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded accordion: history & details */}
                    {isOpen && (
                      <tr className="bg-secondary/5 border-b border-border/40">
                        <td colSpan={6} className="p-0">
                          <div className="p-6 space-y-5 animate-fade-in border-t border-border/40 bg-card/40">
                            {/* Sub-header with key member details */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                              <div className="flex items-center gap-3.5">
                                <img
                                  src={m.photo}
                                  alt={m.name}
                                  className="h-12 w-12 rounded-full object-cover border-2 border-primary/20 shrink-0"
                                />
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-base text-foreground">{m.name}</h4>
                                    <span
                                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${m.color}`}
                                    >
                                      {m.status}
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-0.5">
                                    {m.dni && <span>DNI: <strong className="text-foreground font-semibold">{m.dni}</strong></span>}
                                    {m.dob && <span>Nac: <strong className="text-foreground font-semibold">{m.dob}</strong></span>}
                                    <span>Plan: <strong className="text-foreground font-semibold">{m.plan}</strong></span>
                                    <span>Vence: <strong className="text-foreground font-semibold">{m.end}</strong></span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="rounded-xl text-xs font-bold gap-1.5 h-8 border-border hover:bg-secondary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setRenewMemberId(m.name);
                                  }}
                                >
                                  <CreditCard className="w-3.5 h-3.5 text-primary" /> Renovar
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="rounded-xl text-xs font-bold gap-1.5 h-8 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleValidateApto(m.name);
                                  }}
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Validar Apto
                                </Button>
                              </div>
                            </div>

                            <Separator />

                            {/* Metric Stats Cards */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              <div className="bg-card border border-border/50 rounded-2xl p-3.5 text-center shadow-none transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-border/80">
                                <div className="text-xl font-black text-primary">
                                  {history.attended.length}
                                </div>
                                <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5">
                                  Clases Asistidas
                                </div>
                              </div>
                              <div className="bg-card border border-border/50 rounded-2xl p-3.5 text-center shadow-none transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-border/80">
                                <div className="text-xl font-black text-primary">
                                  {history.enrolled.length}
                                </div>
                                <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5">
                                  Próximas Agendadas
                                </div>
                              </div>
                              <div className="bg-card border border-border/50 rounded-2xl p-3.5 text-center shadow-none transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-border/80">
                                <div
                                  className={`text-xl font-black ${
                                    history.attendanceRate === null
                                      ? "text-muted-foreground"
                                      : history.attendanceRate >= 70
                                        ? "text-emerald-600 dark:text-emerald-400"
                                        : history.attendanceRate >= 40
                                          ? "text-amber-500"
                                          : "text-destructive"
                                  }`}
                                >
                                  {history.attendanceRate !== null
                                    ? `${history.attendanceRate}%`
                                    : "—"}
                                </div>
                                <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5">
                                  Tasa de Asistencia
                                </div>
                              </div>
                              <div className="bg-card border border-border/50 rounded-2xl p-3.5 text-center shadow-none transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-border/80 flex flex-col justify-center items-center">
                                <div className="text-xs font-bold text-foreground truncate mt-0.5">
                                  {history.lastClass ? `${history.lastClass.day}` : "—"}
                                </div>
                                <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5">
                                  Última Asistencia
                                </div>
                              </div>
                            </div>

                            {/* Churn Alert (if risk) */}
                            {history.isChurnRisk && (
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-destructive/10 border border-destructive/30 rounded-2xl text-xs text-destructive">
                                <div className="flex items-start gap-2.5">
                                  <AlertCircle className="w-4 h-4 shrink-0 text-destructive mt-0.5" />
                                  <div>
                                    <div className="font-bold">Riesgo de Baja Detectado</div>
                                    <div className="text-[11px] opacity-90 mt-0.5 leading-relaxed">
                                      Este alumno no registra asistencias recientes. Te sugerimos contactarlo para retenerlo.
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold gap-1 text-[11px] h-8 shrink-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const cleanedPhone = m.phone.replace(/[^0-9]/g, "");
                                    const text = encodeURIComponent(
                                      `¡Hola ${m.name}! Te extrañamos en Studio Pulse. Notamos que hace unos días no vienes a entrenar y queríamos saber si estaba todo bien o si necesitabas ayuda con tus reservas. ¡Te esperamos! 💪`,
                                    );
                                    window.open(
                                      `https://wa.me/${cleanedPhone || "5491100000000"}?text=${text}`,
                                      "_blank",
                                    );
                                  }}
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  <span>Enviar WhatsApp</span>
                                </Button>
                              </div>
                            )}

                            <Separator />

                            {/* Detailed Information Grid - Flat Default & Floating Hover (Equal Heights) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full items-stretch">
                              {/* Ficha Médica Card */}
                              <div className="group rounded-3xl border border-border bg-card p-5 space-y-4 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg shadow-xs h-full flex flex-col justify-between">
                                <div className="space-y-3.5">
                                  <div className="flex items-center justify-between pb-2 border-b border-border/40">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                                      Salud & Emergencia
                                    </span>
                                    <span className="text-[10px] text-muted-foreground/70 font-semibold uppercase tracking-wider">
                                      Ficha Médica
                                    </span>
                                  </div>

                                  <div className="space-y-2 text-xs">
                                    <div className="flex justify-between items-center py-1">
                                      <span className="text-muted-foreground font-semibold">Obra Social / Prepaga:</span>
                                      <span className="font-bold text-foreground">
                                        {m.medicalInsurance || "No declarada"}
                                        {m.affiliateNumber && ` (${m.affiliateNumber})`}
                                      </span>
                                    </div>

                                    <Separator />

                                    <div className="flex justify-between items-center py-1">
                                      <span className="text-muted-foreground font-semibold">Contacto Emergencia:</span>
                                      <span className="font-bold text-foreground">
                                        {m.emergencyContactName || "No especificado"}
                                        {m.emergencyContactPhone && ` · ${m.emergencyContactPhone}`}
                                      </span>
                                    </div>

                                    <Separator />

                                    <div className="flex justify-between items-center py-1">
                                      <span className="text-muted-foreground font-semibold">Certificado Apto Físico:</span>
                                      <span
                                        className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                                          m.hasApto === "Entregado"
                                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                            : m.hasApto === "Vencido"
                                              ? "bg-destructive/10 text-destructive border border-destructive/20"
                                              : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                                        }`}
                                      >
                                        {m.hasApto === "Entregado"
                                          ? `Vigente (${m.aptoExp || "1 año"})`
                                          : m.hasApto === "Vencido"
                                            ? "Vencido"
                                            : "Pendiente"}
                                      </span>
                                    </div>

                                    {m.aptoDocUrl && (
                                      <div className="pt-1">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="w-full h-8 text-[11px] rounded-xl gap-1.5 font-semibold"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            const win = window.open();
                                            win?.document.write(
                                              `<iframe src="${m.aptoDocUrl}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`,
                                            );
                                          }}
                                        >
                                          <Eye className="w-3.5 h-3.5" /> Ver Documento Adjunto
                                        </Button>
                                      </div>
                                    )}

                                    {m.medicalNotes && (
                                      <>
                                        <Separator />
                                        <div className="space-y-1 pt-1">
                                          <span className="text-muted-foreground font-bold block">
                                            Observaciones Médicas / Lesiones:
                                          </span>
                                          <p className="text-destructive font-semibold leading-relaxed bg-destructive/5 p-2.5 rounded-xl border border-destructive/20 text-[11px]">
                                            {m.medicalNotes}
                                          </p>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Clases Asistidas Card */}
                              <div className="group rounded-3xl border border-border bg-card p-5 space-y-4 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg shadow-xs h-full flex flex-col justify-between">
                                <div className="flex flex-col h-full justify-between space-y-3.5">
                                  <div className="flex items-center justify-between pb-2 border-b border-border/40">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                                      Historial de Clases Asistidas
                                    </span>
                                    <span className="text-[10px] text-muted-foreground/70 font-semibold uppercase tracking-wider">
                                      {history.attended.length} asistencias
                                    </span>
                                  </div>

                                  <div className="flex-1 flex flex-col justify-center">
                                    {history.attended.length > 0 ? (
                                      <div className="overflow-x-auto rounded-2xl border border-border/40 my-auto">
                                        <table className="w-full text-left text-[11px] min-w-[280px]">
                                          <thead>
                                            <tr className="bg-secondary/30 border-b border-border/40 text-muted-foreground font-bold uppercase text-[9.5px]">
                                              <th className="p-2.5">Clase</th>
                                              <th className="p-2.5">Día</th>
                                              <th className="p-2.5">Horario</th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-border/30">
                                            {history.attended.map((h: any, i: number) => (
                                              <tr key={i} className="hover:bg-secondary/20 transition-colors">
                                                <td className="p-2.5 font-bold text-foreground">{h.className}</td>
                                                <td className="p-2.5 text-muted-foreground">{h.day}</td>
                                                <td className="p-2.5 text-muted-foreground">{h.time}</td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    ) : (
                                      <div className="py-8 my-auto text-center">
                                        <p className="text-xs text-muted-foreground italic">
                                          Sin clases asistidas registradas en el sistema.
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Historial de Pagos Card */}
                              <div className="group rounded-3xl border border-border bg-card p-5 space-y-4 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg shadow-xs h-full flex flex-col justify-between">
                                <div className="flex flex-col h-full justify-between space-y-3.5">
                                  <div className="flex items-center justify-between pb-2 border-b border-border/40">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                                      Historial de Pagos
                                    </span>
                                    <span className="text-[10px] text-muted-foreground/70 font-semibold uppercase tracking-wider">
                                      {m.payments?.length || 0} registros
                                    </span>
                                  </div>

                                  <div className="flex-1 flex flex-col justify-center">
                                    {m.payments && m.payments.length > 0 ? (
                                      <div className="overflow-x-auto rounded-2xl border border-border/40 my-auto">
                                        <table className="w-full text-left text-[11px]">
                                          <thead>
                                            <tr className="bg-secondary/30 border-b border-border/40 text-muted-foreground font-bold uppercase text-[9.5px]">
                                              <th className="p-2.5">Fecha</th>
                                              <th className="p-2.5">Plan</th>
                                              <th className="p-2.5">Monto</th>
                                              <th className="p-2.5">Método</th>
                                              <th className="p-2.5 text-right">Recibo</th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-border/30">
                                            {m.payments.map((p: any) => (
                                              <tr key={p.id} className="hover:bg-secondary/20 transition-colors">
                                                <td className="p-2.5 text-muted-foreground">{p.date}</td>
                                                <td className="p-2.5 font-semibold text-foreground">{p.duration}</td>
                                                <td className="p-2.5 font-bold text-primary">${p.amount}</td>
                                                <td className="p-2.5 text-muted-foreground">{p.method}</td>
                                                <td className="p-2.5 text-right">
                                                  <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 text-primary hover:bg-primary/10 rounded-md"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      setViewingReceipt({ member: m, payment: p });
                                                    }}
                                                  >
                                                    <FileText className="w-3.5 h-3.5" />
                                                  </Button>
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    ) : (
                                      <div className="py-8 my-auto text-center">
                                        <p className="text-xs text-muted-foreground italic">
                                          Sin registros de pagos en el historial.
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Próximas Clases Agendadas Card */}
                              <div className="bg-card border border-border/50 rounded-2xl p-4.5 space-y-3.5 shadow-none transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-border/80 focus-within:shadow-md focus-within:-translate-y-0.5 h-full flex flex-col justify-between">
                                <div className="flex flex-col h-full justify-between space-y-3.5">
                                  <div className="flex items-center justify-between pb-2 border-b border-border/40">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                                      Próximas Clases Agendadas
                                    </span>
                                    <span className="text-[10px] text-muted-foreground/70 font-semibold">
                                      {history.enrolled.length} reservas
                                    </span>
                                  </div>

                                  <div className="flex-1 flex flex-col justify-center">
                                    {history.enrolled.length > 0 ? (
                                      <div className="flex flex-wrap gap-2 pt-1 my-auto">
                                        {history.enrolled.map((e: any, i: number) => (
                                          <span
                                            key={i}
                                            className="text-xs bg-primary/10 text-primary font-bold px-3 py-1.5 rounded-xl border border-primary/20 flex items-center gap-1.5"
                                          >
                                            <span className="h-2 w-2 rounded-full bg-primary" />
                                            {e.className} · {e.day} {e.time}
                                          </span>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="py-8 my-auto text-center">
                                        <p className="text-xs text-muted-foreground italic">
                                          Sin reservas o clases agendadas próximamente.
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog
        open={!!renewMemberId}
        onOpenChange={(open) => {
          if (!open) {
            setRenewMemberId(null);
            setRenewMonths("1");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Pago / Renovar Plan</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              ¿Confirmás la renovación del plan para <strong>{renewMemberId}</strong>?
            </p>
            <div className="space-y-2">
              <Label>Duración de la renovación</Label>
              <Select value={renewMonths} onValueChange={setRenewMonths}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar duración" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Mes</SelectItem>
                  <SelectItem value="3">3 Meses (Trimestre)</SelectItem>
                  <SelectItem value="6">6 Meses (Semestre)</SelectItem>
                  <SelectItem value="12">12 Meses (Año)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground bg-primary/ text-primary p-2 rounded-lg border border-primary/">
              Se actualizará su estado a <span className="font-bold">Activo</span> y se extenderá su
              vencimiento por {renewMonths} mes{renewMonths === "1" ? "" : "es"}.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRenewMemberId(null);
                setRenewMonths("1");
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleRenewMember}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Confirmar Pago
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Impresión de Recibo X */}
      <Dialog open={!!viewingReceipt} onOpenChange={(open) => !open && setViewingReceipt(null)}>
        <DialogContent className="max-w-sm font-mono text-xs text-foreground p-6 bg-card border border-border">
          {viewingReceipt && (
            <div className="space-y-4">
              {/* Receipt Visual Design */}
              <div className="border border-border/80 p-4 bg-secondary/ rounded-xl space-y-3 relative overflow-hidden">
                {/* Background "X" watermark */}
                <div className="absolute right-4 top-2 text-[120px] font-black text-foreground/5 pointer-events-none select-none">
                  X
                </div>

                <div className="text-center border-b border-dashed border-border pb-3">
                  <h3 className="font-bold text-sm tracking-wider uppercase">
                    Kraft Strength Club
                  </h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Av. Coronel Díaz 2140, Palermo
                  </p>
                  <p className="text-[9px] text-muted-foreground">C.A.B.A - Argentina</p>
                </div>

                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between font-bold">
                    <span>DOC. NO VÁLIDO COMO FACTURA</span>
                    <span className="px-1.5 py-0.2 bg-black text-white text-[9px] rounded">
                      RECIBO X
                    </span>
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">
                    Nro Recibo: {viewingReceipt.payment.id}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    Fecha: {viewingReceipt.payment.date}
                  </div>
                </div>

                <div className="border-t border-b border-dashed border-border py-2 my-2 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Recibimos de:</span>
                    <span className="font-bold">{viewingReceipt.member.name}</span>
                  </div>
                  {viewingReceipt.member.dni && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">DNI:</span>
                      <span className="font-semibold">{viewingReceipt.member.dni}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Concepto:</span>
                    <span className="font-semibold">
                      Membresía {viewingReceipt.member.plan} ({viewingReceipt.payment.duration})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Forma de Pago:</span>
                    <span className="font-semibold">{viewingReceipt.payment.method}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm pt-1">
                  <span className="font-bold uppercase tracking-wider">Total Pagado:</span>
                  <span className="font-black text-primary text-lg">
                    ${viewingReceipt.payment.amount}
                  </span>
                </div>

                <div className="text-center text-[9px] text-muted-foreground pt-4 border-t border-dashed border-border/60">
                  ¡Gracias por entrenar con nosotros!
                </div>
              </div>
              <DialogFooter className="sm:justify-between flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setViewingReceipt(null)}>
                  Cerrar
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    window.print();
                  }}
                  className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/95"
                >
                  <Download className="w-3.5 h-3.5" /> Imprimir Recibo
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Subcomponent: Membresias Tab
interface Membership {
  id: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  duration: string;
  activeCount: number;
  includedServices: string[];
  tag?: string;
  passType?: string;
  creditsCount?: number | null;
  accessHoursType?: string;
  offPeakStart?: string | null;
  offPeakEnd?: string | null;
  includedActivities?: string[];
  registrationFee?: number | null;
  isMultisede?: boolean;
  freezeDays?: number | null;
  dailyClassLimit?: string | null;
}

interface MembresiasTabProps {
  membershipsList: Membership[];
  setMembershipsList: React.Dispatch<React.SetStateAction<Membership[]>>;
  amenities: { id: string; name: string; category: string; checked: boolean }[];
  branchesList: { id: string; name: string; address: string }[];
}

const FITNESS_ACTIVITIES = [
  "Musculación / Sala de Máquinas",
  "CrossFit WOD",
  "Levantamiento Olímpico",
  "Yoga Vinyasa / Ashtanga",
  "Yoga Hatha / Iyengar",
  "Yoga Bikram / Caliente",
  "Entrenamiento Funcional",
  "Pilates Reformer",
  "Pilates de Suelo (Mat)",
  "Spinning / Ciclismo Indoor",
  "Natación Libre",
  "Natación Escuela (Niños/Adultos)",
  "Acuagym / Fitness Acuático",
  "Calistenia / Street Workout",
  "Boxeo Recreativo",
  "Boxeo de Competición",
  "Kickboxing / K1",
  "Muay Thai / Boxeo Tailandés",
  "Jiu Jitsu Brasileño (BJJ)",
  "MMA (Artes Marciales Mixtas)",
  "Zumba / Ritmos Latinos",
  "Gap (Glúteos, Abdomen, Piernas)",
  "HIIT / Circuitos de Alta Intensidad",
  "Running Club / Running Outdoor",
  "Kettlebells (Pesas Rusas)",
  "Fuerza de Powerlifting",
  "Estiramiento & Flexibilidad",
  "Gimnasia Artística",
  "Taekwondo WT/ITF",
  "Fisioterapia y Kinesiología",
];

const STAFF_SPECIALTY_PRESETS = [
  "CrossFit",
  "Entrenamiento Funcional",
  "Levantamiento Olímpico",
  "Powerlifting",
  "Calistenia",
  "Fuerza de Potencia",
  "Spinning",
  "HIIT / Tabata",
  "Boxeo Recreativo",
  "Kickboxing",
  "Zumba",
  "Ritmos / Dance",
  "Yoga Vinyasa",
  "Yoga Hatha",
  "Pilates Reformer",
  "Pilates Mat",
  "Barré",
  "Estiramiento / Flex",
  "GAP",
  "AquaGym",
  "Running Club",
];

function MembresiasTab({
  membershipsList,
  setMembershipsList,
  amenities,
  branchesList,
}: MembresiasTabProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [periodicity, setPeriodicity] = useState("Mensual");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [tag, setTag] = useState("Pase Libre");

  // Advanced configurations
  const [passType, setPassType] = useState("Pase Libre");
  const [creditsCount, setCreditsCount] = useState("12");
  const [accessHoursType, setAccessHoursType] = useState("Todo Horario");
  const [offPeakStart, setOffPeakStart] = useState("12:00");
  const [offPeakEnd, setOffPeakEnd] = useState("16:00");
  const [searchActivity, setSearchActivity] = useState("");
  const [includedActivities, setIncludedActivities] = useState<string[]>([]);
  const [registrationFee, setRegistrationFee] = useState("0");
  const [freezeDays, setFreezeDays] = useState("0");
  const [dailyClassLimit, setDailyClassLimit] = useState("Ilimitado");

  // Edit / Delete states
  const [editingPlan, setEditingPlan] = useState<Membership | null>(null);
  const [deletingPlan, setDeletingPlan] = useState<Membership | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Temporary Edit Form States
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editOriginalPrice, setEditOriginalPrice] = useState("");
  const [editPeriodicity, setEditPeriodicity] = useState("Mensual");
  const [editTag, setEditTag] = useState("Pase Libre");
  const [editPassType, setEditPassType] = useState("Pase Libre");
  const [editCreditsCount, setEditCreditsCount] = useState("12");
  const [editAccessHoursType, setEditAccessHoursType] = useState("Todo Horario");
  const [editOffPeakStart, setEditOffPeakStart] = useState("12:00");
  const [editOffPeakEnd, setEditOffPeakEnd] = useState("16:00");
  const [editSearchActivity, setEditSearchActivity] = useState("");
  const [editIncludedActivities, setEditIncludedActivities] = useState<string[]>([]);
  const [editSelectedServices, setEditSelectedServices] = useState<string[]>([]);
  const [editRegistrationFee, setEditRegistrationFee] = useState("0");
  const [editFreezeDays, setEditFreezeDays] = useState("0");
  const [editDailyClassLimit, setEditDailyClassLimit] = useState("Ilimitado");

  const activeAmenities = amenities.filter((a) => a.checked);

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const toggleEditService = (id: string) => {
    setEditSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const handleAddMembership = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    const newPlan: Membership = {
      id: Math.random().toString(),
      name,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : null,
      duration: periodicity,
      activeCount: 0,
      includedServices: selectedServices,
      tag: tag,
      passType,
      creditsCount: passType === "Por Créditos" ? parseInt(creditsCount) : null,
      accessHoursType,
      offPeakStart: accessHoursType === "Off-Peak" ? offPeakStart : null,
      offPeakEnd: accessHoursType === "Off-Peak" ? offPeakEnd : null,
      includedActivities,
      registrationFee: registrationFee ? parseFloat(registrationFee) : 0,
      freezeDays: freezeDays ? parseInt(freezeDays) : 0,
      dailyClassLimit: dailyClassLimit,
    };

    setMembershipsList((prev) => [...prev, newPlan]);
    setName("");
    setPrice("");
    setOriginalPrice("");
    setPeriodicity("Mensual");
    setSelectedServices([]);
    setTag("Pase Libre");
    setPassType("Pase Libre");
    setCreditsCount("12");
    setAccessHoursType("Todo Horario");
    setSearchActivity("");
    setIncludedActivities([]);
    setRegistrationFee("0");
    setFreezeDays("0");
    setDailyClassLimit("Ilimitado");
    setShowAddForm(false);
  };

  const openEditModal = (m: Membership) => {
    setEditingPlan(m);
    setEditName(m.name);
    setEditPrice(m.price.toString());
    setEditOriginalPrice(m.originalPrice ? m.originalPrice.toString() : "");
    setEditPeriodicity(m.duration);
    setEditTag(m.tag || "Pase Libre");
    setEditPassType(m.passType || "Pase Libre");
    setEditCreditsCount(m.creditsCount ? m.creditsCount.toString() : "12");
    setEditAccessHoursType(m.accessHoursType || "Todo Horario");
    setEditOffPeakStart(m.offPeakStart || "12:00");
    setEditOffPeakEnd(m.offPeakEnd || "16:00");
    setEditIncludedActivities(m.includedActivities || []);
    setEditSelectedServices(m.includedServices || []);
    setEditRegistrationFee(m.registrationFee ? m.registrationFee.toString() : "0");
    setEditFreezeDays(m.freezeDays ? m.freezeDays.toString() : "0");
    setEditDailyClassLimit(m.dailyClassLimit || "Ilimitado");
  };

  const handleSaveEditMembership = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    setMembershipsList((prev) =>
      prev.map((m) => {
        if (m.id === editingPlan.id) {
          return {
            ...m,
            name: editName,
            price: parseFloat(editPrice),
            originalPrice: editOriginalPrice ? parseFloat(editOriginalPrice) : null,
            duration: editPeriodicity,
            tag: editTag,
            passType: editPassType,
            creditsCount: editPassType === "Por Créditos" ? parseInt(editCreditsCount) : null,
            accessHoursType: editAccessHoursType,
            offPeakStart: editAccessHoursType === "Off-Peak" ? editOffPeakStart : null,
            offPeakEnd: editAccessHoursType === "Off-Peak" ? editOffPeakEnd : null,
            includedActivities: editIncludedActivities,
            includedServices: editSelectedServices,
            registrationFee: editRegistrationFee ? parseFloat(editRegistrationFee) : 0,
            freezeDays: editFreezeDays ? parseInt(editFreezeDays) : 0,
            dailyClassLimit: editDailyClassLimit,
          };
        }
        return m;
      }),
    );

    setEditingPlan(null);
  };

  const handleDeletePlan = () => {
    if (!deletingPlan) return;
    if (deleteConfirmText !== "ELIMINAR") return;
    setMembershipsList((prev) => prev.filter((x) => x.id !== deletingPlan.id));
    setDeletingPlan(null);
    setDeleteConfirmText("");
  };

  const filteredActivities =
    searchActivity.trim() === ""
      ? []
      : FITNESS_ACTIVITIES.filter(
          (act) =>
            act.toLowerCase().includes(searchActivity.toLowerCase()) &&
            !includedActivities.includes(act),
        );

  const editFilteredActivities =
    editSearchActivity.trim() === ""
      ? []
      : FITNESS_ACTIVITIES.filter(
          (act) =>
            act.toLowerCase().includes(editSearchActivity.toLowerCase()) &&
            !editIncludedActivities.includes(act),
        );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Planes de Membresía</h2>
          <p className="text-sm text-muted-foreground">
            Tarifas y selección de amenities incluidos en cada plan.
          </p>
        </div>
        <Button
          size="sm"
          className="rounded-full bg-black hover:bg-black/90 text-white dark:bg-white dark:hover:bg-white/90 dark:text-black font-bold gap-1.5 px-4"
          onClick={() => {
            setName("");
            setPrice("");
            setOriginalPrice("");
            setPeriodicity("Mensual");
            setSelectedServices([]);
            setTag("Pase Libre");
            setPassType("Pase Libre");
            setCreditsCount("12");
            setAccessHoursType("Todo Horario");
            setSearchActivity("");
            setIncludedActivities([]);
            setRegistrationFee("0");
            setFreezeDays("0");
            setDailyClassLimit("Ilimitado");
            setShowAddForm(true);
          }}
        >
          <Plus className="h-4 w-4" /> Nuevo Plan
        </Button>
      </div>

      {/* Modal: Crear Plan de Membresía */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-xl border border-border bg-card rounded-3xl p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              Agregar Nuevo Plan de Membresía
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddMembership} className="space-y-4 pt-2 text-xs text-foreground">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-xs font-semibold text-muted-foreground">Nombre del Plan</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none font-semibold text-foreground"
                  placeholder="Ej: Pase Libre"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Precio ($)</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none font-semibold text-foreground"
                  placeholder="25000"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Original/Tachado ($)
                </label>
                <input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none text-foreground"
                  placeholder="Opcional"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground block">
                  Periodicidad del Cobro
                </label>
                <Select value={periodicity} onValueChange={setPeriodicity}>
                  <SelectTrigger className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground font-semibold">
                    <SelectValue placeholder="Selecciona periodicidad..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Semanal">Semanal</SelectItem>
                    <SelectItem value="Mensual">Mensual</SelectItem>
                    <SelectItem value="Trimestral">Trimestral</SelectItem>
                    <SelectItem value="Semestral">Semestral</SelectItem>
                    <SelectItem value="Anual">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground block">
                  Etiqueta/Categoría del Plan
                </label>
                <Select value={tag} onValueChange={setTag}>
                  <SelectTrigger className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground font-semibold">
                    <SelectValue placeholder="Selecciona categoría..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pase Libre">Pase Libre</SelectItem>
                    <SelectItem value="Planes Premium">Planes Premium</SelectItem>
                    <SelectItem value="Solo Clases">Solo Clases</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Pass Type & Credits configuration */}
            <div className="grid gap-4 sm:grid-cols-2 border-t border-border/40 pt-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground block">
                  Tipo de Acceso
                </label>
                <Select value={passType} onValueChange={setPassType}>
                  <SelectTrigger className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground font-semibold">
                    <SelectValue placeholder="Tipo de acceso..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pase Libre">Pase Libre (Acceso ilimitado)</SelectItem>
                    <SelectItem value="Por Créditos">Por Créditos (Límite de clases)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {passType === "Por Créditos" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Créditos/Clases Incluidas
                  </label>
                  <input
                    type="number"
                    required
                    value={creditsCount}
                    onChange={(e) => setCreditsCount(e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none font-semibold text-foreground"
                    placeholder="12"
                  />
                </div>
              )}
            </div>

            {/* Time access restrictions */}
            <div className="grid gap-4 sm:grid-cols-2 border-t border-border/40 pt-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground block">
                  Horario de Acceso
                </label>
                <Select value={accessHoursType} onValueChange={setAccessHoursType}>
                  <SelectTrigger className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground font-semibold">
                    <SelectValue placeholder="Horario..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todo Horario">Todo Horario (Full Access)</SelectItem>
                    <SelectItem value="Off-Peak">Off-Peak (Franja horaria especial)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {accessHoursType === "Off-Peak" && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-muted-foreground">Desde</label>
                    <input
                      type="text"
                      value={offPeakStart}
                      onChange={(e) => setOffPeakStart(e.target.value)}
                      className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus-visible:outline-none text-foreground font-semibold"
                      placeholder="12:00"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-muted-foreground">Hasta</label>
                    <input
                      type="text"
                      value={offPeakEnd}
                      onChange={(e) => setOffPeakEnd(e.target.value)}
                      className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus-visible:outline-none text-foreground font-semibold"
                      placeholder="16:00"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Advanced business settings */}
            <div className="grid gap-4 sm:grid-cols-3 border-t border-border/40 pt-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground block">
                  Costo de Matrícula ($)
                </label>
                <input
                  type="number"
                  value={registrationFee}
                  onChange={(e) => setRegistrationFee(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none text-foreground font-semibold"
                  placeholder="0 = Sin matrícula"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground block">
                  Días Congelamiento/Año
                </label>
                <input
                  type="number"
                  value={freezeDays}
                  onChange={(e) => setFreezeDays(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none text-foreground font-semibold"
                  placeholder="Ej: 15 días"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground block">
                  Límite Diario de Reservas
                </label>
                <Select value={dailyClassLimit} onValueChange={setDailyClassLimit}>
                  <SelectTrigger className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground font-semibold">
                    <SelectValue placeholder="Límite..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ilimitado">Ilimitado</SelectItem>
                    <SelectItem value="1 clase por día">1 clase por día</SelectItem>
                    <SelectItem value="2 clases por día">2 clases por día</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Activities Multi-select Search Box */}
            <div className="space-y-2 border-t border-border/40 pt-3 relative">
              <label className="text-xs font-semibold text-muted-foreground block">
                Actividades Incluidas
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {includedActivities.map((act) => (
                  <span
                    key={act}
                    className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full"
                  >
                    {act}
                    <button
                      type="button"
                      onClick={() => setIncludedActivities((prev) => prev.filter((x) => x !== act))}
                      className="hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {includedActivities.length === 0 && (
                  <span className="text-xs text-muted-foreground italic">
                    Todas las actividades del centro incluidas por defecto.
                  </span>
                )}
              </div>

              <input
                type="text"
                value={searchActivity}
                onChange={(e) => setSearchActivity(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none text-foreground font-semibold"
                placeholder="Buscar actividades a incluir..."
              />

              {filteredActivities.length > 0 && (
                <div className="absolute left-0 right-0 mt-1 bg-card border border-border rounded-xl max-h-48 overflow-y-auto z-10 p-1 space-y-0.5">
                  {filteredActivities.map((act) => (
                    <button
                      type="button"
                      key={act}
                      onClick={() => {
                        setIncludedActivities((prev) => [...prev, act]);
                        setSearchActivity("");
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-secondary rounded-lg transition text-foreground"
                    >
                      {act}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2 border-t border-border/40 pt-3">
              <label className="text-xs font-semibold text-muted-foreground block">
                Amenities y Servicios Incluidos
              </label>
              {activeAmenities.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No tienes amenities activos en la pestaña de Configuración.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {activeAmenities.map((a) => (
                    <button
                      type="button"
                      key={a.id}
                      onClick={() => toggleService(a.id)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        selectedServices.includes(a.id)
                          ? "bg-foreground text-background border-foreground font-bold shadow-sm"
                          : "bg-background border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                      }`}
                    >
                      {a.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter className="pt-3 gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl text-xs font-bold"
                onClick={() => setShowAddForm(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="rounded-xl text-xs font-bold bg-primary text-primary-foreground">
                Crear Plan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid gap-6 md:grid-cols-3">
        {membershipsList.map((m, i) => (
          <div
            key={m.id}
            className="rounded-3xl border border-border bg-card p-6 flex flex-col justify-between hover:border-foreground/20 transition"
          >
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{m.name}</h3>
                  {m.tag && (
                    <span className="inline-block mt-1.5 text-[9px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase tracking-wider">
                      {m.tag}
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground font-medium">{m.duration}</span>
              </div>
              <div className="mt-4 text-3xl font-extrabold tracking-tight">
                {m.originalPrice && (
                  <span className="text-sm font-normal text-muted-foreground line-through mr-2">
                    ${m.originalPrice.toLocaleString("es-AR")}
                  </span>
                )}
                ${m.price.toLocaleString("es-AR")}
              </div>

              {/* Pass Type & Hours Badges */}
              <div className="mt-4 space-y-1.5 border-t border-border/60 pt-3">
                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <span>🎟️</span>
                  <span>
                    {m.passType === "Por Créditos"
                      ? `${m.creditsCount} clases / créditos`
                      : "Pase Libre (Ilimitado)"}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <span>🕒</span>
                  <span>
                    {m.accessHoursType === "Off-Peak"
                      ? `Franja Off-Peak (${m.offPeakStart} - ${m.offPeakEnd} hs)`
                      : "Acceso Completo (Todo Horario)"}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <span>💵</span>
                  <span>
                    {m.registrationFee && m.registrationFee > 0
                      ? `Matrícula: $${m.registrationFee.toLocaleString("es-AR")}`
                      : "Matrícula Bonificada 🎉"}
                  </span>
                </div>
                {m.freezeDays && m.freezeDays > 0 ? (
                  <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <span>❄️</span>
                    <span>Congelamiento: {m.freezeDays} días/año</span>
                  </div>
                ) : null}
                {m.dailyClassLimit && m.dailyClassLimit !== "Ilimitado" ? (
                  <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <span>🛡️</span>
                    <span>Límite: {m.dailyClassLimit}</span>
                  </div>
                ) : null}
              </div>

              {/* Included Activities badges */}
              {m.includedActivities && m.includedActivities.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {m.includedActivities.map((act) => (
                    <span
                      key={act}
                      className="text-[9.5px] bg-secondary text-secondary-foreground px-2.5 py-0.5 rounded-full font-medium"
                    >
                      {act}
                    </span>
                  ))}
                </div>
              )}

              <ul className="mt-4 space-y-2 border-t border-border/60 pt-3">
                {m.includedServices.map((serviceId) => {
                  const serviceName = amenities.find((a) => a.id === serviceId)?.name || serviceId;
                  return (
                    <li
                      key={serviceId}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> {serviceName}
                    </li>
                  );
                })}
                {m.includedServices.length === 0 && (
                  <li className="text-xs text-muted-foreground italic">
                    Sin amenities especiales incluidos.
                  </li>
                )}
              </ul>
            </div>

            <div className="space-y-4 mt-6">
              <div className="border-t border-border/60 pt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>Miembros activos:</span>
                <span className="font-bold text-foreground bg-secondary px-2.5 py-0.5 rounded-full">
                  {m.activeCount}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(m)}
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-background hover:bg-secondary text-xs text-muted-foreground hover:text-foreground font-semibold flex-1 transition"
                >
                  <Edit2 className="h-3.5 w-3.5" /> Editar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (m.activeCount > 0) {
                      alert(
                        `No se puede eliminar el plan "${m.name}" porque tiene ${m.activeCount} alumnos activos. Debes migrarlos a otro plan antes de poder eliminarlo.`,
                      );
                    } else {
                      setDeletingPlan(m);
                      setDeleteConfirmText("");
                    }
                  }}
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-destructive/ bg-destructive/ hover:bg-destructive hover:text-white text-xs text-destructive font-semibold flex-1 transition"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Membership Modal Dialog */}
      <Dialog open={!!editingPlan} onOpenChange={(open) => !open && setEditingPlan(null)}>
        <DialogContent className="max-w-xl border border-border bg-card rounded-3xl p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              Editar Plan de Membresía
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveEditMembership} className="space-y-4 pt-2 text-xs text-foreground">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-xs font-semibold text-muted-foreground">
                  Nombre del Plan
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none font-semibold text-foreground"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Precio ($)</label>
                <input
                  type="number"
                  required
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none font-semibold text-foreground"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Original/Tachado ($)
                </label>
                <input
                  type="number"
                  value={editOriginalPrice}
                  onChange={(e) => setEditOriginalPrice(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none text-foreground"
                  placeholder="Opcional"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground block">
                  Periodicidad del Cobro
                </label>
                <Select value={editPeriodicity} onValueChange={setEditPeriodicity}>
                  <SelectTrigger className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground font-semibold">
                    <SelectValue placeholder="Periodicidad..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Semanal">Semanal</SelectItem>
                    <SelectItem value="Mensual">Mensual</SelectItem>
                    <SelectItem value="Trimestral">Trimestral</SelectItem>
                    <SelectItem value="Semestral">Semestral</SelectItem>
                    <SelectItem value="Anual">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground block">
                  Etiqueta/Categoría del Plan
                </label>
                <Select value={editTag} onValueChange={setEditTag}>
                  <SelectTrigger className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground font-semibold">
                    <SelectValue placeholder="Categoría..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pase Libre">Pase Libre</SelectItem>
                    <SelectItem value="Planes Premium">Planes Premium</SelectItem>
                    <SelectItem value="Solo Clases">Solo Clases</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Pass Type & Credits configuration */}
            <div className="grid gap-4 sm:grid-cols-2 border-t border-border/40 pt-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground block">
                  Tipo de Acceso
                </label>
                <Select value={editPassType} onValueChange={setEditPassType}>
                  <SelectTrigger className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground font-semibold">
                    <SelectValue placeholder="Tipo de acceso..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pase Libre">Pase Libre (Acceso ilimitado)</SelectItem>
                    <SelectItem value="Por Créditos">Por Créditos (Límite de clases)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {editPassType === "Por Créditos" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Créditos/Clases Incluidas
                  </label>
                  <input
                    type="number"
                    required
                    value={editCreditsCount}
                    onChange={(e) => setEditCreditsCount(e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none font-semibold text-foreground"
                  />
                </div>
              )}
            </div>

            {/* Time access restrictions */}
            <div className="grid gap-4 sm:grid-cols-2 border-t border-border/40 pt-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground block">
                  Horario de Acceso
                </label>
                <Select value={editAccessHoursType} onValueChange={setEditAccessHoursType}>
                  <SelectTrigger className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground font-semibold">
                    <SelectValue placeholder="Horario..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todo Horario">Todo Horario (Full Access)</SelectItem>
                    <SelectItem value="Off-Peak">Off-Peak (Franja horaria especial)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {editAccessHoursType === "Off-Peak" && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-muted-foreground">Desde</label>
                    <input
                      type="text"
                      value={editOffPeakStart}
                      onChange={(e) => setEditOffPeakStart(e.target.value)}
                      className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus-visible:outline-none text-foreground font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-muted-foreground">Hasta</label>
                    <input
                      type="text"
                      value={editOffPeakEnd}
                      onChange={(e) => setEditOffPeakEnd(e.target.value)}
                      className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus-visible:outline-none text-foreground font-semibold"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Advanced business settings */}
            <div className="grid gap-4 sm:grid-cols-3 border-t border-border/40 pt-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground block">
                  Costo de Matrícula ($)
                </label>
                <input
                  type="number"
                  value={editRegistrationFee}
                  onChange={(e) => setEditRegistrationFee(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none text-foreground font-semibold"
                  placeholder="0 = Sin matrícula"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground block">
                  Días Congelamiento/Año
                </label>
                <input
                  type="number"
                  value={editFreezeDays}
                  onChange={(e) => setEditFreezeDays(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none text-foreground font-semibold"
                  placeholder="Ej: 15 días"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground block">
                  Límite Diario de Reservas
                </label>
                <Select value={editDailyClassLimit} onValueChange={setEditDailyClassLimit}>
                  <SelectTrigger className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground font-semibold">
                    <SelectValue placeholder="Límite..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ilimitado">Ilimitado</SelectItem>
                    <SelectItem value="1 clase por día">1 clase por día</SelectItem>
                    <SelectItem value="2 clases por día">2 clases por día</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Activities Multi-select Search Box */}
            <div className="space-y-2 border-t border-border/40 pt-3 relative">
              <label className="text-xs font-semibold text-muted-foreground block">
                Actividades Incluidas
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {editIncludedActivities.map((act) => (
                  <span
                    key={act}
                    className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full"
                  >
                    {act}
                    <button
                      type="button"
                      onClick={() =>
                        setEditIncludedActivities((prev) => prev.filter((x) => x !== act))
                      }
                      className="hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {editIncludedActivities.length === 0 && (
                  <span className="text-xs text-muted-foreground italic">
                    Todas las actividades del centro incluidas por defecto.
                  </span>
                )}
              </div>

              <input
                type="text"
                value={editSearchActivity}
                onChange={(e) => setEditSearchActivity(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none text-foreground font-semibold"
                placeholder="Buscar actividades a incluir..."
              />

              {editFilteredActivities.length > 0 && (
                <div className="absolute left-0 right-0 mt-1 bg-card border border-border rounded-xl max-h-48 overflow-y-auto z-10 p-1 space-y-0.5">
                  {editFilteredActivities.map((act) => (
                    <button
                      type="button"
                      key={act}
                      onClick={() => {
                        setEditIncludedActivities((prev) => [...prev, act]);
                        setEditSearchActivity("");
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-secondary rounded-lg transition text-foreground"
                    >
                      {act}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Amenities in Edit modal */}
            <div className="space-y-2 border-t border-border/40 pt-3">
              <label className="text-xs font-semibold text-muted-foreground block">
                Amenities y Servicios Incluidos
              </label>
              <div className="flex flex-wrap gap-2">
                {activeAmenities.map((a) => (
                  <button
                    type="button"
                    key={a.id}
                    onClick={() => toggleEditService(a.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      editSelectedServices.includes(a.id)
                        ? "bg-foreground text-background border-foreground font-bold shadow-sm"
                        : "bg-background border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                    }`}
                  >
                    {a.name}
                  </button>
                ))}
              </div>
            </div>

            <DialogFooter className="pt-3 gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl text-xs font-bold"
                onClick={() => setEditingPlan(null)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="rounded-xl text-xs font-bold bg-primary text-primary-foreground">
                Guardar Cambios
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Membership Modal */}
      {deletingPlan && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-fade-in text-foreground">
          <div className="relative bg-card border border-border w-full max-w-[420px] rounded-3xl p-6 text-center flex flex-col items-center">
            <button
              onClick={() => setDeletingPlan(null)}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-secondary transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="h-12 w-12 rounded-full bg-destructive/ text-destructive flex items-center justify-center mb-4">
              <ShieldAlert className="h-6 w-6" />
            </div>

            <h3 className="text-lg font-bold tracking-tight text-foreground">
              ¿Eliminar Plan de Membresía?
            </h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Esta acción es irreversible. Para confirmar la eliminación definitiva del plan{" "}
              <strong>"{deletingPlan.name}"</strong>, escribe la palabra clave en mayúsculas a
              continuación:
            </p>

            <div className="w-full mt-4 space-y-3">
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-center focus-visible:outline-none font-bold placeholder:font-normal"
                placeholder="Escribe ELIMINAR para confirmar"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleDeletePlan}
                  disabled={deleteConfirmText !== "ELIMINAR"}
                  className="rounded-xl flex-1 bg-destructive hover:bg-destructive text-white font-bold text-xs"
                >
                  Confirmar Eliminación
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setDeletingPlan(null)}
                  className="rounded-xl flex-1 text-xs"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Class routine blocks (WODify / SugarWOD style)
export interface ClassBlock {
  id: string;
  type: "warmup" | "strength" | "main" | "cooldown" | "custom";
  title: string;
  subtitle?: string;
  description: string;
  timeCap?: string;
}

// Subcomponent: Clases Tab
export interface GymClassItem {
  id: string;
  name: string;
  staffId: string;
  time: string;
  capacity: number;
  booked: number;
  enrolledSpots: { [spotIndex: number]: string };
  branchId?: string;
  salaId?: string;
  day: number;
  creditsCost?: number;
  layout?: boolean[];
  attendance?: { [spotIndex: number]: "presente" | "ausente" | "pendiente" };
  waitlist?: string[];
  releasedSpots?: { [spotIndex: number]: { originalStudent: string; creditsCost: number } };
  status?: "activa" | "cancelada";
  seekingBackup?: boolean;
  requiresSpotSelection?: boolean;
  lockedSpots?: { [spotIndex: number]: { studentName: string; expiresAt: number } };
  ratings?: any;
  weekOffset?: number;
  blocks?: ClassBlock[];
}

interface ClasesTabProps {
  classesList: GymClassItem[];
  setClassesList: React.Dispatch<React.SetStateAction<GymClassItem[]>>;
  staffList: {
    id: string;
    name: string;
    specialty: string;
    certifications: string[];
    photo: string;
    availability?: any[];
  }[];
  canManageClasses: boolean;
  blackoutDays: { id: string; date: string; reason: string }[];
  salasList: {
    id: string;
    name: string;
    capacity?: number;
    branchId: string;
    description?: string;
  }[];
  branchesList: { id: string; name: string; address: string }[];
  selectedBranchId: string;
  cancellationPolicyHours: number;
  currentUser?: any;
  membersList?: any[];
}

function ClasesTab({
  classesList,
  setClassesList,
  staffList,
  canManageClasses,
  blackoutDays,
  salasList,
  branchesList,
  selectedBranchId,
  cancellationPolicyHours,
  currentUser,
  membersList,
}: ClasesTabProps) {
  const activeBlackout = blackoutDays.find((b) => b.date === "2026-06-29");
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Limpiador automático de Spot Locks expirados (3 minutos)
  useEffect(() => {
    setClassesList((prev) =>
      prev.map((c) => {
        if (!c.lockedSpots) return c;
        const updatedLocks = { ...c.lockedSpots };
        let changed = false;
        Object.entries(updatedLocks).forEach(([idxStr, lockInfo]) => {
          if (lockInfo.expiresAt <= now) {
            delete updatedLocks[parseInt(idxStr)];
            changed = true;
          }
        });
        if (changed) {
          return { ...c, lockedSpots: updatedLocks };
        }
        return c;
      }),
    );
  }, [now]);

  const formatCountdown = (expiresAt: number, currentNow: number) => {
    const diffMs = Math.max(0, expiresAt - currentNow);
    const totalSec = Math.floor(diffMs / 1000);
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [isProfilePrivate, setIsProfilePrivate] = useState(true); // default to private
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [name, setName] = useState("");
  const [staffId, setStaffId] = useState("");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("09:00");
  const time = `${startTime} - ${endTime}`;
  const [creditsCost, setCreditsCost] = useState("1");
  const [classBranchId, setClassBranchId] = useState("matriz");
  const [salaId, setSalaId] = useState("");
  const [day, setDay] = useState(0);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("calendar");
  const [selectedCalendarSalaId, setSelectedCalendarSalaId] = useState("");
  const [customCapacity, setCustomCapacity] = useState(20);
  const [requiresSpotSelection, setRequiresSpotSelection] = useState(true);

  // Estado y Funciones para Bloques de Rutina (Estilo WODify / SugarWOD)
  const [routineBlocks, setRoutineBlocks] = useState<ClassBlock[]>([]);

  const addRoutineBlockPreset = (presetType: ClassBlock["type"]) => {
    const presets: Record<string, { title: string; subtitle: string; description: string; timeCap?: string }> = {
      warmup: {
        title: "Calentamiento & Movilidad",
        subtitle: "General",
        description: "3 Rondas de:\n- 10 Pass-throughs con PVC\n- 15 Air Squats\n- 30s Plank",
        timeCap: "10 min",
      },
      strength: {
        title: "Trabajo de Fuerza / Técnica",
        subtitle: "5 Series x 5 Reps",
        description: "Back Squat @ 75-80% 1RM\nDescanso: 2 min entre series",
        timeCap: "15 min",
      },
      main: {
        title: "Metcon Principal / WOD",
        subtitle: "AMRAP 12 min",
        description: "12 Burpees\n15 Kettlebell Swings (24/16kg)\n30 Double Unders",
        timeCap: "12 min",
      },
      cooldown: {
        title: "Vuelta a la Calma",
        subtitle: "Estiramientos",
        description: "5 min Movilidad pasiva de cadera y hombros\nHidratación y respiración guiada",
        timeCap: "5 min",
      },
      custom: {
        title: "Bloque Personalizado",
        subtitle: "Detalle de trabajo",
        description: "Escribe aquí la rutina o instrucciones...",
      },
    };

    const template = presets[presetType] || presets.custom;
    setRoutineBlocks((prev) => [
      ...prev,
      {
        id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        type: presetType,
        title: template.title,
        subtitle: template.subtitle,
        description: template.description,
        timeCap: template.timeCap || "",
      },
    ]);
  };

  const moveRoutineBlock = (index: number, direction: "up" | "down") => {
    setRoutineBlocks((prev) => {
      const copy = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= copy.length) return prev;
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const updateRoutineBlock = (index: number, field: keyof ClassBlock, value: string) => {
    setRoutineBlocks((prev) =>
      prev.map((b, i) => (i === index ? { ...b, [field]: value } : b)),
    );
  };

  const removeRoutineBlock = (index: number) => {
    setRoutineBlocks((prev) => prev.filter((_, i) => i !== index));
  };

  // Estados para Modal Shadcn de Inscripción de Alumno
  const [enrollModalClass, setEnrollModalClass] = useState<any | null>(null);
  const [enrollTargetSpotIndex, setEnrollTargetSpotIndex] = useState<number | null>(null);
  const [enrollSearchTerm, setEnrollSearchTerm] = useState("");
  const [enrollPlanFilter, setEnrollPlanFilter] = useState("todos");

  // Estados para Modal Shadcn de Lista de Espera de Alumno
  const [waitlistModalClass, setWaitlistModalClass] = useState<any | null>(null);
  const [waitlistSearchTerm, setWaitlistSearchTerm] = useState("");
  const [waitlistPlanFilter, setWaitlistPlanFilter] = useState("todos");

  // Estados para Modales Shadcn UI / Radix UI (Confirmación, Prompt, Selección de Modalidad al Cancelar)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "destructive";
    onConfirm: () => void;
  } | null>(null);

  const [promptDialog, setPromptDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    placeholder?: string;
    defaultValue?: string;
    confirmText?: string;
    variant?: "default" | "destructive";
    onConfirm: (val: string) => void;
  } | null>(null);
  const [promptInputValue, setPromptInputValue] = useState("");

  const [cancelSpotDialog, setCancelSpotDialog] = useState<{
    isOpen: boolean;
    c: any;
    index: number;
    studentName: string;
    displayNameForConfirm: string;
    hasWaitlist: boolean;
    nextStudent?: string;
  } | null>(null);
  const [cancelOption, setCancelOption] = useState<"refund" | "rereserva">("refund");

  // Estados para Modal Shadcn UI de Sustitución de Coach
  const [substituteCoachModalClass, setSubstituteCoachModalClass] = useState<any | null>(null);
  const [substituteSearchTerm, setSubstituteSearchTerm] = useState("");

  const availableCoachesToSubstitute = useMemo(() => {
    const filtered = (staffList || []).filter((s: any) => {
      if (!substituteSearchTerm) return true;
      const term = substituteSearchTerm.toLowerCase();
      const specs = (s.specialties || []).map((sp: string) => sp.toLowerCase());
      return (
        s.name?.toLowerCase().includes(term) ||
        s.specialty?.toLowerCase().includes(term) ||
        specs.some((sp: string) => sp.includes(term))
      );
    });

    if (!substituteCoachModalClass) return filtered;

    const classActName = (substituteCoachModalClass.name || "").toLowerCase();

    return [...filtered].sort((a: any, b: any) => {
      const aSpecs: string[] = (a.specialties || []).map((sp: string) => sp.toLowerCase());
      const bSpecs: string[] = (b.specialties || []).map((sp: string) => sp.toLowerCase());

      const aMatch =
        aSpecs.some((sp) => sp.includes(classActName) || classActName.includes(sp)) ||
        a.specialty?.toLowerCase().includes(classActName);
      const bMatch =
        bSpecs.some((sp) => sp.includes(classActName) || classActName.includes(sp)) ||
        b.specialty?.toLowerCase().includes(classActName);

      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0;
    });
  }, [staffList, substituteSearchTerm, substituteCoachModalClass]);

  const availableMembersToEnroll = useMemo(() => {
    const list = membersList || [
      { name: "Agustín Gómez", plan: "Pase Libre", status: "activo", phone: "+54 9 11 3242-1241" },
      { name: "Camila Díaz", plan: "Performance", status: "activo", phone: "+54 9 11 4124-5124" },
      { name: "Marcos López", plan: "Pase Libre", status: "activo", phone: "+54 9 11 2341-2412" },
      { name: "Tomás Ruiz", plan: "Performance", status: "activo", phone: "+54 9 11 5122-1234" },
      { name: "Lucas Torres", plan: "Performance", status: "activo", phone: "+54 9 11 4124-1111" },
      { name: "Paula Cáceres", plan: "Pase Libre", status: "activo", phone: "+54 9 11 2344-9999" },
      { name: "Sofía Martínez", plan: "Pase Libre", status: "activo", phone: "+54 9 11 3333-8888" },
      { name: "Pedro Giménez", plan: "Pase Libre", status: "activo", phone: "+54 9 11 4444-7777" },
      { name: "María del Mar", plan: "Performance", status: "activo", phone: "+54 9 11 5555-6666" },
    ];

    return list.filter((m: any) => {
      const matchesSearch =
        !enrollSearchTerm ||
        m.name?.toLowerCase().includes(enrollSearchTerm.toLowerCase()) ||
        m.phone?.includes(enrollSearchTerm) ||
        m.email?.toLowerCase().includes(enrollSearchTerm.toLowerCase());

      const matchesPlan =
        enrollPlanFilter === "todos" ||
        m.plan?.toLowerCase() === enrollPlanFilter.toLowerCase();

      return matchesSearch && matchesPlan;
    });
  }, [membersList, enrollSearchTerm, enrollPlanFilter]);

  const availableMembersToWaitlist = useMemo(() => {
    const list = membersList || [
      { name: "Agustín Gómez", plan: "Pase Libre", status: "activo", phone: "+54 9 11 3242-1241" },
      { name: "Camila Díaz", plan: "Performance", status: "activo", phone: "+54 9 11 4124-5124" },
      { name: "Marcos López", plan: "Pase Libre", status: "activo", phone: "+54 9 11 2341-2412" },
      { name: "Tomás Ruiz", plan: "Performance", status: "activo", phone: "+54 9 11 5122-1234" },
      { name: "Lucas Torres", plan: "Performance", status: "activo", phone: "+54 9 11 4124-1111" },
      { name: "Paula Cáceres", plan: "Pase Libre", status: "activo", phone: "+54 9 11 2344-9999" },
      { name: "Sofía Martínez", plan: "Pase Libre", status: "activo", phone: "+54 9 11 3333-8888" },
      { name: "Pedro Giménez", plan: "Pase Libre", status: "activo", phone: "+54 9 11 4444-7777" },
      { name: "María del Mar", plan: "Performance", status: "activo", phone: "+54 9 11 5555-6666" },
    ];

    return list.filter((m: any) => {
      const matchesSearch =
        !waitlistSearchTerm ||
        m.name?.toLowerCase().includes(waitlistSearchTerm.toLowerCase()) ||
        m.phone?.includes(waitlistSearchTerm) ||
        m.email?.toLowerCase().includes(waitlistSearchTerm.toLowerCase());

      const matchesPlan =
        waitlistPlanFilter === "todos" ||
        m.plan?.toLowerCase() === waitlistPlanFilter.toLowerCase();

      return matchesSearch && matchesPlan;
    });
  }, [membersList, waitlistSearchTerm, waitlistPlanFilter]);

  const handleEnrollMemberInClass = (memberName: string) => {
    if (!enrollModalClass) return;
    setClassesList((prev) =>
      prev.map((item) => {
        if (item.id === enrollModalClass.id) {
          const copySpots = { ...(item.enrolledSpots || {}) };
          let targetIdx = enrollTargetSpotIndex;
          if (targetIdx === null || copySpots[targetIdx]) {
            targetIdx = 0;
            while (copySpots[targetIdx]) {
              targetIdx++;
            }
          }
          copySpots[targetIdx] = memberName;
          return {
            ...item,
            enrolledSpots: copySpots,
            booked: Object.keys(copySpots).length,
          };
        }
        return item;
      }),
    );
    const spotLabel = enrollTargetSpotIndex !== null ? ` en el Lugar #${enrollTargetSpotIndex + 1}` : "";
    toast.success(`✅ Alumno "${memberName}" inscrito exitosamente${spotLabel} en "${enrollModalClass.name}". Notification enviada.`);
    setEnrollModalClass(null);
    setEnrollTargetSpotIndex(null);
  };

  // Presets de distribución física de sala (10x10 = 100 lugares)
  const defaultPresets = useMemo(
    () => [
      {
        id: "full",
        name: "Grilla Completa (100 lugares)",
        capacity: 100,
        getLayout: () => Array(100).fill(true),
      },
      {
        id: "spinning-20",
        name: "Sala Spinning — 20 Bicis (2 filas frontales)",
        capacity: 20,
        getLayout: () => Array(100).fill(false).map((_, i) => i < 20),
      },
      {
        id: "box-15",
        name: "CrossFit Box — 15 Lugares (Grilla central 3x5)",
        capacity: 15,
        getLayout: () =>
          Array(100)
            .fill(false)
            .map((_, i) => {
              const row = Math.floor(i / 10);
              const col = i % 10;
              return row >= 1 && row <= 3 && col >= 2 && col <= 6;
            }),
      },
      {
        id: "pilates-12",
        name: "Mat Pilates — 12 Mats (2 columnas de 6)",
        capacity: 12,
        getLayout: () =>
          Array(100)
            .fill(false)
            .map((_, i) => {
              const row = Math.floor(i / 10);
              const col = i % 10;
              return row >= 1 && row <= 6 && (col === 2 || col === 7);
            }),
      },
      {
        id: "yoga-16",
        name: "Yoga Studio — 16 Mats (Matriz centrada 4x4)",
        capacity: 16,
        getLayout: () =>
          Array(100)
            .fill(false)
            .map((_, i) => {
              const row = Math.floor(i / 10);
              const col = i % 10;
              return row >= 1 && row <= 4 && col >= 3 && col <= 6;
            }),
      },
      {
        id: "custom",
        name: "Personalizada (Edición libre en mapa)",
        capacity: 20,
        getLayout: () => Array(100).fill(false).map((_, i) => i < 20),
      },
    ],
    [],
  );

  const [customPresets, setCustomPresets] = useState<
    { id: string; name: string; capacity: number; getLayout: () => boolean[] }[]
  >([]);
  const [newPresetName, setNewPresetName] = useState("");
  const [showSavePresetInput, setShowSavePresetInput] = useState(false);

  const ROOM_PRESETS = useMemo(
    () => [...defaultPresets, ...customPresets],
    [defaultPresets, customPresets],
  );

  const [selectedPresetId, setSelectedPresetId] = useState("spinning-20");
  const [layoutMatrix, setLayoutMatrix] = useState<boolean[]>(
    Array(100)
      .fill(false)
      .map((_, i) => i < 20),
  );

  // Recurrence settings
  const [isRecurrent, setIsRecurrent] = useState(false);
  const [recurrentWeeks, setRecurrentWeeks] = useState(4);

  // Advanced Filters
  const [selectedFilterCoachId, setSelectedFilterCoachId] = useState("");
  const [selectedFilterActivity, setSelectedFilterActivity] = useState("");

  const availabilityWarning = useMemo(() => {
    if (!staffId || !time) return null;
    const coach = staffList.find((s) => s.id === staffId);
    if (!coach || !coach.availability || coach.availability.length === 0) return null;

    const weekdayNames = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    const targetDayName = weekdayNames[day];
    const DayAvail = coach.availability.find((a) => a.day === targetDayName);

    if (!DayAvail || !DayAvail.intervals || DayAvail.intervals.length === 0) {
      const activeDays = coach.availability
        .filter((a) => a.intervals && a.intervals.length > 0)
        .map((a) => a.day);
      return `⚠️ Alerta: El instructor no tiene disponibilidad los ${targetDayName}.`;
    }

    try {
      const [classFrom, classTo] = time.split("-").map((t) => t.trim());
      const toMinutes = (h: string) => {
        const [hh, mm] = h.split(":").map(Number);
        return hh * 60 + mm;
      };

      const classStart = toMinutes(classFrom);
      const classEnd = toMinutes(classTo);

      const fits = DayAvail.intervals.some((interval: { from: string; to: string }) => {
        const intervalStart = toMinutes(interval.from);
        const intervalEnd = toMinutes(interval.to);
        return classStart >= intervalStart && classEnd <= intervalEnd;
      });

      if (!fits) {
        const intervalsStr = DayAvail.intervals.map((i: { from: string; to: string }) => `${i.from} a ${i.to}`).join(" o ");
        return `⚠️ Alerta: El horario (${time}) está fuera de la disponibilidad del instructor (${intervalsStr}).`;
      }
    } catch (e) {
      // ignore
    }
    return null;
  }, [staffId, time, day, staffList]);

  const isTimeOverlapping = (time1: string, time2: string) => {
    try {
      const toMinutes = (timeStr: string) => {
        const [start, end] = timeStr.split("-").map((t) => t.trim());
        const [startH, startM] = start.split(":").map(Number);
        const [endH, endM] = end.split(":").map(Number);
        return { startMin: startH * 60 + startM, endMin: endH * 60 + endM };
      };
      const r1 = toMinutes(time1);
      const r2 = toMinutes(time2);
      return r1.startMin < r2.endMin && r2.startMin < r1.endMin;
    } catch (e) {
      return false;
    }
  };

  const conflictWarning = useMemo(() => {
    if (!staffId || !time) return null;
    const conflictingClass = classesList.find((c) => {
      const matchesDay = c.day === day;
      const matchesStaff = c.staffId === staffId;
      const isNotSelf = c.id !== editingClassId;
      return matchesDay && matchesStaff && isNotSelf && isTimeOverlapping(c.time, time);
    });
    if (conflictingClass) {
      return `⚠️ Conflicto: El instructor ya tiene asignada la clase "${conflictingClass.name}" el mismo día a las ${conflictingClass.time} hs.`;
    }
    return null;
  }, [staffId, time, day, classesList, editingClassId]);

  const filteredStaffForClass = useMemo(() => {
    if (!name) return staffList;

    const selectedActLower = name.toLowerCase().trim();

    const matches = staffList.filter((s: any) => {
      const specs: string[] = s.specialties || [];
      const legacySpec: string = s.specialty || "";

      const matchesArray = specs.some((sp: string) => {
        const spLower = sp.toLowerCase();
        return (
          spLower.includes(selectedActLower) ||
          selectedActLower.includes(spLower) ||
          (selectedActLower.includes("crossfit") && spLower.includes("crossfit")) ||
          (selectedActLower.includes("yoga") && spLower.includes("yoga")) ||
          (selectedActLower.includes("spinning") && spLower.includes("spinning")) ||
          (selectedActLower.includes("pilates") && spLower.includes("pilates")) ||
          (selectedActLower.includes("funcional") && spLower.includes("funcional")) ||
          (selectedActLower.includes("fuerza") && spLower.includes("fuerza"))
        );
      });

      const matchesLegacy =
        legacySpec.toLowerCase().includes(selectedActLower) ||
        selectedActLower.includes(legacySpec.toLowerCase());

      return matchesArray || matchesLegacy;
    });

    return matches;
  }, [staffList, name]);

  const filteredStaffForSubstitute = useMemo(() => {
    const list = (staffList || []).filter((s: any) => {
      const matchesSearch =
        !substituteSearchTerm ||
        s.name.toLowerCase().includes(substituteSearchTerm.toLowerCase()) ||
        s.specialty.toLowerCase().includes(substituteSearchTerm.toLowerCase());
      return matchesSearch;
    });

    if (!substituteCoachModalClass) return list;

    const actNameLower = substituteCoachModalClass.name.toLowerCase();

    return [...list].sort((a: any, b: any) => {
      const aMatch =
        (a.specialties || []).some((sp: string) => sp.toLowerCase().includes(actNameLower)) ||
        a.specialty.toLowerCase().includes(actNameLower);
      const bMatch =
        (b.specialties || []).some((sp: string) => sp.toLowerCase().includes(actNameLower)) ||
        b.specialty.toLowerCase().includes(actNameLower);
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0;
    });
  }, [staffList, substituteSearchTerm, substituteCoachModalClass]);

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !staffId || !time) return;

    if (conflictWarning) {
      setConfirmDialog({
        isOpen: true,
        title: "Conflicto de Horario del Entrenador",
        description: conflictWarning,
        confirmText: "Entendido",
        variant: "destructive",
        onConfirm: () => {},
      });
      toast.error(conflictWarning, { duration: 5000 });
      return;
    }

    const finalCap = Number(customCapacity) || 20;
    const computedLayout =
      layoutMatrix && layoutMatrix.length === 100
        ? layoutMatrix
        : Array(100)
            .fill(false)
            .map((_, i) => i < finalCap);

    if (editingClassId) {
      setClassesList((prev) =>
        prev.map((c) => {
          if (c.id === editingClassId) {
            return {
              ...c,
              name,
              staffId,
              time,
              capacity: finalCap,
              salaId: salaId || undefined,
              day: day,
              creditsCost: parseInt(creditsCost) || 1,
              layout: computedLayout,
              requiresSpotSelection,
              blocks: routineBlocks,
            };
          }
          return c;
        }),
      );
      setEditingClassId(null);
    } else {
      if (isRecurrent) {
        const generatedClasses: GymClassItem[] = [];
        for (let i = 0; i < recurrentWeeks; i++) {
          generatedClasses.push({
            id: `recurrent-${Math.random()}`,
            name,
            staffId,
            time,
            capacity: finalCap,
            booked: 0,
            enrolledSpots: {},
            salaId: salaId || undefined,
            day: day,
            creditsCost: parseInt(creditsCost) || 1,
            layout: computedLayout,
            requiresSpotSelection,
            status: "activa" as const,
            weekOffset: i,
            blocks: routineBlocks,
          });
        }
        setClassesList((prev) => [...prev, ...generatedClasses]);
      } else {
        const newClass = {
          id: Math.random().toString(),
          name,
          staffId,
          time,
          capacity: finalCap,
          booked: 0,
          enrolledSpots: {},
          salaId: salaId || undefined,
          day: day,
          creditsCost: parseInt(creditsCost) || 1,
          layout: computedLayout,
          requiresSpotSelection,
          status: "activa" as const,
          weekOffset: 0,
          blocks: routineBlocks,
        };
        setClassesList((prev) => [...prev, newClass]);
      }
    }

    setName("");
    setStaffId("");
    setStartTime("08:00");
    setEndTime("09:00");
    setSalaId("");
    setDay(0);
    setCreditsCost("1");
    setCustomCapacity(20);
    setRoutineBlocks([]);
    setRequiresSpotSelection(true);
    setShowAddForm(false);
  };

  // Helper to generate consistent student photos based on name hash
  const getStudentPhoto = (name: string) => {
    const avatars = [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % avatars.length;
    return avatars[index];
  };

  // Convert time "HH:MM - HH:MM" to style offset
  const getEventPosition = (timeStr: string) => {
    try {
      const [fromStr, toStr] = timeStr.split("-").map((t) => t.trim());
      const [fromH, fromM] = fromStr.split(":").map(Number);
      const [toH, toM] = toStr.split(":").map(Number);

      const startMinutes = fromH * 60 + fromM;
      const endMinutes = toH * 60 + toM;
      const duration = endMinutes - startMinutes;

      const gridStartMinutes = 7 * 60; // 07:00 AM grid start
      const top = ((startMinutes - gridStartMinutes) / 60) * 88; // 88px per hour
      const height = (duration / 60) * 88;

      return { top: `${top}px`, height: `${height}px` };
    } catch (e) {
      return { top: "0px", height: "70px" }; // fallback
    }
  };

  const getEventColors = (targetSalaId: string | undefined) => {
    const baseStyle =
      "border rounded-[18px] p-3 text-left cursor-pointer transition-all duration-200 flex flex-col justify-between";
    if (targetSalaId === "s1" || targetSalaId === "s4") {
      return `${baseStyle} bg-indigo-50/70 border-indigo-100 text-indigo-700 hover:bg-indigo-100/60 dark:bg-indigo-950/40 dark:border-indigo-900/30 dark:text-indigo-200 dark:hover:bg-indigo-950/60`;
    }
    if (targetSalaId === "s2" || targetSalaId === "s5") {
      return `${baseStyle} bg-sky-50/70 border-sky-100 text-sky-700 hover:bg-sky-100/60 dark:bg-sky-950/40 dark:border-sky-900/30 dark:text-sky-200 dark:hover:bg-sky-950/60`;
    }
    if (targetSalaId === "s3" || targetSalaId === "s6") {
      return `${baseStyle} bg-primary/ border-primary text-primary hover:bg-primary/ dark:bg-primary/ dark:border-primary/ dark:text-primary dark:hover:bg-primary/`;
    }
    return `${baseStyle} bg-secondary/ border-border text-secondary-foreground hover:bg-secondary/ dark:bg-secondary/ dark:border-border/ dark:text-secondary-foreground dark:hover:bg-secondary/`;
  };

  const HOURS = [
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
  ];

  const daysHeader = useMemo(() => {
    const baseDates = [
      { label: "Lunes" },
      { label: "Martes" },
      { label: "Miércoles" },
      { label: "Jueves" },
      { label: "Viernes" },
      { label: "Sábado" },
      { label: "Domingo" },
    ];
    return baseDates.map((d, index) => {
      const date = new Date(2026, 5, 29); // Monday June 29, 2026
      date.setDate(date.getDate() + index + currentWeekOffset * 7);
      const dayNum = date.getDate().toString().padStart(2, "0");
      return {
        label: d.label,
        dateStr: `${d.label.slice(0, 3).toUpperCase()} ${dayNum}`,
      };
    });
  }, [currentWeekOffset]);

  // Combined advanced filter memo
  const filteredClasses = useMemo(() => {
    return classesList.filter((c) => {
      const matchesWeek = (c.weekOffset || 0) === currentWeekOffset;
      const matchesSala = selectedCalendarSalaId ? c.salaId === selectedCalendarSalaId : true;
      const matchesCoach = !selectedFilterCoachId || c.staffId === selectedFilterCoachId;
      const matchesActivity = !selectedFilterActivity || c.name === selectedFilterActivity;
      return matchesWeek && matchesSala && matchesCoach && matchesActivity;
    });
  }, [
    classesList,
    currentWeekOffset,
    selectedCalendarSalaId,
    selectedFilterCoachId,
    selectedFilterActivity,
  ]);

  // List view filters classes just for "Hoy" (Monday/Lunes, index 0)
  const classesForToday = useMemo(() => {
    return filteredClasses.filter((c) => c.day === 0);
  }, [filteredClasses]);

  // Quick stats calculation for today
  const stats = useMemo(() => {
    const todayClasses = classesList.filter((c) => {
      const matchesWeek = (c.weekOffset || 0) === currentWeekOffset;
      return c.day === 0 && matchesWeek;
    });
    const totalBooked = todayClasses.reduce((acc, c) => acc + (c.booked || 0), 0);
    const totalCapacity = todayClasses.reduce((acc, c) => acc + (c.capacity || 0), 0);
    const avgOccupancy = totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0;
    const fullClasses = todayClasses.filter((c) => c.booked >= c.capacity).length;

    return {
      avgOccupancy,
      totalBooked,
      fullClasses,
    };
  }, [classesList, currentWeekOffset]);

  const renderClassDetailSidebar = () => {
    const c = classesList.find((classObj) => classObj.id === selectedClass);
    if (!selectedClass || !c) {
      return (
        <Dialog open={!!selectedClass} onOpenChange={(open) => !open && setSelectedClass(null)}>
          <DialogContent className="max-w-md border border-border bg-card text-center p-6 rounded-3xl">
            <DialogHeader>
              <DialogTitle>Detalle de clase</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
              <HelpCircle className="h-8 w-8 mb-2" />
              <p className="text-xs">Selecciona una clase para ver sus detalles.</p>
            </div>
          </DialogContent>
        </Dialog>
      );
    }

    const coach = staffList.find((s) => s.id === c.staffId);
    const salaName = salasList.find((s) => s.id === c.salaId)?.name || "Sin sala";

    const isStudentPrivate = (name: string) => {
      return ["Agustín Gómez", "Lucas Torres", "Pedro Giménez"].includes(name);
    };

    const getDisplayStudentName = (name: string) => {
      // En el Dashboard de Administración los administradores ven la identidad real del alumno
      return name;
    };

    const getEnrichedStudentInfo = (studentName: string) => {
      const username = `@${studentName.toLowerCase().replace(/[^a-z]/g, "")}`;
      const photo = getStudentPhoto(studentName);

      const matchedMember = [
        { name: "Agustín Gómez", plan: "Pase Libre", phone: "+54 9 11 3242-1241" },
        { name: "Camila Díaz", plan: "Performance", phone: "+54 9 11 4124-5124" },
        { name: "Marcos López", plan: "Pase Libre", phone: "+54 9 11 2341-2412" },
        { name: "Tomás Ruiz", plan: "Performance", phone: "+54 9 11 5122-1234" },
        { name: "Lucas Torres", plan: "Performance", phone: "+54 9 11 4124-1111" },
        { name: "Paula Cáceres", plan: "Pase Libre", phone: "+54 9 11 2344-9999" },
        { name: "Sofía Martínez", plan: "Pase Libre", phone: "+54 9 11 3333-8888" },
        { name: "Pedro Giménez", plan: "Pase Libre", phone: "+54 9 11 4444-7777" },
        { name: "María del Mar", plan: "Performance", phone: "+54 9 11 5555-6666" },
      ].find((m) => m.name.toLowerCase() === studentName.toLowerCase());

      return {
        username,
        photo,
        plan: matchedMember?.plan || "Pase Libre",
        phone: matchedMember?.phone || "+54 9 11 5555-1234",
      };
    };

    const checkIfLateCancellation = () => {
      const startStr = c.time.split("-")[0].trim();
      const [classHour, classMinute] = startStr.split(":").map(Number);
      if (c.day !== 0) return false;
      const now = new Date();
      const nowHour = now.getHours();
      const nowMinute = now.getMinutes();
      const classTotalMinutes = classHour * 60 + classMinute;
      const nowTotalMinutes = nowHour * 60 + nowMinute;
      const diffMinutes = classTotalMinutes - nowTotalMinutes;
      return diffMinutes < cancellationPolicyHours * 60;
    };

    const handleCancelSpot = (index: number, studentName: string) => {
      const displayNameForConfirm = getDisplayStudentName(studentName);
      const isLate = checkIfLateCancellation();
      const hasWaitlist = c.waitlist && c.waitlist.length > 0;

      if (hasWaitlist) {
        const nextStudent = c.waitlist![0];
        setConfirmDialog({
          isOpen: true,
          title: `Cancelar Reserva de ${displayNameForConfirm}`,
          description: `Se enviará una notificación automática (Push / WhatsApp) informando el cambio y reembolsando su crédito. Al haber alumnos en Lista de Espera, el lugar #${index + 1} se asignará automáticamente a ${nextStudent}.`,
          confirmText: "Confirmar Baja y Reasignar",
          variant: "destructive",
          onConfirm: () => {
            setClassesList((prev) =>
              prev.map((item) => {
                if (item.id === c.id) {
                  const copySpots = { ...item.enrolledSpots };
                  copySpots[index] = nextStudent;
                  const nextWaitlist = (item.waitlist || []).slice(1);
                  const copyAtt = { ...item.attendance };
                  copyAtt[index] = "pendiente";
                  return {
                    ...item,
                    enrolledSpots: copySpots,
                    waitlist: nextWaitlist,
                    attendance: copyAtt,
                  };
                }
                return item;
              }),
            );
            toast.success(
              `📢 Reserva de ${displayNameForConfirm} cancelada. Lugar #${index + 1} asignado a ${nextStudent} desde la lista de espera.`
            );
          },
        });
        return;
      }

      // Abrir modal Shadcn UI para consulta explícita de modalidad (Opción 1 vs Opción 2)
      setCancelOption("refund");
      setCancelSpotDialog({
        isOpen: true,
        c,
        index,
        studentName,
        displayNameForConfirm,
        hasWaitlist: false,
      });
    };

    const isSecondaryModalOpen =
      !!enrollModalClass ||
      !!substituteCoachModalClass ||
      !!waitlistModalClass ||
      !!confirmDialog?.isOpen ||
      !!promptDialog?.isOpen ||
      !!cancelSpotDialog?.isOpen;

    return (
      <Dialog
        open={!!selectedClass}
        onOpenChange={(open) => {
          if (!open && !isSecondaryModalOpen) {
            setSelectedClass(null);
          }
        }}
      >
        <DialogContent
          className="max-w-4xl h-[90vh] overflow-y-auto custom-scrollbar p-0 rounded-3xl border-border shadow-2xl bg-slate-50 dark:bg-background"
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => {
            if (isSecondaryModalOpen) {
              e.preventDefault();
            } else {
              setSelectedClass(null);
            }
          }}
        >
          {/* Header Card */}
          <div className="p-6 bg-card border-b border-border/60 sticky top-0 z-20 space-y-4">
              {/* Row 1: Badges & Header Actions */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs bg-primary/10 text-primary font-bold px-2.5 py-0.5 rounded-full border border-primary/20">
                    {salaName}
                  </span>
                  {c.status === "cancelada" ? (
                    <span className="text-xs bg-destructive/10 text-destructive font-bold px-2.5 py-0.5 rounded-full border border-destructive/20">
                      Clase Cancelada
                    </span>
                  ) : c.seekingBackup ? (
                    <span className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold px-2.5 py-0.5 rounded-full border border-amber-500/20">
                      Buscando Suplente
                    </span>
                  ) : (
                    <span className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      Sesión Activa
                    </span>
                  )}
                  <span className="text-xs bg-secondary border border-border/60 text-foreground font-bold px-2.5 py-0.5 rounded-full">
                    {c.creditsCost || 1} {c.creditsCost === 1 ? "crédito" : "créditos"}
                  </span>
                </div>

                {/* Header Actions Menu & Close Button */}
                <div className="flex items-center gap-2 shrink-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 rounded-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 text-xs font-bold gap-1.5 shadow-xs"
                        title="Acciones de Gestión de Clase"
                      >
                        <Wrench className="h-3.5 w-3.5" />
                        <span>Acciones</span>
                        <MoreVertical className="h-3.5 w-3.5 opacity-70" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-2xl p-1.5 shadow-xl border-border">
                      <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 py-1.5">
                        Gestión de Clase
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      {/* Inscribir Alumno */}
                      {c.status !== "cancelada" && c.booked < c.capacity && (
                        <DropdownMenuItem
                          className="rounded-xl cursor-pointer text-xs font-semibold gap-2 py-2"
                          onClick={() => {
                            setEnrollModalClass(c);
                          }}
                        >
                          <Plus className="h-4 w-4 text-primary" /> Inscribir Alumno
                        </DropdownMenuItem>
                      )}

                      {/* Sustituir Coach */}
                      <DropdownMenuItem
                        className="rounded-xl cursor-pointer text-xs font-semibold gap-2 py-2"
                        onClick={() => {
                          setSubstituteSearchTerm("");
                          setSubstituteCoachModalClass(c);
                        }}
                      >
                        <Users className="h-4 w-4 text-blue-500" /> Sustituir Coach
                      </DropdownMenuItem>

                      {/* Editar Clase */}
                      <DropdownMenuItem
                        className="rounded-xl cursor-pointer text-xs font-semibold gap-2 py-2"
                        onClick={() => {
                          setName(c.name);
                          setStaffId(c.staffId);
                          const parts = c.time.split("-");
                          setStartTime(parts[0]?.trim() || "08:00");
                          setEndTime(parts[1]?.trim() || "09:00");
                          setCreditsCost((c.creditsCost || 1).toString());
                          setSalaId(c.salaId || "");
                          setDay(c.day);
                          setCustomCapacity(c.capacity || 20);
                          setRequiresSpotSelection(c.requiresSpotSelection ?? true);
                          setRoutineBlocks(c.blocks || []);
                          setEditingClassId(c.id);
                          setShowAddForm(true);
                          setSelectedClass(null);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        <Edit2 className="h-4 w-4 text-amber-500" /> Editar Clase
                      </DropdownMenuItem>

                      {/* Cancelar Clase / Reactivar */}
                      {c.status === "cancelada" ? (
                        <DropdownMenuItem
                          className="rounded-xl cursor-pointer text-xs font-semibold gap-2 py-2 text-primary"
                          onClick={() => {
                            setConfirmDialog({
                              isOpen: true,
                              title: "Reactivar Clase",
                              description: `¿Deseas reactivar la clase "${c.name}"?`,
                              confirmText: "Reactivar Clase",
                              onConfirm: () => {
                                setClassesList((prev) =>
                                  prev.map((item) =>
                                    item.id === c.id ? { ...item, status: "activa" } : item,
                                  ),
                                );
                                toast.success(`📢 La clase "${c.name}" ha sido reactivada.`);
                              },
                            });
                          }}
                        >
                          <Check className="h-4 w-4" /> Reactivar Clase
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          className="rounded-xl cursor-pointer text-xs font-semibold gap-2 py-2 text-amber-600 dark:text-amber-400"
                          onClick={() => {
                            setConfirmDialog({
                              isOpen: true,
                              title: "Cancelar Sesión de Clase",
                              description: `¿Confirmas cancelar la clase "${c.name}"?\n\n• Se reembolsarán los créditos a todos los alumnos agendados (${c.booked} inscriptos).\n• Se enviará una notificación automática (Push / WhatsApp).`,
                              confirmText: "Sí, Cancelar Clase",
                              variant: "destructive",
                              onConfirm: () => {
                                setClassesList((prev) =>
                                  prev.map((item) =>
                                    item.id === c.id
                                      ? {
                                          ...item,
                                          status: "cancelada",
                                          enrolledSpots: {},
                                          releasedSpots: {},
                                          booked: 0,
                                          attendance: {},
                                          waitlist: [],
                                        }
                                      : item,
                                  ),
                                );
                                toast.info(`📢 Clase "${c.name}" cancelada. Notificación enviada a todos los inscriptos.`);
                              },
                            });
                          }}
                        >
                          <Slash className="h-4 w-4" /> Cancelar Clase
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuSeparator />

                      {/* Eliminar Permanentemente */}
                      <DropdownMenuItem
                        className="rounded-xl cursor-pointer text-xs font-semibold gap-2 py-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                        onClick={() => {
                          setPromptDialog({
                            isOpen: true,
                            title: "Eliminar Clase Definitivamente",
                            description: `⚠️ ¿Eliminar permanentemente "${c.name}"?\n\nPara confirmar, escribe "eliminar". Se notificará a los ${c.booked} alumnos inscriptos.`,
                            placeholder: 'Escribe "eliminar"',
                            confirmText: "Eliminar Definitivamente",
                            variant: "destructive",
                            onConfirm: (confirmWord) => {
                              if (confirmWord?.trim().toLowerCase() === "eliminar") {
                                setClassesList((prev) => prev.filter((item) => item.id !== c.id));
                                setSelectedClass(null);
                                toast.success(`⚠️ La clase "${c.name}" ha sido eliminada permanentemente.`);
                              } else {
                                toast.error('No escribiste "eliminar". La eliminación ha sido cancelada.');
                              }
                            },
                          });
                        }}
                      >
                        <Trash2 className="h-4 w-4" /> Eliminar Clase
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <button
                    type="button"
                    onClick={() => setSelectedClass(null)}
                    className="h-8 w-8 rounded-full bg-secondary/80 hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors border border-border/60"
                    title="Cerrar ventana"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Row 2: Title & Stats on Left, Coach Card on Right */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                <div>
                  <h2 className="text-2xl font-black text-foreground tracking-tight">{c.name}</h2>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                    <span>
                      Horario: <strong className="text-foreground font-bold">{c.time} hs</strong>
                    </span>
                    <span>·</span>
                    <span>
                      Ocupación:{" "}
                      <strong className="text-foreground font-bold">
                        {c.booked} / {c.capacity} cupos
                      </strong>
                    </span>
                  </p>
                </div>

                {/* Coach Card */}
                <div className="bg-background border border-border/60 p-3 rounded-2xl flex items-center gap-3 shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm border border-primary/20 shrink-0 uppercase">
                    {coach?.name
                      ? coach.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      : "ST"}
                  </div>
                  <div className="text-xs">
                    <span className="text-[10px] text-muted-foreground font-semibold block uppercase tracking-wider">
                      Profesor / Coach
                    </span>
                    <span className="font-bold text-foreground block">
                      {coach?.name || "Sin asignar"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Body: 2 Columns 50/50 Aligned System */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch w-full">

              {/* Row 2 Left: Lista de Reservas y Asistencia */}
              <div className="group rounded-3xl border border-border bg-card p-5 space-y-4 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg shadow-xs h-full flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-border/40">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                      Lista de Reservas y Asistencia
                    </span>
                    <span className="text-[10px] text-muted-foreground/70 font-semibold uppercase tracking-wider">
                      {c.booked} inscriptos
                    </span>
                  </div>

                  <div className="overflow-x-auto border border-border/40 rounded-2xl bg-secondary/20 max-h-[260px]">
                    <table className="w-full text-left text-xs min-w-[380px] border-collapse">
                      <thead>
                        <tr className="border-b border-border/40 bg-secondary/60 text-muted-foreground font-bold text-[10px] uppercase">
                          <th className="p-2.5">Alumno</th>
                          <th className="p-2.5 text-center">Asistencia</th>
                          <th className="p-2.5 text-center">Lugar</th>
                          <th className="p-2.5 text-right">Acción</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/30">
                        {Object.entries(c.enrolledSpots || {}).map(([spotIdxStr, name]) => {
                          const idx = parseInt(spotIdxStr);
                          const displayName = getDisplayStudentName(name);
                          const isPrivate = false;
                          const enriched = getEnrichedStudentInfo(name);

                          const currentAttendance = c.attendance?.[idx] || "pendiente";
                          const attendanceIcons = { pendiente: "⚪", presente: "🟢", ausente: "🔴" };
                          const attendanceLabels = {
                            pendiente: "Pendiente",
                            presente: "Presente",
                            ausente: "Ausente",
                          };

                          const handleToggleAttendance = () => {
                            const nextStatus =
                              currentAttendance === "pendiente"
                                ? "presente"
                                : currentAttendance === "presente"
                                  ? "ausente"
                                  : "pendiente";

                            setClassesList((prev) =>
                              prev.map((item) => {
                                if (item.id === c.id) {
                                  const copyAtt = { ...(item.attendance || {}) };
                                  copyAtt[idx] = nextStatus;
                                  return { ...item, attendance: copyAtt };
                                }
                                return item;
                              }),
                            );
                          };

                          return (
                            <tr key={idx} className="hover:bg-background transition-colors">
                              <td className="p-2.5 font-semibold">
                                <div className="flex items-center gap-2">
                                  {isPrivate ? (
                                    <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground shrink-0 border border-border/40">
                                      🔒
                                    </div>
                                  ) : (
                                    <img
                                      src={enriched.photo}
                                      alt={displayName}
                                      className="h-7 w-7 rounded-full object-cover shrink-0 border border-border/30"
                                    />
                                  )}
                                  <div className="leading-tight flex flex-col">
                                    <span className="font-bold text-foreground text-xs truncate max-w-[120px]">
                                      {displayName}
                                    </span>
                                    {!isPrivate && (
                                      <span className="text-[9.5px] text-muted-foreground">
                                        {enriched.username}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="p-2.5 text-center">
                                <button
                                  type="button"
                                  onClick={handleToggleAttendance}
                                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition whitespace-nowrap ${
                                    currentAttendance === "presente"
                                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                      : currentAttendance === "ausente"
                                        ? "bg-destructive/10 border-destructive/20 text-destructive"
                                        : "bg-background border-border text-muted-foreground"
                                  }`}
                                >
                                  {attendanceIcons[currentAttendance]}{" "}
                                  {attendanceLabels[currentAttendance]}
                                </button>
                              </td>
                              <td className="p-2.5 text-center font-bold">
                                <span className="bg-background px-2 py-0.5 rounded font-bold text-[10px] text-foreground border border-border/40">
                                  #{idx + 1}
                                </span>
                              </td>
                              <td className="p-2.5 text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 rounded-lg hover:bg-secondary border border-transparent hover:border-border/60"
                                      title="Acciones del Alumno"
                                    >
                                      <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-48 rounded-2xl p-1 shadow-xl border-border">
                                    <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2.5 py-1.5 truncate">
                                      {displayName}
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />

                                    {/* Marcar Presente */}
                                    <DropdownMenuItem
                                      className="rounded-xl cursor-pointer text-xs font-semibold gap-2 py-1.5"
                                      onClick={() => {
                                        setClassesList((prev) =>
                                          prev.map((item) => {
                                            if (item.id === c.id) {
                                              const copyAtt = { ...(item.attendance || {}) };
                                              copyAtt[idx] = "presente";
                                              return { ...item, attendance: copyAtt };
                                            }
                                            return item;
                                          }),
                                        );
                                      }}
                                    >
                                      <UserCheck className="h-3.5 w-3.5 text-emerald-500" /> Marcar Presente
                                    </DropdownMenuItem>

                                    {/* Marcar Ausente */}
                                    <DropdownMenuItem
                                      className="rounded-xl cursor-pointer text-xs font-semibold gap-2 py-1.5"
                                      onClick={() => {
                                        setClassesList((prev) =>
                                          prev.map((item) => {
                                            if (item.id === c.id) {
                                              const copyAtt = { ...(item.attendance || {}) };
                                              copyAtt[idx] = "ausente";
                                              return { ...item, attendance: copyAtt };
                                            }
                                            return item;
                                          }),
                                        );
                                      }}
                                    >
                                      <UserX className="h-3.5 w-3.5 text-destructive" /> Marcar Ausente
                                    </DropdownMenuItem>

                                    {/* Contactar por WhatsApp */}
                                    <DropdownMenuItem
                                      className="rounded-xl cursor-pointer text-xs font-semibold gap-2 py-1.5 text-emerald-600 dark:text-emerald-400"
                                      onClick={() => {
                                        const rawPhone = enriched.phone.replace(/[^0-9]/g, "");
                                        window.open(`https://wa.me/${rawPhone}`, "_blank");
                                      }}
                                    >
                                      <MessageCircle className="h-3.5 w-3.5" /> Contactar por WhatsApp
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />

                                    {/* Quitar Reserva */}
                                    <DropdownMenuItem
                                      className="rounded-xl cursor-pointer text-xs font-semibold gap-2 py-1.5 text-destructive focus:text-destructive focus:bg-destructive/10"
                                      onClick={() => handleCancelSpot(idx, name)}
                                    >
                                      <Trash2 className="h-3.5 w-3.5" /> Quitar Reserva
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </tr>
                          );
                        })}
                        {Object.keys(c.enrolledSpots || {}).length === 0 && (
                          <tr>
                            <td
                              colSpan={4}
                              className="text-xs text-muted-foreground italic text-center py-6"
                            >
                              Ningún alumno reservó lugar todavía.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Row 2 Right: Lista de Espera */}
              <div className="group rounded-3xl border border-border bg-card p-5 space-y-4 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg shadow-xs h-full flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-border/40">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                      Lista de Espera
                    </span>
                    <span className="text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                      {c.waitlist?.length || 0} en cola
                    </span>
                  </div>

                  {c.waitlist && c.waitlist.length > 0 ? (
                    <div className="space-y-2">
                      {c.waitlist.map((wName, wIdx) => (
                        <div
                          key={wIdx}
                          className="flex items-center justify-between p-3 bg-secondary/20 border border-border/40 rounded-xl text-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="h-6 w-6 rounded-full bg-background font-bold text-[10px] flex items-center justify-center border border-border/40 text-muted-foreground">
                              #{wIdx + 1}
                            </span>
                            <span className="font-bold text-foreground text-xs">{wName}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setConfirmDialog({
                                  isOpen: true,
                                  title: "Promover Alumno",
                                  description: `¿Confirmas promover a ${wName} para ocupar un lugar vacante en la clase?`,
                                  confirmText: "Promover Alumno",
                                  onConfirm: () => {
                                    setClassesList((prev) =>
                                      prev.map((item) => {
                                        if (item.id === c.id) {
                                          const nextWaitlist = (item.waitlist || []).filter(
                                            (_, idx) => idx !== wIdx,
                                          );
                                          const copySpots = { ...(item.enrolledSpots || {}) };
                                          let nextSpot = 0;
                                          while (copySpots[nextSpot]) nextSpot++;
                                          copySpots[nextSpot] = wName;
                                          return {
                                            ...item,
                                            waitlist: nextWaitlist,
                                            enrolledSpots: copySpots,
                                            booked: Object.keys(copySpots).length,
                                          };
                                        }
                                        return item;
                                      }),
                                    );
                                    toast.success(`✓ ${wName} inscripto en un lugar vacante.`);
                                  },
                                });
                              }}
                              className="text-[10.5px] font-bold text-primary hover:underline px-1 py-0.5"
                            >
                              Asignar Lugar
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setConfirmDialog({
                                  isOpen: true,
                                  title: "Quitar de Lista de Espera",
                                  description: `¿Quitar a "${wName}" de la lista de espera?\n\n• Se le enviará una notificación automática al alumno.`,
                                  confirmText: "Quitar de la Lista",
                                  variant: "destructive",
                                  onConfirm: () => {
                                    setClassesList((prev) =>
                                      prev.map((item) => {
                                        if (item.id === c.id) {
                                          const nextWaitlist = (item.waitlist || []).filter(
                                            (_, idx) => idx !== wIdx,
                                          );
                                          return { ...item, waitlist: nextWaitlist };
                                        }
                                        return item;
                                      }),
                                    );
                                    toast.info(`📢 Alumno "${wName}" removido de la lista de espera.`);
                                  },
                                });
                              }}
                              className="text-destructive hover:bg-destructive/10 p-1.5 rounded-lg transition-colors"
                              title="Quitar de lista de espera"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic py-8 text-center">
                      No hay alumnos en lista de espera para esta clase.
                    </p>
                  )}
                </div>

                {canManageClasses && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full text-xs font-bold border-border/60 hover:bg-secondary rounded-xl py-2 mt-2"
                    onClick={() => {
                      setWaitlistSearchTerm("");
                      setWaitlistPlanFilter("todos");
                      setWaitlistModalClass(c);
                    }}
                  >
                    + Sumar Alumno a Lista de Espera
                  </Button>
                )}
              </div>

              {/* Row 3 Full Width: Mapa de Distribución de Sala (Grilla 10x10) */}
              {c.requiresSpotSelection === false ? (
                <div className="md:col-span-2 rounded-3xl border border-border/80 bg-secondary/30 p-5 text-center space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                    Modo Aforo General (Sin Selección de Lugares Numerados)
                  </span>
                  <p className="text-xs text-muted-foreground max-w-lg mx-auto leading-relaxed">
                    Esta sesión está configurada en modalidad de aforo simple (ej. musculación o entrenamiento libre). Los alumnos agendan su cupo directo sin requerir la asignación de un número de lugar.
                  </p>
                </div>
              ) : (
                <div className="md:col-span-2 group rounded-3xl border border-border bg-card p-5 space-y-4 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-border/40 gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                      Distribución Física de la Sala (Mapa 10x10)
                    </span>
                    <div className="flex items-center gap-3 text-[10px] font-semibold text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 inline-block" />
                        Ocupado (Alumno)
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse inline-block" />
                        🟡 Retenido (Spot Lock 3m)
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-md border border-primary/40 bg-primary/10 inline-block" />
                        Disponible
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-md border border-dashed border-border/40 bg-muted/20 inline-block" />
                        Inhabilitado
                      </span>
                    </div>
                  </div>

                  {/* Banner de Spot Locks Activos */}
                  {Object.keys(c.lockedSpots || {}).length > 0 && (
                    <div className="p-3 bg-amber-500/15 border border-amber-500/40 text-amber-900 dark:text-amber-200 rounded-2xl flex items-center justify-between text-xs font-bold animate-fade-in gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-base">⏳</span>
                        <span>
                          {Object.keys(c.lockedSpots || {}).length}{" "}
                          {Object.keys(c.lockedSpots || {}).length === 1
                            ? "lugar retenido"
                            : "lugares retenidos"}{" "}
                          temporalmente en Spot Lock (expira en 3 minutos).
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Escenario / Frente */}
                  <div className="bg-secondary/40 border border-border/40 py-1.5 px-4 rounded-xl text-center text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground flex items-center justify-center gap-2">
                    <span>↑ FRENTE DE SALA / PROFESOR / ESCENARIO ↑</span>
                  </div>

                  {/* Grilla 10x10 */}
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-2.5 p-3 bg-secondary/20 rounded-2xl border border-border/40 overflow-x-auto custom-scrollbar">
                    {Array(100)
                      .fill(0)
                      .map((_, spotIdx) => {
                        const isEnabled = c.layout ? c.layout[spotIdx] : spotIdx < c.capacity;
                        const studentName = c.enrolledSpots?.[spotIdx];
                        const lockInfo = c.lockedSpots?.[spotIdx];

                        if (!isEnabled) {
                          return (
                            <div
                              key={spotIdx}
                              title={`Lugar #${spotIdx + 1} Inhabilitado`}
                              className="h-12 sm:h-14 w-full rounded-xl border border-dashed border-border/40 bg-muted/20 flex flex-col items-center justify-center opacity-40 cursor-not-allowed"
                            >
                              <span className="text-[10px] text-muted-foreground font-semibold">
                                #{spotIdx + 1}
                              </span>
                            </div>
                          );
                        }

                        // Casillero Ocupado por Alumno (Fotos Tipo Instagram MUY GRANDES)
                        if (studentName) {
                          const displayName = getDisplayStudentName(studentName);
                          const photo = getStudentPhoto(studentName);

                          return (
                            <div
                              key={spotIdx}
                              title={`Lugar #${spotIdx + 1}: ${displayName}`}
                              className="relative h-24 sm:h-28 w-full rounded-2xl border border-border/70 bg-card hover:border-primary/50 hover:bg-secondary/40 transition-all duration-300 flex flex-col items-center justify-between p-2 group/spot overflow-visible shadow-2xs"
                            >
                              <div className="p-[3px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 rounded-full aspect-square shrink-0 shadow-md group-hover/spot:scale-110 transition-transform duration-300 flex items-center justify-center">
                                <div className="p-[2px] bg-background rounded-full aspect-square shrink-0 flex items-center justify-center overflow-hidden">
                                  <img
                                    src={photo}
                                    alt={displayName}
                                    className="h-11 w-11 sm:h-13 sm:w-13 rounded-full aspect-square object-cover shrink-0"
                                  />
                                </div>
                              </div>
                              <div className="flex flex-col items-center leading-none max-w-full">
                                <span className="text-[10px] font-bold text-foreground truncate max-w-[64px] text-center block mb-0.5">
                                  {displayName}
                                </span>
                                <span className="text-[9px] font-black text-muted-foreground bg-secondary px-1.5 py-0.2 rounded-full border border-border/60 shadow-2xs">
                                  #{spotIdx + 1}
                                </span>
                              </div>
                            </div>
                          );
                        }

                        // Casillero en Spot Lock
                        if (lockInfo && lockInfo.expiresAt > now) {
                          const remainingStr = formatCountdown(lockInfo.expiresAt, now);
                          return (
                            <div
                              key={spotIdx}
                              title={`Lugar #${spotIdx + 1} RETENIDO por ${lockInfo.studentName} (Expira en ${remainingStr})`}
                              onClick={() => {
                                if (canManageClasses) {
                                  setConfirmDialog({
                                    isOpen: true,
                                    title: "Confirmar Reserva Retenida",
                                    description: `El Lugar #${spotIdx + 1} está retenido por ${lockInfo.studentName}.\n\n¿Deseas CONFIRMAR definitivamente la reserva?`,
                                    confirmText: "Confirmar Reserva",
                                    onConfirm: () => {
                                      setClassesList((prev) =>
                                        prev.map((item) => {
                                          if (item.id === c.id) {
                                            const copySpots = { ...(item.enrolledSpots || {}) };
                                            copySpots[spotIdx] = lockInfo.studentName;
                                            const copyLocks = { ...item.lockedSpots };
                                            delete copyLocks[spotIdx];
                                            return {
                                              ...item,
                                              enrolledSpots: copySpots,
                                              lockedSpots: copyLocks,
                                              booked: Object.keys(copySpots).length,
                                            };
                                          }
                                          return item;
                                        }),
                                      );
                                      toast.success(`✓ Reserva de ${lockInfo.studentName} confirmada.`);
                                    },
                                  });
                                }
                              }}
                              className="relative h-12 sm:h-14 w-full rounded-xl border border-amber-500/60 bg-amber-500/15 hover:bg-amber-500/25 transition-all duration-200 flex flex-col items-center justify-center p-1 cursor-pointer animate-pulse shadow-2xs"
                            >
                              <span className="text-[9px] font-black text-amber-700 dark:text-amber-300">
                                #{spotIdx + 1} 🔒
                              </span>
                              <span className="text-[8.5px] font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                                {remainingStr}
                              </span>
                            </div>
                          );
                        }

                        // Casillero Disponible
                        return (
                          <button
                            key={spotIdx}
                            type="button"
                            title={`Lugar #${spotIdx + 1} Libre — Haz clic para inscribir alumno`}
                            onClick={() => {
                              if (canManageClasses) {
                                setEnrollTargetSpotIndex(spotIdx);
                                setEnrollModalClass(c);
                              } else {
                                setPromptDialog({
                                  isOpen: true,
                                  title: `Retener Lugar #${spotIdx + 1}`,
                                  description: `Retendrás el lugar durante 3 minutos (Spot Lock).\nIngresa tu nombre:`,
                                  placeholder: "Tu nombre completo",
                                  confirmText: "Retener Lugar",
                                  onConfirm: (typedName) => {
                                    if (typedName?.trim()) {
                                      setClassesList((prev) =>
                                        prev.map((item) => {
                                          if (item.id === c.id) {
                                            const copyLocks = { ...(item.lockedSpots || {}) };
                                            copyLocks[spotIdx] = {
                                              studentName: typedName.trim(),
                                              expiresAt: Date.now() + 3 * 60 * 1000,
                                            };
                                            return {
                                              ...item,
                                              lockedSpots: copyLocks,
                                            };
                                          }
                                          return item;
                                        }),
                                      );
                                      toast.success(`Lugar #${spotIdx + 1} retenido durante 3 minutos.`);
                                    }
                                  },
                                });
                              }
                            }}
                            className="h-12 sm:h-14 w-full rounded-xl border border-primary/40 bg-primary/5 hover:bg-primary/20 hover:border-primary hover:scale-105 font-bold text-xs text-primary transition-all duration-200 flex flex-col items-center justify-center shadow-2xs"
                          >
                            <span className="text-[11px] font-extrabold">#{spotIdx + 1}</span>
                            <span className="text-[8.5px] opacity-75 font-semibold">Libre</span>
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}
            {/* Row 3: Estructura & Rutina de la Clase (Estilo WODify / SugarWOD) */}
            <div className="px-6 pb-6 w-full">
              <div className="group rounded-3xl border border-border bg-card p-5 space-y-4 transition-all duration-300 hover:border-foreground/30 hover:shadow-lg shadow-xs">
                <div className="flex items-center justify-between border-b border-border/40 pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-blue-500" />
                    <div>
                      <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                        Estructura & Rutina de la Clase (WODify / SugarWOD)
                      </h3>
                      <p className="text-xs font-bold text-foreground">
                        {c.name} — Plan de Sesión
                      </p>
                    </div>
                  </div>
                  {canManageClasses && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-xl text-xs font-bold gap-1.5 h-8"
                      onClick={() => {
                        setName(c.name);
                        setStaffId(c.staffId);
                        const parts = c.time.split("-");
                        setStartTime(parts[0]?.trim() || "08:00");
                        setEndTime(parts[1]?.trim() || "09:00");
                        setCreditsCost((c.creditsCost || 1).toString());
                        setSalaId(c.salaId || "");
                        setDay(c.day);
                        setCustomCapacity(c.capacity || 20);
                        setRequiresSpotSelection(c.requiresSpotSelection ?? true);
                        setRoutineBlocks(c.blocks || []);
                        setEditingClassId(c.id);
                        setShowAddForm(true);
                      }}
                    >
                      <Edit2 className="h-3.5 w-3.5 text-blue-500" />
                      {c.blocks && c.blocks.length > 0 ? "Editar Bloques" : "Añadir Bloques"}
                    </Button>
                  )}
                </div>

                {c.blocks && c.blocks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {c.blocks.map((block, idx) => {
                      const getBadgeColor = (type: ClassBlock["type"]) => {
                        switch (type) {
                          case "warmup":
                            return {
                              badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
                              label: "Calentamiento",
                            };
                          case "strength":
                            return {
                              badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
                              label: "Fuerza / Técnica",
                            };
                          case "main":
                            return {
                              badge: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
                              label: "WOD / Principal",
                            };
                          case "cooldown":
                            return {
                              badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
                              label: "Vuelta a Calma",
                            };
                          default:
                            return {
                              badge: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
                              label: "Personalizado",
                            };
                        }
                      };

                      const meta = getBadgeColor(block.type);

                      return (
                        <div
                          key={block.id || idx}
                          className="p-4 rounded-2xl border border-border/50 bg-secondary/20 hover:bg-secondary/40 transition-colors space-y-2 flex flex-col justify-between"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <span className={cn("text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border", meta.badge)}>
                                {meta.label}
                              </span>
                              {block.timeCap && (
                                <span className="text-[10.5px] font-bold text-muted-foreground bg-background px-2 py-0.5 rounded-md border border-border/40 flex items-center gap-1">
                                  <Clock className="h-3 w-3 text-muted-foreground" /> {block.timeCap}
                                </span>
                              )}
                            </div>

                            <div>
                              <h4 className="font-extrabold text-sm text-foreground">
                                {block.title}
                              </h4>
                              {block.subtitle && (
                                <p className="text-xs font-semibold text-primary">
                                  {block.subtitle}
                                </p>
                              )}
                            </div>

                            <p className="text-xs text-foreground/90 font-medium whitespace-pre-wrap leading-relaxed pt-1 bg-background/60 p-2.5 rounded-xl border border-border/40">
                              {block.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 border border-dashed border-border/60 bg-secondary/10 rounded-2xl text-center space-y-2">
                    <p className="text-xs text-muted-foreground italic">
                      Esta clase no tiene bloques de rutina cargados todavía.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <Fragment>
      {/* Modal Shadcn UI de Inscripción de Alumno */}
      <Dialog open={!!enrollModalClass} onOpenChange={(open) => !open && setEnrollModalClass(null)}>
        <DialogContent className="max-w-md rounded-3xl p-6 border-border shadow-2xl bg-slate-50 dark:bg-background">
          <DialogHeader className="pb-3 border-b border-border/40">
            <DialogTitle className="text-lg font-black text-foreground flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" /> Inscribir Alumno
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Busca y selecciona un alumno activo para inscribirlo
              {enrollTargetSpotIndex !== null ? (
                <> en el <strong className="text-primary font-bold">Lugar #{enrollTargetSpotIndex + 1}</strong> de </>
              ) : (
                <> en </>
              )}
              <strong className="text-foreground font-bold">{enrollModalClass?.name}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-3">
            {/* Buscador & Filtro por Plan (Shadcn/ui) */}
            <div className="space-y-2.5">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, email o teléfono..."
                  value={enrollSearchTerm}
                  onChange={(e) => setEnrollSearchTerm(e.target.value)}
                  className="pl-9 rounded-xl text-xs bg-secondary/30 border-border/60"
                />
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Filtrar por Plan:
                </span>
                <Select value={enrollPlanFilter} onValueChange={setEnrollPlanFilter}>
                  <SelectTrigger className="h-8 text-xs rounded-xl bg-secondary/30 border-border/60 w-44">
                    <SelectValue placeholder="Todos los planes" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="todos">Todos los planes</SelectItem>
                    <SelectItem value="Pase Libre">Pase Libre</SelectItem>
                    <SelectItem value="Performance">Performance</SelectItem>
                    <SelectItem value="Musculación">Musculación</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Lista de Alumnos Activos */}
            <div className="max-h-[280px] overflow-y-auto custom-scrollbar space-y-2 pr-1 pt-1">
              {availableMembersToEnroll.map((m: any) => {
                const isAlreadyEnrolled = Object.values(enrollModalClass?.enrolledSpots || {}).includes(m.name);
                return (
                  <div
                    key={m.name}
                    className="flex items-center justify-between p-2.5 rounded-2xl border border-border/50 bg-card hover:bg-secondary/30 transition-colors gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={m.photo || getStudentPhoto(m.name)}
                        alt={m.name}
                        className="h-9 w-9 rounded-full object-cover shrink-0 border border-border/60 shadow-2xs"
                      />
                      <div className="leading-tight min-w-0">
                        <span className="font-bold text-xs text-foreground block truncate">
                          {m.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1.5 flex-wrap">
                          <span className="bg-primary/10 text-primary px-1.5 py-0.2 rounded font-bold">
                            {m.plan || "Pase Libre"}
                          </span>
                          <span>· {m.status || "Activo"}</span>
                        </span>
                      </div>
                    </div>

                    {isAlreadyEnrolled ? (
                      <span className="text-[10px] font-bold text-muted-foreground bg-secondary px-2.5 py-1 rounded-xl border border-border/60 shrink-0">
                        Ya Inscripto
                      </span>
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        className="h-8 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs shrink-0 px-3"
                        onClick={() => {
                          handleEnrollMemberInClass(m.name);
                        }}
                      >
                        Inscribir
                      </Button>
                    )}
                  </div>
                );
              })}

              {availableMembersToEnroll.length === 0 && (
                <p className="text-xs text-muted-foreground italic text-center py-8">
                  No se encontraron alumnos activos coincidentes.
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Shadcn UI de Buscador y Registro en Lista de Espera */}
      <Dialog
        open={!!waitlistModalClass}
        onOpenChange={(open) => {
          if (!open) {
            setWaitlistModalClass(null);
            setWaitlistSearchTerm("");
          }
        }}
      >
        <DialogContent className="max-w-md rounded-3xl p-6 border-border shadow-2xl bg-slate-50 dark:bg-background">
          <DialogHeader className="pb-3 border-b border-border/40">
            <DialogTitle className="text-lg font-black text-foreground flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" /> Añadir a Lista de Espera
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed pt-1">
              Busca y selecciona un alumno activo para anotarlo en la lista de espera de{" "}
              <strong className="text-foreground font-bold">{waitlistModalClass?.name}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-3">
            {/* Buscador & Filtro por Plan (Shadcn UI) */}
            <div className="space-y-2.5">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, email o teléfono..."
                  value={waitlistSearchTerm}
                  onChange={(e) => setWaitlistSearchTerm(e.target.value)}
                  className="pl-9 rounded-xl text-xs bg-secondary/30 border-border/60"
                />
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Filtrar por Plan:
                </span>
                <Select value={waitlistPlanFilter} onValueChange={setWaitlistPlanFilter}>
                  <SelectTrigger className="h-8 text-xs rounded-xl bg-secondary/30 border-border/60 w-44">
                    <SelectValue placeholder="Todos los planes" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="todos">Todos los planes</SelectItem>
                    <SelectItem value="Pase Libre">Pase Libre</SelectItem>
                    <SelectItem value="Performance">Performance</SelectItem>
                    <SelectItem value="Musculación">Musculación</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Lista de Alumnos Activos */}
            <div className="max-h-[280px] overflow-y-auto custom-scrollbar space-y-2 pr-1 pt-1">
              {availableMembersToWaitlist.map((m: any) => {
                const isEnrolled = Object.values(waitlistModalClass?.enrolledSpots || {}).includes(m.name);
                const isInWaitlist = (waitlistModalClass?.waitlist || []).includes(m.name);

                return (
                  <div
                    key={m.name}
                    className="flex items-center justify-between p-2.5 rounded-2xl border border-border/50 bg-card hover:bg-secondary/30 transition-colors gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={m.photo || getStudentPhoto(m.name)}
                        alt={m.name}
                        className="h-9 w-9 rounded-full object-cover shrink-0 border border-border/60 shadow-2xs"
                      />
                      <div className="leading-tight min-w-0">
                        <span className="font-bold text-xs text-foreground block truncate">
                          {m.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1.5 flex-wrap">
                          <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.2 rounded font-bold">
                            {m.plan || "Pase Libre"}
                          </span>
                          <span>· {m.status || "Activo"}</span>
                        </span>
                      </div>
                    </div>

                    {isEnrolled ? (
                      <span className="text-[10px] font-bold text-muted-foreground bg-secondary px-2.5 py-1 rounded-xl border border-border/60 shrink-0">
                        Ya Inscripto
                      </span>
                    ) : isInWaitlist ? (
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20 shrink-0">
                        En Espera
                      </span>
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        className="h-8 text-xs font-bold rounded-xl bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 shadow-2xs shrink-0 px-3"
                        onClick={() => {
                          const studentName = m.name;
                          setClassesList((prev) =>
                            prev.map((item) => {
                              if (item.id === waitlistModalClass.id) {
                                const currentWaitlist = item.waitlist || [];
                                return { ...item, waitlist: [...currentWaitlist, studentName] };
                              }
                              return item;
                            })
                          );
                          toast.success(`✓ ${studentName} registrado en la lista de espera.`);
                          setWaitlistModalClass(null);
                          setWaitlistSearchTerm("");
                        }}
                      >
                        Añadir a Lista
                      </Button>
                    )}
                  </div>
                );
              })}

              {availableMembersToWaitlist.length === 0 && (
                <p className="text-xs text-muted-foreground italic text-center py-8">
                  No se encontraron alumnos activos coincidentes.
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Toaster de Sonner */}
      <Toaster position="top-right" richColors />

      {/* Modal Shadcn UI de Confirmación Genérico */}
      <AlertDialog open={!!confirmDialog?.isOpen} onOpenChange={(open) => !open && setConfirmDialog(null)}>
        <AlertDialogContent className="max-w-md rounded-3xl p-6 border-border shadow-2xl bg-background">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-black text-foreground flex items-center gap-2">
              {confirmDialog?.variant === "destructive" ? (
                <ShieldAlert className="h-5 w-5 text-destructive" />
              ) : (
                <AlertCircle className="h-5 w-5 text-primary" />
              )}
              {confirmDialog?.title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed pt-1">
              {confirmDialog?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-4 border-t border-border/40 gap-2 sm:gap-2">
            <AlertDialogCancel
              onClick={() => setConfirmDialog(null)}
              className="rounded-xl text-xs font-semibold mt-0"
            >
              {confirmDialog?.cancelText || "Cancelar"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmDialog?.onConfirm) confirmDialog.onConfirm();
                setConfirmDialog(null);
              }}
              className={cn(
                "rounded-xl text-xs font-bold",
                confirmDialog?.variant === "destructive"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              {confirmDialog?.confirmText || "Confirmar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal Shadcn UI de Prompt Genérico */}
      <Dialog
        open={!!promptDialog?.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setPromptDialog(null);
            setPromptInputValue("");
          }
        }}
      >
        <DialogContent className="max-w-md rounded-3xl p-6 border-border shadow-2xl bg-background">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg font-black text-foreground flex items-center gap-2">
              <Edit2 className="h-5 w-5 text-primary" />
              {promptDialog?.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1">
              {promptDialog?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Input
              autoFocus
              value={promptInputValue}
              onChange={(e) => setPromptInputValue(e.target.value)}
              placeholder={promptDialog?.placeholder || "Ingresa un valor..."}
              className="rounded-xl text-xs bg-secondary/30 border-border/60"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (promptDialog?.onConfirm) promptDialog.onConfirm(promptInputValue);
                  setPromptDialog(null);
                  setPromptInputValue("");
                }
              }}
            />
          </div>
          <DialogFooter className="pt-3 border-t border-border/40 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl text-xs font-semibold"
              onClick={() => {
                setPromptDialog(null);
                setPromptInputValue("");
              }}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              size="sm"
              className={cn(
                "rounded-xl text-xs font-bold",
                promptDialog?.variant === "destructive"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
              onClick={() => {
                if (promptDialog?.onConfirm) promptDialog.onConfirm(promptInputValue);
                setPromptDialog(null);
                setPromptInputValue("");
              }}
            >
              {promptDialog?.confirmText || "Aceptar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Shadcn UI de Selección de Modalidad al Cancelar Reserva (Admin) */}
      <Dialog
        open={!!cancelSpotDialog?.isOpen}
        onOpenChange={(open) => !open && setCancelSpotDialog(null)}
      >
        <DialogContent className="max-w-md rounded-3xl p-6 border-border shadow-2xl bg-background">
          <DialogHeader className="pb-3 border-b border-border/40">
            <DialogTitle className="text-lg font-black text-foreground flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-500" /> Cancelar Reserva
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Elige la modalidad para procesar la baja de <strong>{cancelSpotDialog?.displayNameForConfirm}</strong> (Lugar #{cancelSpotDialog ? cancelSpotDialog.index + 1 : 0}):
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-3">
            {/* Opción 1: Devolver crédito automáticamente */}
            <div
              onClick={() => setCancelOption("refund")}
              className={cn(
                "p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex items-start gap-3",
                cancelOption === "refund"
                  ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                  : "border-border/60 bg-card hover:bg-secondary/40"
              )}
            >
              <div
                className={cn(
                  "h-5 w-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-colors",
                  cancelOption === "refund"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/40"
                )}
              >
                {cancelOption === "refund" && <Check className="h-3 w-3 stroke-[3]" />}
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">1. Devolver créditos automáticamente</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                  Reembolso inmediato e incondicional del crédito a la cuenta del alumno.
                </p>
              </div>
            </div>

            {/* Opción 2: Aplicar Re-reserva */}
            <div
              onClick={() => setCancelOption("rereserva")}
              className={cn(
                "p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex items-start gap-3",
                cancelOption === "rereserva"
                  ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                  : "border-border/60 bg-card hover:bg-secondary/40"
              )}
            >
              <div
                className={cn(
                  "h-5 w-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-colors",
                  cancelOption === "rereserva"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/40"
                )}
              >
                {cancelOption === "rereserva" && <Check className="h-3 w-3 stroke-[3]" />}
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">2. Aplicar modalidad "Re-reserva"</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                  Libera el casillero en la sala. El reembolso se procesará únicamente si otro alumno vuelve a agendar la plaza.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-border/40 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl text-xs font-semibold"
              onClick={() => setCancelSpotDialog(null)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              size="sm"
              className="rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => {
                if (!cancelSpotDialog) return;
                const { c, index, studentName, displayNameForConfirm } = cancelSpotDialog;

                if (cancelOption === "rereserva") {
                  setClassesList((prev) =>
                    prev.map((item) => {
                      if (item.id === c.id) {
                        const copySpots = { ...item.enrolledSpots };
                        delete copySpots[index];
                        const copyReleased = { ...(item.releasedSpots || {}) };
                        copyReleased[index] = {
                          originalStudent: studentName,
                          creditsCost: c.creditsCost || 1,
                        };
                        const copyAtt = { ...item.attendance };
                        delete copyAtt[index];
                        return {
                          ...item,
                          enrolledSpots: copySpots,
                          releasedSpots: copyReleased,
                          attendance: copyAtt,
                          booked: Object.keys(copySpots).length,
                        };
                      }
                      return item;
                    }),
                  );
                  toast.info(
                    `📢 Lugar #${index + 1} liberado bajo modalidad "Disponible para Re-reserva".`
                  );
                } else {
                  setClassesList((prev) =>
                    prev.map((item) => {
                      if (item.id === c.id) {
                        const copySpots = { ...item.enrolledSpots };
                        delete copySpots[index];
                        const copyAtt = { ...item.attendance };
                        delete copyAtt[index];
                        return {
                          ...item,
                          enrolledSpots: copySpots,
                          attendance: copyAtt,
                          booked: Object.keys(copySpots).length,
                        };
                      }
                      return item;
                    }),
                  );
                  toast.success(
                    `📢 Reserva de ${displayNameForConfirm} cancelada. Crédito reembolsado automáticamente.`
                  );
                }
                setCancelSpotDialog(null);
              }}
            >
              Confirmar Baja
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Shadcn UI de Buscador y Asignación de Profesor Sustituto */}
      <Dialog
        open={!!substituteCoachModalClass}
        onOpenChange={(open) => {
          if (!open) {
            setSubstituteCoachModalClass(null);
            setSubstituteSearchTerm("");
          }
        }}
      >
        <DialogContent className="max-w-md rounded-3xl p-6 border-border shadow-2xl bg-slate-50 dark:bg-background">
          <DialogHeader className="pb-3 border-b border-border/40">
            <DialogTitle className="text-lg font-black text-foreground flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" /> Sustituir Profesor
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed pt-1">
              Busca y selecciona un profesor del Staff para sustituir la clase{" "}
              <strong className="text-foreground font-bold">{substituteCoachModalClass?.name}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-3">
            {/* Buscador de Profesores (Shadcn UI Input) */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar profesor por nombre o especialidad..."
                value={substituteSearchTerm}
                onChange={(e) => setSubstituteSearchTerm(e.target.value)}
                className="pl-9 rounded-xl text-xs bg-secondary/30 border-border/60"
              />
            </div>

            {/* Lista de Profesores del Staff */}
            <div className="max-h-[280px] overflow-y-auto custom-scrollbar space-y-2 pr-1 pt-1">
              {availableCoachesToSubstitute.map((s: any) => {
                const isCurrentCoach =
                  substituteCoachModalClass?.staffId === s.id ||
                  substituteCoachModalClass?.coach?.toLowerCase() === s.name?.toLowerCase();

                return (
                  <div
                    key={s.id || s.name}
                    className="flex items-center justify-between p-2.5 rounded-2xl border border-border/50 bg-card hover:bg-secondary/30 transition-colors gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={s.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&q=80"}
                        alt={s.name}
                        className="h-9 w-9 rounded-full object-cover shrink-0 border border-border/60 shadow-2xs"
                      />
                      <div className="leading-tight min-w-0">
                        <span className="font-bold text-xs text-foreground block truncate">
                          {s.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1.5 flex-wrap">
                          <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 px-1.5 py-0.2 rounded font-bold">
                            {s.specialty || "Entrenador"}
                          </span>
                        </span>
                      </div>
                    </div>

                    {isCurrentCoach ? (
                      <span className="text-[10px] font-bold text-muted-foreground bg-secondary px-2.5 py-1 rounded-xl border border-border/60 shrink-0">
                        Coach Actual
                      </span>
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        className="h-8 text-xs font-bold rounded-xl bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 shadow-2xs shrink-0 px-3"
                        onClick={() => {
                          const coachName = s.name;
                          setClassesList((prev) =>
                            prev.map((item) =>
                              item.id === substituteCoachModalClass.id
                                ? { ...item, staffId: s.id, coach: coachName, seekingBackup: false }
                                : item
                            )
                          );
                          toast.success(`Profesor ${coachName} asignado como sustituto.`);
                          setSubstituteCoachModalClass(null);
                          setSubstituteSearchTerm("");
                        }}
                      >
                        Asignar Sustituto
                      </Button>
                    )}
                  </div>
                );
              })}

              {availableCoachesToSubstitute.length === 0 && (
                <p className="text-xs text-muted-foreground italic text-center py-8">
                  No se encontraron profesores del Staff coincidentes.
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>


      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Calendario de Clases</h2>
          <p className="text-sm text-muted-foreground">
            Clases planificadas vinculando los entrenadores de tu Staff.
          </p>
        </div>

        {/* Toggle View Mode, Week Pagination & Add Button */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Week Pagination */}
          <div className="flex items-center rounded-xl bg-secondary p-1 border border-border/50 shrink-0">
            <button
              type="button"
              onClick={() => setCurrentWeekOffset((prev) => Math.max(0, prev - 1))}
              disabled={currentWeekOffset === 0}
              className="px-2 py-1 text-xs font-bold rounded hover:bg-background transition text-foreground disabled:opacity-30"
            >
              ◀
            </button>
            <span className="text-xs font-bold px-2 text-foreground/80 min-w-[70px] text-center select-none">
              Semana {currentWeekOffset + 1}
            </span>
            <button
              type="button"
              onClick={() => setCurrentWeekOffset((prev) => prev + 1)}
              className="px-2 py-1 text-xs font-bold rounded hover:bg-background transition text-foreground"
            >
              ▶
            </button>
          </div>

          <div className="flex rounded-xl bg-secondary p-1 border border-border/50 shrink-0">
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-background text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Lista de Hoy
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                viewMode === "calendar"
                  ? "bg-background text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Vista Semanal
            </button>
          </div>

          {canManageClasses && (
            <Button
              size="sm"
              className="rounded-full bg-black hover:bg-black/90 text-white dark:bg-white dark:hover:bg-white/90 dark:text-black font-bold gap-1.5 px-4"
              onClick={() => {
                setEditingClassId(null);
                setName("");
                setStaffId("");
                setStartTime("08:00");
                setEndTime("09:00");
                setSalaId("");
                setDay(0);
                setCreditsCost("1");
                setCustomCapacity(20);
                setShowAddForm(true);
              }}
            >
              <Plus className="h-4 w-4" /> Crear clase
            </Button>
          )}
        </div>
      </div>

      {/* Quick Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
        <div className="group rounded-3xl border border-border bg-card p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg shadow-xs h-full">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
            Ocupación Hoy
          </span>
          <span className="text-2xl font-black text-foreground mt-2 block">{stats.avgOccupancy}%</span>
        </div>
        <div className="group rounded-3xl border border-border bg-card p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg shadow-xs h-full">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
            Reservas Activas
          </span>
          <span className="text-2xl font-black text-foreground mt-2 block">{stats.totalBooked} alumnos</span>
        </div>
        <div className="group rounded-3xl border border-border bg-card p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg shadow-xs h-full">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
            Clases Llenas
          </span>
          <span className="text-2xl font-black text-foreground mt-2 block">
            {stats.fullClasses} completadas
          </span>
        </div>
      </div>

      {/* Advanced Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 p-3.5 bg-secondary/15 rounded-2xl border border-border/40 text-xs text-foreground">
        <span className="font-bold text-muted-foreground uppercase text-[9.5px] tracking-wider pr-1">
          Filtros Rápidos:
        </span>

        {/* Room Filter */}
        <Select
          value={selectedCalendarSalaId || "all"}
          onValueChange={(val) => setSelectedCalendarSalaId(val === "all" ? "" : val)}
        >
          <SelectTrigger className="h-8 rounded-xl border border-border bg-background px-3 text-xs text-foreground font-semibold w-[160px]">
            <SelectValue placeholder="Todas las salas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las salas</SelectItem>
            {salasList.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Coach Filter */}
        <Select
          value={selectedFilterCoachId || "all"}
          onValueChange={(val) => setSelectedFilterCoachId(val === "all" ? "" : val)}
        >
          <SelectTrigger className="h-8 rounded-xl border border-border bg-background px-3 text-xs text-foreground font-semibold w-[170px]">
            <SelectValue placeholder="Todos los profesores" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los profesores</SelectItem>
            {staffList.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Activity Filter */}
        <Select
          value={selectedFilterActivity || "all"}
          onValueChange={(val) => setSelectedFilterActivity(val === "all" ? "" : val)}
        >
          <SelectTrigger className="h-8 rounded-xl border border-border bg-background px-3 text-xs text-foreground font-semibold w-[170px]">
            <SelectValue placeholder="Todas las actividades" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las actividades</SelectItem>
            {Array.from(new Set(classesList.map((c) => c.name)))
              .sort()
              .map((actName) => (
                <SelectItem key={actName} value={actName}>
                  {actName}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        {/* Clear Filters Button */}
        {(selectedCalendarSalaId || selectedFilterCoachId || selectedFilterActivity) && (
          <button
            type="button"
            onClick={() => {
              setSelectedCalendarSalaId("");
              setSelectedFilterCoachId("");
              setSelectedFilterActivity("");
            }}
            className="h-8 px-3 text-xs font-bold text-destructive hover:text-destructive bg-destructive/ rounded-xl transition hover:bg-destructive/ shrink-0"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Modal Dialog: Crear / Editar Clase */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-xl max-h-[88vh] border border-border bg-slate-50 dark:bg-background rounded-3xl p-6 overflow-hidden flex flex-col">
          <DialogHeader className="shrink-0 pb-2">
            <DialogTitle className="text-lg font-bold text-foreground">
              {editingClassId ? "Editar Clase" : "Crear Nueva Clase"}
            </DialogTitle>
          </DialogHeader>

          <div className="overflow-y-auto custom-scrollbar flex-1 pr-1.5 pt-1">
            <form onSubmit={handleAddClass} className="space-y-4 text-xs text-foreground pb-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Actividad</label>
                <Select value={name} onValueChange={setName}>
                  <SelectTrigger className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground font-semibold">
                    <SelectValue placeholder="Selecciona una actividad..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Fuerza y Musculación</SelectLabel>
                      <SelectItem value="CrossFit">CrossFit</SelectItem>
                      <SelectItem value="Entrenamiento Funcional">Entrenamiento Funcional</SelectItem>
                      <SelectItem value="Levantamiento Olímpico">Levantamiento Olímpico</SelectItem>
                      <SelectItem value="Powerlifting">Powerlifting</SelectItem>
                      <SelectItem value="Calistenia">Calistenia</SelectItem>
                      <SelectItem value="Fuerza de Potencia">Fuerza de Potencia</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Cardio y Combate</SelectLabel>
                      <SelectItem value="Spinning">Spinning / Cycling</SelectItem>
                      <SelectItem value="HIIT / Tabata">HIIT / Tabata</SelectItem>
                      <SelectItem value="Boxeo Recreativo">Boxeo Recreativo</SelectItem>
                      <SelectItem value="Kickboxing">Kickboxing</SelectItem>
                      <SelectItem value="Zumba">Zumba Fitness</SelectItem>
                      <SelectItem value="Ritmos / Dance">Ritmos / Dance</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Flexibilidad y Cuerpo-Mente</SelectLabel>
                      <SelectItem value="Yoga Vinyasa">Yoga Vinyasa</SelectItem>
                      <SelectItem value="Yoga Hatha">Yoga Hatha</SelectItem>
                      <SelectItem value="Pilates Reformer">Pilates Reformer</SelectItem>
                      <SelectItem value="Pilates Mat">Pilates Mat</SelectItem>
                      <SelectItem value="Barré">Barré</SelectItem>
                      <SelectItem value="Estiramiento / Flex">Estiramiento & Flexibilidad</SelectItem>
                      <SelectItem value="Meditación">Meditación & Mindfulness</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Especializadas y Localizadas</SelectLabel>
                      <SelectItem value="GAP">GAP (Glúteo-Abdo-Pierna)</SelectItem>
                      <SelectItem value="AquaGym">AquaGym</SelectItem>
                      <SelectItem value="Running Club">Running Club</SelectItem>
                      <SelectItem value="Tercera Edad Adaptada">Tercera Edad Adaptada</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-1 flex-wrap">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Instructor de Staff
                  </label>
                  {name && (
                    <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
                      {filteredStaffForClass.length > 0
                        ? `Filtrado para: ${name} (${filteredStaffForClass.length})`
                        : "Mostrando todo el staff"}
                    </span>
                  )}
                </div>
                <Select value={staffId} onValueChange={setStaffId}>
                  <SelectTrigger className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground font-semibold">
                    <SelectValue placeholder="Selecciona un entrenador..." />
                  </SelectTrigger>
                  <SelectContent>
                    {(filteredStaffForClass.length > 0 ? filteredStaffForClass : staffList).map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} — <span className="opacity-75 font-normal text-xs">{s.specialty}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {name && filteredStaffForClass.length === 0 && (
                  <p className="text-[10.5px] text-amber-600 dark:text-amber-400 font-medium pt-0.5">
                    No hay entrenadores con especialidad en "{name}" cargada. Se muestran todos los profesores del staff.
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Día de la Semana
                </label>
                <Select value={day.toString()} onValueChange={(val) => setDay(Number(val))}>
                  <SelectTrigger className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground font-semibold">
                    <SelectValue placeholder="Selecciona un día..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Lunes</SelectItem>
                    <SelectItem value="1">Martes</SelectItem>
                    <SelectItem value="2">Miércoles</SelectItem>
                    <SelectItem value="3">Jueves</SelectItem>
                    <SelectItem value="4">Viernes</SelectItem>
                    <SelectItem value="5">Sábado</SelectItem>
                    <SelectItem value="6">Domingo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Horario de la Clase
                </label>
                <div className="flex items-center gap-2">
                  <Select value={startTime} onValueChange={setStartTime}>
                    <SelectTrigger className="flex h-10 w-full rounded-xl border border-border bg-background px-2 py-2 text-xs text-foreground font-semibold">
                      <SelectValue placeholder="Inicio" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "07:00",
                        "07:30",
                        "08:00",
                        "08:30",
                        "09:00",
                        "09:30",
                        "10:00",
                        "10:30",
                        "11:00",
                        "11:30",
                        "12:00",
                        "12:30",
                        "13:00",
                        "13:30",
                        "14:00",
                        "14:30",
                        "15:00",
                        "15:30",
                        "16:00",
                        "16:30",
                        "17:00",
                        "17:30",
                        "18:00",
                        "18:30",
                        "19:00",
                        "19:30",
                        "20:00",
                        "20:30",
                        "21:00",
                        "21:30",
                        "22:00",
                      ].map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <span className="text-xs font-bold text-muted-foreground">a</span>

                  <Select value={endTime} onValueChange={setEndTime}>
                    <SelectTrigger className="flex h-10 w-full rounded-xl border border-border bg-background px-2 py-2 text-xs text-foreground font-semibold">
                      <SelectValue placeholder="Fin" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "07:30",
                        "08:00",
                        "08:30",
                        "09:00",
                        "09:30",
                        "10:00",
                        "10:30",
                        "11:00",
                        "11:30",
                        "12:00",
                        "12:30",
                        "13:00",
                        "13:30",
                        "14:00",
                        "14:30",
                        "15:00",
                        "15:30",
                        "16:00",
                        "16:30",
                        "17:00",
                        "17:30",
                        "18:00",
                        "18:30",
                        "19:00",
                        "19:30",
                        "20:00",
                        "20:30",
                        "21:00",
                        "21:30",
                        "22:00",
                        "22:30",
                      ].map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Sala / Salón</label>
                <Select
                  value={salaId}
                  onValueChange={(val) => {
                    setSalaId(val);
                    const selectedSala = salasList.find((s) => s.id === val);
                    if (selectedSala && selectedSala.capacity) {
                      setCustomCapacity(selectedSala.capacity);
                    }
                  }}
                >
                  <SelectTrigger className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground font-semibold">
                    <SelectValue placeholder="Selecciona una sala..." />
                  </SelectTrigger>
                  <SelectContent>
                    {salasList.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} (Capacidad: {s.capacity || "N/A"})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Switch: Selección de Lugares / Mapa de Sala vs Aforo Simple */}
            <div className="p-4 border border-border/80 bg-card rounded-2xl space-y-2 flex items-center justify-between gap-4 shadow-2xs">
              <div className="space-y-0.5 pr-2">
                <label htmlFor="spot-selection-switch" className="text-xs font-bold text-foreground cursor-pointer flex items-center gap-2">
                  <QrCode className="h-4 w-4 text-emerald-500" />
                  <span>Habilitar Selección de Lugares / Mapa de Sala</span>
                </label>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Desactiva esta opción para actividades sin mapa numerado (ej. Musculación, Pase Libre) donde solo se contabilizan los cupos disponibles.
                </p>
              </div>
              <Switch
                id="spot-selection-switch"
                checked={requiresSpotSelection}
                onCheckedChange={setRequiresSpotSelection}
              />
            </div>

            {!requiresSpotSelection ? (
              <div className="p-4 bg-secondary/30 border border-border rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                      Modo Aforo General (Sin Mapa Numerado)
                    </span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Los miembros se inscribirán al cupo general sin elegir un número de asiento o mat.
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-semibold text-foreground">Cupos Totales / Aforo Máximo</label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={customCapacity}
                    onChange={(e) => setCustomCapacity(Number(e.target.value) || 1)}
                    className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground font-semibold"
                  />
                </div>
              </div>
            ) : (
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl space-y-3">
                {/* Card Destacada: Plantilla y Mapa de Distribución de Sala (10x10) */}
                {/* Header with Title */}
                <div className="flex items-center justify-between flex-wrap gap-2 border-b border-primary/10 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                    🗺️ Distribución de Sala (Mapa 10x10)
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10.5px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                      {layoutMatrix.filter(Boolean).length} lugares activos
                    </span>
                  </div>
                </div>

                {/* Selector & Actions Row */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Plantilla de Salón:
                    </label>
                    {!showSavePresetInput && (
                      <button
                        type="button"
                        onClick={() => setShowSavePresetInput(true)}
                        className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1"
                      >
                        💾 Guardar mapa como plantilla
                      </button>
                    )}
                  </div>

                  <Select
                    value={selectedPresetId}
                    onValueChange={(val) => {
                      setSelectedPresetId(val);
                      const preset = ROOM_PRESETS.find((p) => p.id === val);
                      if (preset) {
                        const newLayout = preset.getLayout();
                        setLayoutMatrix(newLayout);
                        setCustomCapacity(newLayout.filter(Boolean).length);
                      }
                    }}
                  >
                    <SelectTrigger className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground font-semibold shadow-2xs">
                      <SelectValue placeholder="Selecciona una plantilla de salón..." />
                    </SelectTrigger>
                    <SelectContent>
                      {ROOM_PRESETS.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{p.name}</span>
                            {p.id.startsWith("preset-") && (
                              <span className="ml-2 text-[9px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                                Tu plantilla
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Inline Save Preset Input when clicked */}
                  {showSavePresetInput && (
                    <div className="p-2.5 bg-background border border-primary/30 rounded-xl space-y-2 animate-fade-in shadow-2xs">
                      <label className="text-[10.5px] font-bold text-foreground block">
                        Nombre para la nueva plantilla:
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Ej: Sala Spinning 18 Bicis"
                          value={newPresetName}
                          onChange={(e) => setNewPresetName(e.target.value)}
                          className="flex-1 h-8 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground font-semibold focus-visible:outline-none"
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => {
                            if (newPresetName.trim()) {
                              const newPreset = {
                                id: `preset-${Date.now()}`,
                                name: newPresetName.trim(),
                                capacity: layoutMatrix.filter(Boolean).length,
                                getLayout: () => [...layoutMatrix],
                              };
                              setCustomPresets((prev) => [...prev, newPreset]);
                              setSelectedPresetId(newPreset.id);
                              setNewPresetName("");
                              setShowSavePresetInput(false);
                            }
                          }}
                          className="h-8 rounded-lg text-xs font-bold"
                        >
                          Guardar
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowSavePresetInput(false)}
                          className="h-8 rounded-lg text-xs"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Custom Presets Pill Badges List */}
                  {customPresets.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">
                        Tus plantillas:
                      </span>
                      {customPresets.map((cp) => (
                        <span
                          key={cp.id}
                          className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                            selectedPresetId === cp.id
                              ? "bg-primary/15 border-primary/40 text-primary"
                              : "bg-background border-border/60 text-foreground"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPresetId(cp.id);
                              const newLayout = cp.getLayout();
                              setLayoutMatrix(newLayout);
                              setCustomCapacity(newLayout.filter(Boolean).length);
                            }}
                            className="hover:underline"
                          >
                            {cp.name}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setConfirmDialog({
                                isOpen: true,
                                title: "Eliminar Plantilla de Salón",
                                description: `¿Estás seguro de eliminar la plantilla "${cp.name}"?`,
                                confirmText: "Eliminar Plantilla",
                                variant: "destructive",
                                onConfirm: () => {
                                  setCustomPresets((prev) => prev.filter((p) => p.id !== cp.id));
                                  if (selectedPresetId === cp.id) {
                                    const defaultP = defaultPresets[1] || defaultPresets[0];
                                    setSelectedPresetId(defaultP.id);
                                    const newLayout = defaultP.getLayout();
                                    setLayoutMatrix(newLayout);
                                    setCustomCapacity(newLayout.filter(Boolean).length);
                                  }
                                  toast.success(`Plantilla "${cp.name}" eliminada.`);
                                },
                              });
                            }}
                            className="text-destructive/70 hover:text-destructive transition-colors ml-0.5"
                            title="Eliminar esta plantilla"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mini Map Preview Grid (10x10) */}
                <div className="bg-background border border-border/60 p-3 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    <span>Haz clic en los casilleros para activarlos/desactivarlos</span>
                    <span>Frente ↑</span>
                  </div>
                  <div className="grid grid-cols-10 gap-1 p-1.5 bg-secondary/20 rounded-lg border border-border/40 max-h-[160px] overflow-y-auto custom-scrollbar">
                    {layoutMatrix.map((isActive, idx) => (
                      <button
                        key={idx}
                        type="button"
                        title={`Lugar #${idx + 1}`}
                        onClick={() => {
                          const updated = [...layoutMatrix];
                          updated[idx] = !updated[idx];
                          setLayoutMatrix(updated);
                          setSelectedPresetId("custom");
                          setCustomCapacity(updated.filter(Boolean).length);
                        }}
                        className={`h-5 w-full rounded-md text-[9px] font-bold transition-all flex items-center justify-center ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-2xs"
                            : "bg-muted/40 text-muted-foreground/30 border border-dashed border-border/40 hover:bg-muted"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Cupos / Capacidad Máxima
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="100"
                  value={customCapacity}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setCustomCapacity(val);
                    const newMatrix = Array(100)
                      .fill(false)
                      .map((_, i) => i < val);
                    setLayoutMatrix(newMatrix);
                    setSelectedPresetId("custom");
                  }}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none text-foreground font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Créditos Necesarios
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={creditsCost}
                  onChange={(e) => setCreditsCost(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none text-foreground font-semibold"
                />
              </div>
            </div>

            {availabilityWarning && (
              <div className="p-3 bg-secondary/ border border-border/ text-secondary-foreground rounded-xl text-xs font-semibold animate-fade-in flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{availabilityWarning}</span>
              </div>
            )}

            {conflictWarning && (
              <div className="p-3 bg-destructive/ border border-destructive/ text-destructive rounded-xl text-xs font-semibold animate-fade-in flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{conflictWarning}</span>
              </div>
            )}

            {!editingClassId && (
              <div className="p-3.5 border border-border/60 bg-secondary/15 rounded-2xl space-y-2.5">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isRecurrent"
                    checked={isRecurrent}
                    onChange={(e) => setIsRecurrent(e.target.checked)}
                    className="rounded border-border bg-background focus:ring-primary text-primary h-4 w-4 cursor-pointer"
                  />
                  <label
                    htmlFor="isRecurrent"
                    className="text-xs font-bold text-foreground cursor-pointer select-none"
                  >
                    🔁 Programar como Clase Recurrente (semanal)
                  </label>
                </div>
                {isRecurrent && (
                  <div className="space-y-1 pl-6 animate-fade-in">
                    <label className="text-[11px] text-muted-foreground font-semibold">
                      Repetir semanalmente durante:
                    </label>
                    <div className="flex items-center gap-2">
                      <Select
                        value={recurrentWeeks.toString()}
                        onValueChange={(val) => setRecurrentWeeks(Number(val))}
                      >
                        <SelectTrigger className="flex h-8 w-28 rounded-lg border border-border bg-background px-2 text-xs text-foreground font-bold">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[2, 3, 4, 6, 8, 12].map((w) => (
                            <SelectItem key={w} value={w.toString()}>
                              {w} semanas
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <span className="text-[11px] text-muted-foreground">
                        Generará {recurrentWeeks} clases en total.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Sección: Rutina & Bloques de la Clase (Estilo WODify / SugarWOD) */}
            <div className="p-4 border border-border/80 bg-card rounded-2xl space-y-3.5 shadow-2xs">
              <div className="flex items-center justify-between border-b border-border/40 pb-2.5 flex-wrap gap-2">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-blue-500" />
                    <span>Rutina & Bloques de la Clase (Estilo WODify / SugarWOD)</span>
                  </h3>
                  <p className="text-[11px] text-muted-foreground leading-snug pt-0.5">
                    Divide la sesión en bloques lógicos (Calentamiento, Fuerza, WOD, Vuelta a la Calma).
                  </p>
                </div>
                <span className="text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">
                  {routineBlocks.length} {routineBlocks.length === 1 ? "bloque" : "bloques"}
                </span>
              </div>

              {/* Botones de Presets Rápidos */}
              <div className="space-y-1.5">
                <span className="text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Añadir Bloques Rápidos (Presets):
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => addRoutineBlockPreset("warmup")}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition"
                  >
                    + Calentamiento
                  </button>
                  <button
                    type="button"
                    onClick={() => addRoutineBlockPreset("strength")}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-xl bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 transition"
                  >
                    + Fuerza / Técnica
                  </button>
                  <button
                    type="button"
                    onClick={() => addRoutineBlockPreset("main")}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-xl bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 transition"
                  >
                    + WOD / Principal
                  </button>
                  <button
                    type="button"
                    onClick={() => addRoutineBlockPreset("cooldown")}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition"
                  >
                    + Vuelta a Calma
                  </button>
                  <button
                    type="button"
                    onClick={() => addRoutineBlockPreset("custom")}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-xl bg-secondary text-foreground border border-border/80 hover:bg-secondary/80 transition"
                  >
                    + Personalizado
                  </button>
                </div>
              </div>

              {/* Lista de Bloques Creados */}
              <div className="space-y-3 pt-1">
                {routineBlocks.map((block, idx) => {
                  const getBadgeColor = (type: ClassBlock["type"]) => {
                    switch (type) {
                      case "warmup":
                        return "bg-amber-500/10 text-amber-600 border-amber-500/30";
                      case "strength":
                        return "bg-blue-500/10 text-blue-600 border-blue-500/30";
                      case "main":
                        return "bg-rose-500/10 text-rose-600 border-rose-500/30";
                      case "cooldown":
                        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/30";
                      default:
                        return "bg-purple-500/10 text-purple-600 border-purple-500/30";
                    }
                  };

                  return (
                    <div
                      key={block.id}
                      className="p-3 bg-background border border-border/70 rounded-2xl space-y-2.5 shadow-2xs relative group"
                    >
                      {/* Header del Bloque: Categoría y Controles */}
                      <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold text-muted-foreground">
                            #{idx + 1}
                          </span>
                          <Select
                            value={block.type}
                            onValueChange={(val) =>
                              updateRoutineBlock(idx, "type", val as ClassBlock["type"])
                            }
                          >
                            <SelectTrigger
                              className={cn(
                                "h-7 text-[11px] font-bold rounded-lg px-2 border w-44",
                                getBadgeColor(block.type)
                              )}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              <SelectItem value="warmup">Calentamiento</SelectItem>
                              <SelectItem value="strength">Fuerza / Técnica</SelectItem>
                              <SelectItem value="main">WOD / Principal</SelectItem>
                              <SelectItem value="cooldown">Vuelta a Calma</SelectItem>
                              <SelectItem value="custom">Personalizado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Botones de Reordenar y Eliminar */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveRoutineBlock(idx, "up")}
                            className="h-6 w-6 rounded-md bg-secondary text-foreground text-xs font-bold disabled:opacity-30 hover:bg-secondary/80 flex items-center justify-center"
                            title="Mover arriba"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            disabled={idx === routineBlocks.length - 1}
                            onClick={() => moveRoutineBlock(idx, "down")}
                            className="h-6 w-6 rounded-md bg-secondary text-foreground text-xs font-bold disabled:opacity-30 hover:bg-secondary/80 flex items-center justify-center"
                            title="Mover abajo"
                          >
                            ▼
                          </button>
                          <button
                            type="button"
                            onClick={() => removeRoutineBlock(idx)}
                            className="h-6 w-6 rounded-md bg-destructive/10 text-destructive text-xs font-bold hover:bg-destructive/20 flex items-center justify-center ml-1"
                            title="Eliminar bloque"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      {/* Inputs: Título, Subtítulo y Time Cap */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-muted-foreground">
                            Título del Bloque
                          </label>
                          <Input
                            value={block.title}
                            onChange={(e) => updateRoutineBlock(idx, "title", e.target.value)}
                            placeholder="Ej: Calentamiento Articular"
                            className="h-8 text-xs rounded-xl bg-secondary/30 border-border/60"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-muted-foreground">
                            Subtítulo / Modalidad
                          </label>
                          <Input
                            value={block.subtitle || ""}
                            onChange={(e) => updateRoutineBlock(idx, "subtitle", e.target.value)}
                            placeholder="Ej: AMRAP 12 min"
                            className="h-8 text-xs rounded-xl bg-secondary/30 border-border/60"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-muted-foreground">
                            Time Cap (Tiempo)
                          </label>
                          <Input
                            value={block.timeCap || ""}
                            onChange={(e) => updateRoutineBlock(idx, "timeCap", e.target.value)}
                            placeholder="Ej: 12 min"
                            className="h-8 text-xs rounded-xl bg-secondary/30 border-border/60"
                          />
                        </div>
                      </div>

                      {/* Textarea: Descripción y Ejercicios */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-muted-foreground">
                          Ejercicios & Instrucciones Detalladas
                        </label>
                        <textarea
                          rows={3}
                          value={block.description}
                          onChange={(e) => updateRoutineBlock(idx, "description", e.target.value)}
                          placeholder="Ej: 3 Rondas de:\n- 10 Air Squats\n- 15 Push-ups"
                          className="w-full rounded-xl bg-secondary/30 border border-border/60 p-2.5 text-xs text-foreground font-medium focus-visible:outline-none custom-scrollbar"
                        />
                      </div>
                    </div>
                  );
                })}

                {routineBlocks.length === 0 && (
                  <p className="text-xs text-muted-foreground italic text-center py-6 border border-dashed border-border/60 rounded-2xl bg-secondary/10">
                    No has añadido bloques a esta clase todavía. Usa los botones de arriba para estructurar la rutina.
                  </p>
                )}
              </div>
            </div>

            <DialogFooter className="pt-3 gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl text-xs font-bold"
                onClick={() => setShowAddForm(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="rounded-xl text-xs font-bold bg-primary text-primary-foreground"
              >
                {editingClassId ? "Guardar Cambios" : "Programar Clase"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>

      {/* Main content grid based on viewMode */}
      {viewMode === "list" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full items-stretch">
          {/* Card 1: Schedule (Hoy) */}
          <div className="group rounded-3xl border border-border bg-card p-5 space-y-4 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg shadow-xs h-full flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border/40">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                  Clases Programadas (Hoy)
                </span>
                <span className="text-[10px] text-muted-foreground/70 font-semibold uppercase tracking-wider">
                  {classesForToday.length} clases
                </span>
              </div>
              <div className="space-y-3">
                {classesForToday.map((c) => {
                  const instructorName =
                    staffList.find((s) => s.id === c.staffId)?.name || "Sin asignar";
                  const salaName = salasList.find((s) => s.id === c.salaId)?.name || "Sin sala";
                  return (
                    <div
                      key={c.id}
                      onClick={() => {
                        setSelectedClass(c.id);
                      }}
                      className={`p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between ${
                        c.status === "cancelada"
                          ? "border-destructive/30 bg-destructive/5 opacity-60 cursor-pointer"
                          : activeBlackout
                            ? "border-border opacity-50 cursor-not-allowed bg-secondary/10"
                            : selectedClass === c.id
                              ? "border-primary bg-primary/5 cursor-pointer shadow-xs"
                              : "border-border/60 hover:border-border hover:bg-secondary/30 cursor-pointer"
                      }`}
                    >
                      <div>
                        <h4
                          className={`font-bold text-sm ${c.status === "cancelada" ? "text-destructive dark:text-destructive line-through" : ""}`}
                        >
                          {c.name}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground flex-wrap">
                          <span>{instructorName}</span>
                          <span>·</span>
                          <span>{c.time} hs</span>
                          <span>·</span>
                          <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded-lg text-[10px] font-bold">
                            <DoorOpen className="h-3 w-3 shrink-0" />
                            {salaName}
                          </span>
                        </div>
                      </div>
                      {c.status === "cancelada" ? (
                        <span className="text-[9px] bg-destructive/10 text-destructive px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                          Cancelada
                        </span>
                      ) : activeBlackout ? (
                        <span className="text-[9px] bg-destructive/10 text-destructive px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                          Suspendida
                        </span>
                      ) : (
                        <span className="text-xs font-semibold bg-secondary px-2.5 py-1 rounded-full text-foreground">
                          {c.booked} / {c.capacity} cupos
                        </span>
                      )}
                    </div>
                  );
                })}
                {classesForToday.length === 0 && (
                  <p className="text-xs text-muted-foreground italic py-8 text-center">
                    No hay clases programadas para el día de hoy.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Card 2: Resumen de Salas y Disponibilidad */}
          <div className="group rounded-3xl border border-border bg-card p-5 space-y-4 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg shadow-xs h-full flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border/40">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                  Estado de Salas y Espacios
                </span>
                <span className="text-[10px] text-muted-foreground/70 font-semibold uppercase tracking-wider">
                  {salasList.length} espacios activos
                </span>
              </div>
              <div className="space-y-3">
                {salasList.map((sala) => {
                  const currentClassInSala = classesForToday.find((c) => c.salaId === sala.id);
                  return (
                    <div
                      key={sala.id}
                      className="p-3.5 rounded-2xl border border-border/40 bg-secondary/20 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-foreground block">{sala.name}</span>
                        <span className="text-[10px] text-muted-foreground font-semibold">
                          Capacidad máxima: {sala.capacity || 20} personas
                        </span>
                      </div>
                      {currentClassInSala ? (
                        <span className="text-[10px] font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full border border-primary/20">
                          {currentClassInSala.name} ({currentClassInSala.time} hs)
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-muted-foreground bg-background px-2.5 py-1 rounded-full border border-border/40">
                          Disponible
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-1 items-start">
          {/* Left 3 columns: Weekly Calendar Grid */}
          <div className="col-span-1 space-y-4">
            {/* Weekly Calendar Grid Container */}
            <div className="rounded-3xl border border-border bg-card p-6 space-y-6 overflow-x-auto pb-4 transition-all duration-300 hover:border-foreground/30 hover:shadow-lg shadow-xs">
              <div className="min-w-[680px] space-y-6">
                {/* Grid Header (Days of the week) */}
                <div className="grid grid-cols-8 gap-3 text-center select-none font-bold text-xs text-muted-foreground border-b border-border/40 pb-3">
                  <div /> {/* Hour labels column spacer */}
                  <div>LUN</div>
                  <div>MAR</div>
                  <div>MIÉ</div>
                  <div>JUE</div>
                  <div>VIE</div>
                  <div>SÁB</div>
                  <div>DOM</div>
                </div>

                {/* Weekly Calendar Grid Rows */}
                <div className="space-y-3">
                  {(() => {
                    const hoursList = Array.from(
                      new Set(
                        classesList
                          .filter((c) => {
                            const matchesBranch =
                              selectedBranchId === "all" ||
                              (selectedBranchId === "matriz"
                                ? !c.branchId
                                : c.branchId === selectedBranchId);
                            const matchesWeek = (c.weekOffset || 0) === currentWeekOffset;
                            return matchesBranch && matchesWeek;
                          })
                          .map((c) => c.time.split("-")[0].trim()),
                      ),
                    ).sort();
                    return hoursList.map((hour) => (
                      <div key={hour} className="grid grid-cols-8 gap-3 items-center">
                        {/* Hour Label */}
                        <div className="text-right text-xs font-bold text-muted-foreground pr-1">
                          {hour}
                        </div>

                        {/* Day Cells */}
                        {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
                          const classesInSlot = filteredClasses.filter((c) => {
                            const startHour = c.time.split("-")[0].trim();
                            return c.day === dayIndex && startHour === hour;
                          });

                          if (classesInSlot.length === 0) {
                            return (
                              <div
                                key={`empty-${hour}-${dayIndex}`}
                                className="border border-dashed border-border/60 rounded-xl h-[72px] bg-transparent"
                              />
                            );
                          }

                          const c = classesInSlot[0];
                          const coach = staffList.find((s) => s.id === c.staffId);
                          const instructorName = coach
                            ? `${coach.name.split(" ")[0][0]}. ${coach.name.split(" ")[1] || ""}`
                            : "Sin asignar";
                          const isFull = c.booked >= c.capacity;
                          const isSelected = selectedClass === c.id;

                          return (
                            <div
                              key={`class-${c.id}-${hour}-${dayIndex}`}
                              onClick={() => {
                                setSelectedClass(c.id);
                              }}
                              className={`border rounded-xl p-2.5 h-[72px] flex flex-col justify-between text-left cursor-pointer transition-all ${
                                c.status === "cancelada"
                                  ? "bg-destructive/ border-destructive/ text-destructive/80 dark:bg-destructive/ dark:border-destructive/ opacity-60"
                                  : isFull
                                    ? "bg-destructive border-destructive text-destructive dark:bg-destructive/ dark:border-destructive/ dark:text-destructive"
                                    : "bg-card border-border text-foreground hover:border-muted-foreground/30 hover:bg-secondary/10"
                              } ${
                                isSelected
                                  ? "ring-2 ring-primary ring-offset-2 ring-offset-card"
                                  : ""
                              }`}
                            >
                              <div className="min-w-0">
                                <h4
                                  className={`font-bold text-[11px] truncate leading-tight ${c.status === "cancelada" ? "text-destructive dark:text-destructive line-through" : "text-foreground"}`}
                                >
                                  {c.status === "cancelada" && "❌ "}
                                  {c.name}
                                </h4>
                                <p className="text-[9.5px] text-muted-foreground truncate mt-0.5">
                                  {instructorName}
                                </p>
                              </div>
                              <span className="text-[10px] text-muted-foreground font-semibold">
                                {c.status === "cancelada"
                                  ? "Cancelada"
                                  : `${c.booked}/${c.capacity}`}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {renderClassDetailSidebar()}
    </Fragment>
  );
}

// Subcomponent: Config Tab
interface ConfigTabProps {
  selectedBranchId: string;
  staffList: {
    id: string;
    name: string;
    specialty: string;
    certifications: string[];
    photo: string;
    certificationImages?: string[];
    role?: string;
    branchId?: string;
    linkingCode: string | null;
    status: "pending" | "linked";
    availability?: { day: string; intervals: { from: string; to: string }[] }[];
  }[];
  setStaffList: React.Dispatch<
    React.SetStateAction<
      {
        id: string;
        name: string;
        specialty: string;
        certifications: string[];
        photo: string;
        certificationImages?: string[];
        role?: string;
        branchId?: string;
        linkingCode: string | null;
        status: "pending" | "linked";
        availability?: { day: string; intervals: { from: string; to: string }[] }[];
      }[]
    >
  >;
  amenities: { id: string; name: string; category: string; checked: boolean }[];
  setAmenities: React.Dispatch<
    React.SetStateAction<{ id: string; name: string; category: string; checked: boolean }[]>
  >;
  requirements: { id: string; name: string; category: string; checked: boolean }[];
  setRequirements: React.Dispatch<
    React.SetStateAction<{ id: string; name: string; category: string; checked: boolean }[]>
  >;
  equipment: {
    id: string;
    name: string;
    category: string;
    checked: boolean;
    photo?: string;
    trackingType?: string;
    maintenanceRule?: string;
    status?: string;
    stats?: string;
  }[];
  setEquipment: React.Dispatch<
    React.SetStateAction<
      {
        id: string;
        name: string;
        category: string;
        checked: boolean;
        photo?: string;
        trackingType?: string;
        maintenanceRule?: string;
        status?: string;
        stats?: string;
      }[]
    >
  >;
  gymPhotos: string[];
  setGymPhotos: React.Dispatch<React.SetStateAction<string[]>>;
  weeklyHours: { day: string; intervals: { from: string; to: string }[] }[];
  setWeeklyHours: React.Dispatch<
    React.SetStateAction<{ day: string; intervals: { from: string; to: string }[] }[]>
  >;
  cancellationPolicyHours: number;
  setCancellationPolicyHours: (v: number) => void;
  branchesList: {
    id: string;
    name: string;
    address: string;
    manager?: string;
    lat?: number;
    lng?: number;
    creditCostMultiplier?: number;
  }[];
  setBranchesList: React.Dispatch<
    React.SetStateAction<
      {
        id: string;
        name: string;
        address: string;
        manager?: string;
        lat?: number;
        lng?: number;
        creditCostMultiplier?: number;
      }[]
    >
  >;
  blackoutDays: { id: string; date: string; reason: string }[];
  setBlackoutDays: React.Dispatch<
    React.SetStateAction<{ id: string; date: string; reason: string }[]>
  >;
  penaltySettings: { enabled: boolean; type: string; maxAbsences: number };
  setPenaltySettings: React.Dispatch<
    React.SetStateAction<{ enabled: boolean; type: string; maxAbsences: number }>
  >;
  salasList: {
    id: string;
    name: string;
    capacity?: number;
    branchId: string;
    description?: string;
  }[];
  setSalasList: React.Dispatch<
    React.SetStateAction<
      { id: string; name: string; capacity?: number; branchId: string; description?: string }[]
    >
  >;
  protocols: { id: string; title: string; role: string; time: string; items: string[] }[];
  setProtocols: React.Dispatch<
    React.SetStateAction<
      { id: string; title: string; role: string; time: string; items: string[] }[]
    >
  >;
  checklistLogs: {
    id: string;
    date: string;
    time: string;
    protocolTitle: string;
    staffName: string;
    role: string;
    itemsCount: number;
  }[];
  setChecklistLogs: React.Dispatch<
    React.SetStateAction<
      {
        id: string;
        date: string;
        time: string;
        protocolTitle: string;
        staffName: string;
        role: string;
        itemsCount: number;
      }[]
    >
  >;
}



function ConfigTab({
  selectedBranchId,
  staffList,
  setStaffList,
  amenities,
  setAmenities,
  requirements,
  setRequirements,
  equipment,
  setEquipment,
  gymPhotos,
  setGymPhotos,
  weeklyHours,
  setWeeklyHours,
  cancellationPolicyHours,
  setCancellationPolicyHours,
  branchesList,
  setBranchesList,
  blackoutDays,
  setBlackoutDays,
  penaltySettings,
  setPenaltySettings,
  salasList,
  setSalasList,
  protocols,
  setProtocols,
  checklistLogs,
  setChecklistLogs,
}: ConfigTabProps) {
  const [subTab, setSubTab] = useState("basico");

  // Drag to scroll for nav
  const navScrollRef = useRef<HTMLDivElement>(null);
  const [isNavDragging, setIsNavDragging] = useState(false);
  const [navStartX, setNavStartX] = useState(0);
  const [navScrollLeft, setNavScrollLeft] = useState(0);

  const handleNavMouseDown = (e: React.MouseEvent) => {
    if (!navScrollRef.current) return;
    setIsNavDragging(true);
    setNavStartX(e.pageX - navScrollRef.current.offsetLeft);
    setNavScrollLeft(navScrollRef.current.scrollLeft);
  };
  const handleNavMouseLeave = () => setIsNavDragging(false);
  const handleNavMouseUp = () => setIsNavDragging(false);
  const handleNavMouseMove = (e: React.MouseEvent) => {
    if (!isNavDragging || !navScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - navScrollRef.current.offsetLeft;
    const walk = (x - navStartX) * 2;
    navScrollRef.current.scrollLeft = navScrollLeft - walk;
  };

  // Modal open states for create forms (Ponytail UX: List-first, action-on-demand)
  const [isCreateStaffOpen, setIsCreateStaffOpen] = useState(false);
  const [isCreateSedeOpen, setIsCreateSedeOpen] = useState(false);
  const [isCreateSalaOpen, setIsCreateSalaOpen] = useState(false);
  const [isCreateCierreOpen, setIsCreateCierreOpen] = useState(false);
  const [isCreateEquipmentOpen, setIsCreateEquipmentOpen] = useState(false);
  const [newEquipName, setNewEquipName] = useState("");
  const [newEquipCategory, setNewEquipCategory] = useState("Musculación & Peso Libre");
  const [newEquipPhoto, setNewEquipPhoto] = useState("");
  const [editingEquipPhoto, setEditingEquipPhoto] = useState<{
    id: string;
    name: string;
    photo: string;
  } | null>(null);
  const [equipViewMode, setEquipViewMode] = useState<"catalog" | "maintenance">("catalog");

  // Protocol Form States
  const [isCreateProtocolOpen, setIsCreateProtocolOpen] = useState(false);
  const [newProtocolTitle, setNewProtocolTitle] = useState("");
  const [newProtocolRole, setNewProtocolRole] = useState("receptionist");
  const [newProtocolTime, setNewProtocolTime] = useState("Mañana");
  const [newProtocolItemsText, setNewProtocolItemsText] = useState("");
  const [editingProtocol, setEditingProtocol] = useState<any | null>(null);
  const [protocolViewMode, setProtocolViewMode] = useState<"list" | "logs">("list");
  const [logFilterRole, setLogFilterRole] = useState("all");
  const [logFilterStaff, setLogFilterStaff] = useState("all");
  const [logFilterDate, setLogFilterDate] = useState("");

  const uniqueStaffNames = useMemo(() => {
    return Array.from(new Set(checklistLogs.map((log) => log.staffName)));
  }, [checklistLogs]);

  const filteredLogs = useMemo(() => {
    return checklistLogs.filter((log) => {
      const matchRole = logFilterRole === "all" || log.role === logFilterRole;
      const matchStaff = logFilterStaff === "all" || log.staffName === logFilterStaff;
      const matchDate = !logFilterDate || log.date === logFilterDate;
      return matchRole && matchStaff && matchDate;
    });
  }, [checklistLogs, logFilterRole, logFilterStaff, logFilterDate]);

  // Local states
  const [newSalaName, setNewSalaName] = useState("");
  const [newSalaCapacity, setNewSalaCapacity] = useState("");
  const [newSalaDescription, setNewSalaDescription] = useState("");

  const [activeCertificationsViewer, setActiveCertificationsViewer] = useState<string[] | null>(
    null,
  );
  const [staffName, setStaffName] = useState("");
  const [staffSpecialty, setStaffSpecialty] = useState("");
  const [staffSpecialties, setStaffSpecialties] = useState<string[]>([]);
  const [staffCerts, setStaffCerts] = useState("");
  const [staffAvatarUrl, setStaffAvatarUrl] = useState<string | null>(null);
  const [staffDiplomas, setStaffDiplomas] = useState<string[]>([]);
  const [newStaffRole, setNewStaffRole] = useState("coach");
  const [newStaffBranchId, setNewStaffBranchId] = useState("matriz");
  const [staffBaseSalary, setStaffBaseSalary] = useState("60000");
  const [staffPayPerClass, setStaffPayPerClass] = useState("5000");
  const [staffPayPerStudent, setStaffPayPerStudent] = useState("300");

  // Staff Edit & Delete States
  const [editingStaff, setEditingStaff] = useState<any | null>(null);
  const [editStaffName, setEditStaffName] = useState("");
  const [editStaffSpecialty, setEditStaffSpecialty] = useState("");
  const [editStaffSpecialties, setEditStaffSpecialties] = useState<string[]>([]);
  const [editStaffCerts, setEditStaffCerts] = useState("");
  const [editStaffRole, setEditStaffRole] = useState("coach");
  const [editStaffBranchId, setEditStaffBranchId] = useState("matriz");
  const [editStaffAvatarUrl, setEditStaffAvatarUrl] = useState<string | null>(null);
  const [editStaffDiplomas, setEditStaffDiplomas] = useState<string[]>([]);
  const [editStaffBaseSalary, setEditStaffBaseSalary] = useState("60000");
  const [editStaffPayPerClass, setEditStaffPayPerClass] = useState("5000");
  const [editStaffPayPerStudent, setEditStaffPayPerStudent] = useState("300");

  // Universal Delete Confirmation & Edit States (Sedes, Salas, Cierres, Staff)
  const [deletingItem, setDeletingItem] = useState<{
    type: "staff" | "sede" | "sala" | "cierre";
    id: string;
    name: string;
  } | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [editingSede, setEditingSede] = useState<any | null>(null);
  const [editingSala, setEditingSala] = useState<any | null>(null);
  const [editingCierre, setEditingCierre] = useState<any | null>(null);
  const [instagram, setInstagram] = useState("kraft.strength");
  const [tiktok, setTiktok] = useState("kraft.strength");
  const [whatsapp, setWhatsapp] = useState("5491132421241");
  const [newBranchName, setNewBranchName] = useState("");
  const [newBranchAddress, setNewBranchAddress] = useState("");
  const [newBranchManager, setNewBranchManager] = useState("");
  const [newBranchLat, setNewBranchLat] = useState("");
  const [newBranchLng, setNewBranchLng] = useState("");
  const [newBranchMultiplier, setNewBranchMultiplier] = useState("1.0");

  const [newBlackoutDate, setNewBlackoutDate] = useState("");
  const [newBlackoutReason, setNewBlackoutReason] = useState("");

  const WEEKDAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  const [newStaffAvails, setNewStaffAvails] = useState<
    { day: string; intervals: { from: string; to: string }[] }[]
  >(WEEKDAYS.map((day) => ({ day, intervals: [] })));
  const [editStaffAvails, setEditStaffAvails] = useState<
    { day: string; intervals: { from: string; to: string }[] }[]
  >(WEEKDAYS.map((day) => ({ day, intervals: [] })));

  // Refs
  const gymFileRef = useRef<HTMLInputElement>(null);
  const coachAvatarRef = useRef<HTMLInputElement>(null);
  const coachCertsRef = useRef<HTMLInputElement>(null);
  const editCoachAvatarRef = useRef<HTMLInputElement>(null);
  const editCoachCertsRef = useRef<HTMLInputElement>(null);

  // Gym Photos
  const handleGymPhotosUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    const objectUrls = filesArray.map((file) => URL.createObjectURL(file));
    setGymPhotos((prev) => [...prev, ...objectUrls]);
  };

  const handleRemoveGymPhoto = (index: number) => {
    setGymPhotos((prev) => prev.filter((_, idx) => idx !== index));
  };

  // 7-Day Split Hours Handlers
  const handleAddHourInterval = (dayIndex: number) => {
    setWeeklyHours((prev) => {
      const copy = [...prev];
      copy[dayIndex] = {
        ...copy[dayIndex],
        intervals: [...copy[dayIndex].intervals, { from: "09:00", to: "13:00" }],
      };
      return copy;
    });
  };

  const handleRemoveHourInterval = (dayIndex: number, intervalIndex: number) => {
    setWeeklyHours((prev) => {
      const copy = [...prev];
      copy[dayIndex] = {
        ...copy[dayIndex],
        intervals: copy[dayIndex].intervals.filter((_, idx) => idx !== intervalIndex),
      };
      return copy;
    });
  };

  const handleUpdateHourInterval = (
    dayIndex: number,
    intervalIndex: number,
    field: "from" | "to",
    value: string,
  ) => {
    setWeeklyHours((prev) => {
      const copy = [...prev];
      const intervals = [...copy[dayIndex].intervals];
      intervals[intervalIndex] = {
        ...intervals[intervalIndex],
        [field]: value,
      };
      copy[dayIndex] = {
        ...copy[dayIndex],
        intervals,
      };
      return copy;
    });
  };

  const handleAddStaffAvailInterval = (isEdit: boolean, dayIndex: number) => {
    const setter = isEdit ? setEditStaffAvails : setNewStaffAvails;
    setter((prev) => {
      const copy = [...prev];
      copy[dayIndex] = {
        ...copy[dayIndex],
        intervals: [...copy[dayIndex].intervals, { from: "09:00", to: "13:00" }],
      };
      return copy;
    });
  };

  const handleUpdateStaffAvailInterval = (
    isEdit: boolean,
    dayIndex: number,
    intervalIndex: number,
    field: "from" | "to",
    value: string,
  ) => {
    const setter = isEdit ? setEditStaffAvails : setNewStaffAvails;
    setter((prev) => {
      const copy = [...prev];
      const updatedIntervals = [...copy[dayIndex].intervals];
      updatedIntervals[intervalIndex] = {
        ...updatedIntervals[intervalIndex],
        [field]: value,
      };
      copy[dayIndex] = {
        ...copy[dayIndex],
        intervals: updatedIntervals,
      };
      return copy;
    });
  };

  const handleRemoveStaffAvailInterval = (
    isEdit: boolean,
    dayIndex: number,
    intervalIndex: number,
  ) => {
    const setter = isEdit ? setEditStaffAvails : setNewStaffAvails;
    setter((prev) => {
      const copy = [...prev];
      copy[dayIndex] = {
        ...copy[dayIndex],
        intervals: copy[dayIndex].intervals.filter((_, idx) => idx !== intervalIndex),
      };
      return copy;
    });
  };

  // Staff Avatar
  const handleCoachAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setStaffAvatarUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Staff Diplomas
  const handleCoachDiplomasUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const objectUrls = filesArray.map((file) => URL.createObjectURL(file));
      setStaffDiplomas((prev) => [...prev, ...objectUrls]);
    }
  };

  const handleRemoveDiplomaPreview = (index: number) => {
    setStaffDiplomas((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleEditCoachAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEditStaffAvatarUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleEditCoachDiplomasUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const objectUrls = filesArray.map((file) => URL.createObjectURL(file));
      setEditStaffDiplomas((prev) => [...prev, ...objectUrls]);
    }
  };

  const handleRemoveEditDiploma = (index: number) => {
    setEditStaffDiplomas((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName) return;

    const finalSpecialties = staffSpecialties.length > 0 ? staffSpecialties : [staffSpecialty || "General"];
    const finalSpecialtyStr = staffSpecialty || finalSpecialties.join(", ");
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

    const newStaff = {
      id: Math.random().toString(),
      name: staffName,
      specialty: finalSpecialtyStr,
      specialties: finalSpecialties,
      certifications: staffCerts
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c),
      photo:
        staffAvatarUrl ||
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=150&q=80",
      certificationImages: staffDiplomas,
      role: newStaffRole,
      branchId: newStaffBranchId === "matriz" ? undefined : newStaffBranchId,
      linkingCode: generatedOtp,
      status: "pending" as const,
      availability: newStaffAvails,
      baseSalary: parseFloat(staffBaseSalary) || 60000,
      payPerClass: parseFloat(staffPayPerClass) || 5000,
      payPerStudent: parseFloat(staffPayPerStudent) || 300,
    };

    setStaffList((prev) => [...prev, newStaff]);
    setStaffName("");
    setStaffSpecialty("");
    setStaffSpecialties([]);
    setStaffCerts("");
    setStaffAvatarUrl(null);
    setStaffDiplomas([]);
    setNewStaffRole("coach");
    setNewStaffBranchId("matriz");
    setStaffBaseSalary("60000");
    setStaffPayPerClass("5000");
    setStaffPayPerStudent("300");
    setNewStaffAvails(WEEKDAYS.map((day) => ({ day, intervals: [] })));
    setIsCreateStaffOpen(false);
  };

  const handleStartEditStaff = (staff: any) => {
    setEditingStaff(staff);
    setEditStaffName(staff.name);
    setEditStaffSpecialty(staff.specialty);
    const existingSpecs =
      staff.specialties && staff.specialties.length > 0
        ? staff.specialties
        : staff.specialty
          ? staff.specialty.split(",").map((s: string) => s.trim())
          : [];
    setEditStaffSpecialties(existingSpecs);
    setEditStaffCerts(staff.certifications.join(", "));
    setEditStaffRole(staff.role || "coach");
    setEditStaffBranchId(staff.branchId || "matriz");
    setEditStaffAvatarUrl(staff.photo);
    setEditStaffDiplomas(staff.certificationImages || []);
    setEditStaffBaseSalary((staff.baseSalary ?? 60000).toString());
    setEditStaffPayPerClass((staff.payPerClass ?? 5000).toString());
    setEditStaffPayPerStudent((staff.payPerStudent ?? 300).toString());

    if (staff.availability && staff.availability.length > 0) {
      const loaded = WEEKDAYS.map((day) => {
        const found = staff.availability.find((a: any) => a.day === day);
        return found ? { day, intervals: found.intervals || [] } : { day, intervals: [] };
      });
      setEditStaffAvails(loaded);
    } else {
      setEditStaffAvails(WEEKDAYS.map((day) => ({ day, intervals: [] })));
    }
  };

  const handleSaveEditStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStaffName || !editingStaff) return;

    const finalSpecialties =
      editStaffSpecialties.length > 0
        ? editStaffSpecialties
        : [editStaffSpecialty || "General"];
    const finalSpecialtyStr = editStaffSpecialty || finalSpecialties.join(", ");

    setStaffList((prev) =>
      prev.map((s) =>
        s.id === editingStaff.id
          ? {
              ...s,
              name: editStaffName,
              specialty: finalSpecialtyStr,
              specialties: finalSpecialties,
              certifications: editStaffCerts
                .split(",")
                .map((c) => c.trim())
                .filter((c) => c),
              photo:
                editStaffAvatarUrl ||
                "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=150&q=80",
              certificationImages: editStaffDiplomas,
              role: editStaffRole,
              branchId: editStaffBranchId === "matriz" ? undefined : editStaffBranchId,
              availability: editStaffAvails,
              baseSalary: parseFloat(editStaffBaseSalary) || 60000,
              payPerClass: parseFloat(editStaffPayPerClass) || 5000,
              payPerStudent: parseFloat(editStaffPayPerStudent) || 300,
            }
          : s,
      ),
    );

    setEditingStaff(null);
  };

  const handleConfirmRemoveItem = () => {
    if (!deletingItem) return;
    if (deletingItem.type === "staff")
      setStaffList((prev) => prev.filter((s) => s.id !== deletingItem.id));
    if (deletingItem.type === "sede")
      setBranchesList((prev) => prev.filter((b) => b.id !== deletingItem.id));
    if (deletingItem.type === "sala")
      setSalasList((prev) => prev.filter((s) => s.id !== deletingItem.id));
    if (deletingItem.type === "cierre")
      setBlackoutDays((prev) => prev.filter((c) => c.id !== deletingItem.id));
    setDeletingItem(null);
    setDeleteConfirmText("");
  };

  const handleToggleAmenity = (id: string) => {
    setAmenities((prev) => prev.map((a) => (a.id === id ? { ...a, checked: !a.checked } : a)));
  };

  const handleToggleRequirement = (id: string) => {
    setRequirements((prev) => prev.map((r) => (r.id === id ? { ...r, checked: !r.checked } : r)));
  };

  const handleToggleEquipment = (id: string) => {
    setEquipment((prev) => prev.map((e) => (e.id === id ? { ...e, checked: !e.checked } : e)));
  };

  const amenityCategories = Array.from(new Set(amenities.map((a) => a.category)));
  const requirementCategories = Array.from(new Set(requirements.map((r) => r.category)));
  const equipmentCategories = Array.from(new Set(equipment.map((e) => e.category)));

  return (
    <div className="space-y-6">
      {/* Sub tabs navigation */}
      <div
        ref={navScrollRef}
        onMouseDown={handleNavMouseDown}
        onMouseLeave={handleNavMouseLeave}
        onMouseUp={handleNavMouseUp}
        onMouseMove={handleNavMouseMove}
        className="border-b border-border flex gap-4 pb-0 overflow-x-auto [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing select-none"
      >
        {[
          { id: "basico", label: "Ficha Básica" },
          { id: "politicas", label: "Políticas" },
          { id: "amenities", label: "Amenities & Servicios" },
          { id: "equipamiento", label: "Equipamiento" },
          { id: "requisitos", label: "Normas de Ingreso" },
          { id: "staff", label: "Equipo (Staff)" },
          { id: "salas", label: "Salas / Salones" },
          { id: "cierres", label: "Días de Cierre" },
        ].map((sub) => (
          <button
            key={sub.id}
            onClick={() => setSubTab(sub.id)}
            className={`pb-3 text-sm font-semibold border-b-2 transition whitespace-nowrap ${
              subTab === sub.id
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {sub.label}
          </button>
        ))}
      </div>

      <>
          {/* Subtab 1: Basic Config & 7-Day Scheduler */}
          {subTab === "basico" && (
            <div className="space-y-6 max-w-3xl">
              {/* Tema & Apariencia Visual (Rimu Style Dark Mode & System Auto-detect) */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                      Apariencia Visual y Modo Oscuro
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
                      Personaliza tu experiencia. Elige el <strong>Modo Oscuro</strong> (estética minimalista azabache basada en <em>Rimu App</em> <code className="text-[10px] bg-secondary px-1.5 py-0.5 rounded font-mono">#0a0a0a</code>), el <strong>Modo Claro</strong> actual, o activa la <strong>adaptación automática</strong> según el tema del sistema operativo.
                    </p>
                  </div>
                  <ThemeToggle variant="outline" size="default" showLabel />
                </div>
              </div>
              {/* Photos */}
              <div className="rounded-3xl border border-border bg-card p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-bold text-sm">Galería de Fotos</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Sube imágenes de tu centro.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-xl gap-1.5"
                    onClick={() => gymFileRef.current?.click()}
                  >
                    <Plus className="h-4 w-4" /> Subir Fotos
                  </Button>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    ref={gymFileRef}
                    onChange={handleGymPhotosUpload}
                    className="hidden"
                  />
                </div>

                <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
                  {gymPhotos.map((photo, index) => (
                    <div
                      key={index}
                      className="relative aspect-video rounded-xl overflow-hidden border border-border group"
                    >
                      <img
                        src={photo}
                        alt={`Gym ${index}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveGymPhoto(index)}
                        className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-black text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 7-Day Daily Hours Scheduler */}
              <div className="rounded-3xl border border-border bg-card p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-sm">Horarios Semanales (7 Días)</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Configura individualmente cada día, soportando horarios cortados/partidos.
                  </p>
                </div>

                <div className="space-y-4 divide-y divide-border/60">
                  {weeklyHours.map((dayHour, dayIdx) => (
                    <div
                      key={dayHour.day}
                      className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-3 first:pt-0"
                    >
                      <div className="w-24 text-sm font-bold text-foreground">{dayHour.day}</div>

                      <div className="flex-1 space-y-2">
                        {dayHour.intervals.map((interval, intervalIdx) => (
                          <div key={intervalIdx} className="flex items-center gap-2">
                            <input
                              type="time"
                              value={interval.from}
                              onChange={(e) =>
                                handleUpdateHourInterval(
                                  dayIdx,
                                  intervalIdx,
                                  "from",
                                  e.target.value,
                                )
                              }
                              className="px-2 py-1 rounded-lg border border-border bg-background text-xs focus-visible:outline-none"
                            />
                            <span className="text-xs text-muted-foreground">a</span>
                            <input
                              type="time"
                              value={interval.to}
                              onChange={(e) =>
                                handleUpdateHourInterval(dayIdx, intervalIdx, "to", e.target.value)
                              }
                              className="px-2 py-1 rounded-lg border border-border bg-background text-xs focus-visible:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveHourInterval(dayIdx, intervalIdx)}
                              className="p-1.5 text-destructive hover:bg-destructive/ rounded-lg transition"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                        {dayHour.intervals.length === 0 && (
                          <span className="text-xs text-muted-foreground italic bg-secondary/40 px-2.5 py-1 rounded-md inline-block">
                            Cerrado
                          </span>
                        )}
                      </div>

                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="self-start sm:self-center text-xs gap-1 py-1 h-8 rounded-lg"
                        onClick={() => handleAddHourInterval(dayIdx)}
                      >
                        <Plus className="h-3.5 w-3.5" /> Turno
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6 max-w-2xl bg-card border border-border p-6 rounded-3xl">
                <h3 className="font-bold text-sm">Ficha Básica</h3>
                <form className="space-y-4 text-sm" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">
                        Nombre Comercial
                      </label>
                      <input
                        type="text"
                        className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                        defaultValue="Kraft Strength Club"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">
                        Dirección Física
                      </label>
                      <input
                        type="text"
                        className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                        defaultValue="Av. Santa Fe 3421, Palermo, CABA"
                      />
                    </div>
                  </div>

                  {/* Social Media Inputs */}
                  <div className="grid gap-4 sm:grid-cols-3 border-t border-border/60 pt-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">
                        Instagram (Usuario)
                      </label>
                      <input
                        type="text"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
                        placeholder="kraft.strength"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">
                        TikTok (Usuario)
                      </label>
                      <input
                        type="text"
                        value={tiktok}
                        onChange={(e) => setTiktok(e.target.value)}
                        className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
                        placeholder="kraft.strength"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">
                        WhatsApp (Número)
                      </label>
                      <input
                        type="text"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
                        placeholder="5491132421241"
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    className="rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/95"
                    onClick={() => {
                      const saveBtn = document.getElementById("profile-save-badge");
                      if (saveBtn) {
                        saveBtn.classList.remove("hidden");
                        setTimeout(() => saveBtn.classList.add("hidden"), 3000);
                      }
                    }}
                  >
                    Guardar Cambios
                  </Button>
                  <span
                    id="profile-save-badge"
                    className="hidden text-xs font-bold text-primary animate-fade-in"
                  >
                    ✅ Datos del gimnasio y redes sociales actualizados correctamente.
                  </span>
                </form>
              </div>
            </div>
          )}

          {/* Subtab 2: Reservation & Cancellation Policies */}
          {subTab === "politicas" && (
            <div className="space-y-6 max-w-2xl bg-card border border-border p-6 rounded-3xl text-foreground">
              <div>
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-primary" /> Políticas de Reservas e
                  Inasistencias
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Define los límites y restricciones para cancelaciones y penalizaciones por faltas.
                </p>
              </div>

              <div className="space-y-6 text-sm">
                {/* Cancellation hours input */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground block">
                    Tiempo límite de cancelación anticipada (Horas)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="0"
                      max="48"
                      value={cancellationPolicyHours}
                      onChange={(e) => setCancellationPolicyHours(parseInt(e.target.value) || 0)}
                      className="flex h-10 w-24 rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
                    />
                    <span className="text-xs text-muted-foreground">
                      Los alumnos sólo podrán cancelar la clase hasta {cancellationPolicyHours}{" "}
                      horas antes del inicio sin penalización.
                    </span>
                  </div>
                </div>

                {/* No-show Penalties configuration */}
                <div className="border-t border-border/40 pt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs">
                        Penalización por Inasistencias (No-Shows)
                      </h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Sanciona automáticamente a alumnos que no asistan o cancelen fuera de
                        término.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={penaltySettings.enabled}
                      onChange={(e) =>
                        setPenaltySettings((prev) => ({ ...prev, enabled: e.target.checked }))
                      }
                      className="h-5 w-10 accent-primary rounded-full cursor-pointer shrink-0"
                    />
                  </div>

                  {penaltySettings.enabled && (
                    <div className="grid gap-4 sm:grid-cols-2 bg-secondary/10 p-4 rounded-2xl animate-fade-in space-y-2 sm:space-y-0">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground block">
                          Tipo de Castigo / Penalidad
                        </label>
                        <select
                          value={penaltySettings.type}
                          onChange={(e) =>
                            setPenaltySettings((prev) => ({ ...prev, type: e.target.value }))
                          }
                          className="flex h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus-visible:outline-none text-foreground"
                        >
                          <option value="deduct_credit">
                            💵 Descontar crédito de clase igualmente
                          </option>
                          <option value="block_reservations">
                            🚫 Bloquear reservas por 48 horas (Pase Libre)
                          </option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground block">
                          Cantidad de Inasistencias Toleradas
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={penaltySettings.maxAbsences}
                          onChange={(e) =>
                            setPenaltySettings((prev) => ({
                              ...prev,
                              maxAbsences: parseInt(e.target.value) || 2,
                            }))
                          }
                          className="flex h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus-visible:outline-none text-foreground"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  type="button"
                  className="rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/95"
                  onClick={() => {
                    const saveBadge = document.getElementById("policy-save-badge");
                    if (saveBadge) {
                      saveBadge.classList.remove("hidden");
                      setTimeout(() => saveBadge.classList.add("hidden"), 3000);
                    }
                  }}
                >
                  Guardar Políticas
                </Button>
                <span
                  id="policy-save-badge"
                  className="hidden text-xs font-bold text-primary animate-fade-in block"
                >
                  ✅ Políticas de cancelación e inasistencia actualizadas correctamente.
                </span>
              </div>
            </div>
          )}

          {/* Subtab 3: Amenities */}
          {subTab === "amenities" && (
            <div className="space-y-6 max-w-3xl bg-card border border-border p-6 rounded-3xl">
              <div>
                <h3 className="font-bold text-sm">Amenities y Servicios Adicionales</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Define los servicios de infraestructura que ofrece tu centro.
                </p>
              </div>

              <div className="space-y-6">
                {amenityCategories.map((category) => (
                  <div key={category} className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-1.5">
                      {category}
                    </h4>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {amenities
                        .filter((a) => a.category === category)
                        .map((a) => (
                          <div
                            key={a.id}
                            className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/20 hover:bg-secondary/40 transition"
                          >
                            <div className="text-sm font-semibold">{a.name}</div>
                            <input
                              type="checkbox"
                              checked={a.checked}
                              onChange={() => handleToggleAmenity(a.id)}
                              className="h-5 w-10 accent-primary rounded-full cursor-pointer"
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subtab: Equipamiento */}
          {subTab === "equipamiento" && (
            <div className="space-y-6 max-w-4xl bg-card border border-border p-6 rounded-3xl animate-fade-in text-foreground">
              <div className="space-y-6">
                {equipmentCategories.map((category) => (
                  <div key={category} className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-border/80 pb-1.5 flex items-center justify-between">
                      <span>{category}</span>
                      <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full font-normal text-muted-foreground">
                        {equipment.filter((e) => e.category === category && e.checked).length} /{" "}
                        {equipment.filter((e) => e.category === category).length} seleccionados
                      </span>
                    </h4>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {equipment
                        .filter((e) => e.category === category)
                        .map((e) => (
                          <div
                            key={e.id}
                            onClick={() => handleToggleEquipment(e.id)}
                            className={`flex items-center justify-between p-3.5 rounded-2xl border transition cursor-pointer ${
                              e.checked
                                ? "bg-primary/5 border-primary/40 text-foreground"
                                : "bg-secondary/20 border-transparent text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                            }`}
                          >
                            <div className="flex items-center gap-3 pr-2 overflow-hidden flex-1">
                              <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-secondary border border-border/60">
                                {e.photo ? (
                                  <img
                                    src={e.photo}
                                    alt={e.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                    <Dumbbell className="w-5 h-5" />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <span className="text-sm font-semibold truncate block">
                                  {e.name}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center shrink-0 pl-2">
                              <input
                                type="checkbox"
                                checked={e.checked}
                                onChange={() => {}} // Controlled by parent div click
                                className="h-5 w-5 accent-primary rounded cursor-pointer shrink-0 pointer-events-none"
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subtab 4: Requirements */}
          {subTab === "requisitos" && (
            <div className="space-y-6 max-w-3xl bg-card border border-border p-6 rounded-3xl">
              <div>
                <h3 className="font-bold text-sm">Normas y Requisitos de Ingreso</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Controla las exigencias de higiene y documentación.
                </p>
              </div>

              <div className="space-y-6">
                {requirementCategories.map((category) => (
                  <div key={category} className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-1.5">
                      {category}
                    </h4>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {requirements
                        .filter((r) => r.category === category)
                        .map((r) => (
                          <div
                            key={r.id}
                            className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/20 hover:bg-secondary/40 transition"
                          >
                            <div className="text-sm font-semibold">{r.name}</div>
                            <input
                              type="checkbox"
                              checked={r.checked}
                              onChange={() => handleToggleRequirement(r.id)}
                              className="h-5 w-10 accent-primary rounded-full cursor-pointer"
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subtab 5: Staff */}
          {subTab === "staff" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-6 rounded-3xl">
                <div>
                  <h3 className="font-bold text-sm">Equipo y Profesores (Staff)</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Administra los entrenadores, coaches y personal administrativo de tu sede.
                  </p>
                </div>
                <Button
                  onClick={() => setIsCreateStaffOpen(true)}
                  className="rounded-xl font-bold text-xs gap-1.5 shrink-0"
                >
                  <Plus className="h-4 w-4" /> Añadir Coach / Profesor
                </Button>
              </div>

              <Dialog open={isCreateStaffOpen} onOpenChange={setIsCreateStaffOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border border-border bg-card">
                  <DialogHeader>
                    <DialogTitle>Añadir Profesor / Coach</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddStaff} className="space-y-4 pt-2">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">
                          Nombre y Apellido
                        </label>
                        <input
                          type="text"
                          required
                          value={staffName}
                          onChange={(e) => setStaffName(e.target.value)}
                          className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
                          placeholder="Juan Gómez"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-xs font-semibold text-muted-foreground block">
                          Actividades / Especialidades que dicta (Selecciona 1 o varias)
                        </label>
                        
                        {/* Selector de Chips elegidos */}
                        <div className="flex flex-wrap gap-1.5 min-h-[38px] p-2 rounded-xl border border-border bg-background items-center">
                          {staffSpecialties.map((spec) => (
                            <span
                              key={spec}
                              className="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                            >
                              {spec}
                              <button
                                type="button"
                                onClick={() => setStaffSpecialties((prev) => prev.filter((s) => s !== spec))}
                                className="hover:text-destructive text-primary/70 transition-colors ml-0.5"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                          {staffSpecialties.length === 0 && (
                            <span className="text-xs text-muted-foreground italic">
                              Haz clic en las actividades de abajo para vincularlas a este profesor...
                            </span>
                          )}
                        </div>

                        {/* Botones de Selección Rápida */}
                        <div className="flex flex-wrap gap-1 pt-1 max-h-[130px] overflow-y-auto custom-scrollbar p-2 bg-secondary/20 border border-border/40 rounded-xl">
                          {STAFF_SPECIALTY_PRESETS.map((preset) => {
                            const isSelected = staffSpecialties.includes(preset);
                            return (
                              <button
                                key={preset}
                                type="button"
                                onClick={() => {
                                  if (isSelected) {
                                    setStaffSpecialties((prev) => prev.filter((s) => s !== preset));
                                  } else {
                                    setStaffSpecialties((prev) => [...prev, preset]);
                                  }
                                }}
                                className={cn(
                                  "text-[10.5px] font-bold px-2.5 py-1 rounded-lg border transition-all select-none",
                                  isSelected
                                    ? "bg-primary text-primary-foreground border-primary shadow-2xs"
                                    : "bg-background border-border/60 text-muted-foreground hover:bg-secondary hover:text-foreground",
                                )}
                              >
                                {isSelected ? "✓ " : "+ "}{preset}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">
                        Certificaciones y Títulos (separados por comas)
                      </label>
                      <input
                        type="text"
                        value={staffCerts}
                        onChange={(e) => setStaffCerts(e.target.value)}
                        className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
                        placeholder="CF-L1, Prof. Educación Física, Guardavidas"
                      />
                    </div>



                    {/* Rate Scheme Inputs */}
                    <div className="border-t border-border/40 pt-4 space-y-3">
                      <div>
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                          Esquema de Tarifas & Honorarios
                        </h4>
                        <p className="text-[10.5px] text-muted-foreground mt-0.5">
                          Configura las tarifas acordadas para el cálculo automático de sueldos en Finanzas.
                        </p>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-muted-foreground">
                            Base Fija Mensual ($)
                          </label>
                          <input
                            type="number"
                            placeholder="Ej: 60000"
                            value={staffBaseSalary}
                            onChange={(e) => setStaffBaseSalary(e.target.value)}
                            className="flex h-9 w-full rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground focus-visible:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-muted-foreground">
                            Pago por Clase ($)
                          </label>
                          <input
                            type="number"
                            placeholder="Ej: 5000"
                            value={staffPayPerClass}
                            onChange={(e) => setStaffPayPerClass(e.target.value)}
                            className="flex h-9 w-full rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground focus-visible:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-muted-foreground">
                            Comisión / Alumno ($)
                          </label>
                          <input
                            type="number"
                            placeholder="Ej: 300"
                            value={staffPayPerStudent}
                            onChange={(e) => setStaffPayPerStudent(e.target.value)}
                            className="flex h-9 w-full rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground focus-visible:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-border/40 pt-4 space-y-4">
                      <div>
                        <h4 className="text-xs font-bold text-muted-foreground uppercase">
                          Disponibilidad Horaria Semanal
                        </h4>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          Define los días y franjas horarias en los que el profesor puede dictar
                          clases.
                        </p>
                      </div>

                      <div className="space-y-3">
                        {newStaffAvails.map((dayAvail, dayIdx) => (
                          <div
                            key={dayAvail.day}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-2xl bg-secondary/10 border border-border/40 text-xs text-foreground"
                          >
                            <span className="font-bold w-20 text-foreground shrink-0">
                              {dayAvail.day}
                            </span>

                            <div className="flex-1 space-y-2">
                              {dayAvail.intervals.map((interval, intervalIdx) => (
                                <div key={intervalIdx} className="flex items-center gap-2">
                                  <input
                                    type="time"
                                    value={interval.from}
                                    onChange={(e) =>
                                      handleUpdateStaffAvailInterval(
                                        false,
                                        dayIdx,
                                        intervalIdx,
                                        "from",
                                        e.target.value,
                                      )
                                    }
                                    className="px-2 py-1 rounded-lg border border-border bg-background text-xs text-foreground focus-visible:outline-none"
                                  />
                                  <span className="text-[10px] text-muted-foreground">a</span>
                                  <input
                                    type="time"
                                    value={interval.to}
                                    onChange={(e) =>
                                      handleUpdateStaffAvailInterval(
                                        false,
                                        dayIdx,
                                        intervalIdx,
                                        "to",
                                        e.target.value,
                                      )
                                    }
                                    className="px-2 py-1 rounded-lg border border-border bg-background text-xs text-foreground focus-visible:outline-none"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveStaffAvailInterval(false, dayIdx, intervalIdx)
                                    }
                                    className="p-1 text-destructive hover:bg-destructive/ rounded transition"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                              {dayAvail.intervals.length === 0 && (
                                <span className="text-[10px] text-muted-foreground italic bg-secondary/40 px-2 py-0.5 rounded inline-block">
                                  No disponible
                                </span>
                              )}
                            </div>

                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="self-start sm:self-center text-[10px] gap-1 py-1 h-7 rounded-lg"
                              onClick={() => handleAddStaffAvailInterval(false, dayIdx)}
                            >
                              <Plus className="h-3 w-3" /> Turno
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground block">
                          Foto de Perfil
                        </label>
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full overflow-hidden border border-border bg-muted flex items-center justify-center shrink-0">
                            {staffAvatarUrl ? (
                              <img
                                src={staffAvatarUrl}
                                alt="Preview"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Users className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="rounded-xl"
                            onClick={() => coachAvatarRef.current?.click()}
                          >
                            Subir Foto
                          </Button>
                          <input
                            type="file"
                            accept="image/*"
                            ref={coachAvatarRef}
                            onChange={handleCoachAvatarUpload}
                            className="hidden"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground block">
                          Adjuntar Diplomas / Certificaciones
                        </label>
                        <div className="flex items-center gap-3">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="rounded-xl gap-1.5"
                            onClick={() => coachCertsRef.current?.click()}
                          >
                            <Plus className="h-4 w-4" /> Subir Certificados
                          </Button>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            ref={coachCertsRef}
                            onChange={handleCoachDiplomasUpload}
                            className="hidden"
                          />
                        </div>
                      </div>
                    </div>

                    {staffDiplomas.length > 0 && (
                      <div className="space-y-1.5 border-t border-border/60 pt-3">
                        <label className="text-xs font-semibold text-muted-foreground block">
                          Diplomas Adjuntos ({staffDiplomas.length})
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {staffDiplomas.map((url, index) => (
                            <div
                              key={index}
                              className="relative h-12 w-16 rounded-lg overflow-hidden border border-border group"
                            >
                              <img src={url} alt="Diploma" className="h-full w-full object-cover" />
                              <button
                                type="button"
                                onClick={() => handleRemoveDiplomaPreview(index)}
                                className="absolute top-0.5 right-0.5 bg-black/60 text-white p-0.5 rounded-full hover:bg-black transition"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end gap-2 pt-4 border-t border-border">
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => setIsCreateStaffOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="rounded-xl">
                        Añadir al Staff
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              <div className="rounded-3xl border border-border bg-card p-6">
                <h3 className="text-sm font-bold text-muted-foreground uppercase mb-4">
                  Equipo Registrado
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {staffList.map((s) => (
                    <div
                      key={s.id}
                      className="relative p-4 border border-border rounded-2xl bg-secondary/10 flex flex-col justify-between min-h-[140px]"
                    >
                      <div className="absolute top-2 right-2 flex gap-1 z-10">
                        <button
                          type="button"
                          onClick={() => handleStartEditStaff(s)}
                          className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition"
                          title="Editar miembro"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeletingItem({ type: "staff", id: s.id, name: s.name });
                            setDeleteConfirmText("");
                          }}
                          className="p-1.5 rounded-full hover:bg-destructive/ text-destructive transition"
                          title="Eliminar miembro"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <img
                          src={s.photo}
                          alt={s.name}
                          className="h-12 w-12 rounded-full object-cover border border-border shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-foreground truncate">{s.name}</div>
                          <div className="text-[10px] text-muted-foreground truncate">
                            {s.specialty}
                          </div>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {s.role && (
                              <span className="text-[8px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                {s.role === "coach"
                                  ? "💪 Coach"
                                  : s.role === "receptionist"
                                    ? "🔑 Recep"
                                    : "👤 Manager"}
                              </span>
                            )}
                            {s.role && (
                              <span className="text-[8px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                📍{" "}
                                {s.branchId
                                  ? branchesList
                                      .find((b) => b.id === s.branchId)
                                      ?.name.replace("Sede ", "") || s.branchId
                                  : "Palermo"}
                              </span>
                            )}
                          </div>
                          <div className="mt-1.5 flex flex-wrap gap-1">
                            {s.certifications.map((c) => (
                              <span
                                key={c}
                                className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Availability & OTP Linking details */}
                      <div className="mt-3.5 border-t border-border/40 pt-2 text-[10px] space-y-1 bg-secondary/5 p-2 rounded-xl">
                        {s.availability &&
                          s.availability.some((a) => a.intervals && a.intervals.length > 0) && (
                            <div
                              className="text-muted-foreground font-medium line-clamp-2"
                              title={s.availability
                                .filter((a) => a.intervals.length > 0)
                                .map(
                                  (a) =>
                                    `${a.day}: ${a.intervals.map((i) => `${i.from}-${i.to}`).join(", ")}`,
                                )
                                .join("\n")}
                            >
                              ⏰ <span className="font-bold text-foreground">Disp:</span>{" "}
                              {s.availability
                                .filter((a) => a.intervals.length > 0)
                                .map(
                                  (a) =>
                                    `${a.day.slice(0, 3)} (${a.intervals.map((i) => `${i.from}-${i.to}`).join(",")})`,
                                )
                                .join(" | ")}
                            </div>
                          )}

                        <div className="flex items-center justify-between gap-1.5 mt-1 border-t border-border/20 pt-1">
                          {s.status === "linked" ? (
                            <span className="text-[9px] text-primary font-bold flex items-center gap-1">
                              🟢 Disp. Vinculado
                            </span>
                          ) : (
                            <>
                              <span
                                className="text-[9px] text-secondary-foreground font-bold flex items-center gap-1"
                                title="Dispositivo pendiente de vinculación"
                              >
                                🟡 Pendiente OTP:{" "}
                                <span className="bg-secondary/ px-1 py-0.5 rounded text-secondary-foreground font-mono text-[10px]">
                                  {s.linkingCode}
                                </span>
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
                                  setStaffList((prev) =>
                                    prev.map((item) =>
                                      item.id === s.id ? { ...item, linkingCode: newOtp } : item,
                                    ),
                                  );
                                  alert(`Nuevo código OTP de un solo uso generado: ${newOtp}`);
                                }}
                                className="text-[9px] text-primary font-bold hover:underline"
                              >
                                Regenerar
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {s.certificationImages && s.certificationImages.length > 0 && (
                        <button
                          onClick={() => setActiveCertificationsViewer(s.certificationImages || [])}
                          className="mt-3 text-[10px] font-bold text-primary hover:underline self-start flex items-center gap-1"
                        >
                          <Eye className="h-3 w-3" /> Ver Certificados (
                          {s.certificationImages.length})
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Diplomas Viewer Modal */}
          {activeCertificationsViewer && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-fade-in">
              <div className="relative bg-card border border-border w-full max-w-[600px] rounded-3xl p-6 flex flex-col">
                <button
                  onClick={() => setActiveCertificationsViewer(null)}
                  className="absolute right-4 top-4 p-2 rounded-full hover:bg-secondary transition z-10"
                >
                  <X className="h-5 w-5" />
                </button>

                <h3 className="text-lg font-bold tracking-tight mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" /> Diplomas y Certificaciones
                </h3>

                <div className="grid gap-3 grid-cols-2 overflow-y-auto max-h-[400px]">
                  {activeCertificationsViewer.map((url, index) => (
                    <div
                      key={index}
                      className="border border-border rounded-xl overflow-hidden aspect-video bg-muted relative group"
                    >
                      <img
                        src={url}
                        alt={`Diploma ${index}`}
                        className="h-full w-full object-cover"
                      />
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition text-white text-xs font-bold gap-1"
                      >
                        <Eye className="h-4 w-4" /> Ver pantalla completa
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Edit Staff Modal */}
          {editingStaff && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-fade-in text-foreground">
              <form
                onSubmit={handleSaveEditStaff}
                className="relative bg-card border border-border w-full max-w-[500px] rounded-3xl p-6 space-y-4 animate-fade-up"
              >
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="absolute right-4 top-4 p-2 rounded-full hover:bg-secondary transition"
                >
                  <X className="h-5 w-5" />
                </button>

                <h3 className="text-lg font-bold tracking-tight">Editar Miembro de Staff</h3>

                <div className="space-y-3 overflow-y-auto max-h-[60vh] pr-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground block">
                      Nombre y Apellido
                    </label>
                    <input
                      type="text"
                      required
                      value={editStaffName}
                      onChange={(e) => setEditStaffName(e.target.value)}
                      className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground block">
                      Actividades / Especialidades que dicta (Selecciona 1 o varias)
                    </label>
                    
                    {/* Selector de Chips elegidos */}
                    <div className="flex flex-wrap gap-1.5 min-h-[38px] p-2 rounded-xl border border-border bg-background items-center">
                      {editStaffSpecialties.map((spec) => (
                        <span
                          key={spec}
                          className="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                        >
                          {spec}
                          <button
                            type="button"
                            onClick={() => setEditStaffSpecialties((prev) => prev.filter((s) => s !== spec))}
                            className="hover:text-destructive text-primary/70 transition-colors ml-0.5"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {editStaffSpecialties.length === 0 && (
                        <span className="text-xs text-muted-foreground italic">
                          Haz clic en las actividades de abajo para vincularlas a este profesor...
                        </span>
                      )}
                    </div>

                    {/* Botones de Selección Rápida */}
                    <div className="flex flex-wrap gap-1 pt-1 max-h-[130px] overflow-y-auto custom-scrollbar p-2 bg-secondary/20 border border-border/40 rounded-xl">
                      {STAFF_SPECIALTY_PRESETS.map((preset) => {
                        const isSelected = editStaffSpecialties.includes(preset);
                        return (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setEditStaffSpecialties((prev) => prev.filter((s) => s !== preset));
                              } else {
                                setEditStaffSpecialties((prev) => [...prev, preset]);
                              }
                            }}
                            className={cn(
                              "text-[10.5px] font-bold px-2.5 py-1 rounded-lg border transition-all select-none",
                              isSelected
                                ? "bg-primary text-primary-foreground border-primary shadow-2xs"
                                : "bg-background border-border/60 text-muted-foreground hover:bg-secondary hover:text-foreground",
                            )}
                          >
                            {isSelected ? "✓ " : "+ "}{preset}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground block">
                      Certificaciones (separadas por comas)
                    </label>
                    <input
                      type="text"
                      value={editStaffCerts}
                      onChange={(e) => setEditStaffCerts(e.target.value)}
                      className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
                    />
                  </div>



                  {/* Rate Scheme Inputs in Edit Staff Dialog */}
                  <div className="border-t border-border/40 pt-4 space-y-3">
                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Esquema de Tarifas & Honorarios
                      </h4>
                      <p className="text-[10.5px] text-muted-foreground mt-0.5">
                        Configura las tarifas acordadas para el cálculo automático de sueldos en Finanzas.
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-muted-foreground">
                          Base Fija Mensual ($)
                        </label>
                        <input
                          type="number"
                          placeholder="Ej: 60000"
                          value={editStaffBaseSalary}
                          onChange={(e) => setEditStaffBaseSalary(e.target.value)}
                          className="flex h-9 w-full rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground focus-visible:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-muted-foreground">
                          Pago por Clase ($)
                        </label>
                        <input
                          type="number"
                          placeholder="Ej: 5000"
                          value={editStaffPayPerClass}
                          onChange={(e) => setEditStaffPayPerClass(e.target.value)}
                          className="flex h-9 w-full rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground focus-visible:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-muted-foreground">
                          Comisión / Alumno ($)
                        </label>
                        <input
                          type="number"
                          placeholder="Ej: 300"
                          value={editStaffPayPerStudent}
                          onChange={(e) => setEditStaffPayPerStudent(e.target.value)}
                          className="flex h-9 w-full rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground focus-visible:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border/40 pt-4 space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase">
                        Disponibilidad Horaria Semanal
                      </h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Define los días y franjas horarias en los que el profesor puede dictar
                        clases.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {editStaffAvails.map((dayAvail, dayIdx) => (
                        <div
                          key={dayAvail.day}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-2xl bg-secondary/10 border border-border/40 text-xs text-foreground"
                        >
                          <span className="font-bold w-20 text-foreground shrink-0">
                            {dayAvail.day}
                          </span>

                          <div className="flex-1 space-y-2">
                            {dayAvail.intervals.map((interval, intervalIdx) => (
                              <div key={intervalIdx} className="flex items-center gap-2">
                                <input
                                  type="time"
                                  value={interval.from}
                                  onChange={(e) =>
                                    handleUpdateStaffAvailInterval(
                                      true,
                                      dayIdx,
                                      intervalIdx,
                                      "from",
                                      e.target.value,
                                    )
                                  }
                                  className="px-2 py-1 rounded-lg border border-border bg-background text-xs text-foreground focus-visible:outline-none"
                                />
                                <span className="text-[10px] text-muted-foreground">a</span>
                                <input
                                  type="time"
                                  value={interval.to}
                                  onChange={(e) =>
                                    handleUpdateStaffAvailInterval(
                                      true,
                                      dayIdx,
                                      intervalIdx,
                                      "to",
                                      e.target.value,
                                    )
                                  }
                                  className="px-2 py-1 rounded-lg border border-border bg-background text-xs text-foreground focus-visible:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveStaffAvailInterval(true, dayIdx, intervalIdx)
                                  }
                                  className="p-1 text-destructive hover:bg-destructive/ rounded transition"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                            {dayAvail.intervals.length === 0 && (
                              <span className="text-[10px] text-muted-foreground italic bg-secondary/40 px-2 py-0.5 rounded inline-block">
                                No disponible
                              </span>
                            )}
                          </div>

                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="self-start sm:self-center text-[10px] gap-1 py-1 h-7 rounded-lg"
                            onClick={() => handleAddStaffAvailInterval(true, dayIdx)}
                          >
                            <Plus className="h-3 w-3" /> Turno
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Photo & Diplomas in Edit Modal */}
                <div className="grid gap-4 grid-cols-2 border-t border-border/40 pt-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground block">
                      Foto de Perfil
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full overflow-hidden border border-border bg-muted flex items-center justify-center shrink-0">
                        {editStaffAvatarUrl ? (
                          <img
                            src={editStaffAvatarUrl}
                            alt="Edit Preview"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Users className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="rounded-xl text-[10px]"
                        onClick={() => editCoachAvatarRef.current?.click()}
                      >
                        Cambiar
                      </Button>
                      <input
                        type="file"
                        accept="image/*"
                        ref={editCoachAvatarRef}
                        onChange={handleEditCoachAvatarUpload}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground block">
                      Diplomas / Certificaciones
                    </label>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="rounded-xl text-[10px] gap-1"
                      onClick={() => editCoachCertsRef.current?.click()}
                    >
                      <Plus className="h-3 w-3" /> Añadir
                    </Button>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      ref={editCoachCertsRef}
                      onChange={handleEditCoachDiplomasUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* List of editStaffDiplomas */}
                {editStaffDiplomas.length > 0 && (
                  <div className="space-y-1 border-t border-border/40 pt-3">
                    <label className="text-xs font-semibold text-muted-foreground block">
                      Diplomas Guardados ({editStaffDiplomas.length})
                    </label>
                    <div className="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto">
                      {editStaffDiplomas.map((url, index) => (
                        <div
                          key={index}
                          className="relative h-10 w-14 rounded-lg overflow-hidden border border-border group shrink-0"
                        >
                          <img src={url} alt="Diploma" className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveEditDiploma(index)}
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition text-destructive hover:text-destructive"
                            title="Quitar diploma"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 flex gap-3">
                  <Button type="submit" className="rounded-xl flex-1 font-bold text-xs">
                    Guardar Cambios
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl flex-1 font-bold text-xs"
                    onClick={() => setEditingStaff(null)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Universal Delete Confirmation Modal (Ponytail: One modal for all 4 sections) */}
          <Dialog open={!!deletingItem} onOpenChange={(o) => !o && setDeletingItem(null)}>
            <DialogContent className="max-w-md border border-border bg-card text-center sm:text-center">
              <DialogHeader>
                <DialogTitle className="text-center">¿Confirmar Eliminación?</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2 flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-destructive/ text-destructive flex items-center justify-center">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Estás a punto de eliminar <strong>"{deletingItem?.name}"</strong> del sistema.
                  Esta acción no se puede deshacer. Para confirmar, escribe la palabra clave{" "}
                  <strong>Eliminar</strong> a continuación:
                </p>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-center focus-visible:outline-none font-bold placeholder:font-normal"
                  placeholder="Escribe Eliminar para confirmar"
                />
                <div className="flex gap-2 w-full pt-2">
                  <Button
                    variant="outline"
                    className="rounded-xl flex-1 font-bold text-xs"
                    onClick={() => setDeletingItem(null)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleConfirmRemoveItem}
                    disabled={deleteConfirmText.trim().toLowerCase() !== "eliminar"}
                    className="rounded-xl flex-1 bg-destructive hover:bg-destructive text-white font-bold text-xs disabled:opacity-50"
                  >
                    Confirmar Eliminación
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          {/* ponytail: Sucursales / Sedes subtab removed per user request */}

          {/* Subtab: Salas / Salones de Sede */}
          {subTab === "salas" && (
            <div className="space-y-6 max-w-2xl bg-card border border-border p-6 rounded-3xl animate-fade-up text-foreground">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-sm">Salas y Salones de la Sede</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Administra los espacios físicos de esta sede (ej: Sala de musculación, estudio
                    de yoga, box de CrossFit). Cada sala limita el cupo y organiza el calendario de
                    clases.
                  </p>
                </div>
                <Button
                  onClick={() => setIsCreateSalaOpen(true)}
                  size="sm"
                  className="rounded-xl font-bold text-xs gap-1.5 shrink-0"
                >
                  <Plus className="h-4 w-4" /> Agregar Sala / Salón
                </Button>
              </div>

              <Dialog open={isCreateSalaOpen} onOpenChange={setIsCreateSalaOpen}>
                <DialogContent className="max-w-lg border border-border bg-card">
                  <DialogHeader>
                    <DialogTitle>Agregar Sala / Salón</DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newSalaName) return;
                      setSalasList((prev) => [
                        ...prev,
                        {
                          id: Math.random().toString(),
                          name: newSalaName,
                          capacity: newSalaCapacity ? parseInt(newSalaCapacity) : undefined,
                          description: newSalaDescription || undefined,
                          branchId: selectedBranchId,
                        },
                      ]);
                      setNewSalaName("");
                      setNewSalaCapacity("");
                      setNewSalaDescription("");
                      setIsCreateSalaOpen(false);
                    }}
                    className="space-y-4 pt-2"
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground font-semibold">
                          Nombre de la Sala
                        </label>
                        <input
                          type="text"
                          required
                          value={newSalaName}
                          onChange={(e) => setNewSalaName(e.target.value)}
                          className="flex h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus-visible:outline-none text-foreground"
                          placeholder="Ej: Box CrossFit 2"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground font-semibold">
                          Capacidad de Referencia (Alumnos)
                        </label>
                        <input
                          type="number"
                          value={newSalaCapacity}
                          onChange={(e) => setNewSalaCapacity(e.target.value)}
                          className="flex h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus-visible:outline-none text-foreground"
                          placeholder="Ej: 15"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground font-semibold">
                        Descripción o Equipamiento (Opcional)
                      </label>
                      <input
                        type="text"
                        value={newSalaDescription}
                        onChange={(e) => setNewSalaDescription(e.target.value)}
                        className="flex h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus-visible:outline-none text-foreground"
                        placeholder="Ej: Equipado con 12 plataformas y racks olímpicos"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-4 border-t border-border">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                        onClick={() => setIsCreateSalaOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" size="sm" className="rounded-xl">
                        Guardar Sala
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Edit Sala Dialog */}
              <Dialog open={!!editingSala} onOpenChange={(o) => !o && setEditingSala(null)}>
                <DialogContent className="max-w-md border border-border bg-card">
                  <DialogHeader>
                    <DialogTitle>Editar Sala / Salón</DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!editingSala || !editingSala.name) return;
                      setSalasList((prev) =>
                        prev.map((s) => (s.id === editingSala.id ? editingSala : s)),
                      );
                      setEditingSala(null);
                    }}
                    className="space-y-4 pt-2 text-sm"
                  >
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground font-semibold">
                        Nombre del Salón
                      </label>
                      <input
                        type="text"
                        required
                        value={editingSala?.name || ""}
                        onChange={(e) => setEditingSala({ ...editingSala, name: e.target.value })}
                        className="flex h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus-visible:outline-none text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground font-semibold">
                        Capacidad Máxima (Alumnos)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={editingSala?.capacity || ""}
                        onChange={(e) =>
                          setEditingSala({
                            ...editingSala,
                            capacity: e.target.value ? parseInt(e.target.value) : undefined,
                          })
                        }
                        className="flex h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus-visible:outline-none text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground font-semibold">
                        Descripción o Equipamiento (Opcional)
                      </label>
                      <input
                        type="text"
                        value={editingSala?.description || ""}
                        onChange={(e) =>
                          setEditingSala({ ...editingSala, description: e.target.value })
                        }
                        className="flex h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus-visible:outline-none text-foreground"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-4 border-t border-border">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                        onClick={() => setEditingSala(null)}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" size="sm" className="rounded-xl">
                        Guardar Cambios
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Rooms list */}
              <div className="border-t border-border pt-4">
                <h4 className="text-xs font-bold text-muted-foreground uppercase mb-3">
                  Salas Registradas
                </h4>
                <div className="divide-y divide-border/60">
                  {salasList
                    .filter((s) => s.branchId === selectedBranchId)
                    .map((sala) => (
                      <div key={sala.id} className="py-3.5 flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <DoorOpen className="h-4 w-4 text-primary shrink-0" />
                            {sala.name}
                          </div>
                          {sala.description && (
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {sala.description}
                            </div>
                          )}
                          <div className="flex gap-3 mt-1 text-[10px] text-muted-foreground">
                            <span>
                              👥 Capacidad sugerida: {sala.capacity || "Sin límite"} alumnos
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => setEditingSala({ ...sala })}
                            className="p-1.5 text-muted-foreground hover:bg-secondary rounded-lg transition"
                            title="Editar sala"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDeletingItem({ type: "sala", id: sala.id, name: sala.name });
                              setDeleteConfirmText("");
                            }}
                            className="p-1.5 text-destructive hover:bg-destructive/ rounded-lg transition"
                            title="Eliminar sala"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  {salasList.filter((s) => s.branchId === selectedBranchId).length === 0 && (
                    <p className="text-xs text-muted-foreground italic py-3 text-center font-medium">
                      No hay salas registradas en esta sede.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}


          {subTab === "cierres" && (
            <div className="space-y-6 max-w-2xl bg-card border border-border p-6 rounded-3xl animate-fade-up text-foreground">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-sm">Calendario de Días de Cierre</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Establece feriados, festivos o jornadas de mantenimiento técnico/edilicio para
                    suspender reservas automáticamente.
                  </p>
                </div>
                <Button
                  onClick={() => setIsCreateCierreOpen(true)}
                  size="sm"
                  className="rounded-xl font-bold text-xs gap-1 shrink-0"
                >
                  <Plus className="h-4 w-4" /> Agregar Día de Cierre
                </Button>
              </div>

              <Dialog open={isCreateCierreOpen} onOpenChange={setIsCreateCierreOpen}>
                <DialogContent className="max-w-md border border-border bg-card">
                  <DialogHeader>
                    <DialogTitle>Agregar Día de Cierre</DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newBlackoutDate || !newBlackoutReason) return;
                      setBlackoutDays((prev) => [
                        ...prev,
                        {
                          id: Math.random().toString(),
                          date: newBlackoutDate,
                          reason: newBlackoutReason,
                        },
                      ]);
                      setNewBlackoutDate("");
                      setNewBlackoutReason("");
                      setIsCreateCierreOpen(false);
                    }}
                    className="space-y-4 pt-2 text-sm"
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground font-semibold">
                          Fecha de Cierre
                        </label>
                        <input
                          type="date"
                          required
                          value={newBlackoutDate}
                          onChange={(e) => setNewBlackoutDate(e.target.value)}
                          className="flex h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus-visible:outline-none text-foreground"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground font-semibold">
                          Motivo del Cierre
                        </label>
                        <input
                          type="text"
                          required
                          value={newBlackoutReason}
                          onChange={(e) => setNewBlackoutReason(e.target.value)}
                          className="flex h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus-visible:outline-none text-foreground"
                          placeholder="Ej: Feriado Nacional o Desinfección"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-border">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                        onClick={() => setIsCreateCierreOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" size="sm" className="rounded-xl font-bold text-xs">
                        Guardar Día
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Edit Cierre Dialog */}
              <Dialog open={!!editingCierre} onOpenChange={(o) => !o && setEditingCierre(null)}>
                <DialogContent className="max-w-md border border-border bg-card">
                  <DialogHeader>
                    <DialogTitle>Editar Día de Cierre</DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!editingCierre || !editingCierre.date || !editingCierre.reason) return;
                      setBlackoutDays((prev) =>
                        prev.map((c) => (c.id === editingCierre.id ? editingCierre : c)),
                      );
                      setEditingCierre(null);
                    }}
                    className="space-y-4 pt-2 text-sm"
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground font-semibold">
                          Fecha de Cierre
                        </label>
                        <input
                          type="date"
                          required
                          value={editingCierre?.date || ""}
                          onChange={(e) =>
                            setEditingCierre({ ...editingCierre, date: e.target.value })
                          }
                          className="flex h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus-visible:outline-none text-foreground"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground font-semibold">
                          Motivo del Cierre
                        </label>
                        <input
                          type="text"
                          required
                          value={editingCierre?.reason || ""}
                          onChange={(e) =>
                            setEditingCierre({ ...editingCierre, reason: e.target.value })
                          }
                          className="flex h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus-visible:outline-none text-foreground"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4 border-t border-border">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                        onClick={() => setEditingCierre(null)}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" size="sm" className="rounded-xl font-bold text-xs">
                        Guardar Cambios
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Closures list */}
              <div className="space-y-3 border-t border-border pt-4">
                <h4 className="text-xs font-bold text-muted-foreground uppercase">
                  Fechas de Cierre Programadas
                </h4>
                <div className="divide-y divide-border">
                  {blackoutDays.map((b) => (
                    <div key={b.id} className="py-3.5 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-foreground">{b.reason}</div>
                        <div className="text-xs text-muted-foreground">
                          📅 {b.date}{" "}
                          {b.date === "2026-06-29" && (
                            <span className="text-[10px] bg-destructive/ text-destructive font-bold px-1.5 py-0.5 rounded ml-1.5 uppercase">
                              Hoy
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => setEditingCierre({ ...b })}
                          className="p-1.5 text-muted-foreground hover:bg-secondary rounded-lg transition"
                          title="Editar día de cierre"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeletingItem({
                              type: "cierre",
                              id: b.id,
                              name: `${b.reason} (${b.date})`,
                            });
                            setDeleteConfirmText("");
                          }}
                          className="p-1.5 text-destructive hover:bg-destructive/ rounded-lg transition"
                          title="Eliminar día de cierre"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {blackoutDays.length === 0 && (
                    <p className="text-xs text-muted-foreground italic py-3">
                      No hay días de cierre configurados.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Modal Crear Equipamiento */}
          <Dialog open={isCreateEquipmentOpen} onOpenChange={setIsCreateEquipmentOpen}>
            <DialogContent className="max-w-md rounded-3xl border border-border bg-card">
              <DialogHeader>
                <DialogTitle className="text-lg">Añadir Nuevo Equipamiento</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-3 text-sm">
                <div className="space-y-1.5">
                  <Label htmlFor="equip-name">Nombre o Descripción del Equipo</Label>
                  <Input
                    id="equip-name"
                    placeholder="Ej. Escaladora StairMaster, Banco Scott..."
                    value={newEquipName}
                    onChange={(e) => setNewEquipName(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="equip-cat">Categoría</Label>
                  <Select value={newEquipCategory} onValueChange={setNewEquipCategory}>
                    <SelectTrigger className="rounded-xl pl-3.5 pr-9">
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Musculación & Peso Libre">
                        Musculación & Peso Libre
                      </SelectItem>
                      <SelectItem value="Máquinas Guiadas & Poleas">
                        Máquinas Guiadas & Poleas
                      </SelectItem>
                      <SelectItem value="Cardio & Acondicionamiento">
                        Cardio & Acondicionamiento
                      </SelectItem>
                      <SelectItem value="Funcional & Movilidad">Funcional & Movilidad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="equip-photo">URL de Fotografía Ilustrativa (Opcional)</Label>
                  <Input
                    id="equip-photo"
                    placeholder="https://images.unsplash.com/..."
                    value={newEquipPhoto}
                    onChange={(e) => setNewEquipPhoto(e.target.value)}
                    className="rounded-xl font-mono text-xs"
                  />
                </div>
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => setIsCreateEquipmentOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  className="rounded-xl font-semibold"
                  disabled={!newEquipName.trim()}
                  onClick={() => {
                    const newId = "equip-" + Date.now();
                    const defaultPhoto =
                      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=300&q=80";
                    setEquipment((prev) => [
                      ...prev,
                      {
                        id: newId,
                        name: newEquipName.trim(),
                        category: newEquipCategory,
                        checked: true,
                        photo: newEquipPhoto.trim() || defaultPhoto,
                      },
                    ]);
                    setNewEquipName("");
                    setNewEquipPhoto("");
                    setIsCreateEquipmentOpen(false);
                  }}
                >
                  Añadir a la Lista
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Modal Editar / Subir Imagen Equipamiento */}
          <Dialog
            open={!!editingEquipPhoto}
            onOpenChange={(open) => !open && setEditingEquipPhoto(null)}
          >
            <DialogContent className="max-w-md rounded-3xl border border-border bg-card">
              <DialogHeader>
                <DialogTitle className="text-lg">Cambiar Imagen del Equipamiento</DialogTitle>
              </DialogHeader>
              {editingEquipPhoto && (
                <div className="space-y-4 py-3 text-sm">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/30 border border-border/60">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-secondary shrink-0 border border-border/80">
                      {editingEquipPhoto.photo ? (
                        <img
                          src={editingEquipPhoto.photo}
                          alt={editingEquipPhoto.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <Dumbbell className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-foreground text-sm truncate">
                        {editingEquipPhoto.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Sube la URL de la imagen representativa o fotografía de tu equipo.
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="edit-equip-photo">URL de la Fotografía (o Unsplash)</Label>
                    <Input
                      id="edit-equip-photo"
                      placeholder="https://images.unsplash.com/..."
                      value={editingEquipPhoto.photo}
                      onChange={(e) =>
                        setEditingEquipPhoto({ ...editingEquipPhoto, photo: e.target.value })
                      }
                      className="rounded-xl font-mono text-xs"
                    />
                  </div>
                </div>
              )}
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => setEditingEquipPhoto(null)}
                >
                  Cancelar
                </Button>
                <Button
                  className="rounded-xl font-semibold"
                  onClick={() => {
                    if (!editingEquipPhoto) return;
                    setEquipment((prev) =>
                      prev.map((e) =>
                        e.id === editingEquipPhoto.id
                          ? { ...e, photo: editingEquipPhoto.photo.trim() }
                          : e,
                      ),
                    );
                    setEditingEquipPhoto(null);
                  }}
                >
                  Guardar Imagen
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
    </div>
  );
}

// Subcomponent: Student App View
// ponytail: haversine in ~5 lines, no lib needed
function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const CHECKIN_RADIUS_M = 150; // 150m — ~1.5 manzanas porteñas, absorbs indoor GPS drift

function StudentAppView({
  currentUser,
  classesList,
  setClassesList,
  salasList,
  setReviewsList,
  branchesList,
}: {
  currentUser: CurrentUser;
  classesList: ClassItem[];
  setClassesList: React.Dispatch<React.SetStateAction<ClassItem[]>>;
  salasList: { id: string; name: string }[];
  setReviewsList: React.Dispatch<React.SetStateAction<any[]>>;
  branchesList: { id: string; name: string; lat?: number; lng?: number }[];
}) {
  const [studentAptoStatus, setStudentAptoStatus] = useState<"ok" | "expired" | "pending">(
    "expired",
  );
  const [isAptoDialogOpen, setIsAptoDialogOpen] = useState(false);
  // { classId: "idle" | "loading" | "success" | "error" | "far" }
  const [checkinState, setCheckinState] = useState<Record<string, string>>({});

  const handleGeoCheckin = (c: ClassItem & { spotIdx: number }) => {
    if (!navigator.geolocation) {
      setCheckinState((prev) => ({ ...prev, [c.id]: "error" }));
      return;
    }
    setCheckinState((prev) => ({ ...prev, [c.id]: "loading" }));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const branch = branchesList.find((b) => b.id === c.branchId);
        if (!branch?.lat || !branch?.lng) {
          // No coordinates configured → allow checkin (graceful degradation)
          markPresent(c);
          setCheckinState((prev) => ({ ...prev, [c.id]: "success" }));
          return;
        }
        const dist = haversineMeters(
          pos.coords.latitude,
          pos.coords.longitude,
          branch.lat,
          branch.lng,
        );
        if (dist <= CHECKIN_RADIUS_M) {
          markPresent(c);
          setCheckinState((prev) => ({ ...prev, [c.id]: "success" }));
        } else {
          setCheckinState((prev) => ({ ...prev, [c.id]: "far" }));
        }
      },
      () => setCheckinState((prev) => ({ ...prev, [c.id]: "error" })),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const markPresent = (c: ClassItem & { spotIdx: number }) => {
    setClassesList((prev) =>
      prev.map((item) =>
        item.id !== c.id
          ? item
          : {
              ...item,
              attendance: { ...item.attendance, [c.spotIdx]: "presente" as const },
            },
      ),
    );
  };

  const myClasses = classesList
    .map((c) => {
      const spotEntry = Object.entries(c.enrolledSpots || {}).find(
        ([, name]) => name === currentUser.name,
      );
      if (!spotEntry) return null;
      const spotIdx = parseInt(spotEntry[0]);
      const attendance = c.attendance?.[spotIdx] || "pendiente";
      const rating = c.ratings?.[currentUser.name];
      const salaName = salasList.find((s) => s.id === c.salaId)?.name || "Sin sala";
      const dayLabel = DAY_NAMES_ES[c.day] ?? `Día ${c.day}`;

      return { ...c, spotIdx, attendance, rating, salaName, dayLabel };
    })
    .filter(Boolean) as (ClassItem & {
    spotIdx: number;
    attendance: "presente" | "ausente" | "pendiente";
    rating?: { stars: number; comment?: string };
    salaName: string;
    dayLabel: string;
  })[];

  const upcoming = myClasses.filter((c) => c.attendance === "pendiente");
  const past = myClasses.filter((c) => c.attendance === "presente" || c.attendance === "ausente");

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Test Apto Físico Status Selector (Demo Helper) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-secondary/30 rounded-3xl border border-border/80 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-muted-foreground">Demo Status Apto Médico:</span>
          <select
            value={studentAptoStatus}
            onChange={(e) => setStudentAptoStatus(e.target.value as any)}
            className="bg-background border border-border rounded-xl font-semibold text-primary outline-none px-3 py-1.5 text-xs cursor-pointer"
          >
            <option value="ok">🟢 Vigente (Permitido)</option>
            <option value="expired">🔴 Vencido (Bloqueo)</option>
            <option value="pending">🟡 Pendiente de Entrega (Bloqueo)</option>
          </select>
        </div>
        <span className="text-[10px] text-muted-foreground italic">
          Cambiá esto para probar la restricción de reservas de clases en la app del alumno
        </span>
      </div>

      {/* Live Occupancy Termómetro */}
      <div className="bg-card border border-border/80 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary animate-pulse animate-duration-1000" />
            <h3 className="font-bold text-sm text-foreground">
              Concurrencia en Vivo - Sede Belgrano
            </h3>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/ text-primary border border-primary/">
            🟢 Ocupación: 42% (Tranquilo)
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div className="bg-secondary/20 p-3 rounded-2xl border border-border/40">
            <div className="text-sm font-black text-foreground">21 / 50</div>
            <div className="text-[10px] text-muted-foreground font-semibold">Alumnos en Sala</div>
          </div>
          <div className="bg-secondary/20 p-3 rounded-2xl border border-border/40">
            <div className="text-sm font-black text-foreground">4 Racks Libres</div>
            <div className="text-[10px] text-muted-foreground font-semibold">Peso Libre</div>
          </div>
          <div className="bg-secondary/20 p-3 rounded-2xl border border-border/40">
            <div className="text-sm font-black text-foreground">8 Cintas Libres</div>
            <div className="text-[10px] text-muted-foreground font-semibold">Área de Cardio</div>
          </div>
          <div className="bg-secondary/20 p-3 rounded-2xl border border-border/40">
            <div className="text-sm font-black text-foreground">09:00 - 12:00</div>
            <div className="text-[10px] text-muted-foreground font-semibold">Hora Recomendada</div>
          </div>
        </div>

        {/* Hourly Heatmap */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-[9px] text-muted-foreground font-bold uppercase tracking-wider">
            <span>07:00</span>
            <span>10:00</span>
            <span>13:00</span>
            <span>16:00</span>
            <span>19:00</span>
            <span>22:00</span>
          </div>
          <div className="h-3 flex gap-1 rounded-full overflow-hidden bg-secondary/30 border border-border/30 p-0.5">
            <div className="flex-1 bg-primary rounded-sm" title="07:00 - 30%"></div>
            <div className="flex-1 bg-secondary rounded-sm" title="08:00 - 65%"></div>
            <div className="flex-1 bg-destructive rounded-sm" title="09:00 - 85%"></div>
            <div className="flex-1 bg-primary rounded-sm" title="10:00 - 40%"></div>
            <div className="flex-1 bg-primary rounded-sm" title="11:00 - 25%"></div>
            <div className="flex-1 bg-primary rounded-sm" title="12:00 - 20%"></div>
            <div className="flex-1 bg-primary rounded-sm" title="13:00 - 30%"></div>
            <div className="flex-1 bg-primary rounded-sm" title="14:00 - 25%"></div>
            <div className="flex-1 bg-primary rounded-sm" title="15:00 - 35%"></div>
            <div className="flex-1 bg-primary rounded-sm" title="16:00 - 45%"></div>
            <div className="flex-1 bg-secondary rounded-sm" title="17:00 - 70%"></div>
            <div className="flex-1 bg-destructive rounded-sm" title="18:00 - 90%"></div>
            <div className="flex-1 bg-destructive rounded-sm" title="19:00 - 95%"></div>
            <div className="flex-1 bg-secondary rounded-sm" title="20:00 - 75%"></div>
            <div className="flex-1 bg-primary rounded-sm" title="21:00 - 40%"></div>
            <div className="flex-1 bg-primary rounded-sm" title="22:00 - 15%"></div>
          </div>
          <div className="text-[10px] text-muted-foreground text-center italic mt-1">
            📊 Gráfico de ocupación promedio. El color rojo indica horarios pico de alta
            concurrencia.
          </div>
        </div>
      </div>

      {/* Overview Card */}
      <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-6 text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Dumbbell className="h-24 w-24 transform rotate-12" />
        </div>
        <div className="relative z-10">
          <h2 className="text-sm font-semibold opacity-90 tracking-wide uppercase">Plan Activo</h2>
          <div className="text-2xl font-black mt-1">Pase Libre Mensual</div>
          <div className="text-xs font-semibold opacity-80 mt-1">Vence el 20-Jul-2026</div>
          <div className="flex gap-4 mt-6">
            <div>
              <div className="text-[10px] font-bold uppercase opacity-80">Clases Restantes</div>
              <div className="text-xl font-bold">Ilimitado</div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase opacity-80">Asistencias</div>
              <div className="text-xl font-bold">
                {past.filter((c) => c.attendance === "presente").length} / {past.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" /> Mis Próximas Clases
          </h3>
          <span className="text-[10px] bg-secondary text-foreground px-2 py-1 rounded-lg font-bold">
            {upcoming.length} agendadas
          </span>
        </div>

        {upcoming.length === 0 ? (
          <div className="border border-dashed border-border/60 rounded-3xl p-8 text-center text-muted-foreground bg-secondary/10">
            <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
              <Calendar className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold">No tenés clases agendadas.</p>
            <p className="text-xs mt-1">¡Aprovechá a reservar tu lugar en la próxima clase!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((c) => {
              const state = checkinState[c.id] ?? "idle";
              return (
                <div
                  key={c.id}
                  className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-foreground text-sm">{c.name}</h4>
                      <p className="text-xs text-muted-foreground font-medium mt-0.5">
                        {c.dayLabel} · {c.time}
                      </p>
                    </div>
                    <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-1 rounded-lg">
                      {c.salaName}
                    </span>
                  </div>

                  {/* Geo Check-in */}
                  <div
                    className={`rounded-xl p-3 border text-xs space-y-2 ${
                      state === "success"
                        ? "bg-primary/ border-primary/"
                        : state === "far"
                          ? "bg-secondary/ border-border/"
                          : state === "error"
                            ? "bg-destructive/ border-destructive/"
                            : "bg-secondary/30 border-border/60"
                    }`}
                  >
                    {state === "idle" && (
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-muted-foreground font-medium">
                          Confirmá tu presencia desde el gimnasio
                        </span>
                        <Button
                          size="sm"
                          className="h-7 px-3 rounded-lg text-[10px] font-bold shrink-0"
                          onClick={() => handleGeoCheckin(c)}
                        >
                          📍 Check-in
                        </Button>
                      </div>
                    )}
                    {state === "loading" && (
                      <div className="flex items-center gap-2 text-muted-foreground font-semibold">
                        <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin shrink-0" />
                        Localizando... aguardá un momento
                      </div>
                    )}
                    {state === "success" && (
                      <div className="flex items-center gap-2 text-primary dark:text-primary font-bold">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />✅ Check-in confirmado —
                        Asistencia registrada
                      </div>
                    )}
                    {state === "far" && (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-secondary-foreground dark:text-secondary-foreground font-bold">
                          <MapPin className="w-4 h-4 shrink-0" />
                          Estás fuera del radio del gimnasio ({CHECKIN_RADIUS_M}m)
                        </div>
                        <p className="text-muted-foreground">
                          Acercate al gimnasio para poder hacer check-in.
                        </p>
                        <button
                          onClick={() => setCheckinState((prev) => ({ ...prev, [c.id]: "idle" }))}
                          className="text-[10px] underline text-muted-foreground"
                        >
                          Intentar de nuevo
                        </button>
                      </div>
                    )}
                    {state === "error" && (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-destructive font-bold">
                          <MapPin className="w-4 h-4 shrink-0" />
                          No se pudo obtener tu ubicación
                        </div>
                        <p className="text-muted-foreground">
                          Verificá que el GPS esté activado y que hayas dado permiso de ubicación.
                        </p>
                        <button
                          onClick={() => setCheckinState((prev) => ({ ...prev, [c.id]: "idle" }))}
                          className="text-[10px] underline text-muted-foreground"
                        >
                          Intentar de nuevo
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end pt-1 border-t border-border/40">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-[10px] rounded-lg border-destructive/ text-destructive hover:bg-destructive/ hover:text-destructive font-bold"
                      disabled={state === "success"}
                      onClick={() => {
                        if (confirm(`¿Estás seguro de cancelar tu reserva para ${c.name}?`)) {
                          setClassesList((prev) =>
                            prev.map((item) => {
                              if (item.id === c.id) {
                                const copySpots = { ...item.enrolledSpots };
                                delete copySpots[c.spotIdx];
                                const copyAtt = { ...item.attendance };
                                delete copyAtt[c.spotIdx];
                                return {
                                  ...item,
                                  enrolledSpots: copySpots,
                                  attendance: copyAtt,
                                  booked: Object.keys(copySpots).length,
                                };
                              }
                              return item;
                            }),
                          );
                        }
                      }}
                    >
                      Cancelar Reserva
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Button
          className="w-full rounded-2xl py-6 font-bold hover:scale-[1.02] transition-transform"
          onClick={() => {
            if (studentAptoStatus !== "ok") {
              setIsAptoDialogOpen(true);
            } else {
              alert(
                "🎉 Apto Médico válido. Abriendo la grilla horaria para agendar nuevas clases...",
              );
            }
          }}
        >
          <Plus className="h-5 w-5 mr-2" /> Reservar Nueva Clase
        </Button>
      </div>

      {/* Modal Apto Médico Requerido / Restricción */}
      <Dialog open={isAptoDialogOpen} onOpenChange={setIsAptoDialogOpen}>
        <DialogContent className="max-w-md rounded-3xl border border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center gap-2 text-destructive font-bold">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <span>Apto Físico Obligatorio</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-3 text-sm">
            <div className="p-4 rounded-2xl bg-destructive/ border border-destructive/ text-destructive text-xs leading-relaxed space-y-2">
              <p className="font-bold">
                De acuerdo con la normativa legal de salud y las políticas de seguridad de Studio
                Pulse Smart, no está permitido reservar nuevas clases sin un certificado médico
                vigente.
              </p>
              <p>
                Tu estado actual figura como:{" "}
                <strong className="uppercase underline font-black">
                  {studentAptoStatus === "expired" ? "Vencido" : "Pendiente de Entrega"}
                </strong>
                .
              </p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Para habilitar las reservas de clases y sala de musculación, por favor subí una foto o
              PDF de tu apto médico actualizado o presentalo en el mostrador de recepción.
            </p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setIsAptoDialogOpen(false)}
            >
              Entendido
            </Button>
            <Button
              className="rounded-xl font-bold bg-primary text-primary-foreground"
              onClick={() => {
                setIsAptoDialogOpen(false);
                alert(
                  "Simulación de subida de archivo: Has seleccionado y cargado tu certificado. Se ha enviado al personal de recepción para su validación.",
                );
                setStudentAptoStatus("ok");
              }}
            >
              Cargar Certificado
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-4 pt-4">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" /> Historial y Calificaciones
        </h3>

        {past.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4 bg-secondary/20 rounded-2xl">
            Aún no tenés historial de clases.
          </p>
        ) : (
          <div className="space-y-3">
            {past.map((c) => (
              <div
                key={c.id}
                className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-foreground text-sm">{c.name}</h4>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">
                      {c.dayLabel} · {c.time}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded-lg ${c.attendance === "presente" ? "bg-primary/ text-primary" : "bg-destructive/ text-destructive"}`}
                  >
                    {c.attendance === "presente" ? "Presente" : "Ausente"}
                  </span>
                </div>

                {c.attendance === "presente" && (
                  <div className="pt-3 border-t border-border/40 flex items-center justify-between">
                    <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Asistencia Confirmada
                    </span>
                    <span className="text-[11px] text-muted-foreground font-medium">Check-in realizado</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
