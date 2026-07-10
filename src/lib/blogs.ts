export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: "Tendencias" | "Nutrición" | "Entrenamiento" | "Gestión & Gimnasios" | "Bienestar & Salud" | "Tecnología Fitness";
  readTime: string;
  date: string;
  author: {
    name: string;
    role: string;
    avatar: string;
    bio: string;
  };
  image: string;
  featured?: boolean;
  tags: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "post-1",
    slug: "el-auge-del-fitness-hibrido",
    title: "El auge del fitness híbrido: Cómo combinar entrenamiento presencial y digital",
    excerpt: "Descubrí cómo los centros deportivos están adaptando sus modelos para ofrecer flexibilidad total a sus socios mediante la integración de IA y monitoreo en tiempo real.",
    category: "Tendencias",
    readTime: "4 min de lectura",
    date: "4 de Julio, 2026",
    author: {
      name: "Valeria Rossi",
      role: "Especialista en Tendencias Fitness",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      bio: "Periodista deportiva y consultora en innovación tecnológica aplicada al bienestar y centros de alto rendimiento."
    },
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    tags: ["Fitness Híbrido", "Tendencias", "Tecnología", "Gimnasios"],
    content: `
El mundo del entrenamiento ha experimentado una metamorfosis irreversible. Atrás quedaron los días en que un usuario dependía exclusivamente del horario fijo de una clase presencial o del espacio físico estricto de su gimnasio de barrio. 

Hoy en día, el **fitness híbrido** no es una moda pasajera, sino la expectativa estándar de la nueva generación de deportistas y entusiastas de la salud.

---

### ¿Qué es exactamente el modelo de fitness híbrido?

El modelo híbrido combina lo mejor de dos mundos: la energía motivadora, la comunidad y la infraestructura del centro presencial con la flexibilidad, autonomía y personalización de las herramientas digitales impulsadas por Inteligencia Artificial.

> *"Los usuarios ya no eligen entre ir al gimnasio o entrenar en casa; quieren la libertad de hacer ambas cosas sin perder la continuidad de su progreso ni el contacto con su comunidad."*

#### Beneficios clave del modelo híbrido para el alumno:

1. **Aforo en tiempo real y reserva flexible:** Posibilidad de verificar la ocupación del gimnasio antes de salir de casa y reservar cupos en segundos.
2. **Seguimiento inteligente:** Planes de entrenamiento adaptativos que se sincronizan tanto en la sala de musculación como en salidas al aire libre.
3. **Pases por uso y flexibilidad económica:** Opción de alternar entre pases libres, clases individuales y membresías multi-sede.

---

### ¿Cómo están respondiendo los gimnasios y studios líderes?

Los centros que lideran esta transformación en América Latina están implementando tecnología de **gestión inteligente como Shakerfy**, la cual permite:

- **Medición de ocupación en directo:** Los socios ven en su app el porcentaje de capacidad del centro (verde, amarillo, rojo).
- **Check-in automatizado sin fricción:** Códigos QR dinámicos y validación instantánea de apto físico.
- **Comunicación personalizada:** Notificaciones automáticas cuando un alumno falta más de 7 días, previniendo el abandono y aumentando la retención en más de un 35%.

### Conclusión y perspectivas a futuro

El futuro del bienestar pertenece a los centros que pongan la experiencia del usuario en el centro de su estrategia. Adoptar herramientas inteligentes no solo optimiza la operación diaria del gimnasio, sino que fideliza a una comunidad activa que valora su tiempo y su salud.
    `
  },
  {
    id: "post-2",
    slug: "guia-nutricion-pre-entrenamiento",
    title: "Guía completa de nutrición pre-entrenamiento: Qué comer según tu objetivo",
    excerpt: "Aprende a optimizar tus niveles de energía, fuerza y resistencia ajustando tu ingesta de macronutrientes antes de entrar a la sala o a tu clase intensiva.",
    category: "Nutrición",
    readTime: "5 min de lectura",
    date: "28 de Junio, 2026",
    author: {
      name: "Lic. Gonzalo Méndez",
      role: "Nutricionista Deportivo (MN 4821)",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      bio: "Asesor de atletas de alta competencia y conferencista en nutrición basada en evidencia."
    },
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
    featured: false,
    tags: ["Nutrición", "Rendimiento", "Comida Pre-WOD", "Suplementos"],
    content: `
La nutrición pre-entrenamiento es la gasolina que determina si vas a romper tus marcas personales en la sesión o si te vas a arrastrar a mitad del entrenamiento con fatiga prematura y falta de enfoque mental.

### La regla de oro del Timing

El momento en que ingieres alimentos antes de entrenar dicta el tipo de nutrientes que tu cuerpo puede digerir y convertir en ATP disponible.

#### 1. Comida Principal (2 a 3 horas antes)
Debe ser una comida completa con carbohidratos complejos de absorción media/lenta, proteína magra y una cantidad moderada de grasas saludables.

- **Ejemplo:** Arroz integral o batata hervida con pechuga de pollo y vegetales al vapor.
- **Objetivo:** Llenar las reservas de glucógeno muscular sin causar malestar estomacal.

#### 2. Snack Rápido (30 a 60 minutos antes)
Carbohidratos de rápida absorción, bajos en fibra y casi nulos en grasas para evitar la digestión lenta durante el ejercicio.

- **Ejemplo:** Una banana madura con una cucharadita de miel, o dos galletas de arroz con mermelada.
- **Objetivo:** Elevar la glucosa sanguínea disponible inmediatamente para esfuerzo de alta intensidad.

---

### Errores comunes que debes evitar

- **Consumir exceso de fibra o grasa poco antes de entrenar:** Produce pesadez y reflujo.
- **Entrenar completamente en ayunas en sesiones de hipertrofia o CrossFit intenso:** Puede aumentar el catabolismo y limitar la potencia máxima.
- **Abusar de los pre-entrenos con exceso de cafeína:** Genera taquicardia y posterior "Crash" energético.

> *"La hidratación previa es tan importante como la comida sólida: beber entre 400ml y 600ml de agua en las 2 horas previas asegura el volumen plasmático adecuado para la bomba muscular."*
    `
  },
  {
    id: "post-3",
    slug: "crossfit-vs-funcional-diferencias",
    title: "CrossFit vs Entrenamiento Funcional: Diferencias clave y cuál se adapta mejor a vos",
    excerpt: "Desglosamos las metodologías, equipamientos, riesgos e intensidad de cada disciplina para ayudarte a elegir la mejor opción según tu estado físico actual.",
    category: "Entrenamiento",
    readTime: "6 min de lectura",
    date: "20 de Junio, 2026",
    author: {
      name: "Coach Martín Soria",
      role: "Head Coach & Preparador Físico",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      bio: "Atleta de CrossFit regional y docente en ciencias del ejercicio con más de 12 años de trayectoria."
    },
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=80",
    featured: false,
    tags: ["CrossFit", "Funcional", "Comparativa", "Principiantes"],
    content: `
Una de las preguntas más frecuentes que recibimos en los buscadores de Shakerfy es: *"¿Debería anotarme en CrossFit o en Entrenamiento Funcional?"*. Aunque ambas disciplinas comparten raíces en el movimiento biomecánico multiarticular, sus metodologías y filosofías son bastante distintas.

### 1. Filosofía y Estructura

- **CrossFit:** Es una marca y un deporte de alta intensidad fundado en movimientos constantemente variados ejecutados a alta intensidad. Combina levantamiento olímpico de pesas (Clean & Jerk, Snatch), gimnasia deportiva (Pull-ups, Muscle-ups) y capacidad cardiovascular (Remo, Cintas, Saltos).
- **Entrenamiento Funcional:** Se enfoca en patrones de movimiento cotidianos (empujar, traccionar, bisagra de cadera, sentadilla, rotación) adaptados al nivel del alumno. Busca mejorar la calidad de vida, postura y prevención de lesiones sin la exigencia competitiva del cronómetro.

---

### Tabla Comparativa Rápida

| Aspecto | CrossFit | Entrenamiento Funcional |
| :--- | :--- | :--- |
| **Intensidad** | Alta a Muy Alta | Moderada a Escalable |
| **Elemento Clave** | Barras olímpicas, KGs, WOD contra reloj | TRXs, Kettlebells, Bands, Bosu |
| **Comunidad** | Muy unida, espíritu de Box | Grupos dinámicos, ambiente relajado |
| **Curva de Aprendizaje** | Exigente (Técnica olímpica) | Accesible desde el primer día |

### ¿Cuál elegir según tu perfil?

- **Elegí CrossFit si:** Te motivan los desafíos constantes, querés superarte contra el reloj, te atrae la fuerza máxima con barra y buscás una comunidad súper apasionada.
- **Elegí Funcional si:** Buscás moverte mejor, tonificar, perder grasa corporal, recuperarte de una vida sedentaria o entrenar sin la presión de levantar pesos máximos.
    `
  },
  {
    id: "post-4",
    slug: "abrir-un-studio-boutique-exito",
    title: "Cómo abrir un Studio Boutique o Box con éxito en 2026: Guía paso a paso",
    excerpt: "Descubrí las claves financieras, de infraestructura y de software necesarias para posicionar un centro fitness rentable con alta tasa de retención.",
    category: "Gestión & Gimnasios",
    readTime: "7 min de lectura",
    date: "15 de Junio, 2026",
    author: {
      name: "Santiago Peralta",
      role: "Fundador & Consultor de Gimnasios",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
      bio: "Asesor de negocios de salud y fitness. Ha ayudado a escalar más de 40 centros deportivos en la región."
    },
    image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80",
    featured: false,
    tags: ["Gestión", "Emprendedores", "Studio Boutique", "Software"],
    content: `
El concepto del tradicional "gimnasio de hierros gigante" ha dado paso a los **Studios Boutique**: espacios especializados de entre 150m² y 400m² enfocados en una experiencia premium, grupos reducidos y atención hiperpersonalizada.

### 1. Definición del Concepto y Nicho Claro
No intentes abarcar todo. Los studios más rentables son mono-disciplina o bi-disciplina:
- Pilates Reformer + Yoga Zen
- Cycling Boutique (Spinning show con luces y DJ)
- Functional Box + Recovery Zone

### 2. Digitalización Integral desde el Día 1
El error #1 de los nuevos dueños es llevar la gestión en planillas de Excel o anotadores de papel. 

Un centro moderno requiere:
- **Reserva automática de cupos:** Para evitar sobrecupos y discusiones en recepción.
- **Facturación y cobros recurrentes:** Automatizar el cobro mensual por tarjeta o transferencia.
- **Ficha médica y aptos digitales:** Cumplimiento legal transparente.

> *"Un socio que puede reservar su clase desde el celular en 10 segundos renueva su membresía un 40% más veces que uno que debe enviar un WhatsApp para pedir turno."*

### 3. La regla del 'Customer Lifetime Value' (LTV)
Captar un alumno cuesta hasta 5 veces más que retenerlo. Diseñá protocolos de bienvenida, seguimiento de ausencias y encuestas de satisfacción periódicas para mantener una tasa de baja (churn) inferior al 5% mensual.
    `
  },
  {
    id: "post-5",
    slug: "importancia-recuperacion-muscular-sueno",
    title: "La importancia de la recuperación muscular: Sueño, terapia de frío y movilidad",
    excerpt: "El músculo no crece durante el entrenamiento sino durante el descanso. Analizamos las mejores estrategias científicamente validadas para acelerar la regeneración.",
    category: "Bienestar & Salud",
    readTime: "5 min de lectura",
    date: "10 de Junio, 2026",
    author: {
      name: "Dra. Camila Torres",
      role: "Médica Deportóloga",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      bio: "Especialista en medicina del rendimiento físico, optimización hormonal y recuperación fisiológica."
    },
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80",
    featured: false,
    tags: ["Recuperación", "Sueño", "Crioterapia", "Movilidad"],
    content: `
Pudiendo entrenar con la mayor intensidad del mundo, si no dominas los pilares de la recuperación biológica, tarde o temprano estancarás tu progreso o caerás en el sobreentrenamiento (overtraining syndrome).

### 1. El Sueño Profundo: El verdadero anabólico natural
Durante la fase NREM 3 del sueño profundo, el cuerpo libera la mayor cantidad de **Hormona del Crecimiento Humano (HGH)** y sintetiza proteínas musculares para reparar las microlesiones causadas por el ejercicio.

- **Recomendación:** Mantener una rutina de 7 a 9 horas de sueño continuo en una habitación a temperatura fresca (18°C a 20°C) y libre de luz azul de pantallas 1 hora antes de acostarte.

---

### 2. Inmersión en Agua Fría (Ice Baths)
La crioterapia o los baños de hielo a 10°C - 15°C reducen la inflamación aguda y la agudeza del dolor muscular de aparición tardía (DOMS).

> *Tip:* Si tu objetivo principal es la **hipertrofia muscular pura**, evita el baño congelado inmediatamente después de entrenar pesas, ya que puede mitigar la cascada de señalización inflamatoria necesaria para la adaptación hipertrófica. Reservalo para días de descanso o entrenamientos cardiovasculares/competencias.

### 3. Movilidad y Liberación Miofascial
El uso diario de Foam Roller y sesiones suaves de estiramientos dinámicos mejoran el flujo sanguíneo local, barriendo deshechos metabólicos y devolviendo la elasticidad adecuada a los tejidos conectivos.
    `
  },
  {
    id: "post-6",
    slug: "aforo-tiempo-real-nuevo-estandar",
    title: "Aforo en tiempo real y reservas instantáneas: El nuevo estándar del usuario",
    excerpt: "Cómo la tecnología de datos está transformando la convivencia dentro de los centros deportivos y eliminando los embotellamientos en hora pico.",
    category: "Tecnología Fitness",
    readTime: "4 min de lectura",
    date: "2 de Junio, 2026",
    author: {
      name: "Valeria Rossi",
      role: "Especialista en Tendencias Fitness",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      bio: "Periodista deportiva y consultora en innovación tecnológica aplicada al bienestar."
    },
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
    featured: false,
    tags: ["Tecnología", "IA", "Aforo", "Experiencia Alumno"],
    content: `
A nadie le gusta llegar al gimnasio motivado para hacer su rutina de fuerza y descubrir que hay 5 personas esperando para usar la misma multipower o la prensa de piernas.

La falta de visibilidad del aforo solía ser una de las principales quejas de los usuarios de gimnasios urbanos. Hoy, la tecnología ha resuelto este dilema de manera elegante.

### La solución: Sensores y Check-in Conectado

Mediante sistemas integrados como **Shakerfy**, el ingreso por código QR o molinete transmite datos en tiempo real a la aplicación móvil del socio.

#### ¿Cómo lo ve el usuario?
- **Verde (<50% aforo):** Excelente momento para entrenar con máquinas libres.
- **Amarillo (50%-80% aforo):** Flujo moderado pero fluido.
- **Naranja / Rojo (>80% aforo):** Horario pico. La app sugiere automáticamente sedes cercanas con menor concurrencia o de calistenia/clases grupales con cupo garantizado.

Esto distribuye la carga horaria a lo largo del día, optimizando el uso de las instalaciones para el gimnasio y garantizando una experiencia de entrenamiento sin esperas frustrantes para el deportista.
    `
  }
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(p => p.slug === slug);
}

export function getRelatedPosts(currentSlug: string, category: string, limit = 3): BlogPost[] {
  const otherPosts = BLOG_POSTS.filter(p => p.slug !== currentSlug);
  const sameCategory = otherPosts.filter(p => p.category === category);
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);
  return [...sameCategory, ...otherPosts.filter(p => p.category !== category)].slice(0, limit);
}
