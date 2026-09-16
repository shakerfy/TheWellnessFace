# 🧭 El Norte — The Wellness Face

> **Documento vivo de referencia y aprendizaje continuo.**  
> Este archivo resume la brújula estratégica del producto, las decisiones de diseño arquitectónico consolidadas, los errores superados y las mejores prácticas para mantener el código limpio, escalable y sin fricción.

---

## 🎯 1. Visión y Propósito del Producto
* **Nombre de Marca:** *The Wellness Face*
* **Público Objetivo:** Latinoamérica (multidisciplinario: gimnasio tradicional, CrossFit, running, pádel, calistenia, pilates, deportes de combate y hábitos de vida saludable).
* **Propósito:** Unificar en una sola plataforma la **actividad física/clubes**, la **nutrición biológica consciente (sin ansiedad calórica)** y la **recuperación somática guiada por IA**.

---

## 🧠 2. Principios de Bioética y Enfoque Somático (Anti-Orthorexia)
1. **Cero Moralidad Alimentaria:**
   * Prohibido utilizar términos punitivos (*"comida trampa"*, *"pecado"*, *"quemar calorías"*, *"alimento prohibido"*, *"compensar"*). Ningún alimento es intrínsecamente "bueno" o "malo".
2. **Enfoque de Adición sobre Restricción:**
   * La IA siempre sugiere qué **sumar** (ej. hidratación, fibra, proteína de calidad en la siguiente ingesta) en lugar de exigir eliminar alimentos.
3. **Métricas Conscientes:**
   * Uso de **Porciones de Mano (Palma, Puño, Pulgar, Cuenco)** y los **7 Vectores Nutricionales** en lugar del conteo obsesivo de calorías.
4. **Foco en Fisiología Somática:**
   * La comunicación se centra en energía sostenida, digestión ligera, recuperación muscular y calidad del descanso.

---

## 📐 3. Estándares UI/UX y Reglas de Diseño
1. **Mandatorio Shadcn/ui & Radix UI (`@radix-ui/*`):**
   * Todo modal, diálogo, dropdown, tooltip o pestaña debe usar las primitivas accesibles oficiales de Shadcn/ui. Prohibido crear modales o menús interactivos con `divs` nativos reinventados.
2. **Cero Emojis en Textos del Sistema:**
   * Los títulos, botones, badges y encabezados de la interfaz deben mantenerse profesionales y limpios (utilizar íconos vectoriales de `lucide-react`).
3. **Tipografía y Jerarquía:**
   * Encabezados de tarjetas y secciones en mayúsculas pequeñas, negrita y gris plomo:
     `text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80`
   * Títulos principales con contraste nítido y tracking ajustado (`tracking-tight`).
4. **Estética Plana con Elevación al Hover:**
   * Las tarjetas nacen planas: `border border-border bg-card shadow-xs rounded-3xl p-5`.
   * En hover: `hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md transition-all duration-200`.
5. **Grillas Simétricas y Espaciado Coherente:**
   * En vistas de datos, usar grillas simétricas de 2 columnas (`grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4`).
6. **Ecosistema de Acciones Flotantes (FAB):**
   * Un único FAB centralizado en el AI Coach con acciones directas y claras:
      - `Registrar comida` (Camera)
      - `Registrar actividad` (Activity)
      - `Registrar hidratación` (Droplet)
      - `Escaneo corporal` (Scan)

---

## ⚠️ 4. Errores Pasados Superados y Malas Prácticas a Evitar

| Error Previo | Causa Raíz | Solución y Práctica Obligatoria |
| :--- | :--- | :--- |
| **Estados y variables huérfanas** | Modificar o quitar vistas dejando `useState` o imports muertos en el archivo. | **Regla Ponytail:** Al eliminar una funcionalidad, hacer grep y purgar inmediatamente todas las variables, librerías no usadas (ej. *recharts*) y handlers asociados. |
| **Duplicación de botones flotantes** | Tener dos FABs o botones fijos superpuestos en móvil. | **Un único punto de interacción:** El FAB principal gestiona todas las acciones rápidas del tab de forma contextual. |
| **Sobrecarga de sliders o micromanagement** | Querer desglosar 20+ músculos o detalles anatómicos innecesarios. | **Mantener los 10 grupos musculares esenciales:** Pecho, Espalda, Espalda Baja, Hombros, Bíceps, Tríceps, Cuádriceps, Isquiotibiales, Glúteos, Abdomen. No abrumar al usuario con tareas de más de 15 segundos. |
| **Mezclar Ajustes de Cuenta en la pantalla de Perfil** | Saturar la pantalla principal de métricas con listas de configuración legal/cuenta. | **Separación clara:** Pantalla de Perfil con tabs de *Analíticas* y *Recuperación*, y un botón de tuerca ⚙ que abre la pantalla dedicada de *Ajustes & Configuración*. |
| **Reinvención de componentes nativos** | Usar divs absolutos con `onClick` para modales. | **Usar Shadcn/ui `Dialog`:** Garantiza accesibilidad (WAI-ARIA), manejo de foco, tecla `Escape` y backdrop suave con `backdrop-blur-xs`. |

---

## ⚙️ 5. Algoritmos y Reglas de Lógica Central

### Algoritmo de Recuperación Muscular (Regla del `< 70%`)
* **80% - 100% (Verde / Óptimo):** Grupo muscular prioritario para alta carga, hipertrofia o fuerza máxima.
* **70% - 79% (Ámbar / Moderado):** Apto para volumen de mantenimiento o trabajo secundario.
* **< 70% (Naranja-Rojo / En Regeneración):** **Excluido automáticamente de la fatiga adicional** (descanso activo o trabajo de movilidad).

---

## 📋 6. Checklist de Calidad antes de Entregar un Cambio
- [ ] **TypeScript estricto:** Compilación limpia sin errores (`npx tsc --noEmit`).
- [ ] **Cero código muerto:** Sin estados, variables ni imports huérfanos.
- [ ] **Accesibilidad:** Primitivas Shadcn/ui para componentes interactivos.
- [ ] **Diseño móvil óptimo:** Sin desbordamientos horizontales ni botones superpuestos.
- [ ] **Tono somático:** Textos educativos, sin moralidad ni exigencias punitivas.
