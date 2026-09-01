<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

# 🎨 Reglas Oficiales de Diseño UI/UX — Shakerfy / Studio Pulse Smart

## 1. 🥇 Estándar Mandatorio de Componentes (Shadcn/ui & Radix UI)

- **TODOS** los componentes de interfaz deben construirse o extenderse utilizando **OBLIGATORIAMENTE** la librería `Shadcn/ui` y las primitivas accesibles de `Radix UI` (`@radix-ui/*`).
- Prohibido crear modales, desplegables, tooltips, pestañas, diálogos o dropdowns desde cero con `divs` nativos si ya existe la primitiva oficial en Shadcn/ui o Radix UI.
- Cualquier nuevo componente que requiera interactividad debe envolver los primitivos de Shadcn/ui (`Dialog`, `DropdownMenu`, `Select`, `Tabs`, `Accordion`, `Popover`, `Tooltip`, etc.).

## 2. 📐 Grilla Simétrica & Alineación Rígida de 2 Columnas

- En vistas detalladas (Detalle de Miembro, Detalles de Clase, etc.), usar grilla simétrica de 2 columnas de igual ancho:
  `grid grid-cols-1 md:grid-cols-2 gap-5 w-full items-stretch`
- Misma altura vertical en tarjetas contiguas: `h-full flex flex-col justify-between`.

## 3. 🧘 Estética Plana con Elevación al Hover (Blog Card Hover)

- Las tarjetas nacen **planas** por defecto (`border border-border bg-card shadow-xs rounded-3xl p-5`).
- Al hacer hover o seleccionar, se elevan 4px (`hover:-translate-y-1`), aumentan contraste de borde (`hover:border-foreground/30`) y proyectan sombra suave (`hover:shadow-lg transition-all duration-300`).

## 4. 🧹 Cero Emojis & Tipografía Minimalista

- **Sin Emojis** en títulos, botones o modales de la interfaz de administración.
- Encabezados de tarjetas en mayúsculas pequeñas, negrita, espaciadas y gris plomo:
  `text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80`
- Títulos de marca en la barra lateral con la tipografía **Bebas Neue** (`font-bebas`).

## 5. 🎨 Sistema de Fondos e Iluminación Sutil

- **Dashboard Admin**: Fondo gris sutil (_off-white/slate_) (`bg-slate-50/70 dark:bg-background`), logrando que las tarjetas resalten limpiamente.
- **Landing Page & Perfil del Gimnasio**: Conservan su fondo blanco puro (`bg-background`).
- **Bases de Modales Opacas**: Los contenedores de modales usan base sólida para no transparentar el backdrop oscurecido.

## 6. 🌫️ Overlay de Modales Suave

- Uso de `bg-black/40 backdrop-blur-xs` en los overlays de diálogos para un enfoque suave sin fondos negros agresivos.

## 7. 📜 Scrollbars Personalizadas (`custom-scrollbar`)

- Utilizar la clase `.custom-scrollbar` (barra de 7px, redondeada _pill radius_ `9999px`, pista transparente) y `overflow-hidden` en el contenedor para evitar scrollbars toscas del navegador.

## 8. 🧠 Reglas de IA Ética, Responsable y Nutricional (Shakerfy AI)

- **Reconocimiento Exclusivo de "Shake for AI":** La acción de agitar el dispositivo (_Shake for AI_) está reservada **exclusivamente** para generar sugerencias nutricionales contextuales del momento.
- **Integración del Perfil Biométrico:** Los algoritmos deben calcular los requerimientos basales tomando estrictamente las variables del perfil (Edad, Sexo, Altura, Peso, Nivel de Actividad y Objetivo Biológico).
- **Contexto Temporal e Hitos Solares (Latitud/Longitud):** Las sugerencias calculan astronómicamente la declinación solar y el ángulo horario según la latitud y longitud del usuario (posicionando con precisión la fase solar: _Pre-Amanecer, Post-Amanecer, Cenit/Mediodía Solar, Ocaso con Corte de Cafeína, y Ventana Regenerativa Nocturna_).
- **Respeto a la Alacena y Preferencias Reales (Zero-Waste):** La IA únicamente sugiere combinaciones basadas en los alimentos marcados como activos en la alacena del usuario y bajo el formato de su elección (Recetas paso a paso o Porciones de mano).
- **Nutrición Consciente sin Caloric-Counting Punitivo:** La IA jamás muestra números calóricos restrictivos ni genera ansiedad alimentaria; comunica la recomendación a través de **Porciones de Mano (Palma, Puño, Pulgar, Cuenco)** y los **7 Vectores Nutricionales** (Procesamiento, Fibra, Proteína, Azúcar, Grasas, Granos, Sodio).

## 9. 🛡️ Bioética, Prevención de TCA y Blindaje Legal en IA (Anti-Orthorexia Framework)

- **Cero Moralidad Alimentaria & Anti-Culpa:** Prohibido el uso de términos punitivos (_"pecado"_, _"comida trampa / cheat meal"_, _"compensar"_, _"quemar calorías"_, _"alimento prohibido"_, _"engordar"_). Ningún alimento se cataloga como "bueno" o "malo".
- **Enfoque de Adición sobre Restricción:** Las sugerencias de mejora siempre proponen qué sumar (ej. hidratación de apoyo, porciones de fibra o proteína en la siguiente ingesta) en lugar de censurar o exigir la eliminación de alimentos.
- **Fit del Momento (Renderizado Condicional por Excepción):** Los badges contextuales (_"Ideal Post-Entreno"_, _"Digestión Nocturna"_) solo se renderizan cuando existe una oportunidad biológica o una consideración fisiológica genuina; en comidas habituales sin evento especial, se mantiene el silencio visual para evitar saturación y sobre-análisis.
- **Foco en Fisiología Somática:** La comunicación se centra exclusivamente en variables de confort y rendimiento (energía sostenida, saciedad, confort digestivo, recuperación muscular y descanso nocturno), nunca en peso corporal, porcentaje graso o estética punitiva.
- **Blindaje Legal & Scope of Practice:** La IA opera estrictamente como un asistente educativo y de hábitos de bienestar. No emite diagnósticos médicos, no prescribe dietoterapia clínica para patologías y mantiene visible el descargo de responsabilidad legal (_Educational & Wellness Disclaimer_).

## 10. ⚡ Estándar de Interacción "Frictionless & Gesture-First"

- **Regla de los 2 Toques (Two-Tap Rule):** Ninguna acción cotidiana o frecuente (anotar peso, marcar una serie, registrar un alimento, cambiar un estado) puede requerir más de 2 toques desde la vista activa. Prohibido anidar menús dentro de menús para flujos de registro diario.
- **Edición In-Place Obligatoria:** Los campos simples y editables (repeticiones, peso/carga, minutos, porciones, notas) deben ser **inputs nativos directos** dentro de la tarjeta (`[ 12 reps ] • [ 24 kg ]`). Prohibido abrir diálogos modales o popups solo para modificar valores numéricos.
- **Gestos Nativos Primero (Gesture-First):**
  - *Swipe-to-Delete:* Toda eliminación en listas debe soportar deslizamiento horizontal a la izquierda (`diffX < -70px`) revelando fondo rojo destructivo (`bg-rose-600`) con respuesta háptica inmediata.
  - *Live Drag-to-Reorder:* Todo reordenamiento debe mutar la posición en tiempo real (`onDragEnter` live layout shifting), haciendo que los demás elementos se desplacen fluidamente mientras se arrastra.
  - *Swipe-down to Dismiss:* Los paneles inferiores, modales y drawers deben poder cerrarse deslizándolos hacia abajo.
  - *Shake for AI:* Reservado exclusivamente para disparar la recomendación nutricional biológica contextual.
- **Ergonomía de la Zona del Pulgar (Thumb-Zone Priority):** Las acciones primarias clave (iniciar, finalizar, guardar sesión, escanear) deben ubicarse en una barra flotante fija al pie (`fixed bottom-6 z-40`). Las áreas táctiles mínimas para botones de acción deben ser de al menos **44×44 px**.
- **Filosofía "Deshacer" sobre Alertas Bloqueantes (Undo-First):** Al eliminar o realizar acciones reversibles rutinarias, se ejecuta la acción de inmediato y se ofrece un Toast con botón "Deshacer" (4s). Prohibido interrumpir al usuario con diálogos de confirmación para acciones cotidianas.
- **Píldora de Acciones Secundarias (Action Pill Pattern):** Cuando un elemento requiera múltiples acciones auxiliares (ej. cambiar, duplicar, eliminar), deben agruparse en una cápsula compacta de iconos (`rounded-full bg-secondary/50 border border-border/70 p-1 gap-1`), sin textos redundantes.
- **Feedback Multisensorial Obligatorio:** Integrar micro-vibraciones hápticas (`navigator.vibrate`) en swaps, eliminaciones y confirmaciones, y síntesis sonora con Web Audio API al completar temporizadores o descansos (sin dependencias de archivos `.mp3` pesados).
- **Auto-Guardado Silencioso:** Los cambios en campos de texto, selectores y switches se persisten automáticamente al cambiar de valor; el usuario nunca debe buscar un botón de "Guardar cambios".
