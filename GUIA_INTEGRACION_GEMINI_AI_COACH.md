# THE WELLNESS FACE — AI COACH
# Guía de Integración Técnica y Catálogo Definitivo de CTAs con Gemini

Esta guía documenta la arquitectura, el contrato de datos (JSON Schema), las reglas éticas y el catálogo maestro de CTAs para la integración definitiva de la API de Gemini en la sección **AI Coach** de The Wellness Face.

---

## 1. Principio Arquitectónico: Petición Única y Revelación sin Latencia (Zero-Latency Reveal)

El motor opera bajo un modelo **Agentic de Petición Única (Single-Request Upfront Resolution)**:

```text
[ CÁMARA / FOTO DE COMIDA ]
          ↓
  ENVÍO ÚNICO A GEMINI
  • Imagen o lista de ingredientes
  • Historial de comidas y actividad del día
  • Hora actual, ángulo/hito solar y latitud/longitud
  • Modo de usuario: Wellness Mode vs. Athlete Mode
  • Catálogo de los 12 CTAs disponibles
          ↓
  RESPUESTA ESTRUCTURADA DE GEMINI
  • Nombre del plato y 7 Vectores Nutricionales
  • Valor Nutricional (Alto / Medio / Bajo)
  • INSIGHT Contextualizado y Educativo
  • Selección de 0, 1 o máximo 2 CTAs pertinentes
  • CONTENIDO PRE-GENERADO para cada CTA elegido
          ↓
  GUARDADO EN TIMELINE (`shakerfy_user_timeline_items`)
          ↓
  EXPERIENCIA EN TIMELINE (UI)
  • Al pulsar "Ver insight" → Revela el texto de inmediato.
  • Al pulsar un botón de CTA → Revela el contenido pre-generado de inmediato (con animación Typewriter).
  • CERO llamadas adicionales a la red al interactuar con los botones.
```

### Ventajas clave de este diseño:
1. **Velocidad instantánea:** El usuario no experimenta pantallas de carga ni spinners al tocar botones en su diario.
2. **Eficiencia de costos y tokens:** Toda la inteligencia contextual se calcula en una única invocación.
3. **Resiliencia offline:** Una vez guardado el registro en el diario, el usuario puede revisar sus insights y CTAs sin conexión a internet.

---

## 2. Contrato de Entrada (Lo que la App envía a Gemini)

Al invocar la API de Gemini (modelo recomendado: `gemini-1.5-flash` o `gemini-2.0-flash` para balance óptimo de velocidad y razonamiento multimodal), el cliente envía:

1. **Imagen / Datos del Alimento:** Archivo en base64 o lista de ingredientes detectados.
2. **Contexto Biológico y Temporal del Usuario:**
   ```json
   {
     "currentTime": "13:45",
     "solarPhase": "Cenit / Mediodía Solar",
     "workoutContext": {
       "hasRecentWorkout": true,
       "workoutType": "CrossFit / Fuerza",
       "minutesSinceWorkout": 45
     },
     "upcomingClass": null,
     "dailyHistory": [
       { "time": "08:30", "title": "Avena con Frutos Rojos", "type": "Desayuno" },
       { "time": "11:00", "title": "Sesión WOD", "type": "Entrenamiento" }
     ],
     "userMode": "wellness", // "wellness" o "athlete"
     "athleteTargets": {
       "remainingProtein": 42,
       "remainingCalories": 650
     },
     "aiMemories": [
       "Le gusta: Salmón fresco, batata asada, frutos rojos, palta",
       "No suele preferir: Comidas con salsas pesadas o exceso de fritura"
     ]
   }
   ```
3. **System Prompt Mandatorio:** Contiene las reglas éticas, la memoria de gustos y la lista permitida de CTAs.

---

## 3. Contrato de Salida de Gemini (Structured Output JSON Schema)

Gemini debe ser configurado con `generationConfig.responseMimeType = "application/json"` y responder estrictamente bajo este esquema:

```json
{
  "foodName": "Pechuga de Pollo al Grill con Puré de Batata y Ensalada Verde",
  "qualityLevel": 3,
  "qualityLabel": "Alto",
  "vectorBadges": [
    { "category": "processing", "label": "Mínimamente procesado" },
    { "category": "protein", "label": "Alto en proteína" },
    { "category": "fiber", "label": "Buena fuente" },
    { "category": "sugar", "label": "Sin azúcar añadido" }
  ],
  "insight": "Registro equilibrado con proteína magra y vegetales frescos que apoyan una recuperación muscular limpia y saciedad prolongada tras tu entrenamiento.",
  "selectedCtas": [
    {
      "id": "explore_postworkout_fuel",
      "title": "Ideas post-entreno",
      "icon": "sparkles",
      "actionType": "expand_text",
      "content": "Tres alternativas completas para reponer glucógeno y apoyar la síntesis muscular:\n\n• **Opción 1 (Práctica y fresca):** Bowl de arroz basmati con atún al natural, palta en cubos y tomates cherry.\n• **Opción 2 (Cálida y reconfortante):** Batata asada con pechuga desmenuzada y espinacas al vapor con aceite de oliva virgen extra.\n• **Opción 3 (Rápida / Batido):** Licuado de bebida vegetal, 1 banana madura, 1 cucharada de chía y proteína aislada."
    },
    {
      "id": "check_hydration_armstrong",
      "title": "Chequear hidratación",
      "icon": "droplet",
      "actionType": "interactive_armstrong",
      "content": "Tu sesión implicó pérdida hídrica por sudoración. Chequear tu nivel en la escala de coloración te ayudará a saber si necesitas reponer líquidos con o sin sales minerales."
    }
  ]
}
```

---

## 4. Catálogo Oficial de los 12 CTAs para la IA

La IA tiene a su disposición exclusivamente estos 12 identificadores. Gemini decide cuáles incluir (0, 1 o máximo 2) según el contexto del usuario:

| # | ID del CTA | Título en Botón | Tipo de Acción en UI | Criterio de Activación por Gemini |
| :---: | :--- | :--- | :--- | :--- |
| **1** | `explore_meal_ideas` | **Ideas de comidas** | `expand_text` | Almuerzo o comida habitual sin eventos especiales. |
| **2** | `explore_postworkout_fuel` | **Ideas post-entreno** | `expand_text` | Comida consumida dentro de los 150 min post-entreno. |
| **3** | `explore_preworkout_fuel` | **Ideas pre-entreno** | `expand_text` | Sesión o clase agendada en los próximos 60–120 min. |
| **4** | `explore_light_dinner` | **Ideas de digestión nocturna** | `expand_text` | Ingesta en hito solar nocturno (> 19:30 hs). |
| **5** | `view_muscle_recovery` | **Ver recuperación muscular** | `expand_text` | Posterior a entrenamientos de fuerza o hipertrofia. |
| **6** | `check_hydration_armstrong` | **Chequear hidratación** | `interactive_armstrong` | Post-entreno, clima cálido o comidas con sodio. |
| **7** | `take_a_pause` | **Tomar una pausa** | `open_breathing_modal` | Comidas apresuradas, estrés o transición digestiva. |
| **8** | `healthy_snack_ideas` | **Ideas de colaciones** | `expand_text` | Ingestas intermedias, media mañana o media tarde. |
| **9** | `explore_fiber_diversity` | **Explorar variedad de fibra** | `expand_text` | Comidas con baja presencia vegetal o de granos. |
| **10** | `analyze_my_day` | **Analizar mi día** | `expand_text` | Cuando ya existen 2 o más comidas registradas hoy. |
| **11** | `plan_next_meal` | **Planificar siguiente comida** | `expand_text` | *Exclusivo Athlete Mode* con macros restantes. |
| **12** | `explore_store` | **Explorar tienda** | `open_store_link` | *Desactivado por defecto* (Sujeto a reglas éticas). |

---

## 5. Especificaciones Detalladas de cada CTA

### CTA 1: `explore_meal_ideas` ("Ideas de comidas")
* **Objetivo:** Estimular la variedad con alimentos reales sin prescribir dietas restrictivas.
* **Contenido que genera Gemini:** 2 o 3 opciones de platos análogos o complementarios basados en ingredientes enteros, explicando qué aporta cada combinación.

### CTA 2: `explore_postworkout_fuel` ("Ideas post-entreno")
* **Objetivo:** Optimizar la recuperación neuromuscular y reposición glucogénica.
* **Contenido que genera Gemini:** Opciones de comidas completas con ratio proteína/carbohidratos balanceado para favorecer la síntesis de glucógeno y la reparación de fibras musculares.

### CTA 3: `explore_preworkout_fuel` ("Ideas pre-entreno")
* **Objetivo:** Asegurar disponibilidad energética sin pesadez estomacal.
* **Contenido que genera Gemini:** Opciones de digestión rápida (bajas en grasa y fibra excesiva) para consumir antes de la actividad física garantizando confort gástrico.

### CTA 4: `explore_light_dinner` ("Ideas de digestión nocturna")
* **Objetivo:** Preservar la arquitectura del sueño profundo y la secreción de melatonina.
* **Contenido que genera Gemini:** Sugerencias de cenas ligeras, cocciones suaves (al vapor, hervidos, caldos) e infusiones relajantes para facilitar el descanso.

### CTA 5: `view_muscle_recovery` ("Ver recuperación muscular")
* **Objetivo:** Educación fisiológica sobre cómo los nutrientes impactan los músculos trabajados.
* **Contenido que genera Gemini:** Breve explicación biológica (ej. acción de la leucina, hidratación fascial, reposición de electrolitos) asociada a la actividad registrada en el día.

### CTA 6: `check_hydration_armstrong` ("Chequear hidratación")
* **Objetivo:** Seguimiento del estado hídrico celular con base clínica validada.
* **Contenido que genera Gemini:** Breve justificación somática y apertura del **selector interactivo de la Escala Armstrong (Nivel 1 al 8)**.
* **Regla estricta:** **Prohibido el conteo de vasos volumétricos ("+250 ml")**. La hidratación se monitorea y registra exclusivamente según la escala colorimétrica de Armstrong (Ucol 1 a 8).

### CTA 7: `take_a_pause` ("Tomar una pausa")
* **Objetivo:** Reducción del tono simpático y activación del sistema parasimpático (*Rest & Digest*).
* **Acción en la UI:** Despliega el modal inmersivo del **Orbe de Respiración Vagal**.

### CTA 8: `healthy_snack_ideas` ("Ideas de colaciones")
* **Objetivo:** Promover saciedad limpia entre comidas principales.
* **Contenido que genera Gemini:** Opciones portátiles de baja transformación industrial (frutos secos, kéfir, fruta con piel, semillas).

### CTA 9: `explore_fiber_diversity` ("Explorar variedad de fibra")
* **Objetivo:** Cuidado de la microbiota intestinal mediante rotación de fuentes vegetales.
* **Contenido que genera Gemini:** Mención de fuentes ricas en fibra soluble, insoluble y almidón resistente (legumbres, avena, tubérculos fríos, semillas).
* **Regla estricta:** Enfoque de adición. Jamás decir *"tu comida carece de fibra"*, sino destacar el beneficio de sumar variedad vegetal.

### CTA 10: `analyze_my_day` ("Analizar mi día")
* **Objetivo:** Reflexión global de la jornada nutricional (Nutrition Awareness).
* **Contenido que genera Gemini:** Lectura somática del conjunto de comidas del día (ej. variedad cromática, balance de saciedad, distribución de energía) sin calificaciones morales.

### CTA 11: `plan_next_meal` ("Planificar siguiente comida" — *Athlete Mode*)
* **Objetivo:** Apoyo cuantitativo neutro para metas de rendimiento.
* **Contenido que genera Gemini:** Resumen matemático de los gramos de proteína y calorías pendientes hacia el objetivo, sugiriendo una composición ideal para la siguiente comida.

### CTA 12: `explore_store` ("Explorar tienda" — *Marketplace*)
* **Estado:** **Desactivado por defecto (`enabled: false`)**.
* **Comportamiento:** Redirección a la tienda online de alimentos saludables. Requiere cumplimiento estricto del blindaje ético descrito en la sección 7.

---

## 6. Protocolo Científico de Respiración: Orbe "Tomar una pausa"

Cuando el usuario pulsa el CTA **"Tomar una pausa" (`take_a_pause`)**, la interfaz abre un diálogo modal centrado con un orbe interactivo:

```text
+-------------------------------------------------------+
|                    TOMAR UNA PAUSA                    |
|         Resonancia Vagal • Activación Digestiva       |
|                                                       |
|                       ╭──────╮                        |
|                    ╭──┤      ├──╮                     |
|                    │  │ ORBE │  │                     |
|                    ╰──┤      ├──╯                     |
|                       ╰──────╯                        |
|                                                       |
|                 INHALA... (4s) / EXHALA... (6s)       |
|                                                       |
|                   [ Ciclo 1 de 6 • 00:54 ]            |
|                                                       |
|                   [ Finalizar Pausa ]                 |
+-------------------------------------------------------+
```

### 1. Base Científica: Resonancia Vagal (Ritmo 4 - 6)
* **Referencia Clínica:** Lehrer, P. et al. (*Heart Rate Variability Biofeedback: How and Why Does It Work?*, 2014); Laborde, S. et al. (*Vagal Tank Theory*, 2017).
* **Mecanismo Fisiológico:** Respirar a una frecuencia de aproximadamente 6 respiraciones por minuto con una **exhalación más prolongada que la inhalación (4 segundos de inhalación nasal, 6 segundos de exhalación suave)** estimula de forma inmediata los barorreceptores y las ramas eferentes del **Nervio Vago**.
* **Impacto en la Nutrición:**
  * Inhibe la respuesta adrenérgica de estrés (reducción de cortisol y frecuencia cardíaca).
  * Activa la motilidad gastrointestinal y la vasodilatación mesentérica.
  * Facilita la liberación de gastrina, pepsina y jugos pancreáticos, previniendo la dispepsia funcional y la hinchazón postprandial.

### 2. Comportamiento en la Interfaz (UX / UI):
1. **Duración predeterminada:** 60 segundos (6 ciclos completos de 10 segundos).
2. **Animación del Orbe:**
   * **Inhalar (0s a 4s):** El orbe se expande suavemente (`scale-125`) con una iluminación cálida sutil (`bg-amber-400/20` o `bg-emerald-500/20`).
   * **Exhalar (4s a 10s):** El orbe se contrae lentamente a su tamaño basal (`scale-90`) disipando el brillo.
3. **Respuesta Sensorial:** Micro-vibración háptica (`navigator.vibrate(30)`) en los puntos de transición (al iniciar la inhalación y al iniciar la exhalación).
4. **Fácil Salida:** Botón visible "Finalizar pausa" para no atrapar al usuario en una experiencia forzada.

---

## 7. Blindaje Ético para "Explorar tienda" (`explore_store`)

De acuerdo con las **Reglas 24 y 25** de [`REGLAS_ANALISIS_NUTRICIONAL_Y_CTAS.md`](file:///c:/Users/shake/.gemini/antigravity/scratch/studio-pulse-smart/REGLAS_ANALISIS_NUTRICIONAL_Y_CTAS.md), este CTA permanece **desactivado por defecto** y solo podrá habilitarse si se cumplen las siguientes restricciones:

### 1. Regla Anti-Venta por Déficit (Mandatoria)
* **Prohibición absoluta:** Jamás se activará el CTA de tienda ante una comida categorizada con **Valor Nutricional Bajo** o carente de algún nutriente.
  * ❌ *Prohibido:* "Comiste bajo en fibra → Compra semillas de chía en nuestra tienda."
  * ❌ *Prohibido:* "Te faltan 30g de proteína → Compra este suplemento aquí."
* **Razón Bioética:** Mercantilizar la supuesta deficiencia de un usuario induce ansiedad alimentaria, culpa y manipulación comercial, violando el marco anti-ortorexia de The Wellness Face.

### 2. Condiciones de Activación Futura (Por Intención Positiva)
El CTA solo podrá sugerirse cuando:
1. El usuario está visualizando una receta o alimento de alta calidad y el insight describe ingredientes nobles (ej. café de especialidad, frutos secos seleccionados, aceite de oliva virgen extra de finca).
2. El usuario ha configurado en su perfil su interés explícito en descubrir productos para su despensa.
3. **Límite de Frecuencia:** Máximo **1 aparición cada 7 días** por usuario en el timeline.

---

## 8. Reglas de Oro para el System Prompt de Gemini

Todo prompt enviado a Gemini debe incluir estas directrices inviolables:

```text
REGLAS INVIOLABLES DE THE WELLNESS FACE AI COACH:
1. CERO MORALIDAD: Nunca uses palabras como "bueno", "malo", "pecado", "cheat meal", "comida trampa", "limpio" o "engordar". Describe propiedades observables.
2. CERO COMPENSACIÓN: Prohibido sugerir "quemar calorías", "compensar en la siguiente comida" o vincular ejercicio como castigo/premio por comer.
3. ENFOQUE DE ADICIÓN: Sugiere qué sumar para promover bienestar (ej. hidratación, fibra fresca, proteína) en lugar de exigir eliminar alimentos.
4. MÁXIMO DOS CTAs: Devuelve 0, 1 o máximo 2 CTAs seleccionados estrictamente del catálogo provisto. Si la comida no amerita acción, devuelve "selectedCtas: []".
5. HIDRATACIÓN ARMSTRONG: Jamás uses conteo volumétrico ("toma 2 vasos de 250ml"). Toda mención de hidratación debe orientarse a la Escala Colorimétrica de Armstrong (1 a 8).
6. ZERO-LATENCY PAYLOAD: Redacta por completo el campo "content" de cada CTA elegido para que el cliente lo muestre inmediatamente sin realizar nuevas peticiones.
7. MÚLTIPLES OPCIONES (2 A 3 ALTERNATIVAS): Cuando redactes el contenido para CTAs de ideas (`explore_meal_ideas`, `explore_postworkout_fuel`, `explore_light_dinner`, `healthy_snack_ideas`), NUNCA des una sola receta rígida. Proporciona siempre 2 a 3 alternativas distintas y prácticas (ej. Opción 1 fresca/rápida, Opción 2 cocida/cálida, Opción 3 batido o vegetal) para que el usuario elija según su despensa.
8. RESPETAR MEMORIA DE GUSTOS: Revisa el array `aiMemories` del contexto y asegúrate de que las opciones sugeridas favorezcan los ingredientes que le gustan y omitan los que no prefiere.
```

---

## 9. Mapeo en el Código del Frontend

Cuando se implemente la llamada a la API de Gemini:

1. **En `src/lib/ai-coach-service.ts`:**
   Crear la función `analyzeMealWithGemini(mealData)` que envíe la imagen y el contexto al endpoint de Gemini y devuelva el JSON estructurado.

2. **En `src/routes/scan.tsx` (`handleSaveToDiary`):**
   Almacenar el resultado en el objeto de la comida:
   ```ts
   const newMealItem = {
     id: `meal-${Date.now()}`,
     title: aiResponse.foodName,
     bioQualityLabel: aiResponse.qualityLabel,
     coachFeedback: aiResponse.insight,
     dynamicCtas: aiResponse.selectedCtas, // Array con los CTAs pre-generados
     feedback: null, // 'like' | 'dislike' | null
     ...
   };
   ```

3. **En `src/routes/app.tsx` (`DiarioTab`):**
   Renderizar `item.dynamicCtas`:
   * Si `cta.id === 'take_a_pause'` → Abre el modal `BreathingOrbModal`.
   * Si `cta.id === 'check_hydration_armstrong'` → Muestra el selector `ArmstrongUrineScaleVisual`.
   * Para los demás CTAs → Expande el contenedor con `<TypewriterMarkdown content={cta.content} />`.

---

## 10. Bucle de Aprendizaje por Feedback ("Me gusta / No me gusta")

Para que el sistema se adapte orgánicamente al paladar del usuario sin formularios aburridos:

1. **Botones de Feedback en la Tarjeta:** Cada comida registrada incluye discretamente dos botones: 👍 ("Me gusta") y 👎 ("No me gusta").
2. **Acción de 1 Toque (Frictionless):**
   * Al pulsar 👍: Se extraen los ingredientes o el plato y se persiste en `shakerfy_ai_memory`:
     `"Le gusta: [Nombre del plato o ingrediente principal]"`
   * Al pulsar 👎: Se registra en memoria:
     `"No suele preferir: [Nombre del plato o ingrediente principal]"`
3. **Efecto en Futuras Solicitudes:**
   En el siguiente escaneo, ese array `aiMemories` viaja en el contexto hacia Gemini. El System Prompt le indica explícitamente al modelo:
   *"El usuario disfruta de X e Y; prefiere evitar Z. Ofrece sugerencias afines a sus gustos comprobados."*
4. **Resultado:** El AI Coach se personaliza silenciosa y progresivamente con el uso diario, sin requerir cuestionarios iniciales ni configuración manual.

