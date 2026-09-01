import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  MUSCLE_GROUPS,
  RECOVERY_READY_THRESHOLD,
  getCalculatedMuscleRecovery,
  applyFatigueToMuscles,
  type MuscleId,
} from "@/lib/muscle-recovery";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Dumbbell,
  Sparkles,
  ChevronRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock,
  Shield,
  Layers,
  Search,
  Zap,
  Info,
  Play,
  Pause,
  Plus,
  FastForward,
  Timer,
  AlertCircle,
  Activity,
  X,
  ArrowLeftRight,
  Trash2,
  GripVertical,
  Flame,
  Wind,
  Home,
  Minus,
  FileText,
  Minimize2,
  VolumeX,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// --- CATEGORÍAS Y EQUIPAMIENTOS ---
interface EquipmentCategory {
  category: string;
  items: string[];
}

const EQUIPMENT_CATEGORIES: EquipmentCategory[] = [
  {
    category: "Entrenamiento cardiovascular",
    items: [
      "Bicicleta de asalto",
      "Bicicleta estática",
      "Cinta de correr",
      "Elíptica",
      "Escalador",
      "Máquina de remo",
    ],
  },
  {
    category: "Pesos libres",
    items: [
      "Barra",
      "Barra EZ",
      "Barra hexagonal",
      "Disco",
      "Mancuernas",
      "Pesas rusas",
      "Pivote de barra",
    ],
  },
  {
    category: "Máquinas de cable",
    items: [
      "Polea de cable cruzado",
      "Polea de jalón dorsal",
      "Polea de remo sentado",
    ],
  },
  {
    category: "Máquina de pesas",
    items: [
      "Curl de piernas",
      "Curl de piernas sentado",
      "Extensión de pierna",
      "Máquina smith",
      "Máquina de abducción de cadera",
      "Máquina de aducción de cadera",
      "Máquina de aperturas",
      "Máquina de bíceps",
      "Máquina de crunch abdominal",
      "Máquina de deltoides",
      "Máquina de fondos para tríceps",
      "Máquina de press de hombros",
      "Máquina de remo sentado",
      "Prensa de pecho",
      "Prensa de piernas",
      "Prensa de piernas a 45°",
      "Remo T",
    ],
  },
  {
    category: "Barras y bancos",
    items: [
      "Banco",
      "Banco de abdominales",
      "Banco de curls",
      "Banco inclinado",
      "Barra de dominadas",
      "Rack",
    ],
  },
  {
    category: "Bandas",
    items: ["Banda de resistencia", "Banda elástica"],
  },
  {
    category: "Otro",
    items: [
      "Bola",
      "Bola de estabilidad",
      "Caja pliométrica",
      "Colchoneta de yoga",
      "Cuerda para saltar",
      "Rodillo",
      "Rueda abdominal",
    ],
  },
];

const ALL_EQUIPMENT_ITEMS = EQUIPMENT_CATEGORIES.flatMap((c) => c.items);

// --- REGLAS DE EQUIPAMIENTO POR TIPO DE WORKOUT ---
type WorkoutType = "Fuerza" | "Recuperar" | "Calistenia" | "HIIT";

const ALLOWED_EQUIPMENT_BY_TYPE: Record<WorkoutType, string[]> = {
  Fuerza: ALL_EQUIPMENT_ITEMS,
  Recuperar: ["Rodillo"],
  Calistenia: [
    "Banco",
    "Banco de abdominales",
    "Barra de dominadas",
    "Colchoneta de yoga",
  ],
  HIIT: [
    "Barra",
    "Mancuernas",
    "Pesas rusas",
    "Banco",
    "Banco de abdominales",
    "Barra de dominadas",
    "Banda de resistencia",
    "Banda elástica",
    "Bola de estabilidad",
    "Caja pliométrica",
    "Colchoneta de yoga",
    "Cuerda para saltar",
    "Rodillo",
    "Rueda abdominal",
  ],
};

const INJURY_OPTIONS = [
  {
    id: "none",
    label: "No tengo restricciones",
    desc: "Apto para todos los planos de movimiento y ejercicios compuestos.",
  },
  {
    id: "back",
    label: "Apto para la espalda",
    desc: "Evita cargas axiales directas y sobrecargas en la columna lumbar.",
  },
  {
    id: "knees",
    label: "Apto para las rodillas",
    desc: "Reduce momentos de cizalla anterior y flexiones extremas de rodilla.",
  },
  {
    id: "shoulders",
    label: "Apto para los hombros",
    desc: "Evita abducciones extremas en rotación interna y press tras nuca.",
  },
];

const UPPER_BODY_IDS: MuscleId[] = ["hombros", "biceps", "triceps", "espalda", "pecho"];
const LOWER_BODY_IDS: MuscleId[] = ["gluteos", "cuadriceps", "isquiotibiales"];
const ALL_MUSCLE_IDS: MuscleId[] = MUSCLE_GROUPS.map((m) => m.id);

const SAVED_EQUIPMENT_KEY = "shakerfy_saved_equipment_v1";

const getInitialSavedEquipment = (): string[] => {
  if (typeof window === "undefined") return ALLOWED_EQUIPMENT_BY_TYPE["Fuerza"];
  try {
    const raw = localStorage.getItem(SAVED_EQUIPMENT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Error reading saved equipment", e);
  }
  return ALLOWED_EQUIPMENT_BY_TYPE["Fuerza"];
};

// --- ESCALA DE ESFUERZO PERCIBIDO (RPE) ---
type ExertionLevel = "facil" | "optimo" | "al_limite" | "dificil_postura";

interface ExertionOption {
  key: ExertionLevel;
  label: string;
  subtext: string;
  defaultRestSecs: number;
}

const EXERTION_OPTIONS: ExertionOption[] = [
  {
    key: "facil",
    label: "Fácil",
    subtext: "Pude completar todo con técnica limpia sin cansarme.",
    defaultRestSecs: 45,
  },
  {
    key: "optimo",
    label: "Óptimo",
    subtext: "Fue un buen desafío y mantuve el control en cada repetición.",
    defaultRestSecs: 60,
  },
  {
    key: "al_limite",
    label: "Al límite",
    subtext: "Llegué al fallo muscular pero con buena postura.",
    defaultRestSecs: 90,
  },
  {
    key: "dificil_postura",
    label: "Difícil / Perdí postura",
    subtext: "Tuve que sacrificar la técnica o hacer pausas imprevistas.",
    defaultRestSecs: 90,
  },
];

// MODELO DE EJERCICIO
interface ExerciseItem {
  id: string;
  name: string;
  muscleName: string;
  muscleId: MuscleId;
  image: string;
  videoUrl: string;
  equipment: string;
  reps: string;
  weight: string;
  description: string;
  instructions: string[];
  rounds?: BlockRound[];
  notes?: string;
}

// MODELO DE SERIE DENTRO DE UN BLOQUE
interface BlockRound {
  roundNumber: number;
  isCompleted: boolean;
  rating?: ExertionLevel;
}

// MODELO DE BLOQUE
interface WorkoutBlock {
  id: string;
  type: "warmup" | "superset" | "standard" | "cardio" | "cooldown";
  title: string;
  subtitle: string;
  exercises: ExerciseItem[];
  rounds: BlockRound[];
}

interface ExerciseLibraryEntry {
  name: string;
  reps: string;
  load: string;
  equipment: string;
  image: string;
  videoUrl: string;
  description: string;
  instructions: string[];
}

// CATÁLOGO DE CALENTAMIENTO Y ACTIVACIÓN
const WARMUP_EXERCISES: ExerciseLibraryEntry[] = [
  {
    name: "Rotaciones Torácicas & Gato-Camello",
    reps: "10 reps",
    load: "Movilidad",
    equipment: "Colchoneta de yoga",
    image: "/humano.png",
    videoUrl: "/chinupreversewidegrip_x264(2).mp4",
    description: "Moviliza la columna torácica, lubrica discos intervertebrales y prepara la faja lumbo-pélvica.",
    instructions: [
      "En cuatro apoyos, arquea suavemente la columna elevando la cabeza (inhalación).",
      "Redondea la columna llevando la barbilla al pecho (exhalación).",
      "Luego realiza 5 rotaciones torácicas llevando una mano tras la nuca y apuntando el codo al techo.",
    ],
  },
  {
    name: "Dislocaciones y Activación Escapular",
    reps: "15 reps",
    load: "Movilidad",
    equipment: "Banda elástica / Bastón",
    image: "/hombro (2).png",
    videoUrl: "/chinupreversewidegrip_x264(2).mp4",
    description: "Lubrica la cápsula glenohumeral y activa los estabilizadores escapulares (serrato y romboides).",
    instructions: [
      "Sujeta la banda o bastón con un agarre amplio frente a tus caderas.",
      "Pasa los brazos por encima de la cabeza hacia la espalda baja sin flexionar los codos.",
      "Regresa hacia adelante de forma suave y controlada.",
    ],
  },
  {
    name: "Sentadilla Profunda con Apertura de Cadera",
    reps: "10 reps",
    load: "Movilidad",
    equipment: "Colchoneta de yoga",
    image: "/frente.png",
    videoUrl: "/chinupreversewidegrip_x264(2).mp4",
    description: "Desbloquea la dorsiflexión de tobillo, aductores y cápsula de cadera antes de cargar peso.",
    instructions: [
      "Desciende a una sentadilla profunda manteniendo talones pegados al suelo.",
      "Junta las palmas al pecho y empuja las rodillas hacia afuera con los codos.",
      "Sostén 2 segundos en el fondo antes de incorporarte.",
    ],
  },
];

// CATÁLOGO DE VUELTA A LA CALMA Y ENFRIAMIENTO
const COOLDOWN_EXERCISES: ExerciseLibraryEntry[] = [
  {
    name: "Estiramiento Pectoral & Dorsal en Pared",
    reps: "45 seg",
    load: "Elongación",
    equipment: "Colchoneta de yoga",
    image: "/gimnasia.png",
    videoUrl: "/chinupreversewidegrip_x264(2).mp4",
    description: "Restaura la longitud del pectoral menor y dorsal ancho, mejorando la postura tras empujes y tracciones.",
    instructions: [
      "Apoya el antebrazo en una pared o poste a 90° respecto al cuerpo.",
      "Gira suavemente el torso en sentido opuesto hasta sentir una tensión placentera.",
      "Mantén respiraciones profundas y lentas.",
    ],
  },
  {
    name: "Postura de la Paloma (Glúteos & Piramidal)",
    reps: "60 seg",
    load: "Elongación",
    equipment: "Colchoneta de yoga",
    image: "/musculos (1).png",
    videoUrl: "/chinupreversewidegrip_x264(2).mp4",
    description: "Descomprime el nervio ciático y relaja la musculatura rotadora profunda de la cadera.",
    instructions: [
      "Lleva una pierna flexionada al frente en 90° o 45° y extiende la otra pierna hacia atrás.",
      "Baja el torso sobre el muslo delantero respirando con el diafragma.",
      "Permite que la gravedad relaje la tensión acumulada.",
    ],
  },
  {
    name: "Respiración Diafragmática 4-7-8",
    reps: "2 min",
    load: "Recuperación",
    equipment: "Colchoneta de yoga / Rodillo",
    image: "/humano.png",
    videoUrl: "/chinupreversewidegrip_x264(2).mp4",
    description: "Activa el sistema nervioso parasimpático, reduce el cortisol y acelera la recuperación post-entrenamiento.",
    instructions: [
      "Acuéstate boca arriba con las rodillas flexionadas y manos en el abdomen.",
      "Inhala por la nariz en 4 segundos sintiendo expandir el vientre.",
      "Sostén el aire 7 segundos y exhala suavemente por la boca durante 8 segundos.",
    ],
  },
];

const EXERCISE_LIBRARY: Record<MuscleId, ExerciseLibraryEntry[]> = {
  hombros: [
    {
      name: "Press Militar con Mancuernas",
      reps: "12 reps",
      load: "14 kg",
      equipment: "Mancuernas",
      image: "/hombro (2).png",
      videoUrl: "/chinupreversewidegrip_x264(2).mp4",
      description: "Desarrolla la fuerza y estabilidad del deltoides anterior y lateral con fijación escapular.",
      instructions: [
        "Siéntate con la espalda firme sobre el respaldo o de pie con abdomen activo.",
        "Eleva las mancuernas a la altura de los hombros con los codos a 45° del torso.",
        "Empuja hacia arriba sin bloquear completamente los codos en el punto más alto.",
        "Desciende de forma controlada en 2-3 segundos hasta la altura de las orejas.",
      ],
    },
    {
      name: "Elevaciones Laterales en Polea",
      reps: "15 reps",
      load: "7.5 kg",
      equipment: "Polea de cable cruzado",
      image: "/cable-crossover.png",
      videoUrl: "/chinupreversewidegrip_x264(2).mp4",
      description: "Aísla la porción media del deltoides manteniendo tensión mecánica constante.",
      instructions: [
        "Coloca la polea en el punto más bajo y sujeta el agarre con la mano contraria.",
        "Eleva el brazo en el plano escapular hasta la altura del hombro.",
        "Haz una pausa de 1 segundo arriba y desciende resistiendo la gravedad.",
      ],
    },
    {
      name: "Press Arnold con Mancuernas",
      reps: "12 reps",
      load: "12 kg",
      equipment: "Mancuernas & Banco",
      image: "/hombro (2).png",
      videoUrl: "/chinupreversewidegrip_x264(2).mp4",
      description: "Movimiento multiplanar que involucra las tres cabezas del deltoides con rotación continua.",
      instructions: [
        "Comienza con las palmas orientadas hacia ti a la altura del pecho.",
        "Rota los antebrazos hacia afuera mientras empujas hacia arriba en un solo movimiento fluido.",
        "Regresa invirtiendo la rotación bajo control.",
      ],
    },
    {
      name: "Liberación Miofascial con Rodillo",
      reps: "60 seg",
      load: "Peso corporal",
      equipment: "Rodillo",
      image: "/hombro (2).png",
      videoUrl: "/chinupreversewidegrip_x264(2).mp4",
      description: "Auto-liberación de puntos gatillo en deltoides y manguito rotador para restaurar la movilidad articular.",
      instructions: [
        "Apoya la cara lateral o posterior del hombro sobre el rodillo.",
        "Rueda lentamente identificando zonas de tensión y sostén la presión respirando con calma.",
      ],
    },
  ],
  biceps: [
    {
      name: "Curl de Bíceps en Banco Inclinado",
      reps: "12 reps",
      load: "12 kg",
      equipment: "Banco inclinado & Mancuernas",
      image: "/biceps.png",
      videoUrl: "/chinupreversewidegrip_x264(2).mp4",
      description: "Genera máxima elongación en la cabeza larga del bíceps braquial.",
      instructions: [
        "Ajusta el banco a unos 60° e inclina tu torso manteniendo los hombros retraídos.",
        "Comienza con los brazos extendidos y supina las muñecas al subir.",
        "Contrae el bíceps en el punto álgido sin adelantar los codos.",
        "Baja lentamente estirando por completo el músculo.",
      ],
    },
    {
      name: "Curl Martillo con Mancuernas",
      reps: "12 reps",
      load: "14 kg",
      equipment: "Mancuernas",
      image: "/biceps.png",
      videoUrl: "/chinupreversewidegrip_x264(2).mp4",
      description: "Enfocado en el braquiorradial y braquial anterior para densidad de brazos.",
      instructions: [
        "Mantén las palmas enfrentadas en agarre neutro durante todo el rango.",
        "Flexiona los codos manteniendo los brazos pegados al torso.",
        "Desciende con control sin balancear la espalda.",
      ],
    },
    {
      name: "Dominadas Supinas (Chin-ups)",
      reps: "8-10 reps",
      load: "Peso corporal",
      equipment: "Barra de dominadas",
      image: "/biceps.png",
      videoUrl: "/chinupreversewidegrip_x264(2).mp4",
      description: "Ejercicio rey de calistenia para máxima tensión funcional en bíceps y dorsal.",
      instructions: [
        "Sujeta la barra con agarre supino (palmas hacia ti) al ancho de hombros.",
        "Tracciona elevando la barbilla por encima de la barra contrayendo bíceps.",
        "Baja de forma controlada hasta la extensión completa.",
      ],
    },
    {
      name: "Auto-liberación con Rodillo",
      reps: "60 seg",
      load: "Peso corporal",
      equipment: "Rodillo",
      image: "/biceps.png",
      videoUrl: "/chinupreversewidegrip_x264(2).mp4",
      description: "Reduce la tensión en tendones del codo y fascia braquial.",
      instructions: [
        "Apoya el brazo sobre el rodillo en suelo o mesa.",
        "Rueda suavemente desde el tendón del bíceps hasta el antebrazo.",
      ],
    },
  ],
  triceps: [
    {
      name: "Extensiones en Polea",
      reps: "15 reps",
      load: "20 kg",
      equipment: "Polea de cable cruzado",
      image: "/musculos (4).png",
      videoUrl: "/chinupreversewidegrip_x264(2).mp4",
      description: "Aislamiento de la cabeza lateral y medial del tríceps con cuerda o barra recta.",
      instructions: [
        "Fija los codos a los lados del torso con una ligera inclinación hacia adelante.",
        "Extiende los brazos completamente hacia abajo abriendo la cuerda al final.",
        "Regresa controlando el movimiento hasta que los antebrazos superen los 90°.",
      ],
    },
    {
      name: "Fondos en Banco",
      reps: "15 reps",
      load: "Peso corporal",
      equipment: "Banco",
      image: "/musculos (4).png",
      videoUrl: "/chinupreversewidegrip_x264(2).mp4",
      description: "Extensión de tríceps calisténica de fácil ajuste biomecánico.",
      instructions: [
        "Apoya las palmas en el borde del banco con piernas extendidas al frente.",
        "Flexiona los codos a 90° descendiendo la cadera cerca del banco.",
        "Empuja con fuerza extendiendo los tríceps.",
      ],
    },
    {
      name: "Press Francés con Mancuernas",
      reps: "12 reps",
      load: "10 kg",
      equipment: "Banco & Mancuernas",
      image: "/musculos (4).png",
      videoUrl: "/chinupreversewidegrip_x264(2).mp4",
      description: "Énfasis en la cabeza larga del tríceps gracias al plano de flexión de hombro.",
      instructions: [
        "Acuéstate en el banco con los brazos perpendiculares al suelo.",
        "Flexiona los codos llevando las mancuernas junto a las orejas.",
        "Extiende de regreso manteniendo los codos cerrados.",
      ],
    },
    {
      name: "Liberación Miofascial de Tríceps",
      reps: "60 seg",
      load: "Peso corporal",
      equipment: "Rodillo",
      image: "/musculos (4).png",
      videoUrl: "/chinupreversewidegrip_x264(2).mp4",
      description: "Descompresión de la inserción distal del tríceps en el olécranon.",
      instructions: [
        "Coloca la cara posterior del brazo sobre el rodillo y desliza suavemente.",
      ],
    },
  ],
  espalda: [
    {
      name: "Jalón al Pecho en Polea",
      reps: "12 reps",
      load: "50 kg",
      equipment: "Polea de jalón dorsal",
      image: "/lat-pulldown.png",
      videoUrl: "/chinupreversewidegrip_x264(2).mp4",
      description: "Estimula la amplitud del dorsal ancho mediante tracción vertical biomecánica.",
      instructions: [
        "Sujeta la barra con un agarre ligeramente más ancho que los hombros.",
        "Inicia la tracción deprimiendo las escápulas hacia abajo y atrás.",
        "Lleva la barra hacia la parte superior del pecho sin arquear excesivamente la columna.",
        "Extiende los brazos arriba permitiendo el estiramiento dorsal completo.",
      ],
    },
    {
      name: "Dominadas Pronas (Pull-ups)",
      reps: "10 reps",
      load: "Peso corporal",
      equipment: "Barra de dominadas",
      image: "/lat-pulldown.png",
      videoUrl: "/chinupreversewidegrip_x264(2).mp4",
      description: "Calistenia pura de tracción vertical para amplitud dorsal y control escapular.",
      instructions: [
        "Agarre prono más ancho que los hombros.",
        "Tracciona hasta superar la barra con la barbilla deprimiendo escápulas.",
        "Baja con control sin balanceos.",
      ],
    },
    {
      name: "Remo con Mancuerna Unilateral",
      reps: "12 reps",
      load: "22 kg",
      equipment: "Banco & Mancuernas",
      image: "/atras.png",
      videoUrl: "/chinupreversewidegrip_x264(2).mp4",
      description: "Corrige asimetrías de fuerza y potencia la densidad del dorsal y romboides.",
      instructions: [
        "Apoya una rodilla y mano en el banco manteniendo la espalda paralela al suelo.",
        "Tracciona la mancuerna guiando el codo hacia la cadera.",
        "Baja sintiendo cómo el dorsal se alarga en la parte inferior.",
      ],
    },
    {
      name: "Descompresión Torácica con Rodillo",
      reps: "90 seg",
      load: "Peso corporal",
      equipment: "Rodillo",
      image: "/atras.png",
      videoUrl: "/chinupreversewidegrip_x264(2).mp4",
      description: "Extensión torácica y liberación de la fascia del dorsal ancho.",
      instructions: [
        "Coloca el rodillo transversalmente en la espalda media.",
        "Apoya manos tras la nuca y rueda suavemente de omóplatos a zona media sin comprimir cuello.",
      ],
    },
  ],
  pecho: [
    {
      name: "Press de Banca con Mancuernas",
      reps: "10 reps",
      load: "24 kg",
      equipment: "Banco & Mancuernas",
      image: "/gimnasia.png",
      videoUrl: "/chinupreversewidegrip_x264(2).mp4",
      description: "Máxima activación del pectoral mayor con rango de movimiento profundo y seguro.",
      instructions: [
        "Acuéstate con los pies firmes en el suelo y retracción escapular activa.",
        "Baja las mancuernas con los codos a unos 45-60° respecto al torso.",
        "Empuja hacia el centro del pecho contrayendo fuertemente arriba.",
      ],
    },
    {
      name: "Flexiones de Pecho (Push-ups)",
      reps: "15 reps",
      load: "Peso corporal",
      equipment: "Colchoneta de yoga",
      image: "/gimnasia.png",
      videoUrl: "/chinupreversewidegrip_x264(2).mp4",
      description: "Patrón de empuje horizontal funcional con alta activación del serrato anterior.",
      instructions: [
        "Mantén el cuerpo en plancha recta y baja el pecho a 2 cm del suelo.",
        "Empuja extendiendo brazos y separando omóplatos arriba.",
      ],
    },
    {
      name: "Fondos en Paralelas",
      reps: "10 reps",
      load: "Peso corporal",
      equipment: "Barra de dominadas / Paralelas",
      image: "/gimnasia.png",
      videoUrl: "/chinupreversewidegrip_x264(2).mp4",
      description: "Inclinación del torso al frente para focalizar fibras inferiores del pectoral.",
      instructions: [
        "Inclina el torso 30° hacia adelante y abre ligeramente los codos.",
        "Desciende hasta 90° y empuja con potencia.",
      ],
    },
    {
      name: "Apertura Miofascial con Rodillo",
      reps: "60 seg",
      load: "Peso corporal",
      equipment: "Rodillo",
      image: "/gimnasia.png",
      videoUrl: "/chinupreversewidegrip_x264(2).mp4",
      description: "Restaura la longitud del pectoral menor y alivia hombros adelantados.",
      instructions: [
        "Acuéstate longitudinalmente con el rodillo a lo largo de la columna.",
        "Abre los brazos en cruz o en 'W' sintiendo la gravedad abrir el pecho.",
      ],
    },
  ],
  abdominales: [
    {
      name: "Elevaciones de Piernas Colgado",
      reps: "15 reps",
      load: "Peso corporal",
      equipment: "Barra de dominadas",
      image: "/humano.png",
      videoUrl: "/chinupreversewidegrip_x264(2).mp4",
      description: "Fortalece la pared abdominal anterior y la flexión de cadera con control pélvico.",
      instructions: [
        "Cuélgate de la barra y activa la cintura escapular.",
        "Eleva las piernas o rodillas contrayendo el abdomen e inclinando la pelvis.",
        "Desciende sin dejar que el cuerpo oscile.",
      ],
    },
    {
      name: "Plancha Abdominal Activa",
      reps: "45 seg",
      load: "Isométrico",
      equipment: "Colchoneta de yoga",
      image: "/humano.png",
      videoUrl: "/chinupreversewidegrip_x264(2).mp4",
      description: "Estabilidad central antirrotacional y antiflexión para salud espinal.",
      instructions: [
        "Apoya antebrazos y puntas de pie en línea recta desde los talones a la cabeza.",
        "Aprieta glúteos y contrae el transverso abdominal como si recibieras un impacto.",
        "Mantén una respiración diafragmática pausada.",
      ],
    },
    {
      name: "Rueda Abdominal (Ab Wheel)",
      reps: "12 reps",
      load: "Peso corporal",
      equipment: "Rueda abdominal",
      image: "/humano.png",
      videoUrl: "/chinupreversewidegrip_x264(2).mp4",
      description: "Antiextensión espinal avanzada para fuerza de núcleo integrada.",
      instructions: [
        "Desde rodillas, rueda hacia adelante manteniendo abdomen firme.",
        "Regresa tirando desde los abdominales sin hundir la zona lumbar.",
      ],
    },
    {
      name: "Descompresión de Psoas con Rodillo",
      reps: "60 seg",
      load: "Peso corporal",
      equipment: "Rodillo",
      image: "/humano.png",
      videoUrl: "/chinupreversewidegrip_x264(2).mp4",
      description: "Relaja el psoas ilíaco y la fascia anterior del core.",
      instructions: [
        "Coloca el rodillo bajo la pelvis y deja caer una pierna estirada para relajar flexores.",
      ],
    },
  ],
  espalda_baja: [
    {
      name: "Hiperextensiones en Banco",
      reps: "15 reps",
      load: "Peso corporal",
      equipment: "Banco de abdominales",
      image: "/atras (3).png",
      videoUrl: "/chinupreversewidegrip_x264(2).mp4",
      description: "Refuerza los erectores espinales, multífidos y la cadena posterior baja.",
      instructions: [
        "Ajusta el soporte bajo las caderas.",
        "Baja el torso manteniendo la columna neutra y extiende hasta alinear el cuerpo.",
      ],
    },
    {
      name: "Bird-Dog en Colchoneta",
      reps: "12 reps",
      load: "Peso corporal",
      equipment: "Colchoneta de yoga",
      image: "/atras (3).png",
      videoUrl: "/chinupreversewidegrip_x264(2).mp4",
      description: "Ejercicio fundamental de estabilidad lumbopélvica del Dr. Stuart McGill.",
      instructions: [
        "En cuadrupedia, extiende simultáneamente brazo derecho y pierna izquierda.",
        "Mantén la pelvis paralela al suelo sin arquear la zona lumbar.",
      ],
    },
    {
      name: "Descompresión Glúteo-Lumbar",
      reps: "90 seg",
      load: "Peso corporal",
      equipment: "Rodillo",
      image: "/atras (3).png",
      videoUrl: "/chinupreversewidegrip_x264(2).mp4",
      description: "Alivio de sobrecarga lumbar mediante liberación de glúteo medio y cuadrado lumbar.",
      instructions: [
        "Siéntate sobre el rodillo cruzando una pierna en 4.",
        "Rueda sobre la parte superior del glúteo respirando profundamente.",
      ],
    },
  ],
  gluteos: [
    {
      name: "Hip Thrust con Barra",
      reps: "12 reps",
      load: "60 kg",
      equipment: "Banco & Barra",
      image: "/musculos (1).png",
      videoUrl: "/chinupreversewidegrip_x264(2).mp4",
      description: "Ejercicio de máxima producción de fuerza horizontal y extensión de cadera.",
      instructions: [
        "Apoya la parte media de la espalda en el borde del banco.",
        "Coloca la barra protegida con almohadilla sobre la pelvis.",
        "Empuja desde los talones hasta alcanzar 90° en rodillas y bloquear los glúteos.",
      ],
    },
    {
      name: "Puente de Glúteos en Suelo",
      reps: "15 reps",
      load: "Peso corporal",
      equipment: "Colchoneta de yoga",
      image: "/musculos (1).png",
      videoUrl: "/chinupreversewidegrip_x264(2).mp4",
      description: "Extensión de cadera en suelo ideal para calentamiento o calistenia.",
      instructions: [
        "Acuéstate boca arriba con rodillas flexionadas.",
        "Eleva las caderas apretando glúteos arriba sin arquear espalda.",
      ],
    },
    {
      name: "Kettlebell Swings",
      reps: "20 reps",
      load: "16 kg",
      equipment: "Pesas rusas",
      image: "/musculos (1).png",
      videoUrl: "/chinupreversewidegrip_x264(2).mp4",
      description: "Potencia balística de cadera y gasto metabólico elevado en HIIT.",
      instructions: [
        "Impulsa la pesa rusa desde la bisagra de cadera con glúteos y femorales.",
        "Bloquea la cadera arriba con fuerza.",
      ],
    },
    {
      name: "Liberación Miofascial de Glúteo",
      reps: "60 seg",
      load: "Peso corporal",
      equipment: "Rodillo",
      image: "/musculos (1).png",
      videoUrl: "/chinupreversewidegrip_x264(2).mp4",
      description: "Descompresión del nervio ciático y liberación de la fascia glútea profunda.",
      instructions: [
        "Cruza un tobillo sobre la rodilla contraria y rueda sobre el glúteo en apoyo.",
      ],
    },
  ],
  cuadriceps: [
    {
      name: "Dumbbell Goblet Squat",
      reps: "15 reps",
      load: "20 kg",
      equipment: "Mancuernas / Pesas rusas",
      image: "/frente.png",
      videoUrl: "/chinupreversewidegrip_x264(2).mp4",
      description: "Sentadilla frontal accesible que promueve profundidad y torso erguido.",
      instructions: [
        "Sujeta una mancuerna o pesa rusa pegada al esternón.",
        "Desciende con las rodillas alineadas con la punta de los pies.",
        "Empuja el suelo con fuerza para ascender.",
      ],
    },
    {
      name: "Sentadillas Libres (Air Squats)",
      reps: "20 reps",
      load: "Peso corporal",
      equipment: "Colchoneta de yoga",
      image: "/frente.png",
      videoUrl: "/chinupreversewidegrip_x264(2).mp4",
      description: "Patrón funcional básico con ritmo controlado y máxima profundidad.",
      instructions: [
        "Pies al ancho de hombros, brazos al frente para balance.",
        "Baja rompiendo el paralelo y sube contrayendo cuádriceps.",
      ],
    },
    {
      name: "Saltos al Cajón (Box Jumps)",
      reps: "12 reps",
      load: "Potencia",
      equipment: "Caja pliométrica",
      image: "/frente.png",
      videoUrl: "/chinupreversewidegrip_x264(2).mp4",
      description: "Pliometría de triple extensión para potencia de cuádriceps en HIIT.",
      instructions: [
        "Flexiona caderas y brazos y salta aterrizando suavemente sobre el cajón con rodillas flexionadas.",
      ],
    },
    {
      name: "Rodillo Miofascial en Cuádriceps",
      reps: "90 seg",
      load: "Peso corporal",
      equipment: "Rodillo",
      image: "/frente.png",
      videoUrl: "/chinupreversewidegrip_x264(2).mp4",
      description: "Alivia tensión patelar y contracturas en recto femoral y vastos.",
      instructions: [
        "Boca abajo, apoya el muslo sobre el rodillo y deslízate desde la cadera hasta 2 cm antes de la rodilla.",
      ],
    },
  ],
  isquiotibiales: [
    {
      name: "Kettlebell Deadlift",
      reps: "15 reps",
      load: "24 kg",
      equipment: "Pesas rusas / Barra",
      image: "/atras (1).png",
      videoUrl: "/chinupreversewidegrip_x264(2).mp4",
      description: "Patrón dominante de cadera para tensión excéntrica en isquios y glúteos.",
      instructions: [
        "Párate sobre la pesa con pies al ancho de cadera.",
        "Flexiona la cadera manteniendo la espalda recta.",
        "Sujeta la manija y empuja el piso para levantarte con los glúteos.",
      ],
    },
    {
      name: "Salto de Cuerda HIIT",
      reps: "60 seg",
      load: "Cardio",
      equipment: "Cuerda para saltar",
      image: "/atras (1).png",
      videoUrl: "/chinupreversewidegrip_x264(2).mp4",
      description: "Activación elástica de tobillos, gemelos e isquiotibiales con alta quema glucolítica.",
      instructions: [
        "Salta sobre las puntas de los pies con giros rápidos de muñeca.",
      ],
    },
    {
      name: "Curl Nórdico Asistido en Banco",
      reps: "10 reps",
      load: "Peso corporal",
      equipment: "Banco",
      image: "/atras (1).png",
      videoUrl: "/chinupreversewidegrip_x264(2).mp4",
      description: "Sobrecarga excéntrica máxima en isquiotibiales para prevención de lesiones.",
      instructions: [
        "Fija los tobillos y desciende el torso lentamente resistiendo con la parte posterior del muslo.",
      ],
    },
    {
      name: "Rodillo Miofascial en Isquiosurales",
      reps: "90 seg",
      load: "Peso corporal",
      equipment: "Rodillo",
      image: "/atras (1).png",
      videoUrl: "/chinupreversewidegrip_x264(2).mp4",
      description: "Descarga de la cadena posterior para flexibilidad y recuperación muscular.",
      instructions: [
        "Siéntate con el rodillo bajo los muslos y deslízate desde el glúteo hasta la fosa poplítea.",
      ],
    },
  ],
};

// --- ALERTA AUDITIVA Y VIBRACIÓN HÁPTICA PARA EL DESCANSO ---
const playRestCompleteAlert = () => {
  try {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([150, 100, 200]);
    }
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(587.33, now);
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.3);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(880, now + 0.12);
      gain2.gain.setValueAtTime(0.25, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.5);
    }
  } catch (_) {}
};

// Helpers para inputs numéricos inteligentes con unidades fijas
const getNumericReps = (val?: string): string => {
  if (!val) return "";
  const match = val.match(/\d+/);
  return match ? match[0] : val.replace(/[^0-9]/g, "");
};

const getRepsUnit = (val?: string): string => {
  if (!val) return "reps";
  const lower = val.toLowerCase();
  if (lower.includes("seg") || lower.includes("sec") || lower.includes("segundo")) {
    return "seg";
  }
  return "reps";
};

const getNumericWeight = (val?: string): string => {
  if (!val) return "";
  const lower = val.toLowerCase();
  if (lower.includes("peso") || lower.includes("corporal") || lower.includes("moderado") || lower.includes("leve")) {
    return "";
  }
  const match = val.match(/[\d.]+/);
  return match ? match[0] : val.replace(/[^0-9.]/g, "");
};

interface CustomWorkoutTabProps {
  onBack?: () => void;
}

export function CustomWorkoutTab({ onBack }: CustomWorkoutTabProps) {
  // Navigation subviews
  const [currentView, setCurrentView] = useState<"config" | "equipment" | "injuries" | "workout-view">("config");

  // Form selections
  const [workoutType, setWorkoutType] = useState<WorkoutType>("Fuerza");
  const [duration, setDuration] = useState<number>(25);
  const [selectedMuscleIds, setSelectedMuscleIds] = useState<MuscleId[]>([
    "hombros",
    "biceps",
    "triceps",
    "espalda",
    "pecho",
  ]);
  const [intensity, setIntensity] = useState<"Baja" | "Moderada" | "Alta">("Moderada");
  const [includeWarmup, setIncludeWarmup] = useState<boolean>(true);
  const [includeCooldown, setIncludeCooldown] = useState<boolean>(true);
  const [includeCardio, setIncludeCardio] = useState<boolean>(false);
  const [includeSupersets, setIncludeSupersets] = useState<boolean>(true);
  const [isBodyweightOnly, setIsBodyweightOnly] = useState<boolean>(false);
  const [isSmallSpaceOnly, setIsSmallSpaceOnly] = useState<boolean>(false);
  const [isQuietWorkout, setIsQuietWorkout] = useState<boolean>(false);

  // Equipamiento persistente en localStorage para reducir fricción
  const [savedEquipment, setSavedEquipment] = useState<string[]>(getInitialSavedEquipment);

  const saveEquipmentList = (newList: string[]) => {
    setSavedEquipment(newList);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(SAVED_EQUIPMENT_KEY, JSON.stringify(newList));
      } catch (e) {
        console.error("Error saving equipment to localStorage", e);
      }
    }
  };

  // Equipamiento permitido según el tipo seleccionado
  const allowedEquipmentForType = useMemo(
    () => ALLOWED_EQUIPMENT_BY_TYPE[workoutType],
    [workoutType],
  );

  // Equipamiento activo: filtra los equipos guardados según los permitidos para este tipo de sesión
  const selectedEquipment = useMemo(() => {
    if (isBodyweightOnly) return ["Colchoneta de yoga"];
    const allowed = ALLOWED_EQUIPMENT_BY_TYPE[workoutType];
    const filtered = savedEquipment.filter((item) => allowed.includes(item));
    return filtered.length > 0 ? filtered : allowed;
  }, [savedEquipment, workoutType, isBodyweightOnly]);

  const [selectedInjury, setSelectedInjury] = useState<string>("No tengo restricciones");
  const [equipmentSearch, setEquipmentSearch] = useState<string>("");

  // Generated Workout Blocks
  const [workoutBlocks, setWorkoutBlocks] = useState<WorkoutBlock[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Drag & Drop State
  const [draggedItem, setDraggedItem] = useState<{ blockId: string; index: number } | null>(null);
  const [draggedBlockIndex, setDraggedBlockIndex] = useState<number | null>(null);

  // Swipe-to-delete state (offsets per exercise ID)
  const [swipeOffsets, setSwipeOffsets] = useState<Record<string, number>>({});
  const touchStartCoords = useRef<{ x: number; y: number } | null>(null);

  // Live Workout Session Tracking
  const [isWorkoutActive, setIsWorkoutActive] = useState<boolean>(false);
  const [workoutElapsedSeconds, setWorkoutElapsedSeconds] = useState<number>(0);
  const [isWorkoutPaused, setIsWorkoutPaused] = useState<boolean>(false);
  const [showIncompleteConfirmDialog, setShowIncompleteConfirmDialog] = useState<boolean>(false);

  // Post-workout summary & rating modal
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [globalSessionRating, setGlobalSessionRating] = useState<"ligero" | "perfecto" | "extenuante">("perfecto");

  // Selected round waiting for RPE rating
  const [rpeDialogState, setRpeDialogState] = useState<{
    blockId: string;
    exerciseId?: string;
    roundNumber: number;
    blockTitle: string;
  } | null>(null);

  // Exercise Detail & Video Modal State
  const [videoModalExercise, setVideoModalExercise] = useState<ExerciseItem | null>(null);

  // Exercise Swap State
  const [swapTarget, setSwapTarget] = useState<{
    blockId: string;
    exerciseId: string;
    muscleId: MuscleId;
    currentExercise: ExerciseItem;
  } | null>(null);

  // Add Exercise Modal State (Single vs Superset vs Link)
  const [addExerciseBlockId, setAddExerciseBlockId] = useState<string | null>(null);
  const [addExerciseModalMode, setAddExerciseModalMode] = useState<"single" | "superset" | "link">("single");
  const [selectedAddExercises, setSelectedAddExercises] = useState<{ entry: ExerciseLibraryEntry; muscleId: MuscleId }[]>([]);
  const [addExerciseSearchQuery, setAddExerciseSearchQuery] = useState<string>("");
  const [addExerciseMuscleFilter, setAddExerciseMuscleFilter] = useState<MuscleId | "all">("all");
  const [expandedNoteExerciseId, setExpandedNoteExerciseId] = useState<string | null>(null);

  // Rest Timer Modal State
  const [restTimerState, setRestTimerState] = useState<{
    isOpen: boolean;
    secondsLeft: number;
    totalSeconds: number;
    blockTitle: string;
    roundNumber: number;
    ratingKey: ExertionLevel;
    isPaused: boolean;
  } | null>(null);

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleSelectWorkoutType = (newType: WorkoutType) => {
    setWorkoutType(newType);
  };

  const handleToggleBodyweightOnly = (enabled: boolean) => {
    setIsBodyweightOnly(enabled);
  };

  const navigateToAiCoach = () => {
    if (typeof window !== "undefined") {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set("tab", "diario");
      window.history.pushState({}, "", newUrl.toString());
      window.dispatchEvent(new Event("popstate"));
    }
    if (onBack) {
      onBack();
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (currentView === "workout-view" && isWorkoutActive && !isWorkoutPaused) {
      interval = setInterval(() => {
        setWorkoutElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentView, isWorkoutActive, isWorkoutPaused]);

  useEffect(() => {
    if (restTimerState?.isOpen && !restTimerState.isPaused && restTimerState.secondsLeft > 0) {
      timerIntervalRef.current = setInterval(() => {
        setRestTimerState((prev) => {
          if (!prev || prev.isPaused) return prev;
          if (prev.secondsLeft <= 1) {
            clearInterval(timerIntervalRef.current as NodeJS.Timeout);
            playRestCompleteAlert();
            toast.success("¡Descanso completado! Listo para la siguiente serie.", {
              icon: "⚡",
            });
            return null;
          }
          return { ...prev, secondsLeft: prev.secondsLeft - 1 };
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [restTimerState?.isOpen, restTimerState?.isPaused, restTimerState?.secondsLeft]);

  const recoveryLevels = useMemo(() => getCalculatedMuscleRecovery(), [currentView]);

  const isAllSelected = useMemo(
    () => ALL_MUSCLE_IDS.every((id) => selectedMuscleIds.includes(id)),
    [selectedMuscleIds],
  );

  const isUpperSelected = useMemo(
    () => UPPER_BODY_IDS.every((id) => selectedMuscleIds.includes(id)),
    [selectedMuscleIds],
  );

  const isLowerSelected = useMemo(
    () => LOWER_BODY_IDS.every((id) => selectedMuscleIds.includes(id)),
    [selectedMuscleIds],
  );

  const handleToggleAllMuscles = () => {
    if (isAllSelected) setSelectedMuscleIds([]);
    else setSelectedMuscleIds([...ALL_MUSCLE_IDS]);
  };

  const handleToggleUpperBody = () => {
    if (isUpperSelected) setSelectedMuscleIds((prev) => prev.filter((id) => !UPPER_BODY_IDS.includes(id)));
    else setSelectedMuscleIds((prev) => Array.from(new Set([...prev, ...UPPER_BODY_IDS])));
  };

  const handleToggleLowerBody = () => {
    if (isLowerSelected) setSelectedMuscleIds((prev) => prev.filter((id) => !LOWER_BODY_IDS.includes(id)));
    else setSelectedMuscleIds((prev) => Array.from(new Set([...prev, ...LOWER_BODY_IDS])));
  };

  const handleToggleMuscle = (id: MuscleId) => {
    setSelectedMuscleIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  };

  const handleGenerateWorkout = () => {
    if (selectedMuscleIds.length === 0) {
      toast.error("Selecciona al menos un grupo muscular objetivo.");
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const blocks: WorkoutBlock[] = [];
      const shuffledMuscles = [...selectedMuscleIds].sort(() => Math.random() - 0.5);
      const roundsCount = duration <= 15 ? 3 : 4;

      // FASE 1: CALENTAMIENTO & ACTIVACIÓN (Siempre generado, switch dentro de la rutina)
      const warmupSelected = WARMUP_EXERCISES.slice(0, 2);
      blocks.push({
        id: "block-warmup",
        type: "warmup",
        title: "FASE 1: CALENTAMIENTO & ACTIVACIÓN",
        subtitle: "Movilidad articular y elevación de temperatura • 1 Serie",
        exercises: warmupSelected.map((w, idx) => ({
          id: `warmup-${idx + 1}`,
          name: w.name,
          muscleId: "espalda",
          muscleName: "Movilidad",
          image: w.image,
          videoUrl: w.videoUrl,
          equipment: w.equipment,
          reps: w.reps,
          weight: w.load,
          description: w.description,
          instructions: w.instructions,
          rounds: [{ roundNumber: 1, isCompleted: false }],
        })),
        rounds: [{ roundNumber: 1, isCompleted: false }],
      });

      const exercisePool: ExerciseItem[] = [];
      let mIdx = 0;
      while (exercisePool.length < 6) {
        const mId = shuffledMuscles[mIdx % shuffledMuscles.length];
        const groupInfo = MUSCLE_GROUPS.find((g) => g.id === mId);
        const catalog = EXERCISE_LIBRARY[mId] || [];

        const matchingCatalog = catalog.filter((ex) => {
          if (isQuietWorkout) {
            const text = (ex.name + " " + ex.description).toLowerCase();
            if (
              text.includes("salto") ||
              text.includes("jump") ||
              text.includes("burpee") ||
              text.includes("impacto") ||
              text.includes("pliom")
            ) {
              return false;
            }
          }
          if (isSmallSpaceOnly) {
            const text = (ex.name + " " + ex.description + " " + ex.equipment).toLowerCase();
            if (
              text.includes("caminata") ||
              text.includes("desplazamiento") ||
              text.includes("correr") ||
              text.includes("trineo")
            ) {
              return false;
            }
          }
          if (isBodyweightOnly) {
            return (
              ex.equipment.toLowerCase().includes("colchoneta") ||
              ex.load.toLowerCase().includes("peso corporal") ||
              ex.equipment.toLowerCase().includes("peso corporal")
            );
          }
          if (workoutType === "Recuperar") {
            return ex.equipment.toLowerCase().includes("rodillo");
          }
          if (workoutType === "Calistenia") {
            return (
              ex.equipment.toLowerCase().includes("barra de dominadas") ||
              ex.equipment.toLowerCase().includes("banco") ||
              ex.equipment.toLowerCase().includes("colchoneta") ||
              ex.load.toLowerCase().includes("peso corporal")
            );
          }
          return selectedEquipment.some((eq) =>
            ex.equipment.toLowerCase().includes(eq.toLowerCase()),
          );
        });

        const activePoolToPick = matchingCatalog.length > 0 ? matchingCatalog : catalog;

        if (activePoolToPick.length > 0) {
          const randEx = activePoolToPick[Math.floor(Math.random() * activePoolToPick.length)];
          if (!exercisePool.some((e) => e.name === randEx.name)) {
            exercisePool.push({
              id: `ex-${Date.now()}-${exercisePool.length + 1}`,
              name: randEx.name,
              muscleId: mId,
              muscleName: groupInfo?.name || mId,
              image: randEx.image || groupInfo?.image || "/gimnasia.png",
              videoUrl: randEx.videoUrl || "/chinupreversewidegrip_x264(2).mp4",
              equipment: randEx.equipment,
              reps: randEx.reps,
              weight: randEx.load,
              description: randEx.description,
              instructions: randEx.instructions,
              rounds: Array.from({ length: roundsCount }, (_, i) => ({
                roundNumber: i + 1,
                isCompleted: false,
              })),
            });
          }
        }
        mIdx++;
        if (mIdx > 35) break;
      }

      if (includeSupersets && workoutType !== "Recuperar" && exercisePool.length >= 2) {
        const block1Rounds: BlockRound[] = Array.from({ length: roundsCount }, (_, i) => ({
          roundNumber: i + 1,
          isCompleted: false,
        }));

        blocks.push({
          id: `block-1`,
          type: "superset",
          title: "SUPERSET A",
          subtitle: `${exercisePool[0].muscleName} + ${exercisePool[1].muscleName} • ${roundsCount} Series`,
          exercises: [exercisePool[0], exercisePool[1]],
          rounds: block1Rounds,
        });

        if (exercisePool.length >= 4) {
          const block2Rounds: BlockRound[] = Array.from({ length: roundsCount }, (_, i) => ({
            roundNumber: i + 1,
            isCompleted: false,
          }));

          blocks.push({
            id: `block-2`,
            type: "superset",
            title: "SUPERSET B",
            subtitle: `${exercisePool[2].muscleName} + ${exercisePool[3].muscleName} • ${roundsCount} Series`,
            exercises: [exercisePool[2], exercisePool[3]],
            rounds: block2Rounds,
          });
        }

        if (exercisePool.length >= 5) {
          const block3Rounds: BlockRound[] = Array.from({ length: 3 }, (_, i) => ({
            roundNumber: i + 1,
            isCompleted: false,
          }));

          blocks.push({
            id: `block-3`,
            type: "standard",
            title: "CORE & FINISHER",
            subtitle: `${exercisePool[4].muscleName} • 3 Series finales`,
            exercises: [exercisePool[4]],
            rounds: block3Rounds,
          });
        }
      } else {
        exercisePool.slice(0, 4).forEach((ex, idx) => {
          const blockRounds: BlockRound[] = Array.from({ length: roundsCount }, (_, i) => ({
            roundNumber: i + 1,
            isCompleted: false,
          }));

          blocks.push({
            id: `block-${idx + 1}`,
            type: "standard",
            title: `BLOQUE ${idx + 1}: ${ex.name.toUpperCase()}`,
            subtitle: `${ex.muscleName} • ${roundsCount} Series`,
            exercises: [ex],
            rounds: blockRounds,
          });
        });
      }

      if (includeCardio && workoutType !== "Recuperar") {
        blocks.push({
          id: `block-cardio`,
          type: "cardio",
          title: "CARDIO FINISHER",
          subtitle: "Intervalos de alta intensidad • 3 Series",
          exercises: [
            {
              id: `cardio-finisher`,
              name: "Máquina de Remo / Cinta HIIT",
              muscleId: "cuadriceps",
              muscleName: "Cardio",
              image: "/seated-hamstring-curl.png",
              videoUrl: "/chinupreversewidegrip_x264(2).mp4",
              equipment: "Máquina de remo / Cinta",
              reps: "60 seg sprint",
              weight: "Máximo ritmo",
              description: "Aceleración metabólica para vaciado de glucógeno y gasto calórico sostenido.",
              instructions: [
                "Realiza 60 segundos de esfuerzo máximo manteniendo técnica firme.",
                "Descansa 30 segundos entre series.",
              ],
              rounds: Array.from({ length: 3 }, (_, i) => ({
                roundNumber: i + 1,
                isCompleted: false,
              })),
            },
          ],
          rounds: Array.from({ length: 3 }, (_, i) => ({
            roundNumber: i + 1,
            isCompleted: false,
          })),
        });
      }

      // FASE FINAL: VUELTA A LA CALMA (Siempre generado, switch dentro de la rutina)
      const cooldownSelected = COOLDOWN_EXERCISES.slice(0, 2);
      blocks.push({
        id: "block-cooldown",
        type: "cooldown",
        title: "FASE FINAL: VUELTA A LA CALMA",
        subtitle: "Elongación pasiva y respiración parasimpática • 1 Serie",
        exercises: cooldownSelected.map((c, idx) => ({
          id: `cooldown-${idx + 1}`,
          name: c.name,
          muscleId: "gluteos",
          muscleName: "Recuperación",
          image: c.image,
          videoUrl: c.videoUrl,
          equipment: c.equipment,
          reps: c.reps,
          weight: c.load,
          description: c.description,
          instructions: c.instructions,
          rounds: [{ roundNumber: 1, isCompleted: false }],
        })),
        rounds: [{ roundNumber: 1, isCompleted: false }],
      });

      setWorkoutBlocks(blocks);
      setIsGenerating(false);
      setIsWorkoutActive(false);
      setWorkoutElapsedSeconds(0);
      setIsWorkoutPaused(false);
      setCurrentView("workout-view");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 300);
  };

  const handleSwapExercise = (newExEntry: ExerciseLibraryEntry) => {
    if (!swapTarget) return;

    setWorkoutBlocks((prev) =>
      prev.map((b) => {
        if (b.id === swapTarget.blockId) {
          return {
            ...b,
            exercises: b.exercises.map((e) =>
              e.id === swapTarget.exerciseId
                ? {
                    ...e,
                    name: newExEntry.name,
                    image: newExEntry.image,
                    videoUrl: newExEntry.videoUrl,
                    equipment: newExEntry.equipment,
                    reps: newExEntry.reps,
                    weight: newExEntry.load,
                    description: newExEntry.description,
                    instructions: newExEntry.instructions,
                  }
                : e,
            ),
          };
        }
        return b;
      }),
    );

    toast.success(`Ejercicio cambiado por: ${newExEntry.name}`);
    setSwapTarget(null);
  };

  // Reorder exercise within a block in REAL TIME while dragging
  const handleDragEnter = (targetBlockId: string, targetIndex: number) => {
    if (!draggedItem) return;
    if (draggedItem.blockId !== targetBlockId) return;
    if (draggedItem.index === targetIndex) return;

    const fromIndex = draggedItem.index;
    setWorkoutBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== targetBlockId) return b;
        const updated = [...b.exercises];
        const [moved] = updated.splice(fromIndex, 1);
        updated.splice(targetIndex, 0, moved);
        return { ...b, exercises: updated };
      }),
    );

    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(30);
      } catch (_) {}
    }

    setDraggedItem({ blockId: targetBlockId, index: targetIndex });
  };

  const handleDropExercise = (targetBlockId: string, toIndex: number) => {
    if (!draggedItem || draggedItem.blockId !== targetBlockId) return;
    handleDragEnter(targetBlockId, toIndex);
    setDraggedItem(null);
  };

  // Reorder entire items in the MAIN WORKOUT list in REAL TIME (warmup and cooldown are locked)
  const handleMainItemDragStart = (e: React.DragEvent, mainIndex: number) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "INPUT" || target.closest("button") || target.closest("input")) {
      e.preventDefault();
      return;
    }
    setDraggedBlockIndex(mainIndex);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `main:${mainIndex}`);
  };

  const handleMainItemDragEnter = (targetMainIndex: number) => {
    if (draggedBlockIndex === null || draggedBlockIndex === targetMainIndex) return;

    const fromIndex = draggedBlockIndex;
    setWorkoutBlocks((prev) => {
      const warmup = prev.filter((b) => b.type === "warmup");
      const main = prev.filter((b) => b.type !== "warmup" && b.type !== "cooldown");
      const cooldown = prev.filter((b) => b.type === "cooldown");

      const updatedMain = [...main];
      const [moved] = updatedMain.splice(fromIndex, 1);
      updatedMain.splice(targetMainIndex, 0, moved);

      return [...warmup, ...updatedMain, ...cooldown];
    });

    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(35);
      } catch (_) {}
    }

    setDraggedBlockIndex(targetMainIndex);
  };

  const handleMainItemDragEnd = () => {
    setDraggedBlockIndex(null);
  };

  // Update Reps / Weight directly inline
  const handleUpdateExerciseValue = (
    blockId: string,
    exerciseId: string,
    field: "reps" | "weight",
    value: string,
  ) => {
    setWorkoutBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== blockId) return b;
        return {
          ...b,
          exercises: b.exercises.map((e) =>
            e.id === exerciseId ? { ...e, [field]: value } : e,
          ),
        };
      }),
    );
  };

  // Alternar unidad entre Repeticiones ('reps') y Segundos ('seg') con 1 toque
  const handleToggleRepsUnit = (
    blockId: string,
    exerciseId: string,
    currentReps?: string,
  ) => {
    const isSeg = getRepsUnit(currentReps) === "seg";
    const num = getNumericReps(currentReps) || "10";
    const newUnit = isSeg ? "reps" : "seg";
    handleUpdateExerciseValue(blockId, exerciseId, "reps", `${num} ${newUnit}`);
    toast.info(`Modalidad: ${newUnit === "seg" ? "Segundos (Tiempo)" : "Repeticiones"}`, {
      duration: 1500,
    });
  };

  // Update Personal Note / Machine Cue inline
  const handleUpdateExerciseNote = (
    blockId: string,
    exerciseId: string,
    note: string,
  ) => {
    setWorkoutBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== blockId) return b;
        return {
          ...b,
          exercises: b.exercises.map((e) =>
            e.id === exerciseId ? { ...e, notes: note } : e,
          ),
        };
      }),
    );
  };

  // Delete exercise
  const handleDeleteExercise = (blockId: string, exerciseId: string) => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([60, 40, 60]);
    }
    setWorkoutBlocks((prev) =>
      prev
        .map((b) => {
          if (b.id !== blockId) return b;
          return {
            ...b,
            exercises: b.exercises.filter((e) => e.id !== exerciseId),
          };
        })
        .filter((b) => b.exercises.length > 0),
    );
    setSwipeOffsets((prev) => {
      const next = { ...prev };
      delete next[exerciseId];
      return next;
    });
    toast.success("Ejercicio eliminado");
  };

  // Touch Swipe handlers for swipe-to-delete
  const handleTouchStart = (e: React.TouchEvent, exerciseId: string) => {
    touchStartCoords.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchMove = (e: React.TouchEvent, exerciseId: string) => {
    if (!touchStartCoords.current) return;
    const diffX = e.touches[0].clientX - touchStartCoords.current.x;
    const diffY = e.touches[0].clientY - touchStartCoords.current.y;

    // Solo deslizar si el movimiento es predominantemente horizontal
    if (Math.abs(diffX) > Math.abs(diffY) && diffX < 0) {
      setSwipeOffsets((prev) => ({
        ...prev,
        [exerciseId]: Math.max(diffX, -100),
      }));
    }
  };

  const handleTouchEnd = (blockId: string, exerciseId: string) => {
    const currentOffset = swipeOffsets[exerciseId] || 0;
    if (currentOffset <= -75) {
      handleDeleteExercise(blockId, exerciseId);
    } else {
      setSwipeOffsets((prev) => ({ ...prev, [exerciseId]: 0 }));
    }
  };

  // Toggle selection inside the smart Add Exercise modal
  const handleToggleSelectAddExercise = (entry: ExerciseLibraryEntry, muscleId: MuscleId) => {
    setSelectedAddExercises((prev) => {
      const exists = prev.some((item) => item.entry.name === entry.name);
      if (exists) {
        return prev.filter((item) => item.entry.name !== entry.name);
      }

      if (addExerciseModalMode === "single" || addExerciseModalMode === "link") {
        return [{ entry, muscleId }];
      }

      // Superset mode (max 2)
      if (prev.length >= 2) {
        return [prev[0], { entry, muscleId }];
      }
      return [...prev, { entry, muscleId }];
    });
  };

  // Confirm adding selected exercises (either as single standard block, linked superset, or new superset block)
  const handleConfirmAddExercises = () => {
    if (selectedAddExercises.length === 0) return;
    const roundsCount = duration <= 15 ? 3 : 4;

    // Case 0: ADDING SPECIFICALLY TO WARMUP OR COOLDOWN BLOCK
    if (addExerciseBlockId === "block-warmup" || addExerciseBlockId === "block-cooldown") {
      const targetBlock = workoutBlocks.find((b) => b.id === addExerciseBlockId);
      if (!targetBlock) return;

      const item = selectedAddExercises[0];
      const groupInfo = MUSCLE_GROUPS.find((g) => g.id === item.muscleId);
      const newExItem: ExerciseItem = {
        id: `ex-added-${Date.now()}`,
        name: item.entry.name,
        muscleId: item.muscleId,
        muscleName: groupInfo?.name || item.muscleId,
        image: item.entry.image,
        videoUrl: item.entry.videoUrl,
        equipment: item.entry.equipment,
        reps: item.entry.reps,
        weight: item.entry.load,
        description: item.entry.description,
        instructions: item.entry.instructions,
        rounds: [{ roundNumber: 1, isCompleted: false }],
      };

      setWorkoutBlocks((prev) =>
        prev.map((b) => {
          if (b.id !== addExerciseBlockId) return b;
          return {
            ...b,
            exercises: [...b.exercises, newExItem],
          };
        }),
      );

      toast.success(
        `Añadido a ${targetBlock.type === "warmup" ? "Calentamiento" : "Vuelta a la Calma"}: ${item.entry.name}`,
      );
      setSelectedAddExercises([]);
      setAddExerciseBlockId(null);
      return;
    }

    // Case 1: LINKING AN EXISTING EXERCISE INTO A SUPERSET
    if (addExerciseModalMode === "link" && addExerciseBlockId) {
      const block = workoutBlocks.find((b) => b.id === addExerciseBlockId);
      if (!block || block.exercises.length === 0) return;

      const secondItem = selectedAddExercises[0];
      const groupInfo = MUSCLE_GROUPS.find((g) => g.id === secondItem.muscleId);
      const secondEx: ExerciseItem = {
        id: `ex-added-${Date.now()}`,
        name: secondItem.entry.name,
        muscleId: secondItem.muscleId,
        muscleName: groupInfo?.name || secondItem.muscleId,
        image: secondItem.entry.image,
        videoUrl: secondItem.entry.videoUrl,
        equipment: secondItem.entry.equipment,
        reps: secondItem.entry.reps,
        weight: secondItem.entry.load,
        description: secondItem.entry.description,
        instructions: secondItem.entry.instructions,
        rounds: Array.from({ length: roundsCount }, (_, i) => ({
          roundNumber: i + 1,
          isCompleted: false,
        })),
      };

      const updatedExercises = [...block.exercises, secondEx];
      setWorkoutBlocks((prev) =>
        prev.map((b) => {
          if (b.id !== addExerciseBlockId) return b;
          return {
            ...b,
            type: "superset",
            title: `SUPERSET: ${block.exercises[0].name.toUpperCase()} + ${secondEx.name.toUpperCase()}`,
            subtitle: `${block.exercises[0].muscleName} + ${secondEx.muscleName} • ${roundsCount} Series`,
            exercises: updatedExercises,
            rounds: Array.from({ length: roundsCount }, (_, i) => ({
              roundNumber: i + 1,
              isCompleted: false,
            })),
          };
        }),
      );

      toast.success(`¡Superserie creada con ${secondEx.name}!`);
    }
    // Case 2: CREATING A NEW SUPERSET BLOCK (2 EXERCISES SELECTED OR SUPERSET MODE)
    else if (selectedAddExercises.length >= 2 || addExerciseModalMode === "superset") {
      const itemsToCreate = selectedAddExercises.slice(0, 2);
      const createdExercises: ExerciseItem[] = itemsToCreate.map((item, idx) => {
        const groupInfo = MUSCLE_GROUPS.find((g) => g.id === item.muscleId);
        return {
          id: `ex-added-${Date.now()}-${idx + 1}`,
          name: item.entry.name,
          muscleId: item.muscleId,
          muscleName: groupInfo?.name || item.muscleId,
          image: item.entry.image,
          videoUrl: item.entry.videoUrl,
          equipment: item.entry.equipment,
          reps: item.entry.reps,
          weight: item.entry.load,
          description: item.entry.description,
          instructions: item.entry.instructions,
          rounds: Array.from({ length: roundsCount }, (_, i) => ({
            roundNumber: i + 1,
            isCompleted: false,
          })),
        };
      });

      const supersetBlock: WorkoutBlock = {
        id: `block-superset-${Date.now()}`,
        type: "superset",
        title: `SUPERSET: ${createdExercises[0].name.toUpperCase()} + ${createdExercises[1]?.name?.toUpperCase() || ""}`,
        subtitle: `${createdExercises[0].muscleName} + ${createdExercises[1]?.muscleName || ""} • ${roundsCount} Series`,
        exercises: createdExercises,
        rounds: Array.from({ length: roundsCount }, (_, i) => ({
          roundNumber: i + 1,
          isCompleted: false,
        })),
      };

      setWorkoutBlocks((prev) => {
        const cooldownIdx = prev.findIndex((b) => b.type === "cooldown");
        if (cooldownIdx !== -1) {
          const copy = [...prev];
          copy.splice(cooldownIdx, 0, supersetBlock);
          return copy;
        }
        return [...prev, supersetBlock];
      });

      toast.success("¡Nueva Superserie añadida a la rutina!");
    }
    // Case 3: CREATING A STANDALONE SINGLE EXERCISE
    else {
      const item = selectedAddExercises[0];
      const groupInfo = MUSCLE_GROUPS.find((g) => g.id === item.muscleId);
      const newExItem: ExerciseItem = {
        id: `ex-added-${Date.now()}`,
        name: item.entry.name,
        muscleId: item.muscleId,
        muscleName: groupInfo?.name || item.muscleId,
        image: item.entry.image,
        videoUrl: item.entry.videoUrl,
        equipment: item.entry.equipment,
        reps: item.entry.reps,
        weight: item.entry.load,
        description: item.entry.description,
        instructions: item.entry.instructions,
        rounds: Array.from({ length: roundsCount }, (_, i) => ({
          roundNumber: i + 1,
          isCompleted: false,
        })),
      };

      const newBlock: WorkoutBlock = {
        id: `block-${Date.now()}`,
        type: "standard",
        title: item.entry.name.toUpperCase(),
        subtitle: `${groupInfo?.name || item.muscleId} • ${roundsCount} Series`,
        exercises: [newExItem],
        rounds: Array.from({ length: roundsCount }, (_, i) => ({
          roundNumber: i + 1,
          isCompleted: false,
        })),
      };

      setWorkoutBlocks((prev) => {
        const cooldownIdx = prev.findIndex((b) => b.type === "cooldown");
        if (cooldownIdx !== -1) {
          const copy = [...prev];
          copy.splice(cooldownIdx, 0, newBlock);
          return copy;
        }
        return [...prev, newBlock];
      });

      toast.success(`Añadido a la rutina: ${item.entry.name}`);
    }

    setSelectedAddExercises([]);
    setAddExerciseBlockId(null);
  };

  const handleAddExerciseToBlock = (blockId: string, exEntry: ExerciseLibraryEntry, muscleId: MuscleId) => {
    setSelectedAddExercises([{ entry: exEntry, muscleId }]);
    handleConfirmAddExercises();
  };

  const handleAddRoundToExercise = (blockId: string, exerciseId?: string) => {
    setWorkoutBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== blockId) return b;

        if (exerciseId && b.type !== "superset") {
          return {
            ...b,
            exercises: b.exercises.map((e) => {
              if (e.id !== exerciseId) return e;
              const currentRounds = e.rounds || [];
              const nextNum = currentRounds.length + 1;
              return {
                ...e,
                rounds: [...currentRounds, { roundNumber: nextNum, isCompleted: false }],
              };
            }),
          };
        }

        const nextNum = b.rounds.length + 1;
        return {
          ...b,
          rounds: [...b.rounds, { roundNumber: nextNum, isCompleted: false }],
          exercises: b.exercises.map((e) => ({
            ...e,
            rounds: [...(e.rounds || []), { roundNumber: nextNum, isCompleted: false }],
          })),
        };
      }),
    );

    toast.success("Serie extra añadida", { duration: 1500 });
  };

  const handleRemoveRoundFromExercise = (blockId: string, exerciseId?: string) => {
    setWorkoutBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== blockId) return b;

        if (exerciseId && b.type !== "superset") {
          return {
            ...b,
            exercises: b.exercises.map((e) => {
              if (e.id !== exerciseId) return e;
              const currentRounds = e.rounds || [];
              if (currentRounds.length <= 1) return e;
              return {
                ...e,
                rounds: currentRounds.slice(0, -1),
              };
            }),
          };
        }

        if (b.rounds.length <= 1) return b;
        return {
          ...b,
          rounds: b.rounds.slice(0, -1),
          exercises: b.exercises.map((e) => ({
            ...e,
            rounds: (e.rounds || []).slice(0, -1),
          })),
        };
      }),
    );

    toast.info("Serie removida", { duration: 1500 });
  };

  const handleStartWorkout = () => {
    setIsWorkoutActive(true);
    setIsWorkoutPaused(false);
    toast.success("¡Entrenamiento iniciado! Sigue el orden de bloques.", {
      icon: "⏱️",
    });
  };

  const handleToggleRound = (blockId: string, roundNumber: number, exerciseId?: string) => {
    const block = workoutBlocks.find((b) => b.id === blockId);
    if (!block) return;

    // Toggle directo para ejercicios de Calentamiento y Vuelta a la Calma (sin RPE)
    if (exerciseId && (block.type === "warmup" || block.type === "cooldown")) {
      setWorkoutBlocks((prev) =>
        prev.map((b) => {
          if (b.id !== blockId) return b;
          return {
            ...b,
            exercises: b.exercises.map((e) => {
              if (e.id !== exerciseId) return e;
              const wasCompleted = e.rounds?.[0]?.isCompleted;
              return {
                ...e,
                rounds: [{ roundNumber: 1, isCompleted: !wasCompleted }],
              };
            }),
          };
        }),
      );
      return;
    }

    if (exerciseId && block.type !== "superset") {
      const exercise = block.exercises.find((e) => e.id === exerciseId);
      const round = exercise?.rounds?.find((r) => r.roundNumber === roundNumber);
      if (!round) return;

      if (round.isCompleted) {
        setWorkoutBlocks((prev) =>
          prev.map((b) => {
            if (b.id !== blockId) return b;
            return {
              ...b,
              exercises: b.exercises.map((e) => {
                if (e.id !== exerciseId) return e;
                return {
                  ...e,
                  rounds: (e.rounds || []).map((r) =>
                    r.roundNumber === roundNumber
                      ? { ...r, isCompleted: false, rating: undefined }
                      : r,
                  ),
                };
              }),
            };
          }),
        );
      } else {
        if (!isWorkoutActive) {
          setIsWorkoutActive(true);
          setIsWorkoutPaused(false);
        }
        setRpeDialogState({
          blockId,
          exerciseId,
          roundNumber,
          blockTitle: exercise?.name || block.title,
        });
      }
      return;
    }

    const round = block.rounds.find((r) => r.roundNumber === roundNumber);
    if (!round) return;

    if (round.isCompleted) {
      setWorkoutBlocks((prev) =>
        prev.map((b) => {
          if (b.id === blockId) {
            return {
              ...b,
              rounds: b.rounds.map((r) =>
                r.roundNumber === roundNumber
                  ? { ...r, isCompleted: false, rating: undefined }
                  : r,
              ),
            };
          }
          return b;
        }),
      );
    } else {
      if (!isWorkoutActive) {
        setIsWorkoutActive(true);
        setIsWorkoutPaused(false);
      }
      setRpeDialogState({
        blockId,
        roundNumber,
        blockTitle: block.title,
      });
    }
  };

  const handleSelectRpeRating = (level: ExertionLevel) => {
    if (!rpeDialogState) return;

    const { blockId, exerciseId, roundNumber, blockTitle } = rpeDialogState;
    const opt = EXERTION_OPTIONS.find((o) => o.key === level);

    setWorkoutBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== blockId) return b;

        if (exerciseId && b.type !== "superset") {
          return {
            ...b,
            exercises: b.exercises.map((e) => {
              if (e.id !== exerciseId) return e;
              return {
                ...e,
                rounds: (e.rounds || []).map((r) =>
                  r.roundNumber === roundNumber
                    ? { ...r, isCompleted: true, rating: level }
                    : r,
                ),
              };
            }),
          };
        }

        if (b.id === blockId) {
          if (b.type === "standard" && b.exercises.length > 0) {
            return {
              ...b,
              rounds: b.rounds.map((r) =>
                r.roundNumber === roundNumber
                  ? { ...r, isCompleted: true, rating: level }
                  : r,
              ),
              exercises: b.exercises.map((e) => ({
                ...e,
                rounds: (e.rounds || []).map((r) =>
                  r.roundNumber === roundNumber
                    ? { ...r, isCompleted: true, rating: level }
                    : r,
                ),
              })),
            };
          }
          return {
            ...b,
            rounds: b.rounds.map((r) =>
              r.roundNumber === roundNumber
                ? { ...r, isCompleted: true, rating: level }
                : r,
            ),
          };
        }
        return b;
      }),
    );

    setRpeDialogState(null);

    if (opt) {
      setRestTimerState({
        isOpen: true,
        secondsLeft: opt.defaultRestSecs,
        totalSeconds: opt.defaultRestSecs,
        blockTitle,
        roundNumber,
        ratingKey: level,
        isPaused: false,
      });
    }
  };

  const activeWorkoutBlocks = useMemo(() => {
    return workoutBlocks.filter((b) => {
      if (b.type === "warmup" && !includeWarmup) return false;
      if (b.type === "cooldown" && !includeCooldown) return false;
      return true;
    });
  }, [workoutBlocks, includeWarmup, includeCooldown]);

  const totalRoundsCount = useMemo(() => {
    return activeWorkoutBlocks.reduce((acc, b) => {
      if (b.type === "superset") {
        return acc + b.rounds.length;
      }
      return acc + b.exercises.reduce((exAcc, ex) => exAcc + (ex.rounds?.length || b.rounds.length), 0);
    }, 0);
  }, [activeWorkoutBlocks]);

  const completedRoundsCount = useMemo(() => {
    return activeWorkoutBlocks.reduce((acc, b) => {
      if (b.type === "superset") {
        return acc + b.rounds.filter((r) => r.isCompleted).length;
      }
      return acc + b.exercises.reduce((exAcc, ex) => exAcc + (ex.rounds?.filter((r) => r.isCompleted).length || 0), 0);
    }, 0);
  }, [workoutBlocks]);

  const progressPercentage = useMemo(() => {
    if (totalRoundsCount === 0) return 0;
    return Math.round((completedRoundsCount / totalRoundsCount) * 100);
  }, [completedRoundsCount, totalRoundsCount]);

  const workoutTitle = useMemo(() => {
    const trainedMuscles = selectedMuscleIds
      .map((id) => MUSCLE_GROUPS.find((g) => g.id === id)?.name)
      .filter(Boolean);

    if (workoutType === "Recuperar") {
      if (isAllSelected) return "Recuperación Activa: Cuerpo Completo";
      if (isUpperSelected) return "Recuperación: Tren Superior";
      if (isLowerSelected) return "Recuperación: Tren Inferior";
      return `Recuperación: ${trainedMuscles.slice(0, 2).join(" & ")}`;
    }

    if (workoutType === "Calistenia") {
      if (isAllSelected) return "Calistenia: Cuerpo Completo";
      if (isUpperSelected) return "Calistenia: Tren Superior";
      if (isLowerSelected) return "Calistenia: Tren Inferior";
      return `Calistenia: ${trainedMuscles.slice(0, 2).join(" & ")}`;
    }

    if (workoutType === "HIIT") {
      if (isAllSelected) return "HIIT Metabólico: Full Body";
      return `HIIT: ${trainedMuscles.slice(0, 2).join(" & ")}`;
    }

    if (isAllSelected) return `Fuerza Total: Cuerpo Completo`;
    if (isUpperSelected) return `Fuerza: Tren Superior`;
    if (isLowerSelected) return `Fuerza: Tren Inferior`;
    if (trainedMuscles.length > 0) return `Fuerza: ${trainedMuscles.slice(0, 2).join(" & ")}`;
    return `Sesión Personalizada de ${workoutType}`;
  }, [workoutType, selectedMuscleIds, isAllSelected, isUpperSelected, isLowerSelected]);

  const handleAttemptFinishWorkout = () => {
    setIsWorkoutPaused(true);
    const incompleteCount = totalRoundsCount - completedRoundsCount;
    if (incompleteCount > 0) {
      setShowIncompleteConfirmDialog(true);
    } else {
      setShowCompletionModal(true);
    }
  };

  const executeSaveWorkout = (rating: "ligero" | "perfecto" | "extenuante") => {
    const trainedMuscles = Array.from(new Set(selectedMuscleIds));
    const fatigueMap: Partial<Record<MuscleId, number>> = {};
    const fatigueAmount =
      workoutType === "Recuperar"
        ? -15
        : rating === "extenuante"
          ? 44
          : rating === "ligero"
            ? 20
            : 32;

    trainedMuscles.forEach((mId) => {
      fatigueMap[mId] = fatigueAmount;
    });

    applyFatigueToMuscles(fatigueMap);

    const now = new Date();
    const timeStr = now.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
    const dateStr = now.toISOString().split("T")[0];
    const totalMinutesTrained = Math.max(1, Math.round(workoutElapsedSeconds / 60));

    const ratingLabel =
      rating === "extenuante"
        ? "Intensidad Extenuante"
        : rating === "ligero"
          ? "Intensidad Ligera"
          : "Intensidad Óptima";

    // Cálculo fisiológico de Puntos MET (Equivalente Metabólico x Minutos x Percepción de Esfuerzo)
    const WORKOUT_MET_RATES: Record<WorkoutType, Record<"Baja" | "Moderada" | "Alta", number>> = {
      Fuerza: { Baja: 3.8, Moderada: 5.0, Alta: 6.5 },
      Calistenia: { Baja: 4.0, Moderada: 5.5, Alta: 8.0 },
      HIIT: { Baja: 6.0, Moderada: 8.5, Alta: 12.0 },
      Recuperar: { Baja: 2.0, Moderada: 2.8, Alta: 3.5 },
    };

    const baseMetRate = WORKOUT_MET_RATES[workoutType]?.[intensity] ?? 5.0;
    const ratingMultiplier = rating === "extenuante" ? 1.15 : rating === "ligero" ? 0.85 : 1.0;
    const metPoints = Math.max(15, Math.round(baseMetRate * ratingMultiplier * totalMinutesTrained));

    const muscleImages = trainedMuscles.map((mId) => {
      const group = MUSCLE_GROUPS.find((g) => g.id === mId);
      return {
        id: mId,
        name: group?.name || mId,
        image: group?.image || "/gimnasia.png",
      };
    });

    const newWorkoutItem = {
      id: `workout-${Date.now()}`,
      type: "workout",
      time: timeStr,
      date: dateStr,
      title: workoutTitle,
      subtitle: `${totalMinutesTrained} min • ${completedRoundsCount}/${totalRoundsCount} Series • ${ratingLabel}`,
      desc: `${workoutBlocks.length} bloques biomecánicos completados con sobrecarga progresiva.`,
      metPoints: metPoints,
      tag: `${metPoints} Pts MET`,
      musclesWorked: trainedMuscles,
      muscleImages: muscleImages,
      coachFeedback:
        workoutType === "Recuperar"
          ? `Sesión de recuperación miofascial completada (${totalMinutesTrained} min). La oxigenación y distensión tisular acelerarán la regeneración de tus fibras. Sumaste ${metPoints} Puntos MET a tu racha de actividad diaria.`
          : rating === "extenuante"
            ? `Sesión de alta demanda completada (${totalMinutesTrained} min). Tus grupos musculares recibieron sobrecarga profunda; sumaste ${metPoints} Puntos MET a tu racha de actividad diaria.`
            : rating === "ligero"
              ? `Completaste tu sesión (${totalMinutesTrained} min). Sumaste ${metPoints} Puntos MET a tu racha diaria. El Coach calibrará un incremento progresivo para la próxima sesión.`
              : `Excelente sesión en zona óptima (${totalMinutesTrained} min, ${completedRoundsCount} series). Sumaste ${metPoints} Puntos MET a tu racha de actividad para consolidar tu estímulo metabólico.`,
    };

    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("shakerfy_user_timeline_items");
      let currentList: any[] = [];
      if (saved) {
        try {
          currentList = JSON.parse(saved);
        } catch (_) {}
      }
      const updated = [newWorkoutItem, ...currentList];
      localStorage.setItem("shakerfy_user_timeline_items", JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("shakerfy:timeline-update"));

      // Registrar aprendizaje en la Memoria de la IA
      try {
        const existingMemRaw = localStorage.getItem("shakerfy_ai_memory");
        const currentMems: any[] = existingMemRaw ? JSON.parse(existingMemRaw) : [];
        let trainingMemoryText = "";
        let trainingCategory = "intensidad";

        if (rating === "ligero") {
          trainingMemoryText = `Sesión de ${workoutTitle} calificada como ligera: Subir intensidad y carga en próximos bloques`;
          trainingCategory = "intensidad";
        } else if (rating === "extenuante") {
          trainingMemoryText = `Sesión de ${workoutTitle} de alta exigencia: Priorizar tiempos de recuperación y técnica`;
          trainingCategory = "intensidad";
        } else {
          trainingMemoryText = `Sesión de ${workoutTitle} en zona óptima: Mantener cadencia y progresión biomecánica`;
          trainingCategory = "intensidad";
        }

        const newMem = {
          id: `mem-train-${Date.now()}`,
          text: trainingMemoryText,
          domain: "entrenamiento",
          category: trainingCategory,
          createdAt: new Date().toISOString(),
        };

        const filteredMems = currentMems.filter(
          (m: any) => !m.text.includes(workoutTitle) || m.domain !== "entrenamiento",
        );
        const updatedMems = [newMem, ...filteredMems];
        localStorage.setItem("shakerfy_ai_memory", JSON.stringify(updatedMems));
      } catch (_) {}
    }

    setIsWorkoutActive(false);
    setWorkoutElapsedSeconds(0);
    setShowCompletionModal(false);
    toast.success("¡Entrenamiento completado y guardado en tu diario!");
    navigateToAiCoach();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // ==========================================
  // VISTA 2: SELECCIÓN DE EQUIPAMIENTO (FILTRADO POR TIPO)
  // ==========================================
  if (currentView === "equipment") {
    const filteredCategories = EQUIPMENT_CATEGORIES.map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          allowedEquipmentForType.includes(item) &&
          item.toLowerCase().includes(equipmentSearch.toLowerCase()),
      ),
    })).filter((cat) => cat.items.length > 0);

    const handleToggleEquipment = (item: string) => {
      const isCurrentlySelected = selectedEquipment.includes(item);
      const updated = isCurrentlySelected
        ? savedEquipment.filter((x) => x !== item)
        : Array.from(new Set([...savedEquipment, item]));
      saveEquipmentList(updated);
    };

    const handleSelectAllForType = () => {
      const updated = Array.from(new Set([...savedEquipment, ...allowedEquipmentForType]));
      saveEquipmentList(updated);
    };

    const handleClearAllForType = () => {
      const updated = savedEquipment.filter((x) => !allowedEquipmentForType.includes(x));
      saveEquipmentList(updated);
    };

    return (
      <div className="space-y-6 max-w-2xl mx-auto pb-28 pt-2 animate-in fade-in duration-200 text-left font-sans">
        <div className="flex items-center justify-between gap-3 border-b border-border/40 pb-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCurrentView("config")}
              className="w-10 h-10 rounded-2xl border border-border/80 bg-card hover:bg-secondary flex items-center justify-center text-foreground transition shadow-xs cursor-pointer active:scale-95 shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                Equipamiento ({workoutType})
              </h1>
              <p className="text-xs text-muted-foreground font-medium">
                {selectedEquipment.length} de {allowedEquipmentForType.length} equipos activos (Guardado)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAllForType}
              className="rounded-xl text-[11px] font-bold h-8 px-3 cursor-pointer"
            >
              Todos
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAllForType}
              className="rounded-xl text-[11px] font-bold h-8 px-3 cursor-pointer text-muted-foreground"
            >
              Limpiar
            </Button>
          </div>
        </div>

        {allowedEquipmentForType.length > 3 && (
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder={`Buscar en equipos de ${workoutType}...`}
              value={equipmentSearch}
              onChange={(e) => setEquipmentSearch(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-2xl bg-card border border-border/80 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition"
            />
          </div>
        )}

        <div className="space-y-6">
          {filteredCategories.map((catGroup) => (
            <div key={catGroup.category} className="space-y-2.5">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 px-1">
                {catGroup.category}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {catGroup.items.map((item) => {
                  const isSelected = selectedEquipment.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleToggleEquipment(item)}
                      className={cn(
                        "w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer text-left",
                        isSelected
                          ? "bg-card border-foreground/50 shadow-xs ring-1 ring-foreground/20"
                          : "bg-card/60 border-border/60 hover:bg-secondary/40 text-muted-foreground",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold transition",
                            isSelected
                              ? "bg-foreground text-background"
                              : "bg-secondary text-muted-foreground",
                          )}
                        >
                          <Dumbbell className="w-3.5 h-3.5" />
                        </div>
                        <span className={cn("text-xs font-semibold truncate", isSelected ? "text-foreground font-bold" : "text-muted-foreground")}>
                          {item}
                        </span>
                      </div>
                      <div
                        className={cn(
                          "w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 ml-2",
                          isSelected
                            ? "bg-foreground border-foreground text-background"
                            : "border-border/80 bg-background",
                        )}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="fixed bottom-6 left-0 right-0 max-w-md mx-auto px-4 z-40">
          <Button
            onClick={() => setCurrentView("config")}
            className="w-full h-12 rounded-2xl bg-foreground text-background font-bold text-xs shadow-xl cursor-pointer hover:opacity-90 transition"
          >
            Guardar y Continuar ({selectedEquipment.length} equipos)
          </Button>
        </div>
      </div>
    );
  }

  // ==========================================
  // VISTA 3: SELECCIÓN DE LESIONES
  // ==========================================
  if (currentView === "injuries") {
    return (
      <div className="space-y-6 max-w-2xl mx-auto pb-28 pt-2 animate-in fade-in duration-200 text-left font-sans">
        <div className="flex items-center gap-3 border-b border-border/40 pb-4">
          <button
            type="button"
            onClick={() => setCurrentView("config")}
            className="w-10 h-10 rounded-2xl border border-border/80 bg-card hover:bg-secondary flex items-center justify-center text-foreground transition shadow-xs cursor-pointer active:scale-95 shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
              Lesiones y Restricciones
            </h1>
            <p className="text-xs text-muted-foreground font-medium">
              Ajuste biomecánico de ángulos y ejercicios seguros
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          {INJURY_OPTIONS.map((opt) => {
            const isSelected = selectedInjury === opt.label;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setSelectedInjury(opt.label);
                  setTimeout(() => setCurrentView("config"), 160);
                }}
                className={cn(
                  "w-full p-4 sm:p-5 rounded-3xl border transition-all cursor-pointer text-left space-y-1.5",
                  isSelected
                    ? "bg-card border-foreground/50 shadow-md ring-1 ring-foreground/20"
                    : "bg-card/70 border-border/70 hover:bg-secondary/40",
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition",
                        isSelected
                          ? "bg-foreground text-background"
                          : "bg-secondary text-muted-foreground",
                      )}
                    >
                      <Shield className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-foreground">{opt.label}</span>
                  </div>
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border flex items-center justify-center transition-all",
                      isSelected
                        ? "bg-foreground border-foreground text-background"
                        : "border-border/80 bg-background",
                    )}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pl-12">
                  {opt.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ==========================================
  // VISTA 4: PANTALLA DEL WORKOUT (ESTILO FREELETICS / HEVY ULTRA-LIMPIO)
  // ==========================================
  if (currentView === "workout-view") {
    return (
      <div className="space-y-6 max-w-2xl mx-auto pb-36 pt-2 animate-in fade-in duration-300 text-left font-sans">
        {/* Top Header Navigation */}
        <div className="flex items-center justify-end pb-1">
          <button
            type="button"
            onClick={navigateToAiCoach}
            className="w-10 h-10 rounded-2xl border border-border/80 bg-card hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition shadow-xs cursor-pointer active:scale-95"
            title="Cerrar y volver a AI Coach"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workout Hero Header */}
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-foreground text-background font-bold text-[10px] uppercase tracking-wider rounded-full px-2.5">
                {workoutType}
              </Badge>
              <Badge variant="secondary" className="font-semibold text-[10px] rounded-full px-2.5">
                {intensity} Intensidad
              </Badge>
              {includeSupersets && workoutType !== "Recuperar" && !isBodyweightOnly && (
                <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 font-bold text-[10px] rounded-full px-2.5">
                  <Zap className="w-3 h-3 mr-1 inline" /> Superseries
                </Badge>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              {workoutTitle}
            </h1>
          </div>

          {/* Clean Metric Pills */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-foreground font-semibold">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span>{duration} min</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-foreground font-semibold">
              <Layers className="w-3.5 h-3.5 text-emerald-500" />
              <span>{workoutBlocks.length} Bloques ({totalRoundsCount} Series)</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-foreground font-semibold">
              <Activity className="w-3.5 h-3.5 text-amber-500" />
              <span>{intensity} Intensidad</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-medium">Progreso del workout</span>
              <span className="font-bold text-foreground">{completedRoundsCount} de {totalRoundsCount} series ({progressPercentage}%)</span>
            </div>
            <Progress value={progressPercentage} className="h-2 rounded-full" />
          </div>
        </div>

        {/* CONTENIDO DEL WORKOUT DIVIDIDO EN 3 FASES CLARAS */}
        {(() => {
          const warmupBlock = workoutBlocks.find((b) => b.type === "warmup");
          const mainBlocks = workoutBlocks.filter((b) => b.type !== "warmup" && b.type !== "cooldown");
          const cooldownBlock = workoutBlocks.find((b) => b.type === "cooldown");

          return (
            <div className="space-y-6 pt-2">
              {/* ========================================================= */}
              {/* FASE 1: CALENTAMIENTO & ACTIVACIÓN (INTERACTIVA)          */}
              {/* ========================================================= */}
              {warmupBlock && (
                <div className="rounded-3xl border border-blue-500/30 bg-card overflow-hidden shadow-xs transition-all">
                  <div className="p-4 border-b border-blue-500/20 bg-blue-500/10 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-blue-500 shrink-0" />
                      <div>
                        <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                          {warmupBlock.title}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium">
                          Movilidad articular y elevación de temperatura
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-muted-foreground hidden sm:inline">
                        {includeWarmup ? "Activado" : "Omitido"}
                      </span>
                      <Switch
                        checked={includeWarmup}
                        onCheckedChange={setIncludeWarmup}
                        className="cursor-pointer data-[state=checked]:bg-blue-500"
                        title="Activar u omitir fase de calentamiento"
                      />
                    </div>
                  </div>

                  {includeWarmup ? (
                    <div className="p-3.5 space-y-2.5">
                      {warmupBlock.exercises.map((ex) => {
                        const currentSwipeOffset = swipeOffsets[ex.id] || 0;

                        return (
                          <div key={ex.id} className="relative rounded-2xl overflow-hidden">
                            {currentSwipeOffset < 0 && (
                              <div
                                onClick={() => handleDeleteExercise(warmupBlock.id, ex.id)}
                                className="absolute inset-0 bg-rose-600 rounded-2xl flex items-center justify-end px-5 text-white font-bold text-xs gap-2 cursor-pointer z-0"
                              >
                                <Trash2 className="w-5 h-5 animate-pulse" />
                                <span>Eliminar</span>
                              </div>
                            )}

                            <div
                              onTouchStart={(e) => handleTouchStart(e, ex.id)}
                              onTouchMove={(e) => handleTouchMove(e, ex.id)}
                              onTouchEnd={() => handleTouchEnd(warmupBlock.id, ex.id)}
                              style={{
                                transform: `translateX(${currentSwipeOffset}px)`,
                                transition: currentSwipeOffset === 0 ? "transform 0.2s ease-out" : "none",
                              }}
                              className="relative z-10 p-3 rounded-2xl bg-secondary/30 border border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                {/* Thumbnail con Play */}
                                <div
                                  onClick={() => setVideoModalExercise(ex)}
                                  className="relative w-11 h-11 rounded-xl bg-card p-1 flex items-center justify-center shrink-0 border border-border/70 shadow-2xs group/thumb hover:scale-105 transition-transform overflow-hidden cursor-pointer"
                                  title="Toca para ver el video con la técnica"
                                >
                                  <img src={ex.image} alt={ex.name} className="w-full h-full object-contain" />
                                  <div className="absolute inset-0 bg-black/30 group-hover/thumb:bg-black/45 flex items-center justify-center transition-colors">
                                    <div className="w-4 h-4 rounded-full bg-white/90 dark:bg-black/80 flex items-center justify-center shadow-xs">
                                      <Play className="w-2 h-2 text-foreground fill-current ml-0.5" />
                                    </div>
                                  </div>
                                </div>

                                <div className="min-w-0 flex-1">
                                  <h4
                                    onClick={() => setVideoModalExercise(ex)}
                                    className="text-xs font-bold text-foreground hover:text-indigo-500 transition truncate cursor-pointer"
                                  >
                                    {ex.name}
                                  </h4>
                                  <p className="text-[11px] text-muted-foreground truncate">
                                    {ex.reps} • {ex.equipment}
                                  </p>

                                  {/* Badge de Nota si existe */}
                                  {ex.notes && expandedNoteExerciseId !== ex.id && (
                                    <div
                                      onClick={() => setExpandedNoteExerciseId(ex.id)}
                                      className="flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-[10px] font-medium cursor-pointer hover:bg-amber-500/15 transition w-fit max-w-full"
                                      title="Toca para editar tu nota"
                                    >
                                      <FileText className="w-2.5 h-2.5 shrink-0" />
                                      <span className="truncate">{ex.notes}</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                {/* Píldora de Nota, Cambiar y Eliminar */}
                                <div className="flex items-center bg-card rounded-full border border-border/70 p-1 gap-1 shadow-2xs">
                                  <button
                                    type="button"
                                    onClick={() => setExpandedNoteExerciseId(expandedNoteExerciseId === ex.id ? null : ex.id)}
                                    className={cn(
                                      "w-7 h-7 rounded-full flex items-center justify-center transition cursor-pointer",
                                      ex.notes
                                        ? "text-amber-500 hover:text-amber-600 bg-amber-500/10"
                                        : "text-muted-foreground hover:text-foreground",
                                    )}
                                    title={ex.notes ? "Editar nota" : "Añadir nota o ajuste"}
                                  >
                                    <FileText className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      setSwapTarget({
                                        blockId: warmupBlock.id,
                                        exerciseId: ex.id,
                                        muscleId: ex.muscleId,
                                        currentExercise: ex,
                                      })
                                    }
                                    className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition cursor-pointer"
                                    title="Cambiar ejercicio de calentamiento"
                                  >
                                    <ArrowLeftRight className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteExercise(warmupBlock.id, ex.id)}
                                    className="w-7 h-7 rounded-full hidden sm:flex items-center justify-center text-muted-foreground hover:text-rose-600 transition cursor-pointer"
                                    title="Eliminar ejercicio (en móvil desliza a la izquierda)"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                {/* Botón Listo */}
                                <button
                                  type="button"
                                  onClick={() => handleToggleRound(warmupBlock.id, 1, ex.id)}
                                  className={cn(
                                    "h-8 px-3.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0",
                                    ex.rounds?.[0]?.isCompleted
                                      ? "bg-foreground text-background border-foreground shadow-xs font-black"
                                      : "bg-card border-border/80 text-foreground hover:bg-secondary/60",
                                  )}
                                >
                                  {ex.rounds?.[0]?.isCompleted ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-400" />
                                      <span>Listo</span>
                                    </>
                                  ) : (
                                    <span>Listo</span>
                                  )}
                                </button>
                              </div>

                              {/* Input Desplegado de Nota */}
                              {expandedNoteExerciseId === ex.id && (
                                <div className="w-full pt-2 border-t border-border/40 space-y-1">
                                  <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                    <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                                      <FileText className="w-3 h-3" />
                                      Nota personal / Ajuste
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => setExpandedNoteExerciseId(null)}
                                      className="text-xs font-bold text-foreground hover:underline cursor-pointer"
                                    >
                                      Cerrar
                                    </button>
                                  </div>
                                  <input
                                    type="text"
                                    value={ex.notes || ""}
                                    onChange={(e) => handleUpdateExerciseNote(warmupBlock.id, ex.id, e.target.value)}
                                    placeholder="Ej: Movilidad lenta • 20 segundos por lado"
                                    autoFocus
                                    className="w-full text-xs font-medium text-foreground bg-secondary/50 border border-border/80 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-foreground"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {/* Botón "+ Añadir Ejercicio al Calentamiento" */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAddExercises([]);
                          setAddExerciseModalMode("single");
                          setAddExerciseBlockId(warmupBlock.id);
                        }}
                        className="w-full py-2.5 rounded-2xl border border-dashed border-blue-500/40 hover:border-blue-500 bg-blue-500/5 hover:bg-blue-500/10 text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Añadir Ejercicio al Calentamiento</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-3.5 text-center text-xs text-muted-foreground bg-secondary/10">
                      Fase de calentamiento omitida. Puedes reactivarla en cualquier momento con el switch superior.
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================= */}
              {/* FASE 2: RUTINA PRINCIPAL (REORDENABLE CON ⠿ EN 1 NIVEL)   */}
              {/* ========================================================= */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <Dumbbell className="w-4 h-4 text-foreground shrink-0" />
                    <span className="text-xs font-black uppercase tracking-wider text-foreground">
                      RUTINA PRINCIPAL
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-muted-foreground">
                    {mainBlocks.length} {mainBlocks.length === 1 ? "Ejercicio" : "Ejercicios / Bloques"}
                  </span>
                </div>

                <div className="space-y-3">
                  {mainBlocks.map((block, mainIdx) => {
                    // CASO 1: EJERCICIO INDIVIDUAL (TARJETA PLANA DIRECTA DE 1 SOLO NIVEL)
                    if (block.type === "standard" || (block.type === "cardio" && block.exercises.length === 1)) {
                      const ex = block.exercises[0];
                      const currentSwipeOffset = swipeOffsets[ex.id] || 0;
                      const exerciseRounds = ex.rounds || block.rounds;
                      const completedCount = exerciseRounds.filter((r) => r.isCompleted).length;
                      const totalCount = exerciseRounds.length;
                      const nextRound = exerciseRounds.find((r) => !r.isCompleted);
                      const isDone = completedCount === totalCount && totalCount > 0;

                      return (
                        <div
                          key={block.id}
                          onDragEnter={() => handleMainItemDragEnter(mainIdx)}
                          onDragOver={(e) => {
                            if (draggedBlockIndex !== null) {
                              e.preventDefault();
                              e.dataTransfer.dropEffect = "move";
                            }
                          }}
                          className={cn(
                            "relative rounded-3xl overflow-hidden transition-all duration-200",
                            draggedBlockIndex === mainIdx && "opacity-40 scale-[0.98] ring-2 ring-foreground/30 shadow-xl",
                          )}
                        >
                          {/* Fondo Rojo de Eliminación al Deslizar (Móvil) */}
                          {currentSwipeOffset < 0 && (
                            <div
                              onClick={() => handleDeleteExercise(block.id, ex.id)}
                              className="absolute inset-0 bg-rose-600 rounded-3xl flex items-center justify-end px-6 text-white font-bold text-xs gap-2 cursor-pointer z-0"
                            >
                              <Trash2 className="w-5 h-5 animate-pulse" />
                              <span>Eliminar</span>
                            </div>
                          )}

                          {/* Tarjeta del Ejercicio */}
                          <div
                            onTouchStart={(e) => handleTouchStart(e, ex.id)}
                            onTouchMove={(e) => handleTouchMove(e, ex.id)}
                            onTouchEnd={() => handleTouchEnd(block.id, ex.id)}
                            style={{
                              transform: `translateX(${currentSwipeOffset}px)`,
                              transition: currentSwipeOffset === 0 ? "transform 0.2s ease-out" : "none",
                            }}
                            className={cn(
                              "relative z-10 p-3.5 sm:p-4 rounded-3xl bg-card transition flex flex-col gap-3 border select-none shadow-xs",
                              isDone ? "border-emerald-500/40 bg-emerald-500/5" : "border-border/80 hover:border-foreground/30",
                            )}
                          >
                            {/* Fila Superior: Handle + Thumbnail + Info/Inputs + Píldora de Acciones */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                {/* Manija de Arrastre Unificada */}
                                <div
                                  draggable
                                  onDragStart={(e) => handleMainItemDragStart(e, mainIdx)}
                                  onDragEnd={handleMainItemDragEnd}
                                  className="cursor-grab active:cursor-grabbing p-1.5 -ml-1 text-muted-foreground/40 hover:text-foreground shrink-0 transition"
                                  title="Arrastra para reordenar en tiempo real"
                                >
                                  <GripVertical className="w-4 h-4" />
                                </div>

                                {/* Thumbnail con Play Superpuesto */}
                                <div
                                  onClick={() => setVideoModalExercise(ex)}
                                  className="relative w-12 h-12 rounded-2xl bg-secondary/60 p-1.5 flex items-center justify-center shrink-0 border border-border/80 shadow-2xs group/thumb hover:scale-105 transition-transform overflow-hidden cursor-pointer"
                                  title="Toca para ver el video con la técnica"
                                >
                                  <img src={ex.image} alt={ex.name} className="w-full h-full object-contain" />
                                  <div className="absolute inset-0 bg-black/30 group-hover/thumb:bg-black/45 flex items-center justify-center transition-colors">
                                    <div className="w-5 h-5 rounded-full bg-white/90 dark:bg-black/80 flex items-center justify-center shadow-xs">
                                      <Play className="w-2.5 h-2.5 text-foreground fill-current ml-0.5" />
                                    </div>
                                  </div>
                                </div>

                                {/* Nombre e Inputs Nativos Inline */}
                                <div className="min-w-0 flex-1">
                                  <h3
                                    onClick={() => setVideoModalExercise(ex)}
                                    className="text-xs sm:text-sm font-bold text-foreground hover:text-indigo-500 transition truncate cursor-pointer"
                                  >
                                    {ex.name}
                                  </h3>

                                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                    {/* Repeticiones Inteligentes */}
                                    <div className="flex items-center bg-secondary/40 border border-border/80 rounded-xl px-2 py-0.5 shadow-2xs focus-within:ring-1 focus-within:ring-foreground focus-within:bg-card focus-within:border-foreground/30 transition">
                                      <input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        value={getNumericReps(ex.reps)}
                                        onFocus={(e) => e.target.select()}
                                        onChange={(e) => {
                                          const numVal = e.target.value.replace(/[^0-9]/g, "");
                                          const unit = getRepsUnit(ex.reps);
                                          handleUpdateExerciseValue(
                                            block.id,
                                            ex.id,
                                            "reps",
                                            numVal ? `${numVal} ${unit}` : "",
                                          );
                                        }}
                                        className="w-7 text-xs font-black text-foreground bg-transparent text-center focus:outline-none tabular-nums"
                                        placeholder="10"
                                        title="Toca para cambiar valor"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => handleToggleRepsUnit(block.id, ex.id, ex.reps)}
                                        className="text-[10px] font-black text-muted-foreground hover:text-foreground bg-secondary/70 hover:bg-secondary border border-border/60 px-1.5 py-0.5 rounded-md transition cursor-pointer select-none ml-1 shadow-2xs active:scale-95"
                                        title="Toca para alternar entre Repeticiones (reps) y Segundos (seg)"
                                      >
                                        {getRepsUnit(ex.reps)}
                                      </button>
                                    </div>

                                    <span className="text-muted-foreground/60 text-xs font-bold">•</span>

                                    {/* Peso / Carga Inteligente */}
                                    <div className="flex items-center bg-secondary/40 border border-border/80 rounded-xl px-2 py-0.5 shadow-2xs focus-within:ring-1 focus-within:ring-foreground focus-within:bg-card focus-within:border-foreground/30 transition">
                                      <input
                                        type="text"
                                        inputMode="decimal"
                                        value={getNumericWeight(ex.weight)}
                                        onFocus={(e) => e.target.select()}
                                        onChange={(e) => {
                                          const cleanVal = e.target.value.replace(/[^0-9.]/g, "");
                                          const parts = cleanVal.split(".");
                                          const safeVal = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join("")}` : cleanVal;
                                          handleUpdateExerciseValue(
                                            block.id,
                                            ex.id,
                                            "weight",
                                            safeVal ? `${safeVal} kg` : "Peso corporal",
                                          );
                                        }}
                                        className="w-9 text-xs font-black text-foreground bg-transparent text-center focus:outline-none tabular-nums"
                                        placeholder={
                                          ex.weight.toLowerCase().includes("peso") || ex.weight.toLowerCase().includes("corporal")
                                            ? "BW"
                                            : "0"
                                        }
                                        title="Toca para cambiar peso en kg (vacío = peso corporal)"
                                      />
                                      <span className="text-[11px] font-bold text-muted-foreground ml-0.5 select-none pointer-events-none">
                                        kg
                                      </span>
                                    </div>

                                    <span className="text-[11px] text-muted-foreground truncate hidden md:inline">
                                      • {ex.equipment}
                                    </span>
                                  </div>

                                  {/* Badge de Nota si existe */}
                                  {ex.notes && expandedNoteExerciseId !== ex.id && (
                                    <div
                                      onClick={() => setExpandedNoteExerciseId(ex.id)}
                                      className="flex items-center gap-1.5 mt-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-[11px] font-medium cursor-pointer hover:bg-amber-500/15 transition w-fit max-w-full"
                                      title="Toca para editar tu nota"
                                    >
                                      <FileText className="w-3 h-3 shrink-0" />
                                      <span className="truncate">{ex.notes}</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Píldora de Acciones (Nota, Vincular Superserie, Cambiar y Eliminar) */}
                              <div className="flex items-center bg-secondary/50 rounded-full border border-border/70 p-1 gap-1 shrink-0 self-end sm:self-center shadow-2xs">
                                {/* Nota */}
                                <button
                                  type="button"
                                  onClick={() => setExpandedNoteExerciseId(expandedNoteExerciseId === ex.id ? null : ex.id)}
                                  className={cn(
                                    "w-7 h-7 rounded-full flex items-center justify-center transition cursor-pointer",
                                    ex.notes
                                      ? "text-amber-500 hover:text-amber-600 bg-amber-500/10"
                                      : "text-muted-foreground hover:text-foreground hover:bg-card",
                                  )}
                                  title={ex.notes ? "Editar nota personal" : "Añadir nota personal / ajuste"}
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                </button>

                                {/* Vincular a Superserie */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedAddExercises([]);
                                    setAddExerciseModalMode("link");
                                    setAddExerciseBlockId(block.id);
                                  }}
                                  className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-amber-500 hover:bg-card transition cursor-pointer"
                                  title="Vincular con otro ejercicio para crear una Superserie"
                                >
                                  <Zap className="w-3.5 h-3.5" />
                                </button>

                                {/* Cambiar */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSwapTarget({
                                      blockId: block.id,
                                      exerciseId: ex.id,
                                      muscleId: ex.muscleId,
                                      currentExercise: ex,
                                    })
                                  }
                                  className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-card transition cursor-pointer"
                                  title="Cambiar ejercicio"
                                >
                                  <ArrowLeftRight className="w-3.5 h-3.5" />
                                </button>

                                {/* Eliminar */}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteExercise(block.id, ex.id)}
                                  className="w-7 h-7 rounded-full hidden sm:flex items-center justify-center text-muted-foreground hover:text-rose-600 hover:bg-card transition cursor-pointer"
                                  title="Eliminar ejercicio (en móvil desliza a la izquierda)"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Input Desplegado de Nota */}
                            {expandedNoteExerciseId === ex.id && (
                              <div className="pt-2 border-t border-border/40 space-y-1">
                                <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                  <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                                    <FileText className="w-3 h-3" />
                                    Nota personal / Ajuste de máquina
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setExpandedNoteExerciseId(null)}
                                    className="text-xs font-bold text-foreground hover:underline cursor-pointer"
                                  >
                                    Cerrar
                                  </button>
                                </div>
                                <input
                                  type="text"
                                  value={ex.notes || ""}
                                  onChange={(e) => handleUpdateExerciseNote(block.id, ex.id, e.target.value)}
                                  placeholder="Ej: Banco posición 3 • Codos a 45° • Agarre neutro"
                                  autoFocus
                                  className="w-full text-xs font-medium text-foreground bg-secondary/50 border border-border/80 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-foreground"
                                />
                              </div>
                            )}

                            {/* Fila Inferior: Next-Set Stepper */}
                            <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-border/40">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <div className="flex items-center gap-1 flex-wrap">
                                  {exerciseRounds.map((round) => (
                                    <button
                                      key={round.roundNumber}
                                      type="button"
                                      onClick={() => handleToggleRound(block.id, round.roundNumber, ex.id)}
                                      className={cn(
                                        "transition-all cursor-pointer flex items-center justify-center rounded-full",
                                        round.isCompleted
                                          ? "w-5 h-5 bg-emerald-500 text-white shadow-2xs"
                                          : "w-4 h-4 border-2 border-border/80 bg-secondary/40 hover:border-foreground/60",
                                      )}
                                      title={`Serie ${round.roundNumber}: ${round.isCompleted ? "Completada" : "Pendiente"}`}
                                    >
                                      {round.isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                                    </button>
                                  ))}

                                  {/* Botón "+ Añadir Serie" */}
                                  <button
                                    type="button"
                                    onClick={() => handleAddRoundToExercise(block.id, ex.id)}
                                    className="w-4 h-4 rounded-full border border-dashed border-border/90 hover:border-foreground bg-secondary/30 hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground text-[10px] font-black transition cursor-pointer"
                                    title="Añadir una serie extra a este ejercicio"
                                  >
                                    <Plus className="w-2.5 h-2.5" />
                                  </button>

                                  {/* Botón "- Quitar Serie" (si tiene más de 1 serie) */}
                                  {exerciseRounds.length > 1 && !exerciseRounds[exerciseRounds.length - 1].isCompleted && (
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveRoundFromExercise(block.id, ex.id)}
                                      className="w-4 h-4 rounded-full border border-dashed border-border/90 hover:border-rose-500 bg-secondary/30 hover:bg-rose-500/10 flex items-center justify-center text-muted-foreground hover:text-rose-500 text-[10px] font-black transition cursor-pointer"
                                      title="Quitar la última serie pendiente"
                                    >
                                      <Minus className="w-2.5 h-2.5" />
                                    </button>
                                  )}
                                </div>

                                <span className="text-[11px] font-bold text-muted-foreground ml-1 truncate">
                                  {completedCount}/{totalCount} Series
                                </span>
                              </div>

                              {nextRound ? (
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() => handleToggleRound(block.id, nextRound.roundNumber, ex.id)}
                                  className="h-8 px-3.5 rounded-xl bg-foreground text-background text-xs font-black shadow-2xs hover:opacity-90 transition cursor-pointer flex items-center gap-1.5 shrink-0"
                                >
                                  <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                                  <span>Serie {nextRound.roundNumber}</span>
                                </Button>
                              ) : (
                                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold shrink-0">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Completado</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }

                    // CASO 2: SUPERSET (TARJETA AGRUPADA CON BORDE ÁMBAR)
                    const completedCount = block.rounds.filter((r) => r.isCompleted).length;
                    const totalCount = block.rounds.length;
                    const nextRound = block.rounds.find((r) => !r.isCompleted);
                    const isDone = completedCount === totalCount && totalCount > 0;

                    return (
                      <div
                        key={block.id}
                        onDragEnter={() => handleMainItemDragEnter(mainIdx)}
                        onDragOver={(e) => {
                          if (draggedBlockIndex !== null) {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = "move";
                          }
                        }}
                        className={cn(
                          "rounded-3xl border border-amber-500/40 bg-card overflow-hidden shadow-xs transition-all",
                          isDone && "border-emerald-500/40 bg-emerald-500/5",
                          draggedBlockIndex === mainIdx && "opacity-40 scale-[0.98] ring-2 ring-foreground/30 shadow-xl",
                        )}
                      >
                        {/* Cabecera de la Superserie */}
                        <div
                          draggable
                          onDragStart={(e) => handleMainItemDragStart(e, mainIdx)}
                          onDragEnd={handleMainItemDragEnd}
                          className="p-3.5 border-b border-amber-500/20 bg-amber-500/10 flex items-center justify-between gap-3 cursor-grab active:cursor-grabbing select-none"
                        >
                          <div className="flex items-center gap-2">
                            <div className="p-1 -ml-1 text-muted-foreground/40 hover:text-foreground shrink-0 transition">
                              <GripVertical className="w-4 h-4" />
                            </div>
                            <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                            <div>
                              <span className="text-xs font-black uppercase tracking-wider text-foreground block">
                                {block.title}
                              </span>
                              <span className="text-[10px] text-muted-foreground font-medium">
                                {block.subtitle}
                              </span>
                            </div>
                          </div>

                          <Badge variant="outline" className="text-[10px] font-bold border-amber-500/30 text-amber-600 dark:text-amber-400">
                            Superserie
                          </Badge>
                        </div>

                        {/* Ejercicios de la Superserie */}
                        <div className="p-3.5 space-y-2.5">
                          {block.exercises.map((ex) => {
                            const currentSwipeOffset = swipeOffsets[ex.id] || 0;

                            return (
                              <div key={ex.id} className="relative rounded-2xl overflow-hidden">
                                {currentSwipeOffset < 0 && (
                                  <div
                                    onClick={() => handleDeleteExercise(block.id, ex.id)}
                                    className="absolute inset-0 bg-rose-600 rounded-2xl flex items-center justify-end px-5 text-white font-bold text-xs gap-2 cursor-pointer z-0"
                                  >
                                    <Trash2 className="w-5 h-5 animate-pulse" />
                                    <span>Eliminar</span>
                                  </div>
                                )}

                                <div
                                  onTouchStart={(e) => handleTouchStart(e, ex.id)}
                                  onTouchMove={(e) => handleTouchMove(e, ex.id)}
                                  onTouchEnd={() => handleTouchEnd(block.id, ex.id)}
                                  style={{
                                    transform: `translateX(${currentSwipeOffset}px)`,
                                    transition: currentSwipeOffset === 0 ? "transform 0.2s ease-out" : "none",
                                  }}
                                  className="relative z-10 p-3 rounded-2xl bg-secondary/30 border border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                >
                                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                    <div
                                      onClick={() => setVideoModalExercise(ex)}
                                      className="relative w-11 h-11 rounded-xl bg-card p-1 flex items-center justify-center shrink-0 border border-border/80 shadow-2xs group/thumb hover:scale-105 transition-transform overflow-hidden cursor-pointer"
                                      title="Toca para ver el video con la técnica"
                                    >
                                      <img src={ex.image} alt={ex.name} className="w-full h-full object-contain" />
                                      <div className="absolute inset-0 bg-black/30 group-hover/thumb:bg-black/45 flex items-center justify-center transition-colors">
                                        <div className="w-4 h-4 rounded-full bg-white/90 dark:bg-black/80 flex items-center justify-center shadow-xs">
                                          <Play className="w-2 h-2 text-foreground fill-current ml-0.5" />
                                        </div>
                                      </div>
                                    </div>

                                    <div className="min-w-0 flex-1">
                                      <h4
                                        onClick={() => setVideoModalExercise(ex)}
                                        className="text-xs font-bold text-foreground hover:text-indigo-500 transition truncate cursor-pointer"
                                      >
                                        {ex.name}
                                      </h4>

                                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                                        {/* Repeticiones Inteligentes */}
                                        <div className="flex items-center bg-card border border-border/80 rounded-lg px-2 py-0.5 text-xs font-bold focus-within:ring-1 focus-within:ring-foreground focus-within:border-foreground/30 transition">
                                          <input
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            value={getNumericReps(ex.reps)}
                                            onFocus={(e) => e.target.select()}
                                            onChange={(e) => {
                                              const numVal = e.target.value.replace(/[^0-9]/g, "");
                                              const unit = getRepsUnit(ex.reps);
                                              handleUpdateExerciseValue(
                                                block.id,
                                                ex.id,
                                                "reps",
                                                numVal ? `${numVal} ${unit}` : "",
                                              );
                                            }}
                                            className="w-7 text-xs font-black text-foreground bg-transparent text-center focus:outline-none tabular-nums"
                                            placeholder="10"
                                            title="Toca para cambiar repeticiones"
                                          />
                                          <button
                                            type="button"
                                            onClick={() => handleToggleRepsUnit(block.id, ex.id, ex.reps)}
                                            className="text-[9px] font-black text-muted-foreground hover:text-foreground bg-secondary/80 hover:bg-secondary border border-border/60 px-1 py-0.5 rounded-md transition cursor-pointer select-none ml-1 shadow-2xs active:scale-95"
                                            title="Toca para alternar entre Repeticiones (reps) y Segundos (seg)"
                                          >
                                            {getRepsUnit(ex.reps)}
                                          </button>
                                        </div>

                                        <span className="text-muted-foreground/60 text-xs font-bold">•</span>

                                        {/* Peso / Carga Inteligente */}
                                        <div className="flex items-center bg-card border border-border/80 rounded-lg px-2 py-0.5 text-xs font-bold focus-within:ring-1 focus-within:ring-foreground focus-within:border-foreground/30 transition">
                                          <input
                                            type="text"
                                            inputMode="decimal"
                                            value={getNumericWeight(ex.weight)}
                                            onFocus={(e) => e.target.select()}
                                            onChange={(e) => {
                                              const cleanVal = e.target.value.replace(/[^0-9.]/g, "");
                                              const parts = cleanVal.split(".");
                                              const safeVal = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join("")}` : cleanVal;
                                              handleUpdateExerciseValue(
                                                block.id,
                                                ex.id,
                                                "weight",
                                                safeVal ? `${safeVal} kg` : "Peso corporal",
                                              );
                                            }}
                                            className="w-9 text-xs font-black text-foreground bg-transparent text-center focus:outline-none tabular-nums"
                                            placeholder={
                                              ex.weight.toLowerCase().includes("peso") || ex.weight.toLowerCase().includes("corporal")
                                                ? "BW"
                                                : "0"
                                            }
                                            title="Toca para cambiar peso en kg"
                                          />
                                          <span className="text-[10px] font-bold text-muted-foreground ml-0.5 select-none pointer-events-none">
                                            kg
                                          </span>
                                        </div>
                                      </div>

                                      {/* Badge de Nota si existe */}
                                      {ex.notes && expandedNoteExerciseId !== ex.id && (
                                        <div
                                          onClick={() => setExpandedNoteExerciseId(ex.id)}
                                          className="flex items-center gap-1.5 mt-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-[11px] font-medium cursor-pointer hover:bg-amber-500/15 transition w-fit max-w-full"
                                          title="Toca para editar tu nota"
                                        >
                                          <FileText className="w-3 h-3 shrink-0" />
                                          <span className="truncate">{ex.notes}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center bg-card rounded-full border border-border/70 p-1 gap-1 shrink-0 self-end sm:self-center shadow-2xs">
                                    {/* Nota */}
                                    <button
                                      type="button"
                                      onClick={() => setExpandedNoteExerciseId(expandedNoteExerciseId === ex.id ? null : ex.id)}
                                      className={cn(
                                        "w-7 h-7 rounded-full flex items-center justify-center transition cursor-pointer",
                                        ex.notes
                                          ? "text-amber-500 hover:text-amber-600 bg-amber-500/10"
                                          : "text-muted-foreground hover:text-foreground",
                                      )}
                                      title={ex.notes ? "Editar nota personal" : "Añadir nota personal / ajuste"}
                                    >
                                      <FileText className="w-3.5 h-3.5" />
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        setSwapTarget({
                                          blockId: block.id,
                                          exerciseId: ex.id,
                                          muscleId: ex.muscleId,
                                          currentExercise: ex,
                                        })
                                      }
                                      className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition cursor-pointer"
                                      title="Cambiar ejercicio"
                                    >
                                      <ArrowLeftRight className="w-3.5 h-3.5" />
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleDeleteExercise(block.id, ex.id)}
                                      className="w-7 h-7 rounded-full hidden sm:flex items-center justify-center text-muted-foreground hover:text-rose-600 transition cursor-pointer"
                                      title="Eliminar ejercicio"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                {/* Input Desplegado de Nota */}
                                {expandedNoteExerciseId === ex.id && (
                                  <div className="w-full pt-2 border-t border-border/40 space-y-1">
                                    <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                      <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                                        <FileText className="w-3 h-3" />
                                        Nota personal / Ajuste de máquina
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => setExpandedNoteExerciseId(null)}
                                        className="text-xs font-bold text-foreground hover:underline cursor-pointer"
                                      >
                                        Cerrar
                                      </button>
                                    </div>
                                    <input
                                      type="text"
                                      value={ex.notes || ""}
                                      onChange={(e) => handleUpdateExerciseNote(block.id, ex.id, e.target.value)}
                                      placeholder="Ej: Ajuste de polea en altura 4 • Agarre supino"
                                      autoFocus
                                      className="w-full text-xs font-medium text-foreground bg-secondary/50 border border-border/80 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-foreground"
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Stepper de la Superserie al Pie */}
                        <div className="px-4 py-3 border-t border-amber-500/20 flex items-center justify-between gap-3 bg-secondary/20">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="flex items-center gap-1 flex-wrap">
                              {block.rounds.map((round) => (
                                <button
                                  key={round.roundNumber}
                                  type="button"
                                  onClick={() => handleToggleRound(block.id, round.roundNumber)}
                                  className={cn(
                                    "transition-all cursor-pointer flex items-center justify-center rounded-full",
                                    round.isCompleted
                                      ? "w-5 h-5 bg-emerald-500 text-white shadow-2xs"
                                      : "w-4 h-4 border-2 border-border/80 bg-secondary/60 hover:border-foreground/60",
                                  )}
                                  title={`Serie ${round.roundNumber}: ${round.isCompleted ? "Completada" : "Pendiente"}`}
                                >
                                  {round.isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                                </button>
                              ))}

                              {/* Botón "+ Añadir Serie a la Superserie" */}
                              <button
                                type="button"
                                onClick={() => handleAddRoundToExercise(block.id)}
                                className="w-4 h-4 rounded-full border border-dashed border-amber-500/60 hover:border-amber-500 bg-amber-500/10 hover:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 text-[10px] font-black transition cursor-pointer"
                                title="Añadir una serie extra a la superserie"
                              >
                                <Plus className="w-2.5 h-2.5" />
                              </button>

                              {/* Botón "- Quitar Serie" (si tiene más de 1 serie) */}
                              {block.rounds.length > 1 && !block.rounds[block.rounds.length - 1].isCompleted && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveRoundFromExercise(block.id)}
                                  className="w-4 h-4 rounded-full border border-dashed border-amber-500/60 hover:border-rose-500 bg-amber-500/10 hover:bg-rose-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 hover:text-rose-500 text-[10px] font-black transition cursor-pointer"
                                  title="Quitar la última serie pendiente de la superserie"
                                >
                                  <Minus className="w-2.5 h-2.5" />
                                </button>
                              )}
                            </div>

                            <span className="text-[11px] font-bold text-muted-foreground truncate">
                              {completedCount}/{totalCount} Series
                            </span>
                          </div>

                          {nextRound ? (
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => handleToggleRound(block.id, nextRound.roundNumber)}
                              className="h-8 px-3.5 rounded-xl bg-foreground text-background text-xs font-black shadow-2xs hover:opacity-90 transition cursor-pointer flex items-center gap-1.5 shrink-0"
                            >
                              <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                              <span>Serie {nextRound.roundNumber}</span>
                            </Button>
                          ) : (
                            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold shrink-0">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Superserie Completa</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Botones de Añadir: Ejercicio Individual vs Crear Superserie */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAddExercises([]);
                      setAddExerciseModalMode("single");
                      setAddExerciseBlockId("main-workout");
                    }}
                    className="w-full py-3.5 px-4 rounded-2xl border border-dashed border-border/80 hover:border-foreground/40 bg-card/40 hover:bg-secondary/40 text-xs font-bold text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Añadir Ejercicio Individual</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAddExercises([]);
                      setAddExerciseModalMode("superset");
                      setAddExerciseBlockId("main-workout");
                    }}
                    className="w-full py-3.5 px-4 rounded-2xl border border-dashed border-amber-500/50 hover:border-amber-500 bg-amber-500/5 hover:bg-amber-500/10 text-xs font-bold text-amber-700 dark:text-amber-300 flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs"
                  >
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>Crear Superserie (2 Ejercicios)</span>
                  </button>
                </div>
              </div>

              {/* ========================================================= */}
              {/* FASE 3: VUELTA A LA CALMA (INTERACTIVA)                   */}
              {/* ========================================================= */}
              {cooldownBlock && (
                <div className="rounded-3xl border border-purple-500/30 bg-card overflow-hidden shadow-xs transition-all">
                  <div className="p-4 border-b border-purple-500/20 bg-purple-500/10 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Wind className="w-4 h-4 text-purple-500 shrink-0" />
                      <div>
                        <span className="text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 block">
                          {cooldownBlock.title}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium">
                          Elongación pasiva y respiración parasimpática
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-muted-foreground hidden sm:inline">
                        {includeCooldown ? "Activado" : "Omitido"}
                      </span>
                      <Switch
                        checked={includeCooldown}
                        onCheckedChange={setIncludeCooldown}
                        className="cursor-pointer data-[state=checked]:bg-purple-500"
                        title="Activar u omitir fase de vuelta a la calma"
                      />
                    </div>
                  </div>

                  {includeCooldown ? (
                    <div className="p-3.5 space-y-2.5">
                      {cooldownBlock.exercises.map((ex) => {
                        const currentSwipeOffset = swipeOffsets[ex.id] || 0;

                        return (
                          <div key={ex.id} className="relative rounded-2xl overflow-hidden">
                            {currentSwipeOffset < 0 && (
                              <div
                                onClick={() => handleDeleteExercise(cooldownBlock.id, ex.id)}
                                className="absolute inset-0 bg-rose-600 rounded-2xl flex items-center justify-end px-5 text-white font-bold text-xs gap-2 cursor-pointer z-0"
                              >
                                <Trash2 className="w-5 h-5 animate-pulse" />
                                <span>Eliminar</span>
                              </div>
                            )}

                            <div
                              onTouchStart={(e) => handleTouchStart(e, ex.id)}
                              onTouchMove={(e) => handleTouchMove(e, ex.id)}
                              onTouchEnd={() => handleTouchEnd(cooldownBlock.id, ex.id)}
                              style={{
                                transform: `translateX(${currentSwipeOffset}px)`,
                                transition: currentSwipeOffset === 0 ? "transform 0.2s ease-out" : "none",
                              }}
                              className="relative z-10 p-3 rounded-2xl bg-secondary/30 border border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                {/* Thumbnail con Play */}
                                <div
                                  onClick={() => setVideoModalExercise(ex)}
                                  className="relative w-11 h-11 rounded-xl bg-card p-1 flex items-center justify-center shrink-0 border border-border/70 shadow-2xs group/thumb hover:scale-105 transition-transform overflow-hidden cursor-pointer"
                                  title="Toca para ver el video con la técnica"
                                >
                                  <img src={ex.image} alt={ex.name} className="w-full h-full object-contain" />
                                  <div className="absolute inset-0 bg-black/30 group-hover/thumb:bg-black/45 flex items-center justify-center transition-colors">
                                    <div className="w-4 h-4 rounded-full bg-white/90 dark:bg-black/80 flex items-center justify-center shadow-xs">
                                      <Play className="w-2 h-2 text-foreground fill-current ml-0.5" />
                                    </div>
                                  </div>
                                </div>

                                <div className="min-w-0 flex-1">
                                  <h4
                                    onClick={() => setVideoModalExercise(ex)}
                                    className="text-xs font-bold text-foreground hover:text-indigo-500 transition truncate cursor-pointer"
                                  >
                                    {ex.name}
                                  </h4>
                                  <p className="text-[11px] text-muted-foreground truncate">
                                    {ex.reps} • {ex.equipment}
                                  </p>

                                  {/* Badge de Nota si existe */}
                                  {ex.notes && expandedNoteExerciseId !== ex.id && (
                                    <div
                                      onClick={() => setExpandedNoteExerciseId(ex.id)}
                                      className="flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-800 dark:text-purple-300 text-[10px] font-medium cursor-pointer hover:bg-purple-500/15 transition w-fit max-w-full"
                                      title="Toca para editar tu nota"
                                    >
                                      <FileText className="w-2.5 h-2.5 shrink-0" />
                                      <span className="truncate">{ex.notes}</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                {/* Píldora de Nota, Cambiar y Eliminar */}
                                <div className="flex items-center bg-card rounded-full border border-border/70 p-1 gap-1 shadow-2xs">
                                  <button
                                    type="button"
                                    onClick={() => setExpandedNoteExerciseId(expandedNoteExerciseId === ex.id ? null : ex.id)}
                                    className={cn(
                                      "w-7 h-7 rounded-full flex items-center justify-center transition cursor-pointer",
                                      ex.notes
                                        ? "text-purple-500 hover:text-purple-600 bg-purple-500/10"
                                        : "text-muted-foreground hover:text-foreground",
                                    )}
                                    title={ex.notes ? "Editar nota" : "Añadir nota o ajuste"}
                                  >
                                    <FileText className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      setSwapTarget({
                                        blockId: cooldownBlock.id,
                                        exerciseId: ex.id,
                                        muscleId: ex.muscleId,
                                        currentExercise: ex,
                                      })
                                    }
                                    className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition cursor-pointer"
                                    title="Cambiar estiramiento"
                                  >
                                    <ArrowLeftRight className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteExercise(cooldownBlock.id, ex.id)}
                                    className="w-7 h-7 rounded-full hidden sm:flex items-center justify-center text-muted-foreground hover:text-rose-600 transition cursor-pointer"
                                    title="Eliminar ejercicio (en móvil desliza a la izquierda)"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                {/* Botón Listo */}
                                <button
                                  type="button"
                                  onClick={() => handleToggleRound(cooldownBlock.id, 1, ex.id)}
                                  className={cn(
                                    "h-8 px-3.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0",
                                    ex.rounds?.[0]?.isCompleted
                                      ? "bg-foreground text-background border-foreground shadow-xs font-black"
                                      : "bg-card border-border/80 text-foreground hover:bg-secondary/60",
                                  )}
                                >
                                  {ex.rounds?.[0]?.isCompleted ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-400" />
                                      <span>Listo</span>
                                    </>
                                  ) : (
                                    <span>Listo</span>
                                  )}
                                </button>
                              </div>

                              {/* Input Desplegado de Nota */}
                              {expandedNoteExerciseId === ex.id && (
                                <div className="w-full pt-2 border-t border-border/40 space-y-1">
                                  <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                    <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                                      <FileText className="w-3 h-3" />
                                      Nota personal / Sensaciones
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => setExpandedNoteExerciseId(null)}
                                      className="text-xs font-bold text-foreground hover:underline cursor-pointer"
                                    >
                                      Cerrar
                                    </button>
                                  </div>
                                  <input
                                    type="text"
                                    value={ex.notes || ""}
                                    onChange={(e) => handleUpdateExerciseNote(cooldownBlock.id, ex.id, e.target.value)}
                                    placeholder="Ej: Mantener respiración diafragmática 30s"
                                    autoFocus
                                    className="w-full text-xs font-medium text-foreground bg-secondary/50 border border-border/80 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-foreground"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {/* Botón "+ Añadir Ejercicio a Vuelta a la Calma" */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAddExercises([]);
                          setAddExerciseModalMode("single");
                          setAddExerciseBlockId(cooldownBlock.id);
                        }}
                        className="w-full py-2.5 rounded-2xl border border-dashed border-purple-500/40 hover:border-purple-500 bg-purple-500/5 hover:bg-purple-500/10 text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Añadir Ejercicio a Vuelta a la Calma</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-3.5 text-center text-xs text-muted-foreground bg-secondary/10">
                      Fase de vuelta a la calma omitida. Puedes reactivarla en cualquier momento con el switch superior.
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })()}

        {/* UNIFIED MORPHING FLOATING BAR (BOTTOM CTA & REST TIMER) */}
        <div className="fixed bottom-6 left-0 right-0 max-w-lg mx-auto px-4 z-40">
          <Card className="rounded-3xl border border-border/80 bg-card/95 backdrop-blur-xl p-3 sm:p-3.5 shadow-2xl overflow-hidden relative transition-all duration-300">
            {/* Barra de Progreso del Descanso en el borde superior */}
            {restTimerState?.isOpen && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-secondary/80 overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-300 ease-linear"
                  style={{
                    width: `${Math.min(100, Math.max(0, ((restTimerState.totalSeconds - restTimerState.secondsLeft) / restTimerState.totalSeconds) * 100))}%`,
                  }}
                />
              </div>
            )}

            {restTimerState?.isOpen ? (
              /* ESTADO 2: MODO DESCANSO MUTABLE */
              <div className="flex items-center justify-between gap-2.5 animate-in fade-in duration-200">
                <div className="flex items-center gap-2.5 min-w-0 pl-1">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 border border-indigo-500/20">
                    <Timer className={cn("w-5 h-5", !restTimerState.isPaused && "animate-pulse")} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-base sm:text-lg font-black text-foreground tabular-nums leading-none tracking-tight">
                        {formatTime(restTimerState.secondsLeft)}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[9px] font-bold border-indigo-500/30 text-indigo-600 dark:text-indigo-400 py-0 px-1.5"
                      >
                        {restTimerState.isPaused ? "Pausado" : "Descanso"}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-semibold truncate mt-0.5">
                      Serie {restTimerState.roundNumber} • Total:{" "}
                      <span className="font-mono text-foreground">{formatTime(workoutElapsedSeconds)}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setRestTimerState((prev) =>
                        prev
                          ? {
                              ...prev,
                              secondsLeft: prev.secondsLeft + 30,
                              totalSeconds: prev.totalSeconds + 30,
                            }
                          : null,
                      )
                    }
                    className="h-10 px-2.5 rounded-xl text-[11px] font-bold border-border/80 hover:bg-secondary cursor-pointer"
                    title="Sumar 30 segundos"
                  >
                    +30s
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      setRestTimerState((prev) => (prev ? { ...prev, isPaused: !prev.isPaused } : null))
                    }
                    className="h-10 w-10 p-0 rounded-xl text-muted-foreground hover:text-foreground cursor-pointer"
                    title={restTimerState.isPaused ? "Reanudar" : "Pausar"}
                  >
                    {restTimerState.isPaused ? (
                      <Play className="w-4 h-4 fill-current text-emerald-500" />
                    ) : (
                      <Pause className="w-4 h-4 text-amber-500" />
                    )}
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      setRestTimerState(null);
                      toast.info("Descanso finalizado");
                    }}
                    className="h-10 px-3.5 rounded-xl bg-foreground text-background text-xs font-black shadow-xs hover:opacity-90 cursor-pointer flex items-center gap-1"
                    title="Saltar descanso"
                  >
                    <span>Listo</span>
                    <FastForward className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ) : (
              /* ESTADO 1: SESIÓN NORMAL */
              <div className="flex items-center justify-between gap-3 animate-in fade-in duration-200">
                <div className="flex items-center gap-3 pl-2 min-w-0">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-colors",
                      isWorkoutActive
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-secondary text-muted-foreground",
                    )}
                  >
                    <Timer className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base sm:text-lg font-black text-foreground tabular-nums leading-none">
                        {formatTime(workoutElapsedSeconds)}
                      </span>
                      {isWorkoutActive && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block truncate">
                      {completedRoundsCount}/{totalRoundsCount} Series • {isWorkoutActive ? "En curso" : "Listo"}
                    </span>
                  </div>
                </div>

                {!isWorkoutActive ? (
                  <Button
                    onClick={handleStartWorkout}
                    className="h-12 px-6 rounded-2xl bg-foreground text-background font-black text-xs shadow-lg hover:opacity-90 transition cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <Play className="w-4 h-4 fill-current text-emerald-400" />
                    <span>Comenzar Workout</span>
                  </Button>
                ) : (
                  <Button
                    onClick={handleAttemptFinishWorkout}
                    className="h-12 px-6 rounded-2xl bg-foreground text-background font-black text-xs shadow-lg hover:opacity-90 transition cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Finalizar Sesión</span>
                  </Button>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* MODAL 1: PREGUNTA DE ESFUERZO PERCIBIDO (RPE) AL TOCAR LA SERIE */}
        {rpeDialogState && (
          <Dialog
            open={!!rpeDialogState}
            onOpenChange={(open) => {
              if (!open) setRpeDialogState(null);
            }}
          >
            <DialogContent className="sm:max-w-md rounded-3xl p-6 border border-border bg-card text-left shadow-2xl space-y-4 font-sans">
              <DialogHeader>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-indigo-500">
                  <Activity className="w-3.5 h-3.5" /> FEEDBACK DE COACH
                </div>
                <DialogTitle className="text-lg font-black text-foreground">
                  ¿Cómo se sintió la Serie {rpeDialogState.roundNumber}?
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  {rpeDialogState.blockTitle} • Selecciona tu nivel de esfuerzo para ajustar el descanso:
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-2 pt-1">
                {EXERTION_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handleSelectRpeRating(opt.key)}
                    className="w-full p-3.5 rounded-2xl border border-border/80 bg-card hover:bg-secondary transition text-left space-y-1 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground group-hover:text-indigo-500 transition">
                        {opt.label}
                      </span>
                      <Badge variant="outline" className="text-[10px] font-semibold">
                        {opt.defaultRestSecs}s descanso
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground italic leading-relaxed">
                      "{opt.subtext}"
                    </p>
                  </button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* MODAL 2: VIDEO INSTRUCTIVO CON TÉCNICA */}
        {videoModalExercise && (
          <Dialog
            open={!!videoModalExercise}
            onOpenChange={(open) => {
              if (!open) setVideoModalExercise(null);
            }}
          >
            <DialogContent className="sm:max-w-md rounded-3xl p-5 sm:p-6 border border-border bg-card max-h-[90vh] overflow-y-auto custom-scrollbar font-sans">
              <DialogHeader className="pb-3 border-b border-border/40 text-left">
                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest w-fit">
                  {videoModalExercise.muscleName}
                </Badge>
                <DialogTitle className="text-base sm:text-lg font-black text-foreground pt-1">
                  {videoModalExercise.name}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Equipamiento: {videoModalExercise.equipment}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 pt-1 text-left">
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-border/80 shadow-inner flex items-center justify-center">
                  <video
                    src={videoModalExercise.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border/60 space-y-0.5 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                      Repeticiones
                    </span>
                    <span className="text-base font-black text-foreground block">
                      {videoModalExercise.reps}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border/60 space-y-0.5 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                      Carga / Peso
                    </span>
                    <span className="text-base font-black text-foreground block">
                      {videoModalExercise.weight}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Propósito del Ejercicio
                  </h4>
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    {videoModalExercise.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Instrucciones de Ejecución
                  </h4>
                  <div className="space-y-2">
                    {videoModalExercise.instructions.map((step, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                        <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center shrink-0 text-[10px] font-bold text-foreground mt-0.5 border border-border/60">
                          {sIdx + 1}
                        </div>
                        <span className="flex-1 leading-relaxed">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border/40 flex justify-end">
                <Button
                  onClick={() => setVideoModalExercise(null)}
                  className="rounded-xl font-bold text-xs px-5 bg-foreground text-background cursor-pointer"
                >
                  Entendido
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* MODAL 3: CAMBIAR EJERCICIO POR ALTERNATIVA COMPATIBLE */}
        {swapTarget && (
          <Dialog
            open={!!swapTarget}
            onOpenChange={(open) => {
              if (!open) setSwapTarget(null);
            }}
          >
            <DialogContent className="sm:max-w-md rounded-3xl p-5 sm:p-6 border border-border bg-card max-h-[85vh] overflow-y-auto custom-scrollbar font-sans text-left">
              <DialogHeader className="pb-3 border-b border-border/40">
                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest w-fit text-indigo-500">
                  {swapTarget.currentExercise.muscleName}
                </Badge>
                <DialogTitle className="text-base sm:text-lg font-black text-foreground pt-1">
                  Cambiar Ejercicio
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Selecciona una alternativa para reemplazar <strong>{swapTarget.currentExercise.name}</strong>:
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-2.5 pt-2">
                {(() => {
                  const swapAlternatives =
                    swapTarget.blockId === "block-warmup"
                      ? WARMUP_EXERCISES.filter((item) => item.name !== swapTarget.currentExercise.name)
                      : swapTarget.blockId === "block-cooldown"
                      ? COOLDOWN_EXERCISES.filter((item) => item.name !== swapTarget.currentExercise.name)
                      : (EXERCISE_LIBRARY[swapTarget.muscleId] || []).filter(
                          (item) => item.name !== swapTarget.currentExercise.name,
                        );

                  if (swapAlternatives.length === 0) {
                    return (
                      <p className="text-xs text-muted-foreground text-center py-4">
                        No hay alternativas adicionales disponibles para este ejercicio.
                      </p>
                    );
                  }

                  return swapAlternatives.map((altEx) => (
                    <div
                      key={altEx.name}
                      className="p-3 rounded-2xl border border-border/70 bg-card hover:bg-secondary/40 transition flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-secondary/60 p-1 flex items-center justify-center shrink-0 border border-border/60">
                          <img
                            src={altEx.image}
                            alt={altEx.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-foreground truncate">
                            {altEx.name}
                          </h4>
                          <p className="text-[11px] text-muted-foreground truncate">
                            {altEx.equipment} • <span className="font-bold text-foreground/80">{altEx.reps}</span> ({altEx.load})
                          </p>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => handleSwapExercise(altEx)}
                        className="rounded-xl h-8 px-3 text-xs font-bold bg-foreground text-background hover:opacity-90 cursor-pointer shrink-0"
                      >
                        Elegir
                      </Button>
                    </div>
                  ));
                })()}
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* MODAL 4: AÑADIR EJERCICIO O CREAR SUPERSERIE */}
        {addExerciseBlockId && (
          <Dialog
            open={!!addExerciseBlockId}
            onOpenChange={(open) => {
              if (!open) {
                setAddExerciseBlockId(null);
                setSelectedAddExercises([]);
                setAddExerciseSearchQuery("");
              }
            }}
          >
            <DialogContent className="sm:max-w-xl rounded-3xl p-0 border border-border bg-card max-h-[90vh] overflow-hidden flex flex-col font-sans text-left shadow-2xl">
              {/* Header */}
              <div className="p-5 sm:p-6 pb-3 border-b border-border/40 space-y-3 shrink-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div>
                    <DialogTitle className="text-base sm:text-lg font-black text-foreground">
                      {addExerciseModalMode === "link"
                        ? "Vincular a Superserie"
                        : addExerciseModalMode === "superset"
                        ? "Crear Nueva Superserie"
                        : "Añadir Ejercicio"}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                      {addExerciseModalMode === "link"
                        ? "Elige el segundo ejercicio para combinarlo en superserie:"
                        : addExerciseModalMode === "superset"
                        ? "Selecciona 2 ejercicios para ejecutarlos de forma continua:"
                        : "Selecciona un ejercicio para sumarlo a tu rutina:"}
                    </DialogDescription>
                  </div>

                  {addExerciseModalMode === "link" ? (
                    <Badge variant="outline" className="border-amber-500/40 text-amber-600 dark:text-amber-400 font-bold text-[10px] uppercase tracking-wider shrink-0">
                      <Zap className="w-3 h-3 mr-1 inline" /> Vincular
                    </Badge>
                  ) : (
                    /* Mode Toggle Pills */
                    <div className="flex items-center bg-secondary/60 p-1 rounded-2xl border border-border/60 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setAddExerciseModalMode("single");
                          if (selectedAddExercises.length > 1) {
                            setSelectedAddExercises(selectedAddExercises.slice(0, 1));
                          }
                        }}
                        className={cn(
                          "px-2.5 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer",
                          addExerciseModalMode === "single"
                            ? "bg-foreground text-background shadow-xs font-black"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        Individual
                      </button>
                      <button
                        type="button"
                        onClick={() => setAddExerciseModalMode("superset")}
                        className={cn(
                          "px-2.5 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer flex items-center gap-1",
                          addExerciseModalMode === "superset"
                            ? "bg-amber-500 text-black shadow-xs font-black"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <Zap className="w-3 h-3 fill-current" />
                        <span>Superserie</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Buscador de Ejercicios */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={addExerciseSearchQuery}
                    onChange={(e) => setAddExerciseSearchQuery(e.target.value)}
                    placeholder="Buscar por nombre o equipamiento (mancuerna, polea, barra...)"
                    className="w-full pl-10 pr-4 py-2 rounded-2xl border border-border/80 bg-secondary/30 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition"
                  />
                  {addExerciseSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setAddExerciseSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs font-bold"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Lista de Ejercicios Filtrados con Scroll */}
              <div className="p-5 sm:p-6 pt-3 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                {selectedMuscleIds.map((mId) => {
                  const groupInfo = MUSCLE_GROUPS.find((g) => g.id === mId);
                  const rawExercises = EXERCISE_LIBRARY[mId] || [];
                  const filteredExercises = rawExercises.filter((item) => {
                    if (!addExerciseSearchQuery.trim()) return true;
                    const query = addExerciseSearchQuery.toLowerCase();
                    return (
                      item.name.toLowerCase().includes(query) ||
                      item.equipment.toLowerCase().includes(query)
                    );
                  });

                  if (filteredExercises.length === 0) return null;

                  return (
                    <div key={mId} className="space-y-2">
                      <div className="flex items-center justify-between px-1">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                          {groupInfo?.name || mId}
                        </h4>
                        <span className="text-[10px] text-muted-foreground/70">
                          {filteredExercises.length} {filteredExercises.length === 1 ? "opción" : "opciones"}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {filteredExercises.map((item) => {
                          const selIdx = selectedAddExercises.findIndex((s) => s.entry.name === item.name);
                          const isSelected = selIdx !== -1;

                          return (
                            <div
                              key={item.name}
                              onClick={() => handleToggleSelectAddExercise(item, mId)}
                              className={cn(
                                "p-3 rounded-2xl border transition flex items-center justify-between gap-3 cursor-pointer select-none",
                                isSelected
                                  ? "border-foreground bg-secondary/80 ring-2 ring-foreground/20 shadow-xs"
                                  : "border-border/70 bg-card hover:bg-secondary/40",
                              )}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                {/* Thumbnail */}
                                <div className="w-11 h-11 rounded-xl bg-card p-1 flex items-center justify-center shrink-0 border border-border/70">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-contain"
                                  />
                                </div>

                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <h5 className="text-xs font-bold text-foreground truncate">
                                      {item.name}
                                    </h5>
                                    {isSelected && (
                                      <Badge className={cn(
                                        "text-[9px] font-black px-1.5 py-0 h-4 rounded-full",
                                        addExerciseModalMode === "superset"
                                          ? "bg-amber-500 text-black"
                                          : "bg-foreground text-background"
                                      )}>
                                        #{selIdx + 1}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-muted-foreground truncate">
                                    {item.equipment} • <span className="font-bold text-foreground/80">{item.reps}</span> ({item.load})
                                  </p>
                                </div>
                              </div>

                              {/* Checkbox / Botón de Estado */}
                              <div className="shrink-0 flex items-center gap-1.5">
                                <div
                                  className={cn(
                                    "w-6 h-6 rounded-full border flex items-center justify-center transition-all",
                                    isSelected
                                      ? "bg-foreground text-background border-foreground shadow-2xs font-bold"
                                      : "border-border/80 bg-card group-hover:border-foreground/60 text-transparent",
                                  )}
                                >
                                  <Check className={cn("w-3.5 h-3.5 stroke-[3]", isSelected ? "text-emerald-400" : "opacity-0")} />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sticky Bottom Confirmation Bar */}
              <div className="p-4 border-t border-border/40 bg-card/95 backdrop-blur-md flex items-center justify-between gap-3 shrink-0">
                <div className="min-w-0">
                  <span className="text-[11px] font-bold text-foreground block truncate">
                    {selectedAddExercises.length === 0
                      ? addExerciseModalMode === "superset"
                        ? "Selecciona 2 ejercicios"
                        : "Selecciona un ejercicio"
                      : selectedAddExercises.map((s) => s.entry.name).join(" + ")}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {addExerciseModalMode === "superset"
                      ? `${selectedAddExercises.length}/2 seleccionados para la superserie`
                      : `${selectedAddExercises.length} ejercicio seleccionado`}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setAddExerciseBlockId(null);
                      setSelectedAddExercises([]);
                    }}
                    className="rounded-xl h-9 text-xs font-semibold cursor-pointer"
                  >
                    Cancelar
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    disabled={
                      selectedAddExercises.length === 0 ||
                      (addExerciseModalMode === "superset" && selectedAddExercises.length < 2)
                    }
                    onClick={handleConfirmAddExercises}
                    className={cn(
                      "rounded-xl h-9 px-4 text-xs font-black shadow-md transition cursor-pointer flex items-center gap-1.5",
                      addExerciseModalMode === "superset" || selectedAddExercises.length >= 2
                        ? "bg-amber-500 hover:bg-amber-400 text-black"
                        : "bg-foreground hover:bg-foreground/90 text-background",
                    )}
                  >
                    {addExerciseModalMode === "link" ? (
                      <>
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span>Vincular Superserie</span>
                      </>
                    ) : addExerciseModalMode === "superset" || selectedAddExercises.length >= 2 ? (
                      <>
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span>Crear Superserie ({selectedAddExercises.length})</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Añadir Ejercicio</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* MODAL 6: CONFIRMACIÓN DE FINALIZACIÓN ANTES DE TIEMPO */}
        <AlertDialog
          open={showIncompleteConfirmDialog}
          onOpenChange={setShowIncompleteConfirmDialog}
        >
          <AlertDialogContent className="rounded-3xl p-6 sm:p-8 border border-border bg-card font-sans">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" /> ¿Finalizar sesión ahora?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs text-muted-foreground pt-1 leading-relaxed">
                Aún tienes{" "}
                <strong>
                  {totalRoundsCount - completedRoundsCount} series pendientes
                </strong>{" "}
                por completar. ¿Deseas terminar la sesión y registrar el progreso actual?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="pt-4 gap-2">
              <AlertDialogCancel
                onClick={() => {
                  setIsWorkoutPaused(false);
                }}
                className="rounded-xl font-semibold cursor-pointer"
              >
                Continuar entrenando
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setShowIncompleteConfirmDialog(false);
                  setShowCompletionModal(true);
                }}
                className="rounded-xl bg-foreground text-background hover:opacity-90 font-bold cursor-pointer"
              >
                Sí, finalizar sesión
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* MODAL 7: RESUMEN Y FEEDBACK GLOBAL POST-WORKOUT */}
        {showCompletionModal && (
          <Dialog
            open={showCompletionModal}
            onOpenChange={(open) => {
              if (!open) {
                setShowCompletionModal(false);
                setIsWorkoutPaused(false);
              }
            }}
          >
            <DialogContent className="sm:max-w-md rounded-3xl p-6 border border-border bg-card text-center shadow-2xl space-y-5 font-sans">
              <DialogHeader className="space-y-1 text-center">
                <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest mx-auto">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ¡Sesión Completada!
                </div>
                <DialogTitle className="text-xl font-black text-foreground pt-1">
                  {workoutTitle}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Resumen de rendimiento y calibración de recuperación
                </DialogDescription>
              </DialogHeader>

              {/* 3 Metric Summary Cards */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 rounded-2xl bg-secondary/40 border border-border/60 text-center space-y-0.5">
                  <Clock className="w-4 h-4 mx-auto text-indigo-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Tiempo Total
                  </span>
                  <span className="text-sm font-black text-foreground font-mono block">
                    {workoutElapsedSeconds > 0 ? formatTime(workoutElapsedSeconds) : `${duration} min`}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-secondary/40 border border-border/60 text-center space-y-0.5">
                  <Layers className="w-4 h-4 mx-auto text-emerald-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Series
                  </span>
                  <span className="text-sm font-black text-foreground block">
                    {completedRoundsCount}/{totalRoundsCount}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-secondary/40 border border-border/60 text-center space-y-0.5">
                  <Activity className="w-4 h-4 mx-auto text-amber-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Nivel
                  </span>
                  <span className="text-sm font-black text-foreground block">
                    {intensity}
                  </span>
                </div>
              </div>

              {/* Músculos Estimulados */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                {selectedMuscleIds.map((mId) => {
                  const m = MUSCLE_GROUPS.find((g) => g.id === mId);
                  return (
                    <Badge
                      key={mId}
                      variant="secondary"
                      className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full"
                    >
                      {m?.name || mId}
                    </Badge>
                  );
                })}
              </div>

              {/* 1-Tap Global Rating Selector */}
              <div className="space-y-2 text-left pt-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                  ¿Cómo sentiste la sesión en general?
                </span>

                <div className="space-y-2">
                  {[
                    {
                      id: "ligero",
                      label: "🟢 Ligera",
                      sub: "Pude haber dado más. Subir la carga la próxima vez.",
                    },
                    {
                      id: "perfecto",
                      label: "⚡ Perfecta",
                      sub: "Desafío ideal con técnica limpia y fatiga controlada.",
                    },
                    {
                      id: "extenuante",
                      label: "🔴 Extenuante",
                      sub: "Llegué al límite absoluto. Necesitaré mayor recuperación.",
                    },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setGlobalSessionRating(opt.id as any)}
                      className={cn(
                        "w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3",
                        globalSessionRating === opt.id
                          ? "bg-foreground text-background border-foreground shadow-xs font-bold"
                          : "bg-card border-border/70 text-foreground hover:bg-secondary/50",
                      )}
                    >
                      <div className="space-y-0.5 min-w-0">
                        <span className="text-xs font-black block">
                          {opt.label}
                        </span>
                        <p
                          className={cn(
                            "text-[10px] leading-tight truncate",
                            globalSessionRating === opt.id
                              ? "text-background/80"
                              : "text-muted-foreground",
                          )}
                        >
                          {opt.sub}
                        </p>
                      </div>
                      {globalSessionRating === opt.id && (
                        <Check className="w-4 h-4 shrink-0 text-emerald-400 stroke-[3]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Botón Principal */}
              <div className="pt-2">
                <Button
                  onClick={() => executeSaveWorkout(globalSessionRating)}
                  className="w-full h-12 rounded-2xl bg-foreground text-background font-black text-xs shadow-lg hover:opacity-90 transition cursor-pointer"
                >
                  Guardar y ver en AI Coach
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  }

  // ==========================================
  // VISTA 1: CONFIGURAR ENTRENAMIENTO PERSONALIZADO
  // ==========================================
  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-32 pt-2 animate-in fade-in duration-200 text-left font-sans">
      {/* 1. ENCABEZADO */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          Entrenamiento personalizado
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground font-medium">
          ¿Qué te gustaría hacer en nuestra sesión?
        </p>
      </div>

      {/* 2. LUGAR DE ENTRENAMIENTO (CHOICE CHIPS) */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
          Lugar de entrenamiento
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(["Gimnasio", "Casa"] as const).map((loc) => {
            const isSelected = loc === "Casa" ? isBodyweightOnly : !isBodyweightOnly;
            return (
              <button
                key={loc}
                type="button"
                onClick={() => handleToggleBodyweightOnly(loc === "Casa")}
                className={cn(
                  "py-3 px-4 rounded-2xl border text-xs font-bold transition-all cursor-pointer text-center",
                  isSelected
                    ? "bg-foreground text-background border-foreground shadow-xs font-black"
                    : "bg-card border-border/70 text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                )}
              >
                {loc}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. TIPO DE ENTRENAMIENTO (CHOICE CHIPS) */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
          Tipo de entrenamiento
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(["Fuerza", "Recuperar", "Calistenia", "HIIT"] as const).map((type) => {
            const isSelected = workoutType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => handleSelectWorkoutType(type)}
                className={cn(
                  "py-3 px-4 rounded-2xl border text-xs font-bold transition-all cursor-pointer text-center",
                  isSelected
                    ? "bg-foreground text-background border-foreground shadow-xs font-black"
                    : "bg-card border-border/70 text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                )}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. TIEMPO (CHOICE CHIPS) */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
          Tiempo
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {([7, 10, 15, 25, 35, 45] as const).map((mins) => {
            const isSelected = duration === mins;
            return (
              <button
                key={mins}
                type="button"
                onClick={() => setDuration(mins)}
                className={cn(
                  "py-2.5 px-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer text-center",
                  isSelected
                    ? "bg-foreground text-background border-foreground shadow-xs font-black"
                    : "bg-card border-border/70 text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                )}
              >
                {mins} min
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. MÚSCULOS OBJETIVO (GRID DE 3 COLUMNAS) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
            Músculos objetivo
          </label>
          <span className="text-[10px] text-muted-foreground font-semibold">
            {selectedMuscleIds.length} seleccionados
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={handleToggleAllMuscles}
            className={cn(
              "h-24 rounded-3xl border flex items-center justify-center p-3 text-center transition-all cursor-pointer font-bold text-xs shadow-2xs",
              isAllSelected
                ? "bg-foreground text-background border-foreground font-black shadow-xs"
                : "bg-card border-border/70 text-foreground hover:bg-secondary/50",
            )}
          >
            <span>Cuerpo completo</span>
          </button>

          <button
            type="button"
            onClick={handleToggleUpperBody}
            className={cn(
              "h-24 rounded-3xl border flex items-center justify-center p-3 text-center transition-all cursor-pointer font-bold text-xs shadow-2xs",
              isUpperSelected
                ? "bg-foreground text-background border-foreground font-black shadow-xs"
                : "bg-card border-border/70 text-foreground hover:bg-secondary/50",
            )}
          >
            <span>Parte superior</span>
          </button>

          <button
            type="button"
            onClick={handleToggleLowerBody}
            className={cn(
              "h-24 rounded-3xl border flex items-center justify-center p-3 text-center transition-all cursor-pointer font-bold text-xs shadow-2xs",
              isLowerSelected
                ? "bg-foreground text-background border-foreground font-black shadow-xs"
                : "bg-card border-border/70 text-foreground hover:bg-secondary/50",
            )}
          >
            <span>Parte inferior</span>
          </button>

          {MUSCLE_GROUPS.map((group) => {
            const isSelected = selectedMuscleIds.includes(group.id);
            const currentRecovery = recoveryLevels[group.id] ?? 85;
            const isOptimal = currentRecovery >= RECOVERY_READY_THRESHOLD;

            return (
              <button
                key={group.id}
                type="button"
                onClick={() => handleToggleMuscle(group.id)}
                className={cn(
                  "h-28 rounded-3xl border p-2 flex flex-col items-center justify-between text-center transition-all cursor-pointer shadow-2xs group hover:-translate-y-0.5",
                  isSelected
                    ? "bg-card border-foreground/60 ring-2 ring-foreground/20 shadow-sm"
                    : "bg-card/70 border-border/60 text-muted-foreground hover:bg-secondary/40",
                )}
              >
                <div className="w-12 h-12 rounded-2xl bg-secondary/40 p-1.5 flex items-center justify-center shrink-0 border border-border/40 group-hover:scale-105 transition-transform">
                  <img
                    src={group.image}
                    alt={group.name}
                    className="w-full h-full object-contain drop-shadow-xs"
                  />
                </div>

                <div className="w-full truncate">
                  <span
                    className={cn(
                      "text-[11px] block truncate font-bold",
                      isSelected ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {group.name}
                  </span>
                  <span
                    className={cn(
                      "text-[9px] font-bold block",
                      isOptimal ? "text-emerald-500" : "text-amber-500",
                    )}
                  >
                    {currentRecovery}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. INTENSIDAD (CHOICE CHIPS) */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
          Intensidad
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(["Baja", "Moderada", "Alta"] as const).map((lvl) => {
            const isSelected = intensity === lvl;
            return (
              <button
                key={lvl}
                type="button"
                onClick={() => setIntensity(lvl)}
                className={cn(
                  "py-3 px-4 rounded-2xl border text-xs font-bold transition-all cursor-pointer text-center",
                  isSelected
                    ? "bg-foreground text-background border-foreground shadow-xs font-black"
                    : "bg-card border-border/70 text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                )}
              >
                {lvl}
              </button>
            );
          })}
        </div>
      </div>

      {/* 7. SWITCH: MODALIDAD Y OPCIONES */}
      {workoutType !== "Recuperar" && (
        <div className="space-y-2.5 pt-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
            Modalidad y Opciones
          </label>

          {/* Switch 1: No tengo espacio */}
          <div className="p-4 rounded-3xl border border-border bg-card flex items-center justify-between gap-4 shadow-2xs hover:border-foreground/30 transition">
            <div className="space-y-0.5 pr-2">
              <div className="flex items-center gap-2">
                <Minimize2 className="w-4 h-4 text-sky-500 shrink-0" />
                <span className="text-xs font-bold text-foreground">
                  No tengo espacio
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground block leading-snug">
                Ejercicios en sitio optimizados para áreas de 2×2 m.
              </span>
            </div>
            <Switch
              checked={isSmallSpaceOnly}
              onCheckedChange={setIsSmallSpaceOnly}
              className="cursor-pointer shrink-0"
            />
          </div>

          {/* Switch 2: Necesito entrenar sin hacer mucho ruido */}
          <div className="p-4 rounded-3xl border border-border bg-card flex items-center justify-between gap-4 shadow-2xs hover:border-foreground/30 transition">
            <div className="space-y-0.5 pr-2">
              <div className="flex items-center gap-2">
                <VolumeX className="w-4 h-4 text-violet-500 shrink-0" />
                <span className="text-xs font-bold text-foreground">
                  Necesito entrenar sin hacer mucho ruido
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground block leading-snug">
                Bajo impacto: excluye saltos y golpes para entrenar en silencio.
              </span>
            </div>
            <Switch
              checked={isQuietWorkout}
              onCheckedChange={setIsQuietWorkout}
              className="cursor-pointer shrink-0"
            />
          </div>

          {/* Switch Superseries */}
          {!isBodyweightOnly && (
            <div className="p-4 rounded-3xl border border-border bg-card flex items-center justify-between gap-4 shadow-2xs hover:border-foreground/30 transition">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-xs font-bold text-foreground">
                    Incluir superseries
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground block">
                  Combina ejercicios agonistas o antagonistas sin descanso intermedio.
                </span>
              </div>
              <Switch
                checked={includeSupersets}
                onCheckedChange={setIncludeSupersets}
                className="cursor-pointer shrink-0"
              />
            </div>
          )}

          {/* Switch Cardio */}
          <div className="p-4 rounded-3xl border border-border bg-card flex items-center justify-between gap-4 shadow-2xs hover:border-foreground/30 transition">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-xs font-bold text-foreground">
                  Incluir entrenamiento cardiovascular
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground block">
                Añade bloque de aceleración aeróbica/anaeróbica.
              </span>
            </div>
            <Switch
              checked={includeCardio}
              onCheckedChange={setIncludeCardio}
              className="cursor-pointer shrink-0"
            />
          </div>
        </div>
      )}

      {/* 8. LIST TILES: EQUIPO Y LESIONES */}
      <div className="space-y-3 pt-1">
        <button
          type="button"
          onClick={() => setCurrentView("equipment")}
          className="w-full p-4 rounded-3xl border border-border bg-card hover:bg-secondary/40 flex items-center justify-between gap-4 shadow-2xs hover:border-foreground/30 transition cursor-pointer text-left group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-foreground block">
                Equipo ({workoutType})
              </span>
              <span className="text-[11px] text-muted-foreground">
                {isBodyweightOnly
                  ? "Modo En Casa (Solo peso corporal)"
                  : selectedEquipment.length === allowedEquipmentForType.length
                    ? `Todos los equipos de ${workoutType} (${selectedEquipment.length})`
                    : `${selectedEquipment.length} de ${allowedEquipmentForType.length} equipos seleccionados`}
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
        </button>

        <button
          type="button"
          onClick={() => setCurrentView("injuries")}
          className="w-full p-4 rounded-3xl border border-border bg-card hover:bg-secondary/40 flex items-center justify-between gap-4 shadow-2xs hover:border-foreground/30 transition cursor-pointer text-left group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-foreground block">Lesiones</span>
              <span className="text-[11px] text-muted-foreground">{selectedInjury}</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* 8. BOTÓN DE GENERAR WORKOUT */}
      <div className="pt-3">
        <Button
          onClick={handleGenerateWorkout}
          disabled={isGenerating}
          className="w-full h-14 rounded-2xl bg-foreground text-background font-black text-sm shadow-xl hover:opacity-90 transition cursor-pointer flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{isGenerating ? "Generando Workout Inteligente..." : "Generar Workout"}</span>
        </Button>
      </div>
    </div>
  );
}
