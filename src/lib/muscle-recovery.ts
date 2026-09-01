// Motor Fisiológico de Recuperación Muscular — Shakerfy AI
// Implementa simulación de regeneración biológica tisular (~48-72h),
// umbral de corte del 70% para generación de workouts y persistencia local.

export type MuscleId =
  | "hombros"
  | "biceps"
  | "triceps"
  | "espalda"
  | "pecho"
  | "abdominales"
  | "espalda_baja"
  | "gluteos"
  | "cuadriceps"
  | "isquiotibiales";

export interface MuscleGroupInfo {
  id: MuscleId;
  name: string;
  image: string;
  region: "Tren Superior" | "Tronco & Core" | "Tren Inferior";
  anatomy: string;
  description: string;
}

export const MUSCLE_GROUPS: MuscleGroupInfo[] = [
  {
    id: "hombros",
    name: "Hombros",
    image: "/hombro (2).png",
    region: "Tren Superior",
    anatomy: "Deltoides anterior, lateral y posterior",
    description: "Estabilidad glenohumeral y empujes verticales.",
  },
  {
    id: "biceps",
    name: "Bíceps",
    image: "/biceps.png",
    region: "Tren Superior",
    anatomy: "Bíceps braquial y braquial anterior",
    description: "Flexión de codo y tracciones supinadas.",
  },
  {
    id: "triceps",
    name: "Tríceps",
    image: "/musculos (4).png",
    region: "Tren Superior",
    anatomy: "Tríceps braquial (3 cabezas)",
    description: "Extensión de codo y bloqueos de empuje.",
  },
  {
    id: "espalda",
    name: "Espalda",
    image: "/atras.png",
    region: "Tren Superior",
    anatomy: "Dorsal ancho, romboides y trapecios",
    description: "Tracciones verticales/horizontales y retracción escapular.",
  },
  {
    id: "pecho",
    name: "Pecho",
    image: "/gimnasia.png",
    region: "Tren Superior",
    anatomy: "Pectoral mayor y menor",
    description: "Aducción horizontal y empujes planos/inclinados.",
  },
  {
    id: "abdominales",
    name: "Abdominales",
    image: "/humano.png",
    region: "Tronco & Core",
    anatomy: "Recto abdominal, oblicuos y transverso",
    description: "Anti-extensión, flexión de tronco y estabilidad central.",
  },
  {
    id: "espalda_baja",
    name: "Espalda baja",
    image: "/atras (3).png",
    region: "Tronco & Core",
    anatomy: "Erectores espinales y cuadrado lumbar",
    description: "Soporte axial, bisagra de cadera y anti-flexión lumbar.",
  },
  {
    id: "gluteos",
    name: "Glúteos",
    image: "/musculos (1).png",
    region: "Tren Inferior",
    anatomy: "Glúteo mayor, medio y menor",
    description: "Extensión potente de cadera y estabilización pélvica.",
  },
  {
    id: "cuadriceps",
    name: "Cuádriceps",
    image: "/frente.png",
    region: "Tren Inferior",
    anatomy: "Recto femoral y vastos (medial, lateral, intermedio)",
    description: "Extensión de rodilla en sentadillas y zancadas.",
  },
  {
    id: "isquiotibiales",
    name: "Isquiotibiales",
    image: "/atras (1).png",
    region: "Tren Inferior",
    anatomy: "Bíceps femoral, semitendinoso y semimembranoso",
    description: "Flexión de rodilla, desaceleración y bisagra posterior.",
  },
];

export const RECOVERY_READY_THRESHOLD = 70; // Umbral fisiológico (>70% para inclusión en workouts pesados)
const RECOVERY_STORAGE_KEY = "shakerfy_muscle_recovery_v2";

// Tasa fisiológica de recuperación: ~2.1% por hora de descanso (~48h para recuperación completa desde 0%)
const RECOVERY_RATE_PER_HOUR = 2.1;

export interface StoredRecoveryData {
  levels: Record<MuscleId, number>;
  lastUpdated: number; // timestamp en ms
}

const DEFAULT_LEVELS: Record<MuscleId, number> = {
  hombros: 88,
  biceps: 92,
  triceps: 85,
  espalda: 90,
  pecho: 84,
  abdominales: 95,
  espalda_baja: 80,
  gluteos: 86,
  cuadriceps: 78,
  isquiotibiales: 82,
};

/**
 * Obtiene los niveles actuales de recuperación calculando la regeneración biológica
 * transcurrida desde el último registro.
 */
export function getCalculatedMuscleRecovery(): Record<MuscleId, number> {
  if (typeof window === "undefined") {
    return { ...DEFAULT_LEVELS };
  }

  try {
    const raw = localStorage.getItem(RECOVERY_STORAGE_KEY);
    const now = Date.now();

    if (!raw) {
      const initialData: StoredRecoveryData = {
        levels: { ...DEFAULT_LEVELS },
        lastUpdated: now,
      };
      localStorage.setItem(RECOVERY_STORAGE_KEY, JSON.stringify(initialData));
      return initialData.levels;
    }

    const data: StoredRecoveryData = JSON.parse(raw);
    const lastTime = data.lastUpdated || now;
    const hoursElapsed = Math.max(0, (now - lastTime) / (1000 * 60 * 60));

    // Si ha pasado tiempo, simula la regeneración biológica
    const gainedRecovery = hoursElapsed * RECOVERY_RATE_PER_HOUR;
    const updatedLevels: Record<MuscleId, number> = {} as any;

    let hasChanged = false;
    for (const group of MUSCLE_GROUPS) {
      const currentVal = typeof data.levels?.[group.id] === "number" ? data.levels[group.id] : 85;
      const simulatedVal = Math.min(100, Math.round(currentVal + gainedRecovery));
      updatedLevels[group.id] = simulatedVal;
      if (simulatedVal !== currentVal) {
        hasChanged = true;
      }
    }

    if (hasChanged && hoursElapsed > 0.05) {
      // Actualiza el timestamp si hubo progreso significativo (más de 3 min)
      const newData: StoredRecoveryData = {
        levels: updatedLevels,
        lastUpdated: now,
      };
      localStorage.setItem(RECOVERY_STORAGE_KEY, JSON.stringify(newData));
    }

    return updatedLevels;
  } catch (error) {
    console.error("Error al calcular recuperación muscular:", error);
    return { ...DEFAULT_LEVELS };
  }
}

/**
 * Guarda los niveles de recuperación modificados manualmente por el usuario.
 */
export function saveMuscleRecovery(levels: Record<MuscleId, number>): void {
  if (typeof window === "undefined") return;
  try {
    const data: StoredRecoveryData = {
      levels: { ...levels },
      lastUpdated: Date.now(),
    };
    localStorage.setItem(RECOVERY_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent("shakerfy:muscle-recovery-updated", { detail: levels }));
  } catch (error) {
    console.error("Error al guardar recuperación muscular:", error);
  }
}

/**
 * Aplica fatiga muscular tras un entrenamiento o sesión específica.
 */
export function applyFatigueToMuscles(
  muscleFatigueMap: Partial<Record<MuscleId, number>>,
): Record<MuscleId, number> {
  const currentLevels = getCalculatedMuscleRecovery();
  const newLevels: Record<MuscleId, number> = { ...currentLevels };

  for (const [mId, fatigue] of Object.entries(muscleFatigueMap)) {
    const id = mId as MuscleId;
    if (newLevels[id] !== undefined && typeof fatigue === "number") {
      newLevels[id] = Math.max(15, Math.min(100, newLevels[id] - fatigue));
    }
  }

  saveMuscleRecovery(newLevels);
  return newLevels;
}

/**
 * Mapeo de actividades deportivas comunes a los grupos musculares fatigados.
 */
export function updateMuscleRecoveryForActivity(
  activityName: string,
  intensity: "low" | "med" | "high" = "med",
  durationMinutes: number = 30,
): Record<MuscleId, number> {
  const intensityMultiplier = intensity === "high" ? 1.3 : intensity === "low" ? 0.7 : 1.0;
  const durationMultiplier = Math.min(1.4, Math.max(0.6, durationMinutes / 40));
  const factor = intensityMultiplier * durationMultiplier;

  const act = activityName.toLowerCase();
  const fatigueMap: Partial<Record<MuscleId, number>> = {};

  if (act.includes("carrera") || act.includes("running") || act.includes("trote")) {
    fatigueMap.cuadriceps = Math.round(25 * factor);
    fatigueMap.isquiotibiales = Math.round(28 * factor);
    fatigueMap.gluteos = Math.round(22 * factor);
    fatigueMap.espalda_baja = Math.round(15 * factor);
    fatigueMap.abdominales = Math.round(10 * factor);
  } else if (act.includes("ciclismo") || act.includes("bici") || act.includes("spinning")) {
    fatigueMap.cuadriceps = Math.round(35 * factor);
    fatigueMap.gluteos = Math.round(28 * factor);
    fatigueMap.isquiotibiales = Math.round(22 * factor);
    fatigueMap.espalda_baja = Math.round(15 * factor);
  } else if (act.includes("pesas") || act.includes("musculación") || act.includes("fuerza")) {
    fatigueMap.pecho = Math.round(25 * factor);
    fatigueMap.espalda = Math.round(25 * factor);
    fatigueMap.hombros = Math.round(25 * factor);
    fatigueMap.biceps = Math.round(20 * factor);
    fatigueMap.triceps = Math.round(20 * factor);
    fatigueMap.cuadriceps = Math.round(25 * factor);
    fatigueMap.isquiotibiales = Math.round(25 * factor);
    fatigueMap.gluteos = Math.round(25 * factor);
    fatigueMap.abdominales = Math.round(20 * factor);
    fatigueMap.espalda_baja = Math.round(20 * factor);
  } else if (act.includes("crossfit") || act.includes("funcional") || act.includes("hiit")) {
    fatigueMap.hombros = Math.round(28 * factor);
    fatigueMap.espalda = Math.round(28 * factor);
    fatigueMap.cuadriceps = Math.round(30 * factor);
    fatigueMap.isquiotibiales = Math.round(28 * factor);
    fatigueMap.gluteos = Math.round(30 * factor);
    fatigueMap.abdominales = Math.round(25 * factor);
    fatigueMap.espalda_baja = Math.round(22 * factor);
  } else if (act.includes("natación") || act.includes("nadar")) {
    fatigueMap.espalda = Math.round(32 * factor);
    fatigueMap.hombros = Math.round(30 * factor);
    fatigueMap.triceps = Math.round(22 * factor);
    fatigueMap.pecho = Math.round(20 * factor);
    fatigueMap.abdominales = Math.round(20 * factor);
    fatigueMap.cuadriceps = Math.round(15 * factor);
  } else if (act.includes("boxeo") || act.includes("artes marciales") || act.includes("combate")) {
    fatigueMap.hombros = Math.round(35 * factor);
    fatigueMap.triceps = Math.round(25 * factor);
    fatigueMap.abdominales = Math.round(30 * factor);
    fatigueMap.cuadriceps = Math.round(20 * factor);
    fatigueMap.espalda_baja = Math.round(18 * factor);
  } else if (act.includes("yoga") || act.includes("pilates") || act.includes("estiramiento")) {
    fatigueMap.abdominales = Math.round(12 * factor);
    fatigueMap.espalda_baja = Math.round(10 * factor);
  } else {
    fatigueMap.cuadriceps = Math.round(18 * factor);
    fatigueMap.isquiotibiales = Math.round(18 * factor);
    fatigueMap.gluteos = Math.round(18 * factor);
    fatigueMap.abdominales = Math.round(15 * factor);
  }

  return applyFatigueToMuscles(fatigueMap);
}

/**
 * Determina el estado cualitativo y color de un grupo muscular.
 */
export function getMuscleRecoveryStatus(percent: number): {
  status: "ready" | "moderate" | "acute";
  label: string;
  badgeClass: string;
  textColor: string;
  desc: string;
} {
  if (percent >= RECOVERY_READY_THRESHOLD) {
    return {
      status: "ready",
      label: "Listo para entrenar",
      badgeClass:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
      textColor: "text-emerald-500",
      desc: "Supercompensación óptima. Apto para series efectivas y alta intensidad.",
    };
  }
  if (percent >= 50) {
    return {
      status: "moderate",
      label: "Fatiga moderada",
      badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
      textColor: "text-amber-500",
      desc: "Reparación tisular en curso. Se aconseja trabajo accesorio ligero o descanso.",
    };
  }
  return {
    status: "acute",
    label: "Fase aguda de reparación",
    badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
    textColor: "text-rose-500",
    desc: "Microtrauma activo. Excluido del algoritmo de cargas para prevenir sobreentrenamiento.",
  };
}
