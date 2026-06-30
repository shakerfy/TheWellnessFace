export type Gym = {
  slug: string;
  name: string;
  city: string;
  neighborhood: string;
  address: string;
  rating: number;
  reviews: number;
  priceFrom: number;
  tags: string[];
  isOpen: boolean;
  hours: string;
  description: string;
  images: string[];
  memberships: {
    name: string;
    price: number;
    originalPrice?: number | null;
    duration: string;
    benefits: string[];
    includedServices?: string[];
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
  }[];
  classes: {
    day: number; // 0..6, lunes = 0
    name: string;
    instructor: string;
    time: string;
    duration: number;
    capacity: number;
    booked: number;
    branchId?: string;
  }[];
  requirements?: string[];
  staff?: { 
    id: string; 
    name: string; 
    specialty: string; 
    certifications: string[]; 
    photo: string; 
    certificationImages?: string[];
    linkingCode?: string | null;
    status?: "pending" | "linked";
    availability?: { day: string; intervals: { from: string; to: string }[] }[];
  }[];
  amenities?: string[];
  branches?: {
    id: string;
    name: string;
    address: string;
    manager?: string;
    lat?: number;
    lng?: number;
    creditCostMultiplier?: number;
    roamingStaffIds?: string[];
    weeklyHours?: { day: string; intervals: { from: string; to: string }[] }[];
    images?: string[];
    requirements?: string[];
    amenities?: string[];
  }[];
  weeklyHours?: { day: string; intervals: { from: string; to: string }[] }[];
  occupancyData?: Record<string, number[]>;
  instagram?: string;
  tiktok?: string;
  whatsapp?: string;
};

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

export const GYMS: Gym[] = [
  {
    slug: "kraft-strength-club",
    name: "Kraft Strength Club",
    city: "Buenos Aires",
    neighborhood: "Palermo",
    address: "Av. Santa Fe 3421, Palermo",
    rating: 4.9,
    reviews: 312,
    priceFrom: 18900,
    tags: ["Powerlifting", "Sala de musculación", "Coaching"],
    isOpen: true,
    hours: "06:00 — 23:00",
    description:
      "Un club de fuerza con plataformas olímpicas, racks calibrados y entrenadores certificados. Pensado para quienes priorizan técnica, progresión y resultados medibles.",
    images: [
      img("photo-1571902943202-507ec2618e8f"),
      img("photo-1534438327276-14e5300c3a48"),
      img("photo-1517836357463-d25dfeac3438"),
      img("photo-1540497077202-7c8a3999166f"),
    ],
    memberships: [
      { name: "Pase Libre", price: 18900, originalPrice: 24000, duration: "Mensual", benefits: ["Acceso ilimitado", "Sala de musculación", "Vestuario premium"], includedServices: ["showers", "lockers", "wifi"], tag: "Pase Libre", registrationFee: 0, isMultisede: false, freezeDays: 7, dailyClassLimit: "1 clase por día" },
      { name: "Performance", price: 28500, duration: "Mensual", benefits: ["Pase libre", "4 clases coacheadas", "Plan de entrenamiento"], includedServices: ["showers", "lockers", "wifi", "parking"], tag: "Pase Libre", registrationFee: 2500, isMultisede: true, freezeDays: 15, dailyClassLimit: "2 clases por día" },
      { name: "Elite", price: 42000, duration: "Mensual", benefits: ["Todo Performance", "PT semanal 1:1", "Análisis postural"], includedServices: ["showers", "lockers", "wifi", "parking", "sauna"], tag: "Planes Premium", registrationFee: 0, isMultisede: true, freezeDays: 30, dailyClassLimit: "Ilimitado" },
    ],
    classes: defaultSchedule(),
    requirements: ["Apto médico obligatorio", "Traer toalla personal"],
    staff: [
      { 
        id: "1", 
        name: "Mateo Rossi", 
        specialty: "Coach de Levantamiento Olímpico", 
        certifications: ["CF-L2", "Coaching de Fuerza"], 
        photo: img("photo-1507003211169-0a1dd7228f2d"), 
        certificationImages: [img("photo-1589330694653-ded6df53f7ec"), img("photo-1606326608606-aa0b62935f2b")],
        linkingCode: "1234",
        status: "pending",
        availability: [
          { day: "Lunes", intervals: [{ from: "08:00", to: "12:00" }] },
          { day: "Miércoles", intervals: [{ from: "08:00", to: "12:00" }] },
          { day: "Viernes", intervals: [{ from: "08:00", to: "12:00" }] }
        ]
      },
      { 
        id: "2", 
        name: "Valeria Soto", 
        specialty: "Profesora de Vinyasa Yoga", 
        certifications: ["RYT-200", "Yoga Terapéutico"], 
        photo: img("photo-1544005313-94ddf0286df2"), 
        certificationImages: [img("photo-1589330694653-ded6df53f7ec")],
        linkingCode: "5678",
        status: "pending",
        availability: [
          { day: "Martes", intervals: [{ from: "09:00", to: "13:00" }] },
          { day: "Jueves", intervals: [{ from: "09:00", to: "13:00" }] }
        ]
      },
      { 
        id: "3", 
        name: "Daniel Castro", 
        specialty: "Preparador Físico Funcional", 
        certifications: ["Prof. Educación Física", "FMS Level 1"], 
        photo: img("photo-1500648767791-00dcc994a43e"),
        linkingCode: "9012",
        status: "pending",
        availability: [
          { day: "Lunes", intervals: [{ from: "14:00", to: "20:00" }] },
          { day: "Martes", intervals: [{ from: "14:00", to: "20:00" }] },
          { day: "Miércoles", intervals: [{ from: "14:00", to: "20:00" }] },
          { day: "Jueves", intervals: [{ from: "14:00", to: "20:00" }] },
          { day: "Viernes", intervals: [{ from: "14:00", to: "20:00" }] }
        ]
      },
    ],
    amenities: ["Duchas y Vestuarios", "Lockers de Seguridad", "WiFi Alta Velocidad", "Estacionamiento Gratuito", "Sauna Húmedo", "Bicicletero / Estacionamiento de Bici", "Dispensador de Agua / Bebedero", "Venta de Suplementos / Bebidas"],
    weeklyHours: [
      { day: "Lunes", intervals: [{ from: "07:00", to: "12:00" }, { from: "14:00", to: "21:00" }] },
      { day: "Martes", intervals: [{ from: "07:00", to: "12:00" }, { from: "14:00", to: "21:00" }] },
      { day: "Miércoles", intervals: [{ from: "07:00", to: "12:00" }, { from: "14:00", to: "21:00" }] },
      { day: "Jueves", intervals: [{ from: "07:00", to: "12:00" }, { from: "14:00", to: "21:00" }] },
      { day: "Viernes", intervals: [{ from: "07:00", to: "12:00" }, { from: "14:00", to: "21:00" }] },
      { day: "Sábado", intervals: [{ from: "08:00", to: "14:00" }] },
      { day: "Domingo", intervals: [] },
    ],
    instagram: "kraft.strength",
    tiktok: "kraft.strength",
    whatsapp: "5491132421241",
    branches: [
      { 
        id: "1", 
        name: "Sede Belgrano", 
        address: "Av. Cabildo 1820, Belgrano, CABA", 
        manager: "Marcos Pérez", 
        lat: -34.5612, 
        lng: -58.4568, 
        creditCostMultiplier: 1.0, 
        roamingStaffIds: ["1", "3"],
        weeklyHours: [
          { day: "Lunes", intervals: [{ from: "07:00", to: "21:00" }] },
          { day: "Martes", intervals: [{ from: "07:00", to: "21:00" }] },
          { day: "Miércoles", intervals: [{ from: "07:00", to: "21:00" }] },
          { day: "Jueves", intervals: [{ from: "07:00", to: "21:00" }] },
          { day: "Viernes", intervals: [{ from: "07:00", to: "21:00" }] },
          { day: "Sábado", intervals: [] },
          { day: "Domingo", intervals: [] },
        ],
        images: [
          img("photo-1540496905036-5937c10647cc"),
          img("photo-1534258936925-c58bed479fcb"),
        ],
        requirements: ["Apto médico obligatorio", "Toalla de mano", "Solo mayores de 16 años"],
        amenities: ["Duchas y Vestuarios", "Lockers de Seguridad", "Estacionamiento Gratuito", "Sauna Húmedo"]
      },
      { 
        id: "2", 
        name: "Sede Las Cañitas", 
        address: "Ortega y Gasset 1520, Las Cañitas, CABA", 
        manager: "Sofía Rodríguez", 
        lat: -34.5715, 
        lng: -58.4352, 
        creditCostMultiplier: 1.2, 
        roamingStaffIds: ["2", "3"],
        weeklyHours: [
          { day: "Lunes", intervals: [{ from: "08:00", to: "12:00" }, { from: "16:00", to: "20:00" }] },
          { day: "Martes", intervals: [{ from: "08:00", to: "12:00" }, { from: "16:00", to: "20:00" }] },
          { day: "Miércoles", intervals: [{ from: "08:00", to: "12:00" }, { from: "16:00", to: "20:00" }] },
          { day: "Jueves", intervals: [{ from: "08:00", to: "12:00" }, { from: "16:00", to: "20:00" }] },
          { day: "Viernes", intervals: [{ from: "08:00", to: "12:00" }, { from: "16:00", to: "20:00" }] },
          { day: "Sábado", intervals: [{ from: "09:00", to: "13:00" }] },
          { day: "Domingo", intervals: [] },
        ],
        images: [
          img("photo-1545205597-3d9d02c29597"),
          img("photo-1518611012118-696072aa579a"),
        ],
        requirements: ["Apto médico obligatorio", "Uso obligatorio de gorro en pileta", "Calzado limpio de recambio"],
        amenities: ["Duchas y Vestuarios", "Lockers de Seguridad", "Pileta Climatizada", "Cafetería"]
      }
    ],
  },
  {
    slug: "atelier-yoga-house",
    name: "Atelier Yoga House",
    city: "Buenos Aires",
    neighborhood: "Recoleta",
    address: "Posadas 1240, Recoleta",
    rating: 4.8,
    reviews: 187,
    priceFrom: 14500,
    tags: ["Yoga", "Pilates", "Meditación"],
    isOpen: true,
    hours: "07:00 — 21:30",
    description:
      "Estudio boutique de yoga y pilates con luz natural, clases reducidas y profesores formados internacionalmente.",
    images: [
      img("photo-1599447421416-3414500d18a5"),
      img("photo-1545205597-3d9d02c29597"),
      img("photo-1518611012118-696072aa579a"),
      img("photo-1506629082955-511b1aa562c8"),
    ],
    memberships: [
      { name: "4 Clases", price: 14500, duration: "Mensual", benefits: ["4 clases", "Reserva anticipada"] },
      { name: "8 Clases", price: 22000, duration: "Mensual", benefits: ["8 clases", "Yoga + Pilates", "Mat incluido"] },
      { name: "Ilimitado", price: 31000, duration: "Mensual", benefits: ["Clases ilimitadas", "Meditación guiada", "Invitado x1/mes"] },
    ],
    classes: defaultSchedule(),
  },
  {
    slug: "north-crossfit-box",
    name: "North CrossFit Box",
    city: "Buenos Aires",
    neighborhood: "Belgrano",
    address: "Cabildo 2890, Belgrano",
    rating: 4.7,
    reviews: 421,
    priceFrom: 24000,
    tags: ["CrossFit", "Funcional", "WOD diario"],
    isOpen: false,
    hours: "06:30 — 22:00",
    description:
      "Box afiliado con programación diaria, comunidad activa y eventos in-house. Para quienes buscan intensidad y constancia.",
    images: [
      img("photo-1534258936925-c58bed479fcb"),
      img("photo-1526506118085-60ce8714f8c5"),
      img("photo-1540496905036-5937c10647cc"),
      img("photo-1521804906057-1df8fdb718b7"),
    ],
    memberships: [
      { name: "3 Días", price: 24000, duration: "Mensual", benefits: ["3 WODs / semana", "Open gym"] },
      { name: "Unlimited", price: 34500, duration: "Mensual", benefits: ["WODs ilimitados", "Open gym", "Seminarios"] },
      { name: "Anual", price: 320000, duration: "Anual", benefits: ["Unlimited 12m", "Remera", "20% en merch"] },
    ],
    classes: defaultSchedule(),
  },
  {
    slug: "loop-cycling-studio",
    name: "Loop Cycling Studio",
    city: "Buenos Aires",
    neighborhood: "Núñez",
    address: "Av. del Libertador 7800, Núñez",
    rating: 4.9,
    reviews: 256,
    priceFrom: 19500,
    tags: ["Indoor Cycling", "HIIT", "Boutique"],
    isOpen: true,
    hours: "06:00 — 22:30",
    description:
      "Sala oscura, sonido envolvente y bicis con métricas en tiempo real. Clases de 45 minutos que combinan música, ritmo y datos.",
    images: [
      img("photo-1517438476312-10d79c077509"),
      img("photo-1605296867304-46d5465a13f1"),
      img("photo-1554344728-77cf90d9ed26"),
      img("photo-1540575467063-178a50c2df87"),
    ],
    memberships: [
      { name: "Pack 5", price: 19500, duration: "30 días", benefits: ["5 rides", "Reserva 7 días"] },
      { name: "Pack 10", price: 34000, duration: "60 días", benefits: ["10 rides", "Toalla", "Agua incluida"] },
      { name: "Unlimited", price: 49500, duration: "Mensual", benefits: ["Rides ilimitados", "Métricas premium"] },
    ],
    classes: defaultSchedule(),
  },
  {
    slug: "ironworks-fitness",
    name: "Ironworks Fitness Center",
    city: "Buenos Aires",
    neighborhood: "Caballito",
    address: "Av. Rivadavia 5012, Caballito",
    rating: 4.6,
    reviews: 540,
    priceFrom: 12900,
    tags: ["Fitness center", "Funcional", "Spinning"],
    isOpen: true,
    hours: "05:30 — 23:30",
    description:
      "Gimnasio integral con tres pisos, área cardio renovada y +30 clases grupales por semana. Ideal para entrenar a tu ritmo.",
    images: [
      img("photo-1540497077202-7c8a3999166f"),
      img("photo-1593079831268-3381b0db4a77"),
      img("photo-1581009146145-b5ef050c2e1e"),
      img("photo-1574680096145-d05b474e2155"),
    ],
    memberships: [
      { name: "Mensual", price: 12900, duration: "Mensual", benefits: ["Acceso completo", "Clases grupales"] },
      { name: "Trimestral", price: 34500, duration: "3 meses", benefits: ["Acceso completo", "-12% vs mensual"] },
      { name: "Semestral", price: 64900, duration: "6 meses", benefits: ["Acceso completo", "PT inicial", "-16%"] },
    ],
    classes: defaultSchedule(),
  },
  {
    slug: "method-pilates-lab",
    name: "Method Pilates Lab",
    city: "Buenos Aires",
    neighborhood: "Villa Crespo",
    address: "Thames 1050, Villa Crespo",
    rating: 4.9,
    reviews: 162,
    priceFrom: 26000,
    tags: ["Pilates Reformer", "Postural", "Pequeños grupos"],
    isOpen: true,
    hours: "08:00 — 21:00",
    description:
      "Estudio de Pilates reformer con clases de máximo 6 personas y evaluación postural inicial.",
    images: [
      img("photo-1518310383802-640c2de311b2"),
      img("photo-1593810450967-f9c42742e326"),
      img("photo-1518611012118-696072aa579a"),
      img("photo-1601925260361-3c91d7d2f6f5"),
    ],
    memberships: [
      { name: "4 Clases", price: 26000, duration: "Mensual", benefits: ["4 clases reformer", "Eval. inicial"] },
      { name: "8 Clases", price: 46000, duration: "Mensual", benefits: ["8 clases reformer", "Reformer + mat"] },
      { name: "12 Clases", price: 64000, duration: "Mensual", benefits: ["12 clases", "Privado x1/mes"] },
    ],
    classes: defaultSchedule(),
  },
];

function defaultSchedule(): Gym["classes"] {
  const base = [
    { name: "Funcional", instructor: "Mara López", time: "07:00", duration: 60, capacity: 18 },
    { name: "Spinning", instructor: "Iván Ríos", time: "08:30", duration: 45, capacity: 22 },
    { name: "Yoga Flow", instructor: "Lucía Pérez", time: "10:00", duration: 60, capacity: 16 },
    { name: "CrossFit WOD", instructor: "Diego A.", time: "18:00", duration: 60, capacity: 14 },
    { name: "Pilates Reformer", instructor: "Sol M.", time: "19:30", duration: 50, capacity: 8 },
  ];
  const out: Gym["classes"] = [];
  for (let d = 0; d < 7; d++) {
    base.forEach((c, i) => {
      if ((d + i) % 5 === 2 && d === 6) return; // gap on sunday
      let branchId: string | undefined = undefined;
      if ((d + i) % 3 === 0) branchId = "1";
      else if ((d + i) % 3 === 1) branchId = "2";

      out.push({
        day: d,
        name: c.name,
        instructor: c.instructor,
        time: c.time,
        duration: c.duration,
        capacity: c.capacity,
        booked: Math.max(0, Math.min(c.capacity, Math.round((Math.sin(d * 7 + i * 3) + 1) * (c.capacity / 2)))),
        branchId,
      });
    });
  }
  return out;
}

export function defaultOccupancy() {
  const weekdays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
  const data: Record<string, number[]> = {};

  // Hours: 07:00, 08:00, 09:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00, 17:00, 18:00, 19:00, 20:00, 21:00 (15 hours)
  const weekdayPattern = [60, 75, 80, 55, 40, 30, 25, 35, 40, 50, 70, 85, 95, 80, 45];
  const SaturdayPattern = [30, 45, 60, 70, 75, 80, 65, 45, 20, 10, 5, 0, 0, 0, 0]; 
  const SundayPattern = [10, 20, 35, 45, 50, 55, 40, 20, 10, 5, 0, 0, 0, 0, 0];

  weekdays.forEach(day => {
    // Generate slightly randomized patterns per day
    data[day] = weekdayPattern.map(val => Math.min(100, Math.max(0, val + Math.floor(Math.random() * 11) - 5)));
  });

  data["Sábado"] = SaturdayPattern;
  data["Domingo"] = SundayPattern;

  return data;
}

export function getGym(slug: string): Gym | undefined {
  const gym = GYMS.find((g) => g.slug === slug);
  if (gym && !gym.occupancyData) {
    gym.occupancyData = defaultOccupancy();
  }
  return gym;
}