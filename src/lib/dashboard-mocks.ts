// Mock datasets extracted from dashboard for clean architecture & separation of concerns (Rule 14)

export interface StaffMember {
  id: string;
  name: string;
  specialty: string;
  specialties?: string[];
  certifications: string[];
  photo: string;
  certificationImages?: string[];
  role?: string;
  branchId?: string;
  linkingCode?: string | null;
  status: "pending" | "linked";
  availability?: any[];
  payModel?: "fixed_class" | "per_student" | "hybrid" | "percent";
  fixedRatePerClass?: number;
  ratePerStudent?: number;
  revenuePercent?: number;
}

export interface ClassItem {
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
  blocks?: any[];
}

export interface SalaItem {
  id: string;
  name: string;
  capacity?: number;
  branchId?: string;
  description?: string;
}

export interface CashTransaction {
  id: string;
  date: string;
  type: "income" | "expense";
  channel: "cash" | "transfer" | "app" | "payroll";
  description: string;
  amount: number;
  registeredBy: string;
}

export interface Protocol {
  id: string;
  title: string;
  role: string;
  time: string;
  items: string[];
}

export const INITIAL_STAFF_LIST: StaffMember[] = [
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
      status: "linked",
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
      status: "linked",
      availability: [
        { day: "Lunes", intervals: [{ from: "14:00", to: "20:00" }] },
        { day: "Viernes", intervals: [{ from: "14:00", to: "20:00" }] },
      ],
      payModel: "per_student",
      ratePerStudent: 800,
    },
  ];

export const INITIAL_CLASSES_LIST: ClassItem[] = [
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
          description:
            "- 200m Running / Remadora\n- 10 Pass-throughs con PVC\n- 15 Air Squats\n- 30s Plank Isométrico",
          timeCap: "8 min",
        },
        {
          id: "b2",
          type: "strength",
          title: "Trabajo de Fuerza: Back Squat",
          subtitle: "5 Series x 5 Repeticiones",
          description:
            "Trabajar a 75-80% de 1RM\nDescanso: 2 min entre cada serie\nEnfocarse en la profundidad y estabilidad del torso",
          timeCap: "18 min",
        },
        {
          id: "b3",
          type: "main",
          title: "WOD Principal: 'Helen Modified'",
          subtitle: "3 Rondas por Tiempo (For Time)",
          description:
            "- 400m Run\n- 21 Kettlebell Swings (24kg / 16kg)\n- 12 Pull-ups / Dominadas",
          timeCap: "14 min",
        },
        {
          id: "b4",
          type: "cooldown",
          title: "Vuelta a la Calma & Estiramientos",
          subtitle: "Recuperación Pasiva",
          description:
            "- 3 min Couch Stretch (Isquios y Psoas)\n- Movilidad pasiva de hombros con banda",
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
  ];

export const INITIAL_SALAS_LIST: SalaItem[] = [
    { id: "s1", name: "Sala Fuerza", capacity: 25, branchId: "matriz" },
    { id: "s2", name: "Box CrossFit", capacity: 15, branchId: "matriz" },
    { id: "s3", name: "Estudio Yoga", capacity: 12, branchId: "matriz" },
    { id: "s4", name: "Salón Principal", capacity: 20, branchId: "1" },
    { id: "s5", name: "Sala de Spinning", capacity: 15, branchId: "1" },
    { id: "s6", name: "Sala Zen", capacity: 12, branchId: "2" },
    { id: "s7", name: "Salón Funcional", capacity: 18, branchId: "2" },
  ];

export const INITIAL_CASH_TRANSACTIONS: CashTransaction[] = [
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
  ];

export const INITIAL_PROTOCOLS: Protocol[] = [
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
  ];

export const INITIAL_AMENITIES = [
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
  ];
export type AmenityItem = (typeof INITIAL_AMENITIES)[number];

export const INITIAL_REQUIREMENTS = [
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
  ];
export type RequirementItem = (typeof INITIAL_REQUIREMENTS)[number];

export const INITIAL_EQUIPMENT = [
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
  ];
export type EquipmentItem = (typeof INITIAL_EQUIPMENT)[number];

export const INITIAL_GYM_PHOTOS = [
    "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=500&q=80",
  ];

export const INITIAL_WEEKLY_HOURS = [
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
  ];
export type WeeklyHour = (typeof INITIAL_WEEKLY_HOURS)[number];

export const INITIAL_MEMBERSHIPS_LIST = [
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
  ];
export type MembershipItem = (typeof INITIAL_MEMBERSHIPS_LIST)[number];

export const INITIAL_BLACKOUT_DAYS = [
    { id: "1", date: "2026-06-29", reason: "Feriado Nacional (Día de Prueba)" },
  ];
export type BlackoutDay = (typeof INITIAL_BLACKOUT_DAYS)[number];

export const INITIAL_PENALTY_SETTINGS = {
    enabled: true,
    type: "deduct_credit", // "deduct_credit" | "block_reservations"
    maxAbsences: 2,
  };

export const INITIAL_TRIAL_CLASS_SETTINGS = {
    enabled: true,
    price: 0,
    description: "Clase introductoria para evaluar nivel y conocer las instalaciones.",
  };

export const INITIAL_TRIAL_REQUESTS = [
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
  ];
export type TrialRequest = (typeof INITIAL_TRIAL_REQUESTS)[number];

export const INITIAL_MEMBERS_LIST = [
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
  ];
export type MemberItem = (typeof INITIAL_MEMBERS_LIST)[number];

export const INITIAL_CHECKLIST_LOGS = [
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
  ];
export type ChecklistLog = (typeof INITIAL_CHECKLIST_LOGS)[number];

export const INITIAL_REVIEWS_LIST = [
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
  ];
export type ReviewItem = (typeof INITIAL_REVIEWS_LIST)[number];
