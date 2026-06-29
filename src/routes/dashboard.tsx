import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useMemo, useEffect } from "react";
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

type UserRole = "superadmin" | "manager" | "receptionist" | "coach";
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
    role: "superadmin"
  });

  // STATE LIFTED UP (Models the Firebase data structure in local memory)
  
  // 1. Staff List
  const [staffList, setStaffList] = useState<{ 
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
  }[]>([
    { 
      id: "1", 
      name: "Mateo Rossi", 
      specialty: "Coach de Levantamiento Olímpico", 
      certifications: ["CF-L2", "Coaching de Fuerza"], 
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80",
      certificationImages: [
        "https://images.unsplash.com/photo-1589330694653-ded6df53f7ec?auto=format&fit=crop&w=300&q=80",
        "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=300&q=80"
      ],
      role: "coach",
      branchId: undefined,
      linkingCode: null,
      status: "linked",
      availability: [
        { day: "Lunes", hours: "08:00 - 12:00" },
        { day: "Miércoles", hours: "08:00 - 12:00" },
        { day: "Viernes", hours: "08:00 - 12:00" }
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
      ],
      role: "coach",
      branchId: undefined,
      linkingCode: "7821",
      status: "pending",
      availability: [
        { day: "Martes", hours: "09:00 - 15:00" },
        { day: "Jueves", hours: "09:00 - 15:00" }
      ]
    },
    { 
      id: "3", 
      name: "Daniel Castro", 
      specialty: "Preparador Físico Funcional", 
      certifications: ["Prof. Educación Física", "FMS Level 1"], 
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80",
      certificationImages: [],
      role: "manager",
      branchId: "1",
      linkingCode: "4310",
      status: "pending",
      availability: [
        { day: "Lunes", hours: "14:00 - 20:00" },
        { day: "Viernes", hours: "14:00 - 20:00" }
      ]
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

  // 7. Branches / Sedes list
  const [branchesList, setBranchesList] = useState<{ id: string; name: string; address: string; manager?: string; lat?: number; lng?: number; creditCostMultiplier?: number }[]>([
    { id: "1", name: "Sede Belgrano", address: "Av. Cabildo 1820, Belgrano, CABA", manager: "Marcos Pérez", lat: -34.5612, lng: -58.4568, creditCostMultiplier: 1.0 },
    { id: "2", name: "Sede Las Cañitas", address: "Ortega y Gasset 1520, Las Cañitas, CABA", manager: "Sofía Rodríguez", lat: -34.5715, lng: -58.4352, creditCostMultiplier: 1.2 }
  ]);
  const [selectedBranchId, setSelectedBranchId] = useState("all");

  // 7. Classes List
  const [classesList, setClassesList] = useState([
    { id: "1", name: "CrossFit WOD", staffId: "1", time: "08:00 - 09:00", capacity: 15, booked: 12, enrolled: ["Agustín Gómez", "Marcos López", "Tomás Ruiz"], branchId: "1" },
    { id: "2", name: "Yoga Ashtanga", staffId: "2", time: "09:30 - 10:30", capacity: 10, booked: 8, enrolled: ["Paula Cáceres", "Sofía Martínez"], branchId: "2" },
    { id: "3", name: "Funcional", staffId: "3", time: "18:00 - 19:00", capacity: 15, booked: 15, enrolled: ["Pedro Giménez", "María del Mar"], branchId: undefined },
  ]);

  // 8. Memberships List
  const [membershipsList, setMembershipsList] = useState([
    { id: "1", name: "Pase Libre", price: 18900, duration: "Mensual", activeCount: 142, includedServices: ["vestuarios", "duchas", "lockers", "wifi"] },
    { id: "2", name: "Performance", price: 28500, duration: "Mensual", activeCount: 68, includedServices: ["vestuarios", "duchas", "lockers", "wifi", "parking"] },
    { id: "3", name: "Elite Coached", price: 42000, duration: "Mensual", activeCount: 12, includedServices: ["vestuarios", "duchas", "lockers", "wifi", "parking", "sauna"] },
  ]);

  // 9. Blackout Days (Días de Cierre)
  const [blackoutDays, setBlackoutDays] = useState<{ id: string; date: string; reason: string }[]>([
    { id: "1", date: "2026-06-29", reason: "Feriado Nacional (Día de Prueba)" }
  ]);

  // 10. No-Show & Late Cancel Penalties State
  const [penaltySettings, setPenaltySettings] = useState({
    enabled: true,
    type: "deduct_credit", // "deduct_credit" | "block_reservations"
    maxAbsences: 2,
  });

  const [otpInput, setOtpInput] = useState("");

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

  const visibleClasses = useMemo(() => {
    let list = classesList;
    if (currentUser.role === "coach" && currentUser.staffId) {
      list = list.filter(c => c.staffId === currentUser.staffId);
    }
    if (selectedBranchId === "all") return list;
    if (selectedBranchId === "matriz") return list.filter(c => !c.branchId);
    return list.filter(c => c.branchId === selectedBranchId);
  }, [classesList, selectedBranchId, currentUser]);

  const visibleTabs = useMemo(() => {
    return TABS.filter(tab => {
      if (currentUser.role === "coach") {
        return tab.id === "clases";
      }
      if (currentUser.role === "manager" || currentUser.role === "receptionist") {
        return tab.id !== "config" && tab.id !== "membresias";
      }
      return true;
    });
  }, [currentUser]);

  const handleLinkStaffByOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput) return;

    // Find staff with that code and status pending
    const match = staffList.find(s => s.linkingCode === otpInput && s.status === "pending");
    if (match) {
      // Consume OTP (set linkingCode to null) and set status to linked
      setStaffList(prev => prev.map(s => s.id === match.id ? { ...s, status: "linked", linkingCode: null } : s));
      // Log in as that staff member
      setCurrentUser({
        name: `${match.name} (${match.role === "manager" ? "Gerente" : match.role === "receptionist" ? "Recepción" : "Coach"})`,
        role: (match.role || "coach") as any,
        branchId: match.branchId,
        staffId: match.id
      });
      setOtpInput("");
      alert(`🎉 ¡Dispositivo vinculado con éxito para ${match.name}! El código de un solo uso ha sido consumido.`);
    } else {
      alert("❌ Código OTP incorrecto, ya utilizado o no asignado a ningún empleado pendiente.");
    }
  };

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
          {visibleTabs.map((tab) => {
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
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              disabled={currentUser.role !== "superadmin" && currentUser.role !== "coach"}
              className="h-9 rounded-xl border border-border bg-card px-3 text-xs font-semibold focus-visible:outline-none cursor-pointer hover:bg-secondary/40 transition shadow-sm text-foreground disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <option value="all">Sedes: Consolidado (Todas)</option>
              <option value="matriz">Sede Principal (Palermo)</option>
              {branchesList.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>

            <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center relative cursor-pointer">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500" />
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-foreground">{currentUser.name}</div>
                <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">
                  {currentUser.role === "superadmin" ? "👑 Global HQ" : currentUser.role === "manager" ? "👤 Gerente" : currentUser.role === "receptionist" ? "🔑 Recepción" : "💪 Coach"}
                </div>
              </div>
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Admin" className="h-9 w-9 rounded-full border border-border" />
            </div>
          </div>
        </header>

        {activeTab === "asistencia" && <AsistenciasTab selectedBranchId={selectedBranchId} blackoutDays={blackoutDays} />}
        {activeTab === "miembros" && <MiembrosTab />}
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
            canManageClasses={currentUser.role === "superadmin" || currentUser.role === "manager"}
            blackoutDays={blackoutDays}
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
            branchesList={branchesList}
            setBranchesList={setBranchesList}
            blackoutDays={blackoutDays}
            setBlackoutDays={setBlackoutDays}
            penaltySettings={penaltySettings}
            setPenaltySettings={setPenaltySettings}
          />
        )}
      </main>

      {/* Floating Role Simulator for testing permissions */}
      <div className="fixed bottom-4 right-4 bg-card border border-border shadow-2xl p-3.5 rounded-2xl z-50 max-w-sm flex flex-col gap-2 animate-fade-in text-foreground">
        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          Simulador de Permisos (RBAC)
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-muted-foreground font-semibold">Seleccionar Rol Simulado:</label>
          <select
            value={`${currentUser.role}-${currentUser.branchId || ""}-${currentUser.staffId || ""}`}
            onChange={(e) => {
              const [role, branchId, staffId] = e.target.value.split("-");
              if (role === "superadmin") {
                setCurrentUser({ name: "Alan Kraft (SuperAdmin)", role: "superadmin" });
              } else if (role === "manager") {
                setCurrentUser({ name: "Marcos Pérez (Gerente)", role: "manager", branchId: branchId || undefined });
              } else if (role === "receptionist") {
                setCurrentUser({ name: "Camila Díaz (Recepción)", role: "receptionist", branchId: branchId || undefined });
              } else if (role === "coach") {
                setCurrentUser({ name: "Mateo Rossi (Coach)", role: "coach", staffId: staffId || undefined });
              }
            }}
            className="h-8 rounded-lg border border-border bg-background px-2 text-xs font-semibold cursor-pointer focus-visible:outline-none"
          >
            <option value="superadmin--">Alan Kraft (👑 HQ SuperAdmin)</option>
            <option value="manager-1-">Marcos Pérez (👤 Gerente - Sede Belgrano)</option>
            <option value="receptionist-2-">Camila Díaz (🔑 Recepcionista - Sede Las Cañitas)</option>
            <option value="coach--1">Mateo Rossi (💪 Coach / Profesor)</option>
          </select>
        </div>

        {/* OTP Linkage Form */}
        <form onSubmit={handleLinkStaffByOtp} className="border-t border-border/40 pt-2 flex flex-col gap-1.5">
          <label className="text-[10px] text-muted-foreground font-semibold">📲 Vincular App Staff (Código 4-dig):</label>
          <div className="flex gap-1.5">
            <input 
              type="text"
              maxLength={4}
              placeholder="Ej: 7821"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
              className="h-7 w-24 rounded-lg border border-border bg-background px-2 text-xs font-mono text-center focus-visible:outline-none text-foreground"
            />
            <Button type="submit" size="sm" className="h-7 rounded-lg text-[10px] py-0 px-3 font-bold">
              Vincular
            </Button>
          </div>
        </form>

        <p className="text-[9px] text-muted-foreground leading-relaxed mt-0.5">
          {currentUser.role === "superadmin" && "Permisos globales HQ. Puede ver todo, cambiar de sede libremente y editar la configuración y membresías."}
          {currentUser.role === "manager" && "Permisos limitados a Sede Belgrano. No puede acceder a pestañas de Membresías ni Configuración Global."}
          {currentUser.role === "receptionist" && "Permisos limitados a Sede Las Cañitas. Solo gestiona la lista de asistencia de la sucursal asignada."}
          {currentUser.role === "coach" && "Permisos limitados a profesor. Solo puede ver y listar los alumnos inscritos en sus clases particulares."}
        </p>
      </div>
    </div>
  );
}

// Subcomponent: Asistencias Tab
function AsistenciasTab({ selectedBranchId, blackoutDays }: { selectedBranchId: string; blackoutDays: { id: string; date: string; reason: string }[] }) {
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

  const activeBlackout = blackoutDays.find(b => b.date === "2026-06-29");

  return (
    <div className="space-y-8">
      {activeBlackout && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 rounded-3xl text-xs font-semibold flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div>
            <div className="font-bold">⚠️ Sede Cerrada por Día de Cierre / Feriado</div>
            <div className="text-[11px] text-rose-500/80 mt-0.5">Motivo: {activeBlackout.reason}. Los check-ins de hoy están inhabilitados.</div>
          </div>
        </div>
      )}
      {/* Live Feed Header */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm flex items-center justify-between col-span-1">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Aforo Actual</span>
            <div className="text-4xl font-extrabold tracking-tight mt-2">
              {selectedBranchId === "all" && <>84 <span className="text-lg font-medium text-muted-foreground">/ 170</span></>}
              {selectedBranchId === "matriz" && <>42 <span className="text-lg font-medium text-muted-foreground">/ 80</span></>}
              {selectedBranchId === "1" && <>24 <span className="text-lg font-medium text-muted-foreground">/ 50</span></>}
              {selectedBranchId === "2" && <>18 <span className="text-lg font-medium text-muted-foreground">/ 40</span></>}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Capacidad segura al {selectedBranchId === "all" ? "49%" : selectedBranchId === "matriz" ? "52%" : selectedBranchId === "1" ? "48%" : "45%"}
            </p>
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
  "Fisioterapia y Kinesiología"
];

function MembresiasTab({ membershipsList, setMembershipsList, amenities, branchesList }: MembresiasTabProps) {
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
      registrationFee: registrationFee ? parseFloat(registrationFee) : 0,
      isMultisede: isMultisede,
      freezeDays: freezeDays ? parseInt(freezeDays) : 0,
      dailyClassLimit: dailyClassLimit,
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
          includedServices: editSelectedServices,
          registrationFee: editRegistrationFee ? parseFloat(editRegistrationFee) : 0,
          isMultisede: editIsMultisede,
          freezeDays: editFreezeDays ? parseInt(editFreezeDays) : 0,
          dailyClassLimit: editDailyClassLimit,
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

          {/* Advanced business settings */}
          <div className="grid gap-4 sm:grid-cols-2 border-t border-border/40 pt-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground block">Costo de Matrícula ($)</label>
              <input 
                type="number" 
                value={registrationFee} 
                onChange={(e) => setRegistrationFee(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
                placeholder="0 = Sin matrícula"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground block">Días de Congelamiento por Año</label>
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
              <label className="text-xs font-semibold text-muted-foreground block">Límite Diario de Reservas</label>
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

            {/* Advanced business settings */}
            <div className="grid gap-4 sm:grid-cols-2 border-t border-border/40 pt-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground block">Costo de Matrícula ($)</label>
                <input 
                  type="number" 
                  value={editRegistrationFee} 
                  onChange={(e) => setEditRegistrationFee(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
                  placeholder="0 = Sin matrícula"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground block">Días de Congelamiento por Año</label>
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
                <label className="text-xs font-semibold text-muted-foreground block">Límite Diario de Reservas</label>
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
  classesList: { id: string; name: string; staffId: string; time: string; capacity: number; booked: number; enrolled: string[]; branchId?: string }[];
  setClassesList: React.Dispatch<React.SetStateAction<{ id: string; name: string; staffId: string; time: string; capacity: number; booked: number; enrolled: string[]; branchId?: string }[]>>;
  staffList: { 
    id: string; 
    name: string; 
    specialty: string; 
    certifications: string[]; 
    photo: string;
    availability?: { day: string; hours: string }[];
  }[];
  canManageClasses: boolean;
}

function ClasesTab({ classesList, setClassesList, staffList, canManageClasses }: ClasesTabProps) {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [staffId, setStaffId] = useState("");
  const [time, setTime] = useState("");
  const [capacity, setCapacity] = useState("15");

  const availabilityWarning = useMemo(() => {
    if (!staffId || !time) return null;
    const coach = staffList.find(s => s.id === staffId);
    if (!coach || !coach.availability || coach.availability.length === 0) return null;

    // We assume class runs on Monday/Lunes (today in mock dashboard context)
    const MondayAvail = coach.availability.find(a => a.day === "Lunes");
    if (!MondayAvail) {
      return `⚠️ Alerta: El instructor no tiene disponibilidad los Lunes. (Disp: ${coach.availability.map(a => `${a.day} ${a.hours}`).join(", ")})`;
    }

    try {
      const [classFrom, classTo] = time.split("-").map(t => t.trim());
      const [availFrom, availTo] = MondayAvail.hours.split("-").map(t => t.trim());

      const toMinutes = (h: string) => {
        const [hh, mm] = h.split(":").map(Number);
        return hh * 60 + mm;
      };

      if (toMinutes(classFrom) < toMinutes(availFrom) || toMinutes(classTo) > toMinutes(availTo)) {
        return `⚠️ Alerta: El horario de la clase (${time}) excede la disponibilidad del instructor (${MondayAvail.hours} los Lunes).`;
      }
    } catch (e) {
      // ignore
    }
    return null;
  }, [staffId, time, staffList]);

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
        {canManageClasses && (
          <Button 
            size="sm" 
            className="rounded-xl gap-1.5" 
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus className="h-4 w-4" /> {showAddForm ? "Cancelar" : "Nueva Clase"}
          </Button>
        )}
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

          {availabilityWarning && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-xl text-xs font-semibold animate-fade-in flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{availabilityWarning}</span>
            </div>
          )}

          <Button type="submit" className="rounded-xl">Programar Clase</Button>
        </form>
      )}

      {activeBlackout && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 rounded-3xl text-xs font-semibold flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div>
            <div className="font-bold">⚠️ Sede Cerrada por Día de Cierre / Feriado</div>
            <div className="text-[11px] text-rose-500/80 mt-0.5">Motivo: {activeBlackout.reason}. Todas las actividades están suspendidas por hoy.</div>
          </div>
        </div>
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
                    onClick={() => {
                      if (!activeBlackout) setSelectedClass(c.id);
                    }}
                    className={`p-4 rounded-xl border transition flex items-center justify-between ${
                      activeBlackout
                        ? "border-border opacity-50 cursor-not-allowed bg-secondary/10"
                        : selectedClass === c.id 
                          ? "border-primary bg-primary/5 cursor-pointer" 
                          : "border-border hover:border-foreground/20 cursor-pointer"
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-sm">{c.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{instructorName} · {c.time} hs</p>
                    </div>
                    {activeBlackout ? (
                      <span className="text-[9px] bg-rose-500/10 text-rose-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
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
  staffList: { id: string; name: string; specialty: string; certifications: string[]; photo: string; certificationImages?: string[]; role?: string; branchId?: string }[];
  setStaffList: React.Dispatch<React.SetStateAction<{ id: string; name: string; specialty: string; certifications: string[]; photo: string; certificationImages?: string[]; role?: string; branchId?: string }[]>>;
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
  branchesList: { id: string; name: string; address: string; manager?: string; lat?: number; lng?: number; creditCostMultiplier?: number }[];
  setBranchesList: React.Dispatch<React.SetStateAction<{ id: string; name: string; address: string; manager?: string; lat?: number; lng?: number; creditCostMultiplier?: number }[]>>;
  blackoutDays: { id: string; date: string; reason: string }[];
  setBlackoutDays: React.Dispatch<React.SetStateAction<{ id: string; date: string; reason: string }[]>>;
  penaltySettings: { enabled: boolean; type: string; maxAbsences: number };
  setPenaltySettings: React.Dispatch<React.SetStateAction<{ enabled: boolean; type: string; maxAbsences: number }>>;
}

function ConfigTab({ 
  staffList, setStaffList, 
  amenities, setAmenities, 
  requirements, setRequirements,
  gymPhotos, setGymPhotos,
  weeklyHours, setWeeklyHours,
  cancellationPolicyHours, setCancellationPolicyHours,
  branchesList, setBranchesList,
  blackoutDays, setBlackoutDays,
  penaltySettings, setPenaltySettings
}: ConfigTabProps) {
  const [subTab, setSubTab] = useState("basico");

  // Local states
  const [activeCertificationsViewer, setActiveCertificationsViewer] = useState<string[] | null>(null);
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

  const [deletingStaff, setDeletingStaff] = useState<any | null>(null);
  const [staffDeleteConfirmText, setStaffDeleteConfirmText] = useState("");
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

  const [newStaffAvailDay, setNewStaffAvailDay] = useState("Lunes");
  const [newStaffAvailHours, setNewStaffAvailHours] = useState("08:00 - 12:00");
  const [editStaffAvailDay, setEditStaffAvailDay] = useState("Lunes");
  const [editStaffAvailHours, setEditStaffAvailHours] = useState("08:00 - 12:00");

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

  const handleEditCoachAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEditStaffAvatarUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleEditCoachDiplomasUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const objectUrls = filesArray.map(file => URL.createObjectURL(file));
      setEditStaffDiplomas(prev => [...prev, ...objectUrls]);
    }
  };

  const handleRemoveEditDiploma = (index: number) => {
    setEditStaffDiplomas(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName || !staffSpecialty) return;

    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

    const newStaff = {
      id: Math.random().toString(),
      name: staffName,
      specialty: staffSpecialty,
      certifications: staffCerts.split(",").map(c => c.trim()).filter(c => c),
      photo: staffAvatarUrl || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=150&q=80",
      certificationImages: staffDiplomas,
      role: newStaffRole,
      branchId: newStaffBranchId === "matriz" ? undefined : newStaffBranchId,
      linkingCode: generatedOtp,
      status: "pending" as const,
      availability: [{ day: newStaffAvailDay, hours: newStaffAvailHours }]
    };

    setStaffList(prev => [...prev, newStaff]);
    setStaffName("");
    setStaffSpecialty("");
    setStaffCerts("");
    setStaffAvatarUrl(null);
    setStaffDiplomas([]);
    setNewStaffRole("coach");
    setNewStaffBranchId("matriz");
    setNewStaffAvailDay("Lunes");
    setNewStaffAvailHours("08:00 - 12:00");
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
      setEditStaffAvailDay(staff.availability[0].day);
      setEditStaffAvailHours(staff.availability[0].hours);
    } else {
      setEditStaffAvailDay("Lunes");
      setEditStaffAvailHours("08:00 - 12:00");
    }
  };

  const handleSaveEditStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStaffName || !editStaffSpecialty || !editingStaff) return;

    setStaffList(prev => prev.map(s => s.id === editingStaff.id ? {
      ...s,
      name: editStaffName,
      specialty: editStaffSpecialty,
      certifications: editStaffCerts.split(",").map(c => c.trim()).filter(c => c),
      photo: editStaffAvatarUrl || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=150&q=80",
      certificationImages: editStaffDiplomas,
      role: editStaffRole,
      branchId: editStaffBranchId === "matriz" ? undefined : editStaffBranchId,
      availability: [{ day: editStaffAvailDay, hours: editStaffAvailHours }]
    } : s));

    setEditingStaff(null);
  };

  const handleConfirmRemoveStaff = () => {
    if (!deletingStaff) return;
    setStaffList(prev => prev.filter(s => s.id !== deletingStaff.id));
    setDeletingStaff(null);
    setStaffDeleteConfirmText("");
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
        <div className="space-y-6 max-w-2xl bg-card border border-border p-6 rounded-3xl shadow-sm text-foreground">
          <div>
            <h3 className="font-bold text-sm flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-primary" /> Políticas de Reservas e Inasistencias
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Define los límites y restricciones para cancelaciones y penalizaciones por faltas.</p>
          </div>
          
          <div className="space-y-6 text-sm">
            {/* Cancellation hours input */}
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

            {/* No-show Penalties configuration */}
            <div className="border-t border-border/40 pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs">Penalización por Inasistencias (No-Shows)</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Sanciona automáticamente a alumnos que no asistan o cancelen fuera de término.</p>
                </div>
                <input 
                  type="checkbox"
                  checked={penaltySettings.enabled}
                  onChange={(e) => setPenaltySettings(prev => ({ ...prev, enabled: e.target.checked }))}
                  className="h-5 w-10 accent-primary rounded-full cursor-pointer shrink-0"
                />
              </div>

              {penaltySettings.enabled && (
                <div className="grid gap-4 sm:grid-cols-2 bg-secondary/10 p-4 rounded-2xl animate-fade-in space-y-2 sm:space-y-0">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground block">Tipo de Castigo / Penalidad</label>
                    <select
                      value={penaltySettings.type}
                      onChange={(e) => setPenaltySettings(prev => ({ ...prev, type: e.target.value }))}
                      className="flex h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus-visible:outline-none text-foreground"
                    >
                      <option value="deduct_credit">💵 Descontar crédito de clase igualmente</option>
                      <option value="block_reservations">🚫 Bloquear reservas por 48 horas (Pase Libre)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground block">Cantidad de Inasistencias Toleradas</label>
                    <input 
                      type="number"
                      min="1"
                      max="5"
                      value={penaltySettings.maxAbsences}
                      onChange={(e) => setPenaltySettings(prev => ({ ...prev, maxAbsences: parseInt(e.target.value) || 2 }))}
                      className="flex h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus-visible:outline-none text-foreground"
                    />
                  </div>
                </div>
              )}
            </div>

            <Button type="button" className="rounded-xl" onClick={() => alert("Políticas e inasistencias de alumnos actualizadas correctamente en la base de datos.")}>
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
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground block">Rol de Acceso al Sistema</label>
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
                <label className="text-xs font-semibold text-muted-foreground block">Sede / Sucursal de Trabajo</label>
                <select
                  value={newStaffBranchId}
                  onChange={(e) => setNewStaffBranchId(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none text-foreground"
                >
                  <option value="matriz">Sede Principal (Palermo)</option>
                  {branchesList.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 border-t border-border/40 pt-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground block">Día de Disponibilidad Principal</label>
                <select
                  value={newStaffAvailDay}
                  onChange={(e) => setNewStaffAvailDay(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none text-foreground"
                >
                  <option value="Lunes">Lunes</option>
                  <option value="Martes">Martes</option>
                  <option value="Miércoles">Miércoles</option>
                  <option value="Jueves">Jueves</option>
                  <option value="Viernes">Viernes</option>
                  <option value="Sábado">Sábado</option>
                  <option value="Domingo">Domingo</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground block">Rango Horario de Disponibilidad</label>
                <input 
                  type="text" 
                  value={newStaffAvailHours}
                  onChange={(e) => setNewStaffAvailHours(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none text-foreground"
                  placeholder="08:00 - 12:00"
                />
              </div>
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
                      onClick={() => { setDeletingStaff(s); setStaffDeleteConfirmText(""); }}
                      className="p-1.5 rounded-full hover:bg-rose-500/10 text-rose-500 transition"
                      title="Eliminar miembro"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <img src={s.photo} alt={s.name} className="h-12 w-12 rounded-full object-cover border border-border shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-foreground truncate">{s.name}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{s.specialty}</div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {s.role && (
                          <span className="text-[8px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                            {s.role === "coach" ? "💪 Coach" : s.role === "receptionist" ? "🔑 Recep" : "👤 Manager"}
                          </span>
                        )}
                        {s.role && (
                          <span className="text-[8px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                            📍 {s.branchId ? (branchesList.find(b => b.id === s.branchId)?.name.replace("Sede ", "") || s.branchId) : "Palermo"}
                          </span>
                        )}
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {s.certifications.map((c) => (
                          <span key={c} className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Availability & OTP Linking details */}
                  <div className="mt-3.5 border-t border-border/40 pt-2 text-[10px] space-y-1 bg-secondary/5 p-2 rounded-xl">
                    {s.availability && s.availability.length > 0 && (
                      <div className="text-muted-foreground font-medium">
                        ⏰ <span className="font-bold text-foreground">Disp:</span> {s.availability[0].day} ({s.availability[0].hours})
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between gap-1.5 mt-1 border-t border-border/20 pt-1">
                      {s.status === "linked" ? (
                        <span className="text-[9px] text-emerald-500 font-bold flex items-center gap-1">
                          🟢 Disp. Vinculado
                        </span>
                      ) : (
                        <>
                          <span className="text-[9px] text-amber-500 font-bold flex items-center gap-1" title="Dispositivo pendiente de vinculación">
                            🟡 Pendiente OTP: <span className="bg-amber-500/10 px-1 py-0.5 rounded text-amber-600 font-mono text-[10px]">{s.linkingCode}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
                              setStaffList(prev => prev.map(item => item.id === s.id ? { ...item, linkingCode: newOtp } : item));
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

      {/* Edit Staff Modal */}
      {editingStaff && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-fade-in text-foreground">
          <form onSubmit={handleSaveEditStaff} className="relative bg-card border border-border w-full max-w-[500px] rounded-3xl p-6 shadow-2xl space-y-4 animate-fade-up">
            <button 
              type="button"
              onClick={() => setEditingStaff(null)}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-secondary transition"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold tracking-tight">Editar Miembro de Staff</h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground block">Nombre y Apellido</label>
                <input 
                  type="text" 
                  required 
                  value={editStaffName} 
                  onChange={(e) => setEditStaffName(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground block">Especialidad / Cargo</label>
                <input 
                  type="text" 
                  required 
                  value={editStaffSpecialty} 
                  onChange={(e) => setEditStaffSpecialty(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground block">Certificaciones (separadas por comas)</label>
                <input 
                  type="text" 
                  value={editStaffCerts} 
                  onChange={(e) => setEditStaffCerts(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
                />
              </div>

              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground block">Rol del Sistema</label>
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
                  <label className="text-xs font-semibold text-muted-foreground block">Sede Asignada</label>
                  <select
                    value={editStaffBranchId}
                    onChange={(e) => setEditStaffBranchId(e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none text-foreground"
                  >
                    <option value="matriz">Sede Principal (Palermo)</option>
                    {branchesList.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 grid-cols-2 border-t border-border/40 pt-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground block">Día de Disponibilidad</label>
                  <select
                    value={editStaffAvailDay}
                    onChange={(e) => setEditStaffAvailDay(e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none text-foreground"
                  >
                    <option value="Lunes">Lunes</option>
                    <option value="Martes">Martes</option>
                    <option value="Miércoles">Miércoles</option>
                    <option value="Jueves">Jueves</option>
                    <option value="Viernes">Viernes</option>
                    <option value="Sábado">Sábado</option>
                    <option value="Domingo">Domingo</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground block">Rango Horario</label>
                  <input 
                    type="text" 
                    value={editStaffAvailHours}
                    onChange={(e) => setEditStaffAvailHours(e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none text-foreground"
                  />
                </div>
              </div>
            </div>

            {/* Photo & Diplomas in Edit Modal */}
            <div className="grid gap-4 grid-cols-2 border-t border-border/40 pt-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground block">Foto de Perfil</label>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full overflow-hidden border border-border bg-muted flex items-center justify-center shrink-0">
                    {editStaffAvatarUrl ? (
                      <img src={editStaffAvatarUrl} alt="Edit Preview" className="h-full w-full object-cover" />
                    ) : (
                      <Users className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <Button type="button" size="sm" variant="outline" className="rounded-xl text-[10px]" onClick={() => editCoachAvatarRef.current?.click()}>
                    Cambiar
                  </Button>
                  <input type="file" accept="image/*" ref={editCoachAvatarRef} onChange={handleEditCoachAvatarUpload} className="hidden" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground block">Diplomas / Certificaciones</label>
                <Button type="button" size="sm" variant="outline" className="rounded-xl text-[10px] gap-1" onClick={() => editCoachCertsRef.current?.click()}>
                  <Plus className="h-3 w-3" /> Añadir
                </Button>
                <input type="file" multiple accept="image/*" ref={editCoachCertsRef} onChange={handleEditCoachDiplomasUpload} className="hidden" />
              </div>
            </div>

            {/* List of editStaffDiplomas */}
            {editStaffDiplomas.length > 0 && (
              <div className="space-y-1 border-t border-border/40 pt-3">
                <label className="text-xs font-semibold text-muted-foreground block">Diplomas Guardados ({editStaffDiplomas.length})</label>
                <div className="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto">
                  {editStaffDiplomas.map((url, index) => (
                    <div key={index} className="relative h-10 w-14 rounded-lg overflow-hidden border border-border group shrink-0">
                      <img src={url} alt="Diploma" className="h-full w-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => handleRemoveEditDiploma(index)}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition text-rose-500 hover:text-rose-600"
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
              <Button type="submit" className="rounded-xl flex-1 font-bold text-xs">Guardar Cambios</Button>
              <Button type="button" variant="outline" className="rounded-xl flex-1 font-bold text-xs" onClick={() => setEditingStaff(null)}>Cancelar</Button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Staff Modal */}
      {deletingStaff && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-fade-in text-foreground">
          <div className="relative bg-card border border-border w-full max-w-[420px] rounded-3xl p-6 shadow-2xl text-center flex flex-col items-center">
            <button 
              onClick={() => setDeletingStaff(null)}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-secondary transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="h-12 w-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4">
              <ShieldAlert className="h-6 w-6" />
            </div>

            <h3 className="text-lg font-bold tracking-tight text-foreground">¿Eliminar Miembro de Staff?</h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Esta acción eliminará a <strong>"{deletingStaff.name}"</strong> del sistema. Esto afectará a cualquier clase en la grilla que lo tenga asignado como profesor. Para confirmar, escribe la palabra clave a continuación:
            </p>

            <div className="w-full mt-4 space-y-3">
              <input 
                type="text" 
                value={staffDeleteConfirmText}
                onChange={(e) => setStaffDeleteConfirmText(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-center focus-visible:outline-none font-bold placeholder:font-normal"
                placeholder="Escribe ELIMINAR para confirmar"
              />
              <div className="flex gap-2">
                <Button 
                  onClick={handleConfirmRemoveStaff}
                  disabled={staffDeleteConfirmText !== "ELIMINAR"}
                  className="rounded-xl flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs disabled:opacity-50"
                >
                  Confirmar Eliminación
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setDeletingStaff(null)}
                  className="rounded-xl flex-1 font-bold text-xs"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Subtab 6: Sucursales / Sedes */}
      {subTab === "sedes" && (
        <div className="space-y-6 max-w-2xl bg-card border border-border p-6 rounded-3xl shadow-sm animate-fade-up">
          <div>
            <h3 className="font-bold text-sm">Sucursales y Sedes</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Administra las ubicaciones físicas asociadas a tu red de gimnasios.</p>
          </div>

          {/* Add branch form */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (!newBranchName || !newBranchAddress) return;
              setBranchesList(prev => [
                ...prev, 
                { 
                  id: Math.random().toString(), 
                  name: newBranchName, 
                  address: newBranchAddress,
                  manager: newBranchManager || undefined,
                  lat: newBranchLat ? parseFloat(newBranchLat) : undefined,
                  lng: newBranchLng ? parseFloat(newBranchLng) : undefined,
                  creditCostMultiplier: newBranchMultiplier ? parseFloat(newBranchMultiplier) : 1.0
                }
              ]);
              setNewBranchName("");
              setNewBranchAddress("");
              setNewBranchManager("");
              setNewBranchLat("");
              setNewBranchLng("");
              setNewBranchMultiplier("1.0");
            }}
            className="p-4 border border-border bg-secondary/20 rounded-2xl space-y-4 animate-fade-up"
          >
            <h4 className="text-xs font-bold text-muted-foreground uppercase">Agregar Sucursal</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground font-semibold">Nombre de la Sede</label>
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
                <label className="text-xs text-muted-foreground font-semibold">Dirección Física</label>
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
                <label className="text-xs text-muted-foreground font-semibold">Responsable de Sede (Manager)</label>
                <input 
                  type="text" 
                  value={newBranchManager}
                  onChange={(e) => setNewBranchManager(e.target.value)}
                  className="flex h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus-visible:outline-none"
                  placeholder="Carlos Gómez"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground font-semibold">Multiplicador de Créditos (Wellhub / ClassPass)</label>
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
                <label className="text-xs text-muted-foreground font-semibold">Coordenada Latitud (GPS)</label>
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
                <label className="text-xs text-muted-foreground font-semibold">Coordenada Longitud (GPS)</label>
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
            
            <Button size="sm" type="submit" className="rounded-xl">Agregar Sede</Button>
          </form>

          {/* Branches list */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-muted-foreground uppercase">Sedes Registradas</h4>
            <div className="divide-y divide-border">
              <div className="py-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-foreground">Sede Principal (Palermo)</div>
                  <div className="text-xs text-muted-foreground">Av. Santa Fe 3421, Palermo, CABA</div>
                  <div className="flex gap-3 mt-1 text-[10px] text-muted-foreground">
                    <span>👤 Manager: Alan Kraft</span>
                    <span>📍 GPS: -34.5829, -58.4115</span>
                    <span>💎 Multiplicador: 1.0x</span>
                  </div>
                </div>
                <span className="text-[10px] bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-bold uppercase shrink-0">Matriz</span>
              </div>
              {branchesList.map((branch) => (
                <div key={branch.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-foreground">{branch.name}</div>
                    <div className="text-xs text-muted-foreground">{branch.address}</div>
                    <div className="flex gap-3 mt-1 text-[10px] text-muted-foreground flex-wrap">
                      {branch.manager && <span>👤 Manager: {branch.manager}</span>}
                      {branch.lat && branch.lng && <span>📍 GPS: {branch.lat.toFixed(4)}, {branch.lng.toFixed(4)}</span>}
                      {branch.creditCostMultiplier && <span>💎 Multiplicador: {branch.creditCostMultiplier.toFixed(1)}x</span>}
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setBranchesList(prev => prev.filter(x => x.id !== branch.id))}
                    className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {branchesList.length === 0 && (
                <p className="text-xs text-muted-foreground italic py-3">No hay sucursales secundarias registradas.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 7: Días de Cierre (Blackout Days) */}
      {subTab === "cierres" && (
        <div className="space-y-6 max-w-2xl bg-card border border-border p-6 rounded-3xl shadow-sm animate-fade-up text-foreground">
          <div>
            <h3 className="font-bold text-sm">Calendario de Días de Cierre</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Establece feriados, festivos o jornadas de mantenimiento técnico/edilicio para suspender reservas automáticamente.</p>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (!newBlackoutDate || !newBlackoutReason) return;
              setBlackoutDays(prev => [
                ...prev,
                {
                  id: Math.random().toString(),
                  date: newBlackoutDate,
                  reason: newBlackoutReason
                }
              ]);
              setNewBlackoutDate("");
              setNewBlackoutReason("");
            }}
            className="space-y-4 border-b border-border/40 pb-6 text-sm"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground font-semibold">Fecha de Cierre</label>
                <input 
                  type="date"
                  required
                  value={newBlackoutDate}
                  onChange={(e) => setNewBlackoutDate(e.target.value)}
                  className="flex h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus-visible:outline-none text-foreground"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground font-semibold">Motivo del Cierre</label>
                <input 
                  type="text"
                  required
                  placeholder="Navidad, Desinfección, etc."
                  value={newBlackoutReason}
                  onChange={(e) => setNewBlackoutReason(e.target.value)}
                  className="flex h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus-visible:outline-none text-foreground"
                  placeholder="Ej: Feriado Nacional"
                />
              </div>
            </div>

            <Button type="submit" size="sm" className="rounded-xl font-bold text-xs gap-1">
              <Plus className="h-4 w-4" /> Agregar Día de Cierre
            </Button>
          </form>

          {/* Closures list */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-muted-foreground uppercase">Fechas de Cierre Programadas</h4>
            <div className="divide-y divide-border">
              {blackoutDays.map((b) => (
                <div key={b.id} className="py-3.5 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-foreground">{b.reason}</div>
                    <div className="text-xs text-muted-foreground">📅 {b.date} {b.date === "2026-06-29" && <span className="text-[10px] bg-rose-500/10 text-rose-500 font-bold px-1.5 py-0.5 rounded ml-1.5 uppercase">Hoy</span>}</div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setBlackoutDays(prev => prev.filter(item => item.id !== b.id))}
                    className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition"
                    title="Eliminar día de cierre"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {blackoutDays.length === 0 && (
                <p className="text-xs text-muted-foreground italic py-3">No hay días de cierre configurados.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
