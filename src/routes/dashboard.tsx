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
  ShoppingCart,
  Package,
  PlusCircle,
  MinusCircle,
  QrCode,
} from "lucide-react";
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
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
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/dashboard")({
  component: GymDashboard,
});

const TABS = [
  // Operación Diaria (Front-desk)
  { id: "asistencia", label: "Asistencias", icon: Activity, group: "Operación Diaria" },
  { id: "clases", label: "Clases", icon: Calendar, group: "Operación Diaria" },
  { id: "tienda", label: "Tienda / POS", icon: ShoppingCart, group: "Operación Diaria" },
  { id: "miembros", label: "Miembros", icon: Users, group: "Operación Diaria" },
  // Crecimiento
  { id: "clases-prueba", label: "Clases de Prueba", icon: HelpCircle, group: "Crecimiento" },
  { id: "reseñas", label: "Reseñas", icon: MessageCircle, group: "Crecimiento" },
  // Administración
  { id: "finanzas", label: "Finanzas & Caja", icon: DollarSign, group: "Administración" },
  { id: "membresias", label: "Membresías", icon: CreditCard, group: "Administración" },
  { id: "reportes", label: "Reportes", icon: BarChart2, group: "Administración" },
  { id: "config", label: "Configuración", icon: Settings, group: "Administración" },
];

type UserRole = "superadmin" | "manager" | "receptionist" | "coach" | "student";
interface CurrentUser {
  name: string;
  role: UserRole;
  branchId?: string;
  staffId?: string;
}

function GymDashboard() {
  const [activeTab, setActiveTab] = useState("asistencia");
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<CurrentUser>({
    name: "Alan Kraft (SuperAdmin)",
    role: "superadmin",
  });
  const [isSimuladorOpen, setIsSimuladorOpen] = useState(false);

  // STATE LIFTED UP (Models the Firebase data structure in local memory)

  // 1. Staff List
  const [staffList, setStaffList] = useState<
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
      availability?: { day: string; hours: string }[];
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
      specialty: "Coach de Levantamiento Olímpico",
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
      specialty: "Profesora de Vinyasa Yoga",
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
      specialty: "Preparador Físico Funcional",
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
      id: "1",
      name: "Sede Belgrano",
      address: "Av. Cabildo 1820, Belgrano, CABA",
      manager: "Marcos Pérez",
      lat: -34.5612,
      lng: -58.4568,
      creditCostMultiplier: 1.0,
    },
    {
      id: "2",
      name: "Sede Las Cañitas",
      address: "Ortega y Gasset 1520, Las Cañitas, CABA",
      manager: "Sofía Rodríguez",
      lat: -34.5715,
      lng: -58.4352,
      creditCostMultiplier: 1.2,
    },
  ]);
  const [selectedBranchId, setSelectedBranchId] = useState("all");

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
      paidAt: "2026-07-01",
    },
    {
      id: "pay-2",
      staffId: "2",
      period: "Junio 2026",
      classesGiven: 14,
      studentsAttended: 98,
      totalAmount: 70000,
      status: "paid",
      paidAt: "2026-07-01",
    },
    {
      id: "pay-3",
      staffId: "3",
      period: "Junio 2026",
      classesGiven: 22,
      studentsAttended: 310,
      totalAmount: 248000,
      status: "paid",
      paidAt: "2026-07-01",
    },
  ]);

  useEffect(() => {
    if (currentUser.role === "superadmin") {
      setSelectedBranchId("all");
      setActiveTab("asistencia");
    } else if (currentUser.role === "coach") {
      setSelectedBranchId("all");
      setActiveTab("clases"); // Coaches should open directly in Clases
    } else if (currentUser.branchId) {
      setSelectedBranchId(currentUser.branchId);
      setActiveTab("asistencia");
    } else {
      setSelectedBranchId("matriz");
      setActiveTab("asistencia");
    }
  }, [currentUser]);

  const pendingSubstitutionsCount = useMemo(() => {
    return classesList.filter((c) => c.seekingBackup).length;
  }, [classesList]);

  const visibleClasses = useMemo(() => {
    let list = classesList;
    if (currentUser.role === "coach" && currentUser.staffId) {
      list = list.filter((c) => c.staffId === currentUser.staffId);
    }
    if (selectedBranchId === "all") return list;
    if (selectedBranchId === "matriz") return list.filter((c) => !c.branchId);
    return list.filter((c) => c.branchId === selectedBranchId);
  }, [classesList, selectedBranchId, currentUser]);

  const visibleTabs = useMemo(() => {
    return TABS.filter((tab) => {
      if (currentUser.role === "coach") {
        return tab.id === "clases";
      }
      if (currentUser.role === "receptionist") {
        return (
          tab.id !== "config" &&
          tab.id !== "membresias" &&
          tab.id !== "finanzas" &&
          tab.id !== "reportes"
        );
      }
      if (currentUser.role === "manager") {
        return tab.id !== "config" && tab.id !== "membresias";
      }
      return true;
    });
  }, [currentUser]);

  const handleLinkStaffByOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput) return;

    // Find staff with that code and status pending
    const match = staffList.find((s) => s.linkingCode === otpInput && s.status === "pending");
    if (match) {
      // Consume OTP (set linkingCode to null) and set status to linked
      setStaffList((prev) =>
        prev.map((s) => (s.id === match.id ? { ...s, status: "linked", linkingCode: null } : s)),
      );
      // Log in as that staff member
      setCurrentUser({
        name: `${match.name} (${match.role === "manager" ? "Gerente" : match.role === "receptionist" ? "Recepción" : "Coach"})`,
        role: (match.role || "coach") as any,
        branchId: match.branchId,
        staffId: match.id,
      });
      setOtpInput("");
      alert(
        `🎉 ¡Dispositivo vinculado con éxito para ${match.name}! El código de un solo uso ha sido consumido.`,
      );
    } else {
      alert("❌ Código OTP incorrecto, ya utilizado o no asignado a ningún empleado pendiente.");
    }
  };

  const handleLogout = () => {
    navigate({ to: "/auth/gym" });
  };

  if (currentUser.role === "student") {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
        <header className="p-4 border-b border-border flex justify-between items-center sticky top-0 bg-background/80 backdrop-blur-md z-30">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground">
              <Dumbbell className="h-4 w-4" />
            </div>
            <span className="font-bold tracking-tight">Studio Pulse App</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-foreground">{currentUser.name}</span>
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80"
              alt={currentUser.name}
              className="h-8 w-8 rounded-full border border-border"
            />
          </div>
        </header>

        <main className="flex-1 p-4 w-full max-w-lg mx-auto pb-32">
          <StudentAppView
            currentUser={currentUser}
            classesList={classesList}
            setClassesList={setClassesList}
            salasList={salasList}
            setReviewsList={setReviewsList}
            branchesList={branchesList}
          />
        </main>

        {/* Floating Role Simulator for testing permissions */}
        <div className="fixed bottom-4 right-4 bg-card border border-border p-3.5 rounded-2xl z-50 max-w-sm flex flex-col gap-2 animate-fade-in text-foreground">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Simulador de Permisos (RBAC)
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-muted-foreground font-semibold">
              Seleccionar Rol Simulado:
            </label>
            <select
              value={`${currentUser.role}-${currentUser.branchId || ""}-${currentUser.staffId || ""}`}
              onChange={(e) => {
                const [role, branchId, staffId] = e.target.value.split("-");
                if (role === "superadmin") {
                  setCurrentUser({ name: "Alan Kraft (SuperAdmin)", role: "superadmin" });
                } else if (role === "manager") {
                  setCurrentUser({
                    name: "Marcos Pérez (Gerente)",
                    role: "manager",
                    branchId: branchId || undefined,
                  });
                } else if (role === "receptionist") {
                  setCurrentUser({
                    name: "Camila Díaz (Recepción)",
                    role: "receptionist",
                    branchId: branchId || undefined,
                  });
                } else if (role === "coach") {
                  setCurrentUser({
                    name: "Mateo Rossi (Coach)",
                    role: "coach",
                    staffId: staffId || undefined,
                  });
                } else if (role === "student") {
                  setCurrentUser({ name: "Agustín Gómez", role: "student" });
                }
              }}
              className="h-8 rounded-lg border border-border bg-background px-2 text-xs font-semibold cursor-pointer focus-visible:outline-none"
            >
              <option value="superadmin--">Alan Kraft (👑 HQ SuperAdmin)</option>
              <option value="manager-1-">Marcos Pérez (👤 Gerente - Sede Belgrano)</option>
              <option value="receptionist-2-">
                Camila Díaz (🔑 Recepcionista - Sede Las Cañitas)
              </option>
              <option value="coach--1">Mateo Rossi (💪 Coach / Profesor)</option>
              <option value="student--">Agustín Gómez (🙋‍♂️ Alumno App)</option>
            </select>
          </div>
          <p className="text-[9px] text-muted-foreground leading-relaxed mt-0.5">
            Estás viendo la vista móvil simplificada ("App Alumno") que verían los miembros de tu
            gimnasio desde sus celulares.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-card border-b md:border-b-0 md:border-r border-border p-6 flex flex-col h-auto md:h-screen sticky top-0 z-30 shrink-0">
        <div className="flex items-center gap-2 mb-8 justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground">
              <Building2 className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold tracking-tight">Shakerfy Admin</span>
          </div>
          <button
            onClick={handleLogout}
            className="md:hidden p-2 rounded-xl text-destructive hover:bg-destructive/ transition"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 flex flex-col gap-1.5 overflow-y-auto pr-2 pb-10 [&::-webkit-scrollbar]:hidden">
          {visibleTabs.map((tab, index) => {
            const Icon = tab.icon;
            const hasSubstitutionsBadge = tab.id === "clases" && pendingSubstitutionsCount > 0;
            const showDivider = index === 0 || visibleTabs[index - 1].group !== tab.group;

            return (
              <Fragment key={tab.id}>
                {showDivider && (
                  <div className={`px-4 pb-1 ${index > 0 ? "pt-5" : "pt-2"}`}>
                    <div className="text-[10px] font-extrabold text-muted-foreground/70 uppercase tracking-wider">
                      {tab.group}
                    </div>
                  </div>
                )}
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{tab.label}</span>
                  {hasSubstitutionsBadge && (
                    <span className="ml-auto bg-secondary text-white font-extrabold text-[9px] px-2 py-0.5 rounded-full shrink-0 animate-pulse uppercase tracking-wider">
                      {pendingSubstitutionsCount} suplencia
                      {pendingSubstitutionsCount > 1 ? "s" : ""}
                    </span>
                  )}
                </button>
              </Fragment>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="hidden md:flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/ transition mt-auto"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 w-full max-w-7xl mx-auto overflow-x-auto min-w-0">
        {/* Top Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Kraft Strength Club</h1>
            <p className="text-sm text-muted-foreground">
              Panel de Control de Recepción y Administración.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              disabled={currentUser.role !== "superadmin" && currentUser.role !== "coach"}
              className="h-9 rounded-xl border border-border bg-card pl-3.5 pr-9 text-xs font-semibold focus-visible:outline-none cursor-pointer hover:bg-secondary/40 transition text-foreground disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <option value="all">Sedes: Consolidado (Todas)</option>
              <option value="matriz">Sede Principal (Palermo)</option>
              {branchesList.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>

            <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center relative cursor-pointer">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
            </div>

            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-foreground">{currentUser.name}</div>
                <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">
                  {currentUser.role === "superadmin"
                    ? "👑 Global HQ"
                    : currentUser.role === "manager"
                      ? "👤 Gerente"
                      : currentUser.role === "receptionist"
                        ? "🔑 Recepción"
                        : "💪 Coach"}
                </div>
              </div>
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Admin"
                className="h-9 w-9 rounded-full border border-border"
              />
            </div>
          </div>
        </header>

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
        {currentUser.role !== "student" &&
          (() => {
            const userRole = currentUser.role;
            const applicableProtocols = protocols.filter((p) => {
              if (userRole === "superadmin" || userRole === "manager") return true; // ver todos
              return p.role === userRole;
            });

            if (applicableProtocols.length === 0) return null;

            if (!isChecklistVisible) {
              return (
                <div className="mb-6">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl text-xs font-bold gap-2 text-muted-foreground border-border bg-card hover:bg-muted"
                    onClick={() => setIsChecklistVisible(true)}
                  >
                    <FileText className="h-3.5 w-3.5" /> Abrir Protocolos Operativos
                  </Button>
                </div>
              );
            }

            return (
              <div className="mb-6 p-5 rounded-xl bg-secondary/35 border border-border text-xs space-y-4 transition-all animate-fade-in text-foreground">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4.5 w-4.5 text-primary" />
                    <span className="font-extrabold text-foreground text-sm">
                      📋 Protocolos Operativos del Turno
                    </span>
                  </div>
                  <button
                    onClick={() => setIsChecklistVisible(false)}
                    className="text-muted-foreground hover:text-foreground text-xs font-bold"
                  >
                    Ocultar
                  </button>
                </div>

                <div className="space-y-4">
                  {applicableProtocols.map((prot) => {
                    const isCompleted = !!completedProtocols[prot.id];
                    const completedInfo = completedProtocols[prot.id];

                    // Check if all items are checked for this protocol
                    const allChecked = prot.items.every(
                      (_, idx) => !!protocolItemChecks[`${prot.id}-${idx}`],
                    );

                    return (
                      <div
                        key={prot.id}
                        className="p-4 rounded-2xl bg-card border border-border/60 space-y-3"
                      >
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-foreground">{prot.title}</span>
                            <span className="text-[9px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full font-bold uppercase">
                              {prot.time}
                            </span>
                            <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase">
                              Destinado a: {prot.role}
                            </span>
                            {isCompleted && (
                              <span className="text-[10px] bg-primary/ text-primary px-2 py-0.5 rounded-full font-bold">
                                ✓ Registrado por {completedInfo.savedBy} a las{" "}
                                {completedInfo.savedTime}
                              </span>
                            )}
                          </div>

                          {!isCompleted && (
                            <Button
                              size="sm"
                              className="h-8 text-[11px] font-bold rounded-xl"
                              disabled={!allChecked}
                              onClick={() => {
                                const now = new Date();
                                const dateStr = now.toISOString().split("T")[0];
                                const timeStr = now.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                });
                                setCompletedProtocols((prev) => ({
                                  ...prev,
                                  [prot.id]: {
                                    savedBy: currentUser.name.split(" ")[0],
                                    savedTime: timeStr,
                                  },
                                }));
                                const newLog = {
                                  id: `log-${Date.now()}`,
                                  date: dateStr,
                                  time: timeStr,
                                  protocolTitle: prot.title,
                                  staffName: currentUser.name.split(" ")[0],
                                  role: currentUser.role,
                                  itemsCount: prot.items.length,
                                };
                                setChecklistLogs((prev) => [newLog, ...prev]);
                                alert(`🎉 Protocolo "${prot.title}" registrado con éxito.`);
                              }}
                            >
                              Registrar Protocolo
                            </Button>
                          )}
                        </div>

                        {!isCompleted ? (
                          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                            {prot.items.map((item, idx) => {
                              const checkKey = `${prot.id}-${idx}`;
                              return (
                                <label
                                  key={idx}
                                  className="flex items-center gap-2.5 p-3 rounded-2xl bg-secondary/15 border border-border/40 hover:bg-secondary/35 transition cursor-pointer select-none"
                                >
                                  <input
                                    type="checkbox"
                                    checked={!!protocolItemChecks[checkKey]}
                                    onChange={(e) =>
                                      setProtocolItemChecks((prev) => ({
                                        ...prev,
                                        [checkKey]: e.target.checked,
                                      }))
                                    }
                                    className="h-4.5 w-4.5 accent-primary rounded cursor-pointer shrink-0"
                                  />
                                  <span className="text-xs text-foreground font-semibold">
                                    {item}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-xs text-muted-foreground italic flex items-center gap-1.5 pl-1">
                            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                            Todas las tareas de este protocolo han sido verificadas y completadas
                            para el turno.
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

        {activeTab === "asistencia" && (
          <AsistenciasTab selectedBranchId={selectedBranchId} blackoutDays={blackoutDays} />
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
        {activeTab === "clases-prueba" && (
          <ClasesPruebaTab
            trialRequests={trialRequests}
            setTrialRequests={setTrialRequests}
            classesList={classesList}
            trialClassSettings={trialClassSettings}
            setTrialClassSettings={setTrialClassSettings}
          />
        )}
        {activeTab === "clases" && (
          <ClasesTab
            classesList={visibleClasses}
            setClassesList={setClassesList}
            staffList={staffList}
            canManageClasses={currentUser.role === "superadmin" || currentUser.role === "manager"}
            blackoutDays={blackoutDays}
            salasList={salasList}
            branchesList={branchesList}
            selectedBranchId={selectedBranchId}
            cancellationPolicyHours={cancellationPolicyHours}
            currentUser={currentUser}
          />
        )}
        {activeTab === "reseñas" && (
          <ReseñasTab reviewsList={reviewsList} setReviewsList={setReviewsList} />
        )}
        {activeTab === "tienda" && (
          <TiendaTab
            cashTransactions={cashTransactions}
            setCashTransactions={setCashTransactions}
            currentUser={currentUser}
          />
        )}
        {activeTab === "finanzas" && (
          <FinanzasTab
            cashTransactions={cashTransactions}
            setCashTransactions={setCashTransactions}
            payrollRecords={payrollRecords}
            setPayrollRecords={setPayrollRecords}
            staffList={staffList}
            classesList={classesList}
            membersList={membersList}
            setMembersList={setMembersList}
            currentUser={currentUser}
          />
        )}
        {activeTab === "reportes" && (
          <ReportesTab
            classesList={classesList}
            membersList={membersList}
            cashTransactions={cashTransactions}
            membershipsList={membershipsList}
          />
        )}
        {activeTab === "config" && (
          <ConfigTab
            selectedBranchId={selectedBranchId}
            staffList={staffList}
            setStaffList={setStaffList}
            amenities={amenities}
            setAmenities={setAmenities}
            requirements={requirements}
            setRequirements={setRequirements}
            equipment={equipment}
            setEquipment={setEquipment}
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

      {/* Floating Role Simulator for testing permissions */}
      {isSimuladorOpen ? (
        <div className="fixed bottom-4 right-4 bg-card border border-border p-3.5 rounded-2xl z-50 max-w-sm flex flex-col gap-2 animate-fade-in text-foreground">
          <div className="flex justify-between items-center mb-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Simulador de Permisos (RBAC)
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 -mr-1"
              onClick={() => setIsSimuladorOpen(false)}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-muted-foreground font-semibold">
              Seleccionar Rol Simulado:
            </label>
            <select
              value={`${currentUser.role}-${currentUser.branchId || ""}-${currentUser.staffId || ""}`}
              onChange={(e) => {
                const [role, branchId, staffId] = e.target.value.split("-");
                if (role === "superadmin") {
                  setCurrentUser({ name: "Alan Kraft (SuperAdmin)", role: "superadmin" });
                } else if (role === "manager") {
                  setCurrentUser({
                    name: "Marcos Pérez (Gerente)",
                    role: "manager",
                    branchId: branchId || undefined,
                  });
                } else if (role === "receptionist") {
                  setCurrentUser({
                    name: "Camila Díaz (Recepción)",
                    role: "receptionist",
                    branchId: branchId || undefined,
                  });
                } else if (role === "coach") {
                  setCurrentUser({
                    name: "Mateo Rossi (Coach)",
                    role: "coach",
                    staffId: staffId || undefined,
                  });
                } else if (role === "student") {
                  setCurrentUser({ name: "Agustín Gómez", role: "student" });
                }
              }}
              className="h-8 rounded-lg border border-border bg-background px-2 text-xs font-semibold cursor-pointer focus-visible:outline-none"
            >
              <option value="superadmin--">Alan Kraft (👑 HQ SuperAdmin)</option>
              <option value="manager-1-">Marcos Pérez (👤 Gerente - Sede Belgrano)</option>
              <option value="receptionist-2-">
                Camila Díaz (🔑 Recepcionista - Sede Las Cañitas)
              </option>
              <option value="coach--1">Mateo Rossi (💪 Coach / Profesor)</option>
              <option value="student--">Agustín Gómez (🙋‍♂️ Alumno App)</option>
            </select>
          </div>

          {/* OTP Linkage Form */}
          <form
            onSubmit={handleLinkStaffByOtp}
            className="border-t border-border/40 pt-2 flex flex-col gap-1.5"
          >
            <label className="text-[10px] text-muted-foreground font-semibold">
              📲 Vincular App Staff (Código 4-dig):
            </label>
            <div className="flex gap-1.5">
              <input
                type="text"
                maxLength={4}
                placeholder="Ej: 7821"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
                className="h-7 w-24 rounded-lg border border-border bg-background px-2 text-xs font-mono text-center focus-visible:outline-none text-foreground"
              />
              <Button
                type="submit"
                size="sm"
                className="h-7 rounded-lg text-[10px] py-0 px-3 font-bold"
              >
                Vincular
              </Button>
            </div>
          </form>

          <p className="text-[9px] text-muted-foreground leading-relaxed mt-0.5">
            {currentUser.role === "superadmin" &&
              "Permisos globales HQ. Puede ver todo, cambiar de sede libremente y editar la configuración y membresías."}
            {currentUser.role === "manager" &&
              "Permisos limitados a Sede Belgrano. No puede acceder a pestañas de Membresías ni Configuración Global."}
            {currentUser.role === "receptionist" &&
              "Permisos limitados a Sede Las Cañitas. Solo gestiona la lista de asistencia de la sucursal asignada."}
            {currentUser.role === "coach" &&
              "Permisos limitados a profesor. Solo puede ver y listar los alumnos inscritos en sus clases particulares."}
            {currentUser.role === "student" && "Vista simplificada de la App del Alumno."}
          </p>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-4 right-4 z-50 rounded-full border border-border bg-card/80 backdrop-blur-sm text-xs font-semibold"
          onClick={() => setIsSimuladorOpen(true)}
        >
          <Settings className="w-3.5 h-3.5 mr-2" />
          RBAC
        </Button>
      )}
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

// ─────────────────────────────────────────────────────────────────────────────
// REPORTES TAB
// ─────────────────────────────────────────────────────────────────────────────
function ReportesTab({
  classesList,
  membersList,
  cashTransactions,
  membershipsList,
}: {
  classesList: any[];
  membersList: any[];
  cashTransactions: { type: string; channel: string; amount: number; date: string }[];
  membershipsList: { id: string; name: string; price: number; activeCount: number }[];
}) {
  const fmtARS = (n: number) => `$${n.toLocaleString("es-AR")}`;

  // ── RETENTION ──────────────────────────────────────────────────────────────
  const retActive = membersList.filter((m) => m.status === "activo").length;
  const retPending = membersList.filter((m) => m.status === "pendiente").length;
  const retExpired = membersList.filter((m) => m.status === "vencido").length;
  const retTotal = membersList.length || 1;
  const retentionRate = Math.round((retActive / retTotal) * 100);

  // ── TOP CLASSES BY FILL RATE ───────────────────────────────────────────────
  const classByFill = [...classesList]
    .map((c) => ({
      name: c.name,
      fill:
        c.capacity > 0
          ? Math.round((Object.keys(c.enrolledSpots || {}).length / c.capacity) * 100)
          : 0,
      enrolled: Object.keys(c.enrolledSpots || {}).length,
      capacity: c.capacity,
    }))
    .sort((a, b) => b.fill - a.fill)
    .slice(0, 8);

  // ── REVENUE BY CHANNEL ─────────────────────────────────────────────────────
  const incomes = cashTransactions.filter((t) => t.type === "income");
  const totalIncome = incomes.reduce((s, t) => s + t.amount, 0) || 1;
  const byChannel = (["app", "transfer", "cash"] as const).map((ch) => ({
    ch,
    amount: incomes.filter((t) => t.channel === ch).reduce((s, t) => s + t.amount, 0),
  }));

  // ── PEAK HOURS ─────────────────────────────────────────────────────────────
  const hourMap: Record<string, { total: number; enrolled: number }> = {};
  classesList.forEach((c) => {
    const hour = c.time?.split(":")[0] ?? "?";
    if (!hourMap[hour]) hourMap[hour] = { total: 0, enrolled: 0 };
    hourMap[hour].total += c.capacity;
    hourMap[hour].enrolled += Object.keys(c.enrolledSpots || {}).length;
  });
  const peakHours = Object.entries(hourMap)
    .map(([h, v]) => ({
      hour: `${h}:00`,
      pct: v.total > 0 ? Math.round((v.enrolled / v.total) * 100) : 0,
    }))
    .sort((a, b) => a.hour.localeCompare(b.hour));
  const maxPct = Math.max(...peakHours.map((p) => p.pct), 1);

  // ── MOST ACTIVE MEMBERS ────────────────────────────────────────────────────
  const memberActivity = membersList
    .map((m) => {
      const attended = classesList.reduce((s, c) => {
        const spot = Object.entries(c.enrolledSpots || {}).find(([, n]) => n === m.name);
        if (!spot) return s;
        const idx = parseInt(spot[0]);
        return s + (c.attendance?.[idx] === "presente" ? 1 : 0);
      }, 0);
      return { name: m.name, photo: m.photo, plan: m.plan, attended };
    })
    .sort((a, b) => b.attended - a.attended);

  // ── MEMBERSHIP REVENUE BREAKDOWN ───────────────────────────────────────────
  const membershipRevTotal = membershipsList.reduce((s, m) => s + m.price * m.activeCount, 0) || 1;

  const channelColors: Record<string, string> = {
    app: "bg-primary",
    transfer: "bg-primary",
    cash: "bg-primary",
  };
  const channelLabels: Record<string, string> = {
    app: "📱 App",
    transfer: "🏦 Transferencia",
    cash: "💵 Efectivo",
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Reportes & Analytics</h2>
        <p className="text-sm text-muted-foreground">
          Métricas clave del negocio, calculadas en tiempo real sobre los datos actuales.
        </p>
      </div>

      {/* ── ROW 1: Retention + Revenue ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Retención */}
        <Card className="border-border bg-card rounded-3xl">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Retención de Alumnos
              </div>
              <div
                className={`text-2xl font-extrabold ${retentionRate >= 70 ? "text-primary" : retentionRate >= 50 ? "text-secondary-foreground" : "text-destructive"}`}
              >
                {retentionRate}%
              </div>
            </div>
            {/* Stacked bar */}
            <div className="h-3 rounded-full overflow-hidden flex gap-0.5">
              <div
                className="bg-primary rounded-l-full transition-all duration-700"
                style={{ width: `${(retActive / retTotal) * 100}%` }}
              />
              <div
                className="bg-secondary transition-all duration-700"
                style={{ width: `${(retPending / retTotal) * 100}%` }}
              />
              <div
                className="bg-destructive rounded-r-full transition-all duration-700"
                style={{ width: `${(retExpired / retTotal) * 100}%` }}
              />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { label: "Activos", count: retActive, color: "text-primary", bg: "bg-primary/" },
                {
                  label: "Pendientes",
                  count: retPending,
                  color: "text-secondary-foreground",
                  bg: "bg-secondary/",
                },
                {
                  label: "Vencidos",
                  count: retExpired,
                  color: "text-destructive",
                  bg: "bg-destructive/",
                },
              ].map((s) => (
                <div key={s.label} className={`${s.bg} rounded-2xl py-2`}>
                  <div className={`text-xl font-extrabold ${s.color}`}>{s.count}</div>
                  <div className="text-[10px] text-muted-foreground font-bold uppercase">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ingresos por canal */}
        <Card className="border-border bg-card rounded-3xl">
          <CardContent className="pt-6 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Ingresos por Canal
            </div>
            <div className="space-y-3">
              {byChannel.map(({ ch, amount }) => {
                const pct = Math.round((amount / totalIncome) * 100);
                return (
                  <div key={ch} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>{channelLabels[ch]}</span>
                      <span className="text-muted-foreground">
                        {fmtARS(amount)} <span className="text-muted-foreground/60">({pct}%)</span>
                      </span>
                    </div>
                    <div className="h-2 bg-secondary/40 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${channelColors[ch]} rounded-full transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="pt-2 border-t border-border/60 flex justify-between text-xs font-bold">
              <span className="text-muted-foreground">Total registrado</span>
              <span>{fmtARS(totalIncome - 1)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── ROW 2: Clases por Ocupación ───────────────────────────────────── */}
      <Card className="border-border bg-card rounded-3xl">
        <CardContent className="pt-6 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Top Clases por Tasa de Ocupación
          </div>
          <div className="space-y-2.5">
            {classByFill.map((c, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="text-[10px] font-extrabold text-muted-foreground w-4 shrink-0">
                  {i + 1}
                </div>
                <div className="text-xs font-semibold w-36 shrink-0 truncate">{c.name}</div>
                <div className="flex-1 h-2 bg-secondary/40 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${c.fill >= 80 ? "bg-destructive" : c.fill >= 50 ? "bg-secondary" : "bg-primary"}`}
                    style={{ width: `${c.fill}%` }}
                  />
                </div>
                <div className="text-[10px] font-bold text-muted-foreground w-20 text-right shrink-0">
                  {c.enrolled}/{c.capacity} · {c.fill}%
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground pt-1">
            🔴 &gt;80% lleno · 🟡 50-80% · 🟢 &lt;50%
          </p>
        </CardContent>
      </Card>

      {/* ── ROW 3: Peak Hours + Memberships ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Horarios de mayor demanda */}
        <Card className="border-border bg-card rounded-3xl">
          <CardContent className="pt-6 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Horarios de Mayor Demanda
            </div>
            <div className="flex items-end gap-1.5 h-24">
              {peakHours.map(({ hour, pct }) => (
                <div key={hour} className="flex-1 flex flex-col items-center gap-1">
                  <div className="text-[9px] font-bold text-muted-foreground">{pct}%</div>
                  <div
                    className={`w-full rounded-t-md transition-all duration-700 ${pct >= 70 ? "bg-destructive" : pct >= 40 ? "bg-secondary" : "bg-primary/"}`}
                    style={{ height: `${Math.round((pct / maxPct) * 64)}px`, minHeight: "4px" }}
                  />
                  <div className="text-[8px] text-muted-foreground font-semibold">{hour}</div>
                </div>
              ))}
            </div>
            {peakHours.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">
                Sin datos suficientes
              </p>
            )}
          </CardContent>
        </Card>

        {/* Membresías activas */}
        <Card className="border-border bg-card rounded-3xl">
          <CardContent className="pt-6 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Membresías — Recaudación Estimada
            </div>
            <div className="space-y-3">
              {membershipsList.map((m) => {
                const total = m.price * m.activeCount;
                const pct = Math.round((total / membershipRevTotal) * 100);
                const palette = ["bg-primary", "bg-primary", "bg-primary"];
                const color = palette[membershipsList.indexOf(m) % palette.length];
                return (
                  <div key={m.id} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>
                        {m.name}{" "}
                        <span className="text-muted-foreground font-normal">
                          · {m.activeCount} alumnos
                        </span>
                      </span>
                      <span className="text-muted-foreground">{fmtARS(total)}</span>
                    </div>
                    <div className="h-2 bg-secondary/40 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${color} rounded-full transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── ROW 4: Most Active Members ───────────────────────────────────── */}
      <Card className="border-border bg-card rounded-3xl">
        <CardContent className="pt-6 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Alumnos Más Activos
          </div>
          <div className="space-y-2">
            {memberActivity.slice(0, 6).map((m, i) => (
              <div key={m.name} className="flex items-center gap-3 text-xs">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center font-extrabold text-[9px] shrink-0 ${
                    i === 0
                      ? "bg-secondary text-white"
                      : i === 1
                        ? "bg-slate-400 text-white"
                        : i === 2
                          ? "bg-orange-700 text-white"
                          : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </div>
                <img
                  src={m.photo}
                  alt={m.name}
                  className="w-7 h-7 rounded-xl border border-border shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{m.name}</div>
                  <div className="text-muted-foreground">{m.plan}</div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  <span className="font-bold">{m.attended} presencias</span>
                </div>
              </div>
            ))}
            {memberActivity.every((m) => m.attended === 0) && (
              <p className="text-xs text-muted-foreground text-center py-4">
                Aún no hay asistencias registradas en el período.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FINANZAS TAB
// ─────────────────────────────────────────────────────────────────────────────
type CashTransaction = {
  id: string;
  date: string;
  type: "income" | "expense";
  channel: "cash" | "transfer" | "app" | "payroll";
  description: string;
  amount: number;
  registeredBy: string;
};

type PayrollRecord = {
  id: string;
  staffId: string;
  period: string;
  classesGiven: number;
  studentsAttended: number;
  totalAmount: number;
  status: "pending" | "paid";
  paidAt?: string;
};

function calcCoachPayroll(
  staff: {
    payModel?: string;
    fixedRatePerClass?: number;
    ratePerStudent?: number;
    revenuePercent?: number;
  },
  classesGiven: number,
  studentsAttended: number,
  totalRevenue: number,
): number {
  switch (staff.payModel) {
    case "fixed_class":
      return classesGiven * (staff.fixedRatePerClass ?? 0);
    case "per_student":
      return studentsAttended * (staff.ratePerStudent ?? 0);
    case "hybrid":
      return (
        classesGiven * (staff.fixedRatePerClass ?? 0) +
        studentsAttended * (staff.ratePerStudent ?? 0)
      );
    case "percent":
      return totalRevenue * ((staff.revenuePercent ?? 0) / 100);
    default:
      return classesGiven * 3000;
  }
}

const CHANNEL_LABELS: Record<string, string> = {
  cash: "💵 Efectivo",
  transfer: "🏦 Transferencia",
  app: "📱 App (MercadoPago)",
  payroll: "👨‍🏫 Sueldo Coach",
};

const PAY_MODEL_LABELS: Record<string, string> = {
  fixed_class: "Fijo por clase",
  per_student: "Por alumno presente",
  hybrid: "Híbrido (Fijo + Por alumno)",
  percent: "% de recaudación",
};

const MOCK_PRODUCTS = [
  {
    id: "p1",
    name: "Agua Mineral 500ml",
    category: "Bebidas",
    price: 1500,
    stock: 45,
    image:
      "https://images.unsplash.com/photo-1546820228-569d6c2c10b7?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: "p2",
    name: "Gatorade Frutos Rojos",
    category: "Bebidas",
    price: 2500,
    stock: 20,
    image:
      "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: "p3",
    name: "Barra de Proteína",
    category: "Suplementos",
    price: 3000,
    stock: 15,
    image:
      "https://images.unsplash.com/photo-1620189507195-68309c04c4d0?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: "p4",
    name: "Pre-entreno 300g",
    category: "Suplementos",
    price: 35000,
    stock: 8,
    image:
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: "p5",
    name: "Toalla de microfibra",
    category: "Accesorios",
    price: 8000,
    stock: 12,
    image:
      "https://images.unsplash.com/photo-1584947936640-5e608cced9ee?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: "p6",
    name: "Candado de combinación",
    category: "Accesorios",
    price: 6500,
    stock: 30,
    image:
      "https://images.unsplash.com/photo-1551372659-54bc7b99c26b?auto=format&fit=crop&w=150&q=80",
  },
];

function TiendaTab({
  cashTransactions,
  setCashTransactions,
  currentUser,
}: {
  cashTransactions: CashTransaction[];
  setCashTransactions: React.Dispatch<React.SetStateAction<CashTransaction[]>>;
  currentUser: { name: string; role: string };
}) {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [cart, setCart] = useState<{ product: (typeof MOCK_PRODUCTS)[0]; quantity: number }[]>([]);
  const [txChannel, setTxChannel] = useState<"cash" | "transfer">("cash");
  const [search, setSearch] = useState("");

  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [newProductName, setNewProductName] = useState("");
  const [newProductCategory, setNewProductCategory] = useState("Bebidas");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductStock, setNewProductStock] = useState("");

  const openEditProduct = (p: (typeof MOCK_PRODUCTS)[0]) => {
    setEditingProductId(p.id);
    setNewProductName(p.name);
    setNewProductCategory(p.category);
    setNewProductPrice(p.price.toString());
    setNewProductStock(p.stock.toString());
    setIsAddProductOpen(true);
  };

  const handleDeleteProduct = () => {
    if (editingProductId && window.confirm("¿Seguro que deseas eliminar este producto?")) {
      setProducts((prev) => prev.filter((p) => p.id !== editingProductId));
      setIsAddProductOpen(false);
    }
  };

  const handleAddProduct = () => {
    if (!newProductName || !newProductPrice || !newProductStock) return;

    if (editingProductId) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProductId
            ? {
                ...p,
                name: newProductName,
                category: newProductCategory,
                price: Number(newProductPrice),
                stock: Number(newProductStock),
              }
            : p,
        ),
      );
    } else {
      const newProduct = {
        id: "p" + Date.now(),
        name: newProductName,
        category: newProductCategory,
        price: Number(newProductPrice),
        stock: Number(newProductStock),
        image:
          "https://images.unsplash.com/photo-1546820228-569d6c2c10b7?auto=format&fit=crop&w=150&q=80",
      };
      setProducts([newProduct, ...products]);
    }

    setIsAddProductOpen(false);
    setEditingProductId(null);
    setNewProductName("");
    setNewProductPrice("");
    setNewProductStock("");
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  );

  const addToCart = (product: (typeof MOCK_PRODUCTS)[0]) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev; // Cannot add more than stock
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map((item) =>
          item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item,
        );
      }
      return prev.filter((item) => item.product.id !== productId);
    });
  };

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const today = new Date().toISOString().split("T")[0];

    // Add transaction to Finanzas
    setCashTransactions((prev) => [
      {
        id: "tx-pos-" + Date.now(),
        type: "income",
        channel: txChannel,
        amount: total,
        date: today,
        description: "Venta en Tienda (POS)",
        registeredBy: currentUser.name,
      },
      ...prev,
    ]);

    // Deduct stock
    setProducts((prev) =>
      prev.map((p) => {
        const cartItem = cart.find((c) => c.product.id === p.id);
        if (cartItem) {
          return { ...p, stock: p.stock - cartItem.quantity };
        }
        return p;
      }),
    );

    // Clear cart
    setCart([]);
    alert("✅ Venta registrada correctamente en Caja");
  };

  return (
    <div className="flex flex-col h-full gap-6 lg:flex-row">
      {/* Catálogo de Productos */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Tienda / POS</h2>
            <p className="text-sm text-muted-foreground">
              Vende productos y accesorios en recepción.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar producto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-background/50 backdrop-blur-sm border-white/10"
              />
            </div>
            <Button
              onClick={() => {
                setEditingProductId(null);
                setNewProductName("");
                setNewProductPrice("");
                setNewProductStock("");
                setIsAddProductOpen(true);
              }}
              className="rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" /> Nuevo Producto
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pb-20">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              onClick={() => p.stock > 0 && addToCart(p)}
              className={`bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden cursor-pointer hover:border-primary/50 transition-all hover:-translate-y-1 relative group ${p.stock === 0 ? "opacity-50 grayscale cursor-not-allowed" : ""}`}
            >
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-background/90 rounded-md border border-border">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditProduct(p);
                  }}
                  className="p-1.5 hover:text-primary"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="h-32 bg-muted relative">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                {p.stock === 0 && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center font-bold text-red-400">
                    Sin stock
                  </div>
                )}
                <Badge
                  variant="secondary"
                  className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                >
                  {p.category}
                </Badge>
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm line-clamp-1">{p.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-primary">${p.price.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground">{p.stock} un.</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Carrito / Ticket */}
      <div className="w-full lg:w-96 bg-card/30 backdrop-blur-md border-l border-white/5 p-4 flex flex-col h-full rounded-l-3xl lg:rounded-none lg:-mr-4 lg:-my-4">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" /> Ticket Actual
        </h3>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 space-y-2">
              <Package className="w-12 h-12 mb-2" />
              <p>El carrito está vacío</p>
              <p className="text-xs">Selecciona productos para vender</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center justify-between bg-background/50 p-3 rounded-xl border border-white/5"
              >
                <div className="flex-1 min-w-0 pr-2">
                  <div className="font-medium text-sm truncate">{item.product.name}</div>
                  <div className="text-xs text-primary font-bold">
                    ${item.product.price.toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1">
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1 hover:bg-background rounded-md transition-colors"
                  >
                    <MinusCircle className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => addToCart(item.product)}
                    className="p-1 hover:bg-background rounded-md transition-colors"
                    disabled={item.quantity >= item.product.stock}
                  >
                    <PlusCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-4 mt-4 border-t border-white/10 space-y-4">
          <div className="flex justify-between items-center text-xl font-black">
            <span>Total:</span>
            <span className="text-primary">${total.toLocaleString()}</span>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              Método de Pago (Cobro Inmediato)
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setTxChannel("cash")}
                className={`py-2 px-3 rounded-xl text-sm font-bold border transition-all flex items-center justify-center gap-2 ${txChannel === "cash" ? "bg-primary border-primary text-primary-foreground" : "bg-background/50 border-border text-muted-foreground hover:bg-muted"}`}
              >
                💵 Efectivo
              </button>
              <button
                onClick={() => setTxChannel("transfer")}
                className={`py-2 px-3 rounded-xl text-sm font-bold border transition-all flex items-center justify-center gap-2 ${txChannel === "transfer" ? "bg-primary border-primary text-primary-foreground" : "bg-background/50 border-border text-muted-foreground hover:bg-muted"}`}
              >
                📱 Transf.
              </button>
            </div>
          </div>

          <Button
            className="w-full h-12 rounded-xl font-bold text-lg"
            disabled={cart.length === 0}
            onClick={handleCheckout}
          >
            Cobrar ${total.toLocaleString()}
          </Button>
        </div>
      </div>

      {/* Dialog Nuevo Producto */}
      <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-3xl">
          <DialogHeader>
            <DialogTitle>{editingProductId ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Nombre del producto</Label>
              <Input
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                placeholder="Ej. Agua sin gas"
              />
            </div>
            <div className="space-y-2">
              <Label>Categoría</Label>
              <select
                value={newProductCategory}
                onChange={(e) => setNewProductCategory(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="Bebidas">Bebidas</option>
                <option value="Suplementos">Suplementos</option>
                <option value="Accesorios">Accesorios</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Precio ($)</Label>
                <Input
                  type="number"
                  value={newProductPrice}
                  onChange={(e) => setNewProductPrice(e.target.value)}
                  placeholder="1500"
                />
              </div>
              <div className="space-y-2">
                <Label>Stock Inicial</Label>
                <Input
                  type="number"
                  value={newProductStock}
                  onChange={(e) => setNewProductStock(e.target.value)}
                  placeholder="20"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="flex items-center justify-between mt-4">
            {editingProductId ? (
              <Button
                type="button"
                variant="destructive"
                className="rounded-xl flex-1 mr-2"
                onClick={handleDeleteProduct}
              >
                Eliminar
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="rounded-xl flex-1 mr-2"
                onClick={() => setIsAddProductOpen(false)}
              >
                Cancelar
              </Button>
            )}
            <Button onClick={handleAddProduct} className="rounded-xl flex-1">
              {editingProductId ? "Guardar" : "Crear Producto"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FinanzasTab({
  cashTransactions,
  setCashTransactions,
  payrollRecords,
  setPayrollRecords,
  staffList,
  classesList,
  membersList,
  setMembersList,
  currentUser,
}: {
  cashTransactions: CashTransaction[];
  setCashTransactions: React.Dispatch<React.SetStateAction<CashTransaction[]>>;
  payrollRecords: PayrollRecord[];
  setPayrollRecords: React.Dispatch<React.SetStateAction<PayrollRecord[]>>;
  staffList: any[];
  classesList: any[];
  membersList: any[];
  setMembersList: React.Dispatch<React.SetStateAction<any[]>>;
  currentUser: { name: string; role: string };
}) {
  const [subTab, setSubTab] = useState<"caja" | "balance" | "payroll" | "arqueo" | "deudas">(
    "balance",
  );

  // New transaction form state
  const [txType, setTxType] = useState<"income" | "expense">("income");
  const [txChannel, setTxChannel] = useState<"cash" | "transfer" | "app">("cash");
  const [txDescription, setTxDescription] = useState("");
  const [txAmount, setTxAmount] = useState("");

  // ponytail: useState avoids SSR/client Date mismatch (hydration error)
  const [today] = useState(() => new Date().toISOString().split("T")[0]);

  // ── METRICS ──────────────────────────────────────────────────────────────
  const totalIncome = useMemo(
    () => cashTransactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
    [cashTransactions],
  );

  const totalExpense = useMemo(
    () => cashTransactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
    [cashTransactions],
  );

  const appIncome = useMemo(
    () => cashTransactions.filter((t) => t.channel === "app").reduce((s, t) => s + t.amount, 0),
    [cashTransactions],
  );

  const shakeComission = Math.round(appIncome * 0.05);
  const netIncome = totalIncome - shakeComission;
  const profit = netIncome - totalExpense;

  const todayTransactions = useMemo(
    () => cashTransactions.filter((t) => t.date === today),
    [cashTransactions, today],
  );

  const todayIncome = todayTransactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const todayExpense = todayTransactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  // ── PAYROLL CALC ─────────────────────────────────────────────────────────
  // For each coach, compute pending period (current month) from classesList
  const currentPeriod = new Date()
    .toLocaleDateString("es-AR", { month: "long", year: "numeric" })
    .replace(/^\w/, (c) => c.toUpperCase());

  const coaches = staffList.filter((s) => s.role === "coach");

  const pendingPayroll = useMemo(() => {
    return coaches.map((coach) => {
      const existing = payrollRecords.find(
        (p) => p.staffId === coach.id && p.period === currentPeriod,
      );
      if (existing) return { coach, record: existing, pending: false };

      // Count classes and attendees for this coach from classesList
      const coachClasses = classesList.filter((c) => c.staffId === coach.id);
      const classesGiven = coachClasses.length;
      const studentsAttended = coachClasses.reduce(
        (s: number, c: any) => s + Object.keys(c.enrolledSpots || {}).length,
        0,
      );
      const totalRevenue = studentsAttended * 3500; // ponytail: estimate ~$3500/student avg
      const totalAmount = Math.round(
        calcCoachPayroll(coach, classesGiven, studentsAttended, totalRevenue),
      );

      return {
        coach,
        record: {
          id: "",
          staffId: coach.id,
          period: currentPeriod,
          classesGiven,
          studentsAttended,
          totalAmount,
          status: "pending" as const,
        },
        pending: true,
      };
    });
  }, [coaches, classesList, payrollRecords, currentPeriod]);

  const handleAddTransaction = () => {
    const amt = parseFloat(txAmount);
    if (!txDescription.trim() || isNaN(amt) || amt <= 0) return;
    setCashTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        date: today,
        type: txType,
        channel: txChannel,
        description: txDescription.trim(),
        amount: amt,
        registeredBy: currentUser.name,
      },
      ...prev,
    ]);
    setTxDescription("");
    setTxAmount("");
  };

  const handleLiquidate = (item: (typeof pendingPayroll)[0]) => {
    if (!item.pending) return;
    const newRecord: PayrollRecord = {
      ...item.record,
      id: `pay-${Date.now()}`,
      status: "paid",
      paidAt: today,
    };
    setPayrollRecords((prev) => [newRecord, ...prev]);
    // Register as expense in cash register
    setCashTransactions((prev) => [
      {
        id: `tx-payroll-${Date.now()}`,
        date: today,
        type: "expense",
        channel: "payroll",
        description: `💸 Sueldo ${item.coach.name} - ${currentPeriod}`,
        amount: item.record.totalAmount,
        registeredBy: currentUser.name,
      },
      ...prev,
    ]);
  };

  const fmtARS = (n: number) => `$${n.toLocaleString("es-AR")}`;

  // ── ARQUEO STATE ─────────────────────────────────────────────────────────
  const [arqueoEfectivo, setArqueoEfectivo] = useState("");
  const [arqueoTransfer, setArqueoTransfer] = useState("");
  const [arqueoConfirmed, setArqueoConfirmed] = useState(false);
  const [arqueoLogs, setArqueoLogs] = useState<
    {
      date: string;
      expectedCash: number;
      countedCash: number;
      expectedTransfer: number;
      countedTransfer: number;
      diff: number;
      closedBy: string;
    }[]
  >([]);

  const todayCashIncome = todayTransactions
    .filter((t) => t.type === "income" && t.channel === "cash")
    .reduce((s, t) => s + t.amount, 0);
  const todayCashExpense = todayTransactions
    .filter((t) => t.type === "expense" && (t.channel === "cash" || t.channel === "payroll"))
    .reduce((s, t) => s + t.amount, 0);
  const expectedCash = todayCashIncome - todayCashExpense;
  const expectedTransfer = todayTransactions
    .filter((t) => t.type === "income" && t.channel === "transfer")
    .reduce((s, t) => s + t.amount, 0);
  const countedCash = parseFloat(arqueoEfectivo) || 0;
  const countedTransfer = parseFloat(arqueoTransfer) || 0;
  const totalDiff = countedCash - expectedCash + (countedTransfer - expectedTransfer);

  const handleCloseArqueo = () => {
    setArqueoLogs((prev) => [
      {
        date: today,
        expectedCash,
        countedCash,
        expectedTransfer,
        countedTransfer,
        diff: totalDiff,
        closedBy: currentUser.name,
      },
      ...prev,
    ]);
    setArqueoEfectivo("");
    setArqueoTransfer("");
    setArqueoConfirmed(false);
  };

  // ── DEBT HANDLERS ────────────────────────────────────────────────────────
  const [debtPayChannel, setDebtPayChannel] = useState<Record<string, "cash" | "transfer" | "app">>(
    {},
  );

  const handleRegisterDebtPayment = (memberName: string, amount: number, channel: string) => {
    // Clear debt on member
    setMembersList((prev) =>
      prev.map((m) =>
        m.name === memberName
          ? {
              ...m,
              debtAmount: 0,
              status: m.status === "pendiente" || m.status === "vencido" ? "activo" : m.status,
            }
          : m,
      ),
    );
    // Register income in caja
    setCashTransactions((prev) => [
      {
        id: `tx-debt-${Date.now()}`,
        date: today,
        type: "income",
        channel: channel as any,
        description: `💳 Pago de deuda - ${memberName}`,
        amount,
        registeredBy: currentUser.name,
      },
      ...prev,
    ]);
  };

  const debtMembers = useMemo(() => membersList.filter((m) => m.debtAmount > 0), [membersList]);
  const totalDebt = useMemo(() => debtMembers.reduce((s, m) => s + m.debtAmount, 0), [debtMembers]);

  const subTabClass = (id: string) =>
    `px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${subTab === id ? "bg-background border border-border text-primary" : "text-muted-foreground hover:text-foreground"}`;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 text-foreground">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Finanzas & Caja</h2>
          <p className="text-sm text-muted-foreground">
            Ingresos, egresos y liquidación de coaches en tiempo real.
          </p>
        </div>
        <div className="flex p-1 bg-secondary/30 border border-border/80 rounded-2xl overflow-x-auto gap-0.5">
          <button className={subTabClass("balance")} onClick={() => setSubTab("balance")}>
            📊 Balance
          </button>
          <button className={subTabClass("caja")} onClick={() => setSubTab("caja")}>
            💵 Caja
          </button>
          <button className={subTabClass("arqueo")} onClick={() => setSubTab("arqueo")}>
            🧾 Arqueo
            {totalDiff !== 0 && arqueoEfectivo && <span className="ml-1 text-destructive">!</span>}
          </button>
          <button className={subTabClass("deudas")} onClick={() => setSubTab("deudas")}>
            💳 Deudas
            {debtMembers.length > 0 && (
              <span className="ml-1.5 bg-destructive text-white rounded-full px-1.5 py-0 text-[9px] font-extrabold">
                {debtMembers.length}
              </span>
            )}
          </button>
          <button className={subTabClass("payroll")} onClick={() => setSubTab("payroll")}>
            👨‍🏫 Sueldos
          </button>
        </div>
      </div>

      {/* ── SUB-TAB: BALANCE ─────────────────────────────────────────────── */}
      {subTab === "balance" && (
        <div className="space-y-6">
          {/* KPI Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Ingresos Brutos",
                value: fmtARS(totalIncome),
                icon: ArrowUpRight,
                color: "text-primary",
                bg: "bg-primary/",
              },
              {
                label: "Comisión Shakerfy (5%)",
                value: `- ${fmtARS(shakeComission)}`,
                icon: PiggyBank,
                color: "text-primary",
                bg: "bg-primary/",
              },
              {
                label: "Egresos Operativos",
                value: `- ${fmtARS(totalExpense)}`,
                icon: ArrowDownRight,
                color: "text-destructive",
                bg: "bg-destructive/",
              },
              {
                label: "Margen Neto",
                value: fmtARS(profit),
                icon: TrendingUp,
                color: profit >= 0 ? "text-primary" : "text-destructive",
                bg: profit >= 0 ? "bg-primary/" : "bg-destructive/",
              },
            ].map((kpi) => (
              <Card key={kpi.label} className="border-border bg-card rounded-3xl">
                <CardContent className="pt-5 pb-4 space-y-2">
                  <div className={`w-9 h-9 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                    <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                  </div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    {kpi.label}
                  </div>
                  <div className={`text-2xl font-extrabold ${kpi.color}`}>{kpi.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Channel breakdown */}
          <Card className="border-border bg-card rounded-3xl">
            <CardContent className="pt-6 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Desglose por Canal de Cobro
              </div>
              {(["app", "transfer", "cash"] as const).map((ch) => {
                const amt = cashTransactions
                  .filter((t) => t.type === "income" && t.channel === ch)
                  .reduce((s, t) => s + t.amount, 0);
                const pct = totalIncome > 0 ? Math.round((amt / totalIncome) * 100) : 0;
                const colors: Record<string, string> = {
                  app: "bg-primary",
                  transfer: "bg-primary",
                  cash: "bg-primary",
                };
                return (
                  <div key={ch} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>{CHANNEL_LABELS[ch]}</span>
                      <span>
                        {fmtARS(amt)} <span className="text-muted-foreground">({pct}%)</span>
                      </span>
                    </div>
                    <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${colors[ch]} rounded-full transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Today summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="border-border bg-card rounded-3xl">
              <CardContent className="pt-5 pb-4">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Ingresos de Hoy
                </div>
                <div className="text-3xl font-extrabold text-primary">{fmtARS(todayIncome)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {todayTransactions.filter((t) => t.type === "income").length} transacciones
                  registradas hoy
                </p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card rounded-3xl">
              <CardContent className="pt-5 pb-4">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Egresos de Hoy
                </div>
                <div className="text-3xl font-extrabold text-destructive">
                  {fmtARS(todayExpense)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {todayTransactions.filter((t) => t.type === "expense").length} gastos registrados
                  hoy
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ── SUB-TAB: CAJA DIARIA ─────────────────────────────────────────── */}
      {subTab === "caja" && (
        <div className="space-y-5">
          {/* Quick register form */}
          <Card className="border-border bg-card rounded-3xl">
            <CardContent className="pt-6 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Registrar Movimiento
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                    Tipo
                  </label>
                  <div className="flex gap-2">
                    {(["income", "expense"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTxType(t)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                          txType === t
                            ? t === "income"
                              ? "bg-primary text-white border-primary"
                              : "bg-destructive text-white border-destructive"
                            : "bg-background border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {t === "income" ? "📈 Ingreso" : "📉 Egreso"}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                    Canal
                  </label>
                  <select
                    value={txChannel}
                    onChange={(e) => setTxChannel(e.target.value as any)}
                    className="flex h-9 w-full rounded-xl border border-border bg-background px-3 py-1 text-xs focus-visible:outline-none text-foreground font-semibold"
                  >
                    <option value="cash">💵 Efectivo</option>
                    <option value="transfer">🏦 Transferencia</option>
                    <option value="app">📱 App (MercadoPago)</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                  Descripción
                </label>
                <Input
                  placeholder="Ej: Pase mensual - Juan Pérez / Compra de insumos..."
                  value={txDescription}
                  onChange={(e) => setTxDescription(e.target.value)}
                  className="rounded-xl text-xs h-9"
                />
              </div>
              <div className="flex gap-3 items-end">
                <div className="space-y-1 flex-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                    Monto (ARS $)
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    className="rounded-xl text-xs h-9"
                    min={0}
                  />
                </div>
                <Button
                  onClick={handleAddTransaction}
                  className="h-9 px-5 rounded-xl text-xs font-bold"
                  disabled={!txDescription.trim() || !txAmount || parseFloat(txAmount) <= 0}
                >
                  <Plus className="w-3.5 h-3.5 mr-1.5" /> Registrar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Transaction list */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
              Historial de Movimientos ({cashTransactions.length})
            </div>
            {cashTransactions.map((tx) => (
              <div
                key={tx.id}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border text-xs ${tx.type === "income" ? "bg-primary/ border-primary/" : "bg-destructive/ border-destructive/"}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${tx.type === "income" ? "bg-primary/" : "bg-destructive/"}`}
                >
                  {tx.type === "income" ? (
                    <ArrowUpRight className="w-4 h-4 text-primary" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-destructive" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground truncate">{tx.description}</div>
                  <div className="text-muted-foreground">
                    {tx.date} · {CHANNEL_LABELS[tx.channel]} · por {tx.registeredBy}
                  </div>
                </div>
                <div
                  className={`font-extrabold shrink-0 ${tx.type === "income" ? "text-primary dark:text-primary" : "text-destructive dark:text-destructive"}`}
                >
                  {tx.type === "income" ? "+" : "-"}
                  {fmtARS(tx.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SUB-TAB: LIQUIDACIÓN DE SUELDOS ──────────────────────────────── */}
      {subTab === "payroll" && (
        <div className="space-y-5">
          {/* Info banner */}
          <div className="flex items-start gap-3 p-4 bg-primary/ border border-blue-500/30 rounded-3xl text-xs">
            <Receipt className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-primary dark:text-primary mb-0.5">
                Liquidación Automática Basada en Asistencias Reales
              </div>
              <p className="text-muted-foreground font-medium">
                El monto calculado surge de las clases dadas y los alumnos presentes registrados en
                la pestaña de <strong>Clases</strong>, según el modelo de contrato configurado para
                cada coach.
              </p>
            </div>
          </div>

          {/* Current period payroll cards */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
              Período Actual: {currentPeriod}
            </div>
            {pendingPayroll.map(({ coach, record, pending }) => (
              <Card
                key={coach.id}
                className={`border bg-card rounded-3xl ${pending ? "border-border/" : "border-primary/ bg-primary/[0.02]"}`}
              >
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <img
                      src={coach.photo}
                      alt={coach.name}
                      className="w-12 h-12 rounded-2xl border border-border shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-foreground">{coach.name}</span>
                        <Badge
                          variant="secondary"
                          className="text-[9px] uppercase font-extrabold rounded-full"
                        >
                          {PAY_MODEL_LABELS[coach.payModel ?? "fixed_class"]}
                        </Badge>
                        {!pending && (
                          <Badge className="text-[9px] bg-primary/ border-primary/ text-primary dark:text-primary font-extrabold rounded-full">
                            ✅ Liquidado {record.paidAt}
                          </Badge>
                        )}
                        {pending && (
                          <Badge className="text-[9px] bg-secondary/ border-border/ text-secondary-foreground dark:text-secondary-foreground font-extrabold rounded-full">
                            ⏳ Pendiente de Pago
                          </Badge>
                        )}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-1">
                        {record.classesGiven} clases · {record.studentsAttended} presentes
                        {coach.payModel === "hybrid" &&
                          ` · $${coach.fixedRatePerClass?.toLocaleString("es-AR")} fijo + $${coach.ratePerStudent?.toLocaleString("es-AR")}/alumno`}
                        {coach.payModel === "fixed_class" &&
                          ` · $${coach.fixedRatePerClass?.toLocaleString("es-AR")} por clase`}
                        {coach.payModel === "per_student" &&
                          ` · $${coach.ratePerStudent?.toLocaleString("es-AR")} por alumno`}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <div className="text-[10px] text-muted-foreground uppercase font-bold">
                          Total a Pagar
                        </div>
                        <div className="text-2xl font-extrabold text-foreground">
                          {fmtARS(record.totalAmount)}
                        </div>
                      </div>
                      {pending && (
                        <Button
                          onClick={() => handleLiquidate({ coach, record, pending })}
                          className="h-9 px-4 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          <Wallet className="w-3.5 h-3.5 mr-1.5" /> Liquidar y Pagar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Historical payroll */}
          {payrollRecords.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
                Historial de Pagos Anteriores
              </div>
              {payrollRecords.map((record) => {
                const coach = staffList.find((s) => s.id === record.staffId);
                if (!coach) return null;
                return (
                  <div
                    key={record.id}
                    className="flex items-center gap-3 p-3.5 rounded-2xl border border-border bg-card text-xs"
                  >
                    <img
                      src={coach.photo}
                      alt={coach.name}
                      className="w-8 h-8 rounded-xl border border-border shrink-0"
                    />
                    <div className="flex-1">
                      <div className="font-semibold">{coach.name}</div>
                      <div className="text-muted-foreground">
                        {record.period} · {record.classesGiven} clases · {record.studentsAttended}{" "}
                        presentes · Pagado {record.paidAt}
                      </div>
                    </div>
                    <div className="font-extrabold text-foreground shrink-0">
                      {fmtARS(record.totalAmount)}
                    </div>
                    <Badge className="text-[9px] bg-primary/ border-primary/ text-primary dark:text-primary font-extrabold rounded-full shrink-0">
                      ✅ Pagado
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── SUB-TAB: ARQUEO DE CAJA ──────────────────────────────────────── */}
      {subTab === "arqueo" && (
        <div className="space-y-5">
          <div className="flex items-start gap-3 p-4 bg-primary/10 border border-primary/30 rounded-3xl text-xs">
            <Receipt className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-primary mb-0.5">Cierre y Arqueo de Caja Diario</div>
              <p className="text-muted-foreground font-medium">
                Contá el dinero físico en el cajón y las transferencias recibidas. El sistema
                compara con lo registrado y calcula la diferencia.
              </p>
            </div>
          </div>

          {/* System expected values */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="border-border bg-card rounded-3xl">
              <CardContent className="pt-5 pb-4">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">
                  💵 Efectivo — Esperado por Sistema
                </div>
                <div className="text-3xl font-extrabold text-foreground">
                  {fmtARS(expectedCash)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Ingresos efectivo: {fmtARS(todayCashIncome)} — Egresos: {fmtARS(todayCashExpense)}
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card rounded-3xl">
              <CardContent className="pt-5 pb-4">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">
                  🏦 Transferencias — Esperado por Sistema
                </div>
                <div className="text-3xl font-extrabold text-foreground">
                  {fmtARS(expectedTransfer)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Total de transferencias ingresadas hoy
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Physical count inputs */}
          <Card className="border-border bg-card rounded-3xl">
            <CardContent className="pt-6 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Conteo Físico Real
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                    💵 Efectivo contado (ARS $)
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={arqueoEfectivo}
                    onChange={(e) => setArqueoEfectivo(e.target.value)}
                    className="rounded-xl text-sm h-10 font-bold"
                    min={0}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                    🏦 Transferencias contadas (ARS $)
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={arqueoTransfer}
                    onChange={(e) => setArqueoTransfer(e.target.value)}
                    className="rounded-xl text-sm h-10 font-bold"
                    min={0}
                  />
                </div>
              </div>

              {/* Difference result */}
              {(arqueoEfectivo || arqueoTransfer) && (
                <div
                  className={`p-4 rounded-2xl border text-center ${
                    totalDiff === 0
                      ? "bg-primary/ border-primary/"
                      : totalDiff > 0
                        ? "bg-primary/ border-blue-500/30"
                        : "bg-destructive/ border-destructive/"
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Diferencia Total
                  </div>
                  <div
                    className={`text-3xl font-extrabold ${
                      totalDiff === 0
                        ? "text-primary"
                        : totalDiff > 0
                          ? "text-primary"
                          : "text-destructive"
                    }`}
                  >
                    {totalDiff > 0 ? "+" : ""}
                    {fmtARS(totalDiff)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 font-semibold">
                    {totalDiff === 0 && "✅ Caja cuadrada — Sin diferencias"}
                    {totalDiff > 0 && "🔵 Sobrante — Verificar transacciones no registradas"}
                    {totalDiff < 0 && "🔴 Faltante — Verificar egresos o diferencias de cambio"}
                  </div>
                </div>
              )}

              {/* Confirm and close */}
              {(arqueoEfectivo || arqueoTransfer) && !arqueoConfirmed && (
                <Button
                  onClick={() => setArqueoConfirmed(true)}
                  variant="outline"
                  className="w-full rounded-xl font-bold text-xs h-9 border-primary/50 text-primary hover:bg-primary/10"
                >
                  🔒 Confirmar y Cerrar Caja del Día
                </Button>
              )}

              {arqueoConfirmed && (
                <div className="p-4 bg-secondary/ border border-border/ rounded-2xl space-y-3">
                  <div className="text-xs font-bold text-secondary-foreground dark:text-secondary-foreground">
                    ⚠️ Confirmación de Cierre
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Estás por cerrar la caja de hoy <strong>{today}</strong> con una diferencia de{" "}
                    <strong>{fmtARS(totalDiff)}</strong>. Esta acción quedará registrada en el
                    historial.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleCloseArqueo}
                      className="flex-1 h-8 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      ✅ Confirmar Cierre
                    </Button>
                    <Button
                      onClick={() => setArqueoConfirmed(false)}
                      variant="outline"
                      className="flex-1 h-8 rounded-xl text-xs font-bold"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Arqueo history */}
          {arqueoLogs.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
                Historial de Arqueos
              </div>
              {arqueoLogs.map((log, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3.5 rounded-2xl border border-border bg-card text-xs"
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${log.diff === 0 ? "bg-primary/" : log.diff > 0 ? "bg-primary/" : "bg-destructive/"}`}
                  >
                    <Receipt
                      className={`w-4 h-4 ${log.diff === 0 ? "text-primary" : log.diff > 0 ? "text-primary" : "text-destructive"}`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">
                      {log.date} — Cerrado por {log.closedBy}
                    </div>
                    <div className="text-muted-foreground">
                      Efectivo: esperado {fmtARS(log.expectedCash)} / contado{" "}
                      {fmtARS(log.countedCash)} · Transf.: esperado {fmtARS(log.expectedTransfer)} /
                      contado {fmtARS(log.countedTransfer)}
                    </div>
                  </div>
                  <div
                    className={`font-extrabold shrink-0 ${log.diff === 0 ? "text-primary" : log.diff > 0 ? "text-primary" : "text-destructive"}`}
                  >
                    {log.diff > 0 ? "+" : ""}
                    {fmtARS(log.diff)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── SUB-TAB: CUENTAS CORRIENTES / DEUDAS ─────────────────────────── */}
      {subTab === "deudas" && (
        <div className="space-y-5">
          {/* Summary KPI */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card
              className={`border rounded-3xl ${debtMembers.length > 0 ? "border-destructive/ bg-destructive/" : "border-primary/ bg-primary/"}`}
            >
              <CardContent className="pt-5 pb-4">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Alumnos con Deuda
                </div>
                <div
                  className={`text-3xl font-extrabold ${debtMembers.length > 0 ? "text-destructive" : "text-primary"}`}
                >
                  {debtMembers.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {debtMembers.length === 0
                    ? "Sin deudas pendientes 🎉"
                    : "de " + membersList.length + " miembros totales"}
                </p>
              </CardContent>
            </Card>
            <Card
              className={`border rounded-3xl ${totalDebt > 0 ? "border-destructive/ bg-destructive/" : "border-primary/ bg-primary/"}`}
            >
              <CardContent className="pt-5 pb-4">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Deuda Total Pendiente
                </div>
                <div
                  className={`text-3xl font-extrabold ${totalDebt > 0 ? "text-destructive" : "text-primary"}`}
                >
                  {fmtARS(totalDebt)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Suma total de todas las deudas activas
                </p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card rounded-3xl">
              <CardContent className="pt-5 pb-4">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Tasa de Cobranza
                </div>
                <div className="text-3xl font-extrabold text-foreground">
                  {membersList.length > 0
                    ? Math.round(
                        ((membersList.length - debtMembers.length) / membersList.length) * 100,
                      )
                    : 100}
                  %
                </div>
                <p className="text-xs text-muted-foreground mt-1">Alumnos al día con sus pagos</p>
              </CardContent>
            </Card>
          </div>

          {/* Debt member list */}
          {debtMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
              <div className="text-4xl">🎉</div>
              <div className="font-bold text-foreground">Sin deudas pendientes</div>
              <p className="text-xs text-muted-foreground max-w-xs">
                Todos los alumnos están al día con sus cuotas. El balance de cuentas corrientes está
                perfecto.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
                Alumnos con Saldo Pendiente ({debtMembers.length})
              </div>
              {debtMembers.map((member) => {
                const ch = debtPayChannel[member.name] ?? "cash";
                return (
                  <Card
                    key={member.name}
                    className="border-destructive/ bg-destructive/[0.02] rounded-3xl"
                  >
                    <CardContent className="p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="w-12 h-12 rounded-2xl border border-border shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-foreground">{member.name}</span>
                            <Badge
                              variant="outline"
                              className="text-[9px] border-destructive text-destructive bg-destructive/ font-extrabold"
                            >
                              {member.status === "vencido"
                                ? "❌ Membresía Vencida"
                                : "⏳ Pago Pendiente"}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {member.plan} · {member.email} · {member.phone}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Vencimiento: {member.end}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 flex-wrap">
                          <div className="text-right">
                            <div className="text-[10px] text-muted-foreground uppercase font-bold">
                              Deuda
                            </div>
                            <div className="text-xl font-extrabold text-destructive">
                              {fmtARS(member.debtAmount)}
                            </div>
                          </div>
                          <select
                            value={ch}
                            onChange={(e) =>
                              setDebtPayChannel((prev) => ({
                                ...prev,
                                [member.name]: e.target.value as any,
                              }))
                            }
                            className="h-8 rounded-xl border border-border bg-background px-2 text-xs font-semibold focus-visible:outline-none"
                          >
                            <option value="cash">💵 Efectivo</option>
                            <option value="transfer">🏦 Transferencia</option>
                            <option value="app">📱 App</option>
                          </select>
                          <Button
                            onClick={() =>
                              handleRegisterDebtPayment(member.name, member.debtAmount, ch)
                            }
                            className="h-8 px-3 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Registrar Pago
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
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
  const [reviewCategory, setReviewCategory] = useState<"classes" | "facilities">("classes");
  const [filterActivity, setFilterActivity] = useState("all");
  const [filterCoach, setFilterCoach] = useState("all");
  const [filterRating, setFilterRating] = useState("all");
  const [filterReported, setFilterReported] = useState("all");
  const [filterVerification, setFilterVerification] = useState("all");
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  // Sample data for General Gym/Facility Reviews (from app.tsx modal)
  const [facilityReviews, setFacilityReviews] = useState<GymFacilityReview[]>([
    {
      id: "fac-1",
      date: "2026-07-01",
      studentName: "Agustín Gómez",
      studentPhoto:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80",
      ratingCleanliness: 5,
      ratingEquipment: 4,
      ratingStaff: 5,
      ratingPrice: 4,
      overallRating: 4.5,
      comment:
        "Instalaciones impecables, los vestuarios siempre están ordenados y limpios. Muy buena atención en la entrada.",
      reply: "",
    },
    {
      id: "fac-2",
      date: "2026-06-28",
      studentName: "Camila Díaz",
      studentPhoto:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80",
      ratingCleanliness: 3,
      ratingEquipment: 5,
      ratingStaff: 4,
      ratingPrice: 3,
      overallRating: 3.8,
      comment:
        "Las máquinas de musculación son de primera calidad. Le bajaría un punto a la ventilación en hora pico.",
      reply:
        "Hola Cami! Tomamos nota. Estamos instalando 2 nuevos extractores de aire en la sala principal esta semana.",
    },
  ]);

  const activitiesList = useMemo(() => {
    return Array.from(new Set(reviewsList.map((r) => r.className))).sort();
  }, [reviewsList]);

  const coachesList = useMemo(() => {
    return Array.from(new Set(reviewsList.map((r) => r.coachName))).sort();
  }, [reviewsList]);

  // Combined metrics for Class reviews
  const classAvgRating = useMemo(() => {
    if (reviewsList.length === 0) return "0.0";
    const total = reviewsList.reduce((acc, r) => acc + r.rating, 0);
    return (total / reviewsList.length).toFixed(1);
  }, [reviewsList]);

  // Combined metrics for Facility reviews
  const facilityAvgRating = useMemo(() => {
    if (facilityReviews.length === 0) return "0.0";
    const total = facilityReviews.reduce((acc, r) => acc + r.overallRating, 0);
    return (total / facilityReviews.length).toFixed(1);
  }, [facilityReviews]);

  const currentAvg = reviewCategory === "classes" ? classAvgRating : facilityAvgRating;
  const currentTotal = reviewCategory === "classes" ? reviewsList.length : facilityReviews.length;

  const filteredClassReviews = useMemo(() => {
    return reviewsList.filter((r) => {
      const matchActivity = filterActivity === "all" || r.className === filterActivity;
      const matchCoach = filterCoach === "all" || r.coachName === filterCoach;
      const matchRating = filterRating === "all" || r.rating.toString() === filterRating;
      const matchReported =
        filterReported === "all" ||
        (filterReported === "reported" && r.reported) ||
        (filterReported === "normal" && !r.reported);
      const matchVerification =
        filterVerification === "all" ||
        (filterVerification === "app_payment" && r.verificationType === "app_payment") ||
        (filterVerification === "attendance" && r.verificationType === "attendance");
      return matchActivity && matchCoach && matchRating && matchReported && matchVerification;
    });
  }, [reviewsList, filterActivity, filterCoach, filterRating, filterReported, filterVerification]);

  const filteredFacilityReviews = useMemo(() => {
    return facilityReviews.filter((r) => {
      const matchRating =
        filterRating === "all" || Math.round(r.overallRating).toString() === filterRating;
      const matchReported =
        filterReported === "all" ||
        (filterReported === "reported" && r.reported) ||
        (filterReported === "normal" && !r.reported);
      return matchRating && matchReported;
    });
  }, [facilityReviews, filterRating, filterReported]);

  const handleToggleFeatured = (id: string) => {
    setReviewsList((prev) => prev.map((r) => (r.id === id ? { ...r, featured: !r.featured } : r)));
  };

  const handleSendClassReply = (id: string) => {
    const text = replyTexts[id];
    if (!text?.trim()) return;
    setReviewsList((prev) => prev.map((r) => (r.id === id ? { ...r, reply: text.trim() } : r)));
    setReplyTexts((prev) => ({ ...prev, [id]: "" }));
    setActiveReplyId(null);
  };

  const handleSendFacilityReply = (id: string) => {
    const text = replyTexts[id];
    if (!text?.trim()) return;
    setFacilityReviews((prev) => prev.map((r) => (r.id === id ? { ...r, reply: text.trim() } : r)));
    setReplyTexts((prev) => ({ ...prev, [id]: "" }));
    setActiveReplyId(null);
  };

  const handleReportClassReview = (id: string) => {
    const reason = prompt(
      "Describe el motivo del reporte (ej: Spam, Insulto, Usuario falso, Información errónea):",
    );
    if (!reason?.trim()) return;
    setReviewsList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, reported: true, reportReason: reason.trim() } : r)),
    );
    alert(
      "Reseña reportada correctamente a la moderación central. Permanecerá visible con etiqueta de investigación.",
    );
  };

  const handleReportFacilityReview = (id: string) => {
    const reason = prompt(
      "Describe el motivo del reporte (ej: Spam, Insulto, Usuario falso, Información errónea):",
    );
    if (!reason?.trim()) return;
    setFacilityReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, reported: true, reportReason: reason.trim() } : r)),
    );
    alert("Reseña reportada correctamente a la moderación central.");
  };

  const isAnyFilterActive =
    filterActivity !== "all" ||
    filterCoach !== "all" ||
    filterRating !== "all" ||
    filterReported !== "all" ||
    filterVerification !== "all";

  const clearAllFilters = () => {
    setFilterActivity("all");
    setFilterCoach("all");
    setFilterRating("all");
    setFilterReported("all");
    setFilterVerification("all");
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 text-foreground">
      {/* Header Banner - Google Standard Policy */}
      <div className="flex items-start gap-3 p-4 bg-secondary/ border border-border/ rounded-3xl text-xs">
        <ShieldAlert className="w-5 h-5 text-secondary-foreground shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-secondary-foreground dark:text-secondary-foreground">
            Política Transparente Estilo Google
          </div>
          <p className="text-muted-foreground font-medium">
            Las reseñas no se pueden borrar ni alterar por la administración del gimnasio para
            preservar la veracidad del servicio. Todas las opiniones cuentan en el promedio general.
            Si identificas contenido falso o inapropiado, utiliza el botón de{" "}
            <strong>Reportar Infracción</strong>.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Gestión de Reseñas</h2>
          <p className="text-sm text-muted-foreground">
            Monitorea la experiencia del alumno y responde públicamente.
          </p>
        </div>

        {/* Category Toggle Controls */}
        <div className="inline-flex p-1 bg-secondary/30 border border-border/80 rounded-2xl">
          <button
            onClick={() => setReviewCategory("classes")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              reviewCategory === "classes"
                ? "bg-background border border-border text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            💪 Clases & Coaches ({reviewsList.length})
          </button>
          <button
            onClick={() => setReviewCategory("facilities")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              reviewCategory === "facilities"
                ? "bg-background border border-border text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🏢 Gimnasio & Instalaciones ({facilityReviews.length})
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-border bg-card flex flex-col justify-between rounded-xl overflow-hidden p-6">
          <div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Promedio Transparente
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-extrabold">{currentAvg}</span>
              <span className="text-xs text-muted-foreground">de 5.0 estrellas</span>
            </div>
            <div className="flex items-center gap-0.5 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${star <= Math.round(Number(currentAvg)) ? "text-secondary-foreground fill-amber-500" : "text-border"}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="border border-border bg-card flex flex-col justify-between rounded-xl overflow-hidden p-6">
          <div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Total de Opiniones
            </div>
            <div className="text-4xl font-extrabold mt-2">{currentTotal}</div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">
              {reviewCategory === "classes"
                ? "Valoraciones registradas tras finalizar cada clase."
                : "Evaluaciones de limpieza, equipamiento y atención."}
            </p>
          </div>
        </div>

        <div className="border border-border bg-card flex flex-col justify-between rounded-xl overflow-hidden p-6">
          <div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Garantía de Veracidad
            </div>
            <div className="flex items-center gap-2 mt-2 text-primary dark:text-primary font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" /> 100% Opiniones Verificadas
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">
              Solo los alumnos que asistieron al gimnasio pueden emitir valoraciones.
            </p>
          </div>
        </div>
      </div>

      {/* ClassPass-Style Multi-Dimensional Filter Controls */}
      <div className="p-4 bg-secondary/20 border border-border rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-foreground uppercase tracking-wider">
            Filtros Avanzados (Estilo ClassPass):
          </span>
          {isAnyFilterActive && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-bold text-destructive hover:text-destructive hover:underline"
            >
              Limpiar todos los filtros
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Filter 1: Activity / Discipline */}
          {reviewCategory === "classes" && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                Actividad / Disciplina
              </label>
              <select
                value={filterActivity}
                onChange={(e) => setFilterActivity(e.target.value)}
                className="flex h-9 w-full rounded-xl border border-border bg-background px-3 py-1 text-xs focus-visible:outline-none text-foreground font-semibold"
              >
                <option value="all">Todas las actividades</option>
                {activitiesList.map((act) => (
                  <option key={act} value={act}>
                    {act}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Filter 2: Coach / Staff */}
          {reviewCategory === "classes" && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                Profesor / Coach
              </label>
              <select
                value={filterCoach}
                onChange={(e) => setFilterCoach(e.target.value)}
                className="flex h-9 w-full rounded-xl border border-border bg-background px-3 py-1 text-xs focus-visible:outline-none text-foreground font-semibold"
              >
                <option value="all">Todos los profesores</option>
                {coachesList.map((coach) => (
                  <option key={coach} value={coach}>
                    {coach}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Filter 3: Rating */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
              Puntuación
            </label>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="flex h-9 w-full rounded-xl border border-border bg-background px-3 py-1 text-xs focus-visible:outline-none text-foreground font-semibold"
            >
              <option value="all">Todas las calificaciones</option>
              <option value="5">⭐⭐⭐⭐⭐ (5 estrellas)</option>
              <option value="4">⭐⭐⭐⭐ (4 estrellas)</option>
              <option value="3">⭐⭐⭐ (3 estrellas)</option>
              <option value="2">⭐⭐ (2 estrellas)</option>
              <option value="1">⭐ (1 estrella)</option>
            </select>
          </div>

          {/* Filter 4: Verification & Moderation */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
              Verificación & Moderación
            </label>
            <select
              value={
                filterVerification !== "all"
                  ? filterVerification
                  : filterReported !== "all"
                    ? filterReported
                    : "all"
              }
              onChange={(e) => {
                const val = e.target.value;
                if (val === "reported" || val === "normal") {
                  setFilterReported(val);
                  setFilterVerification("all");
                } else if (val === "app_payment" || val === "attendance") {
                  setFilterVerification(val);
                  setFilterReported("all");
                } else {
                  setFilterReported("all");
                  setFilterVerification("all");
                }
              }}
              className="flex h-9 w-full rounded-xl border border-border bg-background px-3 py-1 text-xs focus-visible:outline-none text-foreground font-semibold"
            >
              <option value="all">Todos los estados</option>
              <option value="app_payment">🛡️ Pago Verificado en App</option>
              <option value="attendance">📍 Asistencia Verificada</option>
              <option value="reported">🚩 Reportadas a revisión</option>
            </select>
          </div>
        </div>
      </div>

      {/* List of Class Reviews */}
      {reviewCategory === "classes" && (
        <div className="overflow-x-auto border border-border rounded-xl">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-muted font-bold text-muted-foreground border-b border-border">
              <tr>
                <th className="p-3">Alumno</th>
                <th className="p-3">Clase & Coach</th>
                <th className="p-3">Calificación</th>
                <th className="p-3 w-1/3">Comentario</th>
                <th className="p-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredClassReviews.map((rev) => (
                <tr
                  key={rev.id}
                  className={`hover:bg-muted/30 transition-colors ${rev.reported ? "bg-secondary/[0.03]" : rev.featured ? "bg-secondary-foreground/5" : ""}`}
                >
                  <td className="p-3 align-top">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.studentPhoto}
                        alt={rev.studentName}
                        className="w-8 h-8 rounded-full border border-border shrink-0"
                      />
                      <div>
                        <div className="font-bold text-foreground">{rev.studentName}</div>
                        <div className="text-[10px] text-muted-foreground">{rev.date}</div>
                        {rev.verificationType === "app_payment" && (
                          <div className="text-[9px] text-secondary-foreground font-bold mt-0.5">
                            🛡️ Verificado App
                          </div>
                        )}
                        {rev.verificationType === "attendance" && (
                          <div className="text-[9px] text-primary font-bold mt-0.5">
                            📍 Asistencia
                          </div>
                        )}
                        {rev.reported && (
                          <div className="text-[9px] text-secondary-foreground font-bold mt-0.5">
                            🚩 Reportada: {rev.reportReason}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-3 align-top">
                    <div className="font-bold">{rev.className}</div>
                    <div className="text-[10px] text-muted-foreground">{rev.coachName}</div>
                  </td>
                  <td className="p-3 align-top">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${star <= rev.rating ? "text-secondary-foreground fill-amber-500" : "text-border"}`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="p-3 align-top space-y-2">
                    <p className="font-medium text-foreground">"{rev.comment}"</p>

                    {/* Public Response Block */}
                    {rev.reply ? (
                      <div className="p-2 rounded-lg bg-secondary/35 border border-border/80 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-primary mb-1">
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Respuesta oficial:</span>
                        </div>
                        <p className="text-muted-foreground">{rev.reply}</p>
                        <button
                          onClick={() => {
                            setReplyTexts((prev) => ({ ...prev, [rev.id]: rev.reply }));
                            setActiveReplyId(rev.id);
                          }}
                          className="text-[10px] text-primary hover:underline font-bold mt-1"
                        >
                          Editar Respuesta
                        </button>
                      </div>
                    ) : (
                      activeReplyId !== rev.id && (
                        <button
                          onClick={() => setActiveReplyId(rev.id)}
                          className="text-[10px] text-primary hover:underline font-bold flex items-center gap-1"
                        >
                          <MessageCircle className="w-3 h-3" /> Responder
                        </button>
                      )
                    )}

                    {activeReplyId === rev.id && (
                      <div className="space-y-2 animate-fade-in mt-2">
                        <textarea
                          rows={2}
                          value={replyTexts[rev.id] || ""}
                          onChange={(e) =>
                            setReplyTexts((prev) => ({ ...prev, [rev.id]: e.target.value }))
                          }
                          placeholder="Escribe la respuesta..."
                          className="flex w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus-visible:outline-none"
                        />
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 text-[10px]"
                            onClick={() => {
                              setActiveReplyId(null);
                              setReplyTexts((prev) => ({ ...prev, [rev.id]: "" }));
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button
                            size="sm"
                            className="h-6 text-[10px]"
                            onClick={() => handleSendClassReply(rev.id)}
                          >
                            Publicar
                          </Button>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="p-3 align-top text-right space-y-2">
                    <button
                      onClick={() => handleReportClassReview(rev.id)}
                      className="text-[10px] font-bold text-muted-foreground hover:text-secondary-foreground flex items-center justify-end gap-1 w-full"
                    >
                      <Flag className="w-3.5 h-3.5" /> Reportar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredClassReviews.length === 0 && (
            <div className="text-center p-8 text-muted-foreground italic font-medium text-xs">
              No se encontraron opiniones de clases con los filtros seleccionados.
            </div>
          )}
        </div>
      )}

      {/* List of Facility/Gym Reviews */}
      {reviewCategory === "facilities" && (
        <div className="overflow-x-auto border border-border rounded-xl">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-muted font-bold text-muted-foreground border-b border-border">
              <tr>
                <th className="p-3">Alumno</th>
                <th className="p-3">Métricas (Limpieza, Equip., Staff, Precio)</th>
                <th className="p-3">General</th>
                <th className="p-3 w-1/3">Comentario</th>
                <th className="p-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredFacilityReviews.map((fac) => (
                <tr
                  key={fac.id}
                  className={`hover:bg-muted/30 transition-colors ${fac.reported ? "bg-secondary/[0.03]" : ""}`}
                >
                  <td className="p-3 align-top">
                    <div className="flex items-center gap-3">
                      <img
                        src={fac.studentPhoto}
                        alt={fac.studentName}
                        className="w-8 h-8 rounded-full border border-border shrink-0"
                      />
                      <div>
                        <div className="font-bold text-foreground">{fac.studentName}</div>
                        <div className="text-[10px] text-muted-foreground">{fac.date}</div>
                        {fac.reported && (
                          <div className="text-[9px] text-secondary-foreground font-bold mt-0.5">
                            🚩 Reportada: {fac.reportReason}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-3 align-top">
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px]">
                      <div>
                        <span className="text-muted-foreground">Limpieza:</span>{" "}
                        <b>{fac.ratingCleanliness}/5</b>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Equip.:</span>{" "}
                        <b>{fac.ratingEquipment}/5</b>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Staff:</span>{" "}
                        <b>{fac.ratingStaff}/5</b>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Precio:</span>{" "}
                        <b>{fac.ratingPrice}/5</b>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 align-top">
                    <div className="flex items-center gap-1 font-extrabold text-sm">
                      <Star className="w-3.5 h-3.5 text-secondary-foreground fill-amber-500" />
                      {fac.overallRating.toFixed(1)}
                    </div>
                  </td>
                  <td className="p-3 align-top space-y-2">
                    <p className="font-medium text-foreground">"{fac.comment}"</p>

                    {/* Response Block */}
                    {fac.reply ? (
                      <div className="p-2 rounded-lg bg-secondary/35 border border-border/80 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-primary mb-1">
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Respuesta oficial:</span>
                        </div>
                        <p className="text-muted-foreground">{fac.reply}</p>
                        <button
                          onClick={() => {
                            setReplyTexts((prev) => ({ ...prev, [fac.id]: fac.reply }));
                            setActiveReplyId(fac.id);
                          }}
                          className="text-[10px] text-primary hover:underline font-bold mt-1"
                        >
                          Editar Respuesta
                        </button>
                      </div>
                    ) : (
                      activeReplyId !== fac.id && (
                        <button
                          onClick={() => setActiveReplyId(fac.id)}
                          className="text-[10px] text-primary hover:underline font-bold flex items-center gap-1"
                        >
                          <MessageCircle className="w-3 h-3" /> Responder
                        </button>
                      )
                    )}

                    {activeReplyId === fac.id && (
                      <div className="space-y-2 animate-fade-in mt-2">
                        <textarea
                          rows={2}
                          value={replyTexts[fac.id] || ""}
                          onChange={(e) =>
                            setReplyTexts((prev) => ({ ...prev, [fac.id]: e.target.value }))
                          }
                          placeholder="Escribe la respuesta..."
                          className="flex w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus-visible:outline-none"
                        />
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 text-[10px]"
                            onClick={() => {
                              setActiveReplyId(null);
                              setReplyTexts((prev) => ({ ...prev, [fac.id]: "" }));
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button
                            size="sm"
                            className="h-6 text-[10px]"
                            onClick={() => handleSendFacilityReply(fac.id)}
                          >
                            Publicar
                          </Button>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="p-3 align-top text-right space-y-2">
                    <button
                      onClick={() => handleReportFacilityReview(fac.id)}
                      className="text-[10px] font-bold text-muted-foreground hover:text-secondary-foreground flex items-center justify-end gap-1 w-full"
                    >
                      <Flag className="w-3.5 h-3.5" /> Reportar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredFacilityReviews.length === 0 && (
            <div className="text-center p-8 text-muted-foreground italic font-medium text-xs">
              No se encontraron opiniones del gimnasio con los filtros seleccionados.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Subcomponent: Asistencias Tab
function AsistenciasTab({
  selectedBranchId,
  blackoutDays,
}: {
  selectedBranchId: string;
  blackoutDays: { id: string; date: string; reason: string }[];
}) {
  const [historySearch, setHistorySearch] = useState("");

  const recentCheckins = [
    {
      name: "Agustín Gómez",
      time: "11:24 AM",
      alert: "Lesión Rodilla",
      alertColor: "bg-secondary/ text-secondary-foreground border-border/",
      photo:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80",
    },
    {
      name: "Camila Díaz",
      time: "11:15 AM",
      alert: "Pago Pendiente",
      alertColor: "bg-destructive/ text-destructive border-destructive/",
      photo:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80",
    },
    {
      name: "Marcos López",
      time: "10:54 AM",
      alert: null,
      photo:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80",
    },
  ];

  const history = [
    {
      name: "Agustín Gómez",
      date: "Hoy",
      time: "11:24 AM",
      method: "QR Scan",
      class: "CrossFit WOD",
    },
    {
      name: "Camila Díaz",
      date: "Hoy",
      time: "11:15 AM",
      method: "Recepción",
      class: "Musculación Libre",
    },
    {
      name: "Marcos López",
      date: "Hoy",
      time: "10:54 AM",
      method: "QR Scan",
      class: "CrossFit WOD",
    },
    {
      name: "Sofía Martínez",
      date: "Ayer",
      time: "19:10 PM",
      method: "QR Scan",
      class: "Yoga Ashtanga",
    },
  ];

  const handleExport = () => {
    const csvHeader = "Nombre,Fecha,Hora,Metodo,Clase\n";
    const csvRows = history
      .map((h) => `"${h.name}","${h.date}","${h.time}","${h.method}","${h.class}"`)
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
        <div className="p-4 bg-destructive/ border border-destructive/ text-destructive rounded-3xl text-xs font-semibold flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div>
            <div className="font-bold">⚠️ Sede Cerrada por Día de Cierre / Feriado</div>
            <div className="text-[11px] text-destructive/80 mt-0.5">
              Motivo: {activeBlackout.reason}. Los check-ins de hoy están inhabilitados.
            </div>
          </div>
        </div>
      )}
      {/* Live Feed Header */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-border bg-card p-6 flex items-center justify-between col-span-1">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Aforo Actual
            </span>
            <div className="text-4xl font-extrabold tracking-tight mt-2">
              {selectedBranchId === "all" && (
                <>
                  84 <span className="text-lg font-medium text-muted-foreground">/ 170</span>
                </>
              )}
              {selectedBranchId === "matriz" && (
                <>
                  42 <span className="text-lg font-medium text-muted-foreground">/ 80</span>
                </>
              )}
              {selectedBranchId === "1" && (
                <>
                  24 <span className="text-lg font-medium text-muted-foreground">/ 50</span>
                </>
              )}
              {selectedBranchId === "2" && (
                <>
                  18 <span className="text-lg font-medium text-muted-foreground">/ 40</span>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Capacidad segura al{" "}
              {selectedBranchId === "all"
                ? "49%"
                : selectedBranchId === "matriz"
                  ? "52%"
                  : selectedBranchId === "1"
                    ? "48%"
                    : "45%"}
            </p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-primary/ flex items-center justify-center text-primary">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        {/* Live Feed Checklist */}
        <div className="rounded-3xl border border-border bg-card p-6 col-span-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Monitor de Entradas Recientes
          </h3>
          <div className="space-y-4">
            {recentCheckins.map((c, i) => (
              <div
                key={i}
                className="flex items-center justify-between pb-3 border-b border-border/50 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <img src={c.photo} alt={c.name} className="h-9 w-9 rounded-full object-cover" />
                  <div>
                    <div className="text-sm font-semibold">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.time}</div>
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
      </div>

      {/* History table */}
      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Historial General
          </h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar miembro..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="pl-9 pr-4 h-9 w-48 rounded-xl border border-border bg-background text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <Button
              size="sm"
              variant="outline"
              className="rounded-xl gap-1.5"
              onClick={handleExport}
            >
              <Download className="h-3.5 w-3.5" /> Exportar
            </Button>
          </div>
        </div>

        <div className="overflow-hidden border border-border rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted font-bold text-muted-foreground border-b border-border">
              <tr>
                <th className="p-3">Miembro</th>
                <th className="p-3">Fecha</th>
                <th className="p-3">Hora de Entrada</th>
                <th className="p-3">Acceso</th>
                <th className="p-3">Clase</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {history.map((h, i) => (
                <tr key={i} className="hover:bg-secondary/20 transition">
                  <td className="p-3 font-semibold">{h.name}</td>
                  <td className="p-3 text-muted-foreground">{h.date}</td>
                  <td className="p-3 text-foreground font-medium">{h.time}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-secondary border border-border font-medium text-foreground">
                      {h.method}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground">{h.class}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Subcomponent: Miembros Tab
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

    classesList.forEach((c: any) => {
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

      {/* Control de Acceso (Check-in Express) */}
      <Card className=" border-border bg-card/60 backdrop-blur-sm">
        <CardContent className="p-5 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <DoorOpen className="w-4 h-4 text-primary" /> Control de Acceso (Check-in Express)
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Ingresá el DNI o nombre del alumno para validar el ingreso.
              </p>
            </div>
            <form onSubmit={handleCheckIn} className="flex gap-2 w-full sm:w-auto">
              <Input
                placeholder="DNI o Nombre..."
                value={checkInQuery}
                onChange={(e) => setCheckInQuery(e.target.value)}
                className="h-9 w-full sm:w-64 bg-background"
              />
              <Button type="submit" size="sm" className="h-9">
                Validar
              </Button>
            </form>
          </div>

          {checkInResult && (
            <div
              className={`p-4 rounded-xl border flex flex-col sm:flex-row gap-4 items-center justify-between animate-fade-in ${
                checkInResult.status === "allowed"
                  ? "bg-primary/ border-primary/ text-primary dark:text-primary"
                  : checkInResult.status === "conditional"
                    ? "bg-secondary/ border-border/ text-secondary-foreground dark:text-secondary-foreground"
                    : "bg-destructive/ border-destructive/ text-destructive dark:text-destructive"
              }`}
            >
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {checkInResult.success && checkInResult.member && (
                  <img
                    src={checkInResult.member.photo}
                    alt={checkInResult.member.name}
                    className="h-10 w-10 rounded-full object-cover border border-border/40 shrink-0"
                  />
                )}
                <div>
                  <div className="font-bold text-sm">
                    {checkInResult.success && checkInResult.member
                      ? checkInResult.member.name
                      : "Resultado:"}
                  </div>
                  <div className="text-xs mt-0.5 leading-relaxed">{checkInResult.message}</div>
                </div>
              </div>
              {checkInResult.success && (
                <div className="flex gap-2 w-full sm:w-auto justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={() => setCheckInResult(null)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    className={`text-xs ${
                      checkInResult.status === "allowed"
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : checkInResult.status === "conditional"
                          ? "bg-secondary hover:bg-secondary text-white"
                          : "bg-destructive hover:bg-destructive text-white"
                    }`}
                    onClick={handleConfirmCheckIn}
                  >
                    Permitir e Ingresar
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

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

                    {/* Expanded accordion: history */}
                    {isOpen && (
                      <tr className="bg-secondary/5 border-b border-border/40">
                        <td colSpan={6} className="p-0">
                          <div className="p-6 space-y-4 animate-fade-in border-t border-border/40">
                            {/* Stats row */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              <div className="bg-card border border-border/50 rounded-xl p-3 text-center">
                                <div className="text-lg font-black text-primary">
                                  {history.attended.length}
                                </div>
                                <div className="text-[10px] text-muted-foreground font-semibold">
                                  Clases asistidas
                                </div>
                              </div>
                              <div className="bg-card border border-border/50 rounded-xl p-3 text-center">
                                <div className="text-lg font-black text-primary">
                                  {history.enrolled.length}
                                </div>
                                <div className="text-[10px] text-muted-foreground font-semibold">
                                  Próximas agendadas
                                </div>
                              </div>
                              <div className="bg-card border border-border/50 rounded-xl p-3 text-center">
                                <div
                                  className={`text-lg font-black ${
                                    history.attendanceRate === null
                                      ? "text-muted-foreground"
                                      : history.attendanceRate >= 70
                                        ? "text-primary"
                                        : history.attendanceRate >= 40
                                          ? "text-secondary-foreground"
                                          : "text-destructive"
                                  }`}
                                >
                                  {history.attendanceRate !== null
                                    ? `${history.attendanceRate}%`
                                    : "—"}
                                </div>
                                <div className="text-[10px] text-muted-foreground font-semibold">
                                  Tasa asistencia
                                </div>
                              </div>
                              <div className="bg-card border border-border/50 rounded-xl p-3 text-center">
                                <div className="text-[11px] font-bold text-foreground leading-tight">
                                  {history.lastClass ? `${history.lastClass.day}` : "—"}
                                </div>
                                <div className="text-[10px] text-muted-foreground font-semibold">
                                  Última clase
                                </div>
                              </div>
                            </div>

                            {/* Churn alert */}
                            {history.isChurnRisk && (
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-destructive/ border border-destructive/ rounded-2xl text-xs text-destructive">
                                <div className="flex items-start gap-2.5">
                                  <span className="text-base shrink-0">⚠️</span>
                                  <div>
                                    <div className="font-bold">Riesgo de Baja Detectado</div>
                                    <div className="text-[11px] text-destructive/80 mt-0.5">
                                      Este alumno no tiene clases asistidas recientes registradas.
                                      Considerá contactarlo para retenerlo.
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold gap-1 text-[11px] h-8 shrink-0"
                                  onClick={() => {
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
                                  <span>Enviar Rescate WhatsApp</span>
                                </Button>
                              </div>
                            )}

                            {/* Two-Column Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                              {/* Col 1: Ficha Médica y Pagos */}
                              <div className="space-y-4">
                                <div className="bg-card border border-border/50 rounded-xl p-4 space-y-3">
                                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                    Ficha Médica & Salud
                                  </h4>
                                  <div className="space-y-2 text-xs">
                                    <div>
                                      <span className="font-bold text-muted-foreground">
                                        Obra Social / Prepaga:{" "}
                                      </span>
                                      <span className="text-foreground font-medium">
                                        {m.medicalInsurance || "No declarada"}
                                      </span>
                                      {m.affiliateNumber && (
                                        <span className="text-muted-foreground">
                                          {" "}
                                          (Nro: {m.affiliateNumber})
                                        </span>
                                      )}
                                    </div>
                                    <div>
                                      <span className="font-bold text-muted-foreground">
                                        Contacto de Emergencia:{" "}
                                      </span>
                                      <span className="text-foreground font-medium">
                                        {m.emergencyContactName || "No especificado"}
                                      </span>
                                      {m.emergencyContactPhone && (
                                        <span className="text-muted-foreground">
                                          {" "}
                                          ({m.emergencyContactPhone})
                                        </span>
                                      )}
                                    </div>
                                    <div className="border-t border-border/30 pt-2 flex flex-col gap-1.5">
                                      <div>
                                        <span className="font-bold text-muted-foreground">
                                          Certificado Apto Médico:{" "}
                                        </span>
                                        <span
                                          className={`font-semibold ${m.hasApto === "Entregado" ? "text-primary" : m.hasApto === "Vencido" ? "text-destructive" : "text-secondary-foreground"}`}
                                        >
                                          {m.hasApto === "Entregado"
                                            ? `Entregado (Vence: ${m.aptoExp})`
                                            : m.hasApto === "Vencido"
                                              ? "Vencido"
                                              : "Pendiente"}
                                        </span>
                                      </div>
                                      {m.aptoDocUrl && (
                                        <div>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-7 text-[10px] rounded-lg gap-1"
                                            onClick={() => {
                                              const win = window.open();
                                              win?.document.write(
                                                `<iframe src="${m.aptoDocUrl}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`,
                                              );
                                            }}
                                          >
                                            <Eye className="w-3 h-3" /> Ver Certificado Cargado
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                    {m.medicalNotes && (
                                      <div className="border-t border-border/30 pt-2 space-y-1">
                                        <span className="font-bold text-muted-foreground block">
                                          Observaciones Médicas / Lesiones:
                                        </span>
                                        <p className="text-destructive dark:text-destructive font-medium leading-relaxed bg-destructive/ p-2 rounded-lg border border-destructive/">
                                          {m.medicalNotes}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="bg-card border border-border/50 rounded-xl p-4 space-y-3">
                                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                    Historial de Pagos
                                  </h4>
                                  {m.payments && m.payments.length > 0 ? (
                                    <div className="overflow-x-auto rounded-lg border border-border/30">
                                      <table className="w-full text-left text-[11px]">
                                        <thead>
                                          <tr className="bg-secondary/30 border-b border-border/40 text-muted-foreground font-bold">
                                            <th className="p-2">Fecha</th>
                                            <th className="p-2">Plan</th>
                                            <th className="p-2">Monto</th>
                                            <th className="p-2">Método</th>
                                            <th className="p-2 text-right">Recibo</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border/30">
                                          {m.payments.map((p: any) => (
                                            <tr key={p.id} className="hover:bg-secondary/20">
                                              <td className="p-2 text-muted-foreground">
                                                {p.date}
                                              </td>
                                              <td className="p-2 font-medium text-foreground">
                                                {p.duration}
                                              </td>
                                              <td className="p-2 font-bold text-primary">
                                                ${p.amount}
                                              </td>
                                              <td className="p-2 text-muted-foreground">
                                                {p.method}
                                              </td>
                                              <td className="p-2 text-right">
                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  className="h-6 w-6 text-primary hover:bg-primary/10 rounded-md"
                                                  onClick={() =>
                                                    setViewingReceipt({ member: m, payment: p })
                                                  }
                                                >
                                                  <FileText className="w-3 h-3" />
                                                </Button>
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  ) : (
                                    <p className="text-[11px] text-muted-foreground text-center py-2">
                                      Sin registros de pago en este periodo.
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Col 2: Clases e Historial */}
                              <div className="space-y-4">
                                {history.attended.length > 0 && (
                                  <div className="space-y-1.5">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                                      Historial de Clases Asistidas
                                    </span>
                                    <div className="overflow-x-auto rounded-xl border border-border/40">
                                      <table className="w-full text-left text-[11px] min-w-[320px]">
                                        <thead>
                                          <tr className="bg-secondary/30 border-b border-border/40 text-muted-foreground font-bold">
                                            <th className="p-2.5">Clase</th>
                                            <th className="p-2.5">Día</th>
                                            <th className="p-2.5">Horario</th>
                                            <th className="p-2.5 text-center">Calificación dada</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border/30">
                                          {history.attended.map((h, i) => (
                                            <tr key={i} className="hover:bg-secondary/20">
                                              <td className="p-2.5 font-semibold text-foreground">
                                                {h.className}
                                              </td>
                                              <td className="p-2.5 text-muted-foreground">
                                                {h.day}
                                              </td>
                                              <td className="p-2.5 text-muted-foreground">
                                                {h.time}
                                              </td>
                                              <td className="p-2.5 text-center">
                                                {h.rating ? (
                                                  <span className="inline-flex items-center gap-1 text-secondary-foreground font-bold">
                                                    {Array(5)
                                                      .fill(0)
                                                      .map((_, si) => (
                                                        <span
                                                          key={si}
                                                          className={
                                                            si < h.rating!.stars ? "" : "opacity-20"
                                                          }
                                                        >
                                                          ★
                                                        </span>
                                                      ))}
                                                  </span>
                                                ) : (
                                                  <span className="text-muted-foreground/50 text-[10px]">
                                                    Sin calificar
                                                  </span>
                                                )}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                )}

                                {history.attended.length === 0 && (
                                  <p className="text-[11px] text-muted-foreground text-center py-3">
                                    Sin clases asistidas registradas en el sistema actual.
                                  </p>
                                )}

                                {/* Upcoming classes */}
                                {history.enrolled.length > 0 && (
                                  <div className="space-y-1.5">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                                      Próximas Clases Agendadas
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                      {history.enrolled.map((e, i) => (
                                        <span
                                          key={i}
                                          className="text-[10px] bg-primary/10 text-primary font-semibold px-2.5 py-1 rounded-xl border border-primary/20"
                                        >
                                          {e.className} · {e.day} {e.time}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
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
  "Karate-Do",
  "Fisioterapia y Kinesiología",
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
  const [isMultisede, setIsMultisede] = useState(false);
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
  const [editIsMultisede, setEditIsMultisede] = useState(false);
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
      isMultisede: isMultisede,
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
    setIsMultisede(false);
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
    setEditIsMultisede(!!m.isMultisede);
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
            isMultisede: editIsMultisede,
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
          className="rounded-xl gap-1.5"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus className="h-4 w-4" /> {showAddForm ? "Cancelar" : "Nuevo Plan"}
        </Button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAddMembership}
          className="rounded-3xl border border-border bg-card p-6 max-w-xl space-y-4 animate-fade-up"
        >
          <h3 className="text-sm font-bold text-muted-foreground uppercase">Agregar Nuevo Plan</h3>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5 sm:col-span-1">
              <label className="text-xs font-semibold text-muted-foreground">Nombre del Plan</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
                placeholder="Pase Libre"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Precio ($)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
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
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
                placeholder="Opcional"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground block">
                Periodicidad del Cobro
              </label>
              <select
                value={periodicity}
                onChange={(e) => setPeriodicity(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
              >
                <option value="Semanal">Semanal</option>
                <option value="Mensual">Mensual</option>
                <option value="Trimestral">Trimestral</option>
                <option value="Semestral">Semestral</option>
                <option value="Anual">Anual</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground block">
                Etiqueta/Categoría del Plan
              </label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
              >
                <option value="Pase Libre">Pase Libre</option>
                <option value="Planes Premium">Planes Premium</option>
                <option value="Solo Clases">Solo Clases</option>
              </select>
            </div>
          </div>

          {/* Pass Type & Credits configuration */}
          <div className="grid gap-4 sm:grid-cols-2 border-t border-border/40 pt-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground block">
                Tipo de Acceso
              </label>
              <select
                value={passType}
                onChange={(e) => setPassType(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
              >
                <option value="Pase Libre">Pase Libre (Acceso ilimitado)</option>
                <option value="Por Créditos">Por Créditos (Límite de clases)</option>
              </select>
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
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
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
              <select
                value={accessHoursType}
                onChange={(e) => setAccessHoursType(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
              >
                <option value="Todo Horario">Todo Horario (Full Access)</option>
                <option value="Off-Peak">Off-Peak (Franja horaria especial)</option>
              </select>
            </div>
            {accessHoursType === "Off-Peak" && (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-muted-foreground">Desde</label>
                  <input
                    type="text"
                    value={offPeakStart}
                    onChange={(e) => setOffPeakStart(e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus-visible:outline-none"
                    placeholder="12:00"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-muted-foreground">Hasta</label>
                  <input
                    type="text"
                    value={offPeakEnd}
                    onChange={(e) => setOffPeakEnd(e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus-visible:outline-none"
                    placeholder="16:00"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Advanced business settings */}
          <div className="grid gap-4 sm:grid-cols-2 border-t border-border/40 pt-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground block">
                Costo de Matrícula ($)
              </label>
              <input
                type="number"
                value={registrationFee}
                onChange={(e) => setRegistrationFee(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
                placeholder="0 = Sin matrícula"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground block">
                Días de Congelamiento por Año
              </label>
              <input
                type="number"
                value={freezeDays}
                onChange={(e) => setFreezeDays(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
                placeholder="Ej: 15 días"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 border-t border-border/40 pt-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground block">
                Límite Diario de Reservas
              </label>
              <select
                value={dailyClassLimit}
                onChange={(e) => setDailyClassLimit(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
              >
                <option value="Ilimitado">Ilimitado</option>
                <option value="1 clase por día">1 clase por día</option>
                <option value="2 clases por día">2 clases por día</option>
              </select>
            </div>
            <div className="space-y-1.5 flex flex-col justify-end">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-2 cursor-pointer pb-2.5">
                <input
                  type="checkbox"
                  checked={isMultisede}
                  onChange={(e) => setIsMultisede(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary h-4 w-4 bg-background"
                />
                <span>Acceso Multisede (Habilitar en otras sedes)</span>
              </label>
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
              className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
              placeholder="Buscar actividades a restringir/incluir..."
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
                    className="w-full text-left px-3 py-2 text-xs hover:bg-secondary rounded-lg transition"
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
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                      selectedServices.includes(a.id)
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-background border-border text-muted-foreground hover:border-foreground/20"
                    }`}
                  >
                    {a.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" className="rounded-xl">
            Crear Plan
          </Button>
        </form>
      )}

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
                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <span>🏢</span>
                  <span>
                    {m.isMultisede
                      ? "Acceso Multisede (Toda la red)"
                      : "Solo Sede Matriz (Palermo)"}
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

      {/* Edit Membership Modal */}
      {editingPlan && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-fade-in text-foreground">
          <form
            onSubmit={handleSaveEditMembership}
            className="relative bg-card border border-border w-full max-w-xl rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={() => setEditingPlan(null)}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-secondary transition"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-base font-bold tracking-tight">Editar Plan de Membresía</h3>

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
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Precio ($)</label>
                <input
                  type="number"
                  required
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
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
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
                  placeholder="Opcional"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground block">
                  Periodicidad del Cobro
                </label>
                <select
                  value={editPeriodicity}
                  onChange={(e) => setEditPeriodicity(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
                >
                  <option value="Semanal">Semanal</option>
                  <option value="Mensual">Mensual</option>
                  <option value="Trimestral">Trimestral</option>
                  <option value="Semestral">Semestral</option>
                  <option value="Anual">Anual</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground block">
                  Etiqueta/Categoría del Plan
                </label>
                <select
                  value={editTag}
                  onChange={(e) => setEditTag(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
                >
                  <option value="Pase Libre">Pase Libre</option>
                  <option value="Planes Premium">Planes Premium</option>
                  <option value="Solo Clases">Solo Clases</option>
                </select>
              </div>
            </div>

            {/* Pass Type & Credits configuration */}
            <div className="grid gap-4 sm:grid-cols-2 border-t border-border/40 pt-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground block">
                  Tipo de Acceso
                </label>
                <select
                  value={editPassType}
                  onChange={(e) => setEditPassType(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
                >
                  <option value="Pase Libre">Pase Libre (Acceso ilimitado)</option>
                  <option value="Por Créditos">Por Créditos (Límite de clases)</option>
                </select>
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
                    className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
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
                <select
                  value={editAccessHoursType}
                  onChange={(e) => setEditAccessHoursType(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
                >
                  <option value="Todo Horario">Todo Horario (Full Access)</option>
                  <option value="Off-Peak">Off-Peak (Franja horaria especial)</option>
                </select>
              </div>
              {editAccessHoursType === "Off-Peak" && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-muted-foreground">Desde</label>
                    <input
                      type="text"
                      value={editOffPeakStart}
                      onChange={(e) => setEditOffPeakStart(e.target.value)}
                      className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus-visible:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-muted-foreground">Hasta</label>
                    <input
                      type="text"
                      value={editOffPeakEnd}
                      onChange={(e) => setEditOffPeakEnd(e.target.value)}
                      className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus-visible:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Advanced business settings */}
            <div className="grid gap-4 sm:grid-cols-2 border-t border-border/40 pt-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground block">
                  Costo de Matrícula ($)
                </label>
                <input
                  type="number"
                  value={editRegistrationFee}
                  onChange={(e) => setEditRegistrationFee(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
                  placeholder="0 = Sin matrícula"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground block">
                  Días de Congelamiento por Año
                </label>
                <input
                  type="number"
                  value={editFreezeDays}
                  onChange={(e) => setEditFreezeDays(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
                  placeholder="Ej: 15 días"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 border-t border-border/40 pt-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground block">
                  Límite Diario de Reservas
                </label>
                <select
                  value={editDailyClassLimit}
                  onChange={(e) => setEditDailyClassLimit(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
                >
                  <option value="Ilimitado">Ilimitado</option>
                  <option value="1 clase por día">1 clase por día</option>
                  <option value="2 clases por día">2 clases por día</option>
                </select>
              </div>
              <div className="space-y-1.5 flex flex-col justify-end">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-2 cursor-pointer pb-2.5">
                  <input
                    type="checkbox"
                    checked={editIsMultisede}
                    onChange={(e) => setEditIsMultisede(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary h-4 w-4 bg-background"
                  />
                  <span>Acceso Multisede (Habilitar en otras sedes)</span>
                </label>
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
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
                placeholder="Buscar actividades a restringir/incluir..."
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
                      className="w-full text-left px-3 py-2 text-xs hover:bg-secondary rounded-lg transition"
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
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                      editSelectedServices.includes(a.id)
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-background border-border text-muted-foreground hover:border-foreground/20"
                    }`}
                  >
                    {a.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <Button type="submit" className="rounded-xl flex-1">
                Guardar Cambios
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl flex-1"
                onClick={() => setEditingPlan(null)}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}

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

// Subcomponent: Clases Tab
interface ClasesTabProps {
  classesList: {
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
  }[];
  setClassesList: React.Dispatch<
    React.SetStateAction<
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
        seekingBackup?: boolean;
      }[]
    >
  >;
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
}: ClasesTabProps) {
  const activeBlackout = blackoutDays.find((b) => b.date === "2026-06-29");
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

  // Recurrence settings
  const [isRecurrent, setIsRecurrent] = useState(false);
  const [recurrentWeeks, setRecurrentWeeks] = useState(4);

  // Advanced Filters
  const [selectedFilterCoachId, setSelectedFilterCoachId] = useState("");
  const [selectedFilterActivity, setSelectedFilterActivity] = useState("");

  // 10x10 Seat Layout state: Array of 100 booleans
  const [currentLayout, setCurrentLayout] = useState<boolean[]>(Array(100).fill(true));
  const capacity = currentLayout.filter(Boolean).length;

  // Layout templates list
  const [layoutTemplates, setLayoutTemplates] = useState<
    { id: string; name: string; layout: boolean[] }[]
  >([
    {
      id: "t1",
      name: "Sala Spinning (15 bicis)",
      layout: Array(100)
        .fill(false)
        .map((_, i) => i < 15),
    },
    {
      id: "t2",
      name: "Sala Pilates (12 reformers)",
      layout: Array(100)
        .fill(false)
        .map((_, i) => i < 12),
    },
    {
      id: "t3",
      name: "Box CrossFit (20 personas)",
      layout: Array(100)
        .fill(false)
        .map((_, i) => i < 20),
    },
  ]);
  const [newTemplateName, setNewTemplateName] = useState("");

  const handleSaveTemplate = () => {
    if (!newTemplateName.trim()) return;
    const newT = {
      id: Math.random().toString(),
      name: newTemplateName,
      layout: [...currentLayout],
    };
    setLayoutTemplates((prev) => [...prev, newT]);
    setNewTemplateName("");
  };

  useEffect(() => {
    setClassBranchId(selectedBranchId === "all" ? "matriz" : selectedBranchId);
    setSalaId("");
  }, [selectedBranchId]);

  const activeFormBranchId = selectedBranchId === "all" ? classBranchId : selectedBranchId;

  const availableSalas = useMemo(() => {
    return salasList.filter((s) => s.branchId === activeFormBranchId);
  }, [salasList, activeFormBranchId]);

  const activeBranchRooms = useMemo(() => {
    return salasList.filter((s) => s.branchId === activeFormBranchId);
  }, [salasList, activeFormBranchId]);

  const availabilityWarning = useMemo(() => {
    if (!staffId || !time) return null;
    const coach = staffList.find((s) => s.id === staffId);
    if (!coach || !coach.availability || coach.availability.length === 0) return null;

    // We check availability for the selected class day of the week
    const weekdayNames = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    const targetDayName = weekdayNames[day];
    const DayAvail = coach.availability.find((a) => a.day === targetDayName);

    if (!DayAvail || !DayAvail.intervals || DayAvail.intervals.length === 0) {
      const activeDays = coach.availability
        .filter((a) => a.intervals && a.intervals.length > 0)
        .map((a) => a.day);
      return `⚠️ Alerta: El instructor no tiene disponibilidad los ${targetDayName}. (Disponibilidad: ${activeDays.length > 0 ? activeDays.join(", ") : "Ningún día asignado"})`;
    }

    try {
      const [classFrom, classTo] = time.split("-").map((t) => t.trim());
      const toMinutes = (h: string) => {
        const [hh, mm] = h.split(":").map(Number);
        return hh * 60 + mm;
      };

      const classStart = toMinutes(classFrom);
      const classEnd = toMinutes(classTo);

      // Check if it fits inside at least one interval
      const fits = DayAvail.intervals.some((interval) => {
        const intervalStart = toMinutes(interval.from);
        const intervalEnd = toMinutes(interval.to);
        return classStart >= intervalStart && classEnd <= intervalEnd;
      });

      if (!fits) {
        const intervalsStr = DayAvail.intervals.map((i) => `${i.from} a ${i.to}`).join(" o ");
        return `⚠️ Alerta: El horario de la clase (${time}) está fuera del rango disponible para el instructor los ${targetDayName} (${intervalsStr}).`;
      }
    } catch (e) {
      // ignore
    }
    return null;
  }, [staffId, time, day, staffList]);

  // Helper to check if two time ranges overlap (HH:MM - HH:MM)
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

  // Memo conflict check
  const conflictWarning = useMemo(() => {
    if (!staffId || !time) return null;
    const conflictingClass = classesList.find((c) => {
      const matchesDay = c.day === day;
      const matchesStaff = c.staffId === staffId;
      const isNotSelf = c.id !== editingClassId;
      return matchesDay && matchesStaff && isNotSelf && isTimeOverlapping(c.time, time);
    });
    if (conflictingClass) {
      return `⚠️ Conflicto: El instructor ya tiene asignada la clase "${conflictingClass.name}" el mismo día en el horario ${conflictingClass.time} hs.`;
    }
    return null;
  }, [staffId, time, day, classesList, editingClassId]);

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !staffId || !time) return;

    if (conflictWarning) {
      alert(conflictWarning);
      return;
    }

    if (editingClassId) {
      setClassesList((prev) =>
        prev.map((c) => {
          if (c.id === editingClassId) {
            return {
              ...c,
              name,
              staffId,
              time,
              capacity: capacity, // computed from active layout cells
              salaId: salaId || undefined,
              day: day,
              creditsCost: parseInt(creditsCost) || 1,
              layout: [...currentLayout],
            };
          }
          return c;
        }),
      );
      setEditingClassId(null);
    } else {
      if (isRecurrent) {
        const generatedClasses = [];
        for (let i = 0; i < recurrentWeeks; i++) {
          generatedClasses.push({
            id: `recurrent-${Math.random()}`,
            name,
            staffId,
            time,
            capacity: capacity,
            booked: 0,
            enrolledSpots: {},
            branchId: activeFormBranchId === "matriz" ? undefined : activeFormBranchId,
            salaId: salaId || undefined,
            day: day,
            creditsCost: parseInt(creditsCost) || 1,
            layout: [...currentLayout],
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
          capacity: capacity, // computed from active layout cells
          booked: 0,
          enrolledSpots: {},
          branchId: activeFormBranchId === "matriz" ? undefined : activeFormBranchId,
          salaId: salaId || undefined,
          day: day,
          creditsCost: parseInt(creditsCost) || 1,
          layout: [...currentLayout],
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
    setCurrentLayout(Array(100).fill(true));
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
      const matchesBranch =
        selectedBranchId === "all" ||
        (selectedBranchId === "matriz" ? !c.branchId : c.branchId === selectedBranchId);
      const matchesWeek = (c.weekOffset || 0) === currentWeekOffset;
      const matchesSala = selectedCalendarSalaId ? c.salaId === selectedCalendarSalaId : true;
      const matchesCoach = !selectedFilterCoachId || c.staffId === selectedFilterCoachId;
      const matchesActivity = !selectedFilterActivity || c.name === selectedFilterActivity;
      return matchesBranch && matchesWeek && matchesSala && matchesCoach && matchesActivity;
    });
  }, [
    classesList,
    selectedBranchId,
    currentWeekOffset,
    selectedCalendarSalaId,
    selectedFilterCoachId,
    selectedFilterActivity,
  ]);

  // List view filters classes just for "Hoy" (Monday/Lunes, index 0)
  const classesForToday = useMemo(() => {
    return filteredClasses.filter((c) => c.day === 0);
  }, [filteredClasses]);

  // Quick stats calculation for Palermo Matriz today
  const stats = useMemo(() => {
    const todayClasses = classesList.filter((c) => {
      const matchesBranch =
        selectedBranchId === "all" ||
        (selectedBranchId === "matriz" ? !c.branchId : c.branchId === selectedBranchId);
      const matchesWeek = (c.weekOffset || 0) === currentWeekOffset;
      return c.day === 0 && matchesBranch && matchesWeek;
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
  }, [classesList, selectedBranchId, currentWeekOffset]);

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
      if (canManageClasses) return name;
      if (isProfilePrivate) return "Usuario Privado";
      if (isStudentPrivate(name)) return "Usuario Privado";
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
        if (
          confirm(
            `¿Confirmas cancelar la reserva de ${displayNameForConfirm}?\n\nAl haber alumnos en la Lista de Espera, el lugar se asignará automáticamente a ${nextStudent} y se reembolsarán los créditos a ${studentName}.`,
          )
        ) {
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
          alert(
            `Reserva cancelada. Lugar asignado a ${nextStudent} desde la lista de espera. Créditos reembolsados a ${studentName}.`,
          );
        }
        return;
      }

      if (isLate) {
        if (
          confirm(
            `⚠️ Cancelación Tardía (menos de ${cancellationPolicyHours} horas de anticipación).\n\n¿Deseas liberar el lugar de ${displayNameForConfirm}? Se ofrecerá como "Disponible para Re-reserva". Si otro alumno lo reserva, se te reembolsarán los créditos. Si no, se perderán.`,
          )
        ) {
          setClassesList((prev) =>
            prev.map((item) => {
              if (item.id === c.id) {
                const copySpots = { ...item.enrolledSpots };
                delete copySpots[index];
                const copyReleased = { ...item.releasedSpots } || {};
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
          alert(`El lugar se ha liberado. Queda en estado "Disponible para Re-reserva".`);
        }
      } else {
        if (
          confirm(
            `¿Deseas cancelar la reserva de ${displayNameForConfirm} en el lugar ${index + 1}?`,
          )
        ) {
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
          alert(
            `Reserva de ${displayNameForConfirm} cancelada. Se ha reembolsado ${c.creditsCost || 1} crédito(s).`,
          );
        }
      }
    };

    const presentStudents = Object.entries(c.enrolledSpots || {})
      .filter(([spotIdx]) => {
        const att = c.attendance?.[parseInt(spotIdx)];
        return att === "presente";
      })
      .map(([, name]) => name);

    const ratingsMap = c.ratings || {};
    const ratingValues = Object.values(ratingsMap);
    const avgRating =
      ratingValues.length > 0
        ? ratingValues.reduce((sum, r) => sum + r.stars, 0) / ratingValues.length
        : null;
    const isCoachView = currentUser.role === "coach";

    return (
      <Dialog open={!!selectedClass} onOpenChange={(open) => !open && setSelectedClass(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border border-border bg-card p-0 gap-0 rounded-3xl">
          {/* Header Card */}
          <div className="p-6 bg-gradient-to-r from-secondary/40 via-secondary/20 to-transparent border-b border-border/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className="text-xs bg-primary/10 text-primary font-bold px-2.5 py-0.5 rounded-full border border-primary/20">
                    {salaName}
                  </span>
                  {c.status === "cancelada" ? (
                    <span className="text-xs bg-destructive/ text-destructive font-bold px-2.5 py-0.5 rounded-full border border-destructive/">
                      ❌ Clase Cancelada
                    </span>
                  ) : c.seekingBackup ? (
                    <span className="text-xs bg-secondary/ text-secondary-foreground font-bold px-2.5 py-0.5 rounded-full border border-border/">
                      🟡 Buscando Suplente
                    </span>
                  ) : (
                    <span className="text-xs bg-primary/ text-primary font-bold px-2.5 py-0.5 rounded-full border border-primary/">
                      🟢 Sesión Activa
                    </span>
                  )}
                  <span className="text-xs bg-secondary border border-border/60 text-foreground font-bold px-2.5 py-0.5 rounded-full">
                    🪙 {c.creditsCost || 1} {c.creditsCost === 1 ? "crédito" : "créditos"}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-foreground tracking-tight">{c.name}</h2>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                  <span>
                    🕒 Horario: <strong className="text-foreground font-bold">{c.time} hs</strong>
                  </span>
                  <span>·</span>
                  <span>
                    👥 Ocupación:{" "}
                    <strong className="text-foreground font-bold">
                      {c.booked} / {c.capacity} cupos
                    </strong>
                  </span>
                </p>
              </div>

              {/* Coach Card */}
              <div className="bg-background/80 backdrop-blur border border-border/60 p-3 rounded-2xl flex items-center gap-3 shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm border border-primary/20 shrink-0">
                  {coach?.name
                    ? coach.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    : "👨‍🏫"}
                </div>
                <div className="text-xs">
                  <span className="text-[10px] text-muted-foreground font-semibold block uppercase">
                    Profesor / Coach
                  </span>
                  <span className="font-bold text-foreground block">
                    {coach?.name || "Sin asignar"}
                  </span>
                  {canManageClasses && (
                    <button
                      type="button"
                      onClick={() => {
                        const newCoachId = prompt(
                          `Sustituir Coach.\nActual: ${coach?.name || "N/A"}\n\nIngresa el ID del nuevo profesor:\n` +
                            staffList.map((s) => `- ID ${s.id}: ${s.name}`).join("\n"),
                        );
                        if (newCoachId && staffList.find((s) => s.id === newCoachId)) {
                          setClassesList((prev) =>
                            prev.map((item) =>
                              item.id === c.id
                                ? { ...item, staffId: newCoachId, seekingBackup: false }
                                : item,
                            ),
                          );
                        } else if (newCoachId) {
                          alert("ID de profesor no encontrado.");
                        }
                      }}
                      className="text-[9.5px] text-primary hover:underline font-bold mt-0.5 block"
                    >
                      🔄 Sustituir Coach
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Body: 2 Columns */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left Column: Seating Map & Admin Actions (5 cols) */}
            <div className="md:col-span-5 space-y-5">
              {/* Alertas */}
              {c.status === "cancelada" && (
                <div className="p-3.5 bg-destructive/ border border-destructive/ text-destructive rounded-2xl text-xs font-semibold flex items-start gap-2.5">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Clase Cancelada por Administración</div>
                    <p className="text-[11px] opacity-80 mt-0.5 leading-relaxed">
                      Se han reembolsado automáticamente los créditos a todos los alumnos agendados.
                    </p>
                  </div>
                </div>
              )}

              {c.waitlist &&
                c.waitlist.length >= 3 &&
                canManageClasses &&
                c.status !== "cancelada" && (
                  <div className="p-3.5 bg-secondary/ border border-border/ text-secondary-foreground rounded-2xl text-xs font-semibold flex items-start gap-2.5">
                    <span className="text-base shrink-0">🔥</span>
                    <div>
                      <div className="font-bold">Alta Demanda Detectada</div>
                      <p className="text-[10px] text-secondary-foreground/80 mt-0.5 leading-relaxed">
                        Hay {c.waitlist.length} alumnos en espera. Considerá abrir un nuevo horario
                        o cambiar a un salón de mayor capacidad.
                      </p>
                    </div>
                  </div>
                )}

              {/* Seating Layout Card */}
              {c.status !== "cancelada" && (
                <div className="bg-secondary/15 border border-border/60 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                      Mapa de Distribución (10x10)
                    </span>
                    <span className="text-[10px] text-muted-foreground font-semibold">
                      Toca un lugar
                    </span>
                  </div>

                  <div className="grid grid-cols-10 gap-1 mx-auto p-2 bg-background rounded-xl border border-border/40 max-w-[320px]">
                    {Array(100)
                      .fill(false)
                      .map((_, index) => {
                        const isActive = c.layout ? c.layout[index] : index < c.capacity;
                        const studentName = c.enrolledSpots ? c.enrolledSpots[index] : null;
                        const isReleasedLate = c.releasedSpots && c.releasedSpots[index];

                        if (!isActive) {
                          return (
                            <div key={index} className="aspect-square w-full bg-transparent" />
                          );
                        }

                        const displayStudentName = studentName
                          ? getDisplayStudentName(studentName)
                          : null;
                        const isStudentPrivateName =
                          studentName &&
                          !canManageClasses &&
                          (isProfilePrivate || isStudentPrivate(studentName));

                        const currentAttendance = c.attendance?.[index] || "pendiente";

                        return (
                          <button
                            key={index}
                            type="button"
                            title={
                              studentName
                                ? `Lugar ${index + 1}: ${displayStudentName} (${currentAttendance.toUpperCase()})`
                                : isReleasedLate
                                  ? `Lugar ${index + 1}: Liberado por ${c.releasedSpots![index].originalStudent}`
                                  : `Lugar ${index + 1} (Disponible)`
                            }
                            onClick={() => {
                              if (studentName) {
                                handleCancelSpot(index, studentName);
                              } else {
                                const nameInput = prompt(
                                  `Ingresa el nombre del alumno para reservar el lugar ${index + 1}:`,
                                );
                                if (nameInput?.trim()) {
                                  const typedName = nameInput.trim();
                                  setClassesList((prev) =>
                                    prev.map((item) => {
                                      if (item.id === c.id) {
                                        const copySpots = {
                                          ...item.enrolledSpots,
                                          [index]: typedName,
                                        };
                                        const copyReleased = { ...item.releasedSpots } || {};

                                        if (copyReleased[index]) {
                                          const original = copyReleased[index].originalStudent;
                                          const cost = copyReleased[index].creditsCost;
                                          delete copyReleased[index];
                                          alert(
                                            `🎉 ¡Lugar re-reservado! Se han reembolsado ${cost} crédito(s) a ${original}.`,
                                          );
                                        }

                                        return {
                                          ...item,
                                          enrolledSpots: copySpots,
                                          releasedSpots: copyReleased,
                                          booked: Object.keys(copySpots).length,
                                        };
                                      }
                                      return item;
                                    }),
                                  );
                                }
                              }
                            }}
                            className={`aspect-square w-full rounded-full text-[8.5px] font-bold transition-all border flex items-center justify-center p-0 overflow-hidden ${
                              studentName
                                ? currentAttendance === "presente"
                                  ? "border-2 border-emerald-500 bg-emerald-50"
                                  : currentAttendance === "ausente"
                                    ? "border-2 border-destructive bg-destructive/5"
                                    : "border-2 border-amber-500 bg-amber-50"
                                : isReleasedLate
                                  ? "bg-secondary/20 border-border/60 text-secondary-foreground animate-pulse hover:bg-secondary hover:text-white"
                                  : "bg-card border-border text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary"
                            }`}
                          >
                            {studentName ? (
                              isStudentPrivateName ? (
                                <div className="w-full h-full flex items-center justify-center bg-muted text-[10px] text-muted-foreground">
                                  🔒
                                </div>
                              ) : (
                                <img
                                  src={getStudentPhoto(studentName)}
                                  alt={studentName}
                                  className="w-full h-full object-cover rounded-full"
                                />
                              )
                            ) : isReleasedLate ? (
                              "🔄"
                            ) : (
                              index + 1
                            )}
                          </button>
                        );
                      })}
                  </div>

                  {/* Legend */}
                  <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-1.5 text-[9.5px] text-muted-foreground pt-1.5 border-t border-border/20">
                    <span className="flex items-center gap-1">
                      <span className="h-2.5 w-2.5 rounded-full bg-card border border-border" />{" "}
                      Libre
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Pendiente
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Presente
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-2.5 w-2.5 rounded-full bg-destructive" /> Ausente
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-2.5 w-2.5 rounded-full bg-secondary" /> Re-reserva
                    </span>
                  </div>

                  {c.booked >= c.capacity && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full text-xs font-bold gap-1 bg-secondary/ border-border/ text-secondary-foreground hover:bg-secondary hover:text-white rounded-xl py-2"
                      onClick={() => {
                        const studentName = prompt(
                          "Ingresa el nombre del alumno para anotarse en la lista de espera:",
                        );
                        if (studentName?.trim()) {
                          const name = studentName.trim();
                          setClassesList((prev) =>
                            prev.map((item) => {
                              if (item.id === c.id) {
                                const currentWaitlist = item.waitlist || [];
                                return { ...item, waitlist: [...currentWaitlist, name] };
                              }
                              return item;
                            }),
                          );
                          alert(`¡Anotado! ${name} se ha sumado a la lista de espera.`);
                        }
                      }}
                    >
                      🕒 Sumar a Lista de Espera ({c.waitlist?.length || 0} en cola)
                    </Button>
                  )}
                </div>
              )}

              {/* Actions Card */}
              {canManageClasses && (
                <div className="bg-secondary/10 border border-border/60 p-4 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                    Acciones de Gestión
                  </span>
                  {c.status === "cancelada" ? (
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl text-xs font-bold text-primary border-primary hover:bg-primary/"
                        onClick={() => {
                          setClassesList((prev) =>
                            prev.map((item) =>
                              item.id === c.id ? { ...item, status: "activa" } : item,
                            ),
                          );
                          alert(`La clase "${c.name}" ha sido reactivada.`);
                        }}
                      >
                        🟢 Reactivar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="rounded-xl text-xs font-bold"
                        onClick={() => {
                          const confirmWord = prompt(
                            `⚠️ Escribe "Eliminar" para confirmar la eliminación permanente de "${c.name}":`,
                          );
                          if (confirmWord?.trim().toLowerCase() === "eliminar") {
                            setClassesList((prev) => prev.filter((item) => item.id !== c.id));
                            setSelectedClass(null);
                          }
                        }}
                      >
                        Eliminar
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl text-xs font-bold border-border hover:bg-secondary"
                          onClick={() => {
                            setName(c.name);
                            setStaffId(c.staffId);
                            const parts = c.time.split("-");
                            setStartTime(parts[0]?.trim() || "08:00");
                            setEndTime(parts[1]?.trim() || "09:00");
                            setCreditsCost((c.creditsCost || 1).toString());
                            setSalaId(c.salaId || "");
                            setDay(c.day);
                            setCurrentLayout(c.layout ? [...c.layout] : Array(100).fill(true));
                            setEditingClassId(c.id);
                            setShowAddForm(true);
                            setSelectedClass(null);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                        >
                          ✏️ Editar Horario / Config
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl text-xs font-bold text-destructive border-destructive hover:bg-destructive/"
                          onClick={() => {
                            if (
                              confirm(
                                `¿Confirmas cancelar la clase "${c.name}"? Se reembolsarán los créditos a todos los alumnos.`,
                              )
                            ) {
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
                            }
                          }}
                        >
                          🚫 Cancelar Clase
                        </Button>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full rounded-xl text-xs font-bold"
                        onClick={() => {
                          const confirmWord = prompt(
                            `⚠️ Escribe "Eliminar" para eliminar permanentemente "${c.name}":`,
                          );
                          if (confirmWord?.trim().toLowerCase() === "eliminar") {
                            setClassesList((prev) => prev.filter((item) => item.id !== c.id));
                            setSelectedClass(null);
                          }
                        }}
                      >
                        Eliminar Permanentemente
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Roster, Attendance & Ratings (7 cols) */}
            <div className="md:col-span-7 space-y-5">
              {/* Roster & Attendance Table */}
              <div className="bg-secondary/15 border border-border/60 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Lista de Reservas y Asistencia ({c.booked})
                  </span>
                  <span className="text-[10px] text-muted-foreground font-semibold">
                    Toca para marcar asistencia
                  </span>
                </div>

                <div className="overflow-x-auto border border-border/40 rounded-xl bg-background max-h-[260px]">
                  <table className="w-full text-left text-xs min-w-[420px] border-collapse">
                    <thead>
                      <tr className="border-b border-border/40 bg-secondary/30 text-muted-foreground font-bold text-[10px] uppercase">
                        <th className="p-2.5">Alumno</th>
                        <th className="p-2.5">Plan</th>
                        <th className="p-2.5 text-center">Asistencia</th>
                        <th className="p-2.5 text-center">Lugar</th>
                        <th className="p-2.5 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {Object.entries(c.enrolledSpots || {}).map(([spotIdxStr, name]) => {
                        const idx = parseInt(spotIdxStr);
                        const displayName = getDisplayStudentName(name);
                        const isPrivate =
                          !canManageClasses && (isProfilePrivate || isStudentPrivate(name));
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
                                const copyAtt = { ...item.attendance } || {};
                                copyAtt[idx] = nextStatus;
                                return { ...item, attendance: copyAtt };
                              }
                              return item;
                            }),
                          );
                        };

                        return (
                          <tr key={idx} className="hover:bg-secondary/20 transition-colors">
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
                            <td className="p-2.5 font-semibold text-foreground/80">
                              {!isPrivate ? (
                                <span className="inline-block bg-primary/10 text-primary text-[9.5px] px-2 py-0.5 rounded font-bold">
                                  {enriched.plan}
                                </span>
                              ) : (
                                "—"
                              )}
                            </td>
                            <td className="p-2.5 text-center">
                              <button
                                type="button"
                                onClick={handleToggleAttendance}
                                className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition whitespace-nowrap ${
                                  currentAttendance === "presente"
                                    ? "bg-primary/ border-primary/ text-primary"
                                    : currentAttendance === "ausente"
                                      ? "bg-destructive/ border-destructive/ text-destructive"
                                      : "bg-secondary border-border text-muted-foreground"
                                }`}
                              >
                                {attendanceIcons[currentAttendance]}{" "}
                                {attendanceLabels[currentAttendance]}
                              </button>
                            </td>
                            <td className="p-2.5 text-center font-bold">
                              <span className="bg-muted px-2 py-0.5 rounded font-bold text-[10px] text-foreground">
                                #{idx + 1}
                              </span>
                            </td>
                            <td className="p-2.5 text-right">
                              {canManageClasses && (
                                <button
                                  type="button"
                                  onClick={() => handleCancelSpot(idx, name)}
                                  className="text-destructive hover:text-destructive font-bold hover:underline text-[11px]"
                                >
                                  Quitar
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                      {Object.keys(c.enrolledSpots || {}).length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
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

              {/* Waitlist Chips */}
              {c.waitlist && c.waitlist.length > 0 && (
                <div className="bg-secondary/ border border-border/ p-4 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-secondary-foreground uppercase tracking-wider block">
                    Lista de Espera ({c.waitlist.length} en cola)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {c.waitlist.map((wName, wIdx) => (
                      <span
                        key={wIdx}
                        className="text-xs bg-secondary/ text-secondary-foreground font-bold px-2.5 py-1 rounded-xl border border-border/"
                      >
                        #{wIdx + 1} {wName}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Ratings & Feedback Card */}
              {presentStudents.length > 0 && (
                <div className="bg-secondary/ border border-border/ p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wide">
                      ⭐ Calificaciones de la Clase ({ratingValues.length}/{presentStudents.length})
                    </span>
                    {avgRating !== null && (
                      <span className="text-xs font-black text-secondary-foreground flex items-center gap-1 bg-secondary/ px-2 py-0.5 rounded-lg border border-border/">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <span
                              key={i}
                              className={
                                i < Math.round(avgRating)
                                  ? "text-secondary-foreground"
                                  : "text-muted-foreground/30"
                              }
                            >
                              ★
                            </span>
                          ))}
                        <span className="text-foreground font-bold ml-0.5">
                          {avgRating.toFixed(1)}
                        </span>
                      </span>
                    )}
                  </div>

                  {/* Existing Ratings List */}
                  {ratingValues.length > 0 ? (
                    <div className="space-y-2">
                      {(isCoachView
                        ? ratingValues
                        : Object.entries(ratingsMap).map(([name, r]) => ({
                            ...r,
                            studentName: name,
                          }))
                      ).map((rating, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2.5 p-3 bg-background border border-border/40 rounded-xl text-xs"
                        >
                          <div className="flex shrink-0 mt-0.5">
                            {Array(5)
                              .fill(0)
                              .map((_, si) => (
                                <span
                                  key={si}
                                  className={`text-xs ${si < rating.stars ? "text-secondary-foreground" : "text-muted-foreground/20"}`}
                                >
                                  ★
                                </span>
                              ))}
                          </div>
                          <div className="flex-1 min-w-0">
                            {!isCoachView && "studentName" in rating && (
                              <span className="font-bold text-foreground text-xs block">
                                {(rating as any).studentName}
                              </span>
                            )}
                            {isCoachView && (
                              <span className="text-xs text-muted-foreground italic block">
                                Alumno anónimo
                              </span>
                            )}
                            {rating.comment && (
                              <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">
                                {rating.comment}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic py-2">
                      Sin calificaciones aún para esta clase.
                    </p>
                  )}

                  {/* Demo Simulation Rating */}
                  {canManageClasses &&
                    presentStudents.filter((name) => !ratingsMap[name]).length > 0 && (
                      <div className="space-y-2 border-t border-border/ pt-3 mt-2">
                        <span className="text-xs text-muted-foreground font-semibold block">
                          Simular reseña de alumno presente (demo)
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {presentStudents
                            .filter((name) => !ratingsMap[name])
                            .map((studentName) => (
                              <div
                                key={studentName}
                                className="p-2 bg-background rounded-xl border border-border/40 flex items-center gap-2"
                              >
                                <span className="text-xs font-bold text-foreground">
                                  {studentName}:
                                </span>
                                <div className="flex gap-0.5">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      type="button"
                                      onClick={() => {
                                        const comment =
                                          star <= 3
                                            ? prompt(`Comentario de ${studentName}:`) || undefined
                                            : undefined;
                                        setClassesList((prev) =>
                                          prev.map((item) => {
                                            if (item.id !== c.id) return item;
                                            return {
                                              ...item,
                                              ratings: {
                                                ...item.ratings,
                                                [studentName]: { stars: star, comment },
                                              },
                                            };
                                          }),
                                        );
                                      }}
                                      className="text-sm text-muted-foreground/30 hover:text-secondary-foreground transition-colors"
                                    >
                                      ★
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in text-foreground">
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
                if (showAddForm) {
                  setShowAddForm(false);
                  setEditingClassId(null);
                  setName("");
                  setStaffId("");
                  setStartTime("08:00");
                  setEndTime("09:00");
                  setSalaId("");
                  setDay(0);
                  setCreditsCost("1");
                  setCurrentLayout(Array(100).fill(true));
                } else {
                  setShowAddForm(true);
                }
              }}
            >
              <Plus className="h-4 w-4" /> {showAddForm ? "Cancelar" : "Crear clase"}
            </Button>
          )}
        </div>
      </div>

      {/* Quick Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border/60 p-4 rounded-2xl flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg shrink-0">
            📊
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">
              Ocupación Hoy
            </span>
            <span className="text-xl font-black text-foreground">{stats.avgOccupancy}%</span>
          </div>
        </div>
        <div className="bg-card border border-border/60 p-4 rounded-2xl flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-primary/ text-primary flex items-center justify-center text-lg shrink-0">
            🎟️
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">
              Reservas Activas
            </span>
            <span className="text-xl font-black text-foreground">{stats.totalBooked} alumnos</span>
          </div>
        </div>
        <div className="bg-card border border-border/60 p-4 rounded-2xl flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-destructive/ text-destructive flex items-center justify-center text-lg shrink-0">
            🔥
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">
              Clases Llenas
            </span>
            <span className="text-xl font-black text-foreground">
              {stats.fullClasses} completadas
            </span>
          </div>
        </div>
      </div>

      {/* Advanced Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 p-3.5 bg-secondary/15 rounded-2xl border border-border/40 text-xs text-foreground">
        <span className="font-bold text-muted-foreground uppercase text-[9.5px] tracking-wider pr-1">
          Filtros Rápidos:
        </span>

        {/* Room Filter */}
        <select
          value={selectedCalendarSalaId}
          onChange={(e) => setSelectedCalendarSalaId(e.target.value)}
          className="h-8 rounded-xl border border-border bg-background px-3 text-xs focus-visible:outline-none text-foreground font-semibold"
        >
          <option value="">Todas las salas</option>
          {salasList
            .filter(
              (s) =>
                selectedBranchId === "all" ||
                (selectedBranchId === "matriz" ? !s.branchId : s.branchId === selectedBranchId),
            )
            .map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
        </select>

        {/* Coach Filter */}
        <select
          value={selectedFilterCoachId}
          onChange={(e) => setSelectedFilterCoachId(e.target.value)}
          className="h-8 rounded-xl border border-border bg-background px-3 text-xs focus-visible:outline-none text-foreground font-semibold"
        >
          <option value="">Todos los profesores</option>
          {staffList.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        {/* Activity Filter */}
        <select
          value={selectedFilterActivity}
          onChange={(e) => setSelectedFilterActivity(e.target.value)}
          className="h-8 rounded-xl border border-border bg-background px-3 text-xs focus-visible:outline-none text-foreground font-semibold"
        >
          <option value="">Todas las actividades</option>
          {Array.from(new Set(classesList.map((c) => c.name)))
            .sort()
            .map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
        </select>

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

      {showAddForm && (
        <form
          onSubmit={handleAddClass}
          className="rounded-3xl border border-border bg-card p-6 max-w-xl space-y-4 animate-fade-up text-foreground"
        >
          <h3 className="text-sm font-bold text-muted-foreground uppercase">
            {editingClassId ? "Editar Clase" : "Crear Nueva Clase"}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Actividad</label>
              <select
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
              >
                <option value="">Selecciona una actividad...</option>
                <optgroup label="Fuerza y Musculación">
                  <option value="CrossFit">CrossFit</option>
                  <option value="Entrenamiento Funcional">Entrenamiento Funcional</option>
                  <option value="Levantamiento Olímpico">Levantamiento Olímpico</option>
                  <option value="Powerlifting">Powerlifting</option>
                  <option value="Calistenia">Calistenia</option>
                  <option value="Fuerza de Potencia">Fuerza de Potencia</option>
                </optgroup>
                <optgroup label="Cardio y Combate">
                  <option value="Spinning">Spinning / Cycling</option>
                  <option value="HIIT / Tabata">HIIT / Tabata</option>
                  <option value="Boxeo Recreativo">Boxeo Recreativo</option>
                  <option value="Kickboxing">Kickboxing</option>
                  <option value="Zumba">Zumba Fitness</option>
                  <option value="Ritmos / Dance">Ritmos / Dance</option>
                </optgroup>
                <optgroup label="Flexibilidad y Cuerpo-Mente">
                  <option value="Yoga Vinyasa">Yoga Vinyasa</option>
                  <option value="Yoga Hatha">Yoga Hatha</option>
                  <option value="Pilates Reformer">Pilates Reformer</option>
                  <option value="Pilates Mat">Pilates Mat</option>
                  <option value="Barré">Barré</option>
                  <option value="Estiramiento / Flex">Estiramiento & Flexibilidad</option>
                  <option value="Meditación">Meditación & Mindfulness</option>
                </optgroup>
                <optgroup label="Especializadas y Localizadas">
                  <option value="GAP">GAP (Glúteo-Abdo-Pierna)</option>
                  <option value="AquaGym">AquaGym</option>
                  <option value="Running Club">Running Club</option>
                  <option value="Tercera Edad Adaptada">Tercera Edad Adaptada</option>
                </optgroup>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Horario de la Clase
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none text-foreground"
                >
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
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <span className="text-xs font-bold text-muted-foreground">a</span>
                <select
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none text-foreground"
                >
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
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Instructor de Staff
              </label>
              <select
                required
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
              >
                <option value="">Selecciona un entrenador...</option>
                {staffList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.specialty})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Día de la Semana
              </label>
              <select
                required
                value={day}
                onChange={(e) => setDay(Number(e.target.value))}
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
              >
                <option value={0}>Lunes</option>
                <option value={1}>Martes</option>
                <option value={2}>Miércoles</option>
                <option value={3}>Jueves</option>
                <option value={4}>Viernes</option>
                <option value={5}>Sábado</option>
                <option value={6}>Domingo</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground block">
                Cupos Totales (de distribución)
              </label>
              <div className="flex h-10 items-center justify-between px-3 bg-secondary/20 border border-border rounded-xl text-sm font-bold text-foreground">
                <span>{capacity} lugares activos</span>
                <span className="text-[10px] text-muted-foreground font-semibold">
                  Usa la cuadrícula
                </span>
              </div>
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
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {selectedBranchId === "all" ? (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Sede / Sucursal
                </label>
                <select
                  required
                  value={classBranchId}
                  onChange={(e) => {
                    setClassBranchId(e.target.value);
                    setSalaId("");
                  }}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none text-foreground"
                >
                  <option value="matriz">Sede Principal (Palermo)</option>
                  {branchesList.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Sala / Salón</label>
                <select
                  required
                  value={salaId}
                  onChange={(e) => {
                    setSalaId(e.target.value);
                    const selectedSala = availableSalas.find((s) => s.id === e.target.value);
                    if (selectedSala && selectedSala.capacity) {
                      const cap = selectedSala.capacity;
                      setCurrentLayout(
                        Array(100)
                          .fill(false)
                          .map((_, i) => i < cap),
                      );
                    }
                  }}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none text-foreground"
                >
                  <option value="">Selecciona una sala...</option>
                  {availableSalas.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (Capacidad: {s.capacity || "N/A"})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedBranchId === "all" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Sala / Salón</label>
                <select
                  required
                  value={salaId}
                  onChange={(e) => {
                    setSalaId(e.target.value);
                    const selectedSala = availableSalas.find((s) => s.id === e.target.value);
                    if (selectedSala && selectedSala.capacity) {
                      const cap = selectedSala.capacity;
                      setCurrentLayout(
                        Array(100)
                          .fill(false)
                          .map((_, i) => i < cap),
                      );
                    }
                  }}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none text-foreground"
                >
                  <option value="">Selecciona una sala...</option>
                  {availableSalas.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (Capacidad: {s.capacity || "N/A"})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Template Loading & Saving */}
          <div className="border-t border-border/60 pt-3 space-y-3">
            <span className="text-xs font-bold text-muted-foreground uppercase block">
              Plantilla de Distribución (10x10)
            </span>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-muted-foreground">
                  Cargar Plantilla Guardada
                </label>
                <select
                  onChange={(e) => {
                    const temp = layoutTemplates.find((t) => t.id === e.target.value);
                    if (temp) {
                      setCurrentLayout([...temp.layout]);
                    }
                  }}
                  className="flex h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus-visible:outline-none text-foreground"
                >
                  <option value="">Selecciona plantilla...</option>
                  {layoutTemplates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.layout.filter(Boolean).length} cupos)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-muted-foreground">
                  Guardar Distribución como Plantilla
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Nombre, ej: Spinning 15"
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    className="flex h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus-visible:outline-none text-foreground"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleSaveTemplate}
                    className="rounded-xl h-9 text-xs px-2.5 font-bold shrink-0 text-foreground border-border hover:bg-secondary/20"
                  >
                    Guardar
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* 10x10 Interactive Grid */}
          <div className="space-y-2 border-t border-border/60 pt-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-muted-foreground">
                Distribución de lugares en la Sala (Toca para activar/desactivar)
              </span>
              <button
                type="button"
                onClick={() => setCurrentLayout(Array(100).fill(true))}
                className="text-[10px] font-bold text-primary hover:underline"
              >
                Activar Todos
              </button>
            </div>
            <div className="grid grid-cols-10 gap-1 mx-auto p-2 bg-secondary/15 rounded-2xl border border-border/40 max-w-[340px]">
              {currentLayout.map((active, index) => {
                const row = Math.floor(index / 10) + 1;
                const col = (index % 10) + 1;
                return (
                  <button
                    key={index}
                    type="button"
                    title={`Fila ${row}, Columna ${col}`}
                    onClick={() => {
                      const copy = [...currentLayout];
                      copy[index] = !copy[index];
                      setCurrentLayout(copy);
                    }}
                    className={`aspect-square w-full rounded-md border text-[8px] font-semibold transition-all flex items-center justify-center ${
                      active
                        ? "bg-primary border-primary text-white"
                        : "bg-background border-dashed border-border/70 text-muted-foreground/40 hover:bg-secondary/20"
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
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
            <div className="p-4 border border-border/60 bg-secondary/15 rounded-2xl space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isRecurrent"
                  checked={isRecurrent}
                  onChange={(e) => setIsRecurrent(e.target.checked)}
                  className="rounded border-border bg-background focus:ring-primary text-primary h-4 w-4"
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
                    <select
                      value={recurrentWeeks}
                      onChange={(e) => setRecurrentWeeks(Number(e.target.value))}
                      className="flex h-8 w-24 rounded-lg border border-border bg-background px-2 text-xs focus-visible:outline-none text-foreground font-bold"
                    >
                      {[2, 3, 4, 6, 8, 12].map((w) => (
                        <option key={w} value={w}>
                          {w} semanas
                        </option>
                      ))}
                    </select>
                    <span className="text-[11px] text-muted-foreground">
                      Generará {recurrentWeeks} clases en total.
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          <Button type="submit" className="rounded-xl">
            {editingClassId ? "Guardar Cambios" : "Programar Clase"}
          </Button>
        </form>
      )}

      {activeBlackout && (
        <div className="p-4 bg-destructive/ border border-destructive/ text-destructive rounded-3xl text-xs font-semibold flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div>
            <div className="font-bold">⚠️ Sede Cerrada por Día de Cierre / Feriado</div>
            <div className="text-[11px] text-destructive/80 mt-0.5">
              Motivo: {activeBlackout.reason}. Todas las actividades están suspendidas por hoy.
            </div>
          </div>
        </div>
      )}

      {/* Main content grid based on viewMode */}
      {viewMode === "list" ? (
        <div className="grid gap-6 md:grid-cols-1">
          {/* Left Side: Schedule */}
          <div className="col-span-1 space-y-4">
            <div className="rounded-2xl border border-border bg-card p-4">
              <h3 className="text-xs font-bold text-muted-foreground uppercase mb-4">
                Lunes (Hoy)
              </h3>
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
                      className={`p-4 rounded-xl border transition flex items-center justify-between ${
                        c.status === "cancelada"
                          ? "border-destructive/ bg-destructive/ opacity-60 cursor-pointer"
                          : activeBlackout
                            ? "border-border opacity-50 cursor-not-allowed bg-secondary/10"
                            : selectedClass === c.id
                              ? "border-primary bg-primary/5 cursor-pointer"
                              : "border-border hover:border-foreground/20 cursor-pointer"
                      }`}
                    >
                      <div>
                        <h4
                          className={`font-bold text-sm ${c.status === "cancelada" ? "text-destructive dark:text-destructive line-through" : ""}`}
                        >
                          {c.status === "cancelada" && "❌ "}
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
                        <span className="text-[9px] bg-destructive/ text-destructive px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                          ❌ Cancelada
                        </span>
                      ) : activeBlackout ? (
                        <span className="text-[9px] bg-destructive/ text-destructive px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                          ❌ Suspendida
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
                  <p className="text-xs text-muted-foreground italic py-6 text-center">
                    No hay clases programadas para hoy.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-1 items-start">
          {/* Left 3 columns: Weekly Calendar Grid */}
          <div className="col-span-1 space-y-4">
            {/* Weekly Calendar Grid Container */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-6 overflow-x-auto pb-4">
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

      {/* Reporte de Asistencia y Liquidación de Coaches */}
      <div className="rounded-3xl border border-border bg-card p-6 space-y-4 text-foreground mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/50 pb-4">
          <div>
            <h3 className="text-base font-bold flex items-center gap-2">
              📊 Reporte de Asistencia y Liquidación de Coaches
            </h3>
            <p className="text-xs text-muted-foreground">
              Métricas y liquidación estimada basadas en asistencia registrada para la{" "}
              <strong>Semana {currentWeekOffset + 1}</strong>.
            </p>
          </div>
          <span className="text-[11px] bg-primary/10 text-primary font-bold px-3 py-1 rounded-full uppercase self-start sm:self-auto">
            Tarifa: $3,000 Fijo / clase + $500 por alumno presente
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[600px] border-collapse">
            <thead>
              <tr className="border-b border-border/30 text-muted-foreground font-bold">
                <th className="py-2.5 px-3">Profesor / Instructor</th>
                <th className="py-2.5 px-3 text-center">Clases Dadas</th>
                <th className="py-2.5 px-3 text-center">Asistencias Reales</th>
                <th className="py-2.5 px-3 text-center">Ausencias</th>
                <th className="py-2.5 px-3 text-center">Asistencia %</th>
                <th className="py-2.5 px-3 text-center">Calificación ★</th>
                <th className="py-2.5 px-3 text-right">Liquidación Estimada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {staffList.map((coach) => {
                // Get active classes for coach in this week
                const coachClasses = classesList.filter(
                  (c) =>
                    c.staffId === coach.id &&
                    (c.weekOffset || 0) === currentWeekOffset &&
                    c.status !== "cancelada",
                );

                const clasesDadas = coachClasses.length;
                let totalAsistencias = 0;
                let totalAusencias = 0;
                let totalEnrolled = 0;

                coachClasses.forEach((c) => {
                  Object.keys(c.enrolledSpots || {}).forEach((spotIdxStr) => {
                    const idx = parseInt(spotIdxStr);
                    const att = c.attendance?.[idx] || "pendiente";
                    totalEnrolled++;
                    if (att === "presente") totalAsistencias++;
                    if (att === "ausente") totalAusencias++;
                  });
                });

                const attendancePercentage =
                  totalEnrolled > 0 ? Math.round((totalAsistencias / totalEnrolled) * 100) : 100;

                // Calculate earnings
                const basePay = clasesDadas * 3000;
                const bonusPay = totalAsistencias * 500;
                const totalEarnings = basePay + bonusPay;

                // Aggregate ratings across all coach's classes this week
                const allCoachRatings = coachClasses.flatMap((cl) =>
                  Object.values(cl.ratings || {}),
                );
                const avgCoachRating =
                  allCoachRatings.length > 0
                    ? allCoachRatings.reduce((s, r) => s + r.stars, 0) / allCoachRatings.length
                    : null;

                return (
                  <tr
                    key={coach.id}
                    className="hover:bg-secondary/10 transition-colors font-semibold"
                  >
                    <td className="py-3 px-3 flex items-center gap-2">
                      <img
                        src={coach.photo}
                        alt={coach.name}
                        className="h-7 w-7 rounded-full object-cover border border-border/40"
                      />
                      <div>
                        <div className="font-bold text-foreground">{coach.name}</div>
                        <div className="text-[10px] text-muted-foreground">{coach.specialty}</div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center text-foreground/80">
                      {clasesDadas} clases
                    </td>
                    <td className="py-3 px-3 text-center text-primary font-bold">
                      {totalAsistencias} alumnos
                    </td>
                    <td className="py-3 px-3 text-center text-destructive">
                      {totalAusencias} inasistencias
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          attendancePercentage >= 80
                            ? "bg-primary/ text-primary"
                            : attendancePercentage >= 50
                              ? "bg-secondary/ text-secondary-foreground"
                              : "bg-destructive/ text-destructive"
                        }`}
                      >
                        {attendancePercentage}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {avgCoachRating !== null ? (
                        <span
                          className={`inline-flex items-center gap-1 font-bold text-[11px] ${
                            avgCoachRating >= 4
                              ? "text-secondary-foreground"
                              : avgCoachRating >= 3
                                ? "text-secondary-foreground"
                                : "text-destructive"
                          }`}
                        >
                          {avgCoachRating < 3.5 && (
                            <span title="Calificación baja" className="text-destructive">
                              ⚠️
                            </span>
                          )}
                          {Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <span
                                key={i}
                                className={i < Math.round(avgCoachRating) ? "" : "opacity-20"}
                              >
                                ★
                              </span>
                            ))}
                          {avgCoachRating.toFixed(1)}
                          <span className="text-[9px] text-muted-foreground font-normal">
                            ({allCoachRatings.length})
                          </span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-muted-foreground">Sin datos</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right text-primary font-black text-[13px]">
                      ${totalEarnings.toLocaleString("es-AR")} ARS
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
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

// --- Pestaña de Clases de Prueba ---
function ClasesPruebaTab({
  trialRequests,
  setTrialRequests,
  classesList,
  trialClassSettings,
  setTrialClassSettings,
}: any) {
  const [filterStatus, setFilterStatus] = useState("all");
  const [rescheduleData, setRescheduleData] = useState<any>(null);

  const filteredRequests = useMemo(() => {
    return trialRequests.filter((r: any) => filterStatus === "all" || r.status === filterStatus);
  }, [trialRequests, filterStatus]);

  const totalRequests = trialRequests.length;
  const asistencias = trialRequests.filter(
    (r: any) => r.status === "converted" || r.status === "attended_no_buy",
  ).length;
  const converted = trialRequests.filter((r: any) => r.status === "converted").length;
  const conversionRate = asistencias > 0 ? Math.round((converted / asistencias) * 100) : 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Pendiente
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="secondary" className="bg-primary text-primary border-blue-200">
            Aprobada
          </Badge>
        );
      case "converted":
        return (
          <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-100">
            Convertido a Alumno
          </Badge>
        );
      case "no_show":
        return (
          <Badge
            variant="destructive"
            className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100"
          >
            No se presentó
          </Badge>
        );
      case "attended_no_buy":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
            Vino - Sin Compra
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleUpdateStatus = (id: string, status: string) => {
    setTrialRequests((prev: any) => prev.map((r: any) => (r.id === id ? { ...r, status } : r)));
  };

  const handleRescheduleSubmit = () => {
    if (rescheduleData) {
      setTrialRequests((prev: any) =>
        prev.map((r: any) =>
          r.id === rescheduleData.id
            ? {
                ...r,
                classId: rescheduleData.newClassId,
                date: rescheduleData.newDate,
                status: "pending",
              }
            : r,
        ),
      );
      setRescheduleData(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Clases de Prueba</h2>
          <p className="text-sm text-muted-foreground">
            Gestioná las solicitudes de nuevos prospectos que quieren probar el centro.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className=" border-border">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Solicitudes Totales</div>
            <div className="text-3xl font-bold mt-2">{totalRequests}</div>
            <p className="text-xs text-muted-foreground mt-1">Este mes</p>
          </CardContent>
        </Card>
        <Card className=" border-border">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Asistencias a Prueba</div>
            <div className="text-3xl font-bold mt-2">{asistencias}</div>
            <p className="text-xs text-muted-foreground mt-1">Vino y completó la clase</p>
          </CardContent>
        </Card>
        <Card className=" border-border">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Tasa de Conversión</div>
            <div className="text-3xl font-bold mt-2 text-green-600">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">De los que asistieron a la prueba</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-border">
        <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3.5 shrink-0">
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary shrink-0">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-foreground">
                Configuración Activa de Clases de Prueba
              </div>
              <p className="text-xs text-muted-foreground">
                Ajustes generales y valor comercial para la primera visita del prospecto.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 sm:gap-8 border-t md:border-t-0 pt-3 md:pt-0 border-border">
            <div className="flex items-center gap-3">
              <Label htmlFor="trial-switch" className="text-xs font-semibold cursor-pointer">
                Ofrecer Clase de Prueba
              </Label>
              <Switch
                id="trial-switch"
                checked={trialClassSettings.enabled}
                onCheckedChange={(c) =>
                  setTrialClassSettings({ ...trialClassSettings, enabled: c })
                }
              />
            </div>
            {trialClassSettings.enabled && (
              <div className="flex items-center gap-2 border-l border-border pl-6 sm:pl-8">
                <Label className="text-xs font-semibold whitespace-nowrap">
                  Precio (0 = Gratis):
                </Label>
                <div className="relative w-28">
                  <span className="absolute left-2.5 top-1.5 text-xs text-muted-foreground font-bold">
                    $
                  </span>
                  <Input
                    type="number"
                    className="pl-6 h-8 text-xs font-bold rounded-xl"
                    value={trialClassSettings.price}
                    onChange={(e) =>
                      setTrialClassSettings({
                        ...trialClassSettings,
                        price: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="rounded-xl border border-border bg-card">
        <div className="p-4 border-b border-border flex flex-wrap gap-2">
          <Button
            variant={filterStatus === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("all")}
          >
            Todas
          </Button>
          <Button
            variant={filterStatus === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("pending")}
          >
            Pendientes
          </Button>
          <Button
            variant={filterStatus === "approved" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("approved")}
          >
            Aprobadas
          </Button>
          <Button
            variant={filterStatus === "no_show" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("no_show")}
          >
            No-shows
          </Button>
          <Button
            variant={filterStatus === "attended_no_buy" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("attended_no_buy")}
          >
            Vino sin compra
          </Button>
          <Button
            variant={filterStatus === "converted" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("converted")}
          >
            Convertidos
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Prospecto</th>
                <th className="px-6 py-4 font-medium">Contacto</th>
                <th className="px-6 py-4 font-medium">Clase Solicitada</th>
                <th className="px-6 py-4 font-medium">Fecha</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredRequests.map((r: any) => {
                const targetClass = classesList.find((c: any) => c.id === r.classId);
                return (
                  <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium">{r.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground">{r.email}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs">{r.phone}</span>
                          <a
                            href={`https://wa.me/${r.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-500 hover:text-green-600 transition-colors"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {targetClass ? targetClass.name : "Clase eliminada"}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{r.date}</td>
                    <td className="px-6 py-4">{getStatusBadge(r.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {r.status === "pending" && (
                          <Button
                            size="sm"
                            className="rounded-xl h-8 px-3 text-xs font-semibold"
                            onClick={() => handleUpdateStatus(r.id, "approved")}
                          >
                            Aprobar
                          </Button>
                        )}
                        {r.status === "approved" && (
                          <Button
                            size="sm"
                            className="rounded-xl h-8 px-3 text-xs font-semibold bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleUpdateStatus(r.id, "converted")}
                          >
                            <Check className="w-3.5 h-3.5 mr-1" /> Hizo Compra
                          </Button>
                        )}
                        {r.status === "no_show" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-xl h-8 px-3 text-xs font-semibold"
                            onClick={() =>
                              setRescheduleData({
                                id: r.id,
                                newClassId: r.classId,
                                newDate: r.date,
                              })
                            }
                          >
                            Reprogramar
                          </Button>
                        )}
                        {(r.status === "converted" || r.status === "attended_no_buy") && (
                          <span className="inline-flex items-center text-xs font-medium text-muted-foreground mr-1">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-green-500" /> Listo
                          </span>
                        )}

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 rounded-xl hover:bg-secondary/80"
                              title="Más acciones"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-48 rounded-xl border border-border bg-card p-1 text-xs"
                          >
                            {r.status === "approved" && (
                              <>
                                <DropdownMenuItem
                                  className="rounded-lg cursor-pointer py-1.5 font-medium"
                                  onClick={() => handleUpdateStatus(r.id, "attended_no_buy")}
                                >
                                  👤 Vino sin compra
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="rounded-lg cursor-pointer py-1.5 font-medium text-destructive hover:text-destructive"
                                  onClick={() => handleUpdateStatus(r.id, "no_show")}
                                >
                                  ❌ No asistió (No-show)
                                </DropdownMenuItem>
                              </>
                            )}
                            {r.status !== "pending" && r.status !== "approved" && (
                              <DropdownMenuItem
                                className="rounded-lg cursor-pointer py-1.5 font-medium"
                                onClick={() => handleUpdateStatus(r.id, "approved")}
                              >
                                ✔️ Marcar como Aprobada
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="rounded-lg cursor-pointer py-1.5 font-medium"
                              onClick={() =>
                                setRescheduleData({
                                  id: r.id,
                                  newClassId: r.classId,
                                  newDate: r.date,
                                })
                              }
                            >
                              📅 Reprogramar clase
                            </DropdownMenuItem>
                            {r.status !== "pending" && (
                              <DropdownMenuItem
                                className="rounded-lg cursor-pointer py-1.5 font-medium text-muted-foreground"
                                onClick={() => handleUpdateStatus(r.id, "pending")}
                              >
                                🔄 Volver a Pendiente
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!rescheduleData} onOpenChange={(open) => !open && setRescheduleData(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reprogramar Clase de Prueba</DialogTitle>
          </DialogHeader>
          {rescheduleData && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nueva Fecha</Label>
                <Input
                  type="date"
                  value={rescheduleData.newDate}
                  onChange={(e) =>
                    setRescheduleData({ ...rescheduleData, newDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Clase Seleccionada</Label>
                <Select
                  value={rescheduleData.newClassId}
                  onValueChange={(val) => setRescheduleData({ ...rescheduleData, newClassId: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar clase" />
                  </SelectTrigger>
                  <SelectContent>
                    {classesList.map((c: any) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setRescheduleData(null)}>
              Cancelar
            </Button>
            <Button onClick={handleRescheduleSubmit}>Guardar y Pendiente</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
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
  const [staffCerts, setStaffCerts] = useState("");
  const [staffAvatarUrl, setStaffAvatarUrl] = useState<string | null>(null);
  const [staffDiplomas, setStaffDiplomas] = useState<string[]>([]);
  const [newStaffRole, setNewStaffRole] = useState("coach");
  const [newStaffBranchId, setNewStaffBranchId] = useState("matriz");

  // Staff Edit & Delete States
  const [editingStaff, setEditingStaff] = useState<any | null>(null);
  const [editStaffName, setEditStaffName] = useState("");
  const [editStaffSpecialty, setEditStaffSpecialty] = useState("");
  const [editStaffCerts, setEditStaffCerts] = useState("");
  const [editStaffRole, setEditStaffRole] = useState("coach");
  const [editStaffBranchId, setEditStaffBranchId] = useState("matriz");
  const [editStaffAvatarUrl, setEditStaffAvatarUrl] = useState<string | null>(null);
  const [editStaffDiplomas, setEditStaffDiplomas] = useState<string[]>([]);

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
    if (!staffName || !staffSpecialty) return;

    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

    const newStaff = {
      id: Math.random().toString(),
      name: staffName,
      specialty: staffSpecialty,
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
    };

    setStaffList((prev) => [...prev, newStaff]);
    setStaffName("");
    setStaffSpecialty("");
    setStaffCerts("");
    setStaffAvatarUrl(null);
    setStaffDiplomas([]);
    setNewStaffRole("coach");
    setNewStaffBranchId("matriz");
    setNewStaffAvails(WEEKDAYS.map((day) => ({ day, intervals: [] })));
    setIsCreateStaffOpen(false);
  };

  const handleStartEditStaff = (staff: any) => {
    setEditingStaff(staff);
    setEditStaffName(staff.name);
    setEditStaffSpecialty(staff.specialty);
    setEditStaffCerts(staff.certifications.join(", "));
    setEditStaffRole(staff.role || "coach");
    setEditStaffBranchId(staff.branchId || "matriz");
    setEditStaffAvatarUrl(staff.photo);
    setEditStaffDiplomas(staff.certificationImages || []);
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
    if (!editStaffName || !editStaffSpecialty || !editingStaff) return;

    setStaffList((prev) =>
      prev.map((s) =>
        s.id === editingStaff.id
          ? {
              ...s,
              name: editStaffName,
              specialty: editStaffSpecialty,
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
          { id: "protocolos", label: "Protocolos / Checklists" },
          { id: "requisitos", label: "Normas de Ingreso" },
          { id: "staff", label: "Equipo (Staff)" },
          { id: "salas", label: "Salas / Salones" },
          { id: "sedes", label: "Sucursales (Sedes)" },
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

      {selectedBranchId === "all" && subTab !== "staff" && subTab !== "sedes" ? (
        <div className="flex flex-col items-center justify-center text-center p-12 bg-card border border-border rounded-3xl min-h-[300px] text-muted-foreground animate-fade-in">
          <MapPin className="h-10 w-10 mb-3 text-primary animate-pulse" />
          <h3 className="font-bold text-sm text-foreground">Configuración de Sede Requerida</h3>
          <p className="text-xs max-w-sm mt-1 leading-relaxed">
            Las fotos, horarios comerciales, amenidades, políticas locales y normas de ingreso se
            gestionan de forma individual por cada sucursal ("Airbnb style").
          </p>
          <p className="text-xs text-primary font-semibold mt-3">
            Por favor, selecciona una sede específica (Palermo, Belgrano, etc.) en el selector del
            encabezado principal para poder configurarla.
          </p>
        </div>
      ) : (
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
            <div className="space-y-6 max-w-4xl bg-card border border-border p-6 rounded-3xl animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Dumbbell className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-base text-foreground">
                      Equipamiento e Infraestructura Deportiva
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Selecciona la maquinaria de tu sede o supervisa el desgaste operativo vinculado
                    a las rutinas de los alumnos.
                  </p>
                </div>

                <div className="flex items-center bg-secondary/40 p-1 rounded-xl border border-border/60 shrink-0">
                  <button
                    type="button"
                    onClick={() => setEquipViewMode("catalog")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      equipViewMode === "catalog"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Selección de Sede</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEquipViewMode("maintenance")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      equipViewMode === "maintenance"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Mantenimiento & Desgaste</span>
                  </button>
                </div>
              </div>

              {equipViewMode === "catalog" ? (
                <>
                  <div className="p-4 rounded-2xl bg-secondary/ border border-border/ flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-secondary-foreground shrink-0 mt-0.5" />
                    <div className="text-xs text-secondary-foreground/90 leading-relaxed">
                      <span className="font-bold text-secondary-foreground">
                        Nota sobre imágenes representativas:
                      </span>{" "}
                      Las fotografías e ilustraciones de esta sección son de carácter{" "}
                      <strong className="underline">genérico e ilustrativo</strong> para reflejar
                      los estándares de calidad de la plataforma, y no corresponden necesariamente a
                      las marcas o modelos exactos de cada centro o sala.
                    </div>
                  </div>

                  <div className="space-y-6 pt-2">
                    {equipmentCategories.map((category) => (
                      <div key={category} className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-border/80 pb-1.5 flex items-center justify-between">
                          <span>{category}</span>
                          <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full font-normal text-muted-foreground">
                            {equipment.filter((e) => e.category === category && e.checked).length} /{" "}
                            {equipment.filter((e) => e.category === category).length} activos
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
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-sm font-semibold truncate">
                                        {e.name}
                                      </span>
                                      {e.status === "maintenance_due" && (
                                        <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold bg-destructive/ text-destructive border border-destructive/ shrink-0">
                                          ⚠️ Revisar
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-1 text-[10px] text-muted-foreground">
                                      <span className="px-1.5 py-0.5 rounded bg-secondary text-foreground/80 font-medium shrink-0">
                                        {e.trackingType === "direct"
                                          ? "⚡ Tracking Exacto"
                                          : e.trackingType === "volume"
                                            ? "🏋️ Volumen"
                                            : "🧘 Por Sesión"}
                                      </span>
                                      <span className="truncate">🛠️ {e.maintenanceRule}</span>
                                    </div>
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
                </>
              ) : (
                <div className="space-y-6 animate-fade-in">
                  <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30 flex items-start gap-3.5">
                    <Zap className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div className="space-y-1 text-xs">
                      <div className="font-bold text-foreground">
                        Inteligencia Operativa & Mantenimiento Predictivo
                      </div>
                      <div className="text-muted-foreground leading-relaxed">
                        Este panel conecta el uso real en las rutinas de los alumnos (kilogramos
                        levantados, horas de cardio, sesiones completadas) con el ciclo de vida del
                        equipamiento de esta sede. Permite programar mantenimientos antes de que
                        ocurran averías y optimizar la futura compra de máquinas según su mapa de
                        calor y demanda real.
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Equipamiento Activo en esta Sede (
                        {equipment.filter((e) => e.checked).length} ítems)
                      </h4>
                      <span className="text-[11px] text-muted-foreground">
                        Actualizado en tiempo real por rutinas completadas
                      </span>
                    </div>

                    <div className="divide-y divide-border/60 rounded-2xl border border-border/80 bg-secondary/10 overflow-hidden">
                      {equipment
                        .filter((e) => e.checked)
                        .map((e) => (
                          <div
                            key={e.id}
                            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-secondary/20 transition"
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
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
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-foreground truncate">
                                    {e.name}
                                  </span>
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-medium shrink-0">
                                    {e.category}
                                  </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
                                  <span className="font-semibold text-primary">
                                    {e.trackingType === "direct"
                                      ? "⚡ Exacto (Reps/Hs)"
                                      : e.trackingType === "volume"
                                        ? "🏋️ Volumen Acumulado"
                                        : "🧘 Ocurrencia / Sesión"}
                                  </span>
                                  <span>•</span>
                                  <span>
                                    📊{" "}
                                    <strong className="text-foreground">
                                      {e.stats || "Sin datos"}
                                    </strong>
                                  </span>
                                  <span>•</span>
                                  <span>🛠️ {e.maintenanceRule}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-border/40">
                              <div>
                                {e.status === "maintenance_due" ? (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-destructive/ text-destructive border border-destructive/">
                                    <AlertCircle className="w-3.5 h-3.5" /> Requiere Atención
                                  </span>
                                ) : e.status === "warning" ? (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-secondary/ text-secondary-foreground border border-border/">
                                    <Clock className="w-3.5 h-3.5" /> Revisión Próxima
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-primary/ text-primary border border-primary/">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Estado Óptimo
                                  </span>
                                )}
                              </div>

                              <Button
                                size="sm"
                                variant={
                                  e.status === "maintenance_due" || e.status === "warning"
                                    ? "default"
                                    : "outline"
                                }
                                className="rounded-xl text-xs font-semibold h-8"
                                onClick={() => {
                                  setEquipment((prev) =>
                                    prev.map((item) =>
                                      item.id === e.id
                                        ? {
                                            ...item,
                                            status: "ok",
                                            stats: "Mantenimiento registrado hoy",
                                          }
                                        : item,
                                    ),
                                  );
                                }}
                              >
                                <Wrench className="w-3.5 h-3.5 mr-1.5" /> Registrar Mantenimiento
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
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
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">
                          Especialidad / Cargo
                        </label>
                        <input
                          type="text"
                          required
                          value={staffSpecialty}
                          onChange={(e) => setStaffSpecialty(e.target.value)}
                          className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
                          placeholder="Entrenador de CrossFit"
                        />
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

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground block">
                          Rol de Acceso al Sistema
                        </label>
                        <select
                          value={newStaffRole}
                          onChange={(e) => setNewStaffRole(e.target.value)}
                          className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none text-foreground"
                        >
                          <option value="coach">💪 Coach / Profesor</option>
                          <option value="receptionist">🔑 Recepcionista</option>
                          <option value="manager">👤 Gerente de Sede</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground block">
                          Sede / Sucursal de Trabajo
                        </label>
                        <select
                          value={newStaffBranchId}
                          onChange={(e) => setNewStaffBranchId(e.target.value)}
                          className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none text-foreground"
                        >
                          <option value="matriz">Sede Principal (Palermo)</option>
                          {branchesList.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name}
                            </option>
                          ))}
                        </select>
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

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground block">
                      Especialidad / Cargo
                    </label>
                    <input
                      type="text"
                      required
                      value={editStaffSpecialty}
                      onChange={(e) => setEditStaffSpecialty(e.target.value)}
                      className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
                    />
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

                  <div className="grid gap-4 grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground block">
                        Rol del Sistema
                      </label>
                      <select
                        value={editStaffRole}
                        onChange={(e) => setEditStaffRole(e.target.value)}
                        className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none text-foreground"
                      >
                        <option value="coach">💪 Coach / Profesor</option>
                        <option value="receptionist">🔑 Recepcionista</option>
                        <option value="manager">👤 Gerente de Sede</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground block">
                        Sede Asignada
                      </label>
                      <select
                        value={editStaffBranchId}
                        onChange={(e) => setEditStaffBranchId(e.target.value)}
                        className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none text-foreground"
                      >
                        <option value="matriz">Sede Principal (Palermo)</option>
                        {branchesList.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name}
                          </option>
                        ))}
                      </select>
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
          {/* Subtab 6: Sucursales / Sedes */}
          {subTab === "sedes" && (
            <div className="space-y-6 max-w-2xl bg-card border border-border p-6 rounded-3xl animate-fade-up">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-sm">Sucursales y Sedes</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Administra las ubicaciones físicas asociadas a tu red de gimnasios.
                  </p>
                </div>
                <Button
                  onClick={() => setIsCreateSedeOpen(true)}
                  size="sm"
                  className="rounded-xl font-bold text-xs gap-1.5 shrink-0"
                >
                  <Plus className="h-4 w-4" /> Agregar Sucursal
                </Button>
              </div>

              <Dialog open={isCreateSedeOpen} onOpenChange={setIsCreateSedeOpen}>
                <DialogContent className="max-w-xl border border-border bg-card">
                  <DialogHeader>
                    <DialogTitle>Agregar Sucursal</DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newBranchName || !newBranchAddress) return;
                      setBranchesList((prev) => [
                        ...prev,
                        {
                          id: Math.random().toString(),
                          name: newBranchName,
                          address: newBranchAddress,
                          manager: newBranchManager || undefined,
                          lat: newBranchLat ? parseFloat(newBranchLat) : undefined,
                          lng: newBranchLng ? parseFloat(newBranchLng) : undefined,
                          creditCostMultiplier: newBranchMultiplier
                            ? parseFloat(newBranchMultiplier)
                            : 1.0,
                        },
                      ]);
                      setNewBranchName("");
                      setNewBranchAddress("");
                      setNewBranchManager("");
                      setNewBranchLat("");
                      setNewBranchLng("");
                      setNewBranchMultiplier("1.0");
                      setIsCreateSedeOpen(false);
                    }}
                    className="space-y-4 pt-2"
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground font-semibold">
                          Nombre de la Sede
                        </label>
                        <input
                          type="text"
                          required
                          value={newBranchName}
                          onChange={(e) => setNewBranchName(e.target.value)}
                          className="flex h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus-visible:outline-none"
                          placeholder="Sede Belgrano"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground font-semibold">
                          Dirección Física
                        </label>
                        <input
                          type="text"
                          required
                          value={newBranchAddress}
                          onChange={(e) => setNewBranchAddress(e.target.value)}
                          className="flex h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus-visible:outline-none"
                          placeholder="Av. Cabildo 1820, CABA"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground font-semibold">
                          Responsable de Sede (Manager)
                        </label>
                        <input
                          type="text"
                          value={newBranchManager}
                          onChange={(e) => setNewBranchManager(e.target.value)}
                          className="flex h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus-visible:outline-none"
                          placeholder="Carlos Gómez"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground font-semibold">
                          Multiplicador de Créditos (Wellhub / ClassPass)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          min="0.5"
                          max="3.0"
                          value={newBranchMultiplier}
                          onChange={(e) => setNewBranchMultiplier(e.target.value)}
                          className="flex h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus-visible:outline-none"
                          placeholder="1.2"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground font-semibold">
                          Coordenada Latitud (GPS)
                        </label>
                        <input
                          type="number"
                          step="0.0001"
                          value={newBranchLat}
                          onChange={(e) => setNewBranchLat(e.target.value)}
                          className="flex h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus-visible:outline-none"
                          placeholder="-34.5612"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground font-semibold">
                          Coordenada Longitud (GPS)
                        </label>
                        <input
                          type="number"
                          step="0.0001"
                          value={newBranchLng}
                          onChange={(e) => setNewBranchLng(e.target.value)}
                          className="flex h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus-visible:outline-none"
                          placeholder="-58.4568"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-border">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                        onClick={() => setIsCreateSedeOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button size="sm" type="submit" className="rounded-xl">
                        Agregar Sede
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Edit Sede Dialog */}
              <Dialog open={!!editingSede} onOpenChange={(o) => !o && setEditingSede(null)}>
                <DialogContent className="max-w-md border border-border bg-card">
                  <DialogHeader>
                    <DialogTitle>Editar Sucursal</DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!editingSede || !editingSede.name) return;
                      setBranchesList((prev) =>
                        prev.map((b) => (b.id === editingSede.id ? editingSede : b)),
                      );
                      setEditingSede(null);
                    }}
                    className="space-y-4 pt-2 text-sm"
                  >
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground font-semibold">
                        Nombre de Sucursal
                      </label>
                      <input
                        type="text"
                        required
                        value={editingSede?.name || ""}
                        onChange={(e) => setEditingSede({ ...editingSede, name: e.target.value })}
                        className="flex h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus-visible:outline-none text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground font-semibold">
                        Dirección Física
                      </label>
                      <input
                        type="text"
                        required
                        value={editingSede?.address || ""}
                        onChange={(e) =>
                          setEditingSede({ ...editingSede, address: e.target.value })
                        }
                        className="flex h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus-visible:outline-none text-foreground"
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground font-semibold">
                          Responsable / Manager
                        </label>
                        <input
                          type="text"
                          value={editingSede?.manager || ""}
                          onChange={(e) =>
                            setEditingSede({ ...editingSede, manager: e.target.value })
                          }
                          className="flex h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus-visible:outline-none text-foreground"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground font-semibold">
                          Multiplicador de Crédito
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          min="0.5"
                          max="3.0"
                          value={editingSede?.creditCostMultiplier || 1.0}
                          onChange={(e) =>
                            setEditingSede({
                              ...editingSede,
                              creditCostMultiplier: parseFloat(e.target.value) || 1.0,
                            })
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
                        onClick={() => setEditingSede(null)}
                      >
                        Cancelar
                      </Button>
                      <Button size="sm" type="submit" className="rounded-xl">
                        Guardar Cambios
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Branches list */}
              <div className="space-y-2 border-t border-border pt-4">
                <h4 className="text-xs font-bold text-muted-foreground uppercase">
                  Sedes Registradas
                </h4>
                <div className="divide-y divide-border">
                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-foreground">
                        Sede Principal (Palermo)
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Av. Santa Fe 3421, Palermo, CABA
                      </div>
                      <div className="flex gap-3 mt-1 text-[10px] text-muted-foreground">
                        <span>👤 Manager: Alan Kraft</span>
                        <span>📍 GPS: -34.5829, -58.4115</span>
                        <span>💎 Multiplicador: 1.0x</span>
                      </div>
                    </div>
                    <span className="text-[10px] bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-bold uppercase shrink-0">
                      Matriz
                    </span>
                  </div>
                  {branchesList.map((branch) => (
                    <div key={branch.id} className="py-3 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-foreground">{branch.name}</div>
                        <div className="text-xs text-muted-foreground">{branch.address}</div>
                        <div className="flex gap-3 mt-1 text-[10px] text-muted-foreground flex-wrap">
                          {branch.manager && <span>👤 Manager: {branch.manager}</span>}
                          {branch.lat && branch.lng && (
                            <span>
                              📍 GPS: {branch.lat.toFixed(4)}, {branch.lng.toFixed(4)}
                            </span>
                          )}
                          {branch.creditCostMultiplier && (
                            <span>💎 Multiplicador: {branch.creditCostMultiplier.toFixed(1)}x</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => setEditingSede({ ...branch })}
                          className="p-1.5 text-muted-foreground hover:bg-secondary rounded-lg transition"
                          title="Editar sucursal"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeletingItem({ type: "sede", id: branch.id, name: branch.name });
                            setDeleteConfirmText("");
                          }}
                          className="p-1.5 text-destructive hover:bg-destructive/ rounded-lg transition"
                          title="Eliminar sucursal"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {branchesList.length === 0 && (
                    <p className="text-xs text-muted-foreground italic py-3">
                      No hay sucursales secundarias registradas.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

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

          {/* Subtab 7: Días de Cierre (Blackout Days) */}
          {subTab === "protocolos" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-foreground">
                    Protocolos Operativos
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Configura los checklists diarios obligatorios por rol y horario.
                  </p>
                </div>
                {protocolViewMode === "list" && (
                  <Button
                    className="rounded-xl font-bold animate-fade-in"
                    onClick={() => {
                      setNewProtocolTitle("");
                      setNewProtocolRole("receptionist");
                      setNewProtocolTime("Mañana");
                      setNewProtocolItemsText("");
                      setEditingProtocol(null);
                      setIsCreateProtocolOpen(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" /> Nuevo Protocolo
                  </Button>
                )}
              </div>

              {/* Segmented Control Toggle */}
              <div className="flex bg-secondary/30 p-1 rounded-xl w-fit border border-border/50">
                <button
                  onClick={() => setProtocolViewMode("list")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    protocolViewMode === "list"
                      ? "bg-card text-foreground border border-border"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Protocolos Activos ({protocols.length})
                </button>
                <button
                  onClick={() => setProtocolViewMode("logs")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    protocolViewMode === "logs"
                      ? "bg-card text-foreground border border-border"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Historial de Auditoría ({checklistLogs.length})
                </button>
              </div>

              {protocolViewMode === "list" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {protocols.map((prot) => (
                    <Card
                      key={prot.id}
                      className="border-border bg-card hover:border-primary/50 transition-colors animate-fade-in"
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start gap-2">
                          <CardTitle className="text-sm font-bold truncate max-w-[160px]">
                            {prot.title}
                          </CardTitle>
                          <Badge
                            variant="secondary"
                            className="text-[10px] uppercase font-bold shrink-0"
                          >
                            {prot.role === "receptionist"
                              ? "🔑 Recepción"
                              : prot.role === "coach"
                                ? "💪 Coach"
                                : prot.role === "manager"
                                  ? "👤 Gerente"
                                  : prot.role}
                          </Badge>
                        </div>
                        <CardDescription className="text-xs flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" /> {prot.time}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 mt-2">
                          {prot.items.map((item, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-xs text-muted-foreground"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4 pt-4 border-t border-border flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-[11px] text-muted-foreground font-semibold"
                            onClick={() => {
                              setEditingProtocol(prot);
                              setNewProtocolTitle(prot.title);
                              setNewProtocolRole(prot.role);
                              setNewProtocolTime(prot.time);
                              setNewProtocolItemsText(prot.items.join("\n"));
                              setIsCreateProtocolOpen(true);
                            }}
                          >
                            <Edit2 className="w-3 h-3 mr-1" /> Editar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-[11px] text-destructive hover:text-destructive hover:bg-destructive/10 font-semibold"
                            onClick={() => {
                              if (
                                confirm(`¿Estás seguro de eliminar el protocolo "${prot.title}"?`)
                              ) {
                                setProtocols((prev) => prev.filter((p) => p.id !== prot.id));
                              }
                            }}
                          >
                            <Trash2 className="w-3 h-3 mr-1" /> Eliminar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Filtros de Auditoría */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-secondary/15 border border-border/80 rounded-2xl animate-fade-in text-foreground">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                        Filtrar por Rol
                      </label>
                      <select
                        value={logFilterRole}
                        onChange={(e) => setLogFilterRole(e.target.value)}
                        className="flex h-9 w-full rounded-xl border border-border bg-background px-3 py-1 text-xs focus-visible:outline-none text-foreground font-semibold"
                      >
                        <option value="all">Todos los Roles</option>
                        <option value="receptionist">🔑 Recepción</option>
                        <option value="coach">💪 Coach / Profesor</option>
                        <option value="manager">👤 Gerente</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                        Filtrar por Personal
                      </label>
                      <select
                        value={logFilterStaff}
                        onChange={(e) => setLogFilterStaff(e.target.value)}
                        className="flex h-9 w-full rounded-xl border border-border bg-background px-3 py-1 text-xs focus-visible:outline-none text-foreground font-semibold"
                      >
                        <option value="all">Todo el Personal</option>
                        {uniqueStaffNames.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                        Filtrar por Fecha
                      </label>
                      <input
                        type="date"
                        value={logFilterDate}
                        onChange={(e) => setLogFilterDate(e.target.value)}
                        className="flex h-9 w-full rounded-xl border border-border bg-background px-3 py-1 text-xs focus-visible:outline-none text-foreground font-semibold"
                      />
                    </div>
                  </div>

                  {/* Tabla de Resultados */}
                  <div className="bg-card border border-border rounded-2xl overflow-hidden animate-fade-in">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse text-foreground">
                        <thead>
                          <tr className="bg-secondary/40 border-b border-border text-muted-foreground font-bold">
                            <th className="p-4">Fecha / Hora</th>
                            <th className="p-4">Protocolo</th>
                            <th className="p-4">Staff Responsable</th>
                            <th className="p-4 text-center">Tareas Verificadas</th>
                            <th className="p-4 text-right">Estado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredLogs.map((log) => (
                            <tr
                              key={log.id}
                              className="border-b border-border last:border-0 hover:bg-secondary/15 transition-colors"
                            >
                              <td className="p-4 font-semibold whitespace-nowrap">
                                {log.date}{" "}
                                <span className="text-muted-foreground font-medium ml-1.5">
                                  {log.time} hs
                                </span>
                              </td>
                              <td className="p-4 font-bold text-sm">{log.protocolTitle}</td>
                              <td className="p-4">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-semibold">{log.staffName}</span>
                                  <Badge
                                    variant="secondary"
                                    className="text-[9px] uppercase font-semibold scale-90"
                                  >
                                    {log.role === "receptionist"
                                      ? "Recepción"
                                      : log.role === "coach"
                                        ? "Coach"
                                        : log.role === "manager"
                                          ? "Gerente"
                                          : log.role}
                                  </Badge>
                                </div>
                              </td>
                              <td className="p-4 text-center font-bold text-primary">
                                {log.itemsCount} tareas
                              </td>
                              <td className="p-4 text-right">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/ text-primary border border-primary/">
                                  ✓ Completado
                                </span>
                              </td>
                            </tr>
                          ))}
                          {filteredLogs.length === 0 && (
                            <tr>
                              <td
                                colSpan={5}
                                className="p-8 text-center text-muted-foreground italic font-medium"
                              >
                                No se encontraron registros que coincidan con los filtros
                                seleccionados.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              <Dialog open={isCreateProtocolOpen} onOpenChange={setIsCreateProtocolOpen}>
                <DialogContent className="max-w-md border border-border bg-card rounded-3xl">
                  <DialogHeader>
                    <DialogTitle className="text-base font-extrabold">
                      {editingProtocol ? "Editar Protocolo" : "Crear Nuevo Protocolo"}
                    </DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newProtocolTitle.trim() || !newProtocolItemsText.trim()) {
                        alert("Por favor completa el título y los ítems del protocolo.");
                        return;
                      }

                      const itemsList = newProtocolItemsText
                        .split("\n")
                        .map((x) => x.trim())
                        .filter(Boolean);

                      if (editingProtocol) {
                        setProtocols((prev) =>
                          prev.map((p) =>
                            p.id === editingProtocol.id
                              ? {
                                  ...p,
                                  title: newProtocolTitle.trim(),
                                  role: newProtocolRole,
                                  time: newProtocolTime,
                                  items: itemsList,
                                }
                              : p,
                          ),
                        );
                      } else {
                        const newProt = {
                          id: Date.now().toString(),
                          title: newProtocolTitle.trim(),
                          role: newProtocolRole,
                          time: newProtocolTime,
                          items: itemsList,
                        };
                        setProtocols((prev) => [...prev, newProt]);
                      }
                      setIsCreateProtocolOpen(false);
                    }}
                    className="space-y-4 pt-2 text-sm text-foreground"
                  >
                    <div className="space-y-1.5">
                      <Label htmlFor="protocol-title" className="font-bold">
                        Título del Protocolo
                      </Label>
                      <Input
                        id="protocol-title"
                        placeholder="Ej: Protocolo de Cierre"
                        value={newProtocolTitle}
                        onChange={(e) => setNewProtocolTitle(e.target.value)}
                        className="rounded-xl"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="protocol-role" className="font-bold">
                          Rol Responsable
                        </Label>
                        <select
                          id="protocol-role"
                          value={newProtocolRole}
                          onChange={(e) => setNewProtocolRole(e.target.value)}
                          className="flex h-9 w-full rounded-xl border border-border bg-background px-3 py-1 text-xs focus-visible:outline-none text-foreground font-semibold"
                        >
                          <option value="receptionist">🔑 Recepcionista</option>
                          <option value="coach">💪 Coach / Profesor</option>
                          <option value="manager">👤 Gerente</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="protocol-time" className="font-bold">
                          Horario / Frecuencia
                        </Label>
                        <Input
                          id="protocol-time"
                          placeholder="Ej: Mañana, Noche, Antes de clases"
                          value={newProtocolTime}
                          onChange={(e) => setNewProtocolTime(e.target.value)}
                          className="rounded-xl font-semibold"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="protocol-items" className="font-bold">
                        Tareas / Ítems (Uno por línea)
                      </Label>
                      <textarea
                        id="protocol-items"
                        rows={5}
                        value={newProtocolItemsText}
                        onChange={(e) => setNewProtocolItemsText(e.target.value)}
                        className="flex w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus-visible:outline-none text-foreground placeholder:text-muted-foreground font-medium"
                        placeholder="Escribe cada tarea en una línea nueva.&#10;Ejemplo:&#10;Controlar aires acondicionados&#10;Verificar caja de cobros&#10;Repasar desinfección de colchonetas&#10;Activar alarma perimetral"
                      />
                    </div>

                    <DialogFooter className="pt-2 gap-2 sm:gap-0">
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-xl font-bold"
                        onClick={() => setIsCreateProtocolOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        className="rounded-xl font-bold text-xs bg-primary text-primary-foreground hover:bg-primary/95"
                      >
                        {editingProtocol ? "Guardar Cambios" : "Crear Protocolo"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
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
      )}
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
                  <div className="pt-3 border-t border-border/40">
                    {c.rating ? (
                      <div className="flex flex-col gap-1.5 p-3 bg-secondary/ border border-border/ rounded-xl">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">
                            Tu Calificación
                          </span>
                          <span className="text-secondary-foreground font-bold text-sm tracking-widest">
                            {Array(5)
                              .fill(0)
                              .map((_, i) => (
                                <span key={i} className={i < c.rating!.stars ? "" : "opacity-20"}>
                                  ★
                                </span>
                              ))}
                          </span>
                        </div>
                        {c.rating.comment && (
                          <p className="text-[11px] text-foreground italic">"{c.rating.comment}"</p>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <span className="text-[11px] font-bold text-foreground">
                          ¿Qué te pareció la clase?
                        </span>
                        <div className="flex justify-between">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => {
                                const comment = prompt(
                                  "¿Querés dejar un comentario opcional para ayudar a mejorar la clase?",
                                );
                                setClassesList((prev) =>
                                  prev.map((item) => {
                                    if (item.id === c.id) {
                                      return {
                                        ...item,
                                        ratings: {
                                          ...(item.ratings || {}),
                                          [currentUser.name]: {
                                            stars: star,
                                            comment: comment || undefined,
                                          },
                                        },
                                      };
                                    }
                                    return item;
                                  }),
                                );

                                setReviewsList((prev) => {
                                  const dateStr = new Date().toISOString().split("T")[0];
                                  const coachName =
                                    c.staffId === "staff-mateo"
                                      ? "Mateo Rossi"
                                      : c.staffId === "staff-elena"
                                        ? "Elena Gómez"
                                        : "Camila Díaz";
                                  const newReview = {
                                    id: `rev-${Date.now()}`,
                                    date: dateStr,
                                    studentName: currentUser.name,
                                    studentPhoto:
                                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80",
                                    rating: star,
                                    className: c.name,
                                    coachName: coachName,
                                    comment: comment || "Excelente clase",
                                    featured: false,
                                    reply: "",
                                  };
                                  return [newReview, ...prev];
                                });
                                alert("¡Muchas gracias por calificar la clase!");
                              }}
                              className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary text-muted-foreground/30 hover:bg-secondary/ hover:text-secondary-foreground transition-colors text-xl"
                            >
                              ★
                            </button>
                          ))}
                        </div>
                        <p className="text-[9px] text-muted-foreground text-center">
                          Toca una estrella para calificar de forma anónima.
                        </p>
                      </div>
                    )}
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
