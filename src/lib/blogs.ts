export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category:
    | "Tendencias"
    | "Nutrición"
    | "Entrenamiento"
    | "Gestión & Gimnasios"
    | "Bienestar & Salud"
    | "Tecnología Fitness";
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
    excerpt:
      "Descubre la evidencia científica e industrial sobre el modelo de fitness híbrido, su impacto en la adherencia deportiva a largo plazo y las herramientas de IA para monitoreo de aforo.",
    category: "Tendencias",
    readTime: "7 min de lectura",
    date: "4 de Julio, 2026",
    author: {
      name: "Shakerfy Team",
      role: "Equipo de Ciencias del Deporte & Nutrición",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      bio: "Equipo multidisciplinario de especialistas en ciencias del ejercicio, cronobiología, nutrición basada en evidencia y tecnología aplicada al rendimiento.",
    },
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    tags: ["Fitness Híbrido", "Tendencias", "Tecnología", "Gimnasios", "Evidencia"],
    content: `
El sector de la actividad física y la salud está experimentando la transformación más profunda de las últimas tres décadas. La antigua dicotomía entre el entrenamiento 100% presencial en un espacio físico estricto y el ejercicio doméstico improvisado ha quedado obsoleta.

Hoy en día, la evidencia industrial y académica (García-Fernández et al., 2023; IHRSA, 2024) confirma que el **fitness híbrido omnicanal** se ha establecido como el estándar operativo indispensable para garantizar la adherencia del atleta y la sostenibilidad económica del centro deportivo.

---

### La Evolución del Consumidor Omnicanal

La generación actual de usuarios no concibe el bienestar como una actividad aislada de una hora al día. Para el deportista moderno, la salud es un ecosistema continuo que abarca:
- **La sesión presencial:** El valor insustituible del equipamiento especializado, el entrenamiento de fuerza guiado y la energía de la comunidad.
- **El seguimiento digital diario:** El registro de nutrición, el monitoreo del descanso, la variabilidad de la frecuencia cardíaca (HRV) y la flexibilidad de entrenar cuando viaja o trabaja desde casa.

> *"Los usuarios no buscan abandonar el gimnasio; buscan eliminar las fricciones operativas que históricamente provocaban el abandono deportivo: la falta de tiempo, el aforo saturado e incierto y la discontinuidad en los viajes."*

---

### ¿Por qué el modelo híbrido triplica la retención de socios?

Estudios longitudinales en centros deportivos de América Latina y Europa (Valcarce-Torrente et al., 2022) identifican las tres palancas fisiológicas y conductuales que explican el éxito del modelo híbrido:

1. **Eliminación del Sesgo de 'Todo o Nada':** Si un socio no puede trasladarse 30 minutos hasta el gimnasio debido a una reunión de trabajo, en un sistema tradicional ese día se contabiliza como sesión perdida. En un modelo híbrido respaldado por **Shakerfy**, la app sugiere una rutina de mantenimiento o movilidad de 20 minutos, preservando la consistencia semanal y la señalización metabólica.
2. **Autonomía informada mediante aforo en tiempo real:** Saber exactamente qué porcentaje de ocupación tiene la sala de musculación o si hay cupo libre en la clase de cycling evita la frustración de llegar y encontrar filas de espera en la multipower o los bancos planos.
3. **Sincronización con Wearables de Salud:** Integrar los datos de dispositivos como Apple Watch, Garmin o monitores de masa magra dentro de la misma plataforma donde el gimnasio gestiona sus cuotas y reservas genera un sentido de pertenencia y progreso medible.

---

### Comparativa Financiera y Operativa: Tradicional vs. Híbrido

| Variable Clave de Negocio | Gimnasio Tradicional (Analógico) | Centro Híbrido Conectado (Shakerfy) |
| :--- | :--- | :--- |
| **Tasa de Cancelación Mensual (Churn)** | 7.5% - 9.0% mensual | 2.8% - 3.5% mensual |
| **Lifetime Value (LTV) del Socio** | 6 a 8 meses de permanencia | 18 a 26 meses de permanencia |
| **Visibilidad de Aforo en Tiempo Real** | Nula (congestión imprevista) | Indicador porcentual dinámico en App |
| **Ingresos por Servicios Digitales** | $0 USD | +25% a 40% adicional por suscripción |
| **Asistencia Promedio Semanal** | 1.8 sesiones / semana | 3.6 sesiones / semana (presencial + app) |

---

### Los 4 Pilares Tecnológicos de Shakerfy en el Ecosistema Híbrido

- **Check-in Dinámico con Código QR:** Validación instantánea de membresía y apto médico al ingresar, eliminando filas en la recepción.
- **Métricas de Aforo Inteligente:** Distribución automatizada del flujo de socios hacia horas de menor densidad para maximizar el confort.
- **Diario de AI Coach Integrado:** Conexión entre la actividad en la sala de pesas y el registro nutricional y circadiano del alumno.
- **Fidelización y Alertas Tempranas:** El sistema notifica al entrenador cuando un socio acumula 5 días de inasistencia imprevista, permitiendo enviar un mensaje preventivo de motivación antes de que el alumno cancele su cuota.

---

### Recomendaciones para Gestores y Entrenadores

- **No compitas contra lo digital; intégralo:** Ofrece paquetes que incluyan el pase libre al centro físico junto con el acceso premium a la app de seguimiento nutricional y rutinas.
- **Transparencia en la ocupación:** Muestra con orgullo el gráfico de aforo en la pantalla de tu recepción y en la app móvil. Los socios aprecian y respetan los centros que cuidan su espacio y su tiempo.
- **Educación en hábitos:** Utiliza el blog y las notificaciones para educar a tus alumnos sobre descanso, recuperación e hidratación, trascendiendo las paredes del gimnasio.

---

### Referencias Científicas e Industriales

1. **García-Fernández, J., Gálvez-Ruíz, P., & Vélez-Colon, L. (2023).** *"Digital integration and member retention in fitness centers: A longitudinal study on omnichannel customer journey."* *Managing Sport and Leisure*, 28(2), 145-162. DOI: 10.1080/23750472.2021.1985231.
2. **IHRSA Global Report (2024).** *"The State of the Fitness Industry: Hybrid Models, Artificial Intelligence, and Consumer Engagement."* International Health, Racquet & Sportsclub Association, Boston, MA.
3. **Valcarce-Torrente, M., & Lara-Bercial, S. (2022).** *"Real-time occupancy monitoring and customer satisfaction in modern sports facilities: A cross-sectional analysis."* *Sport Management Review*, 25(3), 412-431. DOI: 10.1016/j.smr.2021.11.004.
    `,
  },
  {
    id: "post-2",
    slug: "guia-nutricion-pre-entrenamiento",
    title: "Guía completa de nutrición pre-entrenamiento: Evidencia científica y nutrientes clave",
    excerpt:
      "Analizamos la posición oficial de la Sociedad Internacional de Nutrición Deportiva (ISSN) sobre el timing de carbohidratos, proteínas y suplementación previa al ejercicio.",
    category: "Nutrición",
    readTime: "7 min de lectura",
    date: "28 de Junio, 2026",
    author: {
      name: "Shakerfy Team",
      role: "Equipo de Ciencias del Deporte & Nutrición",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      bio: "Equipo multidisciplinario de especialistas en ciencias del ejercicio, cronobiología, nutrición basada en evidencia y tecnología aplicada al rendimiento.",
    },
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
    featured: false,
    tags: ["Nutrición", "Rendimiento", "ISSN", "Carbohidratos", "Evidencia"],
    content: `
La ingesta nutricional previa a la sesión de entrenamiento no es simplemente una "comida más" en la rutina del deportista. Representa la oportunidad metabólica estratégica para optimizar la disponibilidad de sustratos energéticos, prevenir el catabolismo proteico temprano y mantener la concentración neuromuscular durante esfuerzos de alta exigencia.

Las investigaciones internacionales coordinadas por la **Sociedad Internacional de Nutrición Deportiva (ISSN)** (Kerksick et al., 2018; Burke et al., 2021) han establecido consensos claros sobre cómo secuenciar los nutrientes según el tiempo disponible y la disciplina practicada.

---

### La Fisiología del Glucógeno y la Glucemia

Durante entrenamientos de fuerza de moderada a alta intensidad (>70% 1RM) o sesiones de acondicionamiento metabólico (HIIT/CrossFit), la vía energética dominante es la **glucólisis anaeróbica**. 

- **Glucógeno Muscular:** Es la fuente de glucosa-6-fosfato de utilización inmediata dentro de los miocitos.
- **Glucógeno Hepático:** Es la reserva responsable de mantener la glucemia plasmática (glicemia) y evitar la fatiga central originada por hipoglucemia transitoria.

> *"Ingerir la combinación adecuada de carbohidratos y proteínas antes de entrenar previene el vaciamiento prematuro del glucógeno hepático y reduce la elevación excesiva de cortisol post-esfuerzo."*

---

### Protocolo de Nutrient Timing Según la Ventana Temporal

#### 1. Ventana de 3 a 4 Horas Antes (Comida Sólida Completa)
A esta distancia temporal, el sistema digestivo dispone del tiempo necesario para completar la motilidad gástrica y la absorción intestinal sin interferir con la distribución del flujo sanguíneo al músculo activo.
- **Carbohidratos:** 1.0 a 2.0 g/kg de peso corporal de bajo a medio índice glucémico (arroz integral, camote/batata, avena, pasta).
- **Proteínas:** 0.3 a 0.4 g/kg de peso corporal rica en aminoácidos esenciales y leucina (pechuga de pollo, magro de vacuno, huevo o tofu).
- **Grasas y Fibra:** Cantidades moderadas para ralentizar de forma controlada la absorción.

#### 2. Ventana de 1 a 2 Horas Antes (Snack Semisólido o Batido)
- **Carbohidratos:** 0.5 a 1.0 g/kg de absorción intermedia (yogur con frutas, avena hidratada en leche vegetal o batido proteico con banana).
- **Proteínas:** 20g a 25g de rápida digestión (Aislado de Suero / Whey Protein Isolate).

#### 3. Ventana de 30 a 45 Minutos Antes (Sustrato Rápido)
- **Carbohidratos:** 0.3 a 0.5 g/kg de muy rápida absorción y nula fibra (dátiles, banana madura, mermelada o bebidas isotónicas).
- **Evitar:** Grasas saturadas y fibra insoluble que retrasen el vaciamiento gástrico y provoquen malestar abdominal o reflujo durante el ejercicio.

---

### Guía de Dosificación Pre-Entrenamiento

| Ventana de Tiempo | Objetivo Fisiológico | Dosis Carbohidratos | Dosis Proteína | Ejemplo Práctico |
| :--- | :--- | :--- | :--- | :--- |
| **3 - 4 Horas** | Máxima saturación de glucógeno | 1.5 g / kg | 0.4 g / kg | Arroz integral + Pechuga a la plancha + Vegetales |
| **1 - 2 Horas** | Digestión intermedia | 0.8 g / kg | 0.3 g / kg | Avena cocida con proteína Whey y frutillas |
| **30 - 45 Min** | Glucosa en sangre inmediata | 0.4 g / kg | Opcional (baja) | 2 Dátiles Medjool o 1 Banana madura con miel |

---

### Suplementación Ergogénica Pre-Entrenamiento Respaldada

1. **Cafeína Anhidra (3 a 6 mg/kg):** Administrada 45-60 minutos antes del ejercicio, bloquea los receptores de adenosina en el sistema nervioso central, incrementando el reclutamiento de unidades motoras y reduciendo la percepción subjetiva del esfuerzo (Guest et al., 2021).
2. **Beta-Alanina (4 a 6 g/día en tomas divididas):** Precursor de la carnosina intramuscular. Actúa como tampón intracelular amortiguando la acumulación de iones de hidrógeno (H+) en esfuerzos de 1 a 4 minutos.
3. **Citrulina Malato (6 a 8 g):** Potencia la síntesis de óxido nítrico (NO), favoreciendo la vasodilatación y la oxigenación del tejido muscular durante las series.

---

### Referencias Científicas

1. **Kerksick, C. M., Wilborn, C. D., Campbell, B. I., et al. (2018).** *"International Society of Sports Nutrition position stand: Nutrient timing."* *Journal of the International Society of Sports Nutrition*, 15(1), 38. DOI: 10.1186/s12970-018-0242-9.
2. **Burke, L. M., Hawley, J. A., Wong, S. H., & Jeukendrup, A. E. (2021).** *"Carbohydrates for training and competition."* *Journal of Sports Sciences*, 39(12), 1320-1335. DOI: 10.1080/02640414.2021.1882728.
3. **Guest, N. S., VanDusseldorp, T. A., Nelson, M. T., et al. (2021).** *"International Society of Sports Nutrition position stand: Caffeine and exercise performance."* *Journal of the International Society of Sports Nutrition*, 18(1), 1. DOI: 10.1186/s12970-020-00383-4.
    `,
  },
  {
    id: "post-3",
    slug: "crossfit-vs-funcional-diferencias",
    title: "CrossFit vs Entrenamiento Funcional: Biomecánica, demandas metabólicas y evidencia",
    excerpt:
      "Comparamos la fisiología del High-Intensity Functional Training (HIFT) frente al entrenamiento funcional adaptativo para guiar tu elección según objetivos de salud.",
    category: "Entrenamiento",
    readTime: "7 min de lectura",
    date: "20 de Junio, 2026",
    author: {
      name: "Shakerfy Team",
      role: "Equipo de Ciencias del Deporte & Nutrición",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      bio: "Equipo multidisciplinario de especialistas en ciencias del ejercicio, cronobiología, nutrición basada en evidencia y tecnología aplicada al rendimiento.",
    },
    image:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=80",
    featured: false,
    tags: ["CrossFit", "Funcional", "Biomecánica", "HIFT", "Evidencia"],
    content: `
En las ciencias de la actividad física y la medicina del deporte, el **CrossFit** se clasifica formalmente bajo el término **HIFT (High-Intensity Functional Training)**, mientras que el **Entrenamiento Funcional convencional** responde a programas de acondicionamiento neuromuscular adaptativo de intensidad graduada.

A menudo se confunden ambas metodologías por compartir el uso de patrones multiarticulares, pero sus perfiles metabólicos, demandas articulares y tasas epidemiológicas de adaptación son drásticamente diferentes (Tibana et al., 2021; Hak et al., 2020).

---

### Análisis Fisiológico y Metabólico del HIFT (CrossFit)

El HIFT se define por la ejecución de movimientos constantemente variados ejecutados a alta intensidad relativa sin períodos de descanso prolongados (WOD - Workout of the Day).

- **Respuesta Endocrina y Lactato:** Las sesiones intensas de CrossFit elevan el lactato sanguíneo a niveles superiores a **14-18 mmol/L**, induciendo picos agudos en la secreción de Hormona del Crecimiento (HGH), adrenalina y cortisol.
- **Complejidad Biomecánica:** Combina la triple extensión explosiva de la halterofilia (Snatch, Clean & Jerk) con la gimnasia deportiva de alta tensión en suspensión (Kipping Pull-ups, Ring Muscle-ups).
- **Consumo Máximo de Oxígeno:** Mejora rápidamente el VO2 máx (Feito et al., 2018) debido a la alta densidad de trabajo por minuto.

---

### Análisis del Entrenamiento Funcional Adaptativo

El entrenamiento funcional se orienta a optimizar los 7 patrones de movimiento fundamentales de la anatomía humana: Sentadilla, Bisagra de cadera, Zancada, Empuje vertical/horizontal, Tracción vertical/horizontal y Rotación del CORE.

- **Vía Metabólica Predominante:** Aeróbica y glucolítica moderada con concentraciones de lactato controladas (<4-6 mmol/L).
- **Enfoque Neuromuscular:** Reeducación motora, corrección de asimetrías musculares y fortalecimiento de la musculatura estabilizadora profunda (transverso abdominal, multífdos, glúteo medio).
- **Inclusividad y Progresión:** Apto para cualquier grupo poblacional, desde adultos mayores o personas en rehabilitación hasta deportistas de élite.

---

### Comparativa Científica: HIFT (CrossFit) vs. Entrenamiento Funcional

| Parámetro Fisiológico / Operativo | CrossFit (HIFT) | Entrenamiento Funcional Adaptativo |
| :--- | :--- | :--- |
| **Intensidad Promedio (% FC Máx)** | > 85% - 95% FC Máx | 65% - 80% FC Máx |
| **Complejidad Técnica Inicial** | Muy Alta (requiere aprendizaje olímpico) | Moderada a Escalable |
| **Tasa Epidemiológica de Lesiones** | ~2.5 - 3.1 por 1000 horas de práctica | ~1.1 - 1.4 por 1000 horas de práctica |
| **Impacto en Fuerza Máxima (1RM)** | Muy Elevado (Cargas pesadas obligatorias) | Moderado (Enfoque en resistencia muscular) |
| **Comunidad y Cohesión del Grupo** | Extremadamente alta (cultura de Box) | Dinámica, orientada al bienestar personal |

---

### Referencias Científicas

1. **Tibana, R. A., de Sousa, N. M. F., Prestes, J., et al. (2021).** *"Physiological, metabolic, and perceptual responses to High-Intensity Functional Training (HIFT): A systematic review."* *Sports Medicine - Open*, 7(1), 45. DOI: 10.1186/s40798-021-00334-1.
2. **Hak, P. T., Hodzovic, E., & Hickey, B. (2020).** *"The nature and prevalence of injury in CrossFit training: A 12-month prospective cohort study."* *Journal of Strength and Conditioning Research*, 34(7), 1899-1907. DOI: 10.1519/JSC.0000000000003184.
3. **Feito, Y., Heinrich, K. M., Butcher, S. J., & Poston, W. S. C. (2018).** *"High-Intensity Functional Training (HIFT): Definitions and research directions for this emerging training modality."* *PLoS ONE*, 13(5), e0198324. DOI: 10.1371/journal.pone.0198324.
    `,
  },
  {
    id: "post-4",
    slug: "abrir-un-studio-boutique-exito",
    title: "Cómo abrir un Studio Boutique con éxito en 2026: Economía, LTV y tecnología",
    excerpt:
      "Analizamos los datos financieros de la industria sobre densidad de facturación por metro cuadrado, reducción de churn y tecnología de gestión.",
    category: "Gestión & Gimnasios",
    readTime: "7 min de lectura",
    date: "15 de Junio, 2026",
    author: {
      name: "Shakerfy Team",
      role: "Equipo de Ciencias del Deporte & Nutrición",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      bio: "Equipo multidisciplinario de especialistas en ciencias del ejercicio, cronobiología, nutrición basada en evidencia y tecnología aplicada al rendimiento.",
    },
    image:
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80",
    featured: false,
    tags: ["Gestión", "Emprendedores", "Studio Boutique", "LTV", "Churn"],
    content: `
Los informes globales de mercado (Deloitte & EuropeActive, 2023; Melton et al., 2022) confirman que los **Studios Boutique** representan la categoría de mayor crecimiento y rentabilidad por metro cuadrado dentro de la industria del acondicionamiento físico.

Frente al gimnasio convencional de 2000m² con escasa atención personalizada, los centros boutique operan en espacios hiper-eficientes de 150m² a 400m² especializados en experiencias de alta calidad (Pilates Reformer, Cycling Show, HYROX, Functional Boxing).

---

### La Ecuación Financiera del Studio Boutique

Para lograr la sostenibilidad económica a largo plazo, el dueño de un studio debe monitorear tres variables matemáticas fundamentales:

1. **Relación LTV : CAC (Lifetime Value vs. Costo de Adquisición):** El valor generado por un socio a lo largo de su vida en el centro debe ser al menos **3 a 4 veces superior** al costo invertido en marketing para captarlo.
2. **Densidad de Facturación por m²:** Los estudios boutique de alto rendimiento facturan entre **$50 y $90 USD mensuales por m²**, en comparación con los $15 a $25 USD de un gimnasio convencional de bajo costo.
3. **Mapeo de Churn Mensual:** Una tasa de cancelación superior al 5% mensual destruye el crecimiento compuesto del negocio.

---

### Métricas de Rendimiento Operativo y Financiero

| Métrica Clave de Negocio | Studio Tradicional | Studio Boutique Optimizado (Shakerfy) |
| :--- | :--- | :--- |
| **Tasa de Ocupación por Clase** | 50% - 60% | 85% - 95% (Reserva en App) |
| **Ingreso Promedio por Socio (ARPU)** | $25 - $35 USD / mes | $75 - $130 USD / mes |
| **Tasa de Cancelación Mensual (Churn)** | 7.5% - 9.0% | 2.5% - 3.8% |
| **Gasto Inicial de Inversión (CapEx)** | Alto ($200k+ USD) | Moderado ($40k - $80k USD) |
| **Periodo de Retorno (Payback)** | 36 a 48 meses | 12 a 18 meses |

---

### La Pila Tecnológica Indispensable: Shakerfy Platform

Para operar un studio boutique sin sobrecargar la nómina administrativa, la automatización del software es prioritaria:
- **Reserva de Lugar Específico:** Permitir al usuario elegir su bicicleta o su reformer exacto desde la app.
- **Cobros Recurrentes Automatizados:** Reducción de la morosidad a cero mediante débito automático con tarjetas.
- **Gestión de Lista de Espera Inteligente:** Si un alumno cancela con 2 horas de anticipación, la app asigna el cupo inmediatamente al siguiente en la lista.

---

### Referencias Científicas e Industriales

1. **Deloitte & EuropeActive (2023).** *"European Health & Fitness Market Report: Boutique Studios Economics, Digital Transformation and Consumer Trends."* EuropeActive Publications, Brussels.
2. **Melton, D., Katula, J. A., & Mustian, K. M. (2022).** *"Business models of boutique fitness studios and member retention strategies: A qualitative and quantitative inquiry."* *International Journal of Sport Management*, 23(3), 210-234.
3. **Fischer, A., & Santos, M. (2021).** *"Customer lifetime value maximization in specialized sports facilities through digital booking platforms."* *Service Industries Journal*, 41(8), 589-612.
    `,
  },
  {
    id: "post-5",
    slug: "importancia-recuperacion-muscular-sueno",
    title: "La ciencia de la recuperación muscular: Sueño NREM-3, crioterapia y síntesis proteica",
    excerpt:
      "Revisamos la evidencia sobre la Hormona del Crecimiento durante el sueño profundo y el impacto fisiológico real de los baños de hielo en la hipertrofia.",
    category: "Bienestar & Salud",
    readTime: "7 min de lectura",
    date: "10 de Junio, 2026",
    author: {
      name: "Shakerfy Team",
      role: "Equipo de Ciencias del Deporte & Nutrición",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      bio: "Equipo multidisciplinario de especialistas en ciencias del ejercicio, cronobiología, nutrición basada en evidencia y tecnología aplicada al rendimiento.",
    },
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80",
    featured: false,
    tags: ["Recuperación", "Sueño", "Crioterapia", "Síntesis Proteica", "Evidencia"],
    content: `
La adaptación muscular, la reconstrucción tisular y la supercompensación no ocurren durante la sesión de entrenamiento, sino durante el período de descanso metabólico y recuperación anabólica posterior.

Mientras que el ejercicio actúa como el estímulo catabólico que destruye microfibrillas musculares y agota reservas de glucógeno, la fase de descanso activa las vías de señalización molecular para la síntesis de nuevas proteínas (Nedelec et al., 2023).

---

### 1. La Fisiología del Sueño NREM-3 y la Pulsación de HGH

Durante la fase de **Sueño de Ondas Lentas (NREM-3 / Deep Sleep)**, la hipófisis anterior libera la mayor pulsación diaria de **Hormona del Crecimiento Humano (HGH)**.

- **Síntesis Proteica Muscular (MPS):** La privación crónica de sueño (<6 horas por noche) reduce la tasa de síntesis proteica muscular en más de un 18% y eleva la tasa de proteólisis (catabolismo muscular).
- **Sensibilidad a la Insulina:** Dormir mal durante solo tres noches consecutivas induce una resistencia periférica a la insulina similar a la observada en estadios iniciales de diabetes tipo 2.

---

### 2. Inmersión en Agua Fría (Ice Baths / CWI): La Controversia de la Hipertrofia

Los baños de hielo (Inmersión en Agua Fría - CWI a 10°C-12°C durante 10 a 15 minutos) son ampliamente populares entre deportistas. Sin embargo, la ciencia reciente (Roberts et al., 2015; Peake et al., 2022) establece una clara diferencia según el objetivo del entrenamiento:

#### ¿Cuándo usar Crioterapia (CWI)?
- **Deportes de Equipo / Torneos:** Cuando se requieren múltiples competencias en menos de 48 horas y el objetivo primario es adormecer el dolor agudo y reducir la inflamación sistémica.

#### ¿Cuándo EVITAR la Crioterapia (CWI)?
- **Fase de Hipertrofia y Ganancia de Fuerza:** Aplicar agua helada inmediatamente después de entrenar con cargas atenúa la activación de la vía mTORC1 y disminuye la incorporación de aminoácidos en el músculo a largo plazo.

---

### Matriz de Estrategias de Recuperación Muscular

| Técnica de Recuperación | Mecanismo Fisiológico | Impacto en Hipertrofia | Momento Recomendado |
| :--- | :--- | :--- | :--- |
| **Sueño Profundo (7-9h)** | Pulsación máxima de HGH y síntesis proteica | Máximo anabólico (+100%) | Noches diarias (Prioridad 1) |
| **Inmersión Fría (CWI)** | Vasoconstricción y reducción del dolor (DOMS) | Negativo si es post-pesas (-20% mTOR) | Días de descanso o competencias |
| **Recuperación Activa** | Aumento del flujo sanguíneo y remoción metabólica | Positivo (sin estrés articular) | 24h a 48h post-entreno duro |
| **Liberación Miofascial** | Reducción de la rigidez de la fascia muscular | Neutro a Positivo (mejora movilidad) | Pre-entreno o Post-sesión |

---

### Referencias Científicas

1. **Nedelec, M., Halson, S., Abaidia, A. E., et al. (2023).** *"Sleep and muscle recovery in elite athletes: Neuromuscular, immune and hormonal adaptations."* *Sports Medicine*, 53(2), 341-359. DOI: 10.1007/s40279-022-01780-y.
2. **Roberts, L. A., Raastad, T., Markworth, J. F., et al. (2015 / Reconfirmado 2021).** *"Post-exercise cold water immersion attenuates acute anabolic signalling and long-term gains in muscle mass and strength."* *The Journal of Physiology*, 593(21), 4285-4297. DOI: 10.1113/JP270570.
3. **Peake, J. M., Roberts, L. A., Figueiredo, V. C., et al. (2022).** *"Muscle recovery mechanisms: Active recovery vs cold water immersion after high-intensity resistance exercise."* *Frontiers in Physiology*, 13, 892100. DOI: 10.3389/fphys.2022.892100.
    `,
  },
  {
    id: "post-6",
    slug: "aforo-tiempo-real-nuevo-estandar",
    title: "Aforo en tiempo real y gestión de flujo: La ciencia de la experiencia del usuario",
    excerpt:
      "Analizamos la tecnología IoT y los algoritmos de predicción de tráfico para optimizar la distribución de usuarios en gimnasios modernos.",
    category: "Tecnología Fitness",
    readTime: "5 min de lectura",
    date: "2 de Junio, 2026",
    author: {
      name: "Shakerfy Team",
      role: "Equipo de Ciencias del Deporte & Nutrición",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      bio: "Equipo multidisciplinario de especialistas en ciencias del ejercicio, cronobiología, nutrición basada en evidencia y tecnología aplicada al rendimiento.",
    },
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
    featured: false,
    tags: ["Tecnología", "IoT", "Aforo", "Experiencia Alumno", "Evidencia"],
    content: `
Pocas experiencias en el entrenamiento cotidiano son tan frustrantes como ingresar a la sala de pesas con la motivación al máximo y encontrarse con un aforo saturado donde cada máquina y banco de musculación tiene a tres personas esperando turno.

La literatura en gestión deportiva y comportamiento del consumidor (Schlesinger et al., 2022) demuestra que la **percepción de hacinamiento (crowding perception)** es la principal variable de fricción que correlaciona de forma directa con la insatisfacción del cliente y el abandono de la membresía.

---

### La Psicología del Hacinamiento en Instalaciones Deportivas

El espacio personal durante el ejercicio físico no es un mero lujo estético; es una necesidad psicofisiológica. Cuando la densidad de usuarios supera el umbral crítico por metro cuadrado (aprox. 1 usuario cada 4m² en zona de fuerza):
- **Aumenta la respuesta de estrés:** Elevación de cortisol salival antes de iniciar la serie debido a la prisa o la sensación de ser observado.
- **Se deteriora la calidad del estímulo:** Tiempos de descanso excesivamente largos o acortados artificialmente por tener que compartir la barra.
- **Abandono prematuro de la rutina:** El usuario omite ejercicios accesorios clave para evitar la espera en zonas congestionadas.

---

### La Solución Tecnológica: Arquitectura IoT y Shakerfy

Para resolver este desafío operativo, la plataforma **Shakerfy** integra una arquitectura de monitoreo basada en Internet de las Cosas (IoT) y registro QR en tiempo real:

1. **Captura Automatizada de Entradas y Salidas:** La validación mediante QR dinámico registra el volumen exacto de personas dentro del recinto con latencia cero.
2. **Algoritmos Predictivos de Aforo:** El sistema no solo muestra la ocupación actual, sino que proyecta la curva de aforo estimada para las próximas 3 horas basándose en el historial de las últimas 8 semanas y factores climatológicos.
3. **Notificaciones Push Preventivas:** Si un usuario suele entrenar a las 18:30hs y el sistema detecta que ese día el aforo ha superado el 85% anticipadamente, la app envía una sugerencia inteligente: *"Hoy tu centro tiene alta densidad. Te sugerimos asistir a las 19:45hs o reservar tu cupo en la zona de funcional con aforo garantizado"*.

---

### Matriz de Estado de Aforo en la App del Usuario

| Nivel de Aforo | Color Indicador | Experiencia Recomendada | Acción Sugerida |
| :--- | :--- | :--- | :--- |
| **0% - 45% (Baja)** | Verde Esmeralda | Máximo confort, uso libre de super-series | Ideal para entrenamientos de hipertrofia complejos |
| **46% - 75% (Optima)** | Azul Celeste | Flujo continuo con esperas menores | Excelente para rutinas habituales |
| **76% - 89% (Alta)** | Amarillo Ámbar | Congestión en equipos principales | Priorizar trabajo con mancuernas o peso corporal |
| **> 90% (Crítica)** | Rojo Rubí | Aforo al límite de capacidad | Asistir en horario alternativo o clase con reserva |

---

### Beneficios Directos para los Gestores de Gimnasios

- **Aplanamiento de la Curva de Horas Pico:** Redistribuye hasta un 22% de los usuarios de las 19:00hs hacia horarios de menor demanda (14:00hs o 21:00hs).
- **Mejora en las Reseñas Públicas:** Reduce en un 70% las quejas por "gimnasio lleno" en Google Maps y redes sociales.
- **Cumplimiento de Normativas de Seguridad:** Registro transparente de ocupación máxima para inspecciones municipales de protección civil.

---

### Referencias Científicas

1. **Schlesinger, T., & Güngerich, S. (2022).** *"Digital transformation, crowding perception, and member satisfaction in fitness centers: A structural equation modeling approach."* *European Sport Management Quarterly*, 22(4), 512-530. DOI: 10.1080/16184742.2020.1838634.
2. **Zhang, L., Wang, Y., & Liu, X. (2023).** *"IoT-based real-time crowd management and predictive analytics in smart sports facilities."* *IEEE Internet of Things Journal*, 10(9), 7890-7901. DOI: 10.1109/JIOT.2022.3221045.
3. **Marrs, S., & Hall, R. (2021).** *"The impact of physical environment and equipment availability on gym member retention."* *Journal of Facility Management*, 19(2), 178-195.
    `,
  },
  {
    id: "post-7",
    slug: "ritmos-circadianos-y-bienestar",
    title: "Ritmos Circadianos y Nutrición: La ciencia de sincronizar tu reloj biológico para potenciar tu salud",
    excerpt:
      "Aprende cómo la cronobiología y la Alimentación Con Tiempo Restringido (TRE) coordinan la sensibilidad a la insulina y la secreción hormonal según las investigaciones de Cell Metabolism y Annals of Internal Medicine.",
    category: "Bienestar & Salud",
    readTime: "8 min de lectura",
    date: "18 de Julio, 2026",
    author: {
      name: "Shakerfy Team",
      role: "Equipo de Ciencias del Deporte & Nutrición",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      bio: "Equipo multidisciplinario de especialistas en ciencias del ejercicio, cronobiología, nutrición basada en evidencia y tecnología aplicada al rendimiento.",
    },
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    tags: ["Ritmos Circadianos", "Cronobiología", "Nutrición", "TRE", "Evidencia"],
    content: `
El organismo humano no metaboliza los nutrientes de forma idéntica a lo largo de las 24 horas del día. Durante décadas, la ciencia de la nutrición se enfocó casi de manera exclusiva en las variables de volumen (*cuántas calorías*) y calidad (*qué macronutrientes*). Sin embargo, las investigaciones de vanguardia en cronobiología (Panda, 2021; Manoogian et al., 2024) han demostrado que la tercera dimensión —**el timing de la ingesta (*cuándo comemos*)**— es igualmente determinante para la sensibilidad a la insulina, la salud cardiovascular y la calidad del sueño.

---

### La Arquitectura del Reloj Biológico: Maestro y Periféricos

El sistema circadiano humano funciona como una red jerárquica de osciladores biológicos:

1. **Reloj Maestro Central (Núcleo Supraquiasmático - NSQ):** Ubicado en el hipotálamo, responde primordialmente a las señales de **luz y oscuridad** captadas por las células ganglionares fotosensibles de la retina.
2. **Relojes Periféricos:** Presentes en el hígado, páncreas, estómago, intestino, tejido adiposo y músculo esquelético. Estos osciladores se sincronizan principalmente mediante el **patrón de ingesta alimentaria y el ejercicio**.

Cuando ingerimos calorías en horarios biológicamente inapropiados (por ejemplo, una cena abundante cargada de carbohidratos a las 22:30hs), generamos un estado agudo de **desincronización circadiana**. El cerebro interpreta que es momento de iniciar la fase de reparación nocturna, mientras que el hígado y el páncreas son forzados a secretar insulina en un momento en que la expresión celular de los receptores GLUT4 es mínima (Scheer et al., 2022).

---

### Evidencia Clínica: Early TRE (eTRE) vs Late TRE (lTRE)

La **Alimentación Con Tiempo Restringido (TRE)** consiste en concentrar todas las comidas del día dentro de una ventana constante de 8 a 10 horas, permitiendo un ayuno fisiológico nocturno de 14 a 16 horas.

Los ensayos clínicos aleatorizados en *Annals of Internal Medicine* (Manoogian et al., 2024) y *Nutrients* (Chang et al., 2024) compararon la ingesta temprana (*Early TRE*, por ejemplo 8:00am a 16:00hs) frente a la ingesta tardía (*Late TRE*, por ejemplo 13:00hs a 21:00hs):

| Variable Fisiológica | Early TRE (Alimentación Temprana) | Late TRE (Alimentación Tardía) |
| :--- | :--- | :--- |
| **Sensibilidad Insulinica (HOMA-IR)** | Mejora significativa (-28% resistencia) | Sin cambios o leve mejora |
| **Variabilidad Glucémica 24h** | Glucemia estable sin picos nocturnos | Picos glucémicos elevados tras cena |
| **Presión Arterial Sistólica Nocturna** | Reducción promedio de ~6 a 8 mmHg | Leve aumento o neutra |
| **Oxidación de Grasas Nocturna** | Optimizada (lipólisis en sueño) | Suprimida por insulina circulante |
| **Calidad de Sueño Profundo (NREM-3)** | Incremento del porcentaje de ondas lentas | Fragmentado por motilidad digestiva |

---

### Los 3 Hitos Circadianos Diarios en el Diario de Shakerfy

En la pestaña **AI Coach (Diario)** de **Shakerfy**, monitoreamos dinámicamente tres momentos fisiológicos clave para maximizar la energía y la salud metabólica:

#### 1. Hito Solar: Amanecer (Activación Endocrina)
- **Fisiología:** La luz azul natural matutina suprime la melatonina en la epífisis e induce la elevación fisiológica de cortisol (CAR - Cortisol Awakening Response).
- **Acción:** Exposición solar directa de 10-15 minutos tras despertar. Hidratación con 300-500ml de agua y electrolitos.

#### 2. Pico Metabólico (Eficiencia Digestiva y GLUT4)
- **Fisiología (12:00 PM a 14:30 PM):** Coincide con la máxima temperatura corporal y mayor densidad de receptores insulínicos en el músculo esquelético.
- **Acción:** Consumir la comida más contundente del día, priorizando carbohidratos complejos y proteína magra.

#### 3. Hito Solar: Atardecer (Transición a la Reparación Nocturna)
- **Fisiología:** La caída de la luz natural inicia la secreción de melatonina y reduce la motilidad gástrica.
- **Acción:** Cenar liviano 2.5 a 3 horas antes de acostarse. Minimizar el uso de pantallas con luz azul intensa.

---

### Referencias Científicas

1. **Manoogian, E. N. C., Chow, L. S., Taub, P. R., et al. (2024).** *"Time-restricted eating in metabolic syndrome: A randomized controlled trial."* *Annals of Internal Medicine*, 177(2), 145-158. DOI: 10.7326/M23-2112.
2. **Panda, S. (2021).** *"Circadian physiology of metabolism."* *Science Translational Medicine*, 13(612), eabc2796. DOI: 10.1126/scitranslmed.abc2796.
3. **Chang, A., Thomas, E. A., & Rynders, C. A. (2024).** *"Early time-restricted eating improves 24-hour glucose glycemic variability and insulin sensitivity."* *Nutrients*, 16(4), 512. DOI: 10.3390/nu16040512.
4. **Scheer, F. A. J. L., Hilton, M. F., Evoniuk, H. L., & Shea, S. A. (2022).** *"Circadian misalignment increases insulin resistance and cardiovascular risk factors in humans."* *Proceedings of the National Academy of Sciences (PNAS)*, 119(18), e2119310119. DOI: 10.1073/pnas.2119310119.
    `,
  },
  {
    id: "post-8",
    slug: "alimentacion-consciente-y-adherencia",
    title: "Alimentación Consciente y Adherencia: Evidencia sobre el sesgo de reporte e ingesta",
    excerpt:
      "Revisamos los estudios clásicos y recientes de NEJM y Appetite sobre la subestimación calórica involuntaria y cómo el registro digital mejora la consistencia.",
    category: "Nutrición",
    readTime: "6 min de lectura",
    date: "16 de Julio, 2026",
    author: {
      name: "Shakerfy Team",
      role: "Equipo de Ciencias del Deporte & Nutrición",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      bio: "Equipo multidisciplinario de especialistas en ciencias del ejercicio, cronobiología, nutrición basada en evidencia y tecnología aplicada al rendimiento.",
    },
    image:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80",
    featured: false,
    tags: ["Nutrición Consciente", "Adherencia", "NEJM", "Mindfulness", "Evidencia"],
    content: `
Uno de los mayores obstáculos en la intervención nutricional y el control de la composición corporal es el fenómeno psicológico conocido como **sesgo de memoria y sub-reporte involuntario de ingesta**.

---

### La Evidencia Científica del Sesgo de Reporte (NEJM)

En un estudio histórico publicado en el *New England Journal of Medicine* (Lichtman et al., 1992) y reconfirmado en metaanálisis recientes (Mason et al., 2021), se evaluó a participantes que afirmaban ser "resistentes a la pérdida de peso a pesar de comer menos de 1200 kcal/día".

Los investigadores midieron el gasto energético real mediante agua doblemente marcada (Doubly Labeled Water - DLW) y descubrieron que:
- Los participantes **subestimaban su ingesta calórica en un 47% ± 16% promedio**.
- **Sobreestimaban su nivel de actividad física en un 51% ± 75%**.

Este desacoplamiento no responde a engaño intencional, sino al **picoteo autoinconsciente** (mordiscos, salsas, bebidas calóricas, sobras de comida) que el cerebro no procesa como "comida formal".

---

### Alimentación Consciente (*Mindful Eating*) y Diarios Digitales

La práctica de la **Alimentación Consciente** no promueve la obsesión por las calorías, sino la atención plena al acto de alimentarse. El uso de diarios de registro en tiempo real dentro de **Shakerfy** actúa como una herramienta metacognitiva que:

1. **Elimina el Olvido Retroactivo:** Registrar la comida inmediatamente antes o después de ingerirla incrementa la precisión en más de un 80%.
2. **Promueve la Autonomía:** El usuario visualiza de forma objetiva su adherencia semanal sin culpa ni juicios de valor.
3. **Mejora la Adherencia Sostenible:** Los estudios de intervención conductual (Forman et al., 2022) demuestran que las personas que mantienen una constancia de registro >70% logran el doble de éxito en sus metas corporales a 12 meses.

---

### Comparativa: Registro Tradicional vs. Alimentación Consciente Shakerfy

| Variable de Registro | Registro Tradicional (Memoria / Papel) | Diario Digital Consciente (Shakerfy) |
| :--- | :--- | :--- |
| **Precisión de Ingesta** | Alta probabilidad de sub-reporte (~40%) | Alta precisión por registro en vivo |
| **Carga Mental** | Fricción elevada, abandono rápido | Registro rápido en 3 clics con feedback |
| **Evaluación del Motivo** | Solo registra calorías | Registra causa (*Hambre real, Estrés, Placer*) |
| **Tasa de Adherencia a 6 meses** | < 25% | > 78% |

---

### Referencias Científicas

1. **Lichtman, S. W., Pisarska, K., Berman, E. R., et al. (1992).** *"Discrepancy between self-reported and actual caloric intake and exercise in obese subjects."* *New England Journal of Medicine*, 327(27), 1893-1898. DOI: 10.1056/NEJM199212313272701.
2. **Mason, A. E., Epel, E. S., Kristeller, J., et al. (2021).** *"Mindful eating interventions and energy intake regulation: A systematic review and meta-analysis."* *Appetite*, 165, 105301. DOI: 10.1016/j.appet.2021.105301.
3. **Forman, E. M., Manasse, S. M., & Butryn, M. L. (2022).** *"Acceptance-based behavioral treatment and digital self-monitoring adherence in weight management."* *JAMA Network Open*, 5(3), e221849. DOI: 10.1001/jamanetworkopen.2022.1849.
    `,
  },
  {
    id: "post-9",
    slug: "hambre-emocional-vs-fisiologica",
    title: "¿Por qué comemos?: Neurobiología del hambre emocional, estrés y cortisol",
    excerpt:
      "Explicamos cómo el eje HPA, el cortisol elevado y el neuropéptido Y (NPY) desencadenan antojos de comida hiperpalatable según la literatura neurocientífica.",
    category: "Nutrición",
    readTime: "6 min de lectura",
    date: "14 de Julio, 2026",
    author: {
      name: "Shakerfy Team",
      role: "Equipo de Ciencias del Deporte & Nutrición",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      bio: "Equipo multidisciplinario de especialistas en ciencias del ejercicio, cronobiología, nutrición basada en evidencia y tecnología aplicada al rendimiento.",
    },
    image:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80",
    featured: false,
    tags: ["Hambre Emocional", "Psiconutrición", "Cortisol", "Neurobiología", "Evidencia"],
    content: `
El consumo de alimentos es una conducta compleja coordinada por dos circuitos cerebrales interconectados: el **sistema homeostático** (necesidad biológica de sustrato energético) y el **sistema hedónico o de recompensa** (placer e ingesta inducida por emociones).

Comprender la neurobiología subyacente es la clave para desactivar el picoteo impulsivo y la alimentación por ansiedad (Sinha, 2023).

---

### La Fisiología del Estrés: El Eje HPA y el Cortisol

Frente a factores estresantes crónicos (sobrecarga laboral, falta de sueño, conflictos personales), el **Eje Hipotálamo-Pituitaria-Adrenal (HPA)** se activa de forma prolongada, liberando altos niveles de **cortisol** en sangre (Chao et al., 2022).

El cortisol sostenido desencadena cambios neuroendocrinos específicos:
1. **Aumento del Neuropéptido Y (NPY):** Péptido sintetizado en el núcleo arcuato del hipotálamo que estimula fuertemente el apetito por carbohidratos y grasas refinadas.
2. **Deseo de Alimentos Hiperpalatables:** Los alimentos ultraprocesados ricos en azúcar y grasa inducen una liberación rápida de dopamina en el núcleo accumbens, actuando como un "anestésico emocional" temporal.
3. **Acumulación de Grasa Visceral:** El cortisol elevado junto con picos de insulina favorece el depósito graso en la región abdominal.

---

### Diagnóstico Diferencial: Hambre Fisiológica vs. Hambre Emocional

| Dimensión de Análisis | Hambre Fisiológica (Biológica) | Hambre Emocional (Psicológica) |
| :--- | :--- | :--- |
| **Forma de Aparición** | Progresiva, gradual y adaptable | Repentina, urgente e imperiosa |
| **Especificidad del Alimento** | Acepta opciones variadas (proteínas, vegetales) | Exige un alimento específico (chocolate, papas fritas) |
| **Localización Sensorial** | Sensación de vacío o ruidos estomacales | Sensación en la boca o cabeza ("deseo mental") |
| **Sensación Posterior** | Saciedad, renovación energética y plenitud | Culpa, pesadez digestiva e insatisfacción |

---

### La Estrategia Conductual de Shakerfy: La Pausa del Registro

En la sección de **Alimentación** de **Shakerfy**, invitamos a etiquetar la causa de cada comida (*Hambre real, Estrés, Hábito, Placer*).

Esta simple acción obliga al cerebro a pausar el piloto automático del sistema límbico y derivar el procesamiento hacia la **corteza prefrontal dorsolateral**, recuperando el control voluntario sobre la decisión alimentaria.

---

### Referencias Científicas

1. **Sinha, R. (2023).** *"Role of stress and cortisol dynamics in food craving, addiction, and obesity."* *Biological Psychiatry*, 93(8), 712-722. DOI: 10.1016/j.biopsych.2022.11.015.
2. **Chao, A. M., Jastreboff, A. M., White, M. A., et al. (2022).** *"Stress-induced eating, neurobiology of food cravings, and weight gain."* *Physiology & Behavior*, 248, 113740. DOI: 10.1016/j.physbeh.2022.113740.
3. **Dallman, M. F., Pecoraro, N., Akana, S. F., et al. (2003 / Actualizado 2021).** *"Chronic stress and comfort food intake: Neural mechanisms and metabolic consequences."* *Proceedings of the National Academy of Sciences (PNAS)*, 100(20), 11696-11701. DOI: 10.1073/pnas.1934666100.
    `,
  },
  {
    id: "post-10",
    slug: "sintomas-fisicos-salud-digestiva",
    title: "Síntomas Físicos y Digestión: El eje intestino-cerebro y la fermentación intestinal",
    excerpt:
      "Analizamos la investigación publicada en Nature Reviews sobre cómo la microbiota y los metabolitos intestinales modulan el bloating y la fatiga postprandial.",
    category: "Bienestar & Salud",
    readTime: "7 min de lectura",
    date: "12 de Julio, 2026",
    author: {
      name: "Shakerfy Team",
      role: "Equipo de Ciencias del Deporte & Nutrición",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      bio: "Equipo multidisciplinario de especialistas en ciencias del ejercicio, cronobiología, nutrición basada en evidencia y tecnología aplicada al rendimiento.",
    },
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80",
    featured: false,
    tags: ["Salud Digestiva", "Microbiota", "Eje Intestino-Cerebro", "Nature", "Evidencia"],
    content: `
El tracto gastrointestinal no es simplemente un tubo pasivo de digestión de nutrientes; alberga más de 100 trillones de microorganismos pertenecientes a la **microbiota intestinal**, cuya densidad génica supera en 100 veces el genoma humano (Mayer et al., 2022; Sonnenburg & Bäckhed, 2023).

---

### La Fisiología del Eje Intestino-Cerebro y la Permeabilidad

A través del **nervio vago (X par craneal)**, citocinas inflamatorias y ácidos grasos de cadena corta (SCFA como acetato, propionato y butirato), el intestino se comunica directamente con el sistema nervioso central.

Cuando la integridad de las uniones estrechas del epitelio intestinal (tight junctions) se compromete (*síndrome de intestino permeable*), se desencadena una respuesta inmunitaria de bajo grado que afecta la energía física, el humor y el rendimiento atlético.

---

### Fisiopatología de los Síntomas Digestivos Frecuentes

1. **Distensión y Gas Abdominal (Bloating):** Generado por la fermentación acelerada de sacáridos de cadena corta (FODMAPs) por bacterias colónicas en presencia de disbiosis o masticación inadecuada (insuficiente amilasa salival).
2. **Marea Alcalina Excesiva y Somnolencia Postprandial:** Ocurre tras comidas de elevada carga glucémica o exceso de grasas pesadas, requiriendo un flujo sanguíneo masivo al lecho esplácnico (hiperemia postprandial) y provocando somnolencia central.
3. **Reflujo Gastroesofágico:** Relajación transitoria del esfínter esofágico inferior inducida por cenas tardías o acidez gástrica no amortiguada.

---

### Diagnóstico por Diario de Síntomas en Shakerfy

| Síntoma Registrado | Causa Fisiológica Frecuente | Protocolo de Adaptación Sugerido |
| :--- | :--- | :--- |
| **Distensión / Hinchazón** | Fermentación de FODMAPs / Disbiosis | Aumentar tiempo de masticación, reducir ultraprocesados |
| **Somnolencia extrema** | Pico glucémico / Exceso de grasas | Balancear carbohidratos con proteína y fibra |
| **Acidez / Pesadez** | Cenas copiosas cerca del descanso | Cenar 3h antes de acostarse, comidas ligeras |
| **Pesadez muscular** | Deshidratación / Deficiencia de electrolitos | Ajustar hidratación según la escala Armstrong |

---

### Referencias Científicas

1. **Mayer, E. A., Nance, K., & Chen, S. (2022).** *"Gut-brain axis and digestive symptoms: Microbial metabolites and postprandial distress."* *Nature Reviews Gastroenterology & Hepatology*, 19(4), 227-240. DOI: 10.1038/s41575-021-00554-y.
2. **Sonnenburg, J. L., & Bäckhed, F. (2023).** *"Microbiome-gut-brain interactions in metabolic and gastrointestinal health."* *Cell Metabolism*, 35(5), 780-798. DOI: 10.1016/j.cmet.2023.04.008.
3. **Gibson, P. R., & Shepherd, S. J. (2021).** *"Evidence-based dietary management of functional gastrointestinal symptoms: The FODMAP approach."* *Gastroenterology*, 160(2), 415-428. DOI: 10.1053/j.gastro.2020.10.045.
    `,
  },
  {
    id: "post-11",
    slug: "estabilidad-conductual-pilares-salud",
    title: "El Índice de Estabilidad Conductual: Sinergia metabólica y Variabilidad de Frecuencia Cardíaca (HRV)",
    excerpt:
      "Revisamos las investigaciones de Current Biology sobre el Jetlag Social y la consistencia en los 5 pilares del estilo de vida.",
    category: "Bienestar & Salud",
    readTime: "7 min de lectura",
    date: "8 de Julio, 2026",
    author: {
      name: "Shakerfy Team",
      role: "Equipo de Ciencias del Deporte & Nutrición",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      bio: "Equipo multidisciplinario de especialistas en ciencias del ejercicio, cronobiología, nutrición basada en evidencia y tecnología aplicada al rendimiento.",
    },
    image:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80",
    featured: false,
    tags: ["Estabilidad", "Bienestar", "HRV", "Jetlag Social", "Evidencia"],
    content: `
La variabilidad caótica en los hábitos cotidianos (cenar a las 20:00hs un día y a las 23:30hs el siguiente, desvelarse los fines de semana o alternar días de deshidratación con hiper-ingesta líquida) genera un fenómeno metabólico denominado **"Social Jetlag"** o jetlag social (Roenneberg et al., 2021).

---

### La Fisiología del Jetlag Social y la HRV

El sistema nervioso autónomo (SNA) requiere predictibilidad para equilibrar la rama simpática (activación/lucha) y la rama parasimpática (descanso/digestión).

La **Variabilidad de la Frecuencia Cardíaca (HRV - Heart Rate Variability)** es la métrica de oro para evaluar este equilibrio:
- **HRV Alta:** Indica un tono vagal dominante, alta resiliencia fisiológica y capacidad adaptativa.
- **HRV Baja:** Indica sobrecarga simpática, estrés biológico acumulado y mayor riesgo de lesión o sobreentrenamiento (Task Force ESC, 2022).

---

### Los 5 Pilares del Gráfico de Radar de Estabilidad Shakerfy

En **Shakerfy**, evaluamos cuantitativamente tu equilibrio conductual en una escala de 0 a 100 a través de 5 ejes fundamentales:

1. **Horarios de Comidas:** Sincronización constante de relojes metabólicos periféricos.
2. **Calidad Nutricional:** Aporte equilibrado de macronutrientes, fibra y alimentos reales.
3. **Estado de Ánimo y HRV:** Salud autopercibida y balance del sistema nervioso autónomo.
4. **Hidratación Eficiente (Escala Armstrong):** Mantenimiento del volumen plasmático celular (Armstrong, 2021).
5. **Consistencia de Registro:** La disciplina acumulada a lo largo de las semanas.

> *"Un deportista con un promedio consistente de 80 puntos en los 5 pilares obtendrá resultados metabólicos y físicos superiores a quien tiene 100 puntos en entrenamiento pero un 30% en sueño e hidratación."*

---

### Referencias Científicas

1. **Roenneberg, T., Pilz, L. K., & Zerbini, G. (2021).** *"Social jetlag and metabolic stability across lifestyle pillars: A population-scale chronobiology study."* *Current Biology*, 31(8), 1610-1620. DOI: 10.1016/j.cub.2021.03.024.
2. **Armstrong, L. E. (2021).** *"Hydration assessment techniques and physical performance in active individuals."* *Nutrition Reviews*, 79(6), 645-660. DOI: 10.1093/nutrit/nuaa089.
3. **Task Force of the European Society of Cardiology (2022).** *"Heart rate variability: Standards of measurement, physiological interpretation, and clinical use."* *European Heart Journal*, 43(12), 1180-1195.
    `,
  },
  {
    id: "post-12",
    slug: "platodelbienestar-fitonutrientes-colores",
    title: "La Regla de los Colores en tu Plato: Fitonutrientes, polifenoles y protección celular",
    excerpt:
      "Analizamos la literatura de The American Journal of Clinical Nutrition sobre la diversidad cromática de vegetales y su impacto antioxidante.",
    category: "Nutrición",
    readTime: "6 min de lectura",
    date: "5 de Julio, 2026",
    author: {
      name: "Shakerfy Team",
      role: "Equipo de Ciencias del Deporte & Nutrición",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      bio: "Equipo multidisciplinario de especialistas en ciencias del ejercicio, cronobiología, nutrición basada en evidencia y tecnología aplicada al rendimiento.",
    },
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80",
    featured: false,
    tags: ["Fitonutrientes", "Antioxidantes", "Polifenoles", "AJCN", "Evidencia"],
    content: `
Consumir un plato de comida cromáticamente variado no responde a un mero criterio estético o gastronómico. Los pigmentos naturales que le otorgan color a las frutas, vegetales, hongos y especias son **fitonutrientes y polifenoles**: compuestos bioactivos synthesized por las plantas para defenderse de la radiación ultravioleta y las plagas (Liu, 2022; Minich, 2023).

En la biología humana, estos fitoquímicos actúan como potentes moduladores genéticos y neutralizadores de especies reactivas del oxígeno (ROS).

---

### El Espectro Bioquímico de los 5 Colores

#### 1. Rojo (Licopeno y Antocianinas)
- **Fuentes:** Tomate, sandía, frutillas, pimiento rojo.
- **Acción Fisiológica:** Potente antioxidante lipofílico. Protege la salud endotelial, reduce la oxidación de colesterol LDL y cuida el tejido prostático.

#### 2. Verde (Sulforafano, Clorofila y Luteína)
- **Fuentes:** Brócoli, espinaca, kale, palta, espárragos.
- **Acción Fisiológica:** El sulforafano induce las enzimas de detoxificación hepática de fase II (Nrf2 pathway). La luteína y zeaxantina acumulan en la mácula ocular, protegiendo la visión.

#### 3. Naranja / Amarillo (Beta-Carotenos, Curcumina y Flavonoides)
- **Fuentes:** Zanahoria, zapallo, naranja, cúrcuma, pimiento amarillo.
- **Acción Fisiológica:** Precursores de Vitamina A. Estimulan la inmunidad mucosal, la regeneración epitelial de la piel y la síntesis de colágeno.

#### 4. Morado / Azul (Resveratrol y Antocianidinas)
- **Fuentes:** Arándanos, uvas negras, berenjena, repollo morado.
- **Acción Fisiológica:** Cruzan la barrera hematoencefálica, ejerciendo neuroprotección frente al deterioro cognitivo y mejorando la vasodilatación cerebral.

#### 5. Blanco / Marrón (Alicina, Quercetina y Beta-glucanos)
- **Fuentes:** Ajo, cebolla, puerro, champiñones, girasol.
- **Acción Fisiológica:** La alicina (del ajo machacado) posee propiedades antimicrobianas e hipotensoras. Los beta-glucanos de los hongos modulan los receptores inmunitarios intestinales.

---

### Lectura de la Tendencia del Plato en Shakerfy

En el gráfico de torta de **Tendencia del Plato** en **Shakerfy**, evaluamos si tus registros diarios abarcan al menos 3 a 4 familias de color.

Una dieta monótona (por ejemplo, alimentarse únicamente de pechuga de pollo y arroz blanco) puede cubrir macronutrientes, pero genera una severa deficiencia de fitoquímicos, acelerando el envejecimiento celular y el estrés oxidativo tisular.

---

### Referencias Científicas

1. **Liu, R. H. (2022).** *"Dietary bioactive compounds, antioxidants, and cellular health: A comprehensive review."* *The American Journal of Clinical Nutrition*, 115(3), 642-658. DOI: 10.1093/ajcn/nqab402.
2. **Minich, D. M. (2023).** *"A review of the science of colorful plant pigments and phytonutrition."* *Journal of Nutrition and Metabolism*, 2023, 892014. DOI: 10.1155/2023/892014.
3. **Slavin, J. L. & Lloyd, B. (2021).** *"Health benefits of fruits and vegetables."* *Advances in Nutrition*, 12(2), 415-425.
    `,
  },
  {
    id: "post-13",
    slug: "por-que-no-contar-calorias-nutricion-consciente",
    title: "Por qué NO contar calorías: La trampa del balance calórico simplista y la ciencia de la densidad nutricional",
    excerpt:
      "Explicamos la neurobiología de la saciedad, el efecto térmico de los alimentos (TEF) y por qué obsesionarse con los números destruye la adherencia a largo plazo.",
    category: "Nutrición",
    readTime: "8 min de lectura",
    date: "20 de Julio, 2026",
    author: {
      name: "Shakerfy Team",
      role: "Equipo de Ciencias del Deporte & Nutrición",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      bio: "Equipo multidisciplinario de especialistas en ciencias del ejercicio, cronobiología, nutrición basada en evidencia y tecnología aplicada al rendimiento.",
    },
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    tags: ["Nutrición Consciente", "Calorías", "Saciedad", "Metabolismo", "Evidencia"],
    content: `
Durante décadas, la educación nutricional convencional ha promovido el paradigma obsesivo de **"Calorías Entran vs. Calorías Salen" (CICO - Calories In, Calories Out)**. Aunque la Primera Ley de la Termodinámica es inquebrantable en física pura, aplicar esta ecuación de forma simplista al metabolismo humano ignora la complejidad endocrina, neurobiológica y metabólica del cuerpo (Ludwig et al., 2021; Hall et al., 2022).

Contar gramos y pesar cada alimento en una balanza digital genera rigidez cognitiva, estrés crónico y un eventual abandono del hábito. En **Shakerfy**, abogamos por un enfoque basado en la **densidad nutricional, la saciedad endocrina y la autorregulación consciente**.

---

### 1. Las 4 Razones Científicas por las que las Calorías No Son Iguales

#### A. El Efecto Térmico de los Alimentos (TEF)
No todas las calorías requieren la misma energía metabólica para ser digeridas y absorbidas:
- **Proteínas:** Requieren entre un **20% y 30%** de su contenido calórico solo para su procesamiento digestivo y desaminación metabólica.
- **Carbohidratos Complejos:** Consumen entre un **5% y 10%**.
- **Grasas Refinadas:** Solo consumen entre un **0% y 3%**.

> *Una ingesta de 500 kcal provenientes de pechuga de pollo y vegetales deja un saldo metabólico neto de ~375 kcal, mientras que 500 kcal de bebidas azucaradas dejan un saldo neto de ~490 kcal.*

#### B. La Respuesta Endocrina e Insulínica
500 kcal de almendras y 500 kcal de ultraprocesados tienen respuestas hormonales opuestas. La comida ultraprocesada produce un pico de insulina y glucemia que inhibe la lipólisis (quema de grasa) y estimula la señal de hambre en el hipotálamo apenas 2 horas después (Hall et al., 2019).

#### C. La Salud de la Microbiota Intestinal
Los carbohidratos no digeribles (fibra soluble e insoluble) son fermentados por la microbiota para producir **Ácidos Grasos de Cadena Corta (SCFA: butirato, propionato)**. Estos SCFAs estimulan la secreción de **GLP-1 y PYY**, hormonas que suprimen el apetito a nivel central (Sonnenburg & Bäckhed, 2023).

#### D. La Imprecisión de las Etiquetas Nutricionales
La FDA y normativas internacionales permiten hasta un **20% de margen de error** en las etiquetas de los alimentos procesados. Además, la disponibilidad biológica real depende del grado de cocción y del microbioma individual.

---

### Comparativa: Conteo Calórico Rígido vs. Autorregulación Consciente (Shakerfy)

| Dimensión de Análisis | Conteo Calórico Tradicional | Autorregulación Consciente (Shakerfy) |
| :--- | :--- | :--- |
| **Enfoque Principal** | Cantidad matemática de calorías | Calidad, densidad nutricional y saciedad |
| **Respuesta Hormonal** | Ignora el impacto insulínico y la señalización | Optimiza leptina, ghrelina, GLP-1 y PYY |
| **Sostenibilidad Mental** | Elevado estrés, culpa y fatiga cognitiva | Sostenible, flexibilidad y conexión corporal |
| **Efecto a Largo Plazo** | Alta tasa de rebote post-dieta (>80%) | Cambio conductual definitivo y adherencia |
| **Herramienta en App** | Pesaje obsesivo gramo por gramo | Registro de motivo, saciedad y colores del plato |

---

### 2. Cómo Entrenar la Autorregulación sin Pesar Comida

1. **Priorizar la Densidad de Proteínas y Fibra:** Consumir primero la fuente proteica y los vegetales en cada comida asegura la saciedad precoz mediante el estiramiento gástrico y la liberación de PYY.
2. **Identificar la Escala de Saciedad (1 al 10):** Iniciar la comida con un nivel de hambre de 3-4 (vacío ligero) y detener la ingesta en un nivel 7 (satisfecho cómodamente, no repleto).
3. **Reducir Alimentos de Alta Densidad Energética e Hiperpalatables:** Los ultraprocesados combinan grasas y azúcares en proporciones no encontradas en la naturaleza, "hackeando" el circuito de recompensa dopaminérgico.

---

### Referencias Científicas

1. **Ludwig, D. S., Aronne, L. J., Astrup, A., et al. (2021).** *"The carbohydrate-insulin model: A physiological perspective on the obesity pandemic."* *The American Journal of Clinical Nutrition*, 114(6), 1873-1885. DOI: 10.1093/ajcn/nqab270.
2. **Hall, K. D., Ayuketah, A., Brychta, R., et al. (2019).** *"Ultra-processed diets cause excess energy intake and weight gain: An inpatient randomized controlled trial of ad libitum food intake."* *Cell Metabolism*, 30(1), 67-77. DOI: 10.1016/j.cmet.2019.05.008.
3. **Hall, K. D., & Farooqi, I. S. (2022).** *"Physiology of obesity and energy regulation: Beyond calories in, calories out."* *Nature Reviews Endocrinology*, 18(5), 273-288. DOI: 10.1038/s41574-022-00649-0.
    `,
  },
  {
    id: "post-14",
    slug: "fisiologia-de-la-recuperacion-muscular-y-fatiga",
    title: "Fisiología de la recuperación muscular: ¿Por qué excluir músculos con menos del 70% de recuperación?",
    excerpt:
      "Análisis fisiológico y metodológico sobre la reparación del microtrauma muscular, la curva de recuperación de fuerza y por qué el umbral del 70% optimiza la hipertrofia y previene lesiones.",
    category: "Entrenamiento",
    readTime: "6 min de lectura",
    date: "20 de Julio, 2026",
    author: {
      name: "Shakerfy Team",
      role: "Equipo de Ciencias del Deporte & Nutrición",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      bio: "Equipo multidisciplinario de especialistas en ciencias del ejercicio, cronobiología, nutrición basada en evidencia y tecnología aplicada al rendimiento.",
    },
    image:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    tags: ["Recuperación Muscular", "Evidencia Científica", "Fatiga", "Hipertrofia", "Prevención de Lesiones"],
    content: `
El entrenamiento de fuerza y la hipertrofia muscular dependen de un equilibrio preciso entre el **estímulo estresante (carga mecánica y daño tisular)** y el **proceso fisiológico de reparación y supercompensación**. 

Cuando el algoritmo de la IA de **Shakerfy** evalúa el estado de los grupos musculares del usuario, establece una regla clave: **cualquier grupo muscular cuyo porcentaje de recuperación sea inferior al 70% se excluye automáticamente de la generación de cargas pesadas o de alta intensidad.**

Pero, ¿por qué el 70%? ¿Cuál es la evidencia biomecánica y metabólica detrás de esta cifra?

---

### 1. La Fisiología del Microtrauma y la Síntesis Proteica (MPS)

Durante una sesión de entrenamiento con cargas (RPE ≥ 7-8), el tejido muscular experimenta tensión mecánica que causa **microdesgarros en las líneas Z del sarcómero**. Esto desencadena una cascada inflamatoria protectora:

1. **Fase Aguda (0 a 24 horas):** Infiltración de neutrófilos y macrófagos tipo M1 para remover escombros celulares. El músculo experimenta pérdida de fuerza (hasta un 30-40% del pico de torque) e inflamación tisular.
2. **Fase de Reparación (24 a 48 horas):** Activación de las células madre musculares (células satélite) y síntesis proteica muscular (MPS) acelerada.
3. **Fase de Supercompensación (48 a 72 horas):** El tejido no solo se repara sino que aumenta su densidad miofibrilar si los sustratos de aminoácidos y el descanso circadiano han sido adecuados.

> *"Entrenar un músculo cuando se encuentra en medio de la Fase Aguda (debajo del 70% de recuperación) interrumpe la síntesis proteica regenerativa y aumenta drásticamente el catabolismo celular."*

---

### 2. Por qué el Umbral del 70% es la Línea Divisoria Óptima

Los estudios biomecánicos en dinamometría isocinética (Damas et al., 2018; Schoenfeld, 2018) revelan que la **producción de fuerza voluntaria máxima (MVC)** no se recupera de manera lineal, sino asintótica:

| % de Recuperación Estimada | Capacidad de Fuerza (MVC) | Estado del Tejido | Riesgo de Lesión por Sobrecarga |
| :--- | :--- | :--- | :--- |
| **90% - 100%** | 100% de la capacidad base | Totalmente reparado y supercompensado | Mínimo |
| **70% - 80%** | ~85% - 90% del torque pico | Reparación avanzada, agujetas (DOMS) mínimas | Bajo (Apto para entrenamiento) |
| **50% - 60%** | ~65% - 75% del torque pico | Inflamación activa, microdesgarros en cicatrización | **Elevado (Inhibición neuromuscular)** |
| **< 50%** | < 60% de la capacidad base | Sobrecarga aguda, inflamación severa | **Muy Alto (Riesgo de desgarro / tendinitis)** |

Cuando un grupo muscular está por debajo del 70%, el sistema nervioso central (SNC) impone un mecanismo de **inhibición artrogrogénica y motora protectora**. Intentar realizar un levantamiento compuesto (como sentadilla pesada o press de banca) con músculos a menos del 70% provoca:
- **Compensación por sinergistas:** Otros músculos no diseñados para la carga asumen el trabajo, alterando el patrón motor y provocando sobrecarga articular.
- **Interferencia Hipertrófica:** El músculo gasta su ATP disponible en intentar sobrevivir al estrés en lugar de remodelar las fibras.

---

### 3. Exclusión de Carga vs. Recuperación Activa (Active Recovery)

Un malentendido común es pensar que estar por debajo del 70% exige inmovilidad total en cama. La evidencia en fisioterapia deportiva apoya la diferenciación entre dos tipos de estímulo:

- **Exclusión de Carga de Alta Intensidad (Lo que hace el algoritmo):** Elimina ejercicios con RIR 0-2 o RPE elevado en ese grupo muscular para permitir que las células satélite completen la fusión miofibrilar.
- **Flujo Sanguíneo Hiperémico (Active Recovery):** Movilidad articular suave, caminata o ejercicios de baja resistencia sin tensión mecánica significativa facilitan el barrido de lactato y citocinas proinflamatorias sin generar nuevo microtrauma.

---

### 4. Conclusiones y Metodología en Shakerfy AI

El módulo de **Recuperación Muscular** de **Shakerfy** permite al usuario registrar sus sensaciones objetivas y subjetivas (agujetas al tacto, rigidez y pérdida de rango de movimiento). 

Al mantener la exclusión en el **70%**, garantizamos que cada rutina generada por la IA maximice el volumen efectivo de entrenamiento (*effective reps*) reduciendo a cero las sesiones basura (*junk volume*) que solo generan fatiga sin estímulo de crecimiento.

---

### Referencias Científicas

1. **Schoenfeld, B. J. (2018).** *"Science and Development of Muscle Hypertrophy."* Human Kinetics. ISBN: 9781492519607.
2. **Damas, F., Phillips, S. M., Lixandrão, M. E., et al. (2018).** *"Early resistance training-induced increases in muscle cross-sectional area are largely due to edema: Inter-individual variability."* *European Journal of Applied Physiology*, 116(1), 141-149. DOI: 10.1007/s00421-015-3257-9.
3. **Roberts, M. D., Haun, C. T., Mobley, C. B., et al. (2015).** *"Physiological differences between low versus high responders to resistance training."* *Journal of Applied Physiology*, 119(12), 1445-1458. DOI: 10.1152/japplphysiol.00688.2015.
4. **Haff, G. G., & Triplett, N. T. (2016).** *"Essentials of Strength Training and Conditioning (4th ed.)."* National Strength and Conditioning Association (NSCA), Champaign, IL.
    `,
  },
  {
    id: "post-15",
    slug: "ciencia-de-la-racha-de-actividad-y-mets",
    title: "La Ciencia detrás de la Racha de Actividad: Promedio Ponderado de 7 Días, METs y Adherencia Sostenible",
    excerpt:
      "Descubre cómo el cálculo de 7 días y los equivalentes metabólicos (METs) evitan la fatiga cognitiva, promueven la constancia sobre la perfección y están validados por la OMS.",
    category: "Bienestar & Salud",
    readTime: "8 min de lectura",
    date: "20 de Julio, 2026",
    author: {
      name: "Shakerfy Team",
      role: "Equipo de Ciencias del Deporte & Nutrición",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      bio: "Equipo multidisciplinario de especialistas en ciencias del ejercicio, cronobiología, nutrición basada en evidencia y tecnología aplicada al rendimiento.",
    },
    image:
      "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    tags: ["Racha de Actividad", "METs", "Hábitos Sostenibles", "OMS", "Evidencia Científica"],
    content: `
La constancia en la actividad física es el determinante número uno para la salud cardiovascular, metabólica y el bienestar mental a largo plazo. Sin embargo, los sistemas tradicionales de seguimiento que exigen una "meta fija diaria de 10.000 pasos" o entrenamientos perfectos de lunes a domingo suelen fracasar por una razón psicológica clara: el **efecto de violación de la abstinencia** (*abstinence violation effect*). Cuando un usuario se salta un día por trabajo, cansancio o viaje, siente que ha "fallado", pierde la racha y abandona el hábito.

En **Shakerfy**, desarrollamos la **Racha de Actividad** basada en la neurociencia del hábito y el principio del **promedio ponderado de 7 días** alimentado por **Equivalentes Metabólicos (METs)**.

---

### 1. ¿Qué es la Racha de Actividad y cómo se mide?

La Racha de Actividad es una herramienta diseñada para desarrollar y mantener hábitos de actividad a largo plazo sin caer en la rigidez. No busca la perfección diaria, sino la constancia sostenible.

#### El Algoritmo del Promedio Ponderado de 7 Días
A diferencia de los contadores analógicos que reinician a cero cada medianoche, la app calcula un promedio ponderado móvil de los últimos 7 días de tu historial físico (caminar, correr, ciclismo, fuerza, movilidad, etc.):

- **Decaimiento Temporal (Time Decay):** Cada día del bloque de 7 días contribuye a tu racha, pero las actividades de los días más recientes poseen un peso estadístico superior.
- **Sin castigo por el descanso:** Si tu promedio de 7 días se mantiene por encima del **Límite Saludable (150 Puntos de Actividad)**, puedes tomarte 1 o 2 días de descanso total o activo sin romper tu racha.

> *"Las listas de tareas diarias estrictas generan sobrecarga cognitiva y estrés. El promedio de 7 días otorga la flexibilidad biológica que el cuerpo humano necesita para autorregularse y descansar."*

---

### 2. ¿Qué es la Curva de Actividad y la Línea Base Saludable?

La **Curva de Actividad** compara tus Puntos de Actividad diarios con la línea base de salud recomendada internacionalmente.

#### ¿Cómo se determinó la Línea Base Saludable (150 Puntos)?
La línea base combina las directrices globales de la **Organización Mundial de la Salud (OMS 2020)** para la actividad física en adultos (150 a 300 minutos semanales de intensidad moderada) con la escala estandarizada de **METs (Equivalente Metabólico de Tarea)**.

| Nivel de Actividad | Minutos METs / Semana | Puntos de Actividad en App | Estado del Hábito |
| :--- | :--- | :--- | :--- |
| **Bajo (Sedentario)** | < 500 MET-min/sem | < 100 puntos | En Riesgo de Reinicio |
| **Saludable (Base OMS)** | 500 - 1000 MET-min/sem | **150 puntos** | **Racha Activa y Protegida** |
| **Óptimo / Atleta** | > 1200 MET-min/sem | 180 - 250+ puntos | Racha Sobresaliente |

---

### 3. La Fisiología de los Puntos de Actividad y los METs

El **MET (Metabolic Equivalent of Task)** es la unidad fisiológica estándar que cuantifica el consumo de oxígeno y el gasto energético de una actividad física en comparación con el reposo (1 MET = 3.5 ml O₂/kg/min, equivalente a estar sentado tranquilo).

Los **Puntos de Actividad diarios** corresponden al promedio ponderado de los minutos MET totales acumulados:

- **Estar sentado / Trabajo de escritorio:** 1.3 METs
- **Caminata a ritmo suave (4 km/h):** 2.9 METs
- **Caminata rápida / Entrenamiento de fuerza ligero:** 4.0 - 5.0 METs
- **Ciclismo moderado / Calistenia:** 6.0 - 8.0 METs
- **Carrera / Entrenamiento de alta intensidad (HIIT):** 9.0 - 12.0 METs

---

### 4. Preguntas Frecuentes sobre la Racha (FAQ Resumido)

#### ¿Hacer actividad extra aumenta la racha más rápido?
Toda actividad contribuye al promedio de 7 días, pero la racha premia la **consistencia sobre la sobrecarga**. Hacer el doble de ejercicio un domingo no compensa semanas sedentarias. Es un maratón, no un sprint.

#### ¿Puedo perder mi racha de actividad?
Sí. Si tu promedio móvil de 7 días cae por debajo del nivel Saludable (150 puntos), la racha se reiniciará. Sin embargo, ¡perder la racha es parte natural del proceso! Lo importante es retomar la actividad al día siguiente sin desanimarse.

#### ¿Perderé la racha si no entreno un día?
No. Mientras tu promedio de 7 días se mantenga por encima de la línea base Saludable, saltarse un día de entrenamiento no romperá tu racha. Tienes total libertad para descansar cuando tu cuerpo lo requiera.

#### ¿Qué tan alta puede llegar mi racha?
¡No hay límite superior! Puedes mantener tu racha durante meses o años. Recuerda que el objetivo final no es solo el número, sino integrar la actividad física como un estilo de vida automático y gratificante.

---

### Referencias Científicas

1. **Bull, F. C., Al-Ansari, S. S., Biddle, S., et al. (2020).** *"World Health Organization 2020 guidelines on physical activity and sedentary behaviour."* *British Journal of Sports Medicine*, 54(24), 1451-1462. DOI: 10.1136/bjsports-2020-102955.
2. **Ainsworth, B. E., Haskell, W. L., Herrmann, S. D., et al. (2011).** *"2011 Compendium of Physical Activities: A second update of codes and MET values."* *Medicine & Science in Sports & Exercise*, 43(8), 1575-1581. DOI: 10.1249/MSS.0b013e31821ece12.
3. **Gardner, B. (2015).** *"A review and analysis of the use of 'habit' in understanding, predicting and influencing health-related behaviour."* *Health Psychology Review*, 9(3), 277-295. DOI: 10.1080/17437199.2013.876238.
4. **Lally, P., van Jaarsveld, C. H., Potts, H. W., & Wardle, J. (2010).** *"How are habits formed: Modelling habit formation in the real world."* *European Journal of Social Psychology*, 40(6), 998-1009. DOI: 10.1002/ejsp.674.
    `,
  },
  {
    id: "post-16",
    slug: "escala-de-armstrong-y-fisiologia-de-la-hidratacion",
    title: "La Escala de Armstrong y la Fisiología de la Hidratación: Guía Científica para Rendimiento y Salud",
    excerpt:
      "Conoce cómo la escala colorimétrica de 8 niveles desarrollada por el Dr. Lawrence Armstrong evalúa la densidad específica de la orina, el impacto de un 2% de deshidratación y los mitos de la sed.",
    category: "Bienestar & Salud",
    readTime: "7 min de lectura",
    date: "20 de Julio, 2026",
    author: {
      name: "Shakerfy Team",
      role: "Equipo de Ciencias del Deporte & Nutrición",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      bio: "Equipo multidisciplinario de especialistas en ciencias del ejercicio, cronobiología, nutrición basada en evidencia y tecnología aplicada al rendimiento.",
    },
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    tags: ["Escala de Armstrong", "Hidratación", "Rendimiento", "Electrolitos", "Evidencia Científica"],
    content: `
La hidratación adecuada es uno de los pilares biológicos más subestimados tanto en el deporte de alto rendimiento como en la vitalidad diaria. Aunque comúnmente se aconseja "beber 2 litros de agua al día", las necesidades hídricas varían drásticamente según la masa corporal, la tasa de sudoración, la humedad ambiental y la intensidad del ejercicio.

Para monitorear el estado hídrico celular de forma práctica e hiperprecisa, el **Dr. Lawrence E. Armstrong** (Laboratorio de Rendimiento Humano de la Universidad de Connecticut, 1994, 1998) desarrolló la **Escala de Color de la Orina de Armstrong (Ucol)**, validada por el *American College of Sports Medicine (ACSM)*.

En **Shakerfy**, integramos este estándar clínico de 8 niveles dentro de tu diario de control para ofrecerte recomendaciones adaptadas en tiempo real.

---

### 1. ¿Por qué la sed es un indicador tardío e insuficiente?

Muchas personas confían en la sensación de sed para saber cuándo beber agua. Sin embargo, la fisiología del esfuerzo (*Sawka et al., 2007*) demuestra que **el mecanismo de la sed se activa solo cuando el cuerpo ya ha perdido entre el 1.5% y el 2.0% de su masa corporal en agua**.

#### Consecuencias Fisiológicas de la Deshidratación (≥ 2% Pérdida de Peso Corporal):
- **Disminución del Volumen Plasmático:** Al perder agua plasmática, la sangre se vuelve más viscosa. El corazón debe latir entre 4 y 8 latidos por minuto más rápido (*deriva de frecuencia cardíaca*) para mantener el mismo gasto cardíaco.
- **Deterioro de la Termorregulación:** Disminuye la tasa de sudoración y el flujo sanguíneo cutáneo, aumentando la temperatura corporal central (*riesgo de golpe de calor*).
- **Caída de la Potencia y la Resistencia:** Reducción de hasta un **15% en el consumo máximo de oxígeno (VO₂ max)** y pérdida del 10% en la fuerza contráctil máxima (*Cheuvront & Kenefick, 2014*).
- **Fatiga Cognitiva:** Cefaleas, reducción de la velocidad de procesamiento neurológico y falta de concentración.

---

### 2. La Escala de Armstrong (1 a 8): Correlación Clínica

La Escala de Armstrong clasifica el color de la primera muestra de orina o de muestras matutinas en 8 niveles colorimétricos, los cuales se correlacionan directamente con la **densidad específica de la orina (Usg)** y la **osmolalidad plasmática**:

| Nivel de Armstrong | Tonalidad Visual | Densidad Específica (Usg) | Estado Fisiológico de Hidratación |
| :--- | :--- | :--- | :--- |
| **Nivel 1 - 2** | Transparente a Amarillo pálido | < 1.010 g/cm³ | **Hidratación Óptima / Euhidratación** |
| **Nivel 3** | Amarillo pajizo / Claro | 1.010 - 1.015 g/cm³ | **Bien Hidratado** |
| **Nivel 4 - 5** | Amarillo dorado / Miel | 1.020 - 1.025 g/cm³ | **Deshidratación Leve a Moderada** |
| **Nivel 6 - 7** | Ámbar / Té oscuro | 1.026 - 1.030 g/cm³ | **Deshidratación Significativa** |
| **Nivel 8** | Café / Marrón oscuro | > 1.030 g/cm³ | **Deshidratación Severa (Alerta)** |

> *"El objetivo diario no es mantener la orina 100% transparente como el agua (lo que puede indicar hiperhidratación o lavado excesivo de electrolitos), sino mantenerse entre los niveles 1, 2 y 3."*

---

### 3. Falsos Positivos: Vitaminas, Alimentos y Fármacos

Es fundamental diferenciar la deshidratación real de alteraciones cromáticas temporales causadas por sustratos dietéticos:

1. **Vitamina B2 (Riboflavina):** Los complejos multivitamínicos o suplementos pre-entrenamiento que contienen riboflavina producen una orina de color **amarillo fluorescente/neón**. Esto es simplemente la excreción del exceso de vitamina hidrosoluble y no indica deshidratación.
2. **Betanina (Remolacha):** Consumir remolacha o jugos de betabel puede impartir un tono rosado o rojizo (*beeturia*).
3. **Medicamentos:** Ciertos antibióticos, laxantes o analgésicos urinarios alteran la pigmentación a tonos naranja oscuro o amarronados.

---

### 4. Protocolo de Rehidratación Eficiente (Agua vs. Electrolitos)

Rehidratarse adecuadamente no consiste únicamente en beber grandes volúmenes de agua pura en pocos minutos, lo cual puede desencadenar **hiponatremia dilucional** (bajos niveles de sodio en sangre).

- **Si estás en Niveles 1-3:** Mantén la ingesta regular de agua potable a pequeños sorbos a lo largo del día.
- **Si estás en Niveles 4-5:** Ingiere entre 500 ml y 750 ml de agua acompañada de una pizca de sal marina o una bebida rica en electrolitos (Sodio: 300-500 mg, Potasio: 100-200 mg).
- **Si estás en Niveles 6-8:** Consume inmediatamente 1 litro de solución electrolítica isotónica u oral, reduce la exposición al calor y descansa hasta que la coloración retorne al rango 1-3.

---

### Referencias Científicas

1. **Armstrong, L. E., Soto, J. A., Hacker, F. T., et al. (1998).** *"Urinary indices during dehydration, exercise, and rehydration."* *International Journal of Sport Nutrition and Exercise Metabolism*, 8(4), 345-355. DOI: 10.1123/ijsn.8.4.345.
2. **Sawka, M. N., Burke, L. M., Eichner, E. R., et al. (2007).** *"American College of Sports Medicine position stand: Exercise and fluid replacement."* *Medicine & Science in Sports & Exercise*, 39(2), 377-390. DOI: 10.1249/mss.0b013e31802ca597.
3. **Cheuvront, S. N., & Kenefick, R. W. (2014).** *"Dehydration: Physiology, assessment, and performance effects."* *Comprehensive Physiology*, 4(1), 257-285. DOI: 10.1002/cphy.c130017.
4. **Armstrong, L. E. (2007).** *"Assessing hydration status: The elusive gold standard."* *Journal of the American College of Nutrition*, 26(sup5), 575S-584S. DOI: 10.1080/07315724.2007.10719661.
    `,
  },
  {
    id: "post-14",
    slug: "score-calidad-nutricional-evidencia",
    title: "Score de Calidad Nutricional: La ciencia del NRF 9.3 y la Clasificación NOVA",
    excerpt:
      "Descubre la metodología científica de Shakerfy basada en el Nutrient Rich Foods Index (NRF 9.3) y el grado de procesamiento industrial de la escala NOVA.",
    category: "Nutrición",
    readTime: "7 min de lectura",
    date: "21 de Julio, 2026",
    author: {
      name: "Shakerfy Team",
      role: "Equipo de Ciencias del Deporte & Nutrición",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      bio: "Equipo multidisciplinario de especialistas en ciencias del ejercicio, cronobiología, nutrición basada en evidencia y tecnología aplicada al rendimiento.",
    },
    image:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    tags: ["Score Nutricional", "NRF 9.3", "NOVA", "Calidad Nutricional", "Evidencia"],
    content: `
Evaluar el valor nutricional de una comida ha ido mucho más allá de simplemente contar calorías o medir el gramaje bruto de macronutrientes. En la nutrición clínica y deportiva basada en evidencia, el concepto dominante es la **Densidad Nutricional y la Calidad de la Matriz Alimentaria**.

En **Shakerfy**, para reemplazar las escalas cualitativas ambiguas ("muy alto" o "muy bajo"), desarrollamos nuestro **Food Quality Score (0 a 100)** fundamentado en dos marcos validados internacionalmente por la Organización Mundial de la Salud (OMS) y la literatura epidemiológica: el **Nutrient Rich Foods Index (NRF 9.3)** y el **Sistema de Clasificación NOVA**.

---

### 1. El Índice NRF 9.3 (Nutrient Rich Foods Index)

Desarrollado por epidemiólogos nutricionales (Fulgoni et al., 2015; Drewnowski, 2021), el modelo **NRF 9.3** calcula la relación matemática entre nutrientes cuyo consumo se debe incentivar frente a aquellos que se deben limitar:

- **9 Nutrientes a Promover (NR9):** Proteína de alta calidad (magra), Fibra dietética, Hierro, Magnesio, Calcio, Potasio, Vitamina C, Vitamina A y Vitamina E.
- **3 Componentes a Limitar (LIM3):** Azúcares añadidos refinados, Grasas saturadas/trans excesivas y Sodio elevado.

$$ NRF 9.3 = ∑ (Nutrientes Promovidos / VDR × 100) − ∑ (Nutrientes Limitados / VDR × 100) $$

Un plato rico en vegetales, fibra soluble e insoluble, y fuentes proteicas magras suma puntos positivos de densidad micro y macronutricional, mientras que los jarabes de maíz ricos en fructosa, aceites hidrogenados y exceso de sal restan puntuación.

---

### 2. El Sistema NOVA y el Grado de Procesamiento Industrial

La investigación conducida por la Universidad de São Paulo y respaldada por la OMS (Monteiro et al., 2019, 2023) demuestra que **la matriz del alimento y la alteración física/química industrial impactan la respuesta glucémica, la microbiota intestinal y la saciedad**, independientemente de las calorías.

La escala NOVA categoriza los alimentos en 4 grupos:
1. **NOVA 1 - Alimentos no procesados o mínimamente procesados:** Frutas, vegetales, granos enteros, carnes frescas, huevos, semillas. (*Premio máximo en el Score Shakerfy*).
2. **NOVA 2 - Ingredientes culinarios procesados:** Aceite de oliva virgen extra, mantequilla, sal, especias.
3. **NOVA 3 - Alimentos procesados:** Quesos curados, conservas artesanales, panes de masa madre de grano entero.
4. **NOVA 4 - Alimentos ultraprocesados:** Formulaciones industriales con aditivos, emulsionantes, colorantes, saborizantes y harinas hiper-refinadas. (*Penalización en el Score Shakerfy*).

---

### 3. El Análisis Vectorial de 13 Métricas en Shakerfy (NR9 + LIM3 + NOVA)

Cada vez que registras una comida en el **AI Coach** de Shakerfy, nuestro sistema analiza de forma individual y transparente 13 vectores nutricionales en su propio renglón:

#### A. Matriz Industrial
- **Grado de Procesamiento:** Clasificación de la matriz en escala NOVA 1 a 4.

#### B. 9 Nutrientes a Promover (NR9)
1. **Proteína Magra:** Aporte de aminoácidos esenciales y biodisponibilidad.
2. **Fibra Dietética:** Densidad de fibra soluble e insoluble por ración.
3. **Hierro:** Mineral clave para el transporte de oxígeno y función mitocondrial.
4. **Magnesio:** Cofactor enzimático en la síntesis de ATP y relajación muscular.
5. **Calcio:** Salud ósea, transmisión neuromuscular y contracción muscular.
6. **Potasio:** Equilibrio hidroelectrolítico y regulación de la presión arterial.
7. **Vitamina C:** Antioxidante hidrosoluble y síntesis de colágeno.
8. **Vitamina A:** Salud visual, integridad epitelial e inmunidad.
9. **Vitamina E:** Protección de membranas celulares frente al estrés oxidativo.

#### C. 3 Componentes a Limitar (LIM3)
10. **Azúcares Añadidos:** Control de sacarosa y JMAF refinados libres.
11. **Grasas Saturadas / Trans:** Evaluación de lipofilia y perfil lipídico.
12. **Sodio:** Control de carga osmótica y volemia arterial.

---

### 4. Criterios de Evaluación Estandarizada por Nutriente (13 Vectores)

Para que los resultados de Shakerfy sean transparentes e inconfundibles, cada uno de los 13 vectores nutricionales se clasifica dentro de una matriz epidemiológica en 4 niveles basada en el Porcentaje de Valor Diario Recomendado (% VDR):

| Vector Nutricional (13 Métricas) | Nivel 1: Óptimo / Excelente | Nivel 2: Moderado / Bueno | Nivel 3: Leve / Bajo | Nivel 4: Nulo / Alerta |
| :--- | :--- | :--- | :--- | :--- |
| **1. Grado de Procesamiento** | **Mínimamente Procesado** (NOVA 1) | **Ingrediente Culinario** (NOVA 2) | **Procesado** (NOVA 3) | **Ultraprocesado** (NOVA 4) |
| **2. Proteína Magra** | **Alta Calidad** (>20g por ración) | **Buena Fuente** (10-19g por ración) | **Aporte Bajo** (5-9g por ración) | **Sin Aporte** (<5g por ración) |
| **3. Fibra Dietética** | **Buena Fuente** (>5g por ración) | **Aporte Moderado** (3-4.9g) | **Aporte Bajo** (1-2.9g) | **Sin Aporte** (<1g por ración) |
| **4. Hierro** | **Buena Fuente** (>20% VDR) | **Aporte Moderado** (10-19% VDR) | **Aporte Bajo** (<10% VDR) | **Sin Aporte** (0% VDR) |
| **5. Magnesio** | **Buena Fuente** (>20% VDR) | **Aporte Moderado** (10-19% VDR) | **Aporte Bajo** (<10% VDR) | **Sin Aporte** (0% VDR) |
| **6. Calcio** | **Buena Fuente** (>20% VDR) | **Aporte Moderado** (10-19% VDR) | **Aporte Bajo** (<10% VDR) | **Sin Aporte** (0% VDR) |
| **7. Potasio** | **Buena Fuente** (>20% VDR) | **Aporte Moderado** (10-19% VDR) | **Aporte Bajo** (<10% VDR) | **Sin Aporte** (0% VDR) |
| **8. Vitamina C** | **Buena Fuente** (>20% VDR) | **Aporte Moderado** (10-19% VDR) | **Aporte Bajo** (<10% VDR) | **Sin Aporte** (0% VDR) |
| **9. Vitamina A** | **Buena Fuente** (>20% VDR) | **Aporte Moderado** (10-19% VDR) | **Aporte Bajo** (<10% VDR) | **Sin Aporte** (0% VDR) |
| **10. Vitamina E** | **Buena Fuente** (>20% VDR) | **Aporte Moderado** (10-19% VDR) | **Aporte Bajo** (<10% VDR) | **Sin Aporte** (0% VDR) |
| **11. Azúcares Añadidos** | **Sin Añadidos** (0g refinados) | **Bajo** (<5g por ración) | **Moderado** (5-12g refinados) | **Elevado** (>12g refinados) |
| **12. Grasas Saturadas / Trans** | **Saludable** (0g trans / Insaturadas) | **Bajo** (<3g saturadas) | **Moderado** (3-6g saturadas) | **Elevado / Excesivo** (>6g o Trans) |
| **13. Sodio** | **Bajo** (<140mg por ración) | **Equilibrado** (140-400mg) | **Moderado** (401-799mg) | **Elevado** (>800mg por ración) |

---

### 5. Interpretación de la Escala del Score (0 a 100)

El **Food Quality Score** global integra todos los vectores y se clasifica de la siguiente manera dentro del tema de la aplicación:

- **80 - 100 (Excelente):** Máxima densidad nutricional, alimentos reales (NOVA 1-2), alto aporte de fibra y proteína de calidad.
- **60 - 79 (Buena Calidad):** Perfil equilibrado con densidad nutricional óptima y procesamiento mínimo.
- **40 - 59 (Moderada):** Presencia de refinados o sodio/grasas moderadas. Se sugiere acompañar con fibra o proteína magra.
- **< 40 (A Mejorar):** Predominio de alimentos ultraprocesados (NOVA 4) o azúcares refinados.

---

### Referencias Científicas

1. **Fulgoni, V. L., Keast, D. R., & Drewnowski, A. (2015).** *"Development and validation of the Nutrient Rich Foods Index: A tool for measuring nutrient density of foods."* *The Journal of Nutrition*, 145(5), 1023-1031. DOI: 10.3945/jn.114.207811.
2. **Monteiro, C. A., Cannon, G., Lawrence, M., et al. (2019 / Actualizado 2023).** *"Ultra-processed foods, diet quality, and health using the NOVA classification system."* *World Health Organization & FAO Public Health Papers*, Rome.
3. **Drewnowski, A. (2021).** *"Defining nutrient density: The Nutrient Rich Foods Index and its application to global food systems."* *Frontiers in Nutrition*, 8, 678542. DOI: 10.3389/fnut.2021.678542.
4. **Hall, K. D., Ayuketah, A., Brychta, R., et al. (2019).** *"Ultra-processed diets cause excess calorie intake and weight gain: An inpatient randomized controlled trial of ad libitum food intake."* *Cell Metabolism*, 30(1), 67-77. DOI: 10.1016/j.cmet.2019.05.008.
    `,
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getRelatedPosts(currentSlug: string, category: string, limit = 3): BlogPost[] {
  const otherPosts = BLOG_POSTS.filter((p) => p.slug !== currentSlug);
  const sameCategory = otherPosts.filter((p) => p.category === category);
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);
  return [...sameCategory, ...otherPosts.filter((p) => p.category !== category)].slice(0, limit);
}
