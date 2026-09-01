# Directrices del Motor de Generación de Workouts con IA

> Documento oficial de referencia para la generación y prescripción de rutinas en **Shakerfy / Studio Pulse Smart**.
> Basado estrictamente en la arquitectura y módulos reales del proyecto (`src/lib/muscle-recovery.ts`, `src/components/custom-workout-tab.tsx` y `src/routes/app.tsx`).

---

## 🎯 1. Principios Rectores: Realidad del Proyecto, Anti-Ortorexia y Cero Fricción

1. **Modelo de Recuperación Tisular (`< 70%` Exclusión):** Todo grupo muscular cuyo nivel biológico calculado sea inferior al **70%** se considera en *Fase Aguda de Reparación* y queda **automáticamente excluido o despriorizado** de la generación de rutinas de alta intensidad.
2. **Restricciones Articulares In-Place:** El usuario selecciona en 1 toque sus limitaciones físicas activas (*"No tengo restricciones"*, *"Apto para la espalda"*, *"Apto para las rodillas"*, *"Apto para los hombros"*), adaptando inmediatamente los ejercicios generados.
3. **Interocepción Somática de Combustible:** Cero conteo de calorías o registro obligatorio de horarios de comida. La IA solo evalúa la sensación somática actual de energía y saciedad (`[ Vacío / Hambre ]` vs `[ Confort ]` vs `[ Digestión pesada ]`).
4. **Integración con la Hidratación del Diario (TTL 2–4h):** Si el usuario registró su hidratación en el Diario (Escala de Armstrong), la IA la tiene en cuenta únicamente si el registro es reciente (< 4h). Si expiró, asume hidratación neutra sin limitar la sesión.
5. **Regla de los 2 Toques (Two-Tap Rule):** La generación debe ser instantánea (`[ Generar Entrenamiento ]` en 1 toque con presets inteligentes ya calculados).

---

## 📐 2. Arquitectura de Datos del Sistema

```
┌────────────────────────────────────────────────────────────────────────┐
│  CAPA 1 — CONFIGURACIÓN BIOMÉTRICA & EQUIPAMIENTO                       │
│  Tipo (Fuerza/Hipertrofia/Resistencia/Calistenia/Recuperar)            │
│  Equipamiento disponible · Restricción articular (Espalda/Rodilla/Hombro)│
├────────────────────────────────────────────────────────────────────────┤
│  CAPA 2 — MOTOR DE RECUPERACIÓN MUSCULAR (src/lib/muscle-recovery.ts) │
│  Nivel de recuperación en 10 grupos (0–100%) · Tasa 2.1%/h (~48h)      │
│  Regla de oro: Músculos con < 70% NO reciben alta carga                │
├────────────────────────────────────────────────────────────────────────┤
│  CAPA 3 — INTEGRACIÓN CON EL DIARIO (Actividad MET + Hidratación)     │
│  Desgaste de actividades previas (running, natación, etc.)             │
│  Estado de hidratación reciente (< 4 horas)                            │
├────────────────────────────────────────────────────────────────────────┤
│  CAPA 4 — ESTADO SOMÁTICO EN TIEMPO REAL                              │
│  Sensación de energía disponible · Confort digestivo / hambre          │
└────────────────────────────────────────────────────────────────────────┘
                                    ↓
                       RUTINA GENERADA (3 FASES)
     Fase 1: Calentamiento → Fase 2: Bloques/Superseries → Fase 3: Vuelta a la Calma
```

---

## 🧬 3. Reglas Específicas por Módulo

### 3.1 Motor de Recuperación Muscular (10 Grupos Esenciales)

Implementado en `src/lib/muscle-recovery.ts` con persistencia en `localStorage`:

* **Grupos Musculares:** `Hombros`, `Bíceps`, `Tríceps`, `Espalda`, `Pecho`, `Abdominales`, `Espalda baja`, `Glúteos`, `Cuádriceps`, `Isquiotibiales`.
* **Escala de Estado:**
  * **80% - 100% (Verde / Listo):** Prioritario para series efectivas, sobrecarga e hipertrofia.
  * **70% - 79% (Ámbar / Fatiga Moderada):** Apto para trabajo secundario o accesorios.
  * **< 70% (Rojo / Fase Aguda):** **Excluido automáticamente de la rutina** para evitar sobre-entrenamiento.
* **Descuento por Actividad:** Cada vez que el usuario registra un entreno o una actividad en el Diario (ej. Running $\rightarrow$ fatiga en cuádriceps/isquios/glúteos), el sistema descuenta automáticamente los puntos correspondientes y los recupera a razón de **2.1% por hora**.

---

### 3.2 Subvista de Lesiones y Restricciones Biomecánicas

Integrada en la subvista `"injuries"` de `custom-workout-tab.tsx`:

| Opción Seleccionada | Comportamiento del Motor de Generación |
| :--- | :--- |
| **"No tengo restricciones"** | Acceso al catálogo completo de movimientos compuestos y libres. |
| **"Apto para la espalda"** | **Elimina cargas axiales directas sobre la columna.** Sustituye sentadillas libres y remos inclinados por prensa a 45°, remos con soporte de pecho e hip thrust. |
| **"Apto para las rodillas"** | **Reduce momentos de cizalla anterior.** Sustituye sentadilla profunda libre y zancadas con impacto por sentadillas en cajón, prensa con rango medio o extensión controlada. |
| **"Apto para los hombros"** | **Elimina abducciones extremas en rotación interna.** Sustituye press tras nuca y fondos en paralelas por press con mancuernas en plano escapular (30°). |

---

### 3.3 Integración con el Diario de Bienestar

* **Actividades del Diario:** Las actividades registradas con su valor MET aplican fatiga muscular inmediata mediante `updateMuscleRecoveryForActivity()`, reflejándose de inmediato en la recuperación de la rutina.
* **Hidratación (Escala de Armstrong):**
  * Si hay un registro de deshidratación con **menos de 4 horas de antigüedad**, la IA aumenta los tiempos de descanso (+30s) y aconseja hidratación antes de iniciar.
  * Si el registro tiene **más de 4 horas**, se descarta automáticamente asumiendo estado hídrico neutro.

---

### 3.4 Estructura de la Rutina Generada (Fases y Controles)

* **Fase 1: Calentamiento & Activación:**
  * Movilidad articular dinámica y elevación de temperatura. Controlable con switch in-place dentro de la rutina.
* **Fase 2: Bloques Principales (Estándar o Superseries):**
  * Ejercicios con control numérico inteligente (`[ 10 ] reps` / `[ 24 ] kg`).
  * Alternancia de modalidad con 1 toque en la unidad (`[ reps ]` $\leftrightarrow$ `[ seg ]`).
  * Notas rápidas por ejercicio desplegables in-place para ajustes de máquina o sensaciones.
  * Steppers dinámicos `+` / `-` para añadir o quitar series en vivo.
* **Fase 3: Vuelta a la Calma & Elongación:**
  * Estiramientos pasivos y respiración parasimpática. Controlable con switch in-place dentro de la rutina.
* **Cronómetro Flotante No Bloqueante:**
  * Widget inferior docking (`bottom-24`) con cuenta regresiva en tiempo real, botón `+30s`, pausa/salto y síntesis sonora con Web Audio API al finalizar el descanso.

---

## 🚫 4. Reglas de Seguridad y Anti-Ortorexia (Inviolables)

1. **Regla del 70%:** Jamás prescribir alta intensidad a un grupo muscular que esté por debajo del 70% de recuperación.
2. **Respeto a la Restricción Articular:** Jamás incluir ejercicios que comprometan la zona marcada en la subvista de lesiones.
3. **Cero Cómputo de Calorías o Ayuno Cronológico:** Jamás exigir el registro de comidas ni calcular horas desde la última ingesta. Si el usuario reporta sensación de hambre/vacío, se ajusta el volumen a ≤40 min sin juzgar.
4. **Opciones Siempre Visibles (Smart Guardrails):** Ningún botón o pastilla desaparece de la interfaz; las opciones no recomendadas se muestran atenuadas con su explicación fisiológica.
5. **Redondeo Realista de Cargas:** Todo peso sugerido se redondea a los incrementos físicos del gimnasio (mancuernas de 1–2 kg, discos de 1.25/2.5 kg).
