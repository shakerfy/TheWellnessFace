import { GymFacilityReview, PrivateFeedbackItem } from "./types";

export const INITIAL_FACILITY_REVIEWS: GymFacilityReview[] = [
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
    reply:
      "¡Muchas gracias Agustín por tu comentario! Nos alegra mucho que disfrutes del centro.",
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
    comment:
      "Vestuarios impecables y excelente ambiente para entrenar. El staff siempre muy atento.",
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
    comment:
      "Llevo 6 meses entrenando aquí y la experiencia es inmejorable. Súper recomendado para todas las edades.",
    reply: "¡Gracias Sofía! Nos motiva muchísimo seguir dando lo mejor cada día.",
  },
];

export const INITIAL_PRIVATE_FEEDBACK: PrivateFeedbackItem[] = [
  {
    id: "priv-1",
    date: "2026-07-28",
    studentName: "Martín Páez",
    studentPhoto:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80",
    category: "Climatización",
    message:
      "En el sector de peso libre el aire acondicionado estuvo un poco fuerte ayer por la tarde, ¿se podría regular?",
    status: "Pendiente",
  },
  {
    id: "priv-2",
    date: "2026-07-24",
    studentName: "Valeria Benítez",
    studentPhoto:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80",
    category: "Instalaciones",
    message:
      "Estaría genial si pudieran agregar un dispenser de agua extra cerca de la sala de Pilates.",
    status: "Atendido",
    adminNotes: "Nota interna: Instalaremos segundo dispenser la próxima semana.",
  },
  {
    id: "priv-3",
    date: "2026-07-15",
    studentName: "Diego Rossi",
    studentPhoto:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80",
    category: "Clases & Horarios",
    message:
      "Habría mucha demanda si agregan una clase de Yoga a las 20:00 hs los días martes. ¡Ojalá sea posible!",
    status: "Pendiente",
  },
];

export const DEFAULT_WHATSAPP_MEMBERS = [
  {
    id: "m1",
    name: "Agustín Gómez",
    phone: "+5491155551234",
    plan: "Pase Libre",
    photo:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80",
  },
  {
    id: "m2",
    name: "Camila Díaz",
    phone: "+5491141245124",
    plan: "Performance",
    photo:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80",
  },
  {
    id: "m3",
    name: "Lucas Peralta",
    phone: "+5491141241111",
    plan: "Pase Libre",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80",
  },
  {
    id: "m4",
    name: "Sofía Martínez",
    phone: "+5491133338888",
    plan: "Elite Coached",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80",
  },
  {
    id: "m5",
    name: "Martín Páez",
    phone: "+5491166669999",
    plan: "Performance",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80",
  },
];
