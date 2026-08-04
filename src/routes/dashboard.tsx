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
  Flame,
  Wheat,
  Droplet,
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
  FolderPlus,
  History,
  Truck,
  Send,
  ChevronDown,
  ChevronUp,
  Upload,
  QrCode,
  Printer,
  Filter,
  MoreVertical,
  Slash,
  UserCheck,
  UserX,
  Layers,
  Copy,
  Ticket,
  ShieldCheck,
  FileCheck,
  CalendarX,
  Sparkles,
  Grid,
  Save,
  Repeat,
  ChevronLeft,
  ChevronRight,
  Ban,
  Unlink,
  ExternalLink,
  Link2,
  ArrowRight,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";


export const Route = createFileRoute("/dashboard")({
  component: GymDashboard,
});

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
  { id: "ayuda", label: "Ayuda", icon: HelpCircle },
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
    email: "admin@shakerfy.com",
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
    { id: string; name: string; capacity?: number; branchId?: string; description?: string }[]
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
      isFeatured: true,
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
      supplierId: "sup-2",
      price: 2500,
      cost: 1200,
      stock: 48,
      minStock: 15,
      unit: "bot",
      barcode: "7791234567890",
      image: "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=150&auto=format&fit=crop&q=80",
      variants: [
        { id: "v1-1", name: "Sabor Manzana", stock: 24 },
        { id: "v1-2", name: "Sabor Naranja", stock: 24 },
      ],
    },
    {
      id: "inv-2",
      name: "Proteína Whey Protein Isolate 1kg",
      category: "Suplementos",
      supplierId: "sup-1",
      price: 38000,
      cost: 24000,
      stock: 8,
      minStock: 10,
      unit: "porc",
      barcode: "7798765432109",
      image: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=150&auto=format&fit=crop&q=80",
      variants: [
        { id: "v2-1", name: "Vainilla Cream", stock: 5 },
        { id: "v2-2", name: "Chocolate Double", stock: 3 },
      ],
    },
    {
      id: "inv-3",
      name: "Barra Proteica ENA Choco Crunch",
      category: "Snacks",
      supplierId: "sup-1",
      price: 3200,
      cost: 1600,
      stock: 65,
      minStock: 20,
      unit: "unid",
      barcode: "7795555444333",
      image: "https://images.unsplash.com/photo-1622484210800-88554284814e?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "inv-4",
      name: "Toalla Secado Rápido Shakerfy",
      category: "Indumentaria",
      supplierId: "sup-3",
      price: 14500,
      cost: 7000,
      stock: 14,
      minStock: 5,
      unit: "unid",
      barcode: "7790001000200",
      image: "https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=150&auto=format&fit=crop&q=80",
      variants: [
        { id: "v4-1", name: "Negro Matte", stock: 8 },
        { id: "v4-2", name: "Azul Cyan", stock: 6 },
      ],
    },
    {
      id: "inv-5",
      name: "Botella Shakerfy Pro 750ml",
      category: "Accesorios",
      supplierId: "sup-3",
      price: 9800,
      cost: 4500,
      stock: 22,
      minStock: 8,
      unit: "unid",
      barcode: "7799999888777",
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "inv-6",
      name: "Cintas de Suspensión Pro-Gym",
      category: "Accesorios",
      supplierId: "sup-3",
      price: 45000,
      cost: 28000,
      stock: 2,
      minStock: 4,
      unit: "unid",
      barcode: "7793333222111",
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=150&auto=format&fit=crop&q=80",
    },
  ]);

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

        {/* Staff Operations Checklist (Mejora 4) */}


        {activeTab === "asistencia" && (
          <AsistenciasTab
            blackoutDays={blackoutDays}
            membersList={membersList}
            classesList={classesList}
            setClassesList={setClassesList}
            currentUser={currentUser}
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
            cancellationPolicyHours={cancellationPolicyHours}
            currentUser={currentUser}
            membersList={membersList}
          />
        )}
        {activeTab === "reseñas" && (
          <ReseñasTab reviewsList={reviewsList as any} setReviewsList={setReviewsList as any} membersList={membersList} />
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
        {activeTab === "ayuda" && (
          <AyudaTab onNavigateTab={(tabId) => setActiveTab(tabId)} />
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

  const [cancelTxConfirm, setCancelTxConfirm] = useState<any | null>(null);

  const handleCancelTransaction = () => {
    if (!cancelTxConfirm) return;
    setCashTransactions((prev) =>
      prev.map((t) =>
        t.id === cancelTxConfirm.id
          ? {
              ...t,
              isCancelled: true,
              cancelledBy: currentUser?.name || "Recepción",
              cancelledAt: new Date().toISOString().split("T")[0],
            }
          : t,
      ),
    );
    toast.info(`Movimiento "${cancelTxConfirm.description}" ANULADO correctamente.`);
    setCancelTxConfirm(null);
  };

  // Cash in register calculations (excluding cancelled transactions)
  const totalIncome = cashTransactions
    .filter((t) => t.type === "income" && !t.isCancelled)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = cashTransactions
    .filter((t) => t.type === "expense" && !t.isCancelled)
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const totalCashIncome = cashTransactions
    .filter((t) => t.type === "income" && t.channel === "cash" && !t.isCancelled)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalCashExpense = cashTransactions
    .filter((t) => t.type === "expense" && t.channel === "cash" && !t.isCancelled)
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
                    <Label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                      Seleccionar Producto del Inventario:
                    </Label>
                    <Select
                      value={selectedProdId}
                      onValueChange={(val) => handleProductSelect(val, prodQuantity)}
                    >
                      <SelectTrigger className="w-full h-9 rounded-xl border border-border bg-background text-xs font-bold text-foreground">
                        <SelectValue placeholder="-- Seleccionar Artículo --" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {inventoryItems.map((prod) => (
                          <SelectItem key={prod.id} value={prod.id} disabled={prod.stock <= 0}>
                            {prod.name} (${prod.price.toLocaleString()}) - Stock: {prod.stock} {prod.unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                      Cantidad:
                    </Label>
                    <Input
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
                      className="h-9 rounded-xl border border-border bg-background text-xs font-bold text-foreground"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <Label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Tipo de Movimiento:
                  </Label>
                  <Select
                    value={txType}
                    onValueChange={(val: "income" | "expense") => setTxType(val)}
                  >
                    <SelectTrigger className="w-full h-9 rounded-xl border border-border bg-background text-xs font-bold text-foreground">
                      <SelectValue placeholder="Tipo de Movimiento" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="income">🟢 Ingreso (Cobro / Venta)</SelectItem>
                      <SelectItem value="expense">🔴 Egreso (Gasto Operativo)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  Canal de Pago:
                </Label>
                <Select
                  value={txChannel}
                  onValueChange={(val: "cash" | "app" | "transfer" | "split") => setTxChannel(val)}
                >
                  <SelectTrigger className="w-full h-9 rounded-xl border border-border bg-background text-xs font-bold text-foreground">
                    <SelectValue placeholder="Canal de Pago" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="cash">💵 Efectivo (Caja Chica)</SelectItem>
                    <SelectItem value="app">📱 MercadoPago / QR</SelectItem>
                    <SelectItem value="transfer">🏦 Transferencia Bancaria</SelectItem>
                    <SelectItem value="split">⚡ Pago Mixto (Efectivo + Digital)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {txChannel !== "split" && (
                <div>
                  <Label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Monto Total ($):
                  </Label>
                  <Input
                    type="number"
                    placeholder="Ej: 3500"
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    className="h-9 rounded-xl border border-border bg-background text-xs font-bold text-foreground"
                  />
                </div>
              )}

              <div>
                <Label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  Asociar Alumno (Opcional):
                </Label>
                <Select
                  value={selectedMemberId || "general"}
                  onValueChange={(val) => setSelectedMemberId(val === "general" ? "" : val)}
                >
                  <SelectTrigger className="w-full h-9 rounded-xl border border-border bg-background text-xs font-bold text-foreground">
                    <SelectValue placeholder="-- Cliente General / Venta Mostrador --" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="general">-- Cliente General / Venta Mostrador --</SelectItem>
                    {membersList.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name} ({m.plan})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Split Payment Fields */}
            {txChannel === "split" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-secondary/40 border border-border/70 rounded-xl">
                <div>
                  <Label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Monto en Efectivo ($):
                  </Label>
                  <Input
                    type="number"
                    placeholder="Ej: 2000"
                    value={splitCashAmount}
                    onChange={(e) => setSplitCashAmount(e.target.value)}
                    className="h-9 rounded-xl border border-border bg-background text-xs font-bold text-foreground"
                  />
                </div>
                <div>
                  <Label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Monto Digital ($):
                  </Label>
                  <Input
                    type="number"
                    placeholder="Ej: 3000"
                    value={splitDigitalAmount}
                    onChange={(e) => setSplitDigitalAmount(e.target.value)}
                    className="h-9 rounded-xl border border-border bg-background text-xs font-bold text-foreground"
                  />
                </div>
                <div>
                  <Label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Canal Pago Digital:
                  </Label>
                  <Select
                    value={splitDigitalChannel}
                    onValueChange={(val: "app" | "transfer") => setSplitDigitalChannel(val)}
                  >
                    <SelectTrigger className="w-full h-9 rounded-xl border border-border bg-background text-xs font-bold text-foreground">
                      <SelectValue placeholder="Canal Pago Digital" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="app">📱 MercadoPago / QR</SelectItem>
                      <SelectItem value="transfer">🏦 Transferencia Bancaria</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <Label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Descripción / Detalle de la Venta:
              </Label>
              <Input
                type="text"
                placeholder="Ej: Pase Diario Musculación o Venta suplemento"
                value={txDesc}
                onChange={(e) => setTxDesc(e.target.value)}
                className="h-9 rounded-xl border border-border bg-background text-xs font-bold text-foreground"
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
                <Input
                  type="text"
                  placeholder="Buscar por concepto o usuario..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-full pl-8 pr-3 rounded-xl border border-border bg-background text-xs font-bold text-foreground placeholder:font-normal placeholder:text-muted-foreground"
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

          <div className="overflow-x-auto custom-scrollbar border border-border/60 rounded-2xl bg-background">
            <table className="w-full text-left text-xs min-w-[500px] border-collapse">
              <thead>
                <tr className="border-b border-border/60 bg-secondary/40 text-muted-foreground font-bold text-[10px] uppercase">
                  <th className="p-3">Fecha</th>
                  <th className="p-3">Concepto</th>
                  <th className="p-3">Canal</th>
                  <th className="p-3">Registrado por</th>
                  <th className="p-3 text-right">Monto</th>
                  <th className="p-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredTx.map((tx) => (
                  <tr
                    key={tx.id}
                    className={`hover:bg-secondary/20 transition-colors ${
                      tx.isCancelled ? "opacity-50 bg-destructive/5" : ""
                    }`}
                  >
                    <td className="p-3 text-muted-foreground font-mono text-[11px]">{tx.date}</td>
                    <td className="p-3 font-bold text-foreground">
                      <span className={tx.isCancelled ? "line-through text-muted-foreground" : ""}>
                        {tx.description}
                      </span>
                      {tx.isCancelled && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[9.5px] font-bold bg-destructive/10 text-destructive border border-destructive/20">
                          🚫 ANULADO ({tx.cancelledBy})
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full border bg-secondary text-foreground uppercase">
                        {tx.channel}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground text-xs">{tx.registeredBy}</td>
                    <td
                      className={`p-3 text-right font-black text-sm ${
                        tx.isCancelled
                          ? "line-through text-muted-foreground"
                          : tx.type === "income"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {tx.type === "income" ? "+" : "-"}${tx.amount.toLocaleString()}
                    </td>
                    <td className="p-3 text-right">
                      {!tx.isCancelled ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 text-[10.5px] font-bold text-rose-600 border-rose-500/30 hover:bg-rose-500/10 rounded-lg px-2.5"
                          onClick={() => setCancelTxConfirm(tx)}
                        >
                          <Ban className="h-3 w-3 mr-1" /> Anular
                        </Button>
                      ) : (
                        <span className="text-[10px] text-muted-foreground italic font-semibold">Anulado</span>
                      )}
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
                <Label className="text-xs font-bold text-muted-foreground uppercase block">
                  Efectivo Físico Contado en Cajón ($):
                </Label>
                <Input
                  type="number"
                  placeholder={`Ej: ${expectedCashInDrawer}`}
                  value={countedCash}
                  onChange={(e) => setCountedCash(e.target.value)}
                  className="w-full h-10 rounded-xl border border-border bg-background text-sm font-bold text-foreground"
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

      {/* Modal AlertDialog para Confirmar Anulación de Movimiento */}
      <AlertDialog open={!!cancelTxConfirm} onOpenChange={(open) => !open && setCancelTxConfirm(null)}>
        <AlertDialogContent className="rounded-3xl border-border shadow-2xl bg-card max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-black text-foreground flex items-center gap-2">
              <Ban className="h-5 w-5 text-rose-500" /> Anular Movimiento de Caja
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground pt-1 space-y-2">
              <span>
                ¿Confirmás la anulación del movimiento <strong className="text-foreground">{cancelTxConfirm?.description}</strong> por el monto de <strong className="text-foreground">${cancelTxConfirm?.amount?.toLocaleString()}</strong>?
              </span>
              <div className="p-3 bg-secondary/30 border border-border/60 rounded-2xl text-foreground font-medium text-[11px] leading-relaxed mt-2">
                ℹ️ <strong>Auditoría Contable:</strong> El movimiento quedará marcado como <strong>ANULADO</strong> en el historial y su monto se descontará automáticamente de los totales del turno sin borrar el registro.
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2">
            <AlertDialogCancel className="rounded-xl font-bold">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl font-bold bg-rose-600 text-white hover:bg-rose-700"
              onClick={handleCancelTransaction}
            >
              Confirmar Anulación
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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

  const availablePeriods = useMemo(() => {
    const monthsEs = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonthIdx = now.getMonth();

    const generated: string[] = [];
    for (let i = 0; i < 6; i++) {
      let mIdx = currentMonthIdx - i;
      let y = currentYear;
      if (mIdx < 0) {
        mIdx += 12;
        y -= 1;
      }
      generated.push(`${monthsEs[mIdx]} ${y}`);
    }

    const set = new Set([...payrollRecords.map((p) => p.period), ...generated]);
    return Array.from(set);
  }, [payrollRecords]);

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
            <Input
              type="text"
              placeholder="Buscar coach por nombre o especialidad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full pl-8 pr-3 rounded-xl border border-border bg-background text-xs font-bold text-foreground placeholder:font-normal placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* Status Filter (Shadcn/ui Select) */}
            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val as any)}>
              <SelectTrigger className="w-[200px] h-9 rounded-xl border border-border bg-background text-xs font-bold text-foreground">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border border-border bg-popover text-popover-foreground">
                <SelectItem value="all">📋 Todos los Estados</SelectItem>
                <SelectItem value="pending">⏳ Pendientes de Pago</SelectItem>
                <SelectItem value="paid">✅ Acreditados / Pagados</SelectItem>
              </SelectContent>
            </Select>

            {/* Period Selector (Shadcn/ui Select - Dynamic) */}
            <Select value={selectedPeriod} onValueChange={(val) => setSelectedPeriod(val)}>
              <SelectTrigger className="w-[185px] h-9 rounded-xl border border-border bg-background text-xs font-bold text-foreground">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border border-border bg-popover text-popover-foreground">
                <SelectItem value="all">📅 Todos los Períodos</SelectItem>
                {availablePeriods.map((period) => (
                  <SelectItem key={period} value={period}>
                    📅 {period}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar border border-border/60 rounded-2xl bg-background">
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
                  <Input
                    type="text"
                    placeholder="Ej: Impuestos Municipales"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="sm:col-span-4 h-8.5 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground"
                  />
                  <Input
                    type="number"
                    placeholder="Monto ($)"
                    value={newCatAmount}
                    onChange={(e) => setNewCatAmount(e.target.value)}
                    className="sm:col-span-2 h-8.5 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground"
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
                      <Input
                        type="text"
                        value={item.category}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTempItems((prev) =>
                            prev.map((i) => (i.id === item.id ? { ...i, category: val } : i)),
                          );
                        }}
                        className="flex-1 h-8 rounded-lg border border-transparent hover:border-border bg-transparent px-2 text-xs font-bold text-foreground focus-visible:bg-secondary/30"
                      />
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground font-bold">$</span>
                        <Input
                          type="number"
                          value={item.amount}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setTempItems((prev) =>
                              prev.map((i) => (i.id === item.id ? { ...i, amount: val } : i)),
                            );
                          }}
                          className="w-24 h-8 rounded-lg border border-border/80 bg-background px-2 text-xs font-bold text-foreground text-right"
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
              <SelectTrigger className="w-[180px] h-9 rounded-xl border border-border bg-background text-xs font-bold text-foreground">
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
              <SelectTrigger className="w-[185px] h-9 rounded-xl border border-border bg-background text-xs font-bold text-foreground">
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
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-sky-500 inline-block" />
                      MercadoPago / Tarjetas de Crédito y Débito
                    </span>
                    <span className="text-sky-600 dark:text-sky-400 font-black">{paymentStats.mpPercent}% (${paymentStats.mpAmount.toLocaleString("es-AR")})</span>
                  </div>
                  <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-sky-500 rounded-full transition-all duration-500" style={{ width: `${paymentStats.mpPercent}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 inline-block" />
                      Transferencias Bancarias (CBU / CVU)
                    </span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-black">{paymentStats.transfPercent}% (${paymentStats.transfAmount.toLocaleString("es-AR")})</span>
                  </div>
                  <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${paymentStats.transfPercent}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-500 inline-block" />
                      Efectivo en Recepción
                    </span>
                    <span className="text-amber-600 dark:text-amber-400 font-black">{paymentStats.cashPercent}% (${paymentStats.cashAmount.toLocaleString("es-AR")})</span>
                  </div>
                  <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${paymentStats.cashPercent}%` }} />
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
                    <div
                      key={plan.id}
                      className={`p-3 rounded-2xl flex items-center justify-between transition-all ${
                        plan.isFeatured
                          ? "bg-primary/10 border-2 border-primary/40 shadow-xs"
                          : "bg-secondary/30 border border-border/60"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs block">{plan.name}</span>
                          {plan.isFeatured && (
                            <span className="text-[9.5px] font-black bg-amber-500/20 text-amber-600 border border-amber-500/30 px-1.5 py-0.2 rounded-md">
                              ★ Más Elegido
                            </span>
                          )}
                        </div>
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
  stockMovements: externalStockMovements,
  setStockMovements: externalSetStockMovements,
}: {
  inventoryItems: any[];
  setInventoryItems: React.Dispatch<React.SetStateAction<any[]>>;
  stockMovements?: any[];
  setStockMovements?: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  const [activeSubTab, setActiveSubTab] = useState<"products" | "kardex">("products");

  // Dynamic Categories State
  const [categories, setCategories] = useState<string[]>([
    "Suplementos",
    "Bebidas",
    "Accesorios",
    "Indumentaria",
    "Snacks",
  ]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Local fallback state for stock movements (if not provided externally)
  const [internalMovements, setInternalMovements] = useState<Array<{
    id: string;
    date: string;
    productId: string;
    productName: string;
    type: "Entrada" | "Salida / Venta" | "Ajuste Manual" | "Merma / Pérdida";
    quantity: number;
    previousStock: number;
    newStock: number;
    user: string;
    reason: string;
  }>>([
    {
      id: "mov-1",
      date: "30/07/2026 10:15",
      productId: "inv-1",
      productName: "Bebida Isotónica Gatorade 500ml",
      type: "Entrada",
      quantity: 50,
      previousStock: 0,
      newStock: 50,
      user: "Recepción Admin",
      reason: "Reabastecimiento de proveedor",
    },
    {
      id: "mov-2",
      date: "30/07/2026 11:02",
      productId: "inv-1",
      productName: "Bebida Isotónica Gatorade 500ml",
      type: "Salida / Venta",
      quantity: -2,
      previousStock: 50,
      newStock: 48,
      user: "Caja POS",
      reason: "Venta directa mostrador #1092",
    },
    {
      id: "mov-3",
      date: "29/07/2026 16:30",
      productId: "inv-2",
      productName: "Proteína Whey Protein Isolate 1kg",
      type: "Ajuste Manual",
      quantity: -1,
      previousStock: 9,
      newStock: 8,
      user: "Carlos M. (Entrenador)",
      reason: "Muestra gratis para degustación",
    },
    {
      id: "mov-4",
      date: "28/07/2026 09:00",
      productId: "inv-3",
      productName: "Barra Proteica ENA Choco Crunch",
      type: "Entrada",
      quantity: 65,
      previousStock: 0,
      newStock: 65,
      user: "Recepción Admin",
      reason: "Alta de inventario inicial",
    },
  ]);

  const stockMovements = externalStockMovements || internalMovements;
  const setStockMovements = externalSetStockMovements || setInternalMovements;

  // Kardex Search & Filters (Pre-load current month range by default)
  const defaultKardexDates = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();
    const formattedLastDay = String(lastDay).padStart(2, "0");
    return {
      from: `${year}-${month}-01`,
      to: `${year}-${month}-${formattedLastDay}`,
    };
  }, []);

  const [kardexSearch, setKardexSearch] = useState("");
  const [kardexTypeFilter, setKardexTypeFilter] = useState("all");
  const [kardexDateFrom, setKardexDateFrom] = useState(defaultKardexDates.from);
  const [kardexDateTo, setKardexDateTo] = useState(defaultKardexDates.to);

  const [showAdjustModal, setShowAdjustModal] = useState<any | null>(null);
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustReason, setAdjustReason] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [supplierFilter, setSupplierFilter] = useState("all");
  const [stockStatusFilter, setStockStatusFilter] = useState("all");
  const [previewImageModal, setPreviewImageModal] = useState<{ url: string; title: string } | null>(null);
  const [deleteConfirmState, setDeleteConfirmState] = useState<{
    type: "category" | "supplier" | "product";
    id: string;
    name: string;
  } | null>(null);
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

  // Suppliers State
  const [suppliersList, setSuppliersList] = useState<Array<{
    id: string;
    name: string;
    contactName: string;
    phone: string;
    email: string;
    category: string;
  }>>([
    {
      id: "sup-1",
      name: "Nutritech Argentina S.A.",
      contactName: "Laura Fernández",
      phone: "+5491155554321",
      email: "pedidos@nutritech.com.ar",
      category: "Suplementos & Nutrición",
    },
    {
      id: "sup-2",
      name: "Distribuidora Bebidas Express",
      contactName: "Mariano Gómez",
      phone: "+5491144448888",
      email: "ventas@bebidasexpress.com",
      category: "Bebidas & Hidratación",
    },
    {
      id: "sup-3",
      name: "Shakerfy Merch & Textile Direct",
      contactName: "Federico Rossi",
      phone: "+5491133332222",
      email: "merch@shakerfy.com",
      category: "Indumentaria & Accesorios",
    },
  ]);

  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [newSupName, setNewSupName] = useState("");
  const [newSupContact, setNewSupContact] = useState("");
  const [newSupPhone, setNewSupPhone] = useState("");
  const [newSupEmail, setNewSupEmail] = useState("");
  const [newSupCategory, setNewSupCategory] = useState("Suplementos & Nutrición");

  // Replenishment Order Generator State
  const [showReplenishModal, setShowReplenishModal] = useState(false);
  const [replenishOrderItems, setReplenishOrderItems] = useState<Array<{
    id: string;
    name: string;
    category: string;
    stock: number;
    minStock: number;
    orderQty: number;
    supplierId?: string;
    cost: number;
  }>>([]);

  // Product Variants & Supplier Form State
  const [expandedProductVariants, setExpandedProductVariants] = useState<Record<string, boolean>>({});
  const [newProdVariantsInput, setNewProdVariantsInput] = useState("");
  const [newProdSupplierId, setNewProdSupplierId] = useState("sup-1");
  const [editProdSupplierId, setEditProdSupplierId] = useState("sup-1");

  const openReplenishModal = () => {
    const lowStockProds = inventoryItems.filter((i) => i.stock <= i.minStock);
    if (lowStockProds.length === 0) {
      toast.info("No hay productos actualmente por debajo del stock mínimo.");
      return;
    }
    const orderItems = lowStockProds.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      stock: p.stock,
      minStock: p.minStock,
      orderQty: Math.max(1, (p.minStock * 2) - p.stock),
      supplierId: p.supplierId || "sup-1",
      cost: p.cost || 0,
    }));
    setReplenishOrderItems(orderItems);
    setShowReplenishModal(true);
  };

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupName.trim()) return;
    const newSup = {
      id: `sup-${Date.now()}`,
      name: newSupName.trim(),
      contactName: newSupContact.trim() || "Contacto",
      phone: newSupPhone.trim(),
      email: newSupEmail.trim(),
      category: newSupCategory,
    };
    setSuppliersList((prev) => [...prev, newSup]);
    setNewSupName("");
    setNewSupContact("");
    setNewSupPhone("");
    setNewSupEmail("");
    toast.success(`✓ Proveedor "${newSup.name}" agregado correctamente.`);
  };

  const handleDeleteSupplier = (supId: string) => {
    if (suppliersList.length <= 1) {
      toast.error("Debe existir al menos un proveedor registrado.");
      return;
    }
    setSuppliersList((prev) => prev.filter((s) => s.id !== supId));
    toast.info("Proveedor eliminado.");
  };

  const sendOrderViaWhatsApp = (supplierId?: string) => {
    const targetSup = suppliersList.find((s) => s.id === supplierId) || suppliersList[0];
    const itemsForSup = supplierId
      ? replenishOrderItems.filter((i) => i.supplierId === supplierId)
      : replenishOrderItems;

    if (itemsForSup.length === 0) {
      toast.warning("No hay productos asignados a este proveedor en el pedido.");
      return;
    }

    const itemLines = itemsForSup
      .map((i) => `• ${i.name}: ${i.orderQty} unid. (Stock actual: ${i.stock})`)
      .join("\n");

    const message = `Hola ${targetSup.contactName || targetSup.name}!\nTe envío la Orden de Reabastecimiento para Shakerfy Gym:\n\n${itemLines}\n\nPor favor confirmar recepción y plazo estimado de entrega. ¡Gracias!`;

    const encodedMsg = encodeURIComponent(message);
    const cleanPhone = (targetSup.phone || "").replace(/[^\d+]/g, "");
    window.open(`https://wa.me/${cleanPhone}?text=${encodedMsg}`, "_blank");
    toast.success(`✓ Pedido generado y listo para enviar vía WhatsApp.`);
  };

  const exportReplenishOrderCSV = () => {
    if (replenishOrderItems.length === 0) {
      toast.warning("No hay ítems en la orden.");
      return;
    }
    const headers = ["Producto", "Categoría", "Stock Actual", "Stock Mínimo", "Cantidad a Pedir", "Proveedor", "Costo Unid ($)", "Subtotal Estimado ($)"];
    const rows = replenishOrderItems.map((i) => {
      const sup = suppliersList.find((s) => s.id === i.supplierId);
      return [
        `"${i.name.replace(/"/g, '""')}"`,
        `"${i.category.replace(/"/g, '""')}"`,
        i.stock,
        i.minStock,
        i.orderQty,
        `"${(sup?.name || "Sin Proveedor").replace(/"/g, '""')}"`,
        i.cost,
        i.orderQty * i.cost,
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `orden_reabastecimiento_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("✓ Orden de reabastecimiento exportada a CSV.");
  };

  const toggleVariantExpand = (productId: string) => {
    setExpandedProductVariants((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  const handleAdjustVariantStock = (productId: string, variantId: string, delta: number) => {
    setInventoryItems((prev) =>
      prev.map((item) => {
        if (item.id !== productId) return item;
        const updatedVariants = (item.variants || []).map((v: any) =>
          v.id === variantId ? { ...v, stock: Math.max(0, v.stock + delta) } : v,
        );
        const newTotalStock = updatedVariants.reduce((sum: number, v: any) => sum + v.stock, 0);
        return {
          ...item,
          variants: updatedVariants,
          stock: newTotalStock,
        };
      }),
    );
    toast.success("✓ Stock de variante actualizado.");
  };

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
      const matchSupplier = supplierFilter === "all" || item.supplierId === supplierFilter;
      const matchStatus =
        stockStatusFilter === "all"
          ? true
          : stockStatusFilter === "low"
          ? item.stock <= item.minStock
          : item.stock > item.minStock;
      return matchSearch && matchCat && matchSupplier && matchStatus;
    });
  }, [inventoryItems, searchQuery, categoryFilter, supplierFilter, stockStatusFilter]);

  const filteredMovements = useMemo(() => {
    return stockMovements.filter((m: any) => {
      const q = kardexSearch.toLowerCase();
      const matchSearch =
        m.productName.toLowerCase().includes(q) ||
        m.reason.toLowerCase().includes(q) ||
        m.user.toLowerCase().includes(q);
      const matchType = kardexTypeFilter === "all" || m.type === kardexTypeFilter;

      let matchDate = true;
      if (kardexDateFrom || kardexDateTo) {
        const parts = m.date.split(" ");
        if (parts[0]) {
          const [d, mo, y] = parts[0].split("/").map(Number);
          const movTime = new Date(y, mo - 1, d).getTime();
          if (kardexDateFrom) {
            const fromTime = new Date(kardexDateFrom).getTime();
            if (movTime < fromTime) matchDate = false;
          }
          if (kardexDateTo) {
            const toTime = new Date(kardexDateTo).getTime();
            if (movTime > toTime) matchDate = false;
          }
        }
      }

      return matchSearch && matchType && matchDate;
    });
  }, [stockMovements, kardexSearch, kardexTypeFilter, kardexDateFrom, kardexDateTo]);

  const logStockMovement = (
    productId: string,
    productName: string,
    type: "Entrada" | "Salida / Venta" | "Ajuste Manual" | "Merma / Pérdida",
    quantity: number,
    previousStock: number,
    newStock: number,
    reason: string
  ) => {
    const now = new Date();
    const dateFormatted = `${now.toLocaleDateString("es-AR")} ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    const newMov = {
      id: `mov-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      date: dateFormatted,
      productId,
      productName,
      type,
      quantity,
      previousStock,
      newStock,
      user: "Recepción Admin",
      reason,
    };
    setStockMovements((prev: any[]) => [newMov, ...prev]);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      toast.error("Esta categoría ya existe.");
      return;
    }
    setCategories((prev) => [...prev, trimmed]);
    setNewCategoryName("");
    toast.success(`✓ Categoría "${trimmed}" agregada exitosamente.`);
  };

  const handleDeleteCategory = (catToDelete: string) => {
    if (categories.length <= 1) {
      toast.error("Debe existir al menos una categoría.");
      return;
    }
    setCategories((prev) => prev.filter((c) => c !== catToDelete));
    if (categoryFilter === catToDelete) setCategoryFilter("all");
    toast.info(`Categoría "${catToDelete}" eliminada.`);
  };

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
        toast.success("Foto cargada exitosamente.");
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

  const exportKardexCSV = () => {
    if (filteredMovements.length === 0) {
      toast.warning("No hay movimientos para exportar.");
      return;
    }
    const headers = ["Fecha / Hora", "ID Producto", "Producto", "Tipo Movimiento", "Cantidad", "Stock Anterior", "Stock Nuevo", "Usuario Responsable", "Motivo / Detalle"];
    const rows = filteredMovements.map((m: any) => [
      `"${m.date}"`,
      `"${m.productId}"`,
      `"${m.productName.replace(/"/g, '""')}"`,
      `"${m.type}"`,
      m.quantity,
      m.previousStock,
      m.newStock,
      `"${m.user.replace(/"/g, '""')}"`,
      `"${m.reason.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `kardex_movimientos_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("✓ Kardex exportado a CSV correctamente.");
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice || parseFloat(newProdPrice) <= 0) {
      toast.error("Ingresa un nombre de producto y un precio de venta válido.");
      return;
    }

    const initStock = parseInt(newProdStock) || 0;
    const rawVariantNames = newProdVariantsInput.split(",").map((v) => v.trim()).filter(Boolean);
    const parsedVariants = rawVariantNames.length > 0
      ? rawVariantNames.map((name, idx) => ({
          id: `v-${Date.now()}-${idx}`,
          name,
          stock: Math.floor(initStock / rawVariantNames.length),
        }))
      : undefined;

    const newItem = {
      id: `prod-${Date.now()}`,
      name: newProdName.trim(),
      category: newProdCat || categories[0],
      supplierId: newProdSupplierId,
      cost: parseFloat(newProdCost) || 0,
      price: parseFloat(newProdPrice) || 0,
      stock: initStock,
      minStock: parseInt(newProdMinStock) || 5,
      unit: newProdUnit || "unid",
      barcode: newProdBarcode.trim() || `779${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      image: newProdImage.trim() || "https://images.unsplash.com/photo-1544816155-12df9643f363?w=150&auto=format&fit=crop&q=80",
      variants: parsedVariants,
    };

    setInventoryItems((prev) => [newItem, ...prev]);

    if (initStock > 0) {
      logStockMovement(newItem.id, newItem.name, "Entrada", initStock, 0, initStock, "Alta inicial de producto");
    }

    setShowAddModal(false);
    setNewProdName("");
    setNewProdCost("");
    setNewProdPrice("");
    setNewProdStock("");
    setNewProdBarcode("");
    setNewProdImage("");
    setNewProdVariantsInput("");
    toast.success(`✓ "${newItem.name}" agregado exitosamente al inventario.`);
  };

  const handleOpenEditModal = (item: any) => {
    setShowEditModal(item);
    setEditProdName(item.name || "");
    setEditProdCat(item.category || categories[0]);
    setEditProdSupplierId(item.supplierId || suppliersList[0]?.id || "sup-1");
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
              supplierId: editProdSupplierId,
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

  const handleConfirmDelete = () => {
    if (!deleteConfirmState) return;
    const { type, id, name } = deleteConfirmState;

    if (type === "category") {
      if (categories.length <= 1) {
        toast.error("Debe existir al menos una categoría.");
      } else {
        setCategories((prev) => prev.filter((c) => c !== id));
        if (categoryFilter === id) setCategoryFilter("all");
        toast.info(`Categoría "${name}" eliminada.`);
      }
    } else if (type === "supplier") {
      setSuppliersList((prev) => prev.filter((s) => s.id !== id));
      toast.info(`Proveedor "${name}" eliminado.`);
    } else if (type === "product") {
      setInventoryItems((prev) => prev.filter((i) => i.id !== id));
      toast.info(`Producto "${name}" eliminado del inventario.`);
    }

    setDeleteConfirmState(null);
  };

  return (
    <div className="space-y-6 animate-fade-in text-foreground">
      {/* Subtab navigation & Category management bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 bg-card border border-border/80 p-3 rounded-3xl shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5 bg-secondary/50 p-1 rounded-2xl border border-border/50">
          <button
            type="button"
            onClick={() => setActiveSubTab("products")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === "products"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Stock de Productos ({inventoryItems.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("kardex")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === "kardex"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <History className="h-3.5 w-3.5 text-primary" /> Historial Kardex ({stockMovements.length})
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {lowStockCount > 0 && (
            <Button
              type="button"
              size="sm"
              onClick={openReplenishModal}
              className="h-9 text-xs font-bold rounded-xl gap-1.5 bg-amber-500 hover:bg-amber-600 text-white shadow-xs"
            >
              <Truck className="h-4 w-4" /> Reabastecer ({lowStockCount})
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowSupplierModal(true)}
            className="h-9 text-xs font-bold rounded-xl border-border gap-1.5 hover:bg-secondary"
          >
            <Building2 className="h-4 w-4 text-primary" /> Proveedores ({suppliersList.length})
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowCategoryModal(true)}
            className="h-9 text-xs font-bold rounded-xl border-border gap-1.5 hover:bg-secondary"
          >
            <FolderPlus className="h-4 w-4 text-primary" /> Categorías ({categories.length})
          </Button>
        </div>
      </div>

      {/* Inventory Summary Cards */}
      {activeSubTab === "products" ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-card border border-border/80 p-5 rounded-3xl space-y-1 shadow-xs transition-all hover:-translate-y-1 hover:shadow-lg">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
              Total Productos Registrados
            </span>
            <div className="text-2xl font-black text-foreground">{inventoryItems.length} artículos</div>
            <p className="text-[10.5px] text-muted-foreground">Bebidas, suplementos y merchandising</p>
          </div>

          <div className="bg-card border border-border/80 p-5 rounded-3xl space-y-1 shadow-xs transition-all hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                Alertas de Bajo Stock
              </span>
              <div className={`text-2xl font-black ${lowStockCount > 0 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600"}`}>
                {lowStockCount} {lowStockCount === 1 ? "artículo" : "artículos"}
              </div>
            </div>
            {lowStockCount > 0 ? (
              <button
                type="button"
                onClick={openReplenishModal}
                className="mt-2 text-[10.5px] font-extrabold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
              >
                <Truck className="h-3 w-3" /> Generar Pedido de Reabastecimiento →
              </button>
            ) : (
              <p className="text-[10.5px] text-muted-foreground">Por debajo del stock mínimo</p>
            )}
          </div>

          <div className="bg-card border border-border/80 p-5 rounded-3xl space-y-1 shadow-xs transition-all hover:-translate-y-1 hover:shadow-lg">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
              Valor de Inventario (Precio Venta)
            </span>
            <div className="text-2xl font-black text-primary">${totalValue.toLocaleString()}</div>
            <p className="text-[10.5px] text-muted-foreground">Mercadería en depósito/mostrador</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-card border border-border/80 p-5 rounded-3xl space-y-1 shadow-xs transition-all hover:-translate-y-1 hover:shadow-lg">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
              Total Movimientos Registrados
            </span>
            <div className="text-2xl font-black text-foreground">{stockMovements.length} eventos</div>
            <p className="text-[10.5px] text-muted-foreground">Auditoría completa de existencias</p>
          </div>

          <div className="bg-card border border-border/80 p-5 rounded-3xl space-y-1 shadow-xs transition-all hover:-translate-y-1 hover:shadow-lg">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
              Ingresos de Stock
            </span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {stockMovements.filter((m: any) => m.type === "Entrada").length} ingresos
            </div>
            <p className="text-[10.5px] text-muted-foreground">Reabastecimiento y altas</p>
          </div>

          <div className="bg-card border border-border/80 p-5 rounded-3xl space-y-1 shadow-xs transition-all hover:-translate-y-1 hover:shadow-lg">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
              Salidas & Ventas POS
            </span>
            <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
              {stockMovements.filter((m: any) => m.type === "Salida / Venta" || m.type === "Merma / Pérdida").length} salidas
            </div>
            <p className="text-[10.5px] text-muted-foreground">Ventas mostrador y mermas</p>
          </div>
        </div>
      )}

      {/* Main View: Products Table vs Kardex Audit Table */}
      {activeSubTab === "products" ? (
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

          {/* Row 2: Advanced Search & Multi-Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-secondary/20 border border-border/50 rounded-2xl">
            <div className="relative flex-1 min-w-[200px] sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por nombre, categoría o código..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-full pl-8 pr-3 rounded-xl border border-border bg-background text-xs font-bold text-foreground placeholder:font-normal placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <Select value={categoryFilter} onValueChange={(val) => setCategoryFilter(val)}>
                <SelectTrigger className="w-full sm:w-[170px] h-9 rounded-xl border border-border bg-background text-xs font-bold text-foreground">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-border bg-popover text-popover-foreground">
                  <SelectItem value="all">Todas las Categorías</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={supplierFilter} onValueChange={(val) => setSupplierFilter(val)}>
                <SelectTrigger className="w-full sm:w-[215px] h-9 rounded-xl border border-border bg-background text-xs font-bold text-foreground">
                  <SelectValue placeholder="Proveedor" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-border bg-popover text-popover-foreground">
                  <SelectItem value="all">Todos los Proveedores</SelectItem>
                  {suppliersList.map((sup) => (
                    <SelectItem key={sup.id} value={sup.id}>
                      {sup.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={stockStatusFilter} onValueChange={(val) => setStockStatusFilter(val)}>
                <SelectTrigger className="w-full sm:w-[160px] h-9 rounded-xl border border-border bg-background text-xs font-bold text-foreground">
                  <SelectValue placeholder="Estado Stock" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-border bg-popover text-popover-foreground">
                  <SelectItem value="all">Todos los Estados</SelectItem>
                  <SelectItem value="low">⚠️ Bajo Stock</SelectItem>
                  <SelectItem value="ok">✅ Stock Normal</SelectItem>
                </SelectContent>
              </Select>

              {(searchQuery || categoryFilter !== "all" || supplierFilter !== "all" || stockStatusFilter !== "all") && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setCategoryFilter("all");
                    setSupplierFilter("all");
                    setStockStatusFilter("all");
                  }}
                  className="h-9 text-[11px] font-bold text-muted-foreground hover:text-rose-600 rounded-xl"
                >
                  Limpiar Filtros
                </Button>
              )}
            </div>
          </div>

          {/* Table list */}
          <div className="overflow-x-auto custom-scrollbar border border-border/60 rounded-2xl bg-background">
            <table className="w-full text-left text-xs min-w-[1150px] border-collapse">
              <thead>
                <tr className="border-b border-border/60 bg-secondary/40 text-muted-foreground/80 font-bold text-[11px] uppercase tracking-wider">
                  <th className="p-3.5 w-14 text-center">Imagen</th>
                  <th className="p-3.5">Producto</th>
                  <th className="p-3.5">Código de Barras</th>
                  <th className="p-3.5">Categoría</th>
                  <th className="p-3.5">Proveedor</th>
                  <th className="p-3.5 text-right">Precio Costo</th>
                  <th className="p-3.5 text-right">Precio Venta</th>
                  <th className="p-3.5 text-center">Stock Actual</th>
                  <th className="p-3.5 text-center">Stock Mínimo</th>
                  <th className="p-3.5 text-center">Estado</th>
                  <th className="p-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredItems.map((item) => {
                  const isLow = item.stock <= item.minStock;
                  const hasVariants = item.variants && item.variants.length > 0;
                  const isExpanded = !!expandedProductVariants[item.id];
                  const supplier = suppliersList.find((s) => s.id === item.supplierId);

                  return (
                    <Fragment key={item.id}>
                      <tr className="hover:bg-secondary/20 transition-colors">
                        <td className="p-3.5 text-center">
                          {item.image ? (
                            <button
                              type="button"
                              onClick={() => setPreviewImageModal({ url: item.image, title: item.name })}
                              className="group relative inline-block cursor-pointer focus:outline-none"
                              title="Clic para ampliar imagen"
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-10 h-10 rounded-xl object-cover border border-border mx-auto shrink-0 shadow-2xs group-hover:scale-105 group-hover:ring-2 group-hover:ring-primary/50 transition-all"
                              />
                              <div className="absolute inset-0 bg-black/20 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <Eye className="w-3.5 h-3.5 text-white" />
                              </div>
                            </button>
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center text-muted-foreground font-bold text-xs mx-auto">
                              📦
                            </div>
                          )}
                        </td>
                        <td className="p-3.5 font-bold text-foreground">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-foreground">{item.name}</span>
                            {hasVariants && (
                              <button
                                type="button"
                                onClick={() => toggleVariantExpand(item.id)}
                                className="px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-extrabold flex items-center gap-0.5 hover:bg-primary/20 transition shrink-0"
                              >
                                {item.variants.length} variantes
                                {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="p-3.5 font-mono text-xs text-muted-foreground">
                          {item.barcode ? (
                            <div className="inline-flex items-center gap-1 bg-secondary/40 px-2 py-1 rounded-lg border border-border/50 text-[11px]">
                              <QrCode className="h-3 w-3 text-muted-foreground/80 shrink-0" />
                              <span>{item.barcode}</span>
                            </div>
                          ) : (
                            <span className="text-[11px] text-muted-foreground/60 italic">Sin Cód. Barras</span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg border bg-secondary/50 border-border/60 text-foreground">
                            {item.category}
                          </span>
                        </td>
                        <td className="p-3.5 font-medium text-xs text-foreground">
                          {supplier ? (
                            <span className="text-[11px] font-semibold text-foreground/90">{supplier.name}</span>
                          ) : (
                            <span className="text-[11px] text-muted-foreground/60 italic">No asignado</span>
                          )}
                        </td>
                        <td className="p-3.5 text-right text-muted-foreground font-semibold">${item.cost.toLocaleString()}</td>
                        <td className="p-3.5 text-right font-black text-sm text-foreground">${item.price.toLocaleString()}</td>
                        <td className="p-3.5 text-center font-black text-sm">
                          {item.stock} <span className="text-xs font-normal text-muted-foreground">{item.unit}</span>
                        </td>
                        <td className="p-3.5 text-center font-bold text-xs text-muted-foreground">
                          {item.minStock} <span className="text-[10.5px] font-normal">{item.unit}</span>
                        </td>
                        <td className="p-3.5 text-center">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                              isLow
                                ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20"
                                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            }`}
                          >
                            {isLow ? "Bajo Stock" : "OK"}
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
                              onClick={() => setDeleteConfirmState({ type: "product", id: item.id, name: item.name })}
                              className="p-1.5 text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 rounded-lg transition ml-0.5"
                              title="Eliminar producto"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Variant Sub-row */}
                      {hasVariants && isExpanded && (
                        <tr className="bg-secondary/15 border-b border-border/40">
                          <td colSpan={11} className="p-3 pl-14">
                            <div className="bg-background border border-border/60 rounded-xl p-3 space-y-2 max-w-xl">
                              <span className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block">
                                Desglose de Stock por Variante ({item.name}):
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {item.variants.map((variant: any) => (
                                  <div
                                    key={variant.id}
                                    className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 border border-border/50 text-xs"
                                  >
                                    <span className="font-bold text-foreground">{variant.name}</span>
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-mono font-black text-foreground">{variant.stock} {item.unit}</span>
                                      <button
                                        type="button"
                                        onClick={() => handleAdjustVariantStock(item.id, variant.id, -1)}
                                        className="w-5 h-5 rounded-md bg-secondary border border-border flex items-center justify-center font-bold text-xs hover:bg-rose-500/10 hover:text-rose-600"
                                        title="Reducir 1"
                                      >
                                        -
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleAdjustVariantStock(item.id, variant.id, 1)}
                                        className="w-5 h-5 rounded-md bg-secondary border border-border flex items-center justify-center font-bold text-xs hover:bg-emerald-500/10 hover:text-emerald-600"
                                        title="Aumentar 1"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                ))}
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
      ) : (
        <div className="bg-card border border-border/80 p-6 rounded-3xl space-y-4 shadow-xs">
          {/* Kardex Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/40">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-foreground">Historial Auditado de Movimientos (Kardex)</h3>
                <span className="px-2 py-0.5 rounded-full bg-secondary text-[10px] font-extrabold text-foreground border border-border/60">
                  {filteredMovements.length}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Registro inalterable de entradas, salidas, ventas POS y ajustes de inventario.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={exportKardexCSV}
                className="h-9 rounded-xl font-bold text-xs gap-1.5 border-border text-foreground hover:bg-secondary"
              >
                <Download className="h-4 w-4" /> Exportar Kardex CSV
              </Button>
            </div>
          </div>

          {/* Search, Date Range & Type Filter for Kardex */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-secondary/20 border border-border/50 rounded-2xl">
            <div className="relative flex-1 min-w-[200px] sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por producto, usuario o motivo..."
                value={kardexSearch}
                onChange={(e) => setKardexSearch(e.target.value)}
                className="h-9 w-full pl-8 pr-3 rounded-xl border border-border bg-background text-xs font-bold text-foreground placeholder:font-normal placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* Date From */}
              <div className="flex items-center gap-1.5 bg-background border border-border rounded-xl px-2.5 h-9 hover:border-primary/50 transition-colors">
                <span className="text-[10px] font-bold uppercase text-muted-foreground">Desde:</span>
                <Input
                  type="date"
                  value={kardexDateFrom}
                  onChange={(e) => setKardexDateFrom(e.target.value)}
                  className="bg-transparent text-xs font-bold text-foreground border-none h-auto p-0 shadow-none focus-visible:ring-0 cursor-pointer dark:[&::-webkit-calendar-picker-indicator]:invert opacity-90 hover:opacity-100"
                />
              </div>

              {/* Date To */}
              <div className="flex items-center gap-1.5 bg-background border border-border rounded-xl px-2.5 h-9 hover:border-primary/50 transition-colors">
                <span className="text-[10px] font-bold uppercase text-muted-foreground">Hasta:</span>
                <Input
                  type="date"
                  value={kardexDateTo}
                  onChange={(e) => setKardexDateTo(e.target.value)}
                  className="bg-transparent text-xs font-bold text-foreground border-none h-auto p-0 shadow-none focus-visible:ring-0 cursor-pointer dark:[&::-webkit-calendar-picker-indicator]:invert opacity-90 hover:opacity-100"
                />
              </div>

              {/* Movement Type Filter */}
              <Select value={kardexTypeFilter} onValueChange={(val) => setKardexTypeFilter(val)}>
                <SelectTrigger className="w-full sm:w-[180px] h-9 rounded-xl border border-border bg-background text-xs font-bold text-foreground">
                  <SelectValue placeholder="Tipo de Movimiento" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-border bg-popover text-popover-foreground">
                  <SelectItem value="all">Todos los Movimientos</SelectItem>
                  <SelectItem value="Entrada">Entrada / Reabastecimiento</SelectItem>
                  <SelectItem value="Salida / Venta">Salida / Venta POS</SelectItem>
                  <SelectItem value="Ajuste Manual">Ajuste Manual</SelectItem>
                  <SelectItem value="Merma / Pérdida">Merma / Pérdida</SelectItem>
                </SelectContent>
              </Select>

              {(kardexSearch || kardexTypeFilter !== "all" || kardexDateFrom || kardexDateTo) && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setKardexSearch("");
                    setKardexTypeFilter("all");
                    setKardexDateFrom("");
                    setKardexDateTo("");
                  }}
                  className="h-9 text-[11px] font-bold text-muted-foreground hover:text-rose-600 rounded-xl"
                >
                  Limpiar Filtros
                </Button>
              )}
            </div>
          </div>

          {/* Kardex Table */}
          <div className="overflow-x-auto border border-border/60 rounded-2xl bg-background">
            <table className="w-full text-left text-xs min-w-[850px] border-collapse">
              <thead>
                <tr className="border-b border-border/60 bg-secondary/40 text-muted-foreground font-bold text-[10px] uppercase tracking-wider">
                  <th className="p-3.5">Fecha & Hora</th>
                  <th className="p-3.5">Producto</th>
                  <th className="p-3.5 text-center">Tipo</th>
                  <th className="p-3.5 text-center">Cantidad</th>
                  <th className="p-3.5 text-center">Stock Previo → Nuevo</th>
                  <th className="p-3.5">Responsable</th>
                  <th className="p-3.5">Motivo / Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredMovements.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground italic">
                      No hay registros de movimientos con el filtro seleccionado.
                    </td>
                  </tr>
                ) : (
                  filteredMovements.map((m: any) => {
                    const isPositive = m.quantity > 0;
                    return (
                      <tr key={m.id} className="hover:bg-secondary/20 transition-colors">
                        <td className="p-3.5 font-mono text-muted-foreground text-[11px] font-semibold whitespace-nowrap">
                          {m.date}
                        </td>
                        <td className="p-3.5 font-bold text-foreground">{m.productName}</td>
                        <td className="p-3.5 text-center">
                          <span
                            className={`inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                              m.type === "Entrada"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                : m.type === "Salida / Venta"
                                ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                                : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                            }`}
                          >
                            {m.type}
                          </span>
                        </td>
                        <td className="p-3.5 text-center font-black text-sm">
                          <span className={isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
                            {isPositive ? `+${m.quantity}` : m.quantity}
                          </span>
                        </td>
                        <td className="p-3.5 text-center font-mono text-xs">
                          <span className="text-muted-foreground">{m.previousStock}</span>
                          <span className="mx-1 text-muted-foreground/60">→</span>
                          <span className="font-bold text-foreground">{m.newStock}</span>
                        </td>
                        <td className="p-3.5 font-bold text-foreground">{m.user}</td>
                        <td className="p-3.5 text-muted-foreground text-xs">{m.reason}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Ampliación de Imagen de Producto */}
      {previewImageModal && (
        <Dialog open={!!previewImageModal} onOpenChange={(open) => !open && setPreviewImageModal(null)}>
          <DialogContent className="sm:max-w-md border border-border bg-card p-6 rounded-3xl shadow-2xl space-y-4 text-center">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold text-foreground text-center flex items-center justify-center gap-2">
                <ImageIcon className="h-4 w-4 text-primary" /> {previewImageModal.title}
              </DialogTitle>
            </DialogHeader>

            <div className="relative rounded-2xl overflow-hidden border border-border/80 bg-background/50 max-h-[65vh] flex items-center justify-center p-3">
              <img
                src={previewImageModal.url}
                alt={previewImageModal.title}
                className="max-h-[55vh] w-auto max-w-full object-contain rounded-xl shadow-lg transition-transform"
              />
            </div>

            <DialogFooter className="justify-center sm:justify-center pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPreviewImageModal(null)}
                className="rounded-xl text-xs font-bold px-6 border-border"
              >
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Confirmation Modal for Deletions (Categorías, Proveedores, Productos) */}
      {deleteConfirmState && (
        <AlertDialog open={!!deleteConfirmState} onOpenChange={(open) => !open && setDeleteConfirmState(null)}>
          <AlertDialogContent className="sm:max-w-md border border-border bg-card p-6 rounded-3xl shadow-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-rose-600" /> Confirmar Eliminación
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs text-muted-foreground pt-1">
                {deleteConfirmState.type === "category" && (
                  <>¿Estás seguro de que deseas eliminar la categoría <strong>"{deleteConfirmState.name}"</strong>? Esta acción no se puede deshacer.</>
                )}
                {deleteConfirmState.type === "supplier" && (
                  <>¿Estás seguro de que deseas eliminar al proveedor <strong>"{deleteConfirmState.name}"</strong>? El proveedor dejará de figurar en la lista habitual.</>
                )}
                {deleteConfirmState.type === "product" && (
                  <>¿Estás seguro de que deseas eliminar el producto <strong>"{deleteConfirmState.name}"</strong> del inventario?</>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2 pt-3">
              <AlertDialogCancel
                onClick={() => setDeleteConfirmState(null)}
                className="rounded-xl text-xs font-bold border-border"
              >
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
              >
                Sí, Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Modal: Gestionar Categorías */}
      {showCategoryModal && (
        <Dialog open={showCategoryModal} onOpenChange={setShowCategoryModal}>
          <DialogContent className="sm:max-w-md border border-border bg-card p-6 rounded-3xl shadow-2xl space-y-4">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <FolderPlus className="h-5 w-5 text-primary" /> Gestionar Categorías de Tienda
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 text-xs">
              <form onSubmit={handleAddCategory} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Nueva categoría (ej: Bar Saludable, Toallas...)"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-1 h-9 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground"
                  required
                />
                <Button type="submit" size="sm" className="h-9 rounded-xl font-bold text-xs bg-primary text-primary-foreground">
                  <PlusCircle className="h-4 w-4" /> Agregar
                </Button>
              </form>

              <div className="space-y-1.5 pt-2">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Categorías Actuales ({categories.length}):
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                  {categories.map((cat) => (
                    <div
                      key={cat}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-secondary/30 border border-border/50 text-xs font-bold text-foreground"
                    >
                      <span>{cat}</span>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmState({ type: "category", id: cat, name: cat })}
                        className="text-muted-foreground hover:text-rose-600 p-1 rounded-lg transition"
                        title="Eliminar categoría"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCategoryModal(false)}
                  className="rounded-xl text-xs font-bold"
                >
                  Cerrar
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal: Gestionar Proveedores */}
      {showSupplierModal && (
        <Dialog open={showSupplierModal} onOpenChange={setShowSupplierModal}>
          <DialogContent className="sm:max-w-lg border border-border bg-card p-6 rounded-3xl shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto custom-scrollbar">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" /> Proveedores de Inventario ({suppliersList.length})
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 text-xs">
              <form onSubmit={handleAddSupplier} className="p-3.5 bg-secondary/30 border border-border/60 rounded-2xl space-y-3">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Registrar Nuevo Proveedor Habitual
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="text"
                    placeholder="Empresa / Distribuidora *"
                    value={newSupName}
                    onChange={(e) => setNewSupName(e.target.value)}
                    className="h-9 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground"
                    required
                  />
                  <Input
                    type="text"
                    placeholder="Contacto Principal"
                    value={newSupContact}
                    onChange={(e) => setNewSupContact(e.target.value)}
                    className="h-9 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="text"
                    placeholder="Teléfono / WhatsApp (ej: +549...)"
                    value={newSupPhone}
                    onChange={(e) => setNewSupPhone(e.target.value)}
                    className="h-9 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground"
                  />
                  <Input
                    type="email"
                    placeholder="Email de Pedidos"
                    value={newSupEmail}
                    onChange={(e) => setNewSupEmail(e.target.value)}
                    className="h-9 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground"
                  />
                </div>
                <Button type="submit" size="sm" className="w-full h-9 rounded-xl font-bold text-xs bg-primary text-primary-foreground">
                  <PlusCircle className="h-4 w-4" /> Guardar Proveedor
                </Button>
              </form>

              <div className="space-y-2 pt-2">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Proveedores Registrados:
                </span>
                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                  {suppliersList.map((sup) => (
                    <div
                      key={sup.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-secondary/20 border border-border/60 text-xs"
                    >
                      <div>
                        <span className="font-bold text-foreground block">{sup.name}</span>
                        <div className="text-[10.5px] text-muted-foreground flex items-center gap-2 mt-0.5">
                          <span>👤 {sup.contactName}</span>
                          <span>•</span>
                          <span>📞 {sup.phone || "Sin Tel."}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmState({ type: "supplier", id: sup.id, name: sup.name })}
                        className="text-muted-foreground hover:text-rose-600 p-1.5 rounded-lg transition"
                        title="Eliminar proveedor"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowSupplierModal(false)}
                  className="rounded-xl text-xs font-bold"
                >
                  Cerrar
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal: Orden de Reabastecimiento a Proveedor */}
      {showReplenishModal && (
        <Dialog open={showReplenishModal} onOpenChange={setShowReplenishModal}>
          <DialogContent className="sm:max-w-2xl border border-border bg-card p-6 rounded-3xl shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-amber-500" /> Generador de Pedidos a Proveedor
                </div>
                <span className="text-xs font-extrabold text-amber-600 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  {replenishOrderItems.length} ítems sugeridos
                </span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 text-xs">
              <p className="text-xs text-muted-foreground">
                Cálculo automático de unidades faltantes para alcanzar el stock deseado. Ajusta las cantidades antes de enviar el pedido.
              </p>

              <div className="overflow-x-auto border border-border/60 rounded-2xl">
                <table className="w-full text-left text-xs min-w-[550px]">
                  <thead>
                    <tr className="bg-secondary/40 border-b border-border/60 text-[10px] font-bold uppercase text-muted-foreground">
                      <th className="p-2.5">Producto</th>
                      <th className="p-2.5 text-center">Stock Actual / Min</th>
                      <th className="p-2.5 text-center w-28">Pedir (Unid)</th>
                      <th className="p-2.5">Proveedor Asignado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {replenishOrderItems.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-secondary/20">
                        <td className="p-2.5 font-bold text-foreground">
                          {item.name}
                          <span className="block text-[10px] text-muted-foreground">{item.category}</span>
                        </td>
                        <td className="p-2.5 text-center">
                          <span className="font-extrabold text-rose-600 dark:text-rose-400">{item.stock}</span>
                          <span className="text-[10px] text-muted-foreground"> / {item.minStock}</span>
                        </td>
                        <td className="p-2.5 text-center">
                          <Input
                            type="number"
                            min="1"
                            value={item.orderQty}
                            onChange={(e) => {
                              const val = Math.max(1, parseInt(e.target.value) || 1);
                              setReplenishOrderItems((prev) =>
                                prev.map((it, i) => (i === idx ? { ...it, orderQty: val } : it)),
                              );
                            }}
                            className="w-16 h-8 text-center rounded-xl border border-border bg-background font-bold text-foreground"
                          />
                        </td>
                        <td className="p-2.5">
                          <Select
                            value={item.supplierId || suppliersList[0]?.id}
                            onValueChange={(val) => {
                              setReplenishOrderItems((prev) =>
                                prev.map((it, i) => (i === idx ? { ...it, supplierId: val } : it)),
                              );
                            }}
                          >
                            <SelectTrigger className="h-8 rounded-xl border border-border bg-background text-xs font-bold text-foreground">
                              <SelectValue placeholder="Proveedor" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border border-border bg-popover text-popover-foreground">
                              {suppliersList.map((sup) => (
                                <SelectItem key={sup.id} value={sup.id}>
                                  {sup.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={exportReplenishOrderCSV}
                  className="w-full sm:w-auto h-9 text-xs font-bold rounded-xl gap-1.5 border-border"
                >
                  <Download className="h-4 w-4" /> Exportar Orden (CSV)
                </Button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowReplenishModal(false)}
                    className="flex-1 sm:flex-initial h-9 text-xs font-bold rounded-xl"
                  >
                    Cancelar
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    onClick={() => sendOrderViaWhatsApp()}
                    className="flex-1 sm:flex-initial h-9 text-xs font-bold rounded-xl gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                  >
                    <Send className="h-4 w-4" /> Enviar por WhatsApp
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

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
                <Input
                  type="text"
                  placeholder="Ej: Proteína Whey 1kg Vainilla"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full h-9 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block flex items-center gap-1">
                    <QrCode className="h-3 w-3 text-muted-foreground" /> Cód. Barras:
                  </label>
                  <Input
                    type="text"
                    placeholder="779123..."
                    value={newProdBarcode}
                    onChange={(e) => setNewProdBarcode(e.target.value)}
                    className="w-full h-9 rounded-xl border border-border bg-background px-2.5 text-xs font-mono font-bold text-foreground"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Categoría:
                  </label>
                  <Select value={newProdCat} onValueChange={(val) => setNewProdCat(val)}>
                    <SelectTrigger className="w-full h-9 rounded-xl border border-border bg-background text-xs font-bold text-foreground px-2.5">
                      <SelectValue placeholder="Categoría" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-border bg-popover text-popover-foreground">
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Proveedor:
                  </label>
                  <Select value={newProdSupplierId} onValueChange={(val) => setNewProdSupplierId(val)}>
                    <SelectTrigger className="w-full h-9 rounded-xl border border-border bg-background text-xs font-bold text-foreground px-2.5">
                      <SelectValue placeholder="Proveedor" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-border bg-popover text-popover-foreground">
                      {suppliersList.map((sup) => (
                        <SelectItem key={sup.id} value={sup.id}>
                          {sup.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Variantes (Opcional, separadas por coma):
                </label>
                <Input
                  type="text"
                  placeholder="Ej: Vainilla, Chocolate, Frutilla  ó  S, M, L, XL"
                  value={newProdVariantsInput}
                  onChange={(e) => setNewProdVariantsInput(e.target.value)}
                  className="w-full h-9 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground placeholder:font-normal"
                />
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
                  <Input
                    type="number"
                    placeholder="0"
                    value={newProdCost}
                    onChange={(e) => setNewProdCost(e.target.value)}
                    className="w-full h-9 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Precio Venta ($):
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full h-9 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Stock Inicial:
                  </label>
                  <Input
                    type="number"
                    placeholder="10"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    className="w-full h-9 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Stock Mínimo:
                  </label>
                  <Input
                    type="number"
                    placeholder="5"
                    value={newProdMinStock}
                    onChange={(e) => setNewProdMinStock(e.target.value)}
                    className="w-full h-9 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Unidad:
                  </label>
                  <Select value={newProdUnit} onValueChange={(val) => setNewProdUnit(val)}>
                    <SelectTrigger className="w-full h-9 rounded-xl border border-border bg-background text-xs font-bold text-foreground">
                      <SelectValue placeholder="Unidad" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-border bg-popover text-popover-foreground">
                      <SelectItem value="unid">Unidades (unid)</SelectItem>
                      <SelectItem value="bot">Botellas / Latas (bot)</SelectItem>
                      <SelectItem value="pack">Paquetes / Cajas (pack)</SelectItem>
                      <SelectItem value="kg">Kilogramos (kg)</SelectItem>
                      <SelectItem value="g">Gramos (g)</SelectItem>
                      <SelectItem value="l">Litros (l)</SelectItem>
                      <SelectItem value="ml">Mililitros (ml)</SelectItem>
                      <SelectItem value="porc">Porciones / Dosis (porc)</SelectItem>
                      <SelectItem value="serv">Servicios / Sesiones (serv)</SelectItem>
                    </SelectContent>
                  </Select>
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
                <Input
                  type="text"
                  value={editProdName}
                  onChange={(e) => setEditProdName(e.target.value)}
                  className="w-full h-9 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block flex items-center gap-1">
                    <QrCode className="h-3 w-3 text-muted-foreground" /> Cód. Barras:
                  </label>
                  <Input
                    type="text"
                    value={editProdBarcode}
                    onChange={(e) => setEditProdBarcode(e.target.value)}
                    className="w-full h-9 rounded-xl border border-border bg-background px-2.5 text-xs font-mono font-bold text-foreground"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Categoría:
                  </label>
                  <Select value={editProdCat} onValueChange={(val) => setEditProdCat(val)}>
                    <SelectTrigger className="w-full h-9 rounded-xl border border-border bg-background text-xs font-bold text-foreground px-2.5">
                      <SelectValue placeholder="Categoría" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-border bg-popover text-popover-foreground">
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Proveedor:
                  </label>
                  <Select value={editProdSupplierId} onValueChange={(val) => setEditProdSupplierId(val)}>
                    <SelectTrigger className="w-full h-9 rounded-xl border border-border bg-background text-xs font-bold text-foreground px-2.5">
                      <SelectValue placeholder="Proveedor" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-border bg-popover text-popover-foreground">
                      {suppliersList.map((sup) => (
                        <SelectItem key={sup.id} value={sup.id}>
                          {sup.name}
                        </SelectItem>
                      ))}
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
                  <Input
                    type="number"
                    value={editProdCost}
                    onChange={(e) => setEditProdCost(e.target.value)}
                    className="w-full h-9 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Precio Venta ($):
                  </label>
                  <Input
                    type="number"
                    value={editProdPrice}
                    onChange={(e) => setEditProdPrice(e.target.value)}
                    className="w-full h-9 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Stock Mínimo (Alerta):
                  </label>
                  <Input
                    type="number"
                    value={editProdMinStock}
                    onChange={(e) => setEditProdMinStock(e.target.value)}
                    className="w-full h-9 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Unidad:
                  </label>
                  <Select value={editProdUnit} onValueChange={(val) => setEditProdUnit(val)}>
                    <SelectTrigger className="w-full h-9 rounded-xl border border-border bg-background text-xs font-bold text-foreground">
                      <SelectValue placeholder="Unidad" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-border bg-popover text-popover-foreground">
                      <SelectItem value="unid">Unidades (unid)</SelectItem>
                      <SelectItem value="bot">Botellas / Latas (bot)</SelectItem>
                      <SelectItem value="pack">Paquetes / Cajas (pack)</SelectItem>
                      <SelectItem value="kg">Kilogramos (kg)</SelectItem>
                      <SelectItem value="g">Gramos (g)</SelectItem>
                      <SelectItem value="l">Litros (l)</SelectItem>
                      <SelectItem value="ml">Mililitros (ml)</SelectItem>
                      <SelectItem value="porc">Porciones / Dosis (porc)</SelectItem>
                      <SelectItem value="serv">Servicios / Sesiones (serv)</SelectItem>
                    </SelectContent>
                  </Select>
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
                <Input
                  type="number"
                  placeholder="Ej: 20 para agregar o -5 para reducir"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  className="w-full h-9.5 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10.5px] font-bold text-muted-foreground uppercase block">
                  Motivo / Observación del Movimiento:
                </label>
                <Input
                  type="text"
                  placeholder="Ej: Reabastecimiento de compra, Merma por vencimiento, Muestra..."
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full h-9.5 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground"
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
                    const prevStk = showAdjustModal.stock;
                    const newStk = Math.max(0, prevStk + parsed);
                    
                    setInventoryItems((prev) =>
                      prev.map((i) =>
                        i.id === showAdjustModal.id ? { ...i, stock: newStk } : i,
                      ),
                    );

                    const defaultReason = parsed >= 0 ? "Reabastecimiento de stock" : "Ajuste manual de existencias";
                    logStockMovement(
                      showAdjustModal.id,
                      showAdjustModal.name,
                      parsed >= 0 ? "Entrada" : "Ajuste Manual",
                      parsed,
                      prevStk,
                      newStk,
                      adjustReason.trim() || defaultReason
                    );

                    setAdjustAmount("");
                    setAdjustReason("");
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
  membersList = [],
}: {
  reviewsList: Review[];
  setReviewsList: React.Dispatch<React.SetStateAction<Review[]>>;
  membersList?: any[];
}) {
  const [subTab, setSubTab] = useState<"public" | "private">("public");

  // Public Facility Reviews
  const [facilityReviews, setFacilityReviews] = useState<GymFacilityReview[]>([
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
    {
      id: "rev-4",
      date: "2026-07-05",
      studentName: "Sofía Martínez",
      studentPhoto:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80",
      ratingCleanliness: 4.9,
      ratingEquipment: 4.7,
      ratingStaff: 4.8,
      ratingPrice: 4.5,
      overallRating: 4.7,
      comment: "Llevo 6 meses entrenando aquí y la experiencia es inmejorable. Súper recomendado para todas las edades.",
      reply: "¡Gracias Sofía! Nos motiva muchísimo seguir dando lo mejor cada día.",
    },
  ]);

  // Private Feedback & Suggestions
  const [privateFeedback, setPrivateFeedback] = useState<Array<{
    id: string;
    date: string;
    studentName: string;
    studentPhoto: string;
    category: "Instalaciones" | "Clases & Horarios" | "Climatización" | "Atención / Staff";
    message: string;
    status: "Pendiente" | "Atendido";
    adminNotes?: string;
  }>>([
    {
      id: "priv-1",
      date: "2026-07-28",
      studentName: "Martín Páez",
      studentPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80",
      category: "Climatización",
      message: "En el sector de peso libre el aire acondicionado estuvo un poco fuerte ayer por la tarde, ¿se podría regular?",
      status: "Pendiente",
    },
    {
      id: "priv-2",
      date: "2026-07-24",
      studentName: "Valeria Benítez",
      studentPhoto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80",
      category: "Instalaciones",
      message: "Estaría genial si pudieran agregar un dispenser de agua extra cerca de la sala de Pilates.",
      status: "Atendido",
      adminNotes: "Nota interna: Instalaremos segundo dispenser la próxima semana.",
    },
    {
      id: "priv-3",
      date: "2026-07-15",
      studentName: "Diego Rossi",
      studentPhoto: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80",
      category: "Clases & Horarios",
      message: "Habría mucha demanda si agregan una clase de Yoga a las 20:00 hs los días martes. ¡Ojalá sea posible!",
      status: "Pendiente",
    },
  ]);

  // Featured Reviews State (for Landing Page display)
  const [featuredReviewIds, setFeaturedReviewIds] = useState<string[]>(["rev-1", "rev-4"]);

  // Reply Handling State
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  // Private Admin Notes State
  const [adminNoteTexts, setAdminNoteTexts] = useState<Record<string, string>>({});
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  // Filters State for Public Reviews
  const [publicSearch, setPublicSearch] = useState("");
  const [publicRatingFilter, setPublicRatingFilter] = useState("all");
  const [publicStatusFilter, setPublicStatusFilter] = useState("all");

  // Filters State for Private Feedback
  const [privateSearch, setPrivateSearch] = useState("");
  const [privateCategoryFilter, setPrivateCategoryFilter] = useState("all");
  const [privateStatusFilter, setPrivateStatusFilter] = useState("all");

  // WhatsApp Request Modal State
  const [showRequestWhatsAppModal, setShowRequestWhatsAppModal] = useState(false);
  const [requestPhone, setRequestPhone] = useState("");
  const [requestStudentName, setRequestStudentName] = useState("");
  const [memberSearchModal, setMemberSearchModal] = useState("");
  const [selectedMemberModal, setSelectedMemberModal] = useState<any | null>(null);

  // Confirmation Alert Dialog State
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
  const handleSendReply = (id: string) => {
    const text = replyTexts[id];
    if (!text?.trim()) return;
    setFacilityReviews((prev) => prev.map((r) => (r.id === id ? { ...r, reply: text.trim() } : r)));
    setReplyTexts((prev) => ({ ...prev, [id]: "" }));
    setActiveReplyId(null);
    toast.success("✓ Respuesta oficial publicada correctamente.");
  };

  const handleDeleteReply = (id: string) => {
    setFacilityReviews((prev) => prev.map((r) => (r.id === id ? { ...r, reply: "" } : r)));
    toast.info("Respuesta oficial eliminada.");
  };

  const handleToggleFeatured = (id: string) => {
    if (featuredReviewIds.includes(id)) {
      setFeaturedReviewIds((prev) => prev.filter((item) => item !== id));
      toast.info("Reseña removida de las destacadas del perfil público.");
    } else {
      setFeaturedReviewIds((prev) => [...prev, id]);
      toast.success("★ Reseña destacada para el perfil público.");
    }
  };

  const handleSaveAdminNote = (id: string) => {
    const text = adminNoteTexts[id];
    setPrivateFeedback((prev) =>
      prev.map((item) => (item.id === id ? { ...item, adminNotes: text?.trim() || "", status: "Atendido" } : item)),
    );
    setActiveNoteId(null);
    toast.success("✓ Nota interna guardada y sugerencia marcada como Atendida.");
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

  const sendWhatsAppReviewRequest = (overridePhone?: string, overrideName?: string) => {
    const targetPhone = overridePhone || requestPhone;
    const targetName = overrideName || requestStudentName;

    if (!targetPhone.trim()) {
      toast.error("Por favor selecciona un alumno con número de WhatsApp válido.");
      return;
    }
    const cleanPhone = targetPhone.replace(/[^\d+]/g, "");
    const text = encodeURIComponent(
      `Hola ${targetName || "estimado/a alumno/a"}, ¡gracias por entrenar en Shakerfy! Nos encantaría conocer tu opinión para seguir mejorando nuestras instalaciones y servicios. Podés enviarnos tus sugerencias o valorar tu experiencia en 1 minuto. ¡Muchas gracias!`,
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, "_blank");
    setShowRequestWhatsAppModal(false);
    toast.success("✓ Solicitud de opinión iniciada por WhatsApp.");
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

      const matchCat =
        privateCategoryFilter === "all" || f.category === privateCategoryFilter;

      const matchStatus =
        privateStatusFilter === "all" || f.status === privateStatusFilter;

      return matchSearch && matchCat && matchStatus;
    });
  }, [privateFeedback, privateSearch, privateCategoryFilter, privateStatusFilter]);

  // Available Members for WhatsApp modal
  const availableWhatsAppMembers = useMemo(() => {
    const defaultList = [
      { id: "m1", name: "Agustín Gómez", phone: "+5491155551234", plan: "Pase Libre", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80" },
      { id: "m2", name: "Camila Díaz", phone: "+5491141245124", plan: "Performance", photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80" },
      { id: "m3", name: "Lucas Peralta", phone: "+5491141241111", plan: "Pase Libre", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80" },
      { id: "m4", name: "Sofía Martínez", phone: "+5491133338888", plan: "Elite Coached", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80" },
      { id: "m5", name: "Martín Páez", phone: "+5491166669999", plan: "Performance", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80" },
    ];

    const combined = membersList.length > 0 ? membersList : defaultList;

    return combined.filter((m) => {
      const q = memberSearchModal.toLowerCase();
      const matchName = m.name?.toLowerCase().includes(q);
      const matchPhone = m.phone?.toLowerCase().includes(q);
      return matchName || matchPhone;
    });
  }, [membersList, memberSearchModal]);

  return (
    <div className="space-y-6 animate-fade-in text-foreground">
      {/* Navigation Header & Quick Request Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 bg-card border border-border/80 p-3 rounded-3xl shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5 bg-secondary/50 p-1 rounded-2xl border border-border/50">
          <button
            type="button"
            onClick={() => setSubTab("public")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
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
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 relative ${
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
            className="h-9 rounded-xl font-bold text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
          >
            <Send className="h-4 w-4" /> Solicitar Reseña por WhatsApp
          </Button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border/80 p-5 rounded-3xl shadow-xs space-y-1 hover:-translate-y-1 transition-all duration-300">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
            Puntuación General
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-500 dark:text-amber-400 flex items-center gap-1.5">
              ★ {overallAvg}
            </span>
            <span className="text-xs text-muted-foreground font-semibold">/ 5.0</span>
          </div>
          <p className="text-[11px] text-muted-foreground pt-1">
            Basado en <strong>{totalEvaluationsCount}</strong> evaluaciones verificadas.
          </p>
        </div>

        <div className="bg-card border border-border/80 p-5 rounded-3xl shadow-xs space-y-1 hover:-translate-y-1 transition-all duration-300">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
            Tasa de Respuesta
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-foreground">{responseRatePercentage}%</span>
            <span className="text-xs text-emerald-600 font-bold">Oficial</span>
          </div>
          <p className="text-[11px] text-muted-foreground pt-1">
            {pendingRepliesCount > 0 ? (
              <span className="text-amber-600 font-semibold">{pendingRepliesCount} pendientes de respuesta.</span>
            ) : (
              <span className="text-emerald-600 font-semibold">100% de opiniones respondidas.</span>
            )}
          </p>
        </div>

        <div className="bg-card border border-border/80 p-5 rounded-3xl shadow-xs space-y-1 hover:-translate-y-1 transition-all duration-300">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
            Destacadas en Perfil
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-primary">{featuredReviewIds.length}</span>
            <span className="text-xs text-muted-foreground">reseñas</span>
          </div>
          <p className="text-[11px] text-muted-foreground pt-1">
            Visibles en el perfil público del centro.
          </p>
        </div>

        <div className="bg-card border border-border/80 p-5 rounded-3xl shadow-xs space-y-1 hover:-translate-y-1 transition-all duration-300">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
            Sugerencias Privadas
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-foreground">{pendingPrivateCount}</span>
            <span className="text-xs text-amber-600 font-bold">Sin revisar</span>
          </div>
          <p className="text-[11px] text-muted-foreground pt-1">
            Mensajes directos para la administración.
          </p>
        </div>
      </div>

      {subTab === "public" ? (
        <div className="space-y-6">
          {/* Rating Breakdowns: Stars distribution + Sub-ratings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Sub-ratings Breakdown */}
            <div className="bg-card border border-border p-6 rounded-3xl space-y-5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                Calificaciones Promedio por Categoría
              </span>

              <div className="space-y-4">
                {[
                  { label: "Limpieza & Vestuarios", score: avgCleanliness },
                  { label: "Equipamiento & Mantenimiento", score: avgEquipment },
                  { label: "Atención del Staff & Recepción", score: avgStaff },
                  { label: "Relación Calidad / Precio", score: avgPrice },
                ].map((cat) => (
                  <div key={cat.label} className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold text-foreground">
                      <span>{cat.label}</span>
                      <span className="font-mono text-sm text-amber-600 dark:text-amber-400 font-extrabold flex items-center gap-1">
                        ★ {cat.score}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 dark:bg-amber-500 rounded-full transition-all duration-700"
                        style={{ width: `${(parseFloat(cat.score) / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stars Distribution Bar Graph */}
            <div className="bg-card border border-border p-6 rounded-3xl space-y-5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                Distribución de Estrellas ({totalEvaluationsCount})
              </span>

              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = (starCounts as any)[stars] || 0;
                  const pct = Math.round((count / totalEvaluationsCount) * 100);
                  return (
                    <div key={stars} className="flex items-center gap-3 text-xs">
                      <span className="w-12 font-bold text-amber-500 dark:text-amber-400 text-right shrink-0">
                        {stars} ★
                      </span>
                      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 dark:bg-amber-500 rounded-full transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-16 font-mono text-[11px] text-muted-foreground text-right shrink-0">
                        {pct}% ({count})
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

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
              <Select value={publicRatingFilter} onValueChange={(val) => setPublicRatingFilter(val)}>
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

              <Select value={publicStatusFilter} onValueChange={(val) => setPublicStatusFilter(val)}>
                <SelectTrigger className="w-full sm:w-[190px] h-9 rounded-xl border border-border bg-background text-xs font-bold text-foreground">
                  <SelectValue placeholder="Estado de Respuesta" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-border bg-popover text-popover-foreground">
                  <SelectItem value="all">Todos los Estados</SelectItem>
                  <SelectItem value="unreplied">⚠️ Sin Responder</SelectItem>
                  <SelectItem value="replied">✅ Respondidas</SelectItem>
                  <SelectItem value="featured">★ Destacadas en Perfil</SelectItem>
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
                  className="h-9 text-[11px] font-bold text-muted-foreground hover:text-rose-600 rounded-xl"
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
              filteredPublicReviews.map((rev) => {
                const isFeatured = featuredReviewIds.includes(rev.id);
                return (
                  <div
                    key={rev.id}
                    className="bg-card border border-border p-5 rounded-3xl space-y-3.5 hover:border-border/80 transition-all shadow-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.studentPhoto}
                          alt={rev.studentName}
                          className="w-10 h-10 rounded-full object-cover border border-border shrink-0 shadow-2xs"
                        />
                        <div>
                          <div className="font-bold text-sm text-foreground flex items-center gap-2">
                            <span>{rev.studentName}</span>
                            {isFeatured && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[10px] font-extrabold flex items-center gap-1">
                                ★ Destacada en Perfil
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">{rev.date}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 font-extrabold text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-xl border border-amber-500/30">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span>{rev.overallRating.toFixed(1)}</span>
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleFeatured(rev.id)}
                          className={`h-8 text-[11px] font-bold rounded-xl gap-1 border-border ${
                            isFeatured
                              ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 hover:bg-amber-500/20"
                              : "hover:bg-secondary"
                          }`}
                        >
                          <Star className={`h-3.5 w-3.5 ${isFeatured ? "fill-amber-500 text-amber-500" : ""}`} />
                          {isFeatured ? "Destacada" : "Destacar"}
                        </Button>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm leading-relaxed text-foreground/90 font-medium bg-secondary/15 p-3 rounded-2xl border border-border/40">
                      "{rev.comment}"
                    </p>

                    {/* Sub-ratings badges */}
                    <div className="flex flex-wrap gap-2 text-[10.5px] text-muted-foreground pt-0.5">
                      <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 font-medium border border-amber-500/20">
                        Limpieza: <strong className="font-mono text-foreground">{rev.ratingCleanliness} ★</strong>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 font-medium border border-amber-500/20">
                        Equipamiento: <strong className="font-mono text-foreground">{rev.ratingEquipment} ★</strong>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 font-medium border border-amber-500/20">
                        Staff: <strong className="font-mono text-foreground">{rev.ratingStaff} ★</strong>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 font-medium border border-amber-500/20">
                        Precio: <strong className="font-mono text-foreground">{rev.ratingPrice} ★</strong>
                      </span>
                    </div>

                    {/* Official Reply Section */}
                    {rev.reply ? (
                      <div className="mt-3 p-3.5 rounded-2xl bg-secondary/30 border border-border/60 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-primary flex items-center gap-1.5">
                            <MessageCircle className="w-3.5 h-3.5 text-primary" /> Respuesta Oficial del Centro
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setReplyTexts((prev) => ({ ...prev, [rev.id]: rev.reply }));
                                setActiveReplyId(rev.id);
                              }}
                              className="text-[10.5px] text-muted-foreground hover:text-foreground font-semibold underline"
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmState({ type: "reply_delete", id: rev.id, name: rev.studentName })}
                              className="text-[10.5px] text-rose-500 hover:text-rose-600 font-semibold underline flex items-center gap-1"
                            >
                              <Trash2 className="h-3 w-3" /> Eliminar Respuesta
                            </button>
                          </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{rev.reply}</p>
                      </div>
                    ) : (
                      activeReplyId !== rev.id && (
                        <button
                          type="button"
                          onClick={() => setActiveReplyId(rev.id)}
                          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1.5 pt-1"
                        >
                          <MessageCircle className="w-3.5 h-3.5" /> Responder como Administrador
                        </button>
                      )
                    )}

                    {activeReplyId === rev.id && (
                      <div className="space-y-2 pt-2 animate-fade-in">
                        <Textarea
                          rows={2}
                          value={replyTexts[rev.id] || ""}
                          onChange={(e) =>
                            setReplyTexts((prev) => ({ ...prev, [rev.id]: e.target.value }))
                          }
                          placeholder="Escribe la respuesta oficial para el alumno..."
                          className="flex w-full rounded-2xl border border-border bg-background px-3 py-2 text-xs font-bold text-foreground placeholder:font-normal placeholder:text-muted-foreground"
                        />
                        <div className="flex gap-2 justify-end">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="rounded-xl text-xs font-bold"
                            onClick={() => {
                              setActiveReplyId(null);
                              setReplyTexts((prev) => ({ ...prev, [rev.id]: "" }));
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            className="rounded-xl text-xs font-bold bg-primary text-primary-foreground"
                            onClick={() => handleSendReply(rev.id)}
                          >
                            Publicar Respuesta Oficial
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
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
                Mensajes directos enviados por los alumnos a la dirección del centro. Este feedback es 100% privado y permite resolver inquietudes de forma personalizada.
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
              <Select value={privateCategoryFilter} onValueChange={(val) => setPrivateCategoryFilter(val)}>
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

              <Select value={privateStatusFilter} onValueChange={(val) => setPrivateStatusFilter(val)}>
                <SelectTrigger className="w-full sm:w-[160px] h-9 rounded-xl border border-border bg-background text-xs font-bold text-foreground">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-border bg-popover text-popover-foreground">
                  <SelectItem value="all">Todos los Estados</SelectItem>
                  <SelectItem value="Pendiente">⚠️ Pendientes</SelectItem>
                  <SelectItem value="Atendido">✅ Atendidos</SelectItem>
                </SelectContent>
              </Select>

              {(privateSearch || privateCategoryFilter !== "all" || privateStatusFilter !== "all") && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setPrivateSearch("");
                    setPrivateCategoryFilter("all");
                    setPrivateStatusFilter("all");
                  }}
                  className="h-9 text-[11px] font-bold text-muted-foreground hover:text-rose-600 rounded-xl"
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
              filteredPrivateFeedback.map((fb) => {
                const isPending = fb.status === "Pendiente";
                return (
                  <div
                    key={fb.id}
                    className="bg-card border border-border p-5 rounded-3xl space-y-3.5 hover:border-border/80 transition-all shadow-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={fb.studentPhoto}
                          alt={fb.studentName}
                          className="w-10 h-10 rounded-full object-cover border border-border shrink-0 shadow-2xs"
                        />
                        <div>
                          <div className="font-bold text-sm text-foreground flex items-center gap-2">
                            <span>{fb.studentName}</span>
                            <span className="px-2.5 py-0.5 rounded-lg bg-secondary/60 text-foreground border border-border/60 text-[10px] font-extrabold">
                              {fb.category}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">{fb.date}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleTogglePrivateStatus(fb.id)}
                          className={`px-3 py-1 rounded-full border text-[10.5px] font-extrabold transition ${
                            isPending
                              ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 hover:bg-amber-500/20"
                              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                          }`}
                        >
                          {isPending ? "⚠️ Pendiente" : "✅ Atendido"}
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteConfirmState({ type: "private_delete", id: fb.id, name: fb.studentName })}
                          className="p-1.5 text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 rounded-lg transition"
                          title="Eliminar sugerencia"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm leading-relaxed text-foreground/90 font-medium bg-secondary/15 p-3 rounded-2xl border border-border/40">
                      "{fb.message}"
                    </p>

                    {/* Internal Admin Note */}
                    {fb.adminNotes ? (
                      <div className="p-3.5 rounded-2xl bg-secondary/30 border border-border/60 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-foreground flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-primary" /> Nota Interna de Administración
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setAdminNoteTexts((prev) => ({ ...prev, [fb.id]: fb.adminNotes || "" }));
                              setActiveNoteId(fb.id);
                            }}
                            className="text-[10.5px] text-muted-foreground hover:text-foreground font-semibold underline"
                          >
                            Editar Nota
                          </button>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{fb.adminNotes}</p>
                      </div>
                    ) : (
                      activeNoteId !== fb.id && (
                        <button
                          type="button"
                          onClick={() => setActiveNoteId(fb.id)}
                          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1.5 pt-0.5"
                        >
                          <PlusCircle className="w-3.5 h-3.5" /> Agregar nota interna de resolución
                        </button>
                      )
                    )}

                    {activeNoteId === fb.id && (
                      <div className="space-y-2 pt-2 animate-fade-in">
                        <Textarea
                          rows={2}
                          value={adminNoteTexts[fb.id] || ""}
                          onChange={(e) =>
                            setAdminNoteTexts((prev) => ({ ...prev, [fb.id]: e.target.value }))
                          }
                          placeholder="Escribe una nota interna (ej: 'Revisado con el staff de limpieza el 29/07')..."
                          className="flex w-full rounded-2xl border border-border bg-background px-3 py-2 text-xs font-bold text-foreground placeholder:font-normal placeholder:text-muted-foreground"
                        />
                        <div className="flex gap-2 justify-end">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="rounded-xl text-xs font-bold"
                            onClick={() => {
                              setActiveNoteId(null);
                              setAdminNoteTexts((prev) => ({ ...prev, [fb.id]: "" }));
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            className="rounded-xl text-xs font-bold bg-primary text-primary-foreground"
                            onClick={() => handleSaveAdminNote(fb.id)}
                          >
                            Guardar Nota Interna
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Modal: Solicitar Reseñas por WhatsApp */}
      {showRequestWhatsAppModal && (
        <Dialog open={showRequestWhatsAppModal} onOpenChange={setShowRequestWhatsAppModal}>
          <DialogContent className="sm:max-w-lg border border-border bg-card p-6 rounded-3xl shadow-2xl space-y-4">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Send className="h-5 w-5 text-emerald-600" /> Solicitar Feedback por WhatsApp
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 text-xs">
              <p className="text-muted-foreground leading-relaxed">
                Selecciona un socio de la lista activa para enviarle una invitación directa a su WhatsApp personal.
              </p>

              {/* Member Search input */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar socio por nombre o número de teléfono..."
                  value={memberSearchModal}
                  onChange={(e) => setMemberSearchModal(e.target.value)}
                  className="w-full h-9 rounded-xl border border-border bg-background pl-8 pr-3 text-xs font-bold text-foreground placeholder:font-normal placeholder:text-muted-foreground"
                />
              </div>

              {/* Members List Selector */}
              <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                {availableWhatsAppMembers.map((m) => {
                  const isSelected = selectedMemberModal?.id === m.id || requestStudentName === m.name;
                  return (
                    <div
                      key={m.id || m.name}
                      onClick={() => {
                        setSelectedMemberModal(m);
                        setRequestStudentName(m.name);
                        setRequestPhone(m.phone || "");
                      }}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "border-emerald-500/50 bg-emerald-500/10 font-bold"
                          : "border-border/60 bg-secondary/20 hover:bg-secondary/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={m.photo || m.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80"}
                          alt={m.name}
                          className="w-8 h-8 rounded-full object-cover border border-border shrink-0"
                        />
                        <div>
                          <div className="font-bold text-xs text-foreground">{m.name}</div>
                          <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                            <span>{m.phone || "Sin teléfono registrado"}</span>
                            {m.plan && <span className="text-[10px] bg-secondary px-1.5 py-0.2 rounded font-semibold">{m.plan}</span>}
                          </div>
                        </div>
                      </div>

                      {m.phone ? (
                        <Button
                          type="button"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            sendWhatsAppReviewRequest(m.phone, m.name);
                          }}
                          className="h-7 px-3 rounded-xl text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1 shadow-xs"
                        >
                          <Send className="h-3 w-3" /> Enviar
                        </Button>
                      ) : (
                        <span className="text-[10px] text-muted-foreground italic">Sin WhatsApp</span>
                      )}
                    </div>
                  );
                })}
              </div>

              <DialogFooter className="gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowRequestWhatsAppModal(false);
                    setSelectedMemberModal(null);
                    setMemberSearchModal("");
                  }}
                  className="rounded-xl text-xs font-bold w-full sm:w-auto"
                >
                  Cerrar
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Confirmation Modal for Deletions */}
      {deleteConfirmState && (
        <AlertDialog open={!!deleteConfirmState} onOpenChange={(open) => !open && setDeleteConfirmState(null)}>
          <AlertDialogContent className="sm:max-w-md border border-border bg-card p-6 rounded-3xl shadow-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-rose-600" /> Confirmar Eliminación
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs text-muted-foreground pt-1 leading-relaxed">
                {deleteConfirmState.type === "reply_delete" && (
                  <>¿Estás seguro de que deseas eliminar tu <strong>Respuesta Oficial</strong> a la reseña de <strong>"{deleteConfirmState.name}"</strong>? La reseña volverá a quedar como pendiente de respuesta.</>
                )}
                {deleteConfirmState.type === "private_delete" && (
                  <>¿Estás seguro de que deseas eliminar la sugerencia privada enviada por <strong>"{deleteConfirmState.name}"</strong>?</>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2 pt-3">
              <AlertDialogCancel
                onClick={() => setDeleteConfirmState(null)}
                className="rounded-xl text-xs font-bold border-border"
              >
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDeleteAction}
                className="rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
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

// Subcomponent: Asistencias Tab
function AsistenciasTab({
  blackoutDays,
  membersList = [],
  classesList = [],
  setClassesList,
  currentUser,
}: {
  blackoutDays: { id: string; date: string; reason: string }[];
  membersList?: any[];
  classesList?: any[];
  setClassesList?: React.Dispatch<React.SetStateAction<any[]>>;
  currentUser?: any;
}) {
  const [historySearch, setHistorySearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("Todos");
  const [dateFilter, setDateFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");



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

  const [recentCheckinsList, setRecentCheckinsList] = useState<
    Array<{
      name: string;
      time: string;
      method: string;
      alert?: string | null;
      alertColor?: string;
      photo: string;
    }>
  >([
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

  const handleContactNoAttendanceMember = (memberName: string) => {
    const member = (membersList || []).find(
      (m: any) => m.name.toLowerCase().trim() === memberName.toLowerCase().trim(),
    );

    const actualGymName = (currentUser as any)?.gymName || "Kraft Strength Club";

    const messageText = `Hola ${memberName}, ¡te extrañamos en ${actualGymName}! 👋 Notamos que hace unos días no registras asistencia a tus clases. ¿Cómo venís con tus entrenamientos? Avisanos si necesitas ayuda para agendar tus horarios. 💪`;

    if (member?.phone) {
      const cleanPhone = member.phone.replace(/[^0-9]/g, "");
      const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;
      window.open(waUrl, "_blank");
      toast.success(`Redirigiendo a WhatsApp para enviar mensaje a ${memberName}...`);
      return;
    }

    if (member?.email) {
      const subject = encodeURIComponent(`¡Te extrañamos en ${actualGymName}!`);
      const body = encodeURIComponent(messageText);
      window.open(`mailto:${member.email}?subject=${subject}&body=${body}`, "_blank");
      toast.success(`Abriendo cliente de correo para contactar a ${memberName}...`);
      return;
    }

    toast.error(`No hay teléfono ni correo registrado en la ficha de ${memberName}.`);
  };

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
              {(membersList || [])
                .filter((m: any) => m.status === "activo" || m.status === "vencido")
                .slice(0, 3)
                .map((m: any, idx: number) => {
                  const days = 12 + idx * 2;
                  return (
                    <div
                      key={m.name || idx}
                      className="p-3 rounded-2xl bg-card border border-border flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-foreground block">{m.name}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {m.plan || "Pase General"} · Hace {days} días
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full text-[10px] h-7 px-2.5 gap-1 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 font-bold"
                        onClick={() => handleContactNoAttendanceMember(m.name)}
                      >
                        <MessageCircle className="w-3 h-3" /> Contactar
                      </Button>
                    </div>
                  );
                })}
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

          {/* Top Actions: Export CSV */}
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

  const [deleteConfirmMember, setDeleteConfirmMember] = useState<string | null>(null);
  const [cancelConfirmMember, setCancelConfirmMember] = useState<any | null>(null);
  const [cantDeleteWarningMember, setCantDeleteWarningMember] = useState<any | null>(null);
  const [mpRenewAction, setMpRenewAction] = useState<"skip" | "cancel">("skip");
  const [freezeDialogMember, setFreezeDialogMember] = useState<string | null>(null);
  const [freezeDaysInput, setFreezeDaysInput] = useState<string>("15");

  const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "activo":
        return "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20";
      case "pendiente":
      case "vencido":
        return "text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20";
      case "congelado":
        return "text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20";
      case "cancelado":
        return "text-muted-foreground bg-secondary border border-border";
      default:
        return "text-destructive bg-destructive/10 border border-destructive/20";
    }
  };

  const handleConfirmCheckIn = () => {
    if (!checkInResult || !checkInResult.member) return;
    toast.success(`Asistencia registrada con éxito para ${checkInResult.member.name}`);
    setCheckInResult(null);
    setCheckInQuery("");
  };

  const filteredMembers = useMemo(() => {
    let result = membersList.filter((m: any) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.dni && m.dni.includes(searchTerm));
      if (!matchesSearch) return false;

      if (filterStatus === "all") return m.status !== "cancelado";
      if (filterStatus === "activos") return m.status === "activo";
      if (filterStatus === "vencidos") return m.status === "vencido" || m.status === "pendiente";
      if (filterStatus === "congelados") return m.status === "congelado";
      if (filterStatus === "archivados") return m.status === "cancelado";
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
              color: getStatusBadgeColor(newMember.status),
              photo: m.photo,
            };
          }
          return m;
        }),
      );
      toast.success(`Datos de ${newMember.name} actualizados.`);
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
        color: getStatusBadgeColor(newMember.status),
        photo: "https://api.dicebear.com/7.x/initials/svg?seed=" + newMember.name,
        payments: initialPayments,
      };
      setMembersList([memberToAdd, ...membersList]);
      toast.success(`Alumno ${newMember.name} registrado con éxito.`);
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

  const handleCancelPlan = (member: any) => {
    setCancelConfirmMember(member);
  };

  const confirmCancelPlanAction = () => {
    if (!cancelConfirmMember) return;
    const isMp =
      cancelConfirmMember.paymentMethod === "Mercado Pago (Auto)" ||
      cancelConfirmMember.isAutoRenew;

    setMembersList((prev: any) =>
      prev.map((m: any) =>
        m.name === cancelConfirmMember.name
          ? {
              ...m,
              status: "cancelado",
              color: getStatusBadgeColor("cancelado"),
              isAutoRenew: false,
            }
          : m,
      ),
    );

    if (isMp) {
      toast.info(
        `Alumno ${cancelConfirmMember.name} dado de baja. Suscripción de Mercado Pago cancelada vía API.`,
      );
    } else {
      toast.info(`Alumno ${cancelConfirmMember.name} dado de baja / archivado.`);
    }
    setCancelConfirmMember(null);
  };

  const handleReactivateMember = (memberName: string) => {
    setMembersList((prev: any) =>
      prev.map((m: any) =>
        m.name === memberName
          ? { ...m, status: "activo", color: getStatusBadgeColor("activo") }
          : m,
      ),
    );
    toast.success(`Membresía de ${memberName} reactivada con éxito.`);
  };

  const handleDeleteMember = (member: any) => {
    if (member.payments && member.payments.length > 0) {
      setCantDeleteWarningMember(member);
    } else {
      setDeleteConfirmMember(member.name);
    }
  };

  const confirmDeleteMemberAction = () => {
    if (!deleteConfirmMember) return;
    setMembersList((prev: any) => prev.filter((m: any) => m.name !== deleteConfirmMember));
    toast.success(`Alumno ${deleteConfirmMember} eliminado del sistema.`);
    setDeleteConfirmMember(null);
  };

  const handleFreezeMember = (memberName: string) => {
    setFreezeDialogMember(memberName);
    setFreezeDaysInput("15");
  };

  const handleUnfreezeMember = (memberName: string) => {
    setMembersList((prev: any) =>
      prev.map((m: any) =>
        m.name === memberName
          ? {
              ...m,
              status: "activo",
              color: getStatusBadgeColor("activo"),
              notes: (m.notes || "") + ` | Descongelado el ${new Date().toISOString().split("T")[0]}`,
            }
          : m,
      ),
    );
    toast.success(`Membresía de ${memberName} reactivada / descongelada con éxito.`);
  };

  const confirmFreezeMemberAction = () => {
    if (!freezeDialogMember) return;
    const days = parseInt(freezeDaysInput) || 15;
    setMembersList((prev: any) =>
      prev.map((m: any) => {
        if (m.name === freezeDialogMember) {
          return {
            ...m,
            status: "congelado",
            color: getStatusBadgeColor("congelado"),
            notes:
              (m.notes || "") +
              ` | Congelado ${days}d desde ${new Date().toISOString().split("T")[0]}`,
          };
        }
        return m;
      }),
    );
    toast.success(`Membresía de ${freezeDialogMember} congelada por ${days} días.`);
    setFreezeDialogMember(null);
  };

  const handleExportCSV = () => {
    if (!filteredMembers.length) {
      toast.error("No hay alumnos visibles para exportar.");
      return;
    }
    const headers = ["Nombre", "DNI", "Email", "Teléfono", "Plan", "Estado", "Vencimiento", "Apto Médico"];
    const rows = filteredMembers.map((m: any) => [
      `"${m.name || ""}"`,
      `"${m.dni || ""}"`,
      `"${m.email || ""}"`,
      `"${m.phone || ""}"`,
      `"${m.plan || ""}"`,
      `"${m.status || ""}"`,
      `"${m.end || ""}"`,
      `"${m.hasApto || "Pendiente"}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r: string[]) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `miembros_shakerfy_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Nómina de alumnos exportada a CSV con éxito.");
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
            color: getStatusBadgeColor("activo"),
            payments: [newPayment, ...existingPayments],
          };
        }
        return m;
      }),
    );
    toast.success(`Membresía de ${renewMemberId} renovada con éxito por ${renewMonths} mes(es).`);
    setRenewMemberId(null);
    setRenewMonths("1");
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
            Listado general de alumnos ({filteredMembers.length} de {membersList.length} registrados).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl gap-1.5 font-semibold text-xs h-9 border-border hover:bg-secondary"
            onClick={handleExportCSV}
          >
            <Download className="h-4 w-4 text-primary" /> Exportar CSV
          </Button>
          <Button size="sm" className="rounded-xl gap-1.5 font-bold h-9" onClick={() => setIsAddOpen(true)}>
            <Plus className="h-4 w-4" /> Agregar Miembro
          </Button>
        </div>
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
                <Textarea
                  value={newMember.medicalNotes}
                  onChange={(e) => setNewMember({ ...newMember, medicalNotes: e.target.value })}
                  placeholder="Ej: Problemas lumbares, asma, etc."
                  className="min-h-[80px] text-xs bg-background"
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
        <div className="group rounded-3xl border border-border bg-card p-5 flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg shadow-xs cursor-pointer">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
              Alumnos Activos
            </span>
            <span className="text-2xl font-black text-primary mt-1 block">{stats.actives}</span>
          </div>
          <Users className="h-8 w-8 text-primary/30" />
        </div>

        <div className="group rounded-3xl border border-border bg-card p-5 flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg shadow-xs cursor-pointer">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
              En Mora / Deuda
            </span>
            <span className="text-2xl font-black text-destructive mt-1 block">{stats.debts}</span>
          </div>
          <CreditCard className="h-8 w-8 text-destructive/30" />
        </div>

        <div className="group rounded-3xl border border-border bg-card p-5 flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg shadow-xs cursor-pointer">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
              Apto Vencido
            </span>
            <span className="text-2xl font-black text-amber-500 mt-1 block">{stats.expiredAptos}</span>
          </div>
          <AlertCircle className="h-8 w-8 text-amber-500/30" />
        </div>

        <div className="group rounded-3xl border border-border bg-card p-5 flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg shadow-xs cursor-pointer">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
              Riesgo de Baja
            </span>
            <span className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1 block">
              {stats.churnRisks}
            </span>
          </div>
          <ShieldAlert className="h-8 w-8 text-purple-500/30" />
        </div>
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
              <SelectTrigger className="w-full sm:w-[170px] h-9 bg-transparent -none border-border">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los activos</SelectItem>
                <SelectItem value="activos">Activos</SelectItem>
                <SelectItem value="vencidos">Deuda / Vencidos</SelectItem>
                <SelectItem value="congelados">Congelados</SelectItem>
                <SelectItem value="apto">Apto Vencido</SelectItem>
                <SelectItem value="archivados">Archivados / Bajas</SelectItem>
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

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs border-b border-border">
              <tr>
                <th className="px-5 py-3.5 font-medium whitespace-nowrap">Miembro</th>
                <th className="px-5 py-3.5 font-medium whitespace-nowrap">Email</th>
                <th className="px-5 py-3.5 font-medium whitespace-nowrap">Teléfono</th>
                <th className="px-5 py-3.5 font-medium whitespace-nowrap">Membresía</th>
                <th className="px-5 py-3.5 font-medium whitespace-nowrap">Vencimiento</th>
                <th className="px-5 py-3.5 font-medium whitespace-nowrap">Método de Pago</th>
                <th className="px-5 py-3.5 font-medium whitespace-nowrap">Estado</th>
                <th className="px-5 py-3.5 font-medium whitespace-nowrap">Asistencia</th>
                <th className="px-5 py-3.5 font-medium text-right whitespace-nowrap">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredMembers.map((m: any) => {
                const isOpen = expandedMember === m.name;
                const history = getMemberHistory(m.name);

                return (
                  <Fragment key={m.name}>
                    <tr
                      className={`hover:bg-muted/30 transition-colors cursor-pointer ${isOpen ? "bg-slate-100/80 dark:bg-muted/30" : ""}`}
                      onClick={() => setExpandedMember(isOpen ? null : m.name)}
                    >
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            src={m.photo}
                            alt={m.name}
                            className="h-10 w-10 rounded-full object-cover border border-border/40 shrink-0"
                          />
                          <div>
                            <span className="font-semibold text-foreground block">{m.name}</span>
                            {m.dni && <span className="text-[10.5px] text-muted-foreground">DNI: {m.dni}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                        {m.email || `${m.name.toLowerCase().replace(/ /g, "")}@email.com`}
                      </td>
                      <td className="px-5 py-3.5 text-xs whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span>{m.phone}</span>
                          <a
                            href={`https://wa.me/${m.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-500 hover:text-emerald-600 transition-colors"
                            title="Enviar WhatsApp"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-xs font-semibold text-foreground whitespace-nowrap">
                        {m.plan}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground whitespace-nowrap font-medium">
                        {m.end}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        {m.paymentMethod === "Mercado Pago (Auto)" || m.isAutoRenew ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                            💳 Mercado Pago (Auto)
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground font-medium">
                            {m.paymentMethod || "Efectivo / Transferencia"}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${getStatusBadgeColor(m.status)}`}
                        >
                          {m.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
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
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-destructive/10 text-destructive border border-destructive/20">
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
                                               <DropdownMenuContent align="end" className="w-52 rounded-xl p-1.5 shadow-xl border-border">
                                {m.status === "cancelado" ? (
                                  <DropdownMenuItem onClick={() => handleReactivateMember(m.name)}>
                                    <UserCheck className="h-4 w-4 mr-2 text-emerald-500" /> Reactivar Alumno
                                  </DropdownMenuItem>
                                ) : (
                                  <>
                                    <DropdownMenuItem onClick={() => setRenewMemberId(m.name)}>
                                      <CreditCard className="h-4 w-4 mr-2 text-primary" /> Renovar / Cobrar
                                    </DropdownMenuItem>
                                    {m.status === "congelado" ? (
                                      <DropdownMenuItem onClick={() => handleUnfreezeMember(m.name)}>
                                        <Zap className="h-4 w-4 mr-2 text-emerald-500" /> Descongelar Membresía
                                      </DropdownMenuItem>
                                    ) : (
                                      <DropdownMenuItem onClick={() => handleFreezeMember(m.name)}>
                                        <Snowflake className="h-4 w-4 mr-2 text-blue-400" /> Congelar Membresía
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem onClick={() => handleValidateApto(m.name)}>
                                      <CheckCircle2 className="h-4 w-4 mr-2 text-primary" /> Validar Apto Médico
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleEditMemberClick(m)}>
                                      <Edit2 className="h-4 w-4 mr-2" /> Editar Alumno
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="text-amber-600 dark:text-amber-400 focus:text-amber-600"
                                      onClick={() => handleCancelPlan(m)}
                                    >
                                      <ShieldAlert className="h-4 w-4 mr-2" /> Dar de baja / Archivar
                                    </DropdownMenuItem>
                                  </>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleDeleteMember(m)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" /> Eliminar Definitivamente
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
                      <tr className="bg-slate-50/70 dark:bg-background border-b border-border/60">
                        <td colSpan={9} className="p-0">
                          <div className="sticky left-0 min-w-full p-6 space-y-5 animate-fade-in border-t border-border/60 bg-slate-50/70 dark:bg-background">
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
                                      `¡Hola ${m.name}! Te extrañamos en Shakerfy. Notamos que hace unos días no vienes a entrenar y queríamos saber si estaba todo bien o si necesitabas ayuda con tus reservas. ¡Te esperamos! 💪`,
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
                              <div className="group rounded-3xl border border-border bg-card p-5 space-y-4 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg shadow-xs h-full flex flex-col justify-between">
                                <div className="flex flex-col h-full justify-between space-y-3.5">
                                  <div className="flex items-center justify-between pb-2 border-b border-border/40">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                                      Próximas Clases Agendadas
                                    </span>
                                    <span className="text-[10px] text-muted-foreground/70 font-semibold uppercase tracking-wider">
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
              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="h-10 w-10 text-muted-foreground/40" />
                      <p className="font-semibold text-sm">No se encontraron miembros</p>
                      <p className="text-xs text-muted-foreground/80">
                        Intenta ajustar la búsqueda o los filtros seleccionados.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
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
        <DialogContent className="max-w-md rounded-3xl p-6 border-border shadow-2xl bg-card">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-foreground flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" /> Registrar Pago / Renovar Plan
            </DialogTitle>
          </DialogHeader>
          {(() => {
            const memberObj = membersList.find((m: any) => m.name === renewMemberId);
            const isMp =
              memberObj?.paymentMethod === "Mercado Pago (Auto)" || memberObj?.isAutoRenew;
            return (
              <div className="py-2 space-y-4">
                <p className="text-xs text-muted-foreground">
                  ¿Confirmás la renovación del plan para{" "}
                  <strong className="text-foreground font-bold">{renewMemberId}</strong>?
                </p>

                {isMp && (
                  <div className="p-3.5 bg-blue-500/10 border border-blue-500/30 rounded-2xl space-y-2.5 text-xs">
                    <div className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                      <span>💳 Alumno con Débito Automático Activo</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Este alumno abona mediante Mercado Pago. Selecciona la acción a tomar en la pasarela al registrar este cobro manual:
                    </p>
                    <RadioGroup
                      value={mpRenewAction}
                      onValueChange={(val: "skip" | "cancel") => setMpRenewAction(val)}
                      className="space-y-2 pt-1"
                    >
                      <div className="flex items-start gap-2.5 cursor-pointer font-medium text-[11px]">
                        <RadioGroupItem value="skip" id="mp-skip" className="mt-0.5" />
                        <Label htmlFor="mp-skip" className="cursor-pointer font-normal">
                          <span className="font-bold block text-foreground">Saltear este mes en Mercado Pago</span>
                          <span className="text-muted-foreground text-[10px]">Pospone la fecha del próximo débito automático 30 días.</span>
                        </Label>
                      </div>
                      <div className="flex items-start gap-2.5 cursor-pointer font-medium text-[11px]">
                        <RadioGroupItem value="cancel" id="mp-cancel" className="mt-0.5" />
                        <Label htmlFor="mp-cancel" className="cursor-pointer font-normal">
                          <span className="font-bold block text-foreground">Cancelar Débito Automático</span>
                          <span className="text-muted-foreground text-[10px]">Cancela la suscripción en MP para pasar a pago manual permanente.</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Duración de la renovación</Label>
                  <Select value={renewMonths} onValueChange={setRenewMonths}>
                    <SelectTrigger className="h-9 rounded-xl text-xs bg-secondary/30">
                      <SelectValue placeholder="Seleccionar duración" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="1">1 Mes</SelectItem>
                      <SelectItem value="3">3 Meses (Trimestre)</SelectItem>
                      <SelectItem value="6">6 Meses (Semestre)</SelectItem>
                      <SelectItem value="12">12 Meses (Año)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-muted-foreground bg-primary/10 text-primary p-2.5 rounded-xl border border-primary/20">
                  Se actualizará su estado a <span className="font-bold">Activo</span> y se extenderá su
                  vencimiento por {renewMonths} mes{renewMonths === "1" ? "" : "es"}.
                </p>
              </div>
            );
          })()}
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              className="rounded-xl font-bold"
              onClick={() => {
                setRenewMemberId(null);
                setRenewMonths("1");
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleRenewMember}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-xl"
            >
              Confirmar Pago
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal AlertDialog para Confirmar Baja de Alumno (Shadcn/ui) */}
      <AlertDialog open={!!cancelConfirmMember} onOpenChange={(open) => !open && setCancelConfirmMember(null)}>
        <AlertDialogContent className="rounded-3xl border-border shadow-2xl bg-card max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-black text-foreground flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-500" /> Dar de Baja / Archivar Alumno
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground pt-1 space-y-2">
              <span>¿Confirmás la baja del alumno <strong className="text-foreground">{cancelConfirmMember?.name}</strong>?</span>
              {(cancelConfirmMember?.paymentMethod === "Mercado Pago (Auto)" || cancelConfirmMember?.isAutoRenew) && (
                <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-700 dark:text-amber-300 font-medium text-[11px] leading-relaxed mt-2">
                  ⚠️ <strong>Aviso Mercado Pago:</strong> Este alumno tiene una suscripción activa de Débito Automático. Al darlo de baja, la suscripción se cancelará automáticamente en Mercado Pago para evitar cobros futuros.
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2">
            <AlertDialogCancel className="rounded-xl font-bold">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl font-bold bg-amber-600 text-white hover:bg-amber-700"
              onClick={confirmCancelPlanAction}
            >
              Confirmar Baja
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal AlertDialog de Protección contra Borrado Físico (Hard Delete Guard) */}
      <AlertDialog open={!!cantDeleteWarningMember} onOpenChange={(open) => !open && setCantDeleteWarningMember(null)}>
        <AlertDialogContent className="rounded-3xl border-border shadow-2xl bg-card max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-black text-foreground flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" /> No es posible eliminar
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground pt-1 space-y-2">
              <span>No se puede eliminar físicamente la ficha de <strong className="text-foreground">{cantDeleteWarningMember?.name}</strong> porque cuenta con registros contables de pagos en Caja o Mercado Pago.</span>
              <div className="p-3 bg-muted/40 border border-border/60 rounded-2xl text-foreground font-medium text-[11px] leading-relaxed mt-2">
                💡 <strong>Recomendación de Producción:</strong> Te sugerimos usar la opción <strong>"Dar de Baja / Archivar"</strong> para pausar la cuenta y cancelar sus débitos sin alterar la integridad de tus reportes financieros.
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogAction
              className="rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setCantDeleteWarningMember(null)}
            >
              Entendido
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal Shadcn UI para Congelar Membresía */}
      <Dialog open={!!freezeDialogMember} onOpenChange={(open) => !open && setFreezeDialogMember(null)}>
        <DialogContent className="max-w-md rounded-3xl p-6 border-border shadow-2xl bg-card">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-foreground flex items-center gap-2">
              <Snowflake className="h-5 w-5 text-blue-500" /> Congelar Membresía
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1">
              Selecciona o ingresa por cuántos días deseas pausar la membresía de <strong className="text-foreground">{freezeDialogMember}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Días de Congelamiento</Label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {["7", "15", "30", "45", "60"].map((d) => (
                  <Button
                    key={d}
                    type="button"
                    variant={freezeDaysInput === d ? "default" : "outline"}
                    size="sm"
                    className="rounded-xl text-xs font-bold"
                    onClick={() => setFreezeDaysInput(d)}
                  >
                    {d} días
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Otro período (días personalizados):</Label>
              <Input
                type="number"
                value={freezeDaysInput}
                onChange={(e) => setFreezeDaysInput(e.target.value)}
                className="rounded-xl text-xs bg-secondary/30"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-xl font-bold" onClick={() => setFreezeDialogMember(null)}>
              Cancelar
            </Button>
            <Button className="rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white" onClick={confirmFreezeMemberAction}>
              Confirmar Congelamiento
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
              <div className="border border-border/80 p-4 bg-secondary/30 rounded-xl space-y-3 relative overflow-hidden">
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
              <DialogFooter className="sm:justify-end flex flex-wrap gap-2 pt-2">
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-xs font-bold rounded-xl border-border hover:bg-secondary"
                      >
                        <Send className="w-3.5 h-3.5 text-primary" />
                        <span>Compartir</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl p-1.5 shadow-xl border-border">
                      <DropdownMenuItem
                        disabled={!viewingReceipt.member.phone}
                        onClick={() => {
                          const phone = (viewingReceipt.member.phone || "").replace(/[^0-9]/g, "");
                          const shareText = encodeURIComponent(
                            `🧾 Recibo de Pago - Shakerfy\n\nAlumno: ${viewingReceipt.member.name}\nConcepto: Membresía ${viewingReceipt.member.plan} (${viewingReceipt.payment.duration})\nMonto: $${viewingReceipt.payment.amount}\nFecha: ${viewingReceipt.payment.date}\nNº Recibo: ${viewingReceipt.payment.id}\n\n¡Gracias por entrenar con nosotros! 💪`,
                          );
                          window.open(`https://wa.me/${phone}?text=${shareText}`, "_blank");
                          toast.success("Recibo compartido por WhatsApp.");
                        }}
                        className="text-xs font-medium cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4 mr-2 text-emerald-500" />
                        <span>Por WhatsApp</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={!viewingReceipt.member.email}
                        onClick={() => {
                          const email = viewingReceipt.member.email || "";
                          const mailSubject = encodeURIComponent(
                            `Recibo de Pago Nº ${viewingReceipt.payment.id} - Shakerfy`,
                          );
                          const mailBody = encodeURIComponent(
                            `Hola ${viewingReceipt.member.name},\n\nAquí tienes el comprobante de tu recibo de pago:\n\nConcepto: Membresía ${viewingReceipt.member.plan} (${viewingReceipt.payment.duration})\nMonto Total: $${viewingReceipt.payment.amount}\nFecha: ${viewingReceipt.payment.date}\nNº Comprobante: ${viewingReceipt.payment.id}\n\n¡Gracias por entrenar con nosotros!`,
                          );
                          window.open(`mailto:${email}?subject=${mailSubject}&body=${mailBody}`);
                          toast.success("Recibo compartido por Email.");
                        }}
                        className="text-xs font-medium cursor-pointer"
                      >
                        <Send className="w-4 h-4 mr-2 text-blue-500" />
                        <span>Por Correo</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    size="sm"
                    onClick={() => {
                      window.print();
                    }}
                    className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl font-bold"
                  >
                    <Download className="w-3.5 h-3.5" /> Imprimir Recibo
                  </Button>
                </div>
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
  isFeatured?: boolean;
}

interface MembresiasTabProps {
  membershipsList: Membership[];
  setMembershipsList: React.Dispatch<React.SetStateAction<Membership[]>>;
  amenities: { id: string; name: string; category: string; checked: boolean }[];
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

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [tagFilter, setTagFilter] = useState("all");
  const [periodicityFilter, setPeriodicityFilter] = useState("all");

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

  const handleDuplicatePlan = (m: Membership) => {
    const newPlan: Membership = {
      ...m,
      id: `plan-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: `${m.name} (Copia)`,
      activeCount: 0,
      isFeatured: false,
    };
    setMembershipsList((prev) => [...prev, newPlan]);
    toast.success(`✓ Plan "${m.name}" duplicado como "${newPlan.name}".`);
  };

  const handleToggleFeaturedPlan = (id: string) => {
    setMembershipsList((prev) =>
      prev.map((m) => ({
        ...m,
        isFeatured: m.id === id ? !m.isFeatured : false,
      })),
    );
    const target = membershipsList.find((m) => m.id === id);
    if (target && !target.isFeatured) {
      toast.success(`★ Plan "${target.name}" marcado como Plan Destacado.`);
    } else {
      toast.info("Plan quitado de destacados.");
    }
  };

  const filteredMemberships = useMemo(() => {
    return membershipsList.filter((m) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        m.name.toLowerCase().includes(q) ||
        (m.tag && m.tag.toLowerCase().includes(q)) ||
        (m.includedActivities && m.includedActivities.some((act) => act.toLowerCase().includes(q)));

      const matchTag =
        tagFilter === "all"
          ? true
          : tagFilter === "featured"
          ? !!m.isFeatured
          : m.tag === tagFilter;

      const matchPeriod = periodicityFilter === "all" || m.duration === periodicityFilter;

      return matchSearch && matchTag && matchPeriod;
    });
  }, [membershipsList, searchQuery, tagFilter, periodicityFilter]);

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
                <Input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground"
                  placeholder="Ej: Pase Libre"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Precio ($)</label>
                <Input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground"
                  placeholder="25000"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Original/Tachado ($)
                </label>
                <Input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
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
                  <Input
                    type="number"
                    required
                    value={creditsCount}
                    onChange={(e) => setCreditsCount(e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground"
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
                    <Input
                      type="text"
                      value={offPeakStart}
                      onChange={(e) => setOffPeakStart(e.target.value)}
                      className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground font-semibold"
                      placeholder="12:00"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-muted-foreground">Hasta</label>
                    <Input
                      type="text"
                      value={offPeakEnd}
                      onChange={(e) => setOffPeakEnd(e.target.value)}
                      className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground font-semibold"
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
                <Input
                  type="number"
                  value={registrationFee}
                  onChange={(e) => setRegistrationFee(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground font-semibold"
                  placeholder="0 = Sin matrícula"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground block">
                  Días Congelamiento/Año
                </label>
                <Input
                  type="number"
                  value={freezeDays}
                  onChange={(e) => setFreezeDays(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground font-semibold"
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

              <Input
                type="text"
                value={searchActivity}
                onChange={(e) => setSearchActivity(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground font-semibold"
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

      {/* Search & Multi-Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-secondary/20 border border-border/50 rounded-2xl">
        <div className="relative flex-1 min-w-[200px] sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por nombre o actividad..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full pl-8 pr-3 rounded-xl border border-border bg-background text-xs font-bold text-foreground placeholder:font-normal placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Select value={tagFilter} onValueChange={setTagFilter}>
            <SelectTrigger className="w-full sm:w-[170px] h-9 rounded-xl border border-border bg-background text-xs font-bold text-foreground">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-border bg-popover text-popover-foreground">
              <SelectItem value="all">Todas las Categorías</SelectItem>
              <SelectItem value="featured">★ Plan Destacado</SelectItem>
              <SelectItem value="Pase Libre">Pase Libre</SelectItem>
              <SelectItem value="Planes Premium">Planes Premium</SelectItem>
              <SelectItem value="Solo Clases">Solo Clases</SelectItem>
            </SelectContent>
          </Select>

          <Select value={periodicityFilter} onValueChange={setPeriodicityFilter}>
            <SelectTrigger className="w-full sm:w-[160px] h-9 rounded-xl border border-border bg-background text-xs font-bold text-foreground">
              <SelectValue placeholder="Periodicidad" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-border bg-popover text-popover-foreground">
              <SelectItem value="all">Todas las Duraciones</SelectItem>
              <SelectItem value="Semanal">Semanal</SelectItem>
              <SelectItem value="Mensual">Mensual</SelectItem>
              <SelectItem value="Trimestral">Trimestral</SelectItem>
              <SelectItem value="Semestral">Semestral</SelectItem>
              <SelectItem value="Anual">Anual</SelectItem>
            </SelectContent>
          </Select>

          {(searchQuery || tagFilter !== "all" || periodicityFilter !== "all") && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setTagFilter("all");
                setPeriodicityFilter("all");
              }}
              className="h-9 text-[11px] font-bold text-muted-foreground hover:text-rose-600 rounded-xl"
            >
              Limpiar Filtros
            </Button>
          )}
        </div>
      </div>

      {filteredMemberships.length === 0 ? (
        <div className="p-8 text-center bg-card border border-border/80 rounded-3xl text-muted-foreground italic text-xs">
          No se encontraron planes de membresía con los filtros seleccionados.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {filteredMemberships.map((m) => (
            <div
              key={m.id}
              className={`rounded-3xl border bg-card p-6 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 shadow-xs ${
                m.isFeatured
                  ? "border-amber-500/50 dark:border-amber-400/50 ring-1 ring-amber-500/30 shadow-md"
                  : "border-border hover:border-foreground/30"
              }`}
            >
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-bold text-lg text-foreground">{m.name}</h3>
                      {m.isFeatured && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/30 text-[9.5px] font-black flex items-center gap-1">
                          ★ Más Elegido
                        </span>
                      )}
                    </div>
                    {m.tag && (
                      <span className="inline-block mt-1.5 text-[9.5px] font-extrabold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {m.tag}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground font-semibold bg-secondary/50 px-2.5 py-1 rounded-xl border border-border/50">
                    {m.duration}
                  </span>
                </div>
                <div className="mt-4 text-3xl font-extrabold tracking-tight text-foreground">
                  {m.originalPrice && (
                    <span className="text-sm font-normal text-muted-foreground line-through mr-2">
                      ${m.originalPrice.toLocaleString("es-AR")}
                    </span>
                  )}
                  ${m.price.toLocaleString("es-AR")}
                </div>

                {/* Pass Type & Hours Badges (Clean Lucide Icons) */}
                <div className="mt-4 space-y-2 border-t border-border/60 pt-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Ticket className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>
                      {m.passType === "Por Créditos"
                        ? `${m.creditsCount} clases / créditos`
                        : "Pase Libre (Ilimitado)"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span>
                      {m.accessHoursType === "Off-Peak"
                        ? `Franja Off-Peak (${m.offPeakStart} - ${m.offPeakEnd} hs)`
                        : "Acceso Completo (Todo Horario)"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span>
                      {m.registrationFee && m.registrationFee > 0
                        ? `Matrícula: $${m.registrationFee.toLocaleString("es-AR")}`
                        : "Matrícula Bonificada"}
                    </span>
                  </div>
                  {m.freezeDays && m.freezeDays > 0 ? (
                    <div className="flex items-center gap-2">
                      <Snowflake className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                      <span>Congelamiento: {m.freezeDays} días/año</span>
                    </div>
                  ) : null}
                  {m.dailyClassLimit && m.dailyClassLimit !== "Ilimitado" ? (
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
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
                        className="text-[9.5px] bg-secondary text-secondary-foreground border border-border/50 px-2.5 py-0.5 rounded-full font-bold"
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
                        className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" /> {serviceName}
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
                <div className="border-t border-border/60 pt-4 flex items-center justify-between text-xs text-muted-foreground font-semibold">
                  <span>Miembros activos:</span>
                  <span className="font-bold text-foreground bg-secondary/80 border border-border/60 px-2.5 py-0.5 rounded-full font-mono">
                    {m.activeCount}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleToggleFeaturedPlan(m.id)}
                    className={`flex items-center justify-center gap-1 px-2 py-1.5 rounded-xl border text-[10.5px] font-bold transition ${
                      m.isFeatured
                        ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 hover:bg-amber-500/20"
                        : "border-border bg-background hover:bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                    title="Marcar como Plan Destacado en el Perfil del Gimnasio"
                  >
                    <Star className={`h-3.5 w-3.5 ${m.isFeatured ? "fill-amber-500 text-amber-500" : ""}`} />
                    {m.isFeatured ? "Destacado" : "Destacar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDuplicatePlan(m)}
                    className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-xl border border-border bg-background hover:bg-secondary text-[10.5px] text-muted-foreground hover:text-foreground font-bold transition"
                    title="Duplicar plan"
                  >
                    <Copy className="h-3.5 w-3.5" /> Clonar
                  </button>
                  <button
                    type="button"
                    onClick={() => openEditModal(m)}
                    className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-xl border border-border bg-background hover:bg-secondary text-[10.5px] text-muted-foreground hover:text-foreground font-bold transition"
                  >
                    <Edit2 className="h-3.5 w-3.5" /> Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (m.activeCount > 0) {
                        toast.error(
                          `No se puede eliminar el plan "${m.name}" porque tiene ${m.activeCount} alumnos activos.`,
                        );
                      } else {
                        setDeletingPlan(m);
                        setDeleteConfirmText("");
                      }
                    }}
                    className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-xl border border-border bg-background hover:bg-rose-500/10 hover:text-rose-600 text-[10.5px] text-muted-foreground font-bold transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
                <Input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Precio ($)</label>
                <Input
                  type="number"
                  required
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Original/Tachado ($)
                </label>
                <Input
                  type="number"
                  value={editOriginalPrice}
                  onChange={(e) => setEditOriginalPrice(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
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
                  <Input
                    type="number"
                    required
                    value={editCreditsCount}
                    onChange={(e) => setEditCreditsCount(e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground"
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
                    <Input
                      type="text"
                      value={editOffPeakStart}
                      onChange={(e) => setEditOffPeakStart(e.target.value)}
                      className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-muted-foreground">Hasta</label>
                    <Input
                      type="text"
                      value={editOffPeakEnd}
                      onChange={(e) => setEditOffPeakEnd(e.target.value)}
                      className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground font-semibold"
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
                <Input
                  type="number"
                  value={editRegistrationFee}
                  onChange={(e) => setEditRegistrationFee(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground font-semibold"
                  placeholder="0 = Sin matrícula"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground block">
                  Días Congelamiento/Año
                </label>
                <Input
                  type="number"
                  value={editFreezeDays}
                  onChange={(e) => setEditFreezeDays(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground font-semibold"
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

              <Input
                type="text"
                value={editSearchActivity}
                onChange={(e) => setEditSearchActivity(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground font-semibold"
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

      {/* Delete Membership AlertDialog */}
      {deletingPlan && (
        <AlertDialog open={!!deletingPlan} onOpenChange={(open) => !open && setDeletingPlan(null)}>
          <AlertDialogContent className="sm:max-w-md border border-border bg-card p-6 rounded-3xl shadow-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-rose-600" /> Confirmar Eliminación de Plan
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs text-muted-foreground pt-1">
                Para confirmar la eliminación definitiva del plan <strong>"{deletingPlan.name}"</strong>, escribe la palabra clave <strong>ELIMINAR</strong> a continuación:
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="py-2 space-y-2">
              <Input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-center font-bold text-foreground placeholder:font-normal"
                placeholder="Escribe ELIMINAR para confirmar"
              />
            </div>

            <AlertDialogFooter className="gap-2 pt-2">
              <AlertDialogCancel
                onClick={() => setDeletingPlan(null)}
                className="rounded-xl text-xs font-bold border-border"
              >
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeletePlan}
                disabled={deleteConfirmText !== "ELIMINAR"}
                className="rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs disabled:opacity-50"
              >
                Sí, Eliminar Plan
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
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
    description?: string;
  }[];
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
  const [creditsCost, setCreditsCost] = useState("1");
  const [salaId, setSalaId] = useState("");
  const [day, setDay] = useState(0);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("calendar");
  const [selectedCalendarSalaId, setSelectedCalendarSalaId] = useState("");
  const [customCapacity, setCustomCapacity] = useState(20);
  const [requiresSpotSelection, setRequiresSpotSelection] = useState(true);



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

  const time = `${startTime}-${endTime}`;

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

  const staffForClassOptions = useMemo(() => {
    const list = filteredStaffForClass.length > 0 ? filteredStaffForClass : staffList;
    if (staffId && !list.some((s) => s.id === staffId)) {
      const selectedCoach = staffList.find((s) => s.id === staffId);
      if (selectedCoach) {
        return [selectedCoach, ...list];
      }
    }
    return list;
  }, [filteredStaffForClass, staffList, staffId]);

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
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg text-foreground hover:bg-background disabled:opacity-30"
              onClick={() => setCurrentWeekOffset((prev) => Math.max(0, prev - 1))}
              disabled={currentWeekOffset === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs font-bold px-2 text-foreground/80 min-w-[70px] text-center select-none">
              Semana {currentWeekOffset + 1}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg text-foreground hover:bg-background"
              onClick={() => setCurrentWeekOffset((prev) => prev + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex rounded-xl bg-secondary p-1 border border-border/50 shrink-0">
            <Button
              type="button"
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              className={`h-7 text-xs font-semibold rounded-lg ${
                viewMode === "list" ? "bg-background text-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setViewMode("list")}
            >
              Lista de Hoy
            </Button>
            <Button
              type="button"
              variant={viewMode === "calendar" ? "secondary" : "ghost"}
              size="sm"
              className={`h-7 text-xs font-semibold rounded-lg ${
                viewMode === "calendar" ? "bg-background text-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setViewMode("calendar")}
            >
              Vista Semanal
            </Button>
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch mt-6">
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

      {/* Barra de Filtros de Clases - Visible en Vista Semanal y Lista de Hoy */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-card border border-border rounded-3xl shadow-xs mt-6 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary shrink-0" />
          <span className="font-bold text-xs uppercase tracking-wider text-muted-foreground/90">
            Filtrar clases:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Room Filter */}
          <Select
            value={selectedCalendarSalaId || "all"}
            onValueChange={(val) => setSelectedCalendarSalaId(val === "all" ? "" : val)}
          >
            <SelectTrigger className="h-8 rounded-xl border border-border bg-background px-3 text-xs text-foreground font-bold w-[160px]">
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
            <SelectTrigger className="h-8 rounded-xl border border-border bg-background px-3 text-xs text-foreground font-bold w-[170px]">
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
            <SelectTrigger className="h-8 rounded-xl border border-border bg-background px-3 text-xs text-foreground font-bold w-[170px]">
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
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedCalendarSalaId("");
                setSelectedFilterCoachId("");
                setSelectedFilterActivity("");
              }}
              className="h-8 px-3 text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl transition border border-rose-500/20 shrink-0"
            >
              Limpiar filtros
            </Button>
          )}
        </div>
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
                    {name &&
                      ![
                        "CrossFit",
                        "CrossFit WOD",
                        "Entrenamiento Funcional",
                        "Funcional HIIT",
                        "Levantamiento Olímpico",
                        "Powerlifting",
                        "Calistenia",
                        "Fuerza de Potencia",
                        "Spinning",
                        "Spinning Pro",
                        "HIIT / Tabata",
                        "Boxeo Recreativo",
                        "Kickboxing",
                        "Zumba",
                        "Ritmos / Dance",
                        "Yoga Ashtanga",
                        "Yoga Vinyasa",
                        "Yoga Hatha",
                        "Pilates Reformer",
                        "Pilates Mat",
                        "Barré",
                        "Estiramiento / Flex",
                        "Meditación",
                        "GAP",
                        "AquaGym",
                        "Running Club",
                        "Tercera Edad Adaptada",
                      ].includes(name) && (
                        <SelectGroup>
                          <SelectLabel>Actividad Seleccionada</SelectLabel>
                          <SelectItem value={name}>{name}</SelectItem>
                        </SelectGroup>
                      )}
                    <SelectGroup>
                      <SelectLabel>Fuerza y Musculación</SelectLabel>
                      <SelectItem value="CrossFit WOD">CrossFit WOD</SelectItem>
                      <SelectItem value="CrossFit">CrossFit</SelectItem>
                      <SelectItem value="Entrenamiento Funcional">Entrenamiento Funcional</SelectItem>
                      <SelectItem value="Funcional HIIT">Funcional HIIT</SelectItem>
                      <SelectItem value="Levantamiento Olímpico">Levantamiento Olímpico</SelectItem>
                      <SelectItem value="Powerlifting">Powerlifting</SelectItem>
                      <SelectItem value="Calistenia">Calistenia</SelectItem>
                      <SelectItem value="Fuerza de Potencia">Fuerza de Potencia</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Cardio y Combate</SelectLabel>
                      <SelectItem value="Spinning Pro">Spinning Pro</SelectItem>
                      <SelectItem value="Spinning">Spinning / Cycling</SelectItem>
                      <SelectItem value="HIIT / Tabata">HIIT / Tabata</SelectItem>
                      <SelectItem value="Boxeo Recreativo">Boxeo Recreativo</SelectItem>
                      <SelectItem value="Kickboxing">Kickboxing</SelectItem>
                      <SelectItem value="Zumba">Zumba Fitness</SelectItem>
                      <SelectItem value="Ritmos / Dance">Ritmos / Dance</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Flexibilidad y Cuerpo-Mente</SelectLabel>
                      <SelectItem value="Yoga Ashtanga">Yoga Ashtanga</SelectItem>
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
                </div>
                <Select value={staffId} onValueChange={setStaffId}>
                  <SelectTrigger className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground font-semibold">
                    <SelectValue placeholder="Selecciona un entrenador..." />
                  </SelectTrigger>
                  <SelectContent>
                    {staffForClassOptions.map((s) => (
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



            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Cupos / Capacidad Máxima
                </label>
                <Input
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
                  className="h-10 rounded-xl text-sm font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Créditos Necesarios
                </label>
                <Input
                  type="number"
                  required
                  min="1"
                  value={creditsCost}
                  onChange={(e) => setCreditsCost(e.target.value)}
                  className="h-10 rounded-xl text-sm font-semibold"
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
                  <Checkbox
                    id="isRecurrent"
                    checked={isRecurrent}
                    onCheckedChange={(checked) => setIsRecurrent(!!checked)}
                  />
                  <label
                    htmlFor="isRecurrent"
                    className="text-xs font-bold text-foreground cursor-pointer select-none flex items-center gap-1.5"
                  >
                    <Repeat className="h-3.5 w-3.5 text-primary" /> Programar como Clase Recurrente (semanal)
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
        <div className="space-y-4">
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
                            const matchesWeek = (c.weekOffset || 0) === currentWeekOffset;
                            return matchesWeek;
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
      )}

      {renderClassDetailSidebar()}
    </Fragment>
  );
}

// Subcomponent: Config Tab
interface ConfigTabProps {
  staffList: {
    id: string;
    name: string;
    specialty: string;
    certifications: string[];
    photo: string;
    certificationImages?: string[];
    role?: string;
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
    branchId?: string;
    description?: string;
  }[];
  setSalasList: React.Dispatch<
    React.SetStateAction<
      { id: string; name: string; capacity?: number; branchId?: string; description?: string }[]
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

  // Payment methods states (Métodos de Cobro)
  const [cashEnabled, setCashEnabled] = useState(true);
  const [transferEnabled, setTransferEnabled] = useState(true);
  const [bankDetails, setBankDetails] = useState({
    alias: "GIMNASIO.SHAKERFY",
    cbu: "0000003100049281749281",
    bankName: "Banco Galicia",
    accountHolder: "Shakerfy Gym SRL",
    cuit: "30-71629401-9",
  });
  const [posEnabled, setPosEnabled] = useState(true);
  const [mpEnabled, setMpEnabled] = useState(true);
  const [mpConnected, setMpConnected] = useState(false);
  const [mpIsConnecting, setMpIsConnecting] = useState(false);
  const [mpAccountInfo, setMpAccountInfo] = useState<{
    merchantName: string;
    email: string;
    accountId: string;
    accessToken: string;
    publicKey: string;
    linkedDate: string;
  } | null>(null);
  const [mpUseSandbox, setMpUseSandbox] = useState(false);
  const [mpSubscriptionsEnabled, setMpSubscriptionsEnabled] = useState(true);
  const [mpInstallmentsEnabled, setMpInstallmentsEnabled] = useState(true);

  const handleConnectMercadoPago = () => {
    setMpIsConnecting(true);
    setTimeout(() => {
      setMpConnected(true);
      setMpAccountInfo({
        merchantName: "Gimnasio Shakerfy",
        email: "pagos@shakerfy.com",
        accountId: "MP-USR-82947192",
        accessToken: "APP_USR-8492049281940291-080215-9482710492-748392",
        publicKey: "APP_USR-83921049-8392-4920-b481-948201948291",
        linkedDate: new Date().toLocaleDateString("es-AR"),
      });
      setMpIsConnecting(false);
      toast.success("★ Cuenta de Mercado Pago vinculada exitosamente vía OAuth");
    }, 1200);
  };

  const handleDisconnectMercadoPago = () => {
    setMpConnected(false);
    setMpAccountInfo(null);
    toast.info("Cuenta de Mercado Pago desvinculada.");
  };

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
          { id: "basico", label: "Ficha Básica", icon: Building2 },
          { id: "politicas", label: "Políticas", icon: ShieldCheck },
          { id: "amenities", label: "Amenities & Servicios", icon: Sparkles },
          { id: "equipamiento", label: "Equipamiento", icon: Dumbbell },
          { id: "requisitos", label: "Normas de Ingreso", icon: FileCheck },
          { id: "staff", label: "Equipo (Staff)", icon: Users },
          { id: "salas", label: "Salas / Salones", icon: Layers },
          { id: "cierres", label: "Días de Cierre", icon: CalendarX },
          { id: "metodos_pago", label: "Métodos de Cobro", icon: Wallet },
        ].map((sub) => {
          const Icon = sub.icon;
          const isActive = subTab === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => setSubTab(sub.id)}
              className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
                isActive
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
              {sub.label}
            </button>
          );
        })}
      </div>

      <>
          {/* Subtab 1: Basic Config & 7-Day Scheduler */}
          {subTab === "basico" && (
            <div className="space-y-6 max-w-3xl">
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
                                  ? "Coach"
                                  : s.role === "receptionist"
                                    ? "Recep"
                                    : "Manager"}
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

          {/* Universal Delete AlertDialog */}
          {deletingItem && (
            <AlertDialog open={!!deletingItem} onOpenChange={(open) => !open && setDeletingItem(null)}>
              <AlertDialogContent className="sm:max-w-md border border-border bg-card p-6 rounded-3xl shadow-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
                    <Trash2 className="h-5 w-5 text-rose-600" /> Confirmar Eliminación
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-xs text-muted-foreground pt-1 leading-relaxed">
                    Estás a punto de eliminar <strong>"{deletingItem?.name}"</strong> del sistema. Para confirmar la eliminación definitiva, escribe la palabra clave <strong>ELIMINAR</strong> a continuación:
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="py-2 space-y-2">
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-center focus-visible:outline-none font-bold text-foreground placeholder:font-normal"
                    placeholder="Escribe ELIMINAR para confirmar"
                  />
                </div>

                <AlertDialogFooter className="gap-2 pt-2">
                  <AlertDialogCancel
                    onClick={() => setDeletingItem(null)}
                    className="rounded-xl text-xs font-bold border-border"
                  >
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleConfirmRemoveItem}
                    disabled={deleteConfirmText.trim().toLowerCase() !== "eliminar"}
                    className="rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs disabled:opacity-50"
                  >
                    Sí, Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
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
                  {salasList.map((sala) => (
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
                  {salasList.length === 0 && (
                    <p className="text-xs text-muted-foreground italic py-3 text-center font-medium">
                      No hay salas registradas.
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

          {/* Subtab 9: Métodos de Cobro & Mercado Pago OAuth */}
          {subTab === "metodos_pago" && (
            <div className="space-y-8 max-w-4xl animate-fade-up text-foreground">
              {/* Encabezado */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
                <div>
                  <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-primary" /> Métodos de Cobro y Pagos Digitales
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Activa y gestiona las pasarelas de pago digitales y cobros presenciales habilitados para tu gimnasio.
                  </p>
                </div>
              </div>

              {/* Tarjeta Destacada: Mercado Pago Integración OAuth */}
              <div className="rounded-3xl border border-[#009EE3]/30 bg-gradient-to-b from-[#009EE3]/5 to-card p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-[#009EE3] text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
                      <Zap className="h-6 w-6 fill-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-base text-foreground">Mercado Pago</h4>
                        {mpConnected ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full uppercase">
                            <CheckCircle2 className="h-3 w-3" /> Conectado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full uppercase">
                            <AlertCircle className="h-3 w-3" /> No Vinculado
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Permite que tus alumnos paguen con tarjetas de crédito, débito, dinero en cuenta o suscripciones automáticas.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-muted-foreground">Habilitar MP:</span>
                    <Switch
                      checked={mpEnabled}
                      onCheckedChange={setMpEnabled}
                    />
                  </div>
                </div>

                {/* Status Box & OAuth Action */}
                {!mpConnected ? (
                  <div className="rounded-2xl border border-dashed border-[#009EE3]/40 bg-card p-5 space-y-4">
                    <div className="space-y-1">
                      <h5 className="font-bold text-xs text-foreground uppercase tracking-wider text-muted-foreground/80">
                        Vinculación con Mercado Pago
                      </h5>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Conecta tu cuenta de Mercado Pago para que tus usuarios puedan abonar sus membresías y pases directamente desde Shakerfy.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <Button
                        type="button"
                        onClick={handleConnectMercadoPago}
                        disabled={mpIsConnecting}
                        className="bg-[#009EE3] hover:bg-[#0089C7] text-white font-bold rounded-xl px-5 h-11 shadow-sm gap-2 text-xs"
                      >
                        <Zap className="h-4 w-4 fill-white" />
                        {mpIsConnecting ? "Conectando..." : "Conectar con Mercado Pago"}
                      </Button>
                      <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Conexión segura de cuenta
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-4">
                      <div>
                        <span className="text-[10.5px] font-bold uppercase text-muted-foreground tracking-wider block mb-0.5">
                          Cuenta Conectada
                        </span>
                        <div className="text-sm font-extrabold text-foreground flex items-center gap-2">
                          {mpAccountInfo?.merchantName}
                          <span className="text-xs font-semibold text-muted-foreground font-mono">
                            ({mpAccountInfo?.accountId})
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          Email: <strong className="text-foreground">{mpAccountInfo?.email}</strong> · Vinculado el {mpAccountInfo?.linkedDate}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleDisconnectMercadoPago}
                        className="rounded-xl text-xs font-bold border-rose-500/30 text-rose-600 hover:bg-rose-500/10 hover:text-rose-700 h-9 gap-1.5"
                      >
                        <Unlink className="h-3.5 w-3.5" /> Desconectar Cuenta
                      </Button>
                    </div>

                    {/* Webhook notification URL listener */}
                    <div className="pt-1">
                      <span className="text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                        URL de Webhook Notificaciones
                      </span>
                      <div className="flex items-center gap-2">
                        <Input
                          type="text"
                          readOnly
                          value="https://api.shakerfy.com/v1/webhooks/mercadopago"
                          className="h-9 font-mono text-xs bg-background border-border text-foreground rounded-xl"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText("https://api.shakerfy.com/v1/webhooks/mercadopago");
                            toast.success("✓ URL de Webhook copiada");
                          }}
                          className="h-9 rounded-xl text-xs font-bold gap-1 shrink-0"
                        >
                          <Copy className="h-3.5 w-3.5" /> Copiar
                        </Button>
                      </div>
                    </div>

                    {/* Advanced Mercado Pago Switches */}
                    <div className="grid gap-4 sm:grid-cols-3 pt-3 border-t border-border/40">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/20 border border-border/40">
                        <div className="space-y-0.5">
                          <Label className="text-xs font-bold text-foreground">Suscripciones Recurrentes</Label>
                          <p className="text-[10px] text-muted-foreground">Débito automático mensual</p>
                        </div>
                        <Switch
                          checked={mpSubscriptionsEnabled}
                          onCheckedChange={setMpSubscriptionsEnabled}
                        />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/20 border border-border/40">
                        <div className="space-y-0.5">
                          <Label className="text-xs font-bold text-foreground">Aceptar Cuotas</Label>
                          <p className="text-[10px] text-muted-foreground">Habilitar tarjetas en cuotas</p>
                        </div>
                        <Switch
                          checked={mpInstallmentsEnabled}
                          onCheckedChange={setMpInstallmentsEnabled}
                        />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/20 border border-border/40">
                        <div className="space-y-0.5">
                          <Label className="text-xs font-bold text-foreground">Modo Sandbox (Pruebas)</Label>
                          <p className="text-[10px] text-muted-foreground">Usar credenciales TEST</p>
                        </div>
                        <Switch
                          checked={mpUseSandbox}
                          onCheckedChange={(val) => {
                            setMpUseSandbox(val);
                            toast.info(val ? "Modo Sandbox activado para pruebas." : "Modo Producción activado.");
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Tarjeta: Métodos Manuales y Presenciales */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-6">
                <div>
                  <h4 className="font-bold text-sm text-foreground uppercase tracking-wider text-muted-foreground/80">
                    Cobros Presenciales & Métodos Manuales
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Habilita las opciones de cobro recibidas en recepción o mostrador.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {/* Efectivo */}
                  <div className="rounded-2xl border border-border bg-background p-4 flex flex-col justify-between space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          <DollarSign className="h-4 w-4" />
                        </div>
                        <div>
                          <h5 className="font-bold text-xs text-foreground">Efectivo</h5>
                          <span className="text-[10px] text-muted-foreground">En mostrador / caja</span>
                        </div>
                      </div>
                      <Switch
                        checked={cashEnabled}
                        onCheckedChange={setCashEnabled}
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      Permite registrar cobros de membresías en dinero en efectivo en el establecimiento.
                    </p>
                  </div>

                  {/* POS Terminal */}
                  <div className="rounded-2xl border border-border bg-background p-4 flex flex-col justify-between space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                          <CreditCard className="h-4 w-4" />
                        </div>
                        <div>
                          <h5 className="font-bold text-xs text-foreground">Tarjeta en POS</h5>
                          <span className="text-[10px] text-muted-foreground">Terminal de red local</span>
                        </div>
                      </div>
                      <Switch
                        checked={posEnabled}
                        onCheckedChange={setPosEnabled}
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      Procesa tarjetas de débito/crédito con la posnet física del local.
                    </p>
                  </div>

                  {/* Transferencia Bancaria */}
                  <div className="rounded-2xl border border-border bg-background p-4 flex flex-col justify-between space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div>
                          <h5 className="font-bold text-xs text-foreground">Transferencia</h5>
                          <span className="text-[10px] text-muted-foreground">CBU / CVU / Alias</span>
                        </div>
                      </div>
                      <Switch
                        checked={transferEnabled}
                        onCheckedChange={setTransferEnabled}
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      Muestra los datos bancarios del gimnasio para transferencias directas de alumnos.
                    </p>
                  </div>
                </div>

                {/* Formulario Datos Bancarios si Transferencia está activa */}
                {transferEnabled && (
                  <div className="rounded-2xl border border-border/80 bg-secondary/15 p-5 space-y-4 pt-4">
                    <h5 className="font-bold text-xs text-foreground uppercase tracking-wider text-muted-foreground/80 flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-primary" /> Datos de la Cuenta Bancaria (CBU / Alias)
                    </h5>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground font-semibold">Alias Bancario</Label>
                        <Input
                          type="text"
                          value={bankDetails.alias}
                          onChange={(e) => setBankDetails({ ...bankDetails, alias: e.target.value })}
                          placeholder="Ej: GIMNASIO.SHAKERFY"
                          className="h-9 text-xs rounded-xl bg-background border-border text-foreground font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground font-semibold">CBU / CVU (22 dígitos)</Label>
                        <Input
                          type="text"
                          value={bankDetails.cbu}
                          onChange={(e) => setBankDetails({ ...bankDetails, cbu: e.target.value })}
                          placeholder="Ej: 0000003100049281749281"
                          className="h-9 text-xs rounded-xl bg-background border-border text-foreground font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground font-semibold">Banco / Entidad Financiera</Label>
                        <Input
                          type="text"
                          value={bankDetails.bankName}
                          onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                          placeholder="Ej: Banco Galicia / Mercado Pago"
                          className="h-9 text-xs rounded-xl bg-background border-border text-foreground"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground font-semibold">Titular de la Cuenta</Label>
                        <Input
                          type="text"
                          value={bankDetails.accountHolder}
                          onChange={(e) => setBankDetails({ ...bankDetails, accountHolder: e.target.value })}
                          placeholder="Ej: Shakerfy Gym SRL"
                          className="h-9 text-xs rounded-xl bg-background border-border text-foreground font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* General Save Confirmation */}
              <div className="flex justify-end pt-2">
                <Button
                  type="button"
                  onClick={() => toast.success("✓ Ajustes de Métodos de Cobro guardados con éxito.")}
                  className="rounded-xl text-xs font-bold px-6 h-10 bg-primary text-primary-foreground shadow-sm gap-1.5"
                >
                  <Save className="h-4 w-4" /> Guardar Métodos de Cobro
                </Button>
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

// Subcomponent: Ayuda Tab (Centro de Ayuda y Guías del Administrador)
function AyudaTab({ onNavigateTab }: { onNavigateTab?: (tabId: string) => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [activeGuideId, setActiveGuideId] = useState<string | null>(null);

  const categories = ["Todas", "Asistencias", "Clases", "Miembros", "Caja / POS", "Finanzas", "Reportes", "Inventario", "Reseñas", "Membresías", "Configuración"];

  const guidesList = [
    {
      id: "asistencia",
      title: "Guía Completa: Control de Asistencias y Accesos",
      category: "Asistencias",
      status: "Publicada",
      badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      description:
        "Instrucciones detalladas para gestionar check-ins presenciales por QR, GPS y Recepción, monitoreo de aforo en vivo, alertas preventivas, retención por WhatsApp y exportación de reportes en CSV.",
      modulesCount: 7,
      lastUpdated: "Hoy",
    },
    {
      id: "clases",
      title: "Guía Completa: Gestión de Clases, Horarios y Salones",
      category: "Clases",
      status: "Publicada",
      badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      description:
        "Manual exhaustivo de administración de clases, salones con mapa de spots, diseñador universal de rutinas por bloques (Yoga, Pilates, Funcional, etc.), inscripciones directas, lista de espera y cancelaciones masivas.",
      modulesCount: 8,
      lastUpdated: "Hoy",
    },
    {
      id: "miembros",
      title: "Guía Completa: Gestión de Miembros y Certificados Médicos",
      category: "Miembros",
      status: "Publicada",
      badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      description:
        "Instrucciones detalladas para alta de socios, renovación de cuotas, emisión de comprobantes, control de certificados médicos (apto físico), congelamiento temporal de cuentas y fichas de salud.",
      modulesCount: 7,
      lastUpdated: "Hoy",
    },
    {
      id: "caja",
      title: "Guía Completa: Caja / POS y Cobros Presenciales",
      category: "Caja / POS",
      status: "Publicada",
      badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      description:
        "Apertura y arqueo diario de caja, terminal POS para cobros libres y ventas de productos de tienda, soporte de pago mixto, arqueo de turno y exportación de reportes.",
      modulesCount: 6,
      lastUpdated: "Hoy",
    },
    {
      id: "finanzas",
      title: "Guía Completa: Liquidación de Staff y Finanzas",
      category: "Finanzas",
      status: "Publicada",
      badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      description:
        "Análisis de salud financiera en tiempo real, cálculo automático de liquidaciones de staff por asistencias, gestor de rubros de gastos fijos y emisión de recibos.",
      modulesCount: 5,
      lastUpdated: "Hoy",
    },
    {
      id: "reportes",
      title: "Guía Completa: Reportes & Analítica de Negocio",
      category: "Reportes",
      status: "Publicada",
      badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      description:
        "Indicadores ejecutivos de facturación, desglose por canal de cobro, tasa de retención de alumnos, mapa de ocupación por disciplina y exportación de auditorías a CSV / PDF.",
      modulesCount: 5,
      lastUpdated: "Hoy",
    },
    {
      id: "inventario",
      title: "Guía Completa: Control de Inventario y Kardex",
      category: "Inventario",
      status: "Publicada",
      badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      description:
        "Catálogo de productos de tienda, alertas de stock mínimo, variantes de productos, historial de movimientos Kardex, directorio de proveedores y orden de compra automática.",
      modulesCount: 6,
      lastUpdated: "Hoy",
    },
    {
      id: "reseñas",
      title: "Guía Completa: Gestión de Reseñas y Feedback",
      category: "Reseñas",
      status: "Publicada",
      badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      description:
        "Moderación de evaluaciones de socios, selección de opiniones destacadas para la landing page, respuestas oficiales del centro, buzón privado de sugerencias y campañas de solicitud por WhatsApp.",
      modulesCount: 5,
      lastUpdated: "Hoy",
    },
    {
      id: "membresias",
      title: "Guía Completa: Gestión de Membresías y Tarifas",
      category: "Membresías",
      status: "Publicada",
      badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      description:
        "Configuración de pases libres y bolsas de créditos, tarifas con promociones, franjas Off-Peak (Horario Valle), amenities incluidos, duplicación de planes y destacado en Landing Page.",
      modulesCount: 6,
      lastUpdated: "Hoy",
    },
    {
      id: "config",
      title: "Guía Completa: Configuración de Sede y Políticas",
      category: "Configuración",
      status: "Publicada",
      badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      description:
        "Información general de la sede, multisedes y salones, nómina de staff y salarios, integraciones de cobro (Mercado Pago / CBU), políticas de cancelación y protocolos operativos.",
      modulesCount: 6,
      lastUpdated: "Hoy",
    },
  ];

  const filteredGuides = useMemo(() => {
    return guidesList.filter((g) => {
      const matchesSearch =
        g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.category.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedCategory !== "Todas" && g.category !== selectedCategory) {
        return false;
      }
      return true;
    });
  }, [searchQuery, selectedCategory]);

  const handleCopyAsistenciaGuideText = () => {
    const guideText = `GUÍA DE USO COMPLETA: MÓDULO DE ASISTENCIAS — STUDIO PULSE SMART

1. INDICADORES CLAVE EN TIEMPO REAL:
- Aforo Actual Sede: Ocupación en tiempo real vs capacidad máxima (ej: 42/80).
- Check-ins QR: % e ingresos validados por escáner QR en recepción.
- Check-ins GPS: % e ingresos autovalidados por cercanía (<50m).
- Recepción Manual: % y accesos confirmados por el personal en mostrador.

2. FLUJO DE VALIDACIÓN PRESENCIAL EN RECEPCIÓN:
- Haz clic en [Buscar Socio para Check-in].
- Busca por DNI, Nombre o Teléfono.
- Revisa la alerta de Apto Físico (Vigente / Pendiente).
- Para alumnos con reserva previa, presiona [Confirmar Check-in].
- Para alumnos sin reserva previa, presiona [Ingreso General].

3. MONITOR DE ENTRADAS RECIENTES Y ALERTAS PREVENTIVAS:
- Muestra el live feed con fotos, horarios y método de entrada.
- Despliega alertas en tiempo real: Pago Pendiente, Lesión Médica o Apto Físico Pendiente.

4. GESTIÓN DE RETENCIÓN DE ALUMNOS (RIESGO DE CHURN):
- Identifica automáticamente alumnos sin asistencia por más de 12 días.
- Haz clic en [Contactar] para abrir WhatsApp con un mensaje amigable pre-redactado.

5. HISTORIAL GENERAL Y EXPORTACIÓN CSV:
- Busca registros por texto y filtra por Fecha, Método o Estado.
- Presiona [Exportar CSV] para descargar el reporte detallado.

6. DÍAS DE CIERRE O FERIADOS (BLACKOUT DAYS):
- Inhabilita automáticamente check-ins en días no laborables con banner de aviso.

7. IMPACTO EN OTROS MÓDULOS:
- Permite calcular liquidaciones de staff (Base + Asistencia), aplicar penalizaciones de No-Show y analizar estadísticas de ocupación.`;

    navigator.clipboard.writeText(guideText);
    toast.success("✓ Guía de Asistencias copiada al portapapeles con éxito.");
  };

  const handleCopyClasesGuideText = () => {
    const guideText = `GUÍA DE USO COMPLETA: MÓDULO DE CLASES Y GRILLA HORARIA — STUDIO PULSE SMART

1. VISTAS DE GRILLA (CALENDARIO VS LISTA):
- Modo Calendario: Agenda por días (Lunes a Domingo) y salones/salas. Navega semanas con [<] [Semana Actual] [>].
- Modo Lista: Listado de clases con filtros rápidos por nombre, profesor o sala.

2. CONFIGURACIÓN DE SALONES Y MAPA DE SPOTS:
- Asigna salones con grilla física de ubicaciones (filas x columnas de mats, bicis o espacios).
- Activa "Requerir Selección de Spot / Lugar" en la clase.

3. ALTA, EDICIÓN Y DUPLICACIÓN DE CLASES:
- Define Nombre, Profesor asignado, Día, Horario (Inicio/Fin), Sala, Capacidad máxima y Costo en Créditos.
- Duplica sesiones horarias en otros días de la semana con un solo clic.

4. DISEÑADOR UNIVERSAL DE BLOQUES DE ENTRENAMIENTO:
- Estructura sesiones con presets para cualquier disciplina (Yoga, Pilates, Funcional, Spinning, Musculación, CrossFit, HIIT).
- Bloques: Calentamiento/Movilidad/Pranayama, Fuerza/Técnica/Asanas, Metcon/Rutina Central, Vuelta a la Calma/Savasana y Bloques Personalizados.

5. MATRIZ DE SPOTS Y LOCKS DE RESERVA (3 MINUTOS):
- Matriz visual por estado (Disponible, Ocupado, Bloqueado 3 min).
- Lock automático de 3 minutos para evitar reservas simultáneas duplicadas.

6. ACCIONES CON ALUMNOS DENTRO DE LA CLASE:
- Inscripción manual directa presencial.
- Ficha de alumno y estado del Apto Físico.
- Marcación de asistencia: [Presente] o [Ausente / No-Show].
- Liberación/reventa de spot y cancelación con reembolso automático de crédito.

7. LISTA DE ESPERA INTELIGENTE (WAITLIST):
- Reservas en espera con posición asignada (#1, #2).
- Promoción automática y notificación cuando se libera un lugar.

8. CANCELACIÓN MASIVA Y REEMBOLSO DE CRÉDITOS:
- Cancela sesiones por feriado o imprevisto reimbursando créditos masivamente.`;

    navigator.clipboard.writeText(guideText);
    toast.success("✓ Guía de Clases copiada al portapapeles con éxito.");
  };

  const handleCopyMiembrosGuideText = () => {
    const guideText = `GUÍA DE USO COMPLETA: MÓDULO DE MIEMBROS Y APTO FÍSICO — STUDIO PULSE SMART

1. MÉTRICAS DE PADRÓN Y ESTADO DE ALUMNOS:
- Monitorea en tiempo real Total Socios, Activos, Cuotas Vencidas/Pendientes, Cuentas Congeladas y Aptos Físicos Vencidos.
- Filtra por estado (Activos, Vencidos, Congelados, Archivados, Apto Vencido) y ordena por A-Z o Vencimiento.

2. ALTA Y REGISTRO DE NUEVOS ALUMNOS:
- Presiona [+ Nuevo Socio] y completa Nombre, DNI, Email, Teléfono y Foto.
- Asigna la membresía inicial (Pase Libre, Créditos, Estudiante), fecha de inicio y método de pago.

3. RENOVACIÓN MANUAL Y EMISIÓN DE COMPROBANTES:
- Presiona [Renovar] en la ficha del socio, selecciona la cantidad de meses (1, 3, 6, 12).
- Registra el ingreso en la Caja registradora e imprime/descarga el Comprobante Digital.

4. VERIFICACIÓN Y CARGA DE CERTIFICADO MÉDICO (APTO FÍSICO):
- Revisa los estados: Entregado y Vigente, Pendiente o Vencido.
- Carga el archivo PDF/Imagen del certificado e ingresa la fecha de vencimiento.

5. CONGELAMIENTO Y DESCONGELAMIENTO TEMPORAL:
- Pausa la membresía por lesión o viaje ingresando los días de suspensión.
- El sistema posterga automáticamente la fecha de vencimiento final.
- Permite descongelar anticipadamente si el alumno retorna antes.

6. FICHA MÉDICA Y OBSERVACIONES DEL ALUMNO:
- Registra alergias, condiciones médicas, lesiones preexistentes y notas internas visible en recepción y para profesores.

7. CANCELACIÓN Y INTEGRIDAD DE DATOS (BORRADO LÓGICO):
- Cancela la membresía y gestiona débitos automáticos.
- Para preservar el historial contable y auditorías, el sistema archiva al socio en estado Cancelado evitando borrados que dañen reportes.`;

    navigator.clipboard.writeText(guideText);
    toast.success("✓ Guía de Miembros copiada al portapapeles con éxito.");
  };

  const handleCopyCajaGuideText = () => {
    const guideText = `GUÍA DE USO COMPLETA: MÓDULO DE CAJA / POS Y COBROS PRESENCIALES — STUDIO PULSE SMART

1. MÉTRICAS DE CAJA EN TIEMPO REAL:
- Monitorea Ingresos en Caja (Turno), Egresos & Gastos Menores y Efectivo Esperado en Cajón (Efectivo Ingresos - Efectivo Egresos).

2. TERMINAL POS - COBRO LIBRE Y TIENDA:
- Presiona [Nuevo Movimiento] para abrir la terminal POS.
- Modo Cobro Libre: Para pases diarios, musculación, eventos o gastos operativos.
- Modo Venta de Producto (Tienda): Selecciona artículos del inventario descontando stock automáticamente.
- Asocia opcionalmente la transacción a un alumno del padrón.

3. CANALES DE PAGO Y SOPORTE DE PAGO MIXTO (SPLIT PAYMENT):
- Canales estándar: Efectivo, MercadoPago/QR y Transferencia Bancaria.
- Pago Mixto: Permite fraccionar un cobro combinando Efectivo y Digital (ej: $5.000 Efectivo + $10.000 MercadoPago).

4. ARQUEO DE CAJA Y CIERRE DE TURNO:
- Presiona [Arqueo & Cierre] e ingresa el conteo de dinero físico del cajón.
- Compara el efectivo contado con el dinero esperado informando sobrantes, faltantes o Caja Cuadrada ($0).

5. HISTORIAL DE TRANSACCIONES Y FILTROS:
- Busca por concepto, socio o usuario.
- Filtra por Tipo (Ingreso/Egreso), Canal de Pago (Efectivo, QR, Transferencia) y Rango de Fecha (Hoy, Semana, Mes).

6. ANULACIÓN DE MOVIMIENTOS Y EXPORTACIÓN CSV:
- Reversión/Anulación: Marca movimientos erróneos como ANULADO manteniendo registro de auditoría.
- Exportar CSV: Descarga la planilla de balance de caja.`;

    navigator.clipboard.writeText(guideText);
    toast.success("✓ Guía de Caja / POS copiada al portapapeles con éxito.");
  };

  const handleCopyFinanzasGuideText = () => {
    const guideText = `GUÍA DE USO COMPLETA: MÓDULO DE FINANZAS Y LIQUIDACIONES DE STAFF — STUDIO PULSE SMART

1. SALUD FINANCIERA Y MARGEN OPERATIVO NETO:
- Monitorea Ingresos Brutos (Membresías + POS), Honorarios Liquidados, Gastos Fijos & Operativos y Margen Neto.

2. GESTOR DE GASTOS FIJOS Y ESTRUCTURALES:
- Presiona [Ajustar Rubros] para configurar Alquiler, Luz, Agua, Internet, Mantenimiento y agregar nuevos costos.

3. MOTOR DE CÁLCULO DE LIQUIDACIONES DE STAFF (PAYROLL ENGINE):
- Honorario = Sueldo Base + (Clases x Tarifa) + (Alumnos x Bonificación por Asistencia).
- Presiona [Recalcular Asistencias] para cruzar la grilla horaria con check-ins reales en tiempo real.

4. ACREDITACIÓN DE PAGOS Y RECIBOS DIGITALES:
- Presiona [Acreditar Pago] para cambiar el estado a Pagado y registrar el egreso contable en caja.
- Genera y descarga el Recibo Digital oficial con el desglose del período.

5. SELECCIÓN DE PERÍODO, FILTROS Y EXPORTACIÓN CSV:
- Selecciona el mes a auditar (Junio 2026, Mayo 2026) o consulta la vista histórica.
- Presiona [Exportar CSV] para descargar la planilla de liquidaciones.`;

    navigator.clipboard.writeText(guideText);
    toast.success("✓ Guía de Finanzas copiada al portapapeles con éxito.");
  };

  const handleCopyReportesGuideText = () => {
    const guideText = `GUÍA DE USO COMPLETA: MÓDULO DE REPORTES & ANALÍTICA DE NEGOCIO — STUDIO PULSE SMART

1. TOOLBAR EJECUTIVO Y FILTROS MULTIDIMENSIONALES:
- Filtra por Período (Hoy, 7 días, Mes, Trimestre) y por Disciplina (CrossFit, Spinning, Yoga, Pilates, Funcional).
- Navega las 4 sub-pestañas: Finanzas, Asistencia y Ocupación, Retención de Socios y Staff & Coaches.

2. ANALÍTICA FINANCIERA Y DESGLOSE DE COBROS:
- Audita Facturación Total, Socios Activos y Ticket Promedio.
- Revisa la distribución de ingresos por canal: MercadoPago (%), Transferencia (%) y Efectivo (%).

3. OCUPACIÓN DE SALONES Y EFICIENCIA DE CLASES:
- Monitorea el % de ocupación global y la demanda por salón y horario para ajustar la grilla horaria.

4. RETENCIÓN DE ALUMNOS Y RE-ENGAGEMENT POR WHATSAPP:
- Detecta alumnos con inasistencias prolongadas y presiona [Contactar por WhatsApp] para enviar una invitación directa de retorno.

5. RENDIMIENTO DEL STAFF Y EXPORTACIÓN A CSV / PDF:
- Audita clases dictadas, asistencia promedio por coach y satisfacción de alumnos.
- Presiona [Exportar CSV] o [Imprimir / PDF] para descargar informes ejecutivos completos.`;

    navigator.clipboard.writeText(guideText);
    toast.success("✓ Guía de Reportes copiada al portapapeles con éxito.");
  };

  const handleCopyInventarioGuideText = () => {
    const guideText = `GUÍA DE USO COMPLETA: MÓDULO DE INVENTARIO Y KARDEX — STUDIO PULSE SMART

1. CATÁLOGO DE PRODUCTOS Y MÉTRICAS DE STOCK EN TIEMPO REAL:
- Monitorea el Total de Productos, Valoración Económica ($ ARS), Alertas de Stock Bajo/Agotado y Categorías.
- Filtra por Categoría (Suplementos, Bebidas, Accesorios, Indumentaria) y Estado de Stock.

2. ALTA, EDICIÓN Y VARIANTES DE PRODUCTOS:
- Presiona [+ Nuevo Producto] y define Nombre, Categoría, Precio de Costo, Precio de Venta, Stock Inicial, Stock Mínimo y Código de Barras.
- Configura variantes de productos (Talles S/M/L, Sabores Vainilla/Chocolate) con stock individual.

3. AJUSTES MANUALES DE INVENTARIO (KARDEX):
- Presiona [Ajustar Stock] para registrar Entradas de proveedor, Ajustes Manuales o Mermas por rotura/expiración con motivo justificado.

4. REGISTRO KARDEX Y AUDITORÍA CONTABLE DE MOVIMIENTOS:
- Sub-pestaña Kardex: Historial cronológico completo con filtros por Fecha (Desde/Hasta), Tipo de Movimiento y Producto.

5. DIRECTORIO DE PROVEEDORES Y ORDEN DE COMPRA AUTOMÁTICA:
- Registra proveedores con datos de contacto (Empresa, Teléfono, Email).
- Presiona [Generar Orden de Compra] para calcular automáticamente los pedidos de reposición según el stock mínimo.

6. INTEGRACIÓN CON LA TERMINAL POS DE CAJA:
- El catálogo de inventario está sincronizado en tiempo real con el mostrador POS. Las ventas descuentan stock automáticamente y asientan la salida en el Kardex.`;

    navigator.clipboard.writeText(guideText);
    toast.success("✓ Guía de Inventario copiada al portapapeles con éxito.");
  };

  const handleCopyResenasGuideText = () => {
    const guideText = `GUÍA DE USO COMPLETA: MÓDULO DE RESEÑAS Y FEEDBACK — STUDIO PULSE SMART

1. MÉTRICAS DE CALIDAD DE LA SEDE:
- Monitorea la Calificación General (⭐ 4.9) y el desglose en Limpieza, Equipamiento, Staff y Precio.

2. RESEÑAS PÚBLICAS Y DESTACADAS EN LANDING PAGE:
- Examina los comentarios de los socios.
- Presiona [Destacar en Landing] para publicar opiniones seleccionadas en la portada pública del gimnasio.

3. RESPUESTAS OFICIALES DEL GIMNASIO:
- Presiona [Responder] en cualquier comentario para publicar una respuesta institucional que será visible públicamente.

4. BUZÓN PRIVADO DE SUGERENCIAS Y RECLAMOS:
- Revisa mensajes privados por categoría (Instalaciones, Clases, Climatización, Staff).
- Cambia el estado entre Pendiente y Atendido e ingresa Notas Internas administrativas.

5. CAMPAÑAS DE SOLICITUD DE RESEÑAS POR WHATSAPP:
- Presiona [Solicitar Reseña por WhatsApp] para enviar un enlace personalizado a los alumnos de la sede.`;

    navigator.clipboard.writeText(guideText);
    toast.success("✓ Guía de Reseñas copiada al portapapeles con éxito.");
  };

  const handleCopyMembresiasGuideText = () => {
    const guideText = `GUÍA DE USO COMPLETA: MÓDULO DE MEMBRESÍAS Y TARIFAS — STUDIO PULSE SMART

1. CATÁLOGO DE PLANES, TARIFAS Y MÉTRICAS DE ADHESIÓN:
- Visualiza tarjetas de pases con precio de lista, precio de promoción tachado, duración y cantidad de alumnos adheridos.

2. ALTA Y CONFIGURACIÓN AVANZADA DE MEMBRESÍAS:
- Presiona [+ Nueva Membresía] y define Nombre, Precio, Matrícula, Etiqueta y Período (Mensual, Trimestral, Anual).
- Tipo de Pase: Pase Libre o Por Créditos (bolsa de créditos mensuales).
- Configura Límite Diario de Clases y Días de Congelamiento autorizados.

3. FRANJAS HORARIAS (OFF-PEAK) Y DISCIPLINAS INCLUIDAS:
- Configura Horario Valle (Off-Peak) para promociones en horas de menor afluencia (ej: 12:00 a 16:00 hs).
- Selecciona las disciplinas incluidas (CrossFit, Yoga, Pilates, Spinning, Funcional).

4. AMENITIES INCLUIDOS Y PLAN DESTACADO EN LANDING PAGE:
- Asocia servicios adicionales de la sede (Toalla sin cargo, Lockers VIP, Estacionamiento).
- Presiona [Destacar en Landing] para resaltar la membresía principal en la portada pública.

5. DUPLICACIÓN RÁPIDA Y EDICIÓN DE PLANES:
- Presiona [Duplicar] para clonar estructuras de planes y crear opciones de distinta duración rápidamente.

6. REGLAS DE INTEGRIDAD Y ELIMINACIÓN SEGURA:
- Confirmación obligatoria escribiendo "ELIMINAR" para prevenir bajas accidentales de pases con alumnos adheridos.`;

    navigator.clipboard.writeText(guideText);
    toast.success("✓ Guía de Membresías copiada al portapapeles con éxito.");
  };

  const handleCopyConfigGuideText = () => {
    const guideText = `GUÍA DE USO COMPLETA: MÓDULO DE CONFIGURACIÓN Y POLÍTICAS — STUDIO PULSE SMART

1. INFORMACIÓN GENERAL Y HORARIOS DE APERTURA:
- Configura Nombre de la Sede, Dirección, WhatsApp, Redes Sociales (Instagram, TikTok) y Fotos.
- Define el esquema horario semanal de 7 días con ventanas de apertura e intervalos.

2. GESTIÓN MULTISEDE Y SALONES DE ENTRENAMIENTO:
- Agrega sucursales secundarias y administra salones con su capacidad física máxima.

3. DIRECTO DE STAFF, DISPONIBILIDAD Y LIQUIDACIONES:
- Registra entrenadores y recepcionistas con especialidades, diplomas y disponibilidad horaria.
- Define la estructura salarial (Sueldo Base, Tarifa por Clase Dictada y Bonificación por Alumno).

4. MÉTODOS DE COBRO E INTEGRACIÓN MERCADO PAGO:
- Vinculación OAuth de Mercado Pago para suscripciones recurrentes y cobro con QR/App.
- Configuración de CBU/Alias para transferencias bancarias y cobros en efectivo POS.

5. POLÍTICAS DE CANCELACIÓN, NO-SHOWS Y DÍAS DE CIERRE:
- Límite de horas para cancelación anticipada sin penalización (ej: 2 horas antes).
- Días de cierre (Blackout Days): Bloqueo automático de calendario por feriados o refacciones.

6. MANTENIMIENTO DE EQUIPAMIENTO Y CHECKLISTS DE PROTOCOLOS:
- Catálogo de máquinas/equipamiento y registro de mantenimiento preventivo.
- Protocolos de apertura/cierre para recepción y coaches con trazabilidad de cumplimiento.`;

    navigator.clipboard.writeText(guideText);
    toast.success("✓ Guía de Configuración copiada al portapapeles con éxito.");
  };

  return (
    <div className="space-y-8">
      {/* Banner de Encabezado */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg transition-all duration-300">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-primary/10 text-primary border border-primary/20">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Centro de Ayuda y Guías Oficiales
              </h2>
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block mt-0.5">
                Studio Pulse Smart · Base de Conocimiento para Administradores
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed pl-1 pt-1 max-w-2xl">
            Explora las guías operativas detalladas para dominar la gestión de tu centro deportivo, controlar accesos, configurar clases y optimizar la retención de socios.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-foreground block">10 Guías Publicadas</span>
            <span className="text-[10.5px] text-emerald-600 font-semibold">100% Cobertura</span>
          </div>
          <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center font-bold text-xs">
            10/10
          </div>
        </div>
      </div>

      {/* Toolbar: Buscador y Filtros por Categoría */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card p-4 rounded-3xl border border-border shadow-xs">
        {/* Buscador */}
        <div className="relative shrink-0 w-full sm:w-72">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por módulo o tema..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-2xl text-xs bg-secondary/30 border-border/60 h-9"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 lg:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-2xs font-bold"
                  : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground border border-border/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Guías Operativas */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
            Manuales Operativos Disponibles ({filteredGuides.length})
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full items-stretch">
          {filteredGuides.map((guide) => {
            const isAsistencias = guide.id === "asistencia";
            const isClases = guide.id === "clases";
            const isMiembros = guide.id === "miembros";
            const isCaja = guide.id === "caja";
            const isFinanzas = guide.id === "finanzas";
            const isReportes = guide.id === "reportes";
            const isInventario = guide.id === "inventario";
            const isResenas = guide.id === "reseñas";
            const isMembresias = guide.id === "membresias";
            const isConfig = guide.id === "config";
            const isExpanded = activeGuideId === guide.id;

            return (
              <div
                key={guide.id}
                className={cn(
                  "rounded-3xl border border-border bg-card shadow-xs p-6 flex flex-col justify-between hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg transition-all duration-300",
                  isExpanded && "border-primary/40 ring-1 ring-primary/20 md:col-span-2"
                )}
              >
                <div>
                  {/* Badge & Meta */}
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 bg-secondary px-2.5 py-1 rounded-full border border-border/60">
                      {guide.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase border px-2.5 py-0.5 rounded-full ${guide.badgeColor}`}
                    >
                      {guide.status}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h4 className="text-base font-bold text-foreground tracking-tight mb-2">
                    {guide.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                    {guide.description}
                  </p>
                </div>

                {/* Expanded Details for Asistencias Guide */}
                {isAsistencias && isExpanded && (
                  <div className="mt-4 pt-4 border-t border-border space-y-5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between flex-wrap gap-2 bg-muted/40 p-3 rounded-2xl border border-border/60">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-bold text-foreground">
                          Guía Oficial de Operación de Asistencias (7 Módulos Clave)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl text-xs h-8 gap-1.5 font-semibold"
                          onClick={handleCopyAsistenciaGuideText}
                        >
                          <Copy className="w-3.5 h-3.5" /> Copiar Guía
                        </Button>
                        <Button
                          size="sm"
                          className="rounded-xl text-xs h-8 gap-1.5 font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                          onClick={() => onNavigateTab?.("asistencia")}
                        >
                          Ir al Módulo <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Accordion de Módulos de Asistencias */}
                    <Accordion type="single" collapsible defaultValue="item-1" className="w-full space-y-2">
                      <AccordionItem value="item-1" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          1. Indicadores Clave y Aforo en Tiempo Real
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <p>
                            El panel desplegará 4 tarjetas dinámicas en la parte superior:
                          </p>
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li><strong>Aforo Actual Sede:</strong> Porcentaje de ocupación en tiempo real (ej. 42 / 80 socios).</li>
                            <li><strong>Check-ins QR:</strong> Proporción de ingresos mediante escaneo del código QR digital del socio.</li>
                            <li><strong>Check-ins GPS (50m):</strong> Ingresos autovalidados cuando la app detecta que el socio está a menos de 50 metros del centro.</li>
                            <li><strong>Recepción Manual:</strong> Ingresos confirmados manualmente en mostrador.</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-2" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          2. Flujo A: Control de Acceso Presencial en Recepción
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <ol className="list-decimal pl-4 space-y-1 text-[11.5px]">
                            <li>Haz clic en el botón <strong>[Buscar Socio para Check-in]</strong>.</li>
                            <li>Ingresa el Nombre, DNI o Teléfono en el buscador.</li>
                            <li>Verifica el estado del <strong>Apto Físico</strong> (Vigente o Pendiente/Vencido).</li>
                            <li>Si posee reserva previa para hoy, presiona <strong>[Confirmar Check-in]</strong> para marcar su presencia en la clase.</li>
                            <li>Si no posee reserva (Pase Libre o Musculación), presiona <strong>[Ingreso General]</strong>.</li>
                          </ol>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-3" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          3. Flujo B: Monitor de Entradas Recientes y Alertas Preventivas
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <p>
                            Muestra el listado de ingresos en vivo con foto del socio, hora exacta y método utilizado. Genera alertas de prevención:
                          </p>
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li><span className="text-destructive font-bold">Pago Pendiente:</span> El socio posee una cuota vencida.</li>
                            <li><span className="text-amber-600 dark:text-amber-400 font-bold">Lesión o Condición Médica:</span> Notificación para alertar al instructor.</li>
                            <li><span className="text-amber-600 dark:text-amber-400 font-bold">Apto Físico Pendiente:</span> Requiere exigir certificado médico.</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-4" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          4. Flujo C: Gestión de Retención de Alumnos (Riesgo de Churn)
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <p>
                            El sistema detecta automáticamente a los socios activos que llevan <strong>más de 12 días sin registrar asistencia</strong>.
                          </p>
                          <p className="text-[11.5px]">
                            Al presionar <strong>[Contactar]</strong>, abre WhatsApp con un mensaje prediseñado: <em>"Hola [Nombre], ¡te extrañamos en [Gimnasio]! 👋..."</em> para incentivar el retorno al entrenamiento.
                          </p>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-5" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          5. Flujo D: Historial General y Exportación a CSV
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <p>
                            Permite realizar búsquedas por texto, aplicar filtros por Fecha (Hoy, Ayer, Esta Semana) y filtrar por Método de Acceso o Estado (Presente / Ausente).
                          </p>
                          <p className="text-[11.5px]">
                            El botón <strong>[Exportar CSV]</strong> genera una planilla descargable lista para auditorías internas.
                          </p>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-6" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          6. Flujo E: Días de Cierre o Feriados (Blackout Days)
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <p>
                            Cuando la sede registra un día no hábil, el sistema despliega un banner de advertencia superior e inhabilita los check-ins para evitar marcas inconsistentes.
                          </p>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-7" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          7. Integración con otros Módulos de la Plataforma
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li><strong>Liquidaciones del Staff:</strong> Cálculo de honorarios de profesores por base + asistencias registradas.</li>
                            <li><strong>Políticas de No-Show:</strong> Reglas configurables para limitar reservas si el alumno incurre en ausencias injustificadas.</li>
                            <li><strong>Reportes de Ocupación:</strong> Análisis de días y horarios pico en la pestaña de Reportes.</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {/* Expanded Details for Clases Guide */}
                {isClases && isExpanded && (
                  <div className="mt-4 pt-4 border-t border-border space-y-5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between flex-wrap gap-2 bg-muted/40 p-3 rounded-2xl border border-border/60">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-bold text-foreground">
                          Guía Oficial de Operación de Clases y Horarios (8 Módulos Clave)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl text-xs h-8 gap-1.5 font-semibold"
                          onClick={handleCopyClasesGuideText}
                        >
                          <Copy className="w-3.5 h-3.5" /> Copiar Guía
                        </Button>
                        <Button
                          size="sm"
                          className="rounded-xl text-xs h-8 gap-1.5 font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                          onClick={() => onNavigateTab?.("clases")}
                        >
                          Ir al Módulo <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Accordion de Módulos de Clases */}
                    <Accordion type="single" collapsible defaultValue="item-1" className="w-full space-y-2">
                      <AccordionItem value="item-1" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          1. Vistas de Grilla (Calendario por Salón vs Lista Semanal)
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <p>
                            El administrador gestiona 100% la grilla desde 2 modos de visualización:
                          </p>
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li><strong>Modo Calendario:</strong> Muestra la agenda semanal (Lunes a Domingo) filtrable por Sala/Salón (ej. Sala Principal, Salón Yoga, Sala Spinning). Controles <strong>[&lt;] [Semana Actual] [&gt;]</strong> para avanzar o retroceder en la planificación.</li>
                            <li><strong>Modo Lista:</strong> Lista compacta con buscador rápido por nombre de clase, profesor o sala.</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-2" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          2. Configuración de Salones y Distribución de Lugares (Spots Layout)
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <p>
                            Para que una clase requiera selección de ubicación física:
                          </p>
                          <ol className="list-decimal pl-4 space-y-1 text-[11.5px]">
                            <li>En <strong>Configuración &gt; Salones</strong> se crea la sala definiendo la grilla de ubicaciones (filas x columnas de mats, máquinas o lugares).</li>
                            <li>Al crear/editar la clase, activa la casilla <strong>"Requerir Selección de Spot / Lugar"</strong> y selecciona el Salón asignado (ej. <em>Salón Yoga - 20 Mats</em>, <em>Sala Spinning - 15 Bicis</em>).</li>
                          </ol>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-3" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          3. Alta, Edición y Duplicación de Clases
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li><strong>Alta de Clase:</strong> Haz clic en <strong>[+ Crear Clase]</strong> y define Nombre, Profesor a cargo, Día de la semana, Horario de Inicio/Fin, Sala, Capacidad máxima y Costo en Créditos.</li>
                            <li><strong>Edición:</strong> Modifica cualquier parámetro de una clase activa en tiempo real.</li>
                            <li><strong>Duplicación:</strong> Usa el botón <strong>[Duplicar]</strong> para replicar la estructura horaria y bloques de entrenamiento en otros días de la semana con un solo clic.</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-4" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          4. Diseñador Universal de Bloques de Entrenamiento (Rutinas)
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <p>
                            Herramienta adaptable a <strong>cualquier disciplina deportiva o física</strong> (Yoga, Pilates, Functional, Spinning, Musculación, CrossFit, HIIT, etc.):
                          </p>
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li>🟡 <strong>Calentamiento / Movilidad / Pranayama:</strong> Entrada en calor o respiración inicial.</li>
                            <li>🔵 <strong>Fuerza / Técnica / Asanas Principal:</strong> Trabajo de fuerza, técnica o secuencias de posturas.</li>
                            <li>🔴 <strong>Metcon / Trabajo Intensivo / Rutina Central:</strong> Circuito funcional o fase principal.</li>
                            <li>🟢 <strong>Vuelta a la Calma / Savasana / Relajación:</strong> Estiramientos o relajación guiada.</li>
                            <li>⚪ <strong>Bloque Personalizado:</strong> Texto libre para observaciones o rutinas especiales.</li>
                          </ul>
                          <p className="text-[11.5px] pt-1">
                            Cada bloque permite ajustar Título, Subtítulo, Descripción técnica, <strong>Time Cap</strong> (duración estimada) y reordenar con los botones <strong>[▲ Subir]</strong> y <strong>[▼ Bajar]</strong>.
                          </p>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-5" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          5. Matriz de Spots y Temporizador de Reserva (Spot Locks - 3 Minutos)
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <p>
                            El mapa interactivo refleja en tiempo real 3 estados por lugar: <strong>Disponible</strong>, <strong>Ocupado por Socio</strong> (foto/nombre) y <strong>Bloqueado Temporalmente (Lock)</strong>.
                          </p>
                          <p className="text-[11.5px]">
                            Cuando un alumno o administrador selecciona un lugar, el sistema aplica un <strong>Spot Lock automático de 3 minutos</strong> (03:00) para evitar reservas duplicadas simultáneas sobre la misma máquina/mat.
                          </p>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-6" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          6. Acciones Completas con Alumnos en la Clase
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li><strong>Inscripción Manual Presencial:</strong> Haz clic en un spot libre para buscar a un socio por DNI/Nombre e inscribirlo directamente.</li>
                            <li><strong>Verificación Ficha de Alumno:</strong> Visualiza plan activo, créditos restantes y vigencia del <strong>Apto Físico</strong>.</li>
                            <li><strong>Marcación de Asistencia:</strong> Presiona <strong>[Presente]</strong> (verde) o <strong>[Ausente / No-Show]</strong> (rojo).</li>
                            <li><strong>Liberación / Reventa de Spot:</strong> Opción para dar de baja un lugar ocupado y ponerlo a disposición de otros socios en lista de espera.</li>
                            <li><strong>Cancelación de Reserva Individual:</strong> Desinscribe a un alumno acreditando automáticamente el crédito consumido a su cuenta.</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-7" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          7. Lista de Espera Inteligente (Waitlist)
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <p>
                            Si los cupos de la clase están al 100%, las reservaciones ingresan en la Lista de Espera con turno asignado (Puesto #1, #2, etc.).
                          </p>
                          <p className="text-[11.5px]">
                            <strong>Promoción Automática:</strong> Si un alumno cancela dentro del plazo estipulado, el sistema promueve automáticamente al primer socio en espera y le envía una notificación. El administrador también puede promover o gestionar manualmente la lista.
                          </p>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-8" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          8. Cancelación Masiva de Clase y Reembolso de Créditos
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <p>
                            En caso de suspensión por feriado imprevisto o evento de la sede, la opción <strong>[Cancelar Clase]</strong> da de baja la sesión, notifica a los participantes y efectúa el <strong>reembolso masivo de créditos</strong> a todos los alumnos anotados.
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {/* Expanded Details for Miembros Guide */}
                {isMiembros && isExpanded && (
                  <div className="mt-4 pt-4 border-t border-border space-y-5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between flex-wrap gap-2 bg-muted/40 p-3 rounded-2xl border border-border/60">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-bold text-foreground">
                          Guía Oficial de Operación de Miembros y Certificados Médicos (7 Módulos Clave)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl text-xs h-8 gap-1.5 font-semibold"
                          onClick={handleCopyMiembrosGuideText}
                        >
                          <Copy className="w-3.5 h-3.5" /> Copiar Guía
                        </Button>
                        <Button
                          size="sm"
                          className="rounded-xl text-xs h-8 gap-1.5 font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                          onClick={() => onNavigateTab?.("miembros")}
                        >
                          Ir al Módulo <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Accordion de Módulos de Miembros */}
                    <Accordion type="single" collapsible defaultValue="item-1" className="w-full space-y-2">
                      <AccordionItem value="item-1" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          1. Métricas de Padrón y Estado de Alumnos
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <p>
                            El panel superior resume la salud del padrón de socios en 5 indicadores:
                          </p>
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li><strong>Total Socios:</strong> Padrón completo de alumnos registrados.</li>
                            <li><strong>Socios Activos:</strong> Alumnos con plan vigente y cuota al día.</li>
                            <li><strong>Cuotas Vencidas / Pendientes:</strong> Alumnos con membresía expirada o pago en mora.</li>
                            <li><strong>Cuentas Congeladas:</strong> Alumnos con pausa temporal autorizada por viaje o lesión.</li>
                            <li><strong>Aptos Físicos Vencidos:</strong> Alumnos que requieren renovar su certificado médico.</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-2" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          2. Alta y Registro de Nuevos Alumnos
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <ol className="list-decimal pl-4 space-y-1 text-[11.5px]">
                            <li>Haz clic en el botón <strong>[+ Nuevo Socio]</strong>.</li>
                            <li>Completa los datos obligatorios: Nombre completo, DNI, Email, Teléfono y carga opcional de Foto de Perfil.</li>
                            <li>Selecciona el Plan / Membresía de ingreso (ej. <em>Pase Libre Full</em>, <em>Pase 8 Créditos</em>, <em>Pase Estudiante</em>).</li>
                            <li>Establece la fecha de inicio del plan y registra el Método de Pago inicial (<em>Efectivo</em>, <em>Transferencia</em>, <em>MercadoPago</em>).</li>
                          </ol>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-3" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          3. Renovación Manual de Membresía y Emisión de Comprobantes
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <p>
                            Para renovar una cuota o extender un pase expirado:
                          </p>
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li>En la tarjeta del alumno, presiona <strong>[Renovar]</strong>.</li>
                            <li>Selecciona la cantidad de meses (1, 3, 6, 12). El sistema recalcula automáticamente la nueva fecha de vencimiento sumando la vigencia al plan.</li>
                            <li>Registra el cobro en la Caja registradora e imprime/descarga el <strong>Comprobante Digital / Recibo</strong> de pago para el socio.</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-4" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          4. Verificación y Carga de Certificado Médico (Apto Físico)
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <p>
                            El sistema audita de forma estricta la salud preventiva de los socios:
                          </p>
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li>🟢 <strong>Entregado y Vigente:</strong> Certificado validado con fecha futura.</li>
                            <li>🟡 <strong>Pendiente / Sin Entregar:</strong> El alumno aún no presentó su certificado.</li>
                            <li>🔴 <strong>Vencido:</strong> La fecha de expiración ha caducado.</li>
                          </ul>
                          <p className="text-[11.5px] pt-1">
                            En la ficha expandida del socio, presiona <strong>[Cargar Apto Físico]</strong> para adjuntar la foto/PDF del certificado e ingresar la fecha de vencimiento.
                          </p>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-5" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          5. Congelamiento y Descongelamiento Temporal (Pausar Membresía)
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li><strong>Pausa por Viaje / Lesión:</strong> Presiona <strong>[Congelar]</strong> e ingresa los días de suspensión autorizados (ej. 15 días). La cuenta cambiará a estado <em>Congelado</em>.</li>
                            <li><strong>Extensión Automática de Vencimiento:</strong> El sistema prorroga la fecha final de la membresía sumando exactamente los días de congelamiento.</li>
                            <li><strong>Descongelamiento Anticipado:</strong> Si el alumno regresa antes de lo previsto, presiona <strong>[Descongelar]</strong> para reactivar el pase al instante ajustando los días utilizados.</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-6" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          6. Ficha Médica y Observaciones del Alumno
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <p>
                            Cada socio posee un panel de observaciones clínicas y operativas. Registra alergias, lesiones articulares preexistentes, patologías o notas de atención al cliente.
                          </p>
                          <p className="text-[11.5px]">
                            Esta información se despliega automáticamente en el monitor de recepción y alerta a los profesores al momento del check-in.
                          </p>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-7" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          7. Cancelación de Membresías y Reglas de Integridad (Archivado / Borrado)
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li><strong>Dar de Baja:</strong> Cancela la membresía activa y permite pausar/cancelar suscripciones recurrentes de MercadoPago.</li>
                            <li><strong>Regla de Protección Contable (Borrado Lógico):</strong> Para prevenir daños en los reportes financieros y de asistencias históricas, si el alumno posee movimientos contables, el sistema rechaza la eliminación física y traslada la cuenta al estado <strong>Archivado (Cancelado)</strong>.</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {/* Expanded Details for Caja Guide */}
                {isCaja && isExpanded && (
                  <div className="mt-4 pt-4 border-t border-border space-y-5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between flex-wrap gap-2 bg-muted/40 p-3 rounded-2xl border border-border/60">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-bold text-foreground">
                          Guía Oficial de Operación de Caja, POS y Cobros Presenciales (6 Módulos Clave)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl text-xs h-8 gap-1.5 font-semibold"
                          onClick={handleCopyCajaGuideText}
                        >
                          <Copy className="w-3.5 h-3.5" /> Copiar Guía
                        </Button>
                        <Button
                          size="sm"
                          className="rounded-xl text-xs h-8 gap-1.5 font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                          onClick={() => onNavigateTab?.("caja")}
                        >
                          Ir al Módulo <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Accordion de Módulos de Caja */}
                    <Accordion type="single" collapsible defaultValue="item-1" className="w-full space-y-2">
                      <AccordionItem value="item-1" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          1. Métricas de Caja en Tiempo Real (Resumen de Turno)
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <p>
                            El encabezado resume los números del turno en 3 tarjetas dinámicas:
                          </p>
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li><strong>Ingresos en Caja (Turno):</strong> Suma total de cobros registrados por Efectivo, MercadoPago/QR y Transferencias.</li>
                            <li><strong>Egresos & Gastos Menores:</strong> Salidas de dinero por insumos de limpieza, compras de mostrador o viáticos.</li>
                            <li><strong>Efectivo Esperado en Cajón:</strong> Cálculo del dinero físico que debe haber en el cajón de efectivo (<code>Ingresos Efectivo - Egresos Efectivo</code>).</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-2" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          2. Terminal POS - Cobro Libre y Venta de Productos de Tienda
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <p>
                            Presiona <strong>[Nuevo Movimiento]</strong> para desplegar la terminal de venta:
                          </p>
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li><strong>Modo Cobro / Movimiento Libre:</strong> Para pases diarios de musculación, pases de invitado, eventos o gastos operativos.</li>
                            <li><strong>Modo Venta de Producto (Tienda):</strong> Selecciona artículos del inventario (suplementos, bebidas, toallas) descontando automáticamente las unidades del stock.</li>
                            <li><strong>Asociación a Alumno:</strong> Selecciona un socio del padrón para vincular la compra a su historial.</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-3" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          3. Canales de Pago y Soporte de Pago Mixto (Split Payment)
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <p>
                            Soporta cobro directo por <strong>Efectivo</strong>, <strong>MercadoPago / QR</strong> y <strong>Transferencia Bancaria</strong>.
                          </p>
                          <p className="text-[11.5px]">
                            <strong>Pago Mixto (Split Payment):</strong> Selecciona la opción <strong>[Pago Mixto]</strong> para dividir un cobro combinando Efectivo y Digital (ej. $5.000 Efectivo + $10.000 MercadoPago). El sistema asienta automáticamente ambos renglones en el libro de caja.
                          </p>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-4" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          4. Arqueo de Caja y Cierre de Turno
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <p>
                            Al finalizar el turno, presiona <strong>[Arqueo & Cierre]</strong>:
                          </p>
                          <ol className="list-decimal pl-4 space-y-1 text-[11.5px]">
                            <li>Ingresa el monto total de billetes en efectivo contados físicamente en el cajón de dinero.</li>
                            <li>El sistema auditor compara el conteo contra el <em>Efectivo Esperado en Cajón</em> e informa:
                              <br />• 🟢 <strong>Caja Cuadrada ($0 diferencia):</strong> Conteo exacto.
                              <br />• 🔴 <strong>Faltante de Caja (-$X):</strong> Alerta de dinero faltante con registro de auditoría.
                              <br />• 🔵 <strong>Sobrante de Caja (+$X):</strong> Alerta de dinero sobrante.
                            </li>
                          </ol>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-5" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          5. Historial de Transacciones, Buscador y Filtros Avanzados
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li><strong>Buscador por Texto:</strong> Filtra por concepto, nombre del alumno o recepcionista que registró el movimiento.</li>
                            <li><strong>Filtros por Canal:</strong> Selecciona Todos, Efectivo, MercadoPago/QR o Transferencia.</li>
                            <li><strong>Filtros por Rango de Fecha:</strong> Transacciones de Hoy, Última Semana, Mes Actual o Todo el Historial.</li>
                            <li><strong>Filtros por Tipo:</strong> Alterna entre Todos los movimientos, Solo Ingresos o Solo Egresos.</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-6" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          6. Anulación de Movimientos y Exportación a CSV
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li><strong>Anulación Auditoría:</strong> Permite revertir una transacción errónea. La transacción no se elimina del historial por integridad contable, sino que queda rotulada con la etiqueta <strong>ANULADO</strong> indicando el administrador y la fecha.</li>
                            <li><strong>Exportar CSV:</strong> Haz clic en <strong>[Exportar CSV]</strong> para descargar la planilla descargable de movimientos del turno para auditorías externas.</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {/* Expanded Details for Finanzas Guide */}
                {isFinanzas && isExpanded && (
                  <div className="mt-4 pt-4 border-t border-border space-y-5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between flex-wrap gap-2 bg-muted/40 p-3 rounded-2xl border border-border/60">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-bold text-foreground">
                          Guía Oficial de Operación de Liquidación de Staff y Finanzas (5 Módulos Clave)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl text-xs h-8 gap-1.5 font-semibold"
                          onClick={handleCopyFinanzasGuideText}
                        >
                          <Copy className="w-3.5 h-3.5" /> Copiar Guía
                        </Button>
                        <Button
                          size="sm"
                          className="rounded-xl text-xs h-8 gap-1.5 font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                          onClick={() => onNavigateTab?.("finanzas")}
                        >
                          Ir al Módulo <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Accordion de Módulos de Finanzas */}
                    <Accordion type="single" collapsible defaultValue="item-1" className="w-full space-y-2">
                      <AccordionItem value="item-1" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          1. Salud Financiera & Margen Operativo Neto (KPIs en Tiempo Real)
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <p>
                            El panel superior audita la salud contable mensual a través de 4 métricas clave:
                          </p>
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li><strong>Ingresos Brutos (Mes Actual):</strong> Suma de la facturación de membresías + cobros presenciales registrados en el POS de Caja.</li>
                            <li><strong>Honorarios Staff Liquidados:</strong> Monto total abonado a profesores y coaches en el período.</li>
                            <li><strong>Gastos Fijos & Operativos:</strong> Costos estructurales (Alquiler, Servicios públicos, Mantenimiento) + Salidas registradas en Caja.</li>
                            <li><strong>Margen Operativo Neto:</strong> Utilidad neta mensual (<code>Ingresos Brutos - Honorarios - Gastos Fijos y Operativos</code>).</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-2" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          2. Configuración y Personalización de Rubros de Gastos Fijos
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <p>
                            Haz clic en <strong>[Ajustar Rubros]</strong> para personalizar la matriz de costos estructurales:
                          </p>
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li><strong>Rubros Base Predefinidos:</strong> Alquiler de Sede, Luz & Energía Eléctrica, Agua & Servicios Sanitarios, Internet, Software & Servidores, Mantenimiento & Seguridad.</li>
                            <li><strong>Edición de Costos y Nuevas Categorías:</strong> Ajusta los valores mensuales de cada servicio o agrega nuevos rubros con su importe en pesos.</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-3" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          3. Motor de Cálculo y Liquidación de Staff por Asistencias (Payroll Engine)
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <p>
                            Cálculo transparente de sueldos combinando la grilla horaria y los check-ins de alumnos:
                          </p>
                          <p className="text-[11.5px] bg-muted/60 p-2 rounded-xl border border-border/40 font-mono">
                            Honorario = Sueldo Base + (Clases Dictadas x Tarifa Clase) + (Alumnos Atendidos x Bonificación Asistencia)
                          </p>
                          <p className="text-[11.5px] pt-1">
                            Presiona <strong>[Recalcular Asistencias]</strong> para actualizar instantáneamente las liquidaciones del mes cruzando las asistencias reales de la agenda.
                          </p>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-4" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          4. Gestión de Pagos, Comprobantes de Liquidación y Recibos de Staff
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li><strong>Acreditar Pago:</strong> Presiona <strong>[Acreditar Pago]</strong> sobre la liquidación pendiente para cambiar su estado a <em>Pagado</em>, asentando el egreso contable en la caja del gimnasio.</li>
                            <li><strong>Ver Recibo Digital:</strong> Presiona <strong>[Ver Recibo]</strong> para desplegar e imprimir el comprobante oficial con el detalle de clases dictadas, alumnos atendidos y firma de acreditación.</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-5" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          5. Buscador, Filtros de Período y Exportación CSV Auditora
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li><strong>Selector de Período:</strong> Alterna entre meses específicos (<em>Junio 2026</em>, <em>Mayo 2026</em>) o consulta <em>Todos los Períodos</em>.</li>
                            <li><strong>Filtros por Estado:</strong> Selecciona <em>Todos</em>, <em>Pendientes de Pago</em> o <em>Acreditados / Pagados</em>.</li>
                            <li><strong>Buscador de Coach:</strong> Búsqueda por Nombre o Especialidad del entrenador.</li>
                            <li><strong>Exportar CSV:</strong> Presiona <strong>[Exportar CSV]</strong> para descargar la planilla descargable de liquidaciones para liquidación impositiva o contabilidad externa.</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {/* Expanded Details for Reportes Guide */}
                {isReportes && isExpanded && (
                  <div className="mt-4 pt-4 border-t border-border space-y-5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between flex-wrap gap-2 bg-muted/40 p-3 rounded-2xl border border-border/60">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-bold text-foreground">
                          Guía Oficial de Operación de Reportes y Analítica de Negocio (5 Módulos Clave)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl text-xs h-8 gap-1.5 font-semibold"
                          onClick={handleCopyReportesGuideText}
                        >
                          <Copy className="w-3.5 h-3.5" /> Copiar Guía
                        </Button>
                        <Button
                          size="sm"
                          className="rounded-xl text-xs h-8 gap-1.5 font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                          onClick={() => onNavigateTab?.("reportes")}
                        >
                          Ir al Módulo <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Accordion de Módulos de Reportes */}
                    <Accordion type="single" collapsible defaultValue="item-1" className="w-full space-y-2">
                      <AccordionItem value="item-1" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          1. Toolbar Ejecutivo y Filtros Multidimensionales
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <p>
                            El panel ejecutivo permite filtrar y consultar datos clave en tiempo real:
                          </p>
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li><strong>Rango de Fecha:</strong> Alterna entre <em>Hoy</em>, <em>Últimos 7 días</em>, <em>Este Mes</em>, <em>Mes Anterior</em> y <em>Trimestre Actual</em>.</li>
                            <li><strong>Filtro por Disciplina:</strong> Filtra datos por clases específicas (<em>CrossFit</em>, <em>Spinning</em>, <em>Yoga</em>, <em>Pilates</em>, <em>Funcional</em>) o visualiza <em>Todas las Clases</em>.</li>
                            <li><strong>Sub-Pestañas de Análisis:</strong> Alterna entre <em>Finanzas e Ingresos</em>, <em>Asistencia y Ocupación</em>, <em>Retención y Alumnos</em> y <em>Staff & Coaches</em>.</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-2" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          2. Analítica Financiera y Desglose por Métodos de Pago
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <p>
                            Audita la facturación ejecutiva y canales de cobro:
                          </p>
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li><strong>Facturación Total & Ticket Promedio:</strong> Recaudación bruta del período y valor promedio cobrado por socio activo.</li>
                            <li><strong>Desglose por Canal de Cobro:</strong> Porcentaje e importe en pesos acumulados por <em>MercadoPago / App</em>, <em>Transferencia Bancaria</em> y <em>Efectivo en Mostrador</em>.</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-3" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          3. Ocupación de Salones y Eficiencia de Clases
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <p>
                            Analiza el rendimiento del espacio físico de la sede:
                          </p>
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li><strong>Tasa de Ocupación Global (%):</strong> Relación entre lugares reservados vs capacidad total ofrecida.</li>
                            <li><strong>Optimización de Agenda:</strong> Identifica horarios pico con cupos al 100% y horarios con baja demanda para reconfigurar la grilla.</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-4" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          4. Retención de Alumnos y Re-Engagement por WhatsApp
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <p>
                            Monitorea la retención del padrón e identifica socios en riesgo de abandono (Churn):
                          </p>
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li><strong>Identificación Automática:</strong> Alumnos activos sin asistencias registradas en los últimos 12+ días.</li>
                            <li><strong>Contacto Directo:</strong> Presiona <strong>[Contactar por WhatsApp]</strong> para iniciar una conversación directa con un mensaje pre-redactado amigable para incentivar su regreso.</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-5" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          5. Rendimiento del Staff y Exportación de Reportes (CSV & PDF/Print)
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li><strong>Métricas de Profesores:</strong> Clases impartidas, promedio de alumnos por sesión y calificación general.</li>
                            <li><strong>Exportar a CSV:</strong> Genera una planilla descargable con los datos de la pestaña activa (Finanzas, Asistencias, Socios o Staff).</li>
                            <li><strong>Imprimir / PDF:</strong> Presiona <strong>[Imprimir / PDF]</strong> para abrir el diálogo de impresión con diseño optimizado para presentaciones o auditorías.</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {/* Expanded Details for Inventario Guide */}
                {isInventario && isExpanded && (
                  <div className="mt-4 pt-4 border-t border-border space-y-5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between flex-wrap gap-2 bg-muted/40 p-3 rounded-2xl border border-border/60">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-bold text-foreground">
                          Guía Oficial de Operación de Inventario y Kardex (6 Módulos Clave)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl text-xs h-8 gap-1.5 font-semibold"
                          onClick={handleCopyInventarioGuideText}
                        >
                          <Copy className="w-3.5 h-3.5" /> Copiar Guía
                        </Button>
                        <Button
                          size="sm"
                          className="rounded-xl text-xs h-8 gap-1.5 font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                          onClick={() => onNavigateTab?.("inventario")}
                        >
                          Ir al Módulo <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Accordion de Módulos de Inventario */}
                    <Accordion type="single" collapsible defaultValue="item-1" className="w-full space-y-2">
                      <AccordionItem value="item-1" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          1. Catálogo de Productos y Métricas de Stock en Tiempo Real
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <p>
                            El panel de tienda audita el inventario físico mediante 4 tarjetas principales:
                          </p>
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li><strong>Total Productos:</strong> Cantidad de artículos activos registrados en el catálogo.</li>
                            <li><strong>Valoración del Inventario ($ ARS):</strong> Suma del valor monetario total del stock a precio de costo/venta.</li>
                            <li><strong>Alertas de Stock Bajo / Agotado:</strong> Artículos que han alcanzado o superado el límite mínimo configurado.</li>
                            <li><strong>Categorías Activas:</strong> Clasificación de productos (<em>Suplementos</em>, <em>Bebidas</em>, <em>Accesorios</em>, <em>Indumentaria</em>, <em>Snacks</em>).</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-2" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          2. Alta, Edición y Variantes de Productos
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <p>
                            Haz clic en <strong>[+ Nuevo Producto]</strong> para dar de alta artículos en el catálogo:
                          </p>
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li><strong>Datos del Producto:</strong> Nombre, Categoría, Precio de Costo, Precio de Venta en Mostrador, Stock Inicial, Stock Mínimo de Alerta, Unidad de Medida y Código de Barras.</li>
                            <li><strong>Variantes de Producto:</strong> Configura atributos específicos (ej. Talles <em>S, M, L, XL</em> o Sabores <em>Vainilla, Chocolate, Frutilla</em>) manteniendo control de stock independiente.</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-3" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          3. Ajustes Manuales de Inventario (Entradas, Muestras y Mermas)
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <p>
                            En la tarjeta de cualquier artículo, presiona <strong>[Ajustar Stock]</strong> para efectuar modificaciones:
                          </p>
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li>🟢 <strong>Entrada:</strong> Ingreso de mercadería por reabastecimiento directo de proveedor.</li>
                            <li>🟡 <strong>Ajuste Manual:</strong> Corrección de diferencias de conteo o degustaciones de muestra.</li>
                            <li>🔴 <strong>Merma / Pérdida:</strong> Bajas por producto dañado, vencido o roto. Obliga a ingresar motivo para auditoría.</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-4" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          4. Registro Kardex y Auditoría Contable de Movimientos
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <p>
                            La sub-pestaña <strong>Kardex de Movimientos</strong> ofrece trazabilidad total de cada producto:
                          </p>
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li><strong>Historial Cronológico:</strong> Registra fecha, hora, producto, tipo de movimiento, unidades modificadas, stock resultante, usuario administrador y observaciones.</li>
                            <li><strong>Filtros Avanzados:</strong> Búsqueda por Rango de Fechas (<em>Desde / Hasta</em>), Tipo (<em>Entrada</em>, <em>Salida / Venta POS</em>, <em>Ajuste Manual</em>, <em>Merma</em>) y Buscador por texto.</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-5" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          5. Directorio de Proveedores y Orden de Compra Automática
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li><strong>Directorio de Proveedores:</strong> Mantiene la nómina de distribuidores y empresas asociadas con nombre, contacto, teléfono, email y rubro.</li>
                            <li><strong>Generador de Pedido de Reposición:</strong> Haz clic en <strong>[Generar Orden de Compra]</strong> para que el sistema detecte de forma inteligente todos los ítems por debajo del stock mínimo y calcule las cantidades a pedir por proveedor.</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-6" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          6. Integración con la Terminal POS de Caja y Descuento Automático
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <p>
                            El catálogo de productos se sincroniza en vivo con el <strong>Módulo de Caja / POS</strong>.
                          </p>
                          <p className="text-[11.5px]">
                            Al cobrar un producto de la tienda en mostrador, el sistema efectúa la <strong>baja automática de stock</strong> en el catálogo y genera el asiento contable de salida correspondiente en el Kardex.
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {/* Expanded Details for Reseñas Guide */}
                {isResenas && isExpanded && (
                  <div className="mt-4 pt-4 border-t border-border space-y-5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between flex-wrap gap-2 bg-muted/40 p-3 rounded-2xl border border-border/60">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-bold text-foreground">
                          Guía Oficial de Operación de Reseñas y Feedback (5 Módulos Clave)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl text-xs h-8 gap-1.5 font-semibold"
                          onClick={handleCopyResenasGuideText}
                        >
                          <Copy className="w-3.5 h-3.5" /> Copiar Guía
                        </Button>
                        <Button
                          size="sm"
                          className="rounded-xl text-xs h-8 gap-1.5 font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                          onClick={() => onNavigateTab?.("reseñas")}
                        >
                          Ir al Módulo <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Accordion de Módulos de Reseñas */}
                    <Accordion type="single" collapsible defaultValue="item-1" className="w-full space-y-2">
                      <AccordionItem value="item-1" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          1. Métricas de Calidad de la Sede
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <p>
                            El panel superior audita la percepción de los socios a través de indicadores promediados:
                          </p>
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li><strong>Puntuación General (⭐ 4.9):</strong> Calificación global promedio otorgada por los alumnos.</li>
                            <li><strong>Puntuación por Criterios:</strong> Desglose individual en <em>Limpieza e Higiene</em>, <em>Equipamiento y Máquinas</em>, <em>Atención del Staff</em> y <em>Relación Precio / Calidad</em>.</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-2" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          2. Reseñas Públicas y Destacadas en Landing Page
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <p>
                            Administración del testimonio público de la sede:
                          </p>
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li><strong>Moderación de Opiniones:</strong> Filtra comentarios por estrellas (5★, 4★, 3★, 2★, 1★) y por estado (con o sin respuesta).</li>
                            <li><strong>Destacar en Landing Page:</strong> Presiona el botón <strong>[Destacar en Landing]</strong> (ícono de estrella) en las mejores reseñas para exhibirlas públicamente en la portada web oficial de la sede.</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-3" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          3. Respuestas Oficiales del Gimnasio
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <p>
                            Construye reputación institucional respondiendo a las evaluaciones:
                          </p>
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li>Haz clic en <strong>[Responder]</strong> sobre cualquier comentario para ingresar el mensaje oficial de agradecimiento o aclaración.</li>
                            <li>Permite editar o eliminar una respuesta previa manteniendo el historial institucional.</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-4" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          4. Buzón Privado de Sugerencias y Reclamos
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <p>
                            Gestión confidencial de reclamos e ideas de los alumnos:
                          </p>
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li><strong>Categorías de Feedback:</strong> <em>Instalaciones</em>, <em>Clases & Horarios</em>, <em>Climatización</em>, <em>Atención / Staff</em>.</li>
                            <li><strong>Gestión de Estados:</strong> Alterna la sugerencia entre <em>Pendiente</em> (amarillo) y <em>Atendido</em> (verde).</li>
                            <li><strong>Notas Internas:</strong> Agrega comentarios de gestión interna (ej. <em>"Dispenser extra será instalado el próximo martes"</em>) solo visible para administradores.</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-5" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          5. Campañas de Solicitud de Reseñas por WhatsApp
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <p>
                            Incentiva la recolección de testimonios positivos de forma proactiva:
                          </p>
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li>Presiona <strong>[Solicitar Reseñas por WhatsApp]</strong> para abrir el selector de socios.</li>
                            <li>Busca al alumno por Nombre o DNI para autocompletar su número telefónico.</li>
                            <li>El sistema abre WhatsApp con un mensaje cordial e invitación directa a calificar la experiencia en la sede.</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {/* Expanded Details for Membresías Guide */}
                {isMembresias && isExpanded && (
                  <div className="mt-4 pt-4 border-t border-border space-y-5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between flex-wrap gap-2 bg-muted/40 p-3 rounded-2xl border border-border/60">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-bold text-foreground">
                          Guía Oficial de Operación de Membresías y Tarifas (6 Módulos Clave)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl text-xs h-8 gap-1.5 font-semibold"
                          onClick={handleCopyMembresiasGuideText}
                        >
                          <Copy className="w-3.5 h-3.5" /> Copiar Guía
                        </Button>
                        <Button
                          size="sm"
                          className="rounded-xl text-xs h-8 gap-1.5 font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                          onClick={() => onNavigateTab?.("membresias")}
                        >
                          Ir al Módulo <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Accordion de Módulos de Membresías */}
                    <Accordion type="single" collapsible defaultValue="item-1" className="w-full space-y-2">
                      <AccordionItem value="item-1" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          1. Catálogo de Planes, Tarifas y Métricas de Adhesión
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <p>
                            El panel de membresías exhibe las tarjetas de pases comercializados por la sede:
                          </p>
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li><strong>Información Comercial:</strong> Nombre del Plan, Precio Actual ($), Precio Anterior (Tachado para ofertas), Duración (<em>Mensual</em>, <em>Trimestral</em>, <em>Semestral</em>, <em>Anual</em>) y Cantidad de Socios Adheridos.</li>
                            <li><strong>Buscador y Filtros:</strong> Filtra planes por texto o por etiquetas (<em>Pase Libre</em>, <em>Por Créditos</em>, <em>Estudiantes</em>, <em>Corporativo</em>, <em>VIP</em>).</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-2" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          2. Alta y Configuración Avanzada de Membresías
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <p>
                            Haz clic en <strong>[+ Nueva Membresía]</strong> para crear una opción tarifaria:
                          </p>
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li><strong>Modelos de Acceso:</strong> Elige entre <em>Pase Libre</em> (asistencia ilimitada) o <em>Por Créditos</em> (bolsa de créditos mensuales consumibles por reserva de clase).</li>
                            <li><strong>Límite Diario de Clases:</strong> Define restricciones por día (<em>Ilimitado</em>, <em>1 clase por día</em>, <em>2 clases por día</em>).</li>
                            <li><strong>Días de Congelamiento Autorizados:</strong> Días de pausa/congelamiento de cuota permitidos por año (ej: 15 o 30 días de viaje).</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-3" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          3. Franjas Horarias (Off-Peak / Horario Valle) y Disciplinas Incluidas
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <p>
                            Personalización de restricciones y alcance de la membresía:
                          </p>
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li><strong>Horario Off-Peak:</strong> Permite configurar una tarifa reducida válida únicamente en ventanas de menor afluencia (ej: 12:00 a 16:00 hs).</li>
                            <li><strong>Disciplinas Incluidas:</strong> Tilda qué disciplinas comprende la cuota (<em>Musculación</em>, <em>CrossFit</em>, <em>Spinning</em>, <em>Yoga</em>, <em>Pilates</em>, <em>Funcional</em>).</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-4" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          4. Amenities Incluidos y Plan Destacado en Landing Page
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li><strong>Servicios Adicionales:</strong> Asocia servicios extra que el socio disfrutará sin cargo (<em>Estacionamiento gratuito</em>, <em>Toalla sin cargo</em>, <em>Lockers VIP</em>).</li>
                            <li><strong>Plan Destacado en Landing Page:</strong> Marca la opción <strong>[Destacar en Landing]</strong> en el plan estrella para exhibirlo resaltado con badge promocional en la web pública.</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-5" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          5. Duplicación Rápida y Edición de Tarifas
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li><strong>Duplicar Plan:</strong> Presiona <strong>[Duplicar]</strong> sobre cualquier membresía existente para clonar sus parámetros y crear variaciones rápidamente (ej. crear el plan Trimestral duplicando el Mensual).</li>
                            <li><strong>Edición de Precios:</strong> Actualización instantánea de costos de lista, precios de oferta o matrículas de inscripción.</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-6" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          6. Reglas de Integridad Contable y Eliminación Segura
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <p>
                            Protección de la consistencia del padrón financiero del gimnasio.
                          </p>
                          <p className="text-[11.5px]">
                            Para eliminar un plan sin uso, el sistema requiere escribir la palabra de confirmación <strong>ELIMINAR</strong>. Si el plan posee socios activos adheridos, el sistema impedirá el borrado directo solicitando reasignar previamente a los alumnos a otra tarifa activa.
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {/* Expanded Details for Configuración Guide */}
                {isConfig && isExpanded && (
                  <div className="mt-4 pt-4 border-t border-border space-y-5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between flex-wrap gap-2 bg-muted/40 p-3 rounded-2xl border border-border/60">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-bold text-foreground">
                          Guía Oficial de Configuración de Sede y Políticas (6 Módulos Clave)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl text-xs h-8 gap-1.5 font-semibold"
                          onClick={handleCopyConfigGuideText}
                        >
                          <Copy className="w-3.5 h-3.5" /> Copiar Guía
                        </Button>
                        <Button
                          size="sm"
                          className="rounded-xl text-xs h-8 gap-1.5 font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                          onClick={() => onNavigateTab?.("configuracion")}
                        >
                          Ir al Módulo <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Accordion de Módulos de Configuración */}
                    <Accordion type="single" collapsible defaultValue="item-1" className="w-full space-y-2">
                      <AccordionItem value="item-1" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          1. Información General de la Sede y Grilla Horaria de 7 Días
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <p>
                            Administración de la identidad de la marca y horario comercial:
                          </p>
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li><strong>Ficha de la Sede:</strong> Nombre Comercial, Dirección Física, Teléfono WhatsApp, Redes Sociales (Instagram, TikTok) y Galería de Fotos del Gimnasio.</li>
                            <li><strong>Esquema Horario Semanal:</strong> Configura la apertura e intervalos por cada día de la semana (Lunes a Domingo) para delimitar las franjas de reserva.</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-2" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          2. Gestión Multisede y Salones de Entrenamiento
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <p>
                            Control de sucursales físicas y espacios interiores:
                          </p>
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li><strong>Multisedes:</strong> Alta de sucursales con dirección, manager responsable y coordenadas GPS.</li>
                            <li><strong>Salones de Entrenamiento:</strong> Creación de salones (ej: <em>Arena Principal</em>, <em>Sala de Yoga / Pilates</em>, <em>Spinning Zone</em>) con capacidad máxima de cupos.</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-3" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          3. Directorio de Staff, Disponibilidad Horaria y Esquema Salarial
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <p>
                            Administración del equipo de entrenadores y personal de recepción:
                          </p>
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li><strong>Ficha de Staff:</strong> Nombre, Rol (<em>Coach</em> / <em>Recepción</em>), Especialidades y Certificados / Diplomas acreditados.</li>
                            <li><strong>Disponibilidad Horaria:</strong> Configura días e intervalos horarios en que cada entrenador está disponible para ser asignado en la grilla.</li>
                            <li><strong>Estructura Salarial:</strong> Define Sueldo Base Mensual, Tarifa por Clase Dictada y Bonificación por Alumno Atendido para el cálculo automatizado de sueldos.</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-4" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          4. Métodos de Pago y Vinculación Mercado Pago (OAuth)
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <p>
                            Configuración de pasarelas y canales de recaudación:
                          </p>
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li><strong>Mercado Pago OAuth:</strong> Vinculación directa con tu cuenta comercial para habilitar cobros en la app de alumnos y débitos automáticos.</li>
                            <li><strong>Transferencias Bancarias:</strong> Carga de CBU, Alias, CUIT y Razón Social para recibir transferencias directas.</li>
                            <li><strong>Efectivo & POS Presencial:</strong> Habilitación de cobros presenciales en la caja receptora.</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-5" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          5. Políticas de Cancelación, No-Shows y Días de Cierre (Blackout Days)
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li><strong>Límite de Cancelación Anticipada:</strong> Horas previas requeridas para cancelar una reserva de clase sin perder la clase o crédito (ej. 2 horas antes).</li>
                            <li><strong>Regla de No-Shows:</strong> Definición de sanciones o penalizaciones por inasistencia sin aviso.</li>
                            <li><strong>Días de Cierre (Blackout Days):</strong> Registro de feriados nacionales o jornadas de mantenimiento donde el sistema cancela y bloquea automáticamente la agenda horaria.</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-6" className="border border-border rounded-2xl px-4 bg-secondary/20">
                        <AccordionTrigger className="text-xs font-bold text-foreground hover:no-underline py-3">
                          6. Mantenimiento de Equipamiento y Checklists de Protocolos Operativos
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 leading-relaxed pb-3">
                          <ul className="list-disc pl-4 space-y-1 text-[11.5px]">
                            <li><strong>Catálogo de Equipamiento:</strong> Inventario de máquinas, mancuernas y accesorios con registro de maintenance preventivo.</li>
                            <li><strong>Protocolos Operativos & Checklists:</strong> Tareas de apertura y cierre asignadas por turno a Recepción y Coaches con firmas de cumplimiento con hora exacta.</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/50 text-xs">
                  <span className="text-[10.5px] text-muted-foreground font-medium">
                    {guide.modulesCount} Módulos explicados · Actualizado: {guide.lastUpdated}
                  </span>

                  {isAsistencias || isClases || isMiembros || isCaja || isFinanzas || isReportes || isInventario || isResenas || isMembresias || isConfig ? (
                    <Button
                      size="sm"
                      variant={isExpanded ? "outline" : "default"}
                      className="rounded-xl font-bold text-xs h-8 px-4"
                      onClick={() => setActiveGuideId(isExpanded ? null : guide.id)}
                    >
                      {isExpanded ? "Ocultar Detalles" : "Ver Guía Completa"}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled
                      className="rounded-xl font-medium text-xs h-8 px-3 opacity-60"
                    >
                      Próximamente
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
