# THE WELLNESS FACE

# Reglas definitivas del motor de análisis nutricional y CTAs

## 1. Principio central

The Wellness Face no debe evaluar:

> “¿Esta comida fue buena o mala?”

Debe determinar:

> **“¿Qué características tiene esta comida y qué información puede ser útil para el usuario?”**

En Wellness Mode:

> **Entender.**

En Athlete Mode:

> **Entender + cuantificar + contextualizar respecto al objetivo.**

---

# 2. Arquitectura del análisis

Cada comida pasa por cinco capas:

```text
COMIDA ESCANEADA
        ↓
IDENTIFICACIÓN
        ↓
ANÁLISIS NUTRICIONAL
        ↓
CONTEXTO DEL USUARIO
        ↓
MODO
   ↙        ↘
WELLNESS   ATHLETE
   ↓          ↓
Insight     Insight
   ↓          ↓
CTA        Objetivo / progreso
```

La información nutricional base es la misma.

Lo que cambia es **cómo se presenta y qué acciones puede desencadenar**.

---

# 3. WELLNESS MODE

Wellness Mode debe funcionar como:

> **Nutrition Awareness**

No como un tracker.

El usuario puede saber qué contiene una comida, pero la aplicación no convierte esa información en una obligación diaria.

### Visible

**VALOR NUTRICIONAL**

**Alto / Medio / Bajo**

* características nutricionales.

Por ejemplo:

* Mínimamente procesado
* Alto en fibra
* Alto en proteína
* Sin azúcar añadido

### No visible

* calorías acumuladas
* calorías restantes
* macros acumulados
* objetivo diario
* porcentaje de objetivo cumplido
* “te faltan X gramos”
* “te pasaste de X”
* progreso diario cuantitativo

Esto es importante porque **el usuario recibe información sin entrar necesariamente en un ciclo de control.**

---

# 4. ATHLETE MODE

Athlete Mode mantiene exactamente la misma capa cualitativa:

**VALOR NUTRICIONAL**

**Alto / Medio / Bajo**

**Características**

y agrega:

**Calorías**

**Proteína**

**Carbohidratos**

**Grasas**

**Fibra**

y el seguimiento diario correspondiente.

Así no creás una experiencia completamente distinta: simplemente **activás una capa cuantitativa adicional**.

---

# 5. Regla para “VALOR NUTRICIONAL”

Esta es una de las reglas más importantes.

No recomiendo que **“Bajo” signifique “comida poco saludable”**.

El score debe representar la **cantidad de características nutricionalmente favorables que el sistema puede identificar**, no la calidad moral de la comida.

Por ejemplo, podría considerar:

* densidad nutricional
* proteína
* fibra
* variedad
* grasas insaturadas
* micronutrientes relevantes
* grado de procesamiento
* azúcares añadidos
* sodio

Pero nunca:

> “Healthy score”

ni:

> “Good food score”.

---

# 6. Regla para el score

El score debe ser **contextual y explicable**.

Si aparece:

> **Bajo**

el usuario debería poder entender por qué mediante los indicadores.

Por ejemplo:

**Valor nutricional — Bajo**

* Alto en azúcar añadido
* Bajo en fibra
* Bajo en variedad

No:

> “Bajo porque es una mala comida.”

La aplicación describe **características**, no emite una sentencia.

---

# 7. Regla de no moralización del score

Nunca usar:

> excelente  
> bueno  
> malo  
> culpable  
> limpio  
> indulgente  
> cheat  

El score puede ser:

**Alto / Medio / Bajo**

pero la explicación debe ser neutral.

Incluso consideraría utilizar visualmente:

**Mayor / Moderado / Menor**

si descubrís durante testing que “Bajo” se interpreta demasiado como desaprobación.

---

# 8. Regla de los indicadores

Los indicadores que aparecen junto al score deben cumplir una condición:

> **Cada indicador debe representar una propiedad observable de la comida.**

### Buenos ejemplos

**Mínimamente procesado**

**Alto en fibra**

**Alto en proteína**

**Sin azúcar añadido**

**Fuente de grasas insaturadas**

**Amplia variedad de ingredientes**

### Evitar

**Muy saludable**

**Excelente elección**

**Comida perfecta**

**Superfood**

**Clean**

Porque mezclan información y juicio.

---

# 9. Regla de máximo de indicadores

No mostrar una lista interminable.

Recomiendo:

**3–4 indicadores máximo.**

El motor debe elegir los más relevantes y confiables.

Ejemplo:

```text
✓ Mínimamente procesado
✓ Alto en fibra
✓ Alto en proteína
✓ Sin azúcar añadido
```

No:

```text
✓ Protein
✓ Fiber
✓ Vitamin C
✓ Iron
✓ Magnesium
✓ Potassium
✓ Calcium
✓ Antioxidants
✓ Low sodium
✓ Unsaturated fat
✓ Whole foods
...
```

La interfaz pierde jerarquía.

---

# 10. Regla de indicadores positivos y negativos

No necesitás crear dos listas:

**GOOD**

vs.

**BAD**

Podés mezclar características de distintos tipos, siempre que el lenguaje permanezca descriptivo.

Ejemplo:

> Mínimamente procesado  
> Alto en fibra  
> Alto en proteína  
> Alto en sodio  

Eso comunica muchísimo sin crear una clasificación moral explícita.

---

# 11. Regla de ausencia

La ausencia de un atributo no debe presentarse automáticamente como una deficiencia.

Ejemplo:

Si no detectás fibra:

❌

> “Low fiber — you need fiber.”

Preferible:

> **“No significant source of fiber detected.”**

Y sólo generar un CTA si realmente existe contexto suficiente para que sea útil.

---

# 12. Regla de precisión

Una característica sólo aparece si existe suficiente confianza.

Por ejemplo:

Si la IA no puede identificar si una salsa tiene azúcar añadido:

❌

> “Sin azúcar añadido”

Debe omitirla o mostrarla como estimación cuando corresponda.

Esto es especialmente importante porque estas etiquetas pueden adquirir mucho peso psicológico para el usuario.

---

# 13. Regla de no sobreinterpretación

El análisis de una foto no debe convertirse en una conclusión sobre la dieta completa.

Ejemplo:

El usuario come una pizza.

No decir:

> “Your diet is lacking vegetables.”

Una fotografía sólo permite evaluar **esa comida**.

---

# 14. Regla de contexto

Cuando existe historial suficiente, el motor puede pasar de:

> **“Esta comida contiene poca fibra.”**

a:

> **“Today, fiber has appeared less often across your meals.”**

Pero sólo cuando existe suficiente información.

Una sola comida no representa el patrón del usuario.

---

# 15. Regla de Wellness Mode: sin objetivo

En Wellness Mode no existe:

> “deberías llegar a X”

Por eso los CTAs deben ser principalmente:

### Learn

**See Insight**

### Explore

**Explore Meal Ideas**

### Discover

**Explore Ingredients**

### Reflect

**See Today's Pattern**

### Context

**Add What Else You Ate**

No:

> “Hit your target.”

---

# 16. Regla de Athlete Mode: sí puede hablar de objetivos

Athlete Mode sí puede utilizar:

> **53 / 150g Protein**

> **630 / 2,370 kcal**

> **26 / 280g Carbs**

Pero la app no debe transformar estos valores en una nota.

### Correcto

> “You’re currently at 63% of your calorie target.”

### Incorrecto

> “You're doing great.”

o:

> “You’re falling behind.”

---

# 17. Regla de progreso sin juicio

En Athlete:

**Objetivo ≠ aprobación**

**Objetivo ≠ fracaso**

El sistema informa la relación con el objetivo.

No evalúa emocionalmente al usuario.

---

# 18. Regla anti-compensación

Máxima prioridad en ambos modos.

Está prohibido generar CTAs como:

> Burn this meal

> Exercise to offset calories

> Skip your next meal

> Eat less later

> Compensate tomorrow

> You have to make up for this

> Earn your dinner

Especialmente cuando se activa a partir de calorías o macros.

---

# 19. Regla de ejercicio

Nunca convertir:

**calorías ingeridas ↔ calorías gastadas**

en una transacción.

Athlete Mode puede utilizar actividad para contexto:

> “This meal was logged after your strength session.”

Pero no:

> “Your workout burned 500 kcal, so you can eat 500 more.”

---

# 20. Regla de CTA obligatorio

No todas las comidas tienen que producir un CTA.

Tres posibles resultados:

```text
Insight only
```

```text
Insight + CTA
```

```text
Insight + CTA + secondary CTA
```

Pero **nunca generar un botón artificialmente**.

---

# 21. Regla de máximo dos CTAs

Mi recomendación para la interfaz final:

### Principal

**See Insight**

### Secundario

Una acción contextual.

Ejemplo:

**Explore Meal Ideas**

Nada más.

El botón flotante de IA ya funciona como tercera vía de interacción.


---

# 22. Regla de prioridad de CTAs en Wellness

Orden:

```text
1. Comprensión
2. Contexto
3. Exploración
4. Acción práctica
5. Marketplace
```

Por ejemplo:

> Ver insight

gana frente a:

> Chequear hidratación (Escala Armstrong)

si el insight es realmente relevante.

> [!IMPORTANT]
> **Prohibición de conteo volumétrico arbitrario:** Queda prohibido generar CTAs de conteo cuantitativo abstracto ("Registrar 1 vaso", "+250 ml", etc.). La hidratación se evalúa y registra exclusivamente mediante la **Escala Colorimétrica de Armstrong (1 a 8) (Ucol)** validada clínicamente. Todo CTA de hidratación debe orientarse a chequear o registrar el nivel fisiológico según dicha escala.


---

# 23. Regla de prioridad en Athlete

```text
1. Progreso
2. Planificación
3. Contexto
4. Exploración
5. Marketplace
```

Por ejemplo:

> **See Today's Progress**

o:

> **Plan Next Meal**

puede tener prioridad sobre una recomendación genérica.

---

# 24. Regla de Market

The Wellness Face no debe utilizar una supuesta deficiencia nutricional como excusa para vender.

❌

> Low fiber → Buy chia seeds.

✅

> Explore fiber-rich ingredients

Dentro de esa experiencia pueden aparecer:

**frutas**

**verduras**

**legumbres**

**semillas**

**productos disponibles en Market**

De esta manera el Market es una consecuencia de una intención, no el objetivo oculto de la recomendación.

---

# 25. Regla de intención comercial

El Market puede ganar prioridad cuando el usuario expresa intención:

> “Quiero más proteína.”

> “¿Qué puedo comprar para esto?”

> “Busco semillas.”

> “Quiero snacks.”

En ese momento:

**Explore Market**

es totalmente coherente.

---

# 26. Regla anti-TCA de frecuencia

El motor no debe analizar obsesivamente cada interacción.

Por ejemplo:

```text
Comida 1
→ Insight

Comida 2
→ Sin CTA

Snack
→ Insight

Comida 3
→ Explore
```

No:

```text
Cada comida
→ déficit
→ recomendación
→ corrección
→ tarea
```

---

# 27. Regla de repetición

Si el usuario recibe varias veces:

> “Explore fiber-rich foods”

el sistema debe bajar su prioridad.

De lo contrario, la app puede terminar enseñando:

> **“Fibra. Fibra. Fibra. Fibra.”**

y eso justamente genera una atención excesiva sobre un único nutriente.

---

# 28. Regla de diversidad nutricional

El sistema debe rotar entre dimensiones:

**Proteína**

**Fibra**

**Variedad**

**Procesamiento**

**Hidratación**

**Grasas**

**Azúcares añadidos**

**Sodio**

**Timing**

**Satisfacción**

**Recuperación**

No optimizar una única métrica permanentemente.

---

# 29. Regla de modo Wellness: lenguaje

Wellness debe sentirse como:

> **“Aprendé sobre lo que comés.”**

Ejemplos:

> This meal is high in protein and fiber.

> This meal contains several minimally processed ingredients.

> This meal includes a wide variety of foods.

> Explore similar meals.

No:

> You need more protein.

> Make your next meal healthier.

> Balance this meal.

---

# 30. Regla de modo Athlete: lenguaje

Athlete puede ser más preciso:

> This meal adds 53g of protein toward today's target.

> You're currently at 71% of your calorie target.

> You have 42g of protein remaining toward today's goal.

Pero incluso aquí:

> “remaining” describe planificación, no deuda.

---

# 31. Regla específica para tu interfaz actual

Tu card:

> **VALOR NUTRICIONAL — Bajo**

con:

> Mínimamente procesado
> Alto en fibra
> Alto en proteína
> Sin azúcar añadido

es conceptualmente mucho mejor que una escala de:

**Healthy 8/10**

porque muestra **por qué** llegó al resultado.

Pero yo aplicaría una condición:

### El score nunca debe dominar visualmente a la explicación.

El usuario debería recordar:

> “Mi comida tiene estas características.”

y no:

> “Mi comida obtuvo un 4/10.”

---

# 32. Ejemplo — Wellness Mode

### Poke Bowl

**VALOR NUTRICIONAL**

**Alto**

🌿 Mínimamente procesado  
◌ Alto en fibra  
◌ Alto en proteína  
✦ Sin azúcar añadido  

No muestra:

> 630 / 2,370 kcal

No muestra:

> 53 / 150g protein

### Insight

> **This meal combines protein, fiber and a wide variety of ingredients.**

### CTA

**See Insight**

**Explore Meal Ideas**

---

# 33. Ejemplo — Athlete Mode

### Poke Bowl

**VALOR NUTRICIONAL**

**Alto**

🌿 Mínimamente procesado  
◌ Alto en fibra  
◌ Alto en proteína  
✦ Sin azúcar añadido  

↓

**630 kcal**

**Protein 53g**  
**Carbs 26g**  
**Fat 38g**  
**Fiber 18g**  

↓

**53 / 150g protein today**

**630 / 2,370 kcal**

### Insight

> **This meal adds 53g of protein toward today's target.**

### CTA

**See Progress**

**Plan Next Meal**

---

# 34. Ejemplo — comida con menor valor nutricional

## Wellness

**VALOR NUTRICIONAL**

**Bajo**

* Alto en azúcares añadidos
* Bajo en fibra
* Alto en procesamiento

Insight:

> **This meal contains a higher proportion of added sugars and highly processed ingredients.**

CTA:

**Explore Meal Ideas**

No:

> Balance this meal.

---

# 35. Ejemplo — la misma comida en Athlete

**VALOR NUTRICIONAL**

**Bajo**

* Alto en azúcares añadidos
* Bajo en fibra
* Alto en procesamiento

**720 kcal**

**Protein 8g**

**Carbs 92g**

**Fat 31g**

Insight:

> **This meal contributes a larger share of today's carbohydrate intake.**

CTA:

**See Today's Progress**

No:

> Eat less later.

---

# 36. Regla de seguridad emocional

Si el sistema detecta señales de:

* preocupación excesiva por calorías
* registros extremadamente frecuentes
* lenguaje de culpa
* intención de compensación
* preocupación intensa por “comida buena/mala”
* comportamiento obsesivo alrededor del objetivo

entonces debe entrar en un **low-pressure mode**.

Eso significa:

```text
menos CTAs
+
menos objetivos
+
menos optimización
+
más información neutral
```

No aumentar la presión precisamente cuando el usuario parece necesitar menos.

---

# 37. Regla de desacoplamiento

Hay tres cosas que The Wellness Face debe mantener separadas:

### Nutrición

> ¿Qué contiene esta comida?

### Objetivo

> ¿Cómo encaja con mi meta?

### Valor personal

> ¿Estoy haciendo las cosas bien?

La aplicación puede responder las dos primeras.

**Nunca debe responder la tercera.**

---

# 38. Arquitectura técnica definitiva

```text
                    FOOD SCAN
                       ↓
              FOOD IDENTIFICATION
                       ↓
              NUTRITION ENGINE
                       ↓
       ┌───────────────┴────────────────┐
       ↓                                ↓
QUALITATIVE DATA                  QUANTITATIVE DATA
       ↓                                ↓
Processing                       Calories
Fiber                            Protein
Protein                          Carbs
Added sugars                     Fat
Sodium                           Fiber
Variety
       ↓                                ↓
       └───────────────┬────────────────┘
                       ↓
                CONTEXT ENGINE
                       ↓
                  USER MODE
                ↙           ↘
           WELLNESS        ATHLETE
              ↓               ↓
       Awareness layer   Tracking layer
              ↓               ↓
            INSIGHT         INSIGHT
              ↓               ↓
             CTA             CTA
```

Y delante de todo eso:

```text
                SAFETY FILTER
                     ↓
        ┌─────────────────────────┐
        │ No guilt                │
        │ No moral labels         │
        │ No compensation         │
        │ No restriction          │
        │ No overinterpretation   │
        │ No excessive repetition │
        └─────────────────────────┘
```

---

# 39. La regla definitiva de The Wellness Face

> **Wellness Mode helps users understand what they eat without turning nutrition into a daily score.**
>
> **Athlete Mode adds quantitative tracking for users who intentionally want to work toward nutrition and performance goals.**
>
> **Both modes may inform, contextualize and guide — but neither mode should create guilt, reward food morally, or encourage compensation or restriction.**

Y la distinción clave de UX:

### Wellness

**“What is this food like?”**

### Athlete

**“How does this food fit my goal?”**
