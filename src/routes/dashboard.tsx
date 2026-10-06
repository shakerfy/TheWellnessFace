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

import {
  AsistenciasTab,
  ClasesTab,
  ConfigTab,
  MembresiasTab,
  MiembrosTab,
  ReseñasTab,
  AyudaTab,
} from "@/components/dashboard";

export const Route = createFileRoute("/dashboard")({
  component: GymDashboard,
});

import {
  StaffMember,
  ClassItem,
  SalaItem,
  Protocol,
  CashTransaction,
  INITIAL_STAFF_LIST,
  INITIAL_AMENITIES,
  INITIAL_REQUIREMENTS,
  INITIAL_EQUIPMENT,
  INITIAL_GYM_PHOTOS,
  INITIAL_WEEKLY_HOURS,
  INITIAL_CLASSES_LIST,
  INITIAL_SALAS_LIST,
  INITIAL_MEMBERSHIPS_LIST,
  INITIAL_BLACKOUT_DAYS,
  INITIAL_PENALTY_SETTINGS,
  INITIAL_TRIAL_CLASS_SETTINGS,
  INITIAL_TRIAL_REQUESTS,
  INITIAL_MEMBERS_LIST,
  INITIAL_PROTOCOLS,
  INITIAL_CHECKLIST_LOGS,
  INITIAL_REVIEWS_LIST,
  INITIAL_CASH_TRANSACTIONS,
} from "@/lib/dashboard-mocks";
import { getStudentPhoto } from "@/components/dashboard/dashboard-utils";


const TABS = [
  { id: "asistencia", label: "Asistencias", icon: Activity },
  { id: "clases", label: "Clases", icon: Calendar },
  { id: "miembros", label: "Miembros", icon: Users },
  { id: "membresias", label: "Membresías", icon: CreditCard },
  { id: "reseñas", label: "Reseñas", icon: MessageCircle },
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

  // Lifted state initialized from isolated mock datasets (Rule 14)
  const [staffList, setStaffList] = useState<StaffMember[]>(INITIAL_STAFF_LIST);
  const [amenities, setAmenities] = useState(INITIAL_AMENITIES);
  const [requirements, setRequirements] = useState(INITIAL_REQUIREMENTS);
  const [equipment, setEquipment] = useState(INITIAL_EQUIPMENT);
  const [gymPhotos, setGymPhotos] = useState(INITIAL_GYM_PHOTOS);
  const [weeklyHours, setWeeklyHours] = useState(INITIAL_WEEKLY_HOURS);
  const [cancellationPolicyHours, setCancellationPolicyHours] = useState(2);
  const [classesList, setClassesList] = useState<ClassItem[]>(INITIAL_CLASSES_LIST);
  const [salasList, setSalasList] = useState<SalaItem[]>(INITIAL_SALAS_LIST);
  const [membershipsList, setMembershipsList] = useState(INITIAL_MEMBERSHIPS_LIST);
  const [blackoutDays, setBlackoutDays] = useState(INITIAL_BLACKOUT_DAYS);
  const [penaltySettings, setPenaltySettings] = useState(INITIAL_PENALTY_SETTINGS);
  const [trialClassSettings, setTrialClassSettings] = useState(INITIAL_TRIAL_CLASS_SETTINGS);
  const [trialRequests, setTrialRequests] = useState(INITIAL_TRIAL_REQUESTS);
  const [membersList, setMembersList] = useState<any[]>(INITIAL_MEMBERS_LIST);
  const [otpInput, setOtpInput] = useState("");
  const [protocols, setProtocols] = useState<Protocol[]>(INITIAL_PROTOCOLS);
  const [completedProtocols, setCompletedProtocols] = useState<
    Record<string, { savedBy: string; savedTime: string }>
  >({});
  const [protocolItemChecks, setProtocolItemChecks] = useState<Record<string, boolean>>({});
  const [isChecklistVisible, setIsChecklistVisible] = useState(true);
  const [checklistLogs, setChecklistLogs] = useState(INITIAL_CHECKLIST_LOGS);
  const [reviewsList, setReviewsList] = useState(INITIAL_REVIEWS_LIST);
  const [cashTransactions, setCashTransactions] = useState<CashTransaction[]>(INITIAL_CASH_TRANSACTIONS);

  const visibleClasses = classesList;
  const visibleTabs = TABS;

  const handleLogout = () => {
    navigate({ to: "/auth/gym" });
  };

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-background text-foreground flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 dark:bg-[#13110F]/90 bg-card border-b md:border-b-0 md:border-r border-border p-4 md:p-5 flex flex-col h-auto md:h-screen sticky top-0 z-30 shrink-0 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-5 w-full shrink-0">
          <Link
            to="/"
            className="text-2xl sm:text-3xl font-bebas tracking-widest text-foreground uppercase select-none hover:opacity-90 transition"
          >
            Shakerfy
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggle variant="ghost" size="icon" />
            <button
              onClick={handleLogout}
              className="md:hidden p-2 rounded-xl text-destructive hover:bg-destructive/10 transition"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto pr-0.5 pb-2 custom-scrollbar">
          {visibleTabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.25 rounded-xl text-[13.5px] font-semibold transition-colors ${
                  activeTab === tab.id
                    ? "bg-secondary text-foreground font-bold border border-border/80"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${activeTab === tab.id ? "text-primary" : "text-muted-foreground"}`}
                />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="pt-3 border-t border-border/60 mt-auto shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.25 rounded-xl text-[13.5px] font-semibold text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Cerrar sesión</span>
          </button>
        </div>
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
            canManageClasses={
              currentUser.role === "superadmin" ||
              currentUser.role === "manager" ||
              currentUser.role === "admin"
            }
            blackoutDays={blackoutDays}
            salasList={salasList}
            cancellationPolicyHours={cancellationPolicyHours}
            currentUser={currentUser}
            membersList={membersList}
          />
        )}
        {activeTab === "reseñas" && <ReseñasTab membersList={membersList} />}
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
        {activeTab === "ayuda" && <AyudaTab />}
      </main>
    </div>
  );
}