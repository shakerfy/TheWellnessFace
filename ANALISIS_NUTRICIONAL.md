# THE WELLNESS FACE
# 📘 GUÍA MAESTRA DEFINITIVA: MOTOR DE ANÁLISIS NUTRICIONAL, GEMINI VISION Y CTAS DINÁMICOS

Este documento establece la arquitectura completa, lógica técnica, especificación de vectores, prompts de sistema para la API de Gemini y el catálogo de CTAs dinámicos in-place para **The Wellness Face (Shakerfy)**.

---

## 🏛️ 1. Arquitectura General y Separación de Responsabilidades

El sistema opera bajo un modelo híbrido de **máxima eficiencia y seguridad clínica**:

```text
 ┌────────────────────────────────────────────────────────┐
 │                      USUARIO                           │
 │  1. Captura o sube foto del plato                      │
 │  2. Selecciona Choice Chip: Rutina | Social | Placer | Confort
 └───────────────────────────┬────────────────────────────┘
                             │
                             ▼
 ┌────────────────────────────────────────────────────────┐
 │             GEMINI VISION (Backend / API)              │
 │  • Ojos e Inteligencia Biológica                       │
 │  • Título apetitoso y descriptivo                      │
 │  • Dial de Valor Nutricional (ALTO / MEDIO / LIGERO)   │
 │  • 7 Vectores con Filtrado por Excepción (2 a 4 datos) │
 │  • Coach Insight Somático (Voz narrativa humana)       │
 │  • Devuelve JSON estructurado y tipado                 │
 └───────────────────────────┬────────────────────────────┘
                             │
                             ▼
 ┌────────────────────────────────────────────────────────┐
 │           FRONTEND CLIENTE (The Wellness Face)         │
 │  • Renderiza Dial Semicircular Azul + Card Blog        │
 │  • Despliega Tabla filtrada con tildes (✓, ⋯, ⚠)       │
 │  • Renderiza Typewriter Markdown del Insight           │
 │  • EJECUTA PEDAGOGICAL DECISION ENGINE WATERFALL:      │
 │    - Lee hora local (≥ 19:30 → Noche)                  │
 │    - Aplica Blindaje Anti-TCA / Anti-Estrés            │
 │    - Despliega 1 o 2 CTAs secundarios in-place         │
 └────────────────────────────────────────────────────────┘
```

### ¿Por qué esta separación?
1. **Gemini hace lo complejo perceptivo:** Reconoce alimentos en fotos sin importar ángulo o iluminación, evalúa la matriz biológica y redacta con empatía humana somática.
2. **El Frontend garantiza el blindaje legal y anti-TCA:** El código local conoce la hora del dispositivo y el estado emocional del usuario. Si el usuario marcó `Confort`, el frontend **bloquea el 100% de los minijuegos** y activa la pausa de respiración, garantizando que ninguna alucinación de la IA vulnere al usuario.

---

## 🧭 2. El Dial de Valor Nutricional (`ALTO` / `MEDIO` / `LIGERO`)

El dial radial semicircular en **azul informativo** mide objetivamente la **Densidad Biológica de Micronutrientes vs. Energía Vacía o Rápida**, fundamentado en el **Nutrient-Rich Foods Index (NRF 9.3)** de la Universidad de Washington y la **Clasificación NOVA (OMS/FAO)**.

### Sistema de Fuerzas Biológicas Ponderadas:
* **Fuerzas que Suman Densidad (+):**
  * `Mínimamente procesado` (+2.0 pts)
  * `Alto en proteína` / `Magra y completa` / `Fuente vegetal` (+1.5 pts)
  * `Alto en fibra` / `Buena fuente` (+1.5 pts)
  * `Grasas saludables` / `Saludables (Omega-3)` (+1.0 pt)
  * `Carbohidratos complejos` (+1.0 pt)
  * `Sin azúcar añadido` (+0.5 pts)
* **Fuerzas que Restan Densidad o Aceleran Absorción (-):**
  * `Ultraprocesado` (-2.5 pts)
  * `Con azúcar añadido` (-1.5 pts)
  * `Alto en sodio` (-0.5 pts)
  * `Alto en grasas` (-0.5 pts)

### Los 3 Niveles del Dial:
1. **🟢 Nivel `ALTO` (Puntaje $\ge +3.5$ pts):**  
   Comida real (`Mínimamente procesado`) combinada con al menos 2 vectores positivos destacados (ej. Proteína + Fibra, o Proteína + Grasas saludables). Cero ultraprocesados y sin azúcar añadido.  
   *Ejemplos:* Salmón con quinoa y espárragos; Bowl de lentejas con vegetales y palta; Omelette con vegetales y pan de masa madre.
2. **🟡 Nivel `MEDIO` (Puntaje $+1.5$ a $+3.4$ pts):**  
   Composición mixta o balance habitual. Aporta nutrientes nobles, pero convive con carbohidratos de absorción rápida, algún procesado culinario tradicional o sodio notable.  
   *Ejemplos:* Sándwich de jamón crudo y queso en pan artesanal; Fideos con carne magra y salsa casera; Piezas de sushi con salsa de soja.
3. **⚪ Nivel `LIGERO` (Puntaje $< +1.5$ pts — Libre de Juicios Morales):**  
   *Escenario A (Comida de paso liviana):* Manzana sola, infusión, caldo desgrasado o ensalada de hojas verdes sola.  
   *Escenario B (Energía rápida / Placer):* Porción de torta, papas fritas de paquete o medialunas (energía veloz sin soporte de fibra ni proteína).

---

## 🔬 3. Los 7 Vectores de Conciencia Nutricional (Regla de Cero Ruido)

A diferencia de las tablas nutricionales fijas de 10 renglones, la tarjeta aplica el **Principio de Filtrado por Excepción Estricto**: *un vector solo se renderiza si es verdaderamente notable en el plato*. Cada comida muestra únicamente entre **2 y 4 vectores destacados**.

### Tabla Maestra Oficial:

| # | Vector | Etiquetas Visibles en Tabla | Icono / Estado | Criterio de Activación (Trigger) | Criterio de Omisión (Cero Ruido) |
| :-: | :--- | :--- | :--- | :--- | :--- |
| **1** | **`Procesamiento`** | **`Mínimamente procesado`**<br>**`Ultraprocesado`** | `✓`<br>`⚠` | • Sello de comida real entera.<br>• Alerta de producto ultra-refinado. | Se oculta si es procesado neutro tradicional (`Procesado`) y ya hay 3 vectores en la tarjeta. |
| **2** | **`Fibra`** | **`Alto en fibra`**<br>**`Buena fuente`** | `✓`<br>`✓` | • Aporte $\ge 5\text{g}$ de fibra.<br>• Aporte $2\text{ a }4\text{g}$ de fibra. | **SE OCULTA si es $< 1.5\text{g}$** (ej. carnes, arroz blanco, huevos). Jamás dice "Bajo en fibra". |
| **3** | **`Proteína`** | **`Magra y completa`**<br>**`Alto en proteína`**<br>**`Fuente vegetal`**<br>**`Buena fuente`** | `✓`<br>`✓`<br>`✓`<br>`✓` | • Alta proteína con mínima grasa ($\ge 18\text{g}$).<br>• Proteína total elevada ($\ge 25\text{g}$).<br>• Proteína vegetal completa (tofu, legumbres+grano).<br>• Proteína moderada ($10\text{ a }17\text{g}$). | **SE OCULTA si es $< 5\text{g}$** (ej. fruta sola, café, gaseosa). Jamás dice "Bajo en proteína". |
| **4** | **`Azúcares Añadidos`** | **`Sin azúcar añadido`**<br>**`Con azúcar añadido`** | `✓`<br>`⚠` | **ÚNICAMENTE en bebidas, postres, snacks, lácteos o salsas:**<br>• Confirma cero azúcar en comidas dulces.<br>• Alerta sobre azúcares libres/jarabes. | **SE OCULTA en el 100% de comidas saladas** (bife, ensalada, arroz, huevos). Cero ruido. |
| **5** | **`Grasas`** | **`Saludables (Omega-3)`**<br>**`Grasas saludables`**<br>**`Alto en grasas`** | `✓`<br>`✓`<br>`⚠` | • Pescados grasos, semillas de chía, nueces.<br>• Palta, aceite de oliva virgen extra, almendras.<br>• Frituras profundas o cortes grasosos. | **SE OCULTA si es $< 3\text{g}$** (fruta fresca, arroz hervido solo) o grasas neutras pequeñas. |
| **6** | **`Carbohidratos`** | **`Complejos`**<br>**`Absorción rápida`** | `✓`<br>`⋯` | • Almidones lentos/tubérculos (batata, avena, quinoa).<br>• Almidones refinados (fideos/arroz/pan blanco). | **SE OCULTA si es $< 5\text{g}$** (bife solo, pechuga sola, omelette solo). Jamás dice "Bajo en carbs". |
| **7** | **`Sodio`** | **`Alto en sodio`** | `⚠` | **ÚNICAMENTE cuando la sal es excesiva** (salsa de soja, ramen, embutidos/salame, snacks salados). | **SE OCULTA en el 95% de los platos** (comida casera, frutas, carnes normales, ensaladas). |

---

## 🤖 4. System Prompt Oficial para Gemini Vision (Listo para API)

Este prompt debe inyectarse en la llamada a la API de Gemini (modo multimodal pasándole la imagen del plato + el Choice Chip seleccionado):

````markdown
Eres el motor de análisis nutricional cualitativo de "The Wellness Face". Tu misión es analizar la fotografía de una comida y devolver un análisis estructurado en formato JSON estricto.

### DIRECTRICES ÉTICAS Y SOMÁTICAS MANDATORIAS:
1. CERO CONTABILIDAD CALÓRICA: Prohibido calcular calorías, macros en gramos o porcentajes diarios.
2. CERO MORALIDAD ALIMENTARIA (Prevención de TCA): Jamás califiques comidas como "buenas", "malas", "pecados", "engordar", "compensar" o "comida trampa".
3. LENGUAJE SOMÁTICO COTIDIANO (Test de Steve Jobs): Describe sensaciones físicas reales (energía estable, ligereza digestiva, saciedad duradera, hidratación). Prohibido jerga médica o de laboratorio incomprensible.
4. REGLA DE LA ADICIÓN: Si el plato es simple o rápido, enfócate en qué sumar en las próximas comidas (ej. fibras o hidratación), nunca en prohibir o censurar.

---

### REGLAS PARA EVALUAR LOS 7 VECTORES (FILTRADO POR EXCEPCIÓN):
Devuelve ÚNICAMENTE entre 2 y 4 vectores que verdaderamente caractericen al plato. Omite los que sean neutros, insignificantes o redundantes.

1. "processing":
   - "Mínimamente procesado" (status: "check"): Matriz natural entera o cocina casera simple.
   - "Ultraprocesado" (status: "alert"): Productos de formulación industrial, aditivos o ultra-refinados.
   *(Omitir si es un procesado tradicional neutro).*

2. "fiber":
   - "Alto en fibra" (status: "check"): Aporte >= 5g (legumbres, chía, avena, alcaucil, frutos rojos).
   - "Buena fuente" (status: "check"): Aporte 2 a 4g (manzana con piel, brócoli, ensaladas abundantes).
   *(OMITIR si el plato no tiene fibra o es < 1.5g. Prohibido poner "Bajo en fibra").*

3. "protein":
   - "Magra y completa" (status: "check"): Proteína >= 18g con grasa < 5g (pechuga, claras, pescado blanco).
   - "Alto en proteína" (status: "check"): Proteína >= 25g (salmón, carnes vacunas, bowls proteicos).
   - "Fuente vegetal" (status: "check"): Soja/tofu/tempeh, legumbres combinadas con cereales.
   - "Buena fuente" (status: "check"): Aporte 10 a 17g (yogur griego, 2 huevos, sándwich de queso).
   *(OMITIR si el plato tiene < 5g de proteína. Prohibido poner "Bajo en proteína").*

4. "added_sugars":
   - EVALUAR SOLO EN: Bebidas, postres, repostería, snacks dulces, lácteos o salsas industriales.
   - "Sin azúcar añadido" (status: "check"): Dulce natural, licuados sin endulzar, yogur natural.
   - "Con azúcar añadido" (status: "alert"): Gaseosas regulares, golosinas, postres azucarados, aderezos dulces.
   *(OMITIR COMPLETAMENTE en el 100% de comidas saladas enteras).*

5. "fat":
   - "Saludables (Omega-3)" (status: "check"): Salmón, sardinas, semillas de chía/lino, nueces.
   - "Grasas saludables" (status: "check"): Palta/aguacate, aceite de oliva virgen extra, almendras, yema.
   - "Alto en grasas" (status: "alert"): Frituras profundas visibles, cortes muy grasosos, salsas con crema en exceso.
   *(OMITIR si la grasa es < 3g).*

6. "carbs":
   - "Complejos" (status: "check"): Almidones de absorción lenta (batata, avena, quinoa, legumbres, arroz integral).
   - "Absorción rápida" (status: "neutral"): Almidones refinados o harinas blancas (fideos blancos, pan blanco, arroz blanco).
   *(OMITIR si el plato tiene < 5g de carbohidratos. Prohibido poner "Bajo en carbs").*

7. "sodium":
   - "Alto en sodio" (status: "alert"): Salsa de soja abundante, ramen, embutidos/salame, snacks salados de paquete.
   - *(OMITIR EN EL 95% DE LAS COMIDAS NORMALES O CASERAS).*

---

### CÁLCULO DEL DIAL DE VALOR NUTRICIONAL:
Suma las fuerzas biológicas del plato:
- Nivel "ALTO": Comida real mínimamente procesada + al menos 2 vectores positivos destacados (Puntaje >= +3.5).
- Nivel "MEDIO": Composición mixta equilibrada o cotidiana (Puntaje entre +1.5 y +3.4).
- Nivel "LIGERO": Comida de paso liviana (fruta sola, caldo) o baja densidad nutricional (Puntaje < +1.5).

---

### REDACCIÓN DEL COACH INSIGHT (SEGÚN CHOICE CHIP RECIBIDO):
Adapta el tono del insight al parámetro "eatingReason":
- "rutina": Foco en energía progresiva, saciedad durante la jornada y qué sumar en la siguiente comida.
- "social": Foco en la comensalidad, bajar el cortisol, digestión relajada y recordar la mirada semanal sin culpa.
- "placer": Validación total del disfrute consciente, digestión en calma y sugerir agua fresca y fibras para más tarde.
- "confort": Empatía somática profunda, abrigo emocional y comer sin prisa para proteger el descanso y la digestión.

---

### FORMATO JSON REQUERIDO DE RESPUESTA:
```json
{
  "title": "Título corto y apetitoso del plato",
  "nutritional_value": "ALTO", // "ALTO" | "MEDIO" | "LIGERO"
  "vectors": [
    {
      "category": "processing",
      "label": "Procesamiento",
      "value": "Mínimamente procesado",
      "status": "check" // "check" | "neutral" | "alert"
    }
  ],
  "coach_insight": "Párrafo empático somático de 2 a 3 oraciones.",
  "cellular_synergy": "Descripción breve de 1 línea de sinergia entre ingredientes (si existe)."
}
```
````

---

## ⚡ 5. El Motor de CTAs Dinámicos (`pedagogical-decision-engine.ts`)

Una vez que el frontend recibe el JSON de Gemini, la función `resolvePedagogicalCtas(mealItem)` ejecuta una cascada determinista de decisión que garantiza la **seguridad clínica anti-TCA** y el despliegue de **máximo 2 CTAs secundarios**:

### Cascada de Decisión Pedagógica (Waterfall):

1. **Regla de Oro Anti-Estrés (`eatingReason === "confort"`):**  
   * 🛑 **Cero minijuegos, cero cuestionarios.**
   * Despliega exclusivamente: `[ Iniciar pausa de respiración (1 min) ]` (`take_a_pause`).
2. **Cronobiología Nocturna (`hora ≥ 19:30` o cena):**  
   * 🌙 **Cero estimulación lumínica o juegos.**
   * CTA 1: `[ Preparar tu descanso de esta noche ]` (`night-rest-prep`).
   * CTA 2: `[ ¿Cómo sentís tu digestión? ]` (`check-digestion`).
3. **Merienda o Colación de Tarde:**  
   * 🍎 CTA 1: `[ Sugerencia de colación inteligente ]` (`smart-snack-idea`).
   * 💧 CTA 2: `[ Ver guía de hidratación ]` (`evaluate-hydration` / Escala Armstrong).
4. **Comida de Placer (`eatingReason === "placer"`):**  
   * 🍕 CTA 1: `[ ¿Cómo está tu nivel de saciedad? ]` (`check-satiety`).
   * ⏱️ CTA 2: `[ ¿A qué ritmo comiste hoy? ]` (`check-eating-pace`) o `[ Desmitificar con Swipe Flash ]`.
5. **Comida Social (`eatingReason === "social"`):**  
   * 🤝 CTA 1: `[ Ver guía de hidratación de apoyo ]` o `[ La Ruleta del Chef ]`.
   * CTA 2: Silencio respetuoso para no interrumpir la sobremesa.
6. **Comida de Rutina con Oportunidad Pedagógica (~33% de los casos):**  
   * 🧩 CTA 1: `[ Ideas para balancear tu próxima comida ]` (`balance-next-meal`).
   * 🎮 CTA 2: `1 Minijuego Interactivo Oportuno` (ej. `El Emparejador`, `El Raspa y Descubre`, o `El Dial Háptico`).
7. **Plato Completo / Denso en Nutrientes (Tier Alto):**  
   * 🔬 CTA 1: `[ Ver sinergia de este plato ]` (`plate-synergy`).
   * 💧 CTA 2: `[ Ver guía de hidratación ]` (`evaluate-hydration` / Escala Armstrong).

---

## 📱 6. Resolución In-Place de los Widgets (Sin Modales Bloqueantes)

Todos los CTAs se abren **in-place dentro de la misma tarjeta del Timeline**, respetando el estándar frictionless:

* **Pausa de respiración (1 min):** Despliega un anillo SVG animado (`Inhalá 4s` / `Exhalá 6s`) con temporizador de 60 segundos y botón Play/Pausa.
* **Escala Armstrong de Hidratación:** Despliega la paleta compacta de 8 tonos de orina (`#FEFCE8` a `#713F12`) y las 3 zonas clínicas para auto-observación sin registros obligatorios.
* **Nivel de Saciedad / Digestión:** Despliega píldoras de 1 toque (`Liviana` / `Confortable` / `Pesadez`) con confirmación háptica inmediata.
* **Minijuegos Táctiles:** Duran de 3 a 8 segundos, cuentan con micro-vibraciones hápticas (`navigator.vibrate`) y sonidos sintetizados con Web Audio API (campana senoidal), cerrándose automáticamente al finalizar.

---

## 🎯 7. Ejemplos Reales End-to-End

### Ejemplo 1: Almuerzo de Rutina — Pechuga a la plancha con batata y brócoli
* **Contexto:** Chip `Rutina`, 13:30 hs.
* **Dial:** `ALTO` (Azul informativo).
* **Vectores en Tabla:**
  * `Procesamiento` ➔ **Mínimamente procesado ✓**
  * `Proteína` ➔ **Magra y completa ✓**
  * `Carbohidratos` ➔ **Complejos ✓**
  * `Fibra` ➔ **Buena fuente ✓**
* **Coach Insight (Gemini):**  
  *«Una combinación noble que aporta proteínas de alto valor biológico y almidones lentos. La fibra del brócoli estabiliza la liberación de energía en tus músculos para mantenerte enfocado toda la tarde sin pesadez digestiva.»*
* **CTAs seleccionados por el Engine:**  
  1. `[ Ver sinergia de este plato ]` (Explica la absorción de hierro y carotenoides).  
  2. `[ Ver guía de hidratación ]` (Chequeo de Escala Armstrong).

### Ejemplo 2: Cena de Confort — Sopa caliente de calabaza con fideos
* **Contexto:** Chip `Confort`, 20:30 hs.
* **Dial:** `MEDIO` (Azul informativo).
* **Vectores en Tabla:**
  * `Procesamiento` ➔ **Mínimamente procesado ✓**
  * `Carbohidratos` ➔ **Complejos ✓**
* **Coach Insight (Gemini):**  
  *«Un plato cálido pensado para reconfortar el cuerpo y regalarse un momento de calma. Comer sin prisa y respirar pausado al terminar ayudará a que tu sistema digestivo asimile los nutrientes con total ligereza antes del descanso.»*
* **CTAs seleccionados por el Engine (Blindaje Anti-TCA / Confort):**  
  1. `[ Iniciar pausa de respiración (1 min) ]` *(Cero minijuegos, cero cuestionarios).*
