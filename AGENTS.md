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
* **TODOS** los componentes de interfaz deben construirse o extenderse utilizando **OBLIGATORIAMENTE** la librería `Shadcn/ui` y las primitivas accesibles de `Radix UI` (`@radix-ui/*`).
* Prohibido crear modales, desplegables, tooltips, pestañas, diálogos o dropdowns desde cero con `divs` nativos si ya existe la primitiva oficial en Shadcn/ui o Radix UI.
* Cualquier nuevo componente que requiera interactividad debe envolver los primitivos de Shadcn/ui (`Dialog`, `DropdownMenu`, `Select`, `Tabs`, `Accordion`, `Popover`, `Tooltip`, etc.).

## 2. 📐 Grilla Simétrica & Alineación Rígida de 2 Columnas
* En vistas detalladas (Detalle de Miembro, Detalles de Clase, etc.), usar grilla simétrica de 2 columnas de igual ancho:
  `grid grid-cols-1 md:grid-cols-2 gap-5 w-full items-stretch`
* Misma altura vertical en tarjetas contiguas: `h-full flex flex-col justify-between`.

## 3. 🧘 Estética Plana con Elevación al Hover (Blog Card Hover)
* Las tarjetas nacen **planas** por defecto (`border border-border bg-card shadow-xs rounded-3xl p-5`).
* Al hacer hover o seleccionar, se elevan 4px (`hover:-translate-y-1`), aumentan contraste de borde (`hover:border-foreground/30`) y proyectan sombra suave (`hover:shadow-lg transition-all duration-300`).

## 4. 🧹 Cero Emojis & Tipografía Minimalista
* **Sin Emojis** en títulos, botones o modales de la interfaz de administración.
* Encabezados de tarjetas en mayúsculas pequeñas, negrita, espaciadas y gris plomo:
  `text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80`
* Títulos de marca en la barra lateral con la tipografía **Bebas Neue** (`font-bebas`).

## 5. 🎨 Sistema de Fondos e Iluminación Sutil
* **Dashboard Admin**: Fondo gris sutil (*off-white/slate*) (`bg-slate-50/70 dark:bg-background`), logrando que las tarjetas resalten limpiamente.
* **Landing Page & Perfil del Gimnasio**: Conservan su fondo blanco puro (`bg-background`).
* **Bases de Modales Opacas**: Los contenedores de modales usan base sólida para no transparentar el backdrop oscurecido.

## 6. 🌫️ Overlay de Modales Suave
* Uso de `bg-black/40 backdrop-blur-xs` en los overlays de diálogos para un enfoque suave sin fondos negros agresivos.

## 7. 📜 Scrollbars Personalizadas (`custom-scrollbar`)
* Utilizar la clase `.custom-scrollbar` (barra de 7px, redondeada *pill radius* `9999px`, pista transparente) y `overflow-hidden` en el contenedor para evitar scrollbars toscas del navegador.

