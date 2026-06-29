import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { 
  Building2, Users, Calendar, CreditCard, Settings, LogOut,
  Bell, CheckCircle2, AlertCircle, Search, Download, 
  MapPin, Clock, Plus, HelpCircle, Activity, Trash2, Check, Edit2, 
  Dumbbell, Image as ImageIcon, FileText, Eye, X, ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard")({
  component: GymDashboard,
});

const TABS = [
  { id: "asistencia", label: "Asistencias", icon: Activity },
  { id: "miembros", label: "Miembros", icon: Users },
  { id: "membresias", label: "Membresías", icon: CreditCard },
  { id: "clases", label: "Clases", icon: Calendar },
  { id: "config", label: "Configuración", icon: Settings },
];

function GymDashboard() {
  const [activeTab, setActiveTab] = useState("asistencia");
  const navigate = useNavigate();

  // STATE LIFTED UP (Models the Firebase data structure in local memory)
  
  // 1. Staff List
  const [staffList, setStaffList] = useState([
    { 
      id: "1", 
      name: "Mateo Rossi", 
      specialty: "Coach de Levantamiento Olímpico", 
      certifications: ["CF-L2", "Coaching de Fuerza"], 
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80",
      certificationImages: [
        "https://images.unsplash.com/photo-1589330694653-ded6df53f7ec?auto=format&fit=crop&w=300&q=80",
        "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=300&q=80"
      ]
    },
    { 
      id: "2", 
      name: "Valeria Soto", 
      specialty: "Profesora de Vinyasa Yoga", 
      certifications: ["RYT-200", "Yoga Terapéutico"], 
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&h=80&q=80",
      certificationImages: [
        "https://images.unsplash.com/photo-1589330694653-ded6df53f7ec?auto=format&fit=crop&w=300&q=80"
      ]
    },
    { 
      id: "3", 
      name: "Daniel Castro", 
      specialty: "Preparador Físico Funcional", 
      certifications: ["Prof. Educación Física", "FMS Level 1"], 
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80",
      certificationImages: []
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
    { id: "kinesiologia", name: "Kinesiología & Fisioterapia", category: "Servicios", checked: false },
    { id: "masajes", name: "Gabinete de Masajes", category: "Servicios", checked: false },
    { id: "towels", name: "Alquiler de Toallas", category: "Servicios", checked: false },
    { id: "merch", name: "Tienda de Indumentaria / Merch", category: "Servicios", checked: false },
    { id: "bike", name: "Bicicletero / Estacionamiento de Bici", category: "Instalaciones", checked: true },
    { id: "water", name: "Dispensador de Agua / Bebedero", category: "Instalaciones", checked: true },
    { id: "supplements", name: "Venta de Suplementos / Bebidas", category: "Servicios", checked: true },
  ]);

  // 3. Expanded Requirements
  const [requirements, setRequirements] = useState([
    { id: "apto", name: "Apto médico obligatorio (Ficha al día)", category: "Documentación", checked: true },
    { id: "toalla", name: "Traer toalla personal obligatoria", category: "Higiene y Vestimenta", checked: true },
    { id: "calzado", name: "Uso de calzado limpio exclusivo para la sala", category: "Higiene y Vestimenta", checked: true },
    { id: "mat", name: "Traer mat de yoga propio", category: "Higiene y Vestimenta", checked: false },
    { id: "indumentaria", name: "Ropa deportiva obligatoria", category: "Higiene y Vestimenta", checked: true },
    { id: "reserva", name: "Reserva de clase con anticipación", category: "Normas de la Sala", checked: true },
    { id: "pesos", name: "Devolver discos y mancuernas a su lugar", category: "Normas de la Sala", checked: true },
    { id: "magnesio", name: "Prohibido el magnesio suelto (solo en bloque/líquido)", category: "Normas de la Sala", checked: false },
    { id: "limpieza", name: "Desinfectar máquinas después de usarlas", category: "Normas de la Sala", checked: true },
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
    { day: "Lunes", intervals: [{ from: "07:00", to: "12:00" }, { from: "14:00", to: "21:00" }] },
    { day: "Martes", intervals: [{ from: "07:00", to: "12:00" }, { from: "14:00", to: "21:00" }] },
    { day: "Miércoles", intervals: [{ from: "07:00", to: "12:00" }, { from: "14:00", to: "21:00" }] },
    { day: "Jueves", intervals: [{ from: "07:00", to: "12:00" }, { from: "14:00", to: "21:00" }] },
    { day: "Viernes", intervals: [{ from: "07:00", to: "12:00" }, { from: "14:00", to: "21:00" }] },
    { day: "Sábado", intervals: [{ from: "08:00", to: "14:00" }] },
    { day: "Domingo", intervals: [] }, // Closed
  ]);

  // 6. Reservation Cancellation Policy State (cancellation limit in hours)
  const [cancellationPolicyHours, setCancellationPolicyHours] = useState(2);

  // 7. Classes List
  const [classesList, setClassesList] = useState([
    { id: "1", name: "CrossFit WOD", staffId: "1", time: "08:00 - 09:00", capacity: 15, booked: 12, enrolled: ["Agustín Gómez", "Marcos López", "Tomás Ruiz"] },
    { id: "2", name: "Yoga Ashtanga", staffId: "2", time: "09:30 - 10:30", capacity: 10, booked: 8, enrolled: ["Paula Cáceres", "Sofía Martínez"] },
    { id: "3", name: "Funcional", staffId: "3", time: "18:00 - 19:00", capacity: 15, booked: 15, enrolled: ["Pedro Giménez", "María del Mar"] },
  ]);

  // 8. Memberships List
  const [membershipsList, setMembershipsList] = useState([
    { id: "1", name: "Pase Libre", price: 18900, duration: "Mensual", activeCount: 142, includedServices: ["vestuarios", "duchas", "lockers", "wifi"] },
    { id: "2", name: "Performance", price: 28500, duration: "Mensual", activeCount: 68, includedServices: ["vestuarios", "duchas", "lockers", "wifi", "parking"] },
    { id: "3", name: "Elite Coached", price: 42000, duration: "Mensual", activeCount: 12, includedServices: ["vestuarios", "duchas", "lockers", "wifi", "parking", "sauna"] },
  ]);

  const handleLogout = () => {
    navigate({ to: "/auth/gym" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-card border-b md:border-b-0 md:border-r border-border p-6 flex flex-col h-auto md:h-screen sticky top-0 z-30">
        <div className="flex items-center gap-2 mb-8 justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground">
              <Building2 className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold tracking-tight">Shakerfy Admin</span>
          </div>
          <button 
            onClick={handleLogout}
            className="md:hidden p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-1.5 flex-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <button 
          onClick={handleLogout}
          className="hidden md:flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition mt-auto"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 w-full max-w-7xl mx-auto">
        {/* Top Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Kraft Strength Club</h1>
            <p className="text-sm text-muted-foreground">Panel de Control de Recepción y Administración.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center relative cursor-pointer">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500" />
            </div>
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Admin" className="h-9 w-9 rounded-full border border-border" />
          </div>
        </header>

        {activeTab === "asistencia" && <AsistenciasTab />}
        {activeTab === "miembros" && <MiembrosTab />}
        {activeTab === "membresias" && (
          <MembresiasTab 
            membershipsList={membershipsList} 
            setMembershipsList={setMembershipsList} 
            amenities={amenities} 
          />
        )}
        {activeTab === "clases" && (
          <ClasesTab 
            classesList={classesList} 
            setClassesList={setClassesList} 
            staffList={staffList} 
          />
        )}
        {activeTab === "config" && (
          <ConfigTab 
            staffList={staffList} 
            setStaffList={setStaffList} 
            amenities={amenities} 
            setAmenities={setAmenities} 
            requirements={requirements} 
            setRequirements={setRequirements} 
            gymPhotos={gymPhotos}
            setGymPhotos={setGymPhotos}
            weeklyHours={weeklyHours}
            setWeeklyHours={setWeeklyHours}
            cancellationPolicyHours={cancellationPolicyHours}
            setCancellationPolicyHours={setCancellationPolicyHours}
          />
        )}
      </main>
    </div>
  );
}

// Subcomponent: Asistencias Tab
function AsistenciasTab() {
  const [historySearch, setHistorySearch] = useState("");
  
  const recentCheckins = [
    { name: "Agustín Gómez", time: "11:24 AM", alert: "Lesión Rodilla", alertColor: "bg-amber-500/10 text-amber-500 border-amber-500/20", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80" },
    { name: "Camila Díaz", time: "11:15 AM", alert: "Pago Pendiente", alertColor: "bg-rose-500/10 text-rose-500 border-rose-500/20", photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80" },
    { name: "Marcos López", time: "10:54 AM", alert: null, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80" },
  ];

  const history = [
    { name: "Agustín Gómez", date: "Hoy", time: "11:24 AM", method: "QR Scan", class: "CrossFit WOD" },
    { name: "Camila Díaz", date: "Hoy", time: "11:15 AM", method: "Recepción", class: "Musculación Libre" },
    { name: "Marcos López", date: "Hoy", time: "10:54 AM", method: "QR Scan", class: "CrossFit WOD" },
    { name: "Sofía Martínez", date: "Ayer", time: "19:10 PM", method: "QR Scan", class: "Yoga Ashtanga" },
  ];

  const handleExport = () => {
    alert("Exportando registros de asistencia a CSV...");
  };

  return (
    <div className="space-y-8">
      {/* Live Feed Header */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm flex items-center justify-between col-span-1">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Aforo Actual</span>
            <div className="text-4xl font-extrabold tracking-tight mt-2">42 <span className="text-lg font-medium text-muted-foreground">/ 80</span></div>
            <p className="text-xs text-muted-foreground mt-1">Capacidad segura al 52%</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        {/* Live Feed Checklist */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm col-span-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Monitor de Entradas Recientes</h3>
          <div className="space-y-4">
            {recentCheckins.map((c, i) => (
              <div key={i} className="flex items-center justify-between pb-3 border-b border-border/50 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <img src={c.photo} alt={c.name} className="h-9 w-9 rounded-full object-cover" />
                  <div>
                    <div className="text-sm font-semibold">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.time}</div>
                  </div>
                </div>
                {c.alert && (
                  <span className={`text-[10px] font-bold uppercase border px-2.5 py-0.5 rounded-full ${c.alertColor}`}>
                    {c.alert}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* History table */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Historial General</h3>
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
            <Button size="sm" variant="outline" className="rounded-xl gap-1.5" onClick={handleExport}>
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
function MiembrosTab() {
  const members = [
    { name: "Agustín Gómez", phone: "+54 9 11 3242-1241", email: "agustin@email.com", plan: "Pase Libre", end: "20-Jul-2026", status: "activo", color: "text-emerald-500 bg-emerald-500/10" },
    { name: "Camila Díaz", phone: "+54 9 11 4124-5124", email: "camila@email.com", plan: "Performance", end: "01-Jul-2026", status: "pendiente", color: "text-amber-500 bg-amber-500/10" },
    { name: "Marcos López", phone: "+54 9 11 2341-2412", email: "marcos@email.com", plan: "Pase Libre", end: "15-Jun-2026", status: "vencido", color: "text-rose-500 bg-rose-500/10" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Administración de Miembros</h2>
          <p className="text-sm text-muted-foreground">Listado general de alumnos registrados en tu gimnasio.</p>
        </div>
        <Button size="sm" className="rounded-xl gap-1.5"><Plus className="h-4 w-4" /> Agregar Miembro</Button>
      </div>

      <div className="overflow-hidden border border-border rounded-2xl bg-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted text-xs font-bold text-muted-foreground border-b border-border">
            <tr>
              <th className="p-4">Nombre</th>
              <th className="p-4">Contacto</th>
              <th className="p-4">Plan Activo</th>
              <th className="p-4">Vencimiento</th>
              <th className="p-4">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {members.map((m, i) => (
              <tr key={i} className="hover:bg-secondary/20 transition">
                <td className="p-4 font-semibold">{m.name}</td>
                <td className="p-4">
                  <div className="text-xs text-foreground">{m.phone}</div>
                  <div className="text-xs text-muted-foreground">{m.email}</div>
                </td>
                <td className="p-4 font-medium text-foreground">{m.plan}</td>
                <td className="p-4 text-muted-foreground">{m.end}</td>
                <td className="p-4">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${m.color}`}>
                    {m.status}
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
  "Karate-Do",
  "Fisioterapia y Kinesiología"
];

function MembresiasTab({ membershipsList, setMembershipsList, amenities }: MembresiasTabProps) {
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

  const activeAmenities = amenities.filter(a => a.checked);

  const toggleService = (id: string) => {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const toggleEditService = (id: string) => {
    setEditSelectedServices(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
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
    };

    setMembershipsList(prev => [...prev, newPlan]);
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
  };

  const handleSaveEditMembership = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    setMembershipsList(prev => prev.map(m => {
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
          includedServices: editSelectedServices
        };
      }
      return m;
    }));

    setEditingPlan(null);
  };

  const handleDeletePlan = () => {
    if (!deletingPlan) return;
    if (deleteConfirmText !== "ELIMINAR") return;
    setMembershipsList(prev => prev.filter(x => x.id !== deletingPlan.id));
    setDeletingPlan(null);
    setDeleteConfirmText("");
  };

  const filteredActivities = searchActivity.trim() === ""
    ? []
    : FITNESS_ACTIVITIES.filter(act => 
        act.toLowerCase().includes(searchActivity.toLowerCase()) && 
        !includedActivities.includes(act)
      );

  const editFilteredActivities = editSearchActivity.trim() === ""
    ? []
    : FITNESS_ACTIVITIES.filter(act => 
        act.toLowerCase().includes(editSearchActivity.toLowerCase()) && 
        !editIncludedActivities.includes(act)
      );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Planes de Membresía</h2>
          <p className="text-sm text-muted-foreground">Tarifas y selección de amenities incluidos en cada plan.</p>
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
        <form onSubmit={handleAddMembership} className="rounded-3xl border border-border bg-card p-6 shadow-sm max-w-xl space-y-4 animate-fade-up">
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
              <label className="text-xs font-semibold text-muted-foreground">Original/Tachado ($)</label>
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
              <label className="text-xs font-semibold text-muted-foreground block">Periodicidad del Cobro</label>
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
              <label className="text-xs font-semibold text-muted-foreground block">Etiqueta/Categoría del Plan</label>
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
              <label className="text-xs font-semibold text-muted-foreground block">Tipo de Acceso</label>
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
                <label className="text-xs font-semibold text-muted-foreground">Créditos/Clases Incluidas</label>
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
              <label className="text-xs font-semibold text-muted-foreground block">Horario de Acceso</label>
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

          {/* Activities Multi-select Search Box */}
          <div className="space-y-2 border-t border-border/40 pt-3 relative">
            <label className="text-xs font-semibold text-muted-foreground block">Actividades Incluidas</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {includedActivities.map((act) => (
                <span key={act} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {act}
                  <button type="button" onClick={() => setIncludedActivities(prev => prev.filter(x => x !== act))} className="hover:text-foreground">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {includedActivities.length === 0 && (
                <span className="text-xs text-muted-foreground italic">Todas las actividades del centro incluidas por defecto.</span>
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
              <div className="absolute left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg max-h-48 overflow-y-auto z-10 p-1 space-y-0.5">
                {filteredActivities.map((act) => (
                  <button
                    type="button"
                    key={act}
                    onClick={() => {
                      setIncludedActivities(prev => [...prev, act]);
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
            <label className="text-xs font-semibold text-muted-foreground block">Amenities y Servicios Incluidos</label>
            {activeAmenities.length === 0 ? (
              <p className="text-xs text-muted-foreground">No tienes amenities activos en la pestaña de Configuración.</p>
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

          <Button type="submit" className="rounded-xl">Crear Plan</Button>
        </form>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {membershipsList.map((m, i) => (
          <div key={m.id} className="rounded-3xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between hover:border-foreground/20 transition">
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
              </div>

              {/* Included Activities badges */}
              {m.includedActivities && m.includedActivities.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {m.includedActivities.map((act) => (
                    <span key={act} className="text-[9.5px] bg-secondary text-secondary-foreground px-2.5 py-0.5 rounded-full font-medium">
                      {act}
                    </span>
                  ))}
                </div>
              )}
              
              <ul className="mt-4 space-y-2 border-t border-border/60 pt-3">
                {m.includedServices.map((serviceId) => {
                  const serviceName = amenities.find(a => a.id === serviceId)?.name || serviceId;
                  return (
                    <li key={serviceId} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> {serviceName}
                    </li>
                  );
                })}
                {m.includedServices.length === 0 && (
                  <li className="text-xs text-muted-foreground italic">Sin amenities especiales incluidos.</li>
                )}
              </ul>
            </div>
            
            <div className="space-y-4 mt-6">
              <div className="border-t border-border/60 pt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>Miembros activos:</span>
                <span className="font-bold text-foreground bg-secondary px-2.5 py-0.5 rounded-full">{m.activeCount}</span>
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
                      alert(`No se puede eliminar el plan "${m.name}" porque tiene ${m.activeCount} alumnos activos. Debes migrarlos a otro plan antes de poder eliminarlo.`);
                    } else {
                      setDeletingPlan(m);
                      setDeleteConfirmText("");
                    }
                  }}
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500 hover:text-white text-xs text-rose-500 font-semibold flex-1 transition"
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
            className="relative bg-card border border-border w-full max-w-xl rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
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
                <label className="text-xs font-semibold text-muted-foreground">Nombre del Plan</label>
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
                <label className="text-xs font-semibold text-muted-foreground">Original/Tachado ($)</label>
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
                <label className="text-xs font-semibold text-muted-foreground block">Periodicidad del Cobro</label>
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
                <label className="text-xs font-semibold text-muted-foreground block">Etiqueta/Categoría del Plan</label>
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
                <label className="text-xs font-semibold text-muted-foreground block">Tipo de Acceso</label>
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
                  <label className="text-xs font-semibold text-muted-foreground">Créditos/Clases Incluidas</label>
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
                <label className="text-xs font-semibold text-muted-foreground block">Horario de Acceso</label>
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

            {/* Activities Multi-select Search Box */}
            <div className="space-y-2 border-t border-border/40 pt-3 relative">
              <label className="text-xs font-semibold text-muted-foreground block">Actividades Incluidas</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {editIncludedActivities.map((act) => (
                  <span key={act} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {act}
                    <button type="button" onClick={() => setEditIncludedActivities(prev => prev.filter(x => x !== act))} className="hover:text-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {editIncludedActivities.length === 0 && (
                  <span className="text-xs text-muted-foreground italic">Todas las actividades del centro incluidas por defecto.</span>
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
                <div className="absolute left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg max-h-48 overflow-y-auto z-10 p-1 space-y-0.5">
                  {editFilteredActivities.map((act) => (
                    <button
                      type="button"
                      key={act}
                      onClick={() => {
                        setEditIncludedActivities(prev => [...prev, act]);
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
              <label className="text-xs font-semibold text-muted-foreground block">Amenities y Servicios Incluidos</label>
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
              <Button type="submit" className="rounded-xl flex-1">Guardar Cambios</Button>
              <Button type="button" variant="outline" className="rounded-xl flex-1" onClick={() => setEditingPlan(null)}>Cancelar</Button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Membership Modal */}
      {deletingPlan && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-fade-in text-foreground">
          <div className="relative bg-card border border-border w-full max-w-[420px] rounded-3xl p-6 shadow-2xl text-center flex flex-col items-center">
            <button 
              onClick={() => setDeletingPlan(null)}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-secondary transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="h-12 w-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4">
              <ShieldAlert className="h-6 w-6" />
            </div>

            <h3 className="text-lg font-bold tracking-tight text-foreground">¿Eliminar Plan de Membresía?</h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Esta acción es irreversible. Para confirmar la eliminación definitiva del plan <strong>"{deletingPlan.name}"</strong>, escribe la palabra clave en mayúsculas a continuación:
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
                  className="rounded-xl flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
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
  classesList: { id: string; name: string; staffId: string; time: string; capacity: number; booked: number; enrolled: string[] }[];
  setClassesList: React.Dispatch<React.SetStateAction<{ id: string; name: string; staffId: string; time: string; capacity: number; booked: number; enrolled: string[] }[]>>;
  staffList: { id: string; name: string; specialty: string; certifications: string[]; photo: string }[];
}

function ClasesTab({ classesList, setClassesList, staffList }: ClasesTabProps) {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [staffId, setStaffId] = useState("");
  const [time, setTime] = useState("");
  const [capacity, setCapacity] = useState("15");

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !staffId || !time) return;

    const newClass = {
      id: Math.random().toString(),
      name,
      staffId,
      time,
      capacity: parseInt(capacity),
      booked: 0,
      enrolled: [],
    };

    setClassesList(prev => [...prev, newClass]);
    setName("");
    setStaffId("");
    setTime("");
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Calendario de Clases</h2>
          <p className="text-sm text-muted-foreground">Clases planificadas vinculando los entrenadores de tu Staff.</p>
        </div>
        <Button 
          size="sm" 
          className="rounded-xl gap-1.5" 
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus className="h-4 w-4" /> {showAddForm ? "Cancelar" : "Nueva Clase"}
        </Button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddClass} className="rounded-3xl border border-border bg-card p-6 shadow-sm max-w-xl space-y-4 animate-fade-up">
          <h3 className="text-sm font-bold text-muted-foreground uppercase">Crear Nueva Clase</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Nombre de Clase / Disciplina</label>
              <input 
                type="text" 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="CrossFit WOD"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Horario (ej: 19:00 - 20:00)</label>
              <input 
                type="text" 
                required 
                value={time} 
                onChange={(e) => setTime(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="19:00 - 20:00"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Instructor de Staff</label>
              <select
                required
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Selecciona un entrenador...</option>
                {staffList.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.specialty})</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Cupos Totales</label>
              <input 
                type="number" 
                required 
                value={capacity} 
                onChange={(e) => setCapacity(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>

          <Button type="submit" className="rounded-xl">Programar Clase</Button>
        </form>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Side: Schedule */}
        <div className="col-span-2 space-y-4">
          <div className="rounded-2xl border border-border bg-card p-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase mb-4">Hoy</h3>
            <div className="space-y-3">
              {classesList.map((c) => {
                const instructorName = staffList.find(s => s.id === c.staffId)?.name || "Sin asignar";
                return (
                  <div 
                    key={c.id} 
                    onClick={() => setSelectedClass(c.id)}
                    className={`p-4 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                      selectedClass === c.id 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-foreground/20"
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-sm">{c.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{instructorName} · {c.time} hs</p>
                    </div>
                    <span className="text-xs font-semibold bg-secondary px-2.5 py-1 rounded-full text-foreground">
                      {c.booked} / {c.capacity} cupos
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Enrolled members */}
        <div className="col-span-1">
          <div className="rounded-2xl border border-border bg-card p-4 h-full min-h-[300px] flex flex-col">
            <h3 className="text-xs font-bold text-muted-foreground uppercase mb-4">Alumnos Inscritos</h3>
            {selectedClass ? (
              <ul className="space-y-3 flex-1">
                {classesList.find(c => c.id === selectedClass)?.enrolled.map((name, idx) => (
                  <li key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/40 text-xs font-semibold">
                    <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px]">
                      {name[0]}
                    </div>
                    {name}
                  </li>
                ))}
                {(classesList.find(c => c.id === selectedClass)?.enrolled.length === 0) && (
                  <div className="flex-1 flex items-center justify-center text-center text-xs text-muted-foreground p-4">
                    Ningún alumno inscrito todavía.
                  </div>
                )}
              </ul>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
                <HelpCircle className="h-8 w-8 mb-2" />
                <p className="text-xs">Haz clic en una clase de la agenda para ver los alumnos agendados en ese horario.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Subcomponent: Config Tab
interface ConfigTabProps {
  staffList: { id: string; name: string; specialty: string; certifications: string[]; photo: string; certificationImages?: string[] }[];
  setStaffList: React.Dispatch<React.SetStateAction<{ id: string; name: string; specialty: string; certifications: string[]; photo: string; certificationImages?: string[] }[]>>;
  amenities: { id: string; name: string; category: string; checked: boolean }[];
  setAmenities: React.Dispatch<React.SetStateAction<{ id: string; name: string; category: string; checked: boolean }[]>>;
  requirements: { id: string; name: string; category: string; checked: boolean }[];
  setRequirements: React.Dispatch<React.SetStateAction<{ id: string; name: string; category: string; checked: boolean }[]>>;
  gymPhotos: string[];
  setGymPhotos: React.Dispatch<React.SetStateAction<string[]>>;
  weeklyHours: { day: string; intervals: { from: string; to: string }[] }[];
  setWeeklyHours: React.Dispatch<React.SetStateAction<{ day: string; intervals: { from: string; to: string }[] }[]>>;
  cancellationPolicyHours: number;
  setCancellationPolicyHours: (v: number) => void;
}

function ConfigTab({ 
  staffList, setStaffList, 
  amenities, setAmenities, 
  requirements, setRequirements,
  gymPhotos, setGymPhotos,
  weeklyHours, setWeeklyHours,
  cancellationPolicyHours, setCancellationPolicyHours
}: ConfigTabProps) {
  const [subTab, setSubTab] = useState("basico");

  // Local states
  const [activeCertificationsViewer, setActiveCertificationsViewer] = useState<string[] | null>(null);
  const [staffName, setStaffName] = useState("");
  const [staffSpecialty, setStaffSpecialty] = useState("");
  const [staffCerts, setStaffCerts] = useState("");
  const [staffAvatarUrl, setStaffAvatarUrl] = useState<string | null>(null);
  const [staffDiplomas, setStaffDiplomas] = useState<string[]>([]);
  const [instagram, setInstagram] = useState("kraft.strength");
  const [tiktok, setTiktok] = useState("kraft.strength");
  const [whatsapp, setWhatsapp] = useState("5491132421241");

  // Refs
  const gymFileRef = useRef<HTMLInputElement>(null);
  const coachAvatarRef = useRef<HTMLInputElement>(null);
  const coachCertsRef = useRef<HTMLInputElement>(null);

  // Gym Photos
  const handleGymPhotosUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    const objectUrls = filesArray.map(file => URL.createObjectURL(file));
    setGymPhotos(prev => [...prev, ...objectUrls]);
  };

  const handleRemoveGymPhoto = (index: number) => {
    setGymPhotos(prev => prev.filter((_, idx) => idx !== index));
  };

  // 7-Day Split Hours Handlers
  const handleAddHourInterval = (dayIndex: number) => {
    setWeeklyHours(prev => {
      const copy = [...prev];
      copy[dayIndex] = {
        ...copy[dayIndex],
        intervals: [...copy[dayIndex].intervals, { from: "09:00", to: "13:00" }]
      };
      return copy;
    });
  };

  const handleRemoveHourInterval = (dayIndex: number, intervalIndex: number) => {
    setWeeklyHours(prev => {
      const copy = [...prev];
      copy[dayIndex] = {
        ...copy[dayIndex],
        intervals: copy[dayIndex].intervals.filter((_, idx) => idx !== intervalIndex)
      };
      return copy;
    });
  };

  const handleUpdateHourInterval = (dayIndex: number, intervalIndex: number, field: "from" | "to", value: string) => {
    setWeeklyHours(prev => {
      const copy = [...prev];
      const intervals = [...copy[dayIndex].intervals];
      intervals[intervalIndex] = {
        ...intervals[intervalIndex],
        [field]: value
      };
      copy[dayIndex] = {
        ...copy[dayIndex],
        intervals
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
      const objectUrls = filesArray.map(file => URL.createObjectURL(file));
      setStaffDiplomas(prev => [...prev, ...objectUrls]);
    }
  };

  const handleRemoveDiplomaPreview = (index: number) => {
    setStaffDiplomas(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName || !staffSpecialty) return;

    const newStaff = {
      id: Math.random().toString(),
      name: staffName,
      specialty: staffSpecialty,
      certifications: staffCerts.split(",").map(c => c.trim()).filter(c => c),
      photo: staffAvatarUrl || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=150&q=80",
      certificationImages: staffDiplomas,
    };

    setStaffList(prev => [...prev, newStaff]);
    setStaffName("");
    setStaffSpecialty("");
    setStaffCerts("");
    setStaffAvatarUrl(null);
    setStaffDiplomas([]);
  };

  const handleRemoveStaff = (id: string) => {
    setStaffList(prev => prev.filter(s => s.id !== id));
  };

  const handleToggleAmenity = (id: string) => {
    setAmenities(prev => prev.map(a => a.id === id ? { ...a, checked: !a.checked } : a));
  };

  const handleToggleRequirement = (id: string) => {
    setRequirements(prev => prev.map(r => r.id === id ? { ...r, checked: !r.checked } : r));
  };

  const amenityCategories = Array.from(new Set(amenities.map(a => a.category)));
  const requirementCategories = Array.from(new Set(requirements.map(r => r.category)));

  return (
    <div className="space-y-6">
      {/* Sub tabs navigation */}
      <div className="border-b border-border flex gap-4 pb-0 overflow-x-auto">
        {[
          { id: "basico", label: "Ficha Básica" },
          { id: "politicas", label: "Políticas" },
          { id: "amenities", label: "Amenities & Servicios" },
          { id: "requisitos", label: "Normas de Ingreso" },
          { id: "staff", label: "Equipo (Staff)" },
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

      {/* Subtab 1: Basic Config & 7-Day Scheduler */}
      {subTab === "basico" && (
        <div className="space-y-6 max-w-3xl">
          {/* Photos */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-sm">Galería de Fotos</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Sube imágenes de tu centro.</p>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="rounded-xl gap-1.5"
                onClick={() => gymFileRef.current?.click()}
              >
                <Plus className="h-4 w-4" /> Subir Fotos
              </Button>
              <input type="file" multiple accept="image/*" ref={gymFileRef} onChange={handleGymPhotosUpload} className="hidden" />
            </div>

            <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
              {gymPhotos.map((photo, index) => (
                <div key={index} className="relative aspect-video rounded-xl overflow-hidden border border-border group">
                  <img src={photo} alt={`Gym ${index}`} className="h-full w-full object-cover" />
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
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-sm">Horarios Semanales (7 Días)</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Configura individualmente cada día, soportando horarios cortados/partidos.</p>
            </div>
            
            <div className="space-y-4 divide-y divide-border/60">
              {weeklyHours.map((dayHour, dayIdx) => (
                <div key={dayHour.day} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-3 first:pt-0">
                  <div className="w-24 text-sm font-bold text-foreground">{dayHour.day}</div>
                  
                  <div className="flex-1 space-y-2">
                    {dayHour.intervals.map((interval, intervalIdx) => (
                      <div key={intervalIdx} className="flex items-center gap-2">
                        <input 
                          type="time" 
                          value={interval.from}
                          onChange={(e) => handleUpdateHourInterval(dayIdx, intervalIdx, "from", e.target.value)}
                          className="px-2 py-1 rounded-lg border border-border bg-background text-xs focus-visible:outline-none"
                        />
                        <span className="text-xs text-muted-foreground">a</span>
                        <input 
                          type="time" 
                          value={interval.to}
                          onChange={(e) => handleUpdateHourInterval(dayIdx, intervalIdx, "to", e.target.value)}
                          className="px-2 py-1 rounded-lg border border-border bg-background text-xs focus-visible:outline-none"
                        />
                        <button 
                          type="button" 
                          onClick={() => handleRemoveHourInterval(dayIdx, intervalIdx)}
                          className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                    {dayHour.intervals.length === 0 && (
                      <span className="text-xs text-muted-foreground italic bg-secondary/40 px-2.5 py-1 rounded-md inline-block">Cerrado</span>
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

          <div className="space-y-6 max-w-2xl bg-card border border-border p-6 rounded-3xl shadow-sm">
            <h3 className="font-bold text-sm">Ficha Básica</h3>
            <form className="space-y-4 text-sm" onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Nombre Comercial</label>
                  <input type="text" className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" defaultValue="Kraft Strength Club" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Dirección Física</label>
                  <input type="text" className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" defaultValue="Av. Santa Fe 3421, Palermo, CABA" />
                </div>
              </div>

              {/* Social Media Inputs */}
              <div className="grid gap-4 sm:grid-cols-3 border-t border-border/60 pt-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Instagram (Usuario)</label>
                  <input 
                    type="text" 
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none" 
                    placeholder="kraft.strength" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">TikTok (Usuario)</label>
                  <input 
                    type="text" 
                    value={tiktok}
                    onChange={(e) => setTiktok(e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none" 
                    placeholder="kraft.strength" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">WhatsApp (Número)</label>
                  <input 
                    type="text" 
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none" 
                    placeholder="5491132421241" 
                  />
                </div>
              </div>

              <Button type="button" className="rounded-xl" onClick={() => alert("Ficha básica y redes sociales actualizadas correctamente.")}>
                Guardar Cambios
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Subtab 2: Reservation & Cancellation Policies */}
      {subTab === "politicas" && (
        <div className="space-y-6 max-w-2xl bg-card border border-border p-6 rounded-3xl shadow-sm">
          <div>
            <h3 className="font-bold text-sm flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-primary" /> Políticas de Reservas
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Define los límites y restricciones para cancelaciones por parte de los alumnos.</p>
          </div>
          
          <div className="space-y-4 text-sm">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground block">Tiempo límite de cancelación anticipada (Horas)</label>
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
                  Los alumnos sólo podrán cancelar la clase hasta {cancellationPolicyHours} horas antes del inicio sin penalización.
                </span>
              </div>
            </div>

            <Button type="button" className="rounded-xl" onClick={() => alert("Políticas actualizadas correctamente en base de datos.")}>
              Guardar Políticas
            </Button>
          </div>
        </div>
      )}

      {/* Subtab 3: Amenities */}
      {subTab === "amenities" && (
        <div className="space-y-6 max-w-3xl bg-card border border-border p-6 rounded-3xl shadow-sm">
          <div>
            <h3 className="font-bold text-sm">Amenities y Servicios Adicionales</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Define los servicios de infraestructura que ofrece tu centro.</p>
          </div>
          
          <div className="space-y-6">
            {amenityCategories.map((category) => (
              <div key={category} className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-1.5">{category}</h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  {amenities.filter(a => a.category === category).map((a) => (
                    <div key={a.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/20 hover:bg-secondary/40 transition">
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

      {/* Subtab 4: Requirements */}
      {subTab === "requisitos" && (
        <div className="space-y-6 max-w-3xl bg-card border border-border p-6 rounded-3xl shadow-sm">
          <div>
            <h3 className="font-bold text-sm">Normas y Requisitos de Ingreso</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Controla las exigencias de higiene y documentación.</p>
          </div>

          <div className="space-y-6">
            {requirementCategories.map((category) => (
              <div key={category} className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-1.5">{category}</h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  {requirements.filter(r => r.category === category).map((r) => (
                    <div key={r.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/20 hover:bg-secondary/40 transition">
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
          <form onSubmit={handleAddStaff} className="rounded-3xl border border-border bg-card p-6 shadow-sm max-w-2xl space-y-4">
            <h3 className="text-sm font-bold text-muted-foreground uppercase">Añadir Profesor / Coach</h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Nombre y Apellido</label>
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
                <label className="text-xs font-semibold text-muted-foreground">Especialidad / Cargo</label>
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
              <label className="text-xs font-semibold text-muted-foreground">Certificaciones y Títulos (separados por comas)</label>
              <input 
                type="text" 
                value={staffCerts} 
                onChange={(e) => setStaffCerts(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
                placeholder="CF-L1, Prof. Educación Física, Guardavidas"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground block">Foto de Perfil</label>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full overflow-hidden border border-border bg-muted flex items-center justify-center shrink-0">
                    {staffAvatarUrl ? (
                      <img src={staffAvatarUrl} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      <Users className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <Button type="button" size="sm" variant="outline" className="rounded-xl" onClick={() => coachAvatarRef.current?.click()}>
                    Subir Foto
                  </Button>
                  <input type="file" accept="image/*" ref={coachAvatarRef} onChange={handleCoachAvatarUpload} className="hidden" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground block">Adjuntar Diplomas / Certificaciones</label>
                <div className="flex items-center gap-3">
                  <Button type="button" size="sm" variant="outline" className="rounded-xl gap-1.5" onClick={() => coachCertsRef.current?.click()}>
                    <Plus className="h-4 w-4" /> Subir Certificados
                  </Button>
                  <input type="file" multiple accept="image/*" ref={coachCertsRef} onChange={handleCoachDiplomasUpload} className="hidden" />
                </div>
              </div>
            </div>

            {staffDiplomas.length > 0 && (
              <div className="space-y-1.5 border-t border-border/60 pt-3">
                <label className="text-xs font-semibold text-muted-foreground block">Diplomas Adjuntos ({staffDiplomas.length})</label>
                <div className="flex flex-wrap gap-2">
                  {staffDiplomas.map((url, index) => (
                    <div key={index} className="relative h-12 w-16 rounded-lg overflow-hidden border border-border group">
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

            <Button type="submit" className="rounded-xl">Añadir al Staff</Button>
          </form>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-bold text-muted-foreground uppercase mb-4">Equipo Registrado</h3>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {staffList.map((s) => (
                <div key={s.id} className="relative p-4 border border-border rounded-2xl bg-secondary/10 flex flex-col justify-between min-h-[140px]">
                  <button 
                    onClick={() => handleRemoveStaff(s.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-rose-500/10 text-rose-500 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <div className="flex items-center gap-3">
                    <img src={s.photo} alt={s.name} className="h-12 w-12 rounded-full object-cover border border-border shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-foreground truncate">{s.name}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{s.specialty}</div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {s.certifications.map((c) => (
                          <span key={c} className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {s.certificationImages && s.certificationImages.length > 0 && (
                    <button 
                      onClick={() => setActiveCertificationsViewer(s.certificationImages || [])}
                      className="mt-3 text-[10px] font-bold text-primary hover:underline self-start flex items-center gap-1"
                    >
                      <Eye className="h-3 w-3" /> Ver Certificados ({s.certificationImages.length})
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
          <div className="relative bg-card border border-border w-full max-w-[600px] rounded-3xl p-6 shadow-2xl flex flex-col">
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
                <div key={index} className="border border-border rounded-xl overflow-hidden aspect-video bg-muted relative group">
                  <img src={url} alt={`Diploma ${index}`} className="h-full w-full object-cover" />
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
    </div>
  );
}
